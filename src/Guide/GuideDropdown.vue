<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <!-- //mark: Default -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <v-select
          class="pl-form"
          :items="dropItems"
          placeholder="선택하세요"
        ></v-select>
        <v-select
          class="pl-form"
          :items="dropItems"
          disabled
          placeholder="선택하세요"
        ></v-select>
        <v-select
          class="pl-form"
          :items="dropItems"
          readonly
          placeholder="선택하세요"
        ></v-select>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: Combobox -->
    <h2>{{ toplink[1] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <v-combobox
          class="pl-form"
          :items="dropItems"
          placeholder="상담유형"
          />
        <v-combobox
          class="pl-form is-lg"
          :items="dropItems"
          multiple
        />
        <div style="width: 500px;">
          <v-combobox
            class="pl-form is-auto"
            :items="dropItems"
            multiple
            small-chips
            >
            <template v-slot:selection="{ attrs, item, parent, selected, index }">
              <v-chip
                v-if="item === Object(item)"
                v-bind="attrs"
                :input-value="selected"
                small
              >
                <span class="pr-2">
                  {{ item.text }}
                </span>
                <v-icon small @click="parent.selectItem(item)" >
                  $delete
                </v-icon>
              </v-chip>
            </template>
          </v-combobox>
        </div>
      </div>

    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />

  </div>
</template>

<script>
import guideJs from '@/Guide/guide.js'
export default {
  name: "GuideDropdown",

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
        'Combobox',
      ],
      source01: null,
      source02: null,
      source03: null,
      source04: null,
      source05: null,
      dropItemRemove: true,
      dropItemM: '',
      dropItems: [
        { text: "FONT SIZE 긴글 테스트", },
        { text: "INPUT", disabled: true, },
        { text: "DROPDOWN", },
        { text: "CHECK", },
        { text: "RADIO", },
        { text: "BUTTON", },
        { text: "TEXTAREA", },
        { text: "CHIPS", },
        { text: "BADGES", },
        { text: "TOOLTIP", },
        { text: "TOAST", },
        { text: "ALERT", },
        { text: "MODAL", },
        { text: "TREEVIEW", },
      ],
      auto_items: ['상담유형1-1','상담유형1-2','상담유형1-3','상담유형1-4','상담유형1-5'],
      select_member: '',
      member_items: [
        {id: 'teletalk01', name: '홍길동', group: '상담1팀'},
        {id: 'teletalk02', name: '유재순', group: '상담2팀'},
        {id: 'teletalk03', name: '김상담', group: '상담3팀'},
        {id: 'teletalk04', name: '유재석', group: '상담4팀'},
        {id: 'teletalk05', name: '강호동', group: '상담5팀'},
      ],
      items: ['상담유형1', '상담유형2', '상담유형3', '상담유형4'],

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<v-select
  class="pl-form"
  :items="dropItems"
  placeholder="선택하세요"
></v-select>
<v-select
  class="pl-form"
  :items="dropItems"
  disabled
  placeholder="선택하세요"
></v-select>
<v-select
  class="pl-form"
  :items="dropItems"
  readonly
  placeholder="선택하세요"
></v-select>`
          },
          { tab: "script", content:
`dropItems: [
  { text: "FONT SIZE 긴글 테스트", },
  { text: "INPUT", disabled: true, },
  { text: "DROPDOWN", },
  ...
],` },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`<v-combobox
  class="pl-form"
  :items="dropItems"
  placeholder="상담유형"
  />
<v-combobox
  class="pl-form is-lg"
  :items="dropItems"
  multiple
/>
<div style="width: 500px;">
  <v-combobox
    class="pl-form is-auto"
    :items="dropItems"
    multiple
    small-chips
    >
    <template v-slot:selection="{ attrs, item, parent, selected, index }">
      <v-chip
        v-if="item === Object(item)"
        v-bind="attrs"
        :input-value="selected"
        small
      >
        <span class="pr-2">
          {{ item.text }}
        </span>
        <v-icon small @click="parent.selectItem(item)" >
          $delete
        </v-icon>
      </v-chip>
    </template>
  </v-combobox>
</div>`
          },
          { tab: "script", content:
          `dropItems: [
  { text: "FONT SIZE 긴글 테스트", },
  { text: "INPUT", disabled: true, },
  { text: "DROPDOWN", },
  ...
],` },
        ],
        srcInput_03: [
          {
            tab: "html",
            content:
``
          },
          { tab: "script", content:
`` },
        ],
        srcInput_04: [
          {
            tab: "html",
            content:
``
          },
          { tab: "script", content:
`` },
        ],
        srcInput_05: [
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