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
<!--                  v-model="SCH_CUTT_ST_DTS"-->
<!--                  DateType="dateInput"-->
<!--                  :DateProp.sync="SCH_CUTT_ST_DTS"-->
<!--                 />-->
<!--                 <span class="pl-unit">~</span>-->
<!--                 <compo-date-picker-->
<!--                  v-model="SCH_CUTT_END_DTS"-->
<!--                  DateType="dateInput"-->
<!--                  :DateProp.sync="SCH_CUTT_END_DTS"-->
<!--                 />-->
<!--                 <compo-drop-picker :StartDateProp.sync="SCH_CUTT_ST_DTS" :EndDateProp.sync="SCH_CUTT_END_DTS" />-->
<!--               </div>-->
               <compo-date-range-picker
                   :StartDayProp.sync="SCH_CUTT_ST_DTS"
                   :EndDayProp.sync="SCH_CUTT_END_DTS"
                   @startDayChange="mixin_testLog(SCH_CUTT_ST_DTS)"
                   @endDayChange="mixin_testLog(SCH_CUTT_END_DTS)"
               />
             </div>
           </div>
           <div class="pl-form-inline">
             <span class="pl-label">
               처리 상태
             </span>
             <div class="pl-desc">
               <v-select
                v-model="SCH_APRV_STTS_CD"
                class="pl-form"
                :items="mixin_common_code_get(this.common_code, 'APRV_ST', '전체')"
                placeholder="선택하세요"
               />
             </div>
           </div>
           <div class="pl-form-inline">
             <span class="pl-label">
               <v-select
                v-model="SCH_KEY"
                class="pl-form"
                :items="mixin_common_code_get(this.common_code, 'CUTT_HIST_SRCH')"
                placeholder="선택하세요"
               />
             </span>
             <div class="pl-desc">
               <v-text-field
               v-model="SCH_KEYWORD"
               class="pl-form "
               placeholder="검색어 입력"
               @keyup.enter="schCuttHistMngList('')"
              />
             </div>
           </div>
           <v-btn
            class="pl-btn is-icon"
            @click="schCuttHistMngList('')"
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
              @click="getCuttChgInfoChk"
              :disabled="selectedRow.index != undefined ? false : true"
          >
              <span class="pl-icon20 document"></span>
              선택항목 상세
            </v-btn>
            <v-btn
            class="pl-btn is-icon is-sub"
            @click="batchAprvValidate"
            >
              <span class="pl-icon20 select-accept"></span>
              일괄승인
            </v-btn>
         </div>
         <div class="pl-grid-top-utils">
           <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
           <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
              TypeProp="Download"
              :DownReason=true
              :DataHeaderProp="headers"
              :DataBodyProp="items"
              :FileNameProp="'전화상담 이력 관리_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
              SheetNameProp="전화상담 이력 관리"
              HeaderColorProp="00B0F0"
            ></compo-excel>
         </div>
       </div>
       <v-data-table
         class="pl-grid"
         :headers="headers"
         :items="items"
         fixed-header
         item-key="ROW_NUMBER"
         height="562px"
         :items-per-page="ROW_PER_PAGE"
         :item-class="isActiveRow"
         hide-default-footer
         :page.sync="page"
         @click:row="rowSelect"
         @dblclick:row="getCuttChgInfoChk"
         no-data-text="등록된 데이터가 없습니다."
         @page-count="pageCount = $event">
        <template v-slot:item.CUST_NM="{ item }">
          {{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(item.CUST_NM) : item.CUST_NM }}
        </template>
        <template v-slot:item.CUST_PHN_NO="{ item }">
          {{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(item.CUST_PHN_NO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(item.CUST_PHN_NO.replace(/[^0-9]/g, "")) }}
        </template>
        <template v-slot:item.REC_FILE_NM="{ item }">
          <template v-if="$store.getters['userStore/GE_USER_ROLE'].atrtGroupId !== '6'"><!-- 상담사가 아닌 경우-->
          <!-- <template v-if="$store.getters['userStore/GE_USER_ROLE'].userId === '1'"> -->
            <v-btn
              class="pl-btn is-sm  is-sub"
              :disabled="!item.REC_FILE_NM"
              @click="showRecDialog(item)"
              >
              {{ item.REC_FILE_NM ? '듣기' : '파일없음' }}
            </v-btn>
          </template>
          <template v-else><!-- 상담사인 경우 -->
            <template v-if="mixin_getCustcoSetting('ENV_AUDIO_PLAY_PERM_YN')"><!-- 다른 상담사 녹취 재생 권한이 있는 경우-->
              <v-btn
                class="pl-btn is-sm is-sub"
                :disabled="!item.REC_FILE_NM"
                @click="showRecDialog(item)"
                >
                {{ item.REC_FILE_NM ? '듣기' : '파일없음' }}
              </v-btn>
            </template>
            <template v-else><!-- 다른 상담사 녹취 재생 권한이 없는 경우-->
              <template v-if="$store.getters['userStore/GE_USER_ROLE'].userId === item.CUSL_ID.toString()"><!-- 내 상담 녹취만 재생 가능-->
                <v-btn
                  class="pl-btn is-sm is-sub"
                  :disabled="!item.REC_FILE_NM"
                  @click="showRecDialog(item)"
                  >
                  {{ item.REC_FILE_NM ? '듣기' : '파일없음' }}
                </v-btn>
              </template>
              <template v-else>
                <v-btn
                  class="pl-btn is-sm is-sub"
                  :disabled="true"
                  >
                  {{ item.REC_FILE_NM ? '권한없음' : '파일없음' }}
                </v-btn>
              </template>
            </template>
          </template>
        </template>
         <template v-slot:item.APRV_STTS_NM="{ item }">
          <span
              :class="`pl-round-chip is-sm chat-stat-${item.APRV_STTS_NM == '승인' ? 'done' : 'wait'}`">
              {{ item.APRV_STTS_NM }}
            </span>
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
              @btnClick="schCuttHistMngList('next')"
            ></compo-tooltip-btn>
        </span>
        </div>
      </div>
    </div>
    <!-- dialog -->
    <!-- 변경요청 상세 정보 -->
    <v-dialog v-model="dialogSelectedDetail" content-class="dialog-draggable is-lg" hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog header-title="변경요청 상세 정보" @hide="mixin_hideDialog('SelectedDetail')">
        <template slot="body">
          <p>변경 요청된 상담 정보의 변경전과 변경 후의 내용을 확인 하시고 [승인] 버튼을 클릭하십시오.</p>
          <p>승인되지 않은 내용은 상담직원 콘솔의 상담이력에 반영되지 않으니 유의바랍니다.</p>

          <div class="pl-chatting-cs-info is-mt-m pl-cols">
            <div class="pl-chatting-cs-info-cus">
              <div>
                <strong class="pl-chatting-cs-info-tit">요청자</strong>
                <span class="pl-chatting-cs-info-desc">{{ selectedRow.APRV_DMND_USER_NM }}</span>
              </div>
              <div>
                <strong class="pl-chatting-cs-info-tit">요청 일시</strong>
                <span class="pl-chatting-cs-info-desc">{{ mixin_convertDate(selectedRow.APRV_DMND_DT, 'yyyy-MM-dd HH:mm:ss') }}</span>
              </div>
              <div>
                <strong class="pl-chatting-cs-info-tit">요청 사유</strong>
                <span class="pl-chatting-cs-info-desc">{{ selectedRow.CHG_RSN }}</span>
              </div>
            </div>
            <div class="pl-chatting-cs-info-cus" style="border-top: 0">
              <div>
                <strong class="pl-chatting-cs-info-tit">승인자</strong>
                <span class="pl-chatting-cs-info-desc">{{ selectedRow.APRV_USER_NM }}</span>
              </div>
              <div>
                <strong class="pl-chatting-cs-info-tit">승인 상태</strong>
                <span class="pl-chatting-cs-info-desc">{{ selectedRow.APRV_STTS_NM }}</span>
              </div>
              <div>
                <strong class="pl-chatting-cs-info-tit">승인 일시</strong>
                <span class="pl-chatting-cs-info-desc">{{ mixin_convertDate(selectedRow.APRV_DT, 'yyyy-MM-dd HH:mm:ss') }}</span>
              </div>
            </div>
          </div>
          <!-- audio -->
          <template v-if="selectedRow.REC_FILE_NM">
            <template v-if="$store.getters['userStore/GE_USER_ROLE'].atrtGroupId !== '6'"><!-- 상담사가 아닌 경우-->
              <!-- 녹취파일 play -->
              <compo-audio
                  v-model="dialogListenVoice"
                  AudioType="playOnly"
                  :audioProp="this.selectedRow"
              />
            </template>
            <template v-else><!-- 상담사인 경우 -->
              <template v-if="mixin_getCustcoSetting('ENV_AUDIO_PLAY_PERM_YN')"><!-- 다른 상담사 녹취 재생 권한이 있는 경우-->
                <!-- 녹취파일 play -->
                <compo-audio
                    v-model="dialogListenVoice"
                    AudioType="playOnly"
                    :audioProp="this.selectedRow"
                />
              </template>
            </template>
          </template>

          <h2 class="pl-dialog-body-tit-h2 ">상담 정보 변경 내용 </h2>
          <v-data-table
            class="pl-grid is-mt-s is-nowrap"
            :headers="CHG_INFO.headers"
            :items="CHG_INFO.items"
            fixed-header
            item-key="ROWNUM"
            height="352px"
            :items-per-page="CHG_INFO.ROW_PER_PAGE"
            hide-default-footer
            :page.sync="CHG_INFO.page"
            no-data-text="등록된 데이터가 없습니다."
            @page-count="CHG_INFO.pageCount = $event">
            <template v-slot:item.CHG_YN="{ item }">
              <span :class="item.CHG_YN === 'N' ? 'is-txt-main' : 'is-txt-error'">
                {{ item.CHG_YN == 'N' ? '' : '변경' }}
              </span>
            </template>
            <template v-slot:item.ATTR_VL="{ item }">
              <template v-if="item.DATA_TYPE_CD === 'TXT'">
                <span v-html="item.ATTR_VL"></span>
              </template>
              <template v-else>
                {{ item.ATTR_VL }}
              </template>
            </template>
            <template v-slot:item.CHG_ATTR_VL="{ item }">
              <template v-if="item.DATA_TYPE_CD === 'TXT'">
                <span v-html="item.CHG_ATTR_VL"></span>
              </template>
              <template v-else>
                {{ item.CHG_ATTR_VL }}
              </template>
            </template>
          </v-data-table>
        </template>

        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="closeDialog">닫기</v-btn>
          <v-btn class="pl-btn" v-if="selectedRow.APRV_STTS_CD === 'RDY'" @click="showAlert(MESSAGE.CONFIRM.APRV)">승인</v-btn>
        </template>

      </compo-dialog>
    </v-dialog>
    <!-- 녹취파일 modal -->
    <compo-audio
        v-model="dialogListenVoice"
        AudioType="whole"
        :audioProp="this.REC_TEMP_DATA"
    />
 </div>
</template>

<script>
export default {
  name: "MENU_CSL_M0302", //name은 'MENU_' + 파일명 조합

components: {

 },
data() {
  return {
    common_code : [],

    // top search
    startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    endDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

    // dialog
    dialogSelectedDetail: false,

    selectedRow : {},

    dialogListenVoice : false, //REC dialog
    IPCC_SOCKET_URL : '', //IPCC Socket URL
    sApiUri : '',
    REC_FILE_NM : '', //녹취 파일 명
    AudioSrc : '', //녹음 파일 경로

    //검색
    SCH_CUTT_ST_DTS : this.$moment(this.startDate).subtract(7,'days').format('YYYY-MM-DD'), //통화 시작 일자
    SCH_CUTT_END_DTS : '', //통화 시작 일자
    SCH_APRV_STTS_CD : '', //처리 상태 코드
    SCH_KEY : 'CUST_NM', // 검색 구분
    SCH_KEYWORD : '', //검색어

    // grid
    selectedIdList: [],
    page: 1,
    pageCount: 0,
    perPage: [15,30,50,100],
    ROW_PER_PAGE: 15,
    pagination: {
      page: 1,
      rowsPerPage: 500,
      sortBy: "",
      descending: ""
    }, //그리드 페이지속성정의
    nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
    headers: [
      { text: '순번', value: 'ROW_NUMBER', align: 'center', width: '80px',sortable : false },
      { text: '콜유형', value: 'CL_TYPE_NM', width: '120px' },
      { text: '요청자', value: 'APRV_DMND_USER_NM', width: '140px' ,sortable : false},
      { text: '요청일시', value: 'NEW_APRV_DMND_DT', width: '150px' ,sortable : false},
      { text: '처리상태', value: 'APRV_STTS_NM', width: '140px' ,sortable : false},
      { text: '승인자', value: 'APRV_USER_NM', width: '100px',sortable : false},
      { text: '승인일시', value: 'NEW_APRV_DT', width: '150px' ,sortable : false},
      { text: '고객명', value: 'CUST_NM', width: '150px' ,sortable : false},
      { text: '고객 전화번호', value: 'CUST_PHN_NO', width: '140px' ,sortable : false},
      { text: '녹취파일', value: 'REC_FILE_NM', align: 'center', width: '120px', sortable: false ,},
      { text: '요청 사유', value: 'CHG_RSN', align: 'left' ,sortable : false},
    ],
    items: [],
    REC_TEMP_DATA : {},


    DialogStartDate : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    DialogEndDate : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

    PHN_CUTT_ID : '', //전화상담 ID
    CL_TYPE_CD: 'IN', //인바운드 고정
    CHNL:'TEL',//채널 전화 고정

    //변경정보 grid
    CHG_INFO : {
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: -1,
      nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
      headers: [
        { text: '항목', value: 'EXPSN_ATTR_NM', align: 'left', width: '140px' },
        { text: '변경전', value: 'ATTR_VL', align: 'left' },
        { text: '변경후', value: 'CHG_ATTR_VL', align: 'left' },
        { text: '변경여부', value: 'CHG_YN', align: 'center', width: '90px' },
      ],
      items: [],
    },

    //confirm alert 메시지
    MESSAGE : {
      CONFIRM : {
        APRV : {alertDialogToggle: true, msg: '승인 처리 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.cuttChgAprvProc, callNo: this.closeMsg}
        , BATCH_APRV : {alertDialogToggle: true, msg: '일괄 승인 처리 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.batchAprvProc, callNo: this.closeMsg}
      },
      ALERT : {
        SUCCESS : {alertDialogToggle: true, msg: '정상 처리 되었습니다.', iconClass: 'is-info', type: 'default'}
      },
      ERROR : {
        ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        , CHEKCHG : {alertDialogToggle: true, msg: '항목을 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
      },
      TOAST : {
        SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 },
      },
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
    let codeName = ['CALL_TP', 'APRV_ST', 'CUTT_HIST_SRCH'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    this.SCH_CUTT_ST_DTS = this.$moment(this.startDate).subtract(7,'days').format('YYYY-MM-DD'); // 통화 시작 일자(일주일전)
    this.SCH_CUTT_END_DTS = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); // 통화 종료 일자

    this.getCuttHistMngList('');//상담 이력 목록

    this.IPCC_SOCKET_URL = this.$store.getters["userStore/GE_USER_COMPANY"].API_URI;
    this.sApiUri = this.$store.getters["userStore/GE_USER_COMPANY"].API_URI;
  },

  mounted() {

  },

  methods: {
    //그리드 목록 조회
    async getCuttHistMngList(next) {
      this.selectedRow = {};
      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.items = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let sUrl = '/phone-api/history/cuttHistMngList';
      let postParam = {
        SCH_CUTT_ST_DTS : this.SCH_CUTT_ST_DTS.replace(/-/gi, '')
        , SCH_CUTT_END_DTS : this.SCH_CUTT_END_DTS.replace(/-/gi, '')
        , SCH_APRV_STTS_CD : this.SCH_APRV_STTS_CD
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
          data.NEW_APRV_DMND_DT = this.mixin_convertDate(data.APRV_DMND_DT, 'yyyy-MM-dd HH:mm:ss');
          data.NEW_APRV_DT = this.mixin_convertDate(data.APRV_DT, 'yyyy-MM-dd HH:mm:ss');
          data.CUST_PHN_NO = this.mixin_setPhoneNo(data.CUST_PHN_NO.replace(/[^0-9]/g, ""));
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

        //이부분은 체크해볼것
        this.pagination.page += 1
        // this.page=1;
      }
    },

    //row 선택
    rowSelect(item) {
      const iSemiCnt = this.sApiUri.match(/:/g).filter(function(item) { return item !== ''; }).length;

      if(iSemiCnt > 1){
        item.AudioSrc = this.sApiUri.split(':')[0] + ':' + this.sApiUri.split(':')[1] + '/hdd2/rec/' + item.REC_FILE_NM + '.mp3'
      }else{
        item.AudioSrc = this.sApiUri + '/hdd2/rec/' + item.REC_FILE_NM + '.mp3'
      }

      this.selectedRow = item;
      // console.log(this.selectedRow);
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    //조회 이벤트
    schCuttHistMngList(next) {
      this.getCuttHistMngList(next);
    },

    //clase confirm, alert
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    //상세보기
    getCuttChgInfoChk() {
      if(this.selectedRow.PHN_CUTT_ID){
        this.mixin_showDialog('SelectedDetail');
        this.getCuttChgInfo();
      }else{
        this.showAlert(this.MESSAGE.ERROR.CHEKCHG)
      }
    },

    //변경 정보 조회
    async getCuttChgInfo() {
      let sUrl = '/phone-api/history/cuttChgInfo';
      let postParam = {
        PHN_CUTT_ID : this.selectedRow.PHN_CUTT_ID
        , CHG_HSTRY_ID : this.selectedRow.CHG_HSTRY_ID
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){

        //데이터 가공 영역
        if(response.DATA.length > 0){
          response.DATA.forEach((data, idx) => {
            if(data.DATA_TYPE_CD === 'DAT'){
              data.ATTR_VL = this.mixin_convertDate(data.ATTR_VL, 'yyyy-MM-dd HH:mm:ss');
              data.CHG_ATTR_VL = this.mixin_convertDate(data.CHG_ATTR_VL, 'yyyy-MM-dd HH:mm:ss');
            }else if(data.DATA_TYPE_CD === 'TXT'){
              data.ATTR_VL = this.mixin_decode(data.ATTR_VL).replace(/\n/gi, '<br>');
              data.CHG_ATTR_VL = this.mixin_decode(data.CHG_ATTR_VL).replace(/\n/gi, '<br>');
            }
          });
        }

        this.CHG_INFO.items = response.DATA;
      }
    },

    //변경요청 승인처리
    async cuttChgAprvProc() {
      let sUrl = '/phone-api/history/cuttChgAprvProc';
      let postParam = {
        PHN_CUTT_ID : this.selectedRow.PHN_CUTT_ID
        , CHG_HSTRY_ID : this.selectedRow.CHG_HSTRY_ID
        , APRV_STTS_CD : 'APRV'
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        // this.showAlert(this.MESSAGE.ALERT.SUCCESS);
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeMsg();
        this.mixin_hideDialog('SelectedDetail');
        this.getCuttHistMngList('');
      }
    },

    //녹취파일 듣기
    showRecDialog(item) {

      this.REC_TEMP_DATA={};
      this.REC_TEMP_DATA = item;

      this.mixin_showDialog('ListenVoice');

    },

    closeDialog(){
      this.mixin_hideDialog('SelectedDetail');
      this.selectedRow = {};
    },

    //일괄 승인처리
    batchAprvValidate() {
      this.showAlert(this.MESSAGE.CONFIRM.BATCH_APRV);
    },

    async batchAprvProc() {
      let sUrl = '/phone-api/history/batchCuttChgAprvProc';
      let postParam = {
        arrPhnCuttChgHstry : this.SELECTED_DATA
        , APRV_STTS_CD : 'APRV'
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        // this.showAlert(this.MESSAGE.ALERT.SUCCESS);
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeMsg();
        this.mixin_hideDialog('SelectedDetail');
        this.getCuttHistMngList('');
      }
    },

  },
}
</script>

<style lang="scss" scoped>

</style>