<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                센터구분
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="DEPT_LIST"
                  placeholder="선택하세요"
                  v-model="DEPT_ID"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                제외조건 구분
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="this.mixin_common_code_get(this.common_code, 'EXL_COND_TY', '전체')"
                  placeholder="선택하세요"
                  v-model="EXL_COND_SE_CD"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                제외조건
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="this.mixin_common_code_get(this.common_code, 'EXL_COND', '전체')"
                  placeholder="선택하세요"
                  v-model="EXL_COND_CD"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                제외조건 값
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form is-lg"
                  placeholder="검색어 입력"
                  v-model="EXL_COND_CN"
                  @keydown.enter="getGridList(false)"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                사용여부
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form "
                  :items="USE_WT"
                  v-model="USE_YN"
                  placeholder="선택하세요"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                삭제여부
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form "
                  :items="USE_WT"
                  v-model="DEL_YN"
                  placeholder="선택하세요"
                ></v-select>
              </div>
            </div>
            <v-btn class="pl-btn is-icon" @click="getGridList(false)">
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
            <v-btn class="pl-btn is-icon is-sub" @click="mixin_showDialog('RegExlCond')" :disabled="selectedRow.ROW_NUMBER != undefined ? false : true">
              <span class="pl-icon20 document"></span>
              선택항목 상세
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub" @click="regBtn">
              <span class="pl-icon20 circle-plus"></span>
              등록
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub" @click="deleteBtn" :disabled="selectedData.length != 0 ? false : true">
              <span class="pl-icon20 trash"></span>
              삭제
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ gridTotalCnt }})</em> 건</span>
          </div>
        </div>
        <v-data-table
          class="pl-grid has-control"
          style="cursor:pointer;"
          show-select
          :headers="gridDataHeaders"
          :items="gridItems"
          fixed-header
          item-key="ROW_NUMBER"
          height="562px"
          :items-per-page="ROW_PER_PAGE"
          :item-class="isActiveRow"
          hide-default-footer
          :page.sync="page"
          @page-count="pageCount = $event"
          @click:row="rowSelect"
          @dblclick:row="mixin_showDialog('RegExlCond')"
          v-model="selectedData"
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
            보기 {{ mixin_getPagePeriod(gridItems, page) }} / {{ gridItems.length }}
            <compo-tooltip-btn
              TitleProp="다음 검색"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 arrow-next-paging"
              TooltipPositionProp="bottom"
              :DisabledProp = "nextDisabled"
              @btnClick="getGridList(true)"
            ></compo-tooltip-btn>
          </span>
        </div>
      </div>
    </div>

    <!-- dialog -->
    <v-dialog
      v-model="dialogRegExlCond"
      content-class="dialog-draggable"
      hide-overlay
      :retain-focus="false">
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :headerTitle="SRVY_EXL_COND_ID=='' ? '제외조건 등록' : '제외조건 수정'"
        @hide="mixin_hideDialog('RegExlCond')">
        <template slot="body">
          <v-form ref="form">
            <div class="pl-form-inline-wrap vertical mt-2">
              <div class="pl-form-inline">
                <span class="pl-label">
                  게시 유형
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <!-- <v-select
                    class="pl-form"
                    :items="this.mixin_common_code_get(this.common_code, 'BORD_TP')"
                    placeholder="선택하세요"
                    v-model="digParams.BOARD_TP"
                    :rules="detailValidateRules.DATA_TYPE_CD"
                  ></v-select> -->
                </div>
              </div>
            </div>
          </v-form>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('RegExlCond')">닫기</v-btn>
          <v-btn class="pl-btn" @click="exlCondValidate">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
