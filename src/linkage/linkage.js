/* Linkage Configuration Interface */
import api from "../store/apiUtil";
import Vue from "vue";

export const linkage = new Vue({
    data() {
        return {}
    },
    mounted() {
    },
    destroy() {
    },
    computed: {},
    methods: {
        async selectBoxCertCustco(strHeadText) {   //고객사 combobox용도
            var responseData = [];
            if (strHeadText != "" && strHeadText != undefined) {
                responseData.push({text: strHeadText, value: ""});
            }
            await api
                .post("/admin-api/custco/cert-custco-manage/selectBox", {"SRCH_ORDER_BY": "CUSTCO_NM ASC"}, {})
                .then((response) => {
                    if (response.data) {
                        for (let i in response.data.DATA) {
                            let prcsData = {...response.data.DATA[i]}
                            prcsData.text = response.data.DATA[i].CUSTCO_NM + " / " + response.data.DATA[i].SCHEMA_ID;
                            prcsData.value = response.data.DATA[i].CERT_CUSTCO_ID;
                            responseData.push(prcsData);
                        }
                    }
                })
                .catch((error) => {
                });
            return responseData;
        },

        async selectBoxCertCustcoTbl(certCustcoId, strHeadText) {   //고객사 combobox용도
            var responseData = [];
            if (strHeadText != "" && strHeadText != undefined) {
                responseData.push({text: strHeadText, value: ""});
            }
            await api
                .post("/admin-api/lkag/custco/selectTblList", {"CERT_CUSTCO_ID": certCustcoId}, {})
                .then((response) => {
                    if (response.data) {
                        for (let i in response.data.DATA) {
                            let prcsData = {...response.data.DATA[i]}
                            prcsData.text = "TBL_NM:" + response.data.DATA[i].TBL_NM + " / COL_NM:" + response.data.DATA[i].COL_NM;
                            if( response.data.DATA[i].ATTR_ID ) prcsData.text += " / ATTR_ID:" + response.data.DATA[i].ATTR_ID;
                            if( response.data.DATA[i].KEY_COL ) prcsData.text += " / KEY_COL:" + response.data.DATA[i].KEY_COL;

                            prcsData.value = response.data.DATA[i].LNKG_TBL_ID;
                            responseData.push(prcsData);
                        }
                    }
                })
                .catch((error) => {
                });
            return responseData;
        },

        async selectBoxMst(strHeadText) {  //연동데이터소스 combobox용도
            let responseData = [];
            if (strHeadText != "" && strHeadText != undefined) {
                responseData.push({text: strHeadText, value: ""});
            }
            await api
                .post("/admin-api/lkag/mst/selectList", {"SRCH_USE_YN": "Y", "SRCH_ORDER_BY": "MST_NM ASC"}, {})
                .then((response) => {
                    if (response.data) {
                        for (let i in response.data.DATA) {
                            let prcsData = {...response.data.DATA[i]}
                            prcsData.text = response.data.DATA[i].MST_NM;
                            prcsData.value = response.data.DATA[i].LKAG_MST_ID;
                            responseData.push(prcsData);
                        }
                    }
                })
                .catch((error) => {
                });
            return responseData;
        },

        async selectBoxMng(lkagMstId, strHeadText) {  //연동데이터소스 combobox용도
            let responseData = [];
            if (strHeadText != "" && strHeadText != undefined) {
                responseData.push({text: strHeadText, value: ""});
            }
            await api
                .post("/admin-api/lkag/mng/selectList"
                        , {"SRCH_USE_YN": "Y", "SRCH_LKAG_MST_ID": lkagMstId, "SRCH_ORDER_BY": "LKAG_NM ASC"}
                        , {} )
                .then((response) => {
                    if (response.data) {
                        for (let i in response.data.DATA) {
                            let prcsData = {...response.data.DATA[i]}
                            prcsData.text = response.data.DATA[i].LKAG_NM;
                            prcsData.value = response.data.DATA[i].LKAG_ID;
                            responseData.push(prcsData);
                        }
                    }
                })
                .catch((error) => {
                });
            return responseData;
        },

        async selectBoxMngRspns(lkagId, strHeadText) {  //연동데이터소스 - 인터페이스- 응답데이터( )RSPNS) combobox용도
            let responseData = [];
            if (strHeadText != "" && strHeadText != undefined) {
                responseData.push({text: strHeadText, value: ""});
            }
            await api
                .post("/admin-api/lkag/mng/response/selectList"
                    , {"SRCH_USE_YN": "Y", "SRCH_LKAG_ID": lkagId}
                    , {} )
                .then((response) => {
                    if (response.data) {
                        for (let i in response.data.DATA) {
                            responseData.push({
                                text: response.data.DATA[i].ARTCL_FULL_NM,
                                value: response.data.DATA[i].RSPNS_ARTCL_ID
                            });
                        }
                    }
                })
                .catch((error) => {
                });
            return responseData;
        },
        async selectLkagByCertCustco(strHeadText, certCustcoId, aspCustKey) {  //레이아웃관리 - 고객사별 연동정보 조회
            let responseData = [];
            if (strHeadText != "" && strHeadText != undefined) {
                responseData.push({text: strHeadText, value: ""});
            }
            await api
                .post("/admin-api/layoutMng/bscInfo/selectLkagByCertCustco"
                    , {"SRCH_CERT_CUSTCO_ID": certCustcoId, "SRCH_ASP_CUST_KEY":aspCustKey }
                    , {} )
                .then((response) => {
                    if (response.data) {
                        for (let i in response.data.DATA) {
                            let prcsData = {...response.data.DATA[i]}
                            prcsData.text = response.data.DATA[i].LKAG_NM;
                            prcsData.value = response.data.DATA[i].LKAG_ID;
                            responseData.push(prcsData);
                        }
                    }
                })
                .catch((error) => {
                });
            return responseData;
        },
        //연동 공통코드
        async lkag_common_code_get_all(lkag_mst_id, group_cd) {
            let responseData = [];
            await api
                .post("/api/lkag-code/common/code-book/inqry"
                    , {
                        LKAG_MST_ID: lkag_mst_id,
                        LKAG_GROUP_CD_ID: group_cd
                    },{} )
                .then((response) => {
                    if (response.data) {
                        for (var i = 0; i < group_cd.length; i++) {
                            if (response.data[group_cd[i]]) {
                                var key = group_cd[i];
                                var jasonData = {};
                                jasonData["group_cd"] = key;
                                jasonData["group_value"] = response.data[key];
                                responseData.push(jasonData);
                                // }
                            }
                        }
                    }
                })
                .catch((error) => {});
            // console.log("#### [mixins][common_code] responseData=", responseData);
            return responseData;
        },
        lkag_common_code_get(all_code, group_cd, strHeadText) {

            var responseData = [];
            if (strHeadText != "" && strHeadText != undefined) {
                responseData.push({ text: strHeadText, value: "", cdValue : ""});
            }

            if (all_code && typeof all_code === "object") {
                for (var i = 0; i < all_code.length; i++) {
                    if (all_code[i].group_cd === group_cd) {
                        for (var a = 0; a < all_code[i].group_value.length; a++) {
                            responseData.push({
                                text: all_code[i].group_value[a].LKAG_CD_NM,
                                value: all_code[i].group_value[a].LKAG_CD_ID,
                                cdValue:all_code[i].group_value[a].LKAG_CD_VL
                            });
                        }
                    }
                }
            }
            return responseData;
        },
    }
});