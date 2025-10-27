<template>
  <v-form ref="form">
    <div>
      <div class="pl-card">
        <p>
          고객에게 문자, 이메일, 카카오톡 등으로 연락처 정보를 전달할 수 있습니다.<br/>연락 정보는 사전에 등록된 정보에 한하여 전달할 수 있습니다.
        </p>
        <h2 class="pl-subtit is-mt-m">VOC 접수 정보</h2>
        <div class="pl-dialog-body-desc">
          <div class="pl-cols" style="gap: 30px">
            <div>
              <div class="pl-form-inline-wrap vertical">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    VOC 유형
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-radio-group
                      v-model="VOC_TYPE_CD"
                      row
                      class="pl-radio-group"
                      :disabled="this.VOC_RCPT_ID>-1?true:false"
                      :rules="validateRules.VOC_TYPE_CD"
                    >
                      <v-radio
                        v-for="(vocTpInfo) in mixin_common_code_get(this.common_code, 'VOC_TP')"
                        :key="vocTpInfo.value"
                        :label="vocTpInfo.text"
                        :value="vocTpInfo.value"
                        class="pl-radio"
                      >
                      </v-radio>
                    </v-radio-group>
                  </div>
                </div>

                <div class="pl-form-inline">
                  <span class="pl-label">
                    중요도
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-select
                      v-model="IPTT_CD"
                      class="pl-form"
                      :items="mixin_common_code_get(this.common_code, 'IMPT')"
                      :disabled="this.VOC_RCPT_ID>-1?true:false"
                      placeholder="선택하세요"
                      :rules="validateRules.IPTT_CD"
                    ></v-select>
                  </div>
                </div>

                <div class="pl-form-inline">
                  <span class="pl-label">
                    익명 여부
                  </span>
                  <div class="pl-desc">
                    <v-select
                      v-model="NM_YN_CD"
                      class="pl-form"
                      :items="mixin_common_code_get(this.common_code, 'ANY_WT')"
                      :disabled="this.VOC_RCPT_ID>-1?true:false"
                      placeholder="선택하세요"
                    ></v-select>
                  </div>
                </div>

                <div class="pl-form-inline">
                  <span class="pl-label">
                    고객명
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      v-model="CUST_NM"
                      class="pl-form"
                      :rules="validateRules.CUST_NM"
                      :disabled="this.VOC_RCPT_ID>-1?true:false"
                      v-byte-counter="100"
                    ></v-text-field>
                  </div>
                </div>

              </div>
            </div>
            <!-- right -->
            <div>
              <div class="pl-form-inline-wrap vertical">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    접수 채널
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-select
                      v-model="CHN_TYPE_CD"
                      class="pl-form"
                      :items="mixin_common_code_get(this.common_code, 'CHNL')"
                      placeholder="선택하세요"
                      :rules="validateRules.CHN_TYPE_CD"
                      @change="changeChnType"
                      disabled
                    ></v-select>
                    <v-select
                      v-model="CHN_TYPE_DTL_CD"
                      class="pl-form"
                      :items="mixin_common_code_get(this.common_code, 'CHNL_CL')"
                      placeholder="선택하세요"
                      :disabled="chnTypeDtlDisabled"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    고객 유형
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-select
                      v-model="CUST_TYPE_CD"
                      class="pl-form"
                      :items="mixin_common_code_get(this.common_code, 'VOC_CUST_TP')"
                      :disabled="this.VOC_RCPT_ID>-1?true:false"
                      placeholder="선택하세요"
                      :rules="validateRules.CUST_TYPE_CD"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    고객 성향
                  </span>
                  <div class="pl-desc">
                    <v-select
                      v-model="CUST_TDCY_CD"
                      class="pl-form"
                      :items="mixin_common_code_get(this.common_code, 'CUST_PS')"
                      :disabled="this.VOC_RCPT_ID>-1?true:false"
                      placeholder="선택하세요"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    연락처
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <template v-if="this.VOC_RCPT_ID>-1">
                      <v-text-field
                      ref="TELNO"
                      v-model="TELNO"
                      class="pl-form"
                      :disabled="this.VOC_RCPT_ID>-1?true:false"
                      :rules="validateRules.TELNO"
                      ></v-text-field>
                    </template>
                    <template v-else>
                    <v-text-field
                      ref="TELNO"
                      v-model="TELNO"
                      class="pl-form"
                      :disabled="this.VOC_RCPT_ID>-1?true:false"
                      :rules="validateRules.TELNO"
                      hide-spin-buttons
                      type="number"
                      oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                      v-byte-counter="60"
                      ></v-text-field>
                    </template>
                  </div>
                </div>

              </div>
            </div>
          </div>


        </div>

      </div>
      <div class="pl-card is-border">
        <h2 class="pl-subtit">VOC 내용</h2>
        <div class="pl-dialog-body-desc">
          <div class="pl-form-inline-wrap vertical">
            <div class="pl-form-inline">
              <span class="pl-label">
                내용 요약
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="VOC_TTL"
                  class="pl-form"
                  :disabled="this.VOC_RCPT_ID>-1?true:false"
                  :rules="validateRules.VOC_TTL"
                  v-byte-counter="200"
                ></v-text-field>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                접수 내용
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-textarea
                  v-model="VOC_CN"
                  class="pl-form is-noresize"
                  :disabled="this.VOC_RCPT_ID>-1?true:false"
                  :rules="validateRules.VOC_CN"
                  :spellcheck="false"
                  v-byte-counter="4000"
                />
              </div>
            </div>
          </div>
          <div class="pl-cols" style="gap: 30px; margin-top: 10px">
            <div>
              <div class="pl-form-inline-wrap vertical">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    결과통보 여부
                  </span>
                  <div class="pl-desc">
                    <v-select
                      v-model="RSLT_PVSN_CD"
                      class="pl-form"
                      :items="mixin_common_code_get(this.common_code, 'NOTR_WT')"
                      :disabled="this.VOC_RCPT_ID>-1?true:false"
                      placeholder="선택하세요"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    예약콜
                    <compo-tooltip-btn
                      TitleProp="예약콜로 처리 하시려면 우측의 체크박스를<br>체크 하신 후 날짜를 지정하십시오."
                      ClassProp="pl-tooltip-btn"
                      IconProp="pl-icon20 question"
                      TooltipPositionProp="bottom"
                    ></compo-tooltip-btn>
                  </span>
                  <div class="pl-desc is-reserveCall" v-if="this.VOC_RCPT_ID === -1">
                    <v-checkbox
                      v-model="chkDateReserve"
                      class="pl-check"
                      :disabled="this.VOC_RCPT_ID>-1?true:false"
                      @click="toggleChkReserve($event)"
                    ></v-checkbox>
                    <compo-date-picker
                      v-if="dateReservePicker"
                      DateType="dateTime"
                      :DateProp.sync="dateTimeDate"
                      :TimesProp.sync="selectedTime"
                      />
                    <!-- 예약콜 간편 모달 -->
                    <div
                      v-show="dropDateReserve"
                      class="pl-drop-layer is-dateReserve"
                      :style="{ position: 'fixed', top: `${posY}px`, left: `${posX}px` }"
                      >
                      <div class="pl-drop-layer-header">
                        예약콜 알림시간
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
                  <div class="pl-desc is-reserveCall" v-else>
                    {{ RSVT_CL_DT }}
                  </div>
                </div>
              </div>
            </div>
            <!-- right -->
            <div>
              <div class="pl-form-inline-wrap vertical">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    결과통보 수단
                  </span>
                  <div class="pl-desc">
                    <v-select
                      v-model="RSLT_PVSN_MTHD_CD"
                      class="pl-form"
                      :items="mixin_common_code_get(this.common_code, 'NOTR_TL')"
                      :disabled="this.VOC_RCPT_ID>-1?true:false"
                      placeholder="선택하세요"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    연락처
                  </span>
                  <div class="pl-desc">
                    <template v-if="this.VOC_RCPT_ID>-1">
                      <v-text-field
                        v-model="RSVT_CL_TELNO"
                        class="pl-form"
                        :disabled="this.VOC_RCPT_ID>-1?true:false"
                      ></v-text-field>
                    </template>
                    <template v-else>
                      <v-text-field
                        v-model="RSVT_CL_TELNO"
                        class="pl-form"
                        :disabled="this.VOC_RCPT_ID>-1?true:false"
                        hide-spin-buttons
                        type="number"
                        oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                        v-byte-counter="60"
                      ></v-text-field>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-form>
