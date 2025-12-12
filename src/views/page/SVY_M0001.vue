<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                기간
              </span>
              <div class="pl-desc">
                <compo-date-range-picker
                  :StartDayProp.sync="ST_DT"
                  :EndDayProp.sync="END_DT"
                  @startDayChange="setDtLmt('end')"
                  @endDayChange="setDtLmt('st')"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                발송구분
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="[
                    {text:'전체',value:''},{text:'발송',value:'SND'},{text:'제외',value:'EXL'}
                  ]"
                  placeholder="선택하세요"
                  v-model="EXL_TY"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                조직구분
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
                제외조건
              </span>
              <div class="pl-desc">
                <compo-tooltip-btn
                  TitleProp="조건 선택하기"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 parts-check"
                  TooltipPositionProp="bottom"
                  @btnClick="[mixin_showDialog('ExlCond'),getGridList()]"
                ></compo-tooltip-btn>
                <v-text-field
                  class="pl-form"
                  placeholder="검색어 입력"
                  v-model="SRCH_EXL_COND.ROW"
                  readonly
                />
                <compo-tooltip-btn
                  :TitleProp="SRCH_EXL_COND.TEXT"
                  ClassProp="pl-tooltip-btn flex-grow-0"
                  IconProp="pl-icon20 paste-board"
                  TooltipPositionProp="bottom"
                ></compo-tooltip-btn>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                진행 년도
              </span>
              <div class="pl-desc">
                <v-select class="pl-form"
                  :items="srvyYrItems"
                  v-model="SRVY_YR"
                  @change="getSrvyNm"
                  placeholder="선택하세요">
                </v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">발송설문</span>
              <div class="pl-desc">
                <v-select class="pl-form"
                  :items="srvyNmItems"
                  v-model="SRVY_ID"
                  placeholder="선택하세요">
                </v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                전화번호
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  placeholder="검색어 입력"
                  v-model="SRCH_CUST_PHN_NO"
                  @keydown.enter="getGridList()"
                />
              </div>
            </div>
            <v-btn class="pl-btn is-icon" @click="selectList(false)">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body">
        <div class="pl-grid-top">
          <!-- <div class="pl-grid-top-left">
            <v-btn class="pl-btn is-icon is-sub" @click="dblClickRow" :disabled="selectedRow.ROW_NUMBER != undefined ? false : true">
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
          </div> -->
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ gridTotalCnt }})</em> 건</span>
            <span
              v-if="LOADING"
              class="pl-counter ml-2"
            >
              조회중입니다{{ dots }}
            </span>
          </div>
        </div>
        <v-data-table
          class="pl-grid"
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
          v-model="selectedData"
          no-data-text="등록된 데이터가 없습니다."
        >
          <template v-slot:item.EXL_COND_TEXT="{ item }">
            <v-tooltip 
              v-if="item.EXL_COND_TEXT"
              content-class="pl-tooltip " bottom>
              <template v-slot:activator="{ on, attrs }">
                <span
                  v-bind="attrs"
                  v-on="on">
                {{ exlCondCount(item.EXL_COND_TEXT)+'개의 제외조건에 해당합니다' }}</span>
              </template>
              <span
                v-html="item.EXL_COND_TEXT"
              >
              </span>
            </v-tooltip>
          </template>
          <template v-slot:item.SNDNG_SE_CD="{ item }">
            <span
              v-if="item.SNDNG_SE_CD"
            >
              {{ item.SNDNG_SE_CD=='ATALK' ? '알림톡' : (item.SNDNG_SE_CD=='EMAIL' ? item.SNDNG_SE_CD : '문자('+item.SNDNG_SE_CD+')') }}
            </span>
          </template>
          <template v-slot:item.ATALK_TRAN_SNDNG_CD="{ item }">
            <span
              v-if="item.ATALK_TRAN_SNDNG_CD"
            >
              {{ item.ATALK_TRAN_SNDNG_CD=='S' ? 'SMS' : 'LMS' }}
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

          <span class="pl-pager-period">
            보기 {{ mixin_getPagePeriod(gridItems, page) }} / {{ gridItems.length }}
            <compo-tooltip-btn
              TitleProp="다음 검색"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 arrow-next-paging"
              TooltipPositionProp="bottom"
              :DisabledProp = "nextDisabled"
              @btnClick="selectList(true)"
            ></compo-tooltip-btn>
          </span>
        </div>
      </div>
    </div>

    <!-- 제외조건 적용 dialog -->
    <v-dialog
      v-model="dialogExlCond"
      content-class="dialog-draggable is-lg"
      fullscreen
      hide-overlay
      :retain-focus="false">
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :headerTitle="'제외조건 적용하기'"
        @hide="mixin_hideDialog('ExlCond')">
        <template slot="body">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              제외조건을 검색하여 적용할 제외조건을 선택 후 다음단계로 이동하세요.
            </div>
          </div>
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
                  @keydown.enter="getGridList()"
                />
              </div>
            </div>
          </div>
          <div class="pl-form-inline-wrap">
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
          <v-data-table
            class="pl-grid has-control mt-2"
            :headers="EXL_COND_HEADER_LIST"
            :items="EXL_COND_LIST"
            fixed-header
            show-select
            item-key="ROW_NUMBER"
            height="580px"
            :items-per-page="EXL_COND_LIST.length"
            :item-class="isExlCondActiveRow"
            hide-default-footer
            page.sync="1"
            @page-count="pageCount = $event"
            @click:row="rowExlCondSelect"
            v-model="SEL_EXL_COND_LIST"
            no-data-text="등록된 데이터가 없습니다."
          >
            <template v-slot:item.EXL_COND_TEXT="{ item }">
              <v-tooltip 
                v-if="item.EXL_COND_SE_CD == 'CNSLT_DIV_CD_1'||item.EXL_COND_SE_CD == 'CNSLT_DIV_CD_2'||item.EXL_COND_SE_CD == 'CNSLT_DIV_CD_3'"
                content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span
                    v-bind="attrs"
                    v-on="on">
                  {{ item.EXL_COND_TEXT }}</span>
                </template>
                <span
                  v-html="item.CUTT_TYPE_PATH"
                >
                </span>
              </v-tooltip>
              <span
                v-else
              >
                {{ item.EXL_COND_TEXT }}
              </span>
            </template>
          </v-data-table>
        </template>
        <template slot="footer">
          <span class="pl-counter">선택된 제외조건 <em class="pl-1">({{ SEL_EXL_COND_LIST.length }})</em> 건</span>
          <v-btn class="pl-btn is-sub ml-2" @click="mixin_hideDialog('ExlCond')">닫기</v-btn>
          <v-btn class="pl-btn is-icon" @click="setExlCond()">선택</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
