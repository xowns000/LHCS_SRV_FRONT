<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
      </compo-sub-layout-top>
      <!-- sub content -->
      <v-tabs class="pl-tabs" v-model="tab">
        <v-tab>문의유형별 상담사 설정 </v-tab>
        <v-tab>상담사별 문의유형 설정</v-tab>
      </v-tabs>
      <div style="height: 700px">
        <v-tabs-items v-model="tab" class="pl-tabs-items">
          <!-- 스킬별 상담사 설정 -->
          <v-tab-item>
            <div class="pl-cols" style="height: 100%">
              <!-- 트리 -->
              <div class="is-col-fix is-vrt" style="width: 500px">
                <div class="pl-card">
                  <div class="pl-tree-header">
                    <div class="is-left">
                      <label>문의 유형</label>
                    </div>
                    <div class="is-right">
                      <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault')">전체 펼치기</v-btn>
                      <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault')">전체 접기</v-btn>
                    </div>
                  </div>
                  <div class="pl-tree-body" style="height: 602px;">
                    <v-treeview
                      ref="treeDefault"
                      :items="QSTN_TYPE_TREE"
                      :open-all="expanded"
                      activatable
                      :active="ACT_TREE_MENU"
                      open-on-click
                      color="secondary"
                      class="pl-tree-view"
                      @update:active="srch_tree_act"
                      @update:open="srch_tree_open"
                    >
                      <template v-slot:prepend="{ item, open }">
                        <v-icon v-if="item.children">
                            {{open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder'}}
                        </v-icon>
                        <v-icon v-else>
                            {{ 'pl-icon20 tree-file' }}
                        </v-icon>
                      </template>
                    </v-treeview>

                  </div>
                </div>
              </div>
              <!-- right -->
              <div class="is-vrt">
                <div class="pl-search-header">
                  <div class="pl-form-inline-wrap">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        사용자 ID
                      </span>
                      <div class="pl-desc">
                       <v-text-field
                        class="pl-form"
                        placeholder="검색어 입력"
                        v-model="SRCH_USER_ID"
                        @keydown.enter="qstnUserSrch()"
                       ></v-text-field>
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        사용자 명
                      </span>
                      <div class="pl-desc">
                       <v-text-field
                        class="pl-form"
                        placeholder="검색어 입력"
                        v-model="SRCH_USER_NM"
                        @keydown.enter="qstnUserSrch()"
                       ></v-text-field>
                      </div>
                    </div>
                    <v-btn
                      class="pl-btn is-icon"
                      @click="qstnUserSrch()"
                      :disabled="QSTN_TYPE_ID=='' ? true : false"
                    >
                      <span class="pl-icon20 search"></span>
                      조회
                    </v-btn>
                  </div>
                </div>
                <!-- grid -->
                <div class="pl-card">
                  <div class="pl-cols">
                    <div>
                      <h2 class="pl-subtit d-flex justify-space-between">[{{ QSTN_TYPE_NM }}]에 설정되지 않은 사용자
                        <span class="pl-counter">전체 <em class="pl-1">({{ UN_STNG_USER_ITEMS.length }})</em> 건</span>
                      </h2>
                      <v-data-table
                        class="pl-grid has-control is-mt-m"
                        :headers="UN_STNG_USER_HEADER"
                        :items="UN_STNG_USER_ITEMS"
                        :item-class="isActiveUnStngUserRow"
                        v-model="UN_STNG_USER_LIST"
                        show-select
                        fixed-header
                        item-key="USER_ID"
                        height="562px"
                        :items-per-page="ROW_PER_PAGE2"
                        hide-default-footer
                        :page.sync="page2"
                        @page-count="pageCount2 = $event"
                        @click:row="unStngUserRowClick"
                        no-data-text="등록된 데이터가 없습니다."
                      >
                      </v-data-table>

                    </div>
                    <div class="d-flex flex-column justify-center align-center" style="flex: 0 0 58px; gap: 14px">
                      <!-- arrow left 버튼 -->
                      <compo-tooltip-btn
                        TitleProp="설정 해제"
                        ClassProp="pl-tooltip-btn"
                        IconProp="pl-icon30 is-arrow-left"
                        TooltipPositionProp="bottom"
                        @btnClick="showAlert(MESSAGE.CONFIRM.USER_DEL)"
                        :DisabledProp="STNG_USER_LIST.length == 0 ? true : false"
                      ></compo-tooltip-btn>
                      <!-- arrow right 버튼 -->
                      <compo-tooltip-btn
                        TitleProp="설정"
                        ClassProp="pl-tooltip-btn"
                        IconProp="pl-icon30 is-arrow-right"
                        TooltipPositionProp="bottom"
                        @btnClick="showAlert(MESSAGE.CONFIRM.USER_REG)"
                        :DisabledProp="UN_STNG_USER_LIST.length == 0 ? true : false"
                      ></compo-tooltip-btn>
                    </div>
                    <div>
                      <h2 class="pl-subtit d-flex justify-space-between">설정한 사용자
                        <span class="pl-counter">전체 <em class="pl-1">({{ STNG_USER_ITEMS.length }})</em> 건</span>
                      </h2>
                      <v-data-table
                        class="pl-grid has-control is-mt-m"
                        :headers="STNG_USER_HEADER"
                        :items="STNG_USER_ITEMS"
                        :item-class="isActiveStngUserRow"
                        v-model="STNG_USER_LIST"
                        show-select
                        fixed-header
                        item-key="USER_ID"
                        height="562px"
                        :items-per-page="ROW_PER_PAGE2"
                        hide-default-footer
                        :page.sync="page3"
                        @page-count="pageCount3 = $event"
                        @click:row="stngUserRowClick"
                        no-data-text="등록된 데이터가 없습니다."
                      >
                      </v-data-table>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-tab-item>
          <!-- 상담사별 스킬 설정 -->
          <v-tab-item>
            <div class="is-vrt">
              <!-- 사용자 -->
              <div class="pl-search-header">
                <div class="pl-form-inline-wrap">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      사용자 ID
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form"
                        placeholder="검색어 입력"
                        v-model="SRCH_USER_ID"
                        disabled
                      ></v-text-field>
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      사용자 명
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form"
                        placeholder="검색어 입력"
                        v-model="SRCH_USER_NM"
                        disabled
                      ></v-text-field>
                    </div>
                  </div>
                  <compo-tooltip-btn
                    TitleProp="사용자 찾기"
                    ClassProp="pl-top-util"
                    IconProp="pl-icon-util search"
                    TooltipPositionProp="bottom"
                    @btnClick="mixin_showDialog('UserFind')"
                  ></compo-tooltip-btn>
                  <!-- 사용자 찾기 모달 -->
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
                        <!-- component -->
                        <compo-find-cus
                          SearchTitleProp="사용자 찾기"
                          :SearchDataProp="DropUser"
                          :SearchInputProp.sync="SRCH_USER_NM"
                          :DataHeaderProp="HeadersFindUser"
                          :DataBodyProp="ItemsFindUser"
                          MultiSelYnProp="false"
                          :FindData="SRCH_USER"
                          @input="SRCH_USER = $event"
                          @findData="[mixin_hideDialog('UserFind'),setUser()]"
                        />
                      </template>
                      <template slot="footer">
                        <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('UserFind')">닫기</v-btn>
                        <v-btn class="pl-btn" @click="[mixin_hideDialog('UserFind'),setUser()]">확인</v-btn>
                      </template>
                    </compo-dialog>
                  </v-dialog>
                </div>
              </div>
              <!-- grid -->
              <div class="pl-card">
                <div class="pl-cols">
                  <div>
                    <h2 class="pl-subtit d-flex justify-space-between">미할당 스킬( {{ SRCH_USER.LGN_ID }} / {{ SRCH_USER.USER_NM }})
                      <span class="pl-counter">전체 <em class="pl-1">({{ UN_STNG_QSTN_ITEMS.length }})</em> 건</span>
                    </h2>
                    <v-data-table
                      class="pl-grid has-control is-mt-m"
                      :headers="UN_STNG_QSTN_HEADER"
                      :items="UN_STNG_QSTN_ITEMS"
                      :item-class="isActiveUnStngQstnRow"
                      v-model="UN_STNG_QSTN_LIST"
                      show-select
                      fixed-header
                      item-key="QSTN_TYPE_ID"
                      height="562px"
                      :items-per-page="ROW_PER_PAGE2"
                      hide-default-footer
                      :page.sync="page2"
                      @page-count="pageCount2 = $event"
                      @click:row="unStngQstnRowClick"
                      no-data-text="등록된 데이터가 없습니다."
                    >
                    <!-- 하위문의유형 표시 -->
                    <template v-slot:item.QSTN_TYPE_NM="{ item }">
                      {{ qstnLvl(item.QSTN_TYPE_SE_CD,item.QSTN_TYPE_NM) }}
                    </template>
                    </v-data-table>
                  </div>
                  <div class="d-flex flex-column justify-center align-center" style="flex: 0 0 58px; gap: 14px">
                    <!-- arrow left 버튼 -->
                    <compo-tooltip-btn
                      TitleProp="설정 해제"
                      ClassProp="pl-tooltip-btn"
                      IconProp="pl-icon30 is-arrow-left"
                      TooltipPositionProp="bottom"
                      @btnClick="showAlert(MESSAGE.CONFIRM.QSTN_DEL)"
                      :DisabledProp="STNG_QSTN_LIST.length == 0 ? true : false"
                    ></compo-tooltip-btn>
                    <!-- arrow right 버튼 -->
                    <compo-tooltip-btn
                      TitleProp="설정"
                      ClassProp="pl-tooltip-btn"
                      IconProp="pl-icon30 is-arrow-right"
                      TooltipPositionProp="bottom"
                      @btnClick="showAlert(MESSAGE.CONFIRM.QSTN_REG)"
                      :DisabledProp="UN_STNG_QSTN_LIST.length == 0 ? true : false"
                    ></compo-tooltip-btn>
                  </div>
                  <div>
                    <h2 class="pl-subtit d-flex justify-space-between">설정한 문의 유형
                      <span class="pl-counter">전체 <em class="pl-1">({{ STNG_QSTN_ITEMS.length }})</em> 건</span>
                    </h2>
                    <v-data-table
                      class="pl-grid has-control is-mt-m"
                      :headers="STNG_QSTN_HEADER"
                      :items="STNG_QSTN_ITEMS"
                      :item-class="isActiveStngQstnRow"
                      v-model="STNG_QSTN_LIST"
                      show-select
                      fixed-header
                      item-key="QSTN_TYPE_ID"
                      height="562px"
                      :items-per-page="ROW_PER_PAGE2"
                      hide-default-footer
                      :page.sync="page3"
                      @page-count="pageCount3 = $event"
                      @click:row="stngQstnRowClick"
                      no-data-text="등록된 데이터가 없습니다."
                    >
                    <!-- 하위문의유형 표시 -->
                    <template v-slot:item.QSTN_TYPE_NM="{ item }">
                      {{ qstnLvl(item.QSTN_TYPE_SE_CD,item.QSTN_TYPE_NM) }}
                    </template>
                    </v-data-table>

                  </div>
                </div>
              </div>
            </div>


          </v-tab-item>
        </v-tabs-items>
      </div>
    </div>

  </div>
</template>

<script>
export default {
name:"MENU_STG_M0503", //name은 'MENU_' + 파일명 조합
components: {
},
data() {
   return {
    tab: null,
    // drop

    // dialog
    dialogUserFind: false,    //사용자검색모달
    HeadersFindUser: [],      //사용자검색모달 헤더
    ItemsFindUser:[],         //사용자검색모달 그리드 데이터
    DropUser: {},             //드롭박스 데이터

    //tree
    expanded: false,
    QSTN_TYPE_TREE: [],
    ACT_TREE_MENU:[],         //활성화된(클릭한) 트리
    ACT_TREE_LIST:[],         //활성화된 트리 리스트

    QSTN_TYPE_ID:'',              //문의유형아이디
    QSTN_TYPE_NM: '',             //문의유형명

    SRCH_USER:[],             //사용자 조회모달에서 가져온 데이터
    SRCH_USER_ID:'',          //조회사용자ID
    SRCH_USER_NM:'',          //조회사용자명

    // grid
    page2: 1,
    pageCount2: 0,
    perPage2: [15,30,50,100],
    ROW_PER_PAGE2: -1,
    UN_STNG_USER_HEADER: [
      { text: '번호', value: 'ROW_NUMBER', width: '80px' },
      { text: '사용자ID', value: 'LGN_ID', width: '120px' },
      { text: '사용자명', value: 'USER_NM', width: '120px' },
      { text: '소속', value: 'FULL_PATH'},
    ],                            //스킬별 미할당 사용자헤더
    UN_STNG_USER_ITEMS: [],       //스킬별 미할당 사용자그리드
    UN_STNG_USER_LIST: [],        //스킬별 미할당 사용자 다중선택 리스트
    unStngUserRow:{},             //미할당 사용자 로우 데이터

    page3: 1,
    pageCount3: 0,
    perPage3: [15,30,50,100],
    ROW_PER_PAGE3: -1,
    STNG_USER_HEADER: [
      { text: '번호', value: 'ROW_NUMBER', width: '80px' },
      { text: '사용자ID', value: 'LGN_ID', width: '120px' },
      { text: '사용자명', value: 'USER_NM', width: '120px' },
      { text: '소속', value: 'FULL_PATH'},
      { text: '설정일', value: 'date', width: '120px' },
    ],                            //스킬별 할당 사용자헤더
    STNG_USER_ITEMS: [],          //스킬별 미할당 사용자그리드
    STNG_USER_LIST:[],            //스킬별 미할당 사용자 다중선택 리스트
    stngUserRow:{},               //미할당 사용자 로우 데이터

    // 상담사별 스킬 설정
    ROW_LVL:[],                   //문의유형 레벨공백

    page4: 1,
    pageCount4: 0,
    perPage4: [15,30,50,100],
    ROW_PER_PAGE4: -1,
    UN_STNG_QSTN_HEADER: [
      { text: '번호', value: 'ROW_NUMBER', width: '80px' },
      { text: '문의유형명', value: 'QSTN_TYPE_NM', width: '240px' },
      { text: '문의유형 타입', value: 'QSTN_TYPE_CD_NM', width: '240px' },
      { text: '문의유형 레벨', value: 'QSTN_TYPE_SE_CD'},
    ],                            //사용자별 미할당 스킬헤더
    UN_STNG_QSTN_ITEMS: [],       //사용자별 미할당 스킬그리드
    UN_STNG_QSTN_LIST:[],         //사용자별 미할당 스킬 다중선택 리스트
    unStngQstnRow:{},             //미할당 사용자 로우 데이터

    // 상담사별 스킬 설정
    page5: 1,
    pageCount5: 0,
    perPage5: [15,30,50,100],
    ROW_PER_PAGE5: -1,
    STNG_QSTN_HEADER: [
      { text: '번호', value: 'ROW_NUMBER', width: '80px' },
      { text: '문의유형명', value: 'QSTN_TYPE_NM', width: '240px' },
      { text: '문의유형 타입', value: 'QSTN_TYPE_CD_NM', width: '240px' },
      { text: '문의유형 레벨', value: 'QSTN_TYPE_SE_CD'},
      { text: '문의유형 설정일', value: 'MDFCN_DT'},
    ],                            //사용자별 할당 스킬헤더
    STNG_QSTN_ITEMS: [],          //사용자별 할당 스킬그리드
    STNG_QSTN_LIST:[],            //사용자별 할당 스킬 다중선택 리스트
    stngQstnRow:{},               //미할당 사용자 로우 데이터

    MANAGER_INFO: {
      name : '나준영',
      img: require('@/assets/img/@profile_user.png'), //사이즈  32x32
    },

    //알림창 메시지
    MESSAGE : {
      CONFIRM : {
        USER_REG : {alertDialogToggle: true, msg: '사용자를 할당하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.stngQstnConfirm, callNo: this.closeMsg}
        , USER_DEL : {alertDialogToggle: true, msg: '할당 사용자를 삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.unStngQstnConfirm, callNo: this.closeMsg}
        , QSTN_REG : {alertDialogToggle: true, msg: '스킬을 할당하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.stngUserConfirm, callNo: this.closeMsg}
        , QSTN_DEL : {alertDialogToggle: true, msg: '할당 스킬을 삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.unStngUserConfirm, callNo: this.closeMsg}
      },
      ALERT : {
        DEL_SUCCESS : {alertDialogToggle: true, msg: '삭제가 완료되었습니다', iconClass: 'is-info', type: 'default'}
        , REG_SUCCESS : {alertDialogToggle: true, msg: '사용자 할당이 완료되었습니다', iconClass: 'is-info', type: 'default'}
        , SET_SUCCESS : {alertDialogToggle: true, msg: '설정이 변경되었습니다', iconClass: 'is-info', type: 'default'}
      },
      ERROR : {
        ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
      },
      TOAST : {
        DEL_SUCCESS :{ msg: '삭제가 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        , REG_SUCCESS :{  msg: '사용자 할당이 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        , SET_SUCCESS :{  msg: '설정이 변경되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
      }
    },
   }
 },

  watch: {

  },

  computed: {

  },

  created() {
    this.qstnTreeSrch()
  },

  mounted() {

  },

  methods: {
    expandAll(id){
      this.expanded = true;
      this.$refs[id].updateAll(true);
    },
    collapseAll(id){
      this.expanded = false;
      this.$refs[id].updateAll(false);
    },

    async qstnTreeSrch(){
      let sUrl = '/chat-api/setting/inqry-ty-manage/chnnl-tr/inqire';
      let postParam = {
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.QSTN_TYPE_TREE = resData.QSTN_TYPE_TREE;
      }
    },

    //트리메뉴 클릭
    //최하위 메뉴 클릭 시 이벤트
    srch_tree_act(node){
      let activeItem = []
      let leng = node.length
      if(leng != 0){
        this.QSTN_TYPE_ID = node[leng-1]
      } else {  //같은메뉴를 클릭했을 때
        activeItem[0] = this.QSTN_TYPE_ID
        this.ACT_TREE_MENU = activeItem;
      }

      let selectedNode = this.findNodeById(this.QSTN_TYPE_TREE, this.QSTN_TYPE_ID);

      if(selectedNode != null){
        this.QSTN_TYPE_ID = selectedNode.QSTN_TYPE_ID
        this.QSTN_TYPE_NM = selectedNode.QSTN_TYPE_NM
      }

      this.qstnUserSrch();
    },
    //트리메뉴 활성화(폴더열기)
    //열린폴더 리스트가 node에 들어옴
    //폴더를 닫았을 때에는 node에 해당 폴더 정보가 없기때문에 ACT_TREE_LIST기준으로 가져옴
    srch_tree_open(node){
      let nodeLeng = node.length  //현재 활성화된 폴더
      let nowActive = []    //현재 클릭한 메뉴
      //전체 접기 버튼을 클릭했을 때
      if(nodeLeng == 0 && (this.QSTN_TYPE_ID == '' || this.QSTN_TYPE_ID == null || this.QSTN_TYPE_ID == undefined) ){
        // if(this.ACT_TREE_MENU.length != 0){
        //   this.ACT_TREE_MENU.pop()
        // }
        this.ACT_TREE_LIST = [];
        return;
      } else if(nodeLeng == 0 && (this.QSTN_TYPE_ID != '' && this.QSTN_TYPE_ID != null && this.QSTN_TYPE_ID != undefined) ){
        // if(this.ACT_TREE_MENU.length != 0){
        //   this.ACT_TREE_MENU.pop()
        // }
        this.ACT_TREE_LIST = [];
        return;
      }
      let actLeng = this.ACT_TREE_LIST.length //클릭하기 전 활성화된 폴더
      if(actLeng > nodeLeng){ //node에는 클릭한 순서대로 들어가기때문에 지금 클릭한 폴더를 구분해야함
        //배열을 크기순으로 나열하여 값 비교
        this.ACT_TREE_LIST.sort();
        node.sort();
        for(let i=0;i<actLeng;i++){
          if(this.ACT_TREE_LIST[i] != node[i]){
            nowActive[0] = this.ACT_TREE_LIST[i]
            break
          }
        }
      } else {  //폴더를 열었을 때
        nowActive[0] = node[nodeLeng-1]
      }
      this.QSTN_TYPE_ID = nowActive[0];
      this.ACT_TREE_MENU = nowActive;
      this.ACT_TREE_LIST = node;


      let selectedNode = this.findNodeById(this.QSTN_TYPE_TREE, this.QSTN_TYPE_ID);

      if(selectedNode != null){
        this.QSTN_TYPE_ID = selectedNode.QSTN_TYPE_ID
        this.QSTN_TYPE_NM = selectedNode.QSTN_TYPE_NM
      }

      this.qstnUserSrch();
    },

    //트리 클릭 시 해당 row정보 세팅
    findNodeById(nodes, id) {
      for (let node of nodes) {
        if (node.id === id) {
          return node;
        }
        if (node.children && node.children.length > 0) {
          const foundNode = this.findNodeById(node.children, id);
          if (foundNode) {
            return foundNode;
          }
        }
      }
      return null;
    },

    //스킬(문의유형) 설정 사용자 조회
    async qstnUserSrch(){
      let sUrl = '/chat-api/setting/pro-counsel-by-agent-manage/inqry-ty-asgn-user/inqire';
      let postParam = {
        QSTN_TYPE_ID: this.QSTN_TYPE_ID,
        SRCH_USER_ID: this.SRCH_USER_ID,
        SRCH_USER_NM: this.SRCH_USER_NM,
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.STNG_USER_ITEMS = [];
        this.UN_STNG_USER_ITEMS = [];

        let leng = resData.DATA.length
        for(let i=0;i<leng;i++){
          if(resData.DATA[i]["QSTN_TYPE_ID"] != '' && resData.DATA[i]["QSTN_TYPE_ID"] != null && resData.DATA[i]["QSTN_TYPE_ID"] != undefined){
            this.STNG_USER_ITEMS.push(resData.DATA[i])
          } else {
            this.UN_STNG_USER_ITEMS.push(resData.DATA[i])
          }
        }
      }
    },

    async stngQstn(stng){
      let sUrl = '/chat-api/setting/pro-counsel-by-agent-manage/inqry-ty/process';
      let postParam = {
        STNG: stng,          //할당->미할당,미할당->할당 판단
        USER_INFO: stng == 'STNG' ? this.UN_STNG_USER_LIST : this.STNG_USER_LIST,
        QSTN_TYPE_ID: this.QSTN_TYPE_ID,
        PROC_TYPE: 'QSTN'    //스킬별 상담사 설정
      }
      let headParam = {
        head: {
          DATA_OBJECT: "USER_INFO",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        this.UN_STNG_USER_LIST = [];
        this.STNG_USER_LIST = [];
        this.qstnUserSrch();
        this.showToast(this.MESSAGE.TOAST.REG_SUCCESS);
      }
    },

    async stngUser(stng){
      let sUrl = '/chat-api/setting/pro-counsel-by-agent-manage/inqry-ty/process';
      let postParam = {
        STNG: stng,          //할당->미할당,미할당->할당 판단
        QSTN_INFO: stng == 'STNG' ? this.UN_STNG_QSTN_LIST : this.STNG_QSTN_LIST,
        SRCH_USER_ID: this.SRCH_USER.USER_ID,
        PROC_TYPE: 'USER',    //상담사별 스킬 설정
        DEPT_ID: this.SRCH_USER.DEPT_ID      //사용자 소속
      }
      let headParam = {
        head: {
          DATA_OBJECT: "QSTN_INFO",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        this.UN_STNG_QSTN_LIST = [];
        this.STNG_QSTN_LIST = [];
        this.userQstnSrch();
        this.showToast(this.MESSAGE.TOAST.REG_SUCCESS);
      }
    },

    //스킬에 사용자 할당
    stngQstnConfirm(){
      this.stngQstn('STNG')
    },

    //스킬에서 사용자 삭제
    unStngQstnConfirm(){
      this.stngQstn('UN_STNG')
    },

    //사용자에 스킬 할당
    stngUserConfirm(){
      this.stngUser('STNG')
    },

    //사용자에서 스킬 삭제
    unStngUserConfirm(){
      this.stngUser('UN_STNG')
    },

    //미설정 사용자 로우 클릭
    unStngUserRowClick(item){
      this.unStngUserRow = item;
    },
    //미설정 사용자 로우 클릭시 색상 변경
    isActiveUnStngUserRow(item) {
      const activeClass = item === this.unStngUserRow ? "active" : "";
      return activeClass;
    },

    //설정 사용자 로우 클릭
    stngUserRowClick(item){
      this.stngUserRow = item;
    },
    //설정 사용자 로우 클릭시 색상 변경
    isActiveStngUserRow(item) {
      const activeClass = item === this.stngUserRow ? "active" : "";
      return activeClass;
    },

    //미설정 스킬 로우 클릭
    unStngQstnRowClick(item){
      this.unStngQstnRow = item;
    },
    //미설정 스킬 로우 클릭시 색상 변경
    isActiveUnStngQstnRow(item) {
      const activeClass = item === this.unStngQstnRow ? "active" : "";
      return activeClass;
    },

    //설정 스킬 로우 클릭
    stngQstnRowClick(item){
      this.stngQstnRow = item;
    },
    //설정 스킬 로우 클릭시 색상 변경
    isActiveStngQstnRow(item) {
      const activeClass = item === this.stngQstnRow ? "active" : "";
      return activeClass;
    },

    //사용자 검색 세팅
    setUser(){
      this.SRCH_USER_ID = this.SRCH_USER.LGN_ID;
      this.SRCH_USER_NM = this.SRCH_USER.USER_NM;

      this.userQstnSrch();
    },

    //사용자별 스킬 검색
    async userQstnSrch(){
      let sUrl = '/chat-api/setting/pro-counsel-by-agent-manage/unasgn-inqry-ty/inqire';
      let postParam = {
        SRCH_USER_ID: this.SRCH_USER_ID,
        SRCH_USER_NM: this.SRCH_USER_NM,
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.STNG_QSTN_ITEMS = [];
        this.UN_STNG_QSTN_ITEMS = [];

        let leng = resData.DATA.length
        for(let i=0;i<leng;i++){
          if(resData.DATA[i]["USER_ID"] != '' && resData.DATA[i]["USER_ID"] != null && resData.DATA[i]["USER_ID"] != undefined){
            this.STNG_QSTN_ITEMS.push(resData.DATA[i])
          } else {
            this.UN_STNG_QSTN_ITEMS.push(resData.DATA[i])
          }
        }
      }
    },

    //하위문의유형 표기
    qstnLvl(value, qstn) {
      return '> '.repeat(parseInt(value)) + qstn; // a 값만큼 '1'을 추가하여 prefix와 결합
    },

    //알림창 닫기
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },
  },
}
</script>

<style lang="scss" scoped>

</style>