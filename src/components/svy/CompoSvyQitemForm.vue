<template>
  <v-form ref="form">
    <h2 v-if="blockTitle" class="pl-subtit">{{ blockTitle }}</h2>
    <div :class="MNG_TYPE == 'SRVY_QITEM_CRT' ? 'pl-card-form-body' : ''">
      <div class="pl-form-inline-wrap vertical">
        <div
          v-if="MNG_TYPE == 'SRVY_QITEM_CRT'"
          class="pl-form-inline"
        >
          <span class="pl-label">
            필수 여부
            <!-- <v-icon class="pl-icon20 required"></v-icon> -->
          </span>
          <div class="pl-desc">
            <!-- SUV002 -->
            <v-checkbox class="pl-check" label="필수항목" v-model="gQuData.ESNTL_YN"></v-checkbox>
          </div>
        </div>
        <div
          v-if="MNG_TYPE == 'SRVY_QITEM_TMPL'"
          class="pl-form-inline"
        >
          <span class="pl-label">
            공개 여부
          </span>
          <div class="pl-desc">
            <v-radio-group
              v-model="gQuData.RLS_YN"
              row
              class="pl-radio-group"
              :rules="validateRules.RLS_YN"
            >
              <v-radio
                v-for="(item) in radioGroupRlsYn"
                :key="item.value"
                :label="item.text"
                :value="item.value"
                class="pl-radio"
              />
            </v-radio-group>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            질문 제목
            <v-icon class="pl-icon20 required"></v-icon>
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form"
              v-model="gQuData.SRVY_QITEM_CN"
              required
              :rules="validateRules.SRVY_QITEM_CN"
              v-byte-counter="4000"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">질문 설명</span>
          <div class="pl-desc">
            <v-textarea
                class="pl-form is-noresize flex-grow-1"
                placeholder="설명을 입력 하십시오."
                v-model="gQuData.SRVY_QITEM_EXPLN"
                v-byte-counter="4000"
                :spellcheck="false"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            질문 유형
            <v-icon class="pl-icon20 required"></v-icon>
          </span>
          <div class="pl-desc">
            <v-select class="pl-form is-lg flex-grow-0" :items="mixin_common_code_get(this.common_code, 'SUVY_QST_TP', '')"
              v-model="gQuData.QITEM_TYPE_CD"
              @change="showQuesType"
              placeholder="선택하세요"
              required
              :rules="validateRules.QITEM_TYPE_CD"
              :disabled="!mixin_isEmpty(gQuData.SRVY_QITEM_ID)"
            />
            <!-- 옵션 체크 -->
            <!-- 단일 선택형 -->
            <template v-if="questionFlag_2">
              <v-checkbox
                class="pl-check"
                label="설문결과 환산 값 표시"
                v-model="gQuData.SCR_USE_YN"
                @change="initScore"
                :value="gQuData.SCR_USE_YN"></v-checkbox>
              <v-checkbox
                v-if="MNG_TYPE == 'SRVY_QITEM_CRT'"
                class="pl-check ml-2"
                label="블록 이동 사용"
                v-model="gQuData.GROUP_MVMN_USE_YN"
                :value="gQuData.GROUP_MVMN_USE_YN"></v-checkbox>
            </template>
            <!-- 날짜 선택형 -->
            <template v-if="questionFlag_7">
              <div class="d-flex align-center" style="gap: 8px">
                <v-checkbox v-model="gQuData.HR_APLCN_YN" class="pl-check" label="시간 포함" />
              </div>
            </template>

          </div>
        </div>
        <!-- 단일 선택형 -->
        <!-- 복수 선택형 -->
        <div class="pl-form-inline" v-if="questionFlag_1">
          <span class="pl-label">
            선택 허용 수
            <v-icon class="pl-icon20 required"></v-icon>
          </span>
          <div class="pl-desc">
            <v-select class="pl-form is-lg flex-grow-0" :items="mixin_common_code_get(this.common_code, 'SELT_ALW_NB', '')"
              v-model="gQuData.CHC_PM_CNT"
              placeholder="선택하세요"
            ></v-select>
          </div>
        </div>

        <!-- 단일 선택형 추가 항목 레이블 -->
        <template v-if="questionFlag_2">
          <div :class="`d-flex justify-end ${gQuData.SCR_USE_YN && gQuData.GROUP_MVMN_USE_YN ? 'pr-15' : gQuData.SCR_USE_YN ? 'pr-2' : 'pr-15'}`">
            <span
              v-if="gQuData.SCR_USE_YN"
              class="pl-label" :style="gQuData.GROUP_MVMN_USE_YN ? 'margin-right: 45px' : 'margin-right: 30px'">환산 값</span>
            <v-tooltip
              v-if="gQuData.GROUP_MVMN_USE_YN"
              content-class="pl-tooltip top " top>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on" class="pl-label">다음 블록 정보</span>
              </template>
              <span>해당 보기를 선택한 경우 이동할 다음 블록정보를 선택합니다.</span>
            </v-tooltip>
          </div>
        </template>

        <!-- 단일, 복수 선택형 보기 리스트 -->
        <div class="pl-form-inline" v-if="questionFlag_1 || questionFlag_2">
          <span class="pl-label"></span>
          <div class="pl-desc flex-column align-start">
            <div class="pl-question-list" style="width: 100%">
              <draggable ghost-class="ghost" v-model="ANSWER_LIST">
                <div
                  v-for="(answer, index) in ANSWER_LIST"
                  :key="index"
                  class="pl-question-list-unit">
                  <v-text-field
                    class="pl-form flex-grow-1"
                    v-model="answer.QITEM_CHC_CN"
                    required
                    :rules="validateRules.QITEM_CHC_CN"
                    v-byte-counter="4000"
                  ></v-text-field>
                  <!-- 환산 값 -->
                  <v-text-field
                    v-if="gQuData.SCR_USE_YN"
                    v-model="answer.SCR"
                    class="pl-form is-xss ml-2"
                  ></v-text-field>
                  <!-- 다음 블록 정보 -->
                  <v-select
                    v-if="MNG_TYPE == 'SRVY_QITEM_CRT' && gQuData.GROUP_MVMN_USE_YN"
                    v-model="answer.MVMN_SRVY_QITEM_GROUP_ID"
                    :items="MVMN_SRVY_QITEM_GROUP_LIST"
                    item-value="SRVY_QITEM_GROUP_ID"
                    item-text="SRVY_QITEM_GROUP_NM"
                    class="pl-form ml-2"
                    style="flex: 0 0 145px"
                  ></v-select>
                  <!-- 삭제 버튼 -->
                  <compo-tooltip-btn v-if="stts_head !== 'TERMIAT'"
                    TitleProp="삭제"
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon tabs-allclose"
                    TooltipPositionProp="bottom"
                    @btnClick="removeAnswer(answer)"></compo-tooltip-btn>
                </div>
              </draggable>
            </div>
            <!-- 추가 기타 항목 -->
            <div
              v-if="ANSWER_ETC.RSPNS_USE_YN && ANSWER_ETC.RSPNS_USE_YN == 'Y'"
              class="d-flex"
              style="width: 100%"
              >
              <span class="pl-label">기타</span>
              <v-text-field
                class="pl-form flex-grow-1 ml-2"
                v-model="ANSWER_ETC.QITEM_CHC_CN"
                placeholder="답변을 입력해 주십시오."
                disabled
              ></v-text-field>
              <!-- 삭제 버튼 -->
              <compo-tooltip-btn v-if="stts_head !== 'TERMIAT'"
                TitleProp="삭제"
                ClassProp="pl-tooltip-btn flex-grow-0"
                IconProp="pl-icon tabs-allclose"
                TooltipPositionProp="bottom"
                @btnClick="removeAnswer(ANSWER_ETC)"></compo-tooltip-btn>
            </div>
          </div>
        </div>
        <!-- 단일,복수 버튼 -->
        <div class="pl-btn-wrap" v-if="questionFlag_1 || questionFlag_2">
          <v-btn class="pl-btn is-sub ml-auto" @click="addAnswerItem" :disabled="stts_head === 'TERMIAT' ? true:false">
            보기 추가
          </v-btn>
          <v-btn
            v-if="!gQuData.SCR_USE_YN"
            class="pl-btn is-sub" @click="addEtcItem" :disabled="stts_head === 'TERMIAT' ? true:false">
            기타 추가
          </v-btn>
        </div>
        <!-- 주관식 단답형 -->
        <div class="pl-form-inline" v-if="questionFlag_4">
          <span class="pl-label"></span>
          <div class="pl-desc">
            <v-text-field
                class="pl-form"
                v-model="gQuChcData.QITEM_CHC_CN_SS"
                v-byte-counter="4000"
            />
          </div>
        </div>
        <!-- 주관식 서술형 -->
        <div class="pl-form-inline" v-if="questionFlag_6">
          <span class="pl-label"></span>
          <div class="pl-desc">
            <v-textarea
              class="pl-form is-noresize"
              v-model="gQuChcData.QITEM_CHC_CN_SL"
              :spellcheck="false"
            />
          </div>
        </div>
        <!-- 날짜 선택형 -->
        <div class="pl-form-inline" v-if="questionFlag_7">
          <span class="pl-label" />
          <div class="pl-desc">
            <compo-date-picker DateType="dateInput" :DateProp.sync="date" />
            <compo-date-picker v-if="gQuData.HR_APLCN_YN" DateType="time" :TimesProp.sync='timeStep2'
              :AmpmProp.sync='timeAmpm'/>
          </div>
        </div>


      </div>

    </div>
  </v-form>
