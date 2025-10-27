<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                게시판 유형
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="this.mixin_common_code_get(this.common_code, 'BORD_TP', '전체')"
                  placeholder="선택하세요"
                  v-model="BOARD_TP"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                제목
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form is-lg"
                  placeholder="검색어 입력"
                  v-model="BOARD_TITLE"
                  @keydown.enter="getGridList(false)"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                등록자
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form is-lg"
                  placeholder="검색어 입력"
                  v-model="BOARD_WRITER"
                  @keydown.enter="getGridList(false)"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                수정자
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form is-lg"
                  placeholder="검색어 입력"
                  v-model="BOARD_EDITOR"
                  @keydown.enter="getGridList(false)"
                />
              </div>
            </div>
            <v-btn class="pl-btn is-icon" @click="getGridList(false)">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body">
        <div class="pl-grid-top">
          <div class="pl-grid-top-left">
            <v-btn class="pl-btn is-icon is-sub" @click="dblClickRow" :disabled="selectedRow.ROW_NUMBER != undefined ? false : true">
              <span class="pl-icon20 document"></span>
              선택항목 상세
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub" @click="regBtn">
              <span class="pl-icon20 circle-plus"></span>
              등록
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub" @click="deleteBtn" :disabled="selectedData.length != 0 ? false : true">
              <span class="pl-icon20 trash"></span>
              삭제
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ gridTotalCnt }})</em> 건</span>
          </div>
        </div>
        <v-data-table
          class="pl-grid has-control"
          style="cursor:pointer;"
          show-select
          :headers="gridDataHeaders"
          :items="gridItems"
          fixed-header
          item-key="ROW_NUMBER"
          height="562px"
          :items-per-page="ROW_PER_PAGE"
          :item-class="isActiveRow"
          hide-default-footer
          :page.sync="page"
          @page-count="pageCount = $event"
          @click:row="rowSelect"
          @dblclick:row="dblClickRow"
          v-model="selectedData"
          no-data-text="등록된 데이터가 없습니다."
        >
        </v-data-table>
        <div class="pl-pager">
          <div class="pl-pager-row">
            <span>페이지당 항목 수</span>
            <v-select
              class="pl-form"
              :value="ROW_PER_PAGE"
              :items="perPage"
              :item-text="toString(ROW_PER_PAGE)"
              @change="ROW_PER_PAGE = parseInt($event, 10);"
            ></v-select>
          </div>
          <v-pagination
            v-model="page"
            :length="pageCount"
            circle
            :total-visible="7">
          </v-pagination>

          <span class="pl-pager-period">
            보기 {{ mixin_getPagePeriod(gridItems, page) }} / {{ gridItems.length }}
            <compo-tooltip-btn
              TitleProp="다음 검색"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 arrow-next-paging"
              TooltipPositionProp="bottom"
              :DisabledProp = "nextDisabled"
              @btnClick="getGridList(true)"
            ></compo-tooltip-btn>
          </span>
        </div>
      </div>
    </div>

    <!-- dialog -->
    <v-dialog
      v-model="dialogRegBoard"
      content-class="dialog-draggable"
      hide-overlay
      :retain-focus="false">
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :headerTitle='HEADER_TITLE'
        @hide="mixin_hideDialog('RegBoard')">
        <template slot="body">
          <v-form ref="form">
            <div class="pl-form-inline-wrap vertical mt-2">
              <div class="pl-form-inline">
                <span class="pl-label">
                  게시 기간
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
<!--                  <div class="pl-calendar-range-form">-->
<!--                    <compo-date-picker-->
<!--                      DateType="dateInput"-->
<!--                      :DateProp.sync="digParams.START_DATE"/>-->
<!--                    <span class="pl-unit">~</span>-->
<!--                    <compo-date-picker-->
<!--                      DateType="dateInput"-->
<!--                      :DateProp.sync="digParams.END_DATE"/>-->
<!--                    <compo-drop-picker-->
<!--                      :StartDateProp.sync="digParams.START_DATE"-->
<!--                      :EndDateProp.sync="digParams.END_DATE"-->
<!--                      :BbsDateProp="flagData.BBS_PROP"-->
<!--                    />-->
<!--                  </div>-->
                  <compo-date-range-picker
                      :StartDayProp.sync="digParams.START_DATE"
                      :EndDayProp.sync="digParams.END_DATE"
                      @startDayChange="mixin_testLog(digParams.START_DATE)"
                      @endDayChange="mixin_testLog(digParams.END_DATE)"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  게시 유형
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    :items="this.mixin_common_code_get(this.common_code, 'BORD_TP')"
                    placeholder="선택하세요"
                    v-model="digParams.BOARD_TP"
                    :rules="detailValidateRules.DATA_TYPE_CD"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  제목
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    v-model="digParams.BOARD_TITLE"
                    :rules="detailValidateRules.EXPSN_ATTR_NM"
                    v-byte-counter="300"
                  />
                </div>
              </div>
              <ckeditor @namespaceloaded="onNamespaceLoaded" v-model="digParams.BOARD_CONTENTS" :config="editorConfig"></ckeditor>
            </div>
            <!-- file grid -->
            <compo-file-grid
              :FilesProp="filelist"
              @addFile="clickAddFiles"
              :DelData="DEL_FILE"
              @input="DEL_FILE = $event"
              @removeFile="removeFile()"
            ></compo-file-grid>
            <input ref="fileUpload" type="file" multiple @change="handleFileUpload" style="display: none" />
          </v-form>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="[mixin_hideDialog('RegBoard'), initSelect()]">닫기</v-btn>
          <v-btn class="pl-btn" @click="expsnAttrValidate">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
