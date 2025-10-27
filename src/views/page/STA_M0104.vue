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
                  <!-- <compo-drop-picker
                    :StartDateProp.sync="date2"
                    :EndDateProp.sync="date3"
                  /> -->
                </div>
              </div>
            </div>
            <v-btn class="pl-btn is-icon" @click="phoneCuttDailyStatistics">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols flex-grow-1">
        <!-- left -->
        <div class="is-col-fix is-vrt" style="width: 410px">
          <div class="pl-card">
            <!-- Doughnut chart -->
            <div class="pl-stat-doughnut-chart is-noborder">
              <h2 class="pl-subtit is-inform">{{ SCH_TERM_TXT }} <span class="is-txt-main">(전체)</span></h2>
              <div class="pl-cols">
                <chartjsDoughnutChart
                  class="is-mt-l h250"
                  :chartData="DonughtData"
                  :chartOptions="DonughtOptions"
                  :styles="{ background: '#fff' }"
                ></chartjsDoughnutChart>
              </div>
            </div>

            <!-- 현황 -->
            <ul class="pl-link-list type-noclick is-mt-l">
              <li v-for="item in MONITOR" :key="item.id">
                <span class="pl-link-list-title">{{ item.title }}</span>
                <strong
                  class="ml-auto text-subtitle-1 font-weight-bold">
                  {{ mixin_convertNumToComma(item.count) }}
                  <sub style="bottom: 0">{{ item.unit }}</sub></strong>
              </li>
            </ul>
            <div class="d-flex justify-space-between align-center is-mt-m px-2">
              <strong>상담 직원</strong>
              <strong class="text-subtitle-1 font-weight-bold">
                {{ mixin_convertNumToComma(MONITOR_MANAGER) }} <sub style="bottom: 0">명</sub>
              </strong>
            </div>
          </div>
        </div>
        <!-- right -->
        <div class="is-vrt">
          <div class="pl-card">
            <!-- 날짜별 처리 현황 chart -->
            <div class="pl-stat-doughnut-chart is-noborder">
              <h2 class="pl-subtit is-inform">날짜별 처리 현황</h2>
              <div class="pl-cols">
                <!-- chart -->
                <chartjsBarChart
                class="is-mt-m h200 px-4"
                :chartData="BarData"
                :chartOptions="BarOptions"
                :styles="{ background: '#fff' }"
              ></chartjsBarChart>
              </div>
            </div>

            <!-- 날짜별 현황 grid -->
            <div class="pl-grid-top is-mt-l">
              <div class="pl-grid-top-left">
                <h2 class="pl-subtit">날짜별 현황</h2>
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter">전체 <em class="pl-1">({{ gridDataText.length }})</em> 건</span>
                <!-- 엑셀 다운로드 버튼 -->
                <compo-excel
                  TypeProp="Download"
                  :DataHeaderProp="gridDataHeaders"
                  :DataBodyProp="gridDataText"
                  :FileNameProp="SCH_TERM_TXT+' 날짜별_통계_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
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
              <template v-slot:item.COMPLETED_RATE="{ item }">
                {{ item.COMPLETED_RATE }}<template v-if="!!item.COMPLETED_RATE">%</template>
              </template>
              <template slot="footer">
                <div class="pl-grid-sum">
                  <table >
                    <colgroup>
                      <col v-for="(col, index) in gridDataHeaders" :key="index" :width=col.width />
                    </colgroup>
                    <tbody >
                      <tr>
                        <td class="pl-grid-sum-head text-center">합계</td>
                        <td class="text-center">
                          {{ mixin_convertNumToComma(mixin_sum_field(this.gridDataText, "TOT_CNT")) }}
                        </td>
                        <td class="text-center">
                          {{ mixin_convertNumToComma(mixin_sum_field(this.gridDataText, "COMPLETED_CNT")) }}
                        </td>
                        <td class="text-center">
                          {{ mixin_convertNumToComma(mixin_sum_field(this.gridDataText, "NOT_COMPLETED_CNT")) }}
                        </td>
                        <td class="text-center">
                          {{ mixin_convertNumToComma(mixin_sum_field(this.gridDataText, "DAY_AVG_CNT")) }}
                        </td>
                        <td class="text-center">
                          {{ mixin_sum_field(this.gridDataText, "TOT_CNT")>0?((mixin_sum_field(this.gridDataText, "COMPLETED_CNT")/mixin_sum_field(this.gridDataText, "TOT_CNT"))*100).toFixed(2):0 }} %
                        </td>
                        <td class="text-center">
                          {{ mixin_convertNumToComma(convertSecToTxt(mixin_sum_field(this.gridDataText, "TOT_PHN_HR"))) }}
                        </td>
                        <td class="text-center">
                          {{ mixin_convertNumToComma(convertSecToTxt(mixin_sum_field(this.gridDataText, "DAY_AVG_PHN_HR"))) }}
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
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale, LineController } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale, LineController)


