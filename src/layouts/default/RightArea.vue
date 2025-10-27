<template>
  <div style="display: contents;">
    <v-navigation-drawer
        absolute
        permanent
        right
        height="calc(100% - 40px)"
        width="69px"
        class="pl-layout-right"
    >
      <v-list height="100%">
        <v-list-item-group class="">
          <v-list-item
              v-model="item.active"
              v-for="(item, index) in user_menu_right"
              :key="index"
              :class="`${item.ICON_CLASS_NM}`"
              :ripple="false"
              @click="showSlide(item)"
              :ref="`menuitem${index}`"
          >
            <v-tooltip left content-class="pl-tooltip left">
              <template v-slot:activator="{ on, attrs}">
                <span
                    v-if="!item.alarm"
                    v-bind="attrs"
                    v-on="on"
                    class="pl-icon-rightmenu"
                    :class="[item.ICON_CLASS_NM, { 'active': item.active }]">
                </span>
                <span
                    v-else
                    style="cursor: pointer;"
                    v-bind="attrs"
                    v-on="on">
                  <vLottiePlayer
                      :name="item.ACT_NM"
                      :autoplay=true
                      :loop=true
                      width="30px"
                      height="30px"
                      :animationData=item.animationData
                  />
                </span>


              </template>
              <span>{{ item.NODE_TITLE }}</span>
            </v-tooltip>

          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <!-- 모달 : 지식 정보 -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer" v-if=" dialogKms === true">
        <div class="pl-quick-layer-header">
          <h1>지식 정보</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="closeModal('dialogKms')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body">
          <right-kms></right-kms>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- 모달 : 문자 -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer" v-if=" dialogSms === true ">
        <div class="pl-quick-layer-header"><h1>문자</h1>
          <compo-tooltip-btn

              TitleProp="닫기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="closeModal('dialogSms')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body">
          <right_sms :custInfoProp="CUST_INFO"></right_sms>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- 모달 : 알림톡 -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer" v-if=" dialogTalk === true ">
        <div class="pl-quick-layer-header"><h1>알림톡</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="closeModal('dialogTalk')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body">
          <right-talk :custInfoProp="CUST_INFO"></right-talk>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- 모달 : 캠페인 -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer" v-if=" dialogCampaign === true ">
        <div class="pl-quick-layer-header"><h1>캠페인</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="closeModal('dialogCampaign')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body">
          <right-campaign></right-campaign>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- 모달 : 콜백 -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer" v-if=" dialogCallback === true ">
        <div class="pl-quick-layer-header"><h1>콜백</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="closeModal('dialogCallback')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body">
          <right-callback></right-callback>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- 모달 : 예약콜 -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer" v-if=" dialogReserveCall === true ">
        <div class="pl-quick-layer-header"><h1>예약콜</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="closeModal('dialogReserveCall')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body">
          <right-reservecall></right-reservecall>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- 모달 : ChatGpt -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer is-chatgpt" v-if=" dialogChatGpt === true ">
        <right-chatgpt
            @hide="closeModal('dialogChatGpt')"
        ></right-chatgpt>
      </div>
    </v-slide-x-reverse-transition>
    <!-- 모달 : 주문내역 -->
    <!--  백그라운드에서 실행되어야 하기 때문에 v-if가 아닌 v-show  -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer is-order"
           v-if="!mixin_isEmpty(dialogOrderListLayoutId) && dialogOrderList === true"
      >
