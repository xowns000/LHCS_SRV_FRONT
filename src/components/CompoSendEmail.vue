<template>
  <div>
    <div class="pl-form-inline-wrap vertical">
      <div 
        v-if="TO_EMAIL_USE_YN == 'Y'"
        class="pl-form-inline">
        <span class="pl-label">
          <v-icon class="pl-icon20 div-chk mr-2"></v-icon>
          받는 사람
        </span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form"
            v-model="toEmail"
            :disabled="!mixin_isEmpty(toEmail)"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          <v-icon class="pl-icon20 document mr-2"></v-icon>
          제목
        </span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form"
            v-model="emailSubject"
            :disabled="MODE == 'VIEW'"
          />
        </div>
      </div>
    </div>
    <compo-file-grid
      v-if="FILE_ATTACH_USE_YN == 'Y' && (MODE != 'VIEW' || filelist.length > 0)"
        :FilesProp="filelist"
        :HeadersProp="filelist_header"
        :HeaderButtonProp="MODE != 'VIEW' ? true : false"
        @addFile="clickAddFiles"
        :DelData="DEL_FILE"
        @input="DEL_FILE = $event"
        @removeFile="removeFile()"
    ></compo-file-grid>
    <ckeditor
      v-if="MODE != 'VIEW'"
      class="is-mt-m"
      @namespaceloaded="onNamespaceLoaded"
      v-model="editorData"
      :config="editorConfig"
    ></ckeditor>
    <div
      v-if="MODE == 'VIEW'"
      class="is-mt-m"
      v-dompurify-html="extractBodyFromHTML(editorData)"
    ></div>
    <input ref="fileUpload" type="file" multiple @change="handleFileUpload" style="display: none" />
  </div>
</template>

