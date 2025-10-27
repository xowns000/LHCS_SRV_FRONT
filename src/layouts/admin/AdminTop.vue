<template>
  <v-app-bar
    app
    absolute
    elevation="0"
    class="admin-layout-top"
    height="49px"
  >
    <h1>
      <div class="admin-layout-logo">
        <img src="@/assets/img/@admin_palette.png" alt="palette">
      </div>
      <span>Palette Cloud Service</span>
    </h1>
    <v-spacer></v-spacer>
    <v-btn
      icon
      color="#4c5cbb"
      link to="/home"
    >
      <v-icon color="">mdi-logout-variant</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
  export default {
    name: "ADMIN_TOP",

  }
</script>

<style lang="scss" scoped>

</style>