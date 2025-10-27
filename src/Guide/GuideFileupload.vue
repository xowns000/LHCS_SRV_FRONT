<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>
    <!-- //mark: Default -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <!-- 버튼 형식 -->
      <v-btn class="pl-btn is-sub" @click="clickAddFiles">파일등록버튼</v-btn>
      <input ref="fileUpload" type="file" multiple @change="handleFileUpload" style="display: none" />
      <!-- 파일 목록 -->
      <div class="mt-2">파일목록 :</div>
      <div class="file-tag-wrap">
        <span v-for="(file, index) in uploadedFiles" :key="index" class="file-tag">
          <template v-if="uploadedFiles.length !== 0">
            {{ getFileExtension(file.name)[0] }}<strong>.{{ getFileExtension(file.name)[1] }}</strong>
            <v-icon x-small class="pl-icon tab-close ml-1" @click="removeFile(index)"></v-icon>
          </template>
        </span>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: File grid -->
    <h2>{{ toplink[1] }}</h2>
    <guide-table PropTitle="Data Props" :PropTable="propsTable" />
    <div class="guide-card">
      <!-- component -->
      <!-- 첨부파일 -->
      <compo-file-grid
        TitleProp="이미지 파일"
        RequiredProp
        :HeadersProp="filelist_header"
        :FilesProp="filelist"
        @addFile="mixin_testLog('add file')"
        @removeFile="mixin_testLog('remove file')"
      >
        <template slot="infotext">
          <ul class="pl-list-info">
            <li>이미지는 최대 00개,  전체 용량은 0000kb까지 등록 가능합니다.<br>등록 가능한 이미지는 png, jpg만 가능합니다.</li>
          </ul>
        </template>
      </compo-file-grid>
    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />

    <!-- //mark: No data-->
    <h2>{{ toplink[2] }}</h2>
    <div class="guide-card">
      <!-- component -->
      <!-- no data -->
      <compo-file-grid
        TitleProp="이미지 파일"
        RequiredProp
        :HeadersProp="filelist_header"
        :FilesProp="filelist_nodata"
        @addFile="mixin_testLog('add file')"
        @removeFile="mixin_testLog('remove file')"
      >
      </compo-file-grid>
    </div>
    <guide-srcview :ModelProp.sync="source03" :SrcProp="srcAll.srcInput_03" />

    <!-- //mark: Vue2Drop -->
    <!-- <h2>{{ toplink[1] }}</h2>
    <div class="guide-card"> -->
      <!-- 뷰드랍존 -->
      <!-- <div class="mt-2">
        <vue-dropzone
          ref="vueDrop"
          id="file-upload"
          :options="dropzoneOptions"
          @vdropzone-files-added="handleFileAdded"
          @vdropzone-removed-file="handleFileRemoved"
          class="form-drop"
        >
        </vue-dropzone>
      </div> -->
      <!-- 파일 목록 -->
      <!-- <div class="mt-2">파일목록 :</div>
      <div class="file-tag-wrap">
        <span v-for="(file, index) in vueUploadedFiles" :key="index" class="file-tag">
          <template v-if="vueUploadedFiles.length !== 0">
            {{ getFileExtension(file)[0] }}<strong>.{{ getFileExtension(file)[1] }}</strong>
            <v-icon x-small class="pl-icon tab-close ml-1" @click="removeVueFile(index)"></v-icon>
          </template>
        </span>
      </div>
    </div> -->
    <!-- <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" /> -->
  </div>
</template>