<script>
  import axios from "axios";
  import { eventBus } from "@/store/eventBus.js";
  import editorConfig from "../mixin/ckEditorConfig";

  export default {
    name: 'CompoSendEmail',
    props: {
      //이메일 모드 : WRITE: 이메일 작성(기본), REPLY : 답변 작성, VIEW : 발송 내역 조회
      MODE: {
        type: String,
        default: 'WRITE'
      },
      SNDNG_TYPE_CD: {
        type: String,
        default: 'chatemail'
      },
      RSVT_DT: {
        type: String,
        default: ''
      },
      CUST_ID: {
        type: String,
        default: ''
      },
      CUST_EMAIL: {
        type: String,
        default: ''
      },
      SUBJECT: {
        type: String,
        default: ''
      },
      EMAIL_CONTENT: {
        type: String,
        default: ''
      },
      EML_SNDNG_ID: {
        type: String,
        default: ''
      },
      CHT_CUTT_ID: {
        type: String,
        default: ''
      },
      FILE_ATTACH_USE_YN: {
        type: String,
        default: 'Y'
      },
      TO_EMAIL_USE_YN: {
        type: String,
        default: 'Y'
      },
      SRVY_YN: {
        type: String,
        default: 'N'
      },
      SEND_TRGT_LIST: {
        type: Array,
        default: () => [],
      },
      
    },
    data() {
      return {
        toEmail: '',
        //설문조사에서 발송할 이메일 정보(srvy_trgt_id, email 정보가 포함됨)
        srvyTrgtList: [],
        emailExistSrvyTrgtList: [],
        emailNotExistSrvyTrgtList: [],
        emailSubject: '',
        editorData: '',
        chtCuttId: '',
        editorConfig: {
          height: '300px'
        },
        //updated() 최초 실행 여부
        isFirstUpdatedCall : true,
        FILE_GROUP_KEY: '',
        filelist_header: [
          { text: '파일명', value: 'filename', align: 'left',sortable: false },
          { text: '크기', value: 'filesize', align: 'left',sortable: false , width: '100px'},
        ],
        filelist: [],
        DEL_FILE:[],              //컴포넌트 모달에서 가져온 삭제파일정보
        DEL_FILE_LIST:[],         //삭제파일정보


        //알림창 메시지
        MESSAGE : {
          ALERT : {
            REQUIRED_TO_EMAIL : {alertDialogToggle: true, msg: '수신 이메일 정보를 입력해 주세요.', iconClass: 'is-caution', type: 'default'},
            REQUIRED_SUBJECT : {alertDialogToggle: true, msg: '이메일 제목을 입력해 주세요.', iconClass: 'is-caution', type: 'default'},
            REQUIRED_CN : {alertDialogToggle: true, msg: '이메일 내용을 입력해 주세요.', iconClass: 'is-caution', type: 'default'},
            NO_TRGT_EMAIL : {alertDialogToggle: true, msg: '이메일 주소가 있는 참여자가 없습니다.', iconClass: 'is-caution', type: 'default'},
          },
          TOAST : {//토스트알림
            SEND_SUCCESS: {  msg: '이메일을 발송하였습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 3000 },
            RESERVATION_SUCCESS: {  msg: '이메일 발송이 예약되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 3000 },
            SEND_FAIL: {  msg: '이메일 발송이 실패하였습니다.', class: 'warning', hasToastIcon: true, icon: 'mdi-close-circle', time: 3000 }  
          }
        },
      }
    },

    methods: {
      onNamespaceLoaded( CKEDITOR ) {
        //CKEditor 외부 플러그인 주입용도.
        this.mixin_CKEDITOR_plugins_addExternal( CKEDITOR );
      },
      async initSendEmailDialog() {
        if(this.MODE != 'VIEW') {
          this.toEmail = this.CUST_EMAIL;
          this.emailSubject = this.SUBJECT;
          this.editorData = this.extractBodyFromHTML(this.EMAIL_CONTENT);
          this.FILE_GROUP_KEY = "";
          this.filelist=[];
          this.rsvtDt = this.RSVT_DT;
          this.chtCuttId = this.CHT_CUTT_ID
        } else if(this.MODE == 'VIEW') {
          this.filelist_header.push({ text: '다운로드', value: 'download', align: 'center',sortable: false, width: '100px' });
          await this.getSendEmail();
        }
        //파일 첨부 사용 여부 - 기본 Y
        this.FILE_ATTACH_USE_YN = this.FILE_ATTACH_USE_YN == 'N' ? 'N' : 'Y'
        //받는 사람 사용 여부 - 기본 Y - 설문에서 여러명을 개별로 발송 시, 필요 없음.
        this.TO_EMAIL_USE_YN = this.TO_EMAIL_USE_YN == 'N' ? 'N' : 'Y'

        //설문조사 이메일 발송 시, SEND_TRGT_LIST 로 발송자 목록을 받는다.
        this.srvyTrgtList = this.SEND_TRGT_LIST;
      },

      setCustEmail(custEmail) {
        this.toEmail = custEmail;
        this.getFileGroupKey();


      },
      setSendEmailInit() {
        this.initSendEmailDialog();
      },

      //이메일 발송
      async sendEmail() {
        let sUrl = '/api/email/sendEmail';
        let postParam = {
          CUST_ID: this.CUST_ID,
          RCVR_EML: this.toEmail,
          TTL: this.emailSubject,
          CN: this.editorData,
          FILE_GROUP_KEY: this.FILE_GROUP_KEY,
          SNDNG_TYPE_CD: this.SNDNG_TYPE_CD,
          RSVT_DT: this.rsvtDt == '' ? null : this.rsvtDt,
          CHT_CUTT_ID: this.chtCuttId,
          SRVY_YN: this.SRVY_YN,
          SRVY_TRGT_LIST: this.emailExistSrvyTrgtList
        }
        let headParam = {
        head : {},
        timeout: 3600000
      }
        this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
        let response  = await this.common_postCall(sUrl, postParam, headParam);
        this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
        if (!response.HEADER.ERROR_FLAG) {
          if(this.mixin_isEmpty(this.rsvtDt)) {
            this.showToast(this.MESSAGE.TOAST.SEND_SUCCESS);
          } else {
            this.showToast(this.MESSAGE.TOAST.RESERVATION_SUCCESS);
          }
          this.initSendEmailDialog();
          this.$emit('sendEmailClose', {resultCode:"SUCC", mode: this.MODE, chtCuttId: this.chtCuttId});
        } else {
          this.showToast({msg: '이메일 발송이 실패하였습니다. - ' + response.HEADER.ERROR_MSG, class: 'warning', hasToastIcon: true, icon: 'mdi-close-circle', time: 4000} );
          this.$emit('sendEmailClose', {resultCode:"FAIL", mode: this.MODE});
        }
        this.closeMsg();
      },

      //이메일 발송 체크
      setSendEmail() {
        if(this.mixin_isEmpty(this.emailSubject)) {
          this.showAlert(this.MESSAGE.ALERT.REQUIRED_SUBJECT);
          return false;
        }
        if(this.mixin_isEmpty(this.editorData)) {
          this.showAlert(this.MESSAGE.ALERT.REQUIRED_CN);
          return false;
        }
        if(this.srvyTrgtList && this.srvyTrgtList.length > 0) {
          this.emailExistSrvyTrgtList = [];
          this.emailNotExistTrgtList = [];

          this.emailExistSrvyTrgtList = this.srvyTrgtList.filter(srvyTrgt => {
            return !this.mixin_isEmpty(srvyTrgt.EML)
          })

          this.emailNotExistTrgtList = this.srvyTrgtList.filter(srvyTrgt => {
            return this.mixin_isEmpty(srvyTrgt.EML)
          })

          if(this.emailExistSrvyTrgtList.length == 0) {
            this.showAlert(this.MESSAGE.ALERT.NO_TRGT_EMAIL);
            return false;
          }

          if(this.emailNotExistTrgtList.length > 0) {
            let msg = `아래 참여자는 이메일 정보가 없습니다.\n`
            this.emailNotExistTrgtList.map(srvyTrgt => {
              msg += srvyTrgt.CUST_NM +'\n'
            })
            msg += `해당 참여자를 제외한 ${this.emailExistSrvyTrgtList.length}명의 참여자에게 발송하시겠습니까?`
            this.showAlert({
              alertDialogToggle: true, 
              msg: msg, 
              iconClass: 'is-info', 
              type: 'confirm', 
              callYes: this.sendEmail, 
              callNo: this.closeMsg});
            
            return false;
          }
          
        } else {
          if(this.mixin_isEmpty(this.toEmail)) {
            this.showAlert(this.MESSAGE.ALERT.REQUIRED_TO_EMAIL);
            return false;
          }
        }
        
        this.sendEmail();
      },


      async getSendEmail() {
        let sUrl = '/api/email/getSendEmail';
        let postParam = {
          EML_SNDNG_ID: this.EML_SNDNG_ID
        }

        let response  = await this.common_postCall(sUrl, postParam);

        if (!response.HEADER.ERROR_FLAG) {
          let SEND_EMAIL = response.DATA[0];

          this.toEmail = SEND_EMAIL.RCVR_EML;
          this.emailSubject = SEND_EMAIL.TTL;
          this.editorData = this.extractBodyFromHTML(SEND_EMAIL.CN);
          this.FILE_GROUP_KEY = SEND_EMAIL.FILE_GROUP_KEY;
          this.chtCuttId = SEND_EMAIL.CHT_CUTT_ID;

          if(SEND_EMAIL.FILE_LIST != undefined && SEND_EMAIL.FILE_LIST.length > 0) {
            this.filelist = [];
            SEND_EMAIL.FILE_LIST.map((item, index) => {
              this.filelist.push({
                index : index,
                filename : item.ACTL_FILE_NM,
                filesize : this.mixin_format_bytes(item.FILE_SZ),
                download : true,
                count : item.DWNLD_CNT,
                downloadFile: item.ACTL_FILE_NM,
                fileGroupKey: item.FILE_GROUP_KEY,
                fileKey: item.FILE_KEY,
                busiType: item.TASK_TYPE_CD,
                pathType: item.PATH_TYPE_CD,
              })
            })
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

        // 파일 크기 및 형식을 설정 (대소문자 구분)
        //const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxFileSize = 5 * 1024 * 1024; // 5MB
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          //if (!allowedFileTypes.includes(file.type)) {
          //  alert('지원하지 않는 파일 형식입니다.');
          //  return false;
          //}
          if (file.size > maxFileSize) {
            alert('파일 크기가 허용(5MB) 범위를 초과합니다.');
            return false;
          }
        }

        return true;
      },
      async getFileGroupKey(){
        let sUrl = '/api/file/file-group-key/inqire';
        let postParam = {}
        // 결과 리턴
        let response = await this.common_postCall(sUrl, postParam);
        if(!response.HEADER.ERROR_FLAG){
          this.FILE_GROUP_KEY = response.DATA[0].FILE_GROUP_KEY;
        }
      },
      //파일 업로드
      uploadFiles(files) {

        let busiType = 'email';
        let pathType = 'files';
        let uploadUrl = "api/file/"+ busiType +"/"+ pathType +"/uploads";


        //파일 제한 체크 (빽엔드에서 체크 후 업로드 실패)
        for (let i = 0; i < files.length; i++) {
          const formData = new FormData();

          formData.append('action', uploadUrl);
          formData.append('method', "post");
          formData.append('custcoId', this.$store.getters['userStore/GE_USER_ROLE'].company.CD);  //회사구분
          formData.append('userfiles', files[i]); //파일(바이너리)
          formData.append('userId', this.$store.getters['userStore/GE_USER_ROLE'].userId);  //사용자ID

          formData.append('fileGroupKey', this.FILE_GROUP_KEY  );

          axios
              .post(uploadUrl, formData, {headers:{Authorization: "bearer " + window.sessionStorage.getItem("token")}})
              .then(response => {
                // 파일 업로드 성공 시 처리
                let leng = response.data.data.length
                for(let n=0;n<leng;n++) {
                  this.filelist.push({
                    index: this.mixin_isEmpty(this.filelist) ? n : this.filelist[this.filelist.length - 1].index + 1,
                    filename: response.data.data[n].actlFileNm,
                    filesize: response.data.data[n].fileSzDisplay,
                    download: false,
                    count: 0,
                    downloadFile: response.data.data[n].actlFileNm,
                    fileGroupKey: response.data.data[n].fileGroupKey,
                    fileKey: response.data.data[n].fileKey,
                  });
                }
              })
              .catch(error => {
                // 파일 업로드 실패 시 처리
                console.error(error);
              });
        }
        // 서버로 파일 업로드 요청을 보냅니다.
      },

      //파일 삭제 클릭
      removeFile(){
        // console.log("DEL_FILE", this.DEL_FILE.FILE_LIST);
        for(let i=0;i<this.DEL_FILE.FILE_LIST.length;i++){
          this.DEL_FILE_LIST.push(this.DEL_FILE.FILE_LIST[i]);
        }
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

      extractBodyFromHTML(htmlString) {
        // 정규 표현식을 사용하여 body 태그 및 내용 추출
        const bodyRegex = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
        const match = bodyRegex.exec(htmlString);
        
        if (match && match.length > 1) {
          return match[1]; // body 내용 반환
        } else {
          return htmlString; // body 태그가 없을 경우 htmlString 반환
        }
      },

      //메시지창 종료
      closeMsg(){
        this.$store.commit('alertStore/hideAlert');
      },

    },
    async mounted() {
      // console.log("mounted.." + this.CUST_EMAIL );
      if(this.FILE_GROUP_KEY == undefined || this.FILE_GROUP_KEY == ""){
        await this.getFileGroupKey(); //최초 dialog 호출시 파일그룹키 생성.
      }else{
        this.FILE_GROUP_KEY = this.fileGroupKey;
      }
    },
    updated() {
      //updated 최초 실행시에만 처리
      // editorData에 mounted 후 editorData의 html 태그가 없어지고 body 안의 태그만 남는다.
      if(this.isFirstUpdatedCall) {
        this.isFirstUpdatedCall = false;
        if(this.MODE == 'REPLY' && this.editorData != '') {
          this.editorData = '<div>&ZeroWidthSpace;<br/><br/><br/></div><div><font color="#4C5CBB"><b>---------- Original Message ----------</b></font></div>' + this.extractBodyFromHTML(this.editorData);
        }
      }
      
    },
    created() {
      this.initSendEmailDialog();

      //setSendInfoParm
      this.$eventBus.$off("setSendEmailParm"); //eventBus 중복방지를 위해 off
      this.$eventBus.$on("setSendEmailParm", (custEmail) => {
        this.setCustEmail(custEmail);
      });

      //setSndEmail
      this.$eventBus.$off("setSendEmail"); //eventBus 중복방지를 위해 off
      this.$eventBus.$on("setSendEmail", () => {
        this.setSendEmail();
      });

      //setSendEmailInit
      this.$eventBus.$off("setSendEmailInit"); //eventBus 중복방지를 위해 off
      this.$eventBus.$on("setSendEmailInit", () => {
        this.setSendEmailInit();
      });

    },
    computed: {
    },
    watch: {
      CUST_ID() {
        this.initSendEmailDialog();
      },
      CHT_CUTT_ID() {
        this.initSendEmailDialog();
      },
      SEND_TRGT_LIST(newList) {
        this.srvyTrgtList = newList;
      },
      RSVT_DT() {
        this.rsvtDt = this.RSVT_DT;
      }
    },
  }
</script>
<style lang="scss" scoped>
</style>