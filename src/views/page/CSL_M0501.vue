<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <!-- <span class="pl-label">
                진행 기간
              </span>
              <div class="pl-desc">
                <div class="pl-calendar-range-form">
                  <compo-date-picker
                    DateType="dateInput"
                    :DateProp.sync="CPI_BGNG_DT"/>
                  <span class="pl-unit">~</span>
                  <compo-date-picker
                    DateType="dateInput"
                    :DateProp.sync="CPI_END_DT"/>
                  <compo-drop-picker
                    :StartDateProp.sync="CPI_BGNG_DT"
                    :EndDateProp.sync="CPI_END_DT"
                  />
                </div>
              </div> -->
              <span class="pl-label">
                진행 년도
              </span>
              <div class="pl-desc">
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    :items="cpiYrItems"
                    v-model="CPI_YR"
                    placeholder="선택하세요"
                  ></v-select>
                </div>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                진행 상태
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(this.common_code, 'CMPN_ST', '전체')"
                  placeholder="선택하세요"
                  v-model="PRGRS_STTS_CD"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">계획 구분</span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(this.common_code, 'CMPN_CL', '전체')"
                  placeholder="선택하세요"
                  v-model="PLAN_SE_CD"
                ></v-select>
              </div>
            </div>
            <!-- <div class="pl-form-inline">
              <span class="pl-label">세부 구분</span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="dropItems3"
                  placeholder="선택하세요"
                ></v-select>
              </div>
            </div> -->
            <div class="pl-form-inline">
              <span class="pl-label">캠페인 명</span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form is-lg"
                  placeholder="검색어 입력" v-model="CPI_NM" @keyup.enter="btnSelectList(false)"></v-text-field>
              </div>
            </div>
            <v-btn class="pl-btn is-icon" @click="btnSelectList(false)">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body">
        <div class="pl-grid-top">
          <div class="pl-grid-top-left">
            <v-btn class="pl-btn is-icon is-sub" @click="btnShowDtl" :disabled="selectedRow.index != undefined ? false : true">
              <span class="pl-icon20 document"></span>
              선택항목 상세
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub" @click="btnShowMt">
              <span class="pl-icon20 circle-plus"></span>
              등록
            </v-btn>
            <!-- <v-btn class="pl-btn is-icon is-sub" @click="btnClose">
              <span class="pl-icon20 terminate"></span>
              종료
            </v-btn> -->
            <v-btn class="pl-btn is-icon is-sub" @click="btnDelete" :disabled="gridSelectedData.length != 0 ? false : true">
              <span class="pl-icon20 trash"></span>
              삭제
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub" @click="showAlert(MESSAGE.CONFIRM.STRT_NOW)" :disabled="STRT_NOW">
              <span class="pl-icon20 trash"></span>
              즉시진행
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ gridDataText.length }})</em> 건</span>
          </div>
        </div>
        <v-data-table
          class="pl-grid has-control is-hover"
          show-select
          :headers="gridDataHeaders"
          :items="gridDataText"
          v-model="gridSelectedData"
          fixed-header
          item-key="index"
          height="562px"
          :items-per-page="ROW_PER_PAGE"
          @dblclick:row="gridDbClick"
          @click:row="rowSelect"
          hide-default-footer
          :page.sync="page"
          no-data-text="등록된 데이터가 없습니다."
          :item-class="isActiveRow"
          @page-count="pageCount = $event">
          <template v-slot:item.PRGRS_STTS_NM="{ item }">
            <span :class="`pl-round-chip is-sm chat-stat-${displayStatus(item.PRGRS_STTS_CD)}`">
              {{ item.PRGRS_STTS_NM }}
            </span>
            <!-- <span :class="`is-txt-${displayStatus(item.PRGRS_STTS_CD)}`">
              {{ item.PRGRS_STTS_NM }}
            </span> -->
          </template>
        </v-data-table>
        <div class="pl-pager">
          <div class="pl-pager-row">
            <span>페이지당 항목 수</span>
            <v-select
              class="pl-form"
              :value="ROW_PER_PAGE"
              :items="perPage"
              :item-text="toString(ROW_PER_PAGE)"
              @change="ROW_PER_PAGE = parseInt($event, 10);"
            ></v-select>
          </div>
          <v-pagination
            v-model="page"
            :length="pageCount"
            circle
            :total-visible="7">
          </v-pagination>

          <span class="pl-pager-period">보기 {{ mixin_getPagePeriod(gridDataText, page) }} / {{ gridDataText.length }}
            <compo-tooltip-btn
              TitleProp="다음 검색"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 arrow-next-paging"
              TooltipPositionProp="bottom"
              :DisabledProp="nextDisabled"
              @btnClick="btnSelectList(true)"
            ></compo-tooltip-btn>
            <!-- <v-btn`
              class="pl-btn is-sub"
              :disabled = "nextDisabled"
              @click="btnSelectList(true)"
              >다음 검색
            </v-btn> -->
          </span>
        </div>
      </div>
    </div>
    <!-- dialog -->
    <v-dialog
      v-model="dialogRegSurvey"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :header-title="digTitle"
        @hide="mixin_hideDialog('RegSurvey')"
      >
        <template slot="body">
          <v-form ref="form">
            <p>필수 항목을 입력하신 후 <strong>[저장] 버튼을 클릭</strong>하십시오.</p>
            <p>하나의 캠페인 캠페인에 <strong>총 10회의 계획 회차를 지정</strong>할 수 있습니다.</p>
            <div class="pl-form-inline-wrap vertical mt-2">
              <div class="pl-form-inline">
                <span class="pl-label">
                  계획 구분
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    :items="mixin_common_code_get(this.common_code, 'CMPN_CL', '')"
                    placeholder="선택하세요"
                    v-model="digParams.PLAN_SE_CD"
                    :disabled = "digParams.PRGRS_STTS_CD === '' || digParams.PRGRS_STTS_CD === 'PRPARG' ? false : true"
                    required
                    :rules="validateRules.PLAN_SE_CD"
                  ></v-select>
                </div>
              </div>
              <!-- <div class="pl-form-inline">
                <span class="pl-label">
                  계획 세부 구분
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    :items="dropItemsS02"
                    placeholder="선택하세요"
                  ></v-select>
                </div>
              </div> -->
              <div class="pl-form-inline">
                <span class="pl-label">
                  기간
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
<!--                  <div class="pl-calendar-range-form">-->
<!--                    <compo-date-picker-->
<!--                      DateType="dateInput"-->
<!--                      :DateProp.sync="digParams.CPI_BGNG_DT"/>-->
<!--                    <span class="pl-unit">~</span>-->
<!--                    <compo-date-picker-->
<!--                      DateType="dateInput"-->
<!--                      :DateProp.sync="digParams.CPI_END_DT"/>-->
<!--                    <compo-drop-picker-->
<!--                      :StartDateProp.sync="digParams.CPI_BGNG_DT"-->
<!--                      :EndDateProp.sync="digParams.CPI_END_DT"-->
<!--                    />-->
<!--                  </div>-->
                  <compo-date-range-picker
                      :StartDayProp.sync="digParams.CPI_BGNG_DT"
                      :EndDayProp.sync="digParams.CPI_END_DT"
                      @startDayChange="mixin_testLog(digParams.CPI_BGNG_DT)"
                      @endDayChange="mixin_testLog(digParams.CPI_END_DT)"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  캠페인 명
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    v-model="digParams.CPI_NM"
                    required
                    :rules="validateRules.CPI_NM"
                    :disabled = "digParams.PRGRS_STTS_CD === '' || digParams.PRGRS_STTS_CD === 'PRPARG' ? false : true"
                    v-byte-counter="200"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">비고</span>
                <div class="pl-desc">
                  <v-textarea
                    class="pl-form is-noresize"
                    v-model="digParams.RMRK"
                    :disabled = "digParams.PRGRS_STTS_CD === '' || digParams.PLAN_SE_CD === 'PRPARG' ? false : true"
                    :spellcheck="false"
                    v-byte-counter="4000"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  계획 회차
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form align-right"
                    hide-spin-buttons
                    type="number"
                    oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                    suffix="회"
                    v-model="digParams.PLAN_CYCL"
                    required
                    :rules="validateRules.PLAN_CYCL"
                    v-byte-counter="4"
                  />
                  <p class="pl-form-hint">(캠페인을 진행할 횟수를 입력하십시오.)</p>
                </div>
              </div>

            </div>
          </v-form>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="closeDig">닫기</v-btn>
          <v-btn class="pl-btn is-sub" v-if="digParams.PRGRS_STTS_CD != '' && digParams.PRGRS_STTS_CD != 'TERMIAT'" @click="btnClose">종료</v-btn>
          <v-btn class="pl-btn" @click="btnSave">저장</v-btn>
        </template>

      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
export default {
    name:"MENU_CSL_M0501", //name은 'MENU_' + 파일명 조합

 components: {

  },
 data() {
    return {
      // top search
      nowDt: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
      common_code: [],
      cpiYrItems: [],
      // dropItems3: ['전체'],

      // dialog
      dialogRegSurvey: false,
      // dropItemsS02: [],
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      }, //그리드 페이지속성정의
      nextDisabled:true,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
      gridTotalCnt: 0,
      gridDataHeaders: [
        { text: '번호',           value: 'ROW_NUMBER',        align: 'center',  width: '80px',   sortable : false },
        { text: '캠페인명',       value: 'CPI_NM',            align: 'left',    width: '100%',    sortable : true },
        { text: '시작일',         value: 'CPI_BGNG_DT',       align: 'left',  width: '120px',    sortable : false },
        { text: '종료일',         value: 'CPI_END_DT',        align: 'left',  width: '120px',    sortable : false  },
        { text: '배분여부',       value: 'ALTMNT_YN',         align: 'center',  width: '100px',   sortable : false  },
        { text: '계획구분',       value: 'PLAN_SE_NM',        align: 'left',  width: '200px',     sortable : false },
        { text: '대상자 수',      value: 'CUST_CNT',          align: 'left',  width: '100px',     sortable : false },
        { text: '회차',           value: 'PLAN_CYCL',         align: 'center',  width: '80px',    sortable : false },
        { text: '진행상태',       value: 'PRGRS_STTS_NM',     align: 'left',  width: '100px',     sortable : false },
        { text: '등록자',         value: 'RGTR_ID',           align: 'left',  width: '120px',     sortable : false },
        { text: '등록일',         value: 'REG_DT',            align: 'left',  width: '120px',     sortable : false },

        { text: '캠페인_ID',      value: 'CPI_ID',            align: ' d-none' },
        { text: '고객사_ID',      value: 'CUSTCO_ID',         align: ' d-none' },
        { text: '계획_구분_코드',  value: 'PLAN_SE_CD',        align: ' d-none' },
        { text: '진행_상태_코드',  value: 'PRGRS_STTS_CD',     align: ' d-none' },
        { text: '완료_여부',       value: 'CMPTN_YN',          align: ' d-none' },
        { text: '완료_일시',       value: 'CMPTN_DT',          align: ' d-none' },
        { text: '비고',           value: 'RMRK',              align: ' d-none' },
      ],
      gridDataText : [],
      gridSelectedData : [],      // 그리드 체크박스 값
      MOD_FLAG : false,
      digParams :{},
      digTitle : '',
      CPI_YR : '',
      CPI_NM : '',
      PRGRS_STTS_CD : '',
      PLAN_SE_CD : '',

      validateRules: {
        PLAN_SE_CD: [
          v => !!v || '갬페인 구분은 필수 선택 항목 입니다.',
        ],
        CPI_NM: [
          v => !!v || '캠페인 명은 필수 입력 항목 입니다.',
        ],
        PLAN_CYCL: [
          v => !!v || '계획 회차는 필수 입력 항목 입니다.',
        ],
      },
      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
          REG : {alertDialogToggle: true, msg: '저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.saveYes, callNo: this.closeMsg}
          , MOD : {alertDialogToggle: true, msg: '수정하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.saveYes, callNo: this.closeMsg}
          , DEL : {alertDialogToggle: true, msg: '삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.delYes, callNo: this.closeMsg}
          , CLS : {alertDialogToggle: true, msg: '종료하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.closeYes, callNo: this.closeMsg}
          , STRT_NOW: { alertDialogToggle: true, msg: '해당 캠페인을 즉시 진행하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.btnStrtNow, callNo: this.closeMsg },
        },
        ALERT : {
          DEL_SUCCESS : {alertDialogToggle: true, msg: '삭제가 완료되었습니다', iconClass: 'is-info', type: 'default'}
          , REG_SUCCESS : {alertDialogToggle: true, msg: '저장이 완료되었습니다', iconClass: 'is-info', type: 'default'}
          , MOD_SUCCESS : {alertDialogToggle: true, msg: '수정이 완료되었습니다', iconClass: 'is-info', type: 'default'}
          , CLS_SUCCESS : {alertDialogToggle: true, msg: '종료가 완료되었습니다', iconClass: 'is-info', type: 'default'}
          , CHK_WARNING : {alertDialogToggle: true, msg: '선택된 항목이 없습니다.', iconClass: 'is-info', type: 'default'}
          , ETC1_WARNING : {alertDialogToggle: true, msg: '하나의 항목만 선택해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC2_WARNING : {alertDialogToggle: true, msg: '종료일은 시작일보다 빠를 수 없습니다.', iconClass: 'is-info', type: 'default'}
          , ETC3_WARNING : {alertDialogToggle: true, msg: '종료일은 오늘보다 빠를 수 없습니다.', iconClass: 'is-info', type: 'default'}
          , ETC4_WARNING : {alertDialogToggle: true, msg: '진행중인 건만 종료가 가능합니다.', iconClass: 'is-info', type: 'default'}
          , ETC5_WARNING : {alertDialogToggle: true, msg: '기간을 입력해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC6_WARNING : {alertDialogToggle: true, msg: '계획회차는 최소 1회 입니다.', iconClass: 'is-info', type: 'default'}
          , ETC7_WARNING : {alertDialogToggle: true, msg: '기간을 정확히 입력해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC8_WARNING : {alertDialogToggle: true, msg: '진행상태가 진행중인 건만 종료가 가능합니다.', iconClass: 'is-info', type: 'default'}
          , ETC9_WARNING : {alertDialogToggle: true, msg: '배분된 계획은 삭제할 수 없습니다.', iconClass: 'is-info', type: 'default'}
          , ETC10_WARNING : {alertDialogToggle: true, msg: '진행상태가 준비중인 항목만 삭제 가능합니다.', iconClass: 'is-info', type: 'default'}
          , ETC11_WARNING : {alertDialogToggle: true, msg: '진행상태가 준비중인 항목만 수정 가능합니다.', iconClass: 'is-info', type: 'default'}
          , ETC12_WARNING : {alertDialogToggle: true, msg: '계획회차는 최대 10회 입니다.', iconClass: 'is-info', type: 'default'}
          , ETC13_WARNING : {alertDialogToggle: true, msg: '배분된 계획은 수정할 수 없습니다.', iconClass: 'is-info', type: 'default'}
          , LMT_CNT_ERR : {alertDialogToggle: true, msg: '배분된 대상자 중 이미 계획회차를 넘은 인원이 있습니다.<br>계획회차를 수정해주세요', iconClass: 'is-info', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST : {
          REG_SUCCESS: {  msg: '저장이 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
          ,DEL_SUCCESS: {  msg: '삭제가 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
          ,MOD_SUCCESS: {  msg: '수정이 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
          ,CLS_SUCCESS: {  msg: '종료가 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
        },
      },

      selectedRow : '',

      CURRENT_DATE: '',
      STRT_NOW:true,
    }
  },

  watch: {

  },

  computed: {

  },

  beforeDestroy(){
    this.$eventBus.$off("selCompanyAction");//eventBus 중복방지를 위해 off
  },

  async created() {
    //상단 고객사 선택시 eventBus 실행(각 페이지별 필요에 의한 내용 구현)
    this.$eventBus.$on("selCompanyAction", (SELECTED_COMPANY) => {
      // console.log(`${this.$options.name} : =====>`, SELECTED_COMPANY.CD_NM);
    });
    //공통코드설정
    let codeName = [
                     'CMPN_ST'
                    ,'CMPN_CL'
                  ];
    this.common_code = await this.mixin_common_code_get_all(codeName, 'Y');
  },

  async mounted() {
    //진행년도 설정(금년기준 -5, +5)
    const date = new Date();
    const curYear = date.getFullYear();
    this.cpiYrItems.push({ text: '전체', value: '' });   // default
    for (let i = -5; i < 5; i++) {
      this.cpiYrItems.push({ text: `${curYear + i}년`, value: (curYear + i).toString() });
    }
    this.CPI_YR =  curYear.toString();
    this.btnSelectList(false);

    let CURRENT_DATE = await this.mixin_getSvrDate("YYYY-MM-DD");
    this.CURRENT_DATE = CURRENT_DATE;
  },

  methods: {
    //초기화
    init(){
      this.MOD_FLAG = false;
      this.digParams = {
        PLAN_SE_CD: '',
        CPI_BGNG_DT: this.nowDt,
        CPI_END_DT: this.nowDt,
        CPI_NM: '',
        RMRK: '',
        PLAN_CYCL: '',
        CPI_ID: '',
        CUSTCO_ID: '',
        PRGRS_STTS_CD: '',
        ALTMNT_YN: ''
      }
    },
    //등록
    btnShowMt(){
      this.digTitle = '캠페인 계획 등록';
      this.init();
      this.mixin_showDialog('RegSurvey');
      this.formReset();
      // this.dialog = true;
    },
    formReset(){
      //프로퍼티가 로드전에 호출되는 case가 있음.
      if(this.$refs.form) this.$refs.form.resetValidation();
    },
    //닫기
    closeDig(){
      this.mixin_hideDialog('RegSurvey');
      this.formReset();
      this.selectedRow = [];
      // this.dialog = false;
    },
    //조회
    async btnSelectList(next){
      //다음버튼 클릭 유무
      if (!next){
        this.init();
        this.gridDataText = [];
        this.gridSelectedData = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;
        this.gridTotalCnt = 0;
      }

      const sUrl = '/phone-api/campaign/plan/selectcpiplan';
      const postParam = {
        CPI_YR : this.CPI_YR
        ,PRGRS_STTS_CD : this.PRGRS_STTS_CD
        ,PLAN_SE_CD : this.PLAN_SE_CD
        ,CPI_NM : this.CPI_NM
      }
      const headParam = {
        head: {
          'SERVICE' : 'phone.campaign.plan.selectcpiplan',
          'METHOD' : 'selectcpiplan',
          'TYPE' : 'BIZ_SERVICE',
          'ROW_CNT' : this.pagination.rowsPerPage,
          'PAGES_CNT' : this.pagination.page,
          'PAGING' : "Y",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {
        let tempDataText = resData.DATA;
        let idx = this.gridDataText.length + 1;
        for(let i in tempDataText){
          tempDataText[i]["index"]= idx++;
        }
        this.gridDataText = [...this.gridDataText, ...tempDataText]
        if(resData.HEADER.next !== null && resData.HEADER.next !== undefined){
          if(resData.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }
        if(this.gridDataText.length > 0) this.gridTotalCnt = resData.DATA[0].TWB_PAGING_TOT_COUNT;


        //이부분은 체크해볼것
        this.pagination.page += 1
        // this.page=1;
      }
    },
    //저장시 필수 항목 체크
    saveValid(){
      let eFlag = true;
      const { digParams } = this;
      const { CPI_BGNG_DT, CPI_END_DT, SRVY_YR: currYear, PLAN_CYCL, PRGRS_STTS_CD, ALTMNT_YN} = digParams;

      if (this.mixin_isEmpty(CPI_BGNG_DT) || this.mixin_isEmpty(CPI_END_DT)) this.showAlert(this.MESSAGE.ALERT.ETC5_WARNING);
      else if (PLAN_CYCL < 1) this.showAlert(this.MESSAGE.ALERT.ETC6_WARNING);
      else if (PLAN_CYCL > 10) this.showAlert(this.MESSAGE.ALERT.ETC12_WARNING);
      else if (CPI_BGNG_DT.replace(/-/gi, '') > CPI_END_DT.replace(/-/gi, '')) this.showAlert(this.MESSAGE.ALERT.ETC2_WARNING);
      else if (CPI_END_DT.replace(/-/gi, '') < this.nowDt.replace(/-/gi, '')) this.showAlert(this.MESSAGE.ALERT.ETC3_WARNING);
      else if (CPI_BGNG_DT.length != 10 || CPI_END_DT.length != 10) this.showAlert(this.MESSAGE.ALERT.ETC7_WARNING);
      // else if (this.MOD_FLAG && PRGRS_STTS_CD !== 'PRPARG') this.showAlert(this.MESSAGE.ALERT.ETC11_WARNING);
      // else if (ALTMNT_YN === 'Y') this.showAlert(this.MESSAGE.ALERT.ETC13_WARNING);
      else eFlag = false; // 위의 모든 조건을 만족하지 않으면 eFlag를 false로 설정

      return eFlag;
    },
    //저장
    btnSave(){
      if(!this.validate()) return;
      if(this.saveValid()) return;
      this.showAlert((this.MOD_FLAG ? this.MESSAGE.CONFIRM.MOD : this.MESSAGE.CONFIRM.REG));
    },
    //저장실행
    async saveYes(){
      const sUrl = '/phone-api/campaign/plan/upsertcpiplan';
      const postParam = {
        MOD_FLAG : this.MOD_FLAG
        ,CPI_ID : (this.MOD_FLAG ? this.digParams.CPI_ID : '')
        ,CPI_NM : this.digParams.CPI_NM
        ,PLAN_SE_CD : this.digParams.PLAN_SE_CD
        ,CPI_BGNG_DT : `${this.digParams.CPI_BGNG_DT.replace(/-/gi, '')}000000`
        ,CPI_END_DT : `${this.digParams.CPI_END_DT.replace(/-/gi, '')}235959`
        ,PRGRS_STTS_CD : 'PRPARG'
        ,PLAN_CYCL : this.digParams.PLAN_CYCL
        ,RMRK : this.digParams.RMRK
        ,MDFCN_FLAG : this.digParams.PRGRS_STTS_CD!="PRPARG" ? "false" : "true"
      }
      const headParam = {
        head: {
          'SERVICE' : 'phone.campaign.plan.upsertcpiplan',
          'METHOD' : 'upsertcpiplan',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {
        // this.showAlert((this.MOD_FLAG ? this.MESSAGE.ALERT.MOD_SUCCESS : this.MESSAGE.ALERT.REG_SUCCESS));
        this.showToast((this.MOD_FLAG ? this.MESSAGE.TOAST.MOD_SUCCESS : this.MESSAGE.TOAST.REG_SUCCESS));
        this.closeMsg();
        this.mixin_hideDialog('RegSurvey');
        this.btnSelectList(false);
      }
    },
    // gridDbClick(item, row){
    //   this.gridSelectedData = [];
    //   this.gridSelectedData[0] = row.item;
    //   this.btnShowDtl();
    // },
    gridDbClick(item, row){
      this.selectedRow = [];
      this.selectedRow = row.item;
      this.btnShowDtl();
    },
    //상세보기
    btnShowDtl(){
  /*    if (this.gridSelectedData.length === 0) {
        this.showAlert(this.MESSAGE.ALERT.CHK_WARNING);
        return;
      } else if (this.gridSelectedData.length > 1) {
        this.showAlert(this.MESSAGE.ALERT.ETC1_WARNING);
        return;
      } */
      if (this.selectedRow.length === 0) {
        this.showAlert(this.MESSAGE.ALERT.CHK_WARNING);
        return;
      } else if (this.selectedRow.length > 1) {
        this.showAlert(this.MESSAGE.ALERT.ETC1_WARNING);
        return;
      }

      this.MOD_FLAG = true;
      this.digTitle = '캠페인 계획 수정';

      const selectedData = this.selectedRow; // 그리드에서 선택된 데이터 중 첫번째 데이터 가져오기
      // console.log("selectedData",selectedData)
      this.digParams = { // 다이얼로그에 전달할 파라미터 설정
        PLAN_SE_CD: selectedData.PLAN_SE_CD,
        CPI_BGNG_DT: selectedData.CPI_BGNG_DT,
        CPI_END_DT: selectedData.CPI_END_DT,
        CPI_NM: selectedData.CPI_NM,
        RMRK: selectedData.RMRK,
        PLAN_CYCL: selectedData.PLAN_CYCL,
        CPI_ID: selectedData.CPI_ID,
        CUSTCO_ID: selectedData.CUSTCO_ID,
        PRGRS_STTS_CD: selectedData.PRGRS_STTS_CD,
        ALTMNT_YN: selectedData.ALTMNT_YN
      };

      this.mixin_showDialog('RegSurvey');
    },
    //삭제시 항목 체크
    delValid(){
      //한건만 삭제하도록 변경 2023-05-22
      if(this.gridSelectedData.length > 1){
        this.showAlert(this.MESSAGE.ALERT.ETC1_WARNING);
        return false;
      }
      //선택되지 않은 경우
      if(this.gridSelectedData.length === 0){
        this.showAlert(this.MESSAGE.ALERT.CHK_WARNING);
        return false;
      }
      if (this.gridSelectedData[0].PRGRS_STTS_CD !== 'PRPARG') {
        this.showAlert(this.MESSAGE.ALERT.ETC10_WARNING);
        return false;
      }
      if (this.gridSelectedData[0].ALTMNT_YN === 'Y') {
        this.showAlert(this.MESSAGE.ALERT.ETC9_WARNING);
        return false;
      }

      return true;
    },
    //삭제
    btnDelete(){
      if(!this.delValid()) return;
      this.showAlert(this.MESSAGE.CONFIRM.DEL);
    },
    //삭제실행
    async delYes(){
      const sUrl = '/phone-api/campaign/plan/deletecpiplan';
      const postParam = {
        sendData: {}
      }
      const headParam = {
        head: {
          'SERVICE' : 'phone.campaign.plan.deletecpiplan',
          'METHOD' : 'deletecpiplan',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      postParam.sendData["oData"] = this.gridSelectedData;

      let resData = await this.common_postCall(sUrl, postParam.sendData, headParam );


      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {
        // this.showAlert(this.MESSAGE.ALERT.DEL_SUCCESS);
        this.showToast(this.MESSAGE.TOAST.DEL_SUCCESS);
        this.closeMsg();
        this.btnSelectList(false);
      }
    },
    //메시지창 종료
    closeMsg(){
      this.$store.commit('alertStore/hideAlert');
    },
    //종료
    btnClose(){
      if (this.selectedRow.PRGRS_STTS_CD !== 'ONGONG'){
        this.showAlert(this.MESSAGE.ALERT.ETC8_WARNING);
        return;
      }

      if(this.digParams.CPI_END_DT.replace(/-/gi, '') > this.nowDt.replace(/-/gi, '')) this.MESSAGE.CONFIRM.CLS.msg = '캠페인 종료기간이 도래되지 않았습니다.<br>종료하시겠습니까?';
      this.showAlert(this.MESSAGE.CONFIRM.CLS);
    },
    //종료 실행
    async closeYes(){
      const sUrl = '/phone-api/campaign/plan/closecpiplan';
      const postParam = {
        CPI_ID : this.digParams.CPI_ID     // 설문id
        ,CUSTCO_ID : this.digParams.CUSTCO_ID     // 회사코드
      }
      const headParam = {
        head: {
          'SERVICE' : 'phone.campaign.plan.closecpiplan',
          'METHOD' : 'closecpiplan',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );


      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {
        // this.showAlert(this.MESSAGE.ALERT.CLS_SUCCESS);
        this.showToast(this.MESSAGE.TOAST.CLS_SUCCESS);
        this.closeMsg();
        this.mixin_hideDialog('RegSurvey');
        this.btnSelectList(false);
      }
    },
    displayStatus(type) {
      const typeList = [
        { type_list_text: 'wait', type_list_type: 'PRPARG' }, //준비중,
        { type_list_text: 'done', type_list_type: 'PUBCMP' }, //게시완료
        { type_list_text: 'cs', type_list_type: 'ONGONG' }, //진행중
        { type_list_text: 'after', type_list_type: 'TERMIAT' }, //종료
      ];

      for (let i = 0; i < typeList.length; i++) {
        if (typeList[i].type_list_type === type) {
          return typeList[i].type_list_text;
        }
      }
    },
    //validate check
    validate () {
      return this.$refs.form.validate();
    },
    //api오류
    setErrMsg(res){
      // console.log("res", res);
      if(res.HEADER.ERROR_MSG == 'LMT_CNT_ERR') this.showAlert(this.MESSAGE.ALERT.LMT_CNT_ERR);
      // if(res.HEADER.ERROR_MSG == 'DEL_ALT') this.showAlert(this.MESSAGE.ALERT.ETC9_WARNING);
      // else if(res.HEADER.ERROR_MSG == 'DEL_STTS') this.showAlert(this.MESSAGE.ALERT.ETC10_WARNING);
      // else if(res.HEADER.ERROR_MSG == 'REG_STTS') this.showAlert(this.MESSAGE.ALERT.ETC11_WARNING);
      // else if(res.HEADER.ERROR_MSG == 'CLS_STTS') this.showAlert(this.MESSAGE.ALERT.ETC8_WARNING);
      // else this.showAlert(this.MESSAGE.ERROR.ERROR);
    },
    
    rowSelect(item) {
      this.selectedRow = item;
      // console.log(this.selectedRow);

      this.STRT_NOW = (this.selectedRow.CPI_BGNG_DT == this.CURRENT_DATE && this.selectedRow.REG_DT == this.CURRENT_DATE && this.selectedRow.PRGRS_STTS_CD == 'PRPARG') ? false : true;
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    //즉시진행
    async btnStrtNow(){
      let sUrl = "/phone-api/campaign/plan/strtNow";
      let postParam = {
        CPI_ID: this.selectedRow.CPI_ID,
      };
      let headParam = {};

      let resData = await this.common_postCall(sUrl, postParam, headParam)

      if (!resData.HEADER.ERROR_FLAG){
        this.closeMsg();
        this.selectedRow = {};
        this.STRT_NOW = true;
        this.btnSelectList();
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>