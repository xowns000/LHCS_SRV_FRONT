<template>
  <div>
    <div class="pl-card-top" v-if="LOCATION_INFO === 'home'">
      <strong class="pl-card-top-title ">전화상담</strong>
      <div class="pl-btn-wrap ml-auto align-self-start">
        <!-- 새로고침 버튼 -->
        <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          @btnClick="getWeekStat"
        ></compo-tooltip-btn>
        <!-- 전화상담 통계 바로가기 버튼 -->
        <compo-tooltip-btn
          TitleProp="전화상담 통계 바로가기"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 plus"
          TooltipPositionProp="bottom"
          @btnClick="mixin_set_active_tab({PATH_NM:'/STA_M0101', NODE_TITLE:'전화상담종합 통계', FULL_PATH: '통계 > 전화상담 통계 > 전화상담종합 통계', MENU_EXPLN: '월별 전화상담 이력 정보를 톨 유형별, 통화 시간별, 일별 콜 추이 현황에 대한 통계를 확인할 수 있습니다.'});"
        ></compo-tooltip-btn>
      </div>
    </div>
    <div class="pl-card " :class="LOCATION_INFO === 'home'?'':'is-noborder pt-2'">
      <template v-if="LOCATION_INFO === 'home'">
        <div class="pl-home-call-wrap">
          <div class="pl-home-call-title mb-4">주간 응대 현황</div>
          <chartjsBarChart
            :chartData="DATA_PHONE.BarData"
            :chartOptions="DATA_PHONE.BarOptions"
            :styles="{ background: '#fff'}"
          ></chartjsBarChart>
        </div>
        <div class="pl-home-call-info is-mt-m">
          <div class="align-start">
            <strong>오늘의 응대 현황</strong>
            <span> {{ DATA_PHONE.MONITOR.week_date }}</span>
          </div>
          <div>
            <span>인입호</span>
            <strong>{{ DATA_PHONE.MONITOR.in_call }}</strong>
          </div>
          <div>
            <span>응대호</span>
            <strong>{{ DATA_PHONE.MONITOR.re_call }}</strong>
          </div>
          <div>
            <span>포기호</span>
            <strong>{{ DATA_PHONE.MONITOR.off_call }}</strong>
          </div>
          <div>
            <span>응대율</span>
            <strong>{{ DATA_PHONE.MONITOR.in_per }}%</strong>
          </div>
          <div>
            <span>서비스 레벨</span>
            <strong>{{ DATA_PHONE.MONITOR.sv_lv }}%</strong>
          </div>
        </div>
      </template>
      <template v-else>
        <h2 class="pl-subtit">주간 응대 현황</h2>
        <div class="pl-total-monitor-bar is-mt-m">
          <chartjsBarChart
            :chartData="DATA_PHONE.BarData"
            :chartOptions="DATA_PHONE.BarOptions"
            :styles="{ flex: 1, background: '#fff'}"
          ></chartjsBarChart>
          <div class="legend-container">
            <ul class="legend">
              <li v-for="(dataset, index) in DATA_PHONE.BarData.datasets" :key="index">
                <span
                  class="legend-color"
                  :style="{ backgroundColor: dataset.backgroundColor }"></span>
                {{ dataset.label }}
              </li>
            </ul>
          </div>
          <div class="pl-total-monitor-bar-info">
            <span class="pl-total-monitor-bar-info-title">총 상담 건수</span>
            <strong>{{ DATA_PHONE.MONITOR.week_response_count }}<span>건</span></strong>
            <div class="pl-total-monitor-bar-info-sub">
              상담직원 {{ DATA_PHONE.MONITOR.week_response_manager }}명
            </div>
          </div>
        </div>
        <div class="pl-total-monitor-today is-mt-s">
          <h3 class="pl-subtit is-h3">Today</h3>
          <div class="pl-total-monitor-today-info is-mt-s">
            <div>
              <span>인입호</span>
              <strong>{{ DATA_PHONE.MONITOR.in_call }}</strong>
            </div>
            <div>
              <span>응대호</span>
              <strong>{{ DATA_PHONE.MONITOR.re_call }}</strong>
            </div>
            <div>
              <span>포기호</span>
              <strong>{{ DATA_PHONE.MONITOR.off_call }}</strong>
            </div>
            <div>
              <span>응대율</span>
              <strong>{{ DATA_PHONE.MONITOR.in_per }}%</strong>
            </div>
            <div>
              <span>서비스 레벨</span>
              <strong>{{ DATA_PHONE.MONITOR.sv_lv }}%</strong>
            </div>
          </div>
          <div class="pl-total-monitor-today-sub">
            <div>
              <span>1인당 상담 건수</span>
              <strong>{{ DATA_PHONE.MONITOR.cs_one }}건</strong>
            </div>
            <div>
              <span>1인당 통화 시간</span>
              <strong>{{ DATA_PHONE.MONITOR.call_time_one }}</strong>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { callUtil } from "@/store/callUtil.js";
