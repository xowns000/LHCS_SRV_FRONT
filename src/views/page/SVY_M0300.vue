<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                진행 년도
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="srvyYrItems"
                  v-model="SRVY_YR"
                  @change="getSrvyNm"
                  placeholder="선택하세요"></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">진행 상태</span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(this.common_code, 'PROG_ST', '전체')"
                  v-model="STTS_CD"
                  @change="getSrvyNm"
                  placeholder="선택하세요"></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">계획 구분</span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(this.common_code, 'SUVY_CL', '전체')"
                  v-model="SRVY_SE_CD"
                  @change="getSrvyNm"
                  placeholder="선택하세요"></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">설문조사 명</span>
              <div class="pl-desc">
                <v-select
                  class="pl-form is-auto"
                  :items="srvyNmItems"
                  v-model="SRVY_NM"
                  @change="btnSelectList"
                  @click="getSrvyNmRefresh"
                  placeholder="선택하세요"></v-select>
              </div>
            </div>
            <v-btn class="pl-btn is-icon" @click="btnSelectList">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <v-tabs class="pl-tabs" v-model="tab">
        <v-tab>설문결과 요약 보기</v-tab>
        <v-tab>설문결과 자세히 보기</v-tab>
      </v-tabs>
      <div style="height: 650px">
        <v-tabs-items v-model="tab" class="pl-tabs-items">
          <!-- 설문결과 요약 보기 -->
          <v-tab-item>
            <div class="pl-cols" style="height: 100%">
              <div class="is-col-fix is-vrt" style="width: 462px">
                <div class="pl-card">
                  <h2 class="pl-subtit">설문 요약</h2>
                  <div class="pl-subdesc">
                    <p>기준일자 : <strong>{{ SURVEY_SUMMARY.survey_date }}</strong></p>
                  </div>
                  <ul class="pl-list-info3 is-mt-s flex-wrap justify-space-between">
                    <li
                      v-for="(item, index) in SURVEY_STATUS"
                      :key="index"
                      class="flex-grow-1"
                      style="height: 80px; flex: 1 1 40%">
                      <span class="pl-list-info-title">
                        {{ item.title }}
                      </span>
                      <strong class="pl-list-info-desc" :class="item.class">{{ item.desc }}<span v-show="index === 3">%</span>
                      </strong>
                    </li>
                  </ul>
                </div>
                <div class="pl-card">
                  <h2 class="pl-subtit">설문조사 정보</h2>
                  <div class="pl-form-inline-wrap vertical type-readonly is-mt-s label-100">
                    <div
                      v-for="item in SURVEY_INFO"
                      class="pl-form-inline"
                      :key="item.id">
                      <span class="pl-label">
                        {{ item.title }}
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          class="pl-form"
                          :value="item.desc"
                          readonly
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="pl-card">
                  <h2 class="pl-subtit">설문 진행자</h2>
                  <div class="pl-form-inline-wrap vertical type-readonly is-mt-s label-100">
                    <div
                      v-for="item in SURVEY_MC"
                      class="pl-form-inline"
                      :key="item.id">
                      <span class="pl-label">
                        {{ item.title }}
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          class="pl-form"
                          :value="item.desc"
                          readonly
                        />
                      </div>
                    </div>
                  </div>

                </div>

              </div>
              <div class="is-vrt" style="overflow-y: auto; height: 660px;">
                <div class="pl-card">
                  <h2 class="pl-subtit">설문 문항별 응답
                    <div>
                      <!-- 필터 버튼 -->
                      <compo-tooltip-btn
                        TitleProp="상세 조건 필터"
                        ClassProp="pl-tooltip-btn ml-1"
                        IconProp="pl-icon20 filter"
                        TooltipPositionProp="bottom"
                        @btnClick="dropFilter = true"
                      ></compo-tooltip-btn>
                      <!-- drop 상세 조건  -->
                      <div class="pl-drop-layer is-filter" v-if="dropFilter" >
                        <div class="pl-drop-layer-header has-desc">조회 기간
                          <div class="pl-drop-layer-subdesc">
                            <p>선택한 기간 내의 응답만 보기</p>
                          </div>
                        </div>
                        <div class="pl-drop-layer-body">
