<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                구분
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select class="pl-form"
                  v-model="EXL_SE_CD"
                  :items="mixin_common_code_get(this.common_code, 'SUVY_EXL_TRGT_TP', '전체')"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <div class="pl-desc">
                <v-select class="pl-form"
                  v-model="SRCH_TP"
                  :items="mixin_common_code_get(this.common_code, 'SUVY_EXL_SRCH_TP', '전체')"
                />
                <v-text-field class="pl-form"
                  v-model="SRCH_KEYWORD"
                  placeholder="검색어 입력"
                  @keyup.enter="getExclusionTargetList"
                />
              </div>
            </div>
            <v-btn class="pl-btn is-icon"
              @click="getExclusionTargetList"
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
            <v-btn class="pl-btn is-icon is-sub"
              @click="openDetailDialog">
              <span class="pl-icon20 document"></span>
              선택항목 상세
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub"
              @click="openRegDialog">
              <span class="pl-icon20 circle-plus"></span>
              등록
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub"
              @click="deleteCheck">
              <span class="pl-icon20 trash"></span>
              삭제
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
              TypeProp="Download"
              :DataHeaderProp="headers"
              :DataBodyProp="EXCLUSION_TARGET_LIST"
              :FileNameProp="'설문참여_제외자_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
              SheetNameProp="설문참여 제외자"
              HeaderColorProp="00B0F0"
            ></compo-excel>
          </div>
        </div>
        <v-data-table
          class="pl-grid has-control"
          v-model="CHK_ITEMS"
          :headers="headers"
          :items="EXCLUSION_TARGET_LIST"
          item-key="ROW_NUMBER"
          show-select
          :item-class="isActiveRow"
          @click:row="rowSelect"
          @dblclick:row="openDetailDialogDbClick"
          fixed-header
          height="562px"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
          :page.sync="page"
          no-data-text="등록된 데이터가 없습니다."
          @page-count="pageCount = $event">
          <template v-slot:item.CUST_PHN_NO="{ item }">
            {{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(item.CUST_PHN_NO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(item.CUST_PHN_NO.replace(/[^0-9]/g, "")) }}
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

          <span class="pl-pager-period">보기 {{ mixin_getPagePeriod(EXCLUSION_TARGET_LIST, page) }} / {{ EXCLUSION_TARGET_LIST.length }}</span>
        </div>
      </div>
    </div>
    <!-- 설문참여 등록 dialog -->
    <SVY_M700_DLG_DETAIL
      v-if="dialogOpenDetail"
      :DataProp="{'DETAIL_INFO': DETAIL_INFO, 
                  'SUVY_EXL_TRGT_TP_LIST': DETAIL_SUVY_EXL_TRGT_TP_LIST}"
      @reloadParentComp="getExclusionTargetList()"                  
      @closeDialog="closeDetailDialog"
    />

  </div>
</template>

