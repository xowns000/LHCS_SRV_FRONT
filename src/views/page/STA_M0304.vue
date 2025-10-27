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
                    :DateProp.sync="SCH_END_DT"
                    :MinProp="dateMin()"
                  />
                  <!-- <compo-drop-picker
                    :StartDateProp.sync="date2"
                    :EndDateProp.sync="date3"
                  /> -->
                </div>
              </div>
            </div>
            <v-btn class="pl-btn is-icon" @click="chatCuttDateStatistics()">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card">
        <!-- 일자별 현황 -->
        <div class="pl-stat-bar-chart is-noborder">
          <h2 class="pl-subtit d-flex">일자별 현황</h2>
          <chartjsLineChart
            class="is-mt-m h200 px-4"
            :chartData="LineData"
            :chartOptions="LineOptions"
            :styles="{ background: '#fff' }"
          ></chartjsLineChart>
        </div>
        <!-- 일자별 현황 grid -->
        <div class="pl-grid-top is-mt-m">
          <div class="pl-grid-top-left">
            <h2 class="pl-subtit"></h2>
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
          hide-default-header
          item-key="index"
          height="320px"
          :items-per-page="-1"
          hide-default-footer
          no-data-text="등록된 데이터가 없습니다."
        >
          <template v-slot:header>
            <thead class="v-data-table-header multi-row">
              <tr>
                <th rowspan="2" width="80px" class="text-center"><span>번호</span></th>
                <th rowspan="2" width="90px" class="text-center"><span>상담일자</span></th>
                <th rowspan="2" width="90px" class="text-center"><span>상담요청</span></th>
                <th colspan="4" width="360px" class="text-center"><span>고객포기</span></th>
                <th colspan="4" width="360px" class="text-center"><span>BUSY</span></th>
                <th colspan="3" width="270px" class="text-center"><span>상담진행</span></th>
                <th rowspan="2" width="80px" class="text-center"><span>상담<br>응대율(%)</span></th>
                <th colspan="4" width="" class="text-center"><span>평균시간</span></th>
              </tr>
              <tr>
                <th class="text-center" style="white-space: nowrap;"><span>상담요청중<br>포기</span></th>
                <th class="text-center" style="white-space: nowrap;"><span>상담배정중<br>포기</span></th>
                <th class="text-center" style="white-space: nowrap;"><span>상담대기중<br>포기</span></th>
                <th class="text-center" style="white-space: nowrap;"><span>전달대기중<br>포기</span></th>
                <th class="text-center" style="white-space: nowrap;"><span>상담요청<br>불가</span></th>
                <th class="text-center" style="white-space: nowrap;"><span>상담배정<br>불가</span></th>
                <th class="text-center" style="white-space: nowrap;"><span>상담요청<br>미선택</span></th>
                <th class="text-center" style="white-space: nowrap;"><span>상담사<br>배정불가</span></th>

                <th class="text-center" style="white-space: nowrap;"><span>총상담처리</span></th>
                <th class="text-center" style="white-space: nowrap;"><span>상담</span></th>
                <th class="text-center" style="white-space: nowrap;"><span>전달</span></th>
                <th class="text-center" style="white-space: nowrap;"><span>배정시간</span></th>
                <th class="text-center" style="white-space: nowrap;"><span>상담시간</span></th>
                <th class="text-center" style="white-space: nowrap;"><span>후처리시간</span></th>
                <th class="text-center" style="white-space: nowrap;"><span>처리시간</span></th>
              </tr>
            </thead>
          </template>
          <template slot="footer">
            <div class="pl-grid-sum">
              <table >
                <colgroup>
                  <col v-for="(col, index) in gridDataHeaders" :key="index" :width=col.width />
                </colgroup>
                <tbody >
                  <tr>
                    <td colspan="2" class="pl-grid-sum-head text-center">합계(평균)</td>
                    <td class="text-center"> {{ mixin_convertNumToComma(mixin_sum_field(gridDataText, "TOT_CNT")) }} </td>
                    <td class="text-center"> {{ mixin_convertNumToComma(mixin_sum_field(gridDataText, "DMND_GIVEUP_CNT")) }} </td>
                    <td class="text-center"> {{ mixin_convertNumToComma(mixin_sum_field(gridDataText, "ALTMNT_GIVEUP_CNT")) }} </td>
                    <td class="text-center"> {{ mixin_convertNumToComma(mixin_sum_field(gridDataText, "WAIT_GIVEUP_CNT")) }} </td>
                    <td class="text-center"> {{ mixin_convertNumToComma(mixin_sum_field(gridDataText, "TRAN_WAIT_GIVEUP_CNT")) }} </td>
                    <td class="text-center"> {{ mixin_convertNumToComma(mixin_sum_field(gridDataText, "DMND_NPSBL_CNT")) }} </td>
                    <td class="text-center"> {{ mixin_convertNumToComma(mixin_sum_field(gridDataText, "ALTMNT_NPSBL_CNT")) }} </td>
                    <td class="text-center"> {{ mixin_convertNumToComma(mixin_sum_field(gridDataText, "DMND_NOCHC_CNT")) }} </td>
                    <td class="text-center"> {{ mixin_convertNumToComma(mixin_sum_field(gridDataText, "CUSL_ALTMNT_NPSBL_CNT")) }} </td>
                    <td class="text-center"> {{ mixin_convertNumToComma(mixin_sum_field(gridDataText, "CMPL_CNT")) }} </td>
                    <td class="text-center"> {{ mixin_convertNumToComma(mixin_sum_field(gridDataText, "CUTT_CNT")) }} </td>
                    <td class="text-center"> {{ mixin_convertNumToComma(mixin_sum_field(gridDataText, "TRAN_CNT")) }} </td>
                    <td class="text-center"> {{ mixin_sum_field(gridDataText, "TOT_CNT") == '0' ? '0' : Math.round(mixin_sum_field(gridDataText, "TOT_CUTT") / mixin_sum_field(gridDataText, "TOT_CNT") * 10000) / 100 }} </td>
                    <td class="text-center"> {{ mixin_date_avg_field(gridDataText, "NEW_ALTMNT_AVG_HR") }} </td>
                    <td class="text-center"> {{ mixin_date_avg_field(gridDataText, "NEW_CUTT_AVG_HR") }} </td>
                    <td class="text-center"> {{ mixin_date_avg_field(gridDataText, "NEW_AFTPRCS_AVG_HR") }} </td>
                    <td class="text-center"> {{ mixin_date_avg_field(gridDataText, "NEW_PRCS_AVG_HR") }} </td>
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
import chartjsLineChart from "@/components/chartjsLineChart";
  export default {
  name: "MENU_STA_M0304", //name은 'MENU_' + 파일명 조합
  components: {
    chartjsLineChart
  },
  data() {
    return {
      //공통코드
      common_code:[],

      SCH_ST_DT: this.$moment(this.startDate).subtract(1,'month').format('YYYY-MM-DD'), // 검색 시작 일자(한달전)
      SCH_END_DT: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), //검색 종료 일자

      // top search
      SCH_CHN_CLSF_CD: '', //채팅 채널 검색
      
      ST_DT : '',
      END_DT : '',

      SCH_TERM_TXT: '',

      // 일자별 현황 chart
      LineData: {
        datasets: [
          {
            data: [],
            noData: false,
          }
        ]
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

      // 날짜별 현황 grid
      gridDataHeaders: [
        { text: '번호', align: 'left', value: 'ROWNUM',  width: '80px', sortable: false},
        { text: "상담일자", align: "center", value: "CUTT_DT",  width: '90px', sortable: false},
        { text: "상담요청", align: "center", value: "TOT_CNT",  width: '90px', sortable: false},
        { text: "상담요청중 포기", align: "center", value: "DMND_GIVEUP_CNT",  width: '90px', sortable: false},
        { text: "상담배정중 포기", align: "center", value: "ALTMNT_GIVEUP_CNT",  width: '90px', sortable: false},
        { text: "상담대기중 포기", align: "center", value: "WAIT_GIVEUP_CNT",  width: '90px', sortable: false},
        { text: "전달대기중 포기", align: "center", value: "TRAN_WAIT_GIVEUP_CNT",  width: '90px', sortable: false},
        { text: "상담요청 불가", align: "center", value: "DMND_NPSBL_CNT",  width: '90px', sortable: false},
        { text: "상담배정 불가", align: "center", value: "ALTMNT_NPSBL_CNT",  width: '90px', sortable: false},
        { text: "상담요청 미선택", align: "center", value: "DMND_NOCHC_CNT",  width: '90px', sortable: false},
        { text: "상담사 배정불가", align: "center", value: "CUSL_ALTMNT_NPSBL_CNT",  width: '90px', sortable: false},
        { text: "총상담처리", align: "center", value: "CMPL_CNT",  width: '90px', sortable: false},
        { text: "상담", align: "center", value: "CUTT_CNT",  width: '90px', sortable: false},
        { text: "전달", align: "center", value: "TRAN_CNT",  width: '90px', sortable: false},
        { text: "상담응대율(%)", align: "center", value: "RSPNS_RATIO",  width: '80px', sortable: false},
        { text: "배정시간", align: "center", value: "NEW_ALTMNT_AVG_HR", sortable: false},
        { text: "상담시간", align: "center", value: "NEW_CUTT_AVG_HR", sortable: false},
        { text: "후처리시간", align: "center", value: "NEW_AFTPRCS_AVG_HR", sortable: false},
        { text: "처리시간", align: "center", value: "NEW_PRCS_AVG_HR", sortable: false},
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

  async created() {

    //공통코드설정
    let codeName = ['CHNL_CL'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    this.SCH_ST_DT = this.$moment(this.startDate).subtract(1,'month').format('YYYY-MM-DD'); // 시작 일자(한달전)
    this.SCH_END_DT = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); // 종료 일자

    this.chatCuttDateStatistics();//통계 조회
  },

  mounted() {
  },
  
  methods: {
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

    async chatCuttDateStatistics(){

      if(this.SCH_END_DT.replace(/-/gi, '') > this.$moment(this.SCH_ST_DT).subtract(-1,'month').format('YYYYMMDD')
        || this.SCH_ST_DT.replace(/-/gi, '') < this.$moment(this.SCH_END_DT).subtract(1,'month').format('YYYYMMDD')
      ){
        this.showAlert(this.MESSAGE.ALERT.DAY_CHK);
        return;
      }

      this.ST_DT = this.SCH_ST_DT;
      this.END_DT = this.SCH_END_DT;

      this.gridDataText = [];

      //초기화
      let LineData = {
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
      };

      let sUrl = '/api/statistics/chat/chatCuttDateStatistics';
      let postParam = {
        CHN_CLSF_CD : this.SCH_CHN_CLSF_CD
        , SCH_ST_DT : this.SCH_ST_DT.replace(/-/gi, '')
        , SCH_END_DT : this.SCH_END_DT.replace(/-/gi, '')
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
          for(let n=0;n<rsltLeng;n++){
            LineData.labels[n] = this.mixin_convertDate(response.DATA[n].CUTT_DT, 'MM-dd');
            LineData.datasets[0].data[n] = response.DATA[n].TOT_CNT
            
            if(response.DATA[n].TOT_CNT != '0'){
              iCnt++
            }
          }
          if(iCnt > 0) {
            LineData.datasets[0].noData = false;
          } else {
            LineData.datasets[0].noData = true;
          }
          this.LineData = LineData
        }

        let dateLeng = response.DATE_LIST.length
        if(dateLeng > 0){
          for(let n=0;n<dateLeng;n++){
            response.DATE_LIST[n]["TOT_CUTT"] = parseInt(response.DATE_LIST[n].CMPL_CNT) + parseInt(response.DATE_LIST[n].CUTT_CNT);
            response.DATE_LIST[n]["RSPNS_RATIO"] = response.DATE_LIST[n].TOT_CNT == 0 ? 0 : Math.round(((parseInt(response.DATE_LIST[n].CMPL_CNT) + parseInt(response.DATE_LIST[n].CUTT_CNT)) / response.DATE_LIST[n].TOT_CNT) * 10000)/100

            response.DATE_LIST[n].NEW_ALTMNT_AVG_HR = this.mixin_seconds_toHHMMSS(Math.round(response.DATE_LIST[n].ALTMNT_AVG_HR));  //평균배정 시간(응대 건수)
            response.DATE_LIST[n].NEW_CUTT_AVG_HR = this.mixin_seconds_toHHMMSS(Math.round(response.DATE_LIST[n].CUTT_AVG_HR));  //평균상담 시간(응대 건수)
            response.DATE_LIST[n].NEW_AFTPRCS_AVG_HR = this.mixin_seconds_toHHMMSS(Math.round(response.DATE_LIST[n].AFTPRCS_AVG_HR));  //평균후처리 시간(응대 건수)
            response.DATE_LIST[n].NEW_PRCS_AVG_HR = this.mixin_seconds_toHHMMSS(Math.round(response.DATE_LIST[n].PRCS_AVG_HR));  //평균처리 시간(응대 건수)
          }
          this.gridDataText = response.DATE_LIST;
        }
      }
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
  },
};
</script>

<style lang="scss" scoped>

</style>