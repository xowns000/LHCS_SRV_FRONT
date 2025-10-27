<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  />
      <v-tabs class="pl-tabs" v-model="tab" >
        <v-tab>전체 예약 리스트</v-tab>
        <v-tab>미완료 예약 리스트</v-tab>
        <!-- <v-tab>예약 현황 캘린더</v-tab> -->
      </v-tabs>
      <div style="height: calc(100vh - 246px)">
        <v-tabs-items v-model="tab" class="pl-tabs-items">
          <v-tab-item>
            <div class="pl-cols" style="height: 100%">
              <div class="is-vrt">
                <div class="pl-card">
                  <div class="pl-search-form pb-0">
                    <div class="pl-form-inline-wrap">
                      <div class="pl-form-inline">
                        <!-- {{ mixin_getCustcoSrvcStat('RSVT') }} -->
                        <span class="pl-label">
                          조회 기간
                        </span>
                        <div class="pl-desc">
                          <compo-date-range-picker
                              :StartDayProp.sync="startDate"
                              :EndDayProp.sync="endDate"
                              @startDayChange=""
                              @endDayChange=""
                          />
                        </div>
                      </div>
                      <!-- <div class="pl-form-inline">
                        <span class="pl-label">
                          제품 유형
                        </span>
                        <div class="pl-desc">
                          <v-select
                            v-model="dropProd"
                            class="pl-form"
                            :items="dropProdItems"
                            placeholder="선택하세요"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          진행 상태
                        </span>
                        <div class="pl-desc">
                          <v-select
                            v-model="dropProgress"
                            class="pl-form"
                            :items="dropProgressItems"
                            placeholder="선택하세요"
                          />
                        </div>
                      </div> -->
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          예약처리결과
                        </span>
                        <div class="pl-desc">
                          <v-select
                            v-model="dropProgress"
                            class="pl-form"
                            :items="mixin_common_code_get(this.list_common_code, 'RSVT_RS', '전체')"
                            placeholder="선택하세요"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          부서
                        </span>
                        <div class="pl-desc">
                          <v-text-field 
                            class="pl-form flex-grow-1"
                            v-model="SCH_OGNZ.DEPT_NM"
                            placeholder="우측의 조직도 찾기를 클릭하세요"
                            oninput="javascript: this.value = this.value.replace(/[0-9|a-z|A-Z|ㄱ-ㅎ|가-힣]/g, '' );"
                            clearable
                            clear-icon="pl-icon-text-close"
                          />
                          <compo-tooltip-btn
                              TitleProp="조직도"
                              ClassProp="pl-tooltip-btn flex-grow-0"
                              IconProp="pl-icon20 detail"
                              TooltipPositionProp="bottom"
                              @btnClick="mixin_showDialog('OrgTree')"
                          ></compo-tooltip-btn>
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          <v-select
                          v-model="SCH_KEY"
                          class="pl-form"
                          :items="mixin_common_code_get(this.list_common_code, 'CUTT_HIST_SRCH')"
                          placeholder="선택하세요"
                          />
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                          v-model="SCH_KEYWORD"
                          class="pl-form "
                          placeholder="검색어 입력"
                          @keyup.enter="getRsvtList()"
                        />
                        </div>
                      </div>
                      <v-btn
                        class="pl-btn is-icon"
                        @click="getRsvtList()"
                        >
                        <span class="pl-icon20 search"></span>
                        조회
                      </v-btn>
                    </div>
                  </div>
                </div>
                <!-- sub content -->
                <div class="pl-card">
                  <div class="pl-grid-top">
                    <div class="pl-grid-top-left">
                      <v-btn
                        class="pl-btn is-icon is-sub"
                        @click="selectDetail()"
                        >
                        <span class="pl-icon20 document"></span>
                        선택항목 상세
                      </v-btn>
                    </div>
                    <div class="pl-grid-top-utils">
                      <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
                      <!-- 엑셀 다운로드 버튼 -->
                      <compo-excel
                        TypeProp="Download"
                        :DataHeaderProp="headers"
                        :DataBodyProp="items"
                        :FileNameProp="' 상담진행현황_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                        SheetNameProp="상담진행현황"
                        HeaderColorProp="00B0F0"
                      ></compo-excel>
                    </div>
                  </div>
                  <v-data-table
                    class="pl-grid has-img has-control"
                    :headers="headers"
                    :items="items"
                    :item-class="isActiveRow"
                    fixed-header
                    item-key="index"
                    height="520px"
                    :items-per-page="ROW_PER_PAGE"
                    hide-default-footer
                    :page.sync="page"
                    @page-count="pageCount = $event"
                    no-data-text="등록된 데이터가 없습니다."
                    @click:row="rowClick"
                    @dblclick:row="selectDetail"
                    >
                    <!-- 상담직원 -->
                    <template v-slot:item.USER_NM="{ item }">
                      <img
                        v-if="item.USER_NM"
                        :src="item.USER_ICON ? item.USER_ICON : require('@/assets/img/@profile_user.png')"
                        :alt="`${ item.USER_NM  }`"
                        class="pl-grid-portrait"
                        @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}"
                      >
                      <span class="ml-3">{{ item.USER_NM }}</span>
                    </template>
                    <!-- 상태 -->
                    <template v-slot:item.RSVT_STTS_NM="{ item }">
                      <span :class="`pl-round-chip is-sm ${ mixin_displayStatus(item.RSVT_STTS_CD, `statList`) }`">
                        {{ item.RSVT_STTS_NM }}
                      </span>
                    </template>
                    <!-- 결제정보 -->
                    <template v-slot:item.STLM_YN="{ item }">
                      <div
                        :class="`is-txt-${ item.STLM_YN == 'Y' ? 'error' : 'disable' }`">
                        {{ item.STLM_YN == 'Y' ? '있음' : '없음'}}
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
                        @btnClick="getRsvtList('next')"
                      ></compo-tooltip-btn>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </v-tab-item>
          <v-tab-item>
            <div class="pl-cols" style="height: 100%">
              <div class="is-vrt">
                <div class="pl-card">
                  <div class="pl-search-form pb-0">
                    <div class="pl-form-inline-wrap">
                      <div class="pl-form-inline">
                        <!-- {{ mixin_getCustcoSrvcStat('RSVT') }} -->
                        <span class="pl-label">
                          조회 기간
                        </span>
                        <div class="pl-desc">
                          <compo-date-range-picker
                              :StartDayProp.sync="startDate"
                              :EndDayProp.sync="endDate"
                              @startDayChange=""
                              @endDayChange=""
                          />
                        </div>
                      </div>
                      <!-- <div class="pl-form-inline">
                        <span class="pl-label">
                          제품 유형
                        </span>
                        <div class="pl-desc">
                          <v-select
                            v-model="dropProd"
                            class="pl-form"
                            :items="dropProdItems"
                            placeholder="선택하세요"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          진행 상태
                        </span>
                        <div class="pl-desc">
                          <v-select
                            v-model="dropProgress"
                            class="pl-form"
                            :items="dropProgressItems"
                            placeholder="선택하세요"
                          />
                        </div>
                      </div> -->
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          예약처리결과
                        </span>
                        <div class="pl-desc">
                          <v-select
                            v-model="dropProgress"
                            class="pl-form"
                            :items="mixin_common_code_get(this.list_common_code, 'RSVT_RS', '전체')"
                            placeholder="선택하세요"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          부서
                        </span>
                        <div class="pl-desc">
                          <v-text-field 
                            class="pl-form flex-grow-1"
                            v-model="SCH_OGNZ.DEPT_NM"
                            placeholder="우측의 조직도 찾기를 클릭하세요"
                            oninput="javascript: this.value = this.value.replace(/[0-9|a-z|A-Z|ㄱ-ㅎ|가-힣]/g, '' );"
                            clearable
                            clear-icon="pl-icon-text-close"
                          />
                          <compo-tooltip-btn
                              TitleProp="조직도"
                              ClassProp="pl-tooltip-btn flex-grow-0"
                              IconProp="pl-icon20 detail"
                              TooltipPositionProp="bottom"
                              @btnClick="mixin_showDialog('OrgTree')"
                          ></compo-tooltip-btn>
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          <v-select
                          v-model="SCH_KEY"
                          class="pl-form"
                          :items="mixin_common_code_get(this.list_common_code, 'CUTT_HIST_SRCH')"
                          placeholder="선택하세요"
                          />
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                          v-model="SCH_KEYWORD"
                          class="pl-form "
                          placeholder="검색어 입력"
                          @keyup.enter="getRsvtList()"
                        />
                        </div>
                      </div>
                      <v-btn
                        class="pl-btn is-icon"
                        @click="getRsvtList()"
                        >
                        <span class="pl-icon20 search"></span>
                        조회
                      </v-btn>
                    </div>
                  </div>
                </div>
                <!-- sub content -->
                <div class="pl-card">
                  <div class="pl-grid-top">
                    <div class="pl-grid-top-left">
                      <v-btn
                        class="pl-btn is-icon is-sub"
                        @click="selectDetail()"
                        >
                        <span class="pl-icon20 document"></span>
                        선택항목 상세
                      </v-btn>
                    </div>
                    <div class="pl-grid-top-utils">
                      <span class="pl-counter">전체 <em class="pl-1">({{ incmpl_items.length }})</em> 건</span>
                      <!-- 엑셀 다운로드 버튼 -->
                      <compo-excel
                        TypeProp="Download"
                        :DataHeaderProp="headers2"
                        :DataBodyProp="incmpl_items"
                        :FileNameProp="'상담진행현황_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                        SheetNameProp="상담진행현황"
                        HeaderColorProp="00B0F0"
                      ></compo-excel>
                    </div>
                  </div>
                  <v-data-table
                    class="pl-grid has-img has-control"
                    :headers="headers2"
                    :items="incmpl_items"
                    :item-class="isActiveRow"
                    fixed-header
                    item-key="index"
                    height="520px"
                    :items-per-page="ROW_PER_PAGE"
                    hide-default-footer
                    :page.sync="page2"
                    @page-count="pageCount2 = $event"
                    no-data-text="등록된 데이터가 없습니다."
                    @click:row="rowClick"
                    @dblclick:row="selectDetail"
                    >
                    <!-- 상담직원 -->
                    <template v-slot:item.USER_NM="{ item }">
                      <img
                        v-if="item.USER_NM"
                        :src="item.USER_ICON ? item.USER_ICON : require('@/assets/img/@profile_user.png')"
                        :alt="`${ item.USER_NM  }`"
                        class="pl-grid-portrait"
                        @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}"
                      >
                      <span class="ml-3">{{ item.USER_NM }}</span>
                    </template>
                    <!-- 상태 -->
                    <template v-slot:item.RSVT_STTS_NM="{ item }">
                      <span :class="`pl-round-chip is-sm ${ mixin_displayStatus(item.RSVT_STTS_CD, `statList`) }`">
                        {{ item.RSVT_STTS_NM }}
                      </span>
                    </template>
                    <!-- 결제정보 -->
                    <template v-slot:item.STLM_YN="{ item }">
                      <div
                        :class="`is-txt-${ item.STLM_YN == 'Y' ? 'error' : 'disable' }`">
                        {{ item.STLM_YN == 'Y' ? '있음' : '없음'}}
                      </div>
                    </template>
                    <!-- 경과시간 -->
                    <template v-slot:item.RSVT_DT_PASS_TIME="{ item }">
                      {{ '약 '+item.PASS_TIME+'분 경과'}}
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
                      v-model="page2"
                      :length="pageCount2"
                      circle
                      :total-visible="7">
                    </v-pagination>

                    <span class="pl-pager-period">
                      보기 {{ mixin_getPagePeriod(incmpl_items, page) }} / {{ incmpl_items.length }}
                      <compo-tooltip-btn
                        TitleProp="다음 검색"
                        ClassProp="pl-tooltip-btn is-line"
                        IconProp="pl-icon20 arrow-next-paging"
                        TooltipPositionProp="bottom"
                        :DisabledProp = "nextDisabled"
                        @btnClick="getRsvtList('next')"
                      ></compo-tooltip-btn>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </v-tab-item>
          <v-tab-item>
            <div class="pl-cols flex-grow-1" style="height: 700px;">
              <!-- left -->
              <div class="is-col-fix is-vrt" style="width: 360px">
                <div class="pl-card">
                  <!-- DatePicker -->
                  <div class="pl-calendar type-mini is-mt-m subheading">
                    <v-date-picker
                        v-model="focus_picker"
                        no-title
                        color="#F0F4FF"
                        header-color="#F4F5FF"
                        @input="menu21 = false"
                        first-day-of-week="0"
                        locale="ko-KR"
                        :day-format="mixin_getDate"
                        scrollable
                    ></v-date-picker>
                  </div>
                </div>
                <div class="pl-card">
                  <v-list>
                    <v-list-item-group
                        v-model="selectedItem"
                        class="pl-full-calendar-viewbtn"
                    >
                      <v-list-item
                        v-if="$store.getters['userStore/GE_USER_ROLE'].userId === '1'"
                        @click="inputCalendar('all')"
                        :class="{'active' : isActive === 0}"
                      >
                        <v-icon class="pl-icon20 calendar-all-view mr-2"></v-icon>
                        전체 일정 보기
                      </v-list-item>
                      <!-- <v-list-item @click="inputCalendar('me')" class="mt-2">
                        <v-icon class="pl-icon20 calendar-my-view mr-2"></v-icon>
                        나의 일정 보기
                      </v-list-item> -->
                      <v-list-item @click="inputCalendar('team')" class="mt-2">
                        <v-icon class="pl-icon20 calendar-center-view mr-2"></v-icon>
                        팀별 일정 보기
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </div>
                <div class="pl-card">
                  <strong>{{ schedule_rsvt_items.length>0 ? mixin_convertDate(schedule_rsvt_items[0].RSVT_DT, 'yyyy년MM월dd일 HH시mm분') : '-' }}</strong>
                  <!-- DatePicker -->
                  <div class="pl-calendar type-mini is-mt-m subheading">
                    <v-data-table
                      class="pl-grid has-img"
                      :headers="headers3"
                      :items="schedule_rsvt_items"
                      :item-class="isActiveRow"
                      fixed-header
                      item-key="index"
                      height="210px"
                      :items-per-page="ROW_PER_PAGE"
                      hide-default-footer
                      :page.sync="page"
                      @page-count="pageCount = $event"
                      no-data-text="등록된 데이터가 없습니다."
                      @click:row="rowClick"
                      @dblclick:row="selectDetail"
                      >
                      <template v-slot:item.RSVT_STTS_NM="{ item }">
                        <span :class="`pl-round-chip is-sm ${ mixin_displayStatus(item.RSVT_STTS_CD, `statList`) }`">
                          {{ item.RSVT_STTS_NM }}
                        </span>
                      </template>
                    </v-data-table>
                  </div>
                </div>
              </div>
              <!-- right -->
              <div class="is-vrt">
                <!-- toolbar -->
                <div class="d-flex align-center py-2 pr-7">
                  <!-- 날짜 -->
                  <div>
                    <v-btn
                        v-model="isBtnClick"
                        fab
                        text
                        plain
                        small
                        @click="prev"
                    >
                      <v-icon small>
                        mdi-chevron-left
                      </v-icon>
                    </v-btn>
                    <strong
                        v-if="$refs.calendar"
                        class="pl-full-calendar-title">
                      {{ computedCalendarTitle }}
                    </strong>
                    <v-btn
                        fab
                        text
                        small
                        plain
                        @click="next"
                    >
                      <v-icon small>
                        mdi-chevron-right
                      </v-icon>
                    </v-btn>
                    <v-btn
                        class="pl-btn is-sub"
                        @click="setToday"
                    >
                      오늘
                    </v-btn>
                  </div>
                  <div>
                    <compo-tooltip-btn
                      TitleProp="새로고침"
                      ClassProp="pl-tooltip-btn"
                      IconProp="pl-icon20 refresh"
                      TooltipPositionProp="bottom"
                      @btnClick="getAllSchdl()"
                    ></compo-tooltip-btn>
                  </div>
                  <!-- 일,주,월간 선택 -->
                  <!-- <div class="ml-auto">
                    <v-btn-toggle
                        v-model="datePeriod"
                        mandatory
                        class="pl-btn-group">
                      <v-btn
                          class="pl-btn"
                          @click="type='day'"
                      >일간
                      </v-btn>
                      <v-btn
                          class="pl-btn"
                          @click="type='week'">주간
                      </v-btn>
                      <v-btn
                          class="pl-btn"
                          @click="type='month'">월간
                      </v-btn>
                    </v-btn-toggle>
                  </div> -->
                </div>
                <div class="pl-card pl-full-calendar">
                  <!-- full calendar -->
                  <v-calendar
                    ref="calendar"
                    v-model="focus_cal"
                    color="primary"
                    :events="events"
                    locale="ko-KR"
                    :event-more="false"
                    event-overlap-mode="column"
                    :day-format="getDay"
                    :type=type
                    interval-height="100"
                    interval-width="200"
                    @click:event="showEvent"
                    @change="mixin_getDatePeriod"
                  ></v-calendar>
                    <!-- @click:more="viewDay"
                    @click:date="viewDay" -->
                </div>
              </div>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </div>
    <!-- 모달 : 예약내역(sw전용!!!!!) -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer" v-if=" detailModal === true ">
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
                  <span class="col-3 pa-0">예약 일시</span>
                  <strong class="is-txt-blue">{{ selectedRow.NEW_RSVT_DT }}</strong>
                  <span class="pl-round-chip is-sm chat-stat-wait ml-1">
                    {{ selectedRow.DRWI_SE_NM }}
                  </span>
                </div>
                <div class="d-flex px-4">
                  <span class="col-3 pa-0">고객명</span>
                  <strong>{{ selectedRow.CUST_NM }}</strong>
                </div>
                <div class="d-flex px-4">
                  <span class="col-3 pa-0">결제정보</span>
                  <strong>{{ selectedRow.STLM_YN == 'Y' ? '있음' : '없음' }}</strong>
                </div>
                <div class="d-flex px-4">
                  <span class="col-3 pa-0">
                    <v-btn 
                      class="pl-btn is-sub is-sm ml-auto"
                      @click="[rsvtDetailModal = true,getRsvtAllDtl()]"
                      >
                      예약정보 펼치기
                    </v-btn>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!-- 상담 배정 정보 -->
          <div class="is-mt-l">
            <h2 class="pl-subtit">상담 배정 정보</h2>
            <ul class="pl-line-list is-border type-left is-mt-m">
              <li class="">
                <span class="keyTitle">배정 일시</span>
                <strong>{{ selectedRow.NEW_ALTMNT_DT }}</strong>
              </li>
              <li>
                <span class="keyTitle">상담사</span>
                <div>
                  <img
                    v-if="selectedRow.USER_NM"
                    :src="selectedRow.USER_ICON ? selectedRow.USER_ICON : require('@/assets/img/@profile_user.png')""
                    :alt="`${ selectedRow.USER_NM  }`"
                    style="width: 35px; height: 35px; border-radius: 50px; vertical-align: middle;"
                    @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}"
                  >
                  <strong class="ml-3">{{ selectedRow.USER_NM }}</strong>
                </div>
                <v-btn 
                  class="pl-btn is-sub is-sm ml-auto"
                  :disabled="selectedRow.USER_NM && !selectedRow.RSVT_STTS ? false : true"
                  @click="clkChgCusl()"
                  >
                  상담사 변경
                </v-btn>
              </li>
              <li>
                <span class="keyTitle">상담 결과</span>
                <span :class="`pl-round-chip is-sm ${ mixin_displayStatus(selectedRow.RSVT_STTS_CD, `statList`) }`">
                  {{ selectedRow.RSVT_STTS_NM }}
                </span>
              </li>
              <li>
                <span class="keyTitle">통화 시작시간</span>
                <strong>{{ selectedRow.NEW_CUTT_BGNG_DT }}</strong>
              </li>
              <li>
                <span class="keyTitle">통화 종료시간</span>
                <strong>{{ selectedRow.NEW_CUTT_END_DT }}</strong>
              </li>
              <li>
                <span class="keyTitle">통화시간</span>
                <strong>{{ selectedRow.PHN_HR }}</strong>
              </li>
            </ul>
          </div>
          <!-- 녹취 내용 -->
          <div class="is-mt-l">
            <h2 class="pl-subtit">녹취 내용</h2>
            <div class="is-mt-m">
              <compo-audio
                :audioProp="REC_TEMP_DATA"
                AudioType="playOnlyNoTtl"
              />
            </div>
          </div>
          <!-- 상담 내용 -->
          <div class="is-mt-l">
            <h2 class="pl-subtit">상담 내용</h2>
            <v-textarea
              class="pl-form is-noresize is-mt-m"
              :spellcheck="false"
              disabled
            />
          </div>
        </div>
      </div>
    </v-slide-x-reverse-transition>

    <!-- 예약 상세정보 모달 -->
    <v-slide-x-reverse-transition>
      <SwbookingDetail v-if="rsvtDetailModal"
        @close="rsvtDetailModal = false"
        :BookInfo="selectedRow"
        :BookingDtlProps="BOOKING_DTL"
        :AnalysisListProps="ANALYSIS_LIST"
        :InterviewListProps="INTERVIEW_LIST"
        :RecommandListProps="RECOMMAND_LIST"
        :HealthWorryListProps="HEALTH_WORRY_LIST"
        :RsvtChangeListProps="RSVT_CHANGE_LIST"
        :CuttCnListProps="CUTT_CN_LIST"
        :RsvtAltmntChangeLogProps="RSVT_ALTMNT_CHANGE_LOG"
      ></SwbookingDetail>
    </v-slide-x-reverse-transition>

    <!-- //상담직원 찾기 모달 -->
    <v-dialog
      v-model="dialogFindRsvtCusl"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="예약상담원 찾기"
        @hide="mixin_hideDialog('FindRsvtCusl')"
      >
        <template slot="body">
          <!-- component -->
          <compo-find-rsvt-cusl
            SearchTitleProp="사용자 찾기"
            :SearchDataProp="DropUser"
            :SearchInputProp.sync="searchUsername"
            :DataHeaderProp="HeadersFindCus"
            :DataBodyProp="ItemsFindCus"
            :FindData="SRCH_USER"
            :RsvtDtProps="selectedRow.RSVT_DT"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('FindRsvtCusl')">닫기</v-btn>
          <v-btn class="pl-btn" @click="setCuslAltmnt('FindRsvtCusl')">변경</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- 조직선택 모달 -->
    <v-dialog
        v-model="dialogOrgTree"
        content-class="dialog-draggable"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="조직 선택"
          @hide="mixin_hideDialog('OrgTree')"
      >
        <template slot="body">
          <compo-tree
              ref="ognzDataCompo"
              :DataProp.sync="treeItems"
              :ExpandedProp=true
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('OrgTree')">닫기</v-btn>
          <v-btn class="pl-btn" @click="setOgnzData">선택</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import SwbookingDetail from './right_swbooking_detail.vue';

