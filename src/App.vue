<template>
  <div
    :class="[`pl-palette alt-preview-${isAltPressedLong} ${this.$route.path.substring(1) }`, { 'development-class': isDevelopment, 'production-class': isProduction }]"
    :style="`--primary-color: ${savedColor}`"
    @click="handleAltKeyUp()"
    >
    <v-fade-transition mode="out-in">
      <router-view />
    </v-fade-transition>
    <compo-toast />
    <compo-alert/>
    <compo-progress/>
    <!-- alt preview -->
    <!-- <div class="pl-alt-preview" >
      <v-icon
        @click="handleAltKeyUp()"
        class="pl-alt-preview-close"
        large></v-icon>
      <div class="pl-alt-preview-body">
        <h1>단축키 확인</h1>
        <ul>
          <li>
            <span class="pl-alt-preview--keybox">CTRL + ,</span>
            <span class="pl-alt-preview--title">환경설정</span>
          </li>
          <li v-for="item in settingShortcut" :key="item.id">
            <span class="pl-alt-preview--keybox">ALT + {{ item.keycode }}</span>
            <span class="pl-alt-preview--title">{{ getShortcutTitle(item.path) }}</span>
          </li>
        </ul>
      </div>
    </div> -->

  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import CKEditor from "ckeditor4-vue";

