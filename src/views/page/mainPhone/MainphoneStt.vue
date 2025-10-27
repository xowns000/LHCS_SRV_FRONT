<template>
  <div class="pl-card is-border pl-mainphone-stt"
    :style="templateLayout === 1 ? 'height: calc(100vh - 286px);' : 'height: calc(100vh - 322px)'"
  >
    <div
      v-for="item in DataProp"
      :key="item.id"
      class="pl-mainphone-stt-unit">
      <div  class="pl-mainphone-stt-portrait">
        <img
          v-if="item.portrait"
          :src="item.portrait"
          :alt="item.name"
          >
      </div>
      <div class="pl-mainphone-stt-chat">
        <strong class="pl-mainphone-stt-name">{{ item.name }}</strong>
        <p>{{ item.chat }}</p>
      </div>
      <div class="pl-mainphone-stt-time">
        {{ item.time }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

  export default {
    name: 'Mainphone_stt',
    props: {
      DataProp: {
        type: Array,
      },
    },
    components: {
    },
    data() {
      return {

      }
    },
    methods: {
    },
    mounted() {
    },
    created() {
    },
    computed: {
      ...mapGetters({
        templateLayout: 'commonStore/GE_COMMON_SETTING_TEMPLATE_LAYOUT'
      }),
    },
    watch: {
    },


  }
</script>

<style lang="scss" scoped>

</style>