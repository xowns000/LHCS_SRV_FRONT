<template>
  <div>
    <div class="pl-chatting-cs-info">
      <div class="pl-chatting-cs-info-cus">
        <div>
          <strong class="pl-chatting-cs-info-tit">고객 명</strong>
          <span class="pl-chatting-cs-info-desc">{{
              mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(custInfoProp.CUST_NM) : custInfoProp.CUST_NM
            }}</span>
        </div>
        <div>
          <strong class="pl-chatting-cs-info-tit">상담일시</strong>
          <span class="pl-chatting-cs-info-desc">
            {{
              mixin_convertDate(CUTT_INFO.CUTT_BGNG_DT, 'yyyy-MM-dd HH:mm:ss')
            }} ~ {{
              mixin_convertDate(CUTT_INFO.CUTT_END_DT, 'HH:mm:ss')
            }}({{ mixin_seconds_toHHMMSS(CUTT_INFO.PHN_HR) }})
          </span>
        </div>
      </div>
      <div class="pl-chatting-cs-info-manager">
        <div>
          <strong class="pl-chatting-cs-info-tit">채널</strong>
          <span class="pl-chatting-cs-info-desc">{{ CUTT_INFO.CL_TYPE_NM }} > {{ CUTT_INFO.CHN_TYPE_NM }}</span>
        </div>
        <div>
          <strong class="pl-chatting-cs-info-tit">상담유형</strong>
          <span class="pl-chatting-cs-info-desc">{{ CUTT_INFO.FULL_PATH }}</span>
        </div>
        <div>
          <strong class="pl-chatting-cs-info-tit">상담사</strong>
          <span class="pl-chatting-cs-info-desc">{{ CUTT_INFO.CUSL_NM }}
            <span :class="CUTT_INFO.CUSL_RS=== 'COMPLETED'? 'status-done':'status-no'">
              {{ CUTT_INFO.CUSL_RS_NM }}
            </span>
          </span>
        </div>
        <!--상담 이력 노출 확장 속성-->
        <template
            v-for="attr in expsnAttrList"
        >
          <div :key="attr.EXPSN_ATTR_COL_ID">
            <strong class="pl-chatting-cs-info-tit">{{ attr.EXPSN_ATTR_NM }}</strong>
            <span class="pl-chatting-cs-info-desc">{{
                attr.DATA_TYPE_CD === 'COE' || attr.DATA_TYPE_CD === 'COE_MULTI' ? cuttInfoProp[`${attr.EXPSN_ATTR_COL_ID}_NM`] : CUTT_INFO[`${attr.EXPSN_ATTR_COL_ID}`]
              }}</span>
          </div>
        </template>
        <!--상담 이력 노출 확장 속성-->
      </div>
    </div>
    <h2 class="pl-dialog-body-tit-h2"></h2>

    <v-tabs class="pl-tabs type-sub">
      <v-tab style="width: auto">
        상담내용
        <!-- audio -->
        <template v-if="CUTT_INFO.REC_FILE_NM">
          <template v-if="$store.getters['userStore/GE_USER_ROLE'].atrtGroupId !== '6'"><!-- 상담사가 아닌 경우-->
            <compo-tooltip-btn
                TitleProp="녹취듣기"
                ClassProp="pl-tooltip-btn ml-2"
                IconProp="pl-icon20 audio"
                TooltipPositionProp="bottom"
                @btnClick="showRecDialog(CUTT_INFO)"
            ></compo-tooltip-btn>
          </template>
          <template v-else><!-- 상담사인 경우 -->
            <template v-if="mixin_getCustcoSetting('ENV_AUDIO_PLAY_PERM_YN')"><!-- 다른 상담사 녹취 재생 권한이 있는 경우-->
              <compo-tooltip-btn
                  TitleProp="녹취듣기"
                  ClassProp="pl-tooltip-btn ml-2"
                  IconProp="pl-icon20 audio"
                  TooltipPositionProp="bottom"
                  @btnClick="showRecDialog(CUTT_INFO)"
              ></compo-tooltip-btn>
            </template>
          </template>
        </template>
      </v-tab>
      <v-tab v-if="TalkProp">채팅내용</v-tab>
      <v-tab-item>
        <div class="pl-dialog-body-desc">
          <v-textarea
              class="pl-form is-noresize"
              :value="mixin_decode(CUTT_INFO.CUSL_CN)"
              :spellcheck="false"
              readonly
              height="330"
          />
        </div>
      </v-tab-item>
      <v-tab-item>
        <!-- component -->
        <compo-chatting
            v-if="CUTT_INFO.CHN_CLSF_CD != 'BBS' && CUTT_INFO.CHN_CLSF_CD != 'EMAIL' && TalkProp"
            ClassProp="mt-4"
            HeightProp="330px"
            :ChatLogProp="ChatLogProp"
            :BfrChatLogProp="[]"
        />
        <!-- 이메일 상담 내역 출력 -->
        <compo-chat-log-email
            v-if="CUTT_INFO.CHN_CLSF_CD == 'EMAIL'"
            :DataProp="{'CHT_CUTT_ID': CUTT_INFO.CHT_CUTT_ID}"
        />
        <!-- 게시판 상담 내역 출력 -->
        <compo-chat-log-bbs
            v-if="CUTT_INFO.CHN_CLSF_CD == 'BBS'"
            ClassProp="mt-4"
            HeightProp="330px"
            :ChatLogProp="ChatLogProp"
        />
      </v-tab-item>
    </v-tabs>
    <!-- 녹취파일 modal -->
    <compo-audio
        v-model="dialogListenVoice"
        AudioType="whole"
        :audioProp="this.REC_TEMP_DATA"
    />
  </div>
</template>

<script>

