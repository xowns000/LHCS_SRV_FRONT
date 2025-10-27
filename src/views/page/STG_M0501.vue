<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols" style="height: 100%">
        <!-- tabs -->
        <div class="is-vrt" >
          <v-tabs class="pl-tabs" v-model="tab" @change="tabChg">
            <v-tab>접수지연 설정</v-tab>
            <v-tab>응대지연 설정</v-tab>
            <v-tab>고객 무응답 설정</v-tab>
          </v-tabs>
          <div style="height: 700px">
            <v-tabs-items v-model="tab" class="pl-tabs-items">
              <!-- 접수지연 설정 -->
              <v-tab-item>
                <div class="pl-card">
                  <div class="d-flex align-end">
                    <v-icon class="pl-icon98 chat-set01"></v-icon>
                    <div class="pl-7">
                      <h2 class="pl-subtit">채팅 상담 시 접수 지연 시 메시지를 설정 합니다.</h2>
                      <ul class="pl-list-dot is-no-border">
                        <li>상담종료 메시지는 고객이 종료하였을 때 수신되는 메시지 입니다.</li>
                        <li>접수지연 메시지는 고객이 문의유형을 선택하지 않을 때 발송되는 메시지 입니다.</li>
                        <li>접수지연 메시지는 <strong>3차메시지 까지 설정 가능</strong>합니다.</li>
                      </ul>
                    </div>
                    <div class="ml-auto">
                      <v-btn class="pl-btn" @click="add_delayMsg('delayIndex')">접수지연 메시지 추가</v-btn>
                    </div>
                  </div>
                </div>
                <div class="pl-card">
                  <div style="width: 894px">
                    <div>
                      <h2 class="pl-subtit">상담 종료 메시지</h2>
                      <div class="pl-form-inline-wrap vertical is-mt-s">
                        <div class="pl-form-inline flex-grow-1">
                          <span class="pl-label">
                            메시지
                          </span>
                          <div class="pl-desc">
                            <v-text-field
                              v-model="CUTTEND_MSG.MSG_CN"
                              class="pl-form flex-grow-1 is-auto"
                              @keydown.enter="previewTemplate(CUTTEND_MSG.MSG_CN)"
                              v-byte-counter="4000"
                            />
                            <!-- 미리보기 -->
                            <compo-tooltip-btn
                              TitleProp="미리보기"
                              ClassProp="pl-tooltip-btn flex-grow-0"
                              IconProp="pl-icon20 preview"
                              TooltipPositionProp="bottom"
                              @btnClick="previewTemplate(CUTTEND_MSG.MSG_CN)"
                            ></compo-tooltip-btn>
                            <!-- 메시지 저장 -->
                            <compo-tooltip-btn
                              TitleProp="메시지 저장"
                              ClassProp="pl-tooltip-btn flex-grow-0"
                              IconProp="pl-icon20 is-drag-icon-check"
                              TooltipPositionProp="bottom"
                              @btnClick="sysMsgStrgConfirm(CUTTEND_MSG,-1,'2',CUTTEND_MSG)"
                            ></compo-tooltip-btn>
                            <!-- 메시지 삭제 -->
                            <!-- <compo-tooltip-btn
                              TitleProp="메시지 삭제"
                              ClassProp="pl-tooltip-btn flex-grow-0"
                              IconProp="pl-icon20 trash"
                              TooltipPositionProp="bottom"
                              @btnClick="mixin_testLog('메시지 삭제')"
                            ></compo-tooltip-btn> -->
                          </div>
                        </div>
                      </div>
                      <!-- 추가  -->
                      <div v-for="(item,delayIndex) in DELAY_MSG" :key="delayIndex" class="is-mt-m">
                        <h2 class="pl-subtit">({{ item.ROWNUM }}차) 접수 지연 메시지</h2>
                        <div class="pl-form-inline-wrap vertical is-mt-s">
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              지연 시간
                            </span>
                            <div class="pl-desc">
                              <v-text-field
                                v-model="item.MSG_HR"
                                class="pl-form is-sm flex-grow-0"
                                suffix="분"
                                type="number"
                                oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                                v-byte-counter="4"
                              />
                            </div>
                          </div>
                          <div class="pl-form-inline flex-grow-1">
                            <span class="pl-label">
                              메시지
                            </span>
                            <div class="pl-desc">
                              <v-text-field
                                v-model="item.MSG_CN"
                                class="pl-form flex-grow-1 is-auto"
                                @keydown.enter="previewTemplate(item.MSG_CN)"
                                v-byte-counter="4000"
                              />
                              <!-- 미리보기 -->
                              <compo-tooltip-btn
                                TitleProp="미리보기"
                                ClassProp="pl-tooltip-btn flex-grow-0"
                                IconProp="pl-icon20 preview"
                                TooltipPositionProp="bottom"
                                @btnClick="previewTemplate(item.MSG_CN)"
                              ></compo-tooltip-btn>
                              <!-- 메시지 저장 -->
                              <compo-tooltip-btn
                                TitleProp="메시지 저장"
                                ClassProp="pl-tooltip-btn flex-grow-0"
                                IconProp="pl-icon20 is-drag-icon-check"
                                TooltipPositionProp="bottom"
                                @btnClick="sysMsgStrgConfirm(DELAY_MSG,delayIndex,'9',BF_DELAY_MSG_HR)"
                              ></compo-tooltip-btn>
                              <!-- 메시지 삭제 -->
                              <compo-tooltip-btn
                                TitleProp="메시지 삭제"
                                ClassProp="pl-tooltip-btn flex-grow-0"
                                IconProp="pl-icon20 trash"
                                TooltipPositionProp="bottom"
                                @btnClick="sysMsgDelConfirm(DELAY_MSG,delayIndex,'9')"
                              ></compo-tooltip-btn>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </v-tab-item>
              <!-- 응대지연 설정 -->
              <v-tab-item>
                <div class="pl-card">
                  <div class="d-flex align-end">
                    <v-icon class="pl-icon98 chat-set02"></v-icon>
                    <div class="pl-7">
                      <h2 class="pl-subtit">채팅 상담 시 접수 지연 시 메시지를 설정 합니다.</h2>
                      <ul class="pl-list-dot is-no-border">
                        <li>상담준비 메시지는 고객이 문의유형을 선택하였을 때 발송되는 메시지 입니다.</li>
                        <li>고객이 문의유형 선택 후 상담사 배정이 지연됐을 때 발송되는 메시지 입니다.</li>
                        <li><strong>최대 3차 메시지까지 설정 가능</strong>합니다.</li>
                      </ul>
                    </div>
                    <div class="ml-auto">
                      <v-btn class="pl-btn" @click="add_rspnsDelayMsg('delayResponseIndex')">응대지연 메시지 추가</v-btn>
                    </div>
                  </div>
                </div>
                <div class="pl-card">
                  <div style="width: 894px">
                    <div>
                      <h2 class="pl-subtit">응대 지연 자동 멘트</h2>
                      <div class="pl-form-inline-wrap vertical is-mt-s">
                        <div class="pl-form-inline flex-grow-1">
                          <span class="pl-label">
                            메시지
                          </span>
                          <div class="pl-desc">
                            <v-text-field
                              v-model="DELAY_RESPONSE_AUTO_MSG.MSG_CN"
                              class="pl-form flex-grow-1 is-auto"
                              @keydown.enter="previewTemplate(DELAY_RESPONSE_AUTO_MSG.MSG_CN)"
                              v-byte-counter="4000"
                            />
                            <!-- 미리보기 -->
                            <compo-tooltip-btn
                              TitleProp="미리보기"
                              ClassProp="pl-tooltip-btn flex-grow-0"
                              IconProp="pl-icon20 preview"
                              TooltipPositionProp="bottom"
                              @btnClick="previewTemplate(DELAY_RESPONSE_AUTO_MSG.MSG_CN)"
                            ></compo-tooltip-btn>
                            <!-- 메시지 저장 -->
                            <compo-tooltip-btn
                              TitleProp="메시지 저장"
                              ClassProp="pl-tooltip-btn flex-grow-0"
                              IconProp="pl-icon20 is-drag-icon-check"
                              TooltipPositionProp="bottom"
                              @btnClick="sysMsgStrgConfirm(DELAY_RESPONSE_AUTO_MSG,-1,'7',DELAY_RESPONSE_AUTO_MSG)"
                            ></compo-tooltip-btn>
                            <!-- 메시지 삭제 -->
                            <!-- <compo-tooltip-btn
                              TitleProp="메시지 삭제"
                              ClassProp="pl-tooltip-btn flex-grow-0"
                              IconProp="pl-icon20 trash"
                              TooltipPositionProp="bottom"
                              @btnClick="mixin_testLog('메시지 삭제')"
                            ></compo-tooltip-btn> -->
                          </div>
                        </div>
                      </div>
                      <!-- 추가  -->
                      <div v-for="(item,delayResponseIndex) in DELAY_RESPONSE_MSG" :key="delayResponseIndex" class="is-mt-m">
                        <h2 class="pl-subtit">({{ item.ROWNUM }}차) 응대 지연 메시지</h2>
                        <div class="pl-form-inline-wrap vertical is-mt-s">
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              지연 시간
                            </span>
                            <div class="pl-desc">
                              <v-text-field
                                v-model="item.MSG_HR"
                                class="pl-form is-sm flex-grow-0"
                                suffix="분"
                                type="number"
                                oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                                v-byte-counter="4"
                              />
                            </div>
                          </div>
                          <div class="pl-form-inline flex-grow-1">
                            <span class="pl-label">
                              메시지
                            </span>
                            <div class="pl-desc">
                              <v-text-field
                                v-model="item.MSG_CN"
                                class="pl-form flex-grow-1 is-auto"
                                @keydown.enter="previewTemplate(item.MSG_CN)"
                                v-byte-counter="4000"
                              />
                              <!-- 미리보기 -->
                              <compo-tooltip-btn
                                TitleProp="미리보기"
                                ClassProp="pl-tooltip-btn flex-grow-0"
                                IconProp="pl-icon20 preview"
                                TooltipPositionProp="bottom"
                                @btnClick="previewTemplate(item.MSG_CN)"
                              ></compo-tooltip-btn>
                              <!-- 메시지 저장 -->
                              <compo-tooltip-btn
                                TitleProp="메시지 저장"
                                ClassProp="pl-tooltip-btn flex-grow-0"
                                IconProp="pl-icon20 is-drag-icon-check"
                                TooltipPositionProp="bottom"
                                @btnClick="sysMsgStrgConfirm(DELAY_RESPONSE_MSG,delayResponseIndex,'1',BF_DELAY_RESPONSE_MSG_HR)"
                              ></compo-tooltip-btn>
                              <!-- 메시지 삭제 -->
                              <compo-tooltip-btn
                                TitleProp="메시지 삭제"
                                ClassProp="pl-tooltip-btn flex-grow-0"
                                IconProp="pl-icon20 trash"
                                TooltipPositionProp="bottom"
                                @btnClick="sysMsgDelConfirm(DELAY_RESPONSE_MSG,delayResponseIndex,'1')"
                              ></compo-tooltip-btn>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </v-tab-item>
              <!-- 고객 무응답 설정 -->
              <v-tab-item>
                <div class="pl-card">
                  <div class="d-flex align-end">
                    <v-icon class="pl-icon98 chat-set03"></v-icon>
                    <div class="pl-7">
                      <h2 class="pl-subtit">무응답 메시지 마지막 발송 후 자동종료 메시지를 설정 합니다.</h2>
                      <ul class="pl-list-dot is-no-border">
                        <li>상담중 고객이 응답이 없을 때 발송되는 메시지 입니다.</li>
                        <li><strong>최대 3차 메시지까지 설정 가능</strong>합니다.</li>
                      </ul>
                    </div>
                    <div class="ml-auto">
                      <v-btn class="pl-btn" @click="add_custNoRspnsMsg('delayNoResponseIndex')">고객 무응답 메시지 추가</v-btn>
                    </div>
                  </div>
                </div>
                <div class="pl-card">
                  <div style="width: 894px">
                    <div>
                      <div class="pl-setting-list is-mt-m">
                        <div class="pl-setting-list-unit">
                          <div>
                            <div class="pl-setting-list-title">자동종료 설정을 합니다.</div>
                            <div class="pl-setting-list-desc">고객 무응답 메시지 마지막 발송 후 자동종료 설정합니다. 우측의 [토글] 버튼을 On 또는 Off하여 설정할 수 있습니다.</div>
                          </div>
                          <div class="is-right">
                            <v-switch
                              v-model="NO_RESPONSE_AUTO_END"
                              @change="autoEndSet"
                              ></v-switch>
                          </div>
                        </div>
                      </div>
                      <!-- 추가  -->
                      <div v-for="(item,delayNoResponseIndex) in DELAY_NO_RESPONSE_MSG" :key="delayNoResponseIndex" class="is-mt-m">
                        <h2 class="pl-subtit">({{ item.ROWNUM }}차) 고객 무응답 메시지</h2>
                        <div class="pl-form-inline-wrap vertical is-mt-s">
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              지연 시간
                            </span>
                            <div class="pl-desc">
                              <v-text-field
                                v-model="item.MSG_HR"
                                class="pl-form is-sm flex-grow-0"
                                suffix="분"
                                type="number"
                                oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                                v-byte-counter="4"
                              />
                            </div>
                          </div>
                          <div class="pl-form-inline flex-grow-1">
                            <span class="pl-label">
                              메시지
                            </span>
                            <div class="pl-desc">
                              <v-text-field
                                v-model="item.MSG_CN"
                                class="pl-form flex-grow-1 is-auto"
                                @keydown.enter="previewTemplate(item.MSG_CN)"
                                v-byte-counter="4000"
                              />
                              <!-- 미리보기 -->
                              <compo-tooltip-btn
                                TitleProp="미리보기"
                                ClassProp="pl-tooltip-btn flex-grow-0"
                                IconProp="pl-icon20 preview"
                                TooltipPositionProp="bottom"
                                @btnClick="previewTemplate(item.MSG_CN)"
                              ></compo-tooltip-btn>
                              <!-- 메시지 저장 -->
                              <compo-tooltip-btn
                                TitleProp="메시지 저장"
                                ClassProp="pl-tooltip-btn flex-grow-0"
                                IconProp="pl-icon20 is-drag-icon-check"
                                TooltipPositionProp="bottom"
                                @btnClick="sysMsgStrgConfirm(DELAY_NO_RESPONSE_MSG,delayNoResponseIndex,'6', BF_DELAY_NO_RESPONSE_MSG_HR)"
                              ></compo-tooltip-btn>
                              <!-- 메시지 삭제 -->
                              <compo-tooltip-btn
                                TitleProp="메시지 삭제"
                                ClassProp="pl-tooltip-btn flex-grow-0"
                                IconProp="pl-icon20 trash"
                                TooltipPositionProp="bottom"
                                @btnClick="sysMsgDelConfirm(DELAY_NO_RESPONSE_MSG,delayNoResponseIndex,'6')"
                              ></compo-tooltip-btn>
                            </div>
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
        <!-- 미리보기 -->
        <div class="is-vrt is-col-fix " style="width: 460px">
          <div class="pl-card">
            <h2 class="pl-subtit">미리보기</h2>
          </div>
          <div class="pl-phone-bg-wrap is-mt-l">
            <div class="pl-phone-bg">
              <div
                class="pl-phone-sample-list-wrap"
                ref="chatContainer">
                <div
                  v-for="item in TEMPLATE_PREVIEW"
                  :key="item.id"
                  class="pl-phone-sample-list">
                  <span class="pl-phone-sample-list-manager">한국클라우드</span>
                  <span class="pl-phone-sample-list-text">{{ item.text }}</span>
                </div>
              </div>
            </div>
            <ul class="pl-list-info is-mt-l">
              <li>미리보기는 고객의 휴대폰 단말기의 기종 및 고객 개인별 폰트 설정 등에 따라 위 위의 미리보기와 차이가 있을 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
