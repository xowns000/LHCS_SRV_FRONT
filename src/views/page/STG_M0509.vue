<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                조회 연도
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="YEAR_DROP"
                  placeholder="선택하세요"
                  v-model="SRCH_YEAR"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                휴일 구분
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(this.common_code, 'HODY_DV', '전체')"
                  placeholder="선택하세요"
                  v-model="SRCH_HLDY_SE_CD"
                ></v-select>
              </div>
            </div>
            <v-btn
              class="pl-btn is-icon"
              @click="hldySrch()"
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
                  @click="[REG_BTN_DISABLE = false,initHldy()]"
                >
                  <span class="pl-icon20 circle-plus"></span>
                  등록
                </v-btn>
                <v-btn
                  class="pl-btn is-icon is-sub"
                  @click="showAlert(MESSAGE.CONFIRM.DEL)"
                  :disabled="HLDY_LIST.length == 0 ? true : false"
                >
                  <span class="pl-icon20 trash"></span>
                  삭제
                </v-btn>
                <v-btn
                  class="pl-btn is-sub"
                  @click="showAlert(MESSAGE.CONFIRM.HLDY_REG)"
                > 공휴일 일괄 추가 </v-btn>
                <v-btn
                  class="pl-btn is-sub"
                  @click="showAlert(MESSAGE.CONFIRM.SAT_REG)"
                > 토요일 일괄 추가 </v-btn>
                <v-btn
                  class="pl-btn is-sub"
                  @click="showAlert(MESSAGE.CONFIRM.SUN_REG)"
                > 일요일 일괄 추가 </v-btn>
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
              v-model="HLDY_LIST"
              fixed-header
              item-key="HLDY_ID"
              height="562px"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              :page.sync="page"
              @page-count="pageCount = $event"
              @click:row="rowClick"
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

              <span class="pl-pager-period">
                보기 {{ mixin_getPagePeriod(items, page) }} / {{ items.length }}
                <compo-tooltip-btn
                    TitleProp="다음 검색"
                    ClassProp="pl-tooltip-btn is-line"
                    IconProp="pl-icon20 arrow-next-paging"
                    TooltipPositionProp="bottom"
                    @btnClick="hldySrch('next')"
                    :DisabledProp="nextDisabled"
                ></compo-tooltip-btn>
              </span>
            </div>
          </div>
        </div>
        <!-- right -->
        <div class="is-col-fix is-vrt" style="width: 610px">
          <div class="pl-card">
            <h2 class="pl-subtit">{{ HLDY_NM==''?"휴일 등록":"휴일 상세 정보" }}</h2>
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
                    휴일
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <compo-date-picker
                      DateType="dateInput"
                      :DateProp.sync="date"/>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    휴일 명
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form"
                      v-model="HLDY_NM"
                      :rules="validateRules.HLDY_NM"
                      v-byte-counter="300"
                    />
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    휴일 구분
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-select
                      class="pl-form"
                      :items="mixin_common_code_get(this.common_code, 'HODY_DV')"
                      placeholder="선택하세요"
                      v-model="HLDY_SE_CD"
                      :rules="validateRules.HLDY_SE_CD"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    설명
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-textarea
                      class="pl-form is-noresize"
                      placeholder="기타 설명 내용 입력"
                      v-model="HLDY_EXPLN"
                      :rules="validateRules.HLDY_EXPLN"
                      :spellcheck="false"
                      v-byte-counter="4000"
                    />
                  </div>
                </div>
              </div>
            </div>
            </v-form>
            <div class="pl-card is-bottom">
              <div class="is-right">
                <v-btn
                  v-if="HLDY_ID == ''"
                  class="pl-btn"
                  @click="showAlert(MESSAGE.CONFIRM.REG)"
                  :disabled="REG_BTN_DISABLE"
                >저장</v-btn>
                <v-btn
                  v-if="HLDY_ID != ''"
                  class="pl-btn"
                  @click="showAlert(MESSAGE.CONFIRM.MDFCN)"
                  :disabled="REG_BTN_DISABLE"
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
name:"MENU_STG_M0509", //name은 'MENU_' + 파일명 조합
components: {
},
data() {
   return {
    //공통코드
    common_code:[],

    // top search
    SRCH_YEAR:'',                   //조회년도
    YEAR_DROP:[],                   //조회년도 드롭박스
    SRCH_HLDY_SE_CD:'',                   //휴일구분

    // 상세정보
    HLDY_ID:'',                     //휴일 ID

    dropItemsS01: [ ],
    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    HLDY_NM:'',                     //휴일명
    HLDY_SE_CD:'HLD',                  //휴일구분
    HLDY_EXPLN:'',                  //휴일설명

    // grid
    page: 1,
    pageCount: 0,
    perPage: [15,30,50,100],
    ROW_PER_PAGE: 15,
    headers: [
      { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px' },
      { text: '휴일', value: 'NEW_HLDY_YMD', align: 'center', width: '120px' },
      { text: '휴일명', value: 'HLDY_NM'},
      { text: '휴일구분', value: 'HLDY_SE_CD_NM', width: '120px' },
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

    HLDY_LIST:[],             //휴일 선택리스트

    //알림창 메시지
    MESSAGE : {
      CONFIRM : {
        REG : {alertDialogToggle: true, msg: '휴일을 저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.hldyStng, callNo: this.closeMsg}
        , MDFCN : {alertDialogToggle: true, msg: '휴일을 수정하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.hldyStng, callNo: this.closeMsg}
        , DEL : {alertDialogToggle: true, msg: '휴일을 삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.hldyDel, callNo: this.closeMsg}
        , HLDY_REG : {alertDialogToggle: true, msg: '1년동안의 모든 공휴일이 추가됩니다<br>공휴일을 추가하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.hldyReg, callNo: this.closeMsg}
        , SAT_REG : {alertDialogToggle: true, msg: '1년동안의 모든 토요일일이 추가됩니다<br>토요일을 추가하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.satReg, callNo: this.closeMsg}
        , SUN_REG : {alertDialogToggle: true, msg: '1년동안의 모든 일요일이 추가됩니다<br>일요일을 추가하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.sunReg, callNo: this.closeMsg}
      },
      ALERT : {
        REG_SUCCESS : {alertDialogToggle: true, msg: '휴일이 저장되었습니다', iconClass: 'is-info', type: 'default'}
        , DEL_SUCCESS : {alertDialogToggle: true, msg: '휴일이 삭제되었습니다', iconClass: 'is-info', type: 'default'}
        , DUPL : {alertDialogToggle: true, msg: '해당 날짜에 이미 휴일이 있습니다', iconClass: 'is-info', type: 'default'}
        , HLDY_ADD_SUCCESS : {alertDialogToggle: true, msg: '휴일이 추가되었습니다', iconClass: 'is-info', type: 'default'}
          , VALID : {alertDialogToggle: true, msg: '필수항목 확인 후<br>재시도 해주세요', iconClass: 'is-info', type: 'default'}
      },
      ERROR : {
        ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
      },
      TOAST : {
        REG_SUCCESS : {  msg: '휴일이 저장되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 },
        DEL_SUCCESS : {  msg: '휴일이 삭제되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 },
        HLDY_ADD_SUCCESS : {  msg: '휴일이 추가되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 },
      }
    },

    REG_BTN_DISABLE: true,              //저장버튼 활성화

    //필수값 체크
    valid : true,
    validateRules: {
      HLDY_NM: [
        v => !!v || '휴일 명 은(는) 필수 입력 항목입니다.',
      ],
      HLDY_SE_CD: [
        v => !!v || '휴일 구분 은(는) 필수 입력 항목 입니다.',
      ],
      HLDY_EXPLN: [
        v => !!v || '설명 은(는) 필수 입력 항목 입니다.',
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
    let codeName = ['HODY_DV'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    //진행년도 설정(금년기준 -5, +5)
    const date = new Date();
    const curYear = date.getFullYear();
    for (let i = -5; i < 5; i++) {
      this.YEAR_DROP.push({ text: `${curYear + i}년`, value: (curYear + i).toString() });
    }
    this.SRCH_YEAR = curYear.toString();

    this.hldySrch();
  },

  mounted() {

  },

  methods: {
    //휴일 조회
    async hldySrch(next){
      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.items = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }
      let sUrl = '/api/setting/holiday/manage/list';
      let postParam = {
        HLDY_SE_CD: this.SRCH_HLDY_SE_CD,
        HLDY_YEAR: this.SRCH_YEAR,
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
          resData.DATA[k].NEW_HLDY_YMD = this.mixin_convertDate(resData.DATA[k].HLDY_YMD, 'yyyy-MM-dd');
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

    //휴일 정보 초기화
    initHldy(){
      this.date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
      this.HLDY_ID = '';
      this.HLDY_NM = '';
      this.HLDY_SE_CD = 'HLD';
      this.HLDY_EXPLN = '';
    },

    //휴일 등록
    async hldyStng(){
      if (!this.validate()) {
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }
      let sUrl = '/api/setting/holiday/manage/regist';
      let postParam = {
        HLDY_ID : this.HLDY_ID,
        HLDY_YMD : this.date.replaceAll('-',''),
        HLDY_NM : this.HLDY_NM,
        HLDY_SE_CD : this.HLDY_SE_CD,
        HLDY_EXPLN : this.HLDY_EXPLN,
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(resData.HEADER.ERROR_FLAG){
        if(resData.DATA[0]["CNT"] != '' && resData.DATA[0]["CNT"] != null && resData.DATA[0]["CNT"] != undefined){
          if(resData.DATA[0]["CNT"] != '0'){
            // console.log("resData.DATA[0]['CNT']", resData.DATA[0]['CNT'])
            this.$store.commit("alertStore/hideAlert");
            this.showAlert(this.MESSAGE.ALERT.DUPL);
            return;
          }
        }
      } else {
        this.$store.commit("alertStore/hideAlert");
        this.HLDY_LIST = [];
        this.initHldy();
        this.hldySrch();
        // this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS);
        this.showToast(this.MESSAGE.TOAST.REG_SUCCESS);
      }
    },

    //휴일 추가
    async hldyAdd(week){
      let sUrl = week == 'HLD' ? '/api/setting/holiday/manage/hldy/regist' : 'api/setting/holiday/manage/wkend/regist';
      let postParam = {
        START_YEAR : this.SRCH_YEAR,
        END_YEAR : this.SRCH_YEAR,
        STR_CASE : week
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){

        this.HLDY_LIST = [];
        this.initHldy();
        this.hldySrch();
        this.closeMsg();
        // this.showAlert(this.MESSAGE.ALERT.HLDY_ADD_SUCCESS);
        this.showToast(this.MESSAGE.TOAST.HLDY_ADD_SUCCESS);
      }
    },

    //알림창 닫기
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    //로우 클릭시 색상 변경
    isActiveRow(item) {
      const activeClass = item.HLDY_ID === this.HLDY_ID ? "active" : "";
      return activeClass;
    },

    //로우 클릭시 이벤트
    rowClick(item){
      this.REG_BTN_DISABLE = false;
      this.HLDY_ID = item.HLDY_ID;
      this.date = item.NEW_HLDY_YMD;
      this.HLDY_NM = item.HLDY_NM;
      this.HLDY_SE_CD = item.HLDY_SE_CD;
      this.HLDY_EXPLN = item.HLDY_EXPLN;
    },

    //휴일 삭제
    async hldyDel(){
      let arrHldyId = [];
      let leng = this.HLDY_LIST.length;
      for(let i=0;i<leng;i++){
        arrHldyId.push(this.HLDY_LIST[i]["HLDY_ID"])
      }
      let sUrl = 'api/setting/holiday/manage/delete';
      let postParam = {
        arrHldyId : arrHldyId
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.HLDY_LIST = [];
        this.initHldy();
        this.hldySrch();
        this.closeMsg();
        // this.showAlert(this.MESSAGE.ALERT.DEL_SUCCESS);
        this.showToast(this.MESSAGE.TOAST.DEL_SUCCESS);
      }
    },

    //필수값 체크
    validate () {
      return this.$refs.form.validate();
    },

    hldyReg(){
      this.hldyAdd('HLD');
    },

    satReg(){
      this.hldyAdd('SAT');
    },

    sunReg(){
      this.hldyAdd('SUN');
    },

  },
}
</script>

<style lang="scss" scoped>

</style>