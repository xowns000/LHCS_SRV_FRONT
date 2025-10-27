<template>
  <div class="pl-container type-stat">
    <div class="pl-card-wrap">
       <!-- sub top -->
       <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                채널분류
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(common_code, 'CHNL_CL','전체')"
                  v-model="SRCH_CHN_CLSF_CD"
                ></v-select>
                <v-btn-toggle
                  v-model="datePeriod"
                  mandatory
                  class="pl-btn-group ml-2">
                  <v-btn class="pl-btn">일</v-btn>
                  <v-btn class="pl-btn">월</v-btn>
                  <v-btn class="pl-btn">분기</v-btn>
                </v-btn-toggle>
                <template v-if="datePeriod === 1">
                  <v-select
                    v-model="SCH_YEAR"
                    class="pl-form ml-2"
                    :items="YEAR_LIST"
                    placeholder="선택하세요"
                  ></v-select>
                  <v-select
                    v-model="SCH_MONTH"
                    class="pl-form"
                    :items="MONTH_LIST"
                    placeholder="선택하세요"
                  ></v-select>
                </template>
                <template v-if="datePeriod === 2">
                  <v-select
                    v-model="SCH_YEAR"
                    class="pl-form ml-2"
                    :items="YEAR_LIST"
                    placeholder="선택하세요"
                  ></v-select>
                  <v-select
                    v-model="SCH_QUARTER"
                    class="pl-form"
                    :items="QUARTER_LIST"
                    placeholder="선택하세요"
                  ></v-select>
                </template>
                <template v-if="datePeriod === 0">
                  <div class="pl-calendar-range-form ml-2">
                    <compo-date-picker
                      v-model="SCH_ST_DT"
                      DateType="dateInput"
                      :DateProp.sync="SCH_ST_DT"
                      @dateChange="mixin_testLog(SCH_ST_DT)"
                    />
                    <span class="pl-unit">~</span>
                    <compo-date-picker
                      v-model="SCH_END_DT"
                      DateType="dateInput"
                      :DateProp.sync="SCH_END_DT"
                      :MinProp="dateMin()"
                    />
                    <!-- <compo-drop-picker
                      :StartDateProp.sync="startDate"
                      :EndDateProp.sync="endDate"
                    /> -->
                  </div>
                </template>
              </div>
            </div>
            <v-btn class="pl-btn is-icon" @click="[getStatStng(),chatCuttTotalStatistics()]">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card">
        <!-- 현황 -->
        <h2 class="pl-subtit is-inform">
          {{ YEAR }}년 {{ MONTH }}월 SNS상담 현황<span class="is-txt-main">(전체)</span>
        </h2>
        <div class="d-flex">
          <!-- 상담건수 리스트 -->
          <ul class="pl-list-info4 is-mt-m" style="padding-right: 42px;">
            <li class="pl-list-icon"><v-icon class="pl-icon70 count"></v-icon></li>
            <v-tooltip 
              v-for="item in MONITOR.count"
              :key="item.id"
              content-class="pl-tooltip "
              bottom>
              <template v-slot:activator="{ on, attrs }">
                <li
                  v-bind="attrs" 
                  v-on="on">
                  <span class="pl-list-info-title mt-1">{{ item.text }}</span>
                  <strong class="pl-list-info-desc" :class="item.class">
                    {{ mixin_convertNumToComma(item.count) }}
                    <sub v-if="item.unit" style="bottom: 0">{{ item.unit }}</sub>
                  </strong>
                </li>
              </template>
              <div
                v-text="mixin_replaceDoubleBackslashNewLine(item.detail)"></div>
            </v-tooltip>
          </ul>
          <!-- 상담시간 리스트 -->
          <ul class="pl-list-info4 is-mt-m" style="flex: 1 0 644px;">
            <li class="pl-list-icon"><v-icon class="pl-icon70 time"></v-icon></li>
            <li
              v-for="item in MONITOR.time"
              :key="item.id">
              <span class="pl-list-info-title mt-1">{{ item.text }}</span>
              <strong class="pl-list-info-desc" :class="item.class">
                <!-- {{ item.count }} -->
                <template v-for="count, index in item.count" >
                  <span :key="count.id" class="ml-2" stlye="display: contents">{{ mixin_convertNumToComma(count) }}<sub style="bottom: 0">{{ displayTimeUnit(index) }}</sub></span>
                </template>
              </strong>
            </li>
          </ul>
        </div>
        <div class="pl-cols is-mt-m">
          <!-- SNS 유형별 현황 -->
          <div class="pl-stat-bar-chart has-btn col-3">
            <h2 class="pl-subtit d-flex">SNS 채널별 현황
              <div class="ml-auto">
                <compo-tooltip-btn
                  TitleProp="문의 유형별 통계 바로가기"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 plus"
                  TooltipPositionProp="bottom"
                  @btnClick="mixin_set_active_tab({PATH_NM:'/STA_M0302', NODE_TITLE:'문의유형별 통계', FULL_PATH: '통계 > SNS 상담 통계 > 문의유형별 통계', MENU_EXPLN: '문의유형별 SNS 상담 집계현황을 확인할 수 있습니다'});"
                ></compo-tooltip-btn>
              </div>
            </h2>
            <chartjsDoughnutChart
              class="is-mt-m h200"
              :chartData="DonughtData"
              :chartOptions="DonughtOptions"
              :height="200"
              :styles="{ background: '#fff' }"
            ></chartjsDoughnutChart>
            <!-- 차트 로더 컴포넌트 -->
          </div>
          <!-- 평균 상담시간 현황 -->
          <div class="pl-stat-bar-chart has-btn ml-10">
            <h2 class="pl-subtit d-flex">평균 상담시간 현황
              <div class="ml-auto">
                <compo-tooltip-btn
                  TitleProp="상담직원별 통계 바로가기"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 plus"
                  TooltipPositionProp="bottom"
                  @btnClick="mixin_set_active_tab({PATH_NM:'/STA_M0301', NODE_TITLE:'상담직원별 통계', FULL_PATH: '통계 > SNS 상담 통계 > 상담직원별 통계', MENU_EXPLN: '상담직원별 SNS 상담 집계 현황을 확인할 수 있습니다'});"
                ></compo-tooltip-btn>
              </div>
            </h2>
            <chartjsBarChart
              class="is-mt-m h200 px-4"
              :chartData="BarData"
              :chartOptions="BarOptions"
              :styles="{ background: '#fff' }"
            ></chartjsBarChart>
          </div>
          <!-- 상담 유형별 현황 -->
          <div class="pl-stat-bar-chart has-btn ml-10 col-3">
            <h2 class="pl-subtit d-flex">상담 유형별 현황
              <div class="ml-auto">
                <compo-tooltip-btn
                  TitleProp="상담 유형별 통계 바로가기"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 plus"
                  TooltipPositionProp="bottom"
                  @btnClick="mixin_set_active_tab({PATH_NM:'/STA_M0303', NODE_TITLE:'채팅상담 유형별 통계', FULL_PATH: '통계 > SNS 상담 통계 > 채팅상담 유형별 통계', MENU_EXPLN: '상담유형별 SNS 상담 집계현황을 확인할 수 있습니다'});"
                ></compo-tooltip-btn>
              </div>
            </h2>
            <chartjsBarChart
              class="is-mt-m h200 px-4"
              :chartData="BarData2"
              :chartOptions="BarOptions2"
              :styles="{ background: '#fff' }"
            ></chartjsBarChart>
          </div>
        </div>
        <!-- 월간 상담 추이 -->
        <div class="pl-cols">
          <div class="pl-stat-bar-chart has-btn">
            <h2 class="pl-subtit d-flex">월간 상담 추이
              <div class="ml-auto">
                <compo-tooltip-btn
                  TitleProp="일자별 통계 바로가기"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 plus"
                  TooltipPositionProp="bottom"
                  @btnClick="mixin_set_active_tab({PATH_NM:'/STA_M0304', NODE_TITLE:'채팅싱담 일자별 통계', FULL_PATH: '통계 > SNS 상담 통계 > 채팅싱담 일자별 통계', MENU_EXPLN: '일자별 SNS 상담 집계현황을 확인할 수 있습니다'});"
                ></compo-tooltip-btn>
              </div>
            </h2>
            <chartjsLineChart
              class="is-mt-m h160 px-4"
              :chartData="LineData"
              :chartOptions="LineOptions"
              :styles="{ background: '#fff' }"
            ></chartjsLineChart>
          </div>
          <!-- 통합생산성 현황 -->
          <div class="pl-stat-bar-chart has-btn ml-10 col-3">
            <h2 class="pl-subtit d-flex">통합생산성 현황
              <div class="ml-auto">
                <compo-tooltip-btn
                  TitleProp="통합생산성 통계 바로가기"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 plus"
                  TooltipPositionProp="bottom"
                  @btnClick="mixin_set_active_tab({PATH_NM:'/STA_M0305', NODE_TITLE:'통합생산성 통계', FULL_PATH: '통계 > SNS 상담 통계 > 통합생산성 통계', MENU_EXPLN: 'SNS 상담 통합생산성 집계현황을 확인할 수 있습니다'});"
                ></compo-tooltip-btn>
              </div>
            </h2>
            <chartjsBarChart
              class="is-mt-m h160 px-4"
              :chartData="BarData3"
              :chartOptions="BarOptions3"
              :styles="{ background: '#fff' }"
            ></chartjsBarChart>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chartjsDoughnutChart from "@/components/chartjsDoughnutChart";
