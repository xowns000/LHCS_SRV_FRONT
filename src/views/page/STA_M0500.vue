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
            <v-btn class="pl-btn is-icon" @click="itgrtMsgStatistics">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols flex-grow-1">
        <!-- left -->
        <div class="is-vrt">
          <div class="pl-card">
            <div class="pl-grid-top">
              <div class="pl-grid-top-left">
                <h2 class="pl-subtit">{{ SCH_TERM_TXT }} <span class="is-txt-main">(전체)</span></h2>
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
                <!-- 엑셀 다운로드 버튼 -->
                <compo-excel
                  TypeProp="Download"
                  :DataHeaderProp="headers5"
                  :DataBodyProp="items"
                  :FileNameProp="SCH_TERM_TXT+' 통합 메시지_통계_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                  HeaderColorProp="00B0F0"
                ></compo-excel>
              </div>
            </div>
            <v-data-table
              class="pl-grid is-rowspan"
              :headers="headers5"
              :items="items"
              :items-per-page="-1"
              fixed-header
              item-key="index"
              height="585px"
              hide-default-header
              hide-default-footer
              no-data-text="등록된 데이터가 없습니다."
              >
              <template v-slot:header>
                <thead class="v-data-table-header multi-row">
                  <tr>
                    <th rowspan="2" width="100px" class="text-center"><span>날짜</span></th>
                    <th colspan="6" width="384px" class="text-center"><span>알림톡</span></th>
                    <th colspan="4" width="228px" class="text-center"><span>SMS</span></th>
                    <th colspan="4" width="228px" class="text-center"><span>LMS</span></th>
                    <th colspan="4" width="228px" class="text-center"><span>MMS</span></th>
                  </tr>
                  <tr>
                    <th class="text-center"><span>전송</span></th>
                    <th class="text-center"><span>결과대기</span></th>
                    <th class="text-center"><span>성공</span></th>
                    <th class="text-center"><span>실패</span></th>
                    <th class="text-center"><span>전환 SMS</span></th>
                    <th class="text-center"><span>전환 LMS</span></th>
                    <th class="text-center"><span>전송</span></th>
                    <th class="text-center"><span>결과대기</span></th>
                    <th class="text-center"><span>성공</span></th>
                    <th class="text-center"><span>실패</span></th>
                    <th class="text-center"><span>전송</span></th>
                    <th class="text-center"><span>결과대기</span></th>
                    <th class="text-center"><span>성공</span></th>
                    <th class="text-center"><span>실패</span></th>
                    <th class="text-center"><span>전송</span></th>
                    <th class="text-center"><span>결과대기</span></th>
                    <th class="text-center"><span>성공</span></th>
                    <th class="text-center"><span>실패</span></th>
                  </tr>
                </thead>
              </template>
              <!-- grid 컬러링 test -->
              <!-- <template v-for="status in headers5" v-slot:[`item.${status.value}`]="{ item }">
                <td :class="`${item[status.value] == 0 ? 'is-txt-gray' : ''} text-center`"> {{ item[status.value] == 0 ? '-' : item[status.value] }} </td>
              </template> -->
              <template slot="footer">
                <div class="pl-grid-sum">
                  <table >
                    <colgroup>
                      <col v-for="(col, index) in headers5" :key="index" :width=col.width />
                    </colgroup>
                    <tbody >
                      <tr >
                        <td class="pl-grid-sum-head text-center font-weight-bold">합계</td>
                        <td class="text-center" style="white-space: no-wrap;overflow:visible;"> {{ mixin_convertNumToComma(mixin_sum_field(this.items, "ATALK")) }} </td>
                        <td class="text-center" style="white-space: no-wrap;overflow:visible;"> {{ mixin_convertNumToComma(mixin_sum_field(this.items, "ATALK_READY")) }} </td>
                        <td class="text-center" style="white-space: no-wrap;overflow:visible;"> {{ mixin_convertNumToComma(mixin_sum_field(this.items, "ATALK_SUCCESS")) }} </td>
                        <td class="text-center" style="white-space: no-wrap;overflow:visible;"> {{ mixin_convertNumToComma(mixin_sum_field(this.items, "ATALK_FAIL")) }} </td>
                        <td class="text-center" style="white-space: no-wrap;overflow:visible;"> {{ mixin_convertNumToComma(mixin_sum_field(this.items, "ATALK_TRAN_SMS_SUCCESS")) }} </td>
                        <td class="text-center" style="white-space: no-wrap;overflow:visible;"> {{ mixin_convertNumToComma(mixin_sum_field(this.items, "ATALK_TRAN_LMS_SUCCESS")) }} </td>
                        <td class="text-center" style="white-space: no-wrap;overflow:visible;"> {{ mixin_convertNumToComma(mixin_sum_field(this.items, "SMS")) }} </td>
                        <td class="text-center" style="white-space: no-wrap;overflow:visible;"> {{ mixin_convertNumToComma(mixin_sum_field(this.items, "SMS_READY")) }} </td>
                        <td class="text-center" style="white-space: no-wrap;overflow:visible;"> {{ mixin_convertNumToComma(mixin_sum_field(this.items, "SMS_SUCCESS")) }} </td>
                        <td class="text-center" style="white-space: no-wrap;overflow:visible;"> {{ mixin_convertNumToComma(mixin_sum_field(this.items, "SMS_FAIL")) }} </td>
                        <td class="text-center" style="white-space: no-wrap;overflow:visible;"> {{ mixin_convertNumToComma(mixin_sum_field(this.items, "LMS")) }} </td>
                        <td class="text-center" style="white-space: no-wrap;overflow:visible;"> {{ mixin_convertNumToComma(mixin_sum_field(this.items, "LMS_READY")) }} </td>
                        <td class="text-center" style="white-space: no-wrap;overflow:visible;"> {{ mixin_convertNumToComma(mixin_sum_field(this.items, "LMS_SUCCESS")) }} </td>
                        <td class="text-center" style="white-space: no-wrap;overflow:visible;"> {{ mixin_convertNumToComma(mixin_sum_field(this.items, "LMS_FAIL")) }} </td>
                        <td class="text-center" style="white-space: no-wrap;overflow:visible;"> {{ mixin_convertNumToComma(mixin_sum_field(this.items, "MMS")) }} </td>
                        <td class="text-center" style="white-space: no-wrap;overflow:visible;"> {{ mixin_convertNumToComma(mixin_sum_field(this.items, "MMS_READY")) }} </td>
                        <td class="text-center" style="white-space: no-wrap;overflow:visible;"> {{ mixin_convertNumToComma(mixin_sum_field(this.items, "MMS_SUCCESS")) }} </td>
                        <td class="text-center" style="white-space: no-wrap;overflow:visible;"> {{ mixin_convertNumToComma(mixin_sum_field(this.items, "MMS_FAIL")) }} </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
            </v-data-table>
          </div>
        </div>
        <!-- right -->
        <div class="is-col-fix is-vrt" style="width: 430px">
          <div class="pl-card">
            <!-- 메시지 유형별 차트 -->
            <div class="pl-stat-doughnut-chart">
              <h2 class="pl-subtit">메시지 유형별</h2>
              <chartjsDoughnutChart
                class="is-mt-l h130"
                :chartData="DonughtData"
                :chartOptions="DonughtOptions"
                :styles="{ background: '#fff' }"
              ></chartjsDoughnutChart>
              <ul class="pl-list-info4 type-icon is-mt-m">
                <li>
                  <v-icon class="pl-icon-rightmenu talk"></v-icon>
                  <span class="pl-list-info-title">알림톡</span>
                  <strong class="pl-list-info-desc">{{ mixin_convertNumToComma(MONITOR.MSG_TYPE.talk) }} <sub style="bottom: 0">건</sub></strong>
                </li>
                <li>
                  <v-icon class="pl-icon-rightmenu sms"></v-icon>
                  <span class="pl-list-info-title">문자메시지</span>
                  <strong class="pl-list-info-desc">{{ mixin_convertNumToComma(MONITOR.MSG_TYPE.sms) }} <sub style="bottom: 0">건</sub></strong>
                </li>
              </ul>
            </div>
            <!-- 문자 메시지 유형별 바 차트 -->
            <div class="pl-stat-bar-chart is-mt-m">
              <h2 class="pl-subtit d-flex">문자 메시지 유형별</h2>
              <chartjsBarChart
                class="is-mt-m h200 px-4"
                :chartData="BarData"
                :chartOptions="BarOptions"
                :styles="{ background: '#fff' }"
              ></chartjsBarChart>
              <v-divider class="mt-2"></v-divider>
              <ul class="pl-line-list is-mt-m px-2">
                <li>
                  <span class="pl-list-info-title">SMS</span>
                  <strong class="pl-list-info-desc">{{ mixin_convertNumToComma(MONITOR.SMS_MSG_TYPE.sms) }}({{ MONITOR.SMS_MSG_TYPE.sms_per }}%)</strong>
                </li>
                <li>
                  <span class="pl-list-info-title">LMS</span>
                  <strong class="pl-list-info-desc">{{ mixin_convertNumToComma(MONITOR.SMS_MSG_TYPE.lms) }}({{ MONITOR.SMS_MSG_TYPE.lms_per }}%)</strong>
                </li>
                <li>
                  <span class="pl-list-info-title">MMS</span>
                  <strong class="pl-list-info-desc">{{ mixin_convertNumToComma(MONITOR.SMS_MSG_TYPE.mms) }}({{ MONITOR.SMS_MSG_TYPE.mms_per }}%)</strong>
                </li>
              </ul>
            </div>

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
  name: "MENU_STA_M0500", //name은 'MENU_' + 파일명 조합
  components: {
    chartjsBarChart,
    chartjsDoughnutChart
  },
  data() {
    return {
      // top search
      SCH_ST_DT: '', //검색 시작 일자
      SCH_END_DT: '', //검색 종료 일자
      SCH_YEAR: '', //년도 검색
      SCH_MONTH: '', //월 검색
      SCH_QUARTER: '', //분기 검색
      datePeriod: 1, //일/월/분기 구분
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

      // grid
      headers5: [
        { text: '날짜', value: 'DT', align: 'left', width: '100px', sortable: false },
        { text: '전송', value: 'ATALK', align: 'center', width: '64px', sortable: false },
        { text: '결과대기', value: 'ATALK_READY', align: 'center', width: '64px', sortable: false },
        { text: '성공', value: 'ATALK_SUCCESS', align: 'center', width: '64px', sortable: false },
        { text: '실패', value: 'ATALK_FAIL', align: 'center', width: '64px', sortable: false },
        { text: '전환 SMS', value: 'ATALK_TRAN_SMS_SUCCESS', align: 'center', width: '64px', sortable: false },
        { text: '전환 LMS', value: 'ATALK_TRAN_LMS_SUCCESS', align: 'center', width: '64px', sortable: false },
        { text: '전송', value: 'SMS', align: 'center', width: '57px', sortable: false },
        { text: '결과대기', value: 'SMS_READY', align: 'center', width: '57px', sortable: false },
        { text: '성공', value: 'SMS_SUCCESS', align: 'center', width: '57px', sortable: false },
        { text: '실패', value: 'SMS_FAIL', align: 'center', width: '57px', sortable: false },
        { text: '전송', value: 'LMS', align: 'center', width: '57px', sortable: false },
        { text: '결과대기', value: 'LMS_READY', align: 'center', width: '57px', sortable: false },
        { text: '성공', value: 'LMS_SUCCESS', align: 'center', width: '57px', sortable: false },
        { text: '실패', value: 'LMS_FAIL', align: 'center', width: '57px', sortable: false },
        { text: '전송', value: 'MMS', align: 'center', width: '57px', sortable: false },
        { text: '결과대기', value: 'MMS_READY', align: 'center', width: '57px', sortable: false },
        { text: '성공', value: 'MMS_SUCCESS', align: 'center', width: '57px', sortable: false },
        { text: '실패', value: 'MMS_FAIL', align: 'center', width: '57px', sortable: false },
      ],
      items: [],

      // 모니터
      MONITOR: {
        MSG_TYPE : {
          talk : 0,
          sms: 0,
        },
        SMS_MSG_TYPE: {
          sms: 0,
          sms_per: 0,
          lms: 0,
          lms_per: 0,
          mms: 0,
          mms_per: 0,
        }
      },

      //메시지 유형별 chart
      DonughtData: {
        labels: ["문자 메시지", "알림톡",],
        datasets: [
          {
            backgroundColor: ['#8591E1', '#FAA7A8'],
            data: [0, 0],
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
            position: 'right',
            labels: {
              padding: 20,
              boxWidth: 10,
              usePointStyle: true,
              pointStyle: 'Rounded',
            },
          }
        },
      },

      // 문자 메시지 유형별 chart
      BarData: {
        labels: [
          'SMS',
          'LMS',
          'MMS',
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
      BarOptions: {
        responsive: true,
        maintainAspectRatio: false,
        barThickness: 40,
        borderRadius: 8,
        // indexAxis: 'y',
        plugins: {
          legend: {
            display: false,
          }
        },
      },

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

    this.itgrtMsgStatistics();//통합 메시지 통계 조회
  },

  mounted() {

  },

  methods: {
    async itgrtMsgStatistics() {
      this.items = [];

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
      this.MONITOR.MSG_TYPE.talk = 0;
      this.MONITOR.MSG_TYPE.sms = 0;
      this.MONITOR.SMS_MSG_TYPE.sms = 0;
      this.MONITOR.SMS_MSG_TYPE.sms_per = 0;
      this.MONITOR.SMS_MSG_TYPE.lms = 0;
      this.MONITOR.SMS_MSG_TYPE.lms_per = 0;
      this.MONITOR.SMS_MSG_TYPE.mms = 0;
      this.MONITOR.SMS_MSG_TYPE.mms_per = 0;

      let DonughtData = this.DonughtData;
      DonughtData.datasets[0].data = [];

      let BarData = this.BarData;
      BarData.datasets[0].data = [];

      let sUrl = '/api/statistics/phone/itgrtMsgStatistics';
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

      if (!response.HEADER.ERROR_FLAG){
        let iTalkCnt = 0;
        let iSmskCnt = 0;
        let iLmskCnt = 0;
        let iMmskCnt = 0;
        if(response.DATA.length > 0){
          response.DATA.forEach((data, idx) => {
            data.DT = this.mixin_convertDate(data.DT, 'yyyy-MM-dd');

            iTalkCnt += Number(data.ATALK);
            iSmskCnt += Number(data.SMS);
            iLmskCnt += Number(data.LMS);
            iMmskCnt += Number(data.MMS);

            data.ATALK = this.mixin_convertNumToComma(data.ATALK);
            data.ATALK_SUCCESS = this.mixin_convertNumToComma(data.ATALK_SUCCESS);
            data.ATALK_FAIL = this.mixin_convertNumToComma(data.ATALK_FAIL);
            data.ATALK_TRAN_SMS_SUCCESS = this.mixin_convertNumToComma(data.ATALK_TRAN_SMS_SUCCESS);
            data.ATALK_TRAN_LMS_SUCCESS = this.mixin_convertNumToComma(data.ATALK_TRAN_LMS_SUCCESS);
            data.SMS = this.mixin_convertNumToComma(data.SMS);
            data.SMS_SUCCESS = this.mixin_convertNumToComma(data.SMS_SUCCESS);
            data.SMS_FAIL = this.mixin_convertNumToComma(data.SMS_FAIL);
            data.LMS = this.mixin_convertNumToComma(data.LMS);
            data.LMS_SUCCESS = this.mixin_convertNumToComma(data.LMS_SUCCESS);
            data.LMS_FAIL = this.mixin_convertNumToComma(data.LMS_FAIL);
            data.MMS = this.mixin_convertNumToComma(data.MMS);
            data.MMS_SUCCESS = this.mixin_convertNumToComma(data.MMS_SUCCESS);
            data.MMS_FAIL = this.mixin_convertNumToComma(data.MMS_FAIL);
          });
        }

        let iSumSmsCnt = (iSmskCnt + iLmskCnt + iMmskCnt);

        this.MONITOR.MSG_TYPE.talk = iTalkCnt;
        this.MONITOR.MSG_TYPE.sms = iSumSmsCnt;

        DonughtData.datasets[0].data.push(iTalkCnt);
        DonughtData.datasets[0].data.push(iSumSmsCnt);

        let iCnt = 0;
        DonughtData.datasets[0].data.forEach(data => {
          if(data > 0) iCnt++;
        });

        if(iCnt > 0) DonughtData.datasets[0].noData = false;
        else DonughtData.datasets[0].noData = true;

        this.MONITOR.SMS_MSG_TYPE.sms = iSmskCnt;
        this.MONITOR.SMS_MSG_TYPE.sms_per = iSumSmsCnt>0?((iSmskCnt / iSumSmsCnt) * 100).toFixed(2):0;
        this.MONITOR.SMS_MSG_TYPE.lms = iLmskCnt;
        this.MONITOR.SMS_MSG_TYPE.lms_per = iSumSmsCnt>0?((iLmskCnt / iSumSmsCnt) * 100).toFixed(2):0;
        this.MONITOR.SMS_MSG_TYPE.mms = iMmskCnt;
        this.MONITOR.SMS_MSG_TYPE.mms_per = iSumSmsCnt>0?((iMmskCnt / iSumSmsCnt) * 100).toFixed(2):0;

        BarData.datasets[0].data.push(iSmskCnt);
        BarData.datasets[0].data.push(iLmskCnt);
        BarData.datasets[0].data.push(iMmskCnt);

        iCnt = 0;
        BarData.datasets[0].data.forEach(data => {
          if(data > 0) iCnt++;
        });

        if(iCnt > 0) BarData.datasets[0].noData = false;
        else BarData.datasets[0].noData = true;

        this.items = response.DATA;
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>