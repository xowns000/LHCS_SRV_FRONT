import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment';
import api from "../apiUtil.js";
import apiChat from "../apiChatParamUtil.js";
import { stompUtil } from "@/store/stomp-util.js";


Vue.use(Vuex);

const chatStore = {

    state: {
        messages: [],
        talkList: [], // 채팅목록
        custInfo: {}, // 대화자 
        chtCuttInfo: {
          cht_cutt_id: '20211129153415700uylJX',
          cht_user_key: '1009_IIepKa5g-mxE',
          sndr_key: '1009',
          cutt_stts_cd: 'KAKAOBZC',
        }, // 대화 정보
        csrf: '', // csrf
        userId: '', // 상담원정보 
        userNm: '', // 상담명 
        custcoId: '', // 고객사키(asp)
        overlayShow: false, // overylay show
        processInfo: [ // 채팅목록 프로세스 목록
            { id: 'ready', tab: '상담대기', badge: '', badgeClass: 'is-gray', isRead: '-1', isActive: true },
            { id: 'talking', tab: '상담', badge: '', badgeClass: 'is-gray', isRead: '-1', isActive: true },
            { id: 'post', tab: '후처리', badge: '', badgeClass: 'is-gray', isRead: '-1', isActive: true },
            // { id: 'callback', tab: '콜백', badge: '', badgeClass: 'is-gray', isRead: '-1', isActive: true },
            { id: 'end', tab: '종료', badge: '', badgeClass: 'is-gray', isRead: '-1', isActive: false },
        ],
        dashboardInfo: [ // dashboard 목록
            { id: 'accept', name: '인입', badge: '0' },
            { id: 'acceptinqry', name: '배정대기', badge: '0' },
            { id: 'ready', name: '상담대기', badge: '0' },
            { id: 'counsel', name: '상담중', badge: '0' },
            { id: 'after', name: '후처리', badge: '0' },
        ],
        selectedProcessStat: [], // 선택된 프로세스 상태값
        token: '', // token  
        subscriptionList: [], // sub 목록 
        readyTimeout: 0, // 재분배 타임아웃 
		simsessionId : '',
        blobYn: 'N', //파일처리 BLOB 여부
        cnslDiv: '',
        cnslHstTypeCd: '',
        sndrKey: '',
        storeTalkUserKey: '',
        ieFlag: /*@cc_on!@*/false || !!document.documentMode,
        
        CHAT_CUSTCO_ID: '',    //채팅목록에서 채팅을 클릭 시 화면에 해당 회사의 정보들을 출력
        CHAT_SNDR_KEY: '',   //현재 채팅 채널
        cnslSaveFrameF: false,   //후처리 이후 상담완료창을 닫기 위한 변수
        talkStatCdF: '',          //후처리 입력창을 열기위한 변수
        noCallBack: '',
        imgSrc: '',              //회사 로고 이미지 경로
    },

    /**
     * chat message obj getters
     * @type {string, string}
     */
    getters: {
      GE_MSG_TOKEN: (state) => state.token,
      GE_MSG_USERID: (state) => state.userId,
      GE_MSG_USERNAME: (state) => state.userNm,
      GE_MSG_CUSTCOID: (state) => state.custcoId,

      GE_MSG_READYTIMEOUT: (state) => state.readyTimeout,
      GE_MSG_BLOBYN: (state) => state.blobYn,

        getContentProcessInfo: (state) => () => {
            return state.processInfo;
        },

        getContentDashboardInfo: (state) => () => {
            return state.dashboardInfo;
        },

        getMsgObj: (state) => (payload) => {

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
                is_read: payload.IS_READ == null ? '0' : payload.IS_READ

            };
        },

        getContactInfo: (state) => () => {

            return state.chtCuttInfo != null && state.chtCuttInfo != '' ? state.chtCuttInfo : '';
        },

        getUserId: (state) => () => {

            return state.userId != null && state.userId != '' ? state.userId : '';
        },

        /**
         * [{cht_user_key:xxxx, msg_list:[{},{}]}, {cht_user_key:xxxx, msg_list:[{},{}]} ]
         */
        getContactMsg: (state) => (payload) => {

            if (payload.cht_cutt_id != null && payload.cht_cutt_id != '') {

                let obj = Vue._.find(state.messages, { 'cht_cutt_id': payload.cht_cutt_id });
                if (obj == null || obj == '') {

                    obj = { 'cht_cutt_id': payload.cht_cutt_id, 'msg_list': [] }
                    state.messages.push(obj);
                }

                return obj.msg_list;
            }

            return '';
        },

        getSubscriptionList: (state) => (payload) => {
            return state.subscriptionList;
        },

        getTalkList: (state) => () => {
            return state.talkList;
        },

    },
    mutations: {

        SOCKET_CHAT_MESSAGE(state, payload) {

            // 상담중
            if (payload.msgObj != null && payload.msgObj != '') {

                // xss 필터 (db 저장변경됨.)
                if (payload.msg.msg != null && payload.msg.msg != "") {
                    //payload.msg.msg = teleApi.restoreXSS(payload.msg.msg);
                }

                payload.msgObj.push(payload.msg);
            }

        },

        INIT_MESSAGE(state, payload) {


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

        // 메시지 추가 후 작업 
        SET_MESSAGE_INFO(state, payload) {

            let talkerObj = '';
            if (payload.msgObj != null && payload.msgObj != '') { // 상담중

                talkerObj = Vue._.find(state.talkList, { 'CHT_CUTT_ID': payload.msg.cht_cutt_id });
            } // 대기중
            else {
                talkerObj = Vue._.find(state.talkList, { 'CHT_USER_KEY': payload.msg.user_key, 'CUTT_STTS_CD': "WAIT" });
                if (talkerObj == null) talkerObj = Vue._.find(state.talkList, { 'CHT_USER_KEY': payload.msg.user_key, 'CUTT_STTS_CD': "TRAN_WAIT" });
            }

            if (talkerObj != null) {
                talkerObj.TALK_TITLE = payload.msg.msg;
                talkerObj.CHT_CUTT_ID = payload.msg.cht_cutt_id;
                
                //신규msg 뱃지 20201020
                talkerObj.UNREAD_CNT = parseInt(talkerObj.UNREAD_CNT) + 1;
                
                if (payload.msg.cutt_stts_cd != '' && payload.msg.cutt_stts_cd != null) talkerObj.CUTT_STTS_CD = payload.msg.cutt_stts_cd;
                if (payload.msg.cutt_stts_nm != '' && payload.msg.cutt_stts_nm != null) talkerObj.TALK_STAT_NM = payload.msg.cutt_stts_nm;
            }
        },

        // 채팅목록 초기화
        INIT_TALKLIST(state, payload) {

            state.talkList = payload;

        },

        // 구독(채팅목록)
        SUB_TALKERS(state, payload) {

            // 상담중 / 대기중건들은 inout sub 처리를 함.
            if (state.talkList != null && state.talkList.length > 0) {

                for (var i = 0; i < state.talkList.length; i++) {

                    var uri = "/topic/inout/" + state.talkList[i].CHT_USER_KEY;
                    let subObjIdx = Vue._.findIndex(state.subscriptionList, { 'uri': uri });

                    if ((state.talkList[i].CUTT_STTS_CD == "ING" || state.talkList[i].CUTT_STTS_CD == "WAIT" || state.talkList[i].CUTT_STTS_CD == "TRAN_WAIT") &&
                        subObjIdx < 0) {

                        var chatMessage = {
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

                        // stompUtil.connect(
                        //   () => {
                        //           var subscription  = stompUtil.subscribe(uri, chatMessage);

                        //           state.subscriptionList.push({"uri" : uri , "subscription" : subscription});
                        //         }, 
                        //   (error) => {
                        //     if( error != null) {
                        //         console.log(error);
                        //         //this.connected = false;
                        //     }
                        //   }
                        // );

                    }
                    // 구독중이나 상태가 이미 변경 된 대상 ( 실시간으로 빠진다 그러나 네트웍 단절로 인해 실시간 처리가 안된 경우 이로 인해 정리가 된다.)
                    // else if (( state.talkList[i].CUTT_STTS_CD != "12" || state.talkList[i].CUTT_STTS_CD != "11" ) && subObjIdx >= 0) {

                    //       let subObj = Vue._.find(state.subscriptionList, { 'uri': uri }); // unsub
                    //       subObj.subscription.unsubscribe();
                    //       state.subscriptionList.splice(subObjIdx, 1);
                    // } 
                }

            }
        },

        // 컨텐츠별 sub 
        SUB_TALKER(state, payload) {

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

        // TALKER 추가 
        UNSHIFT_TALKER(state, payload) {
            // console.log('Store.message.mutations : UNSHIFT_TALKER' + payload.length );

            if (Vue._.findIndex(state.talkList, { 'CHT_USER_KEY': payload.CHT_USER_KEY, 'CUTT_STTS_CD': payload.CUTT_STTS_CD }) < 0) {
                var uri = "/topic/inout/" + payload.CHT_USER_KEY;

                state.talkList.unshift(payload);

            }

        },

        // TALKER 삭제 
        SPLICE_TALKER(state, payload) {
            // console.log('Store.message.mutations : SPLICE_TALKER' + payload.length + "-" +state.talkList);

            let index = -1;
            if (payload.CHT_CUTT_ID != null && payload.CHT_CUTT_ID != '') // 상담중 목록 삭제
                index = Vue._.findIndex(state.talkList, { 'CHT_CUTT_ID': payload.CHT_CUTT_ID });
            else {
                index = Vue._.findIndex(state.talkList, { 'CHT_USER_KEY': payload.user_key, 'CUTT_STTS_CD': "11" });
                if (index < 0) index = Vue._.findIndex(state.talkList, { 'CHT_USER_KEY': payload.user_key, 'CUTT_STTS_CD': "13" });
            } // 대기중 목록 삭제 

            if (index >= 0) state.talkList.splice(index, 1);

        },

        // 구독해제 
        UNSUB_TALKER(state, payload) {
            // console.log('Store.message.mutations : UNSUB_TALKER' + payload.length + "-" +state.subscriptionList);

            let subObj = Vue._.find(state.subscriptionList, { 'uri': payload.uri }); // unsub
            subObj.subscription.unsubscribe();

            var index = Vue._.findIndex(state.subscriptionList, { 'uri': payload.uri }); // unsub
            state.subscriptionList.splice(index, 1);
        },

        CHANGE_PROCESSINFO(state, payload) {

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
                            Vue._.indexOf(payload.selected_stat, 'ready') >= 0 ? 1 : 0) ||
                        (items.id == 'talking' && (items.badge == '' ||
                                (payload.talking_cnt == items.badge && items.isRead != 0) ||
                                Vue._.indexOf(payload.selected_stat, 'talking') >= 0 ? 1 : 0) ||
                            (items.id == 'end' && (items.badge == '' ||
                                    (payload.end_cnt == items.badge && items.isRead != 0) ||
                                    Vue._.indexOf(payload.selected_stat, 'end') >= 0 ? 1 : 0) ||
                                (items.id == 'post' && (items.badge == '' ||
                                        (payload.end_cnt == items.badge && items.isRead != 0) ||
                                        Vue._.indexOf(payload.selected_stat, 'post') >= 0 ? 1 : 0) ||
                                    (items.id == 'callback' && (items.badge == '' ||
                                        (payload.callback_cnt == items.badge && items.isRead != 0) ||
                                        Vue._.indexOf(payload.selected_stat, 'callback') >= 0 ? 1 : 0) || 0)))))
                }));

            state.processInfo = retObj;

        },

        CHANGE_DASHBOARDINFO(state, payload) {

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

    },
    actions: {

        // 메시지 추가 
        userchatMessage: ({ commit }, payload) => {


            // 보낼때 금칙어 변환 필요함.
            if (payload.msg.sndrcv_cd == 'snd' && payload.msg.message_type == 'TX' && payload.consultEnd != 'Y') {

                //teleApi.callRestApi({ method: 'post', action: "chat-api/main/cnslr-prhibt-text-flter", MESSAGE: payload.msg.msg }, ret => {
				api.post("chat-api/main/cnslr-prhibt-text-flter/process",
          {
            MESSAGE: payload.msg.msg 
          })
          .then((ret) => {

                    if (ret.data.code >= 0 && ret.data.data.length > 0) {

                        if (ret.data.data[0].MESSAGE != '' && (Array.isArray(ret.data.data[0].MESSAGE) || typeof ret.data.data[0].MESSAGE == "object")) {
                            payload.msg.msg = JSON.stringify(ret.data.data[0].MESSAGE);

                        } else {
                            payload.msg.msg = ret.data.data[0].MESSAGE;
                        }

                        commit('SOCKET_CHAT_MESSAGE', payload);
                        commit('SET_MESSAGE_INFO', payload);
                    }
                });

            } else {
                commit('SOCKET_CHAT_MESSAGE', payload);
                commit('SET_MESSAGE_INFO', payload);
            }

        },

        // 메시지 초기화 
        init_userchatMessage: ({ commit }, payload) => {

            commit('INIT_MESSAGE', payload);

            if (payload.msg_list != null && payload.msg_list.length > 0) {

                payload.msg = payload.msg_list[payload.msg_list.length - 1];
                commit('SET_MESSAGE_INFO', payload);
            }
        },

        // 채팅목록 초기화 
        inittalkList: ({ commit }, payload) => {

            // 채팅목록 초기화
            commit('INIT_TALKLIST', payload);
            // 상담중 sub 
            commit('SUB_TALKERS', payload);

        },

        // 채팅목록 추가 
        unshiftTalker: ({ commit }, payload) => {

            commit('UNSHIFT_TALKER', payload);

            // 상담중 sub 
            commit('SUB_TALKERS', payload);
        },

        // 채팅목록 제거
        spliceTalker: ({ commit }, payload) => {

            commit('SPLICE_TALKER', payload);

            // 상담중 sub 
            commit('UNSUB_TALKER', payload);
        },

        // 구독해제
        unsubTalker: ({ commit }, payload) => {

            // 상담중 sub 
            commit('UNSUB_TALKER', payload);
        },

        subTalker: ({ commit }, payload) => {

            // 상담중 sub 
            commit('SUB_TALKER', payload);
        },

        // 채팅목록 고객명 변경
        changeTalkListCustNm: ({ commit }, payload) => {
            // 채팅목록 고객명 변경
            commit('CHANGE_TALKLIST_CUSTNM', payload);
        },

        // 프로세스 정보 초기화
        changeTalkProcessInfo: ({ commit }, payload) => {

            //teleApi.callRestApi({ method: 'post', action: "chat-api/main/count-inqire-by-cnslt-sttus" }, ret => {
			api.post("chat-api/main/count-by-cnslt-sttus/inqire")

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
                        commit('CHANGE_PROCESSINFO', processInfo);

                    }
                }

            });

        },
		
		
        // Dashboard 정보 초기화
        changeTalkDashboardInfo: ({ commit }, payload) => {

            //teleApi.callRestApi({ method: 'post', action: "chat-api/main/dash-board-inqire" }, ret => {
			api.post("chat-api/main/dash-board/inqire")
      .then((ret) => {

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

            return new Promise((resolve, reject) => {

                //teleApi.callRestApi({ method: 'post', action: "api/chat/main/inqry-ty-detail/" + payload.cht_cutt_id }, ret => {
				api.post("chat-api/main/inqry-ty/detail/" + payload.cht_cutt_id)
         .then((ret) => {

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

    },


};

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
        frameInfo,
        scriptInfo,
    }
})