<!--                          <div class="pl-calendar-range-form">-->
<!--                            <compo-date-picker-->
<!--                              DateType="dateInput"-->
<!--                              :DateProp.sync="startDate"/>-->
<!--                            <span class="pl-unit">~</span>-->
<!--                            <compo-date-picker-->
<!--                              DateType="dateInput"-->
<!--                              :DateProp.sync="endDate"/>-->
<!--                            <compo-drop-picker-->
<!--                              :StartDateProp.sync="startDate"-->
<!--                              :EndDateProp.sync="endDate"-->
<!--                            />-->
<!--                          </div>-->
                          <compo-date-range-picker
                              :StartDayProp.sync="startDate"
                              :EndDayProp.sync="endDate"
                              @startDayChange="mixin_testLog(startDate)"
                              @endDayChange="mixin_testLog(endDate)"
                          />
                        </div>
                        <div class="pl-drop-layer-header is-mt-m is-border has-desc">설문 유형
                          <div class="pl-drop-layer-subdesc">
                            <p>선택한 유형의 응답만 보기</p>
                          </div>
                        </div>
                        <div class="pl-drop-layer-body px-4">
                          <v-checkbox
                            v-model="chk01.selected"
                            v-for="(chk01, index) in chkTypes"
                            :key="index"
                            :label="chk01.text"
                            class="pl-check"
                            :class="index !== 0 ? 'mt-2' : ''"
                          ></v-checkbox>
                        </div>
                        <div class="pl-drop-layer-footer justify-end">
                          <div class="pl-btn-wrap">
                            <v-btn class="pl-btn is-sub" @click="dropFilter = false">닫기</v-btn>
                            <v-btn class="pl-btn" @click="getSummyItem(chkTypes)">적용</v-btn>
                          </div>
                        </div>
                      </div>
                    </div>
                  </h2>
                  <!-- 설문 문항별 응답 -->
                  <div class="pl-survey-response-list">
                    <div v-for="(data, index) in SURVEY_RESPONSE_CHART" :key="index">
                      <div class="pl-subdesc ">
                        <strong>{{ data.index }}. {{ data.subject }}</strong>
                      </div>
                      <div class="pl-cols is-mt-m" >
                        <template v-if="data.chartType">
                          <div style="position: relative; flex: 0 0 600px;">
                            <!-- chart -->
                            <chartjsDoughnutChart
                              v-if="data.chartType === 'PIE'"
                              :width=300
                              :height=220
                              :chartData="data.ChartData"
                              :chartOptions="DonughtOptions"
                              :styles="{ background: '#fff' }"
                            ></chartjsDoughnutChart>
                            <div style="display: flex; gap: 4px; position: absolute;top: 0px;right: 0px;width: 270px;bottom: 0;align-items: start;flex-direction: column;justify-content: center;"
                              v-if="!data.ChartData.datasets[0].noData"
                            >
                              <template v-for="item, index in data.ChartData.datasets[0].backgroundColor">
                                <span class="d-flex align-center" :key="index">
                                  <span
                                    :style="`display: inline-block; flex: 0 0 15px; width: 15px; height: 15px; margin-right: 4px; border-radius: 10px; background: ${item};`"
                                  >
                                  </span>
                                  {{ data.ChartData.labels[index] }}
                                </span>
                              </template>
                            </div>
                          </div>

                          <chartjsBarChart
                            v-if="data.chartType === 'BAR'"
                            :chartData="data.ChartData"
                            :chartOptions="BarOptions"
                            :styles="{ background: '#fff' }"
                          ></chartjsBarChart>
                          <!-- grid -->
                          <v-data-table
                            class="pl-grid ml-8"
                            :headers="headersC1"
                            :items="data.itemsC1"
                            height="220px"
                            fixed-header
                            item-key="index"
                            :items-per-page="data.ROW_PER_PAGEC1"
                            hide-default-footer
                            :page.sync="data.pageC1"
                            no-data-text="등록된 데이터가 없습니다."
                            @page-count="data.pageCountC1 = $event">
                            <template v-slot:item.index3="{ item }">
                              {{ item.index3 }} %
                            </template>
                          </v-data-table>
                        </template>
                        <template v-else>
                          <div class="pl-survey-response-list-child">
                            <template v-for="child, index in data.response">
                              <div
                                v-if="!mixin_isEmpty(child.text)"
                                :key="index"
                                class="pl-survey-response-list-child-response"
                                >
                                {{ child.text }}
                              </div>
                            </template>
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </v-tab-item>
          <!-- 설문결과 자세히 보기 -->
          <v-tab-item>
            <div class="pl-card">
              <div class="pl-grid-top">
                <div class="pl-grid-top-left">
                  <v-btn class="pl-btn is-icon is-sub" @click="showList">
                    <span class="pl-icon20 view-list"></span>
                    응답별 답변보기
                  </v-btn>
                </div>
                <div class="pl-grid-top-utils">
                  <span class="pl-counter">전체 <em class="pl-1">({{ gridDataText.length }})</em> 건</span>
                  <!-- 엑셀 다운로드 버튼 -->
                  <compo-excel
                    TypeProp="DownloadSrvyRslt"
                    :DataHeaderProp="gridDataHeaders"
                    :DataBodyProp="gridDataText"
                    :FileNameProp="'설문결과_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                    SheetNameProp="설문결과"
                    HeaderColorProp="00B0F0"
                  ></compo-excel>
                </div>
              </div>
              <v-data-table
                id="SrvyRsltTable"
                class="pl-grid is-hover"
                :headers="gridDataHeaders"
                :items="gridDataText"
                :item-class="isActiveRow"
                hide-default-header
                fixed-header
                item-key="index"
                height="562px"
                :items-per-page="ROW_PER_PAGE"
                @dblclick:row="gridDbClick"
                hide-default-footer
                :page.sync="page"
                @page-count="pageCount = $event"
                :loading="isLoadingGridData"
                loading-text="조회중입니다."
                no-data-text="등록된 데이터가 없습니다."
                @click:row="gridRowClick">
                <template v-slot:header>
                  <thead class="v-data-table-header multi-row">
                    <tr v-html="upHeader">
                    </tr>
                    <tr v-html="dwHeader">
                    </tr>
                  </thead>
                  <!-- <thead class="v-data-table-header multi-row">
                    <tr>
                      <th rowspan="2" width="80px" class="text-center"><span>NO</span></th>
                      <th rowspan="2" width="80px" class=""><span>응답 시간</span></th>
                      <th colspan="3" width="600px" class=""><span >거래 경험 만족도</span></th>
                      <th colspan="3" width="600px" class=""><span >이벤트 만족도</span></th>
                      <th colspan="3" width="600px" class=""><span >고객의 소리</span></th>
                    </tr>
                    <tr>
                      <th class=""><span class="font-weight-medium">1. 귀하가 당사와 거래한 기간은 얼마나 됩니까? </span></th>
                      <th class=""><span class="font-weight-medium">2. 당사를 처음 알게 된 경로는 무엇입니까? </span></th>
                      <th class=""><span class="font-weight-medium">3. 당사의 상품 및 서비스 품질에 대해 종합적으로 평가해 주십시오.</span></th>
                      <th class=""><span class="font-weight-medium">1. 귀하가 당사와 거래한 기간은 얼마나 됩니까? </span></th>
                      <th class=""><span class="font-weight-medium">2. 당사를 처음 알게 된 경로는 무엇입니까? </span></th>
                      <th class=""><span class="font-weight-medium">3. 당사의 상품 및 서비스 품질에 대해 종합적으로 평가해 주십시오.</span></th>
                      <th class=""><span class="font-weight-medium">1. 귀하가 당사와 거래한 기간은 얼마나 됩니까? </span></th>
                      <th class=""><span class="font-weight-medium">2. 당사를 처음 알게 된 경로는 무엇입니까? </span></th>
                      <th class=""><span class="font-weight-medium">3. 당사의 상품 및 서비스 품질에 대해 종합적으로 평가해 주십시오.</span></th>
                    </tr>
                  </thead> -->
                </template>
              </v-data-table>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </div>
      <!-- dialog -->
      <v-dialog v-model="dialogResponse" content-class="dialog-draggable is-scroll" hide-overlay>
        <div class="draggable-area ">drag area</div>
        <compo-dialog header-title="답변 보기" @hide="mixin_hideDialog('Response')">
          <template slot="body">
            <div>
              <span>설문참여 ID :
              <strong>{{ SRVY_YR + '-' + SRVY_NM + '-' + SURVEY_RESPONSE.srvyTrgtId }}</strong></span>
              <span v-if="SURVEY_RESPONSE.trgtDsgnYn == 'Y'" 
                class="ml-2">성명 :
              <strong>{{SURVEY_RESPONSE.custNm}}</strong></span>
              <span class="ml-2">응답시간 :
              <strong>{{ SURVEY_RESPONSE.srvyRspnsDt }}</strong></span>
            </div>
            <div class="pl-form-inline-wrap vertical type-2 is-mt-m">
              <div v-for="(item, index) in SURVEY_RESPONSE_LIST" class="pl-form-inline" :key="index">
                <span class="pl-label flex-grow-1" style="white-space: normal;">
                  <span class="align-self-start" style="flex: 0 0 20px">{{ item.index }}.</span>
                  <span style="word-break: keep-all;">{{ item.question }}</span>
                </span>
                <div class="pl-desc">
                  <div class="pl-text-wrap">
                    {{ item.answer }}
                  </div>
                </div>
              </div>
            </div>

          </template>
          <template slot="footer">
            <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('Response')">닫기</v-btn>
          </template>

        </compo-dialog>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import chartjsLineChart from "@/components/chartjsLineChart";
