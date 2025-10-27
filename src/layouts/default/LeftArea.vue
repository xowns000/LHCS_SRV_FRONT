<template>
  <v-navigation-drawer
    absolute
    permanent
    width="60px"
    class="pl-layout-left"
  >
    <v-list height="100%" class="">
      <v-list-item-group class="">
        <v-list-item
          v-for="item in user_menu_left"
          :key="item.NODE_TITLE"
          :to="item.PATH_NM"
          link
          class=""
          :class="[item.setting]"
          :ripple="false"
          @click="mixin_set_active_tab(item)"
        >
          <v-tooltip right content-class="pl-tooltip right">
            <template v-slot:activator="{ on, attrs}">
              <span
                v-bind="attrs"
                v-on="on"
                class="pl-icon-leftmenu"
                :class="[item.ICON_CLASS_NM, { 'active': $route.path === item.PATH_NM }]">
              </span>
            </template>
              <span>{{ item.NODE_TITLE }}</span>
          </v-tooltip>
        </v-list-item>
        <!-- setting -->
        <v-list-item 
          v-if="SELECTED_COMPANY.SRVC_GDS_ID == null || SELECTED_COMPANY.SRVC_GDS_ID == undefined || SELECTED_COMPANY.SRVC_GDS_ID != 99"
          @click="dialogSetting = !dialogSetting" 
          class="mt-auto is-setting">
          <v-tooltip right content-class="pl-tooltip right">
            <template v-slot:activator="{ on, attrs}">
              <span
                v-bind="attrs"
                v-on="on"
                class="pl-icon-leftmenu"
                :class="`pl-icon-leftmenu setting ${dialogSetting ? 'active' : ''}`">
              </span>
            </template>
            <span>설정</span>
          </v-tooltip>
        </v-list-item>
      </v-list-item-group>
    </v-list>

  </v-navigation-drawer>
</template>

<script>

export default {
  components: {
  },
  computed: {
    dialogSetting: {
      get(){
        return this.$store.getters['commonStore/GE_COMMON_SETTING_SLIDE'];
      },
      set(data){
        this.$store.dispatch('commonStore/AC_COMMON_SETTING_SLIDE', data);
      },
    },
  },
  data() {
    return {
      items: [
        // {
        //   C_NODE_NO: "home",
        //   NODE_TITLE: "홈",
        //   class: "home"
        // },
        // {
        //   C_NODE_NO: "M010101",
        //   NODE_TITLE: "전화상담",
        //   class: "tel",
        // },
        // {
        //   C_NODE_NO: "home2",
        //   NODE_TITLE: "SNS상담",
        //   class: "sns",
        // },
        // {
        //   C_NODE_NO: "home3",
        //   NODE_TITLE: "아웃바운드",
        //   class: "outbound",
        // },
        // {
        //   C_NODE_NO: "home4",
        //   NODE_TITLE: "알림톡",
        //   class: "sms",
        // },
        // {
        //   C_NODE_NO: "home5",
        //   NODE_TITLE: "콜 이력",
        //   class: "call-history",
        // },
        // {
        //   C_NODE_NO: "home6",
        //   NODE_TITLE: "MY 데스크",
        //   class: "mydesk",
        // },
        // {
        //   C_NODE_NO: "home7",
        //   NODE_TITLE: "모니터링",
        //   class: "monitoring",
        // },
        // {
        //   C_NODE_NO: "CLD_M0000",
        //   NODE_TITLE: "캘린더",
        //   class: "calendar",
        // },
        // {
        //   C_NODE_NO: "home9",
        //   NODE_TITLE: "설정",
        //   class: "setting",
        //   setting: 'is-setting'
        // },

      ],
      right: null,
      // slide setting
      SELECTED_COMPANY: '',

    };
  },
  async created() {
    const companyInfo = this.$store.getters["userStore/GE_USER_ROLE"].company_list;
    if(companyInfo.length > 0){
      this.SELECTED_COMPANY = companyInfo[0];
    }
  },
  methods: {
  },
};
</script>

<style></style>
