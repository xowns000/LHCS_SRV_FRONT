<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- top title -->
      <div class="pl-sublayout-top">
        <div>
          <h1 class="pl-sublayout-top-h1">캘린더</h1>
        </div>
      </div>
      <!-- content -->
      <div class="pl-cols flex-grow-1">
        <!-- left -->
        <div class="is-col-fix is-vrt" style="width: 360px">
          <div class="pl-card">
            <v-btn
                class="pl-btn col-12 is-icon"
                @click="RegSchdl"
            >
              <span class="pl-icon20 edit-white"></span>
              일정쓰기
            </v-btn>
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
          <!-- Schedule Type select -->
          <div class="pl-card">
            <v-list>
              <v-list-item-group
                  v-model="selectedItem"
                  class="pl-full-calendar-viewbtn"
              >
                <v-list-item
                    @click="inputCalendar('all')"
                    :class="{'active' : isActive === 0}"
                >
                  <v-icon class="pl-icon20 calendar-all-view mr-2"></v-icon>
                  전체 일정 보기
                </v-list-item>
                <v-list-item @click="inputCalendar('ps')" class="mt-2">
                  <v-icon class="pl-icon20 calendar-my-view mr-2"></v-icon>
                  나의 일정 보기
                </v-list-item>
                <v-list-item @click="inputCalendar('ct')" class="mt-2">
                  <v-icon class="pl-icon20 calendar-center-view mr-2"></v-icon>
                  센터 일정 보기
                </v-list-item>
                <v-list-item @click="inputCalendar('estnl')" class="mt-2">
                  <v-icon class="pl-icon20 calendar-point-view mr-2"></v-icon>
                  중요 일정 보기
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </div>
        <!-- right -->
        <div class="is-vrt">
          <!-- toolbar -->
          <div class="d-flex align-center py-2 pr-7">
            <!-- 날짜 -->
            <div>
              <v-btn
                  v-model="isBtnClick1"
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
            <div class="ml-auto">
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
            </div>
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
                event-overlap-mode="stack"
                :day-format="getDay"
                :type="type"
                @click:event="showEvent"
                @click:more="viewDay"
                @click:date="viewDay"
                @change="mixin_getDatePeriod"
            ></v-calendar>

            <!-- Schedule detail -->
            <!--            <v-menu-->
            <!--              v-model="selectedOpen"-->
            <!--              :close-on-content-click="false"-->
            <!--              :activator="selectedElement"-->
            <!--              max-width="500px"-->
            <!--              offset-x-->
            <!--              content-class="pl-full-calendar-detail-dialog"-->
            <!--            >-->
            <!--              <div-->
            <!--                min-width="350px"-->
            <!--                max-width="500px"-->
            <!--                flat-->
            <!--              >-->
            <!--                <div class="pl-card d-flex justify-space-between" :style="`background-color: ${this.selectedEvent.color}`">-->
            <!--                  <div class="d-flex align-center">-->
            <!--                    <strong class="pl-full-calendar-detail-title">{{this.selectedEvent.name}}</strong>-->
            <!--                  </div>-->
            <!--                  <div class="pl-btn-wrap" >-->
            <!--                    &lt;!&ndash; edit 버튼 &ndash;&gt;-->
            <!--                    <compo-tooltip-btn-->
            <!--                      v-if="selectedEvent.user_id === USER_ID"-->
            <!--                      TitleProp="수정"-->
            <!--                      ClassProp="pl-tooltip-btn"-->
            <!--                      IconProp="pl-icon20 edit-white"-->
            <!--                      TooltipPositionProp="bottom-left"-->
            <!--                      @btnClick="mdfSchdl"-->
            <!--                    ></compo-tooltip-btn>-->
            <!--                    &lt;!&ndash; 삭제 버튼 &ndash;&gt;-->
            <!--                    <compo-tooltip-btn-->
            <!--                      v-if="selectedEvent.user_id === USER_ID"-->
            <!--                      TitleProp="삭제"-->
            <!--                      ClassProp="pl-tooltip-btn"-->
            <!--                      IconProp="pl-icon20 trash-white"-->
            <!--                      TooltipPositionProp="bottom"-->
            <!--                      @btnClick="delSchdlRtn"-->
            <!--                    ></compo-tooltip-btn>-->
            <!--                    &lt;!&ndash; 닫기 버튼 &ndash;&gt;-->
            <!--                    <compo-tooltip-btn-->
            <!--                      TitleProp="닫기"-->
            <!--                      ClassProp="pl-tooltip-btn"-->
            <!--                      IconProp="pl-icon20 dialog-close-white"-->
            <!--                      TooltipPositionProp="bottom"-->
            <!--                      @btnClick="selectedOpen = false"-->
            <!--                    ></compo-tooltip-btn>-->
            <!--                  </div>-->
            <!--                </div>-->
            <!--                -->
            <!--                &lt;!&ndash; 일정 상세  &ndash;&gt;-->

            <!--                <v-card-text v-model="selectedEvent">-->
            <!--                  <div class="pl-form-inline-wrap vertical type-auto">-->
            <!--                    <div class="pl-form-inline">-->
            <!--                      <span class="pl-label">-->
            <!--                        <v-icon size="20" color="#000" >mdi-account-circle-outline</v-icon>-->
            <!--                      </span>-->
            <!--                      <div class="pl-desc">-->
            <!--                        {{this.selectedEvent.reg_nm}}-->
            <!--                      </div>-->
            <!--                    </div>-->
            <!--                    <div class="pl-form-inline">-->
            <!--                      <span class="pl-label">-->
            <!--                        <v-icon class="pl-icon20 calendar-date "></v-icon>-->
            <!--                      </span>-->
            <!--                      <div class="pl-desc">-->
            <!--                        {{ this.selectedEvent.start }} ~ {{this.selectedEvent.end}}-->
            <!--                      </div>-->
            <!--                    </div>-->
            <!--                    <div class="pl-form-inline">-->
            <!--                      <span class="pl-label">-->
            <!--                        <v-icon class="pl-icon20 calendar-place "></v-icon>-->
            <!--                      </span>-->
            <!--                      <div class="pl-desc">-->
            <!--                        {{ this.selectedEvent.place }}-->
            <!--                      </div>-->
            <!--                    </div>-->
            <!--                    <div class="pl-form-inline">-->
            <!--                      <span class="pl-label">-->
            <!--                        <v-icon class="pl-icon20 calendar-list "></v-icon>-->
            <!--                      </span>-->
            <!--                      <div-->
            <!--                        class="pl-desc"-->
            <!--                        style="white-space: pre-line; word-break: break-all;"-->
            <!--                      >-->
            <!--                        {{ selectedEvent.content }}-->
            <!--                      </div>-->
            <!--                    </div>-->
            <!--                  </div>-->
            <!--                </v-card-text>-->
            <!--              </div>-->
            <!--            </v-menu>-->
          </div>
        </div>
      </div>
      <!--상세 모달 -->
      <v-dialog
          v-model="dialogShowSchdl"
          content-class="dialog-draggable"
          hide-overlay
      >
        <div class="draggable-area">
        </div>
        <compo-dialog
            :header-title="selectedEvent.name"
            @hide="mixin_hideDialog('ShowSchdl')"
        >
          <template slot="body">
            <div class="pl-form-inline-wrap vertical type-auto">
              <div class="pl-form-inline">
              <span class="pl-label">
