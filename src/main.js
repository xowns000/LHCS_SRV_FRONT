import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
import vuetify from "@/plugins/vuetify";
import store from "@/store";
import CKEditor from "ckeditor4-vue";
import CompoDatePicker from '@/components/CompoDatePicker.vue';
import CompoDropPicker from '@/components/CompoDropPicker.vue';
import CompoDateRangePicker from '@/components/CompoDateRangePicker.vue';
import CompoTooltipBtn from '@/components/CompoTooltipBtn.vue';
import CompoToast from "@/components/CompoToast";
import CompoAlert from "@/components/CompoAlert";
import CompoProgress from '@/components/CompoProgress.vue';
import CompoExcel from "@/components/CompoExcel.vue";
import CompoDialog from "@/components/CompoDialog.vue";
import CompoTree from '@/components/CompoTree'
import CompoTreeCuttType from '@/components/CompoTreeCuttType'
import CompoNotiDetail from '@/components/CompoNotiDetail'
import CompoFileGrid from '@/components/CompoFileGrid'
import CompoFindCus from '@/components/CompoFindCus'
import CompoFindRsvtCusl from '@/components/CompoFindRsvtCusl'
import CompoSendInfo from '@/components/CompoSendInfo'
import CompoFindParts from '@/components/CompoFindParts'
import CompoFindIndex from '@/components/CompoFindIndex'
import CompoFindPost from '@/components/CompoFindPost'
import CompoChatting from '@/components/CompoChatting'
import CompoChatLog from '@/components/CompoChatLog'
import CompoVoc from '@/components/CompoVoc'
import CompoOmniOne from '@/components/CompoOmniOne'
import CompoSubLayoutTop from '@/components/CompoSubLayoutTop'
import CompoTransfer from '@/components/CompoTransfer'
import CompoCustExport from '@/components/CompoCustExport'
import CompoInCall from '@/components/CompoInCall'
import CompoOutCall from '@/components/CompoOutCall'
import CompoBlackManage from '@/components/CompoBlackManage'
import CompoSendEmail from '@/components/CompoSendEmail'
import CompoChartLoader from '@/components/CompoChartLoader'
import CompoFindCallHist from '@/components/CompoFindCallHist'
import RightArea from "@/layouts/default/RightArea.vue";
import CompoAudio from "@/components/CompoAudio.vue";
import CompoViewEmail from '@/components/CompoViewEmail'
import CompoChatLogEmail from '@/components/CompoChatLogEmail'
import CompoChatLogBbs from '@/components/CompoChatLogBbs'

// import right_sms from '@/views/page/right_sms.vue';
// import VuetifyDraggableTreeview from 'vuetify-draggable-treeview'
import draggable from "vuedraggable";
import VueLottiePlayer from "vue-lottie-player";
// import 'tui-grid/dist/tui-grid.css'
import { Grid } from '@toast-ui/vue-grid'

import { mixin } from "@/mixin/mixin.js";
import { linkage } from "@/linkage/linkage.js";
import api from "@/store/apiUtil.js";
import apiSmsAlrim from "@/store/apiSmsAlrim.js";
import apiChat from "@/store/apiChatParamUtil.js";
import apiChatParam from "@/store/apiChatParamUtil.js";
import apiChatForm from "@/store/apiChatFormUtil.js";
import apiChatGPT from "@/store/apiChatGPTUtil.js";
import { eventBus } from "@/store/eventBus.js"; //Event Bus
import _ from'lodash';
import moment from "moment";
import axios from "axios";

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

import vueDropzone from 'vue2-dropzone'
import VueDompurifyHtml from 'vue-dompurify-html';


axios.interceptors.request.use(function (request) {
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
  const token = window.sessionStorage.getItem("token");
  // request.headers.token = token;
  //resuest header에 전달받은 accessToken을 Bearer 형식으로 전송
  request.headers.Authorization = "bearer " + token;

  return request;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
})

