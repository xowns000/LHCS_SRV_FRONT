<template>
  <v-dialog
    v-if="dialogSrvyQuestionTemplate"
    v-model="dialogSrvyQuestionTemplate"
    width="1600"
    content-class="dialog-draggable is-nopadding"
    hide-overlay
    @keydown.esc="closeDialog()"
    @click:outside="closeDialog()">
    <div class="draggable-area">drag area</div>
    <compo-dialog
      header-title="질문 불러오기"
      @hide="closeDialog"
      @submit="submitDialog('OpenQuestionTemplate')"
    >
      <template slot="body">
        <div class="pl-cols">
          <!-- tree -->
          <div class="pl-card is-col-fix is-vrt" style="width: 410px">
            <div class="pl-tree-header">
              <div class="is-left">
                <label>설문문항 분류</label>
              </div>
              <div class="is-right">
                <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault')">전체 펼치기</v-btn>
                <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault')">전체 접기</v-btn>
              </div>
            </div>
            <div class="pl-tree-body">
              
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
          <!-- grid -->
          <div class="pl-card is-vrt">
            <div class="pl-search-form pb-0">
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
                    질문 제목
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form"
                      v-model="searchCondition.SRVY_QITEM_CN"
                      placeholder="검색어 입력"
                      @keyup.enter="getSrvyQitemList"
                    />
                  </div>
                </div>
              </div>
              <v-btn class="pl-btn is-icon ml-2"
                @click="getSrvyQitemList">
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
            </div>
            <div class="pl-grid-top">
              <div class="pl-grid-top-left">
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter">전체 <em class="pl-1">({{ qitemList.length }})</em> 건</span>
              </div>
            </div>
            <v-data-table
              class="pl-grid has-control"
              v-model="selectedItems"
              show-select
              :headers="qitemHeaders"
              :items="qitemList"
              :item-class="isActiveRow"
              fixed-header
              item-key="SRVY_QITEM_ID"
              height="462px"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              :page.sync="page"
              @page-count="pageCount = $event"
              @click:row="rowSelect"
              
            />
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
                ></compo-tooltip-btn>
              </span>
            </div>
          </div>
          <!-- preview -->
          
          <div class="pl-card is-col-fix" style="width: 320px">
            <h2 class="pl-subtit">설문문항 미리보기</h2>
                <div class="pl-svy-preview is-preview" style="padding:0">
                  <div class="pl-svy-preview-wrap flex-grow-1" style="padding: 15px 0">
                    <div class="pl-svy-preview-content">
                      <!-- 단일 선택형 설문 -->
                      <template v-if="qitem.QITEM_TYPE_CD === 'SNGL'" >
                        <CompoSvyPreviewSngl
                          ref="qitemRefs"
                          :key="qitem.SRVY_QITEM_ID"
                          :DataProp="{'vFlag':vFlag, 'qitem': qitem, 'qitemIdx': qitemIdx, 'CURRENT_QITEM_IDX': CURRENT_QITEM_IDX}"
                        />
                      </template>

                      <!-- 복수 선택형 설문 -->
                      <template v-if="qitem.QITEM_TYPE_CD === 'MULT'">
                        <CompoSvyPreviewMult
                          ref="qitemRefs"
                          :key="qitem.SRVY_QITEM_ID"
                          :DataProp="{'vFlag':vFlag, 'qitem': qitem, 'qitemIdx': qitemIdx, 'CURRENT_QITEM_IDX': CURRENT_QITEM_IDX}"
                        />
                      </template>
                      
                      <!-- 주관식 단답형 설문 -->
                      <template v-if="qitem.QITEM_TYPE_CD === 'SHOT'">
                        <CompoSvyPreviewShot
                          ref="qitemRefs"
                          :key="qitem.SRVY_QITEM_ID"
                          :DataProp="{'vFlag':vFlag, 'qitem': qitem, 'qitemIdx': qitemIdx, 'CURRENT_QITEM_IDX': CURRENT_QITEM_IDX}"
                        />
                      </template>
                      
                      <!-- 주관식 서술형 설문 -->
                      <template v-if="qitem.QITEM_TYPE_CD === 'DESC'">
                        <CompoSvyPreviewDesc
                          ref="qitemRefs"
                          :key="qitem.SRVY_QITEM_ID"
                          :DataProp="{'vFlag':vFlag, 'qitem': qitem, 'qitemIdx': qitemIdx, 'CURRENT_QITEM_IDX': CURRENT_QITEM_IDX}"
                        />
                      </template>

                      <!-- 날짜 선택형 설문 -->
                      <template v-if="qitem.QITEM_TYPE_CD === 'DATE'">
                        <CompoSvyPreviewDate
                          ref="qitemRefs"
                          :key="qitem.SRVY_QITEM_ID"
                          :DataProp="{'vFlag':vFlag, 'qitem': qitem, 'qitemIdx': qitemIdx, 'CURRENT_QITEM_IDX': CURRENT_QITEM_IDX}"
                        />
                      </template>
                    </div>
                  </div>
                </div>
          </div>
        </div>
      </template>
      <template slot="footer">
        <v-btn class="pl-btn is-sub" @click="closeDialog">닫기</v-btn>
        <v-btn class="pl-btn" @click="loadSrvyItem">불러오기</v-btn>
      </template>
    </compo-dialog>
  </v-dialog>
