<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                조회 기간
              </span>
              <div class="pl-desc">
                <compo-date-range-picker
                    :StartDayProp.sync="SCH_BGNG_DT"
                    :EndDayProp.sync="SCH_END_DT"
                    @startDayChange="mixin_testLog(SCH_BGNG_DT)"
                    @endDayChange="mixin_testLog(SCH_END_DT)"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                로그 구분
              </span>
              <div class="pl-desc">
                <v-select
                  v-model="SE_CD"
                  class="pl-form"
                  :items="SCH_SE_LIST"
                  item-text="SE_NM"
                  item-value="SE_CD"
                  placeholder="선택하세요"
                />
              </div>
            </div>
            
            <div class="pl-form-inline">
              <span class="pl-label">
                작업자
              </span>
              <div class="pl-desc">
                <v-text-field
                v-model="RGTR_NM"
                class="pl-form "
                placeholder="검색어 입력"
                @keyup.enter="getSysLogList('')"
                />
              </div>
            </div>
            <v-btn
              class="pl-btn is-icon"
              @click="getSysLogList('')"
              >
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body">
          <div class="pl-grid-top">
            <div class="pl-grid-top-left">
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
              <!-- 엑셀 다운로드 버튼 -->
                <compo-excel
                  TypeProp="Download"
                  :DataHeaderProp="headers"
                  :DataBodyProp="items"
                  :FileNameProp="'시스템 로그 조회_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                  SheetNameProp="시스템 로그"
                  HeaderColorProp="00B0F0"
                ></compo-excel>
            </div>
          </div>
          <v-data-table
            class="pl-grid"
            :headers="headers"
            :items="items"
            single-select
            fixed-header
            item-key="ROW_NUMBER"
            height="562px"
            :items-per-page="ROW_PER_PAGE"
            hide-default-footer
            :page.sync="page"
            @click:row="rowSelect"
            :item-class="isActiveRow"
            @page-count="pageCount = $event"
            no-data-text="등록된 데이터가 없습니다."
            >
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

            <span class="pl-pager-period">
              보기 {{ mixin_getPagePeriod(items, page) }} / {{ items.length }}
                <compo-tooltip-btn
                  TitleProp="다음 검색"
                  ClassProp="pl-tooltip-btn is-line"
                  IconProp="pl-icon20 arrow-next-paging"
                  TooltipPositionProp="bottom"
                  :DisabledProp = "nextDisabled"
                  @btnClick="getSysLogList('next')"
                ></compo-tooltip-btn>
            </span>
          </div>
      </div>
    </div>
 </div>
</template>

<script>
export default {
   name:"MENU_STG_M0611", //시스템 로그 - name은 'MENU_' + 파일명 조합

components: {

 },
data() {
  return {

    // top search
    startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    endDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

    //로그 구분 목록
    SCH_SE_LIST: [],

    selectedRow : {},

    //검색
    SCH_BGNG_DT : '', //접근 일시 시작 일자
    SCH_END_DT : '', //접근 일시 종료 일자
    SE_CD : '', //로그 구분
    RGTR_NM : '', //작업자

    // grid
    page: 1,
    pageCount: 0,
    perPage: [15,30,50,100],
    ROW_PER_PAGE: 15,
    pagination: {
      page: 1,
      rowsPerPage: 500,
      sortBy: "REG_DT",
      descending: "DESC"
    }, //그리드 페이지속성정의
    nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
    headers: [
      { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '60px', sortable : false },
      { text: '로그 구분', value: 'SE_NM', align: 'left', width: '140px' ,sortable : false},
      { text: '메뉴 경로', value: 'CNTN_MENU_PATH', align: 'left', width: '150px',sortable : false },
      { text: '작업 IP', value: 'CNTN_IP', align: 'left', width: '140px',sortable : false },
      { text: '작업자', value: 'RGTR_NM', align: 'center', width: '140px' ,sortable : false},
      { text: '작업 일시', value: 'REG_DT_F', align: 'center', width: '150px' ,sortable : false},
      
    ],
    items: [],

  }
 },

  watch: {

  },

  computed: {
  },

  beforeDestroy(){
  },

  async created() {
    await this.getSeList();
    this.SCH_BGNG_DT = this.$moment(this.startDate).subtract(7,'days').format('YYYY-MM-DD'); // 시작 일자(일주일전)
    this.SCH_END_DT = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); // 종료 일자

    this.getSysLogList('');//개인정보 조회 이력 목록
  },

  mounted() {

  },

  methods: {
    //로그 구분 목록
    async getSeList() {
      let sUrl = '/api/common/log/selectSeList';
      let postParam = {
      }
      let headParam = {
        head : {}
      }
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.SCH_SE_LIST = [];
        this.SCH_SE_LIST.push({SE_CD: '', SE_NM: '전체'})
        this.SCH_SE_LIST.push(...response.DATA);
      }
    },

    //시스템 로그 목록 조회
    async getSysLogList(next) {
      this.selectedRow = {};
      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.items = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let sUrl = '/api/common/log/selectSysLogList';
      let postParam = {
        SCH_BGNG_DT : this.SCH_BGNG_DT.replace(/-/gi, '')
        , SCH_END_DT : this.SCH_END_DT.replace(/-/gi, '')
        , SE_CD : this.SE_CD
        , RGTR_NM : this.RGTR_NM
      }

      let headParam = {
        head : {
          ROW_CNT : this.pagination.rowsPerPage,
          PAGES_CNT : this.pagination.page,
          PAGING : "Y",
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {

        this.items = response.DATA;
        
        //다음
        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }

        this.pagination.page += 1;
      }
    },

    //row 선택
    rowSelect(item) {
      this.selectedRow = item;
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },
  },
}
</script>

<style lang="scss" scoped>

</style>