export default {
  name: "App",
  components: {
  },
  data() {
    return {
      isAltPressedLong: false,
      altKeyTimeout: null,
      // isDevelopment: process.env.VUE_APP_ENV === 'local',
      // isProduction: (process.env.VUE_APP_ENV === 'production')? true : false,
    }
  },

  computed: {
    ...mapState('alertStore', {
      // dialog: state => state.alertDialogToggle,
      // message: state => state.msg,
      // icon: state => state.iconClass,
      // type: state => state.type,
      // callYes: state => state.callYes,
      // callNo: state => state.callNo,
      // loading: state => state.alert.isloading,
    }),
    ...mapGetters({
      savedColor: 'commonStore/GE_COMMON_PRIMARYCOLOR',
      // settingShortcut: 'commonStore/GE_COMMON_SETTING_SHORTCUT',
      userShortcut : 'userStore/GE_USER_SHORTCUT'
    }),
    shortcutSetting: {
      get(){
        return this.$store.getters['commonStore/GE_COMMON_SETTING_SLIDE'];
      },
      set(data){
        this.$store.dispatch('commonStore/AC_COMMON_SETTING_SLIDE', data);
      },
    },

  },
  methods: {
    unLoadEvent(event) {
      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false); // AC_COMMON_PROGRESS_BAR 초기화
    },

    // 단축키 찾기 및 실행
    fnShortcut(e) {
      if (e.ctrlKey && e.key === ',') {
        //환경설정 바로가기
        this.shortcutSetting = !this.shortcutSetting;
      } else if (e.altKey && e.key != 'Alt' && e.key != 'Shift') {
        //alt, alt + shift 조합 단축키 찾기 및 실행.
        const shortcutList = e.altKey && e.shiftKey ? this.userShortcut.ALT_SHIFT_SHORTCUT : this.userShortcut.ALT_SHORTCUT;
        for(let i = 0; i < shortcutList.length; i++) {
          const shortcut = shortcutList[i];
          if(shortcut.KEY_CD == e.keyCode) {
            if(shortcut.SHORT_TYPE_CD == 'KMS_SCRIPT') {
              this.fnRunShortcutKmsScript(shortcut);
            }
            break;
          }
        }
      }
    },

    //지식 스크립트 붙여넣기 단축키 실행
    fnRunShortcutKmsScript(shortcut) {
      const activeTab = this.$store.getters["commonStore/GE_COMMON_ACTIVE_TAB"]
      if(activeTab.id === 'CSL_M0200') {
        const type = shortcut.ALT_KEY_YN == 'Y' && shortcut.SHIFT_KEY_YN == 'N' ? "NEW" : "CONTINUE";
        this.$eventBus.$emit('chatMessagePaste', type, shortcut.LNK_CN);
      } else {
        this.showToast({  msg: 'SNS상담 메뉴에서 사용하실 수 있습니다.', class: 'info', hasToastIcon: true, icon: 'mdi-information-outline', time: 4000 })
      }
    },

    // menu 단축키를 위한 path node 선택
    // selectNodeByPathAndKey(e, key, path) {
    //   if (key === e.key) {
    //     this.handleAltKeyShortcut(e, path);
    //   }
    // },
    // handleAltKeyShortcut(e, path) {
    //   if (e.altKey) {
    //     this.selectNodeByPath(path);
    //   }
    // },
    // selectNodeByPath(path_nm) {
    //   // console.log("selectNodeByPath", path_nm)
    //   const selectedNode = this.findNodeByPath(this.$store.getters["userStore/GE_LEFT_MENU"], path_nm);
    //   if (selectedNode) {
    //     this.mixin_set_active_tab(selectedNode);
    //   }
    // },
    // findNodeByPath(arr, path_nm) {
    //   for (let node of arr) {
    //     if (node.PATH_NM === path_nm) {
    //       return node;
    //     }
    //     if (node.child) {
    //       const result = this.findNodeByPath(node.child, path_nm);
    //       if (result) {
    //         return result;
    //       }
    //     }
    //   }
    //   return null;
    // },
    // //단축키 용 node 타이틀 가져오기
    // getShortcutTitle(path_nm){
    //   return this.findNodeByTitle(this.$store.getters["userStore/GE_LEFT_MENU"], path_nm);
    // },
    // findNodeByTitle(arr, path_nm) {
    //   for (let node of arr) {
    //     if (node.PATH_NM === path_nm) {
    //       return node.NODE_TITLE;
    //     }
    //     if (node.child) {
    //       const result = this.findNodeByPath(node.child, path_nm);
    //       if (result) {
    //         return result;
    //       }
    //     }
    //   }
    //   return null;
    // },
    // alt 롱프레스 단축키 미리보기
    handleAltKeyDown(event) {
      if (event.keyCode === 18 && !this.isAltPressedLong) {
        event.preventDefault();
        this.altKeyTimeout = setTimeout(() => {
          this.isAltPressedLong = true;
        }, 500);
      }
    },
    handleAltKeyUp(event) {
      if (this.isAltPressedLong) {
        this.isAltPressedLong = false;
        clearTimeout(this.altKeyTimeout);

      }
    },
  },
  watch: {
    // alt + 단축키 단축키 호출 이벤트
    // settingShortcut: {
    //   deep: true,
    //   immediate: true,
    //   handler(){
    //     window.addEventListener('keydown', (e) => {
    //       if (e.altKey) {
    //         this.settingShortcut.forEach(el => {
    //           this.selectNodeByPathAndKey(e,el.keycode, el.path);
    //         });
    //       }
    //     });
    //   }
    // },
  },
  created() {
    // 단축키 정보 다시 조회(우측 지식정보 - 개인 지식 스크립트 수정 시)
    this.$eventBus.$on('shortcutReload' , () => {
      this.$store.dispatch("userStore/AC_USER_SHORTCUT", {user_id: this.$store.getters['userStore/GE_USER_ROLE'].userId});
    })


  },
  mounted() {
    window.addEventListener("beforeunload", this.unLoadEvent);

    //새로고침 라우터
    this.mixin_setRouter();
    this.$router.push(this.$route.fullPath).catch(() => {});

    // 단축키 이벤트
    window.addEventListener('keydown', this.fnShortcut);

  },
  beforeDestroy() {
    //세션에 담나놓는거라 서비스가 종료되면 자연스럽게 삭제되지만
    //혹시몰라서 추가
    window.sessionStorage.clear();
    this.$eventBus.$off("shortcutReload"); //eventBus 중복방지를 위해 off
    // 단축키 이벤트 remove
    window.removeEventListener('keydown', this.fnShortcut);

  },
  destroyed() {
    // 단축키 미리보기
    // window.removeEventListener("keydown", this.handleAltKeyDown);
    // window.removeEventListener("keyup", this.handleAltKeyUp);
  },
};
</script>
