<template>
  <div>
    <div class="pl-card-top">
      <strong class="pl-card-top-title ">SNS 상담</strong>
      <div class="pl-btn-wrap ml-auto align-self-start">
        <!-- 새로고침 버튼 -->
        <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          @btnClick="cnsChnSrch()"
        ></compo-tooltip-btn>
        <!-- SNS 상담 통계 바로가기 버튼 -->
        <!-- <compo-tooltip-btn
          TitleProp="SNS 상담 통계 바로가기"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 plus"
          TooltipPositionProp="bottom"
        ></compo-tooltip-btn> -->
      </div>
    </div>
    <!-- top-->
    <div class="pl-card">
      <div class="pl-home-sns-wrap" >
        <!-- chart -->
        <div class="pl-home-sns-chart-wrap">
          <div class="pl-home-sns-wrap-title">주간 채널별 현황</div>
          <div class="is-mt-s" style="height: 130px;">
            <chartjsDoughnutChart
              :chartData="DonughtData"
              :chartOptions="DonughtOptions"
              :width=200
              :height=130
              :styles="{ background: '#fff'}"
            ></chartjsDoughnutChart>
          </div>
          <div style="display: flex; gap: 4px; position: absolute;top: 20px;right: 0px;width: 100px;bottom: 0;align-items: start;flex-direction: column;justify-content: center;"
            v-if="!DonughtData.datasets[0].noData"
          >
            <template v-for="item, index in DonughtData.datasets[0].backgroundColor">
              <span class="d-flex align-center" :key="item.id">
                <span
                  :style="`display: inline-block; width: 15px; height: 15px; margin-right: 4px; border-radius: 10px; background: ${item};`"
                >
                </span>
                {{ DonughtData.labels[index] }}
              </span>
            </template>
          </div>
          <div class="pl-home-sns-em-txt" v-if="!DonughtData.datasets[0].noData">
            <strong>{{ DonughtEmTxt }}%</strong>
            <span>채팅비율</span>
          </div>
        </div>
        <!-- 오늘의 sns 상담 -->
        <div class="pl-home-sns-info-wrap">
          <div class="pl-home-sns-wrap-title">오늘의 SNS 상담</div>
          <div class="pl-home-sns-info-wrap-detail">
            <strong class="d-flex align-center">{{ DonughtData.toDay }} <sub class="pb-1">건</sub></strong>
            <div
              v-if="parseInt(DonughtData.toDay) != 0"
              class="pl-home-sns-info-wrap-detail-ch">
              <v-icon :class="`pl-icon30 ${ in_ch_icon }`"></v-icon>
              <div>인입이 가장 많은 채널<br/>
                <strong>{{ in_ch }} ({{ in_ch_cnt }}건)</strong>
              </div>
            </div>
            <div
              v-else
              class="pl-home-sns-info-wrap-detail-ch">
              <v-icon class="pl-icon30 no-data"></v-icon>
              <div>오늘 진행한 채팅상담이 없습니다<br/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <v-data-table
        class="pl-grid is-mt-m"
        :headers="headers"
        :items="items"
        fixed-header
        item-key="index"
        height="142px"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
        :page.sync="page"
        no-data-text="등록된 데이터가 없습니다."
        @page-count="pageCount = $event">
        <template v-slot:item.CMPL_RATIO="{ item }">
          <span v-if="parseInt(item.CMPL_RATIO) == 0">
            -
          </span>
          <span v-else>
            {{ item.CMPL_RATIO }} %
          </span>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import chartjsBarChart from "@/components/chartjsBarChart";
import chartjsDoughnutChart from "@/components/chartjsDoughnutChart";

