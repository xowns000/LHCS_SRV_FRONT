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
                    placeholder="선택하세요"
                    :items="mixin_common_code_get(common_code, 'CHNL_CL','전체')"
                    v-model="SRCH_CHN_CLSF_CD"
                ></v-select>
              </div>
<!--              <span class="pl-label">-->
<!--                채널유형-->
<!--              </span>-->
              <div class="pl-desc">
<!--                <v-select-->
<!--                  class="pl-form"-->
<!--                  placeholder="선택하세요"-->
<!--                ></v-select>-->
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
<!--                    <compo-date-range-picker-->
<!--                      :StartDayProp.sync="startDate"-->
<!--                      :EndDayProp.sync="endDate"-->
<!--                      @startDayChange="mixin_testLog(startDate)"-->
<!--                      @endDayChange="mixin_testLog(endDate)"-->
<!--                    />-->
                    <compo-date-picker
                        v-model="startDate"
                        DateType="dateInput"
                        :DateProp.sync="startDate"
                    />
                    <span class="pl-unit">~</span>
                    <compo-date-picker
                        v-model="endDate"
                        DateType="dateInput"
                        :DateProp.sync="endDate"
                        :MinProp="dateMin()"
                    />
                  </div>
                </template>
              </div>
              <!-- 사용자명 -->
