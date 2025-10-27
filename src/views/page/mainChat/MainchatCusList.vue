<template>
  <div>
    <!-- 상단 정보 -->
    <div class="pl-card-top">
      <div class="pl-mainchat-cs-list-top">
        <div class="d-flex flex-grow-1">
          <div class="pl-mainchat-cs-list-top-date">
            {{ DataProp.top_date }}
          </div>
          <div class="ml-auto">
            <v-select
              class="pl-form"
              :items="DataProp.dropItems"
              v-model="USER_CHT_STAT"
              placeholder="선택하세요"
              @change="userChtStatChg()"
            ></v-select>
          </div>
        </div>
        <!-- 상담원 -->
        <div class="pl-mainchat-cs-list-top-manager">
          <img
            :src="DataProp.portrait ? DataProp.portrait : require('@/assets/img/@profile_user.png')"
            :alt="DataProp.manager_name"
            style="width: 54px; height: 54px;"
            @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}"
            >
          <div>
            <strong>{{ DataProp.manager_name }} ({{ DataProp.manager_lgnId }})</strong>
            <div class="mt-2">
              <span>전체({{ DataProp.monitor_total }})</span>
              <span class="ml-1">나({{ DataProp.monitor_me }})</span>
              <span class="ml-1">없음({{ DataProp.monitor_other }})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 상단 모니터링 버튼 -->
    <div class="pl-card-top" style="border-bottom: 0 !important;">
      <!-- 채널 목록 모니터링 -->
      <div
        v-if="tab === 0"
        class="pl-mainchat-cs-list-status"
        :class="`filter-${filterType}`">
        <div class="status-all">
          <strong>전체</strong>
          <span @click="[showFilterList('all'), NOW_FILTER_CNT = getStatusCount('arr_ch', 'all'), NOW_CLBK_FILTER_CNT = getStatusCount('arr_callbak', 'all')]">{{ getStatusCount('arr_ch', 'all') }}</span>
        </div>
        <div class="status-wait">
          <strong>대기</strong>
          <span @click="[showFilterList('wait'), NOW_FILTER_CNT = getStatusCount('arr_ch', 'wait'), NOW_CLBK_FILTER_CNT = getStatusCount('arr_callbak', 'wait')]">{{ getStatusCount('arr_ch', 'wait') }}</span>
        </div>
        <div class="status-cs">
          <strong>상담중</strong>
          <span @click="[showFilterList('cs'), NOW_FILTER_CNT = getStatusCount('arr_ch', 'cs'), NOW_CLBK_FILTER_CNT = getStatusCount('arr_callbak', 'cs')]">{{ getStatusCount('arr_ch', 'cs') }}</span>
        </div>
        <div class="status-done">
          <strong>완료</strong>
          <span @click="[showFilterList('done'), NOW_FILTER_CNT = getStatusCount('arr_ch', 'done'), NOW_CLBK_FILTER_CNT = getStatusCount('arr_callbak', 'done')]">{{ getStatusCount('arr_ch', 'done') }}</span>
        </div>
        <div class="status-after">
          <strong>후처리</strong>
          <span @click="[showFilterList('after'), NOW_FILTER_CNT = getStatusCount('arr_ch', 'after'), NOW_CLBK_FILTER_CNT = getStatusCount('arr_callbak', 'after')]">{{ getStatusCount('arr_ch', 'after') }}</span>
        </div>
        <div class="status-bookmark">
          <strong>책갈피</strong>
          <span @click="[showFilterList('bookmark'), NOW_FILTER_CNT = getStatusCount('arr_ch', 'bookmark'), NOW_CLBK_FILTER_CNT = getStatusCount('arr_callbak', 'bookmark')]">{{ getStatusCount('arr_ch', 'bookmark') }}</span>
        </div>
      </div>
      <!-- 채팅콜백 모니터링 -->
      <div
        v-else
        class="pl-mainchat-cs-list-status"
        :class="`filter-${filterType}`">
        <div class="status-all">
          <strong>전체</strong>
          <span @click="[showFilterList('all'), NOW_FILTER_CNT = getStatusCount('arr_ch', 'all'), NOW_CLBK_FILTER_CNT = getStatusCount('arr_callbak', 'all')]">{{ getStatusCount('arr_callbak', 'all') }}</span>
        </div>
        <div class="status-wait">
          <strong>대기</strong>
          <span @click="[showFilterList('wait'), NOW_FILTER_CNT = getStatusCount('arr_ch', 'wait'), NOW_CLBK_FILTER_CNT = getStatusCount('arr_callbak', 'wait')]">{{ getStatusCount('arr_callbak', 'wait') }}</span>
        </div>
        <div class="status-cs">
          <strong>상담중</strong>
          <span @click="[showFilterList('cs'), NOW_FILTER_CNT = getStatusCount('arr_ch', 'cs'), NOW_CLBK_FILTER_CNT = getStatusCount('arr_callbak', 'cs')]">{{ getStatusCount('arr_callbak', 'cs') }}</span>
        </div>
        <div class="status-done">
          <strong>완료</strong>
          <span @click="[showFilterList('done'), NOW_FILTER_CNT = getStatusCount('arr_ch', 'done'), NOW_CLBK_FILTER_CNT = getStatusCount('arr_callbak', 'done')]">{{ getStatusCount('arr_callbak', 'done') }}</span>
        </div>
        <div class="status-after">
          <strong>후처리</strong>
          <span @click="[showFilterList('after'), NOW_FILTER_CNT = getStatusCount('arr_ch', 'after'), NOW_CLBK_FILTER_CNT = getStatusCount('arr_callbak', 'after')]">{{ getStatusCount('arr_callbak', 'after') }}</span>
        </div>
        <div class="status-bookmark">
          <strong>책갈피</strong>
          <span @click="[showFilterList('bookmark'), NOW_FILTER_CNT = getStatusCount('arr_ch', 'bookmark'), NOW_CLBK_FILTER_CNT = getStatusCount('arr_callbak', 'bookmark')]">{{ getStatusCount('arr_callbak', 'bookmark') }}</span>
        </div>
      </div>
    </div>
    <!-- 채널 리스트 -->
    <div >
      <v-tabs class="pl-tabs" v-model="tab">
        <v-tab>채널목록</v-tab>
        <v-tab>채팅콜백</v-tab>
        <!-- 채널 목록 -->
        <v-tab-item>
          <div class="pl-card">
            <!-- 검색 -->
            <div class="d-flex">
              <span class="pl-counter ml-0">{{ NOW_FILTER }} <em class="pl-1">({{ NOW_FILTER_CNT }})</em> 건</span>
              <div class="pl-btn-wrap ml-auto">
                <!-- 일괄저장 체크버튼 -->
                <!-- <compo-tooltip-btn
                  TitleProp="일괄저장"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 is-drag-icon-check"
                  TooltipPositionProp="bottom"
                  @btnClick="clickBat()"
                  :DisabledProp="DataProp.arr_ch.length==0 ? true : false"
                ></compo-tooltip-btn> -->
                <!-- 상세 검색 버튼 -->
                <div>
                  <compo-tooltip-btn
                    TitleProp="상세 검색"
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 filter"
                    TooltipPositionProp="bottom"
                    @btnClick="dropFilter = !dropFilter"
                  ></compo-tooltip-btn>
                  <!-- 상세 검색 모달 -->
                  <v-slide-y-transition>
                    <div class="pl-drop-layer" v-if="dropFilter === true" >
                      <div class="pl-drop-layer-body">
                        <div class="pl-form-inline-wrap vertical type-auto">
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              조회 일자
                            </span>
                            <div class="pl-desc">