<!--                <v-icon size="20" color="#000" >mdi-account-circle-outline</v-icon>-->
                작성자
              </span>
                <div class="pl-desc">
                  {{ selectedEvent.reg_nm }}
                </div>
              </div>
              <div class="pl-form-inline">
              <span class="pl-label">
<!--                <v-icon class="pl-icon20 calendar-date "></v-icon>-->
                일 시
              </span>
                <div class="pl-desc" v-if="!mixin_isEmpty(selectedEvent)">
                  <!--                <compo-date-picker-->
                  <!--                    DateType="dateTime"-->
                  <!--                    :DateProp="this.selectedEvent.start.substr(0,10)"-->
                  <!--                    :TimesProp="this.selectedEvent.start.substr(11, 5)"-->
                  <!--                    :DisabledProp="true"-->
                  <!--                />-->
                  <!--                ~-->
                  <!--                <compo-date-picker-->
                  <!--                    DateType="dateTime"-->
                  <!--                    :DateProp="this.selectedEvent.end.substr(0,10)"-->
                  <!--                    :TimesProp="this.selectedEvent.end.substr(11, 5)"-->
                  <!--                    :DisabledProp="true"-->
                  <!--                />-->
                  {{ selectedEvent.start.substr(0, 16) }} ~ {{ selectedEvent.end.substr(0, 16) }}
                </div>
              </div>
              <div class="pl-form-inline" v-if="!mixin_isEmpty(selectedEvent.place)">
              <span class="pl-label">
<!--                <v-icon class="pl-icon20 calendar-place "></v-icon>-->
                장 소
              </span>
                <div class="pl-desc">
                  <!--                <v-text-field-->
                  <!--                    class="pl-form"-->
                  <!--                    v-model="this.selectedEvent.place"-->
                  <!--                    :disabled="true"-->
                  <!--                />-->
                  {{ selectedEvent.place }}
                </div>
              </div>
              <div class="pl-form-inline">
              <span class="pl-label">
