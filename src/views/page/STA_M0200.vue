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
                  v-model="SCH_YEAR"
                  class="pl-form"
                  :items="YEAR_LIST"
                  placeholder="선택하세요"
                ></v-select>
                <v-select
                  v-model="SCH_PLAN_SE_CD"
                  class="pl-form is-lg"
                  :items="mixin_common_code_get(this.common_code, 'CMPN_CL', '전체')"
                  placeholder="선택하세요"
                ></v-select>
              </div>
            </div>

            <v-btn class="pl-btn is-icon" @click="phoneCuttCpiStatistics">
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
            <div class="pl-cols">
              <!-- 캠페인 유형별 현황 차트 -->
              <div class="pl-stat-doughnut-chart">
                <h2 class="pl-subtit">캠페인 유형별 현황</h2>
                <chartjsDoughnutChart
                  class="is-mt-l h200"
                  :chartData="DonughtData"
                  :chartOptions="DonughtOptions"
                  :height="200"
                  :styles="{ background: '#fff' }"
                ></chartjsDoughnutChart>
              </div>
              <!-- 캠페인 타겟 현황 바 차트 -->
              <div class="pl-stat-bar-chart ml-10">
                <h2 class="pl-subtit d-flex">캠페인 타겟 현황
                  <span class="pl-counter ml-auto">(단위 : {{cpiTargetCustCnt}} 명)</span>
                </h2>
                <chartjsBarChart
                  class="is-mt-l h200 px-4"
                  :chartData="BarData"
                  :chartOptions="BarOptions"
                  :height="200"
                  :styles="{ background: '#fff' }"
                ></chartjsBarChart>
              </div>

            </div>
            <!-- 캠페인 현황 grid -->
            <div class="pl-grid-top is-mt-l">
              <div class="pl-grid-top-left">
                <h2 class="pl-subtit">캠페인 현황 <span class="is-txt-main">(전체)</span></h2>
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
                <!-- 엑셀 다운로드 버튼 -->
                <compo-excel
                  TypeProp="Download"
                  :DataHeaderProp="headers"
                  :DataBodyProp="items"
                  :FileNameProp="'캠페인 현황_통계_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                  SheetNameProp="캠페인 현황"
                  HeaderColorProp="00B0F0"
                ></compo-excel>
              </div>
            </div>
            <v-data-table
              class="pl-grid"
              :headers="headers"
              :items="items"
              fixed-header
              item-key="index"
              height="310px"
              :items-per-page="-1"
              hide-default-footer
              :item-class="isActiveRow"
              @click:row="rowSelect"
              no-data-text="등록된 데이터가 없습니다."
              >
              <template v-slot:item.PRGRS_RATE ="{ item }">
                {{ item.PRGRS_RATE }}%
              </template>
            </v-data-table>

          </div>
        </div>
        <!-- right -->
        <div class="is-col-fix is-vrt" style="width: 810px">
          <div class="pl-card">
            <h2 class="pl-subtit is-inform">{{ SCH_TERM_TXT }}</h2>
            <div class="pl-cols is-mt-m">
              <ul class="pl-list-info5" >
                <li
                  v-for="item in CAMPAIGN_STATUS.monitor"
                  :key="item.id"
                  >
                  <span class="pl-list-info-title">
                    {{ item.title }}
                  </span>
                  <strong class="pl-list-info-desc" >
                    {{ mixin_convertNumToComma(item.count) }}
                  </strong>
                </li>
              </ul>
              <div class="ml-10">
                <chartjsBarChart
                  class="is-mt-l h200"
                  :chartData="BarData2"
                  :chartOptions="BarOptions2"
                  :height="200"
                  :styles="{ background: '#fff' }"
                ></chartjsBarChart>
              </div>
            </div>
            <!-- 진행 결과별 현황 grid -->
            <div class="pl-grid-top" style="margin-top: 38px;">
              <div class="pl-grid-top-left">
                <h2 class="pl-subtit">진행 결과별 현황</h2>
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter">전체 <em class="pl-1">({{ items2.length }})</em> 건</span>
                <!-- 엑셀 다운로드 버튼 -->
                <compo-excel
                  TypeProp="Download"
                  :DataHeaderProp="headers2"
                  :DataBodyProp="items2"
                  :FileNameProp="SCH_TERM_TXT+' 진행결과_통계_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                  HeaderColorProp="00B0F0"
                ></compo-excel>
              </div>
            </div>
            <v-data-table
              class="pl-grid is-rowspan"
              :headers="headers2"
              :items="items2"
              fixed-header
              item-key="index"
              height="310px"
              :items-per-page="-1"
              hide-default-footer
              no-data-text="등록된 데이터가 없습니다."
              >
              <template v-slot:item.RATE ="{ item }">
                {{ item.RATE }}%
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
name:"MENU_STA_M0200", //name은 'MENU_' + 파일명 조합
components: {
  chartjsBarChart,
  chartjsDoughnutChart
},
data() {
   return {
    common_code: [],

    // top search
    SCH_YEAR: '', //년도 검색
    SCH_PLAN_SE_CD: '', //캠페인 계획 구분 검색

    YEAR_LIST: [],

    YEAR: '', //년도

    SCH_TERM_TXT : '선택된 캠페인 없음.',

    // 캠페인 유형별 현황 doughnut chart
    DonughtData: {
      labels: ["정기 캠페인", "특별 캠페인", "수시 캠페인",],
      datasets: [
        {
          backgroundColor: ['#8591E1', '#FAA7A8', '#FFB72C', '#7FC379', '#4BC8F5'],
          data: [40, 20, 80],
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
            padding: 15,
            boxWidth: 10,
            usePointStyle: true,
            pointStyle: 'Rounded',
          },
        }
      },
    },

    // 캠페인 타켓 현황 bar chart
    BarData: {
      labels: ["정기 캠페인", "특별 캠페인", "수시 캠페인",],
      datasets: [
        {
          backgroundColor: '#4786e3',
          data: [30, 11,23],
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

    // 캠페인 현황 grid
    headers: [
      { text: '캠페인 명', value: 'CPI_NM', align: 'left', width: '', sortable: false},
      { text: '진행 기간', value: 'CPI_TERM', align: 'left', width: '180px', sortable: false },
      { text: '유형', value: 'PLAN_SE_NM', width: '140px', align: 'left', sortable: false},
      { text: '대상', value: 'CUST_CNT', align: 'center', width: '100px', sortable: false },
      { text: '상담 직원수', value: 'CUSL_CNT', align: 'center', width: '100px', sortable: false },
      { text: '진행률', value: 'PRGRS_RATE', align: 'center', width: '100px', sortable: false },
    ],
    items: [],

    selectedRow:null,

    // 2023년 특별 할인 캠페인 monitor
    CAMPAIGN_STATUS: {
      monitor: [
        { title: '총 시도 건수', count: 0 },
        { title: '평균 시도 건수', count: 0, },
        { title: '총 통화 시간', count: '0분 0초', },
        { title: '평균 통화 시간', count: '0분 0초' },
      ],
    },

    // 2023년 특별 할인 캠페인 chart
    BarData2: {
      labels: ["대상", "처리완료", "미시도",],
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
      borderRadius: 8,
      plugins: {
        legend: {
          display: false,
        }
      },
    },

    // 진행 결과별 현황 grid
    headers2: [
      { text: '진행 결과', value: 'CD_NM', align: 'left', width: '120px', sortable: false},
      { text: '비율', value: 'RATE',align: 'center', sortable: false},
      { text: '총 시도 건수', value: 'CNT', align: 'center', sortable: false, class: 'multiline-header' },
      { text: '평균 시도 건수', value: 'AVG_TRY_CNT', align: 'center', sortable: false, class: 'multiline-header' },
      { text: '총 통화 시간', value: 'PHN_HR', align: 'center', sortable: false, class: 'multiline-header' },
      { text: '평균 통화 시간', value: 'AVG_PHN_HR', align: 'center', sortable: false, class: 'multiline-header' },
    ],
    items2: [],

    cpiTargetCustCnt: 0,

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
    let codeName = ['CMPN_CL'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    let CURRENT_DATE = await this.mixin_getSvrDate("YYYY-MM-DD");
    let CURRENT_YEAR = parseInt(CURRENT_DATE.split('-')[0]);

    for (let i = -5; i < 5; i++) {
      let strYear = (CURRENT_YEAR + i).toString();
      this.YEAR_LIST.push({text: `${strYear}년`, value: strYear });
      if (i === 0 || i === 1) {
        this.YEAR_LIST.push({ text: `${strYear}년`, value: strYear });
      }
    }

    this.SCH_YEAR = CURRENT_YEAR.toString();

    this.phoneCuttCpiStatistics(); //캠페인 통계 조회
  },

  mounted() {

  },

  methods: {
    //캠페인 통계 조회
    async phoneCuttCpiStatistics() {
      let DonughtData = this.DonughtData;
      let BarData = this.BarData;

      this.clearLeftData(); //데이터 초기화
      this.clearRightData(); //데이터 초기화

      let sUrl = '/api/statistics/phone/phoneCuttCpiStatistics';
      let postParam = {
        CPI_YR : this.SCH_YEAR
        , PLAN_SE_CD :this.SCH_PLAN_SE_CD
        , PRGRS_STTS_CD : 'TERMIAT' //종료
      }

      let headParam = {
        head: {
          'SERVICE' : 'phone.campaign.plan.selectcpiplan',
          'METHOD' : 'selectcpiplan',
          'TYPE' : 'BIZ_SERVICE',
          'ROW_CNT' : 500,
          'PAGES_CNT' : 1,
          'PAGING' : "Y",
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        if(response.CPI_SE_DATA.length > 0){
          let iCnt = 0;
          let iCustCnt = 0;
          response.CPI_SE_DATA.forEach((val) => {
            DonughtData.labels.push(val.CD_NM);
            DonughtData.datasets[0].data.push(val.CUST_CNT);

            BarData.labels.push(val.CD_NM);
            BarData.datasets[0].data.push(val.CUST_CNT);

            iCustCnt = iCustCnt + Number(val.CUST_CNT);

            if(val.CUST_CNT > 0) iCnt++;
          });

          this.cpiTargetCustCnt = iCustCnt;

          if(iCnt > 0){
            DonughtData.datasets[0].noData = false;
            BarData.datasets[0].noData = false;
          }else{
            DonughtData.datasets[0].noData = true;
            BarData.datasets[0].noData = true;
          }
        }else{
          DonughtData.datasets[0].noData = true;
          BarData.datasets[0].noData = true;
        }

        if(response.DATA.length > 0){
          response.DATA.forEach((data) => {
            data.CPI_TERM = data.CPI_BGNG_DT + ' ~ ' + data.CPI_END_DT;
            if(Number(data.CUST_CNT) > 0) data.PRGRS_RATE = ((Number(data.CPI_TRY_CNT) / Number(data.CUST_CNT)) * 100).toFixed(2);
            else data.PRGRS_RATE = '0.00';

            data.CUST_CNT = this.mixin_convertNumToComma(data.CUST_CNT);
            data.CUSL_CNT = this.mixin_convertNumToComma(data.CUSL_CNT);
          });

          this.items = response.DATA;
          this.rowSelect(this.items[0]);
        }else{
          this.SCH_TERM_TXT = '선택된 캠페인 없음.';
          let BarData2 = this.BarData2;
          BarData2.datasets[0].noData = true;
        }
      }
    },

    //row 선택
    rowSelect(idx) {
      this.selectedRow = idx;
      this.phoneCuttCpiDtlStatistics(idx);
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    async phoneCuttCpiDtlStatistics(data) {
      this.SCH_TERM_TXT = data.CPI_NM;
      let BarData2 = this.BarData2;

      this.clearRightData(); //데이터 초기화

      let sUrl = '/api/statistics/phone/phoneCuttCpiDtlStatistics';
      let postParam = {
        CPI_ID : data.CPI_ID
      }

      let headParam = {
        head: {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        let iTotCnt = 0;
        let iTotPhnHr = 0;
        response.DATA.forEach((cpi) => {
          if(data.CUSL_CNT > 0) cpi.AVG_TRY_CNT = (cpi.CNT / data.CUSL_CNT).toFixed(2);
          else cpi.AVG_TRY_CNT = 0;

          let PHN_HR = cpi.PHN_HR;
          cpi.PHN_HR = this.mixin_convertNumToComma(this.convertSecToTxt(cpi.PHN_HR));

          if(data.CUSL_CNT > 0) cpi.AVG_PHN_HR = PHN_HR / data.CUSL_CNT;
          else cpi.AVG_PHN_HR = 0;

          let AVG_PHN_HR = cpi.AVG_PHN_HR;

          cpi.AVG_PHN_HR = this.mixin_convertNumToComma(this.convertSecToTxt(cpi.AVG_PHN_HR));

          iTotCnt += Number(cpi.CNT);
          iTotPhnHr += Number(PHN_HR);

          cpi.CNT = this.mixin_convertNumToComma(cpi.CNT);
        });

        this.items2 = response.DATA;

        this.CAMPAIGN_STATUS.monitor.forEach((monitor, idx) => {
          if(idx === 0) monitor.count = iTotCnt;
          else if(idx === 1) monitor.count = data.CUSL_CNT > 0?(iTotCnt/data.CUSL_CNT).toFixed(2):0;
          else if(idx === 2) monitor.count = this.convertSecToTxt(iTotPhnHr);
          else if(idx === 3) monitor.count = this.convertSecToTxt(data.CUSL_CNT > 0?iTotPhnHr/data.CUSL_CNT:0);
        });

        BarData2.datasets[0].data.push(data.CUST_CNT); //대상
        BarData2.datasets[0].data.push(data.COMPLETED_CNT); //처리완료
        BarData2.datasets[0].data.push(data.CUST_CNT - data.COMPLETED_CNT); //미시도

        let iCnt = 0;
        BarData2.datasets[0].data.forEach(data => {
          if(data > 0) iCnt++;
        });

        if(iCnt > 0) BarData2.datasets[0].noData = false;
        else BarData2.datasets[0].noData = true;
      }
    },

    clearLeftData() {
      this.items = [];

      //캠페인 유형별 현황 초기화
      let DonughtData = this.DonughtData;
      DonughtData.labels = [];
      DonughtData.datasets[0].data = [];

      //캠페인 타겟 현황 초기화
      let BarData = this.BarData;
      BarData.labels = [];
      BarData.datasets[0].data = [];
    },

    clearRightData() {
      this.items2 = [];

      this.CAMPAIGN_STATUS.monitor.forEach((monitor, idx) => {
        if(idx < 2) monitor.count = 0;
        else monitor.count = '0분 0초';
      });

      //캠페인 타겟 현황 초기화
      let BarData2 = this.BarData2;
      BarData2.datasets[0].data = [];
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
}
</script>

<style lang="scss" scoped>

</style>