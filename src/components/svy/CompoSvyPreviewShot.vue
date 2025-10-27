<template>
  <!--반응형 처리를 위해 필요한 class : pl-form-inline-wrap-->
  <div 
    :key="qitem.SRVY_QITEM_ID"
    :class="`pl-form-inline-wrap vertical type-2 is-mt-s ${qitemIdx == CURRENT_QITEM_IDX ? 'current-item' : ''}`"
    :style="isValid ? '' : {border:'1px solid red'}">
    <div class="pl-form-inline">
      <span class="pl-label">
        <span
          v-if="qitem.ESNTL_YN == 'Y'"
          class="is-txt-error">[필수] </span>
        {{ qitem.SRVY_QITEM_CN }}
        <!-- <v-icon v-show="requiredFlag" class="pl-icon20 required"></v-icon> -->
      </span>
      <div class="pl-desc is-mt-s">
        <v-text-field
          class="pl-form"
          placeholder="여기에 입력해 주세요."
          v-model="qitem.RSPNS.RSPNS_CN" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:"CompoSvyPreviewShot", //설문 미리보기 - 단답형 설문 문항
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
      vFlag: true,
      //valid 통과 여부 - false 시, 박스 라인 색상을 변경한다.
      isValid: true,
      //설문 항목
      qItem: '',
      qItemIdx: 0,
      CURRENT_QITEM_IDX: 0,
      TRGT_ID: -1,


      MESSAGE : {
        ALERT : {
          WRITE_CN : {alertDialogToggle: true, msg: '내용을 입력해 주세요.', iconClass: 'is-info', type: 'default'}
        },
      },

    }
  },

  watch: {
    DataProp() {
      this.init();
    },
  },

  computed: {
  },

  async created() {
    this.init();
  },

  mounted() {
  },

  beforeDestroy() {
    if(this.qitem.ESNTL_YN == 'Y') {
      return false;
    }
  },

  methods: {
    init() {
      this.vFlag = this.DataProp.vFlag;
      this.qitem = this.DataProp.qitem;
      this.qitemIdx = this.DataProp.qitemIdx;
      this.CURRENT_QITEM_IDX = this.DataProp.CURRENT_QITEM_IDX;
      this.TRGT_ID = this.DataProp.TRGT_ID;
    },

    async chkQitem(submitYn) {
      if(this.qitem.ESNTL_YN == "Y") {
        if(this.mixin_isEmpty(this.qitem.RSPNS.RSPNS_CN)) {
          this.showAlert(this.MESSAGE.ALERT.WRITE_CN);
          this.isValid = false;
          return false;
        }
        this.isValid = true;
      }
      if(!this.vFlag) {
        return await this.setItems(submitYn)
      } else {
        return true
      }
    },


    //항목저장
    async setItems(f){
      const sUrl = '/api/svy/preview/insertitem';
      const headParam = {
        head: {}
      }
      const postParam = {
        sendData: {}
      }
      let oData = {};

      let noRspnsYn = "N";
      if(this.mixin_isEmpty(this.qitem.RSPNS.RSPNS_CN)) {
        noRspnsYn = "Y"
      }
      
      oData = {
        SRVY_TRGT_ID : this.TRGT_ID,
        SRVY_QITEM_ID : this.qitem.SRVY_QITEM_ID,
        RSPNS_CN : this.qitem.RSPNS.RSPNS_CN,
        CHC_YN : 'N',
        FINISH : f,
        NO_RSPNS_YN: noRspnsYn
      }

      let resData = await this.common_postCall(sUrl, oData, headParam );
      if (!resData.HEADER.ERROR_FLAG) {
        return true;
      }
      return false;
    },

  }
}
</script>
<style lang="scss" scoped>
</style>