<template>
  <v-app class="frame-layout">
    <LayoutTop @drawer="drawer = !drawer"></LayoutTop>
    <v-main>
      <LayoutLeft></LayoutLeft>
      <div class="is-layout-center">
        <LayoutTabs></LayoutTabs>
        <v-fade-transition mode="out-in">
          <LayoutContent></LayoutContent>
        </v-fade-transition>
        <LayoutRight></LayoutRight>
      </div>
      <LayoutMenu v-model="drawer"></LayoutMenu>

    </v-main>
  </v-app>
</template>

<script>
import LayoutTop from "./TopArea";
import LayoutTabs from "./MdiArea";
import LayoutLeft from "./LeftArea";
import LayoutRight from "./RightArea";
import LayoutContent from "./ContentsArea";
import LayoutMenu from "./MenuArea";

export default {
  name: "MainLayout",
  components: {
    LayoutTop,
    LayoutTabs,
    LayoutLeft,
    LayoutRight,
    LayoutContent,
    LayoutMenu,
  },
  data: () => ({
    drawer: false,
  }),
  methods: {

  }
};
</script>

<style></style>
