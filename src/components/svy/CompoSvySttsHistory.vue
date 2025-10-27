<template>
  <v-dialog 
    v-if="dialogOpenSttsHistory" 
    v-model="dialogOpenSttsHistory" 
    content-class="dialog-draggable is-scroll" 
    hide-overlay
    @keydown.esc="closeDialog()"
    @click:outside="closeDialog()">
    <div class="draggable-area">drag area</div>
    <compo-dialog header-title="검토 의견 보기" @hide="closeDialog">
      <template slot="body">
        <div>
          <div
            v-for="(item,index ) in HISTORY_LIST"
            :key="item.SRVY_STTS_HSTRY_ID"
            :class="index !== 0 ? 'is-mt-m' : ''"
            >
            <span
              :class="`pl-round-chip is-sm chat-stat-${displayStatus(item.STTS_CD)}`"
            >
              {{ item.STTS_NM }}
            </span>
            <strong class="ml-2">{{item.RGTR_NM}}</strong> ({{item.REG_DT_F}})
              <div>
                <v-textarea
                  class="pl-form is-noresize is-mt-s"
                  :value="restoreXSS(item.CN)"
                  :spellcheck="false"
                  readonly
                  rows="3"
                />
              </div>
          </div>
        </div>
      </template>
      <template slot="footer">
        <v-btn class="pl-btn is-sub" @click="closeDialog()">닫기</v-btn>
      </template>
    </compo-dialog>
  </v-dialog>
</template>

<script>

export default {
  name: "CompoSvySttsHistory",
  props: {
    DataProp :  {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  components: {
  },
  data() {
    return {
      dialogOpenSttsHistory: true,
      SRVY_ID : "",
      HISTORY_LIST: []
    }
  },
  watch: {
    DataProp() {
      this.init();
    }
  },
  computed: {
  },
  created() {
    this.init();
  },
  mounted() {
  },
  methods: {
    init() {
      this.SRVY_ID = this.DataProp.SRVY_ID
      this.getSttsHistory();
    },
    async getSttsHistory() {
      let sUrl = '/api/svy/plan/selectSttsHistory';
      let postParam = {
        SRVY_ID : this.SRVY_ID
      };

      let headParam = {
        head : {}
      };
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        this.HISTORY_LIST = response.DATA;
      }
    },

    //그리드 컬럼 색상 설정
    // getColor(e){
    //   switch(e){
    //     case 'PRPARG' : return 'green'
    //     case 'PUBCMP' : return 'blue'
    //     case 'ONGONG' : return 'orange'
    //     case 'TERMIAT' : return 'red'
    //     default : 'black'
    //   }
    // },
    displayStatus(type) {
      const typeList = [
        { type_list_text: 'wait', type_list_type: 'PRPARG' }, //준비중, 주황
        { type_list_text: 'wait', type_list_type: 'RDY' }, //승인대기, 주황
        { type_list_text: 'wait', type_list_type: 'RFSL' }, //승인반려, 주황
        { type_list_text: 'wait', type_list_type: 'RTRVL' }, //승인회수, 주황
        { type_list_text: 'done', type_list_type: 'APPR' }, //승인완료 녹색
        { type_list_text: 'cs', type_list_type: 'PUBCMP' }, //승인완료 녹색
        { type_list_text: 'cs', type_list_type: 'ONGONG' }, //진행중 파란색
        { type_list_text: 'after', type_list_type: 'TERMIAT' }, //종료 보라색
      ];

      for (let i = 0; i < typeList.length; i++) {
        if (typeList[i].type_list_type === type) {
          return typeList[i].type_list_text;
        }
      }
    },

    closeDialog() {
      this.$emit("closeDialog");
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
