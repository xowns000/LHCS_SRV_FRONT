<template>
  <div
    class="d-flex flex-column align-center"
    style="height: -webkit-fill-available;">
    <div class="d-flex align-center" style="width: 50%">
      <v-icon class="pl-icon20 zoom mr-4 "></v-icon>
      <vue-slider
        v-model="popData.imgWidth"
        :min=0.1
        :max=1
        :interval=0.1
        tooltip="none"
        width="calc(100% - 46px)"
        height="2px"
        dragOnClick
        @drag-start="toggleZoom = false"
        :duration=0
        adsorb
      />
      <compo-tooltip-btn
        TitleProp="원본 보기"
        ClassProp="pl-tooltip-btn ml-4"
        IconProp="pl-icon20 zoom-fit"
        TooltipPositionProp="bottom"
        @btnClick="popData.imgWidth = 1"
      ></compo-tooltip-btn>
    </div>
    <img
      :src="popData.expandImgUrl"
      :style="`transform: scale(${popData.imgWidth}); transform-origin: center top;`"
      class="is-mt-m"
    >

  </div>
</template>

<script>
  export default {
    name: 'CompoImgExpand',
    props: {
      DataProp: {
        type: Object,
      },
      popData : {
        type: Object,
      },
    },
    data() {
      return {
      }
    },

    watch: {
    },

    computed :{
    },

    async created() {
    },

    mounted() {
    },

    methods: {
    },

  }
</script>

<style lang="scss" scoped>

</style>