</template>
<script>
export default {
  name:"CompoSvyQitemManage", //설문항목 등록/수정 관리 컴포넌트
  components: {
  },
  props: {
    DataProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data() {
     return {
      isDevelopment: process.env.VUE_APP_ENV === 'local' || process.env.VUE_APP_ENV === 'devserver',
      //관리 유형 - SRVY_QITEM_TMPL : 설문항목 관리, SRVY_QITEM_CRT : 설문지 생성 관리
      MNG_TYPE: '',
      //DataProp으로 전달받은 설문항목 정보
      SRVY_QITEM: {},
      IS_REG_MODE: '',


      //공개 여부 group
      radioGroupRlsYn: [
        { text: "공개", value: "Y"},
        {text: "비공개",value: "N"}
      ],

      gQuData:{},
      gQuChcData:{},
      //목록형 리스트
      ANSWER_LIST: [],
      //목록형 - 기타 답변
      ANSWER_ETC: {},

      blockTitle: null,

      //공통 코드
      common_code: [],
      //시간 선택형 기본 출력 설정
      date: '',
      timeStep2: '05:50',
      timeAmpm: '오후',

      stts_head: '',

      questionFlag_1 : false,
      questionFlag_2 : false,
      questionFlag_3 : false,
      questionFlag_4 : false,
      questionFlag_5 : false,
      questionFlag_6 : false,
      questionFlag_7 : false,


      validateRules: {
        RLS_YN: [
          v => !!v || '공개 여부는 필수 선택 항목 입니다.',
        ],
        SRVY_QITEM_CN: [
          v => !!v || '질문 제목은 필수 선택 항목 입니다.',
        ],
        QITEM_TYPE_CD: [
          v => !!v || '질문 유형은 필수 선택 항목 입니다.',
        ],
        QITEM_CHC_CN: [
          v => !!v || '보기내용은 필수 입력 항목 입니다.',
        ],
        CHC_PM_CNT: [
          v => !!v || '선택 허용 수는 필수 선택 항목 입니다.',
        ],
      },


      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
          REG : {alertDialogToggle: true, msg: '저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.setQuSaveYes, callNo: this.closeMsg}
          , MOD : {alertDialogToggle: true, msg: '수정하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.setQuSaveYes, callNo: this.closeMsg}
          , DEL : {alertDialogToggle: true, msg: '삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.delYes, callNo: this.closeMsg}
        },
        ALERT : {
          DEL_SUCCESS : {alertDialogToggle: true, msg: '삭제가 완료되었습니다.', iconClass: 'is-info', type: 'default'}
          , REG_SUCCESS : {alertDialogToggle: true, msg: '저장이 완료되었습니다.', iconClass: 'is-info', type: 'default'}
          , MOD_SUCCESS : {alertDialogToggle: true, msg: '수정이 완료되었습니다.', iconClass: 'is-info', type: 'default'}

          , ETC1_WARNING : {alertDialogToggle: true, msg: '설문조사명을 선택해 주세요.', iconClass: 'is-info', type: 'default'}
          // , ETC6_WARNING : {alertDialogToggle: true, msg: '질문 제목을 입력해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC7_WARNING : {alertDialogToggle: true, msg: '보기를 추가해 주세요.', iconClass: 'is-info', type: 'default'}
          // , ETC8_WARNING : {alertDialogToggle: true, msg: '선택 허용수를 선택해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC9_WARNING : {alertDialogToggle: true, msg: '날짜를 입력해 주세요.', iconClass: 'is-info', type: 'default'}
          // , ETC10_WARNING : {alertDialogToggle: true, msg: '보기 문항을 입력해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC11_WARNING : {alertDialogToggle: true, msg: '선택 허용수 만큼 보기항목을 추가해 주세요.', iconClass: 'is-info', type: 'default'}

          , ETC16_WARNING : {alertDialogToggle: true, msg: '대상자 지정이 되어있는 경우만 업로드 가능합니다.', iconClass: 'is-info', type: 'default'}
          , ETC17_WARNING : {alertDialogToggle: true, msg: '대상자 지정이 되어있습니다.<br>대상자를 업로드 해주세요.', iconClass: 'is-info', type: 'default'}
          , ETC18_WARNING : {alertDialogToggle: true, msg: '진행상태가 준비중, 승인반려인 항목만 가능합니다.', iconClass: 'is-info', type: 'default'}
          , ETC19_WARNING : {alertDialogToggle: true, msg: '진행상태가 게시완료 상태인 항목만 취소가 가능합니다.', iconClass: 'is-info', type: 'default'}
          , ETC20_WARNING : {alertDialogToggle: true, msg: '설문항목이 등록되어있지 않습니다.', iconClass: 'is-info', type: 'default'}
          , ETC_ANSWER_EXIST: {alertDialogToggle: true, msg: '기타 보기 항목은 1개 이상 추가할 수 없습니다.', iconClass: 'is-info', type: 'default'}

        },
        TOAST : {
          SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 },
          DEL_SUCCESS : {msg: '삭제가 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        }
      },
     }
   },

  watch: {
  },

  computed: {
  },

  async created() {
    //날짜 선택형 - 기본 날짜 출력
    this.date =  (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
    //공통코드설정
    let codeName = [
      'SUVY_QST_TP'  //설문 질문유형
      ,'SELT_ALW_NB'  //선택 허용수
    ];
    this.common_code = await this.mixin_common_code_get_all(codeName, 'Y');

    this.dataPropInit()

  },

  mounted() {
  },

  beforeDestroy() {
    this.isOpenDialog = false;
  },

  methods: {
    async dataPropInit() {
      this.MNG_TYPE = this.DataProp.MNG_TYPE;
      this.stts_head =  this.DataProp.STTS_HEAD;
      this.SRVY_QITEM = _.cloneDeep(this.DataProp.SRVY_QITEM);
      this.IS_REG_MODE = this.SRVY_QITEM.SRVY_QITEM_ID ? false : true;
      this.MVMN_SRVY_QITEM_GROUP_LIST = this.DataProp.MVMN_SRVY_QITEM_GROUP_LIST;
      if(this.IS_REG_MODE) {
        this.initData();
      } else {
        this.questionOpen();
      }
    },
    async initData() {

      //MNG_TYPE(관리 유형) - SRVY_QITEM_TMPL : 설문항목 관리, SRVY_QITEM_CRT : 설문지 생성 관리
      this.gQuData = {
        SRVY_QITEM_ID : '',           //설문_문항_ID
        SRVY_QITEM_GROUP_ID : this.MNG_TYPE == 'SRVY_QITEM_CRT' ? this.SRVY_QITEM.SRVY_QITEM_GROUP_ID : '',     //설문_문항_그룹_ID
        SRVY_CLSF_ID: this.MNG_TYPE == 'SRVY_QITEM_TMPL' ? this.SRVY_QITEM.SRVY_CLSF_ID : '',                   //설문_분류_ID
        SRVY_QITEM_CN : '',           //설문_문항_내용
        SRVY_QITEM_EXPLN : '',        //설문_문항_설명
        QITEM_TYPE_CD : 'SNGL',       //문항_유형_코드
        ESNTL_YN : '',                //필수_여부(SRVY_QITEM_CRT 유형일 시 사용)
        RLS_YN: '',                   //공개_여부(SRVY_QITEM_TMPL 유형일 시 사용)
        CHC_PM_CNT : '1',             //선택_허용_수
        ANS_LEN_CD : '',              //답안_길이_코드
        HR_APLCN_YN : false,          //시간_적용_여부
        SCR_USE_YN : false,           //설문결과 환산 값 표시 여부
        GROUP_MVMN_USE_YN : false,    //블록 이동 사용 여부
        SORT_ORD : '0',               //정렬_순서
      };
      this.ANSWER_LIST = [
        {
          QITEM_CHC_ID : '',
          SRVY_QITEM_ID : '',
          QITEM_CHC_CN : '',
          CSORT_ORD : 0,
          SCR: '',
          MVMN_SRVY_QITEM_GROUP_ID: ''
        }
      ];
      this.ANSWER_ETC = {
          QITEM_CHC_ID : '',
          SRVY_QITEM_ID : '',
          QITEM_CHC_CN : '',
          CSORT_ORD : 0,
          SCR: '',
          MVMN_SRVY_QITEM_GROUP_ID: ''
      };

      this.questionFlag_1 = true;
      this.showQuesType(this.gQuData.QITEM_TYPE_CD);
      if(this.$refs.form) this.$refs.form.resetValidation();
    },

    

    addAnswerItem() {
      if(this.chkValid('7')) return;

      let newItem = {
        QITEM_CHC_ID : '',
        SRVY_QITEM_ID : '',
        QITEM_CHC_CN : '',
        CSORT_ORD : 1,
        RSPNS_USE_YN: 'N',
        SCR: this.gQuData.SCR_USE_YN ? this.calcScore(this.ANSWER_LIST.length) : '',
        MVMN_SRVY_QITEM_GROUP_ID: ''
      };

      this.ANSWER_LIST.push(newItem);
    },

    //기본 점수 계산 100,  80, 660, 40, 20
    calcScore(idx) {
      let score = 100 - (idx * 20);
      if(score < 0) {
        score = 0
      }
      return score;
    },

    //점수 초기화
    initScore() {
      if(this.gQuData.SCR_USE_YN) {
        this.ANSWER_LIST.map((item, idx) => {
          if(this.mixin_isEmpty(item.SCR)) {
            // this.$set(item, 'SCR', this.calcScore(idx))
            item.SCR = this.calcScore(idx)
          }
        });
        this.ANSWER_ETC = {};
      }
    },

    //기타 답변 추가 - 단일선택형, 복수선택형
    addEtcItem() {
      if(this.chkValid('7')) return;
      if(this.ANSWER_ETC && this.ANSWER_ETC.RSPNS_USE_YN == 'Y') {
        this.showAlert(this.MESSAGE.ALERT.ETC_ANSWER_EXIST);
      }

      this.ANSWER_ETC = {
        QITEM_CHC_ID : '',
        SRVY_QITEM_ID : '',
        QITEM_CHC_CN : '',
        CSORT_ORD : 1,
        MVMN_SRVY_QITEM_GROUP_ID: '',
        RSPNS_USE_YN: 'Y',
        SCR: ''
      };
    },

    removeAnswer(answer) {
      if(this.chkValid('7')) return;

      this.showAlert(
        {
          alertDialogToggle: true,
          msg: '삭제하시겠습니까?',
          iconClass: 'is-info',
          type: 'confirm',
          callYes: async () => {
            if(this.mixin_isEmpty(answer.QITEM_CHC_ID)){
              if(this.mixin_isEmpty(answer.RSPNS_USE_YN) || answer.RSPNS_USE_YN == 'N') {
                this.ANSWER_LIST.splice(this.ANSWER_LIST.indexOf(answer), 1);
              } else if(answer.RSPNS_USE_YN == 'Y') {
                this.ANSWER_ETC = {};
              }
              this.closeMsg();
            }else{
              const sUrl = '/api/svy/makeitems/deleteItemChcMakeItems';
              const postParam = {
                SRVY_QITEM_ID : answer.SRVY_QITEM_ID
                ,QITEM_CHC_ID : answer.QITEM_CHC_ID
              }
              const headParam = {head: {}}
              let resData = await this.common_postCall(sUrl, postParam, headParam );

              if (resData.HEADER.ERROR_FLAG)
              {
                this.setErrMsg(resData);
              }
              else
              {
                this.showToast(this.MESSAGE.TOAST.DEL_SUCCESS);
                this.closeMsg();
                if(this.mixin_isEmpty(answer.RSPNS_USE_YN) || answer.RSPNS_USE_YN == 'N') {
                  this.ANSWER_LIST.splice(this.ANSWER_LIST.indexOf(answer), 1);
                } else if(answer.RSPNS_USE_YN == 'Y') {
                  this.ANSWER_ETC = {};
                }
              }
            }
          },
          callNo: this.closeMsg
        }
      )
    },

    validate () {
      return this.$refs.form.validate();
    },

    chkValid(e){
      let eFlag = true;
      switch(e){
        case '0' : //조회관련
          if(this.mixin_isEmpty(this.SRVY_NM)) this.showAlert(this.MESSAGE.ALERT.ETC1_WARNING);
          else eFlag = false;
        break;
        case '3' : //저장체크
          if(this.gQuData.QITEM_TYPE_CD === 'MULT'){
            if(this.gQuData.CHC_PM_CNT != '9' && this.gQuData.CHC_PM_CNT > this.ANSWER_LIST.length){
              this.showAlert(this.MESSAGE.ALERT.ETC11_WARNING);
              break;
            }else{
              eFlag = false;
            }
          }else if(this.gQuData.QITEM_TYPE_CD === 'DATE'){
            if(this.mixin_isEmpty(this.date)){
              this.showAlert(this.MESSAGE.ALERT.ETC9_WARNING);
              break;
            }else{
              eFlag = false;
              break;
            }
          }else{
            eFlag = false;
          }

          if(['SNGL', 'MULT'].includes(this.gQuData.QITEM_TYPE_CD)){
            if(this.ANSWER_LIST.length < 1){
              this.showAlert(this.MESSAGE.ALERT.ETC7_WARNING);
              eFlag = true;
              break;
            }
          }

        break;
        case '6' : //대상지정여부 체크
          if(this.gTrgtDsgnYn === 'N') this.showAlert(this.MESSAGE.ALERT.ETC16_WARNING);
          else eFlag = false;
        break;
        case '7' :  //진행상태 체크
          //설문지 생성 관리 모드에서는 '준비중(PRPARG)' 상태인지 체크
          if(this.MNG_TYPE == 'SRVY_QITEM_CRT' && !(this.stts_head === 'PRPARG' || this.stts_head === 'RFSL')) this.showAlert(this.MESSAGE.ALERT.ETC18_WARNING);
          else eFlag = false;
        break;
        case '8' :  //게시취소
          if(this.stts_head !== 'PUBCMP') this.showAlert(this.MESSAGE.ALERT.ETC19_WARNING);
          else eFlag = false;
        break;
        case '9' :  //설문항목 등록여부
          if(this.tabGrpCnt === 0) this.showAlert(this.MESSAGE.ALERT.ETC20_WARNING);
          else eFlag = false;
        break;
      }
      return eFlag;
    },

    //설문지생성저장
    btnSaveTab1(){
      if(this.chkValid('7')) return;
      if(!this.validate()) return;
      if(this.chkValid('3')) return;
      this.showAlert((this.mixin_isEmpty(this.gQuData.SRVY_QITEM_ID) ? this.MESSAGE.CONFIRM.REG : this.MESSAGE.CONFIRM.MOD));

    },

    //문항저장실행
    async setQuSaveYes(){
      //시스템 로그를 분리하기 위해 url 분리.
      const sUrl = this.MNG_TYPE == 'SRVY_QITEM_TMPL' ? '/api/svy/tmpl/upsertTmplItemList' : '/api/svy/makeitems/upsertitemsmakeitems';
      let postParam = _.cloneDeep(this.gQuData);

      let arrItemList = [];
      this.ANSWER_LIST.forEach((e, i) => {
        arrItemList.push({
          QITEM_CHC_ID : e.QITEM_CHC_ID,
          SRVY_QITEM_ID : e.SRVY_QITEM_ID,
          QITEM_CHC_CN : e.QITEM_CHC_CN,
          CSORT_ORD : (i+1).toString(),
          MVMN_SRVY_QITEM_GROUP_ID: this.gQuData.GROUP_MVMN_USE_YN && e.MVMN_SRVY_QITEM_GROUP_ID ? e.MVMN_SRVY_QITEM_GROUP_ID : '',
          RSPNS_USE_YN: e.RSPNS_USE_YN ? e.RSPNS_USE_YN : 'N',
          SCR: this.gQuData.SCR_USE_YN && (e.SCR || e.SCR == '0') ? e.SCR : '',
        })
      });

      //기타 항목 추가
      if(this.ANSWER_ETC.RSPNS_USE_YN && this.ANSWER_ETC.RSPNS_USE_YN == 'Y') {
        arrItemList.push({
          QITEM_CHC_ID : this.ANSWER_ETC.QITEM_CHC_ID,
          SRVY_QITEM_ID : this.ANSWER_ETC.SRVY_QITEM_ID,
          QITEM_CHC_CN : this.ANSWER_ETC.QITEM_CHC_CN,
          CSORT_ORD : (this.ANSWER_LIST.length+1).toString(),
          MVMN_SRVY_QITEM_GROUP_ID: this.ANSWER_ETC.MVMN_SRVY_QITEM_GROUP_ID,
          RSPNS_USE_YN: this.ANSWER_ETC.RSPNS_USE_YN,
          SCR: '',
        })
      }

      postParam.ANSWER_LIST = arrItemList;
      postParam.ESNTL_YN = (postParam.ESNTL_YN ? 'Y' : 'N');
      postParam.HR_APLCN_YN = (postParam.HR_APLCN_YN ? 'Y' : 'N');
      postParam.SCR_USE_YN = (postParam.SCR_USE_YN ? 'Y' : 'N');
      postParam.GROUP_MVMN_USE_YN = (postParam.GROUP_MVMN_USE_YN ? 'Y' : 'N');
      const headParam = {
        head: {
          'SERVICE' : 'svy.makeitems.upsertitemsmakeitems',
          'METHOD' : 'upsertitemsmakeitems',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (resData.HEADER.ERROR_FLAG) {
        this.setErrMsg(resData);
      } else {
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeMsg();
        this.$emit('reloadParentComp');
        
      }
    },

    //설문문항 복제
    async copyQitem(){
      const sUrl = '/api/svy/makeitems/upsertitemsmakeitems';
      let postParam = _.cloneDeep(this.gQuData);

      let arrItemList = [];
      this.ANSWER_LIST.forEach((e, i) => {
        arrItemList.push({
          QITEM_CHC_ID : '',
          SRVY_QITEM_ID : '',
          QITEM_CHC_CN : e.QITEM_CHC_CN,
          CSORT_ORD : (i+1).toString(),
          MVMN_SRVY_QITEM_GROUP_ID: this.gQuData.GROUP_MVMN_USE_YN && e.MVMN_SRVY_QITEM_GROUP_ID ? e.MVMN_SRVY_QITEM_GROUP_ID : '',
          RSPNS_USE_YN: e.RSPNS_USE_YN ? e.RSPNS_USE_YN : 'N',
          SCR: this.gQuData.SCR_USE_YN && (e.SCR || e.SCR == '0') ? e.SCR : '',
        })
      });

      //기타 항목 추가
      if(this.ANSWER_ETC.RSPNS_USE_YN && this.ANSWER_ETC.RSPNS_USE_YN == 'Y') {
        arrItemList.push({
          QITEM_CHC_ID : '',
          SRVY_QITEM_ID : '',
          QITEM_CHC_CN : this.ANSWER_ETC.QITEM_CHC_CN,
          CSORT_ORD : (this.ANSWER_LIST.length+1).toString(),
          MVMN_SRVY_QITEM_GROUP_ID: this.ANSWER_ETC.MVMN_SRVY_QITEM_GROUP_ID,
          RSPNS_USE_YN: this.ANSWER_ETC.RSPNS_USE_YN,
          SCR: '',
        })
      }

      postParam.ANSWER_LIST = arrItemList;
      postParam.SRVY_QITEM_ID = '';
      postParam.SRVY_QITEM_CN = 'Copy of ' + postParam.SRVY_QITEM_CN;
      postParam.ESNTL_YN = (postParam.ESNTL_YN ? 'Y' : 'N');
      postParam.HR_APLCN_YN = (postParam.HR_APLCN_YN ? 'Y' : 'N');
      postParam.SCR_USE_YN = (postParam.SCR_USE_YN ? 'Y' : 'N');
      postParam.GROUP_MVMN_USE_YN = (postParam.GROUP_MVMN_USE_YN ? 'Y' : 'N');
      const headParam = {head: {}}

      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (resData.HEADER.ERROR_FLAG) {
        this.setErrMsg(resData);
      } else {
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeMsg();
        this.$emit('reloadParentComp', true);
      }
    },
    //api오류
    setErrMsg(res){
      if(res.HEADER.ERROR_MSG == 'TRGT') this.showAlert(this.MESSAGE.ALERT.ETC17_WARNING);
      else this.showAlert(this.MESSAGE.ERROR.ERROR);
    },


    //문항클릭
    questionOpen(item){
      if(this.$refs.form) this.$refs.form.resetValidation();

      this.blockTitle = this.SRVY_QITEM.SRVY_QITEM_GROUP_NM;
      this.gQuData = this.SRVY_QITEM;
      this.gQuData.SRVY_QITEM_CN = this.mixin_decode(this.SRVY_QITEM.SRVY_QITEM_CN);
      // this.gQuData.SRVY_QITEM_EXPLN = this.mixin_decode(this.SRVY_QITEM.SRVY_QITEM_EXPLN);
      // this.gQuData.QITEM_TYPE_CD = item.QITEM_TYPE_CD;
      // this.gQuData.CHC_PM_CNT = item.CHC_PM_CNT;
      // this.gQuData.ANS_LEN_CD = item.ANS_LEN_CD;
      // this.gQuData.HR_APLCN_YN = item.HR_APLCN_YN;
      // this.gQuData.SCR_USE_YN = item.SCR_USE_YN;
      // this.gQuData.GROUP_MVMN_USE_YN = item.GROUP_MVMN_USE_YN;
      // this.gQuData.SORT_ORD = item.SORT_ORD;

      // if(this.MNG_TYPE == 'SRVY_QITEM_CRT') {
      //   this.gQuData.SRVY_QITEM_GROUP_ID = item.SRVY_QITEM_GROUP_ID;
      //   this.gQuData.ESNTL_YN = item.ESNTL_YN;
      // } else if(this.MNG_TYPE == 'SRVY_QITEM_TMPL') {
      //   this.gQuData.SRVY_CLSF_ID = item.SRVY_CLSF_ID;
      //   this.gQuData.RLS_YN = item.RLS_YN;
      // }

      this.showQuesType(this.SRVY_QITEM.QITEM_TYPE_CD);

      // this.checkedItems = [];
      // this.checkedItems[index] = true;
      // this.qIdx = index;
      //등록된 내용이면 보기사항을 조회해 온다.
      if(!this.mixin_isEmpty(this.SRVY_QITEM.SRVY_QITEM_ID)){
        this.selectChcList(this.SRVY_QITEM);
      }
      // this.tab1QueIdx = index;
    },

    //질문유형에 따른 항목 설정
    showQuesType(e){
      if(this.$refs.form) this.$refs.form.resetValidation();
      this.ANSWER_LIST = [];
      this.ANSWER_ETC = {};
      if(this.IS_REG_MODE) {
        this.gQuData.SCR_USE_YN = false;
      }
      this.questionFlag_1 = false;    // 단일 선택형
      this.questionFlag_2 = false;    // 단일, 복수 선택형
      this.questionFlag_3 = false;    // 주관식 단답형
      this.questionFlag_4 = false;    // 주관식 단답형
      this.questionFlag_5 = false;    // 주관식 서술형
      this.questionFlag_6 = false;    // 주관식 서술형
      this.questionFlag_7 = false;    // 날짜 선택형
      if(e === 'SNGL'){
        this.questionFlag_2 = true;
      }else if(e === 'MULT'){
        this.questionFlag_1 = true;
      }else if(e === 'SHOT'){
        this.questionFlag_3 = true;
        this.questionFlag_4 = true;
      }else if(e === 'DESC'){
        this.questionFlag_5 = true;
        this.questionFlag_6 = true;
      }else if(e === 'DATE'){
        this.questionFlag_7 = true;
      }
    },

    //보기항목 조회
    async selectChcList(item){
      const sUrl = '/api/svy/makeitems/selectchcmakeitems';
      const postParam = {
        SRVY_QITEM_ID : item.SRVY_QITEM_ID
      }
      const headParam = {
        head: {
          'SERVICE' : 'svy.makeitems.selectchcmakeitems',
          'METHOD' : 'selectchcmakeitems',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {
        this.ANSWER_LIST = [];
        if(resData.DATA.length > 0){
          resData.DATA.forEach(e => {
            if(this.mixin_isEmpty(e.RSPNS_USE_YN) || e.RSPNS_USE_YN == 'N') {
              this.ANSWER_LIST.push(e)
            } else if(!this.mixin_isEmpty(e.RSPNS_USE_YN) && e.RSPNS_USE_YN == 'Y') {
              this.ANSWER_ETC = e;
            }
          });
        }
      }
    },


    //메시지창 종료
    closeMsg(){
      this.$store.commit('alertStore/hideAlert');
    },

    closeDialog() {
      this.$emit('clickClose');
    },

  },
}
</script>
<style lang="scss" scoped>
</style>