axios.interceptors.response.use(
    async (response) => {

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
      console.log( "main.js/axios.interceptors.response.use :: error :: {}" ,error );
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

const globalProperties = [
  { name: '$api', value: api },
  { name: '$apiSmsAlrim', value: apiSmsAlrim },
  { name: '$apiChat', value: apiChat },
  { name: '$apiChatForm', value: apiChatForm },
  { name: '$apiChatParam', value: apiChatParam },
  { name: '$apiChatGPT', value: apiChatGPT },
  { name: '$eventBus', value: eventBus },
  { name: '$_', value: _ },
  { name: '$moment', value: moment },
  { name: '$linkage', value: linkage },
];
globalProperties.forEach(({name, value}) => Vue.prototype[name] = value);

Vue.config.productionTip = false;

// 공통 컴포넌트 호출
const uiComponents = [
  { name: 'CompoDatePicker', component: CompoDatePicker },
  { name: 'CompoDropPicker', component: CompoDropPicker },
  { name: 'CompoDateRangePicker', component: CompoDateRangePicker },
  { name: 'CompoTooltipBtn', component: CompoTooltipBtn },
  { name: 'CompoToast', component: CompoToast },
  { name: 'CompoAlert', component: CompoAlert },
  { name: 'CompoProgress', component: CompoProgress },
  { name: 'CompoExcel', component: CompoExcel },
  { name: 'CompoDialog', component: CompoDialog },
  { name: 'CompoTree', component: CompoTree },
  { name: 'CompoTreeCuttType', component: CompoTreeCuttType },
  { name: 'CompoNotiDetail', component: CompoNotiDetail },
  { name: 'CompoFileGrid', component: CompoFileGrid },
  { name: 'CompoFindCus', component: CompoFindCus },
  { name: 'CompoFindRsvtCusl', component: CompoFindRsvtCusl },
  { name: 'CompoSendInfo', component: CompoSendInfo },
  { name: 'CompoFindParts', component: CompoFindParts },
  { name: 'CompoFindIndex', component: CompoFindIndex },
  { name: 'CompoFindPost', component: CompoFindPost },
  { name: 'CompoChatting', component: CompoChatting },
  { name: 'CompoChatLog', component: CompoChatLog },
  { name: 'CompoVoc', component: CompoVoc },
  { name: 'CompoOmniOne', component: CompoOmniOne },
  { name: 'CompoSubLayoutTop', component: CompoSubLayoutTop },
  { name: 'CompoTransfer', component: CompoTransfer },
  { name: 'CompoCustExport', component: CompoCustExport },
  { name: 'CompoInCall', component: CompoInCall },
  { name: 'CompoOutCall', component: CompoOutCall },
  { name: 'CompoBlackManage', component: CompoBlackManage },
  { name: 'CompoSendEmail', component: CompoSendEmail },
  { name: 'CompoChartLoader', component: CompoChartLoader },
  { name: 'CompoFindCallHist', component: CompoFindCallHist },
  // { name: 'right_sms', component: right_sms },
  { name: 'RightArea', component: RightArea },
  { name: 'draggable', component: draggable },
  { name: 'vLottiePlayer', component: VueLottiePlayer },
  { name: 'VueSlider', component: VueSlider },
  { name: 'vueDropzone', component: vueDropzone },
  { name: 'grid', component: Grid },
  { name: 'CompoAudio', component: CompoAudio },
  // { name: 'VuetifyDraggableTreeview', component: VuetifyDraggableTreeview },
  { name: 'CompoViewEmail', component: CompoViewEmail },
  { name: 'CompoChatLogEmail', component: CompoChatLogEmail },
  { name: 'CompoChatLogBbs', component: CompoChatLogBbs },
];
uiComponents.forEach(({name, component}) => Vue.component(name, component));

Vue.mixin(mixin);

Vue.use(CKEditor);
Vue.use(VueLottiePlayer);
Vue.use(VueDompurifyHtml, {
  hooks: {
    afterSanitizeAttributes: (node) => {
      // set all elements owning target to target=_blank
      if ('target' in node) {
        node.setAttribute('target', '_blank')
        node.setAttribute('rel', 'noopener')
      }
    }   
  }
});

// textfield byte-counter
//mts문자발송 byte 체크와는 맞지 않음 - mts문자발송 시 해당 byte 체크 사용하지 않음
Vue.directive('byte-counter', {
  bind(el, binding) {
    el.addEventListener('input', (event) => {
      // v-model을 통해 입력 필드의 값을 가져옵니다.
      const inputValue = event.target.value;
      const maxBytes = parseInt(binding.value, 10);
      const lastInputValue = inputValue.charAt(inputValue.length - 1);

      const utf8Bytes = new TextEncoder().encode(inputValue);
      const lastUtf8Bytes = new TextEncoder().encode(lastInputValue);

      if (utf8Bytes.byteLength > maxBytes) {
        const splitLen = (utf8Bytes.byteLength - maxBytes) < lastUtf8Bytes.byteLength ? utf8Bytes.byteLength - lastUtf8Bytes.byteLength : maxBytes;
        const truncatedValue = new TextDecoder().decode(utf8Bytes.slice(0, splitLen ));
        event.target.value = truncatedValue;

        // 입력 값이 변경되었음을 알리기 위해 커스텀 이벤트를 발생시킵니다.
        const inputEvent = new Event('input', { bubbles: true });
        event.target.dispatchEvent(inputEvent);

        // 초과시 스타일 속성 추가
        // el.dataset.error = 'true';
      } else {
        // el.dataset.error = 'false';
      }
    });
  },
});


import VueCookies from "vue-cookies";
Vue.use(VueCookies);
Vue.$cookies.config("10d"); //쿠키의 만료일은 7일이다. (글로벌 세팅)

new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App),
}).$mount("#app");
