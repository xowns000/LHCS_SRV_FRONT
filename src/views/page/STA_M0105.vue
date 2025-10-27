<template>
  <div class="pl-container type-stat">
    <div class="pl-card-wrap">
       <!-- sub top -->
       <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <div class="pl-desc">
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
                      />
                    <span class="pl-unit">~</span>
                    <compo-date-picker
                        v-model="SCH_END_DT"
                      DateType="dateInput"
                      :DateProp.sync="SCH_END_DT"/>
<!--                    <compo-drop-picker
                      :StartDateProp.sync="startDate"
                      :EndDateProp.sync="endDate"
                    />-->
                  </div>

                </template>
              </div>
            </div>
            <v-btn
                class="pl-btn is-icon"
                @click="phoneClbkStatistics"
            >
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols flex-grow-1">
        <!-- left -->
        <div class="is-col-fix is-vrt" style="width: 580px">
          <div class="pl-card">
            <!-- 상단 정보 -->
            <h2 class="pl-subtit is-inform">{{ SCH_TERM_TXT }}</h2>
            <div class="d-flex justify-center flex-column is-mt-m">
              <ul class="pl-list-info4" >
                <li style="height: 93px">
                  <v-icon color="#54C1FF">mdi-phone-missed</v-icon>
                  <span class="pl-list-info-title">콜백 건수</span>
                  <strong class="pl-list-info-desc" >
                    {{ mixin_convertNumToComma(MONITOR.callback) }}
                  </strong>
                </li>
                <li style="height: 93px">
                  <v-icon color="#FFA51F">mdi-phone-incoming</v-icon>
                  <span class="pl-list-info-title">배분 건수</span>
                  <strong class="pl-list-info-desc" >
                    {{ mixin_convertNumToComma(MONITOR.divide) }}
                  </strong>
                </li>
                <li style="height: 93px">
                  <v-icon color="#FF2D10">mdi-phone-off</v-icon>
                  <span class="pl-list-info-title">미배분건수</span>
                  <strong class="pl-list-info-desc" >
                    {{ mixin_convertNumToComma(MONITOR.undivide) }}
                  </strong>
                </li>
              </ul>
            </div>
            <!-- 콜백 배분현황 -->
            <div class="pl-stat-bar-chart is-noborder is-mt-l">
              <h2 class="pl-subtit d-flex">콜백 배분 현황</h2>
              <chartjsBarChart
                class="is-mt-m h200 px-4"
                :chartData="BarData"
                :chartOptions="BarOptions"
                :styles="{ background: '#fff' }"
              ></chartjsBarChart>
            </div>
            <v-divider class="pb-4 mt-4"></v-divider>
            <!-- 콜백 처리현황 -->
            <div class="pl-stat-bar-chart is-noborder ">
              <h2 class="pl-subtit d-flex">콜백 처리 현황</h2>
              <div class="pl-cols">
                <div>
                  <chartjsDoughnutChart
                    class="is-mt-m h200"
                    :chartData="DonughtData"
                    :chartOptions="DonughtOptions"
                    :styles="{ background: '#fff' }"
                  ></chartjsDoughnutChart>
                </div>
                <div class="d-flex justify-center flex-column ml-2">
                  <ul class="pl-list-info4" >
                    <li>
                      <v-icon color="#FFA51F">mdi-phone-incoming</v-icon>
                      <span class="pl-list-info-title">배분 건수</span>
                      <strong class="pl-list-info-desc" >
                        {{ mixin_convertNumToComma(MONITOR_CALLBACK.div) }}
                      </strong>
                    </li>
                    <li>
                      <v-icon color="#8591E1">mdi-account-edit</v-icon>
                      <span class="pl-list-info-title">처리 건수</span>
                      <strong class="pl-list-info-desc" >
                        {{ mixin_convertNumToComma(MONITOR_CALLBACK.exec) }}
                      </strong>
                    </li>
                    <li>
                      <v-icon color="#FFB72C">mdi-percent</v-icon>
                      <span class="pl-list-info-title">처리율</span>
                      <strong class="pl-list-info-desc" >
                        {{ mixin_convertNumToComma(MONITOR_CALLBACK.chk) }}
                        <sub style="bottom: 0; padding-right: 1px;">%</sub>
                      </strong>
                    </li>
                  </ul>
                  <ul class="is-mt-m">
                    <li class="d-flex align-center" style="height: 25px">
                      <span>콜백 총 상담시간</span>
                      <strong class="ml-auto">
                        <span style="font-size: 15px">{{ mixin_convertNumToComma(MONITOR_CALLBACK.total_callback_time) }}</span>
                      </strong>
                    </li>
                    <li class="d-flex align-center mt-1" style="height: 25px">
                      <span>콜백 일평균 상담시간</span>
                      <strong class="ml-auto">
                        <span style="font-size: 15px">{{ mixin_convertNumToComma(MONITOR_CALLBACK.per_day_callback_time) }}</span>
                      </strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- right -->
        <div class="is-vrt">
          <div class="pl-card">
            <div class="pl-cols">
              <!-- 콜백 상위 TOP 5 -->
              <div class="pl-stat-bar-chart is-noborder ">
                <h2 class="pl-subtit is-inform d-flex">콜백 상위 TOP 5</h2>
                <chartjsBarChart
                  class="is-mt-m h200 px-4"
                  :chartData="BarData2"
                  :chartOptions="BarOptions2"
                  :styles="{ background: '#fff' }"
                ></chartjsBarChart>
              </div>
              <!-- 요일별 현황 -->
              <div class="pl-stat-bar-chart is-noborder ml-10">
                <h2 class="pl-subtit is-inform d-flex">요일별 현황</h2>
                <chartjsLineChart
                  class="is-mt-m h200 px-4"
                  :chartData="LineData"
                  :chartOptions="LineOptions"
                  :styles="{ background: '#fff' }"
                ></chartjsLineChart>
              </div>
            </div>
            <!-- 큐별 전체 현황 grid -->
            <div class="pl-grid-top is-mt-m">
              <div class="pl-grid-top-left">
                <h2 class="pl-subtit">큐별 전체 현황</h2>
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter">전체 <em class="pl-1">({{ gridDataText.length }})</em> 건</span>
                <!-- 엑셀 다운로드 버튼 -->
                <compo-excel
                  TypeProp="Download"
                  :DataHeaderProp="gridDataHeaders"
                  :DataBodyProp="gridDataText"
                  :FileNameProp="SCH_TERM_TXT+' 콜백 큐별_통계_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                  :SheetNameProp="SCH_TERM_TXT+'_콜백 큐별 통계'"
                  HeaderColorProp="00B0F0"
                ></compo-excel>
              </div>
            </div>
            <v-data-table
              class="pl-grid is-rowspan"
              :headers="gridDataHeaders"
              :items="gridDataText"
              fixed-header
              item-key="index"
              height="315px"
              :items-per-page="-1"
              hide-default-footer
              no-data-text="등록된 데이터가 없습니다."
            >
              <template slot="footer">
                <div class="pl-grid-sum">
                  <table >
                    <colgroup>
                      <col v-for="(col, index) in gridDataHeaders" :key="index" :width=col.width />
                    </colgroup>
                    <tbody >
                      <tr >
                        <td class="pl-grid-sum-head text-center">합계</td>
                        <td class="text-center">
                          {{ mixin_convertNumToComma(mixin_sum_field(this.gridDataText, "AMT_CLBK")) }}
                        </td>
                        <td class="text-center">
                          {{ mixin_convertNumToComma(mixin_sum_field(this.gridDataText, "COMPLETED_CNT")) }}
                        </td>
                        <td class="text-center">
                          {{ mixin_convertNumToComma(mixin_sum_field(this.gridDataText, "NO_COMPLETED_CNT")) }}
                        </td>
                        <td class="text-center">
                          {{ mixin_convertNumToComma(mixin_sum_field(this.gridDataText, "DAY_COMPLETED")) }}
                        </td>
                        <td class="text-center">
                          {{ mixin_sum_field(this.gridDataText, "TOT_CLBK")>0?((mixin_sum_field(this.gridDataText, "COMPLETED_CNT")/mixin_sum_field(this.gridDataText, "AMT_CLBK"))*100).toFixed(2):0 }} %
                        </td>
                        <td class="text-center">
                          {{ mixin_convertNumToComma(convertSecToTxt(mixin_sum_field(this.gridDataText, "DRWI_SE_HR"))) }}
                        </td>
                        <td class="text-center">
                          {{ mixin_convertNumToComma(convertSecToTxt(mixin_sum_field(this.gridDataText, "DAY_CUSL"))) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
            </v-data-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chartjsDoughnutChart from "@/components/chartjsDoughnutChart";
import chartjsLineChart from "@/components/chartjsLineChart";
import chartjsBarChart from "@/components/chartjsBarChart";

  export default {
  name: "MENU_STA_M0105", //name은 'MENU_' + 파일명 조합
  components: {
    chartjsLineChart,
    chartjsBarChart,
    chartjsDoughnutChart
  },
  data() {
    return {
      // top search
      datePeriod: 0,

      currentDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      startDate: '',
      endDate: '',

      SCH_ST_DT: '',
      SCH_END_DT: '',

      SCH_YEAR : '',          // 년도 검색
      SCH_MONTH : '',         // 월 검색
      SCH_QUARTER : '',       // 분기 검색
      YEAR_LIST : [],
      MONTH_LIST : [],
      QUARTER_LIST : [],

      SCH_TERM_TXT: '',

      MESSAGE:{
        ALERT:{
          INVALID_DATE : {
            alertDialogToggle: true,
            msg: '종료일은 시작일보다 빠를 수 없습니다.',
            iconClass: 'is-caution',
            type: 'default'
          }
        },
      },


      // 기간별 모니터
      MONITOR: {
        callback: 480,
        divide: 480,
        undivide: 480,
      },

      // 콜백 배분 현황 bar chart
      BarData: {
        labels: [
          '콜백 건수',
          '배분 건수',
          '미배분 건수',
        ],
        datasets: [
          {
            // label: "인입호",
            backgroundColor: '#4786e3',
            data: [30, 11 ,23],
            noData: false
          },
        ],
      },
      BarOptions: {
        responsive: true,
        maintainAspectRatio: false,
        barThickness: 80,
        borderRadius: 8,
        // indexAxis: 'y',
        plugins: {
          legend: {
            display: false,
          }
        },
      },

      // 콜백 처리 현황 doughnut chart
      DonughtData: {
        labels: ["처리", "미처리",],
        datasets: [
          {
            backgroundColor: ['#8591E1', '#FAA7A8', '#FFB72C', '#7FC379', '#4BC8F5'],
            data: [40, 20],
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

      // 콜백 처리 현황 모니터
      MONITOR_CALLBACK: {
        total_callback_time : 350,
        total_callback_min : 67,
        per_day_callback_time : 350,
        per_day_callback_min : 67,
        div : 480,
        exec : 480,
        chk : 85.2,
      },

      // 콜백 상위 top 5 bar chart
      BarData2: {
        labels: [
          '콜백 건수',
          '배분 건수',
          '미배분 건수',
        ],
        datasets: [
          {
            // label: "인입호",
            backgroundColor: '#4786e3',
            data: [30, 11,23],
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

      // 요일별 현황 line chart
      LineData: {
        labels: [
          '월요일',
          '화요일',
          '수요일',
          '목요일',
          '금요일',
          '토요일',
          '일요일',
        ],
        datasets: [
          {
            data: [50,100,70,999,30,10,185],
            noData: false,
            tension: 0.5,
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

      // 큐별 전체 현황 grid
      gridDataHeaders: [
        { text: '큐', value: 'DRWI_SE_NM', align: 'left', sortable: false},
        { text: "배분건수", align: "center", value: "AMT_CLBK",  width: '100px'  ,sortable: false},
        { text: "처리건수", align: "center", value: "COMPLETED_CNT",  width: '100px'  ,sortable: false},
        { text: "미처리 건수", align: "center", value: "NO_COMPLETED_CNT",  width: '130px'  ,sortable: false},
        { text: "일평균 처리 건수", align: "center", value: "DAY_COMPLETED",  width: '150px'  ,sortable: false},
        { text: "처리율", align: "center", value: "COMPLETED_RATE",  width: '100px'  ,sortable: false},
        { text: "총 상담시간", align: "center", value: "DRWI_SE_HR",  width: '130px'  ,sortable: false},
        { text: "일평균 상담시간", align: "center", value: "DAY_CUSL",  width: '150px'  ,sortable: false},
      ],
      gridDataText: [
        {
          name: "배송문의",
          type01: 159,
          type02: 100,
          type03: 24,
          type04: 110,
          type05: 100.0,
          type06: '24:00:00',
          type07: '24:00:00',
        },
        { name: null, type01: null, type02: null, type03: null, type04: null, type05: null, type06: null, type07: null, },
        { name: null, type01: null, type02: null, type03: null, type04: null, type05: null, type06: null, type07: null, },
        { name: null, type01: null, type02: null, type03: null, type04: null, type05: null, type06: null, type07: null, },
        { name: null, type01: null, type02: null, type03: null, type04: null, type05: null, type06: null, type07: null, },
        { name: null, type01: null, type02: null, type03: null, type04: null, type05: null, type06: null, type07: null, },
        { name: null, type01: null, type02: null, type03: null, type04: null, type05: null, type06: null, type07: null, },
        { name: null, type01: null, type02: null, type03: null, type04: null, type05: null, type06: null, type07: null, },
        { name: null, type01: null, type02: null, type03: null, type04: null, type05: null, type06: null, type07: null, },
        { name: null, type01: null, type02: null, type03: null, type04: null, type05: null, type06: null, type07: null, },
        { name: null, type01: null, type02: null, type03: null, type04: null, type05: null, type06: null, type07: null, },
        { name: null, type01: null, type02: null, type03: null, type04: null, type05: null, type06: null, type07: null, },
      ],

      QUARTER_CHECK : [
        {QUARTER : 1, MONTH: 1},
        {QUARTER : 1, MONTH: 2},
        {QUARTER : 1, MONTH: 3},
        {QUARTER : 2, MONTH: 4},
        {QUARTER : 2, MONTH: 5},
        {QUARTER : 2, MONTH: 6},
        {QUARTER : 3, MONTH: 7},
        {QUARTER : 3, MONTH: 8},
        {QUARTER : 3, MONTH: 9},
        {QUARTER : 4, MONTH: 10},
        {QUARTER : 4, MONTH: 11},
        {QUARTER : 4, MONTH: 12},
      ],
    }
  },
  mounted() {
    },

   beforeDestroy(){
     this.$eventBus.$off("selCompanyAction"); //eventBus 중복방지를 위해 off
   },

    async created() {

    // 상단 고객사 선택시 eventBus 실행 (각 페이지별 필요에 의한 내용 구현 )
    this.$eventBus.$on("selCompanyAction", (SELECTED_COMPANY) => {
      // console.log(`${this.$options.name} : =====>`, SELECTED_COMPANY.CD_NM);
    });



    this.setDate()

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

    let CURRENT_QUARTER;
    this.QUARTER_CHECK.forEach((quarter, idx) => {
      if(quarter.MONTH === parseInt(CURRENT_MONTH)) CURRENT_QUARTER = quarter.QUARTER;
    });

    this.SCH_QUARTER = CURRENT_QUARTER.toString();

    this.phoneClbkStatistics();
  },
  computed: {
  },
  watch: {
  },
  methods: {
    setDate(){

      this.startDate = this.$moment(this.currentDate).subtract(7,'days').format('YYYY-MM-DD'); // 조회 시작 일자(한달전)
      this.endDate =this.currentDate;

      this.SCH_ST_DT = this.startDate;
      this.SCH_END_DT = this.endDate;

    },


    /* 기간별 콜백 조회 */

    async phoneClbkStatistics(){


      this.YEAR = this.SCH_YEAR;
      let MONTH = this.SCH_MONTH;


      let QUARTER = this.datePeriod;
      if(QUARTER === 0 ){
        this.SCH_TERM_TXT='';
        this.SCH_TERM_TXT = this.SCH_ST_DT + ' ~ ' + this.SCH_END_DT;
      }else if(QUARTER === 1){ //월별
        this.SCH_TERM_TXT='';
        this.SCH_TERM_TXT = this.SCH_YEAR + '년 ' + this.SCH_MONTH + '월';
      }else if(QUARTER === 2){ //분기별
        this.SCH_TERM_TXT='';
        this.SCH_TERM_TXT = this.SCH_YEAR + '년 ' + this.SCH_QUARTER + '분기';
      }

      let start = Number(this.SCH_ST_DT.replace(/-/gi, ''));
      let end = Number(this.SCH_END_DT.replace(/-/gi, ''));

      if(QUARTER == 0 && (start > end)){
        this.showAlert(this.MESSAGE.ALERT.INVALID_DATE);
      }else{
      // 차트바인딩 데이터 초기화
      let DonughtData = this.DonughtData;
      DonughtData.datasets[0].data = [];

      let BarData = this.BarData;
      // BarData.labels = [];
      BarData.datasets[0].data = [];

      this.MONITOR.callback = '';
      this.MONITOR.divide = '';
      this.MONITOR.undivide = '';

      this.MONITOR_CALLBACK.total_callback_time = '';
      this.MONITOR_CALLBACK.total_callback_min = '';
      this.MONITOR_CALLBACK.per_day_callback_time = '';
      this.MONITOR_CALLBACK.per_day_callback_min = '';
      this.MONITOR_CALLBACK.div = '';
      this.MONITOR_CALLBACK.exec = '';
      this.MONITOR_CALLBACK.chk = '';

      let LineData = this.LineData;
      LineData.datasets[0].data = [];


        let sUrl = '/api/statistics/phone/phoneClbkStatistics';
        let postParam = {
           SCH_GB : this.datePeriod === 0? 'DAY':this.datePeriod === 1? 'MONTH': 'QUARTER'
          , SCH_YEAR : this.SCH_YEAR
          , SCH_MONTH : this.SCH_MONTH
          , SCH_ST_DT : this.SCH_ST_DT.replace(/-/gi, '')
          , SCH_END_DT : this.SCH_END_DT.replace(/-/gi, '')
          , SCH_QUARTER : this.SCH_QUARTER
        }

        let headParam = {
          head : {
          }
        }

        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if(!response.HEADER.ERROR_FLAG){
          let TERM_DATA = response.TERM_DATA[0];
          let DAY_DATA = response.DAY_DATA;
          let QUEUE_DATA = response.QUEUE_DATA;

          this.MONITOR.callback = TERM_DATA.TOT_CLBK;
          this.MONITOR.divide = TERM_DATA.AMT_CLBK;
          this.MONITOR.undivide = TERM_DATA.NO_AMT_CLBK;

         BarData.datasets[0].data.push(this.MONITOR.callback);
         BarData.datasets[0].data.push(this.MONITOR.divide);
         BarData.datasets[0].data.push(this.MONITOR.undivide);

         let iCnt = 0;
         BarData.datasets[0].data.forEach(data => {
          if(data > 0) iCnt++;
         });

         if(iCnt > 0) BarData.datasets[0].noData = false;
         else BarData.datasets[0].noData = true;

          this.MONITOR_CALLBACK.total_callback_time =  this.convertSecToTxt(TERM_DATA.TOT_PHN_HR); //총 상담시간;
          this.MONITOR_CALLBACK.per_day_callback_time = this.convertSecToTxt(TERM_DATA.DAY_PHN_HR); //총 상담시간;;
          this.MONITOR_CALLBACK.div = TERM_DATA.AMT_CLBK;
          this.MONITOR_CALLBACK.exec = TERM_DATA.COMPLETED_CNT;
          this.MONITOR_CALLBACK.chk = TERM_DATA.COMPLETED_RATE;

          if(this.datePeriod === 0){
            this.gridDataHeaders[4].text = '일평균\n처리 건수';
            this.gridDataHeaders[7].text = '일평균\n시간';
          }else if(this.datePeriod === 1){
            this.gridDataHeaders[4].text = '월평균\n상담 건수';
            this.gridDataHeaders[7].text = '월평균\n상담시간';
          }else if(this.datePeriod === 2){
            this.gridDataHeaders[4].text = '분기평균\n상담 건수';
            this.gridDataHeaders[7].text = '분기평균\n상담시간';
          }


          DonughtData.datasets[0].data.push(this.MONITOR_CALLBACK.exec);
          DonughtData.datasets[0].data.push(Number(this.MONITOR_CALLBACK.div)-Number(this.MONITOR_CALLBACK.exec));

          iCnt = 0;
          DonughtData.datasets[0].data.forEach(data => {
            if(data > 0) iCnt++;
          });

          if(iCnt > 0) DonughtData.datasets[0].noData = false;
          else DonughtData.datasets[0].noData = true;

          // for(let i =0 ; i < 6; i++){
          //   if(DAY_DATA[i].YOIL === i){
          //     LineData.datasets[0].data.push(DAY_DATA[i].DAYLY_CNT);
          //   }else{
          //     LineData.datasets[0].data.push(0);
          //   }
          // }
          // let o = 1;

          iCnt = 0;
          DAY_DATA.forEach((item, index) => {
            LineData.datasets[0].data.push(item.CLBK_CNT);

            if(item.CLBK_CNT > 0) iCnt++;
          });

          if(iCnt > 0) LineData.datasets[0].noData = false;
          else LineData.datasets[0].noData = true;


          this.gridDataText = [];

          if(QUEUE_DATA.length > 0){
            QUEUE_DATA.forEach((data, idx) => {
              data.AMT_CLBK = this.mixin_convertNumToComma(data.AMT_CLBK);
              data.COMPLETED_CNT = this.mixin_convertNumToComma(data.COMPLETED_CNT);
              data.NO_COMPLETED_CNT = this.mixin_convertNumToComma(data.NO_COMPLETED_CNT);
              data.DAY_COMPLETED = this.mixin_convertNumToComma(data.DAY_COMPLETED);
              data.DRWI_SE_HR = this.mixin_convertNumToComma(data.DRWI_SE_HR);
              data.DAY_CUSL = this.mixin_convertNumToComma(data.DAY_CUSL);
            });
          }

          this.gridDataText = QUEUE_DATA;

          let BarData2 = this.BarData2;

          BarData2.labels = [];
          BarData2.datasets[0].data = [];


          // 큐별로 전체 콜백 수를 내림차순, 5개 정렬
          let tempArray = QUEUE_DATA.slice().sort((a, b)=>b.TOT_CLBK - a.TOT_CLBK);
          // console.log("tempArray" + JSON.stringify(tempArray))
          let sortedArray = tempArray.slice(0, 5);

          // console.log("sortedArray",sortedArray)

          iCnt = 0;
          sortedArray.forEach((data, idx) => {
            BarData2.labels.push(data.DRWI_SE_NM);
            BarData2.datasets[0].data.push(data.TOT_CLBK);

            if(data.TOT_CLBK > 0) iCnt++;
          });

          if(iCnt > 0) BarData2.datasets[0].noData = false;
          else BarData2.datasets[0].noData = true;
        }
      }
    },

    convertSecToTxt(sec) {
      let sTime = this.mixin_seconds_toHHMMSS(sec);
      let sTimeWord = '';
      sTime.split(':').forEach((time, idx) => {
        if(idx === 0 && Number(time) > 0) sTimeWord += Number(time) + '시간 ';
        else if(idx === 1) sTimeWord += Number(time) + '분 ';
        else if(idx === 2) sTimeWord += Number(time) + '초';
      });

      return sTimeWord;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>