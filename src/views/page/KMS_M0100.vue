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
            <compo-tooltip-btn TitleProp="그룹 생성" ClassProp="pl-tooltip-btn" IconProp="pl-icon20 is-new-folder"
              TooltipPositionProp="top" @btnClick="makeClsf"></compo-tooltip-btn>
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
        <div class=" is-vrt">
          <div class="pl-card ">
            <h2 class="pl-subtit">지식 분류 상세 정보</h2>
            <div class="pl-subdesc">
              <p>필수 관리 항목을 입력 하신 후 <strong>[저장] 버튼을 클릭</strong>하십시오.<br/>
                분류 등록 시 공개여부에 따라 해당 분류에 포함된 지식 정보 조회가 결정되니 유의 바랍니다.</p>
            </div>
          </div>
          <div class="pl-card is-noborder pl-cols">
            <v-form ref="form">
              <div class="pl-form-inline-wrap vertical">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    상위분류 명
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form"
                      disabled
                      required
                      v-model="detailInfo.UP_KMS_CLSF_NM"
                      :rules="validateRules.UP_KMS_CLSF_NM"
                      v-byte-counter="200"
                    />
                  </div>
                </div>
                <!-- <div class="pl-form-inline">
                  <span class="pl-label">
                    상위분류 코드
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form"
                      disabled
                    />
                  </div>
                </div> -->
                <!-- <div class="pl-form-inline">
                  <span class="pl-label">
                    분류 코드
                    <v-icon class="pl-icon20 required"></v-icon>
                    <compo-tooltip-btn
                      TitleProp="툴팁내용입니다. 툴팁내용입니다.<br> 툴팁내용입니다. "
                      ClassProp="pl-tooltip-btn"
                      IconProp="pl-icon20 question"
                      TooltipPositionProp="bottom"
                    ></compo-tooltip-btn>
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form"
                    />
                  </div>
                </div>
                -->
                <div class="pl-form-inline">
                  <span class="pl-label">
                    분류 명
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form"
                      required
                      :rules="validateRules.KMS_CLSF_NM"
                      :disabled=" !detailInfo.SORT_ORD || detailInfo.LVL === '1' "
                      v-model="detailInfo.KMS_CLSF_NM"
                      v-byte-counter="200"
                    />
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    공개 여부
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-radio-group
                      v-model="detailInfo.USE_YN"
                      row
                      class="pl-radio-group"
                    >
                      <v-radio
                        v-for="(rad01, index) in radioGroup"
                        required
                        :rules="validateRules.USE_YN"
                        :key="radioGroup[index].text"
                        :label="rad01.text"
                        :value="rad01.value"
                        class="pl-radio"
                        :disabled=" !detailInfo.SORT_ORD || detailInfo.LVL === '1' "
                      >
                      </v-radio>
                    </v-radio-group>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    관리자
                    <!-- <v-icon class="pl-icon20 required"></v-icon> -->
                    <!-- 툴팁 버튼 -->
                    <compo-tooltip-btn
                      TitleProp="선택한 지식분류에 관리자를 지정하실 경우<br>우측의 돋보기 아이콘을 클릭하신 후<br>지정할 사용자를 선택하십시오."
                      ClassProp="pl-tooltip-btn"
                      IconProp="pl-icon20 question"
                      TooltipPositionProp="bottom"
                    ></compo-tooltip-btn>
                  </span>
                  <div class="pl-desc">
                    <!-- <v-checkbox
                      class="pl-check"
                      label="분류 관리자 지정"
                    ></v-checkbox> -->

                    <v-text-field
                      class="pl-form is-lg flex-grow-0"
                      value="관리 담당자 선택"
                      v-model="detailInfo.PIC_NM"
                      disabled
                    >
                      <template v-slot:append>
                        <v-btn
                          v-if=" detailInfo.PIC_ID !== '' && detailInfo.PIC_NM != '' "
                          class="pl-btn has-icon-only"
                          :disabled=" detailInfo.SORT_ORD === '' || detailInfo.LVL === '1' "
                          @click="clearName"
                          >
                          <span class="pl-icon20 erase"></span>
                        </v-btn>
                        <v-btn
                          :disabled=" detailInfo.SORT_ORD === '' || detailInfo.LVL === '1' "
                          class="pl-btn has-icon-only"
                          @click="userSearch(detailInfo.PIC_NM)"
                          >
                          <span class="pl-icon20 in-search"></span>
                        </v-btn>
                      </template>
                    </v-text-field>

                    <v-dialog
                      v-model="dialogUserFind"
                      content-class="dialog-draggable is-lg"
                      hide-overlay>
                      <div class="draggable-area">drag area</div>
                      <compo-dialog
                        header-title="사용자 찾기"
                        @hide="mixin_hideDialog('UserFind')"
                      >
                        <template slot="body">
                          <!-- component
                          @findData="testSch"
                          -->
                          <compo-find-cus
                            SearchTitleProp="사용자 찾기"
                            :SearchDataProp="DropUser"
                            :SearchInputProp.sync="searchUsername"
                            :DataHeaderProp="HeadersFindCus"
                            :DataBodyProp="ItemsFindCus"
                            :FindData="FindData"
                            MultiSelYnProp="false"
                          />
                        </template>
                        <template slot="footer">
                          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('UserFind')">닫기</v-btn>
                          <v-btn class="pl-btn" @click="setFindUser(),mixin_hideDialog('UserFind')">확인</v-btn>
                        </template>
                      </compo-dialog>
                    </v-dialog>


                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    설명
                  </span>
                  <div class="pl-desc">
                    <v-textarea
                      class="pl-form is-noresize"
                      v-model="detailInfo.KMS_CLSF_EXPLN"
                      placeholder="기타 설명 입력"
                      :disabled=" !detailInfo.SORT_ORD || detailInfo.LVL === '1' "
                      v-byte-counter="2000"
                      :spellcheck="false"
                    />
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    정렬 순서
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      disabled
                      v-model="detailInfo.SORT_ORD"
                      class="pl-form is-sm flex-grow-0"
                      v-byte-counter="4"
                    />
                  </div>
                </div>
              </div>
            </v-form>

          </div>
          <div class="pl-card is-bottom">
            <div class="is-right">
              <v-btn class="pl-btn" @click="clsfSaveValidate">저장</v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name:"MENU_KMS_M0100", //name은 'MENU_' + 파일명 조합

  components: {

  },
 data() {
    return {
      // tree
      expanded: false,
      treeOpenSync: [],
      // Org Data
      orgData : [],
      treeItems: [],
      // form
      activeItem:[],
      selectedNode: null,

      radioGroupSelected: "공개",
      radioGroup: [
        { text: "공개", value: "Y"},
        {text: "비공개",value: "N"}
      ],

      // 분류 상세정보
      detailInfo : {
        CHILD_MAX_ORD : "" ,
        CUSTCO_ID : "" ,
        FULL_PATH : "" ,
        KMS_CLSF_AUTHRT_ID : "" ,
        KMS_CLSF_EXPLN : "" ,
        KMS_CLSF_ID : "" ,
        KMS_CLSF_NM : "" ,
        KMS_CLSF_NM_F : "" ,
        LVL : "",
        CONTS_CNT : "" ,
        LGN_ID : "" ,
        PIC_ID : "" ,
        PIC_NM : "" ,
        SORT_ORD : "" ,
        MIN_ORD : "" ,
        MAX_ORD : "" ,
        PRE_ORD : "" ,
        NEXT_ORD : "" ,
        UP_KMS_CLSF_ID : "" ,
        UP_KMS_CLSF_NM : "" ,
        USE_YN : ""
      },

      DropUser : {},
      searchUsername : '',
      HeadersFindCus : [],
      ItemsFindCus : [],
      FindData:[],
      dialogUserFind : false,

      valid : true,
      validateRules: {
        KMS_CLSF_NM: [
          v => !!v || '분류명은 필수 입력 항목 입니다.',
        ],
        UP_KMS_CLSF_NM: [
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
        },
        ALERT : {
          CHANGE_NO : {alertDialogToggle: true, msg: '이동이 불가 합니다.', iconClass: 'is-caution', type: 'default'}
          , ADD_NO_SELECTED : {alertDialogToggle: true, msg: '추가할 분류의 상위 분류를  선택해 주세요.', iconClass: 'is-caution', type: 'default'}
          , NO_ROOT_SAVE : {alertDialogToggle: true, msg: '고객사 정보는 수정(저장) 할 수 없습니다.', iconClass: 'is-caution', type: 'default'}
          , NO_ROOT_MOVE : {alertDialogToggle: true, msg: '고객사 정보는 이동 할 수 없습니다.', iconClass: 'is-caution', type: 'default'}
          , EXIST_CHILD : {alertDialogToggle: true, msg: '하위분류가 존재 합니다.', iconClass: 'is-caution', type: 'default'}
          , NO_ADD_CLSF : {alertDialogToggle: true, msg: '컨텐츠가 존재합니다.<br/>분류를 추가할 수 없습니다.', iconClass: 'is-caution', type: 'default'}
          , NO_DEL_CLSF : {alertDialogToggle: true, msg: '컨텐츠가 존재하는 분류를<br/>삭제할 수 없습니다.', iconClass: 'is-caution', type: 'default'}
          , NO_SELECTED : {alertDialogToggle: true, msg: '지식분류를 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
          , LVL_CHECK : {alertDialogToggle: true, msg: '상담유형 레벨이 제한 되어 있어 추가 하실 수 없습니다.<br>상담유형 설정에서 레벨을 변경후 이용해 주시기 바랍니다.', iconClass: 'is-caution', type: 'default'}
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

  },

   beforeDestroy(){
    this.$eventBus.$off("selCompanyAction"); //eventBus 중복방지를 위해 off
  },

  async created() {
    await this.getTreeList();
    this.openTreeRoot()
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
      let sUrl = '/api/km/clsf/clsfTreeList';
      let postParam = {};

      let headParam = {
        head : {}
      };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        if(response.KM_CLSF_TREE){
          this.treeItems = response.KM_CLSF_TREE;
        }
        if(response.DATA){
          this.orgData = response.DATA;

          // 선택된 Node 가 있다면 재 조회시 해당 정보 Reload...
          if( this.selectedNode !== null && this.selectedNode.KMS_CLSF_ID !== undefined && this.selectedNode.KMS_CLSF_ID !== "" ) {
            for( var i = 0 ; i < this.orgData.length ; i++ ) {
              var tmpData = this.orgData[i];
              if( tmpData.KMS_CLSF_ID === this.selectedNode.KMS_CLSF_ID ) {
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
        KMS_CLSF_AUTHRT_ID : "" ,
        KMS_CLSF_EXPLN : "" ,
        KMS_CLSF_ID : "" ,
        KMS_CLSF_NM : "" ,
        KMS_CLSF_NM_F : "" ,
        CONTS_CNT : "" ,
        LVL : "" ,
        LGN_ID : "" ,
        PIC_ID : "" ,
        PIC_NM : "" ,
        SORT_ORD : "" ,
        MIN_ORD : "" ,
        MAX_ORD : "" ,
        PRE_ORD : "" ,
        NEXT_ORD : "" ,
        UP_KMS_CLSF_ID : "" ,
        UP_KMS_CLSF_NM : "" ,
        USE_YN : ""
      };
    },

    srch_tree_act( node ){
      let tmpItems = node;
      this.selectedNode = tmpItems[0];
      let KMS_CLSF_ID = "";
      if( node != null && node.length > 0 ) {
        this.detailInfo.CHILD_MAX_ORD = this.selectedNode.CHILD_MAX_ORD;
        this.detailInfo.CUSTCO_ID = this.selectedNode.CUSTCO_ID;
        this.detailInfo.FULL_PATH = this.selectedNode.FULL_PATH;
        this.detailInfo.KMS_CLSF_AUTHRT_ID = this.selectedNode.KMS_CLSF_AUTHRT_ID;
        this.detailInfo.KMS_CLSF_EXPLN = this.selectedNode.KMS_CLSF_EXPLN;
        this.detailInfo.KMS_CLSF_ID = this.selectedNode.KMS_CLSF_ID;
        this.detailInfo.KMS_CLSF_NM = this.selectedNode.KMS_CLSF_NM;
        this.detailInfo.KMS_CLSF_NM_F = this.selectedNode.KMS_CLSF_NM_F;
        this.detailInfo.LVL = this.selectedNode.LVL;
        this.detailInfo.CONTS_CNT = this.selectedNode.CONTS_CNT;
        this.detailInfo.LGN_ID = this.selectedNode.LGN_ID;
        this.detailInfo.PIC_ID = this.selectedNode.PIC_ID;
        this.detailInfo.PIC_NM = this.selectedNode.PIC_NM;
        this.detailInfo.SORT_ORD = this.selectedNode.SORT_ORD;
        this.detailInfo.UP_KMS_CLSF_ID = this.selectedNode.UP_KMS_CLSF_ID;
        this.detailInfo.UP_KMS_CLSF_NM = this.selectedNode.UP_KMS_CLSF_NM;
        this.detailInfo.USE_YN = this.selectedNode.USE_YN;
        this.detailInfo.MIN_ORD = this.selectedNode.MIN_ORD;
        this.detailInfo.MAX_ORD = this.selectedNode.MAX_ORD;
        this.detailInfo.PRE_ORD = this.selectedNode.PRE_ORD;
        this.detailInfo.NEXT_ORD = this.selectedNode.NEXT_ORD;
        // *************** 노드 선택시 마다 조회할 경우 사용   Start ************************
        // KMS_CLSF_ID = node[0].KMS_CLSF_ID;
        // this.selectDetail( KMS_CLSF_ID );
        // *************** 노드 선택시 마다 조회할 경우 사용   End  ************************
      } else {
        this.setInitDetailData();
      }
    },

    // *************** 노드 선택시 마다 조회할 경우 사용   Start ************************
    // async selectDetail ( p_KMS_CLSF_ID ) {
    //   let sUrl = '/api/km/clsf/clsfInfo';
    //   let postParam = {
    //     KMS_CLSF_ID : p_KMS_CLSF_ID
    //   };

    //   let headParam = {
    //     head : {}
    //   };

    //   let response  = await this.common_postCall(sUrl, postParam, headParam);

    //   if (!response.HEADER.ERROR_FLAG){
    //     // 분류 상세정보
    //     if(response.KM_CLSF_INFO){
    //       console.log("response.KM_CLSF_TREE === ", response.KM_CLSF_INFO);
    //       this.detailInfo = response.KM_CLSF_INFO[0];
    //     }
    //   }
    // },
    // *************** 노드 선택시 마다 조회할 경우사용   End  ************************


    clearName(){
      this.detailInfo.PIC_ID = "";
      this.detailInfo.PIC_NM = "";
    },
    //사용자검색버튼 (개발용) 추후삭제
    userSearch(val){
      this.mixin_showDialog('UserFind')
    },

    // 분류 생성
    makeClsf(){
      if( this.selectedNode ) {
        let iContsCnt = this.selectedNode.CONTS_CNT;
        // if( iContsCnt !== '0' ) {
        //   this.showAlert(this.MESSAGE.ALERT.NO_ADD_CLSF);
        // } else {
          this.setInitDetailData();
          this.detailInfo.CUSTCO_ID = this.selectedNode.CUSTCO_ID;
          this.detailInfo.SORT_ORD = (parseInt(this.selectedNode.CHILD_MAX_ORD, 10)+1) + "";
          this.detailInfo.UP_KMS_CLSF_ID = this.selectedNode.KMS_CLSF_ID;
          this.detailInfo.UP_KMS_CLSF_NM = this.selectedNode.KMS_CLSF_NM;
          this.detailInfo.USE_YN = "Y";
        // }
      } else {
        this.showAlert(this.MESSAGE.ALERT.ADD_NO_SELECTED);
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
        let iContsCnt = this.selectedNode.CONTS_CNT;
        if( iContsCnt !== '0' ) {
          this.showAlert(this.MESSAGE.ALERT.NO_DEL_CLSF);
        } else {

          let sUrl = '/api/km/clsf/clsfDel';
          let postParam = {
            KMS_CLSF_ID : this.detailInfo.KMS_CLSF_ID
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

        let sUrl = '/api/km/clsf/clsfOrderUpdate';
        let postParam = {
          KMS_CLSF_ID : this.selectedNode.KMS_CLSF_ID
          , UP_KMS_CLSF_ID : this.selectedNode.UP_KMS_CLSF_ID
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

    // 관리자 정보  Set
    setFindUser() {
      if( this.FindData ) {
        this.detailInfo.PIC_ID = this.FindData.USER_ID;
        this.detailInfo.PIC_NM = this.FindData.USER_NM;
      }
    },

    clsfSaveValidate(){
      if( this.detailInfo.LVL === '1' ){
        this.showAlert(this.MESSAGE.ALERT.NO_ROOT_SAVE);
        return;
      }

      if (!this.validate()) {
        return;
      }

      this.showAlert(this.MESSAGE.CONFIRM.REG);
    },

    //validate check
    validate () {
      return this.$refs.form.validate();
    },

    // 저장
    async clsfSave(){
      this.closeMsg();
      let sUrl = '/api/km/clsf/clsfProc';
      let postParam = {
        KMS_CLSF_ID : this.detailInfo.KMS_CLSF_ID
        , UP_KMS_CLSF_ID : this.detailInfo.UP_KMS_CLSF_ID
        , KMS_CLSF_NM : this.detailInfo.KMS_CLSF_NM
        , KMS_CLSF_EXPLN : this.detailInfo.KMS_CLSF_EXPLN
        , USE_YN : this.detailInfo.USE_YN
        , SORT_ORD : this.detailInfo.SORT_ORD
        , CUSTCO_ID : this.detailInfo.CUSTCO_ID
        , PIC_ID : this.detailInfo.PIC_ID
        , KMS_CLSF_AUTHRT_ID : this.detailInfo.KMS_CLSF_AUTHRT_ID
      };

      let headParam = {
        head : {}
      };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.getTreeList();
      }

    },

  },
}
</script>

<style lang="scss" scoped>

</style>