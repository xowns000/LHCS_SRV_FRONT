<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
      </compo-sub-layout-top>
      <!-- sub content -->
      <v-tabs class="pl-tabs" v-model="tab">
        <v-tab>권한 그룹별 설정</v-tab>
        <v-tab>사용자별 권한 설정</v-tab>
      </v-tabs>
      <div style="height: 700px">
        <v-tabs-items v-model="tab" class="pl-tabs-items">
          <!-- 권한 그룹별 설정 -->
          <v-tab-item>
            <div class="pl-cols" style="height: 100%">
              <div class="is-col-fix is-vrt" >
                <!-- 조회 -->
                <div class="pl-search-header">
                  <div class="pl-form-inline-wrap">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        권한 그룹
                      </span>
                      <div class="pl-desc">
                        <v-select
                        class="pl-form is-lg"
                        :items="AUTHRT_GROUP_DROP"
                        placeholder="선택하세요"
                        v-model="SRCH_AUTHRT_PARAM.AUTHRT_GROUP_ID"
                        ></v-select>
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        사용자 ID
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          class="pl-form "
                          placeholder="검색어 입력"
                          v-model="SRCH_AUTHRT_PARAM.LGN_ID"
                        ></v-text-field>
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        사용자 명
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          class="pl-form "
                          placeholder="검색어 입력"
                          v-model="SRCH_AUTHRT_PARAM.USER_NM"
                        ></v-text-field>
                      </div>
                    </div>
                    <v-btn class="pl-btn is-icon"
                    @click="getUserList">
                      <span class="pl-icon20 search"></span>
                      조회
                    </v-btn>
                  </div>
                </div>
                <!-- grid -->
                <div class="pl-card">
                  <div class="pl-cols">
                    <div>
                      <h2 class="pl-subtit d-flex justify-space-between">부여되지 않은 사용자
                        <span class="pl-counter">전체 <em class="pl-1">({{ NONE_AUTH_USER.length }})</em> 건</span>
                      </h2>
                      <v-data-table
                        v-model="CHC_NONE_AUTH_USER"
                        class="pl-grid has-control is-mt-m"
                        :headers="NONE_AUTH_USER_HEADER"
                        :items="NONE_AUTH_USER"
                        show-select
                        fixed-header
                        item-key="USER_ID"
                        height="492px"
                        :items-per-page="ROW_PER_PAGE"
                        hide-default-footer
                        :page.sync="page1"
                        no-data-text="등록된 데이터가 없습니다."
                        @page-count="pageCount1 = $event">
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
                          v-model="page1"
                          :length="pageCount1"
                          circle
                          :total-visible="7">
                        </v-pagination>

                        <!-- 더보기 다음 있을때만 노출 -->
                        <span class="pl-pager-period">
                          보기 {{ mixin_getPagePeriod(NONE_AUTH_USER, page1)}} / {{ NONE_AUTH_USER.length }}
                          <compo-tooltip-btn
                            TitleProp="다음 검색"
                            ClassProp="pl-tooltip-btn is-line"
                            IconProp="pl-icon20 arrow-next-paging"
                            TooltipPositionProp="bottom"
                            @btnClick="getNotAllocUser('next')"
                            :DisabledProp="nextDisabled1"
                          ></compo-tooltip-btn>
                        </span>
                      </div>

                    </div>
                    <div class="d-flex flex-column justify-center align-center" style="flex: 0 0 58px; gap: 14px">
                      <!-- arrow left 버튼 -->
                      <compo-tooltip-btn
                        TitleProp="권한 설정 해제"
                        ClassProp="pl-tooltip-btn"
                        IconProp="pl-icon30 is-arrow-left"
                        TooltipPositionProp="bottom"
                        @btnClick="moveUserRevoke"
                        :DisabledProp="CHC_AUTH_USER.length !=0 ? false : true"
                      ></compo-tooltip-btn>
                      <!-- arrow right 버튼 -->
                      <compo-tooltip-btn
                        TitleProp="권한 설정"
                        ClassProp="pl-tooltip-btn"
                        IconProp="pl-icon30 is-arrow-right"
                        TooltipPositionProp="bottom"
                        @btnClick="moveUserGrnt"
                        :DisabledProp="CHC_NONE_AUTH_USER.length != 0?false:true"
                      ></compo-tooltip-btn>
                    </div>
                    <div>
                      <h2 class="pl-subtit d-flex justify-space-between">부여된 사용자
                        <span class="pl-counter">전체 <em class="pl-1">({{ AUTH_USER.length }})</em> 건</span>
                      </h2>

                      <v-data-table
                        class="pl-grid has-control is-mt-m"
                        v-model="CHC_AUTH_USER"
                        :headers="AUTH_USER_HEADER"
                        :items="AUTH_USER"
                        show-select
                        fixed-header
                        item-key="index"
                        height="492px"
                        :items-per-page="ROW_PER_PAGE"
                        hide-default-footer
                        :page.sync="page2"
                        no-data-text="등록된 데이터가 없습니다."
                        @page-count="pageCount2 = $event">
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
                          v-model="page2"
                          :length="pageCount2"
                          circle
                          :total-visible="7">
                        </v-pagination>

                        <!-- 더보기 다음 있을때만 노출 -->
                        <span class="pl-pager-period">
                          보기 {{ mixin_getPagePeriod(AUTH_USER, page2) }} / {{ AUTH_USER.length }}
                              <compo-tooltip-btn
                                TitleProp="다음 검색"
                                ClassProp="pl-tooltip-btn is-line"
                                IconProp="pl-icon20 arrow-next-paging"
                                TooltipPositionProp="bottom"
                                @btnClick="getAllocUser('next')"
                                :DisabledProp="nextDisabled2"
                              ></compo-tooltip-btn>
                        </span>
                      </div>

                    </div>
                  </div>
                </div>
                <div class="pl-card is-bottom">
                  <div class="is-right">
                    <v-btn class="pl-btn"
                    :disabled="AUTHRT_SAVE_BTN"
                    @click="saveRtn"
                    >저장</v-btn>
                  </div>
                </div>
              </div>
            </div>
          </v-tab-item>
          <!-- 사용자별 권한 설정 -->
          <v-tab-item>
            <div class="pl-cols" style="height: 100%">
              <div class="is-col-fix is-vrt" >
                <!-- 조회 -->
                <div class="pl-search-header">
                  <div class="pl-form-inline-wrap">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        사용자 ID
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          class="pl-form "
                          placeholder="검색어 입력"
                          v-model="SRCH_USER_PARAM.LGN_ID"
                          @keyup.enter="gerAuthrtList"
                        ></v-text-field>
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        사용자 명
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          class="pl-form "
                          placeholder="검색어 입력"
                          v-model="SRCH_USER_PARAM.USER_NM"
                          @keyup.enter="gerAuthrtList"
                        >
                         <template v-slot:append>
                            <!-- <compo-tooltip-btn
                              TitleProp="사용자 찾기"
                              ClassProp="pl-tooltip-btn is-line"
                              IconProp="pl-icon20 in-search"
                              TooltipPositionProp="bottom"
                              @btnClick="userFind"/> -->
                               <v-btn
                                @click="mixin_showDialog('UserFind')"
                                class="pl-btn has-icon-only">
                                <span class="pl-icon20 in-search"></span>
                               </v-btn>
                         </template>
                        </v-text-field>
                      </div>
                    </div>
                    <v-btn class="pl-btn is-icon"
                    @click="gerAuthrtList">
                      <span class="pl-icon20 search"></span>
                      조회
                    </v-btn>
                  </div>
                </div>
                <!-- grid -->
                <div class="pl-card">
                  <div class="pl-cols">
                    <div class="is-col-fix" style="width: 510px;">
                      <h2 class="pl-subtit d-flex justify-space-between">부여되지 않은 그룹
                        <span class="pl-counter">전체 <em class="pl-1">({{ NONE_AUTH_GROUP.length }})</em> 건</span>
                      </h2>
                      <v-data-table
                        class="pl-grid has-control is-mt-m"
                        v-model="CHC_NONE_AUTH_GROUP"
                        :headers="NONE_AUTH_GROUP_HEADER"
                        :items="NONE_AUTH_GROUP"
                        show-select
                        single-select
                        fixed-header
                        item-key="AUTHRT_GROUP_ID"
                        height="492px"
                        :items-per-page="ROW_PER_PAGE"
                        hide-default-footer
                        :page.sync="page3"
                        no-data-text="등록된 데이터가 없습니다."
                        @page-count="pageCount = $event">
                      </v-data-table>

                    </div>
                    <div class="d-flex flex-column justify-center align-center" style="flex: 0 0 58px; gap: 14px">
                      <!-- arrow left 버튼 -->
                      <compo-tooltip-btn
                        TitleProp="권한 설정 해제"
                        ClassProp="pl-tooltip-btn"
                        IconProp="pl-icon30 is-arrow-left"
                        TooltipPositionProp="bottom"
                        @btnClick="moveAuthrtRevoke"
                      ></compo-tooltip-btn>
                      <!-- arrow right 버튼 -->
                      <compo-tooltip-btn
                        TitleProp="권한 설정"
                        ClassProp="pl-tooltip-btn"
                        IconProp="pl-icon30 is-arrow-right"
                        TooltipPositionProp="bottom"
                        @btnClick="moveAuthrtGrnt"
                      ></compo-tooltip-btn>
                    </div>
                    <div>
                      <h2 class="pl-subtit d-flex justify-space-between">부여된 그룹
                        <span class="pl-counter">전체 <em class="pl-1">({{ AUTH_GROUP.length }})</em> 건</span>
                      </h2>

                      <v-data-table
                        class="pl-grid has-control is-mt-m"
                        v-model="CHC_AUTH_GROUP"
                        :headers="AUTH_GROUP_HEADER"
                        :items="AUTH_GROUP"
                        show-select
                        single-select
                        fixed-header
                        item-key="AUTHRT_GROUP_ID"
                        height="492px"
                        :items-per-page="ROW_PER_PAGE"
                        hide-default-footer
                        :page.sync="page4"
                        no-data-text="등록된 데이터가 없습니다."
                        @page-count="pageCount4 = $event">
                      </v-data-table>

                    </div>
                  </div>
                </div>
                <div class="pl-card is-bottom">
                  <div class="is-right">
                    <v-btn class="pl-btn"
                    :disabled="AUTHRT_SAVE_BTN"
                    @click="saveRtn"
                    >저장</v-btn>
                  </div>
                </div>
              </div>
            </div>

          </v-tab-item>
        </v-tabs-items>
      </div>
    </div>
    <!-- dialog -->
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
            :SearchInputProp.sync="SRCH_USER_PARAM.USER_NM"
            :DataHeaderProp="HeadersFindCus"
            :DataBodyProp="ItemsFindCus"
            :FindData="FIND_USER"
            @findData="[setUser(), mixin_hideDialog('UserFind')]"
             @input="FIND_USER = $event"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('UserFind')">닫기</v-btn>
          <v-btn class="pl-btn"  @click="[setUser(), mixin_hideDialog('UserFind')]">확인</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
