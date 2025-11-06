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
                  :items="SRCH_DEPT_LIST"
                  placeholder="선택하세요"
                  v-model="SRCH_DEPT_ID"
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
                  v-model="SRCH_EXL_COND_SE_CD"
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
                  v-model="SRCH_EXL_COND_CD"
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
                  v-model="SRCH_EXL_COND_CN"
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
                  :items="this.mixin_common_code_get(this.common_code, 'USE_WT', '전체')"
                  v-model="SRCH_USE_YN"
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
                  :items="this.mixin_common_code_get(this.common_code, 'USE_WT', '전체')"
                  v-model="SRCH_DEL_YN"
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
            <v-btn class="pl-btn is-icon is-sub" @click="btnDetail">
              <span class="pl-icon20 zoom-fit"></span>
              전체보기
            </v-btn>
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
                  센터 구분
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    :items="DEPT_LIST"
                    placeholder="선택하세요"
                    v-model="DEPT_ID"
                    :rules="detailValidateRules.DEPT_ID"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  제외조건 구분
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    :items="this.mixin_common_code_get(this.common_code, 'EXL_COND_TY')"
                    placeholder="선택하세요"
                    v-model="EXL_COND_SE_CD"
                    :rules="detailValidateRules.EXL_COND_SE_CD"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  제외조건
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    :items="this.mixin_common_code_get(this.common_code, 'EXL_COND')"
                    placeholder="선택하세요"
                    v-model="EXL_COND_CD"
                    :rules="detailValidateRules.EXL_COND_CD"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  제외조건 값
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                  <div class="pl-desc">
                    <v-text-field
                    class="pl-form is-lg"
                    placeholder="검색어 입력"
                    v-model="EXL_COND_CN"
                    :rules="detailValidateRules.EXL_COND_CN"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  사용여부
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    :items="this.mixin_common_code_get(this.common_code, 'USE_WT')"
                    placeholder="선택하세요"
                    v-model="USE_YN"
                    :rules="detailValidateRules.USE_YN"
                  ></v-select>
                </div>
              </div>
            </div>
          </v-form>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('RegExlCond')">닫기</v-btn>
          <v-btn class="pl-btn" @click="saveBtn()">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- 전체보기 dialog -->
    <v-dialog
      v-model="dialogDetail"
      content-class="dialog-draggable is-fg"
      fullscreen
      hide-overlay
      :retain-focus="false">
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :headerTitle="'제외조건 전체보기'"
        @hide="mixin_hideDialog('Detail')">
        <template slot="body">
          <v-data-table
            class="pl-grid is-rowspan"
            :headers="gridDetailHeaders"
            :items="gridDetailItems"
            fixed-header
            hide-default-header
            item-key="ROW_NUMBER"
            height="700px"
            :items-per-page="gridDetailItems.length"
            :item-class="isDetailActiveRow"
            hide-default-footer
            page.sync="1"
            @page-count="pageCount = $event"
            @click:row="rowDetailSelect"
            no-data-text="등록된 데이터가 없습니다."
          >
            <template v-slot:header>
              <thead class="v-data-table-header multi-row">
                <tr>
                  <th rowspan="2" width="100px" class="text-center"><span>부서</span></th>
                  <th colspan="3" width="360px" class="text-center"><span>상담유형</span></th>
                  <th rowspan="2" width="360px" class="text-center"><span>상담메모</span></th>
                  <th rowspan="2" width="200px" class="text-center"><span>인입번호</span></th>
                  <th rowspan="2" width="150px" class="text-center"><span>상담채널</span></th>
                  <th rowspan="2" width="150px" class="text-center"><span>상담경로</span></th>
                  <th rowspan="2" width="150px" class="text-center"><span>처리방법</span></th>
                  <th rowspan="2" width="150px" class="text-center"><span>개인정보</span></th>
                  <th rowspan="2" width="150px" class="text-center"><span>인입번호</span></th>
                  <th rowspan="2" width="100px" class="text-center"><span>접수자명</span></th>
                  <th rowspan="2" width="150px" class="text-center"><span>비고</span></th>
                </tr>
                <tr>
                  <th class="text-center" style="white-space: nowrap;"><span>대</span></th>
                  <th class="text-center" style="white-space: nowrap;"><span>중</span></th>
                  <th class="text-center" style="white-space: nowrap;"><span>소</span></th>
                </tr>
              </thead>
            </template>
            <template v-slot:item.CNSLT_DIV_CD_1="{ item }">
              <div
                v-html="sanitizeContent(item.CNSLT_DIV_CD_1)"
              >
              </div>
            </template>
            <template v-slot:item.CNSLT_DIV_CD_2="{ item }">
              <div
                v-html="sanitizeContent(item.CNSLT_DIV_CD_2)"
              >
              </div>
            </template>
            <template v-slot:item.CNSLT_DIV_CD_3="{ item }">
              <div
                v-html="sanitizeContent(item.CNSLT_DIV_CD_3)"
              >
              </div>
            </template>
            <template v-slot:item.CUTT_CN="{ item }">
              <div
                v-html="sanitizeContent(item.CUTT_CN)"
              >
              </div>
            </template>
            <template v-slot:item.LAST_PHN_NO="{ item }">
              <div
                v-html="sanitizeContent(item.LAST_PHN_NO)"
              >
              </div>
            </template>
            <template v-slot:item.RCPT_CHN_CD="{ item }">
              <div
                v-html="sanitizeContent(item.RCPT_CHN_CD)"
              >
              </div>
            </template>
            <template v-slot:item.DRWI_TYPE_CD="{ item }">
              <div
                v-html="sanitizeContent(item.DRWI_TYPE_CD)"
              >
              </div>
            </template>
            <template v-slot:item.PRCS_CHN_CD="{ item }">
              <div
                v-html="sanitizeContent(item.PRCS_CHN_CD)"
              >
              </div>
            </template>
            <template v-slot:item.PRVC_CLCT_AGRE_YN="{ item }">
              <div
                v-html="sanitizeContent(item.PRVC_CLCT_AGRE_YN)"
              >
              </div>
            </template>
            <!-- <template v-slot:item.1111="{ item }">
              <div
                v-html="sanitizeContent(item.1111)"
              >
              </div>
            </template> -->
            <template v-slot:item.USER_NM="{ item }">
              <div
                v-html="sanitizeContent(item.USER_NM)"
              >
              </div>
            </template>
            <!-- <template v-slot:item.2222="{ item }">
              <div
                v-html="sanitizeContent(item.2222)"
              >
              </div>
            </template> -->
          </v-data-table>
        </template>
        <template slot="footer">
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

      detailValidateRules: {
        DEPT_ID: [
          v => !!v || '센터구분을 선택하세요',
        ],
        EXL_COND_SE_CD: [
          v => !!v || '제외조건 구분을 선택하세요.',
        ],
        EXL_COND_CD: [
          v => !!v || '제외조건을 선택하세요.',
        ],
        EXL_COND_CN: [
          v => !!v || '제외조건 값을 입력하세요.',
        ],
        USE_YN: [
          v => !!v || '사용여부를 선택하세요.',
        ],
      },

      SRCH_DEPT_LIST:[],
      SRCH_DEPT_ID:'',
      SRCH_EXL_COND_SE_CD:'',
      SRCH_EXL_COND_CD:'', 
      SRCH_EXL_COND_CN:'',
      SRCH_USE_YN:'Y',
      SRCH_DEL_YN:'N',

      DEPT_LIST:[],
      DEPT_ID:'',
      EXL_COND_SE_CD:'',
      EXL_COND_CD:'', 
      EXL_COND_CN:'',
      USE_YN:'Y',

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
        { text: '부서', value: 'DEPT_NM', align: 'left', width: '120px'},
        { text: '조건 구분', value: 'EXL_COND_SE_NM', align: 'left', width: '200px'},
        { text: '조건', value: 'EXL_COND_NM', align: 'left', width: '200px' },
        { text: '조건 값', value: 'EXL_COND_CN', align: 'left', width: '300px'},
        { text: '등록자', value: 'RGTR_NM', align: 'left', width: '120px'},
        { text: '등록일', value: 'REG_DT_F', align: 'left', width: '120px'},
        { text: '수정자', value: 'MDFR_NM', align: 'left', width: '120px'},
        { text: '수정일', value: 'MDFCN_DT_F', align: 'left', width: '120px'},
      ],

      dialogRegExlCond:false,

      gridDetailHeaders:[
        { text: '부서', value: 'DEPT_NM'},
        { text: '대', value: 'CNSLT_DIV_CD_1'},
        { text: '중', value: 'CNSLT_DIV_CD_2'},
        { text: '소', value: 'CNSLT_DIV_CD_3'},
        { text: '상담메모', value: 'CUTT_CN'},
        { text: '인입번호', value: 'LAST_PHN_NO'},
        { text: '상담채널', value: 'RCPT_CHN_CD'},
        { text: '상담경로', value: 'DRWI_TYPE_CD'},
        { text: '처리방법', value: 'PRCS_CHN_CD'},
        { text: '개인정보', value: 'PRVC_CLCT_AGRE_YN'},
        { text: '인입번호', value: '1111'},
        { text: '접수자명', value: 'USER_NM'},
        { text: '비고', value: '2222'},
      ],
      gridDetailItems:[],
      selectedDetailRow: {},
      dialogDetail: false,
    }
  },
  watch: {
    
  },

  computed: {
    
  },

  async created() {
    // 공통코드설정
    let codeName = ['EXL_COND_TY', 'EXL_COND', 'USE_WT'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    this.getDeptList();
    this.getGridList();
  },

  mounted() {
    
  },
  
  methods: {
    async getDeptList(){
      this.SRCH_DEPT_LIST=[{
        text:'전체'
        , value:''
      }];
      this.DEPT_LIST=[];
      let deptCdList = await this.mixin_getDeptList();
      for(let i=0;i<deptCdList.length;i++){
        let list = {
          text:deptCdList[i].DEPT_NM
          , value: deptCdList[i].DEPT_ID
        }
        this.SRCH_DEPT_LIST.push(list);
        this.DEPT_LIST.push(list);
      }
    },

    async selectConditionAll(){
      let sUrl = '/api/svy/exclusion/selectConditionAll';
      let postParam = {
      }

      let headParam = {
        head : {
        }
      }

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.gridDetailItems = response.DATA;
      }
    },

    rowSelect(item){
      this.selectedRow = item;
      this.SRVY_EXL_COND_ID = item.SRVY_EXL_COND_ID;
      
      this.DEPT_ID=item.DEPT_ID;
      this.EXL_COND_SE_CD=item.EXL_COND_SE_CD;
      this.EXL_COND_CD=item.EXL_COND_CD;
      this.EXL_COND_CN=item.EXL_COND_CN;
      this.USE_YN=item.USE_YN;
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
        DEPT_ID: this.SRCH_DEPT_ID
        , EXL_COND_SE_CD: this.SRCH_EXL_COND_SE_CD
        , EXL_COND_CD : this.SRCH_EXL_COND_CD
        , EXL_COND_CN : this.SRCH_EXL_COND_CN
        , USE_YN : this.SRCH_USE_YN
        , DEL_YN : this.SRCH_DEL_YN
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

      this.DEPT_ID='';
      this.EXL_COND_SE_CD='';
      this.EXL_COND_CD='';
      this.EXL_COND_CN='';
      this.USE_YN='Y';
    },
    
    //row 선택 활성화
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    //저장버튼 클릭
    async saveBtn(){
      let sUrl = '/api/svy/exclusion/mergeCondition';
      let postParam = {
        SRVY_EXL_COND_ID: this.SRVY_EXL_COND_ID
        , DEPT_ID: this.DEPT_ID
        , EXL_COND_SE_CD: this.EXL_COND_SE_CD
        , EXL_COND_CD : this.EXL_COND_CD
        , EXL_COND_CN : this.EXL_COND_CN
        , USE_YN : this.USE_YN
      }

      let headParam = {
        head : {
        }
      }

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.mixin_hideDialog('RegExlCond');
        this.getGridList();
        this.showToast({  msg: '처리가 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 })
      }
    },

    btnDetail(){
      this.selectConditionAll();
      this.mixin_showDialog('Detail');
    },

    rowDetailSelect(item){
      this.selectedDetailRow = item;
    },

    isDetailActiveRow(item){
      const activeClass = item === this.selectedDetailRow ? "active" : "";
      return activeClass;
    },

    sanitizeContent(content) {
      if (!content) return '';

      // 1️⃣ <br>, <br/> 태그는 임시 치환
      let temp = content.replace(/<br\s*\/?>/gi, '[[BR]]');

      // 2️⃣ 나머지 HTML 태그 제거
      temp = temp.replace(/<[^>]*>/g, '');

      // 3️⃣ 다시 [[BR]] → <br> 복원
      temp = temp.replace(/\[\[BR\]\]/g, '<br>');

      // 4️⃣ script, iframe 등 보안 위험 요소 제거 (추가 안전망)
      temp = temp.replace(/<script[^>]*>.*?<\/script>/gi, '');
      temp = temp.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');

      return temp;
    }
  },
}
</script>

<style lang="scss" scoped>

</style>