</template>

<script>
  export default {
    name: 'CompoVoc',
    props: {
      CHNL: {
        type: String, default: 'TEL'
      },
      CUST_ID: {
        type: Number, default: -1
      },
      TARGET_CUST_NM: {
        type: String, default: '성명미상'
      },
      VOC_RCPT_ID: {
        type: Number, default: -1
      },
      DataProp: {
        type: Object,
      }
    },
    data() {
      return {
        common_code : [],

        posX: 0,
        posY: 0,

        // 접수정보
        VOC_TYPE_CD : '1', //voc 유형 코드 (불만으로 기본 셋팅)
        CHN_TYPE_CD : this.CHNL, //채널
        CHN_TYPE_DTL_CD : '', //채널 상세
        chnTypeDtlDisabled : this.CHNL === 'SNS'?false:true,
        IPTT_CD : '', //중요도
        CUST_TYPE_CD : '', //고객 유형 코드
        NM_YN_CD : '', //익명 여부 코드
        CUST_TDCY_CD : '', //고객 성향 코드
        CUST_NM : '', //고객 명
        TELNO : '', //전화번호

        //내용
        VOC_TTL : '', //내용 요약(voc 제목)
        VOC_CN : '', //접수 내용
        RSLT_PVSN_CD : 'N', //결과 통보 코드
        RSLT_PVSN_MTHD_CD : 'NOT', //결과 통보 방법 코드
        RSVT_CL_YN : 'N', //예약콜 여부
        RSVT_CL_DT : '', //예약콜 일시
        RSVT_CL_TELNO : '', //예약콜 전화번호
        chkDateReserve: this.RSVT_CL_YN === 'Y'? true:false,

        dropDateReserve: false,
        dateReservePicker: false,

        dateTimeDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        dateTimeTime: new Date(),

        // dateTimeDate : this.mixin_convertDate(this.mixin_getSvrDate("YYYYMMDDHH24MISS"), 'yyyy-MM-dd'),
        // dateTimeTime : new Date(this.mixin_convertDate(this.mixin_getSvrDate("YYYYMMDDHH24MISS"), 'yyyy-MM-dd HH:mm:ss')),

        //예약콜
        times: [
          { label: "30분 후", date: ["dateTimeDate","dateTimeTime", 0, 0, 30] },
          { label: "1시간 후", date: ["dateTimeDate","dateTimeTime", 0, 1, 0] },
          { label: "내일", date: ["dateTimeDate", "dateTimeTime", 1, 0, 0] },
          { label: "이틀 후", date: ["dateTimeDate", "dateTimeTime", 2, 0, 0] },
          { label: "다음 주", date: ["dateTimeDate", "dateTimeTime", 7, 0, 0] }
        ],
        selectedTime: '',

        //confirm alert 메시지
        MESSAGE : {
          CONFIRM : {
            REG : {alertDialogToggle: true, msg: '저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.vocSave, callNo: this.closeMsg}
          },
          ALERT : {
            SUCCESS : {alertDialogToggle: true, msg: '정상 처리 되었습니다.', iconClass: 'is-info', type: 'default'}
          },
          ERROR : {
            ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
          },
          TOAST : {
            SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 },
          }
        },

        valid : true,
        validateRules: {
          VOC_TYPE_CD: [
            v => !!v || 'VOC 유형 은(는) 필수 입력 항목 입니다.',
          ],
          IPTT_CD: [
            v => !!v || '중요도 은(는) 필수 입력 항목 입니다.',
          ],
          CUST_NM: [
            v => !!v || '고객명 은(는) 필수 입력 항목 입니다.',
          ],
          CHN_TYPE_CD: [
            v => !!v || '접수 채널 은(는) 필수 입력 항목 입니다.',
          ],
          CUST_TYPE_CD: [
            v => !!v || '고객 유형 은(는) 필수 입력 항목 입니다.',
          ],
          TELNO: [
            v => !!v || '연락처 은(는) 필수 입력 항목 입니다.',
          ],
          VOC_TTL: [
            v => !!v || '내용 요약 은(는) 필수 입력 항목 입니다.',
          ],
          VOC_CN: [
            v => !!v || '접수 내용 은(는) 필수 입력 항목 입니다.',
          ],
        }
      }
    },

    watch: {
      CUST_ID(){
        this.resetValidation();
      },
      VOC_RCPT_ID(){
        if(this.VOC_RCPT_ID > -1) {
          this.$nextTick(()=>{
            // console.log('VOC_RCPT_ID : ', this.VOC_RCPT_ID);
            this.initVocDtlInfo();
          });
        }
      }
    },

    computed :{
    },

    async created() {
      //공통코드설정
      let codeName = ['VOC_TP', 'CHNL', 'CHNL_CL', 'IMPT', 'VOC_CUST_TP', 'ANY_WT', 'CUST_PS', 'NOTR_WT', 'NOTR_TL'];
      this.common_code = await this.mixin_common_code_get_all(codeName);

      if(this.VOC_RCPT_ID === -1) this.CUST_NM = this.TARGET_CUST_NM;
    },

    mounted() {
      if(this.VOC_RCPT_ID > -1) {
        this.$nextTick(()=>{
          // console.log('VOC_RCPT_ID : ', this.VOC_RCPT_ID);
          this.initVocDtlInfo();
        });
      }
      // console.log(this.CHNL);
    },

    methods: {
      saveVocData() {
        if (!this.validate()) {
          return;
        }

        // if(!this.isValidIpAddr(this.DTL_IP)){
        //   this.showAlert(this.MESSAGE.ALERT.IP_CHECK);
        //   return;
        // }

        this.showAlert(this.MESSAGE.CONFIRM.REG);
      },

      //validate check
      validate () {
        return this.$refs.form.validate();
      },

      //등록 및 상세보기 form 초기화
      resetValidation() {
        this.$refs.form.reset();
        this.VOC_TYPE_CD = '1';
        this.CHN_TYPE_CD = this.CHNL;
        this.chnTypeDtlDisabled = this.CHN_TYPE_CD === 'SNS'?false:true;
        this.RSLT_PVSN_CD = 'N';
        this.RSLT_PVSN_MTHD_CD = 'NOT';
        this.RSVT_CL_YN = 'N';
        this.chkDateReserve = false;
        this.dropDateReserve = false;
        this.dateReservePicker = false;
      },

      //등록 수정
      async vocSave() {
        let sUrl = '/api/common/voc/vocProc';
        let postParam = {
          VOC_RCPT_ID : this.VOC_RCPT_ID
          , CUST_ID : this.CUST_ID
          , VOC_TYPE_CD : this.VOC_TYPE_CD
          , VOC_TYPE_DTL_CD : this.VOC_TYPE_DTL_CD
          , CHN_TYPE_CD : this.CHN_TYPE_CD
          , CHN_TYPE_DTL_CD : this.CHN_TYPE_DTL_CD
          , IPTT_CD : this.IPTT_CD
          , CUST_TYPE_CD : this.CUST_TYPE_CD
          , NM_YN_CD : this.NM_YN_CD
          , CUST_TDCY_CD : this.CUST_TDCY_CD
          , CUST_NM : this.CUST_NM
          , TELNO : this.TELNO
          , VOC_TTL : this.VOC_TTL
          , VOC_CN : this.VOC_CN
          , RSLT_PVSN_CD : this.RSLT_PVSN_CD
          , RSLT_PVSN_MTHD_CD : this.RSLT_PVSN_MTHD_CD
          , RSVT_CL_YN : this.RSVT_CL_YN
          , RSVT_CL_DT : this.RSVT_CL_YN === 'Y'?this.dateTimeDate.replace(/-/gi, '')+this.selectedTime.replace(/:/gi, '')+'00':''
          , RSVT_CL_TELNO : this.RSVT_CL_TELNO
        }

        let headParam = {
          head : {
          }
        }

        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          // this.showAlert(this.MESSAGE.ALERT.SUCCESS);
          this.showToast(this.MESSAGE.TOAST.SUCCESS);
          this.resetValidation();
          // this.getGridList();
        }
      },

      closeMsg() {
        this.$store.commit("alertStore/hideAlert");
      },

      // 예약콜
      async toggleChkReserve(event) {
        this.posX = event.clientX + 10;
        this.posY = event.clientY - 50;

        if( this.chkDateReserve === true) {
          this.dropDateReserve = true;
          this.RSVT_CL_YN = 'Y';
          this.dateTimeDate = await this.mixin_convertDate(await this.mixin_getSvrDate("YYYYMMDDHH24MISS"), 'yyyy-MM-dd');
          this.dateTimeTime = new Date(await this.mixin_convertDate(await this.mixin_getSvrDate("YYYYMMDDHH24MISS"), 'yyyy-MM-dd HH:mm:ss'));
        } else {
          this.dropDateReserve = false;
          this.dateReservePicker = false;
          this.RSVT_CL_YN = 'N';
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
        // this.selectedAmpm = `${getDate[2]}`;

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

        // newTimeHours = newTimeHours % 12 || 12;

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

      changeChnType() {
        if(this.CHN_TYPE_CD === 'TEL'){
          this.chnTypeDtlDisabled = true;
        }else{
          this.chnTypeDtlDisabled = false;
        }
      },

      autoPhoneNum(value) {
        // let value = this.$refs.TELNO.value;
        // console.log(value);
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

      initVocDtlInfo() {
        this.VOC_TYPE_CD = '1';
        this.IPTT_CD = '';
        this.NM_YN_CD = '';
        this.CUST_NM = '';
        this.CHN_TYPE_CD = 'TEL';
        this.CHN_TYPE_DTL_CD = '';
        this.CUST_TYPE_CD = '';
        this.CUST_TDCY_CD = '';
        this.TELNO = '';
        this.VOC_TTL = '';
        this.VOC_CN = '';
        this.RSLT_PVSN_CD = 'N';
        this.RSVT_CL_YN = 'N';
        this.RSLT_PVSN_MTHD_CD = 'NOT';
        this.RSVT_CL_TELNO = '';
        this.chkDateReserve = this.RSVT_CL_YN === 'Y'? true:false;
        this.RSVT_CL_DT = '';
        
        this.setVocDtlInfo();
      },

      setVocDtlInfo() {
        this.VOC_TYPE_CD = this.DataProp.VOC_TYPE_CD;
        this.IPTT_CD = this.DataProp.IPTT_CD;
        this.NM_YN_CD = this.DataProp.NM_YN_CD;
        this.CUST_NM = this.VOC_RCPT_ID>-1?this.mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? this.mixin_mask_name(this.DataProp.CUST_NM) : this.DataProp.CUST_NM : this.DataProp.CUST_NM;
        this.CHN_TYPE_CD = this.DataProp.CHN_TYPE_CD;
        this.CHN_TYPE_DTL_CD = this.DataProp.CHN_TYPE_DTL_CD;
        this.CUST_TYPE_CD = this.DataProp.CUST_TYPE_CD;
        this.CUST_TDCY_CD = this.DataProp.CUST_TDCY_CD;
        // this.TELNO = this.DataProp.TELNO;
        this.TELNO = this.VOC_RCPT_ID>-1?this.mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? this.mixin_mask_num(this.DataProp.TELNO.replace(/-/gi, '')) : this.DataProp.TELNO.replace(/-/gi, '') : this.DataProp.TELNO.replace(/-/gi, '');
        this.VOC_TTL = this.DataProp.VOC_TTL;
        this.VOC_CN = this.DataProp.VOC_CN;
        this.RSLT_PVSN_CD = this.DataProp.RSLT_PVSN_CD;
        this.RSVT_CL_YN = this.DataProp.RSVT_CL_YN;
        this.RSLT_PVSN_MTHD_CD = this.DataProp.RSLT_PVSN_MTHD_CD;
        // this.RSVT_CL_TELNO = this.DataProp.RSVT_CL_TELNO.replace(/-/gi, '');
        this.RSVT_CL_TELNO = this.VOC_RCPT_ID>-1?this.mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? this.mixin_mask_num(this.DataProp.RSVT_CL_TELNO.replace(/-/gi, '')) : this.DataProp.RSVT_CL_TELNO.replace(/-/gi, '') : this.DataProp.RSVT_CL_TELNO.replace(/-/gi, '');
        this.chkDateReserve = this.DataProp.RSVT_CL_YN === 'Y'? true:false;
        if(this.DataProp.RSVT_CL_YN === 'Y'){
          this.RSVT_CL_DT = this.mixin_convertDate(this.DataProp.RSVT_CL_DT, 'yyyy-MM-dd HH:mm:ss');
        }
      },
    },

  }
</script>

<style lang="scss" scoped>

</style>