<template>
  <div>
    <p>주의고객 여부와 사유를 입력 후 <strong>[저장] 버튼을 클릭</strong>하십시오.</p>
    <div class="pl-form-inline-wrap vertical is-mt-m">
      <div class="pl-form-inline">
        <span class="pl-label">
          주의고객 여부
          <v-icon class="pl-icon20 required"></v-icon>
        </span>
        <div class="pl-desc">
          <v-checkbox
            class="pl-check"
            v-model="DataProp.CAUTION_CUST_CHECKED"
            @change="cautionCustChange($event)"
          ></v-checkbox>
          <v-select
            v-model="DataProp.CAUTION_CUST_CD"
            class="pl-form"
            :items="mixin_common_code_get(this.common_code, 'CAUTION_TP')"
            placeholder="선택하세요"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          유효일자
          <v-icon class="pl-icon20 required"></v-icon>
        </span>
<!--        <div class="pl-desc">-->
<!--          <div class="pl-calendar-range-form">-->
<!--            <compo-date-picker-->
<!--              v-model="DataProp.CAUTION_VLD_BGNG_DT"-->
<!--              DateType="dateInput"-->
<!--              :DateProp.sync="startDate"/>-->
<!--            <span class="pl-unit">~</span>-->
<!--            <compo-date-picker-->
<!--              v-model="DataProp.CAUTION_VLD_END_DT"-->
<!--              DateType="dateInput"-->
<!--              :DateProp.sync="endDate"/>-->
<!--            <compo-drop-picker-->
<!--              :StartDateProp.sync="startDate"-->
<!--              :EndDateProp.sync="endDate"-->
<!--            />-->
<!--          </div>-->
<!--        </div>-->
        <compo-date-range-picker
            :StartDayProp.sync="startDate"
            :EndDayProp.sync="endDate"
            @startDayChange="mixin_testLog(startDate)"
            @endDayChange="mixin_testLog(endDate)"
        />
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          사유
        </span>
        <div class="pl-desc">
          <v-textarea
            v-model="DataProp.CAUTION_CUST_FNDWAY"
            class="pl-form is-noresize"
            :spellcheck="false"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          등록자
        </span>
        <div class="pl-desc" v-if="DataProp.CAUTION_CUST_RGTR_NM != ''">
          {{ DataProp.CAUTION_CUST_RGTR_NM }}({{ mixin_convertDate(DataProp.CAUTION_CUST_REG_DT, 'yyyy-MM-dd HH:mm:ss') }})
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          수정자
        </span>
        <div class="pl-desc" v-if="DataProp.CAUTION_CUST_MDFR_NM != ''">
          {{ DataProp.CAUTION_CUST_MDFR_NM }}({{ mixin_convertDate(DataProp.CAUTION_CUST_MDFCN_DT, 'yyyy-MM-dd HH:mm:ss') }})
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'CompoBlackManage',
  props: {
    DataProp: {
      type: Object,
    },
  },
  components: {
  },
  data() {
    return {
      common_code : [], //공통코드

      startDate: this.DataProp.CAUTION_VLD_BGNG_DT,
      endDate: this.DataProp.CAUTION_VLD_END_DT,

      //confirm alert 메시지
      MESSAGE : {
        CONFIRM : {
          CAUTION_REG : {alertDialogToggle: true, msg: '주의 고객으로 등록 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.cautionCustProc, callNo: this.closeMsg}
          , CAUTION_CLEAR : {alertDialogToggle: true, msg: '주의 고객을 해제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.cautionCustProc, callNo: this.closeMsg}
        },
        ALERT : {
          SUCCESS : {alertDialogToggle: true, msg: '정상 처리 되었습니다.', iconClass: 'is-info', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST : {
          SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        },
      },

    }
  },
  computed: {
  },
  watch: {
    DataProp: {
      handler(newValue, oldValue) {
      let time = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
        if(!this.mixin_isEmpty(newValue.CAUTION_VLD_BGNG_DT)){
          this.startDate = newValue.CAUTION_VLD_BGNG_DT
        }else{
          this.startDate = time;
        }
        if(!this.mixin_isEmpty(newValue.CAUTION_VLD_END_DT)){
          this.endDate = newValue.CAUTION_VLD_END_DT
        }else{
          this.endDate = time;
        }
      },
      deep: true,
    },
  },
  mounted() {
  },
  async created() {
    //공통코드설정
    let codeName = ['CAUTION_TP'];
    this.common_code = await this.mixin_common_code_get_all(codeName);
  },
  methods: {

    cautionCustValidate(){

      if(this.DataProp.CAUTION_CUST_CHECKED){
        this.showAlert(this.MESSAGE.CONFIRM.CAUTION_REG);
      }else{
        this.showAlert(this.MESSAGE.CONFIRM.CAUTION_CLEAR);
      }
    },

    //clase confirm, alert
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    cautionCustChange(event) {
      this.DataProp.CAUTION_CUST_CHECKED = event;
    },

    //주의고객 정보 저장,수정
    async cautionCustProc() {
      let sUrl = '/api/setting/customer/cautionCustProc';
      let postParam = {
        CUST_ID : this.DataProp.CUST_ID
        , CAUTION_CUST_YN : this.DataProp.CAUTION_CUST_CHECKED?'Y':'N'
        , CAUTION_CUST_CD : this.DataProp.CAUTION_CUST_CD
        , CAUTION_VLD_BGNG_DT : this.startDate.replace(/-/gi, '')+'000000'
        , CAUTION_VLD_END_DT : this.endDate.replace(/-/gi, '')+'000000'
        , CAUTION_CUST_FNDWAY : this.DataProp.CAUTION_CUST_FNDWAY
        , CAUTION_CUST_RGTR_ID : this.DataProp.CAUTION_CUST_RGTR_ID
      }

      let headParam = {
        head : {
        }
      }

      postParam.EXPSN_ATTR = JSON.stringify(this.EXPSN_ATTR);

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.DataProp.CAUTION_CUST_RGTR_NM = response.DATA[0].CAUTION_CUST_RGTR_NM;
        this.DataProp.CAUTION_CUST_RGTR_ID = response.DATA[0].CAUTION_CUST_RGTR_ID;
        this.DataProp.CAUTION_CUST_REG_DT = response.DATA[0].CAUTION_CUST_REG_DT;
        this.DataProp.CAUTION_CUST_MDFR_NM = response.DATA[0].CAUTION_CUST_MDFR_NM;
        this.DataProp.CAUTION_CUST_MDFR_ID = response.DATA[0].CAUTION_CUST_MDFR_ID;
        this.DataProp.CAUTION_CUST_MDFCN_DT = response.DATA[0].CAUTION_CUST_MDFCN_DT;

        this.DataProp.CAUTION_VLD_BGNG_DT = this.mixin_convertDate(response.DATA[0].CAUTION_VLD_BGNG_DT, 'yyyy-MM-dd');
        this.DataProp.CAUTION_VLD_END_DT = this.mixin_convertDate(response.DATA[0].CAUTION_VLD_END_DT, 'yyyy-MM-dd');

        this.$store.commit("alertStore/hideAlert");
        this.$emit('custDefaultInfo', response.DATA[0]); //부모 컴포넌트에 데이터 전달

        this.showToast(this.MESSAGE.TOAST.SUCCESS)
      }

    },
  },
  
};
</script>

<style lang="scss" scoped>

</style>