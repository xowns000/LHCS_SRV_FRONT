import api from "@/store/apiUtil";

const statusStore = {
  namespaced: true,
  state: () => ({
    cutt_ing : false, //상담 진행중 여부
    cust_modify_ing : false, //고객 수정 진행중 여부
    cti_stat : false, //CTI 버튼 상태
  }),
  getters: {
    GE_CUTT_ING : (state) => state.cutt_ing,
    GE_CUST_MODIFY_ING : (state) => state.cust_modify_ing,
    GE_CTI_STAT : (state) => state.cti_stat,
  },
  mutations: {
    MU_CUTT_ING: (state, data) => {
      state.cutt_ing = data;
    },
    MU_CUST_MODIFY_ING: (state, data) => {
      state.cust_modify_ing = data;
    },
    MU_CTI_STAT: (state, data) => {
      state.cti_stat = data;
    },
  },
  actions: {
    async AC_CUTT_ING({ commit }, data) {
      await commit("MU_CUTT_ING",data);
    },
    async AC_CUST_MODIFY_ING({ commit }, data) {
      await commit("MU_CUST_MODIFY_ING",data);
    },
    async AC_CTI_STAT({ commit }, data) {
      await commit("MU_CTI_STAT",data);
    },
  },
};

export default statusStore;
