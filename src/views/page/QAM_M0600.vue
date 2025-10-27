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
              <span class="pl-label">진행 상태</span>
              <div class="pl-desc">
                <v-select class="pl-form"
                  :items="DROP_PRGRS_STTS_CD"
                  placeholder="선택하세요"
                  v-model="SEARCH.PRGRS_STTS_CD"
                  @change="changeSelect"
                />
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
                  @change="changeSelect"
                />
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
                  :rules="validateRules.QA_PLAN"
                />
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
      <!-- content -->
      <div class="pl-cols" style="height: 100%">
        <!-- 평가 관리자 -->
        <div >
          <div class="pl-card">
            <div class="pl-grid-top">
              <div class="pl-grid-top-left">
                <h2 class="pl-subtit">평가 관리자
                  <v-text-field
                    class="pl-form is-search ml-2"
                    placeholder="검색어 입력"
                    @keydown.enter="btnSearchWord()"
                    v-model="KEYWORD"
                  >
                  <template v-slot:append>
                    <v-btn
                      @click="btnSearchWord()"
                      class="pl-btn has-icon-only">
                      <span class="pl-icon20 in-search"></span>
                    </v-btn>
                  </template>
                </v-text-field>
                </h2>
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-text-box">
                  <span class="pl-text-box-tit">대상</span>
                  <span class="pl-text-box-desc">{{ ADMIN_INFO.target_cur }} / {{ ADMIN_INFO.target_max }}</span>
                </span>
                <span class="pl-text-box">
                  <span class="pl-text-box-tit">진행률</span>
                  <span class="pl-text-box-desc is-txt-main"> {{ ADMIN_INFO.progress }} %</span>
                </span>
              </div>
            </div>
            <v-data-table
              class="pl-grid is-hover"
              :headers="headers"
              :items="items"
              fixed-header
              item-key="ROW_NUMBER"
              height="527px"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              :page.sync="page"
              @page-count="pageCount = $event"
              no-data-text="등록된 데이터가 없습니다."
            >
              <template v-slot:item.CYCL1="{ item }">
                <td :class="mixin_getHeaderClass(headers[4].align)" >
                  <v-btn v-if="CURRENT_CYCL_CNT >= 1" @click="clickCycl(item, '1')" class="pl-btn is-sm">
                    {{ item.CYCL1 }}
                  </v-btn>
                  <span v-if="CURRENT_CYCL_CNT < 1">-</span>
                </td>
                </template>
              <template v-slot:item.CYCL2="{ item }">
                <td :class="mixin_getHeaderClass(headers[5].align)" >
                  <v-btn v-if="CURRENT_CYCL_CNT >= 2" @click="clickCycl(item, '2')" class="pl-btn is-sm">
                    {{ item.CYCL2 }}
                  </v-btn>
                  <span v-if="CURRENT_CYCL_CNT < 2">-</span>
                </td>
              </template>
              <template v-slot:item.CYCL3="{ item }">
                <td :class="mixin_getHeaderClass(headers[6].align)" >
                  <v-btn v-if="CURRENT_CYCL_CNT >= 3" @click="clickCycl(item, '3')" class="pl-btn is-sm">
                    {{ item.CYCL3 }}
                  </v-btn>
                  <span v-if="CURRENT_CYCL_CNT < 3">-</span>
                </td>
              </template>
              <template v-slot:item.FULL_PATH="{ item }">
                <v-tooltip content-class="pl-tooltip " bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">{{ item.FULL_PATH }}</span>
                  </template>
                  <span>{{ item.FULL_PATH }}</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </div>
        </div>
        <!-- 평가 대상자 -->
        <div class="is-vrt is-col-fix" style="width: 650px">
          <div class="pl-card">
            <!-- grid -->
            <div>
              <div class="pl-grid-top">
                <div class="pl-grid-top-left">
                  <h2 class="pl-subtit is-mt-m">평가 대상자 {{ SELECTED_CYCL }}</h2>
                </div>
                <div class="pl-grid-top-utils">
                  <span class="pl-counter">전체 <em class="pl-1">({{ items2.length }})</em> 건</span>
                </div>
              </div>
              <v-data-table
                class="pl-grid is-hover"
                :headers="headers2"
                :items="items2"
                fixed-header
                item-key="index"
                height="527px"
                :items-per-page="ROW_PER_PAGE"
                hide-default-footer
                :page.sync="page"
                @page-count="pageCount = $event"
                no-data-text="등록된 데이터가 없습니다."
              >
              <template v-slot:item.COMPTN_YN="{ item }">
                <span :class="item.COMPTN_YN ? 'is-txt-main' : ''">
                  {{ displayStatus(item.COMPTN_YN) }}
                </span>
              </template>
              <template v-slot:item.SCR="{ item }">
                <v-btn @click="btnTempEvlSheet(item)" class="pl-btn is-sm">
                {{ item.SCR }}
                </v-btn>
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
        header-title="QA 평가 결과표"
        @hide="mixin_hideDialog('Preview')"
        @submit="submitDialog('Preview')"
      >
        <template slot="body">
          <h2 class="pl-subtit">평가 대상자 : <span class="font-weight-medium ml-2 ">{{ preview_target }}</span></h2>
          <v-data-table
            class="pl-grid is-rowspan is-mt-m"
            :headers="headersRowSpan"
            :items="itemsRowSpan"
            fixed-header
            item-key="index"
            height="535px"
            :items-per-page="ROW_PER_PAGE"
            hide-default-footer
            :page.sync="page"
            @page-count="pageCount = $event"
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
                        {{ mixin_sum_group_field(this.itemsRowSpan, "QLTY_CLSF_ID", "type03") }}
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
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name:"MENU_QAM_M0600", //name은 'MENU_' + 파일명 조합
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

      // dialog
      dialogPreview: false,
      preview_target: '나상담(CS5팀 > 인바운드1팀)',
      headersRowSpan: [
        { text: "대분류", value: "type01", align: "left", width: "150px", sortable: false },
        { text: "중분류", value: "type02", align: "left", width: "150px", sortable: false },
        { text: "배점", value: "type03", align: "center", width: "60px", sortable: false },
        { text: "평가점수", value: "check", align: "center", width: "90px", sortable: false },
        { text: "품질기준", value: "subject", align: "left", width: "", sortable: false },
      ],
      itemsRowSpan: [
        { index: 1, radioGroup: 'rad01', check: false, target_point: 0, type01: '도입부', type02: '첫/끝인사', type03: '7', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
        { index: 2, radioGroup: 'rad01', check: false, target_point: 0, type01: '도입부', type02: '첫/끝인사', type03: '4', subject: '오픈멘트와 실명은 나누었지만, 친근감 없이 형식적으로 진행될 경우',  },
        { index: 3, radioGroup: 'rad01', check: false, target_point: 0, type01: '도입부', type02: '첫/끝인사', type03: '0', subject: '첫인사 + 끝인사중 한가지이상 누락하였거나, 실명 없을 경우'},
        { index: 4, radioGroup: 'rad02', check: false, target_point: 0, type01: '도입부', type02: '고객확인', type03: '5', subject: '필수 고객 정보 확인하며 도입부에 2가지이상 고객께 직접 확인하는 경우',  },
        { index: 5, radioGroup: 'rad02', check: false, target_point: 0, type01: '도입부', type02: '고객확인', type03: '2', subject: '필수 고객 정보 확인은 하되 상담원의 입에서 1가지이상 정보 누출되는 경우',  },
        { index: 6, radioGroup: 'rad02', check: false, target_point: 0, type01: '도입부', type02: '고객확인', type03: '0', subject: '통화 종료시점까지 고객 정보 확인없이 진행하는 경우',  },
        { index: 7, radioGroup: 'rad03', check: false, target_point: 0, type01: '응대 스킬', type02: '호응어', type03: '10', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)',  },
        { index: 8, radioGroup: 'rad03', check: false, target_point: 0, type01: '응대 스킬', type02: '호응어', type03: '7', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)',  },
        { index: 9, radioGroup: 'rad03', check: false, target_point: 0, type01: '응대 스킬', type02: '호응어', type03: '4', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)',  },
      ],

      // top search
      DROP_ENFC_YR: [],
      DROP_PRGRS_STTS_CD: [],
      DROP_ENFC_SE_CD: [],
      DROP_PLAN_NM: [],

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

      // 평가관리자
      ADMIN_INFO: {
        target_cur: 0,
        target_max: 0,
        progress: 0.0,
      },
      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: -1,
      headers: [
        { text: '번호'          , value: 'ROW_NUMBER', align: 'center' , width: '80px', sortable: false },
        { text: '평가 관리자'   , value: 'USER_NM'   , align: 'left'   , width: '150px' },
        { text: '평가관리자 ID' , value: 'LGN_ID'    , align: 'left'   , width: '150px', sortable: false },
        { text: '소속'          , value: 'FULL_PATH' , align: 'left'   , width: '', sortable: false },
        { text: '1차'           , value: 'CYCL1'     , align: 'center' , width: '130px', sortable: false },
        { text: '2차'           , value: 'CYCL2'     , align: 'center' , width: '130px', sortable: false },
        { text: '3차'           , value: 'CYCL3'     , align: 'center' , width: '130px', sortable: false },
      ],
      items: [],

      // 평가대상자
      headers2: [
        { text: '번호'    , value: 'ROW_NUMBER' , align: 'center' , width: '80px', sortable: false },
        { text: '상담직원', value: 'USER_NM'    , width: '',sortable: false  },
        { text: '상담시간', value: 'PHN_HR'     , width: '100px', sortable: false },
        { text: '평가여부', value: 'COMPTN_YN'  , width: '100px', sortable: false },
        { text: '평가일자', value: 'EVL_DT'     , width: '120px', sortable: false },
        { text: '점수'    , value: 'SCR'        , align: 'center', sortable: false }
      ],
      items2: [
        // {
        //   index01: 1,
        //   index02: '나상담1',
        //   index03: '02:34',
        //   index04: true,
        //   index05: '2023-01-25',
        //   index06: 100,
        // },
        // {
        //   index01: 1,
        //   index02: '나상담1',
        //   index03: '02:34',
        //   index04: false,
        //   index05: '2023-01-25',
        //   index06: 100,
        // },
      ],
      SELECTED_QA_PLAN:{
      },
      CURRENT_CYCL_CNT:0,
      SEARCH : {
        ENFC_YR: '',
        PRGRS_STTS_CD: '',
        ENFC_SE_CD: '',
        PLAN_NM: '',
      },
      CURRENT_DATE : '',
      KEYWORD: '',
      SELECTED_CYCL:'',
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
    //this.DROP_PRGRS_STTS_CD = this.mixin_common_code_get(this.QA_CODES, 'QATS_ST', '전체');
    this.DROP_PRGRS_STTS_CD = this.mixin_common_code_get(this.QA_CODES, 'QATS_ST');

    //준비중은 제외
    for (let i = 0; i < this.DROP_PRGRS_STTS_CD.length; i++) {
      let item = this.DROP_PRGRS_STTS_CD[i];
      // console.log('item', item);
      if (item.value == 'PRPARG') {
        this.DROP_PRGRS_STTS_CD.splice(i, 1);
        break;
      }
    }

    this.DROP_ENFC_SE_CD = [...QLTY_CLSF_CODES];
    this.DROP_ENFC_SE_CD.splice(0, 0, { QLTY_CLSF_NM: '전체', QLTY_CLSF_ID: '' });

    this.SEARCH.PRGRS_STTS_CD = "ONGONG";
    this.SEARCH.ENFC_YR = CURRENT_YEAR;

    this.CURRENT_DATE = CURRENT_DATE;

    await this.getQaPlan();
    await this.setQaEnfc();
    await this.getEvlRsltMngrList();
    this.SELECTED_CYCL = '';
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
    displayStatus(type) {
      const typeList = [
        { type_list_text: '완료', type_list_type: "Y" }, //완료,
        { type_list_text: '미완료', type_list_type: "N" }, //미완료,
      ];

      for (let i = 0; i < typeList.length; i++) {
        if (typeList[i].type_list_type === type) {
          return typeList[i].type_list_text;
        }
      }
    },
    btnSearch() {
      // console.log("btnSearch");
      this.changeQaPlan();
    },
    async getQaPlan() {
      let sUrl = "/api/qa/plan/list";
      let postParam = {
        ENFC_YR: this.SEARCH.ENFC_YR,
        PRGRS_STTS_CD: this.SEARCH.PRGRS_STTS_CD,
        ENFC_SE_CD: this.SEARCH.ENFC_SE_CD,
        QA_PLAN_ID: this.mixin_isEmpty(this.SELECTED_QA_PLAN.QA_PLAN_ID) ? '' : this.SELECTED_QA_PLAN.QA_PLAN_ID ,
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
          //this.setQaEnfc();
        } else {
          try{this.$refs.form.resetValidation();}catch(e){}
          //this.itemsRowSpan = [];
          this.TOP_INFO = [...this.TOP_INFO_TEMPLATE];
        }
      }
    },
    setQaEnfc() {
      const oItem = this.SELECTED_QA_PLAN;

      if(this.mixin_isEmpty(this.SELECTED_QA_PLAN.QA_PLAN_ID))
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
    },
    async changeQaPlan() {
      if (this.mixin_isEmpty(this.SELECTED_QA_PLAN.QA_PLAN_ID)) {
        this.TOP_INFO = [...this.TOP_INFO_TEMPLATE];
        this.items = [];
        this.items2 = [];
        this.SELECTED_CYCL = '';
      } else {
        await this.setQaEnfc();
        await this.getEvlRsltMngrList();
        this.items2 = [];
        this.SELECTED_CYCL = '';
      }
    },
    async getEvlRsltMngrList(bSearchWord) {
      if(this.mixin_isEmpty(this.SELECTED_QA_PLAN.QA_PLAN_ID)) {
        this.items = [];
        this.items2 = [];
        this.SELECTED_CYCL = '';
        return;
      }

      let sUrl = "/api/qa/evlrslt/mngrlist";
      let postParam = {
        QA_PLAN_ID : this.SELECTED_QA_PLAN.QA_PLAN_ID,
        SEARCH_WORD : bSearchWord ? this.KEYWORD : '',
      };

      let headParam = {
        head: {
        }
      };

      let resData = await this.common_postCall(sUrl, postParam, headParam)

      if (!resData.HEADER.ERROR_FLAG) {
          let oList = resData.DATA;
          let oStat = resData.RSLT_STAT[0];

          this.items = resData.DATA;
          this.ADMIN_INFO.target_cur = this.mixin_isEmpty(oStat.COMPLETE_CNT) ? '0' : oStat.COMPLETE_CNT;
          this.ADMIN_INFO.target_max = oStat.TOTAL_CNT;
          if((oStat.COMPLETE_CNT == '0'|| this.mixin_isEmpty(oStat.COMPLETE_CNT)) && oStat.TOTAL_CNT =='0'){
            this.ADMIN_INFO.progress = '0';
          }else{
            this.ADMIN_INFO.progress = Math.round((parseFloat(this.mixin_isEmpty(oStat.COMPLETE_CNT) ? '0' : oStat.COMPLETE_CNT) / parseFloat(oStat.TOTAL_CNT)) * 100 * 10 ) / 10 ;
          }
          this.CURRENT_CYCL_CNT = this.SELECTED_QA_PLAN.CYCL_CNT;
      } else {
        //
      }
    },
    clickCycl(item, cycl) {
      let qaPlanId = item.QA_PLAN_ID;
      let mngrId = item.QA_MNGR_ID;
      let qaCyclId;
      for(let oItem of this.SELECTED_QA_PLAN.CYCL_LIST) {
        if(oItem.cycl_nm == cycl) {
          qaCyclId = oItem.qa_cycl_id;
          break;
        }
      }
      this.getEvlRsltTrgtList(qaPlanId, mngrId, qaCyclId, cycl);
    },
    async getEvlRsltTrgtList(qaPlanId, qaMngrId, qaCyclId, cycl) {
      if (this.mixin_isEmpty(qaPlanId) || this.mixin_isEmpty(qaMngrId) || this.mixin_isEmpty(qaCyclId)) {
        return;
      }

      let sUrl = "/api/qa/evlrslt/trgtlist";

      let postParam = {
        QA_PLAN_ID: qaPlanId,
        QA_MNGR_ID: qaMngrId,
        QA_CYCL_ID: qaCyclId,
      };

      let headParam = {
        head: {
        }
      };

      let resData = await this.common_postCall(sUrl, postParam, headParam)

      if (!resData.HEADER.ERROR_FLAG) {
        let oList = resData.DATA;
        this.items2 = resData.DATA;
        this.SELECTED_CYCL = "(" + cycl + "차)"
      } else {
        //
      }
    },
    btnSearchWord() {
      this.getEvlRsltMngrList(true);
    },
   btnTempEvlSheet(item) {
      this.preview_target = item.USER_NM;
      let qaPlanId = item.QA_PLAN_ID;
      let qaMngrId = item.QA_MNGR_ID;
      let qaCyclId = item.QA_CYCL_ID;
      let qaTrgtId = item.QA_TRGT_ID;

      if(this.mixin_isEmpty(qaPlanId) || this.mixin_isEmpty(qaMngrId) || this.mixin_isEmpty(qaCyclId) || this.mixin_isEmpty(qaTrgtId) )
        return;
      this.dialogPreview = true;
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
        this.setPlanQltySheet(resData.EVL_SHEET);
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
  },
}
</script>

<style lang="scss" scoped>

</style>