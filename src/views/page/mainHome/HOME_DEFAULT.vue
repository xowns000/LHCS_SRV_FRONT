<template>
  <div class="pl-container pl-cols type-home">
    <!-- 상담원정보 -->
    <home-cs-info
      :DataProp="CS_INFO"
      class="pl-card-wrap is-col-fix pl-home-cs-info-wrap"
      style="width: 504px;"
    />
    <div class="pl-home-status">
      <!-- 전화 상담 -->
      <home-phone-info
        class="pl-card-wrap"
        LOCATION_INFO="home"
      />
      <!-- sns 상담 -->
      <home-sns
        :DataProp="DATA_SNS"
        class="pl-card-wrap"
      />
    </div>
  
    <div class="pl-home-status is-col-fix" style="width: 445px;">
      <!-- 캘린더 -->
      <home-calendar
        :DataProp="CALENDAR_DATA"
        class="pl-card-wrap"
      />
  
      <!-- 게시판 -->
      <home-bbs
        :DataProp="BBS_DATA"
        class="pl-card-wrap pl-home-bbs-wrap"
        style="height: 250px;"
      />
    </div>
  </div>
  </template>
  
  <script>
  import { eventBus } from "@/store/eventBus.js";           //Event Bus
  import HomeCsInfo from '@/views/page/mainHome/HomeCsInfo.vue';
  import HomePhoneInfo from '@/views/page/mainHome/HomePhoneInfo.vue';
  import HomeSns from '@/views/page/mainHome/HomeSns.vue';
  import HomeCalendar from '@/views/page/mainHome/HomeCalendar.vue';
  import HomeBbs from '@/views/page/mainHome/HomeBbs.vue';
  export default {
    name: "HOME_DEFAULT", //기본 고객센터 HOME
    components: {
      HomeCsInfo,
      HomePhoneInfo,
      HomeSns,
      HomeCalendar,
      HomeBbs,
    },
    data() {
      return {
        // 상담 현황
        CS_INFO: {
          CUS_INFO: {
            name: '나상담',
            in_call: '1004',
            company: '한국클라우드 cs-5팀',
            role: 'Manager',
            portrait: require('@/assets/img/@profile_user.png'), //사이즈  69x69
            black: true, //블랙리스트 여부
            place: '한국클라우드 대성디폴리스 431호',
            email: 'heons@hkcloud.co.kr',
            phone: '010-5303-4545'
          },
  
        },
  
        // SNS상담
        DATA_SNS: {
          // donught chart
          // DonughtData: {
          //   labels: ["SNS", "웹쳇", "이메일", "게시판"],
          //   datasets: [
          //     {
          //       backgroundColor: ['#8591E1', '#FAA7A8', '#FFB72C', '#7FC379', '#4BC8F5'],
          //       data: [30, 40, 20, 30]
          //     }
          //   ]
          // },
          // DonughtOptions: {
          //   responsive: true,
          //   maintainAspectRatio: false,
          //   plugins: {
          //     legend: {
          //       display: true,
          //       position: 'right',
          //       labels: {
          //         padding: 10,
          //         boxWidth: 10,
          //         usePointStyle: true,
          //         pointStyle: 'Rounded',
          //       },
          //     }
          //   },
          // },
          // DonughtEmTxt: 32,
          in_ch: '카카오톡',
          in_ch_icon: 'mainchat-kakao', //mainchat-kakao, mainchat-teletalk, mainchat-talk, is-email
  
          // grid
          page: 1,
          pageCount: 0,
          ROW_PER_PAGE: -1,
          headers: [
            { text: '채널', value: 'index1', align: 'center', sortable: false },
            { text: '인입', value: 'index2', align: 'center', sortable: false , },
            { text: '대기중', value: 'index3', align: 'center', sortable: false , },
            { text: '상담할당', value: 'index4', align: 'center', sortable: false , },
            { text: '상담중', value: 'index5', align: 'center', sortable: false , },
            { text: '후처리', value: 'index6', align: 'center', sortable: false , },
            { text: '상담완료', value: 'index7', align: 'center', sortable: false , },
          ],
          items: [
            {
              index1: '카카오톡',
              index2: 110,
              index3: 110,
              index4: 110,
              index5: 110,
              index6: 110,
              index7: 99.06,
            },
            {
              index1: 'T-Talk',
              index2: 110,
              index3: 110,
              index4: 110,
              index5: 110,
              index6: 110,
              index7: 99.06,
            },
            {
              index1: '이메일',
              index2: 110,
              index3: 110,
              index4: 110,
              index5: 110,
              index6: 110,
              index7: 99.06,
            },
            {
              index1: '게시판',
              index2: 110,
              index3: 110,
              index4: 110,
              index5: 110,
              index6: 110,
              index7: 99.06,
            },
        ],
  
        },
  
        // 캘린더
        CALENDAR_DATA: {
          CALENDAR_MONITOR: [
            { title: '나의 일정', count: 12},
            { title: '센터 일정', count: 12},
            { title: '주간 일정', count: 12},
            { title: '중요 일정', count: 12},
          ],
          CALENDAR_CARD: {
            today: {
              title: '오늘의 시험',
              badge_txt: '미응시',
              badge_color: 'blue',
              icon: 'test',
              desc: '진행중인 시험이 있습니다.'
            },
            qc: {
              title: '나의 품질평가',
              badge_txt: '',
              badge_color: '',
              icon: 'qc_mark',
              desc: '진행해야 할 QA 평가가 있습니다.'
            },
          },
          CALENDAR_LIST: [
            { title: '미해결 콜백', count: 9, },
            { title: '미해결 예약콜', count: 9, },
            { title: '캠페인 현황', count: 9, maxCount: 100 },
          ],
        },
        // 공지사항
        BBS_DATA: {
          NOTICE_ARR: [
            {
              subject: '센터 설립 기념일 행사 안내',
              date: '2023.01.16',
              badge: true,
              badge_text: 'NEW'
            },
            {
              subject: '센터 설립 기념일 행사 안내',
              date: '2023.01.16',
              badge: false,
            },
            {
              subject: '센터 설립 기념일 행사 안내',
              date: '2023.01.16',
              badge: false,
            },
            {
              subject: '센터 설립 기념일 행사 안내',
              date: '2023.01.16',
              badge: false,
            },
            {
              subject: '센터 설립 기념일 행사 안내',
              date: '2023.01.16',
              badge: false,
            },
          ],
          BOARD_ARR: [
          {
              subject: '센터 설립 기념일 행사 안내',
              date: '2023.01.16',
              badge: true,
              badge_text: 'NEW'
            },
            {
              subject: '센터 설립 기념일 행사 안내',
              date: '2023.01.16',
              badge: false,
            },
            {
              subject: '센터 설립 기념일 행사 안내',
              date: '2023.01.16',
              badge: false,
            },
            {
              subject: '센터 설립 기념일 행사 안내',
              date: '2023.01.16',
              badge: false,
            },
            {
              subject: '센터 설립 기념일 행사 안내',
              date: '2023.01.16',
              badge: false,
            },
          ],
        },
  
        dialogPwdChange: false,
      }
    },
  
    watch: {
      
  
    },
  
    computed: {
  
    },
  
    created() {
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
  
    },
  
    mounted() {
  
    },
  
    methods: {
      pwdChange(){
        this.closeMsg();
        eventBus.pwdChange()
      },
      closeMsg() {
        this.$store.commit("alertStore/hideAlert");
      },
  
    },
  }
  </script>
  
  <style></style>
  