<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  />
      <!-- sub content -->
      <!-- tabs -->
      <v-tabs class="pl-tabs" v-model="tab" >
        <v-tab>알림톡 발송이력</v-tab>
        <v-tab @click="initSendAtalk">알림톡 대량 발송</v-tab>
      </v-tabs>
      <div style="height: calc(100vh - 246px)">
        <v-tabs-items v-model="tab" class="pl-tabs-items">
          <!-- 알림톡 발송이력 -->
          <v-tab-item>
            <div class="pl-cols" style="height: 100%;">
              <div class="is-vrt">
                <!-- top search -->
                <div class="pl-card">
                  <div class="pl-search-form pb-0">
                    <div class="pl-form-inline-wrap">
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          조회 기간
                        </span>
                        <div class="pl-desc">
                          <compo-date-range-picker
                            :StartDayProp.sync="START_DATE"
                            :EndDayProp.sync="END_DATE"
                            @startDayChange="changeStartDate"
                            @endDayChange="changeEndDate"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          발송자 ID
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            class="pl-form "
                            placeholder="검색어 입력"
                            v-model="SENDER.LGN_ID"
                            @keyup.enter="selectAtalkSendHistory"
                          ></v-text-field>
                        </div>
                        <!-- 찾기 버튼 -->
                        <compo-tooltip-btn
                          TitleProp="사용자 검색"
                          ClassProp="pl-tooltip-btn flex-grow-0"
                          IconProp="pl-icon20 in-search"
                          TooltipPositionProp="top"
                          @btnClick="userSearch"
                        ></compo-tooltip-btn>
                        <span class="pl-label">
                          수신번호
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            class="pl-form "
                            placeholder="검색어 입력"
                            v-model="RECEIVE_NO"
                            @keyup.enter="selectAtalkSendHistory"
                          ></v-text-field>
                        </div>
                        <!-- <span class="pl-label">
                          <v-select
                            class="pl-form "
                            :items="dropItems"
                            placeholder="선택하세요"
                          ></v-select>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            class="pl-form "
                            placeholder="검색어 입력"
                          ></v-text-field>
                        </div> -->
                      </div>
                      <!-- <div class="pl-form-inline">
                        <span class="pl-label">
                          <v-select
                            class="pl-form "
                            :items="dropItems2"
                            placeholder="선택하세요"
                          ></v-select>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            class="pl-form "
                            placeholder="검색어 입력"
                          ></v-text-field>
                        </div>
                      </div> -->
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          발송 내용
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            class="pl-form is-lg"
                            placeholder="검색어 입력"
                            v-model="SNDNG_CN"
                            @keyup.enter="selectAtalkSendHistory"
                          ></v-text-field>
                        </div>
                      </div>
                      <v-btn class="pl-btn is-icon" @click="selectAtalkSendHistory">
                        <span class="pl-icon20 search"></span>
                        조회
                      </v-btn>
                    </div>
                  </div>
                </div>
                <!-- grid -->
                <div class="pl-card">
                  <div class="pl-grid-top">
                    <div class="pl-grid-top-left">
