<template>
  <div
    class="pl-container type-home "
    style="display: grid; grid-template-columns: repeat(4, 1fr); grid-gap: 16px; "
    >
    <!-- 프로필 -->
    <div class="pl-card-wrap pl-home-cs-info-wrap" style="grid-row: 1 / 2; grid-column: 1 / 2;">
      <div class="pl-card-top is-noborder">
        <div class="pl-home-cs-my">
          <div class="align-self-start pl-portrait">
            <img :src="require('@/assets/img/@profile_user.png')" :alt="USER_PROFILE.userName ? USER_PROFILE.userName : '성명미상'" />
          </div>
          <div class="ml-4">
            <strong class="pl-card-top-title" >
              {{ USER_PROFILE.userName }}
            </strong>
            <div>{{ USER_PROFILE.company ? USER_PROFILE.company.CD_NM: '' }}</div>
            <div>{{ USER_PROFILE.atrtGroupNm }}</div>
          </div>
        </div>
        <div class="pl-home-cs-info">
          <div>
            <v-icon class="pl-icon20 place-msg"></v-icon>
              {{ USER_PROFILE.OFC_ADDR }}</div>
          <div>
            <v-icon class="pl-icon20 email"></v-icon>
              {{ USER_PROFILE.EMAIL }}</div>
          <div>
            <v-icon class="pl-icon20 phone"></v-icon>
              {{ USER_PROFILE.PHN_NO ? mixin_setPhoneNo(USER_PROFILE.PHN_NO.replace(/[^0-9]/g, "")) : '' }} </div>
        </div>
      </div>
    </div>
    <!-- 설문조사 계획 관리 -->
    <div class="pl-card-wrap" style="grid-row: 1 / 2; grid-column: 2 / 5;">
      <div
        class="pl-card-top">
        <strong class="pl-card-top-title">{{ SRVY_YEAR }}년 {{ SRVY_MONTH }}월 설문조사 현황<span class="is-txt-blue">(전체)</span></strong>
        <div class="pl-btn-wrap ml-auto align-self-start">
          <compo-tooltip-btn
            TitleProp="새로고침"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="[getStatusStat(),getBySeStat()]"
          ></compo-tooltip-btn>
          <compo-tooltip-btn
            TitleProp="설문조사 계획 관리 바로가기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 plus"
            TooltipPositionProp="bottom"
            @btnClick="goRouter(SRVY_MENU_M0100)"
          ></compo-tooltip-btn>
        </div>
      </div>
      <div class="pl-card">
        <div class="pl-cols">
          <ul class="pl-list-info4">
            <li
              class="justify-center"
              v-for="(item, index) in STATUS_STAT"
              :key="`STATUS_STAT-${index}`">
              <div class="pl-list-icon">
                <v-icon :class="`pl-icon30 ${ item.icon }`" ></v-icon>
              </div>
              <span class="pl-list-info-title is-mt-m">{{ item.label }}</span>
              <strong class="pl-list-info-desc">{{ item.count }}</strong>
            </li>
          </ul>
          <div class="is-col-fix ml-4" style="width: 300px">
            <div class="is-mt-m" >
              <chartjsBarChart
                class="is-mt-m h160 px-4"
                :chartData="SE_STAT.bar_data"
                :chartOptions="SE_STAT.bar_option"
                :styles="{ background: '#fff' }"
              ></chartjsBarChart>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 참여율, 달성율 통계 -->
    <div class="pl-card-wrap" style="grid-row: 2 / 6; grid-column: 1 / 4;">
      <div
        class="pl-card-top">
        <strong class="pl-card-top-title">
          <v-select
            class="pl-form"
            style="width: 800px;"
            v-model="RATE_TYPE"
            :items="RATE_TYPE_ITEMS"
            @change="getRateStat()"
          ></v-select>
        </strong>
        <div class="pl-btn-wrap ml-auto align-self-start">
          <compo-tooltip-btn
            TitleProp="새로고침"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="getRateStat()"
          ></compo-tooltip-btn>
          <compo-tooltip-btn
            TitleProp="설문결과 분석 바로가기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 plus"
            TooltipPositionProp="bottom"
            @btnClick="goRouter(SRVY_MENU_M0300)"
          ></compo-tooltip-btn>
        </div>
      </div>
      <div class="pl-card">
        <chartjsBarChart
          class="is-mt-m h400 px-4"
          :chartData="RATE_STAT.bar_data"
          :chartOptions="RATE_STAT.bar_option"
          :styles="{ background: '#fff' }"
        ></chartjsBarChart>
      </div>
    </div>
    <!-- 설문지 생성 관리 -->
    <div class="pl-card-wrap" style="grid-row: 2 / 4; grid-column: 4 / 5;">
      <div
        class="pl-card-top">
        <strong class="pl-card-top-title">발송 유형별 현황</strong>
        <div class="pl-btn-wrap ml-auto align-self-start">
          <compo-tooltip-btn
            TitleProp="새로고침"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="getBySndngSeStat()"
          ></compo-tooltip-btn>
          <compo-tooltip-btn
            TitleProp="설문지 생성 관리 바로가기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 plus"
            TooltipPositionProp="bottom"
            @btnClick="goRouter(SRVY_MENU_M0200)"
          ></compo-tooltip-btn>
        </div>
      </div>
      <div class="pl-card">
        <div class="is-mt-m" >
          <chartjsDoughnutChart
            class="is-mt-m h160 px-4"
            :chartData="SNDNG_SE_STAT.donught_data"
            :chartOptions="SNDNG_SE_STAT.donught_option"
            :styles="{ background: '#fff' }"
          ></chartjsDoughnutChart>
        </div>
      </div>
    </div>
    <!-- 설문조사 승인 관리 -->
    <div class="pl-card-wrap" style="grid-row: 4 / 6; grid-column: 4 / 5;">
      <div
        class="pl-card-top">
        <strong class="pl-card-top-title">설문조사 승인 현황</strong>
        <div class="pl-btn-wrap ml-auto align-self-start">
          <compo-tooltip-btn
            TitleProp="새로고침"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="getApprStat()"
          ></compo-tooltip-btn>
          <compo-tooltip-btn
            TitleProp="설문조사 승인 관리 바로가기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 plus"
            TooltipPositionProp="bottom"
            @btnClick="goRouter(SRVY_MENU_M0500)"
          ></compo-tooltip-btn>
        </div>
      </div>
      <div class="pl-card">
        <ul class="pl-list-info4 flex-wrap">
          <li
            v-for="item in APPR_STAT"
            :key="item.id"
            style="flex: 0 0 48%;">
            <span class="pl-list-info-title">{{ item.label }}</span>
            <strong class="pl-list-info-desc">{{ item.count }}</strong>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { eventBus } from "@/store/eventBus.js";           //Event Bus