export default {
   name:"MENU_CSL_M0308", //name은 'MENU_' + 파일명 조합

components: {
  SwbookingDetail,
},
data() {
  return {
    //공통코드 설정
    list_common_code : [],
    common_code : [],

    dialogFindRsvtCusl: false, //사용자 검색 모달
    HeadersFindCus: [],
    ItemsFindCus:[],
    SRCH_USER:[], //상담사 정보

    DropUser: {},
    searchUsername: '',   //사용자 이름 검색
    
    SCH_KEY : 'CUST_NM', // 검색 구분
    SCH_KEYWORD : '', //검색어

    // top search
    startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    endDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    dropProd: '',
    dropProdItems: [
      '전체',
      '에어컨',
      '냉난방기',
      '전문가전',
      '시스템에어컨',
      '보일러',
      '냉동공조시스템',
    ],
    dropName: '',
    dropNameItems: [
      '고객 이름',
      'AS기사 이름',
      '상담직원 이름',
    ],
    dropProgress: '',
    dropProgressItems: [
      '전체',
      '배정',
      '완료',
      '취소',
    ],

    // grid
    page: 1,
    page2: 1,
    pageCount: 0,
    pageCount2: 0,
    perPage: [15,30,50,100],
    ROW_PER_PAGE: 15,
    pagination: {
      page: 1,
      rowsPerPage: 500,
      sortBy: "REG_DT",
      descending: "DESC"
    }, //그리드 페이지속성정의
    pagination2: {
      page: 1,
      rowsPerPage: 500,
      sortBy: "REG_DT",
      descending: "DESC"
    }, //그리드 페이지속성정의
    nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
    headers: [
      { text: '번호', value: 'index', align: 'center', width: '60px', sortable : false },
      { text: '예약일시', value: 'NEW_RSVT_DT', align: 'left', width: '150px', sortable : true },
      { text: '고객명', value: 'CUST_NM', align: 'left', width: '100px', sortable : false },
      { text: '고객 전화번호', value: 'CUST_PHN_NO', align: 'left', width: '120px', sortable : false },
      { text: '분석 형태', value: 'DRWI_SE_NM', align: 'left', width: '100px', sortable : false },
      { text: '결제정보', value: 'STLM_YN', align: 'left', width: '100px', sortable : false },
      { text: '배정자', value: 'ALTMNT_NM', align: 'left', width: '100px', sortable : false },
      { text: '배정일시', value: 'NEW_ALTMNT_DT', align: 'left', width: '150px', sortable : false },
      { text: '상담사', value: 'USER_NM', align: 'left', width: '140px', sortable : false },
      { text: '지점', value: 'BRNCH_NM', align: 'left', width: '140px', sortable : false },
      // { text: '처리결과', value: 'RSVT_RS', align: 'left', width: '100px', sortable : false },
      { text: '예약상태', value: 'RSVT_STTS_NM', align: 'left', width: '100px', sortable : false },
      { text: '통화 시작시간', value: 'NEW_CUTT_BGNG_DT', align: 'left', width: '150px', sortable : false },
      { text: '통화 종료시간', value: 'NEW_CUTT_END_DT', align: 'left', width: '150px', sortable : false },
      { text: '통화 시간', value: 'PHN_HR', align: 'left', width: '90px', sortable : false },
    ],
    headers2: [
      { text: '번호', value: 'index', align: 'center', width: '60px', sortable : false },
      { text: '예약일시', value: 'NEW_RSVT_DT', align: 'left', width: '150px', sortable : true },
      { text: '경과시간', value: 'RSVT_DT_PASS_TIME', align: 'left', width: '150px', sortable : true },
      { text: '고객명', value: 'CUST_NM', align: 'left', width: '100px', sortable : false },
      { text: '고객 전화번호', value: 'CUST_PHN_NO', align: 'left', width: '120px', sortable : false },
      { text: '분석 형태', value: 'DRWI_SE_NM', align: 'left', width: '100px', sortable : false },
      { text: '결제정보', value: 'STLM_YN', align: 'left', width: '100px', sortable : false },
      { text: '배정자', value: 'ALTMNT_NM', align: 'left', width: '100px', sortable : false },
      { text: '배정일시', value: 'NEW_ALTMNT_DT', align: 'left', width: '150px', sortable : false },
      { text: '상담사', value: 'USER_NM', align: 'left', width: '140px', sortable : false },
      { text: '지점', value: 'BRNCH_NM', align: 'left', width: '140px', sortable : false },
      { text: '예약상태', value: 'RSVT_STTS_NM', align: 'left', width: '100px', sortable : false },
    ],
    headers3: [
      { text: '상담사', value: 'USER_NM', align: 'left', sortable : false },
      { text: '예약상태', value: 'RSVT_STTS_NM', align: 'left', width: '100px', sortable : false },
    ],
    items: [
      {
        index: 1,
        type01: '2024-05-21 10:20',
        type02: '김창렬',
        type03: '010-5303-4545',
        type04: '건강고민',
        type05: '시스템',
        type06: '나준영',
        type07: '2024-05-21 11:25',
        type08: '박승주',
        type08_img: require('@/assets/img/@profile_user.png'),
        type09: '협력사',
        type010: '메디콕',
        type011: '상담대기',
        type012: true,
        type013: '2024-05-21',
        type014: '2024-05-21',
        type015: '00:00:00',
      },

    ],
    incmpl_items: [],
    schedule_rsvt_items:[],
    selectedRow:{},
    statList: [
      { name: '예약', code:'RSVT', value: 'chat-stat-cs' },
      { name: '상담대기', code:'WAIT', value: 'chat-stat-cs' },
      { name: '상담완료', code:'CMPL', value: 'chat-stat-done' },
      { name: '예약취소', code:'CANCEL', value: 'chat-stat-wait' },
      { name: '예약파기', code:'DESTRUCT', value: 'chat-stat-after' },
      { name: '상담거부', code:'REJECT', value: 'chat-stat-error' },
    ],

    // detail Modal
    detailModal: false,
    rsvtDetailModal:false,
    //녹취 파일
    REC_TEMP_DATA: {
      "CUST_ID":"1132",
      "REC_FILE_NM":"20240119/1002-20240119-161248-IB-01047123585-1705648368.2626",
    },

    BOOKING_ID : "",
    ANALYSIS_ID : "",

    BOOKING_DTL:{},
    ANALYSIS_LIST:[],
    INTERVIEW_LIST:[],
    RECOMMAND_LIST:[],
    HEALTH_WORRY_LIST:[],
    RSVT_CHANGE_LIST:[],
    CUTT_CN_LIST: [],
    RSVT_ALTMNT_CHANGE_LOG:[],

    tab: null,
    
    date:'',
    focus_picker: '',
    focus_cal: '',
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    type:'month',
    selectedItem: 1,
    datePeriod: 1,
    isActive: 0,

    isBtnClick: false,

    dialogOrgTree:false,
    treeItems: [],
    SCH_OGNZ: {},
  }
},

  watch: {
    focus_picker() {
      let beforeMonth = this.focus_cal.replaceAll('-','').substr(0,6);
      let afterMonth = this.focus_picker.replaceAll('-','').substr(0,6);
      if(beforeMonth && afterMonth && beforeMonth != afterMonth){
        this.getAllSchdl(afterMonth+'00000000');
      }
      this.focus_cal = this.focus_picker;
    },
    // calendar 포커스 변경 시 date picker
    focus_cal() {
      let beforeMonth = this.focus_picker.replaceAll('-','').substr(0,6);
      let afterMonth = this.focus_cal.replaceAll('-','').substr(0,6);
      if(beforeMonth && afterMonth && beforeMonth != afterMonth){
        this.getAllSchdl(afterMonth+'00000000');
      }
      this.focus_picker = this.focus_cal;
    },

    tab(){
      if(this.tab == '2'){
        this.getServerDate();
        setTimeout(() => {
          this.getAllSchdl(this.date.replaceAll('-','').substr(0,6)+'00000000');
        }, 300);
      }
      
    },
    
  },

  computed: {
    computedCalendarTitle() {
      const title = this.$refs.calendar.title;
      let new_year = '';
      let new_month = '';
      let current = this.date.substr(8, 2);
      let select = this.focus_picker.substr(8, 2);

      let arrTitle = [];
      arrTitle = title.split(' ');

      if (arrTitle.length > 3) {
        if (arrTitle.length > 4) {
          if (current < 7 || select < 7) {
            new_year = arrTitle[4];
            new_month = arrTitle[3];
          } else {
            new_year = arrTitle[1];
            new_month = arrTitle[0];
          }
        } else {
          if (current < 7 || select < 7) {
            new_year = arrTitle[3];
            new_month = arrTitle[2];
          } else {
            new_year = arrTitle[3];
            new_month = arrTitle[0];
          }
        }
      } else {
        new_year = arrTitle[1];
        new_month = arrTitle[0];
      }
      return `${new_year}년 ${new_month}`;
    },
  },

  beforeDestroy(){
  },

  async created() {
    //공통코드설정
    let codeName = ['RSVT_RS','CUTT_HIST_SRCH'];
    this.list_common_code = await this.mixin_common_code_get_all(codeName);

    this.getRsvtList();

    // this.getServerDate();
    // //월간 예약상태 가져오기
    // this.getAllSchdl();
  },

  mounted() {

  },

  methods: {
    rowClick(data){
      this.selectedRow = data
      this.REC_TEMP_DATA = {
        CUST_ID:data.CUST_ID,
        REC_FILE_NM: data.REC_FILE_NM
      }
    },

    selectDetail(data){
      this.detailModal = true;
    },

    async getRsvtList(next){
      this.selectedRow = {};
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

      let sUrl = '/api/rsvt/getRsvtList';
      let postParam = {
        RSVT_STTS: this.dropProgress
        , SCH_ST_DT : this.startDate.replace(/-/gi, '')
        , SCH_END_DT : this.endDate.replace(/-/gi, '')
        , SCH_KEY : this.SCH_KEY
        , SCH_KEYWORD : convertSchKeyword
        , SCH_OGNZ : this.SCH_OGNZ.DEPT_NM == '' || this.SCH_OGNZ.DEPT_NM == null ? '' : this.SCH_OGNZ.DEPT_ID
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
        console.log("response.DATA",response.DATA);
        //데이터 가공 영역
        response.DATA.forEach((data, idx) => {
          data.NEW_CUTT_BGNG_DT = this.mixin_convertDate(data.CUTT_BGNG_DT, 'yyyy-MM-dd HH:mm:ss');
          data.NEW_CUTT_END_DT = this.mixin_convertDate(data.CUTT_END_DT, 'yyyy-MM-dd HH:mm:ss');
          data.PHN_HR = (data.PHN_HR?this.mixin_seconds_toHHMMSS(data.PHN_HR):'');
          data.CUST_PHN_NO = this.mixin_setPhoneNo(data.CUST_PHN_NO.replace(/[^0-9]/g, ""));
          data.NEW_RSVT_DT = this.mixin_convertDate(data.RSVT_DT, 'yyyy-MM-dd HH:mm:ss');
          data.NEW_ALTMNT_DT = this.mixin_convertDate(data.ALTMNT_DT, 'yyyy-MM-dd HH:mm:ss');
        });

        let tempDataText = response.DATA;
        let incmplDataText = [];
        let idx = this.items.length + 1;
        for(let i in tempDataText){
          tempDataText[i]["index"]= idx++;
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
        this.pagination2.page += 1;
      }
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item.RSVT_ID === this.selectedRow.RSVT_ID ? "active" : "";
      return activeClass;
    },

    //배정상담사 변경
    async setCuslAltmnt(){
      this.mixin_hideDialog('FindRsvtCusl')
      let sUrl = '/api/rsvt/setCuslAltmnt';
      let postParam = {
        API_URL: 'updateAltmnt',
        RSVT_ID: this.selectedRow.RSVT_ID,
        CUSL_ID: this.SRCH_USER.USER_ID,
        BOOKING_ID: this.selectedRow.SW_RSVT_ID
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        let selected = this.selectedRow;
        this.getRsvtList();
        this.selectedRow = selected;
        this.selectedRow.USER_ID = this.SRCH_USER.USER_ID;
        this.selectedRow.USER_NM = this.SRCH_USER.USER_NM;
      }
    },

    getRsvtAllDtl(){
      this.getRsvtDtl("selectBook");
      this.getRsvtDtl("selectAnalysisDtl");
      this.getRsvtCnList()
      this.getRsvtDtl("selectInterview");
      this.getRsvtDtl("selectRecommand");
      this.getRsvtDtl("selectHealthWorry");
      this.getRsvtDtl("selectRsvtChangeList");
      this.getRsvtAltmntChgLog()
      // this.getRsvtDtl("selectCuttCn");
    },

    async getRsvtDtl(api){
      let sUrl = '/api/rsvt/getRsvtDtl';
      let postParam = {
        API_URL : api
        , BOOKING_ID : this.selectedRow.SW_RSVT_ID
        , ANALYSIS_ID : this.selectedRow.SW_ANLS_ID
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        switch (api){
          case "selectBook" :
            this.BOOKING_DTL = response.DATA[0];
            break;
          case "selectAnalysisDtl" :
            this.ANALYSIS_LIST = response.DATA;
            break;
          case "selectInterview" :
            this.INTERVIEW_LIST = response.DATA;
            break;
          case "selectRecommand" :
            this.RECOMMAND_LIST = response.DATA;
            break;
          case "selectHealthWorry" :
            this.HEALTH_WORRY_LIST = response.DATA;
            break;
          case "selectRsvtChangeList" :
            this.RSVT_CHANGE_LIST = response.DATA;
            break;
          // case "selectCuttCn" :
          //   this.CUTT_CN_LIST = response.DATA;
          //   break;
        }
      }
    },

    async getRsvtCnList(){
      let sUrl = '/api/rsvt/getRsvtCnList';
      let postParam = {
        RSVT_ID : this.selectedRow.RSVT_ID
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        for(let i=0;i<response.DATA.length;i++){
          response.DATA[i]["expand"] = false;
        }
        this.CUTT_CN_LIST = response.DATA;
      }
    },

    //예약배정변경이력 조회
    async getRsvtAltmntChgLog(){
      let sUrl = '/api/rsvt/getRsvtAltmntChgLog';
      let postParam = {
        RSVT_ID : this.selectedRow.RSVT_ID
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.RSVT_ALTMNT_CHANGE_LOG = response.DATA;
      }
    },

    //상담사 변경 버튼 누를때
    //변경 가능상담사 불러오기
    clkChgCusl(){
      this.mixin_showDialog('FindRsvtCusl');

      this.$eventBus.$emit('getRsvtCuslList');
    },

    // 캘린더 일자 표시
    getDay(date) {
      const day = date["day"]
      const day_num = Number(day);
      return day_num;
    },

    // 서버 시간 가져오기
    async getServerDate() {
      await this.mixin_getSvrDate("YYYYMMDDHH24MISS").then((data) => {
        let cvDate = this.mixin_convertDate(data, 'yyyy-MM-dd HH:mm:ss')
        this.date = cvDate;
      })
    },

    showEvent({nativeEvent, event}) {
      console.log("event", event);
      console.log("event", event.rsvt);
      // if (!this.dialogShowSchdl) {
      //   this.selectedEvent = event;
      //   console.log("this.selectedEvent", this.selectedEvent)
      // }
      // this.rowClick(event);
      // this.detailModal = true;
      this.schedule_rsvt_items = event.rsvt;
    },
    viewDay({date}) {
      this.focus_cal = date;
      this.type = 'day';
      this.datePeriod = 0;
    },
    setToday() {
      this.focus_cal = this.date.substr(0, 10);
    },
    // 다음 달
    prev(e) {
      this.$refs.calendar.prev();
    },
    // 이전 달
    next() {
      this.$refs.calendar.next();
    },

    //월간 일정 조회
    async getAllSchdl(month) {
      if(!month){
        if(this.focus_picker){
          month = this.focus_picker.replaceAll('-','').substr(0,6)+'00000000';
        }else if(this.focus_cal){
          month = this.focus_cal.replaceAll('-','').substr(0,6)+'00000000';
        } else {
          month = this.date.replaceAll('-','').substr(0,6)+'00000000';
        }
      }
      this.schdlData = [];
      let sURL = "/api/rsvt/monthSchedule";
      let postParam = {
        RSVT_DT : month
      };
      let headParam = {
        head: {
        }
      };
      let response = await this.common_postCall(sURL, postParam, headParam);
      if (response.HEADER.ERROR_FLAG) {
        this.showAlert(this.MESSAGE.ALERT.ERR_GET_SCHDL);
      } else {
        this.schdlData = response.DATA;
        switch (this.selectedItem){
          case 0:
            this.inputCalendar('all');
            break;
          default:
            this.inputCalendar('team');
            break;
        }
      }
    },

    inputCalendar(value) {
      const events = [];
      const eventCount = this.schdlData.length;
      let rsvtArrObj = {};
      let rsvtArr = [];
      let rsvtCnt = 0;
      let start = '';
      let end = '';
      let event = {};
      if (eventCount > 0) {
        for (let i = 0; i < eventCount; i++) {
          if(i != eventCount-1){
            //마지막이 아닐때
            rsvtArrObj = this.schdlData[i];
            rsvtArrObj["NEW_RSVT_DT"] = this.mixin_convertDate(this.schdlData[i].RSVT_DT, 'yyyy-MM-dd HH:mm:ss');
            rsvtArrObj["NEW_ALTMNT_DT"] = this.mixin_convertDate(this.schdlData[i].ALTMNT_DT, 'yyyy-MM-dd HH:mm:ss');
            rsvtArr.push(rsvtArrObj);
            rsvtCnt = rsvtCnt + 1;
            if(this.schdlData[i].RSVT_DT == this.schdlData[i+1].RSVT_DT){
              //같은 시간일때
            } else {
              //같은시간이 아닐때
              start = this.ChnDateForm(this.schdlData[i].RSVT_ST);
              end = this.ChnDateForm(this.schdlData[i].RSVT_END);
              event = {
                schdl_id: this.schdlData[i].RSVT_ID,
                esntl_yn: false,
                schdl_se_cd: 'CTSD',
                name: rsvtCnt+'건',
                start: start,
                end: end,
                color: '#4786E3',
                rsvt : rsvtArr
              }

              switch (value) {
                case 'all':
                  events.push(event);
                  break;
                case 'me':
                  if (this.schdlData[i].CUSL_ID === this.$store.getters["userStore/GE_USER_ROLE"].userId) {
                    events.push(event);
                  }
                  break;
                case 'team':
                  if (this.schdlData[i].DEPT_ID != null && this.schdlData[i].DEPT_ID != '' && this.schdlData[i].USER_DEPT_ID.indexOf(this.schdlData[i].DEPT_ID) != -1) {
                    events.push(event);
                  }
                  break;
                default:
                  break;
              }

              rsvtCnt = 0;
              rsvtArr = [];
            }
          } else {
            //마지막일 때
            rsvtArrObj = this.schdlData[i];
            rsvtArrObj["NEW_RSVT_DT"] = this.mixin_convertDate(this.schdlData[i].RSVT_DT, 'yyyy-MM-dd HH:mm:ss');
            rsvtArrObj["NEW_ALTMNT_DT"] = this.mixin_convertDate(this.schdlData[i].ALTMNT_DT, 'yyyy-MM-dd HH:mm:ss');
            rsvtArr.push(rsvtArrObj);
            rsvtCnt = rsvtCnt + 1;
            start = this.ChnDateForm(this.schdlData[i].RSVT_ST);
            end = this.ChnDateForm(this.schdlData[i].RSVT_END);
            event = {
              schdl_id: i,
              esntl_yn: false,
              schdl_se_cd: 'CTSD',
              name: rsvtCnt,
              start: start,
              end: end,
              color: '#4786E3',
              rsvt : rsvtArr
            }

            switch (value) {
              case 'all':
                events.push(event);
                break;
              case 'me':
                if (this.schdlData[i].CUSL_ID === this.$store.getters["userStore/GE_USER_ROLE"].userId) {
                  events.push(event);
                }
                break;
              case 'team':
                if (this.schdlData[i].DEPT_ID != null && this.schdlData[i].DEPT_ID != '' && this.schdlData[i].USER_DEPT_ID.indexOf(this.schdlData[i].DEPT_ID) != -1) {
                  events.push(event);
                }
                break;
              default:
                break;
            }
          }
        }
        this.events = events;
      }
    },

    // 날짜변환 : String(YYYYMMDDHHmmss) to String(YYYY-MM-DD HH:mm:ss)
    ChnDateForm(dateString) {
      let year = dateString.slice(0, 4);
      let month = dateString.slice(4, 6);
      let day = dateString.slice(6, 8);
      let hour = dateString.slice(8, 10);
      let minute = dateString.slice(10, 12);
      let second = dateString.slice(12, 14);

      // Format the date as "YYYY-MM-DD HH:mm:ss" string
      let formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

      return formattedDate;
    },

    //조직
    setOgnzData() {
      this.SCH_OGNZ = this.$refs.ognzDataCompo.setOgnzData();
      this.mixin_hideDialog('OrgTree')
      this.$refs.ognzDataCompo.clearOgnzData();
    },

  },
}
</script>

<style lang="scss" scoped>
</style>