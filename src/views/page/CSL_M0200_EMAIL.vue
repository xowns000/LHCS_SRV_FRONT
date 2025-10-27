<template>
  <div>
    <div
      class="pl-card d-flex flex-grow-1 flex-column"
    >
      <!-- 이메일 상담 접수 내역 출력 -->
      <compo-view-email
        v-if="!demoVideoMode"
        :DataProp="{'EMAIL' : CHAT_EMAIL}"
      />
      <div 
        :class="`pl-chat-input ${!demoVideoMode?'is-mt-m':''} pa-3 align-self-end`"
        style="width: 100%"
      >
        <div class="pl-btn-wrap ">
          <!-- 이메일 발송 버튼 -->
          <compo-tooltip-btn
            v-if="CHAT_EMAIL.EML_SNDNG_ID == 'NONE' && CHAT_STAT == 'ING'"
            TitleProp="답변 이메일 발송"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 email-send"
            TooltipPositionProp="top"
            @btnClick="openReplyEmailDialog()"
          ></compo-tooltip-btn>
          <!-- 이메일 발송 버튼 -->
          <compo-tooltip-btn
            TitleProp="이메일 발송내용 확인"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 preview"
            TooltipPositionProp="top"
            @btnClick="showReplyEmail()"
            :DisabledProp="this.CHAT_EMAIL.EML_SNDNG_ID == 'NONE'"
          ></compo-tooltip-btn>
          <!-- 이메일 상담종료 -->
          <div class="ml-auto">
            <v-btn
              v-if="chat_list_data?.CLK_DATA?.STTS_CD == 'cs'"
              class="pl-btn is-icon"
              style="margin-left: 6px;"
              @click="$emit('selectChatList', CHAT_OFF_LIST[0])">상담종료</v-btn>
            <v-btn
              v-if="chat_list_data?.CLK_DATA?.STTS_CD == 'after'"
              class="pl-btn is-icon"
              style="margin-left: 6px;"
              @click="$emit('selectChatList', CHAT_OFF_LIST[2])">상담저장</v-btn>
          </div>
        </div>
      </div>
    </div>
    
    <!-- dialog 이메일 발송 -->
    <v-dialog
      v-if="dialogSendEmail"
      v-model="dialogSendEmail"
      content-class="pl-top-alarm-dialog"
      hide-overlay>
      <compo-dialog
        :header-title="emailMode === 'REPLY' ? '답변 이메일 발송' : '답변 이메일 확인'"
        @hide="mixin_hideDialog('SendEmail')"
      >
        <template slot="body">
          <compo-send-email
          v-if="emailMode != 'VIEW'"
          :CUST_ID="CUST_INFO.CUST_ID + ''"
          :CUST_EMAIL="CHAT_EMAIL.SNDR_EML"
          :SUBJECT = "`Re:${CHAT_EMAIL.TTL}`"
          :EMAIL_CONTENT = "CHAT_EMAIL.CN"
          :CHT_CUTT_ID = "CHAT_EMAIL.CHT_CUTT_ID"
          :EML_SNDNG_ID = "emailMode === 'REPLY' ? '' : CHAT_EMAIL.EML_SNDNG_ID"
          :MODE = "emailMode"
          @sendEmailClose="sendEmailClose"
          />
          <compo-view-email
            v-if="emailMode == 'VIEW'"
            :DataProp="{'EML_SNDNG_ID' : CHAT_EMAIL.EML_SNDNG_ID}"
          />
        </template>
        <template 
          v-if="emailMode != 'VIEW'"
          slot="footer">
          <v-btn class="pl-btn is-sub" @click="setSendEmailCancel">취소</v-btn>
          <v-btn class="pl-btn" @click="setSendEmail">보내기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>
