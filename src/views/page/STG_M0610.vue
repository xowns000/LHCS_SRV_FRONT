<template>
  <div class="pl-container">
   <div class="pl-card-wrap">
     <!-- sub top -->
     <compo-sub-layout-top  >
       <template slot="search">
         <div class="pl-form-inline-wrap">
           <div class="pl-form-inline">
             <span class="pl-label">
               조회 기간
             </span>
             <div class="pl-desc">
<!--               <div class="pl-calendar-range-form">-->
<!--                 <compo-date-picker-->
<!--                  v-model="SCH_ST_DTS"-->
<!--                  DateType="dateInput"-->
<!--                  :DateProp.sync="SCH_ST_DTS"-->
<!--                 />-->
<!--                 <span class="pl-unit">~</span>-->
<!--                 <compo-date-picker-->
<!--                  v-model="SCH_END_DTS"-->
<!--                  DateType="dateInput"-->
<!--                  :DateProp.sync="SCH_END_DTS"-->
<!--                 />-->
<!--                 <compo-drop-picker :StartDateProp.sync="SCH_ST_DTS" :EndDateProp.sync="SCH_END_DTS" />-->
<!--               </div>-->
               <compo-date-range-picker
                   :StartDayProp.sync="SCH_ST_DTS"
                   :EndDayProp.sync="SCH_END_DTS"
                   @startDayChange="mixin_testLog(SCH_ST_DTS)"
                   @endDayChange="mixin_testLog(SCH_END_DTS)"
               />
             </div>
           </div>
           <div class="pl-form-inline">
             <span class="pl-label">
               조회 대상
             </span>
             <div class="pl-desc">
               <v-select
                v-model="SCH_INQ_TRGT_CD"
                class="pl-form"
                :items="mixin_common_code_get(this.list_common_code, 'PRVC_INQ_TGRT_TP', '전체')"
                placeholder="선택하세요"
               />
             </div>
           </div>
           <div class="pl-form-inline">
             <span class="pl-label">
               조회 구분
             </span>
             <div class="pl-desc">
               <v-select
                v-model="SCH_INQ_TASK_CD"
                class="pl-form"
                :items="mixin_common_code_get(this.list_common_code, 'PRVC_INQ_TASK_TP', '전체')"
                placeholder="선택하세요"
               />
             </div>
           </div>
           <div class="pl-form-inline">
             <span class="pl-label">
               조회 대상자 명
             </span>
             <div class="pl-desc">
              <v-text-field
               v-model="SCH_TRGT_CUST_NM"
               class="pl-form "
               placeholder="검색어 입력"
               @keyup.enter="schPrvcInqHistList('')"
              />
             </div>
           </div>
           <div class="pl-form-inline">
             <span class="pl-label">
               <v-select
                v-model="SCH_KEY"
                class="pl-form"
                :items="mixin_common_code_get(this.list_common_code, 'PRVC_SCH_TP')"
                placeholder="선택하세요"
               />
             </span>
             <div class="pl-desc">
               <v-text-field
               v-model="SCH_KEYWORD"
               class="pl-form "
               placeholder="검색어 입력"
               @keyup.enter="schPrvcInqHistList('')"
              />
             </div>
           </div>
           <v-btn
            class="pl-btn is-icon"
            @click="schPrvcInqHistList('')"
            >
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
           <v-btn
               class="pl-btn is-icon is-sub"
               @click="getPrvcInqHistChk()"
               :disabled="selectedRow.index != undefined ? false : true"
           >
             <span class="pl-icon20 document"></span>
             선택항목 상세
           </v-btn>
         </div>
         <div class="pl-grid-top-utils">
           <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
           <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
              TypeProp="Download"
              :DataHeaderProp="headers"
              :DataBodyProp="items"
              :FileNameProp="'개인 정보 조회 이력_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
              SheetNameProp="개인 정보 조회 이력"
              HeaderColorProp="00B0F0"
            ></compo-excel>
         </div>
       </div>
       <v-data-table
         class="pl-grid"
         :headers="headers"
         :items="items"
         single-select
         fixed-header
         item-key="ROW_NUMBER"
         height="562px"
         :items-per-page="ROW_PER_PAGE"
         hide-default-footer
         :page.sync="page"
         :item-class="isActiveRow"
         @click:row="rowSelect"
         @dblclick:row="getPrvcInqHistChk"
         @page-count="pageCount = $event"
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
          보기 {{ mixin_getPagePeriod(items, page) }} / {{ items.length }}
            <compo-tooltip-btn
              TitleProp="다음 검색"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 arrow-next-paging"
              TooltipPositionProp="bottom"
              :DisabledProp = "nextDisabled"
              @btnClick="schPrvcInqHistList('next')"
            ></compo-tooltip-btn>
        </span>
       </div>
     </div>
   </div>
   <!-- 개인정보 조회 이력 상세 modal -->
   <v-dialog v-model="dialogSelectedDetail" content-class="dialog-draggable is-lg" hide-overlay>
    <div class="draggable-area">drag area</div>
      <compo-dialog header-title="개인 정보 조회 이력 상세" @hide="mixin_hideDialog('SelectedDetail')">
        <template slot="body">
          <p>개인 정보 조회 이력 상세 정보 입니다.</p>

          <div class="pl-chatting-cs-info is-mt-m pl-cols">
            <div class="pl-chatting-cs-info-cus">
              <div>
                <strong class="pl-chatting-cs-info-tit">조회 대상</strong>
                <span class="pl-chatting-cs-info-desc">{{ selectedRow.INQ_TRGT }}</span>
              </div>
              <div>
                <strong class="pl-chatting-cs-info-tit">조회 구분</strong>
                <span class="pl-chatting-cs-info-desc">{{ selectedRow.TASK_SE_NM }}</span>
              </div>
              <div>
                <strong class="pl-chatting-cs-info-tit">조회 대상자 명</strong>
                <span class="pl-chatting-cs-info-desc">{{ selectedRow.INQ_TRGT_NM }}</span>
              </div>
              <div>
                <strong class="pl-chatting-cs-info-tit">접근 정보</strong>
                <span class="pl-chatting-cs-info-desc">{{ selectedRow.CN }}</span>
              </div>
            </div>
            <div class="pl-chatting-cs-info-cus" style="border-top: 0">
              <div>
                <strong class="pl-chatting-cs-info-tit">접근자 명</strong>
                <span class="pl-chatting-cs-info-desc">{{ selectedRow.RGTR_NM }}</span>
              </div>
              <div>
                <strong class="pl-chatting-cs-info-tit">접근 메뉴 경로</strong>
                <span class="pl-chatting-cs-info-desc">{{ selectedRow.CNTN_MENU_PATH }}</span>
              </div>
              <div>
                <strong class="pl-chatting-cs-info-tit">접근 일시</strong>
                <span class="pl-chatting-cs-info-desc">{{ selectedRow.REG_DT }}</span>
              </div>
              <div>
                <strong class="pl-chatting-cs-info-tit">조회 정보</strong>
                <span class="pl-chatting-cs-info-desc">{{ selectedRow.INQ_INFO_SE }}</span>
              </div>
            </div>
          </div>
        </template>

        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="closeDialog">닫기</v-btn>
        </template>

      </compo-dialog>
    </v-dialog>
 </div>
