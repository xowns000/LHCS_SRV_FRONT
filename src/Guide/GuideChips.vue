<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <!-- //mark: Size -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <div class="pl-tags-wrap">
        <v-chip-group
          active-class="active-tag"
          column
        >
          <template v-for="tag, index in tags" >
            <v-chip
              v-show="tag.active"
              :key="index"
              close
              @click:close="tag.active = false"
            >
              {{ tag.text }}
            </v-chip>
          </template>
          <template>
            <!-- 추가 입력 -->
            <v-text-field
              v-model="addTagValue"
              @keydown.enter="addTag()"
              @input="onInputTag"
              :style="computedTagSize"
              class="pl-form is-tag">
              <template v-slot:append>
                <v-btn
                  @click="addTag()"
                  class="pl-btn has-icon-only">
                  <span class="pl-icon20 edit"></span>
                </v-btn>
              </template>
            </v-text-field>
          </template>
        </v-chip-group>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: Round chip -->
    <h2>{{ toplink[1] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <span class="pl-round-chip is-sm chat-stat-done">완료</span>
        <span class="pl-round-chip is-sm chat-stat-after">후처리</span>
        <span class="pl-round-chip is-sm chat-stat-cs">상담중</span>
        <span class="pl-round-chip is-sm chat-stat-wait">대기중</span>
      </div>
      <v-divider class="my-2"></v-divider>
      <div class="guide-gap">
        <span class="pl-round-chip is-sm chat-stat-done">게시완료</span>
        <span class="pl-round-chip is-sm chat-stat-done">사용안함</span>
        <span class="pl-round-chip is-sm chat-stat-after">종료</span>
        <span class="pl-round-chip is-sm chat-stat-cs">진행중</span>
        <span class="pl-round-chip is-sm chat-stat-cs">사용</span>
        <span class="pl-round-chip is-sm chat-stat-wait">준비중</span>
      </div>
      <v-divider class="my-2"></v-divider>
      <div class="guide-gap">
        <span class="pl-round-chip is-txt-error">서비스종료</span>
        <span class="pl-round-chip is-txt-reject">일시정지</span>
        <span class="pl-round-chip is-txt-accept">서비스중</span>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />


  </div>
</template>

<script>

import guideJs from '@/Guide/guide.js'

export default {
  name: "GuideChips",

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
        'Tag',
        'Round Chip'
      ],
      source01: null,
      source02: null,
      source03: null,

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<div class="pl-tags-wrap">
  <v-chip-group
    active-class="active-tag"
    column
  >
    <template v-for="tag, index in tags" >
      <v-chip
        v-show="tag.active"
        :key="index"
        close
        @click:close="tag.active = false"
      >
        {{ tag.text }}
      </v-chip>
    </template>
    <template>
      <!-- 추가 입력 -->
      <v-text-field
        v-model="addTagValue"
        @keydown.enter="addTag()"
        @input="onInputTag"
        :style="computedTagSize"
        class="pl-form is-tag">
        <template v-slot:append>
          <v-btn
            @click="addTag()"
            class="pl-btn has-icon-only">
            <span class="pl-icon20 edit"></span>
          </v-btn>
        </template>
      </v-text-field>
    </template>
  </v-chip-group>
</div>`
          },
          { tab: "script", content:
`data() {
  return {
    addTagValue : '',
    inputTagSize : '',
    tags: [
      { text: '할인', active: true},
      { text: '청약', active: true},
      { text: '청약상품안내', active: true},
      { text: '금리 조정', active: true},
    ],
  }
},
methods: {
  addTag(){
    const addTag = { text: this.addTagValue, active: true };
    let tagVal = this.addTagValue.trim();
    if( tagVal.length !== 0 ) {
      this.tags.push(addTag);
      this.addTagValue = '';
      this.inputTagSize = 0;
    }
  },
  onInputTag(){
    this.inputTagSize = this.addTagValue.length;
  }
},
computed: {
  computedTagSize() {
    return \`flex: 0 0 \${ this.inputTagSize + 12 }ch;\`;
  }
},` },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`<div class="guide-gap">
  <span class="pl-round-chip is-sm chat-stat-done">완료</span>
  <span class="pl-round-chip is-sm chat-stat-after">후처리</span>
  <span class="pl-round-chip is-sm chat-stat-cs">상담중</span>
  <span class="pl-round-chip is-sm chat-stat-wait">대기중</span>
</div>
<v-divider class="my-2"></v-divider>
<div class="guide-gap">
  <span class="pl-round-chip is-sm chat-stat-done">게시완료</span>
  <span class="pl-round-chip is-sm chat-stat-done">사용안함</span>
  <span class="pl-round-chip is-sm chat-stat-after">종료</span>
  <span class="pl-round-chip is-sm chat-stat-cs">진행중</span>
  <span class="pl-round-chip is-sm chat-stat-cs">사용</span>
  <span class="pl-round-chip is-sm chat-stat-wait">준비중</span>
</div>
<v-divider class="my-2"></v-divider>
<div class="guide-gap">
  <span class="pl-round-chip is-txt-error">서비스종료</span>
  <span class="pl-round-chip is-txt-reject">일시정지</span>
  <span class="pl-round-chip is-txt-accept">서비스중</span>
</div>`
          },
          { tab: "script", content:
`` },
        ],

      },

      //tags
      addTagValue : '',
      inputTagSize : '',
      tags: [
        { text: '할인', active: true},
        { text: '청약', active: true},
        { text: '청약상품안내', active: true},
        { text: '금리 조정', active: true},
      ],
    }
  },
  methods: {
    addTag(){
      const addTag = { text: this.addTagValue, active: true };
      let tagVal = this.addTagValue.trim();
      if( tagVal.length !== 0 ) {
        this.tags.push(addTag);
        this.addTagValue = '';
        this.inputTagSize = 0;
      }
    },
    onInputTag(){
      this.inputTagSize = this.addTagValue.length;
    }
  },
  computed: {
    computedTagSize() {
      return `flex: 0 0 ${ this.inputTagSize + 12 }ch;`;
    }
  },
  mounted() {
    guideJs.appendHiddenLink(this.toplink);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>