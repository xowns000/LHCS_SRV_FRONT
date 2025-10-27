<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label ">
                메시지 분류
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form is-lg"
                  :items="COM_SYS_MSG_DROP"
                  placeholder="선택하세요"
                  v-model="SRCH_SYS_MSG_ID"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                사용여부
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(common_code, 'USE_WT','전체')"
                  placeholder="선택하세요"
                  v-model="SRCH_USE_YN"
                ></v-select>
              </div>
            </div>
            <v-btn
              class="pl-btn is-icon"
              @click="sysMsgSrch()"
            >
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body">
        <div class="pl-grid-top">
          <div class="pl-grid-top-left">
            <v-btn
              class="pl-btn is-icon is-sub"
              @click="[BF_MSG_HR = MSG_HR,mixin_showDialog('RegMsg')]"
              :disabled="SYS_MSG_ID == '' ? true : false"
            >
              <span class="pl-icon20 document"></span>
              선택항목 상세
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub" @click="[BF_MSG_HR='-1',initSysMsg(),mixin_showDialog('RegMsg')]">
              <span class="pl-icon20 circle-plus"></span>
              등록
            </v-btn>
            <v-btn
              class="pl-btn is-icon is-sub"
              @click="showAlert(MESSAGE.CONFIRM.DEL)"
              :disabled="CHC_SYS_MSG_LIST.length == 0 ? true : false"
            >
              <span class="pl-icon20 trash"></span>
              삭제
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
          </div>
        </div>
        <v-data-table
          class="pl-grid has-control"
          :headers="headers"
          :items="items"
          :item-class="isActiveRow"
          v-model="CHC_SYS_MSG_LIST"
          show-select
          fixed-header
          item-key="NEW_ROW_NUMBER"
          height="562px"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
          :page.sync="page"
          @page-count="pageCount = $event"
          @click:row="rowClick"
          @dblclick:row="[BF_MSG_HR = MSG_HR,mixin_showDialog('RegMsg')]"
          no-data-text="등록된 데이터가 없습니다."
        >
          <!-- 사용여부 -->
          <template v-slot:item.USE_YN="{ item }">
            <span
              :class="`pl-round-chip is-sm chat-stat-${item.USE_YN === 'Y' ? 'cs' : 'done'}`">
              {{ item.USE_YN === 'Y' ? '사용' : '사용안함 '}}
            </span>
          </template>
          <template v-slot:item.MSG_CN="{ item }">
            <v-tooltip content-class="pl-tooltip " bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">{{ item.MSG_CN }}</span>
              </template>
              <span>{{ item.MSG_CN }}</span>
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

          <span class="pl-pager-period">
            보기 {{ mixin_getPagePeriod(items, page) }} / {{ items.length }}