<!--                <v-icon class="pl-icon20 calendar-list "></v-icon>-->
                내 용
              </span>
                <div
                    class="pl-desc"
                    style="white-space: pre-line; word-break: break-all;"
                >
                  <v-textarea
                      class="pl-form is-noresize"
                      height="300px"
                      v-model="selectedEvent.content"
                      :readonly="true"
                  ></v-textarea>
                  <!--                {{ selectedEvent.content }}-->
                </div>
              </div>
            </div>
          </template>
          <template slot="footer">
            <!--          <v-btn v-if="selectedEvent.user_id === USER_ID" class="pl-btn" @click="[mixin_hideDialog('ShowSchdl'), mdfSchdl()]">수정</v-btn>-->
            <!--          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('ShowSchdl')">닫기</v-btn>-->
            <!--          <div class="pl-card d-flex justify-space-between">-->
            <div class="pl-btn-wrap">
              <compo-tooltip-btn
                  v-if="selectedEvent.user_id === USER_ID"
                  TitleProp="수정"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 edit"
                  TooltipPositionProp="bottom"
                  @btnClick="[mixin_hideDialog('ShowSchdl'), mdfSchdl()]"
              ></compo-tooltip-btn>
              <!-- 삭제 버튼 -->
              <compo-tooltip-btn
                  v-if="selectedEvent.user_id === USER_ID"
                  TitleProp="삭제"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 trash"
                  TooltipPositionProp="bottom"
                  @btnClick="delSchdlRtn"
              ></compo-tooltip-btn>
            </div>
            <!-- 닫기 버튼 -->
            <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('ShowSchdl')">닫기</v-btn>
          </template>
        </compo-dialog>
      </v-dialog>

      <!-- 등록 모달 -->
      <v-dialog
          v-model="dialogRegSchdl"
          content-class="dialog-draggable"
          hide-overlay>
        <div class="draggable-area">
        </div>
        <compo-dialog
            :header-title="REG_YN==''?'일정 등록':'일정 수정'"
            @hide="[mixin_hideDialog('RegSchdl') ,closeBtn()]"
        >
          <!-- <compo-dialog
            header-title="일정 수정"
            @hide="closeBtn"
          > -->
          <template slot="body">
            <v-form ref="form">
              <p>등록 시 개인 또는 센터일정 캘린더를 잘 확인해 주시기 바랍니다.<br/>
                일정 내용을 입력하신 후 <strong>[저장] 버튼을</strong> 클릭 하십시오.</p>
              <!-- <div class="pl-form-inline-wrap vertical is-mt-m  "> -->
              <div class="pl-form-inline-wrap vertical label-100 ">
                <div class="pl-form-inline mt-5">
              <span class="pl-label">
                제목
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
                  <div class="pl-desc">
                    <v-text-field
                        class="pl-form is-lg"
                        v-model="TTL"
                        :rules="validateRules.TTL"
                        v-byte-counter="200"
                    />
                    <v-checkbox
                        class="pl-check"
                        label="중요"
                        v-model="ESNTL_YN"
                        input-value="false"
                    ></v-checkbox>
                  </div>
                </div>
                <div class="pl-form-inline">
              <span class="pl-label">
                장소
              </span>
                  <div class="pl-desc">
                    <v-text-field
                        class="pl-form"
                        v-model="PLC"
                        v-byte-counter="300"
                    />
                  </div>
                </div>
                <div class="pl-form-inline">
              <span class="pl-label">
                일시
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
                  <div class="pl-desc">
                    <div class="pl-calendar-range-form">
                      <compo-date-picker
                          DateType="dateTime"
                          :DateProp.sync="startDate"
                          :TimesProp.sync='startTime'
                          @update:DateProp="setBgngDt"
                          @update:TimesProp="setBgngDt"
                          v-model="BGNG_YMD"
                          :rules="validateRules.BGNG_YMD"
                      />
                      <span class="pl-unit">~</span>
                      <compo-date-picker
                          DateType="dateTime"
                          :DateProp.sync="endDate"
                          :TimesProp.sync="endTime"
                          @update:DateProp="setEndDt"
                          @update:TimesProp="setEndDt"
                          v-model="END_YMD"
                          :rules="validateRules.END_YMD"
                      />
                    </div>
                  </div>
                </div>
                <div class="pl-form-inline">
              <span class="pl-label">
                공개
              </span>
                  <div class="pl-desc">
                    <v-radio-group
                        v-model="RLS_YN"
                        row
                        class="pl-radio-group"
                    >
                      <v-radio
                          v-for="(item, index) in radioGroup"
                          :key="radioGroup[index].text"
                          :label="item.text"
                          :value="item.value"
                          class="pl-radio"
                      >
                      </v-radio>
                    </v-radio-group>
                  </div>
                </div>
                <div class="pl-form-inline">
              <span class="pl-label">
                캘린더
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
                  <div class="pl-desc">
                    <v-select
                        class="pl-form"
                        :items="CALD_CL_DROP"
                        placeholder="선택하세요"
                        v-model="SCHDL_SE_CD"
                        :rules="validateRules.SCHDL_SE_CD"
                    ></v-select>
                    <!--                  :disabled="USER_AUTHRT_GROUP ==='상담사'? true : false"-->
                  </div>
                </div>
                <div class="pl-form-inline">
              <span class="pl-label">
                설명
              </span>
                  <div class="pl-desc">
                    <v-textarea
                        class="pl-form is-noresize"
                        height="300px"
                        placeholder="내용을 입력하세요(최대 4000자)"
                        v-model="CN"
                        :rules="validateRules.CN"
                        :spellcheck="false"
                        v-byte-counter="4000"
                    ></v-textarea>
                  </div>
                </div>
              </div>
            </v-form>
          </template>
          <template slot="footer">
            <v-btn class="pl-btn is-sub" @click="[mixin_hideDialog('RegSchdl') ,closeBtn()]">닫기</v-btn>
            <v-btn class="pl-btn" @click="schdlSaveValidate">저장</v-btn>
          </template>
        </compo-dialog>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import {eventBus} from "@/store/eventBus.js";           //Event Bus

