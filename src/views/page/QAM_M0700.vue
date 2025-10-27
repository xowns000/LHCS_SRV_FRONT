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
                  v-model="SEARCH.ENFC_YR"
                  @change="changeSelect"
                >
                </v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">시행 구분</span>
              <div class="pl-desc">
                <v-select class="pl-form"
                  :items="DROP_ENFC_SE_CD"
                  item-text="QLTY_CLSF_NM"
                  item-value="QLTY_CLSF_ID"
                  placeholder="선택하세요"
                  v-model="SEARCH.ENFC_SE_CD"
                  @change="changeSelect">
                </v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">시행계획 명</span>
              <div class="pl-desc">
                <v-select class="pl-form is-lg"
                  :items="DROP_PLAN_NM"
                  item-text="PLAN_NM"
                  item-value="QA_PLAN_ID"
                  placeholder="선택하세요"
                  v-model="SELECTED_QA_PLAN"
                  @change="changeQaPlan"
                  return-object
                  :rules="validateRules.QA_PLAN">
                </v-select>
              </div>
            </div>
            <v-btn class="pl-btn is-icon" @click="btnSearch">
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
      <div class="pl-cols is-border" style="height: 100%">
        <!-- 나의 QA 평가 상담 내역 -->
        <div class="is-col-fix is-vrt" style="width: 820px">
          <div class="pl-card">
            <div class="pl-grid-top">
              <div class="pl-grid-top-left">
                <h2 class="pl-subtit">나의 QA 평가 상담 내역</h2>
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter ml-auto">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
              </div>
            </div>
            <v-data-table
              class="pl-grid is-hover"
              :headers="headers"
              :items="items"
              fixed-header
              item-key="ROW_NUMBER"
              height="527px"
              hide-default-footer
              no-data-text="등록된 데이터가 없습니다."
            >
                <template v-slot:item.CYCL1="{ item }">
                  <td :class="mixin_getHeaderClass(headers[5].align)" >
                    <v-btn v-if="CURRENT_CYCL_CNT >= 1 && item.CYCL1_ID != '' && item.CYCL1 != '-'" @click="clickCycl(item, '1')" class="pl-btn is-sm">
                      {{ item.CYCL1 + ' / ' + item.TOT_SCR}}
                    </v-btn>
                    <span v-if="CURRENT_CYCL_CNT < 1 || item.CYCL1_ID == '' || item.CYCL1 == '-'">-</span>
                  </td>
                  </template>
                  <template v-slot:item.CYCL2="{ item }">
                    <td :class="mixin_getHeaderClass(headers[6].align)" >
                      <v-btn v-if="CURRENT_CYCL_CNT >= 2 && item.CYCL2_ID != '' && item.CYCL2 != '-'" @click="clickCycl(item, '2')" class="pl-btn is-sm">
                        {{ item.CYCL2 + ' / ' + item.TOT_SCR }}
                      </v-btn>
                      <span v-if="CURRENT_CYCL_CNT < 2 || item.CYCL2_ID == '' || item.CYCL2 == '-'">-</span>
                    </td>
                    </template>
                  <template v-slot:item.CYCL3="{ item }">
                    <td :class="mixin_getHeaderClass(headers[7].align)" >
                      <v-btn v-if="CURRENT_CYCL_CNT >= 3 && item.CYCL3_ID != '' && item.CYCL3 != '-'" @click="clickCycl(item, '3')" class="pl-btn is-sm">
                        {{ item.CYCL3 + ' / ' + item.TOT_SCR }}
                      </v-btn>
                      <span v-if="CURRENT_CYCL_CNT < 3 || item.CYCL3_ID == '' || item.CYCL3 == '-'">-</span>
                    </td>
                    </template>
              </v-data-table>
          </div>
        </div>
        <!-- right -->
        <div class="is-vrt">
          <div class="pl-card">
            <div class="pl-cols align-center">
              <!-- 정보 -->
              <div class="pl-chatting-cs-info d-flex align-center">
                <div class="col-7 pa-0">
                  <div class="pl-chatting-cs-info-cus">
                    <div>
                      <strong class="pl-chatting-cs-info-tit">평가일</strong>
                      <span  class="pl-chatting-cs-info-desc">{{ RESULT_INFO.date }}</span>
                    </div>
                    <div class="is-ellips">
                      <strong class="pl-chatting-cs-info-tit">상담 유형</strong>
                      <v-tooltip content-class="pl-tooltip " bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <span v-bind="attrs" v-on="on" class="pl-chatting-cs-info-desc ">{{ RESULT_INFO.cs_type }}</span>
                        </template>
                        <span  class="pl-chatting-cs-info-desc ">{{ RESULT_INFO.cs_type }}</span>
                      </v-tooltip>

                    </div>
                  </div>
                </div>
                <span class="col-5 ml-auto">
                  <compo-audio
                          v-model="dialogListenVoice"
                          AudioType="playOnlyNoTtl"
                          :audioProp="dataForAudio"
                          />
                  <v-btn
                    v-if="SELECTED_QA_PLAN.EVL_CHN_CD == 'SNS'"
                    class="pl-btn is-sm"
                    :disabled="SELECTED_CYCL.CHT_CUTT_ID"
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
            <div>
              <div class="pl-grid-top">
                <div class="pl-grid-top-left">
                  <h2 class="pl-subtit is-mt-m">QA 통화품질 평가표
                    <strong class="is-txt-main">{{ SELECTED_CYCL }}</strong>
                  </h2>
                </div>
              </div>
              <v-data-table
                class="pl-grid is-rowspan is-mt-m"
                :headers="headersRowSpan"
                :items="itemsRowSpan"
                fixed-header
                item-key="index"
                height="420px"
                hide-default-footer
                no-data-text="등록된 데이터가 없습니다."
                disable-pagination
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
                    <td :class="mixin_getHeaderClass(headersRowSpan[3].align)">
                      <span v-if="item.SCR != ''" > ● </span>
                    </td>
                    <td :class="mixin_getHeaderClass(headersRowSpan[4].align)" style="white-space: pre-line;">
                      {{ item.subject }}
                      <input type="hidden"  :name="item.radioGroup"/>
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
                            {{ mixin_sum_group_field(this.itemsRowSpan, "QLTY_CLSF_ID","type03") }}
                          </td>
                          <td class="text-center">
                              {{ mixin_sum_field(this.itemsRowSpan, "SCR") }}
                            </td>
                          <td></td>
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
  </div>
