<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <!-- <div class="pl-form-inline">
              <span class="pl-label">
                PDS 회사구분
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="dropItems"
                  placeholder="선택하세요"
                ></v-select>
              </div>
            </div> -->
            <div class="pl-form-inline">
              <span class="pl-label">
                IP 주소
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form is-lg"
                  placeholder="검색어 입력"
                  v-model="SCH_IP"
                  oninput="javascript: this.value=this.value.replace(/[^-\.0-9]/g,'');"
                  @keyup.enter="schIpExtList('')"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                내선번호
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form "
                  placeholder="검색어 입력"
                  v-model="SCH_EXT_NO"
                  hide-spin-buttons
                  type="number"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                  @keyup.enter="schIpExtList('')"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                PDS 내선번호
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form "
                  placeholder="검색어 입력"
                  v-model="SCH_PDS_EXT_NO"
                  hide-spin-buttons
                  type="number"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                  @keyup.enter="schIpExtList('')"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                <v-select
                  v-model="SCH_TARGET"
                  class="pl-form"
                  :items="mixin_common_code_get(this.common_code, 'USER_SRCH')"
                ></v-select>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form is-lg"
                  placeholder="검색어 입력"
                  v-model="SCH_KEYWORD"
                  @keyup.enter="schIpExtList('')"
                />
              </div>
            </div>

            <v-btn
              class="pl-btn is-icon"
              @click="schIpExtList('')"
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
                <!-- <v-btn class="pl-btn is-icon is-sub" @click="ipExtForm">
                  <span class="pl-icon20 circle-plus"></span>
                  둥록
                </v-btn> -->
                <v-btn class="pl-btn is-icon is-sub" @click="ipExtDelValidate" :disabled="selectedPhnIpExtIdList.length != 0 ? false:true">
                  <span class="pl-icon20 trash"></span>
                  삭제
                </v-btn>
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter">전체 <em class="pl-1">({{ gridItems.length }})</em> 건</span>
              </div>
            </div>
            <v-data-table
              class="pl-grid has-control"
              show-select
              :headers="headers"
              :items="gridItems"
              fixed-header
              item-key="ROW_NUMBER"
              height="562px"
              :items-per-page="ROW_PER_PAGE"
              :item-class="isActiveRow"
              hide-default-footer
              :page.sync="page"
              @page-count="pageCount = $event"
              @click:row="rowSelect"
              v-model="selectedPhnIpExtIdList"
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
                보기 {{ mixin_getPagePeriod(gridItems, page) }} / {{ gridItems.length }}
                  <compo-tooltip-btn
                    TitleProp="다음 검색"
                    ClassProp="pl-tooltip-btn is-line"
                    IconProp="pl-icon20 arrow-next-paging"
                    TooltipPositionProp="bottom"
                    :DisabledProp = "nextDisabled"
                    @btnClick="getIpExtList('next')"
                  ></compo-tooltip-btn>
              </span>
            </div>
          </div>
        </div>
        <!-- right -->
        <div class="is-col-fix is-vrt" style="width: 510px">
          <div class="pl-card">
            <h2 class="pl-subtit">내선번호 상세 정보</h2>
            <div class="pl-subdesc">
              <p>필수 항목을 입력하신 후 [저장] 버튼을 클릭하십시오</p>
            </div>
          </div>
          <div >
            <div class="pl-card" style="overflow: auto; height: 560px; ">
              <v-form ref="form">
                <div class="pl-form-inline-wrap vertical">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      로그인 ID
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form"
                        disabled
                        v-model="DTL_LGN_ID"
                        :rules="validateRules.LGN_ID"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      사용자 명
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form"
                        disabled
                        v-model="DTL_USER_NM"
                        :rules="validateRules.USER_NM"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      IP 주소
                      <!-- <v-icon class="pl-icon20 required"></v-icon> -->
                      <!-- :rules="validateRules.IP" -->
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form"
                        v-model="DTL_IP"
                        oninput="javascript: this.value=this.value.replace(/[^-\.0-9]/g,'');"
                        v-byte-counter="20"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      내선번호
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form"
                        v-model="DTL_EXT_NO"
                        :rules="validateRules.EXT_NO"
                        hide-spin-buttons
                        type="number"
                        oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                        v-byte-counter="60"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      PDS 내선번호
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form"
                        v-model="DTL_PDS_EXT_NO"
                        hide-spin-buttons
                        type="number"
                        oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                        v-byte-counter="60"
                      />
                    </div>
                  </div>
                  <!-- <div class="pl-form-inline">
                    <span class="pl-label">
                      PDS 회사구분
                    </span>
                    <div class="pl-desc">
                      <v-select
                        class="pl-form"
                        :items="dropItemsS01"
                        placeholder="선택하세요"
                      ></v-select>
                    </div>
                  </div> -->
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      설명
                    </span>
                    <div class="pl-desc">
                      <v-textarea
                        class="pl-form is-noresize"
                        placeholder="기타 설명 입력"
                        v-model="DTL_RMRK"
                        v-byte-counter="4000"
                        :spellcheck="false"
                      />
                    </div>
                  </div>
                </div>
              </v-form>
            </div>
            <div class="pl-card is-bottom">
              <div class="is-right">
                <v-btn class="pl-btn" @click="ipExtRegValidate">저장</v-btn>
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
import { callUtil } from "@/store/callUtil.js";
export default {
name:"MENU_STG_M0608", //name은 'MENU_' + 파일명 조합
components: {
},
data() {
   return {
    common_code : [],
    // top search
    // 조회 v-model
    SCH_IP :'',
    SCH_EXT_NO:'',
    SCH_PDS_EXT_NO:'',
    SCH_TARGET: 'USER_ID',
    SCH_KEYWORD:'',

    // grid
    selectedPhnIpExtIdList: [],
    page: 1,
    pageCount: 0,
    perPage: [15,30,50,100],
    ROW_PER_PAGE: 15,
    pagination: {
      page: 1,
      rowsPerPage: 500,
      sortBy: "",
      descending: ""
    }, //그리드 페이지속성정의
    nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
    headers: [
      { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px' },
      { text: '사용자 명', value: 'USER_NM', align: 'left', width: '150px' },
      { text: '사용자 ID', value: 'LGN_ID', align: 'left', width: '150px' },
      { text: 'IP 주소', value: 'IP'},
      { text: '내선번호', value: 'EXT_NO', align: 'center', width: '150px' },
      { text: 'PDS 내선번호', value: 'PDS_EXT_NO', align: 'center', width: '150px' },
      { text: '등록자', value: 'RGTR_NM', align: 'center', width: '120px' },
      { text: '등록일', value: 'NEW_REG_DT', align: 'center', width: '120px' },
    ],
    gridItems: [],

    selectedRow: null,

    // 상세정보
    DTL_PHN_IP_EXT_ID : '',
    DTL_DEPT_ID : '',
    DTL_USER_ID : '',
    DTL_LGN_ID : '',
    DTL_USER_NM : '',
    DTL_IP : '',
    DTL_EXT_NO : '',
    DTL_PDS_EXT_NO : '',
    DTL_RMRK : '',

    //confirm alert 메시지
    MESSAGE : {
      CONFIRM : {
        REG : {alertDialogToggle: true, msg: '저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.ipExtSave, callNo: this.closeMsg}
        , DEL : {alertDialogToggle: true, msg: 'IP 내선번호 정보를 삭제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.ipExtDel, callNo: this.closeMsg}
      },
      ALERT : {
        SUCCESS : {alertDialogToggle: true, msg: '정상 처리 되었습니다.', iconClass: 'is-info', type: 'default'}
        , CHECK_NON : {alertDialogToggle: true, msg: '체크된 항목이 존재하지 않습니다.', iconClass: 'is-caution', type: 'default'}
        , IP_CHECK : {alertDialogToggle: true, msg: '잘못된 IP 주소 입니다.', iconClass: 'is-caution', type: 'default'}
        , EXT_NO_DUPL : {alertDialogToggle: true, msg: '해당 내선번호는 이미 사용 중입니다.', iconClass: 'is-caution', type: 'default'}
        , PDS_EXT_NO_DUPL : {alertDialogToggle: true, msg: '해당 PDS 내선번호는 이미 사용 중입니다.', iconClass: 'is-caution', type: 'default'}
        , VALID : {alertDialogToggle: true, msg: '필수항목 확인 후<br>재시도 해주세요', iconClass: 'is-info', type: 'default'}
        , IPCC_ERROR : {alertDialogToggle: true, msg: 'IPCC 내선번호 조회 중 오류가 발생했습니다.', iconClass: 'is-info', type: 'default'}
        , IPCC_EXT_NO_EMPTY : {alertDialogToggle: true, msg: 'IPCC에 내선번호가 등록되지 않았습니다.', iconClass: 'is-info', type: 'default'}
        , IPCC_LIST_EMPTY : {alertDialogToggle: true, msg: 'IPCC에 등록된 내선번호가 없습니다.', iconClass: 'is-info', type: 'default'}
        , EXT_NO_LIST_EMPTY : {alertDialogToggle: true, msg: '삭제할 내선번호가 존재하지 않습니다.', iconClass: 'is-info', type: 'default'}
      },
      ERROR : {
        ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
      },
      TOAST : {
        SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
      },
    },

    valid : true,
    validateRules: {
      LGN_ID: [
        v => !!v || '사용자 ID 은(는) 필수 입력 항목 입니다.',
      ],
      USER_NM: [
        v => !!v || '사용자 명 은(는) 필수 입력 항목 입니다.',
      ],
      IP: [
        v => !!v || 'IP 주소 은(는) 필수 입력 항목 입니다.',
      ],
      EXT_NO: [
        v => !!v || '내선번호 은(는) 필수 입력 항목 입니다.',
      ],
    },

    arrIpExt: [] //IPCC 내선 번호 조회용
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
    let codeName = ['USER_SRCH'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    this.getIpExtList();
  },

  mounted() {

  },

  methods: {
    //그리드 목록 조회
    async getIpExtList(next) {

      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.gridItems = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let sUrl = '/api/setting/ipExt/ipExtList';
      let postParam = {
        IP : this.SCH_IP
        , EXT_NO: this.SCH_EXT_NO
        , PDS_EXT_NO: this.SCH_PDS_EXT_NO
        , SCH_TARGET: this.SCH_TARGET
        , SCH_KEYWORD: this.SCH_KEYWORD
      }

      let headParam = {
        head : {
          ROW_CNT : this.pagination.rowsPerPage,
          PAGES_CNT : this.pagination.page,
          PAGING : "Y",
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        for(let k in response.DATA){
          response.DATA[k].NEW_REG_DT = this.mixin_convertDate(response.DATA[k].REG_DT, 'yyyy-MM-dd');
        }

        let tempDataText = response.DATA;
        let idx = this.gridItems.length + 1;
        for(let i in tempDataText){
          tempDataText[i]["index"]= idx++;
        }

        this.gridItems = [...this.gridItems, ...tempDataText]
        //다음
        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }

        //이부분은 체크해볼것
        this.pagination.page += 1
      }
    },

    //조회 이벤트
    schIpExtList(next) {
      this.getIpExtList(next);
    },

    //row 선택
    rowSelect(idx) {
      this.selectedRow = idx;
      this.getIpExtSelect(idx);
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    //확장항목 상세조회
    getIpExtSelect(item) {
      this.DTL_PHN_IP_EXT_ID = item.PHN_IP_EXT_ID;
      this.DTL_DEPT_ID = item.DEPT_ID;
      this.DTL_USER_ID = item.USER_ID;
      this.DTL_LGN_ID = item.LGN_ID;
      this.DTL_USER_NM = item.USER_NM;
      this.DTL_IP = item.IP;
      this.DTL_EXT_NO = item.EXT_NO;
      this.DTL_PDS_EXT_NO = item.PDS_EXT_NO;
      this.DTL_RMRK = item.RMRK;
    },

    //등록 form 호출
    ipExtForm() {
      this.DTL_PHN_IP_EXT_ID = '';
      this.DTL_USER_ID = '';
      this.DTL_LGN_ID = '';
      this.DTL_USER_NM = '';
      this.DTL_IP ='';
      this.DTL_EXT_NO = '';
      this.DTL_PDS_EXT_NO = '';
      this.DTL_RMRK = '';
      this.resetValidation();
    },

    //등록 수정 validate 체크
    ipExtRegValidate() {
      if (!this.validate()) {
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }

      if(this.DTL_IP){
        if(!this.isValidIpAddr(this.DTL_IP)){
          this.showAlert(this.MESSAGE.ALERT.IP_CHECK);
          return;
        }
      }

      let overallStat = callUtil.ipcc('/api/palette_interface.php', {REQ : 'monitor_agent_list'}); //상담사 모니터링
      // console.log(overallStat);

      let iCnt = 0;
      const DTL_EXT_NO = this.DTL_EXT_NO;
      if(overallStat != null){
        Object.keys(overallStat).forEach(function(v){
          if(v === '0'){
            Object.keys(overallStat[v]).forEach(k =>{
              if(k === DTL_EXT_NO) iCnt++;
            });
          }
        });
      }

      if(iCnt > 0){
        this.showAlert(this.MESSAGE.CONFIRM.REG);
      }else{
        this.showAlert(this.MESSAGE.ALERT.IPCC_EXT_NO_EMPTY);
        return;
      }
    },

    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    //등록 수정
    ipExtSave() {
      let sUrl = '/api/setting/ipExt/extNoDuplCheck';
      let postParam = {
        CUSL_ID : this.DTL_USER_ID
        , EXT_NO : this.DTL_EXT_NO
        , PDS_EXT_NO : this.DTL_PDS_EXT_NO
      }
      let headParam = {
        head : {
        }
      }

      this.$api
          .post(sUrl,postParam,headParam)
          .then((response) => {
            if(this.DTL_EXT_NO){
              if(response.data.DATA[0].EXT_NO_CNT > 0){
                this.showAlert(this.MESSAGE.ALERT.EXT_NO_DUPL);
                return;
              }
            }

            if(this.DTL_PDS_EXT_NO){
              if(response.data.DATA[0].PDS_EXT_NO_CNT > 0){
                this.showAlert(this.MESSAGE.ALERT.PDS_EXT_NO_DUPL);
                return;
              }
            }

            sUrl = '/api/setting/ipExt/ipExtProc';
            postParam = {
              PHN_IP_EXT_ID : this.DTL_PHN_IP_EXT_ID
              , DEPT_ID : this.DTL_DEPT_ID
              , CUSL_ID : this.DTL_USER_ID
              , IP : this.DTL_IP
              , EXT_NO : this.DTL_EXT_NO
              , PDS_EXT_NO : this.DTL_PDS_EXT_NO
              , RMRK : this.DTL_RMRK
            }

            headParam = {
              head : {
              }
            }

            this.$api
                .post(sUrl,postParam,headParam)
                .then((response) => {
                  if (!response.data.HEADER.ERROR_FLAG){
                    // this.showAlert(this.MESSAGE.ALERT.SUCCESS);
                    this.closeMsg();
                    this.showToast(this.MESSAGE.TOAST.SUCCESS);
                    this.getIpExtList();
                  }
                })
                .catch((err) => {
                  this.showAlert(this.MESSAGE.ERROR.ERROR);
                }
              )
          })
          .catch((err) => {
            this.showAlert(this.MESSAGE.ERROR.ERROR);
          }
        )
    },

    //validate check
    validate () {
      return this.$refs.form.validate();
    },

    //등록 및 상세보기 form 초기화
    resetValidation() {
      this.$refs.form.reset();
    },

    //삭제
    ipExtDelValidate() {
      if(this.isEmpty(this.selectedPhnIpExtIdList)){
        this.showAlert(this.MESSAGE.ALERT.CHECK_NON);
        return;
      }

      this.showAlert(this.MESSAGE.CONFIRM.DEL);
    },

    isEmpty(val) {
      if (val == null) return true
      if (typeof val === 'undefined') return true
      if (typeof val === 'string' && val === '' && (''+val) === '') return true
      if (Array.isArray(val) && val.length < 1) return true
      if (typeof val === 'object' && val.constructor.name === 'Object' && Object.keys(val).length < 1 && Object.getOwnPropertyNames(val) < 1) return true
      if (typeof val === 'object' && val.constructor.name === 'String' && Object.keys(val).length < 1) return true
      if (val.constructor === Object && Object.keys(val).length === 0) return true
    },

    isValidIpAddr(_target) {
        if( /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(_target) ) {
            return true;
        }

        return false;
    },

    //삭제
    async ipExtDel() {
      let arrPhnIpExtId = [];
      for (let value of this.selectedPhnIpExtIdList) {
        if(value.PHN_IP_EXT_ID) arrPhnIpExtId.push(value.PHN_IP_EXT_ID);
      }

      if(arrPhnIpExtId.length === 0){
        this.showAlert(this.MESSAGE.ALERT.EXT_NO_LIST_EMPTY);
        return;
      }

      let sUrl = '/api/setting/ipExt/ipExtDel';
      let postParam = {
        arrPhnIpExtId : arrPhnIpExtId
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        // this.showAlert(this.MESSAGE.ALERT.SUCCESS);
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.resetValidation();
        this.getIpExtList();
        this.closeMsg();
      }
    },
  }
}
</script>

<style lang="scss" scoped>

</style>