import chartjsDoughnutChart from "@/components/chartjsDoughnutChart";
import chartjsBarChart from "@/components/chartjsBarChart";

export default {
  name: "HOME_SURVEY", //설문조사 전용 서비스 HOME - 2024 LH주거복지정보 사업에서 HOME 분기시킴.
  components: {
    chartjsBarChart,
    chartjsDoughnutChart
  },
  data() {
    return {
      // 프로필
      USER_PROFILE: {},
      
      SRVY_YEAR: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 7).split("-")[0],
      SRVY_MONTH: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 7).split("-")[1],
      SRVY_YEAR_MONTH:'',
      SRVY_MENU: [],
      //설문조사 계획 관리 메뉴
      SRVY_MENU_M0100: {},
      //설문결과 분석 메뉴
      SRVY_MENU_M0300: {},
      //설문지 생성 관리 메뉴
      SRVY_MENU_M0200: {},
      //설문조사 승인 관리 메뉴
      SRVY_MENU_M0500: {},

      sndngSeCdItems: [
        { text: "문자", value: 'SMS'},
        { text: "알림톡", value: 'ATALK'},
        { text: "이메일", value: 'EMAIL'},
      ],

      // 발송 유형별 현황 차트
      noDataDatasets: [
        {
          backgroundColor: [],
          data: [],
          noData: true
        }
      ],

      // 설문조사 현황
      STATUS_STAT: [
        {icon: 'write', label:'설문등록 건수', count: 0},
        {icon: 'ready', label:'설문준비 건수', count: 0},
        {icon: 'progress', label:'설문진행 건수', count: 0},
			  {icon: 'done', label:'설문종료 건수', count: 0},
      ],

      //설문 구분별 통계
      SE_STAT: {
        bar_data: {
          labels: [],
          datasets: [],
        },
        bar_option: {
          responsive: true,
          maintainAspectRatio: false,
          borderRadius: 8,
          plugins: {
            legend: {
              display: false,
            }
          },
        },
      },

      //
      RATE_TYPE_ITEMS: [
        {text: '진행중인 설문조사별 참여율(%) 현황', value: 'RSPNS'},
        {text: '진행중인 설문조사별 참여율(%) 현황 - 참여인원 TOP 3', value: 'RSPNS_TOP3'},
        {text: '목표인원 설문조사별 달성율(%) 현황', value: 'GOAL'}
      ],
      RATE_TYPE: 'RSPNS',

      // 설문결과 분석
      RATE_STAT: {
        resData: [],
        bar_data: {
          labels: [],
        datasets: [],
        },
        bar_option: {
          responsive: true,
          maintainAspectRatio: false,
          barThickness: 16,
          borderRadius: 8,
          indexAxis: 'y',
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (item) => {
                  return [`${item.formattedValue}%`,`${this.RATE_STAT.resData[item.dataIndex].COUNT}/${this.RATE_STAT.resData[item.dataIndex].TOT_COUNT}명`]
                }
              },
            },

          },
        },

      },

      // 설문지 생성 관리
      SNDNG_SE_STAT: {
        donught_data: {
          labels: [],
          datasets: []
        },
        donught_option: {
          responsive: true,
          maintainAspectRatio: false,
          borderWidth: 0,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                padding: 20,
                boxWidth: 10,
                usePointStyle: true,
                pointStyle: 'Rounded',
              },
            }
          },
        },

      },

      // 설문조사 승인 관리
      APPR_STAT: [
          { count: 0, label: '승인완료 건수' },
          { count: 0, label: '승인대기 건수' },
          { count: 0, label: '승인반려 건수' },
          { count: 0, label: '승인회수 건수' },
      ],

    }
  },

  watch: {
  },

  computed: {

  },

  async created() {
    if(this.$store.getters["userStore/GE_PWD_CHANGE_YN"] === 'N'){
      eventBus.pwdChange();
    }
    if(this.$store.getters["userStore/GE_ELAPSED_DATE"] == 90 || this.$store.getters["userStore/GE_ELAPSED_DATE"] > 90){
      this.showToast({  msg: ' 소중한 개인정보 보호를 위해 비밀번호를 변경해 주세요. ', class: 'warning', hasToastIcon: true, icon: 'mdi-information-outline', time: 10000 })
      eventBus.pwdChange();
    }else if(this.$store.getters["userStore/GE_ELAPSED_DATE"] < 90 && this.$store.getters["userStore/GE_ELAPSED_DATE"] > 84){
      let Day = 90;
      this.showAlert({
            alertDialogToggle: true
            , msg:
              '비밀번호 만료일이 <strong class="is-txt-error">'+(Day-this.$store.getters["userStore/GE_ELAPSED_DATE"])+'</strong>일 남았습니다.<br/> \n'+
              // '관련 법령 상 이용자는 3개월마다 비밀번호를 변경하도록 권고하고 있습니다.\n' +
              // '유효기간 만료 시 계정이 잠금처리 되오니 비밀번호를 변경해주시기 바랍니다.\n\n'+
              '관련 법령상 이용자는 3개월마다 비밀번호를 변경하도록 권고하고 있으며,\n'+
              '비밀번호 유효기간이 만료된 계정은 이용에 제한을 두고 있습니다.\n\n'+
              '비밀번호를 변경하시겠습니까?'
            , iconClass: 'is-info'
            , type: 'confirm'
            , callYes: this.pwdChange
            , callNo: this.closeMsg
          })
    }

    this.SRVY_YEAR_MONTH = this.SRVY_YEAR + this.SRVY_MONTH;


    this.SRVY_MENU = this.user_menu.find(item => {
      return item.PATH_NM == "/SVY_M0000"
    }).child;

    //설문조사 계획 관리 메뉴
    this.SRVY_MENU_M0100 = this.SRVY_MENU.find(item => {
      return item.PATH_NM == "/SVY_M0100"
    }),
    //설문결과 분석 메뉴
    this.SRVY_MENU_M0300 = this.SRVY_MENU.find(item => {
      return item.PATH_NM == "/SVY_M0300"
    }),
    //설문지 생성 관리 메뉴
    this.SRVY_MENU_M0200 = this.SRVY_MENU.find(item => {
      return item.PATH_NM == "/SVY_M0200"
    }),
    //설문조사 승인 관리 메뉴
    this.SRVY_MENU_M0500 = this.SRVY_MENU.find(item => {
      return item.PATH_NM == "/SVY_M0500"
    })

    this.init();
    
    setTimeout(() => {
      //OFC_ADDR 정보가 바로 출력이 안되서 timeout 걸었음.
      this.USER_PROFILE = this.$store.getters["userStore/GE_USER_ROLE"];
    }, 500);

    
    
  },

  mounted() {
    
  },

  methods: {
    pwdChange(){
      this.closeMsg();
      eventBus.pwdChange()
    },
    async init() {
      this.getStatusStat();
      this.getBySeStat();
      this.getRateStat();
      this.getBySndngSeStat();
      this.getApprStat();
    },

    goRouter(item) {
      //this.$router.push('/SVY_M0100');
      this.mixin_set_active_tab(item)
    },

    /**
     * 설문조사 현황 통계 조회
     */
    async getStatusStat() {
      const sUrl = '/api/svy/home/selectStatusStat';
      const postParam = {
        SRVY_YEAR_MONTH : this.SRVY_YEAR_MONTH             //현재년월
      }
      const headParam = {
        head: {}
      }
      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (!resData.HEADER.ERROR_FLAG) {
        const stat = resData.DATA[0];
        this.STATUS_STAT[0].count = stat.TOT_COUNT;
        this.STATUS_STAT[1].count = stat.PRPARG_COUNT;
			  this.STATUS_STAT[2].count = stat.ONGONG_COUNT;
			  this.STATUS_STAT[3].count = stat.TERMIAT_COUNT;
      }
    },

    /**
     * 설문 구분별 통계 조회
     */
    async getBySeStat() {
      this.SE_STAT.bar_data.datasets = this.noDataDatasets;
      const sUrl = '/api/svy/home/selectBySeStat';
      const postParam = {
        SRVY_YEAR_MONTH : this.SRVY_YEAR_MONTH             //현재년월
      }
      const headParam = {
        head: {}
      }
      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (!resData.HEADER.ERROR_FLAG) {
        let labels = [];
        let backgroundColor = [];
        let data = [];
        resData.DATA.map(item => {
          labels.push(item.CD_NM)
          backgroundColor.push('#4786E3')
          data.push(item.SRVY_COUNT)
        });
        if(resData.DATA.length > 0) {
          const datasets = [{
            'backgroundColor': backgroundColor,
            'data': data,
            'noData': false
          }];
          this.SE_STAT.bar_data.labels = labels;
          this.SE_STAT.bar_data.datasets = datasets;
        }
      }
    },

    /**
     * 진행중인 설문조사별 참여율(%) 현황 통계 조회
     * 목표인원 설문조사별 달성율(%) 현황 통계 조회
     */
    async getRateStat() {
      this.RATE_STAT.resData = [];
      this.RATE_STAT.bar_data.datasets = this.noDataDatasets;
      let sUrl = '';
      if(this.RATE_TYPE == 'RSPNS' || this.RATE_TYPE == 'RSPNS_TOP3') {
        sUrl = '/api/svy/home/selectRspnsRateStat';
      } else if(this.RATE_TYPE == 'GOAL') {
        sUrl = '/api/svy/home/selectGoalRateStat';
      }
      let postParam = {
        SRVY_YEAR_MONTH : this.SRVY_YEAR_MONTH             //현재년월
      }
      if(this.RATE_TYPE == 'RSPNS_TOP3') {
        postParam.TOP3_YN = 'Y'
      }
      const headParam = {
        head: {}
      }
      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (!resData.HEADER.ERROR_FLAG) {
        this.RATE_STAT.resData = resData.DATA;
        let labels = [];
        let backgroundColor = [];
        let data = [];
        this.RATE_STAT.resData.map(item => {
          labels.push(item.SRVY_NM)
          backgroundColor.push('#4786E3')
          data.push(item.RATE)
        });
        if(this.RATE_STAT.resData.length > 0) {
          const datasets = [{
            'backgroundColor': backgroundColor,
            'data': data,
            'noData': false
          }];
          this.RATE_STAT.bar_data.labels = labels;
          this.RATE_STAT.bar_data.datasets = datasets;
        }
      }
    },


    /**
     * 발송 유형별 현황 통계 조회
     */
    async getBySndngSeStat() {
      this.SNDNG_SE_STAT.donught_data.datasets = this.noDataDatasets;
      const sUrl = '/api/svy/home/selectBySndngSeStat';
      const postParam = {
        SRVY_YEAR_MONTH : this.SRVY_YEAR_MONTH             //현재년월
      }
      const headParam = {
        head: {}
      }
      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (!resData.HEADER.ERROR_FLAG) {

        let labels = [];
        let backgroundColor = [];
        let data = [];
        resData.DATA.map((item, idx) => {
          item.SNDNG_SE_NM = this.sndngSeCdItems.find(seCd => {
            return seCd.value == item.SNDNG_SE_CD
          }).text;
          labels.push(item.SNDNG_SE_NM)
          backgroundColor.push(item.COLOR)
          data.push(item.SEND_COUNT)
        });

        if(resData.DATA.length > 0) {
          const datasets = [{
            'backgroundColor': backgroundColor,
            'data': data,
            'noData': false
          }];
          this.SNDNG_SE_STAT.donught_data.labels = labels;
          this.SNDNG_SE_STAT.donught_data.datasets = datasets;
        }
      }
    },

    /**
     * 설문조사 승인 현황 통계 조회
     */
    async getApprStat() {
      const sUrl = '/api/svy/home/selectApprStat';
      const postParam = {
        SRVY_YEAR_MONTH : this.SRVY_YEAR_MONTH             //현재년월
      }
      const headParam = {
        head: {}
      }
      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (!resData.HEADER.ERROR_FLAG) {
        const stat = resData.DATA[0];
        this.APPR_STAT[0].count = stat.APPR_COUNT;
        this.APPR_STAT[1].count = stat.RDY_COUNT;
			  this.APPR_STAT[2].count = stat.RFSL_COUNT;
			  this.APPR_STAT[3].count = stat.RTRVL_COUNT;
      }
    },


    
  },
}
</script>

  <style></style>