<script>
import { eventBus } from "@/store/eventBus.js";
export default {
  name: "MENU_CSL_M0200_EMAIL", //SNS상담 - 이메일 상담
  props: {
    EMAIL_CUTT_INFO: {
      type: Object,
      default: {}
    },
    chat_list_data: {
      type: Object,
      default: {}
    },
    CUST_INFO: {
      type: Object,
      default: {}
    },
    CHAT_STAT: {
      type: String,
      default: ''
    },
    demoVideoMode: {
      type: Boolean,
      default: false
    }
  },
  components: {
  
  },
  data() {
    return {

      //이메일 상담 상세
      CHAT_EMAIL: {},
      //알림창 메시지
      MESSAGE : {
        ALERT : {
          CANT_CHAT : {alertDialogToggle: true, msg: '상담이 가능한 상태가 아닙니다', iconClass: 'is-info', type: 'default'}
        },
        TOAST:{
          INFO : {
            DONT_SENT_REPLY: {  msg: '답변 발송 내역이 없습니다.', class: 'info', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          }
        }
      },

      // file grid
      filelist_header: [
        { text: '파일명', value: 'filename', align: 'left',sortable: false },
        { text: '크기', value: 'filesize', align: 'left',sortable: false , width: '100px'},
        { text: '다운로드', value: 'download', align: 'center',sortable: false, width: '100px' },
        { text: '다운로드 수', value: 'count', align: 'center',sortable: false, width: '100px' },
      ],
      
      CHAT_OFF_LIST: [
        { text: "상담종료", active: 'slideChatOff', icon: 'chat-off'},
        { text: "임시저장", active: 'slideChatTemp', icon: 'chat-temp'},
        { text: "상담저장", active: 'slideChatSave', icon: 'chat-save'},
      ],
      // 이메일 발송
      dialogSendEmail: false,
      //이메일 모드 : REPLY : 답변, VIEW : 발송 내역 조회
      emailMode : 'REPLY',

    }
  },

  async created() {
    this.createChatEmail(this.EMAIL_CUTT_INFO);
    
  },

  async mounted() {
  },

  beforeDestroy() {
  },

  watch: {
    EMAIL_CUTT_INFO() {
      this.createChatEmail(this.EMAIL_CUTT_INFO);
    },
  },

  computed: {

  },

  methods: {
    
    /**
     * 이메일 상담 상세 data 생성.
     */
    createChatEmail(emailItem) {
      this.CHAT_EMAIL = emailItem;
      
      if(this.CHAT_EMAIL.FILE_LIST != undefined && this.CHAT_EMAIL.FILE_LIST.length > 0) {
        let fileList = [];
        this.CHAT_EMAIL.FILE_LIST.map((item, index) => {
          fileList.push({
            index : index,
            filename : item.ACTL_FILE_NM,
            filesize : this.mixin_format_bytes(item.FILE_SZ),
            download : true,
            count : item.DWNLD_CNT,
            downloadFile: item.ACTL_FILE_NM,
            fileGroupKey: item.FILE_GROUP_KEY,
            fileKey: item.FILE_KEY,
            busiType: item.TASK_TYPE_CD,
            pathType: item.PATH_TYPE_CD,
          })
        })
        this.CHAT_EMAIL.FILE_LIST = fileList;
      }
    },
    
    //이메일 발송 버튼 - 답변 이메일 다이얼로그를 오픈한다.
    openReplyEmailDialog() {
      if(this.chat_list_data.USER_CHT_STAT == 'CANT_CHAT' || this.chat_list_data.USER_CHT_STAT == 'CHT_CANT' || this.chat_list_data.USER_CHT_STAT == null || this.chat_list_data.USER_CHT_STAT == undefined){
        this.showAlert(this.MESSAGE.ALERT.CANT_CHAT);
      } else {
        this.emailMode = 'REPLY'
        this.mixin_showDialog('SendEmail')
      }
    },
    
    /**
     * 답변 이메일 보기
     */
    showReplyEmail() {
      if(this.CHAT_EMAIL.EML_SNDNG_ID != 'NONE') {
        this.emailMode = "VIEW";
        this.mixin_showDialog('SendEmail');
      } else {
        this.showToast(this.MESSAGE.TOAST.INFO.DONT_SENT_REPLY);
      }
      
    },

    
    //이메일 상담 - 고객에게 이메일 발송
    setSendEmail() {
      eventBus.setSendEmail();
    },
    setSendEmailCancel() {
      eventBus.setSendEmailInit();
      this.mixin_hideDialog('SendEmail');
    },
    //이메일 발송 후, 처리 - eventBus 이벤트로 호출됨.
    sendEmailClose(result) {
      this.mixin_hideDialog('SendEmail');
      //이메일 발송 성공 시, 상담 종료 및 후처리 상태 업데이트(답변 메일이로 채팅_상담_ID가 같을 시)
      if(result.resultCode == "SUCC" && result.mode == "REPLY" && result.chtCuttId == String(this.CHAT_EMAIL.CHT_CUTT_ID)) {
        this.$emit("sendMsg", 'end');
        //상담 저장 슬라이드 오픈
        this.$emit("slideOpen");
      }
    },


  },
}
</script>

<style lang="scss" scoped>
</style>