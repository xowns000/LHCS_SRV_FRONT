<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                구분
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(this.common_code, 'CATG_EXT_CL', '전체')"
                  placeholder="선택하세요"
                  v-model="SCH_SE"
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
                  :items="mixin_common_code_get(this.common_code, 'USE_WT', '전체')"
                  placeholder="선택하세요"
                  v-model="SCH_USE_YN"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                수정여부
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(this.common_code, 'MODI_WT', '전체')"
                  placeholder="선택하세요"
                  v-model="SCH_MDFCN_PSBLTY_YN"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                속성
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(this.common_code, 'EXPN_PT', '전체')"
                  placeholder="선택하세요"
                  v-model="SCH_DATA_TYPE_CD"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">확장항목 명</span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form is-lg"
                  placeholder="검색어 입력"
                  v-model="SCH_EXPSN_ATTR_NM"
                  @keyup.enter="schExpsnAttrList('')"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">확장항목 ID</span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form is-lg"
                  placeholder="검색어 입력"
                  v-model="SCH_EXPSN_ATTR_COL_ID"
                  @keyup.enter="schExpsnAttrList('')"
                />
              </div>
            </div>
            <v-btn
              class="pl-btn is-icon"
              @click="schExpsnAttrList('')"
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
                <v-btn class="pl-btn is-icon is-sub" @click="expsnAttrForm">
                  <span class="pl-icon20 circle-plus"></span>
                  등록
                </v-btn>
                <v-btn class="pl-btn is-icon is-sub" @click="expsnAttrDelValidate" :disabled="selectedAttrIdList.length != 0 ? false : true">
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
              v-model="selectedAttrIdList"
              no-data-text="등록된 데이터가 없습니다."
            >
              <!-- 필수여부 -->
              <template v-slot:item.ESNTL_NM="{ item }">
                <span
                  :class="`pl-round-chip is-sm chat-stat-${item.ESNTL_YN === 'Y' ? 'cs' : 'done'}`">
                  {{ item.ESNTL_YN === 'Y' ? '필수' : '옵션 '}}
                </span>
              </template>
              <!-- 수정여부 -->
              <template v-slot:item.MDFCN_PSBLTY_NM="{ item }">
                <span
                  :class="`pl-round-chip is-sm chat-stat-${item.MDFCN_PSBLTY_YN === 'Y' ? 'cs' : 'wait'}`">
                  {{ item.MDFCN_PSBLTY_YN === 'Y' ? '가능' : '불가능 '}}
                </span>
              </template>
              <!-- 사용여부 -->
              <template v-slot:item.USE_NM="{ item }">
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
                보기 {{ mixin_getPagePeriod(gridItems, page) }} / {{ gridItems.length }}
                  <compo-tooltip-btn
                    TitleProp="다음 검색"
                    ClassProp="pl-tooltip-btn is-line"
                    IconProp="pl-icon20 arrow-next-paging"
                    TooltipPositionProp="bottom"
                    :DisabledProp = "nextDisabled"
                    @btnClick="schExpsnAttrList('next')"
                  ></compo-tooltip-btn>
              </span>
            </div>
          </div>
        </div>
        <!-- right -->
        <div class="is-col-fix is-vrt" style="width: 510px">
          <div class="pl-card">
            <h2 class="pl-subtit">확장항목 상세 정보</h2>
            <div class="pl-subdesc">
              <p>필수 항목을 입력하신 후 [저장] 버튼을 클릭하십시오</p>
            </div>
          </div>
          <div >
            <div class="pl-card pb-0" style="overflow: auto; height: calc(100vh - 388px); ">
              <v-form ref="form">
              <div class="pl-form-inline-wrap vertical">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    구분
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-select
                      ref="se"
                      class="pl-form"
                      :items="mixin_common_code_get(this.common_code, 'CATG_EXT_CL')"
                      placeholder="선택하세요"
                      required
                      v-model="DTL_SE"
                      :rules="validateRules.SE"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    확장항목 명
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form"
                      required
                      v-model="DTL_EXPSN_ATTR_NM"
                      :rules="validateRules.EXPSN_ATTR_NM"
                      v-byte-counter="100"
                    />
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    확장항목 ID
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form"
                      required
                      v-model="DTL_EXPSN_ATTR_COL_ID"
                      :rules="validateRules.EXPSN_ATTR_COL_ID"
                      v-byte-counter="60"
                    />
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    속성
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-select
                      class="pl-form"
                      :items="mixin_common_code_get(this.common_code, 'EXPN_PT')"
                      placeholder="선택하세요"
                      required
                      v-model="DTL_DATA_TYPE_CD"
                      :rules="validateRules.DATA_TYPE_CD"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    길이
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form"
                      required
                      v-model="DTL_DATA_LEN"
                      :rules="validateRules.DATA_LEN"
                      hide-spin-buttons
                      type="number"
                      oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                      v-byte-counter="4"
                    />
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    표준산업분류
                  </span>
                  <div class="pl-desc">
                    <v-select
                      class="pl-form"
                      :items="mixin_common_code_get(this.common_code, 'SIC')"
                      placeholder="선택하세요"
                      v-model="DTL_SIC_ID"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    필수 여부
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-select
                      class="pl-form"
                      :items="mixin_common_code_get(this.common_code, 'REQR_WT')"
                      placeholder="선택하세요"
                      required
                      v-model="DTL_ESNTL_YN"
                      :rules="validateRules.ESNTL_YN"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    수정 여부
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-select
                      class="pl-form"
                      :items="mixin_common_code_get(this.common_code, 'MODI_WT')"
                      placeholder="선택하세요"
                      required
                      v-model="DTL_MDFCN_PSBLTY_YN"
                      :rules="validateRules.MDFCN_PSBLTY_YN"
                    ></v-select>
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
                      :items="mixin_common_code_get(this.common_code, 'USE_WT')"
                      placeholder="선택하세요"
                      required
                      v-model="DTL_USE_YN"
                      :rules="validateRules.USE_YN"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    그리드 노출 여부
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-select
                      class="pl-form"
                      :items="mixin_common_code_get(this.common_code, 'USE_WT')"
                      placeholder="선택하세요"
                      required
                      v-model="DTL_SCRN_EXPSR_YN"
                      :rules="validateRules.SCRN_EXPSR_YN"
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
                      placeholder="항목 설명 내용 입력"
                      required
                      v-model="DTL_EXPSN_ATTR_EXPLN"
                      :rules="validateRules.EXPSN_ATTR_EXPLN"
                      :spellcheck="false"
                      v-byte-counter="4000"
                    />
                  </div>
                </div>
              </div>
            </v-form>
            </div>
            <div class="pl-card is-bottom">
              <div class="is-right">
                <v-btn class="pl-btn" @click="expsnAttrRegValidate">저장</v-btn>
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
  name: "MENU_STG_M0603", //name은 'MENU_' + 파일명 조합
  components: {
  },
  data() {
    return {
      common_code: [],

      // 조회 v-model
      SCH_SE :'',
      SCH_USE_YN:'',
      SCH_MDFCN_PSBLTY_YN:'',
      SCH_DATA_TYPE_CD:'',
      SCH_EXPSN_ATTR_NM:'',
      SCH_EXPSN_ATTR_COL_ID:'',

      // grid
      selectedAttrIdList: [],
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
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px', sortable: false },
        { text: '확장항목 명', value: 'EXPSN_ATTR_NM', align: 'left', width: '250px' },
        { text: '확장항목 ID', value: 'EXPSN_ATTR_COL_ID', width: '250px'},
        { text: '속성', value: 'DATA_TYPE_NM'},
        { text: '길이', value: 'DATA_LEN', width: '80px'},
        { text: '필수 여부', value: 'ESNTL_NM', width: '110px', align: 'center'},
        { text: '수정 여부', value: 'MDFCN_PSBLTY_NM', width: '110px', align: 'center'},
        { text: '사용 여부', value: 'USE_NM', width: '110px', align: 'center'}
      ],
      gridItems: [],

      selectedRow: null,

      //확장항목 상세조회 data
      DTL_SE : '',
      DTL_EXPSN_ATTR_NM : '',
      DTL_EXPSN_ATTR_COL_ID : '',
      DTL_DATA_TYPE_CD : '',
      DTL_DATA_LEN : '',
      DTL_SIC_ID : '',
      DTL_ESNTL_YN : '',
      DTL_MDFCN_PSBLTY_YN : '',
      DTL_USE_YN : '',
      DTL_SCRN_EXPSR_YN : '',
      DTL_EXPSN_ATTR_EXPLN : '',

      //confirm alert 메시지
      MESSAGE : {
        CONFIRM : {
          REG : {alertDialogToggle: true, msg: '내용을 저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.expsnAttrSave, callNo: this.closeMsg}
          , DEL : {alertDialogToggle: true, msg: '선택된 항목을 삭제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.expsnAttrDel, callNo: this.closeMsg}
        },
        ALERT : {
          SUCCESS : {alertDialogToggle: true, msg: '저장 처리 되었습니다.', iconClass: 'is-info', type: 'default'}
          , CHECK_NON : {alertDialogToggle: true, msg: '체크된 항목이 존재하지 않습니다.', iconClass: 'is-caution', type: 'default'}
          , DATA_LEN_ERR : {alertDialogToggle: true, msg: '길이는 <br>마이너스(-,음수)가 될 수 없습니다', iconClass: 'is-info', type: 'default'}
          , VALID : {alertDialogToggle: true, msg: '필수항목 확인 후<br>재시도 해주세요', iconClass: 'is-info', type: 'default'}
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
        SE: [
          v => !!v || '구분 은(는) 필수 입력 항목 입니다.',
        ],
        EXPSN_ATTR_NM: [
          v => !!v || '확장항목 명 은(는) 필수 입력 항목 입니다.',
        ],
        EXPSN_ATTR_COL_ID: [
          v => !!v || '확장항목 ID 은(는) 필수 입력 항목 입니다.',
        ],
        DATA_TYPE_CD: [
          v => !!v || '속성 은(는) 필수 입력 항목 입니다.',
        ],
        DATA_LEN :[
          v => !!v || '길이 은(는) 필수 입력 항목 입니다.',
          // v => /[0-9]/.test(v) || '숫자만 입력 가능합니다.',
          // v => (v >= 0 && v < 4000 ) || '0 ~ 4000 이내로 입력해 주세요.',
        ],
        SIC_ID: [
          v => !!v || '표준산업분류 은(는) 필수 입력 항목 입니다.',
        ],
        ESNTL_YN: [
          v => !!v || '필수 여부 은(는) 필수 입력 항목 입니다.',
        ],
        MDFCN_PSBLTY_YN: [
          v => !!v || '수정 여부 은(는) 필수 입력 항목 입니다.',
        ],
        USE_YN: [
          v => !!v || '사용 여부 은(는) 필수 입력 항목 입니다.',
        ],
        SCRN_EXPSR_YN: [
          v => !!v || '그리드 노출 여부 은(는) 필수 입력 항목 입니다.',
        ],
        EXPSN_ATTR_EXPLN: [
          v => !!v || '설명 은(는) 필수 입력 항목 입니다.',
        ]
      }
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
    let codeName = ['CATG_EXT_CL', 'USE_WT', 'MODI_WT', 'EXPN_PT', 'REQR_WT', 'SIC'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    this.getGridList();
  },

  mounted() {

  },

  methods: {
    //그리드 목록 조회
    async getGridList(next) {

      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.gridItems = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let sUrl = '/api/setting/expsnAttr/expsnAttrList';
      let postParam = {
        BSC_PVSN_ATTR_YN : "Y"
        , SE : this.SCH_SE
        , USE_YN : this.SCH_USE_YN
        , MDFCN_PSBLTY_YN : this.SCH_MDFCN_PSBLTY_YN
        , DATA_TYPE_CD : this.SCH_DATA_TYPE_CD
        , EXPSN_ATTR_NM : this.SCH_EXPSN_ATTR_NM
        , EXPSN_ATTR_COL_ID : this.SCH_EXPSN_ATTR_COL_ID
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
        // this.page=1;
      }
    },

    //조회 이벤트
    schExpsnAttrList(next) {
      this.getGridList(next);
    },

    //row 선택
    rowSelect(idx) {
      this.selectedRow = idx;
      this.getExpsnAttrSelect(idx);
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    //확장항목 상세조회
    getExpsnAttrSelect(item) {
      this.DTL_ATTR_ID = item.ATTR_ID;
      this.DTL_SE = item.SE;
      this.DTL_EXPSN_ATTR_NM = item.EXPSN_ATTR_NM;
      this.DTL_EXPSN_ATTR_COL_ID = item.EXPSN_ATTR_COL_ID;
      this.DTL_DATA_TYPE_CD = item.DATA_TYPE_CD;
      this.DTL_DATA_LEN = item.DATA_LEN;
      this.DTL_SIC_ID = item.SIC_ID;
      this.DTL_ESNTL_YN = item.ESNTL_YN;
      this.DTL_MDFCN_PSBLTY_YN = item.MDFCN_PSBLTY_YN;
      this.DTL_USE_YN = item.USE_YN;
      this.DTL_USE_YN = item.USE_YN;
      this.DTL_SCRN_EXPSR_YN = item.SCRN_EXPSR_YN;
      this.DTL_EXPSN_ATTR_EXPLN = item.EXPSN_ATTR_EXPLN;
    },

    //등록 form 호출
    expsnAttrForm() {
      this.DTL_SE = '';
      this.DTL_EXPSN_ATTR_NM = '';
      this.DTL_EXPSN_ATTR_COL_ID = '';
      this.DTL_DATA_TYPE_CD = '';
      this.DTL_DATA_LEN = '';
      this.DTL_SIC_ID = '';
      this.DTL_ESNTL_YN = '';
      this.DTL_MDFCN_PSBLTY_YN = '';
      this.DTL_USE_YN = '';
      this.DTL_SCRN_EXPSR_YN = '';
      this.DTL_EXPSN_ATTR_EXPLN = '';
      this.resetValidation();
    },

    //등록 수정 validate 체크
    expsnAttrRegValidate() {
      if (!this.validate()) {
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }
      if(this.DTL_DATA_LEN.includes('-')){
        this.showAlert(this.MESSAGE.ALERT.DATA_LEN_ERR); //길이 - 체크
        return;
      }

      this.showAlert(this.MESSAGE.CONFIRM.REG);
    },

    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    //등록 수정
    async expsnAttrSave() {
      let sUrl = '/api/setting/expsnAttr/expsnAttrProc';
      let postParam = {
        ATTR_ID : this.DTL_ATTR_ID
        , SE : this.DTL_SE
        , EXPSN_ATTR_NM : this.DTL_EXPSN_ATTR_NM
        , EXPSN_ATTR_COL_ID : this.DTL_EXPSN_ATTR_COL_ID
        , DATA_TYPE_CD : this.DTL_DATA_TYPE_CD
        , DATA_LEN : this.DTL_DATA_LEN
        , SIC_ID : this.DTL_SIC_ID
        , ESNTL_YN : this.DTL_ESNTL_YN
        , USE_YN : this.DTL_USE_YN
        , SCRN_EXPSR_YN : this.DTL_SCRN_EXPSR_YN
        , MDFCN_PSBLTY_YN : this.DTL_MDFCN_PSBLTY_YN
        , EXPSN_ATTR_EXPLN : this.DTL_EXPSN_ATTR_EXPLN
        , BSC_PVSN_ATTR_YN : 'Y'
        , SYS_BSC_YN : 'N'
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        // this.showAlert(this.MESSAGE.ALERT.SUCCESS);
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeMsg();
        this.getGridList();
      }
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
    expsnAttrDelValidate() {
      if(this.isEmpty(this.selectedAttrIdList)){
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

    //삭제
    async expsnAttrDel() {
      let arrAttrId = [];
      for (let value of this.selectedAttrIdList) {
        arrAttrId.push(value.ATTR_ID);
      }

      let sUrl = '/api/setting/expsnAttr/expsnAttrDel';
      let postParam = {
        arrAttrId : arrAttrId
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        // this.showAlert(this.MESSAGE.ALERT.SUCCESS);
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeMsg();
        this.resetValidation();
        this.getGridList();
      }
    },
  }
}
</script>

<style lang="scss" scoped>

</style>