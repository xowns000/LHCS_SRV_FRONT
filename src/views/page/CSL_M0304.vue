<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                채팅채널/분류
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="DROP_SRCH_SNDR"
                  item-text="DSPTCH_PRF_NM"
                  item-value="SNDR_KEY"
                  v-model="SRCH_SNDR"
                  placeholder="선택하세요"
                  @change="sndrSel('srch')"
                ></v-select>
              </div>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(common_code, 'CHNL_CL', '전체')"
                  v-model="SRCH_CHN_CLSF_CD"
                  :readonly="SRCH_SNDR == '' ? false : true"
                  placeholder="선택하세요"></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                구분
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(common_code, 'CHT_SRCH_TP')"
                  v-model="SRCH_TY"
                  placeholder="선택하세요"></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                조회 기간
              </span>
              <div class="pl-desc">
<!--                <div class="pl-calendar-range-form">-->
<!--                  <compo-date-picker DateType="dateInput" :DateProp.sync="startDate" />-->
<!--                  <span class="pl-unit">~</span>-->
<!--                  <compo-date-picker DateType="dateInput" :DateProp.sync="endDate" />-->
<!--                  <compo-drop-picker :StartDateProp.sync="startDate" :EndDateProp.sync="endDate" />-->
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
                상담상태
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(common_code, 'CUSL_STAT', '전체')"
                  v-model="SRCH_CUTT_STTS_CD"
                  placeholder="선택하세요"></v-select>
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
                  class="pl-form is"
                  :items="CUTT_TYPE_ITEMS"
                  v-on:change="[cuttType(),chtHstrySrch()]"
                  placeholder="상담 유형"
                  clearable
                  no-data-text="결과 없음"
                />
              </div>
            </div>
            <!-- 상담결과/상담상태 통일
            <div class="pl-form-inline">
              <span class="pl-label">
                상담결과
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="dropItems4"
                  placeholder="선택하세요"></v-select>
              </div>
            </div> -->
            <div class="pl-form-inline">
              <span class="pl-label">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(common_code, 'CUTT_HIST_SRCH')"
                  v-model="USER_SRCH_TY"
                  placeholder="선택하세요"></v-select>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form "
                  placeholder="검색어 입력"
                  @keydown.enter="chtHstrySrch()"
                  v-model="USER_SRCH"
                />
              </div>
            </div>
            <v-btn
              class="pl-btn is-icon"
              @click="chtHstrySrch()"
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
              @click="mixin_showDialog('AddSnsHistory')"
              :disabled="SEL_CHT_CUTT_ID=='' ? true : false"
            >
              <span class="pl-icon20 document"></span>
              선택항목 상세
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub" @click="[initCutt(),mixin_showDialog('AddSnsHistory')]">
              <span class="pl-icon20 circle-plus"></span>
              채팅이력 생성
            </v-btn>
            <v-btn
              class="pl-btn is-icon is-sub"
              @click="[mixin_showDialog('ChatTriple')]"
              :disabled="SEL_CHT_CUTT_ID != '' && CUTT_STTS_CD == 'ING' ? false : true"
            >
              <span class="pl-icon20 div-share"></span>
              3자 채팅
            </v-btn>
            <v-btn
              v-if="clientip === '121.67.187.114' && ($store.getters['userStore/GE_USER_ROLE'].userId === '1')"
              class="pl-btn is-icon is-sub"
              @click="[mixin_showDialog('Chbt'), chbtUserSrch()]"
            >
              <span class="pl-icon20 div-share"></span>
              챗봇내역
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
              TypeProp="Download"
              :DataHeaderProp="headers"
              :DataBodyProp="items"
              :FileNameProp="'SNS 상담이력 관리_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
              SheetNameProp="SNS 상담이력 관리"
              HeaderColorProp="00B0F0"
            ></compo-excel>
          </div>
        </div>
        <v-data-table
          class="pl-grid "
          :headers="headers"
          :items="items"
          :item-class="isActiveRow"
          fixed-header
          item-key="index"
          height="562px"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
          :page.sync="page"
          @page-count="pageCount = $event"
          @click:row="rowClick"
          no-data-text="등록된 데이터가 없습니다."
          @dblclick:row="mixin_showDialog('AddSnsHistory')"
        >
        <template v-slot:item.CUST_NM="{ item }">
          {{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(item.CUST_NM) : item.CUST_NM }}
        </template>
        <template v-slot:item.CHAT_LOG="{ item }">
          <v-btn
            class="pl-btn is-sm is-sub"
            @click="[chatHstSrch(item),mixin_showDialog('ChatLog3')]"
            :disabled="item.FORC_REG_YN == 'Y' ? true : false"
          >채팅보기
          </v-btn>
        </template>
        <template v-slot:item.CUTT_TYPE="{ item }">
          <v-tooltip content-class="pl-tooltip " bottom>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">{{ item.CUTT_TYPE.substr(item.CUTT_TYPE.indexOf('>')+1) }}</span>
            </template>
            <span>{{ item.CUTT_TYPE.substr(item.CUTT_TYPE.indexOf('>')+1) }}</span>
          </v-tooltip>
        </template>
        <template v-slot:item.CHT_USER_KEY="{ item }">
          <v-tooltip content-class="pl-tooltip " bottom>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">{{ item.CHT_USER_KEY }}</span>
            </template>
            <span>{{ item.CHT_USER_KEY }}</span>
          </v-tooltip>
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
                @btnClick="chtHstrySrch('next')"
              ></compo-tooltip-btn>
          </span>
        </div>
      </div>
    </div>
    <!-- SNS 상담 이력 생성 -->
    <v-dialog v-model="dialogAddSnsHistory" content-class="dialog-draggable is-scroll" hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog :header-title="SEL_CHT_CUTT_ID == '' ? 'SNS 상담 이력 생성' : 'SNS 상담 이력 상세 조회'" @hide="mixin_hideDialog('AddSnsHistory')">
        <template slot="body">
          <p>강제로 생성한 상담이력은 전적으로 이력을 생성하는 담당자에게 있습니다.</p>
          <p>필수 항목을 입력하신 후 <strong>[저장] 버튼을 클릭</strong>하십시오.</p>

          <v-form ref="form">
          <div class="pl-form-inline-wrap vertical is-mt-m">
            <div class="pl-form-inline">
              <span class="pl-label">
                상담 채널
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="DROP_SNDR"
                  item-text="DSPTCH_PRF_NM"
                  item-value="SNDR_KEY"
                  v-model="SNDR_KEY"
                  placeholder="선택하세요"
                  @change="sndrSel('reg')"
                  :rules="validateRules.SNDR_KEY"
                  :disabled="SEL_CHT_CUTT_ID == '' ? false : true"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                채널 분류
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(common_code, 'CHNL_CL')"
                  v-model="CHN_CLSF_CD"
                  :rules="validateRules.CHN_CLSF_CD"
                  readonly
                  placeholder="선택하세요"></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                상담 유형
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                  <v-select v-for="(cuttType, idx) in CUTT_TYPE_VMODEL_ARR" :key="idx"
                  v-model="CUTT_TYPE_VMODEL_ARR[idx]"
                  class="pl-form"
                  :items="getChildCuttTypeItems(idx, idx===0?'':CUTT_TYPE_VMODEL_ARR[idx-1])"
                  item-text = "CUTT_TYPE_NM"
                  item-value = "CUTT_TYPE_ID"
                  placeholder="선택하세요"
                  style="flex: 0 0 100%;"
                  v-on:change="changeCuttTypeItems(idx)"
                />
                </div>
            </div>
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
                :rules="validateRules.SRCH_USER"
               ></v-text-field>
               <!-- 찾기 버튼 -->
              <compo-tooltip-btn
                TitleProp="고객 찾기"
                ClassProp="pl-tooltip-btn flex-grow-0"
                IconProp="pl-icon20 in-search"
                TooltipPositionProp="bottom"
                @btnClick="userSearch()"
                :DisabledProp="SEL_CHT_CUTT_ID == '' ? false : true"
              ></compo-tooltip-btn>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                상담 시작일시
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <compo-date-picker
                  DateType="dateTime"
                  :DateProp.sync="startDateTime"
                  :TimesProp.sync='startDatetimeStep'
                  :DisabledProp="SEL_CHT_CUTT_ID == '' ? false : true"
                  />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                상담 종료일시
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <compo-date-picker
                  DateType="dateTime"
                  :DateProp.sync="endDateTime"
                  :TimesProp.sync='endDatetimeStep'
                  :DisabledProp="SEL_CHT_CUTT_ID == '' ? false : true"
                  />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                고객 정보
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
               <v-text-field
                v-model="SRCH_CUST.CUST_NM"
                class="pl-form flex-grow-1"
                placeholder="우측의 찾기 아이콘을 클릭 하십시오"
                disabled
                :rules="validateRules.SRCH_CUST"
               ></v-text-field>
               <!-- 찾기 버튼 -->
              <compo-tooltip-btn
                TitleProp="고객 찾기"
                ClassProp="pl-tooltip-btn flex-grow-0"
                IconProp="pl-icon20 in-search"
                TooltipPositionProp="bottom"
                @btnClick="cusSearch()"
                :DisabledProp="SEL_CHT_CUTT_ID == '' ? false : true"
              ></compo-tooltip-btn>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                처리 결과
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(common_code, 'CUSL_STAT')"
                  v-model="CUTT_STTS_CD"
                  placeholder="선택하세요"
                  :rules="validateRules.CUTT_STTS_CD"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                상담 내용
                <v-icon 
                  class="pl-icon20"
                  :class="CUTT_CN_VALID == 'Y' ? 'required' : ''"
                  ></v-icon>
              </span>
              <div class="pl-desc">
                <v-textarea
                  class="pl-form is-noresize"
                  height="90px"
                  placeholder="상담 내용을 입력하십시오."
                  v-model="CUTT_CN"
                  :spellcheck="false"
                  v-byte-counter="4000"
                />
              </div>
            </div>
          </div>
          </v-form>
          <ul class="pl-list-info">
            <li>처리결과가 [완료] 상태인 이력만 수정/저장이 가능합니다.</li>
          </ul>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="closeDialog">닫기</v-btn>
          <v-btn
            v-if = "SEL_CHT_CUTT_ID == ''"
            class="pl-btn"
            @click="showAlert(MESSAGE.CONFIRM.REG)"
            :disabled="CUTT_STTS_CD.indexOf('CMPL') == -1 ? true : false"
          >저장</v-btn>
          <v-btn
            v-if = "SEL_CHT_CUTT_ID != ''"
            class="pl-btn"
            @click="showAlert(MESSAGE.CONFIRM.MDFCN)"
            :disabled="CUTT_STTS_CD.indexOf('CMPL') == -1 ? true : false"
          >수정</v-btn>
        </template>

      </compo-dialog>
    </v-dialog>
    <!-- 대화내용 -->
    <v-dialog
      v-model="dialogChatLog3"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="대화내용"
        @hide="mixin_hideDialog('ChatLog3')"
      >
        <template slot="body">
          <!-- component -->
          <compo-chatting
            v-if="CHAT_LOG_VIEW_MODE == 'CHAT'"
            :ChatLogProp="CHAT_LOG"
            :BfrChatLogProp="[]"
          />
          <compo-chat-log-email
            v-if="CHAT_LOG_VIEW_MODE == 'EMAIL'"
            :DataProp="{'CHT_CUTT_ID': SEL_CHT_CUTT_ID}"
          />
          <compo-chat-log-bbs
            v-if="CHAT_LOG_VIEW_MODE == 'BBS'"
            :ChatLogProp="CHAT_LOG"
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
          <v-btn class="pl-btn" @click="mixin_hideDialog('CusFind')">확인</v-btn>
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
          <v-btn class="pl-btn" @click="mixin_hideDialog('UserFind')">확인</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- 3자 채팅 -->
    <v-dialog
      v-model="dialogChatTriple"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="3자 채팅"
        @hide="mixin_hideDialog('ChatTriple')"
      >
        <template slot="body">
          <!-- component -->
          <compo-chatting
            :ChatLogProp="CHAT_LOG"
            :BfrChatLogProp="[]"
            HeightProp="457px"
          />
          <div class="pl-chat-input is-mt-m flex-grow-1">
            <div class="pl-chat-input-text-wrap">
              <v-textarea
                class="pl-form is-noresize"
                height="70px"
                v-model="MSG"
                :spellcheck="false"
                @keydown="keyDown"
                @keyup="keyUp"
              />
              <!-- 채팅 보내기 버튼 -->
              <compo-tooltip-btn
                TitleProp="채팅 보내기"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon30 chat-send"
                TooltipPositionProp="bottom"
                @btnClick="sendMsg('msg')"
              ></compo-tooltip-btn>
            </div>
          </div>
        </template>
      </compo-dialog>
    </v-dialog>
    
    <!-- 챗봇내역 -->
    <v-dialog
      v-model="dialogChbt"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="pl-card-wrap">
        <!-- sub top -->
        <compo-sub-layout-top  >
          <template slot="search">
            <div class="pl-form-inline-wrap">
              <div class="pl-form-inline">
                <span class="pl-label">
                  채팅채널/분류
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    :items="mixin_common_code_get(common_code, 'CHNL_CL', '전체')"
                    v-model="SRCH_CHN_CLSF_CD"
                    placeholder="선택하세요"></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  채팅고객key
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form "
                    placeholder="검색어 입력"
                    @keydown.enter="chbtUserSrch()"
                    v-model="USER_SRCH"
                  />
                </div>
              </div>
              <v-btn
                class="pl-btn is-icon"
                @click="chbtUserSrch()"
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
              
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1">({{ chbtItems.length }})</em> 건</span>
            </div>
          </div>
          <v-data-table
            class="pl-grid "
            :headers="chbtHeaders"
            :items="chbtItems"
            :item-class="chbtIsActiveRow"
            fixed-header
            item-key="index"
            height="520px"
            :items-per-page="CHBT_ROW_PER_PAGE"
            hide-default-footer
            :page.sync="chbtPage"
            @page-count="chbtPageCount = $event"
            @click:row="chbtRowClick"
            no-data-text="등록된 데이터가 없습니다."
          >
          <template v-slot:item.CUST_NM="{ item }">
            {{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(item.CUST_NM) : item.CUST_NM }}
          </template>
          <template v-slot:item.CHBT_LOG="{ item }">
            <v-btn
              class="pl-btn is-sm is-sub"
              @click="[getChbtUserHsty(item),mixin_showDialog('ChbtLog')]"
            >챗봇내역
            </v-btn>
          </template>
          </v-data-table>
          <div class="pl-pager">
            <div class="pl-pager-row">
              <span>페이지당 항목 수</span>
              <v-select
                class="pl-form"
                :value="CHBT_ROW_PER_PAGE"
                :items="chbtPerPage"
                :item-text="toString(CHBT_ROW_PER_PAGE)"
                @change="CHBT_ROW_PER_PAGE = parseInt($event, 10);"
              ></v-select>
            </div>
            <v-pagination
              v-model="chbtPage"
              :length="chbtPageCount"
              circle
              :total-visible="7">
            </v-pagination>

            <span class="pl-pager-period">
              보기 {{ mixin_getPagePeriod(chbtItems, chbtPage) }} / {{ chbtItems.length }}
                <compo-tooltip-btn
                  TitleProp="다음 검색"
                  ClassProp="pl-tooltip-btn is-line"
                  IconProp="pl-icon20 arrow-next-paging"
                  TooltipPositionProp="bottom"
                  :DisabledProp = "chbtNextDisabled"
                  @btnClick="chbtUserSrch('next')"
                ></compo-tooltip-btn>
            </span>
          </div>
        </div>
      </div>
      <!-- 대화내용 -->
      <v-dialog
        v-model="dialogChbtLog"
        content-class="dialog-draggable"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="대화내용"
          @hide="mixin_hideDialog('ChbtLog')"
        >
          <template slot="body">
            <!-- component -->
            <compo-chatting
              :ChatLogProp="[]"
              :BfrChatLogProp="[]"
              :chbtProp = "CHBT_INFO"
            />
          </template>
        </compo-dialog>
      </v-dialog>
    </v-dialog>
  </div>
