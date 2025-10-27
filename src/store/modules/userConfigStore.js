import api from "@/store/apiUtil";

const userConfigStore = {
  namespaced: true,
  state: () => ({
    setting_phn_cutt_form : { //전화 상담 폼 셋팅
      save_aftr_cust_maintain_yn : false  //저장 후 고객 정보 유지 여부
    }
  }),
  getters: {
    GE_SAVE_AFTR_CUST_MAINTAIN : (state) => state.setting_phn_cutt_form.save_aftr_cust_maintain_yn,
  },
  mutations: {
    MU_SAVE_AFTR_CUST_MAINTAIN: (state, data) => {
      state.setting_phn_cutt_form.save_aftr_cust_maintain_yn = data;
    },
  },
  actions: {
    async AC_SAVE_AFTR_CUST_MAINTAIN({ commit }, data) {
      await commit("MU_SAVE_AFTR_CUST_MAINTAIN",data);
    },
  },
};

export default userConfigStore;
