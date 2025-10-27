<template>
  <div class="pl-card d-flex flex-grow-1 flex-column">
    <!-- 이커머스 상단,컨텐츠 -->
    <div v-if="!demoVideoMode"
        class="pl-chat-email-wrap">
      <!-- 이커머스 상단 정보 -->
      <div v-if="BBS_CUTT_INFO.INQRY_NO" class="pl-chat-email-wrap-top">
        <v-icon :class="`pl-icon30 mainchat-${ BBS_CUTT_INFO.LKAG_BEAN_ID }`" style="flex: 0 0 30px;"></v-icon>
<!--        <v-icon class="pl-icon30 is-nstore" style="flex: 0 0 30px;"></v-icon>-->
        <div class="is-ellips">
          <strong>{{ mixin_isEmpty(BBS_CUTT_INFO.INQRY_TTL) ? '게시판 상담 문의' : mixin_decode(BBS_CUTT_INFO.INQRY_TTL) }}</strong>
          <div>
            <span class="pl-chat-email-wrap-title">
              제휴몰
            </span>
            <span class="pl-chat-email-wrap-desc">
              {{ CHAT_LIST_DATA.CLK_DATA.CHNL_NM }}
            </span>
          </div>
          <div v-if="BBS_CUTT_INFO.GDS_NO">
            <span class="pl-chat-email-wrap-title">
              상품 정보
            </span>
            <span class="pl-chat-email-wrap-desc">
              {{ BBS_CUTT_INFO.GDS_NO }}<span class="pl-unit"> <strong>&bull; </strong> </span>{{
                BBS_CUTT_INFO.GDS_NM.length > 30 ? BBS_CUTT_INFO.GDS_NM.substr(0, 30) + '...' : BBS_CUTT_INFO.GDS_NM
              }}
            </span>
          </div>
        </div>
        <div class="pl-chat-email-wrap-top-date">
          {{ this.mixin_convertDate(BBS_CUTT_INFO.WRT_DT, 'yyyy-MM-dd HH:mm:ss') }}
          <div class="is-mt-s">
            <v-btn
                v-if="BBS_CUTT_INFO.GDS_NO"
                class="pl-btn is-etc is-sm ml-auto"
                @click="openGoodsModal"
            >상세정보
            </v-btn>
          </div>
        </div>
      </div>
      <div
          v-else
          class="pl-list-nodata"
      >
        <span>등록된 데이터가 없습니다.</span>
      </div>
      <!-- 이커머스 컨텐츠 -->
      <div
          class="pl-chat-email-wrap-content"
      >
        <div class="is-mt-m" v-for="item in imgUrls">
          <img
               :key = item.url
               :src="item.url"
               alt="게시판 문의 이미지"
               style="max-width: 300px;"
          >
        </div>
        <div class="is-mt-m"
             v-dompurify-html="mixin_newLine(mixin_decode(BBS_CUTT_INFO.INQRY_CN))"
        >
        </div>
      </div>
    </div>
    <!-- 이커머스 버튼 -->
    <div class="pl-chat-input is-mt-m pa-3 align-self-end" style="width: 100%">
      <div class="pl-btn-wrap ">
        <!-- 이커머스 발송 버튼 -->
        <compo-tooltip-btn
            TitleProp="답변 하기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 email-send"
            TooltipPositionProp="top"
            @btnClick="openAnswerModal"
        ></compo-tooltip-btn>
        <!-- 이커머스 상담종료 -->
        <div class="ml-auto">
          <v-btn
              class="pl-btn is-icon"
              :disabled="computedEndBtn"
              @click="endCutt">상담종료
          </v-btn>
        </div>
      </div>
    </div>
    <!-- dialog 답변 하기 -->
    <v-dialog
        v-model="dialogSendEcommerce"
        content-class="pl-top-alarm-dialog"
        hide-overlay>
      <compo-dialog
          header-title="답변하기"
          @hide="mixin_hideDialog('SendEcommerce')"
      >
        <template slot="body">
          <ecommerce-dialog
              :BBS_CUTT_INFO_PROP="BBS_CUTT_INFO_PROP"
              :CHAT_LIST_DATA="CHAT_LIST_DATA"
              ref="answer_dialog"
              :readonly="computedSendBtn"
              @updateBbsCuttInfo="updateBbsCuttInfo"
          >
          </ecommerce-dialog>
        </template>
        <template
            slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('SendEcommerce')">취소</v-btn>
          <v-btn
              class="pl-btn"
              :disabled="computedSendBtn"
              @click="validateAnswer">보내기
          </v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <v-dialog
      v-model="dialogGoodsEcommerce"
      content-class="dialog-draggable is-scroll"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          :header-title="mixin_isEmpty(ORDR_INFO_PROP) ? '상품 상세정보' : '주문 상세정보'"
          @hide="mixin_hideDialog('GoodsEcommerce')"
      >
        <template slot="body">
          <component :is="computedCompoName"
              :BBS_CUTT_INFO_PROP="BBS_CUTT_INFO_PROP"
              :GDS_INFO_PROP="GDS_INFO_PROP"
              :ORDR_INFO_PROP="ORDR_INFO_PROP"
          >
          </component>
        </template>
        <template
            slot="footer">
          <v-btn class="pl-btn is-sub" @click="closeGoodsInfo">닫기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import EcommerceDialog from '@/views/page/CSL_M0200_ECOMMERCE_DIALOG.vue';
