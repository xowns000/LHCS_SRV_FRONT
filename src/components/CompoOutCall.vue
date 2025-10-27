<template>
  <div class="pl-call-dialog">
    <div class="pl-call-dialog-portrait" style="background: #c7cee0; border-radius: 50%;">
      <vLottiePlayer
        name="lottieOutbound"
        :autoplay=true
        :loop=true
        width="100px"
        height="100px"
        :animationData="require('@/assets/lottie/animation_outbound.json')"
      />
    </div>
    <div class="pl-form-inline-wrap vertical type-auto is-mt-l">
      <div class="pl-form-inline">
        <span class="pl-label">
          회&nbsp;&nbsp;사&nbsp;&nbsp;명
        </span>
        <div class="pl-desc">
          {{ CUSTCO_NM }}
          <!-- <v-select
            class="pl-form"
            :items="DataProp.dropItems"
            placeholder="선택하세요"
          ></v-select> -->
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          발신 번호
        </span>
        <div class="pl-desc">
          <v-select
            class="pl-form"
            style="width:133px;"
            v-model="DSPTCH_NO"
            :items="DSPTCH_NO_LIST"
            placeholder="선택하세요"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          수신 번호
        </span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form"
            v-model="DataProp.CUST_PHN_NO"
            :disabled="!DataProp.MODIFY_USE"
            maxlength="14"
            hide-spin-buttons
            type="text"
            @keyup="setPhoneNo(DataProp.CUST_PHN_NO)"
            oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
          />
        </div>
      </div>
    </div>

    <div class="pl-btn-wrap is-mt-l justify-start">
      <v-btn class="pl-btn type-call" @click="outCall()">전화 걸기</v-btn>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CompoOutCall',
    props: {
      DataProp: {
        type: Object,
      },
      CUSTCO_ID: {
        type: String,
      },
    },
    data() {
      return {
        CUSTCO_NM : '', //고객사명
        DSPTCH_NO : '', //발신번호
        DSPTCH_NO_LIST : [], //고객사 발신번호 목록
        // dropItems: [],
        // dropItems2: [],
        // give_number: '010-5303-0000'
        //confirm alert 메시지
        MESSAGE : {
          ALERT : {
            PHN_NO_EMPTY : {alertDialogToggle: true, msg: '수신번호를 입력해 주세요.', iconClass: 'is-caution', type: 'default'}
            , SOCKET_ERROR : {alertDialogToggle: true, msg: 'CTI에 로그인이 되어 있지 않습니다.', iconClass: 'is-caution', type: 'default'}
            , DSPTCH_NO_CHECK : {alertDialogToggle: true, msg: '발신번호를 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
          }
        },
      }
    },
    watch: {
      CUSTCO_ID(){
        this.inItOutCall();
      }
    },
    computed: {
    },
    mounted() {

    },
    created() {
      this.inItOutCall();
    },
    methods: {
      setPhoneNo(val){
        let res = this.mixin_setPhoneNo(val.replace(/[^0-9]/g, ""));
        this.DataProp.CUST_PHN_NO = res;
      },

      inItOutCall() {
        this.DSPTCH_NO_LIST = [];
        this.CUSTCO_NM = this.$store.getters["userStore/GE_USER_COMPANY"].CD_NM;
        if(this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO){
          this.DSPTCH_NO_LIST = this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO.split(',');
          this.DSPTCH_NO = this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO.split(',')[0];
        }
      },
      //전화걸기
      outCall(){
        if(this.DSPTCH_NO){
          if(this.DataProp.CUST_PHN_NO){
            if(this.$socket){
              // this.$store.commit("statusStore/MU_CUTT_ING", true); //상담 진행중을 true로 store 저장 처리
              
              // this.$socket.emit("sendmsg", "phone_call", this.DataProp.CUST_PHN_NO.replace(/[^0-9]/g, "")); //ex>내선번호가 1006인 상담사인 경우 해당 내선번호에 연결된 대표번호로만 발신할 경우
              this.$socket.emit("sendmsg", "phone_call2", this.DataProp.CUST_PHN_NO.replace(/[^0-9]/g, "")+"|"+this.DSPTCH_NO.replace(/[^0-9]/g, "")); //ex>선택된 대표번호로 전화할 경우
              this.$eventBus.$emit("busCustInfoSrch", this.DataProp);
              this.$eventBus.$emit("busCuttEvt", {evt : 'outBoundBtnConrol'}); //상단 CTI 버튼 제어
              if(!this.DataProp.CPI_ID) { //캠페인인 경우 발신이력 대신 전화 상담에 데이터 저장처리(처리 결과가 확장속성이기 때문에)
                try{this.mixin_phnCallHistSave(this.DataProp)}catch(e){} //전화 발신 이력 저장 처리
              }
            }else{
              this.showAlert(this.MESSAGE.ALERT.SOCKET_ERROR);
              return;
            }
          }else{
            this.showAlert(this.MESSAGE.ALERT.PHN_NO_EMPTY);
            return;
          }
        }else{
          this.showAlert(this.MESSAGE.ALERT.DSPTCH_NO_CHECK);
          return;
        }
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>