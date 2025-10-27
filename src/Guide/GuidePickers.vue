<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <guide-table :PropTable="propsTable" />

    <!-- //mark: Date Input -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <compo-date-picker
          DateType="dateInput"
          :DateProp.sync="date2"/>
        <compo-date-picker
          DisabledProp
          NoTitleProp
          DateType="dateInput"
          :DateProp.sync="date2"/>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: Date Range -->
    <h2>{{ toplink[1] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <!-- range compo -->
        <compo-date-range-picker
          :StartDayProp.sync="date2"
          :EndDayProp.sync="date3"
          @startDayChange="mixin_testLog(date2)"
          @endDayChange="mixin_testLog(date3)"
        />
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />

    <!-- //mark: Date reserve -->
    <h2>{{ toplink[2] }}</h2>
    <div class="guide-card">
      <div class="guide-gap vertical">
        <div class="pl-form-inline-wrap">
          <div class="pl-form-inline">
            <span class="pl-label">
              예약콜
              <compo-tooltip-btn
                TitleProp="툴팁내용입니다. 툴팁내용입니다.<br> 툴팁내용입니다. "
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 question"
                TooltipPositionProp="bottom"
              ></compo-tooltip-btn>
            </span>
            <div class="pl-desc is-reserveCall">
              <v-checkbox
                v-model="chkDateReserve"
                class="pl-check"
                @click="toggleChkReserve($event)"
              ></v-checkbox>
              <compo-date-picker
                v-if="dateReservePicker"
                DateType="dateTime"
                :DateProp.sync="dateTimeDate"
                :TimesProp.sync="selectedTime"
                :AmpmProp.sync="selectedAmpm"
                />
              <!-- 예약콜 간편 모달 -->
              <div
                v-show="dropDateReserve"
                :style="{ position: 'fixed', top: `${posY}px`, left: `${posX}px` }"
                class="pl-drop-layer is-dateReserve">
                <div class="pl-drop-layer-header">
                  예약콜 알림시간
                </div>
                <div class="pl-drop-layer-body">
                  <ul class="pl-drop-layer-list">
                    <li
                      v-for="(time, index) in times" :key="index"
                      class="d-flex"
                      @click="selectReserveDateTime(time.date)">
                      <span>{{ time.label }}</span> <span>{{ displayReserveTime(time.date) }}</span>
                    </li>
                  </ul>
                </div>
                <div class="pl-drop-layer-footer">
                  <v-btn
                    class="pl-btn is-icon is-sub is-calendarPick flex-grow-1"
                    @click="showDatePicker()"
                  >
                    <span class="pl-icon20 calendarPick"></span>
                    날짜 및 시간 직접 선택
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source03" :SrcProp="srcAll.srcInput_03" />

    <!-- //mark: Date Time -->
    <h2>{{ toplink[3] }}</h2>
    <div class="guide-card">
      <div class="guide-gap" style="width: 100%; justify-content: space-between;">
        <div>
          <compo-date-picker
            DateType="dateTime"
            :DateProp.sync="date1"
            :TimesProp.sync='timeStep2'
            :AmpmProp.sync='timeAmpm'
            :NudgeLeftProp=150
            StyleProp="width: 250px"
            />
        </div>
        <div>
          <compo-date-picker
            DateType="dateTime"
            :DateProp.sync="date1"
            :TimesProp.sync='timeStep2'
            :AmpmProp.sync='timeAmpm'
            />
        </div>
        <div>
          <compo-date-picker
            DateType="dateTime"
            :DateProp.sync="date1"
            :TimesProp.sync='timeStep2'
            :AmpmProp.sync='timeAmpm'
            :NudgeLeftProp=480
            />
        </div>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source04" :SrcProp="srcAll.srcInput_04" />

    <!-- //mark: Time -->
    <h2>{{ toplink[4] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <compo-date-picker
          DateType="time"
          :TimesProp.sync='timeStep2'
          :AmpmProp.sync='timeAmpm'
          />
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source05" :SrcProp="srcAll.srcInput_05" />

    <!-- //mark: Drop Picker -->
    <h2>{{ toplink[5] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <compo-drop-picker
          :StartDateProp.sync="startDate"
          :EndDateProp.sync="endDate"
        />
        <span> {{ startDate }} ~ {{ endDate }}</span>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source06" :SrcProp="srcAll.srcInput_06" />




  </div>
</template>

<script>
import guideJs from '@/Guide/guide.js'

export default {
  name: "GuidePickers",

  props:{
    SelectedProp: {
      type: String,
    }
  },
  components: {
  },
  data() {
    return {
      toplink:[
        'Date Input',
        'Date Range',
        'Date Reserve',
        'Date Time',
        'Time',
        'Drop Picker',
      ],
      source01: null,
      source02: null,
      source03: null,
      source04: null,
      source05: null,
      source06: null,

      propsTable: [
        { name: 'DateType', type: 'String', default: 'undefined', description: 'date, dateInput, time, dateTime', required: true },
        { name: 'DateProp.sync', type: 'String', default: 'undefined', description: '', required: true},
        { name: 'FirstDay', type: 'Number', default: '0', description: '시작일설정(0: 일요일, 1: 월요일 ...)', },
        { name: 'HeaderColorProp', type: 'String', default: '#F4F5FF', description: '헤더타이틀 컬러', },
        { name: 'ColorProp', type: 'String', default: '#F0F4FF', description: '선택 컬러, time타입은 component에서 직접 적용', },
        { name: 'StyleProp', type: 'String', default: 'undefined', description: '인라인 스타일 적용', },
        { name: 'ClassProp', type: 'String', default: 'undefined', description: '인라인 클래스 적용', },
        { name: 'ReadProp', type: 'Boolean', default: 'undefined', description: 'readonly 적용', },
        { name: 'DisabledProp', type: 'Boolean', default: 'undefined', description: 'disabled', },
        // { name: 'RangeColorProp', type: 'String', default: '#FF8F8F66', description: 'ragne 타입 : 선택 컬러', },
        // { name: 'AmpmProp', type: 'String', default: '', description: '오전, 오후', },
        // { name: 'DateMaxVal', type: 'Number', default: '3', description: 'range 타입 : 종료날짜 최대 개월수', required: true},
        // { name: 'DateLabel', type: 'String', default: '', description: '레이블'},
        { name: 'StartDateProp', type: 'String', default: 'undefined', description: 'range', required: true },
        { name: 'EndDateProp', type: 'String', default: 'undefined', description: 'range', required: true },
        { name: 'NudgeLeftProp', type: 'Number', default: '270', description: '팝업메뉴 왼쪽 위치 조정' },
        { name: 'NoTitleProp', type: 'Boolean', default: 'true', description: '상단 타이틀 유무', },

      ],

      date1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      endDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date_null: "",
      date_null2: ['',''],
      dates: [
        (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
      ],
      dates2: [
        (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
      ],
      timeStep: '00:00',
      timeStep2: '05:50',
      timeAmpm: '오후',
      // date reserve
      posX: 0,
      posY: 0,
      times: [
        { label: "30분 후", date: ["dateTimeDate","dateTimeTime", 0, 0, 30] },
        { label: "1시간 후", date: ["dateTimeDate","dateTimeTime", 0, 1, 0] },
        { label: "내일", date: ["dateTimeDate", "dateTimeTime", 1, 0, 0] },
        { label: "이틀 후", date: ["dateTimeDate", "dateTimeTime", 2, 0, 0] },
        { label: "다음 주", date: ["dateTimeDate", "dateTimeTime", 7, 0, 0] }
      ],
      dateTimeDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dateTimeTime: new Date(),
      selectedTime: '',
      selectedAmpm: '',
      chkDateReserve: false,
      dateReservePicker: false,
      dropDateReserve: false,

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<compo-date-picker
  DateType="dateInput"
  :DateProp.sync="date2"/>
<compo-date-picker
  NoTitleProp
  DateType="dateInput"
  :DateProp.sync="date2"/>
`
          },
          { tab: "script", content:
`date1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),` },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`//신규
<!-- range compo -->
<compo-date-range-picker
  :StartDayProp.sync="date2"
  :EndDayProp.sync="date3"
  @startDayChange="mixin_testLog(date2)"
  @endDayChange="mixin_testLog(date3)"
/>`
          },
          { tab: "script", content:
`date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),`
},
        ],
        srcInput_03: [
          {
            tab: "html",
            content:
`<div class="pl-form-inline-wrap">
  <div class="pl-form-inline">
    <span class="pl-label">
      예약콜
      <compo-tooltip-btn
        TitleProp="툴팁내용입니다. 툴팁내용입니다.<br> 툴팁내용입니다. "
        ClassProp="pl-tooltip-btn"
        IconProp="pl-icon20 question"
        TooltipPositionProp="bottom"
      ></compo-tooltip-btn>
    </span>
    <div class="pl-desc is-reserveCall">
      <v-checkbox
        v-model="chkDateReserve"
        class="pl-check"
        @click="toggleChkReserve($event)"
      ></v-checkbox>
      <compo-date-picker
        v-if="dateReservePicker"
        DateType="dateTime"
        :DateProp.sync="dateTimeDate"
        :TimesProp.sync="selectedTime"
        :AmpmProp.sync="selectedAmpm"
        />
      <!-- 예약콜 간편 모달 -->
      <div v-show="dropDateReserve" class="pl-drop-layer is-dateReserve">
        <div class="pl-drop-layer-header">
          예약콜 알림시간
        </div>
        <div class="pl-drop-layer-body">
          <ul class="pl-drop-layer-list">
            <li
              v-for="(time, index) in times" :key="index"
              class="d-flex justify-space-between"
              @click="selectReserveDateTime(time.date)">
              <span>{{ time.label }}</span> <span>{{ displayReserveTime(time.date) }}</span>
            </li>
          </ul>
        </div>
        <div class="pl-drop-layer-footer">
          <v-btn
            class="pl-btn is-icon is-sub is-calendarPick flex-grow-1"
            @click="showDatePicker()"
          >
            <span class="pl-icon20 calendarPick"></span>
            날짜 및 시간 직접 선택
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</div>`
          },
          { tab: "script", content:
`data() {
  return {
    posX: 0,
    posY: 0,
    times: [
      { label: "30분 후", date: ["dateTimeDate","dateTimeTime", 0, 0, 30] },
      { label: "1시간 후", date: ["dateTimeDate","dateTimeTime", 0, 1, 0] },
      { label: "내일", date: ["dateTimeDate", "dateTimeTime", 1, 0, 0] },
      { label: "이틀 후", date: ["dateTimeDate", "dateTimeTime", 2, 0, 0] },
      { label: "다음 주", date: ["dateTimeDate", "dateTimeTime", 7, 0, 0] }
    ],
    dateTimeDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    dateTimeTime: new Date(),
    selectedTime: '',
    selectedAmpm: '',
    chkDateReserve: false,
    dateReservePicker: false,
    dropDateReserve: false,
  }
}
methods: {
  toggleChkReserve(event) {
    this.posX = event.clientX + 10;
    this.posY = event.clientY - 50;

    if( this.chkDateReserve === true) {
      this.dropDateReserve = true;
    } else {
      this.dropDateReserve = false;
      this.dateReservePicker = false;
      return
    }
  },
  showDatePicker(){
    this.dateReservePicker = true;
    this.dropDateReserve = false;
  },

  selectReserveDateTime(date) {
    // getReserveTime 메소드를 호출하여 반환된 값을 변수에 저장
    let getDate = this.getReserveTime(date);

    // 날짜와 시간을 따로 분리하여 데이터 속성에 저장
    this.dateTimeDate = new Date(getDate[0]).toISOString().substr(0, 10);
    getDate[3].toString().length === 1 ? getDate[3] = "0" + getDate[3] : null;
    this.selectedTime = \`\${String(getDate[3]).padStart(2, '0')}:\${String(getDate[4]).padStart(2, '0')}\`;
    this.selectedAmpm = \`\${getDate[2]}\`;

    this.showDatePicker();
  },
  getReserveTime(date) {
    let newDate = this[\`\${date[0]}\`];
    let newTime = this[\`\${date[1]}\`];
    let newDay = new Date( new Date(newDate).setDate(new Date(newDate).getDate() + date[2]) );

    let newTimeHours = new Date(newTime).getHours() + date[3];
    let newTimeMinutes = new Date(newTime).getMinutes() + date[4];
    let ampm = newTimeHours < 12 ? "오전" : "오후";

    let daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    let dayOfWeek = daysOfWeek[newDay.getDay()];
    if( date[2] === 0 ) {
        dayOfWeek = '오늘';
    }

    newTimeHours = newTimeHours % 12 || 12;

    if ( newTimeMinutes >= 60) {
      newTimeHours = newTimeHours + 1;
      newTimeMinutes = newTimeMinutes % 60;
    }

    let calculateDate = [newDay.toISOString().substr(0, 10), dayOfWeek, ampm, newTimeHours, newTimeMinutes];

    return calculateDate;
  },
  displayReserveTime(date) {
    let getDate = this.getReserveTime(date);
    let targetDate = \`\${ getDate[1] } \${getDate[2]} \${String(getDate[3]).padStart(2, '0')}:\${String(getDate[4]).padStart(2, '0')}\`;

    return targetDate;
  },
},` },
        ],
        srcInput_04: [
          {
            tab: "html",
            content:
`<div>
  <compo-date-picker
    DateType="dateTime"
    :DateProp.sync="date1"
    :TimesProp.sync='timeStep2'
    :AmpmProp.sync='timeAmpm'
    :NudgeLeftProp=150
    StyleProp="width: 250px"
    />
</div>
<div>
  <compo-date-picker
    DateType="dateTime"
    :DateProp.sync="date1"
    :TimesProp.sync='timeStep2'
    :AmpmProp.sync='timeAmpm'
    />
</div>
<div>
  <compo-date-picker
    DateType="dateTime"
    :DateProp.sync="date1"
    :TimesProp.sync='timeStep2'
    :AmpmProp.sync='timeAmpm'
    :NudgeLeftProp=480
    />
</div>`
          },
          { tab: "script", content:
`data() {
  return {
    date1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    timeStep2: '05:50',
    timeAmpm: '오후',
  }
}` },
        ],
        srcInput_05: [
          {
            tab: "html",
            content:
`<compo-date-picker
  DateType="time"
  :TimesProp.sync='timeStep2'
  :AmpmProp.sync='timeAmpm'
  />`
          },
          { tab: "script", content:
`data() {
  return {
    timeStep2: '05:50',
    timeAmpm: '오후',
  }
}` },
        ],
        srcInput_06: [
          {
            tab: "html",
            content:
`<compo-drop-picker
  :StartDateProp.sync="startDate"
  :EndDateProp.sync="endDate"
/>
<span> {{ startDate }} ~ {{ endDate }}</span>`
          },
          { tab: "script", content:
`` },
        ],
      },
    }
  },
  methods: {
    toggleChkReserve(event) {
      this.posX = event.clientX + 10;
      this.posY = event.clientY - 50;

      if( this.chkDateReserve === true) {
        this.dropDateReserve = true;
      } else {
        this.dropDateReserve = false;
        this.dateReservePicker = false;
        return
      }
    },
    showDatePicker(){
      this.dateReservePicker = true;
      this.dropDateReserve = false;
    },

    selectReserveDateTime(date) {
      // getReserveTime 메소드를 호출하여 반환된 값을 변수에 저장
      let getDate = this.getReserveTime(date);

      // 날짜와 시간을 따로 분리하여 데이터 속성에 저장
      this.dateTimeDate = new Date(getDate[0]).toISOString().substr(0, 10);
      getDate[3].toString().length === 1 ? getDate[3] = "0" + getDate[3] : null;
      this.selectedTime = `${String(getDate[3]).padStart(2, '0')}:${String(getDate[4]).padStart(2, '0')}`;
      this.selectedAmpm = `${getDate[2]}`;

      this.showDatePicker();
    },
    getReserveTime(date) {
      let newDate = this[`${date[0]}`];
      let newTime = this[`${date[1]}`];
      let newDay = new Date( new Date(newDate).setDate(new Date(newDate).getDate() + date[2]) );

      let newTimeHours = new Date(newTime).getHours() + date[3];
      let newTimeMinutes = new Date(newTime).getMinutes() + date[4];
      let ampm = newTimeHours < 12 ? "오전" : "오후";

      let daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
      let dayOfWeek = daysOfWeek[newDay.getDay()];
      if( date[2] === 0 ) {
          dayOfWeek = '오늘';
      }

      newTimeHours = newTimeHours % 12 || 12;

      if ( newTimeMinutes >= 60) {
        newTimeHours = newTimeHours + 1;
        newTimeMinutes = newTimeMinutes % 60;
      }

      let calculateDate = [newDay.toISOString().substr(0, 10), dayOfWeek, ampm, newTimeHours, newTimeMinutes];

      return calculateDate;
    },
    displayReserveTime(date) {
      let getDate = this.getReserveTime(date);
      let targetDate = `${ getDate[1] } ${getDate[2]} ${String(getDate[3]).padStart(2, '0')}:${String(getDate[4]).padStart(2, '0')}`;

      return targetDate;
    },
    //Drop Picker 날짜 구하기
    // getDatePeriod(startDate, endDate, day, month ){
    //   let calculateDate = startDate;
    //   if(day !== 0) {
    //     calculateDate = this.$moment(this[`${startDate}`]).add(day,'days').format('YYYY-MM-DD');

    //   } else if(month !== 0) {
    //     calculateDate = this.$moment(this[`${startDate}`]).add(month,'months').format('YYYY-MM-DD');
    //   } else {
    //     calculateDate = this[`${startDate}`];
    //   }
    //   this[`${endDate}`] = calculateDate;
    // }
  },
  computed: {
  },
  mounted() {
    guideJs.appendHiddenLink(this.toplink);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>