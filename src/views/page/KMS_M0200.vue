<template>
 <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                탬플릿 유형
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(this.common_code , 'TMPL_TP' , '전체')"
                  placeholder="선택하세요"
                  v-model="VO.srch.KMS_TMPL_TYPE_CD"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">사용 여부</span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="dropUseYNAll"
                  placeholder="선택하세요"
                  v-model="VO.srch.USE_YN"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">템플릿 명</span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form is-lg"
                  placeholder="검색어 입력"
                  v-model="VO.srch.LIKE_KMS_TMPL_NM"
                  @keyup.enter="searchList"
                />
              </div>
            </div>
            <v-btn class="pl-btn is-icon" @click="searchList">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols flex-grow-1">
        <!-- left -->
        <div class="is-col-fix is-vrt" style="width: 810px">
          <!-- grid -->
          <div class="pl-card">
            <div class="pl-grid-top">
              <div class="pl-grid-top-left">
                <v-btn class="pl-btn is-icon is-sub" @click="regTemp">
                  <span class="pl-icon20 circle-plus"></span>
                  등록
                </v-btn>
                <v-btn class="pl-btn is-icon is-sub" @click="delValid" :disabled="VO.checkedItems.length != 0 ? false : true">
                  <span class="pl-icon20 trash"></span>
                  삭제
                </v-btn>
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
                <!-- 엑셀 다운로드 버튼 -->
                <compo-excel
                  TypeProp="Download"
                  :DataHeaderProp="grid.headers"
                  :DataBodyProp="items"
                  :FileNameProp="'지식 템플릿 관리_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                  SheetNameProp="지식 템플릿 관리"
                  HeaderColorProp="00B0F0"
                ></compo-excel>
              </div>
            </div>
            <v-data-table
              class="pl-grid has-control"
              :headers="grid.headers"
              :items="items"
              :item-class="(item) => {return item.KMS_TMPL_ID==grid.SEL_ITEM.KMS_TMPL_ID ? 'active':''}"
              show-select
              fixed-header
              item-key="KMS_TMPL_ID"
              height="622px"
              :items-per-page="grid.ROW_PER_PAGE"
              hide-default-footer
              :page.sync="grid.page"
              @page-count="grid.pageCount = $event"
              @click:row="selectItem"
              no-data-text="등록된 데이터가 없습니다."
              v-model="VO.checkedItems"
              >
                <template v-slot:item.USE_YN="{ item }">
                  <!-- <span :class="item.USE_YN=='Y' ? 'is-txt-main' : 'is-txt-error'">
                  {{ item.USE_YN=='Y' ? '사용' : '사용안함' }}
                  </span> -->
                  <span
                    :class="`pl-round-chip is-sm chat-stat-${item.USE_YN == 'Y' ? 'cs' : 'done'}`">
                    {{ item.USE_YN=='Y' ? '사용' : '사용안함' }}
                  </span>
                </template>
            </v-data-table>

          </div>
        </div>
        <!-- right -->
        <div class="is-vrt" >
          <!-- 템플릿 상세정보 -->
          <v-form ref="form">
            <div class="pl-card">
              <h2 class="pl-subtit">템플릿 상세 정보</h2>
              <div class="pl-form-inline-wrap is-mt-m">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    템플릿 유형
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-select
                      class="pl-form"
                      style="width: 200px"
                      placeholder="선택하세요"
                      :items="mixin_common_code_get(this.common_code , 'TMPL_TP' )"
                      :rules="validateRules.KMS_TMPL_TYPE_CD"
                      v-model="VO.temp_vo.KMS_TMPL_TYPE_CD"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    사용여부
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-select
                      class="pl-form"
                      placeholder="선택하세요"
                      :items="dropUseYN"
                      :rules="validateRules.USE_YN"
                      v-model="VO.temp_vo.USE_YN"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline" style="width:100%">
                  <span class="pl-label">
                    썸네일
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form"
                      v-model="VO.temp_vo.ACTL_FILE_NM"
                      :rules="validateRules.ACTL_FILE_NM"
                      style="width:300px"
                      @keypress="$event.preventDefault()"
                      @keydown.delete="$event.preventDefault()"
                    >
                      <template v-slot:append>
                        <v-btn
                          @click="fileChoose"
                          class="pl-btn has-icon-only">
                          <span class="pl-icon20 picture"></span>
                        </v-btn>
                        <input ref="fileUpload" type="file" @change="handleFileUpload" style="display: none" />
                      </template>
                    </v-text-field>
                  </div>
                </div>
              </div>
              <div class="pl-form-inline-wrap is-mt-m">
                <div class="pl-form-inline" style="width:100%">
                  <span class="pl-label">
                    템플릿 명
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form"
                      :rules="validateRules.KMS_TMPL_NM"
                      v-model="VO.KMS_TMPL_NM"
                      required
                      v-byte-counter="200"
                    >
                    </v-text-field>
                  </div>
                </div>
              </div>
              <div class="is-mt-m">
                <ckeditor
                  @namespaceloaded="onNamespaceLoaded"
                  v-model="VO.editData"
                  :config="editorConfig"
                  :rules="validateRules.KMS_TMPL_CN"
                >
              </ckeditor>
              </div>
            </div>
          </v-form>
          <div class="pl-card is-bottom">
            <div class="is-right">
              <v-btn class="pl-btn" @click="saveTempValid">저장</v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
    name:"MENU_KMS_M0200", //name은 'MENU_' + 파일명 조합

 components: {

 },
 data() {
    return {
      //init
      common_code:[],
      dropUseYN: [
        { text: '사용' , value:'Y'},
        { text: '사용안함' , value:'N'},
      ],
      dropUseYNAll: [
        { text: '전체' , value:''},
        { text: '사용' , value:'Y'},
        { text: '사용안함' , value:'N'},
      ],
      editorConfig: {
        height: '410px',
      },

      // form
      VO : {
        srch : {
          KMS_TMPL_TYPE_CD : '', USE_YN : '' , LIKE_KMS_TMPL_NM : ''
        },
        temp_vo : {
          KMS_TMPL_ID : null
          , KMS_TMPL_TYPE_CD : ''
          , USE_YN : ''
          , KMS_TMPL_NM : ''
          , KMS_TMPL_CN : ''
          , FILE_GROUP_KEY : ''
          , ACTL_FILE_NM : ''
        },
        editData : ''
        , KMS_TMPL_NM : ''
        , uploadFile : null
        ,filelist : []
        ,checkedItems: []
      },

      grid : {
        page: 1,
        pageCount: 5,
        perPage: [15,30,50,100],
        ROW_PER_PAGE: -1,
        headers: [
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '70px', sortable : false},
          { text: '유형', value: 'KMS_TMPL_TYPE_CD_NM', align: 'center', width: '170px' },
          { text: '템플릿명', value: 'KMS_TMPL_NM', align: 'left'},
          { text: '등록일', value: 'REG_DT', align: 'center', width: '120px' },
          { text: '등록자', value: 'RGTR_NM', align: 'center', width: '80px' },
          { text: '사용', value: 'USE_YN', align: 'center', width: '87px' },
        ],
        items: [],
        SEL_ITEM : {}
      },

      validateRules: {
        KMS_TMPL_TYPE_CD: [v => !!v || '템플릿 유형은 필수 선택 항목 입니다.'],
        KMS_TMPL_NM : [v => !!v || '템플릿 명은 필수 항목 입니다.'],
        ACTL_FILE_NM : [v => !!v || '템플릿 썸네일은 필수 항목 입니다.'],
        KMS_TMPL_CN : [v => !!v || '템플릿 내용은 필수 항목 입니다.'],
        USE_YN : [v => !!v || '템플릿 사용여부는 필수 항목 입니다.'],
      },
      MESSAGE : {
        CONFIRM : {
          SAVE : {alertDialogToggle: true, msg: '저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.saveTemp, callNo: this.closeMsg}
          , DEL : {alertDialogToggle: true, msg: '삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.delTemp, callNo: this.closeMsg}
        },
        ALERT : {
            NOT_SELECT: {alertDialogToggle: true, msg: '삭제할 항목을 선택하세요.', iconClass: 'is-info', type: 'default'}
          
          , NO_TMPL_FILE : {alertDialogToggle: true, msg: '쎔네일 파일을 선택하지 않았습니다.', iconClass: 'is-info', type: 'default'}
          , NO_KMS_TMPL_CN : {alertDialogToggle: true, msg: '템플릿 내용을 입력하지 않았습니다.', iconClass: 'is-info', type: 'default'}
        },
        TOAST : {
          DEL_SUCCESS : {msg: '삭제가 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 3000}
          , SAVE_SUCCESS : {msg: '저장이 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 3000}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '정상적으로 처리되지 않았습니다.<br>잠시후에 다시 시도해 주세요.', iconClass: 'is-caution', type: 'default'}
          , ERROR_UPLOAD : {alertDialogToggle: true, msg: '썸네일파일 전송중 오류가 발생했습니다.<br>잠시후에 다시 시도해 주세요.', iconClass: 'is-caution', type: 'default'}
        }
      },
    }
  },

  watch: {
  },

  computed: {
    items() {
      return this.grid.items;
    },
  },

  async created() {
    this.common_code = await this.mixin_common_code_get_all(['TMPL_TP']);
  },

  mounted() {
    this.searchList();
  },

  methods: {
    onNamespaceLoaded( CKEDITOR ) {
      //CKEditor 외부 플러그인 주입용도.
      this.mixin_CKEDITOR_plugins_addExternal( CKEDITOR );
    },
    async searchList() {

      const sUrl = '/api/km/template/list';
      const headParam = {head: {}};
      const postParam = this.VO.srch;

      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if(!resData.HEADER.ERROR_FLAG) {
        this.grid.items = resData.DATA;
        this.grid.items.forEach(item => {item.KMS_TMPL_NM = this.restoreXSS_CKeditor(item.KMS_TMPL_NM); });
      }
    },

    regTemp() {
        this.VO.temp_vo = {
          KMS_TMPL_ID : null
          , KMS_TMPL_TYPE_CD : ''
          , USE_YN : ''
          , KMS_TMPL_NM : ''
          , KMS_TMPL_CN : ''
          , FILE_GROUP_KEY : ''
          , ACTL_FILE_NM : ''
        };
        this.VO.editData = '';
        this.VO.KMS_TMPL_NM = '';
        this.VO.uploadFile = null;
        this.VO.filelist = [];
        this.VO.checkedItems = [];
        this.$refs.form.validate();

        this.grid.SEL_ITEM = {};
    },

    saveTempValid() {
      if(!this.$refs.form.validate() ) return;
      if(this.VO.editData == '') {
        this.showAlert(this.MESSAGE.ALERT.NO_KMS_TMPL_CN);
        return;
      }
      this.showAlert(this.MESSAGE.CONFIRM.SAVE);
    },

    async saveTemp() {
      this.closeMsg();
      if(!this.$refs.form.validate() ) return;

      if(this.mixin_isEmpty(this.VO.temp_vo.KMS_TMPL_ID)
        || (!this.mixin_isEmpty(this.VO.temp_vo.KMS_TMPL_ID) && this.VO.uploadFile != null)
      ) {
        if(this.VO.uploadFile == null) this.showAlert(this.MESSAGE.ALERT.NO_TMPL_FILE);
        await this.uploadFiles(this.VO.uploadFile);
        if(this.mixin_isEmpty(this.VO.temp_vo.FILE_GROUP_KEY )) {
          this.showAlert(this.MESSAGE.ERROR.ERROR);
          return;
        }
      }

      const sUrl = '/api/km/template/update';
      const headParam = {head: {}};
      const postParam = this.VO.temp_vo;
      this.VO.temp_vo.KMS_TMPL_NM = this.restoreXSS_CKeditorDec(this.VO.KMS_TMPL_NM);
      postParam.KMS_TMPL_CN = this.restoreXSS_CKeditorDec(this.VO.editData);
      postParam.REG_YN = this.VO.temp_vo.KMS_TMPL_ID=='' ? 'Y' : 'N';

      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if(resData.HEADER == undefined) {
        this.VO.temp_vo.KMS_TMPL_NM = this.restoreXSS_CKeditor(this.VO.temp_vo.KMS_TMPL_NM);
        this.showToast(this.MESSAGE.TOAST.SAVE_SUCCESS);
        return;
      }
      if(!resData.HEADER.ERROR_FLAG) {
        this.VO.temp_vo.KMS_TMPL_ID = resData.DATA[0].KMS_TMPL_ID;
        this.showToast(this.MESSAGE.TOAST.SAVE_SUCCESS);
        this.searchList();
      }
    },
    delValid() {
      if(this.VO.checkedItems.length == 0) {
        this.showAlert(this.MESSAGE.ALERT.NOT_SELECT);
        return;
      }
      this.showAlert(this.MESSAGE.CONFIRM.DEL);
    },
    async delTemp() {
      this.closeMsg();
      const sUrl = '/api/km/template/delete';
      const headParam = {head: {}};
      const postParam = {list: this.checkedItemKeys()};

      let resData = await this.common_postCall(sUrl, postParam, headParam );
      if(!resData.HEADER.ERROR_FLAG){
        this.showToast(this.MESSAGE.TOAST.DEL_SUCCESS);
        this.searchList();
      }
    },

    async selectItem(item) {

      this.grid.SEL_ITEM = item;

      const sUrl = '/api/km/template/detail';
      const headParam = {head: {}};
      const postParam = {KMS_TMPL_ID: item.KMS_TMPL_ID};

      let resData = await this.common_postCall(sUrl, postParam, headParam );
      if(!resData.HEADER.ERROR_FLAG) {
        this.VO.temp_vo = resData.DATA[0];
        this.VO.KMS_TMPL_NM = this.restoreXSS_CKeditor(this.VO.temp_vo.KMS_TMPL_NM);
        this.VO.editData = this.restoreXSS_CKeditor(this.VO.temp_vo.KMS_TMPL_CN);
      }
    },
    closeMsg() {
        this.$store.commit("alertStore/hideAlert");
    },

    checkedItemKeys() {
      let checkedItemKeys = [];
      this.VO.checkedItems.forEach(item => {
        checkedItemKeys.push(item.KMS_TMPL_ID);
      });
      return JSON.stringify(checkedItemKeys);
    },

    fileChoose() {
      this.$refs.fileUpload.click();
    },
    handleFileUpload(event) {
      const files = event.target.files;
      if (files.length == 1 && this.isValidFiles(files)) {
        this.VO.uploadFile = files;
        this.VO.temp_vo.ACTL_FILE_NM = files[0].name;
      } else {
        this.VO.uploadFile = null;
        this.VO.temp_vo.ACTL_FILE_NM = '';
      }
    },
    isValidFiles(files) {
      // 파일 크기 및 형식을 설정 (대소문자 구분)
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxFileSize = 5 * 1024 * 1024; // 5MB
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!allowedFileTypes.includes(file.type)) {
          this.showAlert({alertDialogToggle: true, msg: '지원하지 않는 파일 형식입니다.', iconClass: 'is-info', type: 'default'});
          return false;
        }
        if (file.size > maxFileSize) {
          this.showAlert({alertDialogToggle: true, msg: '파일 크기가 허용 범위를 초과합니다.', iconClass: 'is-info', type: 'default'});
          return false;
        }
      }
      return true;
    },
    async uploadFiles(files) {
      let busiType = 'km';
      // let pathType = 'files';
      let pathType = 'images';
      let uploadUrl = "api/file/"+ busiType +"/"+ pathType +"/uploads";
      let downloadUrl = "api/file/"+ busiType +"/"+ pathType +"/download";
      let fileUploadLib = 'dropzone'
      //파일경로 설정
      let dir = busiType+"/" + pathType;

      //파일 제한 체크 (빽엔드에서 체크 후 업로드 실패)
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();

        formData.append('action', uploadUrl);
        formData.append('method', "post");
        formData.append('custcoId', this.$store.getters['userStore/GE_USER_ROLE'].company.CD);                 //회사구분 : 1은 시스템(가이드)
        formData.append('userfiles', files[i]);           //파일(바이너리)
        formData.append('acceptedFiles', "");             //허용파일유형
        formData.append('fileUploadLib', fileUploadLib);  //파일 업로드 라이브러리
        formData.append('trgtTypeCd', "FILE");              //파일 유형
        formData.append('dir', dir);                      //파일경로
        formData.append('downloadUri', downloadUrl);      //다운로드 경로
        formData.append('uploadUri', uploadUrl);          //업로드 경로
        formData.append('userId', this.$store.getters['userStore/GE_USER_ROLE'].userId);                   //사용자 ID : 2는 시스템(가이드)

        await axios
        .post(uploadUrl, formData, {headers:{Authorization: "bearer " + window.sessionStorage.getItem("token")}})
          .then(response => {
            // 파일 업로드 성공 시 처리
            let leng = response.data.data.length;
            for(let n=0;n<leng;n++) {
              this.VO.temp_vo.FILE_GROUP_KEY = response.data.data[n].fileGroupKey;
              this.VO.filelist.push({
                index : i,
                filename : response.data.data[n].actlFileNm,
                filesize : response.data.data[n].fileSzDisplay,
                download : false,
                count : 0,
                downloadFile: response.data.data[n].actlFileNm,
                fileGroupKey: response.data.data[n].fileGroupKey,
                fileKey: response.data.data[n].fileKey,
              })
            }
          })
          .catch(error => {
            this.VO.temp_vo.FILE_GROUP_KEY = '';
            console.error(error);
          });
      }
      // 서버로 파일 업로드 요청을 보냅니다.
    },
  },
}
</script>

<style lang="scss" scoped>

</style>