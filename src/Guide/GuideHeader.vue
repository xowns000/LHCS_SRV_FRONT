<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <!-- //mark: Size -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <div class="pl-search-form">
        <div class="pl-form-inline-wrap">
          <div class="pl-form-inline">
            <span class="pl-label">
              고객 상태
              <v-icon class="pl-icon20 required"></v-icon>
            </span>
            <div class="pl-desc">
              <v-select
              class="pl-form"
              :items="DropCus.stat"
              placeholder="고객 상태"
              ></v-select>
              <v-select
              class="pl-form"
              :items="DropCus.name"
              placeholder="고객명"
              ></v-select>
              <v-text-field class="pl-form" value="" placeholder="검색어 입력" />
              <v-btn class="pl-btn is-icon">
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
            </div>
          </div>
        </div>
        <div class="is-right">
          전체 <strong>(49)건</strong>
        </div>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <h2>{{ toplink[1] }}</h2>
    <div class="guide-card">
      <div class="pl-search-header">
        <strong class="pl-search-header-tit">공통코드(아웃바운드 처리상태) </strong>
        <div class="is-right">
          <v-text-field
            class="pl-form is-search is-lg"
            placeholder="분류코드 또는 분류코드 명 입력"
            @keydown.enter="mixin_testLog('search btn')"
          >
          <template v-slot:append>
            <v-btn
              @click="mixin_testLog('search btn')"
              class="pl-btn has-icon-only">
              <span class="pl-icon20 in-search"></span>
            </v-btn>
          </template>
          </v-text-field>
        </div>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />


  </div>
</template>

<script>

import guideJs from '@/Guide/guide.js'

export default {
  name: "GuideHeader",

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
        'Dialog Search Header',
        'Card Sub Header',
      ],
      source01: null,
      source02: null,
      source03: null,

      //고객 찾기
      DropCus : {
        stat: [ '전체', '정상', '휴면', '삭제' ],
        name: [ '고객명', '고객 ID' ],
      },

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<div class="pl-search-form">
  <div class="pl-form-inline-wrap">
    <div class="pl-form-inline">
      <span class="pl-label">
        고객 상태
        <v-icon class="pl-icon20 required"></v-icon>
      </span>
      <div class="pl-desc">
        <v-select
        class="pl-form"
        :items="DropCus.stat"
        placeholder="고객 상태"
        ></v-select>
        <v-select
        class="pl-form"
        :items="DropCus.name"
        placeholder="고객명"
        ></v-select>
        <v-text-field class="pl-form" value="" placeholder="검색어 입력" />
        <v-btn class="pl-btn is-icon">
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
      </div>
    </div>
  </div>
  <div class="is-right">
    전체 <strong>(49)건</strong>
  </div>
</div>`
          },
          { tab: "script", content:
`data() {
  return {
    DropCus : {
      stat: [ '전체', '정상', '휴면', '삭제' ],
      name: [ '고객명', '고객 ID' ],
    },
  }
}` },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`<div class="pl-search-header">
  <strong class="pl-search-header-tit">공통코드(아웃바운드 처리상태) </strong>
  <div class="is-right">
    <v-text-field
      class="pl-form is-search is-lg"
      placeholder="분류코드 또는 분류코드 명 입력"
      @keydown.enter="mixin_testLog('search btn')"
    >
    <template v-slot:append>
      <v-btn
        @click="mixin_testLog('search btn')"
        class="pl-btn has-icon-only">
        <span class="pl-icon20 in-search"></span>
      </v-btn>
    </template>
    </v-text-field>
  </div>
</div>`
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