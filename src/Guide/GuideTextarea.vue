<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <!-- //mark: Default -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <v-textarea
        class="pl-form"
        :rules="textareaRules"
        :value="textareaValue"
      />
      <v-textarea
        disabled
        class="pl-form is-mt-m"
        :rules="textareaRules"
        value="disalbes"
      />
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: Auto grow -->
    <h2>{{ toplink[1] }}</h2>
    <div class="guide-card">
      <v-textarea
        class="pl-form"
        :rules="textareaRules"
        :value="textareaValue"
        :spellcheck="false"
        auto-grow
      />
    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />

    <!-- //mark: No resize -->
    <h2>{{ toplink[2] }}</h2>
    <div class="guide-card">
      <v-textarea
        class="pl-form is-noresize"
        :rules="textareaRules"
        :value="textareaValue"
        :spellcheck="false"
      />
    </div>
    <guide-srcview :ModelProp.sync="source03" :SrcProp="srcAll.srcInput_03" />

  </div>
</template>

<script>
import guideJs from '@/Guide/guide.js'
export default {
  name: "GuideTextarea",
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
        'Default',
        'Auto grow',
        'No resize',
      ],
      source01: null,
      source02: null,
      source03: null,
      textareaRules: [v => v.length <= 200 || 'Max 200 characters'],
      textareaValue: '200자 제한!',

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<v-textarea
  class="pl-form"
  :rules="textareaRules"
  :value="textareaValue"
  :spellcheck="false"
/>`
          },
          { tab: "script", content:
`textareaRules: [v => v.length <= 200 || 'Max 200 characters'],
textareaValue: '200자 제한!',`, },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`<v-textarea
  class="pl-form"
  :rules="textareaRules"
  :value="textareaValue"
  :spellcheck="false"
  auto-grow
/>`
          },
          { tab: "script", content:
`textareaRules: [v => v.length <= 200 || 'Max 200 characters'],
textareaValue: '200자 제한!',`, },
        ],
        srcInput_03: [
          {
            tab: "html",
            content:
`<v-textarea
  class="pl-form is-noresize"
  :rules="textareaRules"
  :value="textareaValue"
  :spellcheck="false"
/>`
          },
          { tab: "script", content:
`textareaRules: [v => v.length <= 200 || 'Max 200 characters'],
textareaValue: '200자 제한!',`, },
        ],

      },
    }
  },
  methods: {
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