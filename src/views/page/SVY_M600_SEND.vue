<template>
  <div class="pl-cols" style="height: 100%">
    <div class="is-vrt" >
      <div >
        <!-- 검색 조건 -->
        <div class="pl-card">
          <div class="pl-search-form pb-0">
            <div class="pl-form-inline-wrap">
              <div class="pl-form-inline">
                <span class="pl-label">
                  진행 년도
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    :items="srvyYrItems"
                    v-model="SRVY_YR"
                    placeholder="선택하세요"
                    @change="getSrvyNm"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">발송 유형</span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    :items="sndngSeCdItems"
                    placeholder="선택하세요"
                    v-model="SNDNG_SE_CD"
                    @change="search()"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">계획 구분</span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    :items="mixin_common_code_get(this.common_code, 'SUVY_CL', '전체')"
                    placeholder="선택하세요"
                    v-model="SRVY_SE_CD"
                    @change="getSrvyNm"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">설문조사 명</span>
                <div class="pl-desc">
                  <v-select class="pl-form is-auto"
                    :items="srvyNmItems"
                    v-model="SRVY_ID"
                    @change="search()"
                    placeholder="선택하세요">
                  </v-select>
                </div>
              </div>
              <v-btn class="pl-btn is-icon" @click="search()">
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
            </div>
          </div>
        </div>
        <!-- grid -->
        <div class="pl-card">
          <div class="pl-grid-top">
            <div class="pl-grid-top-left">
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1">({{ gridDataText.length }})</em> 건</span>
              <!-- 엑셀 다운로드 버튼 -->
              <compo-excel
                TypeProp="Download"
                :DataHeaderProp="gridDataHeaders"
                :DataBodyProp="gridDataText"
                :FileNameProp="'설문조사_발송통계_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                SheetNameProp="설문참여 발송통계"
                HeaderColorProp="00B0F0"
              ></compo-excel>
            </div>
          </div>
          <v-data-table
            class="pl-grid"
            :headers="gridDataHeaders"
            :items="gridDataText"
            single-select
            fixed-header
            item-key="index"
            height="510px"
            :items-per-page="ROW_PER_PAGE"
            hide-default-footer
            :page.sync="page"
            @page-count="pageCount = $event">
          </v-data-table>
          <div class="pl-pager">
            <div class="pl-pager-row">
              <span>페이지당 항목 수</span>
              <v-select
                class="pl-form"
                :value="ROW_PER_PAGE"
                :items="perPage"
                :item-text="toString(ROW_PER_PAGE)"
                @change="ROW_PER_PAGE = parseInt($event, 10);"
              ></v-select>
            </div>
            <v-pagination
              v-model="page"
              :length="pageCount"
              circle
              :total-visible="7">
            </v-pagination>

            <!-- 더보기 다음 있을때만 노출 -->
            <span class="pl-pager-period">
              보기 {{ mixin_getPagePeriod(gridDataText, page) }} / {{ gridDataText.length }}
              <compo-tooltip-btn
                TitleProp="다음 검색"
                ClassProp="pl-tooltip-btn is-line"
                IconProp="pl-icon20 arrow-next-paging"
                TooltipPositionProp="bottom"
              ></compo-tooltip-btn>
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- 차트 -->
    <div class="is-col-fix is-vrt" style="width: 410px">
      <div class="pl-card" >
        <h2 class="pl-subtit">발송 유형별 현황</h2>
        <div class="is-mt-m" >
          <chartjsDoughnutChart
            class="is-mt-m h250 px-4"
            :chartData="sendTypeStatChart"
            :chartOptions="DonughtOptions"
            :styles="{ background: '#fff' }"
          ></chartjsDoughnutChart>
        </div>
        <h2 class="pl-subtit is-mt-l">참여율(%) 현황</h2>
        <div class="is-mt-m" >
          <chartjsBarChart
            class="is-mt-m h250 px-4"
            :chartData="rspnsRateStatChart"
            :chartOptions="BarOptions"
            :styles="{ background: '#fff' }"
          ></chartjsBarChart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chartjsDoughnutChart from "@/components/chartjsDoughnutChart";
