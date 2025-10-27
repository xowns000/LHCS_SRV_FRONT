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
    <!-- 시간 선택 -->
    <div class="is-mt-m is-border-all pa-4 is-bg-light rounded-lg"
      style="display:grid; gap: 8px; grid-template-columns: repeat(8,1fr);"
      >
      <template v-for="time, index in time_list" >

        <v-btn
          :key="time.index"
          @click="[time.active = !time.active, getVstrList(index)]"
          :disabled="time.disable"
          :class="[
            time.disable ? 'is-txt-disable text-decoration-line-through' : 'is-txt-black',
            time.active ? 'is-bg-main is-txt-white' : '' ]"
          class="font-weight-regular pl-btn is-sub is-round is-trans">{{ time.time }}</v-btn>
        <!-- <span
          class="pl-round-chip is-sm "
          :class="time.disable ? 'is-txt-disable text-decoration-line-through' : 'is-txt-black'"
          style="letter-spacing: 0;"
          :key="index">{{ time.time }}

        </span> -->

      </template>
    </div>

    <!-- 검색 조건 -->
    <div class="pl-form-inline-wrap is-mt-l" >
      <div class="pl-form-inline">
        <div class="pl-desc">
          <div class="pl-desc" style="width: 250px">
            <v-btn-toggle v-model="filterGroup" class="pl-btn-group" mandatory>
              <v-btn v-for="item in btnGroup"
                :key="item.id"
                class="pl-btn"
                @click="getCoList(item.value)"
              >
                {{ item.text }}
              </v-btn>
            </v-btn-toggle>
            <span class="pl-counter "><em class="pl-1 is-txt-blue">({{ ASSIGN_LIST.length }})</em> 건</span>
          </div>
        </div>
      </div>
      <div class="pl-btn-wrap ml-auto">

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
          @btnClick="[getVstrList(TIME_INDEX), $emit('selectedVstData', null)]"
        ></compo-tooltip-btn>
      </div>
    </div>
    <!-- list -->
    <div class="pl-campaign-list type-2 is-mt-m" style="height: calc(100vh - 385px)">
      <ul>
        <template
          v-if="ASSIGN_LIST.length == 0"
          >
          <div class="pl-list-nodata">
            <span>등록된 데이터가 없습니다.</span>
          </div>
        </template>
        <template
          v-else
          v-for="item, index in ASSIGN_LIST"
          >
          <li style="display: grid; grid-template-columns: 60px 120px 1fr 60px;">
            <!-- img -->
            <div class="pl-portait-img">
              <img
                :src="item.img"
                :alt="item.name"
                @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}"
              >
            </div>
            <div class="">
              <div class="">
                <strong class="">{{ item.name }}</strong>
                <div class="is-txt-sub">{{ item.center }}</div>
              </div>

            </div>
            <div class="d-flex align-center" style="gap: 4px">
              <template v-for="(time, index) in item.time" >
                <v-tooltip content-class="pl-tooltip " bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      :key="index"
                      @click="setVstData(item, time, index)"
                      :class="`font-weight-regular pl-btn is-sub is-round ${time.active ? 'is-active' : ''}`">{{ time.time }}</v-btn>
                  </template>
                  <span>선택</span>
                </v-tooltip>
              </template>
            </div>
             <!-- 카운트 -->
            <div class="d-flex align-center" v-if="item.assign_cnt > 0">
              <div class="is-bg-green rounded-lg px-2 py-1 align-center" style="top: 18px">
                <v-icon class="pl-icon20 timer"></v-icon>
                <span class="is-txt-white pl-2 ">{{ item.assign_cnt }}</span>
              </div>
            </div>
          </li>
        </template>
      </ul>
    </div>

    <!-- 사유 dialog-->
    <v-dialog
      v-model="dialogCommonReason"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :header-title="dialogTitl"
        @hide="[mixin_hideDialog('CommonReason'), vstVstrRdyProc('DEL')]"
      >
        <template slot="search">
        </template>
        <template slot="body">
          <div>
            <v-radio-group v-model="STTS_DTL_CD">
              <v-radio
                v-for="(code, idx) in REASON_TP_LIST"
                :key="REASON_TP_LIST[idx].text"
                :label="code.text"
                :value="code.value"
                class="pl-radio"
              >
              </v-radio>
              <div class="pl-desc">
                <v-textarea
                  :disabled="STTS_DTL_CD.indexOf('_ETC') === -1"
                  v-model="CN"
                  class="pl-form is-noresize"
                  :spellcheck="false"
                />
              </div>
            </v-radio-group>
          </div>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="[mixin_hideDialog('CommonReason'), vstVstrRdyProc('DEL')]">닫기</v-btn>
          <v-btn class="pl-btn" @click="vstRsvtProc">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

  </div>
</template>

