import api from "@/store/apiUtil";

const userStore = {
  namespaced: true,
  state: () => ({
    // user_name: "도로시",
    user_state: "none",
    user_role: {
      userId: "",
      lgnId: "",
      userName: "",
      userNick: "",
      hpNo: "",
      atrtGroupId: "",
      atrtGroupNm: "",
      cntnIp: "",
      lastLoginDt: "",
      EXT_NO: "",
      PDS_EXT_NO: "",
      CNTN_IP: "",
      TOPMSG: "",
      ICON: "",
      ICON_IMG_URI:"",
      SCHEDULE: 0,
      PWD_CHANGE_YN: 'N',
      ELAPSED_DATE: 0,
      CHK_CUST: {
        CHK: 0,
        vue: "",
        CHK_CD: "",
        CHK_NM: "",
      },
      CHK_TMPL:{
        CHK: 0,
        vue: "",
        CUSTCO_ID : '',
        SNDR_KEY : '',
        TALK_UUID       : '',
        TMPL_CD         : '',
        TMPL_NM         : '',
        TMPL_TYP        : '',
        TMPL_EMPH       : '',
        TMPL_CON        : '',
        TMPL_EXT        : '',
        TMPL_IMG        : '',
        TMPL_IMG_URL    : '',
        TMPL_TIT        : '',
        TMPL_SUB        : '',
        TMPL_HEAD       : '',
        TMPL_HILIT      : '',
        TMPL_ITEM       : '',
        CATEGORY        : '',
        BUTN            : '',
        FILE_GROUP      : '',
        HLIT_IMG        : '',
        HLIT_IMG_URL    : '',
      },
      company_list: [],
      company:'',
    },
    user_menu: [], //사용자 메뉴권한 (tree 구조)
    user_menu_dev: [], //사용자 DEV 메뉴권한 (2 depth 구조)
    user_menu_left: [], //사용자 LEFT 메뉴권한 (1 depth 구조)
    user_menu_right: [], //사용자 RIGHT 메뉴권한 (1 depth 구조)
    user_menu_list: [], //사용자 메뉴 및 버튼 권한
    left_menu:[],  //좌측메뉴
    mobie_yn : "",      //모바일사용여부
    USER_SHORTCUT : {
      ALT_SHORTCUT : [],
      ALT_SHIFT_SHORTCUT : [],
    }, //사용자 단축키
  }),
  getters: {
    GE_USER_NAME: (state) => state.user_role.userName,
    GE_USER_STATE: (state) => state.user_state,
    GE_USER_ROLE: (state) => state.user_role,
    GE_USER_MENU: (state) => state.user_menu,
    GE_USER_MENU_LIST: (state) => state.user_menu_list,
    GE_DEV_MENU: (state) => state.user_menu_dev,
    GE_LEFT_MENU: (state) => state.user_menu_left,
    GE_RIGHT_MENU: (state) => state.user_menu_right,
    GE_USER_ID: (state) => state.user_role.userId,
    GE_LGN_ID: (state) => state.user_role.lgnId,
    GE_USER_COMPANY_LIST: (state) => state.user_role.company_list,
    GE_USER_COMPANY: (state) => state.user_role.company,
    GE_USER_EXT_NO: (state) => state.user_role.EXT_NO,
    GE_USER_PDS_EXT_NO: (state) => state.user_role.PDS_EXT_NO,
    GE_USER_CNTN_IP: (state) => state.user_role.CNTN_IP,
    GE_USER_TOPMSG: (state) => state.user_role.TOPMSG,
    GE_USER_ICON: (state) => state.user_role.ICON,
    GE_USER_ICON_IMG_URI: (state) => state.user_role.ICON_IMG_URI,
    GE_USER_SCHEDULE: (state) => state.user_role.SCHEDULE,
    GE_USER_CHK_CUST: (state) => state.user_role.CHK_CUST,
    GE_USER_CHK_TMPL: (state) => state.user_role.CHK_TMPL,
    GE_USER_IP_ADDR: (state) => state.user_role.CNTN_IP,       // 상담사로그인 IP
    GE_MOBILE_YN : (state) => state.mobie_yn,                  //모바일사용여부
    GE_PWD_CHANGE_YN : (state) => state.user_role.PWD_CHANGE_YN,    //초기 비밀번호 변경 여부
    GE_USER_SHORTCUT : (state) => state.USER_SHORTCUT,    //사용자 단축키
    GE_ELAPSED_DATE : (state) => state.user_role.ELAPSED_DATE,    //비밀번호 변경 후 경과일
  },
  mutations: {
    MU_USER_NAME: (state, data) => {
      /*
                여기서는 payload를 객체로 받습니다.
                payload를 객체로 받으면, mutation를 조금더 유연하게 사용할 수 있기는 합니다.
            */
      state.user_name = data.userName;
    },
    MU_USER_STATE: (state, data) => {
      state.user_state = data.ustate;
    },
    MU_USER_COMPANY_LIST: (state, data) => {
      if (data) {
        let companyArray = [];

        for (var i = 0; i < data.length; i++) {
          let OMNI_INST_NM = [];

          if("OMNI_INST_NM" in data[i]){
            if(data[i]["OMNI_INST_NM"]){
              data[i]["OMNI_INST_NM"].split('_##_').forEach((data, idx) => {
                OMNI_INST_NM.push({text : data.split(',')[1], value : data.split(',')[0]});
              });
            }
          }

          let arrSrvc = [];
          if("SRVC_INFO" in data[i]){
            if(data[i]["SRVC_INFO"]){
              data[i]["SRVC_INFO"].split('_##_').forEach((srvc, idx) => {
                let srvcNm = srvc.split(',')[0];
                let srvcStat = srvc.split(',')[1];
                arrSrvc[srvcNm] = srvcStat;
              });
            }
          }

          companyArray.push({
            // icon: require('@/assets/img/@logo_palette.png'),
            icon: data[i]["CUSTCO_ICON"],
            SCHEMA_ID: data[i]["SCHEMA_ID"],
            CD: data[i]["CD"],
            CD_NM: data[i]["CD_NM"],
            CUSTCO_ID: data[i]["CD"],
            ASP_CUST_KEY: data[i]["ASP_CUST_KEY"],
            USER_ID: data[i]["USER_ID"],
            EXT_NO: data[i]["EXT_NO"],
            PDS_EXT_NO: data[i]["PDS_EXT_NO"],
            API_URI: data[i]["API_URI"],
            RPRS_NO: data[i]["RPRS_NO"],
            DSPTCH_NO: data[i]["DSPTCH_NO"],
            SCRN_INDCT_NM: data[i]["SCRN_INDCT_NM"],
            CERT_CUSTCO_ID: data[i]["CERT_CUSTCO_ID"],
            SRVC_GDS_ID: data[i]["SRVC_GDS_ID"],
            SRVC_INFO: {...arrSrvc},
            OMNI_INST_NM: OMNI_INST_NM,
          });
        }
        state.user_role.company_list = companyArray;
      }
    },
    MU_USER_COMPANY: (state, data) => {
      if (data) {
        let selectCompany = {CD : data.CD
                            , CD_NM : data.CD_NM
                            , CUSTCO_ID: data.CUSTCO_ID
                            , ASP_CUST_KEY: data.ASP_CUST_KEY
                            , USER_ID: data.USER_ID
                            , EXT_NO: data.EXT_NO
                            , PDS_EXT_NO: data.PDS_EXT_NO
                            , API_URI: data.API_URI
                            , RPRS_NO: data.RPRS_NO
                            , DSPTCH_NO: data.DSPTCH_NO
                            , SCRN_INDCT_NM: data.SCRN_INDCT_NM
                            , icon: data.icon
                            , SCHEMA_ID: data.SCHEMA_ID
                            , CERT_CUSTCO_ID: data.CERT_CUSTCO_ID
                            , SRVC_GDS_ID: data.SRVC_GDS_ID
                            , SRVC_INFO: data.SRVC_INFO
                            , OMNI_INST_NM: data.OMNI_INST_NM
                          };
        state.user_role.company = selectCompany;
      }
    },
    MU_OMNIONE_INST_NM: (state, data) => {
      state.user_role.company.OMNI_INST_NM = data;
    },
    MU_CUSTCO_SRVC_INFO: (state, data) => {
      state.user_role.company.SRVC_INFO = data;
    },
    MU_USER_EXT_NO: (state, data) => {
      if (data) {
        state.user_role.EXT_NO = data;
      }
    },
    MU_USER_PDS_EXT_NO: (state, data) => {
      if (data) {
        state.user_role.PDS_EXT_NO = data;
      }
    },
    MU_PWD_CHANGE_YN: (state, data) => {
      if (data) {
        state.user_role.PWD_CHANGE_YN = data;
      }
    },
    MU_ELAPSED_DATE: (state, data) => {
      if (data) {
        state.user_role.ELAPSED_DATE = data;
      }
    },
    MU_USER_MENU: (state, data) => {
      // state.ustate = date.ustate;
      if (data) {
        state.user_menu = data.MENU_ITEMS;
        state.user_menu_dev = data.DEV_MENU_ITEMS; //개발 가이트 메뉴
        // state.user_menu_list = data.DATA;
        if(data.DATA.length >0){
          state.user_menu_list = [];
          state.user_menu_left = [];
          state.user_menu_right = [];
          for(var i = 0; i < data.DATA.length; i++){
            if(data.DATA[i].VIEW_TRGT === 'MAIN' || data.DATA[i].VIEW_TRGT === 'LEFT' || data.DATA[i].VIEW_TRGT === 'DEV'){ //메인메뉴, LEFT 메뉴
              state.user_menu_list.push(data.DATA[i]);
              if(data.DATA[i].VIEW_TRGT == 'LEFT'){ //LEFT 메뉴
                state.user_menu_left.push(data.DATA[i]);
              }
            }else{//RIGHT 메뉴
              const rightMenu = data.DATA[i];
              rightMenu.active = false;
              rightMenu.alarm = false;

              //예약콜, 콜백이 있을 경우 상담직원이 인지할 수 있도록 우측 사이드바의 해당 아이콘에 에니메이션 효과를 적용 용도.
              if( data.DATA[i].ICON_CLASS_NM == "campaign" ) {
                rightMenu.animationData = require( '@/assets/lottie/animation_campaign.json' );
              }else if( data.DATA[i].ICON_CLASS_NM == "reserveCall" ) {
                rightMenu.animationData = require( '@/assets/lottie/animation_reserve.json' );
              }else if( data.DATA[i].ICON_CLASS_NM == "callback" ) {
                rightMenu.animationData = require( '@/assets/lottie/animation_callback.json' );
              } else if( data.DATA[i].ICON_CLASS_NM == "orderlist" ) {
                rightMenu.animationData = require( '@/assets/lottie/animation_orderlist.json' );
              }

              state.user_menu_right.push(rightMenu);
            }
          }
        }
      }
    },
    MU_USER_DETAIL: (state, data) => {
      // state.ustate = date.ustate;
      if (data.data) {
        let getData = data.data;
        state.user_role.userId = getData.USER_ID;
        state.user_role.lgnId = getData.LGN_ID;
        state.user_role.userName = getData.USER_NM;
        state.user_role.userNick = getData.USER_NICK;
        // state.user_role.hpNo = getData.HP_NO;
        state.user_role.atrtGroupId = getData.AUTHOR_GROUP_ID_LIST;
        state.user_role.atrtGroupNm = getData.AUTHOR_GROUP_NM_LIST;
        state.user_role.cntnIp = getData.CNTN_IP;
        state.user_role.lastLoginDt = getData.LAST_LOGIN_DT;
        state.user_role.EXT_NO = getData.EXT_NO;
        state.user_role.PDS_EXT_NO = getData.PDS_EXT_NO;
        state.user_role.CNTN_IP = getData.CNTN_IP;
        state.user_role.TOPMSG = getData.TOPMSG;
        state.user_role.ICON = getData.ICON;
        state.user_role.ICON_IMG_URI = getData.ICON_IMG_URI;
        state.user_role.PWD_CHANGE_YN = getData.PWD_CHANGE_YN;
        state.user_role.ELAPSED_DATE = getData.ELAPSED_DATE;
      }
    },

    // right menu active
    MU_ANIMATION_ACTIVE(state, index) {
      try{state.user_menu_right[index].alarm = true;}catch(e){ }
    },
    MU_ANIMATION_INACTIVE(state, index) {
      try{state.user_menu_right[index].alarm = false;}catch(e){ }
    },

     /**
     * 모바일사용여부
     * @param {*} param0
     * @param {*} data
     */
    MU_MOBIE_YN: (state, data) => {
      state.mobie_yn = data;
    },
    //사용자 단축키
    MU_USER_SHORTCUT: (state, data) => {
      state.USER_SHORTCUT = data;
    },
  },
  actions: {

    /**
     * 모바일사용여부
     * @param {*} param0
     * @param {*} data
     */
    AC_MOBIE_YN: ({ commit }, data) => {
      commit("MU_MOBIE_YN", data);
    },

    AC_USER_NAME: ({ commit }, data) => {
      commit("MU_USER_NAME", data);
    },
    AC_USER_STATE: ({ commit }, data) => {
      commit("MU_USER_STATE", data);
    },
    //사용자 회사 조회
    async AC_USER_COMPANY_LIST({ commit }, data) {
      let set_headers = {
        SERVICE: "code.common.code-book.sender",
        METHOD: "aspinqry",
        TYPE: "BIZ_SERVICE",
        ASYNC: false,
      };

      await api
        .post(
          "api/code/common/code-book/aspinqry",
          {
            ASP_USER_ID: data.user_id,
            USER_ID: data.user_id,
            LGN_ID: data.lgn_id,
          },
          { head: set_headers }
        )
        .then((response) => {
          if (response.data[data.user_id]) {
            commit("MU_USER_COMPANY_LIST", response.data[data.user_id]);
          }
        })
        .catch((error) => {
          // 에러인 경우 처리
          console.error("company 조회 에러", error);
        });
    },
    //사용자 회사 선택
    async AC_USER_COMPANY({ commit }, data) {
      await commit("MU_USER_COMPANY",data);
    },
    //사용자 메뉴 조회
    async AC_USER_MENU({ commit }, data) {
      await api
        .post("api/palette-main/menu/list", {
          USER_ID: data.user_id,
        })
        .then((response) => {
          commit("MU_USER_MENU", response.data);
        })
        .catch((error) => {
          // 에러인 경우 처리
          console.error("menu 조회 에러", error);
        });
    },
    //사용자 상세정보 조회
    async AC_USER_DETAIL({ commit }, data) {
      // api
      //   .post("api/setting/agent/manage/detail", {
      //     USER_ID: data.user_id,
      //     ASP_NEWCUST_KEY: data.asp_cust_key,
      //   })
      //   .then((response) => {
      await commit("MU_USER_DETAIL", data);
      // })
      // .catch((error) => {
      //   // 에러인 경우 처리
      //   console.error("사용자 상세정보 조회 에러", error);
      // });
    },
    //사용자 단축키 조회
    async AC_USER_SHORTCUT({ commit }, data) {
      await api
        .post(
          "api/system/shortcut/selectShortcutList",
          {}, 
          { head: {} }
        )
        .then((response) => {
          if (response.data) {
            let altShortcut = [];
            let altShiftShortcut = [];
            const shortcutList = response.data.DATA;
            //ALT 단축키와 ALT + SHIFT 단축키 목록을 별도 구분해서 저장한다.
            shortcutList.map(item => {
              //삭제 상태의 지식 스크립트는 제외(삭제 상태 - item.LNK_CN : '')
              if(item.LNK_CN != '') {
                if(item.ALT_KEY_YN == 'Y' && item.SHIFT_KEY_YN == 'Y') {
                  altShiftShortcut.push(item)
                } else if(item.ALT_KEY_YN == 'Y') {
                  altShortcut.push(item)
                }
              }
            });
            commit("MU_USER_SHORTCUT", {ALT_SHORTCUT : altShortcut, ALT_SHIFT_SHORTCUT : altShiftShortcut});
          }
        })
        .catch((error) => {
          // 에러인 경우 처리
          console.error("사용자 단축키 조회 에러", error);
        });
    },
  },
};

export default userStore;
