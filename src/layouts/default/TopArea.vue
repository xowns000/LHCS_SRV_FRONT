<template>
  <v-app-bar app height="49px" class="pl-layout-top" >
    <v-app-bar-nav-icon @click.stop="$emit('drawer')" data-state="topMenu">
      <template slot>
        <span class="top-menu">menu</span>
      </template>
    </v-app-bar-nav-icon>
    <v-toolbar-title
      class="pl-layout-top-logo"
      @click="dropSelectCompany = !dropSelectCompany"
      >
      <div class="pl-layout-top-logo-wrap">
        <!-- 아이콘 기능 개발해야함
        <span class="icon-logo">
          <img :src="SELECTED_COMPANY.icon" :alt="SELECTED_COMPANY.CD_NM" />
        </span>
      -->
      <!-- temp : 상무님이 뭐 하나 보여 달라 함 -->
      <span class="icon-logo">
        <img
          :src="'/upload/' + SELECTED_COMPANY.icon"
          style="width: 20px; height: 20px;"
          @error="function(e){e.target.src=require('@/assets/img/@logo_palette.png')}"
        />
      </span>
        <span class="company-text">
          {{ SELECTED_COMPANY.CD_NM}}
        </span>
      </div>
      <!-- //mark: 회사선택 모달 -->
      <v-slide-y-transition>
        <div class="pl-drop-layer is-logo-company" v-if="dropSelectCompany === true" v-click-outside="closeDropSelectCompany">
          <div class="pl-drop-layer-body">
            <ul class="pl-drop-layer-list">
              <li
                v-for="item in COMPANY_INFO"
                :key="item.SCHEMA_ID + '_' + item.CD"
                @click="selectCompanyList(item)"
                >
                <img
                  :src="'/upload/' + item.icon"
                  :alt="item.CD_NM"
                  style="width: 20px; height: 20px;"
                  @error="function(e){e.target.src=require('@/assets/img/@logo_palette.png')}"/>
                <span class="ml-2">
                  {{ item.CD_NM }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </v-slide-y-transition>
    </v-toolbar-title>
    <v-spacer></v-spacer>

    <!--설문조사 전용 모드에서는 CTI 출력 안함-->
    <template v-if="SELECTED_COMPANY.SRVC_GDS_ID == null || SELECTED_COMPANY.SRVC_GDS_ID == undefined || SELECTED_COMPANY.SRVC_GDS_ID != 99">
      <div class="pl-layout-top-cti">
        <v-switch v-model="CTI_STAT"
          class="pl-main-switch"
          :label="CTI_STAT === true ? 'CTI ON' : 'CTI OFF' "
          @click="ctiConnectEvent('CALL')"
          >
        </v-switch>
        <!-- :disabled="$store.getters['statusStore/GE_CUTT_ING']" -->
        <div
          v-for="item in CTI_MENU"
          :key="item.id"
          class="pl-cti-btns"
          :class="{ active: item.active, 'is-disabled': item.disabled }"
          @click=ctiBtnEvt(item)>
          <span :class=item.icon></span>
          <span class="pl-cti-btns-text">{{ item.text }}</span>
        </div>
        <!-- 이석 -->
        <div @click="ctiMove()" class="pl-cti-btns-move" :style="CUSL_BTN_STYLE">
          <!-- <v-icon :class="`pl-icon20 ${ SELECTED_MOVE.icon }`"></v-icon> -->
          <span :class="`pl-icon-cti-${ SELECTED_MOVE.icon }`"></span>
          <span class="ml-2">{{ SELECTED_MOVE.text }}</span>
          <!-- //mark: 이석 모달 -->
          <v-slide-y-transition>
            <div class="pl-drop-layer is-cti-move" v-if="dropCtiMove === true" v-click-outside="closeDropCtiMove">
              <div class="pl-drop-layer-body">
                <ul class="pl-drop-layer-list">
                  <li
                    v-for="item in MOVE_LIST"
                    :key="item.id"
                    @click="selectMoveList(item)"
                    >
                    <!-- <v-icon :class="`pl-icon20 ${ item.icon }`"></v-icon> -->
                    <span :class="`pl-icon-cti-${ item.icon }`"></span>
                    <span class="ml-2">{{ item.text }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </v-slide-y-transition>
        </div>
      </div>

      <div class="pl-layout-top-callstat">
        <span :class="`pl-icon-cti-${CALLSTAT[SELECTED_CALLSTAT].icon}`"></span>
        {{ CALLSTAT[SELECTED_CALLSTAT].type }}
        <span class="pl-layout-top-callstat-time">{{ CUSL_STAT_TIME }}</span>
      </div>
    </template>

    <v-spacer></v-spacer>

    <div class="pl-layout-top-utils">
      <template v-if="SELECTED_COMPANY.SRVC_GDS_ID == null || SELECTED_COMPANY.SRVC_GDS_ID == undefined || SELECTED_COMPANY.SRVC_GDS_ID != 99">
        <div >
          <div
            v-if="TOP_UTIL.toggleSearch === true"
            v-click-outside="closeDropSearch"
            class="pl-top-util-searchform"
            >
            <compo-tooltip-btn
              :TitleProp="$store.getters['statusStore/GE_CUTT_ING'] ? '상담중에는 고객정보를 검색할 수 없습니다' : '고객 찾기'"
              ClassProp="pl-top-util"
              IconProp="pl-icon-util search"
              TooltipPositionProp="bottom"
              @btnClick="topCusSearch(TOP_UTIL.searchCusname)"
              :DisabledProp="$store.getters['statusStore/GE_CUTT_ING']"
            ></compo-tooltip-btn>
            <v-text-field
              ref="searchCusname"
              v-model="TOP_UTIL.searchCusname"
              clearable
              class="pl-form is-search"
              clear-icon="pl-icon-text-close"
              :placeholder="$store.getters['statusStore/GE_CUTT_ING'] ? '상담중에는 고객정보를 검색할 수 없습니다' : '이름 또는 전화번호'"
              @keydown.enter="topCusSearch(TOP_UTIL.searchCusname)"
              :disabled="$store.getters['statusStore/GE_CUTT_ING']"
            ></v-text-field>
            <!-- <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn dialog-close-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="clearCustSch()"
            ></compo-tooltip-btn> -->
          </div>
          <compo-tooltip-btn
            v-else
            :TitleProp="$store.getters['statusStore/GE_CUTT_ING'] ? '상담중에는 고객정보를 검색할 수 없습니다' : '고객 찾기'"
            ClassProp="pl-top-util"
            IconProp="pl-icon-util search"
            TooltipPositionProp="bottom"
            @btnClick="toggleTopSearch()"
          ></compo-tooltip-btn>
        </div>
        <!-- //mark: 고객찾기 모달-->
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
                @findData="findData"
                :CUSTCO_ID="CUSTCO_ID"
              />
            </template>
            <template slot="footer">
              <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('CusFind')">닫기</v-btn>
              <v-btn class="pl-btn" @click="setUserInfo('CusFind')">확인</v-btn>
            </template>
          </compo-dialog>
        </v-dialog>
      </template>

      <!--//mark:  알림 -->
      <div>
        <compo-tooltip-btn
          TitleProp="알림"
          :ClassProp="`pl-top-util alarm-${TOP_UTIL.msg}`"
          :IconProp="computedNotice"
          TooltipPositionProp="bottom"
          @btnClick="alarmBtn()"
        ></compo-tooltip-btn>
        <!-- //mark: 알림 모달 -->
        <v-dialog
          v-model="dialogAlarm"
          content-class="pl-top-alarm-dialog"
          hide-overlay>
          <compo-dialog
            header-title="알림 센터"
            :FooterProp="false"
            @hide="mixin_hideDialog('Alarm')"
          >
            <template slot="body">
              <!-- tabs -->
              <v-tabs class="pl-tabs type-main" v-model="TOP_UTIL.tab">
                <v-tab @click="alGetBrdList()">게시판
                  <span v-show="TOP_UTIL.notice" class="pl-tab-badge px-2">NEW</span>
                </v-tab>
                <v-tab @click="FnEvt({type:'give'}, 0, 'NOTE_SORT', 'NOTE_SORT_ITEMS')">
                  쪽지함
                  <!-- 새 쪽지 여부 -->
                  <span v-show="TOP_UTIL.msg" class="pl-tab-badge px-2">{{ TOP_UTIL.msgCnt }}</span>
                </v-tab>
                <v-tab @click="search()">쪽지 보내기</v-tab>
                <!-- 게시판 -->
                <v-tab-item>
                  <div class="d-flex justify-space-between is-mt-m">
                    <span class="pl-counter ml-0">전체 <em class="pl-1">({{ ALARM_LIST.length }})</em> 건</span>
                    <ul class="pl-sort-tabs ">
                      <li
                        v-for="item, index in SORT_ITEMS"
                        :key="item.id"
                        :class="item.selected ? 'selected' : ''"
                        @click="FnEvt(item, index, 'ALARM_SORT', 'SORT_ITEMS')"
                        >

                        {{ item.title }}{{ displayAlarmType(item.type+'0')}}
                      </li>
                    </ul>
                  </div>
                  <!-- list -->
                  <div class="pl-alarm-list-wrap is-mt-m" :class="`type-${ ALARM_SORT }`">
                    <div
                      v-for="item in ALARM_LIST"
                      :key="item.id"
                      class="pl-alarm-list"
                      :class="`list-${ item.PST_TYPE_CD }`"
                      @click="alBrdDetail(item)"
                      >
                      <div>
                        <span class="pl-alarm-list-title">
                          [{{ displayAlarmType(item.PST_TYPE_CD) }}] {{ item.PST_TTL }}
                          <span v-show="new Date(item.REG_DT) >= new Date().setDate(new Date().getDate() - 6) ? true : false" class="pl-alarm-list-badge">NEW</span></span>
                        <span class="pl-alarm-list-desc">등록자({{ item.USER_NAME }}) &bull; 등록일({{ item.REG_DT }}) &bull; 조회수({{ item.INQ_CNT }})</span>
                      </div>
                      <div>
                        <span class="pl-alarm-list-link" >자세히</span>
                      </div>
                    </div>
                    <div class="pl-alarm-list-wrap-bottom"></div>
                    <v-dialog
                      v-model="dialogNoticeDetail"
                      content-class="dialog-draggable"
                      hide-overlay>
                      <div class="draggable-area">drag area</div>
                      <compo-dialog
                        header-title="공지사항"
                        @hide="mixin_hideDialog('NoticeDetail')"
                      >
                        <template slot="body">
                          <compo-noti-detail
                            :NotiDetailProp.sync="NotiDetail"
                          />
                        </template>
                      </compo-dialog>
                    </v-dialog>
                    <template v-if="ALARM_LIST.length == 0">
                      <li class="pl-list-nodata">
                        <span>등록된 데이터가 없습니다.</span>
                      </li>
                    </template>
                  </div>
                </v-tab-item>
                <!-- 쪽지 -->
                <v-tab-item>
                  <div class="d-flex justify-space-between is-mt-m">
                    <span v-show="NOTE_SORT === 'give'" class="pl-counter ml-0">전체 <em class="pl-1">({{ NOTE_GIVE_LIST.length }})</em> 건</span>
                    <span v-show="NOTE_SORT === 'send'" class="pl-counter ml-0">전체 <em class="pl-1">({{ NOTE_SEND_LIST.length }})</em> 건</span>
                    <!-- <span v-show="NOTE_SORT === 'post'" class="pl-counter ml-0">전체 <em class="pl-1">({{ POST_MEMO_HEADER_ITEMS2.length }})</em> 건</span> -->
                    <ul class="pl-sort-tabs ">
                      <li
                        v-for="item, index in NOTE_SORT_ITEMS"
                        :key="item.id"
                        :class="item.selected ? 'selected' : ''"
                        @click="FnEvt(item, index, 'NOTE_SORT', 'NOTE_SORT_ITEMS')"
                        >
                        {{ item.title }}{{ displayAlarmType(item.type) }}
                      </li>
                    </ul>
                  </div>
                  <!-- 받은 쪽지 -->
                  <!-- list -->
                  <v-form ref="form2">
                    <div class="pl-note-list-wrap is-mt-m" v-show="NOTE_SORT === 'give'">
                      <div
                        v-for="item in NOTE_GIVE_LIST"
                        :key="item.id"
                        class="pl-note-list"
                        >
                        <div class="align-self-start pl-portrait">
                          <img :src="item.portrait" :alt="item.user" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
                        </div>
                        <div class="pl-3 flex-grow-1 pr-2">
                          <span class="pl-note-list-title">
                            {{ item.otherUserName }} &bull;
                            <span class="pl-note-list-date">{{ item.date }}</span>
                          </span>
                          <span class="pl-note-list-desc">
                            {{ item.text }}
                          </span>
                          <!-- 회신 textarea -->
                          <v-textarea
                            v-model="NOTE_REPLY_CONTENTS"
                            v-show="item.reply === true"
                            class="pl-form is-noresize is-mt-m"
                            :rules="detailValidateRules.MSG_CN"
                            :spellcheck="false"
                          />
                          <template v-if="item.reply">
                            <div class="pl-btn-wrap is-mt-m">
                              <v-btn class="pl-btn is-sm" @click="() => sendMessage(item)">보내기</v-btn>
                              <v-btn class="pl-btn is-sub is-sm" @click="item.reply = false">취소</v-btn>
                            </div>
                          </template>
                        </div>
                        <div
                          v-if="!item.reply"
                          class="ml-auto align-self-end text-right"
                          style="width: 70px">
                          <!-- 읽음 버튼 -->
                          <v-btn
                              v-if="item.inqYn ==='N'"
                              class="pl-btn is-sub is-sm"
                              @click="readMsg(item.msgId)"
                          >읽음</v-btn>
                          <v-btn
                            @click="item.reply = true"
                            class="pl-btn is-sub is-sm mt-1">
                            회신</v-btn>
                          </div>
                      </div>
                      <template v-if="NOTE_GIVE_LIST.length == 0">
                        <li class="pl-list-nodata">
                          <span>등록된 데이터가 없습니다.</span>
                        </li>
                      </template>
                    </div>
                  </v-form>
                  <!-- 보낸 쪽지 -->
                  <!-- list -->
                  <div class="pl-note-list-wrap is-mt-m" v-show="NOTE_SORT === 'send'">
                    <div
                      v-for="item in NOTE_SEND_LIST"
                      :key="item.id"
                      class="pl-note-list"
                      >
                      <div class="align-self-start pl-portrait">
                        <img :src="item.portrait" :alt="item.user" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
                      </div>
                      <div class="pl-3 flex-grow-0">
                        <span class="pl-note-list-title">
                          {{ item.otherUserName }}
                          &bull; <span class="pl-note-list-date">{{ item.date }} </span>
                          &bull; <span class="pl-note-list-date">{{ item.inqYn =='Y'? '읽음 ' + item.inqDt : '읽지 않음' }}</span>
                        </span>
                        <span class="pl-note-list-desc">
                          {{ item.text }}
                        </span>
                        <!-- child -->
                        <div
                          v-for="child, index in item.reply"
                          :key="index"
                          class="pl-note-list-reply"
                          >
                          <div class="pl-3 flex-grow-0">
                            <span class="pl-note-list-title">
                              {{ child.user }} &bull;
                              <span class="pl-note-list-date">{{ child.date }}</span>
                            </span>
                            <span class="pl-note-list-desc">
                              {{ child.text }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <template v-if="NOTE_SEND_LIST.length == 0">
                      <li class="pl-list-nodata">
                        <span>등록된 데이터가 없습니다.</span>
                      </li>
                    </template>
                  </div>
                  <!-- 하단 그라데이션  -->
                  <div class="pl-note-list-wrap-bottom"></div>
                </v-tab-item>

                <!-- 쪽지 보내기 -->
                <v-tab-item>
                  <div class="pl-note-list-wrap is-noborder" style="height: 680px">
                    <div class="pl-form-inline-wrap is-mt-m">
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          사용자 이름
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            v-model="userNm"
                            clearable
                            class="pl-form is-search is-lg"
                            placeholder="이름을 입력하세요"
                            @keydown.enter="search()"
                            >
                            <template v-slot:append>
                              <v-btn
                                @click="search()"
                                class="pl-btn has-icon-only">
                                <span class="pl-icon20 in-search"></span>
                              </v-btn>
                            </template>
                          </v-text-field>
                        </div>
                      </div>
                    </div>
                    <div class="is-mt-m">
                      <div class="pl-cols">
                        <div >
                          <v-data-table
                            v-model="POST_MEMO_LIST"
                            class="pl-grid has-control"
                            :headers="POST_MEMO_HEADER"
                            :items="POST_MEMO_HEADER_ITEMS"
                            show-select
                            fixed-header
                            item-key="ROW_NUMBER"
                            height="300px"
                            :items-per-page="ROW_PER_PAGE1"
                            hide-default-footer
                            :page.sync="page1"
                            no-data-text="등록된 데이터가 없습니다."
                            @page-count="pageCount1 = $event"
                          >
                          </v-data-table>

                        </div>
                        <div class="d-flex flex-column justify-center align-center" style="flex: 0 0 58px; gap: 14px">
                          <!-- arrow left 버튼 -->
                          <compo-tooltip-btn
                            TitleProp="left"
                            ClassProp="pl-tooltip-btn"
                            IconProp="pl-icon30 is-arrow-left"
                            TooltipPositionProp="bottom"
                            @btnClick="toTheLeft()"
                          ></compo-tooltip-btn>
                          <!-- arrow right 버튼 -->
                          <compo-tooltip-btn
                            TitleProp="right"
                            ClassProp="pl-tooltip-btn"
                            IconProp="pl-icon30 is-arrow-right"
                            TooltipPositionProp="bottom"
                            @btnClick="toTheRight()"
                          ></compo-tooltip-btn>
                        </div>
                        <div class="is-col-fix" style="width: 170px">
                          <v-data-table
                            v-model="POST_MEMO_LIST2"
                            show-select
                            class="pl-grid has-control"
                            :headers="POST_MEMO_HEADER2"
                            :items="POST_MEMO_HEADER_ITEMS2"
                            fixed-header
                            item-key="ROW_NUMBER"
                            height="300px"
                            :items-per-page="ROW_PER_PAGE2"
                            hide-default-footer
                            :page.sync="page2"
                            @page-count="pageCount2 = $event"
                            no-data-text="등록된 데이터가 없습니다."
                          >
                          </v-data-table>

                        </div>
                      </div>
                      <v-form ref="form1">
                        <div class="pl-form-inline-wrap vertical type-2 is-mt-l">
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              쪽지 내용
                            </span>
                            <div class="pl-desc">
                              <v-textarea
                                height="200px"
                                class="pl-form is-noresize"
                                v-model="NOTE_CONTENTS"
                                :rules="detailValidateRules.MSG_CN"
                                :spellcheck="false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="pl-btn-wrap is-mt-m">
                          <v-btn class="pl-btn ml-auto" @click="sendMessage('post')">보내기</v-btn>
                        </div>
                      </v-form>
                    </div>
                  </div>
                </v-tab-item>
              </v-tabs>

            </template>
          </compo-dialog>
        </v-dialog>

      </div>


      <!-- //mark: The-K Support -->
      <div v-if="isDevelopment && SELECTED_COMPANY.SRVC_GDS_ID != 99">
        <compo-tooltip-btn
          TitleProp="The-K Support"
          ClassProp="pl-top-util"
          IconProp="pl-icon-util custom"
          TooltipPositionProp="bottom"
          @btnClick="mixin_showDialog('Customize')"
        ></compo-tooltip-btn>
        <!-- The-K Support dialog -->
        <v-dialog
          v-model="dialogCustomize"
          content-class="pl-top-alarm-dialog"
          hide-overlay>
          <compo-dialog
            header-title="The-K Support"
            :HideCloseProp=false
            @hide="mixin_hideDialog('Customize')"
          >
            <template slot="body">
              <v-tabs class="pl-tabs" v-model="TOP_UTIL.tab">
                <v-tab >금융 계산기</v-tab>
                <v-tab >업무관리</v-tab>
                <!-- 금융 계산기 -->
                <v-tab-item>
                  <p class="is-mt-m">금융상품별  예상금액을 조회할 수 있습니다.</p>
                  <div class="is-mt-m flex-grow-1">
                    <div class="pl-cols flex-1" style="border: 1px solid #dbdbdb; height: 580px">
                      <div class="is-vrt is-col-fix" style="width: 180px;">
                        <div style="background: #eee; padding: 14px; border-bottom: 1px solid #dbdbdb" class="d-flex">
                          <v-icon color="black">mdi-chevron-up</v-icon>
                          <h2 class="pl-subtit ml-2">저축</h2>
                        </div>
                        <ul class="pa-3">
                          <li class="py-2"><strong>장기저축급여</strong></li>
                          <li class="py-2">장기저축급여 분할급여금</li>
                          <li class="py-2">목돈급여</li>
                          <li class="py-2">퇴직생활급여</li>
                        </ul>
                        <div style="background: #eee; padding: 14px; border-bottom: 1px solid #dbdbdb" class="d-flex">
                          <v-icon color="black">mdi-chevron-down</v-icon>
                          <h2 class="pl-subtit ml-2">대여</h2>
                        </div>
                        <div style="background: #eee; padding: 14px" class="d-flex">
                          <v-icon color="black">mdi-chevron-down</v-icon>
                          <h2 class="pl-subtit ml-2">보험</h2>
                        </div>
                      </div>
                      <!-- 컨텐츠 -->
                      <div>
                        <div class="pl-card-top">
                          <v-icon color="black">mdi-view-grid-outline</v-icon>
                          <h2 class="pl-subtit ml-2">장기저축급여</h2>
                        </div>
                        <div class="pl-card">
                          <p>조회한 당월부터 매월 17일에 납입한 것으로 가정하며 퇴직월의 말일 기준이 조회됩니다.</p>
                          <div class="pl-form-inline-wrap vertical is-mt-m">
                            <div class="pl-form-inline">
                              <span class="pl-label">
                                월 납입구좌
                                <v-icon class="pl-icon20 required"></v-icon>
                              </span>
                              <div class="pl-desc">
                                <v-text-field
                                  class="pl-form"
                                  placeholder="50~2,500구좌 사이 입력"
                                />
                              </div>
                            </div>
                            <div class="pl-form-inline">
                              <span class="pl-label">
                                납입기간(횟수)
                                <v-icon class="pl-icon20 required"></v-icon>
                              </span>
                              <div class="pl-desc">
                                <v-text-field
                                  class="pl-form"
                                  suffix="년"
                                />
                                <v-text-field
                                  class="pl-form"
                                  suffix="개월"
                                />
                              </div>
                            </div>
                            <div class="pl-form-inline">
                              <span class="pl-label">
                                가입설계일
                                <v-icon class="pl-icon20 required"></v-icon>
                              </span>
                              <div class="pl-desc">
                                <compo-date-picker
                                  DateType="dateInput"
                                  :DateProp.sync="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"/>
                              </div>
                            </div>
                            <div class="pl-btn-wrap">
                              <v-btn class="pl-btn ml-auto" @click="setDemoVal()">조회</v-btn>
                            </div>
                          </div>
                          <h3 class="pl-subtit is-h3 is-mt-m">예상금액(퇴직기준) 조회결과</h3>
                          <div class="pl-form-box-list is-mt-m">
                            <div class="pl-form-box-list-unit pa-2">
                              <div class="pl-form-box-list-content" >
                                <div class="d-flex px-2" style="background: #EEE; border-radius: 12px;">
                                  <span class="pl-label">세전 급여금</span>
                                  <span
                                    class="ml-auto is-txt-blue"
                                    style="font-size: 16px">
                                    <strong>{{ demoVal ? '10,146,610원' : '0원' }} </strong>
                                  </span>
                                </div>
                                <div class="d-flex px-2">
                                  <span class="pl-label">총 부담금</span>
                                  <span class="ml-auto">{{ demoVal ? '7,860,000원' : '0원' }}</span>
                                </div>
                                <div class="d-flex px-2">
                                  <span class="pl-label">부가금</span>
                                  <span class="ml-auto">{{ demoVal ? '2,286,610원' : '0원' }} </span>
                                </div>
                                <div class="d-flex px-2">
                                  <span class="pl-label">세금</span>
                                  <span class="ml-auto">{{ demoVal ? '-0원' : '0원' }} </span>
                                </div>
                                <div class="d-flex px-2">
                                  <span class="pl-label">세후 급여금</span>
                                  <span class="ml-auto">{{ demoVal ? '10,146,610원' : '0원' }} </span>
                                </div>


                              </div>
                            </div>
                          </div>


                        </div>
                      </div>
                    </div>
                  </div>
                </v-tab-item>
                <!-- 업무관리 -->
                <v-tab-item>
                  <div class="is-mt-m">
                    <div class="admin-layout-card-list">
                      <div
                        class="admin-layout-card-list-unit"
                        :class="{'active' : item.active}"
                        v-for="item in CERT_CUSTCO_LIST"
                        :key="item.id"
                        @click="activeItem(item)"
                        >
                        <div class="admin-layout-card-list-unit-head">
                          <img
                            :src="require(`@/assets/img/demo_icon${item.icon}.png`)"
                            height="30"
                            width="30"
                          />
                          <div class="ml-3">
                            <strong >{{ item.title }}</strong>
                            <span class="admin-layout-card-list-unit-sub">{{ item.desc }}</span>
                          </div>
                        </div>
                        <div class="d-flex">
                          <span
                            :class="`pl-round-chip is-mt-s ml-auto`"
                          >
                            바로가기
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-tab-item>
              </v-tabs>
            </template>
          </compo-dialog>
        </v-dialog>

      </div>

      <!-- //mark: 사용자 정보 -->
      <div>
        <v-btn
          @click="mixin_showDialog('Profile')"
          class="pl-top-person"
          title="개인 정보">
          <!-- <img :src="MANAGER_PROFILE.img" :alt="MANAGER_PROFILE.name" /> -->
          <img :src="MANAGER_PROFILE.img" :alt="MANAGER_PROFILE.name" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}" />
        </v-btn>
        <!-- 사용자 정보 모달 -->
        <v-dialog
          v-model="dialogProfile"
          content-class="pl-top-profile-dialog"
          hide-overlay>
          <compo-dialog
            header-title="개인 정보"
            :HideCloseProp=false
            @hide="mixin_hideDialog('Profile')"
          >
            <template slot="body">
              <div class="d-flex">
                <div class="pl-top-profile-dialog-img-wrap">
                  <v-icon small class="pl-icon29 camera" @click="changeProflieImg()"></v-icon>
                  <input ref="fileUpload" type="file" @change="handleFileUpload()" style="display: none" />
                  <img :src="MANAGER_PROFILE.img" :alt="MANAGER_PROFILE.USER_NM" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}" />
                </div>
                <div class="pl-top-profile-dialog-desc-wrap">
                  <dl>
                    <dt>
                      <span> {{ MANAGER_PROFILE.USER_NM }} </span>
                    </dt>
                    <dd>
                      <span class="pl-top-profile-dialog-desc-wrap-address mt-0"> {{ MANAGER_PROFILE.DEPT_NM}} <br> 내선번호( {{MANAGER_PROFILE.EXT_NO}} ) / IP ( {{MANAGER_PROFILE.IP}} )</span>
                      <span class="pl-top-profile-dialog-desc-wrap-place"> {{ MANAGER_PROFILE.OFC_ADDR }} </span>
                      <span class="pl-top-profile-dialog-desc-wrap-email"> {{ MANAGER_PROFILE.EMAIL }} </span>
                      <span class="pl-top-profile-dialog-desc-wrap-phone"> {{ mixin_setPhoneNo(MANAGER_PROFILE.PHN_NO.replace(/[^0-9]/g, "")) }} </span>
                    </dd>
                  </dl>

                </div>
              </div>

            </template>
            <template slot="footer">
              <v-btn class="pl-btn is-sub mr-auto" @click="[mixin_showDialog('Password'), initPswdVar()]">비밀번호 변경</v-btn>
              <!-- <v-btn class="pl-btn is-sub" @click=""></v-btn>
              <v-btn class="pl-btn is-sub" @click="[mixin_showDialog('Password'), initPswdVar()]">비밀번호 변경</v-btn> -->
              <v-btn class="pl-btn is-icon" @click="logout()" style="margin-left: 20px;">
                <span class="pl-icon20 logout"></span>
                로그아웃
              </v-btn>
            </template>
          </compo-dialog>
        </v-dialog>

      </div>
    </div>

    <!-- //mark:  전화걸기 모달 -->
    <v-dialog
      v-model="dialogOutCall"
      content-class="dialog-draggable is-call"
      persistent
      no-click-animation>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="전화 걸기"
        @hide="mixin_hideDialog('OutCall')"
      >
        <template slot="body">
          <!-- component -->
          <compo-out-call
            :DataProp="OUT_CALL_DATA"
            :CUSTCO_ID="CUSTCO_ID"
          />
        </template>
        <template slot="footer">
          <ul class="pl-list-info mt-0">
            <li>고객 조회 후 연락처가 있는 경우 수신번호는 변경할 수 없습니다.</li>
          </ul>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- 전화받기 -->
    <v-dialog
      v-model="dialogInCall"
      content-class="dialog-draggable is-call type-in"
      persistent>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="전화 받기"
        @hide="ctiSkip"
      >
        <template slot="body">
          <!-- component -->
          <compo-in-call
            :DataProp="IN_CALL_DATA"
            :custInfoProp="CUST_INFO"
            :CUST_PHN_NO="CUST_PHN_NO"
            @inCall="inCall()"
            @ctiSkip="ctiSkip()"
            @ctiTransfer="ctiTransfer()"
          />
        </template>
        <template slot="footer">
          <ul class="pl-list-info mt-0">
            <li>신규 고객의 경우 회사명은 표시되지 않습니다.<br/>수신된 전화를 다른 상담원에게 전환을 하실 경우 내선번호를 입력하여야 합니다. </li>
          </ul>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- //mark: 호전환 모달 -->
    <v-dialog
      v-model="dialogCallTrans"
      content-class="dialog-draggable is-lg is-nopadding"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="호전환"
        @hide="mixin_hideDialog('CallTrans')"
      >
        <template slot="body">
          <!-- component -->
          <compo-transfer
            :DataProp="TRANSFER_DATA"
            @ctiPhoneTran="ctiPhoneTran(TRANSFER_DATA)"
            @ctiPhoneTrno="ctiPhoneTrno(TRANSFER_DATA)"
            @ctiPhoneTrok="ctiPhoneTrok(TRANSFER_DATA)"
            @ctiPhoneConf="ctiPhoneConf(TRANSFER_DATA)"
            @ctiPhoneCfno="ctiPhoneCfno(TRANSFER_DATA)"
            @ctiPhoneCfok="ctiPhoneCfok(TRANSFER_DATA)"
          />
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- 콜 이력 찾기 -->
    <v-dialog
      v-model="dialogIpccCallHistFind"
      content-class="dialog-draggable is-lg"
      width="1300px"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="콜 이력 찾기"
        @hide="mixin_hideDialog('IpccCallHistFind')"
      >
        <template slot="body">
          <!-- component -->
          <compo-find-call-hist
            SearchTitleProp="콜 이력 찾기"
            :ST_TIME="SCH_CALL_HIST_ST_TIME"
            :END_TIME="SCH_CALL_HIST_END_TIME"
            :INOUT="SCH_CALL_HIST_INOUT"
            @setRecFileInfo="setRecFileInfo"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('IpccCallHistFind')">닫기</v-btn>
          <v-btn class="pl-btn" @click="getRecFileInfo()">확인</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- //mark: 비밀번호 변경 모달 -->
    <v-dialog
      v-model="dialogPassword"
      content-class="dialog-draggable pl-top-password"
      :persistent="forceChange"
      >
      <div class="draggable-area">drag area</div>
        <v-form ref="form">
      <compo-dialog
        header-title="비밀번호 변경"
        :ForceProp="!forceChange"
        @hide="[mixin_hideDialog('Password'), initPswdVar()]"
        @submit="[submitDialog('Password'), initPswdVar()]"
      >
      <template slot="body">
          <div class="pl-form-inline-wrap vertical">
            <div class="pl-form-inline">
              <span class="pl-label">
                현재 비밀번호
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="PASSWORD_OLD"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  class="pl-form"
                  placeholder="현재 비밀번호 입력"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                  @click:append="show1 = !show1"
                  v-byte-counter="60"
                ></v-text-field>
                <!-- :rules="[rules.required, rules.nowPw, rules.noneSpace]" -->
              </div>
            </div>

            <div class="pl-form-inline">
              <span class="pl-label">
                변경 비밀번호
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="PASSWORD_NEW"
                  :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min, rules.max, rules.noneSpace,rules.pw,]"
                  :type="show2 ? 'text' : 'password'"
                  class="pl-form"
                  placeholder="변경할 비밀번호 입력"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                  @click:append="show2 = !show2"
                  v-byte-counter="16"
                ></v-text-field>
              </div>
            </div>

            <div class="pl-form-inline">
              <span class="pl-label">
                비밀번호 재입력
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="PASSWORD_NEW2"
                  :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min, rules.max, rules.noneSpace,rules.pw ]"
                  :type="show3 ? 'text' : 'password'"
                  class="pl-form"
                  placeholder="변경할 비밀번호 다시 입력"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                  @click:append="show3 = !show3"
                  v-byte-counter="16"
                ></v-text-field>
              </div>
            </div>

          </div>
          <ul class="pl-list-dot">
            <li>비밀번호는 8~16자의 영문 대소문자, 숫자 특수문자만 가능합니다.</li>
            <li>사용 가능한 특수문자 32자<br/>: ! " # $ % & ' ( ) * + , - . / : ; &lt; = &lt; ? @ [ ₩ ] ^ _ ` { | } ~</li>
          </ul>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" v-if="!forceChange" @click="[mixin_hideDialog('Password'), initPswdVar()]">닫기</v-btn>
          <v-btn class="pl-btn" @click="PswdValidate">저장</v-btn>
        </template>
      </compo-dialog>
          </v-form>
    </v-dialog>

    <!-- OmniOne 간편인증 dialog-->
    <v-dialog
      v-model="dialogOmniOne"
      content-class="dialog-draggable is-omnione"
      persistent
      no-click-animation
      height="340"
    >
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="간편인증"
        @hide="$eventBus.$emit('OmniOneStatCheck')"
      >
        <template slot="body">
          <!-- component -->
          <compo-omni-one
            :DataProp="OMNIONE_CUST_INFO"
            @nextEvent="mixin_testLog('간편인증 이후 이벤트')"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn" @click="$eventBus.$emit('OmniOneStatCheck')">닫기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- AS 기사 배정 dialog -->
    <v-dialog
      v-model="dialogAssignManager"
      content-class="pl-top-alarm-dialog"
      width="633"
      hide-overlay>
      <compo-dialog
        header-title="A/S 기사 배정"
        :FooterProp="false"
        @hide="mixin_hideDialog('AssignManager')"
      >
        <template slot="body">
          <AssignManagerDialog
            :INFO = VST_RSVT_INFO
            @selectedVstData="setVstData"
          />
        </template>
      </compo-dialog>
    </v-dialog>

  </v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex';

