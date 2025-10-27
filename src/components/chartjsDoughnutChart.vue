<template>
  <span style="display: contents;">
    <template v-if="chartData.datasets[0].noData">
      <div class="pl-chart-nodata"></div>
    </template>
    <template v-else>
      <Doughnut
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
import { Doughnut } from "vue-chartjs/legacy";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default {
  components: {
    Doughnut,
  },
  props: {
    chartId: {
      type: String,
      default: "doughnut-chart",
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

    };
  },
  mounted() {
  },
  methods: {
    // setData() {
    //   let newData = {
    //     labels: ["월요일", "화요일", "수요일", "목요일", "금요일"],
    //     datasets: [
    //       {
    //         backgroundColor: [
    //           "rgba(0, 112, 192, 0.5)",
    //           "rgba(255, 127 ,39, 0.5)",
    //           "rgba(0, 176, 80, 0.5)",
    //           "rgba(0, 32, 96, 0.5)",
    //           "rgba(112, 48, 160, 0.5)",
    //         ],
    //         borderColor: [
    //           "rgba(0, 112, 192, 1)",
    //           "rgba(255, 127 ,39, 1)",
    //           "rgba(0, 176, 80, 1)",
    //           "rgba(0, 32, 96, 1)",
    //           "rgba(112, 48, 160, 1)",
    //         ],
    //         borderWidth: 1,
    //         data: [],
    //       },
    //     ],
    //   };

    //   for (let i = 0; i < 5; i++) {
    //     newData.datasets[0].data.push(Math.floor(Math.random() * 10) + 5);
    //   }

    //   this.chartData = newData;

    //   //그래프 다시 그리기
    //   setTimeout(() => {
    //     this.setData();
    //   }, 5000);
    // },
  },
};
</script>
