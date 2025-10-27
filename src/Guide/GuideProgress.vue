<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <!-- //mark: Default -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <v-btn
        outlined
        small
        class="btn-default"
        @click="testProgressBar()">Open Dialog(2초 후 닫힘)</v-btn>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

  </div>
</template>

<script>
import guideJs from '@/Guide/guide.js'

export default {
  name: "GuideProgress",

  props:{
    SelectedProp: {
      type: String,
    }
  },
  components: {
  },
  data() {
    return {
      toplink: [
        'Default'
      ],
      source01: null,
      source02: null,
      source03: null,
      source04: null,
      source05: null,

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<v-btn
  outlined
  small
  class="btn-default"
  @click="testProgressBar()">Open Dialog(2초 후 닫힘)</v-btn>`
          },
          { tab: "script", content:
`export default {
  data() {
    return {}
  },
  methods: {
    testProgressBar() {
      this.openProgressBar();

      setTimeout(() => {
        this.closeProgressBar();
      }, 5000);
    },
    openProgressBar() {
      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
    },
    closeProgressBar() {
      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
    },
  },
}` },
        ],
      },
    }
  },
  methods: {
    testProgressBar() {
      this.openProgressBar();

      setTimeout(() => {
        this.closeProgressBar();
      }, 5000);
    },
    openProgressBar() {
      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
    },
    closeProgressBar() {
      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
    },
  },
  computed: {
  },
  mounted() {
    guideJs.appendHiddenLink(this.toplink);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>