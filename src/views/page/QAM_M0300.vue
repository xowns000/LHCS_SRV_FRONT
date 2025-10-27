<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
        <template slot="search">
          <v-form ref="form">
            <div class="pl-form-inline-wrap">
              <div class="pl-form-inline">
                <span class="pl-label">
                  시행 연도
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-select class="pl-form"
                    :items="DROP_ENFC_YR"
                    placeholder="선택하세요"
                    v-model="QA_PLAN.ENFC_YR"
                    @change="changeSelect"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">진행 상태</span>
                <div class="pl-desc">
                  <v-select class="pl-form"
                    :items="DROP_PRGRS_STTS"
                    placeholder="선택하세요"
                    v-model="QA_PLAN.PRGRS_STTS_CD"
                    @change="changeSelect"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">시행 구분</span>
                <div class="pl-desc">
                  <v-select class="pl-form"
                    :items="DROP_ENFC_SE"
                    placeholder="선택하세요"
                    v-model="QA_PLAN.ENFC_SE_CD"
                    item-text="QLTY_CLSF_NM"
                    item-value="QLTY_CLSF_ID"
                    @change="changeSelect"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                  <span class="pl-label">시행계획 명</span>
                  <div class="pl-desc">
                    <v-select class="pl-form is-lg"
                      :items="DROP_PLAN_NM"
                      placeholder="선택하세요"
                      v-model="SELECTED_QA_PLAN"
                      item-text="PLAN_NM"
                      item-value="QA_PLAN_ID"
                      @change="changeQaPlan"
                      return-object
                      :rules="validateRules.QA_PLAN"
                      ></v-select>
                  </div>
              </div>
              <v-btn class="pl-btn is-icon" @click="btnSearch">
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
            </div>
          </v-form>
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
      <!-- grid -->
      <v-tabs class="pl-tabs" v-model="tab">
        <v-tab @click="changeTab(0)">평가지 </v-tab>
        <v-tab @click="changeTab(1)">대상자 선정</v-tab>
        <v-tab @click="changeTab(2)">대상자 할당</v-tab>
      </v-tabs>
      <div style="height: 556px">
        <v-tabs-items v-model="tab" class="pl-tabs-items">
          <!-- 평가지 -->
          <v-tab-item>
            <div class="pl-cols" style="height: 100%">
              <div class="is-col-fix is-vrt" style="width: 412px">
                <div class="pl-card">
                  <ul class="pl-list-dot is-no-border mt-0">
                    <li>표준 평가지표를 활용하여 QA 평가시행에 필요한  평가표를 생성하고 관리합니다.</li>
                    <li>표준 <strong>평가지표 불러오기 </strong>후 평가 품질지표 및 배점을 조정하여 평가표를 생성하십시오.</li>
                  </ul>
                  <v-btn class="pl-btn is-icon is-sub is-mt-m" @click="btnGeQltyEvlArtcl">
                    <span class="pl-icon20 document"></span>
                    평가지표 불러오기
                  </v-btn>
                </div>
                <div class="pl-card">
                  <div class="pl-form-inline-wrap vertical type-2">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        평가지표 구분
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          class="pl-form"
                          disabled
                          v-model="SELECTED_QA_PLAN.ENFC_SE_NM"
                        />
                      </div>
                    </div>
                    <!--
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        평가표 명
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          class="pl-form"
                        />
                      </div>
                    </div>
                    -->
                  </div>
                  <ul class="pl-list-info">
                    <li>평가표 확정 후, 평가 관리자가 이미 QA 평가를 진행한 경우 평가표는 수정할 수 없습니다.</li>
                  </ul>
                </div>
              </div>
              <!-- grid -->
              <div class="is-vrt">
                <div class="pl-card">
                  <v-form ref="sheetForm">
                    <div class="pl-grid-top">
                      <div class="pl-grid-top-left">
                        <v-btn class="pl-btn is-icon is-sub" @click="btnEvlSheetSave">
                          <span class="pl-icon20 save"></span>
                          저장
                        </v-btn>
                        <!--
                        <v-btn class="pl-btn is-icon is-sub" @click="btnFix">
                          <span class="pl-icon20 select-accept"></span>
                          평가표 확정
                        </v-btn>
                        -->
                      </div>
                      <div class="pl-grid-top-utils">
                        <span class="pl-counter">전체 <em class="pl-1">({{ itemsRowSpan.length }})</em> 건</span>
                        <!-- 엑셀 다운로드 버튼 -->
                        <compo-excel
                          TypeProp="Download"
                          :DataHeaderProp="headersRowSpan"
                          :DataBodyProp="itemsRowSpan"
                          :FileNameProp="SELECTED_QA_PLAN.PLAN_NM+'_평가지_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                          HeaderColorProp="00B0F0"
                        ></compo-excel>
                      </div>
                    </div>
                    <v-data-table
                      class="pl-grid is-rowspan type-hover-func"
                      :headers="headersRowSpan"
                      :items="itemsRowSpan"
                      fixed-header
                      item-key="index"
                      height="445px"
                      hide-default-footer
                      no-data-text="등록된 데이터가 없습니다."
                      disable-pagination
                    >
                      <template v-slot:item="{ item, index }">
                        <tr
                          @mouseover="mixin_hoverItem(item,'itemsRowSpan')"
                          @mouseleave="mixin_leaveItem(item,'itemsRowSpan')"
                          :class="mixin_getItemClass(item)"
                          :key="index">
                          <td
                            v-if="index === 0 || item.type01 !== itemsRowSpan[index - 1].type01"
                            :rowspan="mixin_getRowCount(index, 'type01')"
                            :class="mixin_getHeaderClass(headersRowSpan[0].align)">{{ item.type01 }}</td>
                          <td
                            v-if="index === 0 || item.type02 !== itemsRowSpan[index - 1].type02"
                            :rowspan="mixin_getRowCount(index, 'type02')"
                            :class="mixin_getHeaderClass(headersRowSpan[1].align)">{{ item.type02 }}</td>
                          <td :class="mixin_getHeaderClass(headersRowSpan[2].align)">
                            <template v-if="item.editable">
                              <!-- <v-text-field class="pl-form is-auto" :value="item.type03" v-model="item.ASSSCOR"/> -->
                              <v-text-field
                                class="pl-form is-auto"
                                v-model="item.ASSSCOR"
                                :value="item.type03 == '' ? 0 : item.type03"
                                type="number"
                                oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' ); this.value=='' ? this.value = 0 : (this.value < 0 ? this.value = 0 : this.value = this.value);"
                                v-byte-counter="4"
                              />
                              </template>
                            <template v-if="!item.editable">
                              {{ item.type03 }}
                            </template>
                          </td>
                          <td style="white-space: pre-line;">
                            <template v-if="item.editable">
                              <v-text-field class="pl-form is-auto" :value="item.subject" v-model="item.EVL_ARTCL_NM" :rules="sheetValidateRules.EVL_ARTCL_NM1"/>
                            </template>
                            <template v-if="!item.editable">
                              {{ item.subject }}
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
                          </td>
                        </tr>
                      </template>
                      <!-- 합계 -->
                      <template slot="footer">
                        <div class="pl-grid-sum">
                          <table >
                            <colgroup>
                              <col v-for="(col, index) in headersRowSpan" :key="index" :width=col.width />
                            </colgroup>
                            <tbody >
                              <tr >
                                <td colspan="2" class="pl-grid-sum-head text-center">합계</td>
                                <td class="text-center">
                                  {{ mixin_sum_group_field(this.itemsRowSpan, "QLTY_CLSF_ID","type03") }}
                                </td>
                                <td class="text-right"></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </template>
                    </v-data-table>
                  </v-form>
                </div>
              </div>
            </div>
          </v-tab-item>
          <!-- 대상자 선정 -->
          <v-tab-item>
            <v-form ref="slctnForm">
            <div class="pl-cols" style="height: 100%">
              <div class="is-col-fix is-vrt" style="width: 412px">
                <div class="pl-card">
                  <ul class="pl-list-dot is-no-border mt-0">
                    <li>대상자 선정을 위해 조회 조건을 지정 하신 후 <strong>[대상자 조회] 버튼을 클릭</strong> 하십시오.</li>
                    <li>대상자 조회 후 <strong>[대상자 선정] 버튼을 클릭</strong> 하신 후 대상자를 반드시 선정해 주십시오.</li>
                  </ul>
                  <h2 class="pl-subtit is-mt-l">조회 조건</h2>
                  <div class="pl-form-inline-wrap vertical type-auto is-mt-s ">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        상담채널
                      </span>
                      <div class="pl-desc">
                        <v-select
                          :items="dropItemsS01"
                          placeholder="선택하세요"
                          class="pl-form"
                          @change="changeChnl"
                          v-model="SEARCH_TARGET.CHNL_CD"
                          :rules="slctnValidateRules.CHNL"
                          :readonly="true"
                        ></v-select>
                        <v-select
                          :items="dropItemsS02"
                          placeholder="선택하세요"
                          class="pl-form"
                          v-model="SEARCH_TARGET.CALL_TP_CD"
                        ></v-select>
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        상담일자
                      </span>
                      <div class="pl-desc">