import chartjsBarChart from "@/components/chartjsBarChart";

export default {
  name: "MENU_home_phone_info", //name은 'MENU_' + 파일명 조합
  props: {
    LOCATION_INFO : {
      type: String
      , default : 'home'
    },
  },
  components: {
    chartjsBarChart
  },
  data() {
    return {
      DATA_PHONE: {
        MONITOR: {
          week_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
          selected_title : '',
          week_response_count: 980,
          week_response_manager: 45,
          in_call: 0,
          re_call: 0,
          off_call: 0,
          in_per: 0,
          sv_lv: 0,
          cs_one: 0,
          call_time_one: '0분 0초',
        },
        // bar chart
        BarData: {
          labels: ['01/14', '01/17', '01/18', '01/19', '01/20'],
          datasets: [
            {
              label: "인입호",
              backgroundColor: '#F59949',
              data: [0, 0, 0, 0, 0]
            },
            {
              label: "응대호",
              backgroundColor: '#4786E3',
              data: [0, 0, 0, 0, 0]
            }
          ]
        },
        BarOptions: {
          responsive: true,
          maintainAspectRatio: false,
          borderRadius: 8,
          plugins: {
            legend: {
              display: true,
              position: 'right',
              // display: false,
              // position: 'top',
              // align: 'end',
              labels: {
                padding: 20,
                boxWidth: 10,
                usePointStyle: true,
                pointStyle: 'Rounded',
              },
            },
          },
        },
      },
    }
  },

  watch: {
  },

  computed: {

  },

  created() {
    
  },

  mounted() {
    if(this.LOCATION_INFO === 'home'){ //홈에서 호출
      this.DATA_PHONE.BarOptions.plugins.legend.display = true;
      this.DATA_PHONE.BarOptions.plugins.legend.position = 'right';
      this.DATA_PHONE.BarOptions.plugins.legend.align = '';
    }else if(this.LOCATION_INFO === 'call'){//전화상담 모니터링에서 호출
      this.DATA_PHONE.BarOptions.plugins.legend.display = false;
      this.DATA_PHONE.BarOptions.plugins.legend.position = 'top';
      this.DATA_PHONE.BarOptions.plugins.legend.align = 'end';

    }

    this.getServerDate(); //기준일자 서버시간 셋팅
    this.getWeekStat();//주간 응대 현황
  },

  methods: {
    async getServerDate(){
      await this.mixin_getSvrDate("YYYYMMDDHH24MISS").then((data)=>{
        let cvDate = this.mixin_convertDate(data, 'yyyy-MM-dd(E) HH:mm:ss');

        this.DATA_PHONE.MONITOR.week_date = cvDate;
      })
    },
    //주간 응대 현황
    getWeekStat() {
      // 현재 날짜 객체 생성
      var today = new Date();
      // 5일 전 날짜 계산
      var fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(today.getDate() - 4);

      let BarData = {
            labels: [],
            datasets: [
              {
                label: "인입호",
                backgroundColor: '#F59949',
                data: [0, 0, 0, 0, 0]
              },
              {
                label: "응대호",
                backgroundColor: '#4786E3',
                data: [0, 0, 0, 0, 0]
              }
            ]
          }

      // 5일 전부터 오늘까지의 날짜 출력
      for (var d = fiveDaysAgo; d <= today; d.setDate(d.getDate() + 1)) {
        BarData.labels.push(this.mixin_rpad((d.getMonth()+1).toString(), 2, '0') + '/' + this.mixin_rpad(d.getDate(), 2, '0'))
      }
      
      this.getServerDate(); //기준일자 서버시간 셋팅
      let DATA_PHONE = this.DATA_PHONE;
      callUtil.ipcc('/api/palette_interface.php', {async : true/**비동기 */, REQ : 'home_week_stat'}, function(weekStat){
        // console.log(weekStat);
        if(weekStat != null){
          let arrDay = [];
          let arrReqData = [];
          let arrAnswerData = [];
          Object.keys(weekStat).forEach(function(v){
            arrDay.push(v.split('-')[1]+'/'+v.split('-')[2]);
            
            Object.keys(weekStat[v]).forEach(function(k){
              if(k === 'REQ_CNT') arrReqData.push(weekStat[v][k]); //인입호
              else if(k === 'ANSWER_CNT') arrAnswerData.push(weekStat[v][k]); //응대호
            });
          });
  
          BarData.labels = arrDay; //날짜
          BarData.datasets[0].data = arrReqData; //인입호
          BarData.datasets[1].data = arrAnswerData; //응대호
        }
      }); //주간 응대 현황

      DATA_PHONE.BarData = BarData;

      this.getTodayStat(); //오늘의 응대 현황
    },
    
    //오늘의 응대 현황
    getTodayStat() {
      let todayStat = callUtil.ipcc('/api/palette_interface.php', {REQ : 'home_today', SL_SEC : 20}); //오늘의 응대 현황
      // console.log(todayStat);
      if(todayStat != null){
        this.DATA_PHONE.MONITOR.in_call = todayStat.IB_CNT; //인입호
        this.DATA_PHONE.MONITOR.re_call = todayStat.ANSWER_CNT; //응대호
        this.DATA_PHONE.MONITOR.off_call = todayStat.ABANDON_CNT; //포기호
        this.DATA_PHONE.MONITOR.in_per = todayStat.ANSWER_RATE; //응대율
        this.DATA_PHONE.MONITOR.sv_lv = todayStat.SL; //서비스 레벨
      }

      if(this.LOCATION_INFO === 'call'){//전화상담 모니터링에서 호출
        this.getWeekCuslStat();//인바운드 주간 총 상담건수, 상담직원수
      }
    },
    
    //인바운드 주간 총 상담건수, 상담직원수
    getWeekCuslStat() {
      let weekCuslStat = callUtil.ipcc('/api/palette_interface.php', {REQ : 'monitor_ib_total_cnt'}); //인바운드 주간 총 상담건수, 상담직원수
      // console.log(weekCuslStat);
      if(weekCuslStat != null){
        this.DATA_PHONE.MONITOR.week_response_count = weekCuslStat.CALL_CNT; //총상담건수
        this.DATA_PHONE.MONITOR.week_response_manager = weekCuslStat.EXT_CNT; //상담직원수
      }

      if(this.LOCATION_INFO === 'call'){//전화상담 모니터링에서 호출
        this.getPersonAvgStat();//1인당 평균콜
      }
    },
    
    //1인당 평균콜
    getPersonAvgStat() {
      let personAvgStat = callUtil.ipcc('/api/palette_interface.php', {REQ : 'monitor_call_per_agent'}); //1인당 평균콜
      // console.log(personAvgStat);
      if(personAvgStat != null){
        this.DATA_PHONE.MONITOR.cs_one = personAvgStat.WEEK_AVG_IB_CALL_CNT; //1인당 상담건수

        //1인당 통화시간
        let sTimeWord = '';
        personAvgStat.WEEK_AVG_IB_CALL_TIME.split(':').forEach((time, idx) => {
          if(idx === 0 && Number(time) > 0) sTimeWord += Number(time) + '시간 ';
          else if(idx === 1) sTimeWord += Number(time) + '분 ';
          else if(idx === 2) sTimeWord += Number(time) + '초';
        });
        this.DATA_PHONE.MONITOR.call_time_one = sTimeWord; //1인당 통화시간
      }
    },
  },
}
</script>

<style></style>