</template>

<script>
export default {
  name:"MENU_QAM_M0700", //name은 'MENU_' + 파일명 조합
  components: {
  },
 data() {
    return {
      validateRules: {
        QA_PLAN: [
          v => !!v.QA_PLAN_ID || '시행계획을 선택하세요.',
        ],
        ENFC_YR: [
          v => !!v || '시행연도는 필수 입력 항목 입니다.',
        ],
      },
      MESSAGE: {
        CONFIRM: {
        },
        ALERT: {
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },

      // top search
      //dropItems: [],
      //dropItems2: ['전체', '진행중', '종료'],
      //dropItems3: [],
      QA_CODES: [],
      DROP_ENFC_YR: [],
      DROP_ENFC_SE_CD: [],
      DROP_PLAN_NM: [],

      dialogListenVoice : true,
      dataForAudio : {},

      // info
      TOP_INFO: [
      ],
      TOP_INFO_TEMPLATE: [
        { title: '시행계획 명', desc: '', class: '', },
        { title: '시행 구분', desc: '', class: '', },
        { title: '평가 기간', desc: '', class: '', },
        { title: '시행 차수', desc: '', class: '', },
        { title: '진행상태', desc: '', class: 'is-txt-main', },
        // { title: '목표 대상자', desc: '150명', class: '', },
        { title: '등록자', desc: '', class: '', },
        { title: '등록일', desc: '', class: '', },
      ],

      // 나의 QA 평가 상담 내역
      // grid
      // page: 1,
      // pageCount: 0,
      // perPage: [15,30,50,100],
      // ROW_PER_PAGE: 15,
      headers: [
        { text: '번호'      , value: 'RNUM'    , align: 'center', width: '80px' ,sortable: false, },
        { text: '상담일자'  , value: 'CUTT_DT'       , align: 'left'  , width: '110px',sortable: false, },
        { text: '상담 시간' , value: 'CUTT_HR'                         , width: '90px' ,sortable: false, },
        { text: '콜 유형'   , value: 'CL_TYPE_NM'   , align: 'left'  , width: ''     ,sortable: false, },
        { text: '채널'      , value: 'CHNL_NM'       , align: 'left'  , width: '70px' ,sortable: false, },
        { text: '1차'       , value: 'CYCL1'         , align: 'center', width: '105px',sortable: false, },
        { text: '2차'       , value: 'CYCL2'         , align: 'center', width: '105px',sortable: false, },
        { text: '3차'       , value: 'CYCL3'         , align: 'center', width: '105px',sortable: false, },
      ],
      items: [
          // {
          //   index: 1,
          //   index02: '2023/01/00',
          //   index03: '02:35',
          //   index04: '인바운드',
          //   index05: '전화',
          //   index06: '100/100',
          //   index07: '100/100',
          //   index08: '100/100',
          // },
          // { index: 2, index02: '2023/01/00', index03: '02:35', index04: '인바운드', index05: '전화', index06: '100/100', index07: '100/100', index08: '100/100', },
          // { index: 3, index02: '2023/01/00', index03: '02:35', index04: '인바운드', index05: '전화', index06: '100/100', index07: '100/100', index08: '100/100', },
          // { index: 4, index02: '2023/01/00', index03: '02:35', index04: '인바운드', index05: '전화', index06: '100/100', index07: '100/100', index08: '100/100', },
          // { index: 5, index02: '2023/01/00', index03: '02:35', index04: '인바운드', index05: '전화', index06: '100/100', index07: '100/100', index08: '100/100', },
          // { index: 6, index02: '2023/01/00', index03: '02:35', index04: '인바운드', index05: '전화', index06: '100/100', index07: '100/100', index08: '100/100', },
          // { index: 7, index02: '2023/01/00', index03: '02:35', index04: '인바운드', index05: '전화', index06: '100/100', index07: '100/100', index08: '100/100', },
          // { index: 8, index02: '2023/01/00', index03: '02:35', index04: '인바운드', index05: '전화', index06: '100/100', index07: '100/100', index08: '100/100', },
          // { index: 9, index02: '2023/01/00', index03: '02:35', index04: '인바운드', index05: '전화', index06: '100/100', index07: '100/100', index08: '100/100', },
          // { index: 10, index02: '2023/01/00', index03: '02:35', index04: '인바운드', index05: '전화', index06: '100/100', index07: '100/100', index08: '100/100', },
          // { index: 11, index02: '2023/01/00', index03: '02:35', index04: '인바운드', index05: '전화', index06: '100/100', index07: '100/100', index08: '100/100', },
          // { index: 12, index02: '2023/01/00', index03: '02:35', index04: '인바운드', index05: '전화', index06: '100/100', index07: '100/100', index08: '100/100', },
          // { index: 13, index02: '2023/01/00', index03: '02:35', index04: '인바운드', index05: '전화', index06: '100/100', index07: '100/100', index08: '100/100', },
          // { index: 14, index02: '2023/01/00', index03: '02:35', index04: '인바운드', index05: '전화', index06: '100/100', index07: '100/100', index08: '100/100', },
          // { index: 15, index02: '2023/01/00', index03: '02:35', index04: '인바운드', index05: '전화', index06: '100/100', index07: '100/100', index08: '100/100', },
          // { index: 16, index02: '2023/01/00', index03: '02:35', index04: '인바운드', index05: '전화', index06: '100/100', index07: '100/100', index08: '100/100', },
      ],
      // 평가 결과
      RESULT_INFO: {
        // date: '2023-04-51',
        // cs_type: '카드 > 신규가입 > 인증서 발급',
        // count: 1,
        // audio_src: require('@/assets/sound/@_seth_makes_sounds__relaxing-lofi.wav'),
        date: '',
        cs_type: '',
        count: '',
        audio_src: '',
      },
      //grid
      headersRowSpan: [
        { text: "대분류", value: "type01", align: "left", width: "150px", sortable: false },
        { text: "중분류", value: "type02", align: "left", width: "150px", sortable: false },
        { text: "배점", value: "type03", align: "center", width: "60px", sortable: false },
        { text: "평가점수", value: "check", align: "center", width: "90px", sortable: false },
        { text: "품질기준", value: "subject", align: "left", width: "", sortable: false },
      ],
      itemsRowSpan: [
        // { index: 1, radioGroup: 'rad01', check: false, target_point: 0, type01: '도입부', type02: '첫/끝인사', type03: '7', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
        // { index: 2, radioGroup: 'rad01', check: false, target_point: 0, type01: '도입부', type02: '첫/끝인사', type03: '4', subject: '오픈멘트와 실명은 나누었지만, 친근감 없이 형식적으로 진행될 경우',  },
        // { index: 3, radioGroup: 'rad01', check: false, target_point: 0, type01: '도입부', type02: '첫/끝인사', type03: '0', subject: '첫인사 + 끝인사중 한가지이상 누락하였거나, 실명 없을 경우'},
        // { index: 4, radioGroup: 'rad02', check: false, target_point: 0, type01: '도입부', type02: '고객확인', type03: '5', subject: '필수 고객정보 확인하며 도입부에 2가지이상 고객께 직접 확인하는 경우',  },
        // { index: 5, radioGroup: 'rad02', check: false, target_point: 0, type01: '도입부', type02: '고객확인', type03: '2', subject: '필수 고객정보 확인은 하되 상담원의 입에서 1가지이상 정보 누출되는 경우',  },
        // { index: 6, radioGroup: 'rad02', check: false, target_point: 0, type01: '도입부', type02: '고객확인', type03: '0', subject: '통화 종료시점까지 고객정보 확인없이 진행하는 경우',  },
        // { index: 7, radioGroup: 'rad03', check: false, target_point: 0, type01: '응대 스킬', type02: '호응어', type03: '10', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)',  },
        // { index: 8, radioGroup: 'rad03', check: false, target_point: 0, type01: '응대 스킬', type02: '호응어', type03: '7', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)',  },
        // { index: 9, radioGroup: 'rad03', check: false, target_point: 0, type01: '응대 스킬', type02: '호응어', type03: '4', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)',  },
        // { index: 10, radioGroup: 'rad03', check: false, target_point: 0, type01: '응대 스킬', type02: '호응어', type03: '4', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)',  },
        // { index: 11, radioGroup: 'rad03', check: false, target_point: 0, type01: '응대 스킬', type02: '호응어', type03: '4', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)',  },
      ],
      SELECTED_QA_PLAN: {
      },
      CURRENT_CYCL_CNT: 0,
      SEARCH: {
        ENFC_YR: '',
        PRGRS_STTS_CD: '',
        ENFC_SE_CD: '',
        PLAN_NM: '',
      },
      CURRENT_DATE: '',
      SELECTED_CYCL: '',
      IPCC_SOCKET_URL: '',

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
  },

  created() {

  },
  async mounted() {
    let CURRENT_DATE = await this.mixin_getSvrDate("YYYY-MM-DD");
    let CURRENT_YEAR = parseInt(CURRENT_DATE.substr(0, 4));
    this.QA_CODES = await this.mixin_common_code_get_all(['QATS_ST'], 'Y');
    let QLTY_CLSF_CODES = await this.getQltyClfsCode();

    //selectbox 연도 설정 (-5년~+5년)
    this.DROP_ENFC_YR.push({ text: '전체', value: '' });   // default
    for (let i = -5; i < 5; i++) {
      this.DROP_ENFC_YR.push({ text: `${CURRENT_YEAR + i}년`, value: CURRENT_YEAR + i });
    }

    this.DROP_ENFC_SE_CD = [...QLTY_CLSF_CODES];
    this.DROP_ENFC_SE_CD.splice(0, 0, { QLTY_CLSF_NM: '전체', QLTY_CLSF_ID: '' });

    this.SEARCH.ENFC_YR = CURRENT_YEAR;

    this.CURRENT_DATE = CURRENT_DATE;

    await this.getQaPlan();
    await this.setQaEnfc();
    await this.getEvlRsltList();
    this.RESULT_INFO = {};
    this.SELECTED_CYCL = '';

    this.IPCC_SOCKET_URL = this.$store.getters["userStore/GE_USER_COMPANY"].API_URI;

    this.FBDWD_YN = await this.mixin_getChtStng('PROHIBITE_APPLY_YN');
    this.SHOW_QSTN = await this.mixin_getChtStng('INQRY_SHOW_YN');
  },
  methods: {
    async getQltyClfsCode() {
      let sUrl = "/api/qa/qltyclsf/code";
      let postParam = {};
      let headParam = {};
      let resData = await this.common_postCall(sUrl, postParam, headParam)

      if (resData.HEADER.ERROR_FLAG)
        return [];
      else {
        let dropQltyClsf = [];
        //console.log('response.DATA', response.DATA);
        dropQltyClsf = resData.DATA;
        return dropQltyClsf;
      }
    },
    btnSearch() {
      this.changeQaPlan();
    },
    async getQaPlan() {
      let sUrl = "/api/qa/plan/list";
      let postParam = {
        ENFC_YR: this.SEARCH.ENFC_YR,
        PRGRS_STTS_CD: 'TERMIAT',
        ENFC_SE_CD: this.SEARCH.ENFC_SE_CD,
        QA_PLAN_ID: this.mixin_isEmpty(this.SELECTED_QA_PLAN.QA_PLAN_ID) ? '' : this.SELECTED_QA_PLAN.QA_PLAN_ID,
        ONLY_MINE: 'Y'
      };

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
          //this.QA_PLAN.QA_PLAN_ID = this.DROP_PLAN_NM[0].QA_PLAN_ID;
          this.SELECTED_QA_PLAN = this.DROP_PLAN_NM[0];
          this.setQaEnfc();
        } else {
          this.$refs.form.resetValidation();
          //this.itemsRowSpan = [];
          this.TOP_INFO = [...this.TOP_INFO_TEMPLATE];
        }
      }
    },
    setQaEnfc() {
      const oItem = this.SELECTED_QA_PLAN;

      if (this.mixin_isEmpty(this.SELECTED_QA_PLAN.QA_PLAN_ID))
        return;

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
    },
    async changeSelect() {
      await this.getQaPlan();
      await this.changeQaPlan();
      this.RESULT_INFO = {};
    },
    async changeQaPlan() {
      // console.log("this.SELECTED_QA_PLAN", this.SELECTED_QA_PLAN);
      if (this.mixin_isEmpty(this.SELECTED_QA_PLAN.QA_PLAN_ID)) {
        this.TOP_INFO = [...this.TOP_INFO_TEMPLATE];
        this.items = [];
        this.itemsRowSpan = [];
        this.SELECTED_CYCL = '';
        this.RESULT_INFO = {};
      } else {
        await this.setQaEnfc();
        await this.getEvlRsltList();
        this.RESULT_INFO = {};
        this.itemsRowSpan = [];
        this.SELECTED_CYCL = '';
      }
    },
    async getEvlRsltList() {

      if(this.mixin_isEmpty(this.SELECTED_QA_PLAN.QA_PLAN_ID))
        return;

      let sUrl = "/api/qa/evlmng/cuttlist";
      let postParam = {
        ONLY_SLCTN : 'Y',
        QA_PLAN_ID : this.SELECTED_QA_PLAN.QA_PLAN_ID,
        ONLY_MINE : 'Y',
        CHNL_CD: this.SELECTED_QA_PLAN.EVL_CHN_CD,
      };
      let headParam = {
        head: {
          PAGING: 'N',
        },
      };

      let resData = await this.common_postCall(sUrl, postParam, headParam)

      if (!resData.HEADER.ERROR_FLAG) {
        this.items = resData.DATA;
        this.CURRENT_CYCL_CNT = this.SELECTED_QA_PLAN.CYCL_CNT;
      }
      this.$refs.form.resetValidation();
    },
    clickCycl(item, cycl) {

      //this.itemsRowSpan = [];
      // console.log("item", item);

      this.SELECTED_CYCL = "(" + cycl + "차)"
      this.RESULT_INFO.cs_type = item.CUTT_TYPE;
      // let sApiUri = this.$store.getters["userStore/GE_USER_COMPANY"].API_URI;
      // const iSemiCnt = sApiUri.match(/:/g).filter(function(item) { return item !== ''; }).length;
      //
      // if(iSemiCnt > 1){
      //   this.RESULT_INFO.audio_src = sApiUri.split(':')[0] + ':' + sApiUri.split(':')[1] + '/hdd2/rec/' + item.REC_FILE_NM + '.mp3';
      // }else{
      //   this.RESULT_INFO.audio_src = sApiUri + '/hdd2/rec/' + item.REC_FILE_NM + '.mp3';
      // }
      this.dataForAudio = {};
      this.dataForAudio = {
        REC_FILE_NM : item.REC_FILE_NM
        , CUST_ID : this.mixin_isEmpty(item.CUST_ID) ? null : item.CUST_ID
        , PHN_CUTT_ID : this.mixin_isEmpty(item.PHN_CUTT_ID) ? null : item.PHN_CUTT_ID
      };
      // console.log("this.dataForAudio", this.dataForAudio)

      let qaPlanId = item.QA_PLAN_ID;
      let qaMngrId = item.QA_MNGR_ID;
      let qaTrgtId = item.QA_TRGT_ID;
      //let qaCyclId = item.QA_CYCL_ID;
      let qaCyclId = '';

      switch(cycl) {
        case "1":
          this.RESULT_INFO.date = item.CYCL1_EVL_DT;
          qaCyclId = item.CYCL1_ID;
          break;
        case "2":
          this.RESULT_INFO.date = item.CYCL2_EVL_DT;
          qaCyclId = item.CYCL2_ID;
          break;
        case "3":
          this.RESULT_INFO.date = item.CYCL3_EVL_DT;
          qaCyclId = item.CYCL3_ID;
          break;
      }

      if(item.CHNL == 'TEL'){

      } else if(item.CHNL == 'SNS'){
        this.RESULT_INFO.CHT_CUTT_ID = item.CHT_CUTT_ID
        this.RESULT_INFO.CUST_ID = item.CUST_ID
        this.RESULT_INFO.CHT_USER_KEY = item.CHT_USER_KEY
        this.RESULT_INFO.SNDR_KEY = item.SNDR_KEY
        this.RESULT_INFO.CHN_CLSF_CD = item.CHN_CLSF_CD
      }


      if (this.mixin_isEmpty(qaPlanId) || this.mixin_isEmpty(qaMngrId) || this.mixin_isEmpty(qaCyclId) || this.mixin_isEmpty(qaTrgtId))
        return;

      this.getEvlRsltSheet(qaPlanId, qaMngrId, qaCyclId, qaTrgtId);

    },
    async getEvlRsltSheet(qaPlanId, qaMngrId, qaCyclId, qaTrgtId) {

      let sUrl = "/api/qa/evlefc/getsheet";

      let postParam = {
        DEL_YN: "N",
        QA_PLAN_ID: qaPlanId,
        QA_MNGR_ID: qaMngrId,
        QA_TRGT_ID: qaTrgtId,
        QA_CYCL_ID: qaCyclId,
      }

      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!resData.HEADER.ERROR_FLAG) {
        //성공시 이벤트
        await this.setPlanQltySheet(resData.EVL_SHEET);
        //$("[name=rad1]")[0].focus();
      }
    },
    async setPlanQltySheet(resData) {
      let oPaper = [];
      let radIndex = 0;
      let radPrefix = "rad";
      let oScore = {};
      let oChecked = [];

      resData.forEach(item => {
        //item.QA_PLAN_ID = this.SELECTED_QA_PLAN.QA_PLAN_ID;
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
          //item.subject = item.EVL_ARTCL_NM.replace(/(?:\r\n|\r|\n)/g, '<br />');
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
      this.itemsRowSpan = oPaper;

    },

    //채팅 내역 조회
    async chatHstSrch(){
      let sUrl = '/chat-api/main/cnslt-cn/inqire';
      let postParam = {
        CHT_CUTT_ID: this.RESULT_INFO.CHT_CUTT_ID,
        CUST_ID: this.RESULT_INFO.CUST_ID,
        CUTT_STTS_CD: 'CMPL',
        CHT_RDY_ID: '',
        CHT_USER_KEY : this.RESULT_INFO.CHT_USER_KEY,
        SNDR_KEY : this.RESULT_INFO.SNDR_KEY,
        CHN_CLSF_CD : this.RESULT_INFO.CHN_CLSF_CD,
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