export default {
  name: "MENU_home_sns", //name은 'MENU_' + 파일명 조합
  components: {
    chartjsBarChart,
    chartjsDoughnutChart,
  },
  data() {
    return {
      // donught chart
      // 기본 차트 색상
      COLOR: ['#ffeb3b', '#03c75a', '#FFB72C', '#733A8D', '#4BC8F5'], //카카오톡,네이버톡톡,게시판문의,티톡
      DonughtData: {
        toDay: 0,
        labels: [],
        datasets: [
          {
            backgroundColor: [],
            data: [],
            noData: false,
          }
        ]
      },
      in_ch: '',        //인입이 가장 많은 채널
      in_ch_cnt: 0,     //인입이 가장 많은채널 인입건수
      in_ch_icon: '',   //인입이 가장 많은 채널 아이콘 //mainchat-kakao, mainchat-teletalk, mainchat-talk, is-email
      DonughtOptions: {
        responsive: false,
        maintainAspectRatio: false,
        aspectRatio: 0,
        borderWidth: 0,
        layout: {
          padding: {
            left: 0, // Adjust the left padding to move the chart to the left
            right: 0,
            top: 0,
            bottom: 0
          }
        },
        plugins: {
          legend: {
            display: false,
            position: 'right',
            maxWidth: 100,
            labels: {
              padding: 10,
              usePointStyle: true,
              pointStyle: 'Rounded',
            },
          }
        },
      },
      DonughtEmTxt: 0,

      // grid
      page: 1,
      pageCount: 0,
      ROW_PER_PAGE: -1,
      headers: [
        { text: '채널', value: 'CD_NM', align: 'center', sortable: false },
        { text: '인입', value: 'TOT_CNT', align: 'center', sortable: false , },
        { text: '미할당', value: 'GIVEUP_CNT', align: 'center', sortable: false , },
        { text: '대기중', value: 'WAIT_CNT', align: 'center', sortable: false , },
        { text: '상담중', value: 'ING_CNT', align: 'center', sortable: false , },
        { text: '후처리', value: 'AFTPRCS_CNT', align: 'center', sortable: false , },
        { text: '상담완료', value: 'CMPL_CNT', align: 'center', sortable: false , },
      ],
      items: [],
    }
  },

  watch: {

  },

  computed: {

  },

  created() {
    this.cnsChnSrch();
  },

  mounted() {

  },

  methods: {
    //주간 상담 조회
    async cnsChnSrch(){
      let sUrl = '/chat-api/status/chnnal/sttus/inqire';
      let postParam = {
      }
      let headParam = {
        head : {
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);
      if (!resData.HEADER.ERROR_FLAG){
        this.DonughtData.toDay = 0;
        this.in_ch_cnt = 0;
        let donughtData = {
          toDay: 0,
          labels: [],
          datasets: [
            {
              backgroundColor: [],
              data: [],
              noData: false,
            }
          ]
        };
        let chatCnt = 0;
        let snsCnt = 0;
        for(let k in resData.DATA){
          resData.DATA[k]["GIVEUP_CNT"] = parseInt(resData.DATA[k].TOT_CNT) - parseInt(resData.DATA[k].ALTMNT_CNT);
          resData.DATA[k]["CMPL_RATIO"] =
            resData.DATA[k].TOT_CNT == 0
            ? 0
            : (parseInt(resData.DATA[k].CMPL_CNT) / parseInt(resData.DATA[k].TOT_CNT) * 100).toFixed(2);
          resData.DATA[k]["CMPL_RATIO"] = Math.round(resData.DATA[k]["CMPL_RATIO"] * 100) / 100;    //소수점 뒤 0일때 삭제

          donughtData.toDay = parseInt(donughtData.toDay) + parseInt(resData.DATA[k].TODAY_CNT)
          switch (resData.DATA[k].CD_ID) {
            case 'KAKAO':
              this.COLOR[k] = '#ffeb3b';
              break;
            case 'TTALK':
              this.COLOR[k] = '#733A8D';
              break;
            case 'NTT':
              this.COLOR[k] = '#03c75a';
              break;
            case 'EMAIL':
              this.COLOR[k] = '#FFB72C';
              break;
            case 'BBS':
              this.COLOR[k] = '#4BC8F5';
              break;
          }
          if(k == 0){
            this.in_ch = resData.DATA[k].CD_NM
            this.in_ch_cnt = resData.DATA[k].TODAY_CNT;
            if(resData.DATA[k].CD_ID == 'KAKAO'){
              this.in_ch_icon= 'mainchat-kakao';
            } else if(resData.DATA[k].CD_ID == 'TTALK') {
              this.in_ch_icon= 'mainchat-teletalk';
            } else if(resData.DATA[k].CD_ID == 'NTT') {
              this.in_ch_icon= 'mainchat-ntalk';
            } else if(resData.DATA[k].CD_ID == 'EMAIL') {
              this.in_ch_icon= 'is-email';
            } else if(resData.DATA[k].CD_ID == 'BBS') {
              //게시판상담 아직 결정되지 않음
              this.in_ch_icon= 'is-email';
            } else if(resData.DATA[k].CD_ID == 'TALK') {
              this.in_ch_icon= 'mainchat-talk';
            }
          // } else if(this.in_ch_cnt == parseInt(resData.DATA[k].TODAY_CNT)){
          //   this.in_ch = this.in_ch + ' / ' + resData.DATA[k].CD_NM
          } else if(parseInt(resData.DATA[k].TODAY_CNT) > this.in_ch_cnt){
            this.in_ch = resData.DATA[k].CD_NM;
            if(resData.DATA[k].CD_ID == 'KAKAO'){
              this.in_ch_icon= 'mainchat-kakao';
            } else if(resData.DATA[k].CD_ID == 'TTALK') {
              this.in_ch_icon= 'mainchat-teletalk';
            } else if(resData.DATA[k].CD_ID == 'NTT') {
              this.in_ch_icon= 'mainchat-ntalk';
            } else if(resData.DATA[k].CD_ID == 'EMAIL') {
              this.in_ch_icon= 'is-email';
            } else if(resData.DATA[k].CD_ID == 'BBS') {
              //게시판상담 아직 결정되지 않음
              this.in_ch_icon= 'is-email';
            }  else if(resData.DATA[k].CD_ID == 'TALK') {
              this.in_ch_icon= 'mainchat-talk';
            }
            this.in_ch_cnt = resData.DATA[k].TODAY_CNT;
          }

          donughtData.labels[k] = resData.DATA[k].CD_NM
          donughtData.datasets[0].backgroundColor[k] = this.COLOR[k];
          donughtData.datasets[0].data[k] = parseInt(resData.DATA[k].TOT_CNT);

          if(donughtData.datasets[0].data.length > 0){
            let iCnt = 0;
            donughtData.datasets[0].data.forEach((data, idx) => {
              if(data > 0) iCnt++;
            });

            if(iCnt > 0) donughtData.datasets[0].noData = false;
            else donughtData.datasets[0].noData = true;
          }

          if(resData.DATA[k].CD_VL == 'CHAT'){
            chatCnt = parseInt(chatCnt) + parseInt(resData.DATA[k].TOT_CNT)
          }
          snsCnt = parseInt(snsCnt) + parseInt(resData.DATA[k].TOT_CNT);
        }
        this.DonughtEmTxt = parseInt(snsCnt) == 0 ? 0 : Math.round((parseInt(chatCnt) / parseInt(snsCnt) * 100).toFixed(2) * 100) / 100;
        this.items = resData.DATA;
        this.DonughtData = donughtData;
      }
    }
  },
}
</script>

<style></style>
