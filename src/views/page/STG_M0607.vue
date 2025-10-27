<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
      </compo-sub-layout-top>
      <!-- sub content -->
      <v-tabs class="pl-tabs" v-model="tab">
        <v-tab @click="getPstnList(false)">위치 정보 관리</v-tab>
        <v-tab @click="getCtcList(false)">연락처 정보 관리</v-tab>
      </v-tabs>
      <div style="height: 700px">
        <v-tabs-items v-model="tab" class="pl-tabs-items">
          <!-- 위치정보 관리 -->
          <v-tab-item>
            <div class="pl-cols flex-grow-1">
              <!-- left -->
              <div class="is-vrt" >
                <div class="pl-card">
                  <div class="pl-grid-top">
                    <div class="pl-grid-top-left">
                      <v-btn class="pl-btn is-icon is-sub" @click="regPstn()">
                        <span class="pl-icon20 circle-plus"></span>
                        등록
                      </v-btn>
                      <v-btn class="pl-btn is-icon is-sub" @click="deletePstnBtn()" :disabled="selectedData.length != 0 ? false:true">
                        <span class="pl-icon20 trash"></span>
                        삭제
                      </v-btn>
                    </div>
                    <div class="pl-grid-top-utils">
                      <span class="pl-counter">전체 <em class="pl-1">({{ gridTotalCnt }})</em> 건</span>
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
                    @click:row="rowSelect"
                    v-model="selectedData"
                    :item-class="isActiveRow"
                    hide-default-footer
                    :page.sync="page"
                    no-data-text="등록된 데이터가 없습니다."
                    @page-count="pageCount = $event">
                    <!-- 사용여부 -->
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
                      보기 {{ mixin_getPagePeriod(gridItems, page) }} / {{ gridItems.length }}
                      <compo-tooltip-btn
                        TitleProp="다음 검색"
                        ClassProp="pl-tooltip-btn is-line"
                        IconProp="pl-icon20 arrow-next-paging"
                        TooltipPositionProp="bottom"
                        :DisabledProp = "nextDisabled"
                        @btnClick="getPstnList(true)"
                      ></compo-tooltip-btn>
                    </span>
                  </div>
                </div>
              </div>
              <!-- right -->

                <div class="is-col-fix is-vrt" style="width: 510px">
                  <div class="pl-card">
                    <h2 class="pl-subtit">위치 상세 정보</h2>
                    <div class="pl-subdesc">
                      <p>필수 항목을 입력하신 후 [저장] 버튼을 클릭하십시오</p>
                    </div>
                  </div>
                  <div >
                    <div class="pl-card" style="overflow: auto; height: 570px; ">
                      <v-form ref="form">
                        <div class="pl-form-inline-wrap vertical">
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              위치 명
                              <v-icon class="pl-icon20 required"></v-icon>
                            </span>
                            <div class="pl-desc">
                              <v-text-field
                                v-model="pstnDetail.PSTN_NM"
                                :rules="pstnValidateRules.PSTN_NM"
                                class="pl-form"
                                v-byte-counter="100"
                              />
                            </div>
                          </div>
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              우편번호
                              <v-icon class="pl-icon20 required"></v-icon>
                            </span>
                            <div class="pl-desc">
                              <v-text-field
                                v-model="pstnDetail.DTL_ZIP"
                                class="pl-form is-search"
                                disabled
                              >
                                <template v-slot:append>
                                  <v-btn
                                    @click="mixin_showDialog('FindPost')"
                                    class="pl-btn has-icon-only">
                                    <span class="pl-icon20 in-search"></span>
                                  </v-btn>
                                </template>
                              </v-text-field>
                            </div>
                            <v-dialog
                              v-model="dialogFindPost"
                              content-class="dialog-draggable is-lg"
                              hide-overlay>
                              <div class="draggable-area">drag area</div>
                              <compo-dialog
                                header-title="우편번호 검색"
                                @hide="mixin_hideDialog('FindPost')"
                              >
                                <template slot="body">
                                  <!-- component -->
                                  <compo-find-post
                                    @selected-post="getFindPost"
                                  />
                                </template>
                              </compo-dialog>
                            </v-dialog>
                          </div>
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              주소
                              <v-icon class="pl-icon20 required"></v-icon>
                            </span>
                            <div class="pl-desc">
                              <v-text-field
                                v-model="pstnDetail.DTL_ADDR"
                                :rules="pstnValidateRules.DTL_ADDR"
                                class="pl-form"
                                disabled
                              />
                            </div>
                          </div>
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              상세 주소
                              <v-icon class="pl-icon20 required"></v-icon>
                            </span>
                            <div class="pl-desc">
                              <v-text-field
                                v-model="pstnDetail.DTL_DTL_ADDR"
                                :rules="pstnValidateRules.DTL_DTL_ADDR"
                                class="pl-form"
                                v-byte-counter="200"
                              />
                            </div>
                          </div>
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              위경도
                              <v-icon class="pl-icon20"></v-icon>
                            </span>
                            <div class="pl-desc">
                              <v-text-field
                                v-model="pstnDetail.LAT_LOT"
                                class="pl-form"
                                v-byte-counter="80"
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
                                v-model="pstnDetail.PSTN_USE_YN"
                                :rules="pstnValidateRules.PSTN_USE_YN"
                                class="pl-form"
                                :items="this.mixin_common_code_get(this.common_code, 'USE_WT')"
                                placeholder="선택하세요"
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
                                v-model="pstnDetail.PSTN_EXPLAIN"
                                :rules="pstnValidateRules.PSTN_EXPLAIN"
                                :spellcheck="false"
                                class="pl-form is-noresize"
                                placeholder="설명 내용 입력"
                                v-byte-counter="4000"
                              />
                            </div>
                          </div>
                        </div>
                      </v-form>
                    </div>
                    <div class="pl-card is-bottom">
                      <div class="is-right">
                        <v-btn class="pl-btn" @click="savePstnBtn()">저장</v-btn>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </v-tab-item>
          <!-- 연락처 정보 관리 -->
          <v-tab-item>
            <div class="pl-cols flex-grow-1">
              <!-- left -->
              <div class="is-vrt" >
                <div class="pl-card">
                  <div class="pl-grid-top">
                    <div class="pl-grid-top-left">
                      <v-btn class="pl-btn is-icon is-sub" @click="regCtc()">
                        <span class="pl-icon20 circle-plus"></span>
                        등록
                      </v-btn>
                      <v-btn class="pl-btn is-icon is-sub" @click="deleteCtcBtn()" :disabled="selectedData.length !=0?false:true">
                        <span class="pl-icon20 trash"></span>
                        삭제
                      </v-btn>
                    </div>
                    <div class="pl-grid-top-utils">
                      <span class="pl-counter">전체 <em class="pl-1">({{ gridTotalCnt2 }})</em> 건</span>
                    </div>
                  </div>
                  <v-data-table
                    class="pl-grid has-control"
                    show-select
                    :headers="headers2"
                    :items="gridItems2"
                    fixed-header
                    item-key="ROW_NUMBER"
                    height="562px"
                    :items-per-page="ROW_PER_PAGE2"
                    @click:row="rowSelect2"
                    v-model="selectedData"
                    :item-class="isActiveRow"
                    hide-default-footer
                    :page.sync="page2"
                    no-data-text="등록된 데이터가 없습니다."
                    @page-count="pageCount2 = $event">
                    <!-- 호전환 대상여부 -->
                    <template v-slot:item.PHN_TRAN_TRGT_YN="{ item }">
                      <span
                        :class="`pl-round-chip is-sm chat-stat-${item.PHN_TRAN_TRGT_YN === 'Y' ? 'cs' : 'done'}`">
                        {{ item.PHN_TRAN_TRGT_YN === 'Y' ? '사용' : '사용안함 '}}
                      </span>
                    </template>
                    <!-- 사용여부 -->
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
                        :value="ROW_PER_PAGE2"
                        :items="perPage2"
                        :item-text="toString(ROW_PER_PAGE2)"
                        @change="ROW_PER_PAGE2 = parseInt($event, 10);"
                      ></v-select>
                    </div>
                    <v-pagination
                      v-model="page2"
                      :length="pageCount2"
                      circle
                      :total-visible="7">
                    </v-pagination>
                    <span class="pl-pager-period">
                      보기 {{ mixin_getPagePeriod(gridItems2, page2) }} / {{ gridItems2.length }}
                      <compo-tooltip-btn
                        TitleProp="다음 검색"
                        ClassProp="pl-tooltip-btn is-line"
                        IconProp="pl-icon20 arrow-next-paging"
                        TooltipPositionProp="bottom"
                        :DisabledProp = "nextDisabled2"
                        @btnClick="getCtcList(true)"
                      ></compo-tooltip-btn>
                    </span>
                  </div>
                </div>
              </div>
              <!-- right -->
              <div class="is-col-fix is-vrt" style="width: 510px">
                <div class="pl-card">
                  <h2 class="pl-subtit">연락처 상세 정보</h2>
                  <div class="pl-subdesc">
                    <p>필수 항목을 입력하신 후 [저장] 버튼을 클릭하십시오</p>
                  </div>
                </div>
                <div >
                  <div class="pl-card" style="overflow: auto; height: 570px; ">
                    <v-form ref="form2">
                      <div class="pl-form-inline-wrap vertical">
                        <div class="pl-form-inline">
                          <span class="pl-label">
                            업무 명(담당자명)
                            <v-icon class="pl-icon20 required"></v-icon>
                          </span>
                          <div class="pl-desc">
                            <v-text-field
                              v-model="ctcDetail.TASK_NM"
                              :rules="ctcValidateRules.TASK_NM"
                              class="pl-form"
                              v-byte-counter="100"
                            />
                          </div>
                        </div>
                        <div class="pl-form-inline">
                          <span class="pl-label">
                            연락처
                            <v-icon class="pl-icon20 required"></v-icon>
                          </span>
                          <div class="pl-desc">
                            <v-text-field
                              v-model="ctcDetail.TEL_NO"
                              :rules="ctcValidateRules.TEL_NO"
                              hide-spin-buttons
                              type="number"
                              maxlength="14"
                              oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                              class="pl-form"
                              v-byte-counter="60"
                            />
                          </div>
                        </div>
                        <div class="pl-form-inline">
                          <span class="pl-label">
                            담당 부서명
                            <v-icon class="pl-icon20 required"></v-icon>
                          </span>
                          <div class="pl-desc">
                            <v-text-field
                              v-model="ctcDetail.TKCG_DEPT_NM"
                              :rules="ctcValidateRules.TKCG_DEPT_NM"
                              class="pl-form"
                              v-byte-counter="200"
                            />
                          </div>
                        </div>
                        <div class="pl-form-inline">
                          <span class="pl-label">
                            지역
                            <!-- <v-icon class="pl-icon20 required"></v-icon> -->
                          </span>
                          <div class="pl-desc">
                            <v-select
                              v-model="ctcDetail.SPLIT_ADDR"
                              class="pl-form"
                              :items="this.mixin_common_code_get(this.common_code, 'AREA')"
                              placeholder="선택하세요"
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
                              v-model="ctcDetail.CTC_USE_YN"
                              :rules="ctcValidateRules.CTC_USE_YN"
                              class="pl-form"
                              :items="this.mixin_common_code_get(this.common_code, 'USE_WT')"
                              placeholder="선택하세요"
                            ></v-select>
                          </div>
                        </div>
                        <div class="pl-form-inline">
                          <span class="pl-label">
                            호전환 대상여부
                            <v-icon class="pl-icon20 required"></v-icon>
                          </span>
                          <div class="pl-desc">
                            <v-select
                              v-model="ctcDetail.PHN_TRAN_TRGT_YN"
                              :rules="ctcValidateRules.PHN_TRAN_TRGT_YN"
                              class="pl-form"
                              :items="this.mixin_common_code_get(this.common_code, 'USE_WT')"
                              placeholder="선택하세요"
                            ></v-select>
                          </div>
                        </div>
                        <div class="pl-form-inline">
                          <span class="pl-label">
                            설명
                            <v-icon class="pl-icon20"></v-icon>
                          </span>
                          <div class="pl-desc">
                            <v-textarea
                              v-model="ctcDetail.CTC_EXPLN"
                              class="pl-form is-noresize"
                              placeholder="설명 내용 입력"
                              v-byte-counter="2000"
                              :spellcheck="false"
                            />
                          </div>
                        </div>
                      </div>
                    </v-form>
                  </div>
                  <div class="pl-card is-bottom">
                    <div class="is-right">
                      <v-btn class="pl-btn" @click="saveCtcBtn()">저장</v-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </div>
    <!-- dialog -->
  </div>
