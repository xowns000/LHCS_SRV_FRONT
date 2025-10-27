<template>
  <div>
    <div v-html=" CONTENT_INFO.KMS_CONTS_CN_HMTL "
      class="pr-2">
    </div>
    <div class="pl-tags-wrap is-mt-m">
      <v-chip-group
        active-class="active-tag"
        column
      >
        <v-chip
          v-for="tag, index in CONTENT_INFO.KEYWD_NM_LIST"
          v-show="tag"
          :key="index"
        >
          {{ tag }}
        </v-chip>
      </v-chip-group>
    </div>
    <template v-if=" !mixin_isEmpty(REL_CONTENT_LIST) && showRelConts">
      <h2 class="pl-subtit is-mt-l">관련 콘텐츠</h2>
      <ul class="pl-link-list is-mt-m mr-2">
        <li v-for="item in REL_CONTENT_LIST" :key="item.KMS_REL_CONTS_ID" @click="relContsClick(item.KMS_REL_CONTS_ID)">
          <v-icon class="pl-icon20 in-search"></v-icon>
          <span class="pl-link-list-title" >{{ item.KMS_CONTS_NM }}</span>
        </li>
      </ul>
    </template>

    <template v-if=" !mixin_isEmpty(REL_LINK_LIST) && showRelLinks">
      <h2 class="pl-subtit is-mt-l">관련 링크</h2>
      <ul class="pl-link-list is-mt-m mr-2">
        <li v-for="item in REL_LINK_LIST" :key="item.KMS_REL_LNK_ID" @click="fnOpenRelLink(item)">
          <v-icon class="pl-icon20 url-link"></v-icon>
          <span class="pl-link-list-title" >{{ item.REL_LNK_NM }}</span>
        </li>
      </ul>
    </template>

    <template v-if=" !mixin_isEmpty(ATTACH_FILE_LIST) && showRelFiles">
      <div class="pr-2">
        <compo-file-grid
          :HeadersProp="FILE_HEADER"
          :FilesProp="ATTACH_FILE_LIST"
          :HeaderButtonProp="false"
        >
          <template slot="infotext">
          </template>
        </compo-file-grid>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
  name: "right_kms_detail_guide",
  props: {
    KMS_CONTS_ID : {type: String , default: ''},
    PUBLIC_YN : {type: String , default: 'Y'},
    showRelConts : {type: Boolean , default: true},
    showRelLinks : {type: Boolean , default: true},
    showRelFiles : {type: Boolean , default: true},
  },
  components: {
  },
  data() {
    return {

      CONTENT_INFO : {},
      REL_CONTENT_LIST : [],
      REL_LINK_LIST : [],
      ATTACH_FILE_LIST : [],

      FILE_HEADER: [
        { text: '파일명', value: 'filename', align: 'left',sortable: false },
        { text: '크기', value: 'filesize', align: 'left',sortable: false , width: '100px'},
        { text: '다운로드', value: 'download', align: 'center',sortable: false, width: '100px' }
      ],

      MESSAGE : {
        ALERT : {
          SUCCESS : {alertDialogToggle: true, msg: '정상 처리 되었습니다.', iconClass: 'is-info', type: 'default'}
          , NO_GUIDE : {alertDialogToggle: true, msg: '가이드를 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
          , NO_LINK_URL : {alertDialogToggle: true, msg: 'URL이 존재하지 않습니다.', iconClass: 'is-caution', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        }
      },
    }
  },
  watch: {
    KMS_CONTS_ID(){
      this.initDetailData();
      if(!this.mixin_isEmpty(this.KMS_CONTS_ID)) {
        this.$nextTick(()=>{this.getKmsContentInfo();});
      }
    }
  },
  computed: {
  },
  created() {
    this.initDetailData();
    this.getKmsContentInfo()
  },
  mounted() {
  },
  methods: {
    initDetailData(){
      this.CONTENT_INFO = {};
      this.REL_CONTENT_LIST = [];
      this.REL_LINK_LIST = [];
      this.ATTACH_FILE_LIST = [];
    },

    async getKmsContentInfo() {
      if(!!!this.KMS_CONTS_ID) {
        return
      }
      let sUrl = '/api/km/right/rightContsInfo';
      let headParam = {head : {}};
      let postParam = {
        KMS_CONTS_ID : this.KMS_CONTS_ID
      };
      if(this.PUBLIC_YN == 'Y') {
        postParam.STTS_CD = 'PBIC'
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        if( response.CONTENT_INFO ) {
          this.CONTENT_INFO = response.CONTENT_INFO[0];
          if( "Y" === this.CONTENT_INFO.BOOK_MARK_YN ) {
            this.CONTENT_INFO.favorite = true;
          } else {
            this.CONTENT_INFO.favorite = false;
          }
          if(!!this.CONTENT_INFO.KEY_WORD) {
            this.CONTENT_INFO.KEYWD_NM_LIST = this.CONTENT_INFO.KEY_WORD.split(",")
          } else {
            this.CONTENT_INFO.KEYWD_NM_LIST = []
          }
          this.CONTENT_INFO.KMS_CONTS_CN_HMTL = this.CONTENT_INFO.SE_CD === 'KNOWLEDGE' ? this.restoreXSS_CKeditor(this.CONTENT_INFO.KMS_CONTS_CN) : this.fnNewLineToBr(this.CONTENT_INFO.KMS_CONTS_CN)
          this.CONTENT_INFO.active = true

          this.$emit("afterChangeContent", this.CONTENT_INFO);
          
        }
        if( response.REL_CONTENT_LIST ) {
          this.REL_CONTENT_LIST = response.REL_CONTENT_LIST;
        }
        if( response.REL_LINK_LIST ) {
          this.REL_LINK_LIST = response.REL_LINK_LIST;
        }
        if( response.ATTACH_FILE_LIST ) {
          this.ATTACH_FILE_LIST = []
          let arrFile = response.ATTACH_FILE_LIST;
          for( let i = 0 ; i < arrFile.length ; i++ ) {
            this.ATTACH_FILE_LIST.push({
              index : i,
              filename : arrFile[i].ACTL_FILE_NM,
              filesize : this.formatBytes(arrFile[i].FILE_SZ),
              download : true,
              busiType: arrFile[i].TASK_TYPE_CD,
              pathType: arrFile[i].PATH_TYPE_CD,
              ORIGINAL_FILENAME : arrFile[i].ACTL_FILE_NM,
              FILE_GROUP_KEY : arrFile[i].FILE_GROUP_KEY,
              FILE_KEY : arrFile[i].FILE_KEY,
              fileGroupKey : arrFile[i].FILE_GROUP_KEY,
              fileKey : arrFile[i].FILE_KEY,
              filename : arrFile[i].ACTL_FILE_NM,
              DNLOD_CNT : arrFile[i].DWNLD_CNT,
            });
          }
        }
      }
    },

    //개행 문자 to <br /> 태그 변환
    fnNewLineToBr(str) {
      return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
    },

    relContsClick( contsId ){
      this.$emit("relContsClick",contsId, this.KMS_CONTS_ID);
    },

    fnOpenRelLink( item ){
      if( !this.mixin_isEmpty( item.REL_LNK_URL ) ) {
        window.open(item.REL_LNK_URL, '_blank');
      } else {
        this.showAlert(this.MESSAGE.ALERT.NO_LINK_URL);
      }
    },

    // 파일크기 포맷
    formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },

  },
}
</script>

<style lang="scss" scoped>

</style>