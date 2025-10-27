<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  />
      <!-- sub content -->
      <v-tabs class="pl-tabs" v-model="tab">
        <v-tab>설문조사 승인 </v-tab>
        <v-tab>설문조사 발송</v-tab>
      </v-tabs>
      <div style="height: calc(100vh - 246px)">
        <v-tabs-items v-model="tab" class="pl-tabs-items">
          <!-- 설문조사 승인 -->
          <v-tab-item>
            <SVY_M600_CONFIRM
              v-if="isInitDataLoad"
              :COMMON_CODE="common_code"
              :SRVY_YEAR_ITEMS="srvyYrItems"
              :DataProp="{'SRVY_YR': SRVY_YR, 'SRVY_SE_CD': '', 'STTS_CD': '', 'SRVY_NM': '',}"
            />
          </v-tab-item>
          <!-- 설문조사 발송 -->
          <v-tab-item>
            <SVY_M600_SEND
              v-if="isInitDataLoad"
              :COMMON_CODE="common_code"
              :SRVY_YEAR_ITEMS="srvyYrItems"
              :DataProp="{'SRVY_YR': SRVY_YR, 'SRVY_SE_CD': '', 'STTS_CD': '', 'SRVY_NM': '',}"
            />
          </v-tab-item>
        </v-tabs-items>
      </div>
    </div>
  </div>
</template>

<script>
import SVY_M600_CONFIRM from './SVY_M600_CONFIRM';
import SVY_M600_SEND from './SVY_M600_SEND';

  export default {
  name: "MENU_SVY_M0600", //name은 'MENU_' + 파일명 조합
  components: {
    SVY_M600_CONFIRM,
    SVY_M600_SEND
  },
  data() {
    return {
      tab: null,

      //공통코드
      common_code: [],
      //진행년도
      srvyYrItems: [],

      //el v-model 변수
      SRVY_YR: '',
      SRVY_SE_CD: '',
      STTS_CD: '',
      SRVY_NM: '',

      isInitDataLoad: false,
    }
  },
  watch: {

  },

  computed: {

  },

  async created() {
    //공통코드설정
    let codeName = [
                     'SUVY_CL'
                    ,'PROG_ST'
                  ];
    this.common_code = await this.mixin_common_code_get_all(codeName, 'Y');

    //진행년도 설정(금년기준 -5, +5)
    const date = new Date();
    const curYear = date.getFullYear();
    this.srvyYrItems.push({ text: '전체', value: '' });   // default
    for (let i = -5; i < 5; i++) {
      this.srvyYrItems.push({ text: `${curYear + i}년`, value: (curYear + i).toString() });
    }
    this.SRVY_YR =  curYear.toString();

     this.isInitDataLoad = true;

  },

  mounted() {

  },

  methods: {

  },

}
</script>

<style lang="scss" scoped>

</style>