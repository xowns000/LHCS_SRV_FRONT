<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                진행 년도
              </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form"
                    :items="srvyYrItems"
                    v-model="SRCH_SRVY_YR"
                    placeholder="선택하세요"
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
                    v-model="SRCH_SRVY_SE_CD"
                    @change="getSrvyNm"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">설문조사 명</span>
              <div class="pl-desc">
                <v-select
                    class="pl-form is-mid"
                    :items="srvyNmItems"
                    v-model="SRCH_SRVY_NM"
                    return-object
                    placeholder="선택하세요"
                >
                </v-select>
              </div>
            </div>
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
            <v-btn class="pl-btn is-icon is-sub" @click="beforeFetchDetail" :disabled="selectedRow.ROW_NUMBER != undefined ? false : true">
              <span class="pl-icon20 document"></span>
              선택항목 상세
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ gridTotalCnt }})</em> 건</span>
          </div>
        </div>
        <v-data-table
          class="pl-grid"
          style="cursor:pointer;"
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
          @dblclick:row="beforeFetchDetail"
          v-model="selectedData"
          :loading="isLoading"
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
              :DisabledProp = "nextDisabled || isLoading"
              @btnClick="getGridList(true)"
            ></compo-tooltip-btn>
          </span>
        </div>
      </div>
    </div>

    <!-- dialog -->
    <v-dialog
      v-model="dialogExlHstryDtl"
      content-class="dialog-draggable is-scroll"
      hide-overlay
      width='780px'
      :retain-focus="false">
      <div class="draggable-area">drag area</div>
      <compo-dialog
        headerTitle="제외 이력 상세"
        @hide="mixin_hideDialog('ExlHstryDtl')">
        <template slot="body">
          <div class="pl-card">
            <h2 class="pl-subtit pb-1">고객정보</h2>
            <div class="pl-card is-border pt-1">
              <div class="pl-form-inline-wrap vertical">
                <div class="pl-form-inline">
                  <span class="pl-label">고객명</span>
                  <div class="pl-desc">{{ exlHstryDtl.CUST_NM }}</div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">고객ID</span>
                  <div class="pl-desc">{{ exlHstryDtl.CUST_ID }}</div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">고객 전화번호</span>
                  <div class="pl-desc">{{ exlHstryDtl.CUST_PHN_NO }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="pl-card">
            <h2 class="pl-subtit pb-1">설문조사정보</h2>
            <div class="pl-card is-border pt-1">
              <div class="pl-form-inline-wrap vertical">
                <div class="pl-form-inline">
                  <span class="pl-label">설문연도</span>
                  <div class="pl-desc">{{ exlHstryDtl.CUST_NM }}</div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">계획 구분</span>
                  <div class="pl-desc">{{ exlHstryDtl.SRVY_SE_NM }}</div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">설문 명</span>
                  <div class="pl-desc">{{exlHstryDtl.SRVY_NM }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="pl-card">
            <h2 class="pl-subtit pb-1">제외조건 정보({{exlHstryDtl?.exlList?.length}}건)</h2>
            <div class="pl-card is-border pt-1">
              <div class="pl-form-inline-wrap vertical" v-for="(item,idx) in exlHstryDtl.exlList">
                <div class="pl-form-inline">
                  <span class="pl-label">조건 구분</span>
                  <div class="pl-desc">{{ item.EXL_COND_NM+ ' ('+ item.EXL_COND_SE_CD +')' }}</div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">제외 조건</span>
                  <div class="pl-desc">{{ item.EXL_COND_SE_NM+ ' ('+ item.EXL_COND_CD +')' }}</div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">조건 값</span>
                  <div
                    v-if="item.EXL_COND_CD == 'col IN (\'str\')'||item.EXL_COND_CD == 'col NOT IN (\'str\')'||item.EXL_COND_CD == 'col LIKE (\'%str%\')'" 
                    class="pl-desc"
                    v-html="sanitizeContent(item.EXL_COND_LIST)"
                  >
                  </div>
                  <div
                    v-else
                    class="pl-desc">
                    {{ item.EXL_COND_CN }}
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">조건 사유</span>
                  <div class="pl-desc">{{ item.EXL_COND_TEXT }}</div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">등록일자</span>
                  <div class="pl-desc">{{ convertDateForm(item.REG_DT) }}</div>
                </div>
                <v-divider v-if="idx+1 !== exlHstryDtl.exlList.length"/>
              </div>
            </div>
          </div>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('ExlHstryDtl')">닫기</v-btn>
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
      srvyYrItems: [],

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
      SRCH_SRVY_YR: '',
      SRCH_SRVY_SE_CD: '',
      SRCH_SRVY_NM : {},
      srvyNmItems : [],


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
        rowsPerPage: 5000
      },
      nextDisabled: false,
      gridItems: [],
      gridTotalCnt: 0,
      isLoading : false,

      gridDataHeaders: [
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px' },
          { text: '부서', value: 'DEPT_NM', align: 'left', width: '80px'},
          { text: '설문연도', value: 'SRVY_YR', align: 'left', width: '100px' },
          { text: '설문명', value: 'SRVY_NM', align: 'left', width: '200px'},
          { text: '고객명', value: 'CUST_NM', align: 'left', width: '100px'},
          { text: '고객 전화번호', value: 'CUST_PHN_NO', align: 'left', width: '120px'},
          { text: '제외 사유', value: 'EXL_COND_TEXT', align: 'left', width: '300px'},
          { text: '등록일', value: 'REG_DT', align: 'left', width: '120px'},
      ],

      dialogExlHstryDtl:false,
      exlHstryDtl : {},
    }
  },
  watch: {

    SRCH_SRVY_SE_CD(){
      if(!this.SRCH_SRVY_SE_CD){
        this.SRCH_SRVY_NM = {}
      }
    }
  },

  computed: {
    
  },

  async created() {
    // 공통코드설정
    let codeName = ['EXL_COND_TY', 'EXL_COND', 'USE_WT','SUVY_CL'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    this.getDeptList();
    this.getGridList();
  },

  mounted() {
    //진행년도
    const date = new Date();
    const curYear = date.getFullYear();
    this.srvyYrItems.push({ text: '전체', value: '' });   // default
    for (let i = 0; i < 10; i++) {
      this.srvyYrItems.push({ text: `${curYear - i}년`, value: (curYear - i).toString() });
    }
    this.SRCH_SRVY_YR =  curYear.toString();
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

    rowSelect(item){
      this.selectedRow = item;
    },

    async getGridList(next){
      this.isLoading = true;
      //다음버튼 클릭 유무
      if (!next){
        this.pagination.page = 1; //페이징 처리 초기화
        this.selectedData = [];
        this.gridTotalCnt = 0;
      }

      let sUrl = '/api/svy/exclusion/history/selectHistory';
      let postParam = {
        SRCH_DEPT_ID: this.SRCH_DEPT_ID
        , SRCH_EXL_COND_SE_CD: this.SRCH_EXL_COND_SE_CD
        , SRCH_EXL_COND_CD : this.SRCH_EXL_COND_CD
        , SRCH_EXL_COND_CN : this.SRCH_EXL_COND_CN
        , SRCH_SRVY_ID : this.SRCH_SRVY_NM?.value
        , SRCH_SRVY_YR : this.SRCH_SRVY_YR
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
        let tempDataText = [];
        tempDataText = response.DATA.map(item => {
          item.REG_DT = this.mixin_convertDate(item.REG_DT, 'yyyy-MM-dd HH:mm:ss')
          item.CUST_PHN_NO = this.mixin_setPhoneNo(item.CUST_PHN_NO);
          return item;
        })
        if(next){
          // 다음검색
          let idx = this.gridItems.length + 1;
          this.gridItems = [...this.gridItems, ...tempDataText];

        }else{
          this.gridItems = [];
          // 조회
          this.gridItems = tempDataText;

          console.log("this.gridItems", this.gridItems)
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
      this.isLoading = false;
    },
    beforeFetchDetail(){
      this.getExlHstryDtl(this.selectedRow);
    },

    async getExlHstryDtl(srvyExlHstry){
      console.log("srvyExlHstryId  ", srvyExlHstry.SRVY_ID)
      let sUrl = '/api/svy/exclusion/history/selectHistoryDtl';
      let postParam = {
        SRVY_ID : srvyExlHstry.SRVY_ID,
        CUST_PHN_NO : srvyExlHstry.CUST_PHN_NO,
      }
      const response = await this.common_postCall(sUrl, postParam,{head:{}})
      console.log("response.DATA[0]",response.DATA[0])
      if(!response.HEADER.ERROR_FLAG && response.DATA[0]){
        this.initDtl()
        this.exlHstryDtl = response.DATA[0]
        this.exlHstryDtl.exlList = response.DATA.map(item =>{
          return {
            EXL_COND_NM : item.EXL_COND_NM,
            EXL_COND_SE_CD : item.EXL_COND_SE_CD,
            EXL_COND_SE_NM : item.EXL_COND_SE_NM,
            EXL_COND_CD : item.EXL_COND_CD,
            EXL_COND_CN : item.EXL_COND_CN,
            EXL_COND_TEXT : item.EXL_COND_TEXT,
            EXL_COND_LIST : item.EXL_COND_LIST,
            REG_DT : item.REG_DT,
          }
        })
        this.mixin_showDialog('ExlHstryDtl')
      }else{
        this.showToastCaution({msg : '조회 중 오류가 발생했습니다.'})
      }
    },
    initDtl(){
      this.exlHstryDtl = {
        CAUTION_CUST_REG_DT: ''
        , CAUTION_CUST_YN: ''
        , CLCT_CUST_INFO_ID: ''
        , CLCT_REG_DT: ''
        , CNSLT_DIV_CD_1: ''
        , CNSLT_DIV_CD_2: ''
        , CNSLT_DIV_CD_3: ''
        , CNSLT_DIV_CD_1_NM: ''
        , CNSLT_DIV_CD_2_NM: ''
        , CNSLT_DIV_CD_3_NM: ''
        , CUSL_NM: ''
        , CUSTCO_ID: ''
        , CUST_ID: ''
        , CUST_NM: ''
        , CUST_PHN_NO: ''
        , CUTT_CN: ''
        , CUTT_REG_DT: ''
        , DEPT_ID: ''
        , DEPT_NM: ''
        , DRWI_SE_CD: ''
        , EML: ''
        , EXL_COND_CD: ''
        , EXL_COND_CN: ''
        , EXL_COND_NM: ''
        , EXL_COND_SE_CD: ''
        , EXL_COND_SE_NM: ''
        , EXL_COND_TEXT: ''
        , PRCS_CHN_CD: ''
        , PRVC_CLCT_AGRE_YN: ''
        , RCPT_CHN_CD: ''
        , REG_DT: ''
        , RGTR_ID: ''
        , SRVY_SE_NM: ''
        , SRVY_EXL_HSTRY_ID: ''
        , SRVY_NM: ''
        , SRVY_YR: ''
        ,RCPT_CHN_NM : ''
        ,PRCS_CHN_NM : ''
      }
    },

    //row 선택 활성화
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    async getSrvyNm() {
      if (!this.SRCH_SRVY_SE_CD) {
        this.SRCH_SRVY_NM = {}
        this.srvyNmItems = []
      } else {

        const sUrl = '/api/svy/makeitems/selectcombomakeitems';
        const postParam = {
          SRVY_YR: this.SRVY_YR             //진행년도
          , STTS_CD: this.STTS_CD         //진행상태
          , SRVY_SE_CD: this.SRVY_SE_CD        //계획구분
        }
        const headParam = {
          head: {
            'SERVICE': 'svy.plan.selectcombomakeitems',
            'METHOD': 'selectcombomakeitems',
            'TYPE': 'BIZ_SERVICE',
          }
        }

        let resData = await this.common_postCall(sUrl, postParam, headParam);


        if (resData.HEADER.ERROR_FLAG) {
          this.setErrMsg(resData);
        } else {

          this.SRCH_SRVY_NM = {};
          this.srvyNmItems = resData.DATA.map(item => ({text: this.mixin_decode(item.TEXT), value: item.VALUE}));
          if (this.srvyNmItems.length > 0) this.SRCH_SRVY_NM = this.mixin_decode(resData.DATA[0].VALUE);
        }
      }
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
    },

    //YYYYMMDDHH24MISS 형식의 날짜 데이터를 YYYY-MM-DD HH:24MI:SS로 변환
    convertDateForm(str){
      let date = ''
      date = str.substr(0,4)+'-'+str.substr(4,2)+'-'+str.substr(6,2)+' '+str.substr(8,2)+':'+str.substr(10,2)+':'+str.substr(12,2);
      return date
    }
  },
}
</script>

<style lang="scss" scoped>

</style>