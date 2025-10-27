<template>
  <v-dialog
    v-if="dialogLoadSrvy"
    v-model="dialogLoadSrvy"
    width="1600"
    content-class="dialog-draggable is-nopadding is-maxHeight"
    hide-overlay
    @keydown.esc="closeDialog()"
    @click:outside="closeDialog()">
    <div class="draggable-area">drag area</div>
    <compo-dialog
      header-title="설문지 불러오기"
      @hide="closeDialog"
      @submit="submitDialog('LoadSrvy')"
    >
      <template slot="body">
        <div class="pl-cols">
          <!-- grid -->
          <div class="pl-card is-vrt">
            <div class="pl-search-form pb-0">
              <div class="pl-form-inline-wrap">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    진행 년도
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
                    <v-text-field class="pl-form is-lg" v-model="SRVY_NM" @keyup.enter="btnSelectList(false)"></v-text-field>
                  </div>
                </div>
                <v-btn class="pl-btn is-icon" @click="btnSelectList(false)">
                  <span class="pl-icon20 search"></span>
                  조회
                </v-btn>
              </div>
            </div>
            <div class="pl-grid-top">
              <div class="pl-grid-top-left">
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter">전체 <em class="pl-1">({{ gridTotalCnt }})</em> 건</span>
              </div>
            </div>
            <v-data-table
              class="pl-grid is-hover"
              :headers="gridDataHeaders"
              :items="gridDataText"
              v-model="gridSelectedData"
              fixed-header
              item-key="index"
              height="562px"
              :items-per-page="ROW_PER_PAGE"
              @click:row="rowSelect"
              hide-default-footer
              :page.sync="page"
              no-data-text="등록된 데이터가 없습니다."
              :item-class="isActiveRow"
              @page-count="pageCount = $event">
              <template v-slot:item.STTS_NM="{ item }">
                <span :class="`pl-round-chip is-sm chat-stat-${displayStatus(item.STTS_CD)}`">
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

              <span class="pl-pager-period">보기 {{ mixin_getPagePeriod(gridDataText, page) }} / {{ gridDataText.length }}
                <compo-tooltip-btn
                  TitleProp="다음 검색"
                  ClassProp="pl-tooltip-btn is-line"
                  IconProp="pl-icon20 arrow-next-paging"
                  TooltipPositionProp="bottom"
                  :DisabledProp="nextDisabled"
                  @btnClick="btnSelectList('true')"
                ></compo-tooltip-btn>
                <!-- <v-btn
                  class="pl-btn is-sub"
                  :disabled = "nextDisabled"
                  @click="btnSelectList(true)"
                  >다음 검색
                </v-btn> -->
              </span>
            </div>
          </div>
          <!-- preview -->
          
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
      </template>
      <template slot="footer">
        <v-btn class="pl-btn is-sub" @click="closeDialog">닫기</v-btn>
        <v-btn class="pl-btn" @click="btnLoad">불러오기</v-btn>
      </template>
    </compo-dialog>
  </v-dialog>
</template>

<script>

