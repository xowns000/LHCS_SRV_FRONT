<template>
  <v-dialog
    v-if="dialogSrvyExlDetail"
    v-model="dialogSrvyExlDetail"
    content-class="dialog-draggable"
    hide-overlay
    @keydown.esc="closeDialog()"
    @click:outside="closeDialog()">
    <div class="draggable-area">drag area</div>
    <compo-dialog
      :header-title="`설문참여 제외자 ${REG_MODE_YN == 'Y' ? '등록' : '수정'}`"
        @hide="closeDialog()"
    >
      <template slot="body">
        <ul class="pl-list-dot is-no-border mt-0 pb-4">
          <li>설문참여 제외자 정보(전화번호)는 설문조사 참여자 등록시 자동 제외됩니다.</li>
          <li>필수 항목을 입력하신 후 [저장] 버튼을 클릭하십시오</li>
        </ul>
        <v-form ref="form">
          <div class="d-flex">
            <div class="pl-form-inline-wrap vertical label-100" style="width: 100%">
              <div class="pl-form-inline">
                <span class="pl-label">
                  구분
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    v-model="DETAIL_INFO.EXL_SE_CD"
                    :items="SUVY_EXL_TRGT_TP_LIST"
                    :rules="validateRules.EXL_SE_CD"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  성명
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    v-model="DETAIL_INFO.CUST_NM"
                    placeholder="입력하세요"
                    :rules="validateRules.CUST_NM"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  전화번호
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form flex-grow-1"
                    v-model="DETAIL_INFO.CUST_PHN_NO"
                    oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"
                    placeholder="“-” 제외하고 입력 하세요."
                    @keyup="changeCustPhnNo"
                    :disabled="DETAIL_INFO.SRVY_EXL_TRGT_ID != ''"
                    :rules="validateRules.CUST_PHN_NO"
                  />
                  <v-btn class="pl-btn flex-grow-0"
                    @click="checkCustPhnNo"
                    :disabled="isPassCheckCustPhnNo"
                  >중복 체크</v-btn>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  제외기간
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <compo-date-range-picker
                    :StartDayProp.sync="startDate"
                    :EndDayProp.sync="endDate"
                    :IsViewDropPickerProp="false"
                    @startDayChange="startDayChange"
                    @endDayChange="endDayChange"
                  />
                </div>
              </div>
              <div class="pl-form-inline ">
                <span class="pl-label">
                  설명
                  <v-icon class="pl-icon20"></v-icon>
                </span>
                <div class="pl-desc ">
                  <v-textarea
                    class="pl-form is-noresize"
                    v-model="DETAIL_INFO.EXL_RSN"
                    :spellcheck="false"
                  />
                </div>
              </div>
            </div>
          </div>
        </v-form>
      </template>
      <template slot="footer">
        <v-btn class="pl-btn is-sub" @click="closeDialog()">닫기</v-btn>
        <v-btn class="pl-btn" @click="saveCheck()">
          <template v-if="REG_MODE_YN == 'Y'">저장</template>
          <template v-else>수정</template>
        </v-btn>
      </template>
    </compo-dialog>
  </v-dialog>
</template>

