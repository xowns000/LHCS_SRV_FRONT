<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  />
      <!-- sub content -->
      <!-- tabs -->
      <v-tabs class="pl-tabs" v-model="tab" >
        <v-tab>문자 발송이력</v-tab>
        <v-tab @click="initSendSms">문자 대량 발송</v-tab>
      </v-tabs>
      <div style="height: calc(100vh - 246px)">
        <v-tabs-items v-model="tab" class="pl-tabs-items">
          <!-- 문자 발송이력 -->
          <v-tab-item>
            <div class="pl-cols" style="height: 100%">
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
                            @keyup.enter="selectSmsSendHistory"
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
                            @keyup.enter="selectSmsSendHistory"
                          ></v-text-field>
                        </div>
                      </div>
                      <!-- <div class="pl-form-inline"> -->
                        <!-- <span class="pl-label">
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
                        </div> -->
                      <!-- </div> -->
                      <!-- <div class="pl-form-inline">
                        <span class="pl-label">
                          <v-select
                            class="pl-form "
                            :items="dropItems3"
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
                          문자 내용
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            class="pl-form is-lg"
                            placeholder="검색어 입력"
                            v-model="SNDNG_CN"
                            @keyup.enter="selectSmsSendHistory"
                          ></v-text-field>
                        </div>
                        <!-- <span class="pl-label">
                          발송 성공 여부
                        </span>
                        <div class="pl-desc">
                          <v-select
                            class="pl-form "
                            :items="dropItems"
                            placeholder="선택하세요"
                          ></v-select>
                        </div> -->
                      </div>
                      <v-btn class="pl-btn is-icon" @click="selectSmsSendHistory">
                        <span class="pl-icon20 search"></span>조회
                      </v-btn>
                    </div>
                  </div>
                </div>
                <!-- grid -->
                <div class="pl-card">
                  <div class="pl-grid-top">
                    <div class="pl-grid-top-left">
                      <!-- <v-btn class="pl-btn is-icon is-sub" @click="openSendHistoryDetail" :disabled="SELECT_GRID_ROW_ITEM.MTS_SNDNG_HSTRY_ID != undefined ? false : true">
                        <span class="pl-icon20 document"></span>
                        선택항목 상세
                      </v-btn> -->
                    </div>
                    <div class="pl-grid-top-utils">
                      <span class="pl-counter">전체 <em class="pl-1">({{ SEND_HISTORY_GRID_DATA.length }})</em> 건</span>
                      <!-- 엑셀 다운로드 버튼 -->
                      <compo-excel
                        TypeProp="Download"
                        :DownReason=true
                        :DataHeaderProp="SEND_HISTORY_GRID_HEADER"
                        :DataBodyProp="SEND_HISTORY_GRID_DATA"
                        :FileNameProp="'문자발송이력_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                        HeaderColorProp="00B0F0"
                      ></compo-excel>
                    </div>
                  </div>
                  <v-data-table
                    class="pl-grid is-hover"
                    :headers="SEND_HISTORY_GRID_HEADER"
                    :items="SEND_HISTORY_GRID_DATA"
                    fixed-header
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
                      :total-visible="7"
                      >
                    </v-pagination>

                    <!-- 더보기 다음 있을때만 노출 -->
                    <span class="pl-pager-period">보기 {{ mixin_getPagePeriod(SEND_HISTORY_GRID_DATA, page) }} / {{ SEND_HISTORY_GRID_DATA.length }}
                      <!-- <v-btn class="pl-btn is-sub"
                      :disabled = "nextDisabled"
                      @click="selectSmsSendHistory('next')"
                      >다음 검색</v-btn> -->
                      <compo-tooltip-btn
                        TitleProp="다음 검색"
                        ClassProp="pl-tooltip-btn is-line"
                        IconProp="pl-icon20 arrow-next-paging"
                        TooltipPositionProp="top"
                        :DisabledProp="nextDisabled"
                        @btnClick="selectSmsSendHistory('next')"
                      ></compo-tooltip-btn>
                    </span>
                  </div>
                </div>
              </div>
              <!-- 미리보기 -->
              <div class="is-vrt is-col-fix " style="width: 460px">
                <div class="pl-card">
                  <h2 class="pl-subtit">SMS 발송 상세정보</h2>
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
                        class="pl-phone-sample-list-wrap"
                        ref="chatContainer">
                        <div
                          v-if="SELECT_GRID_ROW_ITEM.SNDNG_CN"
                          class="pl-phone-sample-list">
                          <span class="pl-phone-sample-list-manager"></span>
                          <span
                            class="pl-phone-sample-list-text"
                            style=" white-space: pre-line; ">
                            {{ SELECT_GRID_ROW_ITEM.SNDNG_CN }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </v-tab-item>
          <!-- 문자 대량 발송 -->
          <v-tab-item>
            <div style="height: 100%">
              <!-- top search -->
              <div class="pl-card">
                <div class="pl-search-form pb-0">
                  <div class="pl-form-inline-wrap">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        탬플릿 분류
                      </span>
                      <div class="pl-desc">
                        <v-select
                          class="pl-form is-lg"
                          :items="TMPL_CLSF_SELECT"
                          v-model="TMPL_CLSF_ID"
                          placeholder="선택하세요"
                        ></v-select>
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        탬플릿 명
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          class="pl-form is-lg"
                          placeholder="검색어 입력"
                          v-model="TMPL_NAME"
                          @keyup.enter="selectSmsTmplList"
                        ></v-text-field>
                      </div>
                    </div>
                    <v-btn class="pl-btn is-icon" @click="selectSmsTmplList">
                      <span class="pl-icon20 search"></span>
                      조회
                    </v-btn>
                  </div>
                </div>
              </div>
              <!-- content -->
              <div class="pl-cols" style="height: calc(100% - 60px)">
                <!-- 문자 메시지 템플릿 -->
                <div class="is-col-fix is-vrt" style="width: 560px">
                  <!-- content -->
                  <div class="">
                    <div class="pl-card is-border">
                      <h2 class="pl-subtit">문자 메시지 템플릿
                        <span class="pl-counter ml-2">전체 <em class="pl-1">({{ SMS_TMPL_LIST.length }})</em> 건</span>
                      </h2>
                      <div class="pl-subdesc">
                        <p><strong>목록의 [적용] 버튼을 클릭</strong> 하시면 발송할 문자내용에 지정됩니다.</p>
                      </div>
                    </div>
                    <!-- template list -->
                    <div class="pl-card is-noborder pt-0" style="overflow-y: auto; height: 580px">
                      <div class="pl-msg-template-list">
                        <div
                          v-for="item in SMS_TMPL_LIST"
                          class="pl-msg-template-list-unit"
                          :class="item.SMS_TMPL_ID  === SMS_TMPL_ID ? 'selected' : ''"
                          :key="item.SMS_TMPL_ID">
                          <span class="pl-msg-template-list-title is-ellips">
                            {{ item.TMPL_PATH }} :<br>
                            <strong>{{ item.SMS_TMPL_NM }}({{ item.CD_NM }})</strong>
                          </span>
                          <div class="pl-msg-template-list-desc">
                            <div>{{ item.SMS_TMPL_CN }}</div>
                          </div>
                          <div class="ml-auto mt-2">
                            <v-btn class="pl-btn is-sub is-sm " @click="selectedTemplate(item)">적용</v-btn>
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
                        <p>발송할 <strong>문자내용을 확인</strong> 하시고 <strong>발송 대상자 엑셀파일을 업로드</strong> 하여 주십시오.</p>
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
                                :DisabledProp="IS_SEND_ATONCE"
                              />
                              <!-- :AmpmProp.sync='timeAmpm' -->
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
                              발송번호
                            </span>
                            <div class="pl-desc">
                              <!--<v-text-field class="pl-form" v-model="CALLBACK_NUMBER"/>-->
							                <v-select
                                class="pl-form"
                                :items="CUSTCO_TEL_LIST"
                                v-model="CALLBACK_NUMBER"
                                placeholder="선택하세요"
                              ></v-select>
                            </div>
                          </div>
                          <div
                            v-if = "SMS_TYPE_CD != 'TP_SMS'"
                            class="pl-form-inline"
                          >
                            <span class="pl-label">
                              문자 제목
                            </span>
                            <div class="pl-desc">
                              <v-text-field
                                class="pl-form"
                                v-model="SEND_TTL"
                              />
                            </div>
                          </div>
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              문자 내용
                              [{{ getByte(SEND_MESSAGE) }}/2000]
                            </span>
                            <div class="pl-desc">
                              <v-textarea
                                class="pl-form is-noresize"
                                height="90px"
                                v-model="SEND_MESSAGE"
                                v-byte-counter="2000"
                                :spellcheck="false"
                              />
                            </div>
                          </div>
                        </div>
                        <compo-file-grid
                          :HeaderButtonProp="false"
                          SmallTitleProp
                          :FilesProp="ATTACHED_FILE_LIST"
                          @addFile="mixin_testLog('add file')"
                          @removeFile="mixin_testLog('remove file')"
                        >
                        </compo-file-grid>
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
                            <!-- <compo-excel
                              TypeProp="Download"
                              :DataHeaderProp="EXCEL_GRID_HEADER"
                              :DataBodyProp="EXCEL_GRID_DATA"
                              FileNameProp="엑셀 다운로드"
                              SheetNameProp="sheetDown"
                            ></compo-excel> -->
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
                          class="pl-grid is-hover"
                          :headers="EXCEL_GRID_HEADER"
                          :items="EXCEL_GRID_DATA"
                          fixed-header
                          item-key="index"
                          height="422px"
                          :items-per-page="ROW_PER_PAGE2"
                          hide-default-footer
                          :page.sync="page2"
                          @page-count="pageCount2 = $event"
                          no-data-text="등록된 데이터가 없습니다."
                          >
                        </v-data-table>
                      </div>
                    </div>
                    <div class="pl-card is-bottom">
                      <div class="is-right">
                        <v-btn class="pl-btn" @click="sendSMSValidation">발송하기</v-btn>
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
    <v-dialog
      v-model="dialogSelectedDetail"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="SMS 발송 상세 정보"
        @hide="closeSendHistoryDetail"
      >
        <template slot="body">
          <div class="pl-chatting-cs-info">
            <div class="pl-chatting-cs-info-cus">
              <div>
                <strong class="pl-chatting-cs-info-tit">수신자</strong>
                <span  class="pl-chatting-cs-info-desc">{{ SELECT_GRID_ROW_ITEM.RECEIVE_NO }}</span>
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
                <span  class="pl-chatting-cs-info-desc">{{ MTS_RSTL }}</span>
              </div>
            </div>
          </div>
          <div class="pl-form-inline-wrap vertical type-2 is-mt-m">
            <div class="pl-form-inline">
              <span class="pl-label">발송 내용</span>
              <div class="pl-desc">
                <v-textarea
                  class="pl-form is-noresize"
                  v-model="SELECT_GRID_ROW_ITEM.SNDNG_CN"
                  height="500"
                  :spellcheck="false"
                  readonly
                />
              </div>
            </div>

          </div>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="closeSendHistoryDetail">닫기</v-btn>
        </template>

      </compo-dialog>
    </v-dialog>

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

  </div>
</template>

<script>
import * as XLSX from "xlsx";
export default {
    name:"MENU_CSL_M0602", //name은 'MENU_' + 파일명 조합

 components: {

  },
 data() {
    return {

      /**
       * 발송이력 조회 탭 관련 시작
       */

      // 시작 일자
      START_DATE : "",
      // 종료 일자
      END_DATE : "",
      // 시작 시간
      // START_TIME : "",
      // 종료 시간
      // END_TIME : "",

      // 사용자 검색 모달 게시 상태
      dialogUserFind: false,
      // 발송자 정보
      SENDER : [],

      // 사용자 검색 모달 관련 시작
      DropUser: {},
      // 사용자 이름 검색
      searchUsername: '',
      // 고객 이름 검색
      searchCusname: '',
      HeadersFindCus: [],
      ItemsFindCus:[],
      // 사용자 검색 모달 관련 끝

      // 수신자 번호
      RECEIVE_NO : "",
      // 문자 내용
      SNDNG_CN : "",

      // 유효성 검사 통과 불가 시 초기화 하기 위한 선택 전 시작 일자
      VALIDATE_START_OLD_DATE : "",
      // 유효성 검사 통과 불가 시 초기화 하기 위한 선택 전 종료 일자
      VALIDATE_END_OLD_DATE : "",
      // 유효성 검사를 위한 시작 일자
      VALIDATE_START_DATE : "",
      // 유효성 검사를 위한 종료 일자
      VALIDATE_END_DATE : "",

      VALIDATE_RULES:{
        START_DATE :[
          v => !!v|| '시작일자 은(는) 필수 입력 항목입니다.'
        ],
        END_DATE :[
          v => !!v|| '종료일자 은(는) 필수 입력 항목입니다.'
        ]
      },


      SEND_HISTORY_GRID_HEADER : [
        { text: "번호", value: "ROWNUM", align: "center", width: "80px", sortable : false },
        { text: "문자유형", value: "SEND_TP_NM", align: "center", width: "120px" },
        { text: "발송번호", value: "SEND_NO", align: "left", width: "120px" , sortable : false},
        { text: "발송자", value: "USER_NM", align: "left", width: "120px" , sortable : false},
        { text: "발송자 ID", value: "USER_ID", align: "left", width: "110px" , sortable : false},
        { text: "발송일시", value: "SNDNG_DT", align: "center", width: "150px" , sortable : false},
        { text: "수신번호", value: "RECEIVE_NO", align: "left", width: "120px" , sortable : false},
        { text: "발송결과", value: "RSLT_CD_NM", align: "center", width: "120px" , sortable : false},
        { text: "문자내용", value: "SNDNG_CN", align: "left", sortable : false},
        // { text: "발송이력ID", value: "MTS_SNDNG_HSTRY_ID", align: " d-none", sortable : false}
        // { text: "등록일시", value: "REG_DT", align: " d-none"}
        // { text: "발송결과 메시지", value: "RSLT_MSG", align: "center", width: "15%" },
        // { text: "문자유형코드", value: "SEND_TP", align: " d-none"},
        // { text: "발송결과코드", value: "RSLT_CD", align: " d-none"}
      ],

      // 발송 이력 그리드 데이터
      SEND_HISTORY_GRID_DATA: [],

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

      // MTS_SNDNG_HSTRY_ID : "",            // 포커싱 발송이력ID, grid row 선택 시 해당 row의 MTS_SNDNG_HSTRY_ID 지정, 상세보기 활성화 용도

      table_body:{},
      table_head:{},
      itemsRowSpan: [],

      // confirm alert 메시지
      MESSAGE : {
        CONFIRM : {
          SEND : {alertDialogToggle: true, msg: '발송하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.sendSMS, callNo: this.closeMsg}
        },
        ALERT : {
          CHK_BGNG_YMD : { alertDialogToggle: true, msg : '시작 일자를 선택하세요.',iconClass: 'is-info', type: 'default'},
          // CHK_END_YMD : { alertDialogToggle: true, msg : '종료 일자를 선택하세요.',iconClass: 'is-info', type: 'default'},
          SELECT_DATE : { alertDialogToggle : true, msg:'종료 일자는 시작 일자보다 빠를 수 없습니다.',iconClass: 'is-info', type:'default'},
          CHK_SENHIS_ROW : { alertDialogToggle : true, msg:'발송 이력 항목을 선택하세요.',iconClass: 'is-info', type:'default'},

          EMPTY_CALLBACK_NUMBER : { alertDialogToggle : true, msg:'발송자 전화번호가 없습니다.',iconClass: 'is-info', type:'default'},
          NOT_VALIDATE_CALLBACK_NUMBER : { alertDialogToggle : true, msg:'발송자 전화번호가 전화번호 형식에 맞지 않습니다.',iconClass: 'is-info', type:'default'},
          EMPTY_PHONE_NUMBER : { alertDialogToggle : true, msg:'수신자 전화번호를 업로드하세요.',iconClass: 'is-info', type:'default'},
          EMPTY_SEND_MESSAGE : { alertDialogToggle : true, msg:'발송 메시지를 입력하세요.',iconClass: 'is-info', type:'default'},
          EXCESS_SEND_MESSAGE : { alertDialogToggle : true, msg:'',iconClass: 'is-info', type:'default'},
          // LIMIT_FILE_TOTAL_SIZE : { alertDialogToggle : true, msg:'첨부파일 전체 용량은 900KB를 초과할수 없습니다.',iconClass: 'is-info', type:'default'},
          LIMIT_FILE_EACH_SIZE : { alertDialogToggle : true, msg:'첨부파일 개당 용량을 300KB 초과하는 파일이 있습니다.',iconClass: 'is-info', type:'default'},
          LIMIT_FILE_COUNT : { alertDialogToggle : true, msg:'첨부파일 개수는 3개를 초과할수 없습니다.',iconClass: 'is-info', type:'default'},
          NOT_VALIDATE_INCLUDE_PHONENUMBER : { alertDialogToggle : true, msg:'형식에 맞지 않는 휴대전화 번호가 포함되었습니다.',iconClass: 'is-info', type:'default'},

          CHANGE_SMS_SUCCESS : { alertDialogToggle : true, msg:'문자 발송을 SMS 요청으로 변경 완료 했습니다.',iconClass: 'is-info', type:'default'},
          CHANGE_MMS_SUCCESS : { alertDialogToggle : true, msg:'문자 발송을 MMS 요청으로 변경 완료 했습니다.',iconClass: 'is-info', type:'default'},
          CHANGE_LMS_SUCCESS : { alertDialogToggle : true, msg:'문자 발송을 LMS 요청으로 변경 완료 했습니다.',iconClass: 'is-info', type:'default'},
          SEND_SUCCESS : { alertDialogToggle : true, msg:'문자 발송을 완료 했습니다.',iconClass: 'is-info', type:'default'},

          TOO_MUCH_SEND : { alertDialogToggle : true, msg:'발송 대상자가 너무 많아 계속해서 처리중입니다.<br>잠시 후(약 10분) 발송 결과를 확인해주세요',iconClass: 'is-info', type:'default'}
        }
      },

      /**
       * 발송이력 조회 탭 관련 종료
       */


      /**
       * 대량등록 탭 관련 시작
       */

      DSPTCH_NO_LIST : [],
      DSPTCH_NO : "",

      // 템플릿 분류 선택박스
      TMPL_CLSF_SELECT : [],

      // 검색 조건 템플릿 분류
      TMPL_CLSF_ID : "",

      // 검색 조건 템플릿 명
      TMPL_NAME : "",

      // 엑셀 파일에서 추출한  map 형식으로 담는 객체
      EXCEL_UPLOAD_DATA:[],

      // 엑셀업로드 그리드 데이터 저장소
      EXCEL_GRID_DATA : [],

      // 엑셀 업로드 데이터 개수
      EXCEL_TOTAL_CNT: 0,

      // 엑셀업로드 그리드 헤더
      EXCEL_GRID_HEADER: [
        { text: "번호", value: "No", align: "center", width: "80" , sortable : false},
        { text: "전화번호", value: "phone_number", align: "left", width: "180", sortable : false},
        { text: "비고", value: "etc", align: "left" , sortable : false}
      ],

      // 즉시 발송 체크 여부
      IS_SEND_ATONCE : false,

      // 발송일자
      SEND_DATE : "",

      // 발송시간
      SEND_TIME : "",

      //발송 제목
      SEND_TTL:"",

      // 발송 메시지
      SEND_MESSAGE : "",


      // 발송자 번호 선택 상자
      CUSTCO_TEL_LIST : [],

      // 발송자 번호
      CALLBACK_NUMBER : "",

      // 수신자 번호
      // PHONE_NUMBER : [],

      // 발송 유형, SMS/LMS/MMS
      SMS_TYPE_CD : "",

      // SMS 템플릿 ID
      SMS_TMPL_ID : "",

      // 파일 그룹키
      FILE_GROUP_KEY : "",

      // 첨부파일 총 사이즈
      TOTAL_FILE_SIZE : 0,

      // 첨부파일 각각 사이즈
      // EACH_FILE_SIZE : "",

      // 첨부파일 개수
      // FILE_COUNT : 0,

      // 첨부파일 목록
      ATTACHED_FILE_LIST : [],

      // 개별 첨부파일 제한 용량 초과 여부
      IS_FILE_SIZE_EXCESS : false,

      // 대량발송 대상자 유효성 검사 결과
      VALIDATE_PHONENUMBER_EXCEL_UPLOAD : true,

      /**
       * 대량등록 탭 관련 종료
       */

      tab: null,

      // dialog
      dialogSelectedDetail: false,
      SMS_INFO: {
        giver: '나고객 (010-5303-4545)',
        sender: '나상담 (02-7078-2826)',
        date: '2023/01/20 13:45 35:49',
        send_text: '대전센터 주소 및 연락처 안내입니다.\n주소 : 대전광역시 대덕구 신탄진로 1 \n☎ 042-632-2220 입니다. 감사합니다. '
      },

      // 문자 발송이력
      // top search


      dropItems: [
        '전체',
        '성공',
        '실패',
      ],

      // dropItems2: [
      //   '발송자 ID',
      //   '발송자 명',
      // ],
      // dropItems3: [
      //   '수신번호',
      //   '수신자 명',
      // ],


      items: [
        {
          index: 1,
          type: '공통',
          subject: '취소수수료를 환불해 주세요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05'
        },
      ],

      // sms 템플릿 리스트
      SMS_TMPL_LIST: [
        /*{
          tracking_category: '주문 > 배송안내',
          tracking: '배송시작 안내',
          msg: '안녕하세요. [{브랜드}] 입니다.\n {고객명}님\n 주문하신 {상품명}의 배송이 시작되었습니다.\n 항상 저희 [{브랜드}]을 이용해 주셔서 감사합니다.'
        },
        {
          tracking_category: '주문 > 배송안내',
          tracking: '배송지연 안내',
          msg: '안녕하세요. [{브랜드}] 입니다.\n {고객명}님\n 주문하신 {상품명}의 배송이 배송지연되었습니다.\n 항상 저희 [{브랜드}]을 이용해 주셔서 감사합니다.'
        },
        {
          tracking_category: '주문 > 배송안내',
          tracking: '배송시작 안내',
          msg: '안녕하세요. [{브랜드}] 입니다.\n {고객명}님\n 주문하신 {상품명}의 배송이 시작되었습니다.\n 항상 저희 [{브랜드}]을 이용해 주셔서 감사합니다.'
        },
        {
          tracking_category: '주문 > 배송안내',
          tracking: '배송시작 안내',
          msg: '안녕하세요. [{브랜드}] 입니다.\n {고객명}님\n 주문하신 {상품명}의 배송이 시작되었습니다.\n 항상 저희 [{브랜드}]을 이용해 주셔서 감사합니다.'
        },
        {
          tracking_category: '주문 > 배송안내',
          tracking: '배송지연 안내',
          msg: '안녕하세요. [{브랜드}] 입니다.\n {고객명}님\n 주문하신 {상품명}의 배송이 배송지연되었습니다.\n 항상 저희 [{브랜드}]을 이용해 주셔서 감사합니다.'
        },
        */
      ],
      timeStep2: "",
      timeAmpm: '오후',
      // grid
      page2: 1,
      pageCount2: 0,
      perPage2: [15,30,50,100],
      ROW_PER_PAGE2: -1,


      items2: [
        // {
        //   index: 1,
        //   type: '공통',
        //   subject: '취소수수료를 환불해 주세요.',
        //   contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
        //   date: '2020-08-05'
        // },
      ],

      MTS_RSTL : '',  //MTS 발송결과

      // 미리보기
      TEMPLATE_PREVIEW: [
        { text: '1분간 응답이 없습니다. 상담을 시작하시려면 버튼을 클릭해주세요.', },
      ],

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
  },

  mounted() {
    // 날짜 컴퍼넌트 초기화
    this.initDatePicker();
    //서버기준 오늘날짜 가져오기
    this.getServerDate();
  },

  methods: {

    async postCall(sUrl, postParam, headParam, callbackFunction){
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        return callbackFunction(response);
      } else {
        //백엔드 호출 실패시
      }
    },

    /** 발송 이력 조회 관련 함수 시작 */

    selectSmsSendHistory(next){
      this.getServerDate();
      // this.SELECT_GRID_ROW_ITEM = {};
      //다음버튼 클릭 유무
      if (next != 'next'){
        this.SEND_HISTORY_GRID_DATA = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let sUrl = "/phone-api/sms/message/manage/sendHistory";

      // 검색조건 파라미터
      let startDate = this.START_DATE.replaceAll(/-/g, "")+"000000";
      let endDate = this.END_DATE.replaceAll(/-/g, "")+"235959";
      let postParam = {
        START_DATE : startDate,               // 조회 기간 시작일
        END_DATE : endDate,                   // 조회 기간 종료일
        SNDNG_ID : this.SENDER.LGN_ID,         // 발송자 로그인 ID
        RECEIVE_NO : this.replaceAll(this.RECEIVE_NO),         // 수신자 번호
        SNDNG_CN : this.SNDNG_CN              // 문자 내용
      }

      // 페이징 정보
      let headParam = {
        head : {
          ROW_CNT : this.pagination.rowsPerPage,
          PAGES_CNT : this.pagination.page,
          PAGING : "Y",
        }
      }

      this.postCall(sUrl, postParam, headParam, this.selectSmsSendHistoryCallback);
    },

    // setParam(){
    //   this.startD
    // },

    selectSmsSendHistoryCallback(response){
      if(response.DATA.length > 0){
        response.DATA.forEach((data, idx) => {
          data.SEND_NO = this.mixin_setPhoneNo(data.SEND_NO.replace(/[^0-9]/g, ''));

          data.RECEIVE_NO = this.mixin_setPhoneNo(data.RECEIVE_NO.replace(/[^0-9]/g, ''));
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

    /** 발송 이력 조회 관련 함수 종료 */

    initSendSms(){
      // 발송 문자 내용 초기화
      this.SEND_MESSAGE = "";
      // 대량발송 템블릿 분류 정보 조회
      this.selectSmsTmplClsfList();
      // 문자 템플릿 조회
      this.selectSmsTmplList();
      // 발신자 연락처 정보 조회
      this.selectCusRprs();
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

    // searchSmsTmplList(){
    //   // SMS 템플릿 조회
    //   this.selectSmsTmplList();
    // },

    selectSmsTmplClsfList(){
      let sUrl = "/phone-api/sms/message/manage/tmplClsfList";

      let postParam = {}

      let headParam = {
        head : {}
      }

      this.postCall(sUrl, postParam, headParam, this.selectSmstmplClsfListCallback);
    },

    selectSmstmplClsfListCallback(response){

      // 템플릿 분류 선택 박스 데이터 생성
      let tmplClsfList = (response.DATA);
      if(response.DATA.length > -1){
        let tmplClsfItem = {};
        tmplClsfItem.text = "전체";
        tmplClsfItem.value = "";
        this.TMPL_CLSF_SELECT.push(tmplClsfItem);
        for(let i = 0; i < tmplClsfList.length; i++){
          tmplClsfItem = {};
          tmplClsfItem.text = tmplClsfList[i].TMPL_PATH;
          tmplClsfItem.value = tmplClsfList[i].TMPL_CLSF_ID;
          this.TMPL_CLSF_SELECT.push(tmplClsfItem);
        }
      }
    },

    selectSmsTmplList(){
      // let sUrl = "/phone-api/sms/sendHistory/smsTmpllist";
      let sUrl = "/phone-api/sms/message/manage/tmplList";

      let postParam = {
        TMPL_CLSF_ID : this.TMPL_CLSF_ID,
        TMPL_NAME : this.TMPL_NAME
      }

      let headParam = {
        head : {}
      }

      this.postCall(sUrl, postParam, headParam, this.selectSmsTmplListCallback);
    },

    selectSmsTmplListCallback(response){
      this.SMS_TMPL_LIST = response.DATA;
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
              }, 10000);
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

  btnExDownLoad(){
    let oHeaders = _.cloneDeep(this.EXCEL_GRID_HEADER);
    // oHeaders.splice(0, 1);
    this.mixin_common_exportExcelHeader(oHeaders, '문자_대량_발송_대상자_템플릿', 'sheet', '00B0F0');
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

    /** 발송 이력 그리드 포커싱 이벤트 */
    isActiveRow(item) {
      return item.MTS_SNDNG_HSTRY_ID == this.SELECT_GRID_ROW_ITEM.MTS_SNDNG_HSTRY_ID ? "active" : "";
    },

    /** 발송 이력 그리드 클릭 이벤트 */
    gridRowselected(item){
      this.SELECT_GRID_ROW_ITEM = item;

      //기존 더블클릭 으로 팝업을 띄워 결과 받아오는 이벤트
      this.gridDbClick();
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
        // console.log("this.SELECT_GRID_ROW_ITEM.RSLT_MSG",this.SELECT_GRID_ROW_ITEM.RSLT_MSG)
        if(this.SELECT_GRID_ROW_ITEM.RSLT_CD == "0000" || this.SELECT_GRID_ROW_ITEM.RSLT_CD == "1000"){
          //발송 요청에 성공한 내역만 조회
          let MTS_RSTL_DATA = await this.mixin_getSndngRslt(this.SELECT_GRID_ROW_ITEM)
          if(MTS_RSTL_DATA.result_code == '1000' || MTS_RSTL_DATA.result_code == '0000' || MTS_RSTL_DATA.result_code == '00'){
            this.MTS_RSTL = '발송완료';
            this.SELECT_GRID_ROW_ITEM.SNDNG_DT = MTS_RSTL_DATA.real_send_date.substring(0, 4) +
              "-" +
              MTS_RSTL_DATA.real_send_date.substring(4, 6) +
              "-" +
              MTS_RSTL_DATA.real_send_date.substring(6, 8) +
              " " +
              MTS_RSTL_DATA.real_send_date.substring(8, 10) +
              ":" +
              MTS_RSTL_DATA.real_send_date.substring(10, 12) +
              ":" +
              MTS_RSTL_DATA.real_send_date.substring(12, 14);
              
            let nowPage = this.page;
            await this.selectSmsSendHistory();
            this.page = nowPage;
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
      this.mixin_showDialog("SelectedDetail");
    },

    /** 발송 이력 상세보기 닫기 */
    closeSendHistoryDetail(){
      this.mixin_hideDialog("SelectedDetail");
      this.SELECT_GRID_ROW_ITEM = {};
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

    /**
     * 엑셀 업로드 버튼 클릭 이벤트 처리 함수
     */
    btnExUpload(){
      this.$refs.excelRef.$refs.input.value = null
      this.$refs.excelRef.$refs.input.click();
    },

    /** 대량발송 템플릿 적용 */
    selectedTemplate(item){
      //그리드 헤더 초기화
      this.EXCEL_GRID_HEADER = [
        { text: "번호", value: "No", align: "center", width: "80" , sortable : false},
        { text: "전화번호", value: "phone_number", align: "left", width: "180", sortable : false},
        { text: "비고", value: "etc", align: "left" , sortable : false}
      ];

      if(this.SMS_TMPL_ID != item.SMS_TMPL_ID){
        this.SMS_TMPL_ID = item.SMS_TMPL_ID;
        this.SMS_TYPE_CD = item.SMS_TMPL_TYPE_CD;
        this.SEND_MESSAGE = item.SMS_TMPL_CN;
        this.IS_FILE_SIZE_EXCESS = false;
        this.ATTACHED_FILE_LIST = [];

        if(item.TOTAL_FILE_SIZE > 0){
          this.FILE_GROUP_KEY = item.FILE_GROUP_KEY;
          this.TOTAL_FILE_SIZE = item.TOTAL_FILE_SIZE;
          // this.EACH_FILE_SIZE = item.EACH_FILE_SIZE;
          // this.FILE_COUNT = item.FILE_COUNT;
        }else{
          this.FILE_GROUP_KEY = "";
          this.TOTAL_FILE_SIZE = 0;
          // this.EACH_FILE_SIZE = "";
          // this.FILE_COUNT = 0;
        }

        if(item.CD_NM == "MMS"){
          this.selectMmsAttachedFile();
        }

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
      }
    },

    // MMS 템플릿의 첨부파일 정보 조회
    selectMmsAttachedFile(){
      let sUrl = "/phone-api/sms/tmpl/manage/uploadFiles";
      let postParam = {
          SMS_TMPL_ID: this.SMS_TMPL_ID
        ,FILE_GROUP_KEY: this.FILE_GROUP_KEY
      }
      let headParam = {
        head: {}
      }

      this.postCall(sUrl, postParam, headParam, this.selectMmsAttachedFileCallback);

    },

    selectMmsAttachedFileCallback(response){
      let isFileSizeExcess = false;
      for(let i=0; i<response.DATA.length; i++){
        let fileSize = response.DATA[i].FILE_SZ;

        isFileSizeExcess = this.isExcessFileSize(fileSize);

        // 개별 이미지 용량 300KB 초과 여부 확인
        if(isFileSizeExcess && !this.IS_FILE_SIZE_EXCESS){
          this.IS_FILE_SIZE_EXCESS = true
        }
        this.ATTACHED_FILE_LIST.push({
          index : i,
          filename : response.DATA[i].ACTL_FILE_NM,
          filesize : this.formatBytes(response.DATA[i].FILE_SZ),
          download : true,
          count : response.DATA[i].DWNLD_CNT,
          downloadFile: response.DATA[i].ACTL_FILE_NM,
          fileGroupKey: response.DATA[i].FILE_GROUP_KEY,
          fileKey: response.DATA[i].FILE_KEY,
          busiType: response.DATA[i].TASK_TYPE_CD,
          pathType: response.DATA[i].PATH_TYPE_CD,
        });
      }

      // 개별 이미지 용량 제한 초과 여부
      if(this.IS_FILE_SIZE_EXCESS){
        // 파일 개당 사이즈 300KB 제한 알림
        this.showAlert(this.MESSAGE.ALERT.LIMIT_FILE_EACH_SIZE);
      }
    },

    // 파일 제한 용량 초과 여부
    isExcessFileSize(fileSize){
      // 300 KB 초과 여부 리턴
      let fileSizeKB = fileSize / 1024;
      if(fileSizeKB > 300){
        return true;
      }else{
        return false;
      }
    },

    // 파일크기 포맷
    formatBytes(bytes, decimals = 2) {

      if (bytes === 0) return '0 Bytes';

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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

      // let sUrl = "/phone-api/placeContact/selectCusRprsNo";
      // let postParam = {}
      // let headParam = {head : {}}

      // this.postCall(sUrl, postParam, headParam, this.selectCusRprsCallback);
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

    // 발신자 연락처 정보 조회 콜백
    // selectCusRprsCallback(response){
    //   let custcoTelListData = response.DATA;
    //   let custcoTelList;
    //   for(let i = 0; i < custcoTelListData.length; i++){
    //       custcoTelList = {};
    //       custcoTelList.text = custcoTelListData[i].RPRS_NO;
    //       custcoTelList.value = custcoTelListData[i].RPRS_NO;
    //       this.CUSTCO_TEL_LIST.push(custcoTelList);
    //     }
    // },

    /** 대량발송 실행 */
    sendSMS(){
      //확인버튼 로딩
      this.$store.commit("alertStore/btnYisLoading");

      let sUrl = "/api/mts/send/sendSMS";
      let param = [];

      // 수신자 목록
      let data = this.EXCEL_GRID_DATA;

      //변수 개수 파악
      let varString = this.SEND_MESSAGE
      let regex = /#\{([^}]+)\}/g;
      let matches = [];
      let match;
      while (match = regex.exec(varString)) {
          matches.push(match[1]);
      }
      let leng = matches.length
      let sendMsg = "";
      for(let i = 0; i < data.length; i++){
        sendMsg = varString;
        let sendSmsparam = {
          callback_number : this.CALLBACK_NUMBER
          ,phone_number : this.replaceAll(data[i].phone_number)
        };
        for(let n=0;n<leng;n++){
          sendSmsparam[`CD${n}`] = matches[n];
          sendSmsparam[`VL${n}`] = data[i][matches[n]];
        }
        param.push(sendSmsparam);
      }

      let sendDate = this.replaceAll(this.SEND_DATE) + this.replaceAll2(this.SEND_TIME);

      let postParam = {
        /*CALLBACK_NUMBER : this.CALLBACK_NUMBER
        ,PHONE_NUMBER : this.PHONE_NUMBER
        ,*/
        SMS_PARAM : JSON.stringify(param)
        ,FILE_GROUP_KEY : this.FILE_GROUP_KEY
        ,SEND_DATE : sendDate+"00"
        ,SEND_INTERVAL_PEOPLE: this.SEND_INTERVAL_PEOPLE
        ,SEND_INTERVAL_MIN: this.SEND_INTERVAL_MIN
        ,MESSAGE : this.SEND_MESSAGE
        ,TENANT_ID : this.$store.getters["authStore/GE_CUSTCO_TENANT_ID"]
        ,CD_CNT: leng //변수 개수
        ,SUBJECT : this.SEND_TTL  //문자 제목
      };

      let headParam = {
        head : {}
      };

      this.postCall(sUrl, postParam, headParam, this.sendSMSCallback);
    },

    sendSMSValidation(){

      // TODO
      /**
       * 1. 발신자 전화번호 확인
       * 2. 수신자 전화번호 확인
       * 3. 전송 메시지 입력 확인 확인
       * 4. 첨부파일 총 용량 체크 900KB 이하( file_size < 900,000)
       * 5. 각각의 첨부파일 용량 체크 (개당 300KB 이하)
       * 6. 첨부파일 개수 체크
       *
       */
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
      }else{
        let messageBytes = this.checkMessageByte(this.SEND_MESSAGE);

        if(messageBytes > 1999){
          // 발송 내용 2000바이트 초과할수 없다는 알람
          let message = "발송 메시지는 2000 바이트를 초과 할수 없습니다.";
          this.MESSAGE.ALERT.EXCESS_SEND_MESSAGE.msg = message;
          this.showAlert(this.MESSAGE.ALERT.EXCESS_SEND_MESSAGE);
          isSend = false;
          return;
        }
      }

      // if(Number(this.TOTAL_FILE_SIZE) > 900000){
      //   // 파일 총 사이즈 900KB 제한 알림
      //   this.showAlert(this.MESSAGE.ALERT.LIMIT_FILE_TOTAL_SIZE);
      //   isSend = false;
      //   return;
      // }

      /*
      if(this.EACH_FILE_SIZE != ""){
        let eachFile = this.EACH_FILE_SIZE.split(",");
        for(let i = 0; i < eachFile.length; i++){
          if(Number(eachFile[i]) > 300000){
            // 파일 개당 사이즈 300KB 제한 알림
            this.showAlert(this.MESSAGE.ALERT.LIMIT_FILE_EACH_SIZE);
            isSend = false;
            return;
          }
        }
      }
      */
     if(this.IS_FILE_SIZE_EXCESS){
      // 파일 개당 사이즈 300KB 제한 알림
      this.showAlert(this.MESSAGE.ALERT.LIMIT_FILE_EACH_SIZE);
      isSend = false;
      return;
     }

    if(this.ATTACHED_FILE_LIST.length > 3){
      // 첨부파일 개수 제한 알림
      this.showAlert(this.MESSAGE.ALERT.LIMIT_FILE_COUNT);
      isSend = false;
      return;
    }

    // 발송 컨펌
    if(isSend){
      this.showAlert(this.MESSAGE.CONFIRM.SEND);
    }
  },

    checkMessageByte(message){
      let newMessage = "";
      let totalByte = 0;
      let messageSplit = [];

      for(let i = 0; i < message.length; i++){
        let charCode = message.charCodeAt(i);
        if(charCode == 13){
          messageSplit = message.split(message[i]);
        }
      }

      if(messageSplit.length > 0){
        for(let j = 0; j < messageSplit.length; j++){
          newMessage += messageSplit[j];
        }
      }

      if(newMessage == ""){
        newMessage = message;
      }
      this.SEND_MESSAGE = newMessage;

      for(let i = newMessage.length; i > 0; i--) {
        let currentByte = newMessage.charCodeAt(i);
        if(currentByte > 128){
          totalByte += 2;
        }else {
          totalByte++;
        }
      }
      return totalByte;
    },

    sendSMSCallback(response){
      /**
       * 4. 메시지 바이트 크기 체크
       *    - LMS/첨부파일 없는 MMS가 메시지 내용이 90바이트 아래면 SMS로 보낸다는 메시지 노출
       *    - SMS가 메시지 내용이 90바이트 이상이면 LMS 전환 메시지 노출
       */

      if(response.DATA[0].DATA.code == "0000"){
        /*
        let isChangeSend = false;           // 발송 타입 전환 요청 여부
        if(this.TOTAL_FILE_SIZE > 1){       // 첨부 파일 있음
          if(this.SMS_TYPE_CD != "TP_MMS"){
            // 첨부파일 있는데 MMS 요청 아니면 MMS 전환 전송 알람
            isChangeSend = true;
            this.showAlert(this.MESSAGE.ALERT.CHANGE_MMS_SUCCESS);
            setTimeout(() => {
              this.$store.commit("alertStore/hideAlert");
            }, 3000);
          }
        }else{                              // 첨부 파일 없음
          let semdMessageBytes = checkMessageByte(this.SEND_MESSAGE);
          if(semdMessageBytes > 90 && this.SMS_TYPE_CD == "TP_SMS"){
            // 90바이트 초과 SMS 요청은 LMS 전환 알람
            isChangeSend = true;
            this.showAlert(this.MESSAGE.ALERT.CHANGE_LMS_SUCCESS);
            setTimeout(() => {
              this.$store.commit("alertStore/hideAlert");
            }, 3000);
          }else if(semdMessageBytes <= 90 && this.SMS_TYPE_CD != "TP_SMS"){
            // 90바이트 미만 SMS 이외의 요청은 SMS 전환 알람
            isChangeSend = true;
            this.showAlert(this.MESSAGE.ALERT.CHANGE_SMS_SUCCESS);
            setTimeout(() => {
              this.$store.commit("alertStore/hideAlert");
            }, 3000);
          }
        }

        if(!isChangeSend){
          // 90바이트 미만 SMS 이외의 요청은 SMS 전환 알람
            isChangeSend = true;
            this.showAlert(this.MESSAGE.ALERT.CHANGE_SMS_SUCCESS);
            setTimeout(() => {
              this.$store.commit("alertStore/hideAlert");
            }, 3000);
        }
        */

        // this.PHONE_NUMBER = [];
        this.EXCEL_GRID_DATA = [];
        this.showAlert(this.MESSAGE.ALERT.SEND_SUCCESS);
        setTimeout(() => {
          this.$store.commit("alertStore/hideAlert");
        }, 3000);


        // let data = {
        //   send_date: this.replaceAll(this.SEND_DATE) + this.replaceAll2(this.SEND_TIME) + "00",
        //   sndngSeCd: this.SMS_TYPE_CD == "TP_SMS" ? "SMS" : ( this.SMS_TYPE_CD == "TP_LMS" ? "LMS" : "MMS" )
        // }
        // this.mixin_getSndngRslt(data);
      }
    },

    //사용자 검색
    userSearch(){
      this.mixin_showDialog("UserFind");
    },

    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
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