export default {
  name: 'CompoChatLog',
  props: {
    custInfoProp: {
      type: Object,
    },
    cuttInfoProp: {
      type: Object,
    },
    cuttInfoSeq: {
      type: Number,
      default: -1
    },
    cuttInfoTotalCnt: {
      type: Number,
    },
    cuttInfoTotalProp: {
      type: Array,
    },
    expsnAttrList: {
      type: Array,
    },
    CusLogProp: {
      type: String,
    },
    // ChatLogProp: {
    //     type: Array,
    // },
    AudioProp: {
      type: String,
    },
    // TalkProp: {
    //     type: Boolean,
    //     default: false
    // }
  },
  data() {
    return {
      REC_FILE_PATH: '', //녹취파일 경로
      dialogListenVoice: false,
      dataForAudio: {},
      CUTT_INFO: {},
      REC_TEMP_DATA: {},
      TalkProp: false,
      ChatLogProp: [],

      FBDWD_YN: '', //금칙어 적용여부
      SHOW_QSTN:'', //고객이 선택한 문의유형 보기 여부
    };
  },
  computed: {},
  async created() {
    this.setAudioData(this.cuttInfoProp);
    this.CUTT_INFO = this.cuttInfoTotalProp[this.cuttInfoSeq];
    if (this.CUTT_INFO.TYPE !== 'call') {
      this.TalkProp = true;
      this.chatHstSrch();
    } else {
      this.TalkProp = false;
    }

    this.FBDWD_YN = await this.mixin_getChtStng('PROHIBITE_APPLY_YN');
    this.SHOW_QSTN = await this.mixin_getChtStng('INQRY_SHOW_YN');
  },
  methods: {
    // 녹취 파일 세팅
    setAudioData(item) {
      this.dataForAudio = {};
      this.dataForAudio = {
        REC_FILE_NM: item.REC_FILE_NM,
        PHN_CUTT_ID: item.PHN_CUTT_ID,
        CUST_ID: item.CUST_ID,
      };
    },
    //채팅 내역 조회
    async chatHstSrch() {
      let sUrl = '/chat-api/main/cnslt-cn/inqire';
      console.log("CUTT_INFO", this.CUTT_INFO)
      let postParam = {
        CHT_CUTT_ID: this.CUTT_INFO.CHT_CUTT_ID,
        CUST_ID: this.CUTT_INFO.CUST_ID,
        CUTT_STTS_CD: 'CMPL',
        CHT_RDY_ID: '',
        CHT_USER_KEY: '',
        SNDR_KEY: '',
        CHN_CLSF_CD: this.CUTT_INFO.CHN_CLSF_CD === 'BBS' ? this.CUTT_INFO.CHN_CLSF_CD : '',
      }
      let headParam = {
        head: {}
      }

      let resData = await this.chat_postCall(sUrl, postParam, headParam)
      if (!resData.header.ERROR_FLAG) {
        this.ChatLogProp = [];
        let msgTypeCd = '';
        let leng = resData.data.length;
        for (let i = 0; i < leng; i++) {
          if(this.SHOW_QSTN == 'Y'){
            if(resData.data[i]["MSG_TYPE_CD"] != 'EMAIL' && resData.data[i]["MSG_TYPE_CD"] != 'BBS'){
              let chatDate = this.mixin_convertDate(resData.data[i]["REG_DT"], 'yyyy-MM-dd HH:mm:ss')
              if(resData.data[i]["MSG_TYPE_CD"] == 'INFOMSG' && msgTypeCd != 'INFOMSG'){
                this.ChatLogProp.push(
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
                    RSVT_BTN_LIST: resData.data[i+1]["RSVT_BTN"].split('||'),
                  },
                )
                msgTypeCd = 'INFOMSG';
              } else if (resData.data[i]["MSG_TYPE_CD"] == 'QSTN' && msgTypeCd == 'INFOMSG') {
                this.ChatLogProp.push(
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
                this.ChatLogProp.push(
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
            } else if(resData.data[i]["MSG_TYPE_CD"] == 'BBS'){
              let chatDate = this.mixin_convertDate(resData.data[i]["REG_DT"], 'yyyy-MM-dd HH:mm:ss')
              this.ChatLogProp.push(resData.data[i])
            }
          } else {
            if (resData.data[i]["MSG_TYPE_CD"] != 'QSTN') {
              if (resData.data[i]["MSG_TYPE_CD"] != 'BBS') {
                let chatDate = this.mixin_convertDate(resData.data[i]["REG_DT"], 'yyyy-MM-dd HH:mm:ss')
                this.ChatLogProp.push(
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
              } else {
                let chatDate = this.mixin_convertDate(resData.data[i]["REG_DT"], 'yyyy-MM-dd HH:mm:ss')
                this.ChatLogProp.push(resData.data[i])
              }
            }
          }
        }
      }
    },

    //녹취파일 듣기
    showRecDialog(item) {
      this.REC_TEMP_DATA = {};
      this.REC_TEMP_DATA = item;
      this.mixin_showDialog('ListenVoice');
    },
  },
  watch: {
    // cuttInfoProp() {
    //     this.setAudioData(this.cuttInfoProp);
    // },

    cuttInfoTotalProp() {
      if(this.cuttInfoTotalProp[this.cuttInfoSeq]) this.CUTT_INFO = this.cuttInfoTotalProp[this.cuttInfoSeq];
    },

    cuttInfoSeq() {
      this.CUTT_INFO = this.cuttInfoTotalProp[this.cuttInfoSeq];
      if (this.CUTT_INFO.TYPE !== 'call') {
        this.TalkProp = true;
        this.chatHstSrch();
      } else {
        this.TalkProp = false;
      }
    }
  },

}
</script>