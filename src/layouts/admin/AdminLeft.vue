<template>
  <v-navigation-drawer
    absolute
    permanent
    expand-on-hover
    class="admin-layout-left"
    mini-variant-width="60"
  >
  <v-list
    nav
    >
    <v-list-item
      v-for="item in MENU_LIST"
      :key="item.id"
      link
      exact-active-class="active"
      :to="item.link"
      >
      <v-list-item-icon>
        <v-icon color="white">{{ item.icon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-title
        class="text-subtitle-2 pl-2 font-weight-bold is-txt-white">
        {{ item.title }}</v-list-item-title>
    </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  export default {
    name: "ADMIN_LEFT",
    components: {
    },
    data() {
      return {
        MENU_LIST : [
          {
            icon : 'mdi-home',
            title: '홈',
            link: '/home',
          },
          {
            icon : 'mdi-domain',
            title: '기업고객관리',
            link: '/admin',
          },
          {
            icon : 'mdi-account-search',
            title: '서비스 신청현황',
            link: '/admin2',
          },
          {
            icon : 'mdi-account-cash',
            title: '정산관리',
            link: '/admin3',
          },
          {
            icon : 'mdi-chart-line',
            title: '현황통계',
            link: '/admin3',
          },
          {
            icon : 'mdi-cogs',
            title: '시스템 관리',
            link: '/admin3',
          },
        ],

      }
    },
    methods: {
    },
    mounted() {
    },
    created() {
    },
    computed: {
    },
    watch: {
    },
  };
</script>

<style lang="scss" scoped>

</style>