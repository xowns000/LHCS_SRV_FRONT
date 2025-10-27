<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <guide-table :PropTable="propsTable" />

    <!-- //mark: LineChart -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <chartjsLineChart
        :chartData="LineData"
        :chartOptions="LineOptions"
        :height="300"
        :styles="{ background: '#fff' }"
      ></chartjsLineChart>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: BarChart -->
    <h2>{{ toplink[1] }}</h2>
    <div class="guide-card">
      <chartjsBarChart
        :chartData="BarData"
        :chartOptions="BarOptions"
        :height="300"
        :styles="{ background: '#fff' }"
      ></chartjsBarChart>

    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />

    <!-- //mark: DoughnutChart -->
    <h2>{{ toplink[2] }}</h2>
    <div class="guide-card">
      <chartjsDoughnutChart
        :chartData="DonughtData"
        :chartOptions="DonughtOptions"
        :height="300"
        :styles="{ background: '#fff' }"
      ></chartjsDoughnutChart>
    </div>
    <guide-srcview :ModelProp.sync="source03" :SrcProp="srcAll.srcInput_03" />

    <!-- //mark: PieChart -->
    <h2>{{ toplink[3] }}</h2>
    <div class="guide-card">
      <chartjsPieChart
        :chartData="PieData"
        :chartOptions="PieOptions"
        :height="300"
        :styles="{ background: '#fff' }"
      ></chartjsPieChart>
    </div>
    <guide-srcview :ModelProp.sync="source04" :SrcProp="srcAll.srcInput_04" />


  </div>
</template>

<script>

import guideJs from '@/Guide/guide.js'

import chartjsLineChart from "@/components/chartjsLineChart";
import chartjsBarChart from "@/components/chartjsBarChart";
import chartjsDoughnutChart from "@/components/chartjsDoughnutChart";
import chartjsPieChart from "@/components/chartjsPieChart";

export default {
  name: "GuideChartJs",

  props:{
    SelectedProp: {
      type: String,
    }
  },
  components: {
    chartjsLineChart,
    chartjsBarChart,
    chartjsDoughnutChart,
    chartjsPieChart,

  },
  data() {
    return {
      toplink: [
        'LineChart',
        'BarChart',
        'DoughnutChart',
        'PieChart',
      ],
      source01: null,
      source02: null,
      source03: null,
      source04: null,
      source05: null,

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<chartjsLineChart
  :chartData="LineData"
  :chartOptions="LineOptions"
  :height="300"
  :styles="{ background: '#fff' }"
></chartjsLineChart>`
          },
          { tab: "script", content:
`import chartjsLineChart from "@/components/chartjsLineChart";
components: {
  chartjsLineChart,
},
export default {
  data() {
    return {
      LineData: {
        labels: [],
        datasets: [
          {
            label: "InBound",
            backgroundColor: "#f87979",
            data: [],
          },
          {
            label: "OutBound",
            backgroundColor: "#3F48CC",
            data: [],
          },
        ],
      },
      LineOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "[Chartjs] LineChart 샘플",
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "요일",
              color: "#000",
              font: {
                size: 16,
                weight: "bold",
                lineHeight: 1.2,
              },
              padding: { top: 20, left: 0, right: 0, bottom: 0 },
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: "처리건수",
              color: "#000",
              font: {
                size: 16,
                weight: "bold",
                lineHeight: 1.2,
              },
              padding: { top: 30, left: 0, right: 0, bottom: 0 },
            },
            ticks: {
              // For a category axis, the val is the index so the lookup via getLabelForValue is needed
              callback: function(val, index) {
                function convertToTimeFormat(minutes) {
                  if (isNaN(minutes) || minutes < 0) {
                    return "유효하지 않은 입력";
                  }

                  var hours = Math.floor(minutes / 60);
                  var remainingMinutes = minutes % 60;

                  // 시간과 분을 2자리 숫자로 표시하도록 포맷팅
                  var formattedHours = String(hours).padStart(2, '0');
                  var formattedMinutes = String(remainingMinutes).padStart(2, '0');

                  return formattedHours + ':' + formattedMinutes;
                }

                // Hide every 2nd tick label
                return convertToTimeFormat(val)
              },
            }
          },
        },
      },
    }
  },
  methods: {
    setData() {
      let newData = {
        labels: ["월요일", "화요일", "수요일", "목요일", "금요일"],
        datasets: [
          {
            label: "InBound",
            borderColor: "rgba(0, 112, 192, 1)",
            backgroundColor: "rgba(0, 112, 192, 0.5)",
            data: [],
            tension: 0.4,
            cubicInterpolationMode: "monotone",
            pointStyle: "circle",
            pointRadius: 4,
            pointHoverRadius: 8,
          },
          {
            label: "OutBound",
            borderColor: "rgba(255, 127 ,39, 0.5)",
            backgroundColor: "rgba(255, 127 ,39, 1)",
            data: [],
            tension: 0.4,
            cubicInterpolationMode: "monotone",
            pointStyle: "circle",
            pointRadius: 4,
            pointHoverRadius: 8,
          },
        ],
      };

      for (let i = 0; i < 5; i++) {
        newData.datasets[0].data.push(Math.floor(Math.random() * 20));
        newData.datasets[1].data.push(Math.floor(Math.random() * 20));
      }

      console.log("##### [setData] newData=", "newData");

      this.LineData = newData;

      //그래프 다시 그리기
      setTimeout(() => {
        this.setData();
      }, 5000);
    },
  },
  mounted() {
    this.setData();
  }
}` },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`<chartjsBarChart
  :chartData="BarData"
  :chartOptions="BarOptions"
  :height="300"
  :styles="{ background: '#fff' }"
