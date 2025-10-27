<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <!-- //mark: Default -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" dark v-on="on">BOTTOM</v-btn>
          </template>
          <span>아래로 나오는 툴팁</span>
        </v-tooltip>
        <v-tooltip content-class="pl-tooltip top" top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" dark v-on="on">TOP</v-btn>
          </template>
          <span>위로 나오는 툴팁</span>
        </v-tooltip>
        <v-tooltip content-class="pl-tooltip left" left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" dark v-on="on">LEFT</v-btn>
          </template>
          <span>왼쪽에 나오는 툴팁</span>
        </v-tooltip>
        <v-tooltip content-class="pl-tooltip right" right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" dark v-on="on">RIGHT</v-btn>
          </template>
          <span>오른쪽에 나오는 툴팁</span>
        </v-tooltip>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: Multi Line -->
    <h2>{{ toplink[1] }}</h2>
    <div class="guide-card">
      <v-tooltip content-class="pl-tooltip" bottom max-width="100%" >
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on" class="ml-2">
            테이블 형식, 줄바꿈 형식
          </v-btn>
        </template>
        <div class="table-form">
          <table>
            <caption class="hide">
              사용자정보 항목
            </caption>
            <colgroup>
              <col width="100px" />
              <col width="100px" />
              <col width="" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">상담일자</th>
                <th scope="col">콜 종료시간</th>
                <th scope="col">테스트</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2022-06-01</td>
                <td>19:30:11</td>
                <td>긴 내용 표시 샘플입니다.<br>줄바꿈 테스트 입니다.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-tooltip>
    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />

    <!-- //mark: Data -->
    <h2>{{ toplink[2] }}</h2>
    <div class="guide-card">
      <v-tooltip content-class="pl-tooltip" bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="pl-btn" v-bind="attrs" v-on="on">data msg</v-btn>
        </template>
        <span>{{ tooltipMsg }}</span>
      </v-tooltip>
    </div>
    <guide-srcview :ModelProp.sync="source03" :SrcProp="srcAll.srcInput_03" />

  </div>
</template>

<script>
import guideJs from '@/Guide/guide.js'
export default {
  name: "GuideTooltip",
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
        'Multi Line',
        'Data',
      ],
      source01: null,
      source02: null,
      source03: null,
      tooltipMsg: '이것은 툴팁입니다',

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<v-tooltip content-class="pl-tooltip " bottom>
  <template v-slot:activator="{ on, attrs }">
    <v-btn v-bind="attrs" dark v-on="on">BOTTOM</v-btn>
  </template>
  <span>아래로 나오는 툴팁</span>
</v-tooltip>
<v-tooltip content-class="pl-tooltip top" top>
  <template v-slot:activator="{ on, attrs }">
    <v-btn v-bind="attrs" dark v-on="on">TOP</v-btn>
  </template>
  <span>위로 나오는 툴팁</span>
</v-tooltip>
<v-tooltip content-class="pl-tooltip left" left>
  <template v-slot:activator="{ on, attrs }">
    <v-btn v-bind="attrs" dark v-on="on">LEFT</v-btn>
  </template>
  <span>왼쪽에 나오는 툴팁</span>
</v-tooltip>
<v-tooltip content-class="pl-tooltip right" right>
  <template v-slot:activator="{ on, attrs }">
    <v-btn v-bind="attrs" dark v-on="on">RIGHT</v-btn>
  </template>
  <span>오른쪽에 나오는 툴팁</span>
</v-tooltip>`
          },
          { tab: "script", content:
`` },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`<v-tooltip content-class="pl-tooltip" bottom max-width="100%">
  <template v-slot:activator="{ on, attrs }">
    <v-btn color="primary" dark v-bind="attrs" v-on="on" class="ml-2">
      테이블 형식, 줄바꿈 형식
    </v-btn>
  </template>
  <div class="table-form">
    <table>
      <caption class="hide">
        사용자정보 항목
      </caption>
      <colgroup>
        <col width="100px" />
        <col width="100px" />
        <col width="" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">상담일자</th>
          <th scope="col">콜 종료시간</th>
          <th scope="col">테스트</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>2022-06-01</td>
          <td>19:30:11</td>
          <td>긴 내용 표시 샘플입니다.<br>줄바꿈 테스트 입니다.</td>
        </tr>
      </tbody>
    </table>
  </div>
</v-tooltip>`
          },
          { tab: "script", content:
`` },
        ],
        srcInput_03: [
          {
            tab: "html",
            content:
`<v-tooltip content-class="pl-tooltip" bottom>
  <template v-slot:activator="{ on, attrs }">
    <v-btn class="pl-btn" v-bind="attrs" v-on="on">data msg</v-btn>
  </template>
  <span>{{ tooltipMsg }}</span>
</v-tooltip>`
          },
          { tab: "script", content:
`tooltipMsg: '이것은 툴팁입니다'` },
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