import axios from "axios";
const https = require("https");
const http = require("http");
import store from "./index.js";
import apiChatForm from "@/store/apiChatFormUtil";


let getPage = 0;
let getSize = 0;

const apiChatGPT = axios.create({
  baseURL: process.env.VUE_APP_CHATGPT_API_URL,
  timeout: 180000,
  // httpAgent: new http.Agent({ keepAlive: true }),
  // httpsAgent: new https.Agent({ keepAlive: true }),
});

// request(요청)시 아래의 로직이 인터셉트 된다.
apiChatGPT.interceptors.request.use(
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
        console.log("request.data", request.data);
    }
    // header.token 전송
    const token = window.sessionStorage.getItem("token");
    // request.headers.token = token;
    //resuest header에 전달받은 accessToken을 Bearer 형식으로 전송
    request.headers.Authorization = "bearer " + token;

    return request;
  },
  async (error) => {
    return Promise.reject(error);
  }
);
apiChatGPT.interceptors.response.use(
    async (response) => {
        store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
        return response;
    },
    async (error) => {
        console.log( "apiChatGPT.js/axios.interceptors.response.use :: error :: {}" ,error );
        store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
        return Promise.reject(error);
    }
);


export default apiChatGPT;
