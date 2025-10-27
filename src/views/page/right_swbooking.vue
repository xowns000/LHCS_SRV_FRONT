<template>
  <div>
    <!-- 캘린더 -->
    <div>
      <div class="align-center" style="display: grid; grid-template-columns: 1fr 2fr 1fr; justify-items: left;">
        <v-btn
          @click="setToday()"
          class="pl-btn is-sub">오늘</v-btn>
        <div class="d-flex align-center" style="justify-self: center;">
          <!-- arrow left 버튼 -->
          <compo-tooltip-btn
            TitleProp="이전 달"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon30 is-arrow-left"
            TooltipPositionProp="bottom"
            @btnClick="prevMonth()"
          ></compo-tooltip-btn>
          <div
            v-if="$refs.calendar"
            class="px-2"
            style="height: 24px;"
            >
            <strong style="font-size: 22px; line-height: 1;">{{ computedCalendarTitle }}</strong>
          </div>
          <!-- arrow right 버튼 -->
          <compo-tooltip-btn
            TitleProp="다음 달"
            ClassProp="pl-tooltip-btn ml-auto"
            IconProp="pl-icon30 is-arrow-right"
            TooltipPositionProp="bottom"
            @btnClick="nextMonth()"
          ></compo-tooltip-btn>
        </div>
        <div class="ml-auto">
          <compo-date-picker
            @dateChange="setDay"
            DateType="icon"
            :DateProp.sync="focus_cal"/>
        </div>
      </div>
      <div class="d-flex align-center">
        <compo-tooltip-btn
          TitleProp="이전 주"
          ClassProp="pl-tooltip-btn"
          IconProp="mdi mdi-chevron-left"
          TooltipPositionProp="bottom"
          @btnClick="prevWeek()"
        ></compo-tooltip-btn>
        <!-- v-calendar -->
        <v-calendar
          v-model="focus_cal"
          ref="calendar"
          class="pl-weekCalendar is-mt-s"
          :value="date"
          locale="ko-KR"
          color="primary"
          :type="calendar_type"
          @click:date="selectDay"
        >
        </v-calendar>
        <compo-tooltip-btn
          TitleProp="다음 주"
          ClassProp="pl-tooltip-btn"
          IconProp="mdi mdi-chevron-right"
          TooltipPositionProp="bottom"
          @btnClick="nextWeek()"
        ></compo-tooltip-btn>
      </div>
    </div>

    <!-- 검색 조건 -->
    <div class="pl-form-inline-wrap is-mt-l" >
      <div class="pl-form-inline">
        <div class="pl-desc">
          <div class="pl-desc" style="width: 250px">
            <v-select
              v-model="dropProgress"
              placeholder="선택하세요"
              class="pl-form"
              :items="mixin_common_code_get(this.list_common_code, 'RSVT_RS', '전체')"
              @change="getRsvtList()"
            ></v-select>
            <span class="pl-counter "><em class="pl-1 is-txt-blue">({{ RESERVE_LIST.length }})</em> 건</span>
          </div>
        </div>
      </div>
      <div class="pl-btn-wrap ml-auto">
        <div
          v-if="toggleSearch === true"
          v-click-outside="closeDropSearch"
          class="d-flex align-center"
          >
          <compo-tooltip-btn
            TitleProp="고객 찾기"
            ClassProp="pl-top-util"
            IconProp="pl-icon-util search"
            TooltipPositionProp="bottom"
            :DisabledProp="$store.getters['statusStore/GE_CUTT_ING']"
            @btnClick="getRsvtList()"
          ></compo-tooltip-btn>
          <v-text-field
            ref="searchCusname"
            v-model="SCH_CUST"
            clearable
            class="pl-form is-search ml-1"
            clear-icon="pl-icon-text-close"
            placeholder="이름 또는 전화번호"
            @keydown.enter="getRsvtList()"
          ></v-text-field>
        </div>
        <compo-tooltip-btn
          v-else
          TitleProp="고객 찾기"
          ClassProp="pl-top-util"
          IconProp="pl-icon-util search"
          TooltipPositionProp="bottom"
          @btnClick="toggleTopSearch()"
        ></compo-tooltip-btn>
        <!-- 상세 필터 버튼 -->
        <compo-tooltip-btn
          TitleProp="상세 필터"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 filter"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('상세 필터')"
        ></compo-tooltip-btn>
        <!-- 새로고침 버튼 -->
        <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          @btnClick="[SCH_CUST='',dropProgress='',getRsvtList()]"
        ></compo-tooltip-btn>
      </div>
    </div>
    <!-- list -->
    <div class="pl-campaign-list type-2 is-mt-m" style="height: calc(100vh - 385px)">
      <ul>
        <template
          v-if="RESERVE_LIST.length == 0"
          >
          <div class="pl-list-nodata">
            <span>등록된 데이터가 없습니다.</span>
          </div>
        </template>
        <template 
          v-else
          v-for="data, index in RESERVE_LIST"
          >
          <li>
            <div 
              style="cursor:pointer;"
              @click="[detailModal = true,getRsvtAllDtl(index)]"
              >
              <div class="pl-campaign-list-unit">
                <v-icon class="pl-icon20 calendar-date mr-1"></v-icon>
                <strong class="">{{data.NEW_RSVT_DT}}</strong>
                <span :class="`ml-1 pl-round-chip is-sm ${ mixin_displayStatus(data.RSVT_STTS_CD, `statList`) }`">{{ data.RSVT_STTS_NM }}</span>
              </div>
              <div class="pl-campaign-list-unit">
                <v-icon class="pl-icon20 calendar-my-view mr-1"></v-icon>
                <span >{{ data.CUST_NM }}({{data.CUST_PHN_NO}})</span>
                <span>
                  <span class="is-txt-bull ml-1">•</span>
                  {{ data.DRWI_SE_NM }}
                </span>
                <span>
                  <span class="is-txt-bull ml-1">•</span>
                  결제정보 ({{ data.STLM_YN == 'Y' ? '있음' : '없음' }})
                </span>
              </div>
            </div>
            <!-- 전화 걸기 버튼 -->
            <div class="pl-campaign-list-btn" style="top: 18px">
              <v-btn
                fab
                class="ml-auto"
                :color="data.RSVT_STTS_CD == 'CMPL' ? '#FFA500' : '#08BC2F'"
                elevation="0"
                width="40"
                height="40"
                @click="callDialog(data,'video')"
              >
                <v-icon
                  class="pl-icon20 call-video"
                ></v-icon>
              </v-btn>
              <v-icon
                :class="`pl-icon30 ${data.RSVT_STTS_CD == 'CMPL' ? 'call-complate' : 'call'} ml-1`"
                @click="callDialog(data,'call')"
              ></v-icon>
            </div>
          </li>
        </template>
      </ul>
    </div>
    <!-- detail modal -->
    <v-slide-x-reverse-transition>
      <RightSwbookingDetail v-if="detailModal"
        @close="detailModal = false"
        :BookInfo="BOOK_INFO"
        :BookingDtlProps="BOOKING_DTL"
        :AnalysisListProps="ANALYSIS_LIST"
        :InterviewListProps="INTERVIEW_LIST"
        :RecommandListProps="RECOMMAND_LIST"
        :HealthWorryListProps="HEALTH_WORRY_LIST"
        :RsvtChangeListProps="RSVT_CHANGE_LIST"
        :CuttCnListProps="CUTT_CN_LIST"
        :RsvtAltmntChangeLogProps="RSVT_ALTMNT_CHANGE_LOG"
      ></RightSwbookingDetail>
    </v-slide-x-reverse-transition>

  </div>