name:"MENU_BBS_M0200", //name은 'MENU_' + 파일명 조합
components: {
},
data() {
  return {

    detailValidateRules: {
      EXPSN_ATTR_NM: [
        v => !!v || '제목 은(는) 필수 입력 항목 입니다.',
      ],
      DATA_TYPE_CD: [
        v => !!v || '게시유형을 선택하세요.',
      ],
    },

    // top search 게시글 조회조건
    DROP_ITEMS_01: [],    // 게시글 유형 콤보박스
    BOARD_TP: '',         // 게시글 유형
    BOARD_TITLE: '',      // 게시글 제목
    BOARD_WRITER: '',     // 게시글 등록자
    BOARD_EDITOR: '',     // 게시글 수정자

    // dialog
    HEADER_TITLE: '',
    dialogRegBoard: false,
    DROP_ITEMS_02: [],    // 게시글 유형 콤보박스

    // 추가된 파일리스트
    itemsFile: [],
    uploadNum: 0,

    filelist: [],
    PST_TTL:'',
    PST_ID:'',                //게시물 아이디
    FILE_KEY:'',              //파일키
    DEL_FILE:[],              //컴포넌트 모달에서 가져온 삭제파일정보
    DEL_FILE_LIST:[],         //삭제파일정보

    // digparams (상세조회 data)
    digParams:{
      START_DATE: '',
      END_DATE: '',
      BOARD_TP: '',
      BOARD_TITLE: '',
      BOARD_CONTENTS: '',
    },

    // flag
    flagData: {
      DIG_CHECK: '',
      ATRT_CHECK: '',
      DBL_CHECK: '',
      BBS_PROP: true,
    },

    // grid
    page: 1,
    pageCount: 0,
    perPage: [15,30,50,100],
    ROW_PER_PAGE: 15,
    selectedData: [],      // 그리드 체크박스 값
    pagination:{
      page:1,
      rowsPerPage: 500
    },
    nextDisabled: false,
    gridItems: [],
    selectedRow: {},
    common_code: [],
    gridTotalCnt: 0,

    gridDataHeaders: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px' },
        { text: '제목', value: 'PST_TTL', align: 'left', width: '400px'},
        { text: '첨부파일 개수', value: 'FILE_CNT', align: 'center', width: '120px'},
        { text: '게시판 유형', value: 'PST_TYPE_CD_NM', align: 'left', width: '120px' },
        { text: '등록자', value: 'USER_NAME', align: 'left', width: '120px'},
        { text: '등록일', value: 'REG_DT', align: 'left', width: '120px'},
        { text: '수정자', value: 'EDITOR_NAME', align: 'left', width: '120px'},
        { text: '수정일', value: 'MDFCN_DT', align: 'left', width: '120px'},
        { text: '조회수', value: 'INQ_CNT', align: 'center', width: '120px'},
    ],

    // 상세버튼 / row 더블클릭 / 저장,삭제,조회수증가시 사용하는 전역변수
    commParam:{
      BBS_ID: '1',
      PST_ID: '',
      INQ_CNT: '',
      FILE_GROUP_KEY: '',
    },

    // confirm alert 메시지
    MESSAGE : {
      CONFIRM : {
        REG : {alertDialogToggle: true, msg: '저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.fileGroupKeyUnity, callNo: this.closeMsg}
        , MOD : {alertDialogToggle: true, msg: '수정 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.fileDel, callNo: this.closeMsg}
        , DEL : {alertDialogToggle: true, msg: '삭제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.brdDel, callNo: this.closeMsg}
      },
      ALERT : {
        REG_SUCCESS : {alertDialogToggle: true, msg: '저장 되었습니다.', iconClass: 'is-info', type: 'default'}
        , DEL_SUCCESS : {alertDialogToggle: true, msg: '삭제 되었습니다.', iconClass: 'is-info', type: 'default'}
        , CHECK_OVER : {alertDialogToggle: true, msg: '하나의 항목만 선택하십시오.', iconClass: 'is-caution', type: 'default'} 
        , CHECK_NON : {alertDialogToggle: true, msg: '항목을 선택하십시오.', iconClass: 'is-caution', type: 'default'}
        , CHECK_NON_D : {alertDialogToggle: true, msg: '삭제할 항목을 선택하십시오.', iconClass: 'is-caution', type: 'default'}
        , CHECK_TYPE : {alertDialogToggle: true, msg: '게시유형은(는) 필수입력입니다.', iconClass: 'is-caution', type: 'default'}
        , CHECK_TITLE : {alertDialogToggle: true, msg: '제목은(는) 필수입력입니다.', iconClass: 'is-caution', type: 'default'}
        , CHECK_DATE : {alertDialogToggle: true, msg: '게시기간은(는) 필수입력입니다.', iconClass: 'is-caution', type: 'default'}
        , CHECK_OVER_DATE : {alertDialogToggle: true, msg: '게시기간을 확인하십시오.', iconClass: 'is-caution', type: 'default'}
        , CHECK_UNDER_DATE : {alertDialogToggle: true, msg: '금일 이전의 시작일을 설정할 수 없습니다.', iconClass: 'is-caution', type: 'default'}
        , CHECK_ATRT : {alertDialogToggle: true, msg: '관리자, 센터장 외 게시글 등록이 불가능합니다.', iconClass: 'is-caution', type: 'default'}
        , CHECK_CN_LENGTH : {alertDialogToggle: true, msg: '글자수 제한(4000자)이 초과되었습니다.', iconClass: 'is-caution', type: 'default'}
        , CHECK_TTL_LENGTH : {alertDialogToggle: true, msg: '글자수 제한(300자)이 초과되었습니다.', iconClass: 'is-caution', type: 'default'}
        , ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
      },
      TOAST : {
        REG_SUCCESS: {  msg: '저장 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
        ,DEL_SUCCESS: {  msg: '삭제 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
      },
    },
    
    // ckeditor 속성 조정
    // editorConfig:{
    //   height: '300px'
    // }
  }
},

  watch: {
    filelist(){
      // console.log("filelist",this.filelist);
    }
  },

  computed: {
    ...mapGetters({
      ip_addr: 'userStore/GE_USER_IP_ADDR', // IP
      user_role: "userStore/GE_USER_ROLE", // 사용자ROLE
    }),
  },

  async created() {
    // 공통코드설정
    let codeName = ['BORD_TP'];
    this.common_code = await this.mixin_common_code_get_all(codeName);
  },

  mounted() {
    this.getGridList(false);
  },
  
  methods: {
    onNamespaceLoaded( CKEDITOR ) {
      //CKEditor 외부 플러그인 주입용도.
      this.mixin_CKEDITOR_plugins_addExternal( CKEDITOR );
    },
    //*************************************
    //        파일
    //*************************************
    // 게시글 상세조회시 등록된 파일조회
    async getBoardFiles(){

      if(this.mixin_isEmpty(this.filelist)){
        let sUrl = '/api/board/file-list';
        let postParam = {
          PST_ID: this.commParam.PST_ID,
          FILE_GROUP_KEY: this.commParam.FILE_GROUP_KEY,
          TASK_TYPE_CD: 'bbs',
          BBS_ID: '1'
        }
        let headParam = {
          head: {
          }
        }

        let response = await this.common_postCall(sUrl, postParam, headParam)
        if(!response.HEADER.ERROR_FLAG){
          this.filelist = [];

          for(let i=0; i<response.DATA.length; i++){
            this.filelist.push({
              index : i,
              filename : response.DATA[i].ACTL_FILE_NM,
              filesize : this.formatBytes(response.DATA[i].FILE_SZ),
              download : true,
              count : response.DATA[i].DWNLD_CNT,
              downloadFile: response.DATA[i].ACTL_FILE_NM,
              fileGroupKey: response.DATA[i].FILE_GROUP_KEY,
              fileKey: response.DATA[i].FILE_KEY,
              busiType: response.DATA[i].TASK_TYPE_CD,
              pathType: response.DATA[i].PATH_TYPE_CD,
            })
          }
        }
      }
    },

    // file input
    clickAddFiles() {
      this.$refs.fileUpload.click()
    },
    //실제 파일이 서버에 올라가는 부분
    handleFileUpload(event) {
      const files = event.target.files;

      //파일 제한 체크 (프론트에서 체크하고 업로드 로직 실행x)
      if (files.length > 0 && this.isValidFiles(files)) {
        // 파일 업로드
        this.uploadFiles(files);
      }
    },

    //파일개수 제한(파일개수 체크)
    isValidFiles(files) {
      // 파일 개수 제한을 설정
      const maxFileCount = 5;
      if (files.length > maxFileCount) {
        alert(`최대 ${maxFileCount}개의 파일까지 업로드할 수 있습니다.`);
        return false;
      }
      
      // 업로드 가능 파일 형식 
      // JPG, JPEG, PNG, PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, HWP, HWPX, TXT

      // 파일 크기 및 형식을 설정 (대소문자 구분)
      const allowedFileTypes = [
        'image/jpeg', 'image/png', 'image/jpg', // JPG, JPEG, PNG
        'text/plain', // TXT
        'application/pdf', // PDF
        'application/msword', // DOC
        'application/vnd.ms-excel', // XLS
        'application/vnd.ms-powerpoint', // PPT
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
        'application/vnd.hancom.hwp', 'application/haansofthwp', 'application/x-hwp', // HWP
        'application/vnd.hancom.hwpx', 'application/haansofthwpx' // HWPX
      ];
      
      // mime type 길이 초과 : docx

      const maxFileSize = 5 * 1024 * 1024; // 5MB
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!allowedFileTypes.includes(file.type)) {
          alert('지원하지 않는 파일 형식입니다.');
          return false;
        }
        if (file.size > maxFileSize) {
          alert('파일 크기가 허용 범위를 초과합니다.');
          return false;
        }
      }
      
      return true;
    },

    //파일 업로드
    uploadFiles(files) {
      let busiType = 'bbs';
      let pathType = 'files';
      let uploadUrl = "api/file/"+ busiType +"/"+ pathType +"/uploads";

      //파일 제한 체크 (빽엔드에서 체크 후 업로드 실패)
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        
        formData.append('action', uploadUrl);
        formData.append('method', "post");
        formData.append('custcoId', this.$store.getters['userStore/GE_USER_ROLE'].company.CD);                 //회사구분 : 1은 시스템(가이드)
        formData.append('userfiles', files[i]);           //파일(바이너리)
        formData.append('userId', this.$store.getters['userStore/GE_USER_ROLE'].userId);                   //사용자 ID : 2는 시스템(가이드)

        axios
        .post(uploadUrl, formData, {headers:{Authorization: "bearer " + window.sessionStorage.getItem("token")}})
          .then(response => {
            // 파일 업로드 성공 시 처리
            let leng = response.data.data.length
            for(let n=0;n<leng;n++)
            this.filelist.push({
              index : this.mixin_isEmpty(this.filelist) ? n : this.filelist[this.filelist.length-1].index + 1,
              filename : response.data.data[n].actlFileNm,
              filesize : response.data.data[n].fileSzDisplay,
              download : false,
              count : 0,
              downloadFile: response.data.data[n].actlFileNm,
              fileGroupKey: response.data.data[n].fileGroupKey,
              fileKey: response.data.data[n].fileKey,
            })
          })
          .catch(error => {
            // 파일 업로드 실패 시 처리
            console.error(error);
          });
      }
      // 서버로 파일 업로드 요청을 보냅니다.
    },

    //파일 따로 저장 시 파일 그룹 키 통일 안 됨 =>  강제 파일 그룹 키 통일
    async fileGroupKeyUnity(){
      let arrFileKey = [];
      if(this.filelist.length > 0){
        let leng = this.filelist.length;
        for(let i=0;i<leng;i++){
          arrFileKey.push(this.filelist[i]["fileKey"])
        }
        //게시물 저장
        let sUrl = '/api/board/fileKey-unity/process';
        let postParam = {
          FILE_GROUP_KEY: this.filelist[leng-1]["fileGroupKey"],
          arrFileKey:arrFileKey
        }
        let headParam = {
          head: {
          }
        }

        let resData = await this.common_postCall(sUrl, postParam, headParam)
        if(!resData.HEADER.ERROR_FLAG){
          this.brdSave();
        }
      }else{
        this.brdSave();
      }
    },


    // 파일 단일 삭제
    async fileDelExecute(MSG){
      //게시물 저장
      let sUrl = '/api/board/chat/image-delete';
      let postParam = {
        FILE_KEY : this.FILE_KEY,
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        this.getGridList(false);
        if(MSG != 'NO_MSG'){
          // this.showAlert(this.MESSAGE.ALERT.DEL_SUCCESS);
          this.showToast(this.MESSAGE.TOAST.DEL_SUCCESS);
        }
      }
    },

    // 파일 전체 삭제
    async wholefileDel(item){
      // console.log('item',item);
      let sUrl = '/api/board/file-delete';
      let postParam = {
        FILE_GROUP_KEY : item,
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        // this.getGridList();
        // if(MSG != 'NO_MSG'){
        //   this.showAlert(this.MESSAGE.ALERT.DEL_SUCCESS);
        // }
        // console.log("success");
      }
    },

    //파일 삭제 클릭
    removeFile(){
      // console.log("DEL_FILE", this.DEL_FILE.FILE_LIST);
      for(let i=0;i<this.DEL_FILE.FILE_LIST.length;i++){
        this.DEL_FILE_LIST.push(this.DEL_FILE.FILE_LIST[i]);
      }
    },

    //게시판 수정 시 파일 삭제실행=>단일파일삭제 반복 후 게시물 저장
    fileDel(){
      if(this.DEL_FILE_LIST.length != 0){
        let leng=this.DEL_FILE_LIST.length
        for(let i=0;i<leng;i++){
          this.FILE_KEY = this.DEL_FILE_LIST[i].fileKey
          this.fileDelExecute('NO_MSG');
        }
      }
      this.fileGroupKeyUnity();
    },


    // // 파일크기 포맷
    formatBytes(bytes, decimals = 2) {

      if (bytes === 0) return '0 Bytes';

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      // return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    },

    

    // dialog 초기화
    ufnInit(){
      this.filelist = [];
      this.digParams = {
        START_DATE: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        END_DATE: this.date2099(new Date('2099-12-31')),
        BOARD_TP: '',
        BOARD_TITLE: '',
        BOARD_CONTENTS: '',
      }
    },

    // 등록 버튼 클릭시 end 게시기간 기본값 설정
    date2099(date){
      
      let dateFormat2 = date.getFullYear() +
                '-' + ( (date.getMonth()+1) < 9 ? "0" + (date.getMonth()+1) : (date.getMonth()+1))+
                '-' + ((date.getDate()) <9 ? "0" + (date.getDate()) : (date.getDate()));
      return dateFormat2
    },
    
    // 날짜 포맷
    yyyyMMdd(yyyyMMddHHMISS) {
        
      var formatedDate = "";
      if (!yyyyMMddHHMISS) return "";

      if (yyyyMMddHHMISS.length === 14) {
        formatedDate =
          yyyyMMddHHMISS.substring(0, 4) +
          "-" +
          yyyyMMddHHMISS.substring(4, 6) +
          "-" +
          yyyyMMddHHMISS.substring(6, 8)
        return formatedDate;
      } else {
        return yyyyMMddHHMISS;
      }
    },

    
    // 팝업창 오픈 시 유형 체크
    checkFlag(flag) {

      switch (flag) {
        case 'new':
          this.flagData.DIG_CHECK = true;
          this.HEADER_TITLE = "새 글 등록";
          break;

        case 'modify':
          this.flagData.DBL_CHECK = false;
          this.flagData.DIG_CHECK = false;
          this.HEADER_TITLE = "수정";
          break;

        case 'dblClick':
          this.flagData.DBL_CHECK = true;
          this.flagData.DIG_CHECK = false;
          this.HEADER_TITLE = "수정";
          break;

        default:
          break;
      }
    },

    // 등록 버튼
    regBtn(){
      
      // 권한 체크
      this.atrt();
      if (!this.flagData.ATRT_CHECK){
        return;
      }

      // dialog 초기화
      this.ufnInit();
      // 등록flag
      this.checkFlag("new");
      
      this.mixin_showDialog('RegBoard');
      
      //프로퍼티가 로드전에 호출되는 case가 있음.
      if(this.$refs.form) this.$refs.form.resetValidation();
    },

    // 저장 버튼 validation
    expsnAttrValidate(){
      let fromYear = this.digParams.START_DATE;
      let toYear = this.digParams.END_DATE;
      let now = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
      var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);

      if(!this.detailValidate()) {
        return;
      }else if(this.mixin_isEmpty(fromYear) ||
         this.mixin_isEmpty(this.digParams.END_DATE)) {
        this.showAlert(this.MESSAGE.ALERT.CHECK_DATE);
        return;
      }else if(fromYear < now && this.flagData.DIG_CHECK){
        this.showAlert(this.MESSAGE.ALERT.CHECK_UNDER_DATE);
        return;
      }else if((fromYear.replace(/-/gi, '') > toYear.replace(/-/gi, '')) || (toYear < now)) {
        this.showAlert(this.MESSAGE.ALERT.CHECK_OVER_DATE);
        return;
      }else if(!regex.test(fromYear) || !regex.test(toYear)){
        this.showAlert(this.MESSAGE.ALERT.CHECK_OVER_DATE);
        return;
      }else if(this.digParams.BOARD_CONTENTS.length > 4006){ // 내용 글자수 제한(실제 글자수 3998자 이상일 경우 제한 - ckeditor)
        this.showAlert(this.MESSAGE.ALERT.CHECK_CN_LENGTH);
        return;
      }else if(this.digParams.BOARD_TITLE.length > 300){ // 제목 글자수 제한(300자 제한)
        this.showAlert(this.MESSAGE.ALERT.CHECK_TTL_LENGTH);
        return;
      }
      
      if(this.flagData.DIG_CHECK){
        this.showAlert(this.MESSAGE.CONFIRM.REG);
      }else{
        this.showAlert(this.MESSAGE.CONFIRM.MOD);
      }
    },

    //validate check
    detailValidate () {
      return this.$refs.form.validate();
    },
    
    //*************************************
    //        게시글 신규 등록 및 수정
    //*************************************
    async brdSave() {
      let leng = this.filelist.length;
      let fileGroupKey = this.mixin_isEmpty(this.filelist) ? null : this.filelist[leng-1]["fileGroupKey"];
      
      // 게시글 수정인 경우 더블클릭, 상세버튼 구분
      if(!this.flagData.DIG_CHECK){
        if(!this.flagData.DBL_CHECK){
          this.PST_ID = this.selectedData[0].PST_ID;
        }else{
          this.PST_ID = this.commParam.PST_ID;
        }
      }

      let URLData = '/api/board/boardUpsert';
      let postParam = {
        RGTR_IP : this.$store.getters['userStore/GE_USER_IP_ADDR'] // IP
        , PST_ID : this.PST_ID // 게시글ID - 없으면 게시글 신규 등록, 있으면 수정
        , BBS_ID : '1' // 게시판ID
        , PSTG_BGNG_DT : this.digParams.START_DATE                  // 게시시작일시
        , PSTG_END_DT : this.digParams.END_DATE                     // 게시종료일시
        , PST_TYPE_CD : this.digParams.BOARD_TP                     // 게시물유형코드
        , PST_TTL : this.digParams.BOARD_TITLE                      // 게시물제목
        , PST_CN : this.restoreXSS(this.digParams.BOARD_CONTENTS)   // 게시물내용
        , FILE_GROUP : fileGroupKey                                 // 파일그룹키
        , FILE_GROUP_KEY : fileGroupKey
        , FLAG_DATA : this.flagData.DIG_CHECK                       // true || false
      }

      let headParam = {
        head : {}
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        // this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS);
        this.showToast(this.MESSAGE.TOAST.REG_SUCCESS);
        this.closeMsg();
        // setTimeout(() => {
        //   this.$store.commit("alertStore/hideAlert");
        // }, 2000);
        this.selectedData = [];
        this.getGridList(false);
        this.mixin_hideDialog('RegBoard');

        this.$eventBus.$emit('reloadBrdList', this.digParams.BOARD_TP);
      }
    },

    // 삭제 버튼
    deleteBtn(){

      // 권한 체크
      this.atrt();
      if (!this.flagData.ATRT_CHECK){
        return;
      }
      
      // 선택 row 개수 확인
      if(this.mixin_isEmpty(this.selectedData)){
        this.showAlert(this.MESSAGE.ALERT.CHECK_NON);
        return;
      }else if(this.selectedData.length > 1){
        this.showAlert(this.MESSAGE.ALERT.CHECK_OVER);
        return;
      }
      this.showAlert(this.MESSAGE.CONFIRM.DEL);
    },

    //*************************************
    //        삭제
    //*************************************
    async brdDel() {
      
      if(!this.mixin_isEmpty(this.selectedData[0].FILE_GROUP_KEY)){
        this.wholefileDel(this.selectedData[0].FILE_GROUP_KEY);
      }

      this.commParam.BBS_ID = this.selectedData[0].BBS_ID;
      this.commParam.PST_ID = this.selectedData[0].PST_ID;
      
      let URLData = '/api/board/boardDelete';
      let postParam = {
        BBS_ID : this.commParam.BBS_ID // 게시판ID
        , PST_ID : this.commParam.PST_ID // 게시글ID
      }

      let headParam = {
        head : {
          SERVICE: 'board.boardDelete'
          , METHOD: 'delete'
          , HEADER_TYPE: 'BIZ_SERVICE'
        }
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        // this.showAlert(this.MESSAGE.ALERT.DEL_SUCCESS);
        this.showToast(this.MESSAGE.TOAST.DEL_SUCCESS);
        this.closeMsg();
        // setTimeout(() => {
        //   this.$store.commit("alertStore/hideAlert");
        // }, 2000);
        this.selectedData = [];
        this.getGridList(false);
      }
    },

    //*************************************
    //        그리드 목록 조회
    //*************************************
    async getGridList(next) {
      
      //다음버튼 클릭 유무
      if (!next){
        this.pagination.page = 1; //페이징 처리 초기화
        this.selectedData = [];
        this.gridTotalCnt = 0;
      }

      let URLData = '/api/board/selectBoardList';
      let postParam = {
        PST_TYPE_CD : this.BOARD_TP,                                      // 게시판 유형
        PST_TTL : this.BOARD_TITLE,                                       // 제목
        USER_NM : this.BOARD_WRITER,                                      // 등록자
        EDITOR_NM : this.BOARD_EDITOR,                                    // 수정자
        BOARD_LIST_FROM : true,
      }

      let headParam = {
        head : {
          PAGING: 'Y',
          ROW_CNT: this.pagination.rowsPerPage,
          PAGES_CNT: this.pagination.page
        }
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        if(next){
          // 다음검색
          let tempDataText = response.DATA;
          let idx = this.gridItems.length + 1;
          for(let i in tempDataText){
            tempDataText[i]["ROW_NUMBER"]= idx++;
          }
          this.gridItems = [...this.gridItems, ...tempDataText];
          
        }else{
          // 조회
          this.gridItems = response.DATA;
        }
        // 전체 건수
        if(this.gridItems.length > 0) this.gridTotalCnt = response.DATA[0].TWB_PAGING_TOT_COUNT;

        // 다음검색 버튼 활성화 여부
        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false // 버튼 활성화
          }else{
            this.nextDisabled = true  // 버튼 비활성화
          }
        }

        this.pagination.page += 1;
        // this.page=1;
      }
    },

    //*************************************
    //        선택 항목 상세 조회
    //*************************************
    async getPstDetail(item) {

      let URLData = '/api/board/selectPstDetail';
      let postParam = {
        PST_TYPE_CD : item.PST_TYPE_CD,
        BBS_ID : item.BBS_ID,
        DETAIL_PST_ID : item.PST_ID,
        PST_ID : item.PST_ID,

      }

      let headParam = {
        head : {
        }
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.getExpsnAttrSelect(response.DATA[0]);
        this.increaseCnt();
      }
    },
