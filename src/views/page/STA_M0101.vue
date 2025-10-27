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
                  v-model="SCH_YEAR"
                  class="pl-form"
                  :items="YEAR_LIST"
                  placeholder="선택하세요"
                ></v-select>
                <v-select
                  v-model="SCH_MONTH"
                  class="pl-form"
                  :items="MONTH_LIST"
                  placeholder="선택하세요"
                ></v-select>
              </div>
            </div>
            <v-btn class="pl-btn is-icon" @click="phoneCuttTotalStatistics">
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
          {{ YEAR }}년 {{ MONTH }}월 전화상담 현황<span class="is-txt-main">(전체)</span>
        </h2>
        <div class="d-flex">
          <!-- 상담건수 리스트 -->
          <ul class="pl-list-info4 is-mt-m" style="padding-right: 42px;">
            <li class="pl-list-icon"><v-icon class="pl-icon70 count"></v-icon></li>
            <li
              v-for="item in MONITOR.count"
              :key="item.id">
              <span class="pl-list-info-title mt-1">{{ item.text }}</span>
              <strong class="pl-list-info-desc" :class="item.class">
                {{ mixin_convertNumToComma(item.count) }}
                <sub v-if="item.unit" style="bottom: 0">{{ item.unit }}</sub>
              </strong>
            </li>
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
        <div class="pl-cols is-mt-l">
          <!-- 콜 유형별 현황 -->
          <div class="pl-stat-bar-chart col-3">
            <h2 class="pl-subtit d-flex">콜 유형별 현황</h2>
            <chartjsDoughnutChart
              class="is-mt-m h200"
              :chartData="DonughtData"
              :chartOptions="DonughtOptions"
              :height="200"
              :styles="{ background: '#fff' }"
            ></chartjsDoughnutChart>
            <!-- 차트 로더 컴포넌트 -->
          </div>
          <!-- 통화 시간별 추이 -->
          <div class="pl-stat-bar-chart ml-10">
            <h2 class="pl-subtit d-flex">통화 시간별 추이</h2>
            <chartjsBarChart
              class="is-mt-m h200 px-4"
              :chartData="BarData"
              :chartOptions="BarOptions"
              :styles="{ background: '#fff' }"
            ></chartjsBarChart>
          </div>
          <!-- 문의 유형별 현황 -->
          <div class="pl-stat-bar-chart ml-10 col-3">
            <h2 class="pl-subtit d-flex">상담 유형별 현황</h2>
            <chartjsBarChart
              class="is-mt-m h200 px-4"
              :chartData="BarData2"
              :chartOptions="BarOptions2"
              :styles="{ background: '#fff' }"
            ></chartjsBarChart>

          </div>

        </div>
        <!-- 월간 상담 추이 -->
        <div class="pl-stat-bar-chart is-noborder is-mt-m">
          <h2 class="pl-subtit d-flex">월간 상담 추이</h2>
          <chartjsLineChart
            class="is-mt-m h200 px-4"
            :chartData="LineData"
            :chartOptions="LineOptions"
            :styles="{ background: '#fff' }"
          ></chartjsLineChart>
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
  name: "MENU_STA_M0101", //name은 'MENU_' + 파일명 조합
  components: {
    chartjsLineChart,
    chartjsBarChart,
    chartjsDoughnutChart
  },
  data() {
    return {
      common_code: [],

      // top search
      SCH_CALL_TP: '', //콜 유형 검색
      SCH_YEAR: '', //년도 검색
      SCH_MONTH: '', //월 검색

      YEAR: '', //년도
      MONTH: '', //월

      YEAR_LIST: [],
      MONTH_LIST: [],

      // 현황
      MONITOR: {
        count: [
          { text: '총 상담 건수', icon: '', class: 'is-txt-main', count: 0, },
          { text: '처리 건수', icon: '', count: 0, },
          { text: '미처리 건수', icon: '', count: 0, },
          { text: '처리울', icon: '', count: 0, unit: '%' },
          { text: '1인당 상담건수', icon: '', count: 0, },
        ],
        time: [
          { text: '총 상담시간', icon: '', count: 0, class: 'is-txt-main', },
          { text: '1인당 상담시간', icon: '', count: 0, },
        ]
      },

      // 콜 유형별 현황 chart
      DonughtData: {
        labels: ["인바운드", "아웃바운드",],
        datasets: [
          {
            backgroundColor: ['#8591E1', '#FAA7A8', '#FFB72C', '#7FC379', '#4BC8F5'],
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

      // 통화 시간별 추이 chart
      BarData: {
        labels: [
          '30초 미만',
          '1분 미만',
          '2분 미만',
          '3분 미만',
          '4분 미만',
          '5분 미만',
          '7분 미만',
          '10분 미만',
          '10분 이상',
        ],
        datasets: [
          {
            backgroundColor: '#4786e3',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
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

      // 문의 유형별 현황 chart
      // MONITOR_CALL: [
      //   { title: '최고(2분 미만)', count: 0, unit: '건', },
      //   { title: '최저(4분 미만)', count: 0, unit: '건', },
      //   { title: '전체 평균', count: 0, unit: '건', }
      // ],
      BarData2: {
        labels: [
          '환불',
          '회원가입',
          '반품',
          '배송문의',
        ],
        datasets: [
          {
            // label: "인입호",
            backgroundColor: '#4786e3',
            data: [30, 11, 23, 40],
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
    let codeName = ['CALL_TP'];
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

    this.SCH_YEAR = CURRENT_YEAR.toString();
    this.SCH_MONTH = CURRENT_MONTH;

    this.phoneCuttTotalStatistics();//통계 조회
  },

  mounted() {

  },

  methods: {
    //통계 조회
    async phoneCuttTotalStatistics() {

      this.YEAR = this.SCH_YEAR;
      this.MONTH = this.SCH_MONTH;

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
      DonughtData.datasets[0].data = [];

      //통화 시간별 추이 초기화
      let BarData = this.BarData;
      BarData.datasets[0].data = [];

      //문의 유형별 현황 초기화
      let BarData2 = this.BarData2;
      BarData2.labels = [];
      BarData2.datasets[0].data = [];

      //월간 상담 추이 초기화
      let LineData = this.LineData;
      LineData.labels = [];
      LineData.datasets[0].data = [];

      let sUrl = '/api/statistics/phone/phoneCuttTotalStatistics';
      let postParam = {
        CL_TYPE_CD : this.SCH_CALL_TP
        , SCH_GB : 'MONTH'
        , CUTT_YMD : this.SCH_YEAR + this.SCH_MONTH
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
            if(idx === 0) stat.count = data.TOT_CNT; //총 상담 건수
            else if(idx === 1) stat.count = data.COMPLETED_CNT; //처리 건수
            else if(idx === 2) stat.count = data.NOT_COMPLETED_CNT; //미처리 건수
            else if(idx === 3) stat.count = data.COMPLETED_RATE; //처리율
            else if(idx === 4) stat.count = data.CUSL_AVG_CNT; //1인당 상담건수
          });

          this.MONITOR.time.forEach((stat, idx) => {
            if(idx === 0){//총 상담시간
              let sTotTime = this.mixin_seconds_toHHMMSS(data.TOT_PHN_HR);
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
              let sAvgTime = this.mixin_seconds_toHHMMSS(data.CUSL_AVG_PHN_HR);
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

        //콜 유형별 현황
        if(response.CL_TYPE_DATA.length > 0){
          let iCnt = 0;
          response.CL_TYPE_DATA.forEach((val) => {
            DonughtData.datasets[0].data.push(val.TOT_CNT);
            this.DonughtDataLoaded = true;
            if(val.TOT_CNT > 0) iCnt++;
          });

          if(iCnt > 0) DonughtData.datasets[0].noData = false;
          else DonughtData.datasets[0].noData = true;
        }else{
          DonughtData.datasets[0].noData = true;
        }

        //통화 시간별 추이
        if(response.PHN_HR_DATA.length > 0){
          let iCnt = 0;
          response.PHN_HR_DATA.forEach((time, idx) => {
            BarData.datasets[0].data.push(time.TOT_CNT);
            if(time.TOT_CNT > 0) iCnt++;
          });

          if(iCnt > 0) BarData.datasets[0].noData = false;
          else BarData.datasets[0].noData = true;
        }else{
          BarData.datasets[0].noData = true;
        }

        //문의 유형별 현황
        if(response.IVR_DATA.length > 0){
          let iCnt = 0;
          response.IVR_DATA.forEach((ivr, idx) => {
            BarData2.labels.push(ivr.DRWI_SE_NM);
            BarData2.datasets[0].data.push(ivr.TOT_CNT);
            if(ivr.TOT_CNT > 0) iCnt++;
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
      }
    },
    //상담시간 모니터링 시간 표시
    displayTimeUnit(index) {
      let sTotUnitWord = ['시간','분','초'];

      return sTotUnitWord[index];
    }
  },
};
</script>

<style lang="scss" scoped>

</style>