<!--           v-show="dialogOrderList === true"-->
        <div class="pl-quick-layer-header"><h1>주문내역</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="closeModal('dialogOrderList')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body">
          <!-- 주문내역 -->
          <mainphone-order
              :CUST_INFO_PROP="CUST_INFO"
              :LAYOUT_ID_PROP="dialogOrderListLayoutId"
              :SHOW_DIALOG_PROP="dialogOrderList"
              @closeOrderList="closeModal('dialogOrderList')"
          />
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!--  백그라운드에서 실행되어야 하기 때문에 v-if가 아닌 v-show  -->
    <!-- 모달 : Cafe24전용 -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer is-order"
           v-if="!mixin_isEmpty(dialogOrderListCafe24LayoutId) && dialogOrderListCafe24 === true"
      >
        <!--           v-show="dialogOrderList === true"-->
        <div class="pl-quick-layer-header"><h1>주문내역</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="closeModal('dialogOrderListCafe24')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body">
          <!-- 주문내역 -->
          <right_orderlist_cafe24
              :CUST_INFO_PROP="CUST_INFO"
              :LAYOUT_ID_PROP="dialogOrderListCafe24LayoutId"
              :SHOW_DIALOG_PROP="dialogOrderListCafe24"
              @closeOrderList="closeModal('dialogOrderListCafe24')"
          />
        </div>
      </div>
    </v-slide-x-reverse-transition>

    <!-- 모달 : EZ어드민 -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer is-order"
           v-if="!mixin_isEmpty(dialogOrderListEzadminLayoutId) && dialogOrderListEzadmin === true"
      >
        <!--           v-show="dialogOrderList === true"-->
        <div class="pl-quick-layer-header"><h1>주문내역-EZ어드민</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="closeModal('dialogOrderListEzadmin')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body">
          <!-- 주문내역 -->
          <right_orderlist_ezadmin
              :CUST_INFO_PROP="CUST_INFO"
              :LAYOUT_ID_PROP="dialogOrderListEzadminLayoutId"
              :SHOW_DIALOG_PROP="dialogOrderListEzadmin"
              @closeOrderList="closeModal('dialogOrderListEzadmin')"
          />
        </div>
      </div>
    </v-slide-x-reverse-transition>

    <!-- 모달 : 예약내역(sw전용!!!!!) -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer" v-if=" dialogSwBooking === true ">
        <div class="pl-quick-layer-header"><h1>예약 현황</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="closeModal('dialogSwBooking')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body">
          <RightSwBooking></RightSwBooking>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- setting slide -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer is-setting" v-if=" dialogSetting === true">
        <div class="pl-quick-layer-header">
          <h1>환경설정</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="closeSettingSlide"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pt-0">
          <setting-slide></setting-slide>
        </div>
      </div>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import RightKms from '@/views/page/right_kms.vue';
// import RightSms from '@/views/page/right_sms.vue';
import RightTalk from '@/views/page/right_talk.vue';
import RightCampaign from '@/views/page/right_campaign.vue';
import RightCallback from '@/views/page/right_callback.vue';
import RightReservecall from '@/views/page/right_reservecall.vue';
import right_sms from '@/views/page/right_sms.vue';
import RightChatgpt from '@/views/page/right_chatGpt.vue';
import RightSwBooking from '@/views/page/right_swbooking.vue';//(sw전용!!!!!)
import SettingSlide from '@/views/page/SettingSlide.vue';
import right_orderlist_cafe24 from '@/views/page/right_orderlist_cafe24.vue';
import right_orderlist_ezadmin from '@/views/page/right_orderlist_ezadmin.vue';
import MainphoneOrder from '@/views/page/mainPhone/MainphoneOrder.vue';
import store from "@/store";

