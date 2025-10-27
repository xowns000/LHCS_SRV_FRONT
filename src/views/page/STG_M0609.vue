<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body">
        <div class="pl-grid-top">
          <div class="pl-grid-top-left">
            <v-btn
                class="pl-btn is-icon is-sub"
                @click="gridDblClick"
                :disabled="selectedRow.ROW_NUMBER != undefined ? false:true"
            >
              <span class="pl-icon20 document"></span>
              선택항목 상세
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub" @click="regBtn">
              <span class="pl-icon20 circle-plus"></span>
              등록
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub"
                   @click="flywayBtn"
                   :disabled="selectedData.length != 0 ? false:true"
            >
              <span class="pl-icon20 circle-plus"></span>
              Flyway 업데이트
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ gridItems.length }})</em> 건</span>
          </div>
        </div>
        <v-data-table
          class="pl-grid has-control"
          show-select
          :headers="gridDataHeaders"
          :items="gridItems"
          fixed-header
          item-key="ROW_NUMBER"
          height="562px"
          :items-per-page="ROW_PER_PAGE"
          :item-class="isActiveRow"
          hide-default-footer
          :page.sync="page"
          @page-count="pageCount = $event"
          @click:row="gridRowselected"
          @dblclick:row="gridDblClick"
          v-model="selectedData"
          no-data-text="등록된 데이터가 없습니다."
        >
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

          <span class="pl-pager-period">
            보기 {{ mixin_getPagePeriod(gridItems, page) }} / {{ gridItems.length }}
            <compo-tooltip-btn
                TitleProp="다음 검색"
                ClassProp="pl-tooltip-btn is-line"
                IconProp="pl-icon20 arrow-next-paging"
                TooltipPositionProp="bottom"
                @btnClick="search('next')"
                :DisabledProp="nextDisabled"
            ></compo-tooltip-btn>
          </span>
        </div>
      </div>
    </div>

    <!-- dialog -->
    <v-dialog
      v-model="dialogCertCustco"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :headerTitle='HEADER_TITLE'
        @hide="mixin_hideDialog('CertCustco')"
      >
        <template slot="body">
          <v-form ref="form">
            <div class="pl-form-inline-wrap vertical mt-2">
              <div class="pl-form-inline">
                <span class="pl-label">
                  고객사 명
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    v-model="digParams.CUSTCO_NM"
                    :rules="validateRules.CUSTCO_NM"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  ASP 고객 키
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    v-model="digParams.ASP_CUST_KEY"
                    @change="dpcn.ASP_CUST_KEY_CHECK = false"
                    :rules="validateRules.ASP_CUST_KEY"
                    :disabled="!flagData.REG_CHECK"
                  />
                  <v-btn class="pl-btn is-sub flex-grow-0"
                  @click="dpcnChkAspCustKey"
                  :disabled="!this.flagData.REG_CHECK"
                  >중복체크</v-btn>
                </div>
              </div>
              
              <div class="pl-form-inline">
                <span class="pl-label">
                  로그인 ID
                  <v-icon class="pl-icon20 required"></v-icon>
                  <compo-tooltip-btn
                    TitleProp="고객사 DB에 생성되는 로그인 ID입니다."
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 question"
                    TooltipPositionProp="bottom"
                  ></compo-tooltip-btn>
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    v-model="digParams.LGN_ID"
                    @change="dpcn.LGN_ID_CHECK = false"
                    :rules="validateRules.LGN_ID"
                    :disabled="!flagData.REG_CHECK"
                  />
                  <v-btn class="pl-btn is-sub flex-grow-0"
                  @click="dpcnChkLgnId"
                  :disabled="!this.flagData.REG_CHECK"
                  >중복체크</v-btn>
                </div>
              </div>
            </div>
          </v-form>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="[mixin_hideDialog('CertCustco'), initSelect()]">닫기</v-btn>
          <v-btn class="pl-btn" @click="saveBtn">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