import chartjsBarChart from "@/components/chartjsBarChart";
import chartjsLineChart from "@/components/chartjsLineChart";

  export default {
  name: "MENU_STA_M0306", //name은 'MENU_' + 파일명 조합
  components: {
    chartjsLineChart,
    chartjsBarChart,
    chartjsDoughnutChart
  },
  data() {
    return {
      //공통코드
      common_code:[],
      SCH_YEAR: '',
      SCH_MONTH: '',
      SRCH_CHN_CLSF_CD:'',
      SCH_QUARTER: '', //분기 검색
      datePeriod: 1, //일/월/분기 구분
      datePeriod_st: 1, //일/월/분기 구분

      // top search
      YEAR: '', //년도
      MONTH: '', //월

      YEAR_LIST: [],
      MONTH_LIST: [],
      QUARTER_LIST: [],

      SCH_ST_DT: this.$moment(this.startDate).subtract(7,'days').format('YYYY-MM-DD'),
      SCH_END_DT: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      YEAR: '', //년도
      MONTH: '', //월
      QUARTER: '', //분기
      ST_DT: '', //시작일
      END_DT: '', //종료일

      // 현황
      MONITOR: {
        count: [
          { text: '총 상담 건수', icon: '', class: 'is-txt-main', count: 0, detail:''},
          { text: '처리 건수', icon: '', count: 0, detail:''},
          { text: '미처리 건수', icon: '', count: 0, detail:''},
          { text: '처리울', icon: '', count: 0, unit: '%', detail:''},
          { text: '1인당 상담건수', icon: '', count: 0, detail:''},
        ],
        time: [
          { text: '총 상담시간', icon: '', count: 0, class: 'is-txt-main', },
          { text: '1인당 상담시간', icon: '', count: 0, },
        ]
      },

      // SNS 유형별 현황 chart
      DonughtData: {
        labels: [],
        datasets: [
          {
            backgroundColor: ['#8591E1', '#ffeb3b', '#733A8D', '#4BC8F5', '#03c75a'],
            data: [],
            noData: false
          }
        ]
      },
      DonughtOptions: {
        responsive: true,
        maintainAspectRatio: false,
        borderWidth: 0,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              padding: 20,
              boxWidth: 10,
              usePointStyle: true,
              pointStyle: 'Rounded',
            },
          }
        },
      },
      DonughtDataLoaded: false,

      // 평균 상담시간 현황 chart
      BarData: {
        labels: [],
        datasets: [
          {
            backgroundColor: '#4786e3',
            data: [],
            noData: false
          },
        ],
      },
      BarOptions: {
        responsive: true,
        maintainAspectRatio: false,
        borderRadius: 8,
        plugins: {
          legend: {
            display: false,
          }

        },
        // 클릭 이벤트 샘플
        onClick: function(point, event) {
          if(event.length <= 0) return;

          // console.log(event[0].element.$context.raw);
        },
      },

      // 통합 생산성 현황 chart
      BarData3: {
        labels: [
          '상담요청',
          '총상담처리',
          '상담',
          '전달',
        ],
        datasets: [
          {
            backgroundColor: '#4786e3',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            noData: false
          },
        ],
      },
      BarOptions3: {
        responsive: true,
        maintainAspectRatio: false,
        borderRadius: 8,
        plugins: {
          legend: {
            display: false,
          }

        },
        // 클릭 이벤트 샘플
        onClick: function(point, event) {
          if(event.length <= 0) return;

          // console.log(event[0].element.$context.raw);
        },
      },

      // 상담유형별 현황
      BarData2: {
        labels: [],
        datasets: [
          {
            backgroundColor: '#8591E1',
            data: [],
            noData: false
          },
        ],
      },
      BarOptions2: {
        responsive: true,
        maintainAspectRatio: false,
        barThickness: 16,
        borderRadius: 8,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false,
          }

        },
      },

      // 월간 상담 추이 chart
      LineData: {
        labels: [],
        datasets: [
          {
            data: [],
            noData: false,
            tension: 0.4,
            cubicInterpolationMode: "monotone",
            pointStyle: "circle",
            pointRadius: 4,
            pointHoverRadius: 8,
            borderColor: "rgba(0, 112, 192, 1)",
            backgroundColor: "rgba(0, 112, 192, 0.5)",
          },
        ],
      },
      LineOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          }
        },
      },

      CUSL_ALTMNT_NPSBL:'N',
      ALTMNT_GIVEUP:'N',
      WAIT_GIVEUP:'N',
      DMND_NOCHC:'N',
      DMND_NPSBL:'N',

    }
  },

  watch: {
  },

  computed: {
  },

  async created() {

    //공통코드설정
    let codeName = ['CHNL_CL'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    let CURRENT_DATE = await this.mixin_getSvrDate("YYYY-MM-DD");
    let CURRENT_YEAR = parseInt(CURRENT_DATE.split('-')[0]);
    let CURRENT_MONTH = parseInt(CURRENT_DATE.split('-')[1])<10?'0'+parseInt(CURRENT_DATE.split('-')[1]):CURRENT_DATE.split('-')[1];

    for (let i = -5; i < 5; i++) {
      let strYear = (CURRENT_YEAR + i).toString();
      this.YEAR_LIST.push({text: `${strYear}년`, value: strYear });
      if (i === 0 || i === 1) {
        this.YEAR_LIST.push({ text: `${strYear}년`, value: strYear });
      }
    }

    for (let i = 1; i <= 12; i++) {
      let strMonth = i.toString();
      let strMonthVal = i<10?'0'+i.toString():strMonth;
      this.MONTH_LIST.push({text: `${strMonth}월`, value: strMonthVal });
    }

    for (let i = 1; i <= 4; i++) {
      let strQuarter = i.toString();
      this.QUARTER_LIST.push({text: `${strQuarter}분기`, value: strQuarter });
    }

    this.SCH_YEAR = CURRENT_YEAR.toString();
    this.SCH_MONTH = CURRENT_MONTH;

    this.getStatStng();             //채팅통계 상담건수 설정 조회

    this.chatCuttTotalStatistics(); //통계 조회
  },

  mounted() {
  },

  methods: {
    //통계 조회
    async chatCuttTotalStatistics() {
      this.YEAR = this.SCH_YEAR;
      this.MONTH = this.SCH_MONTH;
      this.QUARTER = this.datePeriod;
      this.ST_DT = this.SCH_ST_DT;
      this.END_DT = this.SCH_END_DT;

      if(this.QUARTER === 0){ //일자별
        this.SCH_TERM_TXT = this.ST_DT + ' ~ ' + this.END_DT;
      }else if(this.QUARTER === 1){ //월별
        this.SCH_TERM_TXT = this.YEAR + '년 ' + this.MONTH + '월';
      }else if(this.QUARTER === 2){ //분기별
        this.SCH_TERM_TXT = this.YEAR + '년 ' + this.SCH_QUARTER + '분기';
      }

      // 콜 유형별 차트 로딩 초기화
      this.DonughtDataLoaded = false;

      //전화상담 현황(전체) 초기화
      this.MONITOR.count.forEach((stat, idx) => {
        stat.count = 0;
      });

      this.MONITOR.time.forEach((stat, idx) => {
        stat.count = 0;
      });

      //콜 유형별 현황 초기화
      let DonughtData = this.DonughtData;
      DonughtData.labels = [];
      DonughtData.datasets[0].data = [];

      //통화 시간별 추이 초기화
      let BarData = this.BarData;
      BarData.labels = [];
      BarData.datasets[0].data = [];

      //문의 유형별 현황 초기화
      let BarData2 = this.BarData2;
      BarData2.labels = [];
      BarData2.datasets[0].data = [];

      //문의 유형별 현황 초기화
      let BarData3 = this.BarData3;
      BarData3.labels = [];
      BarData3.datasets[0].data = [];

      //월간 상담 추이 초기화
      let LineData = this.LineData;
      LineData.labels = [];
      LineData.datasets[0].data = [];

      let stQuarter = ''
      let endQuarter = ''
      switch (this.SCH_QUARTER){
        case '1':
          stQuarter = this.SCH_YEAR + '01';
          endQuarter = this.SCH_YEAR + '03';
          break;
        case '2':
          stQuarter = this.SCH_YEAR + '04';
          endQuarter = this.SCH_YEAR + '06';
          break;
        case '3':
          stQuarter = this.SCH_YEAR + '07';
          endQuarter = this.SCH_YEAR + '09';
          break;
        case '4':
          stQuarter = this.SCH_YEAR + '10';
          endQuarter = this.SCH_YEAR + '12';
          break;
        default:
          stQuarter = this.SCH_YEAR + '01';
          endQuarter = this.SCH_YEAR + '12';
          break;
      }

      let statStngCnt = 1;

      let sUrl = '/api/statistics/chat/chatCuttTotalStatistics';
      let postParam = {
        CHN_CLSF_CD : this.SRCH_CHN_CLSF_CD
        , SCH_GB : this.datePeriod === 0? 'DAY':this.datePeriod === 1? 'MONTH': 'QUARTER'
        , SCH_YEAR : this.SCH_YEAR
        , SCH_MONTH : this.SCH_YEAR + this.SCH_MONTH
        , SCH_ST_DT : this.SCH_ST_DT.replace(/-/gi, '')
        , SCH_END_DT : this.SCH_END_DT.replace(/-/gi, '')
        , SCH_ST_QUARTER : stQuarter
        , SCH_END_QUARTER : endQuarter
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        //전화상담 현황(전체)
        if(response.DATA.length > 0){
          let data = response.DATA[0];
          this.MONITOR.count.forEach((stat, idx) => {
            if(idx === 0) {
              stat.detail = "인입된 상담이 정상적으로 상담원에게 배정된 총 건 수<br>예외된 건수";
              if(this.DMND_NPSBL == 'N'){
                stat.detail = stat.detail + "<br>" + statStngCnt + ". 상담 요청불가 (채팅상담 업무시간 이외 인입된 상담) : " + data.DMND_NPSBL_CNT + " 건";
                statStngCnt++;
              } else {
                data.TOT_CNT = parseInt(data.TOT_CNT) + parseInt(data.DMND_NPSBL_CNT);
              }
              if(this.CUSL_ALTMNT_NPSBL == 'N'){
                stat.detail = stat.detail + "<br>" + statStngCnt + ". 상담사 배정불가 (인입된 상담이 배정받을 수 없는 상태) : " + data.CUSL_ALTMNT_NPSBL_CNT + " 건"
                statStngCnt++;
              } else {
                data.TOT_CNT = parseInt(data.TOT_CNT) + parseInt(data.CUSL_ALTMNT_NPSBL_CNT);
              }
              if(this.ALTMNT_GIVEUP == 'N'){
                stat.detail = stat.detail + "<br>" + statStngCnt + ". 배정대기중 포기 (고객이 상담을 요청하고 상담사가 배정되기 전 종료) : " + data.ALTMNT_GIVEUP_CNT + " 건"
                statStngCnt++;
              } else {
                data.TOT_CNT = parseInt(data.TOT_CNT) + parseInt(data.ALTMNT_GIVEUP_CNT);
              }
              if(this.WAIT_GIVEUP == 'N'){
                stat.detail = stat.detail + "<br>" + statStngCnt + ". 고객대기중 포기 (고객이 상담을 요청하고 상담사가 배정되었지만 상담을 시작하기 전 종료) : " + data.WAIT_GIVEUP_CNT + " 건"
                statStngCnt++;
              } else {
                data.TOT_CNT = parseInt(data.TOT_CNT) + parseInt(data.WAIT_GIVEUP_CNT);
              }
              if(this.DMND_GIVEUP == 'N'){
                stat.detail = stat.detail + "<br>" + statStngCnt + ". 상담요청중 포기 (고객이 상담을 요청하였지만 문의유형을 선택하지 않아 종료) : " + data.DMND_GIVEUP_CNT + " 건"
                statStngCnt++;
              } else {
                data.TOT_CNT = parseInt(data.TOT_CNT) + parseInt(data.DMND_GIVEUP_CNT);
              }
              if(this.DMND_NOCHC == 'N'){
                stat.detail = stat.detail + "<br>" + statStngCnt + ". 챗봇상담중 포기 (고객이 챗봇상담중 상담원 연결 전 종료) : " + data.DMND_NOCHC_CNT + " 건"
                statStngCnt++;
              } else {
                data.TOT_CNT = parseInt(data.TOT_CNT) + parseInt(data.DMND_NOCHC_CNT);
              }
              stat.count = data.TOT_CNT;
            } //총 상담 건수
            else if(idx === 1) {
              stat.count = data.CMPL_CNT;
              stat.detail = "상담원에게 배정된 상담 중 상담을 종료하여 저장까지 완료한 건 수"
            } //처리 건수
            else if(idx === 2) {
              stat.count = parseInt(data.TOT_CNT) - parseInt(data.CMPL_CNT);
              stat.detail = "상담원에게 배정된 상담 중 저장되지 않은 상담"
                + "<br>포함된 건수"
                + "<br>1. 대기중 채팅 (고객이 상담을 요청하고 상담사가 배정되었지만 상담을 시작하기 전) : " + data.WAIT_CNT + " 건"
                + "<br>2. 상담중 채팅 (상담 진행중) : " + data.ING_CNT + " 건"
                + "<br>3. 후처리 상담 (상담 종료 후 저장하지 않은 상담) : " + data.AFTPRCS_CNT + " 건"
            } //미처리 건수
            else if(idx === 3) {
              stat.count = data.TOT_CNT == 0 ? 0 : Math.round((data.CMPL_CNT / data.TOT_CNT) * 10000)/100;
              stat.detail = "상담원에게 배정된 상담 중 상담을 저장한 상담의 비율"
                + "<br>처리건수 / 총 상담건수 X 100"
            } //처리율
            else if(idx === 4) {
              stat.count = data.CUSL_AVG_CNT == 0 ? 0 : Math.round(data.CUSL_AVG_CNT * 100) /100;
            } //1인당 상담건수
          });

          this.MONITOR.time.forEach((stat, idx) => {
            if(idx === 0){//총 상담시간
              let sTotTime = this.mixin_seconds_toHHMMSS(data.CUTT_HR);
              let sTotTimeWord = [];

              sTotTime.split(':').forEach((time, idx) => {
                if(idx === 0 && Number(time) > 0) sTotTimeWord.push(Number(time));
                else if(idx === 1) sTotTimeWord.push(Number(time));
                else if(idx === 2) sTotTimeWord.push(Number(time));
                // if(idx === 0 && Number(time) > 0) sTotTimeWord += Number(time) + '시간 ';
                // else if(idx === 1) sTotTimeWord += Number(time) + '분 ';
                // else if(idx === 2) sTotTimeWord += Number(time) + '초';
              });

              stat.count = sTotTimeWord;
            }else if(idx === 1) {//1인당 상담시간
              let sAvgTime = this.mixin_seconds_toHHMMSS(data.CUSL_AVG_HR);
              let sAvgTimeWord = [];
              sAvgTime.split(':').forEach((time, idx) => {
                if(idx === 0 && Number(time) > 0) sAvgTimeWord.push(Number(time));
                else if(idx === 1) sAvgTimeWord.push(Number(time));
                else if(idx === 2) sAvgTimeWord.push(Number(time));
                // if(idx === 0 && Number(time) > 0) sAvgTimeWord += Number(time) + '시간 ';
                // else if(idx === 1) sAvgTimeWord += Number(time) + '분 ';
                // else if(idx === 2) sAvgTimeWord += Number(time) + '초';
              });
              stat.count = sAvgTimeWord;
            }
          });
        }

        //채널별 현황
        if(response.CHN_DATA.length > 0){
          let iCnt = 0;
          response.CHN_DATA.forEach((val) => {
            DonughtData.labels.push(val.CHN_CLSF_NM);
            DonughtData.datasets[0].data.push(val.CHN_CNT);
            this.DonughtDataLoaded = true;
            if(val.CHN_CNT > 0) iCnt++;
          });

          if(iCnt > 0) DonughtData.datasets[0].noData = false;
          else DonughtData.datasets[0].noData = true;
        }else{
          DonughtData.datasets[0].noData = true;
        }

        //채팅 시간별 추이
        if(response.CHT_HR_DATA.length > 0){
          let iCnt = 0;
          response.CHT_HR_DATA.forEach((time, idx) => {
            BarData.labels.push(time.CD_NM);
            BarData.datasets[0].data.push(time.CNT);
            if(time.CNT > 0) iCnt++;
          });

          if(iCnt > 0) BarData.datasets[0].noData = false;
          else BarData.datasets[0].noData = true;
        }else{
          BarData.datasets[0].noData = true;
        }

        //상담 유형별 현황
        if(response.TYPE_DATA.length > 0){
          let iCnt = 0;
          response.TYPE_DATA.forEach((type, idx) => {
            BarData2.labels.push(type.CUTT_TYPE_NM);
            BarData2.datasets[0].data.push(type.CUTT_TYPE_CNT);
            if(type.CUTT_TYPE_CNT > 0) iCnt++;
          });

          if(iCnt > 0) BarData2.datasets[0].noData = false;
          else BarData2.datasets[0].noData = true;
        }else{
          BarData2.datasets[0].noData = true;
        }

        //월간 상담 추이
        if(response.MON_DATA.length > 0){
          let iCnt = 0;
          response.MON_DATA.forEach((day, idx) => {
            LineData.labels.push(this.mixin_convertDate(day.CUTT_DT, 'MM-dd'));
            LineData.datasets[0].data.push(day.TOT_CNT);
            if(day.TOT_CNT > 0) iCnt++;
          });

          if(iCnt > 0) LineData.datasets[0].noData = false;
          else LineData.datasets[0].noData = true;
        }else{
          LineData.datasets[0].noData = true;
        }

        //통합 생산성 현황
        if(response.PRDCTN_DATA.length > 0){
          let iCnt = 0;
          response.PRDCTN_DATA.forEach((prdctn, idx) => {
            BarData3.labels.push(prdctn.PRDCTN_TP);
            BarData3.datasets[0].data.push(prdctn.CNT);
            if(prdctn.CNT > 0) iCnt++;
          });

          if(iCnt > 0) BarData3.datasets[0].noData = false;
          else BarData3.datasets[0].noData = true;
        }else{
          BarData3.datasets[0].noData = true;
        }
      }
    },
    //상담시간 모니터링 시간 표시
    displayTimeUnit(index) {
      let sTotUnitWord = ['시간','분','초'];

      return sTotUnitWord[index];
    },

    dateMin() {
      // if(!this.StartDayProp) return '';
      // else{
      // }
      const minDate = new Date(
          new Date(this.SCH_ST_DT).setDate(new Date(this.SCH_ST_DT).getDate()) -
          new Date().getTimezoneOffset() * 60000
      )
          .toISOString().substr(0, 10);
      return minDate;
    },

    async getStatStng(){
      let sUrl = '/api/statistics/chat/getStatStng';
      let postParam = {
      }
      let headParam = {
        head : {
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);
      if (!resData.HEADER.ERROR_FLAG){
        for(let i=0;i<resData.DATA.length;i++){
          if(resData.DATA[i].STNG_CD == 'DMND_NPSBL'){
            this.DMND_NPSBL = resData.DATA[i].STNG_VL;
          } else if(resData.DATA[i].STNG_CD == 'CUSL_ALTMNT_NPSBL'){
            this.CUSL_ALTMNT_NPSBL = resData.DATA[i].STNG_VL;
          } else if(resData.DATA[i].STNG_CD == 'ALTMNT_GIVEUP'){
            this.ALTMNT_GIVEUP = resData.DATA[i].STNG_VL;
          } else if(resData.DATA[i].STNG_CD == 'WAIT_GIVEUP'){
            this.WAIT_GIVEUP = resData.DATA[i].STNG_VL;
          } else if(resData.DATA[i].STNG_CD == 'DMND_NOCHC'){
            this.DMND_NOCHC = resData.DATA[i].STNG_VL;
          } else if(resData.DATA[i].STNG_CD == 'DMND_GIVEUP'){
            this.DMND_GIVEUP = resData.DATA[i].STNG_VL;
          }
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>