<!--            <compo-tooltip-btn
                TitleProp="다음 검색"
                ClassProp="pl-tooltip-btn is-line"
                IconProp="pl-icon20 arrow-next-paging"
                TooltipPositionProp="bottom"
                @btnClick="sysMsgSrch('next')"
                :DisabledProp="nextDisabled"
            ></compo-tooltip-btn>-->
          </span>
        </div>
      </div>
    </div>
    <!-- dialog -->
    <v-dialog
      v-model="dialogRegMsg"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :header-title="SYS_MSG_ID ==''? '시스템 메시지 등록':'시스템 메시지 수정'"
        @hide="mixin_hideDialog('RegMsg')"
      >
        <template slot="body">
          <v-form ref="form">
          <div class="pl-form-inline-wrap vertical mt-2">
            <div class="pl-form-inline">
              <span class="pl-label">
                메시지 분류
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="COM_SYS_MSG_DIALOG_DROP"
                  placeholder="선택하세요"
                  v-model="SYS_MSG_ID"
                  :rules="validateRules.SYS_MSG_ID"
                  @change="sysMsgChnge()"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                메시지 유형
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(common_code, 'MESG_TP')"
                  placeholder="선택하세요"
                  v-model="MSG_TYPE_CD"
                  :rules="validateRules.MSG_TYPE_CD"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                메시지 설명
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  v-model="MSG_EXPLN"
                  disabled
                  v-byte-counter="2000"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                메시지 내용
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-textarea
                  class="pl-form is-noresize"
                  placeholder="시스템 메시지 내용 입력"
                  v-model="MSG_CN"
                  :rules="validateRules.MSG_CN"
                  :spellcheck="false"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                메시지 시간
                <v-icon class="pl-icon20"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  v-model="MSG_HR"
                  :rules="validateRules.MSG_HR"
                  type="number"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                  v-byte-counter="4"
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
                  :items="mixin_common_code_get(common_code, 'USE_WT')"
                  placeholder="선택하세요"
                  v-model="USE_YN"
                  :rules="validateRules.USE_YN"
                ></v-select>
              </div>
            </div>
          </div>
          </v-form>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="[initSysMsg(),mixin_hideDialog('RegMsg')]">닫기</v-btn>
          <v-btn
            class="pl-btn"
            @click="showAlert(MESSAGE.CONFIRM.REG)"
            v-if="BF_MSG_HR =='-1'"
          >
            저장
          </v-btn>
          <v-btn
            class="pl-btn"
            @click="showAlert(MESSAGE.CONFIRM.MDFCN)"
            v-if="BF_MSG_HR !='-1'"
          >
            수정
          </v-btn>
        </template>

      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