export default {
    name:"MENU_SVY_M0001", //name은 'MENU_' + 파일명 조합

 components: {
   
  },
 data() {
    return {
      common_code: [],

      ST_DT:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),          // 전화 상담이력 조회 - 시작일,
      END_DT:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),          // 전화 상담이력 조회 - 시작일,
      EXL_TY:'',
      SRCH_SRVY_ID:'',
      SRCH_EXL_COND:{
        TEXT:''
        , ROW:''
        , VALUE:''
      },
      srvyYrItems:[],
      SRVY_YR:'',
      srvyNmItems:[],
      SRVY_ID:'',
      SRCH_CUST_PHN_NO:'',

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
        { text: '조직', value: 'DEPT_NM', align: 'left', width: '80px'},
        { text: '고객 전화번호', value: 'CUST_PHN_NO', align: 'left', width: '120px'},
        { text: '발송 설문', value: 'SRVY_NM', align: 'left', width: '200px' },
        { text: '제외 조건', value: 'EXL_COND_TEXT', align: 'left', width: '240px'},
        { text: '등록일자', value: 'REG_DT_F', align: 'left', width: '120px'},
        { text: '설문발송일자', value: 'MSG_DT_F', align: 'left', width: '120px'},
        { text: '발송구분', value: 'SNDNG_SE_CD', align: 'left', width: '120px'},
        { text: '전환전송', value: 'ATALK_TRAN_SNDNG_CD', align: 'left', width: '120px'},
        { text: '설문참여일자', value: 'SRVY_RSPNS_DT_F', align: 'left', width: '120px'},
      ],

      dialogExlCond:false,

      EXL_COND_HEADER_LIST:[
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px' },
        { text: '부서', value: 'DEPT_NM', align: 'left', width: '120px'},
        { text: '조건 구분', value: 'EXL_COND_TEXT', align: 'left', width: '360px'},
        { text: '수정자', value: 'MDFR_NM', align: 'left', width: '120px'},
        { text: '수정일', value: 'MDFCN_DT_F', align: 'left', width: '120px'},
      ],
      EXL_COND_LIST:[],   //제외조건 리스트 - 적용할 제외조건을 선택하기 위한 리스트
      SRCH_DEPT_LIST:[],
      SRCH_DEPT_ID:'',
      SRCH_EXL_COND_SE_CD:'',
      SRCH_EXL_COND_CD:'', 
      SRCH_EXL_COND_CN:'',
      SRCH_USE_YN:'Y',
      SRCH_DEL_YN:'N',

      SEL_EXL_COND_LIST:[],   //선택 제외조건 리스트 - 선택된 적용할 제외조건 리스트
      
      LOADING:false,
      dots: "",
      dotInterval: null,
    }
  },
  watch: {
    
  },

  computed: {
    
  },

  async created() {
    //공통코드설정
    let codeName = [
      'EXL_COND_TY', 'EXL_COND', 'USE_WT'
    ];
    this.common_code = await this.mixin_common_code_get_all(codeName, 'Y');

    this.getDeptList();

    //진행년도 설정(금년기준 -5, +5)
    const date = new Date();
    const curYear = date.getFullYear();
    this.srvyYrItems.push({ text: '전체', value: '' });   // default
    for (let i = -5; i < 5; i++) {
      this.srvyYrItems.push({ text: `${curYear + i}년`, value: (curYear + i).toString() });
    }
    // this.SRVY_YR =  curYear.toString();
    this.SRVY_YR = '';

    this.selectList(false);
  },

  mounted() {
    this.getSrvyNm();
  },
  
  methods: {
    //설문명 콤보박스 조회
    async getSrvyNm(){
      const sUrl = '/api/svy/makeitems/selectcombomakeitems';
      const postParam = {
        SRVY_YR : this.SRVY_YR             //진행년도
        ,STTS_CD : this.STTS_CD         //진행상태
        ,SRVY_SE_CD : this.SRVY_SE_CD        //계획구분
      }
      const headParam = {
        head: {
          'SERVICE' : 'svy.plan.selectcombomakeitems',
          'METHOD' : 'selectcombomakeitems',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );


      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {
        this.SRVY_ID = '';
        const items = resData.DATA.map(item => ({
          text: this.mixin_decode(item.TEXT),
          value: item.VALUE,
          vl_1: item.VL_1
        }));
        this.srvyNmItems = [
          { text: '전체', value: '', vl_1: '' },
          ...items
        ];
        this.SRVY_ID = '';
      }
    },

    async selectList(next){
      this.LOADING = true;
      this.startDotAnimation();
      this.nextDisabled = true //로딩중 다음버튼 클릭 불가처리
      //다음버튼 클릭 유무
      if (!next){
        this.pagination.page = 1; //페이징 처리 초기화
        this.selectedData = [];
        this.gridTotalCnt = 0;
      }

      let sUrl = '/api/svy/exclusion/selectRtimeList';
      let postParam = {
        ST_DT: this.ST_DT.replaceAll('-','')+'000000'
        , END_DT: this.END_DT.replaceAll('-','')+'999999'
        , EXL_TY : this.EXL_TY
        , DEPT_ID: this.SRCH_DEPT_ID
        , SRVY_EXL_COND_ID: this.SRCH_EXL_COND.VALUE
        , SRVY_YR : this.SRVY_YR
        , SRVY_ID : this.SRVY_ID
        , CUST_PHN_NO : this.SRCH_CUST_PHN_NO
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
        this.LOADING = false;
        clearInterval(this.dotInterval);
        if(next){
          this.gridItems = [...this.gridItems, ...response.DATA];
        }else{
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
      } else {
        this.LOADING = false;
        clearInterval(this.dotInterval);
        this.nextDisabled = false //로딩중 다음버튼 클릭 불가처리
      }
    },

    async getDeptList(){
      this.SRCH_DEPT_LIST=[{
        text:'전체'
        , value:''
      }];
      let deptCdList = await this.mixin_getDeptList();
      for(let i=0;i<deptCdList.length;i++){
        let list = {
          text:deptCdList[i].DEPT_NM
          , value: deptCdList[i].DEPT_ID
        }
        this.SRCH_DEPT_LIST.push(list);
      }
    },

    rowSelect(item){
      this.selectedData = item;
    },

    isActiveRow(item){
      const activeClass = item == this.selectedData ? "active" : "";
      return activeClass;
    },

    async getGridList(){
      this.SEL_EXL_COND_LIST = [];

      let sUrl = '/api/svy/exclusion/selectConditionList';
      let postParam = {
        DEPT_ID: this.SRCH_DEPT_ID
        , SRVY_EXL_COND_ID: this.SRCH_EXL_COND.VALUE
        , CUST_PHN_NO : this.SRCH_CUST_PHN_NO
        , SRVY_ID: this.SRCH_SRVY_ID
        , MSG_DT_YN : ''
      }

      let headParam = {
        head : {
          PAGING: 'Y',
          ROW_CNT: 5000,
          PAGES_CNT: 1
        }
      }

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.EXL_COND_LIST = response.DATA;
      }
    },

    isExlCondActiveRow(item){
      const activeClass = item === this.SEL_EXL_COND ? "active" : "";
      return activeClass;
    },

    rowExlCondSelect(item){
      this.SEL_EXL_COND = item
    },

    setExlCond(){
      this.SRCH_EXL_COND = {
        TEXT:''
        , ROW:''
        , VALUE:''
      };
      for(let i=0;i<this.SEL_EXL_COND_LIST.length;i++){
        let text = (i!=0 ? '<br>' : '') + this.SEL_EXL_COND_LIST[i].EXL_COND_TEXT;
        this.SRCH_EXL_COND.TEXT += text;
        let value = (i!=0 ? ',' : '') + this.SEL_EXL_COND_LIST[i].SRVY_EXL_COND_ID;
        this.SRCH_EXL_COND.VALUE += value;
      }
      if(this.SEL_EXL_COND_LIST.length == 0){
        this.SRCH_EXL_COND = {
          TEXT:''
          , ROW:''
          , VALUE:''
        };
      } else {
        this.SRCH_EXL_COND.ROW = this.SEL_EXL_COND_LIST.length+'개의 제외조건';
      }

      this.mixin_hideDialog('ExlCond');
    },

    exlCondCount(text) {
      return text.split('<br>').filter(Boolean).length;
    },

    setDtLmt(dt){
      let stDt = this.ST_DT.replaceAll('-','');
      let endDt = this.END_DT.replaceAll('-','');
      const st = new Date(stDt.slice(0,4), stDt.slice(4,6)-1, stDt.slice(6,8));
      const end = new Date(endDt.slice(0,4), endDt.slice(4,6)-1, endDt.slice(6,8));

      const diffDays = (end - st) / (1000 * 60 * 60 * 24);
      if (diffDays > 92) {
        this.showAlert({alertDialogToggle: true, msg: '조회기간은 3개월을 넘을 수 없습니다.', iconClass: 'is-info', type: 'default'});

        if(dt == 'end'){
            const newEnd = new Date(st);
            newEnd.setMonth(st.getMonth() + 3);
            // newEnd.setFullYear(st.getFullYear() + 1);
            this.END_DT = newEnd.toISOString().slice(0,10);
        } else {
            const newst = new Date(end);
            newst.setMonth(st.getMonth() - 3);
            // newst.setFullYear(st.getFullYear() - 1);
            this.ST_DT = newst.toISOString().slice(0,10);
        }
      }
    },

    startDotAnimation() {
      // 기존 인터벌 제거
      if (this.dotInterval) {
        clearInterval(this.dotInterval);
      }

      // 0.1초마다 dots 생성
      this.dotInterval = setInterval(() => {
        if (this.dots.length >= 12) {
          this.dots = "";
        } else {
          this.dots += "...";
        }
      }, 100);
    },
  },
}
</script>

<style lang="scss" scoped>

</style>