import compo_goods_NAVER from "@/components/compo_goods_NAVER.vue";
import compo_goods_ST11 from "@/components/compo_goods_ST11.vue";
import compo_goods_LOTTEON from "@/components/compo_goods_LOTTEON.vue";

export default {
  name: "MENU_CSL_M0200_ECOMMERCE", //name은 'MENU_' + 파일명 조합
  components: {
    EcommerceDialog,
    compo_goods_NAVER,
    compo_goods_ST11,
    compo_goods_LOTTEON,
  },
  props: {
    BBS_CUTT_INFO: {
      type: Object,
      default: null
    },
    CHAT_LIST_DATA: {
      type: Object,
      default: null
    },
    CUST_INFO: {
      type: Object,
      default: null
    },
    USER_CUTT_STAT: {
      type: String,
      default: ''
    },
    LKAG_INFO: {
      type: Object,
      default: null
    },
    demoVideoMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogSendEcommerce: false,
      dialogGoodsEcommerce: false,
      disableEndBtn: false,
      common_code: [],
      bbsLkagList: {
        regParam: []
        , ordrParam: []
        , gdsParam: []
      },

      chtCuttStat : this.USER_CUTT_STAT,

      // 상담종료
      CHAT_OFF_LIST: [
        {text: "상담종료", active: 'slideChatOff', icon: 'chat-off'},
        {text: "임시저장", active: 'slideChatTemp', icon: 'chat-temp'},
        {text: "상담저장", active: 'slideChatSave', icon: 'chat-save'},
      ],

      BBS_CUTT_INFO_PROP: {},
      GDS_INFO_PROP: {},
      ORDR_INFO_PROP: {},
      zzz: 'compo-goods-info',
      imgUrls : [],

    }
  },
  methods: {
    openAnswerModal() {
      this.BBS_CUTT_INFO_PROP = {};
      this.BBS_CUTT_INFO_PROP = JSON.parse(JSON.stringify(this.BBS_CUTT_INFO));
      this.dialogSendEcommerce = true
    },
    async openGoodsModal() {
      this.BBS_CUTT_INFO_PROP = {};
      this.BBS_CUTT_INFO_PROP = JSON.parse(JSON.stringify(this.BBS_CUTT_INFO));

      if(!this.mixin_isEmpty(this.bbsLkagList.gdsParam) && !this.mixin_isEmpty(this.BBS_CUTT_INFO_PROP.GDS_NO)){
        this.callLkagApi('gdsParam');
      }
      if(!this.mixin_isEmpty(this.bbsLkagList.ordrParam) && !this.mixin_isEmpty(this.BBS_CUTT_INFO_PROP.ORDR_NO)){
        this.callLkagApi('ordrParam');
      }
      // setTimeout(() => {
      //   this.dialogGoodsEcommerce = true
      // }, 100)
    },
    async selectBbsParam() {
      this.bbsLkagList = {
        regParam: []
        , ordrParam: []
        , gdsParam: []
      }
      let sURL = '/chat-api/main/bbsParam/select';
      let postParam = {
        SNDR_KEY: this.BBS_CUTT_INFO.SNDR_KEY
      };
      let headParam = {head: {}}

      let response = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        const resData = response.DATA;
        if (!this.mixin_isEmpty(resData)) {
          for (let i in resData) {
            if (!this.mixin_isEmpty(resData[i].REG_API_ID)) {
              this.bbsLkagList.regParam.push(resData[i])
            } else if (!this.mixin_isEmpty(resData[i].ORDR_INQ_API_ID)) {
              this.bbsLkagList.ordrParam.push(resData[i])
            } else if (!this.mixin_isEmpty(resData[i].GDS_INQ_API_ID)) {
              this.bbsLkagList.gdsParam.push(resData[i])
            } else {
              console.log("no api ids");
            }
          }
          // console.log("chat_list_data IN ecommerce ", this.CHAT_LIST_DATA)
        }
      }
    },
    validateAnswer() {
      let answrParam = this.BBS_CUTT_INFO[this.computedFindAnswrParam];
      console.log('this.validate()', this.validate())
      if(this.validate()){
        this.showConfirmInfo({
          msg: '답변을 등록하시겠습니까? '
          , callYes: () => {
            this.callLkagApi('regParam')
          }
          , callNo: this.closeAlert
        })
      }
    },
    validate() {
      return this.$refs.answer_dialog.validate();
    },
    // 저장/수정 form validate reset
    resetValidation() {
      if(this.$refs.answer_dialog != undefined) this.$refs.answer_dialog.resetValidation();
    },
    updateBbsCuttInfo(val) {
      // let idx = this.bbsLkagList.regParam.findIndex((el) => el.ANSWR_PARAM_YN === 'Y')
      this.BBS_CUTT_INFO[this.computedFindAnswrParam] = val.answrCn
      // console.log(this.BBS_CUTT_INFO)
    },

    // 연동 api로 요청 보내기
    async callLkagApi(type) {
      let sUrl = '/intgr-api/commerce/call_api'
      let params = this.bbsLkagList[type];

      let postParam = {
        BEAN_ID: this.BBS_CUTT_INFO.LKAG_BEAN_ID
        , CERT_CUSTCO_ID: this.$store.getters["authStore/GE_CERT_CUSTCO_ID"]
        , LKAG_ID: params[0].API_ID
      }
      let headParam = {head: {}}
      for (let i in params) {
        let paramKey = params[i].ORGNL_PARAM_NM
        let paramVal = params[i].CHG_PARAM_NM
        if (!this.mixin_isEmpty(this.BBS_CUTT_INFO[paramVal])) postParam[paramKey] = this.BBS_CUTT_INFO[paramVal]
      }
console.log("postParam", postParam)
      let response = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        if (type === "regParam") {
          this.showToastSuccess({
            msg: "정상 처리 되었습니다.", callAfter: () => {
              this.closeAlert();
              if (type === "regParam") {
                this.regBbsAnswer(postParam);
              }
            }
          });
        } else if (type === "gdsParam") {
          this.GDS_INFO_PROP = JSON.parse(JSON.stringify(response.DATA2[0]));
        } else if(type === 'ordrParam'){
          this.ORDR_INFO_PROP = JSON.parse(JSON.stringify(response.DATA2[0]));
        }else{
          // no type
        }
        if(type !== 'regParam'){
          // this.dialogGoodsEcommerce = true
          this.mixin_showDialog('GoodsEcommerce');
        }
      } else {
        this.showToastCaution({
          msg: response.HEADER.ERROR_MSG, callAfter: () => {
            this.closeAlert();
          }
        });
      }
    },
    async regBbsAnswer(param) {
      let sUrl = '/chat-api/main/bbsAnswr/insert';
      let postParam = {
        CHT_CUTT_BBS_ID: this.BBS_CUTT_INFO.CHT_CUTT_BBS_ID
        , CHT_CUTT_ID : this.BBS_CUTT_INFO.CHT_CUTT_ID
        , ANSWR_CN: param[this.computedFindAnswrParam]
      }
      let headParam = {head: {}}

      let response = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.showToastSuccess({
          msg: "정상 처리되었습니다.", callAfter: () => {
            setTimeout(() => {
              this.endCutt();
              this.mixin_hideDialog('SendEcommerce');
              this.resetValidation();
            }, 100)
          }
        })
      }
    },
    endCutt() {
      this.$emit('selectChatList', this.CHAT_OFF_LIST[0])
    },
    closeGoodsInfo(){
      this.GDS_INFO_PROP = {};
      this.ORDR_INFO_PROP = {};
      this.mixin_hideDialog('GoodsEcommerce');
    }
  },
  mounted() {
  },
  async created() {
    this.selectBbsParam();
  },
  computed: {
    // 상담종료, 보내기 버튼
    computedSendBtn() {
      let stts = this.BBS_CUTT_INFO.CUTT_STTS_CD
      if(this.chtCuttStat == 'CANT_CHAT' || this.chtCuttStat == 'CHT_CANT'|| this.chtCuttStat == 'CHAT_END' || this.chtCuttStat == null || this.chtCuttStat == undefined){
          return true;
      } else {
        if (stts.includes('CMPL') || stts.includes('NPSBL') || stts.includes('AFTPRCS')) {
          return true;
        }
        return false;
      }
    },
    computedEndBtn() {
      let stts = this.BBS_CUTT_INFO.CUTT_STTS_CD
      if (stts.includes('CMPL') || stts.includes('NPSBL')) {
        return true;
      }else{
        return false;
      }
    },
    computedFindAnswrParam() {
      let idx = this.bbsLkagList.regParam.findIndex((el) => el.ANSWR_PARAM_YN === 'Y')
      return this.bbsLkagList.regParam[idx]["CHG_PARAM_NM"]
    },
    computedCompoName(){
      let name  = this.BBS_CUTT_INFO.LKAG_BEAN_ID;
      return 'compo_'+ 'goods_' + name;
    },
  },
  watch: {
    // CHAT_LIST_DATA: {
    //   handler(newValue, oldValue) {
    //     this.chtCuttStat = newValue.USER_CHT_STAT;
    //   },
    //   deep: true,
    //   immediate: true,
    // },
    BBS_CUTT_INFO() {
      this.selectBbsParam();

      let tmpArr = {};
      if( !this.mixin_isEmpty(this.BBS_CUTT_INFO.ULD_IMG_URL)){
        this.imgUrls = this.BBS_CUTT_INFO.ULD_IMG_URL.split(',').map((item) => {
          return { "url": item }; // 객체로 변환 (필요에 따라 속성명 변경 가능)
        });
      }else{
        this.imgUrls = [];
      }
      // console.log("this.imgUrls", this.imgUrls);
    },
    USER_CUTT_STAT() {
      this.chtCuttStat =  this.USER_CUTT_STAT;
      // console.log("CHAT_STAT I  ", this.USER_CUTT_STAT)
    }
  },
};
</script>

<style lang="scss" scoped>

</style>