export default {
    name:"MENU_SVY_M0002", //name은 'MENU_' + 파일명 조합

 components: {
   
  },
 data() {
    return {
      common_code: [],

      DEPT_LIST:[],
      DEPT_ID:'',
      EXL_COND:'',
      EXL_COND_TY:'', 
      USE_YN:'Y',
      DEL_YN:'N',

      selectedRow: {},
      SRVY_EXL_COND_ID:'',

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
      selectedData: [],      // 그리드 체크박스 값
      pagination:{
        page:1,
        rowsPerPage: 500
      },
      nextDisabled: false,
      gridItems: [],
      gridTotalCnt: 0,

      gridDataHeaders: [
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px' },
          { text: '제목', value: 'PST_TTL', align: 'left', width: '400px'},
          { text: '첨부파일 개수', value: 'FILE_CNT', align: 'center', width: '120px'},
          { text: '게시판 유형', value: 'PST_TYPE_CD_NM', align: 'left', width: '120px' },
          { text: '등록자', value: 'USER_NAME', align: 'left', width: '120px'},
          { text: '등록일', value: 'REG_DT', align: 'left', width: '120px'},
          { text: '수정자', value: 'EDITOR_NAME', align: 'left', width: '120px'},
          { text: '수정일', value: 'MDFCN_DT', align: 'left', width: '120px'},
          { text: '조회수', value: 'INQ_CNT', align: 'center', width: '120px'},
      ],

      dialogRegExlCond:false,
    }
  },
  watch: {
    
  },

  computed: {
    
  },

  created() {
    this.getDeptList();
    this.getGridList();
  },

  mounted() {
    
  },
  
  methods: {
    async getDeptList(){
      this.DEPT_LIST=[{
        text:'전체'
        , value:''
      }];
      let deptCdList = await this.mixin_getDeptList();
      for(let i=0;i<deptCdList.length;i++){
        let list = {
          text:deptCdList[i].DEPT_NM
          , value: deptCdList[i].DEPT_ID
        }
        this.DEPT_LIST.push(list);
      }
    },

    rowSelect(item){
      this.selectedRow = item;
      this.SRVY_EXL_COND_ID = item.SRVY_EXL_COND_ID;
    },
    
    async getGridList(next){
      //다음버튼 클릭 유무
      if (!next){
        this.pagination.page = 1; //페이징 처리 초기화
        this.selectedData = [];
        this.gridTotalCnt = 0;
      }

      let sUrl = '/api/svy/exclusion/selectConditionList';
      let postParam = {
        DEPT_ID: this.DEPT_ID
        , EXL_COND_SE_CD: this.EXL_COND_SE_CD
        , EXL_COND_CD : this.EXL_COND_CD
        , EXL_COND_CN : this.EXL_COND_CN
        , USE_YN : this.USE_YN
        , DEL_YN : this.DEL_YN
      }

      let headParam = {
        head : {
          PAGING: 'Y',
          ROW_CNT: this.pagination.rowsPerPage,
          PAGES_CNT: this.pagination.page
        }
      }

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        if(next){
          // 다음검색
          let tempDataText = response.DATA;
          let idx = this.gridItems.length + 1;
          for(let i in tempDataText){
            tempDataText[i]["ROW_NUMBER"]= idx++;
          }
          this.gridItems = [...this.gridItems, ...tempDataText];
          
        }else{
          // 조회
          this.gridItems = response.DATA;
        }
        // 전체 건수
        if(this.gridItems.length > 0) this.gridTotalCnt = response.DATA[0].TWB_PAGING_TOT_COUNT;

        // 다음검색 버튼 활성화 여부
        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false // 버튼 활성화
          }else{
            this.nextDisabled = true  // 버튼 비활성화
          }
        }

        this.pagination.page += 1;
        // this.page=1;
      }
    },

    regBtn(){
      this.initSel();
      this.mixin_showDialog('RegExlCond');
    },

    deleteBtn(){

    },

    initSel(){
      this.selectedRow = {};
      this.SRVY_EXL_COND_ID = '';
    },
    
    //row 선택 활성화
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    // 저장 버튼 validation
    exlCondValidate(){
      let fromYear = this.digParams.START_DATE;
      let toYear = this.digParams.END_DATE;
      let now = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
      var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);

      if(!this.detailValidate()) {
        return;
      }else if(this.mixin_isEmpty(fromYear) ||
         this.mixin_isEmpty(this.digParams.END_DATE)) {
        this.showAlert(this.MESSAGE.ALERT.CHECK_DATE);
        return;
      }else if(fromYear < now && this.flagData.DIG_CHECK){
        this.showAlert(this.MESSAGE.ALERT.CHECK_UNDER_DATE);
        return;
      }else if((fromYear.replace(/-/gi, '') > toYear.replace(/-/gi, '')) || (toYear < now)) {
        this.showAlert(this.MESSAGE.ALERT.CHECK_OVER_DATE);
        return;
      }else if(!regex.test(fromYear) || !regex.test(toYear)){
        this.showAlert(this.MESSAGE.ALERT.CHECK_OVER_DATE);
        return;
      }else if(this.digParams.BOARD_CONTENTS.length > 4006){ // 내용 글자수 제한(실제 글자수 3998자 이상일 경우 제한 - ckeditor)
        this.showAlert(this.MESSAGE.ALERT.CHECK_CN_LENGTH);
        return;
      }else if(this.digParams.BOARD_TITLE.length > 300){ // 제목 글자수 제한(300자 제한)
        this.showAlert(this.MESSAGE.ALERT.CHECK_TTL_LENGTH);
        return;
      }
      
      if(this.flagData.DIG_CHECK){
        this.showAlert(this.MESSAGE.CONFIRM.REG);
      }else{
        this.showAlert(this.MESSAGE.CONFIRM.MOD);
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>