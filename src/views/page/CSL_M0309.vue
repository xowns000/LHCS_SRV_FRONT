<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                조회 기간
              </span>
              <div class="pl-desc">
                <compo-date-range-picker
                  :StartDayProp.sync="SCH_RSVT_ST_DTS"
                  :EndDayProp.sync="SCH_RSVT_END_DTS"
                  @startDayChange="mixin_testLog(SCH_RSVT_ST_DTS)"
                  @endDayChange="mixin_testLog(SCH_RSVT_END_DTS)"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                서비스 종류
              </span>
              <div class="pl-desc">
                <v-select
                  v-model="SCH_SRVC_TYPE_CD"
                  class="pl-form"
                  :items="mixin_common_code_get(this.list_common_code, 'SRVC_TP', '전체')"
                  placeholder="선택하세요"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                제품 유형
              </span>
              <div class="pl-desc">
                <v-autocomplete
                  v-model="SCH_PRDCT_TYPE"
                  return-object
                  class="pl-form is-lg"
                  :items="PRDCT_ITEMS"
                  v-on:change="schVstRsvtHistList('')"
                  placeholder="제품 유형을 검색하세요"
                  clearable
                  no-data-text="결과 없음"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                진행 상태
              </span>
              <div class="pl-desc">
                <v-select
                  v-model="SCH_STTS_CD"
                  class="pl-form"
                  :items="mixin_common_code_get(this.list_common_code, 'VST_RSVT_STAT', '전체')"
                  placeholder="선택하세요"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                <v-select
                  v-model="SCH_KEY"
                  :items="mixin_common_code_get(this.list_common_code, 'AS_SCH_TP', '전체')"
                  class="pl-form"
                  placeholder="선택하세요"
                />
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="SCH_KEYWORD"
                  class="pl-form is-lg"
                  placeholder="검색어 입력"
                  @keyup.enter="schVstRsvtHistList('')"
              />
              </div>
            </div>
            <div class="d-flex">
              <v-btn
                class="pl-btn is-icon"
                @click="schVstRsvtHistList('')"
                >
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
            </div>
          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body">
        <div class="pl-grid-top">
          <div class="pl-grid-top-left">
            <v-btn
              class="pl-btn is-icon is-sub"
              @click="selectDetail()"
              :disabled="selectedRow.index != undefined ? false : true"
              >
              <span class="pl-icon20 document"></span>
              선택항목 상세
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-tooltip-btn
              TitleProp="엑셀 다운로드"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 exceldown"
              TooltipPositionProp="bottom"
              :DisabledProp="items.length > 0?false:true"
              @btnClick="showExceldownFilter()"
            ></compo-tooltip-btn>
          </div>
        </div>
        <v-data-table
          class="pl-grid has-img has-control"
          single-select
          :headers="headers"
          :items="items"
          :item-class="isActiveRow"
          fixed-header
          item-key="ROW_NUMBER"
          height="562px"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
          :page.sync="page"
          @page-count="pageCount = $event"
          no-data-text="등록된 데이터가 없습니다."
          @click:row="rowClick"
          @dblclick:row="selectDetail"
          >
          <template v-slot:item.REG_DT="{ item }">
            {{ mixin_convertDate(item.REG_DT, 'yyyy-MM-dd HH:mm:ss') }}
          </template>
          <template v-slot:item.CUST_NM="{ item }">
            {{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(item.CUST_NM) : item.CUST_NM }}
          </template>
          <template v-slot:item.CUST_TELNO="{ item }">
            {{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(item.CUST_TELNO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(item.CUST_TELNO.replace(/[^0-9]/g, "")) }}
          </template>
          <template v-slot:item.UP_PRDCT_NM="{ item }">
            {{ item.UP_PRDCT_NM?item.UP_PRDCT_NM:'-' }}
          </template>
          <template v-slot:item.PRDCT_NM="{ item }">
            {{ item.PRDCT_NM?item.PRDCT_NM:'-' }}
          </template>
          <template v-slot:item.ALTMNT_DT="{ item }">
            {{ mixin_convertDate(item.ALTMNT_DT, 'yyyy-MM-dd HH:mm:ss') }}
          </template>
          <template v-slot:item.RSVT_BGNG_DT="{ item }">
            {{ mixin_convertDate(item.RSVT_BGNG_DT, 'yyyy-MM-dd HH:mm:ss') }}
          </template>
          <!-- AS 기사 -->
          <template v-slot:item.VSTR_NM="{ item }">
            <img
              v-if="item.VSTR_NM"
              :src="'/upload/' + item.VSTR_IMG"
              :alt="`${ item.VSTR_NM  }`"
              class="pl-grid-portrait"
              @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}"
            >
            <span class="ml-3">{{ item.VSTR_NM }}</span>
          </template>
          <!-- 상태 -->
          <template v-slot:item.STTS_NM="{ item }">
            <span :class="`pl-round-chip is-sm ${ mixin_displayStatus(item.STTS_CD, `statList`) }`">
              {{ item.STTS_NM }}
            </span>
          </template>
          <template v-slot:item.STTS_REG_DT="{ item }">
            {{ item.STTS_CD !== 'VRS_ALTMNT'? mixin_convertDate(item.STTS_REG_DT, 'yyyy-MM-dd HH:mm:ss'):'-' }}
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
              :DisabledProp = "nextDisabled"
              @btnClick="schVstRsvtHistList('next')"
            ></compo-tooltip-btn>
          </span>
        </div>
      </div>
    </div>
    <!-- 모달 : 상세정보 -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer" v-if=" detailModal === true ">
        <div class="pl-quick-layer-header"><h1>AS 진행 상세 정보</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="detailModal = false"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body">
          <!-- info -->
          <div class="pl-form-box-list">
            <div class="pl-form-box-list-unit">
              <div
                class="d-flex pa-4"
                style="">
                <div class="pl-portait-img">
                  <img
                    :src="'/upload/' + selectedRow.VSTR_IMG"
                    :alt="`${ selectedRow.VSTR_NM  }`"
                    class="pl-grid-portrait"
                    @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}"
                  >
                </div>
                <div class="d-flex px-4 flex-grow-1 flex-column">
                  <div class="flex-grow-1">
                    <strong>{{ selectedRow.VSTR_NM }}</strong>
                    <span class="ml-2">{{ selectedRow.VSTR_PHN_NO?mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(selectedRow.VSTR_PHN_NO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(selectedRow.VSTR_PHN_NO.replace(/[^0-9]/g, "")):'-' }}</span>
                  </div>
                  <div class="mt-1">
                    <span>{{ selectedRow.DEPT_NM }}</span>
                    <span class="ml-1">
                      <span class="pl-round-chip is-sm is-txt-green is-bg-light-green" v-if="selectedRow.UP_PRDCT_NM">
                        {{ selectedRow.UP_PRDCT_NM }}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div class="pa-4">
                <div class="pl-btn-wrap pt-2 is-border-top justify-center">
                  <v-btn class="pl-btn is-icon is-sub is-trans font-weight-regular"
                    @click="callDialog()"
                  >
                    <span class="pl-icon20 circle-call"></span>
                    전화 걸기
                  </v-btn>
                  <v-btn class="pl-btn is-icon is-sub is-trans font-weight-regular"
                    @click="$eventBus.$emit('showRightSlide', {ACT_NM: 'dialogSms', active:false})"
                  >
                    <span class="pl-icon20 circle-sms"></span>
                    SMS 보내기
                  </v-btn>
                  <v-btn class="pl-btn is-icon is-sub is-trans font-weight-regular"
                    @click="$eventBus.$emit('showRightSlide', {ACT_NM: 'dialogTalk', active:false})"
                  >
                    <span class="pl-icon20 circle-talk"></span>
                    알림톡 보내기
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
          <!-- 진행 현황 -->
          <div class="is-mt-l">
            <div class="d-flex align-center">
              <h2 class="pl-subtit">진행 현황</h2>
              <span :class="`ml-2 pl-round-chip is-sm ${ mixin_displayStatus(selectedRow.STTS_CD, `statList`) }`">
                {{ selectedRow.STTS_NM }}
              </span>
            </div>
            <ul class="pl-line-list is-border type-left is-mt-m">
              <li class="">
                <span class="keyTitle">예약 일시</span>
                <strong class="is-txt-blue">{{ mixin_convertDate(selectedRow.RSVT_BGNG_DT, 'yyyy-MM-dd HH:mm:ss') }}</strong>
                <div
                  class="d-flex align-center ml-2"
                  v-if="selectedRow.STTS_CD === 'VRS_ALTMNT'">
                  <compo-tooltip-btn
                    TitleProp="예약 변경"
                    ClassProp="pl-tooltip-btn ml-1"
                    IconProp="pl-icon20 edit"
                    TooltipPositionProp="bottom"
                    @btnClick="$eventBus.$emit('dialogAssignManager', selectedRow)"
                  ></compo-tooltip-btn>
                  <compo-tooltip-btn
                    TitleProp="예약 취소"
                    ClassProp="pl-tooltip-btn ml-1"
                    IconProp="pl-icon20 cancel"
                    TooltipPositionProp="bottom"
                    @btnClick="vstRsvtCancel(selectedRow)"
                  ></compo-tooltip-btn>
                </div>
              </li>
              <li class="">
                <span class="keyTitle">배정 일시</span>
                <strong >{{ mixin_convertDate(selectedRow.ALTMNT_DT, 'yyyy-MM-dd HH:mm:ss') }} ({{ selectedRow.ALTMNT_RGTR_NM }})</strong>
              </li>
              <li class="">
                <span class="keyTitle">완료 일시</span>
                <strong >{{ selectedRow.STTS_CD === 'VRS_CMPTN'?mixin_convertDate(selectedRow.STTS_REG_DT, 'yyyy-MM-dd HH:mm:ss'):'-' }}</strong>
              </li>
              <li>
                <span class="keyTitle">고객명</span>
                <strong>{{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(selectedRow.CUST_NM) : selectedRow.CUST_NM }} ({{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(selectedRow.CUST_TELNO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(selectedRow.CUST_TELNO.replace(/[^0-9]/g, "")) }})</strong>
              </li>
              <li>
                <span class="keyTitle">AS 위치</span>
                <strong>{{ selectedRow.ADDR + ' ' + selectedRow.ADDR_DTL }}</strong>
              </li>
              <li>
                <span class="keyTitle">AS 제품</span>
                <strong>{{ selectedRow.PRDCT_NM }}</strong>
              </li>
              <li>
                <span class="keyTitle">서비스 종류</span>
                <strong>{{ selectedRow.SRVC_TYPE_NM }}</strong>
              </li>
              <li>
                <span class="keyTitle">문의내용</span>
                <strong>{{ selectedRow.DMND_MTTR }}</strong>
              </li>
              <li>
                <span class="keyTitle">특이사항</span>
                <strong>{{ selectedRow.EXCPTN_MTTR }}</strong>
              </li>
              <li>
                <span class="keyTitle">영상 이미지</span>
                <div style="display: grid; gap: 16px; grid-template-columns: repeat(5, 1fr);">
                  <template v-for="(image, idx) in selectedRow.CAPTURE_FILE">
                    <img
                      class="rounded-lg"
                      style="max-width: 100%;cursor:pointer"
                      :src="'/upload/videos/' + selectedRow.VIDEO_FILE_PATH + '/captures/' + image"
                      @click="img_expand('/upload/videos/' + selectedRow.VIDEO_FILE_PATH + '/captures/' + image)"
                    />
                  </template>
                </div>
              </li>
              <li>
                <span class="keyTitle">업로드 이미지</span>
                <div style="display: grid; gap: 16px; grid-template-columns: repeat(5, 1fr);" v-if="selectedRow.UPLOAD_IMG">
                  <template v-for="(image, idx) in selectedRow.UPLOAD_IMG.split('_##_')">
                    <img
                      class="rounded-lg"
                      style="max-width: 100%;cursor:pointer"
                      :src="'/upload/' + image"
                      @click="img_expand('/upload/' + image)"
                    />
                  </template>
                </div>
              </li>
            </ul>
          </div>
          <!-- 배정 및 처리이력 -->
          <div class="is-mt-l">
            <h2 class="pl-subtit">배정 및 처리이력</h2>
            <template v-for="(hist, idx) in VST_RSVT_HIST_LIST">
              <ul :key="idx" class="pl-line-list type-left is-mt-m is-border-top is-border-bottom">
                <li>
                  <strong class="keyTitle">처리 상태</strong>
                  <span :class="`pl-round-chip is-sm ${ mixin_displayStatus(hist.STTS_CD, `statList`) }`">
                    {{ hist.STTS_CD === 'VRS_ALTMNT' && hist.STTS_DTL_CD ? '일정변경' : hist.STTS_NM }}
                  </span>
                </li>
                <li v-if="hist.STTS_DTL_CD">
                  <strong class="keyTitle">사유</strong>
                  <span>{{ hist.STTS_DTL_NM }}</span>
                  <span class="is-txt-bull mx-1">•</span>
                  <span>{{ hist.STTS_DTL_CD.indexOf('_ETC') > -1?hist.CN:'' }}</span>
                </li>
                <li v-if="hist.STTS_CD !== 'VRS_RTRCN'">
                  <strong class="keyTitle">AS 기사</strong>
                  <span>{{ hist.VSTR_NM }} ({{ hist.VSTR_PHN_NO?mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(hist.VSTR_PHN_NO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(hist.VSTR_PHN_NO.replace(/[^0-9]/g, "")):'-' }})</span>
                  <span class="is-txt-bull mx-1">•</span>
                  <span>{{ hist.DEPT_NM }}</span>
                </li>
                <li v-if="hist.STTS_CD !== 'VRS_RTRCN'">
                  <strong class="keyTitle">예약 일시</strong>
                  <strong class="is-txt-blue">{{ mixin_convertDate(hist.RSVT_BGNG_DT, 'yyyy-MM-dd HH:mm:ss') }}</strong>
                  <span class="is-txt-bull mx-1">•</span>
                  <span>{{ hist.PRDCT_NM }}</span>
                </li>
                <li v-if="hist.STTS_CD !== 'VRS_RTRCN'">
                  <strong class="keyTitle">배정 일시</strong>
                  <span>{{ mixin_convertDate(hist.ALTMNT_DT, 'yyyy-MM-dd HH:mm:ss') }}</span>
                  <span class="is-txt-bull mx-1">•</span>
                  <span>{{ hist.ALTMNT_RGTR_NM }}</span>
                </li>
                <li v-if="hist.STTS_CD === 'VRS_RTRCN'">
                  <strong class="keyTitle">취소 일시</strong>
                  <span>{{ mixin_convertDate(hist.REG_DT, 'yyyy-MM-dd HH:mm:ss') }}</span>
                  <span class="is-txt-bull mx-1">•</span>
                  <span>{{ hist.RGTR_NM }}</span>
                </li>
              </ul>
            </template>
          </div>
        </div>
      </div>
    </v-slide-x-reverse-transition>

    <!-- 사유 dialog-->
    <v-dialog
      v-model="dialogCommonReason"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :header-title="dialogTitl"
        @hide="mixin_hideDialog('CommonReason')"
      >
        <template slot="search">
        </template>
        <template slot="body">
          <div>
            <v-radio-group v-model="STTS_DTL_CD">
              <v-radio
                v-for="(code, idx) in REASON_TP_LIST"
                :key="REASON_TP_LIST[idx].text"
                :label="code.text"
                :value="code.value"
                class="pl-radio"
              >
              </v-radio>
              <div class="pl-desc">
                <v-textarea
                  :disabled="STTS_DTL_CD.indexOf('_ETC') === -1"
                  v-model="CN"
                  class="pl-form is-noresize"
                  :spellcheck="false"
                />
              </div>
            </v-radio-group>
          </div>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('CommonReason')">닫기</v-btn>
          <v-btn class="pl-btn" @click="vstRsvtProc">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- 이미지 확대 다이얼로그 -->
    <v-dialog
      v-model="dialogImgExpand"
      content-class="dialog-draggable is-lg is-scroll"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="이미지"
        @hide="mixin_hideDialog('ImgExpand')"
      >
        <template slot="body">
          <!-- component -->
          <div
            class="d-flex flex-column align-center"
            style="height: -webkit-fill-available;">
            <div class="d-flex align-center" style="width: 50%">
              <v-icon class="pl-icon20 zoom mr-4 "></v-icon>
              <vue-slider
                v-model="imgWidth"
                :min=0.1
                :max=10
                :interval=0.1
                tooltip="none"
                width="calc(100% - 46px)"
                height="2px"
                dragOnClick
                @drag-start="toggleZoom = false"
                :duration=0
                adsorb
              />
              <compo-tooltip-btn
                TitleProp="원본 보기"
                ClassProp="pl-tooltip-btn ml-4"
                IconProp="pl-icon20 zoom-fit"
                TooltipPositionProp="bottom"
                @btnClick="imgWidth = 1"
              ></compo-tooltip-btn>
            </div>
            <img
              :src="expandImgUrl"
              :style="`transform: scale(${imgWidth}); transform-origin: center top;`"
              class="is-mt-m"
            >

          </div>

        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
export default {
   name:"MENU_CSL_M0309", //name은 'MENU_' + 파일명 조합

components: {
},
data() {
  return {
    //공통코드 설정
    list_common_code : [],
    common_code : [],

    PRDCT_ITEMS : [],

    //검색
    SCH_RSVT_ST_DTS : this.$moment(this.startDate).subtract(7,'days').format('YYYY-MM-DD'), //예약 검색 시작 일자
    SCH_RSVT_END_DTS : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), //예약 검색 종료 일자
    SCH_STTS_CD : '', //예약 상태 코드
    SCH_KEY : 'AST_CUST_NM', // 검색 구분
    SCH_KEYWORD : '', //검색어
    SCH_PRDCT_TYPE : '', //제품 유형
    SCH_SRVC_TYPE_CD : '', //서비스유형

    // grid
    page: 1,
    pageCount: 0,
    perPage: [15,30,50,100],
    ROW_PER_PAGE: 15,
    pagination: {
      page: 1,
      rowsPerPage: 500,
      sortBy: "REG_DT",
      descending: "DESC"
    }, //그리드 페이지속성정의
    nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
    headers: [
      { text: '번호', value: 'index', align: 'center', width: '80px', sortable : false },
      { text: '접수일', value: 'REG_DT', align: 'left', width: '150px', sortable : true },
      { text: '고객명', value: 'CUST_NM', align: 'left', width: '90px', sortable : false },
      { text: '고객 전화번호', value: 'CUST_TELNO', align: 'left', width: '120px', sortable : false },
      { text: '서비스 유형', value: 'SRVC_TYPE_NM', align: 'left', width: '100px', sortable : false },
      { text: '제품 유형', value: 'UP_PRDCT_NM', align: 'left', width: '100px', sortable : false },
      { text: 'AS 대상 제품', value: 'PRDCT_NM', align: 'left', width: '', sortable : false },
      { text: '상담직원', value: 'CUSL_NM', align: 'left', width: '100px', sortable : false },
      { text: '배정일시', value: 'ALTMNT_DT', align: 'left', width: '150px', sortable : false },
      { text: '예약일시', value: 'RSVT_BGNG_DT', align: 'left', width: '150px', sortable : false },
      { text: 'AS 기사', value: 'VSTR_NM', align: 'left', width: '140px', sortable : false },
      // { text: '구분', value: 'BRANCH_NM', align: 'left', width: '80px', sortable : false },
      { text: '센터', value: 'DEPT_NM', align: 'left', width: '140px', sortable : false },
      { text: '진행상태', value: 'STTS_NM', align: 'left', width: '100px', sortable : false },
      { text: '처리 일시', value: 'STTS_REG_DT', align: 'left', width: '150px', sortable : false },
    ],
    items: [],
    selectedRow:{},
    statList: [
      { code: 'VRS_ALTMNT', name: '배정', value: 'chat-stat-cs' },
      { code: 'VRS_CMPTN', name: '완료', value: 'chat-stat-done' },
      { code: 'VRS_RTRCN', name: '취소', value: 'chat-stat-wait' },
      { code: 'VRS_REVST', name: '재방문', value: 'chat-stat-after' },
    ],

    // detail Modal
    detailModal: false,

    VST_RSVT_HIST_LIST: [],

    dialogTitl:'취소 사유',
    dialogCommonReason: false,
    STTS_DTL_CD:'',
    CN:'',
    REASON_TP_LIST: [],
    imgWidth: .5,
    expandImgUrl: '',
    dialogImgExpand:false,    //이미지 전송창 이미지 확대

    //전화걸기
    OUT_CALL_DATA: {
      CL_TYPE_CD: 'OUT',
      dropItems: [],
      dropItems2: [],
      CUST_PHN_NO: '',
      CLBK_ID: '',
      MODIFY_USE: false,
    },
  }
},

  watch: {
  },

  computed: {

  },

  beforeDestroy(){
    this.$eventBus.$off("reloadVstRsvtList"); //eventBus 중복방지를 위해 off
  },

  async created() {
    this.$eventBus.$on("reloadVstRsvtList", () => {
      this.getVstRsvtHistList();
      // this.getVstRsvtList('');
    });

    //공통코드설정
    let codeName = ['VST_RSVT_STAT', 'AS_SCH_TP', 'CUTT_HIST_SRCH','VRS_ALTMNT', 'VRS_RTRCN', 'VRS_REVST', 'SRVC_TP'];
    this.list_common_code = await this.mixin_common_code_get_all(codeName);

    this.SCH_RSVT_ST_DTS = this.$moment(this.startDate).subtract(7,'days').format('YYYY-MM-DD'); // 예약 검색 시작 일자(일주일전)
    this.SCH_RSVT_END_DTS = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); // 예약 검색 종료 일자

    this.getPrdctTypeList(); //AS 제품 유형 목록 조회
  },

  mounted() {

  },

  methods: {
    //그리드 목록 조회
    async getVstRsvtList(next) {
      this.selectedRow = {};
      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.items = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let convertSchKeyword = this.SCH_KEYWORD;

      if(this.SCH_KEY === 'CUST_PHN_NO') convertSchKeyword = convertSchKeyword.replace(/[^0-9]/g, '');

      let sUrl = '/api/vst/vstRsvtList';
      let postParam = {
        SCH_RSVT_ST_DTS : this.SCH_RSVT_ST_DTS.replace(/-/gi, '')
        , SCH_RSVT_END_DTS : this.SCH_RSVT_END_DTS.replace(/-/gi, '')
        , SCH_STTS_CD : this.SCH_STTS_CD
        , SCH_KEY : this.SCH_KEY
        , SCH_KEYWORD : convertSchKeyword
        , SCH_SRVC_TYPE_CD : this.SCH_SRVC_TYPE_CD
        , SCH_PRDCT_TYPE : this.SCH_PRDCT_TYPE?this.SCH_PRDCT_TYPE.value:''
      }

      let headParam = {
        head : {
          ROW_CNT : this.pagination.rowsPerPage,
          PAGES_CNT : this.pagination.page,
          PAGING : "Y",
        }
      }
      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        //데이터 가공 영역
        response.DATA.forEach((data, idx) => {
        });

        let tempDataText = response.DATA;
        let idx = this.items.length + 1;
        for(let i in tempDataText){
          tempDataText[i]["index"]= idx++;
        }

        this.items = [...this.items, ...tempDataText]
        //다음
        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }

        this.pagination.page += 1;
      }
    },

    //AS 제품 유형 목록 조회
    async getPrdctTypeList() {
      let sUrl = '/api/vst/prdctTypeList';
      let postParam = {
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.prdctTypeIntgeSchData(response.PRDCT_TYPE_TREE); //AS 제품 유형 검색 데이터 Set
      }
    },

    //AS 제품 유형 검색 Data Set
    prdctTypeIntgeSchData(cuttType) {
      cuttType.forEach(item => {
        if (item.UP_PRDCT_TYPE_ID) {
          this.PRDCT_ITEMS.push({ value: item.PRDCT_TYPE_ID, text: item.FULL_PATH, LVL: item.LVL });
        }
        if (item.children) {
          this.prdctTypeIntgeSchData(item.children);
        }
      });
    },

    rowClick(data){
      this.selectedRow = data
      this.detailModal = true;
      this.getVstRsvtHistList();
    },

    selectDetail(data){
      this.detailModal = true;
    },

    schVstRsvtHistList() {
      this.getVstRsvtList('');
    },

    async getVstRsvtHistList(){
      let sUrl = '/api/vst/vstRsvtHistList';
      let postParam = {
        VST_RSVT_ID : this.selectedRow.VST_RSVT_ID
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.VST_RSVT_HIST_LIST = response.DATA;
      }
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item.VST_RSVT_ID === this.selectedRow.VST_RSVT_ID ? "active" : "";
      return activeClass;
    },

    async vstRsvtCancel(item) {
        this.showAlert({
          alertDialogToggle: true
          , msg: '예약을 취소 하시겠습니까?<br>예약 취소시 동시간 배정이 불가할 수 있습니다.'
          , iconClass: 'is-info'
          , type: 'confirm'
          , callYes: () => {
            this.$store.commit("alertStore/hideAlert");
            this.dialogTitl = '취소 사유';
            this.STTS_DTL_CD = 'CANCEL_NOMAL';
            this.REASON_TP_LIST = this.mixin_common_code_get(this.list_common_code, 'VRS_RTRCN');
            this.dialogCommonReason = true;
          }
          , callNo: () => {
            this.$store.commit("alertStore/hideAlert");
          }
        });
      },

      async vstRsvtProc() {
        if(!this.STTS_DTL_CD){
          this.showAlert({alertDialogToggle: true, msg: '사유를 선택해 주세요.', iconClass: 'is-info', type: 'default'});
          return;
        }else{
          if(this.STTS_DTL_CD.indexOf('_ETC') > -1 && !this.CN){
            this.showAlert({alertDialogToggle: true, msg: '사유를 입력해 주세요.', iconClass: 'is-info', type: 'default'});
            return;
          }
        }

        let sUrl = '/api/vst/vstRsvtProc';
        let postParam = {};

        let _this = this;
        Object.keys(_this.selectedRow).forEach(function(key) {
          if(key === 'VST_RSVT_ID' //방문 예약 ID
            || key === 'CUST_NM' //고객명
            || key === 'REL_CD' //관계 코드
            || key === 'CUST_TELNO' //고객 전화번호
            || key === 'SRVC_TYPE_CD' //서비스 종류
            || key === 'PRDCT_TYPE_ID' //AS 제품
            || key === 'ZIP' //우편번호
            || key === 'ADDR' //주소
            || key === 'ADDR_DTL' //상세주소
            || key === 'PRDCT_TYPE_ID' //상품유형
            || key === 'DMND_MTTR' //문의내용
            || key === 'EXCPTN_MTTR' //특이사항
            || key === 'VSTR_ID' //방문자 ID
          ){
            postParam[key] = _this.selectedRow[key];
          }
        });

        postParam.STTS_CD = 'VRS_RTRCN'; //취소
        if(this.STTS_DTL_CD) postParam.STTS_DTL_CD = this.STTS_DTL_CD;
        if(this.CN) postParam.CN = this.CN;

        //SMS 전송용 Param
        postParam.callback_number = this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO.split(',')[0];

        let response  = await this.common_postCall(sUrl, postParam, {head : {}});

        if (!response.HEADER.ERROR_FLAG){
          this.dialogCommonReason = false;
          this.$store.commit("alertStore/hideAlert");
          this.showAlert({alertDialogToggle: true, msg: '취소 처리되었습니다.', iconClass: 'is-info', type: 'default'});
          this.$eventBus.$emit('closeAssignManager');
          this.getVstRsvtHistList();
          try{
            this.selectedRow.STTS_NM = '취소';
            this.selectedRow.STTS_CD = 'VRS_RTRCN';
            this.selectedRow.STTS_DTL_CD = this.STTS_DTL_CD;
          }catch(e){}
        }
      },

      img_expand(img) {
        this.expandImgUrl = img;
        this.imgWidth = 1.5;
        this.mixin_showDialog('ImgExpand')
      },

      callDialog() {
        if(this.selectedRow.VSTR_PHN_NO){
          if(this.$socket){
            this.mixin_set_active_tab({PATH_NM:'/CSL_M0100', NODE_TITLE:'전화상담'});
            this.OUT_CALL_DATA.CUST_PHN_NO = this.mixin_setPhoneNo(this.selectedRow.VSTR_PHN_NO.replace(/[^0-9]/g, ""));
            this.OUT_CALL_DATA.CUST_ID = this.selectedRow.VSTR_ID;
            this.OUT_CALL_DATA.MODIFY_USE = false;

            this.$eventBus.$emit('dialogOutCall', this.OUT_CALL_DATA); //top 전화걸기 호출
          }else{
            this.showAlert({alertDialogToggle: true, msg: 'CTI에 로그인이 되어 있지 않습니다.', iconClass: 'is-caution', type: 'default'});
            return;
          }
        }else{
          this.showAlert({alertDialogToggle: true, msg: '전화번호가 존재하지 않습니다.', iconClass: 'is-caution', type: 'default'});
          return;
        }
      },
  },
}
</script>

<style lang="scss" scoped>

</style>