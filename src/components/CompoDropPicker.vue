<template>
 <div class="pl-dateDropWrap">
    <!-- 기간 모달 -->
    <compo-tooltip-btn
      TitleProp="상세"
      ClassProp="pl-tooltip-btn"
      IconProp="pl-icon20 detail"
      TooltipPositionProp="bottom"
      @btnClick="openDrop"
      :DisabledProp="DisabledProp"
    ></compo-tooltip-btn>

    <div
      v-if="dropAllPeriod"
      class="pl-drop-layer is-dateDrop"
      v-click-outside="closeDrop"
      :style="{ position: 'fixed', top: `${posY}px`, left: `${posX}px` }"
      >
      <div class="pl-drop-layer-body">
        <ul class="pl-drop-layer-list">
          <li
            v-for="(time, index) in dropTimes" :key="index"
            class="d-flex"
            @click="getPeriod('computedStartDate', 'computedEndDate', time.day,time.month, computedBbsDate)">
            <span>{{ time.label }}</span>
          </li>
        </ul>
      </div>
      <!-- <div class="pl-drop-layer-header mt-2 pb-1">사용자 지정범위</div>
      <div class="pl-drop-layer-body">
        <div class="pl-desc d-flex mt-2">
          <compo-date-picker
            DateType="dateInput"
            :DateProp.sync="computedStartDate"/>
          <span class="pl-unit">~</span>
          <compo-date-picker
            DateType="dateInput"
            :DateProp.sync="computedEndDate"/>
        </div>
      </div> -->
      <!-- <div class="pl-drop-layer-footer justify-end" >
        <v-btn class="pl-btn is-sub" @click="dropAllPeriod = false">적용</v-btn>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompoDropPicker',
  props: {
    StartDateProp: {
      type: String,
    },
    EndDateProp: {
      type: String,
    },
    NudgeTopProp: {
      type: Number,
      default: 0
    },
    NudgeLeftProp: {
      type: Number,
      default: 0
    },
    BbsDateProp:{
      type: Boolean,
      default: false
    },
    DisabledProp: {
      type: Boolean
    },

  },
  data(){
    return{
      dropAllPeriod: false,
      dropTimes: [
        { label: "오늘", day: 0, month: 0},
        { label: "최근 3일", day: 3, month: 0},
        { label: "최근 1주", day: 7, month: 0},
        { label: "최근 1달", day: 0, month: 1},
        { label: "최근 3달", day: 0, month: 3},
      ],
      posX: 0,
      posY: 0,
      currentDate : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    }
  },
  methods:{
    openDrop(event) {
      this.posX = event.clientX - this.NudgeLeftProp;
      this.posY = event.clientY - this.NudgeTopProp;
      this.dropAllPeriod = true;
    },
    closeDrop() {
      this.dropAllPeriod = false;
    },
    getPeriod(computedStartDate, computedEndDate, day, month, computedBbsDate) {
      this.mixin_getDatePeriod(computedStartDate, computedEndDate, day, month, computedBbsDate);
      this.closeDrop();
    }

  },
  computed: {
    computedStartDate: {
      get(){
        return this.StartDateProp;
      },
      set(newDate){
        this.$emit("update:StartDateProp", newDate);
        this.$emit("update:EndDateProp", this.currentDate);
      },
    },
    computedEndDate: {
      get(){
        return this.currentDate;
      },
      set(newDate){
        this.$emit("update:StartDateProp", newDate);
        this.$emit("update:EndDateProp", this.currentDate);
      },
    },
    computedBbsDate: {
      get(){
        return this.BbsDateProp;
      },
      set(newDate){
        this.$emit("update:BbsDateProp", newDate);
      },
    },

  }
}
</script>

<style lang="scss" scoped>

</style>