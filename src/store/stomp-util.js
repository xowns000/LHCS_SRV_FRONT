/**
 * websocket 관련 비지니스 
 */

import Vue      from 'vue';
import SockJS   from "sockjs-client";
import Stomp    from "webstomp-client";

import _ from 'lodash';

import { mixin } from "@/mixin/mixin.js"

import { eventBus } from "@/store/eventBus.js";           //Event Bus
import chatStore from './modules/chatStore';
import store from "./index.js";

export const stompUtil = new Vue({
    mixins: [mixin],
    data() {
        return {
            stompClient : '',
            contactInfo : '',//Vue.prototype.store != null ? Vue.prototype.store.getters.getContactInfo() : '',
            connected   : false,
            baseSocketUrl: process.env.VUE_APP_SOCKET_URL,
            token : '',
            userId : '',
            custcoId:'',
            lgnId:'',
        };
    },
    methods: {
        
        /**
         * connnected 여부 
         * @returns 
         */
        isConnected() {
            return this.connected;
        },

        /**
         * connnected 값 셋팅
         * @param {*} val 
         */
        setConnected(val) {
            this.connected = val;
        },
        
        /**
         * websocket connect 
         * @param {*} connectCallback 연결 성공 콜백 
         * @param {*} errorCallback  연결 실패 콜백 ( 재연결 시도 )
         *  @param {*} store
         */ 
        //connect(connectCallback, errorCallback, contactInfo, store) {
        connect(connectCallback, errorCallback) {
            
            if (!this.connected) {

                const sockJsUrl = this.baseSocketUrl + "secured/ws-stomp?userId=" + this.userId + "&custcoId=" + this.custcoId + "&lgnId=" + this.lgnId.replace('#', '%23');
                
                let options = {debug: false, protocols: Stomp.VERSIONS.supportedProtocols()};

                this.socket = new SockJS(sockJsUrl);
                console.log("this.socket", this.socket);
                this.stompClient = Stomp.over(this.socket, options);
                //this.contactInfo = contactInfo;
                
                this.stompClient.reconnect_delay = 3000;
                this.stompClient.heartbeat.outgoing = 3000;
                this.stompClient.heartbeat.incoming = 3000;
                
                if(process.env.VUE_APP_ENV === 'production') {
                    this.stompClient.debug = function() {};
                }
                
                this.stompClient.connect(
                    { 
                        "token":this.token
                        , "Authorization":  "bearer " + window.sessionStorage.getItem("token")
                        , "userId" : this.userId
                        , "custcoId" : this.custcoId
                        , "CERT-CUSTCO-TENANT-ID": store.getters["authStore/GE_CUSTCO_TENANT_ID"]
                    },
                    frame => { 
                        this.setConnected(true);
                        connectCallback(frame) 
                    },
                    error => { 

                        // console.log("stompUtil connect LostConnect errorCallback >>>> " + this.token); 

                        this.setConnected(false);
                        errorCallback(error) 
                    },
                );

                this.stompClient.ws.onclose = function() {
                    errorCallback('close event');
                };
                
            }
            else {
                connectCallback();
            }
        },
        
        /**
         * 웹소켓 연결 종료 
         */
        disconnect() {

            if(this.stompClient  != null) {

                this.stompClient.disconnect();
                this.setConnected(false);
            }
        },
        
        /**
         * SUB 구독 
         * @param {*} uri               구독 uri
         * @param {*} chatMessage       구독시 data 
         * @returns 
         */ 
        subscribe(uri, chatMessage) {
        
        //    console.log("stompUtil subscribe >>>> ", chatMessage); 

            return this.stompClient.subscribe(uri, message => { 
                this.onmessage(message); 
            }, chatMessage);
        },

        /**
         * 재구독 재연결 후 ( 네트웍 단절 후 구독 다시 해줘야 함.)
         */ 
        subscribeAfterReconnect(subList) {
            let subListLen  = subList.length;   
            
            if(subList != null && subListLen > 0) {
                
                let i = 0;

                for(; i<subListLen; i++) {
                    var subObj = subList[i];
                    this.subscribe(subObj.uri, subObj.chatMessage);
                }
            }
        },

        /**
         * 메시지 인입 
         * @param {*} message 
         */ 
        onmessage(message) {
            
            let dest = message.headers.destination;
        
        //    console.log("stompUtil subscribe onmessage >>>> " + message); 

           if (_.isMatch(message.headers.destination, '/queue/ready/')) {      //if (Vue._.isMatch(message.headers.destination, '/queue/ready/')) { if (dest.match('/queue/ready/')) {
            //    console.log("stompUtil subscribe /queue/ready/ busReadyCallback >>>> "); 
               eventBus.busReadyCallback(message);                             //this.readyCallback(message);        // 상담원 대기 구독 메시지 인입  
            }
            else {
            //    console.log("stompUtil subscribe busInoutCallback >>>> ");
                eventBus.busInoutCallback(message);   
               eventBus.busThirdInoutCallback(message);                          //this.inoutCallback(message);        // 채팅 메시지 인입    
            }
        },
 
        /**
        * ready callback 함수  
        * @param {*} message 
        */ 
       //readyCallback(message) {
       //     
       //     if (typeof message.body !== "undefined") {
       //         let recvJson = JSON.parse(message.body);
       //         let data = JSON.parse(recvJson.telewebJsonString);
       //         let uri = message.headers.destination;
       //         
       //         //20210106
       //         if (recvJson.chatType == "READY" && recvJson.chatEvent == "AGENT_READY") {
       //             let sessionId = recvJson.sessionId;
       //             
       //             //this.$store.state.message.simsessionId = sessionId;
       //             //Vue.prototype.store.dispatch("AC_SIM_SESSION_ID",  {sessionId: sessionId});
       //             this.$store.dispatch("messages/AC_SIM_SESSION_ID", {sessionId: sessionId});
       //         }
       //         if (data.DATA != null && data.DATA.length > 0) {
       //             let i = 0;
       //             let dataLen = data.DATA.length;
       //             for (; i < dataLen; i++) {
       //                 
       //                 let talkUserKey = data.DATA[i].CHT_USER_KEY;
       //                 let userKey = data.DATA[i].user_key; 
       //                 
       //                 if (dataLen > 0 && ((talkUserKey != null &&talkUserKey != "") || (userKey != null && userKey != ""))) {
       //                     // 상담종료 메시지 보여줌. unsubscription ( 필요없음 redis 삭제 되므로.)
       //                     if (recvJson.chatEvent == 'EXPIRED_SESSION_CUST') {
       //                         
       //                         data.DATA[i].uri = uri;
       //                         
       //                         Vue.prototype.store.dispatch('spliceTalker', data.DATA[i]).then(() => {
       //                              Vue.prototype.store.dispatch("changeTalkProcessInfo", {selected_stat : ''});
       //                         });     // 목록 삭제 (구독해제 포함)
       //                     }   
       //                     else {
       //                          
       //                         // data.DATA[i].TALK_STAT_NM = "대기중";
       //                         data.DATA[i].TALK_STAT_NM = this.getTalkStatName(data.DATA[i].TALK_STAT_CD);
       //                         data.DATA[i].USER_ID = recvJson.userId;
       //                         data.DATA[i].AUTO_GREETING_YN = data.DATA[i].TALK_STAT_CD == '11' || data.DATA[i].TALK_STAT_CD == '13'? 'N' : 'Y';
       //                         Vue.prototype.store.dispatch('unshiftTalker', data.DATA[i]).then(() => {
       //                              Vue.prototype.store.dispatch("changeTalkProcessInfo", {selected_stat : ''});
       //                         });
       //                          
       //                         // Arthur.Kim eventBus.getTalkers();      //신규 메시지를 받으면 새로고침
       //                     }
       //                 }
       //             }
       //         }
       //     }
       //},
 
        /**
        * inout callback 함수  
        * @param message 메시지 
        */
       //inoutCallback(message) {
       //     
       //     console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 13");
       //      if (typeof (message.body) !== "undefined") {
       //          var recvJson = JSON.parse(message.body);
       //          var data = JSON.parse(recvJson.telewebJsonString);
       //          var uri = message.headers.destination;
       //          
       //          if (data.DATA.length > 0 && data.DATA[0].user_key != null && data.DATA[0].user_key != '') {
       //              data.DATA[0].uri = uri;
       //              if (data.DATA[0].SNDRCV_CD == null || data.DATA[0].SNDRCV_CD == '') data.DATA[0].sndrcv_cd = 'rcv'
       //              // 자신이 보낸 메시지는 스킵 처리 한다.( 구독자 모두에게 다시 전송 되므로..)
       //              if (data.DATA[0].SNDRCV_CD == 'SND' && data.DATA[0].USER_ID == Vue.prototype.store.getters.getUserId()) {
       //                  return;
       //              }
       //              
       //              // 제3자 채팅
       //              if (data.DATA[0].SNDRCV_CD == 'TRAN') {
       //                  data.DATA[0].content = data.DATA[0].message;
       //              } 
       //              
       //              // 무응답은 error_msg 가 메시지 내용임.
       //              // console.log("obj.inoutCallback >> " + recvJson.attachment + '-' + recvJson.org_cont_id  + '-' + data.DATA[0].attachment + '-' + data.DATA[0].org_cont_id  + '-' );
       //              if (recvJson.chatEvent == 'NO_CUSTOMER_RESPONSE' || recvJson.chatEvent =='EXPIRED_AGENT_SESSION') {
       //                  data.DATA[0].content = data.HEADER.ERROR_MSG;
       //                  data.DATA[0].sndrcv_cd = 'snd';
       //                  data.DATA[0].USER_NAME = 'SYSTEM';
       //              }
       //              if (typeof data.DATA[0].content == "object" || Array.isArray(data.DATA[0].content)){
       //                  data.DATA[0].content = JSON.stringify(data.DATA[0].content);
       //              }
       //              let msg = Vue.prototype.store.getters.getMsgObj(data.DATA[0]);
       //              let msgObj = Vue.prototype.store.getters.getContactMsg({ cht_cutt_id: data.DATA[0].CHT_CUTT_ID });
       //              
       //              // 상담종료 메시지 보여줌. unsubscription ( 필요없음 redis 삭제 되므로.)
       //              if (recvJson.chatEvent == 'EXPIRED_SESSION_CUST') {
       //                  // 상담중 완료
       //                  let talkerObj = Vue._.find(Vue.prototype.store.getters.getTalkList(), { 'CHT_CUTT_ID': data.DATA[0].CHT_CUTT_ID });
       //                  // console.log("obj.EXPIRED_SESSION_CUST >> " + talkerObj + '-' + data.DATA[0].CHT_CUTT_ID);
       //                  if (talkerObj != null && talkerObj != '' && data.DATA[0].CHT_CUTT_ID != null) {     // 이미 상담 시작됨.
       //                      talkerObj.TALK_STAT_CD = data.DATA[0].TALK_STAT_CD
       //                      talkerObj.TALK_STAT_NM = this.getTalkStatName(data.DATA[0].TALK_STAT_CD);
       //                      msg.msg_notice = "상담이 종료되었습니다. 상담이력을 저장해 주시기 바랍니다.";    
       //                      Vue.prototype.store.dispatch('unsubTalker', data.DATA[0]).then(() => {
       //                          Vue.prototype.store.dispatch("changeTalkProcessInfo" , {selected_stat : ''});
       //                      });     // 구독해제
       //                  } else {    // 대기중         
       //                      
       //                      Vue.prototype.store.dispatch('spliceTalker', data.DATA[0]).then(() => {
       //                          Vue.prototype.store.dispatch("changeTalkProcessInfo", {selected_stat : ''});
       //                      });     // // 대기중 완료 목록 삭제 (구독해제 포함)    
       //                  }
       //                  
       //                  // 현재 선택 채팅이 변경 된 경우만 변경 처리 
       //                  if( data.DATA[0].CHT_CUTT_ID == Vue.prototype.store.state.messages.chtCuttInfo.cht_cutt_id) {
       //                      // Arthur.Kim eventBus.changeChatInfo(()=>{});
       //                  }
       //                  window.focus();
       //              }
       //              // 전달완료 (목록에서 삭제 )
       //              else if (recvJson.chatEvent == 'EXPIRED_AGENT_SESSION') {
       //                  Vue.prototype.store.dispatch('spliceTalker', data.DATA[0]).then(() => {
       //                      Vue.prototype.store.dispatch("changeTalkProcessInfo", {selected_stat : ''});
       //                      if( data.DATA[0].CHT_CUTT_ID == Vue.prototype.store.state.messages.chtCuttInfo.cht_cutt_id) {
       //                          // Arthur.Kim eventBus.changeChatInfo(()=>{});
       //                      }
       //                      
       //                  });     // 목록 삭제 (구독해제 포함)    
       //                  
       //                  return;
       //              }    
       //              Vue.prototype.store.dispatch("userchatMessage", { "msg": msg, "msgObj": msgObj });
       //              
       //          }
       //      }
       //},

        // 메시지 전송 
        sendMessage(MSG_INFO,CHAT_INFO, chatmsg, msgObj) {
             // error 처리 필요함.
            return new Promise((resolve , reject) => { 
 
                 //var contactInfo = this.contactInfo != null && this.contactInfo != '' ? this.contactInfo : Vue.prototype.store.getters.getContactInfo();
                 //var userId = Vue.prototype.store.getters.getUserId() != '' ? Vue.prototype.store.getters.getUserId() : contactInfo.user_id
                 //var aspNewCustKey = Vue.prototype.store.state.messages.CHAT_CUSTCO_ID
                
                var sendData = {
                    HEADER: { in_out: 'sendMessage' }
                    , DATA: [{
                        CHT_CUTT_ID: CHAT_INFO.chtCuttId
                        , sndrKey: CHAT_INFO.sndrKey
                        , message_type: MSG_INFO.message_type//'TX'
                        , CHT_CUTT_DTL_ID: ''// 서버처리로 변경 
                        , USER_ID: CHAT_INFO.userId
                        , SNDRCV_CD: MSG_INFO.SNDRCV_CD //'SND'
                        , type: MSG_INFO.type  //'message'
                        , message: MSG_INFO.msg
                        , chnClsfCd: CHAT_INFO.chnClsfCd
                        , consultEnd : MSG_INFO.consultEnd != '' ? MSG_INFO.consultEnd : ''
                        , IMAGE_TALK_PATH : MSG_INFO.IMAGE_TALK_PATH != '' ? MSG_INFO.IMAGE_TALK_PATH : ''
                        , image : MSG_INFO.image != '' ? MSG_INFO.image : ''
                        , FILE_GROUP_KEY : MSG_INFO.FILE_GROUP_KEY != '' ? MSG_INFO.FILE_GROUP_KEY : ''
                        , FILE_KEY : MSG_INFO.FILE_KEY != '' ? MSG_INFO.FILE_KEY : ''
                        , UNTACT_ID : MSG_INFO.UNTACT_ID != '' ? MSG_INFO.UNTACT_ID : ''
                        , FILE_BLOB : MSG_INFO.FILE_BLOB != '' ? MSG_INFO.FILE_BLOB : ''
                        , FILE_EXTS : MSG_INFO.FILE_EXTS != '' ? MSG_INFO.FILE_EXTS : ''
                        , CUSTCO_ID : CHAT_INFO.custcoId
                        , custId : CHAT_INFO.custId
                        , CHT_USER_KEY : CHAT_INFO.chtUserKey
                    }]
                };
                console.log("MSG_INFO.type", MSG_INFO.type);
                if(MSG_INFO.type == 'file'){
                    sendData.DATA[0]["file_url"] = MSG_INFO.file_url;
                    sendData.DATA[0]["file_name"] = MSG_INFO.file_name;
                    sendData.DATA[0]["file_size"] = MSG_INFO.file_size;
                } else if(MSG_INFO.type == 'audio'){
                    sendData.DATA[0]["file_url"] = MSG_INFO.file_url;
                }
                console.log("sendData", sendData);
                eventBus.userchatMessage({ "msg": chatmsg, "msgObj": msgObj });

                var sendDataStr = JSON.stringify(sendData);

                this.stompClient.send("/app/inout/chat/message", sendDataStr, { "token": CHAT_INFO.token, "userKey": CHAT_INFO.chtUserKey, "CERT-CUSTCO-TENANT-ID": store.getters["authStore/GE_CUSTCO_TENANT_ID"]});

                resolve();
            });
        },
    },
})
