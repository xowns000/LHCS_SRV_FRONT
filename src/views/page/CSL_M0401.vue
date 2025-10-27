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
<!--                <div class="pl-calendar-range-form">-->
<!--                  <compo-date-picker-->
<!--                    DateType="dateInput"-->
<!--                    :DateProp.sync="startDate"/>-->
<!--                  <span class="pl-unit">~</span>-->
<!--                  <compo-date-picker-->
<!--                    DateType="dateInput"-->
<!--                    :DateProp.sync="endDate"/>-->
<!--                  <compo-drop-picker-->
<!--                    :StartDateProp.sync="startDate"-->
<!--                    :EndDateProp.sync="endDate"-->
<!--                  />-->
<!--                </div>-->
                <compo-date-range-picker
                    :StartDayProp.sync="startDate"
                    :EndDayProp.sync="endDate"
                    @startDayChange="mixin_testLog(startDate)"
                    @endDayChange="mixin_testLog(endDate)"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                처리 상태
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(this.common_code,'CUSL_RS','전체')"
                  placeholder="선택하세요"
                  v-model="SRCH_PARAM.CUSL_RS_CD"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">결과</span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(this.common_code,'CAMP_RS','전체')"
                  placeholder="선택하세요"
                  v-model="SRCH_PARAM.CAMP_RS_CD"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                <v-checkbox
                  class="pl-check"
                  label="시도건수"
                  v-model="SRCH_PARAM.CHK_TRY"
                ></v-checkbox>
              </span>
              <div class="pl-desc">
                <v-text-field 
                  class="pl-form is-sm" 
                  hide-spin-buttons 
                  type="number" 
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );" 
                  suffix="회" 
                  v-model="SRCH_PARAM.RTRY_NOCS"
                  @keyup.enter="srchValidate"
                  :disabled="!SRCH_PARAM.CHK_TRY"/>
                <v-select
                  class="pl-form"
                  :items="dropItems3"
                  placeholder="선택하세요"
                  v-model="SRCH_PARAM.NOCS_TY"
                  :disabled="!SRCH_PARAM.CHK_TRY"
                ></v-select>
              </div>
            </div>

            <v-btn 
            class="pl-btn is-icon"
            @click="srchValidate"
            >
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
           <v-btn
               class="pl-btn is-icon is-sub"
               @click="cuttRegForm()"
               :disabled="selectedRow.ROW_NUMBER != undefined ? false : true"
           >
             <span class="pl-icon20 document"></span>
             콜백 강제처리
           </v-btn>
         </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ CLBK_LIST_ITEMS.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
              TypeProp="Download"
              :DownReason=true
              :DataHeaderProp="CLBK_LIST_HEADER"
              :DataBodyProp="CLBK_LIST_ITEMS"
              :FileNameProp="'콜백현황 다운로드_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
              SheetNameProp="콜백현황 다운로드"
              HeaderColorProp="00B0F0"
            ></compo-excel>
          </div>
        </div>
        <v-data-table
          class="pl-grid has-control"
          :headers="CLBK_LIST_HEADER"
          :items="CLBK_LIST_ITEMS"
          fixed-header
          item-key="idx"
          height="562px"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
          :item-class="isActiveRow"
          @click:row="rowSelect"
          @dblclick:row="cuttRegForm"
          :page.sync="page"
          @page-count="pageCount = $event"
          no-data-text="등록된 데이터가 없습니다."
          >
          <template v-slot:item.CUST_NM="{ item }">
            {{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(item.CUST_NM) : item.CUST_NM }}
          </template>
          <template v-slot:item.CLBK_PHN_NO="{ item }">
            {{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(item.CLBK_PHN_NO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(item.CLBK_PHN_NO.replace(/[^0-9]/g, "")) }}
          </template>
          <template v-slot:item.SNDPTY_NO="{ item }">
            {{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(item.SNDPTY_NO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(item.SNDPTY_NO.replace(/[^0-9]/g, "")) }}
          </template>
          <template v-slot:item.CUSL_RS_NM="{ item }">
            <span :class="item.CUSL_RS_NM == '처리완료' ? 'is-txt-main' : 'is-txt-error'">
              {{ item.CUSL_RS_NM }}
            </span>
          </template>
          <template v-slot:item.CALL_OUT_DT="{ item }">
            <span v-if="item.CALL_OUT_DT == '-' && item.CUSL_RS_CD != ''">
              {{ item.CUTT_BGNG_DT }}
            </span>
            <span v-else>
              {{ item.CALL_OUT_DT }}
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
            보기 {{ mixin_getPagePeriod(CLBK_LIST_ITEMS, page) }} / {{ CLBK_LIST_ITEMS.length }}
            <compo-tooltip-btn
               TitleProp="다음 검색"
               ClassProp="pl-tooltip-btn is-line"
               IconProp="pl-icon20 arrow-next-paging"
               TooltipPositionProp="bottom"
               :DisabledProp = "nextDisabled"
               @btnClick="srchValidate('next')"
             ></compo-tooltip-btn>
          </span>
        </div>
      </div>
    </div>
    
    <!-- 우편번호인 경우 modal -->
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
    <!-- //고객찾기 모달-->
    <v-dialog
      v-model="dialogCusFind"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="고객 찾기"
        @hide="mixin_hideDialog('CusFind')"
      >
        <template slot="body">
          <!-- component -->
          <compo-find-cus
            :SearchDataProp="DropCus"
            :DataHeaderProp="HeadersFindCus"
            :SearchInputProp.sync="searchCusname"
            :DataBodyProp="ItemsFindCus"
            :FindData="SRCH_CUST"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('CusFind')">닫기</v-btn>
          <v-btn class="pl-btn" @click="setUserInfo('CusFind')">확인</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- //상담직원 찾기 모달 -->
    <v-dialog
      v-model="dialogUserFind"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="사용자 찾기"
        @hide="mixin_hideDialog('UserFind')"
      >
        <template slot="body">
          <!-- component -->
          <compo-find-cus
            SearchTitleProp="사용자 찾기"
            :SearchDataProp="DropUser"
            :SearchInputProp.sync="searchUsername"
            :DataHeaderProp="HeadersFindCus"
            :DataBodyProp="ItemsFindCus"
            :FindData="SRCH_USER"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('UserFind')">닫기</v-btn>
          <v-btn class="pl-btn" @click="setUserInfo('UserFind')">확인</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- 전화상담 이력 생성 = 강제 콜백 이력 생성 -->
    <v-dialog
      v-model="dialogAddHistory"
      content-class="dialog-draggable is-scroll"
      width="630px"
      hide-overlay
    >
      <div class="draggable-area">drag area</div>
      <compo-dialog :header-title="PHN_CUTT_ID == '' ? '콜백 이력 생성' : '콜백 이력 상세 조회'" @hide="mixin_hideDialog('AddHistory')">
        <template slot="body">
          <p>강제로 생성한 콜백이력은 전적으로 이력을 생성하는 담당자에게 있습니다.</p>
          <p>필수 항목을 입력하신 후 <strong>[저장] 버튼을 클릭</strong>하십시오.</p>
          <p>처리가 완료된 콜백은 이력을 남길 수 없습니다.</p>

          <h2 class="pl-dialog-body-tit-h2 is-border">고객 및 상담 정보</h2>
          <div class="pl-form-inline-wrap vertical">
            <div class="pl-form-inline">
              <span class="pl-label">
                상담 시간
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <div class="pl-calendar-range-form">
                  <compo-date-picker
                    v-model="CUTT_BGNG_DT"
                    style="width:187px"
                    DateType="dateTime"
                    :DateProp.sync="CUTT_BGNG_DT"
                    :TimesProp.sync="CUTT_BGNG_TIME"
                  />
                  <span class="pl-unit">~</span>
                  <compo-date-picker
                    v-model="CUTT_END_DT"
                    style="width:187px"
                    DateType="dateTime"
                    :NudgeLeftProp=430
                    :DateProp.sync="CUTT_END_DT"
                    :TimesProp.sync="CUTT_END_TIME"
                  />
                </div>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                상담 채널
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  v-model="CL_TYPE_CD"
                  :items="mixin_common_code_get(this.common_code, 'CALL_TP')"
                  disabled
                  placeholder="선택하세요"
                ></v-select>
                <v-select
                  class="pl-form"
                  v-model="CHNL"
                  :items="mixin_common_code_get(this.common_code, 'CHNL')"
                  disabled
                  placeholder="선택하세요"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                고객
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
               <v-text-field
                v-model="SRCH_CUST.CUST_NM"
                class="pl-form is-xs"
                :style="'flex:0 0 34%;'"
                disabled
               ></v-text-field>
               <v-text-field
                v-model="SRCH_CUST.CUST_PHN_NO"
                class="pl-form is-xs"
                :style="'flex:0 0 63%;'"
                disabled
               ></v-text-field>
               <!-- 찾기 버튼 -->
              <!-- <compo-tooltip-btn
                v-if="cuttFormStat === 'C'"
                TitleProp="이력을 생성할 해당 고객을 찾기하여 선택하십시오."
                ClassProp="pl-tooltip-btn flex-grow-0"
                IconProp="pl-icon20 in-search"
                TooltipPositionProp="bottom"
                @btnClick="cusSearch()"
              ></compo-tooltip-btn> -->
              </div>
            </div>
          </div>

          <h2 class="pl-dialog-body-tit-h2 is-border">상담직원 및 결과 정보</h2>
          <div class="pl-form-inline-wrap vertical">
            <div class="pl-form-inline">
              <span class="pl-label">
                상담직원
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
               <v-text-field
                v-model="SRCH_USER.USER_NM"
                class="pl-form flex-grow-1"
                placeholder="우측의 찾기 아이콘을 클릭 하십시오"
                disabled
               ></v-text-field>
               <!-- 찾기 버튼 -->
              <!-- <compo-tooltip-btn
                v-if="cuttFormStat === 'C'"
                TitleProp="고객과 응대한 상담직원을 찾기하여 선택하십시오."
                ClassProp="pl-tooltip-btn flex-grow-0"
                IconProp="pl-icon20 in-search"
                TooltipPositionProp="bottom"
                @btnClick="userSearch()"
              ></compo-tooltip-btn> -->
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                후처리 시간
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="AFTPRCS_HR"
                  class="pl-form"
                  disabled
                  hide-spin-buttons
                  type="number"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                  suffix="초"
                  v-byte-counter="4"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                녹취 파일
                <!-- <v-icon class="pl-icon20 required"></v-icon> -->
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="REC_FILE_NM"
                  class="pl-form"
                  placeholder="입력하십시오"
                  v-byte-counter="300"
                ></v-text-field>
              </div>
            </div>
            <div class="pl-form-inline" v-for="(expsnAttr, seq) in EXPSN_ATTR" :key="expsnAttr.ATTR_ID">
              <!--확장 속성 명-->
              <span class="pl-label">
                {{expsnAttr.EXPSN_ATTR_NM}}
                <v-icon v-show="expsnAttr.ESNTL_YN === 'Y'" class="pl-icon20 required"></v-icon> <!-- 필수 입력인 경우  -->
                <div v-if="expsnAttr.MSG_USE_YN === 'Y'">
                  <compo-tooltip-btn
                    :TitleProp="expsnAttr.MSG_CN"
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 question"
                    TooltipPositionProp="bottom"
                  />
                </div>
              </span>
              <!-- 단일 선택형이고 상담 유형이 아닌 경우 -->
              <div class='pl-desc' v-if="expsnAttr.DATA_TYPE_CD === 'COE' && expsnAttr.EXPSN_ATTR_COL_ID != 'CUSL_TP_CL'">
                <v-autocomplete
                  v-model="expsnAttr.V_MODEL"
                  class="pl-form"
                  :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                  :items="mixin_common_code_get(common_code, expsnAttr.GROUP_CD_ID)"
                  :disabled="expsnAttr.EXPSN_ATTR_COL_ID==='CUSL_RS'"
                  placeholder="선택하세요"
                  value=""
                  no-data-text="결과 없음"
                />
              </div>
              <!-- 단일 선택형이고 상담 유형인 경우 -->
              <div class='pl-desc' v-else-if="expsnAttr.DATA_TYPE_CD === 'COE' && expsnAttr.EXPSN_ATTR_COL_ID === 'CUSL_TP_CL'">
                <v-autocomplete v-for="(cuttType, idx) in expsnAttr.V_MODEL" :key="idx"
                  v-model="expsnAttr.V_MODEL[idx]"
                  class="pl-form"
                  :ref="`${expsnAttr.EXPSN_ATTR_COL_ID}_${idx}`"
                  :items="getChildCuttTypeItems(seq, idx, idx===0?'':expsnAttr.V_MODEL[idx-1])"
                  item-text = "CUTT_TYPE_NM"
                  item-value = "CUTT_TYPE_ID"
                  placeholder="선택하세요"
                  style="flex: 0 0 100%;"
                  v-on:change="changeCuttTypeItems(seq, idx)"
                  no-data-text="결과 없음"
                />
              </div>
              <!-- 다중 선택인 경우 -->
              <div class="pl-desc" style="width:360px" v-else-if="expsnAttr.DATA_TYPE_CD === 'COE_MULTI'">
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
              <!-- 문자형이고 데이터 길이가 200보다 작거나 같은 경우 -->
              <div class="pl-desc" v-else-if="expsnAttr.DATA_TYPE_CD === 'TXT' && expsnAttr.DATA_LEN <= 200">
                <v-text-field
                  v-model="expsnAttr.V_MODEL"
                  class="pl-form"
                  :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                  :maxlength="expsnAttr.DATA_LEN"
                  placeholder=""
                  value=""
                  v-byte-counter="expsnAttr.DATA_LEN"
                />
              </div>
              <!-- 문자형이고 데이터 길이가 200보다 큰 경우 -->
              <div class="pl-desc" v-else-if="expsnAttr.DATA_TYPE_CD === 'TXT' && expsnAttr.DATA_LEN > 200">
                <v-textarea
                  v-model="expsnAttr.V_MODEL"
                  class="pl-form is-noresize"
                  :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                  :maxlength="expsnAttr.DATA_LEN"
                  :spellcheck="false"
                  v-byte-counter="expsnAttr.DATA_LEN"
                />
              </div>
              <!-- 숫자형인 경우 -->
              <div class="pl-desc" v-else-if="expsnAttr.DATA_TYPE_CD === 'NUM'">
                <v-text-field
                  v-model="expsnAttr.V_MODEL"
                  class="pl-form"
                  :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                  :maxlength="expsnAttr.DATA_LEN"
                  hide-spin-buttons
                  type="number"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                  placeholder="숫자만 입력 가능 합니다."
                  value=""
                  v-byte-counter="expsnAttr.DATA_LEN"
                />
              </div>
              <!-- 숫자형이면서 comma가 포함인 경우 -->
              <div class="pl-desc" v-else-if="expsnAttr.DATA_TYPE_CD === 'NUM_COMMA'">
                <v-text-field
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
              </div>
              <!-- 우편번호인 경우 -->
              <div class='pl-desc' v-else-if="expsnAttr.DATA_TYPE_CD === 'POST'">
                <v-text-field
                  v-model="expsnAttr.V_MODEL"
                  class="pl-form is-search"
                  :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                  :maxlength="expsnAttr.DATA_LEN"
                  disabled
                  style="flex: 0 0 100%;"
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
                <v-text-field
                  v-model="expsnAttr.V_MODEL_DTL[0]"
                  class="pl-form"
                  :ref="`V_MODEL_ADDR_${seq}`"
                  disabled
                  style="flex: 0 0 100%;"
                />
                <v-text-field
                  v-model="expsnAttr.V_MODEL_DTL[1]"
                  class="pl-form"
                  :ref="`V_MODEL_DTL_ADDR_${seq}`"
                  style="flex: 0 0 100%;"
                  v-byte-counter="expsnAttr.DATA_LEN"
                />
              </div>
              <!-- 해시태크인 경우 -->
              <div class="pl-desc" v-else-if="expsnAttr.DATA_TYPE_CD === 'HASH'">
                <div class="pl-tags-wrap">
                  <v-chip-group
                    active-class="active-tag"
                    column
                  >
                    <template v-for="tag, index in expsnAttr.tags" >
                      <v-chip
                        v-if="tag.active"
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
                        value=""
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
              </div>
              <!-- 날짜형인 경우 -->
              <div class="pl-desc is-reserveCall" v-else-if="expsnAttr.DATA_TYPE_CD === 'DAT'">
                <v-checkbox
                  v-model="expsnAttr.V_MODEL"
                  :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                  class="pl-check"
                  value=""
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
            </div>
          </div>
        </template>

        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="closeDialog">닫기</v-btn>
          <v-btn class="pl-btn"
            @click="phoneCuttSaveValidate"
            :disabled="selectedRow.CUSL_RS_CD == 'COMPLETED' ? true : false"
          >저장</v-btn>
        </template>

      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
export default {
    name:"MENU_CSL_M0401", //name은 'MENU_' + 파일명 조합

 components: {

  },
 data() {
    return {

      common_code : [],

      // top search
      // currentTime : '',
      // startDate: '',
      // endDate: '',
      nowDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      startDate: this.$moment(this.nowDate).subtract(7,'days').format('YYYY-MM-DD'),
      endDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      excel_idx:'',

      drwi_dt_start: '',
      drwi_dt_end: '',

      dropItems: [ '전체', ],
      dropItems2: ['전체'],
      dropItems3: [
        {text: '이상', value : 'up'},
        {text: '이하', value : 'down'},
        ],

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,

      pagination: { 
        page: 1, 
        rowsPerPage: 500,
        sortBy: "", 
        descending: "" 
      }, 
      nextDisabled: false,


      CLBK_LIST_HEADER: [
        { text: '번호', value: 'idx', align: 'center', width: '50px' ,sortable : false },
        { text: '인입일시', value: 'DRWI_DT', width: '120px' },
        { text: '고객명', value: 'CUST_NM', width: '120px', sortable : false},
        { text: '발신번호', value: 'SNDPTY_NO', width: '120px',sortable : false },
        { text: '콜백전화번호', value: 'CLBK_PHN_NO', width: '120px',sortable : false },
        { text: '배분일시', value: 'ALTMNT_DT', width: '120px',sortable : false },
        { text: '상담직원', value: 'CUSL_NM', width: '120px', sortable : false},
        { text: '내선번호', value: 'EXT_NO', width: '100px', sortable : false},
        // { text: '시도건수', value: 'RTRY_NOCS', width: '80px', sortable : false, align : 'center'},
        { text: '시도건수', value: 'TRY_CNT', width: '80px', sortable : false, align : 'center'},
        { text: '처리 상태', value: 'CUSL_RS_NM', width: '100px', sortable : false},
        { text: '결과', value: 'CAMP_RS_NM',  width: '100px', sortable : false},
        { text: '콜백일시', value: 'CALL_OUT_DT',  width: '120px',sortable : false },
      ],
      CLBK_LIST_ITEMS:[],


      SRCH_PARAM: {
        CHK_TRY : false,
        CUSL_RS_CD : 'PROCESSING',
        CAMP_RS_CD : '',
        NOCS_TY :'',
        RTRY_NOCS: '',

      },

      selectedRow : '',

      dialogFindPost:false, //우편번호 검색 모달
      dialogUserFind: false, //사용자 검색 모달
      dialogCusFind: false, //고객 검색 모달

      DropCus: {},
      DropUser: {},
      HeadersFindCus: [],
      ItemsFindCus:[],

      searchUsername: '',   //사용자 이름 검색
      searchCusname: '',    //고객 이름 검색
    
      //콜백이력 강제생성
      dialogAddHistory: false,

      //검색
      SCH_CUTT_ST_DTS : '', //통화 시작 일자
      SCH_CUTT_END_DTS : '', //통화 시작 일자
      SCH_CL_TYPE_CD : '', //콜 유형
      SCH_CUSL_RS_CD : 'PROCESSING', //상담 결과
      SCH_ST_PHN_HR : '', //통화 시간(시작)
      SCH_END_PHN_HR : '', //통화 시간(종료)
      SCH_KEY : 'CUST_NM', // 검색 구분
      SCH_KEYWORD : '', //검색어
      SCH_CUTT_TYPE : '', //상담유형

      CUTT_TYPE_ITEMS : [],

      DialogStartDate : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      DialogEndDate : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      PHN_CUTT_ID : '', //전화상담 ID
      CUTT_BGNG_DT : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), //상담 시작 일시
      CUTT_BGNG_TIME : "00:00",
      CUTT_END_DT : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), //상담 종료 일시
      CUTT_END_TIME : "00:00",
      SRCH_CUST:[], //고객 정보
      CL_TYPE_CD: 'IN', //인바운드 고정
      CHNL:'TEL',//채널 전화 고정
      SRCH_USER:[], //상담사 정보
      AFTPRCS_HR:'0', //후처리 시간(초)
      REC_FILE_NM:'', //녹취파일명

      //확장속성
      EXPSN_ATTR:[],
      REG_USER_ID:'',

      //상담유형 정보
      ITGRT_USE_YN : 'N', //통합 사용 여부
      CUTT_TYPE_LMT_LVL_CD : 3,//상담유형 제한 레벨

      SELECTED_ATTR_INDEX : 0, //선택된 확장 속성 INDEX

      //상담유형
      CUTT_ITEMS : [],

      // 예약콜
      posX: 0,
      posY: 0,
      times: [
        { label: "30분 후", date: ["dateTimeDate","dateTimeTime", 0, 0, 30] },
        { label: "1시간 후", date: ["dateTimeDate","dateTimeTime", 0, 1, 0] },
        { label: "내일", date: ["dateTimeDate", "dateTimeTime", 1, 0, 0] },
        { label: "이틀 후", date: ["dateTimeDate", "dateTimeTime", 2, 0, 0] },
        { label: "다음 주", date: ["dateTimeDate", "dateTimeTime", 7, 0, 0] }
      ],
      dateTimeDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dateTimeTime: new Date(),
      selectedTime: '',
      selectedAmpm: '',
      chkDateReserve: false,
      dateReservePicker: false,
      dropDateReserve: false,

      //confirm alert 메시지
      MESSAGE : {
        CONFIRM : {
          REG : {alertDialogToggle: true, msg: '상담내용을 저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.phoneCuttSave, callNo: this.closeMsg}
        },
        ALERT : {
          SUCCESS : {alertDialogToggle: true, msg: '정상 처리 되었습니다.', iconClass: 'is-info', type: 'default'},
          DATA : {alertDialogToggle : true, msg:'유효하지 않은 날짜 범위 입니다',iconClass: 'is-done', type:'default'},
          TRY_CNT_CHK : {alertDialogToggle : true, msg:'시도 건 수를 입력해주세요',iconClass: 'is-done', type:'default'},
          TRY_CNT_GB_CHK : {alertDialogToggle : true, msg:'시도 건 수 구분을 선택해주세요',iconClass: 'is-done', type:'default'},
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
          , CHEKCHG : {alertDialogToggle: true, msg: '항목을 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST : {
          SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 },
        },
      },

      cuttFormStat : 'C',
      CHG_RSN : '',

    }
  },

  watch: {
    
  },

  computed: {
    computedTagSize() {
      return `flex: 0 0 ${ this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].inputTagSize + 12 }ch;`;
    }
  },

  created() {
    
  },

  async mounted() {

    // this.setTime();


    let codeName = ['CALL_TP','CUSL_RS','CAMP_RS'];

    this.common_code = await this.mixin_common_code_get_all(codeName);

    this.getClbkList();

    this.getCuttTypeList();//상담 유형
  },
  
  methods: {
    
    srchValidate(next){

      let start = this.replaceDate(this.startDate, 'start');
      let end = this.replaceDate(this.endDate, 'end');
      if(parseInt(start) > parseInt(end) ){
        this.showAlert(this.MESSAGE.ALERT.DATA);
      }else if(this.SRCH_PARAM.CHK_TRY){
          if(this.mixin_isEmpty(this.SRCH_PARAM.RTRY_NOCS)){
              this.showAlert(this.MESSAGE.ALERT.TRY_CNT_CHK);
          }else if(this.mixin_isEmpty(this.SRCH_PARAM.NOCS_TY)){
              this.showAlert(this.MESSAGE.ALERT.TRY_CNT_GB_CHK);
          }else{
            if(this.mixin_isEmpty(next)){
              this.getClbkList();
            }else{
              this.getClbkList(next);
            }
          }
        }else{
           if(this.mixin_isEmpty(next)){
              this.getClbkList();
            }else{
              this.getClbkList(next);
            }
        }
    },
    
    async getClbkList(next){

      
      //다음버튼 클릭 유무
        if (next !== 'next'){
          this.CLBK_LIST_ITEMS = [];
          this.page = 1; //페이징 처리 초기화
          this.pagination.page = 1;
          this.nextDisabled = true;  //버튼 비활성화
        }

      let sURL = 'phone-api/callback/inqire/list';
      let postParam = {
        DRWI_DT_START : this.startDate.replace(/-/gi, '')+'000000',
        DRWI_DT_END : this.endDate.replace(/-/gi, '')+'235959',
        NOCS_TY : this.SRCH_PARAM.CHK_TRY? this.SRCH_PARAM.NOCS_TY : '',
        RTRY_NOCS : this.SRCH_PARAM.CHK_TRY? this.SRCH_PARAM.RTRY_NOCS : '',
        CUSL_RS_CD : this.SRCH_PARAM.CUSL_RS_CD,
        CAMP_RS_CD : this.SRCH_PARAM.CAMP_RS_CD,
      };

       let headParam =  {
          head: {
            "ROW_CNT" : this.pagination.rowsPerPage,
            "PAGES_CNT" : this.pagination.page,
            "PAGING" : "Y",
          }
        }

      let response = await this.common_postCall(sURL,postParam, headParam);
      if(!response.HEADER.ERROR_FLAG){
        if(response.DATA.length > 0){
          let i = 0;
          let idx = this.CLBK_LIST_ITEMS.length + 1;
          let tempData = response.DATA;

          tempData.map(item =>{
            tempData[i]["CUST_NM"] = this.mixin_isEmpty(response.DATA[i]["CUST_NM"])? '알수없음' : response.DATA[i]["CUST_NM"];
            tempData[i]["DRWI_DT"] = this.mixin_convertDate(response.DATA[i]["DRWI_DT"],'yyyy-MM-dd HH:mm:ss');
            tempData[i]["ALTMNT_DT"] = this.mixin_convertDate(response.DATA[i]["ALTMNT_DT"],'yyyy-MM-dd HH:mm:ss');
            tempData[i]["TRY_CNT"] = parseInt(response.DATA[i]["RTRY_NOCS"]) + parseInt(response.DATA[i]["FORC_RTRY_NOCS"]);
            tempData[i]["TRY_CNT"] = response.DATA[i]["TRY_CNT"] === 0 || this.mixin_isEmpty(response.DATA[i]["TRY_CNT"]) ? '-': response.DATA[i]["TRY_CNT"] + '차';
            tempData[i]["idx"] = idx++;
            tempData[i]["CLBK_PHN_NO"] = this.mixin_setPhoneNo(response.DATA[i]["CLBK_PHN_NO"]);
            tempData[i]["SNDPTY_NO"] = this.mixin_setPhoneNo(response.DATA[i]["SNDPTY_NO"]);
            tempData[i]["END_SE_CD"] = this.mixin_isEmpty(response.DATA[i]["END_SE_CD"])? '-': response.DATA[i]["END_SE_CD"];
            tempData[i]["EXT_PHN_NO"] = this.mixin_isEmpty(response.DATA[i]["EXT_PHN_NO"])? '-': response.DATA[i]["EXT_PHN_NO"];
            tempData[i]["CALL_OUT_DT"] = this.mixin_isEmpty(response.DATA[i]["CALL_OUT_DT"])? '-': this.mixin_convertDate(response.DATA[i]["CALL_OUT_DT"],'yyyy-MM-dd HH:mm:ss');
            tempData[i]["CUTT_BGNG_DT"] = this.mixin_isEmpty(response.DATA[i]["CUTT_BGNG_DT"])? '-': this.mixin_convertDate(response.DATA[i]["CUTT_BGNG_DT"],'yyyy-MM-dd HH:mm:ss');
          i++
          });

          this.CLBK_LIST_ITEMS = [ ...this.CLBK_LIST_ITEMS, ...tempData]
          
          if(response.HEADER.next !== null && response.HEADER.next !== undefined){
            if(response.HEADER.next === true){  
              this.nextDisabled = false;
            }else{
              this.nextDisabled = true;
            }
          }
          this.pagination.page += 1;
        }
      }
    },

    /* 날짜포맷 -> YYYYMMDD24MISS */

    replaceDate(date, se){
      
      let removeCaret;

      removeCaret = date.replace('-','').replace("-",'').replace(' ','').replace(':','');

        if(se === 'start'){

            if(removeCaret.length < 9){
              return removeCaret + "000000";
            }else if(removeCaret.length < 11){
              return removeCaret + "0000";
            }else if(removeCaret.length < 13){
              return removeCaret + "00";
            }
            return removeCaret;

        }else{
          
            if(removeCaret.length < 9){
              return removeCaret + "235959";
            }else if(removeCaret.length < 11){
              return removeCaret + "5959";
            }else if(removeCaret.length < 13){
              return removeCaret + "59";
            }
            return removeCaret;

        }
    },

    rowSelect(item) {
      this.selectedRow = item;
      // console.log(this.selectedRow["idx"]);
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    //콜백이력 생성 버튼 클릭
    cuttRegForm(){
      this.cuttFormStat = 'C';
      this.refreshPhoneCuttForm(); //초기화
      this.getExpsnAttrList(); //확장 속성
      this.mixin_showDialog('AddHistory');
    },
    
    closeDialog(){
      this.selectedRow = {};
      this.mixin_hideDialog('AddHistory');
    },

    //clase confirm, alert
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    //상담내용 저장 폼 초기화
    async refreshPhoneCuttForm(){
      this.PHN_CUTT_ID = '';

      // this.CUTT_BGNG_DT = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); //상담 시작 일시
      // this.CUTT_BGNG_TIME = '00:00';
      // this.CUTT_END_DT = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); //상담 종료 일시
      // this.CUTT_END_TIME = '00:00';

      let svrDate = await this.mixin_getSvrDate("YYYY-MM-DD HH24:MI:SS");

      let yyyymmdd = svrDate.split(' ')[0];
      let time = svrDate.split(' ')[1];
      let date = new Date(yyyymmdd.split('-')[0].toString(), (Number(yyyymmdd.split('-')[1])-1).toString(), yyyymmdd.split('-')[2].toString(), time.split(':')[0].toString(), time.split(':')[1].toString(), time.split(':')[2].toString());

      this.CUTT_BGNG_DT = '' + date.getFullYear() + '-' + this.mixin_rpad((date.getMonth()+1).toString(), 2, '0') + '-' + this.mixin_rpad(date.getDate(), 2, '0');
      this.CUTT_BGNG_TIME = '' + this.mixin_rpad(date.getHours(), 2, '0') + ':' + this.mixin_rpad(date.getMinutes(), 2, '0') + ':' + this.mixin_rpad(date.getSeconds(), 2, '0');

      date.setSeconds(date.getSeconds() + 1);
      this.CUTT_END_DT = '' + date.getFullYear() + '-' + this.mixin_rpad((date.getMonth()+1).toString(), 2, '0') + '-' + this.mixin_rpad(date.getDate(), 2, '0');
      this.CUTT_END_TIME = '' + this.mixin_rpad(date.getHours(), 2, '0') + ':' + this.mixin_rpad(date.getMinutes(), 2, '0') + ':' + this.mixin_rpad(date.getSeconds(), 2, '0');

      this.SRCH_CUST = {
        CUST_ID : this.selectedRow.CUST_ID
        , CUST_NM : this.mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? this.mixin_mask_name(this.selectedRow.CUST_NM) : this.selectedRow.CUST_NM
        , CUST_PHN_NO : this.mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? this.mixin_mask_num(this.selectedRow.CLBK_PHN_NO.replace(/[^0-9]/g, "")) : this.mixin_setPhoneNo(this.selectedRow.CLBK_PHN_NO.replace(/[^0-9]/g, ""))
      }; //고객 정보
      this.CL_TYPE_CD = 'OUT'; //아웃바운드 고정
      this.CHNL = 'TEL';//채널 전화 고정
      this.SRCH_USER = {
        USER_ID : this.$store.getters['userStore/GE_USER_ROLE'].userId
        , USER_NM : this.$store.getters["userStore/GE_USER_ROLE"].userName
      }; //상담사 정보
      this.AFTPRCS_HR = '0'; //후처리 시간(초)
      this.REC_FILE_NM = ''; //녹취파일명
      this.REG_USER_ID = '';
      this.CHG_RSN = '';

      let expsnAttrData = this.EXPSN_ATTR;
      for(let i in expsnAttrData){
        expsnAttrData[i].V_MODEL = ''; //동적 v_model 초기화
        if(expsnAttrData[i].DATA_TYPE_CD === 'DAT'){//날짜형인 경우
          expsnAttrData[i].V_MODEL = false; //chkDateReserve
          expsnAttrData[i].V_MODEL_DATE = ''; //날짜 v_model
          expsnAttrData[i].chkDateReserve = false; //chkDateReserve
          expsnAttrData[i].dateReservePicker = false; //dateReservePicker
          expsnAttrData[i].dropDateReserve = false; //dropDateReserve
          expsnAttrData[i].dateTimeDate = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); //dateTimeDate
          expsnAttrData[i].dateTimeTime = new Date(); //dateTimeTime
          expsnAttrData[i].selectedTime = ''; //selectedTime
          expsnAttrData[i].selectedAmpm = ''; //selectedAmpm
        }else if(expsnAttrData[i].DATA_TYPE_CD === 'POST'){ //우편번호인 경우
          expsnAttrData[i].V_MODEL_DTL = []; //주소 v_model
        }else if(expsnAttrData[i].DATA_TYPE_CD === 'COE'){ //단일 선택인 경우
          if(expsnAttrData[i].EXPSN_ATTR_COL_ID === 'CUSL_TP_CL'){
            expsnAttrData[i].V_MODEL = [];
            if(this.CUTT_TYPE_LMT_LVL_CD){
              for(let k=0; k<this.CUTT_TYPE_LMT_LVL_CD; k++){
                expsnAttrData[i].V_MODEL[k] = '';
              }
            }
          }
        }else if(expsnAttrData[i].DATA_TYPE_CD === 'COE_MULTI'){ //다중 선택인 경우
          expsnAttrData[i].V_MODEL = [];
        }else if(expsnAttrData[i].DATA_TYPE_CD === 'HASH'){ //해시태그인 경우
          expsnAttrData[i].tags = [];
          expsnAttrData[i].inputTagSize = '';
        }
      }

      this.closeMsg();
    },
    
    //사용자 검색
    userSearch(){
      this.mixin_showDialog('UserFind');
    },

    //고객 검색
    cusSearch(){
      this.mixin_showDialog('CusFind');
    },

    //고객, 사용자 선택 후 확인 버튼 클릭 이벤트
    setUserInfo(userTp) {
      this.$eventBus.$emit('setUserInfo');
      this.mixin_hideDialog(userTp);
    },

    // 예약콜
    async toggleChkReserve(seq, event) {
      this.SELECTED_ATTR_INDEX = seq;
      this.posX = event.clientX + 10;
      this.posY = event.clientY - 50;

      if(this.EXPSN_ATTR[seq].V_MODEL === true) {
        this.EXPSN_ATTR[seq].dropDateReserve = true;
        this.EXPSN_ATTR[seq].dateTimeDate = await this.mixin_convertDate(await this.mixin_getSvrDate("YYYYMMDDHH24MISS"), 'yyyy-MM-dd');
        this.EXPSN_ATTR[seq].dateTimeTime = new Date(await this.mixin_convertDate(await this.mixin_getSvrDate("YYYYMMDDHH24MISS"), 'yyyy-MM-dd HH:mm:ss'));
      } else {
        this.EXPSN_ATTR[seq].dropDateReserve = false;
        this.EXPSN_ATTR[seq].dateReservePicker = false;
        return
      }
    },
    showDatePicker(){
      this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].dateReservePicker = true;
      this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].dropDateReserve = false;
    },

    selectReserveDateTime(seq, date) {
      this.SELECTED_ATTR_INDEX = seq;
      // getReserveTime 메소드를 호출하여 반환된 값을 변수에 저장
      let getDate = this.getReserveTime(seq, date);

      // 날짜와 시간을 따로 분리하여 데이터 속성에 저장
      this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].dateTimeDate = new Date(getDate[0]).toISOString().substr(0, 10);
      getDate[3].toString().length === 1 ? getDate[3] = "0" + getDate[3] : null;
      this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].selectedTime = `${String(getDate[3]).padStart(2, '0')}:${String(getDate[4]).padStart(2, '0')}`;
      this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].selectedAmpm = `${getDate[2]}`;
      this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].V_MODEL_DATE = this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].dateTimeDate.replace(/-/gi, '')+this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].selectedTime.replace(/:/gi, '')+'00';

      this.showDatePicker();
    },
    getReserveTime(seq, date) {
      let newDate = this.EXPSN_ATTR[seq].dateTimeDate;
      let newTime = this.EXPSN_ATTR[seq].dateTimeTime;
      let newDay = new Date( new Date(newDate).setDate(new Date(newDate).getDate() + date[2]) );

      let newTimeHours = new Date(newTime).getHours() + date[3];
      let newTimeMinutes = new Date(newTime).getMinutes() + date[4];
      let ampm = newTimeHours < 12 ? "오전" : "오후";

      let daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
      let dayOfWeek = daysOfWeek[newDay.getDay()];
      if( date[2] === 0 ) {
          dayOfWeek = '오늘';
      }

      // newTimeHours = newTimeHours % 12 || 12;

      if ( newTimeMinutes >= 60) {
        newTimeHours = newTimeHours + 1;
        newTimeMinutes = newTimeMinutes % 60;
      }

      let calculateDate = [newDay.toISOString().substr(0, 10), dayOfWeek, ampm, newTimeHours, newTimeMinutes];

      return calculateDate;
    },
    displayReserveTime(seq, date) {
      let getDate = this.getReserveTime(seq, date);
      let targetDate = `${ getDate[1] } ${getDate[2]} ${String(getDate[3]).padStart(2, '0')}:${String(getDate[4]).padStart(2, '0')}`;

      return targetDate;
    },
    // tags
    addTag(seq){
      this.SELECTED_ATTR_INDEX = seq;
      let tagVal = this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].V_MODEL.trim();

      if( tagVal.length !== 0 ) {
        const addTag = { text: tagVal, active: true };
        this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].tags.push(addTag);
        this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].V_MODEL = '';
        this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].inputTagSize = 0;
      }
    },
    onInputTag(seq){
      this.SELECTED_ATTR_INDEX = seq;
      this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].inputTagSize = this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].V_MODEL.length;
    },
    
    //확장 속성 정보 가져오기
    async getExpsnAttrList() {
      let sUrl = '/api/setting/expsnAttr/expsnAttrList';
      let postParam = {
        SE : 'CONSEL' //상담내용 확장항목
        , BSC_PVSN_ATTR_YN : "N" //기본 제공 속성이 아닌것
        , USE_YN : 'Y' //확장속성 사용인 경우만
        , PHN_CUTT_ID : this.cuttFormStat==='C'?'':this.selectedRow.PHN_CUTT_ID
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
        //상담유형 정보
        if(response.CUTT_TYPE_SETTING){
          this.ITGRT_USE_YN = response.CUTT_TYPE_SETTING[0].ITGRT_USE_YN;
          this.CUTT_TYPE_LMT_LVL_CD = response.CUTT_TYPE_SETTING[0].CUTT_TYPE_LMT_LVL_CD;
        }

        let expsnAttrData = [];
        for(let i in response.DATA){
          if(response.DATA[i].EXPSN_ATTR_COL_ID === 'CAMP_RS'){ //처리 결과인 경우 캠페인 id가 있을 경우에만 노출 처리
            if(this.selectedRow.CLBK_ID) expsnAttrData.push(response.DATA[i]);
          }else{
            expsnAttrData.push(response.DATA[i]);
          }
        }

        let codeName = ['CALL_TP', 'CHNL']; //콜 유형과, 채널 공통코드
        for(let i in expsnAttrData){

          if(expsnAttrData[i].PHN_CUTT_ID) expsnAttrData[i].V_MODEL = expsnAttrData[i].ATTR_VL; //동적 v_model 생성
          else expsnAttrData[i].V_MODEL = ''; //동적 v_model 생성

          if(expsnAttrData[i].DATA_TYPE_CD === 'TXT'){//문자형인 경우
            if(expsnAttrData[i].PHN_CUTT_ID) expsnAttrData[i].V_MODEL = this.mixin_decode(expsnAttrData[i].ATTR_VL); //decode
          }else if(expsnAttrData[i].DATA_TYPE_CD === 'DAT'){//날짜형인 경우
            if(expsnAttrData[i].PHN_CUTT_ID){
              expsnAttrData[i].V_MODEL = (expsnAttrData[i].ATTR_VL?true:false); //chkDateReserve
              expsnAttrData[i].V_MODEL_DATE = (expsnAttrData[i].ATTR_VL?expsnAttrData[i].ATTR_VL:''); //날짜 v_model
              expsnAttrData[i].chkDateReserve = false; //chkDateReserve
              expsnAttrData[i].dateReservePicker = (expsnAttrData[i].ATTR_VL?true:false); //dateReservePicker
              expsnAttrData[i].dropDateReserve = false; //dropDateReserve
              expsnAttrData[i].dateTimeDate = (expsnAttrData[i].ATTR_VL?await this.mixin_convertDate(expsnAttrData[i].ATTR_VL, 'yyyy-MM-dd'):(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)); //dateTimeDate
              expsnAttrData[i].dateTimeTime = new Date(); //dateTimeTime
              expsnAttrData[i].selectedTime = (expsnAttrData[i].ATTR_VL?await this.mixin_convertDate(expsnAttrData[i].ATTR_VL, 'HH:mm'):''); //selectedTime
              expsnAttrData[i].selectedAmpm = ''; //selectedAmpm
            }else{
              expsnAttrData[i].V_MODEL = false; //chkDateReserve
              expsnAttrData[i].V_MODEL_DATE = ''; //날짜 v_model
              expsnAttrData[i].chkDateReserve = false; //chkDateReserve
              expsnAttrData[i].dateReservePicker = false; //dateReservePicker
              expsnAttrData[i].dropDateReserve = false; //dropDateReserve
              expsnAttrData[i].dateTimeDate = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); //dateTimeDate
              expsnAttrData[i].dateTimeTime = new Date(); //dateTimeTime
              expsnAttrData[i].selectedTime = ''; //selectedTime
              expsnAttrData[i].selectedAmpm = ''; //selectedAmpm
            }
          }else if(expsnAttrData[i].DATA_TYPE_CD === 'POST'){ //우편번호인 경우
            if(expsnAttrData[i].PHN_CUTT_ID){
              expsnAttrData[i].V_MODEL_DTL = []; //주소 v_model
              if(expsnAttrData[i].ATTR_VL){
                for(let h in expsnAttrData[i].ATTR_VL.split('|')){
                  if(h == 0) expsnAttrData[i].V_MODEL = expsnAttrData[i].ATTR_VL.split('|')[0]
                  else if(h == 1) expsnAttrData[i].V_MODEL_DTL[0] = expsnAttrData[i].ATTR_VL.split('|')[1]
                  else if(h == 2) expsnAttrData[i].V_MODEL_DTL[1] = expsnAttrData[i].ATTR_VL.split('|')[2]
                }
              }
            }else{
              expsnAttrData[i].V_MODEL_DTL = []; //주소 v_model
            }
          }else if(expsnAttrData[i].DATA_TYPE_CD === 'COE'){ //단일 선택인 경우
            if(expsnAttrData[i].GROUP_CD_ID) codeName.push(expsnAttrData[i].GROUP_CD_ID); //공통코드사용을 위해 그룹코드가 있는 경우만
            else if(expsnAttrData[i].EXPSN_ATTR_COL_ID === 'CUSL_TP_CL'){
              expsnAttrData[i].V_MODEL = [];
              if(expsnAttrData[i].PHN_CUTT_ID){
                if(expsnAttrData[i].ATTR_VL){
                  if(this.CUTT_TYPE_LMT_LVL_CD){
                    for(let k=0; k<this.CUTT_TYPE_LMT_LVL_CD; k++){
                      expsnAttrData[i].V_MODEL[k] = expsnAttrData[i].ATTR_VL.split(',')[k+1];
                    }
                  }
                }else{
                  if(this.CUTT_TYPE_LMT_LVL_CD){
                    for(let k=0; k<this.CUTT_TYPE_LMT_LVL_CD; k++){
                      expsnAttrData[i].V_MODEL[k] = '';
                    }
                  }
                }
              }else{
                if(this.CUTT_TYPE_LMT_LVL_CD){
                  for(let k=0; k<this.CUTT_TYPE_LMT_LVL_CD; k++){
                    expsnAttrData[i].V_MODEL[k] = '';
                  }
                }
              }
            }
          }else if(expsnAttrData[i].DATA_TYPE_CD === 'COE_MULTI'){ //다중 선택인 경우
            expsnAttrData[i].V_MODEL = [];
            codeName.push(expsnAttrData[i].GROUP_CD_ID); //공통코드사용을 위해

            let items = this.mixin_common_code_get(this.common_code, expsnAttrData[i].GROUP_CD_ID);
            let cdNms = '';
            if(expsnAttrData[i].ATTR_VL){
              items.forEach((code, idx) => {
                expsnAttrData[i].ATTR_VL.split(',').forEach((data, seq) => {
                  if(code.value === data){
                    expsnAttrData[i].V_MODEL.push(code);
                    cdNms += (cdNms?',':'')+code.text;
                  }
                });
              });
            }
            expsnAttrData[i].CD_NM = cdNms;
          }else if(expsnAttrData[i].DATA_TYPE_CD === 'HASH'){ //해시태그인 경우
            if(expsnAttrData[i].PHN_CUTT_ID){
              if(expsnAttrData[i].ATTR_VL){
                expsnAttrData[i].tags = [];
                for(let p in expsnAttrData[i].ATTR_VL.split(',')){
                  expsnAttrData[i].tags.push({ text: expsnAttrData[i].ATTR_VL.split(',')[p], active: true });
                }
                expsnAttrData[i].inputTagSize = '';
                expsnAttrData[i].V_MODEL = '';
              }else{
                expsnAttrData[i].tags = [];
                expsnAttrData[i].inputTagSize = '';
              }
            }else{
              expsnAttrData[i].tags = [];
              expsnAttrData[i].inputTagSize = '';
            }
          }

          if(expsnAttrData[i].GROUP_CD_ID == 'CUSL_RS'){
            expsnAttrData[i].V_MODEL = 'COMPLETED';
          }
        }

        //공통코드설정
        this.common_code = await this.mixin_common_code_get_all(codeName);
        this.EXPSN_ATTR = expsnAttrData;

        // console.log(this.EXPSN_ATTR);
      }
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
        this.CUTT_ITEMS = response.DATA;

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

    //상담유형 하위 item 가져오기
    getChildCuttTypeItems(seq, idx, parentItem) {
      let arrCuttType = [];

      if(idx === 0){
        parentItem = this.CUTT_ITEMS[0].CUTT_TYPE_ID;
        this.CUTT_ITEMS.map(function(row){
          if(row.UP_CUTT_TYPE_ID === parentItem)
            if(row) arrCuttType.push(row);
        });
      }else{
        if(parentItem){
          this.CUTT_ITEMS.map(function(row){
            if(row.UP_CUTT_TYPE_ID === parentItem)
              if(row) arrCuttType.push(row);
          });
        }
      }

      return arrCuttType || [];
    },
    //상담유형 변경 이벤트
    changeCuttTypeItems(seq, idx){
      for(let k=0; k<this.EXPSN_ATTR[seq].V_MODEL.length; k++){
        if(k > idx) this.EXPSN_ATTR[seq].V_MODEL[k] = '';//초기화
      }
    },

    //우편번호 찾기 모달
    callpostDialog(seq) {
      this.SELECTED_ATTR_INDEX = seq;
      this.$eventBus.$emit("reSetPost");
      this.mixin_showDialog('FindPost');
    },
    //우편번호 Set
    getFindPost(data) {
      this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].V_MODEL = data.zipNo; //우편번호
      this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].V_MODEL_DTL[0] = data.roadAddr; //기본주소
      this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].V_MODEL_DTL[1] = ''; //상세주소
      this.mixin_hideDialog('FindPost');
    },

    //상담내용 저장 validate
    phoneCuttSaveValidate(){
      // if(this.selectedRow.CHG_PSBL_YN === 'N'){
      //   this.showAlert({alertDialogToggle: true, msg: '변경 승인 요청중인 내역이 존재 합니다.<br>변경 승인 후 수정이 가능 합니다.', iconClass: 'is-caution', type: 'default'});
      //   return;
      // }

      if(!this.CUTT_BGNG_DT || !this.CUTT_END_DT){
        this.showAlert({alertDialogToggle: true, msg: '상담시간 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
        return;
      }else{
        let CHG_CUTT_BGNG_DT = this.CUTT_BGNG_DT.replace(/-/gi, '')+this.CUTT_BGNG_TIME.replace(/:/gi, '')+(this.CUTT_BGNG_TIME.split(':').length > 1?'':'00'); //상담 시작 일시
        let CHG_CUTT_END_DT = this.CUTT_END_DT.replace(/-/gi, '')+this.CUTT_END_TIME.replace(/:/gi, '')+(this.CUTT_END_TIME.split(':').length > 1?'':'00'); //상담 종료 일시

        if(CHG_CUTT_END_DT <= CHG_CUTT_BGNG_DT){
          this.showAlert({alertDialogToggle: true, msg: '상담 종료 시간이 상담 시작 시간 보다 작거나 같을 수 없습니다.', iconClass: 'is-caution', type: 'default'});
          return;
        }
      }

      if(!this.SRCH_CUST.CUST_ID){
        this.showAlert({alertDialogToggle: true, msg: '고객 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
        return;
      }

      if(!this.SRCH_USER.USER_ID){
        this.showAlert({alertDialogToggle: true, msg: '상담직원 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
        return;
      }

      if(!this.AFTPRCS_HR){
        this.showAlert({alertDialogToggle: true, msg: '후처리 시간 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
        return;
      }

      // if(!this.REC_FILE_NM){
      //   this.showAlert({alertDialogToggle: true, msg: '녹취 파일 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
      //   return;
      // }

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
            if(!this.EXPSN_ATTR[i].V_MODEL){
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

      let sRsvtCall = false;
      let sCuslRs = '';
      this.EXPSN_ATTR.forEach((attr, idx) => {
        if(attr.EXPSN_ATTR_COL_ID === 'RSVT_CALL'){
          sRsvtCall = attr.V_MODEL;
        }

        if(attr.EXPSN_ATTR_COL_ID === 'CUSL_RS'){
          sCuslRs = attr.V_MODEL;
        }
      });

      if(sRsvtCall){
        if(sCuslRs === 'COMPLETED'){
          this.showAlert({alertDialogToggle: true, msg: '예약콜을 접수하신 경우 상담 결과는 <font color="red">처리중</font> 상태로 변경해 주시기 바랍니다.', iconClass: 'is-caution', type: 'default'});
          return;
        }
      }

      if(this.selectedRow.CHG_PSBL_YN === 'Y'){
        if(!this.CHG_RSN){
          this.showAlert({alertDialogToggle: true, msg: '변경사유 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
          return;
        }
      }

      this.showAlert(this.MESSAGE.CONFIRM.REG);
    },

    //상담내용 저장
    async phoneCuttSave() {
      let sUrl = '/phone-api/cutt/cuttProc';
      let postParam = {
        PHN_CUTT_ID : this.PHN_CUTT_ID
        , CUTT_BGNG_DT : this.CUTT_BGNG_DT.replace(/-/gi, '')+this.CUTT_BGNG_TIME.replace(/:/gi, '')+(this.CUTT_BGNG_TIME.split(':').length > 1?'':'00') //상담 시작 일시
        , CUTT_END_DT : this.CUTT_END_DT.replace(/-/gi, '')+this.CUTT_END_TIME.replace(/:/gi, '')+(this.CUTT_END_TIME.split(':').length > 1?'':'00') //상담 종료 일시
        , CL_TYPE_CD : this.CL_TYPE_CD //콜 유형(IN, OUT)
        , CUST_ID : this.SRCH_CUST.CUST_ID //고객 ID
        , CUSL_ID : this.SRCH_USER.USER_ID //상담사 ID
        , AFTPRCS_HR : this.AFTPRCS_HR //후처리 시간(초)
        , REC_FILE_NM : this.REC_FILE_NM //녹취 파일명
        , FORC_CRT_YN : (this.PHN_CUTT_ID?'N':'Y') //강제 등록 여부
        , CHG_RSN : this.CHG_RSN
        , CLBK_ID : this.selectedRow.CLBK_ID
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
            postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].dateTimeDate.replace(/-/gi, '') + this.EXPSN_ATTR[i].selectedTime.replace(/:/gi, '')+'00';
            this.EXPSN_ATTR[i].V_POST_PARAM = this.EXPSN_ATTR[i].dateTimeDate.replace(/-/gi, '') + this.EXPSN_ATTR[i].selectedTime.replace(/:/gi, '')+'00';
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
          //this.EXPSN_ATTR[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = sHashTxt;
        }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'POST'){ //우편번호
          postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL + '|' + (this.EXPSN_ATTR[i].V_MODEL_DTL[0]?this.EXPSN_ATTR[i].V_MODEL_DTL[0]:'') + '|' + (this.EXPSN_ATTR[i].V_MODEL_DTL[1]?this.EXPSN_ATTR[i].V_MODEL_DTL[1]:'');
          this.EXPSN_ATTR[i].V_POST_PARAM = this.EXPSN_ATTR[i].V_MODEL + '|' + (this.EXPSN_ATTR[i].V_MODEL_DTL[0]?this.EXPSN_ATTR[i].V_MODEL_DTL[0]:'') + '|' + (this.EXPSN_ATTR[i].V_MODEL_DTL[1]?this.EXPSN_ATTR[i].V_MODEL_DTL[1]:'');
          //this.EXPSN_ATTR[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL + '|' + this.EXPSN_ATTR[i].V_MODEL_DTL[0] + '|' + this.EXPSN_ATTR[i].V_MODEL_DTL[1];
          // postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL ;
          // postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID+'_DTL1'] = this.EXPSN_ATTR[i].V_MODEL_DTL[0];
          // postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID+'_DTL2'] = this.EXPSN_ATTR[i].V_MODEL_DTL[1];
        }
      }

      let headParam = {
        head : {
        }
      }

      postParam.EXPSN_ATTR = JSON.stringify(this.EXPSN_ATTR);

      // console.log(postParam);

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.mixin_hideDialog('AddHistory');
        this.refreshPhoneCuttForm();
        this.srchValidate('');

        // this.showAlert(this.MESSAGE.ALERT.SUCCESS);
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>