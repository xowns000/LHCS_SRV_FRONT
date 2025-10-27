<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols flex-grow-1">
        <!-- left -->
        <div class="is-col-fix is-vrt" style="width: 500px">
          <!-- tree -->
          <div class="pl-card">
            <div class="pl-tree-header">
              <div class="is-left">
                <label>지식 분류</label>
              </div>
              <div class="is-right">
                <!-- 새로고침 버튼 -->
                <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault','expanded')">전체 펼치기</v-btn>
                <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault', 'expanded')">전체 접기</v-btn>
                <compo-tooltip-btn
                  TitleProp="새로고침"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="bottom"
                  @btnClick="pageRefresh">
                </compo-tooltip-btn>
              </div>
            </div>
            <div class="pl-tree-body" style="height: 680px;">
              <v-treeview ref="treeDefault"
                :items="treeItems"
                :open-all="expanded"
                item-key="id"
                :open.sync="treeOpenSync"
                activatable
                return-object
                :open-on-click=false
                @update:active="srch_tree_act"
                color="secondary"
                class="pl-tree-view">
                <template v-slot:prepend="{ item, open }">
                  <v-icon v-if="item.children">
                    {{ open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder' }}
                  </v-icon>
                  <v-icon v-else>
                    {{ 'pl-icon20 tree-file' }}
                  </v-icon>
                </template>
                <template v-slot:label="{item}">
                  <div v-html="item.name"></div>
                </template>
              </v-treeview>
            </div>
          </div>
        </div>
        <!-- right -->
        <v-form ref="gridForm">
          <div class=" is-vrt">
            <div class="pl-card ">
              <h2 class="pl-subtit"><span v-show=" KMS_CLSF_NM !== '' " v-text=" '( ' +  KMS_CLSF_NM + ' ) ' "></span>콘텐츠 현황</h2>
              <div class="pl-search-form is-mt-m pb-0">
                <div class="pl-form-inline-wrap">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      콘텐츠 상태
                    </span>
                    <div class="pl-desc">
                      <v-select class="pl-form" v-model="CONTS.STTS_CD" :items="contsSttsCdDropItems" placeholder="콘텐츠 상태"></v-select>
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      지식 구분
                    </span>
                    <div class="pl-desc">
                      <v-select class="pl-form" v-model="CONTS.SE_CD" :items="contsSeCdDropItems" placeholder="지식 구분"></v-select>
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      지식 콘텐츠
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form"
                        v-model="CONTS.KMS_CONTS_NM"
                        placeholder="검색어 입력"
                        @keyup.enter="getContsList"
                        ></v-text-field>
                    </div>
                  </div>
                </div>
                <v-btn class="pl-btn is-icon ml-2" @click=" getContsList ">
                  <span class="pl-icon20 search"></span>
                  조회
                </v-btn>
              </div>
            </div>
            <div class="pl-card">
              <div class="pl-grid-top">
                <div class="pl-grid-top-left">
                  <v-btn class="pl-btn is-icon is-sub"
                    :disabled=" (CONTS.ITEMS.length < 1 || CONTS.IS_PIC_DISABLED ) "
                    @click="detailView">
                    <span class="pl-icon20 document"></span>
                    선택항목 상세
                  </v-btn>
                  <v-btn class="pl-btn is-icon is-sub"
                    :disabled=" CONTS.IS_PIC_DISABLED "
                    @click="regConts">
                    <span class="pl-icon20 circle-plus"></span>
                    등록
                  </v-btn>
                  <v-btn class="pl-btn is-icon is-sub"
                    :disabled=" (CONTS.ITEMS.length < 1 || CONTS.IS_PIC_DISABLED ) "
                    @click="contsRvReq">
                    <span class="pl-icon20 grid-request"></span>
                    검토요청
                  </v-btn>
                  <v-btn class="pl-btn is-icon is-sub"
                    :disabled=" (CONTS.ITEMS.length < 1 || CONTS.IS_PIC_DISABLED ) "
                    @click="sttsUpdate('PBIC')">
                    <span class="pl-icon20 grid-open"></span>
                    공개
                  </v-btn>
                  <v-btn class="pl-btn is-icon is-sub"
                    :disabled=" (CONTS.ITEMS.length < 1 || CONTS.IS_PIC_DISABLED ) "
                    @click="sttsUpdate('APPR')"
                    >
                    <span class="pl-icon20 grid-close"></span>
                    비공개
                  </v-btn>
                  <v-btn class="pl-btn is-icon is-sub"
                    :disabled=" (CONTS.ITEMS.length < 1 || CONTS.IS_PIC_DISABLED ) "
                    @click="sttsUpdate('DELT')">
                    <span class="pl-icon20 trash"></span>
                    삭제
                  </v-btn>
                  <v-btn class="pl-btn is-icon is-sub"
                    :disabled=" (CONTS.ITEMS.length < 1 || CONTS.IS_PIC_DISABLED ) "
                    @click="sttsUpdate('WRTG')">
                    <span class="pl-icon20 grid-restore"></span>
                    복원
                  </v-btn>
                  <v-btn class="pl-btn is-icon is-sub"
                    :disabled=" (CONTS.ITEMS.length < 1 || CONTS.IS_PIC_DISABLED ) "
                    @click="sortOrdUpdateReq()">
                    <span class="pl-icon20 sortRefresh"></span>
                  표시 순서 재정렬
                  </v-btn>
                </div>
                <div class="pl-grid-top-utils">
                  <span class="pl-counter">전체 <em class="pl-1">({{ CONTS.ITEMS.length }})</em> 건</span>
                  <!-- 엑셀 다운로드 버튼 -->
                  <compo-excel
                    TypeProp="Download"
                    :DataHeaderProp="CONTS.HEADERS"
                    :DataBodyProp="CONTS.ITEMS"
                    :FileNameProp="'지식 콘텐츠 관리_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                    SheetNameProp="지식 콘텐츠 관리"
                    HeaderColorProp="00B0F0"
                  ></compo-excel>
                </div>
              </div>
              <v-data-table
                class="pl-grid has-control"
                v-model="CONTS.CHK_ITEMS"
                :headers="CONTS.HEADERS"
                :items="CONTS.ITEMS"
                :item-class="isActiveRow"
                fixed-header
                show-select
                item-key="KMS_CONTS_ID"
                height="527px"
                :items-per-page="ROW_PER_PAGE"
                hide-default-footer
                :page.sync="CONTS.PAGE"
                @page-count="CONTS.PAGE_COUNT = $event"
                @click:row="rowSelect"
                @dblclick:row="contsDbClick"
                no-data-text="등록된 데이터가 없습니다."
                >
                <!-- @toggle-select-all="handleHeaderCheckboxClick($event, 'CONTS.ITEMS', 'grid_all_chk')" -->
                <!-- <template v-slot:item.STTS_NM="{ item }">
                    <span :class=" item.STTS_CD_CLASS " v-text=" item.STTS_NM ">
                    </span>
                </template> -->
                <template v-slot:item.STTS_NM="{ item }">
                  <span
                    v-if="item.STTS_CD != 'RFSL'"
                    :class="`pl-round-chip is-sm chat-stat-${item.STTS_CD_CLASS}`"
                  >
                    {{ item.STTS_NM }}

                  </span>
                  <span
                    v-else
                    class="pl-chip-hover"
                    :class="`pl-round-chip is-sm chat-stat-${item.STTS_CD_CLASS}`"
                    @click="openContsReviewHistory(item)"
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
                    :items="CONTS.PER_PAGE"
                    :item-text="toString(ROW_PER_PAGE)"
                    @change="ROW_PER_PAGE = parseInt($event, 10);"
                  ></v-select>
                </div>
                <v-pagination
                  v-model="CONTS.PAGE"
                  :length="CONTS.PAGE_COUNT"
                  circle
                  :total-visible="7">
                </v-pagination>

                <!-- 더보기 다음 있을때만 노출 -->
                <span class="pl-pager-period">
                  보기 {{ mixin_getPagePeriod(CONTS.ITEMS, CONTS.PAGE) }} / {{ CONTS.ITEMS.length }}
                  <compo-tooltip-btn
                      TitleProp="다음 검색"
                      ClassProp="pl-tooltip-btn is-line"
                      IconProp="pl-icon20 arrow-next-paging"
                      TooltipPositionProp="bottom"
                      :DisabledProp="nextDisabled"
                      @btnClick="getContsList('next')"
                  ></compo-tooltip-btn>
                </span>
              </div>

            </div>
          </div>
        </v-form>
      </div>
    </div>


    <!-- dialog -->
    <!-- 검토 요청 -->
    <v-dialog v-model="dialogRequest" content-class="dialog-draggable" hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog header-title="검토 요청" @hide="mixin_hideDialog('Request')" @submit="submitDialog('Request')">
        <template slot="body">
          <v-form ref="rvReqForm">
            <KMS_M0301_DLG_REQUEST ref="dlgRvReq"
              v-model="RV_REQ"
              :validateRules="reqValidateRules"
            >
            </KMS_M0301_DLG_REQUEST>
          </v-form>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('Request')">취소</v-btn>
          <v-btn class="pl-btn" @click="chkRvReq">검토요청</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- 검토 이력 (검토요청, 반려) -->
    <v-dialog v-if="dialogReview" v-model="dialogReview" content-class="dialog-draggable is-scroll" hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog header-title="검토 이력" @hide="mixin_hideDialog('Review')">
        <template slot="body">
            <KMS_M0301_DLG_REVIEW ref="dlgRvwHstry"
              v-model="REVIEW_KMS_CONTS_ID"
            >
            </KMS_M0301_DLG_REVIEW>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('Review')">닫기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- 지식 콘텐츠 등록 -->
    <v-dialog
      v-model="dialogKmsRegContent"
      content-class="dialog-draggable is-xg is-nopadding is-maxHeight"
      :retain-focus="false"
      style="max-height: 100%">
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="지식 콘텐츠 등록"
          @hide="colseContentDialog"
          @submit="submitDialog('KmsRegContent')">
          <template slot="body">
          <KMS_M0301_DLG_REG_CONTENT
            v-if="dialogKmsRegContent"
            ref="KmsRegContent"
            :KMS_CONTS_ID="CONTS_INFO.KMS_CONTS_ID"
            :KMS_CLSF_INFO="selectedNode">
          </KMS_M0301_DLG_REG_CONTENT>
          </template>
          <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="colseContentDialog">닫기</v-btn>
          <v-btn class="pl-btn" @click="saveContent">저장</v-btn>
          </template>
      </compo-dialog>
    </v-dialog>



  </div>
</template>

<script>
import KMS_M0301_DLG_REG_CONTENT from './KMS_M0301_DLG_REG_CONTENT.vue';
import KMS_M0301_DLG_REQUEST from './KMS_M0301_DLG_REQUEST.vue';
import KMS_M0301_DLG_REVIEW from './KMS_M0301_DLG_REVIEW.vue';

export default {
  name: "MENU_KMS_M0300", //name은 'MENU_' + 파일명 조합

  components: {
    KMS_M0301_DLG_REG_CONTENT
    , KMS_M0301_DLG_REQUEST
    , KMS_M0301_DLG_REVIEW
  },

  data() {
    return {
      // tree
      expanded: false,
      treeItems: [],
      selectedNode : null,

      common_code : [],           // 공통코드
      contsSttsCdDropItems: [],   //콘텐츠 상태
      contsSeCdDropItems: [],   //지식 구분

      KMS_CLSF_ID : "", // 선택 지식분류 ID
      KMS_CLSF_NM : "", // 선택 지식분류 명

      // dialog
      dialogKmsRegContent : false,
      dialogRequest: false,
      dialogReview: false,
      addTagValue: '',
      inputTagSize: '',
      // tags: [
      //   { text: '할인', active: true },
      //   { text: '청약', active: true },
      //   { text: '청약상품안내', active: true },
      //   { text: '금리 조정', active: true },
      // ],

      ROW_PER_PAGE: 15 ,

      // 콘텐츠 목록
      RV_REQ : {
        CN : "" ,
        KMS_CONTS_ID : [],
      },

      pagination: {
          page: 1,
          rowsPerPage: 500,
          sortBy: "",
          descending: ""
        }, //그리드 페이지속성정의
      nextDisabled:true,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼

      CONTS : {
        HEADERS :[
            { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px', sortable: false }
            , { text: '지식 ID', value: 'KMS_CONTS_ID', align: 'center', width: '90px', sortable: false }
            , { text: '지식 구분', value: 'SE_NM', align: 'center', width: '130px', sortable: false }
            , { text: '지식 콘텐츠', value: 'KMS_CONTS_NM', align: 'left', sortable: false }
            , { text: '상태', value: 'STTS_NM', align: 'center', width: '120px', sortable: false }
            , { text: '표시 순서', value: 'SORT_ORD', align: 'center', width: '90px', sortable: false }
            , { text: '등록일', value: 'REG_DT_F', align: 'left', width: '100px' }
            , { text: '등록자', value: 'RGTR_NM', align: 'left', width: '100px', sortable: false }
        ]
        , ITEMS : []
        , CHK_ITEMS : []
        , STTS_CD : ""
        , SE_CD : ""
        , KMS_CONTS_NM : ""
        , PAGE : 1
        , PAGE_COUNT: 0
        , PER_PAGE: [15, 30, 50, 100]
        , selectedRow : null
        , IS_PIC_DISABLED : true
      },

      CONTS_INFO : {
        KMS_CLSF_ID : ""
        , KMS_CLSF_PATH : ""
        , IS_OPEN : ""
        , STTS_CD : ""
        , KMS_CONTS_ID : ""
        , KMS_CONTS_NM : ""
        , SORT_ORD : ""
      },
      //검토 이력 다이얼로그 지식 콘텐츠 ID
      REVIEW_KMS_CONTS_ID : "",

      // excel 변수
      table_body:{},
      table_head:{},
      file_name : "",
      sheet_name : "",
      header_color : "4C5CBB",

      // grid
      editedIndex: -1,
      hoverRow: null,
      grid_all_chk: false,

      // 가이드 목차 관리
      dialogGuideIndex: false,
      dialogGuideReg: false,
      dialogGuideKmsReg: false,
      dialogTemplate: false,
      tab: null,

      dialogFindContent: false,

      // 콘텐츠 찾기
      expanded2: false,
      treeOpenSync: [],
      treeItems2: [
        {
          id: 1,
          name: 'menu1 :',
          children: [
            { id: 2, name: 'menu1-1' },
            { id: 3, name: 'menu1-2' },
            { id: 4, name: 'menu1-3' },
          ],
        },
      ],
      page3: 1,
      pageCount3: 0,
      perPage3: [15,30,50,100],
      ROW_PER_PAGE3: -1,
      headers3: [
        { text: '번호', value: 'index', align: 'center', width: '80px', sortable: false },
        { text: '콘텐츠 ID', value: 'type', align: 'center', width: '120px' },
        { text: '지식 콘텐츠', value: 'subject', sortable: false},
        { text: '수정일', value: 'date', align: 'center', width: '120px', sortable: false },
      ],

      valid : true,

      reqValidateRules: {
        CN : [
          v => !!v || '검토요청 내용 은(는) 필수 입력 항목 입니다.',
        ],
      },

      //confirm alert 메시지
      MESSAGE : {
        CONFIRM : {
          REG : {alertDialogToggle: true, msg: '내용을 저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.saveConts, callNo: this.closeMsg}
          , REQ_REG : {alertDialogToggle: true, msg: '내용을 저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.saveRvReq, callNo: this.closeMsg}
          , DEL : {alertDialogToggle: true, msg: '선택된 항목을 삭제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.expsnAttrDel, callNo: this.closeMsg}
          , REQ_REORDER_SORT_ORD : {alertDialogToggle: true, msg: '선택된 항목 이후의 콘텐츠의 표시 순서를 재정렬 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.sortOrdUpdate, callNo: this.closeMsg}
        },
        ALERT : {
          NON_EXCEL_DATA : {alertDialogToggle: true, msg: '다운로드 할 내용이 존재하지 않습니다.', iconClass: 'is-caution', type: 'default'}
          , CHECK_NON : {alertDialogToggle: true, msg: '체크된 항목이 존재하지 않습니다.', iconClass: 'is-caution', type: 'default'}
          , CHECK_CLSF : {alertDialogToggle: true, msg: '지식분류를 선택 해주세요 ', iconClass: 'is-caution', type: 'default'}
          , CHECK_CLSF_AND_DIS : {alertDialogToggle: true, msg: '본인이 관리하는 지식분류를 선택 해주세요 ', iconClass: 'is-caution', type: 'default'}
          , NOT_CHILD_CLSF : {alertDialogToggle: true, msg: '최하위 분류에서만<br/>컨텐츠 등록이 가능합니다.', iconClass: 'is-caution', type: 'default'}
          , DEN_PBIC_STTS : {alertDialogToggle: true, msg: '승인된 컨텐츠만<br/>공개 처리가 가능합니다.', iconClass: 'is-caution', type: 'default'}
          , DEN_APPR_STTS : {alertDialogToggle: true, msg: '공개중인 컨텐츠만<br/>비공개 처리가 가능합니다.', iconClass: 'is-caution', type: 'default'}
          , DEN_DELT_STTS : {alertDialogToggle: true, msg: '이미 삭제된 컨텐츠가<br/>존재 합니다.', iconClass: 'is-caution', type: 'default'}
          , DEN_WRTG_STTS : {alertDialogToggle: true, msg: '삭제된 컨텐츠만<br/>복원 처리가 가능합니다.', iconClass: 'is-caution', type: 'default'}
          , DEN_RVRQ_STTS : {alertDialogToggle: true, msg: '작성중인 컨텐츠만<br/>검토요청이 가능합니다.', iconClass: 'is-caution', type: 'default'}
          , SELECT_CONTS : {alertDialogToggle: true, msg: '콘텐츠를 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
          , ONE_SELECT_CONTS : {alertDialogToggle: true, msg: '하나의 콘텐츠만 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
          , DATA_LEN_ERR : {alertDialogToggle: true, msg: '길이는 <br>마이너스(-,음수)가 될 수 없습니다', iconClass: 'is-info', type: 'default'}
          , VALID : {alertDialogToggle: true, msg: '필수항목 확인 후<br>재시도 해주세요', iconClass: 'is-info', type: 'default'}
        },
        TOAST : {
          SUCCESS : {msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 3000}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        }
      },


    }
  },

  watch: {

  },

  computed: {
    computedTagSize() {
      return `flex: 0 0 ${this.inputTagSize + 12}ch;`;
    }
  },

  async created() {
    //공통코드설정
    let codeName = ['CONT_ST', 'KMS_CL'];
    this.common_code = await this.mixin_common_code_get_all(codeName);
    //콘텐츠 상태 콤보
    this.contsSttsCdDropItems = this.mixin_common_code_get(this.common_code, 'CONT_ST', '전체'); //확장구분 콤보
    //지식 구분 콤보
    this.contsSeCdDropItems = this.mixin_common_code_get(this.common_code, 'KMS_CL', '전체'); //확장구분 콤보

    this.getTreeList();
  },

  mounted() {

  },

  methods: {
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    colseContentDialog(item) {
      this.mixin_hideDialog('KmsRegContent')
      this.getContsList();
    },

    // tree
    expandAll(id,expand) {
      this[expand] = true;
      this.$refs[id].updateAll(true);
    },
    collapseAll(id,expand) {
      this[expand] = false;
      this.$refs[id].updateAll(false);
      this.openTreeRoot()
    },
    //root Tree Open
    openTreeRoot() {
      if(!!this.treeItems && this.treeItems.length > 0 && Number(this.treeItems[0]?.CHILD_CNT) > 0) {
        this.treeOpenSync = [{'id':this.treeItems[0].id}]
      }
    },

    // init Object
    initObject( objData ){
      if( objData != null && objData != undefined ) {
        switch( typeof(objData) ){
          case "object":
            if( Array.isArray( objData ) ){
              for( var i = 0 ; i < objData.length ; i++ ) {
                objData[i] = this.initObject(objData[i]);
              }
            } else {
              for( var key in objData ) {
                objData[key] = this.initObject( objData[key] );
              }
            }
            break;
          case "string"   : objData = "";              break;
          case "function" : objData = function(){};    break;
          case "boolean"  : objData = false;           break;
          case "symbol"   : objData = Symbol();        break;
          case "number"   :
          case "bigint"   : objData = 0;               break;
          default         : objData = null;            break;
        }
      }
      return objData;
    },

    // 새로고침
    pageRefresh(){
      this.getTreeList();
    },

    // 분류 Tree 데이터
    async getTreeList() {
      let sUrl = '/api/km/clsf/clsfTreeList';

      // Yabong TODO :  관리자 여부 확인 요망  -- 변경시 BE Query 도 변경 할 것
      let postParam = {
        ADM_YN : "Y"
      };

      let headParam = {
        head : {}
      };
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        if(response.KM_CLSF_TREE){
          this.treeItems = response.KM_CLSF_TREE;
          this.openTreeRoot()
        }
      }
    },

    // 분류 선택
    srch_tree_act( node ){
      var nodeData = node;
      this.selectedNode = nodeData[0];
      this.CONTS.CHK_ITEMS = [];
      if( this.selectedNode ) {
        this.KMS_CLSF_ID = this.selectedNode.KMS_CLSF_ID;
        this.KMS_CLSF_NM = this.selectedNode.KMS_CLSF_NM;
        this.CONTS.STTS_CD = "";
        this.CONTS.KMS_CONTS_NM = "";
        if( "Y" === this.selectedNode.PIC_USE_YN ) {
            this.CONTS.IS_PIC_DISABLED = false;
            this.getContsList();   // 분류 콘텐츠 선택시 검색
        } else {
          this.CONTS.IS_PIC_DISABLED = true;
          this.initContsList();
        }
      } else {
        this.CONTS.IS_PIC_DISABLED = true;
        this.selectedNode = null;
        this.initContsList();
      }
    },


    // 분류 선택 해제시 콘텐츠 정보 초기화
    initContsList(){
      this.KMS_CLSF_ID = "";
      this.KMS_CLSF_NM = "";
      this.CONTS.STTS_CD = "";
      this.CONTS.KMS_CONTS_NM = "";
      this.CONTS.PAGE = 1;
      this.CONTS.selectedRow = null;
      this.CONTS.ITEMS = [];
      this.CONTS.CHK_ITEMS = [];
      this.pagination.page = 1;
    },

    /*
      콘텐츠 현황 Method Start ~~~~~~ !
    */

    // 목록 조회
    async getContsList( gNext ){

      if( this.KMS_CLSF_ID === undefined || this.KMS_CLSF_ID === "" ){
        this.showAlert(this.MESSAGE.ALERT.CHECK_CLSF_AND_DIS);
        return;
      }

      this.CONTS.CHK_ITEMS = [];

      if( "next" === gNext ) {
        this.pagination.page += 1;
      } else {
        this.CONTS.PAGE = 1;
        this.pagination.page = 1;
        this.CONTS.ITEMS = [];
      }


      let sUrl = '/api/km/conts/selectContentList';
      let postParam = {
        KMS_CLSF_ID : this.KMS_CLSF_ID
        , STTS_CD : this.CONTS.STTS_CD
        , SE_CD : this.CONTS.SE_CD
        , KMS_CONTS_NM : this.CONTS.KMS_CONTS_NM
      }

      let headParam = {
        head : {
          ROW_CNT : this.pagination.rowsPerPage,
          PAGES_CNT : this.pagination.page,
          PAGING : "Y",
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        let tempDataText = response.DATA;
        this.CONTS.ITEMS = [...this.CONTS.ITEMS, ...tempDataText];    // ...append

        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }

      }

    },

    //row 선택
    rowSelect(idx) {
      this.CONTS.selectedRow = idx;
    },

    contsDbClick( data ){
      if( this.CONTS.selectedRow ) {
        this.CONTS.CHK_ITEMS = [];
        this.CONTS.CHK_ITEMS[0] = this.CONTS.selectedRow;
        this.openDetailConts( this.CONTS.selectedRow );
      }
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.CONTS.selectedRow ? "active" : "";
      return activeClass;
    },

    // 선택항목 상세보기
    detailView() {
      let chkCnt = this.CONTS.CHK_ITEMS.length;
      if( chkCnt < 1 ) {
        this.showAlert(this.MESSAGE.ALERT.SELECT_CONTS);
        return;
      } else if( chkCnt > 1 ) {
        this.showAlert(this.MESSAGE.ALERT.ONE_SELECT_CONTS);
        return;
      }
      this.openDetailConts( this.CONTS.CHK_ITEMS[0] );
    },

    // 등록 Dialog Open
    openDetailConts( objConts ){
      if( objConts && this.selectedNode ) {
        this.CONTS_INFO.KMS_CLSF_ID = this.selectedNode.KMS_CLSF_ID;
        this.CONTS_INFO.KMS_CLSF_PATH = this.selectedNode.FULL_PATH;
        this.CONTS_INFO.IS_OPEN = this.selectedNode.IS_OPEN;
        this.CONTS_INFO.STTS_CD = objConts.STTS_CD;
        this.CONTS_INFO.KMS_CONTS_ID = objConts.KMS_CONTS_ID;
        this.CONTS_INFO.KMS_CONTS_NM = objConts.KMS_CONTS_NM;
        this.CONTS_INFO.SORT_ORD = objConts.SORT_ORD;
        this.mixin_showDialog('KmsRegContent');
      }
    },

    // 컨텐츠 등록 버튼
    regConts(){
      if( this.selectedNode ) {
        // let childCnt = this.selectedNode.CHILD_CNT;
        // if( "0" !== childCnt ) {
        //   this.showAlert(this.MESSAGE.ALERT.NOT_CHILD_CLSF);
        //   return;
        // }
        let tmpObj = {
          STTS_CD : ""
          , KMS_CONTS_ID : ""
          , KMS_CONTS_NM : ""
          , SORT_ORD : ""
        }
        this.openDetailConts( tmpObj );
      } else {
        this.showAlert(this.MESSAGE.ALERT.CHECK_CLSF);
      }
    },

    // valid saveContent
    saveContent(){
      return this.$refs.KmsRegContent.saveContentValid();
    },

    // 컨텐츠 저장
    async saveConts(){
      this.closeMsg();
      let sUrl = '/api/km/conts/contsProc';
      let postParam = this.CONTS_INFO;

      let headParam = {
        head : {}
      };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (response.HEADER.ERROR_FLAG){
        this.mixin_hideDialog('Reg');
      }else{
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.mixin_hideDialog('Reg');
        this.getContsList();
        this.getTreeList();
      }
    },
    // 검토요청 Pop
    contsRvReq(){
      this.RV_REQ.CN = "";
      let chkCnt = this.CONTS.CHK_ITEMS.length;
      let objChkItem = this.CONTS.CHK_ITEMS;

      // CountChk
      if( chkCnt < 1 ) {
        this.showAlert(this.MESSAGE.ALERT.SELECT_CONTS);
        return;
      }
      else if( chkCnt > 1 ) {
        this.showAlert(this.MESSAGE.ALERT.ONE_SELECT_CONTS);
        return;
      }

      // 상태 Chk
      let isPass = true;
      this.RV_REQ.KMS_CONTS_ID = [];

      for( var i = 0 ; i < chkCnt ; i++ ){
        if( "WRTG" !== objChkItem[i].STTS_CD ) {
          isPass = false;
        }
        this.RV_REQ.KMS_CONTS_ID.push({ "KMS_CONTS_ID" : objChkItem[i].KMS_CONTS_ID});
      }

      if( !isPass ) {
        this.showAlert(this.MESSAGE.ALERT.DEN_RVRQ_STTS);
        return;
      }

      this.mixin_showDialog('Request');
    },

    chkRvReq(){
      if (!this.rvReqValidate()) {
        return;
      }
      this.showAlert(this.MESSAGE.CONFIRM.REQ_REG);
    },

    //validate check saveConts
    rvReqValidate () {
      return this.$refs.rvReqForm.validate();
    },

    // 검토요청
    saveRvReq(){
      this.closeMsg()
      let oParam = {
        CONTS_LIST : this.RV_REQ.KMS_CONTS_ID
        , STTS_CD : "RVRQ"
        , HIST_YN : "Y"
        , CN : this.RV_REQ.CN
      };

      this.procContsStts( oParam );
      this.mixin_hideDialog('Request');
    },

    // 콘텐트 상태변경
    sttsUpdate( sttsCd ) {
      let $this = this;
      /**
       * PBIC : 공개          --  승인된 컨텐츠만 변경 가능
       * APPR : 비공개(승인)  --   공개중인 컨텐츠만 변경 가능
       * DELT : 삭제          --  삭제된 컨텐츠 제외 모두 변경 가능
       * WRTG : 복원(작성중)   --  삭제된 컨텐츠만 변경 가능
       */

      // 선택항목 Items
      let chkConts = this.CONTS.CHK_ITEMS;

      if( chkConts.length < 1 ) {
        this.showAlert(this.MESSAGE.ALERT.SELECT_CONTS);
        return;
      }
      var arrStts = [], arrContsId = [];
      for( var i = 0 ; i < chkConts.length ; i++ ) {
        arrStts.push(chkConts[i].STTS_CD);
        arrContsId.push({ "KMS_CONTS_ID" : chkConts[i].KMS_CONTS_ID});
      }
      var tmpMsg = "";
      var isPass = true;

      switch( sttsCd ) {
        case "PBIC" :
          arrStts.forEach(function( val ){
            if( val !== "APPR" ){
              isPass = false;
              tmpMsg = $this.MESSAGE.ALERT.DEN_PBIC_STTS;
            }
          });
          break;
        case "APPR" :
          arrStts.forEach(function( val ){
            if( val !== "PBIC" ){
              isPass = false;
              tmpMsg = $this.MESSAGE.ALERT.DEN_APPR_STTS;
            }
          });
          break;
        case "DELT" :
          if( arrStts.indexOf("DELT") > -1 ) {
            isPass = false;
            tmpMsg = $this.MESSAGE.ALERT.DEN_DELT_STTS;
          }
          break;
        case "WRTG" :
          arrStts.forEach(function( val ){
            if( val !== "DELT" ){
              isPass = false;
              tmpMsg = $this.MESSAGE.ALERT.DEN_WRTG_STTS;
            }
          });
          break;
        default : break;
      }

      if( !isPass ) {
        this.showAlert(tmpMsg);
        return;
      }

      let oParam = {
        CONTS_LIST : arrContsId
        , STTS_CD : sttsCd
        , HIST_YN : "Y"
        , CN : ""
      }
      //삭제 시 SORT_ORD를 999로 업데이트(삭제 콘텐츠가 뒤로 밀리도록.)
      if(sttsCd == "DELT") {
        oParam.SORT_ORD = "999"
      }

      this.procContsStts( oParam );
    },

    // 콘텐츠 상태 변경 처리
    async procContsStts( objParam ){
      let sUrl = '/api/km/conts/contsProcStts';
      let postParam = objParam;

      let headParam = {
        head : {}
      };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.getContsList();
      }
    },


    // 콘텐츠 표시 순서 재정렬 - 선택한 아이템 이후의 정렬 순서 변경.
    sortOrdUpdateReq( ) {
      // 선택항목 Items
      let chkConts = this.CONTS.CHK_ITEMS

      if( chkConts.length < 1 ) {
        this.showAlert(this.MESSAGE.ALERT.SELECT_CONTS);
        return;
      } else if( chkConts.length > 1 ) {
        this.showAlert(this.MESSAGE.ALERT.ONE_SELECT_CONTS);
        return;
      }

      this.showAlert(this.MESSAGE.CONFIRM.REQ_REORDER_SORT_ORD);
    },

    async sortOrdUpdate( ) {
      this.closeMsg()
      let chkConts = this.CONTS.CHK_ITEMS
      let sUrl = '/api/km/conts/updateContentSortOrd';
      let postParam = {
        KMS_CLSF_ID : this.KMS_CLSF_ID,
        BASE_KMS_CONTS_ID : chkConts[0].KMS_CONTS_ID,
        BASE_SORT_ORD : chkConts[0].SORT_ORD,
      };

      let headParam = {
        head : {}
      };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.getContsList();
      }
    },


    // 검토 이력 다이얼로그 오픈
    async openContsReviewHistory(item) {
      this.REVIEW_KMS_CONTS_ID = item.KMS_CONTS_ID
      this.mixin_showDialog('Review')
    }

    /*
      콘텐츠 현황 Method End ~~~~~~ !
    */

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  },
}
</script>

<style lang="scss" scoped>

</style>