name:"MENU_STG_M0501", //name은 'MENU_' + 파일명 조합
components: {
},
data() {
   return {
    tab: 0,

    // 미리보기
    TEMPLATE_PREVIEW: [
      // { text: '1분간 응답이 없습니다. 상담을 시작하시려면 버튼을 클릭해주세요.', },
    ],

    //접수지연 탭
    CUTTEND_MSG:{},             //상담종료 메시지
    delayIndex: 0,              //접수지연 메시지 개수
    BF_DELAY_MSG_HR:[],            //변경전 접수지연 메시지 리스트
    DELAY_MSG: [],              //접수지연 메시지 리스트

    //응대지연 탭
    DELAY_RESPONSE_AUTO_MSG:{}, //응대지연 자동메시지
    delayResponseIndex: 0,      //응대지연 메시지 개수
    BF_DELAY_RESPONSE_MSG_HR: [],  //변경전 응대지연 메시지 리스트
    DELAY_RESPONSE_MSG: [],     //응대지연 메시지 리스트

    //고객무응답 탭
    delayNoResponseIndex: 0,    //고객무응답 메시지 개수
    BF_DELAY_NO_RESPONSE_MSG_HR: [],  //변경전 고객무응답 메시지 리스트
    DELAY_NO_RESPONSE_MSG: [],  //고객무응답 메시지 리스트

    NO_RESPONSE_AUTO_END: false,//무응답 자동종료 여부 체크

    MSG_INFO: [],               //메시지 저장,삭제 알림창에서 변수 사용 불가능 => 메시지정보 변수
    //알림창 메시지
    MESSAGE : {
      CONFIRM : {
        REG : {alertDialogToggle: true, msg: '메시지를 저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.sysMsgStrg, callNo: this.closeMsg}
        , DEL : {alertDialogToggle: true, msg: '메시지를 삭제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.sysMsgDel, callNo: this.closeMsg}
      },
      ALERT : {
        DEL_SUCCESS : {alertDialogToggle: true, msg: '삭제가 완료되었습니다', iconClass: 'is-info', type: 'default'}
        , REG_SUCCESS : {alertDialogToggle: true, msg: '저장이 완료되었습니다', iconClass: 'is-info', type: 'default'}
        , SET_SUCCESS : {alertDialogToggle: true, msg: '설정이 변경되었습니다', iconClass: 'is-info', type: 'default'}
        , VALID_MSG_HR : {alertDialogToggle: true, msg: '지연시간을 입력해주세요', iconClass: 'is-info', type: 'default'}
        , MSG_HR_ERR : {alertDialogToggle: true, msg: '지연시간은<br>마이너스(-,음수)가 될 수 없습니다', iconClass: 'is-info', type: 'default'}
        , MSG_HR_DUPL : {alertDialogToggle: true, msg: '중복된 지연시간이 있습니다', iconClass: 'is-info', type: 'default'}
        , VALID_MSG_CN : {alertDialogToggle: true, msg: '메시지를 입력해주세요', iconClass: 'is-info', type: 'default'}
      },
      ERROR : {
        ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
      },
      TOAST : {
        DEL_SUCCESS :  { msg: '삭제가 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        , REG_SUCCESS : { msg: '저장이 완료되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        , SET_SUCCESS : { msg: '설정이 변경되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
      }
    },

    //필수값 체크
    valid : true,
    validateRules: {
      CD_TY: [
        v => !!v || '코드 유형 은(는) 필수 입력 항목입니다.',
      ],
      COMM_CD: [
        v => !!v || '분류 코드 은(는) 필수 입력 항목 입니다.',
      ],
      CD_NM: [
        v => !!v || '분류코드 명 은(는) 필수 입력 항목 입니다.',
      ],
      USE_YN: [
        v => !!v || '사용 여부 은(는) 필수 입력 항목 입니다.',
      ],
    }
   }
 },

  watch: {
    TEMPLATE_PREVIEW: {
      handler() {
        this.$nextTick(() => {
          this.scrlToBottom();
        });
      },
      deep: true,
      immediate: true
    }
  },

  computed: {

  },

  created() {

  },

  mounted() {
    this.tabChg();
  },

  methods: {
    previewTemplate(textValue){
      if(textValue.length > 0) {
        this.TEMPLATE_PREVIEW.push({
          text: textValue
        });
      }
    },
    initPreview() {
      this.TEMPLATE_PREVIEW = [];
    },
    // 추가, 삭제 공통 함수
    add_msg(delayArray, index, maxIndex) {
      if (delayArray.length >= maxIndex) {
        return false;
      } else {
        let newIndex = this[`${index}`] = this[`${index}`] + 1;
        delayArray.push({
          title: newIndex,
          MSG_HR: '',
          MSG_CN: '',
          SYS_MSG_ID:''
        });
        return true;
      }
    },
    remove_msg(array, item, index2) {
      const index = array.findIndex((element) => element === item);
      this[`${index2}`] = this[`${index2}`] - 1;

      if (index !== -1) {
        array.splice(index, 1);
      }
    },

    // 접수지연
    add_delayMsg(index) {
      return this.add_msg(this.DELAY_MSG, index, 3);
    },
    remove_delayMsg(item) {
      this.remove_msg(this.DELAY_MSG, item, 'delayIndex');
    },

    // 응대지연
    add_rspnsDelayMsg(index) {
      return this.add_msg(this.DELAY_RESPONSE_MSG, index, 3);
    },

    remove_rspnsDelayMsg(item) {
      this.remove_msg(this.DELAY_RESPONSE_MSG, item, 'delayResponseIndex');
    },

    // 고객 무응답
    add_custNoRspnsMsg(index) {
      return this.add_msg(this.DELAY_NO_RESPONSE_MSG, index, 3);
    },

    remove_custNoRspnsMsg(item) {
      this.remove_msg(this.DELAY_NO_RESPONSE_MSG, item, 'delayNoResponseIndex');
    },

    //상담종료메시지 조회
    async sysMsgSrch(sysMsgId){
      let sUrl = '/chat-api/setting/message-manage/by-se-cd/inqire';
      let postParam = {
        SYS_MSG_ID: sysMsgId
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        //메시지 세팅
        if(sysMsgId == "2"){             //상담종료메시지
          this.CUTTEND_MSG = resData.DATA[0];
        } else if(sysMsgId == "9") {      //접수지연메시지
          this.DELAY_MSG = resData.DATA;
          this.BF_DELAY_MSG_HR = [];
          for(let i=0;i<resData.DATA.length;i++){
            this.BF_DELAY_MSG_HR.push(resData.DATA[i].MSG_HR);
          }
          this.delayIndex = this.DELAY_MSG.length;
        } else if(sysMsgId == "7") {  //응대지연 자동멘트
          this.DELAY_RESPONSE_AUTO_MSG = resData.DATA[0];
        } else if(sysMsgId == "1") {      //응대지연메시지
          this.DELAY_RESPONSE_MSG = resData.DATA;
          this.BF_DELAY_RESPONSE_MSG_HR = [];
          for(let i=0;i<resData.DATA.length;i++){
            this.BF_DELAY_RESPONSE_MSG_HR.push(resData.DATA[i].MSG_HR);
          }
          this.delayResponseIndex = this.DELAY_RESPONSE_MSG.length;
        } else if(sysMsgId == "6") {      //고객무응답 메시지
          this.DELAY_NO_RESPONSE_MSG = resData.DATA;
          this.BF_DELAY_NO_RESPONSE_MSG_HR = [];
          for(let i=0;i<resData.DATA.length;i++){
            this.BF_DELAY_NO_RESPONSE_MSG_HR.push(resData.DATA[i].MSG_HR);
          }
          this.delayNoResponseIndex = this.DELAY_NO_RESPONSE_MSG.length;
          this.NO_RESPONSE_AUTO_END = resData.CHAT_END[0].STNG_VL == 'N' ? false : true;
        }
      }
    },

    //탭 변경
    tabChg(){
      if(this.tab == 0){  //접수지연탭
        this.sysMsgSrch("2"); //상담종료 자동메시지
        this.sysMsgSrch("9");  //접수지연 메시지
      } else if(this.tab == 1){ //응대지연 탭
        this.sysMsgSrch("7");  //응대지연 자동메시지
        this.sysMsgSrch("1");      //응대지연 메시지
      } else if(this.tab == 2){ //고객무응답 탭
        this.sysMsgSrch("6");      //고객무응답 메시지
                                        //고객무응답 여부 조회
      }
    },

    //메시지 저장 알림창
    sysMsgStrgConfirm(msg, msgIndex, sysMsgId, bfMsg){
      if(msgIndex != -1){
        if(msg[msgIndex]["MSG_HR"] == ''){
          this.showAlert(this.MESSAGE.ALERT.VALID_MSG_HR);
          return
        } else if(msg[msgIndex]["MSG_HR"].includes('-')){
          this.showAlert(this.MESSAGE.ALERT.MSG_HR_ERR);
          return
        }
        if(msg[msgIndex]["MSG_CN"] == ''){
          this.showAlert(this.MESSAGE.ALERT.VALID_MSG_CN);
          return
        }
      }

      this.MSG_INFO[0] = msg;
      this.MSG_INFO[1] = msgIndex;
      this.MSG_INFO[2] = sysMsgId;
      this.MSG_INFO[3] = bfMsg

      this.showAlert(this.MESSAGE.CONFIRM.REG);
    },

    //메시지 저장
    async sysMsgStrg(){
      let msg = this.MSG_INFO[0];
      let msgIndex = this.MSG_INFO[1];
      let sysMsgId = this.MSG_INFO[2];
      let bfMsg = this.MSG_INFO[3];

      let msgInfo = msgIndex == -1 ? msg : msg[msgIndex];
      let bfMsgInfo = '';

      let leng = bfMsg.length;
      if(parseInt(msgIndex)>bfMsg.length-1){      //신규일때
        for(let i=0;i<leng-1;i++){
          if(msg[i]["MSG_HR"] == msgInfo.MSG_HR){
            this.showAlert(this.MESSAGE.ALERT.MSG_HR_DUPL);
            return
          }
        }
        bfMsgInfo = '-1';
      } else {    //수정일때
        bfMsgInfo = msgIndex == -1 ? bfMsg.MSG_HR : bfMsg[msgIndex];
      }

      let sUrl = '/chat-api/setting/message-manage/regist';
      let postParam = {
        SYS_MSG_ID: sysMsgId,
        MSG_HR: msgInfo.MSG_HR,
        MSG_CN: msgInfo.MSG_CN,
        BF_MSG_HR: bfMsgInfo
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.sysMsgSrch(sysMsgId);
        this.closeMsg();
        this.showToast(this.MESSAGE.TOAST.REG_SUCCESS);
        // this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS);
      }
    },

    //메시지 삭제 알림창
    sysMsgDelConfirm(msg, msgIndex, sysMsgId){
      if(msg[msgIndex].SYS_MSG_ID == ''){
        if(sysMsgId == "9") {      //접수지연메시지
          this.remove_delayMsg(msg[msgIndex])
        } else if(sysMsgId == "1") {      //응대지연메시지
          this.remove_rspnsDelayMsg(msg[msgIndex])
        } else if(sysMsgId == "6") {      //고객무응답 메시지
          this.remove_custNoRspnsMsg(msg[msgIndex])
        }
        return;
      }
      this.MSG_INFO[0] = msg;
      this.MSG_INFO[1] = msgIndex;
      this.MSG_INFO[2] = sysMsgId;

      this.showAlert(this.MESSAGE.CONFIRM.DEL);
    },

    //메시지 삭제
    async sysMsgDel(){
      let msg = this.MSG_INFO[0];
      let msgIndex = this.MSG_INFO[1];
      let sysMsgId = this.MSG_INFO[2];

      let msgInfo = msgIndex == -1 ? msg : msg[msgIndex];
      let sUrl = '/chat-api/setting/message-manage/delete';
      let postParam = {
        SYS_MSG_ID: msgInfo.SYS_MSG_ID,
        MSG_HR : msgInfo.MSG_HR
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.sysMsgSrch(sysMsgId);
        this.closeMsg();
        this.showToast(this.MESSAGE.TOAST.DEL_SUCCESS)
        // this.showAlert(this.MESSAGE.ALERT.DEL_SUCCESS);
      }
    },

    async autoEndSet(){
      let sUrl = '/chat-api/setting/manage/modify';
      let postParam = {
        STNG_CD:"CUST_NORESP_CHATEND",
        STNG_NM:"고객무응답메시지전송후채팅종료",
        STNG_VL:this.NO_RESPONSE_AUTO_END == false ? 'N' : 'Y'
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.sysMsgSrch("6");
        this.showToast(this.MESSAGE.TOAST.SET_SUCCESS);
        // this.showAlert(this.MESSAGE.ALERT.SET_SUCCESS);
      }
    },

    //알림창 닫기
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    //시스템 메시지 중복 체크

    //미리보기 하단으로
    scrlToBottom() {
      if(this.$refs.chatContainer) {
        this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
      }
    },
  },

}
</script>

<style lang="scss" scoped>

</style>