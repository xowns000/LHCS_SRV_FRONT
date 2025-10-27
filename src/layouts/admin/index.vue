<template>
  <v-app class="frame-layout admin-layout">

    <!-- top -->
    <admin-top></admin-top>
    <v-main>
      <!-- content -->
      <div class="admin-layout-content">
        <!-- left -->
        <admin-left></admin-left>
        <div class="pl-container flex-grow-1">
          <v-fade-transition mode="out-in">
            <router-view />
          </v-fade-transition>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import AdminTop from './AdminTop.vue';
import AdminLeft from './AdminLeft.vue';

export default {
  name: "AdminLayout",
  components: {
    AdminTop,
    AdminLeft
  },
};
</script>

<style >

</style>