import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment';

import _ from 'lodash';

import { mixin } from "@/mixin/mixin.js"
import { stompUtil } from "@/store/stomp-util.js";
import apiChatParam from "@/store/apiChatParamUtil.js";   //챗 파라메터 APIs 서비스

Vue.use(Vuex);

const messages = {
    namespaced: true,
    mixins: [mixin],
    state: () => ({
        messages: [],
        talkList: [],                                                   // 채팅목록
        custInfo: {},                                                   // 대화자 
        chtCuttInfo: {},                                            // 대화 정보
        csrf: '',                                                       // csrf
        userId: '',                                                     // 상담원정보 
        userNm: '',                                                     // 상담명 
        custcoId: '',                                                 // 고객사키(asp)
        overlayShow: false,                                             // overylay show
        processInfo: [                                                  // 채팅목록 프로세스 목록
            { id: 'ready', tab: '상담대기', badge: '', badgeClass: 'is-gray', isRead: '-1', isActive: true },
            { id: 'talking', tab: '상담', badge: '', badgeClass: 'is-gray', isRead: '-1', isActive: true },
            { id: 'post', tab: '후처리', badge: '', badgeClass: 'is-gray', isRead: '-1', isActive: true },
            // { id: 'callback', tab: '콜백', badge: '', badgeClass: 'is-gray', isRead: '-1', isActive: true },
            { id: 'end', tab: '종료', badge: '', badgeClass: 'is-gray', isRead: '-1', isActive: false },
        ],
        dashboardInfo: [                                                // dashboard 목록
            { id: 'accept', name: '인입', badge: '0' },
            { id: 'acceptinqry', name: '배정대기', badge: '0' },
            { id: 'ready', name: '상담대기', badge: '0' },
            { id: 'counsel', name: '상담중', badge: '0' },
            { id: 'after', name: '후처리', badge: '0' },
        ],
        selectedProcessStat: [],                                        // 선택된 프로세스 상태값
        token: '',                                                      // token  
        subscriptionList: [],                                           // sub 목록 
        readyTimeout: 0,                                                // 재분배 타임아웃 
		simsessionId : '',
        blobYn: 'N',                                                    //파일처리 BLOB 여부
        cnslDiv: '',
        cnslHstTypeCd: '',
        sndrKey: '',
        storeTalkUserKey: '',
        ieFlag: /*@cc_on!@*/false || !!document.documentMode,
        CHAT_CUSTCO_ID: '',                                           //채팅목록에서 채팅을 클릭 시 화면에 해당 회사의 정보들을 출력
        CHAT_SNDR_KEY: '',                                          //현재 채팅 채널
        cnslSaveFrameF: false,                                          //후처리 이후 상담완료창을 닫기 위한 변수
        talkStatCdF: '',                                                //후처리 입력창을 열기위한 변수
        noCallBack: '',
        imgSrc: '',                                                     //회사 로고 이미지 경로
    }),

    /**
     * chat message obj getters
     * @type {string, string}
     */
    getters: {
        GE_MESSAGES: (state) => state.messages,                             // 
        GE_TALK_LIST: (state) => state.talkList,                            //채팅목록 
        GE_CUST_INFO: (state) => state.custInfo,                            //대화자
        GE_CHT_CUTT_INFO: (state) => state.chtCuttInfo != null && state.chtCuttInfo != '' ? state.chtCuttInfo : '',     // 대화 정보
        GE_CSRF: (state) => state.csrf,                                     //csrf
        GE_USER_ID: (state) => state.userId != null && state.userId != '' ? state.userId : '',                                          //상담원정보 
        GE_USER_NM: (state) => state.userNm,                                //상담명 
        GE_CUSTCO_ID: (state) => state.custcoId,                       //고객사키(asp)
        GE_OVERLAY_SHOW: (state) => state.overlayShow,                      //overylay show
        GE_PROCESS_INFO: (state) => state.processInfo,                      //채팅목록 프로세스 목록
        GE_DASHBOARD_INFO: (state) => state.dashboardInfo,                  //dashboard 목록
        
        GE_SELECTED_PROCESS_STAT: (state) => state.selectedProcessStat,     //선택된 프로세스 상태값
        GE_TOKEN: (state) => state.token,                                   //token  
        GE_SUBSCRIPTION_LIST: (state) => state.subscriptionList,            //sub 목록 
        GE_READY_TIMEOUT: (state) => state.readyTimeout,                    //재분배 타임아웃 
        GE_SIM_SESSION_ID: (state) => state.simsessionId,
        GE_BLOB_YN: (state) => state.blobYn,                                //파일처리 BLOB 여부
        GE_CNSL_DIV: (state) => state.cnslDiv,
        GE_CNSL_HST_TYPE_CD: (state) => state.cnslHstTypeCd,
        GE_SNDR_KEY: (state) => state.sndrKey,
        GE_STORE_CHT_USER_KEY: (state) => state.storeTalkUserKey,
        GE_IEFLAG: (state) => state.ieFlag,

        GE_CHAT_CUSTCO_ID: (state) => state.CHAT_CUSTCO_ID,             //채팅목록에서 채팅을 클릭 시 화면에 해당 회사의 정보들을 출력
        GE_CHAT_SNDR_KEY: (state) => state.CHAT_SNDR_KEY,           //현재 채팅 채널
        GE_CNSL_SAVE_FRAME_F: (state) => state.cnslSaveFrameF,              //후처리 이후 상담완료창을 닫기 위한 변수
        GE_TALKSTAT_CD_F: (state) => state.talkStatCdF,
        GE_NO_CALL_BACK: (state) => state.noCallBack,                       //후처리 입력창을 열기위한 변수
        GE_IMG_SRC: (state) => state.imgSrc,                                //회사 로고 이미지 경로
        
        //getContentToken: (state) => () => { state.token; },
        //getContentProcessInfo: (state) => () => { return state.processInfo; },
        //getContentDashboardInfo: (state) => () => { return state.dashboardInfo; },

        GE_MSG_OBJ: (state) => (payload) => {                               //getMsgObj

            return {
                user_key: payload.user_key == null ? payload.CHT_USER_KEY : payload.user_key,
                cht_cutt_id: payload.CHT_CUTT_ID,
                sndrcv_cd: payload.sndrcv_cd == null ? payload.SNDRCV_CD.toLowerCase() : payload.sndrcv_cd,
                message_type: payload.type == null ? payload.TYPE : payload.type,
                msg: payload.content == null ? payload.CONTENT : payload.content,
                cutt_stts_cd: payload.CUTT_STTS_CD,
                cutt_stts_nm: payload.TALK_STAT_NM,
                image_talk_path: payload.IMAGE_TALK_PATH,
                image_url: payload.IMAGE_URL,
                org_file_id: payload.ORG_FILE_ID,
                file_blob: payload.FILE_BLOB,
                file_exts : payload.FILE_EXTS,
                file_busi_type : payload.BUSI_TYPE,
                file_path_type : payload.PATH_TYPE,
                file_key : payload.FILE_KEY,
                file_group_key : payload.FILE_GROUP_KEY,
                save_filename : payload.SAVE_FILENAME,
                file_path : payload.FILE_PATH,
                talk_serial_number: payload.TALK_SERIAL_NUMBER,
                delete_yn: false,
                it_processing: payload.IT_PROCESSING == null ? moment().format('YYYY-MM-DD HH:mm') : payload.IT_PROCESSING,
                type_nm: payload.TYPE_NM == null ? (payload.sndrcv_cd == 'snd' ? '송신' : (payload.sndrcv_cd == 'rcv' ? '수신' : '3자')) : payload.TYPE_NM,
                customer_nm: payload.CUSTOMER_NM == null ? state.chtCuttInfo.customer_nm : payload.CUSTOMER_NM,
                talk_sender_key_nm: payload.TALK_SENDER_KEY_NM == null ? state.chtCuttInfo.talk_sender_key_nm : payload.TALK_SENDER_KEY_NM,
                org_cont_id: payload.ORG_CONT_ID,
                attachment: payload.attachment == null ? payload.LINKS : payload.attachment.url,
                sender: payload.SEND_USER_NM != null ? payload.SEND_USER_NM : payload.USER_NAME,
                sender_short_nm: payload.SEND_USER_SHORT_NM != null ? payload.SEND_USER_SHORT_NM : (payload.USER_NAME != null ? payload.USER_NAME.substring(0, 1) : ''),
                chat_date: payload.CHAT_DATE == null ? moment().format('HH : mm') : payload.CHAT_DATE,
                msg_notice: payload.msg_notice != null ? payload.msg_notice :
                    (payload.TYPE == 'expired_session' && payload.CUTT_STTS_CD == '20' ? '상담이 종료되었습니다. 상담이력을 저장해 주시기 바랍니다.' :
                        (payload.TYPE == 'expired_session' ? '상담이 종료되었습니다.' : '')),
                sys_msg: payload.SYS_MSG,
                is_read: payload.IS_READ == null ? '0' : payload.IS_READ,
                consultEnd: payload.consultEnd,
                CUSTCO_ID: payload.CUSTCO_ID,

            };
        },

        //getContactInfo: (state) => () => {
        //    return state.chtCuttInfo != null && state.chtCuttInfo != '' ? state.chtCuttInfo : '';
        //},

        //getUserId: (state) => () => {
        //    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        //    console.log("messages.getUserId");
        //    return state.userId != null && state.userId != '' ? state.userId : '';
        //},

        /**
         * [{cht_user_key:xxxx, msg_list:[{},{}]}, {cht_user_key:xxxx, msg_list:[{},{}]} ]
         */
        GE_CONTACT_MSG: (state) => (payload) => {

            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            //console.log("messages.getContactMsg1", payload);

            if (payload.cht_cutt_id != null && payload.cht_cutt_id != '') {

                let obj = _.find(state.messages, { 'cht_cutt_id': payload.cht_cutt_id });

                if (obj == null || obj == '') {
                    obj = { 'cht_cutt_id': payload.cht_cutt_id, 'msg_list': [] }
                    state.messages.push(obj);
                }

                return obj.msg_list;
            }

            return '';
        },

        //getSubscriptionList: (state) => (payload) => { return state.subscriptionList; },
        //getTalkList: (state) => () => { return state.talkList; },

    },
    mutations: {

        /****************************************************************************************************************************************************
         * message mutations START
         ***************************************************************************************************************************************************/

        /**
         * Sim SessionId 세팅 Arthur.Kim 
         * @param {*} state 
         * @param {*} data 
         */
        MU_SIM_SESSION_ID: (state, data) => {
            state.simsessionId = data.simsessionId;
        },

        // TALKER 추가 Arthur.Kim
        MU_UNSHIFT_TALKER(state, payload) {         //UNSHIFT_TALKER
            // console.log("MU_UNSHIFT_TALKER >>>", state);
            // console.log("state", state);

            let uri = "/topic/inout/";

            if (_.findIndex(state.talkList, { 'CHT_USER_KEY': payload.CHT_USER_KEY, 'CUTT_STTS_CD': payload.ALTMNT_STTS_CD }) < 0) {
                
                uri = uri + payload.CHT_USER_KEY;
                state.talkList.unshift(payload);
            }
        },

        // 구독(채팅목록) Arthur.Kim
        MU_SUB_TALKERS(state, payload) {           //SUB_TALKERS

            // console.log("MU_SUB_TALKERS>>>>>>>>>>", state);
            // console.log("state", state);
            let talkLen = state.talkList.length;

            // 상담중 / 대기중건들은 inout sub 처리를 함.
            if (state.talkList != null && talkLen > 0) {

                for (let i = 0; i < talkLen; i++) {

                    let uri       = "/topic/inout/" + state.talkList[i].CHT_USER_KEY;
                    let subObjIdx = _.findIndex(state.subscriptionList, { 'uri': uri });

                    if ((state.talkList[i].CUTT_STTS_CD == "ING" || state.talkList[i].CUTT_STTS_CD == "WAIT" || state.talkList[i].CUTT_STTS_CD == "TRAN_WAIT") && subObjIdx < 0) {

                        let chatMessage = {
                            chatType: "INOUT",
                            in_out: "inOut",
                            userId: state.userId,
                            userName: state.userId,
                            userNickname: state.userId,
                            userKey: state.talkList[i].CHT_USER_KEY,
                            talkSenderKey: state.talkList[i].SNDR_KEY,
                            sndrKey: state.talkList[i].SNDR_KEY,
                            chtCuttId: state.talkList[i].CHT_CUTT_ID,
                        };

                        // 웹소켓 연결 정상인 경우 sub 시도 
                        if (stompUtil.isConnected()) {
                            var subscription = stompUtil.subscribe(uri, chatMessage);
                            state.subscriptionList.push({ "uri": uri, "subscription": subscription, chatMessage: chatMessage });
                        }
                    }
                }
            }
        },

        // TALKER 삭제 Arthur.Kim
        MU_SPLICE_TALKER(state, payload) {                  //SPLICE_TALKER

            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            //console.log("messages.MU_SPLICE_TALKER");

            // console.log('Store.message.mutations : SPLICE_TALKER' + payload.length + "-" +state.talkList);

            let index = -1;
            if (payload.CHT_CUTT_ID != null && payload.CHT_CUTT_ID != '') // 상담중 목록 삭제
                index = _.findIndex(state.talkList, { 'CHT_CUTT_ID': payload.CHT_CUTT_ID });
            else {
                index = _.findIndex(state.talkList, { 'CHT_USER_KEY': payload.user_key, 'CUTT_STTS_CD': "11" });
                if (index < 0) index = _.findIndex(state.talkList, { 'CHT_USER_KEY': payload.user_key, 'CUTT_STTS_CD': "13" });
            } // 대기중 목록 삭제 

            if (index >= 0) state.talkList.splice(index, 1);

        },

        // 구독해제 
        MU_UNSUB_TALKER(state, payload) {              //UNSUB_TALKER

            // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            // console.log("messages.MU_UNSUB_TALKER");

            // console.log("state", state);
            // console.log("payload", payload);

            //  console.log('Store.message.mutations : MU_UNSUB_TALKER' , payload.length , "-" ,state.subscriptionList);

            //  console.log('payload' , payload.subscription);

            let subObj = _.find(state.subscriptionList, { 'uri': payload.uri }); // unsub
            subObj.subscription.unsubscribe();
            //payload.subscription.unsubscribe();

            var index = _.findIndex(state.subscriptionList, { 'uri': payload.uri }); // unsub
            state.subscriptionList.splice(index, 1);
        },

        // Arthur.Kim
        MU_CHANGE_PROCESSINFO(state, payload) {         //CHANGE_PROCESSINFO

            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            //console.log("messages.MU_CHANGE_PROCESSINFO");

            if (payload.selected_stat == null || payload.selected_stat == '') { // 기선택된 값 셋팅
                payload.selected_stat = state.selectedProcessStat;
            } else {
                state.selectedProcessStat = payload.selected_stat;
            }

            var retObj = state.processInfo.map(
                (items) => ({
                    ...items,
                    badge: (items.id == 'ready' && payload.ready_cnt ||
                        (items.id == 'talking' && payload.talking_cnt) ||
                        (items.id == 'end' && payload.end_cnt) ||
                        (items.id == 'post' && payload.post_cnt) ||
                        (items.id == 'callback' && payload.callback_cnt || 0)),
                    isRead: (items.id == 'ready' && (items.badge == '' ||
                            (payload.ready_cnt == items.badge && items.isRead != 0) ||
                            _.indexOf(payload.selected_stat, 'ready') >= 0 ? 1 : 0) ||
                        (items.id == 'talking' && (items.badge == '' ||
                                (payload.talking_cnt == items.badge && items.isRead != 0) ||
                                _.indexOf(payload.selected_stat, 'talking') >= 0 ? 1 : 0) ||
                            (items.id == 'end' && (items.badge == '' ||
                                    (payload.end_cnt == items.badge && items.isRead != 0) ||
                                    _.indexOf(payload.selected_stat, 'end') >= 0 ? 1 : 0) ||
                                (items.id == 'post' && (items.badge == '' ||
                                        (payload.end_cnt == items.badge && items.isRead != 0) ||
                                        _.indexOf(payload.selected_stat, 'post') >= 0 ? 1 : 0) ||
                                    (items.id == 'callback' && (items.badge == '' ||
                                        (payload.callback_cnt == items.badge && items.isRead != 0) ||
                                        _.indexOf(payload.selected_stat, 'callback') >= 0 ? 1 : 0) || 0)))))
            }));

            state.processInfo = retObj;

        },

        // Arthur.Kim
        MU_SOCKET_CHAT_MESSAGE(state, payload) {               //SOCKET_CHAT_MESSAGE

            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            //console.log("messages.SOCKET_CHAT_MESSAGE");


            // 상담중
            if (payload.msgObj != null && payload.msgObj != '') {

                // xss 필터 (db 저장변경됨.)
                if (payload.msg.msg != null && payload.msg.msg != "") {
                    payload.msg.msg = this.restoreXSS(payload.msg.msg);
                }

                payload.msgObj.push(payload.msg);
            }

        },

        // 메시지 추가 후 작업 Arthur.Kim
        MU_SET_MESSAGE_INFO(state, payload) {       //SET_MESSAGE_INFO

            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            //console.log("messages.SET_MESSAGE_INFO");

            let talkerObj = '';
            
            if (payload.msgObj != null && payload.msgObj != '') { // 상담중
                talkerObj = _.find(state.talkList, { 'CHT_CUTT_ID': payload.msg.cht_cutt_id });
            } 
            else {  // 대기중                                      
                talkerObj = _.find(state.talkList, { 'CHT_USER_KEY': payload.msg.user_key, 'CUTT_STTS_CD': "11" });

                if (talkerObj == null) {
                    talkerObj = _.find(state.talkList, { 'CHT_USER_KEY': payload.msg.user_key, 'CUTT_STTS_CD': "13" });
                }
            }

            if (talkerObj != null) {

                talkerObj.TALK_TITLE = payload.msg.msg;
                talkerObj.CHT_CUTT_ID = payload.msg.cht_cutt_id;
                
                //신규msg 뱃지 20201020
                talkerObj.UNREAD_CNT = parseInt(talkerObj.UNREAD_CNT) + 1;
                
                if (payload.msg.cutt_stts_cd != '' && payload.msg.cutt_stts_cd != null) {
                    talkerObj.CUTT_STTS_CD = payload.msg.cutt_stts_cd;
                }

                if (payload.msg.cutt_stts_nm != '' && payload.msg.cutt_stts_nm != null) {
                    talkerObj.TALK_STAT_NM = payload.msg.cutt_stts_nm;
                }
            }
        },

        // 채팅목록 초기화
        MU_INIT_TALKLIST(state, payload) {          //INIT_TALKLIST

            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            //console.log("messages.MU_INIT_TALKLIST");

            state.talkList = payload;

        },

        INIT_MESSAGE(state, payload) {
            
            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            //console.log("messages.INIT_MESSAGE");

            if (payload.msg_list != null && payload.msg_list.length > 0) {

                let obj = Vue._.find(state.messages, { 'cht_cutt_id': payload.msg_list[0].cht_cutt_id });

                if (obj == null || obj == '') {
                    obj = { 'cht_cutt_id': payload.msg_list[0].cht_cutt_id, 'msg_list': payload.msg_list }
                    state.messages.push(obj);
                } else {
                    obj.msg_list = payload.msg_list;
                }

            }

        },
        
        // 컨텐츠별 sub 
        SUB_TALKER(state, payload) {

            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            //console.log("messages.SUB_TALKER");

            var uri = "/topic/inout/" + payload.CHT_USER_KEY;
            var chatMessage = {
                chatType: "INOUT",
                in_out: "inOut",
                userId: state.userId,
                userName: state.userId,
                userNickname: state.userId,
                userKey: payload.CHT_USER_KEY,
                talkSenderKey: payload.SNDR_KEY,
                sndrKey: payload.SNDR_KEY,
                chtCuttId: payload.CHT_CUTT_ID,
            };

            let chtCuttInfo = {
                cht_cutt_id: payload.CHT_CUTT_ID,
                cht_user_key: payload.CHT_USER_KEY,
                sndr_key: payload.SNDR_KEY,
                cutt_stts_cd: payload.CUTT_STTS_CD
            };

            // 웹소켓 연결 정상인 경우 sub 시도 
            if (stompUtil.isConnected()) {
                var subscription = stompUtil.subscribe(uri, chatMessage);
                state.subscriptionList.push({ "uri": uri, "subscription": subscription, chatMessage: chatMessage });
            }

            // stompUtil.connect(
            //   () => {
            //           var subscription  = stompUtil.subscribe(uri, chatMessage);
            //           console.log("store SUB_TALKER >> subscription : " + subscription);
            //           state.subscriptionList.push({"uri" : uri , "subscription" : subscription});
            //         }, 
            //   (error) => {
            //     if( error != null) {
            //         console.log(error);
            //         //this.connected = false;
            //     }
            //   },

            // );


        },
        
        CHANGE_DASHBOARDINFO(state, payload) {

            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            //console.log("messages.CHANGE_DASHBOARDINFO");

            var retObj = state.dashboardInfo.map(
                (items) => ({
                    ...items,
                    badge: (items.id == 'accept' && payload.accept_cnt ||
                        (items.id == 'acceptinqry' && payload.acceptinqry_cnt) ||
                        (items.id == 'ready' && payload.ready_cnt) ||
                        (items.id == 'counsel' && payload.counsel_cnt) ||
                        (items.id == 'after' && payload.after_cnt || 0)),
                }));

            state.dashboardInfo = retObj;

        },

        // 선택된 채팅정보 셋팅
        SET_SELECTED_CONTACT_INFO(state, payload) {

            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            //console.log("messages.SET_SELECTED_CONTACT_INFO");

            // state.chtCuttInfo = state.chtCuttInfo.map(
            //   (items) => ({
            //     ...items ,
            //     payload
            // }));

            state.chtCuttInfo = payload;
            // state.overlayShow = false;
        },

        // 채팅목록 고객명 변경
        CHANGE_TALKLIST_CUSTNM(state, payload) {

            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            //console.log("messages.CHANGE_TALKLIST_CUSTNM");

            if ( state.talkList != null && state.talkList.length > 0 ) {
                for (var i = 0; i < state.talkList.length; i++) {
                    if ( state.talkList[i].CHT_USER_KEY == payload.CHT_USER_KEY ) {
                        state.talkList[i].CUSTOMER_NM = payload.CUSTOMER_NM;
                    }
                }
            }
            if ( state.chtCuttInfo != null && state.chtCuttInfo != '' ) {
                state.chtCuttInfo.customer_nm = payload.CUSTOMER_NM;
            }
        },

        /****************************************************************************************************************************************************
         * message mutations END
         ****************************************************************************************************************************************************
         ***************************************************************************************************************************************************/
    },
    actions: {

        /****************************************************************************************************************************************************
         * message actions START
         ***************************************************************************************************************************************************/

        /**
         * Sim SessionId 세팅 Arthur.Kim
         * @param {*} param0 
         * @param {*} data 
         */
        AC_SIM_SESSION_ID: ({ commit }, data) => {
            commit("MU_SIM_SESSION_ID", data);
        },

        // 채팅목록 추가 
        AC_UN_SHIFT_TALKER : ({ commit }, payload) => {         //unshiftTalker

            // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            // console.log("messages.AC_UN_SHIFT_TALKER", payload);

            commit('MU_UNSHIFT_TALKER', payload);

            // 상담중 sub 
            commit('MU_SUB_TALKERS', payload);
        },

        // 프로세스 정보 초기화 Arthr.Kim
        AC_CHANGE_TALK_PROCESS_INFO: ({ commit }, payload) => {     //changeTalkProcessInfo

            apiChatParam.post("chat-api/main/count-by-cnslt-sttus/inqire", {
                USER_ID: payload.userId,
                CUSTCO_ID : payload.custcoId
              }, {head: {
                  "SERVICE" : "api.chat.main.count-by-cnslt-sttus",
                  "METHOD" : "inqire",
                  "TYPE" : "BIZ_SERVICE",
            }})
            .then((ret) => {

                if (ret != null && ret != '' && ret.data.code >= 0) {

                    let retObj = Object.values(ret.data.data);
                    
                    if (ret != null && retObj.length > 0) {

                        let processInfo = {
                            ready_cnt: retObj[0].READY_CNT,
                            talking_cnt: retObj[0].TALKING_CNT,
                            end_cnt: retObj[0].END_CNT,
                            callback_cnt: retObj[0].CALLBACK_CNT,
                            post_cnt: retObj[0].POST_CNT,
                            selected_stat: payload.selected_stat
                        };
                        
                        // 채팅목록 프로세스 정보 초기화  
                        commit('MU_CHANGE_PROCESSINFO', processInfo);

                    }
                }
            });

            //teleApi.callRestApi({ method: 'post', action: "chat-api/main/count-by-cnslt-sttus/inqire" }, ret => {
            //    if (ret != null && ret != '' && ret.data.code >= 0) {
            //        let retObj = Object.values(ret.data.data);
            //        if (ret != null && retObj.length > 0) {
            //            let processInfo = {
            //                ready_cnt: retObj[0].READY_CNT,
            //                talking_cnt: retObj[0].TALKING_CNT,
            //                end_cnt: retObj[0].END_CNT,
            //                callback_cnt: retObj[0].CALLBACK_CNT,
            //                post_cnt: retObj[0].POST_CNT,
            //                selected_stat: payload.selected_stat
            //            };
            //            // 채팅목록 프로세스 정보 초기화  
            //            commit('CHANGE_PROCESSINFO', processInfo);
            //        }
            //    }
            //});

        },

        // 채팅목록 제거 Arthur.Kim
        AC_SPICE_TALKER: ({ commit }, payload) => {                 //spliceTalker

            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            //console.log("messages.spliceTalker");

            commit('MU_SPLICE_TALKER', payload);

            // 상담중 sub 
            commit('MU_UNSUB_TALKER', payload);
        },

        // 구독해제 Arthur.Kim
        AC_SUB_TALKER: ({ commit }, payload) => {                     //unsubTalker

            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            //console.log("messages.AC_SUB_TALKER");

            // 상담중 sub 
            commit('MU_UNSUB_TALKER', payload);
        },

        // 메시지 추가 
        AC_USER_CHAT_MESSAGE: ({ commit }, payload) => {                     //userchatMessage


            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            //console.log("messages.userchatMessage", payload);

            // 보낼때 금칙어 변환 필요함.
            if (payload.msg.sndrcv_cd == 'snd' && payload.msg.message_type == 'TX' && payload.consultEnd != 'Y') {

                apiChatParam.post("chat-api/main/cnslr-prhibt-text-flter/process", {
                    MESSAGE: payload.msg.msg,
                    CUSTCO_ID : payload.msg.CUSTCO_ID
                  }, {head: {
                      "SERVICE" : "chat-api/main/cnslr-prhibt-text-flter/process",
                      "METHOD" : "inqire",
                      "TYPE" : "BIZ_SERVICE",
                }})
                .then((ret) => {
    
                    if (ret != null && ret != '' && ret.data.code >= 0) {
    
                        let retObj = Object.values(ret.data.data);
                        
                        if (ret.data.code >= 0 && ret.data.data.length > 0) {

                            if (ret.data.data[0].MESSAGE != '' && (Array.isArray(ret.data.data[0].MESSAGE) || typeof ret.data.data[0].MESSAGE == "object")) {
                                payload.msg.msg = JSON.stringify(ret.data.data[0].MESSAGE);
    
                            } else {
                                payload.msg.msg = ret.data.data[0].MESSAGE;
                            }
    
                            commit('MU_SOCKET_CHAT_MESSAGE', payload);
                            commit('MU_SET_MESSAGE_INFO', payload);
                        }
                    }
                });     


                //teleApi.callRestApi({ method: 'post', action: "chat-api/main/cnslr-prhibt-text-flter", MESSAGE: payload.msg.msg }, ret => {
				//teleApi.callRestApi({ method: 'post', action: "chat-api/main/cnslr-prhibt-text-flter/process", MESSAGE: payload.msg.msg }, ret => {
                //    if (ret.data.code >= 0 && ret.data.data.length > 0) {
                //        if (ret.data.data[0].MESSAGE != '' && (Array.isArray(ret.data.data[0].MESSAGE) || typeof ret.data.data[0].MESSAGE == "object")) {
                //            payload.msg.msg = JSON.stringify(ret.data.data[0].MESSAGE);
                //        } else {
                //            payload.msg.msg = ret.data.data[0].MESSAGE;
                //        }
                //        commit('MU_SOCKET_CHAT_MESSAGE', payload);
                //        commit('MU_SET_MESSAGE_INFO', payload);
                //    }
                //});

            } else {
                commit('MU_SOCKET_CHAT_MESSAGE', payload);
                commit('MU_SET_MESSAGE_INFO', payload);
            }

        },

        // 채팅목록 초기화 
        AC_INIT_TALK_LIST: ({ commit }, payload) => {            //inittalkList

            // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            // console.log("messages.inittalkList", payload);

            // 채팅목록 초기화
            commit('MU_INIT_TALKLIST', payload);
            
            // 상담중 sub 
            commit('MU_SUB_TALKERS', payload);

        },

        // 메시지 초기화 
        init_userchatMessage: ({ commit }, payload) => {

            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            //console.log("messages.init_userchatMessage");

            commit('INIT_MESSAGE', payload);

            if (payload.msg_list != null && payload.msg_list.length > 0) {

                payload.msg = payload.msg_list[payload.msg_list.length - 1];
                commit('MU_SET_MESSAGE_INFO', payload);
            }
        },

        subTalker: ({ commit }, payload) => {

            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            //console.log("messages.subTalker");

            // 상담중 sub 
            commit('SUB_TALKER', payload);
        },

        // 채팅목록 고객명 변경
        changeTalkListCustNm: ({ commit }, payload) => {

            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            //console.log("messages.changeTalkListCustNm");

            // 채팅목록 고객명 변경
            commit('CHANGE_TALKLIST_CUSTNM', payload);
        },

        // Dashboard 정보 초기화
        changeTalkDashboardInfo: ({ commit }, payload) => {

            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            //console.log("messages.changeTalkDashboardInfo");

            //teleApi.callRestApi({ method: 'post', action: "chat-api/main/dash-board-inqire" }, ret => {
			teleApi.callRestApi({ method: 'post', action: "chat-api/main/dash-board/inqire" }, ret => {

                if (ret != null && ret != '' && ret.data.code >= 0) {
                    let retObj = Object.values(ret.data.data);
                    if (ret != null && retObj.length > 0) {

                        let dashboardInfo = {
                            accept_cnt: retObj[0].ACCEPT_CNT,
                            acceptinqry_cnt: retObj[0].ACCEPTINQRY_CNT,
                            ready_cnt: retObj[0].READY_CNT,
                            counsel_cnt: retObj[0].COUNSEL_CNT,
                            after_cnt: retObj[0].AFTER_PROC_CNT
                        };
            
                        // 채팅목록 Dashboard 정보 초기화  
                        commit('CHANGE_DASHBOARDINFO', dashboardInfo);

                    }
                }

            });

        },

        // 상담정보 상세조회 ( 문의유형 1,2 / 채널정보등 )
        setSelectedContactInfo: ({ commit }, payload) => {

            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            //console.log("messages.setSelectedContactInfo");

            return new Promise((resolve, reject) => {

                //teleApi.callRestApi({ method: 'post', action: "api/chat/main/inqry-ty-detail/" + payload.cht_cutt_id }, ret => {
				teleApi.callRestApi({ method: 'post', action: "chat-api/main/inqry-ty/detail/" + payload.cht_cutt_id }, ret => {

                    if (ret != null && ret.data.code >= 0) {

                        let retObj = Object.values(ret.data.data);
                        let info = {
                            cht_cutt_id: retObj[0].CHT_CUTT_ID,
                            cht_user_key: retObj[0].CHT_USER_KEY,
                            sndr_key: retObj[0].SNDR_KEY,
                            asp_sender_key: retObj[0].SNDR_KEY,
                            cutt_stts_cd: retObj[0].CUTT_STTS_CD,
                            talk_sender_key_nm: retObj[0].TALK_SENDER_KEY_NM,
                            talk_inqry_full_nm: retObj[0].TALK_INQRY_FULL_NM,
                            inqry_lv1_cd: retObj[0].Lv1_CD,
                            inqry_lv2_cd: retObj[0].Lv2_CD,
                            member_yn: retObj[0].MEMBER_YN,
                            customer_nm: retObj[0].CUSTOMER_NM,
                        };

                        // let info = state.chtCuttInfo.map(
                        //   (items) => ({
                        //     ...items ,
                        //     cht_cutt_id : retObj[0].CHT_CUTT_ID,
                        //     cht_user_key   : retObj[0].CHT_USER_KEY,
                        //     sndr_key : retObj[0].SNDR_KEY,
                        //     cutt_stts_cd     : retObj[0].CUTT_STTS_CD,
                        //     talk_sender_key_nm  :  retObj[0].TALK_SENDER_KEY_NM,
                        //     talk_inqry_full_nm  :  retObj[0].TALK_INQRY_FULL_NM,
                        //     inqry_lv1_cd        :  retObj[0].Lv1_CD,
                        //     inqry_lv2_cd        :  retObj[0].Lv2_CD
                        // }));

                        // 상담정보 detail 
                        commit('SET_SELECTED_CONTACT_INFO', info);

                        resolve();

                    } else {
                        reject();
                    }

                });

            })


        },

        // 선택된 상담 기본정보 셋팅
        setSelectedContactDefaultInfo: ({ commit }, payload) => {

            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            //console.log("messages.setSelectedContactDefaultInfo");

            // let info = state.chtCuttInfo.map(
            //   (items) => ({
            //     ...items ,
            //     cht_cutt_id : payload.CHT_CUTT_ID ,
            //     cht_user_key   : payload.CHT_USER_KEY,
            //     sndr_key : payload.SNDR_KEY,
            //     cutt_stts_cd     : payload.CUTT_STTS_CD,
            // }));

            return new Promise((resolve, reject) => {

                let info = {
                    cht_cutt_id: payload.CHT_CUTT_ID,
                    cht_user_key: payload.CHT_USER_KEY,
                    sndr_key: payload.SNDR_KEY,
                    cutt_stts_cd: payload.CUTT_STTS_CD,
                    asp_sender_key: payload.SNDR_KEY,
                };

                commit('SET_SELECTED_CONTACT_INFO', info);
                resolve();
            });
        }

        /****************************************************************************************************************************************************
         * message actions END
         ****************************************************************************************************************************************************
         ***************************************************************************************************************************************************/
    },
};

export default messages;

/** 
const frameInfo = {

    state: {
        minHeight: '',
    },
}

const scriptInfo = {

    state: {
        info: {},
    },
}

export default new Vuex.Store({
    modules: {
        messages,
        frameInfo,
        scriptInfo,
    }
})
*/