</template>

<script>
export default {
name:"MENU_STG_M0607", //name은 'MENU_' + 파일명 조합
components: {
},
data() {
   return {

    // 위치정보 관리 화면
    // grid
    page: 1,
    pageCount: 0,
    perPage: [15,30,50,100],
    ROW_PER_PAGE: 15,
    pagination:{
      page:1,
      rowsPerPage: 500
    },
    gridItems: [],
    selectedRow: {},
    selectedData: [],
    nextDisabled: false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
    gridTotalCnt: 0,

    // 위치상세정보
    pstnDetail :{
      PSTN_ID: '',
      PSTN_NM: '',
      DTL_ZIP: '',
      DIG_FIND_POST: false,
      DTL_ADDR: '',
      DTL_DTL_ADDR: '',
      LAT_LOT: '',
      PSTN_USE_YN: '',
      PSTN_EXPLAIN: '',
      RGN_CD: '',
    },

    // 우편번호 dialog
    dialogFindPost: false,

    headers: [
      { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '20px'},
      { text: '위치명', value: 'PSTN_NM', align: 'left', width: '100px'},
      { text: '지역', value: 'SPLIT_ADDR', align: 'left', width: '50px'},
      { text: '우편번호', value: 'ZIP', align: 'center', width: '50px'},
      { text: '주소', value: 'ADDR', align: 'left', width: '120px'},
      { text: '사용여부', value: 'USE_YN', align: 'center', width: '40px'},
      { text: '등록자', value: 'USER_NM', align: 'left', width: '50px'},
      { text: '등록일', value: 'REG_DT', align: 'center', width: '50px'},
    ],


    // 연락처 정보 관리
    // grid
    page2: 1,
    pageCount2: 0,
    ROW_PER_PAGE2: 15,
    perPage2: [15,30,50,100],
    pagination2:{
      page:1,
      rowsPerPage: 500
    },
    gridItems2: [],
    nextDisabled2: false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
    gridTotalCnt2: 0,

    // 연락처상세정보
    ctcDetail: {
      TASK_ID: '',
      TASK_NM: '',
      TEL_NO: '',
      TKCG_DEPT_NM: '',
      SPLIT_ADDR: '',
      CTC_USE_YN: 'Y',
      PHN_TRAN_TRGT_YN: 'Y',
      CTC_EXPLN: '',
    },

    headers2: [
      { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '20px'},
      { text: '담당부서', value: 'TKCG_DEPT_NM', align: 'left', width: '60px'},
      { text: '담당업무', value: 'TASK_NM', align: 'left', width: '60px'},
      { text: '호전환 대상', value: 'PHN_TRAN_TRGT_YN', align: 'center', width: '70px'},
      { text: '지역', value: 'RGN_NM', align: 'left', width: '50px'},
      { text: '연락처', value: 'TELNO', align: 'left', width: '70px'},
      { text: '사용여부', value: 'USE_YN', align: 'center', width: '50px'},
      { text: '등록자', value: 'USER_NM', align: 'left', width: '50px' },
      { text: '등록일', value: 'REG_DT', align: 'center', width: '50px'},
    ],

    // 공통
    tab: null,
    common_code: [],
    flagData: {
      NEW_MODI_CHECK: '',
    },

    // 필수항목 validation
    pstnValidateRules: {
      PSTN_NM: [v => !!v || '위치 명 은(는) 필수 입력 항목 입니다.'],
      // DTL_ZIP: [v => !!v || '우편번호 은(는) 필수 입력 항목 입니다.'],
      // DTL_ADDR: [v => !!v || '주소 은(는) 필수 입력 항목 입니다.'],
      DTL_DTL_ADDR: [v => !!v || '상세 주소 은(는) 필수 입력 항목 입니다.'],
      PSTN_USE_YN: [v => !!v || '사용 여부를 선택하세요.'],
      PSTN_EXPLAIN: [v => !!v || '설명 은(는) 필수 입력 항목 입니다.'],
    },
    ctcValidateRules: {
      TASK_NM: [v => !!v || '업무 명 은(는) 필수 입력 항목 입니다.'],
      TEL_NO: [v => !!v || '연락처 은(는) 필수 입력 항목 입니다.'],
      TKCG_DEPT_NM: [v => !!v || '담당 부서명 은(는) 필수 입력 항목 입니다.'],
      SPLIT_ADDR: [v => !!v || '지역을 선택하세요.'],
      CTC_USE_YN: [v => !!v || '사용 여부를 선택하세요.'],
      PHN_TRAN_TRGT_YN: [v => !!v || '사용 여부를 선택하세요.'],
    },


    MESSAGE : {
      CONFIRM : {
        REG_PSTN : {alertDialogToggle: true, msg: '저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.savePstn, callNo: this.closeMsg}
        , REG_CTC : {alertDialogToggle: true, msg: '저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.saveCtc, callNo: this.closeMsg}
        , DEL_PSTN : {alertDialogToggle: true, msg: '삭제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.deletePstn, callNo: this.closeMsg}
        , DEL_CTC : {alertDialogToggle: true, msg: '삭제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.deleteCtc, callNo: this.closeMsg}
      },
      ALERT : {
        REG_SUCCESS : {alertDialogToggle: true, msg: '저장 되었습니다.', iconClass: 'is-info', type: 'default'}
        , DEL_SUCCESS : {alertDialogToggle: true, msg: '삭제 되었습니다.', iconClass: 'is-info', type: 'default'}
        , CHECK_NON : {alertDialogToggle: true, msg: '항목을 선택하십시오.', iconClass: 'is-caution', type: 'default'}
        , CHECK_OVER : {alertDialogToggle: true, msg: '하나의 항목만 선택하십시오.', iconClass: 'is-caution', type: 'default'}
        , CHECK_ADDR : {alertDialogToggle: true, msg: '우편번호/주소 은(는) 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'}
        , CHECK_LATLOT : {alertDialogToggle: true, msg: '위도,경도로 입력해주세요.<br>사용가능문자(숫자,콤마,마침표)<br>예) 11.12345,22.67890', iconClass: 'is-caution', type: 'default'}
        , CHECK_TNM_LENGTH : {alertDialogToggle: true, msg: '위치명 글자수 제한(100자)이 초과되었습니다.', iconClass: 'is-caution', type: 'default'}
        , CHECK_PNM_LENGTH : {alertDialogToggle: true, msg: '업무명 글자수 제한(100자)이 초과되었습니다.', iconClass: 'is-caution', type: 'default'}
        , CHECK_DTL_ADR_LENGTH : {alertDialogToggle: true, msg: '상세주소 글자수 제한(200자)이 초과되었습니다.', iconClass: 'is-caution', type: 'default'}
        , CHECK_DNM_LENGTH : {alertDialogToggle: true, msg: '담당부서명 글자수 제한(200자)이 초과되었습니다.', iconClass: 'is-caution', type: 'default'}
        , CHECK_EXPLAIN_LENGTH : {alertDialogToggle: true, msg: '설명 글자수 제한(2000자)이 초과되었습니다.', iconClass: 'is-caution', type: 'default'}
        , ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'},
      },
      TOAST : {
        SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
      },
    },
   }
 },
  watch: {

  },

  computed: {

  },

  async created() {
    let codeName = ['USE_WT', 'AREA'];
    this.common_code = await this.mixin_common_code_get_all(codeName);
  },

  mounted() {
    this.getPstnList(false);
  },

  methods: {



    // 위치정보

    // 등록버튼(pstnDetail 초기화)
    regPstn(){
      this.checkFlag('new');

      this.pstnDetail.PSTN_ID = '';
      this.pstnDetail.PSTN_NM = '';
      this.pstnDetail.DTL_ZIP = '';
      this.pstnDetail.DTL_ADDR = '';
      this.pstnDetail.DTL_DTL_ADDR = '';
      this.pstnDetail.LAT_LOT = '';
      this.pstnDetail.PSTN_USE_YN = '',
      this.pstnDetail.PSTN_EXPLAIN = '';
      this.$refs.form.resetValidation();
    },

    // 저장버튼
    savePstnBtn(){

      // 위경도 정규식
      let pattern = new RegExp(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/);

      if(!this.detailValidate()) {
        return;
      }else if(this.mixin_isEmpty(this.pstnDetail.DTL_ADDR)){
        this.showAlert(this.MESSAGE.ALERT.CHECK_ADDR);
        return;
      }else if(this.pstnDetail.PSTN_NM.length > 100){ // 위치명 글자수 제한(100자 제한)
        this.showAlert(this.MESSAGE.ALERT.CHECK_PNM_LENGTH);
        return;
      }else if(this.pstnDetail.DTL_DTL_ADDR.length > 200){ // 상세주소 글자수 제한(200자 제한)
        this.showAlert(this.MESSAGE.ALERT.CHECK_DTL_ADR_LENGTH);
        return;
      }else if(this.pstnDetail.PSTN_EXPLAIN.length > 2000){ // 설명 글자수 제한(2000자 제한)
        this.showAlert(this.MESSAGE.ALERT.CHECK_EXPLAIN_LENGTH);
        return;
      }else if(!this.mixin_isEmpty(this.pstnDetail.LAT_LOT)){
        if(!pattern.test(this.pstnDetail.LAT_LOT)){
          this.showAlert(this.MESSAGE.ALERT.CHECK_LATLOT);
        }else{
          this.showAlert(this.MESSAGE.CONFIRM.REG_PSTN);
        }
      }else{
        this.showAlert(this.MESSAGE.CONFIRM.REG_PSTN);
      }
    },

    // 삭제버튼
    deletePstnBtn(){
      if(this.mixin_isEmpty(this.selectedData)){
        this.showAlert(this.MESSAGE.ALERT.CHECK_NON);
      }else if(this.selectedData.length > 1){
        this.showAlert(this.MESSAGE.ALERT.CHECK_OVER);
      }else{
        this.showAlert(this.MESSAGE.CONFIRM.DEL_PSTN);
      }
    },

    //우편번호 찾기
    getFindPost(data) {
      // console.log(data);
      this.pstnDetail.DTL_ZIP = data.zipNo;
      this.pstnDetail.DTL_ADDR = data.roadAddr;
      this.pstnDetail.DTL_DTL_ADDR = '';
      this.pstnDetail.RGN_CD = data.siNm;
      this.mixin_hideDialog('FindPost');
    },

    // 위치정보 조회
    async getPstnList(next){

      this.selectedData = [];
      //다음버튼 클릭 유무
      if (!next){
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
        this.gridItems = [];
        this.selectedData = [];
        this.gridTotalCnt = 0;
      }

      let URLData = '/api/setting/system/pstn/selectPstn';
      let postParam = {}
      let headParam = {
        head : {
          PAGING: 'Y',
          ROW_CNT: this.pagination.rowsPerPage,
          PAGES_CNT: this.pagination.page
        }
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        let tempDataText = response.DATA;
        let idx = this.gridItems.length + 1;

        for(let i in tempDataText){
          tempDataText[i]["ROW_NUMBER"]= idx++;
        }
        this.gridItems = [...this.gridItems, ...tempDataText]
        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }
        if(this.gridItems.length > 0) this.gridTotalCnt = response.DATA[0].TWB_PAGING_TOT_COUNT;

        //이부분은 체크해볼것
        this.pagination.page += 1;
        // this.page=1;

        if(response.DATA.length > 0) this.rowSelect(response.DATA[0]);
      }
    },

    // 위치정보 저장(신규등록,수정)
    async savePstn(){

      let lat = this.pstnDetail.LAT_LOT.split(',')[0];
      let lot = this.pstnDetail.LAT_LOT.split(',')[1];

      let URLData = '/api/setting/system/pstn/upsertPstn';
      let headParam = {
        head : {}
      }

      let pstnId = this.mixin_isEmpty(this.pstnDetail.PSTN_ID) ? '' : this.pstnDetail.PSTN_ID;

      let postParam = {
        PSTN_ID: pstnId,
        PSTN_NM: this.pstnDetail.PSTN_NM,
        ZIP: this.pstnDetail.DTL_ZIP,
        ADDR: this.pstnDetail.DTL_ADDR,
        DTL_ADDR: this.pstnDetail.DTL_DTL_ADDR,
        LAT: this.mixin_isEmpty(this.pstnDetail.LAT_LOT) ? null : lat,
        LOT: this.mixin_isEmpty(this.pstnDetail.LAT_LOT) ? null : lot,
        USE_YN: this.pstnDetail.PSTN_USE_YN,
        EXPLN: this.pstnDetail.PSTN_EXPLAIN,
        FLAG_DATA : this.flagData.NEW_MODI_CHECK, // true || false
        RGN_CD: this.pstnDetail.RGN_CD != '' ? this.pstnDetail.RGN_CD
                                             : this.pstnDetail.DTL_ADDR.substring(0, this.pstnDetail.DTL_ADDR.indexOf(' '))
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        // this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS);
        this.showToast(this.MESSAGE.TOAST.SUCCESS)
        this.getPstnList(false);
        this.closeMsg();
      }
    },

    // 위치정보 삭제
    async deletePstn(){
      let URLData = '/api/setting/system/pstn/deletePstn';
      let postParam = {
        PSTN_ID: this.selectedData[0].PSTN_ID
      };
      let headParam = {
        head : {}
      }
      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        // this.showAlert(this.MESSAGE.ALERT.DEL_SUCCESS);
        this.showToast(this.MESSAGE.TOAST.SUCCESS)
        setTimeout(() => {
          this.$store.commit("alertStore/hideAlert");
        }, 500);
        this.getPstnList(false);
        this.selectedData = [];
      }
    },

    //row 선택
    rowSelect(idx) {
      this.checkFlag('modify');
      this.selectedRow = idx;
      this.getExpsnAttrSelect(idx);
    },

    //row 선택 활성화
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    // 데이터 바인딩
    getExpsnAttrSelect(item) {
      // 위치상세정보
      this.pstnDetail.PSTN_ID = item.PSTN_ID;
      this.pstnDetail.PSTN_NM = item.PSTN_NM;
      this.pstnDetail.DTL_ZIP = item.ZIP;
      this.pstnDetail.DTL_ADDR = item.ADDR;
      this.pstnDetail.DTL_DTL_ADDR = item.DTL_ADDR;
      this.pstnDetail.LAT_LOT = !this.mixin_isEmpty(item.LAT + '' + item.LOT) ? item.LAT +','+ item.LOT : '';
      this.pstnDetail.PSTN_USE_YN = item.USE_YN;
      this.pstnDetail.PSTN_EXPLAIN = item.EXPLN;
    },


    // 연락처정보

    // 등록버튼(ctcDetail 초기화)
    regCtc(){
      this.checkFlag('new');
      this.ctcDetail.TASK_ID = '';
      this.ctcDetail.TASK_NM = '';
      this.ctcDetail.TEL_NO = '';
      this.ctcDetail.TKCG_DEPT_NM = '';
      this.ctcDetail.SPLIT_ADDR = '';
      this.ctcDetail.CTC_USE_YN = 'Y',
      this.ctcDetail.PHN_TRAN_TRGT_YN = 'Y',
      this.ctcDetail.CTC_EXPLN = '';
      this.$refs.form2.resetValidation();
    },

    // 저장버튼
    saveCtcBtn(){
      if(!this.detailValidate2()){
        return;
      }else if(this.ctcDetail.TASK_NM.length > 100){ // 업무명 글자수 제한(100자 제한)
        this.showAlert(this.MESSAGE.ALERT.CHECK_TNM_LENGTH);
        return;
      }else if(this.ctcDetail.TKCG_DEPT_NM.length > 200){ // 담당부서명 글자수 제한(200자 제한)
        this.showAlert(this.MESSAGE.ALERT.CHECK_DNM_LENGTH);
        return;
      }else if(this.ctcDetail.CTC_EXPLN.length > 2000){ // 설명 글자수 제한(2000자 제한)
        this.showAlert(this.MESSAGE.ALERT.CHECK_EXPLAIN_LENGTH);
        return;
      }else{
        this.showAlert(this.MESSAGE.CONFIRM.REG_CTC);
      }
    },

    // 삭제버튼
    deleteCtcBtn(){
      if(this.mixin_isEmpty(this.selectedData)){
        this.showAlert(this.MESSAGE.ALERT.CHECK_NON);
      }else if(this.selectedData.length > 1){
        this.showAlert(this.MESSAGE.ALERT.CHECK_OVER);
      }else{
        this.showAlert(this.MESSAGE.CONFIRM.DEL_CTC);
      }
    },

    // 연락처정보 조회
    async getCtcList(next){

      this.selectedData = [];
      //다음버튼 클릭 유무
      if (!next){
        this.pagination2.page = 1; //페이징 처리 초기화
        this.nextDisabled2 = true;  //버튼 비활성화
        this.gridItems2 = [];
        this.selectedData = [];
        this.gridTotalCnt2 = 0;
      }

      let URLData = '/api/setting/system/ctc/selectCtc';
      let postParam = {}
      let headParam = {
        head : {
          PAGING: 'Y',
          ROW_CNT: this.pagination2.rowsPerPage,
          PAGES_CNT: this.pagination2.page
        }
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        for(let i=0; i<response.DATA.length; i++){
          response.DATA[i].TELNO = this.autoPhoneNum(response.DATA[i].TELNO);
        }

        let tempDataText = response.DATA;
        let idx = this.gridItems2.length + 1;

        for(let i in tempDataText){
          tempDataText[i]["ROW_NUMBER"]= idx++;
        }
        this.gridItems2 = [...this.gridItems2, ...tempDataText];
        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled2 = false //버튼 활성화
          }else{
            this.nextDisabled2 = true  //버튼 비활성화
          }
        }
        if(this.gridItems2.length > 0) this.gridTotalCnt2 = response.DATA[0].TWB_PAGING_TOT_COUNT;

        //이부분은 체크해볼것
        this.pagination2.page += 1;
        this.page2=1;

        if(response.DATA.length > 0) this.rowSelect2(response.DATA[0]);

      }
    },

    // 연락처정보 신규등록/수정
    async saveCtc(){
      let URLData = '/api/setting/system/ctc/upsertCtc';
      let postParam;

      let ctcId = this.mixin_isEmpty(this.ctcDetail.TASK_ID) ? '' : this.ctcDetail.TASK_ID;

      postParam = {
          CTC_ID: ctcId,
          TASK_NM: this.ctcDetail.TASK_NM,
          TELNO: this.ctcDetail.TEL_NO,
          TKCG_DEPT_NM: this.ctcDetail.TKCG_DEPT_NM,
          RGN_CD: this.ctcDetail.SPLIT_ADDR,
          USE_YN: this.ctcDetail.CTC_USE_YN,
          PHN_TRAN_TRGT_YN: this.ctcDetail.PHN_TRAN_TRGT_YN,
          EXPLN: this.ctcDetail.CTC_EXPLN,
          FLAG_DATA : this.flagData.NEW_MODI_CHECK // true || false
      };
      let headParam = {
        head : {}
      }
      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        // this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS);
        this.showToast(this.MESSAGE.TOAST.SUCCESS)
        setTimeout(() => {
          this.$store.commit("alertStore/hideAlert");
        }, 500);

        // 조회함수,초기화
        this.getCtcList(false);

      }
    },

    // 연락처정보 삭제
    async deleteCtc(){
      let URLData = '/api/setting/system/ctc/deleteCtc';
      let postParam = {
        CTC_ID: this.selectedData[0].CTC_ID
      };
      let headParam = {
        head : {}
      }
      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        // this.showAlert(this.MESSAGE.ALERT.DEL_SUCCESS);
        this.showToast(this.MESSAGE.TOAST.SUCCESS)
        setTimeout(() => {
          this.$store.commit("alertStore/hideAlert");
        }, 500);
        this.getCtcList(false);
        this.selectedData = [];
      }
    },

    //row 선택
    rowSelect2(idx) {
      this.checkFlag('modify');
      this.selectedRow = idx;
      this.getExpsnAttrSelect2(idx);
    },

    //row 선택 활성화
    isActiveRow2(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    getExpsnAttrSelect2(item) {
      // 연락처상세정보
      this.ctcDetail.TASK_ID = item.CTC_ID;
      this.ctcDetail.TASK_NM = item.TASK_NM;
      this.ctcDetail.TEL_NO = item.TELNO.replace(/-/g, '');
      this.ctcDetail.TKCG_DEPT_NM = item.TKCG_DEPT_NM;
      this.ctcDetail.SPLIT_ADDR = item.RGN_CD;
      this.ctcDetail.CTC_USE_YN = item.USE_YN;
      this.ctcDetail.PHN_TRAN_TRGT_YN = item.PHN_TRAN_TRGT_YN;
      this.ctcDetail.CTC_EXPLN = item.EXPLN;
    },

    autoPhoneNum(value) {

      if (!value) {
        return "";
      }

      value = value.replace(/[^0-9]/g, "");

      let result = [];
      let restNumber = "";

      // 지역번호와 나머지 번호로 나누기
      if (value.startsWith("02")) {
        // 서울 02 지역번호
        result.push(value.substr(0, 2));
        restNumber = value.substring(2);
      } else if (value.startsWith("1")) {
        // 지역 번호가 없는 경우
        // 1xxx-yyyy
        restNumber = value;
      } else {
        // 나머지 3자리 지역번호
        // 0xx-yyyy-zzzz
        result.push(value.substr(0, 3));
        restNumber = value.substring(3);
      }

      if (restNumber.length === 7) {
        // 7자리만 남았을 때는 xxx-yyyy
        result.push(restNumber.substring(0, 3));
        result.push(restNumber.substring(3));
      } else {
        result.push(restNumber.substring(0, 4));
        result.push(restNumber.substring(4));
      }

      return result.filter((val) => val).join("-");
    },

    // 신규등록 / 수정 flag
    checkFlag(flag) {
      switch (flag) {
        case 'new':
          this.flagData.NEW_MODI_CHECK = true;
          break;

        case 'modify':
          this.flagData.NEW_MODI_CHECK = false;
          break;

        default:
          break;
      }
    },

    // 위치 validate check
    detailValidate() {
      return this.$refs.form.validate();
    },
    // 연락처 validate check
    detailValidate2() {
      return this.$refs.form2.validate();
    },

    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },
  },
}
</script>

<style lang="scss" scoped>

</style>