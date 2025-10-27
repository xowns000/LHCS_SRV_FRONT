<template>
  <div class="pl-container type-stat">
    <div class="pl-card-wrap">
       <!-- sub top -->
       <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <div class="pl-desc">
                <v-select
                  v-model="SCH_CALL_TP"
                  class="pl-form"
                  :items="mixin_common_code_get(this.common_code, 'CALL_TP', '전체')"
                  placeholder="선택하세요"
                ></v-select>
                <v-select
                  v-model="SCH_STATISTICS_ST"
                  class="pl-form"
                  :items="mixin_common_code_get(this.common_code, 'DEPT_CUSL_TP')"
                  placeholder="선택하세요"
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
                      :DateProp.sync="SCH_END_DT"/>
                    <!-- <compo-drop-picker
                      :StartDateProp.sync="startDate"
                      :EndDateProp.sync="endDate"
                    /> -->
                  </div>
                </template>
              </div>
            </div>

            <v-btn class="pl-btn is-icon" @click="phoneCuttDeptCuslStatistics">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols flex-grow-1">
        <div class="is-col-fix is-vrt" style="width: 610px">
          <!-- 도넛 차트 -->
          <div class="pl-card">
            <div class="pl-stat-doughnut-chart is-noborder">
              <h2 class="pl-subtit is-inform">{{ SCH_TERM_TXT }} <span class="is-txt-main">(전체)</span></h2>
              <div class="pl-cols">
                <div>
                  <chartjsDoughnutChart
                    class="is-mt-l"
                    :chartData="DonughtData"
                    :chartOptions="DonughtOptions"
                    :height="200"
                    :styles="{ background: '#fff' }"
                  ></chartjsDoughnutChart>
                </div>
                <div class="d-flex justify-center flex-column ml-2">
                  <ul class="pl-list-info4" >
                    <li>
                      <v-icon color="#7FC379">mdi-account-voice</v-icon>
                      <span class="pl-list-info-title">상담</span>
                      <strong class="pl-list-info-desc" >
                        {{ mixin_convertNumToComma(MONITOR.cs) }}
                      </strong>
                    </li>
                    <li>
                      <v-icon color="#8591E1">mdi-account-edit</v-icon>
                      <span class="pl-list-info-title">처리</span>
                      <strong class="pl-list-info-desc" >
                        {{ mixin_convertNumToComma(MONITOR.exec) }}
                      </strong>
                    </li>
                    <li>
                      <v-icon color="#FFB72C">mdi-percent</v-icon>
                      <span class="pl-list-info-title">처리율</span>
                      <strong class="pl-list-info-desc" >
                        {{ mixin_convertNumToComma(MONITOR.chk) }}
                        <sub style="bottom: 0; padding-right: 1px;">%</sub>
                      </strong>
                    </li>
                  </ul>
                  <ul class="is-mt-m">
                    <li class="d-flex align-center">
                      <span>총 상담시간</span>
                      <strong class="ml-auto" style="font-size: 15px;">{{ mixin_convertNumToComma(MONITOR.total_cs_time) }}</strong>
                    </li>
                    <li class="d-flex align-center">
                      <span>일평균 총 상담시간</span>
                      <strong class="ml-auto" style="font-size: 15px;">{{ mixin_convertNumToComma(MONITOR.per_day_cs_time) }}</strong>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
          <!-- 부서별 현황 bar 차트 -->
          <div class="pl-card">
            <div class="pl-stat-bar-chart is-noborder">
              <h2 class="pl-subtit is-inform d-flex">{{ DEPT_CUSL_TXT }} 현황</h2>
              <chartjsBarChart
                class="is-mt-s h350 px-4"
                :chartData="BarData"
                :chartOptions="BarOptions"
                :styles="{ background: '#fff' }"
              ></chartjsBarChart>
            </div>

          </div>
        </div>
        <!-- 부서별 현황 grid -->
        <div class="is-vrt" >
          <div class="pl-card">
            <div class="pl-grid-top">
              <div class="pl-grid-top-left">
                <h2 class="pl-subtit">{{ DEPT_CUSL_TXT }} 현황</h2>
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter">전체 <em class="pl-1">({{ itemsRowSpan.length }})</em> 건</span>
                <!-- 엑셀 다운로드 버튼 -->
                <compo-excel
                  TypeProp="Download"
                  :DataHeaderProp="headersRowSpan"
                  :DataBodyProp="itemsRowSpan"
                  :FileNameProp="SCH_TERM_TXT+'_'+DEPT_CUSL_TXT+'_통계_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                  :SheetNameProp="SCH_TERM_TXT+'_'+DEPT_CUSL_TXT+'_통계'"
                  HeaderColorProp="00B0F0"
                ></compo-excel>
              </div>
            </div>
            <v-data-table
              class="pl-grid is-rowspan"
              :headers="headersRowSpan"
              :items="itemsRowSpan"
              fixed-header
              item-key="index"
              height="585px"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              :page.sync="page"
              no-data-text="등록된 데이터가 없습니다."
              @page-count="pageCount = $event"
            >
              <template v-slot:item="{ item, index }">
                <tr
                  :class="mixin_getItemClass(item)"
                  :key="index">
                  <template v-if="STATISTICS_ST === 'DEPT'">
                  <td
                    v-if="index === 0 || item.DEPT_NM !== itemsRowSpan[index - 1].DEPT_NM"
                    :rowspan="mixin_getRowCount(index, 'DEPT_NM')"
                    :class="mixin_getHeaderClass(headersRowSpan[0].align)">{{ item.DEPT_NM }}</td>
                  </template>
                  <template v-else>
                  <td
                    v-if="index === 0 || item.USER_NM !== itemsRowSpan[index - 1].USER_NM"
                    :rowspan="mixin_getRowCount(index, 'USER_NM')"
                    :class="mixin_getHeaderClass(headersRowSpan[0].align)">{{ item.USER_NM }}</td>
                  </template>
                  <td
                    v-if="index === 0 || item.CL_TYPE_NM !== itemsRowSpan[index - 1].CL_TYPE_NM"
                    :rowspan="mixin_getRowCount(index, 'CL_TYPE_NM')"
                    :class="mixin_getHeaderClass(headersRowSpan[1].align)">{{ item.CL_TYPE_NM }}</td>
                  <td :class="mixin_getHeaderClass(headersRowSpan[1].align)">
                    {{ mixin_convertNumToComma(item.TOT_CNT) }}
                  </td>
                  <td :class="mixin_getHeaderClass(headersRowSpan[2].align)">
                    {{ mixin_convertNumToComma(item.COMPLETED_CNT) }}
                  </td>
                  <td :class="mixin_getHeaderClass(headersRowSpan[3].align)">
                    {{ mixin_convertNumToComma(item.NOT_COMPLETED_CNT) }}
                  </td>
                  <td :class="mixin_getHeaderClass(headersRowSpan[4].align)">
                    {{ mixin_convertNumToComma(item.DAY_AVG_CNT) }}
                  </td>
                  <td :class="mixin_getHeaderClass(headersRowSpan[5].align)">
                    {{ mixin_convertNumToComma(item.COMPLETED_RATE) }} %
                  </td>
                  <td :class="mixin_getHeaderClass(headersRowSpan[6].align)">
                    {{ mixin_convertNumToComma(convertSecToTxt(item.TOT_PHN_HR)) }}
                  </td>
                  <td :class="mixin_getHeaderClass(headersRowSpan[7].align)">
                    {{ mixin_convertNumToComma(convertSecToTxt(item.DAY_AVG_PHN_HR)) }}
                  </td>

                </tr>
              </template>
              <template slot="footer">
                <div class="pl-grid-sum">
                  <table >
                    <colgroup>
                      <col v-for="(col, index) in headersRowSpan" :key="index" :width=col.width />
                    </colgroup>
                    <tbody >
                      <tr >
                        <td colspan="2" class="pl-grid-sum-head text-center">합계</td>
                        <td class="text-center">
                          {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "TOT_CNT")) }}
                        </td>
                        <td class="text-center">
                          {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "COMPLETED_CNT")) }}
                        </td>
                        <td class="text-center">
                          {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "NOT_COMPLETED_CNT")) }}
                        </td>
                        <td class="text-center">
                          {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "DAY_AVG_CNT")) }}
                        </td>
                        <td class="text-center">
                          {{ mixin_sum_field(this.itemsRowSpan, "TOT_CNT")>0?((mixin_sum_field(this.itemsRowSpan, "COMPLETED_CNT")/mixin_sum_field(this.itemsRowSpan, "TOT_CNT"))*100).toFixed(2):0 }} %
                        </td>
                        <td class="text-center">
                          {{ mixin_convertNumToComma(convertSecToTxt(mixin_sum_field(this.itemsRowSpan, "TOT_PHN_HR"))) }}
                        </td>
                        <td class="text-center">
                          {{ mixin_convertNumToComma(convertSecToTxt(mixin_sum_field(this.itemsRowSpan, "DAY_AVG_PHN_HR"))) }}
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
import chartjsBarChart from "@/components/chartjsBarChart";

  export default {
  name: "MENU_STA_M0102", //name은 'MENU_' + 파일명 조합
  components: {
    chartjsDoughnutChart,
    chartjsBarChart
  },
  data() {
    return {
      common_code: [],

      DEPT_CUSL_TXT : '부서별',
      // top search
      SCH_CALL_TP: '', //콜 유형 검색
      SCH_STATISTICS_ST: 'DEPT', //부서/개인 구분
      SCH_ST_DT: '', //검색 시작 일자
      SCH_END_DT: '', //검색 종료 일자
      SCH_YEAR: '', //년도 검색
      SCH_MONTH: '', //월 검색
      SCH_QUARTER: '', //분기 검색
      datePeriod: 1, //일/월/분기 구분
      STATISTICS_ST: 'DEPT', //부서/개인 구분
      datePeriod_st: 1, //일/월/분기 구분

      YEAR_LIST: [],
      MONTH_LIST: [],
      QUARTER_LIST: [],

      YEAR: '', //년도
      MONTH: '', //월
      QUARTER: '', //분기
      ST_DT: '', //시작일
      END_DT: '', //종료일

      SCH_TERM_TXT : '',

      // top search
      startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      endDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      // 도넛 차트 현황
      MONITOR: {
        total_cs_time : 350,
        per_day_cs_time : 350,
        cs : 480,
        exec : 480,
        chk : 85.2,
      },

      // Doughnut Chart
      DonughtData: {
        labels: ["처리", "미처리",],
        datasets: [
          {
            backgroundColor: ['#8591E1', '#FAA7A8'],
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

      // bar chart
      BarData: {
        labels: [
        ],
        datasets: [
          {
            // label: "인입호",
            backgroundColor: '#4786e3',
            data: [],
            noData: false
          },
        ],
      },
      BarOptions: {
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

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: -1,
      headersRowSpan: [
        { text: '부서 명', align: "left", value: 'DEPT_NM', width: '180px',sortable: false},
        { text: "콜 유형", align: "left", value: "CL_TYPE_NM",  width: '100px' ,sortable: false},
        { text: "상담 건수", align: "center", value: "TOT_CNT",  width: '90px' ,sortable: false},
        { text: "처리 건수", align: "center", value: "COMPLETED_CNT",  width: '90px' ,sortable: false},
        { text: "미처리\n건수", align: "center", value: "NOT_COMPLETED_CNT",  width: '90px' ,sortable: false, class: 'multiline-header'},
        { text: "일평균\n상담 건수", align: "center", value: "DAY_AVG_CNT",  width: '90px' ,sortable: false, class: 'multiline-header'},
        { text: "처리율", align: "center", value: "COMPLETED_RATE",  width: '100px' ,sortable: false},
        { text: "총 상담시간", align: "center", value: "TOT_PHN_HR",  width: '140px' ,sortable: false},
        { text: "일평균\n상담시간", align: "center", value: "DAY_AVG_PHN_HR",  width: '140px' ,sortable: false, class: 'multiline-header'},
      ],
      itemsRowSpan: [],

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

      //confirm alert 메시지
      MESSAGE : {
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

  beforeDestroy(){
    this.$eventBus.$off("selCompanyAction"); //eventBus 중복방지를 위해 off
  },

  async created() {
    //상단 고객사 선택시 eventBus 실행(각 페이지별 필요에 의한 내용 구현)
    this.$eventBus.$on("selCompanyAction", (SELECTED_COMPANY) => {
      // console.log(`${this.$options.name} : =====>`, SELECTED_COMPANY.CD_NM);
    });

    //공통코드설정
    let codeName = ['CALL_TP', 'DEPT_CUSL_TP'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    this.SCH_ST_DT = this.$moment(this.startDate).subtract(7,'days').format('YYYY-MM-DD'); // 시작 일자(일주일전)
    this.SCH_END_DT = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); // 종료 일자

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

    this.phoneCuttDeptCuslStatistics();//통계 조회
  },

  mounted() {

  },

  methods: {
    //통계 조회
    async phoneCuttDeptCuslStatistics() {

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

      //초기화
      this.MONITOR.cs = 0;
      this.MONITOR.exec = 0;
      this.MONITOR.chk = 0;
      this.MONITOR.total_cs_time = 0;
      this.MONITOR.per_day_cs_time = 0;

      let DonughtData = this.DonughtData;
      DonughtData.datasets[0].data = [];

      let BarData = this.BarData;
      BarData.labels = [];
      BarData.datasets[0].data = [];

      let sUrl = '/api/statistics/phone/phoneCuttDeptCuslStatistics';
      let postParam = {
        CL_TYPE_CD : this.SCH_CALL_TP
        , STATISTICS_ST : this.SCH_STATISTICS_ST
        , SCH_GB : this.datePeriod === 0? 'DAY':this.datePeriod === 1? 'MONTH': 'QUARTER'
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

      if (!response.HEADER.ERROR_FLAG){

        this.STATISTICS_ST = this.SCH_STATISTICS_ST;
        this.datePeriod_st = this.datePeriod;

        if(this.STATISTICS_ST === 'DEPT'){
          this.DEPT_CUSL_TXT = '부서별';
          this.headersRowSpan[0].text = '부서 명';
          this.headersRowSpan[0].value = 'DEPT_NM';
        }else{
          this.DEPT_CUSL_TXT = '상담사별';
          this.headersRowSpan[0].text = '상담사 명';
          this.headersRowSpan[0].value = 'USER_NM';
        }

        if(this.datePeriod_st === 0){
          this.headersRowSpan[5].text = '일평균\n상담 건수';
          this.headersRowSpan[8].text = '일평균\n상담시간';
        }else if(this.datePeriod_st === 1){
          this.headersRowSpan[5].text = '월평균\n상담 건수';
          this.headersRowSpan[8].text = '월평균\n상담시간';
        }else if(this.datePeriod_st === 2){
          this.headersRowSpan[5].text = '분기평균\n상담 건수';
          this.headersRowSpan[8].text = '분기평균\n상담시간';
        }

        this.itemsRowSpan = response.DATA;

        this.MONITOR.cs = this.mixin_sum_field(response.DATA, "TOT_CNT"); //상담
        this.MONITOR.exec = this.mixin_sum_field(response.DATA, "COMPLETED_CNT"); //처리
        this.MONITOR.chk = this.MONITOR.cs > 0 ? ((this.MONITOR.exec / this.MONITOR.cs) * 100).toFixed(2) : 0; //처리율

        this.MONITOR.total_cs_time = this.convertSecToTxt(this.mixin_sum_field(response.DATA, "TOT_PHN_HR")); //총 상담시간
        this.MONITOR.per_day_cs_time = this.convertSecToTxt(this.mixin_sum_field(response.DATA, "DAY_AVG_PHN_HR")); //일평균 총 상담시간

        DonughtData.datasets[0].data.push(this.MONITOR.exec);
        DonughtData.datasets[0].data.push(Number(this.MONITOR.cs)-Number(this.MONITOR.exec));

        let iCnt = 0;
        DonughtData.datasets[0].data.forEach(data => {
          if(data > 0) iCnt++;
        });
        if(iCnt > 0) DonughtData.datasets[0].noData = false;
        else DonughtData.datasets[0].noData = true;

        if(this.STATISTICS_ST === 'DEPT'){
          const reslut = response.DATA.reduce((data, current) => {
            const foundIndex = data.findIndex(item => item.DEPT_ID === current.DEPT_ID);

            if (foundIndex !== -1) {
              data[foundIndex].TOT_CNT = Number(data[foundIndex].TOT_CNT) + Number(current.TOT_CNT);
            } else {
              data.push({ ...{DEPT_ID : current.DEPT_ID, DEPT_NM : current.DEPT_NM, TOT_CNT : current.TOT_CNT} });
            }

            return data;
          }, []);

          reslut.sort((a, b) => {return b.TOT_CNT - a.TOT_CNT;});

          let iCnt = 0;
          reslut.forEach((data, idx) => {
            if(idx < 10){
              BarData.labels.push(data.DEPT_NM);
              BarData.datasets[0].data.push(data.TOT_CNT);

              if(data.TOT_CNT > 0) iCnt++;
            }
          });

          if(iCnt > 0) BarData.datasets[0].noData = false;
          else BarData.datasets[0].noData = true;

        }else{
          const reslut = response.DATA.reduce((data, current) => {
            const foundIndex = data.findIndex(item => item.CUSL_ID === current.CUSL_ID);

            if (foundIndex !== -1) {
              data[foundIndex].TOT_CNT = Number(data[foundIndex].TOT_CNT) + Number(current.TOT_CNT);
            } else {
              data.push({ ...{CUSL_ID : current.CUSL_ID, USER_NM : current.USER_NM, TOT_CNT : current.TOT_CNT} });
            }

            return data;
          }, []);

          reslut.sort((a, b) => {return b.TOT_CNT - a.TOT_CNT;});

          let iCnt = 0;
          reslut.forEach((data, idx) => {
            if(idx < 10){
              BarData.labels.push(data.USER_NM);
              BarData.datasets[0].data.push(data.TOT_CNT);

              if(data.TOT_CNT > 0) iCnt++;
            }
          });

          if(iCnt > 0) BarData.datasets[0].noData = false;
          else BarData.datasets[0].noData = true;
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