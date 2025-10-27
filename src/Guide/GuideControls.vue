<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <!-- //mark: Checkbox -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <v-checkbox
        class="pl-check"
        label="ON"
        input-value="true"
      ></v-checkbox>
      <v-checkbox
        class="pl-check"
        label="OFF"
      ></v-checkbox>
      <v-checkbox
        class="pl-check"
        input-value="true"
        label="DISABLED ON"
        disabled
      ></v-checkbox>
      <v-checkbox
        class="pl-check"
        label="DISABLED OFF"
        disabled
      ></v-checkbox>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: Checkbox : inline -->
    <h2>{{ toplink[1] }}</h2>
    <div class="guide-card">
      <div class="pl-selection-row">
        <v-checkbox
          v-model="chk01.selected"
          v-for="(chk01, index) in chkTypes"
          :key="index"
          :label="chk01.text"
          class="pl-check "
        ></v-checkbox>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />

    <!-- //mark: Radio -->
    <h2>{{ toplink[2] }}</h2>
    <div class="guide-card">
      <v-radio-group v-model="radioGroupSelected">
        <v-radio
          v-for="(rad01, index) in radioGroup"
          :key="radioGroup[index].text"
          :label="rad01.text"
          :value="rad01.text"
          class="pl-radio"
        >
        </v-radio>
      </v-radio-group>
    </div>
    <guide-srcview :ModelProp.sync="source03" :SrcProp="srcAll.srcInput_03" />

    <!-- //mark: Radio : inline -->
    <h2>{{ toplink[3] }}</h2>
    <div class="guide-card">
      <v-radio-group
        v-model="radioGroupSelected"
        row
        class="pl-radio-group"
      >
        <v-radio
          v-for="(rad01, index) in radioGroup"
          :key="radioGroup[index].text"
          :label="rad01.text"
          :value="rad01.text"
          class="pl-radio"
        >
        </v-radio>
      </v-radio-group>
    </div>
    <guide-srcview :ModelProp.sync="source04" :SrcProp="srcAll.srcInput_04" />

    <!-- //mark: Radio : label -->
    <h2>{{ toplink[4] }}</h2>
    <div class="guide-card">
      <v-radio-group
        v-model="radioGroupSelected"
        row
        class="pl-radio-group"
      >
        <template v-slot:label>
          <span class="pl-label">정렬조건</span>
        </template>
        <v-radio
          v-for="(rad01, index) in radioGroup"
          :key="radioGroup[index].text"
          :label="rad01.text"
          :value="rad01.text"
          class="pl-radio"
        >
        </v-radio>
      </v-radio-group>
    </div>
    <guide-srcview :ModelProp.sync="source05" :SrcProp="srcAll.srcInput_05" />

    <!-- //mark: Radio : native input -->
    <h2>{{ toplink[5] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <input
          type="radio"
          name="CS_TYPE_RADIO"
          class="pl-radio native-input">
        <input
          type="radio"
          checked
          name="CS_TYPE_RADIO"
          class="pl-radio native-input">
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source06" :SrcProp="srcAll.srcInput_06" />

    <!-- //mark: Radio : chk -->
    <h2>{{ toplink[6] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <input
          type="radio"
          name="CS_TYPE_SORT"
          class="pl-radio native-input type-check">
        <input
          type="radio"
          checked
          name="CS_TYPE_SORT"
          class="pl-radio native-input type-check">
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source07" :SrcProp="srcAll.srcInput_07" />

    <!-- //mark: Switch -->
    <h2>{{ toplink[7] }}</h2>
    <div class="guide-card">
      <v-switch v-model="switch1">
        <template v-slot:label>
          <span class="pl-label">{{ switch1 ? 'ON' : 'OFF' }}</span>
        </template>
      </v-switch>
    </div>
    <guide-srcview :ModelProp.sync="source08" :SrcProp="srcAll.srcInput_08" />

  </div>
</template>

<script>

import guideJs from '@/Guide/guide.js'

export default {
  name: "GuideControls",

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
        'Checkbox',
        'Checkbox : inline',
        'Radio',
        'Radio : inline',
        'Radio : label',
        'Radio : native',
        'Radio : chk',
        'Switch',
      ],
      source01: null,
      source02: null,
      source03: null,
      source04: null,
      source05: null,
      source06: null,
      source07: null,
      source08: null,
      chkTypes: [
        {
          text: "A팀",
          selected: true,
        },
        {
          text: "B팀",
          selected: true,
        },
        {
          text: "C팀",
          selected: false,
        },
      ],
      radioGroupSelected: "radio02",
      radioGroup: [
        {
          text: "radio01",
        },
        {
          text: "radio02",
        },
        {
          text: "radio03",
        },
      ],
      switch1: true,

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<v-checkbox
  class="pl-check"
  label="ON"
  input-value="true"
></v-checkbox>
<v-checkbox
  class="pl-check"
  label="OFF"
></v-checkbox>
<v-checkbox
  class="pl-check"
  input-value="true"
  label="DISABLED ON"
  disabled
></v-checkbox>
<v-checkbox
  class="pl-check"
  label="DISABLED OFF"
  disabled
></v-checkbox>`
          },
          { tab: "script", content:
`` },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`<div class="pl-selection-row">
  <v-checkbox
    v-model="chk01.selected"
    v-for="(chk01, index) in chkTypes"
    :key="index"
    :label="chk01.text"
    class="pl-check "
  ></v-checkbox>
</div>`
          },
          { tab: "script", content:
`chkTypes: [
  {
    text: "A팀",
    selected: true,
  },
  {
    text: "B팀",
    selected: true,
  },
  {
    text: "C팀",
    selected: false,
  },
],` },
        ],
        srcInput_03: [
          {
            tab: "html",
            content:
`<v-radio-group v-model="radioGroupSelected">
  <v-radio
    v-for="(rad01, index) in radioGroup"
    :key="radioGroup[index].text"
    :label="rad01.text"
    :value="rad01.text"
    class="pl-radio"
  >
  </v-radio>
</v-radio-group>`
          },
          { tab: "script", content:
`radioGroupSelected: "radio02",
radioGroup: [
  {
    text: "radio01",
  },
  {
    text: "radio02",
  },
  {
    text: "radio03",
  },
],` },
        ],
        srcInput_04: [
          {
            tab: "html",
            content:
`<v-radio-group
  v-model="radioGroupSelected"
  row
  class="pl-radio-group"
>
  <v-radio
    v-for="(rad01, index) in radioGroup"
    :key="radioGroup[index].text"
    :label="rad01.text"
    :value="rad01.text"
    class="pl-radio"
  >
  </v-radio>
</v-radio-group>`
          },
          { tab: "script", content:
`radioGroupSelected: "radio02",
radioGroup: [
  {
    text: "radio01",
  },
  {
    text: "radio02",
  },
  {
    text: "radio03",
  },
],` },
        ],
        srcInput_05: [
          {
            tab: "html",
            content:
`<v-radio-group
  v-model="radioGroupSelected"
  row
  class="pl-radio-group"
>
  <template v-slot:label>
    <span class="pl-label">정렬조건</span>
  </template>
  <v-radio
    v-for="(rad01, index) in radioGroup"
    :key="radioGroup[index].text"
    :label="rad01.text"
    :value="rad01.text"
    class="pl-radio"
  >
  </v-radio>
</v-radio-group>`
          },
          { tab: "script", content:
`radioGroupSelected: "radio02",
radioGroup: [
  {
    text: "radio01",
  },
  {
    text: "radio02",
  },
  {
    text: "radio03",
  },
],` },
        ],
        srcInput_06: [
          {
            tab: "html",
            content:
`<input
  type="radio"
  name="CS_TYPE_RADIO"
  class="pl-radio native-input">
<input
  type="radio"
  checked
  name="CS_TYPE_RADIO"
  class="pl-radio native-input">`
          },
          { tab: "script", content:
`` },
        ],
        srcInput_07: [
          {
            tab: "html",
            content:
`<input
  type="radio"
  name="CS_TYPE_SORT"
  class="pl-radio native-input type-check">
<input
  type="radio"
  checked
  name="CS_TYPE_SORT"
  class="pl-radio native-input type-check">`
          },
          { tab: "script", content:
`` },
        ],
        srcInput_08: [
          {
            tab: "html",
            content:
`<v-switch v-model="switch1">
  <template v-slot:label>
    <span class="pl-label">{{ switch1 ? 'ON' : 'OFF' }}</span>
  </template>
</v-switch>`
          },
          { tab: "script", content:
`switch1: true,` },
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