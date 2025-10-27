//index.js
import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

import VueSwal from 'vue-swal'
Vue.use(VueSwal);   // 메시자창 lib

import createPersistedState from "vuex-persistedstate";
import authStore from "./modules/authStore";
import commonStore from "./modules/commonStore";
import userStore from "./modules/userStore";
import userConfigStore from "./modules/userConfigStore";
import toastStore from "./modules/toastStore";
import alertStore from "./modules/alertStore";
import messages from "./modules/messages";                            //톡관련 추가_Arthur.Kim
import statusStore from "./modules/statusStore";

Vue.prototype.store  = messages;                                       //톡관련 추가_Arthur.Kim

const store = new Vuex.Store({
  modules: {
    authStore,
    commonStore,
    userStore,
    userConfigStore,
    toastStore,
    alertStore,
    messages,                                                          //톡관련 추가_Arthur.Kim
    statusStore,
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      paths: ["authStore", "commonStore", "userStore", "userConfigStore"
      //, "messages"
      ],    //톡관련 추가_Arthur.Kim 
    }),
  ],
});

export default store;
