<template>
  <div class="text-center">
    <v-dialog v-model="progress_bar" persistent content-class="common-progress-dialog">
      <div class="loader-wrap">
        <!-- temp01 -->
        <!-- <div class="loader"></div>
        <div class="loader-icn-wrap ani">
          <div class="loader-icn01"></div>
          <div class="loader-icn02"></div>
          <div class="loader-icn03"></div>
          <div class="loader-icn04"></div>
          <div class="loader-icn05"></div>
        </div> -->

        <!-- dot circle -->
        <div class="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>

      </div>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      loader: false,
    }
  },
  computed: {
    ...mapGetters({
      progress_bar: "commonStore/GE_COMMON_PROGRESS_BAR",
    }),
  }
}
</script>
<style>.common-progress-dialog {
  box-shadow: none;
  text-align: center;
  overflow: hidden;
}</style>