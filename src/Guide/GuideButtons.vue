<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>
    <!-- //mark: Default -->
    <h2 >{{ toplink[0] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <v-btn class="pl-btn">기본</v-btn>
        <v-btn class="pl-btn is-sub">취소</v-btn>
        <v-btn class="pl-btn" disabled>disabled</v-btn>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: Size -->
    <h2 >{{ toplink[1] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <v-btn class="pl-btn is-sm">기본</v-btn>
        <v-btn class="pl-btn is-sub is-sm">취소</v-btn>
        <v-btn disabled class="pl-btn is-sm">disabled</v-btn>
        <v-btn class="pl-btn is-lg">기본</v-btn>
        <v-btn class="pl-btn is-lg is-sub">기본</v-btn>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />

    <!-- //mark: Append Icon -->
    <h2 >{{ toplink[2] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <v-btn class="pl-btn is-icon">
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
        <v-btn class="pl-btn is-icon" disabled>
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
        <v-btn class="pl-btn is-icon is-sub">
          <span class="pl-icon20 document"></span>
          선택항목 상세
        </v-btn>
        <v-btn class="pl-btn is-icon is-sub">
          <span class="pl-icon20 circle-plus"></span>
          채팅이력 생성
        </v-btn>
        <v-btn class="pl-btn is-icon is-sub">
          <span class="pl-icon20 trash"></span>
          삭제
        </v-btn>
        <v-btn class="pl-btn is-icon is-sub">
          <span class="pl-icon20 excelup"></span>
          엑셀 업로드
        </v-btn>
        <v-btn class="pl-btn is-icon is-sub">
          <span class="pl-icon20 exceltemplate"></span>
          엑셀 양식 다운로드
        </v-btn>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source03" :SrcProp="srcAll.srcInput_03" />

    <!-- //mark: Icon & Tooltip -->
    <h2 >{{ toplink[3] }}</h2>
    <guide-table :PropTable="propsTable" />
    <div class="guide-card">
      <div class="guide-gap">
        <!-- 툴팁 버튼 -->
        <compo-tooltip-btn
          TitleProp="툴팁내용입니다. 툴팁내용입니다.<br> 툴팁내용입니다. "
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 question"
          TooltipPositionProp="bottom"
        ></compo-tooltip-btn>
        <!-- 수정 버튼 -->
        <compo-tooltip-btn
          v-if="!editable"
          TitleProp="수정"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 edit"
          TooltipPositionProp="bottom"
          @btnClick="editable = true"
        ></compo-tooltip-btn>
        <compo-tooltip-btn
          v-else
          TitleProp="확인"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 is-drag-icon-check"
          TooltipPositionProp="bottom"
          @btnClick="editable = false"
        ></compo-tooltip-btn>

        <!-- 상세 버튼 -->
        <compo-tooltip-btn
          TitleProp="상세"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 detail"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('상세')"
        ></compo-tooltip-btn>
        <!-- 상세 필터 버튼 -->
        <compo-tooltip-btn
          TitleProp="상세 필터"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 filter"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('상세 필터')"
        ></compo-tooltip-btn>
        <!-- 리사이즈 토글 -->
        <compo-tooltip-btn
          :TitleProp=computedResizeText
          ClassProp="pl-tooltip-btn"
          :IconProp=computedResizeClass
          TooltipPositionProp="bottom"
          @btnClick="toggleResize()"
        ></compo-tooltip-btn>
        <!-- 상세 검색 버튼 -->
        <compo-tooltip-btn
          TitleProp="상세 검색"
          ClassProp="pl-tooltip-btn is-line"
          :IconProp=computedSearchToggleClass
          TooltipPositionProp="bottom"
          @btnClick="mixin_searchDetailToggle()"
        ></compo-tooltip-btn>
        <!-- 엑셀 다운로드 버튼 -->
        <compo-tooltip-btn
          TitleProp="엑셀 다운로드"
          ClassProp="pl-tooltip-btn is-line"
          IconProp="pl-icon20 exceldown"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('엑셀 다운로드')"
        ></compo-tooltip-btn>
        <!-- arrow up 버튼 -->
        <compo-tooltip-btn
          TitleProp="up"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon30 is-arrow-up"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('up')"
        ></compo-tooltip-btn>
        <!-- arrow down 버튼 -->
        <compo-tooltip-btn
          TitleProp="down"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon30 is-arrow-down"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('down')"
        ></compo-tooltip-btn>
        <!-- arrow left 버튼 -->
        <compo-tooltip-btn
          TitleProp="left"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon30 is-arrow-left"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('left')"
        ></compo-tooltip-btn>
        <!-- arrow right 버튼 -->
        <compo-tooltip-btn
          TitleProp="right"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon30 is-arrow-right"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('right')"
        ></compo-tooltip-btn>
        <!-- new folder 버튼 -->
        <compo-tooltip-btn
          TitleProp="그룹 생성"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 is-new-folder"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('그룹 생성')"
        ></compo-tooltip-btn>
        <!-- list up 버튼 -->
        <compo-tooltip-btn
          TitleProp="순서 위로"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 is-list-up"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('list up ')"
        ></compo-tooltip-btn>
        <!-- list down 버튼 -->
        <compo-tooltip-btn
          TitleProp="순서 아래로"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 is-list-down"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('list down')"
        ></compo-tooltip-btn>

      </div>
    </div>
    <guide-srcview :ModelProp.sync="source04" :SrcProp="srcAll.srcInput_04" />

    <!-- //mark: Group -->
    <h2 >{{ toplink[4] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <v-btn-toggle v-model="datePeriod" class="pl-btn-group" mandatory>
          <v-btn v-for="item in btnGroup" :key="item.id" class="pl-btn">
            {{ item.text }}
          </v-btn>
        </v-btn-toggle>
        <v-btn-toggle v-model="viewSorting" class="pl-btn-group" mandatory>
          <template v-for="item in btnGroupSort" >
            <compo-tooltip-btn
              :key="item.id"
              :TitleProp="item.title"
              ClassProp="pl-btn"
              :IconProp="`pl-icon20 ${item.icon}`"
              TooltipPositionProp="bottom"
              @btnClick="() => FnBtnPath(item.evt)"
            ></compo-tooltip-btn>
          </template>
        </v-btn-toggle>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source05" :SrcProp="srcAll.srcInput_05" />

    <!-- //mark: Main Icon -->
    <h2 >{{ toplink[5] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <compo-tooltip-btn
          TitleProp="전화"
          ClassProp="pl-tooltip-btn is-blue"
          IconProp="pl-icon20 main-call"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('전화')"
        ></compo-tooltip-btn>
        <compo-tooltip-btn
          TitleProp="문자"
          ClassProp="pl-tooltip-btn is-blue"
          IconProp="pl-icon20 main-sms"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('문자')"
        ></compo-tooltip-btn>
        <compo-tooltip-btn
          TitleProp="이메일"
          ClassProp="pl-tooltip-btn is-blue"
          IconProp="pl-icon20 main-email"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('이메일')"
        ></compo-tooltip-btn>
        <compo-tooltip-btn
          TitleProp="채팅"
          ClassProp="pl-tooltip-btn is-blue"
          IconProp="pl-icon20 main-talk"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('채팅')"
        ></compo-tooltip-btn>
        <compo-tooltip-btn
          TitleProp="상세"
          ClassProp="pl-tooltip-btn is-blue"
          IconProp="pl-icon20 main-detail"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('상세')"
        ></compo-tooltip-btn>

      </div>

    </div>
    <guide-srcview :ModelProp.sync="source06" :SrcProp="srcAll.srcInput_06" />

  </div>
</template>

<script>
import guideJs from '@/Guide/guide.js'

export default {
  name: "GuideButtons",

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
        'Size Buttons',
        'Append Icon',
        'Only Icon & Tooltip',
        'Group',
        'Main Icon',
      ],
      source01: null,
      source02: null,
      source03: null,
      source04: null,
      source05: null,
      source06: null,
      propsTable: [
        { name: 'MinWidthProp', type: 'Number', default: '30', description: '아이콘 width', },
        { name: 'HeightProp', type: 'Number', default: '30', description: '아이콘 height', },
        { name: 'TitleProp', type: 'String', default: 'undefined', description: '툴팁 타이틀', },
        { name: 'DisabledProp', type: 'Boolean', default: 'false', description: 'disabled', },
        { name: 'ClassProp', type: 'String', default: 'undefined', description: '인라인 클래스', },
        { name: 'TooltipPositionProp', type: 'String', default: 'bottom', description: '툴팁 포지션, bottom, top, left, right', },
        { name: 'IconProp', type: 'String', default: 'undefined', description: '아이콘 클래스', },

      ],

      toggleClass : false,
      resizeClass: false,
      datePeriod: 1, //초기 selected 값
      viewSorting: 0, //초기 selected 값
      editable: false, //수정 버튼
      chgClr: null,
      btnGroup: [
        { text: '1개월' },
        { text: '2개월' },
        { text: '3개월' },
        { text: '4개월' },
        { text: '5개월' },
      ],
      btnGroupSort: [
        { icon: 'pl-icon20 sort-list', title: '목록보기', evt: () =>{ this.mixin_testLog("목록보기") }  },
        { icon: 'pl-icon20 sort-tree', title: '트리보기', evt: () => { this.mixin_testLog("트리보기") } },
      ],


      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<v-btn class="pl-btn">기본</v-btn>
<v-btn class="pl-btn is-sub">취소</v-btn>
<v-btn disabled class="pl-btn">disabled</v-btn>`
          },
          { tab: "script", content:
`` },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`<v-btn class="pl-btn is-sm">기본</v-btn>
<v-btn class="pl-btn is-sub is-sm">취소</v-btn>
<v-btn disabled class="pl-btn is-sm">disabled</v-btn>
<v-btn class="pl-btn is-lg">기본</v-btn>
<v-btn class="pl-btn is-lg is-sub">기본</v-btn>`
          },
          { tab: "script", content:
`` },
        ],
        srcInput_03: [
          {
            tab: "html",
            content:
`<v-btn class="pl-btn is-icon">
  <span class="pl-icon20 search"></span>
  조회
</v-btn>
<v-btn class="pl-btn is-icon" disabled>
  <span class="pl-icon20 search"></span>
  조회
</v-btn>
<v-btn class="pl-btn is-icon is-sub">
  <span class="pl-icon20 document"></span>
  선택항목 상세
</v-btn>
<v-btn class="pl-btn is-icon is-sub">
  <span class="pl-icon20 circle-plus"></span>
  채팅이력 생성
</v-btn>
<v-btn class="pl-btn is-icon is-sub">
  <span class="pl-icon20 trash"></span>
  삭제
</v-btn>
<v-btn class="pl-btn is-icon is-sub">
  <span class="pl-icon20 excelup"></span>
  엑셀 업로드
</v-btn>
<v-btn class="pl-btn is-icon is-sub">
  <span class="pl-icon20 exceltemplate"></span>
  엑셀 양식 다운로드
</v-btn>`
          },
          { tab: "script", content:
`` },
        ],
        srcInput_04: [
          {
            tab: "html",
            content:
`<!-- 툴팁 버튼 -->
<compo-tooltip-btn
  TitleProp="툴팁내용입니다. 툴팁내용입니다.<br> 툴팁내용입니다. "
  ClassProp="pl-tooltip-btn"
  IconProp="pl-icon20 question"
  TooltipPositionProp="bottom"
></compo-tooltip-btn>
<!-- 수정 버튼 -->
<compo-tooltip-btn
  v-if="!editable"
  TitleProp="수정"
  ClassProp="pl-tooltip-btn"
  IconProp="pl-icon20 edit"
  TooltipPositionProp="bottom"
  @btnClick="editable = true"
></compo-tooltip-btn>
<compo-tooltip-btn
  v-else
  TitleProp="확인"
  ClassProp="pl-tooltip-btn"
  IconProp="pl-icon20 is-drag-icon-check"
  TooltipPositionProp="bottom"
  @btnClick="editable = false"
></compo-tooltip-btn>
<!-- 상세 버튼 -->
<compo-tooltip-btn
  TitleProp="상세"
  ClassProp="pl-tooltip-btn"
  IconProp="pl-icon20 detail"
  TooltipPositionProp="bottom"
  @btnClick="mixin_testLog('상세')"
></compo-tooltip-btn>
<!-- 상세 필터 버튼 -->
<compo-tooltip-btn
  TitleProp="상세 필터"
  ClassProp="pl-tooltip-btn"
  IconProp="pl-icon20 filter"
  TooltipPositionProp="bottom"
  @btnClick="mixin_testLog('상세 필터')"
></compo-tooltip-btn>
<!-- 리사이즈 토글 -->
<compo-tooltip-btn
  :TitleProp=computedResizeText
  ClassProp="pl-tooltip-btn"
  :IconProp=computedResizeClass
  TooltipPositionProp="bottom"
  @btnClick="toggleResize()"
></compo-tooltip-btn>
<!-- 상세 검색 버튼 -->
<compo-tooltip-btn
  TitleProp="상세 검색"
  ClassProp="pl-tooltip-btn is-line"
  :IconProp=computedSearchToggleClass
  TooltipPositionProp="bottom"
  @btnClick="mixin_searchDetailToggle()"
></compo-tooltip-btn>
<!-- 엑셀 다운로드 버튼 -->
<compo-tooltip-btn
  TitleProp="엑셀 다운로드"
  ClassProp="pl-tooltip-btn is-line"
  IconProp="pl-icon20 exceldown"
  TooltipPositionProp="bottom"
  @btnClick="mixin_testLog('엑셀 다운로드')"
></compo-tooltip-btn>
<!-- arrow up 버튼 -->
<compo-tooltip-btn
  TitleProp="up"
  ClassProp="pl-tooltip-btn"
  IconProp="pl-icon30 is-arrow-up"
  TooltipPositionProp="bottom"
  @btnClick="mixin_testLog('up')"
></compo-tooltip-btn>
<!-- arrow down 버튼 -->
<compo-tooltip-btn
  TitleProp="down"
  ClassProp="pl-tooltip-btn"
  IconProp="pl-icon30 is-arrow-down"
  TooltipPositionProp="bottom"
  @btnClick="mixin_testLog('down')"
></compo-tooltip-btn>
<!-- arrow left 버튼 -->
<compo-tooltip-btn
  TitleProp="left"
  ClassProp="pl-tooltip-btn"
  IconProp="pl-icon30 is-arrow-left"
  TooltipPositionProp="bottom"
  @btnClick="mixin_testLog('left')"
></compo-tooltip-btn>
<!-- arrow right 버튼 -->
<compo-tooltip-btn
  TitleProp="right"
  ClassProp="pl-tooltip-btn"
  IconProp="pl-icon30 is-arrow-right"
  TooltipPositionProp="bottom"
  @btnClick="mixin_testLog('right')"
></compo-tooltip-btn>
<!-- new folder 버튼 -->
<compo-tooltip-btn
  TitleProp="그룹 생성"
  ClassProp="pl-tooltip-btn"
  IconProp="pl-icon20 is-new-folder"
  TooltipPositionProp="bottom"
  @btnClick="mixin_testLog('그룹 생성')"
></compo-tooltip-btn>
<!-- list up 버튼 -->
<compo-tooltip-btn
  TitleProp="순서 위로"
  ClassProp="pl-tooltip-btn"
  IconProp="pl-icon20 is-list-up"
  TooltipPositionProp="bottom"
  @btnClick="mixin_testLog('list up ')"
></compo-tooltip-btn>
<!-- list down 버튼 -->
<compo-tooltip-btn
  TitleProp="순서 아래로"
  ClassProp="pl-tooltip-btn"
  IconProp="pl-icon20 is-list-down"
  TooltipPositionProp="bottom"
  @btnClick="mixin_testLog('list down')"
></compo-tooltip-btn>`
          },
          { tab: "script", content:
`data() {
  return {
    toggleClass : false,
    resizeClass: false,
    editable: false,
  }
}
methods: {
  toggleResize() {
    this.resizeClass = !this.resizeClass;
  }
}
computed: {
  computedResizeClass() {
    return this.resizeClass === true ? 'pl-icon20 resize-on' : 'pl-icon20 resize-off'
  },
  computedResizeText() {
    return this.resizeClass === true ? '축소' : '확대'
  },
},` },
        ],
        srcInput_05: [
          {
            tab: "html",
            content:
`<v-btn-toggle v-model="datePeriod" class="pl-btn-group" mandatory>
  <v-btn v-for="item in btnGroup" :key="item.id" class="pl-btn">
    {{ item.text }}
  </v-btn>
</v-btn-toggle>

<v-btn-toggle v-model="viewSorting" class="pl-btn-group" mandatory>
  <template v-for="item in btnGroupSort" >
    <compo-tooltip-btn
      :key="item.id"
      :TitleProp="item.title"
      ClassProp="pl-btn"
      :IconProp="\`pl-icon20 \${item.icon}\`"
      TooltipPositionProp="bottom"
      @btnClick="() => FnBtnPath(item.evt)"
    ></compo-tooltip-btn>
  </template>
</v-btn-toggle>`
          },
          { tab: "script", content:
`data() {
  return {
    datePeriod: 1, //초기 selected 값
    viewSorting: 0, //초기 selected 값
    btnGroup: [
      { text: '1개월' },
      { text: '2개월' },
      { text: '3개월' },
      { text: '4개월' },
      { text: '5개월' },
    ],
    btnGroupSort: [
      { icon: 'pl-icon20 sort-list', title: '목록보기', evt: () =>{ this.mixin_testLog("목록보기") }  },
      { icon: 'pl-icon20 sort-tree', title: '트리보기', evt: () => { this.mixin_testLog("트리보기") } },
    ],
  }
},
methods: {
  FnBtnPath(evt) {
    evt();
  }
}` },
        ],
        srcInput_06: [
          {
            tab: "html",
            content:
`<compo-tooltip-btn
  TitleProp="전화"
  ClassProp="pl-tooltip-btn is-blue"
  IconProp="pl-icon20 main-call"
  TooltipPositionProp="bottom"
  @btnClick="mixin_testLog('전화')"
></compo-tooltip-btn>
<compo-tooltip-btn
  TitleProp="문자"
  ClassProp="pl-tooltip-btn is-blue"
  IconProp="pl-icon20 main-sms"
  TooltipPositionProp="bottom"
  @btnClick="mixin_testLog('문자')"
></compo-tooltip-btn>
<compo-tooltip-btn
  TitleProp="이메일"
  ClassProp="pl-tooltip-btn is-blue"
  IconProp="pl-icon20 main-email"
  TooltipPositionProp="bottom"
  @btnClick="mixin_testLog('이메일')"
></compo-tooltip-btn>
<compo-tooltip-btn
  TitleProp="채팅"
  ClassProp="pl-tooltip-btn is-blue"
  IconProp="pl-icon20 main-talk"
  TooltipPositionProp="bottom"
  @btnClick="mixin_testLog('채팅')"
></compo-tooltip-btn>
<compo-tooltip-btn
  TitleProp="상세"
  ClassProp="pl-tooltip-btn is-blue"
  IconProp="pl-icon20 main-detail"
  TooltipPositionProp="bottom"
  @btnClick="mixin_testLog('상세')"
></compo-tooltip-btn>`
          },
          { tab: "script", content:
`` },
        ],

      },
    }
  },
  methods: {
    toggleClick() {
      this.toggleClass = !this.toggleClass;
    },
    toggleResize() {
      this.resizeClass = !this.resizeClass;
    },
    FnBtnPath(evt) {
      evt();
    },
    chgTheme(newColor){
      let _chgClrInp = newColor;
      //메인 변수 컬러 가져오기
      getComputedStyle(document.documentElement).getPropertyValue('--primary-color');

      //메인 변수 컬러 지정
      document.documentElement.style.setProperty('--primary-color', _chgClrInp);
    },
  },
  computed: {
    computedToggleClass() {
      return this.toggleClass === true ? 'pl-icon20 arrow-down' : 'pl-icon20 arrow-up'
    },
    computedResizeClass() {
      return this.resizeClass === true ? 'pl-icon20 resize-on' : 'pl-icon20 resize-off'
    },
    computedResizeText() {
      return this.resizeClass === true ? '축소' : '확대'
    },
  },
  mounted() {
    guideJs.appendHiddenLink(this.toplink);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>