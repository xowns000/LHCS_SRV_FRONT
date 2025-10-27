<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols flex-grow-1">
        <!-- left -->
        <div class="is-col-fix is-vrt" style="width: 500px">
          <div class="pl-card">
            <div class="pl-tree-header">
              <div class="is-left">
                <label>이미지 분류</label>
              </div>
              <div class="is-right">
                <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault')">전체 펼치기</v-btn>
                <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault')">전체 접기</v-btn>
                <compo-tooltip-btn
                  TitleProp="새로고침"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="bottom"
                  @btnClick="qstnTreeSrch()">
                </compo-tooltip-btn>
              </div>
            </div>
            <div class="pl-tree-body" style="height: 680px;">
              <v-treeview
                ref="treeDefault"
                :items="QSTN_TYPE_TREE"
                :open-all="expanded"
                activatable
                :active="ACT_TREE_MENU"
                open-on-click
                color="secondary"
                class="pl-tree-view"
                @update:active="srch_tree_act"
                @update:open="srch_tree_open"
              >
                <template v-slot:prepend="{ item, open }">
                  <v-icon v-if="item.children">
                      {{open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder'}}
                  </v-icon>
                  <v-icon v-else>
                      {{ 'pl-icon20 tree-file' }}
                  </v-icon>
                </template>
              </v-treeview>
            </div>
          </div>
        </div>
        <!-- right -->
        <div class=" is-vrt" >
          <div class="pl-card">

            <!-- grid -->
            <div class="pl-grid-top">
              <div class="pl-grid-top-left">
                <h2 class="pl-subtit">{{ QSTN_TYPE_NM }}</h2>
                <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
              </div>
              <div class="pl-grid-top-utils">
                <v-text-field
                  class="pl-form is-search"
                  placeholder="검색어 입력"
                  v-model="SRCH_PST_TTL"
                  @keydown.enter="chtImgSrch()"
                  :disabled="QSTN_TYPE_ID == ''? true : false"
                >
                <template v-slot:append>
                  <v-btn
                    :disabled="QSTN_TYPE_ID == ''? true : false"
                    @click="chtImgSrch()"
                    class="pl-btn has-icon-only">
                    <span class="pl-icon20 in-search"></span>
                  </v-btn>
                </template>
              </v-text-field>
              <!-- 등록 버튼 -->
              <compo-tooltip-btn
                TitleProp="이미지 등록"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 circle-plus"
                TooltipPositionProp="bottom"
                @btnClick="mixin_showDialog('RegImg')"
                :DisabledProp="QSTN_TYPE_ID == ''? true : false"
              ></compo-tooltip-btn>
              </div>
            </div>
            <v-data-table
              class="pl-grid type-hover-func type-img is-mt-l"
              :headers="headers"
              :items="items"
              hide-default-header
              item-key="index"
              height="562px"
              no-data-text="등록된 데이터가 없습니다."
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              :page.sync="page"
              @page-count="pageCount = $event">
              <template v-slot:item="{ item }">
                <div
                  class="pl-img-grid-unit"
                  :class="mixin_getItemClass(item)"
                  @mouseover="mixin_hoverItem(item,'items')"
                  @mouseleave="mixin_leaveItem(item,'items')"
                >
                  <div>
                    <img
                      :src="item.IMG_URL"
                      :alt="item.PST_TTL"
                      class="pl-img-grid-unit-img"
                    />
                  </div>
                  <div class="pl-img-grid-unit-title">{{ item.PST_TTL }}</div>
                  <div class="grid-hover-func-wrap">
                    <v-btn class="pl-btn is-sub is-sm" @click="chat_img_expand(item.IMG_URL)">원본 보기</v-btn>
                    <v-btn class="pl-btn is-sub is-sm" @click="[clickMdfcn(item),mixin_showDialog('RegImg')]">수정</v-btn>
                    <v-btn class="pl-btn is-sub is-sm" @click="[FILE_KEY=item.FILE_KEY,showAlert(MESSAGE.CONFIRM.DEL)]">삭제</v-btn>
                  </div>
                </div>
              </template>

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

              <!-- 더보기 다음 있을때만 노출 -->
              <span class="pl-pager-period">
                보기 {{ mixin_getPagePeriod(items, page) }} / {{ items.length }}
                <compo-tooltip-btn
                    TitleProp="다음 검색"
                    ClassProp="pl-tooltip-btn is-line"
                    IconProp="pl-icon20 arrow-next-paging"
                    TooltipPositionProp="bottom"
                    @btnClick="chtImgSrch('next')"
                    :DisabledProp="nextDisabled"
                ></compo-tooltip-btn>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- dialog -->
    <!-- 이미지 확대 다이얼로그 -->
    <v-dialog
      v-model="dialogImgExpand"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="이미지"
        @hide="mixin_hideDialog('ImgExpand')"
      >
        <template slot="body">
          <!-- component -->
          <img
            :src="expandImgUrl"
            class="pl-chatting-log-img-expand"
            />
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- 등록 다이얼로그 -->
    <v-dialog
      v-model="dialogRegImg"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :header-title="PST_ID == '' ? '상담 이미지 등록' : '상담 이미지 정보'"
        @hide="[mixin_hideDialog('RegImg'),initChtImg()]"
      >
        <template slot="body">
          <p>필수 항목을 입력하신 후 <strong>[저장]</strong> 버튼을 클릭하십시오.</p>
          <v-form ref="form">
          <div class="pl-form-inline-wrap vertical mt-2">
            <div class="pl-form-inline">
              <span class="pl-label">
                분류
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  disabled
                  v-model="QSTN_TYPE_NM"
                />
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
                  v-model="PST_TTL"
                  :rules="validateRules.PST_TTL"
                />
              </div>
            </div>
          </div>
          </v-form>
          <!-- 첨부파일 -->
          <compo-file-grid
            TitleProp="이미지 첨부"
            :FilesProp="filelist"
            @addFile="clickAddFiles"
            :DelData="DEL_FILE"
            @input="DEL_FILE = $event"
            @removeFile="removeFile()"
          >
            <template slot="infotext">
              <ul class="pl-list-info">
                <li>이미지는 최대 00개,  전체 용량은 0000kb까지 등록 가능합니다.<br>등록 가능한 이미지는 png, jpg만 가능합니다.</li>
              </ul>
            </template>
          </compo-file-grid>
          <input ref="fileUpload" type="file" multiple @change="handleFileUpload" style="display: none" />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="[mixin_hideDialog('RegImg'),initChtImg()]">닫기</v-btn>
          <v-btn
            v-if="PST_ID == ''"
            class="pl-btn"
            @click="showAlert(MESSAGE.CONFIRM.REG)"
          >
            저장
          </v-btn>
          <v-btn
              v-if="PST_ID != ''"
              class="pl-btn"
              @click="showAlert(MESSAGE.CONFIRM.MDFCN)"
            >
            수정
          </v-btn>
        </template>

      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
name:"MENU_STG_M0507", //name은 'MENU_' + 파일명 조합
components: {
},
data() {
   return {
    // dialog
    dialogImgExpand: false,
    expandImgUrl: '',

    dialogRegImg: false,
    filelist: [],
    SRCH_PST_TTL:'',          //제목 검색
    PST_TTL:'',               //등록모달 제목

    //tree
    expanded: false,
    QSTN_TYPE_TREE: [],       //문의유형 트리
    ACT_TREE_MENU:[],         //활성화된(클릭한) 트리
    ACT_TREE_LIST:[],         //활성화된 트리 리스트

    QSTN_TYPE_ID:'',          //선택한 문의유형ID
    QSTN_TYPE_NM:'',          //선택한 문의유형명

    //grid
    editedIndex: -1,
    hoverRow: null,
    page: 1,
    pageCount: 0,
    perPage: [15,30,50,100],
    ROW_PER_PAGE: 15,
    headers: [
      { text: '타이틀', value: 'title', align: 'center', },
      { text: '이미지', value: 'img', align: 'center', },
    ],
    items: [],//{ index: 1, img: require('@/assets/img/@sample2.png'), title: '신규 회원 가입 신청서 견본 신규 회원 가입 신청서 견본' },

    pagination: {
          page: 1,
          rowsPerPage: 500,
          sortBy: "",
          descending: ""
        }, //그리드 페이지속성정의
    nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼

    PST_ID:'',                //게시물 아이디
    FILE_KEY:'',              //파일키

    DEL_FILE:[],              //컴포넌트 모달에서 가져온 삭제파일정보
    DEL_FILE_LIST:[],         //삭제파일정보

    //알림창 메시지
    MESSAGE : {
      CONFIRM : {
        REG : {alertDialogToggle: true, msg: '이미지를 등록하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.fileGroupKeyUnity, callNo: this.closeMsg}
        , MDFCN: {alertDialogToggle: true, msg: '이미지를 수정하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.fileDel, callNo: this.closeMsg}
        , DEL: {alertDialogToggle: true, msg: '이미지를 삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.chtImgDel, callNo: this.closeMsg}
      },
      ALERT : {
        REG_SUCCESS : {alertDialogToggle: true, msg: '이미지가 등록되었습니다', iconClass: 'is-info', type: 'default'}
        , MDFCN_SUCCESS : {alertDialogToggle: true, msg: '이미지가 수정되었습니다', iconClass: 'is-info', type: 'default'}
        , DEL_SUCCESS : {alertDialogToggle: true, msg: '이미지가 삭제되었습니다', iconClass: 'is-info', type: 'default'}
        , VALID : {alertDialogToggle: true, msg: '필수항목 확인 후<br>재시도 해주세요', iconClass: 'is-info', type: 'default'}
        , NO_IMG : {alertDialogToggle: true, msg: '이미지 없이 저장할 수 없습니다', iconClass: 'is-info', type: 'default'}
      },
      ERROR : {
        ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'},
      }
    },

    //필수값 체크
    valid : true,
    validateRules: {
      PST_TTL: [
        v => !!v || '제목 은(는) 필수 입력 항목입니다.',
      ],
    }
  }
 },

  watch: {

  },

  computed: {

  },

  //공통코드 사용시 async-await 필수 (mixin_common_code_get_all함수로 공통코드 리스트를 가지고 오기 전에 mixin_common_code_get이벤트 발생)
  created() {
    this.qstnTreeSrch();
  },

  mounted() {

  },

  methods: {
    // tree
    expandAll(id){
      this.expanded = true;
      this.$refs[id].updateAll(true);
    },
    collapseAll(id){
      this.expanded = false;
      this.$refs[id].updateAll(false);
    },
    // custom 버튼
    deleteItem(item, arr) {
      const index = this[`${arr}`].indexOf(item);
      if(index !== -1) {
        this[`${arr}`].splice(index, 1);
      }
    },
    chat_img_expand(img) {
      this.expandImgUrl = img;
      this.mixin_showDialog('ImgExpand')
    },

    async qstnTreeSrch(){
      let sUrl = '/chat-api/setting/inqry-ty-manage/chnnl-tr/inqire';
      let postParam = {
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.QSTN_TYPE_TREE = resData.QSTN_TYPE_TREE;
      }
    },

    //트리메뉴 클릭
    //최하위 메뉴 클릭 시 이벤트
    srch_tree_act(node){
      let activeItem = []
      let leng = node.length
      if(leng != 0){
        this.QSTN_TYPE_ID = node[leng-1]
      } else {  //같은메뉴를 클릭했을 때
        activeItem[0] = this.QSTN_TYPE_ID
        this.ACT_TREE_MENU = activeItem;
      }

      let selectedNode = this.findNodeById(this.QSTN_TYPE_TREE, this.QSTN_TYPE_ID);

      if(selectedNode != null){
        this.QSTN_TYPE_ID = selectedNode.QSTN_TYPE_ID
        this.QSTN_TYPE_NM = selectedNode.QSTN_TYPE_NM
      }

      this.chtImgSrch();
    },
    //트리메뉴 활성화(폴더열기)
    //열린폴더 리스트가 node에 들어옴
    //폴더를 닫았을 때에는 node에 해당 폴더 정보가 없기때문에 ACT_TREE_LIST기준으로 가져옴
    srch_tree_open(node){
      let nodeLeng = node.length  //현재 활성화된 폴더
      let nowActive = []    //현재 클릭한 메뉴
      //전체 접기 버튼을 클릭했을 때
      if(nodeLeng == 0 && (this.QSTN_TYPE_ID == '' || this.QSTN_TYPE_ID == null || this.QSTN_TYPE_ID == undefined) ){
        // if(this.ACT_TREE_MENU.length != 0){
        //   this.ACT_TREE_MENU.pop()
        // }
        this.ACT_TREE_LIST = [];
        return;
      } else if(nodeLeng == 0 && (this.QSTN_TYPE_ID != '' && this.QSTN_TYPE_ID != null && this.QSTN_TYPE_ID != undefined) ){
        // if(this.ACT_TREE_MENU.length != 0){
        //   this.ACT_TREE_MENU.pop()
        // }
        this.ACT_TREE_LIST = [];
        return;
      }
      let actLeng = this.ACT_TREE_LIST.length //클릭하기 전 활성화된 폴더
      if(actLeng > nodeLeng){ //node에는 클릭한 순서대로 들어가기때문에 지금 클릭한 폴더를 구분해야함
        //배열을 크기순으로 나열하여 값 비교
        this.ACT_TREE_LIST.sort();
        node.sort();
        for(let i=0;i<actLeng;i++){
          if(this.ACT_TREE_LIST[i] != node[i]){
            nowActive[0] = this.ACT_TREE_LIST[i]
            break
          }
        }
      } else {  //폴더를 열었을 때
        nowActive[0] = node[nodeLeng-1]
      }
      this.QSTN_TYPE_ID = nowActive[0];
      this.ACT_TREE_MENU = nowActive;
      this.ACT_TREE_LIST = node;


      let selectedNode = this.findNodeById(this.QSTN_TYPE_TREE, this.QSTN_TYPE_ID);

      if(selectedNode != null){
        this.QSTN_TYPE_ID = selectedNode.QSTN_TYPE_ID
        this.QSTN_TYPE_NM = selectedNode.QSTN_TYPE_NM
      }

      this.chtImgSrch();
    },

    //트리 클릭 시 해당 row정보 세팅
    findNodeById(nodes, id) {
      for (let node of nodes) {
        if (node.id === id) {
          return node;
        }
        if (node.children && node.children.length > 0) {
          const foundNode = this.findNodeById(node.children, id);
          if (foundNode) {
            return foundNode;
          }
        }
      }
      return null;
    },

    //이미지(게시판 조회)
    async chtImgSrch(next){
      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let sUrl = '/api/board/chat/image-list';
      let postParam = {
        BBS_ID: '2',          //채팅게시판 조회
        CUTT_TYPE_ID: this.QSTN_TYPE_ID,       //선택한 문의유형
        PST_TTL:this.SRCH_PST_TTL,
      }
      let headParam = {
        head: {
          "ROW_CNT" : this.pagination.rowsPerPage,
          "PAGES_CNT" : this.pagination.page,
          "PAGING" : "Y",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        //속도문제로 인해 리스트를 여기에서 초기화
        if (next == 'next'){
        } else {
          this.items = [];
        }

        let tempDataText = resData.DATA;
        let leng = tempDataText.length;
        for(let i=0;i<leng;i++){
          tempDataText[i]["IMG_URL"] = "/upload/" + tempDataText[i]["FILE_PATH"] + "/" + tempDataText[i]["STRG_FILE_NM"];
        }
        //this.items = tempDataText;
        this.items = [...this.items, ...tempDataText]
        //{ index: 1, img: require('@/assets/img/@sample2.png'), title: '신규 회원 가입 신청서 견본 신규 회원 가입 신청서 견본' },
        //img경로 설정해줘야함

        for(let i=0;i<this.items.length;i++){
          this.items[i]["index"] = i;
        }

        //다음
        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 resData.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(resData.HEADER.next !== null && resData.HEADER.next !== undefined){
          if(resData.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }

        //이부분은 체크해볼것
        this.pagination.page += 1
        // this.page=1;
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

      // 파일 크기 및 형식을 설정 (대소문자 구분)
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
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
      let busiType = 'chat';
      let pathType = 'images';
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
            // console.log(response.data);
            let leng = response.data.data.length
            for(let n=0;n<leng;n++)
            this.filelist.push({
              index : i,
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
      let leng = this.filelist.length;
      if(leng == 0){
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.NO_IMG);
        return;
      }
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
        this.chtImgStrg();
      }
    },

    //이미지 저장
    async chtImgStrg(){
      if (!this.validate()) {
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }
      let leng = this.filelist.length;
      if(leng == 0){
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.NO_IMG);
        return;
      }
      let fileGroupKey = this.filelist[leng-1]["fileGroupKey"]
      //게시물 저장
      let sUrl = '/api/board/boardUpsert';
      let postParam = {
        RGTR_IP : this.$store.getters['userStore/GE_USER_IP_ADDR'] // IP
        , PST_ID : this.PST_ID // 게시글ID - 없으면 게시글 신규 등록, 있으면 수정
        , BBS_ID : 2 // 게시판ID (채팅 이미지 = 2,일반 게시판또는 공지사항 = 1)
        , PSTG_BGNG_DT : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10) // 게시시작일시
        , PSTG_END_DT : '2999-12-31'        // 게시종료일시
        , PST_TYPE_CD : 'GENR'                  // 게시물유형코드
        , PST_TTL : this.restoreXSS_CKeditorDec(this.PST_TTL) // 게시물제목 O `~!@#$%^&*()_+-= []{};':",./&lt;&gt;?
        , PST_CN : ''
        , FILE_GROUP : fileGroupKey // 파일그룹키
        , FILE_GROUP_KEY : fileGroupKey
        , FLAG_DATA : this.PST_ID == '' ? true : false // true || false
        , FILE_FLAG : true
        , CUTT_TYPE_ID : this.QSTN_TYPE_ID        //문의유형
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        if(this.PST_ID == ''){
          this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS);
        } else {
          this.showAlert(this.MESSAGE.ALERT.MDFCN_SUCCESS);
        }
        this.initChtImg()
        this.mixin_hideDialog('RegImg')
        this.chtImgSrch();
      }
    },

    //이미지정보 초기화
    initChtImg(){
      this.PST_ID = '';
      this.PST_TTL = '';
      this.filelist = [];
    },

    //이미지 단일 삭제
    async chtImgDel(MSG){
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
        this.chtImgSrch();
        if(MSG != 'NO_MSG'){
          this.showAlert(this.MESSAGE.ALERT.DEL_SUCCESS);
        }
      }
    },

    //이미지 수정 클릭
    clickMdfcn(item){
      this.PST_ID = item.PST_ID;
      this.PST_TTL = item.PST_TTL;

      let leng=this.items.length
      for(let i=0;i<leng;i++){
        if(this.items[i]["FILE_GROUP_KEY"] == item.FILE_GROUP_KEY)
        this.filelist.push({
          index : i,
          filename : this.items[i].ACTL_FILE_NM,
          filesize : this.items[i].FILE_SZ,
          download : true,
          count : 0,
          downloadFile: this.items[i].ACTL_FILE_NM,
          fileGroupKey: this.items[i].FILE_GROUP_KEY,
          fileKey: this.items[i].FILE_KEY,
          busiType:this.items[i].TASK_TYPE_CD,
          pathType:this.items[i].PATH_TYPE_CD,
        })
      }

      this.mixin_showDialog('RegImg');
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
          this.chtImgDel('NO_MSG');
        }
      }
      this.fileGroupKeyUnity();
    },

    //알림창 닫기
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    //필수값 체크
    validate () {
      return this.$refs.form.validate();
    },
  },
}
</script>

<style lang="scss" scoped>

</style>