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
 
export const stompSseUtil = new Vue({
    mixins: [mixin],
    data() {
        return {
            sseConnected   : false,
            sseStompClient : '',
            baseSocketUrl: process.env.VUE_APP_SSE_URL,
            token : '',
            lgnId : '',
            userId : '',
            roomId : '',
            custcoId: '',
            schemaId: '',
            ipAddr: ''
        };
    },
    methods: {

        /**
         * connnected 여부
         * @returns
         */
        isConnected() {
            return this.sseConnected;
        },

        /**
         * connnected 값 셋팅
         * @param {*} val
         */
        setConnected(val) {
            this.sseConnected = val;
        },

        /**
         * websocket connect
         * @param {*} connectCallback 연결 성공 콜백
         * @param {*} errorCallback  연결 실패 콜백 ( 재연결 시도 )
         *  @param {*} store
         */
        //connect(connectCallback, errorCallback, contactInfo, store) {
        connect(connectCallback, errorCallback) {

            if (!this.sseConnected) {

                const sockJsUrl = this.baseSocketUrl + "/secured/ws-stomp?l="+ this.lgnId.replace('#', '%23') +"&u=" + this.userId + "&c=" + this.custcoId + "&s=" + this.schemaId;

                let options = {debug: false, protocols: Stomp.VERSIONS.supportedProtocols()};

                this.socket = new SockJS(sockJsUrl);
                this.sseStompClient = Stomp.over(this.socket, options);

                this.sseStompClient.reconnect_delay = 3000;
                this.sseStompClient.heartbeat.outgoing = 3000;
                this.sseStompClient.heartbeat.incoming = 3000;

                if(process.env.VUE_APP_ENV === 'production') {
                    this.sseStompClient.debug = function() {};
                }

                this.sseStompClient.connect(
                    {
                        "token":this.token
                        //, "Authorization":  "bearer " + window.sessionStorage.getItem("token")
                        , "userId" : this.userId
                        , "lgnId" : this.lgnId
                        , "ipAddr": this.ipAddr
                        , "roomId" : this.schemaId + "_" + this.custcoId
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

                this.sseStompClient.ws.onclose = function() {
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

            if(this.sseStompClient  != null) {

                this.sseStompClient.disconnect();
                this.setConnected(false);
            }
        },

        /**
         * SUB 구독
         * @param {*} uri               구독 uri
         * @param {*} sseMessage       구독시 data
         * @returns
         */
        subscribe(_this, uri, sseMessage) {
           return this.sseStompClient.subscribe(uri, message => {
               this.onmessage(_this, message);
           }, sseMessage);
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
        onmessage(_this, message) {
            let body = JSON.parse(message.body);
            if( !body.pos ) body.pos = "top";
            if( !body.second ) body.second = "5";
            if( body.receiver === 'ALL'  ){
                this.sseProcess( _this, body );
            }else if( body.receiver === this.userId && body.roomId === this.schemaId + "_" + this.custcoId ){
                this.sseProcess( _this, body );
            }
        },

        sseProcess( _this, body ) {
            let msg = '';
            if( body.type === "SYSTEM_LOGOUT" ) {    //로그아웃
                if( body.message != null ) msg = body.message;
                if( body.second > 0) _this.showToast({  msg: msg, class: 'info', hasToastIcon: true, icon: 'mdi-information-outline', time: (Number(body.second) * 1000), type: body.pos, progress: true, close: true});
                if( body.second > 0) msg = "";
                setTimeout(function(){ _this.logout( msg );}, (Number(body.second) * 1000));
            }else if( body.type === "SYSTEM_CHECK" ) {
                msg = '잠시 후 시스템점검 예정입니다.'+ Number(body.second) +'초 후 자동로그아웃 됩니다.';
                _this.showToast({msg: msg , class: 'info', hasToastIcon: true, icon: 'mdi-information-outline', time: (Number(body.second) * 1000), type: body.pos, progress: true, close: true});
                setTimeout(function() {_this.logout();}, (Number(body.second) * 1000));
            }else if( body.type === "SYSTEM_MESSAGE" ) {
                let result = JSON.parse(body.message);
                if('ALAM_MESSAGE' in result) { //알림 메시지(이관)
                    _this.showToast({msg: result.ALAM_MESSAGE , class: 'info', hasToastIcon: true, icon: 'mdi-information-outline', time: 999999, type: 'right', progress: false, close: true});
                }else{
                    _this.showToast({msg: body.message , class: 'info', hasToastIcon: true, icon: 'mdi-information-outline', time: (Number(body.second) * 1000), type: body.pos, progress: true, close: true});
                    this.$eventBus.$emit("renewalMsgList");
                }
            }else if( body.type === "SYSTEM_REFRESH" ) { //강제 새로고침
                setTimeout(function() {_this.forceRefresh();}, (Number(body.second) * 1000));
            }else if( body.type === "ENV_SETTING" ) { //고객사별 관리자 환경 설정 변경시 호출
                this.$eventBus.$emit("initSettingEnv", body.message); //TopArea.vue store 셋팅 호출
            }
        }
     },
 })
 