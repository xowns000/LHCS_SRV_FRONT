<template>
  <div class="pl-home-calendar-wrap">
    <div class="pl-card-top ">
      <strong class="pl-card-top-title ">{{ formattedTodayDate }}</strong>
      <div class="pl-btn-wrap ml-auto align-self-start">
        <!-- 새로고침 버튼 -->
        <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          @btnClick="getAllSchdl()"
        ></compo-tooltip-btn>
        <!-- 등록 버튼 -->
        <compo-tooltip-btn
          TitleProp="자세히 보기"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 plus"
          TooltipPositionProp="bottom"
          @btnClick="navCalendar('dtl')"
        ></compo-tooltip-btn>
      </div>
    </div>
    <div class="pl-card d-flex flex-column">
      <!-- DatePicker -->
      <div class="d-flex justify-center">
        <div class="pl-calendar type-mini" style="width: 382px; height: 270px;">
          <v-date-picker
            v-model="date"
            no-title
            width="100%"
            color="#F0F4FF"
            header-color="#F4F5FF"
            @input="menu21 = false"
            first-day-of-week="0"
            locale="ko-KR"
            :day-format="mixin_getDate"
            :events="setDate"
            event-color="#8591E1"
            scrollable
            @dblclick:date="navCalendar('all')"
          ></v-date-picker>
        </div>
      </div>
      <!-- 일정 monitor -->
      <div class="pl-home-calendar-info">
        <div v-for="item in this.CALENDAR_MONITOR"
          :key="item.id"
          style="cursor:pointer;"
          @click="navCalendar(item.value)"
        >
          <strong>{{ item.count }}</strong>
          <span>{{ item.title }}</span>
        </div>
      </div>
      <!-- 일정 card -->
      <div class="pl-home-calendar-card-wrap">
        <div
          v-for="item in CALENDAR_LIST"
          :key="item.id"
          class="pl-home-calendar-card-list">
          <span>{{ item.title }}</span>
          <strong>
            {{ item.count }}
            <template v-if="item.maxCount !== undefined" >
              / {{ item.maxCount }}
            </template>
          </strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { eventBus } from "@/store/eventBus.js";           //Event Bus