</template>

<script>
import { stompUtil } from "@/store/stomp-util.js";

let stomeReConnectCnt = 36;

export default {
    name:"MENU_CSL_M0304", //name은 'MENU_' + 파일명 조합

  components: {

  },
  data() {
    return {
      //공통코드
      common_code:[],

      // top search
      DROP_SRCH_SNDR:[],        //채팅채널 드롭박스
      SRCH_SNDR:'',             //채팅채널
      nowDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      startDate: this.$moment(this.nowDate).subtract(7,'days').format('YYYY-MM-DD'),
      endDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      SRCH_TY:'ALTMNT_RDY_REG_DT',        //조회구분
      SRCH_CHN_CLSF_CD:'',      //채널분류
      SRCH_CUTT_STTS_CD:'',     //상담상태
      USER_SRCH_TY:'CUST_NM',   //사용자검색구분 => 상담이력 검색구분
      USER_SRCH:'',             //사용자검색어 => 상담이력 검색어

      // dialog 대화내역 보기
      dialogChatLog3:false,
      CHAT_LOG:[],              //채팅내역
      //채팅내역 보기 모드 - 채팅 : CHAT, 이메일 : EMAIL, 게시판 : BBS
      CHAT_LOG_VIEW_MODE: 'CHAT',

      // dialog 상담이력생성 = 상담 상세
      dialogAddSnsHistory: false,
      DROP_SNDR:[],             //채팅채널 드롭박스
      SNDR_KEY: '',             //채팅채널
      CHN_CLSF_CD:'',           //채널분류
      CHT_USER_KEY: '',         //채팅고객key
      CUTT_ITEMS:[],            //상담유형 전체데이터
      ITGRT_USE_YN:'',          //통합여부
      CUTT_TYPE_LMT_LVL_CD:'',  //상담유형 레벨
      CUTT_TYPE_VMODEL_ARR:[],  //상담유형 v-model
      CUTT_TYPE_ID:'',          //선택 상담유형
      startDateTime: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      startDatetimeStep: '00:00',
      endDateTime: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      endDatetimeStep: '00:00',
      timeAmpm: '오후',
      CUTT_STTS_CD:'CMPL',      //처리결과
      CUTT_CN:'',               //채팅내용

      SEL_CHT_CUTT_ID:'',       //선택 채팅ID

      //3자채팅
      dialogChatTriple: false,
      MSG:'',                 //메시지
      KEYDOWN:'',         //메시지 입력창 키입력 감지

      //사용자검색 모달
      dialogUserFind: false, //사용자 검색 모달
      DropUser:{},
      HeadersFindCus:[],
      ItemsFindCus:[],
      searchUsername:'',
      SRCH_USER:{
        USER_NM:'',
        USER_ID:''
      },

      //고객검색 모달
      dialogCusFind: false, //고객 검색 모달
      DropCus:{},
      HeadersFindCus:[],
      ItemsFindCus:[],
      searchCusname:'',
      SRCH_CUST:{
        CUST_ID:'',
        CUST_NM:'',
      },

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
      headers: [
        { text: '번호', value: 'ROW_NUMBER', width: '80px', align: 'center',sortable : false },
        { text: '채팅채널', value: 'SNDR_NM', width: '150px' ,sortable : false},
        { text: '채널분류', value: 'CHN_CLSF_NM', width: '100px' ,sortable : true},
        //{ text: '채널타입', value: 'subject'},
        { text: '상담원명', value: 'CUSL_NM', width: '120px' ,sortable : false},
        { text: '고객ID', value: 'CHT_USER_KEY', width: '100px' ,sortable : false},
        { text: '고객명', value: 'CUST_NM', width: '120px' ,sortable : false},
        { text: '상담상태', value: 'CUTT_STTS_NM', width: '120px' ,sortable : false},
        { text: '상담유형', value: 'CUTT_TYPE',sortable : false},
        { text: '상담요청일시', value: 'NEW_ALTMNT_RDY_REG_DT', width: '150px' ,sortable : false},
        { text: '상담시작일시', value: 'NEW_CUTT_BGNG_DT', width: '150px' ,sortable : false},
        { text: '상담종료일시', value: 'NEW_CUTT_END_DT', width: '150px',sortable : false },
        { text: '상담이력등록일시', value: 'NEW_CUTT_HSTRY_REG_DT', width: '150px' ,sortable : false},
        { text: '채팅내역', value: 'CHAT_LOG', width: '100px',sortable : false },
      ],
      items: [],

      pagination: {
            page: 1,
            rowsPerPage: 500,
            sortBy: "",
            descending: ""
          }, //그리드 페이지속성정의
      nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼

      SEL_ITEM:{},

      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
          REG : {alertDialogToggle: true, msg: '상담이력을 저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.cuttStrg, callNo: this.closeMsg}
          , MDFCN: {alertDialogToggle: true, msg: '상담이력을 수정하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.cuttStrg, callNo: this.closeMsg}
        },
        ALERT : {
          REG_SUCCESS : {alertDialogToggle: true, msg: '상담이력이 저장되었습니다', iconClass: 'is-info', type: 'default'}
          , MDFCN_SUCCESS : {alertDialogToggle: true, msg: '상담이력이 수정되었습니다', iconClass: 'is-info', type: 'default'}
          , CHAT_END : {alertDialogToggle: true, msg: '상담이 종료되었습니다', iconClass: 'is-info', type: 'default'}
          , VALID : {alertDialogToggle: true, msg: '필수항목 확인 후<br>재시도 해주세요', iconClass: 'is-info', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST : {
          REG_SUCCESS: {  msg: '상담이력이 저장되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 },
          MDFCN_SUCCESS: {  msg: '상담이력이 수정되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
        },
      },

      //필수값 체크
      valid : true,
      validateRules: {
        SNDR_KEY: [
          v => !!v || '상담채널 은(는) 필수 입력 항목입니다.',
        ],
        CHN_CLSF_CD: [
          v => !!v || '채널분류 은(는) 필수 입력 항목 입니다.',
        ],
        SRCH_USER: [
          v => !!v || '상담직원 은(는) 필수 입력 항목 입니다.',
        ],
        CUTT_TYPE_ID: [
          v => !!v || '상담유형 은(는) 필수 입력 항목 입니다.',
        ],
        SRCH_CUST: [
          v => !!v || '고객 정보 은(는) 필수 입력 항목 입니다.',
        ],
        CUTT_STTS_CD: [
          v => !!v || '처리결과 은(는) 필수 입력 항목 입니다.',
        ],
      },

      FBDWD_YN: '', //금칙어 적용여부
      TRIPLE_ALRAM_YN: '',    //3자채팅 알림 사용 여부
      SHOW_QSTN:'', //고객이 선택한 문의유형 보기 여부
      CUTT_CN_VALID:'', //상담내용 필수여부

      TRIPLE_LIST:[],         //3자채팅중인 채팅 리스트 (3자채팅 알림 메시지가 중복으로 나가지 않게 하기 위함)

      SCH_CUTT_TYPE : {},     //상담유형검색조건
      SCH_CUTT_TYPE_VAL: '',
      CUTT_TYPE_ITEMS : [],

      // 챗봇 내역 다이얼로그
      dialogChbt:false,
      dialogChbtLog:false,
      CHAT_LOG:[],              //채팅내역
      CHBT_INFO:[],
      clientip : null,
      
      chbtHeaders: [
        { text: '채팅채널', value: 'SNDR_NM', width: '150px' ,sortable : false},
        { text: '채널분류', value: 'CHN_CLSF_NM', width: '100px' ,sortable : true},
        { text: '고객ID', value: 'CHT_USER_KEY', width: '100px' ,sortable : false},
        { text: '고객명', value: 'CUST_NM', width: '120px' ,sortable : false},
        { text: '챗봇내역', value: 'CHBT_LOG', width: '100px',sortable : false },
      ],
      chbtItems: [],
      chbtPage: 1,
      chbtPageCount: 0,
      chbtPerPage: [15,30,50,100],
      CHBT_ROW_PER_PAGE: 15,
      chbtPagination: {
            page: 1,
            rowsPerPage: 500,
            sortBy: "",
            descending: ""
          }, //그리드 페이지속성정의
      chbtNextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
    }
  },

  watch: {
    dialogChatTriple() {
      if(this.dialogChatTriple){
        this.chatHstSrch(
          {
            CHT_CUTT_ID : this.SEL_CHT_CUTT_ID,
            CUST_ID : this.SRCH_CUST.CUST_ID,
          }
        )
        this.setChatUserInfo();
      } else {
        this.MSG = '';
        // this.disconnect();
      }
    }
  },

  computed: {

  },

  beforeDestroy(){

  },

  //공통코드 사용시 async-await 필수 (mixin_common_code_get_all함수로 공통코드 리스트를 가지고 오기 전에 mixin_common_code_get이벤트 발생)
  async created() {
    //공통코드설정
    let codeName = ['CHT_SRCH_TP','CHNL_CL','CUSL_STAT','CUTT_HIST_SRCH'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    //시작일자 일주일 세팅
    this.startDate = this.$moment(this.nowDate).subtract(7,'days').format('YYYY-MM-DD');

    this.selectSender();
    this.chtHstrySrch();
    this.cuttTypeSrch();

    /**
     * 3자채팅 메시지 인입
     */
    this.$eventBus.$on("busThirdInoutCallback", (message) => {
      this.chatHstSrch({
        CHT_CUTT_ID : this.SEL_CHT_CUTT_ID,
        CUST_ID : this.SRCH_CUST.CUST_ID,
      });

      let recvJson = JSON.parse(message.body);
      let destArray = message.headers.destination.split("/")

      //상담 종료 또는 고객 무응답을 받았을 때
      //무응답은 error_msg=메시지 내용
      if(recvJson.chatEvent == "EXPIRED_SESSION_CUST"){
        //message.headers.subscription.unsubscribe();
        if(recvJson.userId == this.SRCH_USER.USER_ID){
          this.mixin_hideDialog('ChatTriple');
          //this.showAlert(this.MESSAGE.ALERT.CHAT_END);
          this.showAlert({alertDialogToggle: true, msg: recvJson.userKey + '님과의 상담이 종료되었습니다', iconClass: 'is-info', type: 'default'});
          this.chtHstrySrch();

          //3자채팅 알림 메시지 보내기 (중복방지)
          if(this.TRIPLE_ALRAM_YN == 'Y'){
            let leng = this.TRIPLE_LIST.length;
            for(let i=0;i<leng;i++){
              if(this.TRIPLE_LIST[i] == recvJson.userKey){
                this.TRIPLE_LIST.splice(i);
                break;
              }
            }
          }
        }
      }
    });

    this.FBDWD_YN = await this.mixin_getChtStng('PROHIBITE_APPLY_YN');
    this.SHOW_QSTN = await this.mixin_getChtStng('INQRY_SHOW_YN');
    this.CUTT_CN_VALID = await this.mixin_getChtStng('CUTT_CN_VALID');

    this.getCuttTypeList();//상담 유형

    fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(response => {
      this.clientip = response.ip;
    });


    //브라우저 종료 시 이벤트
    //브라우저 강제 종료 시 웹소켓 연결 끊기
    window.addEventListener('beforeunload', (event) => {
      //웹소켓 disconnect
      this.disconnect();
    });
  },

  async mounted() {
    this.TRIPLE_ALRAM_YN = await this.mixin_getChtStng('CONSULT_ALRAM_YN');
  },

  methods: {
    //상담이력 조회
    async chtHstrySrch(next){
      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.items = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
        this.initCutt();          //선택상담 초기화
      }

      let convertSchKeyword = this.USER_SRCH;
      if(this.USER_SRCH_TY === 'CUST_PHN_NO') convertSchKeyword = convertSchKeyword.replace(/[^0-9]/g, '');

      let sUrl = '/chat-api/history/manage/list';
      let postParam = {
        SRCH_TY: this.SRCH_TY,
        ST_DT: this.startDate.replaceAll("-","")+'000000',
        END_DT: this.endDate.replaceAll("-","")+'999999',//끝날짜 999999가 붙지 않으면 당일 00시00분00초이므로 전날까지 조회됨
        CHN_CLSF_CD: this.SRCH_CHN_CLSF_CD,
        CUTT_STTS_CD: this.SRCH_CUTT_STTS_CD,
        USER_SRCH_TY: this.USER_SRCH_TY,
        USER_SRCH: convertSchKeyword,
        SNDR_KEY: this.SRCH_SNDR,
        CUTT_TYPE_ID: this.SCH_CUTT_TYPE_VAL
      }
      let headParam = {
        head: {
          "ROW_CNT" : this.pagination.rowsPerPage,
          "PAGES_CNT" : this.pagination.page,
          "PAGING" : "Y",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        for(let k in resData.DATA){
          resData.DATA[k].NEW_ALTMNT_RDY_REG_DT = this.mixin_convertDate(resData.DATA[k].ALTMNT_RDY_REG_DT, 'yyyy-MM-dd HH:mm:ss');
          resData.DATA[k].NEW_CUTT_BGNG_DT = this.mixin_convertDate(resData.DATA[k].CUTT_BGNG_DT, 'yyyy-MM-dd HH:mm:ss');
          resData.DATA[k].NEW_CUTT_END_DT = this.mixin_convertDate(resData.DATA[k].CUTT_END_DT, 'yyyy-MM-dd HH:mm:ss');
          resData.DATA[k].NEW_CUTT_HSTRY_REG_DT = this.mixin_convertDate(resData.DATA[k].CUTT_HSTRY_REG_DT, 'yyyy-MM-dd HH:mm:ss');
        }

        let tempDataText = resData.DATA;
        //this.items = tempDataText;
        this.items = [...this.items, ...tempDataText]
        //다음
        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 resData.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(resData.HEADER.next !== null && resData.HEADER.next !== undefined){
          if(resData.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }

        //이부분은 체크해볼것
        this.pagination.page += 1
        // this.page=1;
      }
    },

    //로우 클릭시 색상 변경
    isActiveRow(item) {
      const activeClass = item.CHT_CUTT_ID == this.SEL_CHT_CUTT_ID ? "active" : "";
      return activeClass;
    },

    //로우 클릭이벤트
    rowClick(item){
      this.SEL_ITEM = item;

      this.SEL_CHT_CUTT_ID = item.CHT_CUTT_ID;
      this.SNDR_KEY = item.SNDR_KEY;
      this.CHN_CLSF_CD = item.CHN_CLSF_CD;
      this.CUTT_TYPE_ID = item.CUTT_TYPE_ID;
      this.SRCH_USER = {
        USER_ID: item.CUSL_ID,
        USER_NM: item.CUSL_NM
      };
      this.SRCH_CUST = {
        CUST_ID: item.CUST_ID,
        CUST_NM: item.CUST_NM
      };
      this.startDateTime = this.mixin_convertDate(item.CUTT_BGNG_DT, 'yyyy-MM-dd');
      this.startDatetimeStep =
        item.CUTT_BGNG_DT.slice(-6,(item.CUTT_BGNG_DT.length - 2)).slice(0,2) + ':' + item.CUTT_BGNG_DT.slice(-6,(item.CUTT_BGNG_DT.length - 2)).slice(-2);
      this.endDateTime = this.mixin_convertDate(item.CUTT_END_DT, 'yyyy-MM-dd');
      this.endDatetimeStep =
        item.CUTT_END_DT.slice(-6,(item.CUTT_END_DT.length - 2)).slice(0,2) + ':' + item.CUTT_END_DT.slice(-6,(item.CUTT_END_DT.length - 2)).slice(-2);
      this.CUTT_STTS_CD = item.CUTT_STTS_CD;
      this.CUTT_CN = item.CUTT_CN;

      if(this.CUTT_TYPE_ID){
        this.selCuttTypeSrch();
      } else {
        this.cuttTypeSrch();
        this.CUTT_TYPE_ID='';          //선택 상담유형
      }

      this.CHT_USER_KEY = item.CHT_USER_KEY;
    },

    //채팅 내역 조회
    async chatHstSrch(item){
      this.CHAT_LOG_VIEW_MODE = 'CHAT';
      let sUrl = '/chat-api/main/cnslt-cn/inqire';
      let postParam = {
        CHT_CUTT_ID: item.CHT_CUTT_ID,
        CUST_ID: item.CUST_ID,
        CUTT_STTS_CD: 'CMPL',
        CHT_RDY_ID: '',
        CHT_USER_KEY : this.CHT_USER_KEY,
        SNDR_KEY : this.SNDR_KEY,
        CHN_CLSF_CD : this.CHN_CLSF_CD,
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.chat_postCall(sUrl, postParam, headParam)
      if(!resData.header.ERROR_FLAG){
        this.CHAT_LOG = [];
        let msgTypeCd = '';
        let leng = resData.data.length;
        for(let i=0;i<leng;i++){
          let chatDate = this.mixin_convertDate(resData.data[i]["REG_DT"], 'yyyy-MM-dd HH:mm:ss')
          //고객이 선택한 문의유형을 보는것으로 설정하였다면
          if(this.SHOW_QSTN == 'Y'){
            if(resData.data[i]["MSG_TYPE_CD"] != 'EMAIL' && resData.data[i]["MSG_TYPE_CD"] != 'BBS'){
              if(resData.data[i]["MSG_TYPE_CD"] == 'INFOMSG' && msgTypeCd != 'INFOMSG'){
                this.CHAT_LOG.push(
                  {
                    TYPE: resData.data[i+1]["MSG_TYPE_CD"],
                    SNDRCV_CD: resData.data[i+1]["RCPTN_DSPTCH_CD"],
                    IMAGE_URL: resData.data[i+1]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i+1]["RCPTN_DSPTCH_MSG"] : resData.data[i+1]["RCPTN_DSPTCH_MSG"],
                    CONTENT: this.FBDWD_YN == 'Y'
                      ? resData.data[i+1]["CHG_RCPTN_DSPTCH_MSG"]
                      : resData.data[i+1]["RCPTN_DSPTCH_MSG"],
                    CHAT_DATE: chatDate,
                    QSTN_TYPE_NM: resData.data[i+1]["QSTN_TYPE_NM"],
                    QSTN_TYPE_MSG: resData.data[i+1]["QSTN_TYPE_MSG"],
                    QSTN_BTN_LIST: resData.data[i+1]["BTN_LIST"].split('||'),
                    RSVT_BTN_LIST: resData.data[i+1]["RSVT_BTN"].split('||')
                  },
                )
                msgTypeCd = 'INFOMSG';
              } else if (resData.data[i]["MSG_TYPE_CD"] == 'QSTN' && msgTypeCd == 'INFOMSG') {
                this.CHAT_LOG.push(
                  {
                    TYPE: resData.data[i-1]["MSG_TYPE_CD"],
                    SNDRCV_CD: resData.data[i-1]["RCPTN_DSPTCH_CD"],
                    IMAGE_URL: resData.data[i-1]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i-1]["RCPTN_DSPTCH_MSG"] : resData.data[i-1]["RCPTN_DSPTCH_MSG"],
                    CONTENT: this.FBDWD_YN == 'Y'
                      ? resData.data[i-1]["CHG_RCPTN_DSPTCH_MSG"]
                      : resData.data[i-1]["RCPTN_DSPTCH_MSG"],
                    CHAT_DATE: chatDate,
                    QSTN_TYPE_NM: resData.data[i-1]["QSTN_TYPE_NM"],
                    QSTN_TYPE_MSG: resData.data[i-1]["QSTN_TYPE_MSG"],
                    QSTN_BTN_LIST: resData.data[i-1]["BTN_LIST"].split('||'),
                    RSVT_BTN_LIST: resData.data[i-1]["RSVT_BTN"].split('||')
                  },
                )
                msgTypeCd = '';
              } else {
                this.CHAT_LOG.push(
                  {
                    TYPE: resData.data[i]["MSG_TYPE_CD"],
                    SNDRCV_CD: resData.data[i]["RCPTN_DSPTCH_CD"],
                    IMAGE_URL: resData.data[i]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i]["RCPTN_DSPTCH_MSG"] : resData.data[i]["RCPTN_DSPTCH_MSG"],
                    CONTENT: this.FBDWD_YN == 'Y'
                      ? resData.data[i]["CHG_RCPTN_DSPTCH_MSG"]
                      : resData.data[i]["RCPTN_DSPTCH_MSG"],
                    CHAT_DATE: chatDate,
                    QSTN_TYPE_NM: resData.data[i]["QSTN_TYPE_NM"],
                    QSTN_TYPE_MSG: resData.data[i]["QSTN_TYPE_MSG"],
                    QSTN_BTN_LIST: resData.data[i]["BTN_LIST"].split('||'),
                    RSVT_BTN_LIST: resData.data[i]["RSVT_BTN"].split('||')
                  },
                )
              }
            } else if(resData.data[i]["MSG_TYPE_CD"] == 'EMAIL') {
              this.changeEmailCuttMode(resData.data[i]);
            } else if(resData.data[i]["MSG_TYPE_CD"] == 'BBS') {
              this.changeBbsCuttMode(resData.data[i]);
            }
          } else {
            if(resData.data[i]["MSG_TYPE_CD"] != 'QSTN' && resData.data[i]["MSG_TYPE_CD"] != 'EMAIL'&& resData.data[i]["MSG_TYPE_CD"] != 'BBS'){
              this.CHAT_LOG.push(
                {
                  TYPE: resData.data[i]["MSG_TYPE_CD"],
                  SNDRCV_CD: resData.data[i]["RCPTN_DSPTCH_CD"],
                  IMAGE_URL: resData.data[i]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i]["RCPTN_DSPTCH_MSG"] : resData.data[i]["RCPTN_DSPTCH_MSG"],
                  CONTENT: this.FBDWD_YN == 'Y'
                    ? resData.data[i]["CHG_RCPTN_DSPTCH_MSG"]
                    : resData.data[i]["RCPTN_DSPTCH_MSG"],
                  CHAT_DATE: chatDate,
                },
              )
            } else if(resData.data[i]["MSG_TYPE_CD"] == 'EMAIL') {
              this.changeEmailCuttMode(resData.data[i]);
            } else if(resData.data[i]["MSG_TYPE_CD"] === 'BBS') {
              this.changeBbsCuttMode(resData.data[i]);
            }
          }
        }
      }
    },

    //고객사 발신프로필(채팅채널)조회
    selectSender() {
      this.$api.post("/chat-api/main/getSender/inqire",   //api url입력
      {
      },
      {head: {
      }})
      .then((response) => {
        if(response.data.DATA.length > 0){
          this.DROP_SNDR = response.data.DATA;
          this.SNDR_KEY = this.DROP_SNDR[0].SNDR_KEY;
          this.CHN_CLSF_CD = this.DROP_SNDR[0].CHN_CLSF_CD;

          this.DROP_SRCH_SNDR = response.data.DATA;
          this.DROP_SRCH_SNDR.unshift(
            {
              SNDR_KEY:'',
              DSPTCH_PRF_NM:'전체',
              SNDR_KEY:'',
            }
          )
        }
      })
      .catch((err) => {
        alert(err);
      })
    },

    //채팅 채널 선택 이벤트
    sndrSel(type){
      let leng = this.DROP_SRCH_SNDR.length
      for(let i=0;i<leng;i++){
        if(type == 'srch'){
          // console.log("here", this.DROP_SRCH_SNDR);
          if(this.DROP_SRCH_SNDR[i].SNDR_KEY == this.SRCH_SNDR){
            this.SRCH_CHN_CLSF_CD = this.DROP_SRCH_SNDR[i].CHN_CLSF_CD
          }
        } else if(type == 'reg'){
          // console.log("here", this.DROP_SNDR);
          if(this.DROP_SNDR[i].SNDR_KEY == this.SNDR_KEY){
            this.CHN_CLSF_CD = this.DROP_SNDR[i].CHN_CLSF_CD
          }
        }
      }
    },

    //상담유형 목록 조회
    async cuttTypeSrch() {
      let sUrl = '/api/setting/cuttType/cuttTypeTreeList';
      let postParam = {
      }

      let headParam = {
        head : {
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);
      if (!resData.HEADER.ERROR_FLAG){
        //상담유형 정보
        if(resData.CUTT_TYPE_SETTING){
          this.ITGRT_USE_YN = resData.CUTT_TYPE_SETTING[0].ITGRT_USE_YN;
          this.CUTT_TYPE_LMT_LVL_CD = resData.CUTT_TYPE_SETTING[0].CUTT_TYPE_LMT_LVL_CD;
        }

        this.CUTT_ITEMS = resData.DATA;

        for(let i=0;i<parseInt(this.CUTT_TYPE_LMT_LVL_CD);i++){
          this.CUTT_TYPE_VMODEL_ARR[i] = '';//초기화
        }
      }
    },

    //상담유형 하위 item 가져오기
    getChildCuttTypeItems(idx, parentItem) {
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
    changeCuttTypeItems(idx){
      // console.log("idx", idx);
      this.CUTT_TYPE_ID = this.CUTT_TYPE_VMODEL_ARR[idx];
      for(let k=0; k<this.CUTT_TYPE_VMODEL_ARR.length; k++){
        if(k > idx) this.CUTT_TYPE_VMODEL_ARR[k] = '';//초기화
      }
    },

    //사용자 검색
    userSearch(){
      // this.searchUsername = this.TOP_UTIL.searchUsername;
      this.mixin_showDialog('UserFind');
    },

    //고객 검색
    cusSearch(){
      // this.searchCusname = this.TOP_UTIL.searchCusname;
      this.mixin_showDialog('CusFind');
    },

    //상담이력 저장
    async cuttStrg() {
      if (!this.validate()) {
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }

      if(this.CUTT_CN_VALID == 'Y' && !this.CUTT_CN){
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }

      let sUrl = '/chat-api/main/cnslt-hist/regist-force';
      let postParam = {
        CHT_CUTT_ID:this.SEL_CHT_CUTT_ID,
        SNDR_KEY:this.SNDR_KEY,
        CHN_CLSF_CD:this.CHN_CLSF_CD,
        CUTT_TYPE_ID:this.CUTT_TYPE_ID,
        ST_DT:(this.startDateTime + this.startDatetimeStep + '00').replaceAll("-","").replaceAll(":","").replaceAll(" ",""),
        END_DT:(this.endDateTime + this.endDatetimeStep + '00').replaceAll("-","").replaceAll(":","").replaceAll(" ",""),
        CUTT_STTS_CD:this.CUTT_STTS_CD,
        CUTT_CN:this.CUTT_CN,
        CUSL_ID:this.SRCH_USER.USER_ID,
        CUST_ID:this.SRCH_CUST.CUST_ID,
      }
      let headParam = {
        head : {
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);
      if (!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        this.mixin_hideDialog('AddSnsHistory');
        if(this.SEL_CHT_CUTT_ID == ''){
          // this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS);
          this.showToast(this.MESSAGE.TOAST.REG_SUCCESS);
          this.closeMsg();
        } else {
          // this.showAlert(this.MESSAGE.ALERT.MDFCN_SUCCESS);
          this.showToast(this.MESSAGE.TOAST.MDFCN_SUCCESS);
          this.closeMsg();
        }
        this.initCutt();
        this.chtHstrySrch();
      }
    },
    closeMsg(){
      this.$store.commit("alertStore/hideAlert");
    },

    //선택 이력 초기화
    initCutt(){
      this.cuttTypeSrch();
      this.CUTT_TYPE_ID='';          //선택 상담유형
      this.startDateTime =  (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
      this.startDatetimeStep =  '00:00';
      this.endDateTime =  (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
      this.endDatetimeStep =  '00:00';
      this.CUTT_STTS_CD = 'CMPL';      //처리결과
      this.CUTT_CN = '';               //채팅내용

      this.SRCH_USER ={
        USER_NM:'',
        USER_ID:''
      };
      this.SRCH_CUST ={
        CUST_ID:'',
        CUST_NM:'',
      };
      this.SEL_CHT_CUTT_ID = '';       //선택 채팅ID
    },

    //필수값 체크
    validate () {
      return this.$refs.form.validate();
    },

    //상담유형 가져오기
    async selCuttTypeSrch(){
      let sUrl = '/chat-api/main/selCuttTypeSrch';
      let postParam = {
        CUTT_TYPE_ID:this.CUTT_TYPE_ID,
        CUTT_TYPE_LMT_LVL_CD: this.CUTT_TYPE_LMT_LVL_CD,
      }
      let headParam = {
        head : {
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);
      if (!resData.HEADER.ERROR_FLAG){
        //json형태로 선택한 상담유형과 상위 상담유형정보를 가져옴
        let selCuttTypeObj = resData.DATA[0];
        let selCuttTypeLeng = Object.keys(selCuttTypeObj).length;

        //json형태의 상담유형정보를 array로 만들어줌
        let selCuttTypeArr = [];
        //마지막 데이터는 고객사 기본데이터이기 때문에 불필요
        for(let i=0;i<selCuttTypeLeng;i++){
          selCuttTypeArr[i] = selCuttTypeObj[i];
        }
        selCuttTypeArr.reverse();

        //상담유형정보 세팅
        //1레벨은 [고객사명]이므로 필요없음
        let leng = selCuttTypeArr.length
        for(let n=0;n<leng-1;n++){
          this.CUTT_TYPE_VMODEL_ARR[n] = selCuttTypeArr[n+1];
          this.changeCuttTypeItems(n)
        }
      }
    },

    //챗 사용자정보 세팅 =>
    async setChatUserInfo() {
      let sUrl = '/api/stomp/chat/userinfo';
      let postParam = {
        USER_NM: this.$store.getters["userStore/GE_USER_ROLE"].userName
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.chat_postCall(sUrl, postParam, headParam)
      if(resData.error != "-999"){
        this.$store.state.messages.token = resData.token;
        this.$store.state.messages.userId = resData.id;
        this.$store.state.messages.userNm = resData.name;
        this.connect(); // ready websocket 연결
      } else {
        this.showAlert(this.MESSAGE.ALERT.ERROR);
      }
    },

    /**
     * websocket connect
     * @param connectCallback   연결 성공 콜백
     * @param errorCallback     연결 실패 콜백 ( 재연결 시도 )
     */
    connect() {
      let geUserId = this.SRCH_USER.USER_ID;

      //const subScribeUrl = this.baseSocketUrl + "queue/ready/" + geUserId;                //"http://local.hkpalette.com:8443/queue/ready/"
      let subScribeUrl = "/queue/ready/" + geUserId;

      let chatMessage = {
        chatType: "READY",
        userId: geUserId,
        userName: geUserId,
        userNickname: geUserId,
        "CERT-CUSTCO-TENANT-ID": this.$store.getters["authStore/GE_CUSTCO_TENANT_ID"],
      };

      stompUtil.token = this.$store.state.messages.token; //SOCKET 연결 시 사용자 SOCKET Token 세팅
      stompUtil.userId = geUserId;
      stompUtil.custcoId = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;
      stompUtil.lgnId = this.$store.getters["userStore/GE_USER_ROLE"].lgnId;
      stompUtil["CERT-CUSTCO-TENANT-ID"] = this.$store.getters["authStore/GE_CUSTCO_TENANT_ID"];

      const eventBus = this.$eventBus;

      stompUtil.connect(
        () => {
          // 연결성공( 재연결 포함 )
          stompUtil.setConnected(true);
          stompUtil.subscribe(subScribeUrl, chatMessage); // ready uri sub

          // eventBus.chtListSrch();
          this.chatSubList();

          //3자채팅 알림 메시지 보내기
          if(this.TRIPLE_ALRAM_YN == 'Y'){
            let newTriple = 'Y';    //신규 3자채팅인지 (3자채팅 알림 중복발송 방지)
            let leng = this.TRIPLE_LIST.length;
            for(let i=0;i<leng;i++){
              if(this.TRIPLE_LIST[i] == this.SEL_ITEM.CHT_USER_KEY){
                newTriple = 'N'
                break;
              }
            }
            if(newTriple == 'Y'){
              this.MSG = '3자채팅이 시작됩니다';
              this.sendMsg('msg');
              this.TRIPLE_LIST.push(this.SEL_ITEM.CHT_USER_KEY);
            }
          }
          this.MSG = '';
        },
        (error) => {
          //연결실패

          if (error != null) {
            // console.log(error);
            stompUtil.setConnected(false);

            if( stomeReConnectCnt > 0 ) {  // 재연결 시도
              // 재연결 시도
              setTimeout(this.connect, 5000);
              --stomeReConnectCnt;
            }
          }
        }
      );
    },

    /**
     * 웹소켓 연결종료
     * Stomp / Socket-Io
     */
    disconnect() {
      if (stompUtil.isConnected()) {
        stompUtil.setConnected(false);
        stompUtil.disconnect();
      }
    },

    //채팅 보내기
    sendMsg(type, item){
      let msgcopy = this.MSG;
      let MSG_INFO = [];
      let chatmsg = {};

      if(type == 'msg'){
        if (msgcopy.replace(/(?:\r\n|\r|\n)/g, "").length === 0) {
          return false;
        }
        if(msgcopy.length < 1000){
          MSG_INFO[0] = {
            msg: msgcopy,
            message_type: "TX",
            SNDRCV_CD: "SND",
            type: "message",
          };
        } else if(msgcopy.length >= 1000){
          let ARR_NUM = (msgcopy.length / 1000) + 1;
          for(let i=0;i<ARR_NUM;i++){
            MSG_INFO[i] = {
            msg: msgcopy.substring((i*1000), 1000),
            message_type: "TX",
            SNDRCV_CD: "SND",
            type: "message",
          };
          }
        }
      } else if(type == 'endLink'){
        MSG_INFO[0] = {
          msg: '종료버튼 메시지는 시스템 메시지에서 가져옴',
          message_type: "LI",
          SNDRCV_CD: "SND",
          type: "chatClose",
        };
      } else if(type == 'img'){
        MSG_INFO[0] = {
          message_type : 'IM'
          , SNDRCV_CD: 'SND'
          , type : 'image'
          , image : item.FILE_PATH + "/" + item.STRG_FILE_NM
          , msg : item.FILE_PATH + "/" + item.STRG_FILE_NM
          , CONTENT : item.FILE_PATH + "/" + item.STRG_FILE_NM
          , IMAGE_TALK_PATH : item.FILE_PATH + "/" + item.STRG_FILE_NM
          , FILE_GROUP_KEY : item.FILE_GROUP_KEY
          , FILE_KEY : item.FILE_KEY
        };
      } else if(type == 'end'){
        MSG_INFO[0] = {
          message_type : 'TX'
          , SNDRCV_CD: 'SND'
          , type : 'message'
          , msg : '상담 종료'
          , consultEnd : 'Y'
        };
      }

      let CHAT_INFO = {
        SEND_USER_NM: this.$store.getters["userStore/GE_USER_ROLE"].userName,
        token: this.$store.state.messages.token,
        userId: this.$store.getters["userStore/GE_USER_ROLE"].userId,
        chtCuttId: this.SEL_ITEM.CHT_CUTT_ID,
        sndrKey: this.SEL_ITEM.SNDR_KEY,
        chnClsfCd: this.SEL_ITEM.CHN_CLSF_CD,
        custcoId: this.$store.getters["userStore/GE_USER_ROLE"].company.CD,
        sndrUserNm: this.SEL_ITEM.CUST_NM,
        custId: this.SEL_ITEM.CUST_ID,
        chtUserKey: this.SEL_ITEM.CHT_USER_KEY
      };

      let msgObj = this.$store.getters["messages/GE_CONTACT_MSG"]({
        chtCuttId: CHAT_INFO.chtCuttId,
      });

      for(let n=0;n<MSG_INFO.length;n++){
        chatmsg[n] = this.$store.getters["messages/GE_MSG_OBJ"]({
          user_key: CHAT_INFO.custId,
          sndrcv_cd: "snd",
          type: MSG_INFO[n].message_type,
          content: MSG_INFO[n].msg,
          chtCuttId: CHAT_INFO.chtCuttId,
          IMAGE_TALK_PATH:
          MSG_INFO[n].IMAGE_TALK_PATH != "" ? MSG_INFO[n].IMAGE_TALK_PATH : "",
          FILE_GROUP_KEY:
          MSG_INFO[n].FILE_GROUP_KEY != "" ? MSG_INFO[n].FILE_GROUP_KEY : "",
          FILE_KEY: MSG_INFO[n].FILE_KEY != "" ? MSG_INFO[n].FILE_KEY : "",
          FILE_BLOB: MSG_INFO[n].FILE_BLOB != "" ? MSG_INFO[n].FILE_BLOB : "",
          FILE_EXTS: MSG_INFO[n].FILE_EXTS != "" ? MSG_INFO[n].FILE_EXTS : "",
          //, SEND_USER_NM : Vue.prototype.store.state.messages.userNm
          SEND_USER_NM: CHAT_INFO.sndrUserNm,
          SEND_USER_SHORT_NM: "나",
          consultEnd: MSG_INFO[n].consultEnd,
          CUSTCO_ID: CHAT_INFO.custcoId,
        });

        stompUtil.sendMessage(MSG_INFO[n], CHAT_INFO, chatmsg[n], msgObj);
      }

      // this.$eventBus.chtListSrch();
      this.chatHstSrch({
        CHT_CUTT_ID : this.SEL_ITEM.CHT_CUTT_ID,
        CUST_ID : this.SEL_ITEM.CUST_ID,
      });

      this.MSG ='';
    },
    closeDialog(){
      this.mixin_hideDialog('AddSnsHistory');
      this.SEL_ITEM = {};
    },

    //엔터키로 채팅 보내기(줄바꿈 해제)
    //추후 단축키 기능 추가
    //키를 눌렀을때 입력 키를 저장하고 뗄 때 이벤트 발생
    keyDown(e) {
      let type = '';
      if(e.key == 'Alt'){
        type = 'alt'
      } else if(e.key == 'Shift'){
        type = 'shift'
      } else if(e.key == 'Control'){
        type = 'ctrl'
      }
      let KEY_ARR = this.KEYDOWN.split('+')
      if(e.key == 'Alt'){
        for(let i=0;i<KEY_ARR.length;i++){
          if(KEY_ARR[i] == type){
            return
          }
        }
        if(this.KEYDOWN == ''){
          this.KEYDOWN = 'alt'
        } else {
          this.KEYDOWN = this.KEYDOWN + '+alt';
        }
      } else if(e.key == 'Shift'){
        for(let i=0;i<KEY_ARR.length;i++){
          if(KEY_ARR[i] == type){
            return
          }
        }
        if(this.KEYDOWN == ''){
          this.KEYDOWN = 'shift'
        } else {
          this.KEYDOWN = this.KEYDOWN + '+shift';
        }
      } else if(e.key == 'Control'){
        for(let i=0;i<KEY_ARR.length;i++){
          if(KEY_ARR[i] == type){
            return
          }
        }
        if(this.KEYDOWN == ''){
          this.KEYDOWN = 'ctrl'
        } else {
          this.KEYDOWN = this.KEYDOWN + '+ctrl';
        }
      } else if (e.key == 'Enter'){
        // console.log("this.KEYDOWN", this.KEYDOWN);
        if(this.KEYDOWN == 'shift'){
        } else {
          e.preventDefault();
          this.sendMsg('msg');
        }
      } else if(e.key == 'Process'){
      } else {
        if(this.KEYDOWN.indexOf('alt') != -1 || this.KEYDOWN.indexOf('shift') != -1 || this.KEYDOWN.indexOf('ctrl') != -1 ){
          this.KEYDOWN = this.KEYDOWN + '+' + e.key;
          this.$eventBus.searchScriptShortKey(this.KEYDOWN, this.CLK_CUST);
        } else {
          this.KEYDOWN = this.KEYDOWN + '+' + e.key;
        }
      }
    },
    keyUp(e){
      let type = '';
      if(e.key == 'Alt'){
        type = 'alt'
      } else if(e.key == 'Shift'){
        type = 'shift'
      } else if(e.key == 'Control'){
        type = 'ctrl'
      } else if(e.key == 'Enter'){
      }
      let KEY_ARR = this.KEYDOWN.split('+')
      this.KEYDOWN = '';
      for(let i=0;i<KEY_ARR.length;i++){
        if(KEY_ARR[i] == type){
          KEY_ARR[i] = '';
        } else if(KEY_ARR[i] == e.key){
          KEY_ARR[i] = '';
        }
      }
      for(let i=0;i<KEY_ARR.length;i++){
        if(this.KEYDOWN == ''){
          if(KEY_ARR[i] != ''){
            this.KEYDOWN = KEY_ARR[i]
          }
        } else {
          if(KEY_ARR[i] != ''){
            this.KEYDOWN = this.KEYDOWN + '+' + KEY_ARR[i];
          }
        }
      }
    },

    //채팅 구독 리스트에 넣기
    async chatSubList(){
      let sUrl = '/chat-api/main/cnslt/cuttTriple';
      let postParam = {
        CHT_CUTT_ID: this.SEL_ITEM.CHT_CUTT_ID
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.chat_postCall(sUrl, postParam, headParam)
      if(!resData.header.ERROR_FLAG){
        //구독 리스트에 있어야 메시지 받았을 때 해당 채팅방 정상 조회 가능
        this.$store
          .dispatch("messages/AC_INIT_TALK_LIST", resData.data)
          .then(() => {
          });
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

    //선택한 상담유형의 value값 가져오기
    cuttType(){
      this.SCH_CUTT_TYPE_VAL = this.SCH_CUTT_TYPE.value;
    },




    //
    //
    //챗봇 확인용

    //상담이력 조회
    async chbtUserSrch(next){
      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.chbtItems = [];
        this.chbtPagination.page = 1; //페이징 처리 초기화
        this.chbtNextDisabled = true;  //버튼 비활성화
        this.chbtInitChbt();          //선택상담 초기화
      }

      let convertSchKeyword = this.USER_SRCH;

      let sUrl = '/chat-api/main/getChbtUser';
      let postParam = {
        CHN_CLSF_CD: this.SRCH_CHN_CLSF_CD,
        CHT_USER_KEY: convertSchKeyword,
      }
      let headParam = {
        head: {
          "ROW_CNT" : this.chbtPagination.rowsPerPage,
          "PAGES_CNT" : this.chbtPagination.page,
          "PAGING" : "Y",
        }
      }

      let resData = await this.chat_postCall(sUrl, postParam, headParam)
      if(!resData.header.ERROR_FLAG){
        let tempDataText = resData.data;
        //this.items = tempDataText;
        this.chbtItems = [...this.chbtItems, ...tempDataText]
        //다음
        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 resData.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(resData.header.next !== null && resData.header.next !== undefined){
          if(resData.header.next === true){
            this.chbtNextDisabled = false //버튼 활성화
          }else{
            this.chbtNextDisabled = true  //버튼 비활성화
          }
        }

        //이부분은 체크해볼것
        this.chbtPagination.page += 1
        // this.page=1;
      }
    },

    //로우 클릭 이벤트
    chbtRowClick(item){
      this.CHT_USER_KEY = item.CHT_USER_KEY;
      this.CHN_CLSF_CD = item.CHN_CLSF_CD;
    },

    //로우 클릭시 색상 변경
    chbtIsActiveRow(item) {
      const activeClass = item.CHT_USER_KEY == this.CHT_USER_KEY ? "active" : "";
      return activeClass;
    },

    //선택상담 초기화
    chbtInitChbt(){
      this.CHT_USER_KEY = '';
      this.CHN_CLSF_CD = '';
    },

    async getChbtUserHsty(item){
      // console.log("item", item);
      let sUrl = '/chat-api/main/getChbtUserHsty';
      let postParam = {
        CHT_USER_KEY: item.CHT_USER_KEY,
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.chat_postCall(sUrl, postParam, headParam)
      if(!resData.header.ERROR_FLAG){
        let chbtInfo = [];
        let chatDate = '';
        let compList = [];
        let content = '';
        if(resData.data.length > 0){
          if(item.CHN_CLSF_CD == 'NAVER'){
            let leng = resData.data.length
            for(let i=0;i<leng;i++){
              chatDate = this.mixin_convertDate(resData.data[i]["MESSAGE_ID"].substr(0, 14), 'yyyy-MM-dd HH:mm:ss')
              compList = [];
              if(resData.data[i]["TYPE"] == 'composite'){
                let compLeng = resData.data[i]["CONTENT"]["compositeList"].length;
                for(let n=0;n<compLeng;n++){
                  let cardLeng = resData.data[i]["CONTENT"]["compositeList"][n]["elementList"]["data"].length
                  if(cardLeng != 0){
                    compList[n] = {
                      CONTENT: resData.data[i]["CONTENT"]["compositeList"][n]["description"]
                      , PRICE: resData.data[i]["CONTENT"]["compositeList"][n]["elementList"]["data"][0]["subDescription"]
                      , DATE: resData.data[i]["CONTENT"]["compositeList"][n]["elementList"]["data"][0]["description"]
                      , PRODICTION: resData.data[i]["CONTENT"]["compositeList"][n]["elementList"]["data"][0]["title"]
                      , IMAGE: resData.data[i]["CONTENT"]["compositeList"][n]["elementList"]["data"][0]["image"]["imageUrl"]
                    }
                  } else {
                    compList[n] = {
                      CONTENT: resData.data[i]["CONTENT"]["compositeList"][n]["description"]
                      , PRICE: ""
                      , DATE: ""
                      , PRODICTION: ""
                      , IMAGE: ""
                    }
                  }
                }
              } else {
                compList[0] = {
                  CONTENT: resData.data[i]["CONTENT"]
                }
              }
              chbtInfo[i] ={
                SNDRCV_CD: resData.data[i]["SENDER"] == 'customer' ? 'RCV' : 'SND',
                CHAT_DATE: chatDate,
                CONTENT: compList
              }
            }
          } else {
            for(let n=0;n<resData.data.length;n++){
              chatDate = this.mixin_convertDate(resData.data[n]["MESSAGE_ID"].substr(0, 14), 'yyyy-MM-dd HH:mm:ss')
              chbtInfo.push({
                SNDRCV_CD: 'RCV',
                CHAT_DATE: chatDate,
                CONTENT: [{CONTENT: resData.data[n]["CONTENT"]["utterance"]}]
              })

              if(resData.data[n]["CONTENT"]["messages"].length > 2){
                chbtInfo.push({
                  SNDRCV_CD: 'SND',
                  CHAT_DATE: chatDate,
                  CONTENT: [
                    {
                      CONTENT: resData.data[n]["CONTENT"]["messages"][0]["text"]
                    }
                  ]
                })
                let leng = resData.data[n]["CONTENT"]["messages"][1]["cards"].length;
                compList = [];
                for(let i=0;i<leng;i++){
                  compList[i] = {
                    CONTENT: resData.data[n]["CONTENT"]["messages"][1]["cards"][i]["title"]
                    , PRICE: resData.data[n]["CONTENT"]["messages"][1]["cards"][i]["price"]["regularPrice"] + resData.data[n]["CONTENT"]["messages"][1]["cards"][i]["price"]["currencyUnit"]
                    , DATE: resData.data[n]["CONTENT"]["messages"][1]["cards"][i]["commerceTitle"]
                    , PRODICTION: resData.data[n]["CONTENT"]["messages"][1]["cards"][i]["profile"]["name"]
                    , IMAGE: resData.data[n]["CONTENT"]["messages"][1]["cards"][i]["imageUrl"]
                  }
                }
                chbtInfo.push({
                  SNDRCV_CD: 'SND',
                  CHAT_DATE: chatDate,
                  CONTENT: compList
                })
              } else {
                chbtInfo.push({
                  SNDRCV_CD: 'SND',
                  CHAT_DATE: chatDate,
                  CONTENT: [
                    {
                      CONTENT: resData.data[n]["CONTENT"]["messages"][0]["cards"] 
                        ? resData.data[n]["CONTENT"]["messages"][0]["cards"][0]["description"] 
                        : resData.data[n]["CONTENT"]["messages"][0]["text"]
                    }
                  ]
                })
              }
            }
          }
        }
        this.CHBT_INFO = chbtInfo;
      }
    },


    /**
     * 채팅보기 - 이메일 상담 모드로 보기
     */
    changeEmailCuttMode(emailCuttInfo) {
      this.CHAT_LOG_VIEW_MODE = 'EMAIL';
    },

    /**
     * 채팅보기 - 게시판 상담 모드로 보기
     */
    changeBbsCuttMode(bbsCuttInfo) {
      this.CHAT_LOG_VIEW_MODE = 'BBS';
      this.CHAT_LOG.push(bbsCuttInfo)
    },
    
    //챗봇 확인용
    //
    //
  },
}
</script>

<style lang="scss" scoped>

</style>