<script>
export default {
  name: 'SVY_M700_DLG_DETAIL',
  props: {
    DataProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data(){
    return{
      dialogSrvyExlDetail: true,
      REG_MODE_YN : '',

      startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      endDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      DETAIL_INFO : {},
      SUVY_EXL_TRGT_TP_LIST: [],

      isPassCheckCustPhnNo: false,

      MESSAGE: {
        CONFIRM: {
          REG: {alertDialogToggle: true, msg: '저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.saveExclusionTarget, callNo: this.closeAlert}
        },
        ALERT: {
          DUP_CUST_PHN_NO: {alertDialogToggle: true, msg: '중복된 전화번호입니다.', iconClass: 'is-caution', type: 'default'}
          , DUP_CHECK: {alertDialogToggle: true, msg: '전화번호 중복체크를 해주세요.', iconClass: 'is-caution', type: 'default'}
          , PASS_DUP_CHECK: {alertDialogToggle: true, msg: '등록 가능한 전화번호입니다.', iconClass: 'is-info', type: 'default'}
        },
        
        TOAST : {
          SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 },
        },
      },

      validateRules: {
        EXL_SE_CD: [
          v => !!v || '구분은 필수 입력 항목 입니다.',
        ],
        CUST_NM: [
          v => !!v || '성명은 필수 입력 항목 입니다.',
        ],
        CUST_PHN_NO: [
          v => !!v || '전화번호는 필수 입력 항목 입니다.',
        ],
        EXL_RSN: [
          v => !!v || '설명은 필수 입력 항목 입니다.',
          v => v.length <= 300 || 'Max 300 characters'
        ],
      },
    }

  },
  mounted() {
    this.mixin_showDialog('SrvyExlDetail');
  },
  created() {
    this.init();
  },
  beforeUpdate() {
  },
  methods: {
    init() {
      this.DETAIL_INFO = this.DataProp.DETAIL_INFO;
      this.SUVY_EXL_TRGT_TP_LIST = this.DataProp.SUVY_EXL_TRGT_TP_LIST;
      this.REG_MODE_YN = this.DETAIL_INFO.SRVY_EXL_TRGT_ID == '' ? 'Y' : 'N';
      if(this.REG_MODE_YN == 'Y') {
        this.DETAIL_INFO.SRVY_EXL_TRGT_ID = '';
        this.DETAIL_INFO.EXL_SE_CD = '';
        this.DETAIL_INFO.CUST_NM = '';
        this.DETAIL_INFO.CUST_PHN_NO = '';
        this.DETAIL_INFO.EXL_BGNG_DT = this.startDate;
        this.DETAIL_INFO.EXL_END_DT = this.endDate;
        this.DETAIL_INFO.EXL_RSN = '';
        
      } else {
        this.startDate = this.mixin_convertDate(this.DETAIL_INFO.EXL_BGNG_DT, 'yyyy-MM-dd');
        this.endDate = this.mixin_convertDate(this.DETAIL_INFO.EXL_END_DT, 'yyyy-MM-dd');
        this.isPassCheckCustPhnNo = true;
      }
    },

    //전화번호 중복 체크
    async checkCustPhnNo() {
      const sUrl = '/api/svy/exclusion/checkCustPhnNo';
      const postParam = {
        CUST_PHN_NO: this.DETAIL_INFO.CUST_PHN_NO.replaceAll("-",""),
      }
      const headParam = {
        head: {}
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );


      if (!resData.HEADER.ERROR_FLAG) {
        this.isPassCheckCustPhnNo = parseInt(resData.DATA[0].DUP_COUNT) == 0 ? true : false;
        if(this.isPassCheckCustPhnNo) {
          this.showAlert(this.MESSAGE.ALERT.PASS_DUP_CHECK);
        } else {
          this.showAlert(this.MESSAGE.ALERT.DUP_CUST_PHN_NO);
        }
      }
    },

    async saveCheck() {
      if (!this.validate()) {
        this.closeAlert();
        return;
      }
      if(!this.isPassCheckCustPhnNo) {
        this.showAlert(this.MESSAGE.ALERT.DUP_CHECK);
        return;
      }
      this.showAlert(this.MESSAGE.CONFIRM.REG);
    },
    //필수값 체크
    validate () {
      return this.$refs.form.validate();
    },

    //설문 참여 제외자 등록/수정
    async saveExclusionTarget() {
      const sUrl = '/api/svy/exclusion/mergeTarget';
      const postParam = {
        SRVY_EXL_TRGT_ID: this.DETAIL_INFO.SRVY_EXL_TRGT_ID,
        EXL_SE_CD: this.DETAIL_INFO.EXL_SE_CD,
        CUST_NM: this.DETAIL_INFO.CUST_NM,
        CUST_PHN_NO: this.DETAIL_INFO.CUST_PHN_NO.replaceAll("-",""),
        EXL_BGNG_DT: this.startDate.replace(/-/gi, '') + '000000',
        EXL_END_DT: this.endDate.replace(/-/gi, '') + '235959',
        EXL_RSN: this.DETAIL_INFO.EXL_RSN,
      }
      const headParam = {
        head: {}
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );


      if (!resData.HEADER.ERROR_FLAG) {
        this.closeAlert();
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.$emit('reloadParentComp');
        this.closeDialog();
      }
    },


    changeCustPhnNo() {
      this.isPassCheckCustPhnNo = false;
    },


    startDayChange(date) {
      this.startDate = date;
    },
    endDayChange(date) {
      this.endDate = date;
    },
    closeDialog(){
      this.$emit('closeDialog');
    },


  },
  watch: {
    DataProp() {
      this.init();
    },
  },

}
</script>

<style lang="scss" scoped>

</style>