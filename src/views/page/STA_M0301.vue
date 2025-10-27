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
                  v-model="SCH_CHN_CLSF_CD"
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
              <!-- 사용자명 -->
              <span class="pl-label">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(common_code, 'USER_SRCH','전체')"
                  v-model="USER_SRCH"
                ></v-select>
              </span>
              <div class="pl-desc">
                <!-- 검색어 입력 -->
                <v-text-field
                  class="pl-form"
                  placeholder="검색어 입력"
                  v-model="SCH_USER"
                ></v-text-field>
              </div>
              <v-btn class="pl-btn is-icon" @click="chatCuttCuslStatistics()">
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
            </div>


          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols">
        <div class="is-col-fix " style="width: 610px">
          <!-- 도넛 차트 -->
          <div class="pl-card">
            <div class="pl-stat-doughnut-chart">
              <div class="pl-cols">
                <div>
                  <chartjsDoughnutChart
                    class="is-mt-m h130"
                    :chartData="DonughtData"
                    :chartOptions="DonughtOptions"
                    :styles="{ background: '#fff' }"
                  ></chartjsDoughnutChart>
                </div>

              </div>
            </div>
          </div>
        </div>
        <!-- 모니터링 -->
        <div class="pl-card">
          <div class="d-flex" style="height: 100%;">
            <!-- 상담 현황 -->
            <ul class="pl-list-info4 align-self-stretch" style="padding-right: 42px; gap: 28px">
              <li
                v-for="item in MONITOR.process"
                :key="item.id"
                class="justify-center"
                >
                <span
                  class="d-flex align-center justify-center"
                  style="background: #f2f2f2; border-radius: 50px; width: 60px; height: 60px;">
                  <v-icon :color="item.color" >{{ item.icon }}</v-icon>
                </span>
                <span class="pl-list-info-title mt-4">{{ item.text }}</span>
                <strong class="pl-list-info-desc mt-4" :class="item.class">
                  {{ item.count }}
                  <sub v-if="item.unit" style="bottom: 0">{{ item.unit }}</sub>
                </strong>
              </li>
            </ul>
            <!-- 상담건수,시간 리스트 -->
            <ul class="pl-list-box2 d-flex flex-column justify-content-between" style="flex: 1 0 400px;">
              <li
                v-for="item in MONITOR.count"
                :key="item.id"
                >
                <span class="">{{ item.text }}</span>
                <strong class="ml-auto text-subtitle-1 font-weight-bold" :class="item.class">
                  {{ item.count }}
                  <sub v-if="item.unit" style="bottom: 0">{{ item.unit }}</sub>
                </strong>
              </li>
              <li
                v-for="item,index in MONITOR.time"
                :key="item.id"
                :class="index === 0? 'pl-list-box2-divider' : ''"
                >
                <span class="">{{ item.text }}</span>
                <strong class="ml-auto text-subtitle-1 font-weight-bold" :class="item.class">
                  <!-- {{ item.count }} -->
                  <template v-for="count, index in item.count" >
                    <span :key="count.id" class="ml-2" stlye="display: contents">
                      {{ (count) }}
                      <sub style="bottom: 0">{{ displayTimeUnit(index) }}</sub></span>
                  </template>
                </strong>
              </li>
            </ul>
          </div>

        </div>
      </div>
      <!-- 부서별 현황 grid -->
      <div class="pl-card">
        <div class="pl-grid-top">
          <div class="pl-grid-top-left">
            <h2 class="pl-subtit">상담직원별 현황</h2>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ itemsRowSpan.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
              TypeProp="Download"
              :DataHeaderProp="headersRowSpan"
              :DataBodyProp="itemsRowSpan"
              :FileNameProp="SCH_TERM_TXT+'_통계_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
              HeaderColorProp="00B0F0"
            ></compo-excel>
          </div>
        </div>
        <v-data-table
          class="pl-grid "
          :headers="headersRowSpan"
          :items="itemsRowSpan"
          fixed-header
          item-key="index"
          height="360px"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
          hide-default-header
          :page.sync="page"
          no-data-text="등록된 데이터가 없습니다."
          @page-count="pageCount = $event"
        >
          <template v-slot:header>
            <thead class="v-data-table-header multi-row">
              <tr>
                <th rowspan="2" width="80px" class="text-center"><span>번호</span></th>
                <th colspan="2" width="242px" class="text-center"><span>상담원</span></th>
                <th rowspan="2" width="150px" class="text-center"><span>상담배정</span></th>
                <th colspan="3" width="300px" class="text-center"><span>상담진행(건)</span></th>
                <th rowspan="2" width="100px" class="text-center"><span>고객대기중 포기</span></th>
                <th rowspan="2" width="120px" class="text-center"><span>상담응대율(%)</span></th>
                <th colspan="2" width="160px" class="text-center"><span>상태별시간</span></th>
                <th colspan="2" width="160px" class="text-center"><span>상담시간</span></th>
                <th colspan="2" width="160px" class="text-center"><span>후처리시간</span></th>
                <th colspan="2" width="160px" class="text-center"><span>처리시간</span></th>
              </tr>
              <tr>
                <th class="text-center"><span>성명</span></th>
                <th class="text-center"><span>소속</span></th>
                <th class="text-center"><span>총상담처리</span></th>
                <th class="text-center"><span>상담</span></th>
                <th class="text-center"><span>전달</span></th>
                <th class="text-center"><span>채팅ON</span></th>
                <th class="text-center"><span>채팅OFF</span></th>
                <th class="text-center"><span>합계</span></th>
                <th class="text-center"><span>평균</span></th>
                <th class="text-center"><span>합계</span></th>
                <th class="text-center"><span>평균</span></th>
                <th class="text-center"><span>합계</span></th>
                <th class="text-center"><span>평균</span></th>
              </tr>
            </thead>
          </template>
          <template slot="footer">
            <div class="pl-grid-sum">
              <table >
                <colgroup>
                  <col v-for="(col, index) in headersRowSpan" :key="index" :width=col.width />
                </colgroup>
                <tbody >
                  <tr >
                    <td colspan="3" class="pl-grid-sum-head text-center">합계(평균)</td>
                    <td class="text-center">
                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "TOT_CNT")) }}
                    </td>
                    <td class="text-center">
                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "CMPL_CNT")) }}
                    </td>
                    <td class="text-center">
                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "CUTT_CNT")) }}
                    </td>
                    <td class="text-center">
                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "TRAN_CNT")) }}
                    </td>
                    <td class="text-center">
                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "GIVEUP_CNT")) }}
                    </td>
                    <td class="text-center">
                      {{ Math.round(mixin_sum_field(this.itemsRowSpan, "TOT_CUTT") / mixin_sum_field(this.itemsRowSpan, "TOT_CNT") * 10000) / 100 }}
                    </td>
                    <td class="text-center">
                      {{ mixin_date_sum_field(this.itemsRowSpan, "NEW_ON_HR") }}
                    </td>
                    <td class="text-center">
                      {{ mixin_date_sum_field(this.itemsRowSpan, "NEW_OFF_HR") }}
                    </td>
                    <td class="text-center">
                      {{ mixin_date_sum_field(this.itemsRowSpan, "NEW_CUTT_TOT_HR") }}
                    </td>
                    <td class="text-center">
                      {{ mixin_date_avg_field(this.itemsRowSpan, "NEW_CUTT_AVG_HR") }}
                    </td>
                    <td class="text-center">
                      {{ mixin_date_sum_field(this.itemsRowSpan, "NEW_AFTPRCS_TOT_HR") }}
                    </td>
                    <td class="text-center">
                      {{ mixin_date_avg_field(this.itemsRowSpan, "NEW_AFTPRCS_AVG_HR") }}
                    </td>
                    <td class="text-center">
                      {{ mixin_date_sum_field(this.itemsRowSpan, "NEW_PRCS_TOT_HR") }}
                    </td>
                    <td class="text-center">
                      {{ mixin_date_avg_field(this.itemsRowSpan, "NEW_PRCS_AVG_HR") }}
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
</template>

