<template>
  <span style="display: contents;">
    <!-- //mark: date -->
    <v-menu
      v-if="DateType == 'date'"
      v-model="menu2"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="auto"
      :content-class="`calendar-modal firstday${FirstDay}`"
      :disabled="DisabledProp"
      >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="computedDate"
          v-bind="attrs"
          v-on="on"
          outlined
          hide-details
          class="form-inp sm icon-calendar"
          :class="ClassProp"
          append-icon="svg-calendar"
          :label="DateLabel"
          :style="StyleProp"
          :readonly="ReadProp"
          :disabled="DisabledProp"
        >
        </v-text-field>
      </template>
      <v-date-picker
        v-model="computedDate"
        :color="ColorProp"
        :header-color="HeaderColorProp"
        @input="menu2 = false"
        :first-day-of-week="FirstDay"
        locale="ko-KR"
        :day-format="mixin_getDate"
        scrollable
      ></v-date-picker>
    </v-menu>

    <!-- //mark: date input -->
    <v-text-field
      v-if="DateType == 'dateInput'"
      v-model="computedDate"
      class="pl-form"
      :class="ClassProp"
      :label="DateLabel"
      :style="StyleProp"
      :readonly="ReadProp"
      :disabled="DisabledProp"
      maxlength="10"
      hide-spin-buttons
      type="text"
      oninput="javascript: this.value = this.value.replace(/[^\d\-]/gi, '')"
      >
      <template v-slot:append>
        <v-menu
          v-model="menu21"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          origin="top right"
          nudge-left="270"
          min-width="340"
          :content-class="`pl-calendar firstday${FirstDay}`"
          :disabled="DisabledProp"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              class="pl-icon20 calendar"
              @click="menu21 = true"
            />
          </template>
          <v-date-picker
            v-model="computedDate"
            :color="ColorProp"
            :header-color="HeaderColorProp"
            @input="menu21 = false"
            :first-day-of-week="FirstDay"
            locale="ko-KR"
            :day-format="mixin_getDate"
            scrollable
            :no-title="NoTitleProp"
            :min="computedMinProp"
          ></v-date-picker>
        </v-menu>
      </template>
    </v-text-field>

    <!-- //mark: date ragne -->
    <v-menu
      v-if="DateType == 'range'"
      v-model="menu1"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="580"
      :content-class="`calendar-modal firstday${FirstDay}`"
      color="#FFF"
      :disabled="DisabledProp"
      >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="dateRangeText"
          v-bind="attrs"
          v-on="on"
          readonly
          outlined
          hide-details
          class="form-inp icon-calendar"
          :class="ClassProp"
          append-icon="svg-calendar"
          :style="StyleProp"
          :label="DateLabel"
          :disabled="DisabledProp"
        ></v-text-field>
      </template>
      <div class="datepicker-range">
        <v-date-picker
          v-model="computedDates"
          :color="RangeColorProp"
          :first-day-of-week="0"
          locale="ko-KR"
          :day-format="mixin_getDate"
          range
          scrollable
          @input="isActiveRangeLastPicker = false"
          no-title></v-date-picker>
        <v-date-picker
          v-model="datesRangeEnd"
          :color="RangeColorProp"
          :first-day-of-week="0"
          locale="ko-KR"
          :day-format="mixin_getDate"
          range
          no-title
          scrollable
          :min="dateMin()"
          :max="dateMax(DateMaxVal)"
          @input="lastDatePicker($event)"
          :class="{'state-ready': isActiveRangeLastPicker == false}"
          show-current="false"></v-date-picker>
      </div>
    </v-menu>

    <!-- //mark: date range input -->
    <v-text-field
      v-if="DateType == 'rangeInput'"
      v-model="dateRangeText"
      outlined
      hide-details
      class="form-inp calendar-input"
      :class="ClassProp"
      :label="DateLabel"
      :style="StyleProp"
      :readonly="ReadProp"
      :disabled="DisabledProp"
      @change="datesInputChange($event)"
    >
      <template v-slot:append>
        <v-menu
          v-model="menu22"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          origin="top right"
          nudge-left="550"
          min-width="auto"
          :content-class="`calendar-modal firstday${FirstDay}`"
          :disabled="DisabledProp"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              class="svg-calendar"
              @click="menu22 = true"
            />
          </template>
          <div class="datepicker-range">
            <v-date-picker
              v-model="computedDates"
              :color="RangeColorProp"
              :first-day-of-week="0"
              locale="ko-KR"
              :day-format="mixin_getDate"
              range
              scrollable
              @input="isActiveRangeLastPicker = false"
              no-title></v-date-picker>
            <v-date-picker
              v-model="datesRangeEnd"
              :color="RangeColorProp"
              :first-day-of-week="0"
              locale="ko-KR"
              :day-format="mixin_getDate"
              range
              no-title
              scrollable
              :min="dateMin()"
              :max="dateMax(DateMaxVal)"
              @input="lastDatePicker($event)"
              :class="{'state-ready': isActiveRangeLastPicker == false}"
              show-current="false"></v-date-picker>
          </div>
        </v-menu>
      </template>
    </v-text-field>

    <!-- //mark: time -->
    <v-text-field
      v-if="DateType == 'time'"
      v-model="computedTime"
      class="pl-form is-datetime"
      :class="ClassProp"
      :label="DateLabel"
      :style="StyleProp"
      readonly
      :disabled="DisabledProp"
      >
      <template v-slot:append>
        <v-menu
          v-model="menu3"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          origin="top right"
          nudge-left="120"
          min-width="auto"
          :content-class="`pl-calendar is-time`"
          :disabled="DisabledProp"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              class="pl-icon20 calendar"
              @click="dateTime = true"
            />
          </template>
          <div class="d-flex">
            <div class="pl-calendar-time-wrap">
              <div class="pl-calendar-time-header">
                {{ String(selectedTimeHours).padStart(2, '0') }} :
                {{ String(selectedTimeMinutes).padStart(2, '0') }}
                <!-- {{ selectedTimeAmpm }} -->
              </div>
              <div>
                <div class="pl-calendar-time-picker hours">
                  <v-btn
                    v-for="num in Array.from(Array(24).keys())"
                    :key="num"
                    class="pl-timepicker-btn"
                    :class="{ active: num == selectedTimeHours }"
                    @click="setTimeHours(num)"
                    >
                    {{ num < 10 ? '0' + (num) : (num) }}
                  </v-btn>
                </div>
                <div class="pl-calendar-time-picker minutes">
                  <v-btn
                    v-for="minute in  Array.from(Array(60).keys())"
                    :key="minute"
                    class="pl-timepicker-btn"
                    :class="{ active: minute == selectedTimeMinutes }"
                    @click="setTimeMinutes(minute)"
                    >
                    {{ String(minute).padStart(2, '0') }}
                  </v-btn>
                </div>
                <!-- <div class="pl-calendar-time-picker ampm">
                  <v-btn
                    v-for="item in computedTimeAmpm"
                    :key="item.id"
                    class="pl-timepicker-btn"
                    :class="{ active: item.text === selectedTimeAmpm }"
                    @click="setTimeAmpm(item.text)"
                    >
                    {{ item.text }}
                  </v-btn>
                </div> -->
              </div>
            </div>
          </div>
        </v-menu>
      </template>
    </v-text-field>

    <!-- //mark: date&time -->
    <v-text-field
      v-if="DateType == 'dateTime'"
      v-model="computedDateTime"
      @input="updateDateTime"
      class="pl-form is-datetime"
      :class="ClassProp"
      :label="DateLabel"
      :style="computedDateTimeStyle"
      readonly
      :disabled="DisabledProp"
      >
      <template v-slot:append>
        <v-menu
          v-model="menu4"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          origin="top right"
          :nudge-left="NudgeLeftProp"
          min-width="auto"
          :content-class="`pl-calendar dateTime firstday${FirstDay} ${selectedTimeSeconds ? 'is-second' : ''}`"
          :disabled="DisabledProp"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              class="pl-icon20 calendar"
              @click="dateTime = true"
            />
          </template>
          <div class="d-flex">
            <v-date-picker
              v-model="computedDate"
              :color="ColorProp"
              :header-color="HeaderColorProp"
              @input="dateTime = false"
              :first-day-of-week="FirstDay"
              locale="ko-KR"
              :day-format="mixin_getDate"
              scrollable
            ></v-date-picker>
            <div class="pl-calendar-time-wrap">
              <div class="pl-calendar-time-header">
                {{ String(selectedTimeHours).padStart(2, '0') }} :
                {{ String(selectedTimeMinutes).padStart(2, '0') }}
                {{ selectedTimeSeconds?' : ' + String(selectedTimeSeconds).padStart(2, '0'):'' }}
                <!-- {{ selectedTimeAmpm }} -->
              </div>
              <div>
                <div class="pl-calendar-time-picker hours">
                  <v-btn
                    v-for="num in Array.from(Array(24).keys())"
                    :key="num"
                    class="pl-timepicker-btn"
                    :class="{ active: num == selectedTimeHours }"
                    @click="setTimeHours(num)"
                    >
                    {{ num < 10 ? '0' + (num) : (num) }}
                  </v-btn>
                </div>
                <div class="pl-calendar-time-picker minutes">
                  <v-btn
                    v-for="minute in  Array.from(Array(60).keys())"
                    :key="minute"
                    class="pl-timepicker-btn"
                    :class="{ active: minute == selectedTimeMinutes }"
                    @click="setTimeMinutes(minute)"
                    >
                    {{ String(minute).padStart(2, '0') }}
                  </v-btn>
                </div>
                <div class="pl-calendar-time-picker minutes" v-if="selectedTimeSeconds">
                  <v-btn
                    v-for="second in  Array.from(Array(60).keys())"
                    :key="second"
                    class="pl-timepicker-btn"
                    :class="{ active: second == selectedTimeSeconds }"
                    @click="setTimeSeconds(second)"
                    >
                    {{ String(second).padStart(2, '0') }}
                  </v-btn>
                </div>
                <!-- <div class="pl-calendar-time-picker ampm">
                  <v-btn
                    v-for="item in computedTimeAmpm"
                    :key="item.id"
                    class="pl-timepicker-btn"
                    :class="{ active: item.text === selectedTimeAmpm }"
                    @click="setTimeAmpm(item.text)"
                    >
                    {{ item.text }}
                  </v-btn>
                </div> -->
              </div>
            </div>
          </div>
        </v-menu>
      </template>
    </v-text-field>

    <!-- //mark: only icon date -->
    <template v-if="DateType == 'icon'">
      <v-menu
        v-model="menu21"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        origin="top right"
        nudge-left="270"
        min-width="340"
        :content-class="`pl-calendar firstday${FirstDay}`"
        :disabled="DisabledProp"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            v-bind="attrs"
            v-on="on"
            class="pl-icon20 calendar"
            @click="menu21 = true"
          />
        </template>
        <v-date-picker
          v-model="computedDate"
          :color="ColorProp"
          :header-color="HeaderColorProp"
          @input="menu21 = false"
          :first-day-of-week="FirstDay"
          locale="ko-KR"
          :day-format="mixin_getDate"
          scrollable
          :no-title="NoTitleProp"
          :min="computedMinProp"
          @change="updatePicker($event)"
        ></v-date-picker>
      </v-menu>
    </template>


  </span>
