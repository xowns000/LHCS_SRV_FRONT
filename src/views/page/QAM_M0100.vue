<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                시행 연도
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="dropItems"
                  placeholder="선택하세요"
                  v-model="QA_SHOW.ENFC_YR"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">진행 상태</span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="dropItems2"
                  placeholder="선택하세요"
                  v-model="QA_SHOW.PRGRS_STTS_CD"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">시행 구분</span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="dropItems3"
                  placeholder="선택하세요"
                  v-model="QA_SHOW.ENFC_SE_CD"
                  item-text="QLTY_CLSF_NM"
                  item-value="QLTY_CLSF_ID"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">시행계획 명</span>
              <div class="pl-desc">
                <v-text-field
                  placeholder="검색어 입력"
                  class="pl-form is-lg"
                  v-model="QA_SHOW.PLAN_NM"
                  @keydown.enter="btnSearch"
                  ></v-text-field>

              </div>
            </div>
            <v-btn class="pl-btn is-icon" @click="btnSearch">
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
            <v-btn class="pl-btn is-icon is-sub" @click="btnShowDetail" :disabled="dtlDisabled">
              <span class="pl-icon20 document"></span>
              선택항목 상세
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub" @click="btnRegNewQAPlan">
              <span class="pl-icon20 circle-plus"></span>
              등록
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub" @click="btnRemoveQAPlan" :disabled="QA_PLAN_SELECTED_DATA.length?false:true">
              <span class="pl-icon20 trash"></span>
              삭제
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub" @click="showAlert(MESSAGE.CONFIRM.STRT_NOW)" :disabled="STRT_NOW">
              <span class="pl-icon20 trash"></span>
              즉시진행
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ TOTAL_CNT }})</em> 건</span>
          </div>
        </div>
        <v-data-table
          class="pl-grid has-control is-hover"
          :headers="QA_PLAN_LIST_HEADER"
          :items="QA_PLAN_LIST_DATA"
          :item-class="isActiveRow"
          v-model="QA_PLAN_SELECTED_DATA"
          show-select
          fixed-header
          item-key="QA_PLAN_ID"
          height="562px"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
          @click:row="rowSelect"
          @dblclick:row="dblClickRow"
          :page.sync="page"
          @page-count="pageCount = $event"
          no-data-text="등록된 데이터가 없습니다."
        >
          <template v-slot:item.PRGRS_STTS_NM="{ item }">
            <!-- <span :class="item.PRGRS_STTS_CD == 'ONGONG' ? 'is-txt-main' : (item.PRGRS_STTS_CD == 'TERMIAT' ? 'is-txt-error' : '' )">
              {{ item.PRGRS_STTS_NM }}
            </span> -->
            <span
              :class="`pl-round-chip is-sm chat-stat-${item.PRGRS_STTS_CD == 'ONGONG' ? 'cs' : (item.PRGRS_STTS_CD == 'TERMIAT' ? 'after' : 'wait' )}`">
              {{ item.PRGRS_STTS_NM }}
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

          <span class="pl-pager-period">보기 {{ mixin_getPagePeriod(QA_PLAN_LIST_DATA, page) }} / {{ QA_PLAN_LIST_DATA.length }}
            <!--
            <v-btn class="pl-btn is-sub" :disabled.sync="NEXT_DISABLED" @click="getQaPlanNext">다음 검색</v-btn>
            -->
            <compo-tooltip-btn
                TitleProp="다음 검색"
                ClassProp="pl-tooltip-btn is-line"
                IconProp="pl-icon20 arrow-next-paging"
                TooltipPositionProp="bottom"
                :DisabledProp="NEXT_DISABLED"
                @btnClick="getQaPlanNext"
            ></compo-tooltip-btn>
          </span>
        </div>
      </div>
    </div>
    <!-- dialog -->
    <v-dialog
      v-model="dialogRegQAPlan"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
        <compo-dialog
            :headerTitle="dialogTitle"
            @hide="mixin_hideDialog('RegQAPlan')"
        >
        <template slot="body">
          <v-form ref="form">
          <p>필수 항목을 입력하신 후 <strong>[저장]</strong> 버튼을 클릭하십시오.</p>
            <div class="pl-form-inline-wrap vertical is-mt-m">
              <div class="pl-form-inline">
              <span class="pl-label">
                시행 년도
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="dropItemsS01"
                  placeholder="선택하세요"
                  v-model="QA_PLAN.ENFC_YR"
                  :rules="validateRules.ENFC_YR"
                  :disabled.sync="DIAG_DISABLED"
                  ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                시행 구분
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="dropItemsS02"
                  placeholder="선택하세요"
                  v-model="QA_PLAN.ENFC_SE_CD"
                  item-text="QLTY_CLSF_NM"
                  item-value="QLTY_CLSF_ID"
                  :rules="validateRules.ENFC_SE_CD"
                  :disabled.sync="DIAG_DISABLED"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                시행 채널
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  :items="CHNL_CD_LIST"
                  placeholder="선택하세요"
                  class="pl-form"
                  v-model="QA_PLAN.CHNL_CD"
                  :rules="validateRules.CHNL_CD"
                  :disabled.sync="DIAG_DISABLED"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                시행계획 명
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  v-model="QA_PLAN.PLAN_NM"
                  :rules="validateRules.PLAN_NM"
                  :disabled.sync="DIAG_DISABLED"
                  v-byte-counter="200"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                평가 기간
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
                <div class="pl-desc">
                  <compo-date-range-picker
                      :StartDayProp.sync="QA_PLAN.EVL_BGNG_YMD"
                      :EndDayProp.sync="QA_PLAN.EVL_END_YMD"
                      @startDayChange="dateChange($event, 'EVL', 'BGNG')"
                      @endDayChange="dateChange($event, 'EVL', 'END')"
                  />
                </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                이의제기 여부
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="dropItemsS03"
                  placeholder="선택하세요"
                  v-model="QA_PLAN.OBJC_APLY_YN"
                  :disabled.sync="DIAG_DISABLED"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                평가중 콜 추가
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="dropItemsS04"
                  placeholder="선택하세요"
                  v-model="QA_PLAN.EVL_CL_ADD_YN"
                  :rules="validateRules.EVL_CL_ADD_YN"
                  :disabled.sync="DIAG_DISABLED"
                  ></v-select>
              </div>
            </div>
            <v-data-table
              class="pl-grid type-hover-func"
              :headers="DIAG_HEADERS"
              :items="DIAG_ITEMS"
              fixed-header
              item-key="CYCL_NM"
              height="142px"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              :page.sync="page"
              @page-count="pageCount = $event"
              no-data-text="등록된 데이터가 없습니다."
            >
              <template v-slot:item="{ item }">
                <tr
                  @mouseover="mixin_hoverItem(item,'DIAG_ITEMS')"
                  @mouseleave="mixin_leaveItem(item,'DIAG_ITEMS')"
                  :class="mixin_getItemClass(item)"
                >
                  <td :class="mixin_getHeaderClass(DIAG_HEADERS[0].align)">{{ item.CYCL_NM }}</td>
                  <td :class="mixin_getHeaderClass(DIAG_HEADERS[1].align)">
                    <template v-if="item.editing">
                      <compo-date-picker
                        DateType="dateInput"
                        :DateProp.sync="item.CYCL_BGNG_YMD"
                        @dateChange="dateChange($event, 'CYCL', 'BGNG', item.CYCL_NM)"
                      />
                      </template>
                    <template v-else>
                      {{ item.CYCL_BGNG_YMD }}
                    </template>
                  </td>
                  <td :class="mixin_getHeaderClass(DIAG_HEADERS[2].align)">
                    <template v-if="item.editing">
                      <compo-date-picker
                        DateType="dateInput"
                        :DateProp.sync="item.CYCL_END_YMD"
                        @dateChange="dateChange($event, 'CYCL', 'END', item.CYCL_NM)"
                        />
                    </template>
                    <template v-else>
                      {{ item.CYCL_END_YMD }}
                    </template>
                  </td>
                  <td class="grid-hover-func-wrap">
                    <!-- 수정 버튼 -->
                    <compo-tooltip-btn
                      TitleProp="수정"
                      ClassProp="pl-tooltip-btn"
                      IconProp="pl-icon20 edit"
                      TooltipPositionProp="bottom"
                      @btnClick="editItem(item)"
                    ></compo-tooltip-btn>
                    <!-- 삭제 버튼 -->
                    <compo-tooltip-btn
                      TitleProp="삭제"
                      ClassProp="pl-tooltip-btn"
                      IconProp="pl-icon20 trash"
                      TooltipPositionProp="bottom"
                      @btnClick="deleteItem(item, 'DIAG_ITEMS')"
                      ></compo-tooltip-btn>
                  </td>
                </tr>
              </template>
            </v-data-table>
            <div class="d-flex align-center">
              <ul class="pl-list-info mt-0">
                <li>시행 차수는 3차까지 지정할 수 있습니다.
                </li>
              </ul>
              <v-btn class="pl-btn is-icon is-sub ml-auto" @click="add_cycl()" :disabled.sync="DIAG_DISABLED">
                <span class="pl-icon20 circle-plus" ></span>
                추가
              </v-btn>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">설명</span>
              <div class="pl-desc">
                <v-textarea
                  class="pl-form is-noresize"
                  v-model="QA_PLAN.EXPLN"
                  :disabled.sync="DIAG_DISABLED"
                  :rules="validateRules.EXPLN"
                  :spellcheck="false"
                  v-byte-counter="4000"
                />
                </div>
            </div>
          </div>
        </v-form>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="closeDialog">닫기</v-btn>
          <v-btn class="pl-btn is-sub" @click="btnTermiat()" :disabled.sync="DIAG_TERMIAT_DISABLED">종료</v-btn>
          <v-btn class="pl-btn" @click="btnSaveQAPlan()">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "MENU_QAM_M0100", //name은 'MENU_' + 파일명 조합
  components: {
  },
 data() {
    return {
      MESSAGE: {
        CONFIRM: {
          REGIST:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '저장 하시겠습니까?', callYes: this.saveYes, callNo: this.closeMsg },
          TERMIAT:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '종료 하시겠습니까?', callYes: this.Termiat, callNo: this.closeMsg },
          REMOVE:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '삭제 하시겠습니까?', callYes: this.removeQAPlan, callNo: this.closeMsg },
          STRT_NOW:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '해당 QA를 즉시 진행하시겠습니까?', callYes: this.btnStrtNow, callNo: this.closeMsg },
        },
        ALERT: {
          SAVE_DONE:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '저장 되었습니다.' },
          DEL_DONE:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '삭제 되었습니다.' },
          REG_SUCCESS:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '정상 처리 되었습니다.' },	//기본항목
          TERMIAT_DONE:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '종료 되었습니다.' },
          SELECT_ITEM_MUST:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '항목을 선택 하십시오.' },
          SELECT_ITEM_TO_DELETE:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '삭제할 항목을 선택 하십시오.' },
          SELECT_ITEM_ONLY_ONE_ITEM:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '하나의 항목만 선택 하십시오.' },
          ADD_NOMORE:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '더 이상 추가 할 수 없습니다.' },
          LEAST_ONE_ITEM:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '최소 1차수 이상은 지정해야 합니다.' },
          CHECK_EVL_START_DATE:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가 시작일이 오늘 보다 이전일 수 없습니다.' },
          CHECK_EVL_PERIOS:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가기간을 확인하십시오.' },
          CHECK_CYCL_PERIOS:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '차수 시작일자와 종료일자를\n확인하십시오.' },
          CHECK_CYCL_PERIOS_DUP:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '시행차수간 시작일자와 종료일자는\n중복될 수 없습니다.' },
          MNGR_ASSIGNED:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '해당계획에 QA 평가 관리자가\n지정되어 있어 삭제할 수 없습니다.' },
          PRGRS_STTS_CD_ONGONG:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '진행중인 평가 계획은 삭제할 수 없습니다.' },
          PRGRS_STTS_CD_TERMIAT:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '종료된 평가 계획은 삭제할 수 없습니다.' },
          PRGRS_STTS_CD_ONGONG_SAVE:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '진행중인 평가 계획은 수정 할 수 없습니다.' },
          PRGRS_STTS_CD_TERMIAT_SAVE:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '종료된 평가 계획은 수정 할 수 없습니다.' },
          PRGRS_STTS_CD_PRPARG_TERMIAT:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '준비중인 평가 계획은 종료 할 수 없습니다.' },
          ALREADY_TERMIAT:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '이미 종료된 평가 계획입니다.' },
          CHK_PRGRS_STTS_CD:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가 계획 진행상태를 확인하세요.' },
          // MGR_EXIST:
          //   { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '해당 계획에 QA 평가 관리자가 지정되어 있어 삭제할 수 없습니다.' },
          // CLOSED_PLAN:
          //   { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '종료된 평가계획은 삭제할 수 없습니다.' },
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true,  iconClass: 'is-caution',  type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.' },	//기본항목
        },
        TOAST : {
          SAVE_DONE : {  msg: '저장 되었습니다.' , class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          ,DEL_DONE : {  msg: '삭제 되었습니다.' , class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          ,REG_SUCCESS : {  msg: '정상 처리되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          ,TERMIAT_DONE : {  msg: '종료 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        }
      },
      validateRules: {
        ENFC_YR: [
          v => !!v || '시행연도를 선택하세요.',
        ],
        ENFC_SE_CD: [
          v => !!v || '시행구분을 선택하세요.',
        ],
        PLAN_NM: [
          v => !!v || '시행계획명을 입력하세요.',
          v => v.length <= 200 || 'Max 200 characters',
        ],
        EVL_BGNG_YMD: [
          v => !!v || '시작일자를 입력 하세요.'
        ],
        EVL_END_YMD: [
          v => !!v || '종료일자를 입력 하세요.'
        ],
        EVL_CL_ADD_YN: [
          v => !!v || '평가중 콜 추가 여부를 선택하세요.',
        ],
        EXPLN: [
          v => v.length <= 400 || 'Max 400 characters',
        ],
        CHNL_CD: [
        v => !!v || '시행채널을 선택하세요.',
        ],
      },
      // top search
      dropItems: [],
      dropItems2: [],
      dropItems3: [],

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
      //ROW_PER_PAGE: 2,

      ROW_ONCE_PAGE: 500, //한번에 가져오는 건수 (공통)
      // ROW_ONCE_PAGE: 4, //한번에 가져오는 건수 (공통)
      ROW_CURR_PAGE: 1,
      NEXT_DISABLED: true,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
      TOTAL_CNT: 0,

      QA_PLAN_LIST_HEADER: [
        { text: '번호'            , value: 'ROW_NUMBER'       , align: 'center' , width: '80px'  },
        { text: '시행계획명'      , value: 'PLAN_NM'      , align: 'left'   , width: '100%'  },
        { text: '평가시작일자'    , value: 'EVL_BGNG_YMD' , align: 'left' , width: '120px' },
        { text: '평가종료일자'    , value: 'EVL_END_YMD'  , align: 'left' , width: '120px' },
        { text: '남은기간'        , value: 'REMAIN_DAY'   , align: 'center' , width: '100px' },
        { text: '시행구분'        , value: 'ENFC_SE_NM'   , align: 'left' , width: '100px' },
        { text: '이의제기여부'    , value: 'OBJC_APLY_NM' , align: 'left' , width: '120px' },
        { text: '시행차수'        , value: 'CYCL_CNT'     , align: 'center' , width: '100px' },
        { text: '진행상태'        , value: 'PRGRS_STTS_NM', align: 'left' , width: '100px' },
        { text: '등록자'          , value: 'RGTR_ID_NM'   , align: 'left' , width: '100px' },
        { text: '등록일'          , value: 'REG_DT'       , align: 'left' , width: '120px' },

        { text: '시행구분코드'    , value: 'ENFC_SE_CD'   , align: ' d-none' },
        { text: '이의제기여부코드', value: 'OBJC_APLY_YN' , align: ' d-none' },
        { text: '진행상태코드'    , value: 'PRGS_STTS_CD' , align: ' d-none' },
        { text: '등록자ID'        , value: 'RGTR_ID'      , align: ' d-none' },
        { text: '시행년도'        , value: 'ENFC_YR'      , align: ' d-none' },
        { text: 'QA PLAN ID'      , value: 'QA_PLAN_ID'   , align: ' d-none' },
        { text: 'QA 평가관리자수' , value: 'QA_MNGR_CNT'  , align: ' d-none' },
      ],
      QA_PLAN_LIST_DATA: [
      ],
      QA_PLAN_SELECTED_DATA: [],

      //dialog
      dialogTitle: '',
      dialogRegQAPlan: false,
      textareaRules: [v => v.length <= 200 || 'Max 200 characters'],
      textareaValue: '200자 제한!',
      dropItemsS01: [],
      dropItemsS02: [],
      dropItemsS03: [],
      dropItemsS04: [],
      editedIndex: -1,
      hoverRow: null,
      DIAG_HEADERS: [
        { text: '차수'      , value: 'CYCL_NM'      , align: 'center', width: '60px', sortable: false },
        { text: '시작일자'  , value: 'CYCL_BGNG_YMD', align: 'left', width: '150px', sortable: false },
        { text: '종료일자'  , value: 'CYCL_END_YMD' , align: 'left', sortable: false },
        { text: 'index'     , value: 'index'        , align: ' d-none' },
        { text: 'QA_CYCL_ID', value: 'QA_CYCL_ID'   , align: ' d-none' },
      ],
      DIAG_ITEMS: [
      ],
      QA_CODES: [],     // 코드 조회용
      QA_SHOW: {
        ENFC_YR: '',
        PRGRS_STTS_CD: '',
        ENFC_SE_CD: '',
        PLAN_NM: '',
      },
      CURRENT_DATE: '',
      CURRENT_YEAR: '',
      QA_CYCL: {  // QA시행계획 차수 Object
        QA_CYCL_ID: '',     //ID(SEQ)
        CYCL_NM: '',        //차수
        CYCL_BGNG_YMD: '',  //차수 시작 일자
        CYCL_END_YMD: '',   //차수 종료 일자
        editing: false,
      },
      CHNL_CD_LIST: [],   //시행채널리스트
      QA_PLAN: {  // QA시행계획 Object
        QA_PLAN_ID: '',   //ID(SEQ)
        ENFC_YR: '',      //시행년도
        ENFC_SE_CD: '',   //시행구분
        CHNL_CD: 'TEL',   //시행채널
        PLAN_NM: '',      //시행계획명
        EVL_BGNG_YMD: '', //평가기간FROM
        EVL_END_YMD: '',  //평가기간TO
        OBJC_APLY_YN:'',  //이의제기여부
        EVL_CL_ADD_YN:'', //평가중 콜 추가
        EXPLN:'',         //설명
        QA_CYCL:[],       //차수 (Object)
        RGTR_ID:'',       //등록자ID
        PRGRS_STTS_CD: '',//상태코드
      },
      DIAG_DISABLED:false,
      DIAG_TERMIAT_DISABLED: false,

      selectedRow : {},
      dtlDisabled: true,

      STRT_NOW:true,
    }
  },
  watch: {

  },
  computed: {
    ...mapGetters({
      stoUserId: 'userStore/GE_USER_ID',
      stoUserComp: 'userStore/GE_USER_COMPANY',
      stoCntnIp: 'userStore/GE_USER_IP_ADDR',
    }),
  },
  created() {

  },
  async mounted() {
    //await this.updateQAPlanSttsBatch(); //평가 시작 시점이 도래된 QA PLAN 상태 일괄 업데이트 ( 스케쥴러로 구현되면 제거할 것 )
    let CURRENT_DATE = await this.mixin_getSvrDate("YYYY-MM-DD");
    let CURRENT_YEAR = parseInt(CURRENT_DATE.substr(0,4));

    //this.QA_CODES = await this.mixin_common_code_get_all(['QATS_DV', 'QATS_ST', 'QAOJ_WT', 'USE_WT'], 'Y');
    this.QA_CODES = await this.mixin_common_code_get_all(['QATS_ST', 'QAOJ_WT', 'USE_WT', 'CHNL'], 'Y');

    //selectbox 연도 설정 (조회:전체있음.-5년~+5년, 등록/수정:전체없음.현재~+1년)
    this.dropItems.push({ text: '전체', value: '' });   // default
    for (let i = -5; i < 5; i++) {
      let strYear = (CURRENT_YEAR + i).toString();
      //this.dropItems.push({text: `${CURRENT_YEAR + i}년`, value: CURRENT_YEAR + i });
      this.dropItems.push({text: `${strYear}년`, value: strYear });
      if (i === 0 || i === 1) {
        //this.dropItemsS01.push({ text: `${CURRENT_YEAR + i}년`, value: CURRENT_YEAR + i });
        this.dropItemsS01.push({ text: `${strYear}년`, value: strYear });
      }
    }

    this.dropItems2 = this.mixin_common_code_get(this.QA_CODES, 'QATS_ST', '전체');
    //this.dropItems3 = this.mixin_common_code_get(this.QA_CODES, 'QATS_DV', '전체');
    this.dropItemsS03 = this.mixin_common_code_get(this.QA_CODES, 'QAOJ_WT');
    this.dropItemsS04 = this.mixin_common_code_get(this.QA_CODES, 'USE_WT');
    this.CHNL_CD_LIST = this.mixin_common_code_get(this.QA_CODES, 'CHNL');

    this.QA_SHOW.ENFC_YR = this.CURRENT_YEAR = CURRENT_YEAR.toString();
    this.CURRENT_DATE = CURRENT_DATE;
    this.qaPlanInit();

    let dropQltyClsf = await this.getQltyClfsCode();

    this.dropItems3 = [...dropQltyClsf];
    this.dropItemsS02 = [...dropQltyClsf];
    this.dropItems3.splice(0,0, { QLTY_CLSF_NM: '전체', QLTY_CLSF_ID: '' });

    this.getQAPlanList();
  },
  methods: {
    // 마우스 오버 기능버튼
    // 등록,상세회면 - 차수 날짜 변경 메소드
    editItem(item) {
      item.editing = !item.editing;
    },
    // 등록,상세회면 - 차수 날짜 삭제 메소드
    deleteItem(item, arr) {
      if(this.DIAG_ITEMS.length < 2) {
        this.showAlert(this.MESSAGE.ALERT.LEAST_ONE_ITEM);
        return;
      }
      const index = this[`${arr}`].indexOf(item);
      if(index !== -1) {
        this[`${arr}`].splice(index, 1);
      }
      this.reorder_cycl(); //마지막 차수가 변경 될때는 reoder할 필요 없으나, 복잡한 로직이 아니므로 일단 무조건 실행.
    },
    async btnTermiat() {
      let oSave = this.QA_PLAN;
      if(this.mixin_isEmpty(oSave.QA_PLAN_ID) || oSave.PRGRS_STTS_CD == 'PRPARG') {
        this.showAlert(this.MESSAGE.ALERT.PRGRS_STTS_CD_PRPARG_TERMIAT);
        return;
      } else if (oSave.PRGRS_STTS_CD == 'TERMIAT') {
        this.showAlert(this.MESSAGE.ALERT.ALREADY_TERMIAT);
        return;
      }
      this.showAlert(this.MESSAGE.CONFIRM.TERMIAT);
    },
    async Termiat() {
      let sUrl = '/api/qa/plan/termiat';
      let postParam = {
        "QA_PLAN_ID": this.QA_PLAN.QA_PLAN_ID,
        "PRGRS_STTS_CD": "TERMIAT",
      }
      let headParam = {
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)

      if (!resData.HEADER.ERROR_FLAG) {
        this.closeMsg();
        this.showToast(this.MESSAGE.TOAST.TERMIAT_DONE);

        // this.showAlert(this.MESSAGE.ALERT.TERMIAT_DONE);
        this.mixin_hideDialog('RegQAPlan');
        this.getQAPlanList();
      }
    },
    dblClickRow(event, {item}) {
      this.showDetail(item);
    },
    btnSearch() {
      this.getQAPlanList();
    },
    // QA시행등록/수정 화면 초기화.
    qaPlanInit() {
      this.QA_PLAN = {
        QA_PLAN_ID: '',               //ID(SEQ)
        ENFC_YR: this.CURRENT_YEAR,    //시행년도
        ENFC_SE_CD: '',               //시행구분
        CHNL_CD: 'TEL',                  //시행계획명
        PLAN_NM: '',                  //시행계획명
        EVL_BGNG_YMD: this.CURRENT_DATE,//평가기간FROM
        EVL_END_YMD: this.CURRENT_DATE,//평가기간TO
        OBJC_APLY_YN: '',             //이의제기여부
        EVL_CL_ADD_YN: '',            //평가중 콜 추가
        EXPLN: '',                    //설명
        QA_CYCL: [],                  //차수 (Object)
        RGTR_ID: this.stoUserId,      //등록자ID
        PRGRS_STTS_CD: 'PRPARG',      //진행상태 - 초기값은 '준비중'
      };
      this.QA_CYCL = {
        QA_CYCL_ID: '',                   //ID(SEQ)
        CYCL_NM: 1,                       //차수
        CYCL_BGNG_YMD: this.CURRENT_DATE,  //차수 시작 일자
        CYCL_END_YMD: this.CURRENT_DATE,   //차수 종료 일자
        editing: false,
      };
      this.DIAG_ITEMS = [this.QA_CYCL];
    },
    // 목록 조회
    async getQAPlanList(bNext) {
      let sUrl = "/api/qa/plan/list";
      let postParam = { ...this.QA_SHOW };

      if (bNext)
        this.ROW_CURR_PAGE++;
      else
        this.ROW_CURR_PAGE = 1;

      let headParam = {
        head: {
          PAGING: 'Y',
          // ROW_CNT: this.mixin_isEmpty(rowCnt) ? 500 : rowCnt,
          // PAGES_CNT: this.mixin_isEmpty(pageCnt) ? 1 : pageCnt,
          ROW_CNT: this.ROW_ONCE_PAGE,
          PAGES_CNT: this.ROW_CURR_PAGE,
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)

      if (!resData.HEADER.ERROR_FLAG) {
        //성공시 이벤트
        //list갱신전 체크박스 초기화
        this.QA_PLAN_SELECTED_DATA = [];

        if(resData.DATA.length > 0){
          resData.DATA.forEach((data, idx) => {
            data.EVL_BGNG_YMD = this.mixin_convertDate(data.EVL_BGNG_YMD, 'yyyy-MM-dd');
            data.EVL_END_YMD = this.mixin_convertDate(data.EVL_END_YMD, 'yyyy-MM-dd');
          });
        }

        if (bNext) {
          this.QA_PLAN_LIST_DATA = await this.QA_PLAN_LIST_DATA.concat(resData.DATA);
        }
        else {
          this.QA_PLAN_LIST_DATA = resData.DATA;
        }

        if (resData.DATA.length > 0) {
          this.TOTAL_CNT = resData.DATA[0].TWB_PAGING_TOT_COUNT;
        }
        else {
          this.TOTAL_CNT = 0;
        }
      }

      this.setPageNext();
    },
    setPageNext() {
      if (parseInt(this.TOTAL_CNT) > this.QA_PLAN_LIST_DATA.length)
        this.NEXT_DISABLED = false;
      else
        this.NEXT_DISABLED = true;
    },
    getQaPlanNext() {
      this.getQAPlanList(true);
    },
    btnShowDetail() {
      this.showDetail();
    },
    // "선택항목 상세" 버튼 클릭
    async showDetail (item) {

      this.qaPlanInit();

      /*if(item == undefined && this.QA_PLAN_SELECTED_DATA.length == 0) {
        this.showAlert(this.MESSAGE.ALERT.SELECT_ITEM_MUST)
          return;
      } else if(item == undefined && this.QA_PLAN_SELECTED_DATA.length > 1) {
        this.showAlert(this.MESSAGE.ALERT.SELECT_ITEM_ONLY_ONE_ITEM)
        return;
      }*/


      // let selectedItem = item==undefined?this.QA_PLAN_SELECTED_DATA[0]:item;
      let selectedItem = item==undefined?this.selectedRow:item;

      this.QA_PLAN.QA_PLAN_ID = selectedItem.QA_PLAN_ID;      //ID(SEQ)
      this.QA_PLAN.ENFC_YR = selectedItem.ENFC_YR;            //시행년도
      this.QA_PLAN.ENFC_SE_CD = selectedItem.ENFC_SE_CD;      //시행구분
      this.QA_PLAN.CHNL_CD = selectedItem.EVL_CHN_CD;            //시행계획명
      this.QA_PLAN.PLAN_NM = selectedItem.PLAN_NM;            //시행계획명
      this.QA_PLAN.EVL_BGNG_YMD = selectedItem.EVL_BGNG_YMD;  //평가기간FROM
      this.QA_PLAN.EVL_END_YMD = selectedItem.EVL_END_YMD;    //평가기간TO
      this.QA_PLAN.OBJC_APLY_YN = selectedItem.OBJC_APLY_YN;  //이의제기여부
      this.QA_PLAN.EVL_CL_ADD_YN = selectedItem.EVL_CL_ADD_YN;//평가중 콜 추가
      this.QA_PLAN.EXPLN = selectedItem.EXPLN;                //설명
      this.QA_PLAN.RGTR_ID = selectedItem.RGTR_ID;            //등록자ID
      this.QA_PLAN.PRGRS_STTS_CD = selectedItem.PRGRS_STTS_CD;//진행상태 - 초기값은 '준비중'

      if(Array.isArray(selectedItem.CYCL_LIST)) {
        this.DIAG_ITEMS = [];
        selectedItem.CYCL_LIST.forEach((array) => {
          let oItem = {};
          oItem.index = array.cycl_nm;
          oItem.QA_CYCL_ID = array.qa_cycl_id;
          oItem.CYCL_BGNG_YMD = array.cycl_bgng_ymd;
          oItem.CYCL_END_YMD = array.cycl_end_ymd;
          oItem.CYCL_NM = array.cycl_nm;
          oItem.editing=false;
          this.DIAG_ITEMS.push(oItem);
        })
      }
      await this.mixin_showDialog('RegQAPlan'); // 다이얼로그 띄우기

      if (selectedItem.PRGRS_STTS_CD == 'ONGONG' || selectedItem.PRGRS_STTS_CD == 'TERMIAT') {
        this.DIAG_DISABLED = true;
        // //let oObj = this.$refs.DIV_EVL_YMD;
        if(selectedItem.PRGRS_STTS_CD == 'TERMIAT') {
          this.DIAG_TERMIAT_DISABLED = true;
        }
        else {
          this.DIAG_TERMIAT_DISABLED = false;
        }
        this.dialogTitle = "QA 시행계획 상세";
      } else {
        this.DIAG_DISABLED = false;
        this.dialogTitle = "QA 시행계획 수정";
      }

      this.$refs.form.resetValidation();
    },
    // "등록" 버튼 클릭x
    async btnRegNewQAPlan() {
      this.dialogTitle = "QA 시행계획 등록";
      this.qaPlanInit();
      await this.mixin_showDialog('RegQAPlan'); // 다이얼로그 띄우기
      this.DIAG_TERMIAT_DISABLED = true;
      this.DIAG_DISABLED = false;
      this.$refs.form.resetValidation();
    },
    // "삭제" 버튼
    btnRemoveQAPlan() {
      if(this.QA_PLAN_SELECTED_DATA.length == 0) {
        this.showAlert(this.MESSAGE.ALERT.SELECT_ITEM_TO_DELETE);
        return;
      } else if(this.QA_PLAN_SELECTED_DATA.length > 1) {
        this.showAlert(this.MESSAGE.ALERT.SELECT_ITEM_ONLY_ONE_ITEM);
        return;
      }

      let selectedItem = this.QA_PLAN_SELECTED_DATA[0];

      if (selectedItem.PRGRS_STTS_CD == 'ONGONG') {// 진행중 여부 선택
        this.showAlert(this.MESSAGE.ALERT.PRGRS_STTS_CD_ONGONG);
        return;
      } else if(selectedItem.PRGRS_STTS_CD == 'TERMIAT') {// 종료 여부 선택
        this.showAlert(this.MESSAGE.ALERT.PRGRS_STTS_CD_TERMIAT);
        return;
      }
      else if (selectedItem.QA_MNGR_CNT > 0) {  // 관리자 지정 여부 확인
        this.showAlert(this.MESSAGE.ALERT.MNGR_ASSIGNED);
        return;
      }

      this.showAlert(this.MESSAGE.CONFIRM.REMOVE);
    },
    async removeQAPlan() {

      let sUrl = '/api/qa/plan/remove';
      let postParam = {
        "QA_PLAN_ID": this.QA_PLAN_SELECTED_DATA[0].QA_PLAN_ID,
      }
      let headParam = {
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)

      if (resData.HEADER.ERROR_FLAG) {
        if(resData.HEADER.ERROR_MSG == 'MNGR_ASSIGNED') {
          this.showAlert(this.MESSAGE.ALERT.MNGR_ASSIGNED);
        }
        else if (resData.HEADER.ERROR_MSG.indexOf('PRGRS_STTS_CD:') > -1) {
          let prgrsSttsCd = resData.HEADER.ERROR_MSG.split(':')[1];
          if(prgrsSttsCd == 'ONGONG')
            this.showAlert(this.MESSAGE.ALERT.PRGRS_STTS_CD_ONGONG);
          else if (prgrsSttsCd == 'TERMIAT')
            this.showAlert(this.MESSAGE.ALERT.PRGRS_STTS_CD_TERMIAT);
          else
            this.showAlert(this.MESSAGE.ALERT.CHK_PRGRS_STTS_CD);
        }
      } else {
        this.closeMsg();
        this.showToast(this.MESSAGE.TOAST.DEL_DONE);
        // this.showAlert(this.MESSAGE.ALERT.DEL_DONE);
        this.getQAPlanList(); //목록 refresh - 페이지등 현재 상태 그대로 리프레스 필요, 혹은 해당 row 만 삭제?
      }
    },
    // 등록/상세화면 "저장" 버튼 클릭 (1)
    btnSaveQAPlan() {
      let oSave = this.QA_PLAN;

      if (!this.mixin_isEmpty(oSave.QA_PLAN_ID) && oSave.PRGRS_STTS_CD == 'ONGONG') {
        // this.showAlert(this.MESSAGE.ALERT.PRGRS_STTS_CD_ONGONG_SAVE);
        // return;
      } else if (!this.mixin_isEmpty(oSave.QA_PLAN_ID) && oSave.PRGRS_STTS_CD == 'TERMIAT') {
        //종료된 QA 수정 가능
        // this.showAlert(this.MESSAGE.ALERT.PRGRS_STTS_CD_TERMIAT_SAVE);
        // return;
      }

      if(this.saveValidCheck())
        this.showAlert(this.MESSAGE.CONFIRM.REGIST);
    },
    // 등록/상세화면 "저장" 버튼 클릭 (2)
    async saveYes() {

      this.$store.commit('alertStore/hideAlert');

      this.QA_PLAN.EVL_BGNG_YMD = this.QA_PLAN.EVL_BGNG_YMD.replace(/-/g, '') + '000000';
      this.QA_PLAN.EVL_END_YMD = this.QA_PLAN.EVL_END_YMD.replace(/-/g, '') + '235959';

      let oSave = this.QA_PLAN;

      // if(!this.mixin_isEmpty(oSave.QA_PLAN_ID) && oSave.PRGRS_STTS_CD == 'ONGONG') {
      //   this.showAlert(this.MESSAGE.ALERT.PRGRS_STTS_CD_ONGONG_SAVE);
      //   return;
      // } else if (!this.mixin_isEmpty(oSave.QA_PLAN_ID) && oSave.PRGRS_STTS_CD == 'TERMIAT') {
      //   this.showAlert(this.MESSAGE.ALERT.PRGRS_STTS_CD_TERMIAT_SAVE);
      //   return;
      // }

      let idx = 0;
      let oCycls = [];

      this.DIAG_ITEMS.forEach((array) => {
        oCycls.push(array);
      });

      oSave.QA_CYCL = oCycls;
      oSave.EVL_CHN_CD = this.QA_PLAN.CHNL_CD;

      let sUrl = '/api/qa/plan/regist';
      let postParam = oSave;
      let headParam = {};

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!resData.HEADER.ERROR_FLAG) {
        this.closeMsg();
        // this.showAlert(this.MESSAGE.ALERT.SAVE_DONE);
        this.showToast(this.MESSAGE.TOAST.SAVE_DONE);
        this.mixin_hideDialog('RegQAPlan');
        this.getQAPlanList();
      }
    },
    dateChange(event, type1, type2, cyclNm) {
      // console.log("event", event);
      switch(type1) {
        case('EVL') :
          if(!this.checkDateValidEvl())
            this.showAlert(this.MESSAGE.ALERT.CHECK_EVL_PERIOS);
          //데이트 변경시 차수 종료일 변경.

          if(type2 === 'BGNG'){
            this.DIAG_ITEMS[0].CYCL_BGNG_YMD = event;
          }else{
            this.DIAG_ITEMS[this.DIAG_ITEMS.length - 1].CYCL_END_YMD = event;
          }

          break;
        case('CYCL') :
          let oMsg = this.checkDateValidCycl(cyclNm);
          if(!this.mixin_isEmpty(oMsg)) {
            this.showAlert(oMsg);
          }
          break;
      }
    },
    checkDateValidEvl() {
      if (this.QA_PLAN.EVL_BGNG_YMD > this.QA_PLAN.EVL_END_YMD) {
        return false;
      } else
        return true;
    },
    checkDateValidCycl(cyclNm) {
      let item = this.DIAG_ITEMS[parseInt(cyclNm) - 1];
      if (item.CYCL_BGNG_YMD > item.CYCL_END_YMD) {       //차수 시작일이 차주 종료일 이전 날짜일 경우
        return this.MESSAGE.ALERT.CHECK_CYCL_PERIOS;
      }
    },
    checkDateValidCyclAll(cyclNm) {
      let cyclStart = '';
      let cyclEnd = '';

      for (let idx = 0; idx < this.DIAG_ITEMS.length; idx++) {
        let item = this.DIAG_ITEMS[idx];

        if(!this.mixin_isEmpty(cyclStart) && item.CYCL_BGNG_YMD < cyclStart) {  //선 차수 시작일 보다 후 차수 시작일이 이전 날짜일 경우
          return this.MESSAGE.ALERT.CHECK_CYCL_PERIOS;
        } else if (item.CYCL_BGNG_YMD < this.QA_PLAN.EVL_BGNG_YMD) { //차수 시작일이 평가 시작일 이전 날짜일 경우
          return this.MESSAGE.ALERT.CHECK_CYCL_PERIOS;
        } else if (item.CYCL_END_YMD > this.QA_PLAN.EVL_END_YMD) {  //차수 종료일이 평가 종료일 이후 날짜일 경우
          return this.MESSAGE.ALERT.CHECK_CYCL_PERIOS;
        } else if (item.CYCL_BGNG_YMD > item.CYCL_END_YMD) {       //차수 시작일이 차주 종료일 이전 날짜일 경우
            return this.MESSAGE.ALERT.CHECK_CYCL_PERIOS;
        } else if (cyclStart != '' &&
          ((cyclStart >= item.CYCL_BGNG_YMD && cyclStart <= item.CYCL_END_YMD) ||
            (cyclEnd >= item.CYCL_BGNG_YMD && cyclEnd <= item.CYCL_END_YMD))) { //차수겹침
          return this.MESSAGE.ALERT.CHECK_CYCL_PERIOS_DUP;
        } else {
          cyclStart = item.CYCL_BGNG_YMD;
          cyclEnd = item.CYCL_END_YMD;
        }
      }
        return '';
    },
    // 저장버튼 클릭시 Valication 체크
    saveValidCheck() {
      if (!this.checkDateValidEvl()) {
        this.showAlert(this.MESSAGE.ALERT.CHECK_EVL_PERIOS);
        return false
      }

      let qaPlanEvlBgngYmd = this.QA_PLAN.EVL_BGNG_YMD.replace(/-/g, '');
      let nowDate = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10).replace(/-/g, '');

      if(qaPlanEvlBgngYmd < nowDate){
        this.showAlert(this.MESSAGE.ALERT.CHECK_EVL_START_DATE);
        return false
      }

      let oMsg = this.checkDateValidCyclAll();
      if (!this.mixin_isEmpty(oMsg)) {
        this.showAlert(oMsg);
        return false;
      }

      return this.$refs.form.validate();
    },
    closeDialog() {
      this.$refs.form.resetValidation();
      this.selectedRow = {};
      this.dtlDisabled = true;
      this.mixin_hideDialog('RegQAPlan');
    },
    //시행구분 코드 조회
    async getQltyClfsCode() {
      let sUrl = "/api/qa/qltyclsf/code";
      let postParam = {};
      let headParam = {};

      let resData = await this.common_postCall(sUrl, postParam, headParam)

      if (resData.HEADER.ERROR_FLAG)
        return [];
      else {
        let dropQltyClsf = [];
        dropQltyClsf = resData.DATA;
        return dropQltyClsf;
      }
    },
    //  등록/상세화면 - 차추 추가
    add_cycl() {
      if (this.DIAG_ITEMS.length >= 3) {
        this.showAlert(this.MESSAGE.ALERT.ADD_NOMORE);
        return;
      }
      const idx_cycl = this.DIAG_ITEMS.length + 1;

      let planEndYmd = new Date(this.QA_PLAN.EVL_END_YMD);
      let cyclEndYmd = new Date(this.DIAG_ITEMS[this.DIAG_ITEMS.length - 1].CYCL_END_YMD);

      let startYmd = cyclEndYmd<planEndYmd?new Date(cyclEndYmd.setDate(cyclEndYmd.getDate()+1)):planEndYmd;

      this.QA_CYCL =
      {
        index: idx_cycl,
        CYCL_NM: idx_cycl,
        CYCL_BGNG_YMD: startYmd.toISOString().substr(0, 10),
        CYCL_END_YMD: this.QA_PLAN.EVL_END_YMD,
        editing: false,
      };
      this.DIAG_ITEMS.push(this.QA_CYCL);
    },
    // 상세화면 - 차수 삭제시 index 번호 reordering
    reorder_cycl() {
      let idx = 0;
      this.DIAG_ITEMS.forEach((array) => {
        array.CYCL_NM = ++idx;
      });
    },
    // 날짜 차이 계산
    diffDate(fromDate, toDate) {
      const d1 = new Date(fromDate);
      const d2 = new Date(toDate);
      const diffDate = d2.getTime() - d1.getTime();
      const rtnVal = Math.abs(diffDate / (1000 * 60 * 60 * 24)); // 밀리세컨 * 초 * 분 * 시 = 일
      return rtnVal;
    },
    async updateQAPlanSttsBatch() {
      let sUrl = "/api/qa/plan/updatesttsbath";
      let postParam = {};
      let headParam = {};

      let resData = await this.common_postCall(sUrl, postParam, headParam)

      // if (resData.HEADER.ERROR_FLAG)
      //   console.log('updateQAPlanSttsAllOngong fail', resData.HEADER.ERROR_MSG);
      // else
      //   console.log('updateQAPlanSttsAllOngong success');
    },

    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },
    rowSelect(item){
      this.selectedRow = item;
      this.dtlDisabled = false;

      this.STRT_NOW = (this.selectedRow.EVL_BGNG_YMD == this.CURRENT_DATE && this.selectedRow.REG_DT == this.CURRENT_DATE && this.selectedRow.PRGRS_STTS_CD == 'PRPARG') ? false : true;
      
    },
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    //즉시진행
    async btnStrtNow(){
      let sUrl = "/api/qa/plan/strtNow";
      let postParam = {
        QA_PLAN_ID: this.selectedRow.QA_PLAN_ID,
      };
      let headParam = {};

      let resData = await this.common_postCall(sUrl, postParam, headParam)

      if (!resData.HEADER.ERROR_FLAG){
        this.selectedRow = {};
        this.dtlDisabled = true;
        this.STRT_NOW = true;
        this.btnSearch();
        this.closeMsg();
      }
    },
  }
}
</script>

<style lang="scss" scoped>

</style>