/*
    //*************************************
    //        선택항목 상세 + 조회수 증가
    //*************************************
    detailBtn(){
      
      // console.log('this.selectedData[0]', this.selectedData[0]);
      // 수정flag
      this.checkFlag("modify");

      // 선택 row 개수 확인
      if(this.mixin_isEmpty(this.selectedData)){
        this.showAlert(this.MESSAGE.ALERT.CHECK_NON);
        return;
      }else if(this.selectedData.length > 1){
        this.showAlert(this.MESSAGE.ALERT.CHECK_OVER);
        return;
      }

      // 데이터 바인딩
      this.digParams.START_DATE = this.yyyyMMdd(this.selectedData[0].PSTG_BGNG_DT); // 게시시작일
      this.digParams.END_DATE = this.yyyyMMdd(this.selectedData[0].PSTG_END_DT); // 게시종료일
      this.digParams.BOARD_TP = this.selectedData[0].PST_TYPE_CD; // 게시유형
      this.digParams.BOARD_TITLE = this.selectedData[0].PST_TTL; // 게시글제목
      this.digParams.BOARD_CONTENTS = this.selectedData[0].PST_CN; // 게시글내용

      this.commParam.BBS_ID = this.selectedData[0].BBS_ID;
      this.commParam.PST_ID = this.selectedData[0].PST_ID;      
      this.commParam.INQ_CNT = this.selectedData[0].INQ_CNT;
      this.commParam.FILE_GROUP_KEY = this.selectedData[0].FILE_GROUP_KEY;

      if(!this.mixin_isEmpty(this.commParam.FILE_GROUP_KEY)){
        this.getBoardFiles();
      }else{
          this.filelist = [];
      }

      // 팝업 호출
      this.mixin_showDialog('RegBoard');

      // 조회수 증가함수 호출
      this.increaseCnt();
    },
*/
    
    // 조회수 증가
    async increaseCnt(){
      
      let URLData = '/api/board/increaseCnt';
      let postParam = {
        BBS_ID : '1' // 게시판ID
        , PST_ID : this.commParam.PST_ID // 게시글ID
        , INQ_CNT : this.commParam.INQ_CNT // 조회수
      }

      let headParam = {
        head : {
          SERVICE: 'board/increaseCnt'
          , METHOD: 'update'
          , HEADER_TYPE: 'BIZ_SERVICE'
        }
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.getGridList(false);
      }
    },

    // 게시글 등록/삭제 권한 체크(시스템관리자, 관리자, 센터장)
    atrt(){
      // console.log('this.user_role.atrtGroupId : ', this.user_role.atrtGroupId != (1||2||3), this.user_role.atrtGroupId);
      // if(this.user_role.atrtGroupId != (1||2||3) || this.mixin_isEmpty(this.user_role.atrtGroupId)){
      if(this.user_role.atrtGroupId === '1' || this.user_role.atrtGroupId === '2' || this.user_role.atrtGroupId === '3'){
        this.flagData.ATRT_CHECK = true;
      }else{
        this.flagData.ATRT_CHECK = false;
        this.showAlert(this.MESSAGE.ALERT.CHECK_ATRT);
      }
    },

    //row 선택
    rowSelect(idx) {
      this.filelist = [];
      this.selectedRow = idx;

      // this.getExpsnAttrSelect(idx);
    },

    //row 선택 활성화
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    // 데이터 바인딩 - 더블클릭시 데이터 바인딩되어 팝업창 호출
    getExpsnAttrSelect(item) {

      this.digParams.START_DATE = this.yyyyMMdd(item.PSTG_BGNG_DT);
      this.digParams.END_DATE = this.yyyyMMdd(item.PSTG_END_DT);
      this.digParams.BOARD_TP = item.PST_TYPE_CD;
      this.digParams.BOARD_TITLE = item.PST_TTL;
      this.digParams.BOARD_CONTENTS = item.PST_CN;
      this.commParam.BBS_ID = item.BBS_ID;
      this.commParam.PST_ID = item.PST_ID;
      this.commParam.FILE_GROUP_KEY = item.FILE_GROUP_KEY;
      this.commParam.INQ_CNT = item.INQ_CNT;

      if(!this.mixin_isEmpty(this.commParam.FILE_GROUP_KEY)){
        // console.log("getExpsnAttrSelect_getBoradFiles", this.commParam.FILE_GROUP_KEY)
        this.getBoardFiles();
      }else{
        // console.log("getExpsnAttrSelect_!getBoradFiles", this.commParam.FILE_GROUP_KEY)
        this.filelist = [];
      }

    },
    
    // row 더블클릭하여 상세팝업 오픈 + 조회수 증가
    dblClickRow(){

      // 수정flag
      this.checkFlag("dblClick");

      this.ufnInit();

      this.getPstDetail(this.selectedRow);

      // if(!this.mixin_isEmpty(this.commParam.FILE_GROUP_KEY)){
      //   this.getBoardFiles();
      // }else{
      //   this.filelist = [];
      // }

      // 팝업 호출
      this.mixin_showDialog('RegBoard');

      // 조회수 증가함수 호출
      // this.increaseCnt();
    },

    // 다음 버튼 페이징
    async search(next){
      if (next == 'next'){
      } else {
        this.items = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }
      this.getGridList('next');
    },

    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },
    initSelect(){
      this.selectedRow = {};
    },


  },
}
</script>

<style lang="scss" scoped>

</style>