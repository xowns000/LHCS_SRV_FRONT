<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>
    <h4>
      <a href="https://nightcatsama.github.io/vue-slider-component/#/api/props" target="_blank">https://nightcatsama.github.io/vue-slider-component/#/api/props</a>
    </h4>
    <guide-table PropTitle="Data Props" :PropTable="propsTable" />
    <!-- //mark: Default -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <div class="d-flex align-center pa-0">
          <v-icon class="pl-icon20 is-drag-icon-text mr-4 "></v-icon>
          <vue-slider
            v-model="sliderFontSize"
            :min=10
            :max=18
            :interval=1
            width="200px"
            height="2px"
          />
        </div>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: Add Input -->
    <h2>{{ toplink[1] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <div class="d-flex align-center pa-0">
          <vue-slider
            v-model="sliderTemperature"
            :min=0
            :max=1
            :interval=0.01
            width="200px"
            height="2px"
          />
          <v-text-field
            v-model="sliderTemperature"
            class="pl-form is-sm ml-4"
            reverse
            type="number"
          />
        </div>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />

    <!-- //mark: Custom Label -->
    <h2>{{ toplink[2] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <div class="d-flex align-center pa-0">
          <vue-slider
            width="400px"
            :data="['A', 'B', 'C', 'D']"
            :marks="true"
            v-model="customLabel" />
        </div>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source03" :SrcProp="srcAll.srcInput_03" />


  </div>
</template>

<script>
import guideJs from '@/Guide/guide.js'
export default {
  name: "GuideSlider",
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
        'Add Input',
      ],
      source01: null,
      source02: null,
      source03: null,

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<div class="d-flex align-center pa-0">
  <v-icon class="pl-icon20 is-drag-icon-text mr-4 "></v-icon>
  <vue-slider
    v-model="sliderFontSize"
    :min=10
    :max=18
    :interval=1
    width="200px"
    height="2px"
  />
</div>`
          },
          { tab: "script", content:
`sliderFontSize: 14,` },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`<div class="d-flex align-center pa-0">
  <vue-slider
    v-model="sliderTemperature"
    :min=0
    :max=1
    :interval=0.01
    width="200px"
    height="2px"
  />
  <v-text-field
    v-model="sliderTemperature"
    class="pl-form is-sm ml-4"
    reverse
    type="number"
  />
</div>`
          },
          { tab: "script", content:
`sliderTemperature: 0.5,` },
        ],
        srcInput_03: [
          {
            tab: "html",
            content:
`<div class="d-flex align-center pa-0">
  <vue-slider
    width="400px"
    :data="['A', 'B', 'C', 'D']"
    :marks="true"
    v-model="customLabel" />
</div>`
          },
          { tab: "script", content:
`customLabel: 'B',` },
        ],
      },

      propsTable: [
        { name: 'dotSize', type: 'Number', default: '14', description: 'dot size' },
        { name: 'width', type: 'Number', default: 'undefined', description: '슬라이더 길이' },
        { name: 'height', type: 'Number', default: 'undefined', description: '슬라이더 두께' },
        { name: 'data', type: 'Array', default: 'undefined', description: '커스텀 슬라이더 label' },
        { name: 'marks', type: 'boolean ', default: 'undefined', description: '하단 mark 표시' },
        { name: 'min', type: 'Number', default: '0', description: '최소값' },
        { name: 'max', type: 'Number', default: '100', description: '최대값' },
        { name: 'interval', type: 'Number', default: '1', description: '값 사이 간격' },
        { name: 'disabled', type: 'Boolean', default: 'false', description: 'disabled' },
        { name: 'tooltip', type: "'none' | 'always' | 'hover' | 'focus' | 'active'", default: 'active', description: '툴팁 종류' },
        { name: 'tooltipPlacement', type: "'top' | 'right' | 'bottom' | 'left'", default: 'top', description: '툴팁 위치' },
        { name: 'tooltipFormatter', type: "", default: 'undefined', description: '툴팁 포맷터' },

      ],

      // slider
      sliderFontSize: 14,
      sliderTemperature: 0.5,
      customLabel: 'B',
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