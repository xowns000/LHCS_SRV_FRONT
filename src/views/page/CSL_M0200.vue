<template>
  <div
    class="pl-container pl-cols type-mainchat"
    style="grid-template-columns: 26fr 39fr 38fr;">
    <!-- 상담 목록 -->
    <mainchat-cus-list
      ref="cusListCompo"
      :DataProp="chat_list_data"
      :demoVideoMode="demoVideoMode"
      @detail="mixin_testLog('상세')"
      @refresh="mixin_testLog('새로고침')"
      class="pl-mainchat-cs-list pl-card-wrap is-col-fix"
      @input="chat_list_data = $event"
      @clickChatList="[chatDtlSrch(),getCustDefaultInfo()]"
      @changeUserChtStat="setChatUserInfo()"
    />
    <!-- 채팅창 -->
    <div class="pl-card-wrap" style="position: relative;">
      <div class="pl-card-top" style="height: 87.5px;">
        <div v-if="Object.keys(CHAT_TOP_INFO).length != 0">
          <strong
            class="pl-card-top-title">
            <template v-if="CHAT_CUTT_MODE === 'CHAT'">
              {{ (mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(CHAT_TOP_INFO.cus_name) : CHAT_TOP_INFO.cus_name) }}님과의 {{ CHAT_TOP_INFO.talk_ch }} 대화
            </template>
            <template v-if="CHAT_CUTT_MODE === 'EMAIL'">
              {{ (mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(CHAT_TOP_INFO.cus_name) : CHAT_TOP_INFO.cus_name) }}님과의 이메일 상담
            </template>
            <template v-if="CHAT_CUTT_MODE === 'BBS'">
              {{ (mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(CHAT_TOP_INFO.cus_name) : CHAT_TOP_INFO.cus_name) }}님과의 게시판 상담
            </template>
            <!-- <v-icon
              class="pl-icon20 ml-2"
              @click="bmkStrg()"
              :class="CHAT_TOP_INFO.favortie ? 'favorite-on' : 'favorite'">
            </v-icon> -->
            <div
              @click="bmkStrg"
              style="position: relative; cursor: pointer;">
              <vLottiePlayer
                name="lottieFavorite"
                :autoplay=false
                width="60px"
                height="60px"
                style="position: absolute; top: -29px; left: -13px;"
                :animationData="require('@/assets/lottie/animation_favorite.json')"
                @animControl="anim => (lottieFavorite = anim)"
            />
          </div>
          </strong>
          <div class="d-flex align-center">
            <strong
              :class="`pl-round-chip is-sm chat-stat-${chat_list_data.CLK_DATA.STTS_CD}`">
              {{ displayStatus(chat_list_data.CLK_DATA.STTS_CD) }}
            </strong>
            <span class="ml-2">요청일시 ({{ CHAT_TOP_INFO.date }})</span>
          </div>
        </div>
        <div v-else>
          <strong
            class="pl-card-top-title">
            <template v-if="CHAT_CUTT_MODE === 'CHAT'">
              성명미상
            </template>
          </strong>
        </div>
        <div class="pl-btn-wrap ml-auto align-self-start">
          <v-tooltip content-class="pl-tooltip " bottom :disabled="CHAT_STAT !== 'ING'">
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-switch
                  v-model="SYSTEM_MSG_STAT"
                  @click="sysMsgOnOff()"
                  :disabled="CHAT_STAT == 'ING' ? false : true">
                </v-switch>
              </div>
            </template>
            <span>시스템메시지 발송 상태를 {{ SYSTEM_MSG_STAT ? 'OFF' : 'ON'}}으로 설정합니다</span>
          </v-tooltip>
          <!-- 영상통화  -->
          <compo-tooltip-btn
            v-if="mixin_getCustcoSrvcStat('VIDEO')"
            :DisabledProp="CUST_INFO.CUST_ID != undefined && CUST_INFO.CUST_ID > -1?false:true"
            TitleProp="영상통화"
            ClassProp="pl-tooltip-btn is-blue"
            IconProp="pl-icon20 main-video"
            TooltipPositionProp="bottom"
            @btnClick="FnDemoVideoMode()"
          ></compo-tooltip-btn>
          <!-- VOC -->
          <compo-tooltip-btn
            :DisabledProp="CUST_INFO.CUST_ID != undefined && CUST_INFO.CUST_ID > -1?false:true"
            TitleProp="VOC"
            ClassProp="pl-tooltip-btn is-blue"
            IconProp="pl-icon20 main-talk"
            TooltipPositionProp="bottom"
            @btnClick="mixin_showDialog('Voc')"
          ></compo-tooltip-btn>
          <!-- VOC dialog -->
          <v-dialog
            v-model="dialogVoc"
            content-class="dialog-draggable is-lg is-nopadding"
            hide-overlay>
            <div class="draggable-area">drag area</div>
            <compo-dialog
              header-title="VOC 접수"
              @hide="mixin_hideDialog('Voc')"
            >
              <template slot="body">
                <!-- component -->
                <compo-voc
                  ref="vocDataCompo"
                  :CHNL="SetChnlProp"
                  :CUST_ID="CUST_INFO.CUST_ID"
                  :VOC_RCPT_ID=-1
                  :TARGET_CUST_NM="CUST_INFO.CUST_NM"
                />
              </template>
              <template slot="footer">
                <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('Voc')">닫기</v-btn>
                <v-btn class="pl-btn" @click="saveVocData">저장</v-btn>
              </template>
            </compo-dialog>
          </v-dialog>
          <!-- 엑셀다운로드 -->
          <compo-excel
            :DisabledProp="CUST_INFO.CUST_ID != undefined && CUST_INFO.CUST_ID > -1?false:true"
            TypeProp="DownloadChat"
            ClassProp="is-blue"
            :ChatLog="CHAT_LOG"
          ></compo-excel>
          <!-- 새로고침 -->
          <compo-tooltip-btn
            :DisabledProp="CUST_INFO.CUST_ID != undefined && CUST_INFO.CUST_ID > -1?false:true"
            TitleProp="새로고침"
            ClassProp="pl-tooltip-btn is-blue"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="chatHstSrch()"
          ></compo-tooltip-btn>
          <!-- 상세조건 버튼 -->
          <div v-if="TRANS_USE_YN === 'Y' || STT_USE_YN === 'Y'">
            <compo-tooltip-btn
              TitleProp="상세"
              ClassProp="pl-tooltip-btn is-blue"
              IconProp="pl-icon20 main-detail"
              TooltipPositionProp="bottom"
              @btnClick="dropChatDetail = !dropChatDetail"
            ></compo-tooltip-btn>
            <v-slide-y-transition>
              <div class="pl-drop-layer is-mainchat-detail" v-if="dropChatDetail === true" v-click-outside="closeDropMainDetail">
                <div class="pl-drop-layer-body">
                  <div class="d-flex align-center" v-if="TRANS_USE_YN === 'Y'">
                    <div class="d-flex align-center">
                      <v-icon class="pl-icon30 mainchat-translate"></v-icon>
                      <strong class="ml-2 is-txt-main">
                        번역 설정
                      </strong>
                    </div>
                    <div class="ml-auto">
                      <v-switch
                        v-model="switchTranslate"
                        @change=""
                      >
                        <template v-slot:label>
                          <span class="pl-label">{{ switchTranslate ? 'ON' : 'OFF' }}</span>
                        </template>
                      </v-switch>
                    </div>
                  </div>
                  <p class="mt-2 is-txt-sub" v-if="TRANS_USE_YN === 'Y'">번역내용 보기를 활성화 합니다. </p>
                  <v-divider class="my-2" v-if="TRANS_USE_YN === 'Y' && STT_USE_YN === 'Y'"></v-divider>
                  <div class="d-flex align-center" v-if="STT_USE_YN === 'Y'">
                    <div class="d-flex align-center">
                      <v-icon class="pl-icon30 mainchat-summary"></v-icon>
                      <strong class="ml-2 is-txt-main">
                        자동요약 설정
                      </strong>
                    </div>
                    <div class="ml-auto">
                      <v-switch
                        v-model="switchSummary"
                        @change="switchSummaryChange($event)"
                      >
                        <template v-slot:label>
                          <span class="pl-label">{{ switchSummary ? 'ON' : 'OFF' }}</span>
                        </template>
                      </v-switch>
                    </div>
                  </div>
                  <p class="mt-2 is-txt-sub" v-if="STT_USE_YN === 'Y'">채팅내용 요약 보기를 활성화 합니다. </p>

                </div>
              </div>
            </v-slide-y-transition>
          </div>
        </div>
      </div>
      <!-- 채팅목록 채팅 선택 -->
      <!-- 영상통화 iframe-->
      <div v-if="demoVideoMode" style="height: calc(100% - 180px)">
        <iframe ref="child" id="child" :src="iframeUrl" allow="camera *;microphone *" width="100%" height="100%" frameborder="0"></iframe>
      </div>
      <div
        class="pl-card d-flex flex-grow-1 flex-column"
        :class="demoVideoMode ? 'pt-0' : ''"
        v-if="CHAT_CUTT_MODE === 'CHAT'">
        <!-- 채팅창 -->
        <compo-chatting
          v-if="!demoVideoMode"
          ref="chattingCompo"
          :ChatLogProp="CHAT_LOG"
          :BfrChatLogProp="BFR_CHAT_LOG"
          :BfrChatProp = BFR_CHT_PROP
          :chbtUserProp = "CHBT_USER"
          :chbtProp = "CHBT_INFO"
          style="min-height: 470px; flex: 1 1 470px;"
          HeightProp="100%"
          @bfrChatHstSrch="chatHstSrch('BFR'), BFR_CHT_PROP = true"
          @aftrChatHstSrch="chatHstSrch('AFTR'), BFR_CHT_PROP = false"
        />
        <!-- 채팅 입력창 -->
        <div
          v-if="chat_list_data?.CLK_DATA?.STTS_CD !== 'done'"
          class="pl-chat-input is-mt-m">
          <!-- 영상통화 -->

          <div class="pl-chat-input-text-wrap" v-if="!demoVideoMode">
            <v-textarea
              v-model="CHAT_INPUT.textarea"
              ref="chatInput"
              class="pl-form is-noresize"
              @keydown="keyDown"
              :disabled="CHAT_STAT == 'ING' ? false : true"
              :spellcheck="false"
            />
            <!-- 채팅 보내기 버튼 -->
            <compo-tooltip-btn
              TitleProp="채팅 보내기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon30 chat-send"
              TooltipPositionProp="bottom"
              @btnClick="sendMsg('msg')"
              :DisabledProp="CHAT_STAT == 'ING' ? false : true"
            ></compo-tooltip-btn>

          </div>
          <div class="pl-chat-input-bottom mt-auto" :style="demoVideoMode ? 'border-top: 0' : ''">
            <div class="pl-btn-wrap">
              <!-- 이미지전송 버튼 -->
              <compo-tooltip-btn
                TitleProp="이미지전송"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 pick-img"
                TooltipPositionProp="top"
                @btnClick="clickAddFiles"
                :DisabledProp="CHAT_STAT == 'ING' ? false : true"
              ></compo-tooltip-btn>
              <!-- 이미지 직접 전송 버튼 -->
              <compo-tooltip-btn
                TitleProp="이미지 직접 전송"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 upload-img"
                TooltipPositionProp="top"
                @btnClick="mixin_showDialog('VueDrop')"
                :DisabledProp="CHAT_STAT == 'ING' ? false : true"
              ></compo-tooltip-btn>
              <input ref="fileUpload" type="file" style="display: none" />
              <!-- 파일 직접 전송 버튼 -->

              <compo-tooltip-btn
                v-if="clientip === '121.67.187.114'"
                TitleProp="파일 전송"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 upload-img"
                TooltipPositionProp="top"
                @btnClick="mixin_showDialog('VueDropFile')"
                :DisabledProp="CHAT_STAT == 'ING' && chat_list_data?.CLK_DATA?.CHN_CLSF_CD == 'KAKAO' ? false : true"
              ></compo-tooltip-btn>
              <input ref="fileSend" type="file" style="display: none" />

              <!-- 시스템 메시지 온/오프 버튼 = = 상단으로 이동 -->
              <!-- <compo-tooltip-btn
                TitleProp="시스템 메시지 온/오프"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 sys-msg"
                TooltipPositionProp="top"
                @btnClick="sysMsgOnOff()"
                :DisabledProp="CHAT_STAT == 'ING' ? false : true"
              ></compo-tooltip-btn> -->
              <!-- 종료링크 전송 버튼 -->
              <compo-tooltip-btn
                TitleProp="종료링크 전송"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 endlink-msg"
                TooltipPositionProp="top"
                @btnClick="sendMsg('endLink')"
                :DisabledProp="CHAT_STAT == 'ING' ? false : true"
              ></compo-tooltip-btn>
              <!-- 전달 버튼 -->
              <compo-tooltip-btn
                TitleProp="전달"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 pass-msg"
                TooltipPositionProp="top"
                @btnClick="showSldeChatSend"
                :DisabledProp="CHAT_STAT == 'ING' ? false : true"
              ></compo-tooltip-btn>
              <!-- 콜백 버튼 -->
              <compo-tooltip-btn
                TitleProp="콜백"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 callback-msg"
                TooltipPositionProp="top"
                @btnClick="showSldeChatCallback"
                :DisabledProp="CHAT_STAT == 'ING' ? false : true"
              ></compo-tooltip-btn>
              <span class="is-txt-bull">&bull;</span>
              <!-- 위치 전송 버튼 -->
              <compo-tooltip-btn
                TitleProp="위치 전송"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 place-msg"
                TooltipPositionProp="top"
                @btnClick="sendingBtn('place')"
                :DisabledProp="CHAT_STAT == 'ING' ? (CUST_INFO.CUST_PHN_NO.length>3 ? false : true) : true"
              ></compo-tooltip-btn>
              <!-- 주소록 전송 버튼 -->
              <compo-tooltip-btn
                TitleProp="주소록 전송"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 address-msg"
                TooltipPositionProp="top"
                @btnClick="sendingBtn('contacts')"
                :DisabledProp="CHAT_STAT == 'ING' ? (CUST_INFO.CUST_PHN_NO.length>3 ? false : true) : true"
              ></compo-tooltip-btn>

              <div class="ml-auto">
                <v-btn v-if="switchTranslate" class="pl-btn is-sub">번역보기</v-btn>
                <v-btn v-if="switchSummary"
                  class="pl-btn is-sub"
                  style="margin-left: 6px;"
                  @click="summaryCuttCn()"
                >요약보기</v-btn>
                <!-- <v-btn class="pl-btn is-icon" style="margin-left: 6px;" @click="chat_off()" :disabled="CHAT_OFF_LIST.length == 0 || chat_list_data.CLK_DATA.CUTT_STTS_CD == 'CMPL'">
                  <span class="pl-icon20 arrow-down-white"></span>
                  {{ SELECTED_CHAT_OFF.text }}
                  <v-slide-y-reverse-transition>
                    <div class="pl-drop-layer is-mainchat-off" v-if="dropChatOff === true" v-click-outside="closeDropChat">
                      <div class="pl-drop-layer-body">
                        <ul class="pl-drop-layer-list">
                          <li
                            v-for="item in CHAT_OFF_LIST"
                            :key="item.id"
                            @click="selectChatList(item)"
                            >
                            <v-icon :class="`pl-icon20 ${ item.icon }`"></v-icon>
                            <span class="ml-2">
                              {{ item.text }}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </v-slide-y-reverse-transition>
                </v-btn> -->
                <v-btn
                  v-if="chat_list_data?.CLK_DATA?.STTS_CD == 'cs'"
                  class="pl-btn is-icon"
                  style="margin-left: 6px;"
                  @click="selectChatList(CHAT_OFF_LIST[0])">상담종료</v-btn>
                <v-btn
                  v-if="chat_list_data?.CLK_DATA?.STTS_CD == 'after'"
                  class="pl-btn is-icon"
                  style="margin-left: 6px;"
                  @click="selectChatList(CHAT_OFF_LIST[2])">상담저장</v-btn>
                  <!-- 영상통화 -->
                  <v-btn
                    v-if="demoVideoMode"
                    class="pl-btn is-icon"
                    style="margin-left: 6px;"
                    @click="slideChat = true">상담 결과 저장</v-btn>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- 채팅목록 이메일 상담 모드 -->
      <chatEmail
        v-if="CHAT_CUTT_MODE === 'EMAIL'"
        ref="refChatEmail"
        :EMAIL_CUTT_INFO="EMAIL_CUTT_INFO"
        :chat_list_data="chat_list_data"
        :CUST_INFO="CUST_INFO"
        :CHAT_STAT="CHAT_STAT"
        :demoVideoMode="demoVideoMode"
        @sendMsg="sendMsg"
        @slideOpen="slideOpen"
        @selectChatList="selectChatList"
      />
      <!-- 채팅목록 이커머스 -->
      <chat-ecommerce
          v-if="CHAT_CUTT_MODE === 'BBS'"
          ref="refChatBbs"
          :BBS_CUTT_INFO="BBS_CUTT_INFO"
          :CHAT_LIST_DATA="chat_list_data"
          :CUST_INFO="CUST_INFO"
          :USER_CUTT_STAT="USER_CUTT_STAT"
          :demoVideoMode="demoVideoMode"
          @selectChatList="selectChatList"
        >
      </chat-ecommerce>
      <!-- slide modal 공통-->
      <v-slide-y-reverse-transition>
        <div class="pl-drop-layer is-mainchat-slide type02" v-if="slideChat === true" style="max-height:528px;overflow-y:auto;">
          <div class="pl-card-top">
            <div class="pl-card-top-title">
              <template v-if="chat_send_slide">
                채팅 전달
              </template>
              <template v-if="chat_callback_slide">
                채팅 콜백
              </template>
              <template v-if="chat_send_slide === false && chat_callback_slide === false">
                {{ SELECTED_CHAT_OFF.text }}
              </template>
            </div>
          </div>
          <div class="pl-card">
            <div class="pl-form-inline-wrap vertical">
              <!-- case : 채팅 전달 -->
              <div class="pl-form-inline" v-show="chat_send_slide">
                <span class="pl-label">
                  상담 직원
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-autocomplete
                    class="pl-form"
                    :items="TRAN_USER_LIST"
                    item-text="USER_NM"
                    item-value="USER_ID"
                    placeholder="선택하세요"
                    no-data-text="상담원이 존재하지 않습니다"
                    v-model="TRAN_USER_ID"
                    @change="tranUserNm"
                  ></v-autocomplete>
                </div>
              </div>
              <!--// case : 채팅 전달 -->
              <div class="pl-form-inline">
                <span class="pl-label">
                  상담 채널
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    :items="mixin_common_code_get(this.common_code, 'CUSL_TP_CL')"
                    placeholder="선택하세요"
                    v-model="CUTT_TY"
                    readonly
                  ></v-select>
                  <v-select
                    class="pl-form flex-grow-1"
                    :items="mixin_common_code_get(this.common_code, 'CHNL')"
                    placeholder="선택하세요"
                    v-model="CHNL"
                    readonly
                  ></v-select>
                  <v-select
                    class="pl-form"
                    :items="mixin_common_code_get(this.common_code, 'CHNL_CL')"
                    placeholder="선택하세요"
                    v-model="CHNL_CL"
                    readonly
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  상담 유형
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-autocomplete v-for="(cuttType, idx) in CUTT_TYPE_VMODEL_ARR" :key="idx"
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
                  상담 내용
                  <v-icon 
                    class="pl-icon20"
                    :class="CUTT_CN_VALID == 'Y' ? 'required' : ''"
                    ></v-icon>
                </span>
                <div class="pl-desc">
                  <v-textarea
                    class="pl-form is-noresize"
                    v-model="CUTT_CN"
                    :spellcheck="false"
                  />
                </div>
              </div>
              <div class="pl-form-inline" v-if="mixin_getCustcoSrvcStat('TRNSF')">
                <span class="pl-label">
                  이관 여부
                </span>
                <div class="pl-desc">
                  <v-switch v-model="trnsfUseYn" @click="getTrnsfExpsnAttrList" class="ml-auto">
                  </v-switch>
                </div>
              </div>
              <div
                v-if="CLBK_YN == 'Y' ? true : false"
                class="pl-form-inline-wrap">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    챗콜백
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc is-reserveCall">
                    <v-checkbox
                      v-model="chkDateReserve"
                      class="pl-check"
                      @click="toggleChkReserve($event)"
                    ></v-checkbox>
                    <compo-date-picker
                      v-if="dateReservePicker"
                      DateType="dateTime"
                      :DateProp.sync="dateTimeDate"
                      :TimesProp.sync="selectedTime"
                      :AmpmProp.sync="selectedAmpm"
                      />
                    <!-- 챗콜백 간편 모달 -->
                    <div
                      v-show="dropDateReserve"
                      class="pl-drop-layer is-dateReserve"
                      :style="{ position: 'absolute', top: '-220px', left: '20px' }"
                      >
                      <div class="pl-drop-layer-header">
                        챗콜백 알림시간
                      </div>
                      <div class="pl-drop-layer-body">
                        <ul class="pl-drop-layer-list">
                          <li
                            v-for="(time, index) in times" :key="index"
                            class="d-flex justify-space-between"
                            @click="selectReserveDateTime(time.date)">
                            <span>{{ time.label }}</span> <span>{{ displayReserveTime(time.date) }}</span>
                          </li>
                        </ul>
                      </div>
                      <div class="pl-drop-layer-footer">
                        <v-btn
                          class="pl-btn is-icon is-sub is-calendarPick flex-grow-1"
                          @click="showDatePicker()"
                        >
                          <span class="pl-icon20 calendarPick"></span>
                          날짜 및 시간 직접 선택
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--이관 확장 속성-->
              <template v-if="mixin_getCustcoSrvcStat('TRNSF') && CUST_INFO.CUST_ID != undefined && CUST_INFO.CUST_ID > -1 && trnsfUseYn">
                <v-divider></v-divider>
                <div class="d-flex align-cetgnrer">
                  <h3 class="pl-subtit">ㆍ이관 내용</h3>
                </div>
                <div class="pl-form-inline" v-for="(expsnAttr, seq) in TRNSF_EXPSN_ATTR" :key="expsnAttr.ATTR_ID">
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
                  <div class="pl-desc" style="width:375px" v-else-if="expsnAttr.DATA_TYPE_CD === 'COE_MULTI'">
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
                <div class="pl-form-inline">
                  <span class="pl-label">
                    담당자
                    <v-icon class="pl-icon20 required"></v-icon> <!-- 필수 입력인 경우  -->
                  </span>
                  <div class='pl-desc'>
                    <v-autocomplete
                      v-model="TRGT_USER_ID"
                      class="pl-form flex-grow-1"
                      :items="TRNSF_USER_LIST"
                      placeholder="담당자명을 검색하세요"
                      clearable
                      no-data-text="결과 없음"
                    />
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="pl-card mt-auto is-border">
            <div class="pl-btn-wrap ">
              <v-btn class="pl-btn is-sub ml-auto" @click="slideClose">취소</v-btn>
              <v-btn
                v-if="BAT_BTN"
                class="pl-btn"
                @click="showAlert(MESSAGE.CONFIRM.SAVE_BAT)"
              >일괄저장</v-btn>
              <v-btn
                v-else
                class="pl-btn"
                @click="TRAN_USER_ID != '' ? showAlert(MESSAGE.CONFIRM.TRAN)
                          : (CLBK_YN == 'Y' ? showAlert(MESSAGE.CONFIRM.CLBK)
                              : (TEMP_YN == 'Y' ? showAlert(MESSAGE.CONFIRM.SAVE) : showAlert(MESSAGE.CONFIRM.SAVE)))"
              >저장</v-btn>
            </div>
          </div>
        </div>
      </v-slide-y-reverse-transition>
    </div>

    <!-- right -->
    <div
      class="pl-mainchat-csinfo is-col-fix"
      :class="cus_info_resizeClass ? 'expand-history' : ''"
      >
      <!--  고객정보 -->
      <mainchat-cus-info
        ref="MainchatCusInfo"
        :CHNL="CUST_INFO.CHNL"
        :CUST_ID="CUST_INFO.CUST_ID"
        :custInfoProp="CUST_INFO"
        @call="mixin_testLog('전화')"
        @sms="showSmsSlide"
        @email="mixin_testLog('이메일')"
        @chat="showChatSlide"
        @topDetail="mixin_testLog('topDetail')"
        class="pl-mainchat-csinfo-cus pl-card-wrap"
        style="height: 220px;" />
      <!--  통합접촉이력 -->
      <mainchat-all-log
        ref="MainchatAllLog"
        :CHNL="CUST_INFO.CHNL"
        :CUST_ID="CUST_INFO.CUST_ID"
        :ResizeProp=cus_info_resizeClass
        :custInfoProp="CUST_INFO"
        :DataProp="all_log_data"
        class="pl-mainchat-csinfo-history pl-card-wrap"
        @toggle="toggleResize()"
      />
    </div>

    <!-- 이미지 선택 다이얼로그 -->
    <v-dialog
      v-model="dialogImgSend"
      content-class="dialog-draggable is-lg is-nopadding"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="이미지 전송"
        @hide="mixin_hideDialog('ImgSend')"
      >
        <template slot="body">
          <div class="pl-cols">
            <!-- tree -->
            <div class="is-col-fix is-vrt" style="width: 300px">
              <div class="pl-card">
                <div class="pl-tree-header">
                  <div class="is-left">
                    <label>기본 메뉴</label>
                  </div>
                  <div class="is-right">
                    <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault')">전체 펼치기</v-btn>
                    <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault')">전체 접기</v-btn>
                  </div>
                </div>
                <div class="pl-tree-body" style="height: 515px;">
                  <v-treeview
                    ref="treeDefault"
                    :items="QSTN_TYPE_TREE"
                    :open-all="expanded"
                    activatable
                    :active="ACT_TREE_MENU"
                    open-on-click
                    color="secondary"
                    class="pl-tree-view"
                    @update:active="srch_tree_act"
                    @update:open="srch_tree_open"
                  >
                    <template v-slot:prepend="{ item, open }">
                      <v-icon v-if="item.children">
                          {{open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder'}}
                      </v-icon>
                      <v-icon v-else>
                          {{ 'pl-icon20 tree-file' }}
                      </v-icon>
                    </template>
                  </v-treeview>
                </div>
              </div>
            </div>
            <!-- img grid -->
            <div class="pl-card">
              <h1 class="pl-subtit d-flex">
                이미지 리스트
                <div class="ml-auto">
                  <v-text-field
                    class="pl-form is-search"
                    placeholder="검색어 입력"
                    @keydown.enter="chtImgSrch()"
                    :disabled="QSTN_TYPE_ID == ''? true : false"
                  >
                  <template v-slot:append>
                    <v-btn
                      :disabled="QSTN_TYPE_ID == ''? true : false"
                      @click="chtImgSrch()"
                      class="pl-btn has-icon-only">
                      <span class="pl-icon20 in-search"></span>
                    </v-btn>
                  </template>
                </v-text-field>
                </div>
              </h1>
              <div>
                <v-data-table
                  class="pl-grid type-hover-func type-img is-mt-m"
                  :headers="headers"
                  :items="items"
                  hide-default-header
                  item-key="index"
                  height="500px"
                  :items-per-page="ROW_PER_PAGE"
                  hide-default-footer
                  :page.sync="page"
                  @page-count="pageCount = $event">
                  <template v-slot:item="{ item }">
                    <div
                      class="pl-img-grid-unit"
                      :class="mixin_getItemClass(item)"
                      @mouseover="mixin_hoverItem(item,'items')"
                      @mouseleave="mixin_leaveItem(item,'items')"
                    >
                      <div>
                        <img
                          :src="item.IMG_URL"
                          :alt="item.PST_TTL"
                          class="pl-img-grid-unit-img"
                        />
                      </div>
                      <div class="pl-img-grid-unit-title">
                        {{ item.PST_TTL }}
                      </div>
                      <div class="grid-hover-func-wrap">
                        <v-btn class="pl-btn is-sub is-sm" @click="chat_img_expand(item.img)">원본 보기</v-btn>
                        <v-btn class="pl-btn is-sub is-sm" @click="[sendMsg('img',item),mixin_hideDialog('ImgSend')]">전송</v-btn>
                      </div>
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

                  <!-- 더보기 다음 있을때만 노출 -->
                  <span class="pl-pager-period">
                    보기 {{ mixin_getPagePeriod(items, page) }} / {{ items.length }}
                    <v-btn
                      class="pl-btn is-sub"
                      :disabled = "nextDisabled"
                      @click="chtImgSrch('next')"
                    >다음 검색</v-btn>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- 이미지 확대 다이얼로그 -->
    <v-dialog
      v-model="dialogImgExpand"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="이미지"
        @hide="mixin_hideDialog('ImgExpand')"
      >
        <template slot="body">
          <!-- component -->
          <img
            :src="expandImgUrl"
            class="pl-chatting-log-img-expand"
            />
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- 위치 정보 -->
    <v-dialog
      v-model="dialogPlaceContactsFind"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :headerTitle='HEADER_TITLE'
        @hide="mixin_hideDialog('PlaceContactsFind')"
      >
        <template slot="body">
          <!-- component -->
          <compo-send-info
            component-to-re-render :key="COMPONENT_KEY"
            :DataTypeProp = "DATA_TYPE_PROP"
            :SearchInputProp.sync="SearchSendInputData"
            :DataHeaderProp="DATA_TYPE_PROP === 'place' ? HeadersSendPlace : HeadersSendContacts"
            :DataBodyProp="ItemsSendData"
            :SelectedRadioProp.sync="SelectedSendType"
            :selectedDataProp.sync="selectedSendItem"
            @fidnBtn="mixin_testLog('위치 정보 보내기 버튼')"
          />

        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('PlaceContactsFind')">닫기</v-btn>
          <v-btn class="pl-btn" @click="sendInfoBtn()">보내기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- 모달 : 문자 -->
    <!--
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer" v-if=" dialogSms === true ">
        <div class="pl-quick-layer-header"><h1>문자</h1>
          <compo-tooltip-btn

            TitleProp="닫기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="closeModal('dialogSms')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body">
          <right_sms :custInfoProp="CUST_INFO"></right_sms>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    -->
    <!-- 모달 : 알림톡 -->
    <!--
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer" v-if=" dialogTalk === true ">
        <div class="pl-quick-layer-header"><h1>알림톡</h1>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="closeModal('dialogTalk')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body">
          <right-talk :custInfoProp="CUST_INFO"></right-talk>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    -->

    <!-- 모달 : 채팅 이미지 뷰드랍  -->
    <v-dialog
      v-model="dialogVueDrop"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        headerTitle='이미지 전송'
        @hide="[mixin_hideDialog('VueDrop'), initUploadImg()]"
      >
        <template slot="body">
          <!-- component -->
          <vue-dropzone
            ref="vueDrop"
            id="vueDrop"
            :options="vueDropConfig"
            @vdropzone-files-added="handleFileAdded"
            @vdropzone-removed-file="handleFileRemoved"
            class="form-drop"
          >
          </vue-dropzone>

        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="[mixin_hideDialog('VueDrop'), initUploadImg()]">닫기</v-btn>
          <v-btn class="pl-btn" @click="sendUploadImg()">발송</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- 모달 `: 채팅 이미지 뷰드랍  -->
    <v-dialog
      v-model="dialogVueDropFile"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        headerTitle='파일 전송'
        @hide="[mixin_hideDialog('VueDropFile'), initUploadFile()]"
      >
        <template slot="body">
          <!-- component -->
          <vue-dropzone
            ref="vueDropFile"
            id="vueDropFile"
            :options="vueDropConfigFile"
            @vdropzone-files-added="handleFileAddedFile"
            @vdropzone-removed-file="handleFileRemovedFile"
            class="form-drop"
          >
          </vue-dropzone>

        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="[mixin_hideDialog('VueDropFile'), initUploadFile()]">닫기</v-btn>
          <v-btn class="pl-btn" @click="sendUploadFile()">발송</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

  </div>
</template>

<script>
import MainchatCusList from '@/views/page/mainChat/MainchatCusList.vue';
import MainchatCusInfo from '@/views/page/mainChat/MainchatCusInfo.vue';
import MainchatAllLog from '@/views/page/mainChat/MainchatAllLog.vue';
import chatEmail from '@/views/page/CSL_M0200_EMAIL.vue';
import ChatEcommerce from '@/views/page/CSL_M0200_ECOMMERCE.vue';
import right_sms from '@/views/page/right_sms.vue';
import RightTalk from '@/views/page/right_talk.vue';
import { stompUtil } from "@/store/stomp-util.js";

import { eventBus } from "@/store/eventBus.js";
import axios from "axios";

let stomeReConnectCnt = 36;
let beforeunloadReTryCnt = 1;  //로그아웃시 중복호출 증상으로 인한.

export default {
  name: "MENU_CSL_M0200", //name은 'MENU_' + 파일명 조합
  components: {
    MainchatCusList,
    MainchatCusInfo,
    MainchatAllLog,
    right_sms,
    RightTalk,
    chatEmail,  //이메일 상담 컴포넌트
    ChatEcommerce, //이커머스 컴포넌트
  },
  data() {
    return {
      //공통코드
      common_code:[],

      //drop
      dropChatDetail: false,
      switchTranslate: false,
      switchSummary: false,
      dialogVueDrop: false,
      dialogVueDropFile: false,

      //[VOC 접수]
      SetChnlProp:'SNS',
      dialogVoc: false,
      VOC_DATA : '',

      // [상담 목록]
      chat_list_data: {
        portrait: this.$store.getters["userStore/GE_USER_ROLE"].ICON_IMG_URI,//require('@/assets/img/@profile_user.png'), //사이즈  54x54
        manager_id: this.$store.getters["userStore/GE_USER_ROLE"].userId,
        manager_lgnId: this.$store.getters["userStore/GE_USER_ROLE"].lgnId,
        manager_name: this.$store.getters["userStore/GE_USER_ROLE"].userName,
        monitor_total: 0,
        monitor_me: 0,
        monitor_other: 0,
        arr_ch: [],
        arr_callbak: [],
      },

      // [채팅 log]
      NOW_CHAT : '',
      CHAT_STAT: '',      //상담 버튼 및 메시지 제어를 위한 상태
      CHAT_TOP_INFO : {}, //상담 채팅 정보
      BFR_CHAT_LOG: [],   //이전채팅 내역 => 챗봇내역때문에 이전채팅내역이 꼬이는일이 발생하여 변수 새로 생성
      CHAT_LOG: [],       //채팅 내역
      CHBT_USER: {},      //챗봇고객정보
      CHBT_INFO: [],      //고객챗봇이력

      CHAT_INPUT: {
        textarea: ''
      },
      KEYDOWN:'',         //메시지 입력창 키입력 감지
      SELECTED_CHAT_OFF: {
        text: '상담종료'
      },
      dropChatOff: false,
      slideChat: false,
      CHAT_OFF_LIST: [
        { text: "상담종료", active: 'slideChatOff', icon: 'chat-off'},
        { text: "임시저장", active: 'slideChatTemp', icon: 'chat-temp'},
        { text: "상담저장", active: 'slideChatSave', icon: 'chat-save'},
      ],
      dropTempSave: false, //임시저장 모달
      dropItemsTemp00: [],
      dropItemsTemp01: [],
      dropItemsTemp02: [],
      dropItemsTemp03: [],
      dropItemsTemp04: [],
      dropItemsTemp05: [],
      dropItemsTemp06: [],
      // 챗콜백
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
      //채팅 전달
      chat_send_slide: false,
      //콜백 버튼
      chat_callback_slide: false,


      //상담 저장
      CUTT_TY: 'IN',            //IN/OUT구분
      CHNL:'SNS',               //콜/채팅 구분
      CHNL_CL:'KAKAO',          //채팅 채널구분

      CUTT_ITEMS:[],            //상담유형 전체데이터
      ITGRT_USE_YN:'',          //통합여부
      CUTT_TYPE_LMT_LVL_CD:'',  //상담유형 레벨
      CUTT_TYPE_VMODEL_ARR:[],  //상담유형 v-model
      CUTT_TYPE_ID:'',          //선택 상담유형

      CUTT_CN:'',               //상담내용
      CLBK_YN: 'N',           //챗콜백 체크
      CLBK_YMD: '',             //챗콜백 시간

      //전달 폼
      TRAN_USER_LIST: [],       //상담전달 직원 리스트
      TRAN_USER_ID: '',         //상담 전달 직원
      TRAN_USER_NM: '',         //상담 전달 직원

      //임시저장 폼
      TEMP_YN:'N',              //임시저장여부

      //이미지 전송
      dialogImgSend: false,     //이미지 전송 모달
      dialogImgExpand:false,    //이미지 전송창 이미지 확대
      expanded: false,          //이미지 분류 펼치기
      img_treeItems:[],         //전송 이미지 분류 트리
      QSTN_TYPE_TREE: [],       //문의유형 트리
      ACT_TREE_MENU:[],         //활성화된(클릭한) 트리
      ACT_TREE_LIST:[],         //활성화된 트리 리스트

      SRCH_PST_TTL:'',          //제목 검색어
      QSTN_TYPE_ID:'',          //선택한 문의유형ID
      QSTN_TYPE_NM:'',          //선택한 문의유형명
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
      headers: [
        { text: '타이틀', value: 'title', align: 'center', },
        { text: '이미지', value: 'img', align: 'center', },
      ],
      items: [],
      expandImgUrl: '',
      editedIndex: -1,
      hoverRow: null,

      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      }, //그리드 페이지속성정의
      nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼

      FILE_KEY:'',              //파일키

      // 채팅 상담 모드 - CHAT : 채팅, EMAIL : 이메일, BBS: 게시판 상담(이커머스)
      CHAT_CUTT_MODE: 'CHAT',

      //이메일 상담 내역
      EMAIL_CUTT_INFO: {},

      //게시판 상담 내역
      BBS_CUTT_INFO: {},
      BBS_LKAG_INFO : {}, // 게시판 상담용 연동 정보
      USER_CUTT_STAT : 'CHT_CANT',

      //고객 기본정보
      CUST_INFO : {
        CHNL : 'SNS',
        CUST_NM : '성명미상',
        CUST_PHN_NO : '　',
        portrait : require('@/assets/img/@profile_customer.png')
      },

      // [통합 접촉이력]
      cus_info_resizeClass: false,
      all_log_data: {
        chat_type: 'sns',
        dropItemsCh: [
          { text: '전화 상담' },
          { text: 'SNS 상담' },
        ],
        dropItemsStat: [
          { text: '처리완료' },
          { text: '처리중' },
        ],
        startDate: "2022-12-25",
        endDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        // 상담이력
        ARR_CS: [],
        // VOC
        ARR_VOC: [],
        // 예약콜
        ARR_RESERVE_CALL: [],
        // 콜백
        ARR_CALLBACK: [],
        // 캠페인
        ARR_CAMPAIGN: [],
      },

      //위치정보,주소록 보내기
      dialogPlaceContactsFind: false,
      HeadersSendPlace: [
        { text: '위치명', value: 'PSTN_NM', align: 'left', width: '100px', sortable: false },
        { text: '지역', value: 'SPLIT_ADDR', align: 'left', width: '100px', sortable: false },
        { text: '주소', value: 'ADDR', align: 'left',  sortable: false, },
      ],
      HeadersSendContacts: [
        { text: '연락처', value: 'TELNO', align: 'left', width: '100px', sortable: false },
        { text: '지역', value: 'RGN_NM', align: 'left', width: '100px', sortable: false },
        { text: '담당부서', value: 'TKCG_DEPT_NM', align: 'left', width: '100px', sortable: false,},
        { text: '담당업무', value: 'TASK_NM', align: 'left', sortable: false,},
      ],
      SearchSendInputData: '',
      ItemsSendData: [],
      SelectedSendType: '문자',
      selectedSendItem: [],

      HEADER_TITLE: '',     //팝업 타이틀
      DATA_TYPE_PROP: '',   //위치정보또는 주소록 구분
      COMPONENT_KEY: '',    //dialog 구분

      SNDR_KEY: '',
      DSPTCH_PRF_KEY: '',

      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
          TRAN : {alertDialogToggle: true, msg: '상담을 전달하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.chatTran, callNo: this.closeMsg}
          , CLBK : {alertDialogToggle: true, msg: '콜백을 등록하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.cuttSave, callNo: this.closeMsg}
          , SAVE : {alertDialogToggle: true, msg: '상담을 저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.cuttSave, callNo: this.closeMsg}
          , SAVE_BAT : {alertDialogToggle: true, msg: '상담을 일괄저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.cuttBatSave, callNo: this.closeMsg}
          , TEMP_SAVE : {alertDialogToggle: true, msg: '상담을 임시저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.cuttSave, callNo: this.closeMsg}
          , END : {alertDialogToggle: true, msg: '상담을 종료하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.unStngUserConfirm, callNo: this.closeMsg}
        },
        ALERT : {
          SYS_MSG_ON_SUCCESS : {alertDialogToggle: true, msg: '시스템메시지가 발송됩니다', iconClass: 'is-info', type: 'default'}
          , SYS_MSG_ON_SUCCESS_TOAST: {  msg: '시스템메시지가 발송됩니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          , SYS_MSG_OFF_SUCCESS : {alertDialogToggle: true, msg: '시스템메시지를 발송하지 않습니다', iconClass: 'is-info', type: 'default'}
          , SYS_MSG_OFF_SUCCESS_TOAST: {  msg: '시스템메시지를 발송하지 않습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          , BMK_ON_SUCCESS : {alertDialogToggle: true, msg: '책갈피가 추가되었습니다', iconClass: 'is-info', type: 'default'}
          , BMK_ON_SUCCESS_TOAST: {  msg: '책갈피가 추가되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          , BMK_OFF_SUCCESS : {alertDialogToggle: true, msg: '책갈피가 삭제되었습니다', iconClass: 'is-info', type: 'default'}
          , BMK_OFF_SUCCESS_TOAST: {  msg: '책갈피가 삭제되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          , TRAN_SUCCESS : {alertDialogToggle: true, msg: '채팅 전달이 완료되었습니다', iconClass: 'is-info', type: 'default'}
          , CLBK_SUCCESS : {alertDialogToggle: true, msg: '콜백이 등록되었습니다', iconClass: 'is-info', type: 'default'}
          , SAVE_SUCCESS : {alertDialogToggle: true, msg: '상담이 저장되었습니다', iconClass: 'is-info', type: 'default'}
          , SET_SUCCESS : {alertDialogToggle: true, msg: '설정이 변경되었습니다', iconClass: 'is-info', type: 'default'}
          , VALID : {alertDialogToggle: true, msg: '필수항목 확인 후<br>재시도 해주세요', iconClass: 'is-info', type: 'default'}
          , CANT_CHAT : {alertDialogToggle: true, msg: '상담이 가능한 상태가 아닙니다', iconClass: 'is-info', type: 'default'}
          , CHT_WAIT: {  msg: '채팅상담이 준비되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          , CHT_END: {  msg: '더이상 신규채팅을 받지 않습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          , CHT_CANT: {  msg: '채팅상담이 종료되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          , SUMMARY_CUTT_CN: {alertDialogToggle: true, msg: '상담 내용이 없습니다.', iconClass: 'is-info', type: 'default'}
          , APPLY_CUTT_CN: {alertDialogToggle: true, msg: '상담 저장 화면 오픈 후 실행해 주세요.', iconClass: 'is-info', type: 'default'}
          , MAX_FILE_TOAST: {  msg: '이미지는 한개씩 발송 가능합니다', class: 'warning', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          , CHK_CUTT_TYPE: {alertDialogToggle: true, msg: '상담유형을 다시선택해주세요', iconClass: 'is-info', type: 'default'}
        },
        INFO : {
          SHORTCUT_USER_CHT_STAT : { msg: '채팅ON 상태 변경 후 이용해 주세요.', class: 'info', hasToastIcon: true, icon: 'mdi-information-outline', time: 4000 },
          SHORTCUT_CHAT_STAT : { msg: '상담중인 대화 선택 후 이용해 주세요.', class: 'info', hasToastIcon: true, icon: 'mdi-information-outline', time: 4000 },
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST:{
         SUCCESS: {  msg: '상담이 저장되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          ,TRAN_SUCCESS: {  msg: '채팅 전달이 완료되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          ,CLBK_SUCCESS: {  msg: '콜백이 등록되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          ,SAVE_SUCCESS: {  msg: '상담이 저장되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          ,SET_SUCCESS: {  msg: '설정이 변경되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
        },
      },
      lottieFavorite: null,

      rightIndex: 0,
      dialogSms: false,
      dialogTalk: false,
      // 시스템 메시지 상태
      SYSTEM_MSG_STAT: false,

      HIGHLIGHT:false,
      KEYWORD:"",
      TRANS_USE_YN: 'N', //번역 사용 여부
      STT_USE_YN: 'N', //STT(실시간 검색) 사용 여부

      FBDWD_YN:'',      //금칙어 적용여부
      SHOW_QSTN:'', //고객이 선택한 문의유형 보기 여부
      CUTT_CN_VALID: '',  //상담내용 필수여부

      IMG_LIST:[],      //이미지 상담사 직접 전송
      UPLOAD_IMG:[],     //dropzone queue에 등록된 이미지 삭제를 위해 등록된 이미지 정보 가지고 있기

      FILE_LIST:[],      //파일 상담사 직접 전송
      UPLOAD_FILE:[],    //dropzone queue에 등록된 파일 삭제를 위해 등록된 파일 정보 가지고 있기

      BFR_CHT_PROP: false,

      BAT_CUTT_LIST:[],
      BAT_BTN: false,

      NEW_CHAT_LIST:[],   //신규채팅(확인안한채팅) 리스트

      clientip:null,
      //영상통화
      demoVideoMode: false,
      iframeUrl: '',
      videoFilePath: '',

      VIDEO_INVITE_SMS_CN : '', //영상통화 초대 SMS 템플릿 내용

      //이관확장속성
      TRNSF_EXPSN_ATTR:[],
      trnsfUseYn: false, //이관 여부
      TRNSF_USER_LIST : [], //이관 대상 목록
      TRGT_USER_ID : '', //이관 대상 ID
    }
  },

  watch: {

  },

  computed: {

  },

  beforeDestroy(){
    this.$eventBus.$off("chatMessagePaste"); //eventBus 중복방지를 위해 off
    this.chat_list_data.USER_CHT_STAT = 'CHT_CANT';
    this.userChtStatChg();
  },


  //공통코드 사용시 async-await 필수 (mixin_common_code_get_all함수로 공통코드 리스트를 가지고 오기 전에 mixin_common_code_get이벤트 발생)
  async created() {
    //공통코드설정
    let codeName = ['CUSL_TP_CL','CHNL','CHNL_CL'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    // RightArea로 보내는 custInfo 초기화
    // console.log('this.CUST_INFO', this.CUST_INFO);

    eventBus.setCustInfo(this.CUST_INFO);

    this.cuttTypeSrch();

    fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(response => {
      this.clientip = response.ip;
    });

    /**
     * 이벤트 호출
     * Stomp Disconnect
     */
      this.$eventBus.$on("busStompDisconnect", () => {
      this.disconnect();
    });

    /**
     * 상담원 대기 구독 메시지 인입
     */
    this.$eventBus.$on("busReadyCallback", (message) => {
      this.readyCallback(message);
    });

    /**
     * 채팅 메시지 인입
     */
    this.$eventBus.$on("busInoutCallback", (message) => {
      let recvJson = JSON.parse(message.body);
      let telewebJsonString = JSON.parse(recvJson.telewebJsonString);
      let destArray = message.headers.destination.split("/")
      let newChatId = telewebJsonString.DATA[0].CHT_CUTT_DTL_ID
      if(telewebJsonString.DATA[0].hasOwnProperty('CHT_CUTT_ID')){
        //CHT_CUTT_ID가 있으면 발송메시지임
      } else {
        this.NEW_CHAT_LIST.push(newChatId);
      }

      this.$eventBus.chtListSrch('',this.NEW_CHAT_LIST); //채팅 리스트 가져오기 (이 과정에서 상담 구독 진행 => 구독을 맺어야 웹소켓 정상 작동)

      //클릭 데이터가 없으면 상담 채팅이력 조회 불가(오류)
      // console.log("this.chat_list_data", this.chat_list_data);
      if(this.chat_list_data.CLK_DATA != '' && this.chat_list_data.CLK_DATA != null && this.chat_list_data.CLK_DATA != undefined){
        if(recvJson.userKey == this.chat_list_data.CLK_DATA.CHT_USER_KEY){
          //클릭 데이터가 있고 상담 종료를 받았을 때
          if(recvJson.chatEvent == "EXPIRED_SESSION_CUST"){
            this.chat_list_data["CLK_DATA"]["CUTT_STTS_CD"] = 'AFTPRCS'
            this.chat_list_data["CLK_DATA"]["STTS_CD"] = 'after'
            this.chat_list_data["CLK_DATA"]["CUTT_STTS_CD_NM"] = '후처리'
            this.CHAT_TOP_INFO.status = 'after';
            this.CHAT_TOP_INFO.statusDetail = '상담종료';

            this.CHAT_STAT = 'CMPL';
            //상담저장폼이 닫혀있고 진행중인 상담이 종료되었을 때 저장폼 보여주기
            if(!this.slideChat && this.chat_list_data.CLK_DATA.CUTT_STTS_CD == 'AFTPRCS'){
              this.slideChat = true;
            }
          }
          this.chatDtlSrch();
        }
      }
    });

    /**
     * 채팅 메시지 전송
     */
    this.$eventBus.$on("userchatMessage", (message) => {
      this.$store.dispatch("messages/AC_USER_CHAT_MESSAGE", message);
      //chatStore.userchatMessage(message);
    });

    // 스크립트 붙이기
    this.$eventBus.$on('putScript' , (payload) => {
		  this.putScript(payload);
    })

    // 채팅 키워드 검색
    this.$eventBus.$on('srchChatKeyWord' , (highlight, keyword) => {
      this.srchChatKeyWord(highlight, keyword);
    })

    // 우측 지식 정보 - 스크립트 탭 - 스크립트 새로붙이기, 이어붙이기 처리.
    this.$eventBus.$on('chatMessagePaste' , (type, message) => {
      //채팅ON 상태에서만 붙여넣기 처리.
      if(this.chat_list_data?.USER_CHT_STAT != undefined && this.chat_list_data?.USER_CHT_STAT == "CHT_WAIT") {
        if(this.CHAT_STAT != 'ING') {
          this.showToast(this.MESSAGE.INFO.SHORTCUT_CHAT_STAT)
        } else {
          message = message.replace(/(?:\r\n|\r|\n)/g, "\n")
          if(type === "NEW") {
            //새로 붙이기
            this.CHAT_INPUT.textarea = message;
          } else {
            //이어 붙이기
            this.CHAT_INPUT.textarea += message;
          }
          this.$refs.chatInput.focus();
        }

      } else {
        this.showToast(this.MESSAGE.INFO.SHORTCUT_USER_CHT_STAT)
      }
    })

    //일괄저장 버튼 클릭(일괄저장 폼 뿌려주기)
    this.$eventBus.$on("clickBat", (click) => {
      if(click){
        this.BAT_BTN = true
        this.slideChat = true;
        this.SELECTED_CHAT_OFF = {
          text: "상담저장"
          , active: 'slideChatSave'
          , icon: 'chat-save'
        };
      } else {
        this.BAT_BTN = false;
        this.BAT_CUTT_LIST = [];
      }
    });

    //일괄저장 리스트 체크
    this.$eventBus.$on("checkBat", (check) => {
      if(check.checked){
        this.BAT_CUTT_LIST.push(check);
      } else {
        for(let i=0;i<this.BAT_CUTT_LIST.length;i++){
          if(check.CHT_CUTT_ID == this.BAT_CUTT_LIST[i].CHT_CUTT_ID){
            delete this.BAT_CUTT_LIST[i];
          }
        }
      }
    });


    /**
     *
     * 고객 통합 후 채팅고객 id 업데이트
    */
    this.$eventBus.$on("chtCustMerge", (cust_id) => {
      if(this.chat_list_data.CLK_DATA){
        this.chat_list_data.CLK_DATA["CUST_ID"] = cust_id
      }
    });


    //브라우저 종료 시 이벤트
    //브라우저 강제 종료 시 웹소켓 연결 끊고 채팅상태 off처리
    window.addEventListener('beforeunload', (event) => {
      console.log( "beforeunloadReTryCnt : " +  beforeunloadReTryCnt );
      if( beforeunloadReTryCnt > 0 ) {  //로그아웃시 중복호출 증상으로 인한.
        //채팅 off 처리
        this.chat_list_data.USER_CHT_STAT = 'CHT_CANT';
        this.userChtStatChg();
        //웹소켓 disconnect
        this.disconnect();
        --beforeunloadReTryCnt;
      }
    });
  },

  async mounted() {
    beforeunloadReTryCnt = 1; //로그아웃시 중복호출 증상으로 인한.
    this.FBDWD_YN = await this.mixin_getChtStng('PROHIBITE_APPLY_YN');
    this.SHOW_QSTN = await this.mixin_getChtStng('INQRY_SHOW_YN');
    this.CUTT_CN_VALID = await this.mixin_getChtStng('CUTT_CN_VALID');
    
    window.addEventListener('message', (event) => {
      //웹소켓 disconnect
      this.receiveMsgFromChild(event);
    });
  },

  methods: {
    //*************************************
    //        위치정보, 연락처정보 전송
    //*************************************
    // 보내기 버튼
    async sendInfoBtn(){
      // 컴포넌트로 파라미터 전달하여 발송 함수 실행
      eventBus.setSendInfoParm(this.DATA_TYPE_PROP, this.CUST_INFO);
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
    // 채팅 상세 조건 메뉴 drop
    closeDropMainDetail(){
      this.dropChatDetail = false;
    },

    // 이미지 전송
    clickAddFiles() {
      this.qstnTreeSrch();
      this.mixin_showDialog('ImgSend')
    },
    // 상담종료 drop
    chat_off() {
      //완료된 상담일 때
      if(this.CHAT_STAT == 'CMPL' || this.CHAT_STAT == 'CMPL_TRAN'){
        return
      }
      this.dropChatOff = !this.dropChatOff;
    },
    // 상담종료 선택
    selectChatList(item) {
      //상담종료버튼 클릭
      if(item.active === 'slideChatOff') {
        let chnClsfCd = this.chat_list_data.CLK_DATA.CHN_CLSF_CD;
        console.log("this.chat_list_data.CLK_DATA", this.chat_list_data.CLK_DATA)
        if(chnClsfCd !== 'EMAIL' && chnClsfCd !== 'BBS') this.sendMsg('end');
        //상담 종료 후 상담 저장폼 보여주기
        this.slideChat = true;
        return
      } else if(item.active == "slideChatTemp"){
        this.TEMP_YN = 'Y';
      }
      //상담유형이 있으면 상담유형 세팅
      // console.log("chat_list_data IN main ", this.chat_list_data)
      if(this.chat_list_data.CLK_DATA.CUTT_TYPE_ID){
        this.selCuttTypeSrch();
      } else {
        this.cuttTypeSrch();
        this.CUTT_TYPE_ID='';          //선택 상담유형
      }
      this.slideChat = true;
      this.SELECTED_CHAT_OFF = item;
    },
    //채팅 전달
    showSldeChatSend(){
      this.tranUserSrch();
      this.slideChat = true;
      this.chat_send_slide = true;
      this.chat_callback_slide = false;
    },
    //콜백 슬라이드
    showSldeChatCallback(){
      this.CLBK_YN = 'Y';
      this.slideChat = true;
      this.chat_callback_slide = true;
      this.chat_send_slide = false;
    },
    //slide close
    slideClose() {
      this.slideChat = false
      this.chat_send_slide = false;
      this.chat_callback_slide = false;

      // this.initSaveData();
    },
    //이메일 컴포넌트에서 호출함
    slideOpen() {
      console.log("====================slideOpen")
      this.slideChat = true
    },

    // 챗콜백
    toggleChkReserve(event) {
      this.posX = event.clientX;
      this.posY = event.clientY - 250;

      if( this.chkDateReserve === true) {
        this.CLBK_YN = 'Y'
        this.dropDateReserve = true;
      } else {
        this.CLBK_YN = 'N'
        this.dropDateReserve = false;
        this.dateReservePicker = false;
        return
      }
    },
    showDatePicker(){
      this.dateReservePicker = true;
      this.dropDateReserve = false;
    },
    selectReserveDateTime(date) {
      // getReserveTime 메소드를 호출하여 반환된 값을 변수에 저장
      let getDate = this.getReserveTime(date);

      // 날짜와 시간을 따로 분리하여 데이터 속성에 저장
      this.dateTimeDate = new Date(getDate[0]).toISOString().substr(0, 10);
      getDate[3].toString().length === 1 ? getDate[3] = "0" + getDate[3] : null;
      this.selectedTime = `${String(getDate[3]).padStart(2, '0')}:${String(getDate[4]).padStart(2, '0')}`;
      this.selectedAmpm = `${getDate[2]}`;

      this.showDatePicker();
    },
    getReserveTime(date) {
      let newDate = this[`${date[0]}`];
      let newTime = this[`${date[1]}`];
      let newDay = new Date( new Date(newDate).setDate(new Date(newDate).getDate() + date[2]) );

      let newTimeHours = new Date(newTime).getHours() + date[3];
      let newTimeMinutes = new Date(newTime).getMinutes() + date[4];
      let ampm = newTimeHours < 12 ? "오전" : "오후";

      let daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
      let dayOfWeek = daysOfWeek[newDay.getDay()];
      if( date[2] === 0 ) {
          dayOfWeek = '오늘';
      }

      newTimeHours = newTimeHours % 12 || 12;

      if ( newTimeMinutes >= 60) {
        newTimeHours = newTimeHours + 1;
        newTimeMinutes = newTimeMinutes % 60;
      }

      let calculateDate = [newDay.toISOString().substr(0, 10), dayOfWeek, ampm, newTimeHours, newTimeMinutes];

      return calculateDate;
    },
    displayReserveTime(date) {
      let getDate = this.getReserveTime(date);
      let targetDate = `${ getDate[1] } ${getDate[2]} ${String(getDate[3]).padStart(2, '0')}:${String(getDate[4]).padStart(2, '0')}`;

      return targetDate;
    },
    // 통합 접촉이력
    toggleResize() {
      this.cus_info_resizeClass = !this.cus_info_resizeClass;
    },
    searchAlllog(){
      // console.log('통합접촉이력 조회');
    },

    // VOC 저장
    saveVocData() {
      this.$refs.vocDataCompo.saveVocData();
    },

    //채팅리스트 클릭 시 이벤트
    chatDtlSrch(){
      for(let n=0;n<this.NEW_CHAT_LIST.length;n++){
        if(this.chat_list_data.CLK_DATA.CHT_CUTT_DTL_ID == this.NEW_CHAT_LIST[n]){
          this.NEW_CHAT_LIST.splice(n,1);
        }
      }
      if(this.NOW_CHAT != this.chat_list_data.CLK_DATA.CHT_CUTT_ID || (this.NOW_CHAT == this.chat_list_data.CLK_DATA.CHT_CUTT_ID && this.chat_list_data.CLK_DATA.STTS_CD == 'wait')){
        //같은 채팅을 클릭한것이 아닐 때
        this.chatHstSrch();
        this.CHAT_INPUT.textarea = '';

        //챗봇으로 들어온 채팅일 때
        this.CHBT_USER = {};      //챗봇고객 정보
        this.CHBT_INFO = [];      //챗봇상담 내역
        if(this.chat_list_data.CLK_DATA.CHBT_YN == 'Y'){
          this.getChbtUserData();
          this.getChbtData();
        }
      } else if(this.NOW_CHAT == this.chat_list_data.CLK_DATA.CHT_CUTT_ID && this.chat_list_data.CLK_DATA.CUTT_STTS_CD == 'ING'){
        //현재 진행중인 채팅방을 클릭하고있을 때
        this.chatHstSrch('ING');
      }
      this.NOW_CHAT = this.chat_list_data.CLK_DATA.CHT_CUTT_ID
      // 채팅 인입시 고객정보,상담이력 깜빡임=>따로 처리
      // this.getCustDefaultInfo();

      //상담 저장폼이 열려있고 진행중인 상담을 클릭했을 때 저장폼 닫아주기
      //완료된 상담일때도 닫아주기
      //대기중인 상담을 클릭했을 때도 닫아주기
      if(this.slideChat && (this.chat_list_data.CLK_DATA.CUTT_STTS_CD == 'ING'|| this.chat_list_data.CLK_DATA.CUTT_STTS_CD.indexOf("WAIT") != -1 || this.chat_list_data.CLK_DATA.CUTT_STTS_CD.indexOf("CMPL") != -1)){
        this.slideChat = false;
      }

      this.CHAT_TOP_INFO = {
        cus_name: this.chat_list_data.CLK_DATA.CUST_NM,
        talk_ch: this.chat_list_data.CLK_DATA.CHN_CLSF_CD_NM,
        favortie: this.chat_list_data.CLK_DATA.BMK_YN == 'Y' ? true : false,
        status: this.chat_list_data.CLK_DATA.STTS_CD == 'done' || this.chat_list_data.CLK_DATA.STTS_CD == 'after' ? 'main' : 'error', //error 상담중 , main 상담완료
        date : this.chat_list_data.CLK_DATA.CUTT_BGNG_DT,
        statusDetail: this.chat_list_data.CLK_DATA.CUTT_STTS_CD_NM
      },
      this.CHNL_CL = this.chat_list_data.CLK_DATA.CHN_CLSF_CD;

      if(this.lottieFavorite != null){
        this.aniFavorite(this.CHAT_TOP_INFO.favortie);
      } else {
        //v-if에 감싸여진 vLottiePlayer는 클릭 후 랜더링되는데 시간이 걸림
        setTimeout(() => {
          this.aniFavorite(this.CHAT_TOP_INFO.favortie);
        }, 5 * 100); // 5밀리초
      }

      this.SYSTEM_MSG_STAT = this.chat_list_data.CLK_DATA.SYS_MSG_SKIP_YN == 'N' ? false : true;

      //전달 또는 콜백으로 상담유형이나 내용이 이미 있으면 세팅
      this.CUTT_CN = this.chat_list_data.CLK_DATA.CUTT_CN;
      if(this.chat_list_data.CLK_DATA.CUTT_TYPE_CD){
        this.selCuttTypeSrch();
      } else {
        this.CUTT_TYPE_ID='';          //선택 상담유형
      }
    },

    //고객정보 조회
    async getCustDefaultInfo() {
      let sUrl = '/api/setting/customer/custDefaultInfo';
      let postParam = {
        CUST_ID : this.chat_list_data.CLK_DATA.CUST_ID
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        if(response.DATA.length > 0){
          response.DATA[0].CUST_ID = Number(response.DATA[0].CUST_ID);
          response.DATA[0].CUST_NM = response.DATA[0].CUST_NM?response.DATA[0].CUST_NM:'성명미상';
          this.CUST_INFO = response.DATA[0];
          this.CUST_INFO.CHNL = 'SNS';
          this.CUST_INFO.portrait = require('@/assets/img/@profile_customer.png');
        }else{
          this.CUST_INFO = {
            CUST_ID : -1
            , CUST_PHN_NO : ''
            , CUST_NM : '성명미상'
            , CHNL : 'SNS'
            , portrait : require('@/assets/img/@profile_customer.png')
          }
        }

        // console.log("this.CUST_INFO", this.CUST_INFO);

        // if(this.$refs.MainchatCusInfo != undefined){
        //   this.$refs.MainchatCusInfo.getCustInfo(this.CUST_INFO); //고객정보 조회
        // }
        // if(this.$refs.MainchatAllLog != undefined){
        //   this.$refs.MainchatAllLog.getIntegHist(this.CUST_INFO); //고객 통합 이력 조회
        // }
        // if(this.$refs.MainchatAllLog != undefined){
        //   this.$refs.MainchatAllLog.initRealtimeSearch(); //실시간 검색 탭 초기화
        // }

        eventBus.setCustInfo(this.CUST_INFO);
      }
    },

    //채팅 내역 조회
    async chatHstSrch(chat){
      console.log("chat - 0", chat)
      if(this.chat_list_data.CLK_DATA.CHT_CUTT_ID == '' || this.chat_list_data.CLK_DATA.CHT_CUTT_ID == null || this.chat_list_data.CLK_DATA.CHT_CUTT_ID == undefined){
        //채팅내용 조회 시 채팅의 id가 감지되지 않는다면 api통신하지 않음
        //채팅id가 없는 채팅내용조회때문에 쿼리오류 지속 발생
        return;
      }

      // console.log("this.chat_list_data.CLK_DATA",this.chat_list_data.CLK_DATA);
      let sUrl = '/chat-api/main/cnslt-cn/inqire';
      let postParam = {
        CHT_CUTT_ID: chat == 'BFR' ? (this.BFR_CHAT_LOG.length != 0 ? this.BFR_CHAT_LOG[0].BFR_CHT : this.CHAT_LOG[0].BFR_CHT) : (chat == 'AFTR' ? this.CHAT_LOG[this.CHAT_LOG.length-1].AFTR_CHT : (this.chat_list_data.CLK_DATA.CHT_CUTT_ID ? this.chat_list_data.CLK_DATA.CHT_CUTT_ID : this.NOW_CHAT)),
        CUST_ID: this.chat_list_data.CLK_DATA.CUST_ID,
        CUTT_STTS_CD: this.chat_list_data.CLK_DATA.CUTT_STTS_CD,
        CHT_RDY_ID: this.chat_list_data.CLK_DATA.CUTT_STTS_CD.indexOf('WAIT') != -1 ? this.chat_list_data.CLK_DATA.CHT_RDY_ID : '',
        CHT_USER_KEY : this.chat_list_data.CLK_DATA.CHT_USER_KEY,
        SNDR_KEY : this.chat_list_data.CLK_DATA.SNDR_KEY,
        CHN_CLSF_CD : this.chat_list_data.CLK_DATA.CHN_CLSF_CD,
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.chat_postCall(sUrl, postParam, headParam)
      if(!resData.header.ERROR_FLAG){
        //채팅 모드 초기화
        this.CHAT_CUTT_MODE = 'CHAT';
        let msgTypeCd = '';

        if(chat == 'BFR' || chat == 'AFTR'){
          let nowChat = [];
          if(chat == 'BFR'){
            nowChat = this.BFR_CHAT_LOG;
          } else {
            nowChat = this.CHAT_LOG;
          }
          let chatLog = [];
          let leng = resData.data.length;
          for(let i=0;i<leng;i++){
            let chatDate = this.mixin_convertDate(resData.data[i]["REG_DT"], 'yyyy-MM-dd HH:mm:ss')
            if(this.SHOW_QSTN == 'Y'){
              if(resData.data[i]["MSG_TYPE_CD"] == 'INFOMSG' && msgTypeCd != 'INFOMSG'){
                chatLog.push(
                  {
                    TYPE: resData.data[i+1]["MSG_TYPE_CD"],
                    SNDRCV_CD: resData.data[i+1]["RCPTN_DSPTCH_CD"],
                    SNDRCV_NM: resData.data[i+1]["CD_NM"],
                    IMAGE_URL: resData.data[i+1]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i+1]["RCPTN_DSPTCH_MSG"] : resData.data[i+1]["RCPTN_DSPTCH_MSG"],
                    CONTENT: this.FBDWD_YN == 'Y' && resData.data[i]["MSG_TYPE_CD"] != 'FI' && resData.data[i]["MSG_TYPE_CD"] != 'AU'
                      ? (this.HIGHLIGHT ? resData.data[i+1]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i+1]["CHG_RCPTN_DSPTCH_MSG"])
                      : (this.HIGHLIGHT ? resData.data[i+1]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i+1]["RCPTN_DSPTCH_MSG"]),
                    CHAT_DATE: chatDate,
                    BFR_CHT: resData.header.BFR_CHT,
                    AFTR_CHT: resData.header.AFTR_CHT,
                    QSTN_TYPE_NM: resData.data[i+1]["QSTN_TYPE_NM"],
                    QSTN_TYPE_MSG: resData.data[i+1]["QSTN_TYPE_MSG"],
                    QSTN_BTN_LIST: resData.data[i+1]["BTN_LIST"].split('||'),
                    RSVT_BTN_LIST: resData.data[i+1]["RSVT_BTN"].split('||')
                  },
                )
                msgTypeCd = 'INFOMSG';
              } else if (resData.data[i]["MSG_TYPE_CD"] == 'QSTN' && msgTypeCd == 'INFOMSG') {
                chatLog.push(
                  {
                    TYPE: resData.data[i-1]["MSG_TYPE_CD"],
                    SNDRCV_CD: resData.data[i-1]["RCPTN_DSPTCH_CD"],
                    SNDRCV_NM: resData.data[i-1]["CD_NM"],
                    IMAGE_URL: resData.data[i-1]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i-1]["RCPTN_DSPTCH_MSG"] : resData.data[i-1]["RCPTN_DSPTCH_MSG"],
                    CONTENT: this.FBDWD_YN == 'Y' && resData.data[i]["MSG_TYPE_CD"] != 'FI' && resData.data[i-1]["MSG_TYPE_CD"] != 'AU'
                      ? (this.HIGHLIGHT ? resData.data[i-1]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i-1]["CHG_RCPTN_DSPTCH_MSG"])
                      : (this.HIGHLIGHT ? resData.data[i-1]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i-1]["RCPTN_DSPTCH_MSG"]),
                    CHAT_DATE: chatDate,
                    BFR_CHT: resData.header.BFR_CHT,
                    AFTR_CHT: resData.header.AFTR_CHT,
                    QSTN_TYPE_NM: resData.data[i-1]["QSTN_TYPE_NM"],
                    QSTN_TYPE_MSG: resData.data[i-1]["QSTN_TYPE_MSG"],
                    QSTN_BTN_LIST: resData.data[i-1]["BTN_LIST"].split('||'),
                    RSVT_BTN_LIST: resData.data[i-1]["RSVT_BTN"].split('||')
                  },
                )
                msgTypeCd = '';
              } else {
                chatLog.push(
                  {
                    TYPE: resData.data[i]["MSG_TYPE_CD"],
                    SNDRCV_CD: resData.data[i]["RCPTN_DSPTCH_CD"],
                    SNDRCV_NM: resData.data[i]["CD_NM"],
                    IMAGE_URL: resData.data[i]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i]["RCPTN_DSPTCH_MSG"] : resData.data[i]["RCPTN_DSPTCH_MSG"],
                    //CONTENT: resData.data[i]["RCPTN_DSPTCH_MSG"],
                    CONTENT: this.FBDWD_YN == 'Y' && resData.data[i]["MSG_TYPE_CD"] != 'FI' && resData.data[i]["MSG_TYPE_CD"] != 'AU'
                      ? (this.HIGHLIGHT ? resData.data[i]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i]["CHG_RCPTN_DSPTCH_MSG"])
                      : (this.HIGHLIGHT ? resData.data[i]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i]["RCPTN_DSPTCH_MSG"]),
                    CHAT_DATE: chatDate,
                    BFR_CHT: resData.header.BFR_CHT,
                    AFTR_CHT: resData.header.AFTR_CHT,
                    QSTN_TYPE_NM: resData.data[i]["QSTN_TYPE_NM"],
                    QSTN_TYPE_MSG: resData.data[i]["QSTN_TYPE_MSG"],
                    QSTN_BTN_LIST: resData.data[i]["BTN_LIST"].split('||'),
                    RSVT_BTN_LIST: resData.data[i]["RSVT_BTN"].split('||')
                  },
                )
              }
              if(i==leng-1){
                if(chat == 'BFR'){
                  //이전채팅 구분선
                  if(resData.data[i]["MSG_TYPE_CD"] == 'INFOMSG' && msgTypeCd != 'INFOMSG'){
                    chatLog.push(
                      {
                        TYPE: 'CHT_SE',
                        SNDRCV_CD: resData.data[i+1]["RCPTN_DSPTCH_CD"],
                        SNDRCV_NM: resData.data[i+1]["CD_NM"],
                        IMAGE_URL: resData.data[i+1]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i+1]["RCPTN_DSPTCH_MSG"] : resData.data[i+1]["RCPTN_DSPTCH_MSG"],
                        CONTENT: '----- 이전채팅 구분 -----',
                        CHAT_DATE: chatDate,
                        BFR_CHT: resData.header.BFR_CHT,
                        AFTR_CHT: resData.header.AFTR_CHT,
                        QSTN_TYPE_NM: resData.data[i+1]["QSTN_TYPE_NM"],
                        QSTN_TYPE_MSG: resData.data[i+1]["QSTN_TYPE_MSG"],
                        QSTN_BTN_LIST: resData.data[i+1]["BTN_LIST"].split('||'),
                        RSVT_BTN_LIST: resData.data[i+1]["RSVT_BTN"].split('||')
                      }
                    )
                    msgTypeCd = 'INFOMSG';
                  } else if (resData.data[i]["MSG_TYPE_CD"] == 'QSTN' && msgTypeCd == 'INFOMSG') {
                    chatLog.push(
                      {
                        TYPE: 'CHT_SE',
                        SNDRCV_CD: resData.data[i-1]["RCPTN_DSPTCH_CD"],
                        SNDRCV_NM: resData.data[i-1]["CD_NM"],
                        IMAGE_URL: resData.data[i-1]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i-1]["RCPTN_DSPTCH_MSG"] : resData.data[i-1]["RCPTN_DSPTCH_MSG"],
                        CONTENT: '----- 이전채팅 구분 -----',
                        CHAT_DATE: chatDate,
                        BFR_CHT: resData.header.BFR_CHT,
                        AFTR_CHT: resData.header.AFTR_CHT,
                        QSTN_TYPE_NM: resData.data[i-1]["QSTN_TYPE_NM"],
                        QSTN_TYPE_MSG: resData.data[i-1]["QSTN_TYPE_MSG"],
                        QSTN_BTN_LIST: resData.data[i-1]["BTN_LIST"].split('||'),
                        RSVT_BTN_LIST: resData.data[i-1]["RSVT_BTN"].split('||')
                      }
                    )
                    msgTypeCd = '';
                  } else{
                    chatLog.push(
                      {
                        TYPE: 'CHT_SE',
                        SNDRCV_CD: resData.data[i]["RCPTN_DSPTCH_CD"],
                        SNDRCV_NM: resData.data[i]["CD_NM"],
                        IMAGE_URL: resData.data[i]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i]["RCPTN_DSPTCH_MSG"] : resData.data[i]["RCPTN_DSPTCH_MSG"],
                        //CONTENT: resData.data[i]["RCPTN_DSPTCH_MSG"],
                        CONTENT: '----- 이전채팅 구분 -----',
                        CHAT_DATE: chatDate,
                        BFR_CHT: resData.header.BFR_CHT,
                        AFTR_CHT: resData.header.AFTR_CHT,
                        QSTN_TYPE_NM: resData.data[i]["QSTN_TYPE_NM"],
                        QSTN_TYPE_MSG: resData.data[i]["QSTN_TYPE_MSG"],
                        QSTN_BTN_LIST: resData.data[i]["BTN_LIST"].split('||'),
                        RSVT_BTN_LIST: resData.data[i]["RSVT_BTN"].split('||')
                      }
                    )
                  } 
                } else if (chat == 'AFTR'){
                  chatLog.unshift(
                  {
                    TYPE: 'CHT_SE',
                    SNDRCV_CD: resData.data[i]["RCPTN_DSPTCH_CD"],
                    SNDRCV_NM: resData.data[i]["CD_NM"],
                    IMAGE_URL: resData.data[i]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i]["RCPTN_DSPTCH_MSG"] : resData.data[i]["RCPTN_DSPTCH_MSG"],
                    //CONTENT: resData.data[i]["RCPTN_DSPTCH_MSG"],
                    CONTENT: '----- 이후채팅 구분 -----',
                    CHAT_DATE: chatDate,
                    BFR_CHT: resData.header.BFR_CHT,
                    AFTR_CHT: resData.header.AFTR_CHT,
                  })
                }
              }
            } else {
              if(resData.data[i]["MSG_TYPE_CD"] != 'QSTN'){
                chatLog.push(
                  {
                    TYPE: resData.data[i]["MSG_TYPE_CD"],
                    SNDRCV_CD: resData.data[i]["RCPTN_DSPTCH_CD"],
                    SNDRCV_NM: resData.data[i]["CD_NM"],
                    IMAGE_URL: resData.data[i]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i]["RCPTN_DSPTCH_MSG"] : resData.data[i]["RCPTN_DSPTCH_MSG"],
                    //CONTENT: resData.data[i]["RCPTN_DSPTCH_MSG"],
                    CONTENT: this.FBDWD_YN == 'Y' && resData.data[i]["MSG_TYPE_CD"] != 'FI' && resData.data[i]["MSG_TYPE_CD"] != 'AU'
                      ? (this.HIGHLIGHT ? resData.data[i]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i]["CHG_RCPTN_DSPTCH_MSG"])
                      : (this.HIGHLIGHT ? resData.data[i]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i]["RCPTN_DSPTCH_MSG"]),
                    CHAT_DATE: chatDate,
                    BFR_CHT: resData.header.BFR_CHT,
                    AFTR_CHT: resData.header.AFTR_CHT,
                  },
                )
                if(i==leng-1){
                  if(chat == 'BFR'){
                    //이전채팅 구분선
                    chatLog.push(
                    {
                      TYPE: 'CHT_SE',
                      SNDRCV_CD: resData.data[i]["RCPTN_DSPTCH_CD"],
                      SNDRCV_NM: resData.data[i]["CD_NM"],
                      IMAGE_URL: resData.data[i]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i]["RCPTN_DSPTCH_MSG"] : resData.data[i]["RCPTN_DSPTCH_MSG"],
                      //CONTENT: resData.data[i]["RCPTN_DSPTCH_MSG"],
                      CONTENT: '----- 이전채팅 구분 -----',
                      CHAT_DATE: chatDate,
                      BFR_CHT: resData.header.BFR_CHT,
                      AFTR_CHT: resData.header.AFTR_CHT,
                    })
                  } else if (chat == 'AFTR'){
                    chatLog.unshift(
                    {
                      TYPE: 'CHT_SE',
                      SNDRCV_CD: resData.data[i]["RCPTN_DSPTCH_CD"],
                      SNDRCV_NM: resData.data[i]["CD_NM"],
                      IMAGE_URL: resData.data[i]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i]["RCPTN_DSPTCH_MSG"] : resData.data[i]["RCPTN_DSPTCH_MSG"],
                      //CONTENT: resData.data[i]["RCPTN_DSPTCH_MSG"],
                      CONTENT: '----- 이후채팅 구분 -----',
                      CHAT_DATE: chatDate,
                      BFR_CHT: resData.header.BFR_CHT,
                      AFTR_CHT: resData.header.AFTR_CHT,
                    })
                  }
                }
              }
            }
          }
          if(chat == 'BFR'){
            for(let n=0;n<nowChat.length;n++){
              chatLog.push(nowChat[n]);
            }
            // this.CHAT_LOG = chatLog;
            this.BFR_CHAT_LOG = chatLog;

          } else {
            for(let n=0;n<chatLog.length;n++){
              nowChat.push(chatLog[n]);
            }
            this.CHAT_LOG = nowChat;
          }
        } else {
          if(this.chat_list_data.CLK_DATA.CUTT_STTS_CD == 'TRAN_WAIT'|| this.chat_list_data.CLK_DATA.CUTT_STTS_CD == 'WAIT'|| this.chat_list_data.CLK_DATA.CUTT_STTS_CD == 'CLBK_WAIT'){ //전달,대기,콜백건 클릭 시
            this.chat_list_data.CLK_DATA.CUTT_STTS_CD = 'ING';
            this.chat_list_data.CLK_DATA.STTS_CD = 'cs';
            this.CHAT_TOP_INFO.status = 'cs';
            this.chat_list_data.CLK_DATA.CUTT_STTS_CD_NM = '상담중';
            this.CHAT_TOP_INFO.statusDetail = '상담중';

            this.CHAT_STAT = this.chat_list_data.CLK_DATA.CUTT_STTS_CD
            // this.CHAT_OFF_LIST = [
            //   { text: "상담종료", active: 'slideChatOff', icon: 'chat-off'},
            //   { text: "임시저장", active: 'slideChatTemp', icon: 'chat-temp'},
            // ]
          } else if(this.chat_list_data.CLK_DATA.CUTT_STTS_CD == 'ING'){
            this.CHAT_STAT = this.chat_list_data.CLK_DATA.CUTT_STTS_CD
            // this.CHAT_OFF_LIST = [
            //   { text: "상담종료", active: 'slideChatOff', icon: 'chat-off'},
            //   { text: "임시저장", active: 'slideChatTemp', icon: 'chat-temp'},
            // ]
          } else {
            this.CHAT_STAT = this.chat_list_data.CLK_DATA.CUTT_STTS_CD
            // this.CHAT_OFF_LIST = [
            //   { text: "상담저장", active: 'slideChatSave', icon: 'chat-save'},
            // ]
          }

          if(chat == 'ING'){
            let nowChat = this.CHAT_LOG;
            let leng = nowChat.length
            let nowChatCnt = 0
            for(let i=0;i<leng;i++){
              if(nowChat[i].BFR_CHT == resData.header.BFR_CHT){
                nowChatCnt = nowChatCnt+1;
              }
            }
            let inChat = [];
            let lengIn = resData.data.length;
            for(let n=0;n<lengIn;n++){
              let chatDate = this.mixin_convertDate(resData.data[n]["REG_DT"], 'yyyy-MM-dd HH:mm:ss')
              if(this.SHOW_QSTN == 'Y'){
                if(resData.data[n]["MSG_TYPE_CD"] != 'EMAIL' && resData.data[n]["MSG_TYPE_CD"] != 'BBS'){
                  if(resData.data[n]["MSG_TYPE_CD"] == 'INFOMSG' && msgTypeCd != 'INFOMSG'){
                    inChat.push(
                      {
                        TYPE: resData.data[n+1]["MSG_TYPE_CD"],
                        SNDRCV_CD: resData.data[n+1]["RCPTN_DSPTCH_CD"],
                        SNDRCV_NM: resData.data[n+1]["CD_NM"],
                        IMAGE_URL: resData.data[n+1]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[n+1]["RCPTN_DSPTCH_MSG"] : resData.data[n+1]["RCPTN_DSPTCH_MSG"],
                        CONTENT: this.FBDWD_YN == 'Y'
                          ? (this.HIGHLIGHT ? resData.data[n+1]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[n+1]["CHG_RCPTN_DSPTCH_MSG"])
                          : (this.HIGHLIGHT ? resData.data[n+1]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[n+1]["RCPTN_DSPTCH_MSG"]),
                        CHAT_DATE: chatDate,
                        BFR_CHT: resData.header.BFR_CHT,
                        AFTR_CHT: resData.header.AFTR_CHT,
                        QSTN_TYPE_NM: resData.data[n+1]["QSTN_TYPE_NM"],
                        QSTN_TYPE_MSG: resData.data[n+1]["QSTN_TYPE_MSG"],
                        QSTN_BTN_LIST: resData.data[n+1]["BTN_LIST"].split('||'),
                        RSVT_BTN_LIST: resData.data[n+1]["RSVT_BTN"].split('||')
                      },
                    )
                    msgTypeCd = 'INFOMSG';
                  } else if(resData.data[n]["MSG_TYPE_CD"] == 'QSTN' && msgTypeCd == 'INFOMSG'){
                    inChat.push(
                      {
                        TYPE: resData.data[n-1]["MSG_TYPE_CD"],
                        SNDRCV_CD: resData.data[n-1]["RCPTN_DSPTCH_CD"],
                        SNDRCV_NM: resData.data[n-1]["CD_NM"],
                        IMAGE_URL: resData.data[n-1]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[n-1]["RCPTN_DSPTCH_MSG"] : resData.data[n-1]["RCPTN_DSPTCH_MSG"],
                        CONTENT: this.FBDWD_YN == 'Y'
                          ? (this.HIGHLIGHT ? resData.data[n-1]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[n-1]["CHG_RCPTN_DSPTCH_MSG"])
                          : (this.HIGHLIGHT ? resData.data[n-1]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[n-1]["RCPTN_DSPTCH_MSG"]),
                        CHAT_DATE: chatDate,
                        BFR_CHT: resData.header.BFR_CHT,
                        AFTR_CHT: resData.header.AFTR_CHT,
                        QSTN_TYPE_NM: resData.data[n-1]["QSTN_TYPE_NM"],
                        QSTN_TYPE_MSG: resData.data[n-1]["QSTN_TYPE_MSG"],
                        QSTN_BTN_LIST: resData.data[n-1]["BTN_LIST"].split('||'),
                        RSVT_BTN_LIST: resData.data[n-1]["RSVT_BTN"].split('||')
                      },
                    )
                    msgTypeCd = '';
                  } else {
                    inChat.push(
                      {
                        TYPE: resData.data[n]["MSG_TYPE_CD"],
                        SNDRCV_CD: resData.data[n]["RCPTN_DSPTCH_CD"],
                        SNDRCV_NM: resData.data[n]["CD_NM"],
                        IMAGE_URL: resData.data[n]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[n]["RCPTN_DSPTCH_MSG"] : resData.data[n]["RCPTN_DSPTCH_MSG"],
                        CONTENT: this.FBDWD_YN == 'Y'
                          ? (this.HIGHLIGHT ? resData.data[n]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[n]["CHG_RCPTN_DSPTCH_MSG"])
                          : (this.HIGHLIGHT ? resData.data[n]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[n]["RCPTN_DSPTCH_MSG"]),
                        CHAT_DATE: chatDate,
                        BFR_CHT: resData.header.BFR_CHT,
                        AFTR_CHT: resData.header.AFTR_CHT,
                        QSTN_TYPE_NM: resData.data[n]["QSTN_TYPE_NM"],
                        QSTN_TYPE_MSG: resData.data[n]["QSTN_TYPE_MSG"],
                        QSTN_BTN_LIST: resData.data[n]["BTN_LIST"].split('||'),
                        RSVT_BTN_LIST: resData.data[n]["RSVT_BTN"].split('||')
                      },
                    )
                  }
                } else if(resData.data[n]["MSG_TYPE_CD"] == 'EMAIL') {
                  this.changeEmailCuttMode(resData.data[n]);
                } else if(resData.data[n]["MSG_TYPE_CD"] == 'BBS') {
                  this.changeBbsCuttMode(resData.data[n]);
                }
              } else {
                if(resData.data[n]["MSG_TYPE_CD"] != 'QSTN' && resData.data[n]["MSG_TYPE_CD"] != 'EMAIL' && resData.data[n]["MSG_TYPE_CD"] != 'BBS'){
                  inChat.push(
                    {
                      TYPE: resData.data[n]["MSG_TYPE_CD"],
                      SNDRCV_CD: resData.data[n]["RCPTN_DSPTCH_CD"],
                      SNDRCV_NM: resData.data[n]["CD_NM"],
                      IMAGE_URL: resData.data[n]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[n]["RCPTN_DSPTCH_MSG"] : resData.data[n]["RCPTN_DSPTCH_MSG"],
                      //CONTENT: resData.data[n]["RCPTN_DSPTCH_MSG"],
                      CONTENT: this.FBDWD_YN == 'Y'
                        ? (this.HIGHLIGHT ? resData.data[n]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[n]["CHG_RCPTN_DSPTCH_MSG"])
                        : (this.HIGHLIGHT ? resData.data[n]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[n]["RCPTN_DSPTCH_MSG"]),
                      CHAT_DATE: chatDate,
                      BFR_CHT: resData.header.BFR_CHT,
                      AFTR_CHT: resData.header.AFTR_CHT,
                    },
                  )
                } else if(resData.data[n]["MSG_TYPE_CD"] == 'EMAIL') {
                  this.changeEmailCuttMode(resData.data[n]);
                } else if(resData.data[n]["MSG_TYPE_CD"] == 'BBS') {
                  this.changeBbsCuttMode(resData.data[n]);
                }
              }
            }
            let lengAdd = inChat.length
            for(let j=nowChatCnt;j<lengAdd;j++){
              this.CHAT_LOG.push(inChat[j]);
            }
          } else {
            this.CHAT_LOG = [];
            this.BFR_CHAT_LOG = [];
            let leng = resData.data.length;
            for(let i=0;i<leng;i++){
              let chatDate = this.mixin_convertDate(resData.data[i]["REG_DT"], 'yyyy-MM-dd HH:mm:ss')
              if(this.SHOW_QSTN == 'Y'){
                if(resData.data[i]["MSG_TYPE_CD"] != 'EMAIL' && resData.data[i]["MSG_TYPE_CD"] != 'BBS'){
                  if(resData.data[i]["MSG_TYPE_CD"] == 'INFOMSG' && msgTypeCd != 'INFOMSG'){
                    this.CHAT_LOG.push(
                      {
                        TYPE: resData.data[i+1]["MSG_TYPE_CD"],
                        SNDRCV_CD: resData.data[i+1]["RCPTN_DSPTCH_CD"],
                        SNDRCV_NM: resData.data[i+1]["CD_NM"],
                        IMAGE_URL: resData.data[i+1]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i+1]["RCPTN_DSPTCH_MSG"] : resData.data[i+1]["RCPTN_DSPTCH_MSG"],
                        CONTENT: this.FBDWD_YN == 'Y'
                          ? (this.HIGHLIGHT ? resData.data[i+1]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i+1]["CHG_RCPTN_DSPTCH_MSG"])
                          : (this.HIGHLIGHT ? resData.data[i+1]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i+1]["RCPTN_DSPTCH_MSG"]),
                        CHAT_DATE: chatDate,
                        BFR_CHT: resData.header.BFR_CHT,
                        AFTR_CHT: resData.header.AFTR_CHT,
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
                        SNDRCV_NM: resData.data[i-1]["CD_NM"],
                        IMAGE_URL: resData.data[i-1]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i-1]["RCPTN_DSPTCH_MSG"] : resData.data[i-1]["RCPTN_DSPTCH_MSG"],
                        CONTENT: this.FBDWD_YN == 'Y'
                          ? (this.HIGHLIGHT ? resData.data[i-1]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i-1]["CHG_RCPTN_DSPTCH_MSG"])
                          : (this.HIGHLIGHT ? resData.data[i-1]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i-1]["RCPTN_DSPTCH_MSG"]),
                        CHAT_DATE: chatDate,
                        BFR_CHT: resData.header.BFR_CHT,
                        AFTR_CHT: resData.header.AFTR_CHT,
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
                        SNDRCV_NM: resData.data[i]["CD_NM"],
                        IMAGE_URL: resData.data[i]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i]["RCPTN_DSPTCH_MSG"] : resData.data[i]["RCPTN_DSPTCH_MSG"],
                        CONTENT: this.FBDWD_YN == 'Y'
                          ? (this.HIGHLIGHT ? resData.data[i]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i]["CHG_RCPTN_DSPTCH_MSG"])
                          : (this.HIGHLIGHT ? resData.data[i]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i]["RCPTN_DSPTCH_MSG"]),
                        CHAT_DATE: chatDate,
                        BFR_CHT: resData.header.BFR_CHT,
                        AFTR_CHT: resData.header.AFTR_CHT,
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
                      SNDRCV_NM: resData.data[i]["CD_NM"],
                      IMAGE_URL: resData.data[i]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i]["RCPTN_DSPTCH_MSG"] : resData.data[i]["RCPTN_DSPTCH_MSG"],
                      //CONTENT: resData.data[i]["RCPTN_DSPTCH_MSG"],
                      CONTENT: this.FBDWD_YN == 'Y'
                        ? (this.HIGHLIGHT ? resData.data[i]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i]["CHG_RCPTN_DSPTCH_MSG"])
                        : (this.HIGHLIGHT ? resData.data[i]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i]["RCPTN_DSPTCH_MSG"]),
                      CHAT_DATE: chatDate,
                      BFR_CHT: resData.header.BFR_CHT,
                      AFTR_CHT: resData.header.AFTR_CHT,
                    },
                  )
                } else if(resData.data[i]["MSG_TYPE_CD"] == 'EMAIL') {
                  this.changeEmailCuttMode(resData.data[i]);
                }else if(resData.data[i]["MSG_TYPE_CD"] == 'BBS') {
                  this.changeBbsCuttMode(resData.data[i]);
                }
              }
            }
          }

          this.BFR_CHT_PROP = false;
        }
      }
    },

    //책갈피 추가
    async bmkStrg(){
      let BMK_YN = "";
      if (this.CHAT_TOP_INFO.favortie == false) {
        BMK_YN = "Y";
        this.aniFavorite( true );
      } else {
        BMK_YN = "N";
        this.aniFavorite( false );
      }


      let sUrl = '/chat-api/main/markup/regist';
      let postParam = {
        CHT_CUTT_ID: this.chat_list_data.CLK_DATA.CHT_CUTT_ID,
        BMK_YN: BMK_YN
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        this.CHAT_TOP_INFO.favortie = !this.CHAT_TOP_INFO.favortie;
        if(BMK_YN == 'N'){
          this.showToast(this.MESSAGE.ALERT.BMK_OFF_SUCCESS_TOAST);
        } else {
          this.showToast(this.MESSAGE.ALERT.BMK_ON_SUCCESS_TOAST);
        }
        this.$eventBus.chtListSrch();
        //this.$refs.cusListCompo.chtListSrch();

      }

    },
    // favorite animation
    aniFavorite(flag){
      const PLAYBACK_RANGE = [30, 119];
      const lottieFavorite = this.lottieFavorite;

      if (flag) {
        lottieFavorite.playSegments(PLAYBACK_RANGE, true);
      } else {
        lottieFavorite.goToAndStop(0, true);
      }
    },

    //시스템 메시지 발송, 미발송
    async sysMsgOnOff(){
      if(this.chat_list_data.USER_CHT_STAT == 'CANT_CHAT' || this.chat_list_data.USER_CHT_STAT == 'CHT_CANT' || this.chat_list_data.USER_CHT_STAT == null || this.chat_list_data.USER_CHT_STAT == undefined){
        this.showAlert(this.MESSAGE.ALERT.CANT_CHAT);
        //스위치가 다시 되돌아오지 않음
        setTimeout(() => {
          this.SYSTEM_MSG_STAT = !this.SYSTEM_MSG_STAT;
        }, 1 * 10); // 1밀리초
        return;
      }
      let MSGSKIP_YN = "";
      if (this.chat_list_data.CLK_DATA.SYS_MSG_SKIP_YN == 'N') {
        MSGSKIP_YN = "Y";
        this.SYSTEM_MSG_STAT = true;
      } else {
        MSGSKIP_YN = "N";
        this.SYSTEM_MSG_STAT = false;
      }
      let sUrl = '/chat-api/main/un-rspns-mssage-sndng-setup/process';
      let postParam = {
        CHT_CUTT_ID: this.chat_list_data.CLK_DATA.CHT_CUTT_ID,
        SYS_MSG_SKIP_YN: MSGSKIP_YN,
        RCPTN_DSPTCH_MSG: MSGSKIP_YN == "N" ? this.MESSAGE.ALERT.SYS_MSG_OFF_SUCCESS_TOAST.msg : this.MESSAGE.ALERT.SYS_MSG_ON_SUCCESS_TOAST.msg
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.chat_postCall(sUrl, postParam, headParam)
      if(!resData.header.ERROR_FLAG){
        this.chat_list_data.CLK_DATA.SYS_MSG_SKIP_YN = MSGSKIP_YN;
        if(MSGSKIP_YN == 'N'){
          this.showToast(this.MESSAGE.ALERT.SYS_MSG_OFF_SUCCESS_TOAST);
        } else {
          this.showToast(this.MESSAGE.ALERT.SYS_MSG_ON_SUCCESS_TOAST);
        }
        // this.$eventBus.chtListSrch();
        this.$eventBus.$on("chtListSrch", () => {
          this.chtListSrch();
        });
        //this.$refs.cusListCompo.chtListSrch();
        this.chatDtlSrch();
      }
      this.BFR_CHT_PROP = false;

    },

    //알림창 닫기
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    expandAll(id){
      this.expanded = true;
      this.$refs[id].updateAll(true);
    },
    collapseAll(id){
      this.expanded = false;
      this.$refs[id].updateAll(false);
    },
    chat_img_expand(img) {
      this.expandImgUrl = img;
      this.mixin_showDialog('ImgExpand')
    },

    //문의유형트리 조회
    async qstnTreeSrch(){
      let sUrl = '/chat-api/setting/inqry-ty-manage/chnnl-tr/inqire';
      let postParam = {
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.QSTN_TYPE_TREE = resData.QSTN_TYPE_TREE;
      }
    },

    //트리메뉴 클릭
    //최하위 메뉴 클릭 시 이벤트
    srch_tree_act(node){
      let activeItem = []
      let leng = node.length
      if(leng != 0){
        this.QSTN_TYPE_ID = node[leng-1]
      } else {  //같은메뉴를 클릭했을 때
        activeItem[0] = this.QSTN_TYPE_ID
        this.ACT_TREE_MENU = activeItem;
      }

      let selectedNode = this.findNodeById(this.QSTN_TYPE_TREE, this.QSTN_TYPE_ID);

      if(selectedNode != null){
        this.QSTN_TYPE_ID = selectedNode.QSTN_TYPE_ID
        this.QSTN_TYPE_NM = selectedNode.QSTN_TYPE_NM
      }

      this.chtImgSrch();
    },
    //트리메뉴 활성화(폴더열기)
    //열린폴더 리스트가 node에 들어옴
    //폴더를 닫았을 때에는 node에 해당 폴더 정보가 없기때문에 ACT_TREE_LIST기준으로 가져옴
    srch_tree_open(node){
      let nodeLeng = node.length  //현재 활성화된 폴더
      let nowActive = []    //현재 클릭한 메뉴
      //전체 접기 버튼을 클릭했을 때
      if(nodeLeng == 0 && (this.QSTN_TYPE_ID == '' || this.QSTN_TYPE_ID == null || this.QSTN_TYPE_ID == undefined) ){
        // if(this.ACT_TREE_MENU.length != 0){
        //   this.ACT_TREE_MENU.pop()
        // }
        this.ACT_TREE_LIST = [];
        return;
      } else if(nodeLeng == 0 && (this.QSTN_TYPE_ID != '' && this.QSTN_TYPE_ID != null && this.QSTN_TYPE_ID != undefined) ){
        // if(this.ACT_TREE_MENU.length != 0){
        //   this.ACT_TREE_MENU.pop()
        // }
        this.ACT_TREE_LIST = [];
        return;
      }
      let actLeng = this.ACT_TREE_LIST.length //클릭하기 전 활성화된 폴더
      if(actLeng > nodeLeng){ //node에는 클릭한 순서대로 들어가기때문에 지금 클릭한 폴더를 구분해야함
        //배열을 크기순으로 나열하여 값 비교
        this.ACT_TREE_LIST.sort();
        node.sort();
        for(let i=0;i<actLeng;i++){
          if(this.ACT_TREE_LIST[i] != node[i]){
            nowActive[0] = this.ACT_TREE_LIST[i]
            break
          }
        }
      } else {  //폴더를 열었을 때
        nowActive[0] = node[nodeLeng-1]
      }
      this.QSTN_TYPE_ID = nowActive[0];
      this.ACT_TREE_MENU = nowActive;
      this.ACT_TREE_LIST = node;


      let selectedNode = this.findNodeById(this.QSTN_TYPE_TREE, this.QSTN_TYPE_ID);

      if(selectedNode != null){
        this.QSTN_TYPE_ID = selectedNode.QSTN_TYPE_ID
        this.QSTN_TYPE_NM = selectedNode.QSTN_TYPE_NM
      }

      this.chtImgSrch();
    },

    //트리 클릭 시 해당 row정보 세팅
    findNodeById(nodes, id) {
      for (let node of nodes) {
        if (node.id === id) {
          return node;
        }
        if (node.children && node.children.length > 0) {
          const foundNode = this.findNodeById(node.children, id);
          if (foundNode) {
            return foundNode;
          }
        }
      }
      return null;
    },

    //이미지(게시판 조회)
    async chtImgSrch(next){
      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let sUrl = '/api/board/chat/image-list';
      let postParam = {
        BBS_ID: '2',          //채팅게시판 조회
        CUTT_TYPE_ID: this.QSTN_TYPE_ID,      //선택한 문의유형
        PST_TTL : this.SRCH_PST_TTL           //게시판 검색
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
        //속도문제로 인해 리스트를 여기에서 초기화
        if (next == 'next'){
        } else {
          this.items = [];
        }

        let tempDataText = resData.DATA;
        let leng = tempDataText.length;
        for(let i=0;i<leng;i++){
          tempDataText[i]["IMG_URL"] = "/upload/" + tempDataText[i]["FILE_PATH"] + "/" + tempDataText[i]["STRG_FILE_NM"];
        }
        //this.items = tempDataText;
        this.items = [...this.items, ...tempDataText]
        //{ index: 1, img: require('@/assets/img/@sample2.png'), title: '신규 회원 가입 신청서 견본 신규 회원 가입 신청서 견본' },
        //img경로 설정해줘야함

        for(let i=0;i<this.items.length;i++){
          this.items[i]["index"] = i;
        }

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

    //채팅 전달
    async chatTran(){
      //전달컴포넌트와 저장 컴포넌트 공통이기때문에 필수값 체크에서 겹치는 문제발생
      //validateRules미사용
      if(this.TRAN_USER_ID == ''){
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }
      if(this.CUTT_TYPE_ID == ''){
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }
      if(this.CUTT_CN_VALID == 'Y' && !this.CUTT_CN){
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }

      let sUrl = '/api/stomp/chat/agent/forwarding';
      let postParam = {
        CHT_CUTT_ID:this.chat_list_data.CLK_DATA.CHT_CUTT_ID,
        TRAN_USER: this.TRAN_USER_ID,
        CLBK_YN: this.CLBK_YN,
        CLBK_YMD: this.CLBK_YN == 'Y' ? (this.dateTimeDate + this.selectedTime).replaceAll('-','').replaceAll(':','').replaceAll(' ','')+'00' : '',
        CLBK_BGNG_DT: this.CLBK_YN == 'Y' ? (this.dateTimeDate + this.selectedTime).replaceAll('-','').replaceAll(':','').replaceAll(' ','')+'00' : '',
        PRCS_RSLT_CD: "CMPL_TRAN",      //처리상태(전달 후 해당 상담 상태)
        CUTT_STTS_CD: "TRAN_WAIT",       //상담상태(전달 후 전달된 상담 상태)
        CUTT_TYPE_ID: this.CUTT_TYPE_ID,
        CUST_ID: this.chat_list_data.CLK_DATA.CUST_ID,
        CUST_NM: this.chat_list_data.CLK_DATA.CUST_NM,
        CUTT_CN: this.CUTT_CN,
        CHT_USER_KEY: this.chat_list_data.CLK_DATA.CHT_USER_KEY
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.chat_postCall(sUrl, postParam, headParam)
      if(resData.code == '0'){
        this.chat_list_data.CLK_DATA.CUTT_STTS_CD = 'CMPL_TRAN'
        // this.$store.commit("alertStore/hideAlert");
        // this.showAlert(this.MESSAGE.ALERT.TRAN_SUCCESS);
        this.closeMsg();
        this.showToast(this.MESSAGE.TOAST.TRAN_SUCCESS);
        this.chatDtlSrch();
        this.initSaveData();
        this.$eventBus.chtListSrch();
        //this.$refs.cusListCompo.chtListSrch();
        this.slideClose();
      } else {
        this.showAlert(this.MESSAGE.ALERT.ERROR);
      }
    },

    //상담 대기상담사 조회(전달 상담사 조회)
    async tranUserSrch(){
      let sUrl = '/chat-api/common-vue/chaton-agents/list';
      let postParam = {
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.chat_postCall(sUrl, postParam, headParam)
      if(resData.code == '0'){
        this.TRAN_USER_LIST = resData.data;
      } else {
        this.showAlert(this.MESSAGE.ALERT.ERROR);
      }
    },

    //상담 전달 직원 정보
    tranUserNm(){
      let leng = this.TRAN_USER_LIST.length
      for(let i=0;i<leng;i++){
        if(this.TRAN_USER_LIST[i].USER_ID == this.TRAN_USER_ID){
          this.TRAN_USER_NM = this.TRAN_USER_LIST[i].USER_NM;
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
          this.TRANS_USE_YN = resData.CUTT_TYPE_SETTING[0].TRANS_USE_YN;
          this.STT_USE_YN = resData.CUTT_TYPE_SETTING[0].STT_USE_YN;
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
      this.CUTT_TYPE_ID = this.CUTT_TYPE_VMODEL_ARR[idx];
      for(let k=0; k<this.CUTT_TYPE_VMODEL_ARR.length; k++){
        if(k > idx) this.CUTT_TYPE_VMODEL_ARR[k] = '';//초기화
      }
    },

    //저장 후 초기화
    initSaveData(){
      this.cuttTypeSrch();
      this.CUTT_TYPE_ID='';          //선택 상담유형

      this.CUTT_CN='';               //상담내용
      this.CLBK_YN= 'N';           //챗콜백 체크
      this.CLBK_YMD= '';             //챗콜백 시간
      this.chkDateReserve = false;    //챗콜백 체크
      this.dateReservePicker = false; //챌콜백 시간표시

      //전달 폼
      this.TRAN_USER_LIST= [];       //상담전달 직원 리스트
      this.TRAN_USER_ID= '';         //상담 전달 직원
      this.TRAN_USER_NM= '';         //상담 전달 직원

      //임시저장 폼
      this.TEMP_YN='N';              //임시저장여부

      this.chat_list_data.CLK_DATA = {};  //클릭한 채팅 상담 초기화

      if(this.mixin_getCustcoSrvcStat('TRNSF')){
        this.trnsfUseYn = false;
        this.getTrnsfExpsnAttrList(); //이관 기능 사용시 이관 확장속성 초기화
      }
    },

    //상담저장
    async cuttSave(){
      //전달컴포넌트와 저장 컴포넌트 공통이기때문에 필수값 체크에서 겹치는 문제발생
      //validateRules미사용
      if(this.CUTT_TYPE_ID == ''){
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }

      if(this.CUTT_CN_VALID == 'Y' && !this.CUTT_CN){
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }

      if(this.CLBK_YN == 'Y'){
        if(!this.chkDateReserve){
          this.$store.commit("alertStore/hideAlert");
          this.showAlert(this.MESSAGE.ALERT.VALID);
          return;
        }
      }

      //이관 사용인 경우
      if(this.mixin_getCustcoSrvcStat('TRNSF') && this.trnsfUseYn){

        for(let i in this.TRNSF_EXPSN_ATTR){
          if(this.TRNSF_EXPSN_ATTR[i].ESNTL_YN === 'Y'){ //필수 입력인 경우
            if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'TXT'){ //문자형
              if(!this.TRNSF_EXPSN_ATTR[i].V_MODEL){
                this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                return;
              }else{
                if(this.TRNSF_EXPSN_ATTR[i].V_MODEL.length > this.TRNSF_EXPSN_ATTR[i].DATA_LEN){
                  this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 0 ~ '+this.TRNSF_EXPSN_ATTR[i].DATA_LEN+'byte 이내로 입력해 주세요.', iconClass: 'is-caution', type: 'default'});
                  return;
                }
              }
            }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'NUM' || this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'NUM_COMMA'){ //숫자형
              if(!this.TRNSF_EXPSN_ATTR[i].V_MODEL){
                this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                return;
              }else{
                if(this.TRNSF_EXPSN_ATTR[i].V_MODEL.length > this.TRNSF_EXPSN_ATTR[i].DATA_LEN){
                  this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 0 ~ '+this.TRNSF_EXPSN_ATTR[i].DATA_LEN+'byte 이내로 입력해 주세요.', iconClass: 'is-caution', type: 'default'});
                  return;
                }
              }
            }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'COE'){ //단일 선택형
              if(Array.isArray(this.TRNSF_EXPSN_ATTR[i].V_MODEL)){
                let iCnt = 0;
                for(let k in this.TRNSF_EXPSN_ATTR[i].V_MODEL){
                  if(this.TRNSF_EXPSN_ATTR[i].V_MODEL[k]) iCnt++;
                }
                if(iCnt === 0){
                  this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                  return;
                }
              }else{
                if(!this.TRNSF_EXPSN_ATTR[i].V_MODEL){
                  this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                  return;
                }
              }
            }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'COE_MULTI'){ //다중 선택형
              if(this.TRNSF_EXPSN_ATTR[i].V_MODEL.length === 0){
                this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                return;
              }
            }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'DAT'){ //날짜형
              if(!this.TRNSF_EXPSN_ATTR[i].V_MODEL){
                this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                return;
              }
            }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'HASH'){ //해시태그
              let sHashTxt = '';
              let iCnt = 0;
              let iChkCnt = 0;
              for(let k in this.TRNSF_EXPSN_ATTR[i].tags){
                if(this.TRNSF_EXPSN_ATTR[i].tags[k]) iCnt++;

                if(this.TRNSF_EXPSN_ATTR[i].tags[k].text){
                  sHashTxt += (iChkCnt>0?',':'') + this.TRNSF_EXPSN_ATTR[i].tags[k].text;
                  iChkCnt++;
                }
              }
              if(iCnt === 0){
                this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                return;
              }else{
                if(sHashTxt.length > this.TRNSF_EXPSN_ATTR[i].DATA_LEN){
                  this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 0 ~ '+this.TRNSF_EXPSN_ATTR[i].DATA_LEN+'byte 이내로 입력해 주세요.', iconClass: 'is-caution', type: 'default'});
                  return;
                }
              }
            }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'POST'){ //우편번호
              if(!this.TRNSF_EXPSN_ATTR[i].V_MODEL){
                this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                return;
              }
              if(!this.TRNSF_EXPSN_ATTR[i].V_MODEL_DTL[1]){
                this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목의 상세 주소는 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                return;
              }
            }
          }
        }

        if(this.mixin_isEmpty(this.TRGT_USER_ID)){
          this.showAlert({alertDialogToggle: true, msg: '이관 대상 담당자를 선택해 주세요.', iconClass: 'is-caution', type: 'default'});
          return;
        }
      }

      //임시저장 여부
      let sUrl = this.TEMP_YN == 'Y' ? '/chat-api/main/cnslt-hist-tmpr/regist' : '/chat-api/main/cnslt-hist/regist';
      let postParam = {
        CHT_CUTT_ID:this.chat_list_data.CLK_DATA.CHT_CUTT_ID,
        //PRCS_RSLT_CD: this.TEMP_YN == 'Y' ? 'TEMP_SAVE' : (this.CLBK_YN == 'Y' ? 'CLBK_WAIT' : 'CMPL'),      //처리상태(전달 후 해당 상담 상태)
        CUTT_STTS_CD: this.TEMP_YN == 'Y' ? 'ING' : (this.CLBK_YN == 'Y' ? 'CLBK_WAIT' : 'CMPL'),       //상담상태(전달 후 전달된 상담 상태)
        CUTT_TYPE_ID: this.CUTT_TYPE_ID,
        CUST_ID: this.chat_list_data.CLK_DATA.CUST_ID,
        CUST_NM: this.chat_list_data.CLK_DATA.CUST_NM,
        CUTT_CN: this.CUTT_CN,

        CLBK_YN: this.CLBK_YN,
        CLBK_YMD: this.CLBK_YN == 'Y' ? (this.dateTimeDate + this.selectedTime).replaceAll('-','').replaceAll(':','').replaceAll(' ','')+'00' : '',
        CLBK_BGNG_DT: this.CLBK_YN == 'Y' ? (this.dateTimeDate + this.selectedTime).replaceAll('-','').replaceAll(':','').replaceAll(' ','')+'00' : '',
      }

      let headParam = {
        head : {
        }
      }

      //이관 사용인 경우
      if(this.mixin_getCustcoSrvcStat('TRNSF') && this.trnsfUseYn){
        for(let i in this.TRNSF_EXPSN_ATTR){
          if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'TXT'){ //문자형
            postParam[this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.TRNSF_EXPSN_ATTR[i].V_MODEL;
            this.TRNSF_EXPSN_ATTR[i].V_POST_PARAM = this.TRNSF_EXPSN_ATTR[i].V_MODEL;
          }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'NUM' || this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'NUM_COMMA'){ //숫자형
            postParam[this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.TRNSF_EXPSN_ATTR[i].V_MODEL;
            this.TRNSF_EXPSN_ATTR[i].V_POST_PARAM = this.TRNSF_EXPSN_ATTR[i].V_MODEL;
          }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'COE'){ //단일 선택형
            if(Array.isArray(this.TRNSF_EXPSN_ATTR[i].V_MODEL)){
              let lastVal = '';
              for(let k in this.TRNSF_EXPSN_ATTR[i].V_MODEL){
                if(this.TRNSF_EXPSN_ATTR[i].V_MODEL[k]) lastVal = this.TRNSF_EXPSN_ATTR[i].V_MODEL[k];
              }
              postParam[this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = lastVal;
              this.TRNSF_EXPSN_ATTR[i].V_POST_PARAM = lastVal;
            }else{
              postParam[this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.TRNSF_EXPSN_ATTR[i].V_MODEL;
              this.TRNSF_EXPSN_ATTR[i].V_POST_PARAM = this.TRNSF_EXPSN_ATTR[i].V_MODEL;
            }
          }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'COE_MULTI'){ //다중 선택형
            let multiData = '';
            this.TRNSF_EXPSN_ATTR[i].V_MODEL.forEach((multi, idx) => {
              multiData += (multiData?',':'') + multi.value;
            });

            this.TRNSF_EXPSN_ATTR[i].V_POST_PARAM = multiData;
          }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'DAT'){ //날짜형
            if(this.TRNSF_EXPSN_ATTR[i].V_MODEL){
              postParam[this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.TRNSF_EXPSN_ATTR[i].dateTimeDate.replace(/-/gi, '') + this.TRNSF_EXPSN_ATTR[i].selectedTime.replace(/:/gi, '')+(this.TRNSF_EXPSN_ATTR[i].selectedTime.split(':').length > 1?'':'00');
              this.TRNSF_EXPSN_ATTR[i].V_POST_PARAM = this.TRNSF_EXPSN_ATTR[i].dateTimeDate.replace(/-/gi, '') + this.TRNSF_EXPSN_ATTR[i].selectedTime.replace(/:/gi, '')+(this.TRNSF_EXPSN_ATTR[i].selectedTime.split(':').length > 1?'':'00');
            }
          }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'HASH'){ //해시태그
            let sHashTxt = '';
            let iCnt = 0;
            for(let k in this.TRNSF_EXPSN_ATTR[i].tags){
              if(this.TRNSF_EXPSN_ATTR[i].tags[k].text){
                if(this.TRNSF_EXPSN_ATTR[i].tags[k].active){
                  sHashTxt += (iCnt>0?',':'') + this.TRNSF_EXPSN_ATTR[i].tags[k].text;
                  iCnt++;
                }
              }
            }
            postParam[this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = sHashTxt;
            this.TRNSF_EXPSN_ATTR[i].V_POST_PARAM = sHashTxt;
          }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'POST'){ //우편번호
            postParam[this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.TRNSF_EXPSN_ATTR[i].V_MODEL + '|' + (this.TRNSF_EXPSN_ATTR[i].V_MODEL_DTL[0]?this.TRNSF_EXPSN_ATTR[i].V_MODEL_DTL[0]:'') + '|' + (this.TRNSF_EXPSN_ATTR[i].V_MODEL_DTL[1]?this.TRNSF_EXPSN_ATTR[i].V_MODEL_DTL[1]:'');
            this.TRNSF_EXPSN_ATTR[i].V_POST_PARAM = this.TRNSF_EXPSN_ATTR[i].V_MODEL + '|' + (this.TRNSF_EXPSN_ATTR[i].V_MODEL_DTL[0]?this.TRNSF_EXPSN_ATTR[i].V_MODEL_DTL[0]:'') + '|' + (this.TRNSF_EXPSN_ATTR[i].V_MODEL_DTL[1]?this.TRNSF_EXPSN_ATTR[i].V_MODEL_DTL[1]:'');
          }
        }

        postParam.TRNSF_EXPSN_ATTR = JSON.stringify(this.TRNSF_EXPSN_ATTR);
        postParam.TRGT_USER_ID = this.TRGT_USER_ID;
      }

      let resData  = await this.chat_postCall(sUrl, postParam, headParam);
      if (!resData.header.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        if(this.CLBK_YN == 'Y'){
          // this.showAlert(this.MESSAGE.ALERT.CLBK_SUCCESS);
          this.showToast(this.MESSAGE.TOAST.CLBK_SUCCESS);
        } else {
          // this.showAlert(this.MESSAGE.ALERT.SAVE_SUCCESS);
          this.showToast(this.MESSAGE.TOAST.SAVE_SUCCESS);
        }
        this.initSaveData();
        this.$eventBus.chtListSrch();
        //this.$refs.cusListCompo.chtListSrch();
        // this.chatDtlSrch();
        this.slideClose();
        // this.CHAT_TOP_INFO = {};  //채팅 상단
        // this.CHAT_LOG = [];       //채팅 내역
        // this.BFR_CHAT_LOG = [];   //이전채팅내역
        // this.CHBT_USER = {};      //챗봇고객 정보

        // this.CHAT_OFF_LIST= [];   //채팅 버튼 리스트

        if(this.mixin_getCustcoSrvcStat('TRNSF')){
          this.TRGT_USER_ID = '';
        }
      }
    },

    //상담일괄저장
    async cuttBatSave(){
      if(this.CUTT_TYPE_ID == ''){
        this.showAlert(this.MESSAGE.ALERT.CHK_CUTT_TYPE);
        return;
      }
      //일괄저장은 무조건 채팅 완료(CMPL)
      let sUrl = '/chat-api/main/cnslt-hist/regist';
      let cuttList = []
      let leng = this.BAT_CUTT_LIST.length
      for(let i=0;i<leng;i++){
        cuttList[i] = {
          CHT_CUTT_ID : this.BAT_CUTT_LIST[i].CHT_CUTT_ID
          , CUST_ID: this.BAT_CUTT_LIST[i].CUST_ID
          , CUST_NM: this.BAT_CUTT_LIST[i].CUST_NM
        }
      }
      let postParam = {
        CUTT_LIST: cuttList,
        CUTT_STTS_CD: 'CMPL',
        CUTT_TYPE_ID: this.CUTT_TYPE_ID,
        CUTT_CN: this.CUTT_CN,
      }

      let headParam = {
        head : {
          DATA_OBJECT: "CUTT_LIST",
        }
      }

      let resData  = await this.chat_postCall(sUrl, postParam, headParam);
      if (!resData.header.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        // this.showAlert(this.MESSAGE.ALERT.SAVE_SUCCESS);
        this.showToast(this.MESSAGE.TOAST.SAVE_SUCCESS);
        this.initSaveData();
        this.$eventBus.chtListSrch();
        this.slideClose();
        this.CHAT_TOP_INFO = {};  //채팅 상단
        this.CHAT_LOG = [];       //채팅 내역
        this.BFR_CHAT_LOG = [];   //이전채팅내역
        this.CHBT_USER = {};      //챗봇고객 정보
        // this.CHAT_OFF_LIST= [];   //채팅 버튼 리스트
      }
    },

    //상담종료
    async cuttEnd(){
      let sUrl = this.TEMP_YN == 'Y' ? '/chat-api/main/cnslt-hist-tmpr/regist' : '/chat-api/main/cnslt-hist/regist';
      let postParam = {
        CHT_CUTT_ID:this.chat_list_data.CLK_DATA.CHT_CUTT_ID,
        PRCS_RSLT_CD: this.TEMP_YN == 'Y' ? 'TEMP_SAVE' : (this.CLBK_YN == 'Y' ? 'CLBK_WAIT' : 'CMPL'),      //처리상태(전달 후 해당 상담 상태)
        CUTT_STTS_CD: this.TEMP_YN == 'Y' ? 'ING' : (this.CLBK_YN == 'Y' ? 'CLBK_WAIT' : 'CMPL'),       //상담상태(전달 후 전달된 상담 상태)
        CUTT_TYPE_ID: this.CUTT_TYPE_ID,
        CUST_ID: this.chat_list_data.CLK_DATA.CUST_ID,
        CUST_NM: this.chat_list_data.CLK_DATA.CUST_NM,
        CUTT_CN: this.CUTT_CN,

        // CLBK_YN: this.CLBK_YN,
        // CLBK_YMD: this.CLBK_YN == 'Y' ? (this.dateTimeDate + this.selectedTime).replaceAll('-','').replaceAll(':','').replaceAll(' ','')+'00' : '',
        // CLBK_BGNG_DT: this.CLBK_YN == 'Y' ? (this.dateTimeDate + this.selectedTime).replaceAll('-','').replaceAll(':','').replaceAll(' ','')+'00' : '',
      }

      let headParam = {
        head : {
        }
      }

      let resData  = await this.chat_postCall(sUrl, postParam, headParam);
      if (!resData.header.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.TRAN_SUCCESS);
        this.initSaveData();
        this.$eventBus.chtListSrch();
        //this.$refs.cusListCompo.chtListSrch();
        this.chatDtlSrch();
        this.slideClose();
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
        this.userChtStatChg();
      } else {
        this.showAlert(this.MESSAGE.ALERT.ERROR);
      }
    },

    //사용자 상담 상태 변경
    async userChtStatChg(){
      let sUrl = '/chat-api/main/cnslr-sttus/regist';
      let postParam = {
        USER_CHT_STAT: this.chat_list_data.USER_CHT_STAT,
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.chat_postCall(sUrl, postParam, headParam);
      if(!resData.header.ERROR_FLAG){
        if (this.chat_list_data.USER_CHT_STAT == "CHT_WAIT") {
          this.connect(); // ready websocket 연결
          this.$store.dispatch(
            "messages/AC_CHANGE_TALK_PROCESS_INFO",
            {
              selected_stat: "",
              userId: this.$store.getters["userStore/GE_USER_ROLE"].userId,
              custcoId: this.$store.getters["userStore/GE_USER_ROLE"].company.CD,
            }
          );
          this.showToast(this.MESSAGE.ALERT.CHT_WAIT);
        } else if (this.chat_list_data.USER_CHT_STAT == "CHT_END") {
          this.connect(); // ready websocket 연결
          this.showToast(this.MESSAGE.ALERT.CHT_END);
        } else {
          // this.disconnect(); // ready websocket 연결
          this.showToast(this.MESSAGE.ALERT.CHT_CANT);
        }
        this.USER_CUTT_STAT = this.chat_list_data.USER_CHT_STAT;
      }
    },

    /**
     * websocket connect
     * @param connectCallback   연결 성공 콜백
     * @param errorCallback     연결 실패 콜백 ( 재연결 시도 )
     */
     connect() {
      let geUserId = this.$store.getters["userStore/GE_USER_ROLE"].userId;

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
          console.log("con!");
          stomeReConnectCnt = 36;
          // 연결성공( 재연결 포함 )
          stompUtil.setConnected(true);
          stompUtil.subscribe(subScribeUrl, chatMessage); // ready uri sub
          eventBus.chtListSrch();
        },
        (error) => {
          //연결실패
          console.log("discon?");
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

    /**
     * ready callback 함수
     */
    readyCallback(message) {
      // console.log("readyCallback message", message);
      if (typeof message.body !== "undefined") {
        let recvJson = JSON.parse(message.body);
        let data = JSON.parse(recvJson.telewebJsonString);
        let uri = message.headers.destination;
        if (
          recvJson.chatType == "READY" &&
          recvJson.chatEvent == "AGENT_READY"
        ) {
          let sessionId = recvJson.sessionId;
          this.$store.state.messages.simsessionId = sessionId;
        }

        // console.log("data.DATA", data.DATA);
        if (data.DATA != null && data.DATA.length > 0) {
          let i = 0;
          let dataLen = data.DATA.length;

          for (; i < dataLen; i++) {
            let custId = data.DATA[i].CUST_ID;
            let userKey = data.DATA[i].user_key;

            if (
              dataLen > 0 &&
              ((custId != null && custId) ||
                (userKey != null && userKey))
            ) {
              // 상담종료 메시지 보여줌. unsubscription ( 필요없음 redis 삭제 되므로.)
              if (recvJson.chatEvent == "EXPIRED_SESSION_CUST") {
                data.DATA[i].uri = uri;

                this.$store
                  .dispatch("messages/AC_SPICE_TALKER", data.DATA[i])
                  .then(() => {
                    // this.$store.dispatch(
                    //   "messages/AC_CHANGE_TALK_PROCESS_INFO",
                    //   {
                    //     selected_stat: "",
                    //     userId: this.$store.getters["userStore/GE_USER_ROLE"].userId,
                    //     custcoId: this.$store.getters["userStore/GE_USER_ROLE"].company.CD,
                    //   }
                    // );
                    console.log("AC_CHANGE_TALK_PROCESS_INFO");
                  }); // 목록 삭제 (구독해제 포함)
              } else {
                data.DATA[i].TALK_STAT_NM = this.mixin_get_talk_statnm(
                  data.DATA[i].CUTT_STTS_CD
                );
                data.DATA[i].USER_ID = recvJson.userId;
                data.DATA[i].AUTO_GREETING_YN =
                  data.DATA[i].CUTT_STTS_CD == "WAIT" ||
                  data.DATA[i].CUTT_STTS_CD == "TRAN_WAIT"
                    ? "N"
                    : "Y";

                this.$store
                  .dispatch("messages/AC_UN_SHIFT_TALKER", data.DATA[i])
                  .then(() => {
                    // this.$store.dispatch(
                    //   "messages/AC_CHANGE_TALK_PROCESS_INFO",
                    //   {
                    //     selected_stat: "",
                    //     userId: this.$store.getters["userStore/GE_USER_ROLE"].userId,
                    //     custcoId: this.$store.getters["userStore/GE_USER_ROLE"].company.CD,
                    //   }
                    // );
                  });
              }
            }
          }
          if(recvJson.chatEvent != "AGENT_READY"){
            this.$store.dispatch(
              "messages/AC_CHANGE_TALK_PROCESS_INFO",
              {
                selected_stat: "",
                userId: this.$store.getters["userStore/GE_USER_ROLE"].userId,
                custcoId: this.$store.getters["userStore/GE_USER_ROLE"].company.CD,
              }
            );
            this.$eventBus.chtListSrch();
          }
        }
      }
    },

    //엔터키로 채팅 보내기(줄바꿈 해제)
    //Shift + Enter 는 줄바꿈 textarea 기본 이벤트 적용
    keyDown(e) {
      if(!e.shiftKey && e.key == 'Enter'){
        e.preventDefault();
        this.sendMsg('msg');
      }
    },

    //채팅 보내기
    sendMsg(type, item){
      if(this.chat_list_data.USER_CHT_STAT == 'CANT_CHAT' || this.chat_list_data.USER_CHT_STAT == 'CHT_CANT' || this.chat_list_data.USER_CHT_STAT == null || this.chat_list_data.USER_CHT_STAT == undefined){
        this.showAlert(this.MESSAGE.ALERT.CANT_CHAT);
        return;
      }

      let msgcopy = this.CHAT_INPUT.textarea;
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
          let ARR_NUM = (msgcopy.length / 1000);
          for(let i=0;i<ARR_NUM;i++){
            MSG_INFO[i] = {
              msg: msgcopy.substring((i*1000), (i*1000)+1000),
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
          , image : this.chat_list_data.CLK_DATA.CHN_CLSF_CD == 'NTT' ? process.env.VUE_APP_API_URL + "upload/" + item.FILE_PATH + "/" + item.STRG_FILE_NM : item.FILE_PATH + "/" + item.STRG_FILE_NM
          , msg : item.FILE_PATH + "/" + item.STRG_FILE_NM
          , CONTENT : item.FILE_PATH + "/" + item.STRG_FILE_NM
          , IMAGE_TALK_PATH : item.FILE_PATH + "/" + item.STRG_FILE_NM
          , FILE_GROUP_KEY : item.FILE_GROUP_KEY
          , FILE_KEY : item.FILE_KEY
        };
      } else if(type == 'file'){
        MSG_INFO[0] = {
          message_type : item.type
          , SNDRCV_CD: 'SND'
          , type : item.type == 'AU' ? 'audio' : 'file'
          , file_url : item.file_url
          , file_name : item.type == 'AU' ? '' : item.file_name
          , file_size : item.type == 'AU' ? '' : item.file_size
          , msg : item.file_name + '||' + item.file_url
          , CONTENT : item.file_name + '||' + item.file_url
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
        chtCuttId: this.chat_list_data.CLK_DATA.CHT_CUTT_ID,
        sndrKey: this.chat_list_data.CLK_DATA.SNDR_KEY,
        chnClsfCd: this.chat_list_data.CLK_DATA.CHN_CLSF_CD,
        custcoId: this.$store.getters["userStore/GE_USER_ROLE"].company.CD,
        sndrUserNm: this.chat_list_data.CLK_DATA.CUST_NM,
        custId: this.chat_list_data.CLK_DATA.CUST_ID,
        chtUserKey: this.chat_list_data.CLK_DATA.CHT_USER_KEY
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
      // this.chatHstSrch();

      this.CHAT_INPUT.textarea ='';

      this.BFR_CHT_PROP = false
    },

    // 채팅 이미지 vueDrop 이벤트
    handleFileAccept(file, done){
      console.log("🚀 ~ file: CSL_M0200.vue:2845 ~ handleFileAccept ~ file:", file);
      let leng = this.IMG_LIST.length
      if(leng == 0){// Queue에 파일 추가
        done();
      } else {
        done('File already uploaded. Skipped.');
      }
    },

    handleFileAdded(file) {
      console.log("🚀 ~ file: CSL_M0200.vue:2845 ~ handleFileAdded ~ file1:", file);
      console.log("🚀 ~ file: CSL_M0200.vue:2845 ~ handleFileAdded ~ file2:", this.IMG_LIST);
      console.log("🚀 ~ file: CSL_M0200.vue:2845 ~ handleFileAdded ~ file4:", this.$refs.vueDrop.getQueuedFiles());
      //이미지 개수 제한 가능
      // if(this.IMG_LIST.length < 4 && file.length < 5){
      if(this.IMG_LIST.length < 1 && file.length < 2){
        this.handleFileUpload(file);
      } else {
        //전송 허용 개수만큼은 저장을 해야함
        if(this.IMG_LIST.length < 1){
          this.handleFileUpload(file.slice(0, 1-this.IMG_LIST.length));
        }
        this.showToast(this.MESSAGE.ALERT.MAX_FILE_TOAST);
        if(this.$refs.vueDrop.getQueuedFiles().length > 1){
          //파일을 선택하여 추가했을 때는 파일이 바로 들어옴
          this.$refs.vueDrop.removeFile(this.$refs.vueDrop.getQueuedFiles()[1]);
        } else {
          //드래그하여 파일추가했을 때 getQueuedFiles에 파일이 바로 안들어옴
          setTimeout(() => {
            // this.$refs.vueDrop.removeFile(this.$refs.vueDrop.getQueuedFiles()[4]);
            this.$refs.vueDrop.removeFile(this.$refs.vueDrop.getQueuedFiles()[1]);
          }, 1 * 100); // 5밀리초
        }
      }
    },

    handleFileRemoved(file){
      console.log("🚀 ~ file: CSL_M0200.vue:2848 ~ handleFileRemoved ~ file1:", this.IMG_LIST)
      console.log("🚀 ~ file: CSL_M0200.vue:2848 ~ handleFileRemoved ~ file2:", file)
      //vueDropConfig.js 에서 설정된 파일 옵션에서 걸러진 이미지는 저장하지 않는다.
      let leng = this.IMG_LIST.length
      for(let i=0;i<leng;i++){
        if(this.IMG_LIST[i].ACTL_FILE_NM == file.name){
          this.IMG_LIST.splice(i,1)
        }
      }
    },

    handleFileAddedFile(file) {
      console.log("🚀 ~ file: CSL_M0200.vue:2845 ~ handleFileAddedFile ~ file1:", file);
      console.log("🚀 ~ file: CSL_M0200.vue:2845 ~ handleFileAddedFile ~ file2:", this.FILE_LIST);
      console.log("🚀 ~ file: CSL_M0200.vue:2845 ~ handleFileAddedFile ~ file4:", this.$refs.vueDropFile.getQueuedFiles());
      //이미지 개수 제한 가능
      // if(this.FILE_LIST.length < 4 && file.length < 5){
      if(this.FILE_LIST.length < 1 && file.length < 2){
        this.handleFileSend(file);
      } else {
        //전송 허용 개수만큼은 저장을 해야함
        if(this.FILE_LIST.length < 1){
          this.handleFileSend(file.slice(0, 1-this.FILE_LIST.length));
        }
        this.showToast(this.MESSAGE.ALERT.MAX_FILE_TOAST);
        if(this.$refs.vueDropFile.getQueuedFiles().length > 1){
          //파일을 선택하여 추가했을 때는 파일이 바로 들어옴
          this.$refs.vueDropFile.removeFile(this.$refs.vueDropFile.getQueuedFiles()[1]);
        } else {
          //드래그하여 파일추가했을 때 getQueuedFiles에 파일이 바로 안들어옴
          setTimeout(() => {
            // this.$refs.vueDropFile.removeFile(this.$refs.vueDropFile.getQueuedFiles()[4]);
            this.$refs.vueDropFile.removeFile(this.$refs.vueDropFile.getQueuedFiles()[1]);
          }, 1 * 100); // 5밀리초
        }
      }
    },

    handleFileRemovedFile(file){
      console.log("🚀 ~ file: CSL_M0200.vue:2848 ~ handleFileRemovedFile ~ file1:", this.FILE_LIST)
      console.log("🚀 ~ file: CSL_M0200.vue:2848 ~ handleFileRemovedFile ~ file2:", file)
      //vueDropConfig.js 에서 설정된 파일 옵션에서 걸러진 이미지는 저장하지 않는다.
      let leng = this.FILE_LIST.length
      for(let i=0;i<leng;i++){
        if(this.FILE_LIST[i].ACTL_FILE_NM == file.name){
          this.FILE_LIST.splice(i,1)
        }
      }
    },

    // 위치,연락처 팝업 오픈
    sendingBtn(type){
      this.checkPopType(type);        // 위치, 연락처 구분
      this.ItemsSendData = [];        // 그리드리스트 초기화
      this.selectedSendItem = [];     // 체크박스 초기화
      this.forceRerender();           // component 렌더링
      this.mixin_showDialog('PlaceContactsFind');
    },

    // 팝업창 오픈시 유형 체크
    checkPopType(type) {

      switch (type) {
        case 'place':
          this.HEADER_TITLE = "위치 정보 보내기";
          this.DATA_TYPE_PROP = 'place';
          break;

        case 'contacts':
          this.HEADER_TITLE = "연락처 정보 보내기";
          this.DATA_TYPE_PROP = 'contacts';
          break;

        default:
          break;
      }
    },

    // 위치정보, 연락처정보 component 렌더링
    forceRerender() {
      this.COMPONENT_KEY += 1;
    },

    showSmsSlide(){
      this.$eventBus.$emit('showRightSlide', {ACT_NM: 'dialogSms', active:false});
    },

    showChatSlide(){
      this.$eventBus.$emit('showRightSlide', {ACT_NM: 'dialogTalk', active:false});
    },

    //상담유형 가져오기
    async selCuttTypeSrch(){
      let sUrl = '/chat-api/main/selCuttTypeSrch';
      let postParam = {
        CUTT_TYPE_ID:this.chat_list_data.CLK_DATA.CUTT_TYPE_ID,
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
        console.log("selCuttTypeObj", selCuttTypeObj);

        //json형태의 상담유형정보를 array로 만들어줌
        let selCuttTypeArr = [];
        //마지막 데이터는 고객사 기본데이터이기 때문에 불필요
        for(let i=0;i<selCuttTypeLeng-1;i++){
          console.log("i", i);
          selCuttTypeArr[i] = selCuttTypeObj[i];
          console.log("selCuttTypeObj[i]", selCuttTypeObj[i]);
        }
        selCuttTypeArr.reverse();

        console.log("selCuttTypeArr", selCuttTypeArr);
        //상담유형정보 세팅
        let leng = selCuttTypeArr.length
        for(let n=0;n<leng;n++){
          this.CUTT_TYPE_VMODEL_ARR[n] = selCuttTypeArr[n];
          console.log("this.CUTT_TYPE_VMODEL_ARR[n]", this.CUTT_TYPE_VMODEL_ARR[n]);
          this.changeCuttTypeItems(n)
        }
      }
    },

    //채팅 키워드 검색
    srchChatKeyWord(highlight, keyword){
      this.HIGHLIGHT = highlight;
      if(highlight){
        this.KEYWORD = keyword;
      }
    },

    switchSummaryChange(event) {
      //통합 접촉이력 실시간 검색 탭 처리
      if(this.$refs.MainchatAllLog != undefined){
        this.$refs.MainchatAllLog.setOpenTabFromSNS(event); //실시간 검색 탭 처리
      }
    },

    //자동요약 버튼 처리
    summaryCuttCn() {
      if(this.CHAT_LOG == undefined || this.CHAT_LOG.length == 0) {
        this.showAlert(this.MESSAGE.ALERT.SUMMARY_CUTT_CN)
        return;
      }
      let transcript = "";
      let prevSndRvcCd = "";
      let isFirst = true;
      this.CHAT_LOG.map((chat, index) => {
        if(chat.TYPE == 'text' || chat.TYPE == 'TX') {
          if(transcript != "") {
            transcript += "\n";
          }
          if(chat.SNDRCV_CD == "SND") {
            transcript += "상담사 : " + chat.CONTENT;
          } else if(chat.SNDRCV_CD == "RCV") {
            transcript += "고객 : " + chat.CONTENT;
          }
        }
        // if(chat.TYPE == 'text' || chat.TYPE == 'TX') {
        //   if(chat.SNDRCV_CD == "SND" && chat.SNDRCV_CD != prevSndRvcCd) {
        //     transcript += isFirst ? "상담사 : " : "\n상담사 : ";
        //     isFirst = false;
        //   } else if(chat.SNDRCV_CD == "RCV" && chat.SNDRCV_CD != prevSndRvcCd) {
        //     transcript += isFirst ? "고객 : " : "\n고객 : ";
        //     isFirst = false;
        //   }
        //   transcript += chat.CONTENT + " ";
        //   prevSndRvcCd = chat.SNDRCV_CD;
        // }
      })
      this.$refs.MainchatAllLog.autoSummaryCuttCn(transcript, this.CUTT_TY, null, this.chat_list_data.CLK_DATA.CHT_CUTT_ID);
    },

    //실시간 검색 - 상담요약 탭 '적용' 버튼 처리
    applyCuttCn(cuttCn, cuttTypeVmodelArr) {
      if(!this.slideChat) {
        this.showAlert(this.MESSAGE.ALERT.APPLY_CUTT_CN)
        return;
      }
      this.CUTT_CN = cuttCn;
      this.CUTT_TYPE_VMODEL_ARR = JSON.parse(JSON.stringify(cuttTypeVmodelArr))
      //console.log("CLS_M200.vue ::: this.CUTT_TYPE_VMODEL_ARR ::: ", cuttTypeVmodelArr, this.CUTT_TYPE_VMODEL_ARR)
    },

    //단일 이미지 전송
    //실제 파일이 서버에 올라가는 부분
    handleFileUpload(fileList) {
      const files = fileList;

      //파일 제한 체크 (프론트에서 체크하고 업로드 로직 실행x)
      if (files.length > 0 && this.isValidFiles(files)) {
        // 파일 업로드
        this.uploadFiles(files);
      }
    },

    //단일 이미지 전송
    //실제 파일이 서버에 올라가는 부분
    handleFileSend(fileList) {
      const files = fileList;

      //파일 제한 체크 (프론트에서 체크하고 업로드 로직 실행x)
      if (files.length > 0 && this.isValidFile(files)) {
        // 팔레트 서버로 파일 업로드 후
        this.uploadFile(files);
      }
    },

    //파일개수 제한(파일개수 체크)
    isValidFiles(files) {
      // 파일 개수 제한을 설정
      const maxFileCount = 5;
      if (files.length > maxFileCount) {
        alert(`최대 ${maxFileCount}개의 파일까지 업로드할 수 있습니다.`);
        return false;
      }

      // 파일 크기 및 형식을 설정 (대소문자 구분)
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxFileSize = 5 * 1024 * 1024; // 5MB
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!allowedFileTypes.includes(file.type)) {
          alert('지원하지 않는 파일 형식입니다.');
          return false;
        }
        if (file.size > maxFileSize) {
          alert('파일 크기가 허용 범위를 초과합니다.');
          return false;
        }
      }

      return true;
    },

    //파일개수 제한(파일개수 체크)
    isValidFile(files) {
      // 파일 개수 제한을 설정
      const maxFileCount = 5;
      if (files.length > maxFileCount) {
        alert(`최대 ${maxFileCount}개의 파일까지 업로드할 수 있습니다.`);
        return false;
      }

      // 파일 크기 및 형식을 설정 (대소문자 구분)
      const allowedFileTypes = [
        'image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/bmp', 'image/webp', 'image/tiff'
        , 'video/mp4', 'video/m4v', 'video/avi', 'video/asf', 'video/wmv', 'video/mkv', 'video/ts', 'video/mpg', 'video/mpg', 'video/mpeg', 'video/mov', 'video/flv', 'video/ogv'
        , 'audio/mp3', 'audio/wav', 'audio/flac', 'audio/tta', 'audio/tak', 'audio/aac', 'audio/wma', 'audio/ogg', 'audio/m4a'
        , 'application/pdf', 'application/odp', 'application/ppt', 'application/pptx', 'application/key', 'application/show', 'application/doc', 'application/docx', 'application/hwp'
        , 'application/txt', 'application/rtf', 'application/xml', 'application/wks', 'application/wps', 'application/xps', 'application/md', 'application/odf', 'application/odt'
        , 'application/pages', 'application/ods', 'application/csv', 'application/tsv', 'application/xls', 'application/xlsx', 'application/numbers', 'application/cell'
        , 'application/psd', 'application/ai', 'application/sketch', 'application/tif', 'application/tiff', 'application/tga', 'application/webp', 'application/zip'
        , 'application/gz', 'application/bz2', 'application/rar', 'application/7z', 'application/lzh', 'application/alz'
      ];
      const maxFileSize = 300 * 1024 * 1024; // 300MB
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log("file.type",file.type)
        if (!allowedFileTypes.includes(file.type)) {
          alert('지원하지 않는 파일 형식입니다.');
          return false;
        }
        if (file.size > maxFileSize) {
          alert('파일 크기가 허용 범위를 초과합니다.');
          return false;
        }
      }

      return true;
    },

    //파일 업로드
    uploadFiles(files) {
      let busiType = 'chat';
      let pathType = 'images';
      let uploadUrl = "api/file/"+ busiType +"/"+ pathType +"/uploads";

      //파일 제한 체크 (빽엔드에서 체크 후 업로드 실패)
      for (let i = 0; i < files.length; i++) {
        //vueDropConfig.js 에서 설정된 파일 옵션에서 걸러진 이미지는 저장하지 않는다.
        console.log("file info",files[i]);
        if(files[i].status != "error"){
          const formData = new FormData();

          formData.append('action', uploadUrl);
          formData.append('method', "post");
          formData.append('custcoId', this.$store.getters['userStore/GE_USER_ROLE'].company.CD);                 //회사구분 : 1은 시스템(가이드)
          formData.append('userfiles', files[i]);           //파일(바이너리)
          formData.append('userId', this.$store.getters['userStore/GE_USER_ROLE'].userId);                   //사용자 ID : 2는 시스템(가이드)

          axios
          .post(uploadUrl, formData, {headers:{Authorization: "bearer " + window.sessionStorage.getItem("token")}})
            .then(response => {
              // 파일 업로드 성공 시 처리
              // console.log(response.data);
              let leng = response.data.data.length
              for(let n=0;n<leng;n++){
                this.IMG_LIST.push({
                  index : i
                  , FILE_PATH : response.data.data[n].filePath
                  , STRG_FILE_NM : response.data.data[n].strgFileNm
                  , FILE_GROUP_KEY : response.data.data[n].fileGroupKey
                  , FILE_KEY : response.data.data[n].fileKey
                  , ACTL_FILE_NM : response.data.data[n].actlFileNm
                });
              }
            })
            .catch(error => {
              // 파일 업로드 실패 시 처리
              console.error(error);
            });
        }
        // 서버로 파일 업로드 요청을 보냅니다.
      }
    },

    //파일 업로드
    uploadFile2(files) {
      // let busiType = 'chat';
      // let pathType = 'files';
      // let uploadUrl = "api/file/"+ busiType +"/"+ pathType +"/uploads";
      let fileUploadUrl = "https://bzc-api.kakao.com/v1/0ee0d8c660525467124e8ce3c7464f0ad98dd0e0/file/upload"
      let senderKey = this.chat_list_data.CLK_DATA.DSPTCH_PRF_KEY;
      let type = '';

      //파일 제한 체크 (빽엔드에서 체크 후 업로드 실패)
      for (let i = 0; i < files.length; i++) {
        //vueDropConfig.js 에서 설정된 파일 옵션에서 걸러진 이미지는 저장하지 않는다.
        console.log("file info",files[i]);
        if(files[i].status != "error"){
          const formData = new FormData();

          // formData.append('action', uploadUrl);
          // formData.append('method', "post");
          // formData.append('custcoId', this.$store.getters['userStore/GE_USER_ROLE'].company.CD);                 //회사구분 : 1은 시스템(가이드)
          // formData.append('userfiles', files[i]);           //파일(바이너리)
          // formData.append('userId', this.$store.getters['userStore/GE_USER_ROLE'].userId);                   //사용자 ID : 2는 시스템(가이드)

          formData.append('sender_key', senderKey);
          formData.append('file', files[i]);           //파일(바이너리)
          // formData.append('file_type', files[i].);                   //사용자 ID : 2는 시스템(가이드)

          if(files[i].type.indexOf("application")!= -1){
            type = 'FI';
          } else if(files[i].type.indexOf("video")!= -1){
            type = 'VI';
          } else if(files[i].type.indexOf("audio")!= -1){
            type = 'AU';
          } else if(files[i].type.indexOf("image")!= -1){
            type = 'IM';
          }

          //파일 팔레트 서버에 저장 할 필요 없음 // 해야하나? 체크해보기
          axios
          .post(
            fileUploadUrl
            , formData
            , {
                headers:{
                  "Content-type": "multipart/form-data"
                  // , Authorization: "bearer " + window.sessionStorage.getItem("token")
                }
              }
            )
            .then(response => {
              // 파일 업로드 성공 시 처리
              console.log(response.data);
              if(response.data.code == '0000'){
                if(type == 'AU'){
                  this.FILE_LIST.push({
                    type: type
                    , file_url: response.data.file
                    , file_name: files[i].name
                    , file_size: files[i].size
                  });
                } else {
                  this.FILE_LIST.push({
                    type: type
                    , file_url: response.data.file
                    , file_name: response.data.name
                    , file_size: response.data.size
                  });
                }
              } else {
                console.log("error!!  >>  ", response.data);
              }
            })
            .catch(error => {
              // 파일 업로드 실패 시 처리
              console.error(error);
            });
        }
        // 서버로 파일 업로드 요청을 보냅니다.
      }
    },



    //팔레트 서버에 파일 업로드
    async uploadFile(files) {
      let busiType = 'chat';
      let pathType = 'files';
      let uploadUrl = "api/file/"+ busiType +"/"+ pathType +"/uploads";
      let senderKey = this.chat_list_data.CLK_DATA.DSPTCH_PRF_KEY;
      let type = '';
      let file = '';

      //파일 제한 체크 (빽엔드에서 체크 후 업로드 실패)
      for (let i = 0; i < files.length; i++) {
        //vueDropConfig.js 에서 설정된 파일 옵션에서 걸러진 이미지는 저장하지 않는다.
        console.log("file info",files[i]);
        if(files[i].status != "error"){
          const formData = new FormData();

          formData.append('action', uploadUrl);
          formData.append('method', "post");
          formData.append('custcoId', this.$store.getters['userStore/GE_USER_ROLE'].company.CD);                 //회사구분 : 1은 시스템(가이드)
          formData.append('userfiles', files[i]);           //파일(바이너리)
          formData.append('userId', this.$store.getters['userStore/GE_USER_ROLE'].userId);                   //사용자 ID : 2는 시스템(가이드)

          formData.append('sender_key', senderKey);

          if(files[i].type.indexOf("application")!= -1){
            type = 'file';
          } else if(files[i].type.indexOf("video")!= -1){
            type = 'video';
          } else if(files[i].type.indexOf("audio")!= -1){
            type = 'audio';
          } else if(files[i].type.indexOf("image")!= -1){
            type = 'image';
          }
          formData.append('file_type', type);

          //파일 팔레트 서버에 저장 할 필요 없음 // 해야하나? 체크해보기
          await axios
          .post(
            uploadUrl
            , formData
            , {
                headers:{
                  Authorization: "bearer " + window.sessionStorage.getItem("token")
                }
              }
            )
            .then(response => {
              // 파일 업로드 성공 시 처리
              //파일 서버에 업로드 후해당 파일을 카카오톡 api 보낼 수 있도록 처리하기
              console.log(response.data);
              let leng = response.data.data.length
              for(let n=0;n<leng;n++){
                // file = process.env.VUE_APP_API_URL + "upload/" + response.data.data[0].filePath + '/' + response.data.data[0].strgFileNm
                file = "P:/repository/web/" + response.data.data[0].filePath + '/' + response.data.data[0].strgFileNm
              }
            })
            .catch(error => {
              // 파일 업로드 실패 시 처리
              console.error(error);
            });
          // this.kakaoFileUpload(file, type, files[i])
        }
        // 서버로 파일 업로드 요청을 보냅니다.
      }
    },

    //카카오 서버에 파일 업로드
    async kakaoFileUpload(file, type, fileInfo){
      let sUrl = '/chat-api/main/kakaoFileUpload';
      let senderKey = this.chat_list_data.CLK_DATA.DSPTCH_PRF_KEY;
      let postParam = {
        FILE: file
        , DSPTCH_PRF_KEY: senderKey
        , TYPE: type
      }
      let headParam = {
        head: {
        }
      }

      let fileType = ''
      switch (type){
        case 'file':
          fileType = 'FI';
          break;
        case 'video':
          fileType = 'VI';
          break;
        case 'audio':
          fileType = 'AU';
          break;
        case 'image':
          fileType = 'IM';
          break;
      }

      let resData = await this.chat_postCall(sUrl, postParam, headParam)
      if(!resData.header.ERROR_FLAG){
        console.log("resData", resData);
        if(resData.data){
          if(resData.data.code == '0000'){
            if(type == 'audio'){
              this.FILE_LIST.push({
                type: fileType
                , file_url: resData.data.file
                , file_name: fileInfo.name
                , file_size: fileInfo.size
              });
            } else {
              this.FILE_LIST.push({
                type: fileType
                , file_url: resData.data.file
                , file_name: resData.data.name
                , file_size: resData.data.size
              });
            }
          } else {
            console.log("error!!  >>  ", resData.data);
          }
        }
      }
    },

    sendUploadImg(){
      let leng = this.IMG_LIST.length;
      for(let i=0;i<leng;i++){
        this.sendMsg('img',this.IMG_LIST[i]);
      }
      this.mixin_hideDialog('VueDrop');
      this.IMG_LIST = [];
      this.$refs.vueDrop.removeAllFiles();
    },

    sendUploadFile(){
      let leng = this.FILE_LIST.length;
      for(let i=0;i<leng;i++){
        this.sendMsg('file',this.FILE_LIST[i]);
      }
      this.mixin_hideDialog('VueDropFile');
      this.FILE_LIST = [];
      this.$refs.vueDropFile.removeAllFiles();
    },

    maxFile(){
      if(this.IMG_LIST.length == 4){
        this.showToast(this.MESSAGE.ALERT.MAX_FILE_TOAST);
      }
    },

    initUploadImg(){
      this.IMG_LIST = [];
      this.$refs.vueDrop.removeAllFiles();
    },

    initUploadFile(){
      this.FILE_LIST = [];
      this.$refs.vueDropFile.removeAllFiles();
    },

    async getChbtUserData(){
      let sUrl = '/chat-api/main/getChbtUserData';
      let postParam = {
        CHT_USER_KEY: this.chat_list_data.CLK_DATA.CHT_USER_KEY,
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.chat_postCall(sUrl, postParam, headParam)
      if(!resData.header.ERROR_FLAG){
        if(resData.data.length > 0){
          if(resData.data[0].AUTH_YN == 'Y'){
            this.CHBT_USER ={
              AUTH_YN: resData.data[0].AUTH_YN
              , CONTENT: '회원번호: ' + resData.data[0].MEMBER_NO + '\n회원명: ' + resData.data[0].USER_NAME + '\n이메일: ' + resData.data[0].USER_EMAIL + '\n회원ID: ' + resData.data[0].MEMBER_ID
            }
          } else {
            this.CHBT_USER ={
              AUTH_YN: resData.data[0].AUTH_YN
              , CONTENT: '인증받지 않은 회원'
            }
          }
        }
      }
    },

    async getChbtData(){
      let sUrl = '/chat-api/main/getChbtData';
      let postParam = {
        CHT_USER_KEY: this.chat_list_data.CLK_DATA.CHT_USER_KEY,
        CHT_CUTT_ID: this.chat_list_data.CLK_DATA.CHT_CUTT_ID,
        CHN_CLSF_CD : this.chat_list_data.CLK_DATA.CHN_CLSF_CD
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
          if(this.chat_list_data.CLK_DATA.CHN_CLSF_CD == 'NTT'){
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
            chatDate = this.mixin_convertDate(resData.data[0]["MESSAGE_ID"].substr(0, 14), 'yyyy-MM-dd HH:mm:ss')
            chbtInfo.push({
              SNDRCV_CD: 'RCV',
              CHAT_DATE: chatDate,
              CONTENT: [{CONTENT: resData.data[0]["CONTENT"]["utterance"]}]
            })

            if(resData.data[0]["CONTENT"]["messages"].length > 2){
              chbtInfo.push({
                SNDRCV_CD: 'SND',
                CHAT_DATE: chatDate,
                CONTENT: [{CONTENT: resData.data[n]["CONTENT"]["messages"][0]["text"]}]
              })
              let leng = resData.data[0]["CONTENT"]["messages"][1]["cards"].length;
              compList = [];
              for(let i=0;i<leng;i++){
                compList[i] = {
                  CONTENT: resData.data[0]["CONTENT"]["messages"][1]["cards"][i]["title"]
                  , PRICE: resData.data[0]["CONTENT"]["messages"][1]["cards"][i]["price"]["regularPrice"] + resData.data[0]["CONTENT"]["messages"][1]["cards"][i]["price"]["currencyUnit"]
                  , DATE: resData.data[0]["CONTENT"]["messages"][1]["cards"][i]["commerceTitle"]
                  , PRODICTION: resData.data[0]["CONTENT"]["messages"][1]["cards"][i]["profile"]["name"]
                  , IMAGE: resData.data[0]["CONTENT"]["messages"][1]["cards"][i]["imageUrl"]
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
                CONTENT: [{CONTENT: resData.data[0]["CONTENT"]["messages"][0]["cards"][0]["description"]}]
              })
            }
            chbtInfo.push({
              SNDRCV_CD: 'RCV',
              CHAT_DATE: chatDate,
              CONTENT: [{CONTENT: "상담직원 연결"}]
            })
          }
        }
        this.CHBT_INFO = chbtInfo;
      }
    },

    /**
     * 이메일 상담 모드로 전환환
     */
    changeEmailCuttMode(emailCuttInfo) {
      this.EMAIL_CUTT_INFO = emailCuttInfo;
      this.CHAT_CUTT_MODE = 'EMAIL';
    },
    /**
     * 게시판 상담 모드로 전환함
     */
    changeBbsCuttMode(bbsCuttInfo) {
      this.BBS_CUTT_INFO = bbsCuttInfo;
      this.CHAT_CUTT_MODE = 'BBS';
    },

    //영상통화
    async FnDemoVideoMode() {
      // sms 템플릿정보 조회
      this.getTempleInfo();

      let custPhnNo = this.CUST_INFO.CUST_PHN_NO.replace(/[^0-9]/g, '');
      let phnNoConfirm = false;
      if(this.mixin_isEmpty(custPhnNo)) phnNoConfirm = true;

      let svrDate = await this.mixin_getSvrDate("YYYYMMDD");
      this.videoFilePath = this.$store.getters['userStore/GE_USER_ROLE'].company.SCHEMA_ID+'_'+this.$store.getters['userStore/GE_USER_ROLE'].company.CD + '/' + svrDate.substring(0, 4) + '/' + svrDate.substring(4, 6) + '/' + svrDate.substring(6, 8) + '/' + this.CHAT_CUTT_MODE+'_'+this.chat_list_data.CLK_DATA.CHT_CUTT_ID;

      let sSchemaCustco = this.$store.getters['userStore/GE_USER_ROLE'].company.SCHEMA_ID+'_'+this.$store.getters['userStore/GE_USER_ROLE'].company.CD;
      if(process.env.VUE_APP_ENV === 'local' || process.env.VUE_APP_ENV === 'devserver'){
        sSchemaCustco = 'DEV_' + this.$store.getters['userStore/GE_USER_ROLE'].company.SCHEMA_ID+'_'+this.$store.getters['userStore/GE_USER_ROLE'].company.CD;
      }

      this.showAlert({
          alertDialogToggle: true
          , msg: '영상통화로 전환 하시겠습니까?'
          , phnNoConfirm: phnNoConfirm
          , iconClass: 'is-info'
          , type: 'confirm'
          , callYes: () => {
            if(phnNoConfirm){
              if(this.mixin_isEmpty(this.$store.getters['alertStore/GE_ALERT'].custPhnNo)){
                this.$store.getters['alertStore/GE_ALERT'].custPhnNoChk = true;
              }else{
                if(this.$store.getters['alertStore/GE_ALERT'].custPhnNo.replace(/[^0-9]/g, '').length < 11){
                  this.$store.getters['alertStore/GE_ALERT'].custPhnNoChk = true;
                }else{
                  this.demoVideoMode = !this.demoVideoMode;
                  this.iframeUrl = process.env.VUE_APP_VIDEO_URL + '/view/ssologin?loginId='+this.$store.getters['userStore/GE_USER_ROLE'].lgnId.replace('#', '%23')+'&tenantName=hkcloud&site='+sSchemaCustco+'&callid='+this.CHAT_CUTT_MODE+'_'+this.chat_list_data.CLK_DATA.CHT_CUTT_ID;
                  this.$store.commit("alertStore/hideAlert");
                }
              }
            }else{
              this.demoVideoMode = !this.demoVideoMode;
              this.iframeUrl = process.env.VUE_APP_VIDEO_URL + '/view/ssologin?loginId='+this.$store.getters['userStore/GE_USER_ROLE'].lgnId.replace('#', '%23')+'&tenantName=hkcloud&site='+sSchemaCustco+'&callid='+this.CHAT_CUTT_MODE+'_'+this.chat_list_data.CLK_DATA.CHT_CUTT_ID;
              this.$store.commit("alertStore/hideAlert");
            }
          }
          , callNo: () => {
            this.$store.commit("alertStore/hideAlert");
          }
      });
    },

    sendMsgToChild( msg ) {
      this.$refs.child.contentWindow.postMessage( {key:"Invite", val: ""}, '*' );
    },

    receiveMsgFromChild( e ) {
      let _this = this;
      let message = e.data;
      if(this.demoVideoMode){
        if(message.key === "Invite") { //고객 초대 SMS URL
          // let sMessage = '아래 링크를 클릭해 주세요.\n\n';
          let sMessage = this.VIDEO_INVITE_SMS_CN.split('#{INVITE_LINK}').join(message.val);
          var data = new Object();
          data.attachment = {"image":""}
          data.send_date = ''; //즉시발송
          data.subject = '영상통화 접속 URL';
          data.sndngSeCd = 'LMS';
          data.message = sMessage;
          data.phone_number = this.CUST_INFO.CUST_PHN_NO.replace(/[^0-9]/g, '')?this.CUST_INFO.CUST_PHN_NO.replace(/[^0-9]/g, ''):_this.$store.getters['alertStore/GE_ALERT'].custPhnNo.replace(/[^0-9]/g, ''); //고객 전화번호
          data.callback_number = _this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO.split(',')[0];

          data.toastView = true; //처리상태 Toast 사용 유무

          var toastMsgObj = new Object();
          toastMsgObj.alertDialogToggle = true;
          toastMsgObj.msg = '영상통화 접속 정보를 전송 하였습니다.';
          toastMsgObj.iconClass = 'is-info';
          toastMsgObj.type = 'default';

          data.toastMsg = toastMsgObj;

          let SndngResp = _this.mixin_sendMessage(data); //SMS 전송

        }else if(message.key === "End"){ //상담 종료
          this.iframeUrl = "";
          this.demoVideoMode = false;

          //영상상담 종료 후 이벤트 처리

        }else if(message.key === "Error"){ //오류
          this.iframeUrl = "";
          this.demoVideoMode = false;

          //오류 발생시 이벤트 처리
        }
      }
	  },

    // SMS 템플릿 조회
    async getTempleInfo(){

      let response = await this.common_postCall('/phone-api/placeContact/selectTempleteInfo', { TMPL_CD: 'TP_VIDEO', TMPL_TY : 'SMS'}, {head:{}});

      if (!response.HEADER.ERROR_FLAG) {
        if(response.DATA.length > 0){
          this.VIDEO_INVITE_SMS_CN = response.DATA[0].TMPL_CN;
        }else{
          this.VIDEO_INVITE_SMS_CN = '#{INVITE_LINK}';
        }
      }
    },
    //이관 확장 속성 및 담당자 목록 정보 가져오기
    async getTrnsfExpsnAttrList() {
      if(this.trnsfUseYn){
        let sUrl = '/api/setting/expsnAttr/expsnAttrList';
        let postParam = {
          SE : 'TRNSF' //상담내용 확장항목
          , BSC_PVSN_ATTR_YN : "N" //기본 제공 속성이 아닌것
          , USE_YN : 'Y' //확장속성 사용인 경우만
          , AUTHRT_GROUP_ID : 7 //사용자 권한 그룹 ID (담당자 그룹)
        }

        let response  = await this.common_postCall(sUrl, postParam, {head : {}});

        if (!response.HEADER.ERROR_FLAG){
          let expsnAttrData = response.DATA;

          //상담유형 공통코드
          let codeName = ['CALL_TP', 'CHNL', 'REL_TP', 'SRVC_TP']; //콜 유형과, 채널 공통코드

          //이관 공통코드
          if(expsnAttrData.length > 0){
            expsnAttrData.forEach((attr, idx) => {
              if(attr.DATA_TYPE_CD === 'COE' || attr.DATA_TYPE_CD === 'COE_MULTI'){
                if(attr.GROUP_CD_ID) codeName.push(attr.GROUP_CD_ID); //공통코드사용을 위해
              }
            });
          }

          //공통코드설정
          this.common_code = await this.mixin_common_code_get_all(codeName);
          
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
              if(expsnAttrData[i].EXPSN_ATTR_COL_ID === 'CUSL_TP_CL'){
                expsnAttrData[i].V_MODEL = [];
                if(expsnAttrData[i].PHN_CUTT_ID){
                  if(expsnAttrData[i].ATTR_VL){
                    if(this.CUTT_TYPE_LMT_LVL_CD){
                      let tmpCuttType = '';
                      for(let k=0; k<this.CUTT_TYPE_LMT_LVL_CD; k++){
                        expsnAttrData[i].V_MODEL[k] = expsnAttrData[i].ATTR_VL.split(',')[k+1];
                        tmpCuttType += (tmpCuttType?',':'') + expsnAttrData[i].ATTR_VL.split(',')[k+1];
                      }

                      this.cuttTypeIntgeSchVal = tmpCuttType;
                      this.changeCuttTypeSch(i);
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

            //캠페인 전화걸기일때 시도횟수가 마지막일 경우 무조건 처리결과 완료
            if(this.CPI_CNT && expsnAttrData[i].GROUP_CD_ID == 'CUSL_RS'){
              expsnAttrData[i].V_MODEL = 'COMPLETED';
            }
          }

          this.TRNSF_EXPSN_ATTR = expsnAttrData;

          let arrUserList = [];
          if(response.TRNSF_USER_LIST.length > 0){
            response.TRNSF_USER_LIST.forEach((data, idx) => {
              arrUserList.push({text : data.DEPT_NM + ' > ' + data.USER_NM, value : data.USER_ID});
            });
            this.TRGT_USER_ID = arrUserList[0].value; //이관 대상 ID
          }

          this.TRNSF_USER_LIST = arrUserList;
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
</style>