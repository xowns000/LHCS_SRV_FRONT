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
                  v-model="SCH_ENFC_SE_CD"
                  class="pl-form is-lg"
                  :items="ENFC_SE_CD_LIST"
                  placeholder="선택하세요"
                ></v-select>
              </div>
            </div>

            <v-btn class="pl-btn is-icon" @click="qaStatistics">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols flex-grow-1">
        <div class="is-vrt" >
          <div class="pl-card">
            <div class="pl-cols">
              <!-- 평가 유형별 현황 파이 차트 -->
              <div class="pl-stat-doughnut-chart">
                <h2 class="pl-subtit">평가 유형별 현황</h2>
                <chartjsDoughnutChart
                  class="is-mt-l h200"
                  :chartData="DonughtData"
                  :chartOptions="DonughtOptions"
                  :height="200"
                  :styles="{ background: '#fff' }"
                ></chartjsDoughnutChart>
              </div>
              <!-- 유형별 QA 평가 건수 바 차트 -->
              <div class="pl-stat-bar-chart ml-10">
                <h2 class="pl-subtit d-flex">유형별 QA 평가 건수
                  <span class="pl-counter ml-auto">(단위 : 상담 건수)</span>
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

            <!-- QA평가 현황 -->
            <div class="pl-grid-top is-mt-l">
              <div class="pl-grid-top-left">
                <h2 class="pl-subtit">QA 평가 현황 <span class="is-txt-main">(전체)</span></h2>
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
                <!-- 엑셀 다운로드 버튼 -->
                <!-- <compo-tooltip-btn
                  TitleProp="엑셀 다운로드"
                  ClassProp="pl-tooltip-btn is-line"
                  IconProp="pl-icon20 exceldown"
                  TooltipPositionProp="bottom"
                  @btnClick="mixin_testLog('엑셀 다운로드')"
                ></compo-tooltip-btn> -->
              </div>
            </div>
            <v-data-table
              class="pl-grid"
              :headers="headers"
              :items="items"
              fixed-header
              item-key="index"
              height="317px"
              :items-per-page="-1"
              hide-default-footer
              :item-class="isActiveRow"
              @click:row="rowSelect"
              no-data-text="등록된 데이터가 없습니다."
              >
              <template v-slot:item.PLAN_NM="{ item }">
                <v-tooltip content-class="pl-tooltip " bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">{{ item.PLAN_NM }}</span>
                  </template>
                  <span>{{ item.PLAN_NM }}</span>
                </v-tooltip>
              </template>
              <template v-slot:item.CYCL1="{ item }">
                <td :class="mixin_getHeaderClass(headers[6].align)" >
                  <v-btn v-if="item.CYCL_CNT >= 1" @click="qaDtlStatistics(item, '1')" class="pl-btn is-sm">
                    1차
                  </v-btn>
                  <span v-if="item.CYCL_CNT < 1">-</span>
                </td>
                </template>
              <template v-slot:item.CYCL2="{ item }">
                <td :class="mixin_getHeaderClass(headers[7].align)" >
                  <v-btn v-if="item.CYCL_CNT >= 2" @click="qaDtlStatistics(item, '2')" class="pl-btn is-sm">
                    2차
                  </v-btn>
                  <span v-if="item.CYCL_CNT < 2">-</span>
                </td>
              </template>
              <template v-slot:item.CYCL3="{ item }">
                <td :class="mixin_getHeaderClass(headers[8].align)" >
                  <v-btn v-if="item.CYCL_CNT >= 3" @click="qaDtlStatistics(item, '3')" class="pl-btn is-sm">
                    3차
                  </v-btn>
                  <span v-if="item.CYCL_CNT < 3">-</span>
                </td>
              </template>
              <template v-slot:item.index05="{ item }">
                <!-- 지표 보기 버튼 -->
                <compo-tooltip-btn
                  TitleProp="지표 보기"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 document"
                  TooltipPositionProp="bottom"
                  @btnClick="qaQltyEvlPreview(item)"
                ></compo-tooltip-btn>
              </template>
            </v-data-table>
          </div>
        </div>
        <div class="is-col-fix is-vrt" style="width: 610px">
          <div class="pl-card">
            <h2 class="pl-subtit is-inform">{{ SCH_TERM_TXT }}</h2>
            <div class="is-mt-m">
              <ul class="pl-list-info4" >
                <li
                  v-for="item in QA_STATUS.monitor"
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
            </div>
            <!-- QA 평가 지표별 현황  -->
            <div class="is-mt-l">
              <h2 class="pl-subtit is-inform">QA 평가 지표별 현황</h2>
              <v-data-table
                class="pl-grid is-rowspan is-mt-m"
                :headers="RheadersRowSpan"
                :items="RitemsRowSpan"
                fixed-header
                item-key="index"
                height="467px"
                :items-per-page="-1"
                hide-default-footer
                no-data-text="등록된 데이터가 없습니다."
              >
                <template v-slot:item="{ item, index }">
                  <tr
                    :class="mixin_getItemClass(item)"
                    :key="index">
                    <td
                      v-if="index === 0 || item.UP_QLTY_CLSF_NM !== RitemsRowSpan[index - 1].UP_QLTY_CLSF_NM"
                      :rowspan="getRowCount(index, 'UP_QLTY_CLSF_NM')"
                      :class="mixin_getHeaderClass(RheadersRowSpan[0].align)">{{ item.UP_QLTY_CLSF_NM }}</td>
                    <td
                      v-if="index === 0 || item.QLTY_CLSF_NM !== RitemsRowSpan[index - 1].QLTY_CLSF_NM"
                      :rowspan="getRowCount(index, 'QLTY_CLSF_NM')"
                      :class="mixin_getHeaderClass(RheadersRowSpan[1].align)">{{ item.QLTY_CLSF_NM }}</td>
                    <td :class="mixin_getHeaderClass(RheadersRowSpan[2].align)">
                      {{ item.ASSSCOR }}
                    </td>
                    <td :class="mixin_getHeaderClass(RheadersRowSpan[3].align)">
                      {{ item.CNT }}
                    </td>
                    <td :class="mixin_getHeaderClass(RheadersRowSpan[4].align)">
                      {{ item.RATE }}%
                    </td>

                  </tr>
                </template>
              </v-data-table>

            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 미리보기 dialog -->
    <v-dialog
      v-model="dialogPreview"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="QA 평가지표 미리보기"
        @hide="mixin_hideDialog('Preview')"
        @submit="submitDialog('Preview')"
      >
        <template slot="body">
          <h2 class="pl-subtit">평가지표 : <span class="font-weight-medium ml-2 ">{{ preview_title }}</span></h2>
          <v-data-table
            class="pl-grid is-rowspan is-mt-m"
            :headers="headersRowSpan"
            :items="itemsRowSpan"
            fixed-header
            item-key="index"
            height="535px"
            :items-per-page="-1"
            hide-default-footer
            no-data-text="등록된 데이터가 없습니다."
          >
            <template v-slot:item="{ item, index }">
              <tr
                :class="mixin_getItemClass(item)"
                :key="index">
                <td
                  v-if="index === 0 || item.type01 !== itemsRowSpan[index - 1].type01"
                  :rowspan="mixin_getRowCount(index, 'type01')"
                  :class="mixin_getHeaderClass(headersRowSpan[0].align)">{{ item.type01 }}</td>
                <td
                  v-if="index === 0 || item.type02 !== itemsRowSpan[index - 1].type02"
                  :rowspan="mixin_getRowCount(index, 'type02')"
                  :class="mixin_getHeaderClass(headersRowSpan[1].align)">{{ item.type02 }}</td>
                <td :class="mixin_getHeaderClass(headersRowSpan[2].align)">
                    {{ item.type03 }}
                </td>
                <td style="white-space: pre-line;">
                  {{ item.subject }}
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
                      <td class="pl-grid-sum-head text-center" colspan="2">합계</td>
                      <td class="text-center">
                        {{ mixin_sum_field(this.itemsRowSpan, "type03") }}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </v-data-table>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import chartjsDoughnutChart from "@/components/chartjsDoughnutChart";