<script>
import chartjsDoughnutChart from "@/components/chartjsDoughnutChart";

  export default {
  name: "MENU_STA_M0301", //name은 'MENU_' + 파일명 조합
  components: {
    chartjsDoughnutChart
  },
  data() {
    return {
      //공통코드
      common_code:[],

      SCH_CHN_CLSF_CD: '',  //채널분류
      SCH_TERM_TXT: '',
      // top search
      // SCH_ST_DT: '', //검색 시작 일자
      // SCH_END_DT: '', //검색 종료 일자
      SCH_YEAR: '', //년도 검색
      SCH_MONTH: '', //월 검색
      SCH_QUARTER: '', //분기 검색
      datePeriod: 1, //일/월/분기 구분
      datePeriod_st: 1, //일/월/분기 구분

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

      USER_SRCH: '',  //사용자 검색조건
      SCH_USER:'',    //검색 사용자

      // 모니터링 현황
      MONITOR: {
        process: [
          { text: '상담요청', icon: 'mdi-account-voice', color: '#7FC379', count: 0, },
          { text: '상담완료', icon: 'mdi-account-edit', color: '#8591E1', count: 0, },
          { text: '처리율', icon: 'mdi-percent', color: '#FFB72C', count: 0, unit: '%'},
        ],
        count: [
          { text: '총 상담 건수', icon: '', class: '', count: 0, },
          { text: '평균 상담 건수', icon: '', count: 0, },
        ],
        time: [
          { text: '총 상담시간', icon: '', count: 1, class: '', },
          { text: '평균 상담시간', icon: '', count: 2, },
        ]
      },

      // Doughnut Chart
      DonughtData: {},
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

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: -1,
      headersRowSpan: [
        { text: '번호', value: 'ROWNUM', align: 'center', width: '80px' },
        { text: '성명', align: "left", value: 'USER_NM', width: '125px',sortable: false},
        { text: "소속", align: "left", value: "DEPT_NM",  width: '125px' ,sortable: false},
        { text: "상담배정", align: "center", value: "TOT_CNT",  width: '150px' ,sortable: false},
        { text: "총상담처리", align: "center", value: "CMPL_CNT",  width: '103px' ,sortable: false},
        { text: "상담", align: "center", value: "CUTT_CNT",  width: '103px' ,sortable: false, },
        { text: "전달", align: "center", value: "TRAN_CNT",  width: '103px' ,sortable: false, },
        { text: "고객대기중\n포기", align: "center", value: "GIVEUP_CNT",  width: '103px' ,sortable: false, class: 'multiline-header'},
        { text: "상담응대율\n(%)", align: "center", value: "RSPNS_RATIO",  width: '125px' ,sortable: false, class: 'multiline-header'},
        { text: "채팅ON", align: "center", value: "NEW_ON_HR",  width: '83px' ,sortable: false, },
        { text: "채팅OFF", align: "center", value: "NEW_OFF_HR",  width: '83px' ,sortable: false, },
        { text: "합계", align: "center", value: "NEW_CUTT_TOT_HR",  width: '83px' ,sortable: false, },
        { text: "평균", align: "center", value: "NEW_CUTT_AVG_HR",  width: '83px' ,sortable: false, },
        { text: "합계", align: "center", value: "NEW_AFTPRCS_TOT_HR",  width: '83px' ,sortable: false, },
        { text: "평균", align: "center", value: "NEW_AFTPRCS_AVG_HR",  width: '83px' ,sortable: false, },
        { text: "합계", align: "center", value: "NEW_PRCS_TOT_HR",  width: '83px' ,sortable: false, },
        { text: "평균", align: "center", value: "NEW_PRCS_AVG_HR",  width: '83px' ,sortable: false, },
      ],
      itemsRowSpan: [],

    }
  },
  watch: {
  },
  computed: {
  },

  async created() {

    //공통코드설정
    let codeName = ['CHNL_CL', 'USER_SRCH'];
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

    this.chatCuttCuslStatistics();//통계 조회
  },
  mounted() {
  },
  methods: {
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

    async chatCuttCuslStatistics(){
      this.YEAR = this.SCH_YEAR;
      this.MONTH = this.SCH_MONTH;
      this.QUARTER = this.datePeriod;
      this.ST_DT = this.SCH_ST_DT;
      this.END_DT = this.SCH_END_DT;

      this.itemsRowSpan = [];

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

      let DonughtData = {
        labels: ["총상담처리", "상담", "전달"],
        datasets: [
          {
            backgroundColor: ['#4E94E9', '#FAC219', '#F26161'],
            data: [],
            noData: false
          }
        ]
      };

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

      let sUrl = '/api/statistics/chat/chatCuttCuslStatistics';
      let postParam = {
        CHN_CLSF_CD : this.SCH_CHN_CLSF_CD
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
        let rsltLeng = response.DATA.length
        if(rsltLeng > 0){
          let iCnt = 0;

          if(response.DATA[0].CMPL_CNT != '0'){
            DonughtData.datasets[0].data[0] = response.DATA[0].CMPL_CNT;
            iCnt++
          } else {
            DonughtData.datasets[0].data[0] = '0';
          }

          if(response.DATA[0].CMPL_CNT != '0'){
            DonughtData.datasets[0].data[1] = response.DATA[0].CUTT_CNT;
            iCnt++
          } else {
            DonughtData.datasets[0].data[1] = '0';
          }

          if(response.DATA[0].CMPL_CNT != '0'){
            DonughtData.datasets[0].data[2] = response.DATA[0].TRAN_CNT;
            iCnt++
          } else {
            DonughtData.datasets[0].data[2] = '0';
          }

          if(iCnt > 0) {
            DonughtData.datasets[0].noData = false;
          } else {
            DonughtData.datasets[0].noData = true;
          }
          this.DonughtData = DonughtData;

          this.MONITOR.process[0].count =  response.DATA[0].TOT_CNT;  //총 인입
          this.MONITOR.process[1].count =  response.DATA[0].CMPL_CNT;  //상담 완료
          this.MONITOR.process[2].count =  response.DATA[0].TOT_CNT == 0 ? 0 : Math.round((response.DATA[0].CMPL_CNT / response.DATA[0].TOT_CNT) * 10000)/100  //처리율

          this.MONITOR.count[0].count = response.DATA[0].CUTT_CNT;  //총상담 건수(응대 건수)
          this.MONITOR.count[1].count = Math.round((response.DATA[0].CUSL_AVG_CNT) * 100)/100;  //평균상담 건수(응대 건수)

          let sTotTime = this.mixin_seconds_toHHMMSS(response.DATA[0].CUTT_HR);
          let sTotTimeWord = [];
          sTotTime.split(':').forEach((time, idx) => {
            if(idx === 0 && Number(time) > 0) sTotTimeWord.push(Number(time));
            else if(idx === 1) sTotTimeWord.push(Number(time));
            else if(idx === 2) sTotTimeWord.push(Number(time));
          });
          this.MONITOR.time[0].count = sTotTimeWord;  //총상담 시간(응대 건수)

          let sAvgTime = this.mixin_seconds_toHHMMSS(response.DATA[0].CUSL_AVG_HR);
          let sAvgTimeWord = [];
          sAvgTime.split(':').forEach((time, idx) => {
            if(idx === 0 && Number(time) > 0) sAvgTimeWord.push(Number(time));
            else if(idx === 1) sAvgTimeWord.push(Number(time));
            else if(idx === 2) sAvgTimeWord.push(Number(time));
          });
          this.MONITOR.time[1].count = sAvgTimeWord;  //평균상담 시간(응대 건수)
        }

        let cuslLeng = response.CUSL_LIST.length
        if(cuslLeng > 0){
          for(let n=0;n<cuslLeng;n++){
            response.CUSL_LIST[n]["TOT_CUTT"] = parseInt(response.CUSL_LIST[n].CMPL_CNT) + parseInt(response.CUSL_LIST[n].CUTT_CNT);
            response.CUSL_LIST[n]["RSPNS_RATIO"] = response.CUSL_LIST[n].TOT_CNT == 0 ? 0 : Math.round(((parseInt(response.CUSL_LIST[n].CMPL_CNT) + parseInt(response.CUSL_LIST[n].CUTT_CNT)) / response.CUSL_LIST[n].TOT_CNT) * 10000)/100

            if(response.CUSL_LIST[n].ON_HR != null && response.CUSL_LIST[n].ON_HR != ''){
              response.CUSL_LIST[n].NEW_ON_HR = this.mixin_seconds_toHHMMSS(response.CUSL_LIST[n].ON_HR);  //총ON 시간(응대 건수)
            } else {
              response.CUSL_LIST[n].NEW_ON_HR = '00:00:00'
            }
            if(response.CUSL_LIST[n].OFF_HR != null && response.CUSL_LIST[n].OFF_HR != ''){
              response.CUSL_LIST[n].NEW_OFF_HR = this.mixin_seconds_toHHMMSS(response.CUSL_LIST[n].OFF_HR);  //총OFF 시간(응대 건수)
            } else {
              response.CUSL_LIST[n].NEW_OFF_HR = '00:00:00'
            }

            response.CUSL_LIST[n].NEW_CUTT_TOT_HR = this.mixin_seconds_toHHMMSS(response.CUSL_LIST[n].CUTT_TOT_HR);  //총상담 시간(응대 건수)
            response.CUSL_LIST[n].NEW_CUTT_AVG_HR = this.mixin_seconds_toHHMMSS(Math.round(response.CUSL_LIST[n].CUTT_AVG_HR));  //평균상담 시간(응대 건수)

            response.CUSL_LIST[n].NEW_AFTPRCS_TOT_HR = this.mixin_seconds_toHHMMSS(response.CUSL_LIST[n].AFTPRCS_TOT_HR);  //총상담 시간(응대 건수)
            response.CUSL_LIST[n].NEW_AFTPRCS_AVG_HR = this.mixin_seconds_toHHMMSS(Math.round(response.CUSL_LIST[n].AFTPRCS_AVG_HR));  //평균상담 시간(응대 건수)

            response.CUSL_LIST[n].NEW_PRCS_TOT_HR = this.mixin_seconds_toHHMMSS(response.CUSL_LIST[n].PRCS_TOT_HR);  //총상담 시간(응대 건수)
            response.CUSL_LIST[n].NEW_PRCS_AVG_HR = this.mixin_seconds_toHHMMSS(Math.round(response.CUSL_LIST[n].PRCS_AVG_HR));  //평균상담 시간(응대 건수)
          }
          this.itemsRowSpan = response.CUSL_LIST;
        }
      }

    }
  },
};
</script>

<style lang="scss" scoped>

</style>