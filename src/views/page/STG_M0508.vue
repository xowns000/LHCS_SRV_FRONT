<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body" style="overflow: auto; height: 740px;">
        <!-- 고객 접수 설정 -->
        <h2 class="pl-subtit">고객 접수 설정</h2>
        <div class="pl-setting-list is-mt-m">
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">고객 접수 설정</div>
              <div class="pl-setting-list-desc">고객 접수 건을 상담사에게 배정하는 설정을 합니다.</div>
            </div>
            <div class="is-right">
              <v-switch
                v-model="CUS_RCPT"
                @change="chtStngChg('ROUTE_CD',CUS_RCPT)"
              ></v-switch>
            </div>
          </div>
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">고객 접수 제한 건</div>
              <div class="pl-setting-list-desc">고객 접수 건이 설정된 건수 이상이 되면, 더이상 신규접수를 받지 않게 됩니다</div>
            </div>
            <div class="is-right">
              <v-select
                class="pl-form"
                :items="mixin_common_code_get(common_code, 'RCPT_LMT')"
                v-model="CUS_RCPT_LMT"
                @change="chtStngChg('ROUTE_WAITING_CNT',CUS_RCPT_LMT)"
              ></v-select> 이상
            </div>
          </div>
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">이미지 수신 여부</div>
              <div class="pl-setting-list-desc">고객이 전송한 이미지 수신여부를 설정합니다.</div>
            </div>
            <div class="is-right">
              <v-switch
                v-model="IMG_RCPT"
                @change="chtStngChg('RECEIVE_IMAGE_YN',IMG_RCPT)"
              ></v-switch>
            </div>
          </div>
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">동영상 수신 여부</div>
              <div class="pl-setting-list-desc">고객이 전송한 동영상 수신여부를 설정합니다.</div>
            </div>
            <div class="is-right">
              <v-switch
                v-model="VOD_RCPT"
                @change="chtStngChg('RECEIVE_VIDEO_YN',VOD_RCPT)"
              ></v-switch>
            </div>
          </div>
          <!--
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">장문 수신 여부</div>
              <div class="pl-setting-list-desc">고객이 전송한 장문 수신여부를 설정합니다.</div>
            </div>
            <div class="is-right">
              <v-switch
                v-model="LONG_MSG"
                @change="chtStngChg('RECEIVE_LONG_TXT_YN',LONG_MSG)"
              ></v-switch>
            </div>
          </div>
          -->
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">고객 채팅 시작 메시지</div>
              <div class="pl-setting-list-desc">고객이 처음 채팅을 시작할때 상담 대기 메시지를 발송합니다.</div>
            </div>
            <div class="is-right">
              <v-switch
                v-model="CUST_WAIT"
                @change="chtStngChg('CUST_WAIT_MSG_YN',CUST_WAIT)"
              ></v-switch>
            </div>
          </div>
        </div>
        <!-- 무응답 설정 -->
        <h2 class="pl-subtit is-mt-l">무응답 설정</h2>
        <div class="pl-setting-list is-mt-m">
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">고객 무응답 사용 여부</div>
              <div class="pl-setting-list-desc">고객이 무응답 시, 무응답 메시지를 고객에게 발송합니다.</div>
            </div>
            <div class="is-right">
              <v-switch
                v-model="NO_RCPT"
                @change="chtStngChg('CUST_NORESP_USE_YN',NO_RCPT)"
              ></v-switch>
            </div>
          </div>
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">고객 무응답 후 종료</div>
              <div class="pl-setting-list-desc">마지막 무응답 메시지 발송된 후, 자동으로 채팅을 종료할지에 대한 여부를 설정합니다.</div>
            </div>
            <div class="is-right">
              <v-switch
              v-model="NO_RCPT_END"
              @change="chtStngChg('CUST_NORESP_CHATEND',NO_RCPT_END)"
            ></v-switch>
            </div>
          </div>
        </div>
        <!-- 상담 설정 -->
        <h2 class="pl-subtit is-mt-l">상담 설정</h2>
        <div class="pl-setting-list is-mt-m">
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">상담가능 시간</div>
              <div class="pl-setting-list-desc">상담이 가능한 시간을 설정합니다.</div>
            </div>
            <div class="is-right">
              <compo-date-picker
                DateType="time"
                :TimesProp.sync='CUT_START_TIME'
              /> 부터
              <compo-date-picker
                DateType="time"
                :TimesProp.sync='CUT_END_TIME'
              /> 까지
            </div>
          </div>
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">점심시간 사용여부</div>
              <div class="pl-setting-list-desc">점심시간으로 설정된 시간 동안에는 접수를 받지 않게 설정합니다.</div>
            </div>
            <div class="is-right">
              <v-switch
                v-model="LUNCH_YN"
                @change="chtStngChg('LUNCH_YN',LUNCH_YN)"
              ></v-switch>
            </div>
          </div>
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">점심시간</div>
              <div class="pl-setting-list-desc">점심시간을 설정합니다.</div>
            </div>
            <div class="is-right">
              <compo-date-picker
                DateType="time"
                :TimesProp.sync='LUNCH_START_TIME'
              /> 부터
              <compo-date-picker
                DateType="time"
                :TimesProp.sync='LUNCH_END_TIME'
              /> 까지
            </div>
          </div>
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">상담사 자동인사 사용여부</div>
              <div class="pl-setting-list-desc">채팅이 시작되면 자동인사 메시지가 고객에게 발송됩니다.</div>
            </div>
            <div class="is-right">
              <v-switch
                v-model="AUTO_GREET"
                @change="chtStngChg('AUTO_GREETING_YN',AUTO_GREET)"
              ></v-switch>
            </div>
          </div>
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">상담 허용 수 일괄 적용</div>
              <div class="pl-setting-list-desc">관리자가 채팅 허용 수를 지정할 지를 설정합니다.</div>
            </div>
            <div class="is-right">
              <v-radio-group
                row
                class="pl-radio-group"
                v-model="CUT_PM"
                @change="chtStngChg('CONT_CHATAGENT_YN',CUT_PM)"
              >
                <v-radio class="pl-radio" value="Y">
                  <template v-slot:label>
                    사용
                    <v-select
                      class="pl-form is-sm ml-1"
                      :items="mixin_common_code_get(common_code, 'PM_CNT')"
                      v-model="CUT_PM_CNT"
                      @change="chtStngChg('CONT_CHATAGENT_CNT',CUT_PM_CNT)"
                    ></v-select>
                  </template>
                </v-radio>
                <v-radio class="pl-radio" value="N">
                  <template v-slot:label>
                    사용하지 않음
                  </template>
                </v-radio>
              </v-radio-group>
            </div>
          </div>
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">제3자 채팅시작 알림</div>
              <div class="pl-setting-list-desc">제3자 채팅 시작/종료 알림 여부 설정합니다.</div>
            </div>
            <div class="is-right">
              <v-switch
                v-model="THIERD_CHAT"
                @change="chtStngChg('CONSULT_ALRAM_YN',THIERD_CHAT)"
              ></v-switch>
            </div>
          </div>
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">상담내용 필수여부</div>
              <div class="pl-setting-list-desc">상담을 저장할 때 상담내용 필수 입력여부를 설정합니다.</div>
            </div>
            <div class="is-right">
              <v-switch
                v-model="CUTT_CN_VALID"
                @change="chtStngChg('CUTT_CN_VALID',CUTT_CN_VALID)"
              ></v-switch>
            </div>
          </div>
        </div>
        <!-- 문의유형 설정 -->
        <h2 class="pl-subtit is-mt-l">문의유형 설정</h2>
        <div class="pl-setting-list is-mt-m">
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">고객 문의유형</div>
              <div class="pl-setting-list-desc">고객 접수 시, 문의유형을 선택하도록 합니다.</div>
            </div>
            <div class="is-right">
              <v-switch
                v-model="CUS_QSTN"
                @change="chtStngChg('INQRY_TYPE_YN',CUS_QSTN)"
              ></v-switch>
            </div>
          </div>
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">문의유형 사용 레벨</div>
              <div class="pl-setting-list-desc">사용레벨만큼의 문의유형이 고객에게 발송됩니다.</div>
            </div>
            <div class="is-right">
              <v-select
                class="pl-form"
                :items="mixin_common_code_get(common_code, 'QSTN_LVL')"
                v-model="QSTN_LVL"
                @change="chtStngChg('INQRY_USE_LVL',QSTN_LVL)"
              ></v-select> 레벨
            </div>
          </div>
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">채팅방 문의유형 표시</div>
              <div class="pl-setting-list-desc">채팅방에 고객이 선택한 문의유형을 표시합니다.</div>
            </div>
            <div class="is-right">
              <v-switch
                v-model="SHOW_QSTN"
                @change="chtStngChg('INQRY_SHOW_YN',SHOW_QSTN)"
              ></v-switch>
            </div>
          </div>
        </div>
        <!-- 배분 설정 -->
        <!-- <h2 class="pl-subtit is-mt-l">배분 설정</h2>
        <div class="pl-setting-list is-mt-m">
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">자동배분 사용 여부</div>
              <div class="pl-setting-list-desc">인입된 고객 접수 건을 상담직원에게 배분하는 방법을 설정합니다.
                <p>
                  <strong>자동배분</strong> : 인입된 고객 접수 건을 자동으로 상담사에게 배분합니다.<br/>
                  <strong>전문상담만배분</strong> : 고객이 선택한 문의유형에 해당하는 전문상담사에게 배분합니다.
                </p>
              </div>
            </div>
            <div class="is-right">
              <v-radio-group
                row
                class="pl-radio-group"
                v-model="AUTO_ROUTE"
                @change="chtStngChg('SPEC_CNSL_ROUTE',AUTO_ROUTE)"
              >
                <v-radio
                  v-for="(rad01, index) in AUTO_ROUTE_RADIO"
                  :key="AUTO_ROUTE_RADIO[index].value"
                  :label="rad01.text"
                  :value="rad01.value"
                  class="pl-radio"
                >
                </v-radio>
              </v-radio-group>
            </div>
          </div>
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">직전 상담사 배분 사용 여부</div>
              <div class="pl-setting-list-desc">직전에 상담한 이력이 있으면, 해당 상담사에게 배분합니다.</div>
            </div>
            <div class="is-right">
              <v-switch
                v-model="BEFORE_ROUTE"
                @change="chtStngChg('BEFORE_AGENT_USE_YN',BEFORE_ROUTE)"
              ></v-switch>
            </div>
          </div>
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">직전상담사 배분 제한기간</div>
              <div class="pl-setting-list-desc">직전에 상담한 이력이 있으면, 해당 상담사에게 배분합니다.</div>
            </div>
            <div class="is-right">
              <v-radio-group
                row
                class="pl-radio-group"
                v-model="BEFORE_ROUTE_TIME"
                @change="chtStngChg('BEFORE_AGENT_PERIOD',BEFORE_ROUTE_TIME)"
              >
                <v-radio
                  v-for="(rad01, index) in BEFORE_ROUTE_TIME_RADIO"
                  :key="BEFORE_ROUTE_TIME_RADIO[index].value"
                  :label="rad01.text"
                  :value="rad01.value"
                  class="pl-radio"
                >
                </v-radio>
              </v-radio-group>
            </div>
          </div>
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">지정상담사 배분 고객 문의유형 사용여부</div>
              <div class="pl-setting-list-desc">지정상담사 인입 시 고객 문의유형을 사용할지 여부 설정합니다.</div>
            </div>
            <div class="is-right">
              <v-switch
                v-model="DSGN_ROUTE_QSTN"
                @change="chtStngChg('FIXED_ROUTE_INQRY_USE_YN',DSGN_ROUTE_QSTN)"
              ></v-switch>
            </div>
          </div>
        </div> -->
        <!-- 통계 설정 -->
        <h2 class="pl-subtit is-mt-l">종합통계 설정</h2>
        <div class="pl-setting-list is-mt-m">
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">상담배정 건수</div>
              <div class="pl-setting-list-desc">상담원에게 채팅이 배정된 건수를 포함합니다.</div>
              <div class="pl-setting-list-desc">* 기본설정 항목이며, 변경이 불가능합니다.</div>
            </div>
          </div>
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">상담 요청불가</div>
              <div class="pl-setting-list-desc">채팅상담 업무시간 이외 시간에 인입된 건수를 포함합니다.</div>
            </div>
            <div class="is-right">
              <v-switch
                v-model="DMND_NPSBL"
                @change="chtStngChg('DMND_NPSBL',DMND_NPSBL)"
              ></v-switch>
            </div>
          </div>
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">상담사 배정불가</div>
              <div class="pl-setting-list-desc">인입된 상담이 배정 받을 수 없는 상태의 건수를 포함합니다.</div>
            </div>
            <div class="is-right">
              <v-switch
                v-model="CUSL_ALTMNT_NPSBL"
                @change="chtStngChg('CUSL_ALTMNT_NPSBL',CUSL_ALTMNT_NPSBL)"
              ></v-switch>
            </div>
          </div>
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">배정 대기중 포기</div>
              <div class="pl-setting-list-desc">고객이 상담을 요청하고 상담사가 배정되기 전 종료된 건수를 포함합니다.</div>
            </div>
            <div class="is-right">
              <v-switch
                v-model="ALTMNT_GIVEUP"
                @change="chtStngChg('ALTMNT_GIVEUP',ALTMNT_GIVEUP)"
              ></v-switch>
            </div>
          </div>
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">고객 대기중 포기</div>
              <div class="pl-setting-list-desc">고객이 상담을 요청하고 상담사가 배정되었지만, 상담을 시작하기 전 종료된 건수를 포함합니다.</div>
            </div>
            <div class="is-right">
              <v-switch
                v-model="WAIT_GIVEUP"
                @change="chtStngChg('WAIT_GIVEUP',WAIT_GIVEUP)"
              ></v-switch>
            </div>
          </div>
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">상담 요청중 포기</div>
              <div class="pl-setting-list-desc">고객이 상담을 요청하였지만, 문의유형을 선택하지 않아 종료된 건수를 포함합니다.</div>
            </div>
            <div class="is-right">
              <v-switch
                v-model="DMND_GIVEUP"
                @change="chtStngChg('DMND_GIVEUP',DMND_GIVEUP)"
              ></v-switch>
            </div>
          </div>
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">챗봇 상담중 포기</div>
              <div class="pl-setting-list-desc">고객이 챗봇 상담중 상담원 연결 전 종료된 건수를 포함합니다.</div>
            </div>
            <div class="is-right">
              <v-switch
                v-model="DMND_NOCHC"
                @change="chtStngChg('DMND_NOCHC',DMND_NOCHC)"
              ></v-switch>
            </div>
          </div>
        </div>
        <!-- 상담예약 설정 -->
        <template
          v-if="mixin_getCustcoSrvcStat('RSVT')"
          >
          <h2 class="pl-subtit is-mt-l">상담예약 설정</h2>
          <div class="pl-setting-list is-mt-m">
            <div class="pl-setting-list-unit">
              <div>
                <div class="pl-setting-list-title">상담예약 시간</div>
                <div class="pl-setting-list-desc">상담예약을 접수받을 시간을 설정합니다.</div>
              </div>
              <div class="is-right">
                <compo-date-picker
                  DateType="time"
                  :TimesProp.sync='RSVT_START_TIME'
                /> 부터
                <compo-date-picker
                  DateType="time"
                  :TimesProp.sync='RSVT_END_TIME'
                /> 까지
              </div>
            </div>
            <div class="pl-setting-list-unit">
              <div>
                <div class="pl-setting-list-title">상담예약 접수 주기</div>
                <div class="pl-setting-list-desc">상담예약을 접수시간의 주기를 설정합니다.</div>
              </div>
              <div class="is-right">
                <v-select
                  class="pl-form"
                  :items="getRsvtItv()"
                  v-model="RSVT_ITV"
                  @change="chtStngChg('RSVT_ITV',RSVT_ITV)"
                ></v-select> 분
              </div>
            </div>
          </div>
        </template>
        <!-- 기타 설정 -->
        <h2 class="pl-subtit is-mt-l">기타 설정</h2>
        <div class="pl-setting-list is-mt-m">
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">금칙어 적용 여부</div>
              <div class="pl-setting-list-desc">채팅 내용 중, 금칙어가 전환어로 변환되어 보여집니다.</div>
            </div>
            <div class="is-right">
              <v-switch
                v-model="FBDWD"
                @change="chtStngChg('PROHIBITE_APPLY_YN',FBDWD)"
              ></v-switch>
            </div>
          </div>
          <div class="pl-setting-list-unit">
            <div>
              <div class="pl-setting-list-title">자동응답 메시지 사용 여부</div>
              <div class="pl-setting-list-desc">업무시간 외, 휴일에 자동응답메시지가 발송됩니다.</div>
            </div>
            <div class="is-right">
              <v-switch
                v-model="AUTO_MSG"
                @change="chtStngChg('AUTO_MESSAGE_YN',AUTO_MSG)"
              ></v-switch>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
