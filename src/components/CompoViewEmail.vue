<template>
  <div
    class="pl-chat-email-wrap">
    <!-- 이메일 상단 정보 -->
    <div v-if="EMAIL.TTL" class="pl-chat-email-wrap-top">
      <v-icon class="pl-icon30 is-email" ></v-icon>
      <div class="is-ellips">
        <strong >{{ EMAIL.TTL }}</strong>
        <div>
          <span class="pl-chat-email-wrap-title">
            보낸 사람
          </span>
          <span class="pl-chat-email-wrap-desc">
            {{ EMAIL.SNDR_EML }}
          </span>
        </div>
        <div>
          <span class="pl-chat-email-wrap-title">
            받는 사람
          </span>
          <span class="pl-chat-email-wrap-desc">
            {{ EMAIL.RCVR_EML }}
          </span>
        </div>
      </div>
      <div class="pl-chat-email-wrap-top-date" >
        {{ this.mixin_convertDate(EMAIL.RCPTN_DT, 'yyyy-MM-dd HH:mm:ss') }}
      </div>
    </div>
    <div
      v-else
      class="pl-list-nodata"
    >
      <span>등록된 데이터가 없습니다.</span>
    </div>
    <!-- 이메일 컨텐츠 -->
    <div
      class="pl-chat-email-wrap-content"
      :style="DataProp.CALL_BY && DataProp.CALL_BY == 'CHAT_LOG_EMAIL' ? 'min-height: calc(100vh - 393px);height:inherit;' : ''"
      >
      <compo-file-grid
        v-if="EMAIL.FILE_LIST != undefined && EMAIL.FILE_LIST.length > 0"
        NoMarginProp
        TitleProp=""
        :HeadersProp="filelist_header"
        :FilesProp="EMAIL_FILE_LIST"
        :HeaderButtonProp="false"
      />
      <div class="is-mt-m"
        v-dompurify-html="EMAIL.CN"
      />

    </div>
  </div>
</template>
<script>
export default {
  //이메일 발송 이력 조회
  name: 'CompoViewEmail',
  props: {
    DataProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  components: {

  },
  data() {
    return {
      EML_SNDNG_ID: '',
      CHT_CUTT_ID: '',

      //이메일 정보
      EMAIL: {
        TTL: '',
        SNDR_EML: '',
        RCVR_EML: '',
        RCPTN_DT: '',
        FILE_LIST: [],
      },
      EMAIL_FILE_LIST: [],

      // file grid
      filelist_header: [
        { text: '파일명', value: 'filename', align: 'left',sortable: false },
        { text: '크기', value: 'filesize', align: 'left',sortable: false , width: '100px'},
        { text: '다운로드', value: 'download', align: 'center',sortable: false, width: '100px' },
        { text: '다운로드 수', value: 'count', align: 'center',sortable: false, width: '100px' },
      ],
    }
  },

  async created() {
    // console.log("DataProp.HEIGHT", this.DataProp.HEIGHT)
    this.initEmail()
  },

  async mounted() {
  },

  beforeDestroy() {
  },

  watch: {
    DataProp() {
      this.initEmail();
    },
  },

  computed: {

  },

  methods: {
    //EMAIL 정보를 넘겨 받을 시, EMAIL data에 매핑,
    //EML_SNDNG_ID를 넘겨 받을 시, 이메일 조회.
    //CHT_CUTT_ID를 넘겨 받을 시, EMAIL_TYPE에 따라 이메일 조회 또는 채팅 상담 이메일 조회
    async initEmail() {
      if(this.DataProp.EMAIL) {
        this.EMAIL = this.DataProp.EMAIL;
        this.EMAIL_FILE_LIST = this.EMAIL.FILE_LIST;

      } else if(this.DataProp.EML_SNDNG_ID) {
        this.EML_SNDNG_ID = this.DataProp.EML_SNDNG_ID;
        this.getSendEmail();
      } else if(this.DataProp.CHT_CUTT_ID) {
        //통합 접촉이력 - 채팅 상담이력 조회 시, 채팅_이메일_상담 - 이메일 출력
        this.CHT_CUTT_ID = this.DataProp.CHT_CUTT_ID;
        this.EMAIL_TYPE = this.DataProp.EMAIL_TYPE;
        if(this.EMAIL_TYPE == 'EMAIL') {
          this.getSendEmail();
        } else if(this.EMAIL_TYPE == 'CHAT_CUTT') {
          this.getChatCuttEmail();
        }
      }
    },

    async getSendEmail() {
      let sUrl = '/api/email/getSendEmail';
      let postParam = {
        EML_SNDNG_ID: this.EML_SNDNG_ID,
        CHT_CUTT_ID: this.CHT_CUTT_ID /**채팅_이메일_상담 내역 조회 시, CHT_CUTT_ID만 넘긴다. */
      }

      const response  = await this.common_postCall(sUrl, postParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.setEmailData(response.HEADER.COUNT, response.DATA[0]);
      }
    },


    async getChatCuttEmail() {
      let sUrl = '/chat-api/main/cnslt-cn/inqire';
      let postParam = {
        CHN_CLSF_CD: 'EMAIL',
        CHT_CUTT_ID: this.CHT_CUTT_ID
      }

      let headParam = {
        head: {
        }
      }

      const response = await this.chat_postCall(sUrl, postParam, headParam)

      if (!response.header.ERROR_FLAG) {
        this.setEmailData(response.header.COUNT, response.data[0]);
      }
    },

    //emailData 설정.
    async setEmailData(count, emailData) {
      if(count > 0) {
        this.EMAIL = emailData;

        this.toEmail = this.EMAIL.RCVR_EML;
        this.emailSubject = this.EMAIL.TTL;
        this.editorData = this.EMAIL.CN;
        this.FILE_GROUP_KEY = this.EMAIL.FILE_GROUP_KEY;
        this.chtCuttId = this.EMAIL.CHT_CUTT_ID;

        if(this.EMAIL.FILE_LIST != undefined && this.EMAIL.FILE_LIST.length > 0) {
          this.EMAIL_FILE_LIST = [];
          this.EMAIL.FILE_LIST.map((item, index) => {
            this.EMAIL_FILE_LIST.push({
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
        }
      }

    },

    extractBodyFromHTML(htmlString) {
      // 정규 표현식을 사용하여 body 태그 및 내용 추출
      const bodyRegex = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
      const match = bodyRegex.exec(htmlString);
      
      if (match && match.length > 1) {
        return match[1]; // body 내용 반환
      } else {
        return htmlString; // body 태그가 없을 경우 htmlString 반환
      }
    },

  },
}
</script>

<style lang="scss" scoped>
</style>