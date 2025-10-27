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
          {{ CONTS_DETAIL.KMS_CONTS_NM }}
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
          <p>{{ CONTS_DETAIL.CLSF_PATH }}</p>
          <p><span class="pl-desc">마지막 수정 : {{ CONTS_DETAIL.MDFCN_DT_F }}</span></p>
        </div>
      </div>
    </div>
    <!-- content -->
    <template v-if=" mixin_isEmpty( CONTS_DETAIL.GUIDE_LIST ) " >
        <div class="pl-list-nodata" style="height: calc(100vh - 211px);">
          <span>등록된 데이터가 없습니다.</span>
        </div>
      <!-- <div>
        등록된 가이드 및 상담 체크리스트가 존재 하지 않습니다.
      </div> -->
    </template>
    <div v-else class="pl-right-kms-detail-content" :style="DETAIL_STYLE">

      <h2 class="pl-subtit">가이드 및 상담 체크리스트</h2>
      <div class="pl-subdesc">
        <p>고객에게 필수로 안내 해야 할 내용입니다.</p>
      </div>
      <div class="pl-cols pr-2">
        <div>
          <ul class="pl-link-list is-mt-m type-2col-f" style="height: 195px">
            <li
              v-for="(item) in CONTS_DETAIL.GUIDE_LIST"
              :key="item.KMS_GUIDE_ID"
              @click="fnGuideLink(item)"
              :class="item.selected ? 'selected' : ''">
              <span class="pl-link-list-title ml-0" >{{ item.KMS_GUIDE_NM }}</span>
              <v-icon class="pl-icon20 arrow-link ml-auto"></v-icon>
            </li>
          </ul>
        </div>
        <div>
          <ul class="pl-link-list is-mt-m type-2col-b" style="height: 195px">
            <li class="pl-list-nodata" v-if=" mixin_isEmpty(GUIDE_CUTT) ">
              <span>등록된 데이터가 없습니다.</span>
            </li>
            <template v-else>
              <li
                v-for="(childItem) in GUIDE_CUTT"
                :key="childItem.KMS_GUIDE_CUTT_ID"
                @click="() => fnGuideLinkSub(childItem)"
                :class="childItem.selected ? 'selected' : ''"
                >
                <span class="pl-link-list-title ml-0">
                  <span v-show="childItem.ESNTL_YN === 'Y'"
                    class="is-txt-error">[필수]</span>
                  {{ childItem.KMS_GUIDE_CUTT_NM }}</span>
              </li>
            </template>
          </ul>
        </div>
      </div>
      <div>
        <right_kms_detail_guide
          :KMS_GUIDE_ID="selectedGuide.KMS_GUIDE_ID"
          :KMS_GUIDE_CUTT_ID="selectedCutt.KMS_GUIDE_CUTT_ID"
          @relContsClick="fnChgConts"
        >
        </right_kms_detail_guide>
      </div>
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
  },
  components: {
    right_kms_detail_guide,
  },
  data() {
    return {

      CONTS_DETAIL : {
        active : false
        , favorite: false
        , KMS_CONTS_ID : ""
        , KMS_CONTS_NM : ""
        , CLSF_PATH : ""
        , MDFCN_DT_F : ""
        , GUIDE_LIST : []
      },

      selectedGuide: {KMS_GUIDE_ID: ''},

      selectedCutt: {KMS_GUIDE_CUTT_ID : ''},
      GUIDE_CUTT : [],

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
    this.initDetailData();
  },
  mounted() {
    this.CONTS_DETAIL = this.$attrs.value;
    this.fnGetContsDetail();
  },
  methods: {
    initDetailData(){
      this.selectedGuide = {KMS_GUIDE_ID: ''};
      this.selectedCutt = {KMS_GUIDE_CUTT_ID : ''};
      this.GUIDE_CUTT = [];
    },
    moveBack(){
      this.$emit("detailContsBack");
      this.$emit("detailNewBack");
      this.$emit("detailMyBack");
      this.CONTS_DETAIL.active = false;
    },

    async fnGetContsDetail() {

      let sUrl = '/api/km/right/rightContsInfo';
      let postParam = {
        KMS_CONTS_ID : this.CONTS_DETAIL.KMS_CONTS_ID
      };

      let headParam = {
        head : {}
      };
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        if( response.CONTS_INFO && response.CONTS_INFO.length > 0 ) {
          let tmpInfo = response.CONTS_INFO[0];
          this.CONTS_DETAIL.KMS_CONTS_NM = tmpInfo.KMS_CONTS_NM;
          this.CONTS_DETAIL.MDFCN_DT_F = tmpInfo.MDFCN_DT_F;
          this.CONTS_DETAIL.CLSF_PATH = tmpInfo.CLSF_PATH;
          if( "Y" === tmpInfo.BOOK_MARK_YN ) {
            this.CONTS_DETAIL.favorite = true;
          } else {
            this.CONTS_DETAIL.favorite = false;
          }
          this.aniFavorite(this.CONTS_DETAIL.favorite);
        }

        if(response.GUIDE_LIST){
          this.CONTS_DETAIL.GUIDE_LIST = response.GUIDE_LIST;

          // 조회된 가이드가 있을때 첫번째 가이드 선택
          if( !this.mixin_isEmpty(this.CONTS_DETAIL.GUIDE_LIST) ) {
            this.fnGuideLink( this.CONTS_DETAIL.GUIDE_LIST[0] );
          }

        }
      }
    },

    fnGuideLink(item) {
      this.initDetailData();
      // 기존에 선택된 아이템이 있다면 선택을 해제합니다.
      this.CONTS_DETAIL.GUIDE_LIST.forEach((guide) => {
        guide.selected = false;
      });
      // 클릭된 아이템을 선택합니다.
      item.selected = true;
      this.selectedGuide = item;
      this.getGuideCuttInfo();
    },

    async getGuideCuttInfo() {
      if( this.selectedGuide.KMS_GUIDE_ID != '' ) {

        let sUrl = '/api/km/right/rightContsGuideCUTTList';
        let postParam = {
          KMS_GUIDE_ID : this.selectedGuide.KMS_GUIDE_ID
        };

        let headParam = {
          head : {}
        };
        let response  = await this.common_postCall(sUrl, postParam, headParam);
        if (!response.HEADER.ERROR_FLAG){
          if( response.GUIDE_CUTT ) {
            this.GUIDE_CUTT = response.GUIDE_CUTT;
            if( !this.mixin_isEmpty(this.GUIDE_CUTT) ) {
              this.fnGuideLinkSub( this.GUIDE_CUTT[0] );
            }
          }
        }
      } else {
        this.showAlert(this.MESSAGE.ALERT.NO_GUIDE);
      }
    },

    fnGuideLinkSub(item) {
      // 기존에 선택된 아이템이 있다면 선택을 해제합니다.
      this.GUIDE_CUTT.forEach((child) => {
        child.selected = false;
      });
      // 클릭된 아이템을 선택합니다.
      item.selected = true;
      this.selectedCutt = item;
    },

    fnChgFavorite() {
      this.CONTS_DETAIL.favorite = !this.CONTS_DETAIL.favorite;

      if( this.CONTS_DETAIL.favorite ) {
        this.chgBookMark('reg');
      } else {
        this.chgBookMark('del');
      }
      this.aniFavorite(this.CONTS_DETAIL.favorite);
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
        KMS_CONTS_ID : this.CONTS_DETAIL.KMS_CONTS_ID
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

    fnChgConts( contsId ){
      this.CONTS_DETAIL.KMS_CONTS_ID = contsId;
      this.fnGetContsDetail();
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