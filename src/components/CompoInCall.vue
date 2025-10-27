<template>
  <div class="pl-call-dialog">
    <div
      :class="`pl-call-dialog-portrait type-in ${ custInfoProp.CAUTION_CUST_YN === 'Y' ? 'alert' : ''} ${ custInfoProp.VIP_CUST_YN === true ? 'vip' : ''}`">
      <vLottiePlayer
        name="lottieInbound"
        :autoplay=true
        :loop=true
        width="120px"
        height="120px"
        :animationData="require('@/assets/lottie/animation_inbound.json')"
      />
    </div>
    <div class="pl-call-dialog-info is-mt-m">
      <span>{{ DataProp.company }}</span>
      <strong>{{ DataProp.CUST_PHN_NO }}</strong>
      <span v-if="DataProp.desc">{{ DataProp.desc }}</span>
      <span>{{ custInfoProp.CUST_NM }}</span>
    </div>

    <div class="pl-btn-wrap is-mt-m">
      <v-btn class="pl-btn type-call" @click="inCall()">전화 받기</v-btn>
    </div>
    <div class="pl-btn-wrap is-mt-m justify-start">
      <v-btn class="pl-btn is-sub" @click="ctiSkip()">거부</v-btn>
      <v-btn class="pl-btn is-sub" @click="ctiTransfer()">전환</v-btn>
      <v-text-field
          v-model="TRNS_NUM"
          class="pl-form is-search"
          style="width: 98px"
          placeholder="내선번호"
          hide-spin-buttons
          maxlength="4"
          type="text"
          oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
          @keyup="setPhoneNo(TRNS_NUM)"
        >
        <!-- <template v-slot:append>
          <v-btn
            @click="mixin_testLog('search btn')"
            class="pl-btn has-icon-only">
            <span class="pl-icon20 in-search"></span>
          </v-btn>
        </template> -->
      </v-text-field>
    </div>
    <div v-if="custInfoProp.CAUTION_MSG" class="pl-call-dialog-info is-mt-m">
      <span>{{ custInfoProp.CAUTION_MSG }}</span>
    </div>
  </div>
</template>

<script>
  import { eventBus } from "@/store/eventBus.js";           //Event Bus

  export default {
    name: 'CompoInCall',
    props: {
      DataProp: {
        type: Object,
      },
      custInfoProp: {
        type: Object,
      },
      CUST_PHN_NO: {
        type: String
        , default : ''
      }
    },
    data() {
      return {
        TRNS_NUM : '',
        CALL_DATA : {},

        //confirm alert 메시지
        MESSAGE : {
          ALERT : {
            TRANS_NUM_CHECK : {alertDialogToggle: true, msg: '전환할 번호를 입력해 주세요.', iconClass: 'is-info', type: 'default'}
            , TRANS_NUM_LEN_CHECK : {alertDialogToggle: true, msg: '전환할 번호는 4자리 이상 이어야 합니다.', iconClass: 'is-info', type: 'default'}
          }
        },
      }
    },
    computed: {
    },
    watch: {
      CUST_PHN_NO() {
        // console.log(this.CUST_PHN_NO);
      }
    },
    created() {
      this.init();
      this.CALL_DATA = this.DataProp;
    },
    mounted() {
    },
    methods: {
      setPhoneNo(val){
        let res = this.mixin_setPhoneNo(val.replace(/[^0-9]/g, ""));
        this.TRNS_NUM = res;
      },
      //초기화
      init() {
        this.TRNS_NUM = '';
        this.DataProp.TRNS_NUM = '';
      },
      //전화 받기
      inCall(){
        this.$emit("inCall", this.DataProp);
      },

      //거부
      ctiSkip(){
        this.$emit("ctiSkip", this.DataProp);
      },

      //전환
      ctiTransfer(){
        if(this.TRNS_NUM){
          if(this.TRNS_NUM.length > 3){
            this.DataProp.TRNS_NUM = this.TRNS_NUM;
            this.$emit("ctiTransfer", this.DataProp);
          }else{
            this.showAlert(this.MESSAGE.ALERT.TRANS_NUM_LEN_CHECK);
          }
        }else{
          this.showAlert(this.MESSAGE.ALERT.TRANS_NUM_CHECK);
        }
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>