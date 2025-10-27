<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
        <v-form ref="form">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                시행 연도
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="DROP_YEAR"
                  placeholder="선택하세요"
                  v-model="SEARCH_QA_PLAN.ENFC_YR"
                  @change="changeSelect"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">진행 상태</span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="DROP_PRGRS_STTS"
                  placeholder="선택하세요"
                  v-model="SEARCH_QA_PLAN.PRGRS_STTS_CD"
                  @change="changeSelect"
                  ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">시행 구분</span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="DROP_ENFC_SE"
                  placeholder="선택하세요"
                  v-model="SEARCH_QA_PLAN.ENFC_SE_CD"
                  @change="changeSelect"
                  item-text="QLTY_CLSF_NM"
                  item-value="QLTY_CLSF_ID"
                  ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">시행계획 명</span>
              <div class="pl-desc">
                <v-select
                  class="pl-form is-lg"
                  :items="DROP_PLAN_NM"
                  placeholder="선택하세요"
                  item-text="PLAN_NM"
                  item-value="QA_PLAN_ID"
                  v-model="SELECTED_QA_PLAN"
                  @change="changePlan"
                  return-object
                  :rules="validateRules.QA_PLAN"
                ></v-select>
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
      <!-- grid -->
      <div class="pl-card">
        <div class="pl-cols">
          <div>
            <h2 class="pl-subtit d-flex justify-space-between align-center">
              <div class="d-flex align-center">
                사용자
                <v-text-field
                  class="pl-form is-search is-lg ml-2"
                  placeholder="검색어 입력"
                  @keydown.enter="btnUserSearch()"
                  v-model="SEARCH_WORD"
                >
                  <template v-slot:append>
                    <v-btn
                      @click="btnUserSearch()"
                      class="pl-btn has-icon-only">
                      <span class="pl-icon20 in-search"></span>
                    </v-btn>
                  </template>

                </v-text-field>
              </div>
              <span class="pl-counter">전체 <em class="pl-1">({{ UL_DATA.length }})</em> 건</span>
            </h2>
            <!-- User List -->
            <v-data-table
              class="pl-grid has-control is-mt-m is-hover"
              :headers="UL_HEADER"
              :items="UL_DATA"
              show-select
              fixed-header
              item-key="ROW_NUMBER"
              height="527px"
              :items-per-page="ROW_PER_UL"
              hide-default-footer
              :page.sync="ulPage"
              @page-count="ulPageCount = $event"
              v-model="SELECTED_USER"
              selectable-key="ENABLED"
              no-data-text="등록된 데이터가 없습니다."
            >
              <template v-slot:item.index="{ item, index }">
                  {{ index + 1 }}
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
          <div class="d-flex flex-column justify-center align-center" style="flex: 0 0 58px; gap: 14px">
            <!-- arrow left 버튼 -->
            <compo-tooltip-btn
              TitleProp="평가 관리자 해제"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon30 is-arrow-left"
              TooltipPositionProp="bottom"
              @btnClick="btnUserRemove"
              :DisabledProp="SELECTED_MNGR.length != 0 ? false : true"
            ></compo-tooltip-btn>
            <!-- arrow right 버튼 -->
            <compo-tooltip-btn
              TitleProp="평가 관리자로 지정"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon30 is-arrow-right"
              TooltipPositionProp="bottom"
              @btnClick="btnUserAdd"
              :DisabledProp="SELECTED_USER.length != 0 ? false : true"
            ></compo-tooltip-btn>
          </div>
          <div>
            <h2 class="pl-subtit is-inform d-flex justify-space-between">QA 평가 관리자
              <span class="pl-counter">전체 <em class="pl-1">({{ ML_DATA.length }})</em> 건</span>
            </h2>
            <!-- Manager List -->
            <v-data-table
              class="pl-grid has-control is-mt-m is-hover"
              :headers="UL_HEADER"
              :items="ML_DATA"
              show-select
              fixed-header
              item-key="ROW_NUMBER"
              height="527px"
              :items-per-page="ROW_PER_UL"
              hide-default-footer
              :page.sync="mlPage"
              @page-count="mlPageCount = $event"
              v-model="SELECTED_MNGR"
              no-data-text="등록된 데이터가 없습니다."
            >
              <template v-slot:item.index="{ item, index }">
                  {{ index + 1 }}
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:"MENU_QAM_M0200", //name은 'MENU_' + 파일명 조합
  components: {
  },
 data() {
    return {
      MESSAGE: {
        CONFIRM: {
          REGIST:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '저장 하시겠습니까?', callYes: this.saveYes, callNo: this.closeMsg },
        },
        ALERT: {
          SAVE_DONE:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '저장 되었습니다.'},
          AFTER_REG_PLAN:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '시행계획을 조회한 후 등록이 가능 합니다.' },
          NEED_USER:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '추가할 사용자를 선택 하세요.' },
          NEED_MNGR:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '삭제할 관리자를 선택하세요.' },
          EXIST_USER:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '이미 추가된 사용자 입니다.' },
          ALTMNT_MNGR_EXIST:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가 대상자가 할당된 관리자는\n 삭제할 수 없습니다.' },
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.' },	//기본항목
        }
      },
      validateRules: {
        QA_PLAN: [
          v => !!v.QA_PLAN_ID || '시행계획을 선택하세요.',
        ],
      },
      // top search
      DROP_YEAR: [],       //시행년도
      DROP_PRGRS_STTS: [],  //진행상태
      DROP_ENFC_SE: [],     //시행구분
      DROP_PLAN_NM: [],     //시행계획명
      // info
      TOP_INFO_TEMPLETE: [
        {
          title: '시행계획 명',
          desc: ' ',
          class: '',
        },
        {
          title: '시행 구분',
          desc: ' ',
          class: '',
        },
        {
          title: '평가 기간',
          desc: '',
          class: '',
        },
        {
          title: '시행 차수',
          desc: '',
          class: '',
        },
        {
          title: '진행상태',
          desc: '',
          class: 'is-txt-main',
        },
        // {
        //   title: '목표 대상자',
        //   desc: '150명',
        //   class: '',
        // },
        {
          title: '등록자',
          desc: '',
          class: '',
        },
        {
          title: '등록일',
          desc: '',
          class: '',
        },
      ],
      TOP_INFO: [
      ],

      // grid
      ulPage: 1,
      ulPageCount: 0,
      ulPerPage: [15,30,50,100],
      ROW_PER_UL: -1,
      UL_HEADER: [
        { text: '번호'    , value: 'index'          , align: 'center' , width: '80px' },
        { text: '사용자ID', value: 'LGN_ID'         , align: 'left'   , width: '120px' },
        { text: '사용자명', value: 'USER_NM'        , align: 'left'   , width: '120px' },
        { text: '소속'    , value: 'FULL_PATH'      , align: 'left'   , width: '100%' },
        { text: '권한그룹', value: 'AUTHRT_GROUP_NM', align: 'left'   , width: '120px' },

        { text: 'ROWNUM'  , value: 'ROW_NUMBER'     , align: ' d-none' },
        { text: '키값'    , value: 'LIST_KEY'       , align: ' d-none' }, //USER_ID + DEPT_ID
      ],
      UL_DATA_ORG:[
      ],
      UL_DATA: [
      ],

      mlPage: 1,
      mlPageCount: 0,
      mlPerPage: [15,30,50,100],
      ROW_PER_ML: -1,
      ML_DATA: [
      ],
      SEARCH_QA_PLAN: {
        ENFC_YR: '',
        PRGRS_STTS_CD: '',
        ENFC_SE_CD: '',
        QA_PLAN_ID: '',
      },
      SELECTED_USER: [],
      SELECTED_MNGR: [],
      SELECTED_QA_PLAN: {},
      SEARCH_WORD: '',
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

    let QA_CODES = await this.mixin_common_code_get_all(['QATS_ST', 'USE_WT'], 'Y');

    //selectbox 연도 설정 (조회:전체있음.-5년~+5년, 등록/수정:전체없음.현재~+1년)
    //selectbox 연도 설정 (조회:전체있음.-5년~+5년, 등록/수정:전체없음.현재~+1년)
    this.DROP_YEAR.push({ text: '전체', value: '' });   // default
    for (let i = -5; i < 5; i++) {
      this.DROP_YEAR.push({ text: `${CURRENT_YEAR + i}년`, value: CURRENT_YEAR + i });
    }
    this.DROP_PRGRS_STTS = this.mixin_common_code_get(QA_CODES, 'QATS_ST', '전체');
    let dropQltyClsf = await this.getQltyClfsCode();
    this.DROP_ENFC_SE = [...dropQltyClsf];
    this.DROP_ENFC_SE.splice(0, 0, { QLTY_CLSF_NM: '전체', QLTY_CLSF_ID: '' });

    this.SEARCH_QA_PLAN.ENFC_YR = CURRENT_YEAR;
    //this.SEARCH_QA_PLAN.PRGRS_STTS_CD = 'PRPARG';   //준비중 디폴트 (관리자 지정은 진행되기 이전에만 가능하므로)

    this.SEARCH_QA_PLAN.ENFC_SE_CD = '';

    await this.getQaPlan();
    await this.getUserList();

    if(this.SELECTED_QA_PLAN.QA_PLAN_ID != undefined && !this.mixin_isEmpty(this.SELECTED_QA_PLAN.QA_PLAN_ID)) {
      await this.setTopInfo();
      await this.getMngrList();
    }
  },

  methods: {
    async changeSelect() {
      await this.getQaPlan();
      if(this.SELECTED_QA_PLAN.QA_PLAN_ID == undefined && this.mixin_isEmpty(this.SELECTED_QA_PLAN.QA_PLAN_ID)) {
        this.TOP_INFO = [...this.TOP_INFO_TEMPLETE];
        this.ML_DATA = [];
      } else {
        this.setTopInfo();
        this.getMngrList();
      }
    },
    async getQaPlan() {
      let sUrl = '/api/qa/plan/list';
      let postParam = this.SEARCH_QA_PLAN;
      let headParam = {
      }

      this.SEARCH_QA_PLAN.QA_PLAN_ID = '';

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!resData.HEADER.ERROR_FLAG) {
        this.DROP_PLAN_NM = resData.DATA;
        if (this.DROP_PLAN_NM.length > 0) {
          this.SEARCH_QA_PLAN.QA_PLAN_ID = this.DROP_PLAN_NM[0].QA_PLAN_ID;
          this.SELECTED_QA_PLAN = this.DROP_PLAN_NM[0];
        } else {
          this.SELECTED_QA_PLAN = {};
          this.$refs.form.resetValidation();
        }
      }
    },
    btnSearch() {
      if(!this.$refs.form.validate())
        return;
      this.setTopInfo();
      this.getMngrList();
    },
    changePlan(row) {
      this.SELECTED_QA_PLAN = row;
      this.SEARCH_QA_PLAN.QA_PLAN_ID = this.SELECTED_QA_PLAN.QA_PLAN_ID;
    },
    setTopInfo() {
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
    },
    btnUserSearch() {
      this.getUserList(this.SEARCH_WORD);
    },
    async getUserList(searchWord) {
      let sUrl = "/api/qa/mngrmng/userlist";
      let postParam = {
        //넘길 파라미터(대문자)
        SEARCH_WORD: this.mixin_isEmpty(searchWord)?'':searchWord,
      }
      let headParam = {
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!resData.HEADER.ERROR_FLAG) {
        //성공시 이벤트
        resData.DATA.map(item => item['ENABLED'] = true);
        this.UL_DATA_ORG = resData.DATA;
        this.UL_DATA = [...this.UL_DATA_ORG];
      }
    },
    async getMngrList() {
      let sUrl = "/api/qa/mngrmng/mngrlist";
      let postParam = {
        //넘길 파라미터(대문자)
        QA_PLAN_ID: this.SELECTED_QA_PLAN.QA_PLAN_ID,
      }
      let headParam = {
        head: {
          PAGING: 'N',
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)

      if (!resData.HEADER.ERROR_FLAG) {
        this.ML_DATA = resData.DATA;
        this.hideRegisted()
        this.SELECTED_MNGR = [];
      }
    },
    hideRegisted() {
      this.UL_DATA = [...this.UL_DATA_ORG.filter(user => !this.ML_DATA.map(mgr => mgr['MNGR_ID']).includes(user['USER_ID']))];
    },
    checkRegisted() {
      let oUl = this.UL_DATA;
      let oMl = this.ML_DATA;
      let oSl = this.SELECTED_USER;

      this.SELECTED_USER=[];

      const oInsUser = this.SELECTED_USER.filter(user => !(this.ML_DATA.map(mngr => mngr['MNGR_ID']).includes(user['USER_ID'])));

      this.UL_DATA = this.UL_DATA.map(user => {
        let bInserted = oMl.map(mgr => mgr['MNGR_ID']).includes(user['USER_ID']);
        if (bInserted) {
          user['ENABLED'] = false;
          this.SELECTED_USER.push(user);
        } else
          user['ENABLED'] = true;
        return user;
      });
    },
    async btnUserAdd() {
      if(this.SELECTED_QA_PLAN.QA_PLAN_ID == undefined || this.mixin_isEmpty(this.SELECTED_QA_PLAN.QA_PLAN_ID)) {
        this.showAlert(this.MESSAGE.ALERT.AFTER_REG_PLAN);
        return;
      } else if (this.SELECTED_USER < 1) {
        //선택된 값이 없으면 alert
        this.showAlert(this.MESSAGE.ALERT.NEED_USER);
        return;
      }

      //이미 추가되어 있는 사용자는 제외.
      const oInsUser = this.SELECTED_USER.filter(user => !(this.ML_DATA.map(mngr => mngr['MNGR_ID']).includes(user['USER_ID'])));

      if(oInsUser.length < 1) {
        this.showAlert(this.MESSAGE.ALERT.EXIST_USER);
        return;
      }

      let mngList = [];

      oInsUser.forEach(array => {
        mngList.push(array.USER_ID);
      });

      let sUrl = "/api/qa/mngrmng/regist";
      let postParam = {
        //넘길 파라미터(대문자)
        QA_PLAN_ID: this.SELECTED_QA_PLAN.QA_PLAN_ID,
        MNGR_LIST: mngList.join(','),
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!resData.HEADER.ERROR_FLAG) {
        //성공시 이벤트
        this.getMngrList();
        this.SELECTED_USER = [];
      }
    },
    async btnUserRemove() {
      if(this.SELECTED_MNGR.length < 1) {
        this.showAlert(this.MESSAGE.ALERT.NEED_MNGR);
        return;
      }
      let oDelList = this.SELECTED_MNGR.map(item => item['MNGR_ID']);

      let oParam = {QA_PLAN_ID : this.SELECTED_QA_PLAN.QA_PLAN_ID, MNGR_LIST : oDelList.join(',') };

      let sUrl = '/api/qa/mngrmng/remove';
      let postParam = oParam;
      let headParam = {
      };
      let resData = await this.common_postCall(sUrl, postParam, headParam);
      if (resData.HEADER.ERROR_FLAG) {

        if(resData.HEADER.ERROR_MSG == "ALTMNT_MNGR_EXIST") {
          this.showAlert(this.MESSAGE.ALERT.ALTMNT_MNGR_EXIST);
        }
      } else {
        this.getMngrList();
        this.SELECTED_MNGR = [];
      }
    },
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
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },
  },
}
</script>

<style lang="scss" scoped>

</style>