<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                조회 기간
              </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form"
                    :items="mixin_common_code_get(this.COMMON_CODE,'CUST_REG_SCH_TP','전체')"
                    v-model="SCH_CUST_REG_TP"
                ></v-select>
              </div>
              <div class="pl-form-inline">
                <compo-date-range-picker
                    :StartDayProp.sync="SCH_ST_DTS"
                    :EndDayProp.sync="SCH_END_DTS"
                    @startDayChange="mixin_testLog(SCH_ST_DTS)"
                    @endDayChange="mixin_testLog(SCH_END_DTS)"
                />
             </div>
           </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                고객 상태
              </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form"
                    :items="mixin_common_code_get(this.COMMON_CODE,'CUST_ST','전체')"
                    v-model="CHC_CUST_ST"
                ></v-select>
                <!--    item-text="text"
                   item-value="text" -->
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                주의 고객 유형
              </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form"
                    :items="mixin_common_code_get(this.COMMON_CODE,'CAUTION_TP','전체')"
                    v-model="CHC_CAUTION_TP"
                ></v-select>
                <!--    item-text="text"
                   item-value="text" -->
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                <v-select
                    class="pl-form"
                    :items="mixin_common_code_get(this.COMMON_CODE,'CUST_SRCH', '전체')"
                    v-model="CHC_CUST_SRCH"
                ></v-select>
              </span>
              <div class="pl-desc">
                <v-text-field
                    class="pl-form is-lg"
                    placeholder="검색어 입력"
                    v-model="INPT_CUST_SRCH"
                    oninput="javascript: this.value = this.value.replace(/[^a-z|A-Z|0-9|가-힣|ㄱ-ㅎ|ㅏ-ㅣ]/g, '' );"
                    @keyup.enter="getCautionCustList"
                />
              </div>
            </div>
            <v-btn class="pl-btn is-icon"
                   @click="getCautionCustList"
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
              <v-btn v-if="false"
                  class="pl-btn is-icon is-sub"
                     :disabled="true"
                     @click="openDialog">
                <span class="pl-icon20 document"></span>
                선택항목 상세
              </v-btn>

          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ CUST_GRID_ITEMS.length }})</em> 건</span>
          </div>
        </div>
        <v-data-table
            class="pl-grid"
            :headers="CUST_GRID_HEADERS"
            :items="CUST_GRID_ITEMS"
            :item-class="isActiveRow"
            fixed-header
            style="cursor:pointer;"
            item-key="index"
            height="562px"
            :items-per-page="ROW_PER_PAGE"
            hide-default-footer
            :page.sync="page"
            @page-count="pageCount = $event"
            no-data-text="등록된 데이터가 없습니다."
        >
          <template v-slot:item.CUST_NM="{ item }">
            {{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(item.CUST_NM) : item.CUST_NM }}
          </template>
          <template v-slot:item.CUST_PHN_NO="{ item }">
            {{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(item.CUST_PHN_NO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(item.CUST_PHN_NO.replace(/[^0-9]/g, "")) }}
          </template>
          <template v-slot:item.CAUTION_CUST_FNDWAY="{ item }">
            <v-tooltip content-class="pl-tooltip " bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">{{ item.CAUTION_CUST_FNDWAY }}</span>
              </template>
              <span>{{ item.CAUTION_CUST_FNDWAY }}</span>
            </v-tooltip>
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

          <span class="pl-pager-period">보기 {{ mixin_getPagePeriod(CUST_GRID_ITEMS, page) }} / {{
              CUST_GRID_ITEMS.length
            }}
         <compo-tooltip-btn
             TitleProp="다음 검색"
             ClassProp="pl-tooltip-btn is-line"
             IconProp="pl-icon20 arrow-next-paging"
             TooltipPositionProp="bottom"
             @btnClick="getCautionCustList('next')"
             :DisabledProp="nextDisabled"
         ></compo-tooltip-btn>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MENU_STG_M0403", //name은 'MENU_' + 파일명 조합
  components: {},
  data() {
    return {

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15, 30, 50, 100],
      ROW_PER_PAGE: 15,


      /* 공통코드 */
      COMMON_CODE: [],

      /* 콤보박스 선택 아이템 */

      CHC_CUST_ST: '',
      CHC_CAUTION_TP : '',
      CHC_CUST_SRCH: '',
      INPT_CUST_SRCH: '',
      INPT_PHN_NUM: '',

      /* 고객정보 리스트 헤더 */

      CUST_GRID_HEADERS: [
        {text: '번호', value: 'index', align: 'center', width: '50px', sortable: false},
        {text: '고객명', value: 'CUST_NM', width: '100px'},
        {text: '고객 상태', value: 'CUST_STAT', width: '70px', sortable: false},
        {text: '고객 ID', value: 'CUST_ID', width: '80px', sortable: false},
        {text: '고객 전화번호', value: 'CUST_PHN_NO', width: '90px', sortable: false, },
        {text: '주의고객유형', value: 'CAUTION_TP', align: 'center', width: '60px', sortable: false},
        {text: '유효 시작일시', value: 'CAUTION_VLD_BGNG_DT',  width: '100px', sortable: false},
        {text: '유효 종료일시', value: 'CAUTION_VLD_END_DT',  width: '100px', sortable: false},
        {text: '사유', value: 'CAUTION_CUST_FNDWAY', width: '300px', sortable: false},
        {text: '등록자', value: 'CAUTION_CUST_RGTR_NM', width: '90px', sortable: false},
        {text: '등록일시', value: 'CAUTION_CUST_REG_DT', width: '100px', sortable: false},
      ],

      selectedGridItem: [],           // 선택한 고객
      CUST_GRID_ITEMS: [],

      Items: [],

      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      },
      nextDisabled: false,

      MESSAGE: {
        ERROR: {
          ERROR: {
            alertDialogToggle: true,
            msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.',
            iconClass: 'is-caution',
            type: 'default'
          }
        }
      },

      SCH_CUST_REG_TP: '',
      startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      SCH_ST_DTS: '',
      SCH_END_DTS: '',
    }
  },

  watch: {

  },

  computed: {},

  created() {
    this.SCH_ST_DTS = this.$moment(this.startDate).subtract(7,'days').format('YYYY-MM-DD'); // 시작 일자(일주일전)
    this.SCH_END_DTS = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); // 종료 일자
  },

  async mounted() {

    /* 공통코드설정 */

    let codeName = ['CUST_ST'                   // 고객 상태
      , 'CUST_TP'                   // 고객 유형
      , 'CUST_DV'                   // 고객 구분
      , 'CUST_SRCH'                 // 고객 검색조건
      , 'CUST_REG_SCH_TP'           // 고객 등록 일자 검색조건
      , 'CAUTION_TP'                // 주의 고객 여부
    ];

    this.COMMON_CODE = await this.mixin_common_code_get_all(codeName);

    this.getCautionCustList();
  },

  methods: {
    /**************************************
            주의고객 리스트 가져오기
     **************************************/

      async getCautionCustList(next) {
        if (this.mixin_isEmpty(next) || next !== 'next') {
          this.CUST_GRID_ITEMS = [];
          this.pagination.page = 1; //페이징 처리 초기화
          this.nextDisabled = true;  //버튼 비활성화
        }

        let sUrl = '/api/setting/customer/cautionInfo/selectCautionCustList';

        let postParam = {
          SCH_CUST_STAT: this.CHC_CUST_ST === '전체' ? '' : this.CHC_CUST_ST,
          SCH_CAUTION_CUST_TP: this.CHC_CAUTION_TP === '전체' ? '' : this.CHC_CAUTION_TP,
          SCH_GB: this.CHC_CUST_SRCH,
          SCH_KEYWORD: this.INPT_CUST_SRCH.replace(/-/g, ''),
          SCH_CUST_REG_TP : this.SCH_CUST_REG_TP,
          SCH_ST_DTS : this.SCH_ST_DTS.replace(/-/gi, ''),
          SCH_END_DTS : this.SCH_END_DTS.replace(/-/gi, '')
        };

        let headParam = {
          head: {
            "ROW_CNT": this.pagination.rowsPerPage,
            "PAGES_CNT": this.pagination.page,
            "PAGING": "Y",
          }
        }
        this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
        let response = await this.common_postCall(sUrl, postParam, headParam);

        let idx = this.CUST_GRID_ITEMS.length + 1;
        if (!response.HEADER.ERROR_FLAG) {
          let tempDataText = response.DATA;

          for (let i in tempDataText) {
            tempDataText[i]["index"] = idx++;
            tempDataText[i].CUST_PHN_NO = this.mixin_setPhoneNo(tempDataText[i].CUST_PHN_NO);
            tempDataText[i].CAUTION_VLD_BGNG_DT = this.mixin_convertDate(tempDataText[i].CAUTION_VLD_BGNG_DT, 'yyyy-MM-dd HH:mm:ss');
            tempDataText[i].CAUTION_VLD_END_DT = this.mixin_convertDate(tempDataText[i].CAUTION_VLD_END_DT, 'yyyy-MM-dd HH:mm:ss');
            tempDataText[i].CAUTION_CUST_REG_DT = this.mixin_convertDate(tempDataText[i].CAUTION_CUST_REG_DT, 'yyyy-MM-dd HH:mm:ss');
          }

          this.CUST_GRID_ITEMS = [...this.CUST_GRID_ITEMS, ...tempDataText]

          if (response.HEADER.next !== null && response.HEADER.next !== undefined) {
            if (response.HEADER.next === true) {
              this.nextDisabled = false //버튼 활성화
            } else {
              this.nextDisabled = true  //버튼 비활성화
            }
          }
          //이부분은 체크해볼것
          this.pagination.page += 1
        }
      },
      rowClick(item) {
        this.selectedGridItem = item;
      },
      isActiveRow(item) {
        const activeClass = item === this.selectedGridItem ? "active" : "";
        return activeClass;
      },

    },

}
</script>

<style lang="scss" scoped>

</style>