<template>
  <div style="display: contents;">
    <!-- 고객센터 Home(기본) -->
    <home-default
      v-if="SELECTED_COMPANY.SRVC_GDS_ID == null || SELECTED_COMPANY.SRVC_GDS_ID == undefined || SELECTED_COMPANY.SRVC_GDS_ID != 99"
    />
    <!--설문조사 Home-->
    <home-survey
      v-if="SELECTED_COMPANY.SRVC_GDS_ID == 99"
    />
  </div>
</template>

<script>
import HomeDefault from '@/views/page/mainHome/HOME_DEFAULT.vue';
import HomeSurvey from '@/views/page/mainHome/HOME_SURVEY.vue';
export default {
  name: "MENU_home", //name은 'MENU_' + 파일명 조합
  components: {
    HomeDefault,
    HomeSurvey,
  },
  data() {
    return {
      SELECTED_COMPANY: {},
    }
  },

  watch: {
    //TopArea에서 고객사 변경 시 감시를 위함.
    WATCH_COMPANY() {
      console.log("SELECTED_COMPANY Changed!");
      this.SELECTED_COMPANY = this.$store.getters["userStore/GE_USER_COMPANY"];
    },

  },

  computed: {
    WATCH_COMPANY () {
      return this.$store.getters["userStore/GE_USER_COMPANY"]
    }
  },

  created() {
    this.SELECTED_COMPANY = this.$store.getters["userStore/GE_USER_COMPANY"];
  },

  mounted() {

  },

  methods: {

  },
}
</script>

<style></style>