import chartjsBarChart from "@/components/chartjsBarChart";
import chartjsDoughnutChart from "@/components/chartjsDoughnutChart";
import chartjsPieChart from "@/components/chartjsPieChart";

export default {
  name: "MENU_SVY_M0300", //name은 'MENU_' + 파일명 조합

  components: {
    chartjsLineChart,
    chartjsBarChart,
    chartjsDoughnutChart,
    chartjsPieChart,
  },
  data() {
    return {
      tab: null,

      SRVY_YR: '',
      SRVY_SE_CD: '',
      STTS_CD: '',
      SRVY_NM: '',
      upHeader: '',
      dwHeader: '',

      // top search
      srvyYrItems: [],
      srvyNmItems: [],
      srvyYnCmbItems: [],

      // dialog
      dialogResponse: false,
      origiData: [],
      SURVEY_RESPONSE: {},
      SURVEY_RESPONSE_LIST: [],
      // SURVEY_RESPONSE: {
      //   survey_id: '2023020001',
      //   srvyRspnsDt: '2023-03-26 23:58:34'
      // },
      // SURVEY_RESPONSE_LIST: [
      //   { index: 1, question: '귀하가 당사와 거래한 기간은 얼마나 됩니까?', answer: '4~5년' },
      //   { index: 2, question: '제공 받으시는 서비스 중 개선이 필요하다고 생각 하시는 것 2가지를 선택해 주세요. ', answer: '고객응대 서비스 개선\n통화품질 개선' },
      //   { index: 3, question: '제공 받으시는 서비스 중 개선이 필요하다고 생각 하시는 것 2가지를 선택해 주세요. ', answer: '고객응대 서비스 개선\n통화품질 개선' },
      //   { index: 4, question: '제공 받으시는 서비스 중 개선이 필요하다고 생각 하시는 것 2가지를 선택해 주세요. ', answer: '고객응대 서비스 개선\n통화품질 개선' },
      //   { index: 5, question: '제공 받으시는 서비스 중 개선이 필요하다고 생각 하시는 것 2가지를 선택해 주세요. ', answer: '고객응대 서비스 개선\n통화품질 개선' },
      //   { index: 6, question: '제공 받으시는 서비스 중 개선이 필요하다고 생각 하시는 것 2가지를 선택해 주세요. ', answer: '고객응대 서비스 개선\n통화품질 개선' },
      //   { index: 7, question: '제공 받으시는 서비스 중 개선이 필요하다고 생각 하시는 것 2가지를 선택해 주세요. ', answer: '고객응대 서비스 개선\n통화품질 개선' },
      //   { index: 8, question: '제공 받으시는 서비스 중 개선이 필요하다고 생각 하시는 것 2가지를 선택해 주세요. ', answer: '고객응대 서비스 개선\n통화품질 개선' },
      //   { index: 9, question: '제공 받으시는 서비스 중 개선이 필요하다고 생각 하시는 것 2가지를 선택해 주세요. ', answer: '고객응대 서비스 개선\n통화품질 개선' },
      //   { index: 10, question: '제공 받으시는 서비스 중 개선이 필요하다고 생각 하시는 것 2가지를 선택해 주세요. ', answer: '고객응대 서비스 개선\n통화품질 개선' },
      //   { index: 11, question: '제공 받으시는 서비스 중 개선이 필요하다고 생각 하시는 것 2가지를 선택해 주세요. ', answer: '고객응대 서비스 개선\n통화품질 개선' },
      // ],

      // drop
      dropFilter: false,
      startDate: '',
      endDate: '',
      chkTypes: [],

      // 설문결과 요약보기
      SURVEY_SUMMARY: {
        survey_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().replace('T', ' ').slice(0, -5)
      },
      SURVEY_STATUS: [],
      SURVEY_INFO: [],
      SURVEY_MC: [],
      // 설문 문항별 응답
      SURVEY_RESPONSE_CHART: [],

      // chart, grid
      DonughtOptions: {
        responsive: false,
        maintainAspectRatio: false,
        aspectRatio: 0,
        borderWidth: 0,
        layout: {
          padding: {
            top: 40,
            left: 50,
            right: 0,
            bottom: 40,
          }
        },
        plugins: {
          legend: {
            display: false,
            position: 'right',
            maxWidth: 300,
            labels: {
              padding: 10,
              usePointStyle: true,
              pointStyle: 'Rounded',
            },
          }
        },
      },
      BarOptions: {
        responsive: true,
        maintainAspectRatio: false,
        borderRadius: 8,
        plugins: {
          legend: {
            display: false,
            }
        }

      },

      headersC1: [
        { text: '응답', value: 'index',  },
        { text: '응답 수', value: 'index2', align: 'center', width: '100px' },
        { text: '응답률', value: 'index3', align: 'center', width: '100px'},
      ],



      // 설문결과 자세히보기
      //grid
      page: 1,
      pageCount: 0,
      perPage: [15, 30, 50, 100],
      ROW_PER_PAGE: -1,
      headerTxt: [],
      gridDataHeaders: [
        { text: "NO", value: "index", align: "center", sortable: false },
        { text: "응답시간", value: "SRVY_RSPNS_DT", align: "center", sortable: false },
        { text: "전화번호", value: "CUST_PHN_NO", align: "center", sortable: false },
        { text: "이메일", value: "EML", align: "left", sortable: false },
      ],
      gridDataText: [],
      gridSelectedData: [],
      isLoadingGridData: false,

      // dev
      common_code: [],

      //설문 참여자 확장 항목
      srvyExpsnAttrList: [],

      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
        },
        ALERT : {
          ETC1_WARNING : {alertDialogToggle: true, msg: '설문조사명을 선택해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC2_WARNING : {alertDialogToggle: true, msg: '항목을 선택해 주세요.', iconClass: 'is-info', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        }
      },

    }
  },

  watch: {

  },

  computed: {

  },

  async created() {


    //공통코드설정
    let codeName = [
                     'SUVY_CL'      //설문계획 구분
                    ,'PROG_ST'      //진행 상태
                    ,'SUVY_QST_TP'  //설문 질문유형
                    ,'SELT_ALW_NB'  //선택 허용수
                    ,'ANSW_SZ'      //답변 사이즈
                  ];
    this.common_code = await this.mixin_common_code_get_all(codeName, 'Y');
    this.chkTypes = _.cloneDeep(this.mixin_common_code_get(this.common_code, 'SUVY_QST_TP', ''));
  },

  mounted() {
    //진행년도 설정(금년기준 -5, +5)
    const date = new Date();
    const curYear = date.getFullYear();
    this.srvyYrItems.push({ text: '전체', value: '' });   // default
    for (let i = -5; i < 5; i++) {
      this.srvyYrItems.push({ text: `${curYear + i}년`, value: (curYear + i).toString() });
    }
    this.SRVY_YR =  curYear.toString();

    //설문조사콤보박스 조회
    this.getSrvyNm();
  },

  methods: {
    tab1Init(){
      // this.SURVEY_RESPONSE_CHART = [];
      this.SURVEY_STATUS = [
        { title: '진행 방법', desc: '', class: 'is-txt-main' },
        { title: '목표 인원', desc: '', class: 'is-txt-main'  },
        { title: '응답 수', desc: '', class: 'is-txt-error' },
        { title: '달성율', desc: '' },
      ];
      this.SURVEY_INFO = [
        {
          title: '설문조사 명',
          desc: '',
        },
        {
          title: '설문 기간',
          desc: '',
        },
        {
          title: '진행 상태',
          desc: '',
        },
      ];
      this.SURVEY_MC = [
        {
          title: '설문 게시자',
          desc: '',
        },
        {
          title: '설문 문항 수',
          desc: '',
        },
      ];
      const nowDt = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
      this.startDate = nowDt;
      this.endDate = nowDt;
      this.chkTypes = _.cloneDeep(this.mixin_common_code_get(this.common_code, 'SUVY_QST_TP', ''));
      this.SURVEY_RESPONSE_CHART = [];
    },
    tab2Init(){
      this.gridDataHeaders = [
        { text: "NO", value: "index", align: "center", sortable: false },
        { text: "성명", value: "CUST_NM", align: "left", sortable: false },
        { text: "전화번호", value: "CUST_PHN_NO", align: "center", sortable: false },
        { text: "이메일", value: "EML", align: "left", sortable: false },
      ];
      if(this.srvyExpsnAttrList.length > 0) {
        this.srvyExpsnAttrList.map(expsn => {
          this.gridDataHeaders.push({ text: expsn.EXPSN_ATTR_NM, value: expsn.EXPSN_ATTR_COL_ID, align: 'left', sortable: false })
        })
      }
      this.gridDataHeaders.push({ text: "응답시간", value: "SRVY_RSPNS_DT", align: "center", sortable: false });

      this.gridDataText = [];
      this.headerTxt = [];
      this.upHeader = '';
      this.dwHeader = '';
      this.gridSelectedData = [];
      this.origiData = [];
    },
    //설문명 콤보박스 조회
    async getSrvyNm(){
      const sUrl = '/api/svy/makeitems/selectcombomakeitems';
      const postParam = {
        SRVY_YR : this.SRVY_YR             //진행년도
        ,STTS_CD : this.STTS_CD         //진행상태
        ,SRVY_SE_CD : this.SRVY_SE_CD        //계획구분
      }
      const headParam = {
        head: {
          'SERVICE' : 'svy.plan.selectcombomakeitems',
          'METHOD' : 'selectcombomakeitems',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );


      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {
        this.tab1Init();
        this.tab2Init();

        this.SRVY_NM = '';
        this.srvyNmItems = resData.DATA.map(item => ({ text: item.TEXT, value: item.VALUE }));
        if (this.srvyNmItems.length > 0) this.SRVY_NM = resData.DATA[0].VALUE;
      }
      if(!this.mixin_isEmpty(this.SRVY_NM)) this.btnSelectList();
    },

    //설문명 콤보박스 클릭 시, item 새로 조회. - 계획관리에서 신규 등록된 설문을 탭 재오픈을 안하고 목록에 출력하기 위함.
    //(기존은 탭을 닫고 다시 메뉴를 오픈해야 함.)
    async getSrvyNmRefresh(){
      const sUrl = '/api/svy/makeitems/selectcombomakeitems';
      const postParam = {
        SRVY_YR : this.SRVY_YR             //진행년도
        ,STTS_CD : this.STTS_CD         //진행상태
        ,SRVY_SE_CD : this.SRVY_SE_CD        //계획구분
      }
      const headParam = {
        head: {}
      }
      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (!resData.HEADER.ERROR_FLAG) {
        this.srvyNmItems = resData.DATA.map(item => ({ text: this.mixin_decode(item.TEXT), value: item.VALUE }));
      }
    },

    //조회버튼클릭
    async btnSelectList(){
      if(this.chkValid('0')) return;
      this.tab1SelectList();
      await this.getSrvyExpsnAttrList();
      this.tab2SelectList();
    },
    //설문결과 요약보기 탭
    tab1SelectList(){
      this.tab1Init();
      this.getSummyList();
    },
    //설문결과 자세히 탭
    tab2SelectList(){
      this.tab2Init();
      this.getDetailList();
    },
    //설문 요약, 조사정보, 진행자 조회
    async getSummyList(){
      const sUrl = '/api/svy/result/selectsummylist';
      const postParam = {
        SRVY_ID : this.SRVY_NM             //설문조사 id
      }
      const headParam = {
        head: {
          'SERVICE' : 'svy.result.selectsummylist',
          'METHOD' : 'selectsummylist',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );


      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {
        resData.DATA.forEach(e => {
          //설문요약
          this.SURVEY_STATUS = [
            { title: '진행 방법', desc: e.PRG_MTD, class: 'is-txt-main' },
            { title: '목표 인원', desc: e.TRGT_PER, class: 'is-txt-main' },
            { title: '응답 수', desc: e.ANSR_CNT, class: 'is-txt-error' },
            { title: '달성율', desc: e.ACH_RAT },
          ];
          //설문조사 정보
          this.SURVEY_INFO = [
            { title: '설문조사 명', desc: e.SRVY_NM},
            { title: '설문 기간', desc: `${e.SRVY_BGNG_DT} ~ ${e.SRVY_END_DT}`},
            { title: '진행 상태', desc: e.CD_NM, sty: 'green'},
          ]
          //설문 진행자
          this.SURVEY_MC = [
            { title: '설문 게시자', desc: e.USER_NM},
            { title: '설문 문항 수', desc: `총 ${e.TOT_CNT} 문항`},
          ]
          this.startDate = e.SRVY_BGNG_DT.substring(0, 10);
          this.endDate = e.SRVY_END_DT.substring(0, 10);
        });
        this.getSummyItem();
      }
    },
    //항목조회, 차트
    async getSummyItem(chkTypes){
      if(this.dropFilter) this.dropFilter = false;

      const sUrl = '/api/svy/result/selectsummyitem';
      const postParam = {
        sendData: {}
      }
      const oData = [];
      let i=0;
      let f = false;
      if(!this.mixin_isEmpty(chkTypes)){
        f = true;
        chkTypes.forEach(e => {
          if(e.selected){
            oData.push({TYPES : e.value});
            i++;
          }
        });
      }
      // sendData 세팅
      postParam.sendData['SRVY_ID'] = this.SRVY_NM;
      postParam.sendData['CNT'] = i;
      postParam.sendData['oData'] = oData;
      postParam.sendData['S_DATE'] = this.startDate;
      postParam.sendData['E_DATE'] = this.endDate;
      postParam.sendData['F_DATE'] = f;

      const headParam = {
        head: {
          'SERVICE' : 'svy.result.selectsummyitem',
          'METHOD' : 'selectsummyitem',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      let resData = await this.common_postCall(sUrl, postParam.sendData, headParam );


      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {
        this.SURVEY_RESPONSE_CHART = [];
        if(resData.DATA.length > 0){
          /**
           * id별 총합
           */
          const itemSum = [];
          let preIdx = 0;
          let cnt = 0;
          resData.DATA.forEach((e,i) => {
            if(preIdx === 0){
              cnt = cnt + Number(e.CNT);
            }else{
              if(preIdx !== e.SRVY_QITEM_ID){
                itemSum.push({
                  SRVY_QITEM_ID: preIdx,
                  TOT_CNT: cnt
                })
                cnt = Number(e.CNT);
              }else{
                cnt = cnt + Number(e.CNT);
              }
            }
            preIdx = e.SRVY_QITEM_ID;
            if(resData.DATA.length === i+1){
              itemSum.push({
                SRVY_QITEM_ID: preIdx,
                TOT_CNT: cnt
              })
            }
          });
          /**
           * 바인딩
           */
          let idx = 1;    // 번호
          let i = -1;     //배열
          let j = 0;      //컬러
          let preId = 0;  //이전id
          const bgColor = [
            '#8591E1', '#FAA7A8', '#FFB72C', '#7FC379', '#4BC8F5','#9050FF','#EC6C80','#FF9900','#26B036','#2271C5',
            '#575F8F', '#946262', '#917131', '#22741A', '#135972','#2F1064','#79222F','#754F16','#0D5C16','#0D3F75',
          ];
          resData.DATA.forEach(e => {
            if(e.QITEM_TYPE_CUST === 'ETC'){
              if(preId !== e.SRVY_QITEM_ID){
                this.SURVEY_RESPONSE_CHART.push({
                  index: idx,
                  chartType: '',
                  subject: e.SRVY_QITEM_CN,
                  response: [],
                })
                i++;
                idx++;
              }
              this.SURVEY_RESPONSE_CHART[i].response.push({
                text: this.mixin_decode(e.QITEM_CHC_CN)
              })
            }else{
              if(preId !== e.SRVY_QITEM_ID){
                this.SURVEY_RESPONSE_CHART.push({
                  index: idx,
                  chartType: 'PIE',
                  subject: e.SRVY_QITEM_CN,
                  ChartData: {
                    labels: [],
                    datasets: [
                      {
                        backgroundColor: [],
                        data: []
                      }
                    ],
                  },
                  pageC1: 1,
                  pageCountC1: 0,
                  perPageC1: [15,30,50,100],
                  ROW_PER_PAGEC1: 15,
                  itemsC1: []
                })
                i++;
                idx++;
                j = 0;
              }

              let chcCn = this.mixin_decode(e.QITEM_CHC_CN);
              if(chcCn == 'MSG_ETC') {
                chcCn = '기타';
              }

              this.SURVEY_RESPONSE_CHART[i].ChartData.labels.push(chcCn);
              this.SURVEY_RESPONSE_CHART[i].ChartData.datasets[0].backgroundColor.push(bgColor[j]);
              this.SURVEY_RESPONSE_CHART[i].ChartData.datasets[0].data.push(e.CNT);
              let o = itemSum.filter((item, index) => {
                return item.SRVY_QITEM_ID === e.SRVY_QITEM_ID;
              });

              
              this.SURVEY_RESPONSE_CHART[i].itemsC1.push({
                index: chcCn,
                index2: e.CNT,
                index3: (o[0].TOT_CNT === 0 ? o[0].TOT_CNT : Math.round((Number(e.CNT)/o[0].TOT_CNT)*100))
              })
              j++;
            }
            preId = e.SRVY_QITEM_ID;
          });
        }
      }
    },
    getHeaders(hdTxt){
      // NO와 응답시간을 포함한 첫 번째 테이블 헤더 생성
      this.upHeader = "<th scope='row' rowspan='2' class='text-center' style='width: 50px'>NO</th>";
      this.upHeader += "<th scope='row' rowspan='2' class='text-left' style='width: 80px'>성명</th>";
      this.upHeader += "<th scope='row' rowspan='2' class='text-center' style='width: 110px'>전화번호</th>";
      this.upHeader += "<th scope='row' rowspan='2' class='text-left' style='width: 170px'>이메일</th>";
      
      if(this.srvyExpsnAttrList.length > 0) {
        this.srvyExpsnAttrList.map(expsn => {
          this.upHeader += "<th scope='row' rowspan='2' class='text-left' style='width: 100px'>" + expsn.EXPSN_ATTR_NM + "</th>";
        })
      }
      this.upHeader += "<th scope='row' rowspan='2' class='text-center' style='width: 150px'>응답시간</th>";

      // 테이블 헤더의 각 열에 대한 정보를 담은 배열을 순회하며 테이블 헤더 생성
      let colSpanIdx = 0; // 현재 열의 colspan 값
      let widthIdx = 200; // 현재 열의 너비 값
      let beforKey = ""; // 이전 열의 a_column 값
      let setHeader = ""; // 테이블 헤더의 첫 번째 행
      let dwHeader = ""; // 테이블 헤더의 두 번째 행

      for (let i = 0; i < hdTxt.length; i++) {
        // 테이블 헤더의 두 번째 행에 열 번호와 c_column 값을 포함한 열 추가
        dwHeader += `<th scope='row' class='text-center' style='line-height: 1.4'>${i + 1}. ${hdTxt[i].c_column}</th>`;
        // 현재 열의 a_column 값이 이전 열의 a_column 값과 다를 경우
        if (beforKey && beforKey != hdTxt[i].a_column) {
          // 이전 열의 b_column 값을 포함한 열 추가
          setHeader += `<th scope='row' colspan='${colSpanIdx}' class='text-center' style='width: ${widthIdx * colSpanIdx}px'>${hdTxt[i - 1].b_column}</th>`;
          colSpanIdx = 1; // colspan 값 초기화
        } else {
          colSpanIdx++; // colspan 값 증가
        }
        beforKey = hdTxt[i].a_column; // 이전 열의 a_column 값 갱신

        // 마지막 열일 경우
        if (i + 1 == hdTxt.length) {
          // 현재 열의 b_column 값을 포함한 열 추가
          setHeader += `<th scope='row' colspan='${colSpanIdx}' class='text-center' style='width: ${widthIdx * colSpanIdx}px'>${hdTxt[i].b_column}</th>`;
        }
      }

      // 첫 번째 행과 두 번째 행을 합쳐서 테이블 헤더 생성
      this.upHeader += setHeader;
      this.dwHeader += dwHeader;
    },
    //설문 요약, 조사정보, 진행자 조회
    async getDetailList(){
      this.isLoadingGridData = true;
      const sUrl = '/api/svy/result/selectdetaillist';
      const postParam = {
        SRVY_ID : this.SRVY_NM,             //설문조사 id
      }
      const headParam = {
        head: {
          'SERVICE' : 'svy.result.selectdetaillist',
          'METHOD' : 'selectdetaillist',
          'TYPE' : 'BIZ_SERVICE',
        },
        timeout: 3600000
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );


      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {
        if(resData.DATA.length > 0){
          this.origiData = _.cloneDeep(resData.DATA); //원본데이터 복사
          let i = 1;      //헤더 번호
          let preId = 0;  //이전id
          let rownum = 0;
          resData.DATA.forEach((e, j) => { // resData.DATA 배열을 순회하며 e와 j를 인자로 받는 함수 실행
            console.log("iiiiiiiiiiiiiiiiiii=====================", i, e, j)
            if (preId === 0) { // preId가 0일 경우
              this.gridDataHeaders.push({ text: `${i}. `+e.SRVY_QITEM_CN, value: `subject_${i}`, sortable: false }); // gridDataHeaders 배열에 객체 추가
              this.headerTxt.push({ a_column: e.SRVY_QITEM_GROUP_ID, b_column: e.SRVY_QITEM_GROUP_NM, c_column: e.SRVY_QITEM_CN }); // headerTxt 배열에 객체 추가
            } else { // preId가 0이 아닐 경우
              if (preId !== e.SRVY_QITEM_ID) { // preId와 e.SRVY_QITEM_ID가 다를 경우
                i++; // i값 증가
                this.gridDataHeaders.push({ text: `${i}. `+e.SRVY_QITEM_CN, value: `subject_${i}`, sortable: false }); // gridDataHeaders 배열에 객체 추가
                this.headerTxt.push({ a_column: e.SRVY_QITEM_GROUP_ID, b_column: e.SRVY_QITEM_GROUP_NM, c_column: e.SRVY_QITEM_CN }); // headerTxt 배열에 객체 추가
              }
            }
            preId = e.SRVY_QITEM_ID // preId에 e.SRVY_QITEM_ID 할당

            let o = this.gridDataText.filter(item => item.SRVY_TRGT_ID === e.SRVY_TRGT_ID); // gridDataText 배열에서 SRVY_TRGT_ID가 e.SRVY_TRGT_ID와 같은 객체를 찾아 o에 할당
            console.log("oooooooo==========================", o)
            let oJson = {};
            let multiText = '';
            if (o.length > 0) { // o의 길이가 0보다 클 경우
              console.log("00000000000=====================", this.gridDataText, o)
              multiText = this.gridDataText[o[0].idx][`subject_${i}`]; // multiText에 gridDataText 배열에서 SRVY_TRGT_ID가 e.SRVY_TRGT_ID와 같은 객체의 subject_i 속성값 할당
              if (e.QITEM_TYPE_CD === 'MULT') this.gridDataText[o[0].idx][`subject_${i}`] = (this.mixin_isEmpty(multiText) ? '' : multiText + ',') + this.mixin_decode(e.QITEM_CHC_CN); // e.QITEM_TYPE_CD가 'MULT'일 경우 gridDataText 배열에서 SRVY_TRGT_ID가 e.SRVY_TRGT_ID와 같은 객체의 subject_i 속성값에 e.QITEM_CHC_CN과 ','를 추가
              else this.gridDataText[o[0].idx][`subject_${i}`] = this.mixin_decode(e.QITEM_CHC_CN); // e.QITEM_TYPE_CD가 'MULT'가 아닐 경우 gridDataText 배열에서 SRVY_TRGT_ID가 e.SRVY_TRGT_ID와 같은 객체의 subject_i 속성값에 e.QITEM_CHC_CN 할당
            } else { // o의 길이가 0일 경우
              oJson['idx'] = rownum;
              oJson['index'] = rownum + 1;
              oJson['CUST_NM'] = e.CUST_NM;
              oJson['CUST_PHN_NO'] = e.CUST_PHN_NO;
              oJson['EML'] = e.EML;
              if(this.srvyExpsnAttrList.length > 0) {
                this.srvyExpsnAttrList.map(expsn => {
                  oJson[expsn.EXPSN_ATTR_COL_ID] = e[expsn.EXPSN_ATTR_COL_ID]
                })
              }

              oJson['SRVY_RSPNS_DT'] = e.SRVY_RSPNS_DT;
              oJson['SRVY_TRGT_ID'] = e.SRVY_TRGT_ID;
              
              oJson['SRVY_QITEM_CN'] = this.mixin_decode(e.SRVY_QITEM_CN);
              multiText = oJson[`subject_${i}`]; // multiText에 oJson 객체의 subject_i 속성값 할당
              if (e.QITEM_TYPE_CD === 'MULT') oJson[`subject_${i}`] = (this.mixin_isEmpty(multiText) ? '' : multiText) + this.mixin_decode(e.QITEM_CHC_CN) + ','; // e.QITEM_TYPE_CD가 'MULT'일 경우 oJson 객체의 subject_i 속성값에 e.QITEM_CHC_CN과 ','를 추가
              else oJson[`subject_${i}`] = this.mixin_decode(e.QITEM_CHC_CN); // e.QITEM_TYPE_CD가 'MULT'가 아닐 경우 oJson 객체의 subject_i 속성값에 e.QITEM_CHC_CN 할당
              this.gridDataText.push(oJson); // gridDataText 배열에 oJson 객체 추가
              console.log("j 증가============", j, oJson)
              j++; // j값 증가
              rownum++;
            }

          });
        }
      }
      this.getHeaders(this.headerTxt);
      this.isLoadingGridData = false;
    },
    chkValid(e){
      let eFlag = true;
      switch(e){
        case '0' : //조회관련
          if(this.mixin_isEmpty(this.SRVY_NM)) this.showAlert(this.MESSAGE.ALERT.ETC1_WARNING);
          else eFlag = false;
        break;
        case '1' : //선택된건지 확인
          if(this.mixin_isEmpty(this.gridSelectedData)) this.showAlert(this.MESSAGE.ALERT.ETC2_WARNING);
          else eFlag = false;
        break;
      }
      return eFlag;
    },
    //row클릭
    gridRowClick(item){
      this.gridSelectedData = item;
    },
    //row클릭 색상변경
    isActiveRow(item){
      return item.index == this.gridSelectedData.index ? 'active' : '';
    },
    gridDbClick(item, row){
      this.gridSelectedData = row.item;
      this.showList();
    },
    async showList(){
      if(this.chkValid('0')) return;
      if(this.chkValid('1')) return;
      this.SURVEY_RESPONSE = {};
      this.SURVEY_RESPONSE_LIST = [];

      let o = this.origiData.filter((item, index) => {
        return item.SRVY_TRGT_ID === this.gridSelectedData.SRVY_TRGT_ID;
      });

      if(o.length > 0){
        let i = 1;      //헤더 번호
        let j = 0;
        let preId = 0;
        o.forEach(e => {
          this.SURVEY_RESPONSE = { srvyRspnsDt: e.SRVY_RSPNS_DT, srvyTrgtId: e.SRVY_TRGT_ID, custNm: e.CUST_NM, trgtDsgnYn: e.TRGT_DSGN_YN };

          if(preId === e.SRVY_QITEM_ID){
            this.SURVEY_RESPONSE_LIST[j-1].answer = this.SURVEY_RESPONSE_LIST[j-1].answer + ',' + this.mixin_decode(e.QITEM_CHC_CN);
          }else{
            this.SURVEY_RESPONSE_LIST.push({
              index: i,
              question: e.SRVY_QITEM_CN,
              answer: this.mixin_decode(e.QITEM_CHC_CN)
            })
            if(e.QITEM_TYPE_CD === 'MULT'){
              j = i;
            }
            i++;
          }
          preId = e.SRVY_QITEM_ID;
        })
      }
      this.mixin_showDialog('Response');
    },

    async getSrvyExpsnAttrList() {
      const sUrl = '/api/svy/makeitems/selectSrvyExpsnAttrList';
      const postParam = {
        SRVY_ID : this.SRVY_NM             //설문조사 id
      }
      const headParam = {
        head: {}
      }
      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (!resData.HEADER.ERROR_FLAG) {
        this.srvyExpsnAttrList = resData.DATA;
      } else {
        this.srvyExpsnAttrList = [];
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