<script>
import SVY_M700_DLG_DETAIL from './SVY_M700_DLG_DETAIL'
  export default {
  name: "MENU_SVY_M0700", //name은 'MENU_' + 파일명 조합
  components: {
    SVY_M700_DLG_DETAIL,
  },
  data() {
    return {
      common_code: [],

      DETAIL_SUVY_EXL_TRGT_TP_LIST : [],

      //검색 조건
      EXL_SE_CD: '',
      SRCH_TP: '',
      SRCH_KEYWORD:'',
      
      //제외 대상자 목록
      EXCLUSION_TARGET_LIST: [],
      //체크박스로 선택된 항목 목록
      CHK_ITEMS:[],
      //선택된 항목
      selectedRow: {},
      //상세 정보
      DETAIL_INFO: {},

      // 등록/상세 다이얼로그 오픈 여부
      dialogOpenDetail: false,

      //페이지 정보
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      }, //그리드 페이지속성정의
      nextDisabled:true,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
      // grid
      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px', sortable: false },
        { text: '구분', value: 'EXL_SE_NM', align: 'center', width: '160px', sortable: false },
        { text: '성명', value: 'CUST_NM', align: 'center', width: '120px',  },
        { text: '전화번호', value: 'CUST_PHN_NO', align: 'center', width: '160px', sortable: false },
        { text: '제외 시작일자', value: 'EXL_BGNG_DT_F', align: 'center', width: '180px', sortable: false },
        { text: '제외 종료일자', value: 'EXL_END_DT_F', align: 'center', width: '180px', sortable: false },
        { text: '등록일', value: 'REG_DT_F', align: 'center', width: '180px', sortable: false },
        { text: '등록자', value: 'RGTR_NM', align: 'center', width: '120px', sortable: false },
      ],
      items: [
        {
          index: 1,
          type1: '설문거부',
          type2: '나상담',
          type3: '000-0000-0000',
          type4: '2024-00-00',
          type5: '2024-00-00',
          type6: '2024-00-00 00:00:00',
          type7: '나관리',
        },
      ],

      MESSAGE: {
        CONFIRM: {
          DEL : {alertDialogToggle: true, msg: '선택한 항목을 삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.deleteExcludeTarget, callNo: this.closeAlert}
        },
        ALERT: {
          SELECT_ITEMS : {alertDialogToggle: true, msg: '항목을 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
          , ONE_SELECT_ITEM : {alertDialogToggle: true, msg: '하나의 항목만 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST : {
          SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 },
        },
      },
      

    }
  },
  watch: {

  },

  computed: {

  },

  async created() {
    let codeName = [
                     'SUVY_EXL_TRGT_TP'      //설문참여자 제외 유형
                    ,'SUVY_EXL_SRCH_TP'      //설문참여자 제외 검색 유형
                  ];
    this.common_code = await this.mixin_common_code_get_all(codeName, 'Y');
    this.DETAIL_SUVY_EXL_TRGT_TP_LIST = this.mixin_common_code_get(this.common_code, 'SUVY_EXL_TRGT_TP');
    await this.getExclusionTargetList();
    
    
  },

  mounted() {
    
  },

  methods: {

    //제외 대상자 목록 조회
    async getExclusionTargetList() {
      const sUrl = '/api/svy/exclusion/selectTargetList';
      const postParam = {
        EXL_SE_CD: this.EXL_SE_CD,
        SRCH_TP: this.SRCH_TP,
        SRCH_KEYWORD: this.SRCH_KEYWORD
      }
      const headParam = {
        head: {
          'ROW_CNT' : this.pagination.rowsPerPage,
          'PAGES_CNT' : this.pagination.page,
          'PAGING' : "Y",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );


      if (!resData.HEADER.ERROR_FLAG) {
        this.EXCLUSION_TARGET_LIST = resData.DATA
      }
    },

    //등록 다이얼로그 오픈
    openRegDialog() {
      this.DETAIL_INFO = {SRVY_EXL_TRGT_ID: ''};
      this.dialogOpenDetail = true;
    },

    //상세 다이얼로그 오픈
    openDetailDialog() {
      if( this.CHK_ITEMS.length < 1 ) {
        this.showAlert(this.MESSAGE.ALERT.SELECT_ITEMS);
        return;
      }
      if( this.CHK_ITEMS.length > 1 ) {
        this.showAlert(this.MESSAGE.ALERT.ONE_SELECT_ITEM);
        return;
      }
      this.DETAIL_INFO = _.cloneDeep(this.CHK_ITEMS[0]);
      this.dialogOpenDetail = true;
    },

    openDetailDialogDbClick() {
      this.DETAIL_INFO = _.cloneDeep(this.selectedRow);
      this.dialogOpenDetail = true;
    },

    closeDetailDialog() {
      this.DETAIL_INFO = {};
      this.dialogOpenDetail = false;
    },

    deleteCheck() {
      if( this.CHK_ITEMS.length < 1 ) {
        this.showAlert(this.MESSAGE.ALERT.SELECT_ITEMS);
        return;
      }
      this.showAlert(this.MESSAGE.CONFIRM.DEL);
    },

    async deleteExcludeTarget() {
      let srvyExlTrgtId = [];
      this.CHK_ITEMS.map(item => {
        srvyExlTrgtId.push({ "SRVY_EXL_TRGT_ID" : item.SRVY_EXL_TRGT_ID});
      });

      const sUrl = '/api/svy/exclusion/deleteTarget';
      const postParam = {
        SRVY_EXL_TRGT_ID: srvyExlTrgtId,
      }
      const headParam = {
        head: {}
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );
      if (!resData.HEADER.ERROR_FLAG) {
        this.closeAlert();
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.getExclusionTargetList();
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