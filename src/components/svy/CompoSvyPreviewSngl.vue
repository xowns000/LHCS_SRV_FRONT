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
        <v-radio-group
          v-model="qitem.RSPNS.QITEM_CHC_ID">
          <template v-for="(chc) in qitem.CHC_LIST">
            <v-radio
              v-if="chc.RSPNS_USE_YN == '' || chc.RSPNS_USE_YN == 'N'"
              :key="chc.QITEM_CHC_ID"
              :label="chc.QITEM_CHC_CN"
              :value="chc.QITEM_CHC_ID"
              @click="[chkIsSubmit('both'), checkEtcField()]"
              class="pl-radio"
            ></v-radio>
            <div
              v-if="chc.RSPNS_USE_YN == 'Y'"
              :key="chc.QITEM_CHC_ID"
              class="d-flex align-center"
              style="width: 100%"
              >
              <v-radio
                :value="chc.QITEM_CHC_ID"
                class="pl-radio mb-0"
                label="기타"
                @click="checkEtcField()"
              ></v-radio>
              <v-text-field
                class="pl-form flex-grow-1 ml-2"
                v-model="rspnsCn"
                placeholder="답변을 입력해 주십시오."
                :disabled="!isEtcSelected"
                @blur="setRspnsCn"
              ></v-text-field>
            </div>
          </template>
      </v-radio-group>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:"CompoSvyPreviewSngl", //설문 미리보기 - 단일 선택형 설문 문항
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
          , WRITE_CN : {alertDialogToggle: true, msg: '내용을 입력해 주세요.', iconClass: 'is-info', type: 'default'}
        },
      },
    }

  },

  watch: {
    DataProp() {
      this.init();
      if(this.qitemIdx == this.CURRENT_QITEM_IDX) {
        this.chkIsSubmit('qitem');
      }
      
    },
  },

  computed: {
  },

  async created() {
    this.init();
    this.chkIsSubmit('group');
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

      this.rspnsCn = this.qitem.RSPNS.RSPNS_CN

      this.checkEtcField();

      
    },

    async chkQitem(submitYn) {
      if(this.qitem.ESNTL_YN == "Y") {
        if(this.mixin_isEmpty(this.qitem.RSPNS.QITEM_CHC_ID)) {
          this.showAlert(this.MESSAGE.ALERT.SELECT_CHC);
          this.isValid = false;
          return false;
        }

        let chc = this.qitem.CHC_LIST.filter(chc => {
          return chc.QITEM_CHC_ID == this.qitem.RSPNS.QITEM_CHC_ID;
        })
        if(chc.length == 1) {
          chc = chc[0]
          if(chc.RSPNS_USE_YN == 'Y' && this.mixin_isEmpty(this.rspnsCn)) {
            this.showAlert(this.MESSAGE.ALERT.WRITE_CN);
            this.isValid = false;
            return false;
          } else {
            this.qitem.RSPNS.RSPNS_CN = this.rspnsCn;
          }
        }
        this.isValid = true;

      } else {
        if(!this.mixin_isEmpty(this.qitem.RSPNS.QITEM_CHC_ID)) {
          let chc = this.qitem.CHC_LIST.filter(chc => {
            return chc.QITEM_CHC_ID == this.qitem.RSPNS.QITEM_CHC_ID;
          })

          if(chc.length == 1) {
            chc = chc[0]
            if(chc.RSPNS_USE_YN == 'Y' && this.mixin_isEmpty(this.rspnsCn)) {
              this.showAlert(this.MESSAGE.ALERT.WRITE_CN);
              this.isValid = false;
              return false;
            } else {
              this.qitem.RSPNS.RSPNS_CN = this.rspnsCn;
            }
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
    async setItems(f) {
      const sUrl = '/api/svy/preview/insertitem';
      const headParam = {head: {}}
      const postParam = {
        sendData: {}
      }
      let oData = {};
      let noRspnsYn = "N";
      if(this.mixin_isEmpty(this.qitem.RSPNS.QITEM_CHC_ID)) {
        noRspnsYn = "Y";
      }
      oData = {
        SRVY_TRGT_ID : this.TRGT_ID,
        SRVY_QITEM_ID : this.qitem.SRVY_QITEM_ID,
        QITEM_CHC_ID : this.qitem.RSPNS.QITEM_CHC_ID,
        RSPNS_CN : !this.mixin_isEmpty(this.qitem.RSPNS.RSPNS_CN) ? this.qitem.RSPNS.RSPNS_CN : '',
        CHC_YN : 'Y',
        FINISH : f,
        NO_RSPNS_YN : noRspnsYn
      }
      let resData = await this.common_postCall(sUrl,  oData, headParam );
      if (!resData.HEADER.ERROR_FLAG) {
        return true;
      }
      return false;
    },

    //다음 버튼을 제출하기 버튼으로 변경 체크
    chkIsSubmit(emitType) {
      if(this.qitem.GROUP_MVMN_USE_YN == 'Y' && 
        !this.mixin_isEmpty(this.qitem.RSPNS.QITEM_CHC_ID)) {
          
          let selectedChc = this.qitem.CHC_LIST.filter((chc) => {
            return chc.QITEM_CHC_ID == this.qitem.RSPNS.QITEM_CHC_ID;
          })
          if(selectedChc.length > 0) {
            selectedChc = selectedChc[0];
          }
          if(!this.mixin_isEmpty(selectedChc.CHC_MVMN_SRVY_QITEM_GROUP_ID)) {
            if(emitType == 'both') {
              this.$emit('changeChcMvmnSrvyQitemGroupId4Group', selectedChc.CHC_MVMN_SRVY_QITEM_GROUP_ID)
              this.$emit('changeChcMvmnSrvyQitemGroupId4Qitem', selectedChc.CHC_MVMN_SRVY_QITEM_GROUP_ID)
            } else if(emitType == 'group') {
              //PC 버전일 때, 그룹(블록) 이동 버튼에만 적용
              this.$emit('changeChcMvmnSrvyQitemGroupId4Group', selectedChc.CHC_MVMN_SRVY_QITEM_GROUP_ID)
            } else if(emitType == 'qitem') {
              //모바일/미리보기 버전일 때, 설문 항목 이동, 그룹(블록) 이동 버튼에만 적용
              this.$emit('changeChcMvmnSrvyQitemGroupId4Qitem', selectedChc.CHC_MVMN_SRVY_QITEM_GROUP_ID)
            }
            
          }
      }
    },
    //기타 선택 시 기타 입력란 활성화.
    checkEtcField() {
      this.isEtcSelected = false;
      let chc = this.qitem.CHC_LIST.filter(chc => {
        return chc.QITEM_CHC_ID == this.qitem.RSPNS.QITEM_CHC_ID;
      })
      if(chc.length == 1) {
        chc = chc[0]
        if(chc.RSPNS_USE_YN == 'Y') {
          this.isEtcSelected = true;
        }
      }
      if(!this.isEtcSelected) {
        this.rspnsCn = '';
      }
    },

    setRspnsCn() {
      this.qitem.RSPNS.RSPNS_CN = this.rspnsCn;
    }
  },
}
</script>
<style lang="scss" scoped>
</style>