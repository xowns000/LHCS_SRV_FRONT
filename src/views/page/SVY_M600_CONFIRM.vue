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
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">진행 상태</span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    :items="mixin_common_code_get(this.common_code, 'PROG_ST', '전체')"
                    placeholder="선택하세요"
                    v-model="STTS_CD"
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
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">설문조사 명</span>
                <div class="pl-desc">
                  <v-text-field 
                    class="pl-form is-lg" 
                    v-model="SRVY_NM" 
                    @keyup.enter="btnSelectList(false)"
                    placeholder="검색어 입력"></v-text-field>
                </div>
              </div>
              <v-btn class="pl-btn is-icon" @click="btnSelectList(false)">
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
              <span class="pl-counter">전체 <em class="pl-1">({{ gridTotalCnt }})</em> 건</span>
              <!-- 엑셀 다운로드 버튼 -->
              <compo-excel
                TypeProp="Download"
                :DataHeaderProp="gridDataHeaders"
                :DataBodyProp="gridDataText"
                :FileNameProp="'설문조사_승인통계_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                SheetNameProp="설문참여 승인통계"
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
            :item-class="isActiveRow"
            @click:row="selcetList"
            :page.sync="page"
            @page-count="pageCount = $event">
            <!-- 설문조사명 -->
            <template v-slot:item.SRVY_NM="{ item }">
              <v-tooltip content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on">{{ item.SRVY_NM }}</span>
                </template>
                <span>{{ item.SRVY_NM }}</span>
              </v-tooltip>
            </template>
            <!-- 계획구분 -->
            <template v-slot:item.SRVY_SE_NM="{ item }">
              <v-tooltip content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on">{{ item.SRVY_SE_NM }}</span>
                </template>
                <span>{{ item.SRVY_SE_NM }}</span>
              </v-tooltip>
            </template>
            <!-- 진행상태 -->
            <template v-slot:item.STTS_NM="{ item }" >
              <span
                class="pl-round-chip is-sm"
                :style="`background-color: ${mixin_displayStatus(item.STTS_CD, `statList`)}`"
              >
                {{ item.STTS_NM }}
              </span>
            </template>
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
    <div class="is-col-fix is-vrt" style="width: 410px">
      <div class="pl-card" >
        <h2 class="pl-subtit">진행상태 상세 보기</h2>
      </div>
      <div class="pl-card is-noborder" style="overflow-y: scroll; height: calc(100vh - 290px);">
        <div class="pl-stat-list">
          <div
            v-for="item in HISTORY_LIST"
            :key="item.id"
            class="pl-stat-list-unit"
            >
            <div class="pl-stat-list-index">
              <span
                class="pl-round-chip is-sm"
                :style="`background-color: ${mixin_displayStatus(item.STTS_CD, `statList`)}`"
              >
                {{ item.STTS_NM }}
              </span>
              <strong class="ml-2">{{ item.RGTR_NM }}</strong>
              ({{ item.REG_DT_F }})
            </div>
            <p v-if="item.CN" v-html="mixin_encodeEnter(item.CN)" class="pl-stat-list-desc"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SVY_M600_CONFIRM',
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

        //el v-model 변수
        SRVY_YR: '',
        SRVY_SE_CD: '',
        STTS_CD: '',
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

        gridTotalCnt: 0,
        gridDataHeaders: [
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px', sortable: false },
          { text: '진행년도', value: 'SRVY_YR_NM', align: 'center', width: '90px' , sortable: false},
          { text: '설문조사 명', value: 'SRVY_NM', align: 'left', sortable: false},
          { text: '설문시작일', value: 'SRVY_BGNG_DT', align: 'center', width: '100px' , sortable: false},
          { text: '설문종료일', value: 'SRVY_END_DT', align: 'center', width: '100px' , sortable: false},
          { text: '계획구분', value: 'SRVY_SE_NM', align: 'center', width: '100px' , sortable: false},
          { text: '목표인원', value: 'GOAL_PSNAL', align: 'center', width: '100px' , sortable: false},
          { text: '진행상태', value: 'STTS_NM', align: 'center', width: '100px' , sortable: false},
          { text: '등록자', value: 'RGTR_ID', align: 'center', width: '80px' , sortable: false},
          { text: '등록일', value: 'REG_DT', align: 'center', width: '100px' , sortable: false},
          { text: '처리자', value: 'PRCS_NM', align: 'center', width: '80px' , sortable: false},
          { text: '처리일', value: 'PRCS_DT', align: 'center', width: '100px' , sortable: false},
        ],
        gridDataText: [],
        // status return
        statList: [
          { name: 'PRPARG', value: '#FFA51F' },//준비중
          { name: 'RDY', value: '#FFA51F' },//승인대기
          { name: 'RFSL', value: '#FFA51F' },//승인반려
          { name: 'RTRVL', value: '#FFA51F' },//승인회수
          { name: 'APPR', value: '#4bb94a' },//승인완료
          { name: 'PUBCMP', value: '#41a3db' },//게시완료
          { name: 'ONGONG', value: '#41a3db' },//진행중
          { name: 'TERMIAT', value: '#7693e0' },//종료
        ],

        // 진행상태 상세 보기
        HISTORY_LIST: [],
        PRORGESS_LIST: [
          {
            status: '종료',
            manager: '나상담',
            date: '2024-01-28 18:00:00'
          },
          { status: '진행중', manager: '관리자', date: '2024-01-28 18:00:00' },
          { status: '게시완료', manager: '나상담', date: '2024-01-28 18:00:00', desc: '설문지 6번 문항 수정되었습니다. 승인 요청드립니다.' },
          { status: '승인완료', manager: '관리자', date: '2024-01-28 18:00:00' },
          { status: '승인대기', manager: '나상담', date: '2024-01-28 18:00:00' },
          { status: '승인회수', manager: '관리자', date: '2024-01-28 18:00:00', desc: '설문지 6번 문항 수정되었습니다. 승인 요청드립니다.'  },
          { status: '준비중', manager: '나상담', date: '2024-01-28 18:00:00' },
          { status: '승인완료', manager: '관리자', date: '2024-01-28 18:00:00' },
        ],
        selectedRow: null,

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
    },

    mounted() {
      this.btnSelectList(false);
    },

    beforeDestroy() {
    },
    methods: {
      init() {
        this.selectedRow = null;
        this.HISTORY_LIST = [];
      },
      //조회
      async btnSelectList(next){
        this.init();
        //다음버튼 클릭 유무
        if (!next){
          this.gridDataText = [];
          this.gridSelectedData = [];
          this.pagination.page = 1; //페이징 처리 초기화
          this.nextDisabled = true;
          this.gridTotalCnt = 0;
        }

        const sUrl = '/api/svy/plan/selectlistplan';
        const postParam = {
          SRVY_YR : this.SRVY_YR            // 설문_연도
          ,SRVY_SE_CD : this.SRVY_SE_CD     // 설문_구분_코드
          ,STTS_CD : this.STTS_CD           // 진행_상태_코드
          ,SRVY_NM : this.SRVY_NM           // 설문_명
        }
        const headParam = {
          head: {
            'ROW_CNT' : this.pagination.rowsPerPage,
            'PAGES_CNT' : this.pagination.page,
            'PAGING' : "Y",
          }
        }

        let resData = await this.common_postCall(sUrl, postParam, headParam );

        if (!resData.HEADER.ERROR_FLAG){
          if(resData.DATA.length > 0){
            resData.DATA.forEach((data, idx) => {
              data.SRVY_BGNG_DT = data.SRVY_BGNG_DT.indexOf('-')>-1?data.SRVY_BGNG_DT:this.mixin_convertDate(data.SRVY_BGNG_DT, 'yyyy-MM-dd');
              data.SRVY_END_DT = data.SRVY_END_DT.indexOf('-')>-1?data.SRVY_END_DT:this.mixin_convertDate(data.SRVY_END_DT, 'yyyy-MM-dd');
              data.PRCS_DT = data.PRCS_DT.indexOf('-')>-1?data.PRCS_DT:this.mixin_convertDate(data.PRCS_DT, 'yyyy-MM-dd');
              data.REG_DT = data.REG_DT.indexOf('-')>-1?data.REG_DT:this.mixin_convertDate(data.REG_DT, 'yyyy-MM-dd HH:mm:ss');
            });
          }

          let tempDataText = resData.DATA;
          let idx = this.gridDataText.length + 1;
          for(let i in tempDataText){
            tempDataText[i]["index"]= idx++;
            tempDataText[i]["SRVY_NM"]=this.mixin_decode(tempDataText[i]["SRVY_NM"]) ;
            tempDataText[i]["SRVY_EXPLN"]=this.mixin_decode(tempDataText[i]["SRVY_EXPLN"]) ;
          }
          this.gridDataText = [...this.gridDataText, ...tempDataText]
          if(resData.HEADER.next !== null && resData.HEADER.next !== undefined){
            if(resData.HEADER.next === true){
              this.nextDisabled = false //버튼 활성화
            }else{
              this.nextDisabled = true  //버튼 비활성화
            }
          }
          if(this.gridDataText.length > 0) this.gridTotalCnt = resData.DATA[0].TWB_PAGING_TOT_COUNT;


          //이부분은 체크해볼것
          this.pagination.page += 1
          // this.page=1;
        }
      },

      // 그리드 click
      selcetList(item){
        this.selectedRow = item;
        this.getSttsHistory();
      },
      isActiveRow(item) {
        const activeClass = item === this.selectedRow ? "active" : "";
        return activeClass;
      },

      async getSttsHistory() {
        let sUrl = '/api/svy/plan/selectSttsHistory';
        let postParam = {
          SRVY_ID : this.selectedRow.SRVY_ID
        };

        let headParam = {
          head : {}
        };
        let response  = await this.common_postCall(sUrl, postParam, headParam);
        if (!response.HEADER.ERROR_FLAG){
          this.HISTORY_LIST = response.DATA;
        }
      },
    }

  }
</script>

<style lang="scss" scoped>

</style>