<!--                        <div class="pl-calendar-range-form">-->
<!--                          <compo-date-picker-->
<!--                            DateType="dateInput"-->
<!--                            :DateProp.sync="SEARCH_TARGET.CUTT_BGNG_DT"-->
<!--                          />-->
<!--                          <span class="pl-unit">~</span>-->
<!--                          <compo-date-picker-->
<!--                            DateType="dateInput"-->
<!--                            :DateProp.sync="SEARCH_TARGET.CUTT_END_DT"-->
<!--                          />-->
<!--                          <compo-drop-picker-->
<!--                            :StartDateProp.sync="SEARCH_TARGET.CUTT_BGNG_DT"-->
<!--                            :EndDateProp.sync="SEARCH_TARGET.CUTT_END_DT"-->
<!--                          />-->
<!--                        </div>-->
                        <compo-date-range-picker
                            :StartDayProp.sync="SEARCH_TARGET.CUTT_BGNG_DT"
                            :EndDayProp.sync="SEARCH_TARGET.CUTT_END_DT"
                            @startDayChange="mixin_testLog(SEARCH_TARGET.CUTT_BGNG_DT)"
                            @endDayChange="mixin_testLog(SEARCH_TARGET.CUTT_END_DT)"
                        />
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        근속기간
                      </span>
                      <div class="pl-desc" style="gap:0;">
                        <v-text-field
                          class="pl-form"
                          suffix="개월"
                          v-model="SEARCH_TARGET.PRD_FROM"
                        />
                        <span class="pl-unit">~</span>
                        <v-text-field
                          class="pl-form flex-grow-0"
                          suffix="개월"
                          v-model="SEARCH_TARGET.PRD_TO"
                        />
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        상담시간
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          class="pl-form"
                          suffix="분 이상"
                          v-model="SEARCH_TARGET.PHN_HR"
                        />
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        상담유형
                      </span>
                      <div class="pl-desc">
                        <v-autocomplete
                          v-model="SCH_CUTT_TYPE"
                          return-object
                          class="pl-form is-lg"
                          :items="CUTT_TYPE_ITEMS"
                          v-on:change="cuttType()"
                          placeholder="상담 유형을 검색하세요"
                          clearable
                          no-data-text="결과 없음"
                        />
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        상담직원
                      </span>
                      <div class="pl-desc">
                      <v-text-field
                        v-model="SRCH_USER.USER_NM"
                        class="pl-form flex-grow-1"
                        placeholder="우측의 찾기 아이콘을 클릭 하십시오"
                        disabled
                      ></v-text-field>
                      <!-- 유저 삭제 버튼 -->
                      <compo-tooltip-btn
                        TitleProp="유저 삭제"
                        ClassProp="pl-tooltip-btn"
                        IconProp="pl-icon20 div-get"
                        TooltipPositionProp="bottom"
                        @btnClick="userDel()"
                      ></compo-tooltip-btn>
                      <!-- 찾기 버튼 -->
                      <compo-tooltip-btn
                        TitleProp="고객과 응대한 상담직원을 찾기하여 선택하십시오."
                        ClassProp="pl-tooltip-btn flex-grow-0"
                        IconProp="pl-icon20 in-search"
                        TooltipPositionProp="bottom"
                        @btnClick="userSearch()"
                      ></compo-tooltip-btn>

                      </div>
                      <!-- //상담직원 찾기 모달 -->
                      <v-dialog
                        v-model="dialogUserFind"
                        content-class="dialog-draggable is-lg"
                        hide-overlay
                        @click:outside="userDel()"
                      >
                        <div class="draggable-area">drag area</div>
                        <compo-dialog
                          header-title="사용자 찾기"
                          @hide="[mixin_hideDialog('UserFind'),userDel()]"
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
                            <v-btn class="pl-btn is-sub" @click="[mixin_hideDialog('UserFind'),userDel()]">닫기</v-btn>
                            <v-btn class="pl-btn" @click="[setUserInfo('UserFind'),custInfo()]">확인</v-btn>
                          </template>
                        </compo-dialog>
                      </v-dialog>
                    </div>
                  </div>
                </div>
                <div class="pl-card">
                  <div class="pl-btn-wrap">
                    <v-btn class="pl-btn ml-auto" @click="btnSearchTarget">대상자 찾기</v-btn>
                  </div>
                  <ul class="pl-list-info">
                    <li>“상담완료” 된 정보 중 녹취 파일이 있는 정보만 조회됩니다.</li>
                  </ul>
                </div>
              </div>
              <!-- grid -->
              <div class="is-vrt">
                <div class="pl-card">
                  <div class="pl-grid-top">
                    <div class="pl-grid-top-left">
                      <!-- 임시 -->
                      <v-btn class="pl-btn is-icon is-sub" @click="btnAddSlctn">
                        <span class="pl-icon20 circle-plus"></span>
                        대상자 선정
                      </v-btn>
                      <v-btn class="pl-btn is-icon is-sub" @click="btnDelSlctn">
                        <span class="pl-icon20 div-get"></span>
                        선택한 대상자 삭제
                      </v-btn>
                    </div>
                    <div class="pl-grid-top-utils">
                      <span class="pl-counter">전체 <em class="pl-1">({{ this.items2TotalCnt }})</em> 건</span>
                    </div>
                  </div>
                  <v-data-table
                    class="pl-grid has-control is-hover"
                    :headers="headers2"
                    :items="items2"
                    show-select
                    fixed-header
                    item-key="RNUM"
                    height="445px"
                    :items-per-page="ROW_PER_PAGE2"
                    hide-default-footer
                    :page.sync="page2"
                    @page-count="pageCount2 = $event"
                    v-model="SELECTED_SLCTN"
                    no-data-text="등록된 데이터가 없습니다."
                  >
                    <template v-slot:item.CUST_NM="{ item }">
                      {{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(item.CUST_NM) : item.CUST_NM }}
                    </template>
                    <template v-slot:item.CUTT_TYPE="{ item }">
                      <v-tooltip content-class="pl-tooltip " bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <span v-bind="attrs" v-on="on">{{ item.CUTT_TYPE }}</span>
                        </template>
                        <span>{{ item.CUTT_TYPE }}</span>
                      </v-tooltip>
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
                    <!-- 더보기 다음 있을때만 노출 -->
                    <span class="pl-pager-period">
                      보기 {{ mixin_getPagePeriod(items2, page) }} / {{ items2.length }}
                      <!--
                      <v-btn class="pl-btn is-sub" :disabled.sync="items2nextDisabled" @click="getNextCuttList">다음 검색</v-btn>
                      -->
                      <compo-tooltip-btn
                        TitleProp="다음 검색"
                        ClassProp="pl-tooltip-btn is-line"
                        IconProp="pl-icon20 arrow-next-paging"
                        TooltipPositionProp="bottom"
                        :DisabledProp="items2nextDisabled"
                        @btnClick="getNextCuttList"
                    ></compo-tooltip-btn>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            </v-form>
          </v-tab-item>
          <!-- 대상자 할당 -->
          <v-tab-item>
            <div class="pl-cols" style="height: 100%">
              <div class="is-col-fix is-vrt" style="width: 412px">
                <div class="pl-card">
                  <ul class="pl-list-dot is-no-border mt-0">
                    <li>선정된 대상자를 기준으로 평가 관리자에게 일괄 또는 균등하게 할당 하거나 회수할 수 있습니다.</li>
                    <li>평가 관리자가 이미 QA 평가를 진행한 경우 회수처리 할 수 없습니다.</li>
                  </ul>
                  <h2 class="pl-subtit is-mt-l">할당 현황</h2>
                  <ul class="pl-list-info3 is-mt-s flex-wrap justify-space-between">
                    <li
                      v-for="(item, index) in SHARE_STATUS"
                      :key="index"
                      class="flex-grow-1"
                      style="height: 80px; flex: 1 1 40%">
                      <strong class="pl-list-info-desc" :class="item.class">{{ item.desc }}</strong>
                      <span class="pl-list-info-title">{{ item.title }}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- grid -->
              <div class="is-vrt">
                <div class="pl-card">
                  <div class="pl-grid-top">
                    <div class="pl-grid-top-left">
                      <v-btn class="pl-btn is-icon is-sub" @click="btnAltmnt('EQUAL')">
                        <span class="pl-icon20 div-link"></span>
                        균등 할당
                      </v-btn>
                      <v-btn class="pl-btn is-icon is-sub" @click="btnAltmnt('ADD')">
                        <span class="pl-icon20 div-set"></span>
                        추가
                      </v-btn>
                      <v-btn class="pl-btn is-icon is-sub" @click="btnAltmnt('WITHDRAW')">
                        <span class="pl-icon20 div-get"></span>
                        회수
                      </v-btn>
                      <v-btn class="pl-btn is-icon is-sub" @click="btnAltmnt('WITHDRAWALL')">
                        <span class="pl-icon20 div-share"></span>
                        전체 회수
                      </v-btn>
                      </div>
                    <div class="pl-grid-top-utils">
                      <span class="pl-counter">전체 <em class="pl-1">({{ items3TotalCnt }})</em> 건</span>
                    </div>
                  </div>
                    <v-data-table
                    class="pl-grid has-control"
                    :headers="headers3"
                    :items="items3"
                    show-select
                    fixed-header
                    item-key="LIST_KEY"
                    height="445px"
                    :items-per-page="ROW_PER_PAGE3"
                    hide-default-footer
                    :page.sync="page3"
                    @page-count="pageCount3 = $event"
                    v-model="SELECTED_ALTMNT"
                    no-data-text="등록된 데이터가 없습니다."
                  >
                    <template v-slot:item.addInput="{ item }">
                      <v-text-field
                        class="pl-form"
                        :value="item.addInput"
                        v-model="item.addInput"
                        @change="changeAddInput(item)"
                      >
                      </v-text-field>
                    </template>
                  </v-data-table>
                  <div class="pl-pager">
                    <div class="pl-pager-row">
                      <span>페이지당 항목 수</span>
                      <v-select
                        class="pl-form"
                        :value="ROW_PER_PAGE3"
                        :items="perPage3"
                        :item-text="toString(ROW_PER_PAGE3)"
                        @change="ROW_PER_PAGE3 = parseInt($event, 10);"
                      ></v-select>
                    </div>
                    <v-pagination
                      v-model="page3"
                      :length="pageCount3"
                      circle
                      :total-visible="7">
                    </v-pagination>
                    <!-- 더보기 다음 있을때만 노출 -->
                    <span class="pl-pager-period">
                      보기 {{ mixin_getPagePeriod(items3, page) }} / {{ items3.length }}
                      <!--
                      <v-btn class="pl-btn is-sub" :disabled.sync="items3nextDisabled" @click="getNextAlmntList">다음 검색</v-btn>
                      -->
                      <compo-tooltip-btn
                        TitleProp="다음 검색"
                        ClassProp="pl-tooltip-btn is-line"
                        IconProp="pl-icon20 arrow-next-paging"
                        TooltipPositionProp="bottom"
                        :DisabledProp="items3nextDisabled"
                        @btnClick="getNextAlmntList"
                      ></compo-tooltip-btn>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </div>
  </div>
