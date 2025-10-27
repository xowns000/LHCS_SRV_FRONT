<template>
  <span style="display: contents;">
    <template v-if="chartData.datasets[0].noData">
      <div class="pl-chart-nodata"></div>
    </template>
    <template v-else>
      <LineChartGenerator
        v-if="chartData.datasets[0].data.length > 0"
        :chart-options="chartOptions"
        :chart-data="chartData"
        :chart-id="chartId"
        :dataset-id-key="datasetIdKey"
        :plugins="plugins"
        :css-classes="cssClasses"
        :styles="styles"
        :width="width"
        :height="height"
      />
      <compo-chart-loader  v-else/>
    </template>
  </span>
</template>

<script>
import { Line as LineChartGenerator } from "vue-chartjs/legacy";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
);

export default {
  components: {
    LineChartGenerator,
  },
  props: {
    chartId: {
      type: String,
      default: "line-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Array,
      default: () => [],
    },
    chartData: {
      type: Object
    },
    chartOptions: {
      type: Object
    }
  },
  data() {
    return {
      // chartData: {
      //   labels: [],
      //   datasets: [
      //     {
      //       label: "InBound",
      //       backgroundColor: "#f87979",
      //       data: [],
      //     },
      //     {
      //       label: "OutBound",
      //       backgroundColor: "#3F48CC",
      //       data: [],
      //     },
      //   ],
      // },
      // chartOptions: {
      //   responsive: true,
      //   maintainAspectRatio: false,
      //   plugins: {
      //     title: {
      //       display: true,
      //       text: "[Chartjs] LineChart 샘플",
      //     },
      //   },
      //   scales: {
      //     x: {
      //       display: true,
      //       title: {
      //         display: true,
      //         text: "요일",
      //         color: "#000",
      //         font: {
      //           size: 16,
      //           weight: "bold",
      //           lineHeight: 1.2,
      //         },
      //         padding: { top: 20, left: 0, right: 0, bottom: 0 },
      //       },
      //     },
      //     y: {
      //       display: true,
      //       title: {
      //         display: true,
      //         text: "처리건수",
      //         color: "#000",
      //         font: {
      //           size: 16,
      //           weight: "bold",
      //           lineHeight: 1.2,
      //         },
      //         padding: { top: 30, left: 0, right: 0, bottom: 0 },
      //       },
      //     },
      //   },
      // },
    };
  },
  mounted() {
    // this.setData();
  },
  methods: {
    // setData() {
    //   let newData = {
    //     labels: ["월요일", "화요일", "수요일", "목요일", "금요일"],
    //     datasets: [
    //       {
    //         label: "InBound",
    //         borderColor: "rgba(0, 112, 192, 1)",
    //         backgroundColor: "rgba(0, 112, 192, 0.5)",
    //         data: [],
    //         tension: 0.4,
    //         cubicInterpolationMode: "monotone",
    //         pointStyle: "circle",
    //         pointRadius: 4,
    //         pointHoverRadius: 8,
    //       },
    //       {
    //         label: "OutBound",
    //         borderColor: "rgba(255, 127 ,39, 0.5)",
    //         backgroundColor: "rgba(255, 127 ,39, 1)",
    //         data: [],
    //         tension: 0.4,
    //         cubicInterpolationMode: "monotone",
    //         pointStyle: "circle",
    //         pointRadius: 4,
    //         pointHoverRadius: 8,
    //       },
    //     ],
    //   };

    //   for (let i = 0; i < 5; i++) {
    //     newData.datasets[0].data.push(Math.floor(Math.random() * 20));
    //     newData.datasets[1].data.push(Math.floor(Math.random() * 20));
    //   }

    //   console.log("##### [setData] newData=", "newData");

    //   this.chartData = newData;

    //   // newData.datasets[0].data = sample_data1;
    //   // newData.datasets[1].data = sample_data2;

    //   // let lineChart = this.$refs.asdasds;
    //   // lineChart

    //   //그래프 다시 그리기
    //   setTimeout(() => {
    //     this.setData();
    //   }, 5000);
    // },
  },
};
</script>