import SVY_PREVIEW from '@/views/page/SVY_PREVIEW.vue';
export default {
  name: "MENU_SVY_M0200_DLG_LOAD_SVY", //설문지 불러오기
  components: {
    SVY_PREVIEW,
  },
  props: {
    DataProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data() {
    return {
      isDevelopment: process.env.VUE_APP_ENV === 'local' || process.env.VUE_APP_ENV === 'devserver',

      dialogLoadSrvy: true,

      //el v-model 변수
      SRVY_YR: '',
      SRVY_SE_CD: '',
      STTS_CD: '',
      SRVY_NM: '',

      // top search
      common_code: [],
      srvyYrItems: [],
      srvyYnCmbItems: [],

      //설문 미리보기 여부
      isOpenPreview : false,


      
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      }, //그리드 페이지속성정의
      nextDisabled:true,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
      gridTotalCnt: 0,
      gridDataHeaders: [
        { text: '번호',               value: 'ROW_NUMBER',        align: 'center', width: '80px' },
        { text: '진행년도',           value: 'SRVY_YR_NM',        align: 'left',   width: '100px' },
        { text: '설문조사명',         value: 'SRVY_NM',           align: 'left',   width: '100%' },
        { text: '설문시작일',         value: 'SRVY_BGNG_DT_F',      align: 'center', width: '140px' },
        { text: '설문종료일',         value: 'SRVY_END_DT_F',       align: 'center', width: '140px' },
        { text: '계획구분',           value: 'SRVY_SE_NM',        align: 'center', width: '120px' },
        { text: '진행상태',           value: 'STTS_NM',           align: 'center', width: '100px' },
        { text: '등록그룹수',         value: 'GRP_CNT',           align: 'center', width: '100px' },
      ],
      gridDataText: [],
      gridSelectedData: [],      // 그리드 체크박스 값
      selectedRow : {},           // 그리드 선택 값
      
      //설문 ID - 설문지
      SRVY_ID: '',
      
      //미리보기 항목
      pData: {id:-1, view: true},


      MESSAGE : {
          CONFIRM : {
            REG : {alertDialogToggle: true, msg: '선택한 설문 계획의 설문지를 불러오시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.setSaveYes, callNo: this.closeMsg}
            
          },
          ALERT : {
            SELECT_ITEM : {alertDialogToggle: true, msg: '설문 계획을 선택해 주십시오.', iconClass: 'is-info', type: 'default'}
          },
          TOAST : {
            SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 },
          },
      }
    }
  },
  watch: {
    
  },

  computed: {
    
  },

  async created() {
    this.SRVY_ID = this.DataProp.SRVY_ID;
    //공통코드설정
    let codeName = [
                     'SUVY_CL'
                    ,'PROG_ST'
                  ];
    this.common_code = await this.mixin_common_code_get_all(codeName, 'Y');
  },
  mounted() {
    this.mixin_showDialog('LoadSrvy');

    //진행년도 설정(금년기준 -5, +5)
    const date = new Date();
    const curYear = date.getFullYear();
    this.srvyYrItems.push({ text: '전체', value: '' });   // default
    for (let i = -5; i < 5; i++) {
      this.srvyYrItems.push({ text: `${curYear + i}년`, value: (curYear + i).toString() });
      //등록팝업 년도 설정 (금년도부터 내년)
      if(i === 0 || i === 1){
        this.srvyYnCmbItems.push({ text: `${curYear + i}년`, value: (curYear + i).toString() });
      }
    }
    this.SRVY_YR =  curYear.toString();
    this.btnSelectList(false);
  },

  methods: {
    //초기화
    init(){
      const date = new Date();
      const curYear = date.getFullYear();
    },
    
    //조회
    async btnSelectList(next){
      //다음버튼 클릭 유무
      if (!next){
        this.init();
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
          'SERVICE' : 'svy.plan.selectlistplan',
          'METHOD' : 'selectlistplan',
          'TYPE' : 'BIZ_SERVICE',
          'ROW_CNT' : this.pagination.rowsPerPage,
          'PAGES_CNT' : this.pagination.page,
          'PAGING' : "Y",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {

        if(resData.DATA.length > 0){
          resData.DATA.forEach((data, idx) => {
            data.SRVY_BGNG_DT_F = data.SRVY_BGNG_DT.indexOf('-')>-1?data.SRVY_BGNG_DT:this.mixin_convertDate(data.SRVY_BGNG_DT, 'yyyy-MM-dd HH:mm:ss');
            data.SRVY_END_DT_F = data.SRVY_END_DT.indexOf('-')>-1?data.SRVY_END_DT:this.mixin_convertDate(data.SRVY_END_DT, 'yyyy-MM-dd HH:mm:ss');
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


    setPreview() {
      this.pData =  {id: this.selectedRow.SRVY_ID, view: true}
      this.isOpenPreview = true;
    },

    //불러오기 버튼
    btnLoad() {
      if(this.mixin_isEmpty(this.selectedRow.SRVY_ID)) {
        this.showAlert(this.MESSAGE.ALERT.SELECT_ITEM);
        return
      }
      this.showAlert(this.MESSAGE.CONFIRM.REG);

    },

    //설문 복사 실행(설문 헤더, 설문 그룹 및 문항, 응답설정)
    async setSaveYes(){
      const sUrl = '/api/svy/makeitems/copySrvy';
      let postParam = {
        SRVY_ID: this.SRVY_ID,
        COPY_SRVY_ID: this.selectedRow.SRVY_ID,
      }
      const headParam = {
        head: {}
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (!resData.HEADER.ERROR_FLAG) {
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeMsg();
        this.$emit('reloadParentComp', true);
        this.closeDialog();
      }
    },

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

    //메시지창 종료
    closeMsg(){
      this.$store.commit('alertStore/hideAlert');
    },

    closeDialog() {
      this.$emit("closeLoadSvy");
    }
  },
};
</script>

<style lang="scss" scoped></style>