<script>
import vueDropzone from 'vue2-dropzone'
import guideJs from '@/Guide/guide.js'
import axios from "axios";
export default {
  name: "GuideFileupload",
  props:{
    SelectedProp: {
      type: String,
    }
  },
  components: {
    vueDropzone
  },
  data() {
    return {
      toplink: [
        'Default',
        'File Grid',
        'No Data',
        // 'Vue2Drop'
      ],
      source01: null,
      source02: null,
      source03: null,

      propsTable: [
        { name: 'TitleProp', type: 'String', default: '첨부 파일', description: '타이틀' },
        { name: 'SmallTitleProp', type: 'Boolean', default: 'false', description: '타이틀 폰트 작은거' },
        { name: 'RequiredProp', type: 'Boolean', default: 'false', description: '필수 표시' },
        { name: 'NoMarginProp', type: 'Boolean', default: 'false', description: '타이틀 상단 여백' },
        { name: 'HeadersProp', type: 'Array', default: '파일명, 크기, 다운로드, 다운로드 수', description: 'file header'},
        { name: 'FilesProp', type: 'Array', default: 'null', description: 'file data', required: true},
        { name: 'HeaderButtonProp', type: 'Boolean', default: 'true', description: '상단 추가 삭제 버튼'},
      ],

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<!-- 버튼 형식 -->
<v-btn class="pl-btn is-sub" @click="clickAddFiles">파일등록</v-btn>
<input ref="fileUpload" type="file" multiple @change="handleFileUpload" style="display: none" />
<!-- 파일 목록 -->
<div class="mt-2">파일목록 :</div>
<div class="file-tag-wrap">
  <span v-for="(file, index) in uploadedFiles" :key="index" class="file-tag">
    <template v-if="uploadedFiles.length !== 0">
      {{ getFileExtension(file.name)[0] }}<strong>.{{ getFileExtension(file.name)[1] }}</strong>
      <v-icon x-small class="pl-icon tab-close ml-1" @click="removeFile(index)"></v-icon>
    </template>
  </span>
</div>`
          },
          { tab: "script", content:
`data () {
  return {
    uploadedFiles: [],
  }
},
methods:{
  getFileExtension(filename) {
    return filename.split('.');
  },
  clickAddFiles() {
    this.$refs.fileUpload.click()
  },
  handleFileUpload(event) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.uploadedFiles.push(files[i]);
    }
  },
  removeFile(index) {
    this.uploadedFiles.splice(index, 1);
  },
}` },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`<compo-file-grid
  TitleProp="이미지 파일"
  RequiredProp
  :HeadersProp="filelist_header"
  :FilesProp="filelist"
  @addFile="mixin_testLog('add file')"
  @removeFile="mixin_testLog('remove file')"
>
  <template slot="infotext">
    <ul class="pl-list-info">
      <li>이미지는 최대 00개,  전체 용량은 0000kb까지 등록 가능합니다.<br>등록 가능한 이미지는 png, jpg만 가능합니다.</li>
    </ul>
  </template>
</compo-file-grid>`
          },
          { tab: "script", content:
`filelist_header: [
  { text: '파일명', value: 'filename', align: 'left',sortable: false },
  { text: '크기', value: 'filesize', align: 'left',sortable: false , width: '100px'},
],
filelist: [
  {
    filename : '포인트 업종별 적립율 상세 정보.pdf',
    filesize : '1024KB',
  },
  {
    filename : '22포인트 업종별 적립율 상세 정보.pdf',
    filesize : '12024KB',
  },
],` },
        ],
        srcInput_03: [
          {
            tab: "html",
            content:
`<compo-file-grid
  TitleProp="이미지 파일"
  RequiredProp
  :HeadersProp="filelist_header"
  :FilesProp="filelist_nodata"
  @addFile="mixin_testLog('add file')"
  @removeFile="mixin_testLog('remove file')"
>
</compo-file-grid>`
          },
          { tab: "script", content:
`data() {
  return {
    filelist_nodata: [],
  }
},
methods: {

},
computed: {

},` },
        ],

        srcInput_04: [
          {
            tab: "html",
            content:
`<!-- 뷰드랍존 -->
<div class="mt-2">
  <vue-dropzone
    ref="vueDrop"
    id="file-upload"
    :options="dropzoneOptions"
    @vdropzone-files-added="handleFileAdded"
    @vdropzone-removed-file="handleFileRemoved"
    class="form-drop"
  >
  </vue-dropzone>
</div>
<!-- 파일 목록 -->
<div class="mt-2">파일목록 :</div>
<div class="file-tag-wrap">
  <span v-for="(file, index) in vueUploadedFiles" :key="index" class="file-tag">
    <template v-if="vueUploadedFiles.length !== 0">
      {{ getFileExtension(file)[0] }}<strong>.{{ getFileExtension(file)[1] }}</strong>
      <v-icon x-small class="pl-icon tab-close ml-1" @click="removeVueFile(index)"></v-icon>
    </template>
  </span>
</div>`
          },
          { tab: "script", content:
`data () {
  return {
    vueUploadedFiles: [],
    dropzoneOptions: {
      autoProcessQueue: true,
      url: process.env.VUE_APP_API_URL,
      paramName: 'file',
      maxThumbnailFilesize: 1,
      maxFiles: 5,
      maxFilesize: 5,
      duplicateCheck: true,
      thumbnailMethod: "crop",
      addRemoveLinks: true,
      clickable: true,
      uploadMultiple: true,
      dictRemoveFile: '삭제',
      dictCancelUpload: "취소",
    }
  }
},
methods: {
  // vue drop
  getFileExtension(filename) {
    return filename.split('.');
  },
  handleFileAdded(file) {
    for (let i = 0;i<file.length;i++){
      this.vueUploadedFiles.push(file[i].name);
    }
  },
  handleFileRemoved(file){
    const index = this.vueUploadedFiles.indexOf(file.name);
    if (index !== -1) {
      this.vueUploadedFiles.splice(index, 1);
    }
  },
  removeVueFile(index) {
    const file = this.$refs.vueDrop.getAcceptedFiles()[index];
    this.$refs.vueDrop.removeFile(file);
  },
}` },
        ],
      },

      // 첨부파일, 첨부파일업로드 팝업 변수
      uploadedFiles: [],
      vueUploadedFiles: [],
      dropzoneOptions: {
        autoProcessQueue: true,
        url: process.env.VUE_APP_API_URL,
        paramName: 'file',
        maxThumbnailFilesize: 1,
        maxFiles: 5,
        maxFilesize: 5,
        duplicateCheck: true,
        thumbnailMethod: "crop",
        addRemoveLinks: true,
        clickable: true,
        uploadMultiple: true,
        dictRemoveFile: '삭제',
        dictCancelUpload: "취소",
      },

      // file grid
      filelist_header: [
        { text: '파일명', value: 'filename', align: 'left',sortable: false },
        { text: '크기', value: 'filesize', align: 'left',sortable: false , width: '100px'},
      ],
      filelist: [
        {
          filename : '포인트 업종별 적립율 상세 정보.pdf',
          filesize : '1024KB',
        },
        {
          filename : '22포인트 업종별 적립율 상세 정보.pdf',
          filesize : '12024KB',
        },
      ],
      filelist_nodata: [

      ],

    }
  },
  methods: {
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

      //파일명 출력
      for (let i = 0; i < files.length; i++) {
        this.uploadedFiles.push(files[i]);
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
      let busiType = 'bbs';
      let pathType = 'images';
      let uploadUrl = "api/file/"+ busiType +"/"+ pathType +"/uploads";

      //파일 제한 체크 (빽엔드에서 체크 후 업로드 실패)
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('action', uploadUrl);
        formData.append('method', "post");
        formData.append('custcoId', "1");                 //회사구분 : 1은 시스템(가이드)
        formData.append('userId', "2");                   //사용자 ID : 2는 시스템(가이드)
        formData.append('userfiles', files[i]);           //파일(바이너리)
      }
      // 서버로 파일 업로드 요청을 보냅니다.
      axios
      .post( uploadUrl, formData , {headers:{Authorization: "bearer " + window.sessionStorage.getItem("token")}} )
        .then(response => {
          // 파일 업로드 성공 시 처리
          // console.log(response.data);
        })
        .catch(error => {
          // 파일 업로드 실패 시 처리
          console.error(error);
      });
    },

    removeFile(index) {
      this.uploadedFiles.splice(index, 1);
    },

    // vue drop
    getFileExtension(filename) {
      return filename.split('.');
    },
    handleFileAdded(file) {
      for (let i = 0;i<file.length;i++){
        this.vueUploadedFiles.push(file[i].name);
      }
    },
    handleFileRemoved(file){
      const index = this.vueUploadedFiles.indexOf(file.name);
      if (index !== -1) {
        this.vueUploadedFiles.splice(index, 1);
      }
    },
    removeVueFile(index) {
      const file = this.$refs.vueDrop.getAcceptedFiles()[index];
      this.$refs.vueDrop.removeFile(file);
    },



  },
  computed: {
  },
  mounted() {
    guideJs.appendHiddenLink(this.toplink);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.file-tag-wrap{
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.file-tag-wrap .file-tag {
  background-color: rgb(224, 224, 224);
  display: inline-block;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  vertical-align: bottom;
}

.form-drop.dropzone .dz-preview.dz-error:hover .dz-error-message{
  top: 10px;
}

</style>