<!--                      <v-btn class="pl-btn is-icon is-sub" @click="openSendHistoryDetail" :disabled="SELECT_GRID_ROW_ITEM.ROWNUM != undefined ? false : true">-->
<!--                        <span class="pl-icon20 document"></span>-->
<!--                        선택항목 상세-->
<!--                      </v-btn>-->
                    </div>
                    <div class="pl-grid-top-utils">
                      <span class="pl-counter">전체 <em class="pl-1">({{ SEND_HISTORY_GRID_DATA.length }})</em> 건</span>
                      <!-- 엑셀 다운로드 버튼 -->
                      <compo-excel
                        TypeProp="Download"
                        :DownReason=true
                        :DataHeaderProp="SEND_HISTORY_GRID_HEADER"
                        :DataBodyProp="SEND_HISTORY_GRID_DATA"
                        :FileNameProp="'알림톡발송이력_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                        HeaderColorProp="00B0F0"
                      ></compo-excel>
                    </div>
                  </div>
                  <v-data-table
                    class="pl-grid"
                    :headers="SEND_HISTORY_GRID_HEADER"
                    :items="SEND_HISTORY_GRID_DATA"
                    fixed-header
                    item-key="MTS_SNDNG_HSTRY_ID"
                    height="510px"
                    :items-per-page="ROW_PER_PAGE"
                    :item-class="isActiveRow"
                    hide-default-footer
                    :page.sync="page"
                    no-data-text="등록된 데이터가 없습니다."
                    @page-count="pageCount = $event"
                    @click:row="gridRowselected"
                    >
                    <template v-slot:item.RECEIVE_NO="{ item }">
                      {{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(item.RECEIVE_NO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(item.RECEIVE_NO.replace(/[^0-9]/g, "")) }}
                    </template>
                    <template v-slot:item.RSLT_CD_NM="{ item }" >
                      <span
                        v-if="parseInt(item.SNDNG_DT_STR) > parseInt(date)"
                        :class="`pl-round-chip is-sm chat-stat-${'wait'}`"
                      >
                        발송예약
                      </span>
                      <span
                        v-else-if="item.RSLT_CD_NM !== '-'"
                        :class="`pl-round-chip is-sm chat-stat-${item.RSLT_CD_NM == '발송완료' ? 'done' : 'after'}`">
                        {{ item.RSLT_CD_NM }}
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

                    <!-- 더보기 다음 있을때만 노출 -->
                    <span class="pl-pager-period"> 보기 {{ mixin_getPagePeriod(SEND_HISTORY_GRID_DATA, page) }} / {{ SEND_HISTORY_GRID_DATA.length }}
                      <!-- <v-btn class="pl-btn is-sub">다음 검색</v-btn> -->
                      <compo-tooltip-btn
                        TitleProp="다음 검색"
                        ClassProp="pl-tooltip-btn is-line"
                        IconProp="pl-icon20 arrow-next-paging"
                        TooltipPositionProp="top"
                        :DisabledProp="nextDisabled"
                        @btnClick="selectAtalkSendHistory('next')"
                      ></compo-tooltip-btn>
                    </span>
                  </div>
                </div>
              </div>
              <!-- 미리보기 -->
              <div class="is-vrt is-col-fix " style="width: 460px">
                <div class="pl-card">
                  <h2 class="pl-subtit">알림톡 발송 상세정보</h2>
                </div>
                <div class="pl-card is-noborder">
                  <div class="pl-chatting-cs-info">
                    <div class="pl-chatting-cs-info-cus">
                      <div>
                        <strong class="pl-chatting-cs-info-tit">수신자</strong>
                        <span  class="pl-chatting-cs-info-desc">{{ SELECT_GRID_ROW_ITEM.RECEIVE_NO ? mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(SELECT_GRID_ROW_ITEM.RECEIVE_NO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(SELECT_GRID_ROW_ITEM.RECEIVE_NO.replace(/[^0-9]/g, "")) : ''}}</span>
                      </div>
                      <div>
                        <strong class="pl-chatting-cs-info-tit">발송자</strong>
                        <span  class="pl-chatting-cs-info-desc">{{ SELECT_GRID_ROW_ITEM.USER_NM }}({{ SELECT_GRID_ROW_ITEM.SEND_NO }})</span>
                      </div>
                      <div>
                        <strong class="pl-chatting-cs-info-tit">발송일시</strong>
                        <span  class="pl-chatting-cs-info-desc">{{ this.$moment(SELECT_GRID_ROW_ITEM.SNDNG_DT).format("YYYY-MM-DD HH:mm:ss") }}</span>
                      </div>
                      <div>
                        <strong class="pl-chatting-cs-info-tit">발송결과</strong>
                        <span  class="pl-chatting-cs-info-desc">
                          <span
                            v-if="MTS_RSTL"
                            :class="`pl-round-chip is-sm chat-stat-${MTS_RSTL == '발송완료' ? 'done' : (MTS_RSTL == '발송예약' ? 'wait' : 'after')}`">
                            {{ MTS_RSTL }}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="pl-card is-noborder">
                  <h3 class="pl-subtit is-h3">발송 내용</h3>

                  <div class="pl-phone-bg-wrap is-sm is-mt-m">
                    <div class="pl-phone-bg">
                      <div
                        v-if="ATALK_MESSAGE"
                        class="pl-phone-sample-list-wrap"
                        ref="chatContainer">
                        <div class="pl-alramTalk-wrap is-sm is-mt-m">
                          <div class="pl-alramTalk-wrap-unit">
                            <div class="pl-alramTalk-wrap-title">알림톡 도착</div>
                            <div class="pl-alramTalk-wrap-desc">
                              <div class="pl-alramTalk-wrap-textarea" >
                                <!-- 메인이미지 -->
                                <!-- 강조 유형 : 이미지형 / 아이템 리스트형 // 이미지가 존재 -->
                                <div
                                  v-if="(SEND_TMPL?.TMPL_EPSZ_TYPE === 'IMAGE' || SEND_TMPL?.TMPL_EPSZ_TYPE === 'ITEM_LIST') && SEND_TMPL?.IMG != ''"
                                  class="pl-alramTalk-wrap-type-img"
                                  >
                                  <!-- 이미지url -->
                                  <img :src="SEND_TMPL?.ITEM_HIGH_LIGHT.imageUrl" alt="SEND_TMPL.ITEM_HIGH_LIGHT.description">
                                </div>
                                <!-- 헤더 // 강조유형 : 아이템리스트형 -->
                                <div
                                  v-if="SEND_TMPL?.TMPL_EPSZ_TYPE === 'ITEM_LIST' && SEND_TMPL?.ITEM_HEADER != ''"
                                  class="pl-alramTalk-wrap-type-header"
                                  >
                                  {{ SEND_TMPL.ITEM_HEADER }}
                                </div>
                                <!-- 하이라이트 // 강조유형 : 아이템리스트형 -->
                                <div class="d-flex justify-space-between">
                                  <div>
                                    <!-- 좌측 위 하이라이트 제목 -->
                                    <div
                                      v-if="SEND_TMPL?.TMPL_EPSZ_TYPE === 'ITEM_LIST' && SEND_TMPL?.ITEM_HIGH_LIGHT.length != 0 && SEND_TMPL?.ITEM_HIGH_LIGHT.title != ''"
                                      class="pl-alramTalk-wrap-type-highlight-title"
                                      >
                                      {{ SEND_TMPL.ITEM_HIGH_LIGHT.title }}
                                    </div>
                                    <!-- 좌측 하단 하이라이트 설명 -->
                                    <div
                                      v-if="SEND_TMPL?.TMPL_EPSZ_TYPE === 'ITEM_LIST' && SEND_TMPL?.ITEM_HIGH_LIGHT.length != 0 && SEND_TMPL?.ITEM_HIGH_LIGHT.description != ''"
                                      class="pl-alramTalk-wrap-type-highlight-desc"
                                      >
                                      {{ SEND_TMPL.ITEM_HIGH_LIGHT.description }}
                                    </div>
                                  </div>
                                  <!-- 우측 하이라이트 이미지 -->
                                  <div
                                    v-if="SEND_TMPL?.TMPL_EPSZ_TYPE === 'ITEM_LIST' && SEND_TMPL?.ITEM_HIGH_LIGHT.length != 0 && SEND_TMPL?.ITEM_HIGH_LIGHT.imageUrl != ''"
                                    class="pl-alramTalk-wrap-type-thumb"
                                    >
                                    <img :src="SEND_TMPL?.ITEM_HIGH_LIGHT.imageUrl" alt="SEND_TMPL.ITEM_HIGH_LIGHT.description">
                                  </div>
                                </div>
                                <!-- 아이템리스트 -->
                                <div
                                  v-if="SEND_TMPL?.TMPL_EPSZ_TYPE === 'ITEM_LIST' && SEND_TMPL?.TMPL_ITEM.list.length > 0"
                                  class="is-mt-m"
                                  >
                                  <div
                                    v-for="(item, index) in SEND_TMPL?.TMPL_ITEM.list"
                                    :key="index"
                                    class="d-flex justify-space-between"
                                  >
                                    <!-- 좌측 아이템 리스트 제목 -->
                                    <span class="is-txt-sub">
                                      {{ item.title }}
                                    </span>
                                    <!-- 우측 아이템 리스트 설명 -->
                                    <span>
                                      {{ item.description }}
                                    </span>
                                  </div>
                                </div>
                                <!-- 아이템리스트 요약 -->
                                <div
                                  v-if="SEND_TMPL?.TMPL_EPSZ_TYPE === 'ITEM_LIST' && SEND_TMPL?.TMPL_ITEM.summary.length > 0"
                                  class="d-flex justify-space-between"
                                  >
                                  <!-- 좌측 요약 제목 -->
                                  <span class="is-txt-sub">
                                    {{ SEND_TMPL.TMPL_ITEM.summary.title }}
                                  </span>
                                  <!-- 우측 요약 설명 -->
                                  <span>
                                    {{ SEND_TMPL.TMPL_ITEM.summary.description }}
                                  </span>
                                </div>

                                <!-- 강조표기형 -->
                                <div v-if="SEND_TMPL?.TMPL_EPSZ_TYPE === 'TEXT' && TMPL_TITLE.length > 0">
                                  {{ TMPL_TITLE }}
                                </div>
                                <div v-if="SEND_TMPL?.TMPL_EPSZ_TYPE === 'TEXT' && TMPL_TITLE.length > 0" style="font-weight: bold; font-size: large;">
                                  {{ SEND_TMPL.TMPL_SUB_TITLE }}
                                </div>
                                <!-- 강조유형 구분선 -->
                                <v-divider v-if="SEND_TMPL?.TMPL_EPSZ_TYPE != ''" class="my-2"/>

                                <!-- 내용 -->
                                <div >
                                  {{ SELECT_GRID_ROW_ITEM.SEND_MSG }}
                                </div>

                                <!-- 부가정보형 -->
                                <div
                                  v-if="(SEND_TMPL?.TMPL_MSG_TYPE === 'EX' || SEND_TMPL?.TMPL_MSG_TYPE === 'MI') && SEND_TMPL?.TMPL_EXTRA != ''"
                                  class="is-txt-sub"
                                  >
                                  {{ SEND_TMPL.TMPL_EXTRA }}
                                </div>
                              </div>

                              <!-- 버튼 유형 -->
                              <div v-if="BTN.length > 0">
                                <div
                                  v-for="(item, index) in BTN"
                                  :key="index"
                                  :class="index === 0 ? 'mt-3' : ''"
                                  >
                                  <!-- 버튼 유형 : 웹링크, 앱링크-->
                                  <div class="pl-alramTalk-wrap-btn mt-2" v-if="item.linkType === 'WL' || item.linkType === 'AL'">
                                    <v-btn class="pl-btn is-sub is-intalk"> {{ item.name }}</v-btn>
                                  </div>
                                  <!-- 버튼 유형 : 봇 키워드 -->
                                  <div class="pl-alramTalk-wrap-btn mt-2" v-if="item.linkType === 'BK'">
                                    <v-btn class="pl-btn is-sub is-intalk"> {{ item.name }}</v-btn>
                                  </div>
                                  <!-- 버튼 유형 : 메시지 전달 -->
                                  <div class="pl-alramTalk-wrap-btn mt-2" v-if="item.linkType === 'MD'">
                                    <v-btn class="pl-btn is-sub is-intalk"> {{ item.name }}</v-btn>
                                  </div>
                                  <!-- 버튼 유형 : 상담톡 전환 -->
                                  <div class="pl-alramTalk-wrap-btn mt-2" v-if="item.linkType === 'BC'">
                                    <v-btn class="pl-btn is-sub is-intalk"> {{ item.name }}</v-btn>
                                  </div>
                                  <!-- 버튼 유형 : 봇 전환 -->
                                  <div class="pl-alramTalk-wrap-btn mt-2" v-if="item.linkType === 'BT'">
                                    <v-btn class="pl-btn is-sub is-intalk"> {{ item.name }}</v-btn>
                                  </div>
                                  <!-- 버튼 유형 : 채널 추가 -->
                                  <div class="pl-alramTalk-wrap-btn mt-2" v-if="item.linkType === 'AC'">
                                    <v-btn class="pl-btn is-sub is-intalk " color="#ffe400">
                                      <span class="kakao-addch"></span>
                                      {{ item.name }}
                                    </v-btn>
                                  </div>
                                  <!-- 버튼 유형 : 배송 조회 -->
                                  <div class="pl-alramTalk-wrap-btn mt-2" v-if="item.type === 'DS'">
                                    <v-btn class="pl-btn is-sub is-intalk"> {{ item.name }}</v-btn>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </v-tab-item>
          <!-- 알림톡 대량 발송 -->
          <v-tab-item>
            <div style="height: 100%">
              <!-- top search -->
              <div class="pl-card">
                <div class="pl-search-form pb-0">
                  <div class="pl-form-inline-wrap">
                    <!-- <div class="pl-form-inline">
                      <span class="pl-label">
                        탬플릿 분류
                      </span>
                      <div class="pl-desc">
                        <v-select
                          class="pl-form "
                          :items="dropItemsT01"
                          placeholder="선택하세요"
                        ></v-select>
                      </div>
                    </div> -->
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        탬플릿 명
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          class="pl-form is-lg"
                          placeholder="검색어 입력"
                          v-model="TMPL_NAME"
                          @keyup.enter="selectAtalkTmplList"
                        ></v-text-field>
                      </div>
                    </div>
                    <v-btn class="pl-btn is-icon" @click="selectAtalkTmplList">
                      <span class="pl-icon20 search"></span>
                      조회
                    </v-btn>
                  </div>
                </div>
              </div>
              <!-- content -->
              <div class="pl-cols" style="height: calc(100% - 60px)">
                <!-- 알림톡 템플릿 -->
                <div class="is-col-fix is-vrt" style="width: 560px">
                  <!-- content -->
                  <div class="">
                    <div class="pl-card is-border">
                      <h2 class="pl-subtit">알림톡 템플릿
                        <span class="pl-counter ml-2">전체 <em class="pl-1">({{ ATALK_TMPL_LIST.length }})</em> 건</span>
                      </h2>
                      <div class="pl-subdesc">
                        <p><strong>목록의 [적용] 버튼을 클릭</strong> 하시면 발송 내용에 지정됩니다.</p>
                      </div>
                    </div>
                    <!-- template list -->
                    <div class="pl-card is-noborder pt-0" style="overflow-y: auto; height: 580px">
                      <div class="pl-msg-template-list">
                        <div
                          v-for="item in ATALK_TMPL_LIST"
                          class="pl-msg-template-list-unit"
                          :class="item.ATALK_ID  === ATALK_ID ? 'selected' : ''"
                          :key="item.ATALK_ID">
                          <span class="pl-msg-template-list-title is-ellips">
                            {{ item.DSPTCH_PRF_NM }}
                            <strong class="pt-0">{{ item.TMPL_NM }}</strong>
                          </span>
                          <div class="pl-msg-template-list-desc">
                            <div>{{ item.TMPL_CN }}</div>
                          </div>
                          <div class="ml-auto mt-2">
                            <v-btn class="pl-btn is-sub is-sm" @click="applyTmpl(item)">적용</v-btn>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 발송내용 및 대상자 -->
                <div class="pl-cols">
                  <div class=" is-vrt">
                    <div class="pl-card is-border">
                      <h2 class="pl-subtit">발송내용 및 대상자</h2>
                      <div class="pl-subdesc">
                        <p>발송할 <strong>알림톡 내용을 확인</strong> 하시고 <strong>발송 대상자 엑셀파일을 업로드</strong> 하여 주십시오.</p>
                      </div>
                    </div>
                    <div class="pl-card is-noborder pl-cols">
                      <!-- 선택된 템플릿 -->
                      <div class="is-col-fix" style="width: 520px">
                        <div class="pl-form-inline-wrap vertical">
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              발송일시
                            </span>
                            <div class="pl-desc">
                              <compo-date-picker
                                DateType="dateTime"
                                :DateProp.sync="SEND_DATE"
                                :TimesProp.sync='SEND_TIME'
                              />
                              <!-- :AmpmProp.sync='IS_SEND_ATONCE' -->
                              <v-checkbox class="pl-check" label="즉시발송" v-model="IS_SEND_ATONCE"></v-checkbox>
                              <!-- 툴팁 버튼 -->
                              <compo-tooltip-btn
                                TitleProp="예약발송을 원하시면 즉시발송 체크를 해제하신 후<br>발송일시를 직접 선택하여 주십시오."
                                ClassProp="pl-tooltip-btn flex-grow-0"
                                IconProp="pl-icon20 question"
                                TooltipPositionProp="bottom"
                              ></compo-tooltip-btn>
                            </div>
                          </div>
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              발송간격
                            </span>
                            <div class="pl-desc">
                              <div class="pl-desc" style="width:50%">
                                <v-select
                                class="pl-form"
                                  :items="SEND_INTERVAL_PEOPLE_LIST"
                                  v-model="SEND_INTERVAL_PEOPLE"
                                  placeholder="선택하세요"
                                ></v-select>명
                              </div>
                              <div class="pl-desc" style="width:45%">
                                <v-select
                                  class="pl-form"
                                  :items="SEND_INTERVAL_MIN_LIST"
                                  v-model="SEND_INTERVAL_MIN"
                                  placeholder="선택하세요"
                                ></v-select> 분
                              </div>
                            </div>
                          </div>
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              발송내용
                            </span>
                            <div class="pl-desc">
                              <v-textarea
                                class="pl-form is-noresize"
                                height="165px"
                                v-model="SEND_MESSAGE"
                                :spellcheck="false"
                                disabled
                              />
                            </div>
                          </div>
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              전환전송 여부
                            </span>
                            <div class="pl-desc">
                              <v-checkbox class="pl-check" label="전환전송" v-model="TRAN_SEND"></v-checkbox>
                              <compo-tooltip-btn
                                TitleProp="알림톡 발송에 실패하였을 때 문자(SMS/LMS/MMS)로 알림톡 내용을 발송합니다."
                                ClassProp="pl-tooltip-btn flex-grow-0"
                                IconProp="pl-icon20 question"
                                TooltipPositionProp="bottom"
                              ></compo-tooltip-btn>
                            </div>
                          </div>
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              발송번호
                            </span>
                            <div class="pl-desc">
                              <!-- <v-text-field class="pl-form" disabled /> -->
                              <v-select
                                class="pl-form"
                                :items="CUSTCO_TEL_LIST"
                                v-model="CALLBACK_NUMBER"
                                placeholder="선택하세요"
                                :disabled="!TRAN_SEND"
                              ></v-select>
                            </div>
                          </div>
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              전환전송 내용
                            </span>
                            <div class="pl-desc">
                              <v-textarea
                                class="pl-form is-noresize flex-grow-1"
                                placeholder="내용을 입력하세요"
                                v-model="TRANS_MESSAGE"
                                :spellcheck="false"
                                :disabled="!TRAN_SEND"
                              />
                              <p class="pl-form-hint">알림톡 발송 실패 시 문자로 전송되는 내용을 입력하세요.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- 그리드 -->
                      <div class="ml-4">
                        <div class="pl-grid-top">
                          <div class="pl-grid-top-left">
                            <h2 class="pl-subtit">대량 발송 대상자</h2>
                            <v-btn class="pl-btn is-icon is-sub" @click="btnExUpload">
                              <span class="pl-icon20 excelup"></span>
                              엑셀 업로드
                            </v-btn>
                            <v-file-input
                              v-show="false"
                              ref="excelRef"
                              @change="uploadExcel"
                              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                              counter
                              label="엑셀파일을 선택하세요"
                              :show-size="1000"
                            />
                            <v-btn class="pl-btn is-icon is-sub" @click="btnExDownLoad">
                              <span class="pl-icon20 exceltemplate"></span>
                              엑셀 양식 다운로드
                            </v-btn>
                          </div>
                          <div class="pl-grid-top-utils">
                            <span class="pl-counter">전체 <em class="pl-1">({{ EXCEL_TOTAL_CNT }})</em> 건</span>
                            <!-- 엑셀 다운로드 버튼 -->
                            <!-- <compo-tooltip-btn
                              TitleProp="엑셀 다운로드"
                              ClassProp="pl-tooltip-btn is-line"
                              IconProp="pl-icon20 exceldown"
                              TooltipPositionProp="top"
                              @btnClick="mixin_testLog('엑셀 다운로드')"
                            ></compo-tooltip-btn> -->
                          </div>
                        </div>
                        <v-data-table
                          class="pl-grid"
                          :headers="EXCEL_GRID_HEADER"
                          :items="EXCEL_GRID_DATA"
                          fixed-header
                          item-key="index"
                          height="422px"
                          :items-per-page="ROW_PER_PAGE2"
                          hide-default-footer
                          :page.sync="page2"
                          no-data-text="등록된 데이터가 없습니다."
                          @page-count="pageCount2 = $event">
                        </v-data-table>
                      </div>
                    </div>
                    <div class="pl-card is-bottom">
                      <div class="is-right">
                        <v-btn class="pl-btn is-sub" @click="showSendAtalkPreview" >미리보기</v-btn>
                        <v-btn class="pl-btn" @click="sendAtalkValidation">발송하기</v-btn>
                      </div>
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

    <!-- 발송자 찾기 모달 -->
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
            :FindData="SENDER"
            MultiSelYnProp="true"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('UserFind')">닫기</v-btn>
          <v-btn class="pl-btn" @click="mixin_hideDialog('UserFind')">확인</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- 카카오 알림톡 미리보기 -->
    <!-- dialog -->
    <v-dialog
      v-model="dialogPreview"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :header-title="PREVIEW_TITLE"
        @hide="mixin_hideDialog('Preview')"
      >
        <template slot="body">
          <p v-if="PREVIEW_TITLE == '미리보기'">미리보기는 실제 수신자가 보는 모양과 다를 수 있습니다. 수신자의 단말기와  수신자가 설정한 폰트 등에  따라 달리 표시되어집니다.</p>
          <!-- 미리보기 -->
          <div class="pl-alramTalk-wrap is-mt-m">
            <div class="pl-alramTalk-wrap-unit">
              <div class="pl-alramTalk-wrap-title">알림톡 도착</div>
              <div class="pl-alramTalk-wrap-desc">
                <div class="pl-alramTalk-wrap-textarea" style="height: 150px">
                  <!-- 강조 유형 : 이미지형 -->
                  <div v-if="SEND_TMPL?.TMPL_EPSZ_TYPE === 'IMAGE'">
                    <p style="height: 80px;">image</p>
                  </div>

                  <!-- 강조표기형 -->
                  <div v-if="SEND_TMPL?.TMPL_EPSZ_TYPE === 'TEXT'">
                    {{ SEND_TMPL.TMPL_SUB_TITLE }}
                  </div>
                  <div v-if="SEND_TMPL?.TMPL_EPSZ_TYPE === 'TEXT'" style="font-weight: bold; font-size: large;">
                    {{ SEND_TMPL.TMPL_TITLE }}
                  </div>

                  <!-- 내용 -->
                  <div style="font-weight: bold">
                    {{ SELECT_GRID_ROW_ITEM.SEND_MSG }}
                  </div>

                  <!-- 부가정보형 -->
                  <div v-if="SEND_TMPL?.TMPL_MSG_TYPE === 'EX' || SEND_TMPL?.TMPL_MSG_TYPE === 'MI'">
                    <div class="">
                      {{ SEND_TMPL.TMPL_EXTRA }}
                    </div>
                  </div>
                </div>

                <!-- 버튼 유형 -->
                <div v-if="BTN.length > 0">
                  <div
                    v-for="(item, index) in BTN"
                    :key="index"
                    :class="index === 0 ? 'mt-3' : ''"
                    >
                    <!-- 버튼 유형 : 웹링크, 앱링크-->
                    <div class="pl-alramTalk-wrap-btn mt-2" v-if="item.linkType === 'WL' || item.linkType === 'AL'">
                      <v-btn class="pl-btn is-sub is-intalk"> {{ item.name }}</v-btn>
                    </div>
                    <!-- 버튼 유형 : 봇 키워드 -->
                    <div class="pl-alramTalk-wrap-btn mt-2" v-if="item.linkType === 'BK'">
                      <v-btn class="pl-btn is-sub is-intalk"> {{ item.name }}</v-btn>
                    </div>
                    <!-- 버튼 유형 : 메시지 전달 -->
                    <div class="pl-alramTalk-wrap-btn mt-2" v-if="item.linkType === 'MD'">
                      <v-btn class="pl-btn is-sub is-intalk"> {{ item.name }}</v-btn>
                    </div>
                    <!-- 버튼 유형 : 상담톡 전환 -->
                    <div class="pl-alramTalk-wrap-btn mt-2" v-if="item.linkType === 'BC'">
                      <v-btn class="pl-btn is-sub is-intalk"> {{ item.name }}</v-btn>
                    </div>
                    <!-- 버튼 유형 : 봇 전환 -->
                    <div class="pl-alramTalk-wrap-btn mt-2" v-if="item.linkType === 'BT'">
                      <v-btn class="pl-btn is-sub is-intalk"> {{ item.name }}</v-btn>
                    </div>
                    <!-- 버튼 유형 : 채널 추가 -->
                    <div class="pl-alramTalk-wrap-btn mt-2" v-if="item.linkType === 'AC'">
                      <v-btn class="pl-btn is-sub is-intalk"> {{ item.name }}</v-btn>
                    </div>
                    <!-- 버튼 유형 : 배송 조회 -->
                    <div class="pl-alramTalk-wrap-btn mt-2" v-if="item.linkType === 'DS'">
                      <v-btn class="pl-btn is-sub is-intalk"> {{ item.name }}</v-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="closeDiaolog">닫기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

  </div>
</template>

<script>
import * as XLSX from "xlsx";
export default {
    name:"MENU_CSL_M0604", //name은 'MENU_' + 파일명 조합

 components: {

  },
 data() {
  return {

    // confirm alert 메시지
    MESSAGE : {
      CONFIRM : {
        SEND : {alertDialogToggle: true, msg: '발송하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.sendAtalk, callNo: this.closeMsg}
      },
      ALERT : {
        CHK_BGNG_YMD : { alertDialogToggle: true, msg : '시작 일자를 선택하세요.',iconClass: 'is-info', type: 'default'},
        // // CHK_END_YMD : { alertDialogToggle: true, msg : '종료 일자를 선택하세요.',iconClass: 'is-info', type: 'default'},
        SELECT_DATE : { alertDialogToggle : true, msg:'종료 일자는 시작 일자보다 빠를 수 없습니다.',iconClass: 'is-info', type:'default'},
        CHK_SENHIS_ROW : { alertDialogToggle : true, msg:'발송 이력 항목을 선택하세요.',iconClass: 'is-info', type:'default'},

        EMPTY_CALLBACK_NUMBER : { alertDialogToggle : true, msg:'발송자 전화번호가 없습니다.',iconClass: 'is-info', type:'default'},
        NOT_VALIDATE_CALLBACK_NUMBER : { alertDialogToggle : true, msg:'발송자 전화번호가 전화번호 형식에 맞지 않습니다.',iconClass: 'is-info', type:'default'},
        EMPTY_PHONE_NUMBER : { alertDialogToggle : true, msg:'수신자 전화번호를 업로드하세요.',iconClass: 'is-info', type:'default'},
        EMPTY_SEND_MESSAGE : { alertDialogToggle : true, msg:'발송 메시지를 입력하세요.',iconClass: 'is-info', type:'default'},
        EXCESS_SEND_MESSAGE : { alertDialogToggle : true, msg:'전환전송 메시지 글자는 2000바이트를 초과 할 수 없습니다.',iconClass: 'is-info', type:'default'},
        // // LIMIT_FILE_TOTAL_SIZE : { alertDialogToggle : true, msg:'첨부파일 전체 용량은 900KB를 초과할수 없습니다.',iconClass: 'is-info', type:'default'},
        // LIMIT_FILE_EACH_SIZE : { alertDialogToggle : true, msg:'첨부파일 개당 용량을 300KB 초과하는 파일이 있습니다.',iconClass: 'is-info', type:'default'},
        // LIMIT_FILE_COUNT : { alertDialogToggle : true, msg:'첨부파일 개수는 3개를 초과할수 없습니다.',iconClass: 'is-info', type:'default'},
        NOT_VALIDATE_INCLUDE_PHONENUMBER : { alertDialogToggle : true, msg:'형식에 맞지 않는 휴대전화 번호가 포함되었습니다.',iconClass: 'is-info', type:'default'},

        CHK_APPLY_TMPL : { alertDialogToggle : true, msg:'알림톡 템플릿을 선택하세요.',iconClass: 'is-info', type:'default'},
        // CHANGE_SMS_SUCCESS : { alertDialogToggle : true, msg:'문자 발송을 SMS 요청으로 변경 완료 했습니다.',iconClass: 'is-info', type:'default'},
        // CHANGE_MMS_SUCCESS : { alertDialogToggle : true, msg:'문자 발송을 MMS 요청으로 변경 완료 했습니다.',iconClass: 'is-info', type:'default'},
        // CHANGE_LMS_SUCCESS : { alertDialogToggle : true, msg:'문자 발송을 LMS 요청으로 변경 완료 했습니다.',iconClass: 'is-info', type:'default'},
        SEND_SUCCESS : { alertDialogToggle : true, msg:'알림톡 발송을 완료 했습니다.',iconClass: 'is-info', type:'default'}
      },
      TOAST : {
        SEND_SUCCESS: {  msg: '알림톡 발송을 완료 했습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
      },
    },

    CUSTCO_TEL_LIST : [],               // 발송자 번호 선택 상자

    CALLBACK_NUMBER : "",               // 발송자 번호
    ATALK_TMPL_LIST : [],               // 알림톡 템플릿 리스트

    // 대량발송 대상자 유효성 검사 결과
    VALIDATE_PHONENUMBER_EXCEL_UPLOAD : true,
    // 엑셀 파일에서 추출한  map 형식으로 담는 객체
    EXCEL_UPLOAD_DATA:[],

    // 엑셀 업로드 데이터 개수
    EXCEL_TOTAL_CNT: 0,

    // 엑셀업로드 그리드 헤더
    EXCEL_GRID_HEADER: [
      { text: "번호", value: "No", align: "center", width: "80", sortable : false },
      { text: "전화번호", value: "phone_number", align: "left", width: "180", sortable : false},
      { text: "비고", value: "etc", align: "left", sortable : false}
    ],

    // 엑셀업로드 그리드 데이터 저장소
    EXCEL_GRID_DATA : [],

    // 수신자 번호
    PHONE_NUMBER : [],

    // 즉시 발송 체크 여부
    IS_SEND_ATONCE : true,

    // 발송자 정보
    SENDER : [],
    // 사용자 검색 모달 관련 시작
    DropUser: {},
    // 사용자 이름 검색
    searchUsername: '',
    HeadersFindCus: [],
    ItemsFindCus:[],

    // 수신자 번호
    RECEIVE_NO : "",
    // 알림톡 내용
    SNDNG_CN : "",

    // 발송일자
    SEND_DATE : "",

    // 발송시간
    SEND_TIME : "",
    ATALK_ID : "",
    SEND_MESSAGE : "",                       // 알림톡 템플릿 내용
    TRAN_SEND: false,
    TRANS_MESSAGE : "",                      // 알림톡 발송 실패 시 전송할 메시지

    // 검색 조건 템플릿 명
    TMPL_NAME : "",

    // 시작 일자
    START_DATE : "",
    // 종료 일자
    END_DATE : "",
    // 유효성 검사 통과 불가 시 초기화 하기 위한 선택 전 시작 일자
    VALIDATE_START_OLD_DATE : "",
    // 유효성 검사 통과 불가 시 초기화 하기 위한 선택 전 종료 일자
    VALIDATE_END_OLD_DATE : "",
    // 유효성 검사를 위한 시작 일자
    VALIDATE_START_DATE : "",
    // 유효성 검사를 위한 종료 일자
    VALIDATE_END_DATE : "",

    //템플릿의 발신프로필키
    DSPTCH_PRF_KEY: '',

    VALIDATE_RULES:{
      START_DATE :[
        v => !!v|| '시작일자 은(는) 필수 입력 항목입니다.'
      ],
      END_DATE :[
        v => !!v|| '종료일자 은(는) 필수 입력 항목입니다.'
      ]
    },

    SEND_HISTORY_GRID_HEADER : [
        { text: "번호", value: "ROWNUM", align: "center", width: "7%",sortable : false},
        { text: "유형", value: "SEND_TP_NM", align: "left", width: "7%" ,sortable : true},
        { text: "발송번호", value: "SEND_NO", align: "left", width: "120px" ,sortable : false},
        { text: "발송자", value: "USER_NM", align: "left", width: "9%" ,sortable : false},
        { text: "발송자 ID", value: "USER_ID", align: "left", width: "9%" ,sortable : false},
        { text: "발송일시", value: "SNDNG_DT", align: "left", width: "150px" ,sortable : false},
        { text: "수신번호", value: "RECEIVE_NO", align: "left", width: "120px" ,sortable : false},
        { text: "발송결과", value: "RSLT_CD_NM", align: "left", width: "90px" ,sortable : false},
        { text: "알림톡내용", value: "SEND_MSG", align: "left", width: "33%" ,sortable : false},
        { text: "발송이력ID", value: "MTS_SNDNG_HSTRY_ID", align: " d-none",sortable : false}
      ],
    // 발송 이력 그리드 데이터
    SEND_HISTORY_GRID_DATA: [],



    tab: null,

      // dialog
          // 사용자 검색 모달 게시 상태
    dialogUserFind: false,

    // 알림톡 미리보기 모달
    dialogPreview : false,

    // 알림톡 내용
    ATALK_MESSAGE : "",

    // 이력 상세 or 다량발송 미리보기 다이얼로그 헤더 타이틀
    PREVIEW_TITLE : "",

      // TALK_INFO: {
      //   giver: '나고객 (010-5303-4545)',
      //   sender: '나상담 (02-7078-2826)',
      //   date: '2023/01/20 13:45 35:49',
      //   uuid: '@kpp',
      //   send_propfile: 'KPP알림톡',
      //   template_code: 'kpp_main_img',
      //   template_title: '테스트 템플릿',
      //   msg_type: '기본형',
      //   em_type: '강조 표기형',
      //   send_key: '1d6bb3a853978d06f3f3dea9fba0fa7c375c3f06',
      //   text: '안녕하세요. 한국클라우드입니다,\n 문의하신 가산센터의 안녕하세요. 한국클라우드입니다,\n 문의하신 가산센터의 전화번호는\n안녕하세요. 한국클라우드입니다,\n 문의하신 가산센터의 전화번호는\n안녕하세요. 한국클라우드입니다,\n 문의하신 가산센터의 전화번호는\n화번호는\n안녕하세요. 한국클라우드입니다,\n 문의하신 가산센터의 전화번호는\n안녕하세요. 한국클라우드입니다,\n 문의하신 가산센터의 전화번호는\n 02-1234-6784입니다.\n 감사합니다. '
      // },

      // 알림톡 발송이력
      // top search
      startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      endDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      // dropItems: [
      //   '발송자 ID',
      //   '발송자 명',
      // ],
      // dropItems2: [
      //   '수신번호',
      //   '수신자 명',
      // ],
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
      }, //그리드 페이지속성정의

      nextDisabled: false,                  // 다음보기 버튼 활성/비활성
      SELECT_GRID_ROW_ITEM : {},            // grid에서 선택한 row 정보, 상세 보기 조회 및 활성화 용도

      // 선택한 템플릿 정보
      SEND_TMPL: {},
      BTN:[],
      TMPL_TITLE:'',

      // headers: [
      //   { text: '순번', value: 'index', align: 'center', width: '80px' },
      //   { text: '유형', value: 'type', align: 'center', width: '120px' },
      //   { text: '스크립트명', value: 'subject'},
      //   { text: '수정일', value: 'date', align: 'center', width: '120px' },
      // ],
      // items: [
      //   {
      //     index: 1,
      //     type: '공통',
      //     subject: '취소수수료를 환불해 주세요.',
      //     contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
      //     date: '2020-08-05'
      //   },
      // ],

      // 알림톡 대량 발송
      // top search
      // dropItemsT01: [],
      // MSG_TEMPLATE_LIST: [
      //   {
      //     title: '센터 전화번호안내 알림톡 템플릿 ',
      //     status: '정상 (승인)',
      //     date: '2023/01/16',
      //     manager: '나관리',
      //   },
      //   {
      //     title: '센터 전화번호안내 알림톡 템플릿 ',
      //     status: '정상 (승인)',
      //     date: '2023/01/16',
      //     manager: '나관리',
      //   },
      //   {
      //     title: '센터 전화번호안내 알림톡 템플릿 ',
      //     status: '정상 (승인)',
      //     date: '2023/01/16',
      //     manager: '나관리',
      //   },
      //   {
      //     title: '센터 전화번호안내 알림톡 템플릿 ',
      //     status: '정상 (승인)',
      //     date: '2023/01/16',
      //     manager: '나관리',
      //   },

      // ],
      // date1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      // timeStep2: '05:50',
      // timeAmpm: '오후',
      // grid
      page2: 1,
      pageCount2: 0,
      perPage2: [15,30,50,100],
      ROW_PER_PAGE2: -1,
      // headers2: [
      //   { text: '순번', value: 'index', align: 'center', width: '80px' },
      //   { text: '유형', value: 'type', align: 'center', width: '120px' },
      //   { text: '스크립트명', value: 'subject'},
      //   { text: '수정일', value: 'date', align: 'center', width: '120px' },
      // ],
      // items2: [
      //   {
      //     index: 1,
      //     type: '공통',
      //     subject: '취소수수료를 환불해 주세요.',
      //     contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
      //     date: '2020-08-05'
      //   },
      // ],
      // selectedMsg: '',

      MTS_RSTL:'',    //MTS 발송결과

      date: '',   //현재시간

      SEND_INTERVAL_PEOPLE_LIST : [1000, 2000, 3000, 5000, 7500, 10000],
      SEND_INTERVAL_PEOPLE : 2000,
      SEND_INTERVAL_MIN_LIST : [5, 10, 15, 20, 25, 30, 35, 40, 45, 60, 55, 60],
      SEND_INTERVAL_MIN : 5,
    }
  },

  watch: {

  },

  computed: {

  },

  async created() {
    //공통코드설정
    let codeName = [
                    ,'CUSL_PHN_NO'  //상담사 전화번호 - 문자 발신번호 목록에 추가됨
                  ];
    this.common_code = await this.mixin_common_code_get_all(codeName, 'Y');
    //환경설정 - 알림톡 전환전송 체크 여부
    this.TRAN_SEND = this.mixin_getCustcoSetting('ENV_ATALK_TRAN_SEND_CHECK_YN');
  },

  mounted() {
    // 날짜 컴퍼넌트 초기화
    this.initDatePicker();
    //서버기준 오늘날짜 가져오기
    this.getServerDate();
  },

  methods: {
    /** 공통 비동기 서버 호출 */
    async postCall(sUrl, postParam, headParam, callbackFunction){
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        return callbackFunction(response);
      } else {
        //백엔드 호출 실패시
      }
    },

    initDatePicker(){
      // let nowDate = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString();

      let ago7Day = this.$moment(new Date()).subtract(7, 'day').format("YYYYMMDDHHmmss");
      let today = this.$moment(new Date()).format("YYYYMMDDHHmmss");

      let ago7DayFormat = ago7Day.substring(0,4) + "-" + ago7Day.substring(4,6) + "-" + ago7Day.substring(6,8);
      let todayFormat = today.substring(0,4) + "-" + today.substring(4,6) + "-" + today.substring(6,8);

      /** 발송이력 탭 > 검색조건  */
      // 시작일자
      this.START_DATE = ago7DayFormat
      // 종료일자
      this.END_DATE = todayFormat;
      /** 발송이력 탭 > 유효성 검사 관련 날짜 변수 */
      // 유효성 검사 목적 시작 일자
      this.VALIDATE_START_DATE = ago7DayFormat;
      // 유효성 검사 목적 종료 일자
      this.VALIDATE_END_DATE = todayFormat;
      // 유효성 검사 미통과 시 초기화 설정을 위한 시작 일자
      this.VALIDATE_START_OLD_DATE = ago7DayFormat;
      // 유효성 검사 미통과 시 초기화 설정을 위한 종료 일자
      this.VALIDATE_END_OLD_DATE = todayFormat;

      /** 대량발송 탭  */
      // 발송일자
      this.SEND_DATE = todayFormat;
      // 발송시간
      this.SEND_TIME = today.substring(8, 10) + ":" + today.substring(10, 12) ;

    },

    /** 발송 이력 조회 관련 함수 시작 */

    /** 발송 이력 그리드 포커싱 이벤트 */
    isActiveRow(item) {
      return item.MTS_SNDNG_HSTRY_ID == this.SELECT_GRID_ROW_ITEM.MTS_SNDNG_HSTRY_ID ? "active" : "";
    },

    /** 발송 이력 그리드 클릭 이벤트 */
    async gridRowselected(item){
      this.SELECT_GRID_ROW_ITEM = item;

      //클릭한 알림톡의 템플릿정보를 받아오기
      await this.selectAtalkTmpl();

      //알림톡 메시지 표기
      //알림톡 메시지
      let sndngCn = this.SELECT_GRID_ROW_ITEM.SNDNG_CN
      // console.log("sndngCn", sndngCn);


      //알림톡 하이라이트 표기



      //기존 더블클릭 으로 팝업을 띄워 결과 받아오는 이벤트
      this.gridDbClick();

      //알림톡 미리보기 생성
      this.ATALK_MESSAGE = sndngCn.indexOf("||") == -1 ? sndngCn : sndngCn.substring(0,sndngCn.indexOf("||"));

      //알림톡 강조표기
      if(sndngCn.indexOf("||title:") != -1){
        let title = sndngCn.indexOf("||attachment:") == -1 ? sndngCn.substring(sndngCn.indexOf("||title:")+8) : sndngCn.substring(sndngCn.indexOf("||title:")+8,sndngCn.indexOf("||attachment:"));
        // console.log("title", title);
        this.TMPL_TITLE = title;
      } else {
        if(this.SEND_TMPL){
          if(this.SEND_TMPL.TMPL_TITLE){
            this.TMPL_TITLE = this.SEND_TMPL.TMPL_TITLE
          }
        }
      }

      //알림톡 버튼표기
      if(sndngCn.indexOf("||attachment:") != -1){
        let attachment = sndngCn.substring(sndngCn.indexOf("||attachment:")+13);
        let attachmentObj = JSON.parse(attachment);
        if(attachmentObj.button != '' && attachmentObj.button != null && attachmentObj.button != undefined){
          this.BTN = attachmentObj.button;
        }
      } else {
        if(this.SEND_TMPL){
          if(this.SEND_TMPL.BUTTONS){
            this.BTN = this.SEND_TMPL.BUTTONS;
          }
        }
      }

    },

    /** 발송 이력 그리드 더블클릭 이벤트 */
    async gridDbClick(){
      //예약발송 - mts발송결과 조회 시 에러
      if(parseInt(this.SELECT_GRID_ROW_ITEM.SNDNG_DT_STR) > parseInt(this.date)){
        this.MTS_RSTL = '발송예약';
        return;
      }
      if(this.SELECT_GRID_ROW_ITEM.RSLT_MSG.indexOf("||result") == -1){
        //결과를 받아오지 않은 발송내역만 발송결과 조회
        if(this.SELECT_GRID_ROW_ITEM.RSLT_CD == "0000" || this.SELECT_GRID_ROW_ITEM.RSLT_CD == "1000"){
          //발송 요청에 성공한 내역만 조회
          let MTS_RSTL_DATA = await this.mixin_getSndngRslt(this.SELECT_GRID_ROW_ITEM)
          if(MTS_RSTL_DATA.result_code == '1000' || MTS_RSTL_DATA.result_code == '0000' || MTS_RSTL_DATA.result_code == '00'){
            this.MTS_RSTL = '발송완료';
            // this.SELECT_GRID_ROW_ITEM.SNDNG_DT = MTS_RSTL_DATA.real_send_date;
            
            let nowPage = this.page;
            await this.selectAtalkSendHistory();
            this.page = nowPage
          } else {
            this.MTS_RSTL = '발송실패';
          }
        } else {
          this.MTS_RSTL = '요청실패';
        }
      } else {
        //이미 결과가 있음
        if(this.SELECT_GRID_ROW_ITEM.RSLT_CD == "0000" || this.SELECT_GRID_ROW_ITEM.RSLT_CD == "1000" || this.SELECT_GRID_ROW_ITEM.RSLT_CD == "00"){
          this.MTS_RSTL = '발송완료';
        } else {
          this.MTS_RSTL = '발송실패';
        }
      }
    },

    /** 발송 이력 그리드 상세보기 */
    openSendHistoryDetail(){
      if(this.SELECT_GRID_ROW_ITEM.MTS_SNDNG_HSTRY_ID == undefined){
        this.showAlert(this.MESSAGE.ALERT.CHK_SENHIS_ROW);
        return;
      }
      // 상세보기 팝업에 발송 내용 설정
      this.ATALK_MESSAGE = this.SELECT_GRID_ROW_ITEM.SNDNG_CN;
      this.PREVIEW_TITLE = "상세보기";
      // 상세보기 팝업 띄우기
      this.showDialog("Preview");
    },

    // 시작 날짜 변환 (기본적인 포맷은 YYYY-MM-DD HH:mm:ss 이고, api 파라미터로 보낼 때 YYYYMMDDHHmmss로 변환)
    changeStartDate(startData){
      this.VALIDATE_START_DATE = this.replaceAll(startData);
      if(this.chkDate()){     // 유효성 통과
        // 다음 유효성 검사 위해 원본 날짜 최신 선택 날짜로 업데이트
        this.VALIDATE_START_OLD_DATE = this.VALIDATE_START_DATE;
      }else{
        // 시작일자 날짜 설정 무효
        this.START_DATE = this.$moment(this.VALIDATE_START_OLD_DATE).format("YYYY-MM-DD");
        this.VALIDATE_START_DATE = this.VALIDATE_START_OLD_DATE;
      }
    },

    // 종료 날짜 변환 : String(YYYY:MM:DD hh:mm:ss AM/PM) to String(YYYYMMDDHHmmss)
    changeEndDate(endData){
      this.VALIDATE_END_DATE = this.replaceAll(endData);
      if(this.chkDate()){   // 유효성 통과
        // 다음 유효성 검사 위해 원본 날짜 최신 선택 날짜로 업데이트
        this.VALIDATE_END_OLD_DATE = this.VALIDATE_END_DATE;
      }else{
        this.END_DATE = this.$moment(this.VALIDATE_END_OLD_DATE).format("YYYY-MM-DD");
        this.VALIDATE_END_DATE = this.VALIDATE_END_OLD_DATE;
      }
    },

    // 시작,종료 일자 check : 시작 일자가 종료 일자보다 앞서면 ALERT창으로 경고
    chkDate(){
      // 유효성 여부
      let isValid = true;
      if(!this.mixin_isEmpty(this.VALIDATE_START_DATE) && !this.mixin_isEmpty(this.VALIDATE_END_DATE)){
        // 시작 날짜가 크면(종료일보다 시작일이 이후 날짜)
        if(Number(this.VALIDATE_START_DATE) > Number(this.VALIDATE_END_DATE)){
          isValid = false;
          // 날짜 역전 알림
          this.showAlert(this.MESSAGE.ALERT.SELECT_DATE);
        }
      }else if(this.mixin_isEmpty(this.VALIDATE_START_DATE)){
        isValid = false;
        this.showAlert(this.MESSAGE.ALERT.CHK_BGNG_YMD);
      }
      return isValid;
    },

    selectAtalkSendHistory(next){
      this.getServerDate();
      //다음버튼 클릭 유무
      if (next != 'next'){
        this.SEND_HISTORY_GRID_DATA = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let sUrl = "/phone-api/atalk/message/manage/atalkSendHistory";

      // 검색조건 파라미터
      let startDate = this.START_DATE.replaceAll(/-/g, "")+"000000";
      let endDate = this.END_DATE.replaceAll(/-/g, "")+"235959";
      let postParam = {
        START_DATE : startDate,               // 조회 기간 시작일
        END_DATE : endDate,                   // 조회 기간 종료일
        SNDNG_ID : this.SENDER.LGN_ID,         // 발송자 로그인 ID
        RECEIVE_NO : this.replaceAll(this.RECEIVE_NO),         // 수신자 번호
        SNDNG_CN : this.SNDNG_CN              // 알림톡 내용
      }

      // 페이징 정보
      let headParam = {
        head : {
          ROW_CNT : this.pagination.rowsPerPage,
          PAGES_CNT : this.pagination.page,
          PAGING : "Y",
        }
      }

      this.postCall(sUrl, postParam, headParam, this.selectAtalkSendHistoryCallback);
    },

    // setParam(){
    //   this.startD
    // },

    selectAtalkSendHistoryCallback(response){
      if(response.DATA.length > 0){
        response.DATA.forEach((data, idx) => {
          data.SEND_NO = this.mixin_setPhoneNo(data.SEND_NO.replace(/[^0-9]/g, ''));

          data.RECEIVE_NO = this.mixin_setPhoneNo(data.RECEIVE_NO.replace(/[^0-9]/g, ''));

          //알림톡 내용 메시지만 뽑아오기
          data.SEND_MSG = data.SNDNG_CN.indexOf("||title:") == -1
            ? (data.SNDNG_CN.indexOf("||attachment:") == -1
              ? data.SNDNG_CN : data.SNDNG_CN.substring(0,data.SNDNG_CN.indexOf("||attachment:")))
            : data.SNDNG_CN.substring(0,data.SNDNG_CN.indexOf("||title:")) ;

          data.SNDNG_DT_STR = data.SNDNG_DT.replaceAll('-','').replaceAll(':','').replaceAll(' ','');
        });
      }

      this.SEND_HISTORY_GRID_DATA = [...this.SEND_HISTORY_GRID_DATA, ...response.DATA];

      //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }

        //이부분은 체크해볼것
        this.pagination.page += 1
    },

    //사용자 검색
    userSearch(){
      this.showDialog("UserFind");
    },

    // 다이얼로그 보이기
    showDialog(dialogName){
      this.mixin_showDialog(dialogName);
    },
    /** 발송 이력 조회 관련 함수 끝 */

    /** 대량 발송 관련 함수 시작 */
    initSendAtalk(){
      // 알림톡 템블릿 정보 조회
      this.selectAtalkTmplList();
      // 발신자 연락처 정보 조회
      this.selectCusRprs();
    },

    selectAtalkTmplList(){
      let sUrl = "/phone-api/atalk/message/manage/atalkTmpls";
      let postParam = {
        TMPL_NAME : this.TMPL_NAME
      };
      let headParam = {head : {}};
      this.postCall(sUrl, postParam, headParam, this.selectAtalkTmplListCallback);
    },

    selectAtalkTmplListCallback(response){
      this.ATALK_TMPL_LIST = response.DATA;
    },

    // 발신자 연락처 정보 조회
    selectCusRprs(){
      if(this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO){
        const dsptchNoList = this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO.split(',');
        
        this.CUSTCO_TEL_LIST = [];
        for(let i=0; i<dsptchNoList.length; i++){
          this.CUSTCO_TEL_LIST.push(this.autoPhoneNum(dsptchNoList[i]));
        }
        this.mixin_common_code_get(this.common_code, 'CUSL_PHN_NO').forEach((data, idx) => {
          this.CUSTCO_TEL_LIST.push(this.autoPhoneNum(data.value));
        });

        this.CALLBACK_NUMBER = this.CUSTCO_TEL_LIST[0];
      }
    },

    // 연락처 형식
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

    // 템플릿 적용하기
    applyTmpl(item){
      this.SEND_MESSAGE = item.TMPL_CN;
      this.ATALK_ID = item.ATALK_ID;
      this.DSPTCH_PRF_KEY = item.DSPTCH_PRF_KEY;

      //그리드 헤더 초기화
      this.EXCEL_GRID_HEADER = [
        { text: "번호", value: "No", align: "center", width: "80", sortable : false },
        { text: "전화번호", value: "phone_number", align: "left", width: "180", sortable : false},
        { text: "비고", value: "etc", align: "left", sortable : false}
      ];

      //변수 개수 파악
      let varString = this.SEND_MESSAGE
      let regex = /#\{([^}]+)\}/g;
      let matches = [];
      let match;
      while (match = regex.exec(varString)) {
          matches.push(match[1]);
      }
      let leng = matches.length
      for(let i=0;i<leng;i++){
        this.EXCEL_GRID_HEADER.push({ text: matches[i], value: matches[i], align: "left" , sortable : false})
      }
    },

    btnExDownLoad(){
      let oHeaders = _.cloneDeep(this.EXCEL_GRID_HEADER);
      // oHeaders.splice(0, 1);
      this.mixin_common_exportExcelHeader(oHeaders, '알림톡_대량_발송_대상자_템플릿', 'sheet', '00B0F0');
    },

    /**
     * 엑셀 업로드 버튼 클릭 이벤트 처리 함수
     */
    btnExUpload(){
      this.$refs.excelRef.$refs.input.value = null
      this.$refs.excelRef.$refs.input.click();
    },

    uploadExcel(file) {

      // 업로드 휴대전화 번호 유효성 검사 결과값 초기화
      this.VALIDATE_PHONENUMBER_EXCEL_UPLOAD = true;

      // 엑셀 양식 파일에서 데이터를 읽어와 저장할 저장소
      this.EXCEL_UPLOAD_DATA = [];

      if(!file === true){
        return false;
      }
      // const fileName = file.name;
      const reader = new FileReader();

      reader.onload = () => {
        var buffer = reader.result;
        var data = new Uint8Array(buffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i){
          arr[i] = String.fromCharCode(data[i]);
        }

        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, {
          type: "binary",
          cellDates: true,
        });

        // 첫번째 시트
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        // 데이터 추출
        var getData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        getData.forEach((e,i) => {
          let phoneNumer = this.replaceAll(e.전화번호);
          if(this.VALIDATE_PHONENUMBER_EXCEL_UPLOAD){   // 대량 발송 대상자 번호 검사 결과가 유효하면
            this.VALIDATE_PHONENUMBER_EXCEL_UPLOAD = this.phoneNumberValidation(phoneNumer);
          }
          // getData[i] = {
          //   No : (e.No == "" ? "" : e.No),
          //   전화번호 : (e.전화번호 == "" ? "" : e.전화번호),
          //   비고 : (e.비고 == "" ? "" : e.비고)
          // }
          for(let n=0;n<this.EXCEL_GRID_HEADER.length;n++){
            let key = this.EXCEL_GRID_HEADER[n].text
            getData[i][key] = e[key] == "" ? "" : e[key];
          }
        });

        if(!this.VALIDATE_PHONENUMBER_EXCEL_UPLOAD){
          // 유효성 검사 통과 실패 알람
          this.showAlert(this.MESSAGE.ALERT.NOT_VALIDATE_INCLUDE_PHONENUMBER);
              setTimeout(() => {
                this.$store.commit("alertStore/hideAlert");
              }, 5000);
              return;
        }

        // 추출한 데이터가 있으면
        if (getData.length > 0) {
          getData.map(v => {
            let map = {}
            this.EXCEL_GRID_HEADER.forEach((j,i) => {
              // 그리드 헤더의 컬럼명과 엑셀 셀명칭이 같으면
              if(j.text === Object.keys(v)[i]){
                map[j.value] = v[Object.keys(v)[i]]
              }
            })
            this.EXCEL_UPLOAD_DATA.push(map);
          })
          this.getExcelData(this.EXCEL_UPLOAD_DATA);
        }
      };
      reader.readAsArrayBuffer(file);
    },

    //엑셀 업로드
    getExcelData(upload_bodys) {
      // 수신 대상 전화번호 정보 엑셀 업로드 그리드 초기화
      this.EXCEL_GRID_DATA = [];

      this.EXCEL_GRID_DATA = _.cloneDeep(upload_bodys);
      this.EXCEL_GRID_DATA.forEach(e => {
        e.NO = e.No || '';
        e.phone_number = e.phone_number || '';
        e.etc = e.etc || '';
      });
      this.EXCEL_TOTAL_CNT = this.EXCEL_GRID_DATA.length;
    },

    /**
     * 날짜 yyyy-mm-dd 형식 - (하이픈) 제거
     */
    replaceAll(date){
      return date.replace(/-/gi, "");
    },

    replaceAll2(date){
      return date.replace(/:/gi, "");
    },

    // 전화번호 유효성 검사
    phoneNumberValidation(number){
      // 휴대전화 검사 패턴
      let phoneRule = /^(01[016789]{1})[0-9]{3,4}[0-9]{4}$/;
      return phoneRule.test(number);
    },

    telNumberValidation(number){
      // 인터넷, 일반전화 검사 패턴
      let telRule = /^(070|02|0[3-9]{1}[0-9]{1})[0-9]{3,4}[0-9]{4}$/;
      return telRule.test(number);
    },

    sendAtalkValidation(){
      let isSend= true;

      if(this.CALLBACK_NUMBER == ""){
        // 발송자 번호 확인 알람
        this.showAlert(this.MESSAGE.ALERT.EMPTY_CALLBACK_NUMBER);
        isSend = false;
        return;
      }else{
        let isValidatePhoneNumber = this.phoneNumberValidation(this.replaceAll(this.CALLBACK_NUMBER));
        // let isValidateTelNumber = this.telNumberValidation(this.replaceAll(this.CALLBACK_NUMBER));
        // if(!isValidatePhoneNumber && !isValidateTelNumber){
        //   // 발송자 번호 형식 확인 알람
        //   this.showAlert(this.MESSAGE.ALERT.NOT_VALIDATE_CALLBACK_NUMBER);
        //   isSend = false;
        //   return;
        // }
      }

      if(this.EXCEL_GRID_DATA.length == 0){
        // 수신자 번호 확인 알람
        this.showAlert(this.MESSAGE.ALERT.EMPTY_PHONE_NUMBER);
        isSend = false;
        return;
      } else {
        let rtn = 'N';
        let duplePhnNo = '';
        for(let i=0;i<this.EXCEL_GRID_DATA.length;i++){
          for(let n=i+1;n<this.EXCEL_GRID_DATA.length;n++){
            if(this.EXCEL_GRID_DATA[i].phone_number == this.EXCEL_GRID_DATA[n].phone_number){
              isSend = false;
              rtn = 'Y';
              duplePhnNo = duplePhnNo + ' / ' + this.EXCEL_GRID_DATA[i].phone_number;
            }
          }
        }
        if(rtn == 'Y'){
          this.showAlert({alertDialogToggle : true, msg:'중복된 전화번호가 있습니다<br>('+duplePhnNo.replace(' / ','')+')',iconClass: 'is-info', type:'default'})
          return;
        }
      }

      if(this.SEND_MESSAGE == ""){
        // 전송 메시지 넣어달라 확인
        this.showAlert(this.MESSAGE.ALERT.EMPTY_SEND_MESSAGE);
        isSend = false;
        return;
      }

      // 전환전송 메시지 있으면
      if(this.TRANS_MESSAGE != ""){
        let messageBytes = this.checkMessageByte(this.TRANS_MESSAGE);
        if(messageBytes > 1999){
          // 발송 내용 2000바이트 초과할수 없다는 알람
          this.showAlert(this.MESSAGE.ALERT.EXCESS_SEND_MESSAGE);
          isSend = false;
          return;
        }
      }

      // 발송 컨펌
      if(isSend){
        this.showAlert(this.MESSAGE.CONFIRM.SEND);
      }
    },

    checkMessageByte(message){
      let totalByte = 0;

      for(var i =0; i < message.length; i++) {
        var currentByte = message.charCodeAt(i);
        if(currentByte > 128){
          totalByte += 2;
        }else {
          totalByte++;
        }
      }
      return totalByte;
    },

    /** 대량발송 실행 */
    sendAtalk(){
      //확인버튼 로딩
      this.$store.commit("alertStore/btnYisLoading");

      let sUrl = "/api/mts/send/sendAtalk";
      // 수신자 목록
      let data = this.EXCEL_GRID_DATA;
      let contents = [];
      let tranContents = [];
      //변수 개수 파악
      let varString = this.SEND_MESSAGE
      let regex = /#\{([^}]+)\}/g;
      let matches = [];
      let match;
      while (match = regex.exec(varString)) {
          matches.push(match[1]);
      }
      let leng = matches.length
      for(let i = 0; i < data.length; i++){
        this.PHONE_NUMBER.push(data[i].phone_number);
        for(let n=0;n<leng;n++){
          if(i == 0){
            contents.push(matches[n]);
          }
          let blank = "-"
          if(data[i][matches[n]] == undefined || data[i][matches[n]] == null){
            tranContents.push(blank);
          } else {
            tranContents.push(data[i][matches[n]]);
          }
        }
      }
      let sendDate = this.replaceAll(this.SEND_DATE) + this.replaceAll2(this.SEND_TIME);

      let postParam = {
         CALLBACK_NUMBER : this.TRAN_SEND ? this.CALLBACK_NUMBER : ''
        ,PHONE_NUMBER : this.PHONE_NUMBER
        ,SEND_DATE : sendDate+"00"
        ,SEND_INTERVAL_PEOPLE: this.SEND_INTERVAL_PEOPLE
        ,SEND_INTERVAL_MIN: this.SEND_INTERVAL_MIN
        ,ATALK_ID : this.ATALK_ID
        ,TRANS_MESSAGE : this.TRANS_MESSAGE
        ,CONTENTS: contents
        ,TRANS_CONTENTS: tranContents
        ,TENANT_ID : this.$store.getters["authStore/GE_CUSTCO_TENANT_ID"]
      }

      let headParam = {
        head : {}
      }

      this.postCall(sUrl, postParam, headParam, this.sendAtalkCallback);

    },

    sendAtalkCallback(response){
      if(response.DATA[0].DATA.code == "0000"){
        this.PHONE_NUMBER = [];
        this.EXCEL_GRID_DATA = [];
        // this.showAlert(this.MESSAGE.ALERT.SEND_SUCCESS);
        this.showToast(this.MESSAGE.TOAST.SEND_SUCCESS);
        this.closeMsg();
            // setTimeout(() => {
            //   this.$store.commit("alertStore/hideAlert");
            // }, 3000);

        // let data = {
        //   send_date: this.replaceAll(this.SEND_DATE) + this.replaceAll2(this.SEND_TIME) + "00",
        //   sender_key: this.DSPTCH_PRF_KEY,
        // }
        // this.mixin_getSndngRslt(data);
      }
    },

    showSendAtalkPreview(){
      if(this.ATALK_ID == ""){
        this.showAlert(this.MESSAGE.ALERT.CHK_APPLY_TMPL);
      }else{
        this.ATALK_MESSAGE = this.SEND_MESSAGE;
        this.PREVIEW_TITLE = "미리보기";
        this.showDialog("Preview");
      }
    },
    /** 대량 발송 관련 함수 끝 */

    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    closeDiaolog(){
      this.SELECT_GRID_ROW_ITEM = {};
      this.mixin_hideDialog('Preview');
    },

    // 알림톡 단건 전송 템플릿 조회
    async selectAtalkTmpl(){
      let item = this.SELECT_GRID_ROW_ITEM.RSLT_MSG
      let tmplCd = item.indexOf("||result:") == -1 ? item.substring(item.indexOf("||tmplCd:")+9) : item.substring(item.indexOf("||tmplCd:")+9,item.indexOf("||result:"),)
      // console.log("tmplCd", tmplCd);
      let sUrl = "/phone-api/singleAtalk/selectAtalkTemplete";
      let postParam = {
        TMPL_CD : tmplCd
      };
      let headParam = {
        head : {}
      };
      let response = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.SEND_TMPL = response.DATA[0];
      }
    },
    
    // 서버 시간 가져오기
    async getServerDate(){
      await this.mixin_getSvrDate("YYYYMMDDHH24MISS").then((data)=>{
        this.date = data;
      })
    },
  },
}
</script>

<style lang="scss" scoped>

</style>