<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <!-- //mark: Default -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <div class="calendar-wrap">
        <div class="calendar-modal">
          <v-date-picker
            v-model="calendar"
            :events="arrayEventsCalendar"
            full-width
            color="#F7AFAE"
            header-color="#E3E3E3"
            locale="ko-KR"
            :first-day-of-week="1"
            :day-format="mixin_getDate"
            @change="calendarLog"
          ></v-date-picker>
        </div>
        <div class="calendar-evt timeline-wrap" style="height: 200px">
          <v-timeline align-top dense>
            <v-timeline-item
              small
              v-for="item in arrayEvents"
              :key="item.id"
              :class="[ item.type === 'schedule' ? 'type-schedule' : 'type-evt']"
            >
              <v-row>
                <v-col cols="4">
                  <strong>{{ daySplit(item.day) }}
                    <span class="text-caption">일</span>
                  </strong>
                </v-col>
                <v-col>
                  <strong> {{ item.titleLS }}</strong>
                  <div class="text-caption">
                    {{ item.desc }}
                  </div>
                </v-col>
              </v-row>
            </v-timeline-item>
          </v-timeline>
        </div>
      </div>

    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

  </div>
</template>

<script>
import guideJs from '@/Guide/guide.js'

export default {
  name: "GuideCalendar",


  props:{
    SelectedProp: {
      type: String,
    }
  },
  components: {

  },
  data() {
    return {
      toplink: [
        'Default'
      ],
      source01: null,
      source02: null,
      source03: null,

      calendar: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),

      arrayEvents: [
        {
          "id": 0,
          "day": "2022-12-01",
          "titleLS": "기념일1",
          "desc": "기념일 세부내용",
          "type": "evt",
          "title": "기념일",
          "icon": "svg-dot-evt"
        },
        {
          "id": 1,
          "day": "2022-12-03",
          "titleLS": "기념일222",
          "desc": "기념일 세부내용222",
          "type": "evt",
          "title": "기념일",
          "icon": "svg-dot-evt"
        },
        {
          "id": 2,
          "day": "2022-12-04",
          "titleLS": "스케쥴임",
          "desc": "스케쥴 세뷰내용",
          "type": "schedule",
          "title": "스케쥴",
          "icon": "svg-dot-sch"
        },
        {
          "id": 3,
          "day": "2022-12-25",
          "titleLS": "크리스마스",
          "desc": "스케쥴 세뷰내용",
          "type": "schedule",
          "title": "스케쥴",
          "icon": "svg-dot-sch"
        }
      ],

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<div class="calendar-wrap">
  <div class="calendar-modal">
    <v-date-picker
      v-model="calendar"
      :events="arrayEventsCalendar"
      full-width
      color="#F7AFAE"
      header-color="#E3E3E3"
      locale="ko-KR"
      :first-day-of-week="1"
      :day-format="mixin_getDate"
      @change="calendarLog"
    ></v-date-picker>
  </div>
  <div class="calendar-evt timeline-wrap" style="height: 200px">
    <v-timeline align-top dense>
      <v-timeline-item
        small
        v-for="item in arrayEvents"
        :key="item.id"
        :class="[ item.type === 'schedule' ? 'type-schedule' : 'type-evt']"
      >
        <v-row>
          <v-col cols="4">
            <strong>{{ daySplit(item.day) }}
              <span class="text-caption">일</span>
            </strong>
          </v-col>
          <v-col>
            <strong> {{ item.titleLS }}</strong>
            <div class="text-caption">
              {{ item.desc }}
            </div>
          </v-col>
        </v-row>
      </v-timeline-item>
    </v-timeline>
  </div>
</div>`
          },
          { tab: "script", content:
`data () {
  return {
    calendar: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    arrayEvents: [
      {
        "id": 0,
        "day": "2022-12-01",
        "titleLS": "기념일1",
        "desc": "기념일 세부내용",
        "type": "evt",
        "title": "기념일",
        "icon": "svg-dot-evt"
      },
      {
        "id": 1,
        "day": "2022-12-03",
        "titleLS": "기념일222",
        "desc": "기념일 세부내용222",
        "type": "evt",
        "title": "기념일",
        "icon": "svg-dot-evt"
      },
    ...
    ],
  }
},
methods: {
  //캘린더에 포인트 찍기
  arrayEventsCalendar(date) {
    let colorArray = [];

    for (let i = 0; i < this.arrayEvents.length; i++) {
      if (this.arrayEvents[i].day === date) {
        if (this.arrayEvents[i].type === "schedule") {
          colorArray.push("#6DC4B1");
        } else if (this.arrayEvents[i].type === "evt") {
          colorArray.push("#F7B611");
        }
      }
    }
    return colorArray;
  },
  //캘린더 클릭 로그
    calendarLog(e) {
    const index = this.arrayEvents.findIndex(function (item) {
      return item.day === e;
    });

    if (index < 0) return;

    console.log("index = " + index);
    this.arrayEventDetail =
      this.arrayEvents[index].desc ?? this.arrayEvents[index].desc;
  },

  daySplit(e) {
    const day = e.split("-")[2];
    return day;
  },
},
mounted() {
  //달력 이벤트 초기값
  for(let index = 0; index < this.arrayEvents.length; index++){
    this.arrayEventsCalendar(this.arrayEvents[index].day);
  }
}` },
        ],

      },
    }
  },
  methods: {
    //캘린더에 포인트 찍기
    arrayEventsCalendar(date) {
      let colorArray = [];

      for (let i = 0; i < this.arrayEvents.length; i++) {
        if (this.arrayEvents[i].day === date) {
          if (this.arrayEvents[i].type === "schedule") {
            colorArray.push("#6DC4B1");
          } else if (this.arrayEvents[i].type === "evt") {
            colorArray.push("#F7B611");
          }
        }
      }
      return colorArray;
    },
    //캘린더 클릭 로그
      calendarLog(e) {
      const index = this.arrayEvents.findIndex(function (item) {
        return item.day === e;
      });

      if (index < 0) return;

      // console.log("index = " + index);
      this.arrayEventDetail =
        this.arrayEvents[index].desc ?? this.arrayEvents[index].desc;
    },

    daySplit(e) {
      const day = e.split("-")[2];
      return day;
    },
  },
  computed: {
  },
  mounted() {
    //달력 이벤트 초기값
    for(let index = 0; index < this.arrayEvents.length; index++){
      this.arrayEventsCalendar(this.arrayEvents[index].day);
    }
    guideJs.appendHiddenLink(this.toplink);

  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>