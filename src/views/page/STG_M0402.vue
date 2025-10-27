<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                조회 기간
              </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form"
                    :items="mixin_common_code_get(this.COMMON_CODE,'CUST_REG_SCH_TP','전체')"
                    v-model="SCH_CUST_REG_TP"
                ></v-select>
              </div>
              <div class="pl-form-inline">
<!--                <div class="pl-calendar-range-form">-->
<!--                 <compo-date-picker-->
<!--                  v-model="SCH_ST_DTS"-->
<!--                  DateType="dateInput"-->
<!--                  :DateProp.sync="SCH_ST_DTS"-->
<!--                 />-->
<!--                 <span class="pl-unit">~</span>-->
<!--                 <compo-date-picker-->
<!--                  v-model="SCH_END_DTS"-->
<!--                  DateType="dateInput"-->
<!--                  :DateProp.sync="SCH_END_DTS"-->
<!--                 />-->
<!--                 <compo-drop-picker :StartDateProp.sync="SCH_ST_DTS" :EndDateProp.sync="SCH_END_DTS" />-->
<!--               </div>-->
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
                고객 상태
              </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form"
                    :items="mixin_common_code_get(this.COMMON_CODE,'CUST_ST','전체')"
                    v-model="CHC_CUST_ST"
                ></v-select>
                <!--    item-text="text"
                   item-value="text" -->
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                <v-select
                    class="pl-form"
                    :items="mixin_common_code_get(this.COMMON_CODE,'CUST_SRCH', '전체')"
                    v-model="CHC_CUST_SRCH"
                ></v-select>
              </span>
              <div class="pl-desc">
                <v-text-field
                    class="pl-form is-lg"
                    placeholder="검색어 입력"
                    v-model="INPT_CUST_SRCH"
                    oninput="javascript: this.value = this.value.replace(/[^a-z|A-Z|0-9|가-힣|ㄱ-ㅎ|ㅏ-ㅣ]/g, '' );"
                    @keyup.enter="getCustInfoList"
                />
              </div>
            </div>
            <!-- <div class="pl-form-inline">
              <span class="pl-label">휴대 전화번호</span>
              <div class="pl-desc">
                <v-text-field
                    class="pl-form is-lg"
                    placeholder="검색어 입력"
                    v-model="INPT_PHN_NUM"
                    @keyup.enter="getCustInfoList"
                    oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '' );"
                />
              </div>
            </div> -->
            <div class="d-flex">
              <v-btn
                class="pl-btn is-icon"
                @click="getCustInfoList"
              >
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
              <div v-if="SCH_CUST_ATTR.length > 0">
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
                    style="width: 420px">
                    <div
                      class="pl-drop-layer-body"
                      style="overflow-y: scroll; height: 300px">
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
                    <div class="pl-drop-layer-footer justify-end">
                      <v-btn class="pl-btn is-sub" @click="dropSchDetail=false">닫기</v-btn>
                      <v-btn class="pl-btn" @click="[getCustInfoList(), dropSchDetail=false]">조회</v-btn>
                    </div>
                  </div>
                </v-slide-y-transition>
              </div>

            </div>
          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body">
        <div class="pl-grid-top">
          <div class="pl-grid-top-left">
            <v-btn class="pl-btn is-icon is-sub"
                   :disabled="DTL_BTN_DISABLE"
                   @click="openDialog">
              <span class="pl-icon20 document"></span>
              선택항목 상세
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ CUST_GRID_ITEMS.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <!-- <compo-excel
              TypeProp="Download"
              :DataHeaderProp="CUST_GRID_HEADERS"
              :DataBodyProp="CUST_GRID_ITEMS"
              :FileNameProp="'고객정보관리_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
              SheetNameProp="고객정보관리"
              HeaderColorProp="00B0F0"
            ></compo-excel> -->
            <compo-tooltip-btn
              v-if="this.mixin_set_btn(this.$options.name, 'btnCustListExcelDown')"
              TitleProp="엑셀 다운로드"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 exceldown"
              TooltipPositionProp="bottom"
              :DisabledProp="CUST_GRID_ITEMS.length > 0?false:true"
              @btnClick="showExceldownFilter()"
            ></compo-tooltip-btn>
          </div>
        </div>
        <v-data-table
            class="pl-grid"
            :headers="CUST_GRID_HEADERS"
            :items="CUST_GRID_ITEMS"
            :item-class="isActiveRow"
            fixed-header
            style="cursor:pointer;"
            item-key="CUST_ID"
            height="562px"
            :items-per-page="ROW_PER_PAGE"
            hide-default-footer
            :page.sync="page"
            @page-count="pageCount = $event"
            @dblclick:row="rowDblClick"
            @click:row="rowClick"
            no-data-text="등록된 데이터가 없습니다."
        >
          <!-- <template v-slot:item.CUST_NM="{ item }">
            {{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(item.CUST_NM) : item.CUST_NM }}
          </template>
          <template v-slot:item.CUST_PHN_NO="{ item }">
            {{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(item.CUST_PHN_NO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(item.CUST_PHN_NO.replace(/[^0-9]/g, "")) }}
          </template> -->
          <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in CUST_GRID_HEADERS">
            <div v-if="header.telYn">
              <span v-if="item[header.value]">{{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(item[header.value].replace(/[^0-9]/g, "")) : mixin_setPhoneNo(item[header.value].replace(/[^0-9]/g, "")) }}</span>
            </div>
            <div v-else>
              <span v-if="header.value === 'CUST_NM'">
                {{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(item[header.value]) : item[header.value] }}
              </span>
              <span v-else-if="header.value === 'REG_DT' || header.value === 'MDFCN_DT'">
                {{ mixin_convertDate(item[header.value], 'yyyy-MM-dd HH:mm:ss') }}
              </span>
              <span v-else>{{ item[header.value] }}</span>
            </div>
          </template>
          <!-- show-select
          single-select -->
        </v-data-table>
        <!-- :width="autoWidth" -->
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

          <span class="pl-pager-period">보기 {{ mixin_getPagePeriod(CUST_GRID_ITEMS, page) }} / {{
              CUST_GRID_ITEMS.length
            }}
         <compo-tooltip-btn
             TitleProp="다음 검색"
             ClassProp="pl-tooltip-btn is-line"
             IconProp="pl-icon20 arrow-next-paging"
             TooltipPositionProp="bottom"
             @btnClick="getCustInfoList('next')"
             :DisabledProp="nextDisabled"
         ></compo-tooltip-btn>
          </span>
        </div>
      </div>
    </div>
    <!-- dialog -->
    <v-dialog
        v-model="dialogSelectedDetail"
        content-class="dialog-draggable is-scroll"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="고객 상세 정보"
          @hide="mixin_hideDialog('SelectedDetail')"
      >
        <template slot="body">
          <!-- <v-form ref="form"> -->
          <ul class="pl-list-dot is-no-border mt-0">
            <li>고객 정보 변경 시 수정이력은 시스템에 자동 기록되어 집니다.</li>
            <li>필수 항목을 입력하신 후 <strong>[저장]</strong> 버튼을 클릭하십시오.</li>
          </ul>
          <div class="pl-form-inline-wrap vertical mt-2">
            <div class="pl-form-inline">
                <span class="pl-label">
                  고객명
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
              <div class="pl-desc">
                <v-text-field class="pl-form"
                              v-model="EDIT_CUST_DATA[0].CUST_NM"
                              v-byte-counter="300"
                />
              </div>
            </div>
            <div class="pl-form-inline">
                <span class="pl-label">
                  고객 ID
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
              <div class="pl-desc">
                <v-text-field class="pl-form"
                              disabled
                              v-model="EDIT_CUST_DATA[0].CUST_ID"
                              v-byte-counter="60"
                />
              </div>
            </div>
            <div
                v-for="(expsnAttr, seq) in EXPSN_ATTR"
                :key="expsnAttr.ATTR_ID"
                class="pl-form-inline">
            <span class="pl-label">
              {{ expsnAttr.EXPSN_ATTR_NM }}
              <v-icon v-show="expsnAttr.ESNTL_YN === 'Y'" class="pl-icon20 required"></v-icon> <!-- 필수 입력인 경우  -->
            </span>
              <div class="pl-desc">
                <template v-if="editable">
                  <!-- 단일 선택형인 경우 -->
                  <v-select
                      v-if="expsnAttr.DATA_TYPE_CD === 'COE'"
                      v-model="expsnAttr.V_MODEL"
                      class="pl-form"
                      :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                      :items="mixin_common_code_get(common_code, expsnAttr.GROUP_CD_ID)"
                      placeholder="선택하세요"
                  />
                  <!-- 문자형이고 데이터 길이가 200보다 작거나 같은 경우 -->
                  <v-text-field
                      v-else-if="expsnAttr.DATA_TYPE_CD === 'TXT' && expsnAttr.DATA_LEN <= 200"
                      v-model="expsnAttr.V_MODEL"
                      class="pl-form"
                      :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                      :maxlength="expsnAttr.DATA_LEN"
                      placeholder=""
                      v-byte-counter="expsnAttr.DATA_LEN"
                  />
                  <!-- 다중 선택인 경우 -->
                  <div class="pl-desc" style="width:311px" v-else-if="expsnAttr.DATA_TYPE_CD === 'COE_MULTI'">
                    <v-autocomplete
                      v-model="expsnAttr.V_MODEL"
                      return-object
                      class="pl-form is-auto"
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
                  </div>
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
                      class="pl-form"
                      :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                      :maxlength="expsnAttr.DATA_LEN"
                      hide-spin-buttons
                      type="number"
                      oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                      placeholder="숫자만 입력 가능 합니다."
                      v-byte-counter="expsnAttr.DATA_LEN"
                  />
                  <!-- 숫자형이면서 comma가 포함인 경우 -->
                    <v-text-field
                      v-else-if="expsnAttr.DATA_TYPE_CD === 'NUM_COMMA'"
                      v-model="expsnAttr.V_MODEL"
                      class="pl-form"
                      :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                      :maxlength="expsnAttr.DATA_LEN"
                      hide-spin-buttons
                      type="text"
                      oninput="javascript: this.value = this.value.replace(/[^,.0-9]/g, '' ).replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');"
                      placeholder="숫자만 입력 가능 합니다."
                      v-byte-counter="expsnAttr.DATA_LEN"
                    />
                    <!-- 전화번호인 경우 -->
                    <v-text-field
                      v-else-if="expsnAttr.DATA_TYPE_CD === 'TEL'"
                      v-model="expsnAttr.ATTR_VL"
                      class="pl-form"
                      :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                      :maxlength="expsnAttr.DATA_LEN"
                      placeholder=""
                      hide-spin-buttons
                      type="text"
                      @keyup="setExpsnAttrPhoneNo(expsnAttr)"
                      oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                      v-byte-counter="expsnAttr.DATA_LEN"
                    />
                  <!-- 우편번호인 경우 -->
                  <div v-else-if="expsnAttr.DATA_TYPE_CD === 'POST'">
                    <div>
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
                    </div>
                    <div class="mt-2">
                      <v-text-field v-if="expsnAttr.V_MODEL_DTL && expsnAttr.V_MODEL_DTL.length > 0"
                          v-model="expsnAttr.V_MODEL_DTL[0]"
                          class="pl-form"
                          :ref="`V_MODEL_ADDR_${seq}`"
                          disabled
                          style="width: 100%;"
                      />
                    </div>
                    <div class="mt-2">
                      <v-text-field v-if="expsnAttr.V_MODEL_DTL && expsnAttr.V_MODEL_DTL.length > 0"
                          v-model="expsnAttr.V_MODEL_DTL[1]"
                          class="pl-form"
                          :ref="`V_MODEL_DTL_ADDR_${seq}`"
                          style="width: 100%;"
                          v-byte-counter="expsnAttr.DATA_LEN"
                      />
                    </div>
                  </div>
                  <!-- 해시태크인 경우 -->
                  <div class="pl-tags-wrap" v-else-if="expsnAttr.DATA_TYPE_CD === 'HASH'">
                    <v-chip-group
                        active-class="active-tag"
                        column
                    >
                      <template v-for="tag, index in expsnAttr.tags">
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
                        {{ expsnAttr.EXPSN_ATTR_NM }} 알림시간
                      </div>
                      <div class="pl-drop-layer-body">
                        <ul class="pl-drop-layer-list">
                          <li
                              v-for="(time, index) in times" :key="index"
                              class="d-flex justify-space-between"
                              @click="selectReserveDateTime(`${seq}`,time.date)">
                            <span>{{ time.label }}</span> <span>{{ displayReserveTime(`${seq}`, time.date) }}</span>
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
                </template>
                <!-- <template v-else>
                  {{ expsnAttr.DATA_TYPE_CD === 'COE' || expsnAttr.DATA_TYPE_CD === 'COE_MULTI' ? expsnAttr.CD_NM : mixin_encodeEnter(expsnAttr.ATTR_VL) }}
                </template> -->
                <template v-else>
                  <template v-if="expsnAttr.DATA_TYPE_CD === 'COE' || expsnAttr.DATA_TYPE_CD === 'COE_MULTI'">
                    <div v-html="expsnAttr.CD_NM"></div>
                  </template>
                  <template v-else-if="expsnAttr.EXPSN_ATTR_COL_ID !== 'CUSL_CN' && (expsnAttr.DATA_TYPE_CD === 'TXT' || expsnAttr.DATA_TYPE_CD === 'NUM' || expsnAttr.DATA_TYPE_CD === 'POST')">
                    <template v-if="expsnAttr.INDI_INFO_ENCPT_YN === 'Y'">
                      <div v-html="mixin_getCustcoSetting('ENV_INDIINFO_MASKING_YN') ? mixin_mask_info(expsnAttr.ATTR_VL): mixin_encodeEnter(expsnAttr.ATTR_VL)"></div>
                    </template>
                    <template v-else>
                      <div v-html="mixin_encodeEnter(expsnAttr.ATTR_VL)"></div>
                    </template>
                  </template>
                  <template v-else-if="expsnAttr.DATA_TYPE_CD === 'TEL'">
                    <div>{{ expsnAttr.ATTR_VL ? mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(expsnAttr.ATTR_VL.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(expsnAttr.ATTR_VL.replace(/[^0-9]/g, "")) : expsnAttr.ATTR_VL }}</div>
                  </template>
                  <template v-else>
                    <div v-html="mixin_encodeEnter(expsnAttr.ATTR_VL)"></div>
                  </template>
              </template>
              </div>
            </div>

          </div>
          <!-- </v-form> -->
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="closeDialog">닫기</v-btn>
          <v-btn class="pl-btn" @click="showAlert(MESSAGE.CONFIRM.REG)">저장</v-btn>
        </template>

      </compo-dialog>
    </v-dialog>
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
              <div class="pl-scroll-body d-flex flex-column is-mt-m" style="overflow-y: scroll; height: calc(100vh - 400px); gap: 10px">
                <div
                  class="pl-tag-line d-flex justify-content-start text-left"
                  style="flex-wrap: wrap; width: 100%; height: auto; min-height: 30px"
                  v-for="(chk01, idx) in EXCEL_CUSTOM_ATTR"
                  v-if="idx < 14"
                  :key="chk01.value">
                  <v-checkbox
                    class="pl-check flex-grow-1 pl-4"
                    v-model="CHK_CUSTOM_ATTR"
                    return-object
                    :label="chk01.text"
                    :disabled="chk01.disabled"
                    :value="chk01.value"
                  ></v-checkbox>
                </div>
              </div>
            </div>
            <div class="ml-4">
              <h2 class="pl-dialog-body-tit-h2 is-border">고객 정보 항목</h2>
              <div class="pl-scroll-body d-flex flex-column is-mt-m" style="overflow-y: scroll; height: calc(100vh - 400px); gap: 10px">
                <div
                  class="pl-tag-line d-flex justify-content-start text-left"
                  style="width: 100%;"
                  v-for="(chk01, idx) in EXCEL_CUSTOM_ATTR"
                  v-if="idx >= 14"
                  :key="chk01.value">
                  <v-checkbox
                    class="pl-check flex-grow-1 pl-4 "
                    v-model="CHK_CUSTOM_ATTR"
                    return-object
                    :label="chk01.text"
                    :value="chk01.value"
                    :disabled="chk01.disabled"
                  ></v-checkbox>
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
export default {
  name: "MENU_STG_M0402", //name은 'MENU_' + 파일명 조합
  components: {},
  data() {
    return {
      // search top

      // dialog
      dialogSelectedDetail: false,

      DTL_BTN_DISABLE: true,

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15, 30, 50, 100],
      ROW_PER_PAGE: 15,


      /* 공통코드 */
      COMMON_CODE: [],

      /* 콤보박스 선택 아이템 */

      CHC_CUST_ST: '',
      CHC_CUST_SRCH: '',
      CHC_CUST_ID: -1,
      INPT_CUST_SRCH: '',
      INPT_PHN_NUM: '',

      /* 고객정보 리스트 헤더 */

      CUST_GRID_HEADERS: [],

      selectedGridItem: [],           // 선택한 고객
      CUST_GRID_ITEMS: [],

      EDIT_CUST_DATA: [{CUST_ID: null, CUST_NM: null}],

      Items: [],

      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      },
      nextDisabled: false,

      origiData: [],
      gridDataText: [],
      gridDataHeaders: [],
      headerTxt: [],

      EXPSN_ATTR: [],
      GRID_EXPSN_ATTR: [],
      SELECTED_ATTR_INDEX: [],   // 선택된 확장 속성 INDEX

      dialogFindPost: false,
      POST_DATA: '',

      editable: false,

      CUST_INFO_DTL: [],
      MESSAGE: {
        CONFIRM: {
          REG: {
            alertDialogToggle: true,
            msg: '고객 정보를 저장 하시겠습니까?',
            iconClass: 'is-info',
            type: 'confirm',
            callYes: this.custSaveValidate,
            callNo: this.closeMsg
          }
        },
        ALERT: {
          SUCCESS: {alertDialogToggle: true, msg: '정상 처리 되었습니다.', iconClass: 'is-info', type: 'default'}
        },
        ERROR: {
          ERROR: {
            alertDialogToggle: true,
            msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.',
            iconClass: 'is-caution',
            type: 'default'
          }
        },
        TOAST : {
          SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
        },
      },
      saveBeforeCustSelectData: [],
      saveCustDataDiff: [],

      SCH_CUST_REG_TP: '',
      startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      SCH_ST_DTS: '',
      SCH_END_DTS: '',

      // 엑셀 다운로드 dialog
      dialogExcelFilter: false,
      EXCEL_CUSTOM_ATTR: [
        { text: '고객명', value : 'CUST_NM', chk: true, disabled: true, },
        { text: '고객전화번호', value : 'CUST_PHN_NO', chk: true, disabled: true, },
      ],
      CHK_CUSTOM_ATTR: ['CUST_NM', 'CUST_PHN_NO'],

      dropSchDetail: false,
      TMP_SCH_CUST_ATTR : [],
      SCH_CUST_ATTR : [],
    }
  },

  watch: {
    selectedGridItem() {
      if (!this.mixin_isEmpty(this.selectedGridItem)) {
        this.DTL_BTN_DISABLE = false;
      } else if (this.mixin_isEmpty(this.selectedGridItem)) {
        this.DTL_BTN_DISABLE = true;
      }
    },
  },

  computed: {},

  created() {
    //  this.getCustInfo({CUST_ID : -1});

    this.SCH_ST_DTS = this.$moment(this.startDate).subtract(7,'days').format('YYYY-MM-DD'); // 시작 일자(일주일전)
    this.SCH_END_DTS = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); // 종료 일자

    this.cuttHistgetExpsnAttr(); // 확장항목 속성 조회
  },

  async mounted() {

    // this.initHeader();

    this.getCustInfoList();

    // this.getExpsnAttrList();
    this.expsnAttrSchDialog(false);

    this.CUST_GRID_HEADERS = [];

    // this.getExpsnAttr();
    //  this.getCustDetail({CUST_ID : -1});
    //  this.getGridHeaders();

    /* 공통코드설정 */

    let codeName = ['CUST_ST'                   // 고객 상태
      , 'CUST_TP'                   // 고객 유형
      , 'CUST_DV'                   // 고객 구분
      , 'CUST_SRCH'                 // 고객 검색조건
      , 'CUST_REG_SCH_TP'           // 고객 등록 일자 검색조건
    ];

    this.COMMON_CODE = await this.mixin_common_code_get_all(codeName);
  },

  methods: {
    setExpsnAttrPhoneNo(field){
      let telNo = field.ATTR_VL;
      telNo = this.mixin_setPhoneNo(telNo.replace(/\D/g, ""));
      field.V_MODEL = telNo;
      field.ATTR_VL = telNo;
    },

    //확장속성 전화번호 체크
    async expsnAttrPhnNoCheck() {
      let result = true;

      for (const attr of this.EXPSN_ATTR) {
        if(attr.DATA_TYPE_CD === 'TEL' && attr.V_MODEL){
          let sUrl = '/api/setting/customer/custTelNoCheck';
          let postParam = {
            CUST_ID : this.EDIT_CUST_DATA[0].CUST_ID
            , ATTR_ID : attr.ATTR_ID
            , CUST_PHN_NO : attr.V_MODEL.replace(/[^0-9]/g, "")
          }

          let response = await this.common_postCall(sUrl, postParam, {head :{}});

          if (!response.HEADER.ERROR_FLAG) {
            if(response.DATA[0].CUST_PHN_NO_EXIST_YN === 'Y'){
              result = false;
              this.showAlert({alertDialogToggle: true, msg: '추가로 등록한 '+attr.V_MODEL+' 번호는 이미 등록된 전화번호 입니다.<br/>전화번호는 중복하여 등록이 불가 합니다.', iconClass: 'is-info', type: 'default'});
              break;
            }
          }else{
            result = false;
            this.showAlert(this.MESSAGE.ERROR.ERROR);
            break;
          }
        }
      }

      return result;
    },
    // initHeader() {

    //   this.CUST_GRID_HEADERS = [
    //     {text: '번호', value: 'index', align: 'center', width: '70px', sortable: false},
    //     {text: '고객명', value: 'CUST_NM', width: '100px'},
    //     {text: '고객 ID', value: 'CUST_ID', width: '100px'},
    //     {text: '고객 전화번호', value: 'CUST_PHN_NO', align: 'center', width: '120px'},
    //   ];

    // },
    initSelectCust() {
      this.selectedGridItem = [];
      this.EDIT_CUST_DATA = [{CUST_ID: null, CUST_NM: null}];
      this.saveBeforeCustSelectData = [];
      this.saveCustDataDiff = [];
    },

    /**************************************
            고객정보 리스트 가져오기
     **************************************/

    async getCustInfoList(next) {

      this.initSelectCust(); // 선택 사용자 초기화
      // this.initHeader();

      if (next !== 'next') {
        this.CUST_GRID_ITEMS = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let sUrl = '/api/setting/customer/info-list/cstmrinfo-inqire-popup/inqire';

      let postParam = {
        CUST_STAT: this.CHC_CUST_ST === '전체' ? '' : this.CHC_CUST_ST,
        SCH_GB: this.CHC_CUST_SRCH,
        SCH_KEYWORD: this.INPT_CUST_SRCH.replace(/-/g, ''),
        SE: 'CUSTOM',
        // EXPSN_ATTR: this.GRID_EXPSN_ATTR,
        SCH_CUST_REG_TP : this.SCH_CUST_REG_TP,
        SCH_ST_DTS : this.SCH_ST_DTS.replace(/-/gi, ''),
        SCH_END_DTS : this.SCH_END_DTS.replace(/-/gi, ''),
        EMPTY_PHN_NO_CHK : 'N',
        SCH_CUST_EXPSN_ATTR : JSON.stringify(this.SCH_CUST_ATTR),
        CUST_LIKE_SCH_USE_YN: (this.mixin_getCustcoSetting('ENV_CUST_LIKE_SCH_USE_YN')?'Y':'N') //고객 LIKE 검색 사용 여부
      };

      let headParam = {
        head: {
          "SERVICE": "setting.customer.info-list.cstmrinfo-inqire-popup",
          "METHOD": "inqire",
          "TYPE": "BIZ_SERVICE",
          "ROW_CNT": this.pagination.rowsPerPage,
          "PAGES_CNT": this.pagination.page,
          "PAGING": "Y",
          // DATA_OBJECT : "EXPSN_ATTR"
        }
      }
      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
      let response = await this.common_postCall(sUrl, postParam, headParam);

      let idx = this.CUST_GRID_ITEMS.length + 1;
      if (!response.HEADER.ERROR_FLAG) {
        this.CUST_GRID_HEADERS = [
          {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '60px', sortable: false, telYn : false},
          {text: '고객명', value: 'CUST_NM', width: '100px', telYn : false},
          {text: '고객 ID', value: 'CUST_ID', width: '80px', telYn : false},
          {text: '고객 전화번호', value: 'CUST_PHN_NO', width: '130px', telYn : true},
        ];

        /* 확장속성 헤더 추가 */
        response.EXPSN_ATTR.forEach((cust, idx) => {
          const maxBytes = new TextEncoder().encode(cust.EXPSN_ATTR_NM);
          this.CUST_GRID_HEADERS.push({
            text: cust.EXPSN_ATTR_NM,
            value: cust.EXPSN_ATTR_COL_ID.toUpperCase()+'_NM',
            width: ((maxBytes.byteLength<7?10:maxBytes.byteLength>20?20:maxBytes.byteLength) * 12) + 'px',
            sortable: false,
            telYn : cust.DATA_TYPE_CD === 'TEL' ? true : false
          });
        });

        this.CUST_GRID_HEADERS.push({text: '최초 등록일시', value: 'REG_DT', align: 'center', width: '150px', sortable : false, telYn : false});
        this.CUST_GRID_HEADERS.push({text: '마지막 수정일시', value: 'MDFCN_DT', align: 'center', width: '150px', sortable : false, telYn : false});

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

        for (let i in tempDataText) {
          tempDataText[i]["ROW_NUMBER"] = idx++;
        }

        this.CUST_GRID_ITEMS = [...this.CUST_GRID_ITEMS, ...tempDataText]

        if (response.HEADER.next !== null && response.HEADER.next !== undefined) {
          if (response.HEADER.next === true) {
            this.nextDisabled = false //버튼 활성화
          } else {
            this.nextDisabled = true  //버튼 비활성화
          }
        }
        //이부분은 체크해볼것
        this.pagination.page += 1
      }
    },

    /****************************************************

              상세 모달 확장 정보 속성 가져오기

     ****************************************************/

    async getExpsnAttrList(data) {
      let sUrl = '/api/setting/expsnAttr/expsnAttrList';
      let postParam = {
        SE: 'CUSTOM' //상담내용 확장항목
        , BSC_PVSN_ATTR_YN: "N" //기본 제공 속성이 아닌것
      }

      let headParam = {
        head: {
          ROW_CNT: 500,
          PAGES_CNT: 1,
          PAGING: "Y",
        }
      }

      let response = await this.common_postCall(sUrl, postParam, headParam);

      let expsnAttrData = [];
      this.SCH_CUST_ATTR = [];
      for (let i in response.DATA) {
        if (response.DATA[i].EXPSN_ATTR_COL_ID === 'CAMP_RS') { //처리 결과인 경우 캠페인 id가 있을 경우에만 노출 처리
          if (this.CPI_ID) expsnAttrData.push(response.DATA[i]);
        } else {
          expsnAttrData.push(response.DATA[i]);
        }

        if(response.DATA[i].SRCH_STNG_YN === 'Y') {
          response.DATA[i].V_ATTR_SCH_MODEL = '';
          this.TMP_SCH_CUST_ATTR.forEach((tmp, idx) => {
            if(tmp.ATTR_ID === response.DATA[i].ATTR_ID){
              if(tmp.V_ATTR_SCH_MODEL) response.DATA[i].V_ATTR_SCH_MODEL = tmp.V_ATTR_SCH_MODEL;
            }
          });
          this.SCH_CUST_ATTR.push(response.DATA[i]);
        }
      }


      let codeName = ['CALL_TP', 'CHNL', 'CAMP_RS']; //콜 유형과, 채널 공통코드
      if(expsnAttrData.length > 0){
        expsnAttrData.forEach((attr, idx) => {
          if(attr.DATA_TYPE_CD === 'COE' || attr.DATA_TYPE_CD === 'COE_MULTI'){
            if(attr.GROUP_CD_ID) codeName.push(attr.GROUP_CD_ID); //공통코드사용을 위해
          }
        });
      }

      //공통코드설정
      this.common_code = await this.mixin_common_code_get_all(codeName);
      this.EXPSN_ATTR = expsnAttrData;
    },

    /******************************************************************
     고객상세정보모달 고객별 조회

     고객리스트에 표시되는 항목들은 화면노출여부가 'Y'인 항목들만 가져옴.
     그 이외의 항목들을 조회하기 위해 따로 호출
     ******************************************************************/

    async getCustInfoDtl(data) {

      //변경이력 초기화.
      this.saveBeforeCustSelectData = [];
      this.saveCustDataDiff = [];

      let sUrl = '/api/setting/customer/custSelect';

      let postParam = {
        CUST_ID: data.CUST_ID,
        CUST_NM: data.CUST_NM
      }

      let headParam = {
        head: {}
      }

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {

        if (data.CUST_ID == -1) this.editable = true;

        //변경이력 처리용도
        this.saveBeforeCustSelectData = response.DATA;

        //고객 확장 정보
        this.EXPSN_ATTR = response.CUST_EXPSN_INFO;

        this.EXPSN_ATTR.forEach((attr, idx) => {
          attr.V_MODEL = attr.ATTR_VL; //동적 v_model 생성

          if(attr.DATA_TYPE_CD === 'DAT'){ //날짜형인 경우
            attr.V_MODEL = attr.ATTR_VL ? true : false; //chkDateReserve
            attr.V_MODEL_DATE = attr.ATTR_VL; //날짜 v_model
            attr.chkDateReserve = false; //chkDateReserve
            attr.dateReservePicker = false; //dateReservePicker
            attr.dropDateReserve = false; //dropDateReserve
            attr.dateTimeDate = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); //dateTimeDate
            attr.dateTimeTime = new Date(); //dateTimeTime
            attr.selectedTime = ''; //selectedTime
            attr.selectedAmpm = ''; //selectedAmpm
          } else if (attr.DATA_TYPE_CD === 'POST') { //우편번호인 경우
            if (attr.ATTR_VL) {
              let arrAddrInfo = (attr.ATTR_VL ? attr.ATTR_VL.split('|') : '');
              attr.V_MODEL = (arrAddrInfo ? arrAddrInfo[0] : ''); //주소 v_model
              attr.V_MODEL_DTL = [];
              attr.V_MODEL_DTL[0] = (arrAddrInfo ? arrAddrInfo[1] : ''); //상세 주소1 v_model
              attr.V_MODEL_DTL[1] = (arrAddrInfo ? arrAddrInfo[2] : ''); //상세 주소2 v_model
            } else {
              attr.V_MODEL_DTL = [];
              attr.V_MODEL_DTL[0] = ''; //상세 주소1 v_model
              attr.V_MODEL_DTL[1] = ''; //상세 주소2 v_model
            }
          } else if (attr.DATA_TYPE_CD === 'COE') { //단일 선택인 경우
          } else if (attr.DATA_TYPE_CD === 'COE_MULTI') { //다중 선택인 경우
            attr.V_MODEL = [];

            let items = this.mixin_common_code_get(this.common_code, attr.GROUP_CD_ID);
            let cdNms = '';
            if(attr.ATTR_VL){
              items.forEach((code, idx) => {
                attr.ATTR_VL.split(',').forEach((data, seq) => {
                  if(code.value === data){
                    attr.V_MODEL.push(code);
                    cdNms += (cdNms?',':'')+code.text;
                  }
                });
              });
            }
            attr.CD_NM = cdNms;
          } else if (attr.DATA_TYPE_CD === 'HASH') { //해시태그인 경우
            attr.tags = [];
            if (attr.ATTR_VL) {
              for (let idx in attr.ATTR_VL.split(',')) {
                attr.tags[idx] = attr.ATTR_VL.split(',')[idx];
              }
            }
            attr.inputTagSize = '';
          } else if (attr.DATA_TYPE_CD === 'TEL') { //전화번호인 경우
            attr.ATTR_VL = this.mixin_setPhoneNo(attr.ATTR_VL);
            attr.V_MODEL = this.mixin_setPhoneNo(attr.ATTR_VL);
          }
        });
      }
    },

    //고객 정보 저장 validate
    async custSaveValidate() {

      if (this.EDIT_CUST_DATA[0].CUST_NM === '') {
        this.showAlert({alertDialogToggle: true, msg: '고객명은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
        return;
      }
      for (let i in this.EXPSN_ATTR) {
        if (this.EXPSN_ATTR[i].ESNTL_YN === 'Y') { //필수 입력인 경우
          if (this.EXPSN_ATTR[i].DATA_TYPE_CD === 'TXT') { //문자형
            if (!this.EXPSN_ATTR[i].V_MODEL) {
              this.showAlert({
                alertDialogToggle: true,
                msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.',
                iconClass: 'is-caution',
                type: 'default'
              });
              return;
            } else {
              if (this.EXPSN_ATTR[i].V_MODEL.length > this.EXPSN_ATTR[i].DATA_LEN) {
                this.showAlert({
                  alertDialogToggle: true,
                  msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 0 ~ ' + this.EXPSN_ATTR[i].DATA_LEN + 'byte 이내로 입력해 주세요.',
                  iconClass: 'is-caution',
                  type: 'default'
                });
                return;
              }
            }
          } else if (this.EXPSN_ATTR[i].DATA_TYPE_CD === 'NUM' || this.EXPSN_ATTR[i].DATA_TYPE_CD === 'NUM_COMMA') { //숫자형
            if (!this.EXPSN_ATTR[i].V_MODEL) {
              this.showAlert({
                alertDialogToggle: true,
                msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.',
                iconClass: 'is-caution',
                type: 'default'
              });
              return;
            } else {
              if (this.EXPSN_ATTR[i].V_MODEL.length > this.EXPSN_ATTR[i].DATA_LEN) {
                this.showAlert({
                  alertDialogToggle: true,
                  msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 0 ~ ' + this.EXPSN_ATTR[i].DATA_LEN + 'byte 이내로 입력해 주세요.',
                  iconClass: 'is-caution',
                  type: 'default'
                });
                return;
              }
            }
          } else if (this.EXPSN_ATTR[i].DATA_TYPE_CD === 'COE') { //단일 선택형
            if (Array.isArray(this.EXPSN_ATTR[i].V_MODEL)) {
              let iCnt = 0;
              for (let k in this.EXPSN_ATTR[i].V_MODEL) {
                if (this.EXPSN_ATTR[i].V_MODEL[k]) iCnt++;
              }
              if (iCnt === 0) {
                this.showAlert({
                  alertDialogToggle: true,
                  msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.',
                  iconClass: 'is-caution',
                  type: 'default'
                });
                return;
              }
            } else {
              if (!this.EXPSN_ATTR[i].V_MODEL) {
                this.showAlert({
                  alertDialogToggle: true,
                  msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.',
                  iconClass: 'is-caution',
                  type: 'default'
                });
                return;
              }
            }
          } else if (this.EXPSN_ATTR[i].DATA_TYPE_CD === 'COE_MULTI') { //다중 선택형
            if(this.EXPSN_ATTR[i].V_MODEL.length === 0){
              this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
              return;
            }
          } else if (this.EXPSN_ATTR[i].DATA_TYPE_CD === 'DAT') { //날짜형
            if (!this.EXPSN_ATTR[i].V_MODEL_DATE) {
              this.showAlert({
                alertDialogToggle: true,
                msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.',
                iconClass: 'is-caution',
                type: 'default'
              });
              return;
            }
          } else if (this.EXPSN_ATTR[i].DATA_TYPE_CD === 'HASH') { //해시태그
            let sHashTxt = '';
            let iCnt = 0;
            let iChkCnt = 0;
            for (let k in this.EXPSN_ATTR[i].tags) {
              if (this.EXPSN_ATTR[i].tags[k]) iCnt++;

              if (this.EXPSN_ATTR[i].tags[k].text) {
                sHashTxt += (iChkCnt > 0 ? ',' : '') + this.EXPSN_ATTR[i].tags[k].text;
                iChkCnt++;
              }
            }
            if (iCnt === 0) {
              this.showAlert({
                alertDialogToggle: true,
                msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.',
                iconClass: 'is-caution',
                type: 'default'
              });
              return;
            } else {
              if (sHashTxt.length > this.EXPSN_ATTR[i].DATA_LEN) {
                this.showAlert({
                  alertDialogToggle: true,
                  msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 0 ~ ' + this.EXPSN_ATTR[i].DATA_LEN + 'byte 이내로 입력해 주세요.',
                  iconClass: 'is-caution',
                  type: 'default'
                });
                return;
              }
            }
          } else if (this.EXPSN_ATTR[i].DATA_TYPE_CD === 'POST') { //우편번호
            if (!this.EXPSN_ATTR[i].V_MODEL) {
              this.showAlert({
                alertDialogToggle: true,
                msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.',
                iconClass: 'is-caution',
                type: 'default'
              });
              return;
            }
            if (!this.EXPSN_ATTR[i].V_MODEL_DTL[1]) {
              this.showAlert({
                alertDialogToggle: true,
                msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목의 상세 주소는 필수 입력 항목 입니다.',
                iconClass: 'is-caution',
                type: 'default'
              });
              return;
            }
          }
        }
      }

      /**
       * 입력된 전화번호 중복체크(마스터 전화번호와 추가 입력된 전화번호 비교 및 중복 입력 체크) 
       * ------------------------------------------------------------------------------------------------------------------------------
      */
      let iDuplePhnNoCnt = 0;
      this.EXPSN_ATTR.forEach((attr, idx) => {
        if(attr.DATA_TYPE_CD === 'TEL' && attr.V_MODEL){
          let sMstPhnNo = this.EDIT_CUST_DATA[0].CUST_PHN_NO;
          let sAddPhnNo = attr.V_MODEL;
          if(sMstPhnNo.replace(/\D/g, '') === sAddPhnNo.replace(/\D/g, '')) iDuplePhnNoCnt++;
        }
      });

      if(iDuplePhnNoCnt > 0){
        this.showAlert({alertDialogToggle: true, msg: '고객 마스터 전화번호와 추가로 등록한 전화번호가 중복 입력 되었습니다.<br/>전화번호는 중복하여 등록이 불가 합니다.', iconClass: 'is-info', type: 'default'});
        return;
      }

      let phoneNumbers = new Set();
      let hasDuplicates = false;

      for (const item of this.EXPSN_ATTR) {
        if(item.DATA_TYPE_CD === 'TEL' && item.V_MODEL){
          if (phoneNumbers.has(item.V_MODEL)) {
            hasDuplicates = true;
            break;
          }
          phoneNumbers.add(item.V_MODEL);
        }
      }

      if (hasDuplicates) {
        this.showAlert({alertDialogToggle: true, msg: '전화번호가 중복 입력 되었습니다.<br/>전화번호는 중복하여 등록이 불가 합니다.', iconClass: 'is-info', type: 'default'});
        return;
      }
      /**
       * ------------------------------------------------------------------------------------------------------------------------------
      */

      this.custDataDiffSetting(); //변경항목 조회

      let res = await this.expsnAttrPhnNoCheck(); //확장 속성 전화번호 체크
      if(res) this.custSave(); //고객 정보 등록
    },

    //고객 정보 저장
    async custSave() {

      let sUrl = '/api/setting/customer/custProc';
      let postParam = {
        CUST_ID: this.EDIT_CUST_DATA[0].CUST_ID
        , CHNL : 'TEL'
        , CUST_PHN_NO: this.EDIT_CUST_DATA[0].CUST_PHN_NO.replace(/[^0-9]/g, "")
        , CUST_NM: this.EDIT_CUST_DATA[0].CUST_NM
        , PRVC_CN: this.saveCustDataDiff.join(",")
      }

      for (let i in this.EXPSN_ATTR) {
        if (this.EXPSN_ATTR[i].DATA_TYPE_CD === 'TXT') { //문자형
          postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL;
          this.EXPSN_ATTR[i].V_POST_PARAM = this.EXPSN_ATTR[i].V_MODEL;
        } else if (this.EXPSN_ATTR[i].DATA_TYPE_CD === 'NUM' || this.EXPSN_ATTR[i].DATA_TYPE_CD === 'NUM_COMMA') { //숫자형
          postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL;
          this.EXPSN_ATTR[i].V_POST_PARAM = this.EXPSN_ATTR[i].V_MODEL;
        } else if (this.EXPSN_ATTR[i].DATA_TYPE_CD === 'COE') { //단일 선택형
          if (Array.isArray(this.EXPSN_ATTR[i].V_MODEL)) {
            let lastVal = '';
            for (let k in this.EXPSN_ATTR[i].V_MODEL) {
              if (this.EXPSN_ATTR[i].V_MODEL[k]) lastVal = this.EXPSN_ATTR[i].V_MODEL[k];
            }
            postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = lastVal;
            this.EXPSN_ATTR[i].V_POST_PARAM = lastVal;
          } else {
            postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL;
            this.EXPSN_ATTR[i].V_POST_PARAM = this.EXPSN_ATTR[i].V_MODEL;
          }
        } else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'COE_MULTI'){ //다중 선택형
          let multiData = '';
          this.EXPSN_ATTR[i].V_MODEL.forEach((multi, idx) => {
            multiData += (multiData?',':'') + multi.value;
          });

          this.EXPSN_ATTR[i].V_POST_PARAM = multiData;
        } else if (this.EXPSN_ATTR[i].DATA_TYPE_CD === 'DAT') { //날짜형
          postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].dateTimeDate.replace(/-/gi, '') + this.EXPSN_ATTR[i].selectedTime.replace(/:/gi, '') + '00';
          this.EXPSN_ATTR[i].V_POST_PARAM = this.EXPSN_ATTR[i].dateTimeDate.replace(/-/gi, '') + this.EXPSN_ATTR[i].selectedTime.replace(/:/gi, '') + '00';
          // postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID+'_DATE'] = this.EXPSN_ATTR[i].V_MODEL_DATE;
        } else if (this.EXPSN_ATTR[i].DATA_TYPE_CD === 'HASH') { //해시태그
          let sHashTxt = '';
          let iCnt = 0;
          for (let k in this.EXPSN_ATTR[i].tags) {
            if (this.EXPSN_ATTR[i].tags[k].text) {
              if (this.EXPSN_ATTR[i].tags[k].active) {
                sHashTxt += (iCnt > 0 ? ',' : '') + this.EXPSN_ATTR[i].tags[k].text;
                iCnt++;
              }
            }
          }
          postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = sHashTxt;
          this.EXPSN_ATTR[i].V_POST_PARAM = sHashTxt;
        } else if (this.EXPSN_ATTR[i].DATA_TYPE_CD === 'POST') { //우편번호
          postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL + '|' + (this.EXPSN_ATTR[i].V_MODEL_DTL[0] ? this.EXPSN_ATTR[i].V_MODEL_DTL[0] : '') + '|' + (this.EXPSN_ATTR[i].V_MODEL_DTL[1] ? this.EXPSN_ATTR[i].V_MODEL_DTL[1] : '');
          this.EXPSN_ATTR[i].V_POST_PARAM = this.EXPSN_ATTR[i].V_MODEL + '|' + (this.EXPSN_ATTR[i].V_MODEL_DTL[0] ? this.EXPSN_ATTR[i].V_MODEL_DTL[0] : '') + '|' + (this.EXPSN_ATTR[i].V_MODEL_DTL[1] ? this.EXPSN_ATTR[i].V_MODEL_DTL[1] : '');
        } else if (this.EXPSN_ATTR[i].DATA_TYPE_CD === 'TEL') { //전화번호
          postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL.replace(/\D/g, '');
            this.EXPSN_ATTR[i].V_POST_PARAM = this.EXPSN_ATTR[i].V_MODEL.replace(/\D/g, '');
        }
      }

      let headParam = {
        head: {}
      }

      postParam.EXPSN_ATTR = JSON.stringify(this.EXPSN_ATTR);

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.editable = false; //저장 성공시 처리
        // this.showAlert(this.MESSAGE.ALERT.SUCCESS);
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeMsg();
        this.closeDialog();
        this.getCustInfoList();
        this.initSelectCust();
      }
    },

    rowClick(item) {
      this.selectedGridItem = item;
      this.EDIT_CUST_DATA[0] = Object.assign({}, this.selectedGridItem);
    },
    isActiveRow(item) {
      const activeClass = item === this.selectedGridItem ? "active" : "";
      return activeClass;
    },
    rowDblClick(event, {item}) {

      this.selectedGridItem = item;

      this.EDIT_CUST_DATA[0] = Object.assign({}, this.selectedGridItem);

      this.openDialog(this.EDIT_CUST_DATA);
    },

    openDialog() {
      this.editable = true;
      this.getCustInfoDtl(this.EDIT_CUST_DATA[0])
      this.mixin_showDialog('SelectedDetail')
      // this.setDetails();
      // this.getCustDetail(this.selectedGridItem);
      // this.getExpsnAttrList();
    },
    closeDialog() {
      this.editable = false;
      this.initSelectCust();
      this.mixin_hideDialog('SelectedDetail');
    },
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },


    callpostDialog(seq) {
      this.SELECTED_ATTR_INDEX = seq;
      this.$eventBus.$emit("reSetPost");
      this.mixin_showDialog('FindPost');
    },

    getFindPost(data) {
      this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].V_MODEL = data.zipNo; //우편번호
      this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].V_MODEL_DTL[0] = data.roadAddr; //기본주소
      this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].V_MODEL_DTL[1] = ''; //상세주소
      this.mixin_hideDialog('FindPost');
    },

    //개인정보처리 변경이력 관련
    custDataDiffSetting() {

      if( this.saveBeforeCustSelectData[0].CUST_NM !== this.EDIT_CUST_DATA[0].CUST_NM ) this.saveCustDataDiff.push("이름");
      if( this.saveBeforeCustSelectData[0].CUST_PHN_NO !== this.EDIT_CUST_DATA[0].CUST_PHN_NO ) this.saveCustDataDiff.push("전화번호");
      for (let i in this.EXPSN_ATTR) {
        if( this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID == 'CUST_COM_POST' || this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID == 'CUST_HOME_POST' ) { //우편번호의 경우
          if(this.EXPSN_ATTR[i].ATTR_VL !== (this.EXPSN_ATTR[i].V_MODEL + "|" + this.EXPSN_ATTR[i].V_MODEL_DTL[0] + "|" + this.EXPSN_ATTR[i].V_MODEL_DTL[1] )) {
            this.saveCustDataDiff.push( this.EXPSN_ATTR[i].EXPSN_ATTR_NM );
          }
        }else {
          if (this.EXPSN_ATTR[i].ATTR_VL !== this.EXPSN_ATTR[i].V_MODEL) this.saveCustDataDiff.push(this.EXPSN_ATTR[i].EXPSN_ATTR_NM);
        }
      }
      // console.log("변경 정보 : {}", this.saveCustDataDiff);
    },

    // 엑셀 다운로드 필터
    showExceldownFilter(){
      this.dialogExcelFilter = true;

      //쿠키에 저장된 내용이있다면 엑셀 다운로드 속성을 쿠키에서 가져오기
      if(this.$cookies.isKey("excelDnwldCustList")){
        let tempArr = this.$cookies.get("excelDnwldCustList");
        this.CHK_CUSTOM_ATTR = tempArr[0];
      }else{
        this.CHK_CUSTOM_ATTR=['CUST_NM', 'CUST_PHN_NO'];
      }
    },

    async cuttHistgetExpsnAttr(){

      let sURL = '/phone-api/history/cuttHistGetExpsnAttr';
      let postParams = {};
      let headParams ={
        head:{},
      };

      let response = await this.common_postCall(sURL, postParams, headParams);

      if(!response.HEADER.ERROR_FLAG) {
        response.DATA.forEach((data, idx) => {
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
                chk: (data.EXPSN_ATTR_COL_ID === 'CUST_NM' || data.EXPSN_ATTR_COL_ID === 'CUST_PHN_NO' ? true: false),
                disabled: (data.EXPSN_ATTR_COL_ID === 'CUST_NM' || data.EXPSN_ATTR_COL_ID === 'CUST_PHN_NO' ? true: false),
              });
            }
          }
        });
      }
    },

    expsnAttrSchDialog(dialog) {
      this.TMP_SCH_CUST_ATTR = this.SCH_CUST_ATTR;
      this.getExpsnAttrList();
      this.dropSchDetail = dialog;
    },
    closeDropAttr(){
      this.dropSchDetail = false;
    },

    async downloadExcel(){

      // 체크된 속성을 쿠키에 저장
      this.$cookies.remove("excelDnwldCustList");

      let excelDnwldCustList = [];
      excelDnwldCustList[0] = this.CHK_CUSTOM_ATTR;

      this.$cookies.set("excelDnwldCustList", excelDnwldCustList);

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

              this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);

              let arrTempCustomAttrId = [];
              let arrAttrId = [];

              for(let i = 2 ; i<this.CHK_CUSTOM_ATTR.length;i++){
                arrTempCustomAttrId.push(this.CHK_CUSTOM_ATTR[i]);
              }

              let sHeaderData = 'RNUM^No.^center,CUST_NM^고객명^left,CUST_PHN_NO^고객전화번호^left';
              this.EXCEL_CUSTOM_ATTR.forEach((cust, idx) => {
                arrTempCustomAttrId.forEach((chk, seq) => {
                  if(chk === cust.value){
                    arrAttrId.push(cust);
                    sHeaderData += (sHeaderData?',':'') + cust.value + '^' + cust.text + '^left';
                  }
                });
              });

              sHeaderData += ',REG_DT^최초 등록일시^center,MDFCN_DT^마지막 수정일시^center';

              let sURL = 'api/customer/custListExcelDwnld';
              let postParams = {
                CUST_STAT: this.CHC_CUST_ST === '전체' ? '' : this.CHC_CUST_ST,
                SCH_GB: this.CHC_CUST_SRCH,
                SCH_KEYWORD: this.INPT_CUST_SRCH.replace(/-/g, ''),
                SE: 'CUSTOM',
                SCH_CUST_REG_TP : this.SCH_CUST_REG_TP,
                SCH_ST_DTS : this.SCH_ST_DTS.replace(/-/gi, ''),
                SCH_END_DTS : this.SCH_END_DTS.replace(/-/gi, ''),
                EMPTY_PHN_NO_CHK : 'N',
                SCH_CUST_EXPSN_ATTR : JSON.stringify(this.SCH_CUST_ATTR),
                CUST_LIKE_SCH_USE_YN: (this.mixin_getCustcoSetting('ENV_CUST_LIKE_SCH_USE_YN')?'Y':'N'), //고객 LIKE 검색 사용 여부
                sFileName: '고객 정보 관리',
                sTitleName: '고객 정보 관리',
                iExcelLimitRowCnt: 100000,
                serviceNm: 'kr.co.hkcloud.palette3.setting.customer.dao.SettingCustomerInformationListMapper',
                sqlId: 'custListExcelDwnldTbl',
                sHeaderData: sHeaderData,
                DOWN_REASON: this.$store.getters['alertStore/GE_ALERT'].downReason,
                CUSTOM_ATTR: JSON.stringify(arrAttrId),
              };
              let headParams = {
                head: '',
              }

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
              }, '고객 정보 관리');
            }
          }
          , callNo: () => {
            this.$store.commit("alertStore/hideAlert");
          }
      });
    },
  },
}
</script>

<style lang="scss" scoped>

</style>