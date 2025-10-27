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
        <template v-for="(chc, index) in qitem.CHC_LIST">
          <v-checkbox
            v-if="chc.RSPNS_USE_YN == 'N' || chc.RSPNS_USE_YN ==''"
            v-model="chc.selected"
            :key="chc.QITEM_CHC_ID"
            :label="chc.QITEM_CHC_CN"
            :value="chc.QITEM_CHC_ID"
            class="pl-check "
            style="width: 100%"
            @click="checkEtcField()"
          ></v-checkbox>
          <div
            v-if="chc.RSPNS_USE_YN == 'Y'"
            :key="chc.QITEM_CHC_ID"
            class="d-flex align-center"
            style="width: 100%"
          >
            <v-checkbox
              v-model="chc.selected"
              :value="chc.QITEM_CHC_ID"
              class="pl-check "
              label="기타"
              @click="checkEtcField()"
            ></v-checkbox>
            <v-text-field
              class="pl-form flex-grow-1 ml-2"
              v-model="rspnsCn"
              placeholder="답변을 입력해 주십시오."
              @blur="setRspnsCn(index)"
              :disabled="!isEtcSelected"

            ></v-text-field>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:"CompoSvyPreviewMult", //설문 미리보기 - 복수 선택형 설문 문항
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
      //기타 답변(사용자가 작성한 답변)
      rspnsCn: '',
      isEtcSelected: false,


      MESSAGE : {

        ALERT : {

          SELECT_CHC : {alertDialogToggle: true, msg: '항목을 선택해 주세요.', iconClass: 'is-info', type: 'default'}
          , SELECT_CHC_PM_CNT : {alertDialogToggle: true, msg: '선택 수 만큼 항목을 선택해 주세요.', iconClass: 'is-info', type: 'default'}
          , WRITE_CN : {alertDialogToggle: true, msg: '내용을 입력해 주세요.', iconClass: 'is-info', type: 'default'}
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
      this.qitem.CHC_LIST.forEach(chc => {
        chc.selected = chc.selected ? chc.selected : false;
      })

      if(this.qitem.RSPNS && this.qitem.RSPNS.length > 0) {
        let chc = this.qitem.RSPNS.filter(chc => {
          return chc.RSPNS_USE_YN == 'Y';
        })
        //기존 입력된 답이 있으면 출력
        if(chc.length == 1) {
          this.rspnsCn = chc[0].RSPNS_CN;
        }
      }

      this.checkEtcField();
    },

    async chkQitem(submitYn) {
      const selectedChcList = this.qitem.CHC_LIST.filter(chc => {
        return chc.selected;
      });
      let cnt = selectedChcList.length;
      this.qitem.RSPNS = _.cloneDeep(selectedChcList);

      if(this.qitem.ESNTL_YN == "Y") {
        if(cnt < 1){
          this.showAlert(this.MESSAGE.ALERT.SELECT_CHC);
          this.isValid = false;
          return false;
        }

        //선택허용수가 설정되어잇다면
        if(this.qitem.CHC_PM_CNT != 9){
          //선택허용수보다 적거나 많게 클릭했으면
          if(this.qitem.CHC_PM_CNT > cnt || this.qitem.CHC_PM_CNT < cnt){
            this.showAlert(this.MESSAGE.ALERT.SELECT_CHC_PM_CNT);
            this.isValid = false;
            return false;
          }
        }

        let chc = this.qitem.RSPNS.filter(chc => {
          return chc.RSPNS_USE_YN == 'Y';
        })
        if(chc.length == 1) {
          if(this.mixin_isEmpty(this.rspnsCn)) {
            this.showAlert(this.MESSAGE.ALERT.WRITE_CN);
            this.isValid = false;
            return false;
          } else {
            chc[0].RSPNS_CN = this.rspnsCn;
          }
        }
        this.isValid = true;
      } else {
        //한개라도 선택했다면 선택개수를 체크한다.
        if(cnt > 0 && this.qitem.CHC_PM_CNT != 9) {
          if(this.qitem.CHC_PM_CNT > cnt || this.qitem.CHC_PM_CNT < cnt){
            this.showAlert(this.MESSAGE.ALERT.SELECT_CHC_PM_CNT);
            this.isValid = false;
            return false;
          }
        }

        let chc = this.qitem.RSPNS.filter(chc => {
          return chc.RSPNS_USE_YN == 'Y';
        })
        if(chc.length == 1) {
          if(this.mixin_isEmpty(this.rspnsCn)) {
            this.showAlert(this.MESSAGE.ALERT.WRITE_CN);
            this.isValid = false;
            return false;
          } else {
            chc[0].RSPNS_CN = this.rspnsCn;
          }
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
      let o = [];
      this.qitem.RSPNS.forEach(rspns => {
        o.push({
          SRVY_TRGT_ID : this.TRGT_ID,
          SRVY_QITEM_ID : this.qitem.SRVY_QITEM_ID,
          QITEM_CHC_ID : rspns.QITEM_CHC_ID,
          RSPNS_CN : !this.mixin_isEmpty(rspns.RSPNS_CN) ? rspns.RSPNS_CN : '',
          CHC_YN : 'Y',
          FINISH : f,
          NO_RSPNS_YN: "N"
        })
      });
      if(o.length === 0){
        // return;
        o[0] = {
          SRVY_TRGT_ID : this.TRGT_ID,
          SRVY_QITEM_ID : this.qitem.SRVY_QITEM_ID,
          QITEM_CHC_ID : '',
          RSPNS_CN : '',
          CHC_YN : 'Y',
          FINISH : f,
          NO_RSPNS_YN: "Y"
        }
      }
      postParam.sendData["oData"] = o;



      let resData = await this.common_postCall(sUrl, postParam.sendData, headParam );
      if (!resData.HEADER.ERROR_FLAG) {
        return true;
      }
      return false;
    },

    //기타 선택 시 기타 입력란 활성화.
    checkEtcField() {
      this.isEtcSelected = false;
      const selectedChcList = this.qitem.CHC_LIST.filter(chc => {
        return chc.selected;
      });

      let etcChc = selectedChcList.filter(chc => {
        return chc.RSPNS_USE_YN == 'Y';
      });
      if(etcChc.length == 1) {
        this.isEtcSelected = true;
      }

      if(!this.isEtcSelected) {
        this.rspnsCn = '';
      }
    },

    setRspnsCn(index) {
      // console.log("this.qitem.RSPNSthis.qitem.RSPNS", this.qitem.RSPNS)
      //  this.qitem.RSPNS[index].RSPNS_CN = this.rspnsCn;
    }
  },
}
</script>
<style lang="scss" scoped>
</style>