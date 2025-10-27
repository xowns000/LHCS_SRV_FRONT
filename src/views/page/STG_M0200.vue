<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols" style="height: 100%">
        <!-- 트리 -->
        <div class="is-col-fix is-vrt" style="width: 500px">
          <div class="pl-card">
            <div class="pl-tree-header">
              <div class="is-left">
                <label>조직 정보</label>
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
            <div class="pl-tree-body" style="height: 624px;">
              <v-treeview
                ref="treeDefault"
                activatable
                return-object
                :items="treeItems"
                :open-all="expanded"
                :open-on-click=false
                @update:active="srch_tree_act"
                color="secondary"
                class="pl-tree-view">
                <template v-slot:prepend="{ item, open }">
                  <v-icon v-if="item.children.length > 0">
                      {{open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder'}}
                  </v-icon>
                  <v-icon v-else>
                      {{ 'pl-icon20 tree-file' }}
                  </v-icon>
                </template>
              </v-treeview>

            </div>
          </div>
          <div class="pl-card is-bottom">
            <!-- new folder 버튼 -->
            <compo-tooltip-btn
              TitleProp="추가"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 is-new-folder"
              TooltipPositionProp="top"
              @btnClick="ognzRegForm"
            ></compo-tooltip-btn>
            <!-- 삭제 버튼 -->
            <compo-tooltip-btn
              TitleProp="삭제"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 trash"
              TooltipPositionProp="top"
              @btnClick="ognzDelCheck"
            ></compo-tooltip-btn>
            <div class="is-right">
              <!-- list up 버튼 -->
              <compo-tooltip-btn
                TitleProp="순서 위로"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 is-list-up"
                TooltipPositionProp="top"
                @btnClick="treeNodeMove('UP')"
              ></compo-tooltip-btn>
              <!-- list down 버튼 -->
              <compo-tooltip-btn
                TitleProp="순서 아래로"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 is-list-down"
                TooltipPositionProp="top"
                @btnClick="treeNodeMove('DOWN')"
              ></compo-tooltip-btn>
            </div>
          </div>
        </div>
        <!-- 조직 정보 입력 -->
        <div class="is-vrt">
          <div class="pl-card">
            <h2 class="pl-subtit">조직 상세 정보</h2>
            <div class="pl-subdesc">
              <p>필수 관리 항목을 입력 하신 후 [저장] 버튼을 클릭하십시오.</p>
            </div>
          </div>
          <div class="pl-card is-noborder pt-0">
            <v-form ref="form">
              <div class="pl-card-form-body">
                <div class="pl-form-inline-wrap vertical">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      상위 조직 명
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form"
                        disabled
                        v-model="DTL_UP_DEPT_NM"
                        :rules="validateRules.UP_DEPT_NM"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      상위 조직 명
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form"
                        disabled
                        v-model="DTL_UP_DEPT_NM"
                        :rules="validateRules.UP_DEPT_NM"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      조직 명
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form"
                        v-model="DTL_DEPT_NM"
                        :rules="validateRules.DEPT_NM"
                        v-byte-counter="100"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      위치
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form is-noresize"
                        placeholder="위치 입력"
                        v-model="DTL_BLDG_PSTN"
                        v-byte-counter="1000"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      건물 이름
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form is-noresize"
                        placeholder="건물 이름 입력"
                        v-model="DTL_BLDG_NM"
                        v-byte-counter="100"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      층수
                    </span>
                    <div class="pl-desc">
                      <v-switch v-model="DTL_UDGD_YN">
                        <template v-slot:label>
                          <span class="pl-label">{{ DTL_UDGD_YN ? '지하' : '지상' }}</span>
                        </template>
                      </v-switch>
                      <v-text-field
                        class="pl-form flex-grow-0"
                        placeholder="층수"
                        v-model="DTL_BLDG_NOFL"
                        hide-spin-buttons
                        type="number"
                        oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                        v-byte-counter="4"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      사무실 번호
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form flex-grow-0"
                        placeholder="사무실 번호"
                        v-model="DTL_OFC_NO"
                        v-byte-counter="20"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      사용 여부
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-select
                        class="pl-form flex-grow-0"
                        :items="mixin_common_code_get(this.common_code, 'USE_WT')"
                        placeholder="선택하세요"
                        v-model="DTL_USE_YN"
                        :rules="validateRules.USE_YN"
                      ></v-select>
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      정렬 순서
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form "
                        v-model="DTL_SORT_ORD"
                        :readonly=true
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      연동 부서키
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <!-- <v-select
                        class="pl-form flex-grow-0"
                        :items="mixin_common_code_get(this.common_code, 'CO_TP')"
                        placeholder="선택하세요"
                        v-model="DTL_CO_SE_CD"
                      ></v-select> -->
                      <v-text-field
                        class="pl-form flex-grow-0"
                        v-model="LKAG_DEPT"
                        v-byte-counter="100"
                      />
                    </div>
                  </div>
                  <template v-if="mixin_getCustcoSrvcStat('AS_ALTMNT')">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        회사 구분
                        <v-icon class="pl-icon20 required"></v-icon>
                      </span>
                      <div class="pl-desc">
                        <v-select
                          class="pl-form flex-grow-0"
                          :items="mixin_common_code_get(this.common_code, 'CO_TP')"
                          placeholder="선택하세요"
                          v-model="DTL_CO_SE_CD"
                        ></v-select>
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        서비스 가능 지역
                      </span>
                      <div class="pl-desc">
                        <div class="pl-note-list-wrap is-noborder" style="height: 230px">
                          <span class="pl-label">
                            <v-select
                              class="pl-form flex-grow-0"
                              :items="RGN_DOSI_LIST"
                              item-text="RGN_NM"
                              item-value="RGN_CD"
                              placeholder="선택하세요"
                              v-model="RGN_DOSI"
                              @change="findRngList"
                            ></v-select>
                          </span>
                          <div class="is-mt-m">
                            <div class="pl-cols">
                              <div>
                                <v-data-table
                                  class="pl-grid has-control"
                                  :headers="RGN_HEADER"
                                  :items="RGN_LIST"
                                  v-model="CHK_RGN_LIST"
                                  show-select
                                  fixed-header
                                  item-key="RGN_CD"
                                  height="160px"
                                  :items-per-page="-1"
                                  :page.sync="page"
                                  hide-default-footer
                                  no-data-text="등록된 데이터가 없습니다."
                                  @page-count="pageCount = $event"
                                >
                                </v-data-table>

                              </div>
                              <div class="d-flex flex-column justify-center align-center" style="flex: 0 0 58px; gap: 14px; height: 150px">
                                <!-- arrow left 버튼 -->
                                <compo-tooltip-btn
                                  TitleProp="left"
                                  ClassProp="pl-tooltip-btn"
                                  IconProp="pl-icon30 is-arrow-left"
                                  TooltipPositionProp="bottom"
                                  @btnClick="moveRgnData('L')"
                                  :DisabledProp="SET_RGN_LIST.length == 0 ? true : false"
                                ></compo-tooltip-btn>
                                <!-- arrow right 버튼 -->
                                <compo-tooltip-btn
                                  TitleProp="right"
                                  ClassProp="pl-tooltip-btn"
                                  IconProp="pl-icon30 is-arrow-right"
                                  TooltipPositionProp="bottom"
                                  @btnClick="moveRgnData('R')"
                                  :DisabledProp="RGN_LIST.length == 0 ? true : false"
                                ></compo-tooltip-btn>
                              </div>
                              <div class="is-col-fix" style="width: 300px;height: 160px">
                                <v-data-table
                                  show-select
                                  class="pl-grid has-control"
                                  :headers="SET_RGN_HEADER"
                                  :items="SET_RGN_LIST"
                                  v-model="CHK_SET_RGN_LIST"
                                  fixed-header
                                  item-key="RGN_CD"
                                  height="160px"
                                  :items-per-page="-1"
                                  :page.sync="page"
                                  hide-default-footer
                                  @page-count="pageCount = $event"
                                  no-data-text="등록된 데이터가 없습니다."
                                >
                                </v-data-table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </v-form>
          </div>
          <div class="pl-card is-bottom">
            <div class="is-right">
              <v-btn
                class="pl-btn"
                @click="ognzRegValidate"
                :disabled="DTL_UP_DEPT_ID ===''?true:false"
              >저장</v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
name:"MENU_STG_M0200", //name은 'MENU_' + 파일명 조합
components: {
},
data() {
   return {
    common_code: [],
    //tree
    expanded: false,

    treeItems: [],
    activeItem:[],
    selectedNode: null,

    //조직 상세 정보
    DTL_UP_DEPT_ID:'', //상위 조직 ID
    DTL_UP_DEPT_NM:'', //상위 조직 명
    DTL_DEPT_ID:'', //조직 ID
    DTL_DEPT_NM:'', //조직 명
    DTL_BLDG_PSTN:'', //위치
    DTL_BLDG_NM:'', //건물 이름
    DTL_UDGD_YN:false, //지하 여부
    DTL_BLDG_NOFL:'', //층수
    DTL_OFC_NO:'', //사무실 번호
    DTL_USE_YN:'', //사용여부
    DTL_SORT_ORD:'', //정렬순서
    DTL_RE_SORT_ORD:'', //정렬순서
    DTL_MAX_SORT_ORD:'', //상위 조직의 최대 정렬순서
    DTL_CHILD_CNT:0,
    DTL_LVL:'',

    LKAG_DEPT:'', //연동 부서(LH 상담 AP와 연동하는 부서ID)

    valid : true,
    validateRules: {
      DEPT_NM: [
        v => !!v || '조직명 은(는) 필수 입력 항목 입니다.',
      ],
      USE_YN: [
        v => !!v || '사용여부 은(는) 필수 입력 항목 입니다.',
      ],
    },

    //confirm alert 메시지
    MESSAGE : {
      CONFIRM : {
        REG : {alertDialogToggle: true, msg: '내용을 저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.ognzSave, callNo: this.closeMsg}
        , DEL : {alertDialogToggle: true, msg: '선택된 항목을 삭제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.ognzDel, callNo: this.closeMsg}
      },
      ALERT : {
        SUCCESS : {alertDialogToggle: true, msg: '정상 처리 되었습니다.', iconClass: 'is-done', type: 'default'}
        , DEL_NO : {alertDialogToggle: true, msg: '해당 조직은 삭제 하실 수 없습니다.', iconClass: 'is-caution', type: 'default'}
        , CHILD_DEL_NO : {alertDialogToggle: true, msg: '하위 조직이있어 삭제할 수 없습니다.', iconClass: 'is-caution', type: 'default'}
        , USE_DEL_NO : {alertDialogToggle: true, msg: '해당 조직으로 지정된 사용자가 있습니다.', iconClass: 'is-caution', type: 'default'}
        , CHANGE_NO : {alertDialogToggle: true, msg: '이동이 불가 합니다.', iconClass: 'is-caution', type: 'default'}
        , NO_SELECTED : {alertDialogToggle: true, msg: '조직 정보를 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
      },
      ERROR : {
        ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
      },
      TOAST : {
        SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
      },
    },

    page: 1,
    pageCount: 0,
    RGN_DOSI: '',
    DTL_CO_SE_CD: 'CT_OWN_CO', //회사 구분
    RGN_DOSI_LIST: [],
    ALL_RGN_LIST: [],
    RGN_LIST: [],
    SET_RGN_LIST: [],
    
    CHK_RGN_LIST: [],
    CHK_SET_RGN_LIST: [],

    RGN_HEADER : [
      { text: '지역', value: 'FULL_PATH', align: 'left' },
    ],

    SET_RGN_HEADER : [
      { text: '선택 지역', value: 'FULL_PATH', align: 'left' },
    ]
   }
 },

  watch: {

  },

  computed: {

  },

  beforeDestroy(){
    this.$eventBus.$off("selCompanyAction"); //eventBus 중복방지를 위해 off
  },

  async created() {
    //상단 고객사 선택시 eventBus 실행(각 페이지별 필요에 의한 내용 구현)
    this.$eventBus.$on("selCompanyAction", (SELECTED_COMPANY) => {
      // console.log(`${this.$options.name} : =====>`, SELECTED_COMPANY.CD_NM);
    });

    //공통코드설정
    let codeName = ['USE_WT', 'CO_TP'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    this.getTreeList();

    if(this.mixin_getCustcoSrvcStat('AS_ALTMNT')) this.getRgnList(); //지역 목록
  },

  mounted() {
    setTimeout(() => this.expandAll('treeDefault'), 1000);
  },

  methods: {
    //조직 Tree 목록 조회
    async getTreeList() {
      let sUrl = '/api/setting/ognz/ognzTreeList';
      let postParam = {
      }

      let headParam = {
        head : {
        }
      }

      if(this.mixin_getCustcoSrvcStat('AS_ALTMNT')){
        postParam.RGN_YN = 'Y'
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        //조직 Tree 데이터
        if(response.OGNZ_TREE){
          this.treeItems = response.OGNZ_TREE;
        }
      }
    },

    expandAll(id){
      this.expanded = true;
      this.$refs[id].updateAll(true);
    },
    collapseAll(id){
      this.expanded = false;
      this.$refs[id].updateAll(false);
    },

    srch_tree_act(node){
      this.activeItem = node;
      this.selectedNode = this.activeItem[0];

      if(this.selectedNode != null){
        this.DTL_UP_DEPT_ID = this.selectedNode.UP_DEPT_ID;
        this.DTL_UP_DEPT_NM = this.selectedNode.UP_DEPT_NM;
        this.DTL_DEPT_ID = this.selectedNode.DEPT_ID;
        this.DTL_DEPT_NM = this.selectedNode.DEPT_NM;
        this.DTL_BLDG_PSTN = this.selectedNode.BLDG_PSTN;
        this.DTL_BLDG_NM = this.selectedNode.BLDG_NM;
        this.DTL_UDGD_YN = this.selectedNode.UDGD_YN === 'Y'?true:false;
        this.DTL_BLDG_NOFL = this.selectedNode.BLDG_NOFL;
        this.DTL_OFC_NO = this.selectedNode.OFC_NO;
        this.DTL_USE_YN = this.selectedNode.USE_YN;
        this.DTL_SORT_ORD = this.selectedNode.SORT_ORD;
        this.DTL_RE_SORT_ORD = this.selectedNode.RE_SORT_ORD;
        this.DTL_MAX_SORT_ORD = this.selectedNode.MAX_SORT_ORD;
        this.DTL_CHILD_CNT = this.selectedNode.CHILD_CNT;
        this.DTL_LVL = this.selectedNode.LVL;
        this.LKAG_DEPT = this.selectedNode.LKAG_DEPT;
        
        if(this.mixin_getCustcoSrvcStat('AS_ALTMNT')){
          this.DTL_CO_SE_CD = this.selectedNode.CO_SE_CD;//회사 구분;
          let RGN_LIST = [];
          if(this.selectedNode.RGN_LIST){
            this.selectedNode.RGN_LIST.split('_##_').forEach((rgn, seq) => {
              let rgnObj = {};
              rgnObj.RGN_CD = rgn.split(',')[0];
              rgnObj.UP_RGN_CD = rgn.split(',')[1];
              rgnObj.FULL_PATH = rgn.split(',')[2];
              
              RGN_LIST.push(rgnObj);
            });
          }
          this.SET_RGN_LIST = RGN_LIST;
        }

          this.RGN_DOSI = '';
          this.RGN_LIST = [];
        }
    },

    //등록 form 호출 및 form 초기화
    ognzRegForm() {
      if(this.selectedNode){
        this.DTL_UP_DEPT_ID = this.DTL_DEPT_ID;
        this.DTL_UP_DEPT_NM = this.DTL_DEPT_NM;
        this.DTL_DEPT_ID = '';
        this.DTL_DEPT_NM = '';
        this.DTL_BLDG_PSTN = '';
        this.DTL_BLDG_NM = '';
        this.DTL_UDGD_YN = false;
        this.DTL_BLDG_NOFL = '';
        this.DTL_OFC_NO = '';
        this.DTL_USE_YN = 'Y';
        this.DTL_SORT_ORD = '';
        this.DTL_RE_SORT_ORD = '';
        this.DTL_MAX_SORT_ORD = '';
        this.DTL_CHILD_CNT = '';
        this.DTL_LVL = '';
        this.LKAG_DEPT = '';
        if(this.mixin_getCustcoSrvcStat('AS_ALTMNT')){
          this.DTL_CO_SE_CD = 'CT_OWN_CO';//회사 구분;
          this.RGN_DOSI = '';
          this.RGN_LIST = [];
          this.SET_RGN_LIST = [];
        }
      }else{
        this.showAlert(this.MESSAGE.ALERT.NO_SELECTED);
      }
    },

    //등록 수정 validate 체크
    ognzRegValidate() {
      if (!this.validate()) {
        return;
      }

      this.showAlert(this.MESSAGE.CONFIRM.REG);
    },

    //validate check
    validate () {
      return this.$refs.form.validate();
    },

    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    //조직 등록 수정
    async ognzSave() {
      let sUrl = '/api/setting/ognz/ognzProc';
      let postParam = {
        DEPT_ID : this.DTL_DEPT_ID
        , UP_DEPT_ID : this.DTL_UP_DEPT_ID
        , DEPT_NM : this.DTL_DEPT_NM
        , DEPT_SE_CD : 'DEPT'
        // , DEPT_SE_CD : this.DTL_DEPT_SE_CD
        // , ASP_CUST_KEY : this.DTL_ASP_CUST_KEY
        // , DEPT_CRT_YMD : this.DTL_DEPT_CRT_YMD
        // , DEPT_ABL_YMD : this.DTL_DEPT_ABL_YMD
        // , SCRN_INDCT_YN : this.DTL_SCRN_INDCT_YN
        , BLDG_PSTN : this.DTL_BLDG_PSTN
        , BLDG_NM : this.DTL_BLDG_NM
        , UDGD_YN : this.DTL_UDGD_YN?'Y':'N'
        , BLDG_NOFL : this.DTL_BLDG_NOFL
        , OFC_NO : this.DTL_OFC_NO
        , USE_YN : this.DTL_USE_YN
        , LKAG_DEPT : this.LKAG_DEPT
      }

      let headParam = {
        head : {
        }
      }

      postParam.CO_SE_CD = this.DTL_CO_SE_CD;
      if(this.mixin_getCustcoSrvcStat('AS_ALTMNT') && this.SET_RGN_LIST.length > 0){
        postParam.RGN_LIST = JSON.stringify(this.SET_RGN_LIST);
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        // this.showAlert(this.MESSAGE.ALERT.SUCCESS);
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.getTreeList();
        this.closeMsg();
      }
    },

    ognzDelCheck(){
      if(this.selectedNode){
        this.showAlert(this.MESSAGE.CONFIRM.DEL);
      }else{
        this.showAlert(this.MESSAGE.ALERT.NO_SELECTED);
      }
    },

    //삭제
    async ognzDel() {
      if(this.DTL_DEPT_ID === '' || this.DTL_LVL === '1'){
        this.showAlert(this.MESSAGE.ALERT.DEL_NO);
        return;
      }

      if(this.selectedNode.CHILD_CNT > 0){
        this.showAlert(this.MESSAGE.ALERT.CHILD_DEL_NO);
        return;
      }

      if(this.selectedNode.USE_CNT > 0){
        this.showAlert(this.MESSAGE.ALERT.USE_DEL_NO);
        return;
      }

      let sUrl = '/api/setting/ognz/ognzDel';
      let postParam = {
        arrDeptId: this.DTL_DEPT_ID,
      }

      let headParam = {
        head : {
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);

      if (!resData.HEADER.ERROR_FLAG){
        // this.showAlert(this.MESSAGE.ALERT.SUCCESS);
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeMsg();
        this.getTreeList();
        this.$refs.form.reset();
      }
    },

    //Node 순서 변경
    async treeNodeMove(type){
      if(this.selectedNode){
        if((type === 'UP' && this.DTL_RE_SORT_ORD > 1)
          || (type === 'DOWN' && this.DTL_RE_SORT_ORD < this.DTL_MAX_SORT_ORD))
        {
          let sUrl = '/api/setting/ognz/ognzOrderUpdate';
          let postParam = {
            DEPT_SE_CD : 'DEPT',
            // DEPT_SE_CD : this.DTL_DEPT_SE_CD,
            DEPT_ID: this.DTL_DEPT_ID,
            UP_DEPT_ID: this.DTL_UP_DEPT_ID,
            SORT_ORD: this.DTL_SORT_ORD,
            MAX_SORT_ORD: this.DTL_MAX_SORT_ORD,
            ORDER_TYPE: type,
          }

          let headParam = {
            head: {
            }
          }

          let response  = await this.common_postCall(sUrl, postParam, headParam);

          if (!response.HEADER.ERROR_FLAG){
            if(type == 'UP'){
              this.DTL_RE_SORT_ORD = parseInt(this.DTL_RE_SORT_ORD) - 1;
            } else if(type == 'DOWN'){
              this.DTL_RE_SORT_ORD = parseInt(this.DTL_RE_SORT_ORD) + 1;
            }
            this.getTreeList();
          }
        }else{
          this.showAlert(this.MESSAGE.ALERT.CHANGE_NO);
        }
      }else{
        this.showAlert(this.MESSAGE.ALERT.NO_SELECTED);
      }
    },

    //지역 목록
    async getRgnList() {
      let sUrl = '/api/setting/ognz/rgnList';
      let postParam = {
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
          response.DATA.forEach((data, idx) => {
            if(!data.UP_RGN_CD){
              this.RGN_DOSI_LIST.push(data);
            }
          });
          this.ALL_RGN_LIST = response.DATA;
      }
    },

    //중복 제거
    removeDuplicates(orgData, removeData) {
      removeData.forEach(removeItem => {
        orgData.forEach((dataItem, index) => {
          if (dataItem.UP_RGN_CD === removeItem.UP_RGN_CD && dataItem.RGN_CD === removeItem.RGN_CD) {
            orgData.splice(index, 1);
          }
        });
      });
    },

    //지역 선택 이동
    moveRgnData(eGb) {
      if(eGb === 'R'){ //추가

        this.removeDuplicates(this.RGN_LIST, this.CHK_RGN_LIST);

        this.CHK_RGN_LIST.forEach((data, idx) => {
          this.SET_RGN_LIST.push(data);
        });

        this.CHK_RGN_LIST = [];
      }else{//제거

        this.removeDuplicates(this.SET_RGN_LIST, this.CHK_SET_RGN_LIST);

        this.CHK_SET_RGN_LIST.forEach((data, idx) => {
          this.RGN_LIST.push(data);
        });

        this.CHK_SET_RGN_LIST = [];
      }

      this.findRngList();
    },

    //도시 선택 이벤트
    findRngList() {
      this.RGN_LIST = [];
      this.ALL_RGN_LIST.forEach((data, idx) => {
        if(this.RGN_DOSI === data.UP_RGN_CD){
          this.RGN_LIST.push(data);
        }
      });

      this.removeDuplicates(this.RGN_LIST, this.SET_RGN_LIST);
    }
  },
}
</script>

<style lang="scss" scoped>

</style>