</template>

<script>

import CompoSvyPreviewSngl from '@/components/svy/CompoSvyPreviewSngl';
import CompoSvyPreviewMult from '@/components/svy/CompoSvyPreviewMult';
import CompoSvyPreviewShot from '@/components/svy/CompoSvyPreviewShot';
import CompoSvyPreviewDesc from '@/components/svy/CompoSvyPreviewDesc';
import CompoSvyPreviewDate from '@/components/svy/CompoSvyPreviewDate';
export default {
  name: "MENU_SVY_M0200_DLG_TEMPLATE", //설문문항 관리 템플릿 불러오기
  components: {
    CompoSvyPreviewSngl,
    CompoSvyPreviewMult,
    CompoSvyPreviewShot,
    CompoSvyPreviewDesc,
    CompoSvyPreviewDate,
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

      dialogSrvyQuestionTemplate: true,
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

      //질문 유형 목록 - 공통코드 - SUVY_QST_TP
      suvyQstTpList: [],
      //검색 조건
      searchCondition : {
        QITEM_TYPE_CD: '',
        SRVY_QITEM_CN: ''
      },
      qitemList: [],
      qitemHeaders: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px', sortable: false},
        { text: '질문 제목', value: 'SRVY_QITEM_CN', align: 'left', sortable: false},
        { text: '질문 유형', value: 'QITEM_TYPE_NM', align: 'center', width: '120px', sortable: false},
        { text: '보기 개수', value: 'CHC_CNT', align: 'center', width: '150px', sortable: false},
        { text: '등록일', value: 'REG_DT_F', align: 'center',  width: '120px', sortable : false },
        { text: '등록자', value: 'RGTR_NM', align: 'left',  width: '120px', sortable : false },
      ],

      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],  //그리드 페이지당 표시항목
      ROW_PER_PAGE: 15,
      nextDisabled:true,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
      
      selectedItems: [],//체크 박스 선택
      selectedRow : null,//row 클릭 선택
      
      //미리보기 항목
      SRVY_QITEM_GROUP_ID: '',
      qitem: {},
      vFlag: true,
      qitemIdx:0,
      CURRENT_QITEM_IDX:0,
      gQuData: {},


      MESSAGE : {
          CONFIRM : {
            REG : {alertDialogToggle: true, msg: '선택한 문항을 불러오시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.setQuSaveYes, callNo: this.closeMsg}
            
          },
          ALERT : {
            SELECT_ITEM : {alertDialogToggle: true, msg: '불러올 문항을 선택해 주십시오.', iconClass: 'is-info', type: 'default'}
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
    this.SRVY_QITEM_GROUP_ID = this.DataProp.SRVY_QITEM_GROUP_ID;
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
    this.mixin_showDialog('SrvyQuestionTemplate');
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


    // 분류 Tree 데이터
    async getTreeList() {
      let sUrl = '/api/svy/tmpl/clsfTreeList';
      let postParam = {
        RLS_YN: 'Y'
      };

      let headParam = {
        head : {}
      };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
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


    srch_tree_act( node ){
      let tmpItems = node;
      this.selectedNode = tmpItems[0];
      let SRVY_CLSF_ID = "";
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


    async getSrvyQitemList() {
      this.selectedItems = [];
      let sUrl = '/api/svy/tmpl/selectTmplItemList';
      let postParam = {
        SRVY_CLSF_ID : this.selectedNode.SRVY_CLSF_ID
        , QITEM_TYPE_CD: this.searchCondition.QITEM_TYPE_CD
        , RLS_YN: 'Y'
        , SRVY_QITEM_CN: this.searchCondition.SRVY_QITEM_CN
      };

      let headParam = {head : {}};
      let resData  = await this.common_postCall(sUrl, postParam, headParam);
      if (!resData.HEADER.ERROR_FLAG){
        this.selectedRow = {};
        this.qitemList = resData.DATA;
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


    async setPreview() {

      const sUrl = '/api/svy/tmpl/selectPreviewQitem';
      const postParam = {
        SRVY_QITEM_ID: this.selectedRow.SRVY_QITEM_ID
      }
      const headParam = {
        head: {}
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );


      if (!resData.HEADER.ERROR_FLAG) {
        if(resData.DATA.length > 0){
          this.CHC_LIST = resData.DATA;
          
          //항목id 중복제거
          this.QITEM_LIST = this.CHC_LIST.filter((item1, idx1)=>{
            return this.CHC_LIST.findIndex((item2, idx2)=>{
              item2.SRVY_QITEM_EXPLN = this.mixin_decode(item2.SRVY_QITEM_EXPLN);
              item2.SRVY_QITEM_CN = this.mixin_decode(item2.SRVY_QITEM_CN);

              return item1.SRVY_QITEM_ID == item2.SRVY_QITEM_ID;
            }) == idx1;
          });

          this.gQuData = _.cloneDeep(this.QITEM_LIST[0]);
          
          this.QITEM_LIST.map((tmpQitem) => {
            let filteredChcList = this.CHC_LIST.filter((chc)=>{
              return tmpQitem.SRVY_QITEM_ID == chc.SRVY_QITEM_ID;
            });
            tmpQitem.CHC_LIST = _.cloneDeep(filteredChcList);
            if(tmpQitem.QITEM_TYPE_CD == 'MULT') {
              tmpQitem.RSPNS = {QITEM_CHC_ID:{}, RSPNS_CN:''}
            } else {
              tmpQitem.RSPNS = [];
            }
          });

          this.qitem = this.QITEM_LIST[0]
        }
      }

    },




    loadSrvyItem() {
      if(this.selectedItems.length == 0) {
        this.showAlert(this.MESSAGE.ALERT.SELECT_ITEM);
        return
      }
      this.showAlert(this.MESSAGE.CONFIRM.REG);

    },

    //문항저장실행
    async setQuSaveYes() {
      let qtemGroupData = {};
      let qitemChcData = {};
      let isSucc = true;
      for(let i = 0; i < this.selectedItems.length; i++) {
        const copyItem = this.selectedItems[i];
        const cUrl = '/api/svy/tmpl/selectPreviewQitem';
        let cPostParam = {
          SRVY_QITEM_ID: copyItem.SRVY_QITEM_ID
        }
        let cHeadParam = {
          head: {}
        }

        let cResData = await this.common_postCall(cUrl, cPostParam, cHeadParam );


        if (!cResData.HEADER.ERROR_FLAG) {
          if(cResData.DATA.length > 0){
            let chcList = cResData.DATA;
            
            //항목id 중복제거
            let qitemList = chcList.filter((item1, idx1)=>{
              return chcList.findIndex((item2, idx2)=>{
                item2.SRVY_QITEM_EXPLN = this.mixin_decode(item2.SRVY_QITEM_EXPLN);
                item2.SRVY_QITEM_CN = this.mixin_decode(item2.SRVY_QITEM_CN);

                return item1.SRVY_QITEM_ID == item2.SRVY_QITEM_ID;
              }) == idx1;
            });

            qtemGroupData = _.cloneDeep(qitemList[0]);
            
            qitemList.map((tmpQitem) => {
              let filteredChcList = chcList.filter((chc)=>{
                return tmpQitem.SRVY_QITEM_ID == chc.SRVY_QITEM_ID;
              });
              tmpQitem.CHC_LIST = _.cloneDeep(filteredChcList);
              if(tmpQitem.QITEM_TYPE_CD == 'MULT') {
                tmpQitem.RSPNS = {QITEM_CHC_ID:{}, RSPNS_CN:''}
              } else {
                tmpQitem.RSPNS = [];
              }
            });

            qitemChcData = qitemList[0]
          }
        }

        
        const sUrl = '/api/svy/makeitems/upsertitemsmakeitems';
        let postParam = _.cloneDeep(qtemGroupData);

        let arrItemList = [];
        qitemChcData.CHC_LIST.forEach((e, i) => {
          arrItemList.push({
            QITEM_CHC_ID : '',
            SRVY_QITEM_ID : '',
            QITEM_CHC_CN : e.QITEM_CHC_CN,
            CSORT_ORD : (i+1).toString(),
            MVMN_SRVY_QITEM_GROUP_ID: qtemGroupData.GROUP_MVMN_USE_YN && e.CHC_MVMN_SRVY_QITEM_GROUP_ID ? e.CHC_MVMN_SRVY_QITEM_GROUP_ID : '',
            RSPNS_USE_YN: e.RSPNS_USE_YN,
            SCR: e.SCR,
          })
        });


        postParam.ANSWER_LIST = arrItemList;
        postParam.SRVY_QITEM_GROUP_ID = this.SRVY_QITEM_GROUP_ID;
        postParam.SRVY_QITEM_ID = '';
        const headParam = {
          head: {}
        }

        let resData = await this.common_postCall(sUrl, postParam, headParam );

        if (resData.HEADER.ERROR_FLAG) {
          isSucc = false;
          break;
        }
      }
      if(isSucc) {
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeMsg();
        this.$emit('reloadParentComp', true);
        this.closeDialog();
      }
      
      
    },

    //메시지창 종료
    closeMsg(){
      this.$store.commit('alertStore/hideAlert');
    },

    closeDialog() {
      this.$emit("closeQuestionTemplate");
    }
  },
};
</script>

<style lang="scss" scoped></style>