></chartjsBarChart>`
          },
          { tab: "script", content:
`import chartjsBarChart from "@/components/chartjsBarChart";
components: {
  chartjsBarChart,
},
export default {
  data() {
    return {
      BarData: {
        labels: [],
        datasets: [
          {
            label: "InBound",
            backgroundColor: "#f87979",
            data: [],
          },
          {
            label: "OutBound",
            backgroundColor: "#3F48CC",
            data: [],
          },
        ],
      },
      BarOptions: {
        responsive: true,
        maintainAspectRatio: false,
        borderRadius: 8,
        plugins: {
          title: {
            display: true,
            text: "[Chartjs] BarChart 샘플",
          },
        },
      },
    }
  },
  methods: {
    setData() {
      let newData = {
        labels: ["월요일", "화요일", "수요일", "목요일", "금요일"],
        datasets: [
          {
            label: "InBound",
            borderColor: "rgba(0, 112, 192, 1)",
            backgroundColor: "rgba(0, 112, 192, 0.5)",
            data: [],
            tension: 0.4,
            cubicInterpolationMode: "monotone",
            pointStyle: "circle",
            pointRadius: 4,
            pointHoverRadius: 8,
          },
          {
            label: "OutBound",
            borderColor: "rgba(255, 127 ,39, 0.5)",
            backgroundColor: "rgba(255, 127 ,39, 1)",
            data: [],
            tension: 0.4,
            cubicInterpolationMode: "monotone",
            pointStyle: "circle",
            pointRadius: 4,
            pointHoverRadius: 8,
          },
        ],
      };

      for (let i = 0; i < 5; i++) {
        newData.datasets[0].data.push(Math.floor(Math.random() * 20));
        newData.datasets[1].data.push(Math.floor(Math.random() * 20));
      }

      console.log("##### [setData] newData=", "newData");

      this.BarData = newData;

      //그래프 다시 그리기
      setTimeout(() => {
        this.setData();
      }, 5000);
    },
  },
  mounted() {
    this.setData();
  }
}` },
        ],
        srcInput_03: [
          {
            tab: "html",
            content:
`<chartjsDoughnutChart
  :chartData="DonughtData"
  :chartOptions="DonughtOptions"
  :height="300"
  :styles="{ background: '#fff' }"