</template>

<script>
import lodash from 'lodash';
import { mapGetters } from "vuex";
export default {
  name: "MENU_QAM_M0300", //name은 'MENU_' + 파일명 조합
  components: {
  },
  data() {
    return {
      //알림창 메시지
      MESSAGE: {
        CONFIRM: {
          OVERWRITE_SHEET:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '이미 저장된 평가표가 있습니다.\n그래도 불러 오시겠습니꺄?', callYes: this.getQltyEvlArtcl, callNo: this.closeMsg, },
          EQUAL_ADD:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '균등 할당 하시겠습니까?', callYes: this.execAltmntEqual, callNo: this.closeMsg, },
          WITHDRAW_ALL:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '전체 회수 하겠습니까?', callYes: this.execAltmntWithdrawall, callNo: this.closeMsg, },
        },
        ALERT: {
          SAVE_DONE:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '저장 되었습니다.' },
          DEL_DONE:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '삭제 되었습니다.' },
          NO_ARTCL_DATA:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '저장된 평가지표가 없습니다.', },
          NO_ADD_CNT:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '추가할 관리자와 추가 건수를 입력하세요.', },
          NO_WITHDRAW_DATA:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '회수할 관리자와 회수 건수를 입력하세요.', },
          SLCTN_ADD_DONE:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '선택한 대상자가 추가 되었습니다.', },
          SLCTN_DEL_DONE:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '선택한 대상자가 삭제 되었습니다.', },
          OVER_CNT_ADD:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '추가할 대상자수가 미할당 건수 보다 많습니다.', },
          OVER_CNT_DEL:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '회수할 대상자수가 기할당 건수 보다 많습니다.', },
          CHK_ADDINPUT:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '추가/회수 수치를 확인 하세요.', },
          SEL_TRGT_TO_ADD:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '선정할 대상자를 선택 하세요.', },
          SEL_TRGT_TO_DEL:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '삭제할 대상자를 선택 하세요.', },
          IS_TERMIAT:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '종료된 평가입니다', },
          EVL_CNT_EXIST:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가관리자가 이미 QA평가를 진행하여 처리 할 수 없습니다.', },
          NO_ADD_CL_ONGONG:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가중 콜 추가가 불가능 합니다.', },
          NO_DEL_CL_ONGONG:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가중 콜 삭제가 불가능 합니다.', },
          ALREADY_EQUAL:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '이미 할당된 건이 있어 균등할당 할 수 없습니다.', },
          ARTCL_MAX_LENGTH:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '품질기준명은 400자까지만 입력 가능합니다.', },
          NO_QA_PLAN:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '시행계획 조회 후 가능 합니다.'},
          NO_DATA_SAVE:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '저장할 데이터가 없습니다.'},
          NO_DATA:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '데이터가 없습니다.'},
          ALREADY_ADD_EXIST:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '이미 선정된 대상자는 추가할 수 없습니다.' },
          NOTYET_ADD_EXIST:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '선정되지 않은 대상자는 삭제할 수 없습니다.' },
          NOT_DEL_REASON_ALTMNT:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가관리자가 할당되어 삭제할 수 없습니다.<br>대상자 할당 탭으로 이동하여 전체 회수 후 삭제해 주시기 바랍니다.' },
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },
      validateRules: {
        QA_PLAN: [
          v => !!v.QA_PLAN_ID || '시행계획을 선택하세요.',
        ],
        ENFC_YR: [
          v => !!v || '시행연도는 필수 입력 항목 입니다.',
        ],
      },
      slctnValidateRules: {
        CHNL: [
          v => !!v || '시행연도는 필수 입력 항목 입니다.',
        ],
      },
      sheetValidateRules: {
        EVL_ARTCL_NM1: [
          v => v.length <= 400 || 'Max 400 characters',
        ],
        EVL_ARTCL_NM2: [
          v => v.length <= 400 || 'Max 400 characters',
        ],
      },

      tab: null,

      // info
      TOP_INFO: [
      ],
      // 평가지
      // grid

      page: 1,
      pageCount: 0,
      //perPage: [15,30,50,100],
      perPage: [15, 30, 50, 100],
      ROW_PER_PAGE: 15,
      hoverRow: null,
      headersRowSpan: [
          { text: "대분류"  , value: "type01"       , align: "left" , width: "150px" , sortable: false},
          { text: "중분류"  , value: "type02"       , align: "left" , width: "150px" , sortable: false},
          { text: "배점"    , value: "type03"       , align: "center", width: "150px" , sortable: false},
          { text: "품질기준", value: "EVL_ARTCL_NM" , align: "left" , width: ""      , sortable: false},
      ],
      itemsRowSpan: [

      ],
      // 대상자 선정
      dropItemsS01: [],
      dropItemsS02: [],
      page2: 1,
      pageCount2: 0,
      perPage2: [15,30,50,100],
      ROW_PER_PAGE2:15,
      //ROW_PER_PAGE2:3,
      //페이징용 변수
      ROW_ONCE_PAGE: 500, //한번에 가져오는 건수 (공통)
      //ROW_ONCE_PAGE: 6, //한번에 가져오는 건수 (공통)
      ROW_CURR_PAGE_ITEMS2: 1,
      items2nextDisabled: true,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
      items2TotalCnt: 0,
      headers2: [
        { text: '번호'          , value: 'RNUM'   , align: 'center' , width: '80px' },
        { text: '상담 직원'     , value: 'USER_NM'   , align: 'left' , width: '100px' },
        { text: '상담 일자'     , value: 'CUTT_DT'      , align: 'left'   , width: '120px' },
        { text: '상담 시작시간' , value: 'CUTT_BGNG_DT' , align: 'left'   , width: '120px' },
        { text: '상담 종료시간' , value: 'CUTT_END_DT'  , align: 'left'   , width: '120px' },
        { text: '상담 시간'     , value: 'CUTT_HR'       , align: 'left'   , width: '100px' },
        { text: '콜 유형'       , value: 'CL_TYPE_NM', align: 'left'   , width: '100px' },
        { text: '채널'          , value: 'CHNL_NM'      , align: 'left'   , width: '100px' },
        { text: '고객명'        , value: 'CUST_NM'      , align: 'left'   , width: '100px' },
        { text: '선정일자'      , value: 'SLCTN_DT'     , align: 'left'   , width: '120px' },
        { text: '상담 유형'     , value: 'CUTT_TYPE'    , align: 'left'   , width: '100%' },

        { text: '콜유형코드'    , value: 'CL_TYPE_CD'     , align: ' d-none'},
        { text: '채널타입코드'  , value: 'CHNL_CD'        , align: ' d-none'},
        { text: '통합이력ID'    , value: 'ITGRT_HSTRY_ID' , align: ' d-none'},
        { text: '상담ID'        , value: 'PHN_CUTT_ID'    , align: ' d-none'},
        { text: 'QA대상ID'      , value: 'QA_TRGT_ID'     , align: ' d-none'},
      ],
      items2: [
      ],
      SELECTED_SLCTN: [],
      // 대상자 할당
      dropItemsS03: [ '목표한 대상 인원수로 선정', '조회된 대상 인원수 모두 선정 ', ],
      SHARE_STATUS_INIT: [
        { title: '총 대상자', desc: 0, class: 'is-txt-main' },
        { title: '할당 건수', desc: 0 },
        { title: '미할당 건수', desc: 0, class: 'is-txt-error' },
        { title: '평균 할당 건수', desc: 0 },
      ],
      SHARE_STATUS: [
        { title: '총 대상자', desc: 0, class: 'is-txt-main' },
        { title: '할당 건수', desc: 0 },
        { title: '미할당 건수', desc: 0, class: 'is-txt-error' },
        { title: '평균 할당 건수', desc: 0 },
      ],
      ALTMNT_CNT: 0,
      FREE_CNT: 0,
      page3: 1,
      pageCount3: 0,
      perPage3: [15,30,50,100],
      ROW_PER_PAGE3: 15,
      //ROW_PER_PAGE3: 2,
      ROW_CURR_PAGE_ITEMS3: 1,
      items3nextDisabled: true,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
      items3TotalCnt: 0,

      headers3: [
        { text: '번호'              , value: 'ROW_NUMBER'   , align: 'center' , width: '80px' },
        { text: '평가관리자'        , value: 'USER_NM'      , align: 'left'   , width: '120px'},
        { text: '평가관리자 ID'     , value: 'LGN_ID'       , align: 'left'   , width: '120px'},
        { text: '소속'              , value: 'FULL_PATH'    , align: 'left'   , width: '100%' },
        { text: '할당 건수'         , value: 'ALTMNT_CNT'   , align: 'center' , width: '120px'},
        { text: '완료 건수'         , value: 'COMPELTE_CNT' , align: 'center' , width: '120px'},
        { text: '할당 일자'         , value: 'ALTMNT_DT'    , align: 'center' , width: '120px'},
        { text: '추가/회수'         , value: 'addInput'     , align: 'center' , width: '120px'},

        { text: '평가관리자 USER_ID', value: 'MNGR_ID'      , align: ' d-none' },
        { text: 'ROW_KEY'           , value: 'LIST_KEY'     , align: ' d-none' },
      ],
      items3: [
      ],
      SELECTED_ALTMNT: [],
      ADD_INPUT:'',
      //-----------------
      // top search
      DROP_ENFC_YR: [],       //시행년도
      DROP_PRGRS_STTS: [],    //진행상태
      DROP_ENFC_SE: [],       //시행구분
      DROP_PLAN_NM: [],       //시행계획명
      QLTY_CLSF: [],          //평가지표

      // search form
      // 시행계획 조회용 객체
      QA_PLAN: {
        ENFC_YR: '',        //시행년도
        PRGRS_STTS_CD: '',  //진행상태
        ENFC_SE_CD: '',     //시행구분
        PLAN_NM: '',        //시행계획명
        QA_PLAN_ID: '',     //PLAN_ID
        CHNL_CD : 'TEL',    //시행채널
      },
      SELECTED_QA_PLAN: {},
      EXIST_PLAN_QLTY_SHEET: false,
      SEARCH_TARGET: {
        CUTT_BGNG_DT: '',
        CUTT_END_DT:'',
        PRD_FROM:'',
        PRD_TO:'',
        PHN_HR:'',
        CHT_HR:'',      //채팅은 쿼리에서 INTERVAL 비교 => 뒤에 minutes가 붙는다
        CHNL_CD:'',
        CHNL_NM:'',
        TEL_TP_CD:'',
        TEL_TP_NM:'',
        QA_PLAN_ID:'',
        SCH_CUTT_TYPE:'',
        CUSL_ID:'',
      },
      CHK_CUSTCO_ID: this.$store.getters["userStore/GE_USER_ROLE"].company.CD,
      QA_CODES:[],
      table_body:{},
      table_head:{},
      CURRENT_DATE:'',

      SCH_CUTT_TYPE:{},
      CUTT_TYPE_ITEMS : [],

      dialogUserFind: false, //사용자 검색 모달
      DropUser: {},
      searchUsername: '',   //사용자 이름 검색
      HeadersFindCus: [],
      ItemsFindCus:[],
      SRCH_USER: [], //상담사 정보
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
    let CURRENT_DATE = await this.mixin_getSvrDate("YYYY-MM-DD");
    let CURRENT_YEAR = parseInt(CURRENT_DATE.substr(0, 4));
    this.QA_CODES = await this.mixin_common_code_get_all(['QATS_ST', 'CALL_TP', 'CHNL', 'CHNL_CL'], 'Y');
    let QLTY_CLSF_CODES = await this.getQltyClfsCode();

    //selectbox 연도 설정 (-5년~+5년)
    this.DROP_ENFC_YR.push({ text: '전체', value: '' });   // default
    for (let i = -5; i < 5; i++) {
      this.DROP_ENFC_YR.push({ text: `${CURRENT_YEAR + i}년`, value: CURRENT_YEAR + i });
    }
    this.DROP_PRGRS_STTS = this.mixin_common_code_get(this.QA_CODES, 'QATS_ST', '전체');
    this.dropItemsS01 = this.mixin_common_code_get(this.QA_CODES, 'CHNL');
    //this.dropItemsS02 = this.mixin_common_code_get(QA_CODES, 'CALL_TP');
    this.DROP_ENFC_SE = [...QLTY_CLSF_CODES];
    this.QLTY_CLSF = [...QLTY_CLSF_CODES];
    this.DROP_ENFC_SE.splice(0, 0, { QLTY_CLSF_NM: '전체', QLTY_CLSF_ID: '' });
    this.QA_PLAN.ENFC_YR = CURRENT_YEAR;
    //this.QA_PLAN.PRGRS_STTS_CD = 'PRPARG';   //준비중 디폴트 (시행관리도 진행이전에 진행해야 하므로)

    this.getQaPlan();

    let tmpDate = new Date(CURRENT_DATE);
    tmpDate = new Date(tmpDate.setDate(tmpDate.getDate() - 7)); // 현재 날짜의 6개월 전 날짜로 세팅

    this.SEARCH_TARGET.CUTT_BGNG_DT = new Date(tmpDate).toISOString().substr(0, 10);
    this.SEARCH_TARGET.CUTT_END_DT = CURRENT_DATE;
    this.SEARCH_TARGET.CHNL_CD = 'TEL';

    this.CURRENT_DATE = CURRENT_DATE;

    this.getCuttTypeList();//상담 유형
  },

  methods: {
    // mouse hover
    deleteItem(item, arr) {
      const index = this[`${arr}`].indexOf(item);
      if(index !== -1) {
        this[`${arr}`].splice(index, 1);
      }
    },
    editItem(item) {
      if(item.EVL_ARTCL_NM.length > 400) {
        item.editable = true;
        return;
      }
      item.editable = !item.editable;
      item.type03 = item.ASSSCOR;
      item.subject = item.EVL_ARTCL_NM;
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
    async changeSelect() {
      await this.getQaPlan();

      if(!this.mixin_isEmpty(this.SELECTED_QA_PLAN.QA_PLAN_ID)) {
        this.getTrgtAlmtntList();
        this.searchTarget(true);
      } else {
        this.resetData();
      }

    },
    async getQaPlan() {
      let sUrl = "/api/qa/plan/list";
      let postParam = {...this.QA_PLAN};
      let headParam = {
        head:{
          PAGING:'N',
        }
      };
      let resData = await this.common_postCall(sUrl, postParam, headParam)

      this.SELECTED_QA_PLAN = {};

      if (!resData.HEADER.ERROR_FLAG) {
        this.DROP_PLAN_NM = resData.DATA;
        if (this.DROP_PLAN_NM.length > 0) {
          this.QA_PLAN.QA_PLAN_ID = this.DROP_PLAN_NM[0].QA_PLAN_ID;
          this.SELECTED_QA_PLAN = this.DROP_PLAN_NM[0];
          this.resetData();
          this.setQaEnfc();
          this.getPlanQlty();
        } else {
          try{this.$refs.slctnForm.resetValidation();}catch(e){}
        }
      }
    },
    async btnSearch() {
      if(!this.$refs.form.validate())
        return;
      else {
          this.resetData();
          await this.getPlanQlty();
          this.searchTarget(true);
          this.getTrgtAlmtntList();
      }
    },
    changeQaPlan() {
      this.resetData();
      this.setQaEnfc();
      this.getPlanQlty();
      this.getTrgtAlmtntList();
      this.searchTarget(true);
    },
    setQaEnfc() {
      const oItem = this.SELECTED_QA_PLAN;
      if(oItem.EVL_BGNG_YMD.indexOf("-") == -1){
        oItem.EVL_BGNG_YMD = this.mixin_convertDate(oItem.EVL_BGNG_YMD, 'yyyy-MM-dd');
      }
      if(oItem.EVL_END_YMD.indexOf("-") == -1){
        oItem.EVL_END_YMD = this.mixin_convertDate(oItem.EVL_END_YMD, 'yyyy-MM-dd');
      }
      this.TOP_INFO = [
        {
          title: '시행계획 명',
          desc: oItem.PLAN_NM,
          class: '',
        },
        {
          title: '시행 구분',
          desc: oItem.ENFC_SE_NM,
          class: '',
        },
        {
          title: '평가 기간',
          desc: oItem.EVL_BGNG_YMD + ' ~ ' + oItem.EVL_END_YMD,
          class: '',
        },
        {
          title: '시행 차수',
          desc: oItem.CYCL_CNT,
          class: '',
        },
        {
          title: '진행상태',
          desc: oItem.PRGRS_STTS_NM,
          class: 'is-txt-main',
        },
        // {
        //   title: '목표 대상자',
        //   desc: '150명',
        //   class: '',
        // },
        {
          title: '등록자',
          desc: oItem.RGTR_ID_NM,
          class: '',
        },
        {
          title: '등록일',
          desc: oItem.REG_DT,
          class: '',
        },
      ];

      this.SEARCH_TARGET.CHNL_CD = oItem.EVL_CHN_CD;

      this.changeChnl();
    },
    changeTab(id) {
      // console.log('changeTab', 'this.tab', this.tab, 'id', id, 'this.SELECTED_QA_PLAN', this.SELECTED_QA_PLAN);
      if (id == 2 && id != this.tab && !this.mixin_isEmpty(this.SELECTED_QA_PLAN)) { //대상자 할당 TAB이 선택 되었을 경우 선정 대상자를 불러온다. (탭이 변경되었을 경우만)
        this.getTrgtAlmtntList();
      }
      else if (id == 1 && id != this.tab && !this.mixin_isEmpty(this.SELECTED_QA_PLAN)) {
        this.searchTarget(true);
      }
    },
    //해당 Plan의 계획 품질 조회
    resetData() {
      this.itemsRowSpan = [];
      this.items2 = [];
      this.items3 = [];
      this.SHARE_STATUS = [...this.SHARE_STATUS_INIT];
    },
    async getPlanQlty() {
      //해당 시행계획의 평가지표
      let sUrl = "/api/qa/evlmng/planqltylist";
      let postParam = {
        //넘길 파라미터(대문자)
        UP_QLTY_CLSF_ID: this.SELECTED_QA_PLAN.ENFC_SE_CD,
        QA_PLAN_ID: this.SELECTED_QA_PLAN.QA_PLAN_ID,
        DEL_YN: 'N'
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!resData.HEADER.ERROR_FLAG) {
        //성공시 이벤트
        this.setPlanQltySheet(resData);
        if(resData.DATA.length < 1)
          this.EXIST_PLAN_QLTY_SHEET = false;
        else
          this.EXIST_PLAN_QLTY_SHEET = true;
      }
    },
    // 평가지표 불러 오기 Click
    btnGeQltyEvlArtcl() {
      if(this.mixin_isEmpty(this.SELECTED_QA_PLAN.QA_PLAN_ID)) {
        this.showAlert(this.MESSAGE.ALERT.NO_QA_PLAN);
        return;
      }

      //평가시트가 저장되어 있는 경우 그래도 불러올지 물어보기
      if(this.EXIST_PLAN_QLTY_SHEET)
        this.showAlert(this.MESSAGE.CONFIRM.OVERWRITE_SHEET);
      else
        this.getQltyEvlArtcl();
    },

    // 평가지표 불러 오기 - 해당 시행구분-평가지표 템플릿
    async getQltyEvlArtcl() {
      this.$store.commit("alertStore/hideAlert");

      if(this.mixin_isEmpty(this.SELECTED_QA_PLAN.ENFC_SE_CD) || this.mixin_isEmpty(this.SELECTED_QA_PLAN)) {
        this.showAlert(this.MESSAGE.ERROR.NO_PLAN);
        return;
      }

      //해당 시행계획의 평가지표
      let sUrl = "/api/qa/evlmng/artcllist";
      let postParam = {
        //넘길 파라미터(대문자)
        UP_QLTY_CLSF_ID: this.SELECTED_QA_PLAN.ENFC_SE_CD,
        USE_YN: 'Y',
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!resData.HEADER.ERROR_FLAG) {
        //성공시 이벤트
        if (resData.DATA.length < 1)
          this.showAlert(this.MESSAGE.ALERT.NO_ARTCL_DATA);
        else
          this.setPlanQltySheet(resData);
      }
    },
    setPlanQltySheet(resData) {  //가져온 데이터를 기준으로 평가표를 표시
      //가져온 데이터를 양식에 맞게 재구성.
      let oPaper = [];
      resData.DATA.forEach(item => {
        item.QA_PLAN_ID = this.SELECTED_QA_PLAN.QA_PLAN_ID;
        let oSetItem = {};
        if (this.mixin_isEmpty(item.UP_QLTY_CLSF_NM)) {        // UP_QLTY_CLSF_NM 가 없으면 대분류
          item.index = oPaper.length + 1;
          item.type01 = item.QLTY_CLSF_NM;
          item.DEL_YN = 'N';
          oPaper.push(item);
        } else if (this.mixin_isEmpty(item.EVL_ARTCL_ID)) {   // UP_QLTY_CLSF_ID는 있는데 EVL_ARTCL_ID 가 없으면 중분류 Only -> 상위 대분류에 내용 넣어줌
          let oLastItem = oPaper[oPaper.length - 1];
          item.index = oLastItem.index;
          item.type01 = oLastItem.type01;
          item.type02 = item.QLTY_CLSF_NM;
          item.DEL_YN = 'N';
          if (this.mixin_isEmpty(oLastItem.subject)) // 바로 앞 항목이 분류면 update, 품질기준이면 insert
            oPaper.pop();
          oPaper.push(item);
        } else {                                              // 그 외의 경우는 품질 기준 Level.
          let oLastItem = oPaper.length > 0 ? oPaper[oPaper.length - 1] : [];
          let bUpdate = (this.mixin_isEmpty(oLastItem) || !this.mixin_isEmpty(oLastItem.type02)) ? false : true;

          // 상위에 대분류만 들어가 있는 경우는 상위 item 업데이트, 그외의 경우는 새로 item insert
          item.type01 = item.UP_QLTY_CLSF_NM;
          item.type02 = item.QLTY_CLSF_NM;
          item.type03 = item.ASSSCOR;
          item.subject = item.EVL_ARTCL_NM;
          item.index = bUpdate ? oLastItem.index : oPaper.length + 1;
          item.DEL_YN = 'N';
          item.editable = false;
          if (bUpdate) oPaper.pop();
          oPaper.push(item);
        }
      });
      this.itemsRowSpan = oPaper;
    },
    checkSheetArtclNmLength() {
      for (let item of this.itemsRowSpan) {
        if (item.EVL_ARTCL_NM.length > 400) {
          item.editable = true;
        }
      }
    },
    async btnEvlSheetSave() {
      if(this.itemsRowSpan.length < 1) {
        this.showAlert(this.MESSAGE.ALERT.NO_DATA_SAVE);
        return;
      }
      await this.checkSheetArtclNmLength();
      if(!this.$refs.sheetForm.validate()) {
        return;
      }

      if (this.SELECTED_QA_PLAN.PRGRS_STTS_CD == 'TERMIAT') {
        this.showAlert(this.MESSAGE.ALERT.IS_TERMIAT);
        return;
      }

      let sUrl = "/api/qa/evlmng/save";
      let postParam = { EVL_LIST: this.itemsRowSpan}
      let headParam = {
      };

      let resData = await this.common_postCall(sUrl, postParam, headParam)

      if (resData.HEADER.ERROR_FLAG) {
        //실패시 이벤트 + alert메시지
        if(resData.HEADER.ERROR_MSG == 'IS_TERMIAT' || resData.HEADER.ERROR_MSG == 'EVL_CNT_EXIST') {
          this.showAlert(this.MESSAGE.ALERT[resData.HEADER.ERROR_MSG]);
        }
      } else {
        // console.log('resData.DATA', resData.DATA);
        this.showAlert(this.MESSAGE.ALERT.SAVE_DONE);
        this.getPlanQlty();
      }
    },
    getNextCuttList() {
      this.btnSearchTarget(false, true);
    },
    getNextAlmntList() {
      this.getTrgtAlmtntList(true);
    },
    //대상자 선정 - 대상자 찾기
    btnSearchTarget(bAll, bNext) {
      if (this.mixin_isEmpty(this.SELECTED_QA_PLAN.QA_PLAN_ID)) {
        this.showAlert(this.MESSAGE.ALERT.NO_QA_PLAN);
        return;
      }
      if (!this.$refs.slctnForm.validate())
        return;
      this.SELECTED_SLCTN = [];
      this.searchTarget(false, bNext);
    },
    async searchTarget(bAll, bNext) {
      let sUrl = "/api/qa/evlmng/cuttlist";
      if(this.SEARCH_TARGET.CHNL_CD == 'TEL'){

      } else {
        let day = '';
        let hour = '';
        let minute = '';
        if(this.SEARCH_TARGET.PHN_HR >= 60){
          hour = parseInt(this.SEARCH_TARGET.PHN_HR) / 60;
          minute = parseInt(this.SEARCH_TARGET.PHN_HR) % 60;
          if(hour >= 24){
            day = parseInt(hour) / 24;
            hour = parseInt(hour) % 24;
            if(hour >= 10){
              if(minute >= 10){
                this.SEARCH_TARGET.CHT_HR = day.toString() + hour.toString() + minute.toString() + '00';
              } else {
                this.SEARCH_TARGET.CHT_HR = day.toString() + hour.toString() + '0' + minute.toString() + '00';
              }
            } else {
              if(minute >= 10){
              this.SEARCH_TARGET.CHT_HR = day.toString() + hour.toString() + '0' + minute.toString() + '00';
              } else {
              this.SEARCH_TARGET.CHT_HR = day.toString() + hour.toString() + '00' + minute.toString() + '00';
              }
            }
          }else if(hour >= 10){
            if(minute >= 10){
              this.SEARCH_TARGET.CHT_HR = hour.toString() + minute.toString() + '00';
            } else {
              this.SEARCH_TARGET.CHT_HR = hour.toString() + '0' + minute.toString() + '00';
            }
          } else {
            if(minute >= 10){
              this.SEARCH_TARGET.CHT_HR = hour.toString() + minute.toString() + '00';
            } else {
              this.SEARCH_TARGET.CHT_HR = hour.toString() + '00' + minute.toString() + '00';
            }
          }
        } else {
          this.SEARCH_TARGET.CHT_HR = this.SEARCH_TARGET.PHN_HR + '00';
        }
      }
      this.SEARCH_TARGET.QA_PLAN_ID = this.SELECTED_QA_PLAN.QA_PLAN_ID;
      let postParam = {};
      if(bAll) {
        postParam = { ...this.SEARCH_TARGET };
        postParam.ONLY_SLCTN = 'Y';
        postParam.QA_PLAN_ID = this.SELECTED_QA_PLAN.QA_PLAN_ID;
      } else {
        postParam = { ...this.SEARCH_TARGET };
        postParam.DATE_TO = this.mixin_isEmpty(this.SEARCH_TARGET.PRD_FROM) ? '' : this.getDatePastMonth(this.CURRENT_DATE, this.SEARCH_TARGET.PRD_FROM);
        postParam.DATE_FROM = this.mixin_isEmpty(this.SEARCH_TARGET.PRD_TO) ? '' : this.getDatePastMonth(this.CURRENT_DATE, this.SEARCH_TARGET.PRD_TO);
      }

      if(bNext)
        this.ROW_CURR_PAGE_ITEMS2++;
      else
        this.ROW_CURR_PAGE_ITEMS2 = 1;

      let headParam = {
        head: {
          PAGING: 'Y',
          ROW_CNT: this.ROW_ONCE_PAGE,
          PAGES_CNT: this.ROW_CURR_PAGE_ITEMS2,
        },
      };

      let resData = await this.common_postCall(sUrl, postParam, headParam)

      if (!resData.HEADER.ERROR_FLAG) {
        if(bNext) {
          this.items2 = await this.items2.concat(resData.DATA);
        }
        else {
          this.items2 = resData.DATA;
        }

        if(resData.DATA.length > 0) {
          this.items2TotalCnt = resData.DATA[0].TWB_PAGING_TOT_COUNT;
        }
        else {
          this.items2TotalCnt = 0;
        }
      }

      this.setItem2PageNext();
      try{this.$refs.slctnForm.resetValidation();}catch(e){}
    },

    setItem2PageNext() {
      if(parseInt(this.items2TotalCnt) > this.items2.length)
        this.items2nextDisabled = false;
      else
        this.items2nextDisabled = true;
    },
    setItem3PageNext() {
      if (parseInt(this.items3TotalCnt) > this.items3.length)
        this.items3nextDisabled = false;
      else
        this.items3nextDisabled = true;
    },
    async btnAddSlctn(){
      if(this.SELECTED_QA_PLAN.EVL_CL_ADD_YN == 'N' && this.SELECTED_QA_PLAN.PRGRS_STTS_CD == 'ONGONG') {
        this.showAlert(this.MESSAGE.ALERT.NO_ADD_CL_ONGONG);
        return;
      }

      if(this.SELECTED_QA_PLAN.PRGRS_STTS_CD == 'TERMIAT') {
        this.showAlert(this.MESSAGE.ALERT.IS_TERMIAT);
        return;
      }

      if(this.SELECTED_SLCTN.length < 1) {
        this.showAlert(this.MESSAGE.ALERT.SEL_TRGT_TO_ADD);
        return;
      }

      //이미 선정된 대상자가 선택 되었는지 확인
      for(let item of this.SELECTED_SLCTN) {
        if(!this.mixin_isEmpty(item.SLCTN_DT)) {
          this.showAlert(this.MESSAGE.ALERT.ALREADY_ADD_EXIST);
          return;
        }
      }

      let sUrl = "/api/qa/evlmng/execslctn";
      let postParam = {
                        QA_PLAN_ID: this.SELECTED_QA_PLAN.QA_PLAN_ID,
                        SELECTE_DATA: this.SELECTED_SLCTN
                      };
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!resData.HEADER.ERROR_FLAG) {
        //성공시 이벤트
        this.SELECTED_SLCTN = [];
        this.searchTarget(false);
        this.showAlert(this.MESSAGE.ALERT.SLCTN_ADD_DONE);
      }
    },
    async btnDelSlctn() {
      if (this.SELECTED_QA_PLAN.PRGRS_STTS_CD == 'ONGONG') {
        this.showAlert(this.MESSAGE.ALERT.NO_DEL_CL_ONGONG);
        return;
      } else

      if (this.SELECTED_QA_PLAN.PRGRS_STTS_CD == 'TERMIAT') {
        this.showAlert(this.MESSAGE.ALERT.IS_TERMIAT);
        return;
      }

      if (this.SELECTED_SLCTN.length < 1) {
        this.showAlert(this.MESSAGE.ALERT.SEL_TRGT_TO_DEL);
        return;
      }

      let iAltmntCnt = 0;
      for(let item of this.SELECTED_SLCTN) {
        if(this.mixin_isEmpty(item.SLCTN_DT)) {
          this.showAlert(this.MESSAGE.ALERT.NOTYET_ADD_EXIST);
          return;
        }

        if(!this.mixin_isEmpty(item.QA_MNGR_ID)) iAltmntCnt++;
      }

      if (iAltmntCnt > 0) {
        this.showAlert(this.MESSAGE.ALERT.NOT_DEL_REASON_ALTMNT);
        return;
      }

      let sUrl = "/api/qa/evlmng/delslctn";
      let postParam = {
        QA_PLAN_ID: this.SELECTED_QA_PLAN.QA_PLAN_ID,
        SELECTE_DATA: this.SELECTED_SLCTN
      };
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!resData.HEADER.ERROR_FLAG) {
        //성공시 이벤트
        this.SELECTED_SLCTN = [];
        this.searchTarget(true);
        this.showAlert(this.MESSAGE.ALERT.SLCTN_DEL_DONE);
      }
    },

    async getTrgtAlmtntList(bNext) {

      if (bNext)
        this.ROW_CURR_PAGE_ITEMS3++;
      else
        this.ROW_CURR_PAGE_ITEMS3 = 1;

      //let sUrl = "/api/qa/mngrmng/mngrlist";  //평가관리자 목록 API를 호출하면서 WITH_ALTMNT 파라미터럴 Y로 넘기면 할당 현환을 같이 리턴해 준다.
      let sUrl = "/api/qa/evlmng/almntlist";
      let postParam = {
        //넘길 파라미터(대문자)
        QA_PLAN_ID: this.SELECTED_QA_PLAN.QA_PLAN_ID,
        WITH_ALTMNT: 'Y',
      }
      let headParam = {
        head: {
          PAGING: 'Y',
          ROW_CNT: this.ROW_ONCE_PAGE,
          PAGES_CNT: this.ROW_CURR_PAGE_ITEMS3,
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!resData.HEADER.ERROR_FLAG) {
        if(bNext) {
          this.items3 = await this.items3.concat(resData.DATA);
        } else {
          this.items3 = resData.DATA;
          let item = resData.SLCTN_INFO[0];
          this.SHARE_STATUS = [
            { title: '총 대상자', desc: item.TOTAL_TRGT_CNT, class: 'is-txt-main' },
            { title: '할당 건수', desc: item.ALTMNT_CNT },
            { title: '미할당 건수', desc: item.FREE_CNT, class: 'is-txt-error' },
            { title: '평균 할당 건수', desc: item.AVERAGE_CNT == 0 ? 0 : Math.round(item.AVERAGE_CNT * 10) / 10 },
          ];
          this.ALTMNT_CNT = item.ALTMNT_CNT;
          this.FREE_CNT = item.FREE_CNT;
        }

        if (resData.DATA.length > 0) {
          this.items3TotalCnt = resData.DATA[0].TWB_PAGING_TOT_COUNT;
        }
        else {
          this.items3TotalCnt = 0;
        }
      }
      this.setItem3PageNext();
    },
    changeAddInput(item) {
      item.addInput = item.addInput.replace(/[^0-9]/g, ''); //숫자만 입력

      let iIndex = this.items3.findIndex(v => v.LIST_KEY == item.LIST_KEY);
      this.items3[iIndex].addInput = item.addInput;

      if(this.mixin_isEmpty(item.addInput)) {
        //체크해제
        let index = this.SELECTED_ALTMNT.findIndex(v => v.LIST_KEY == item.LIST_KEY);
        if(index>=0)
          this.SELECTED_ALTMNT.splice(index, 1);
      } else {
        //체크
        let index = this.SELECTED_ALTMNT.findIndex(v => v.LIST_KEY == item.LIST_KEY);
        if(index < 0)
          this.SELECTED_ALTMNT.push(item);
      }


    },
    chkAddInput(assignType) {
      let cntSum = 0;

      let oTmp = this.items3;

      for(let i = 0 ; i < this.SELECTED_ALTMNT.length ; i++) {
        let item = this.SELECTED_ALTMNT[i];
        //SELECTED_ALTMNT 값을 새로 업데이트 된 값으로 변경해 줌.
        let iIndex = this.items3.findIndex(v => v.LIST_KEY == item.LIST_KEY);
        item.addInput = this.items3[iIndex].addInput;
        item.ALTMNT_CNT = this.ALTMNT_CNT;
        switch (assignType) {
          case "EQUAL":
            return true;
          case "WITHDRAWALL":
            return true;
          case "ADD":
            cntSum += Number(item.addInput);
            if (cntSum > this.FREE_CNT)
              return this.MESSAGE.ALERT.OVER_CNT_ADD;
            break;
          case "WITHDRAW":
            if (Number(item.addInput) > Number(item.ALTMNT_CNT))
              return this.MESSAGE.ALERT.OVER_CNT_DEL;
            break;
        }
        let isEmpty = this.mixin_isEmpty(item.addInput);
        if (isEmpty)
          return this.MESSAGE.ALERT.CHK_ADDINPUT;
      }
      return true;
    },

    btnAltmnt(assignType) {
      if (this.SELECTED_QA_PLAN.PRGRS_STTS_CD == 'TERMIAT') {
        this.showAlert(this.MESSAGE.ALERT.IS_TERMIAT);
        return;
      }
      switch(assignType) {
        case 'EQUAL':
          if (this.items3.length < 1) {
            this.showAlert(this.MESSAGE.ALERT.NO_DATA);
            return;
          }
          //할당된 건이 있는지 확인
          if(this.ALTMNT_CNT > 0) {
            this.showAlert(this.MESSAGE.ALERT.ALREADY_EQUAL);
            return;
          }
          this.showAlert(this.MESSAGE.CONFIRM.EQUAL_ADD);
          return;
        case 'ADD':
          if(this.SELECTED_ALTMNT.length < 1) {
            this.showAlert(this.MESSAGE.ALERT.NO_ADD_CNT);
            return;
          }
          break;
        case 'WITHDRAW':
          if (this.SELECTED_ALTMNT.length < 1) {
            this.showAlert(this.MESSAGE.ALERT.NO_WITHDRAW_DATA);
            return;
          }
          break;
        case 'WITHDRAWALL':
          if (this.items3.length < 1) {
            this.showAlert(this.MESSAGE.ALERT.NO_DATA);
            return;
          }
          this.showAlert(this.MESSAGE.CONFIRM.WITHDRAW_ALL);
          return;
      }
      this.execAltmnt(assignType);
    },
    execAltmntEqual(){
      this.execAltmnt("EQUAL");
      this.closeMsg()
    },
    execAltmntWithdrawall() {
      this.execAltmnt("WITHDRAWALL");
      this.closeMsg()
    },
    async execAltmnt(assignType) {
      let oMsg = await this.chkAddInput(assignType);

      if (oMsg != true) {
        this.showAlert(oMsg);
        return;
      }
      let sUrl = '/api/qa/evlmng/execalmnt';
      let postParam = {
        //넘길 파라미터(대문자)
        TYPE: assignType,
        QA_PLAN_ID: this.SELECTED_QA_PLAN.QA_PLAN_ID,
        SELECTED_DATA: assignType == "ADD" || assignType == "WITHDRAW" ? this.SELECTED_ALTMNT : [],
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam);
      if (this.mixin_isEmpty(resData) || resData.HEADER.ERROR_FLAG) {
        //실패시 이벤트 + alert메시지
        if (!this.mixin_isEmpty(resData) && resData.HEADER.ERROR_MSG == "OVER_CNT_ADD")
          this.showAlert(this.MESSAGE.ALERT.OVER_CNT);
        else if (!this.mixin_isEmpty(resData) && resData.HEADER.ERROR_MSG == "CHK_ADDINPUT")
          this.showAlert(this.MESSAGE.ALERT.CHK_ADDINPUT);
        else if (!this.mixin_isEmpty(resData) && (resData.HEADER.ERROR_MSG == 'IS_TERMIAT' || resData.HEADER.ERROR_MSG == 'EVL_CNT_EXIST'))
          this.showAlert(this.MESSAGE.ALERT[resData.HEADER.ERROR_MSG])
        else
          this.showAlert(this.MESSAGE.ERROR.ERROR);
      } else {
        //성공시 이벤트
        this.initAddInput();
        this.getTrgtAlmtntList();
        // console.log("selectedData.2", this.SELECTED_ALTMNT);
      }
    },
    initAddInput() {
      let oSelected = this.SELECTED_ALTMNT;
      oSelected.forEach(item => {
        item.addInput = '';
      });
    },
    changeChnl()  {
      if(this.SEARCH_TARGET.CHNL_CD == 'SNS')
        this.dropItemsS02 = this.mixin_common_code_get(this.QA_CODES, 'CHNL_CL', '전체');
      else
        this.dropItemsS02 = this.mixin_common_code_get(this.QA_CODES, 'CALL_TP', '전체');
    },
    btnFix() {
      // console.log('btnFix');
    },
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },
    btnTest() {
      // console.log('SEARCH_TARGET.PRD_FROM', this.SEARCH_TARGET.PRD_FROM);
      let oDate = new Date(this.CURRENT_DATE);
      // console.log('SEARCH_TARGET.Date', oDate.toISOString().substring(0,10));
      let oNewDate = new Date(oDate.setMonth(oDate.getMonth() - parseInt(this.SEARCH_TARGET.PRD_FROM)));
      // console.log('SEARCH_TARGET.NewDate', oNewDate.toISOString().substring(0,10));
    },
    getDatePastMonth(sDate, iPast) {
      let oDate = new Date(sDate);
      let sNewDate = new Date(oDate.setMonth(oDate.getMonth() - parseInt(iPast))).toISOString().substring(0, 10);
      return sNewDate;
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

    //선택한 상담유형의 value값 가져오기
    cuttType(){
      this.SEARCH_TARGET.SCH_CUTT_TYPE = this.SCH_CUTT_TYPE.value;
    },

    //사용자 검색
    userSearch(){
      this.mixin_showDialog('UserFind');
    },

    //고객, 사용자 선택 후 확인 버튼 클릭 이벤트
    setUserInfo(userTp) {
      this.$eventBus.$emit('setUserInfo');
      this.mixin_hideDialog(userTp);
    },

    custInfo(){
      this.SEARCH_TARGET.CUSL_ID = this.SRCH_USER.USER_ID;
    },

    userDel(){
      this.SEARCH_TARGET.CUSL_ID = '';
      this.SRCH_USER=[];
    }
  },
}
</script>

<style lang="scss" scoped></style>