export default {
  name: "MENU_CLD_M0000", //name은 'MENU_' + 파일명 조합
  props: {
    TYPE: {
      type: String,
      default: "",
    },
  },
  components: {},

  data() {
    return {

      calType: null,

      COMM_CALD_CL: [], // 캘린더 공통코드
      CALD_CL_DROP: [], // 캘린더 공통코드 드롭박스 생성용

      scrhSchdl: '',
      selectedItem: 0, // 일정 보기 버튼 선택
      datePeriod: 2, // 일,주,월간 초기값

      // mini
      // date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10)+' '+(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(11, 8),
      date: '',
      //date picker

      startDate: '',
      endDate: '',
      startTime: '',

      endTime: '',


      menu21: false,

      eventOverrides: {
        formatShort: 'D',
      },


      // full
      focus_cal: '',
      type: 'month',
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],

      focus_picker: '',

      dialogRegSchdl: false,
      dialogShowSchdl: false,

      regDialogTitle: '',

      radioGroupSelected: '',
      radioGroup: [
        {
          text: "공개",
          value: "Y"
        },
        {
          text: "비공개",
          value: "N",
        },
      ],

      schdlData: [], // 전체 일정 저장

      USER_AUTHRT_GROUP: '',   // 사용자 권한 체크

      // 일정 등록 데이터

      SCHDL_ID: '',
      USER_ID: '',
      USER_NM: '',
      TTL: '',          // 제목
      ESNTL_YN: false,    // 중요여부
      PLC: '',         // 장소
      BGNG_YMD: '',    // 시작일자
      END_YMD: '',     // 종료일자
      RLS_YN: 'N',      // 공개여부
      SCHDL_SE_CD: 'PSSD', // 일정구분코드
      CN: '',          // 내용
      REG_DT: '',      // 등록 날짜

      REG_YN: false,   // 등록/수정 구분

      valid: true,
      validateRules: {
        TTL: [
          v => !!v || '제목은(는) 필수 입력 항목입니다.'
        ],
        BGNG_YMD: [
          v => !!v || '시작일자 은(는) 필수 입력 항목입니다.'
        ],
        END_YMD: [
          v => !!v || '종료일자 은(는) 필수 입력 항목입니다.'
        ],
        SCHDL_SE_CD: [
          v => !!v || '캘린더 구분 은(는) 필수 입력 항목입니다. '
        ],
        CN: [
          v => (v || '').length <= 4000 || '0 ~ 4000 이내로 입력해 주세요.',
        ]
      },

      // ALERT 메세지
      MESSAGE: {
        CONFIRM: {
          REGIST: {
            alertDialogToggle: true,
            msg: '일정을 등록 하시겠습니까?',
            iconClass: 'is-info',
            type: 'confirm',
            callYes: this.regSchdlRtn,
            callNo: this.closeMsg
          },
          MODIFY: {
            alertDialogToggle: true,
            msg: '일정을 수정 하시겠습니까?',
            iconClass: 'is-info',
            type: 'confirm',
            callYes: this.mdfSchdlRtn,
            callNo: this.closeMsg
          },
          DELETE: {
            alertDialogToggle: true,
            msg: '일정을 삭제 하시겠습니까?',
            iconClass: 'is-info',
            type: 'confirm',
            callYes: this.delSchdlData,
            callNo: this.closeMsg
          }
        },
        ALERT: {
          CHK_TTL: {alertDialogToggle: true, msg: '제목을 입력하세요.', iconClass: 'is-info', type: 'default'},
          CHK_BGNG_YMD: {alertDialogToggle: true, msg: '시작 일자를 선택하세요.', iconClass: 'is-info', type: 'default'},
          CHK_END_YMD: {alertDialogToggle: true, msg: '종료 일자를 선택하세요.', iconClass: 'is-info', type: 'default'},
          INVALID_YMD: {alertDialogToggle: true, msg: '유효하지 않은 기간입니다.', iconClass: 'is-info', type: 'default'},
          CHK_SECD: {alertDialogToggle: true, msg: '일정 구분을 선택하세요.', iconClass: 'is-info', type: 'default'},
          ERR_GET_SCHDL: {alertDialogToggle: true, msg: '일정 정보를 가져올 수 없습니다.', iconClass: 'is-info', type: 'default'},
          SCHDL_COMPLETE: {alertDialogToggle: true, msg: '처리 되었습니다.', iconClass: 'is-done', type: 'default'},
          SCHDL_SAVE_FAIL: {alertDialogToggle: true, msg: '저장에 실패 했습니다.', iconClass: 'is-info', type: 'default'},
          SCHDL_DEL_FAIL: {alertDialogToggle: true, msg: '삭제할 수 없습니다.', iconClass: 'is-info', type: 'default'},
          SELECT_DATE: {
            alertDialogToggle: true,
            msg: '종료 일자는 시작 일자보다 빠를 수 없습니다.',
            iconClass: 'is-info',
            type: 'default'
          },
          NONE_AUTHRT: {alertDialogToggle: true, msg: '권한이 없습니다.', iconClass: 'is-info', type: 'default'},

        },
        TOAST: {
          SUCCESS: {
            msg: '정상 처리 되었습니다.',
            class: 'success',
            hasToastIcon: true,
            icon: 'mdi-checkbox-marked-circle',
            time: 2000
          },
          SCHDL_DEL_FAIL: {
            msg: '삭제 중 오류가 발생했습니다.',
            class: 'warning',
            hasToastIcon: true,
            icon: 'mdi-checkbox-marked-circle',
            time: 2000
          },
          SELECT_DATE: {
            msg: '종료 일자는 시작 일자보다 빠를 수 없습니다.',
            class: 'warning',
            hasToastIcon: true,
            icon: 'mdi-checkbox-marked-circle',
            time: 2000
          },
          CHK_BGNG_YMD: {
            msg: '시작 일자를 선택하세요.',
            class: 'warning',
            hasToastIcon: true,
            icon: 'mdi-checkbox-marked-circle',
            time: 2000
          },

        },
      },
      isActive: 0,
      calendarLocale: {
        weekdays: ["일", "월", "화", "수", "목", "금", "토"],
        firstDayOfWeek: 0,
      },
      isBtnClick1: false,
      isBtnClick2: false,
    }
  },
  watch: {
    SCHDL_SE_CD() {
      if (this.SCHDL_SE_CD === 'CTSD') {
        this.RLS_YN = 'Y';
      }
    },
    // dialogShowSchdl(){
    //   console.log("dialogShowSchdl watch", this.dialogShowSchdl);
    // },
    //date picker 날짜 변경 시 calendar 포커스 변경
    focus_picker() {
      this.focus_cal = this.focus_picker;
    },
    // calendar 포커스 변경 시 date picker
    focus_cal() {
      this.focus_picker = this.focus_cal;
      this.startDate = this.focus_cal;
      this.setBgngDt();
      this.endDate = this.focus_cal;
      this.setEndDt();
    },
    // 일정 정보 변경 되면 캘린더 업데이트
    schdlData() {
      this.inputCalendar('all');
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
  //공통코드 사용시 async-await 필수 (mixin_common_code_get_all함수로 공통코드 리스트를 가지고 오기 전에 mixin_common_code_get이벤트 발생)
  created() {
    this.getServerDate();
    // 공통코드
    this.loadCommCd();
    //User_id
    this.USER_ID = this.$store.getters["userStore/GE_USER_ROLE"].userId;
    this.USER_NM = this.$store.getters["userStore/GE_USER_ROLE"].userNm;
    this.USER_AUTHRT_GROUP = this.$store.getters["userStore/GE_USER_ROLE"].atrtGroupNm;
    //  일정 등록 데이터 초기화
    this.initRegData();
    // 일정 리스트
    this.getAllSchdl();
    this.$eventBus.$on("calType", this.setEvent);
  },
  mounted() {
    const CalendarType = this.calType
    // 마운트 시 메인화면 캘린더에서 이벤트 수신
    //  console.log("mounted ", this.calType)
    this.setCalType(CalendarType)
    // this.initRegData();
// console.log("this.selectedItem2222222", this.selectedItem);
  },

  methods: {
    // 캘린더 일자 표시
    getDay(date) {
      const day = date["day"]
      const day_num = Number(day);
      return day_num;
    },
    async loadCommCd() {
      this.COMM_CALD_CL = await this.mixin_common_code_get_all(['CALD_CL']);
      this.CALD_CL_DROP = this.mixin_common_code_get(this.COMM_CALD_CL, 'CALD_CL');
    },
    // 이벤트 수신
    setEvent(prop) {
      this.calType = prop;
    },
    setCalType(data) {
      if (this.mixin_isEmpty(data)) {
        this.inputCalendar('all')
      } else {
        if (this.calType === 'dtl') {
          this.inputCalendar('all');
          // this.RegSchdl()
        } else {
          if (this.calType === 'monthly') {
            this.setItem(data);
            this.inputCalendar('all');
          } else {
            this.setItem(data);
            this.inputCalendar(data);
          }
        }
      }
    },
    // 서버 시간 가져오기
    async getServerDate() {
      await this.mixin_getSvrDate("YYYYMMDDHH24MISS").then((data) => {
        let cvDate = this.mixin_convertDate(data, 'yyyy-MM-dd HH:mm:ss')
        this.date = cvDate;
        this.initRegData();
      })
    },
    // 일정 등록 데이터 초기화
    initRegData() {

      if (this.mixin_isEmpty(this.focus_cal)) {
        this.startDate = this.date.substr(0, 10);
        this.endDate = this.date.substr(0, 10);
      } else {
        this.endDate = this.focus_cal; // 현재 달력 포커스 날짜로 초기화
        this.startDate = this.focus_cal; // 현재 달력 포커스 날짜로 초기화
      }
      // 현재시간 + 1시간
      let tempDate = this.mixin_convertDate(this.$moment(this.date).add(1, 'hour').format("YYYYMMDDHHmmss"), 'yyyy-MM-dd HH:mm:ss')

      this.startTime = this.date.substr(11, 5);
      this.endTime = tempDate.substr(11, 5);
      this.setBgngDt();
      this.setEndDt();

      this.TTL = '';          // 제목
      this.ESNTL_YN = false;    // 중요여부
      this.PLC = '';         // 장소
      this.RLS_YN = 'N';      // 공개여부
      this.SCHDL_SE_CD = 'PSSD'; // 일정구분코드
      this.CN = '';          // 내용
      this.SCHDL_ID = '';
      this.REG_YN = false;
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
    //  일정 클릭 시 detail
    //  showEvent ({ nativeEvent, event }) {
    //   const open = () => {
    //     this.selectedEvent = event;
    //
    //     this.selectedElement = nativeEvent.target;
    //
    //     requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true));
    //   }
    //
    //   if (this.selectedOpen) {
    //     this.selectedOpen = false;
    //     requestAnimationFrame(() => requestAnimationFrame(() => open()));
    //   } else {
    //     open();
    //   }
    //
    //   nativeEvent.stopPropagation();
    // },
    //
    showEvent({nativeEvent, event}) {
      if (!this.dialogShowSchdl) {
        this.selectedEvent = event;
        console.log("this.selectedEvent", this.selectedEvent)
      }
      this.mixin_showDialog('ShowSchdl');
    },
// 전체 일정 가져오기
    async getAllSchdl() {
      this.schdlData = [];
      let sURL = "/api/schedule/list";
      let postParam = {
        USER_ID: this.USER_ID,
      };
      let headParam = {
        head: {
          SERVICE: "api.schedule.list",
          METHOD: "list",
          TYPE: "BIZ_SERVICE",
        }
      };
      let response = await this.common_postCall(sURL, postParam, headParam);
      if (response.HEADER.ERROR_FLAG) {
        this.showAlert(this.MESSAGE.ALERT.ERR_GET_SCHDL);
      } else {
        this.schdlData = response.DATA;
        this.inputCalendar('all');
      }
    },
// 캘린더에 일정 넣기
    setItem(value) {
      switch (value) {
        case ('all') :
          this.selectedItem = 0;
          break;
        case ('monthly') :
          this.selectedItem = 0;
          break;
        case ('ps') :
          this.selectedItem = 1;
          break;
        case ('ct') :
          this.selectedItem = 2;
          break;
        case ('estnl'):
          this.selectedItem = 3;
          break
      }
    },
    inputCalendar(value) {
      const events = [];
      const eventCount = this.schdlData.length;
      if (eventCount > 0) {
        for (let i = 0; i < eventCount; i++) {
          const start = this.ChnDateForm(this.schdlData[i].BGNG_YMD);
          const end = this.ChnDateForm(this.schdlData[i].END_YMD);
          const event = {
            schdl_id: this.schdlData[i].SCHDL_ID,
            esntl_yn: this.schdlData[i].ESNTL_YN === 'Y' ? true : false,
            schdl_se_cd: this.schdlData[i].SCHDL_SE_CD,
            name: this.schdlData[i].ESNTL_YN === 'Y' ? '★'+this.schdlData[i].TTL:this.schdlData[i].TTL,
            start: start,
            end: end,
            color: this.schdlData[i].SCHDL_SE_CD === 'PSSD' ? '#F59949' : '#4786E3',
            content: this.schdlData[i].CN,
            place: this.schdlData[i].PLC,
            rls_yn: this.schdlData[i].RLS_YN,
            regYn: true,
            reg_nm: this.schdlData[i].USER_NM,
            user_id: this.schdlData[i].USER_ID,
          };
          switch (value) {
            case 'all':
              events.push(event);
              break;
            case 'ps':
              if (this.schdlData[i].USER_ID === this.USER_ID) {
                events.push(event);
              }
              break;
            case 'ct':
              if (this.schdlData[i].SCHDL_SE_CD === 'CTSD') {
                events.push(event);
              }
              break;
            case 'estnl':
              if (this.schdlData[i].ESNTL_YN === 'Y') {
                events.push(event);
              }
              break;
            default:
              break;
          }
        }
        this.events = events;
      }
    },
// 일정쓰기 버튼 클릭 시 모달 OPEN
    RegSchdl() {
      this.mixin_showDialog('RegSchdl')
      // this.initRegData();
    },
    closeBtn() {
      this.resetValidation();           // 등록/수정 모달이 닫히면 validation check 초기화
      this.initRegData();               // 등록/수정 모달이 닫히면 바인딩 된 데이터 초기화
    },
// 등록/수정 창 데이터 초기화
    inputEventData() {
      this.TTL = this.selectedEvent.esntl_yn ? this.selectedEvent.name.replace(/^★\s*/, '') : this.selectedEvent.name ;          // 제목
      this.ESNTL_YN = '';
      this.ESNTL_YN = this.selectedEvent.esntl_yn;    // 중요여부
      this.PLC = this.selectedEvent.place;         // 장소
      this.BGNG_YMD = this.selectedEvent.start;    // 시작일자
      this.startDate = this.selectedEvent.start.substr(0, 10);
      this.startTime = this.selectedEvent.start.substr(11, 5);
      this.END_YMD = this.selectedEvent.end;     // 종료일자
      this.endDate = this.selectedEvent.end.substr(0, 10);
      this.endTime = this.selectedEvent.end.substr(11, 5);
      // console.log("this.selectedEvent.start",this.selectedEvent.end)
      this.RLS_YN = this.selectedEvent.rls_yn;      // 공개여부
      this.SCHDL_SE_CD = this.selectedEvent.schdl_se_cd; // 일정구분코드
      this.CN = this.selectedEvent.content;          // 내용
      this.SCHDL_ID = this.selectedEvent.schdl_id;
      this.REG_YN = this.selectedEvent.regYn;
    },
    mdfSchdl() {
      this.inputEventData();
      if (this.selectedEvent.schdl_se_cd === 'PSSD') {            // 개인일정인 경우 제한없이 등록/수정 모달 OPEN
        this.mixin_showDialog('RegSchdl')
      } else if (this.selectedEvent.schdl_se_cd === 'CTSD') {      // 센터일정인 경우 로그인한 사용자의 권한 체크 해서 '상담사'인 사용자는 접근불가
        // if(this.chkUserAuthrt()){
        this.mixin_showDialog('RegSchdl')
        // }
      }
      this.selectedOpen = false;
      // this.mixin_showDialog('RegSchdl');
    },
    //  CONFIRM alert창에서 취소를 누르면 alert 닫기
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },
    // 저장 시 전송데이터 비었는지 체크
    schdlSaveValidate() {
      if (this.validate()) {
        if (this.mixin_isEmpty(this.BGNG_YMD)) {
          this.showAlert(this.MESSAGE.ALERT.CHK_BGNG_YMD);
        } else if (this.mixin_isEmpty(this.END_YMD)) {
          this.showAlert(this.MESSAGE.ALERT.CHK_END_YMD);
        } else if (this.BGNG_YMD.length < 19 || this.END_YMD.length < 19) {
          this.showAlert(this.MESSAGE.ALERT.INVALID_YMD);
        } else {
          if (this.REG_YN == true) {                            // 일정 등록 여부를 확인 해서 REGIST와 MODIFY로 분기
            if (this.chkDate()) {
              this.showAlert(this.MESSAGE.CONFIRM.MODIFY);
            }
          } else {
            if (this.chkDate()) {
              this.showAlert(this.MESSAGE.CONFIRM.REGIST);
            }
          }
        }
      }
    },

    // 저장/수정 form valiate 체크
    validate() {
      return this.$refs.form.validate();
    },

    // 저장/수정 form validate reset
    resetValidation() {
      this.$refs.form.resetValidation();
    },

    // 신규 일정 등록
    regSchdlRtn() {
      this.regSchdlData('reg');
    },
    // 기존 일정 수정
    mdfSchdlRtn() {
      this.regSchdlData('mdf')
    },

    // 일정 저장(등록여부(REG_YN)에 따라 insert/update 분기)
    regSchdlData(val) {

      let URLData = '';
      let postParam = {};
      let headParam = {};

      switch (val) {

        case 'reg':

          URLData = "/api/schedule/insert"

          postParam = {
            // SCHDL_ID : '',
            USER_ID: this.USER_ID,
            TTL: this.TTL,                                                       // 제목
            ESNTL_YN: this.ESNTL_YN === true ? 'Y' : 'N',                          // 중요 여부
            BGNG_YMD: this.ChnDateFormToNum(this.BGNG_YMD),                       // 시작 일자
            END_YMD: this.ChnDateFormToNum(this.END_YMD),                         // 종료 일자
            SCHDL_SE_CD: this.SCHDL_SE_CD,                                         // 일정 구분 코드
            RLS_YN: this.RLS_YN,                                                 // 공개 여부
            PLC: this.PLC,                                                        // 장소
            CN: this.CN,                                                          // 내용
          };

          headParam = {
            head: {
              URL: "api.schedule",
              SERVICE: "api.schedule.insert",
              METHOD: "regist",
              ASYNC: 'false',
              TYPE: "BIZ_SERVICE",
            }
          }
          break;
        case 'mdf':
          URLData = "/api/schedule/update"

          postParam = {
            SCHDL_ID: this.SCHDL_ID,
            USER_ID: this.USER_ID,
            TTL: this.TTL,
            ESNTL_YN: this.ESNTL_YN === true ? 'Y' : 'N',
            PLC: this.PLC,
            BGNG_YMD: this.ChnDateFormToNum(this.BGNG_YMD),
            END_YMD: this.ChnDateFormToNum(this.END_YMD),
            RLS_YN: this.RLS_YN,
            SCHDL_SE_CD: this.SCHDL_SE_CD,
            CN: this.CN,
          }
          headParam = {
            head: {
              URL: "api.schedule",
              SERVICE: "api.schedule.update",
              METHOD: "modify",
              ASYNC: 'false',
              TYPE: "BIZ_SERVICE",
            }
          }
          break;
      }

      this.$api
          .post(URLData, postParam, headParam)
          .then((response) => {
            // this.showAlert(this.MESSAGE.ALERT.SCHDL_COMPLETE);
            this.showToast(this.MESSAGE.TOAST.SUCCESS);
            this.closeMsg();
            this.mixin_hideDialog('RegSchdl');
            this.initRegData();                                     // 등록데이터 초기화
            this.resetValidation();                                 // validation check 초기화
            this.getAllSchdl();                                     // 전체 일정 불러오기
          })
          .catch((err) => {
            this.showAlert(this.MESSAGE.ALERT.SCHDL_SAVE_FAIL);
          })

    },

    // 일정 삭제 CONFIRM ALERT
    delSchdlRtn() {

      this.inputEventData();

      if (this.selectedEvent.schdl_se_cd === 'PSSD') {               // 개인일정인 경우 제한없이 등록/수정 모달 OPEN
        this.showAlert(this.MESSAGE.CONFIRM.DELETE)
      } else if (this.selectedEvent.schdl_se_cd === 'CTSD') {      // 센터일정인 경우 로그인한 사용자의 권한 체크 해서 '상담사'인 사용자는 접근불가
        if (this.chkUserAuthrt()) {
          this.showAlert(this.MESSAGE.CONFIRM.DELETE)
        } else {
          this.showAlert(this.MESSAGE.ALERT.NONE_AUTHRT);
          this.initRegData();                                   // 등록/수정 모달에 저장한 선택 일정 데이터 초기화
        }
      }
    },

// 일정 삭제 API CALL

    delSchdlData() {

      let URLData = '/api/schedule/delete';
      let postParam = {
        USER_ID: this.USER_ID,
        SCHDL_ID: this.SCHDL_ID,
      }

      let headParam = {
        head: {
          URL: "api.schedule",
          SERVICE: "api.schedule.delete",
          METHOD: "delete",
          ASYNC: 'false',
          TYPE: "BIZ_SERVICE",
        }
      }
      this.$api
          .post(URLData, postParam, headParam)
          .then((response) => {
            // this.showAlert(this.MESSAGE.ALERT.SCHDL_COMPLETE);
            this.showToast(this.MESSAGE.TOAST.SUCCESS);
            this.closeMsg();
            this.mixin_hideDialog('ShowSchdl')
            this.initRegData();
            this.getAllSchdl();
          })
          .catch((err) => {
            this.showToast(this.MESSAGE.TOAST.SCHDL_DEL_FAIL);
          })


    },

    chkUserAuthrt() {
      if (this.selectedEvent.schdl_se_cd === 'CTSD' && this.USER_AUTHRT_GROUP === '상담사') {
        this.showAlert(this.MESSAGE.ALERT.NONE_AUTHRT);
        return false;
      } else {
        return true;
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

    // 시작 날짜 변환 : String(YYYY:MM:DD hh:mm:ss AM/PM) to String(YYYYMMDDHHmmss)
    ChnDateFormToNum(dateString) {
      let year = dateString.slice(0, 4);
      let month = dateString.slice(5, 7);
      let day = dateString.slice(8, 10);
      let hour = dateString.slice(11, 13);
      let minute = dateString.slice(14, 16);
      let second = dateString.slice(17, 19);
      if (second.length == 0) {
        second = '00';
      }

      // Format the date as "YYYYMMDDHHmmss" string
      const formattedDate = `${year}${month}${day}${hour}${minute}${second}`;

      return formattedDate;
    },

    // 시작 날짜 변환 (기본적인 포맷은 YYYY-MM-DD HH:mm:ss 이고, api 파라미터로 보낼 때 YYYYMMDDHHmmss로 변환)
    setBgngDt(data) {

      let cvtDT = '';
      cvtDT = this.startDate + ' ' + this.startTime + ':00'       // date-picker 에서 YYYY-MM-DD HH:mm 까지만 나오기 때문에 :00(초)를 붙여줌

      this.BGNG_YMD = '';
      this.BGNG_YMD = cvtDT;

    },

    // 종료 날짜 변환 : String(YYYY:MM:DD hh:mm:ss AM/PM) to String(YYYYMMDDHHmmss)

    setEndDt(data) {

      let cvtDT = '';
      cvtDT = this.endDate + ' ' + this.endTime + ':00';

      this.END_YMD = '';
      this.END_YMD = cvtDT;
      // this.chkDate();
    },

    // 시작,종료 일자 check : 시작 일자가 종료 일자보다 앞서면 ALERT창으로 경고
    chkDate() {
      if (!this.mixin_isEmpty(this.BGNG_YMD) && !this.mixin_isEmpty(this.END_YMD)) {

        if (Number(this.ChnDateFormToNum(this.BGNG_YMD)) > Number(this.ChnDateFormToNum(this.END_YMD))) {

          // this.showAlert(this.MESSAGE.ALERT.SELECT_DATE)
          this.showToast(this.MESSAGE.TOAST.SELECT_DATE);
          return false;
        } else {
          return true;
        }

      } else if (this.mixin_isEmpty(this.BGNG_YMD)) {
        // this.showAlert(this.MESSAGE.ALERT.CHK_BGNG_YMD)
        this.showToast(this.MESSAGE.TOAST.CHK_BGNG_YMD);
        return false;
      }
    },
  },

}
</script>

<style lang="scss" scoped>

</style>
