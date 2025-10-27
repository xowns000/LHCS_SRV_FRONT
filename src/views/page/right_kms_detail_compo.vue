<template>
  <div>
    <!-- header -->
    <div class="pl-right-kms-detail-header" v-if=" HEAD_VIEW === 'Y' ">
      <!-- 뒤로 버튼 -->
      <compo-tooltip-btn
        TitleProp="뒤로 가기"
        ClassProp="pl-tooltip-btn"
        IconProp="pl-icon20 back-arrow"
        TooltipPositionProp="bottom"
        @btnClick="moveBack"
      ></compo-tooltip-btn>
      <div class="ml-3">
        <strong class="d-flex align-center">
          {{ CONTENT_INFO.KMS_CONTS_NM }}
          <div
            @click="fnChgFavorite"
            style="position: relative; cursor: pointer;">
            <vLottiePlayer
              name="lottieFavorite"
              :autoplay=false
              width="60px"
              height="60px"
              style="position: absolute; top: -29px; left: -13px;"
              :animationData="require('@/assets/lottie/animation_favorite.json')"
              @animControl="anim => (lottieFavorite = anim)"
            />
          </div>
        </strong>
        <div class="mt-1">
          <p>{{ CONTENT_INFO.CLSF_PATH }}</p>
          <p><span class="pl-desc">마지막 수정 : {{ CONTENT_INFO.MDFCN_DT_F }}</span></p>
        </div>
      </div>
    </div>
    <!-- content -->
    <template v-if=" mixin_isEmpty( CONTENT_INFO.KMS_CONTS_ID ) " >
        <div class="pl-list-nodata" style="height: calc(100vh - 211px);">
          <span>등록된 데이터가 없습니다.</span>
        </div>
      <!-- <div>
        등록된 가이드 및 상담 체크리스트가 존재 하지 않습니다.
      </div> -->
    </template>
    <div v-else class="pl-right-kms-detail-content" :style="DETAIL_STYLE">



      <right_kms_detail_guide
        :KMS_CONTS_ID="CONTENT_INFO.KMS_CONTS_ID"
        :PUBLIC_YN="PUBLIC_YN"
        @relContsClick="fnChgConts"
        @afterChangeContent="afterChangeContent"
      >
      </right_kms_detail_guide>



    </div>
  </div>
</template>

<script>
  import right_kms_detail_guide from './right_kms_detail_guide.vue';

  export default {
  name: "right_kms_detail",
  props: {
    HEAD_VIEW :{
      type: String,
      default: "Y",
    },
    DETAIL_STYLE :{
      type : String,
      default : "",
    },
    PUBLIC_YN :{
      type : String,
      default : "Y",
    },
  },
  components: {
    right_kms_detail_guide,
  },
  data() {
    return {
      CONTENT_MODEL: {},
      CONTENT_INFO : {},
      REL_CONTENT_LIST : [],
      REL_LINK_LIST : [],
      ATTACH_FILE_LIST : [],
      showRelConts : {type: Boolean , default: true},
      showRelLinks : {type: Boolean , default: true},
      showRelFiles : {type: Boolean , default: true},

      REL_CONTENT_HISTORY : [],

      MESSAGE : {
        ALERT : {
          SUCCESS : {alertDialogToggle: true, msg: '정상 처리 되었습니다.', iconClass: 'is-info', type: 'default'}
          , NO_GUIDE : {alertDialogToggle: true, msg: '가이드를 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
          , NO_LINK_URL : {alertDialogToggle: true, msg: 'URL이 존재하지 않습니다.', iconClass: 'is-caution', type: 'default'}
          , BMK_ON_SUCCESS_TOAST: {  msg: '즐겨찾기가 추가되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          , BMK_OFF_SUCCESS_TOAST: {  msg: '즐겨찾기가 삭제되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        }
      },
      lottieFavorite: null,
    }
  },
  watch: {
  },
  computed: {
  },
  created() {
  },
  mounted() {
    this.CONTENT_MODEL = this.$attrs.value
    // this.initKmsContent(this.CONTENT_MODEL)

    this.CONTENT_INFO = this.CONTENT_MODEL
  },
  methods: {
    
    moveBack(){
      if(!!this.REL_CONTENT_LIST && this.REL_CONTENT_LIST.length > 0) {
        const contsId = this.REL_CONTENT_LIST[this.REL_CONTENT_LIST.length-1]
        this.CONTENT_INFO.KMS_CONTS_ID = contsId
        this.REL_CONTENT_LIST.pop()
      } else {
        this.$emit("detailContsBack");
        this.$emit("detailNewBack");
        this.$emit("detailMyBack");
        this.CONTENT_MODEL.active = false;
      }
      
    },

    initContentInfoData(item) {
      this.CONTENT_INFO = item
    },

    initKmsContent(item) {
      this.CONTENT_INFO = item
      if(this.CONTENT_INFO.BOOK_MARK_YN == undefined) {
        this.CONTENT_INFO.BOOK_MARK_YN = "N";
      }
      
      if( "Y" === this.CONTENT_INFO.BOOK_MARK_YN ) {
        this.CONTENT_INFO.favorite = true;
      } else {
        this.CONTENT_INFO.favorite = false;
      }
      this.aniFavorite(this.CONTENT_INFO.favorite);
    },

    fnChgFavorite() {
      this.CONTENT_INFO.favorite = !this.CONTENT_INFO.favorite;

      if( this.CONTENT_INFO.favorite ) {
        this.chgBookMark('reg');
      } else {
        this.chgBookMark('del');
      }
      this.aniFavorite(this.CONTENT_INFO.favorite);
    },

    // favorite animation
    aniFavorite(flag){
      const PLAYBACK_RANGE = [30, 119];
      const lottieFavorite = this.lottieFavorite;

      if (flag) {
          lottieFavorite.playSegments(PLAYBACK_RANGE, true);
      } else {
        try{
          if(lottieFavorite) lottieFavorite.goToAndStop(0, true);
        }catch(e){console.error(e);}
      }
    },

    async chgBookMark( gubun ){
      let sUrl = "";
      if( "del" === gubun ) {
        sUrl = "/api/km/right/rightDelUserConts";
      } else {
        sUrl = "/api/km/right/rightRegUserConts";
      }
      let postParam = {
        KMS_CONTS_ID : this.CONTENT_INFO.KMS_CONTS_ID
      };

      let headParam = {head : {}};
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        // console.log(response.DATA);
        if( "del" === gubun ) {
          this.showToast(this.MESSAGE.ALERT.BMK_OFF_SUCCESS_TOAST);
        } else {
          this.showToast(this.MESSAGE.ALERT.BMK_ON_SUCCESS_TOAST);
        }
      }
      this.$emit("updBadgeCnt");  // 상단 Badge Count 재조회
    },



    fnChgConts(contsId, prevContsId){
      this.CONTENT_INFO.KMS_CONTS_ID = contsId
      this.REL_CONTENT_LIST.push(prevContsId)
    },

    afterChangeContent(item) {
      this.initKmsContent(item)
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