</template>

<script>
import RightSwbookingDetail from './right_swbooking_detail.vue';

  export default {
    name: 'right_swbooking',
    components: {
      RightSwbookingDetail,
    },
    data() {
      return{
        //공통코드 설정
        list_common_code : [],
        common_code : [],

        // calendar
        focus_cal: '',
        date: '',
        calendar_type: 'week',

        // 검색
        toggleSearch: false,

        // list
        RESERVE_LIST: [],
        statList: [
          { name: '예약', code:'RSVT', value: 'chat-stat-cs' },
          { name: '상담대기', code:'WAIT', value: 'chat-stat-cs' },
          { name: '상담완료', code:'CMPL', value: 'chat-stat-done' },
          { name: '예약취소', code:'CANCEL', value: 'chat-stat-wait' },
          { name: '예약파기', code:'DESTRUCT', value: 'chat-stat-after' },
          { name: '상담거부', code:'REJECT', value: 'chat-stat-error' },
        ],

        // detail
        detailModal: false,

        SCH_CUST:'',

        BOOKING_ID : "",
        ANALYSIS_ID : "",

        BOOKING_DTL:{},
        ANALYSIS_LIST:[],
        INTERVIEW_LIST:[],
        RECOMMAND_LIST:[],
        HEALTH_WORRY_LIST:[],
        RSVT_CHANGE_LIST:[],
        CUTT_CN_LIST: [
          {
            USER_NM: '나상담',
            MDFCN_DT: '2024-06-01 13:50',
            CN: '세계를 향한 대화, 유니코드로 하십시오. 제10회 유니코드 국제 회의가 1997년 3월 10일부터 12일까지 독일의 마인즈에서 열립니다. 지금 등록하십시오. 이 회의에서는 업계 전반의 전문가들이 함께 모여 다음과 같은 분야를 다룹니다. - 인터넷과 유니코드, 국제화와 지역화, 운영 체제와 응용 프로그램에서 유니코드의 구현, 글꼴, 문자 배열, 다국어 컴퓨팅.',
            expand: false,
          },
          {
            USER_NM: '나상담',
            MDFCN_DT: '2024-06-01 15:50',
            CN: '2',
            expand: false,
          },
        ],

        BOOK_INFO:{},
        RSVT_ALTMNT_CHANGE_LOG:[],

        dropProgress:'',
        
        //전화걸기
        OUT_CALL_DATA: {
          CL_TYPE_CD: 'OUT',
          dropItems: [],
          dropItems2: [],
          CUST_PHN_NO: '',
          RSVY_ID: '',
          MODIFY_USE: false,
        },

        MESSAGE : {
          ALERT : {
            SOCKET_ERROR : {alertDialogToggle: true, msg: 'CTI에 로그인이 되어 있지 않습니다.', iconClass: 'is-caution', type: 'default'}
          },
          ERROR : {
            ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
          }
        },
      }
    },
    watch: {
      focus_cal(){
        this.SCH_CUST = '';
        this.getRsvtList(); 
      }
    },

    computed: {
      computedCalendarTitle() {
        const title = this.$refs.calendar.title;
        
        let newTitle = '';
        let focusCalendar = this.focus_cal ? this.focus_cal : this.date;
        newTitle = focusCalendar.substr(0,4) + "년 " + parseInt(focusCalendar.substr(5,2)) + "월";
        // const arrTitle = title.split(' ');
        // const titLen = arrTitle.length;
        // if(titLen == 2) {
        //   //6월 2024
        //   newTitle = arrTitle[1] + "년 " + arrTitle[0];
        // } else if(titLen == 4) {
        //   //9월 - 10월 2024
        //   newTitle = arrTitle[3] + "년 " + arrTitle[0] + " " + arrTitle[1] + " " + arrTitle[2];
        // } else if(titLen == 5) {
        //   //12월 2024 - 1월 2025
        //   newTitle = arrTitle[1] + "년 " + arrTitle[0] + " " + arrTitle[2] + " " + arrTitle[4] + "년 " + arrTitle[3];
        // }

        return newTitle;
      },
    },

    beforeDestroy(){
    },

    async created() {
      //공통코드설정
      let codeName = ['RSVT_RS','CUTT_HIST_SRCH'];
      this.list_common_code = await this.mixin_common_code_get_all(codeName);
      
      this.getServerDate();
      // this.getRsvtList();
      this.focus_cal = this.date
    },

    mounted() {
    },
    methods: {
      // calendar
      selectDay(event){
        // 클릭된 날짜의 요소를 가져옴
        const calendarElement = this.$refs.calendar.$el;
        const dayElements = calendarElement.querySelectorAll('.v-calendar-daily_head-day');

        // 모든 날짜 요소에서 클래스 제거
        dayElements.forEach(element => {
          element.classList.remove('selected-day');
        });

        // 이벤트 객체의 날짜 정보
        const eventDate = new Date(event.date);
        const year = eventDate.getFullYear();
        const month = eventDate.getMonth();
        const day = eventDate.getDate();

        // 날짜 정보와 일치하는 DOM 요소에 클래스 추가
        dayElements.forEach(element => {
          const label = element.querySelector('.v-btn__content');
          if (label) {
            const elementDay = parseInt(label.textContent.replace('일', ''), 10);
            const elementDate = new Date(year, month, elementDay);

            if (
              elementDate.getFullYear() === year &&
              elementDate.getMonth() === month &&
              elementDate.getDate() === day
            ) {
              element.classList.add('selected-day');
            }
          }
        });
      },
      // 검색
      closeDropSearch(){
        this.toggleSearch = false
      },
      toggleTopSearch(){
        this.toggleSearch = true;
        this.$nextTick(() => {
          this.$refs.searchCusname.focus();
        })
      },
      // calendar
      setToday () {
        this.focus_cal = this.date;
      },
      setDay(date) {
        this.focus_cal = date;
      },
      prevMonth() {
        const currentDate = this.focus_cal == '' ? this.$refs.calendar.start : this.focus_cal;
        let currentDateObj = this.parseDateString(currentDate);
        currentDateObj.setMonth(currentDateObj.getMonth() - 1);
        let date = this.getFirstDate(currentDateObj);
        this.focus_cal = date;
      },
      nextMonth() {
        const currentDate = this.focus_cal == '' ? this.$refs.calendar.start : this.focus_cal;
        let currentDateObj = this.parseDateString(currentDate);
        currentDateObj.setMonth(currentDateObj.getMonth() + 1);
        let date = this.getFirstDate(currentDateObj);
        this.focus_cal = date;
      },
      prevWeek() {
        this.$refs.calendar.prev();
      },
      nextWeek() {
        this.$refs.calendar.next()
      },
      // 서버 시간 가져오기
      async getServerDate() {
        await this.mixin_getSvrDate("YYYYMMDDHH24MISS").then((data) => {
          let cvDate = this.mixin_convertDate(data, 'yyyy-MM-dd HH:mm:ss')
          this.date = cvDate;
          this.setDay(cvDate);
          this.selectDay({date : cvDate.substring(0, 10)});
        })
      },

      async getRsvtList(){
        let schDate = '';
        let nowDate = '';
        if(this.date){
          nowDate = this.date
          schDate = this.focus_cal ? this.focus_cal.replaceAll('-','').substr(0, 8) : nowDate.replaceAll('-','').replaceAll(':','').replaceAll(' ','').substr(0, 8)
        } else {
          nowDate = await this.mixin_getSvrDate("YYYYMMDDHH24MISS")
          schDate = this.focus_cal ? this.focus_cal.replaceAll('-','').substr(0, 8) : nowDate.substr(0, 8)
        }
        this.RESERVE_LIST = [];
        
        let sUrl = '/api/rsvt/getRsvtList';
        let postParam = {
          RSVT_STTS: this.dropProgress
          , SCH_ST_DT : schDate
          , SCH_END_DT : schDate
          , SCH_KEY : this.toggleSearch && this.SCH_CUST ? 'CUST' : 'USER_ID'
          , SCH_KEYWORD : this.toggleSearch && this.SCH_CUST ? this.SCH_CUST : this.$store.getters['userStore/GE_USER_ROLE'].userId
          , PERSONAL : this.$store.getters['userStore/GE_USER_ROLE'].userId
        }

        let headParam = {
          head : {
          }
        }

        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          console.log("response.DATA",response.DATA);
          //데이터 가공 영역
          response.DATA.forEach((data, idx) => {
            data.NEW_CUTT_BGNG_DT = this.mixin_convertDate(data.CUTT_BGNG_DT, 'yyyy-MM-dd HH:mm:ss');
            data.NEW_CUTT_END_DT = this.mixin_convertDate(data.CUTT_END_DT, 'yyyy-MM-dd HH:mm:ss');
            data.PHN_HR = (data.PHN_HR?this.mixin_seconds_toHHMMSS(data.PHN_HR):'');
            data.CUST_PHN_NO = this.mixin_setPhoneNo(data.CUST_PHN_NO.replace(/[^0-9]/g, ""));
            data.NEW_RSVT_DT = this.mixin_convertDate(data.RSVT_DT, 'yyyy-MM-dd HH:mm:ss');
            data.NEW_ALTMNT_DT = this.mixin_convertDate(data.ALTMNT_DT, 'yyyy-MM-dd HH:mm:ss');
          });

          this.RESERVE_LIST = response.DATA
        }
      },

      chgCal(e){
        console.log("e", e);
      },

      getRsvtAllDtl(index){
        this.BOOK_INFO=this.RESERVE_LIST[index];
        this.getRsvtDtl("selectBook");
        this.getRsvtDtl("selectAnalysisDtl");
        this.getRsvtCnList()
        this.getRsvtDtl("selectInterview");
        this.getRsvtDtl("selectRecommand");
        this.getRsvtDtl("selectHealthWorry");
        this.getRsvtDtl("selectRsvtChangeList");
        this.getRsvtAltmntChgLog()
        // this.getRsvtDtl("selectCuttCn");
      },

      async getRsvtDtl(api){
        let sUrl = '/api/rsvt/getRsvtDtl';
        let postParam = {
          API_URL : api
          , BOOKING_ID : this.BOOK_INFO.SW_RSVT_ID
          , ANALYSIS_ID : this.BOOK_INFO.SW_ANLS_ID
        }

        let headParam = {
          head : {
          }
        }

        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          switch (api){
            case "selectBook" :
              this.BOOKING_DTL = response.DATA[0];
              break;
            case "selectAnalysisDtl" :
              this.ANALYSIS_LIST = response.DATA;
              break;
            case "selectInterview" :
              this.INTERVIEW_LIST = response.DATA;
              break;
            case "selectRecommand" :
              this.RECOMMAND_LIST = response.DATA;
              break;
            case "selectHealthWorry" :
              this.HEALTH_WORRY_LIST = response.DATA;
              break;
            case "selectRsvtChangeList" :
              this.RSVT_CHANGE_LIST = response.DATA;
              break;
            // case "selectCuttCn" :
            //   this.CUTT_CN_LIST = response.DATA;
            //   break;
          }
        }
      },

      async getRsvtCnList(){
        let sUrl = '/api/rsvt/getRsvtCnList';
        let postParam = {
          RSVT_ID : this.BOOK_INFO.RSVT_ID
        }

        let headParam = {
          head : {
          }
        }

        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          for(let i=0;i<response.DATA.length;i++){
            response.DATA[i]["expand"] = false;
          }
          this.CUTT_CN_LIST = response.DATA;
        }
      },

      callDialog(item,type) {
        if(type == 'call'){
          if(this.$socket){
            this.mixin_set_active_tab({PATH_NM:'/CSL_M0100', NODE_TITLE:'전화상담'});
            this.OUT_CALL_DATA.CUST_PHN_NO = this.mixin_setPhoneNo(item.CUST_PHN_NO.replace(/[^0-9]/g, ""));
            this.OUT_CALL_DATA.CUST_ID = item.CUST_ID;
            this.OUT_CALL_DATA.RSVT_ID = item.RSVT_ID;
            this.OUT_CALL_DATA.MODIFY_USE = false;

            this.$eventBus.$emit('dialogOutCall', this.OUT_CALL_DATA); //top 전화걸기 호출
          }else{
            this.showAlert(this.MESSAGE.ALERT.SOCKET_ERROR);
            return;
          }
        } else {
          if(this.$store.getters['commonStore/GE_COMMON_ACTIVE_TAB'].id == 'CSL_M0100'){
            //이미 전화상담 탭이 열려있다면
            //바로 영상통화팝업 오픈
            this.$eventBus.$emit('rsvtVideoCall', item)
          } else {
            //전화상담탭이 있는지 확인
            let m0100 = false;
            for(let i=0;i<this.$store.getters['commonStore/GE_COMMON_TAB'].length;i++){
              if(this.$store.getters['commonStore/GE_COMMON_TAB'][i].id == 'CSL_M0100'){
                m0100 = true;
                break;
              }
            }
            this.mixin_set_active_tab({PATH_NM:'/CSL_M0100', NODE_TITLE:'전화상담'});
            console.log("m0100", m0100);
            if(m0100){
              //전화상담탭이 탭 리스트에 있다면
              setTimeout(() => {
                // let findCust = {
                //   CUST_ID : item.CUST_ID
                //   , CUST_NM : item.CUST_NM
                //   , CUST_PHN_NO : item.CUST_PHN_NO
                // }
                // this.$emit("findData", findCust);
                this.$eventBus.$emit('rsvtVideoCall', item)
              }, 3 * 100); // 5밀리초
            } else {
              //전화상담탭이 열려있지 않다면
              setTimeout(() => {
                // let findCust = {
                //   CUST_ID : item.CUST_ID
                //   , CUST_NM : item.CUST_NM
                //   , CUST_PHN_NO : item.CUST_PHN_NO
                // }
                // this.$emit("findData", findCust);
                this.$eventBus.$emit('rsvtVideoCall', item)
              }, 8 * 100); // 5밀리초
            }
          }
        }

      },

      getFirstDate(date) {
        date.setDate(1);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1 and pad with 0 if necessary
        const day = String(date.getDate()).padStart(2, '0'); // Pad the day with 0 if necessary

        // Combine them into the desired format
        return `${year}-${month}-${day}`;
      },

      parseDateString(dateString) {
        const parts = dateString.split('-');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);

        return new Date(year, month, day);
      },

      //예약배정변경이력 조회
      async getRsvtAltmntChgLog(){
        let sUrl = '/api/rsvt/getRsvtAltmntChgLog';
        let postParam = {
          RSVT_ID : this.BOOK_INFO.RSVT_ID
        }

        let headParam = {
          head : {
          }
        }

        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          this.RSVT_ALTMNT_CHANGE_LOG = response.DATA;
        }
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>