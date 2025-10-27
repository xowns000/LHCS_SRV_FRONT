const alertStore = {
  namespaced: true,
  state() {
    return{
      alert:{
        alertDialogToggle: false,
        msg: '',
        iconClass: null,
        type: 'default',
        isloading: false,
        callYes: '',
        callNo: '',
        downloadable: false,
        downReason: '',
        downReasonChk: false,
        phnNoConfirm: false,
        custPhnNo: '',
        custPhnNoChk: false,
        callAfter: undefined,
      }

    }
  },
  getters: {
    GE_ALERT: (state) => state.alert,
  },
  mutations: {
    hideAlert(state) {
      state.alert.alertDialogToggle = false;
    },
    showAlert(state,{ alertDialogToggle, iconClass, msg, type, isloading, callYes, callNo, downloadable, downReason, downReasonChk, reasonAble, reason, reasonAbleChk, phnNoConfirm, custPhnNo, custPhnNoChk, callAfter }){
      state.alert.alertDialogToggle = alertDialogToggle;
      state.alert.iconClass = iconClass;
      state.alert.msg = msg;
      state.alert.type = type;
      state.alert.isloading = isloading;
      state.alert.callYes = callYes;
      state.alert.callNo = callNo;
      state.alert.downloadable = downloadable;
      state.alert.downReason = downReason;
      state.alert.downReasonChk = downReasonChk;
      state.alert.reasonAble = reasonAble;
      state.alert.reason = reason;
      state.alert.reasonAbleChk = reasonAbleChk;
      state.alert.phnNoConfirm = phnNoConfirm;
      state.alert.custPhnNo = custPhnNo;
      state.alert.custPhnNoChk = custPhnNoChk;
      state.alert.callAfter = callAfter;
    },
    btnYisLoading(state) {
      state.alert.isloading = true;
    },
  },
  actions: {

  }
};

export default alertStore;
