<template>
  <div class="modal-wrap">
    <h1 class="tit-h1 d-flex">
      {{ headerTitle }}
      <div class="ml-auto align-self-center">
        <v-icon x-small class="svg-close20" @click="$emit('hide')">mdi-close</v-icon>
      </div>
    </h1>
    <div class="modal-box">
      <div class="box-ct">
        <div class>
          <div>
            <vue-dropzone
              class="form-drop"
              ref="myVueDropzone"
              id="dropzone"
              :options="dropzoneOptions"
              @vdropzone-success-multiple="uploadSuccess"
            ></vue-dropzone>
          </div>
          <div class="text-right mt-3 ">
            <v-btn outlined class="btn-default" @click="upload">업로드</v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mixin} from '@/mixin/mixin.js'
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";


export default {
  name: "MENU_M510201P09",
  components: {
    vueDropzone: vue2Dropzone,
  },
  mixins : [mixin],
  props: {
    headerTitle: {
      type: String,
      default: '파일 업로드'
    },
    ASP_NEWCUST_KEY : "",
    fileGroupKey : "",
    pathType : "", //publics,files,images,videos
    busiType : "", //palette, phone, chat, km, bbs
    acceptedFiles : "",
    userOptions: {},
    sms : '',
    alrim: '',
    url:'',
  },
  data() {
    return {
        FILE_GROUP_KEY : "",
      fileInfo: {
        type: Object,
        value: {},
      },
      files: [],
      dropzoneOptions: {
        autoProcessQueue: false,
        url: (this.url != '' && this.url != null && this.url != undefined ? this.url : process.env.VUE_APP_API_URL )+ "api/file/"+ this.busiType +"/"+ this.pathType +"/uploads" ,    //파일 업로드 api 변경하면 업로드 불가
        maxThumbnailFilesize: 1,
        thumbnailWidth: 120,
        thumbnailHeight: 120,
        thumbnailMethod: "crop",
        maxFilesize: this.sms == 'Y' ? 0.5 : this.alrim == 'Y'? 0.3 : 5.2,
        maxFiles: this.sms == 'Y' ? 3 : this.alrim == 'Y'? 1 : 10,
        addRemoveLinks: true,
        clickable: true,
        dictRemoveFile: '삭제',
        dictCancelUpload: "취소",
        acceptedFiles: this.sms == 'Y' ? ".jpg" : this.acceptedFiles, //".png,.jpg,.gif,.jpeg,.doc,.docx,.pdf,.csv,.xls,.xlsx,.ppt",
        parallelUploads: 1,
        uploadMultiple: true,
        filesizeBase: 1000,

        paramName: "userfiles",
        /*
        paramName: function(e){
          return "userfiles"
        },
        */

        headers: {
          'Authorization': "bearer " + window.sessionStorage.getItem("token"),

        },
        params: {
          'aspNewCustKey': this.ASP_NEWCUST_KEY,
          'aspCustKey': this.ASP_NEWCUST_KEY,
          'procId': this.$store.getters['userStore/GE_USER_ROLE'].userId,
          'acceptedFiles': this.sms == 'Y' ? ".jpg" : this.acceptedFiles,
          'uploadUri': this.sms == 'Y'?'/home/mts/agent_smsmms/content' : this.alrim == 'Y'? '/home/mts/agent_alimtalk/content' : "/api/file/"+ this.busiType +"/"+ this.pathType +"/uploads",    //업로드 경로설정
          'downloadUri': this.sms == 'Y'?'/home/mts/agent_smsmms/content' : this.alrim == 'Y'? '/home/mts/agent_alimtalk/content' : "/api/file/"+ this.busiType +"/"+ this.pathType +"/download", //업로드 경로설정
          'fileUploadLib': "dropzone",
          'dir': this.sms == 'Y'?'/home/mts/agent_smsmms/content' : this.alrim == 'Y'? '/home/mts/agent_alimtalk/content' : this.busiType+"/" + this.pathType,               //업로드 경로설정
          //'maxFilesize': 5,
          'targetType': "FILE",
          'fileGroupKey' : this.FILE_GROUP_KEY,
        },

      },
    };
  },
  computed: {
  },
  watch: {},
  created() {
    // userOptions 추가
    if(!this.mixin_isEmpty(this.userOptions)){
      for( let prop in this.userOptions ){
        if( !this.mixin_isEmpty(this.dropzoneOptions[prop]) && !this.mixin_isEmpty(this.userOptions[prop]) ){
          this.dropzoneOptions[prop] = this.userOptions[prop];
        }
      }
    }
  },
  async mounted() {
      if(this.fileGroupKey == undefined || this.fileGroupKey == ""){
          // console.log(this.FILE_GROUP_KEY);
          await this.getFileGroupKey();
          // console.log(this.FILE_GROUP_KEY);
      }else{
          this.FILE_GROUP_KEY = this.fileGroupKey;
      }

      this.dropzoneOptions.params.fileGroupKey = this.FILE_GROUP_KEY;
  },
  methods: {
    async getFileGroupKey(){
    let requestData = {
        headers: {},
        sendData:{}
      };
      // header 세팅
      requestData.headers["URL"] = "/api/file/file-group-key/inqire";
      requestData.headers["SERVICE"] = "file.file-group-key";
      requestData.headers["METHOD"] = "inqire";
      requestData.headers["TYPE"] = "BIZ_SERVICE";
      requestData.headers["ASYNC"] = false;

      // sendData 세팅
      requestData.sendData['FILE_GROUP_KEY'] = this.fileGroupKey;

      // 결과 리턴
      let response = await this.common_postCall(requestData);

      if(!response.HEADER.ERROR_FLAG){
          this.FILE_GROUP_KEY = response.DATA[0].FILE_GROUP_KEY;

      }
    },
    async upload(){
      // console.log("this.url", this.url);
      let token = window.sessionStorage.getItem("token");
      this.dropzoneOptions.headers.Authorization = "bearer " + token;
      let get_files = this.$refs.myVueDropzone.getQueuedFiles();


      for (let i = 0;i<get_files.length;i++){
        this.files[i] = get_files[i].upload.filename;
      }

      this.fileInfo.file = this.files;
      // console.log("this.files", this.files);
      await this.$refs.myVueDropzone.processQueue();


      // console.log("get_files", get_files);
    },
    uploadSuccess(files, response){
      if(this.alrim == 'Y'){
        const fileInput = files[0];
        const formData = new FormData();
        formData.append("image", fileInput);
        response.data[0]["imgForm"] = formData;
      }
      this.$emit('submit', response.data);
    },

  },
  activated() {},
  deactivated() {},
  destroyed() {},
};
</script>

<style scoped></style>