export default {
name:"MENU_STG_M0505", //name은 'MENU_' + 파일명 조합
components: {
},
data() {
   return {
    //공통코드
    common_code:[],

    // top search
    COM_SYS_MSG_DROP:[],            //검색창 메시지 분류 드롭박스
    SRCH_SYS_MSG_ID:'',             //검색 메시지 분류
    SRCH_USE_YN:'',                 //검색 사용여부

    // dialog
    dialogRegMsg: false,
    COM_SYS_MSG_DIALOG_DROP:[],     //등록창 메시지 분류 드롭박스(전체항목 없음)
    SYS_MSG_ID:'',                  //등록창 메시지 분류
    MSG_TYPE_CD:'GENMSG',           //기존
    MSG_CN:'',
    MSG_EXPLN:'',
    BF_MSG_HR:'',
    MSG_HR:'0',
    USE_YN:'Y',

    // grid
    page: 1,
    pageCount: 0,
    perPage: [15,30,50,100],
    ROW_PER_PAGE: 15,
    headers: [
      { text: '번호', value: 'NEW_ROW_NUMBER', width: '80px' },
      { text: '메시지 분류', value: 'MSG_EXPLN', width: '200px' },
      { text: '메시지 유형', value: 'MSG_TYPE_CD_NM', width: '200px' },
      { text: '메시지 설명', value: 'MSG_SE_CD_NM', width: '200px' },
      { text: '메시지 내용', value: 'MSG_CN'},
      { text: '사용여부', value: 'USE_YN', width: '120px' },
      { text: '등록자', value: 'RGTR_NM', width: '120px' },
      { text: '등록일', value: 'NEW_REG_DT', width: '120px' },
    ],
    items: [],

    pagination: {
          page: 1,
          rowsPerPage: 5,
          sortBy: "",
          descending: ""
        }, //그리드 페이지속성정의
    nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼

    CHC_SYS_MSG_LIST:[],      //체크한 시스템 메시지 리스트

    //알림창 메시지
    MESSAGE : {
      CONFIRM : {
        REG : {alertDialogToggle: true, msg: '시스템 메시지를 등록하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.sysMsgStrg, callNo: this.closeMsg}
        , MDFCN: {alertDialogToggle: true, msg: '시스템 메시지를 수정하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.sysMsgStrg, callNo: this.closeMsg}
        , DEL: {alertDialogToggle: true, msg: '시스템 메시지를 삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.sysMsgDel, callNo: this.closeMsg}
      },
      ALERT : {
        REG_SUCCESS : {alertDialogToggle: true, msg: '시스템 메시지가 등록되었습니다', iconClass: 'is-info', type: 'default'}
        , MDFCN_SUCCESS : {alertDialogToggle: true, msg: '시스템 메시지가 수정되었습니다', iconClass: 'is-info', type: 'default'}
        , DEL_SUCCESS : {alertDialogToggle: true, msg: '시스템 메시지가 삭제되었습니다', iconClass: 'is-info', type: 'default'}
        , MSG_HR_ERR : {alertDialogToggle: true, msg: '메시지 시간은 <br>마이너스(-,음수)가 될 수 없습니다', iconClass: 'is-info', type: 'default'}
        , VALID : {alertDialogToggle: true, msg: '필수항목 확인 후<br>재시도 해주세요', iconClass: 'is-info', type: 'default'}
      },
      ERROR : {
        ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
      }
    },

    //필수값 체크
    valid : true,
    validateRules: {
      SYS_MSG_ID: [
        v => !!v || '메시지 분류 은(는) 필수 입력 항목입니다.',
      ],
      MSG_TYPE_CD: [
        v => !!v || '메시지 유형 은(는) 필수 입력 항목 입니다.',
      ],
      MSG_CN: [
        v => !!v || '메시지 내용 은(는) 필수 입력 항목 입니다.',
      ],
      MSG_HR: [
        v => !!v || '메시지 시간 은(는) 필수 입력 항목 입니다.',
      ],
      USE_YN: [
        v => !!v || '사용 여부 은(는) 필수 입력 항목 입니다.',
      ],
    }
   }
 },

  watch: {

  },

  computed: {

  },

  //공통코드 사용시 async-await 필수 (mixin_common_code_get_all함수로 공통코드 리스트를 가지고 오기 전에 mixin_common_code_get이벤트 발생)
  async created() {
    //공통코드설정
    let codeName = ['MESG_CL', 'MESG_TP', 'USE_WT'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    this.comSysMsgSrch();
    this.sysMsgSrch();
  },

  mounted() {

  },

  methods: {
    //기본 시스템 메시지 리스트 조회
    //메시지 분류(공통코드) => 기본 메시지 리스트
    async comSysMsgSrch(){
      let sUrl = '/chat-api/setting/system-mssage-manage/common-sysMsg/list';
      let postParam = {
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.COM_SYS_MSG_DROP=[
          {
            text : '전체',
            value : '',
            se : ''
          }
        ];
        this.COM_SYS_MSG_DIALOG_DROP =[];
        let leng = resData.DATA.length
        for(let i=0;i<leng;i++){
          this.COM_SYS_MSG_DROP.push(
            {
              text: resData.DATA[i].MSG_EXPLN,
              value: resData.DATA[i].SYS_MSG_ID,
              se: resData.DATA[i].MSG_SE_CD_NM
            }
          )
          this.COM_SYS_MSG_DIALOG_DROP.push(
            {
              text: resData.DATA[i].MSG_EXPLN,
              value: resData.DATA[i].SYS_MSG_ID,
              se: resData.DATA[i].MSG_SE_CD_NM
            }
          )
        }
      }
    },
    //시스템메시지 조회
    async sysMsgSrch(next){
      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.items = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let sUrl = '/chat-api/setting/system-mssage-manage/list';
      let postParam = {
        SYS_MSG_ID: this.SRCH_SYS_MSG_ID,
        USE_YN: this.SRCH_USE_YN,
      }
      let headParam = {
        head: {
        /*
         채팅 진행 시 시스템 메시지 구하는 부분에서 페이징 처리 구현 어려움 페이징 처리 삭제
         "ROW_CNT" : this.pagination.rowsPerPage,
          "PAGES_CNT" : this.pagination.page,
          "PAGING" : "Y", */
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        let rowNum = 1;
        for(let k in resData.DATA){
          resData.DATA[k].NEW_REG_DT = this.mixin_convertDate(resData.DATA[k].REG_DT, 'yyyy-MM-dd');
          resData.DATA[k].NEW_ROW_NUMBER = rowNum++;

        }

        let tempDataText = resData.DATA;
        //this.items = tempDataText;
        this.items = [...this.items, ...tempDataText]
        //다음
        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 resData.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다

/*
        if(resData.HEADER.next !== null && resData.HEADER.next !== undefined){
          if(resData.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }
 */

        //이부분은 체크해볼것
        // this.pagination.page += 1
        // this.page=1;
      }
    },

    //로우 클릭시 색상 변경
    isActiveRow(item) {
      const activeClass = item.SYS_MSG_ID === this.SYS_MSG_ID && item.MSG_HR === this.MSG_HR ? "active" : "";
      return activeClass;
    },

    //로우 클릭이벤트
    rowClick(item){
      this.SYS_MSG_ID = item.SYS_MSG_ID;
      this.MSG_SE_CD = item.MSG_SE_CD;
      this.MSG_TYPE_CD = item.MSG_TYPE_CD;
      this.MSG_CN = item.MSG_CN;
      this.MSG_EXPLN = item.MSG_SE_CD_NM;
      this.MSG_HR = item.MSG_HR;
      this.USE_YN = item.USE_YN;
      // console.log("this.SYS_MSG_ID", this.SYS_MSG_ID);
    },

    //메시지 저장
    async sysMsgStrg(){
      if (!this.validate()) {
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }
      if(this.MSG_HR.includes('-')){
        this.showAlert(this.MESSAGE.ALERT.MSG_HR_ERR); //메시지 시간 - 체크
        return;
      }
      let sUrl = '/chat-api/setting/system-mssage-manage/regist';
      let postParam = {
        SYS_MSG_ID: this.SYS_MSG_ID,
        MSG_SE_CD: this.MSG_SE_CD,
        MSG_TYPE_CD: this.MSG_TYPE_CD,
        MSG_CN: this.MSG_CN,
        MSG_HR: this.MSG_HR,
        USE_YN: this.USE_YN,
        BF_MSG_HR: this.BF_MSG_HR,
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        this.initSysMsg();
        this.mixin_hideDialog('RegMsg');
        this.sysMsgSrch();
        this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS);
      }
    },

    //알림창 닫기
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    //시스템 메시지 초기화
    initSysMsg(){
      this.SYS_MSG_ID = '';
      this.MSG_SE_CD = 'SYSMSG';
      this.MSG_TYPE_CD = 'GENMSG';
      this.MSG_CN = '';
      this.MSG_EXPLN = '';
      this.MSG_HR = '';
      this.USE_YN = 'Y';
    },

    //메시지 삭제
    async sysMsgDel(){
      let arrSysMsg = [];
      let leng = this.CHC_SYS_MSG_LIST.length;
      for(let i=0;i<leng;i++){
        arrSysMsg.push(
          {
            SYS_MSG_ID:this.CHC_SYS_MSG_LIST[i]["SYS_MSG_ID"],
            MSG_HR:this.CHC_SYS_MSG_LIST[i]["MSG_HR"],
          }
        )
      }
      let sUrl = '/chat-api/setting/system-mssage-manage/delete';
      let postParam = {
        MSG_INFO: arrSysMsg,
      }
      let headParam = {
        head: {
          DATA_OBJECT: "MSG_INFO",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        this.CHC_SYS_MSG_LIST = [];
        this.sysMsgSrch();
        this.showAlert(this.MESSAGE.ALERT.DEL_SUCCESS);
      }
    },

    //필수값 체크
    validate () {
      return this.$refs.form.validate();
    },

    //메시지 설명 자동 세팅
    sysMsgChnge(){
      for(let i=0;i<this.COM_SYS_MSG_DIALOG_DROP.length;i++){
        if(this.COM_SYS_MSG_DIALOG_DROP[i].value == this.SYS_MSG_ID){
          this. MSG_EXPLN = this.COM_SYS_MSG_DIALOG_DROP[i].se;
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>