export default {
  name: "MENU_STA_M0104", //name은 'MENU_' + 파일명 조합
  components: {
    chartjsDoughnutChart,
    chartjsBarChart
  },
  data() {
    return {
      common_code: [],

      // top search
      SCH_CALL_TP: '', //콜 유형 검색
      SCH_ST_DT: '', //검색 시작 일자
      SCH_END_DT: '', //검색 종료 일자

      ST_DT: '', //시작일
      END_DT: '', //종료일
      SCH_TERM_TXT: '',

      startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      endDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      // Doughnut chart
      DonughtData: {
        labels: ["인바운드", "아웃바운드",],
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

      // 현황
      MONITOR: [
        {title: '총 상담 건수', count: 0, unit: '건' },
        { title: '처리 건수', count: 0, unit: '건' },
        { title: '미처리 건수', count: 0, unit: '건' },
        { title: '처리율', count: 0, unit: '%' },
      ],
      MONITOR_MANAGER: 0,

      // 날짜별 처리 현황 chart
      BarData: {
        labels: [],
        datasets: [
          // line
          {
            type: 'line',
            label: '처리 건수',
            data: [],
            noData: false,
            tension: 0.4,
            cubicInterpolationMode: "monotone",
            pointStyle: "circle",
            pointRadius: 4,
            pointHoverRadius: 8,
            borderColor: "rgba(255, 127 ,39, 0.5)",
            backgroundColor: "rgba(255, 127 ,39, 1)",
          },
          // bar
          {
            label: "상담 건수",
            backgroundColor: '#4786E3',
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
            display: true,
            position: 'bottom',
          }
        },
      },

      // 날짜별 현황 grid
      gridDataHeaders: [
        { text: '날짜', align: 'left', value: 'CUTT_YMD',  width: '200px', sortable: false},
        { text: "상담 건수", align: "center", value: "TOT_CNT", sortable: false},
        { text: "처리 건수", align: "center", value: "COMPLETED_CNT", sortable: false},
        { text: "미처리 건수", align: "center", value: "NOT_COMPLETED_CNT",  sortable: false},
        { text: "일평균 처리 건수", align: "center", value: "DAY_AVG_CNT", sortable: false},
        { text: "처리율", align: "center", value: "COMPLETED_RATE", sortable: false},
        { text: "총 상담시간", align: "center", value: "CONVERT_TOT_PHN_HR", sortable: false},
        { text: "일평균 상담시간", align: "center", value: "CONVERT_DAY_AVG_PHN_HR", sortable: false},
      ],
      gridDataText: [],

      //confirm alert 메시지
      MESSAGE : {
        ALERT : {
          DAY_CHK : {alertDialogToggle: true, msg: '일자별 통계는 최대 1개월에 대한 데이터만 제공 합니다.<br> 검색 조건을 변경해 주세요.', iconClass: 'is-caution', type: 'default'}
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

  beforeDestroy(){
    this.$eventBus.$off("selCompanyAction"); //eventBus 중복방지를 위해 off
  },

  async created() {
    //상단 고객사 선택시 eventBus 실행(각 페이지별 필요에 의한 내용 구현)
    this.$eventBus.$on("selCompanyAction", (SELECTED_COMPANY) => {
      // console.log(`${this.$options.name} : =====>`, SELECTED_COMPANY.CD_NM);
    });

    //공통코드설정
    let codeName = ['CALL_TP'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    this.SCH_ST_DT = this.$moment(this.startDate).subtract(1,'month').format('YYYY-MM-DD'); // 시작 일자(한달전)
    this.SCH_END_DT = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); // 종료 일자

    this.phoneCuttDailyStatistics();//일자별 통계 조회
  },

  mounted() {

  },

  methods: {
    //일자별 통계 조회
    async phoneCuttDailyStatistics() {

      if(this.SCH_END_DT.replace(/-/gi, '') > this.$moment(this.SCH_ST_DT).subtract(-1,'month').format('YYYYMMDD')
        || this.SCH_ST_DT.replace(/-/gi, '') < this.$moment(this.SCH_END_DT).subtract(1,'month').format('YYYYMMDD')
      ){
        this.showAlert(this.MESSAGE.ALERT.DAY_CHK);
        return;
      }

      this.ST_DT = this.SCH_ST_DT;
      this.END_DT = this.SCH_END_DT;

      this.SCH_TERM_TXT = this.ST_DT + ' ~ ' + this.END_DT;

      //날짜별 현황 초기화
      this.gridDataText = [];

      //콜 유형별 현황 초기화
      let DonughtData = this.DonughtData;
      DonughtData.datasets[0].data = [];

      //날짜별 처리 현황 초기화
      let BarData = this.BarData;
      BarData.labels = [];
      BarData.datasets[0].data = [];
      BarData.datasets[1].data = [];

      let sUrl = '/api/statistics/phone/phoneCuttDailyStatistics';
      let postParam = {
        CL_TYPE_CD : this.SCH_CALL_TP
        , SCH_GB : 'DAY'
        , SCH_ST_DT : this.SCH_ST_DT.replace(/-/gi, '')
        , SCH_END_DT : this.SCH_END_DT.replace(/-/gi, '')
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
          this.MONITOR.forEach((stat, idx) => {
            if(idx === 0) stat.count = data.TOT_CNT; //총 상담 건수
            else if(idx === 1) stat.count = data.COMPLETED_CNT; //처리 건수
            else if(idx === 2) stat.count = data.NOT_COMPLETED_CNT; //미처리 건수
            else if(idx === 3) stat.count = data.COMPLETED_RATE; //처리율
          });

          this.MONITOR_MANAGER = data.CUSL_CNT;
        }

        //콜 유형별 현황
        let iCnt = 0;
        if(response.CL_TYPE_DATA.length > 0){
          response.CL_TYPE_DATA.forEach((val) => {
            DonughtData.datasets[0].data.push(val.TOT_CNT);

            if(val.TOT_CNT > 0) iCnt++;
          });

          if(iCnt > 0) DonughtData.datasets[0].noData = false;
          else DonughtData.datasets[0].noData = true;
        }else{
          DonughtData.datasets[0].noData = true;
        }

        //날짜별 현황
        if(response.DAILY_DATA.length > 0){
          let iCnt = 0;
          let iCnt2 = 0;
          response.DAILY_DATA.forEach((data, idx) => {
            BarData.labels.push(this.mixin_convertDate(data.CUTT_YMD, 'MM-dd'));
            data.CUTT_YMD = this.mixin_convertDate(data.CUTT_YMD, 'yyyy-MM-dd');

            data.CONVERT_TOT_PHN_HR = this.convertSecToTxt(data.TOT_PHN_HR);
            data.CONVERT_DAY_AVG_PHN_HR = this.convertSecToTxt(data.DAY_AVG_PHN_HR);

            BarData.datasets[0].data.push(data.COMPLETED_CNT); //처리건수
            BarData.datasets[1].data.push(data.TOT_CNT); //상담 건수

            if(data.COMPLETED_CNT > 0) iCnt++;
            if(data.TOT_CNT > 0) iCnt2++;

            if(iCnt > 0) BarData.datasets[0].noData = false;
            else BarData.datasets[0].noData = true;

            if(iCnt2 > 0) BarData.datasets[1].noData = false;
            else BarData.datasets[1].noData = true;


            data.TOT_CNT = this.mixin_convertNumToComma(data.TOT_CNT);
            data.COMPLETED_CNT = this.mixin_convertNumToComma(data.COMPLETED_CNT);
            data.NOT_COMPLETED_CNT = this.mixin_convertNumToComma(data.NOT_COMPLETED_CNT);
            data.DAY_AVG_CNT = this.mixin_convertNumToComma(data.DAY_AVG_CNT);
            data.CONVERT_TOT_PHN_HR = this.mixin_convertNumToComma(data.CONVERT_TOT_PHN_HR);
            data.CONVERT_DAY_AVG_PHN_HR = this.mixin_convertNumToComma(data.CONVERT_DAY_AVG_PHN_HR);
          });

          this.gridDataText = response.DAILY_DATA;
        }else{
          BarData.datasets[0].noData = true;
          BarData.datasets[1].noData = true;
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