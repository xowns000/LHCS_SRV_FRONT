<template>
  <div class="pl-layout-contents">
    <!-- {{ alive_tabs }}{{ $route.path }} -->
    <keep-alive :include="alive_tabs">
      <router-view :key="$route.path.replace('/', '')" />
    </keep-alive>
    <!-- :exclude="no_cash_tab" -->
  </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      // loader: false,
    };
  },
  methods: {

  },
  mounted() {
    //mixin에 있는 default_tab 기준으로 탭을 초기화 한다
    if( this.$store.getters["commonStore/GE_COMMON_TAB"].length < 2 ) {
      this.$store.dispatch("commonStore/AC_COMMON_INIT_TAB", this.default_tab);
    }
  },
  computed: {
    // ...mapGetters({
    //   tabs: "commonStore/GE_COMMON_TAB",
    //   // active_tab_num: "commonStore/GE_COMMON_ACTIVE_TAB_NUM",
    //   no_cash_tab: "commonStore/GE_COMMON_NO_CASH_TAB",
    //   active_tab_id: "commonStore/GE_COMMON_ACTIVE_TAB_ID",
    //   active_tab_title: "commonStore/GE_COMMON_ACTIVE_TAB_TITLE",
    // }),
    active_tab_num: {
      get() {
        return this.$store.getters["commonStore/GE_COMMON_ACTIVE_TAB_NUM"];
        // let get_active_tab = this.$store.getters["commonStore/GE_COMMON_ACTIVE_TAB"];
        // console.log("%%%%%%%%%%% get_active_tab=",get_active_tab);
        // get_active_tab = get_active_tab.id;
        // return get_active_tab
      },
      set() {},
    },
    alive_tabs: {
      get() {
        let getTabs = this.$store.getters["commonStore/GE_COMMON_TAB"];

        let setTabs = [];
        for (let i = 0; i < getTabs.length; i++) {
          setTabs.push("MENU_" + getTabs[i].id);
        }
        return setTabs;
      },
      set() {},
    },
    //  tab: this.$store.getters["commonStore/GE_COMMON_TAB"],
    //  active_tab_id: this.$store.getters["commonStore/GE_COMMON_ACTIVE_TAB_ID"],
    //  active_tab_title: this.$store.getters["commonStore/GE_COMMON_ACTIVE_TAB_TITLE"]
  },
  watch: {


  }
};
</script>

<style>
.root-ct-wrap {
  display: flex;
  flex-direction: column;
}
</style>
