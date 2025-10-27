<template>
  <!-- 설문분류 등록/수정 다이얼로그 -->
  <v-dialog
    v-if="dialogSrvyClsfDetail"
    v-model="dialogSrvyClsfDetail"
    content-class="dialog-draggable"
    hide-overlay
    @keydown.esc="closeDialog()"
    @click:outside="closeDialog()">
    <div class="draggable-area">drag area</div>
    <compo-dialog
      :header-title="IS_REG_MODE ? '설문 분류 등록' : '설문 분류 상세 정보'"
      @hide="closeDialog()"
    >
      <template slot="body">
        <div>
          <h2 class="pl-subtit">설문 분류 상세 정보</h2>
          <div class="pl-subdesc">
            <p>필수 관리 항목을 입력 하신 후 <strong>[저장] 버튼을 클릭</strong>하십시오.</p>
          </div>
        </div>
        
        <v-form ref="form">
          <div class="pl-form-inline-wrap vertical mt-2">
            <div class="pl-form-inline">
              <span class="pl-label">
                상위분류 명
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  disabled
                  required
                  v-model="detailInfo.UP_SRVY_CLSF_NM"
                  :rules="validateRules.UP_SRVY_CLSF_NM"
                  v-byte-counter="200"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                분류 명
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  required
                  :rules="validateRules.SRVY_CLSF_NM"
                  :disabled=" !detailInfo.SORT_ORD || detailInfo.LVL === '1' "
                  v-model="detailInfo.SRVY_CLSF_NM"
                  v-byte-counter="200"
                />
              </div>
            </div>
          </div>
        </v-form>
      </template>
      <template slot="footer">
        <v-btn class="pl-btn is-sub" @click="closeDialog()">닫기</v-btn>
        <!-- 등록 모드 버튼-->
        <v-btn 
          v-if="IS_REG_MODE"
          class="pl-btn" 
          @click="clsfSaveValidate"
        >
          저장
        </v-btn>
        <v-btn
          v-if="!IS_REG_MODE"
          class="pl-btn"
          @click="clsfSaveValidate"
        >
          수정
        </v-btn>

      </template>

    </compo-dialog>
  </v-dialog>
</template>
<script>
export default {
name:"SVY_M0400_DLG_CLSF_DETAIL", //설문문항 관리 - 설문 분류 등록/상세조회/수정 다이얼로그
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
    //다이얼로그 오픈 여부
    dialogSrvyClsfDetail: true,
    //등록 모드 여부 - 등록 모드는 true, 상세 모드는 false
    IS_REG_MODE: true,

    // 분류 상세정보
    detailInfo : {
      CHILD_MAX_ORD : "" ,
      CUSTCO_ID : "" ,
      FULL_PATH : "" ,
      SRVY_CLSF_EXPLN : "" ,
      SRVY_CLSF_ID : "" ,
      SRVY_CLSF_NM : "" ,
      SRVY_CLSF_NM_F : "" ,
      LVL : "",
      CONTS_CNT : "" ,
      LGN_ID : "" ,
      SORT_ORD : "" ,
      MIN_ORD : "" ,
      MAX_ORD : "" ,
      PRE_ORD : "" ,
      NEXT_ORD : "" ,
      UP_SRVY_CLSF_ID : "" ,
      UP_SRVY_CLSF_NM : "" ,
      USE_YN : ""
    },


    //confirm alert 메시지
    MESSAGE : {
      CONFIRM : {
        REG : {alertDialogToggle: true, msg: '저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.clsfSave, callNo: this.closeMsg}
        , SAVE : {alertDialogToggle: true, msg: '저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.clsfSave, callNo: this.closeMsg}
      },
      ALERT : {
        NO_DEL_CLSF : {alertDialogToggle: true, msg: '설문문항이 존재하는 분류를<br/>삭제할 수 없습니다.', iconClass: 'is-caution', type: 'default'}
        , NO_SELECTED : {alertDialogToggle: true, msg: '설문분류를 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
      },
      TOAST : {
        SUCCESS : {msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 3000}
      },
    },

    valid : true,
    validateRules: {
      SRVY_CLSF_NM: [
        v => !!v || '분류명은 필수 입력 항목 입니다.',
      ],
      UP_SRVY_CLSF_NM: [
        v => !!v || '상위분류 명 은(는) 필수 입력 항목 입니다.',
      ],
    },

    
   }
 },

  watch: {

  },

  computed: {

  },

  async created() {
    //복제하여 세팅
    this.detailInfo = _.cloneDeep(this.DataProp.DETAIL_INFO);
    this.IS_REG_MODE = this.detailInfo.SRVY_CLSF_ID == '' ? true : false;
  },

  mounted() {
    this.mixin_showDialog('SrvyClsfDetail');
  },

  beforeDestroy() {
    this.dialogSrvyClsfDetail = false;
  },

  methods: {
    //validate check
    validate () {
      return this.$refs.form.validate();
    },
    clsfSaveValidate(){
      if( this.detailInfo.LVL === '1' ){
        this.showAlert(this.MESSAGE.ALERT.NO_ROOT_SAVE);
        return;
      }
      if (!this.validate()) {
        return;
      }
      this.showAlert(this.MESSAGE.CONFIRM.REG);
    },

    // 저장
    async clsfSave(){
      this.closeMsg();
      let sUrl = '/api/svy/tmpl/clsfProc';
      let postParam = {
        SRVY_CLSF_ID : this.detailInfo.SRVY_CLSF_ID
        , UP_SRVY_CLSF_ID : this.detailInfo.UP_SRVY_CLSF_ID
        , SRVY_CLSF_NM : this.detailInfo.SRVY_CLSF_NM
        , SRVY_CLSF_EXPLN : this.detailInfo.SRVY_CLSF_EXPLN
        , USE_YN : this.detailInfo.USE_YN
        , SORT_ORD : this.detailInfo.SORT_ORD
        , CUSTCO_ID : this.detailInfo.CUSTCO_ID
      };

      let headParam = {
        head : {}
      };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.$emit('getTreeList');
        this.$emit('clickClose');
      }

    },

    closeDialog() {
      this.$emit('clickClose');
    },
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },
  },
}
</script>
<style lang="scss" scoped>
</style>