<template>
  <v-btn
    v-if="this.IconProp.includes('dialog-close')"
    class="pl-tooltip-btn"
    :class="ClassProp"
    :min-width="MinWidthProp"
    :height="HeightProp"
    plain
    @click="compBtnClick"
    :disabled="DisabledProp"
  >
    <v-icon
      small
      :class="IconProp">
    </v-icon>
  </v-btn>
  <v-tooltip
    v-else
    v-bind="tooltipPositionComputed"
    :content-class="`pl-tooltip ${TooltipPositionProp}`"
    >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        class="pl-tooltip-btn"
        :class="ClassProp"
        :min-width="MinWidthProp"
        :height="HeightProp"
        plain
        @click="compBtnClick"
        :disabled="DisabledProp"
        :style="StyleProp"
      >
      <v-icon
        small
        :class="[IconProp, {'rotate': isRotating}]">
      </v-icon>
      </v-btn>
    </template>
    <span v-html="newLine(TitleProp)"></span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'CompoTooltipBtn',
  props: {
    MinWidthProp: {
      type: Number,
      default: 30
    },
    HeightProp: {
      type: Number,
      default: 30
    },
    TitleProp: {
      type: String,
    },
    DisabledProp: {
      type: Boolean,
      default: false,
    },
    ClassProp: {
      type: String
    },
    IconProp: {
      type: String
    },
    TooltipPositionProp: {
      type: String,
    },
    StyleProp: {
      type: String,
    },
    ProgressProp: {
      type: Boolean,
      default : false,
    },

  },
  data(){
    return{
      tooltipPos: 'bottom',
      isRotating: false,
      intervalId :null,
      duration: 30,

    }
  },
  methods:{
    compBtnClick(e){
      this.$emit('btnClick', e);
      if(this.IconProp.includes('refresh')){
        this.startAnimation();
      }
    },
    newLine(title) {
      if (!title) return;
      return title.split("\n").join("<br>");
    },
    startAnimation() {
      this.isRotating = true;
      // console.log('rotate');
      setTimeout(() => {
        this.isRotating = false;
      }, 1000);
    }
  },
  computed: {
    tooltipPositionComputed() {
      return {
        [`${this.TooltipPositionProp}`]: true
      }
    }
  },
  watch:{
    ProgressProp(){
      if(this.ProgressProp){
        this.intervalId = setInterval(this.startAnimation, 1050);
        setTimeout(() => {
          if (this.intervalId) {
            clearInterval(this.intervalId);
          }
        }, this.duration * 1050);
      } else {
        clearInterval(this.intervalId);
      }
    }
  },
  beforeDestroy() {
    // Clear the interval if the component is destroyed before 30 seconds
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
}
</script>

<style scoped>

</style>