></chartjsDoughnutChart>`
          },
          { tab: "script", content:
`import chartjsDoughnutChart from "@/components/chartjsDoughnutChart";
components: {
  chartjsDoughnutChart,
},
export default {
  data() {
    return {
      DonughtData: {
        labels: [],
        datasets: [
          {
            backgroundColor: [],
            data: [],
          },
        ],
      },
      DonughtOptions: {
        responsive: true,
        maintainAspectRatio: false,
        borderWidth: 0,
        plugins: {
          title: {
            display: true,
            text: "[Chartjs] DoughnutChart 샘플",
          },
          legend: {
            display: true,
            position: 'right',
            labels: {
              padding: 20,
              boxWidth: 10,
              usePointStyle: true,
              pointStyle: 'Rounded',
            },
          }
        },
      },
    }
  },
  methods: {
    setDonughtData() {
      let newData = {
        labels: ["월요일", "화요일", "수요일", "목요일", "금요일"],
        datasets: [
          {
            backgroundColor: [
              "rgba(0, 112, 192, 0.5)",
              "rgba(255, 127 ,39, 0.5)",
              "rgba(0, 176, 80, 0.5)",
              "rgba(0, 32, 96, 0.5)",
              "rgba(112, 48, 160, 0.5)",
            ],
            borderColor: [
              "rgba(0, 112, 192, 1)",
              "rgba(255, 127 ,39, 1)",
              "rgba(0, 176, 80, 1)",
              "rgba(0, 32, 96, 1)",
              "rgba(112, 48, 160, 1)",
            ],
            borderWidth: 1,
            data: [],
          },
        ],
      };

      for (let i = 0; i < 5; i++) {
        newData.datasets[0].data.push(Math.floor(Math.random() * 10) + 5);
      }

      this.DonughtData = newData;

      //그래프 다시 그리기
      setTimeout(() => {
        this.setDonughtData();
      }, 5000);
    },
  },
  mounted() {
    this.setDonughtData();
  }
}` },
        ],
        srcInput_04: [
          {
            tab: "html",
            content:
`<chartjsPieChart
  :chartData="PieData"
  :chartOptions="PieOptions"
  :height="300"
  :styles="{ background: '#fff' }"
