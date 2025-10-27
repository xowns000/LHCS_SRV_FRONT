import axios from "axios";
import hmacSHA512 from "crypto-js/hmac-sha512";
import Base64 from "crypto-js/enc-base64";
import store from "./index.js";

const apiChatParam = axios.create({
  //baseURL: "http://localhost:8443/",
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 5000,
  // httpAgent: new http.Agent({ keepAlive: true }),
  // httpsAgent: new https.Agent({ keepAlive: true }),
});

// request(요청)시 아래의 로직이 인터셉트 된다.
apiChatParam.interceptors.request.use(
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

    // header.token 전송
    let token = window.sessionStorage.getItem("token");
    let privateKey = process.env.VUE_APP_PRIVATE_KEY;
    let params = request.data;
    params["method"] = request.method; //data에 method 데이터를 추가(백엔드 파라미터 검증에 사용)
    params["action"] = request.url; //data에 action 데이터를 추가(백엔드 파라미터 검증에 사용)

    let signature = Base64.stringify(
      hmacSHA512(JSON.stringify(params), privateKey)
    );

    //console.log("############################################");
    //console.log("### [apiChatParamUtil] request=", request);
    //console.log("### [apiChatParamUtil] token=", token);
    //console.log("### [apiChatParamUtil] privateKey=", privateKey);
    //console.log("### [apiChatParamUtil] params=", params);
    //console.log("### [apiChatParamUtil] signature=", signature);

    request.headers["Authorization"] = "bearer " + token;
    request.headers["x-teletalk-signature"] = signature;
    request.headers["Content-Type"] = "application/json";
    request.headers["Accept"] = "application/json";

    request.data = JSON.stringify(params);

    return request;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

// response(응답)시 아래의 로직이 인터셉트 된다.
apiChatParam.interceptors.response.use(
  async (response) => {
    store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
    response.error = {
      flag: false,
      msg: "",
    };

    if (response.data.code == "-1") {
      response.error = {
        flag: true,
        msg: "서버 연결이 원활하지 않습니다.",
      };
    } else if (response.data.code == "-999") {
      response.error = {
        flag: true,
        msg: "세션이 이미 종료되었습니다.",
      };
    }
    return response;
  },
    async (error) => {
      console.log( "apiChatParamUtil.js/axios.interceptors.response.use :: error :: {}" ,error );
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



export default apiChatParam;
