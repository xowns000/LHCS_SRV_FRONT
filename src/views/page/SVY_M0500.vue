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
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols">
        <!-- 그리드 -->
        <div class="is-vrt pl-card">
          <div class="pl-grid-top">
            <div class="pl-grid-top-left">
              <v-btn 
                class="pl-btn is-icon is-sub"
                @click="openUpdateStts('APPR')"
                :disabled="CHK_ITEMS && CHK_ITEMS.length == 1 && CHK_ITEMS[0].STTS_CD != 'RDY' ? true : false">
                <span class="pl-icon20 select-accept"></span>
                승인
              </v-btn>
              <v-btn 
                class="pl-btn is-icon is-sub"
                @click="openUpdateStts('RFSL')"
                :disabled="CHK_ITEMS && CHK_ITEMS.length == 1 && !(CHK_ITEMS[0].STTS_CD == 'RDY' || CHK_ITEMS[0].STTS_CD == 'RTRVL' ) ? true : false">
                <span class="pl-icon20 reject"></span>
                반려
              </v-btn>
              <v-btn 
                class="pl-btn is-icon is-sub"
                @click="openUpdateStts('RTRVL')"
                :disabled="CHK_ITEMS && CHK_ITEMS.length == 1 && !(CHK_ITEMS[0].STTS_CD == 'APPR' || CHK_ITEMS[0].STTS_CD == 'PUBCMP' ) ? true : false">
                <span class="pl-icon20 retrieve"></span>
                회수
              </v-btn>
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1">({{ gridTotalCnt }})</em> 건</span>
            </div>
          </div>
          <v-data-table
            class="pl-grid has-control is-hover"
            v-model="CHK_ITEMS"
            show-select
            single-select
            :headers="gridDataHeaders"
            :items="gridDataText"
            :item-class="isActiveRow"
            fixed-header
            item-key="index"
            height="562px"
            :items-per-page="ROW_PER_PAGE"
            hide-default-footer
            :page.sync="page"
            no-data-text="등록된 데이터가 없습니다."
            @page-count="pageCount = $event"
            @click:row="rowSelect">
            <template v-slot:item.STTS_NM="{ item }">
              <span :class="`pl-round-chip is-sm chat-stat-${displayStatus(item.STTS_CD)}`">
                {{ item.STTS_NM }}
              </span>
            </template>
            <template v-slot:item.STTS_CD="{ item }">
                <!-- click:row 가 함께 실행되는 것을 막기 위해 click 대신 click.stop 로 변경하기 위해 compo-tooltip-btn 컴포넌트 사용 안함. -->
                <v-tooltip
                  v-if="parseInt(item.HSTRY_CNT) > 0"
                  v-bind="tooltipPositionComputed"
                  :content-class="`pl-tooltip `"
                  >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      class="pl-tooltip-btn"
                      min-width="30"
                      height="30"
                      plain
                      @click.stop="openSttsHistory(item)"
                    >
                    <v-icon
                      small
                      :class="['pl-icon20 document', {'rotate': false}]">
                    </v-icon>
                    </v-btn>
                  </template>
                  <span v-html="newLine('검토 의견 보기')"></span>
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

            <span class="pl-pager-period">보기 {{ mixin_getPagePeriod(gridDataText, page) }} / {{ gridDataText.length }}</span>
          </div>
        </div>
        <!-- 미리보기 -->
        <div class="pl-card is-col-fix" style="width: 410px">
          <div class="pl-survey-preview-wrap">
            <div class="pl-phone-bg">
              <SVY_PREVIEW
                v-if="isOpenPreview"
                :previewCall="pData"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 검토 의견 보기 다이얼로그 -->
    <CompoSvySttsHistory
      v-if="dialogOpenSttsHistory"
      :DataProp="{'SRVY_ID': HISTORY_SRVY_ID}"
      @closeDialog="closeSttsHistory"
    />
    <!-- 설문 상태 변경 다이얼로그(승인, 반려, 회수)-->
    <CompoSvyUpdateStts
      v-if="dialogOpenSttsUpdate"
      :DataProp="{'SRVY_ID': UPDATE_SRVY_ID, 'STTS_CD': UPDATE_STTS_CD}"
      @updateParent="btnSelectList"
      @closeDialog="closeSttsUpdate"
    />
  </div>
</template>

