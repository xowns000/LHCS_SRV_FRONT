<template>
  <div>
    <div
      v-for="(item,index ) in REVIEW_HISTORY_LIST"
      :key="item.KMS_CONTS_RVW_HSTRY_ID"
      :class="index !== 0 ? 'is-mt-m' : ''"
      >
      <span
        :class="`pl-round-chip is-sm chat-stat-${item.STTS_CD_CLASS}`"
      >
        {{ item.STTS_NM }}
      </span>
       <strong class="ml-2">{{item.RGTR_NM}}</strong> ({{item.REG_DT_F}})
        <div>
          <v-textarea
            class="pl-form is-noresize is-mt-s"
            :value="item.CN"
            :spellcheck="false"
            readonly
          />
        </div>
    </div>
    <!-- <ul class="pl-list-dot is-no-border mt-0">
      <li class="mb-5"
        v-for="(item) in REVIEW_HISTORY_LIST"
        :key="item.KMS_CONTS_RVW_HSTRY_ID"
      >
      <span
        :class="`pl-round-chip is-sm chat-stat-${item.STTS_CD_CLASS}`"
      >
        {{ item.STTS_NM }}
      </span>
      {{'(' +  item.RGTR_NM + ' - ' + item.REG_DT_F + ')'}}
        <div>
          <v-textarea
            class="pl-form is-noresize"
            :value="item.CN"
            :spellcheck="false"
            readonly
          />
        </div>
      </li>
    </ul> -->

  </div>
</template>

<script>

export default {
  name: "KMS_DLG_REVIEW",
  props: {
    validateRules : []
  },
  components: {
  },
  data() {
    return {
      dialogReview: false,
      KMS_CONTS_ID : "",
      REVIEW_HISTORY_LIST: []
    }
  },
  watch: {
  },
  computed: {
  },
  created() {
  },
  mounted() {
    this.KMS_CONTS_ID = this.$attrs.value
    this.getReviewHistory()

  },
  methods: {

    async getReviewHistory() {
      let sUrl = '/api/km/conts/selectReviewHistoryList';
      let postParam = {
        KMS_CONTS_ID : this.KMS_CONTS_ID
      };

      let headParam = {
        head : {}
      };
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        this.REVIEW_HISTORY_LIST = response.DATA;
      }
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