<!--                              <div class="pl-calendar-range-form">-->
<!--                                <compo-date-picker-->
<!--                                  DateType="dateInput"-->
<!--                                  :DateProp.sync="SRCH_ST_DATE"/>-->
<!--                                <span class="pl-unit">~</span>-->
<!--                                <compo-date-picker-->
<!--                                  DateType="dateInput"-->
<!--                                  :DateProp.sync="SRCH_END_DATE"/>-->
<!--                                <compo-drop-picker-->
<!--                                  :StartDateProp.sync="SRCH_ST_DATE"-->
<!--                                  :EndDateProp.sync="SRCH_END_DATE"-->
<!--                                />-->
<!--                              </div>-->
                              <compo-date-range-picker
                                  :StartDayProp.sync="SRCH_ST_DATE"
                                  :EndDayProp.sync="SRCH_END_DATE"
                                  @startDayChange="mixin_testLog(SRCH_ST_DATE)"
                                  @endDayChange="mixin_testLog(SRCH_END_DATE)"
                              />
                            </div>
                          </div>
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              조회 채널
                            </span>
                            <div class="pl-desc">
                              <v-select
                                class="pl-form"
                                :items="mixin_common_code_get(common_code, 'CHNL_CL', '전체')"
                                placeholder="선택하세요"
                                v-model="SRCH_CHN_CLSF_CD"
                              ></v-select>
                            </div>
                          </div>
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              조회 문구
                            </span>
                            <div class="pl-desc">
                              <v-text-field
                                class="pl-form is-search flex-grow-1"
                                placeholder="채팅내역검색"
                                v-model="SRCH_WORD"
                                @keydown.enter="chtListSrch('DTL')"
                              >
                              </v-text-field>
                            </div>
                          </div>
                        </div>
                        <div class="pl-drop-layer-footer justify-end">
                          <v-btn class="pl-btn is-sub" @click="dropFilter=false">닫기</v-btn>
                          <v-btn class="pl-btn" @click="[chtListSrch('DTL'), dropFilter=false]">조회</v-btn>
                        </div>
                      </div>
                    </div>
                  </v-slide-y-transition>
                </div>
                <!-- 새로고침 버튼 -->
                <compo-tooltip-btn
                  TitleProp="새로고침"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="bottom"
                  @btnClick="chtListSrch()"
                ></compo-tooltip-btn>
                <!-- 상세 버튼 -->
                <!-- <compo-tooltip-btn
                  TitleProp="상세"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 detail"
                  TooltipPositionProp="bottom"
                  @btnClick="$emit('detail')"
                ></compo-tooltip-btn> -->
              </div>
            </div>
            <div class="d-flex mt-3">
              <v-text-field
                class="pl-form is-search flex-grow-1"
                placeholder="채팅내역검색"
                v-model="SRCH_WORD"
                @keydown.enter="chtListSrch('KEYWORD')"
              >
              <template v-slot:append>
                <compo-tooltip-btn
                  TitleProp="키워드 검색"
                  ClassProp="pl-top-util"
                  IconProp="pl-icon-util search"
                  TooltipPositionProp="bottom"
                  @btnClick="chtListSrch('KEYWORD')"
                ></compo-tooltip-btn>
              </template>
            </v-text-field>
            </div>
            <!-- list -->
            <div class="pl-mainchat-cs-list-unit-wrap" :class="`filter-${filterType}`">
              <template v-if="NOW_FILTER_CNT == '0' && this.SRH_LOADING == false">
                <div class="pl-list-nodata">
                  <span>등록된 데이터가 없습니다.</span>
                </div>
              </template>
              <template v-else-if="this.SRH_LOADING == true">
                <div class="pl-list-loading">
                  <span class="pl-list-loader" style="width: 100px; height: 100px;"></span>
                </div>
              </template>
              <template v-else v-for="item,index in DataProp.arr_ch">
                <div
                  v-if="filterType == 'all' ? true : ( filterType == 'bookmark' ? item.BMK_YN == 'Y' :  item.STTS_CD === filterType)"
                  :key="index"
                  class="pl-mainchat-cs-list-unit"
                  :class="isActiveRow(item)"
                  @click="clickChatList(item)"
                  >
                  <!-- <v-checkbox 
                    v-if="CHK_BAT && item.STTS_CD == 'after'" 
                    class="pl-check mr-2" 
                    v-model="item.checked"
                    :key="index"
                    @change="checkBat(item)"
                  ></v-checkbox> -->
                  <v-badge left color="red" overlap dot :value=item.NEW_CHAT>
                    <v-icon :class="`pl-icon30 mainchat-${ item.CHNL_CL }`"></v-icon>
                  </v-badge>
                  <div class="ml-2" style="overflow:hidden; flex: 1 1 0;" @click="selectChatList(item.CHT_CUTT_ID)">
                    <strong>{{ (mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(item.CUST_NM) : item.CUST_NM) }} ({{ item.CHNL_NM }})</strong>
                    <div class="is-ellips">
                      <span
                        v-for="msg,i in highlightMark(item.RECENT_MSG)"
                        >
                        <span 
                          v-if="msg.indexOf('<mark>') != -1"
                          v-html="msg"
                        ></span>
                        <span 
                          v-else
                        >{{ msg }}</span>
                      </span>
                      <!-- {{ item.RECENT_MSG }} -->
                    </div>
                    <div class="is-ellips">
                      <ul class="pl-list-dot is-no-border mt-0">
                        <li v-if="item.QSTN_TYPE" class="pl-5 is-txt-sub">{{ item.QSTN_TYPE }}</li>
                        <li v-if="item.CUTT_TYPE" class="pl-5 is-txt-sub">{{ item.CUTT_TYPE.substr(item.CUTT_TYPE.indexOf('>')+1) }}</li>
                        <li v-if="item.CUTT_CN" class="pl-5 is-txt-sub">{{ item.CUTT_CN.length > 28 ? item.CUTT_CN.substr(0,28)+'...' : item.CUTT_CN }}</li>
                      </ul>
                      <!-- <span v-if="item.QSTN_TYPE">문의 유형 : {{ item.QSTN_TYPE }}</span>
                      <br v-if="item.QSTN_TYPE">
                      <span v-if="item.CUTT_TYPE">상담 유형 : {{ item.CUTT_TYPE.substr(item.CUTT_TYPE.indexOf('>')+1) }}</span>
                      <br v-if="item.CUTT_TYPE">
                      <span v-if="item.CUTT_CN">상담 내용 : {{ item.CUTT_CN }}</span>
                      <br v-if="item.CUTT_CN"> -->
                      <span
                        :class="`pl-round-chip is-sm chat-stat-${item.STTS_CD}`">{{
                        displayStatus(item.STTS_CD)
                        }}</span>
                      <span class="ml-1">{{ displayTalkType(item.CHNL_CL) }}</span>
                      <span v-if="item.RECENT_TIME" class="mx-1 is-txt-bull">&bull;</span>
                      <!-- <span v-if="item.RECENT_TIME">{{ item.RECENT_TIME }}</span> -->
                      <span v-if="item.RECENT_TIME">{{ item.currentTime }}</span>
                    </div>
                  </div>
                </div>
              </template>
              <div class="pl-mainchat-cs-list-unit-wrap-bottom"></div>
            </div>

          </div>
        </v-tab-item>
        <!-- 채팅콜백 -->
        <v-tab-item>
          <div class="pl-card">
            <!-- 검색 -->
            <div class="d-flex">
              <span class="pl-counter ml-0">{{ NOW_CLBK_FILTER }} <em class="pl-1">({{ NOW_CLBK_FILTER_CNT }})</em> 건</span>
              <div class="pl-btn-wrap ml-auto">
                <!-- 일괄저장 체크버튼 -->
                <!-- <compo-tooltip-btn
                  TitleProp="일괄저장"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 is-drag-icon-check"
                  TooltipPositionProp="bottom"
                  @btnClick="clickBat()"
                  :DisabledProp="DataProp.arr_callbak.length==0 ? true : false"
                ></compo-tooltip-btn> -->
                <!-- 상세 검색 버튼 -->
                <div>
                  <compo-tooltip-btn
                    TitleProp="상세 검색"
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 filter"
                    TooltipPositionProp="bottom"
                    @btnClick="dropFilter = !dropFilter"
                  ></compo-tooltip-btn>
                  <!-- 상세 검색 모달 -->
                  <v-slide-y-transition>
                    <div class="pl-drop-layer" v-if="dropFilter === true" >
                      <div class="pl-drop-layer-body">
                        <div class="pl-form-inline-wrap vertical type-auto">
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              조회 일자
                            </span>
                            <div class="pl-desc">
