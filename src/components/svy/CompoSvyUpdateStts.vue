<template>
  <!-- dialog -->
  <v-dialog
    v-model="dialogOpenSttsUpdate"
    content-class="dialog-draggable"
    hide-overlay
    @keydown.esc="closeDialog()"
    @click:outside="closeDialog()">
    <div class="draggable-area">drag area</div>
    <compo-dialog
      :header-title="STTS_CD === 'RDY' ? '설문조사 승인 요청' : STTS_CD === 'APPR' ? '설문조사 승인' : STTS_CD === 'RFSL' ? '설문조사 반려' : STTS_CD === 'RTRVL' ? '설문조사 회수' : ''"
      @hide="closeDialog"
      @submit="submitDialog('OpenSttsUpdate')"
    >
      <template slot="body">
        <v-form ref="sttsUpdateForm">
          <ul 
            v-if="STTS_CD === 'RDY'"
            class="pl-list-dot is-no-border mt-0">
            <li>설문조사를 승인 요청합니다.</li>
          </ul>
          <ul 
            v-else-if="STTS_CD === 'APPR'"
            class="pl-list-dot is-no-border mt-0">
            <li>해당 설문조사를 승인합니다.</li>
          </ul>
          <ul 
            v-else-if="STTS_CD === 'RFSL'"
            class="pl-list-dot is-no-border mt-0">
            <li>해당 설문조사에 대한 반려 의견을 입력해주세요.</li>
          </ul>
          <ul 
            v-else-if="STTS_CD === 'RTRVL'"
            class="pl-list-dot is-no-border mt-0">
            <li>해당 설문조사에 대한 회수 의견을 입력해주세요.</li>
          </ul>
          <div class="is-mt-m">
            <span class="pl-label">
              <template v-if="STTS_CD === 'RDY'">승인 요청 의견</template>
              <template v-else-if="STTS_CD === 'APPR'">승인 의견</template>
              <template v-else-if="STTS_CD === 'RFSL'">반려 의견</template>
              <template v-else-if="STTS_CD === 'RTRVL'">회수 의견</template>
              <v-icon 
                v-if="STTS_CD === 'RFSL' || STTS_CD === 'RTRVL'"
                class="pl-icon20 required"></v-icon>
            </span>
            <v-textarea
              class="pl-form is-noresize"
              placeholder="의견 입력"
              v-model="CN"
              :rules="(STTS_CD == 'RFSL' || STTS_CD == 'RTRVL') ? validateRules.CN : validateRules.NO_RULE"
              :spellcheck="false"
            />
          </div>
        </v-form>
      </template>
      <template slot="footer">
        <v-btn class="pl-btn is-sub" @click="closeDialog">취소</v-btn>
        <v-btn class="pl-btn" @click="sttsUpdate">
          <template v-if="STTS_CD === 'RDY'">설문조사 승인 요청</template>
          <template v-else-if="STTS_CD === 'APPR'">설문조사 승인</template>
          <template v-else-if="STTS_CD === 'RFSL'">설문조사 반려</template>
          <template v-else-if="STTS_CD === 'RTRVL'">설문조사 회수</template>
        </v-btn>
      </template>
    </compo-dialog>
  </v-dialog>
</template>
<script>
export default {
  name: "CompoSvyUpdateStts", //설문 상태 변경(준비중 -> 승인대기, 승인대기 -> 승인완료, 승인대기 -> 승인반려)
  components: {
    
  },
  props: {
    DataProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data() {
    return {      
      dialogOpenSttsUpdate: true,
      STTS_CD: '',
      CN:'',

      validateRules: {
        CN : [
          v => !!v || '의견은 필수 입력 항목 입니다.',
        ],
        NO_RULE : [
          v => true,
        ],
      },

      MESSAGE: {
        ALERT : {
          ETC17_WARNING : {alertDialogToggle: true, msg: '대상자 지정이 되어있습니다.<br>대상자를 업로드 해주세요.', iconClass: 'is-info', type: 'default'}
        },
        TOAST : {
          SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 },
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        }
      }
      
    }
  },
  watch: {
    DataProp() {
      this.initDialog();
    },
  },

  computed: {
    
  },

  async created() {
    this.initDialog();
  },
  mounted() {
    
  },

  methods: {
    initDialog() {
      this.SRVY_ID = this.DataProp.SRVY_ID;
      this.STTS_CD = this.DataProp.STTS_CD;
      console.log("this.DataProp", this.DataProp)
    },

    //상태 업데이트
    sttsUpdate() {
      //반려, 회수일때만 의견 입력 필수 체크.
      if((this.STTS_CD === 'RFSL' || this.STTS_CD === 'RTRVL') && !this.validate()) {
        return;
      }
      this.showAlert(
        {
          alertDialogToggle: true,
          msg: (this.STTS_CD === 'RDY' ? '승인 요청하시겠습니까?' : this.STTS_CD === 'APPR' ? '승인하시겠습니까?' : this.STTS_CD === 'RFSL' ? '반려하시겠습니까?' : this.STTS_CD === 'RTRVL' ? '회수하시겠습니까?' : ''),
          iconClass: 'is-info',
          type: 'confirm',
          callYes: async () => {
            this.closeMsg();
            const sUrl = this.STTS_CD === 'RDY' ? '/api/svy/makeitems/updatesrvyopen' : '/api/svy/apprmng/updateStts';
            const postParam = {
              SRVY_ID : this.SRVY_ID
              ,STTS_CD : this.STTS_CD
              ,CN : this.CN
            }
            const headParam = {
              head: {}
            }

            let resData = await this.common_postCall(sUrl, postParam, headParam );


            if (resData.HEADER.ERROR_FLAG) {
              this.setErrMsg(resData);
            } else {
              this.showToast(this.MESSAGE.TOAST.SUCCESS);
              this.$emit("updateParent");
              this.closeDialog();
            }
          },
          callNo: this.closeMsg
        }
      )

    },

    //validate check
    validate () {
      return this.$refs.sttsUpdateForm.validate();
    },

    //api오류
    setErrMsg(res){
      if(res.HEADER.ERROR_MSG == 'TRGT') this.showAlert(this.MESSAGE.ALERT.ETC17_WARNING);
      else this.showAlert(this.MESSAGE.ERROR.ERROR);
    },


    //메시지창 종료
    closeMsg(){
      this.$store.commit('alertStore/hideAlert');
    },

    closeDialog() {
      this.$emit("closeDialog");
    }
  },
};
</script>

<style lang="scss" scoped></style>