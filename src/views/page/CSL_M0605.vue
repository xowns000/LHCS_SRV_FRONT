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
                <compo-date-range-picker
                  :StartDayProp.sync="START_DATE"
                  :EndDayProp.sync="END_DATE"
                  @startDayChange="changeStartDate"
                  @endDayChange="changeEndDate"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                발송자 ID
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form "
                  placeholder="검색어 입력"
                  v-model="SENDER.LGN_ID"
                  @keyup.enter="getEmailSendingHistory"
                ></v-text-field>
              </div>
              <!-- 찾기 버튼 -->
              <compo-tooltip-btn
                TitleProp="사용자 검색"
                ClassProp="pl-tooltip-btn flex-grow-0"
                IconProp="pl-icon20 in-search"
                TooltipPositionProp="top"
                @btnClick="userSearch"
              ></compo-tooltip-btn>
              <span class="pl-label">
                수신이메일
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form "
                  placeholder="검색어 입력"
                  v-model="RCVR_EML"
                  @keyup.enter="getEmailSendingHistory"
                ></v-text-field>
              </div>
            </div>
            <v-btn class="pl-btn is-icon"
              @click="getEmailSendingHistory">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols">
        <!-- 그리드 -->
        <div class="is-vrt pl-card">
          <div class="pl-grid-top">
            <div class="pl-grid-top-left">

            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
              <!-- 엑셀 다운로드 버튼 -->
              <compo-excel
                TypeProp="Download"
                :DownReason=true
                :DataHeaderProp="headers"
                :DataBodyProp="EMAIL_SENDING_HISTORY_LIST"
                :FileNameProp="'이메일발송이력_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                HeaderColorProp="00B0F0"
              ></compo-excel>
            </div>
          </div>
          <v-data-table
            class="pl-grid"
            :headers="headers"
            :items="EMAIL_SENDING_HISTORY_LIST"
            fixed-header
            item-key="index"
            height="562px"
            :items-per-page="ROW_PER_PAGE"
            hide-default-footer
            :page.sync="page"
            no-data-text="등록된 데이터가 없습니다."
            @page-count="pageCount = $event"
            @click:row="rowSelect">
            <template v-slot:item.TTL="{ item }">
              <v-tooltip content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on">{{ item.TTL }}</span>
                </template>
                <span>{{ item.TTL }}</span>
              </v-tooltip>
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

            <span class="pl-pager-period">보기 {{ mixin_getPagePeriod(EMAIL_SENDING_HISTORY_LIST, page) }} / {{ EMAIL_SENDING_HISTORY_LIST.length }}</span>
          </div>
        </div>
        <!-- 이메일 발송 상세정보 -->
        <div class="is-col-fix" style="width: 610px">
          <div class="pl-card">
            <div class="pl-subtit">이메일 발송 상세정보</div>
          </div>
          <!-- 이메일 발송 내용 불러오기 -->
          <div class="pl-card" style="overflow-y: scroll; height: calc(100vh - 291px)">
            <compo-view-email
              v-if="!this.mixin_isEmpty(EML_SNDNG_ID)"
              :DataProp="{'EML_SNDNG_ID' : EML_SNDNG_ID}"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 발송자 찾기 모달 -->
    <v-dialog
      v-model="dialogUserFind"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="사용자 찾기"
        @hide="mixin_hideDialog('UserFind')"
      >
        <template slot="body">
          <!-- component -->
          <compo-find-cus
            SearchTitleProp="사용자 찾기"
            :SearchDataProp="DropUser"
            :SearchInputProp.sync="searchUsername"
            :DataHeaderProp="HeadersFindCus"
            :DataBodyProp="ItemsFindCus"
            :FindData="SENDER"
            MultiSelYnProp="true"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('UserFind')">닫기</v-btn>
          <v-btn class="pl-btn" @click="mixin_hideDialog('UserFind')">확인</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>

  export default {
  name: "MENU_CSL_M0605", //name은 'MENU_' + 파일명 조합
  components: {
  },
  data() {
    return {
      // 시작 일자
      START_DATE : "",
      // 종료 일자
      END_DATE : "",

      date: '',   //현재시간

      // top search
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      // 사용자 검색 모달 게시 상태
      dialogUserFind: false,
      // 발송자 정보
      SENDER : [],
      //수신 이메일
      RCVR_EML:'',

      // 사용자 검색 모달 관련 시작
      DropUser: {},
      // 사용자 이름 검색
      searchUsername: '',
      // 고객 이름 검색
      searchCusname: '',
      HeadersFindCus: [],
      ItemsFindCus:[],
      // 사용자 검색 모달 관련 끝

      // grid
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      },
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '70px' ,sortable: false},
        { text: '이메일유형', value: 'SNDNG_TYPE_NM', align: 'center', width: '110px' ,sortable: false},
        { text: '수신번호', value: 'PHN_NO',align: 'left', width: '120px', sortable: false},
        { text: '수신이메일', value: 'RCVR_EML', align: 'left', width: '150px' ,sortable: false},
        { text: '발송자', value: 'RGTR_NM', align: 'center', width: '90px' ,sortable: false},
        { text: '발송자 ID', value: 'LGN_ID', align: 'center', width: '110px' ,sortable: false},
        { text: '발송 일시', value: 'SNDNG_DT_F', align: 'center', width: '155px' ,sortable: false},
        { text: '발송 결과', value: 'RSLT_NM', align: 'center', width: '120px' ,sortable: false},
        { text: '메일 제목', value: 'TTL', align: 'left', sortable: false},
      ],
      EMAIL_SENDING_HISTORY_LIST: [],
      items: [
        {
          index: 1,
          type1: '설문조사',
          type2: '010-1234-1234',
          type3: 'OOOO@OOO.OO.OO',
          type4: '나상담',
          type5: 'lhcs',
          type6: '2023-01-20 13:45:49',
          type7: '발송 완료',
          type8: '설문조사 진행을 위한 안내 메일입니다.',
        },
      ],

      EML_SNDNG_ID:'',

      // 유효성 검사 통과 불가 시 초기화 하기 위한 선택 전 시작 일자
      VALIDATE_START_OLD_DATE : "",
      // 유효성 검사 통과 불가 시 초기화 하기 위한 선택 전 종료 일자
      VALIDATE_END_OLD_DATE : "",
      // 유효성 검사를 위한 시작 일자
      VALIDATE_START_DATE : "",
      // 유효성 검사를 위한 종료 일자
      VALIDATE_END_DATE : "",

      VALIDATE_RULES:{
        START_DATE :[
          v => !!v|| '시작일자 은(는) 필수 입력 항목입니다.'
        ],
        END_DATE :[
          v => !!v|| '종료일자 은(는) 필수 입력 항목입니다.'
        ]
      },

    }
  },
  watch: {

  },

  computed: {

  },

  async created() {
    // 날짜 컴퍼넌트 초기화
    this.initDatePicker();
    //서버기준 오늘날짜 가져오기
    await this.getServerDate();
    this.getEmailSendingHistory();
  },

  mounted() {

  },

  methods: {
    init() {
      this.EML_SNDNG_ID = '';
    },
    async getEmailSendingHistory() {
      this.init();
      const sUrl = '/api/email/selectEmailSendingHistory';
      let startDate = this.START_DATE.replaceAll(/-/g, "")+"000000";
      let endDate = this.END_DATE.replaceAll(/-/g, "")+"235959";
      const postParam = {
        START_DATE : startDate,               // 조회 기간 시작일
        END_DATE : endDate,                   // 조회 기간 종료일
        LGN_ID : this.SENDER.LGN_ID,         // 발송자 로그인 ID
        RCVR_EML: this.RCVR_EML
      }
      const headParam = {
        head: {
          'ROW_CNT' : this.pagination.rowsPerPage,
          'PAGES_CNT' : this.pagination.page,
          'PAGING' : 'Y',
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );
      if (!resData.HEADER.ERROR_FLAG) {
        resData.DATA.forEach((data, idx) => {
          data.PHN_NO = this.mixin_setPhoneNo(data.PHN_NO.replace(/[^0-9]/g, ""));
          data.RSLT_NM = data.RSLT_CD == 'SUCC' ? '성공' : (this.mixin_isEmpty(data.RSLT_CD) && !this.mixin_isEmpty(data.RSVT_DT) ? '예약발송대기' : '실패')
        });
        this.EMAIL_SENDING_HISTORY_LIST = resData.DATA;
      }
    },

    initDatePicker(){
      // let nowDate = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString();

      let ago7Day = this.$moment(new Date()).subtract(7, 'day').format("YYYYMMDDHHmmss");
      let today = this.$moment(new Date()).format("YYYYMMDDHHmmss");

      let ago7DayFormat = ago7Day.substring(0,4) + "-" + ago7Day.substring(4,6) + "-" + ago7Day.substring(6,8);
      let todayFormat = today.substring(0,4) + "-" + today.substring(4,6) + "-" + today.substring(6,8);

      /** 발송이력 탭 > 검색조건  */
      // 시작일자
      this.START_DATE = ago7DayFormat
      // 종료일자
      this.END_DATE = todayFormat;
      /** 발송이력 탭 > 유효성 검사 관련 날짜 변수 */
      // 유효성 검사 목적 시작 일자
      this.VALIDATE_START_DATE = ago7DayFormat;
      // 유효성 검사 목적 종료 일자
      this.VALIDATE_END_DATE = todayFormat;
      // 유효성 검사 미통과 시 초기화 설정을 위한 시작 일자
      this.VALIDATE_START_OLD_DATE = ago7DayFormat;
      // 유효성 검사 미통과 시 초기화 설정을 위한 종료 일자
      this.VALIDATE_END_OLD_DATE = todayFormat;

      /** 대량발송 탭  */
      // 발송일자
      this.SEND_DATE = todayFormat;
      // 발송시간
      this.SEND_TIME = today.substring(8, 10) + ":" + today.substring(10, 12) ;

    },

    // 서버 시간 가져오기
    async getServerDate() {
      await this.mixin_getSvrDate("YYYYMMDDHH24MISS").then((data)=>{
        this.date = data;
      })
    },

    // 시작 날짜 변환 (기본적인 포맷은 YYYY-MM-DD HH:mm:ss 이고, api 파라미터로 보낼 때 YYYYMMDDHHmmss로 변환)
    changeStartDate(startData){
      this.VALIDATE_START_DATE = this.replaceAll(startData);
      if(this.chkDate()){     // 유효성 통과
        // 다음 유효성 검사 위해 원본 날짜 최신 선택 날짜로 업데이트
        this.VALIDATE_START_OLD_DATE = this.VALIDATE_START_DATE;
      }else{
        // 시작일자 날짜 설정 무효
        this.START_DATE = this.$moment(this.VALIDATE_START_OLD_DATE).format("YYYY-MM-DD");
        this.VALIDATE_START_DATE = this.VALIDATE_START_OLD_DATE;
      }
    },

    // 종료 날짜 변환 : String(YYYY:MM:DD hh:mm:ss AM/PM) to String(YYYYMMDDHHmmss)
    changeEndDate(endData){
      this.VALIDATE_END_DATE = this.replaceAll(endData);
      if(this.chkDate()){   // 유효성 통과
        // 다음 유효성 검사 위해 원본 날짜 최신 선택 날짜로 업데이트
        this.VALIDATE_END_OLD_DATE = this.VALIDATE_END_DATE;
      }else{
        this.END_DATE = this.$moment(this.VALIDATE_END_OLD_DATE).format("YYYY-MM-DD");
        this.VALIDATE_END_DATE = this.VALIDATE_END_OLD_DATE;
      }
    },

    //사용자 검색
    userSearch(){
      this.mixin_showDialog("UserFind");
    },

    // 시작,종료 일자 check : 시작 일자가 종료 일자보다 앞서면 ALERT창으로 경고
    chkDate(){
      // 유효성 여부
      let isValid = true;
      if(!this.mixin_isEmpty(this.VALIDATE_START_DATE) && !this.mixin_isEmpty(this.VALIDATE_END_DATE)){
        // 시작 날짜가 크면(종료일보다 시작일이 이후 날짜)
        if(Number(this.VALIDATE_START_DATE) > Number(this.VALIDATE_END_DATE)){
          isValid = false;
          // 날짜 역전 알림
          this.showAlert(this.MESSAGE.ALERT.SELECT_DATE);
        }
      }else if(this.mixin_isEmpty(this.VALIDATE_START_DATE)){
        isValid = false;
        this.showAlert(this.MESSAGE.ALERT.CHK_BGNG_YMD);
      }
      return isValid;
    },

    //row 선택
    rowSelect(row) {
      this.selectedRow = row;
      this.EML_SNDNG_ID = this.selectedRow.EML_SNDNG_ID
    },

    showEmail() {

    }
  },

}
</script>

<style lang="scss" scoped>

</style>