<script>
import SVY_PREVIEW from '@/views/page/SVY_PREVIEW.vue';
import CompoSvySttsHistory from '@/components/svy/CompoSvySttsHistory.vue';
import CompoSvyUpdateStts from '@/components/svy/CompoSvyUpdateStts.vue';

  export default {
  name: "MENU_SVY_M0500", //name은 'MENU_' + 파일명 조합
  components: {
    SVY_PREVIEW,
    CompoSvySttsHistory,
    CompoSvyUpdateStts,
  },
  data() {
    return {
      //검토 의견 보기 다이얼로그 오픈 여부
      dialogOpenSttsHistory: false, 
      //검토 의견 보기 설문_ID
      HISTORY_SRVY_ID: '',

      dialogOpenSttsUpdate: false,
      //업데이트할 설문_ID
      UPDATE_SRVY_ID: '',
      //업데이트할 상태_코드
      UPDATE_STTS_CD: '',


      //미리보기 컴포넌트 출력 여부
      isOpenPreview: false,
      //미리보기 데이터
      pData: {id:-1, view: true},

      //공통코드
      common_code: [],
      //검색조건
      srvyYrItems: [],

      //el v-model 변수
      SRVY_YR: '',
      SRVY_SE_CD: '',
      STTS_CD: '',
      SRVY_NM: '',

      //목록에서 체크된 항목 목록
      CHK_ITEMS: [],
      


      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      },
      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
      nextDisabled:true,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼

      gridTotalCnt: 0,
      gridDataHeaders: [
        { text: '번호',               value: 'ROW_NUMBER',        align: 'center', width: '80px' },
        { text: '진행년도',           value: 'SRVY_YR_NM',        align: 'left',   width: '95px' },
        { text: '설문조사명',         value: 'SRVY_NM',           align: 'left',   width: '100%' },
        { text: '설문시작일',         value: 'SRVY_BGNG_DT',      align: 'center', width: '100px' },
        { text: '설문종료일',         value: 'SRVY_END_DT',       align: 'center', width: '100px' },
        { text: '계획구분',           value: 'SRVY_SE_NM',        align: 'center', width: '120px' },
        { text: '목표인원',           value: 'GOAL_PSNAL',        align: 'center', width: '100px' },
        { text: '진행상태',           value: 'STTS_NM',           align: 'center', width: '100px' },
        { text: '검토 의견',          value: 'STTS_CD',           align: 'center', width: '90px', sortable: false },
        { text: '등록자',             value: 'RGTR_ID',           align: 'center', width: '100px' },
        { text: '등록일',             value: 'REG_DT',            align: 'center', width: '170px' },
      ],
      gridDataText: [],
      // 미리보기
      pData: {},
      selectedRow : null,

      //confirm alert 메시지
      MESSAGE : {
        ALERT : {
          CHECK_NON : {alertDialogToggle: true, msg: '체크된 항목이 존재하지 않습니다.', iconClass: 'is-caution', type: 'default'}
          , DEN_APPR_STTS : {alertDialogToggle: true, msg: '승인대기 설문만<br/>승인 처리가 가능합니다.', iconClass: 'is-caution', type: 'default'}
          , DEN_RFSL_STTS : {alertDialogToggle: true, msg: '승인대기, 승인회수 설문만<br/>반려 처리가 가능합니다.', iconClass: 'is-caution', type: 'default'}
          , DEN_RTRVL_STTS : {alertDialogToggle: true, msg: '승인완료, 게시완료 설문만<br/>회수 처리가 가능합니다.', iconClass: 'is-caution', type: 'default'}
          , ONE_SELECT_CONTS : {alertDialogToggle: true, msg: '하나의 설문만 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST : {
          SUCCESS : {msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 3000}
        },
      },

    }
  },
  watch: {

  },

  computed: {
    tooltipPositionComputed() {
      return {
        [`${'bottom'}`]: true
      }
    }
  },

  async created() {
    //공통코드설정
    let codeName = [
                     'SUVY_CL'
                    ,'PROG_ST'
                  ];
    this.common_code = await this.mixin_common_code_get_all(codeName, 'Y');

    //진행년도 설정(금년기준 -5, +5)
    const date = new Date();
    const curYear = date.getFullYear();
    this.srvyYrItems.push({ text: '전체', value: '' });   // default
    for (let i = -5; i < 5; i++) {
      this.srvyYrItems.push({ text: `${curYear + i}년`, value: (curYear + i).toString() });
    }
    this.SRVY_YR =  curYear.toString();
    
  },

  mounted() {
    
    this.btnSelectList(false);
  },

  methods: {
    aaaaaaaaaaaaaa() {
      console.log("aaaaaaaaaaaaaa")
    },
    init() {
      this.isOpenPreview = false;
      this.CHK_ITEMS = [];
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
    

    //row 선택
    rowSelect(idx) {
      this.selectedRow = idx;
      this.setPreview()
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    //설문 미리보기 출력
    async setPreview(){
      this.isOpenPreview = false;
      this.pData = { 'id' : this.selectedRow.SRVY_ID, 'view' : true };
      this.isOpenPreview = true;
    },

    //승인 상태 업데이트
    openUpdateStts(sttsCd) {
      this.UPDATE_SRVY_ID = '';
      this.UPDATE_STTS_CD = '';
      let chkItems = this.CHK_ITEMS;
      if( chkItems.length < 1 ) {
        this.showAlert(this.MESSAGE.ALERT.CHECK_NON);
        return;
      } else if( chkItems.length > 1 ) {
        this.showAlert(this.MESSAGE.ALERT.ONE_SELECT_CONTS);
        return;
      }

      let arrStts = [];
      for( var i = 0 ; i < chkItems.length ; i++ ) {
        arrStts.push(chkItems[i].STTS_CD);
      }

      let chkSttsCd = chkItems[0].STTS_CD;

      let tmpMsg = "";
      let isPass = true;
      switch( sttsCd ) {
        case "APPR" : 
          if( chkSttsCd !== "RDY" ){ 
            isPass = false; 
            tmpMsg = this.MESSAGE.ALERT.DEN_APPR_STTS;
          }
          break;
        case "RFSL" : 
          if( !(chkSttsCd === "RDY" || chkSttsCd === "RTRVL" ) ){ 
            isPass = false; 
            tmpMsg = this.MESSAGE.ALERT.DEN_RFSL_STTS;
          }
          break;
        case "RTRVL" : 
          if(!(chkSttsCd === "APPR" || chkSttsCd === "PUBCMP" )){ 
            isPass = false; 
            tmpMsg = this.MESSAGE.ALERT.DEN_RTRVL_STTS;
          }
          break;
        default : break;
      }
      if( !isPass ) {
        this.showAlert(tmpMsg);
        return;
      }

      this.UPDATE_SRVY_ID = chkItems[0].SRVY_ID;
      this.UPDATE_STTS_CD = sttsCd;
      this.dialogOpenSttsUpdate = true;
    },

    closeSttsUpdate() {
      this.UPDATE_SRVY_ID = '';
      this.UPDATE_STTS_CD = '';
      this.dialogOpenSttsUpdate = false;
    },

    //검토 의견 보기
    openSttsHistory(item) {
      this.HISTORY_SRVY_ID = item.SRVY_ID;
      this.dialogOpenSttsHistory = true;
    },
    closeSttsHistory() {
      this.HISTORY_SRVY_ID = '';
      this.dialogOpenSttsHistory = false;
    },

    //그리드 컬럼 색상 설정
    // getColor(e){
    //   switch(e){
    //     case 'PRPARG' : return 'green'
    //     case 'PUBCMP' : return 'blue'
    //     case 'ONGONG' : return 'orange'
    //     case 'TERMIAT' : return 'red'
    //     default : 'black'
    //   }
    // },
    displayStatus(type) {
      const typeList = [
        { type_list_text: 'wait', type_list_type: 'PRPARG' }, //준비중, 주황
        { type_list_text: 'wait', type_list_type: 'RDY' }, //승인대기, 주황
        { type_list_text: 'wait', type_list_type: 'RFSL' }, //승인반려, 주황
        { type_list_text: 'wait', type_list_type: 'RTRVL' }, //승인회수, 주황
        { type_list_text: 'done', type_list_type: 'APPR' }, //승인완료 녹색
        { type_list_text: 'cs', type_list_type: 'PUBCMP' }, //승인완료 녹색
        { type_list_text: 'cs', type_list_type: 'ONGONG' }, //진행중 파란색
        { type_list_text: 'after', type_list_type: 'TERMIAT' }, //종료 보라색
      ];

      for (let i = 0; i < typeList.length; i++) {
        if (typeList[i].type_list_type === type) {
          return typeList[i].type_list_text;
        }
      }
    },

    newLine(title) {
      if (!title) return;
      return title.split("\n").join("<br>");
    },

  },

}
</script>
<style lang="scss" scoped>
</style>