import axios from "axios";
const https = require("https");
const http = require("http");
import store from "./index.js";

let api_data_size = 1000;

let getPage = 0;
let getSize = 0;

const api = axios.create({
  baseURL: process.env.VUE_APP_SMS_URL,
  timeout: 10000,
  // httpAgent: new http.Agent({ keepAlive: true }),
  // httpsAgent: new https.Agent({ keepAlive: true }),
});

// request(요청)시 아래의 로직이 인터셉트 된다.
api.interceptors.request.use(
  async (request) => {
    //멀티테넌시(multitenancy) 처리 : axios 요청 전 인터셉터에서 CERT-CUSTCO-TENANT-ID(테넌트 코드) 설정 by hjh
    request.headers['CERT-CUSTCO-TENANT-ID'] = store.getters["authStore/GE_CUSTCO_TENANT_ID"];
    request.headers['CERT-CUSTCO-ID'] = store.getters['userStore/GE_USER_ROLE'].company.CD;

    if( request.head ) {
      request.head['MENU_ID'] = JSON.parse(sessionStorage.getItem("vuex")).commonStore.active_tab.id;
      if( JSON.parse(sessionStorage.getItem("vuex")).commonStore.page_path.PATH ) {
        request.head['MENU_PATH'] = JSON.parse(sessionStorage.getItem("vuex")).commonStore.page_path.PATH;
      }else {
        request.head['MENU_PATH'] = JSON.parse(sessionStorage.getItem("vuex")).commonStore.active_tab.title;
      }
    }

    if(request.head && request.head["PRINT_CONSOLE"] == 'Y'){
        // console.log("request.data", request.data);
    }
    // header.token 전송
    const token = window.sessionStorage.getItem("token");
    // request.headers.token = token;
    //resuest header에 전달받은 accessToken을 Bearer 형식으로 전송
    request.headers.Authorization = "bearer " + token;

    //엑셀 다운로드시(1000건보다 많을 시)
    if (request.head && request.head["DOWN"] != '') {
      api_data_size = request.head.DOWN;
    }
    
    //한번에 조회되는 데이터의 maxium은 1000로 한정한다
    if (request.head && request.head["ROW_CNT"]) {
      if (request.head.ROW_CNT > api_data_size) {
        request.head.ROW_CNT = api_data_size;
      }
    }

    //maxium보다 많은 데이터 조회
    if (request.head && request.head["PAGING"] == 'Y') {
      if(request.head.PAGES_CNT){
        getPage = request.head.PAGES_CNT
      }
      if(request.head.ROW_CNT){
        getSize = request.head.ROW_CNT
      }
    }

    let form = new FormData();
    var strKeyList = "";
    var strValueList = "";
    var jsonData = request.data;
    
    if (
      request.url.match("auth-api/password-encpt/process") == null &&
      request.url.match("auth-api") == null &&
      request.url.match("auth-api/logout") == null
    ) {
      //USER_ID값이 없으면 강제로 넣는다
      // if (!jsonData["ASP_USER_ID"]) {
      //   jsonData.ASP_USER_ID = store.getters["userStore/GE_USER_ID"];
      // }
      // ASP_CUST_KEY값이 없으면 강제로 넣는다
      // if (!jsonData["ASP_CUST_KEY"]) {
      //   //ASP_NEWCUST_KEY 가 있으면 ASP_CUST_KEY 값에 넣어준다
      //   if (jsonData["ASP_NEWCUST_KEY"]) {
      //     jsonData.ASP_CUST_KEY = jsonData.ASP_NEWCUST_KEY;
      //   } else {
      //     //ASP_NEWCUST_KEY 가 없으면 사용자가 가지도 있는 첫번째 회사코드를 넣어준다
      //     if (
      //       store.getters["userStore/GE_USER_COMPANY"] &&
      //       store.getters["userStore/GE_USER_COMPANY"].length > 0
      //     ) {
      //       jsonData.ASP_CUST_KEY =
      //         store.getters["userStore/GE_USER_COMPANY"][0].CD;
      //     } else {
      //       //없으면 빈값
      //       jsonData.ASP_CUST_KEY = "";
      //     }
      //   }
      // }
    }
    
    //Arthur.Kim 2022.04.29 로그인
    //if(request.url == "auth-api"){
    //  console.log("jsonData", jsonData);
    //  form.append("username", jsonData.username);
    //  form.append("password", jsonData.password);
    //}

    //Arthur.Kim 2022.04.29 로그아웃 
    //if(request.url == "auth-api/logout"){
    //  console.log("jsonData", jsonData);
    //  form.append("ACCESS_TOKEN", jsonData.ACCESS_TOKEN);
    //}

    for (var strKey in jsonData) {
      //데이터가 오브젝트이면서 파일업로드가 아닌 경우
      if (typeof jsonData[strKey] === "object" && strKey !== "userfiles") {
        for (var indexKey in jsonData[strKey]) {
          if (typeof jsonData[strKey][indexKey] === "object") {
            for (var strKey2 in jsonData[strKey][indexKey]) {
              if (
                request.head != null &&
                request.head["DATA_OBJECT"] != null &&
                request.head["DATA_OBJECT"] != "" &&
                request.head["DATA_OBJECT"].indexOf(strKey) > -1
              ) {
                form.append(
                  strKey + "[" + indexKey + "][" + strKey2 + "]",
                  jsonData[strKey][indexKey][strKey2]
                );
              } else {
                if (indexKey == 0) {
                  strKeyList += strKey2 + "||";
                  strValueList += jsonData[strKey][indexKey][strKey2] + "||";
                }
                form.append(
                  "DATA[" + indexKey + "][" + strKey2 + "]",
                  jsonData[strKey][indexKey][strKey2]
                );
              }
            }
          } else {
            if (
              request.head != null &&
              request.head["DATA_OBJECT"] != null &&
              request.head["DATA_OBJECT"] != "" &&
              request.head["DATA_OBJECT"].indexOf(strKey) > -1
            ) {
              form.append(
                strKey + "[" + indexKey + "]",
                jsonData[strKey][indexKey]
              );
            } else {
              if (indexKey == 0) {
                strKeyList += strKey + "||";
                strValueList += jsonData[strKey][indexKey] + "||";
              }
              form.append(
                "DATA[" + indexKey + "][" + strKey + "]",
                jsonData[strKey][indexKey]
              );
            }
          }
        }
      } else {
        if (jsonData.hasOwnProperty(strKey)) {
          strKeyList += strKey + "||";
          if (typeof jsonData[strKey] === "undefined") {
            strValueList += "" + "||";
            form.append("DATA[0][" + strKey + "]", "");
          } else {
            if (jsonData[strKey] == null) {
              strValueList += "" + "||";
              form.append("DATA[0][" + strKey + "]", "");
            } else {
              strValueList += jsonData[strKey] + "||";
              form.append("DATA[0][" + strKey + "]", jsonData[strKey]);
            }
          }
        }
      }
    }

    form.append("HEADER[URL]", request.url);

    for (var header in request.head) {
      form.append("HEADER[" + header + "]", request.head[header]);
    }

    request.data = form;
    return request;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

// response(응답)시 아래의 로직이 인터셉트 된다.
api.interceptors.response.use(
  async (response) => {
    store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
    // header.token 자동 갱신
    if (response.data.HEADER.ACCESS_TOKEN) {
      const token = response.data.HEADER.ACCESS_TOKEN; // token을 header에서 받은 경우
      if (token) {
        window.sessionStorage.setItem("token", token);
      }
    }

    response.data.HEADER['next'] = false;

    if(getPage !== 0 && getSize !== 0){
      if(getPage * getSize < response.data.HEADER.TOT_COUNT){
        response.data.HEADER['next'] = true;
      }
    }

    //console.log('##### response=',response)
    //console.log('##### [response] getPage=',getPage)
    //console.log('##### [response] getSize=',getSize)

    //Arthur.Kim 2022.04.29 세션ID
    if (typeof response.data.HEADER.JSESSIONID != 'undefined' ) {
      const jsessionid = response.data.HEADER.JSESSIONID; // token을 header에서 받은 경우
    
      if (jsessionid) {
        window.sessionStorage.setItem("jsessionid", jsessionid);
      }
    }


    response.error = {
      flag: false,
      msg: "",
    };
    if (response.data.HEADER.ERROR_FLAG) {
      if (response.data.HEADER.ERROR_FLAG === true) {
        response.error = {
          flag: true,
          msg: response.data.HEADER.ERROR_MSG,
        };
      }
    }

    return response;
  },
  async (error) => {
    console.log( "apiSmsAlrim.js/axios.interceptors.response.use :: error :: {}" ,error );
    store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
    if( (error.toString()).indexOf("status code 403") > -1) {
      window.sessionStorage.clear();
      location.href="/login";
    }else {
      try{
        if( error.response.status == 401) {
          window.sessionStorage.clear();
          location.href="/login";
        }
      }catch(e){}
    }
    return Promise.reject(error);
  }
);

//암호화 로직
const Hash = {
  encryptMD5: function (strOrgData) {
    return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(strOrgData)));
  },
  rstr_md5: function (strOrgData) {
    return this.binl2rstr(
      this.binl_md5(this.rstr2binl(strOrgData), strOrgData.length * 8)
    );
  },

  binl_md5: function (x, len) {
    x[len >> 5] |= 0x80 << len % 32;
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;

    for (var i = 0; i < x.length; i += 16) {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;

      a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
      d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
      b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

      a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
      a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

      a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
      d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
      c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

      a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
      d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

      a = this.safe_add(a, olda);
      b = this.safe_add(b, oldb);
      c = this.safe_add(c, oldc);
      d = this.safe_add(d, oldd);
    }

    return Array(a, b, c, d);
  },
  md5_ff: function (a, b, c, d, x, s, t) {
    return this.md5_cmn((b & c) | (~b & d), a, b, x, s, t);
  },
  md5_gg: function (a, b, c, d, x, s, t) {
    return this.md5_cmn((b & d) | (c & ~d), a, b, x, s, t);
  },
  md5_hh: function (a, b, c, d, x, s, t) {
    return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
  },
  md5_ii: function (a, b, c, d, x, s, t) {
    return this.md5_cmn(c ^ (b | ~d), a, b, x, s, t);
  },
  md5_cmn: function (q, a, b, x, s, t) {
    return this.safe_add(
      this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s),
      b
    );
  },
  str2rstr_utf8: function (input) {
    var output = "";
    var i = -1;
    var x, y;

    while (++i < input.length) {
      x = input.charCodeAt(i);
      y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
      if (0xd800 <= x && x <= 0xdbff && 0xdc00 <= y && y <= 0xdfff) {
        x = 0x10000 + ((x & 0x03ff) << 10) + (y & 0x03ff);
        i++;
      }

      if (x <= 0x7f) output += String.fromCharCode(x);
      else if (x <= 0x7ff)
        output += String.fromCharCode(
          0xc0 | ((x >>> 6) & 0x1f),
          0x80 | (x & 0x3f)
        );
      else if (x <= 0xffff)
        output += String.fromCharCode(
          0xe0 | ((x >>> 12) & 0x0f),
          0x80 | ((x >>> 6) & 0x3f),
          0x80 | (x & 0x3f)
        );
      else if (x <= 0x1fffff)
        output += String.fromCharCode(
          0xf0 | ((x >>> 18) & 0x07),
          0x80 | ((x >>> 12) & 0x3f),
          0x80 | ((x >>> 6) & 0x3f),
          0x80 | (x & 0x3f)
        );
    }

    return output;
  },
  rstr2binl: function (input) {
    var output = Array(input.length >> 2);
    for (var i = 0; i < output.length; i++) output[i] = 0;
    for (i = 0; i < input.length * 8; i += 8)
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
    return output;
  },
  binl2rstr: function (input) {
    var output = "";
    for (var i = 0; i < input.length * 32; i += 8)
      output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff);
    return output;
  },
  rstr2hex: function (input) {
    var hex_tab = x !== 0 ? "0123456789abcdef" : "0123456789ABCDEF";
    var output = "";
    var x;
    for (var i = 0; i < input.length; i++) {
      x = input.charCodeAt(i);
      output += hex_tab.charAt((x >>> 4) & 0x0f) + hex_tab.charAt(x & 0x0f);
    }
    return output;
  },
  safe_add: function (x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  },
  bit_rol: function (num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  },
};

export default api;
