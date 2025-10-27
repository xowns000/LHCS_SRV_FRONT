<template>
  <div>
    <div class="pl-form-inline-wrap vertical">
      <div
        class="pl-form-inline">
        <span class="pl-label">
          <v-icon class="pl-icon20 div-chk mr-2"></v-icon>
          문의자
        </span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form"
            v-model="makeCustNm"
            :disabled="true"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          <v-icon class="pl-icon20 document mr-2"></v-icon>
          문의 유형
        </span>
        <div class="pl-desc">
          <v-select
            class="pl-form is-lg"
            :items="inqryTypeList"
            v-model="bbsAnswrData.inqryType"
            :disabled="true"
          />
        </div>
      </div>
<!--      <div class="pl-form-inline">-->
<!--        <span class="pl-label">-->
<!--          <v-icon class="pl-icon20 contentList mr-2"></v-icon>-->
<!--          답변 템플릿-->
<!--        </span>-->
<!--        <div class="pl-desc">-->
<!--          <v-select-->
<!--            class="pl-form"-->
<!--            :items="bbsAnswrData.answrTemplate"-->
<!--          />-->
<!--        </div>-->
<!--      </div>-->
    </div>
    <!-- ck에디터 -->
<!--    <ckeditor-->
<!--      class="is-mt-m"-->
<!--      ref="bbaAnswerArea"-->
<!--      @namespaceloaded="onNamespaceLoaded"-->
<!--      v-model="bbsAnswrData.answrCn"-->
<!--      :config="editorConfig"-->
<!--      ></ckeditor>-->
    <div class="pl-form-inline">
      <v-form ref="answr_cn_form">
        <v-textarea
            style="height: 550px"
            ref="answr_cn"
            class="pl-form is-mt-20"
            :rules="[textareaRules.NOT_NULL, textareaRules.UNDER_1000]"
            :spellcheck="false"
            v-model="bbsAnswrData.answrCn"
            :readonly="readonly"
        />
      </v-form>
    </div>
  </div>
</template>
<!--style="height: 540px"-->
<script>
  export default {
    props: {
      BBS_CUTT_INFO_PROP: {
        type: Object,
        default: null
      },
      CHAT_LIST_DATA: {
        type: Object,
        default: null
      },
      readonly: {
        type: Boolean,
      },
    },
    data() {
      return{
        editorData: "test",
        editorConfig: {
          height: '480px',
          resize_enabled : true,
        },

        common_code : [],
        inqryTypeList:[],
        bbsAnswrData : {
          inqryCust : ''
          , inqryType:''
          , answrTemplate:[]
          , answrCn : ''
        },
        textareaRules : {
          NOT_NULL:  v => !!v || '답변내용은 필수 항목 입니다.' ,
          UNDER_1000:  v => v.length < 1000 || '답변 내용은 최대 1000 글자 입니다.' ,
        },
      }
    },
    async created(){
console.log("dialog created")
      this.inqryTypeList = [];
      let codeName = ['PST_INQ_TP'];
      this.common_code = await this.mixin_common_code_get_all(codeName);
      this.inqryTypeList = await this.mixin_common_code_get(this.common_code, 'PST_INQ_TP', '전체')
      console.log("created readonly", this.readonly)
    },
    mounted() {
      this.setAnswerParam();
    },
    methods: {
      onNamespaceLoaded( CKEDITOR ) {
        //CKEditor 외부 플러그인 주입용도.
        this.mixin_CKEDITOR_plugins_addExternal( CKEDITOR );
      },
      // 답변 초기화
      setAnswerParam(){
        this.bbsAnswrData = {
          inqryType:''
          , answrCn : ''
        }
        setTimeout(() => {
          let inqType = this.BBS_CUTT_INFO_PROP.INQRY_TYPE
          if(this.mixin_isEmpty(inqType)){
            this.bbsAnswrData.inqryType = 'ETC';
          }else{
            const collator = new Intl.Collator('ko');
            this.inqryTypeList.forEach((el) => {
              const result = collator.compare(el.text, inqType);
              if (result === 0) {
                this.bbsAnswrData.inqryType = el.value
              }
            });
          }
        }, 5 * 100); // 5밀리초

        if(!this.mixin_isEmpty(this.BBS_CUTT_INFO_PROP.ANSWR_CN)) this.bbsAnswrData.answrCn = this.mixin_decode(this.BBS_CUTT_INFO_PROP.ANSWR_CN);
        // console.log("this.bbsAnswrData.inqryType", this.bbsAnswrData.inqryType)
      },
      validate() {
        console.log("answr_cn_form validate called")
        return this.$refs.answr_cn_form.validate();
      },
      // 저장/수정 form validate reset
      resetValidation() {
        console.log("answr_cn_formreset validate called")
        if(this.$refs.answr_cn_form != undefined) this.$refs.answr_cn_form.resetValidation();
      },
    },
    computed:{
     makeCustNm () {
       let WRTR_ID = this.mixin_isEmpty(this.BBS_CUTT_INFO_PROP.WRTR_ID) ? '' : this.BBS_CUTT_INFO_PROP.WRTR_ID
       let WRTR_NM = this.mixin_isEmpty(this.BBS_CUTT_INFO_PROP.WRTR_NM) ? this.BBS_CUTT_INFO_PROP.WRTR_NM : " / " + this.BBS_CUTT_INFO_PROP.WRTR_NM

       let custNm = this.BBS_CUTT_INFO_PROP.CUST_NM + "( " + WRTR_ID + WRTR_NM + " )"

       return custNm
     },
      computedDisableAnswer(){
        let stts = this.BBS_CUTT_INFO_PROP.CUTT_STTS_CD
        // console.log("computed Send btn stts", stts)
        if(stts.includes('CMPL') || stts.includes('NPSBL') || stts.includes('AFTPRCS')){
          return true;
        }else{
          return false;
        }
      },
    },
    watch:{
      bbsAnswrData: {
        handler(newValue, oldValue) {
          console.log("newValue", newValue)
          console.log("newValue", newValue.answrCn.length)
            // '\r\n'을 '\n'으로 변경
            if (!this.mixin_isEmpty(newValue.answrCn)) {
              if(newValue.answrCn.includes('\r\n')){
               newValue.answrCn = newValue.answrCn.replace(/\r\n/g, '\n');
              }else if(newValue.answrCn.includes('\r')){
                newValue.answrCn = newValue.answrCn.replace(/\r/g, '\n');
              }
            }
          this.$emit('updateBbsCuttInfo', newValue);
        },
        deep: true,
        immediate: true,
      },
      BBS_CUTT_INFO_PROP(){
        this.setAnswerParam();
      }
    },
    beforeDestroy() {
      // console.log("destroy")
    },
    beforeUpdate() {
      // this.setAnswerParam();
    }
  }
</script>

<style lang="scss" scoped>

</style>