export default {
name:"MENU_STG_M0606", //name은 'MENU_' + 파일명 조합
components: {
},
data() {
   return {
    tab: null,

    AUTHRT_SAVE_BTN : true,
    LEFT_BTN:false,
    RIGHT_BTN:false,

    dialogUserFind:false,
    searchUsername:'',
    HeadersFindCus:[],
    ItemsFindCus:[],
    DropUser:{},

    FIND_USER:[],  // 사용자 찾기 모달에서 가져온 사용자 정보


    // 권한 그룹별 설정
    // grid
    page1: 1,
    pageCount1: 0,

    perPage: [15,30,50,100],
    ROW_PER_PAGE: 15,

    page2: 1,
    pageCount2: 0,
    perPage2: [15,30,50,100],
    ROW_PER_PAGE2: 15,

    // 사용자 검색 조건 (권한,사용자 같이 사용)

    SRCH_AUTHRT_PARAM : {
      AUTHRT_GROUP_ID:'',
      LGN_ID : '',
      USER_NM:''
    },

    SRCH_USER_PARAM :{
      LGN_ID :'',
      USER_NM : '',
    },

    NONE_AUTH_USER_HEADER: [
      { text: '번호', value: 'index', align: 'center', width: '50px' },
      { text: '사용자ID', value: 'LGN_ID', width: '100px' },
      { text: '사용자명', value: 'USER_NM', width: '100px'},
      { text: '소속', value: 'DEPT_NM' , width: '140px' },
      { text: '등록일', value: 'REG_DT', width: '120px' },
    ],


    NONE_AUTH_USER :[],
    AUTH_USER:[],

    CHC_NONE_AUTH_USER:[],
    CHC_AUTH_USER:[],
    CHC_NONE_AUTH_GROUP:[],
    CHC_AUTH_GROUP:[],

    REVOKE_GROUP:[],
    GRNT_GROUP:[],

    BTN_TYPE : '',
    items: [],


    AUTH_USER_HEADER: [
      { text: '번호', value: 'index', align: 'center', width: '50px' },
      { text: '사용자 ID', value: 'LGN_ID',  width: '120px' },
      { text: '사용자명', value: 'USER_NM',width: '120px'},
      { text: '사용자닉네임', value: 'USER_NNM',  width: '120px' },
      { text: '할당일', value: 'MDFCN_DT',  width: '120px' },
    ],


    dropItemsM01: ['상담'],

    AUTHRT_GROUP_DROP:[],                // 권한 그룹 드롭박스
    AUTHRT_GROUP:'',                     // 권한 그룹


        //그리드 페이지속성정의
        // 부여되지않은 사용자 페이징
      pagination1: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      },
      nextDisabled1: false,

      // 부여된 사용자 페이징
      pagination2: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      },
      nextDisabled2: false,


    MESSAGE:{
      CONFIRM :{
        REGIST : { alertDialogToggle : true, msg : '선택한 사용자의<br>권한을 등록 하시겠습니까?', iconClass:'is-info', type :'confirm', callYes: this.grntAgentByAuthrt, callNo:this.closeMsg},
        DELETE : { alertDialogToggle : true, msg : '선택한 사용자의<br>권한을 회수 하시겠습니까?', iconClass:'is-info', type :'confirm', callYes: this.revokeAgentByAuthrt, callNo:this.closeMsg},
        REGIST_AUTH : { alertDialogToggle : true, msg : '선택한 권한을 부여 하시겠습니까?', iconClass:'is-info', type :'confirm', callYes: this.grntAuthrtRtn, callNo:this.closeMsg},
        DELETE_AUTH : { alertDialogToggle : true, msg : '선택한 권한을 회수 하시겠습니까?', iconClass:'is-info', type :'confirm', callYes: this.revokeAuthrtRtn, callNo:this.closeMsg},
      },
      ALERT : {
        AUTHRT_IS_EMPTY : { alertDialogToggle : true, msg:'권한그룹을 선택 하세요',iconClass: 'is-info', type:'default' },
        REG_SUCCESS : { alertDialogToggle : true, msg:'처리되었습니다.',iconClass: 'is-done', type:'default'},
        INSERT_PARAM : { alertDialogToggle : true, msg:'검색할 사용자를 입력하세요.', iconClass: 'is-info', type:'default'},
        NO_AUTHRT_DATA: { alertDialogToggle : true, msg:'선택된 권한이 없습니다.', iconClass: 'is-info', type:'default'},
      },
      ERROR : {
        NONE_EXST_USER : {alertDialogToggle : true, msg:'존재하지 않는 사용자입니다.',iconClass: 'is-caution', type:'default'},
        },
      TOAST : {
        SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
        },
    },



    // 사용자별 권한 설정

    // grid
    page3: 1,
    pageCount3: 0,
    perPage3: [15,30,50,100],
    ROW_PER_PAGE3: -1,
    NONE_AUTH_GROUP_HEADER: [
      { text: '번호', value: 'ROWNUM', align: 'center', width: '50px' ,sortable : false},
      { text: '권한 그룹명', value: 'AUTHRT_GROUP_NM', align: 'center', width: '120px' ,sortable : false},
      { text: '사용자구분', value: 'USER_SE_CD',width: '120px',sortable : false},
    ],

    NONE_AUTH_GROUP:[],

    page4: 1,
    pageCount4: 0,
    perPage4: [15,30,50,100],
    ROW_PER_PAGE4: -1,
    AUTH_GROUP_HEADER: [
      { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px',sortable : false },
      { text: '권한 그룹명', value: 'AUTHRT_GROUP_NM', align: 'center', width: '120px',sortable : false },
      { text: '그룹 정보', value: 'GROUP_EXPLN', align: 'center', width: '120px' ,sortable : false},
      { text: '관리자 여부', value: 'MNGR_PM_CD', width: '120px',sortable : false},
      { text: '우선순위', value: 'SORT_ORD', align: 'center', width: '120px' ,sortable : false},
      { text: '사용자 구분', value: 'USER_SE_CD', align: 'center', width: '120px' ,sortable : false},
    ],

    AUTH_GROUP:[],
    RTN_USER_INFO:[],


   }
 },
  watch: {
    ItemsFindCus(){
      // console.log("this.SRCH_USER",this.ItemsFindCus[0])
    }
  },

  computed: {

  },

  created() {

  },
  beforeMount(){

    },
  mounted() {

    this.init();
    // 사용자 권한목록 조회
    this.srchAuthrtGroup();
    this.SRCH_AUTHRT_PARAM.AUTHRT_GROUP_ID = '6';
    this.getUserList();
  },

  methods: {

  init(){

    // 선택된 그리드 아이템
    this.CHC_NONE_AUTH_USER=[];
    this.CHC_AUTH_USER=[];

    // 저장버튼 disabled
    this.AUTHRT_SAVE_BTN = true;

    // 버튼타입(권한부여, 권한회수)
    this.BTN_TYPE ='';

    this.NONE_AUTH_GROUP=[];
    this.AUTH_GROUP=[];

    this.CHC_NONE_AUTH_GROUP=[];
    this.CHC_AUTH_GROUP=[];

    this.RTN_USER_INFO=[];

    this.SRCH_USER_PARAM.LGN_ID = '';
    this.SRCH_USER_PARAM.USER_NM = '';

    this.FIND_USER=[];

  },


  /*    사용자 권한 목록 조회    */

  async srchAuthrtGroup(){
      let sURL = '/api/setting/system/menu-author-manage/author-group/inqire';

      let postParam = {
      }

      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sURL,postParam,headParam)

      if(resData.HEADER.ERROR_FLAG){
        this.showAlert(this.MESSAGE.ERROR.GET_USER_INFO_FAIL);
      }else{
        let tempData = []
        this.AUTHRT_GROUP = resData.DATA

        for(let i= 0 ; i < resData.DATA.length ; i++){

          let dropitem ={
                  text : resData.DATA[i].AUTHRT_GROUP_NM,
                  value : resData.DATA[i].AUTHRT_GROUP_ID,
                };
          // let tempData= {text : '전체', value : '',}
          // this.AUTHRT_GROUP_DROP.push(tempData);
          this.AUTHRT_GROUP_DROP.push(dropitem);

        this.$set(this.NONE_AUTH_GROUP, 'ROW_NUMBER', i);
        }
      }
    },
  setUser(){
    this.SRCH_USER_PARAM.LGN_ID = this.FIND_USER.LGN_ID;
    this.SRCH_USER_PARAM.USER_NM = this.FIND_USER.USER_NM;
  },
  closeMsg(){
    this.$store.commit("alertStore/hideAlert");
  },


    /*    사용자 정보 조회    */

   getUserList(){

     if(this.mixin_isEmpty(this.SRCH_AUTHRT_PARAM.AUTHRT_GROUP_ID)){
       this.showAlert(this.MESSAGE.ALERT.AUTHRT_IS_EMPTY);
     }else{
       this.getNotAllocUser();
       this.getAllocUser();
       this.init();
     }
   },


  /*  미할당 사용자  */

  async getNotAllocUser(next){

    //다음버튼 클릭 유무
        if (next !== 'next'){
          this.NONE_AUTH_USER = [];
          this.pagination1.page = 1; //페이징 처리 초기화
          this.nextDisabled1 = true;  //버튼 비활성화
        }

    let sURL ='/api/setting/system/author-by-agent-manage/asgn-info-by-agent/inqire';

    let postParam =  {
       LGN_ID: this.SRCH_AUTHRT_PARAM.LGN_ID,             // 사용자에게 채번되어들어가는 id가 아닌 로그인 아이디(LGN_ID)
       USER_NM: this.SRCH_AUTHRT_PARAM.USER_NM,
       AUTHRT_GROUP_ID : this.SRCH_AUTHRT_PARAM.AUTHRT_GROUP_ID,
       NULLABLE : 'IS NULL',
     }

     let headParam ={
        head: {
            "ROW_CNT" : this.pagination1.rowsPerPage,
            "PAGES_CNT" : this.pagination1.page,
            "PAGING" : "Y",
          }
     }

    let response = await this.common_postCall(sURL,postParam, headParam);

    if(!response.HEADER.ERROR_FLAG){

      let tempData = response.DATA;

      let j=0
      let index = this.NONE_AUTH_USER.length + 1;

     tempData.map(item =>{
         tempData[j]["index"]= index++;
         tempData[j]["REG_DT"] = this.mixin_convertDate(tempData[j]["REG_DT"],'yyyy-MM-dd')
       return j ++
       });

      this.NONE_AUTH_USER = [...this.NONE_AUTH_USER, ...tempData];

        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
           if(response.HEADER.next === true){
             this.nextDisabled1 = false;
           }else{
              this.nextDisabled1 = true;
           }
        }
       //이부분은 체크해볼것
      this.pagination1.page += 1;
      // this.page1=1;
    }
   },

  /*  할당 사용자  */

  async getAllocUser(next){

    //다음버튼 클릭 유무
        if (next !== 'next'){
          this.AUTH_USER = [];
          this.pagination2.page = 1; //페이징 처리 초기화
          this.nextDisabled2 = true;  //버튼 비활성화
        }

    let sURL ='/api/setting/system/author-by-agent-manage/asgn-info-by-agent/inqire';

    let postParam =  {
       LGN_ID: this.SRCH_AUTHRT_PARAM.LGN_ID,             // 사용자에게 채번되어들어가는 id가 아닌 로그인 아이디(LGN_ID)
       USER_NM: this.SRCH_AUTHRT_PARAM.USER_NM,
       AUTHRT_GROUP_ID : this.SRCH_AUTHRT_PARAM.AUTHRT_GROUP_ID,
     }

     let headParam ={
        head: {
            "ROW_CNT" : this.pagination2.rowsPerPage,
            "PAGES_CNT" : this.pagination2.page,
            "PAGING" : "Y",
          }
     }

    let response = await this.common_postCall(sURL,postParam, headParam);

    if(!response.HEADER.ERROR_FLAG){

      let tempData = response.DATA;

      let j=0
      let index = this.AUTH_USER.length +1;

     tempData.map(item =>{
         tempData[j]["index"] = index ++;
         tempData[j]["MDFCN_DT"] = this.mixin_convertDate(tempData[j]["MDFCN_DT"],'yyyy-MM-dd');
       return j ++
       });

      this.AUTH_USER = [...this.AUTH_USER, ...tempData];

        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
           if(response.HEADER.next === true){
             this.nextDisabled2 = false;
           }else{
              this.nextDisabled2 = true;
           }
        }
       //이부분은 체크해볼것
      this.pagination2.page += 1;
      // this.page1=1;
    }
   },

















  //  /*    할당 사용자    */

  //  getAllocUser(){

  //   this.AUTH_USER=[];

  //   let postParam =  {
  //      LGN_ID: this.SRCH_AUTHRT_PARAM.LGN_ID,             // 사용자에게 채번되어들어가는 id가 아닌 로그인 아이디(LGN_ID)
  //      USER_NM: this.SRCH_AUTHRT_PARAM.USER_NM,
  //      AUTHRT_GROUP_ID : this.SRCH_AUTHRT_PARAM.AUTHRT_GROUP_ID,
  //    }

  //   this.call_get_user_api(postParam, 'Alloc','next')

  //  },


  // /*   할당/미할당 사용자 API CALL   */
  // async call_get_user_api(postParam, FLAG, next){

  //     //다음버튼 클릭 유무
  //       if (!next == 'next'){
  //       // } else {
  //         this.pagination.page = 1; //페이징 처리 초기화
  //         this.nextDisabled = true;  //버튼 비활성화
  //       }

  //   let sURL ='/api/setting/system/author-by-agent-manage/asgn-info-by-agent/inqire';

  //   let headParam =  {
  //         head: {
  //           "ROW_CNT" : this.pagination.rowsPerPage,
  //           "PAGES_CNT" : this.pagination.page,
  //           "PAGING" : "Y",
  //         }
  //       }

  // let resData = await this.common_postCall(sURL,postParam,headParam)

  //   if(!this.mixin_isEmpty(resData.DATA)){
  //     let j = 0;

  //     switch(FLAG){

  //       case 'Alloc':
  //           this.AUTH_USER = resData.DATA;

  //           this.AUTH_USER.map(item =>{
  //             this.AUTH_USER[j]["MDFCN_DT"] = this.mixin_convertDate(resData.DATA[j].MDFCN_DT,'yyyy-MM-dd')
  //             console.log(this.AUTH_USER[j]["REG_DT"])
  //           return j ++
  //           });
  //         break;

  //       case 'notAlloc':
  //         this.NONE_AUTH_USER = resData.DATA;
  //          this.NONE_AUTH_USER.map(item =>{
  //             this.NONE_AUTH_USER[j]["REG_DT"] = this.mixin_convertDate(resData.DATA[j].REG_DT,'yyyy-MM-dd')
  //           return j ++
  //           });
  //         break;

  //     }
  //   }
  // },

  /*  권한없는 사용자 권한 부여  */

  moveUserGrnt(){

    let checkedItem =[]
    checkedItem = this.CHC_NONE_AUTH_USER;
    this.AUTHRT_SAVE_BTN = false
    this.BTN_TYPE = 'GRANT_USER';
    this.LEFT_BTN=true;

    // 체크된 부여되지않은사용자 배열과 기존의 배열을 비교해 선택된 USER를 제외
    for(let i =0; i<checkedItem.length; i++){
      let j = this.NONE_AUTH_USER.findIndex(item => item.USER_ID === checkedItem[i]["USER_ID"]);

      this.NONE_AUTH_USER.splice(j, 1);

      this.AUTH_USER.push(checkedItem[i]);

    }
    this.CHC_NONE_AUTH_USER=[];

  },

  /*  사용자 권한 삭제  */

  moveUserRevoke(){

    let checkedItem =[]
    checkedItem = this.CHC_AUTH_USER;
    this.AUTHRT_SAVE_BTN = false;
    this.BTN_TYPE = 'REVOKE_USER';

    for(let i =0; i<checkedItem.length; i++){
      let j = this.AUTH_USER.findIndex(item => item.USER_ID === checkedItem[i]["USER_ID"]);

      this.AUTH_USER.splice(j, 1);

      this.NONE_AUTH_USER.push(checkedItem[i]);

    }
    this.CHC_AUTH_USER=[];
  },

    /* 사용자별 권한 설정 미부여그룹 -> 부여그룹 */

  moveAuthrtGrnt(){

   let checkedItem =[]
   checkedItem = this.CHC_NONE_AUTH_GROUP;
   this.AUTHRT_SAVE_BTN = false
   this.BTN_TYPE = 'GRANT_AUTH';
   this.LEFT_BTN=true;

    // 체크된 부여되지않은 그룹 배열과 기존의 배열을 비교해 선택된 group를 제외


      for(let i =0; i<checkedItem.length; i++){
        let j = this.NONE_AUTH_GROUP.findIndex(item => item.AUTHRT_GROUP_ID === checkedItem[i]["AUTHRT_GROUP_ID"]);
        this.NONE_AUTH_GROUP = [...this.AUTHRT_GROUP];
        this.NONE_AUTH_GROUP.splice(j, 1);

        this.AUTH_GROUP=[];
        this.AUTH_GROUP.push(checkedItem[i]);
        // console.log(checkedItem)

      }
      this.CHC_NONE_AUTH_GROUP=[];
  },

  moveAuthrtRevoke(){
    let checkedItem =[]
    checkedItem = this.CHC_AUTH_GROUP;
    this.AUTHRT_SAVE_BTN = false
    this.BTN_TYPE = 'REVOKE_AUTH';
    this.LEFT_BTN=true;

   /*  for(let i =0; i<checkedItem.length; i++){
      let j = this.NONE_AUTH_GROUP.findIndex(item => item.AUTHRT_GROUP_ID === checkedItem[i]["AUTHRT_GROUP_ID"]);

      this.NONE_AUTH_GROUP.splice(j, 1);
      this.NONE_AUTH_GROUP.push(this.AUTH_GROUP[0])
      this.AUTH_GROUP=[];
      this.AUTH_GROUP.push(checkedItem[i]);

    }
    this.CHC_NONE_AUTH_USER=[];
   */

    if(this.AUTH_GROUP.length > 0){
      this.NONE_AUTH_GROUP.push(this.AUTH_GROUP[0])
      this.AUTH_GROUP=[];
      this.CHC_AUTH_USER=[];
    }
  },



  saveRtn(){
    if(!this.tab){
        if(this.BTN_TYPE === 'GRANT_USER'){
          this.showAlert(this.MESSAGE.CONFIRM.REGIST)
        }else if(this.BTN_TYPE ==='REVOKE_USER'){
          this.showAlert(this.MESSAGE.CONFIRM.DELETE)
        }
    }else{
      if(this.AUTH_GROUP.length !== 0){
        if(this.BTN_TYPE === 'GRANT_AUTH'){
          this.showAlert(this.MESSAGE.CONFIRM.REGIST_AUTH);
        }else if(this.BTN_TYPE === 'REVOKE_AUTH'){
          this.showAlert(this.MESSAGE.CONFIRM.DELETE_AUTH);
        }
      }else{
        this.showAlert(this.MESSAGE.ALERT.NO_AUTHRT_DATA)
      }
    }
  },
  grntAuthrtRtn(){
      this.authrtByAgent('U')
  },
  revokeAuthrtRtn(){
      this.authrtByAgent('D')
  },

  /*   권한 그룹별 설정 - 사용자 권한 부여   */

  async grntAgentByAuthrt(){

      let grntUser =[];
      let authrtGroupId = this.SRCH_AUTHRT_PARAM.AUTHRT_GROUP_ID;


      for(let i=0;i<this.AUTH_USER.length;i++){

        if(this.AUTH_USER[i]["AUTHRT_GROUP_ID"] != authrtGroupId){
          grntUser.push(this.AUTH_USER[i]["USER_ID"]);
        }

      }

      let sUrl = '/api/setting/system/author-by-agent-manage/agent-by-author-group/regist';

        let postParam = {
          AUTHRT_GROUP_ID: authrtGroupId ,
          REG_USER_ID:  grntUser,
        }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)

      if(this.mixin_isEmpty(resData.DATA)){
          this.showAlert(this.MESSAGE.ERROR.NONE_EXST_USER)
        }
        // this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS)
        this.showToast(this.MESSAGE.TOAST.SUCCESS)
        this.closeMsg();
        this.getUserList();
        this.init();
  },

  /* 권한 그룹별 설정 - 사용자 권한 삭제  */

 async revokeAgentByAuthrt(){
    let revokeUser =[];
    let authrtGroupId = this.SRCH_AUTHRT_PARAM.AUTHRT_GROUP_ID;
    let arrUserId =[];
    let sUrl = '/api/setting/system/author-by-agent-manage/agent-by-author-group/delete';


      for(let i=0;i<this.NONE_AUTH_USER.length;i++){
        if(this.NONE_AUTH_USER[i]["AUTHRT_GROUP_ID"] === authrtGroupId){
          // revokeUser.push(this.NONE_AUTH_USER[i]["USER_ID"]);
          // arrUserId[i] = this.NONE_AUTH_USER[i].USER_ID;
          arrUserId.push(this.NONE_AUTH_USER[i].USER_ID);

        }
      }

    let postParam = {
       DEL_USER_ID : arrUserId,
       AUTHRT_GROUP_ID: authrtGroupId,
       };
    let headParam = {
      head:{
      },
    };

     let resData = await this.common_postCall(sUrl, postParam, headParam)

      if(!resData.ERROR_FLAG){
        // this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS)
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeMsg();
        this.getUserList();
        this.init();

        }

  },

  /* 사용자별 권한 설정- 사용자 할당 정보 단 건 조회 */

  async gerAuthrtList(){

    this.AUTH_GROUP=[];
    this.CHC_AUTH_GROUP = [];
    this.NONE_AUTH_GROUP=[];
    this.CHC_NONE_AUTH_GROUP=[];

    let sUrl = 'api/setting/system/author-by-agent-manage/asgn-info-by-id/inqire';
    let postParam ={
      LGN_ID : this.SRCH_USER_PARAM.LGN_ID,
      USER_NM : this.SRCH_USER_PARAM.USER_NM
    };

    let headParam={
      head:{
      }
    }

    if(!this.mixin_isEmpty(this.SRCH_USER_PARAM.LGN_ID) || !this.mixin_isEmpty(this.SRCH_USER_PARAM.USER_NM)){
      let resData = await this.common_postCall(sUrl,postParam,headParam)



      if(resData.DATA.length > 1){
        this.mixin_showDialog('UserFind');
      }else if(this.mixin_isEmpty(resData.DATA)){
        this.showAlert(this.MESSAGE.ERROR.NONE_EXST_USER)
      }else{

      // if(resData.DATA.length > 0){
        this.RTN_USER_INFO = resData.DATA;
        this.NONE_AUTH_GROUP = [...this.AUTHRT_GROUP];

        let tempData ='';
        tempData = resData.DATA;

          for(let i=0;i<tempData.length;i++){

          // this.$set(this.AUTH_GROUP, 'ROW_NUMBER', i);
            let j = this.NONE_AUTH_GROUP.findIndex(item => item.AUTHRT_GROUP_ID === tempData[i]["AUTHRT_GROUP_ID"]);
            this.NONE_AUTH_GROUP.splice(j, 1);
            this.AUTH_GROUP = tempData;
            this.AUTH_GROUP[i]["ROW_NUMBER"] = 1+i;
          }
      }
        }else{
            this.showAlert(this.MESSAGE.ALERT.INSERT_PARAM)
      }

    },

  /* 사용자별 권한 설정 - 권한 부여/삭제 */
  async authrtByAgent(DATA_FLAG){

    let sUrl = '/api/setting/system/author-by-agent-manage/author-group-by-agent/regist';

    let postParam = {
      DATA_FLAG : DATA_FLAG,
      AUTHRT_GROUP_ID : !this.mixin_isEmpty(this.AUTH_GROUP) ? this.AUTH_GROUP[0].AUTHRT_GROUP_ID : '',
      REG_USER_ID : this.RTN_USER_INFO[0].USER_ID,
    };
    let headParam = {
      head :{}
    }

    let resData = await this.common_postCall(sUrl, postParam, headParam);

    if(!this.mixin_isEmpty(resData)){
      // this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS)
      this.showToast(this.MESSAGE.TOAST.SUCCESS);
      this.closeMsg();
      this.init();
    }
  },


  },
}
</script>

<style lang="scss" scoped>

</style>