</template>

<script>
export default {
   name:"MENU_STG_M0610", //name은 'MENU_' + 파일명 조합

components: {

 },
data() {
  return {
    list_common_code : [],
    common_code : [],

    DropCus: {},
    DropUser: {},
    HeadersFindCus: [],
    ItemsFindCus:[],

    searchUsername: '',   //사용자 이름 검색
    searchCusname: '',    //고객 이름 검색

    // top search
    startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    endDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

    // dialog
    dialogSelectedDetail: false,

    selectedRow : {},

    //검색
    SCH_ST_DTS : '', //접근 일시 시작 일자
    SCH_END_DTS : '', //접근 일시 종료 일자
    SCH_INQ_TRGT_CD : '', //조회 대상
    SCH_INQ_TASK_CD : '', //조회 구분
    SCH_TRGT_CUST_NM : '', //조회 대상자 명
    SCH_KEY : 'NM', // 검색 구분
    SCH_KEYWORD : '', //검색어

    // grid
    page: 1,
    pageCount: 0,
    perPage: [15,30,50,100],
    ROW_PER_PAGE: 15,
    pagination: {
      page: 1,
      rowsPerPage: 500,
      sortBy: "REG_DT",
      descending: "DESC"
    }, //그리드 페이지속성정의
    nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
    headers: [
      { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '60px', sortable : false },
      { text: '조회 대상', value: 'INQ_TRGT', align: 'left', width: '140px' ,sortable : false},
      { text: '조회 구분', value: 'TASK_SE_NM', align: 'left', width: '150px',sortable : false },
      { text: '조회 대상자 명', value: 'INQ_TRGT_NM', align: 'left', width: '150px',sortable : false },
      { text: '접근 메뉴 경로', value: 'CNTN_MENU_PATH', align: 'left',sortable : false},
      { text: '접근 정보', value: 'CN', align: 'left',sortable : false},
      { text: '접근 IP', value: 'CNTN_IP', align: 'left', width: '140px',sortable : false },
      { text: '접근자 명', value: 'RGTR_NM', align: 'center', width: '140px' ,sortable : false},
      { text: '접근 일시', value: 'REG_DT', align: 'center', width: '150px' ,sortable : false},
    ],
    items: [],

    PRVC_INQ_LOG_ID : '', //개인정보 조회 로그 ID
    TASK_SE_CD : '', //업무 구분 코드
    TASK_SE_NM : '', //업무 구분 명
    TRGT_CUST_ID : '', //대상 고객 ID
    TRGT_CUST_NM : '', //대상 고객 명
    TRGT_USER_ID : '', //대상 사용자 ID
    TRGT_USER_NM : '', //대상 사용자 명
    CN : '', //접근 정보
    INQ_INFO_SE : '', //조회 정보 구분
    CNTN_MENU_CD : '', //접근 메뉴 코드
    CNTN_MENU_PATH : '', //접근 메뉴 경로
    CNTN_IP : '', //접근 IP
    RGTR_ID : '', //접근자 ID
    RGTR_NM : '', //접근자 명
    REG_DT : '', //접근 일시

    //confirm alert 메시지
    MESSAGE : {
      CONFIRM : {
      },
      ALERT : {
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

  beforeDestroy(){
    this.$eventBus.$off("selCompanyAction"); //eventBus 중복방지를 위해 off
  },

  async created() {
    //상단 고객사 선택시 eventBus 실행(각 페이지별 필요에 의한 내용 구현)
    this.$eventBus.$on("selCompanyAction", (SELECTED_COMPANY) => {
      // console.log(`${this.$options.name} : =====>`, SELECTED_COMPANY.CD_NM);
    });

    //공통코드설정
    let codeName = ['PRVC_INQ_TGRT_TP', 'PRVC_INQ_TASK_TP', 'PRVC_SCH_TP'];
    this.list_common_code = await this.mixin_common_code_get_all(codeName);

    this.SCH_ST_DTS = this.$moment(this.startDate).subtract(7,'days').format('YYYY-MM-DD'); // 시작 일자(일주일전)
    this.SCH_END_DTS = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); // 종료 일자

    this.getPrvcInqHistList('');//개인정보 조회 이력 목록
  },

  mounted() {

  },

  methods: {
    //개인정보 조회 이력 목록
    async getPrvcInqHistList(next) {
      this.selectedRow = {};
      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.items = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let sUrl = '/api/common/prvc/prvcInqHistList';
      let postParam = {
        SCH_ST_DTS : this.SCH_ST_DTS.replace(/-/gi, '')
        , SCH_END_DTS : this.SCH_END_DTS.replace(/-/gi, '')
        , SCH_INQ_TRGT_CD : this.SCH_INQ_TRGT_CD
        , SCH_INQ_TASK_CD : this.SCH_INQ_TASK_CD
        , SCH_TRGT_CUST_NM : this.SCH_TRGT_CUST_NM
        , SCH_KEY : this.SCH_KEY
        , SCH_KEYWORD : this.SCH_KEYWORD
      }

      let headParam = {
        head : {
          ROW_CNT : this.pagination.rowsPerPage,
          PAGES_CNT : this.pagination.page,
          PAGING : "Y",
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){

        //데이터 가공 영역
        response.DATA.forEach((data, idx) => {
          data.REG_DT = this.mixin_convertDate(data.REG_DT, 'yyyy-MM-dd HH:mm:ss');
          data.INQ_TRGT = (data.TASK_SE_NM).startsWith("고객")?'고객':'사용자';
          data.INQ_TRGT_NM = data.TRGT_CUST_ID?data.TRGT_CUST_NM:data.TRGT_USER_NM;
        });

        let tempDataText = response.DATA;
        let idx = this.items.length + 1;
        for(let i in tempDataText){
          tempDataText[i]["index"]= idx++;
        }

        this.items = [...this.items, ...tempDataText]
        //다음
        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
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

    //row 선택
    rowSelect(item) {
      this.selectedRow = item;
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    //조회 이벤트
    schPrvcInqHistList(next) {
      this.getPrvcInqHistList(next);
    },

    getPrvcInqHistChk() {
      if(this.selectedRow.PRVC_INQ_LOG_ID){
        this.getPrvcInqHistDetail();
      }else{
        this.showAlert(this.MESSAGE.ERROR.CHEKCHG)
      }
    },

    //개인정보 조회 이력 상세 조회
    getPrvcInqHistDetail(){
      this.PRVC_INQ_LOG_ID = this.selectedRow.PRVC_INQ_LOG_ID; //개인정보 조회 로그 ID
      this.TASK_SE_CD = this.selectedRow.TASK_SE_CD; //업무 구분 코드
      this.TASK_SE_NM = this.selectedRow.TASK_SE_NM; //업무 구분 명
      this.TRGT_CUST_ID = this.selectedRow.TRGT_CUST_ID; //대상 고객 ID
      this.TRGT_CUST_NM = this.selectedRow.TRGT_CUST_NM; //대상 고객 명
      this.TRGT_USER_ID = this.selectedRow.TRGT_USER_ID; //대상 사용자 ID
      this.TRGT_USER_NM = this.selectedRow.TRGT_USER_NM; //대상 사용자 명
      this.CN = this.selectedRow.CN; //접근 정보
      this.INQ_INFO_SE = this.selectedRow.INQ_INFO_SE; //조회 정보 구분
      this.CNTN_MENU_CD = this.selectedRow.CNTN_MENU_CD; //접근 메뉴 코드
      this.CNTN_MENU_PATH = this.selectedRow.CNTN_MENU_PATH; //접근 메뉴 경로
      this.CNTN_IP = this.selectedRow.CNTN_IP; //접근 IP
      this.RGTR_ID = this.selectedRow.RGTR_ID; //접근자 ID
      this.RGTR_NM = this.selectedRow.RGTR_NM; //접근자 명
      this.REG_DT = this.selectedRow.REG_DT; //접근 일시

      this.mixin_showDialog('SelectedDetail');
    },

    closeDialog(){
      this.selectedRow = {};
      this.mixin_hideDialog('SelectedDetail');
    }

  },
}
</script>

<style lang="scss" scoped>

</style>