import chartjsBarChart from "@/components/chartjsBarChart";

  export default {
  name: "MENU_STA_M0400", //name은 'MENU_' + 파일명 조합
  components: {
    chartjsDoughnutChart,
    chartjsBarChart
  },
  data() {
    return {
      // top search
      SCH_YEAR: '', //년도 검색
      SCH_ENFC_SE_CD: '', //QA 시행 구분 검색

      YEAR_LIST: [],
      ENFC_SE_CD_LIST: [],

      YEAR: '', //년도

      SCH_TERM_TXT : '선택된 QA 없음.',

      // 평가유형별 현황
      DonughtData: {
        labels: [],
        datasets: [
        {
          backgroundColor: ['#8591E1', '#FAA7A8', '#FFB72C', '#7FC379', '#4BC8F5'],
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

      // 유형별 QA평가 건수
      BarData: {
        labels: [],
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

      // QA 평가 현황(전체) grid
      headers: [
        { text: 'QA 평가명', value: 'PLAN_NM', align: 'left', width: '160px', sortable: false},
        { text: '평가 기간', value: 'QA_TERM', align: 'center', width: '', sortable: false },
        { text: 'QA 평가 유형', value: 'ENFC_SE_NM', width: '110px', sortable: false},
        { text: '대상', value: 'QA_TRGT_CNT', align: 'center', width: '90px', sortable: false },
        { text: '미할당', value: 'QA_NO_ALTMNT_CNT', align: 'center', width: '90px', sortable: false },
        { text: 'QA 인원', value: 'QA_MNGR_CNT', align: 'center', width: '90px', sortable: false },
        { text: '1차', value: 'CYCL1', align: 'center', width: '90px', sortable: false },
        { text: '2차', value: 'CYCL2', align: 'center', width: '90px', sortable: false },
        { text: '3차', value: 'CYCL3', align: 'center', width: '90px', sortable: false },
        { text: '평가지표', value: 'index05', align: 'center', width: '90px', sortable: false },
      ],
      items: [],

      selectedRow:null,

      // 미리보기 dialog
      dialogPreview: false,
      preview_title: '정기평가',
      headersRowSpan: [
        { text: "대분류"  , value: "type01" , align: "left"   , width: "150px" , sortable: false},
        { text: "중분류"  , value: "type02" , align: "left"   , width: "150px" , sortable: false},
        { text: "배점"    , value: "type03" , align: "center" , width: "80px" , sortable: false},
        { text: "품질기준", value: "subject", align: "left"   , width: "" , sortable: false},
      ],

      itemsRowSpan: [
      ],

      MESSAGE: {
        CONFIRM: {
        },
        ALERT: {
          NO_ARTCL_DATA: { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '저장된 평가지표가 없습니다.', },
        },
        ERROR: {
          ERROR: { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.' },	//기본항목
        }
      },

      // QA 분기평가 현황
      QA_STATUS: {
        monitor: [
          {title: '총점', count: 0, },
          { title: '평균 점수', count: 0, },
          { title: '최고 점수', count: 0, },
          { title: '최저 점수', count: 0, },
        ],
      },

      // QA평가지표별 현황
      RheadersRowSpan: [
        { text: "대분류", value: "UP_QLTY_CLSF_NM", align: "left", width: "150px" , sortable: false},
        { text: "중분류", value: "QLTY_CLSF_NM", align: "left", width: "150px" , sortable: false},
        { text: "배점", value: "ASSSCOR", align: "center", width: "90px" , sortable: false},
        { text: "분포", value: "CNT", align: "center", width: "90px" , sortable: false},
        { text: "비율", value: "RATE", align: "center", width: "90px" , sortable: false},
      ],
      RitemsRowSpan: [
        { index: 1, type01: '도입부', type02: '첫/끝인사', type03: '7', type04: '7', type05: '50',},
        { index: 2, type01: '도입부', type02: '첫/끝인사', type03: '4', type04: '7', type05: '50',},
        { index: 3, type01: '도입부', type02: '첫/끝인사', type03: '0', type04: '7', type05: '50',},
        { index: 4, type01: '도입부', type02: '고객확인', type03: '5', type04: '7', type05: '50',},
        { index: 5, type01: '도입부', type02: '고객확인', type03: '2', type04: '7', type05: '50',},
        { index: 6, type01: '도입부', type02: '고객확인', type03: '0', type04: '7', type05: '50',},
        { index: 7, type01: '응대 스킬', type02: '호응어', type03: '10', type04: '7', type05: '50',},
        { index: 8, type01: '응대 스킬', type02: '호응어', type03: '7', type04: '7', type05: '50',},
        { index: 9, type01: '응대 스킬', type02: '호응어', type03: '4', type04: '7', type05: '50',},
        { index: 10, type01: '응대 스킬', type02: '호응어', type03: '0', type04: '7', type05: '50',},
        { index: 11, type01: '응대 스킬', type02: '경청', type03: '5', type04: '7', type05: '50',},
        { index: 12, type01: '응대 스킬', type02: '경청', type03: '3', type04: '7', type05: '50',},
      ],
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

    this.getQltyClfsCode(); //시행구분 코드 조회
    this.qaStatistics(); //QA 통계 조회
  },

  mounted() {

  },

  methods: {
    //시행구분 코드 조회
    async getQltyClfsCode() {
      this.ENFC_SE_CD_LIST = [{text:'전체', value:''}];
      let sUrl = "/api/qa/qltyclsf/code";
      let postParam = {};
      let headParam = {};

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if (response.HEADER.ERROR_FLAG)
        return [];
      else {
        if(response.DATA.length > 0){
          response.DATA.forEach((data) => {
            this.ENFC_SE_CD_LIST.push({text:data.QLTY_CLSF_NM, value:data.QLTY_CLSF_ID});
          });
        }
      }
    },

    clearLeftData() {
      this.items = [];

      //캠페인 유형별 현황 초기화
      let DonughtData = this.DonughtData;
      DonughtData.labels = [];
      DonughtData.datasets[0].data = [];
      DonughtData.datasets[0].noData = false;

      //캠페인 타겟 현황 초기화
      let BarData = this.BarData;
      BarData.labels = [];
      BarData.datasets[0].data = [];
      BarData.datasets[0].noData = false;
    },

    clearRightData() {
      this.SCH_TERM_TXT = '선택된 QA 없음.';

      this.RitemsRowSpan = [];

      this.QA_STATUS.monitor.forEach((monitor, idx) => {
        monitor.count = 0;
      });
    },

    //QA 통계 조회
    async qaStatistics() {
      let DonughtData = this.DonughtData;
      let BarData = this.BarData;

      this.clearLeftData(); //데이터 초기화
      this.clearRightData(); //데이터 초기화

      let sUrl = '/api/statistics/phone/qaStatistics';
      let postParam = {
        ENFC_YR : this.SCH_YEAR
        , ENFC_SE_CD :this.SCH_ENFC_SE_CD
        , PRGRS_STTS_CD : 'TERMIAT' //종료
      }

      let headParam = {
        head: {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        if(response.QA_SE_DATA.length > 0){
          let iCnt = 0;
          response.QA_SE_DATA.forEach((val) => {
            DonughtData.labels.push(val.QLTY_CLSF_NM);
            DonughtData.datasets[0].data.push(val.CNT);

            BarData.labels.push(val.QLTY_CLSF_NM);
            BarData.datasets[0].data.push(val.CNT);

            if(val.CNT > 0) iCnt++;
          });

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
            data.QA_TERM = this.mixin_convertDate(data.EVL_END_YMD, 'yyyy-MM-dd') + ' ~ ' + this.mixin_convertDate(data.EVL_BGNG_YMD, 'yyyy-MM-dd');
            data.QA_NO_ALTMNT_CNT = Number(data.QA_TRGT_CNT) - Number(data.QA_ALTMNT_CNT);
          });
          this.items = response.DATA;
          this.rowSelect(this.items[0]);
        }else{
          this.SCH_TERM_TXT = '선택된 QA 없음.';
        }
      }
    },

    //row 선택
    rowSelect(idx) {
      this.selectedRow = idx;
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    getRowCount(index, type) {
      let rowCount = 1;
      for (let i = index + 1; i < this.RitemsRowSpan.length; i++) {
        if (this.RitemsRowSpan[i][type] === this.RitemsRowSpan[i - 1][type]) {
          rowCount++;
        } else {
          break;
        }
      }
      return rowCount;
    },

    async qaQltyEvlPreview(data) {
      this.preview_title = data.ENFC_SE_NM;
      // this.SCH_TERM_TXT = data.PLAN_NM;

      let sUrl = "/api/qa/evlmng/artcllist";
      let postParam = {
        UP_QLTY_CLSF_ID: data.ENFC_SE_CD,
        USE_YN: 'Y',
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)

      if (!resData.HEADER.ERROR_FLAG) {
        //성공시 이벤트
        if (resData.DATA.length < 1) {
          this.showAlert(this.MESSAGE.ALERT.NO_ARTCL_DATA);
        }
        else {
          this.setPlanQltySheet(resData.DATA);
          this.mixin_showDialog('Preview');
        }
      }
    },

    async setPlanQltySheet(data) {
      //가져온 데이터를 양식에 맞게 재구성.
      let oPaper = [];
      data.forEach(item => {
        if (this.mixin_isEmpty(item.UP_QLTY_CLSF_NM)) {        // UP_QLTY_CLSF_NM 가 없으면 대분류
          item.index = oPaper.length + 1;
          item.type01 = item.QLTY_CLSF_NM;
          oPaper.push(item);
        } else if (this.mixin_isEmpty(item.EVL_ARTCL_ID)) {   // UP_QLTY_CLSF_ID는 있는데 EVL_ARTCL_ID 가 없으면 중분류 Only -> 상위 대분류에 내용 넣어줌
          let oLastItem = oPaper[oPaper.length - 1];
          item.index = oLastItem.index;
          item.type01 = oLastItem.type01;
          item.type02 = item.QLTY_CLSF_NM;
          if (this.mixin_isEmpty(oLastItem.subject)) // 바로 앞 항목이 분류면 update, 품질기준이면 insert
            oPaper.pop();
          oPaper.push(item);
        } else {                                              // 그 외의 경우는 품질 기준 Level.
          let oLastItem = oPaper.length > 0 ? oPaper[oPaper.length - 1] : [];
          let bUpdate = (this.mixin_isEmpty(oLastItem) || !this.mixin_isEmpty(oLastItem.type02)) ? false : true;
          // 상위에 대분류만 들어가 있는 경우는 상위 item 업데이트, 그외의 경우는 새로 item insert
          item.type01 = item.UP_QLTY_CLSF_NM;
          item.type02 = item.QLTY_CLSF_NM;
          item.type03 = item.ASSSCOR;
          item.subject = item.EVL_ARTCL_NM;
          item.index = bUpdate ? oLastItem.index : oPaper.length + 1;
          if (bUpdate)
            oPaper.pop();
          oPaper.push(item);
        }
      });

      this.itemsRowSpan = oPaper;
    },

    async qaDtlStatistics(data, cycl) {
      this.clearRightData(); //데이터 초기화

      this.SCH_TERM_TXT = data.PLAN_NM + ' ('+cycl+'차)';

      let sUrl = "/api/statistics/phone/qaDtlStatistics";
      let postParam = {
        UP_QLTY_CLSF_ID: data.ENFC_SE_CD
        , QA_PLAN_ID: data.QA_PLAN_ID
        , QA_CYCL_ID: data.CYCL_LIST[cycl-1].qa_cycl_id
      }
      let headParam = {
        head: {
        }
      }

      let response = await this.common_postCall(sUrl, postParam, headParam)

      if (!response.HEADER.ERROR_FLAG) {
        let iTotScor = 0;
        if(response.DATA.length > 0){
          response.DATA.forEach((data) => {
            if(data.RANK_NUM === '1') iTotScor += Number(data.ASSSCOR);
          });

          this.QA_STATUS.monitor[0].count = iTotScor;

          if(response.QA_SCOR_DATA.length > 0){
            this.QA_STATUS.monitor.forEach((monitor, idx) => {
              if(idx === 1) monitor.count = response.QA_SCOR_DATA[0].AVG_SCR; //평균 점수
              else if(idx === 2) monitor.count = response.QA_SCOR_DATA[0].MAX_SCR; //최고 점수
              else if(idx === 3) monitor.count = response.QA_SCOR_DATA[0].MIN_SCR; //최저 점수
            });
          }

          if(response.DATA.length > 0){
            response.DATA.forEach((data, idx) => {
              data.ASSSCOR = this.mixin_convertNumToComma(data.ASSSCOR);
              data.CNT = this.mixin_convertNumToComma(data.CNT);
              data.RATE = this.mixin_convertNumToComma(data.RATE);
            });
          }

          this.RitemsRowSpan = response.DATA;

        }else{
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>