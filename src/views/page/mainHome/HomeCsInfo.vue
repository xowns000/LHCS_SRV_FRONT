<template>
  <div>
    <div class="pl-card-top">
      <div class="pl-home-cs-my">
        <div class="align-self-start pl-portrait">
          <img :src="USER_PROFILE.CUSL_ID ? (USER_PROFILE.img ? USER_PROFILE.img : require('@/assets/img/@profile_user.png')) : require('@/assets/img/@profile_user.png')"
               :alt="USER_PROFILE.CUSL_ID ? USER_PROFILE.USER_NM : '성명미상'"
               @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}"/>
        </div>
        <div class="ml-4">
          <strong class="pl-card-top-title" v-if="USER_PROFILE.CUSL_ID">
            {{ USER_PROFILE.USER_NM }}(내선 {{ USER_PROFILE.EXT_NO }})
          </strong>
          <strong class="pl-card-top-title" v-else>
            성명미상
          </strong>
          <template v-if="LOCATION_INFO === 'home'">
            <div>
              {{ USER_PROFILE.DEPT_NM}}
            </div>
            <div>
              {{ USER_PROFILE.JBTTL }}
            </div>
          </template>
          <template v-else>
            <template v-if="USER_PROFILE.CUSL_ID">
            <div :class="`is-txt-${displayStatus(USER_PROFILE, '')}`">
              {{ displayStatus(USER_PROFILE, 'statNm') }}
            </div>
            <div>
              {{ USER_PROFILE.CO_NM }} {{ USER_PROFILE.role }}
            </div>
            </template>
            <template v-else>
              <div></div>
              <div></div>
            </template>
          </template>
        </div>
      </div>
      <template v-if="LOCATION_INFO === 'home'">
        <div class="pl-home-cs-info">
          <div>
            <v-icon class="pl-icon20 place-msg"></v-icon>
              {{ USER_PROFILE.OFC_ADDR }}</div>
          <div>
            <v-icon class="pl-icon20 email"></v-icon>
              {{ USER_PROFILE.EMAIL }}</div>
          <div>
            <v-icon class="pl-icon20 phone"></v-icon>
              {{ mixin_setPhoneNo(USER_PROFILE.PHN_NO.replace(/[^0-9]/g, "")) }} </div>
        </div>
    </template>
    </div>
    <div class="pl-card " :class="LOCATION_INFO === 'home'?'':'is-noborder'">
      <div class="pl-home-cs-today">
        <div class="pl-subtit">오늘의 상담 현황
          <div class="pl-btn-wrap ml-auto align-self-start">
            <!-- 새로고침 버튼 -->
            <compo-tooltip-btn
              TitleProp="새로고침"
              ClassProp="pl-tooltip-btn ml-auto"
              IconProp="pl-icon20 refresh"
              TooltipPositionProp="bottom"
              @btnClick="[todayCuslStat(),snsInfoSrch()]"
            ></compo-tooltip-btn>
            <!-- 나의 상담이력관리 버튼 -->
            <compo-tooltip-btn
              TitleProp="나의 상담이력 관리 바로가기"
              ClassProp="pl-tooltip-btn ml-auto"
              IconProp="pl-icon20 plus"
              TooltipPositionProp="bottom"
              @btnClick="mixin_set_active_tab({PATH_NM:'/CSL_M0307', NODE_TITLE:'나의 상담이력 관리', FULL_PATH: '통계 > 전화상담 통계 > 전화상담종합 통계', MENU_EXPLN: '상담사 본인의 전화, SNS 상담 이력을 검색하고 조회할 수 있습니다.'});"
            ></compo-tooltip-btn>
          </div>
        </div>
        <div class="pl-subdesc mt-0"><strong>기준일자 :</strong> {{ TODAY_MONITOR.base_date }}

        </div>
        <div class="pl-home-cs-today-list-wrap">
          <div v-for="item in TODAY_MONITOR.list" :key="item.id">
            <div class="pl-home-cs-today-list-title">
              <span class="pl-home-cs-today-list-title-subject">
                <strong>{{ item.subject }}</strong>
                <span v-if="item.cs_time" class="ml-1">(상담시간 {{ item.cs_time }})</span>
              </span>
              <span class="pl-home-cs-today-list-title-count">
                <strong>{{ item.call_count }}</strong>
                <span v-if="item.type === 'sns'">건</span>
                <span v-else>콜</span>
              </span>
            </div>
            <div class="pl-home-cs-today-list-status">
              {{ item.status_title }}
              <div>
                <v-icon :class="`pl-icon20 updown-${ item.updown}`"></v-icon>
                <strong>{{ item.dd_amt }} <sub>%</sub></strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pl-home-cs-weekly " :class="LOCATION_INFO === 'home'? 'is-mt-l':'is-mt-m'">
        <div class="pl-subtit">주간 상담 현황
          <!-- 새로고침 버튼 -->
          <compo-tooltip-btn
            TitleProp="새로고침"
            ClassProp="pl-tooltip-btn ml-auto"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="weekCuslStat"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-subdesc mt-0"><strong>기준일자 :</strong> {{ WEEKLY_MONITOR.base_date }}

        </div>
        <div class="pl-home-cs-weekly-list-wrap">
          <div>
            <strong>주간 콜 현황</strong>
            <span class="pl-home-cs-weekly-list-unit">
              <span class="pl-home-cs-weekly-list-unit-title">나의 콜</span>
              <div class="pl-monitor-progress">
                <div class="pl-monitor-progress-bar type-3" :style="`width: ${ WEEKLY_MONITOR.week_per }%`"></div>
              </div>
              <strong class="ml-auto">{{ WEEKLY_MONITOR.week_call }} 콜</strong>
            </span>
            <span class="pl-home-cs-weekly-list-unit">
              <span class="pl-home-cs-weekly-list-unit-title">전체 평균</span>
              <div class="pl-monitor-progress">
                <div class="pl-monitor-progress-bar type-3" :style="`width: ${ WEEKLY_MONITOR.week_avg_per }%`"></div>
              </div>
              <strong class="ml-auto">{{ WEEKLY_MONITOR.week_avg_call }} 콜</strong>
            </span>
          </div>
          <div>
            <strong>주간 상담시간</strong>
            <span class="pl-home-cs-weekly-list-unit">
              <span class="pl-home-cs-weekly-list-unit-title">내 상담시간</span>
              <div class="pl-monitor-progress">
                <div class="pl-monitor-progress-bar type-2" :style="`width: ${ WEEKLY_MONITOR.cs_per }%`"></div>
              </div>
              <strong class="ml-auto">{{ WEEKLY_MONITOR.cs_time }}</strong>
            </span>
            <span class="pl-home-cs-weekly-list-unit">
              <span class="pl-home-cs-weekly-list-unit-title">전체 평균</span>
              <div class="pl-monitor-progress">
                <div class="pl-monitor-progress-bar type-2" :style="`width: ${ WEEKLY_MONITOR.cs_avg_per }%`"></div>
              </div>
              <strong class="ml-auto">{{ WEEKLY_MONITOR.cs_avg_time }}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { callUtil } from "@/store/callUtil.js";