<!--                              <div class="pl-calendar-range-form">-->
<!--                                <compo-date-picker-->
<!--                                  DateType="dateInput"-->
<!--                                  :DateProp.sync="SRCH_ST_DATE"/>-->
<!--                                <span class="pl-unit">~</span>-->
<!--                                <compo-date-picker-->
<!--                                  DateType="dateInput"-->
<!--                                  :DateProp.sync="SRCH_END_DATE"/>-->
<!--                                <compo-drop-picker-->
<!--                                  :StartDateProp.sync="SRCH_ST_DATE"-->
<!--                                  :EndDateProp.sync="SRCH_END_DATE"-->
<!--                                />-->
<!--                              </div>-->
                              <compo-date-range-picker
                                  :StartDayProp.sync="SRCH_ST_DATE"
                                  :EndDayProp.sync="SRCH_END_DATE"
                                  @startDayChange="mixin_testLog(SRCH_ST_DATE)"
                                  @endDayChange="mixin_testLog(SRCH_END_DATE)"
                              />
                            </div>
                          </div>
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              조회 채널
                            </span>
                            <div class="pl-desc">
                              <v-select
                                class="pl-form"
                                :items="mixin_common_code_get(common_code, 'CHNL_CL', '전체')"
                                placeholder="선택하세요"
                                v-model="SRCH_CHN_CLSF_CD"
                              ></v-select>
                            </div>
                          </div>
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              조회 문구
                            </span>
                            <div class="pl-desc">
                              <v-text-field
                                class="pl-form is-search flex-grow-1"
                                placeholder="채팅내역검색"
                                v-model="SRCH_WORD"
                                @keydown.enter="chtListSrch('DTL')"
                              >
                              </v-text-field>
                            </div>
                          </div>
                        </div>
                        <div class="pl-drop-layer-footer justify-end">
                          <v-btn class="pl-btn" @click="[chtListSrch('DTL'), dropFilter=false]">조회</v-btn>
                        </div>
                      </div>
                    </div>
                  </v-slide-y-transition>
                </div>
                <!-- 새로고침 버튼 -->
                <compo-tooltip-btn
                  TitleProp="새로고침"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="bottom"
                  @btnClick="chtListSrch()"
                ></compo-tooltip-btn>
                <!-- 상세 버튼 -->
                <!-- <compo-tooltip-btn
                  TitleProp="상세"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 detail"
                  TooltipPositionProp="bottom"
                  @btnClick="$emit('detail')"
                ></compo-tooltip-btn> -->
              </div>
            </div>
            <div class="d-flex mt-3">
              <v-text-field
                class="pl-form is-search flex-grow-1"
                placeholder="채팅내역검색"
                v-model="SRCH_WORD"
                @keydown.enter="chtListSrch('KEYWORD')"
              >
              <template v-slot:append>
                <compo-tooltip-btn
                  TitleProp="키워드 검색"
                  ClassProp="pl-top-util"
                  IconProp="pl-icon-util search"
                  TooltipPositionProp="bottom"
                  @btnClick="chtListSrch('KEYWORD')"
                ></compo-tooltip-btn>
              </template>
            </v-text-field>
            </div>
            <!-- list -->
            <div class="pl-mainchat-cs-list-unit-wrap" :class="`filter-${filterType}`">
              <template v-if="NOW_CLBK_FILTER_CNT == '0'">
                <div class="pl-list-nodata">
                  <span>등록된 데이터가 없습니다.</span>
                </div>
              </template>
              <template v-for="item,index in DataProp.arr_callbak">
                <div
                  v-if="filterType == 'all' ? true : ( filterType == 'bookmark' ? item.BMK_YN == 'Y' :  item.STTS_CD === filterType)"
                  :key="index"
                  class="pl-mainchat-cs-list-unit"
                  :class="isActiveRow(item)"
                  @click="clickChatList(item)"
                  >
                  <!-- <v-checkbox 
                    v-if="CHK_BAT && item.STTS_CD == 'after'" 
                    class="pl-check mr-2" 
                    v-model="item.checked"
                    :key="index"
                    @change="checkBat(item)"
                  ></v-checkbox> -->
                  <v-badge left color="red" overlap dot :value=item.NEW_CHAT>
                    <v-icon :class="`pl-icon30 mainchat-${ item.CHNL_CL }`"></v-icon>
                  </v-badge>
                  <div class="ml-2" style="overflow: hidden; flex: 1 1 0;" @click="selectChatList(item.CHT_CUTT_ID)">
                    <strong>{{ (mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(item.CUST_NM) : item.CUST_NM) }} ({{ item.CHNL_NM }})</strong>
                    <div class="is-ellips">
                      <span
                        v-for="msg,i in highlightMark(item.RECENT_MSG)"
                        >
                        <span 
                          v-if="msg.indexOf('<mark>') != -1"
                          v-html="msg"
                        ></span>
                        <span 
                          v-else
                        >{{ msg }}</span>
                      </span>
                      <!-- {{ item.RECENT_MSG }} -->
                    </div>
                    <div class="is-txt-sub">
                      <span v-if="item.QSTN_TYPE">문의 유형 : {{ item.QSTN_TYPE }}</span>
                      <br v-if="item.QSTN_TYPE">
                      <span v-if="item.CUTT_TYPE">상담 유형 : {{ item.CUTT_TYPE.substr(item.CUTT_TYPE.indexOf('>')+1) }}</span>
                      <br v-if="item.CUTT_TYPE">
                      <span>상담 내용 : {{ item.CUTT_CN }}</span>
                      <br v-if="item.CUTT_CN">
                      <span>콜백요청시간 : {{ item.CLBK_YMD }}</span>
                      <br v-if="item.CLBK_YMD">
                      <span
                        :class="`pl-round-chip is-sm chat-stat-${item.STTS_CD}`">{{
                        displayStatus(item.STTS_CD)
                        }}</span>
                      <span class="ml-1">{{ displayTalkType(item.CHNL_CL) }}</span>
                      <span v-if="item.RECENT_TIME" class="mx-1 is-txt-bull">&bull;</span>
                      <!-- <span v-if="item.RECENT_TIME">{{ item.RECENT_TIME }}</span> -->
                      <span v-if="item.RECENT_TIME">{{ item.currentTime }}</span>
                    </div>
                  </div>
                </div>
              </template>
              <div class="pl-mainchat-cs-list-unit-wrap-bottom"></div>
            </div>

          </div>
        </v-tab-item>
      </v-tabs>

    </div>

  </div>
