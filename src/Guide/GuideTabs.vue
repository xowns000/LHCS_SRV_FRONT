<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <!-- //mark: Default -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <v-tabs class="pl-tabs" >
        <v-tab>스킬사별 상담사설정</v-tab>
        <v-tab>상담사별 스킬설정</v-tab>
        <v-tab>기타 스킬설정</v-tab>
        <v-tab-item transition="fade-transition">
          <div>Tab1 content</div>
        </v-tab-item>
        <v-tab-item transition="fade-transition">
          <div>Tab2 content</div>
        </v-tab-item>
        <v-tab-item transition="fade-transition">
          <div>Tab3 content</div>
        </v-tab-item>
      </v-tabs>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: Sub Tab -->
    <h2>{{ toplink[1] }}</h2>
    <div class="guide-card">
      <v-tabs class="pl-tabs type-sub" >
        <v-tab>발송설정</v-tab>
        <v-tab>발송내역</v-tab>
        <v-tab>예약내역</v-tab>
        <v-tab-item>
          <div>Tab1 content</div>
        </v-tab-item>
        <v-tab-item>
          <div>Tab2 content</div>
        </v-tab-item>
        <v-tab-item>
          <div>Tab3 content</div>
        </v-tab-item>
      </v-tabs>
    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />

     <!-- //mark: Main Tab -->
    <h2>{{ toplink[2] }}</h2>
    <div class="guide-card">
      <v-tabs class="pl-tabs type-main" >
        <v-tab>상담이력
          <span class="pl-tab-badge">{{ main_tab_badge[0] }}</span>
        </v-tab>
        <v-tab>VOC
          <span class="pl-tab-badge">{{ main_tab_badge[1] }}</span>
        </v-tab>
        <v-tab>예약콜
          <span class="pl-tab-badge">{{ main_tab_badge[2] }}</span>
        </v-tab>
        <v-tab-item>
          <div>Tab1 content</div>
        </v-tab-item>
        <v-tab-item>
          <div>Tab2 content</div>
        </v-tab-item>
        <v-tab-item>
          <div>Tab3 content</div>
        </v-tab-item>
      </v-tabs>
    </div>
    <guide-srcview :ModelProp.sync="source03" :SrcProp="srcAll.srcInput_03" />

    <!-- //mark: Sort -->
    <h2>{{ toplink[3] }}</h2>
    <div class="guide-card">
      <ul class="pl-sort-tabs">
        <li
          v-for="item, index in SORT_ITEMS"
          :key="item.id"
          :class="item.selected ? 'selected' : ''"
          @click="mixin_selected_sort('SORT_ITEMS', index)"
          >
          {{ item.title }}
        </li>
      </ul>
    </div>
    <guide-srcview :ModelProp.sync="source04" :SrcProp="srcAll.srcInput_04" />


  </div>
</template>

<script>
import guideJs from '@/Guide/guide.js'
export default {
  name: "GuideTabs",
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
        'Sub Tab',
        'Main Tab',
        'Sort',
      ],
      // MAIN TAB
      main_tab_badge: [22,33,5,11],

      // sort
      SORT_ITEMS: [
        { title: '전체', selected: false },
        { title: '일반', selected: false },
        { title: '공지', selected: false },
        { title: '긴급', selected: false },
      ],

      source01: null,
      source02: null,
      source03: null,
      source04: null,

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<v-tabs class="pl-tabs" >
  <v-tab>스킬사별 상담사설정</v-tab>
  <v-tab>상담사별 스킬설정</v-tab>
  <v-tab>기타 스킬설정</v-tab>
  <v-tab-item transition="fade-transition">
    <div>Tab1 content</div>
  </v-tab-item>
  <v-tab-item transition="fade-transition">
    <div>Tab2 content</div>
  </v-tab-item>
  <v-tab-item transition="fade-transition">
    <div>Tab3 content</div>
  </v-tab-item>
</v-tabs>`
          },
          { tab: "script", content:
`` },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`<v-tabs class="pl-tabs type-sub" >
  <v-tab>발송설정</v-tab>
  <v-tab>발송내역</v-tab>
  <v-tab>예약내역</v-tab>
  <v-tab-item>
    <div>Tab1 content</div>
  </v-tab-item>
  <v-tab-item>
    <div>Tab2 content</div>
  </v-tab-item>
  <v-tab-item>
    <div>Tab3 content</div>
  </v-tab-item>
</v-tabs>`
          },
          { tab: "script", content:
`` },
        ],
        srcInput_03: [
          {
            tab: "html",
            content:
`<v-tabs class="pl-tabs type-main" >
  <v-tab>상담이력
    <span class="pl-tab-badge">{{ main_tab_badge[0] }}</span>
  </v-tab>
  <v-tab>VOC
    <span class="pl-tab-badge">{{ main_tab_badge[1] }}</span>
  </v-tab>
  <v-tab>예약콜
    <span class="pl-tab-badge">{{ main_tab_badge[2] }}</span>
  </v-tab>
  <v-tab-item>
    <div>Tab1 content</div>
  </v-tab-item>
  <v-tab-item>
    <div>Tab2 content</div>
  </v-tab-item>
  <v-tab-item>
    <div>Tab3 content</div>
  </v-tab-item>
</v-tabs>`
          },
          { tab: "script", content:
`data() {
  return {
    main_tab_badge: [22,33,5,11],
  }
},
methods: {

},
computed: {

},` },
        ],
        srcInput_04: [
          {
            tab: "html",
            content:
`<ul class="pl-sort-tabs">
  <li
    v-for="item, index in SORT_ITEMS"
    :key="item.id"
    :class="item.selected ? 'selected' : ''"
    @click="mixin_selected_sort('SORT_ITEMS', index)"
    >
    {{ item.title }}
  </li>
</ul>`
          },
          { tab: "script", content:
`data() {
  return {
    SORT_ITEMS: [
      { title: '전체', selected: false },
      { title: '일반', selected: false },
      { title: '공지', selected: false },
      { title: '긴급', selected: false },
    ],
  }
},
methods: {

},
computed: {

},` },
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