import { eventBus } from "@/store/eventBus.js";           //Event Bus

export default {
  name: "MENU_home_cs_info", //name은 'MENU_' + 파일명 조합
  props: {
    DataProp: Object,
    EXT_NO : {
      type: String
      , default : ''
    },
    CUSL_ID : {
      type: String
      , default : ''
    },
    LOCATION_INFO : {
      type: String
      , default : 'home'
    },
  },
  components: {
  },
  data() {
    return {
      SERVER_DATE : '',
      USER_PROFILE : {
          img : require('@/assets/img/@profile_user.png'), //사이즈  69x69
          USER_NM :  this.$store.getters["userStore/GE_USER_ROLE"].userName,
          DEPT_NM: '',
          IP : '',
          EXT_NO : '',
          OFC_ADDR: '',
          EMAIL : '',
          PHN_NO : '',
        },

      eventProp : [],
      // CUS_INFO: {
      //   name: '나고객',
      //   phone: '010-5555-5555',
      //   portrait: require('@/assets/img/@profile_user.png'), //사이즈  69x69
      // },

      IPCC_SOCKET_URL : '', //IPCC SOCKET URL

      TODAY_MONITOR: {
        base_date: '',
        list: [
          {
            subject: '인바운드',
            cs_time: '00:00:00',
            call_count: 0,
            updown: 'equal',
            dd_amt: 0,
            status_title: '전일 대비'
          },
          {
            subject: '아웃바운드',
            cs_time: '00:00:00',
            call_count: 0,
            updown: 'equal',
            dd_amt: 0,
          },
          {
            type: 'sns',
            subject: 'SNS Chatting',
            cs_time: '',
            call_count: 0,
            updown: 'equal', //0일때 케이스 추가
            dd_amt: 0,
          },
        ]
      },
      WEEKLY_MONITOR: {
        base_date: '',
        week_call: 0, //나의 콜
        week_per: 0, //나의 콜 비율
        week_avg_call: 0, //
        week_avg_per: 0,
        cs_time: '0분 0초',
        cs_per: 0,
        cs_avg_time: '0분 0초',
        cs_avg_per: 0,
      },

      SEAT_MOVE_TP : [],
    }
  },
  watch: {
    // EXT_NO () {
    //   if(!this.mixin_isEmpty(this.EXT_NO)) {
    //     this.$nextTick(()=>{
    //       if(this.LOCATION_INFO !== 'home'){
    //         this.initCuslData();
    //         this.setUserInfo(this.DataProp);
    //       }
    //     });
    //   }
    // },
    CUSL_ID () {
      if(!this.mixin_isEmpty(this.CUSL_ID)) {
        this.$nextTick(()=>{
          if(this.LOCATION_INFO !== 'home'){
            this.initCuslData();
            this.setUserInfo(this.DataProp);
          }
        });
      }
    },
  },

  computed: {

  },

  async created() {
    /** TopArea에서 보낸 사용자정보 이벤트 수신 */
    this.eventBusProps();
    this.IPCC_SOCKET_URL = this.$store.getters["userStore/GE_USER_COMPANY"].API_URI;

    this.SEAT_MOVE_TP = await this.mixin_common_code_get(await this.mixin_common_code_get_all(["SEAT_MOVE_TP"]), 'SEAT_MOVE_TP');
  },

  mounted() {
    //혹시 로그인한 상담사 정보가 조회되지 않는경우 === 예) 다른탭에서 새로고침
    if( this.mixin_isEmpty( this.USER_PROFILE.CUSL_ID )) {
      // console.log("this.USER_PROFILE.CUSL_ID NULL");
      var authObj = this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"];
      var userObj = this.$store.getters["userStore/GE_USER_ROLE"];

      this.USER_PROFILE.CUSL_ID =userObj.userId;
      this.USER_PROFILE.USER_NM =userObj.userName;
      this.USER_PROFILE.EXT_NO = this.mixin_isEmpty( userObj.EXT_NO ) ? '- ':userObj.EXT_NO;
      this.USER_PROFILE.IP =userObj.CNTN_IP;
      this.USER_PROFILE.OFC_ADDR =userObj.OFC_ADDR;
      this.USER_PROFILE.EMAIL = this.mixin_isEmpty(userObj.EMAIL) ? '- ':userObj.EMAIL;
      this.USER_PROFILE.PHN_NO = this.mixin_isEmpty(userObj.PHN_NO) ? '- ':userObj.PHN_NO;
      this.USER_PROFILE.JBTTL =userObj.JBTTL;
      this.USER_PROFILE.img = userObj.ICON_IMG_URI;

      this.USER_PROFILE.CO_NM = authObj.CD_NM;
      this.USER_PROFILE.DEPT_NM =authObj.DEPT_NM;

    }
  },
  updated(){
  },

  methods: {
    //상담사 정보 초기화
    initCuslData () {

    },

    eventBusProps(){
      this.$eventBus.$on("cs-info",(data) =>{
        this.setUserInfo(data)
      });
    },

    async getServerDate(){
      await this.mixin_getSvrDate("YYYYMMDDHH24MISS").then((data)=>{
        this.SERVER_DATE = this.mixin_convertDate(data, 'yyyy-MM-dd(E) HH:mm:ss');
      })
    },

    /* 사용자 정보 입력  */
    async setUserInfo(data){
      if(data){
        if(this.LOCATION_INFO === 'home'){

          this.USER_PROFILE.CO_NM =data[0].CO_NM;
          this.USER_PROFILE.CUSL_ID =data[0].USER_ID;
          this.USER_PROFILE.USER_NM =data[0].USER_NM;
          // this.USER_PROFILE.EXT_NO =data[0].EXT_NO;
          this.USER_PROFILE.EXT_NO = this.mixin_isEmpty(data[0].EXT_NO) ? '- ':data[0].EXT_NO;
          this.USER_PROFILE.DEPT_NM =data[0].DEPT_NM;
          this.USER_PROFILE.IP =data[0].CNTN_IP;
          this.USER_PROFILE.OFC_ADDR =data[0].OFC_ADDR;
          this.USER_PROFILE.EMAIL = this.mixin_isEmpty(data[0].EML) ? '- ':data[0].EML;
          this.USER_PROFILE.PHN_NO = this.mixin_isEmpty(data[0].MBL_PHN_NO) ? '- ':data[0].MBL_PHN_NO;
          this.USER_PROFILE.JBTTL =data[0].JBTTL;
          // if(data[0].ICON !=='f04'){
          //   this.USER_PROFILE.img = '/upload/' + data[0].ICON_IMG_URI;
          // }else{
          //   this.USER_PROFILE.img =require('@/assets/img/@profile_user.png');
          // }
          this.USER_PROFILE.img = this.$store.getters["userStore/GE_USER_ROLE"].ICON_IMG_URI
        }else{
          this.USER_PROFILE.img = data.cuslImg;
          this.USER_PROFILE.CUSL_ID = data.CUSL_ID;
          this.USER_PROFILE.USER_NM = data.USER_NM;
          this.USER_PROFILE.EXT_NO = data.EXT_NO;
          this.USER_PROFILE.CO_NM = data.CO_NM;
          this.USER_PROFILE.role = data.role;
          this.USER_PROFILE.status = data.status;
          if(this.LOCATION_INFO === 'sns'){
            this.USER_PROFILE.img = data.ICON_IMG_URI;
            this.USER_PROFILE.ING_CNT = data.ING_CNT;
            this.USER_PROFILE.LGN_STTS = data.LGN_STTS;
            this.USER_PROFILE.CHT_STAT = data.CHT_STAT;
            this.USER_PROFILE.status = data.CUTT_STTS_CD;
          }
        }

        await this.getServerDate(); //기준일자 서버시간 셋팅

        //오늘의 상담 현황
        await this.todayCuslStat();

        //주간 상담 현황
        await this.weekCuslStat();
      }
    },

    //오늘의 상담 현황
    async todayCuslStat() {
      await this.getServerDate(); //기준일자 서버시간 셋팅
      this.TODAY_MONITOR.base_date = this.SERVER_DATE;
      let agentDayStat = callUtil.ipcc('/api/palette_interface.php', {REQ : 'home_agent_day_stat', EXT: this.USER_PROFILE.EXT_NO});

      if(agentDayStat != null){
        this.TODAY_MONITOR.list[0].cs_time = agentDayStat.IB_TIME; //인바운드 상담시간
        this.TODAY_MONITOR.list[0].call_count = agentDayStat.IB_CNT; //인바운드 콜 수
        this.TODAY_MONITOR.list[0].updown = agentDayStat.IB_BEFORE.split('|')[1] === '0' ? 'equal' : agentDayStat.IB_BEFORE.split('|')[0] === 'U'?'up':'down'; //인바운드 전일대비 상태
        this.TODAY_MONITOR.list[0].dd_amt = agentDayStat.IB_BEFORE.split('|')[1]; //인바운드 전일대비 비율

        this.TODAY_MONITOR.list[1].cs_time = agentDayStat.OB_TIME; //아웃바운드 상담시간
        this.TODAY_MONITOR.list[1].call_count = agentDayStat.OB_CNT; //아웃바운드 콜 수
        this.TODAY_MONITOR.list[1].updown = agentDayStat.OB_BEFORE.split('|')[1] === '0' ? 'equal' : agentDayStat.OB_BEFORE.split('|')[0] === 'U'?'up':'down'; //아웃바운드 전일대비 상태
        this.TODAY_MONITOR.list[1].dd_amt = agentDayStat.OB_BEFORE.split('|')[1]; //아웃바운드 전일대비 비율

        //SNS Chatting 정보
        this.snsInfoSrch();
      }
    },

    //주간 상담 현황
    async weekCuslStat() {
      await this.getServerDate(); //기준일자 서버시간 셋팅
      this.WEEKLY_MONITOR.base_date = this.SERVER_DATE;
      let agentWeekMonthStat = callUtil.ipcc('/api/palette_interface.php', {REQ : 'home_agent_week_stat', EXT: this.USER_PROFILE.EXT_NO});

      if(agentWeekMonthStat != null){
        //콜
        this.WEEKLY_MONITOR.week_call = agentWeekMonthStat.WEEK_MY_CALL_CNT; //나의 콜
        this.WEEKLY_MONITOR.week_per = ((agentWeekMonthStat.WEEK_MY_CALL_CNT / agentWeekMonthStat.TOTAL_CALL_CNT) * 100).toFixed(2); //나의 콜 비율
        this.WEEKLY_MONITOR.week_avg_call = agentWeekMonthStat.WEEK_AVG_CALL_CNT; //전체 콜 평균
        this.WEEKLY_MONITOR.week_avg_per = ((agentWeekMonthStat.WEEK_AVG_CALL_CNT / agentWeekMonthStat.TOTAL_CALL_CNT) * 100).toFixed(2); //전체 콜 평균 비율

        //시간
        let sTimeWord = '';
        agentWeekMonthStat.WEEK_MY_CALL_TIME.split(':').forEach((time, idx) => {
          if(idx === 0 && Number(time) > 0) sTimeWord += Number(time) + '시간 ';
          else if(idx === 1) sTimeWord += Number(time) + '분 ';
          else if(idx === 2) sTimeWord += Number(time) + '초';
        });

        this.WEEKLY_MONITOR.cs_time = sTimeWord; //내 상담시간

        let iMyTotalSec = 0;
        agentWeekMonthStat.WEEK_MY_CALL_TIME.split(':').forEach((time, idx) => {
          if(idx === 0)  iMyTotalSec += Number(time) * 60 * 60;
          else if(idx === 1) iMyTotalSec += Number(time) * 60;
          else if(idx === 2) iMyTotalSec += Number(time);
        });

        this.WEEKLY_MONITOR.cs_per = ((iMyTotalSec / agentWeekMonthStat.TOTAL_CALL_SEC) * 100).toFixed(2); //내 상담시간 비율

        //전체 상담시간 평균
        let sAvgTimeWord = '';
        agentWeekMonthStat.WEEK_AVG_CALL_TIME.split(':').forEach((time, idx) => {
          if(idx === 0 && Number(time) > 0) sAvgTimeWord += Number(time) + '시간 ';
          else if(idx === 1) sAvgTimeWord += Number(time) + '분 ';
          else if(idx === 2) sAvgTimeWord += Number(time) + '초';
        });
        this.WEEKLY_MONITOR.cs_avg_time = sAvgTimeWord; //전체 상담시간 평균

        let iAvgTotalSec = 0;
        agentWeekMonthStat.WEEK_AVG_CALL_TIME.split(':').forEach((time, idx) => {
          if(idx === 0)  iAvgTotalSec += Number(time) * 60 * 60;
          else if(idx === 1) iAvgTotalSec += Number(time) * 60;
          else if(idx === 2) iAvgTotalSec += Number(time);
        });

        this.WEEKLY_MONITOR.cs_avg_per = ((iAvgTotalSec / agentWeekMonthStat.TOTAL_CALL_SEC) * 100).toFixed(2); //전체 상담시간 평균 비율
      }
    },

    displayStatus(item,type) {
      // console.log(item)
      if(this.LOCATION_INFO === 'sns'){
        const typeList = [
          { type_list_text: '로그아웃', type_list_value: 'LOGOUT', type_list_type: 'error' },
          { type_list_text: '로그인', type_list_value: 'LOGIN', type_list_type: 'error' },
          { type_list_text: '채팅ON', type_list_value: 'CHT_WAIT', type_list_type: 'accept' },
          { type_list_text: '상담', type_list_value: 'ING', type_list_type: 'open' },
          { type_list_text: '이석', type_list_value: 'REST', type_list_type: 'disable' },
        ];

        let userStat = '';
        if(parseInt(item.ING_CNT) > 0){
          userStat = 'ING';
        } else if(item.CHT_STAT == "CHT_WAIT"){
          userStat = 'CHT_WAIT';
        } else if(item.CHT_STAT != "CHT_CANT"){
          userStat = 'REST';
        } else {
          userStat = item.LGN_STTS;
        }

        for (let i = 0; i < typeList.length; i++) {
          if (typeList[i].type_list_value === userStat) {
            if(type == "statNm"){
              return typeList[i].type_list_text;
            } else {
              return typeList[i].type_list_type;
            }
          }
        }
      }else{
        let typeList = [
          { type_list_text: '로그아웃', type_list_type: 'error' },
          { type_list_text: '대기', type_list_type: 'reject' },
          { type_list_text: 'IN 연결중', type_list_type: 'accept' },
          { type_list_text: 'IN 통화중', type_list_type: 'open' },
          { type_list_text: 'OB 연결중', type_list_type: 'accept' },
          { type_list_text: 'OB 통화중', type_list_type: 'open' },
          { type_list_text: '후처리', type_list_type: 'after' },
          // { type_list_text: '이석', type_list_type: 'disable' },
          // { type_list_text: '휴식', type_list_type: 'disable' },
          // { type_list_text: '교육', type_list_type: 'disable' },
          // { type_list_text: '식사', type_list_type: 'disable' },
          // { type_list_text: '기타', type_list_type: 'disable' },
        ];

        this.SEAT_MOVE_TP.forEach((data, idx) => {
          typeList.push({type_list_text: data.text, type_list_type: 'disable'});
        });

        for (let i = 0; i < typeList.length; i++) {
          if (typeList[i].type_list_text === item.status) {
            if(type == "statNm"){
              return typeList[i].type_list_text;
            } else {
              return typeList[i].type_list_type;
            }
          }
        }
      }
    },

    //SNS Chatting 정보 가져오기 (응대기준==후처리또는 완료건)
    async snsInfoSrch(){
      let sUrl = '/chat-api/status/agent/today/inqire';
      let postParam = {
        CUSL_ID : this.CUSL_ID != '' ? this.CUSL_ID : this.$store.getters["userStore/GE_USER_ROLE"].userId
      }
      let headParam = {
        head : {
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);
      if (!resData.HEADER.ERROR_FLAG){
        this.TODAY_MONITOR.list[2].cs_time = this.mixin_convertDate(resData.DATA[0].TODAY_TIME, 'HH:mm:ss')
        this.TODAY_MONITOR.list[2].call_count = resData.DATA[0].TODAY_CNT;

        let ratio = 0;
        if(parseInt(resData.DATA[0].TODAY_CNT) > parseInt(resData.DATA[0].YESTERDAY_CNT)){
          this.TODAY_MONITOR.list[2].updown = 'up';
          ratio = ((parseInt(resData.DATA[0].TODAY_CNT)-parseInt(resData.DATA[0].YESTERDAY_CNT))/parseInt(resData.DATA[0].TODAY_CNT)*100).toFixed(2);
        } else if(parseInt(resData.DATA[0].TODAY_CNT) == parseInt(resData.DATA[0].YESTERDAY_CNT)) {
          this.TODAY_MONITOR.list[2].updown = 'equal'; //전일대비 동일할때 상태값 지정
          ratio = '0';
        } else if(parseInt(resData.DATA[0].TODAY_CNT) < parseInt(resData.DATA[0].YESTERDAY_CNT)){
          this.TODAY_MONITOR.list[2].updown = 'down';
          ratio = ((parseInt(resData.DATA[0].YESTERDAY_CNT)-parseInt(resData.DATA[0].TODAY_CNT))/parseInt(resData.DATA[0].YESTERDAY_CNT)*100).toFixed(2);
        }

        this.TODAY_MONITOR.list[2].dd_amt = Math.round(ratio * 100) / 100;    //소수점 뒤 0일때 삭제
      }
    }

  },

}
</script>

<style>
</style>
