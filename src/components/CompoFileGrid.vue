<template>
  <div>
    <div :class="`pl-grid-top ${NoMarginProp ? '' : 'is-mt-m'}`">
      <div class="pl-grid-top-left">
        <strong class="pl-filegrid-title" :class="SmallTitleProp ? 'is-small' : ''">{{ TitleProp }}</strong>
        <v-icon
          v-show="RequiredProp"
          class="pl-icon20 required"
          />
      </div>
      <div class="pl-grid-top-utils" v-if="HeaderButtonProp">
        <v-btn class="pl-btn is-icon is-sub" @click="addFile">
          <span class="pl-icon20 circle-plus"></span>
          추가
        </v-btn>
        <v-btn class="pl-btn is-icon is-sub" @click="removeFile">
          <span class="pl-icon20 trash"></span>
          삭제
        </v-btn>
      </div>
    </div>
    <v-data-table
      :show-select="HeaderButtonProp"
      v-model="selectedFile"
      :class="`pl-grid ${HeaderButtonProp ? 'has-control' : null}`"
      :headers="HeadersProp"
      :items="FilesProp"
      fixed-header
      item-key="index"
      height="165px"
      :items-per-page="-1"
      hide-default-footer
      :page.sync="page"
      no-data-text="등록된 데이터가 없습니다."
      @page-count="pageCount = $event">
      <template v-slot:item.download="{ item }">
        <!-- <v-btn
          class="pl-btn is-sub is-sm"
          @click="downloadFile(item.downloadFile)"
          :disabled="!item.download">다운로드</v-btn> -->
          <v-btn
          class="pl-btn is-sub is-sm"
          @click="mixin_fileDownload(item, item.busiType, item.pathType)"
          :disabled="!item.download">다운로드</v-btn>
      </template>
    </v-data-table>
    <slot name="infotext"></slot>
  </div>
</template>

<script>
  export default {
    props: {
      TitleProp: {
        type: String,
        default: '첨부 파일'
      },
      HeaderButtonProp: {
        type: Boolean,
        default: true,
      },
      FilesProp: {
        type: Array,
      },
      RequiredProp: {
        type: Boolean,
        default: false,
      },
      SmallTitleProp: {
        type: Boolean,
        default: false,
      },
      NoMarginProp: {
        type: Boolean,
        default: false,
      },
      HeadersProp: {
        type: Array,
        default: function() {
          return [
            // { text: '번호', value: 'index', align: ' d-none',sortable: false},
            { text: '파일명', value: 'filename', align: 'left',sortable: false, },
            { text: '크기', value: 'filesize', align: 'center',sortable: false, width: '90px' },
            { text: '다운로드', value: 'download', align: 'center',sortable: false, width: '100px' },
            { text: '다운로드 수', value: 'count', align: 'center',sortable: false, width: '100px' },
          ]
        }
      },
      DelData:{
        type: Array,
        value: {},
      },
    },
    data() {
      return {
        page: 1,
        pageCount: 0,
        headersFile: this.HeadersProp,
        selectedFile: [],
        MESSAGE : {
          ALERT : {
            CHECK_NON : {alertDialogToggle: true, msg: '항목을 선택하십시오.', iconClass: 'is-caution', type: 'default'}
          }
        }
      }
    },
    methods: {
      addFile(e) {
        this.$emit('addFile', e);
      },

      removeFile(e) {
        // console.log('e', e);
        this.DelData.FILE_LIST = this.selectedFile;

        if(!this.mixin_isEmpty(this.selectedFile)){
          for(let i=0; i<this.FilesProp.length; i++){
            for(let j=0; j<this.selectedFile.length; j++){
              if(this.FilesProp[i].fileKey === this.selectedFile[j].fileKey){
                this.FilesProp.splice(this.FilesProp.indexOf(this.FilesProp[i]), 1);
                // console.log('indexOf:::', this.FilesProp.indexOf(this.FilesProp[i]));
              }
            }
          }
          this.selectedFile=[];
        }else{
          this.showAlert(this.MESSAGE.ALERT.CHECK_NON);
          // this.showAlert({alertDialogToggle: true, msg: "항목을 선택하십시오.", iconClass: 'is-done', type: 'default'});
        }
        this.$emit('removeFile', this.DelData);
      },

      downloadFile(item) {
        // 파일 다운로드 로직을 구현합니다.
        // 예시: 다운로드 링크를 생성하고 클릭 이벤트를 발생시킵니다.
        const downloadLink = document.createElement('a');
        downloadLink.href = item.fileUrl; // 파일의 URL을 설정합니다.
        downloadLink.download = item.fileName; // 다운로드될 파일의 이름을 설정합니다.
        downloadLink.click();
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>