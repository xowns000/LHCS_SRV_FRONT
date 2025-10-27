<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
        <template slot="search">
        <v-form ref="form">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                시행 연도
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select class="pl-form"
                  :items="DROP_ENFC_YR"
                  placeholder="선택하세요"
                  v-model="QA_PLAN.ENFC_YR"
                  @change="changeSelect"
                >
                </v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">진행 상태</span>
              <div class="pl-desc">
                <v-select class="pl-form"
                  :items="DROP_PRGRS_STTS"
                  placeholder="선택하세요"
                  v-model="QA_PLAN.PRGRS_STTS_CD"
                  @change="changeSelect"
                >
                </v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">시행 구분</span>
              <div class="pl-desc">
                <v-select class="pl-form"
                  :items="DROP_ENFC_SE"
                  placeholder="선택하세요"
                  v-model="QA_PLAN.ENFC_SE_CD"
                  item-text="QLTY_CLSF_NM"
                  item-value="QLTY_CLSF_ID"
                  @change="changeSelect"
                >
                </v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">시행계획 명</span>
              <div class="pl-desc">
                <v-select class="pl-form is-lg"
                  :items="DROP_PLAN_NM"
                  placeholder="선택하세요"
                  v-model="SELECTED_QA_PLAN"
                  item-text="PLAN_NM"
                  item-value="QA_PLAN_ID"
                  @change="changeQaPlan"
                  return-object
                  :rules="validateRules.QA_PLAN"
                >
                </v-select>
              </div>
            </div>
            <v-btn class="pl-btn is-icon" @click="btnSearch()">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
          </div>
        </v-form>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <!-- info -->
      <div class="pl-card">
        <ul class="pl-list-info2">
          <li v-for="item in TOP_INFO" :key="item.id" style="max-width: 250px">
            <span class="pl-list-info-title">{{ item.title }}</span>
            <strong class="pl-list-info-desc" :class="item.class">{{ item.desc }}</strong>
          </li>
        </ul>
      </div>
      <!-- tabs -->
      <v-tabs class="pl-tabs" v-model="SELECTED_TAB" >
        <v-tab v-for="item in TAB_ITEMS" :key="item.CYCL_INFO.CYCL_NM" @click="changeTab(item.CYCL_INFO.CYCL_NM)">{{ item.CYCL_INFO.CYCL_NM + '차(' + item.CYCL_INFO.EVL_CMPTN_NM + ')' }}</v-tab>
      </v-tabs>
      <div style="height: 556px">
        <v-tabs-items v-model="SELECTED_TAB" class="pl-tabs-items">
          <v-tab-item v-for="itemVTab  in TAB_ITEMS">
              <div class="pl-cols" style="height: 100%">
              <div class="is-col-fix is-vrt" style="width: 820px">
                <div class="pl-card">
                  <div class="pl-grid-top">
                    <div class="pl-grid-top-left">
                      <h2 class="pl-subtit">평가 대상자</h2> <div> ( 평가기간 : {{ itemVTab.CYCL_INFO.CYCL_BGNG_YMD }} ~ {{ itemVTab.CYCL_INFO.CYCL_END_YMD }} )</div>
                    </div>
                    <div class="pl-grid-top-utils">
                      <span class="pl-text-box">
                        <span class="pl-text-box-tit">대상</span>
                        <span class="pl-text-box-desc">{{ itemVTab.CYCL_INFO.TRGT_COMP_CNT + "/" + itemVTab.CYCL_INFO.TRGT_TOT_CNT }}</span>
                      </span>
                      <span class="pl-text-box">
                        <span class="pl-text-box-tit">진행률</span>
                        <span class="pl-text-box-desc is-txt-main"> {{ itemVTab.CYCL_INFO.TRGT_COMP_CNT == 0 ? 0.0 : (itemVTab.CYCL_INFO.TRGT_COMP_CNT * 100 / itemVTab.CYCL_INFO.TRGT_TOT_CNT).toFixed(1) }} %</span>
                      </span>
                      <v-btn class="pl-btn" @click="(TAB_ITEMS[SELECTED_TAB].CYCL_INFO.CYCL_STATS == undefined || TAB_ITEMS[SELECTED_TAB].CYCL_INFO.CYCL_STATS.length < 1) ? showAlert(MESSAGE.ALERT.NO_EVL) : showAlert(MESSAGE.CONFIRM.CMPL)">평가완료</v-btn>
                    </div>
                  </div>
                  <v-data-table
                    class="pl-grid is-hover"
                    :headers="headers"
                    :items="itemVTab.CYCL_INFO.CYCL_STATS"
                    :item-class="isActiveRow"
                    fixed-header
                    item-key="ROW_NUMBER"
                    height="482px"
                    :items-per-page="ROW_PER_PAGE"
                    hide-default-footer
                    :page.sync="page"
                    @page-count="pageCount = $event"
                    @click:row="clickEnfTrgt"
                    no-data-text="등록된 데이터가 없습니다."
                  >
                  </v-data-table>
                </div>
              </div>
              <div class="is-vrt">
                <div class="pl-card">
                  <div class="pl-cols align-center">
                    <!-- 정보 -->
                    <div class="pl-chatting-cs-info d-flex align-center">
                      <div class="col-7 pa-0">
                        <div class="pl-chatting-cs-info-cus">
                          <div>
                            <strong class="pl-chatting-cs-info-tit">상담직원</strong>
                            <span  class="pl-chatting-cs-info-desc">{{ itemVTab.SELECTED_TARGET.USER_NM }}</span>
                          </div>
                          <div class="is-ellips">
                            <strong class="pl-chatting-cs-info-tit">상담 유형</strong>
                            <v-tooltip content-class="pl-tooltip " bottom>
                              <template v-slot:activator="{ on, attrs }">
                                <span v-bind="attrs" v-on="on" class="pl-chatting-cs-info-desc ">{{ itemVTab.SELECTED_TARGET.CUSL_TP }}</span>
                              </template>
                              <span  class="pl-chatting-cs-info-desc">{{ itemVTab.SELECTED_TARGET.CUSL_TP }}</span>
                            </v-tooltip>

                          </div>
                        </div>
                      </div>
                      <span class="d-flex col-5 ml-auto align-center">
                        <compo-audio
                          v-model="dialogListenVoice"
                          AudioType="playOnlyNoTtl"
                          :audioProp="dataForAudio"
                          />
                        <v-btn
                          v-if="QA_PLAN.CHNL_CD == 'SNS'"
                          class="pl-btn is-sm is-sub ml-2"
                          :disabled="SELECTED_ROW.CHT_CUTT_ID"
                          @click="[chatHstSrch(),mixin_showDialog('ChatLog')]"
                        >채팅보기
                        </v-btn>
                      </span>
                      <!-- 대화내용 -->
                      <v-dialog
                        v-model="dialogChatLog"
                        content-class="dialog-draggable"
                        hide-overlay>
                        <div class="draggable-area">drag area</div>
                        <compo-dialog
                          header-title="대화내용"
                          @hide="mixin_hideDialog('ChatLog')"
                        >
                          <template slot="body">
                            <!-- component -->
                            <compo-chatting
                              :ChatLogProp="CHAT_LOG"
                              :BfrChatLogProp="[]"
                            />
                          </template>
                        </compo-dialog>
                      </v-dialog>
                    </div>
                  </div>
                  <!-- grid -->
                  <div class="is-mt-m">
                    <div class="pl-grid-top">
                      <div class="pl-grid-top-left">
                        <h2 class="pl-subtit">QA 통화품질 평가표</h2>
                      </div>
                      <div class="pl-grid-top-utils">
                        <v-btn class="pl-btn is-icon" @click="btnSaveScore">
                          저장
                        </v-btn>
                      </div>
                    </div>
                      <v-data-table
                        class="pl-grid is-rowspan"
                        :headers="headersRowSpan"
                        :items="itemVTab.SHEET_INFO.ARTCL_LIST"
                        fixed-header
                        item-key="index"
                        height="245px"
                        hide-default-footer
                        no-data-text="등록된 데이터가 없습니다."
                        disable-pagination
                      >
                        <template v-slot:item="{ item, index }">
                        <tr :class="mixin_getItemClass(item)" >
                          <td
                            v-if="index === 0 || item.type01 !== itemVTab.SHEET_INFO.ARTCL_LIST[index - 1].type01"
                            :rowspan="getRowCount(index, 'type01', itemVTab.SHEET_INFO.ARTCL_LIST)"
                            :class="mixin_getHeaderClass(headersRowSpan[0].align)">{{ item.type01 }}</td>
                          <td
                            v-if="index === 0 || item.type02 !== itemVTab.SHEET_INFO.ARTCL_LIST[index - 1].type02"
                            :rowspan="getRowCount(index, 'type02', itemVTab.SHEET_INFO.ARTCL_LIST)"
                            :class="mixin_getHeaderClass(headersRowSpan[1].align)">{{ item.type02 }}</td>
                          <td :class="mixin_getHeaderClass(headersRowSpan[2].align)" >
                            {{ item.type03 }}
                          </td>
                          <td style="white-space: pre-line;">
                            {{ item.subject }}
                          </td>
                            <td class="text-center">
                              <input
                                type="radio"
                                class="pl-radio native-input"
                                :value="item.EVL_ARTCL_ID + '_' + item.ASSSCOR"
                                :name="item.radioGroup"
                                @change="changScoreWhenItemChanged"
                                :id="'chk_' + SELECTED_TAB + '_' + item.EVL_ARTCL_ID"
                                v-model="itemVTab.SHEET_INFO.SCORES[item.radioGroup]"
                              />
                            </td>
                        </tr>
                      </template>
                      <!-- 총점 -->
                      <template slot="footer">
                        <div class="pl-grid-sum">
                          <table >
                            <colgroup>
                              <col v-for="(col, index) in headersRowSpan" :key="index" :width=col.width />
                            </colgroup>
                            <tbody >
                              <tr >
                                <td colspan="4" class="pl-grid-sum-head text-center">총점</td>
                                <td class="text-right">
                                  {{ itemVTab.SHEET_INFO.TOTAL_SCORE }}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </template>
                    </v-data-table>
                  </div>
                  <!-- textarea -->
                  <div class="pl-form-inline-wrap vertical type-auto flex-row is-mt-m">
                    <div class="pl-form-inline flex-grow-1">
                      <span class="pl-label">
                        평가 관리자 의견
                      </span>
                      <div class="pl-desc">
                        <v-textarea
                          class="pl-form is-noresize"
                          placeholder="의견을 입력하십시오."
                          v-model="itemVTab.SHEET_INFO.MNGR_OPNN"
                          v-byte-counter="4000"
                          :spellcheck="false"
                        />
                      </div>
                    </div>
                    <div class="pl-form-inline flex-grow-1">
                      <span class="pl-label">
                        이의 제기
                      </span>
                      <div class="pl-desc">
                        <v-textarea
                          class="pl-form is-noresize"
                          placeholder="의견을 입력하십시오."
                          v-model="itemVTab.SHEET_INFO.OBJC_CN"
                          v-byte-counter="4000"
                          :spellcheck="false"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name:"MENU_QAM_M0400", //name은 'MENU_' + 파일명 조합
  components: {
  },
 data() {
    return {
      //알림창 메시지
      MESSAGE: {
        CONFIRM: {
          // OVERWRITE_SHEET:
          //   { alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '이미 저장된 평가표가 있습니다.\n그래도 불러 오시겠습니꺄?', callYes: this.getQltyEvlArtcl, callNo: this.closeMsg, },
          CMPL: { alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '평가완료 후 수정이 불가능합니다<br>평가를 완료하시겠습니까?', callYes: this.btnEvlComplete, callNo: this.closeMsg, },
        },
        ALERT: {
          SAVE_DONE:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '저장 되었습니다.' },
          DEL_DONE:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '삭제 되었습니다.' },
          EVL_ALL_ITEM:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '채점하지 않은 항목이 있습니다.', },
          EVL_COMPLETE:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '해당차수 평가 완료 되었습니다.', },
          NO_EVL_COMPLETE:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가완료되지 않은 평가자가 있습니다.', },
          NO_EVL_TARGET:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '저장할 데이터가 없습니다.', },
          NO_EVL:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가 완료할 데이터가 없습니다.', },
          ALREADY_EVL:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '이미 평가 완료 하여 저장 할 수 없습니다.', },
          NO_EVL_PERIOD:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가기간이 아닙니다.', },
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },
      validateRules: {
        QA_PLAN: [
          v => !!v.QA_PLAN_ID || '시행계획을 선택하세요.',
        ],
        ENFC_YR: [
          v => !!v || '시행연도는 필수 입력 항목 입니다.',
        ],
      },

      //tab: null,

      // top search
      dropItems: [],
      dropItems2: ['전체', '진행중', '종료'],
      dropItems3: ['전체', '경기 평가', '월간 평가', '분기 평가', '수시 평가'],
      dropItems4: [],

      // info
      TOP_INFO: [
      ],
      TOP_INFO_TEMPLATE: [
        { title: '시행계획 명', desc: '', class: '', },
        { title: '시행 구분'  , desc: '', class: '', },
        { title: '평가 기간'  , desc: '', class: '', },
        { title: '시행 차수'  , desc: '', class: '', },
        { title: '진행상태'   , desc: '', class: 'is-txt-main', },
        // { title: '목표 대상자', desc: '150명', class: '', },
        { title: '등록자'     , desc: '', class: '', },
        { title: '등록일'     , desc: '', class: '', },
      ],

      // 1차
      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: -1,
      headers: [
        { text: '번호'    , value: 'ROW_NUMBER' , align: 'center' , width: '80px' },
        { text: '상담직원', value: 'USER_NM'    , align: 'left'   , width: '80px' },
        { text: '상담시간', value: 'CUTT_HR'     , align: 'left'   , width: '80px' },
        { text: '평가여부', value: 'EVL_YN'     , align: 'left'   , width: '80px' },
        { text: '평가일자', value: 'RSLT_DT'    , align: 'left'   , width: '80px' },
        { text: '점수'    , value: 'SCORE'      , align: 'center' , width: '80px' },

      ],
      headersRowSpan: [
        { text: "대분류", value: "type01", align: "left", width: "150px", sortable: false },
        { text: "중분류", value: "type02", align: "left", width: "150px", sortable: false },
        { text: "배점", value: "type03", align: "center", width: "60px", sortable: false },
        { text: "품질기준", value: "EVL_ARTCL_NM", align: "left", width: "", sortable: false },
        { text: "점수", value: "check", align: "center", width: "80px", sortable: false },
      ],
      // top search
      DROP_ENFC_YR: [],       //시행년도
      DROP_PRGRS_STTS: [],    //진행상태
      DROP_ENFC_SE: [],       //시행구분
      DROP_PLAN_NM: [],       //시행계획명
      // 시행계획 조회용 객체
      QA_PLAN: {
        ENFC_YR: '',        //시행년도
        PRGRS_STTS_CD: '',  //진행상태
        ENFC_SE_CD: '',     //시행구분
        PLAN_NM: '',        //시행계획명
        QA_PLAN_ID: '',     //PLAN_ID
        CHNL_CD: 'TEL'      //시행채널
      },
      SELECTED_QA_PLAN: {},
      QA_CODES: [],

      dataForAudio : {},

      // AudioSrc: require('@/assets/sound/@_seth_makes_sounds__relaxing-lofi.wav'),

      SELECTED_TAB:0,

      dialogListenVoice: false,

      TAB_ITEMS: [
      ],

      TAB_ITEMS_TEMPLATE: {
        SELECTED_TARGET: {        //선택된 평가 대상자
          USER_NM:'',
          CUSL_TP:'',
          QA_TRGT_ID:'',
        },
        CYCL_INFO: {              //TAB에 표시되는 1차(진행중) 문구와 대상, 진행율 정보
          CYCL_STATS: [           //평가대상자 Data Grid
          ],
          CYCL_NM:'',
          QA_CYCL_ID:'',
          TRGT_COMP_CNT:'',
          TRGT_TOT_CNT:'',
        },
        SHEET_INFO: {             //평가지 정보
          ARTCL_LIST: [            //평가지 Data Grid
          ],
          SCORES: {                //선택된 항목 + 점수
          },
          TOTAL_SCORE: 0,         //총점
          MNGR_OPNN: '',
          OBJC_CN: '',
        },
        AudioSrc: this.AudioSrc,
      },
      CURRENT_DATE:'',
      IPCC_SOCKET_URL: '',
      AudioSrc : '',

      SELECTED_ROW : {},

      // dialog 대화내역 보기
      dialogChatLog: false,     //채팅내역 모달창
      CHAT_LOG:[],              //채팅내역

      FBDWD_YN: '', //금칙어 적용여부
      SHOW_QSTN:'', //고객이 선택한 문의유형 보기 여부
    }
  },

  watch: {

  },

  computed: {
    ...mapGetters({
      stoUserId: 'userStore/GE_USER_ID',
    }),
  },

  created() {

  },

  async mounted() {
    let CURRENT_DATE = await this.mixin_getSvrDate("YYYY-MM-DD");
    let CURRENT_YEAR = parseInt(CURRENT_DATE.substr(0, 4));
    this.QA_CODES = await this.mixin_common_code_get_all(['QATS_ST', 'CALL_TP', 'CHNL'], 'Y');
    let QLTY_CLSF_CODES = await this.getQltyClfsCode();

    //selectbox 연도 설정 (-5년~+5년)
    this.DROP_ENFC_YR.push({ text: '전체', value: '' });   // default
    for (let i = -5; i < 5; i++) {
      this.DROP_ENFC_YR.push({ text: `${CURRENT_YEAR + i}년`, value: CURRENT_YEAR + i });
    }
    this.DROP_PRGRS_STTS = this.mixin_common_code_get(this.QA_CODES, 'QATS_ST');

    //준비중은 제외
    for(let i = 0 ; i < this.DROP_PRGRS_STTS.length ; i++) {
      let item = this.DROP_PRGRS_STTS[i];
      // console.log('item', item);
      if(item.value == 'PRPARG') {
        this.DROP_PRGRS_STTS.splice(i,1);
        break;
      }
    }

    this.dropItemsS01 = this.mixin_common_code_get(this.QA_CODES, 'CHNL');
    this.DROP_ENFC_SE = [...QLTY_CLSF_CODES];
    this.QLTY_CLSF = [...QLTY_CLSF_CODES];
    this.DROP_ENFC_SE.splice(0, 0, { QLTY_CLSF_NM: '전체', QLTY_CLSF_ID: '' });
    this.QA_PLAN.ENFC_YR = CURRENT_YEAR;
    this.QA_PLAN.PRGRS_STTS_CD = 'ONGONG';

    await this.getQaPlan();
    await this.getCycls();

    this.CURRENT_DATE = CURRENT_DATE;
    this.IPCC_SOCKET_URL = this.$store.getters["userStore/GE_USER_COMPANY"].API_URI;

    this.changeTab(1);

    this.FBDWD_YN = await this.mixin_getChtStng('PROHIBITE_APPLY_YN');
    this.SHOW_QSTN = await this.mixin_getChtStng('INQRY_SHOW_YN');
  },

  methods: {
    //시행구분 코드 조회
    async getQltyClfsCode() {
      let sUrl = "/api/qa/qltyclsf/code";
      let postParam = {};
      let headParam = {};

      let resData = await this.common_postCall(sUrl, postParam, headParam)

      if (resData.HEADER.ERROR_FLAG)
        return [];
      else {
        let dropQltyClsf = [];
        dropQltyClsf = resData.DATA;
        return dropQltyClsf;
      }
    },
    async changeSelect() {
      await this.getQaPlan();
      if (this.SELECTED_QA_PLAN.QA_PLAN_ID == undefined || this.mixin_isEmpty(this.SELECTED_QA_PLAN.QA_PLAN_ID)) {
        this.TAB_ITEMS = [];
        return;
      }
      await this.getCycls();
    },
    async getQaPlan() {
      let sUrl = "/api/qa/plan/list";
      this.QA_PLAN.WITH_CYCL_STTS = "Y";
      this.QA_PLAN.QA_PLAN_ID = "";

      let postParam = { ...this.QA_PLAN };
      postParam.QA_MNGR_ID = this.stoUserId;

      let headParam = {
        head: {
          PAGING: 'N',
        }
      };
      let resData = await this.common_postCall(sUrl, postParam, headParam)

      this.SELECTED_QA_PLAN = {};

      if (!resData.HEADER.ERROR_FLAG) {
        this.DROP_PLAN_NM = resData.DATA;
        if (this.DROP_PLAN_NM.length > 0) {
          this.QA_PLAN.QA_PLAN_ID = this.DROP_PLAN_NM[0].QA_PLAN_ID;
          this.SELECTED_QA_PLAN = this.DROP_PLAN_NM[0];
          this.setQaEnfc();
        } else {
          this.$refs.form.resetValidation();
          this.itemsRowSpan = [];
          this.TOP_INFO = [...this.TOP_INFO_TEMPLATE];
        }
      }
    },
    setQaEnfc() {
      const oItem = this.SELECTED_QA_PLAN;
      if(oItem.EVL_BGNG_YMD.indexOf("-") == -1){
        oItem.EVL_BGNG_YMD = this.mixin_convertDate(oItem.EVL_BGNG_YMD, 'yyyy-MM-dd');
      }
      if(oItem.EVL_END_YMD.indexOf("-") == -1){
        oItem.EVL_END_YMD = this.mixin_convertDate(oItem.EVL_END_YMD, 'yyyy-MM-dd');
      }
      this.TOP_INFO = [
        {
          title: '시행계획 명',
          desc: oItem.PLAN_NM,
          class: '',
        },
        {
          title: '시행 구분',
          desc: oItem.ENFC_SE_NM,
          class: '',
        },
        {
          title: '평가 기간',
          desc: oItem.EVL_BGNG_YMD + ' ~ ' + oItem.EVL_END_YMD,
          class: '',
        },
        {
          title: '시행 차수',
          desc: oItem.CYCL_CNT,
          class: '',
        },
        {
          title: '진행상태',
          desc: oItem.PRGRS_STTS_NM,
          class: 'is-txt-main',
        },
        // {
        //   title: '목표 대상자',
        //   desc: '150명',
        //   class: '',
        // },
        {
          title: '등록자',
          desc: oItem.RGTR_ID_NM,
          class: '',
        },
        {
          title: '등록일',
          desc: oItem.REG_DT,
          class: '',
        },
      ];

      this.QA_PLAN.CHNL_CD = oItem.EVL_CHN_CD;
    } ,
    async getCycls(qaCyclId) {

      if(this.SELECTED_QA_PLAN.QA_PLAN_ID == undefined || this.mixin_isEmpty(this.SELECTED_QA_PLAN.QA_PLAN_ID))
        return;

      let bSingle = !this.mixin_isEmpty(qaCyclId); //특정차수만 가져 오는지 모든 차수를 가져오는지 구분

      let sUrl = "/api/qa/evlefc/list";
      let postParam = {
        QA_PLAN_ID: this.SELECTED_QA_PLAN.QA_PLAN_ID,
        QA_MNGR_ID: this.stoUserId,
        CYCL_NM: '',
        QA_CYCL_ID: bSingle?qaCyclId:'',
        CHNL_CD: this.SELECTED_QA_PLAN.EVL_CHN_CD
      }
      let headParam = {
        head: {
          PAGING: 'N',
        }
      };
      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!resData.HEADER.ERROR_FLAG) {
        if(!bSingle)
          this.initEvlSheet();

        let oResData = resData.DATA;
        let oTab = this.TAB_ITEMS;

        if(bSingle) {
          this.TAB_ITEMS[this.SELECTED_TAB].CYCL_INFO = {};
          this.TAB_ITEMS[this.SELECTED_TAB].CYCL_INFO = oResData[0];
        }
        else {
          this.TAB_ITEMS = [];
          oResData.forEach(item => {
            let oTabItem = { ...this.TAB_ITEMS_TEMPLATE };
            oTabItem.CYCL_INFO = item;
            this.TAB_ITEMS.push(oTabItem);
            this.SELECTED_TAB = 0;
          });
        }
      }
      return;
    },
    btnSearch() {
      this.TAB_ITEMS = [];
      this.getCycls();
    },
    changeQaPlan() {
      // this.resetData();
      this.setQaEnfc();
      this.getCycls();
    },
    async clickEnfTrgt(event, row) {
      let oTab = this.TAB_ITEMS[this.SELECTED_TAB];

      if (row.item == oTab.SELECTED_TARGET) { //기존 row와 동일한 row 선택시
        return;
      }
      oTab.SELECTED_TARGET = row.item;
      this.SELECTED_ROW = row.item;
      // console.log("this.SELECTED_ROW QA 400 ", this.SELECTED_ROW)

      // this.dataForAudio = {};
      // this.dataForAudio = {
      //   REC_FILE_NM : this.SELECTED_ROW.REC_FILE_NM
      //   , CUST_ID : this.mixin_isEmpty(this.SELECTED_ROW.CUST_ID) ? null : this.SELECTED_ROW.CUST_ID
      //   , PHN_CUTT_ID : this.mixin_isEmpty(this.SELECTED_ROW.PHN_CUTT_ID) ? null : this.SELECTED_ROW.PHN_CUTT_ID
      // };

      let sUrl = "/api/qa/evlefc/getsheet";

      let oParam = {
        DEL_YN: "N",
        QA_PLAN_ID: this.SELECTED_QA_PLAN.QA_PLAN_ID,
        QA_MNGR_ID: this.stoUserId,
        QA_TRGT_ID: row.item.QA_TRGT_ID,
        QA_CYCL_ID: row.item.QA_CYCL_ID,
      }

      let postParam = oParam;
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!resData.HEADER.ERROR_FLAG) {
        //성공시 이벤트
        oTab.SHEET_INFO = [];
        this.setPlanQltySheet(resData.EVL_SHEET);
        oTab.SELECTED_TARGET = { ...row.item };
        if(resData.RSLT_OPNN.length > 0) {
          oTab.SHEET_INFO.MNGR_OPNN = resData.RSLT_OPNN[0].MNGR_OPNN;
          oTab.SHEET_INFO.OBJC_CN = resData.RSLT_OPNN[0].OBJC_CN;
        }
      }

      this.dataForAudio = {};
      this.dataForAudio = {
        REC_FILE_NM : this.SELECTED_ROW.REC_FILE_NM
        , CUST_ID : this.mixin_isEmpty(this.SELECTED_ROW.CUST_ID) ? null : this.SELECTED_ROW.CUST_ID
        , PHN_CUTT_ID : this.mixin_isEmpty(this.SELECTED_ROW.PHN_CUTT_ID) ? null : this.SELECTED_ROW.PHN_CUTT_ID
      };
      // console.log("this.dataForAudio",this.dataForAudio)
    },
    async setPlanQltySheet(resData) {
      let oTab = this.TAB_ITEMS[this.SELECTED_TAB];
      let oPaper = [];
      let radIndex = 0;
      let radPrefix = "rad";
      let oScore = {};
      let oChecked = [];
      oTab.SHEET_INFO.SCORES = {};

      resData.forEach(item => {
        item.QA_PLAN_ID = this.SELECTED_QA_PLAN.QA_PLAN_ID;
        if (this.mixin_isEmpty(item.UP_QLTY_CLSF_NM)) {        // UP_QLTY_CLSF_NM 가 없으면 대분류
          item.index = oPaper.length + 1;
          item.type01 = item.QLTY_CLSF_NM;
          item.DEL_YN = 'N';
          oPaper.push(item);
        } else if (this.mixin_isEmpty(item.EVL_ARTCL_ID)) {   // UP_QLTY_CLSF_ID는 있는데 EVL_ARTCL_ID 가 없으면 중분류 Only -> 상위 대분류에 내용 넣어줌
          let oLastItem = oPaper[oPaper.length - 1];
          item.index = oLastItem.index;
          item.type01 = oLastItem.type01;
          item.type02 = item.QLTY_CLSF_NM;
          item.DEL_YN = 'N';
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
          item.radioGroup = oLastItem.type02 == item.type02 ? oLastItem.radioGroup : radPrefix + (++radIndex);
          item.DEL_YN = 'N';

          if (item.SCR != '') {
            oScore[item.radioGroup] = item.EVL_ARTCL_ID + '_' + item.SCR;
          }
          if (bUpdate)
            oPaper.pop();
          oPaper.push(item);
        }
      });

      oTab.SHEET_INFO.SCORES = oScore;
      oTab.SHEET_INFO.COUNT_CLSF = radIndex;
      await this.assignSheetData(oTab, oPaper);
      oTab.SHEET_INFO.ARTCL_LIST.push();
      this.changeScore('NEW', null);
    },
    assignScore(oTab, oScore) {
      oTab.SHEET_INFO.SCORES = oScore;
    },
    assignSheetData(oTab, oPaper) {
      oTab.SHEET_INFO.ARTCL_LIST = oPaper;
    },
    changeScore(type, item) {
      let oTab = this.TAB_ITEMS[this.SELECTED_TAB].SHEET_INFO;

      if(type != "NEW")
        oTab.SCORES[item.target.name] = item.target.value;

      let score = 0

      for (let i of Object.values(oTab.SCORES)) {
        score += Number(i.split('_')[1]);
      }
      oTab.TOTAL_SCORE = score;
      oTab.push();
    },
    changScoreWhenItemChanged(item) {
      this.changeScore('', item);
    },
    async btnSaveScore() {
      if(this.diffDate(this.CURRENT_DATE, this.TAB_ITEMS[this.SELECTED_TAB].CYCL_INFO.CYCL_BGNG_YMD) > 0
        ||  this.diffDate(this.CURRENT_DATE, this.TAB_ITEMS[this.SELECTED_TAB].CYCL_INFO.CYCL_END_YMD) < 0 ) {
          this.showAlert(this.MESSAGE.ALERT.NO_EVL_PERIOD);
        return;
      }

      if(this.TAB_ITEMS[this.SELECTED_TAB].SELECTED_TARGET == undefined
        || this.TAB_ITEMS[this.SELECTED_TAB].SELECTED_TARGET.QA_TRGT_ID == undefined
        || this.mixin_isEmpty(this.TAB_ITEMS[this.SELECTED_TAB].SELECTED_TARGET.QA_TRGT_ID)) {
          this.showAlert(this.MESSAGE.ALERT.NO_EVL_TARGET);
          return;
      }

      let oTab = this.TAB_ITEMS[this.SELECTED_TAB];

      if(oTab.CYCL_INFO.EVL_CMPTN_YN == 'Y') {
        this.showAlert(this.MESSAGE.ALERT.ALREADY_EVL);
        return;
      }

      //모든 항목에 대한 평가를 했는지 CHECK
      let oScores = oTab.SHEET_INFO.SCORES;
      let oClsfCnt = oTab.SHEET_INFO.COUNT_CLSF;
      let oSelectedData = oTab.SELECTED_TARGET;
      let oRowSpan = oTab.SHEET_INFO.ARTCL_LIST;

      if (Object.keys(oScores).length != oClsfCnt) {
        this.showAlert(this.MESSAGE.ALERT.EVL_ALL_ITEM);

        for(let i = 1 ; i < parseInt(oClsfCnt) ; i++) {
          let oRadName = "rad" + i;
          if(!Object.keys(oScores).includes(oRadName)) {
            let key = "[name=" + oRadName + "]";
            if($(key).length > 0)
              $(key)[0].focus();
            break;
          }
        }
        return;
      }

      let sUrl = "/api/qa/evlefc/setrslt";
      let oParams = [];

      oRowSpan.forEach(item => {
        let id = '#chk_' + this.SELECTED_TAB + '_' + item.EVL_ARTCL_ID;
        let oInput = $(id)[0];

        if (oInput.value == oScores[oInput.name]) {
          let oParam = {
            EVL_ARTCL_ID: item.EVL_ARTCL_ID,
            SCR: item.ASSSCOR,
          }
          oParams.push(oParam);
        }
      });

      let postParam = {
        QA_RSLT: oParams,
        QA_PLAN_ID: this.SELECTED_QA_PLAN.QA_PLAN_ID,
        QA_MNGR_ID: this.stoUserId,
        QA_CYCL_ID: oSelectedData.QA_CYCL_ID,
        QA_TRGT_ID: oSelectedData.QA_TRGT_ID,
        MNGR_OPNN: oTab.SHEET_INFO.MNGR_OPNN,
        OBJC_CN: oTab.SHEET_INFO.OBJC_CN,
      }

      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!resData.HEADER.ERROR_FLAG) {
        this.refreshCycl();
        this.showAlert(this.MESSAGE.ALERT.SAVE_DONE)
      }
    },
    async refreshCycl() {
      let oTab = this.TAB_ITEMS[this.SELECTED_TAB];

      if (this.SELECTED_QA_PLAN.QA_PLAN_ID == undefined || this.mixin_isEmpty(this.SELECTED_QA_PLAN.QA_PLAN_ID))
        return;

      let sUrl = "/api/qa/evlefc/list";
      let postParam = {
        QA_PLAN_ID: this.SELECTED_QA_PLAN.QA_PLAN_ID,
        QA_MNGR_ID: this.stoUserId,
        QA_CYCL_ID: oTab.CYCL_INFO.QA_CYCL_ID,
      }
      let headParam = {
        head: {
          PAGING: 'N',
        }
      };
      let resData = await this.common_postCall(sUrl, postParam, headParam)

      if (!resData.HEADER.ERROR_FLAG) {
        oTab.CYCL_INFO = resData.DATA[0];
      }
      return;
    },
    initEvlSheet() {
      this.TAB_ITEMS = [];
    },
    changeTab(id) {
      let tabId = (id - 1);
      this.SELECTED_TAB = tabId;

      if(this.TAB_ITEMS.length > 0){
        if(this.TAB_ITEMS[this.SELECTED_TAB].CYCL_INFO.CYCL_STATS != undefined) {
          let oRow = this.TAB_ITEMS[this.SELECTED_TAB].CYCL_INFO.CYCL_STATS[0];
          if(oRow != undefined)
            this.clickEnfTrgt(null, { item : oRow } );
        }
      }
    },
    async btnEvlComplete() {
      //모든 평가 대상자의 평가가 되었는지 확인
      let oCycls = this.TAB_ITEMS[this.SELECTED_TAB].CYCL_INFO.CYCL_STATS;

      if(oCycls == undefined || oCycls.length < 1) {
        this.showAlert(this.MESSAGE.ALERT.NO_EVL);
        return;
      }

      for(let i = 0 ; i < oCycls.length ; i++) {
        if(oCycls[i].EVL_YN_CD != 'Y') {
          this.showAlert(this.MESSAGE.ALERT.NO_EVL_COMPLETE);
          return;
        }
      }

      let sUrl = "/api/qa/evlefc/evlcomplete";

      let postParam = {
        //넘길 파라미터(대문자)
        QA_PLAN_ID : this.SELECTED_QA_PLAN.QA_PLAN_ID,
        QA_CYCL_ID : this.TAB_ITEMS[this.SELECTED_TAB].CYCL_INFO.QA_CYCL_ID,
        QA_MNGR_ID : this.stoUserId,
      }

      let headParam = {
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!resData.HEADER.ERROR_FLAG) {
        //성공시 이벤트
        this.getCycls(this.TAB_ITEMS[this.SELECTED_TAB].CYCL_INFO.QA_CYCL_ID);
        this.showAlert(this.MESSAGE.ALERT.EVL_COMPLETE);
      }
    },
    //grid get row span
    getRowCount(index, type, oItems) {
      let rowCount = 1;
      for (let i = index + 1; i < oItems.length; i++) {
        if (oItems[i][type] === oItems[i - 1][type]) {
          rowCount++;
        } else {
          break;
        }
      }
      return rowCount;
    },

    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },
    diffDate(fromDate, toDate) {
      const d1 = new Date(fromDate);
      const d2 = new Date(toDate);
      const diffDate = d2.getTime() - d1.getTime();
      const rtnVal = diffDate / (1000 * 60 * 60 * 24); // 밀리세컨 * 초 * 분 * 시 = 일
      return rtnVal;
    },

    //row클릭 색상변경
    isActiveRow(item){
      return item.QA_TRGT_ID== this.SELECTED_ROW.QA_TRGT_ID? 'active':'';
    },

    //채팅 내역 조회
    async chatHstSrch(){
      let sUrl = '/chat-api/main/cnslt-cn/inqire';
      let postParam = {
        CHT_CUTT_ID: this.SELECTED_ROW.CHT_CUTT_ID,
        CUST_ID: this.SELECTED_ROW.CUST_ID,
        CUTT_STTS_CD: 'CMPL',
        CHT_RDY_ID: '',
        CHT_USER_KEY : this.SELECTED_ROW.CHT_USER_KEY,
        SNDR_KEY : this.SELECTED_ROW.SNDR_KEY,
        CHN_CLSF_CD : this.SELECTED_ROW.CHN_CLSF_CD,
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.chat_postCall(sUrl, postParam, headParam)
      if(!resData.header.ERROR_FLAG){
        this.CHAT_LOG = [];
        let msgTypeCd = '';
        let leng = resData.data.length;
        for(let i=0;i<leng;i++){
          if(this.SHOW_QSTN == 'Y'){
            if(resData.data[i]["MSG_TYPE_CD"] != 'EMAIL'){
              let chatDate = this.mixin_convertDate(resData.data[i]["REG_DT"], 'yyyy-MM-dd HH:mm:ss')
              if(resData.data[i]["MSG_TYPE_CD"] == 'INFOMSG' && msgTypeCd != 'INFOMSG'){
                this.CHAT_LOG.push(
                  {
                    TYPE: resData.data[i+1]["MSG_TYPE_CD"],
                    SNDRCV_CD: resData.data[i+1]["RCPTN_DSPTCH_CD"],
                    IMAGE_URL: resData.data[i+1]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i+1]["RCPTN_DSPTCH_MSG"] : resData.data[i+1]["RCPTN_DSPTCH_MSG"],
                    CONTENT: this.FBDWD_YN == 'Y'
                      ? resData.data[i+1]["CHG_RCPTN_DSPTCH_MSG"]
                      : resData.data[i+1]["RCPTN_DSPTCH_MSG"],
                    CHAT_DATE: chatDate,
                    QSTN_TYPE_NM: resData.data[i+1]["QSTN_TYPE_NM"],
                    QSTN_TYPE_MSG: resData.data[i+1]["QSTN_TYPE_MSG"],
                    QSTN_BTN_LIST: resData.data[i+1]["BTN_LIST"].split('||'),
                    RSVT_BTN_LIST: resData.data[i+1]["RSVT_BTN"].split('||')
                  },
                )
                msgTypeCd = 'INFOMSG';
              } else if (resData.data[i]["MSG_TYPE_CD"] == 'QSTN' && msgTypeCd == 'INFOMSG') {
                this.CHAT_LOG.push(
                  {
                    TYPE: resData.data[i-1]["MSG_TYPE_CD"],
                    SNDRCV_CD: resData.data[i-1]["RCPTN_DSPTCH_CD"],
                    IMAGE_URL: resData.data[i-1]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i-1]["RCPTN_DSPTCH_MSG"] : resData.data[i-1]["RCPTN_DSPTCH_MSG"],
                    CONTENT: this.FBDWD_YN == 'Y'
                      ? resData.data[i-1]["CHG_RCPTN_DSPTCH_MSG"]
                      : resData.data[i-1]["RCPTN_DSPTCH_MSG"],
                    CHAT_DATE: chatDate,
                    QSTN_TYPE_NM: resData.data[i-1]["QSTN_TYPE_NM"],
                    QSTN_TYPE_MSG: resData.data[i-1]["QSTN_TYPE_MSG"],
                    QSTN_BTN_LIST: resData.data[i-1]["BTN_LIST"].split('||'),
                    RSVT_BTN_LIST: resData.data[i-1]["RSVT_BTN"].split('||')
                  },
                )
                msgTypeCd = '';
              } else {
                this.CHAT_LOG.push(
                  {
                    TYPE: resData.data[i]["MSG_TYPE_CD"],
                    SNDRCV_CD: resData.data[i]["RCPTN_DSPTCH_CD"],
                    IMAGE_URL: resData.data[i]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i]["RCPTN_DSPTCH_MSG"] : resData.data[i]["RCPTN_DSPTCH_MSG"],
                    CONTENT: this.FBDWD_YN == 'Y'
                      ? resData.data[i]["CHG_RCPTN_DSPTCH_MSG"]
                      : resData.data[i]["RCPTN_DSPTCH_MSG"],
                    CHAT_DATE: chatDate,
                    QSTN_TYPE_NM: resData.data[i]["QSTN_TYPE_NM"],
                    QSTN_TYPE_MSG: resData.data[i]["QSTN_TYPE_MSG"],
                    QSTN_BTN_LIST: resData.data[i]["BTN_LIST"].split('||'),
                    RSVT_BTN_LIST: resData.data[i]["RSVT_BTN"].split('||')
                  },
                )
              }
            } else if(resData.data[i]["MSG_TYPE_CD"] == 'EMAIL') {
              this.changeEmailCuttMode(resData.data[i]);
            }
          } else {
            if(resData.data[i]["MSG_TYPE_CD"] != 'QSTN'){
              let chatDate = this.mixin_convertDate(resData.data[i]["REG_DT"], 'yyyy-MM-dd HH:mm:ss')
              this.CHAT_LOG.push(
                {
                  TYPE: resData.data[i]["MSG_TYPE_CD"],
                  SNDRCV_CD: resData.data[i]["RCPTN_DSPTCH_CD"],
                  IMAGE_URL: resData.data[i]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i]["RCPTN_DSPTCH_MSG"] : resData.data[i]["RCPTN_DSPTCH_MSG"],
                  CONTENT: this.FBDWD_YN == 'Y'
                    ? resData.data[i]["CHG_RCPTN_DSPTCH_MSG"]
                    : resData.data[i]["RCPTN_DSPTCH_MSG"],
                  CHAT_DATE: chatDate,
                },
              )
            }
          }
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>