></chartjsPieChart>`
          },
          { tab: "script", content:
`import chartjsPieChart from "@/components/chartjsPieChart";
components: {
  chartjsPieChart,
},
data() {
  return {
  PieData: {
      labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
      datasets: [
        {
          backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
          data: [40, 20, 80, 10]
        }
      ]
    },
    PieOptions: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "[Chartjs] DoughnutChart 샘플",
        },
        legend: {
          display: true,
          position: 'right',
          labels: {
            padding: 20,
            boxWidth: 14,
            usePointStyle: true,
            pointStyle: 'Rounded',
          },
        }
      },
    },

  }
},
methods: {

},
computed: {

},` },
        ],

      },
      propsTable: [
        { name: 'chartData', type: 'Object', default: '', description: '', required: true},
        { name: 'chartOptions', type: 'Object', default: '', description: '', required: true},
        { name: 'chartId', type: 'String', default: 'line-chart', description: '',},
        { name: 'datasetIdKey', type: 'String', default: 'label', description: '',},
        { name: 'width', type: 'Number', default: '400', description: '',},
        { name: 'height', type: 'Number', default: '400', description: '',},
        { name: 'cssClasses', type: 'String', default: '', description: '',},
        { name: 'styles', type: 'Object', default: '', description: '',},
      ],
      LineData: {
        labels: [],
        datasets: [
          {
            label: "InBound",
            backgroundColor: "#f87979",
            data: [],
          },
          {
            label: "OutBound",
            backgroundColor: "#3F48CC",
            data: [],
          },
        ],
      },
      LineOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "[Chartjs] LineChart 샘플",
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "요일",
              color: "#000",
              font: {
                size: 16,
                weight: "bold",
                lineHeight: 1.2,
              },
              padding: { top: 20, left: 0, right: 0, bottom: 0 },
            },

          },
          y: {
            display: true,
            title: {
              display: true,
              text: "처리건수",
              color: "#000",
              font: {
                size: 16,
                weight: "bold",
                lineHeight: 1.2,
              },
              padding: { top: 30, left: 0, right: 0, bottom: 0 },
            },
            ticks: {
              // For a category axis, the val is the index so the lookup via getLabelForValue is needed
              callback: function(val, index) {
                function convertToTimeFormat(minutes) {
                  if (isNaN(minutes) || minutes < 0) {
                    return "유효하지 않은 입력";
                  }

                  var hours = Math.floor(minutes / 60);
                  var remainingMinutes = minutes % 60;

                  // 시간과 분을 2자리 숫자로 표시하도록 포맷팅
                  var formattedHours = String(hours).padStart(2, '0');
                  var formattedMinutes = String(remainingMinutes).padStart(2, '0');

                  return formattedHours + ':' + formattedMinutes;
                }

                // Hide every 2nd tick label
                return convertToTimeFormat(val)
              },
            }
          },
        },
      },
      BarData: {
        labels: [],
        datasets: [
          {
            label: "InBound",
            backgroundColor: "#f87979",
            data: [],
          },
          {
            label: "OutBound",
            backgroundColor: "#3F48CC",
            data: [],
          },
        ],
      },
      BarOptions: {
        responsive: true,
        maintainAspectRatio: false,
        borderRadius: 8,
        plugins: {
          title: {
            display: true,
            text: "[Chartjs] BarChart 샘플",
          },
        },
        onClick: function(point, event) {
          if(event.length <= 0) return;

          console.log(event[0].element.$context.raw);
        },
      },
      DonughtData: {
        labels: [],
        datasets: [
          {
            backgroundColor: [],
            data: [],
          },
        ],
      },
      DonughtOptions: {
        responsive: true,
        maintainAspectRatio: false,
        borderWidth: 0,
        plugins: {
          title: {
            display: true,
            text: "[Chartjs] DoughnutChart 샘플",
          },
          legend: {
            display: true,
            position: 'right',
            labels: {
              padding: 20,
              boxWidth: 10,
              usePointStyle: true,
              pointStyle: 'Rounded',
            },
          }
        },
      },
      PieData: {
        labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
        datasets: [
          {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
            data: [40, 20, 80, 10]
          }
        ]
      },
      PieOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "[Chartjs] DoughnutChart 샘플",
          },
          legend: {
            display: true,
            position: 'right',
            labels: {
              padding: 20,
              boxWidth: 14,
              usePointStyle: true,
              pointStyle: 'Rounded',
            },
          }
        },
      },
    }
  },
  methods: {
    setData() {
      let newData = {
        labels: ["월요일", "화요일", "수요일", "목요일", "금요일"],
        datasets: [
          {
            label: "InBound",
            borderColor: "rgba(0, 112, 192, 1)",
            backgroundColor: "rgba(0, 112, 192, 0.5)",
            data: [],
            tension: 0.4,
            cubicInterpolationMode: "monotone",
            pointStyle: "circle",
            pointRadius: 4,
            pointHoverRadius: 8,
          },
          {
            label: "OutBound",
            borderColor: "rgba(255, 127 ,39, 0.5)",
            backgroundColor: "rgba(255, 127 ,39, 1)",
            data: [],
            tension: 0.4,
            cubicInterpolationMode: "monotone",
            pointStyle: "circle",
            pointRadius: 4,
            pointHoverRadius: 8,
          },
        ],
      };

      for (let i = 0; i < 5; i++) {
        newData.datasets[0].data.push(Math.floor(Math.random() * 200));
        newData.datasets[1].data.push(Math.floor(Math.random() * 200));
      }

      // console.log("##### [setData] newData=", "newData");

      this.LineData = newData;
      this.BarData = newData;

      //그래프 다시 그리기
      setTimeout(() => {
        this.setData();
      }, 5000);
    },
    setDonughtData() {
      let newData = {
        labels: ["월요일", "화요일", "수요일", "목요일", "금요일"],
        datasets: [
          {
            backgroundColor: [
              "rgba(0, 112, 192, 0.5)",
              "rgba(255, 127 ,39, 0.5)",
              "rgba(0, 176, 80, 0.5)",
              "rgba(0, 32, 96, 0.5)",
              "rgba(112, 48, 160, 0.5)",
            ],
            borderColor: [
              "rgba(0, 112, 192, 1)",
              "rgba(255, 127 ,39, 1)",
              "rgba(0, 176, 80, 1)",
              "rgba(0, 32, 96, 1)",
              "rgba(112, 48, 160, 1)",
            ],
            borderWidth: 1,
            data: [],
          },
        ],
      };

      for (let i = 0; i < 5; i++) {
        newData.datasets[0].data.push(Math.floor(Math.random() * 10) + 5);
      }

      this.DonughtData = newData;

      //그래프 다시 그리기
      setTimeout(() => {
        this.setDonughtData();
      }, 5000);
    },
  },
  mounted() {
    this.setData();
    this.setDonughtData();
    guideJs.appendHiddenLink(this.toplink);

  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>