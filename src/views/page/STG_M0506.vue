<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                사용 여부
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
            <div class="pl-form-inline">
              <span class="pl-label">
                금칙어
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form is-lg"
                  placeholder="검색어 입력"
                  v-model="SRCH_FBDWD"
                />
              </div>
            </div>
            <v-btn
              class="pl-btn is-icon"
              @click="fbdwdSrch()"
            >
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols flex-grow-1">
        <!-- left -->
        <div class="is-vrt" >
          <div class="pl-card">
            <div class="pl-grid-top">
              <div class="pl-grid-top-left">
                <v-btn
                  class="pl-btn is-icon is-sub"
                  @click="initFbdwd('REG')"
                >
                  <span class="pl-icon20 circle-plus"></span>
                  등록
                </v-btn>
                <v-btn
                  class="pl-btn is-icon is-sub"
                  @click="showAlert(MESSAGE.CONFIRM.DEL)"
                  :disabled="CHC_FBDWD_LIST.length == 0 ? true : false"
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
              show-select
              :headers="headers"
              :items="items"
              :item-class="isActiveRow"
              v-model="CHC_FBDWD_LIST"
              fixed-header
              item-key="FBDWD_ID"
              height="562px"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              :page.sync="page"
              @page-count="pageCount = $event"
              @click:row="rowClick"
              no-data-text="등록된 데이터가 없습니다."
            >
            <template v-slot:item.USE_YN="{ item }">
              <span
                :class="`pl-round-chip is-sm chat-stat-${item.USE_YN === 'Y' ? 'cs' : 'done'}`">
                {{ item.USE_YN === 'Y' ? '사용' : '사용안함 '}}
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

              <span class="pl-pager-period">
                보기 {{ mixin_getPagePeriod(items, page) }} / {{ items.length }}
                <compo-tooltip-btn
                    TitleProp="다음 검색"
                    ClassProp="pl-tooltip-btn is-line"
                    IconProp="pl-icon20 arrow-next-paging"
                    TooltipPositionProp="bottom"
                    @btnClick="fbdwdSrch('next')"
                    :DisabledProp="nextDisabled"
                ></compo-tooltip-btn>
              </span>
            </div>
          </div>
        </div>
        <!-- right -->
        <div class="is-col-fix is-vrt" style="width: 610px">
          <div class="pl-card">
            <h2 class="pl-subtit">금칙어 상세 정보</h2>
            <div class="pl-subdesc">
              <p>필수 항목을 입력하신 후 <strong>[저장] 버튼을 클릭</strong>하십시오</p>
            </div>
          </div>
          <div >
            <v-form ref="form">
            <div class="pl-card" style="overflow: auto; height: 560px; ">
              <div class="pl-form-inline-wrap vertical">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    금칙어 ID
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form"
                      readonly
                      v-model = "FBDWD_ID"
                    />
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    금칙어
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form"
                      v-model = "FBDWD"
                      :rules="validateRules.FBDWD"
                      v-byte-counter="300"
                    />
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    변환어
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form"
                      v-model = "SSTTT"
                      :rules="validateRules.SSTTT"
                      v-byte-counter="300"
                    />
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
                      :items="mixin_common_code_get(common_code, 'USE_WT')"
                      placeholder="선택하세요"
                      v-model = "USE_YN"
                      :rules="validateRules.USE_YN"
                    ></v-select>
                  </div>
                </div>
              </div>
            </div>
            </v-form>
            <div class="pl-card is-bottom">
              <div class="is-right">
                <v-btn
                  v-if="FBDWD_ID == '신규등록'"
                  class="pl-btn"
                  @click="showAlert(MESSAGE.CONFIRM.REG)"
                  :disabled="FBDWD_ID == '' ? true : false"
                >저장</v-btn>
                <v-btn
                  v-if="FBDWD_ID != '신규등록'"
                  class="pl-btn"
                  @click="showAlert(MESSAGE.CONFIRM.MDFCN)"
                  :disabled="FBDWD_ID == '' ? true : false"
                >수정</v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- dialog -->
  </div>
</template>

