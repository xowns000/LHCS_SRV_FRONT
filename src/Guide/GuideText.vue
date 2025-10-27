<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <!-- //mark: default -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <h2 class="pl-subtit">신청일 항목 설명</h2>
      <div class="pl-subdesc">
        <p>고객에게 문자, 이메일, 카카오톡 등으로 연락처 정보를 전달할 수 있습니다. 연락정보는 사전에 등록된 정보에 한하여 전달할 수 있습니다.</p>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />




  </div>
</template>

<script>

import guideJs from '@/Guide/guide.js'

export default {
  name: "GuideText",

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
        'title, desc',
      ],
      source01: null,
      source02: null,
      source03: null,

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<h2 class="pl-subtit">신청일 항목 설명</h2>
<div class="pl-subdesc">
  <p>고객에게 문자, 이메일, 카카오톡 등으로 연락처 정보를 전달할 수 있습니다. 연락정보는 사전에 등록된 정보에 한하여 전달할 수 있습니다.</p>
</div>`
          },
          { tab: "script", content:
`data() {
  return {

  }
}` },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
``
          },
          { tab: "script", content:
`` },
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