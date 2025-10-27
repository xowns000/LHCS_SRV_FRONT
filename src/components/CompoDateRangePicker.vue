<template>
  <div class="pl-calendar-range-form">
    <compo-date-picker
      DateType="dateInput"
      :DateProp.sync="computedStartDateProp"
      :DisabledProp="DisabledProp"
      :StyleProp="styleProp"
      />
    <span class="pl-unit">~</span>
    <compo-date-picker
      DateType="dateInput"
      :DateProp.sync="computedEndDateProp"
      :MinProp="dateMin()"
      :DisabledProp="DisabledProp"
      :StyleProp="styleProp"
      />
    <compo-drop-picker
      v-if="IsViewDropPickerProp"
      :StartDateProp.sync="computedStartDateProp"
      :EndDateProp.sync="computedEndDateProp"
      :DisabledProp="DisabledProp"
    />
  </div>
</template>

<script>
  export default {
    name: 'CompoDateRangePicker',
    props: {
      StartDayProp: {
        type: String,
      },
      EndDayProp: {
        type: String,
      },
      DisabledProp: {
        type: Boolean
      },
      IsViewDropPickerProp: {
        type: Boolean,
        default: true
      },
      styleProp: {
        type: String,
      }
    },
    data(){
      return{
      }
    },
    methods: {
      // date input change 이벤트
      // dateChange(e){
      //   this.$emit('dateChange', e);
      // },
      startDayChange(e){
        this.$emit('startDayChange', e);
      },
      endDayChange(e){
        this.$emit('endDayChange',e);
      },
      dateMin() {
        // if(!this.StartDayProp) return '';
        // else{
        // }
        const minDate = new Date(
          new Date(this.StartDayProp).setDate(new Date(this.StartDayProp).getDate()) -
            new Date().getTimezoneOffset() * 60000
        )
          .toISOString().substr(0, 10);

        return minDate;
      },
    },
    computed: {
      computedStartDateProp: {
        get(){
          return this.StartDayProp;
        },
        set(newDate){
          this.$emit("update:StartDayProp", newDate);
          this.startDayChange(newDate);
        },
      },
      computedEndDateProp: {
        get(){
          return this.EndDayProp;
        },
        set(newDate){
          this.$emit("update:EndDayProp", newDate);
          this.endDayChange(newDate);
        },
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>