<template>
  <div class="pl-layout-tabs-area">
    <v-tabs
      background-color="transparent"
      slider-size="0"
      show-arrows
      next-icon="tabs-next"
      prev-icon="tabs-prev"
      class="pl-layout-tabs"
      v-model="active_tab_num"
    >
      <v-tab
        v-for="(tab, index) in tabs"
        :key="tab.id"
        class="mr-2"
        :class="tab.id == 'home' ? 'is-home' : ''"
        @click="moveTab(tab)"
      >
        {{ tab.title }}
        <v-btn
          icon
          @click.prevent.stop="removeTab(tab, index)"
          style="margin-left: 5px; margin-top: 1px;"
          v-show="tab.default !== 'Y'"
          class="pl-icon tab-close"
        >
        </v-btn>
      </v-tab>

    </v-tabs>
    <div class="is-right">
      <!-- more btn -->
      <v-menu
        v-if="tabs.length"
        min-width="190"
        bottom
        left
        content-class="pl-layout-tabs-more"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="pl-layout-tabs-more-btn mr-4"
            plain
            v-bind="attrs"
            v-on="on"
          >
            <span class="pl-layout-tabs-more-cnt">{{ tabs.length }}</span>
          </v-btn>
        </template>
        <ul class="pl-drop-layer-list">
          <li
            v-for="(item, index) in tabs"
            :key="index"
            :class="$route.fullPath === item.link ? 'active' : ''"
            @click="moveTab(item)">
            {{ item.title }}
          </li>
        </ul>
      </v-menu>
      <!-- 모든 탭 닫기 -->
      <compo-tooltip-btn
        TitleProp="모든 탭 닫기"
        ClassProp="pl-tooltip-btn"
        IconProp="pl-icon20 tabs-allclose"
        TooltipPositionProp="bottom"
        @btnClick="allRemoveTab"
      ></compo-tooltip-btn>
      <!-- <v-btn
        @click="allRemoveTab"
        class="tab-allclose"
        :class="{ active: allCloseTog }"
      >
        <span class="pl-icon tabs-allclose"></span>
      </v-btn> -->
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      allCloseTog: false,

      TAB : {},
      INDEX : '',
    };
  },
  mounted() {
    //mixin에 있는 default_tab 기준으로 탭을 초기화 한다
    //.this.$store.dispatch("commonStore/AC_COMMON_INIT_TAB", this.default_tab);

    //컴포넌트 활성화시 home 메뉴로 이동한다
    //새로고침시에도 home으로 이동한다
    //새로고침 라우터
    // if (this.$route.fullPath !== "/home") {
    //   this.$router.push("/home");
    // }
  },
  computed: {
    active_tab_num: {
      get() {
        return this.$store.getters["commonStore/GE_COMMON_ACTIVE_TAB_NUM"];
      },
      set() {},
    },
    active_tab_id: {
      get() {
        return this.$store.getters["commonStore/GE_COMMON_ACTIVE_TAB_ID"];
      },
      set() {},
    },
  },
  watch: {
    //활성화탭 이름이 변경되면 router를 변경한다
    active_tab_title() {
      //변경된 탭이 활성화되어 있는 탭과 다르다면 router를 변경한다
      if (this.tabs[this.active_tab_num].link !== this.$route.path) {
        var linkto = this.tabs[this.active_tab_num].link.replace("/", "");
        this.$router.push(linkto);
      }
    },
  },
  methods: {
    //탭 변경시 이벤트
    moveTab(tab) {
      this.$store.dispatch("commonStore/AC_COMMON_ACTIVE_TAB", {
        id: tab.id,
        title: tab.title,
      });

      let pageInfo = {TITLE:tab.title,EXPLN:tab.MENU_EXPLN,PATH:tab.FULL_PATH};
      this.$store.commit("commonStore/MU_COMMON_PAGE_PATH", pageInfo);
    },
    changeState(type) {
      this.$store.commit("userStore/MU_USER_STATE", { ustate: type });
    },
    //탭 삭제시 이벤트
    removeTab(tab, index) {
      if(tab.id === 'CSL_M0100' && this.$store.getters["statusStore/GE_CUTT_ING"]){
        this.TAB = tab;
        this.INDEX = index;
        this.showAlert({ alertDialogToggle : true, msg : '상담을 진행중입니다. 그래도 전화상담탭을 닫으시겠습니까?', iconClass:'is-caution', type :'confirm', callYes: this.forcRemoveTab, callNo:this.closeMsg});
      }else {
        this.tabs.splice(index, 1);
        this.$store.dispatch("commonStore/AC_COMMON_DEACTIVE_TAB", {
          id: tab.id,
          title: tab.title,
        });
        let newTab = index === this.tabs.length ? this.tabs[index-1] : this.tabs[this.tabs.length-1];
        let pageInfo = {TITLE:newTab.title,EXPLN:newTab.MENU_EXPLN,PATH:newTab.FULL_PATH};
        this.$store.commit("commonStore/MU_COMMON_PAGE_PATH", pageInfo);
      }
    },
    //전체 탭 삭제시 이벤트
    allRemoveTab() {
      this.allCloseTog = !this.allCloseTog;
      //mixin에 있는 default_tab 기준으로 탭을 초기화 한다
      this.$store.dispatch("commonStore/AC_COMMON_DELETE_ALL_TAB", "");
    },

    forcRemoveTab(){
      this.tabs.splice(this.INDEX, 1);
      this.$store.dispatch("commonStore/AC_COMMON_DEACTIVE_TAB", {
        id: this.TAB.id,
        title: this.TAB.title,
      });
      let newTab = this.INDEX === this.tabs.length ? this.tabs[this.INDEX-1] : this.tabs[this.tabs.length-1];
      let pageInfo = {TITLE:newTab.title,EXPLN:newTab.MENU_EXPLN,PATH:newTab.FULL_PATH};
      this.$store.commit("commonStore/MU_COMMON_PAGE_PATH", pageInfo);
      this.$store.commit("statusStore/MU_CUTT_ING", false); //상담 진행중을 false로 store 저장 처리
      this.closeMsg();
    },

    closeMsg(){
      this.$store.commit("alertStore/hideAlert");

    },
  },
};
</script>

<style></style>