<!--              <span class="pl-label">-->
<!--                <v-select-->
<!--                  class="pl-form ml-2"-->
<!--                  placeholder="선택하세요"-->
<!--                ></v-select>-->
<!--              </span>-->
<!--              <div class="pl-desc">-->
<!--                &lt;!&ndash; 검색어 입력 &ndash;&gt;-->
<!--                <v-text-field-->
<!--                  class="pl-form"-->
<!--                  placeholder="검색어 입력"-->
<!--                ></v-text-field>-->
<!--              </div>-->
              <v-btn class="pl-btn is-icon" @click="getCuttTypeStatistics">
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
            </div>


          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <!-- 부서별 현황 grid -->
      <div class="pl-card">
        <div class="pl-grid-top">
          <div class="pl-grid-top-left">
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
          class="pl-grid "
          :headers="headersRowSpan"
          :items="itemsRowSpan"
          fixed-header
          item-key="index"
          height="580px"
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
                <th rowspan="2" width="140px" class="text-center"><span>채널분류</span></th>
                <th colspan="4" width="500px" class="text-center"><span>문의유형</span></th>
                <th rowspan="3" width="90px" class="text-center"><span>상담요청</span></th>
                <th rowspan="2" width="90px" class="text-center"><span>고객포기</span></th>
                <th rowspan="2" width="90px" class="text-center"><span>BUSY</span></th>
                <th colspan="7" width="" class="text-center"><span>상담진행</span></th>
              </tr>
              <tr>
                <th class="text-center"><span>1LEVEL</span></th>
                <th class="text-center"><span>2LEVEL</span></th>
                <th class="text-center"><span>3LEVEL</span></th>
                <th class="text-center"><span>4LEVEL</span></th>
                <th class="text-center"><span>총상담처리</span></th>
                <th class="text-center"><span>상담중</span></th>
                <th class="text-center"><span>후처리</span></th>
                <th class="text-center"><span>전달</span></th>
                <th class="text-center"><span>상담완료</span></th>
                <th class="text-center"><span>총상담시간</span></th>
                <th class="text-center" style="white-space: nowrap;"><span>평균상담시간</span></th>
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
                    <td colspan="6" class="pl-grid-sum-head text-center">합계</td>
                    <td class="text-center">
                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "CUSL_CNT")) }}
                    </td>
                    <td class="text-center">
                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "GIVEUP_CNT")) }}
                    </td>
                    <td class="text-center">
                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "BUSY_CNT")) }}
                    </td>
                    <td class="text-center">
                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "TOT_PRCS_CNT")) }}
                    </td>
                    <td class="text-center">
                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "ING_CNT")) }}
                    </td>
                    <td class="text-center">
                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "AFTPRCS_CNT")) }}
                    </td>
                    <td class="text-center">
                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "TRAN_CNT")) }}
                    </td>
                    <td class="text-center">
                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "CMPL_CNT")) }}
                    </td>
                    <td class="text-center">
                      {{ mixin_isEmpty(this.itemsRowSpan.CUTT_HR)?'0': mixin_date_sum_field(this.itemsRowSpan, "CUTT_HR") }}
                    </td>
                    <td class="text-center">
                      {{ mixin_isEmpty(this.itemsRowSpan.AVG_CUTT_HR)? '0': mixin_date_avg_field(this.itemsRowSpan, "AVG_CUTT_HR") }}
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
  name: "MENU_STA_M0302", //name은 'MENU_' + 파일명 조합
  components: {
    chartjsDoughnutChart
  },
  data() {
    return {
      DEPT_CUSL_TXT : '부서별',

      nowDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      startDate: this.$moment(this.nowDate).subtract(7,'days').format('YYYY-MM-DD'),
      endDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      SRCH_CHN_CLSF_CD: '', // 채널분류코드

      SCH_TERM_TXT: '',
      // top search
      SCH_ST_DT: this.startDate, //검색 시작 일자
      SCH_END_DT: this.endDate, //검색 종료 일자
      SCH_YEAR: '', //년도 검색
      SCH_MONTH: '', //월 검색
      SCH_QUARTER: '', //분기 검색

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

      datePeriod: 1, //일/월/분기 구분
      STATISTICS_ST: 'DEPT', //부서/개인 구분
      datePeriod_st: 1, //일/월/분기 구분

      YEAR_LIST: [],
      MONTH_LIST: [],
      QUARTER_LIST: [],

      common_code:[],

      YEAR: '', //년도
      MONTH: '', //월
      QUARTER: '', //분기
      ST_DT: '', //시작일
      END_DT: '', //종료일


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
      DonughtData: {
        labels: ["카카오톡-알림톡", "티톡-채팅", "게시판문의-채팅", "네이버톡톡"],
        datasets: [
          {
            backgroundColor: ['#8591E1', '#733A8D', '#4BC8F5', '#03c75a'],
            data: [40, 20, 5, 6],
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
              padding: 10,
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
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px' },
        { text: '채널분류', align: "left", value: 'CHN_NM', width: '140px',sortable: false},
        { text: "1LEVEL", align: "left", value: "LV1",  width: '125px' ,sortable: false},
        { text: "2LEVEL", align: "left", value: "LV2",  width: '125px' ,sortable: false},
        { text: "3LEVEL", align: "left", value: "LV3",  width: '125px' ,sortable: false},
        { text: "4LEVEL", align: "left", value: "LV4",  width: '125px' ,sortable: false},
        { text: "상담요청", align: "center", value: "CUSL_CNT",  width: '90px' ,sortable: false},
        { text: "고객포기", align: "center", value: "GIVEUP_CNT",  width: '90px' ,sortable: false},
        { text: "BUSY", align: "center", value: "BUSY_CNT",  width: '90px' ,sortable: false, },
        { text: "총상담처리", align: "center", value: "TOT_PRCS_CNT",  width: '' ,sortable: false, },
        { text: "상담중", align: "center", value: "ING_CNT",  width: '' ,sortable: false,},
        { text: "후처리", align: "center", value: "AFTPRCS_CNT",  width: '' ,sortable: false,},
        { text: "전달", align: "center", value: "TRAN_CNT",  width: '' ,sortable: false, },
        { text: "상담완료", align: "center", value: "CMPL_CNT",  width: '' ,sortable: false, },
        { text: "총 상담시간", align: "center", value: "CUTT_HR",  width: '' ,sortable: false, },
        { text: "평균 상담시간", align: "center", value: "AVG_CUTT_HR",  width: '' ,sortable: false, },
      ],
      itemsRowSpan: [
        {
          index: 1,
          type01: '카카오톡',
          type02: '문의레벨1',
          type03: '문의레벨2',
          type04: '문의레벨3',
          type05: '문의레벨4',
          type06: '00',
          type07: '00',
          type08: '00',
          type09: '00',
          type10: '00',
          type11: '00',
          type12: '00',
          type13: '00',
          type14: '00:00:00',
          type15: '00:00:00',
        }
      ],

    }
  },
  async created() {

    this.$eventBus.$on("selCompanyAction", (SELECTED_COMPANY) => {
    });

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

    let CURRENT_QUARTER;
    this.QUARTER_CHECK.forEach((quarter, idx) => {
      if(quarter.MONTH === parseInt(CURRENT_MONTH)) CURRENT_QUARTER = quarter.QUARTER;
    });

    this.SCH_QUARTER = CURRENT_QUARTER.toString();

  },
  mounted() {
    this.getCuttTypeStatistics();
  },
  beforeDestroy(){
    this.$eventBus.$off("selCompanyAction"); //eventBus 중복방지를 위해 off
  },
  methods: {
    //상담시간 모니터링 시간 표시
    displayTimeUnit(index) {
      let sTotUnitWord = ['시간','분','초'];

      return sTotUnitWord[index];
    },

    async getCuttTypeStatistics() {
      this.YEAR = this.SCH_YEAR;
      this.MONTH = this.SCH_MONTH;
      this.QUARTER = this.datePeriod;
      this.ST_DT = this.SCH_ST_DT;
      this.END_DT = this.SCH_END_DT;

      this.itemsRowSpan = [];

      let sUrl = '/api/statistics/chat/counsel-by-inqire-type/selectByInqryType';
      let postParam = {
        SRCH_CHN_CLSF_CD : this.SRCH_CHN_CLSF_CD
        , SCH_GB : this.datePeriod === 0? 'DAY':this.datePeriod === 1? 'MONTH': 'QUARTER'
        , SCH_YEAR : this.SCH_YEAR
        , SCH_MONTH : this.SCH_MONTH
        , SCH_ST_DT : this.startDate.replace(/-/gi, '')
        , SCH_END_DT : this.endDate.replace(/-/gi, '')
        , SCH_QUARTER : this.SCH_QUARTER
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){

        /* 조회 데이터 가공 영역 */
        if(response.CNT_DATA){

          this.itemsRowSpan = [];

          if(!this.mixin_isEmpty(response.CNT_DATA)){

            /* 문의유형 level */
            response.CNT_DATA.map((cntData)=>{
                response.QSTN_DATA.map((item)=> {
                  if(cntData.QSTN_TYPE_ID == item.QSTN_TYPE_ID){
                  // console.log(item.SORT.split(' > ')+' '+item.SORT.split(' > ').length + ' ' +item.QSTN_TYPE_NM + ' ' + item.QSTN_TYPE_ID)
                    let lvArr = []
                    lvArr = item.SORT.split(' > ');
                    let tempObjLv1 = '';
                    let tempObjLv2 = '';
                    let tempObjLv3 = '';
                    switch(lvArr.length){
                          case 1:
                            cntData["LV1"] = item.QSTN_TYPE_NM;
                            break;
                          case 2:
                            cntData["LV2"] = item.QSTN_TYPE_NM;
                            tempObjLv1 = response.QSTN_DATA.find((x)=>{if(item.UP_QSTN_TYPE_ID === x.QSTN_TYPE_ID) return x.QSTN_TYPE_NM});
                            cntData["LV1"] = tempObjLv1.QSTN_TYPE_NM;
                            break;
                          case 3:
                            cntData["LV3"] = item.QSTN_TYPE_NM;
                            tempObjLv2 = response.QSTN_DATA.find((x)=>{if(item.UP_QSTN_TYPE_ID === x.QSTN_TYPE_ID) return x.QSTN_TYPE_NM});
                            cntData["LV2"] = tempObjLv2.QSTN_TYPE_NM;
                            cntData["LV1"] = response.QSTN_DATA.find((x)=>{if(tempObjLv2.UP_QSTN_TYPE_ID === x.QSTN_TYPE_ID) return x.QSTN_TYPE_NM}).QSTN_TYPE_NM;
                            break;
                          case 4:
                            cntData["LV4"] = item.QSTN_TYPE_NM;
                            tempObjLv3 = response.QSTN_DATA.find((x)=>{if(item.UP_QSTN_TYPE_ID === x.QSTN_TYPE_ID) return x.QSTN_TYPE_NM});
                            cntData["LV3"] = tempObjLv3.QSTN_TYPE_NM;
                            tempObjLv2 = response.QSTN_DATA.find((x)=>{if(tempObjLv3.UP_QSTN_TYPE_ID === x.QSTN_TYPE_ID) return x.QSTN_TYPE_NM})
                            cntData["LV2"] = tempObjLv2.QSTN_TYPE_NM;
                            cntData["LV1"] = response.QSTN_DATA.find((x)=>{if(tempObjLv2.UP_QSTN_TYPE_ID === x.QSTN_TYPE_ID) return x.QSTN_TYPE_NM}).QSTN_TYPE_NM;
                            break;
                        }
                  }
                });
              });
          }
          let cntDataLength = response.CNT_DATA.length;

          if(!this.mixin_isEmpty(cntDataLength)){
            for(let i = 0; i<cntDataLength; i++){
              response.CNT_DATA[i].CUTT_HR =  this.mixin_seconds_toHHMMSS(response.CNT_DATA[i].CUTT_HR);
              response.CNT_DATA[i].AVG_CUTT_HR =  this.mixin_seconds_toHHMMSS(Math.round(response.CNT_DATA[i].AVG_CUTT_HR));
            }
          }
          this.itemsRowSpan = response.CNT_DATA
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
    dateMin() {
      const minDate = new Date(
          new Date(this.startDate).setDate(new Date(this.startDate).getDate()) -
          new Date().getTimezoneOffset() * 60000
      )
          .toISOString().substr(0, 10);
      return minDate;
    },
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>