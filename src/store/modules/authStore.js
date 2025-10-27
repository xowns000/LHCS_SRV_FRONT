import api from "@/store/apiUtil";

const authStore = {
  namespaced: true,
  state: () => ({
    token: "", //token
    login_result: null,
    login_data: null,
    jsessionid:"",      //Arthur.Kim 2022.04.29 세션ID
    //jsessionid:"",      //Arthur.Kim 2022.04.29 세션ID
    custco_tenant_id:"",    //멀티테넌시(multitenancy) 처리 :CUSTCO_TENANT_ID를 스토리지에 저장하여 api 호출 시 사용. by hjh
    login_temp_data: null,  // @njy SMS 인증용 임시 데이터, SMS인증이 성공하면 저장된 login_temp_data로 로그인 완료 처리 후 사용자 정보를 세팅함, 인증이 끝나면 삭제
  }),
  getters: {
    GE_AUTH_TOKEN: (state) => state.token,
    GE_AUTH_LOGIN_RESULT: (state) => state.login_result,
    GE_AUTH_LOGIN_DATA: (state) => state.login_data,
    GE_AUTH_JSESSIONID: (state) => state.jsessionid,    //Arthur.Kim 2022.04.29 세션ID
    //GE_AUTH_JSESSIONID: (state) => state.jsessionid,    //Arthur.Kim 2022.04.29 세션ID
    GE_CUSTCO_TENANT_ID: (state) => state.custco_tenant_id,       //멀티테넌시(multitenancy) 처리 : CUSTCO_TENANT_ID를 스토리지에 저장하여 api 호출 시 사용. by hjh
    GE_CERT_CUSTCO_ID: (state) => state.cert_custco_id,       //  @njy CERT_CUSTCO_ID 를 스토리지에 저장하여 api 호출 시 사용.
    GE_AUTH_LOGIN_TEMP_DATA: (state) => state.login_temp_data,      // @njy SMS 인증용 임시 데이터, SMS인증이 성공하면 저장된 login_temp_data로 로그인 완료 처리 후 사용자 정보를 세팅함. 인증이 끝나면 삭제
  },
  mutations: {
    MU_AUTH_TOKEN: (state, data) => {
      // console.log("###########################################################");
      // console.log("### [authStore][mutations][MU_AUTH_TOKEN]");
      // console.log("### data=",data);
      // console.log("###########################################################");
      /*
                여기서는 payload를 객체로 받습니다.
                payload를 객체로 받으면, mutation를 조금더 유연하게 사용할 수 있기는 합니다.
            */
      state.token = data.access_token;
    },
    MU_AUTH_LOGIN_RESULT: (state, data) => {
      state.login_result = data.code;
      state.login_data = data.data;
    },
    MU_AUTH_LOGOUT_RESULT: (state, data) => {
      state.login_result = data.code;
    },
    MU_CUSTCO_TENANT_ID: (state, data) => {
      state.custco_tenant_id = data.custco_tenant_id;
      state.cert_custco_id = data.cert_custco_id;
    },
    MU_AUTH_LOGIN_TEMP_DATA: (state, data) => {
      state.login_temp_data = data.data;
    },
  },
  actions: {
    //로그인
    async AC_AUTH_LOGIN({ commit }, data) {
      //임시 테스트 데이터
      let set_data = {
        code: 0,
        data: data,
      };

      let response_data;

      await api
        .post("auth-api/login", {
          username: data.username,
          password: data.userpassword,
        })
        .then((response) => {
          if (response.data.HEADER.ERROR_FLAG === false) {
            set_data.code = 1;
            set_data.data = response.data.DATA[0];
          }

          response_data = response;

          // 2차인증이 필요할 시 로그인데이터 저장
          if(set_data.data.USER_LGN_SMS_CERT_YN == 'Y'){

            // 2차 인증을 위한 임시 데이터
            commit("MU_AUTH_LOGIN_TEMP_DATA", set_data);

          }else{

            //로그인 성공/실패 처리
            commit("MU_AUTH_LOGIN_RESULT", set_data);

          }
        })
        .catch((error) => {
          // 에러인 경우 처리
          console.error("login.error", error);

          set_data.code = 0;
          //로그인에러 처리
          commit("MU_AUTH_LOGIN_RESULT", set_data);
        });

      return response_data;
    },
    //로그아웃
    async AC_AUTH_LOGOUT({ commit }, data) {
      let set_data = {
        code: null,
      };

      let response_data;

      await api
        .post("auth-api/logout", {
          ACCESS_TOKEN: sessionStorage.getItem("token"),
          JSESSIONID: sessionStorage.getItem("jsessionid"),
          user_id : JSON.parse(sessionStorage.getItem("vuex")).authStore.login_data.USER_ID
        })
        .then((response) => {
          //로그아웃 처리
          commit("MU_AUTH_LOGOUT_RESULT", set_data);
          // 임시데이터 삭제
          commit("MU_AUTH_LOGIN_TEMP_DATA", "");
          window.sessionStorage.clear();

          response_data = response;
        })
        .catch((error) => {
          // 에러인 경우 처리
          console.error("logout.error", error);

          set_data.code = -1;
          //로그인에러 처리
          commit("MU_AUTH_LOGIN_RESULT", set_data);
        });

      return response_data;
    },
    // 로그인페이지 초기화용도
    async AC_AUTH_INIT({ commit }) {
      let set_data = {
        code: 99,
      };

      commit("MU_AUTH_LOGOUT_RESULT", set_data);
      window.sessionStorage.clear();

    },
    // SMS 인증 후 로그인처리
    async AC_AUTH_LOGIN_SMS_CERT({ commit }, data) {
      let set_data = {
        code : 1,
        data : data.tempData,
      };

      // 로그인
      commit("MU_AUTH_LOGIN_RESULT", set_data);
      // 임시데이터 삭제
      commit("MU_AUTH_LOGIN_TEMP_DATA", "");

    },
  },
};

export default authStore;
