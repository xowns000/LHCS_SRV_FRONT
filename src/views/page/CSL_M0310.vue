<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  />
      <div style="height: calc(100vh - 246px)">
        <div class="pl-cols" style="height: 100%">
          <div class="is-vrt">
            <div class="pl-card">
              <div class="pl-search-form pb-0">
                <div class="pl-form-inline-wrap">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      접수 기간
                    </span>
                    <div class="pl-desc">
                      <compo-date-range-picker
                          :StartDayProp.sync="SCH_ST_DTS"
                          :EndDayProp.sync="SCH_END_DTS"
                          @startDayChange="mixin_testLog(SCH_ST_DTS)"
                          @endDayChange="mixin_testLog(SCH_END_DTS)"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      처리결과
                    </span>
                    <div class="pl-desc">
                      <v-select
                        v-model="SCH_STTS_CD"
                        class="pl-form"
                        :items="TEMP_STTS_LIST = mixin_common_code_get(this.common_code, 'TRNSF_STTS_CD', '전체')"
                        @change="getCuttTrnsfHstryList('')"
                        placeholder="선택하세요"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      (구)접수번호
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        v-model="SCH_OLD_CUTT_TRNSF_ID"
                        class="pl-form "
                        placeholder="검색어 입력"
                        @keyup.enter="getCuttTrnsfHstryList()"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      신규 접수번호
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        v-model="SCH_CUTT_TRNSF_ID"
                        class="pl-form "
                        placeholder="검색어 입력"
                        @keyup.enter="getCuttTrnsfHstryList()"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      상담 유형
                    </span>
                    <div class="pl-desc">
                      <v-autocomplete
                        v-model="SCH_CUTT_TYPE"
                        return-object
                        class="pl-form"
                        :items="CUTT_TYPE_ITEMS"
                        v-on:change="getCuttTrnsfHstryList('')"
                        placeholder="상담 유형을 검색하세요"
                        clearable
                        no-data-text="결과 없음"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      <v-select
                      v-model="SCH_KEY"
                      class="pl-form"
                      :items="mixin_common_code_get(this.common_code, 'CUTT_HIST_SRCH')"
                      placeholder="선택하세요"
                      />
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                      v-model="SCH_KEYWORD"
                      class="pl-form "
                      placeholder="검색어 입력"
                      @keyup.enter="getCuttTrnsfHstryList()"
                    />
                    </div>
                  </div>
                  <v-btn
                    class="pl-btn is-icon"
                    @click="getCuttTrnsfHstryList()"
                    >
                    <span class="pl-icon20 search"></span>
                    조회
                  </v-btn>
                  <div v-if="SCH_CUST_ATTR.length > 0 || SCH_TRNSF_ATTR.length > 0">
                    <compo-tooltip-btn
                      TitleProp="확장속성 검색"
                      ClassProp="pl-tooltip-btn ml-2"
                      IconProp="pl-icon20 detail"
                      TooltipPositionProp="bottom"
                      @btnClick="expsnAttrSchDialog(true)"
                    ></compo-tooltip-btn>
                    <v-slide-y-transition>
                      <div
                        class="pl-drop-layer"
                        v-if="dropSchDetail === true"
                        :style="SCH_CUST_ATTR.length > 0 && SCH_TRNSF_ATTR.length > 0 ? 'width: 840px; transform: translateX(-780px)':'width: 420px; transform: translateX(-390px)'">
                        <template v-if="SCH_CUST_ATTR.length > 0 && SCH_TRNSF_ATTR.length > 0">
                          <div
                          class="pl-drop-layer-body"
                          style="height: 300px">
                            <div class="pl-cols is-mt-l">
                              <div>
                                <h2 class="pl-subtit">고객 확장 속성</h2>
                                <div class="pl-scroll-body d-flex flex-column is-mt-m" style="overflow-y: scroll; height: calc(100vh - 680px); gap: 10px">
                                  <div class="pl-form-inline-wrap vertical">
                                    <template v-for="(attr, seq) in SCH_CUST_ATTR">
                                      <div :key="attr.EXPSN_ATTR_COL_ID"  class="pl-form-inline">
                                        <span
                                          class="pl-label"
                                          style="flex: 0 0 120px">
                                          {{ attr.EXPSN_ATTR_NM }}
                                        </span>
                                        <div class="pl-desc">
                                          <template v-if="attr.DATA_TYPE_CD === 'COE' || attr.DATA_TYPE_CD === 'COE_MULTI'">
                                            <v-select
                                              class="pl-form"
                                              :items="mixin_common_code_get(common_code, attr.GROUP_CD_ID, '전체')"
                                              placeholder="선택하세요"
                                              v-model="attr.V_ATTR_SCH_MODEL"
                                            ></v-select>
                                          </template>
                                          <template v-else>
                                            <v-text-field
                                              v-model="attr.V_ATTR_SCH_MODEL"
                                              class="pl-form "
                                              placeholder="검색어 입력"
                                            />
                                          </template>
                                        </div>
                                      </div>
                                    </template>
                                  </div>
                                </div>
                              </div>
                              <div class="ml-4">
                                <h2 class="pl-subtit">이관 확장 속성</h2>
                                <div class="pl-scroll-body d-flex flex-column is-mt-m" style="overflow-y: scroll; height: calc(100vh - 680px); gap: 10px">
                                  <div class="pl-form-inline-wrap vertical">
                                    <template v-for="(attr, seq) in SCH_TRNSF_ATTR">
                                      <div :key="attr.EXPSN_ATTR_COL_ID"  class="pl-form-inline">
                                        <span
                                          class="pl-label"
                                          style="flex: 0 0 120px">
                                          {{ attr.EXPSN_ATTR_NM }}
                                        </span>
                                        <div class="pl-desc">
                                          <template v-if="attr.DATA_TYPE_CD === 'COE' || attr.DATA_TYPE_CD === 'COE_MULTI'">
                                            <v-select
                                              class="pl-form"
                                              :items="mixin_common_code_get(common_code, attr.GROUP_CD_ID, '전체')"
                                              placeholder="선택하세요"
                                              v-model="attr.V_ATTR_SCH_MODEL"
                                            ></v-select>
                                          </template>
                                          <template v-else>
                                            <v-text-field
                                              v-model="attr.V_ATTR_SCH_MODEL"
                                              class="pl-form "
                                              placeholder="검색어 입력"
                                            />
                                          </template>
                                        </div>
                                      </div>
                                    </template>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <div class="pl-form-inline-wrap vertical">
                            <template v-for="(attr, seq) in SCH_TRNSF_ATTR">
                              <div :key="attr.EXPSN_ATTR_COL_ID"  class="pl-form-inline">
                                <span
                                  class="pl-label"
                                  style="flex: 0 0 120px">
                                  {{ attr.EXPSN_ATTR_NM }}
                                </span>
                                <div class="pl-desc">
                                  <template v-if="attr.DATA_TYPE_CD === 'COE' || attr.DATA_TYPE_CD === 'COE_MULTI'">
                                    <v-select
                                      class="pl-form"
                                      :items="mixin_common_code_get(common_code, attr.GROUP_CD_ID, '전체')"
                                      placeholder="선택하세요"
                                      v-model="attr.V_ATTR_SCH_MODEL"
                                    ></v-select>
                                  </template>
                                  <template v-else>
                                    <v-text-field
                                      v-model="attr.V_ATTR_SCH_MODEL"
                                      class="pl-form "
                                      placeholder="검색어 입력"
                                    />
                                  </template>
                                </div>
                              </div>
                            </template>
                          </div>
                        </template>
                        <div class="pl-drop-layer-footer justify-end">
                          <v-btn class="pl-btn is-sub" @click="dropSchDetail=false">닫기</v-btn>
                          <v-btn class="pl-btn" @click="[getCuttTrnsfHstryList(), dropSchDetail=false]">조회</v-btn>
                        </div>
                      </div>
                    </v-slide-y-transition>
                  </div>
                </div>
              </div>
            </div>
            <!-- sub content -->
            <div class="pl-card">
              <div class="pl-grid-top">
                <div class="pl-grid-top-left">
                  <v-btn
                    class="pl-btn is-icon is-sub"
                    :disabled="selectedRow.CUTT_TRNSF_ID > -1?false:true"
                    @click="selectDetail()"
                    >
                    <span class="pl-icon20 document"></span>
                    선택항목 상세
                  </v-btn>
                  <template v-if="$store.getters['userStore/GE_USER_ROLE'].atrtGroupId === '7' && SCH_STTS_CD !=='CMPT' "><!--담당자인 경우-->
                    <strong>변경할 상태</strong>
                    <v-autocomplete
                      v-model="STTS_CD"
                      class="pl-form"
                      :items="STTS_LIST"
                      :disabled="SEL_CUTT_TRNSF_LIST.length != 0 && !mixin_isEmpty(SCH_STTS_CD) ? false: true"
                      placeholder="선택하세요"
                    />
                    <v-btn
                      class="pl-btn is-icon is-sub"
                      :disabled="SEL_CUTT_TRNSF_LIST.length != 0 && !mixin_isEmpty(SCH_STTS_CD) ? false: true"
                      @click="trnsfSttsValid()"
                      >
                      <span class="pl-icon20 document"></span>
                      일괄처리
                    </v-btn>
                    <span v-if="mixin_isEmpty(SCH_STTS_CD)" style="color:red">※ 일괄처리 버튼은 처리결과 선택 조회 후 활성화 됩니다.</span>
                    <span v-if="!mixin_isEmpty(SCH_STTS_CD) && SEL_CUTT_TRNSF_LIST.length === 0" style="color:red">※ 일괄처리 할 항목을(체크박스) 선택 해주세요.</span>
                  </template>
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
                class="pl-grid has-control"
                :headers="headers"
                :items="items"
                style="cursor:pointer;"
                show-select
                fixed-header
                item-key="ROW_NUMBER"
                height="562px"
                :items-per-page="ROW_PER_PAGE"
                hide-default-footer
                :page.sync="page"
                :item-class="isActiveRow"
                @click:row="rowClick"
                @dblclick:row="selectDetail"
                @page-count="pageCount = $event"
                v-model="SEL_CUTT_TRNSF_LIST"
                no-data-text="등록된 데이터가 없습니다."
                :loading="loading"
                loading-text="조회중입니다."
                >
                <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in headers">
                  <div v-if="header.telYn">
                    <span v-if="item[header.value]">{{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? item[header.value]?mixin_mask_num(item[header.value].replace(/[^0-9]/g, "")) : '' : mixin_setPhoneNo(item[header.value].replace(/[^0-9]/g, "")) }}</span>
                  </div>
                  <div v-else>
                    <span v-if="header.value === 'CUST_NM'">
                      {{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(item[header.value]) : item[header.value] }}
                    </span>
                    <span v-else-if="header.value === 'STTS_CD_NM'">
                      <span
                        :class="`pl-round-chip is-sm chat-stat-${item[header.value] === '대기' ? 'wait' : item[header.value] === '처리중' ? 'after': item[header.value] === '반려' ? 'cs' : 'done'}`">
                        {{ item[header.value] }}
                      </span>
                    </span>
                    <span v-else-if="header.value === 'REG_DT' || header.value === 'MDFCN_DT' || header.value === 'STTS_CHG_DT'">
                      {{ mixin_convertDate(item[header.value], 'yyyy-MM-dd HH:mm:ss') }}
                    </span>
                    <span v-else>{{ item[header.value] }}</span>
                  </div>
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
                    @btnClick="getCuttTrnsfHstryList('next')"
                  ></compo-tooltip-btn>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 모달 : 상담 상세 정보 -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer" v-if="detailModal === true ">
        <div class="pl-quick-layer-header"><h1>상담 상세 정보</h1>
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
              <div class="d-flex flex-column pa-3" style="row-gap: 4px;">
                <div class="d-flex px-4">
                  <span class="col-3 pa-0">상담 일시</span>
                  <strong class="is-txt-blue">{{ mixin_convertDate(selectedRow.REG_DT, 'yyyy-MM-dd HH:mm:ss') }}</strong>
                </div>
                <div class="d-flex px-4">
                  <span class="col-3 pa-0">고객명</span>
                  <strong>{{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(selectedRow.CUST_NM) : selectedRow.CUST_NM }}</strong>
                </div>
                <div class="d-flex px-4">
                  <span class="col-3 pa-0">고객전화번호</span>
                  <strong>{{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? selectedRow.CUST_PHN_NO?mixin_mask_num(selectedRow.CUST_PHN_NO.replace(/[^0-9]/g, "")) : '' : mixin_setPhoneNo(selectedRow.CUST_PHN_NO.replace(/[^0-9]/g, "")) }}</strong>
                </div>
                <div class="d-flex px-4">
                  <span class="col-3 pa-0">상담유형</span>
                  <strong>{{ selectedRow.FULL_PATH }}</strong>
                </div>
              </div>
            </div>
          </div>
          <!-- 상담 내용 -->
          <div class="is-mt-l">
            <h2 class="pl-subtit">상담 내용</h2>
            <v-textarea
              v-model="selectedRow.CUTT_CN"
              class="pl-form is-noresize is-mt-m"
              :spellcheck="false"
              disabled
            />
          </div>
          <!-- 반려 사유 -->
          <div class="is-mt-l" v-if="selectedRow.STTS_CD === 'RTN'">
            <h2 class="pl-subtit">반려 사유</h2>
            <ul class="pl-line-list is-border type-left is-mt-m">
              <li>
                <div class="flex-grow-1"><strong>{{ selectedRow.RSN }}</strong></div>
              </li>
            </ul>
          </div>
          <!-- 상담 이관 정보 -->
          <div class="is-mt-l">
            <h2 class="pl-subtit">상담 이관 정보</h2>
            <ul class="pl-line-list is-border type-left is-mt-m">
                <template v-if="this.selectedRow.NEW_TRNSF_NO">
                  <li>
                    <span class="keyTitle">접수번호</span>
                    <div class="flex-grow-1"><strong>{{ this.selectedRow.NEW_TRNSF_NO }}</strong></div>
                  </li>
                </template>
              <template v-for="(expsnAttr, idx) in EXPSN_ATTR">
                <li :key="expsnAttr.ATTR_ID">
                  <span class="keyTitle">
                    {{ expsnAttr.EXPSN_ATTR_NM }}
                    <v-icon v-if="expsnAttr.ESNTL_YN === 'Y'" class="pl-icon20 required"></v-icon> <!-- 필수 입력인 경우  -->
                  </span>
                  <div class="flex-grow-1">
                    <template v-if="editable">
                      <!-- 단일 선택형인 경우 -->
                      <v-autocomplete
                        v-if="expsnAttr.DATA_TYPE_CD === 'COE'"
                        v-model="expsnAttr.V_MODEL"
                        class="pl-form is-auto"
                        :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                        :items="mixin_common_code_get(common_code, expsnAttr.GROUP_CD_ID)"
                        placeholder="선택하세요"
                        no-data-text="결과 없음"
                      />
                      <!-- 다중 선택형인 경우 -->
                      <v-autocomplete
                        v-if="expsnAttr.DATA_TYPE_CD === 'COE_MULTI'"
                        v-model="expsnAttr.V_MODEL"
                        return-object
                        class="pl-form is-auto"
                        style="width:137px"
                        :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                        :items="mixin_common_code_get(common_code, expsnAttr.GROUP_CD_ID)"
                        multiple
                        small-chips
                        >
                        <template v-slot:selection="{ attrs, item, parent, selected, index }">
                          <v-chip
                            v-if="item === Object(item)"
                            v-bind="attrs"
                            :input-value="selected"
                            small
                          >
                            <span class="pr-2">
                              {{ item.text }}
                            </span>
                            <v-icon small @click="parent.selectItem(item)" >
                              $delete
                            </v-icon>
                          </v-chip>
                        </template>
                      </v-autocomplete>
                      <!-- 문자형이고 데이터 길이가 200보다 작거나 같은 경우 -->
                      <v-text-field
                        v-else-if="expsnAttr.DATA_TYPE_CD === 'TXT' && expsnAttr.DATA_LEN <= 200"
                        v-model="expsnAttr.V_MODEL"
                        class="pl-form is-auto"
                        :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                        :maxlength="expsnAttr.DATA_LEN"
                        placeholder=""
                        v-byte-counter="expsnAttr.DATA_LEN"
                      />
                      <!-- 문자형이고 데이터 길이가 200보다 큰 경우 -->
                      <v-textarea
                        v-else-if="expsnAttr.DATA_TYPE_CD === 'TXT' && expsnAttr.DATA_LEN > 200"
                        v-model="expsnAttr.V_MODEL"
                        class="pl-form is-noresize"
                        :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                        :maxlength="expsnAttr.DATA_LEN"
                        :spellcheck="false"
                        v-byte-counter="expsnAttr.DATA_LEN"
                      />
                      <!-- 숫자형인 경우 -->
                      <v-text-field
                        v-else-if="expsnAttr.DATA_TYPE_CD === 'NUM'"
                        v-model="expsnAttr.V_MODEL"
                        class="pl-form is-auto"
                        :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                        :maxlength="expsnAttr.DATA_LEN"
                        hide-spin-buttons
                        type="number"
                        oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"
                        placeholder="숫자만 입력 가능 합니다."
                        v-byte-counter="expsnAttr.DATA_LEN"
                      />
                      <!-- 숫자형이면서 comma가 포함인 경우 -->
                      <v-text-field
                        v-else-if="expsnAttr.DATA_TYPE_CD === 'NUM_COMMA'"
                        v-model="expsnAttr.V_MODEL"
                        class="pl-form is-auto"
                        :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                        :maxlength="expsnAttr.DATA_LEN"
                        hide-spin-buttons
                        type="text"
                        oninput="javascript: this.value = this.value.replace(/[^,.0-9]/g, '' ).replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');"
                        placeholder="숫자만 입력 가능 합니다."
                        v-byte-counter="expsnAttr.DATA_LEN"
                      />
                      <!-- 우편번호인 경우 -->
                      <div v-else-if="expsnAttr.DATA_TYPE_CD === 'POST'">
                        <v-text-field
                          v-model="expsnAttr.V_MODEL"
                          class="pl-form is-search"
                          :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                          :maxlength="expsnAttr.DATA_LEN"
                          disabled
                          style="width: 100%;"
                          v-byte-counter="expsnAttr.DATA_LEN"
                        >
                          <template v-slot:append>
                            <v-btn
                              @click="callpostDialog(`${seq}`)"
                              class="pl-btn has-icon-only">
                              <span class="pl-icon20 in-search"></span>
                            </v-btn>
                          </template>
                        </v-text-field>
                        <v-text-field v-if="expsnAttr.V_MODEL_DTL && expsnAttr.V_MODEL_DTL.length > 0"
                          v-model="expsnAttr.V_MODEL_DTL[0]"
                          class="pl-form mt-1"
                          :ref="`V_MODEL_ADDR_${seq}`"
                          disabled
                          style="width: 100%;"
                        />
                        <v-text-field v-if="expsnAttr.V_MODEL_DTL && expsnAttr.V_MODEL_DTL.length > 1"
                          v-model="expsnAttr.V_MODEL_DTL[1]"
                          class="pl-form mt-1"
                          :ref="`V_MODEL_DTL_ADDR_${seq}`"
                          style="width: 100%;"
                          v-byte-counter="expsnAttr.DATA_LEN"
                        />
                      </div>
                      <!-- 해시태크인 경우 -->
                      <div class="pl-tags-wrap" v-else-if="expsnAttr.DATA_TYPE_CD === 'HASH'">
                        <v-chip-group
                          active-class="active-tag"
                          column
                        >
                          <template v-for="tag, index in expsnAttr.tags" >
                            <v-chip
                              v-show="tag.active"
                              :key="index"
                              close
                              @click:close="tag.active = false"
                            >
                              {{ tag.text }}
                            </v-chip>
                          </template>
                          <template>
                            <v-text-field
                              v-model="expsnAttr.V_MODEL"
                              :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                              @keydown.enter="addTag(`${seq}`)"
                              @input="onInputTag(`${seq}`)"
                              :style="computedTagSize"
                              class="pl-form is-tag"
                              v-byte-counter="expsnAttr.DATA_LEN"
                            >
                              <template v-slot:append>
                                <v-btn
                                  @click="addTag(`${seq}`)"
                                  class="pl-btn has-icon-only">
                                  <span class="pl-icon20 edit"></span>
                                </v-btn>
                              </template>
                            </v-text-field>
                          </template>
                        </v-chip-group>
                      </div>
                      <!-- 날짜형인 경우 -->
                      <div class="pl-desc is-reserveCall" v-else-if="expsnAttr.DATA_TYPE_CD === 'DAT'">
                        <v-checkbox
                          v-model="expsnAttr.V_MODEL"
                          :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                          class="pl-check"
                          @click="toggleChkReserve(`${seq}`,$event)"
                        ></v-checkbox>
                        <compo-date-picker
                          v-if="expsnAttr.dateReservePicker"
                          DateType="dateTime"
                          :DateProp.sync="expsnAttr.dateTimeDate"
                          :TimesProp.sync="expsnAttr.selectedTime"
                          :AmpmProp.sync="expsnAttr.selectedAmpm"
                          />
                        <!-- 캘린더 간편 모달 -->
                        <div
                          v-show="expsnAttr.dropDateReserve"
                          class="pl-drop-layer is-dateReserve"
                          :style="{ position: 'fixed', top: `${posY}px`, left: `${posX}px` }"
                          >
                          <div class="pl-drop-layer-header">
                            {{expsnAttr.EXPSN_ATTR_NM}} 알림시간
                          </div>
                          <div class="pl-drop-layer-body">
                            <ul class="pl-drop-layer-list">
                              <li
                                v-for="(time, index) in times" :key="index"
                                class="d-flex justify-space-between"
                                @click="selectReserveDateTime(`${seq}`,time.date)">
                                <span>{{ time.label }}</span> <span>{{ displayReserveTime(`${seq}`,time.date) }}</span>
                              </li>
                            </ul>
                          </div>
                          <div class="pl-drop-layer-footer">
                            <v-btn
                              class="pl-btn is-icon is-sub is-calendarPick flex-grow-1"
                              @click="showDatePicker(`${seq}`)"
                            >
                              <span class="pl-icon20 calendarPick"></span>
                              날짜 및 시간 직접 선택
                            </v-btn>
                          </div>
                        </div>
                      </div>
                      <!-- 전화번호인 경우 -->
                      <v-text-field
                        v-else-if="expsnAttr.DATA_TYPE_CD === 'TEL'"
                        v-model="expsnAttr.V_MODEL"
                        class="pl-form is-auto"
                        :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                        :maxlength="expsnAttr.DATA_LEN"
                        placeholder=""
                        hide-spin-buttons
                        type="text"
                        @keyup="setExpsnAttrPhoneNo(expsnAttr)"
                        oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                        v-byte-counter="expsnAttr.DATA_LEN"
                      />
                    </template>
                    <template v-else>
                      <template v-if="expsnAttr.DATA_LEN > 200">
                        <v-textarea
                          v-model="expsnAttr.ATTR_VL_NM"
                          class="pl-form is-noresize"
                          readonly
                        />
                      </template>
                      <template v-else>
                        <strong>{{ expsnAttr.ATTR_VL_NM }}</strong>
                      </template>
                    </template>
                  </div>
                </li>
              </template>
            </ul>
          </div>
          <div class="pl-btn-wrap justify-end is-mt-s">
            <template v-if="$store.getters['userStore/GE_USER_ROLE'].atrtGroupId === '7'"><!--담당자-->
              <template v-if="selectedRow.STTS_CD === 'REQ'"><!--대기일 경우-->
                <v-btn class="pl-btn" @click="trnsfSttsChg('ING')">처리중</v-btn>
                <v-btn class="pl-btn" @click="trnsfSttsChg('HOLD')">보류</v-btn>
                <v-btn class="pl-btn" @click="trnsfSttsChg('RTN')">반려</v-btn>
                <v-btn class="pl-btn" @click="trnsfSttsChg('CMPT')">처리완료</v-btn>
              </template>
              <template v-else-if="selectedRow.STTS_CD === 'ING'"><!--처리중인 경우-->
                <v-btn class="pl-btn" @click="trnsfSttsChg('HOLD')">보류</v-btn>
                <v-btn class="pl-btn" @click="trnsfSttsChg('CMPT')">처리완료</v-btn>
              </template>
              <template v-else-if="selectedRow.STTS_CD === 'HOLD'"><!--보류인 경우-->
                <v-btn class="pl-btn" @click="trnsfSttsChg('RTN')">반려</v-btn>
                <v-btn class="pl-btn" @click="trnsfSttsChg('ING')">처리중</v-btn>
                <v-btn class="pl-btn" @click="trnsfSttsChg('CMPT')">처리완료</v-btn>
              </template>
            </template>
            <!--1:시스템관리자, 2:관리자, 3:센터장, 4:팀장, 5:매니저, 6:상담사, 7:담당자-->
            <template v-if="$store.getters['userStore/GE_USER_ROLE'].atrtGroupId === '1'
                          ||$store.getters['userStore/GE_USER_ROLE'].atrtGroupId === '2'
                          ||$store.getters['userStore/GE_USER_ROLE'].atrtGroupId === '3'
                          ||$store.getters['userStore/GE_USER_ROLE'].atrtGroupId === '4'
                          ||$store.getters['userStore/GE_USER_ROLE'].atrtGroupId === '5'
                          ||$store.getters['userStore/GE_USER_ROLE'].atrtGroupId === '7'
                          ||($store.getters['userStore/GE_USER_ROLE'].atrtGroupId === '6' && $store.getters['userStore/GE_USER_ROLE'].userId === this.selectedRow.DMND_CUSL_ID)"
              >
              <v-btn class="pl-btn" v-if="(this.selectedRow.STTS_CD === 'REQ' || this.selectedRow.STTS_CD === 'RTN') && !editable" @click="editable=true;">수정</v-btn>
              <v-btn class="pl-btn is-sub" v-if="editable" @click="editable=false;">취소</v-btn>
              <v-btn class="pl-btn" v-if="editable" @click="cuttTrnsfValidate()">저장</v-btn>
            </template>
          </div>
        </div>
      </div>
    </v-slide-x-reverse-transition>

    <!-- 엑셀 다운로드 필터 dialog -->
    <v-dialog
      v-model="dialogExcelFilter"
      content-class="pl-top-alarm-dialog"
      hide-overlay>
      <compo-dialog
        header-title="다운로드 항목 설정"
        @hide="mixin_hideDialog('ExcelFilter')"
        @submit="submitDialog('ExcelFilter')"
      >
        <template slot="body">
          <p>목록에서 항목을 선택 하신 <strong>후 [다운로드] 버튼을 클릭</strong>하십시오.</p>
          <p>검색 조건에 따른 <span class="is-txt-red">결과 데이터 양에 따라 다운로드 시 다소 시간이 걸릴 수 있습니다.</span> 많은 양의 데이터는 가급적 일과시간 이후 사용해 주십시오.</p>
          <div class="pl-cols is-mt-l">
            <div>
              <h2 class="pl-dialog-body-tit-h2 is-border">고객 정보 항목</h2>
              <div class="pl-scroll-body d-flex flex-column is-mt-m" style="overflow-y: scroll; height: calc(100vh - 550px); gap: 10px">
                <div
                  class="pl-tag-line d-flex justify-content-start text-left"
                  style="flex-wrap: wrap; width: 100%; height: auto; min-height: 30px"
                  v-for="chk01 in EXCEL_CUSTOM_ATTR"
                  :key="chk01.value">
                  <v-checkbox
                    class="pl-check flex-grow-1 pl-4"
                    v-model="CHK_CUSTOM_ATTR"
                    :label="chk01.text"
                    :disabled="chk01.disabled"
                    :value="chk01.value"
                    @click="onCheckboxClicked(chk01)"
                  ></v-checkbox>
                </div>
              </div>
              <h2 class="pl-dialog-body-tit-h2 is-border">이관 정보 항목</h2>
              <div class="pl-scroll-body d-flex flex-column is-mt-m" style="overflow-y: scroll; height: calc(100vh - 390px); gap: 10px">
                <div
                  class="pl-tag-line d-flex justify-content-start text-left"
                  style="width: 100%;"
                  v-for="chk02 in EXCEL_TRNSF_ATTR"
                  :key="chk02.value">
                  <v-checkbox
                    v-model="CHK_TRNSF_ATTR"
                    class="pl-check flex-grow-1 pl-4 "
                    :label="chk02.text"
                    :value="chk02.value"
                    :disabled="chk02.disabled"
                    @click="onCheckboxClicked(chk02)"
                  ></v-checkbox>
                </div>
              </div>
              <h2 class="pl-dialog-body-tit-h2 is-border">상담 정보 항목</h2>
              <div class="pl-scroll-body d-flex flex-column is-mt-m" style="overflow-y: scroll; gap: 10px">
                <div
                  class="pl-tag-line d-flex justify-content-start text-left"
                  style="width: 100%;">
                  <div
                    class="pl-tag-line d-flex justify-content-start text-left"
                    style="width: 100%;"
                    v-for="chk03 in EXCEL_CUTT_ATTR"
                    :key="chk03.value">
                    <v-checkbox
                      v-model="CHK_CUTT_ATTR"
                      class="pl-check flex-grow-1 pl-4 "
                      :label="chk03.text"
                      :value="chk03.value"
                      :disabled="chk03.disabled"
                      @click="onCheckboxClicked(chk03)"
                    ></v-checkbox>
                  </div>
                </div>
              </div>
            </div>
            <div class="ml-4">
              <h2 class="pl-dialog-body-tit-h2 is-border">항목 순서 변경</h2>
              <div class="d-flex" style="flex: 100%">
                <div class="pl-card" style="padding-left:0px;overflow: auto;">
                    <div class="pl-drag-list-content">
                      <draggable
                        ghost-class="ghost"
                        v-model="DRAG_TRNSF_ATTR"
                        @start="onDragStart"
                        @end="onDragEnd"
                      >
                        <div
                          v-for="chk02 in DRAG_TRNSF_ATTR"
                          :key="chk02.value"
                          class="pl-drag-list-unit"
                          style="height:20px;width:230px;"
                        >
                          <span class="pl-drag-list-title" style="padding-left:0px">{{ chk02.text }}</span>
                        </div>
                      </draggable>
                    </div>
                </div>
              </div>
            </div>
          </div>

        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('ExcelFilter')">닫기</v-btn>
          <v-btn class="pl-btn" @click="downloadExcel">다운로드</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
