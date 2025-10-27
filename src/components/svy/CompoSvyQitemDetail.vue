<template>
  <div :style=" MNG_TYPE=='SRVY_QITEM_CRT' ? 'height:calc(100% - 59px);' : ''">
    <!-- 설문문항 관리에서는 다이얼로그로 출력 -->
    <v-dialog
      v-if="MNG_TYPE=='SRVY_QITEM_TMPL' && dialogSrvyQitemTmpl"
      v-model="dialogSrvyQitemTmpl"
      content-class="dialog-draggable is-lg"
      hide-overlay
      @keydown.esc="closeDialog()"
      @click:outside="closeDialog()">
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :header-title="IS_REG_MODE ? '설문문항 등록' : '설문문항 상세 정보'"
        @hide="closeDialog()"
      >
        <template slot="body">
          <CompoSvyQitemForm
            ref="qitemFormRef"
            :DataProp="DataProp"
            @reloadParentComp="reloadParentComp()"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="closeDialog()">닫기</v-btn>
          <!-- 등록 모드 버튼-->
          <v-btn
            v-if="IS_REG_MODE"
            class="pl-btn"
            @click="saveSvyQitem"
          >
            저장
          </v-btn>
          <v-btn
            v-if="!IS_REG_MODE"
            class="pl-btn"
            @click="saveSvyQitem"
          >
            수정
          </v-btn>

        </template>
      </compo-dialog>
    </v-dialog>
    <!-- 설문지 생성 관리에서는 다이얼로그가 아니고 블록관리 우측 영역에 출력-->
    <template v-if="MNG_TYPE=='SRVY_QITEM_CRT'">
      <div class="pl-card" style="height: 100%; overflow: auto;">
        <CompoSvyQitemForm
          ref="qitemFormRef"
          :DataProp="DataProp"
          @reloadParentComp="reloadParentComp"
        />
      </div>
      <div class="pl-card is-bottom">
        <div class="is-right">
          <v-btn class="pl-btn" @click="saveSvyQitem" :disabled="(stts_head === 'PRPARG' || stts_head === 'RFSL') ? false : true">저장</v-btn>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import CompoSvyQitemForm from '@/components/svy/CompoSvyQitemForm';
export default {
name:"CompoSvyQitemDetail", //설문문항 관리, 설문지 생성 관리 - 설문항목 등록/상세조회/수정
components: {
  CompoSvyQitemForm,
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
    //관리 유형 - SRVY_QITEM_TMPL : 설문항목 관리, SRVY_QITEM_CRT : 설문지 생성 관리
    MNG_TYPE: '',
    //다이얼로그 오픈 여부
    dialogSrvyQitemTmpl: true,
    //등록 모드 여부 - 등록 모드는 true, 상세 모드는 false
    IS_REG_MODE: true,

    stts_head: '',

   }
 },

  watch: {
  },

  computed: {
  },

  async created() {
    this.MNG_TYPE = this.DataProp.MNG_TYPE;
    this.IS_REG_MODE = this.DataProp.SRVY_QITEM.SRVY_QITEM_ID ? false : true;
    this.stts_head = this.DataProp.STTS_HEAD;
  },

  mounted() {
    if(this.MNG_TYPE=='SRVY_QITEM_TMPL') {
      this.mixin_showDialog('SrvyQitemTmpl');
    }
  },

  beforeDestroy() {
    this.dialogSrvyQitemTmpl = false;
  },

  methods: {
    //설문항목 저장 - CompoSvyQitemForm 컴포넌트에
    saveSvyQitem() {
      this.$refs.qitemFormRef.btnSaveTab1();
    },

    //설문항목 폼 데이터 초기화
    dataPropInit() {
      this.$refs.qitemFormRef.dataPropInit();
    },

    copyQitem() {
      this.$refs.qitemFormRef.copyQitem();
    },

    reloadParentComp(isOpenLastQuestion) {
      this.$emit('reloadParentComp', isOpenLastQuestion);
      if(this.MNG_TYPE == 'SRVY_QITEM_TMPL') {
        this.closeDialog();
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