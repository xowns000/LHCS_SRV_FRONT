<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols flex-grow-1">
        <!-- left -->
        <div class="is-col-fix is-vrt" style="width: 50%">
          <div class="pl-search-header">
            <strong class="pl-search-header-tit">공통 분류코드</strong>
            <div class="is-right">
              <v-text-field
                class="pl-form is-search is-lg"
                placeholder="분류코드 또는 분류코드 명 입력"
                v-model="SRCH_COMM_CD"
                @keydown.enter="srch_commn_cd()"
              >
              <template v-slot:append>
                <v-btn
                  @click="srch_commn_cd()"
                  class="pl-btn has-icon-only">
                  <span class="pl-icon20 in-search"></span>
                </v-btn>
              </template>
              </v-text-field>
            </div>
          </div>
          <div class="pl-card">
            <div class="pl-grid-top">
              <div class="pl-grid-top-left">
                <v-btn
                  class="pl-btn is-icon is-sub"
                  @click="[click_mdfcn(),mixin_showDialog('RegCommonCode')]"
                  :disabled="JSON.stringify(SEL_COMM_CD) != '{}' ? false : true"
                >
                  <span class="pl-icon20 document"></span>
                  선택항목 상세
                </v-btn>
                <v-btn
                  class="pl-btn is-icon is-sub"
                  @click="[click_strg(),mixin_showDialog('RegCommonCode')]"
                  :disabled="COMM_CD_LIST.length != 0 ? false : true"
                >
                  <span class="pl-icon20 circle-plus"></span>
                  등록
                </v-btn>
                <v-btn
                  class="pl-btn is-icon is-sub"
                  @click="showAlert(MESSAGE.CONFIRM.DEL)"
                  :disabled="CHC_GROUP_CD_LIST.length != 0 ? false : true"
                >
                  <span class="pl-icon20 trash"></span>
                  삭제
                </v-btn>
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter">전체 <em class="pl-1">({{ COMM_CD_LIST.length }})</em> 건</span>
              </div>
            </div>
            <v-data-table
              v-model="CHC_GROUP_CD_LIST"
              class="pl-grid has-control"
              show-select
              :headers="headers"
              :items="COMM_CD_LIST"
              :item-class="isActiveRow"
              fixed-header
              item-key="CD_ID"
              height="562px"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              :page.sync="page"
              @page-count="pageCount = $event"
              @click:row="select_comm_cd"
              @dblclick:row="[click_mdfcn(),mixin_showDialog('RegCommonCode')]"
              no-data-text="등록된 데이터가 없습니다."
            >
            <template v-slot:item.USE_YN="{ item }">
              <!-- {{ item.USE_YN == 'Y' ? '사용' : '미사용' }} -->
              <span
                :class="`pl-round-chip is-sm chat-stat-${item.USE_YN === 'Y' ? 'cs' : 'done'}`">
                {{ item.USE_YN === 'Y' ? '사용' : '사용안함 '}}
              </span>
            </template>
            <template v-slot:item.CD_EXPLN="{ item }">
              <v-tooltip content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on">{{ item.CD_EXPLN }}</span>
                </template>
                <span>{{ item.CD_EXPLN }}</span>
              </v-tooltip>
            </template>
            <template v-slot:item.SYS_CD_YN="{ item }">
              <span
                :class="`pl-round-chip is-sm chat-stat-${item.SYS_CD_YN === 'Y' ? 'cs' : 'done'}`">
                {{ item.SYS_CD_YN === 'Y' ? '시스템용' : '고객용 '}}
              </span>
            </template>
            </v-data-table>
          </div>
        </div>
        <!-- right -->
        <div class="is-col-fix is-vrt" style="width: 50%">
          <div class="pl-search-header">
            <strong class="pl-search-header-tit">공통코드 ({{ this.SEL_COMM_CD.CD_NM }}) </strong>
            <div class="is-right">
              <v-text-field
                class="pl-form is-search is-lg"
                placeholder="공통코드 또는 공통코드 명"
                v-model="SRCH_DTL_COMM_CD"
                @keydown.enter="srch_commn_cd('DTL')"
              >
              <template v-slot:append>
                <v-btn
                  @click="srch_commn_cd('DTL')"
                  class="pl-btn has-icon-only">
                  <span class="pl-icon20 in-search"></span>
                </v-btn>
              </template>
              </v-text-field>
            </div>
          </div>
          <div class="pl-card">
            <div class="pl-grid-top">
              <div class="pl-grid-top-left">
                <v-btn class="pl-btn is-icon is-sub"
                  @click="[click_dtl_mdfcn(),mixin_showDialog('RegCommonCode')]"
                  :disabled="JSON.stringify(SEL_COMM_DTL_CD) != '{}' ? false : true"
                >
                  <span class="pl-icon20 document"></span>
                  선택항목 상세
                </v-btn>
                <v-btn class="pl-btn is-icon is-sub"
                  @click="[click_dtl_strg(),mixin_showDialog('RegCommonCode')]"
                  :disabled="$store.getters['userStore/GE_USER_ROLE'].userId == '1'  ? false : (this.SEL_COMM_CD.SYS_CD_YN === 'Y' ? true : COMM_CD_DTL_LIST.length != 0 ? false : (SEL_COMM_CD.GROUP_CD_ID == '*' ? false : true))"
                >
                  <span class="pl-icon20 circle-plus"></span>
                  등록
                </v-btn>
                <v-btn class="pl-btn is-icon is-sub"
                  @click="showAlert(MESSAGE.CONFIRM.DEL_DTL)"
                  :disabled="CHC_GROUP_CD_DTL_LIST.length != 0 ? ($store.getters['userStore/GE_USER_ROLE'].userId == '1' ? false : (this.SEL_COMM_CD.SYS_CD_YN === 'Y' ? true : false)) : true"
                >
                  <span class="pl-icon20 trash"></span>
                  삭제
                </v-btn>
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter">전체 <em class="pl-1">({{ COMM_CD_DTL_LIST.length }})</em> 건</span>
              </div>
            </div>
            <v-data-table
              v-model="CHC_GROUP_CD_DTL_LIST"
              class="pl-grid has-control"
              show-select
              :headers="headers_dtl"
              :items="COMM_CD_DTL_LIST"
              :item-class="isActiveRow2"
              fixed-header
              item-key="CD_ID"
              height="562px"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              :page.sync="page"
              @page-count="pageCount = $event"
              @click:row="select_dtl_comm_cd"
              @dblclick:row="[click_dtl_mdfcn(),mixin_showDialog('RegCommonCode')]"
              no-data-text="등록된 데이터가 없습니다."
            >
            <template v-slot:item.USE_YN="{ item }">
              {{ item.USE_YN == 'Y' ? '사용' : '미사용' }}
            </template>
            <template v-slot:item.CD_EXPLN="{ item }">
              <v-tooltip content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on">{{ item.CD_EXPLN }}</span>
                </template>
                <span>{{ item.CD_EXPLN }}</span>
              </v-tooltip>
            </template>
            </v-data-table>
          </div>
        </div>
      </div>
    </div>
    <!-- dialog -->
    <v-dialog
      v-model="dialogRegCommonCode"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :header-title="STRG_DTL == '' ? (REG_MDFCN == '' ? '공통 분류코드 등록' : '공통 분류코드 상세') : (REG_MDFCN == '' ? '공통코드 등록' : '공통코드 상세')"
        @hide="[mixin_hideDialog('RegCommonCode'), init()]"
      >
        <template slot="body">
          <v-form ref="form">
          <div class="pl-form-inline-wrap vertical">
            <div class="pl-form-inline">
              <span class="pl-label">
                코드 유형
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="CD_TY_DROP"
                  placeholder="선택하세요"
                  v-model="CD_TY"
                  :rules="validateRules.CD_TY"
                  :readonly="$store.getters['userStore/GE_USER_ROLE'].userId == '1'  ? false : true"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                분류코드
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  value="pl-form"
                  v-model="COMM_CD"
                  :readonly="REG_MDFCN == 'MDFCN'"
                  :rules="validateRules.COMM_CD"
                  v-byte-counter="60"
                />
                <!-- <v-checkbox
                  class="pl-check"
                  :disabled="STRG_DTL == '' && REG_MDFCN == 'MDFCN'"
                  label="직접 입력"
                ></v-checkbox> -->
                <v-btn
                  v-if="REG_MDFCN != 'MDFCN'"
                  class="pl-btn is-sub flex-grow-0"
                  @click="dpcnCheck(STRG_DTL)"
                  :disabled = "COMM_CD.length == 0 ? true : false"
                  >중복체크
                </v-btn>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                분류코드 명
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  value="pl-form"
                  v-model="CD_NM"
                  :rules="validateRules.CD_NM"
                  v-byte-counter="300"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                분류코드 값
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  value="pl-form"
                  v-model="CD_VL"
                  v-byte-counter="100"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">설명</span>
              <div class="pl-desc">
                <v-textarea
                  class="pl-form is-noresize"
                  :rules="textareaRules"
                  :value="textareaValue"
                  :spellcheck="false"
                  placeholder="코드설명 내용 입력"
                  v-model="CD_EXPLN"
                  v-byte-counter="1000"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                정렬 순서
                <v-icon class="pl-icon20"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  value="pl-form"
                  v-model="SORT_ORD"
                  hide-spin-buttons
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
                  class="pl-form"
                  :items="mixin_common_code_get(COMM_CD_DROP_LIST, 'USE_WT')"
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
          <v-btn class="pl-btn is-sub" @click="[mixin_hideDialog('RegCommonCode'), init()]">닫기</v-btn>
          <v-btn class="pl-btn" @click="strg_commn_cd(STRG_DTL,REG_MDFCN)" :disabled="REG_MDFCN == 'MDFCN' ? ($store.getters['userStore/GE_USER_ROLE'].userId == '1'  ? false : (CD_TY=='SYS' ? true : false)) : DPCN_CHK">저장</v-btn>
        </template>

      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
  export default {
  name: "MENU_STG_M0601", //name은 'MENU_' + 파일명 조합
  components: {
  },
  data() {
    return {
      COMM_CD_USE_LIST:[],                //사용할 공통코드 리스트 ==> 변수명 이미 사용중이기 떄문에 변경해주었음 (COMM_CD_LIST->COMM_CD_USE_LIST)
      COMM_CD_DROP_LIST:[],               //공통코드로 생성된 드롭박스 리스트
      // dialog
      dialogRegCommonCode: false,
      textareaRules: [v => v.length <= 200 || 'Max 200 characters'],
      textareaValue: '200자 제한!',
      CD_TY_DROP: [],
      //USE_YN_DROP: [],

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: -1,
      headers: [
        { text: '번호', value: 'SORT_ORD', align: 'center', width: '70px' },
        { text: '공통코드', value: 'CD_ID', width: '120px' },
        { text: '공통코드명', value: 'CD_NM', width: '200px'},
        { text: '공통코드설명', value: 'CD_EXPLN', },
        { text: '코드 유형', value: 'SYS_CD_YN', width: '100px'},
        { text: '사용여부', value: 'USE_YN', width: '100px'},
      ],
      headers_dtl: [
        { text: '번호', value: 'SORT_ORD', align: 'center', width: '70px' },
        { text: '공통코드', value: 'CD_ID', width: '120px' },
        { text: '공통코드명', value: 'CD_NM', width: '200px'},
        { text: '공통코드설명', value: 'CD_EXPLN', },
        { text: '사용여부', value: 'USE_YN', width: '100px'},
      ],

      SRCH_COMM_CD:'',          //공통코드 검색어
      SRCH_DTL_COMM_CD:'',      //공통코드상세 검색어
      SEL_COMM_CD: {},          //단일선택 공통코드
      SEL_COMM_DTL_CD: {},      //단일선택 상세공통코드
      CHC_GROUP_CD_LIST: [],    //공통코드 다중선택목록
      CHC_GROUP_CD_DTL_LIST: [],//공통코드 다중선택 상세목록
      COMM_CD_LIST:[],          //공통코드 리스트
      COMM_CD_DTL_LIST:[],      //공통코드 상세 리스트

      STRG_DTL:'',              //상세등록여부
      REG_MDFCN:'',             //등록 또는수정 여부
      CD_TY:'CUSTOM',           //시스템(SYS) : 회사구분 없음 , 고객용(CUSTOM) : 회사구분 있음
      COMM_CD:'',               //분류코드
      CD_NM:'',                 //코드명
      CD_VL:'',                 //코드값
      CD_EXPLN:'',              //코드설명
      SORT_ORD:'',              //정렬순서
      USE_YN:'Y',               //사용여부

      DPCN_CHK : true,            //중복체크여부

      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
          DEL : { alertDialogToggle: true, msg: '상위 공통코드를 삭제하면<br>하위 공통코드도 모두 삭제됩니다<br>정말 삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.del_yes, callNo: this.closeMsg, }
          , DEL_DTL : { alertDialogToggle: true, msg: '정말 삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.del_dtl_yes, callNo: this.closeMsg, }
        },
        ALERT : {
          REG_SUCCESS : { alertDialogToggle: true, msg: '공통코드가 등록되었습니다', iconClass: 'is-done', type: 'default' }
          , DEL_SUCCESS : { alertDialogToggle: true, msg: '삭제가 완료되었습니다', iconClass: 'is-done', type: 'default' }
          , SORT_ORD_ERR : {alertDialogToggle: true, msg: '정렬순서는 <br>마이너스(-,음수)가 될 수 없습니다', iconClass: 'is-info', type: 'default'}
          , VALID : {alertDialogToggle: true, msg: '필수항목 확인 후<br>재시도 해주세요', iconClass: 'is-info', type: 'default'}
          , DUPL_CD : {alertDialogToggle: true, msg: '상위 분류코드와 다른 분류코드를 입력해주세요', iconClass: 'is-info', type: 'default'}
          , REG_Y : {alertDialogToggle: true, msg: '사용가능한 코드입니다', iconClass: 'is-done', type: 'default'}
          , REG_N : {alertDialogToggle: true, msg: '이미 사용중인 코드입니다', iconClass: 'is-caution', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST : {
          REG_SUCCESS: {  msg: '공통코드가 등록되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
          , DEL_SUCCESS: {  msg: '삭제가 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
        },
      },

      //필수값 체크
      valid : true,
      validateRules: {
        CD_TY: [
          v => !!v || '코드 유형 은(는) 필수 입력 항목입니다.',
        ],
        COMM_CD: [
          v => !!v || '분류 코드 은(는) 필수 입력 항목 입니다.',
        ],
        CD_NM: [
          v => !!v || '분류코드 명 은(는) 필수 입력 항목 입니다.',
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
    //공통코드 목록 => 사용할 공통코드 리스트에 넣기
    this.COMM_CD_USE_LIST = [
      "USE_WT"      //사용여부
      , "CD_TP"     //코드유형
    ];
    //공통코드별 드롭박스 만들기
    this.COMM_CD_DROP_LIST = await this.mixin_common_code_get_all(this.COMM_CD_USE_LIST);
    //필요한 공통코드 드롭박스 생성
    this.CD_TY_DROP = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, 'CD_TP');
    // if(this.$store.getters["userStore/GE_USER_ROLE"].atrtGroupId != '1'){
    //   for(let i=0;i<this.CD_TY_DROP.length;i++){
    //     if(this.CD_TY_DROP[i].value == 'SYS'){
    //       this.CD_TY_DROP.splice(i,1);
    //     }
    //   }
    // }
    //this.USE_YN_DROP = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, 'USE_WT');

    this.srch_commn_cd();
  },

  mounted() {
  },

  methods: {
    //공통코드검색
    async srch_commn_cd(type){
      let sUrl = '/api/setting/system/cmmn-code-manage/list';
      let postParam = {
        GROUP_CD_ID : type == 'DTL' ? this.SEL_COMM_CD.CD_ID : '*',
        CD_ID: type == 'DTL' ? this.SRCH_DTL_COMM_CD : this.SRCH_COMM_CD,
      }
      let headParam = {
        head: {
          URL : "api.setting.system",
          SERVICE : "cmmn-code-manage",
          METHOD : "list",
          ASYNC : false,
          TYPE : "BIZ_SERVICE",
        }
      }

      let resData = await this.common_postCall(sUrl,postParam,headParam)
      if(!resData.HEADER.ERROR_FLAG){

        if(resData.DATA.length > 0){
          resData.DATA.forEach((comm, idx) => {
            comm.CD_NM = this.mixin_decode(comm.CD_NM);
            comm.CD_EXPLN = this.mixin_decode(comm.CD_EXPLN);
          });
        }

        this.COMM_CD_DTL_LIST =[];
        this.CHC_GROUP_CD_LIST= [];
        this.CHC_GROUP_CD_DTL_LIST= [];
        type == 'DTL' ? this.COMM_CD_DTL_LIST = resData.DATA : this.COMM_CD_LIST = resData.DATA;
      }
    },

    //공통코드 저장
    async strg_commn_cd(type,reg){
      if (!this.validate()) {
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }
      if(this.SORT_ORD.includes('-')){
        this.showAlert(this.MESSAGE.ALERT.SORT_ORD_ERR); //정렬순서 - 체크
        return;
      }
      if(type == 'DTL'){
        // console.log("this.SEL_COMM_CD", this.SEL_COMM_CD);
        // console.log("this.this.COMM_CD", this.COMM_CD);
        if(this.SEL_COMM_CD.CD_ID == this.COMM_CD){
          this.showAlert(this.MESSAGE.ALERT.DUPL_CD);
          return;
        }
      }
      let sUrl = reg == 'MDFCN' ? '/api/setting/system/cmmn-code-manage/modify' : '/api/setting/system/cmmn-code-manage/regist';
      let postParam = {
        SYS_CD_YN:this.CD_TY==='SYS'?'Y':'N',
        CUSTCO_ID: this.$store.getters["userStore/GE_USER_ROLE"].company.CD,
        GROUP_CD_ID : type == 'DTL' ? this.SEL_COMM_CD.CD_ID : '*',
        CD_ID: this.COMM_CD,
        BF_CD_ID: reg == 'MDFCN' ? (type == 'DTL' ? this.SEL_COMM_DTL_CD.CD_ID : this.SEL_COMM_CD.CD_ID) : '',//분류코드를 바꾸기 위해 사용
        CD_NM:this.CD_NM,
        CD_EXPLN:this.CD_EXPLN,
        CD_VL:this.CD_VL,
        SORT_ORD: this.SORT_ORD,
        USE_YN: this.USE_YN,
      }
      let headParam = reg == 'MDFCN'
      ? {
        head: {
          URL : "api.setting.system",
          SERVICE : "cmmn-code-manage",
          METHOD : "modify",
          ASYNC : false,
          TYPE : "BIZ_SERVICE",
        }
      }
      : {
        head: {
          URL : "api.setting.system",
          SERVICE : "cmmn-code-manage",
          METHOD : "regist",
          ASYNC : false,
          TYPE : "BIZ_SERVICE",
        }
      }

      let resData = await this.common_postCall(sUrl,postParam,headParam)
      if(!resData.HEADER.ERROR_FLAG){
          this.mixin_hideDialog('RegCommonCode');   //등록창 닫기
          type == 'DTL' ? this.srch_commn_cd('DTL') : this.srch_commn_cd()  //등록 후 조회
          // this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS); //등록완료 알림창
          this.showToast(this.MESSAGE.TOAST.REG_SUCCESS); //등록완료 알림창
          this.closeMsg();
      }
    },

    //삭제확인 클릭
    del_yes(){
      this.del_commn_cd();
    },
    //상세삭제확인 클릭
    del_dtl_yes(){
      this.del_commn_cd('DTL');
    },
    //공통코드 삭제 (DB삭제가 아닌 DEL_YN = 'Y')
    async del_commn_cd(type){
      let delList = type == 'DTL' ? this.CHC_GROUP_CD_DTL_LIST : this.CHC_GROUP_CD_LIST
      let sUrl = '/api/setting/system/cmmn-code-manage/delete';
      let postParam = {
        list:delList
      }
      let headParam = {
        head: {
          URL : "api.setting.system",
          SERVICE : "cmmn-code-manage",
          METHOD : "delete",
          ASYNC : false,
          TYPE : "BIZ_SERVICE",
          FUNCTION_NM : "deleteGroupCd",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        type == 'DTL' ? this.srch_commn_cd('DTL') : this.srch_commn_cd()  //등록 후 조회
        // this.showAlert(this.MESSAGE.ALERT.DEL_SUCCESS);
        this.showToast(this.MESSAGE.TOAST.DEL_SUCCESS);
        this.closeMsg();
      }
    },
    //삭제취소
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    //공통코드 등록
    click_strg(){
      this.STRG_DTL = '';
      this.REG_MDFCN = '';

      this.CD_TY='CUSTOMER';
      this.COMM_CD='';
      this.CD_NM='';
      this.CD_VL='';
      this.CD_EXPLN='';
      this.SORT_ORD='';
      this.USE_YN='Y';
    },
    //공통코드 상세등록
    click_dtl_strg(){
      this.STRG_DTL = 'DTL'
      this.REG_MDFCN = '';

      this.CD_TY='CUSTOMER';
      this.COMM_CD='';
      this.CD_NM='';
      this.CD_VL='';
      this.CD_EXPLN='';
      this.SORT_ORD='';
      this.USE_YN='Y';
    },
    //공통코드 상세보기(수정)
    click_mdfcn(){
      this.STRG_DTL = ''
      this.REG_MDFCN = 'MDFCN';

      this.CD_TY=this.SEL_COMM_CD.SYS_CD_YN == 'Y' ? 'SYS' : 'CUSTOMER';
      this.COMM_CD=this.SEL_COMM_CD.CD_ID;
      this.CD_NM=this.SEL_COMM_CD.CD_NM;
      this.CD_VL=this.SEL_COMM_CD.CD_VL;
      this.CD_EXPLN=this.SEL_COMM_CD.CD_EXPLN;
      this.SORT_ORD=this.SEL_COMM_CD.SORT_ORD;
      this.USE_YN=this.SEL_COMM_CD.USE_YN;
    },
    //공통코드 상세보기(수정)
    click_dtl_mdfcn(){
      this.STRG_DTL = 'DTL'
      this.REG_MDFCN = 'MDFCN';

      this.CD_TY=this.SEL_COMM_CD.SYS_CD_YN == 'Y' ? 'SYS' : 'CUSTOMER';
      this.COMM_CD=this.SEL_COMM_DTL_CD.CD_ID;
      this.CD_NM=this.SEL_COMM_DTL_CD.CD_NM;
      this.CD_VL=this.SEL_COMM_DTL_CD.CD_VL;
      this.CD_EXPLN=this.SEL_COMM_DTL_CD.CD_EXPLN;
      this.SORT_ORD=this.SEL_COMM_DTL_CD.SORT_ORD;
      this.USE_YN=this.SEL_COMM_DTL_CD.USE_YN;
    },

    //row클릭
    select_comm_cd(item){
      this.SEL_COMM_CD = item;
      this.srch_commn_cd('DTL');
    },
    //상세row클릭
    select_dtl_comm_cd(item){
      this.SEL_COMM_DTL_CD = item;
    },

    //row클릭 색상변경
    isActiveRow(item){
      return item.CD_ID== this.SEL_COMM_CD.CD_ID? 'active':'';
    },
    //row클릭 색상변경
    isActiveRow2(item){
      return item.CD_ID== this.SEL_COMM_DTL_CD.CD_ID? 'active':'';
    },

    //수정,등록창 초기화
    init(){
      this.STRG_DTL='';
      this.REG_MDFCN='';
      this.CD_TY='CUSTOM';
      this.COMM_CD='';
      this.CD_NM='';
      this.CD_VL='';
      this.CD_EXPLN='';
      this.SORT_ORD='';
      this.USE_YN='Y';
      this.DPCN_CHK = true;
    },

    //필수값 체크
    validate () {
      return this.$refs.form.validate();
    },

    //공통코드 중복체크
    async dpcnCheck(type){
      let sUrl = '/api/setting/system/cmmn-code-manage/dpcnCheck';
      let postParam = {
        GROUP_CD_ID : type == 'DTL' ? this.SEL_COMM_CD.CD_ID : '*',
        CD_ID: this.COMM_CD,
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        //중복이 없을때
        if(resData.DATA[0].CNT == '0'){
          this.showAlert(this.MESSAGE.ALERT.REG_Y);
          this.DPCN_CHK = false;
        } else {
          this.showAlert(this.MESSAGE.ALERT.REG_N);
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>