export default {
  name: "MENU_home_calendar", //name은 'MENU_' + 파일명 조합
  props: {
    DataProp: Object,
  },
  components: {
  },
  data() {
    return {
      editable: false,
      currentDate : '',
      date: '',

      startData : '',

      ACTIVE_TAB :
         { PATH_NM : "/CLD_M0000"
          , FULL_PATH : "캘린더"
          , NODE_TITLE :"캘린더"
          , MENU_EXPLN : "캘린더"
          },

      // CALENDAR_MONITOR: [
      //   { title: '나의 일정', count: 12},
      //   { title: '센터 일정', count: 12},
      //   { title: '주간 일정', count: 12},
      //   { title: '중요 일정', count: 12},
      // ],
      // CALENDAR_CARD: {
      //   today: {
      //     title: '오늘의 시험',
      //     date : '20230707',
      //     badge_txt: '미응시',
      //     badge_color: 'blue',
      //     icon: 'test',
      //     desc: '진행중인 시험이 있습니다.'
      //   },
      //   qc: {
      //     title: '나의 품질평가',
      //     badge_txt: '',
      //     badge_color: '',
      //     icon: 'qc_mark',
      //     desc: '진행해야 할 QA 평가가 있습니다.'
      //   },
      // },

      SchdlData : [],
      setDate : [],

      CALENDAR_MONITOR : [
        { title : '나의 일정', count : 0 , value : 'ps'},
        { title : '센터 일정', count : 0 , value : 'ct'},
        { title : '월간 일정', count : 0 , value : 'monthly'},
        { title : '중요 일정', count : 0 , value : 'estnl'},
      ],

      CALENDAR_LIST: [
        { title: '미해결 콜백', count: 0, },
        { title: '미해결 예약콜', count: 0, },
        { title: '캠페인 현황', count: 0, maxCount: 0 },
      ],
    }
  },

  watch: {

  },

  computed: {
    formattedTodayDate() {
      const new_date = moment();
      return new_date.locale('ko').format('YYYY. MM. DD(ddd)');
    }
  },

  created() {
    this.getServerDate();
  },

  mounted() {
    this.getAllSchdl();
     this.$eventBus.$emit('calType', 'all');
    },

  methods: {
    async getServerDate(){
      await this.mixin_getSvrDate("YYYYMMDDHH24MISS").then((data)=>{
        this.currentDate = data;
        this.date = this.mixin_convertDate(data, 'yyyy-MM-dd HH:mm:ss')
        // console.log(this.date);
      })

    },

  async getAllSchdl() {

   this.SchdlData=[];

   let sUrl = "/api/schedule/list";
   let postParam = {};

   let HeaderParam ={
     head:{
       SERVICE : "api.schedule.list",
       METHOD : "list",
       TYPE : "BIZ_SERVICE",
     }
   };

  let response = await this.common_postCall(sUrl, postParam, HeaderParam)

   if(!response.HEADER.ERROR_FLAG){
    //  let tempData =[];

    //  for(let i in response.DATA){
    //    if(response.DATA[i].RLS_YN === "Y"){
    //      tempData = response.DATA[i];
    //    }
    //     this.SchdlData.push(tempData)
    //  }
    this.SchdlData = response.DATA;
    this.setSchdl();
    this.MySchdlStat();
    this.getMyDeskData();
   }


  },

  setSchdl(){

    let temp1;
    let temp2;
    let exgstDate =[];
    // // this.arrayEvents =
    for(let i in this.SchdlData){
        exgstDate.push(this.SchdlData[i]);
    }

    temp1 = exgstDate.map((item)=>{
      // let j = item.BGNG_YMD.substr(0,8);
      let j = this.mixin_convertDate(item.BGNG_YMD, 'yyyy-MM-dd');

      return j
    })
    temp2 = exgstDate.map((item)=>{
      let k = this.mixin_convertDate(item.END_YMD, 'yyyy-MM-dd')
      return k
    })

    this.setDate = [...temp1, ... temp2];

  },

  async MySchdlStat(){

    this.CALENDAR_MONITOR=[
      { title : '나의 일정', count : 0 , value : 'ps'},
      { title : '센터 일정', count : 0 , value : 'ct'},
      { title : '월간 일정', count : 0 , value : 'monthly'},
      { title : '중요 일정', count : 0 , value : 'estnl'},
    ];

    let sURL = 'api/schedule/MySchdlStat'
    let postParam = {};
    let headParam = {
      head:{}
    }

    let response = await this.common_postCall(sURL, postParam, headParam);
    if(!response.HEADER.ERROR_FLAG){
      let tempData = response.DATA[0]
      // MySchdl = tempData.MY_SCHDL;
      // CenterSchdl = tempData.CT_SCHDL;
      // MonthlySchdl = tempData.MONTHLY_SCHDL;
      // EstnlSchdl = tempData.ESTNL_SCHDL;

      this.CALENDAR_MONITOR = [
        { title : '나의 일정', count : tempData.MY_SCHDL , value : 'ps'},
        { title : '센터 일정', count : tempData.CT_SCHDL , value : 'ct'},
        { title : '월간 일정', count : tempData.MONTHLY_SCHDL , value : 'monthly'},
        { title : '중요 일정', count : tempData.ESTNL_SCHDL , value : 'estnl'},
      ];
    }


    },

    async navCalendar(data){
    await this.mixin_set_active_tab(this.ACTIVE_TAB)
     this.sendEvent(data);
    },
    sendEvent(data){
      let tempData = data;
       this.$eventBus.$emit('calType', tempData);
    },

    //MY 데스크
    async getMyDeskData() {
      this.CALENDAR_LIST[0].count = 0;
      this.CALENDAR_LIST[1].count = 0;
      this.CALENDAR_LIST[2].count = 0;

      let sUrl = '/phone-api/cutt/myDeskStat';
      let postParam = {
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){

        //미해결 콜백
        if(response.DATA[0].CLBK_CNT > 0){
          if(Number(response.DATA[0].COMPLETED_CLBK_CNT) > Number(response.DATA[0].CLBK_CNT)) this.CALENDAR_LIST[0].count = 0;
          else this.CALENDAR_LIST[0].count = Number(response.DATA[0].CLBK_CNT) - Number(response.DATA[0].COMPLETED_CLBK_CNT);
        }
        
        //미해결 예약콜
        if(response.DATA[0].RSVT_CNT > 0){
          if(Number(response.DATA[0].COMPLETED_RSVT_CNT) > Number(response.DATA[0].RSVT_CNT)) this.CALENDAR_LIST[1].count = 0;
          else this.CALENDAR_LIST[1].count = Number(response.DATA[0].RSVT_CNT) - Number(response.DATA[0].COMPLETED_RSVT_CNT);
        }
        
        //캠페인 현황
        if(response.DATA[0].CPI_CNT > 0){
          this.CALENDAR_LIST[2].count = response.DATA[0].CPI_CNT;
          this.CALENDAR_LIST[2].maxCount = response.DATA[0].COMPLETED_CPI_CNT;
          if(Number(response.DATA[0].COMPLETED_CPI_CNT) > Number(response.DATA[0].CPI_CNT)){
            this.CALENDAR_LIST[2].maxCount = response.DATA[0].CPI_CNT;
          }
        }

      }
    },
  },
}
</script>
<style></style>