name:"MENU_BBS_M0200", //name은 'MENU_' + 파일명 조합
components: {
},
data() {
  return {

    validateRules: {
        CUSTCO_NM: [
          v => !!v || '고객사 명 은(는) 필수 입력 항목 입니다.',
        ],
        ASP_CUST_KEY: [
          v => !!v || 'ASP 고객 키는 필수 입력 항목 입니다.',
          v => (v || '').indexOf(' ') < 0 ||'ASP 고객 키는 공백을 허용하지 않습니다.',
          v => /^[a-zA-Z0-9]+$/.test(v) || 'ASP 고객 키는 영문과 숫자만 입력 가능합니다.',
        ],
        LGN_ID: [
          v => !!v|| '로그인 ID은(는) 필수 입력 항목입니다.',
          v => (v && v.length <=60) || '로그인 ID는 60자를 넘을 수 없습니다.',
          v => (v || '').indexOf(' ') < 0 ||'로그인 ID는 공백을 허용하지 않습니다.',
          v => /^[a-zA-Z0-9]+$/.test(v) || '로그인 ID는 영문과 숫자만 입력 가능합니다.',
        ],
      },


    // dialog
    HEADER_TITLE: '',
    dialogCertCustco: false,



    // digparams (상세조회 data)
    digParams:{
      CERT_CUSTCO_ID: '', //인증 고객사 ID
      CUSTCO_NM: '',      //고객사 명
      ASP_CUST_KEY: '',   //ASP 고객 키
      LGN_ID: '',         //로그인 ID
    },

    // flag
    flagData: {
      REG_CHECK: '',      //등록/수정 여부(등록: true, 수정 : false)
      ATRT_CHECK: '',     //권한(authrt) 체크
      DBL_CHECK: '',      //더블클릭 여부
    },

    //중복체크 값 
    dpcn: {
      LGN_ID_CHECK: false,        //로그인 ID 중복체크 여부
      ASP_CUST_KEY_CHECK: false,  //ASP 고객 키 중복체크 여부
    },

    // grid
    page: 1,
    pageCount: 0,
    perPage: [15,30,50,100],
    ROW_PER_PAGE: 15,
    selectedData: [],      // 그리드 체크박스 값
    pagination:{
      page:1,
      rowsPerPage: 500
    },
    nextDisabled: false,
    gridItems: [],
    selectedRow: {},
    common_code: [],
    gridDataHeaders: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px' },
        { text: '인증 고객사 ID', value: 'CERT_CUSTCO_ID', align: 'center', width: '150px'},
        { text: '고객사 명', value: 'CUSTCO_NM'},
        { text: 'ASP 고객 키', value: 'ASP_CUST_KEY', align: 'center', width: '150px' },
    ],

    // confirm alert 메시지
    MESSAGE : {
      CONFIRM : {
        REG : {alertDialogToggle: true, msg: '저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.certCustcoSave, callNo: this.closeMsg}
        , MOD : {alertDialogToggle: true, msg: '수정 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.certCustcoSave, callNo: this.closeMsg}
        , DEL : {alertDialogToggle: true, msg: '삭제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.brdDel, callNo: this.closeMsg}
      },
      ALERT : {
        REG_SUCCESS : {alertDialogToggle: true, msg: '저장 되었습니다.', iconClass: 'is-info', type: 'default'}
        , ALREADY_EXIST : {alertDialogToggle : true, msg:'이미 사용중입니다.',iconClass: 'is-caution', type:'default'}
        , USE_PSBLTY : {alertDialogToggle : true, msg:'사용 가능합니다.',iconClass: 'is-done', type:'default'}
        , INVALID_LGN_ID : {alertDialogToggle : true, msg:'로그인 ID 중복체크를 해주세요.',iconClass: 'is-info', type:'default'}
        , INVALID_ASP_CUST_KEY : {alertDialogToggle : true, msg:'ASP 고객 키 중복체크를 해주세요.',iconClass: 'is-info', type:'default'}
        , FLYWAY_SUCCESS : {alertDialogToggle: true, msg: 'Flyway가 정상 실행되었습니다.', iconClass: 'is-info', type: 'default'}
        , DEL_SUCCESS : {alertDialogToggle: true, msg: '삭제 되었습니다.', iconClass: 'is-info', type: 'default'}
        , CHECK_OVER : {alertDialogToggle: true, msg: '하나의 항목만 선택하십시오.', iconClass: 'is-caution', type: 'default'} 
        , CHECK_NON : {alertDialogToggle: true, msg: '항목을 선택하십시오.', iconClass: 'is-caution', type: 'default'}
        , CHECK_NON_D : {alertDialogToggle: true, msg: '삭제할 항목을 선택하십시오.', iconClass: 'is-caution', type: 'default'}
        , CHECK_ATRT : {alertDialogToggle: true, msg: '관리자 외 인증 고객사 등록이 불가능합니다. ', iconClass: 'is-caution', type: 'default'}
        , ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
      }
    },
    
  }
},

  watch: {
    
  },

  computed: {
    ...mapGetters({
      user_role: "userStore/GE_USER_ROLE", // 사용자ROLE
      stoUserId: 'userStore/GE_USER_ID',
      stoUserComp: 'userStore/GE_USER_COMPANY',
      stoCntnIp: 'userStore/GE_USER_IP_ADDR',
      
    }),
  },

  async created() {
    // console.log("=======created==========")
  },

  mounted() {
    this.getGridList();
  },
  
  methods: {

    // dialog 초기화
    ufnInit(){
      this.digParams = {
        CERT_CUSTCO_ID: '',
        CUSTCO_NM: '',
        ASP_CUST_KEY: '',
        LGN_ID: '',
      }
    },


    // 팝업창 오픈 시 유형 체크
    checkFlag(flag) {
      this.dpcn.LGN_ID_CHECK = false;
      this.dpcn.ASP_CUST_KEY_CHECK = false;
      switch (flag) {
        case 'new':
          this.flagData.REG_CHECK = true;
          this.HEADER_TITLE = "새 인증 고객사 등록";
          break;

        case 'modify':
        this.flagData.DBL_CHECK = false;
          this.flagData.REG_CHECK = false;
          this.HEADER_TITLE = "수정";
          break;

        case 'dblClick':
          this.flagData.DBL_CHECK = true;
          this.flagData.REG_CHECK = false;
          this.HEADER_TITLE = "수정";
          break;

        default:
          break;
      }
    },

    // 등록 버튼
    regBtn(){
      
      // 권한 체크
      this.atrt();
      if (!this.flagData.ATRT_CHECK){
        return;
      }

      // dialog 초기화
      this.ufnInit();
      // 등록flag
      this.checkFlag("new");
      
      this.mixin_showDialog('CertCustco');
      this.$refs.form.resetValidation();
    },

    // 저장 버튼 click
    saveBtn(){
      if (!this.detailValidate()) {
        const isValidAspCustKey = this.openValidationMessage(this.validateRules.ASP_CUST_KEY, this.digParams.ASP_CUST_KEY);
        if(isValidAspCustKey === true) {
          this.openValidationMessage(this.validateRules.LGN_ID, this.digParams.LGN_ID);
        }
        return;
      }

      if(this.flagData.REG_CHECK) {
        //등록 화면일 시,

        // ASP 고객 키 중복체크
        if(this.dpcn.ASP_CUST_KEY_CHECK != true) {
          this.showAlert(this.MESSAGE.ALERT.INVALID_ASP_CUST_KEY);
          return;
        }

        // 로그인 ID(LGN_ID) 중복체크
        if(this.dpcn.LGN_ID_CHECK != true) {
          this.showAlert(this.MESSAGE.ALERT.INVALID_LGN_ID);
          return;
        }
        this.showAlert(this.MESSAGE.CONFIRM.REG);
      } else {
        //수정 화면일 시,
        this.showAlert(this.MESSAGE.CONFIRM.MOD);
      }
    },

    //validate check
    detailValidate () {
      return this.$refs.form.validate();
    },

    //ASP 고객 키 중복 체크
    async dpcnChkAspCustKey() {
      let sURL = '/admin-api/custco/cert-custco-manage/dpcn-chk/aspCustKey';
      let postParam = {
        ASP_CUST_KEY : this.digParams.ASP_CUST_KEY,
      }
      let headParam ={
      }
      // console.log("postParam", postParam)

      // 입력폼의 로그인 ID validation 체크
      const isAspCustKeyValid = this.validateRules.ASP_CUST_KEY.every(rule => rule(this.digParams.ASP_CUST_KEY) === true);   

      // 로그인 ID의 validation을 체크한 다음 api호출
      if (isAspCustKeyValid) {
          let resData = await this.common_postCall(sURL,postParam,headParam)
          if(resData.HEADER.ERROR_FLAG){
            this.dpcn.ASP_CUST_KEY_CHECK = false;
            this.showAlert(this.MESSAGE.ALERT.ALREADY_EXIST);
          }else{
            this.dpcn.ASP_CUST_KEY_CHECK = true;
            this.showAlert(this.MESSAGE.ALERT.USE_PSBLTY);
          }
      } else {
        this.openValidationMessage(this.validateRules.ASP_CUST_KEY, this.digParams.ASP_CUST_KEY)
      }
    },
    
    // 로그인 ID 중복 체크
    async dpcnChkLgnId() {
      let sURL = '/admin-api/custco/cert-custco-manage/dpcn-chk/lgnId';
      let postParam = {
        LGN_ID : this.digParams.LGN_ID,
      }
      let headParam ={
      }

      // 입력폼의 로그인 ID validation 체크
      const isLgnIdValid = this.validateRules.LGN_ID.every(rule => rule(this.digParams.LGN_ID) === true);   

      // 로그인 ID의 validation을 체크한 다음 api호출
      if (isLgnIdValid) {
          let resData = await this.common_postCall(sURL,postParam,headParam)
          if(resData.HEADER.ERROR_FLAG){
            this.dpcn.LGN_ID_CHECK = false;
            this.showAlert(this.MESSAGE.ALERT.ALREADY_EXIST);
          }else{
            this.dpcn.LGN_ID_CHECK = true;
            this.showAlert(this.MESSAGE.ALERT.USE_PSBLTY);
          }
      } else {
        this.openValidationMessage(this.validateRules.LGN_ID, this.digParams.LGN_ID)
      }
    },
    

    //*************************************
    //        인증고객사 신규 등록 및 수정
    //*************************************
    async certCustcoSave() {
      const URLData = this.flagData.REG_CHECK ? '/admin-api/custco/cert-custco-manage/regist' : '/admin-api/custco/cert-custco-manage/modify';
      let postParam = {
        CERT_CUSTCO_ID : this.flagData.REG_CHECK ? '' : this.digParams.CERT_CUSTCO_ID // 인증 고객사 ID - 없으면 신규 등록, 있으면 수정
        , CUSTCO_NM: this.digParams.CUSTCO_NM
        , ASP_CUST_KEY: this.flagData.REG_CHECK ? this.digParams.ASP_CUST_KEY : ''    // 등록시에만 
        , LGN_ID: this.flagData.REG_CHECK ? this.digParams.LGN_ID : ''                // 등록시에만 
        , RGTR_ID: this.stoUserId                                                     // 등록자_ID
      }

      let headParam = {
        head : {}
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS);
        setTimeout(() => {
          this.$store.commit("alertStore/hideAlert");
        }, 2000);
        this.flagData.FILE_CHECK = false;
        this.selectedData = [];
        this.getGridList();
        this.mixin_hideDialog('CertCustco');
      }
    },

    //*************************************
    //        Flyway 업데이트
    //*************************************
    async flywayBtn(){
      let URLData = '/admin-api/custco/cert-custco-manage/migrationFlyway';
      let postParam = {
      }

      let headParam = {
        head : {
          PAGING: 'Y',
          ROW_CNT: 5000,
          PAGES_CNT: 1
        }
      }

      let response = await this.common_postCall(URLData, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.showAlert(this.MESSAGE.ALERT.FLYWAY_SUCCESS);
      }
    },


    //*************************************
    //        그리드 목록 조회
    //*************************************
    async getGridList(next) {

      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.gridItems = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let URLData = '/admin-api/custco/cert-custco-manage/list';
      let postParam = {
        
      }

      let headParam = {
        head : {
          PAGING: 'Y',
          ROW_CNT: this.pagination.rowsPerPage,
          PAGES_CNT: this.pagination.page
        }
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.gridItems = [ ...this.gridItems , ...response.DATA];

        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }

        //이부분은 체크해볼것
        this.pagination.page += 1 
        // this.page=1;
      }
    },

    //*************************************
    //        선택항목 상세
    //*************************************
    detailBtn(){
      // 수정flag
      this.checkFlag("modify");

      // 선택 row 개수 확인
      if(this.mixin_isEmpty(this.selectedData)){
        this.showAlert(this.MESSAGE.ALERT.CHECK_NON);
        return;
      }else if(this.selectedData.length > 1){
        this.showAlert(this.MESSAGE.ALERT.CHECK_OVER);
        return;
      };

      // 데이터 바인딩
      this.setDetailBinding(this.selectedData[0])

      // 팝업 호출
      this.mixin_showDialog('CertCustco');
    },
    

    // 등록/삭제 권한 체크(시스템관리자)
    atrt(){
      if(this.user_role.atrtGroupId != (1) || this.mixin_isEmpty(this.user_role.atrtGroupId)){
        this.showAlert(this.MESSAGE.ALERT.CHECK_ATRT);
        this.flagData.ATRT_CHECK = false;
      }else{
        this.flagData.ATRT_CHECK = true;
      };
    },

    //row 선택
    gridRowselected(rowItem) {
      this.selectedRow = rowItem;
      // console.log(":selectedRow",this.selectedRow)
      this.setDetailBinding(rowItem);
    },

    //row 선택 활성화
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    // 데이터 바인딩 - 더블클릭시 데이터 바인딩되어 팝업창 호출
    setDetailBinding(item) {
      this.digParams.CERT_CUSTCO_ID = item.CERT_CUSTCO_ID;
      this.digParams.CUSTCO_NM = item.CUSTCO_NM;
      this.digParams.ASP_CUST_KEY = item.ASP_CUST_KEY;
      this.digParams.LGN_ID = item.LGN_ID;
    },
    
    // row 더블클릭하여 상세팝업 오픈
    gridDblClick(){
      // 수정flag
      this.checkFlag("dblClick");

      // 팝업 호출
      this.mixin_showDialog('CertCustco');
    },

    // 다음 버튼 페이징
    async search(next){
      if (next == 'next'){
      } else {
        this.items = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }
      this.getGridList('next');
    },

    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    //등록 및 상세보기 form 초기화
    resetValidation() {
      this.$refs.form.reset();
    },

    //validateRules의 rule 항목과 값을 받아 해당 항목의 rule이 true가 아닐 시 해당 메세지를 출력한다.
    //Rule을 순서대로 읽어와 먼저 rule을 위반하는 메세지를 showAlert으로 출력한다.
    //필수값 체크 메세지는 출력하지 않는다.(index:0)
    openValidationMessage(validateRulesItem, ruleValue) {
      try {
        validateRulesItem.map(
          (rule, index) => {
            const validValue = rule(ruleValue);
            if(validValue !== true) {
              //여러 rule 중 하나만 출력하기 위해 throw로 map 벗어남.
              if(index == 0) {
                //필수값 메세지는 출력하지 않는다.(index:0)
                throw {isShow:false, message:validValue};
              } else {
                throw {isShow:true, message:validValue};
              }
            }
          }
        )
      } catch(e) {
        if(e.isShow) {
          this.showAlert({alertDialogToggle: true, msg: e.message, iconClass: 'is-caution', type: 'default'});
          return false;
        }
      }
      return true;
    },

    initSelect() {
      this.selectedRow = {};
    },


  },
}
</script>
<style lang="scss" scoped></style>