import chartjsBarChart from "@/components/chartjsBarChart";

  export default {
    name: 'SVY_M600_SEND',
    components: {
      chartjsBarChart,
      chartjsDoughnutChart
    },
    props: {
      DataProp: {
        type: Object,
        default: () => {
          return {}
        }
      },
      COMMON_CODE: {
        type: Array,
        default: () => {
          return []
        }
      },
      SRVY_YEAR_ITEMS: {
        type: Array,
        default: () => {
          return []
        }
      },
    },
    data() {
      return {
        //공통코드
        common_code: [],
        //진행년도
        srvyYrItems: [],
        sndngSeCdItems: [
          { text: "전체", value: ''},
          { text: "문자", value: 'SMS'},
          { text: "알림톡", value: 'ATALK'},
          { text: "이메일", value: 'EMAIL'},
        ],
        srvyNmItems: [],

        //선택된 설문조사_ID
        SRVY_ID: '',

        //el v-model 변수
        SRVY_YR: '',
        SRVY_SE_CD: '',
        SNDNG_SE_CD : '',
        SRVY_NM: '',

        // grid
        pagination: {
          page: 1,
          rowsPerPage: 500,
          sortBy: "",
          descending: ""
        },
        page: 1,
        pageCount: 0,
        perPage: [15,30,50,100],
        ROW_PER_PAGE: 15,
        gridDataHeaders: [
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px', sortable: false },
          { text: '성명', value: 'CUST_NM', align: 'center', width: '180px' , sortable: false},
          { text: '전화번호', value: 'CUST_PHN_NO', align: 'center', width: '180px', sortable: false},
          { text: '이메일', value: 'EML', align: 'center', width: '180px' , sortable: false},
          { text: '발송유형', value: 'SNDNG_SE_NM', align: 'center', width: '120px' , sortable: false},
          { text: '메시지 발송 일자', value: 'SNDNG_DT', align: 'center', width: '180px' , sortable: false},
        ],
        gridDataText:[],
        

        // 발송 유형별 현황 차트
        noDataChart: {
          labels: ['문자', '알림톡', '이메일'],
          datasets: [
            {
              backgroundColor: ['#1dcfbf', '#f9e200', '#f26161'],
              data: [0,0,0],
              noData: true
            }
          ]
        },
        sendTypeStatChart: {},
        rsnpnsRateData: [],
        rspnsRateStatChart: {},
        DonughtData: {
          labels: ['문자', '알림톡', '이메일', ],
          datasets: [
            {
              backgroundColor: ['#1dcfbf', '#f9e200', '#f26161'],
              data: [38, 33,29],
              noData: false
            }
          ]
        },
        DonughtOptions: {
          responsive: true,
          maintainAspectRatio: false,
          borderWidth: 0,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                padding: 20,
                boxWidth: 10,
                usePointStyle: true,
                pointStyle: 'Rounded',
              },
            }
          },
        },

        // 참여율 현황 차트
        BarData: {
          labels: ['문자', '알림톡', '이메일'],
          datasets: [
            {
              backgroundColor: ['#4786E3', '#4786E3', '#4786E3'],
              data: [73, 65, 56],
              noData: false
            },
          ],
        },
        BarOptions: {
          responsive: true,
          maintainAspectRatio: false,
          borderRadius: 8,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (item) => {
                  return [`${item.formattedValue}%`,`${item.dataIndex == 0 ? this.rsnpnsRateData.RSPNS_COUNT : this.rsnpnsRateData.NOT_RSPNS_COUNT}명`]
                }
              },
            },
          },
        },

      }
    },
    watch: {
    },

    computed: {
    },
    async created() {
      //공통코드
      this.common_code = this.COMMON_CODE;
      //진행년도
      this.srvyYrItems = this.SRVY_YEAR_ITEMS;

      //el v-model 변수
      this.SRVY_YR = this.DataProp.SRVY_YR;
      this.SRVY_SE_CD = this.DataProp.SRVY_SE_CD;
      this.STTS_CD = this.DataProp.STTS_CD;
      this.SRVY_NM = this.DataProp.SRVY_NM;

      this.sendTypeStatChart = this.noDataChart;
      this.rspnsRateStatChart = this.noDataChart;

      this.getSrvyNm();
    },
    mounted() {
      //this.btnSelectList(false);
    },

    beforeDestroy() {
    },
    methods: {

      //설문명 콤보박스 조회
      async getSrvyNm() {
        const sUrl = '/api/svy/makeitems/selectcombomakeitems';
        const postParam = {
          SRVY_YR : this.SRVY_YR             //진행년도
          ,SRVY_SE_CD : this.SRVY_SE_CD      //계획구분
        }
        const headParam = {
          head: {}
        }

        let resData = await this.common_postCall(sUrl, postParam, headParam );
        if (!resData.HEADER.ERROR_FLAG)  {
          this.SRVY_ID = '';
          this.srvyNmItems = resData.DATA.map(item => ({ text: this.mixin_decode(item.TEXT), value: item.VALUE }));
          if (this.srvyNmItems.length > 0) this.SRVY_ID = this.mixin_decode(resData.DATA[0].VALUE);
        }
        if(!this.mixin_isEmpty(this.SRVY_ID)) this.search();
      },

      async search() {
        await this.getTargetList();
        await this.getSendTypeStat();
        await this.getRspnsStat();

      },


      async getTargetList() {
        const sUrl = '/api/svy/stat/selectSendList';
        const postParam = {
          SRVY_ID : this.SRVY_ID,             //설문조사 id
          SNDNG_SE_CD: this.SNDNG_SE_CD
        }
        const headParam = {
          head: {
            'ROW_CNT' : this.pagination.rowsPerPage,
            'PAGES_CNT' : this.pagination.page,
            'PAGING' : 'Y',
          }
        }

        let resData = await this.common_postCall(sUrl, postParam, headParam );
        if (!resData.HEADER.ERROR_FLAG) {
          resData.DATA.forEach((data, idx) => {
            data.CUST_PHN_NO = this.mixin_setPhoneNo(data.CUST_PHN_NO.replace(/[^0-9]/g, ""));
            data.SNDNG_DT = this.mixin_convertDate(data.SNDNG_DT, 'yyyy-MM-dd HH:mm:ss')

          });
          this.gridDataText = resData.DATA;
          let leng = this.gridDataText.length;
          for(let i=0;i<leng;i++){
            if(this.gridDataText[i].SNDNG_SE_CD == 'ATALK'){
              this.gridDataText[i]["SNDNG_SE_NM"] = '알림톡'
            } else if(this.gridDataText[i].SNDNG_SE_CD == 'SMS') {
              this.gridDataText[i]["SNDNG_SE_NM"] = '문자'
            } else if(this.gridDataText[i].SNDNG_SE_CD == 'EMAIL') {
              this.gridDataText[i]["SNDNG_SE_NM"] = '이메일'
            }
          }
        }
      },

      async getSendTypeStat() {
        const sUrl = '/api/svy/stat/selectSendTypeStat';
        const postParam = {
          SRVY_ID : this.SRVY_ID,             //설문조사 id
        }
        const headParam = {
          head: {}
        }

        let resData = await this.common_postCall(sUrl, postParam, headParam );
        if (!resData.HEADER.ERROR_FLAG) {
          resData.DATA.forEach((data, idx) => {
            data.SNDNG_SE_NM = this.sndngSeCdItems.find(seCd => {
              return seCd.value == data.SNDNG_SE_CD
            }).text;
          });

          if(resData.DATA.length == 0) {
            this.sendTypeStatChart = this.noDataChart;
          } else {
            let labels = [];
            let data = [];
            let color = [];
            resData.DATA.map(item => {
              labels.push(item.SNDNG_SE_NM)
              data.push(item.SEND_COUNT)
              color.push(item.COLOR)
            })
            
            this.sendTypeStatChart = {
              labels: labels,
              datasets: [
                {
                  backgroundColor: color,
                  data: data,
                  noData: false
                }
              ]
            }
          }
          
        }
      },


      async getRspnsStat() {
        const sUrl = '/api/svy/stat/selectRspnsStat';
        const postParam = {
          SRVY_ID : this.SRVY_ID,             //설문조사 id
        }
        const headParam = {
          head: {}
        }

        let resData = await this.common_postCall(sUrl, postParam, headParam );
        if (!resData.HEADER.ERROR_FLAG) {
          
          if(resData.DATA.length == 0 || resData.DATA[0].TOT_COUNT == 0) {
            this.rspnsRateStatChart = this.noDataChart;
          } else {
            this.rsnpnsRateData = resData.DATA[0];
            let labels = ['참여','미참여'];
            let data = [this.rsnpnsRateData.RSPNS_RATE, this.rsnpnsRateData.NOT_RSPNS_RATE];
            let color = ['#4786E3', '#4786E3'];
            
            this.rspnsRateStatChart = {
              labels: labels,
              datasets: [
                {
                  backgroundColor: color,
                  data: data,
                  noData: false
                }
              ]
            }
          }
          
        }
      }
    }

  }
</script>

<style lang="scss" scoped>

</style>