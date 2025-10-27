const toastStore = {
  namespaced: true,
  state: {
    toast: {
      act: false,
      msg: "",
      class: "",
      hasToastIcon: false,
      icon: "",
      time: null,
      type: 'bottom',
      progress: false,
      close: false,
      timerId: null,
      callAfter: undefined,
    },
  },
  getters: {
    GE_TOAST: (state) => state.toast,
  },
  mutations: {
    showSnackbar(state, toast) {
      state.toast.act = true;
      state.toast.timerId = null
      state.toast.msg =  toast.msg;
      state.toast.class =  toast.class;
      state.toast.hasToastIcon = toast.hasToastIcon || false;
      state.toast.icon =  toast.icon;
      state.toast.time = toast.time || 3000;
      state.toast.type = toast.type;
      state.toast.progress = toast.progress;
      state.toast.close = toast.close;
      state.toast.callAfter = toast.callAfter;

      // 이전 타이머를 제거하고 새 타이머를 설정
      if (state.toast.timerId) {
        clearTimeout(state.toast.timerId)
      }
      state.toast.timerId = setTimeout(() => {
        state.toast.timerId = null;
        state.toast.act = false;
      }, state.toast.time);

      //호출이후 처리할 함수가 있는경우.
      try{ if(toast.callAfter != undefined) eval(toast.callAfter)(); }catch(e){console.log(e);}

    },
    hideSnackbar(state) {
      if (state.toast.timerId) {
        clearTimeout(state.toast.timerId)
        state.toast.timerId = null
      }
      state.toast.act = false;
      state.toast.time = null;
    },
  },
  actions: {
    showToast({ commit }, toast) {
      commit('showSnackbar', toast);
    },
    hideToast({ commit }, toast) {
      commit('hideSnackbar', toast);
    },
  }
};

export default toastStore;
