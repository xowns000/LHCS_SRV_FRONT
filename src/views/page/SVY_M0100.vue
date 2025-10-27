<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                진행 년도
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="srvyYrItems"
                  v-model="SRVY_YR"
                  placeholder="선택하세요"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">진행 상태</span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(this.common_code, 'PROG_ST', '전체')"
                  placeholder="선택하세요"
                  v-model="STTS_CD"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">계획 구분</span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(this.common_code, 'SUVY_CL', '전체')"
                  placeholder="선택하세요"
                  v-model="SRVY_SE_CD"
                ></v-select>
              </div>
            </div>
            <!-- <div class="pl-form-inline">
              <span class="pl-label">게시 여부</span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="dropItems4"
                  placeholder="선택하세요"
                  v-model="cmbPsthYn"
                ></v-select>
              </div>
            </div> -->
            <div class="pl-form-inline">
              <span class="pl-label">설문조사 명</span>
              <div class="pl-desc">
                <v-text-field class="pl-form is-lg" v-model="SRVY_NM" @keyup.enter="btnSelectList(false)"></v-text-field>
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
            <v-btn class="pl-btn is-icon is-sub" @click="btnShowDtl" :disabled="selectedRow.ROW_NUMBER != undefined ? false : true">
              <span class="pl-icon20 document"></span>
              선택항목 상세
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub" @click="btnShowMt">
              <span class="pl-icon20 circle-plus"></span>
              등록
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub" @click="btnDelete" :disabled="gridSelectedData.length != 0 ? false : true">
              <span class="pl-icon20 trash"></span>
              삭제
            </v-btn>
            <v-btn 
              class="pl-btn is-icon is-sub" 
              @click="btnClose"
              :disabled="gridSelectedData && gridSelectedData.length == 1 && gridSelectedData[0].STTS_CD == 'ONGONG' ? false : true">
              설문 종료
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ gridTotalCnt }})</em> 건</span>
          </div>
        </div>
        <v-data-table
          class="pl-grid has-control is-hover"
          show-select
          single-select
          :headers="gridDataHeaders"
          :items="gridDataText"
          v-model="gridSelectedData"
          fixed-header
          item-key="index"
          height="562px"
          :items-per-page="ROW_PER_PAGE"
          @click:row="rowSelect"
          @dblclick:row="btnShowDtl"
          hide-default-footer
          :page.sync="page"
          no-data-text="등록된 데이터가 없습니다."
          :item-class="isActiveRow"
          @page-count="pageCount = $event">
          <template v-slot:item.STTS_NM="{ item }">
            <span :class="`pl-round-chip is-sm chat-stat-${displayStatus(item.STTS_CD)}`">
              {{ item.STTS_NM }}
            </span>
            <!-- <span :class="`is-txt-${displayStatus(item.STTS_CD)}`">
              {{ item.STTS_NM }}
            </span> -->
            <!-- <v-chip
              :color="getColor(item.STTS_CD)"
              dark
            >
              {{ item.STTS_NM }}
            </v-chip> -->
          </template>
          <template v-slot:item.STTS_CD="{ item }">
            <compo-tooltip-btn 
              v-if="parseInt(item.HSTRY_CNT) > 0"
              TitleProp="검토 의견 보기" ClassProp="pl-tooltip-btn" IconProp="pl-icon20 document"
              TooltipPositionProp="bottom" @btnClick="openSttsHistory(item)"></compo-tooltip-btn>
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
              @btnClick="btnSelectList('true')"
            ></compo-tooltip-btn>
            <!-- <v-btn
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
            <p>필수 항목을 입력하신 후 <strong>[저장]</strong> 버튼을 클릭하십시오.</p>
            <div class="pl-form-inline-wrap vertical mt-2">
              <div class="pl-form-inline">
                <span class="pl-label">
                  진행 년도
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    :items="srvyYnCmbItems"
                    placeholder="선택하세요"
                    v-model="digParams.SRVY_YR"
                    required
                    :rules="validateRules.SRVY_YR"
                    :disabled = "selectedRow.STTS_CD === undefined || selectedRow.STTS_CD == 'PRPARG' || selectedRow.STTS_CD == 'RFSL' ? false : true"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  계획 구분
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    :items="mixin_common_code_get(this.common_code, 'SUVY_CL', '')"
                    placeholder="선택하세요"
                    v-model="digParams.SRVY_SE_CD"
                    required
                    :rules="validateRules.SRVY_SE_CD"
                    :disabled = "selectedRow.STTS_CD === undefined || selectedRow.STTS_CD == 'PRPARG' || selectedRow.STTS_CD == 'RFSL' ? false : true"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  설문조사 명
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    v-model="digParams.SRVY_NM"
                    required
                    :rules="validateRules.SRVY_NM"
                    v-byte-counter="200"
                    :disabled = "selectedRow.STTS_CD === undefined || selectedRow.STTS_CD === 'PRPARG' || selectedRow.STTS_CD == 'RFSL' ? false : true"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  설문 시작일시
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  
                  <compo-date-picker
                    DateType="dateTime"
                    :DateProp.sync="startDate"
                    :TimesProp.sync="startTime"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  설문 종료일시
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <compo-date-picker
                    DateType="dateTime"
                    :DateProp.sync="endDate"
                    :TimesProp.sync="endTime"
                  />
                </div>
              </div>
              <div class="pl-form-inline" v-show="envSrvyTrgtDsgnUseYn">
                <span class="pl-label">
                  대상지정여부
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-radio-group
                    row
                    class="pl-radio-group"
                    v-model="digParams.TRGT_DSGN_YN"
                    required
                    :rules="validateRules.TRGT_DSGN_YN"
                    :disabled = "selectedRow.STTS_CD === undefined || selectedRow.STTS_CD == 'PRPARG' || selectedRow.STTS_CD == 'RFSL' ? false : true"
                  >
                    <v-radio
                      v-for="(rad01, index) in radioGroup"
                      :key="radioGroup[index].text"
                      :label="rad01.text"
                      :value="rad01.value"
                      class="pl-radio"
                    >
                    </v-radio>
                  </v-radio-group>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  목표 인원
                  <!-- <v-icon class="pl-icon20 required"></v-icon> -->
                  <compo-tooltip-btn
                    TitleProp="설문조사에 응답을 예상하는 목표 인원을 지정 시<br>우측의 체크박스를 체크하시고 목표 인원을 입력하십시오."
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 question"
                    TooltipPositionProp="bottom"
                    v-byte-counter="4"
                  ></compo-tooltip-btn>
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form align-right"
                    hide-spin-buttons
                    oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                    suffix="명"
                    v-model="digParams.GOAL_PSNAL"
                    :disabled="!this.digParams.GOAL_PSNAL_DSGN_YN || (selectedRow.STTS_CD === undefined || selectedRow.STTS_CD == 'PRPARG' || selectedRow.STTS_CD == 'RFSL' ? false : true)"
                    type="number"
                  />
                  <v-checkbox
                    class="pl-check"
                    label="목표인원 지정"
                    v-model="digParams.GOAL_PSNAL_DSGN_YN"
                    :disabled = "selectedRow.STTS_CD === undefined || selectedRow.STTS_CD == 'PRPARG' || selectedRow.STTS_CD == 'RFSL' ? false : true"
                  ></v-checkbox>
                </div>
              </div>

              <div class="pl-form-inline">
                <span class="pl-label">설명</span>
                <div class="pl-desc">
                  <v-textarea
                    class="pl-form is-noresize"
                    :rules="validateRules.SRVY_EXPLN"
                    placeholder="코드설명 내용 입력"
                    v-model="digParams.SRVY_EXPLN"
                    v-byte-counter="4000"
                    :disabled = "selectedRow.STTS_CD === undefined || selectedRow.STTS_CD == 'PRPARG' || selectedRow.STTS_CD == 'RFSL' ? false : true"
                    :spellcheck="false"
                  />
                </div>
              </div>
            </div>
          </v-form>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="closeDig">닫기</v-btn>
          <v-btn class="pl-btn" v-if="digParams.STTS_CD == '' || digParams.STTS_CD == 'PRPARG' || digParams.STTS_CD == 'RFSL'" @click="btnSave">저장</v-btn>
        </template>

      </compo-dialog>
    </v-dialog>

    <!-- 검토 의견 보기 다이얼로그 -->
    <CompoSvySttsHistory
      v-if="dialogOpenSttsHistory"
      :DataProp="{'SRVY_ID': HISTORY_SRVY_ID}"
      @closeDialog="closeSttsHistory"
    />
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import CompoSvySttsHistory from '@/components/svy/CompoSvySttsHistory.vue';

  export default {
  name: "MENU_SVY_M0100", //name은 'MENU_' + 파일명 조합
  components: {
    CompoSvySttsHistory
  },
  data() {
    return {
      envSrvyTrgtDsgnUseYn: true,

      // top search
      srvyYrItems: [],
      srvyYnCmbItems: [],

      // dialog
      dialogRegSurvey: false,

      //검토 의견 보기 다이얼로그 오픈 여부
      dialogOpenSttsHistory: false, 
      //검토 의견 보기 설문_ID
      HISTORY_SRVY_ID: '',

      // textareaRules: [v => v.length <= 200 || 'Max 200 characters'],
      // textareaValue: '200자 제한!',
      radioGroup: [
        { text: '지정함', value: 'Y'},
        { text: '지정하지 않음', value: 'N'},
      ],

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
        { text: '번호',               value: 'ROW_NUMBER',        align: 'center', width: '80px' },
        { text: '진행년도',           value: 'SRVY_YR_NM',        align: 'left',   width: '100px' },
        { text: '설문조사명',         value: 'SRVY_NM',           align: 'left',   width: '100%' },
        { text: '설문시작일',         value: 'SRVY_BGNG_DT_F',      align: 'center', width: '140px' },
        { text: '설문종료일',         value: 'SRVY_END_DT_F',       align: 'center', width: '140px' },
        { text: '계획구분',           value: 'SRVY_SE_NM',        align: 'center', width: '120px' },
        { text: '목표인원',           value: 'GOAL_PSNAL',        align: 'center',  width: '100px' },
        { text: '진행상태',           value: 'STTS_NM',           align: 'center', width: '100px' },
        { text: '검토 의견',          value: 'STTS_CD',           align: 'center', width: '90px', sortable: false },
        { text: '등록그룹수',         value: 'GRP_CNT',           align: 'center', width: '100px' },
        { text: '등록자',             value: 'RGTR_ID',           align: 'center', width: '100px' },
        { text: '등록일',             value: 'REG_DT',            align: 'center', width: '180px' },

        { text: '설문id',            value: 'SRVY_ID',            align: ' d-none' },
        { text: '고객사id',          value: 'CUSTCO_ID',          align: ' d-none' },
        { text: '진행년도',          value: 'SRVY_YR',            align: ' d-none' },
        { text: '계획구분코드',      value: 'SRVY_SE_CD',         align: ' d-none' },
        { text: '목표인원지정여부',   value: 'GOAL_PSNAL_DSGN_YN', align: ' d-none' },
        { text: '설명',              value: 'SRVY_EXPLN',         align: ' d-none' },
        { text: '진행상태코드',       value: 'STTS_CD',            align: ' d-none' },
        { text: '대상자지정여부',     value: 'TRGT_DSGN_YN',       align: ' d-none' },
      ],
      gridDataText: [],
      common_code: [],
      digParams:{},
      digTitle: '',
      gridSelectedData: [],      // 그리드 체크박스 값
      selectedRow : {},           // 그리드 선택 값
      MOD_FLAG: false,
      nowDt: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
      //el v-model 변수
      SRVY_YR: '',
      SRVY_SE_CD: '',
      STTS_CD: '',
      SRVY_NM: '',

      startDate: '',
      endDate: '',
      startTime: "00:00",
      endTime: "23:59",

      // valid : true,
      validateRules: {
        SRVY_YR: [
          v => !!v || '진행년도는 필수 선택 항목 입니다.',
        ],
        SRVY_SE_CD: [
          v => !!v || '계획구분은 필수 선택 항목 입니다.',
        ],
        SRVY_NM: [
          v => !!v || '설문조사명은 필수 입력 항목 입니다.',
        ],
        TRGT_DSGN_YN: [
          v => !!v || '대상지정여부는 필수 선택 항목 입니다.',
        ],
        SRVY_EXPLN: [
          v => v.length <= 200 || 'Max 200 characters'
        ],
      },
      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
          REG : {alertDialogToggle: true, msg: '저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.saveYes, callNo: this.closeMsg}
          , MOD : {alertDialogToggle: true, msg: '수정하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.saveYes, callNo: this.closeMsg}
          , DEL : {alertDialogToggle: true, msg: '삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.delYes, callNo: this.closeMsg}
          , CLS : {alertDialogToggle: true, msg: '종료하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.closeYes, callNo: this.closeMsg}
        },
        ALERT : {
          DEL_SUCCESS : {alertDialogToggle: true, msg: '삭제가 완료되었습니다', iconClass: 'is-info', type: 'default'}
          , REG_SUCCESS : {alertDialogToggle: true, msg: '저장이 완료되었습니다', iconClass: 'is-info', type: 'default'}
          , MOD_SUCCESS : {alertDialogToggle: true, msg: '수정이 완료되었습니다', iconClass: 'is-info', type: 'default'}
          , CLS_SUCCESS : {alertDialogToggle: true, msg: '종료가 완료되었습니다', iconClass: 'is-info', type: 'default'}
          , CHK_WARNING : {alertDialogToggle: true, msg: '선택된 항목이 없습니다.', iconClass: 'is-info', type: 'default'}
          , ETC1_WARNING : {alertDialogToggle: true, msg: '하나의 항목만 선택해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC2_WARNING : {alertDialogToggle: true, msg: '진행년도는 설문기간에 포함되어야 합니다.', iconClass: 'is-info', type: 'default'}
          , ETC3_WARNING : {alertDialogToggle: true, msg: '종료일은 시작일보다 빠를 수 없습니다.', iconClass: 'is-info', type: 'default'}
          , ETC4_WARNING : {alertDialogToggle: true, msg: '종료일은 오늘보다 빠를 수 없습니다.', iconClass: 'is-info', type: 'default'}
          , ETC5_WARNING : {alertDialogToggle: true, msg: '설문이 진행중인 건만 종료가 가능합니다.', iconClass: 'is-info', type: 'default'}
          , ETC6_WARNING : {alertDialogToggle: true, msg: '그룹이 등록된 계획은 삭제할 수 없습니다.', iconClass: 'is-info', type: 'default'}
          , ETC7_WARNING : {alertDialogToggle: true, msg: '진행상태가 준비중인 항목만 삭제 가능합니다.', iconClass: 'is-info', type: 'default'}
          , ETC8_WARNING : {alertDialogToggle: true, msg: '진행상태가 준비중, 승인반려인 항목만 수정 가능합니다.', iconClass: 'is-info', type: 'default'}
          , ETC9_WARNING : {alertDialogToggle: true, msg: '목표인원을 입력해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC10_WARNING : {alertDialogToggle: true, msg: '설문기간을 입력해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC11_WARNING : {alertDialogToggle: true, msg: '설문기간을 정확히 입력해 주세요.', iconClass: 'is-info', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST : {
          DEL_SUCCESS :   {  msg: '삭제가 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          , REG_SUCCESS : {  msg: '저장이 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          , MOD_SUCCESS : {  msg: '수정이 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          , CLS_SUCCESS : {  msg: '종료가 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
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
    let codeName = [
                     'SUVY_CL'
                    ,'PROG_ST'
                  ];
    this.common_code = await this.mixin_common_code_get_all(codeName, 'Y');

    
  },

  mounted() {
    //진행년도 설정(금년기준 -5, +5)
    const date = new Date();
    const curYear = date.getFullYear();
    this.srvyYrItems.push({ text: '전체', value: '' });   // default
    for (let i = -5; i < 5; i++) {
      this.srvyYrItems.push({ text: `${curYear + i}년`, value: (curYear + i).toString() });
      //등록팝업 년도 설정 (금년도부터 내년)
      if(i === 0 || i === 1){
        this.srvyYnCmbItems.push({ text: `${curYear + i}년`, value: (curYear + i).toString() });
      }
    }
    this.SRVY_YR =  curYear.toString();
    this.btnSelectList(false);
  },

  methods: {
    //초기화
    init(){
      this.MOD_FLAG = false;
      const date = new Date();
      const curYear = date.getFullYear();
      this.digParams = {
        SRVY_YR: curYear.toString(),  // 다이얼로그 진행년도
        SRVY_SE_CD: '',            // 다이얼로그 계획구분
        SRVY_NM: '',              // 다이얼로그 설문조사명
        SRVY_BGNG_DT: this.nowDt,   // 다이얼로그 설문기간 FROM
        SRVY_END_DT: this.nowDt,    // 다이얼로그 설문기간 TO
        TRGT_DSGN_YN: 'Y',          // 다이얼로그 대상지정여부
        GOAL_PSNAL: '',           // 다이얼로그 목표인원
        GOAL_PSNAL_DSGN_YN: false,  // 다이얼로그 목표인원 체크박스
        SRVY_EXPLN: '',           // 다이얼로그 설명
        STTS_CD: '',          // 진행상태코드
        SRVY_ID: '',                // 설문id
      }
      this.startDate = this.nowDt;
      this.endDate = this.nowDt;
      this.startTime = "00:00";
      this.endTime = "23:59";
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

      const sUrl = '/api/svy/plan/selectlistplan';
      const postParam = {
        SRVY_YR : this.SRVY_YR            // 설문_연도
        ,SRVY_SE_CD : this.SRVY_SE_CD     // 설문_구분_코드
        ,STTS_CD : this.STTS_CD           // 진행_상태_코드
        ,SRVY_NM : this.SRVY_NM           // 설문_명
      }
      const headParam = {
        head: {
          'SERVICE' : 'svy.plan.selectlistplan',
          'METHOD' : 'selectlistplan',
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

        if(resData.DATA.length > 0){
          resData.DATA.forEach((data, idx) => {
            data.SRVY_BGNG_DT_F = data.SRVY_BGNG_DT.indexOf('-')>-1?data.SRVY_BGNG_DT:this.mixin_convertDate(data.SRVY_BGNG_DT, 'yyyy-MM-dd HH:mm:ss');
            data.SRVY_END_DT_F = data.SRVY_END_DT.indexOf('-')>-1?data.SRVY_END_DT:this.mixin_convertDate(data.SRVY_END_DT, 'yyyy-MM-dd HH:mm:ss');
            data.REG_DT = data.REG_DT.indexOf('-')>-1?data.REG_DT:this.mixin_convertDate(data.REG_DT, 'yyyy-MM-dd HH:mm:ss');
          });
        }

        let tempDataText = resData.DATA;
        let idx = this.gridDataText.length + 1;
        for(let i in tempDataText){
          tempDataText[i]["index"]= idx++;
          tempDataText[i]["SRVY_NM"]=this.mixin_decode(tempDataText[i]["SRVY_NM"]) ;
          tempDataText[i]["SRVY_EXPLN"]=this.mixin_decode(tempDataText[i]["SRVY_EXPLN"]) ;
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
/*    gridDbClick(item, row){
      // this.gridSelectedData = [];
      // this.gridSelectedData[0] = row.item;
      this.selectedRow = row.item
      this.btnShowDtl();
    },*/
    //상세보기
    async btnShowDtl(){
      //설문 대상지정 사용 여부
      this.envSrvyTrgtDsgnUseYn = this.mixin_getCustcoSetting('ENV_SRVY_TRGT_DSGN_USE_YN');

      // 그리드 변경에 따른 주석처리
      // if (this.gridSelectedData.length === 0) {
      //   this.showAlert(this.MESSAGE.ALERT.CHK_WARNING);
      //   return;
      // } else if (this.gridSelectedData.length > 1) {
      //   this.showAlert(this.MESSAGE.ALERT.ETC1_WARNING);
      //   return;
      // }

      this.MOD_FLAG = true;
      this.digTitle = '설문조사 계획 수정';

      // const selectedData = this.gridSelectedData[0]; // 그리드에서 선택된 데이터 중 첫번째 데이터 가져오기
      const selectedData = this.selectedRow; // 그리드에서 선택된 데이터
      this.digParams = { // 다이얼로그에 전달할 파라미터 설정
        SRVY_YR: selectedData.SRVY_YR,
        SRVY_SE_CD: selectedData.SRVY_SE_CD,
        SRVY_NM: selectedData.SRVY_NM,
        SRVY_BGNG_DT: selectedData.SRVY_BGNG_DT,
        SRVY_END_DT: selectedData.SRVY_END_DT,
        TRGT_DSGN_YN: selectedData.TRGT_DSGN_YN,
        GOAL_PSNAL_DSGN_YN: selectedData.GOAL_PSNAL_DSGN_YN === 'Y',
        GOAL_PSNAL: selectedData.GOAL_PSNAL,
        SRVY_EXPLN: selectedData.SRVY_EXPLN,
        STTS_CD: selectedData.STTS_CD,
        SRVY_ID: selectedData.SRVY_ID,
      };
      this.startDate = this.mixin_convertDate(this.digParams.SRVY_BGNG_DT, 'yyyy-MM-dd');
      this.endDate = this.mixin_convertDate(this.digParams.SRVY_END_DT, 'yyyy-MM-dd');
      this.startTime = this.mixin_convertDate(this.digParams.SRVY_BGNG_DT, 'HH:mm');
      this.endTime = this.mixin_convertDate(this.digParams.SRVY_END_DT, 'HH:mm');

      this.mixin_showDialog('RegSurvey');
    },
    //등록
    btnShowMt(){
      //설문 대상지정 사용 여부
      this.envSrvyTrgtDsgnUseYn = this.mixin_getCustcoSetting('ENV_SRVY_TRGT_DSGN_USE_YN');
      this.digTitle = '설문조사 계획 등록';
      this.selectedRow={};
      this.init();
      this.mixin_showDialog('RegSurvey');
      this.formReset();
      // this.dialog = true;
    },
    //닫기
    closeDig(){
      this.mixin_hideDialog('RegSurvey');
      this.formReset();
      // this.dialog = false;
    },
    formReset(){
      //프로퍼티가 로드전에 호출되는 case가 있음.
      if(this.$refs.form) this.$refs.form.resetValidation();
    },
    //저장시 필수 항목 체크
    saveValid(){
      this.digParams.SRVY_BGNG_DT = this.startDate.replace(/-/gi, '')+this.startTime.replace(/:/gi, '')+'00'
      this.digParams.SRVY_END_DT = this.endDate.replace(/-/gi, '')+this.endTime.replace(/:/gi, '')+'59'

      let eFlag = true;
      const { digParams } = this;
      
      const { SRVY_BGNG_DT: fromYear, SRVY_END_DT: toYear, SRVY_YR: currYear, TRGT_DSGN_YN, GOAL_PSNAL_DSGN_YN, GOAL_PSNAL} = digParams;
      if (this.mixin_isEmpty(fromYear) || this.mixin_isEmpty(toYear)) this.showAlert(this.MESSAGE.ALERT.ETC10_WARNING);
      else if (GOAL_PSNAL_DSGN_YN && (this.mixin_isEmpty(GOAL_PSNAL) || GOAL_PSNAL < 1)) this.showAlert(this.MESSAGE.ALERT.ETC9_WARNING);
      else if (![fromYear, toYear].some((year) => year.substr(0, 4) === currYear)) this.showAlert(this.MESSAGE.ALERT.ETC2_WARNING);
      else if (fromYear.replace(/-/gi, '') > toYear.replace(/-/gi, '')) this.showAlert(this.MESSAGE.ALERT.ETC3_WARNING);
      else if (toYear.replace(/-/gi, '') < this.nowDt.replace(/-/gi, '')) this.showAlert(this.MESSAGE.ALERT.ETC4_WARNING);
      else if (fromYear.length != 14 || toYear.length != 14) this.showAlert(this.MESSAGE.ALERT.ETC11_WARNING);
      else eFlag = false; // 위의 모든 조건을 만족하지 않으면 eFlag를 false로 설정

      return eFlag;
    },
    //저장
    btnSave(){
      if(this.digParams.STTS_CD != '' && this.digParams.STTS_CD != 'PRPARG' && this.digParams.STTS_CD != 'RFSL') {
        this.showAlert(this.MESSAGE.ALERT.ETC8_WARNING);
        return;
      }
      if(!this.validate()) return;
      if(this.saveValid()) return;
      this.showAlert((this.MOD_FLAG ? this.MESSAGE.CONFIRM.MOD : this.MESSAGE.CONFIRM.REG));
    },
    //저장실행
    async saveYes(){
      this.closeMsg();
      const sUrl = '/api/svy/plan/upsertlistplan';
      const postParam = {
        MOD_FLAG : this.MOD_FLAG                                              // 수정여부
        ,SRVY_ID : (this.MOD_FLAG ? this.digParams.SRVY_ID : '')              // 설문_ID
        ,SRVY_YR : this.digParams.SRVY_YR                                     // 설문_연도
        ,SRVY_SE_CD : this.digParams.SRVY_SE_CD                               // 설문_구분_코드
        ,STTS_CD : 'PRPARG'                                                   // 진행_상태_코드, 디폴트 준비중
        ,SRVY_NM : this.digParams.SRVY_NM                                     // 설문_명
        ,SRVY_BGNG_DT : this.digParams.SRVY_BGNG_DT // 설문_시작_일시
        ,SRVY_END_DT : this.digParams.SRVY_END_DT // 설문_종료_일시
        ,GOAL_PSNAL_DSGN_YN : (this.digParams.GOAL_PSNAL_DSGN_YN ? 'Y' : 'N') // 목표_인원_지정_여부
        ,GOAL_PSNAL : this.digParams.GOAL_PSNAL                               // 목표_인원
        ,SRVY_EXPLN : this.digParams.SRVY_EXPLN                               // 설문_설명
        ,TRGT_DSGN_YN : this.digParams.TRGT_DSGN_YN                           // 대상_지정_여부
        ,PSTG_YN : 'N'                                                        // 게시여부, 디폴트 N
      }
      const headParam = {
        head: {
          'SERVICE' : 'svy.plan.upsertlistplan',
          'METHOD' : 'upsertlistplan',
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
        
        this.showToast((this.MOD_FLAG ? this.MESSAGE.TOAST.MOD_SUCCESS : this.MESSAGE.TOAST.REG_SUCCESS));
        this.mixin_hideDialog('RegSurvey');
        this.btnSelectList(false);
      }
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
      return true;
    },
    //삭제
    btnDelete(){
      if(!this.delValid()) return;
      this.showAlert(this.MESSAGE.CONFIRM.DEL);
    },
    //삭제실행
    async delYes(){
      const sUrl = '/api/svy/plan/deletelistplan';
      const postParam = {
        sendData: {}
      }
      const headParam = {
        head: {
          'SERVICE' : 'svy.plan.deletelistplan',
          'METHOD' : 'deletelistplan',
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
        this.showAlert(this.MESSAGE.ALERT.DEL_SUCCESS);
        this.btnSelectList(false);
      }
    },
    //메시지창 종료
    closeMsg(){
      this.$store.commit('alertStore/hideAlert');
    },
    //종료
    btnClose(){
      if(this.gridSelectedData[0].SRVY_END_DT.replace(/-/gi, '') > this.nowDt.replace(/-/gi, '')) this.MESSAGE.CONFIRM.CLS.msg = '설문종료기간이 도래되지 않았습니다.<br>종료하시겠습니까?';
      this.showAlert(this.MESSAGE.CONFIRM.CLS);
    },
    //종료 실행
    async closeYes(){
      const sUrl = '/api/svy/plan/closelistplan';
      const postParam = {
        SRVY_ID : this.gridSelectedData[0].SRVY_ID,     // 설문id
        STTS_CD : 'TERMIAT'
      }
      const headParam = {
        head: {}
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );


      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {
        this.closeMsg();
        // this.showAlert(this.MESSAGE.ALERT.CLS_SUCCESS);
        this.showToast(this.MESSAGE.TOAST.CLS_SUCCESS);
        this.mixin_hideDialog('RegSurvey');
        this.btnSelectList(false);
      }
    },
    //그리드 컬럼 색상 설정
    // getColor(e){
    //   switch(e){
    //     case 'PRPARG' : return 'green'
    //     case 'PUBCMP' : return 'blue'
    //     case 'ONGONG' : return 'orange'
    //     case 'TERMIAT' : return 'red'
    //     default : 'black'
    //   }
    // },
    displayStatus(type) {
      const typeList = [
      { type_list_text: 'wait', type_list_type: 'PRPARG' }, //준비중, 주황
        { type_list_text: 'wait', type_list_type: 'RDY' }, //승인대기, 주황
        { type_list_text: 'wait', type_list_type: 'RFSL' }, //승인반려, 주황
        { type_list_text: 'wait', type_list_type: 'RTRVL' }, //승인회수, 주황
        { type_list_text: 'done', type_list_type: 'APPR' }, //승인완료 녹색
        { type_list_text: 'cs', type_list_type: 'PUBCMP' }, //승인완료 녹색
        { type_list_text: 'cs', type_list_type: 'ONGONG' }, //진행중 파란색
        { type_list_text: 'after', type_list_type: 'TERMIAT' }, //종료 보라색
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
      if(res.HEADER.ERROR_MSG == 'DEL_GRP') this.showAlert(this.MESSAGE.ALERT.ETC6_WARNING);
      else if(res.HEADER.ERROR_MSG == 'DEL_STTS') this.showAlert(this.MESSAGE.ALERT.ETC7_WARNING);
      else if(res.HEADER.ERROR_MSG == 'REG_STTS') this.showAlert(this.MESSAGE.ALERT.ETC8_WARNING);
      else if(res.HEADER.ERROR_MSG == 'CLS_STTS') this.showAlert(this.MESSAGE.ALERT.ETC5_WARNING);
      else this.showAlert(this.MESSAGE.ERROR.ERROR);
    },
    rowSelect(idx) {
      this.selectedRow = idx;
      // this.getIpExtSelect(idx);
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },
    initSelect(){
      this.selectedRow = {};
    },

    //검토 의견 보기
    openSttsHistory(item) {
      this.HISTORY_SRVY_ID = item.SRVY_ID;
      this.dialogOpenSttsHistory = true;
    },
    closeSttsHistory() {
      this.HISTORY_SRVY_ID = '';
      this.dialogOpenSttsHistory = false;
    },
  },
}
</script>

<style lang="scss" scoped>

</style>