export default {
  name: 'right_area',
  components: {
    RightKms,
    // RightSms,
    RightTalk,
    RightCampaign,
    RightCallback,
    RightReservecall,
    right_sms,
    RightChatgpt,
    RightSwBooking,//(sw전용!!!!!)
    SettingSlide,
    MainphoneOrder,
    right_orderlist_cafe24,
    right_orderlist_ezadmin
  },

  computed: {
    dialogSetting: {
      get() {
        return this.$store.getters['commonStore/GE_COMMON_SETTING_SLIDE'];
      },
      set(data) {
        this.$store.dispatch('commonStore/AC_COMMON_SETTING_SLIDE', data);
      },
    },

  },
  data() {
    return {
      CUST_INFO: {},
      CUST_EMAIL: '',
      // modal
      dialogKms: false,
      dialogSms: false,
      dialogTalk: false,
      dialogCampaign: false,
      dialogCallback: false,
      dialogReserveCall: false,
      dialogChatGpt: false,
      dialogOrderList: false,
      dialogOrderListCafe24: false, //카페24전용
      dialogOrderListEzadmin: false, //EZ어드민전용
      dialogSwBooking:false,//(sw전용!!!!!)

      rightIndex: 0,
      selectedItem: null,

      // 알람
      alarmCampaign: false,
      alarmReserve: false,
      alarmCallback: false,
      alarmOrderList: false,

      dialogOrderListLayoutId : null,
      dialogOrderListCafe24LayoutId : null,
      dialogOrderListEzadminLayoutId : null,

      // temp_right_menu: [
      //
      //     {"NODE_ETC":"","ACT_NM":"dialogChatGpt","P_NODE_NO":"","USE_YN":"Y","NODE_URL":"","BTN_AUTH":"","PATH_NM":"","C_NODE_NO":"","NODE_TITLE":"chatGPT","NODE_LVL":"1","SORT_ORD":"1","NODE_TYPE":"F","NODE_URL_MENUID":"","NODE_KEY":"94","VIEW_TRGT":"RIGHT","MENU_EXPLN":"chatGPT","FULL_PATH":"chatGPT","NODE_ID":"94","ICON_CLASS_NM":"chatGpt","active":false},
      //     {"NODE_ETC":"0|0","ACT_NM":"dialogKms","P_NODE_NO":"","USE_YN":"Y","NODE_URL":"","BTN_AUTH":"","PATH_NM":"","C_NODE_NO":"","NODE_TITLE":"지식 정보","NODE_LVL":"1","SORT_ORD":"2","NODE_TYPE":"F","NODE_URL_MENUID":"","NODE_KEY":"81","VIEW_TRGT":"RIGHT","MENU_EXPLN":"지식정보","FULL_PATH":"지식 정보","NODE_ID":"81","ICON_CLASS_NM":"kms","active":false},
      //     {"NODE_ETC":"0|0","ACT_NM":"dialogSms","P_NODE_NO":"","USE_YN":"Y","NODE_URL":"","BTN_AUTH":"","PATH_NM":"","C_NODE_NO":"","NODE_TITLE":"문자","NODE_LVL":"1","SORT_ORD":"3","NODE_TYPE":"F","NODE_URL_MENUID":"","NODE_KEY":"82","VIEW_TRGT":"RIGHT","MENU_EXPLN":"문자","FULL_PATH":"문자","NODE_ID":"82","ICON_CLASS_NM":"sms","active":false},
      //     {"NODE_ETC":"0|0","ACT_NM":"dialogTalk","P_NODE_NO":"","USE_YN":"Y","NODE_URL":"","BTN_AUTH":"","PATH_NM":"","C_NODE_NO":"","NODE_TITLE":"알림톡","NODE_LVL":"1","SORT_ORD":"4","NODE_TYPE":"F","NODE_URL_MENUID":"","NODE_KEY":"83","VIEW_TRGT":"RIGHT","MENU_EXPLN":"알림톡","FULL_PATH":"알림톡","NODE_ID":"83","ICON_CLASS_NM":"talk","active":false},
      //     {"alarm": true, "animationData": require('@/assets/lottie/animation_campaign.json'), "NODE_ETC":"0|0","ACT_NM":"dialogCampaign","P_NODE_NO":"","USE_YN":"Y","NODE_URL":"","BTN_AUTH":"","PATH_NM":"","C_NODE_NO":"","NODE_TITLE":"캠페인","NODE_LVL":"1","SORT_ORD":"6","NODE_TYPE":"F","NODE_URL_MENUID":"","NODE_KEY":"88","VIEW_TRGT":"RIGHT","MENU_EXPLN":"우측 캠페인 메뉴","FULL_PATH":"캠페인","NODE_ID":"88","ICON_CLASS_NM":"campaign","active":true},
      //     {"alarm": true, "animationData": require('@/assets/lottie/animation_reserve.json'), "NODE_ETC":"0|0","ACT_NM":"dialogReserveCall","P_NODE_NO":"","USE_YN":"Y","NODE_URL":"","BTN_AUTH":"","PATH_NM":"","C_NODE_NO":"","NODE_TITLE":"예약콜","NODE_LVL":"1","SORT_ORD":"8","NODE_TYPE":"F","NODE_URL_MENUID":"","NODE_KEY":"90","VIEW_TRGT":"RIGHT","MENU_EXPLN":"우측 예약콜아이콘","FULL_PATH":"예약콜","NODE_ID":"90","ICON_CLASS_NM":"reserveCall","actrue":false},
      //     {"alarm": true, "animationData": require('@/assets/lottie/animation_callback.json'), "NODE_ETC":"0|0","ACT_NM":"dialogCallback","P_NODE_NO":"","USE_YN":"Y","NODE_URL":"","BTN_AUTH":"","PATH_NM":"","C_NODE_NO":"","NODE_TITLE":"콜백","NODE_LVL":"1","SORT_ORD":"8","NODE_TYPE":"F","NODE_URL_MENUID":"","NODE_KEY":"89","VIEW_TRGT":"RIGHT","MENU_EXPLN":"우측 콜백메뉴","FULL_PATH":"콜백","NODE_ID":"89","ICON_CLASS_NM":"callback","active":false}
      // ],

      // menu01: [
      //   {
      //     title: "지식정보",
      //     class: "kms",
      //     evt: "dialogKms",
      //     active: false,
      //   },
      //   {
      //     title: "문자",
      //     class: "sms",
      //     evt: "dialogSms",
      //     active: false,
      //   },
      //   {
      //     title: "알림톡",
      //     class: "talk",
      //     evt: "dialogTalk",
      //     active: false,
      //   },
      //   {
      //     title: "주문정보",
      //     class: "order",
      //     evt: "dialogOrder",
      //     active: false,
      //   },

      // ],

      // modals : [
      //   "dialogKms",
      //   "dialogSms",
      //   "dialogTalk",
      //   "dialogOrder",
      //   "dialogCampaign",
      //   "dialogCallback",
      //   "dialogReserveCall",
      //   "dialogChatGpt",
      // ],

    };
  },

  methods: {
    // btnActive(item) {
    //   //패널 변경 처리
    //   this.showSlide(item);
    // },

    // setting slide
    closeSettingSlide() {
      this.$store.dispatch('commonStore/AC_COMMON_SETTING_SLIDE', false);
    },

    showSlide(item) {
      this.selectedItem = item;
      this.user_menu_right.forEach((modal, idx) => {
        if (modal.ACT_NM === item.ACT_NM) {
          this.rightIndex = idx;
          if (this[modal.ACT_NM] === true) {
            modal.active = false;
            this[modal.ACT_NM] = false;
          } else {
            modal.active = true;
            this[modal.ACT_NM] = true;
          }
        } else {
          modal.active = false;
          this[modal.ACT_NM] = false;
        }
      });
    },
    closeModal(modal, index) {
      index = index ?? this.rightIndex;
      const refItem = this.$refs[`menuitem${index}`][0].$el;
      this.$nextTick(() => {
        refItem.click();
        this[`${modal}`] = false;
      });
    },
    aniCleaner() {
      // this.lottieClenaer.play();
      this.lottieClenaer.playSegments([0, 30], true);
    },
    getLkagLayoutByMenu(){
      this.user_menu_right.forEach((modal, idx) => {
        if(!this.mixin_isEmpty(modal.LAYOUT_ID)){
          this[`${modal.ACT_NM}LayoutId`] = modal.LAYOUT_ID
        }
      });
    },
  },

  async mounted() {
  },
  watch:{
    CUST_INFO(){
      // console.log("right cust_info ", this.CUST_INFO);
      // this.dialogOrderList = true

    },
  },
  beforeDestroy() {
    this.$eventBus.$off("showRightSlide"); //eventBus 중복방지를 위해 off
  },

  created() {

    // 고객정보 받은 후 세팅
    this.$eventBus.$on("setCustInfo", (custInfo) => {
      this.CUST_INFO = custInfo;
    });

    //고객정보에서 우측 메뉴 호출
    this.$eventBus.$on("showRightSlide", (item) => {
      this.user_menu_right.forEach((modal, idx) => {
        if (modal.ACT_NM === item.ACT_NM) {
          this.closeModal(modal, idx);
        } else {
          modal.active = false;
        }
      });
    });
    // layoutId가 있는 메뉴들은 해당 ACT_NM과   postfix (LayoutId)를 추가해 layoutId를 가지고 있는다.
    this.getLkagLayoutByMenu();
  },

  props: {
    custInfoProp: {
      type: Object,
    },
  },


};
</script>

<style scoped>

</style>