<script>
  export default {
    name: 'right_carrierbooking',
    props: {
      INFO: {
        type: Object
      },
    },
    data() {
      return{
        list_common_code : [],
        VST_RSVT_IDX : -1,
        VSTR_ID : -1,
        SEL_TIME : '',
        // calendar
        focus_cal: '',
        date: '',
        calendar_type: 'week',

        // 검색
        filterGroup: 0, //초기 selected 값
        btnGroup: [
          { text: '자사', value: 'CT_OWN_CO' },
          { text: '협력사', value: 'CT_CPRTV_CO' },
          { text: '전체', value: '' },
        ],

        TIME_INDEX : -1,

        // list
        ASSIGN_LIST: [],
        time_list: [
          { time: '09:00', active: false, disable: false },
          { time: '11:00', active: false, disable: true },
          { time: '13:00', active: false, disable: true },
          { time: '15:00', active: false, disable: true },
          { time: '17:00', active: false, disable: false },
          { time: '19:00', active: false, disable: false },
        ],

        CO_SE_CD : 'CT_OWN_CO', //회사 구분(자사, 협력사)
        // detail
        detailModal: false,

        dialogTitl:'변경 사유',
        dialogCommonReason: false,
        STTS_DTL_CD:'CHG_ABSC',
        CN:'',
        REASON_TP_LIST: [],
      }
    },
    watch: {
      // focus_cal(){
      //   console.log(this.focus_cal);
      //   if(this.focus_cal.replace(/[^0-9]/g, '').length === 8) this.getDayRsvtTime(); //일자별 예약 시간 조회
      // }
    },

    computed: {
      computedCalendarTitle() {
        const title = this.$refs.calendar.title;

        let newTitle = '';
        let focusCalendar = this.focus_cal ? this.focus_cal : this.date;
        newTitle = focusCalendar.substr(0,4) + "년 " + parseInt(focusCalendar.substr(5,2)) + "월";
        return newTitle;
      },
    },

    beforeDestroy(){
      this.$eventBus.$off("initRsvt");
    },

    async created() {
      //공통코드설정
      let codeName = ['VRS_ALTMNT', 'VRS_RTRCN', 'VRS_REVST'];
      this.list_common_code = await this.mixin_common_code_get_all(codeName);

      this.$eventBus.$on("initRsvt", (e) => {
        this.inItRsvt();
      });
    },

    mounted() {
      this.inItRsvt();
    },

    methods: {
      //초기화
      inItRsvt(){
        this.CO_SE_CD = 'CT_OWN_CO';
        this.filterGroup = 0;
        this.getServerDate();
      },
      //일자별 예약 시간 조회
      async getDayRsvtTime() {
        this.time_list = [];
        this.ASSIGN_LIST = [];

        let sUrl = '/api/vst/vstDayTimeList';
        let postParam = {
          AUTHRT_GROUP_ID : '7'//엔지니어 그룹 코드
          , DAY : this.focus_cal.replace(/[^0-9]/g, '').substring(0,8)
        }

        let headParam = {head : {}}

        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          response.DATA.forEach((data, idx) => {
            let setDisabled = false;
            if(data.RSVT_BGNG_DT < this.date.replace(/[^0-9]/g, '')){
              setDisabled = true;
            }else{
              if(data.VST_CNT >= data.USER_CNT) setDisabled = true;
              else setDisabled = false;
            }

            this.time_list.push({time : data.RSVT_ST_DT, active: false, disable: setDisabled});
          });
        }
      },

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

        this.getDayRsvtTime();
      },
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
          // this.getDayRsvtTime(); //일자별 예약 시간 조회
        })
      },

      getCoList(val) {
        this.CO_SE_CD = val;
        this.getVstrList(this.TIME_INDEX);
      },

      //시간선택별 방문자 목록
      async getVstrList(index) {
        this.TIME_INDEX = index;        
        let selCnt = 0;
        this.time_list.forEach((time, idx) => {
          if(time.active) selCnt++;
        });

        if(selCnt > 3){
          this.showAlert({alertDialogToggle: true, msg: '시간은 3개까지만 선택 가능 합니다.', iconClass: 'is-info', type: 'default'});
          this.time_list[index].active = false;
        }else if(selCnt === 0){
          this.ASSIGN_LIST = [];
        }else{
          let arrSelTime = [];
          this.time_list.forEach((time, idx) => {
            if(time.active) arrSelTime.push((this.focus_cal.replace(/[^0-9]/g, '').substring(0,8)+time.time).replace(/[^0-9]/g, '')+'00');
          });

          this.ASSIGN_LIST = [];
          let sUrl = '/api/vst/vstDayTimeVstrList';
          let postParam = {
            AUTHRT_GROUP_ID : '7'//엔지니어 그룹 코드
            , ZIP : this.INFO.ZIP
            , CUST_ID : this.INFO.CUST_ID
            , DAY : this.focus_cal.replace(/[^0-9]/g, '').substring(0,8)
            , CO_SE_CD : this.CO_SE_CD
            , TIME_LIST : JSON.stringify(arrSelTime)
            , SRVC_TYPE_CD : this.INFO.SRVC_TYPE_CD
          }

          let headParam = {
            head : {
            }
          }

          let response  = await this.common_postCall(sUrl, postParam, headParam);

          if (!response.HEADER.ERROR_FLAG){
            response.DATA.forEach((data, idx) => {
              if(data.TIME_LIST){
                let arrTimeList = [];
                data.TIME_LIST.split(',').forEach((time, seq) => {
                  arrTimeList.push({time : time, active: false});
                });

                this.ASSIGN_LIST.push({
                  img : (data.ICON !=='f04'?'/upload/' + data.ICON_IMG_URI:require('@/assets/img/@profile_user.png'))//사용자 이미지
                  , VSTR_ID : data.USER_ID
                  , name : data.USER_NM
                  , center : data.DEPT_NM
                  , assign_cnt : data.RSVT_CNT
                  , time : arrTimeList
                });
              }
            });
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

      async vstVstrRdyProc(stat){
        let sUrl = '/api/vst/vstVstrRdyProc';
        let postParam = {
          STAT : stat
        }

        let response  = await this.common_postCall(sUrl, postParam, {head:{}});
      },

      //방문자 선택 데이터 전달
      async setVstData(item, selTime, idx){
        this.VSTR_ID = item.VSTR_ID;
        let timeSetYn = false;
        this.ASSIGN_LIST.forEach((assign, idx) => {
          assign.time.forEach((time, seq) => {
            if(item.VSTR_ID === assign.VSTR_ID){
              if(time.time === selTime.time){
                time.active = !time.active;
                if(time.active) timeSetYn = true;
              }else{
                time.active = false;
              } 
            }else{
              time.active = false;
            }
          });
        });

        this.SEL_TIME = (this.focus_cal.substring(0, 10) + ' ' + item.time[idx].time).replace(/[^0-9]/g, '') + '00';

        let sUrl = timeSetYn?'/api/vst/vstVstrRdyStatChk':'/api/vst/vstVstrRdyProc';
        let postParam = {
          VSTR_ID : this.VSTR_ID
          , RSVT_BGNG_DT : this.SEL_TIME
        }

        if(!timeSetYn) postParam.STAT = 'DEL';

        let headParam = {
          head : {
          }
        }

        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          if(response.DATA[0].PSBLTY_STAT === 'Y'){            
            if(timeSetYn){
              let setTime = this.focus_cal.substring(0, 10) + ' ' + item.time[idx].time;
              if(this.INFO.VST_RSVT_ID){
                this.showAlert({
                  alertDialogToggle: true
                  , msg: '예약 일시를 변경 하시겠습니까?'
                  , iconClass: 'is-info'
                  , type: 'confirm'
                  , callYes: () => {
                    this.$store.commit("alertStore/hideAlert");
                    this.dialogTitl = '변경 사유';
                    this.REASON_TP_LIST = this.mixin_common_code_get(this.list_common_code, 'VRS_ALTMNT');
                    this.dialogCommonReason = true;
                  }
                  , callNo: () => {
                    this.vstVstrRdyProc('DEL');
                    this.$store.commit("alertStore/hideAlert");
                  }
                });
              }else{
                item.setTime = setTime;
                this.$emit('selectedVstData', item);
              }
            }else{
              this.$emit('selectedVstData', null);
            }
          }else{
            this.showAlert({alertDialogToggle: true, msg: '다른 상담원이 해당 기사를 배정 진행 중입니다.', iconClass: 'is-info', type: 'default'});
            this.getVstrList(this.TIME_INDEX);
            this.$emit('selectedVstData', null);
            return;
          }
        }
      },

      async vstRsvtProc() {
        if(!this.STTS_DTL_CD){
          this.showAlert({alertDialogToggle: true, msg: '사유를 선택해 주세요.', iconClass: 'is-info', type: 'default'});
          return;
        }else{
          if(this.STTS_DTL_CD.indexOf('_ETC') > -1 && !this.CN){
            this.showAlert({alertDialogToggle: true, msg: '사유를 입력해 주세요.', iconClass: 'is-info', type: 'default'});
            return;
          }
        }

        let sUrl = '/api/vst/vstRsvtProc';
        let postParam = this.INFO;

        postParam.VSTR_ID = this.VSTR_ID;
        postParam.RSVT_BGNG_DT = this.SEL_TIME.replace(/[^0-9]/g, '').substring(0, 12) + '00';

        //SMS 전송용 Param
        postParam.callback_number = this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO.split(',')[0];

        if(this.STTS_DTL_CD) postParam.STTS_DTL_CD = this.STTS_DTL_CD;
        if(this.CN) postParam.CN = this.CN;

        let headParam = {
          head : {
          }
        }

        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          this.showAlert({alertDialogToggle: true, msg: this.mixin_convertDate(postParam.RSVT_BGNG_DT, 'yyyy-MM-dd HH:mm:ss')+'으로 예약이 변경 되었습니다.', iconClass: 'is-info', type: 'default'});
          this.$eventBus.$emit('closeAssignManager');
        }
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>