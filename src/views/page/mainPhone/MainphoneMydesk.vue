<template>
  <div>
    <div class="pl-card-top">
      <strong class="pl-card-top-title" :class="mixin_getCustcoSetting('ENV_CUST_INFO_YN') ? 'is-click' : ''">
        <span
          :class="tab_mydesk === 0 ? 'active' : '' || !mixin_getCustcoSetting('ENV_CUST_INFO_YN') ? 'active' : ''"
          @click="tab_mydesk = 0">MY 데스크</span>
        <span
          v-if="mixin_getCustcoSetting('ENV_CUST_INFO_YN')"
          class="ml-4"
          :class="tab_mydesk === 1 ? 'active' : ''"
          @click="tab_mydesk = 1">고객핵심 정보</span>
        </strong>
      <div class="pl-btn-wrap ml-auto align-self-start">
        <!-- 새로고침 버튼 mydesk -->
        <compo-tooltip-btn
          v-if="tab_mydesk === 0"
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          @btnClick="getMyDeskData"></compo-tooltip-btn>
        <!-- 새로고침 버튼 고객핵심정보 -->
        <compo-tooltip-btn
          v-if="tab_mydesk === 1"
          TitleProp="새로고침2"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          @btnClick=""></compo-tooltip-btn>
        <!-- 리사이즈 토글 -->
        <compo-tooltip-btn :TitleProp=computedResizeText ClassProp="pl-tooltip-btn" :IconProp=computedResizeClass
          TooltipPositionProp="bottom" @btnClick="$emit('toggle')"></compo-tooltip-btn>
      </div>
    </div>
    <!-- 고객핵심정보 -->
    <template v-if="mixin_getCustcoSetting('ENV_CUST_INFO_YN') && tab_mydesk === 1">
      <div class="pl-card pb-0">
        <!-- card -->
        <div class="pl-mainphone-key-info-card-wrap">
          <div class="pl-mainphone-key-info-card">
            <div class="pl-mainphone-key-info-card-title">{{ KEY_INFO.info1.title }}</div>
            <div class="pl-mainphone-key-info-card-desc">
              <v-icon :class="`pl-icon30 ${ KEY_INFO.info1.icon }`"></v-icon>
              <div>
                <div class="pl-mainphone-key-info-card-desc-subject">{{ KEY_INFO.info1.name }}</div>
                <div class="pl-mainphone-key-info-card-desc-txt">{{ KEY_INFO.info1.desc }}</div>
              </div>
            </div>
          </div>
          <div class="pl-mainphone-key-info-card">
            <div class="pl-mainphone-key-info-card-title">{{ KEY_INFO.info2.title }}</div>
            <div class="pl-mainphone-key-info-card-desc">
              <v-icon :class="`pl-icon30 ${ KEY_INFO.info2.icon }`"></v-icon>
              <div>
                <div class="pl-mainphone-key-info-card-desc-subject">{{ KEY_INFO.info2.name }}</div>
                <div class="pl-mainphone-key-info-card-desc-txt">{{ KEY_INFO.info2.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 추가정보 -->
      <!-- info 3 -->
      <div class="pl-card pt-0 pb-0">
        <div class="pl-mainphone-key-info-list-wrap pt-0 mt-0">
          <div class="pl-mainphone-key-info-list type-01">
            <div class="pl-mainphone-key-info-list-unit">
              <div class="pl-mainphone-key-info-list-title">고객만족도</div>
              <div class="pl-mainphone-key-info-list-desc">고마우신 분</div>
              <div class="pl-mainphone-key-info-list-r-info">
                {{ KEY_INFO.info_list.satisfaction }}/ 5
                <div class="pl-star-rating">
                  <div class="pl-star-rating-inner" :style="`width: ${ computedStartRating }%`"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="pl-mainphone-key-info-list type-02">
            <div class="pl-mainphone-key-info-list-unit">
              <div class="pl-mainphone-key-info-list-title">보유 포인트</div>
              <div class="pl-mainphone-key-info-list-desc">고마우신 고객</div>
              <div class="pl-mainphone-key-info-list-r-info">
                {{ KEY_INFO.info_list.point.toLocaleString() }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <template v-if="this.ResizeProp">
        <div class="pl-card pt-0">
          <div class="pl-mainphone-key-info-list-wrap mt-0">
            <div class="pl-mainphone-key-info-list type-03 is-border">
              <div class="pl-mainphone-key-info-list-unit">
                <div class="pl-mainphone-key-info-list-title">고객 이탈 예측
                  ({{ KEY_INFO.info_list.moveout }}%)
                </div>
                <div class="pl-mainphone-key-info-list-desc">
                  <div class="pl-monitor-progress my-1">
                    <div class="pl-monitor-progress-bar" :style="`width: ${ KEY_INFO.info_list.moveout }%`"></div>
                  </div>
                  활동 빈도가 낮아지고 있습니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>


    </template>
    <!-- mydesk -->
    <template v-else>
      <div class="pl-card pb-0">
        <div class="pl-mainphone-mydesk-card">
          <div>
            <span>
              <v-icon class="pl-mainphone-mydesk-card-icon-in"></v-icon>
              인입
            </span>
            <strong>
              {{ MY_DESK_DATA.monitor_in }}
            </strong>
          </div>
          <div>
            <span>
              <v-icon class="pl-mainphone-mydesk-card-icon-re"></v-icon>
              응대
            </span>
            <strong>
              {{ MY_DESK_DATA.monitor_re }}
            </strong>
          </div>
          <div>
            <span>
              <v-icon class="pl-mainphone-mydesk-card-icon-wait"></v-icon>
              대기
            </span>
            <strong>
              {{ MY_DESK_DATA.monitor_wait }}
            </strong>
          </div>
        </div>
        <div class="pl-mainphone-mydesk-stat">
          <div>
            <strong>미해결 콜백</strong>
            <span class="pl-mainphone-mydesk-stat-count">{{ MY_DESK_DATA.no_callback }}</span>
          </div>
          <div>
            <strong>미해결 예약콜</strong>
            <span class="pl-mainphone-mydesk-stat-count">{{ MY_DESK_DATA.no_reserve }}</span>
          </div>
          <div v-if="this.ResizeProp" class="expand-hidden">
            <strong>캠페인 현황</strong>
            <span class="pl-mainphone-mydesk-stat-count">{{ MY_DESK_DATA.completed_campaign }} / {{ MY_DESK_DATA.campaign_cnt }}</span>
          </div>
        </div>
        <template v-if="this.ResizeProp">
          <div class="pl-monitor-progress ml-2 expand-hidden">
            <div class="pl-monitor-progress-bar type-2" :style="`width: ${MY_DESK_DATA.completed_rate}%`"></div>
          </div>
          <p class="is-mt-s ml-2 expand-hidden">캠페인 진행률 ({{ MY_DESK_DATA.completed_rate }}%)</p>
        </template>
      </div>
      <!-- 추가 정보 -->
      <div class="pl-card pl-mainphone-mydesk-add-wrap">
        <div
          v-for="item in MY_DESK_DATA.add_info"
          :key="item.id"
          class="pl-mainphone-mydesk-add"
          >
          <div>
            <v-icon :class="`pl-icon-cti-${ item.icon}`"></v-icon>
            <span class="pl-2">{{ item.text }}</span>
          </div>
          <strong class="ml-auto">
            <!-- ({{ item.time }})<span class="text-caption">분</span> -->
            <span class="text-caption">{{ item.time }}</span>
          </strong>
        </div>
      </div>
    </template>

  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { callUtil } from "@/store/callUtil.js";
export default {
  name: 'Mainphone_mydesk',
  props: {
    ResizeProp: {
      type: Boolean,
      default: false
    },

  },
  components: {
  },
  data() {
    return {
      // [마이 데스크]
      MY_DESK_DATA: {
        monitor_in: 0,
        monitor_re: 0,
        monitor_wait: 0,
        no_callback: 0,
        no_reserve: 0,
        campaign_cnt: 0,
        completed_campaign: 0,
        completed_rate: 0,
        add_info: [
          { text: "대기", icon: 'stat-wait', time: 0},
          { text: "후처리", icon: 'stat-after', time: 0},
          { text: "휴식", icon: 'stat-rest', time: 0},
          { text: "교육", icon: 'stat-edu', time: 0},
          { text: "식사", icon: 'stat-launch', time: 0},
          { text: "기타", icon: 'stat-etc', time: 0},
        ]
      },
      // [핵심 정보]
      KEY_INFO: {
        info1 : {
          title: '등급',
          name: 'Gold',
          desc: 'VIP 고객 등급',
          icon: 'mainphone-grade'
        },
        info2 : {
          title: '보유제품군',
          name: '카드',
          desc: '한글 C3카드',
          icon: 'mainphone-have-prd'
        },
        info_list : {
          satisfaction: 3,
          point: 20000,
          moveout: 45,
        }
      },
      // tab
      tab_mydesk: 0,
    }
  },
  watch: {
  },
  computed: {
    computedResizeClass() {
      return this.ResizeProp === true ? 'pl-icon20 resize-on' : 'pl-icon20 resize-off'
    },
    computedResizeText() {
      return this.ResizeProp === true ? '축소' : '확대'
    },
    computedStartRating() {
      const value = this.KEY_INFO.info_list.satisfaction / 5 * 100;
      return value;
    },
  },
  created() {
    this.getMyDeskData(); //MY 데스크
  },
  mounted() {
  },
  methods: {
    //MY 데스크
    async getMyDeskData() {
      let myDeskCall = callUtil.ipcc('/api/palette_interface.php', {REQ : 'call_now_stat', EXT : this.$store.getters["userStore/GE_USER_COMPANY"].EXT_NO}); //My 데스크 - call 관련

      // console.log(myDeskCall);
      let MY_DESK_DATA = this.MY_DESK_DATA;

      if(myDeskCall != null){
        Object.keys(myDeskCall).forEach(function(v){
          if(v === 'IB_CNT') MY_DESK_DATA.monitor_in = myDeskCall[v]; //인입호
          else if(v === 'ANSWER_CNT') MY_DESK_DATA.monitor_re = myDeskCall[v]; //응대호
          else if(v === 'WAIT_CNT') MY_DESK_DATA.monitor_wait = myDeskCall[v]; //대기호
        });
      }

      let SEAT_MOVE_TP = await this.mixin_common_code_get(await this.mixin_common_code_get_all(["SEAT_MOVE_TP"]), 'SEAT_MOVE_TP');

      let myDeskCuslInfo = callUtil.ipcc('/api/palette_interface.php', {REQ : 'call_agent_stat_v2', EXT : this.$store.getters["userStore/GE_USER_COMPANY"].EXT_NO}); //My 데스크 - 상담사 상태

      // console.log(myDeskCuslInfo);
      let convertTimeChange = this.convertTimeChange;

      if(myDeskCuslInfo != null){
        // Object.keys(myDeskCuslInfo).forEach((key, idx) =>{
        //   if(key === 'READY_TIME') MY_DESK_DATA.add_info[0].time = (myDeskCuslInfo[key]); //대기 시간
        //   else if(key === 'AFTER_TIME') MY_DESK_DATA.add_info[1].time = (myDeskCuslInfo[key]); //후처리 시간
        //   else if(key === 'REST_TIME') MY_DESK_DATA.add_info[2].time = (myDeskCuslInfo[key]); //휴식 시간
        //   else if(key === 'EDU_TIME') MY_DESK_DATA.add_info[3].time = (myDeskCuslInfo[key]); //교육 시간
        //   else if(key === 'MEAL_TIME') MY_DESK_DATA.add_info[4].time = (myDeskCuslInfo[key]); //식사 시간
        //   else if(key === 'ETC_TIME') MY_DESK_DATA.add_info[5].time = (myDeskCuslInfo[key]); //기타 시간
          // if(key === 'READY_TIME') MY_DESK_DATA.add_info[0].time = convertTimeChange(myDeskCuslInfo[key]); //대기 시간
          // else if(key === 'AFTER_TIME') MY_DESK_DATA.add_info[1].time = convertTimeChange(myDeskCuslInfo[key]); //후처리 시간
          // else if(key === 'REST_TIME') MY_DESK_DATA.add_info[2].time = convertTimeChange(myDeskCuslInfo[key]); //휴식 시간
          // else if(key === 'EDU_TIME') MY_DESK_DATA.add_info[3].time = convertTimeChange(myDeskCuslInfo[key]); //교육 시간
          // else if(key === 'MEAL_TIME') MY_DESK_DATA.add_info[4].time = convertTimeChange(myDeskCuslInfo[key]); //식사 시간
          // else if(key === 'ETC_TIME') MY_DESK_DATA.add_info[5].time = convertTimeChange(myDeskCuslInfo[key]); //기타 시간
        // });

        // myDeskCuslInfo = JSON.parse('{"READY_TIME":"00:00:00","AFTER_TIME":"01:07:04","TIME_3":"00:00:00","TIME_4":"00:00:00","TIME_5":"00:00:00","TIME_6":"00:00:00","TIME_7":"00:00:00"}');
        // SEAT_MOVE_TP = [];

        if(SEAT_MOVE_TP.length > 0){
          MY_DESK_DATA.add_info = [];
          Object.keys(myDeskCuslInfo).forEach((key, idx) =>{
            if(idx === 0){
              MY_DESK_DATA.add_info.push({text : '대기', icon : 'stat-wait', time: myDeskCuslInfo[key]});
            }else if(idx === 1){
              MY_DESK_DATA.add_info.push({text : '후처리', icon : 'stat-after', time: myDeskCuslInfo[key]});
            }else{
              SEAT_MOVE_TP.forEach((reason, seq) => {
                if(seq === (idx - 2)){
                  MY_DESK_DATA.add_info.push({text : reason.text, icon : reason.cd_vl, time: myDeskCuslInfo[key]});
                }
              });
            }
          });
        }else{
          Object.keys(myDeskCuslInfo).forEach((key, idx) =>{
            MY_DESK_DATA.add_info[idx].time = myDeskCuslInfo[key];
          });
        }
      }

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
          if(Number(response.DATA[0].COMPLETED_CLBK_CNT) > Number(response.DATA[0].CLBK_CNT)) this.MY_DESK_DATA.no_callback = 0;
          else this.MY_DESK_DATA.no_callback = Number(response.DATA[0].CLBK_CNT) - Number(response.DATA[0].COMPLETED_CLBK_CNT);
        }

        //미해결 예약콜
        if(response.DATA[0].RSVT_CNT > 0){
          if(Number(response.DATA[0].COMPLETED_RSVT_CNT) > Number(response.DATA[0].RSVT_CNT)) this.MY_DESK_DATA.no_reserve = 0;
          else this.MY_DESK_DATA.no_reserve = Number(response.DATA[0].RSVT_CNT) - Number(response.DATA[0].COMPLETED_RSVT_CNT);
        }

        //캠페인 현황
        if(response.DATA[0].CPI_CNT > 0){
          this.MY_DESK_DATA.campaign_cnt = response.DATA[0].CPI_CNT;
          this.MY_DESK_DATA.completed_campaign = response.DATA[0].COMPLETED_CPI_CNT;
          // console.log(response.DATA);
          if(Number(response.DATA[0].COMPLETED_CPI_CNT) > Number(response.DATA[0].CPI_CNT)){
            this.MY_DESK_DATA.completed_campaign = response.DATA[0].CPI_CNT;
            this.MY_DESK_DATA.completed_rate = 100;
          }else{
            this.MY_DESK_DATA.completed_rate = Number(response.DATA[0].CPI_CNT) > 0?((Number(response.DATA[0].COMPLETED_CPI_CNT) / Number(response.DATA[0].CPI_CNT)) * 100).toFixed(1):0;
          }
        }

      }
    },

    convertTimeChange(data){
      let iMyTotalMin = 0;
      if(data){
        data.split(':').forEach((time, idx) => {
          if(idx === 0)  iMyTotalMin += Number(time) * 60;
          else if(idx === 1) iMyTotalMin += Number(time);
          // else if(idx === 2) iMyTotalSec += Number(time);
        });
      }

      return iMyTotalMin;
    },
  },
};
</script>

<style lang="scss" scoped>
.pl-card-top-title {
  &.is-click{
    cursor: pointer;
  }
  span {
    color: #c5c5c5;
    font-size: 15px;
      &.active {
      color: #000;
      font-size: 18px;
    }
  }
}

</style>