</template>

<script>
  import { eventBus } from "@/store/eventBus.js";

  export default {
    name: 'Mainchat_cus_list',
    props: {
      DataProp: {
        type: Object,
      },
      demoVideoMode: {
        type: Boolean,
        default : false,
      }
    },
    data() {
      return {
        //공통코드
        common_code:[],

        USER_CHT_STAT:'CHT_CANT',     //사용자 상담 상태

        filterType: 'all',
        tab: null,
        dropFilter: false,
        SRCH_ST_DATE: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),    //조회 일자 시작시간
        SRCH_END_DATE: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),   //조회 일자 종료시간
        SRCH_CHN_CLSF_CD:'',         //조회 채널
        SRCH_WORD: '', //검색어

        SEL_CHT_CUTT_ID:'',

        NOW_FILTER:'전체',
        NOW_FILTER_CNT: '0',

        NOW_CLBK_FILTER:'전체',
        NOW_CLBK_FILTER_CNT: '0',

        CHK_BAT:false, //일괄저장 활성화 버튼

        SRH_LOADING:false,
      }
    },

    watch: {
      filterType(){
        switch (this.filterType){
          case 'all':
            this.NOW_FILTER = '전체';
            this.NOW_CLBK_FILTER = '전체';
            break;

          case 'wait':
            this.NOW_FILTER = '대기';
            this.NOW_CLBK_FILTER = '대기';
            break;

          case 'cs':
            this.NOW_FILTER = '상담중';
            this.NOW_CLBK_FILTER = '상담중';
            break;

          case 'done':
            this.NOW_FILTER = '완료';
            this.NOW_CLBK_FILTER = '완료';
            break;

          case 'after':
            this.NOW_FILTER = '후처리';
            this.NOW_CLBK_FILTER = '후처리';
            break;

          case 'bookmark':
            this.NOW_FILTER = '책갈피';
            this.NOW_CLBK_FILTER = '책갈피';
            break;

          default:
            break;
        }
      }
    },

    computed: {

    },

    //공통코드 사용시 async-await 필수 (mixin_common_code_get_all함수로 공통코드 리스트를 가지고 오기 전에 mixin_common_code_get이벤트 발생)
    async created() {
      //공통코드설정
      let codeName = ['CHAT_ST', 'CHNL_CL'];
      this.common_code = await this.mixin_common_code_get_all(codeName);
      this.DataProp.dropItems = this.mixin_common_code_get(this.common_code, 'CHAT_ST');

      this.DataProp.top_date = await this.mixin_convertDate(await this.mixin_getSvrDate("YYYYMMDDHH24MISS"), 'yyyy-MM-dd (E)')

      this.DataProp["arr_ch"] = []
      this.DataProp["arr_callbak"] = [];

      this.showFilterList('all');
      this.chtListSrch();
      this.chtCnt();

      /**
       * eventBus 이벤트
       * Stomp Disconnect
       */


      /**
       *
       * 상담사 채팅 리스트 조회
      */
      this.$eventBus.$on("chtListSrch", (message,newchat) => {
        this.chtListSrch(message,newchat);
      });
      
      //금칙어 사용 여부
      this.FBDWD_YN = await this.mixin_getChtStng('PROHIBITE_APPLY_YN');
    },

    mounted() {
    },

    methods: {
      getStatusCount(arr, status){
        if(status == 'all'){
          return this.DataProp[`${arr}`].length;
        } else if(status == 'bookmark') {
          return this.DataProp[`${arr}`].filter(item => item.BMK_YN === 'Y').length;
        } else {
          return this.DataProp[`${arr}`].filter(item => item.STTS_CD === status).length;
        }
      },
      showFilterList(status){
        this.filterType = status;
      },
      displayTalkType(type) {
        const typeList = [
          { type_list_text: '카카오톡', type_list_type: 'kakao' },
          { type_list_text: '티톡', type_list_type: 'teletalk' },
          { type_list_text: '네이버 톡톡', type_list_type: 'ntalk' },
        ];

        for (let i = 0; i < typeList.length; i++) {
          if (typeList[i].type_list_type === type) {
            return typeList[i].type_list_text;
          }
        }
      },
      displayStatus(type) {
        const typeList = [
          { type_list_text: '대기중', type_list_type: 'wait' },
          { type_list_text: '상담중', type_list_type: 'cs' },
          { type_list_text: '완료', type_list_type: 'done' },
          { type_list_text: '후처리', type_list_type: 'after' },
          { type_list_text: '책갈피', type_list_type: 'bookmark' },
        ];

        for (let i = 0; i < typeList.length; i++) {
          if (typeList[i].type_list_type === type) {
            return typeList[i].type_list_text;
          }
        }
      },
      selectChatList(CHT_CUTT_ID){
      },

      //고객사 채팅 카운트
      async chtCnt(){
        let sUrl = '/chat-api/main/cnslt/count';
        let postParam = {
        }
        let headParam = {
          head: {
          }
        }

        let resData = await this.common_postCall(sUrl, postParam, headParam)
        if(!resData.HEADER.ERROR_FLAG){
          this.DataProp.monitor_total = resData.DATA[0]["ALL_CNT"];
          this.DataProp.monitor_me = resData.DATA[0]["USER_CNT"];
          this.DataProp.monitor_other = resData.DATA[0]["OTHER_CNT"];
        }
      },

      //상담내역 조회
      async chtListSrch(detail,newchat){
        if(!newchat){
          newchat = [];
        }
        if(detail == 'KEYWORD' && this.SRCH_WORD != ''){
          eventBus.srchChatKeyWord(true, this.SRCH_WORD);
        } else if(detail == 'DTL' && this.SRCH_WORD != ''){
          eventBus.srchChatKeyWord(true, this.SRCH_WORD);
        }else {
          eventBus.srchChatKeyWord(false, '');
        }

        let sUrl = (detail == 'KEYWORD' || detail == 'DTL') && this.SRCH_WORD != '' ? 'chat-api/main/cutt/detail' : 'chat-api/main/cnslt/inqire';
        let postParam = {
          CHN_CLSF_CD : detail == 'DTL' ? this.SRCH_CHN_CLSF_CD : '',
          ST_DATE : detail == 'DTL' ? this.SRCH_ST_DATE.replaceAll('-', '')+'000000' : '',
          END_DATE : detail == 'DTL' ? this.SRCH_END_DATE.replaceAll('-', '')+'235959' : '',
          WORD : (detail == 'KEYWORD' || detail == 'DTL') && this.SRCH_WORD != '' ? this.SRCH_WORD : '',
        }
        let headParam = {
          head: {
          }
        }

        if(detail == 'DTL'){
          this.SRH_LOADING = true;
        }
        let resData = await this.chat_postCall(sUrl, postParam, headParam)
        if(!resData.header.ERROR_FLAG){
          this.DataProp["arr_ch"]=[];
          this.DataProp["arr_callbak"]=[];
          let leng = resData.data.length
          for(let i=0;i<leng;i++){
            //상태값 정리
            let contents = this.FBDWD_YN == 'Y'
              ? resData.data[i]["CHG_RCPTN_DSPTCH_MSG"]
              : resData.data[i]["RCPTN_DSPTCH_MSG"]

            let stts = resData.data[i]["CUTT_STTS_CD"]
            switch(stts){
              case 'ING' :
                stts = 'cs';
                break;
              case 'WAIT' :
              case 'TRAN_WAIT' :
              case 'CLBK_WAIT' :
                stts = 'wait';
                break;
              case 'AFTPRCS' :
                stts = 'after';
                break;
              default :
                stts = 'done';
            }

            let icon = resData.data[i]["CHN_CLSF_CD"]
            let beanId = this.mixin_isEmpty(resData.data[i]["BEAN_ID"]) ? null : resData.data[i]["BEAN_ID"];

            switch(icon){
              case 'KAKAO' :
                icon = 'kakao';
                break;
              case 'TTALK' :
                icon = 'teletalk';
                break;
              case 'NTT' :
                icon = 'ntalk';
                break;
              case 'EMAIL' :
                icon = 'email';
                break;
              case 'BBS' : // 이커머스 아이콘 가공
                icon = resData.data[i]["BEAN_ID"];
                break;
              default :
                icon = 'kakao';
            }
            let chat = {
              CHNL_CL: icon, //채팅 채널에 따른 아이콘
              CHN_CLSF_CD: resData.data[i]["CHN_CLSF_CD"],
              CHN_CLSF_CD_NM: resData.data[i]["CHN_CLSF_CD_NM"],
              CHT_USER_KEY: resData.data[i]["CHT_USER_KEY"],           //채팅 고객 키
              CUST_ID: resData.data[i]["CUST_ID"],                //고객ID
              CUST_NM: resData.data[i]["CUST_NM"],                //고객명
              CHNL_NM: resData.data[i]["DSPTCH_PRF_NM"],          //채널명
              RECENT_MSG:
                (detail == 'KEYWORD' || detail == 'DTL') && this.SRCH_WORD != ''
                ? contents.replaceAll(this.SRCH_WORD,'<mark>'+this.SRCH_WORD+'</mark>')
                : contents,    //최근 메시지
              STTS_CD: stts,                                      //상담 상태 표시
              CUTT_STTS_CD: resData.data[i]["CUTT_STTS_CD"],       //상담 상태 코드
              CUTT_STTS_CD_NM: resData.data[i]["CUTT_STTS_CD_NM"], //상담 상태 이름
              BMK_YN: resData.data[i]["BMK_YN"],                  //책갈피 여부
              RECENT_TIME: resData.data[i]["REG_DT"],             //최근 채팅 시간
              CHT_CUTT_ID: resData.data[i]["CHT_CUTT_ID"],        //채팅ID
              CHT_RDY_ID: resData.data[i]["CHT_RDY_ID"],          //채팅대기ID
              CUTT_BGNG_DT: this.mixin_convertDate(resData.data[i]["CUTT_BGNG_DT"], 'yyyy-MM-dd HH:mm:ss'),      //채팅 시작일시
              SYS_MSG_SKIP_YN: resData.data[i]["SYS_MSG_SKIP_YN"],  //시스템메시지 전송여부
              SNDR_KEY: resData.data[i]["SNDR_KEY"],              //발신프로필 키
              DSPTCH_PRF_KEY: resData.data[i]["DSPTCH_PRF_KEY"],              //발신프로필 키
              CLBK_YMD: this.mixin_convertDate(resData.data[i]["CLBK_YMD"], 'yyyy-MM-dd HH:mm:ss'),             //콜백요청시간
              CUTT_TYPE_ID: resData.data[i]["CUTT_TYPE_ID"],      //상담유형코드
              CUTT_TYPE: resData.data[i]["CUTT_TYPE"],            //상담유형명(트리)
              CUTT_TYPE_CD: resData.data[i]["CUTT_TYPE_CD"],      //상담유형ID(트리)(ID이지만 이름 중복으로 CD로 대체)
              CUTT_CN: resData.data[i]["CUTT_CN"],                //상담내용
              QSTN_TYPE: resData.data[i]["QSTN_TYPE"],            //문의유형명(트리)
              currentTime: null,
              CHT_CUTT_DTL_ID: resData.data[i]["CHT_CUTT_DTL_ID"],            //문의유형명(트리)
              NEW_CHAT: false,
              CHBT_YN: resData.data[i]["CHBT_YN"],                //챗봇 여부
              BEAN_ID : resData.data[i]["BEAN_ID"]                // 연동 BEAN_ID
            }
            for(let n=0;n<newchat.length;n++){
              if(newchat[n] == resData.data[i]["CHT_CUTT_DTL_ID"]){
                chat.NEW_CHAT = true;
                break;
              }
            }
            //콜백건이 아닐때
            if(resData.data[i]["CLBK_YN"] != 'Y'){
              this.DataProp["arr_ch"].push(chat)
            } else {
              this.DataProp["arr_callbak"].push(chat)
            }
          }

          //구독 리스트에 있어야 메시지 받았을 때 해당 채팅방 정상 조회 가능
          this.$store
            .dispatch("messages/AC_INIT_TALK_LIST", resData.data)
            .then(() => {
            });

          this.recentTime();

          //초기 로딩 시 건수 계산
          // if(this.NOW_FILTER == '전체' && this.NOW_FILTER_CNT == '0'){
          //   this.NOW_FILTER_CNT = this.DataProp.arr_ch.length;
          // }
          // if(this.NOW_CLBK_FILTER == '전체' && this.NOW_CLBK_FILTER_CNT == '0'){
          //   this.NOW_CLBK_FILTER_CNT = this.DataProp.arr_callbak.length;
          // }

          //상세검색, 고객정보 변경 후 건수 계산
          switch (this.filterType){
            case 'all':
              this.NOW_FILTER_CNT = this.getStatusCount('arr_ch', 'all');
              this.NOW_CLBK_FILTER_CNT = this.getStatusCount('arr_callbak', 'all');
              break;

            case 'wait':
              this.NOW_FILTER_CNT = this.getStatusCount('arr_ch', 'wait');
              this.NOW_CLBK_FILTER_CNT = this.getStatusCount('arr_callbak', 'wait');
              break;

            case 'cs':
              this.NOW_FILTER_CNT = this.getStatusCount('arr_ch', 'cs');
              this.NOW_CLBK_FILTER_CNT = this.getStatusCount('arr_callbak', 'cs');
              break;

            case 'done':
              this.NOW_FILTER_CNT = this.getStatusCount('arr_ch', 'done');
              this.NOW_CLBK_FILTER_CNT = this.getStatusCount('arr_callbak', 'done');
              break;

            case 'after':
              this.NOW_FILTER_CNT = this.getStatusCount('arr_ch', 'after');
              this.NOW_CLBK_FILTER_CNT = this.getStatusCount('arr_callbak', 'after');
              break;

            case 'bookmark':
              this.NOW_FILTER_CNT = this.getStatusCount('arr_ch', 'bookmark');
              this.NOW_CLBK_FILTER_CNT = this.getStatusCount('arr_callbak', 'bookmark');
              break;

            default:
              break;
          }
          this.SRH_LOADING = false;
        }
      },

      //최근 채팅 시간 계산 (mixin사용시 속도문제)
      async recentTime(){
        let now = this.mixin_convertDate(await this.mixin_getSvrDate("YYYYMMDDHH24MISS"), 'yyyy-MM-dd HH:mm:ss');
        let nowDate = new Date(now);

        let beforeDate = ''
        let lengCh = this.DataProp["arr_ch"].length
        for(let i=0;i<lengCh;i++){
          beforeDate = new Date(this.mixin_convertDate(this.DataProp["arr_ch"][i]["RECENT_TIME"], 'yyyy-MM-dd HH:mm:ss'));
          let milliSeconds = nowDate - beforeDate

          let seconds = milliSeconds / 1000
          let minutes = seconds / 60
          let hours = minutes / 60
          let days = hours / 24
          let weeks = days / 7
          let months = days / 30
          let years = days / 365

          if (seconds < 60) {
            this.DataProp["arr_ch"][i]["currentTime"] = '방금 전'
          } else if (minutes < 60) {
            this.DataProp["arr_ch"][i]["currentTime"] = `${Math.floor(minutes)}분 전`
          } else if (hours < 24) {
            this.DataProp["arr_ch"][i]["currentTime"] = `${Math.floor(hours)}시간 전`
          } else if (days < 7) {
            this.DataProp["arr_ch"][i]["currentTime"] = `${Math.floor(days)}일 전`
          } else if (weeks < 5) {
            this.DataProp["arr_ch"][i]["currentTime"] = `${Math.floor(weeks)}주 전`
          } else if (months < 12) {
            this.DataProp["arr_ch"][i]["currentTime"] = `${Math.floor(months)}개월 전`
          } else if (years >= 1) {
            this.DataProp["arr_ch"][i]["currentTime"] = `${Math.floor(years)}년 전`
          }
        }
        let lengCb = this.DataProp["arr_callbak"].length
        for(let n=0;n<lengCb;n++){
          beforeDate = new Date(this.mixin_convertDate(this.DataProp["arr_callbak"][n]["RECENT_TIME"], 'yyyy-MM-dd HH:mm:ss'));
          let milliSeconds = nowDate - beforeDate

          let seconds = milliSeconds / 1000
          let minutes = seconds / 60
          let hours = minutes / 60
          let days = hours / 24
          let weeks = days / 7
          let months = days / 30
          let years = days / 365

          if (seconds < 60) {
            this.DataProp["arr_callbak"][n]["currentTime"] = '방금 전'
          } else if (minutes < 60) {
            this.DataProp["arr_callbak"][n]["currentTime"] = `${Math.floor(minutes)}분 전`
          } else if (hours < 24) {
            this.DataProp["arr_callbak"][n]["currentTime"] = `${Math.floor(hours)}시간 전`
          } else if (days < 7) {
            this.DataProp["arr_callbak"][n]["currentTime"] = `${Math.floor(days)}일 전`
          } else if (weeks < 5) {
            this.DataProp["arr_callbak"][n]["currentTime"] = `${Math.floor(weeks)}주 전`
          } else if (months < 12) {
            this.DataProp["arr_callbak"][n]["currentTime"] = `${Math.floor(months)}개월 전`
          } else if (years >= 1) {
            this.DataProp["arr_callbak"][n]["currentTime"] = `${Math.floor(years)}년 전`
          }
        }
      },

      //채팅리스트에서 채팅클릭시
      clickChatList(item){
        if(this.demoVideoMode){
          if(this.SEL_CHT_CUTT_ID !== item.CHT_CUTT_ID){
            this.showAlert({alertDialogToggle: true, msg: '영상통화 진행중에는 다른 상담을 진행하실 수 없습니다.', iconClass: 'is-info', type: 'default'});
            return;
          }
        }
        if(item.NEW_CHAT){
          item.NEW_CHAT = false;
        }
        this.DataProp.CLK_DATA=item;
        this.SEL_CHT_CUTT_ID = item.CHT_CUTT_ID;
        this.$emit("clickChatList", this.DataProp);
      },

      //사용자 채팅 상태 변경
      async userChtStatChg(){
        this.DataProp.USER_CHT_STAT=this.USER_CHT_STAT;
        this.$emit("changeUserChtStat", this.DataProp);
      },


      //로우 클릭시 색상 변경
      isActiveRow(item) {
        const activeClass = item.CHT_CUTT_ID == this.SEL_CHT_CUTT_ID ? "active" : "";
        return activeClass;
      },

      clickBat(){
        this.CHK_BAT = !this.CHK_BAT;
        if(this.CHK_BAT){
        } else {
          let lengCh = this.DataProp.arr_ch.length
          for(let i=0;i<lengCh;i++){
            if(this.DataProp.arr_ch[i].checked){
              this.DataProp.arr_ch[i].checked = false;
            }
          }
          let lengCb = this.DataProp.arr_callbak.length
          for(let n=0;n<lengCb;n++){
            if(this.DataProp.arr_callbak[n].checked){
              this.DataProp.arr_callbak[n].checked = false;
            }
          }
        }
        eventBus.clickBat(this.CHK_BAT);
      },

      checkBat(item){
        eventBus.checkBat(item);
      },

      highlightMark(data){
        let arr = [];
        let regex = new RegExp('<mark>', 'g');
        let matches = data.match(regex);
        let markNum = matches ? matches.length+1 : 0;
        if(markNum == 0){
          arr[0] = data;
        } else {
          for(let i=0;i<markNum;i++){
            arr[i*2] = data.substring(0, data.indexOf('<mark>'));
            data = data.substring(data.indexOf('<mark>'));
            if(i == markNum-1){
              arr[i*2+1] = data;
            } else {
              arr[i*2+1] = data.substring(0, data.indexOf('</mark>')+7);
              data = data.substring(data.indexOf('</mark>')+7);
            }
          }
        }
        return arr;
      },
    },
  }
</script>

<style lang="scss" scoped>
</style>