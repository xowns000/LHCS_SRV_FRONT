<template>
  <v-list-group
    :prepend-icon="`pl-icon-gnb ${ item.ICON_CLASS_NM }`"
    :key="item.C_NODE_NO"
    color="none"
    no-action
  >
    <!-- {{ item }} -->
    <template v-slot:activator>
      <v-list-item-content>
        <v-list-item-title>{{ item.NODE_TITLE }}</v-list-item-title>
      </v-list-item-content>
    </template>
    <template v-for="(child, index) in item.child">
      <template v-if="child.child">
        <v-list-group
          :prepend-icon="child.ICON_CLASS_NM"
          :key="`group-${index}`"
          v-if="child.child"
          color="none"
          sub-group
          class="two-depth"
          active-class="active-icon"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ child.NODE_TITLE }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <template v-for="(child2, index2) in child.child">
            <!-- {{ child2.items }} -->
            <menu-list
              class="three-depth"
              :key="`child2-${index2}`"
              :item="child2"
              :user_menu="user_menu"
            />
          </template>
        </v-list-group>
      </template>
      <menu-list
        v-else
        class="two-depth"
        :key="`child-${index}`"
        :item="child"
        :user_menu="user_menu"
      />
    </template>
  </v-list-group>
</template>

<script>
import MenuList from "./MenuList";
export default {
  components: { MenuList },
  name: "MenuGroupList",
  props: {
    item: {
      type: Object,
      default: () => ({}),
      // type: Array,
      // default: () => [],
    },
  },
  data: () => ({
    // getUserMenu: [],
  }),
  computed: {
  },
  methods: {
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

<style>
</style>
