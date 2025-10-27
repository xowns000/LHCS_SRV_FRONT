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
                    <!-- <compo-drop-picker
                      :StartDateProp.sync="startDate"
                      :EndDateProp.sync="endDate"
                    /> -->
                  </div>
                </template>
              </div>
            </div>
            <v-btn class="pl-btn is-icon" @click="getCuttTypeStatistics">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols flex-grow-1">
        <!-- tree -->
        <div class="is-col-fix is-vrt" style="width: 410px">
          <div class="pl-search-header">
            <div class="pl-form-inline-wrap">
              <div class="pl-form-inline">
                <span class="pl-label">
                  상담유형 구분
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    :items="schCuttTypeSeDropItems"
                    placeholder="선택하세요"
                    v-model="SCH_CUTT_TYPE_SE_CD"
                    :disabled="SCH_CUTT_TYPE_SE_CD ==='ITGRT'?true:false"
                  ></v-select>
                </div>
              </div>
              <v-btn
                class="pl-btn is-icon"
                @click="getTreeList"
              >
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
            </div>
          </div>
          <div class="pl-card">
            <div class="pl-tree-header">
              <div class="is-left">
                <label>상담유형</label>
              </div>
              <div class="is-right">
                <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault')">전체 펼치기</v-btn>
                <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault')">전체 접기</v-btn>
                <compo-tooltip-btn
                  TitleProp="새로고침"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="bottom"
                  @btnClick="getTreeList">
                </compo-tooltip-btn>
              </div>
            </div>
            <div class="pl-tree-body" style="height: 570px;">
              <v-treeview
                ref="treeDefault"
                activatable
                return-object
                :items="treeItems"
                :open-all="expanded"
                :open-on-click=false
                @update:active="getCuttTypeStatistics"
                color="secondary"
                class="pl-tree-view">
                <template v-slot:prepend="{ item, open }">
                  <v-icon v-if="item.children.length > 0">
                      {{open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder'}}
                  </v-icon>
                  <v-icon v-else>
                      {{ 'pl-icon20 tree-file' }}
                  </v-icon>
                </template>
                <template v-slot:label="{item}">
                  <div v-html="item.name"></div>
                </template>
              </v-treeview>
            </div>
          </div>
        </div>
        <!-- grid -->
        <div class="is-vrt" >
          <div class="pl-card">
            <div class="pl-grid-top">
              <div class="pl-grid-top-left">
                <h2 class="pl-subtit">{{ SCH_TERM_TXT }} <span class="is-txt-main">(전체)</span></h2>
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter">전체 <em class="pl-1">({{ itemsRowSpan.length }})</em> 건</span>
                <!-- 엑셀 다운로드 버튼 -->
                <compo-excel
                  TypeProp="Download"
                  :DataHeaderProp="headersRowSpan"
                  :DataBodyProp="itemsRowSpan"
                  :FileNameProp="SCH_TERM_TXT+' 상담유형별_통계_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
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
              :items-per-page="-1"
              hide-default-footer
              no-data-text="등록된 데이터가 없습니다."
            >
              <template v-slot:item="{ item, index }">
                <tr
                  :class="mixin_getItemClass(item)"
                  :key="index">
                  <td v-for="n in Number(CUTT_SETTING.CUTT_TYPE_LMT_LVL_CD)"
                    :key="n"
                    v-if="index === 0 || item['cuttType'+n.toString()] !== itemsRowSpan[index - 1]['cuttType'+n.toString()]"
                    :rowspan="item['cuttType'+(n-1).toString()] === itemsRowSpan[index]['cuttType'+(n-1).toString()] ? mixin_getRowCount(index, 'cuttType'+n.toString()) : 1"
                    :class="text-start"
                  >
                  {{ item['cuttType'+n.toString()].replace('cuttType'+item.CUTT_TYPE_ID+item.CL_TYPE_CD, '') }}
                  </td>
                  <!-- <td
                    v-if="index === 0 || item.cuttType1 !== itemsRowSpan[index - 1].cuttType1"
                    :rowspan="mixin_getRowCount(index, 'cuttType1')"
                    :class="mixin_getHeaderClass(headersRowSpan[0].align)">{{ item.cuttType1 }}</td>
                  <td
                    v-if="index === 0 || item.cuttType2 !== itemsRowSpan[index - 1].cuttType2"
                    :rowspan="mixin_getRowCount(index, 'cuttType2')"
                    :class="mixin_getHeaderClass(headersRowSpan[1].align)">{{ item.cuttType2 }}</td>
                  <td
                    v-if="index === 0 || item.cuttType3 !== itemsRowSpan[index - 1].cuttType3"
                    :rowspan="mixin_getRowCount(index, 'cuttType3')"
                    :class="mixin_getHeaderClass(headersRowSpan[2].align)">{{ item.cuttType3 }}</td> -->
                  <td :class="mixin_getHeaderClass(headersRowSpan[Number(CUTT_SETTING.CUTT_TYPE_LMT_LVL_CD)].align)">
                    {{ item.CL_TYPE_NM }}
                  </td>
                  <td :class="mixin_getHeaderClass(headersRowSpan[Number(CUTT_SETTING.CUTT_TYPE_LMT_LVL_CD)+1].align)">
                    {{ mixin_convertNumToComma(item.TOT_CNT) }}
                  </td>
                  <td :class="mixin_getHeaderClass(headersRowSpan[Number(CUTT_SETTING.CUTT_TYPE_LMT_LVL_CD)+2].align)">
                    {{ mixin_convertNumToComma(item.COMPLETED_CNT) }}
                  </td>
                  <td :class="mixin_getHeaderClass(headersRowSpan[Number(CUTT_SETTING.CUTT_TYPE_LMT_LVL_CD)+3].align)">
                    {{ mixin_convertNumToComma(item.NOT_COMPLETED_CNT) }}
                  </td>
                  <td :class="mixin_getHeaderClass(headersRowSpan[Number(CUTT_SETTING.CUTT_TYPE_LMT_LVL_CD)+4].align)">
                    {{ mixin_convertNumToComma(item.DAY_AVG_CNT) }}
                  </td>
                  <td :class="mixin_getHeaderClass(headersRowSpan[Number(CUTT_SETTING.CUTT_TYPE_LMT_LVL_CD)+5].align)">
                    {{ mixin_convertNumToComma(item.COMPLETED_RATE) }} %
                  </td>
                  <td :class="mixin_getHeaderClass(headersRowSpan[Number(CUTT_SETTING.CUTT_TYPE_LMT_LVL_CD)+6].align)">
                    {{ mixin_convertNumToComma(convertSecToTxt(item.TOT_PHN_HR)) }}
                  </td>
                  <td :class="mixin_getHeaderClass(headersRowSpan[Number(CUTT_SETTING.CUTT_TYPE_LMT_LVL_CD)+7].align)">
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
                      <tr>
                        <td :colspan="Number(CUTT_SETTING.CUTT_TYPE_LMT_LVL_CD)+1" class="pl-grid-sum-head text-center">합계</td>
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
  export default {
  name: "MENU_STA_M0103", //name은 'MENU_' + 파일명 조합
  components: {
  },
  data() {
    return {
      common_code: [],
      // top search
      SCH_CALL_TP: '', //콜 유형 검색
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

      // 조회 영역 콤보
      schCuttTypeSeDropItems: [], //상담유형 구분
      SCH_CUTT_TYPE_SE_CD:'', //상담유형 구분 값
      SCH_EXPSN_ATTR_NM:'', //상담내용 학목 정보 조회
      schExpsnAttrDropItems: [], //항목명

      //tree
      expanded: false,
      treeItems: [],
      activeItem:[],
      selectedNode: null,

      //상담유형 셋팅 정보
      CUTT_SETTING: {
        ITGRT_USE_YN:'',
        CUTT_TYPE_LMT_LVL_CD:'',
      },

      headerFix:[
        { text: "콜 유형", align: "center", value: "CL_TYPE_NM" , width: '100px' ,sortable: false},
        { text: "상담 건수", align: "center", value: "TOT_CNT" , width: '90px' ,sortable: false,},
        { text: "처리\n건수", align: "center", value: "COMPLETED_CNT" , width: '80px' ,sortable: false, class: 'multiline-header'},
        { text: "미처리\n건수", align: "center", value: "NOT_COMPLETED_CNT" , width: '80px' ,sortable: false, class: 'multiline-header'},
        { text: "일평균\n상담건수", align: "center", value: "DAY_AVG_CNT" ,width: '120px', sortable: false, class: 'multiline-header'},
        { text: "처리율", align: "center", value: "COMPLETED_RATE", width: '100px', sortable: false, },
        { text: "총 상담시간", align: "center", value: "TOT_PHN_HR" , width: '160px', sortable: false, },
        { text: "일평균\n상담시간", align: "center", value: "DAY_AVG_PHN_HR" , width: '135px',sortable: false, class: 'multiline-header'},
      ],

      //grid
      headersRowSpan: [],
      itemsRowSpan: [],

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
    let codeName = ['CALL_TP', 'CUSL_TP_LV', 'CUSL_TP_CL'];
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

    //콤보
    this.schCuttTypeSeDropItems = this.mixin_common_code_get(this.common_code, 'CUSL_TP_CL'); //확장구분 콤보

    this.getTreeList();//상담유형 Tree 목록 조회
  },

  mounted() {

  },

  methods: {
    //상담유형 Tree 목록 조회
    async getTreeList() {
      this.headersRowSpan = [];
      let sUrl = '/api/setting/cuttType/cuttTypeTreeList';
      let postParam = {
        CUTT_TYPE_SE_CD : this.SCH_CUTT_TYPE_SE_CD
        , ALL_VIEW : 'Y'
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        //상담유형 정보 셋팅
        if(response.CUTT_TYPE_SETTING){
          this.CUTT_SETTING.ITGRT_USE_YN = response.CUTT_TYPE_SETTING[0].ITGRT_USE_YN;
          this.CUTT_SETTING.CUTT_TYPE_LMT_LVL_CD = response.CUTT_TYPE_SETTING[0].CUTT_TYPE_LMT_LVL_CD;

          for(let i=0; i<response.CUTT_TYPE_SETTING[0].CUTT_TYPE_LMT_LVL_CD; i++){
            this.headersRowSpan.push({ text: "상담유형"+(i+1), align: "left", value: "cuttType"+(i+1),  sortable: false});
          }
          this.headersRowSpan = [...this.headersRowSpan, ...this.headerFix];
        }

        //상담유형 설정에서 통합 사용이 아닌 경우 유형구분에서 통합 제거
        if(this.CUTT_SETTING.ITGRT_USE_YN === "N"){
          let tmpCuttTypeSeDropItems = [];
          for(let i=0; i<this.schCuttTypeSeDropItems.length; i++){
            if(this.schCuttTypeSeDropItems[i].value != "ITGRT"){
              tmpCuttTypeSeDropItems.push(this.schCuttTypeSeDropItems[i]);
            }
          }
          this.schCuttTypeSeDropItems = tmpCuttTypeSeDropItems;
        }

        //상담유형 Tree 데이터
        if(response.CUTT_TYPE_TREE){
          this.treeItems = response.CUTT_TYPE_TREE;
        }

        if(response.DATA.length > 0){
          this.CUTT_TYPE_ID = response.DATA[0].CUTT_TYPE_ID;
          this.SCH_CUTT_TYPE_SE_CD = response.DATA[0].CUTT_TYPE_SE_CD;
        }

        this.getCuttTypeStatistics([{CUTT_TYPE_ID:-1, LVL:1}]);
      }
    },

    expandAll(id){
      this.expanded = true;
      this.$refs[id].updateAll(true);
    },
    collapseAll(id){
      this.expanded = false;
      this.$refs[id].updateAll(false);
    },

    //상담유형별 통계
    async getCuttTypeStatistics(node) {
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

      this.itemsRowSpan = [];

      if(node.length > 0){
        this.activeItem = node;
        this.selectedNode = this.activeItem[0];
      }

      let sUrl = '/api/statistics/phone/phoneCuttTypetatistics';
      let postParam = {
        CL_TYPE_CD : this.SCH_CALL_TP
        , STATISTICS_ST : this.SCH_STATISTICS_ST
        , SCH_GB : this.datePeriod === 0? 'DAY':this.datePeriod === 1? 'MONTH': 'QUARTER'
        , SCH_YEAR : this.SCH_YEAR
        , SCH_MONTH : this.SCH_MONTH
        , SCH_ST_DT : this.SCH_ST_DT.replace(/-/gi, '')
        , SCH_END_DT : this.SCH_END_DT.replace(/-/gi, '')
        , SCH_QUARTER : this.SCH_QUARTER
        , CUTT_TYPE_ID : this.selectedNode.CUTT_TYPE_ID
        , LVL : this.selectedNode.LVL
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.datePeriod_st = this.datePeriod;

        if(this.datePeriod_st === 0){
          this.headersRowSpan[Number(this.CUTT_SETTING.CUTT_TYPE_LMT_LVL_CD) + 4].text = '일평균\n상담 건수';
          this.headersRowSpan[Number(this.CUTT_SETTING.CUTT_TYPE_LMT_LVL_CD) + 7].text = '일평균\n상담시간';
        }else if(this.datePeriod_st === 1){
          this.headersRowSpan[Number(this.CUTT_SETTING.CUTT_TYPE_LMT_LVL_CD) + 4].text = '월평균\n상담 건수';
          this.headersRowSpan[Number(this.CUTT_SETTING.CUTT_TYPE_LMT_LVL_CD) + 7].text = '월평균\n상담시간';
        }else if(this.datePeriod_st === 2){
          this.headersRowSpan[Number(this.CUTT_SETTING.CUTT_TYPE_LMT_LVL_CD) + 4].text = '분기평균\n상담 건수';
          this.headersRowSpan[Number(this.CUTT_SETTING.CUTT_TYPE_LMT_LVL_CD) + 7].text = '분기평균\n상담시간';
        }

        if(response.DATA){
          response.DATA.forEach((data, idx) => {
            for(let k=1; k<=this.CUTT_SETTING.CUTT_TYPE_LMT_LVL_CD; k++){
              data.FULL_PATH.split(' > ').forEach((cuttType, seq) => {
                if(seq > 0){
                  if(seq === k) data['cuttType'+k] = cuttType;
                }
              });

              if(k > data.FULL_PATH.split(' > ').length-1){
                for(let h=data.FULL_PATH.split(' > ').length-1; h<=this.CUTT_SETTING.CUTT_TYPE_LMT_LVL_CD; h++){
                  data['cuttType'+k] = 'cuttType'+response.DATA[idx].CUTT_TYPE_ID+response.DATA[idx].CL_TYPE_CD;
                }
              }
            }
          });

          this.itemsRowSpan = response.DATA;
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