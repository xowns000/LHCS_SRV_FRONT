import api from "@/store/apiUtil";

const commonStore = {
  namespaced: true,
  state: () => ({
    tab: [], //전체 탭
    no_cash_tab: [], //전체 탭
    active_tab: {
      num: 0,
      id: "",
      title: "",
      link: "",
    },
    help_dialog: false,
    help_dialog_id: "",
    progress_bar: false,
    page_path: '',
    primaryColor: '#4c5cbb',
    settingSlide: false,
    chatFontSize: 13,
    custcoSetting : {}, //환경설정
    settingShortcut: [ //환경설정 > 단축키
      {
        id: 0,
        keycode: '`',
        path: '/home',
        title: '홈',
        disabled: true,
      },
      {
        id: 1,
        keycode: '1',
        path: '/CSL_M0100',
        title: '전화상담'
      },
      {
        id: 2,
        keycode: '2',
        path: '/CSL_M0200',
        title: 'SNS상담'
      },
      {
        id: 3,
        keycode: '3',
        path: '/CSL_M0301',
        title: '전화상담 이력'
      },
      {
        id: 4,
        keycode: '4',
        path: '/CSL_M0602',
        title: '문자 메시지 관리'
      },
      {
        id: 5,
        keycode: '5',
        path: '/CSL_M0604',
        title: '알림톡 관리'
      },
      {
        id: 6,
        keycode: '6',
        path: '/CLD_M0000',
        title: '캘린더'
      },
      {
        id: 7,
        keycode: '7',
        path: '/MTG_M0100',
        title: '전화상담 모니터링'
      },
    ],
    isAlarm: true,
  }),
  getters: {
    GE_COMMON_TAB: (state) => state.tab,
    GE_COMMON_NO_CASH_TAB: (state) => state.no_cash_tab,
    GE_COMMON_ACTIVE_TAB: (state) => state.active_tab,
    GE_COMMON_ACTIVE_TAB_NUM: (state) => state.active_tab.num,
    GE_COMMON_ACTIVE_TAB_ID: (state) => state.active_tab.id,
    GE_COMMON_ACTIVE_TAB_TITLE: (state) => state.active_tab.title,
    GE_COMMON_HELP_DIALOG: (state) => state.help_dialog,
    GE_COMMON_HELP_DIALOG_ID: (state) => state.help_dialog_id,
    GE_COMMON_PROGRESS_BAR: (state) => state.progress_bar,
    GE_COMMON_PAGE_PATH: (state) => state.page_path,
    GE_COMMON_PRIMARYCOLOR: (state) => state.primaryColor,
    GE_CUSTCO_SETTING: (state) => state.custcoSetting,
    GE_COMMON_SETTING_SLIDE: (state) => state.settingSlide,
    GE_COMMON_SETTING_FONTSIZE: (state) => state.chatFontSize,
    GE_COMMON_SETTING_IS_ALARM: (state) => state.isAlarm,
    GE_COMMON_SETTING_SHORTCUT: (state) => state.settingShortcut,
    // GE_COMMON_ACTIVE_TAB_NUM: state => state.active_tab_num,
    // GE_COMMON_ACTIVE_TAB_ID: state => state.active_tab_id,
    // GE_COMMON_ACTIVE_TAB_TITLE: state => state.active_tab_title,
  },
  mutations: {
    MU_COMMON_REFRESH_TAB: (state, data) => {
      console.log( state.tab );
      console.log( data );
    },
    MU_COMMON_ACTIVE_TAB: (state, data) => {

      /* 여기서는 payload를 객체로 받습니다.
         payload를 객체로 받으면, mutation를 조금더 유연하게 사용할 수 있기는 합니다. */
      let aleady = false; //기존에 있는 탭인지 여부
      //setTimeout(function () {
        //기존에 탭에 있는 탭인지 확인
        for (let i = 0; i < state.tab.length; i++) {
          if (state.tab[i].id === data.id) {
            aleady = true;
            state.active_tab.num = i; //기존 열려 있는 탭을 활성화 시킨다
          }
        }

        //기존에 열려 있는 탭이 아닌 신규탭이면 탭을 추가하고 활성화 시킨다
        if (aleady === false) {
          state.tab.push({
            id: data.id,
            title: data.title,
            icon: data.tabIcon,
            link: data.link,
            FULL_PATH: data.FULL_PATH,
            MENU_EXPLN: data.MENU_EXPLN,
            AUTO_CARRY_OUT: data.AUTO_CARRY_OUT,
          });
          state.active_tab.num = state.tab.length - 1;
        }

        state.active_tab.id = data.id;
        state.active_tab.title = data.title;
        state.active_tab.link = data.link;

        //탭삭제
        for (let a = 0; a < state.no_cash_tab.length; a++) {
          if (state.no_cash_tab[a] === data.id) {
            state.no_cash_tab.splice(a, 1);
          }
        }

      //}, 100);
    },
    MU_COMMON_DEACTIVE_TAB: (state, data) => {

      setTimeout(function () {
        //탭삭제
        for (let i = 0; i < state.tab.length; i++) {
          if (state.tab[i].id === data.id) {
            state.tab.splice(i, 1);
          }
        }

        //삭제한 탭이 마지막 탭이거나 삭제한탭이 활성화 중인 탭이면
        //삭제한 후 남아있는 마지막 탭으로 이동
        if (
          state.active_tab.num > state.tab.length - 1 ||
          state.active_tab.id === data.id
        ) {
          state.active_tab.num = state.tab.length - 1;
          state.active_tab.id = state.tab[state.tab.length - 1].id;
          state.active_tab.title = state.tab[state.tab.length - 1].title;
          state.active_tab.link = state.tab[state.tab.length - 1].link;
        }

        //cache 하지 않아야 하는 탭리스트에 추가
        state.no_cash_tab.push(data.id);
      }, 100);
    },
    MU_COMMON_INIT_TAB: (state, data) => {
      state.tab = data;
      if (state.tab.length > 0) {
        state.active_tab.num = 0;
        state.active_tab.id = state.tab[0].id;
        state.active_tab.title = state.tab[0].title;
        state.active_tab.link = state.tab[0].link;

        if( state.page_path ) {
          state.page_path.TITLE = state.tab[0].title;
          state.page_path.PATH = state.tab[0].title;
          state.page_path.EXPLN = state.tab[0].title;
        }
      }
    },
    MU_COMMON_DELETE_ALL_TAB: (state, data) => {
      let change_action_tab = true;

      //기본(default가 'Y')탭을 제외하고 모든탭을 삭제한다
      for (let i = 0; i < state.tab.length; i++) {
        if (state.tab[i].default !== "Y") {
          state.tab.splice(i, 1);
          i--;
        } else {
          //현재 열려있는 탭이 기본탭이면 탭변경을 하지 않는다
          if (state.active_tab.id === state.tab[i].id) {
            change_action_tab = false;
          }
        }
      }

      //탭을 변경한다
      if (change_action_tab === true && state.tab.length > 0) {
        state.active_tab.num = 0;
        state.active_tab.id = state.tab[0].id;
        state.active_tab.title = state.tab[0].title;
        state.active_tab.link = state.tab[0].link;
      }
    },
    MU_COMMON_HELP_DIALOG: (state, data) => {
      state.help_dialog = data.type;
    },
    MU_COMMON_HELP_DIALOG_ID: (state, data) => {
      state.help_dialog_id = data.id;
    },
    MU_COMMON_PROGRESS_BAR: (state, data) => {
      state.progress_bar = data;
    },
    MU_COMMON_PAGE_PATH: (state, data) => {
      state.page_path = data;
    },
    MU_SET_PRIMARYCOLOR(state, newColor) {
      state.primaryColor = newColor;
    },
    MU_SETTING_SLIDE(state, data) {
      state.settingSlide = data;
    },
    MU_SETTING_FONTSIZE(state, data) {
      state.chatFontSize = data;
    },
    MU_CUSTCO_SETTING: (state, data) => {
      state.custcoSetting = data;
    },
    MU_SETTING_SHORTCUT(state, data) { //환경설정 > 단축키
      state.settingShortcut = data;
    },
    MU_SETTING_IS_ALARM(state, data) {
      state.isAlarm = data;
    },


  },
  actions: {
    //신규탭 생성
    async AC_COMMON_REFRESH_TAB({ commit }, data) {
      commit("MU_COMMON_REFRESH_TAB", data);
    },
    //신규탭 생성
    async AC_COMMON_ACTIVE_TAB({ commit }, data) {
      commit("MU_COMMON_ACTIVE_TAB", data);
    },
    //탭 삭제
    async AC_COMMON_DEACTIVE_TAB({ commit }, data) {
      commit("MU_COMMON_DEACTIVE_TAB", data);
    },
    //탭 초기화
    async AC_COMMON_INIT_TAB({ commit }, data) {
      commit("MU_COMMON_INIT_TAB", data);
    },
    //탭 전체삭제
    async AC_COMMON_DELETE_ALL_TAB({ commit }, data) {
      commit("MU_COMMON_DELETE_ALL_TAB", data);
    },
    //HELP DIALOG 상태 변경
    async AC_COMMON_HELP_DIALOG({ commit }, data) {
      commit("MU_COMMON_HELP_DIALOG", data);
    },
    //HELP DIALOG ID 셋팅
    async AC_COMMON_HELP_DIALOG_ID({ commit }, data) {
      commit("MU_COMMON_HELP_DIALOG_ID", data);
    },
    //HELP DIALOG ID 셋팅
    async AC_COMMON_PROGRESS_BAR({ commit }, data) {
      commit("MU_COMMON_PROGRESS_BAR", data);
    },
    // 메인컬러 변경
    async AC_CHANGE_PRIMARYCOLOR({ commit }, newColor) {
      commit('MU_SET_PRIMARYCOLOR', newColor);
    },
    // 셋팅 슬라이드
    async AC_COMMON_SETTING_SLIDE({ commit }, data) {
      commit('MU_SETTING_SLIDE', data);
    },
    // 셋팅 채팅창 폰트 사이즈
    async AC_COMMON_SETTING_FONTSIZE({ commit }, data) {
      commit('MU_SETTING_FONTSIZE', data);
    },
    // 고객사 환경설정
    async AC_CUSTCO_SETTING({ commit }, data) {
      commit('MU_CUSTCO_SETTING', data);
    },
    // 환경설정 > 단축키
    async AC_COMMON_SETTING_SHORTCUT({ commit }, data) {
      commit('MU_SETTING_SHORTCUT', data);
    },

    // 알람표시 적용여부
    async AC_COMMON_SETTING_IS_ALARM({ commit }, data) {
      commit('MU_SETTING_IS_ALARM', data);
    },

  },
};

export default commonStore;
