<template>
  <v-list-item
    :key="item.PATH_NM"
    link
    color="white"
    class="transparent"
    @click="mixin_set_active_tab(item)"
  >
    <!-- {{ item }} -->
    <v-list-item-content>
      <v-list-item-title
        :class="this.$route.fullPath === item.PATH_NM ? 'active' : ''"
      >{{ item.NODE_TITLE }} </v-list-item-title>
    </v-list-item-content>
  </v-list-item>

  <!-- <v-list-item
    v-if="
      item.iframe === false &&
      item.dialog === false
    "
    :key="item.C_NODE_NO"
    :to="item.NODE_URL"
    link
    color="white"
    class="transparent"
  >
    <v-list-item-icon>
      <v-icon>{{ item.ICON_CLASS_NM }}</v-icon>
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title>{{ item.NODE_TITLE }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>

  <v-list-item
    v-else-if="
      item.iframe === false &&
      item.dialog === true
    "
    :key="item.C_NODE_NO"
    color="white"
    class="transparent"
    @click="openPop(item.NODE_URL)"
  >
    <v-list-item-icon>
      <v-icon>{{ item.ICON_CLASS_NM }}</v-icon>
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title>{{ item.NODE_TITLE }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>

  <v-list-item
    v-else
    :key="item.C_NODE_NO"
    :to="item.NODE_URL"
    link
    color="white"
    class="transparent"
    @click="mixin_set_active_tab(item)"
  >
    <v-list-item-content>
      <v-list-item-title>{{ item.title }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item> -->
</template>

<script>
export default {
  name: "MenuList",
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
  },
  methods: {
    setActiveTab(item) {
      let setId = item.to.replace("/", "");
      this.$store.dispatch("commonStore/AC_COMMON_ACTIVE_TAB", {
        id: setId,
        title: item.title,
        default: "N",
        tabIcon: item.tabIcon,
        link: item.to,
      });
    },
    openPop(id) {
      let setId = id.replace("/", "");
      this.$store.dispatch("commonStore/AC_COMMON_HELP_DIALOG", { type: true });
      this.$store.dispatch("commonStore/AC_COMMON_HELP_DIALOG_ID", {
        id: id,
      });
    },
    checkUserRole: (id, user_menu) => {
      var return_val = false;
      if (id) {
        if (user_menu) {
          for (var i = 0; i < user_menu.length; i++) {
            if (id === user_menu[i].C_NODE_NO) return_val = true;
          }
        }
      }
      return return_val;
    },
  },
};
</script>

<style></style>
