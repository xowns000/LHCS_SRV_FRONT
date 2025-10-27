<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <!-- <span class="pl-label">
                진행 기간
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <div class="pl-calendar-range-form">
                  <compo-date-picker
                    DateType="dateInput"
                    :DateProp.sync="startDate"/>
                  <span class="pl-unit">~</span>
                  <compo-date-picker
                    DateType="dateInput"
                    :DateProp.sync="endDate"/>
                  <compo-drop-picker
                    :StartDateProp.sync="startDate"
                    :EndDateProp.sync="endDate"
                  />
                </div>
              </div> -->
              <span class="pl-label">
                진행 년도
              </span>
              <div class="pl-desc">
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    :items="cpiYrItems"
                    v-model="CPI_YR"
                    @change="getCpiNm"
                    placeholder="선택하세요"
                  ></v-select>
                </div>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">진행 상태</span>
              <div class="pl-desc">
                <v-select
                  :items="mixin_common_code_get(this.common_code, 'CMPN_ST', '전체')"
                  class="pl-form"
                  @change="getCpiNm"
                  placeholder="선택하세요"
                  v-model="PRGRS_STTS_CD"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">계획 구분</span>
              <div class="pl-desc">
                <v-select
                  :items="mixin_common_code_get(this.common_code, 'CMPN_CL', '전체')"
                  placeholder="선택하세요"
                  v-model="PLAN_SE_CD"
                  @change="getCpiNm"
                  class="pl-form"
                ></v-select>
              </div>
            </div>
            <!-- <div class="pl-form-inline">
              <span class="pl-label">세부 구분</span>
              <div class="pl-desc">
                <v-select
                  :items="dropItems3"
                  class="pl-form"
                ></v-select>
              </div>
            </div> -->
            <div class="pl-form-inline">
              <span class="pl-label">캠페인 명</span>
              <div class="pl-desc">
                <v-select
                  :items="cpiNmItems"
                  v-model="CPI_NM"
                  @change="btnSelectList"
                  placeholder="선택하세요"
                  class="pl-form is-lg"
                ></v-select>
              </div>
            </div>
            <v-btn class="pl-btn is-icon" @click="btnSelectList">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <!-- info -->
      <div class="pl-card">
        <ul class="pl-list-info2">
          <li v-for="item in TOP_INFO" :key="item.id" style="max-width: 250px">
            <span class="pl-list-info-title">{{ item.title }}</span>
            <strong class="pl-list-info-desc" :class="item.class">{{ item.desc }}</strong>
          </li>
        </ul>
      </div>
      <!-- tabs -->
      <v-tabs class="pl-tabs" v-model="tab" >
        <v-tab>캠페인 관리 항목</v-tab>
        <v-tab>대상자({{ gridDataText.length }})</v-tab>
      </v-tabs>
      <div style="height: 556px">
        <v-tabs-items v-model="tab" class="pl-tabs-items">
          <!-- 캠페인 관리 항목-->
          <v-tab-item>
            <div class="pl-cols" style="height: 100%">
              <!-- 드래그 리스트 -->
              <div class="is-col-fix is-vrt" style="width: 820px">
                <div class="pl-card" style=" overflow: auto; ">
                  <div class="pl-drag-list">
                    <div class="pl-drag-list-top">
                      <p>전체 <strong>({{ DRAG_LIST.length }})</strong>개의 상담 정보 항목이 있습니다.</p>
                    </div>
                    <div class="pl-drag-list-content">
                      <draggable
                        ghost-class="ghost"
                        v-model="DRAG_LIST"
                        @start="onDragStart"
                        @end="onDragEnd"
                        >
                        <div
                          v-for="item in DRAG_LIST"
                          :key="item.id"
                          @click="getExpsnAttrDetailInfo(item)"
                          class="pl-drag-list-unit"
                          :class="item.selected ? 'active' : ''"
                        >
                          <v-icon class="pl-icon20" :class="`parts-${item.type}`"></v-icon>
                          <span class="pl-drag-list-title">{{ item.EXPSN_ATTR_NM }}</span>
                          <span :class="item.SYS_BSC_YN === 'N' ? 'is-txt-main' : ''">{{ displayOwner(item.SYS_BSC_YN) }} </span>
                          <span v-show="item.USE_YN === 'N'" class="pl-1 is-txt-error"> - {{ displayDisabled(item.USE_YN) }}</span>
                          <div class="is-right">
                            <v-icon
                              v-if="item.SYS_BSC_YN === 'Y'"
                              class="pl-icon20"
                              :class="displayLock(item.MDFCN_PSBLTY_YN)"></v-icon>
                            <template v-else-if="fSttsCd === 'PRPARG'">
                              <!-- 수정 버튼 -->
                              <!-- <compo-tooltip-btn
                                TitleProp="수정"
                                ClassProp="pl-tooltip-btn"
                                IconProp="pl-icon20 edit"
                                TooltipPositionProp="bottom"
                                @btnClick="mixin_testLog('수정')"
                              ></compo-tooltip-btn> -->
                              <!-- 삭제 버튼 -->
                              <compo-tooltip-btn
                                TitleProp="삭제"
                                ClassProp="pl-tooltip-btn"
                                IconProp="pl-icon20 trash"
                                TooltipPositionProp="bottom"
                                @btnClick="delAttrBtn"
                              ></compo-tooltip-btn>
                            </template>
                          </div>
                        </div>
                      </draggable>
                    </div>

                  </div>
                </div>
                <div class="pl-card is-bottom">
                  <div class="is-right">
                    <v-btn
                      :disabled="CPI_NM === '' || this.fSttsCd !== 'PRPARG' ?true:false"
                      class="pl-btn is-sub" @click="addDragItem">항목추가</v-btn>
                  </div>
                </div>

              </div>
              <!-- 상세정보 입력 -->
              <div class="is-vrt">
                <div class="pl-card">
                  <p>관리항목별 상세 속성을 <strong>지정하시고 [저장] 버튼을 클릭</strong>하십시오.</p>
                </div>
                <div class="pl-card is-noborder" style="overflow: auto;">
                  <div class="pl-card-form-body mt-0">
                    <v-form ref="detailForm">
                      <div class="pl-form-inline-wrap vertical">
                        <div class="pl-form-inline">
                          <span class="pl-label">
                            항목 명
                            <v-icon class="pl-icon20 required"></v-icon>
                          </span>
                          <div class="pl-desc">
                            <v-text-field
                              class="pl-form flex-grow-1"
                              v-model="DTL_EXPSN_ATTR_NM"
                              v-bind:disabled="isDisabled"
                              :rules="deatilValidateRules.EXPSN_ATTR_NM"
                            />
                            <div>
                              <!-- 상세 버튼 -->
                              <compo-tooltip-btn
                                v-if="isAttrDisabled || fSttsCd !== 'PRPARG' ?false:true"
                                TitleProp="상세"
                                ClassProp="pl-tooltip-btn"
                                IconProp="pl-icon20 detail"
                                TooltipPositionProp="bottom"
                                @btnClick="dropFindParts = true"
                              ></compo-tooltip-btn>
                              <!-- 상세 모달 -->
                              <v-slide-y-transition>
                                <div class="pl-drop-layer is-right" v-if="dropFindParts === true" v-click-outside="closeDropFindParts">
                                  <div class="pl-drop-layer-body">
                                    <ul class="pl-drop-layer-list">
                                      <li @click="expsnAttrFind(true)">
                                        <v-icon class="pl-icon20 in-search mr-2"></v-icon>
                                        항목명 찾기</li>
                                        <li @click="expsnAttrFind(false)">
                                        <v-icon class="pl-icon20 edit mr-2"></v-icon>
                                        직접 입력</li>
                                    </ul>
                                  </div>
                                </div>
                              </v-slide-y-transition>
                              <!-- 확장 항목 찾기 모달 -->
                              <v-dialog
                                v-model="dialogFindParts"
                                content-class="dialog-draggable is-lg is-nopadding"
                                hide-overlay>
                                <div class="draggable-area">drag area</div>
                                <compo-dialog
                                  header-title="확장 항목 찾기"
                                  @hide="mixin_hideDialog('FindParts')"
                                >
                                  <template slot="body">
                                    <!-- component -->
                                    <compo-find-parts
                                      :SearchInputProp.sync="SCH_SE"
                                      :exceptionList="DRAG_LIST"
                                      @selected-expsnAttr="setExpsnAttrItem"
                                    />
                                  </template>
                                </compo-dialog>
                              </v-dialog>
                            </div>
                            <p class="pl-form-hint">한글과 영문을 혼합하여 사용할 수 있습니다.</p>
                          </div>
                        </div>
                        <div class="pl-form-inline">
                          <span class="pl-label">
                            항목 ID
                            <v-icon class="pl-icon20 required"></v-icon>
                          </span>
                          <div class="pl-desc">
                            <v-text-field
                              class="pl-form "
                              v-model="DTL_EXPSN_ATTR_COL_ID"
                              :disabled="DTL_SYS_BSC_YN ==='Y' || isAttrDisabled?true:false"
                              :rules="deatilValidateRules.EXPSN_ATTR_COL_ID"
                              oninput="javascript: this.value = this.value.replace(/[^a-zA-Z0-9._-\s]/g,'').replace(/\s/g, '_');"
                              v-byte-counter="60"
                            />
                            <v-btn
                              v-if="DTL_SYS_BSC_YN ==='N' && !isAttrDisabled?true:false"
                              class="pl-btn is-sub flex-grow-0"
                              @click="attrColIdDupleChk"
                            >중복체크
                            </v-btn>
                            <p class="pl-form-hint">시스템 기본 항목 또는 직접 지정하여 사용할 수 있습니다.(영문자만 사용 가능)</p>
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
                              v-model="DTL_DATA_TYPE_CD"
                              :disabled="DTL_SYS_BSC_YN ==='Y' || isAttrDisabled?true:false"
                              @change="dataTypeChange"
                              placeholder="선택하세요"
                              :rules="deatilValidateRules.DATA_TYPE_CD"
                            ></v-select>
                            <p class="pl-form-hint">시스템 기본 항목을 지정한 경우 자동으로 설정됩니다.</p>
                            <v-text-field
                              v-show="DTL_DATA_TYPE_CD === 'COE' || DTL_DATA_TYPE_CD === 'COE_MULTI'"
                              class="pl-form flex-grow-0 is-lg"
                              value="coomon code 찾은거"
                              disabled
                              v-model="DTL_GROUP_CD_NM"
                            />
                            <!-- 코드 검색 버튼 -->
                            <compo-tooltip-btn
                              v-if="(DTL_DATA_TYPE_CD === 'COE' || DTL_DATA_TYPE_CD === 'COE_MULTI') && DTL_SYS_BSC_YN === 'N' &&  fSttsCd === 'PRPARG'"
                              TitleProp="코드 검색"
                              ClassProp="pl-tooltip-btn flex-grow-0"
                              IconProp="pl-icon20 find-code"
                              TooltipPositionProp="bottom"
                              @btnClick="mixin_showDialog('FindIndex')"
                            ></compo-tooltip-btn>
                            <!-- 공통코드 찾기 모달 -->
                            <v-dialog
                              v-model="dialogFindIndex"
                              content-class="dialog-draggable is-lg is-nopadding"
                              hide-overlay>
                              <div class="draggable-area">drag area</div>
                              <compo-dialog
                                header-title="공통코드 찾기"
                                @hide="mixin_hideDialog('FindIndex')"
                              >
                                <template slot="body">
                                  <!-- component -->
                                  <compo-find-Index
                                    @fidnBtn="mixin_testLog('공통 코드 찾기 버튼')"
                                    @selected-commCd="setCommCdItem"
                                  />
                                </template>
                              </compo-dialog>
                            </v-dialog>
                          </div>
                        </div>
                        <div class="pl-form-inline">
                          <span class="pl-label">
                            항목 길이
                            <v-icon class="pl-icon20 required"></v-icon>
                          </span>
                          <div class="pl-desc">
                            <v-text-field
                              class="pl-form"
                              v-model="DTL_DATA_LEN"
                              :disabled="DTL_SYS_BSC_YN ==='Y'?true:false"
                              :rules="deatilValidateRules.DATA_LEN"
                              hide-spin-buttons
                              type="number"
                              oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                              v-byte-counter="3"
                            ></v-text-field>
                            <p class="pl-form-hint">시스템 기본 항목을 지정한 경우 자동으로 설정됩니다.</p>
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
                              v-model="DTL_ESNTL_YN"
                              :disabled="DTL_SYS_BSC_YN ==='Y'?true:false"
                              placeholder="선택하세요"
                              :rules="deatilValidateRules.ESNTL_YN"
                            ></v-select>
                            <p class="pl-form-hint">상담화면에서 고객 정보 입력 또는 수정 시 필수 입력 여부를 설정할 수 있습니다.</p>
                          </div>
                        </div>
                        <div class="pl-form-inline">
                          <span class="pl-label">
                            사용 유무
                            <v-icon class="pl-icon20 required"></v-icon>
                          </span>
                          <div class="pl-desc">
                            <v-select
                              class="pl-form"
                              :items="mixin_common_code_get(this.common_code, 'USE_WT')"
                              v-model="DTL_USE_YN"
                              :disabled="DTL_MDFCN_PSBLTY_YN ==='N'?true:false"
                              placeholder="선택하세요"
                              :rules="deatilValidateRules.USE_YN"
                            ></v-select>
                            <p class="pl-form-hint">해당 항목을 사용하거나 사용하지 않도록 설정합니다.</p>
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
                              v-model="DTL_SCRN_EXPSR_YN"
                              :disabled="DTL_MDFCN_PSBLTY_YN ==='N'?true:false"
                              placeholder="선택하세요"
                              :rules="deatilValidateRules.SCRN_EXPSR_YN"
                            ></v-select>
                            <p class="pl-form-hint">그리드 헤더 노출 여부를 사용하거나 사용하지 않도록 설정합니다.</p>
                          </div>
                        </div>
                        <!-- <div class="pl-form-inline">
                          <span class="pl-label">
                            설명
                            <v-icon class="pl-icon20 required"></v-icon>
                          </span>
                          <div class="pl-desc">
                            <v-textarea
                              class="pl-form is-noresize"
                              v-model="DTL_EXPSN_ATTR_EXPLN"
                              :disabled="DTL_SYS_BSC_YN ==='Y'?true:false"
                              placeholder="필요한 경우 항목에 대한 부가 설명을 입력하세요."
                              :rules="deatilValidateRules.DTL_EXPSN_ATTR_EXPLN"
                              :spellcheck="false"
                            />
                          </div>
                        </div> -->
                      </div>
                    </v-form>
                  </div>
                </div>
                <div class="pl-card is-bottom">
                  <div class="is-right">
                    <v-btn class="pl-btn"
                      :disabled="DTL_MDFCN_PSBLTY_YN ==='N' || CPI_NM === '' || this.fSttsCd !== 'PRPARG' ?true:false"
                      @click="expsnAttrValidate"
                      >저장</v-btn>
                  </div>
                </div>
              </div>
            </div>
          </v-tab-item>
          <!-- 대상자 -->
          <v-tab-item>
            <div class="pl-card">
              <div class="pl-grid-top">
                <div class="pl-grid-top-left">
                  <v-btn class="pl-btn is-icon is-sub" @click="btnExUpload" :disabled="fSttsCd !== 'PRPARG'">
                    <span class="pl-icon20 excelup"></span>
                    엑셀 업로드
                  </v-btn>
                  <v-file-input
                    v-show="false"
                    ref="excelRef"
                    @change="uploadExcel($event, gridDataHeaders)"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    counter
                    label="엑셀파일을 선택하세요"
                    :show-size="1000"
                  />
                  <v-btn class="pl-btn is-icon is-sub" @click="btnExDownLoad" :disabled="fSttsCd !== 'PRPARG'">
                    <span class="pl-icon20 exceltemplate"></span>
                    엑셀 양식 다운로드
                  </v-btn>
                  <v-btn class="pl-btn is-icon is-sub" @click="uploadSave" :disabled="fSttsCd !== 'PRPARG'">
                    <span class="pl-icon20 save"></span>
                    저장
                  </v-btn>
                  <!-- <v-btn class="pl-btn is-icon is-sub" @click="targetCustExport" :disabled="fSttsCd !== 'PRPARG'">
                    <span class="pl-icon20 save"></span>
                    대상자 추출
                  </v-btn> -->
                </div>
                <div class="pl-grid-top-utils">
                  <span class="pl-counter">전체 <em class="pl-1">({{ gridDataText.length }})</em> 건</span>
                  <!-- 엑셀 다운로드 버튼 -->
                  <compo-excel
                    TypeProp="Download"
                    :DownReason=true
                    :DataHeaderProp="gridDataHeaders"
                    :DataBodyProp="gridDataText"
                    :FileNameProp="EXCEL_DOWN_NM+'_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                    :SheetNameProp="EXCEL_DOWN_NM"
                    HeaderColorProp="00B0F0"
                  ></compo-excel>
                </div>
              </div>
              <v-data-table
                class="pl-grid"
                :headers="gridDataHeaders"
                :items="gridDataText"
                fixed-header
                item-key="index"
                height="452px"
                :items-per-page="ROW_PER_PAGE"
                hide-default-footer
                :page.sync="page"
                no-data-text="등록된 데이터가 없습니다."
                @page-count="pageCount = $event">
                <template v-slot:item.CUST_NM="{ item }">
                  {{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(item.CUST_NM) : item.CUST_NM }}
                </template>
                <template v-slot:item.CUST_PHN_NO="{ item }">
                  {{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(item.CUST_PHN_NO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(item.CUST_PHN_NO.replace(/[^0-9]/g, "")) }}
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

                <span class="pl-pager-period">보기 {{ mixin_getPagePeriod(gridDataText, page) }} / {{ gridDataText.length }}
                  <compo-tooltip-btn
                    TitleProp="다음 검색"
                    ClassProp="pl-tooltip-btn is-line"
                    IconProp="pl-icon20 arrow-next-paging"
                    TooltipPositionProp="bottom"
                    :DisabledProp="nextDisabled"
                    @btnClick="tab2SelectList('true')"
                  ></compo-tooltip-btn>
                  <!-- <v-btn
                    class="pl-btn is-sub"
                    :disabled = "nextDisabled"
                    @click="tab2SelectList(true)"
                  >다음 검색
                  </v-btn> -->
                </span>
              </div>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </div>
      <v-dialog
        v-model="dialogCustExport"
        content-class="dialog-draggable is-lg is-nopadding"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="캠페인 대상 추출"
          @hide="mixin_hideDialog('CustExport')"
        >
          <template slot="body">
            <!-- component -->
            <compo-custExport
            />
          </template>
        </compo-dialog>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
export default {
    name:"MENU_CSL_M0502", //name은 'MENU_' + 파일명 조합

 components: {

  },
 data() {
    return {
      tab: null,
      // drop
      dropFindParts: false,
      cpiYrItems: [],
      cpiNmItems: [],
      common_code: [],

      // top search
      dropItems3: [],

      // info
      TOP_INFO: [],

      // drag list
      DRAG_LIST : [],

      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      }, //그리드 페이지속성정의
      nextDisabled:true,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
      // 대상자
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
      gridDataHeaders: [],
      gridDataText: [],

      CPI_YR : '',
      CPI_NM : '',
      PRGRS_STTS_CD : '',
      PLAN_SE_CD : '',

      //상담내용 항목 상세 정보
      DTL_ATTR_ID : '',
      DTL_LNKG_ATTR_ID : '',
      DTL_EXPSN_ATTR_NM : '',
      DTL_EXPSN_ATTR_COL_ID : '',
      DTL_GROUP_CD_ID : '',
      DTL_GROUP_CD_NM : '',
      DTL_DATA_TYPE_CD : '',
      DTL_DATA_LEN : '',
      DTL_SYS_BSC_YN : 'N',
      DTL_MDFCN_PSBLTY_YN : '',
      DTL_ESNTL_YN : '',
      DTL_USE_YN : '',
      DTL_SCRN_EXPSR_YN : '',
      DTL_SORT_ORD : 0,
      DTL_EXPSN_ATTR_EXPLN : '',

      isAttrDisabled:false,
      isDataLenDisabled:false,
      isDisabled: true, //항목명 disabled 처리
      SCH_SE : 'CAMP', //상담내용 확장항목만 찾기위해
      dialogFindParts: '', //확장항목 찾기
      dialogFindIndex: '', //공통코드 찾기
      fCustList: false,   //관리항목 데이터 건수 조회여부

      fSttsCd: 'PRPARG',
      uploadFlag : false,

      deatilValidateRules: {
        EXPSN_ATTR_NM: [
          v => !!v || '항목명 은(는) 필수 입력 항목 입니다.',
        ],
        EXPSN_ATTR_COL_ID: [
          v => !!v || '항목ID 은(는) 필수 입력 항목 입니다.',
        ],
        DATA_TYPE_CD: [
          v => !!v || '속성 은(는) 필수 입력 항목 입니다.',
        ],
        DATA_LEN :[
          v => !!v || '길이 은(는) 필수 입력 항목 입니다.',
          v => /[0-9]/.test(v) || '숫자만 입력 가능합니다.',
          v => (v >= 0 && v < 501 ) || '0 ~ 500 이내로 입력해 주세요.',
        ],
        ESNTL_YN: [
          v => !!v || '필수여부 은(는) 필수 입력 항목 입니다.',
        ],
        USE_YN: [
          v => !!v || '사용여부 은(는) 필수 입력 항목 입니다.',
        ],
        SCRN_EXPSR_YN: [
          v => !!v || '그리드 노출 여부 은(는) 필수 입력 항목 입니다.',
        ],
        DTL_EXPSN_ATTR_EXPLN: [
          v => !!v || '설명 은(는) 필수 입력 항목 입니다.',
        ],
      },

      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
          REG : {alertDialogToggle: true, msg: '저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.expsnAttrSave, callNo: this.closeMsg}
          , MOD : {alertDialogToggle: true, msg: '수정하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.setQuSaveYes, callNo: this.closeMsg}
          , DEL : {alertDialogToggle: true, msg: '삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.expsnAttrDel, callNo: this.closeMsg}
          , REG_TAB2 : {alertDialogToggle: true, msg: '업로드된 데이터를 저장하시겠습니까?<br>(기존 데이터는 삭제됩니다.)', iconClass: 'is-info', type: 'confirm', callYes: this.setUploadData, callNo: this.closeMsg}
        },
        ALERT : {
          DEL_SUCCESS : {alertDialogToggle: true, msg: '삭제가 완료되었습니다', iconClass: 'is-info', type: 'default'}
          , REG_SUCCESS : {alertDialogToggle: true, msg: '저장이 완료되었습니다', iconClass: 'is-info', type: 'default'}
          , MOD_SUCCESS : {alertDialogToggle: true, msg: '수정이 완료되었습니다', iconClass: 'is-info', type: 'default'}

          , ETC1_WARNING : {alertDialogToggle: true, msg: '캠페인명을 선택해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC2_WARNING : {alertDialogToggle: true, msg: '관리항목을 등록해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC3_WARNING : {alertDialogToggle: true, msg: '데이터를 업로드 해주세요.', iconClass: 'is-info', type: 'default'}
          , ETC4_WARNING : {alertDialogToggle: true, msg: '', iconClass: 'is-info', type: 'default'}
          , ETC5_WARNING : {alertDialogToggle: true, msg: '준비중인 캠페인만 가능합니다.', iconClass: 'is-info', type: 'default'}
          , ETC6_WARNING : {alertDialogToggle: true, msg: '단일 선택형인 경우 코드선택은 필수 입니다.', iconClass: 'is-info', type: 'default'}
          , ETC7_WARNING : {alertDialogToggle: true, msg: '배분되어있는 항목이 존재하여 처리할 수 없습니다.', iconClass: 'is-info', type: 'default'}
          , ETC8_WARNING : {alertDialogToggle: true, msg: '전화상담이 이루어진 고객이 존재하여 처리할 수 없습니다.', iconClass: 'is-info', type: 'default'}
          , ETC9_WARNING : {alertDialogToggle: true, msg: '먼저 업로드를 진행해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC10_WARNING : {alertDialogToggle: true, msg: '중복된 전화번호가 존재합니다.', iconClass: 'is-info', type: 'default'}
          , ATTR_COL_ID_EMPTY_CHECK : {alertDialogToggle: true, msg: '항목 ID를 입력해 주세요.', iconClass: 'is-caution', type: 'default'}
          , ATTR_COL_ID_DUPLE_CHECK : {alertDialogToggle: true, msg: '항목 ID에 대해 중복체크를 진행해 주세요.', iconClass: 'is-caution', type: 'default'}
          , ATTR_COL_ID_DUPLE_TRUE : {alertDialogToggle: true, msg: '사용중인 항목 ID 입니다.', iconClass: 'is-caution', type: 'default'}
          , ATTR_COL_ID_DUPLE_FAIL : {alertDialogToggle: true, msg: '사용 가능한 항목 ID 입니다.', iconClass: 'is-caution', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST : {
          DEL_SUCCESS :  {  msg: '삭제가 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          , REG_SUCCESS :{  msg: '저장이 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        }
      },

      EXCEL_DOWN_NM : '',
      EXPSN_ATTR_COL_ID_DUPLE_CHK: false,

      dialogCustExport : false,
    }
  },

  watch: {

  },

  computed: {

  },

  async created() {
    //공통코드설정
    let codeName = [
                     'CMPN_ST'
                    ,'CMPN_CL'
                    ,'CUSL_TP_LV'
                    ,'CUSL_TP_CL'
                    ,'USE_WT'
                    ,'EXPN_PT'
                    ,'REQR_WT'
                  ];

    this.common_code = await this.mixin_common_code_get_all(codeName, 'Y');
    //문자형, 숫자형, 단일선택형을 제외한 코드는 모두 삭제한다.
    for(let i=0; i<this.common_code.length; i++){
      if(this.common_code[i].group_cd === 'EXPN_PT'){
        let len = this.common_code[i].group_value.length;
        let idx = 0;
        for(let j=0; j<len; j++) {
          if(this.common_code[i].group_value[idx].CD !== 'TXT' &&
            this.common_code[i].group_value[idx].CD !== 'NUM' &&
            this.common_code[i].group_value[idx].CD !== 'COE' &&
            this.common_code[i].group_value[idx].CD !== 'COE_MULTI')
          {
            this.common_code[i].group_value.splice(idx,1);
          }
          else
          {
            idx++;
          }
        }
        break;
      }
    }

    //진행년도 설정(금년기준 -5, +5)
    const date = new Date();
    const curYear = date.getFullYear();
    this.cpiYrItems.push({ text: '전체', value: '' });   // default
    for (let i = -5; i < 5; i++) {
      this.cpiYrItems.push({ text: `${curYear + i}년`, value: (curYear + i).toString() });
    }
    this.CPI_YR =  curYear.toString();
  },

  mounted() {
    this.fCustList = false;
    this.DRAG_LIST = [];
    this.PRGRS_STTS_CD = 'PRPARG';    // 기본 준비중으로 선택
    this.tab1Init();
    this.tab2Init();
    //설문조사콤보박스 조회
    this.getCpiNm();
  },

  methods: {
    closeDropFindParts() {
      this.dropFindParts = false;
    },
    //버튼정보 초기화
    displayOwner(item) {
      return item === 'Y' ? '(시스템 기본항목)' : '(사용자 확장항목)'
    },
    displayDisabled(item) {
      return item === 'N' ? '사용안함' : ''
    },
    displayLock(item) {
      return item === 'N' ? 'list-lock' : 'list-unlock'
    },
    //validate check
    detailValidate () {
      return this.$refs.detailForm.validate();
    },
    formReset(){
      //프로퍼티가 로드전에 호출되는 case가 있음.
      if(this.$refs.detailForm) this.$refs.detailForm.resetValidation();
    },
    addDragItem() {
      if(this.chkValid('4')) return;

      this.tab1Init();
      this.DTL_SORT_ORD = this.DRAG_LIST.length + 1;
    },
    onDragStart(event) {
      // console.log('Drag started');
      // console.log('Event:', event);
      // Additional logic for drag start
    },
    async onDragEnd(event) {
      if(this.chkValid('4')) return;

      let arrAttrId = [];
      for (let value of this.DRAG_LIST) {
        arrAttrId.push(value.ATTR_ID);
      }

      let sUrl = '/phone-api/campaign/custmng/reorderattrcustmng';
      let postParam = {
        arrAttrId : arrAttrId
      }

      const headParam = {
        head: {
          'SERVICE' : 'phone.campaign.custmng.reorderattrcustmng',
          'METHOD' : 'reorderattrcustmng',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.tab1SelectList();
      }
    },
    getIconClassNm(data) {
      let classNm = 'string';
      if(data === 'TXT') classNm = 'string'; //문자형
      else if(data === 'NUM') classNm = 'number'; //숫자형
      else if(data === 'NUM_COMMA') classNm = 'number'; //숫자형(',' 포함)
      else if(data === 'COE') classNm = 'check'; //단일선택형
      else if(data === 'COE_MULTI') classNm = 'check'; //다중선택형
      else if(data === 'DAT') classNm = 'date'; //날짜형
      else if(data === 'POST') classNm = 'post'; //우편번호
      else if(data === 'HASH') classNm = 'hashtag'; //해시태그

      return classNm;
    },
    getExpsnAttrDetailInfo(item){
      this.isDisabled = true;
      this.isAttrDisabled = true;
      this.DRAG_LIST.forEach((listItem) => {
        listItem.selected = false;
      });
      item.selected = true;

      this.DTL_ATTR_ID = item.ATTR_ID;
      this.DTL_EXPSN_ATTR_NM = item.EXPSN_ATTR_NM;
      this.DTL_EXPSN_ATTR_COL_ID = item.EXPSN_ATTR_COL_ID;
      this.DTL_DATA_TYPE_CD = item.DATA_TYPE_CD;
      this.DTL_DATA_LEN = item.DATA_LEN;
      this.DTL_GROUP_CD_ID = item.GROUP_CD_ID;
      this.DTL_GROUP_CD_NM = item.GROUP_CD_NM;
      this.DTL_SYS_BSC_YN = item.SYS_BSC_YN;
      this.DTL_MDFCN_PSBLTY_YN = item.MDFCN_PSBLTY_YN;
      this.DTL_ESNTL_YN = item.ESNTL_YN;
      this.DTL_USE_YN = item.USE_YN;
      this.DTL_SCRN_EXPSR_YN = item.SCRN_EXPSR_YN;
      this.DTL_SORT_ORD = item.SORT_ORD;
      this.DTL_EXPSN_ATTR_EXPLN = item.EXPSN_ATTR_EXPLN;
      this.EXPSN_ATTR_COL_ID_DUPLE_CHK = item.SYS_BSC_YN==='Y'?true:item.MDFCN_PSBLTY_YN === 'N'?true:false;
    },
    //확장속성 찾기 선택
    setExpsnAttrItem(selectedItem) {

      this.DTL_LNKG_ATTR_ID = selectedItem.ATTR_ID;
      this.DTL_EXPSN_ATTR_NM = selectedItem.EXPSN_ATTR_NM;
      this.DTL_EXPSN_ATTR_COL_ID = selectedItem.EXPSN_ATTR_COL_ID;
      this.DTL_DATA_TYPE_CD = selectedItem.DATA_TYPE_CD;
      this.DTL_DATA_LEN = selectedItem.DATA_LEN;
      this.DTL_ESNTL_YN = selectedItem.ESNTL_YN;
      this.DTL_USE_YN = selectedItem.USE_YN;
      this.DTL_SCRN_EXPSR_YN = selectedItem.SCRN_EXPSR_YN;
      this.DTL_EXPSN_ATTR_EXPLN = selectedItem.EXPSN_ATTR_EXPLN;

      // this.isAttrDisabled = true; //항목id 비활성화
      this.isDataTpDisabled = true;

      this.mixin_hideDialog('FindParts');
    },
    //등록 수정
    async expsnAttrSave() {
      let sUrl = '/phone-api/campaign/custmng/upsertattrcustmng';
      let postParam = {
        ATTR_ID : this.DTL_ATTR_ID
        , SE : this.SCH_SE //상담내용
        , LNKG_ATTR_ID : this.DTL_LNKG_ATTR_ID
        , EXPSN_ATTR_NM : this.DTL_EXPSN_ATTR_NM
        , EXPSN_ATTR_COL_ID : this.DTL_EXPSN_ATTR_COL_ID
        , EXPSN_ATTR_EXPLN : this.DTL_EXPSN_ATTR_EXPLN
        , DATA_TYPE_CD : this.DTL_DATA_TYPE_CD
        , DATA_LEN : (this.DTL_DATA_TYPE_CD === 'COE' || this.DTL_DATA_TYPE_CD === 'COE_MULTI')?60:this.DTL_DATA_LEN
        , GROUP_CD_ID : this.DTL_GROUP_CD_ID
        , ESNTL_YN : this.DTL_ESNTL_YN
        , USE_YN : this.DTL_USE_YN
        , SCRN_EXPSR_YN : this.DTL_SCRN_EXPSR_YN
        , BSC_PVSN_ATTR_YN : 'N'
        , SYS_BSC_YN : 'N'
        , MDFCN_PSBLTY_YN : 'Y'
        , CPI_ID : this.CPI_NM
      }

      const headParam = {
        head: {
          'SERVICE' : 'phone.campaign.custmng.upsertattrcustmng',
          'METHOD' : 'upsertattrcustmng',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.closeMsg();
        // this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS);
        this.showToast(this.MESSAGE.TOAST.REG_SUCCESS);

        this.tab1SelectList();
        this.tab2SelectList(false);
        this.EXPSN_ATTR_COL_ID_DUPLE_CHK = false;
      }
    },
    dataTypeChange () {
      if(this.DTL_DATA_TYPE_CD === 'COE' || this.DTL_DATA_TYPE_CD === 'COE_MULTI'){
        this.isDataLenDisabled = true;
        this.DTL_DATA_LEN = 60;
      }else{
        this.DTL_GROUP_CD_ID = '';
        this.DTL_GROUP_CD_NM = '';
        this.isDataLenDisabled = false;
        this.DTL_DATA_LEN = '';
      }
    },
    //공통코드 찾기 선택
    setCommCdItem(selectedItem) {
      this.DTL_GROUP_CD_NM = selectedItem.CD_NM;
      this.DTL_GROUP_CD_ID = selectedItem.CD_ID;
      this.isDataLenDisabled = true;
      this.DTL_DATA_LEN = 60;

      this.mixin_hideDialog('FindIndex');
    },
    expsnAttrFind(flag) {
      if (flag) {
        this.mixin_showDialog('FindParts');
      } else {
        // console.log('직접 입력');
        this.tab1Init();
      }
      this.isDisabled = flag;
      this.dropFindParts = false;
    },
    uploadSave(){
      if(this.chkValid('0')) return;
      if(this.chkValid('2')) return;
      if(this.chkValid('3')) return;
      if(this.chkValid('4')) return;
      if(!this.uploadFlag){
        this.showAlert(this.MESSAGE.ALERT.ETC9_WARNING);
        return;
      }

      this.showAlert(this.MESSAGE.CONFIRM.REG_TAB2);
    },
    async setUploadData(){
      const sUrl = '/phone-api/campaign/custmng/uploadexcelcustmng';
        const postParam = {
          sendData: {}
        }
        const headParam = {
          head: {
            'SERVICE' : 'phone.campaign.custmng.uploadexcelcustmng',
            'METHOD' : 'uploadexcelcustmng',
            'TYPE' : 'BIZ_SERVICE',
          }
        }

        postParam.sendData["oData"] = this.gridDataText;

        let resData = await this.common_postCall(sUrl, postParam.sendData, headParam );

        if (resData.HEADER.ERROR_FLAG)
        {
          this.setErrMsg(resData);
        }
        else
        {
          this.closeMsg();
          // this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS);
          this.showToast(this.MESSAGE.TOAST.REG_SUCCESS);
          this.tab2SelectList(false);
        }
    },
    expsnAttrValidate() {
      if(this.chkValid('4')) return;
      //단일선택이고 코드선택을 안했다면
      if(this.DTL_DATA_TYPE_CD === 'COE' || this.DTL_DATA_TYPE_CD === 'COE_MULTI'){
        if(this.mixin_isEmpty(this.DTL_GROUP_CD_NM)){
          this.showAlert(this.MESSAGE.ALERT.ETC6_WARNING);
          return;
        }
      }
      if (!this.detailValidate()) {
        return;
      }

      if(!this.DTL_ATTR_ID && !this.EXPSN_ATTR_COL_ID_DUPLE_CHK){
        this.showAlert(this.MESSAGE.ALERT.ATTR_COL_ID_DUPLE_CHECK);
        return;
      }

      this.showAlert(this.MESSAGE.CONFIRM.REG);
    },
    delAttrBtn(){
      if(this.chkValid('4')) return;
      this.showAlert(this.MESSAGE.CONFIRM.DEL)
    },
    //상담내용 항목 삭제
    async expsnAttrDel() {
      let sUrl = '/phone-api/campaign/custmng/deleteattrcustmng';
      let postParam = {
        arrAttrId: this.DTL_ATTR_ID,
      }

      const headParam = {
        head: {
          'SERVICE' : 'phone.campaign.custmng.deleteattrcustmng',
          'METHOD' : 'deleteattrcustmng',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);

      if (!resData.HEADER.ERROR_FLAG){
        this.closeMsg();
        // this.showAlert(this.MESSAGE.ALERT.DEL_SUCCESS);
        this.showToast(this.MESSAGE.TOAST.DEL_SUCCESS);
        this.tab1SelectList();
        this.$refs.detailForm.reset();
      }
    },
    init(){
      this.TOP_INFO = [
        {
          title: '아웃바운드 명',
          desc: '　',     // 높이때문에 일부로 공백줌
          class: '',
        },
        {
          title: '진행기간',
          desc: '',
          class: '',
        },
        {
          title: '계획 회 차',
          desc: '',
          class: '',
        },
        {
          title: '진행상태',
          desc: '',
          class: 'is-txt-main',
        },
        {
          title: '등록자',
          desc: '',
          class: '',
        },
        {
          title: '등록일',
          desc: '',
          class: '',
        },
      ];
    },
    tab1Init(){
      this.formReset();
      this.isAttrDisabled = false;
      this.isDataLenDisabled = false;
      this.isDisabled = true;
      this.DTL_EXPSN_ATTR_NM = '';
      this.DTL_ATTR_ID = '';
      this.DTL_LNKG_ATTR_ID = '';
      this.DTL_EXPSN_ATTR_COL_ID = '';
      this.DTL_GROUP_CD_ID = '';
      this.DTL_GROUP_CD_NM = '';
      this.DTL_DATA_TYPE_CD = '';
      this.DTL_DATA_LEN = '';
      this.DTL_SYS_BSC_YN = 'N';
      this.DTL_MDFCN_PSBLTY_YN = '';
      this.DTL_ESNTL_YN = '';
      this.DTL_USE_YN = '';
      this.DTL_SCRN_EXPSR_YN = '';
      this.DTL_SORT_ORD = 0;
      this.DTL_EXPSN_ATTR_EXPLN = '';
    },
    tab2Init(){
      this.gridDataHeaders = [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px' },
        { text: '고객명', value: 'CUST_NM', align: 'center', width: '100px' },
        { text: '고객전화번호', value: 'CUST_PHN_NO', align: 'center', width: '200px' },
      ];
      this.gridDataText = [];
      this.uploadFlag = false;
    },
    //설문명 콤보박스 조회
    async getCpiNm(){
      const sUrl = '/phone-api/campaign/custmng/selectcombocpicustmng';
      const postParam = {
        CPI_YR : this.CPI_YR             //진행년도
        ,PRGRS_STTS_CD : this.PRGRS_STTS_CD         //진행상태
        ,PLAN_SE_CD : this.PLAN_SE_CD        //계획구분
      }
      const headParam = {
        head: {
          'SERVICE' : 'phone.campaign.custmng.selectcombocpicustmng',
          'METHOD' : 'selectcombocpicustmng',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {
        this.init();
        this.CPI_NM = '';
        this.cpiNmItems = resData.DATA.map(item => ({ text: item.TEXT, value: item.VALUE }));
        if (this.cpiNmItems.length > 0) this.CPI_NM = resData.DATA[0].VALUE;
      }
      if(!this.mixin_isEmpty(this.CPI_NM)) this.btnSelectList();
    },
    //조회버튼클릭
    async btnSelectList(){
      if(this.chkValid('0')){
        this.fCustList = false;
        this.DRAG_LIST = [];
        this.tab1Init();
        this.tab2Init();
        return;
      }
      //top조회
      const sUrl = '/phone-api/campaign/custmng/selecttopcpicustmng';
      const postParam = {
        CPI_ID : this.CPI_NM
      }
      const headParam = {
        head: {
          'SERVICE' : 'phone.campaign.custmng.selecttopcpicustmng',
          'METHOD' : 'selecttopcpicustmng',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );


      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {
        const topData = resData.DATA[0];
        this.TOP_INFO = [
          {
            title: '아웃바운드 명',
            desc: topData.CPI_NM,
            class: '',
          },
          {
            title: '진행기간',
            desc: `${topData.CPI_BGNG_DT} ~ ${topData.CPI_END_DT}`,
            class: '',
          },
          {
            title: '계획 회 차',
            desc: topData.PLAN_CYCL,
            class: '',
          },
          {
            title: '진행상태',
            desc: topData.PRGRS_STTS_NM,
            class: `is-txt-${this.displayStatus(topData.PRGRS_STTS_CD)}`,
          },
          {
            title: '등록자',
            desc: topData.RGTR_ID,
            class: '',
          },
          {
            title: '등록일',
            desc: topData.REG_DT,
            class: '',
          },
        ];
        this.fSttsCd = topData.PRGRS_STTS_CD;
        this.tab1SelectList();
        this.tab2SelectList(false);
      }
    },
    //캠페인 관리항목 조회
    async tab1SelectList(){
      if(this.mixin_isEmpty(this.CPI_NM)) return;

      let sUrl = '/phone-api/campaign/custmng/selectattrcustmng';
      let postParam = {
        SE : this.SCH_SE
        , BSC_PVSN_ATTR_YN : "N"
        , CPI_ID : this.CPI_NM
      }

      const headParam = {
        head: {
          'SERVICE' : 'phone.campaign.custmng.selectattrcustmng',
          'METHOD' : 'selectattrcustmng',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.fCustList = false;
        this.DRAG_LIST = [];
        this.tab1Init();
        let ArrExpsnAttr = [];
        for(let i=0; i<response.DATA.length; i++){
          const expsnAttrObj = response.DATA[i];
          expsnAttrObj.type = this.getIconClassNm(response.DATA[i].DATA_TYPE_CD);
          expsnAttrObj.disabled = false;
          expsnAttrObj.lock = false;
          expsnAttrObj.selected = false;

          ArrExpsnAttr.push(expsnAttrObj);
        }

        this.DRAG_LIST = ArrExpsnAttr;
        if(ArrExpsnAttr.length > 0) this.fCustList = true;
      }
    },
    //대상자 조회
    async tab2SelectList(next){
      this.EXCEL_DOWN_NM = '';

      if(this.mixin_isEmpty(this.CPI_NM)) return;

      //다음버튼 클릭 유무
      if (!next){
        this.tab2Init();
        this.gridDataText = [];
        this.gridSelectedData = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;
        this.gridTotalCnt = 0;
      }

      const sUrl = '/phone-api/campaign/custmng/selectcustcustmng';
      const postParam = {
        CPI_ID : this.CPI_NM
      }
      const headParam = {
        head: {
          'SERVICE' : 'phone.campaign.custmng.selectcustcustmng',
          'METHOD' : 'selectcustcustmng',
          'TYPE' : 'BIZ_SERVICE',
          'ROW_CNT' : this.pagination.rowsPerPage,
          'PAGES_CNT' : this.pagination.page,
          'PAGING' : "Y",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {
        for(let k in resData.EXPSN_ATTR){
          this.gridDataHeaders.push({ text: resData.EXPSN_ATTR[k].EXPSN_ATTR_NM, value: resData.EXPSN_ATTR[k].EXPSN_ATTR_COL_ID, width: '120px', sortable: false });
        }

        resData.DATA.forEach((data, idx) => {
          data.CUST_PHN_NO = this.mixin_setPhoneNo(data.CUST_PHN_NO.replace(/[^0-9]/g, ""));
        });

        let tempDataText = resData.DATA;
        let idx = this.gridDataText.length + 1;
        for(let i in tempDataText){
          tempDataText[i]["index"]= idx++;
        }
        this.gridDataText = [...this.gridDataText, ...tempDataText]
        if(resData.HEADER.next !== null && resData.HEADER.next !== undefined){
          if(resData.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }
        if(this.gridDataText.length > 0) this.gridTotalCnt = resData.DATA[0].TWB_PAGING_TOT_COUNT;

        //이부분은 체크해볼것
        this.pagination.page += 1
        // this.page=1;

        this.EXCEL_DOWN_NM = this.TOP_INFO[0].desc + ' 대상자 목록';
      }
    },
    chkValid(e){
      let eFlag = true;
      switch(e){
        case '0' : //조회관련
          if(this.mixin_isEmpty(this.CPI_NM)) this.showAlert(this.MESSAGE.ALERT.ETC1_WARNING);
          else eFlag = false;
        break;
        case '1' :  //항목 건수 여부
          if(!this.fCustList) this.showAlert(this.MESSAGE.ALERT.ETC2_WARNING);
          else eFlag = false;
        break;
        case '2' :  //항목 건수 여부
          if(this.gridDataText.length < 1) this.showAlert(this.MESSAGE.ALERT.ETC3_WARNING);
          else eFlag = false;
        break;
        case '3' :  //고객명, 전화번호 체크
          const arrPhone = [];
          for(let i=0; i<this.gridDataText.length; i++){
            const e = this.gridDataText[i];
            const CUST_NM = e.CUST_NM;
            let CUST_PHN_NO = e.CUST_PHN_NO;
            let msg = ` (${i+1}번째 행)`;
            //이름이 없으면 오류
            if(this.mixin_isEmpty(CUST_NM)){
              this.MESSAGE.ALERT.ETC4_WARNING.msg = `고객명이 없는 항목이 존재합니다.${msg}`;
              this.showAlert(this.MESSAGE.ALERT.ETC4_WARNING);
              eFlag = true;
              break;
            }
            //이름이 없으면 오류
            if(this.mixin_isEmpty(CUST_PHN_NO)){
              this.MESSAGE.ALERT.ETC4_WARNING.msg = `전화번호가 없는 항목이 존재합니다.${msg}`;
              this.showAlert(this.MESSAGE.ALERT.ETC4_WARNING);
              eFlag = true;
              break;
            }else{
              CUST_PHN_NO = CUST_PHN_NO.toString().replace(/[^0-9]/g, '')
              if(CUST_PHN_NO.length < 10 || CUST_PHN_NO.length > 11){
                this.MESSAGE.ALERT.ETC4_WARNING.msg = `전화번호 길이 또는 형식이 맞지 않습니다.${msg}`;
                this.showAlert(this.MESSAGE.ALERT.ETC4_WARNING);
                eFlag = true;
                break;
              }else{
                //모두 정상이면 핸드폰 숫자만 남김
                this.gridDataText[i].CUST_PHN_NO = CUST_PHN_NO;
                eFlag = false;
                arrPhone.push({ phoneNo : CUST_PHN_NO})
              }
            }
          }
          if(!eFlag){
            //중복체크
            const setCollection = new Set(arrPhone.map(JSON.stringify));
            const isDuplicate = setCollection.size < arrPhone.length;
            if(isDuplicate){
              this.showAlert(this.MESSAGE.ALERT.ETC10_WARNING);
              eFlag = true;
            }else{
              eFlag = false;
            }
          }
        break;
        case '4' :  //진행상태체크
          if(this.fSttsCd !== 'PRPARG') this.showAlert(this.MESSAGE.ALERT.ETC5_WARNING);
          else eFlag = false;
        break;
      }
      return eFlag;
    },
    btnExDownLoad(){
      if(this.chkValid('1')) return;
      if(this.chkValid('4')) return;

      let oHeaders = _.cloneDeep(this.gridDataHeaders);
      oHeaders.splice(0, 1);
      this.mixin_common_exportExcelHeader(oHeaders, '캠페인_업로드_템플릿', 'sheet', '00B0F0');
    },
    btnExUpload(){
      if(this.chkValid('0')) return;
      if(this.chkValid('1')) return;
      if(this.chkValid('4')) return;

      this.$refs.excelRef.$refs.input.value = null
      this.$refs.excelRef.$refs.input.click();
    },
    //엑셀 업로드
    getExcelData(upload_headers, upload_bodys) {
      this.gridDataText = _.cloneDeep(upload_bodys);
      for(let i=0; i<this.gridDataText.length; i++){
        this.gridDataText[i].ROW_NUMBER = i+1;
        this.gridDataText[i].CPI_ID = this.CPI_NM;
      }

      this.gridTotalCnt = this.gridDataText.length;
      this.uploadFlag = true;
    },
    displayStatus(type) {
      const typeList = [
        { type_list_text: 'open', type_list_type: 'PRPARG' }, //준비중,
        { type_list_text: 'accept', type_list_type: 'PUBCMP' }, //게시완료
        { type_list_text: 'reject', type_list_type: 'ONGONG' }, //진행중
        { type_list_text: 'error', type_list_type: 'TERMIAT' }, //종료
      ];

      for (let i = 0; i < typeList.length; i++) {
        if (typeList[i].type_list_type === type) {
          return typeList[i].type_list_text;
        }
      }
    },
    //메시지창 종료
    closeMsg(){
      this.$store.commit('alertStore/hideAlert');
    },
    //api오류
    setErrMsg(res){
      if(res.HEADER.ERROR_MSG.indexOf('UPL|') > -1){
        const arrMsg = res.HEADER.ERROR_MSG.split('|');
        this.gridDataHeaders.forEach(e => {
          if(e.value === arrMsg[2]){
            this.MESSAGE.ALERT.ETC4_WARNING.msg = `${e.text}은(는) 필수 입력사항 입니다.<br>(${arrMsg[1]}번째 행)`;
            this.showAlert(this.MESSAGE.ALERT.ETC4_WARNING);
          }
        });
      }else if(res.HEADER.ERROR_MSG === 'ALT'){
        this.showAlert(this.MESSAGE.ALERT.ETC7_WARNING);
      }else if(res.HEADER.ERROR_MSG === 'CUT'){
        this.showAlert(this.MESSAGE.ALERT.ETC8_WARNING);
      }
    },

    //항목 ID 중복 체크
    async attrColIdDupleChk() {

      if(!this.DTL_EXPSN_ATTR_COL_ID){
        this.showAlert(this.MESSAGE.ALERT.ATTR_COL_ID_EMPTY_CHECK);
        return;
      }

      let sURL = '/api/setting/expsnAttr/expsnAttrColIdDupleChk';
      let postParam = {
        SE : 'CAMP'
        , CPI_ID : this.CPI_NM
        , ATTR_ID : this.DTL_ATTR_ID
        , EXPSN_ATTR_COL_ID : this.DTL_EXPSN_ATTR_COL_ID
      }
      let headParam = {
        head: {
        },
      }

      let resData = await this.common_postCall(sURL, postParam, headParam)

      if (resData.HEADER.ERROR_FLAG) {
        this.EXPSN_ATTR_COL_ID_DUPLE_CHK = false;
      } else {
        if(resData.DATA[0].expsnAttrColIdBoolean){
          this.EXPSN_ATTR_COL_ID_DUPLE_CHK = false;
          this.showAlert(this.MESSAGE.ALERT.ATTR_COL_ID_DUPLE_TRUE);
        }else{
          this.EXPSN_ATTR_COL_ID_DUPLE_CHK = true;
          this.showAlert(this.MESSAGE.ALERT.ATTR_COL_ID_DUPLE_FAIL);
        }
      }

    },

    targetCustExport() {
      this.dialogCustExport = true;
      this.mixin_showDialog('CustExport');
    },
  },
}
</script>

<style lang="scss" scoped>

</style>