// import { template } from 'lodash';


export default {
   name:"MENU_CSL_M0310", //name은 'MENU_' + 파일명 조합

components: {
},
data() {
  return {
    //공통코드 설정
    common_code : [],

    // top search
    startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    endDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

    CUTT_TYPE_ITEMS : [],
    EXPSN_ATTR : [],
    
    SCH_STTS_CD : '', //처리결과 검색
    SCH_KEY : 'CUST_NM', // 검색 구분
    SCH_KEYWORD : '', //검색어
    SCH_OLD_CUTT_TRNSF_ID : '', //(구)접수번호 검색
    SCH_CUTT_TRNSF_ID : '', //신규 접수번호 검색
    SCH_CUTT_TYPE : '', //상담유형

    SCH_ST_DTS : this.$moment(this.startDate).subtract(7,'days').format('YYYY-MM-DD'), //상담 시작 일자
    SCH_END_DTS : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), //상담 시작 일자

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

    headers: [],
    items: [],
    selectedRow:{},
    SEL_CUTT_TRNSF_LIST : [],

    STTS_CD : '',
    STTS_LIST : [],
    TEMP_STTS_LIST : [],
    RSN : '',

    // detail Modal
    detailModal: false,
    //녹취 파일
    REC_TEMP_DATA: {
      "CUST_ID":"1132",
      "REC_FILE_NM":"20240119/1002-20240119-161248-IB-01047123585-1705648368.2626",
    },

    editable : false,
    ONLY_STTS_CD : '',

    dropSchDetail: false,
    TMP_SCH_CUST_ATTR : [],
    TMP_SCH_TRNSF_ATTR : [],
    SCH_CUST_ATTR : [],
    SCH_TRNSF_ATTR : [],

    // 엑셀 다운로드 dialog
    dialogExcelFilter: false,

    EXCEL_CUSTOM_ATTR: [
      { text: '고객명', value : 'CUST_NM', chk: true, disabled: true, },
      { text: '고객전화번호',value : 'CUST_PHN_NO', chk: true, disabled: true, },
    ],
    EXCEL_TRNSF_ATTR: [
      { text: '접수번호', value : 'NEW_TRNSF_NO', chk: true, disabled: true, },
      { text: '접수일시', value : 'CONVERT_REG_DT', chk: true, disabled: false, },
      { text: '처리결과', value : 'STTS_CD_NM', chk: true, disabled: false, },
    ],
    EXCEL_CUTT_ATTR: [
      { text: '상담유형', value : 'FULL_PATH', chk: false, disabled: false, },
    ],
    CHK_CUSTOM_ATTR:[
      'CUST_NM','CUST_PHN_NO',
    ],
    CHK_TRNSF_ATTR:[
      'NEW_TRNSF_NO',
    ],
    CHK_CUTT_ATTR:[],
    CHK_TOTAL:[],

    DRAG_TRNSF_ATTR : [],

    loading : false
  }
},

  watch: {
    selectedRow() {
      this.getExpsnAttrList(this.selectedRow.CUTT_TRNSF_ID); //확장 속성
    }
  },

  computed: {
  },

  beforeDestroy(){
  },

  async created() {
    //공통코드설정
    // let codeName = ['TRNSF_STTS_CD','CUTT_HIST_SRCH'];
    // this.common_code = await this.mixin_common_code_get_all(codeName);

    // this.SCH_STTS_CD = this.$store.getters['userStore/GE_USER_ROLE'].atrtGroupId === '7' ? 'REQ' : this.$store.getters['userStore/GE_USER_ROLE'].atrtGroupId === '6' ? 'RTN' : '';
    
    this.getCuttTrnsfHstryList(); //이관 처리 현황 목록
    this.getCuttTypeList();//상담 유형
    this.expsnAttrSchDialog(false); //확장 속성
  },

  mounted() {

  },

  methods: {
    async getCuttTrnsfHstryList(next){
      this.SEL_CUTT_TRNSF_LIST = [];
      this.detailModal = false;
      this.selectedRow = {};

      let arrStts = [];
      if(this.SCH_STTS_CD === 'REQ'){ //대기인 경우
        this.TEMP_STTS_LIST.forEach((item, index)=> {
          if(item.value !== '' && item.value !== 'REQ') arrStts.push(item);
        });
      }else if(this.SCH_STTS_CD === 'ING'){ //처리중인 경우
        this.TEMP_STTS_LIST.forEach((item, index)=> {
          if(item.value === 'HOLD' || item.value === 'CMPT') arrStts.push(item);
        });
      }else if(this.SCH_STTS_CD === 'HOLD'){ //보류인 경우
        this.TEMP_STTS_LIST.forEach((item, index)=> {
          if(item.value === 'RTN' || item.value === 'ING' || item.value === 'CMPT') arrStts.push(item);
        });
      }else if(this.SCH_STTS_CD === 'RTN'){ //반려인 경우
        this.TEMP_STTS_LIST.forEach((item, index)=> {
          if(item.value !== '' && item.value !== 'RTN') arrStts.push(item);
        });
      }

      this.STTS_LIST = arrStts;

      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.items = [];
        this.incmpl_items = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let convertSchKeyword = this.SCH_KEYWORD;
      if(this.SCH_KEY === 'CUST_PHN_NO') convertSchKeyword = convertSchKeyword.replace(/[^0-9]/g, '');

      let sUrl = '/api/palette/common/cuttTrnsfHstryList';
      let postParam = {
        SCH_STTS_CD : this.SCH_STTS_CD
        , SCH_ST_DTS : this.SCH_ST_DTS.replace(/-/gi, '')
        , SCH_END_DTS : this.SCH_END_DTS.replace(/-/gi, '')
        , SCH_CUTT_TYPE : this.SCH_CUTT_TYPE?this.SCH_CUTT_TYPE.value:''
        , LVL : this.SCH_CUTT_TYPE?this.SCH_CUTT_TYPE.LVL:''
        , SCH_KEY : this.SCH_KEY
        , SCH_KEYWORD : convertSchKeyword
        , SCH_CUST_EXPSN_ATTR : JSON.stringify(this.SCH_CUST_ATTR)
        , SCH_TRNSF_EXPSN_ATTR : JSON.stringify(this.SCH_TRNSF_ATTR)
        , AUTHRT_GROUP_ID : this.$store.getters['userStore/GE_USER_ROLE'].atrtGroupId
        , SCH_OLD_CUTT_TRNSF_ID : this.SCH_OLD_CUTT_TRNSF_ID
        , SCH_CUTT_TRNSF_ID : this.SCH_CUTT_TRNSF_ID
      }

      let headParam = {
        head : {
          ROW_CNT : this.pagination.rowsPerPage,
          PAGES_CNT : this.pagination.page,
          PAGING : "Y",
        }
      }
      this.loading = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.headers = [
          {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px', sortable: false, telYn : false},
          {text: '접수번호', value: 'NEW_TRNSF_NO', width: '100px', sortable: false, telYn : false},
          {text: '고객명', value: 'CUST_NM', width: '100px', sortable: false, telYn : false},
          {text: '고객 전화번호', value: 'CUST_PHN_NO', width: '130px', sortable: false, telYn : true},
        ];

        let atrtGroupId = this.$store.getters['userStore/GE_USER_ROLE'].atrtGroupId;
        if(atrtGroupId === '1' || atrtGroupId === '2'
          || atrtGroupId === '3' || atrtGroupId === '4' || atrtGroupId === '5'
        ){ //시스템관리자, 관리자, 센터장, 팀장, 매니저
          this.headers.push({text: '상담사', value: 'CUSL_NM', width: '90px', sortable: false, telYn : false});
          this.headers.push({text: '담당자', value: 'TRGT_USER_NM', width: '90px', sortable: false, telYn : false});
        }if(atrtGroupId === '6'){ //상담사
          this.headers.push({text: '담당자', value: 'TRGT_USER_NM', width: '90px', sortable: false, telYn : false});
        }else if(atrtGroupId === '7'){ //담당자
          this.headers.push({text: '상담사', value: 'CUSL_NM', width: '90px', sortable: false, telYn : false});
        }

        this.headers.push({text: '상담유형', value: 'FULL_PATH', width: '150px', sortable: false, telYn : false});
        this.headers.push({text: '처리결과', value: 'STTS_CD_NM', width: '90px', sortable: false, telYn : false});
        this.headers.push({text: '상태변경일시', value: 'STTS_CHG_DT', width: '130px', sortable: false, telYn : false});

        /* 확장속성 헤더 추가 */
        response.EXPSN_ATTR.forEach((cust, idx) => {
          const maxBytes = new TextEncoder().encode(cust.EXPSN_ATTR_NM);
          this.headers.push({
            text: cust.EXPSN_ATTR_NM,
            value: cust.EXPSN_ATTR_COL_ID.toUpperCase()+'_NM',
            width: ((maxBytes.byteLength<7?10:maxBytes.byteLength>20?20:maxBytes.byteLength) * 12) + 'px',
            sortable: false,
            telYn : cust.DATA_TYPE_CD === 'TEL' ? true : false
          });
        });

        this.headers.push({text: '접수일시', value: 'REG_DT', align: 'center', width: '150px', sortable : false, telYn : false});

        if(response.DATA.length > 0){
          response.DATA.forEach((data, idx) => {
            Object.keys(data).forEach(function(v){
              response.EXPSN_ATTR.forEach((attr, seq) => {
                if(attr.EXPSN_ATTR_COL_ID.toUpperCase() === v.toUpperCase() && (attr.DATA_TYPE_CD === 'TXT' || attr.DATA_TYPE_CD === 'COE' || attr.DATA_TYPE_CD === 'COE_MULTI')){
                  if(data[v].length > 3) data[v] = data[v].replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&amp;/gi, '&');
                }
              });
            });
          });
        }

        let tempDataText = response.DATA;
        let incmplDataText = [];
        let idx = this.items.length + 1;
        for(let i in tempDataText){
          tempDataText[i]["ROW_NUMBER"]= idx++;
          if(parseInt(tempDataText[i].PASS_TIME) > 0 && !tempDataText[i].CUTT_BGNG_DT && (tempDataText[i].RSVT_STTS_CD == 'RSVT' || tempDataText[i].RSVT_STTS_CD == 'WAIT')){
            incmplDataText.push(tempDataText[i]);
          }
        }

        this.items = [...this.items, ...tempDataText];
        this.incmpl_items = [...this.incmpl_items, ...incmplDataText];
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

        this.loading = false;
      }
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item.CUTT_TRNSF_ID === this.selectedRow.CUTT_TRNSF_ID ? "active" : "";
      return activeClass;
    },

    rowClick(data){
      this.editable = false;
      this.selectedRow = data;
      this.CUTT_TYPE_ITEMS.forEach((item, idx) => {
        if(item.value === data.CUTT_TYPE_ID) this.selectedRow['FULL_PATH'] = item.text;
      });
      this.CUTT_TRNSF_ID = data.CUTT_TRNSF_ID;

      this.REC_TEMP_DATA = {
        CUST_ID:data.CUST_ID,
        REC_FILE_NM: data.REC_FILE_NM
      }
    },

    selectDetail(data){
      this.detailModal = true;
    },

    //상담유형 목록 조회
    async getCuttTypeList() {
      let sUrl = '/api/setting/cuttType/cuttTypeTreeList';
      let postParam = {
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.cuttTypeIntgeSchData(response.CUTT_TYPE_TREE); //상담 유형 검색 데이터 Set
      }
    },

    //상담 유형 검색 Data Set
    cuttTypeIntgeSchData(cuttType) {
      cuttType.forEach(item => {
        if (item.UP_CUTT_TYPE_ID) {
          this.CUTT_TYPE_ITEMS.push({ value: item.CUTT_TYPE_ID, text: item.FULL_PATH, LVL: item.LVL });
        }
        if (item.children) {
          this.cuttTypeIntgeSchData(item.children);
        }
      });
    },

    //확장 속성 정보 가져오기
    async getExpsnAttrList(CUTT_TRNSF_ID) {
      let sUrl = '/api/setting/expsnAttr/expsnAttrList';
      let postParam = {
        SE : 'TRNSF' //상담내용 확장항목
        , BSC_PVSN_ATTR_YN : "N" //기본 제공 속성이 아닌것
        , USE_YN : 'Y' //확장속성 사용인 경우만
        , CUTT_TRNSF_ID : CUTT_TRNSF_ID
      }

      let headParam = {
        head : {
          ROW_CNT : 500,
          PAGES_CNT : 1,
          PAGING : "Y",
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.EXPSN_ATTR = response.DATA;

        let codeName = ['TRNSF_STTS_CD','CUTT_HIST_SRCH'];
        response.DATA.forEach((attr, idx) => {
          if(attr.DATA_TYPE_CD === 'COE' || attr.DATA_TYPE_CD === 'COE_MULTI'){
            if(attr.GROUP_CD_ID) codeName.push(attr.GROUP_CD_ID); //공통코드사용을 위해
          }
        });

        //공통코드설정
        this.common_code = await this.mixin_common_code_get_all(codeName);

        for(let i in this.EXPSN_ATTR){
          this.EXPSN_ATTR[i].V_MODEL = this.EXPSN_ATTR[i].ATTR_VL; //동적 v_model 생성

          if(this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID === 'CUST_EMAIL') { //고객 이메일인경우.
            this.custInfoProp.CUST_EMAIL = this.EXPSN_ATTR[i].ATTR_VL;
          }
          if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'DAT'){//날짜형인 경우
            this.EXPSN_ATTR[i].V_MODEL = this.EXPSN_ATTR[i].ATTR_VL ? true:false; //chkDateReserve
            this.EXPSN_ATTR[i].V_MODEL_DATE = this.EXPSN_ATTR[i].ATTR_VL; //날짜 v_model
            this.EXPSN_ATTR[i].chkDateReserve = false; //chkDateReserve
            this.EXPSN_ATTR[i].dateReservePicker = false; //dateReservePicker
            this.EXPSN_ATTR[i].dropDateReserve = false; //dropDateReserve
            this.EXPSN_ATTR[i].dateTimeDate = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); //dateTimeDate
            this.EXPSN_ATTR[i].dateTimeTime = new Date(); //dateTimeTime
            this.EXPSN_ATTR[i].selectedTime = ''; //selectedTime
            this.EXPSN_ATTR[i].selectedAmpm = ''; //selectedAmpm
          }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'POST'){ //우편번호인 경우
            if(this.EXPSN_ATTR[i].ATTR_VL){
              let arrAddrInfo = (this.EXPSN_ATTR[i].ATTR_VL?this.EXPSN_ATTR[i].ATTR_VL.split('|'):'');
              this.EXPSN_ATTR[i].V_MODEL = (arrAddrInfo?arrAddrInfo[0]:''); //주소 v_model
              this.EXPSN_ATTR[i].V_MODEL_DTL = [];
              this.EXPSN_ATTR[i].V_MODEL_DTL[0] = (arrAddrInfo?arrAddrInfo[1]:''); //상세 주소1 v_model
              this.EXPSN_ATTR[i].V_MODEL_DTL[1] = (arrAddrInfo?arrAddrInfo[2]:''); //상세 주소2 v_model
            }else{
              this.EXPSN_ATTR[i].V_MODEL_DTL = [];
              this.EXPSN_ATTR[i].V_MODEL_DTL[0] = ''; //상세 주소1 v_model
              this.EXPSN_ATTR[i].V_MODEL_DTL[1] = ''; //상세 주소2 v_model
            }
          }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'COE'){ //단일 선택인 경우
          }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'COE_MULTI'){ //다중 선택인 경우
            this.EXPSN_ATTR[i].V_MODEL = [];
            let items = this.mixin_common_code_get(this.common_code, this.EXPSN_ATTR[i].GROUP_CD_ID);
            let cdNms = '';
            if(this.EXPSN_ATTR[i].ATTR_VL){
              items.forEach((code, idx) => {
                this.EXPSN_ATTR[i].ATTR_VL.split(',').forEach((data, seq) => {
                  if(code.value === data){
                    this.EXPSN_ATTR[i].V_MODEL.push(code);
                    cdNms += (cdNms?',':'')+code.text;
                  }
                });
              });
            }
            this.EXPSN_ATTR[i].CD_NM = cdNms;

          }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'HASH'){ //해시태그인 경우
            this.EXPSN_ATTR[i].tags = [];
            if(this.EXPSN_ATTR[i].ATTR_VL){
              for(let idx in this.EXPSN_ATTR[i].ATTR_VL.split(',')){
                this.EXPSN_ATTR[i].tags[idx] = this.EXPSN_ATTR[i].ATTR_VL.split(',')[idx];
              }
            }
            this.EXPSN_ATTR[i].inputTagSize = '';
          }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'TEL'){ //전화번호인 경우
            if(this.EXPSN_ATTR[i].V_MODEL) this.EXPSN_ATTR[i].V_MODEL = this.mixin_setPhoneNo(this.EXPSN_ATTR[i].ATTR_VL.replace(/\D/g, ''));
          }
        }
      }
    },

    //일괄처리
    trnsfSttsValid(){
      if(this.mixin_isEmpty(this.SEL_CUTT_TRNSF_LIST)){
        this.showAlert({alertDialogToggle: true, msg: '항목을 선택해 주세요.', iconClass: 'is-caution', type: 'default'});
        return;
      }
      
      if(this.mixin_isEmpty(this.STTS_CD)){
        this.showAlert({alertDialogToggle: true, msg: '변경할 상태를 선택해 주세요.', iconClass: 'is-caution', type: 'default'});
        return;
      }

      let sMsg = '';
      let reasonAble = false;

      if(this.STTS_CD === 'ING'){ //처리중
        sMsg = '<font style="color:red">처리중</font> 상태로 일괄 변경 하시겠습니까?';
      }else if(this.STTS_CD === 'CMPT'){ //처리완료
        sMsg = '<font style="color:red">처리완료</font> 상태로 일괄 변경 하시겠습니까?';
      }else if(this.STTS_CD === 'HOLD'){ //보류
        sMsg = '<font style="color:red">보류</font> 상태로 일괄 변경 하시겠습니까?';
      }else if(this.STTS_CD === 'RTN'){ //반려
        reasonAble = true;
        sMsg = '<font style="color:red">반려</font> 상태로 일괄 변경 하시겠습니까?';
      }

      this.showAlert({
          alertDialogToggle: true
          , reasonAble: reasonAble
          , msg: sMsg
          , iconClass: 'is-info'
          , type: 'confirm'
          , callYes: () => {
            if(this.STTS_CD === 'RTN'){ //반려
              let reason = this.$store.getters['alertStore/GE_ALERT'].reason;
              if(this.mixin_isEmpty(reason)){
                this.$store.getters['alertStore/GE_ALERT'].reasonAbleChk = true;
              }else{
                this.trnsfSttsProc('LIST');
              }
            }else{
              this.trnsfSttsProc('LIST');
            }
          }
          , callNo: () => {
            this.$store.commit("alertStore/hideAlert");
          }
      });
    },

    //개별 상태 변경
    async trnsfSttsChg(sSttsCd){
      this.ONLY_STTS_CD = sSttsCd;

      let sMsg = '';

      let reasonAble = false;

      if(this.ONLY_STTS_CD === 'ING'){ //처리중
        sMsg = '<font style="color:red">처리중</font> 상태로 변경 하시겠습니까?';
      }else if(this.ONLY_STTS_CD === 'CMPT'){ //처리완료
        sMsg = '<font style="color:red">처리완료</font> 상태로 변경 하시겠습니까?';
      }else if(this.ONLY_STTS_CD === 'HOLD'){ //보류
        sMsg = '<font style="color:red">보류</font> 상태로 변경 하시겠습니까?';
      }else if(this.ONLY_STTS_CD === 'RTN'){ //반려
        reasonAble = true;
        sMsg = '<font style="color:red">반려</font> 상태로 변경 하시겠습니까?';
      }

      this.showAlert({
          alertDialogToggle: true
          , reasonAble: reasonAble
          , msg: sMsg
          , iconClass: 'is-info'
          , type: 'confirm'
          , callYes: () => {

            if(this.ONLY_STTS_CD === 'RTN'){ //반려
              let reason = this.$store.getters['alertStore/GE_ALERT'].reason;
              if(this.mixin_isEmpty(reason)){
                this.$store.getters['alertStore/GE_ALERT'].reasonAbleChk = true;
              }else{
                this.trnsfSttsProc('');
              }
            }else{
              this.trnsfSttsProc('');
            }
          }
          , callNo: () => {
            this.$store.commit("alertStore/hideAlert");
          }
      });
    },

    //일괄처리
    async trnsfSttsProc(sGb){
      let arrCuttTrnsfId = [];

      if(sGb === 'LIST'){
        this.SEL_CUTT_TRNSF_LIST.forEach((data, idx) => {
          arrCuttTrnsfId.push({CUTT_TRNSF_ID : data.CUTT_TRNSF_ID, CUSL_ID : data.DMND_CUSL_ID});
        });
      }else{
        arrCuttTrnsfId.push({CUTT_TRNSF_ID : this.selectedRow.CUTT_TRNSF_ID, CUSL_ID : this.selectedRow.DMND_CUSL_ID});
      }

      let sUrl = '/api/palette/common/cuttTrnsfHstryReg';
      let postParam = {
        CUTT_TRNSF_ID_LIST : JSON.stringify(arrCuttTrnsfId)
        , STTS_CD : this.STTS_CD
        , RSN : this.$store.getters['alertStore/GE_ALERT'].reason
      }

      if(sGb === 'LIST') postParam.STTS_CD = this.STTS_CD;
      else postParam.STTS_CD = this.ONLY_STTS_CD;

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.getCuttTrnsfHstryList(); //이관 처리 현황 목록
        this.$store.commit("alertStore/hideAlert");
      }
    },

    async cuttTrnsfValidate(){
      for(let i in this.EXPSN_ATTR){
        if(this.EXPSN_ATTR[i].ESNTL_YN === 'Y'){ //필수 입력인 경우
          if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'TXT'){ //문자형
            if(!this.EXPSN_ATTR[i].V_MODEL){
              this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
              return;
            }else{
              if(this.EXPSN_ATTR[i].V_MODEL.length > this.EXPSN_ATTR[i].DATA_LEN){
                this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 0 ~ '+this.EXPSN_ATTR[i].DATA_LEN+'byte 이내로 입력해 주세요.', iconClass: 'is-caution', type: 'default'});
                return;
              }
            }
          }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'NUM' || this.EXPSN_ATTR[i].DATA_TYPE_CD === 'NUM_COMMA'){ //숫자형
            if(!this.EXPSN_ATTR[i].V_MODEL){
              this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
              return;
            }else{
              if(this.EXPSN_ATTR[i].V_MODEL.length > this.EXPSN_ATTR[i].DATA_LEN){
                this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 0 ~ '+this.EXPSN_ATTR[i].DATA_LEN+'byte 이내로 입력해 주세요.', iconClass: 'is-caution', type: 'default'});
                return;
              }
            }
          }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'COE'){ //단일 선택형
            if(Array.isArray(this.EXPSN_ATTR[i].V_MODEL)){
              let iCnt = 0;
              for(let k in this.EXPSN_ATTR[i].V_MODEL){
                if(this.EXPSN_ATTR[i].V_MODEL[k]) iCnt++;
              }
              if(iCnt === 0){
                this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                return;
              }
            }else{
              if(!this.EXPSN_ATTR[i].V_MODEL){
                this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                return;
              }
            }
          }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'COE_MULTI'){ //다중 선택형
            if(this.EXPSN_ATTR[i].V_MODEL.length === 0){
              this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
              return;
            }
          }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'DAT'){ //날짜형
            if(!this.EXPSN_ATTR[i].V_MODEL_DATE){
              this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
              return;
            }
          }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'HASH'){ //해시태그
            let sHashTxt = '';
            let iCnt = 0;
            let iChkCnt = 0;
            for(let k in this.EXPSN_ATTR[i].tags){
              if(this.EXPSN_ATTR[i].tags[k]) iCnt++;

              if(this.EXPSN_ATTR[i].tags[k].text){
                sHashTxt += (iChkCnt>0?',':'') + this.EXPSN_ATTR[i].tags[k].text;
                iChkCnt++;
              }
            }
            if(iCnt === 0){
              this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
              return;
            }else{
              if(sHashTxt.length > this.EXPSN_ATTR[i].DATA_LEN){
                this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 0 ~ '+this.EXPSN_ATTR[i].DATA_LEN+'byte 이내로 입력해 주세요.', iconClass: 'is-caution', type: 'default'});
                return;
              }
            }
          }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'POST'){ //우편번호
            if(!this.EXPSN_ATTR[i].V_MODEL){
              this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
              return;
            }
            if(!this.EXPSN_ATTR[i].V_MODEL_DTL[1]){
              this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목의 상세 주소는 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
              return;
            }
          }
        }
      }

      this.cuttTrnsfSave();
    },

    async cuttTrnsfSave(){
      let sUrl = '/api/palette/common/cuttTrnsfReg';
      let postParam = {
        CUTT_TRNSF_ID : this.selectedRow.CUTT_TRNSF_ID
        , STAT : 'MOD'
      }

      let headParam = {
        head : {
        }
      }

      for(let i in this.EXPSN_ATTR){
        if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'TXT'){ //문자형
          postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL;
          this.EXPSN_ATTR[i].V_POST_PARAM = this.EXPSN_ATTR[i].V_MODEL;
        }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'NUM' || this.EXPSN_ATTR[i].DATA_TYPE_CD === 'NUM_COMMA'){ //숫자형
          postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL;
          this.EXPSN_ATTR[i].V_POST_PARAM = this.EXPSN_ATTR[i].V_MODEL;
        }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'COE'){ //단일 선택형
          if(Array.isArray(this.EXPSN_ATTR[i].V_MODEL)){
            let lastVal = '';
            for(let k in this.EXPSN_ATTR[i].V_MODEL){
              if(this.EXPSN_ATTR[i].V_MODEL[k]) lastVal = this.EXPSN_ATTR[i].V_MODEL[k];
            }
            postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = lastVal;
            this.EXPSN_ATTR[i].V_POST_PARAM = lastVal;
          }else{
            postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL;
            this.EXPSN_ATTR[i].V_POST_PARAM = this.EXPSN_ATTR[i].V_MODEL;
          }
        }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'COE_MULTI'){ //다중 선택형
          let multiData = '';
          this.EXPSN_ATTR[i].V_MODEL.forEach((multi, idx) => {
            multiData += (multiData?',':'') + multi.value;
          });

          this.EXPSN_ATTR[i].V_POST_PARAM = multiData;
        }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'DAT'){ //날짜형
          if(this.EXPSN_ATTR[i].V_MODEL){
            postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].dateTimeDate.replace(/-/gi, '') + this.EXPSN_ATTR[i].selectedTime.replace(/:/gi, '')+(this.EXPSN_ATTR[i].selectedTime.split(':').length > 1?'':'00');
            this.EXPSN_ATTR[i].V_POST_PARAM = this.EXPSN_ATTR[i].dateTimeDate.replace(/-/gi, '') + this.EXPSN_ATTR[i].selectedTime.replace(/:/gi, '')+(this.EXPSN_ATTR[i].selectedTime.split(':').length > 1?'':'00');
          }
        }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'HASH'){ //해시태그
          let sHashTxt = '';
          let iCnt = 0;
          for(let k in this.EXPSN_ATTR[i].tags){
            if(this.EXPSN_ATTR[i].tags[k].text){
              if(this.EXPSN_ATTR[i].tags[k].active){
                sHashTxt += (iCnt>0?',':'') + this.EXPSN_ATTR[i].tags[k].text;
                iCnt++;
              }
            }
          }
          postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = sHashTxt;
          this.EXPSN_ATTR[i].V_POST_PARAM = sHashTxt;
        }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'POST'){ //우편번호
          postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL + '|' + (this.EXPSN_ATTR[i].V_MODEL_DTL[0]?this.EXPSN_ATTR[i].V_MODEL_DTL[0]:'') + '|' + (this.EXPSN_ATTR[i].V_MODEL_DTL[1]?this.EXPSN_ATTR[i].V_MODEL_DTL[1]:'');
          this.EXPSN_ATTR[i].V_POST_PARAM = this.EXPSN_ATTR[i].V_MODEL + '|' + (this.EXPSN_ATTR[i].V_MODEL_DTL[0]?this.EXPSN_ATTR[i].V_MODEL_DTL[0]:'') + '|' + (this.EXPSN_ATTR[i].V_MODEL_DTL[1]?this.EXPSN_ATTR[i].V_MODEL_DTL[1]:'');
        }
      }

      postParam.TRNSF_EXPSN_ATTR = JSON.stringify(this.EXPSN_ATTR);

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.getCuttTrnsfHstryList(); //이관 처리 현황 목록
        this.editable = false;
      }
    },

    // 엑셀 다운로드 필터
    showExceldownFilter(){
      this.dialogExcelFilter = true;
      this.onCheckboxClicked();
    },

    expsnAttrSchDialog(dialog) {
      this.TMP_SCH_CUST_ATTR = this.SCH_CUST_ATTR;
      this.TMP_SCH_TRNSF_ATTR = this.SCH_TRNSF_ATTR;
      this.cuttTrnsfHistgetExpsnAttr();
      this.dropSchDetail = dialog;
    },

    async cuttTrnsfHistgetExpsnAttr(){
      let sURL = '/api/palette/common/cuttTrnsfHistGetExpsnAttr';
      let postParams = {};
      let headParams ={
        head:{},
      };

      let response = await this.common_postCall(sURL, postParams, headParams);
      let codeName = ['CALL_TP', 'CHNL', 'CAMP_RS', 'TRNSF_STTS_CD','CUTT_HIST_SRCH']; //콜 유형과, 채널 공통코드
      if(!response.HEADER.ERROR_FLAG) {
        this.SCH_CUST_ATTR = [];
        this.SCH_TRNSF_ATTR = [];

        response.DATA.forEach((data, idx) => {
          if(data.DATA_TYPE_CD === 'COE'){ //단일 선택인 경우
            if(data.GROUP_CD_ID) codeName.push(data.GROUP_CD_ID); //공통코드사용을 위해 그룹코드가 있는 경우만
          }else if(data.DATA_TYPE_CD === 'COE_MULTI'){
            codeName.push(data.GROUP_CD_ID);
          }

          if (data.SE == 'CUSTOM') {
            if(!this.EXCEL_CUSTOM_ATTR.map(item => item.value).includes(data.EXPSN_ATTR_COL_ID)) {
              this.EXCEL_CUSTOM_ATTR.push({
                text: data.EXPSN_ATTR_NM,
                value: data.EXPSN_ATTR_COL_ID,
                SE: data.SE,
                ATTR_ID: data.ATTR_ID,
                DATA_TYPE_CD: data.DATA_TYPE_CD,
                GROUP_CD_ID: data.GROUP_CD_ID,
                INDI_INFO_ENCPT_YN: data.INDI_INFO_ENCPT_YN,
                chk: false,
                disabled: false
              });
            }

            if(data.SRCH_STNG_YN === 'Y') {
              data.V_ATTR_SCH_MODEL = '';
              this.TMP_SCH_CUST_ATTR.forEach((tmp, idx) => {
                if(tmp.ATTR_ID === data.ATTR_ID){
                  if(tmp.V_ATTR_SCH_MODEL) data.V_ATTR_SCH_MODEL = tmp.V_ATTR_SCH_MODEL;
                }
              });
              this.SCH_CUST_ATTR.push(data);
            }

          } else if (data.SE == 'TRNSF') {
            if(!this.EXCEL_TRNSF_ATTR.map(item => item.value).includes(data.EXPSN_ATTR_COL_ID)){
              this.EXCEL_TRNSF_ATTR.push({
                text: data.EXPSN_ATTR_NM,
                value: data.EXPSN_ATTR_COL_ID,
                SE: data.SE,
                ATTR_ID: data.ATTR_ID,
                DATA_TYPE_CD: data.DATA_TYPE_CD,
                GROUP_CD_ID: data.GROUP_CD_ID,
                INDI_INFO_ENCPT_YN: data.INDI_INFO_ENCPT_YN,
                chk: false,
                disabled: false
              });
            }

            if(data.SRCH_STNG_YN === 'Y') {
              data.V_ATTR_SCH_MODEL = '';
              this.TMP_SCH_TRNSF_ATTR.forEach((tmp, idx) => {
                if(tmp.ATTR_ID === data.ATTR_ID){
                  if(tmp.V_ATTR_SCH_MODEL) data.V_ATTR_SCH_MODEL = tmp.V_ATTR_SCH_MODEL;
                }
              });
              this.SCH_TRNSF_ATTR.push(data);
            }

          }

        });
        //공통코드설정
        this.common_code = await this.mixin_common_code_get_all(codeName);
      }
    },

    async downloadExcel(){

      // 체크된 속성을 쿠키에 저장
      // if(!this.$cookies.isKey("excelDnwldTrnsfhist")){

        this.$cookies.remove("excelDnwldTrnsfhist");

        let excelDnwldTrnsfhist = [];
        excelDnwldTrnsfhist[0] = this.CHK_CUSTOM_ATTR;
        excelDnwldTrnsfhist[1] = this.CHK_TRNSF_ATTR;
        excelDnwldTrnsfhist[2] = this.CHK_CUTT_ATTR;

        this.CHK_TOTAL = [];
        this.DRAG_TRNSF_ATTR.forEach((drag, idx) => {
          this.CHK_TOTAL.push(drag.value);
        });
        excelDnwldTrnsfhist[3] = this.CHK_TOTAL;

        this.$cookies.set("excelDnwldTrnsfhist", excelDnwldTrnsfhist);
      // }

      this.showAlert({
          alertDialogToggle: true
          , downloadable: true
          , msg: '선택하신 정보를 다운로드 하시겠습니까?<br>다운로드 시 데이터 양에 따라 다소 시간이 소요 됩니다.'
          , iconClass: 'is-info'
          , type: 'confirm'
          , callYes: () => {

            let downReason = this.$store.getters['alertStore/GE_ALERT'].downReason;
            if(downReason) downReason = downReason.replace(/\s/g, '');

            if(this.mixin_isEmpty(downReason)){
              this.$store.getters['alertStore/GE_ALERT'].downReasonChk = true;
            }else{
              // let arrTempCustomAttrId = [];
              // let arrTempConselAttrId = [];
              // let arrAttrId = [];

              // for(let i = 2 ; i<this.CHK_CUSTOM_ATTR.length;i++){
              //   arrTempCustomAttrId.push(this.CHK_CUSTOM_ATTR[i]);
              // }
              // for(let i = 1 ; i<this.CHK_TRNSF_ATTR.length;i++){
              //   arrTempConselAttrId.push(this.CHK_TRNSF_ATTR[i]);
              // }

              // let sHeaderData = '';
              // let sHeaderData = 'RNUM^No.^center,CUST_NM^고객명^left,CUST_PHN_NO^고객전화번호^left';
              // this.EXCEL_CUSTOM_ATTR.forEach((cust, idx) => {
              //   arrTempCustomAttrId.forEach((chk, seq) => {
                //     if(chk === cust.value){
                  //       arrAttrId.push(cust);
                  //       sHeaderData += (sHeaderData?',':'') + cust.value + '^' + cust.text + '^left';
                  //     }
                  //   });
                  // });
                  
                  // sHeaderData += ',NEW_TRNSF_NO^접수번호^left';
                  // this.EXCEL_TRNSF_ATTR.forEach((cusl, idx) => {
                    //   arrTempConselAttrId.forEach((chk, seq) => {
                      //     if(chk === cusl.value){
                        //       arrAttrId.push(cusl);
                        //       sHeaderData += (sHeaderData?',':'') + cusl.value + '^' + cusl.text + '^left';
                        //     }
                        //   });
                        // });
                        
              let sHeaderData = '';
              this.DRAG_TRNSF_ATTR.forEach((head, idx) => {
                sHeaderData += (sHeaderData?',':'') + head.value + '^' + head.text + '^left';
              });

              let convertSchKeyword = this.SCH_KEYWORD;

              if(this.SCH_KEY === 'CUST_PHN_NO') convertSchKeyword = convertSchKeyword.replace(/[^0-9]/g, '');

              let sURL = 'api/palette/common/cuttTrnsfHistExcelDwnld';
              let postParams = {
                SCH_STTS_CD : this.SCH_STTS_CD
                , SCH_ST_DTS : this.SCH_ST_DTS.replace(/-/gi, '')
                , SCH_END_DTS : this.SCH_END_DTS.replace(/-/gi, '')
                , SCH_CUTT_TYPE : this.SCH_CUTT_TYPE?this.SCH_CUTT_TYPE.value:''
                , LVL : this.SCH_CUTT_TYPE?this.SCH_CUTT_TYPE.LVL:''
                , SCH_KEY : this.SCH_KEY
                , SCH_KEYWORD : convertSchKeyword
                , SCH_CUST_EXPSN_ATTR : JSON.stringify(this.SCH_CUST_ATTR)
                , SCH_TRNSF_EXPSN_ATTR : JSON.stringify(this.SCH_TRNSF_ATTR)
                , AUTHRT_GROUP_ID : this.$store.getters['userStore/GE_USER_ROLE'].atrtGroupId
                , SCH_OLD_CUTT_TRNSF_ID : this.SCH_OLD_CUTT_TRNSF_ID
                , SCH_CUTT_TRNSF_ID : this.SCH_CUTT_TRNSF_ID

                , sFileName: '이관 처리현황'
                , sTitleName: '이관 처리현황'
                , iExcelLimitRowCnt: 10000
                , serviceNm: 'kr.co.hkcloud.palette3.common.palette.dao.PaletteCmmnMapper'
                , sqlId: 'cuttTrnsfHistExcelDwnldTbl'
                , DOWN_REASON: this.$store.getters['alertStore/GE_ALERT'].downReason
                , sHeaderData: sHeaderData
                , CUSTOM_ATTR: JSON.stringify(this.DRAG_TRNSF_ATTR)
                // , sHeaderData: '',
                // , CUSTOM_ATTR: '',
              };
              let headParams = {
                head: '',
              }
              this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
              this.requestServerExcelDownloadApi({
                url: sURL, // required
                headers: {
                  // required
                  Authorization: "",
                },
                callback: (data) => {
                  this.$store.commit("alertStore/hideAlert");
                },
                data: postParams,
              }, '이관 처리현황');
            }
          }
          , callNo: () => {
            this.$store.commit("alertStore/hideAlert");
          }
      });
    },

    onDragStart(event) {
      console.log('Drag started');
      console.log('Event:', event);
    },
    async onDragEnd(event) {
      console.log('Drag ended');
      console.log('Event:', event);
    },

    onCheckboxClicked(data) {
      if(data){
        this.DRAG_TRNSF_ATTR = [];
        this.EXCEL_CUSTOM_ATTR.forEach((cust, idx) => {
          this.CHK_CUSTOM_ATTR.forEach((chk, seq) => {
            if(chk === cust.value){
              this.DRAG_TRNSF_ATTR.push(cust);
            }
          });
        });

        this.EXCEL_TRNSF_ATTR.forEach((trnsf, idx) => {
          this.CHK_TRNSF_ATTR.forEach((chk, seq) => {
            if(chk === trnsf.value){
              this.DRAG_TRNSF_ATTR.push(trnsf);
            }
          });
        });
        
        this.EXCEL_CUTT_ATTR.forEach((cutt, idx) => {
          this.CHK_CUTT_ATTR.forEach((chk, seq) => {
            if(chk === cutt.value){
              this.DRAG_TRNSF_ATTR.push(cutt);
            }
          });
        });
      }else{
        //쿠키에 저장된 내용이있다면 엑셀 다운로드 속성을 쿠키에서 가져오기
        if(this.$cookies.isKey("excelDnwldTrnsfhist")){
          let tempArr = this.$cookies.get("excelDnwldTrnsfhist");
          this.CHK_CUSTOM_ATTR = tempArr[0];
          this.CHK_TRNSF_ATTR = tempArr[1];
          this.CHK_CUTT_ATTR = tempArr[2];
          this.CHK_TOTAL = tempArr[3];

          this.DRAG_TRNSF_ATTR = [];
          let arrTotalAttr = [...this.EXCEL_CUSTOM_ATTR, ...this.EXCEL_TRNSF_ATTR, ...this.EXCEL_CUTT_ATTR];
          this.CHK_TOTAL.forEach((chk, idx) => {
            arrTotalAttr.forEach((total, idx) => {
              if(chk === total.value){
                this.DRAG_TRNSF_ATTR.push(total);
              }
            });
          });
        }else{
          // this.CHK_CUSTOM_ATTR=['CUST_NM','CUST_PHN_NO',];
          // this.CHK_TRNSF_ATTR=['NEW_TRNSF_NO'];

          this.CHK_CUSTOM_ATTR = [];
          this.CHK_TRNSF_ATTR = [];
          this.CHK_CUTT_ATTR = [];
          this.CHK_TOTAL = [];

          this.DRAG_TRNSF_ATTR = [];
          this.EXCEL_CUSTOM_ATTR.forEach((cust, idx) => {
            this.CHK_CUSTOM_ATTR.push(cust.value);
            this.CHK_TOTAL.push(cust.value);
            this.DRAG_TRNSF_ATTR.push(cust);
          });

          this.EXCEL_TRNSF_ATTR.forEach((trnsf, idx) => {
            this.CHK_TRNSF_ATTR.push(trnsf.value);
            this.CHK_TOTAL.push(trnsf.value);
            this.DRAG_TRNSF_ATTR.push(trnsf);
          });
          
          this.EXCEL_CUTT_ATTR.forEach((cutt, idx) => {
            this.CHK_CUTT_ATTR.push(cutt.value);
            this.CHK_TOTAL.push(cutt.value);
            this.DRAG_TRNSF_ATTR.push(cutt);
          });
        }
      }
    }
  },
}
</script>

<style lang="scss" scoped>
</style>