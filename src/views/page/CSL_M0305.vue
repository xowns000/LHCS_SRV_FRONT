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
               VOC 유형
             </span>
             <div class="pl-desc">
               <v-select
                v-model="SCH_VOC_TP"
                class="pl-form"
                :items="mixin_common_code_get(this.list_common_code, 'VOC_TP', '전체')"
                placeholder="선택하세요"
               />
             </div>
           </div>
           <div class="pl-form-inline">
             <span class="pl-label">
               고객 유형
             </span>
             <div class="pl-desc">
               <v-select
                v-model="SCH_VOC_CUST_TP"
                class="pl-form"
                :items="mixin_common_code_get(this.list_common_code, 'VOC_CUST_TP', '전체')"
                placeholder="선택하세요"
               />
             </div>
           </div>
           <div class="pl-form-inline">
             <span class="pl-label">
               결과통보 여부
             </span>
             <div class="pl-desc">
               <v-select
                v-model="SCH_NOTR_WT"
                class="pl-form"
                :items="mixin_common_code_get(this.list_common_code, 'NOTR_WT', '전체')"
                placeholder="선택하세요"
               />
             </div>
           </div>
           <div class="pl-form-inline">
             <span class="pl-label">
               <v-select
                v-model="SCH_KEY"
                class="pl-form"
                :items="mixin_common_code_get(this.list_common_code, 'VOC_SCH_TP')"
                placeholder="선택하세요"
               />
             </span>
             <div class="pl-desc">
               <v-text-field
               v-model="SCH_KEYWORD"
               class="pl-form "
               placeholder="검색어 입력"
               @keyup.enter="schVocHistList('')"
              />
             </div>
           </div>
           <v-btn
            class="pl-btn is-icon"
            @click="schVocHistList('')"
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
               @click="getVocInfoChk()"
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
              :FileNameProp="'VOC 이력 조회_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
              SheetNameProp="VOC 이력 조회"
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
         @dblclick:row="getVocInfo"
         @page-count="pageCount = $event"
         no-data-text="등록된 데이터가 없습니다."
         >
        <template v-slot:item.CUST_NM="{ item }">
          {{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(item.CUST_NM) : item.CUST_NM }}
        </template>
        <template v-slot:item.RSVT_CL_TELNO="{ item }">
          {{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(item.RSVT_CL_TELNO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(item.RSVT_CL_TELNO.replace(/[^0-9]/g, "")) }}
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
          보기 {{ mixin_getPagePeriod(items, page) }} / {{ items.length }}
            <compo-tooltip-btn
              TitleProp="다음 검색"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 arrow-next-paging"
              TooltipPositionProp="bottom"
              :DisabledProp = "nextDisabled"
              @btnClick="schVocHistList('next')"
            ></compo-tooltip-btn>
        </span>
       </div>
     </div>
   </div>
   <!-- VOC dialog -->
   <v-dialog
      v-model="dialogVoc"
      content-class="dialog-draggable is-lg is-nopadding"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="VOC 접수"
        @hide="mixin_hideDialog('Voc')"
      >
        <template slot="body">
          <!-- component -->
          <compo-voc
            ref="vocDataCompo"
            :VOC_RCPT_ID="Number(VOC_RCPT_ID)"
            :DataProp="selectedRow"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('Voc')">닫기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
 </div>
</template>

<script>
export default {
   name:"MENU_CSL_M0301", //name은 'MENU_' + 파일명 조합

components: {

 },
data() {
  return {
    list_common_code : [],

    // top search
    startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    endDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

    //검색
    SCH_ST_DTS : this.$moment(this.startDate).subtract(7,'days').format('YYYY-MM-DD'), //검색 시작 일자
    SCH_END_DTS : '', //검색 종료 일자
    SCH_VOC_TP : '', //VOC 유형
    SCH_VOC_CUST_TP : '', //고객 유형
    SCH_NOTR_WT : '', //결과통보 여부
    SCH_KEY : 'CUST_NM', // 검색 구분
    SCH_KEYWORD : '', //검색어

    //dialog
    dialogVoc: false,

    selectedRow : {},

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
      { text: 'VOC접수채널', value: 'CHN_TYPE_NM', align: 'left', width: '120px',sortable : false },
      { text: 'VOC유형', value: 'VOC_TYPE_NM', align: 'left', width: '100px',sortable : false },
      { text: '중요도', value: 'IPTT_NM', align: 'left', width: '120px',sortable : false},
      { text: '접수일시', value: 'REG_DT', align: 'left', width: '150px' ,sortable : false},
      { text: '고객명', value: 'CUST_NM', align: 'center', width: '150px' },
      { text: '연락처', value: 'RSVT_CL_TELNO', align: 'center', width: '150px' ,sortable : false},
      { text: '고객 유형', value: 'CUST_TYPE_NM', align: 'center', width: '120px',sortable : false },
      { text: '고객 성향', value: 'CUST_TDCY_NM', align: 'left', width: '100px' ,sortable : false},
      { text: 'VOC 내용 요약', value: 'VOC_TTL', align: 'left', sortable : false },
      { text: '결과통보여부', value: 'RSLT_PVSN_NM', align: 'left', width: '120px',sortable : false},
    ],
    items: [],

    VOC_RCPT_ID:'', //VOC 접수 ID
    PHN_CUTT_ID : '', //전화상담 ID
    CUTT_BGNG_DT : '', //상담 시작 일시
    CUTT_END_DT : '', //상담 종료 일시
    SRCH_CUST:[], //고객 정보
    CL_TYPE_CD: 'IN', //인바운드 고정
    CHNL:'TEL',//채널 전화 고정
    SRCH_USER:[], //상담사 정보
    AFTPRCS_HR:'', //후처리 시간(초)
    REC_FILE_NM:'', //녹취파일명

    //confirm alert 메시지
    MESSAGE : {
      CONFIRM : {
      },
      ALERT : {
      },
      ERROR : {
        ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        , CHEKCHG : {alertDialogToggle: true, msg: '항목을 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
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
    //고객찾기 dialog 닫기
    this.$eventBus.$on("dialogCusFindClose", () => {
      this['dialogCusFind'] = false;
      this['dialogUserFind'] = false;
    });

    //상단 고객사 선택시 eventBus 실행(각 페이지별 필요에 의한 내용 구현)
    this.$eventBus.$on("selCompanyAction", (SELECTED_COMPANY) => {
      // console.log(`${this.$options.name} : =====>`, SELECTED_COMPANY.CD_NM);
    });

    //공통코드설정
    let codeName = ['VOC_TP', 'VOC_CUST_TP', 'NOTR_WT', 'VOC_SCH_TP'];
    this.list_common_code = await this.mixin_common_code_get_all(codeName);

    this.SCH_ST_DTS = this.$moment(this.startDate).subtract(7,'days').format('YYYY-MM-DD'); // 통화 시작 일자(일주일전)
    this.SCH_END_DTS = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); // 통화 종료 일자

    this.getVocHistList('');//VOC 이력 목록
  },

  mounted() {

  },

  methods: {
    //그리드 목록 조회
    async getVocHistList(next) {
      this.selectedRow = {};
      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.items = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let sUrl = '/api/common/voc/vocList';
      let postParam = {
        ST_DT : this.SCH_ST_DTS.replace(/-/gi, '')
        , END_DT : this.SCH_END_DTS.replace(/-/gi, '')
        , VOC_TYPE_CD : this.SCH_VOC_TP
        , CUST_TYPE_CD : this.SCH_VOC_CUST_TP
        , RSLT_PVSN_CD : this.SCH_NOTR_WT
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
          data.RSVT_CL_TELNO = this.mixin_setPhoneNo(data.RSVT_CL_TELNO.replace(/[^0-9]/g, ""));
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
      // console.log(this.selectedRow);
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    //조회 이벤트
    schVocHistList(next) {
      this.getVocHistList(next);
    },

    getVocInfoChk() {
      if(this.selectedRow.VOC_RCPT_ID){
        this.getVocInfo();
      }else{
        this.showAlert(this.MESSAGE.ERROR.CHEKCHG)
      }
    },

    //VOC 상세 조회
    getVocInfo(){
      this.VOC_RCPT_ID = this.selectedRow.VOC_RCPT_ID;
      this.mixin_showDialog('Voc');
    },
  },
}
</script>

<style lang="scss" scoped>

</style>