import { callUtil } from "@/store/callUtil.js";
import Vue from "vue";
import io from "socket.io-client"; //socket.io
import { stompUtil } from "@/store/stomp-util.js";
import { stompSseUtil } from "@/store/stomp-sse-util.js";

import { eventBus } from "@/store/eventBus.js";           //Event Bus
import axios from "axios";
import { get } from 'http';
import AssignManagerDialog from '@/views/page/CSL_M0100_ASSIGNMANAGER_DIALOG.vue';

const sha256 = require("sha256");
const crypto = require("crypto");

let stomeSseReConnectCnt = 36;

export default {
  components: {
    AssignManagerDialog,
  },
  computed: {
    computedNotice() {
      let alarm = false
      // if(this.TOP_UTIL.notice || this.TOP_UTIL.msg) alarm = true;
      if(this.TOP_UTIL.msg) alarm = true;
      return `pl-icon-util notice noti-${alarm}`;
    },

  },
  data: () => ({
    isDevelopment: process.env.VUE_APP_ENV === 'local' || process.env.VUE_APP_ENV === 'devserver',
    CUSTCO_ID : '',
    // confirm alert 메시지
    MESSAGE : {
      CONFIRM : {
        // REGIST : { alertDialogToggle : true, msg : '프로필 사진을 등록 하시겠습니까?', iconClass:'is-info', type :'confirm', callYes: this.uploadProfileYes, callNo:this.closeMsg},
        //FORC_OBD : {alertDialogToggle: true, msg: '상담을 진행중입니다. 그래도 아웃바운드를 진행하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.forcObd, callNo: this.closeMsg}
      },
      ALERT : {
        REG_SUCCESS : {alertDialogToggle: true, msg: '쪽지가 성공적으로 전송되었습니다.', iconClass: 'is-info', type: 'default'}
        , CHG_SUCCESS : {alertDialogToggle: true, msg: ' 정상 처리 되었습니다.', iconClass: 'is-info', type: 'default'}
        , NONE : {alertDialogToggle: true, msg: '받을 사람을 선택해주세요.', iconClass: 'is-caution', type: 'default'}
        , NONE_MSG : {alertDialogToggle: true, msg: '쪽지 내용을 입력하세요.', iconClass: 'is-caution', type: 'default'}
        , ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        , MYSELF : {alertDialogToggle: true, msg: '본인을 선택하셨습니다.', iconClass: 'is-caution', type: 'default'}
        , SAMEUSER : {alertDialogToggle: true, msg: '이미 추가한 회원이 존재합니다.', iconClass: 'is-caution', type: 'default'}
        , NOT_CONFIRMED_PSWD : {alertDialogToggle: true, msg: '비밀번호가 일치하지 않습니다.', iconClass: 'is-caution', type: 'default'}
        , NOT_SAME_PSWD : {alertDialogToggle: true, msg: '변경할 비밀번호는<br> 기존 비밀번호와 같을 수 없습니다.', iconClass: 'is-caution', type: 'default'}
        , SOCKET_ERROR : {alertDialogToggle: true, msg: 'CTI에 로그인이 되어 있지 않습니다.', iconClass: 'is-caution', type: 'default'}
        , EXT_NO_EMPTY : {alertDialogToggle: true, msg: '내선번호가 존재하지 않습니다.<br>관리자에게 문의해 주세요.', iconClass: 'is-caution', type: 'default'}
      },
      TOAST : {
        SUCCESS : {  msg: ' 정상 처리 되었습니다.', class: 'info', hasToastIcon: true, icon: 'mdi-information-outline', time: 3000 }
      }
    },

    NOTE_FIND_USER_HEADERS : [
      { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px' },
      { text: '사용자명', value: 'USER_NM', width: '100px' },
      { text: '사용자ID', value: 'LGN_ID', width: '150px' },
      { text: '내선번호', value: 'EXT_NO', width: '100px' },
      { text: '직책', value: 'JBTTL', width: '150px' },
      { text: '부서', value: 'DEPT_NM', width: '150px' },
      { text: '사용자상태', value: 'USER_STTS', width: '100px' },
    ],
    userNm: '',
    selectedItem:[],
    POST_MEMO_LIST:[],
    POST_MEMO_LIST2:[],
    COMM_CD_LIST:[],                    //사용할 공통코드 리스트
    COMM_CD_DROP_LIST:[],               //공통코드로 생성된 드롭박스 리스트

    SearchDataDrop:{},    //검색 데이터 드롭박스 항목
    dropSelected: '',     //드롭박스 초기선택
    dropSelected2: '',    //드롭박스 초기선택2
    searchInput: '',
    headers:[],           //그리드 헤더
    items:[],             //그리드 데이터
    page: 1,              //그리드 현재페이지
    pageCount: 0,         //그리드 총페이지
    perPage: [15,30,50,100],  //그리드 페이지당 표시항목
    // ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때
    ROW_PER_PAGE: 15, //페이징 없이 전체 화면 뿌릴때

    pagination: {
      page: 1,
      rowsPerPage: 500,
      sortBy: "",
      descending: ""
    }, //그리드 페이지속성정의

    nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼

    msgflag: true,


    NotiDetail: {
      subject : '',
      count : '',
      date : '',
      time : '',
      manager: '',
      text: '',
      PST_ID: '',
      BBS_ID: '',
      FILE_GROUP_KEY: '',
      filelist: [],
    },

    SRCH_CUST : [],

    SRCH_USER : [],

    // dialog
    dropCtiMove: false,
    dropSelectCompany: false,
    dialogOutCall: false,
    dialogInCall: false,
    dialogCallTrans: false,
    dialogProfile: false,
    dialogPassword: false,
    dialogAlarm: false,
    dialogNoticeDetail:false,
    dialogCustomize: false,

    // 알람 모달
    SORT_ITEMS: [],
    NOTE_SORT_ITEMS: [
      { title: '받은 쪽지', selected: true, type: 'give'  },
      { title: '보낸 쪽지', selected: false, type: 'send'  },
      // { title: '쪽지 보내기', selected: false, type: 'post'  },
    ],
    ALARM_LIST: [],
    NOTE_GIVE_LIST: [],
    NOTE_SEND_LIST: [],
    NOTE_SORT: 'give',
    ALARM_SORT: 'all',
    NOTE_CONTENTS: '',
    NOTE_REPLY_CONTENTS: '',
    GENR_CNT: '',
    NOTI_CNT: '',
    EMRG_CNT: '',
    NEW_MSG_REG_DT: '',
    MSG_FROM_CNT: '',
    MSG_TO_CNT: '',

    // 쪽지 보내기 grid
    page1: 1,
    pageCount1: 0,
    ROW_PER_PAGE1: -1,
    POST_MEMO_HEADER: [
      // { value: 'ROW_NUMBER', align : ' d-none', width: '0px'},
      { text: '이름', value: 'USER', align: 'left', width: '90px' },
      { text: '사용자ID', value: 'ID', align: 'left', width: '90px' },
      { text: '소속', value: 'PART', align: 'left', width: '120px' },
    ],

    page2: 1,
    pageCount2: 0,
    ROW_PER_PAGE2: -1,
    POST_MEMO_HEADER2: [
      // { value: 'ROW_NUMBER', align : ' d-none', width: '0px'},
      { text: '받을 사람', value: 'USER', align: 'left', sortable: false, },
    ],

    POST_MEMO_HEADER_ITEMS: [],
    POST_MEMO_HEADER_ITEMS2: [],

    ENCRYPT_KEY: "",
    PASSWORD_NEW: "",
    PASSWORD_NEW2: "",
    PASSWORD_OLD: "",
    COMPANY_INFO: [],
    SELECTED_COMPANY: '',

    PREV_CTI_STAT : '', //이전 CTI 상태
    CUST_PHN_NO: '',

    //전화걸기
    OUT_CALL_DATA: {
      dropItems: [],
      dropItems2: [],
      CL_TYPE_CD: 'OUT',
      CUST_PHN_NO: '',
      CUST_ID: '',
      CPI_ID: '',
      recFileNm: '',
      MODIFY_USE: true,
    },
    //상담중 전화걸기 클릭 시 confirm 전에 가지고 있을 데이터
    WAIT_OUT_CALL_DATA: {
      dropItems: [],
      dropItems2: [],
      CL_TYPE_CD: 'OUT',
      CUST_PHN_NO: '',
      CUST_ID: '',
      CPI_ID: '',
      recFileNm: '',
      MODIFY_USE: true,
    },

    //전화받기
    IN_CALL_DATA: {
      company: '',
      CL_TYPE_CD: 'IN',
      CUST_PHN_NO: '',
      desc: '',
      recFileNm: '',
    },

    //고객 정보
    CUST_INFO : {},

    //IPCC 연동 URL 정보
    IPCC_SOCKET_URL : '', //IPCC SOCKET URL
    SKIP_URL : '', //SKIP URL (거부)
    TRANS_URL : '', //TRANSFER URL (호전환)
    FANVIL_URL : '', //판빌(전화기업체) 상태 체크 URL

    IN_NUM : '', //내선번호(4자리 이상)
    CTI_LOGIN_BOOLEAN : false, //cti 로그인 여부
    SECURE_MODE : true,                                       // SSL option
    PING_INTERVAL: 1000 * 10,
    PING_TIMEOUT: 1000 * 60 * 60 * 3,                         // 스크린세이버 대응 : 3시간

    TRAN_INLNE_NO : '', //2자 내선번호
    CONF_INLNE_NO : '', //3자 내선번호

    CTI_MENU: [
      { text: "대기", icon: 'pl-icon-cti-wait', disabled: true, evt: 'db_state', active: false, event: '1'},
      { text: "걸기", icon: 'pl-icon-cti-call', disabled: true, evt: 'dialogOutCall', active: false, event: '0'},
      { text: "끊기", icon: 'pl-icon-cti-drop', disabled: true, evt: 'phone_hang', active: false, event: ''},
      { text: "보류", icon: 'pl-icon-cti-hold', disabled: true, evt: 'phone_hold', active: false, event: ''},
      { text: "음소거", icon: 'pl-icon-cti-mute', disabled: true, evt: 'phone_mute', active: false, event: ''},
      { text: "호전환", icon: 'pl-icon-cti-trans', disabled: true, evt: 'dialogCallTrans', active: false, event: '0'},
      { text: "후처리", icon: 'pl-icon-cti-write', disabled: true, evt: 'db_state', active: false, event: '2'},
    ],
    CTI_STAT: false,
    MOVE_LIST: [
      { text: "휴식", icon: 'stat-rest', evt: 'db_state', active: false, event: '3'},
      { text: "교육", icon: 'stat-edu', evt: 'db_state', active: false, event: '4'},
      { text: "식사", icon: 'stat-launch', evt: 'db_state', active: false, event: '5'},
      { text: "기타", icon: 'stat-etc', evt: 'db_state', active: false, event: '6'},
    ],

    SELECTED_MOVE: {text: '이석', icon: 'stat-init'},
    CALLSTAT:{
      stat1: { type: 'CTI OFF', time: '00:00:00', icon: 'stat-off'},
      stat2: { type: 'CTI ON', time: '00:00:00', icon: 'stat-on'},
      stat3: { type: '후처리', time: '00:00:00', icon: 'stat-after'},
      stat4: { type: '대기', time: '00:00:00', icon: 'stat-wait'},
      stat5: { type: '통화중', time: '00:00:00', icon: 'stat-call'},
      stat6: { type: '휴식', time: '00:00:00', icon: 'stat-rest'},
      stat7: { type: '교육', time: '00:00:00', icon: 'stat-edu'},
      stat8: { type: '식사', time: '00:00:00', icon: 'stat-launch'},
      stat9: { type: '기타', time: '00:00:00', icon: 'stat-etc'},
    },
    SELECTED_CALLSTAT: 'stat1', //선택된 상태
    CUSL_STAT_TIME: '00:00:00', //상태별 타이머
    CTI_CALL_TIMER: '00:00:00', //상태별 타이머
    CUSL_BTN_STYLE: 'pointer-events: none;opacity: 0.4;', //상담사 이석 상태 버튼 비활성화
    CUTT_CN_SAVE_ING: false, //상담내용 저장 중인지 여부

    CTI_INFO : {                                              // CTI 상태
      strState : "",				                                  // 전화기 상태정보
      strCnslId : "",				                                  // 상담이력 정보저장
      strCallMode : "",			                                  // 인아웃바운드 구분
      strAspCustKey : "",                                     // ASP CUST KEY
      strAspCustTel : "",                                     // ASP CUST 대표번호
      strChannel : "",			                                  // cti 채널키
      strRecKey : "",				                                  // 녹취키
      strConference : "",	                                    // 3자통화 여부
      strConferenceCancle : "",	                              // 3자통화 고객취소여부
      strTransSucess : "",		                                // 2자전환 완료여부
      strStartTime :	"",			                                // 전화종료시간
      strStartDate :	"",			                                // 전화종료시간
      strEndTime :	"",			                                  // 전화종료시간
      strEndDate :	"",			                                  // 전화종료시간
      strReqSearchDate :	"",		                              // 전화종료녹취검색시간
      strPreCtiState :	"",		                                // 이전상태값
    },

    CTI_TRANS_CONFER : {                                      // 호전환, 3자
      gbn : "",                                               // 호전환, 3자 여부
      state : ""                                              // ringing, answer 상태
    },

    TOP_UTIL: {
      notice: false, //알람 여부
      toggleSearch : false, // 사용자 찾기 토글
      searchCusname: '',    //고객이름검색
      tab : 0,              // 알림창 활성화 탭
      msg : false,
      msgCnt : 0,
    },
    //검색 모달창에서 watch로 모달창을 띄움과 동시에 검색을 하는데 top_util을 그대로 사용하면 키보드 입력마다 api를 실행하기때문에 리소스가 많이쌓임
    // ==> 버튼 클릭할 때 변수에 값 넣어주기
    searchCusname: '',    //고객이름검색


    MANAGER_PROFILE: {                                    // 사용자 프로필
      img : '',//require('@/assets/img/@profile_user.png'),    // 이미지 사이즈  69x69
      FILE_GROUP_KEY : '',
      CO_NM : '',                                         // 회사 이름
      USER_NM : '',                                       // 사용자 이름
      DEPT_NM: '',                                      // 소속
      IP : '',                                            // 접속 IP
      EXT_NO : '',                                        // 내선번호
      OFC_ADDR: '',                                       // 사무실 주소
      EMAIL : '',                                         // 이메일
      PHN_NO : '',                                        // 휴대전화번호
      IMG_FILE : [],
    },
    PROFILE_FILE : null,

    // 호전환
    TRANSFER_DATA: {},

    //password
    forceChange: false,
    show1: false,
    show2: false,
    show3: false,
    rules: {
      required: value => !!value || 'Required.',
      // same : v => !(v && v !== PASSWORD_NEW) || '변경할 비밀번호는 동일해야합니다.',
      min: v => v.length >= 8 || 'Min 8 characters',
      max: v => v.length <= 16 || 'Min 16 characters',
      noneSpace : v => (v || '').indexOf(' ') < 0 ||'공백을 허용하지 않습니다.',
      // caret : v =>  /[\:\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\₩\]\^\_\`\{\|\}\~]/.test(v) || '',
      // caret : v =>  /[:!"#$%&'()*+,\-./:;<=>?@[\]\\^_`{|}~]/.test(v) || '',
      pw : v => /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[:!"#$%&'()*+,\-./:;<=>?@[\]\\^_`{|}~]).{8,16}$/.test(v) || '',
      nowPw : v => /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[:!"#$%&'()*+,\-./:;<=>?@[\]\\^_`{|}~]).{5,16}$/.test(v) || '',

    },
    dialogCusFind: false,     //고객검색모달

    DropCus: {},
    DropUser: {},
    HeadersFindCus: [],
    ItemsFindCus:[],

    dialogIpccCallHistFind: false, //IPCC 콜 이력 검색 모달
    SCH_CALL_HIST_ST_TIME: '',
    SCH_CALL_HIST_END_TIME: '',
    SCH_CALL_HIST_INOUT: 'CVS',

    detailValidateRules: {
      MSG_CN: [
        v => !!v || '쪽지내용 은(는) 필수 입력 항목 입니다.',
      ],
    },
    //mark: 시연 data: 종합복지마스터조회
    demoVal: false,
    CERT_CUSTCO_LIST: [
      {
        title: '회원정보 변경 내역',
        icon: '01',
        desc: '회원정보 변경 내역 회원 정보의 변경 이력 내역을 조회합니다.',
        active: false
      },
      { title: '회원증 재발급', icon: '02', desc: '등록 회원의 회원증을 재발급 할 수 있습니다.', active: false },
      { title: '분회조회', icon: '03', desc: '등록된 분회 정보의 목록 조회와 검색을 할 수 있습니다.', active: false },
      { title: 'ARS 비밀번호 조회', icon: '04', desc: '회원의 ARS 비밀번호를 조회 할 수 있습니다.', active: false },
      { title: '원스톱 등록 회원', icon: '05', desc: '신규 회원을 원스톱으로 등록합니다.', active: false },
      { title: '원천세 환급', icon: '06', desc: '회원의 원천세 정보를 조회하고 환급 처리합니다.', active: false },
      { title: '미가입자 등록', icon: '07', desc: '새로운 회원을 등록하고 관리합니다.', active: false },
    ],

    OMNIONE_CUST_INFO : {},

    // dialog as기사 배정
    VST_RSVT_IDX : -1,
    dialogAssignManager: false,
    VST_RSVT_INFO : null,
  }),

  beforeDestroy(){
    this.$eventBus.$off("pwdChange"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("dialogOutCall"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("dialogOutCallClose"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("renewalMsgList"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("dialogIpccCallHistFind"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("searchCustName"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("initSettingEnv"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("dialogOmniOne"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("dialogAssignManager"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("closeAssignManager"); //eventBus 중복방지를 위해 off
  },

  async created() {
    //설문조사 서비스는 this.initConnectSSE(); 실행 시키지 않기 위해 SELECTED_COMPANY 조회를 mounted에서 created로 옮김.
    this.COMPANY_INFO = this.$store.getters["userStore/GE_USER_ROLE"].company_list;
    if(this.COMPANY_INFO.length > 0){
      this.SELECTED_COMPANY = this.COMPANY_INFO[0];
      this.$store.commit("userStore/MU_USER_COMPANY",this.COMPANY_INFO[0]);
      this.$store.getters["userStore/GE_USER_ROLE"].company = this.COMPANY_INFO[0];
      this.$store.getters["userStore/GE_USER_ROLE"].EXT_NO = this.COMPANY_INFO[0].EXT_NO; //내선번호
      this.$store.getters["userStore/GE_USER_ROLE"].PDS_EXT_NO = this.COMPANY_INFO[0].PDS_EXT_NO; //PDS 내선번호
      this.$store.commit("userStore/MU_USER_EXT_NO", this.COMPANY_INFO[0].EXT_NO);//내선번호
      this.$store.commit("userStore/MU_USER_PDS_EXT_NO", this.COMPANY_INFO[0].PDS_EXT_NO);//PDS 내선번호
    }

    this.$eventBus.$on("dialogAssignManager", (VST_RSVT_INFO) => {
      console.log('TOP this.VST_RSVT_INFO : ', VST_RSVT_INFO);
      this.VST_RSVT_INFO = VST_RSVT_INFO;
      this.VST_RSVT_IDX = VST_RSVT_INFO.VST_RSVT_IDX;
      this.mixin_showDialog('AssignManager');
      setTimeout(() => this.$eventBus.$emit('initRsvt'), 300);
    });
    
    this.$eventBus.$on("closeAssignManager", () => {
      this.mixin_hideDialog('AssignManager');
      this.$eventBus.$emit('initRsvt');
      try{this.$eventBus.$emit('reloadVstRsvtList');}catch(e){}
    });

    //간편인증 dialog 열기
    this.$eventBus.$on("dialogOmniOne", (omniOneInfo) => {
      this.dialogOmniOne = true;
      this.OMNIONE_CUST_INFO = omniOneInfo;
      this.mixin_showDialog('OmniOne');
    });

    //간편인증 dialog 닫기
    this.$eventBus.$on("dialogOmniOneClose", () => {
      this.dialogOmniOne = false;
      this.OMNIONE_CUST_INFO = {};
      this.mixin_hideDialog('OmniOne');
    });

    //전화상담 -> 고객정보 전화걸기
    this.$eventBus.$on("dialogOutCall", (OUT_CALL_DATA) => {
      if(!this.$store.getters["statusStore/GE_CUTT_ING"]){ //상담중이 아닌 경우
        this.OUT_CALL_DATA = OUT_CALL_DATA;
        this.dialogOutCall = true;
        this.mixin_showDialog('dialogOutCall');
      }else{
        //confirm창에서 예를 누르기 전 데이터를 잠시 가지고 있어야함
        this.WAIT_OUT_CALL_DATA = OUT_CALL_DATA
        this.showAlert({alertDialogToggle: true, msg: '상담을 진행중입니다. 그래도 아웃바운드를 진행하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.forcObd, callNo: this.closeMsg});
      }
    });

    //콜 이력 찾기 모달 열기
    this.$eventBus.$on("dialogIpccCallHistFind", (SCH_CALL_HIST_INFO) => {
      this.SCH_CALL_HIST_ST_TIME = SCH_CALL_HIST_INFO.ST_TIME;
      this.SCH_CALL_HIST_END_TIME = SCH_CALL_HIST_INFO.END_TIME;
      this.SCH_CALL_HIST_INOUT = SCH_CALL_HIST_INFO.INOUT;

      this.dialogIpccCallHistFind = true;
      this.mixin_showDialog('IpccCallHistFind');
      this.$eventBus.$emit('ipccCallHistInit');
    });

    this.$eventBus.$on("pwdChange", () => {
      this.forceChange = true;
      this['dialogPassword'] = true;
    });

    this.$eventBus.$on("renewalMsgList", () => {
      this.TOP_UTIL.tab = 1;
      this.alGetMsgList();
    });

    this.$eventBus.$on("initSettingEnv", (e) => {
      if(e === undefined || this.mixin_isEmpty(e)) this.initSettingEnv();
      else{
        let result = JSON.parse(e);
        if('SRVC_INFO' in result) { //고객사별 서비스 정보
          let arrSrvc = [];
          result.SRVC_INFO.split('_##_').forEach((srvc, idx) => {
            let srvcNm = srvc.split(',')[0];
            let srvcStat = srvc.split(',')[1];
            arrSrvc[srvcNm] = srvcStat;
          });
          this.$store.commit("userStore/MU_CUSTCO_SRVC_INFO", {...arrSrvc});
        }
        
        if('OMNIONE_INST_NM' in result) { //본인인증 인증기관
          this.$store.commit("userStore/MU_OMNIONE_INST_NM", result.OMNIONE_INST_NM);
        }
        
        if('CALLBACK_INFO' in result) { //콜백 등록 및 처리 이후
          setTimeout(() => this.getCallbackInfo(), 1000); //콜백 정보 조회
        }
        
        if('RSVTCALL_INFO' in result) { //예약콜 등록 및 처리 이후
          setTimeout(() => this.getReserveCallInfo(), 1000); //예약콜 정보 조회
        }
      }
    });

    // this.COMPANY_INFO = this.$store.getters["userStore/GE_USER_ROLE"].company_list;

    // if(this.COMPANY_INFO.length > 0){
    //   this.SELECTED_COMPANY = this.COMPANY_INFO[0];
    //   this.$store.commit("userStore/MU_USER_COMPANY",this.COMPANY_INFO[0]);
    //   this.$store.getters["userStore/GE_USER_ROLE"].company = this.COMPANY_INFO[0];
    //   this.$store.getters["userStore/GE_USER_ROLE"].EXT_NO = this.COMPANY_INFO[0].EXT_NO; //내선번호
    //   this.$store.getters["userStore/GE_USER_ROLE"].PDS_EXT_NO = this.COMPANY_INFO[0].PDS_EXT_NO; //PDS 내선번호
    //   this.$store.commit("userStore/MU_USER_EXT_NO", this.COMPANY_INFO[0].EXT_NO);//내선번호
    //   this.$store.commit("userStore/MU_USER_PDS_EXT_NO", this.COMPANY_INFO[0].PDS_EXT_NO);//PDS 내선번호
    // }

    // this.CUSTCO_ID = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;

    // //IPCC 연동 URL 정보 셋팅
    // this.IPCC_SOCKET_URL = this.$store.getters["userStore/GE_USER_COMPANY"].API_URI;
    // let sApiUri = this.IPCC_SOCKET_URL;
    // const iSemiCnt = sApiUri.match(/:/g).filter(function(item) { return item !== ''; }).length;

    // if(iSemiCnt > 1){
    //   this.SKIP_URL = sApiUri.split(':')[0] + ':' + sApiUri.split(':')[1]; //거부
    //   this.TRANS_URL = sApiUri.split(':')[0] + ':' + sApiUri.split(':')[1]; //호전환
    //   this.FANVIL_URL = sApiUri.split(':')[0] + ':' + sApiUri.split(':')[1]; //판빌(전화기업체) 상태 체크
    // }else{
    //   this.SKIP_URL = sApiUri; //거부
    //   this.TRANS_URL = sApiUri; //호전환
    //   this.FANVIL_URL = sApiUri; //판빌(전화기업체) 상태 체크
    // }

    // this.getUserInfo(); //로그인 사용자 정보

    //전화상담 메인화면의 고객정보 MainchatCusInfo에서 CTI 버튼 상태 조회용
    this.$eventBus.$on("getCtiBtnStat", (e) => {
      eventBus.setCtiBtnStat('setCtiBtnStat', this.CTI_STAT);
    });

    //전화상담 메인화면의 상담사 상태 조회용
    this.$eventBus.$on("getCuslStat", (e) => {
      eventBus.setCuslStat('setCuslStat', this.CALLSTAT[this.SELECTED_CALLSTAT].type);
    });

    this.setStatTime('stat1'); //CTI OFF 타이머 시작

    this.SELECTED_MOVE = {text: '이석', icon:'stat-init'}; //CTI 상담사 이석 상태 초기화

    /*------------------------------------------------------*/
    /* 고객별 환경설정 세팅용도. & 콜백, 예약콜 알람표시관련*/
    /*------------------------------------------------------*/
    await this.initSettingEnv();

    /*------------------------------------------------------*/
    /* 실시간 변경사항을 웹 브라우저에 갱신해줘야 하는 경우 사용예정 */
    /*------------------------------------------------------*/
    //설문조사 서비스는 사용 안함. 2024.04.18. by hjh.
    if(this.SELECTED_COMPANY.SRVC_GDS_ID != 99) {
      this.initConnectSSE();
    }

    // 알림센터 쪽지보내기용 사용자찾기 - 공통코드 불러오기
    this.COMM_CD_LIST = [
        "USER_ST"         //사용자상태
        , "USER_SRCH"     //사용자 검색조건
        , "CUST_ST"       //고객상태
        , "CUST_SRCH"     //고객검색조건
        , "SEAT_MOVE_TP" //고객사별 이석 종류
    ];

    //공통코드
    this.COMM_CD_DROP_LIST = await this.mixin_common_code_get_all(this.COMM_CD_LIST);
    let userSrchDrop = await this.mixin_common_code_get(this.COMM_CD_DROP_LIST, 'USER_SRCH');

    //이석 종류 가져오기
    this.getSeatMoveTp();

    //사용자찾기모달창
    this.SearchDataDrop = {
      name: userSrchDrop,
    }

    //드롭박스 초기세팅
    if(userSrchDrop.length > 0) this.dropSelected2 = await this.SearchDataDrop.name[0].value;

    // 공통코드로 게시유형 관리
    let codeName = ['BORD_TP'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    let sortItems = {};
    for(let i=0; i<this.common_code[0].group_value.length; i++){
      sortItems = {
        title: '',
        selected: '',
        type: ''
      };
      sortItems.title = this.common_code[0].group_value[i].CD_NM;
      sortItems.selected = false;
      sortItems.type = this.common_code[0].group_value[i].CD;
      this.SORT_ITEMS.push(sortItems);
    }
    // 게시유형 전체 추가
    let sortAll = { title: '전체', selected: true, type: ''  };
    this.SORT_ITEMS.unshift(sortAll);


    // 메인 게시판바로가기 툴팁 클릭시 알림센터 dialog 오픈
    this.$eventBus.$on("setTrue", (open) => {
      this.dialogAlarm = open;
      this.alGetBrdList();
      // 게시유형 '전체'만 활성화
      for(let i=0; i<this.SORT_ITEMS.length; i++){
        this.SORT_ITEMS[i].selected = false;
      }
      this.SORT_ITEMS[0].selected = true;
      // console.log("setTrue", open);
    });

    //전화걸기 dialog 닫기
    this.$eventBus.$on("dialogOutCallClose", () => {
      this.dialogOutCall = false;
      this.mixin_hideDialog('dialogOutCall'); //아웃바운드 다이얼로그 닫기
    });

    //고객찾기 dialog 닫기
    this.$eventBus.$on("dialogCusFindClose", () => {
      this['dialogCusFind'] = false;
    });

    /****************************************************************************************************************************************************
     * EventBus created START
     ***************************************************************************************************************************************************/

    /**
     * 로그인/아웃 CTI 배열 조정
     */
    this.$eventBus.$on("busInitCallCti", (e) => {

      let ctiBtnGbn = "";                                           //  CTI 버튼 배열 조정 값

      let result    = "";
      let desc      = "";
      let data      = "";
      let mobile    = "";                                           // 모바일사용여부

      result = e.result;
      desc   = e.desc;

      switch (desc) {

        case "db_login" :                                           // CTI 로그인

          if (result == "true") {
            mobile = e.mobile;
            this.ctiBtnControl('10|10|00|00|00|00|11'); //후처리 상태
          } else {
            this.CTI_LOGIN_BOOLEAN = false;
            this.PDS_LOGIN_BOOLEAN = false;
          }

          break;

        case "db_logout" :                                          // CTI 로그아웃

          if (result == "true") {
            this.$socket.disconnect();
            Vue.prototype.$socket = null;
            this.ctiBtnControl('00|00|00|00|00|00|00'); //CTI OFF
          } else {
          }

          break;

        case "db_state" : // IPCC 이벤트 결과 ((1:대기, 2:후처리, 이석_3:휴식, 이석_4:교육, 이석_5:식사, 이석_6:기타))

          if (result == "true") {

            data = e.data;

            /** CTI 대기버튼 */
            if (data === "1") { // 대기
              this.ctiBtnControl('11|00|00|00|00|00|10'); //대기 상태
            } else if (data === "2") { // 후처리
              this.ctiBtnControl('10|10|00|00|00|00|11'); //후처리 상태

              console.log("#####this.CTI_DB_STATE hangup 1 ################################################################");
              console.log("this.CTI_DB_STATE : " + this.CTI_DB_STATE);

              if (this.CTI_DB_STATE == "hangup") {
              } else {
              }

            // } else if (data == "3" || data == "4" || data == "5" || data == "6") {    // 이석처리_3:휴식, 이석_4:교육, 이석_5:식사, 이석_6:기타
            } else if (data !== '1' && data !== '2' && !isNaN(data)) {    // 이석처리
              // let cuslStat = '';
              // switch (data) {
              //   case '3' :
              //     cuslStat = '1000';
              //     break;
              //   case '4' :
              //     cuslStat = '0100';
              //     break;
              //   case '5' :
              //     cuslStat = '0010';
              //     break;
              //   case '6' :
              //     cuslStat = '0001';
              //     break;
              // }

              // this.cuslStateControl(cuslStat); //상담사 이석 상태
              this.cuslStateControl(data); //상담사 이석 상태
            }
            //pds 로그인, 로그아웃, 상태변경
            else if(data == "logon" || data == "logon2") {  //pds 로그인
              mobile = e.mobile;

              /** 모바일 사용여부 */
              if (mobile == "1") { mobile = "Y"; }
              else { mobile = "N"; }

              this.$store.dispatch("userStore/AC_MOBIE_YN", mobile);  // 모바일 사용여부 User Store 저장
            } else if(data == "logoff") {   //pds 로그아웃
            } else if(data == "job") {   //pds 후처리
              /** 대기해제 -> 대기 타이틀 변경 */
              console.log("#####this.CTI_DB_STATE hangup 1 ################################################################");
              console.log("this.CTI_DB_STATE : " + this.CTI_DB_STATE);

              if (this.CTI_DB_STATE == "hangup") {
              } else {
              }
            } else if(data == "rest") {   //pds 휴식
            } else if(data == "ready") {   //pds 대기
            }
            //pds는 db_login으로 받아오지 않고 모두 db_state로 받아와서 이곳에 저장할 수밖에 없음
          }

          break;

        case "phone_hang" :
          this.$eventBus.busCtiHangup(desc);
          break;
        case "phone_acce" :                                                           // 전화받기
          break;

        case "phone_mute" :                                                           // 음소거
        case "phone_hold" :                                                           // 보류, 호전환 취소 (내부->내부/외부 두번째 이벤트)

          if (result == "true") {

            if (this.CTI_INFO.strState == "phone_tran" || this.CTI_INFO.strState == "phone_cftel") {  // 호전환 취소 (내부->내부/외부 두번째 이벤트), 3자 취소 (내부->내부 두번째 이벤트)
            } else {
              this.ctiMuteHold(desc);       // ctiInitCall
            }
          }

          break;

        case "phone_call" :
        case "phone_call2" :

          if (result == "true") {
            this.ctiMuteHold(desc);                                                   // 판빌전화기 연동 -> ctiInitCall
          }

          break;

        case "phone_tran" :                                                           //호전환 시도(내부->내부/외부)
          this.ctiTranCftel(desc);

          break;

        case "phone_trno" :                                           // 호전환 취소 (내부->내부/외부 첫번째 이벤트)
          break;

        case "phone_trok" :                                           // 호전환 완료
          this.ctiTrokCfok(desc);

          break;

        case "phone_conf" :                                           // 3자 시도 첫번째 이벤트
          break;

        case "phone_cftel" :                                          // 3자 시도 두번째 이벤트
          this.ctiTranCftel(desc);

          break;

        case "phone_cfno" :                                           // 3자 취소 (내부->내부 첫번째 이벤트)
          break;

        case "phone_cfok" :                                           // 3자 완료
          this.ctiTrokCfok(desc);

          break;
      }

      /** CTI 버튼 배열 조정 */
      if (result == "true") {

        if (desc == "phone_acce") {                                                             // 전화받기 이벤트
          //
        } else if (desc == "phone_mute" || desc == "phone_hold") {                              // 무음, 보류, //  desc == "phone_trok" || desc == "fanvil_phone_trok"

          if ((desc == "phone_hold" && this.CTI_INFO.strState == "phone_tran")                  // 호전환 취소 : 내부 -> 내부/외부(answer)
              || (desc == "phone_hold" && this.CTI_INFO.strState == "phone_cftel")) {           // 3자 취소 : 내부 -> 내부/외부(answer)
            this.ctiTrnoCfno();
          }

        } else if (desc == "phone_hang") {                                                      // 전화끊기 이벤트
        } else if (desc == "phone_tran") {                                                      // 호전환 시도  else if
        } else if (desc == "phone_conf" || desc == "phone_cftel") {                             // 3자 시도
        } else if (desc == "phone_trno") {                                                      // 호전환 취소
        } else if (desc == "phone_trok") {                                                      // 호전환 완료
        } else if (desc == "phone_cfok") {                                                      // 3자 완료
        } else {

          if(this.PDS_LOGIN_BOOLEAN == true){
            this.CTI_DB_STATE = (ctiBtnGbn == "pdsOn" ? "pdsHandle" : ctiBtnGbn);
          } else if(this.CTI_LOGIN_BOOLEAN == true){
            this.CTI_DB_STATE = (ctiBtnGbn == "on" ? "handle" : ctiBtnGbn);
          }

          /** CTI 버튼 배열 조정 */
          if (result == "true") {
          } else {
          }
        }

      } else {
      }
      });

      /**
      * 끊기 이벤트
      */
    this.$eventBus.$on("busCtiHangup", (e) => {
      this.dialogInCall = false;
      this.mixin_hideDialog('dialogInCall'); //전화받기 모달 닫기
      this.OUT_CALL_DATA.MODIFY_USE = true;
      console.log('-----------전화 끊음------------------------');
      console.log('-----------------------------------');
      console.log('이전 상태 : ', this.PREV_CTI_STAT);
      console.log('-----------------------------------');
      if(this.PREV_CTI_STAT === 'RINGING'){ //전화벨이 울린 상태에서 고객이 전화를 끊음
        this.$eventBus.$emit("busForceEnd");
        this.CUTT_CN_SAVE_ING = false; //상담 form 내용 저장중 아님
        this.$socket.emit('sendmsg', 'db_state', '1');
        this.ctiBtnControl('11|00|00|00|00|00|10'); //대기 상태
      }else{
        this.$eventBus.$emit("busCuttEnd");
        this.CUTT_CN_SAVE_ING = true; //상담 form 내용 저장중
        this.ctiBtnControl('00|00|00|00|00|00|11');
      }
      this.CTI_MENU[3].text = '보류';
      this.CTI_MENU[4].text = '음소거';
      this.CTI_DB_STATE = 'answer';
    });

      /**
      * 3자 완료 내부->내부 (상대방 상담사 통화 후 종료)
      * @param {} e
      */
    this.$eventBus.$on("busCtiHangAgent", () => {

      let conferencdCancle = (typeof this.CTI_INFO.strConferenceCancle == undefined || typeof this.CTI_INFO.strConferenceCancle == "undefined") ? "" : this.CTI_INFO.strConferenceCancle;

      console.log("#####busCtiHangAgent########################################");
      // console.log("this.CTI_INFO.strState : " + this.CTI_INFO.strState);
      // console.log("this.CTI_INFO.strConference : " + this.CTI_INFO.strConference);
      // console.log("this.CTI_INFO.strConferenceCancle : " + this.CTI_INFO.strConferenceCancle);
      // console.log("conferencdCancle : " + conferencdCancle);
      // console.log("this.CTI_INFO.strTransSucess : " + this.CTI_INFO.strTransSucess);

      if (this.CTI_INFO.strConference == "Y" && conferencdCancle == "") {

        // this.ctiBtnTrans(false);

        this.CTI_INFO.strTransSucess = "";                                  // 호전환 초기화
        this.CTI_INFO.strConference  = "";                                  // 3자 여부 초기화

        // this.CTI_BRD.current         = "통화중";
        // this.CTI_BRD.icon            = "cti-btn-answer";

        console.log("#####setCtiTrokCfok#################################################################");
        // console.log("this.CTI_INFO.strState : " + this.CTI_INFO.strState);
        // console.log("this.CTI_INFO.strPreCtiState : " + this.CTI_INFO.strPreCtiState);
        // console.log("this.CTI_INFO.strTransSucess : " + this.CTI_INFO.strTransSucess);

      } else {

        let transConferGbn   = "";
        let transConferState = "";

        transConferGbn   = typeof this.CTI_TRANS_CONFER.gbn == undefined || typeof this.CTI_TRANS_CONFER.gbn == "undefined" ? "" : this.CTI_TRANS_CONFER.gbn;
        transConferState = typeof this.CTI_TRANS_CONFER.state == undefined || typeof this.CTI_TRANS_CONFER.state == "undefined" ? "" : this.CTI_TRANS_CONFER.state;

        if (transConferGbn == "CONFERENCE") {

          if (transConferState == "answer") {

            // this.CTI_INFO.strEndDate  =  this.getSverData("YYYYMMDD", "");      // 통화종료년월일
            // this.CTI_INFO.strEndTime  =  this.getSverData("HH24MISS", "");      // 통화종료시분초

            this.CTI_DB_STATE       = "hangup";
            // this.CTI_INFO.strState  = this.CTI_DB_STATE;

            // this.btnClassRemove();
            // this.initCallCti(this.CTI_DB_STATE);

            // this.CTI_BRD.current = "후처리(상담)";
            // this.CTI_BRD.icon    = this.CTI_BTN[6].icon;                          //"cti-btn-answer";
            // this.CTI_BTN[6].cls = true;

          } else if (transConferState != "answer") {

            // this.hideDialog('M110101P05');                                      // 전화수신 모달

            // this.initCallCtiInof();				                                      // CTI_INFO, UEI_INFO 초기화
            // this.initCallCtiCall();				                                      // CIT CALL 정보 (수/발신 정보)

            // this.btnClassRemove();
            // this.ctiBtnEvent('handle');                                         // 후처리 이벤트
          }

        } else  if (transConferGbn == "TRANSFER") {                             // 호전환

          if (transConferState == "answer") {

            this.CTI_DB_STATE       = "hangup";
            // this.CTI_INFO.strState  = this.CTI_DB_STATE;

          } else if (transConferState != "answer") {

            // this.hideDialog('M110101P05');                                      // 전화수신 모달

            // this.initCallCtiInof();				                                      // CTI_INFO, UEI_INFO 초기화
            // this.initCallCtiCall();				                                      // CIT CALL 정보 (수/발신 정보)
          }

          // this.btnClassRemove();
          // this.ctiBtnEvent('handle');                                         // 후처리 이벤트
        }
      }

    });

      /**
      * 링 이벤트
      * message : RINGING|01071378458|07080151166|11|초진 문의 - 남성센터|
      */
    this.$eventBus.$on("busCtiRinging", (e) => {
      this.getCustDefaultInfo(e);
    });

      /**
      * 전화받기 이벤트
      */
    this.$eventBus.$on("busCtiAnswer", (e) => {
      this.ctiBtnControl('00|00|10|10|10|10|00'); //통화중

      let aryMsg      = [];
      let aryMsgLen   = 0;

      let msg_evt     = "";
      let phone       = "";
      let recKey      = "";

      let arrMsg = e.split("|");
      let evt = '';              // 이벤트 종류
      let custPhnNo = '';        // 고객 전화번호
      let recFileNm = '';        // 녹취파일명

      if(arrMsg.length == 3){    //상담원 전화받음
        evt = arrMsg[0];              // 이벤트 종류
        custPhnNo = arrMsg[1];        // 고객 전화번호
        recFileNm = arrMsg[2];        // 녹취파일명

        this.OUT_CALL_DATA.CL_TYPE_CD = evt === 'OUTBOUND'?'OUT':'IN';
        this.OUT_CALL_DATA.CUST_PHN_NO = this.mixin_setPhoneNo(custPhnNo);
        this.OUT_CALL_DATA.recFileNm = recFileNm;
        this.OUT_CALL_DATA.inNum = this.IN_CALL_DATA.inNum;
        this.OUT_CALL_DATA.CUST_ID = '';
        this.OUT_CALL_DATA.CUTT_RSVT_ID = '';
        this.OUT_CALL_DATA.PHN_CUTT_ID = '';
        this.OUT_CALL_DATA.CPI_ID = '';
        this.OUT_CALL_DATA.CLBK_ID = '';
        this.OUT_CALL_DATA.RSVT_ID = '';

        console.log('---------------전화받기--------------------');
        console.log('이전 상태 : ', this.PREV_CTI_STAT);
        console.log('---------------전화받기--------------------');

        this.PREV_CTI_STAT = evt;

        this.$eventBus.$emit("busCustInfoSrch", this.OUT_CALL_DATA);
      }

      //case "ANSWER" :                 // 전화수신 통화시작 message : ANSWER|01071378458|20220621/1001-20220621-172625-IB-01071378458-1655799985.313
      //case "OUTBOUND" :               // 전화수신 통화시작 message : OUTBOUND|01075838458|20220622/1001-20220622-185327-OB-01075838458-1655891607.844

      if (this.CTI_INFO.strTransSucess == "N" && this.CTI_INFO.strState == "phone_tran") {
      }else {

        if ((this.CTI_DB_STATE == "ringing" && this.CTI_INFO.strCallMode == "inbound") || this.CTI_INFO.strCallMode == "outbound") {

          let transConferGbn = "";
          let ctiDbState = "answer";

          if (e.length > 0) {

            this.CTI_IPCC_MESGE = e;                          // IPCC Softphone Message

            aryMsg      = e.split("|");
            aryMsgLen   = aryMsg.length;

            if (aryMsgLen > 0) {
              msg_evt = aryMsg[0];                            // 메시지 종류
              phone   = aryMsg[1];                            // 전화번호
              recKey  = aryMsg[2];                            // 녹취키

              if (this.CTI_INFO.strCallMode == "outbound") {
                this.CTI_INFO.strRecKey = recKey;
              } else if ((this.UEI_INFO.strInboundNum.trim() == phone.trim()) && (this.CTI_DB_STATE == "ringing" && this.CTI_INFO.strCallMode == "inbound")) {
                this.CTI_INFO.strRecKey = recKey;
              }
            }
          }

          this.CTI_DB_STATE      = ctiDbState;
          this.CTI_INFO.strState = this.CTI_DB_STATE;

          /** CTI 로그인 버튼 비활성화 */
          this.CTI_ANSWER_BOOLEAN = true;

          /** 콜상담저장_콜부분 */
          this.CNSL_CALL_TY  = this.CTI_INFO.strCallMode != "outbound" ? '01' : '02';

          /** 호전환, 3자 */
          transConferGbn = typeof this.CTI_TRANS_CONFER.gbn == undefined || typeof this.CTI_TRANS_CONFER.gbn == "undefined" ? "" : this.CTI_TRANS_CONFER.gbn;

          if (transConferGbn == "TRANSFER" || transConferGbn == "CONFERENCE") {
            this.CTI_TRANS_CONFER.state = ctiDbState;
          }
        }
      }
    });

      /**
      * 판빌전화기 연동
      */
    this.$eventBus.$on("busCtiInitCall", (evnt) => {

      if (evnt == "phone_call" || evnt == "phone_call2") {

      } else  if (evnt == "phone_mute" || evnt == "phone_hold") { //음소거, 보류

        let ctiBtnGbn = "";

        if (evnt == "phone_mute") { //음소거
          ctiBtnGbn = (this.CTI_DB_STATE == "mute") ? "answer" : "mute";
          this.CTI_MENU[4].text = (this.CTI_DB_STATE == "mute") ? "음소거" : "음소거해제";
        } else if (evnt == "phone_hold") { //보류
          ctiBtnGbn = (this.CTI_DB_STATE == "hold") ? "answer" : "hold";
          this.CTI_MENU[3].text = (this.CTI_DB_STATE == "hold") ? "보류" : "보류해제";
        }

        this.CTI_DB_STATE = ctiBtnGbn;

      } else if (evnt == "fanvil_phone_tran") {                        // 판빌 호전환 (판빌 -> 내부/외부)

        this.CTI_INFO.strTransSucess = "N";                             // 호전환 완료 여부
        this.CTI_INFO.strPreCtiState = this.CTI_INFO.strState;          // CTI 이전상태값

        console.log("#####phone_tran#################################################################");
        // console.log("this.CTI_INFO.strTransSucess : " + this.CTI_INFO.strTransSucess);
        // console.log("this.CTI_INFO.strState : " + this.CTI_INFO.strState);
        // console.log("this.CTI_INFO.strPreCtiState : " + this.CTI_INFO.strPreCtiState);
        // console.log("this.CTI_TRANSFER_INFO.inLineNo : " + this.CTI_TRANSFER_INFO.inLineNo);

        if (this.CTI_TRANSFER_INFO.inLineNo.length < 9) {
          this.CTI_INFO.strState = "fanvil_inner_phone_tran";          // 내부 -> 내부 호전환
        } else {
          this.CTI_INFO.strState = "fanvil_outer_phone_tran";          // 내부 -> 외부 호전환
        }

        // console.log("this.CTI_INFO.strState : " + this.CTI_INFO.strState);

        this.ctiPhoneTranBol(true);

      } else if (evnt == "fanvil_phone_trok") {

        this.CTI_INFO.strState = this.CTI_INFO.strPreCtiState; // CTI 이전상태값
        this.CTI_INFO.strPreCtiState = "";                        // CTI 이전상태값
        this.CTI_INFO.strTransSucess = "Y";

        console.log("#####phone_trok#################################################################");
        // console.log("this.CTI_INFO.strState : " + this.CTI_INFO.strState);
        // console.log("this.CTI_INFO.strPreCtiState : " + this.CTI_INFO.strPreCtiState);
        // console.log("this.CTI_INFO.strTransSucess : " + this.CTI_INFO.strTransSucess);

        // this.hideDialog("M110101P01");
      }
    });

      /**
      * 호전환 리스트
      * @param {} e
      */
    this.$eventBus.$on("busCtiTransferlst", (e) => {

      let transferInfo = {};

      transferInfo = {
        aspCustKey: this.CTI_INFO.strAspCustKey,      //"1040",
        transferLst : e
      };

      this.CTI_TRANSFER_INFO = transferInfo;

    });

      /**
      * 콜스킵기능_스킵/전환
      * @param {} e
      */
    this.$eventBus.$on("busCtiSkipTrans", (e) => {

      let rtnData;

      if (e.length > 0) {
        e = e.replace('[', '');
        e = e.replace(']', '');

        rtnData = JSON.parse(e);                                    // JSON 데이터 파싱

        if (rtnData.result == "true") {
          this.dialogInCall = false;
          this.mixin_hideDialog('dialogInCall'); //전화받기 모달 닫기
          this.ctiBtnControl('10|10|00|00|00|00|11'); //후처리
          this.IN_CALL_DATA.TRNS_NUM = '';
        } else {
          this.showAlert({alertDialogToggle: true, msg: "콜스킵기능_스킵/전환 오류 (" + rtnData.desc + ")", iconClass: 'is-info', type: 'default'});
        }
      }
    });

      /**
      * 호전환 취소 (phone_busy인 경우)
      * @param {} e
      */
    this.$eventBus.$on("busCtiPhoneBusy", (e) => {
      this.$socket.emit("sendmsg", "phone_hold", "");
    });

      /**
      * 호전환 취소 (phone_busy외 경우)
      * @param {} e
      */
    this.$eventBus.$on("busCtiPhoneNo", (e) => {
      this.$socket.emit("sendmsg", e, "");
    });

      /**
      * 호전환 상대방 거절
      * @param {} e
      */
    this.$eventBus.$on("busCtiTransBusy", () => {

      console.log("#####busCtiTransBusy########################################");
      // console.log("this.CTI_INFO.strTransSucess : " + this.CTI_INFO.strTransSucess);
      // console.log("this.CTI_INFO.strState : " + this.CTI_INFO.strState);
      // console.log("this.CTI_TRANSFER_INFO.inLineNo : " + this.CTI_TRANSFER_INFO.inLineNo);
      // console.log("this.CTI_TRANSFER_INFO.inLineNo.length : " + this.CTI_TRANSFER_INFO.inLineNo.length);

      //this.ctiHold();                                                             // this.$socket.emit("sendmsg", "phone_hold", "");

      if (this.CTI_INFO.strTransSucess == "N" && this.CTI_INFO.strState == "hangup" && this.CTI_TRANSFER_INFO.inLineNo.length > 8) { // 호전환 내부 -> 외부 (고객 종료 시)
      } else {
          setTimeout(() => {
          this.ctiChkFanvil('phone_trno');
        }, 1000);
      }

    });

      /**
      * 3자 상대방 거절
      * @param {} e
      */
    this.$eventBus.$on("busCtiConfBusy", () => {
      this.ctiTrnoCfno();
    });

      /**
      * 3자 시도 내부->내부 (상대방 상담사 통화 후 종료)
      * @param {} e
      */
    this.$eventBus.$on("busCtiConfHang", () => {

      setTimeout(() => {
        this.ctiPhoneCfno();
      }, 1000);

    });

      /**
      * 이벤트 호출
      * Stomp Disconnect
      */
    this.$eventBus.$on("busStompDisconnect", () => {
      this.disconnect();
    });

    //상담 Form 이벤트
    this.$eventBus.$on("busCuttEvt", (cuttEvt) => {
      if(cuttEvt.evt === 'CuttAfter'){ //후처리(상담) 상태 버튼 제어
        if(cuttEvt.CUST_ID > -1){ //후처리(상담)
          if(this.dialogOutCall){ //전화걸기 dialog가 떠 있는 경우(고객이 끊거나 상담원이 끊을 경우)

            this.$eventBus.$emit("dialogOutCallClose"); //전화받기 dialog 닫기

            this.ctiBtnControl('10|10|00|00|00|00|11'); //후처리
          }else{
            this.ctiBtnControl('10|10|00|00|00|00|11'); //후처리(상담)
          }
        }else{ //일정시간 상담원이 전화를 받지 않아 전화가 끊어진 상태
          this.ctiLogout(); // 로그아웃
          this.setStatTime('stat1'); //CTI OFF 타이머 시작
        }
      }else if(cuttEvt.evt === 'cuttSave'){ //상담 form 저장
        this.CUTT_CN_SAVE_ING = false;
        this.ctiBtnControl('10|10|00|00|00|00|11'); //후처리
      }else if(cuttEvt.evt === 'outBoundBtnConrol'){ //전화걸기 이벤트
        this.CUTT_CN_SAVE_ING = false;
        this.ctiBtnControl('00|00|10|00|00|00|00'); //전화끊기 버튼만 활성화
      }else if(cuttEvt.evt === 'cuttForceSave'){ // 상담 강제생성 저장
        this.CUTT_CN_SAVE_ING = false;
        //this.ctiBtnControl('00|00|00|00|00|00|00'); //CTI 비활성화
        if(this.CTI_STAT){ //CTI On상태인 경우
          if(this.CALLSTAT[this.SELECTED_CALLSTAT].type === '대기'){
            this.ctiBtnControl('11|00|00|00|00|00|10'); //대기
          }else{
            this.ctiBtnControl('10|10|00|00|00|00|11'); //후처리
          }
        }else{ //CTI Off상태인 경우
          this.ctiBtnControl('00|00|00|00|00|00|00'); //CTI 비활성화
        }
      }
    });
      /****************************************************************************************************************************************************
      * EventBus created START
      ****************************************************************************************************************************************************
      ***************************************************************************************************************************************************/
  },

  methods: {
    //mark: 시연: methods 종합복지마스터조회
    setDemoVal(){
      this.demoVal = !this.demoVal;
    },
    activeItem(item){
      this.disableActiveItem();
      item.active = true;
    },
    disableActiveItem() {
      const array = this.CERT_CUSTCO_LIST;
      for (let index = 0; index < array.length; index++) {
        array[index].active = false;
      }
    },

    //고객사별 이석 유형 가져오기
    async getSeatMoveTp() {
      let SEAT_MOVE_TP = await this.mixin_common_code_get(this.COMM_CD_DROP_LIST, 'SEAT_MOVE_TP');

      if(SEAT_MOVE_TP.length > 0){
        this.MOVE_LIST = [];
        this.CALLSTAT = {
          stat1: { type: 'CTI OFF', icon: 'stat-off'},
          stat2: { type: 'CTI ON', icon: 'stat-on'},
          stat3: { type: '후처리', icon: 'stat-after'},
          stat4: { type: '대기', icon: 'stat-wait'},
          stat5: { type: '통화중', icon: 'stat-call'},
        }

        SEAT_MOVE_TP.forEach((reason, idx) => {
          reason.evt = 'db_state';
          reason.active = false;
          reason.event = ''+(idx+3);
          reason.icon = reason.cd_vl; //공통코드 값에 아이콘 class 값 입력

          this.MOVE_LIST.push(reason);
          const obj = {type : reason.text, icon : reason.icon};
          this.CALLSTAT["stat"+(idx+6)] = obj;
        });

      }

    },

    //전화걸기(사용안함)
    outCall(){
      this.$socket.emit("sendmsg", "phone_call", this.OUT_CALL_DATA.give_number);
    },

    //전화받기
    inCall(){
      this.dialogInCall = false;
      this.mixin_hideDialog('dialogInCall'); //전화받기 모달 닫기
      this.$socket.emit("sendmsg", "phone_acce");
      this.ctiBtnControl('00|00|10|10|10|10|00'); //통화중
    },

    //상태별 시간 카운트
    setStatTime(stat) {
      let setSeconds = 0;
      this.SELECTED_CALLSTAT = stat;
      //초기화
      for(let key in this.CALLSTAT){
        this.CALLSTAT[key].time = '00:00:00';
      }
      this.ctiCallTimerEnd();

      this.CTI_CALL_TIMER = setInterval(() => {
        this.CUSL_STAT_TIME = this.mixin_seconds_toHHMMSS(setSeconds++);
      }, 1000);

      console.log('CALLSTAT[SELECTED_CALLSTAT].type : ', this.CALLSTAT[this.SELECTED_CALLSTAT].type)

      eventBus.setCuslStat('setCuslStat', this.CALLSTAT[this.SELECTED_CALLSTAT].type);
    },

    //타이머 종료
    ctiCallTimerEnd() {
      clearInterval(this.CTI_CALL_TIMER);
    },

    //이석 버튼 드롭다운
    ctiMove(){
      this.btnClassRemove();
      this.dropCtiMove = !this.dropCtiMove;
    },

    //이석 드롭다운 닫기
    closeDropCtiMove(){
      this.dropCtiMove = false;
    },
    //고객찾기 닫기
    closeDropSearch(){
      this.TOP_UTIL.toggleSearch = false
    },

    // 이석 선택
    selectMoveList(item) {
      this.SELECTED_MOVE = item;
      this.ctiBtnEvt(item);
    },

    //CTI 버튼 비활성화
    btnClassRemove() {
      const menuList = ['CTI_MENU',];

      for (let i = 0; i < menuList.length; i++) {
        const _menu = menuList[i];
        for (let j = 0; j < this[_menu].length; j++) {
          this[_menu][j].active = false;
        }
      }
    },

    // 상단 버튼 이벤트
    ctiBtnEvt(item){
      this.btnClassRemove();
      item.active  = !item.active;

      if(item.evt == 'db_state' //대기, 후처리
        || item.evt == "phone_hang" //끊기
        || item.evt == "phone_hold" //보류
        || item.evt == "phone_mute" //음소거
      ){
        if(item.event != '0'){
          this.$socket.emit('sendmsg', item.evt, item.event);
        } else {
          this.$socket.emit('sendmsg', item.evt, '');
        }
      } else if(item.evt == "dialogOutCall" || item.evt == "dialogCallTrans"){ //걸기, 호전환
        this.mixin_set_active_tab({PATH_NM:'/CSL_M0100', NODE_TITLE:'전화상담'});

        this.OUT_CALL_DATA.CUST_PHN_NO = ''; //고객 전화번호 초기화
        this.OUT_CALL_DATA.CUTT_RSVT_ID = ''; //예약콜 ID 초기화
        this.OUT_CALL_DATA.PHN_CUTT_ID = ''; //예약콜 ID 초기화
        this.OUT_CALL_DATA.CPI_ID = ''; //캠페인 ID 초기화
        this.OUT_CALL_DATA.CLBK_ID = ''; //콜백 ID 초기화
        this.OUT_CALL_DATA.RSVT_ID = ''; //예약 ID 초기화
        this.OUT_CALL_DATA.recFileNm = ''; //녹취 파일 초기화
        this.OUT_CALL_DATA.desc = ''; //설명 초기화
        this.OUT_CALL_DATA.CL_TYPE_CD = 'OUT'; //아웃바운드


        if(item.evt == "dialogOutCall"){
          this.$eventBus.$emit('dialogOutCall', this.OUT_CALL_DATA); //top 전화걸기 호출
        }else if(item.evt == "dialogCallTrans"){
          this[item.evt] = true;
          this.$eventBus.$emit("phoneTransInit");
        }
      }
    },

    //CTI 버튼 컨트롤
    ctiBtnControl(btnStats) {
      // if(this.$store.getters["userConfigStore/GE_CTI_BTN_STAT"] !== btnStats){
      //   this.$store.dispatch("userConfigStore/AC_CTI_BTN_STAT", btnStats);
      // }

      const arrStat = btnStats.split('|');
      let btnStat = '';
      let btnAtiveStat = '';
      arrStat.forEach((stat, idx) => {
        this.CTI_MENU.forEach((item, seq) => {
          if(idx === seq){
            btnStat += stat.split('')[0];
            btnAtiveStat += stat.split('')[1];
            if(stat.split('')[0] === '0'){
              item.active = false;
              item.disabled = true;
            }else{
              item.active = stat.split('')[1] === '0'?false:true;
              item.disabled = false;
            }
          }
        });
      });

      console.log('btnStat : ' + btnStat + ', btnAtiveStat : ' + btnAtiveStat);

      if(btnStat === '0000000' //CTI 로그아웃
        || btnStat === '1000001' //대기
        || btnStat === '0011110' //통화중
        || btnStat === '0010000' //RINGING
      ){
        this.CUSL_BTN_STYLE = 'pointer-events: none;opacity: 0.4;'; //이석 버튼 disabled
        if(btnAtiveStat === '1000000'){ //대기
          this.$store.commit("statusStore/MU_CUTT_ING", false); //상담 진행중을 false로 store 저장 처리
          this.setStatTime('stat4'); //대기상태 타이머 시작
        }else if(btnStat === '0011110'){ //통화중
          this.setStatTime('stat5'); //통화중 타이머 시작
        }else if(btnStat === '0000000'){ //CTI 로그아웃
          this.$store.commit("statusStore/MU_CUTT_ING", false); //상담 진행중을 false로 store 저장 처리
        }
      }else if(btnAtiveStat === '0000001'){ //후처리
        if(!this.CUTT_CN_SAVE_ING){ //후처리(상담) 이 아닌 경우
          this.CUSL_BTN_STYLE = ''; //이석 버튼 활성화
          this.cuslStateControl('0000'); //이석 상태 초기화
        }else{//후처리(상담)
          this.CUSL_BTN_STYLE = 'pointer-events: none;opacity: 0.4;'; //이석 버튼 disabled
          this.setStatTime('stat3'); //후처리 타이머 시작
        }
      }else{
        this.CUSL_BTN_STYLE = ''; //이석 버튼 활성화
      }

    },
    //상담원 이석 컨트롤
    cuslStateControl(cuslStats) {
      let stat = '';
      // switch (cuslStats.indexOf('1')) {
      //   case 0 : stat = 'stat6'; //휴식
      //     break;
      //   case 1 : stat = 'stat7'; //교육
      //     break;
      //   case 2 : stat = 'stat8'; //식사
      //     break;
      //   case 3 : stat = 'stat9'; //기타
      //     break;
      // }

      let MOVE_LIST = this.MOVE_LIST;
      Object.keys(MOVE_LIST).some(function(v){
        if(MOVE_LIST[v].event === cuslStats){
          return stat = 'stat'+(Number(MOVE_LIST[v].event)+3);
        }
      });

      if(stat){ //이석 상태가 있는 경우
        this.ctiBtnControl('00|00|00|00|00|00|10');
        this.setStatTime(stat); //상담원 이석 상태별 타이머 시작
      }else{ //이석 상태가 없는 경우
        this.CUSL_BTN_STYLE = ''; //이석 버튼 활성화
        this.SELECTED_MOVE = {text: '이석', icon: 'stat-init'};
        this.setStatTime('stat3'); //후처리 타이머 시작
      }

      const arrCuslStat = cuslStats.split('');
      arrCuslStat.forEach((stat, idx) => {
        this.MOVE_LIST.forEach((item, seq) => {
          if(idx === seq){
            if(stat === '1'){
              this.SELECTED_MOVE.icon = item.icon;
              this.SELECTED_MOVE.text = item.text;
            }
          }
        });
      });

      this.$store.commit("statusStore/MU_CUTT_ING", false); //상담 진행중을 false로 store 저장 처리
    },

    //상단 CTI on off 이벤트
    ctiConnectEvent(ctiGb) {
      if(!this.$store.getters["statusStore/GE_CUTT_ING"]){//상담중이 아닐때
        this.IN_NUM = this.$store.getters["userStore/GE_USER_ROLE"].EXT_NO;

        if(this.IN_NUM){
          if(ctiGb === 'CALL'){
            if(this.CTI_STAT == true){
              if (this.IN_NUM != "" && this.IN_NUM.length > 3) {
                // if (this.ip_addr != "" && this.ip_addr != undefined) {
                  if(this.$socket){
                    this.$socket.disconnect();
                  }
                  this.ctiIpccConnect(this.IN_NUM, this.ip_addr, ctiGb);     // IPCC Connect_내선번호, 상담사 로그인 IP
                  this.ctiConnect(this.IN_NUM, this.ip_addr, ctiGb)
                  this.ctiLogin();
                  this.CUSL_BTN_STYLE = '';
                // }
              }
            } else if(this.CTI_STAT == false){
              this.ctiLogout(); // 로그아웃
              this.setStatTime('stat1'); //CTI OFF 타이머 시작

              this.$store.commit("statusStore/MU_CUTT_ING", false); //상담 진행중을 false로 store 저장 처리
            }
          }else if(ctiGb === 'PDS'){
          }
        }else{
          this.CTI_STAT = false;
          this.showAlert(this.MESSAGE.ALERT.EXT_NO_EMPTY);
        }

        //CTI 로그 ON,OFF시 전화상담 메인에 상태값 전달용
        eventBus.setCtiBtnStat('setCtiBtnStat', this.CTI_STAT);
      } else {
        this.showAlert({alertDialogToggle: true, msg: '상담을 진행중입니다. 그래도 CTI로그아웃을 하시겠습니까?', iconClass: 'is-caution', type: 'confirm', callYes: this.forcCtiLogout, callNo: this.forcCtiLogoutCancle});
      }
    },

    /**
     * CTI 로그인
     */
    ctiLogin() {
      let mobYn = this.$store.getters['userStore/GE_MOBILE_YN'];
      this.$socket.emit("sendmsg", "db_login", (mobYn == 'Y' ? "1" : ""));
    },

    /**
     * CTI 로그아웃
     */
    ctiLogout() {
      this.CTI_STAT = false; //CTI SWICH
      this.$socket.emit("sendmsg", "db_logout", "");
      // this.$socket.disconnect();
    },

    /**
     * 상담중 강제 CTI 로그아웃
     */
    forcCtiLogout() {
      this.closeMsg();
      this.CUTT_CN_SAVE_ING = false; //상담 form 내용 저장중 아님
      this.CTI_STAT = false; //CTI SWICH
      this.$socket.emit("sendmsg", "db_logout", "");
      // this.$socket.disconnect();
    },

    //상담중 로그아웃 클릭 후 취소
    forcCtiLogoutCancle(){
      this.closeMsg();
      this.CTI_STAT = true; //CTI SWICH
    },

    /**
     * 거부
     */
    ctiSkip() {
      let rtnData;
      let ctiSkipUrl = this.SKIP_URL + "/api/db_skip_deny.php?ext=" + this.IN_NUM + "&telno=" + this.IN_CALL_DATA.CUST_PHN_NO;

      const orgEventbus = this.$eventBus;

      $.ajax({
        url: ctiSkipUrl,
        dataType: "html",
        type: "GET",
        contentType: "application/json",
        crossDomain: true,
        success: function(data) {
          orgEventbus.busCtiSkipTrans(data);                               // 콜스킵기능_스킵/전환
        }, error:function(request, status, error){
          console.log("code:" + request.status + "\n"+"message:" + request.responseText + "\n" + "error:" + error);
        }
      });
    },

    /**
    * 링상태_전환
    */
    ctiTransfer() {

      let rtnData;
      let ctiTransUrl = this.TRANS_URL + "/api/db_skip_trans.php?ext=" + this.IN_NUM + "&telno=" + this.IN_CALL_DATA.CUST_PHN_NO + "&ext2=" + this.IN_CALL_DATA.TRNS_NUM;

      const orgEventbus = this.$eventBus;

      $.ajax({
        url: ctiTransUrl,
        dataType: "html",
        type: "GET",
        contentType: "application/json",
        crossDomain: true,
        success: function(data) {
          orgEventbus.busCtiSkipTrans(data);                               // 콜스킵기능_스킵/전환
        }, error:function(request, status, error){
          console.log("code:" + request.status + "\n"+"message:" + request.responseText + "\n" + "error:" + error);
        }
      });
    },

    /**
     * IPCC Socket 연결
     */
    ctiIpccConnect(inlneNo, ipAddr, pds) {
      // console.log('this.IPCC_SOCKET_URL : ', this.IPCC_SOCKET_URL);
      /** 소프트폰 중계 소켓 생성 */
      const socket = io.connect(this.IPCC_SOCKET_URL, {
        secure: this.SECURE_MODE,                                     // SSL option
        pingInterval: this.PING_INTERVAL,
        pingTimeout: this.PING_TIMEOUT,
      });

      Vue.prototype.$socket = socket;

      /** 중복로그인 알림 - 로그아웃 처리 */
      socket.on('sameUserAlert',function(userid, userip){
        try {
            /** 소켓 닫는다 */
            if(socket) socket.disconnect();
            //alert수정필요
            // alert('동일한 사용자아이디로 접속하여\n연결이 종료 되었습니다.(중복 로그인 불가) \n\n 접속자아이피 : ' + userip + ', 사용자아이디 : ' + userid);
            alert('해당 사용자 계정에 사용중인 내선번호('+userid+')가\n중복 등록되어 있습니다.\n관리자에게 문의해 주시기바랍니다.');
        }catch(e){
          //
        }
      });

      const orgEventbus = this.$eventBus;

      /** API 명령어 결과 수신 */
      socket.on('recvmsg', function(username, data) {

        console.log('#####recvmsg############################################');
        console.log('recvmsg => user : ' + username + ', data : ' + data);

        let rtnData;

        let rtnResult   = "";                                         // 이벤트 처리 결과
        let rtnDesc     = "";                                         // 이벤트 구분
        let rtnDbState  = "";                                         // CTI 상세 이벤트_1:대기, 2:후처리, 3:휴식, 4:교육, 5:식사, 6:기타

        if (inlneNo == username && !data.includes("ERROR")) {

          data = data.replace('[', '');
          data = data.replace(']', '');

          rtnData = JSON.parse(data);                                  // JSON 데이터 파싱

          rtnResult = rtnData.result;
          rtnDesc = rtnData.desc;
          orgEventbus.busInitCallCti(rtnData);
        }
      });

      socket.on("softphone", function (msg) {

        console.log('#####softphone message############################################');
        console.log("message : " + msg);

        if (msg) {

          /* 구현부 */
          let arrMsg    = msg.split("|");
          let evt   = arrMsg[0];                                    // 메시지 종류
          let agent   = arrMsg[1];                                    // 메시지 종류

          switch (evt) {

            case "RINGING" :                 //전화벨 message : RINGING|01071378458|07080151166|11|초진 문의 - 남성센터|
            case "TRANSFER" :
            case "CONFERENCE" :
              orgEventbus.busCtiRinging(msg);
              break;

            case "ANSWER" :                 // 전화수신 통화시작 message : ANSWER|01071378458|20220621/1001-20220621-172625-IB-01071378458-1655799985.313
            case "OUTBOUND" :               // 전화수신 통화시작 message : OUTBOUND|01075838458|20220622/1001-20220622-185327-OB-01075838458-1655891607.844
              orgEventbus.busCtiAnswer(msg);
              orgEventbus.$emit("dialogOutCallClose"); //전화받기 dialog 닫기
              break;

            case "HANGUP" :                 // 통화종료 message : HANGUP
            case "HANGINT" :

              if (agent == "AGENT") {
                orgEventbus.busCtiHangAgent();
              } else {
                orgEventbus.busCtiHangup(msg);
              }

              break;

            case "TRANSBUSY" :              // 호전환 내부->내부 (상대방 거절)
              orgEventbus.busCtiTransBusy();
              break;

            case "CONFBUSY" :               // 3자 내부->내부 (상대방 거절)
              orgEventbus.busCtiConfBusy();
              break;
            case "CONFHANG" :               // 3자 시도 내부->내부 (상대방 상담사 통화 후 종료)
              orgEventbus.busCtiConfHang();
              break;
          }
          // ###############################################################################

        }
      });
    },

    /**
     * 노드서버 접속
     */
      ctiConnect(inlneNo,ipAddr){
      this.$socket.emit("guestjoin", "cloudnode", inlneNo, ipAddr);
    },

    /**
     * 웹소켓 연결종료
     * Stomp / Socket-Io
     */
     disconnect() {
      /** IPCC Socket 로그아웃 */
      if (this.CTI_LOGIN_BOOLEAN == true) {
        this.ctiLogout(); // 로그아웃
        //this.$socket.disconnect();
      }
    },

    /**
     * 음소거, 콜보류 이벤트 처리
     */
    ctiMuteHold(e) {
      this.$eventBus.busCtiInitCall(e);
    },

    /**
     * 판빌전화기 상태 체크
     */
    ctiChkFanvil(e) {

      let chkFanvilUrl = this.FANVIL_URL + "/api/db_select.php?mode=chk_trans&ext=" + this.IN_NUM;

      console.log("#####ctiPhoneTrno##############################################");
      // console.log("chkFanvilUrl : " + chkFanvilUrl);
      // console.log("this.IN_NUM : " + this.IN_NUM);

      const orgEventbus = this.$eventBus;

      $.ajax({
        url: chkFanvilUrl,
        dataType: "json",
        type: "GET",
        contentType: "application/json",
        crossDomain: true,
        success: function(data) {

          //console.log(data);
          //console.log("chk_fanvil : " + data[0].cmd_tr);

          if(data[0].cmd_tr == 'phone_busy') {
            orgEventbus.busCtiPhoneBusy('phone_hold');                                 // 호전환/3자 취소 socket.emit('sendmsg', 'phone_hold', '');
          } else if(data[0].cmd_tr=='conf_busy') {
          } else {
            orgEventbus.busCtiPhoneNo(e);                                              // 호전환/3자 취소 //socket.emit('sendmsg', e, '');
          }
        },
        error:function(request,status,error){
          alert("에러 : " + error);
        }
      });

    },

    /**
    * 호전환시도
    */
    ctiPhoneTran() {
      let inLineNoLen = 0;

      inLineNoLen = typeof this.TRANSFER_DATA.TRAN_INLNE_NO == undefined || typeof this.TRANSFER_DATA.TRAN_INLNE_NO == "undefined" ? inLineNoLen : this.TRANSFER_DATA.TRAN_INLNE_NO.length;

      if (inLineNoLen == 4 || inLineNoLen > 7) {
        this.$socket.emit('sendmsg', 'phone_tran', this.TRANSFER_DATA.TRAN_INLNE_NO);
      }
    },

    /**
    * 호전환 시도 / 취소
    */
    ctiPhoneTranBol(e) {
      this.$eventBus.busCtiPhoneTran(e);
    },

    /**
    * 호전환 취소
    */
    ctiPhoneTrno() {
      this.ctiChkFanvil('phone_trno');
    },

    /**
    * 호전환 완료
    */
    ctiPhoneTrok() {
      this.$socket.emit('sendmsg', 'phone_trok', '');
    },

    /**
    * 3자 시도
    */
    ctiPhoneConf() {

      let inLineNoLen = 0;

      inLineNoLen = typeof this.TRANSFER_DATA.CONF_INLNE_NO == undefined || typeof this.TRANSFER_DATA.CONF_INLNE_NO == "undefined" ? inLineNoLen : this.TRANSFER_DATA.CONF_INLNE_NO.length;

      if (inLineNoLen == 4  || inLineNoLen > 7) {
        this.$socket.emit('sendmsg', 'phone_conf', this.TRANSFER_DATA.CONF_INLNE_NO);
      }

    },

    /**
    * 3자 시도 / 취소
    */
    ctiPhoneConfBol(e) {
      this.$eventBus.busCtiPhoneConf(e);
    },

    /**
    * 3자 취소
    */
    ctiPhoneCfno() {
      this.ctiChkFanvil('phone_cfno');
    },

    /**
    * 3자 완료
    */
    ctiPhoneCfok() {
      this.$socket.emit('sendmsg', 'phone_cfok', '');
    },

    /**
    * 호전환 시도, 3자 시도
    */
    ctiTranCftel(e) {

      this.CTI_INFO.strTransSucess = "N";                                 // 호전환 완료 여부
      this.CTI_INFO.strPreCtiState = this.CTI_INFO.strState;              // CTI 이전상태값

      this.CTI_INFO.strState = e;                                         // 내부 -> 내부/외부 호전환 phone_tran, 내부 -> 내부  3자 phone_conf, phone_cftel

      if (e == "phone_tran") {                                            // 호전환 시도
        this.ctiPhoneTranBol(true);
      } else if (e == "phone_cftel") {                                    // 3자 시도

        this.CTI_INFO.strConference       = "Y";                          // 3자 여부
        this.CTI_INFO.strConferenceCancle = "";                           // 3자 고객 종료 여부

        this.ctiPhoneConfBol(true);
      }
    },

    /**
    * 호전환 취소, 3자 취소
    */
    ctiTrnoCfno() {

      if (this.CTI_INFO.strState == "phone_tran") {
        this.ctiPhoneTranBol(false);                                      // 호전환창 버튼 재 배열
      } else if (this.CTI_INFO.strState == "phone_cftel") {
        this.CTI_INFO.strConference = "";                                 // 3자 여부
        this.ctiPhoneConfBol(false);                                      // 3자 버튼 재 배열
      }

      this.CTI_INFO.strTransSucess = "";                                  // 호전환 완료 여부 초기화
      this.CTI_INFO.strState      = this.CTI_INFO.strPreCtiState;         // CTI 이전상태값
      this.CTI_INFO.strPreCtiState = "";                                  // CTI 이전상태값 초기화

      console.log("#####phone_hold(setCtiTrnoCfno)#################################################################");
      // console.log("this.CTI_INFO.strTransSucess : " + this.CTI_INFO.strTransSucess);
      // console.log("this.CTI_INFO.strState : " + this.CTI_INFO.strState);
      // console.log("this.CTI_INFO.strPreCtiState : " + this.CTI_INFO.strPreCtiState);

    },

    /**
    * 호전환 완료, 3자 완료
    */
    ctiTrokCfok(e) {

      this.CTI_INFO.strState      = this.CTI_INFO.strPreCtiState;         // CTI 이전상태값
      this.CTI_INFO.strPreCtiState = "";                                  // CTI 이전상태값
      this.CTI_INFO.strTransSucess = "Y";

      console.log("#####setCtiTrokCfok#################################################################");
      console.log("e : " + e);
      // console.log("this.CTI_INFO.strState : " + this.CTI_INFO.strState);
      // console.log("this.CTI_INFO.strPreCtiState : " + this.CTI_INFO.strPreCtiState);
      // console.log("this.CTI_INFO.strTransSucess : " + this.CTI_INFO.strTransSucess);

      this.mixin_hideDialog('CallTrans');

      if (e === 'phone_cfok' // 3자 완료
        || e === 'phone_trok' // 2자 호전환 완료
        ) {
        // console.log('phone_cfok 상담 메인 eventbus 호출');
        this.$eventBus.$emit("cuttReSet"); //호전환 완료 후 상담 메인 초기화
        // console.log('phone_cfok 상담 메인 eventbus 호출 끝');
      }
    },

    //상단 우측 고객 찾기를 통해 고객 선택시 전화 상담 이동 및 고객 정보 셋팅
    findData() {
      let tabs = this.$store.getters["commonStore/GE_COMMON_TAB"];
      if(tabs.length > 0){
        let iCnt = 0;
        for(let tab of tabs){
          if(tab.id === 'CSL_M0100') { //전화상담
            this.mixin_set_active_tab({PATH_NM:'/CSL_M0100', NODE_TITLE:'전화상담'});
            this.$eventBus.$emit("busCustInfoSrch", this.SRCH_CUST);
            iCnt++;
          }
        }

        //전화상담 탭이 active 상태가 아닌 경우 처리
        if(iCnt === 0){
          this.mixin_set_active_tab({PATH_NM:'/CSL_M0100', NODE_TITLE:'전화상담', AUTO_CARRY_OUT : this.SRCH_CUST});
        }
      }
    },

    //고객 기본정보 조회(전화 받기)
    async getCustDefaultInfo(e) {

      //콜 데이터 초기화
      // const OUT_CALL_DATA = this.OUT_CALL_DATA;
      // Object.keys(OUT_CALL_DATA).forEach(function(key) {
      //   OUT_CALL_DATA[key] = '';
      // });
      // this.OUT_CALL_DATA = OUT_CALL_DATA;

      // this.OUT_CALL_DATA.CUTT_RSVT_ID = ''; //예약콜 ID 초기화
      // this.OUT_CALL_DATA.PHN_CUTT_ID = ''; //예약콜 ID 초기화
      // this.OUT_CALL_DATA.CPI_ID = ''; //캠페인 ID 초기화
      // this.OUT_CALL_DATA.CLBK_ID = ''; //콜백 ID 초기화
      // this.OUT_CALL_DATA.CUST_ID = -1; //고객 ID 초기화
      // this.OUT_CALL_DATA.recFileNm = ''; //녹취 파일 초기화
      // this.OUT_CALL_DATA.desc = ''; //설명 초기화

      /* 구현부 */
      let arrMsg = e.split("|");
      let evt = '';              // 이벤트 종류
      let custPhnNo = '';        // 고객 전화번호
      let inNum = '';            // 수신 전화번호(고객->상담사)
      let ivrNum = '';           // ivr선택번호
      let ivrNm = '';            // ivr명
      let custLvl = '';            // 고객 등급
      let recFileNm = '';        // 녹취파일명
      let agent = '';
      if(arrMsg.length == 1){           //전화 끊기 이벤트
        evt = arrMsg[0];               // 이벤트 종류
      } else if(arrMsg.length == 2){    //상담원 통화종료
          evt = arrMsg[0];              // 이벤트 종류
          agent = arrMsg[1];            // 이벤트 종류
      } else if(arrMsg.length == 3){    //상담원 전화받음
          evt = arrMsg[0];              // 이벤트 종류
          custPhnNo = arrMsg[1];        // 고객 전화번호
          recFileNm = arrMsg[2];        // 녹취파일명
      } else {
        evt = arrMsg[0];                // 이벤트 종류
        custPhnNo = arrMsg[1];          // 고객 전화번호
        inNum = arrMsg[2];              // 수신 전화번호(고객->상담사)
        ivrNum = arrMsg[3];             // ivr선택번호
        if(arrMsg.length > 3) ivrNm = arrMsg[4];              // ivr명
        if(arrMsg.length > 4) custLvl = arrMsg[5];          // 고객 등급
        if(arrMsg.length > 5) recFileNm = arrMsg[6];          // 녹취파일명
      }

      let sUrl = '/api/setting/customer/custDefaultInfo';
      let postParam = {
        CHNL : 'TEL'
        , CUST_PHN_NO : custPhnNo.replace(/[^0-9]/g, "")
        , TESTPARAM : 'TOP'
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.IN_CALL_DATA = {company: '', CUST_PHN_NO: this.mixin_setPhoneNo(custPhnNo), inNum: inNum, desc: ivrNm, CL_TYPE_CD : 'IN', recFileNm: recFileNm};
        this.CUST_INFO = (response.DATA.length > 0 ? response.DATA[0] : {CAUTION_CUST_YN : 'N'});
        this.CUST_PHN_NO = this.mixin_setPhoneNo(custPhnNo);

        // let compalyList = this.$store.getters["userStore/GE_USER_COMPANY_LIST"];
        // for(let item of compalyList){
        //   if(item.DSPTCH_NO){
        //     if(item.DSPTCH_NO.indexOf(inNum) > -1){
        //       this.IN_CALL_DATA.company = item.CD_NM;
        //       break
        //     }
        //   }
        // }
        let dsptchNoList = this.$store.getters['userStore/GE_USER_COMPANY'].DSPTCH_NO;
        let scrnIndctNmList = this.$store.getters['userStore/GE_USER_COMPANY'].SCRN_INDCT_NM;
        let arrNum = 0;
        if(dsptchNoList){
          for(let i=0; i <dsptchNoList.split(',').length; i++){
            if(dsptchNoList.split(',')[i].replace(/[^0-9]/g, '') === inNum.replace(/[^0-9]/g, '')){
              arrNum = i;
              break;
            }
          }
        }

        if(scrnIndctNmList){
          if(scrnIndctNmList.split(',').length > 1){
            if(scrnIndctNmList.split(',')[arrNum]){
              this.IN_CALL_DATA.company = scrnIndctNmList.split(',')[arrNum];
            }else{
              this.IN_CALL_DATA.company = this.$store.getters['userStore/GE_USER_COMPANY'].CD_NM;
            }
          }else{
            if(scrnIndctNmList.split(',')[arrNum]){
              this.IN_CALL_DATA.company = scrnIndctNmList.split(',')[arrNum];
            }else{
              this.IN_CALL_DATA.company = this.$store.getters['userStore/GE_USER_COMPANY'].CD_NM;
            }
          }
        }else{
          this.IN_CALL_DATA.company = this.$store.getters['userStore/GE_USER_COMPANY'].CD_NM;
        }

        this.ctiBtnControl('00|00|10|00|00|00|00'); //끊기 버튼만 활성화
        this.mixin_set_active_tab({PATH_NM:'/CSL_M0100', NODE_TITLE:'전화상담'});
        this.dialogInCall = true;
        this.mixin_showDialog('dialogInCall'); //전화받기 모달 열기
        this.$store.commit("statusStore/MU_CUTT_ING", true); //상담 진행중을 true로 store 저장 처리

        this.PREV_CTI_STAT = evt;

        this.OUT_CALL_DATA.CUST_ID = this.CUST_INFO.CUST_ID; //고객 ID 초기화

        if (evt != "RINGING") {
          this.CTI_TRANS_CONFER.gbn = evt;
        }

        eventBus.setCtiBtnStat('setCtiBtnStat', this.CTI_STAT);
      }
    },

    // 알림버튼 클릭 이벤트
    alarmBtn(){

      // 활성화 되있는 게시유형으로 조회
      let type;
      for(let i=0; i<this.SORT_ITEMS.length; i++){
        // console.log("this.SORT_ITEMS",this.SORT_ITEMS)
        if(this.SORT_ITEMS[i].selected === true) type = this.SORT_ITEMS[i].type;
      }

      // 게시유형 '전체'만 활성화
      // for(let i=0; i<this.SORT_ITEMS.length; i++){
      //   this.SORT_ITEMS[i].selected = false;
      // };
      // this.SORT_ITEMS[0].selected = true;

      // 게시글 조회
      this.alGetBrdList(type);

      // 최신 받은 쪽지 조회
      this.alGetNewMsg();

      this.mixin_showDialog('Alarm');
    },

    //*************************************
    //        쪽지
    //*************************************
    //validate check
    detailValidate () {
      if(this.NOTE_SORT === 'post'){
        return this.$refs.form1.validate();
      }else{
        return this.$refs.form2.validate();
      }
    },

    // 쪽지 보내기 및 회신
    async sendMessage(item){

      // 쪽지보내기
      if(item==='post'){
        this.NOTE_SORT = 'post';
      }

      if (!this.detailValidate()) {
        return;
      }

      let URLData = '/api/message/sendMsg';

      let headParam = {
        head : {
          SERVICE: 'message.sendMsg'
          , METHOD: 'insert'
          , HEADER_TYPE: 'BIZ_SERVICE'
        }
      }
      if(this.NOTE_SORT === 'post'){ // 쪽지보내기

        if(this.POST_MEMO_HEADER_ITEMS2.length === 0){
          this.showAlert(this.MESSAGE.ALERT.NONE);
        }

        for(let i=0; i<this.POST_MEMO_HEADER_ITEMS2.length; i++){

          let postParam = {
            RCPTN_USER_ID: this.POST_MEMO_HEADER_ITEMS2[i].USER_ID,                                                                    // 상대방ID
            MSG_GROUP_ID: this.POST_MEMO_HEADER_ITEMS2[i].MSG_GROUP_ID === null ? '' : this.POST_MEMO_HEADER_ITEMS2[i].MSG_GROUP_ID,  // 쪽지그룹ID
            MSG_CN: this.NOTE_CONTENTS,                                                                  // 쪽지내용
            INQ_YN : 'N',
          }

          let response = await this.common_postCall(URLData, postParam, headParam);

          if(!response.HEADER.ERROR_FLAG) {
            this.NOTE_GIVE_LIST = response.DATA;
            this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS);
          }
        }
        this.NOTE_CONTENTS = '';

      }else if(this.NOTE_SORT === 'give'){ // 쪽지 회신

        let postParam = {
          UP_MSG_ID: item.msgId,              // 상위쪽지ID
          RCPTN_USER_ID: item.otherUserId,    // 수신자ID
          MSG_GROUP_ID: item.msgGroupId,      // 쪽지그룹ID
          MSG_CN: this.NOTE_REPLY_CONTENTS,   // 쪽지내용
        }

        let response = await this.common_postCall(URLData, postParam, headParam);

        if(!response.HEADER.ERROR_FLAG) {
          this.NOTE_GIVE_LIST = response.DATA;
          this.readMsg(item.msgId);
          this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS);
          this.alGetMsgList();
        }
      }
    },


    // 쪽지조회(받은쪽지,보낸쪽지,회신쪽지)
    async alGetMsgList(item){
      this.initList();
      if(item === "give"){
        this.NOTE_SORT = 'give'
      }
      let URLData = '/api/message/selectMsgList';   // 받은/보낸쪽지 조회 주소
      let URLData2 = '/api/message/selectMsgList2'; // 회신쪽지 조회 주소

      let headParam = {
        head : {
          SERVICE: 'message.selectMsgList'
          , METHOD: 'list'
          , HEADER_TYPE: 'BIZ_SERVICE'
        }
      }

      if(this.msgflag){
        // console.log("받은쪽지조회");

        let postParam = {
          OTHER_USER_ID : ''
        }

        let response = await this.common_postCall(URLData, postParam, headParam);

        if(!response.HEADER.ERROR_FLAG) {
          let inqCnt = 0;
          for(var i=0; i < response.DATA.length; i++){
            var messageList = {
              otherUserName: '',
              otherUserId: '',
              userId: '',
              userName: '',
              portrait: '',
              date: '',
              text: '',
              reply: [],
              msgId: '',
              upMsgId: '',
              msgGroupId: '',
              inqYn: '',
              inqDt: '',
            };

            messageList.msgId= response.DATA[i].MSG_ID                              // 쪽지ID
            messageList.upMsgId= response.DATA[i].UP_MSG_ID                         // 상위쪽지ID
            messageList.msgGroupId= response.DATA[i].MSG_GROUP_ID                   // 쪽지그룹ID
            messageList.otherUserName= response.DATA[i].USER_NAME;                  // 송신자이름
            messageList.otherUserId= response.DATA[i].RGTR_ID;                      // 송신자ID
            messageList.userId= response.DATA[i].RCPTN_USER_ID;                     // 수신자ID
            messageList.userName= response.DATA[i].RCPTN_USER_NAME;                 // 수신자이름
            messageList.inqYn= response.DATA[i].INQ_YN;                             // 조회 여부
            messageList.inqDt= response.DATA[i].INQ_DT;                             // 조회 일자
            if(!this.mixin_isEmpty(response.DATA[i].STRG_FILE_NM)){
              messageList.portrait= "/upload/" + response.DATA[i]["FILE_PATH"] + "/" + response.DATA[i]["STRG_FILE_NM"];     // 프로필 사진
            }else{
              messageList.portrait= require('@/assets/img/@sample_portrait.png');     // 프로필 사진
            }
            messageList.date= this.timeFromNow(response.DATA[i].REG_DT) + "(" + response.DATA[i].REG_DT + ")"; // 등록일
            messageList.text= response.DATA[i].MSG_CN;                              // 쪽지내용
            messageList.reply= false;

            if(messageList.inqYn =='N'){
              inqCnt+=1;
            }

            this.NOTE_GIVE_LIST.push(messageList);
          }
          if(inqCnt > 0){
            this.TOP_UTIL.msg = true;
            this.TOP_UTIL.msgCnt = inqCnt;
          }else{
            this.TOP_UTIL.msg = false;
          }
        }

      }else if(!this.msgflag){
        // console.log("보낸쪽지조회 + 회신쪽지조회");

        let postParam = {
          OTHER_USER_ID : this.$store.getters['userStore/GE_USER_ROLE'].userId
        }

        let response = await this.common_postCall(URLData, postParam, headParam);
        let response2 = await this.common_postCall(URLData2, postParam, headParam);

        var messageList = {};
        var replyList = {};

        if(!response.HEADER.ERROR_FLAG) {
          // 보낸쪽지 조회 후 데이터 매핑
          for(var i=0; i < response.DATA.length; i++){
            messageList = {
              otherUserName: '',
              otherUserId: '',
              userId: '',
              userName: '',
              portrait: '',
              date: '',
              text: '',
              reply: [],
              msgId: '',
              upMsgId: '',
              msgGroupId: '',
              inqYn : '',
              inqDt : '',
           };

            messageList.msgId= response.DATA[i].MSG_ID                              // 쪽지ID
            messageList.upMsgId= response.DATA[i].UP_MSG_ID                         // 상위쪽지ID
            messageList.msgGroupId= response.DATA[i].MSG_GROUP_ID                   // 쪽지그룹ID
            messageList.otherUserId= response.DATA[i].RCPTN_USER_ID                 // 수신자ID
            messageList.otherUserName= response.DATA[i].RCPTN_USER_NAME;            // 수신자이름
            messageList.inqYn = response.DATA[i].INQ_YN;
            messageList.inqDt = "(" + response.DATA[i].INQ_DT + ")";
            if(!this.mixin_isEmpty(response.DATA[i].RCPTN_STRG_FILE_NM)){
              messageList.portrait= "/upload/" + response.DATA[i]["RCPTN_FILE_PATH"] + "/" + response.DATA[i]["RCPTN_STRG_FILE_NM"];     // 프로필 사진
            }else{
              messageList.portrait= require('@/assets/img/@sample_portrait.png');     // 프로필 사진
            }
            messageList.date= this.timeFromNow(response.DATA[i].REG_DT) + "(" + response.DATA[i].REG_DT + ")"; // 등록일
            messageList.text= response.DATA[i].MSG_CN;                                                         // 쪽지내용

            // 회신쪽지 조회 후 데이터 매핑
            for(var j=0; j < response2.DATA.length; j++){
                if(!this.mixin_isEmpty(response2.DATA[j].REPLY_UP_MSG_ID)){
                  if(response2.DATA[j].REPLY_MSG_GROUP_ID == response.DATA[i].MSG_GROUP_ID){
                      var replyList=
                      {
                        user: '',
                        text: '',
                        date: '',
                      }

                      replyList.user = response2.DATA[j].REPLY_USER_NAME;       // 회신자이름
                      replyList.text = response2.DATA[j].REPLY_MSG_CN;          // 회신내용
                      replyList.date = this.timeFromNow(response2.DATA[j].REPLY_REG_DT) + "(" + this.yyyyMMdd(response2.DATA[j].REPLY_REG_DT) + ")";  // 회신등록일
                      messageList.reply.push(replyList);
                  }
                }
            }
            this.NOTE_SEND_LIST.push(messageList);
          }
        }
      }
    },

    // 최신 받은 쪽지 조회
    async alGetNewMsg(){
      let URLData = '/api/message/selectNewMsg';
      let postParam = {
      }

      let headParam = {
        head : {
        }
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        try {
          if(response.DATA.length > 0) this.NEW_MSG_REG_DT = response.DATA[0].REG_DT;

          // let inqCnt = 0;
          //
          // for (let i in this.NOTE_GIVE_LIST.length) {
          //   if (this.NOTE_GIVE_LIST[i]["INQ_YN"] == 'Y') inqCnt += 1;
          // }
          // if(inqCnt > 0){
          //    this.TOP_UTIL_MSG = true;
          // }
        }catch(e){
          console.log(e);
        }
      }
    },

    async alGetMsgCnt(){
      let URLData = '/api/message/selectMsgCnt';
      let postParam = {
      }

      let headParam = {
        head : {
        }
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.MSG_FROM_CNT = response.DATA[0].MSG_FROM_CNT
        this.MSG_TO_CNT = response.DATA[0].MSG_TO_CNT
      }
    },

    async readMsg(data){

      let msg_id = data;
      let sURL = '/api/message/updateInqMsg';
      let postParam = {
        MSG_ID : msg_id,
        INQ_YN : 'Y'
      };
      let headParam={
        head:{}
      };
      let response = await this.common_postCall(sURL,postParam,headParam);
      // console.log(postParam)
      if(!response.HEADER.ERROR_FLAG){

        this.alGetMsgList();
        this.alGetNewMsg();

        // for (let i in this.NOTE_GIVE_LIST.length) {
        //   if (this.NOTE_GIVE_LIST[i]["INQ_YN"] == 'Y') {
        //     this.TOP_UTIL_MSG = false;
        //   } else {
        //     this.TOP_UTIL_MSG = true;
        //   }
        // }
      }
    },


    //*************************************
    //        쪽지 - 사용자검색관련
    //*************************************

    // 사용자검색 dialog 초기화
    findUserinit(){
      this.selectedItem = [];
      this.searchInput = '';
    },

    // 사용자검색
    topUserSearch2(val){
      this.findUserinit();
      this.searchUsername = this.TOP_UTIL.searchUsername;
      this.TOP_UTIL.toggleSearch = false;
      this.mixin_showDialog('UserFind2');
      this.search();
    },

    // 사용자찾기 - 조회,다음 검색버튼
    async search(){

      // let URLData = '/api/setting/agent/manage/user-info-inqire-popup/inqire';
      let URLData = '/api/message/selectUser';
      let postParam = {
        CUSTCO_ID: this.$store.getters['userStore/GE_USER_ROLE'].company.CD,
        USER_STTS_CD: 'WORK',
        USER_NM: this.userNm,
        ASP_USER_ID: this.$store.getters['userStore/GE_USER_ROLE'].userId,
        ASP_CUST_KEY: this.$store.getters['userStore/GE_USER_ROLE'].company.ASP_CUST_KEY,
      }

      let headParam = {
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.POST_MEMO_HEADER_ITEMS = response.DATA;

        // 받을 사람 리스트에 이동 되어있는 유저는 조회시 제외
        if(!this.mixin_isEmpty(this.POST_MEMO_HEADER_ITEMS2)){
          for(var i=0; i<this.POST_MEMO_HEADER_ITEMS.length; i++){
            for(var j=0; j<this.POST_MEMO_HEADER_ITEMS2.length; j++){
              if(!this.mixin_isEmpty(this.POST_MEMO_HEADER_ITEMS2) && (this.POST_MEMO_HEADER_ITEMS[i].USER_ID == this.POST_MEMO_HEADER_ITEMS2[j].USER_ID)){
                this.POST_MEMO_HEADER_ITEMS.splice(i, 1);
              }
            }
          }
        }
      }
    },

    // 왼쪽으로 리스트 이동
    toTheLeft(){
      for(var i=0; i<this.POST_MEMO_LIST2.length; i++){

        for(var x=0; x<this.POST_MEMO_HEADER_ITEMS.length; x++){
          if(parseInt(this.POST_MEMO_HEADER_ITEMS[x].ROW_NUMBER) < parseInt(this.POST_MEMO_LIST2[i].ROW_NUMBER)){
            if(parseInt(this.POST_MEMO_HEADER_ITEMS[this.POST_MEMO_HEADER_ITEMS.length-1].ROW_NUMBER) < parseInt(this.POST_MEMO_LIST2[i].ROW_NUMBER)){
              this.POST_MEMO_HEADER_ITEMS.push(this.POST_MEMO_LIST2[i]);
              break;
            }else{
              continue;
            }
          }else{
            this.POST_MEMO_HEADER_ITEMS.splice(x, 0, this.POST_MEMO_LIST2[i]);
            break;
          }
        }

        for(var j=0; j<this.POST_MEMO_HEADER_ITEMS2.length; j++){
          if(parseInt(this.POST_MEMO_LIST2[i].ROW_NUMBER) == parseInt(this.POST_MEMO_HEADER_ITEMS2[j].ROW_NUMBER)){
            this.POST_MEMO_HEADER_ITEMS2.splice(j, 1);
          }
        }
      }
      this.POST_MEMO_LIST2 = [];
    },

    // 오른쪽으로 리스트 이동
    toTheRight(){
      let USER_ID =  this.$store.getters['userStore/GE_USER_ID'];
      for(var i=0; i<this.POST_MEMO_LIST.length; i++){

        // 본인만 선택시 알림
        if(this.POST_MEMO_LIST.length == 1 && this.POST_MEMO_LIST[i].USER_ID == USER_ID){
            return this.showAlert(this.MESSAGE.ALERT.MYSELF);

        }else if(this.POST_MEMO_LIST[i].USER_ID != USER_ID){
          this.POST_MEMO_HEADER_ITEMS2.splice(this.POST_MEMO_LIST[i].ROW_NUMBER-1, 0, this.POST_MEMO_LIST[i]);
          for(var j=0; j<this.POST_MEMO_HEADER_ITEMS.length; j++){
            if(this.POST_MEMO_LIST[i].ROW_NUMBER == this.POST_MEMO_HEADER_ITEMS[j].ROW_NUMBER){
              this.POST_MEMO_HEADER_ITEMS.splice(j, 1);
            }
          }
        }
      }
      this.POST_MEMO_LIST = [];
    },

    // 현재시간부터 00전
    timeFromNow(regDt) {
      let toNewDate = this.yyyyMMdd(regDt);
      let toNewDate2 = new Date(toNewDate);
      let now = new Date();
      let milliSeconds = now - toNewDate2

      const seconds = milliSeconds / 1000
      if (seconds < 60) return `방금 전`
      const minutes = seconds / 60
      if (minutes < 60) return `${Math.floor(minutes)}분 전`
      const hours = minutes / 60
      if (hours < 24) return `${Math.floor(hours)}시간 전`
      const days = hours / 24
      if (days < 7) return `${Math.floor(days)}일 전`
      const weeks = days / 7
      if (weeks < 5) return `${Math.floor(weeks)}주 전`
      const months = days / 30
      if (months < 12) return `${Math.floor(months)}개월 전`
      const years = days / 365
      return `${Math.floor(years)}년 전`
    },

    // 날짜 포맷
    yyyyMMdd(yyyyMMddHHMISS) {
      var formatedDate = "";
      if (!yyyyMMddHHMISS) return "";

      if (yyyyMMddHHMISS.length === 14) {
        formatedDate =
          yyyyMMddHHMISS.substring(0, 4) +
          "-" +
          yyyyMMddHHMISS.substring(4, 6) +
          "-" +
          yyyyMMddHHMISS.substring(6, 8) +
          " " +
          yyyyMMddHHMISS.substring(8, 10) +
          ":" +
          yyyyMMddHHMISS.substring(10, 12) +
          ":" +
          yyyyMMddHHMISS.substring(12, 14)
        return formatedDate;
      } else {
        return yyyyMMddHHMISS;
      }
    },

    // 초기화
    initList(){
      this.NOTE_GIVE_LIST = [];
      this.NOTE_SEND_LIST = [];
      this.NOTE_REPLY_CONTENTS = '';
      this.POST_MEMO_LIST = [];
    },

    // 게시글 detail
    alBrdDetail(item){

      // 파일리스트 초기화
      this.NotiDetail.filelist = [];

      this.NotiDetail.subject = item.PST_TTL;
      this.NotiDetail.date = item.REG_DT;
      // this.NotiDetail.time = item.time;
      this.NotiDetail.manager = item.USER_NAME;
      this.NotiDetail.text = item.PST_CN;
      this.NotiDetail.PST_ID = item.PST_ID;
      this.NotiDetail.BBS_ID = item.BBS_ID;
      this.NotiDetail.FILE_GROUP_KEY = item.FILE_GROUP_KEY;

      if(!this.mixin_isEmpty(this.NotiDetail.FILE_GROUP_KEY)){
        this.getBoardFiles();
      }

      if(!this.dialogNoticeDetail){

        // 조회수 조회
        this.selectCnt();

        // 조회수 증가
        this.increaseCnt();

        this.mixin_showDialog('NoticeDetail');
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
      // return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    },

    // 게시글 상세조회시 등록된 파일조회
    async getBoardFiles(){

      let sUrl = '/api/board/file-list';
      let postParam = {
        PST_ID: this.NotiDetail.PST_ID,
        FILE_GROUP_KEY: this.NotiDetail.FILE_GROUP_KEY,
        TASK_TYPE_CD: 'bbs',
        BBS_ID: this.NotiDetail.BBS_ID
      }
      let headParam = {
        head: {
        }
      }

      let response = await this.common_postCall(sUrl, postParam, headParam)
      if(!response.HEADER.ERROR_FLAG){
        for(let i=0; i<response.DATA.length; i++){
          this.NotiDetail.filelist.push({
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
          })
        }
        // console.log(this.NotiDetail.filelist);
      }
    },

    // 조회수 증가
    async increaseCnt(){

      let URLData = '/api/board/increaseCnt';
      let postParam = {
        BBS_ID : this.NotiDetail.BBS_ID // 게시판ID
        , PST_ID : this.NotiDetail.PST_ID // 게시글ID
        , INQ_CNT : this.NotiDetail.count // 조회수
      }

      let headParam = {
        head : {
        }
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
      }
    },

    // 조회수 조회
    async selectCnt(){

      let URLData = '/api/board/selectCnt';
      let postParam = {
        BBS_ID : this.NotiDetail.BBS_ID // 게시판ID
        , PST_ID : this.NotiDetail.PST_ID // 게시글ID
      }

      let headParam = {
        head : {
        }
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        try {
          this.NotiDetail.count = response.DATA[0].INQ_CNT;
        }catch(e){
          this.NotiDetail.count = 0;
        }
      }
    },

    // 알림센터, 게시판, 게시판유형별 - 게시글 조회
    async alGetBrdList(item){

      let URLData = '/api/board/selectBoardList';
      let postParam = {
        PST_TYPE_CD : item
        , BOARD_LIST_FROM2 : true
      }

      let headParam = {
        head : {
          PAGING: 'N'
        }
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        // 제목 말줄임
        let length = 35; // 표시할 글자수 기준
        let str;
        for(let i=0; i<response.DATA.length; i++){

          // 날짜 포맷
          response.DATA[i].REG_DT = response.DATA[i].REG_DT.substring(0, response.DATA[i].REG_DT.indexOf(' ', 0)).replace(/\//g, '-');

          str = response.DATA[i].PST_TTL;
          if (str.length > length) {
              str = str.substr(0, length - 2) + '...';
          }
          response.DATA[i].PST_TTL = str;
        }

        this.ALARM_LIST = response.DATA;

        // 게시글 유형별 개수 조회
        this.alGetBrdTpCnt();
      }
    },

    // 게시글 유형별 개수 조회
    async alGetBrdTpCnt(){

      let URLData = '/api/board/selectBoardTpCnt';
      let postParam = {
      }

      let headParam = {
        head : {
        }
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        console.log(response.DATA);
        this.GENR_CNT = response.DATA[0].GENR_CNT
        this.NOTI_CNT = response.DATA[0].NOTI_CNT
        this.EMRG_CNT = response.DATA[0].EMRG_CNT
      }
    },

    // 최신글 조회 - 알림 활성화/비활성화 설정
    async alGetNewBrd(){
      let URLData = '/api/board/selectBoardList';
      let postParam = {
        AL_NEW_YN: true
      }

      let headParam = {
        head : {
        }
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        // 알림 활성화/비활성화 설정
        if(response.DATA.length > 0){
          this.TOP_UTIL.notice = new Date(response.DATA[0].REG_DT) >= new Date().setDate(new Date().getDate() - 3) ? true : false

        }else{
          this.TOP_UTIL.notice = false;
        }
      }
    },

    // sort
    FnEvt(item, index, type, arr) {

      if(type === "ALARM_SORT"){
        // 게시글 유형별 조회
        this.alGetBrdList(item.type);

      } else if(type === "NOTE_SORT"){

        this.alGetMsgCnt();
        if(item.type === "give"){
          // 받은 쪽지
          this.msgflag = true;
          this.alGetMsgList();
          this.initList();
        }else if(item.type === "send"){
          // 보낸 쪽지
          this.msgflag = false;
          this.alGetMsgList();
          this.initList();
        }
      }
      this.mixin_selected_sort(arr, index);
      this[type] = item.type;
    },
    FnEvtThrought(item) {
      console.log(item);
      this.sendMessage(item);
     this.mixin_testLog(item);
    },
    displayAlarmType(type) {
      switch (type) {
        case 'GENR':
          return '일반'

        case 'EMRG':
          return '긴급';

        case 'NOTI':
          return '공지';

        case 'GENR0':
          return '('+this.GENR_CNT+')';

        case 'NOTI0':
          return '('+this.NOTI_CNT+')';

        case 'EMRG0':
          return '('+this.EMRG_CNT+')';

        case 'give':
          return '(' + this.MSG_FROM_CNT + ')'

        case 'send':
          return '(' + this.MSG_TO_CNT + ')'

        default:
          break;
      }
    },

    // 상단 검색
    toggleTopSearch(){
      this.TOP_UTIL.toggleSearch = true;
      this.$nextTick(() => {
        this.$refs.searchCusname.focus();
      })
    },

    //고객검색버튼
    topCusSearch(val){
      this.searchCusname = this.TOP_UTIL.searchCusname;
      this.TOP_UTIL.toggleSearch = false;
      this.mixin_showDialog('CusFind');
      this.$eventBus.$emit('searchCustName', val);
      this.TOP_UTIL.searchCusname = '';
      this.$eventBus.$emit('reSetCuttTime');
    },

    // 회사 선택
    async selectCompanyList(item) {
      const PREV_SELECTED_COMPANY = this.SELECTED_COMPANY;

      if(PREV_SELECTED_COMPANY.SCHEMA_ID + '_' + PREV_SELECTED_COMPANY.CD != item.SCHEMA_ID + '_' + item.CD){
        this.showAlert({
          alertDialogToggle: true
          , msg: '고객사를 변경 하시겠습니까?'
          , iconClass: 'is-info'
          , type: 'confirm'
          , callYes: () => {
            this.SELECTED_COMPANY = item;
            this.$store
              .dispatch("userStore/AC_USER_COMPANY", item)
              .then(async (response) => {

                let sUrl = '/auth-api/changeComponyToken';
                let postParam = {
                  SELECTED_CUSTCO_ID : item.CD
                  , SELECTED_USER_ID : item.USER_ID
                  , SELECTED_TENANT_ID : item.SCHEMA_ID
                }
                const headParam = {
                  head: {
                  }
                }
                console.log( postParam );
                let changeComponyResponse  = await this.common_postCall(sUrl, postParam, headParam);

                if (!changeComponyResponse.HEADER.ERROR_FLAG) {

                  //사용자 상세정보 조회
                  //조회시 asp_cust_key가 필요하기 때문에 company 조회 후 호출
                  // this.getUserDedail();
                  // this.emitter.emit("pageInit", this.SELECTED_COMPANY);
                  //eventBus.selCompanyAction(this.SELECTED_COMPANY); //고객사 선색시 eventBus 전송
                  this.$store.commit("userStore/MU_USER_EXT_NO", item.EXT_NO);//내선번호
                  this.$store.commit("userStore/MU_USER_PDS_EXT_NO", item.PDS_EXT_NO);//PDS 내선번호
                  this.$store.getters["userStore/GE_USER_ROLE"].EXT_NO = item.EXT_NO; //내선번호
                  this.$store.getters["userStore/GE_USER_ROLE"].PDS_EXT_NO = item.PDS_EXT_NO; //PDS 내선번호
                  this.$store.dispatch("commonStore/AC_COMMON_DELETE_ALL_TAB", "");
                  this.$store.commit("alertStore/hideAlert");

                  this.$store.commit("authStore/MU_CUSTCO_TENANT_ID", {custco_tenant_id: item.SCHEMA_ID});

                  this.CUSTCO_ID = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;
                  this.IPCC_SOCKET_URL = this.$store.getters["userStore/GE_USER_COMPANY"].API_URI;
                  // console.log(this.SELECTED_COMPANY);
                  // console.log("GE_USER_COMPANY====>",this.$store.getters["userStore/GE_USER_COMPANY"]);
                  // console.log("GE_USER_ROLE====>",this.$store.getters["userStore/GE_USER_ROLE"]);
                  // console.log("GE_USER_EXT_NO====>",this.$store.getters["userStore/GE_USER_EXT_NO"]);
                  // console.log("GE_USER_PDS_EXT_NO====>",this.$store.getters["userStore/GE_USER_PDS_EXT_NO"]);

                }

              });
          } //고객사 선색시 모든 tab 삭제
          , callNo: () => {
            this.SELECTED_COMPANY = PREV_SELECTED_COMPANY;
            this.$store.commit("alertStore/hideAlert")
          }
        });
      }
    },
    closeDropSelectCompany(){
      this.dropSelectCompany = false;
    },
   /*  // 이석 선택
    selectMoveList(item) {
      this.SELECTED_MOVE = item;
      this.ctiBtnEvt(item);
    },
    closeDropCtiMove(){
      this.dropCtiMove = false;
    },
    // 프로필 이미지 업로드 클릭 시 */

    // 프로필 이미지
    changeProflieImg() {
      this.$refs.fileUpload.click();
    },

    // 실제 파일을 서버에 업로드 하는 부분
    handleFileUpload(event){

      const file = this.$refs.fileUpload.files;

       if (file.length > 0 && this.isValidFiles(file)) {
         // 파일 업로드
          this.PROFILE_FILE = file;
          // console.log("file",file)
          this.showAlert({
            alertDialogToggle: true,
            msg: '프로필 사진을 변경 하시겠습니까?',
            iconClass: 'is-info',
            type: 'confirm',
            callYes: this.uploadProfileYes,
            callNo: this.closeMsg
            });

        // const reader = new FileReader();

        // reader.onload = (event) => {
        //   this.MANAGER_PROFILE.img = event.target.result;
        // };

        // this.uploadFiles(file);
        // reader.readAsDataURL(file[0]);
      }
    },

    uploadProfileYes(){

      this.uploadFiles(this.PROFILE_FILE);

    },

     isValidFiles(files) {
      // 파일 개수 제한을 설정
      // console.log("file in vlidate",files[0])
      // console.log("file in vlidate",files.length)
      const maxFileCount = 1;
      if (files.length > maxFileCount) {
        alert(`최대 ${maxFileCount}개의 파일까지 업로드할 수 있습니다.`);
        return false;
      }
      // 파일 크기 및 형식을 설정 (대소문자 구분)
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxFileSize = 5 * 1024 * 1024; // 5MB

      for (let i = 0; i < files.length; i++) {
          const file = files[i];
          // console.log(files[0])
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
      let busiType = 'profile';
      let pathType = 'images';
      let uploadUrl = "api/file/"+ busiType +"/"+ pathType +"/uploads";

      //파일 제한 체크 (빽엔드에서 체크 후 업로드 실패)
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {

        formData.append('action', uploadUrl);
        formData.append('method', "post");
        formData.append('custcoId', this.$store.getters['userStore/GE_USER_ROLE'].company.CD);                 //회사구분 : 1은 시스템(가이드)
        formData.append('userfiles', files[i]);           //파일(바이너리)
        formData.append('userId', this.$store.getters['userStore/GE_USER_ROLE'].userId);                   //사용자 ID : 2는 시스템(가이드)

        for (let key of formData.keys()) {
            // console.log("formData key",key);
        }

        /* value 확인하기 */
        for (let value of formData.values()) {
            // console.log("formData val",value);
        }

        axios
        .post(uploadUrl, formData, {headers:{Authorization: "bearer " + window.sessionStorage.getItem("token")}})
          .then(response => {
            // 파일 업로드 성공 시 처리
            // console.log("response.dataresponse.dataresponse.dataresponse.data",response.data);
            this.uploadProfile(response.data.data[0].fileGroupKey)
            this.PROFILE_FILE = null;

              // response.data.data[0].fileGroupKey
          })
          .catch(error => {
            // 파일 업로드 실패 시 처리
            console.error(error);
          });
      }
      // 서버로 파일 업로드 요청을 보냅니다.
    },


    /* 사용자 테이블의 icon 컬럼에 파일 그룹 키 업로드 */

    async uploadProfile(fileGroupKey){
        let sURL = 'api/setting/agent/profile/updateProfile';
        let postParams ={
          REG_USER_ID : this.$store.getters["userStore/GE_USER_ROLE"].userId,
          ICON : fileGroupKey,
        };
        let headParams = {
          head:{}
        };

        let response = await this.common_postCall(sURL, postParams, headParams);

        if(response.HEADER.ERROR_FLAG){
          this.showAlert(this.MESSAGE.ERROR)
        }else{
          this.closeMsg();
          this.getUserInfo();
          this.$store.commit("alertStore/hideAlert");
        }
    },


    logout(msg) {
      //Arthur.Kim 2022.05.18
      this.$eventBus.busStompDisconnect();

      this.$store
        .dispatch("authStore/AC_AUTH_LOGOUT", { id: this.userId })
        .then((response) => {
          if (this.mixin_check_repsonse(response) === true) {
            console.log("######### 로그아웃 성공");
          }

          this.$store.commit("alertStore/INIT");
          this.$store.commit("toastStore/INIT");

          //API가 정상처리 되지 않아도 세션 삭제 후 로그인 페이지로 이동 시킨다
          window.sessionStorage.clear();
          if( msg == undefined ) msg = "";
          this.$router.push("/login?m="+msg);
          window.location.reload(true);
        })
        .catch((err) => {
          window.sessionStorage.clear();
          this.$router.push("/login");
          window.location.reload(true);
          console.log("######### 로그아웃 에러");

          // this.errorMessage = err.response.data.errormessage;
        });
    },

    setUserInfo(userTp) {
      this.$eventBus.$emit('setUserInfo');
      this.mixin_hideDialog(userTp);
    },


    /*****************************
             비밀번호 변경
    *****************************/
   initPswdVar(){
     this.mixin_hideDialog('Profile');

    //  console.log("initPswdVar")

     this.PASSWORD_OLD = '';
     this.PASSWORD_NEW = '';
     this.PASSWORD_NEW2 = '';
     this.resetValidation();
   },
   validate () {
      return this.$refs.form.validate();
   },
   resetValidation() {

     if(this.validate){
      //  console.log("resetvalidation")
      if(this.$refs.form != undefined) return this.$refs.form.resetValidation();
     }
   },

    PswdValidate(){
      if(this.validate()){
        if(this.PASSWORD_NEW !== this.PASSWORD_NEW2){
          this.showAlert(this.MESSAGE.ALERT.NOT_CONFIRMED_PSWD);
        }else if(this.PASSWORD_OLD === this.PASSWORD_NEW){
          this.showAlert(this.MESSAGE.ALERT.NOT_SAME_PSWD);
        }else{
          // MESSAGE.CONFIRM에 선언하면 오류 발생
          this.showAlert({alertDialogToggle: true, msg: '비밀번호를 변경 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.getPswdEncKey, callNo: this.closeMsg});
        }
      }
    },
    //비밀번호 암호화 키 호출
    async getPswdEncKey() {

      let sUrl = 'auth-api/password-encpt/process';
      let postParam = {
          username: this.$store.getters["userStore/GE_USER_ROLE"].lgnId,
      }
      let headParam = {
        head:{},
      };

      let response = await this.common_postCall(sUrl,postParam,headParam)


      if (!response.HEADER.ERROR_FLAG) {
        this.ENCRYPT_KEY = response.DATA[0].ENCRYPT_KEY;
        // console.log("ENCRYPT_KEY1 : ", this.ENCRYPT_KEY);
        //호출된 암호화 키로 로그인 처리
        //alert(this.user_id);
      //this.pwLogin();
        this.chgPswdSave();
      }
      // console.log("PASSWORD_NEW")
    },

    async chgPswdSave(){

      const strPassWD_OLD = sha256(this.PASSWORD_OLD);
      // console.log("strPassWD_OLD : ", strPassWD_OLD);

      let encPassWD_OLD = GibberishAES.aesEncrypt(
        strPassWD_OLD,
        this.ENCRYPT_KEY
      ); //gibberish-aes.js

      // console.log("encPassWD_OLD : ", encPassWD_OLD);
      //const password_NEW = this.PASSWORD_NEW;
      const strPassWD_NEW = sha256(this.PASSWORD_NEW);
      let encPassWD_NEW = GibberishAES.aesEncrypt(
        strPassWD_NEW,
        this.ENCRYPT_KEY
      ); //gibberish-aes.js
      //alert(this.ENCRYPT_KEY);
      // console.log("strPassWD_NEW : ", strPassWD_NEW);
      // console.log("encPassWD_NEW : ", encPassWD_NEW);

      let CHK_OLD_FLAG = "Y";
      let PSWD_FAIL_CNT = "0";
      let BIZ_DIV = "CHANGEPSWD";
      let PSWD_STTS = "NORMAL";

      let sUrl = 'auth-api/password/modify';
      let postParam = {
          CHK_OLD_FLAG: CHK_OLD_FLAG,
          LGN_ID: this.$store.getters["userStore/GE_USER_ROLE"].lgnId,
          PASSWORD_OLD: encPassWD_OLD,
          PASSWORD_NEW: encPassWD_NEW,
          PSWD_FAIL_CNT: PSWD_FAIL_CNT,
          MDFR_ID: this.$store.getters["userStore/GE_USER_ROLE"].userId,
          PSWD_STTS: PSWD_STTS,
          ENCRYPT_KEY: this.ENCRYPT_KEY,
      };
      let headParam = {
        head:{}
      };
      let response = await this.common_postCall(sUrl,postParam,headParam);

      if(!response.HEADER.ERROR_FLAG){
        this.closeMsg();
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.mixin_hideDialog('Password');
        this.initPswdVar();

        this.$store.commit("userStore/MU_PWD_CHANGE_YN", 'Y');
        this.$store.commit("userStore/MU_ELAPSED_DATE", '0');
      }else{
        this.closeMsg();
        this.showToast({  msg: response.HEADER.ERROR_MSG, class: 'warning', hasToastIcon: true, icon: 'mdi-close-circle', time: 2000 });
      }
    },

    closeMsg(){
      this.$store.commit("alertStore/hideAlert");

    },

    /* 상단 사용자 정보 조회  */

    async getUserInfo(){

      this.initUserInfo();

      let sURL ='/api/setting/agent/manage/list';
      let postParam = {
        SCH_USER_ID : this.$store.getters["userStore/GE_USER_ROLE"].userId,
      }
      // console.log("GET USER INFO PARAM", postParam)

      let headParam = {
        head : {}
      }

      let response = await this.common_postCall(sURL,postParam, headParam)

      if(!response.HEADER.ERROR_FLAG){
        let tempData = response.DATA;
        // console.log("tempData",tempData)
        this.MANAGER_PROFILE.CO_NM = tempData[0].CO_NM;
        this.MANAGER_PROFILE.USER_NM = tempData[0].USER_NM;
        this.MANAGER_PROFILE.EXT_NO = this.mixin_isEmpty(tempData[0].EXT_NO) ? '-': tempData[0].EXT_NO;
        this.MANAGER_PROFILE.DEPT_NM = tempData[0].DEPT_NM;
        // this.MANAGER_PROFILE.IP = tempData[0].CNTN_IP;
        this.MANAGER_PROFILE.IP = this.$store.getters["userStore/GE_USER_CNTN_IP"];
        this.MANAGER_PROFILE.OFC_ADDR = tempData[0].OFC_ADDR;
        this.$store.getters["userStore/GE_USER_ROLE"].OFC_ADDR = this.MANAGER_PROFILE.OFC_ADDR;

        this.MANAGER_PROFILE.EMAIL = this.mixin_isEmpty(tempData[0].EML) ? '-': tempData[0].EML;
        this.$store.getters["userStore/GE_USER_ROLE"].EMAIL = this.MANAGER_PROFILE.EMAIL;

        this.MANAGER_PROFILE.PHN_NO = this.mixin_isEmpty(tempData[0].MBL_PHN_NO) ? '-': tempData[0].MBL_PHN_NO;
        this.$store.getters["userStore/GE_USER_ROLE"].PHN_NO = this.MANAGER_PROFILE.PHN_NO;

        if(!this.mixin_isEmpty(tempData[0].ICON)){
          this.MANAGER_PROFILE.FILE_GROUP_KEY = tempData[0].ICON;
          this.$store.getters["userStore/GE_USER_ROLE"].ICON = tempData[0].ICON;
          this.MANAGER_PROFILE.img =  '/upload/' + tempData[0].ICON_IMG_URI;
          this.$store.getters["userStore/GE_USER_ROLE"].ICON_IMG_URI = '/upload/' + tempData[0].ICON_IMG_URI;
        }else{
          this.MANAGER_PROFILE.img =  require('@/assets/img/@profile_user.png');
        }
        // console.log('tempData',tempData)

        this.$store.getters["userStore/GE_USER_ROLE"].JBTTL = tempData[0].JBTTL;


        this.$eventBus.$emit("cs-info", tempData);
      }

    },
    initUserInfo(){
      this.MANAGER_PROFILE = {
          img : '',//require('@/assets/img/@profile_user.png'), //사이즈  69x69
          FILE_GROUP_KEY : '',
          USER_NM : '',
          DEPT_NM: '',
          IP : '',
          EXT_NO : '',
          OFC_ADDR: '',
          EMAIL : '',
          PHN_NO : '',
        };
    },

    clearCustSch() {
      // this.TOP_UTIL.toggleSearch = false;
      this.TOP_UTIL.searchCusname = '';
    },

    // 실시간으로 서버의 변경사항을 웹 브라우저에 갱신해줘야 하는 경우 사용예정.
    initConnectSSE() {
      var _this = this;

      let geCostcoId = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;
      let geSchemaId = this.$store.getters["userStore/GE_USER_ROLE"].company.SCHEMA_ID;
      let geUserId = this.$store.getters["userStore/GE_USER_ROLE"].userId;
      let geLgnId = this.$store.getters["userStore/GE_USER_ROLE"].lgnId;
      let geIpAddr = this.$store.getters['userStore/GE_USER_IP_ADDR'];

      stompSseUtil.token = this.$store.state.messages.token; //SOCKET 연결 시 사용자 SOCKET Token 세팅
      stompSseUtil.userId = geUserId;
      stompSseUtil.lgnId = geLgnId;
      stompSseUtil.roomId = geSchemaId + "_"+ geCostcoId;
      stompSseUtil.custcoId = geCostcoId;
      stompSseUtil.schemaId = geSchemaId;
      stompSseUtil.ipAddr = geIpAddr;

      stompSseUtil.connect(
          () => {
            // 연결성공( 재연결 포함 )
            stomeSseReConnectCnt = 36;
            stompSseUtil.setConnected(true);
            stompSseUtil.subscribe(_this, "/sse-api/v1/sub/room/" + stompSseUtil.roomId, {
              roomId: stompSseUtil.roomId,
              userId: stompSseUtil.userId,
              ipAddr: stompSseUtil.ipAddr
            });
            stompSseUtil.subscribe(_this, "/user/sse-api/v1/sub/room/" + stompSseUtil.roomId, {
              roomId: stompSseUtil.roomId,
              userId: stompSseUtil.userId,
              ipAddr: stompSseUtil.ipAddr
            });
          },
          (error) => {
            if (error != null) {
              console.log(error);
              stompSseUtil.setConnected(false);
              if( stomeSseReConnectCnt > 0 ) {  // 재연결 시도
                setTimeout(this.initConnectSSE, 5000);
                --stomeSseReConnectCnt;
                console.log( "stomeSseReConnectCnt : " + stomeSseReConnectCnt);
              }
            }
          }
      );

      /*
      var _this = this;
      const eventSource = new EventSource('/sse-api/subscribe/' + _this.$store.getters["userStore/GE_USER_ROLE"].lgnId + "/" + sessionStorage.getItem('jsessionid') );
      eventSource.addEventListener("sse", function (event) {
        console.log("["+ _this.$moment(new Date()).format('YYYY.MM.DD HH:mm:ss') + "].SSE " + event.data);
        const data = JSON.parse(event.data);
        (async () => {
          if( data.notificationType == "ENV_IS_ALARM") {
            _this.$store.dispatch('commonStore/AC_COMMON_SETTING_IS_ALARM', JSON.parse(data.content));  //우측 알람표시여부
          }else if( data.notificationType == "SYSTEM_LOGOUT") {
            _this.showToast({  msg: '잠시 후 시스템에 의해 로그아웃 됩니다.', class: 'warning', hasToastIcon: true, icon: 'mdi-information-outline', time: (Number(data.second) * 1000), type: 'top', progress: true, close: true});
            setTimeout(function() {_this.logout();}, (Number(data.second) * 1000));
          }else if( data.notificationType == "SYSTEM_CHECK") {
            _this.showToast({msg: '잠시 후 시스템점검 예정입니다. '+ Number(data.second) +'초 후 자동로그아웃 됩니다.', class: 'warning', hasToastIcon: true, icon: 'mdi-information-outline', time: (Number(data.second) * 1000), type: 'top', progress: true, close: true});
            setTimeout(function() {_this.logout();}, (Number(data.second) * 1000));
          }else if( data.notificationType == "SYSTEM_INFO") {
            _this.showToast({  msg: data.content, class: 'info', hasToastIcon: true, icon: 'mdi-information-outline', time: (Number(data.second)) * 1000, type: 'top', progress: true, close: true });
          }else if( data.notificationType == "SYSTEM_INFO_2") {
            _this.showToast({  msg: data.content, class: 'info', hasToastIcon: true, icon: 'mdi-information-outline', time: (Number(data.second)) * 1000, progress: true, close: true });
          }
        })();
      });*/
    },

    /* 고객사별 환경설정 세팅용도.  */
    async initSettingEnv() {
      let response = await this.common_postCall('/api/setting/env/custcoSettingList', {}, {head: {}});
      if (!response.HEADER.ERROR_FLAG) {
        try {

          let arrInfo = [];
          response.DATA.forEach((data, idx) => {
            arrInfo[data.EXPSN_ATTR_COL_ID] = data;
          });

          this.$store.dispatch('commonStore/AC_CUSTCO_SETTING', {...arrInfo});
        }catch(e){
          console.error( "initSettingEnv error : " + e);
        }
        // try {
        //   /* 콜백, 예약콜 알람표시관련 */
        //   clearInterval(this.rightmenu_alarm_interval);
        //   this.rightMenuAlarmMonitoring();
        //   this.rightmenu_alarm_interval = setInterval( this.rightMenuAlarmMonitoring, 60000 * 10); //60초 * 10 == 10분

        // }catch(e){
        //   console.error( "rightMenuAlarmMonitoring error : " + e);
        // }

      }

      setTimeout(() => this.getReserveCallInfo(), 1000); //예약콜 정보 조회
      setTimeout(() => this.getCallbackInfo(), 1000); //콜백 정보 조회
    },

    //예약콜 정보 조회
    async getReserveCallInfo(){
      //처리해야할 예약콜

      let rsvtCallResponse = await this.common_postCall('/phone-api/cutt/inqire/rsvtCallAlarmMonitor'
          , {
            CUSL_ID: this.$store.getters["userStore/GE_USER_ROLE"].userId,
            IS_ALL_ENV: JSON.stringify(this.mixin_getCustcoSetting('ENV_RESERVECALL_YN'))
          } //환경설정에 의한 전체여부
          , {head: {}}
      );

      if (!rsvtCallResponse.HEADER.ERROR_FLAG) {
        if (Number(rsvtCallResponse.DATA[0].NO_COMPLETED_CNT) > 0) {
          this.reserveCallAlarm(true);
        } else {
          this.reserveCallAlarm(false);
        }
      }
    },

    //콜백 알림
    async getCallbackInfo(){
      //처리해야할 콜백
      let callbackResponse = await this.common_postCall('/phone-api/callback/inqire/callbackAlarmMonitor'
          , {
            CUSL_ID: this.$store.getters["userStore/GE_USER_ROLE"].userId,
            IS_ALL_ENV: JSON.stringify(this.mixin_getCustcoSetting('ENV_CLBK_YN'))
          } //환경설정에 의한 전체여부
          , {head: {}}
      );

      if (!callbackResponse.HEADER.ERROR_FLAG) {
        if (Number(callbackResponse.DATA[0].NO_COMPLETED_CNT) > 0) {
          this.callbackAlarm(true);
        } else {
          this.callbackAlarm(false);
        }
      }
    },

    //예약콜 알림 상태 변경
    reserveCallAlarm(alarmYn) {
      var reserveCallIndex = this.$store.getters["userStore/GE_RIGHT_MENU"].findIndex(i => i.ICON_CLASS_NM === 'reserveCall')

      if(alarmYn) this.$store.commit("userStore/MU_ANIMATION_ACTIVE", reserveCallIndex);
      else this.$store.commit("userStore/MU_ANIMATION_INACTIVE", reserveCallIndex);
    },

    //콜백 알림 상태 변경
    callbackAlarm(alarmYn) {
      var callbackIndex = this.$store.getters["userStore/GE_RIGHT_MENU"].findIndex(i => i.ICON_CLASS_NM === 'callback')

      if(alarmYn) this.$store.commit("userStore/MU_ANIMATION_ACTIVE", callbackIndex);
      else this.$store.commit("userStore/MU_ANIMATION_INACTIVE", callbackIndex);
    },

    //상담 진행중 아웃바운드 진행
    forcObd(){
      this.closeMsg();
      this.OUT_CALL_DATA = this.WAIT_OUT_CALL_DATA;
      this.dialogOutCall = true;
      this.mixin_showDialog('dialogOutCall');
    },

    //녹취 파일 정보 가져오기 위해 CompoFindCallHist의 eventbus 실행
    getRecFileInfo() {
      this.$eventBus.$emit('setRecFileInfo');
    },

    //콜 이력 찾기 데이터 전달용
    setRecFileInfo(item) {
      this.$eventBus.$emit('parentSetRecFileInfo', item);
      this.mixin_hideDialog('IpccCallHistFind');
    },

    //강제새로고침
    forceRefresh(){
      document.location.href = window.location.href;
    },

    //AS 기사 정보 데이터 Set
    setVstData(data) {
      if(data){
        data.VST_RSVT_IDX = this.VST_RSVT_IDX;
        this.$eventBus.$emit('setVstData', data);
      }else{
        this.$eventBus.$emit('setVstData', null);
      }
    }
  },

  async mounted() {

    this.CUSTCO_ID = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;

    //IPCC 연동 URL 정보 셋팅
    this.IPCC_SOCKET_URL = this.$store.getters["userStore/GE_USER_COMPANY"].API_URI;
    let sApiUri = this.IPCC_SOCKET_URL;
    if(sApiUri){
      const iSemiCnt = sApiUri.match(/:/g).filter(function(item) { return item !== ''; }).length;

      if(iSemiCnt > 1){
        this.SKIP_URL = sApiUri.split(':')[0] + ':' + sApiUri.split(':')[1]; //거부
        this.TRANS_URL = sApiUri.split(':')[0] + ':' + sApiUri.split(':')[1]; //호전환
        this.FANVIL_URL = sApiUri.split(':')[0] + ':' + sApiUri.split(':')[1]; //판빌(전화기업체) 상태 체크
      }else{
        this.SKIP_URL = sApiUri; //거부
        this.TRANS_URL = sApiUri; //호전환
        this.FANVIL_URL = sApiUri; //판빌(전화기업체) 상태 체크
      }
    }

    // 게시글 조회 - 최신글(new) 알림 true/false 설정
    // console.log("top moiunted")
    this.getUserInfo();
    this.alGetNewBrd();
    this.alGetMsgList();
    this.alGetNewMsg();

  },

};

//암호화 모듈
let GibberishAES = (function () {
  var Nr = 14,
    /* Default to 256 Bit Encryption */
    Nk = 8,
    Decrypt = false,
    enc_utf8 = function (s) {
      try {
        return unescape(encodeURIComponent(s));
      } catch (e) {
        throw "Error on UTF-8 encode";
      }
    },
    dec_utf8 = function (s) {
      try {
        return decodeURIComponent(escape(s));
      } catch (e) {
        throw "Bad Key";
      }
    },
    padBlock = function (byteArr) {
      var array = [],
        cpad,
        i;
      if (byteArr.length < 16) {
        cpad = 16 - byteArr.length;
        array = [
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
        ];
      }
      for (i = 0; i < byteArr.length; i++) {
        array[i] = byteArr[i];
      }
      return array;
    },
    block2s = function (block, lastBlock) {
      var string = "",
        padding,
        i;
      if (lastBlock) {
        padding = block[15];
        if (padding > 16) {
          throw "Decryption error: Maybe bad key";
        }
        if (padding == 16) {
          return "";
        }
        for (i = 0; i < 16 - padding; i++) {
          string += String.fromCharCode(block[i]);
        }
      } else {
        for (i = 0; i < 16; i++) {
          string += String.fromCharCode(block[i]);
        }
      }
      return string;
    },
    a2h = function (numArr) {
      var string = "",
        i;
      for (i = 0; i < numArr.length; i++) {
        string += (numArr[i] < 16 ? "0" : "") + numArr[i].toString(16);
      }
      return string;
    },
    h2a = function (s) {
      var ret = [];
      s.replace(/(..)/g, function (s) {
        ret.push(parseInt(s, 16));
      });
      return ret;
    },
    s2a = function (string, binary) {
      var array = [],
        i;

      if (!binary) {
        string = enc_utf8(string);
      }

      for (i = 0; i < string.length; i++) {
        array[i] = string.charCodeAt(i);
      }

      return array;
    },
    size = function (newsize) {
      switch (newsize) {
        case 128:
          Nr = 10;
          Nk = 4;
          break;
        case 192:
          Nr = 12;
          Nk = 6;
          break;
        case 256:
          Nr = 14;
          Nk = 8;
          break;
        default:
          throw "Invalid Key Size Specified:" + newsize;
      }
    },
    randArr = function (num) {
      var result = [],
        i;
      for (i = 0; i < num; i++) {
        result = result.concat(Math.floor(Math.random() * 256));
      }
      return result;
    },
    openSSLKey = function (passwordArr, saltArr) {
      // Number of rounds depends on the size of the AES in use
      // 3 rounds for 256
      //        2 rounds for the key, 1 for the IV
      // 2 rounds for 128
      //        1 round for the key, 1 round for the IV
      // 3 rounds for 192 since it's not evenly divided by 128 bits
      var rounds = Nr >= 12 ? 3 : 2,
        key = [],
        iv = [],
        md5_hash = [],
        result = [],
        data00 = passwordArr.concat(saltArr),
        i;
      md5_hash[0] = GibberishAES.Hash.MD5(data00);
      result = md5_hash[0];
      for (i = 1; i < rounds; i++) {
        md5_hash[i] = GibberishAES.Hash.MD5(md5_hash[i - 1].concat(data00));
        result = result.concat(md5_hash[i]);
      }
      key = result.slice(0, 4 * Nk);
      iv = result.slice(4 * Nk, 4 * Nk + 16);
      return {
        key: key,
        iv: iv,
      };
    },
    rawEncrypt = function (plaintext, key) {
      plaintext = GibberishAES.s2a(plaintext);
      var iv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      // plaintext, key and iv as byte arrays
      key = expandKey(GibberishAES.s2a(key));
      var numBlocks = Math.ceil(plaintext.length / 16),
        blocks = [],
        i,
        cipherBlocks = [];
      for (i = 0; i < numBlocks; i++) {
        blocks[i] = padBlock(plaintext.slice(i * 16, i * 16 + 16));
      }
      if (plaintext.length % 16 === 0) {
        blocks.push([
          16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
        ]);
        // CBC OpenSSL padding scheme
        numBlocks++;
      }
      for (i = 0; i < blocks.length; i++) {
        blocks[i] =
          i === 0
            ? xorBlocks(blocks[i], iv)
            : xorBlocks(blocks[i], cipherBlocks[i - 1]);
        cipherBlocks[i] = encryptBlock(blocks[i], key);
      }
      return GibberishAES.Base64.encode(cipherBlocks);
    },
    rawDecrypt = function (cryptArr, key) {
      var iv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      //  cryptArr, key and iv as byte arrays
      key = expandKey(GibberishAES.s2a(key));
      var numBlocks = cryptArr.length / 16,
        cipherBlocks = [],
        i,
        plainBlocks = [],
        string = "";
      for (i = 0; i < numBlocks; i++) {
        cipherBlocks.push(cryptArr.slice(i * 16, (i + 1) * 16));
      }
      for (i = cipherBlocks.length - 1; i >= 0; i--) {
        plainBlocks[i] = decryptBlock(cipherBlocks[i], key);
        plainBlocks[i] =
          i === 0
            ? xorBlocks(plainBlocks[i], iv)
            : xorBlocks(plainBlocks[i], cipherBlocks[i - 1]);
      }
      for (i = 0; i < numBlocks - 1; i++) {
        string += block2s(plainBlocks[i]);
      }
      string += block2s(plainBlocks[i], true);

      return dec_utf8(string);
      //return binary ? string : dec_utf8(string);
    },
    aesEncrypt = function (plaintext, key) {
      var rtnVal = "";
      plaintext = GibberishAES.s2a(plaintext);
      var iv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      // plaintext, key and iv as byte arrays
      key = expandKey(GibberishAES.s2a(key));
      var numBlocks = Math.ceil(plaintext.length / 16),
        blocks = [],
        i,
        cipherBlocks = [];
      for (i = 0; i < numBlocks; i++) {
        blocks[i] = padBlock(plaintext.slice(i * 16, i * 16 + 16));
      }
      if (plaintext.length % 16 === 0) {
        blocks.push([
          16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
        ]);
        // CBC OpenSSL padding scheme
        numBlocks++;
      }
      for (i = 0; i < blocks.length; i++) {
        blocks[i] =
          i === 0
            ? xorBlocks(blocks[i], iv)
            : xorBlocks(blocks[i], cipherBlocks[i - 1]);
        cipherBlocks[i] = encryptBlock(blocks[i], key);
      }
      rtnVal = GibberishAES.Base64.encode(cipherBlocks);

      return rtnVal.toString().replace("\n", "");
    },
    aesDecrypt = function (base64Text, key) {
      var cryptArr = GibberishAES.Base64.decode(base64Text);
      var iv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      //  cryptArr, key and iv as byte arrays
      key = expandKey(GibberishAES.s2a(key));
      var numBlocks = cryptArr.length / 16,
        cipherBlocks = [],
        i,
        plainBlocks = [],
        string = "";
      for (i = 0; i < numBlocks; i++) {
        cipherBlocks.push(cryptArr.slice(i * 16, (i + 1) * 16));
      }
      for (i = cipherBlocks.length - 1; i >= 0; i--) {
        plainBlocks[i] = decryptBlock(cipherBlocks[i], key);
        plainBlocks[i] =
          i === 0
            ? xorBlocks(plainBlocks[i], iv)
            : xorBlocks(plainBlocks[i], cipherBlocks[i - 1]);
      }
      for (i = 0; i < numBlocks - 1; i++) {
        string += block2s(plainBlocks[i]);
      }
      string += block2s(plainBlocks[i], true);

      return dec_utf8(string);
      //return binary ? string : dec_utf8(string);
    },
    encryptBlock = function (block, words) {
      Decrypt = false;
      var state = addRoundKey(block, words, 0),
        round;
      for (round = 1; round < Nr + 1; round++) {
        state = subBytes(state);
        state = shiftRows(state);
        if (round < Nr) {
          state = mixColumns(state);
        }
        //last round? don't mixColumns
        state = addRoundKey(state, words, round);
      }

      return state;
    },
    decryptBlock = function (block, words) {
      Decrypt = true;
      var state = addRoundKey(block, words, Nr),
        round;
      for (round = Nr - 1; round > -1; round--) {
        state = shiftRows(state);
        state = subBytes(state);
        state = addRoundKey(state, words, round);
        if (round > 0) {
          state = mixColumns(state);
        }
        //last round? don't mixColumns
      }

      return state;
    },
    subBytes = function (state) {
      var S = Decrypt ? SBoxInv : SBox,
        temp = [],
        i;
      for (i = 0; i < 16; i++) {
        temp[i] = S[state[i]];
      }
      return temp;
    },
    shiftRows = function (state) {
      var temp = [],
        shiftBy = Decrypt
          ? [0, 13, 10, 7, 4, 1, 14, 11, 8, 5, 2, 15, 12, 9, 6, 3]
          : [0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 1, 6, 11],
        i;
      for (i = 0; i < 16; i++) {
        temp[i] = state[shiftBy[i]];
      }
      return temp;
    },
    mixColumns = function (state) {
      var t = [],
        c;
      if (!Decrypt) {
        for (c = 0; c < 4; c++) {
          t[c * 4] =
            G2X[state[c * 4]] ^
            G3X[state[1 + c * 4]] ^
            state[2 + c * 4] ^
            state[3 + c * 4];
          t[1 + c * 4] =
            state[c * 4] ^
            G2X[state[1 + c * 4]] ^
            G3X[state[2 + c * 4]] ^
            state[3 + c * 4];
          t[2 + c * 4] =
            state[c * 4] ^
            state[1 + c * 4] ^
            G2X[state[2 + c * 4]] ^
            G3X[state[3 + c * 4]];
          t[3 + c * 4] =
            G3X[state[c * 4]] ^
            state[1 + c * 4] ^
            state[2 + c * 4] ^
            G2X[state[3 + c * 4]];
        }
      } else {
        for (c = 0; c < 4; c++) {
          t[c * 4] =
            GEX[state[c * 4]] ^
            GBX[state[1 + c * 4]] ^
            GDX[state[2 + c * 4]] ^
            G9X[state[3 + c * 4]];
          t[1 + c * 4] =
            G9X[state[c * 4]] ^
            GEX[state[1 + c * 4]] ^
            GBX[state[2 + c * 4]] ^
            GDX[state[3 + c * 4]];
          t[2 + c * 4] =
            GDX[state[c * 4]] ^
            G9X[state[1 + c * 4]] ^
            GEX[state[2 + c * 4]] ^
            GBX[state[3 + c * 4]];
          t[3 + c * 4] =
            GBX[state[c * 4]] ^
            GDX[state[1 + c * 4]] ^
            G9X[state[2 + c * 4]] ^
            GEX[state[3 + c * 4]];
        }
      }

      return t;
    },
    addRoundKey = function (state, words, round) {
      var temp = [],
        i;
      for (i = 0; i < 16; i++) {
        temp[i] = state[i] ^ words[round][i];
      }
      return temp;
    },
    xorBlocks = function (block1, block2) {
      var temp = [],
        i;
      for (i = 0; i < 16; i++) {
        temp[i] = block1[i] ^ block2[i];
      }
      return temp;
    },
    expandKey = function (key) {
      // Expects a 1d number array
      var w = [],
        temp = [],
        i,
        r,
        t,
        flat = [],
        j;

      for (i = 0; i < Nk; i++) {
        r = [key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]];
        w[i] = r;
      }

      for (i = Nk; i < 4 * (Nr + 1); i++) {
        w[i] = [];
        for (t = 0; t < 4; t++) {
          temp[t] = w[i - 1][t];
        }
        if (i % Nk === 0) {
          temp = subWord(rotWord(temp));
          temp[0] ^= Rcon[i / Nk - 1];
        } else if (Nk > 6 && i % Nk == 4) {
          temp = subWord(temp);
        }
        for (t = 0; t < 4; t++) {
          w[i][t] = w[i - Nk][t] ^ temp[t];
        }
      }
      for (i = 0; i < Nr + 1; i++) {
        flat[i] = [];
        for (j = 0; j < 4; j++) {
          flat[i].push(
            w[i * 4 + j][0],
            w[i * 4 + j][1],
            w[i * 4 + j][2],
            w[i * 4 + j][3]
          );
        }
      }
      return flat;
    },
    subWord = function (w) {
      // apply SBox to 4-byte word w
      for (var i = 0; i < 4; i++) {
        w[i] = SBox[w[i]];
      }
      return w;
    },
    rotWord = function (w) {
      // rotate 4-byte word w left by one byte
      var tmp = w[0],
        i;
      for (i = 0; i < 4; i++) {
        w[i] = w[i + 1];
      }
      w[3] = tmp;
      return w;
    },
    // S-box
    SBox = [
      99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118,
      202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114,
      192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49,
      21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117,
      9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83,
      209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208,
      239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81,
      163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210,
      205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115,
      96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219,
      224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121,
      231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8,
      186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138,
      112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158,
      225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40,
      223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187,
      22,
    ],
    // Precomputed lookup table for the inverse SBox
    SBoxInv = [
      82, 9, 106, 213, 48, 54, 165, 56, 191, 64, 163, 158, 129, 243, 215, 251,
      124, 227, 57, 130, 155, 47, 255, 135, 52, 142, 67, 68, 196, 222, 233, 203,
      84, 123, 148, 50, 166, 194, 35, 61, 238, 76, 149, 11, 66, 250, 195, 78, 8,
      46, 161, 102, 40, 217, 36, 178, 118, 91, 162, 73, 109, 139, 209, 37, 114,
      248, 246, 100, 134, 104, 152, 22, 212, 164, 92, 204, 93, 101, 182, 146,
      108, 112, 72, 80, 253, 237, 185, 218, 94, 21, 70, 87, 167, 141, 157, 132,
      144, 216, 171, 0, 140, 188, 211, 10, 247, 228, 88, 5, 184, 179, 69, 6,
      208, 44, 30, 143, 202, 63, 15, 2, 193, 175, 189, 3, 1, 19, 138, 107, 58,
      145, 17, 65, 79, 103, 220, 234, 151, 242, 207, 206, 240, 180, 230, 115,
      150, 172, 116, 34, 231, 173, 53, 133, 226, 249, 55, 232, 28, 117, 223,
      110, 71, 241, 26, 113, 29, 41, 197, 137, 111, 183, 98, 14, 170, 24, 190,
      27, 252, 86, 62, 75, 198, 210, 121, 32, 154, 219, 192, 254, 120, 205, 90,
      244, 31, 221, 168, 51, 136, 7, 199, 49, 177, 18, 16, 89, 39, 128, 236, 95,
      96, 81, 127, 169, 25, 181, 74, 13, 45, 229, 122, 159, 147, 201, 156, 239,
      160, 224, 59, 77, 174, 42, 245, 176, 200, 235, 187, 60, 131, 83, 153, 97,
      23, 43, 4, 126, 186, 119, 214, 38, 225, 105, 20, 99, 85, 33, 12, 125,
    ],
    // Rijndael Rcon
    Rcon = [
      1, 2, 4, 8, 16, 32, 64, 128, 27, 54, 108, 216, 171, 77, 154, 47, 94, 188,
      99, 198, 151, 53, 106, 212, 179, 125, 250, 239, 197, 145,
    ],
    G2X = [
      0x00, 0x02, 0x04, 0x06, 0x08, 0x0a, 0x0c, 0x0e, 0x10, 0x12, 0x14, 0x16,
      0x18, 0x1a, 0x1c, 0x1e, 0x20, 0x22, 0x24, 0x26, 0x28, 0x2a, 0x2c, 0x2e,
      0x30, 0x32, 0x34, 0x36, 0x38, 0x3a, 0x3c, 0x3e, 0x40, 0x42, 0x44, 0x46,
      0x48, 0x4a, 0x4c, 0x4e, 0x50, 0x52, 0x54, 0x56, 0x58, 0x5a, 0x5c, 0x5e,
      0x60, 0x62, 0x64, 0x66, 0x68, 0x6a, 0x6c, 0x6e, 0x70, 0x72, 0x74, 0x76,
      0x78, 0x7a, 0x7c, 0x7e, 0x80, 0x82, 0x84, 0x86, 0x88, 0x8a, 0x8c, 0x8e,
      0x90, 0x92, 0x94, 0x96, 0x98, 0x9a, 0x9c, 0x9e, 0xa0, 0xa2, 0xa4, 0xa6,
      0xa8, 0xaa, 0xac, 0xae, 0xb0, 0xb2, 0xb4, 0xb6, 0xb8, 0xba, 0xbc, 0xbe,
      0xc0, 0xc2, 0xc4, 0xc6, 0xc8, 0xca, 0xcc, 0xce, 0xd0, 0xd2, 0xd4, 0xd6,
      0xd8, 0xda, 0xdc, 0xde, 0xe0, 0xe2, 0xe4, 0xe6, 0xe8, 0xea, 0xec, 0xee,
      0xf0, 0xf2, 0xf4, 0xf6, 0xf8, 0xfa, 0xfc, 0xfe, 0x1b, 0x19, 0x1f, 0x1d,
      0x13, 0x11, 0x17, 0x15, 0x0b, 0x09, 0x0f, 0x0d, 0x03, 0x01, 0x07, 0x05,
      0x3b, 0x39, 0x3f, 0x3d, 0x33, 0x31, 0x37, 0x35, 0x2b, 0x29, 0x2f, 0x2d,
      0x23, 0x21, 0x27, 0x25, 0x5b, 0x59, 0x5f, 0x5d, 0x53, 0x51, 0x57, 0x55,
      0x4b, 0x49, 0x4f, 0x4d, 0x43, 0x41, 0x47, 0x45, 0x7b, 0x79, 0x7f, 0x7d,
      0x73, 0x71, 0x77, 0x75, 0x6b, 0x69, 0x6f, 0x6d, 0x63, 0x61, 0x67, 0x65,
      0x9b, 0x99, 0x9f, 0x9d, 0x93, 0x91, 0x97, 0x95, 0x8b, 0x89, 0x8f, 0x8d,
      0x83, 0x81, 0x87, 0x85, 0xbb, 0xb9, 0xbf, 0xbd, 0xb3, 0xb1, 0xb7, 0xb5,
      0xab, 0xa9, 0xaf, 0xad, 0xa3, 0xa1, 0xa7, 0xa5, 0xdb, 0xd9, 0xdf, 0xdd,
      0xd3, 0xd1, 0xd7, 0xd5, 0xcb, 0xc9, 0xcf, 0xcd, 0xc3, 0xc1, 0xc7, 0xc5,
      0xfb, 0xf9, 0xff, 0xfd, 0xf3, 0xf1, 0xf7, 0xf5, 0xeb, 0xe9, 0xef, 0xed,
      0xe3, 0xe1, 0xe7, 0xe5,
    ],
    G3X = [
      0x00, 0x03, 0x06, 0x05, 0x0c, 0x0f, 0x0a, 0x09, 0x18, 0x1b, 0x1e, 0x1d,
      0x14, 0x17, 0x12, 0x11, 0x30, 0x33, 0x36, 0x35, 0x3c, 0x3f, 0x3a, 0x39,
      0x28, 0x2b, 0x2e, 0x2d, 0x24, 0x27, 0x22, 0x21, 0x60, 0x63, 0x66, 0x65,
      0x6c, 0x6f, 0x6a, 0x69, 0x78, 0x7b, 0x7e, 0x7d, 0x74, 0x77, 0x72, 0x71,
      0x50, 0x53, 0x56, 0x55, 0x5c, 0x5f, 0x5a, 0x59, 0x48, 0x4b, 0x4e, 0x4d,
      0x44, 0x47, 0x42, 0x41, 0xc0, 0xc3, 0xc6, 0xc5, 0xcc, 0xcf, 0xca, 0xc9,
      0xd8, 0xdb, 0xde, 0xdd, 0xd4, 0xd7, 0xd2, 0xd1, 0xf0, 0xf3, 0xf6, 0xf5,
      0xfc, 0xff, 0xfa, 0xf9, 0xe8, 0xeb, 0xee, 0xed, 0xe4, 0xe7, 0xe2, 0xe1,
      0xa0, 0xa3, 0xa6, 0xa5, 0xac, 0xaf, 0xaa, 0xa9, 0xb8, 0xbb, 0xbe, 0xbd,
      0xb4, 0xb7, 0xb2, 0xb1, 0x90, 0x93, 0x96, 0x95, 0x9c, 0x9f, 0x9a, 0x99,
      0x88, 0x8b, 0x8e, 0x8d, 0x84, 0x87, 0x82, 0x81, 0x9b, 0x98, 0x9d, 0x9e,
      0x97, 0x94, 0x91, 0x92, 0x83, 0x80, 0x85, 0x86, 0x8f, 0x8c, 0x89, 0x8a,
      0xab, 0xa8, 0xad, 0xae, 0xa7, 0xa4, 0xa1, 0xa2, 0xb3, 0xb0, 0xb5, 0xb6,
      0xbf, 0xbc, 0xb9, 0xba, 0xfb, 0xf8, 0xfd, 0xfe, 0xf7, 0xf4, 0xf1, 0xf2,
      0xe3, 0xe0, 0xe5, 0xe6, 0xef, 0xec, 0xe9, 0xea, 0xcb, 0xc8, 0xcd, 0xce,
      0xc7, 0xc4, 0xc1, 0xc2, 0xd3, 0xd0, 0xd5, 0xd6, 0xdf, 0xdc, 0xd9, 0xda,
      0x5b, 0x58, 0x5d, 0x5e, 0x57, 0x54, 0x51, 0x52, 0x43, 0x40, 0x45, 0x46,
      0x4f, 0x4c, 0x49, 0x4a, 0x6b, 0x68, 0x6d, 0x6e, 0x67, 0x64, 0x61, 0x62,
      0x73, 0x70, 0x75, 0x76, 0x7f, 0x7c, 0x79, 0x7a, 0x3b, 0x38, 0x3d, 0x3e,
      0x37, 0x34, 0x31, 0x32, 0x23, 0x20, 0x25, 0x26, 0x2f, 0x2c, 0x29, 0x2a,
      0x0b, 0x08, 0x0d, 0x0e, 0x07, 0x04, 0x01, 0x02, 0x13, 0x10, 0x15, 0x16,
      0x1f, 0x1c, 0x19, 0x1a,
    ],
    G9X = [
      0x00, 0x09, 0x12, 0x1b, 0x24, 0x2d, 0x36, 0x3f, 0x48, 0x41, 0x5a, 0x53,
      0x6c, 0x65, 0x7e, 0x77, 0x90, 0x99, 0x82, 0x8b, 0xb4, 0xbd, 0xa6, 0xaf,
      0xd8, 0xd1, 0xca, 0xc3, 0xfc, 0xf5, 0xee, 0xe7, 0x3b, 0x32, 0x29, 0x20,
      0x1f, 0x16, 0x0d, 0x04, 0x73, 0x7a, 0x61, 0x68, 0x57, 0x5e, 0x45, 0x4c,
      0xab, 0xa2, 0xb9, 0xb0, 0x8f, 0x86, 0x9d, 0x94, 0xe3, 0xea, 0xf1, 0xf8,
      0xc7, 0xce, 0xd5, 0xdc, 0x76, 0x7f, 0x64, 0x6d, 0x52, 0x5b, 0x40, 0x49,
      0x3e, 0x37, 0x2c, 0x25, 0x1a, 0x13, 0x08, 0x01, 0xe6, 0xef, 0xf4, 0xfd,
      0xc2, 0xcb, 0xd0, 0xd9, 0xae, 0xa7, 0xbc, 0xb5, 0x8a, 0x83, 0x98, 0x91,
      0x4d, 0x44, 0x5f, 0x56, 0x69, 0x60, 0x7b, 0x72, 0x05, 0x0c, 0x17, 0x1e,
      0x21, 0x28, 0x33, 0x3a, 0xdd, 0xd4, 0xcf, 0xc6, 0xf9, 0xf0, 0xeb, 0xe2,
      0x95, 0x9c, 0x87, 0x8e, 0xb1, 0xb8, 0xa3, 0xaa, 0xec, 0xe5, 0xfe, 0xf7,
      0xc8, 0xc1, 0xda, 0xd3, 0xa4, 0xad, 0xb6, 0xbf, 0x80, 0x89, 0x92, 0x9b,
      0x7c, 0x75, 0x6e, 0x67, 0x58, 0x51, 0x4a, 0x43, 0x34, 0x3d, 0x26, 0x2f,
      0x10, 0x19, 0x02, 0x0b, 0xd7, 0xde, 0xc5, 0xcc, 0xf3, 0xfa, 0xe1, 0xe8,
      0x9f, 0x96, 0x8d, 0x84, 0xbb, 0xb2, 0xa9, 0xa0, 0x47, 0x4e, 0x55, 0x5c,
      0x63, 0x6a, 0x71, 0x78, 0x0f, 0x06, 0x1d, 0x14, 0x2b, 0x22, 0x39, 0x30,
      0x9a, 0x93, 0x88, 0x81, 0xbe, 0xb7, 0xac, 0xa5, 0xd2, 0xdb, 0xc0, 0xc9,
      0xf6, 0xff, 0xe4, 0xed, 0x0a, 0x03, 0x18, 0x11, 0x2e, 0x27, 0x3c, 0x35,
      0x42, 0x4b, 0x50, 0x59, 0x66, 0x6f, 0x74, 0x7d, 0xa1, 0xa8, 0xb3, 0xba,
      0x85, 0x8c, 0x97, 0x9e, 0xe9, 0xe0, 0xfb, 0xf2, 0xcd, 0xc4, 0xdf, 0xd6,
      0x31, 0x38, 0x23, 0x2a, 0x15, 0x1c, 0x07, 0x0e, 0x79, 0x70, 0x6b, 0x62,
      0x5d, 0x54, 0x4f, 0x46,
    ],
    GBX = [
      0x00, 0x0b, 0x16, 0x1d, 0x2c, 0x27, 0x3a, 0x31, 0x58, 0x53, 0x4e, 0x45,
      0x74, 0x7f, 0x62, 0x69, 0xb0, 0xbb, 0xa6, 0xad, 0x9c, 0x97, 0x8a, 0x81,
      0xe8, 0xe3, 0xfe, 0xf5, 0xc4, 0xcf, 0xd2, 0xd9, 0x7b, 0x70, 0x6d, 0x66,
      0x57, 0x5c, 0x41, 0x4a, 0x23, 0x28, 0x35, 0x3e, 0x0f, 0x04, 0x19, 0x12,
      0xcb, 0xc0, 0xdd, 0xd6, 0xe7, 0xec, 0xf1, 0xfa, 0x93, 0x98, 0x85, 0x8e,
      0xbf, 0xb4, 0xa9, 0xa2, 0xf6, 0xfd, 0xe0, 0xeb, 0xda, 0xd1, 0xcc, 0xc7,
      0xae, 0xa5, 0xb8, 0xb3, 0x82, 0x89, 0x94, 0x9f, 0x46, 0x4d, 0x50, 0x5b,
      0x6a, 0x61, 0x7c, 0x77, 0x1e, 0x15, 0x08, 0x03, 0x32, 0x39, 0x24, 0x2f,
      0x8d, 0x86, 0x9b, 0x90, 0xa1, 0xaa, 0xb7, 0xbc, 0xd5, 0xde, 0xc3, 0xc8,
      0xf9, 0xf2, 0xef, 0xe4, 0x3d, 0x36, 0x2b, 0x20, 0x11, 0x1a, 0x07, 0x0c,
      0x65, 0x6e, 0x73, 0x78, 0x49, 0x42, 0x5f, 0x54, 0xf7, 0xfc, 0xe1, 0xea,
      0xdb, 0xd0, 0xcd, 0xc6, 0xaf, 0xa4, 0xb9, 0xb2, 0x83, 0x88, 0x95, 0x9e,
      0x47, 0x4c, 0x51, 0x5a, 0x6b, 0x60, 0x7d, 0x76, 0x1f, 0x14, 0x09, 0x02,
      0x33, 0x38, 0x25, 0x2e, 0x8c, 0x87, 0x9a, 0x91, 0xa0, 0xab, 0xb6, 0xbd,
      0xd4, 0xdf, 0xc2, 0xc9, 0xf8, 0xf3, 0xee, 0xe5, 0x3c, 0x37, 0x2a, 0x21,
      0x10, 0x1b, 0x06, 0x0d, 0x64, 0x6f, 0x72, 0x79, 0x48, 0x43, 0x5e, 0x55,
      0x01, 0x0a, 0x17, 0x1c, 0x2d, 0x26, 0x3b, 0x30, 0x59, 0x52, 0x4f, 0x44,
      0x75, 0x7e, 0x63, 0x68, 0xb1, 0xba, 0xa7, 0xac, 0x9d, 0x96, 0x8b, 0x80,
      0xe9, 0xe2, 0xff, 0xf4, 0xc5, 0xce, 0xd3, 0xd8, 0x7a, 0x71, 0x6c, 0x67,
      0x56, 0x5d, 0x40, 0x4b, 0x22, 0x29, 0x34, 0x3f, 0x0e, 0x05, 0x18, 0x13,
      0xca, 0xc1, 0xdc, 0xd7, 0xe6, 0xed, 0xf0, 0xfb, 0x92, 0x99, 0x84, 0x8f,
      0xbe, 0xb5, 0xa8, 0xa3,
    ],
    GDX = [
      0x00, 0x0d, 0x1a, 0x17, 0x34, 0x39, 0x2e, 0x23, 0x68, 0x65, 0x72, 0x7f,
      0x5c, 0x51, 0x46, 0x4b, 0xd0, 0xdd, 0xca, 0xc7, 0xe4, 0xe9, 0xfe, 0xf3,
      0xb8, 0xb5, 0xa2, 0xaf, 0x8c, 0x81, 0x96, 0x9b, 0xbb, 0xb6, 0xa1, 0xac,
      0x8f, 0x82, 0x95, 0x98, 0xd3, 0xde, 0xc9, 0xc4, 0xe7, 0xea, 0xfd, 0xf0,
      0x6b, 0x66, 0x71, 0x7c, 0x5f, 0x52, 0x45, 0x48, 0x03, 0x0e, 0x19, 0x14,
      0x37, 0x3a, 0x2d, 0x20, 0x6d, 0x60, 0x77, 0x7a, 0x59, 0x54, 0x43, 0x4e,
      0x05, 0x08, 0x1f, 0x12, 0x31, 0x3c, 0x2b, 0x26, 0xbd, 0xb0, 0xa7, 0xaa,
      0x89, 0x84, 0x93, 0x9e, 0xd5, 0xd8, 0xcf, 0xc2, 0xe1, 0xec, 0xfb, 0xf6,
      0xd6, 0xdb, 0xcc, 0xc1, 0xe2, 0xef, 0xf8, 0xf5, 0xbe, 0xb3, 0xa4, 0xa9,
      0x8a, 0x87, 0x90, 0x9d, 0x06, 0x0b, 0x1c, 0x11, 0x32, 0x3f, 0x28, 0x25,
      0x6e, 0x63, 0x74, 0x79, 0x5a, 0x57, 0x40, 0x4d, 0xda, 0xd7, 0xc0, 0xcd,
      0xee, 0xe3, 0xf4, 0xf9, 0xb2, 0xbf, 0xa8, 0xa5, 0x86, 0x8b, 0x9c, 0x91,
      0x0a, 0x07, 0x10, 0x1d, 0x3e, 0x33, 0x24, 0x29, 0x62, 0x6f, 0x78, 0x75,
      0x56, 0x5b, 0x4c, 0x41, 0x61, 0x6c, 0x7b, 0x76, 0x55, 0x58, 0x4f, 0x42,
      0x09, 0x04, 0x13, 0x1e, 0x3d, 0x30, 0x27, 0x2a, 0xb1, 0xbc, 0xab, 0xa6,
      0x85, 0x88, 0x9f, 0x92, 0xd9, 0xd4, 0xc3, 0xce, 0xed, 0xe0, 0xf7, 0xfa,
      0xb7, 0xba, 0xad, 0xa0, 0x83, 0x8e, 0x99, 0x94, 0xdf, 0xd2, 0xc5, 0xc8,
      0xeb, 0xe6, 0xf1, 0xfc, 0x67, 0x6a, 0x7d, 0x70, 0x53, 0x5e, 0x49, 0x44,
      0x0f, 0x02, 0x15, 0x18, 0x3b, 0x36, 0x21, 0x2c, 0x0c, 0x01, 0x16, 0x1b,
      0x38, 0x35, 0x22, 0x2f, 0x64, 0x69, 0x7e, 0x73, 0x50, 0x5d, 0x4a, 0x47,
      0xdc, 0xd1, 0xc6, 0xcb, 0xe8, 0xe5, 0xf2, 0xff, 0xb4, 0xb9, 0xae, 0xa3,
      0x80, 0x8d, 0x9a, 0x97,
    ],
    GEX = [
      0x00, 0x0e, 0x1c, 0x12, 0x38, 0x36, 0x24, 0x2a, 0x70, 0x7e, 0x6c, 0x62,
      0x48, 0x46, 0x54, 0x5a, 0xe0, 0xee, 0xfc, 0xf2, 0xd8, 0xd6, 0xc4, 0xca,
      0x90, 0x9e, 0x8c, 0x82, 0xa8, 0xa6, 0xb4, 0xba, 0xdb, 0xd5, 0xc7, 0xc9,
      0xe3, 0xed, 0xff, 0xf1, 0xab, 0xa5, 0xb7, 0xb9, 0x93, 0x9d, 0x8f, 0x81,
      0x3b, 0x35, 0x27, 0x29, 0x03, 0x0d, 0x1f, 0x11, 0x4b, 0x45, 0x57, 0x59,
      0x73, 0x7d, 0x6f, 0x61, 0xad, 0xa3, 0xb1, 0xbf, 0x95, 0x9b, 0x89, 0x87,
      0xdd, 0xd3, 0xc1, 0xcf, 0xe5, 0xeb, 0xf9, 0xf7, 0x4d, 0x43, 0x51, 0x5f,
      0x75, 0x7b, 0x69, 0x67, 0x3d, 0x33, 0x21, 0x2f, 0x05, 0x0b, 0x19, 0x17,
      0x76, 0x78, 0x6a, 0x64, 0x4e, 0x40, 0x52, 0x5c, 0x06, 0x08, 0x1a, 0x14,
      0x3e, 0x30, 0x22, 0x2c, 0x96, 0x98, 0x8a, 0x84, 0xae, 0xa0, 0xb2, 0xbc,
      0xe6, 0xe8, 0xfa, 0xf4, 0xde, 0xd0, 0xc2, 0xcc, 0x41, 0x4f, 0x5d, 0x53,
      0x79, 0x77, 0x65, 0x6b, 0x31, 0x3f, 0x2d, 0x23, 0x09, 0x07, 0x15, 0x1b,
      0xa1, 0xaf, 0xbd, 0xb3, 0x99, 0x97, 0x85, 0x8b, 0xd1, 0xdf, 0xcd, 0xc3,
      0xe9, 0xe7, 0xf5, 0xfb, 0x9a, 0x94, 0x86, 0x88, 0xa2, 0xac, 0xbe, 0xb0,
      0xea, 0xe4, 0xf6, 0xf8, 0xd2, 0xdc, 0xce, 0xc0, 0x7a, 0x74, 0x66, 0x68,
      0x42, 0x4c, 0x5e, 0x50, 0x0a, 0x04, 0x16, 0x18, 0x32, 0x3c, 0x2e, 0x20,
      0xec, 0xe2, 0xf0, 0xfe, 0xd4, 0xda, 0xc8, 0xc6, 0x9c, 0x92, 0x80, 0x8e,
      0xa4, 0xaa, 0xb8, 0xb6, 0x0c, 0x02, 0x10, 0x1e, 0x34, 0x3a, 0x28, 0x26,
      0x7c, 0x72, 0x60, 0x6e, 0x44, 0x4a, 0x58, 0x56, 0x37, 0x39, 0x2b, 0x25,
      0x0f, 0x01, 0x13, 0x1d, 0x47, 0x49, 0x5b, 0x55, 0x7f, 0x71, 0x63, 0x6d,
      0xd7, 0xd9, 0xcb, 0xc5, 0xef, 0xe1, 0xf3, 0xfd, 0xa7, 0xa9, 0xbb, 0xb5,
      0x9f, 0x91, 0x83, 0x8d,
    ],
    enc = function (string, pass, binary) {
      // string, password in plaintext
      var salt = randArr(8),
        pbe = openSSLKey(s2a(pass, binary), salt),
        key = pbe.key,
        iv = pbe.iv,
        cipherBlocks,
        saltBlock = [[83, 97, 108, 116, 101, 100, 95, 95].concat(salt)];
      string = s2a(string, binary);
      cipherBlocks = rawEncrypt(string, key, iv);
      // Spells out 'Salted__'
      cipherBlocks = saltBlock.concat(cipherBlocks);
      return Base64.encode(cipherBlocks);
    },
    dec = function (string, pass, binary) {
      // string, password in plaintext
      var cryptArr = Base64.decode(string),
        salt = cryptArr.slice(8, 16),
        pbe = openSSLKey(s2a(pass, binary), salt),
        key = pbe.key,
        iv = pbe.iv;
      cryptArr = cryptArr.slice(16, cryptArr.length);
      // Take off the Salted__ffeeddcc
      string = rawDecrypt(cryptArr, key, iv, binary);
      return string;
    },
    MD5 = function (numArr) {
      function rotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
      }

      function addUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = lX & 0x80000000;
        lY8 = lY & 0x80000000;
        lX4 = lX & 0x40000000;
        lY4 = lY & 0x40000000;
        lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
        if (lX4 & lY4) {
          return lResult ^ 0x80000000 ^ lX8 ^ lY8;
        }
        if (lX4 | lY4) {
          if (lResult & 0x40000000) {
            return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
          } else {
            return lResult ^ 0x40000000 ^ lX8 ^ lY8;
          }
        } else {
          return lResult ^ lX8 ^ lY8;
        }
      }

      function f(x, y, z) {
        return (x & y) | (~x & z);
      }
      function g(x, y, z) {
        return (x & z) | (y & ~z);
      }
      function h(x, y, z) {
        return x ^ y ^ z;
      }
      function funcI(x, y, z) {
        return y ^ (x | ~z);
      }

      function ff(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(f(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      }

      function gg(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(g(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      }

      function hh(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(h(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      }

      function ii(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(funcI(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      }

      function convertToWordArray(numArr) {
        var lWordCount,
          lMessageLength = numArr.length,
          lNumberOfWords_temp1 = lMessageLength + 8,
          lNumberOfWords_temp2 =
            (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64,
          lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16,
          lWordArray = [],
          lBytePosition = 0,
          lByteCount = 0;
        while (lByteCount < lMessageLength) {
          lWordCount = (lByteCount - (lByteCount % 4)) / 4;
          lBytePosition = (lByteCount % 4) * 8;
          lWordArray[lWordCount] =
            lWordArray[lWordCount] | (numArr[lByteCount] << lBytePosition);
          lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] =
          lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
      }

      function wordToHex(lValue) {
        var lByte,
          lCount,
          wordToHexArr = [];
        for (lCount = 0; lCount <= 3; lCount++) {
          lByte = (lValue >>> (lCount * 8)) & 255;
          wordToHexArr = wordToHexArr.concat(lByte);
        }
        return wordToHexArr;
      }

      /*function utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "",
            n,
            c;

            for (n = 0; n < string.length; n++) {

                c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        }*/

      var x = [],
        k,
        AA,
        BB,
        CC,
        DD,
        a,
        b,
        c,
        d,
        S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22,
        S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20,
        S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23,
        S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;

      x = convertToWordArray(numArr);

      a = 0x67452301;
      b = 0xefcdab89;
      c = 0x98badcfe;
      d = 0x10325476;

      for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = ff(a, b, c, d, x[k + 0], S11, 0xd76aa478);
        d = ff(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
        c = ff(c, d, a, b, x[k + 2], S13, 0x242070db);
        b = ff(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
        a = ff(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
        d = ff(d, a, b, c, x[k + 5], S12, 0x4787c62a);
        c = ff(c, d, a, b, x[k + 6], S13, 0xa8304613);
        b = ff(b, c, d, a, x[k + 7], S14, 0xfd469501);
        a = ff(a, b, c, d, x[k + 8], S11, 0x698098d8);
        d = ff(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
        c = ff(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
        b = ff(b, c, d, a, x[k + 11], S14, 0x895cd7be);
        a = ff(a, b, c, d, x[k + 12], S11, 0x6b901122);
        d = ff(d, a, b, c, x[k + 13], S12, 0xfd987193);
        c = ff(c, d, a, b, x[k + 14], S13, 0xa679438e);
        b = ff(b, c, d, a, x[k + 15], S14, 0x49b40821);
        a = gg(a, b, c, d, x[k + 1], S21, 0xf61e2562);
        d = gg(d, a, b, c, x[k + 6], S22, 0xc040b340);
        c = gg(c, d, a, b, x[k + 11], S23, 0x265e5a51);
        b = gg(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
        a = gg(a, b, c, d, x[k + 5], S21, 0xd62f105d);
        d = gg(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = gg(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
        b = gg(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
        a = gg(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
        d = gg(d, a, b, c, x[k + 14], S22, 0xc33707d6);
        c = gg(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
        b = gg(b, c, d, a, x[k + 8], S24, 0x455a14ed);
        a = gg(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
        d = gg(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
        c = gg(c, d, a, b, x[k + 7], S23, 0x676f02d9);
        b = gg(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
        a = hh(a, b, c, d, x[k + 5], S31, 0xfffa3942);
        d = hh(d, a, b, c, x[k + 8], S32, 0x8771f681);
        c = hh(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
        b = hh(b, c, d, a, x[k + 14], S34, 0xfde5380c);
        a = hh(a, b, c, d, x[k + 1], S31, 0xa4beea44);
        d = hh(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
        c = hh(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
        b = hh(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
        a = hh(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
        d = hh(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
        c = hh(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
        b = hh(b, c, d, a, x[k + 6], S34, 0x4881d05);
        a = hh(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
        d = hh(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
        c = hh(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
        b = hh(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
        a = ii(a, b, c, d, x[k + 0], S41, 0xf4292244);
        d = ii(d, a, b, c, x[k + 7], S42, 0x432aff97);
        c = ii(c, d, a, b, x[k + 14], S43, 0xab9423a7);
        b = ii(b, c, d, a, x[k + 5], S44, 0xfc93a039);
        a = ii(a, b, c, d, x[k + 12], S41, 0x655b59c3);
        d = ii(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
        c = ii(c, d, a, b, x[k + 10], S43, 0xffeff47d);
        b = ii(b, c, d, a, x[k + 1], S44, 0x85845dd1);
        a = ii(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
        d = ii(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
        c = ii(c, d, a, b, x[k + 6], S43, 0xa3014314);
        b = ii(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
        a = ii(a, b, c, d, x[k + 4], S41, 0xf7537e82);
        d = ii(d, a, b, c, x[k + 11], S42, 0xbd3af235);
        c = ii(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
        b = ii(b, c, d, a, x[k + 9], S44, 0xeb86d391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
      }

      return wordToHex(a).concat(wordToHex(b), wordToHex(c), wordToHex(d));
    },
    Base64 = (function () {
      var totalChunks;
      // Takes a Nx16x1 byte array and converts it to Base64
      var _chars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        chars = _chars.split(""),
        encode = function (b, withBreaks) {
          var flatArr = [],
            b64 = "",
            i,
            broken_b64;
          totalChunks = Math.floor((b.length * 16) / 3);
          for (i = 0; i < b.length * 16; i++) {
            flatArr.push(b[Math.floor(i / 16)][i % 16]);
          }
          for (i = 0; i < flatArr.length; i = i + 3) {
            b64 += chars[flatArr[i] >> 2];
            b64 += chars[((flatArr[i] & 3) << 4) | (flatArr[i + 1] >> 4)];
            if (!(flatArr[i + 1] === undefined)) {
              b64 +=
                chars[((flatArr[i + 1] & 15) << 2) | (flatArr[i + 2] >> 6)];
            } else {
              b64 += "=";
            }
            if (!(flatArr[i + 2] === undefined)) {
              b64 += chars[flatArr[i + 2] & 63];
            } else {
              b64 += "=";
            }
          }
          // OpenSSL is super particular about line breaks
          broken_b64 = b64.slice(0, 64) + "\n";
          for (i = 1; i < Math.ceil(b64.length / 64); i++) {
            broken_b64 +=
              b64.slice(i * 64, i * 64 + 64) +
              (Math.ceil(b64.length / 64) == i + 1 ? "" : "\n");
          }
          return broken_b64;
        },
        decode = function (string) {
          string = string.replace(/\n/g, "");
          var flatArr = [],
            c = [],
            b = [],
            i;
          for (i = 0; i < string.length; i = i + 4) {
            c[0] = _chars.indexOf(string.charAt(i));
            c[1] = _chars.indexOf(string.charAt(i + 1));
            c[2] = _chars.indexOf(string.charAt(i + 2));
            c[3] = _chars.indexOf(string.charAt(i + 3));

            b[0] = (c[0] << 2) | (c[1] >> 4);
            b[1] = ((c[1] & 15) << 4) | (c[2] >> 2);
            b[2] = ((c[2] & 3) << 6) | c[3];
            flatArr.push(b[0], b[1], b[2]);
          }
          flatArr = flatArr.slice(0, flatArr.length - (flatArr.length % 16));
          return flatArr;
        };

      //internet explorer
      if (typeof Array.indexOf === "function") {
        _chars = chars;
      }

      /*
        //other way to solve internet explorer problem
        if(!Array.indexOf){
            Array.prototype.indexOf = function(obj){
                for(var i=0; i<this.length; i++){
                    if(this[i]===obj){
                        return i;
                    }
                }
                return -1;
            }
        }
        */

      return {
        encode: encode,
        decode: decode,
      };
    })();

  return {
    size: size,
    h2a: h2a,
    expandKey: expandKey,
    encryptBlock: encryptBlock,
    decryptBlock: decryptBlock,
    Decrypt: Decrypt,
    s2a: s2a,
    rawEncrypt: rawEncrypt,
    aesEncrypt: aesEncrypt,
    aesDecrypt: aesDecrypt,
    dec: dec,
    openSSLKey: openSSLKey,
    a2h: a2h,
    enc: enc,
    Hash: { MD5: MD5 },
    Base64: Base64,
  };
})();
</script>
<!--//mark: 시연: style 종합복지마스터조회  -->
<style lang="scss">
.admin-layout-card-list {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  &.type-noclick {
    flex-wrap: nowrap;
    .pl-box-unit {
      flex: 1;
      cursor: auto;
    }
  }
  &-unit {
    display: flex;
    flex-direction: column;
    flex: 0 0 31%;
    justify-content: space-between;
    padding: 16px;
    background: #FFF;
    border: 1px solid #dbdbdb;
    border-radius: 5px;
    box-sizing: border-box;
    cursor: pointer;
    &-head {
      display: flex;
      align-items: self-start;
    }
    &-sub {
      display: block;
    }
    &-date {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #dbdbdb;
    }
    .pl-round-chip {
      background: #FFF;
    }
    &.active {
      background: #F5F8FF;
      border-color: var(--primary-color);
    }
  }
}
</style>

