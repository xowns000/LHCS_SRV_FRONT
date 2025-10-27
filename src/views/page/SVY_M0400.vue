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
                <label>설문 분류</label>
              </div>
              <div class="is-right">
                <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault')">전체 펼치기</v-btn>
                <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault')">전체 접기</v-btn>
                <compo-tooltip-btn
                  TitleProp="새로고침"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="bottom"
                  @btnClick="getTreeList">
                </compo-tooltip-btn>
              </div>
            </div>
            <div class="pl-tree-body" style="height: 620px;">
              <v-treeview
                ref="treeDefault"
                activatable
                return-object
                :items="treeItems"
                :open-all="expanded"
                item-key="id"
                :open.sync="treeOpenSync"
                :open-on-click=false
                @update:active="srch_tree_act"
                color="secondary"
                class="pl-tree-view">
                <template v-slot:prepend="{ item, open }">
                  <v-icon v-if="item.children">
                      {{open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder'}}
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
          <div class="pl-card is-bottom">
            <!-- new folder 버튼 -->
            <compo-tooltip-btn TitleProp="생성" ClassProp="pl-tooltip-btn" IconProp="pl-icon20 is-new-folder"
              TooltipPositionProp="top" @btnClick="makeClsf"></compo-tooltip-btn>
            <!-- 수정 버튼 -->
            <compo-tooltip-btn TitleProp="수정" ClassProp="pl-tooltip-btn" IconProp="pl-icon20 edit"
              TooltipPositionProp="top" @btnClick="openDlgClsfDetail"></compo-tooltip-btn>
            <!-- 삭제 버튼 -->
            <compo-tooltip-btn TitleProp="삭제" ClassProp="pl-tooltip-btn" IconProp="pl-icon20 trash"
              TooltipPositionProp="top" @btnClick="delClsfCheck"></compo-tooltip-btn>
            <div class="is-right">
            <!-- list up 버튼 -->
            <compo-tooltip-btn TitleProp="순서 위로" ClassProp="pl-tooltip-btn" IconProp="pl-icon20 is-list-up"
              TooltipPositionProp="top" @btnClick="clsfMove('up')"></compo-tooltip-btn>
            <!-- list down 버튼 -->
            <compo-tooltip-btn TitleProp="순서 아래로" ClassProp="pl-tooltip-btn" IconProp="pl-icon20 is-list-down"
              TooltipPositionProp="top" @btnClick="clsfMove('down')"></compo-tooltip-btn>
            </div>
          </div>
        </div>
        
        <!-- right -->
        <!-- right -->
        <v-form ref="gridForm">
          <div class=" is-vrt">
            <div class="pl-card ">
              <h2 class="pl-subtit"><span v-if=" selectedNode && selectedNode.SRVY_CLSF_NM !== '' " v-text=" '( ' +  selectedNode.SRVY_CLSF_NM + ' ) ' "></span>설문문항 현황</h2>
              <div class="pl-search-form is-mt-m pb-0">
                <div class="pl-form-inline-wrap">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      질문 유형
                    </span>
                    <div class="pl-desc">
                      <v-select class="pl-form" v-model="searchCondition.QITEM_TYPE_CD" :items="suvyQstTpList" placeholder="질문 유형"></v-select>
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      공개 여부
                    </span>
                    <div class="pl-desc">
                      <v-select class="pl-form" v-model="searchCondition.RLS_YN" :items="selectGroupRlsYn" placeholder="공개 여부"></v-select>
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      질문 제목
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form"
                        v-model="searchCondition.SRVY_QITEM_CN"
                        placeholder="검색어 입력"
                        @keyup.enter="getSrvyQitemList"
                        ></v-text-field>
                    </div>
                  </div>
                </div>
                <v-btn class="pl-btn is-icon ml-2" 
                  @click="getSrvyQitemList"
                  :disabled="!selectedNode">
                  <span class="pl-icon20 search"></span>
                  조회
                </v-btn>
              </div>
            </div>
            <div class="pl-card">
              <div class="pl-grid-top">
                <div class="pl-grid-top-left">
                  <v-btn class="pl-btn is-icon is-sub"
                    :disabled="(qitemList.length < 1 || !selectedNode )"
                    @click="openSrvyQitemDetail">
                    <span class="pl-icon20 document"></span>
                    선택항목 상세
                  </v-btn>
                  <v-btn class="pl-btn is-icon is-sub"
                    :disabled="!selectedNode"
                    @click="regSrvyQitem">
                    <span class="pl-icon20 circle-plus"></span>
                    등록
                  </v-btn>
                  <v-btn class="pl-btn is-icon is-sub"
                    :disabled="(qitemList.length < 1 || !selectedNode )"
                    @click="deleteSrvyQitemCheck">
                    <span class="pl-icon20 trash"></span>
                    삭제
                  </v-btn>
                </div>
                <div class="pl-grid-top-utils">
                  <span class="pl-counter">전체 <em class="pl-1">({{ qitemList.length }})</em> 건</span>
                </div>
              </div>
              <v-data-table
                class="pl-grid has-control"
                v-model="checkedQitemList"
                :headers="qitemHeaders"
                :items="qitemList"
                :item-class="isActiveRow"
                fixed-header
                show-select
                item-key="SRVY_QITEM_ID"
                height="527px"
                :items-per-page="ROW_PER_PAGE"
                hide-default-footer
                :page.sync="page"
                @page-count="pageCount = $event"
                @click:row="rowSelect"
                @dblclick:row="openSrvyQitemDbClick"
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

                <!-- 더보기 다음 있을때만 노출 -->
                <span class="pl-pager-period">
                  보기 {{ mixin_getPagePeriod(qitemList, page) }} / {{ qitemList.length }}
                  <compo-tooltip-btn
                      TitleProp="다음 검색"
                      ClassProp="pl-tooltip-btn is-line"
                      IconProp="pl-icon20 arrow-next-paging"
                      TooltipPositionProp="bottom"
                      :DisabledProp="nextDisabled"
                      @btnClick="getSrvyQitemList('next')"
                  ></compo-tooltip-btn>
                </span>
              </div>

            </div>
          </div>
        </v-form>
      </div>
    </div>
    <SVY_M0400_DLG_CLSF_DETAIL
      v-if="isOpenDlgClsfDetail"
      :DataProp="{'DETAIL_INFO': detailInfo}"
      @getTreeList="getTreeList()"
      @clickClose="isOpenDlgClsfDetail=false"
    />
    <!-- SRVY_QITEM_TMPL 모드로 호출 -->
    <CompoSvyQitemDetail
      v-if="isOpenDlgSvyQitemDetail"
      :DataProp="{'MNG_TYPE': 'SRVY_QITEM_TMPL', 'SRVY_QITEM': detailSrvyQitem}"
      @clickClose="isOpenDlgSvyQitemDetail=false"
      @reloadParentComp="reloadList()"
    />
  </div>
</template>

<script>
import SVY_M0400_DLG_CLSF_DETAIL from './SVY_M0400_DLG_CLSF_DETAIL.vue';
import CompoSvyQitemDetail from '@/components/svy/CompoSvyQitemDetail';
export default {
  name: "MENU_SVY_M0400", //설문문항 관리

  components: {
    SVY_M0400_DLG_CLSF_DETAIL,
    CompoSvyQitemDetail
  },
 data() {
    return {
      //----- 좌측 설문 분류 Data -----//
      //설문분류 다이얼로그 오픈 여부
      isOpenDlgClsfDetail: false,
      // tree
      expanded: false,
      treeOpenSync: [],
      // Org Data
      orgData : [],
      treeItems: [],
      // form
      activeItem:[],
      selectedNode: null,
      // 분류 상세정보
      detailInfo : {
        CHILD_MAX_ORD : "" ,
        CUSTCO_ID : "" ,
        FULL_PATH : "" ,
        SRVY_CLSF_EXPLN : "" ,
        SRVY_CLSF_ID : "" ,
        SRVY_CLSF_NM : "" ,
        SRVY_CLSF_NM_F : "" ,
        LVL : "",
        CONTS_CNT : "" ,
        LGN_ID : "" ,
        SORT_ORD : "" ,
        MIN_ORD : "" ,
        MAX_ORD : "" ,
        PRE_ORD : "" ,
        NEXT_ORD : "" ,
        UP_SRVY_CLSF_ID : "" ,
        UP_SRVY_CLSF_NM : "" ,
        USE_YN : ""
      },


      //----- 우측 설문 문항 Data -----//
      //설문문항 다이얼로그 오픈 여부
      isOpenDlgSvyQitemDetail: false,
      //검색 조건
      searchCondition : {
        QITEM_TYPE_CD: '',
        RLS_YN: '',
        SRVY_QITEM_CN: ''
      },
      //질문 유형 목록 - 공통코드 - SUVY_QST_TP
      suvyQstTpList: [],
      //공개 여부 group
      selectGroupRlsYn: [
        { text: "전체", value: ""},
        { text: "공개", value: "Y"},
        {text: "비공개",value: "N"}
      ],
      

      qitemList: [],
      qitemHeaders: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px', sortable: false},
        { text: '질문 제목', value: 'SRVY_QITEM_CN', align: 'left', sortable: false},
        { text: '질문 유형', value: 'QITEM_TYPE_NM', align: 'center', width: '120px', sortable: false},
        { text: '보기 개수', value: 'CHC_CNT', align: 'center', width: '150px', sortable: false},
        { text: '공개 여부', value: 'RLS_YN_NM', align: 'center', width: '120px', sortable : false },
        { text: '등록일', value: 'REG_DT_F', align: 'center',  width: '120px', sortable : false },
        { text: '등록자', value: 'RGTR_NM', align: 'left',  width: '120px', sortable : false },
      ],
      //설문문항 목록에서 체크된 설문문항 목록
      checkedQitemList:[],


      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],  //그리드 페이지당 표시항목
      ROW_PER_PAGE: 15,
      nextDisabled:true,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
      selectedRow : null,
      //선택된 설문 항목
      selectedSrvyQitem: {},

      //상세에 보여질 설문 항목
      detailSrvyQitem: {},
      
      

      valid : true,
      validateRules: {
        SRVY_CLSF_NM: [
          v => !!v || '분류명은 필수 입력 항목 입니다.',
        ],
        UP_SRVY_CLSF_NM: [
          v => !!v || '상위분류 명 은(는) 필수 입력 항목 입니다.',
        ],
        USE_YN: [
          v => !!v || '공개여부 은(는) 필수 입력 항목 입니다.',
        ],
      },

      //confirm alert 메시지
      MESSAGE : {
        CONFIRM : {
          REG : {alertDialogToggle: true, msg: '저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.clsfSave, callNo: this.closeMsg}
          , SAVE : {alertDialogToggle: true, msg: '저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.clsfSave, callNo: this.closeMsg}
          , DEL : {alertDialogToggle: true, msg: '선택된 항목을 삭제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.delClsf, callNo: this.closeMsg}
          , DEL_SRVY_QITEM : {alertDialogToggle: true, msg: '선택된 항목을 삭제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.deleteSrvyQitemList, callNo: this.closeMsg}
        },
        ALERT : {
          CHANGE_NO : {alertDialogToggle: true, msg: '이동이 불가 합니다.', iconClass: 'is-caution', type: 'default'}
          , EXIST_CHILD : {alertDialogToggle: true, msg: '하위 분류가 존재 합니다.', iconClass: 'is-caution', type: 'default'}
          , ADD_NO_SELECTED : {alertDialogToggle: true, msg: '추가할 분류의 상위 분류를  선택해 주세요.', iconClass: 'is-caution', type: 'default'}
          , NO_ROOT_SAVE : {alertDialogToggle: true, msg: '고객사 정보는 수정(저장) 할 수 없습니다.', iconClass: 'is-caution', type: 'default'}
          , NO_ROOT_MOVE : {alertDialogToggle: true, msg: '고객사 정보는 이동 할 수 없습니다.', iconClass: 'is-caution', type: 'default'}
          , NO_ADD_CLSF : {alertDialogToggle: true, msg: '컨텐츠가 존재합니다.<br/>분류를 추가할 수 없습니다.', iconClass: 'is-caution', type: 'default'}
          , NO_DEL_CLSF : {alertDialogToggle: true, msg: '설문 문항이 존재하는 분류를<br/>삭제할 수 없습니다.', iconClass: 'is-caution', type: 'default'}
          , NO_SELECTED : {alertDialogToggle: true, msg: '설문 분류를 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
          , SELECT_QITEM : {alertDialogToggle: true, msg: '설문항목을 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
          , SELECT_ONE_QITEM : {alertDialogToggle: true, msg: '하나의 설문항목만 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
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

  },

  beforeDestroy(){
  },

  async created() {
    await this.getTreeList();
    this.openTreeRoot();
    //공통코드설정
    let codeName = [
                    'SUVY_QST_TP'  //설문 질문유형
                  ];
    this.common_code = await this.mixin_common_code_get_all(codeName, 'Y');
    this.suvyQstTpList = this.mixin_common_code_get(this.common_code, 'SUVY_QST_TP', '전체')
  },

  mounted() {

  },

  methods: {
    // tree
    expandAll(id){
      this.expanded = true;
      this.$refs[id].updateAll(true);
    },
    collapseAll(id){
      this.expanded = false;
      this.$refs[id].updateAll(false);
      this.openTreeRoot()
    },
    //root Tree Open
    openTreeRoot() {
      if(!!this.treeItems && this.treeItems.length > 0 && Number(this.treeItems[0]?.CHILD_CNT) > 0) {
        this.treeOpenSync = [{'id':this.treeItems[0].id}]
      }
    },

    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    // 분류 새로고침
    schGetTreeList(){
      this.getTreeList();
      this.$refs.form.reset();
    },

    // 분류 Tree 데이터
    async getTreeList() {
      let sUrl = '/api/svy/tmpl/clsfTreeList';
      let postParam = {};

      let headParam = {
        head : {}
      };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        if(response.SRVY_CLSF_TREE){
          this.treeItems = response.SRVY_CLSF_TREE;
        }
        if(response.DATA){
          this.orgData = response.DATA;

          // 선택된 Node 가 있다면 재 조회시 해당 정보 Reload...
          if( this.selectedNode !== null && this.selectedNode.SRVY_CLSF_ID !== undefined && this.selectedNode.SRVY_CLSF_ID !== "" ) {
            for( var i = 0 ; i < this.orgData.length ; i++ ) {
              var tmpData = this.orgData[i];
              if( tmpData.SRVY_CLSF_ID === this.selectedNode.SRVY_CLSF_ID ) {
                this.srch_tree_act([tmpData]);
                break;
              }
            }
          }
        }

      }
    },

    // 상세정보 초기화
    setInitDetailData(){
      this.detailInfo ={
        CHILD_MAX_ORD : "" ,
        CUSTCO_ID : "" ,
        FULL_PATH : "" ,
        SRVY_CLSF_EXPLN : "" ,
        SRVY_CLSF_ID : "" ,
        SRVY_CLSF_NM : "" ,
        SRVY_CLSF_NM_F : "" ,
        CONTS_CNT : "" ,
        LVL : "" ,
        LGN_ID : "" ,
        SORT_ORD : "" ,
        MIN_ORD : "" ,
        MAX_ORD : "" ,
        PRE_ORD : "" ,
        NEXT_ORD : "" ,
        UP_SRVY_CLSF_ID : "" ,
        UP_SRVY_CLSF_NM : "" ,
        USE_YN : ""
      };
    },

    srch_tree_act( node ){
      let tmpItems = node;
      this.selectedNode = tmpItems[0];
      if(node != null && node.length > 0) {
        this.setDetailData();
        this.getSrvyQitemList();
      } else {
        this.setInitDetailData();
      }
    },

    setDetailData() {
      this.detailInfo.CHILD_MAX_ORD = this.selectedNode.CHILD_MAX_ORD;
      this.detailInfo.CUSTCO_ID = this.selectedNode.CUSTCO_ID;
      this.detailInfo.FULL_PATH = this.selectedNode.FULL_PATH;
      this.detailInfo.SRVY_CLSF_EXPLN = this.selectedNode.SRVY_CLSF_EXPLN;
      this.detailInfo.SRVY_CLSF_ID = this.selectedNode.SRVY_CLSF_ID;
      this.detailInfo.SRVY_CLSF_NM = this.selectedNode.SRVY_CLSF_NM;
      this.detailInfo.SRVY_CLSF_NM_F = this.selectedNode.SRVY_CLSF_NM_F;
      this.detailInfo.LVL = this.selectedNode.LVL;
      this.detailInfo.CONTS_CNT = this.selectedNode.CONTS_CNT;
      this.detailInfo.LGN_ID = this.selectedNode.LGN_ID;
      this.detailInfo.SORT_ORD = this.selectedNode.SORT_ORD;
      this.detailInfo.UP_SRVY_CLSF_ID = this.selectedNode.UP_SRVY_CLSF_ID;
      this.detailInfo.UP_SRVY_CLSF_NM = this.selectedNode.UP_SRVY_CLSF_NM;
      this.detailInfo.USE_YN = this.selectedNode.USE_YN;
      this.detailInfo.MIN_ORD = this.selectedNode.MIN_ORD;
      this.detailInfo.MAX_ORD = this.selectedNode.MAX_ORD;
      this.detailInfo.PRE_ORD = this.selectedNode.PRE_ORD;
      this.detailInfo.NEXT_ORD = this.selectedNode.NEXT_ORD;
    },

    // 분류 생성
    makeClsf(){
      if( this.selectedNode ) {
        
        this.setInitDetailData();
        this.detailInfo.CUSTCO_ID = this.selectedNode.CUSTCO_ID;
        this.detailInfo.SORT_ORD = (parseInt(this.selectedNode.CHILD_MAX_ORD, 10)+1) + "";
        this.detailInfo.UP_SRVY_CLSF_ID = this.selectedNode.SRVY_CLSF_ID;
        this.detailInfo.UP_SRVY_CLSF_NM = this.selectedNode.SRVY_CLSF_NM;
        this.detailInfo.USE_YN = "Y";
        this.isOpenDlgClsfDetail = true;
      } else {
        this.showAlert(this.MESSAGE.ALERT.ADD_NO_SELECTED);
      }
    },

    //설문분류 상세 조회
    openDlgClsfDetail() {
      if(this.selectedNode) {
        this.setDetailData();
        this.isOpenDlgClsfDetail = true;
      } else {
        this.showAlert(this.MESSAGE.ALERT.NO_SELECTED);
      }
    },

    // confirm Delete
    delClsfCheck() {
      if(this.selectedNode){
        let iChildOrd = this.selectedNode.CHILD_MAX_ORD;
        // 하위분류 여부로 삭제 Check 할 건지 ..?
        if( "0" !== iChildOrd ) {
          this.showAlert(this.MESSAGE.ALERT.EXIST_CHILD);
        } else {
          this.showAlert(this.MESSAGE.CONFIRM.DEL)
        }
      }else{
        this.showAlert(this.MESSAGE.ALERT.NO_SELECTED);
      }
    },

    // 분류 삭제
    async delClsf(){
      this.closeMsg()
      if( this.selectedNode ) {
        let qItemCnt = this.selectedNode.QITEM_CNT;
        if( qItemCnt !== '0' ) {
          this.showAlert(this.MESSAGE.ALERT.NO_DEL_CLSF);
        } else {

          let sUrl = '/api/svy/tmpl/clsfDel';
          let postParam = {
            SRVY_CLSF_ID : this.detailInfo.SRVY_CLSF_ID
          };

          let headParam = {
            head : {}
          };

          let resData  = await this.common_postCall(sUrl, postParam, headParam);

          if (!resData.HEADER.ERROR_FLAG){
            this.showAlert(this.MESSAGE.TOAST.SUCCESS);
            this.schGetTreeList();
          }
        }
      } else {
        this.showAlert(this.MESSAGE.ALERT.NO_SELECTED);
      }

    },

    // 분류 번호 변경
    async clsfMove( sGb ){
      if( this.selectedNode ) {
        let chgOrd="0";
        if( "up" === sGb ) {  // 위로 이동
          let preOrd = this.selectedNode.PRE_ORD;
          if( "0" === preOrd ) {
            this.showAlert(this.MESSAGE.ALERT.CHANGE_NO);
            return;
          }
          chgOrd = preOrd;
        } else {              // 아래로 이동
          let nextOrd = this.selectedNode.NEXT_ORD;
          if( "0" === nextOrd ) {
            this.showAlert(this.MESSAGE.ALERT.CHANGE_NO);
            return;
          }
          chgOrd = nextOrd;
        }

        let sUrl = '/api/svy/tmpl/clsfOrderUpdate';
        let postParam = {
          SRVY_CLSF_ID : this.selectedNode.SRVY_CLSF_ID
          , UP_SRVY_CLSF_ID : this.selectedNode.UP_SRVY_CLSF_ID
          , SORT_ORD : this.selectedNode.SORT_ORD
          , CHG_ORD : chgOrd
        };

        let headParam = {
          head : {}
        };

        let resData  = await this.common_postCall(sUrl, postParam, headParam);

        if (!resData.HEADER.ERROR_FLAG){
          this.showAlert(this.MESSAGE.TOAST.SUCCESS);
          this.getTreeList();
        }
      } else {
        this.showAlert(this.MESSAGE.ALERT.NO_SELECTED);
      }
    },


    //////////////////////////////////////////////////////////////////
    //설문문항 조회
    async getSrvyQitemList() {
      let sUrl = '/api/svy/tmpl/selectTmplItemList';
      let postParam = {
        SRVY_CLSF_ID : this.selectedNode.SRVY_CLSF_ID
        , QITEM_TYPE_CD: this.searchCondition.QITEM_TYPE_CD
        , RLS_YN: this.searchCondition.RLS_YN
        , SRVY_QITEM_CN: this.searchCondition.SRVY_QITEM_CN
      };

      let headParam = {
        head : {}
      };

      let resData  = await this.common_postCall(sUrl, postParam, headParam);

      if (!resData.HEADER.ERROR_FLAG){
        this.qitemList = resData.DATA;
      }
    },
    //설문문항 등록 버튼
    regSrvyQitem() {
      this.detailSrvyQitem = {};
      if( this.selectedNode ) {
        this.selectedSrvyQitem = {
          SRVY_CLSF_ID : this.selectedNode.SRVY_CLSF_ID
        }
        this.detailSrvyQitem =  _.cloneDeep(this.selectedSrvyQitem);
        this.isOpenDlgSvyQitemDetail = true;
      } else {
        this.showAlert(this.MESSAGE.ALERT.NO_SELECTED);
      }
    },

    //설문문항 상세
    openSrvyQitemDetail(){
      let chkCnt = this.checkedQitemList.length;
      if( chkCnt < 1 ) {
        this.showAlert(this.MESSAGE.ALERT.SELECT_QITEM);
        return;
      } else if( chkCnt > 1 ) {
        this.showAlert(this.MESSAGE.ALERT.SELECT_ONE_QITEM);
        return;
      }
      this.selectedSrvyQitem = this.checkedQitemList[0];
      this.openSrvyQitem();
    },
    openSrvyQitemDbClick() {
      this.selectedSrvyQitem = this.selectedRow;
      this.openSrvyQitem();
    },
    openSrvyQitem() {
      //변환할 정보 설정.
      this.detailSrvyQitem = {};
      this.detailSrvyQitem =  _.cloneDeep(this.selectedSrvyQitem);
      this.detailSrvyQitem.SRVY_QITEM_GROUP_NM = this.mixin_decode(this.selectedSrvyQitem.SRVY_QITEM_GROUP_NM)
      this.detailSrvyQitem.SRVY_QITEM_CN = this.mixin_decode(this.selectedSrvyQitem.SRVY_QITEM_CN)
      this.detailSrvyQitem.SRVY_QITEM_EXPLN = this.mixin_decode(this.selectedSrvyQitem.SRVY_QITEM_EXPLN)
      this.detailSrvyQitem.HR_APLCN_YN = (this.selectedSrvyQitem.HR_APLCN_YN === 'Y' ? true : false)
      this.detailSrvyQitem.SCR_USE_YN = (this.selectedSrvyQitem.SCR_USE_YN === 'Y' ? true : false)
      this.detailSrvyQitem.GROUP_MVMN_USE_YN = (this.selectedSrvyQitem.GROUP_MVMN_USE_YN === 'Y' ? true : false)

      //다이얼로그 오픈
      this.isOpenDlgSvyQitemDetail = true;
    },

    //설문문항 삭제 체크
    deleteSrvyQitemCheck() {
      let chkCnt = this.checkedQitemList.length;
      if( chkCnt < 1 ) {
        this.showAlert(this.MESSAGE.ALERT.SELECT_QITEM);
        return;
      }
      this.showAlert(this.MESSAGE.CONFIRM.DEL_SRVY_QITEM)
    },
    //설문문항 삭제
    async deleteSrvyQitemList() {
      var arrSrvyQitemId = [];
      let chkCnt = this.checkedQitemList.length;
      for( var i = 0 ; i < chkCnt ; i++ ) {
        arrSrvyQitemId.push({ "SRVY_QITEM_ID" : this.checkedQitemList[i].SRVY_QITEM_ID});
      }

      let sUrl = '/api/svy/tmpl/deleteTmplItemList';
      let postParam = {
        SRVY_QITEM_ID_LIST : arrSrvyQitemId
        , SRVY_CLSF_ID : this.selectedNode.SRVY_CLSF_ID
      }
      let headParam = {head : {}};
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.closeMsg();
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.reloadList();
        this.checkedQitemList = [];
      }
    },

    //row 선택
    rowSelect(idx) {
      this.selectedRow = idx;
    },
    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    //설문 항목 변경 시 트리, 설문 목록 재조회
    reloadList() {
      this.getTreeList();
      this.getSrvyQitemList();
    },
    

    //validate check
    validate () {
      return this.$refs.form.validate();
    },

    

  },
}
</script>

<style lang="scss" scoped>

</style>