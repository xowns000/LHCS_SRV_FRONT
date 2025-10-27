<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                조회기간
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
<!--                <div class="pl-calendar-range-form">-->
<!--                  <compo-date-picker-->
<!--                    DateType="dateInput"-->
<!--                    :DateProp.sync="startDate"/>-->
<!--                  <span class="pl-unit">~</span>-->
<!--                  <compo-date-picker-->
<!--                    DateType="dateInput"-->
<!--                    :DateProp.sync="endDate"/>-->
<!--                  <compo-drop-picker-->
<!--                    :StartDateProp.sync="startDate"-->
<!--                    :EndDateProp.sync="endDate"-->
<!--                  />-->
<!--                </div>-->
                <compo-date-range-picker
                    :StartDayProp.sync="startDate"
                    :EndDayProp.sync="endDate"
                    @startDayChange="mixin_testLog(startDate)"
                    @endDayChange="mixin_testLog(endDate)"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                콘텐츠 상태
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  v-model="STTS_CD"
                  :items="dropItems"
                  @change="getContsList"
                  placeholder="선택하세요"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">지식 구분</span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  v-model="SE_CD"
                  :items="contsSeCdDropItems"
                  placeholder="선택하세요"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">검토 요청자</span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  placeholder="검색어 입력"
                  v-model="RVRQ_USER_NM"
                  @keyup.enter="getContsList"
                ></v-text-field>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">지식 콘텐츠</span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form is-lg"
                  placeholder="검색어 입력"
                  v-model="KMS_CONTS_NM"
                  @keyup.enter="getContsList"
                ></v-text-field>
              </div>
            </div>
            <v-btn class="pl-btn is-icon" @click=" getContsList ">
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
            <v-btn class="pl-btn is-icon is-sub" @click="detailView">
              <span class="pl-icon20 document"></span>
              선택항목 상세
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub" 
              :disabled=" STTS_CD !== 'RVRQ' "
              @click="sttsUpdate('APPR')">
              <span class="pl-icon20 select-accept"></span>
              승인
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub" 
              :disabled=" STTS_CD !== 'RVRQ' "
              @click="openRfsl">
              <span class="pl-icon20 reject"></span>
              반려
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub" 
              :disabled=" STTS_CD !== 'APPR' "
              @click="sttsUpdate('RVRQ')">
              <span class="pl-icon20 retrieve"></span>
              회수
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ listItem.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
              TypeProp="Download"
              :DataHeaderProp="headers"
              :DataBodyProp="listItem"
              :FileNameProp="'지식 콘텐츠 승인 관리_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
              SheetNameProp="지식 콘텐츠 승인 관리"
              HeaderColorProp="00B0F0"
            ></compo-excel>
          </div>
        </div>
        <v-data-table
          class="pl-grid has-control"
          v-model="CHK_ITEMS"
          :headers="headers"
          :items="listItem"
          :item-class="isActiveRow"
          show-select
          fixed-header
          item-key="KMS_CONTS_ID"
          height="562px"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
          :page.sync="page"
          @click:row="rowSelect"
          @dblclick:row="contsDbClick"
          no-data-text="데이터가 없습니다."
          @page-count="pageCount = $event">
          <template v-slot:item.STTS_NM="{ item }">
            <span :class="`pl-round-chip is-sm chat-stat-${item.STTS_CD_CLASS}`">
              {{ item.STTS_NM }}
            </span>
          </template>
          <template v-slot:item.STTS_CD="{ item }">
            <compo-tooltip-btn TitleProp="요청 의견 보기" ClassProp="pl-tooltip-btn" IconProp="pl-icon20 document"
              TooltipPositionProp="bottom" @btnClick="openContsReviewHistory(item)"></compo-tooltip-btn>
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

          <span class="pl-pager-period">
            보기 {{ mixin_getPagePeriod(listItem, page) }} / {{ listItem.length }}
            <compo-tooltip-btn
                TitleProp="다음 검색"
                ClassProp="pl-tooltip-btn is-line"
                IconProp="pl-icon20 arrow-next-paging"
                TooltipPositionProp="bottom"
                :DisabledProp = "nextDisabled"
                @btnClick="getContsList('next')"
            ></compo-tooltip-btn>
          </span>
        </div>
      </div>
    </div>
    <!-- dialog -->
    <v-dialog
      v-model="dialogReject"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="반려"
        @hide="mixin_hideDialog('Reject')"
        @submit="submitDialog('Reject')"
      >
        <template slot="body">
          <v-form ref="rejectForm">
            <ul class="pl-list-dot is-no-border mt-0">
              <li>검토 요청자에게 알릴 반려사유를 입력하십시오.</li>
              <li>반려 처리하시려면 <strong>[반려하기] 버튼을 클릭</strong>하십시오.</li>
            </ul>
            <div class="is-mt-m">
              <v-textarea
                class="pl-form is-noresize"
                placeholder="반려사유 및 기타 의견 입력"
                v-model="STTS.CN"
                :rules="rejectValidateRules.CN"
                :spellcheck="false"
              />
            </div>
          </v-form>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('Reject')">취소</v-btn>
          <v-btn class="pl-btn" @click="procRfsl">반려</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- 검토 이력 (검토요청, 반려) -->
    <v-dialog v-if="dialogReview" v-model="dialogReview" content-class="dialog-draggable" hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog header-title="요청 의견" @hide="mixin_hideDialog('Review')">
        <template slot="body">
            <KMS_M0301_DLG_REVIEW ref="dlgRvwHstry"
              v-model="REVIEW_KMS_CONTS_ID"
            >
            </KMS_M0301_DLG_REVIEW>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('Review')">닫기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- 상세보기 -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer" v-if=" CONTS_DETAIL.active === true" >
        <div class="pl-quick-layer-header">
          <h1>지식 콘텐츠 상세보기</h1>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="closeModal"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body">
          <div class="pl-right-kms-detail">
            <RIGHT_KMS_DETAIL_COMPO 
              ref="detailCompo0400"
              :HEAD_VIEW="DETAIL_HEAD_VIEW"
              :DETAIL_STYLE="'height:720px;'"
              :PUBLIC_YN="'N'"
              v-model="CONTS_DETAIL">
            </RIGHT_KMS_DETAIL_COMPO>
          </div>
        </div>
      </div>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
  import RIGHT_KMS_DETAIL_COMPO from './right_kms_detail_compo.vue';
  import KMS_M0301_DLG_REVIEW from './KMS_M0301_DLG_REVIEW.vue';
  

  export default {
  name:"MENU_KMS_M0400", //name은 'MENU_' + 파일명 조합
  components: {
    RIGHT_KMS_DETAIL_COMPO
    , KMS_M0301_DLG_REVIEW
  },
  data() {
    return {
      // top search
      nowDate : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      startDate: this.$moment(this.endDate).subtract(7,'days').format('YYYY-MM-DD'),
      endDate: this.nowDate,
      // (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dropItems: [],  //검색 조건 - 콘텐츠 상태
      contsSeCdDropItems: [],   //검색 조건 - 지식 구분

      STTS_CD : "RVRQ" ,      // 컨텐츠 상태  // Default : 검토요청(RVRQ)
      SE_CD : "" ,      // 지식 구분
      RVRQ_USER_NM : "",  // 검토 요청자
      KMS_CONTS_NM : "",  // 지식 컨텐츠
      REVIEW_KMS_CONTS_ID : "", //검토 이력 다이얼로그 지식 콘텐츠 ID

      // 지식스크립트 상세
      CONTS_DETAIL: {
        active: false,
        favorite: false,
        KMS_CONTS_ID : "",
        KMS_CONTS_NM : "",
        MDFCN_DT_F : "",
        CLSF_PATH : "",
      },

      // dialog
      dialogReject: false,
      dialogReview: false,
      DETAIL_HEAD_VIEW : "N",

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,

      nextDisabled : false,

      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      },

      headers: [
        { text: '번호', value: 'ROWNUM', align: 'center', width: '80px', sortable: false},
        { text: '지식 ID', value: 'KMS_CONTS_ID', align: 'center', width: '90px', sortable: false },
        { text: '지식 구분', value: 'SE_NM', align: 'center', width: '130px', sortable: false },
        { text: '지식 콘텐츠', value: 'KMS_CONTS_NM', sortable: false},
        { text: '지식 분류', value: 'FULL_PATH', width: '450px', align: 'left', sortable: false },
        { text: '검토 요청자', value: 'RVRQ_USER_NM', align: 'left', width: '100px', sortable: false },
        { text: '검토 요청일', value: 'RVRQ_DT', align: 'left', width: '100px', sortable: false },
        { text: '콘텐츠 상태', value: 'STTS_NM', align: 'center', width: '120px', },
        { text: '요청 의견', value: 'STTS_CD', align: 'center', width: '90px', sortable: false },
        { text: '처리일', value: 'APPR_DT', align: 'left', width: '120px' , sortable: false},
        { text: '처리자', value: 'APPR_USER_NM', align: 'left', width: '120px' , sortable: false},
      ],
      listItem: [],
      CHK_ITEMS : [],
      selectedRow : null,

      STTS : {
        KMS_CONTS_ID : []
        , STTS_CD : ""
        , CN : ""
        , HIST_YN : "Y"
      },

      valid : true,
      rejectValidateRules: {
        CN : [
          v => !!v || '반려 사유는 필수 입력 항목 입니다.',
        ],
      },

      // excel 변수
      table_body:{},
      table_head:{},
      file_name : "지식콘텐츠_승인관리_목록_" + this.$moment(new Date()).format("YYYY/MM/DD hh:mm:ss"),
      sheet_name : "지식 콘텐츠 승인 관리",
      header_color : "4C5CBB",

      //confirm alert 메시지
      MESSAGE : {
        CONFIRM : {
          REG : {alertDialogToggle: true, msg: '내용을 저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.saveConts, callNo: this.closeMsg}
          , CHG_APPR : {alertDialogToggle: true, msg: '승인 처리 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.procUdtSttsCd, callNo: this.closeMsg}
          , CHG_RFSL : {alertDialogToggle: true, msg: '반려 처리 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.procUdtSttsCd, callNo: this.closeMsg}
          , CHG_RVRQ : {alertDialogToggle: true, msg: '회수 처리 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.procUdtSttsCd, callNo: this.closeMsg}
        },
        ALERT : {
          CHECK_NON : {alertDialogToggle: true, msg: '체크된 항목이 존재하지 않습니다.', iconClass: 'is-caution', type: 'default'}
          , NON_EXCEL_DATA : {alertDialogToggle: true, msg: '다운로드 할 내용이 존재하지 않습니다.', iconClass: 'is-caution', type: 'default'}
          , DEN_APPR_STTS : {alertDialogToggle: true, msg: '검토요청중인 컨텐츠만<br/>승인처리가 가능합니다.', iconClass: 'is-caution', type: 'default'}
          , DEN_RFSL_STTS : {alertDialogToggle: true, msg: '검토요청중인 컨텐츠만<br/>반려처리가 가능합니다.', iconClass: 'is-caution', type: 'default'}
          , DEN_RVRQ_STTS : {alertDialogToggle: true, msg: '승인된 컨텐츠만<br/>회수 처리가 가능합니다.', iconClass: 'is-caution', type: 'default'}
          , ONE_SELECT_CONTS : {alertDialogToggle: true, msg: '하나의 콘텐츠만 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST : {
          SUCCESS : {msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 3000}
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
    let codeName = ['CONT_ST', 'KMS_CL'];
    this.common_code = await this.mixin_common_code_get_all(codeName);
    //콘텐츠 상태 콤보
    this.dropItems = this.mixin_common_code_get(this.common_code, 'CONT_ST'); //확장구분 콤보
    //지식 구분 콤보
    this.contsSeCdDropItems = this.mixin_common_code_get(this.common_code, 'KMS_CL', '전체'); //확장구분 콤보

    this.getContsList();
  },

  mounted() {

    this.startDate = this.$moment(this.nowDate).subtract(7,'days').format('YYYY-MM-DD'); // 통화 시작 일자(일주일전)
    this.endDate = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);

  },

  methods: {
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    // 목록 조회
    async getContsList(next){

      this.CHK_ITEMS = [];
      this.selectedRow = null;
      // this.page = 1;

      if (next !== 'next'){
        this.listItem = [];
        // this.page = 1;              //페이징 처리 초기화
        this.pagination.page = 1;
        this.nextDisabled = true;   //버튼 비활성화
      }
      let sUrl = '/api/km/conts/kmContsApprManageList';

      let headParam = {
        head: {
          "ROW_CNT" : this.pagination.rowsPerPage,
          "PAGES_CNT" : this.pagination.page,
          "PAGING" : "Y",
        }
      }

      let postParam = {
            STTS_CD : this.STTS_CD
            , SE_CD : this.SE_CD
            , ST_DATE : this.startDate
            , ED_DATE : this.endDate
            , RVRQ_USER_NM : this.RVRQ_USER_NM
            , KMS_CONTS_NM : this.KMS_CONTS_NM
          }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        let tempDataText = response.DATA;
        this.listItem = [...this.listItem, ...tempDataText];

        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 resData.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }

        this.pagination.page += 1;

      }
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    // 상세보기
    detailView() {
      let chkItems = this.CHK_ITEMS;
      if( chkItems.length < 1 ) {
        this.showAlert(this.MESSAGE.ALERT.CHECK_NON);
        return;
      } else if( chkItems.length > 1 ) {
        this.showAlert(this.MESSAGE.ALERT.ONE_SELECT_CONTS);
        return;
      }

      this.CONTS_DETAIL.KMS_CONTS_ID = chkItems[0].KMS_CONTS_ID;
      this.CONTS_DETAIL.KMS_CONTS_NM = chkItems[0].KMS_CONTS_NM;
      if( this.CONTS_DETAIL.active ) {  // 상세창이 열려있는경우 Data만 다시 Load
        this.$refs.detailCompo0400.initContentInfoData(this.CONTS_DETAIL);
      } else {
        this.CONTS_DETAIL.active = true;  // 닫혀있으면 Open
      }
    },

    // Row Click
    rowSelect( item ){
      this.selectedRow = item;
      
    },
    // Row DBClick
    contsDbClick(){
      if( this.selectedRow ) {
        this.CHK_ITEMS = [];
        this.CHK_ITEMS[0] = this.selectedRow;
        this.detailView();
      }
    },

    // 반려
    openRfsl(){

      let chkItems = this.CHK_ITEMS;
      if( chkItems.length < 1 ) {
        this.showAlert(this.MESSAGE.ALERT.CHECK_NON);
        return;
      } else if( chkItems.length > 1 ) {
        this.showAlert(this.MESSAGE.ALERT.ONE_SELECT_CONTS);
        return;
      }

      this.STTS.KMS_CONTS_ID = [];
      for( var i = 0 ; i < chkItems.length ; i++ ) {
        if( "RVRQ" !== chkItems[0].STTS_CD ){
          this.showAlert(this.MESSAGE.ALERT.DEN_RFSL_STTS);
          return;
        }
        this.STTS.KMS_CONTS_ID.push({"KMS_CONTS_ID": chkItems[i].KMS_CONTS_ID});
      }
      this.STTS.HIST_YN = "Y";
      this.STTS.CN = "";
      this.mixin_showDialog('Reject')
    },

    // 반려 처리
    procRfsl(){
      this.STTS.STTS_CD = "RFSL";

      if (!this.rfslValidate()) {
        return;
      }
      this.showAlert(this.MESSAGE.CONFIRM.CHG_RFSL);
    },

    rfslValidate() {
      return this.$refs.rejectForm.validate();
    },

    // 상태 수정
    sttsUpdate( stts ){
      /**
       * PBIC : 승인          --  검토요청인 컨텐츠만 변경 가능
       * APPR : 반려          --  검토요청인 컨텐츠만 변경 가능(함수 따로 사용.?)
       * DELT : 회수          --  승인 또는 반려만 변경 가능
       */
      let $this = this;
      let chkItems = $this.CHK_ITEMS;
      if( chkItems.length < 1 ) {
        this.showAlert(this.MESSAGE.ALERT.CHECK_NON);
        return;
      }

      this.STTS.KMS_CONTS_ID = [];
      let arrStts = [];
      for( var i = 0 ; i < chkItems.length ; i++ ) {
        arrStts.push(chkItems[i].STTS_CD);
        this.STTS.KMS_CONTS_ID.push({ "KMS_CONTS_ID" : chkItems[i].KMS_CONTS_ID});
      }

      var tmpMsg = "";
      var isPass = true;

      switch( stts ) {
        case "APPR" : 
          arrStts.forEach(function( val ){
            if( val !== "RVRQ" ){ 
              isPass = false; 
              tmpMsg = $this.MESSAGE.ALERT.DEN_APPR_STTS;
            }
          });
          break;
        case "RVRQ" : 
          arrStts.forEach(function( val ){
            if( val !== "APPR" ){ 
              isPass = false; 
              tmpMsg = $this.MESSAGE.ALERT.DEN_RVRQ_STTS;
            }
          });
          break;
        default : break;
      }

      if( !isPass ) {
        this.showAlert(tmpMsg);
        return;
      }

      this.STTS.STTS_CD = stts;
      this.STTS.CN = "";

      if( "APPR" === stts ) {
        this.showAlert($this.MESSAGE.CONFIRM.CHG_APPR);
      } else {
        this.showAlert($this.MESSAGE.CONFIRM.CHG_RVRQ);
      }

    },

    // 상태 수정 처리
    async procUdtSttsCd(){
      this.closeMsg()
      this.mixin_hideDialog('Reject');
      let sUrl = '/api/km/conts/contsProcStts';
      let postParam = this.STTS;

      let headParam = {
        head : {}
      };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.getContsList();
      }
    },

    closeModal() {
      this.CONTS_DETAIL.active = false;
    },

    // 검토 이력 다이얼로그 오픈
    async openContsReviewHistory(item) {
      this.REVIEW_KMS_CONTS_ID = item.KMS_CONTS_ID
      this.mixin_showDialog('Review')
    }


  },

}
</script>

<style lang="scss" scoped>

</style>