name:"MENU_STG_M0508", //name은 'MENU_' + 파일명 조합
components: {
},
data() {
  return {
    //공통코드
    common_code:[],

    // 고객접수 설정
    CUS_RCPT:false,           //고객접수설정
    CUS_RCPT_LMT:'',          //고객접수 제한
    IMG_RCPT:false,           //이미지 수신여부
    VOD_RCPT:false,           //동영상 수신여부
    LONG_MSG:false,           //장문 수신여부
    CUST_WAIT:false,          //고객 상담대기 메시지 수신여부

    NO_RCPT:false,            //무응답사용여부
    NO_RCPT_END:false,        //무응답종료사용여부

    CUT_START_TIME:'',        //상담시작시간
    CUT_END_TIME:'',          //상담종료시간
    LUNCH_YN: false,             //점심시간 사용여부
    LUNCH_START_TIME:'',     //점심시간시작시간
    LUNCH_END_TIME:'',        //점심시간종료시간
    AUTO_GREET:false,         //자동인사 사용여부
    //상담허용 일괄적용여부
    CUT_PM:[
      {
        text: "사용",
        value: 'Y',
      },
      {
        text: "사용하지 않음",
        value: 'N',
      },
    ],
    CUT_PM_CNT:0,             //상담허용수
    THIERD_CHAT:false,        //3자채팅 알림
    CUTT_CN_VALID:false,      //상담내용 필수여부

    CUS_QSTN:false,           //문의유형사용여부
    QSTN_LVL:0,               //문의유형 레벨
    SHOW_QSTN:false,          //채팅방 문의유형 표시여부 

    AUTO_ROUTE:"NORMAL",         //자동배분 사용여부
    //자동배분 사용여부 라디오버튼
    AUTO_ROUTE_RADIO:[
      {
        text: "자동 배분",
        value: 'NORMAL',
      },
      {
        text: "전문 상담만 배분",
        value: 'ONLY_SPEC',
      },
    ],
    BEFORE_ROUTE:false,       //직전상담배분여부
    BEFORE_ROUTE_TIME:1,      //직전상담기간
    BEFORE_ROUTE_TIME_RADIO:[
      {
        text: "1일",
        value: '1',
      },
      {
        text: "3일",
        value: '3',
      },
      {
        text: "없음",
        value: '0',
      },
    ],
    DSGN_ROUTE_QSTN:false,    //지정상담사 배분고객 문의유형 사용여부

    FBDWD:false,              //금칙어 사용여부
    AUTO_MSG:false,           //자동응답 메시지 사용여부

    DMND_NPSBL:false,         //요청불가건 통계 포함여부
    CUSL_ALTMNT_NPSBL:false,  //상담사 배정불가건 통계 포함여부
    ALTMNT_GIVEUP:false,      //상담요청중포기건 통계 포함여부
    WAIT_GIVEUP:false,        //상담대기중포기건 통계 포함여부
    DMND_GIVEUP:false,        //상담요청중포기건 통계 포함여부
    DMND_NOCHC:false,         //상담요청미선택건 통계 포함여부
    
    RSVT_START_TIME:'',        //상담예약 시작시간
    RSVT_END_TIME:'',          //상담예약 종료시간
    // RSVT_ITV_LIST:[],
    RSVT_ITV:'30',
  }
},

  watch: {
    CUT_START_TIME:function (){
      if(this.CUT_START_TIME.length == 5){
        this.chtStngChg('WORK_START_TIME',this.CUT_START_TIME);
      }
    },

    CUT_END_TIME:function (){
      if(this.CUT_END_TIME.length == 5){
        this.chtStngChg('WORK_END_TIME',this.CUT_END_TIME);
      }
    },

    LUNCH_START_TIME:function (){
      if(this.LUNCH_START_TIME.length == 5){
        this.chtStngChg('LUNCH_START_TIME',this.LUNCH_START_TIME);
      }
    },

    LUNCH_END_TIME:function (){
      if(this.LUNCH_END_TIME.length == 5){
        this.chtStngChg('LUNCH_END_TIME',this.LUNCH_END_TIME);
      }
    },

    RSVT_START_TIME:function (){
      if(this.RSVT_START_TIME.length == 5){
        this.chtStngChg('RSVT_START_TIME',this.RSVT_START_TIME);
      }
    },

    RSVT_END_TIME:function (){
      if(this.RSVT_END_TIME.length == 5){
        this.chtStngChg('RSVT_END_TIME',this.RSVT_END_TIME);
      }
    },
  },

  computed: {

  },


  //공통코드 사용시 async-await 필수 (mixin_common_code_get_all함수로 공통코드 리스트를 가지고 오기 전에 mixin_common_code_get이벤트 발생)
  async created() {
    //공통코드설정
    let codeName = ['RCPT_LMT', 'PM_CNT', 'QSTN_LVL'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    this.chtStngSrch();
  },

  mounted() {

  },

  methods: {
    //상담설정 조회
    async chtStngSrch(){
      let sUrl = '/chat-api/setting/manage/inqire';
      let postParam = {
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        let leng = resData.DATA.length;
        for(let i=0;i<leng;i++){
          if(resData.DATA[i].STNG_CD == "ROUTE_CD"){  //고객접수설정(배분상태)
            this.CUS_RCPT = resData.DATA[i].STNG_VL == "START" ? 'Y' : 'N';

          } else if(resData.DATA[i].STNG_CD == "ROUTE_WAITING_CNT"){  //고객접수제한건(분배대기인원)
            this.CUS_RCPT_LMT = resData.DATA[i].STNG_VL;

          } else if(resData.DATA[i].STNG_CD == "RECEIVE_IMAGE_YN"){  //이미지 수신여부
            this.IMG_RCPT = resData.DATA[i].STNG_VL == "Y" ? true : false;

          } else if(resData.DATA[i].STNG_CD == "RECEIVE_VIDEO_YN"){  //이미지 수신여부
            this.VOD_RCPT = resData.DATA[i].STNG_VL == "Y" ? true : false;

          } else if(resData.DATA[i].STNG_CD == "RECEIVE_LONG_TXT_YN"){  //장문수신여부
            this.LONG_MSG = resData.DATA[i].STNG_VL == "Y" ? true : false;

          } else if(resData.DATA[i].STNG_CD == "CUST_WAIT_MSG_YN"){  //장문수신여부
            this.CUST_WAIT = resData.DATA[i].STNG_VL == "Y" ? true : false;

          } else if(resData.DATA[i].STNG_CD == "CUST_NORESP_USE_YN"){  //무응답 사용여부(고객무응답메시지사용여부)
            this.NO_RCPT = resData.DATA[i].STNG_VL == "Y" ? true : false;

          } else if(resData.DATA[i].STNG_CD == "CUST_NORESP_CHATEND"){  //무응답종료 사용여부(고객무응답메시지전송후채팅종료)
            this.NO_RCPT_END = resData.DATA[i].STNG_VL == "Y" ? true : false;

          } else if(resData.DATA[i].STNG_CD == "WORK_START_TIME"){  //상담시작시간
            this.CUT_START_TIME = resData.DATA[i].STNG_VL.substring(0,2) + ':' + resData.DATA[i].STNG_VL.substring(2,4)

          } else if(resData.DATA[i].STNG_CD == "WORK_END_TIME"){  //상담종료시간
            this.CUT_END_TIME = resData.DATA[i].STNG_VL.substring(0,2) + ':' + resData.DATA[i].STNG_VL.substring(2,4)

          } else if(resData.DATA[i].STNG_CD == "LUNCH_YN"){  //점심시간 사용
            this.LUNCH_YN = resData.DATA[i].STNG_VL == "Y" ? true : false;

          } else if(resData.DATA[i].STNG_CD == "LUNCH_START_TIME"){  //점심시작시간
            this.LUNCH_START_TIME = resData.DATA[i].STNG_VL.substring(0,2) + ':' + resData.DATA[i].STNG_VL.substring(2,4)

          } else if(resData.DATA[i].STNG_CD == "LUNCH_END_TIME"){  //점심종료시간
            this.LUNCH_END_TIME = resData.DATA[i].STNG_VL.substring(0,2) + ':' + resData.DATA[i].STNG_VL.substring(2,4)

          } else if(resData.DATA[i].STNG_CD == "AUTO_GREETING_YN"){  //자동인사 사용여부
            this.AUTO_GREET = resData.DATA[i].STNG_VL == "Y" ? true : false

          } else if(resData.DATA[i].STNG_CD == "CONT_CHATAGENT_YN"){  //상담허용 일괄적용여부
            this.CUT_PM = resData.DATA[i].STNG_VL

          } else if(resData.DATA[i].STNG_CD == "CONT_CHATAGENT_CNT"){  //상담허용수(상담허용수일괄적용값)
            this.CUT_PM_CNT = resData.DATA[i].STNG_VL

          } else if(resData.DATA[i].STNG_CD == "CONSULT_ALRAM_YN"){  //3자채팅 알림
            this.THIERD_CHAT = resData.DATA[i].STNG_VL == "Y" ? true : false;

          } else if(resData.DATA[i].STNG_CD == "CUTT_CN_VALID"){  //3자채팅 알림
            this.CUTT_CN_VALID = resData.DATA[i].STNG_VL == "Y" ? true : false;

          } else if(resData.DATA[i].STNG_CD == "INQRY_TYPE_YN"){  //문의유형사용여부
            this.CUS_QSTN = resData.DATA[i].STNG_VL == "Y" ? true : false;

          } else if(resData.DATA[i].STNG_CD == "INQRY_USE_LVL"){  //문의유형 레벨(문의유형사용레벨)
            this.QSTN_LVL = resData.DATA[i].STNG_VL

          } else if(resData.DATA[i].STNG_CD == "INQRY_SHOW_YN"){  //문의유형 레벨(문의유형사용레벨)
            this.SHOW_QSTN = resData.DATA[i].STNG_VL == "Y" ? true : false;

          } else if(resData.DATA[i].STNG_CD == "SPEC_CNSL_ROUTE"){  //자동배분 사용여부
            this.AUTO_ROUTE = resData.DATA[i].STNG_VL

          } else if(resData.DATA[i].STNG_CD == "BEFORE_AGENT_USE_YN"){  //직전상담사용여부(직전상담사 배분사용여부)
            this.BEFORE_ROUTE = resData.DATA[i].STNG_VL == "Y" ? true : false;

          } else if(resData.DATA[i].STNG_CD == "BEFORE_AGENT_PERIOD"){  //직전상담 기간(직전상담사 배분 기간)
            this.BEFORE_ROUTE_TIME = resData.DATA[i].STNG_VL == "Y" ? true : false;

          } else if(resData.DATA[i].STNG_CD == "FIXED_ROUTE_INQRY_USE_YN"){  //지정상담사 배분고객 문의유형 사용여부(지정상담사 배분 고객문의유형 사용여부)
            this.DSGN_ROUTE_QSTN = resData.DATA[i].STNG_VL == "Y" ? true : false;

          } else if(resData.DATA[i].STNG_CD == "PROHIBITE_APPLY_YN"){  //금칙어 사용여부
            this.FBDWD = resData.DATA[i].STNG_VL == "Y" ? true : false;

          } else if(resData.DATA[i].STNG_CD == "AUTO_MESSAGE_YN"){  //자동응답 메시지 사용여부
            this.AUTO_MSG = resData.DATA[i].STNG_VL == "Y" ? true : false;

          } else if(resData.DATA[i].STNG_CD == "DMND_NPSBL"){  //자동응답 메시지 사용여부
            this.DMND_NPSBL = resData.DATA[i].STNG_VL == "Y" ? true : false;
          } else if(resData.DATA[i].STNG_CD == "CUSL_ALTMNT_NPSBL"){  //자동응답 메시지 사용여부
            this.CUSL_ALTMNT_NPSBL = resData.DATA[i].STNG_VL == "Y" ? true : false;
          } else if(resData.DATA[i].STNG_CD == "ALTMNT_GIVEUP"){  //자동응답 메시지 사용여부
            this.ALTMNT_GIVEUP = resData.DATA[i].STNG_VL == "Y" ? true : false;
          } else if(resData.DATA[i].STNG_CD == "WAIT_GIVEUP"){  //자동응답 메시지 사용여부
            this.WAIT_GIVEUP = resData.DATA[i].STNG_VL == "Y" ? true : false;
          } else if(resData.DATA[i].STNG_CD == "DMND_GIVEUP"){  //자동응답 메시지 사용여부
            this.DMND_GIVEUP = resData.DATA[i].STNG_VL == "Y" ? true : false;
          } else if(resData.DATA[i].STNG_CD == "DMND_NOCHC"){  //자동응답 메시지 사용여부
            this.DMND_NOCHC = resData.DATA[i].STNG_VL == "Y" ? true : false;
          } else if(resData.DATA[i].STNG_CD == "RSVT_START_TIME"){  //상담예약 시작시간
            this.RSVT_START_TIME = resData.DATA[i].STNG_VL.substring(0,2) + ':' + resData.DATA[i].STNG_VL.substring(2,4)
          }  else if(resData.DATA[i].STNG_CD == "RSVT_END_TIME"){  //상담예약 종료시간
            this.RSVT_END_TIME = resData.DATA[i].STNG_VL.substring(0,2) + ':' + resData.DATA[i].STNG_VL.substring(2,4)
          } else if(resData.DATA[i].STNG_CD == "RSVT_ITV"){  //상담예약 종료시간
            this.RSVT_ITV = resData.DATA[i].STNG_VL
          } 
        }
      }
    },

    //상담설정 저장
    async chtStngChg(cd,vl){
      let sUrl = '/chat-api/setting/manage/modify';
      let postParam = {
        STNG_CD:cd,
        STNG_VL:vl == true || vl == false ? (vl == true ? 'Y' : 'N') : vl.replace(':',''),
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
      }
    },

    getRsvtItv(){
      let list = [];
      for(let i=1;i<=30;i++){
        list[i-1] = (i*5).toString();
      }
      return list
    }
  },
}
</script>

<style lang="scss" scoped>

</style>