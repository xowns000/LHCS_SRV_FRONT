import axios from "axios";
import store from "@/store";

import Vue      from 'vue';

export const callUtil = new Vue({
    methods: {
        /** CALL이벤트 
         * 
         * param 1 : api Url 정보
         * param 2 : data Parameter
         * 
        */

        ipcc(sPath, objParam, callbackfunc){
            let result;
            let async = false;
            let sApiUri = store.getters["userStore/GE_USER_COMPANY"].API_URI;
            if(sApiUri){
                const iSemiCnt = sApiUri.match(/:/g).filter(function(item) { return item !== ''; }).length;

                let sInterfaceUrl = '';
                if(iSemiCnt > 1){
                    sInterfaceUrl = sApiUri.split(':')[0] + ':' + sApiUri.split(':')[1] + sPath;
                }else{
                    sInterfaceUrl = sApiUri + sPath;
                }

                let dataParam = objParam;

                dataParam.CUSTCODE = store.getters["userStore/GE_USER_COMPANY"].ASP_CUST_KEY;

                // if(dataParam.REQ === 'home_agent_day_stat'){ //오늘의 상담현황
                //   return JSON.parse('{"IB_CNT":"0","IB_TIME":"00:00:00","OB_CNT":"0","OB_TIME":"00:00:00","IB_BEFORE":"D|100","OB_BEFORE":"D|100"}');
                // }else if(dataParam.REQ === 'home_agent_week_stat'){ //주간 상담 현황
                //   return JSON.parse('{"WEEK_MY_CALL_CNT":3,"WEEK_MY_CALL_TIME":"01:00:13","WEEK_AVG_CALL_CNT":3,"WEEK_AVG_CALL_TIME":"00:02:13","TOTAL_CALL_CNT":"3","TOTAL_CALL_SEC":"133","TOTAL_EXT_CNT":"1"}');
                // }else if(dataParam.REQ === 'home_week_stat'){ //주간 응대 현황
                //   return JSON.parse('{"2023-07-24":{"REQ_CNT":0,"ANSWER_CNT":0},"2023-07-25":{"REQ_CNT":3,"ANSWER_CNT":3},"2023-07-26":{"REQ_CNT":0,"ANSWER_CNT":0},"2023-07-27":{"REQ_CNT":0,"ANSWER_CNT":0},"2023-07-28":{"REQ_CNT":0,"ANSWER_CNT":0}}');
                // }else if(dataParam.REQ === 'home_today'){ //오늘의 응대 현황
                //   return JSON.parse('{"IB_CNT":"0","ANSWER_CNT":"0","ABANDON_CNT":"0","ANSWER_RATE":0,"SL":0}');
                // }else if(dataParam.REQ === 'call_now_stat'){ //My 데스크 - call 관련
                //   return JSON.parse('{"IB_CNT":"0","ANSWER_CNT":"0","WAIT_CNT":"0"}');
                // }else if(dataParam.REQ === 'call_agent_stat'){ //My 데스크 - 상담사 상태
                //   return JSON.parse('{"READY_TIME":"00:00:00","AFTER_TIME":"01:07:04","REST_TIME":"00:00:00","EDU_TIME":"00:00:00","MEAL_TIME":"00:00:00","ETC_TIME":"00:00:00"}');
                // }else if(dataParam.REQ === 'monitor_agent_list'){ //상담사 모니터링
                //   return JSON.parse('{"0":{"1001":{"STAT":"로그아웃","USETIME":"15:58:50","TIMESTART":"2023-07-20 16:36:49"},"1002":{"STAT":"후처리","USETIME":"00:50:01","TIMESTART":"2023-07-26 17:45:38"},"1003":{"STAT":"로그아웃","USETIME":"145:58:51","TIMESTART":"2023-07-20 16:36:48"}},"1":{"IN_CALL_CNT":5,"IN_CONN_CNT":3,"OUT_CALL_CNT":2,"OUT_CONN_CNT":0,"READY_CNT":1,"AFTER_CNT":1,"AWAY_CNT":2,"LOGOUT_CNT":3}}');
                // }else if(dataParam.REQ === 'monitor_ib_total_cnt'){ //인바운드 주간 총 상담건수, 상담직원수
                //   return JSON.parse('{"CALL_CNT":"3","EXT_CNT":"1"}');
                // }else if(dataParam.REQ === 'monitor_call_per_agent'){ //1인당 평균콜
                //   return JSON.parse('{"WEEK_AVG_IB_CALL_CNT":3,"WEEK_AVG_IB_CALL_TIME":"00:02:13"}');
                // }

                if(objParam.async) async = objParam.async;

                $.ajax({
                    url: sInterfaceUrl,
                    data : dataParam,
                    async: async,
                    dataType: "json",
                    type: "GET",
                    contentType: "application/json",
                    crossDomain: true,
                    success: function(data) {
                        // console.log(data);
                        if(async) callbackfunc(data);
                        else result = data;
                        
                        store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
                    },
                    error:function(request,status,error){
                        // console.log("ipcc 에러 : " + error);
                        result = error;
                        store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
                    }
                });
            }else{
                result = null;
            }

            if(!async) return result;
        },

        oldIpcc(sPath, objParam){
            let result;
            let sApiUri = store.getters["userStore/GE_USER_COMPANY"].API_URI;

            if(sApiUri){
                const iSemiCnt = sApiUri.match(/:/g).filter(function(item) { return item !== ''; }).length;

                let sInterfaceUrl = '';
                if(iSemiCnt > 1){
                    sInterfaceUrl = sApiUri.split(':')[0] + ':' + sApiUri.split(':')[1] + sPath;
                }else{
                    sInterfaceUrl = sApiUri + sPath;
                }

                let dataParam = objParam;

                dataParam.cust_key = store.getters["userStore/GE_USER_COMPANY"].ASP_CUST_KEY;

                dataParam.sec1 = '';
                dataParam.sec2 = '';
                dataParam.agtname = '';
                dataParam.ars = '';

                $.ajax({
                    url: sInterfaceUrl,
                    data : dataParam,
                    async: false,
                    dataType: "json",
                    type: "GET",
                    contentType: "application/json",
                    crossDomain: true,
                    success: function(data) {
                        result = data;
                        store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
                    },
                    error:function(request,status,error){
                        result = error;
                        store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
                    }
                });
            }else{
                result = null;
            }

            return result;
        },
    }

})