</template>

<script>
import { get } from 'http'

export default {
  name: 'CompDatePicker',
  props: {
    DateType: {
      type: String,
    },
    DateMaxVal: {
      type: Number,
      default: 3
    },
    NudgeLeftProp: {
      type: Number,
      default: 270
    },
    DateLabel: {
      type: String
    },
    DateProp:{
      type: String,
    },
    DatesProp:{
      type: Array,
    },
    TimesProp:{
      type: String,
    },
    AmpmProp:{
      type: String,
    },
    StyleProp:{
      type: String,
    },
    ClassProp:{
      type: String,
    },
    FirstDay: {
      type: Number,
      default: 0 //일요일 = 0, 월요일 = 1
    },
    ColorProp:{
      type: String,
      default: '#F0F4FF'
    },
    HeaderColorProp:{
      type: String,
      default: '#F4F5FF'
    },
    RangeColorProp:{
      type: String,
      default: '#FFAFAF94'
    },
    FormatProp: {
      type: String,
      default: '24hr'
    },
    ReadProp:{
      type: Boolean
    },
    DisabledProp: {
      type: Boolean
    },
    NoTitleProp: {
      type: Boolean
    },
    MinProp: {
      type: String
    }

  },
  data(){
    return{
      menu1: false,
      menu2: false,
      menu21: false,
      menu22: false,
      menu3: false,
      menu4: false,

      isActiveRangeLastPicker: false,

      selectedTimeHours: '',
      selectedTimeMinutes: '',
      selectedTimeSeconds: '',
      selectedTimeAmpm: '',

      computedTimeAmpm: [ {text: '오전'}, {text: '오후'}],
    }
  },
  methods: {
    updateDateTime(){
      // this.$emit('update:DateProp', this.computedDateTime);
    },
    setTimeHours(h) {
      this.selectedTimeHours = h;
      this.$emit('update:TimesProp', this.computedTime);
    },
    setTimeMinutes(m) {
      this.selectedTimeMinutes = m;
      this.$emit('update:TimesProp', this.computedTime);
    },
    setTimeSeconds(s) {
      this.selectedTimeSeconds = s;
      this.$emit('update:TimesProp', this.computedTime);
    },
    setTimeAmpm(ampm) {
      this.selectedTimeAmpm = ampm;
      this.$emit('update:TimesProp', this.computedTime);
    },
    updatePicker(date) {
      this.$emit("dateChange", date);
    },
    formatDate (date) {
      if (!date) return;
      const parts = date.split('-');
      return `${parts[0]}/${parts[1]}/${parts[2]}`
    },
    dateMin() {
      if(!this.computedDates[0]) return '';
      else{
        const minDate = new Date(
          new Date(this.computedDates[0]).setDate(new Date(this.computedDates[0]).getDate() + 1) -
            new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substr(0, 10);
        return minDate;
      }
    },
    dateMax(e) {
      if(!this.computedDates[0] === true) {
        return '';
      }
      else{
        const maxDate = new Date(new Date(this.computedDates[0]).setMonth(new Date(this.computedDates[0]).getMonth() + e) - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .substr(0, 10);
        return maxDate
      }
    },
    allowedStep: (m) => m % 10 === 0,
    lastDatePicker(newVal) {
      let newDate = newVal[1] ?? newVal[0];
      this.isActiveRangeLastPicker = true;
      this.$emit("update:DatesProp", [this.DatesProp[0], newDate ]);
      return newDate;
    },
    datesInputChange(newVal) {
      let [start, end] = newVal.split('~').map(x => x.trim());
      [this.computedDates[0], this.computedDates[1]] = [start, end];
    },
    // date input change 이벤트
    dateChange(e){
      this.$emit('dateChange', e);
    },
  },
  computed: {
    computedDateTimeStyle() {
      let computedStyle;
      computedStyle = this.StyleProp ? this.StyleProp : { 'min-width': this.selectedTimeSeconds ? '170px' : '150px' };
      return computedStyle;
    },
    computedDate: {
      get(){
        return this.DateProp;
      },
      set(newDate){
        this.$emit("update:DateProp", newDate);
        this.dateChange(newDate);
      },
    },
    computedDates: {
      get(){
        return this.DatesProp;
      },
      set(newDate){
        this.$emit("update:DatesProp", newDate.sort());
      },
    },

    dateRangeText: {
      get() {
        let newStartDate = this.computedDates[0];
        let newEndDate = this.computedDates[1] ?? '';

        if( !this.computedDates[0] === true) return ;
        return newStartDate + ' ~ ' + newEndDate;
      },
      set() {
      }
    },
    datesRangeEnd: {
      get() {
        const currentDate = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000).toISOString().substr(0, 10)

        if (!this.DatesProp[0]) {
          return [currentDate, currentDate];
        } else {
          return this.DatesProp;
        }
      },
      set([newVal]) {
        this.lastDatePicker(newVal);
      }
    },
    computedDateTime : {
      get(){
        return `${this.DateProp} ${this.TimesProp}`
      },
      set(){
      }
    },
    computedTime() {
      // 12시간제에서 오전오후 선택 시 값이 안넘어와서 selectedTimeAmpm을 추가했습니다.
      // return `${String(this.selectedTimeHours).padStart(2, '0')}:${String(this.selectedTimeMinutes).padStart(2, '0')}`;
      // return `${String(this.selectedTimeHours).padStart(2, '0')}:${String(this.selectedTimeMinutes).padStart(2, '0')}:${String(this.selectedTimeAmpm)}`;
      if(this.selectedTimeSeconds){
        return `${String(this.selectedTimeHours).padStart(2, '0')}:${String(this.selectedTimeMinutes).padStart(2, '0')}:${String(this.selectedTimeSeconds).padStart(2, '0')}`;
      }else{
        return `${String(this.selectedTimeHours).padStart(2, '0')}:${String(this.selectedTimeMinutes).padStart(2, '0')}`;
      }
    },
    computedMinProp() {
      return this.MinProp;
    }

  },
  watch: {
    TimesProp(newTime) {
      // time props가 변경될 때마다 selectedHours와 selectedMinutes 값을 업데이트합니다.
      const [hours, minutes, seconds] = newTime.split(':');
      this.selectedTimeHours = hours;
      this.selectedTimeMinutes = minutes;
      this.selectedTimeSeconds = seconds;
    }
  },
  mounted() {
    // 초기시간 값 세팅
    if(this.TimesProp) {
      let initHours = parseInt(this.TimesProp.split(':')[0]);
      let initMinutes = this.TimesProp.split(':').length > 1 ? this.TimesProp.split(':')[1] : null;
      let initSeconds = this.TimesProp.split(':').length > 2 ? this.TimesProp.split(':')[2] : null;
      let initAmpm = this.AmpmProp;
      this.selectedTimeHours = initHours;
      this.selectedTimeMinutes = initMinutes;
      this.selectedTimeSeconds = initSeconds;
      this.selectedTimeAmpm = initAmpm;
    }else if(this.DateType == 'dateTime'){
      let initHours = '00';
      let initMinutes = '00';
      this.selectedTimeHours = initHours;
      this.selectedTimeMinutes = initMinutes;
    }
  }
}
</script>

<style lang="scss" scoped>

</style>