<script>
export default {
name:"MENU_STG_M0506", //name은 'MENU_' + 파일명 조합
components: {
},
data() {
   return {
    //공통코드
    common_code:[],

    // top search
    SRCH_USE_YN:'',           //사용여부 검색조건
    SRCH_FBDWD:'',            //금칙어 검색조건

    // 상세정보
    FBDWD_ID:'',              //금칙어 ID
    FBDWD:'',                 //금칙어
    SSTTT:'',                 //변환어=치환여
    USE_YN:'Y',               //사용여부

    // grid
    page: 1,
    pageCount: 0,
    perPage: [15,30,50,100],
    ROW_PER_PAGE: 15,
    headers: [
      { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px' },
      { text: '금칙어ID', value: 'FBDWD_ID', align: 'center', width: '120px' },
      { text: '금칙어', value: 'FBDWD'},
      { text: '변환어', value: 'SSTTT'},
      { text: '사용여부', value: 'USE_YN', width: '120px' },
      { text: '등록자', value: 'RGTR_NM', width: '120px' },
      { text: '등록일', value: 'NEW_REG_DT', width: '120px' },
    ],
    items: [],

    pagination: {
          page: 1,
          rowsPerPage: 500,
          sortBy: "",
          descending: ""
        }, //그리드 페이지속성정의
    nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼

    CHC_FBDWD_LIST:[],

    //알림창 메시지
    MESSAGE : {
      CONFIRM : {
        REG : {alertDialogToggle: true, msg: '금칙어를 등록하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.fbdwdDuplCheck, callNo: this.closeMsg}
        , MDFCN: {alertDialogToggle: true, msg: '금칙어를 수정하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.fbdwdStrg, callNo: this.closeMsg}
        , DEL: {alertDialogToggle: true, msg: '금칙어를 삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.fbdwdDel, callNo: this.closeMsg}
      },
      ALERT : {
        REG_SUCCESS : {alertDialogToggle: true, msg: '금칙어가 등록되었습니다', iconClass: 'is-info', type: 'default'}
        , MDFCN_SUCCESS : {alertDialogToggle: true, msg: '금칙어가 수정되었습니다', iconClass: 'is-info', type: 'default'}
        , DEL_SUCCESS : {alertDialogToggle: true, msg: '금칙어가 삭제되었습니다', iconClass: 'is-info', type: 'default'}
        , VALID : {alertDialogToggle: true, msg: '필수항목 확인 후<br>재시도 해주세요', iconClass: 'is-info', type: 'default'}
      },
      ERROR : {
        ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'},
        DUPL : {alertDialogToggle: true, msg: '중복된 금칙어가 있습니다', iconClass: 'is-caution', type: 'default'}
      }
    },

    //필수값 체크
    valid : true,
    validateRules: {
      FBDWD: [
        v => !!v || '금칙어 은(는) 필수 입력 항목입니다.',
      ],
      SSTTT: [
        v => !!v || '변환어 은(는) 필수 입력 항목 입니다.',
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
    let codeName = ['USE_WT'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    this.fbdwdSrch();
  },

  mounted() {

  },

  methods: {
    //금칙어 조회
    async fbdwdSrch(next){
      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.items = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let sUrl = '/chat-api/setting/banned-word/list';
      let postParam = {
        FBDWD: this.SRCH_FBDWD,
        USE_YN: this.SRCH_USE_YN,
      }
      let headParam = {
        head: {
          "ROW_CNT" : this.pagination.rowsPerPage,
          "PAGES_CNT" : this.pagination.page,
          "PAGING" : "Y",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        for(let k in resData.DATA){
          resData.DATA[k].NEW_REG_DT = this.mixin_convertDate(resData.DATA[k].REG_DT, 'yyyy-MM-dd');
        }

        let tempDataText = resData.DATA;
        //this.items = tempDataText;
        this.items = [...this.items, ...tempDataText]
        //다음
        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 resData.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(resData.HEADER.next !== null && resData.HEADER.next !== undefined){
          if(resData.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }

        //이부분은 체크해볼것
        this.pagination.page += 1
        // this.page=1;
      }
    },

    //로우 클릭시 색상 변경
    isActiveRow(item) {
      const activeClass = item.FBDWD_ID === this.FBDWD_ID ? "active" : "";
      return activeClass;
    },

    //로우 클릭 이벤트
    rowClick(item){
      this.FBDWD_ID = item.FBDWD_ID;
      this.FBDWD = item.FBDWD;
      this.SSTTT = item.SSTTT;
      this.USE_YN = item.USE_YN;
    },

    //금칙어 저장
    async fbdwdStrg(){
      if (!this.validate()) {
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }
      let sUrl = '/chat-api/setting/banned-word/regist';
      let postParam = {
        FBDWD_ID:this.FBDWD_ID == '신규등록' ? '' : this.FBDWD_ID,             //금칙어 ID
        FBDWD:this.FBDWD,                   //금칙어
        SSTTT:this.SSTTT,                   //변환어=치환여
        USE_YN:this.USE_YN,                 //사용여부
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        if(this.FBDWD_ID == ''){
          this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS);
        } else {
          this.showAlert(this.MESSAGE.ALERT.MDFCN_SUCCESS);
        }
        this.initFbdwd();
        this.fbdwdSrch();
        this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS);
      }
    },

    //금칙어 초기화
    initFbdwd(REG){
      this.CHC_FBDWD_LIST = []
      if(REG == 'REG'){
        this.FBDWD_ID = '신규등록';
      } else {
        this.FBDWD_ID = '';
      }
      this.FBDWD = '';
      this.SSTTT = '';
      this.USE_YN = 'Y';
    },

    //알림창 닫기
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    //금칙어 삭제
    async fbdwdDel(){
      let arrFbdwdId = []
      let leng = this.CHC_FBDWD_LIST.length
      for(let i=0;i<leng;i++){
        arrFbdwdId.push(this.CHC_FBDWD_LIST[i]["FBDWD_ID"])
      }
      let sUrl = '/chat-api/setting/banned-word/delete';
      let postParam = {
        arrFbdwdId:arrFbdwdId
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.DEL_SUCCESS);
        this.fbdwdSrch();
      }
    },

    //금칙어 중복 체크
    async fbdwdDuplCheck(){
      if (!this.validate()) {
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }
      let sUrl = '/chat-api/setting/banned-word/dupl/check';
      let postParam = {
        FBDWD:this.FBDWD
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        if(resData.DATA[0].CNT == '0'){
          this.fbdwdStrg();
        } else {
          this.showAlert(this.MESSAGE.ALERT.DUPL);
          return
        }
      }
    },

    //필수값 체크
    validate () {
      return this.$refs.form.validate();
    },

  },
}
</script>

<style lang="scss" scoped>

</style>