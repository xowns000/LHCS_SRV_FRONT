<template>
  <v-snackbar
    v-model="toast.act"
    :timeout="toast.time"
    :class="toast.class"
    class="pl-toast"
    :transition="toast.type === 'top' ? 'slide-x-reverse-transition' : 'slide-y-reverse-transition'"
    :top="toast.type === 'top'"
    :right="toast.type === 'right'"
    :left="toast.type === 'left'"
  >
    <template v-if="toast.hasToastIcon === true">
      <v-icon >{{ toast.icon }}</v-icon>
    </template>
    {{ toast.msg }}
    <template v-slot:action="{ attrs }" v-if="toast.close">
      <div style="margin-right: 12px;">
        <v-icon v-bind="attrs" @click="closeToast" class="pl-icon20 dialog-close-white "></v-icon>
      </div>
    </template>
    <v-progress-linear
      v-if="toast.progress"
      style="height: 3px; z-index: 100; position: absolute; bottom: 0px; left: 0px; border-radius: 0 2px 0 0 2px;"
      :value="currentProgress"
    ></v-progress-linear>
  </v-snackbar>
</template>

<script>
  import { mapState, mapMutations } from "vuex";

  export default {
    name: "ToastDefault",
    props: {
    },
    data() {
      return {
        currentProgress: 0,  // 현재 진행 상태 (0에서 시작)
      }
    },

    computed: {
      ...mapState({
        toast: (state) => state.toastStore.toast,
      }),
    },
    methods: {
      startProgress() {
        this.currentProgress = 0;

        const interval = 100; // 100밀리초마다 업데이트
        const steps = (this.toast.time - 500) / interval;
        const increment = 100 / steps;

        const timer = setInterval(() => {
          if (this.currentProgress > 100) {
            clearInterval(timer);

          } else {
            this.currentProgress += increment;
          }
        }, interval);
      },
      closeToast() {
        this.hideToast();
      },

    },
    watch: {
      'toast.act'(value) {
        value ? this.startProgress() : '';
      },

    }
  };
</script>

<style>
.v-progress-linear__determinate{
  background: #ffee00;
  transition: all .3s ease;
}
</style>
