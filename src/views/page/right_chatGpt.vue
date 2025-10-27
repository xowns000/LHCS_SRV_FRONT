<template>
  <div class="pl-right-chatgpt">
    <v-tabs class="pl-tabs" slider-size="4" v-model="activeTab">
      <div class="d-flex align-center flex-grow-1 pr-4">
        <v-tab @click="changeTab(0)">
          채팅
          <!-- <span v-if="chat_on" class="pl-chat-on"></span> -->
        </v-tab>
        <v-tab @click="changeTab(1)">최근활동</v-tab>
      <div class="pl-btn-wrap ml-auto">
        <!-- 새로고침 버튼 -->
        <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
        ></compo-tooltip-btn>
        <!-- 설정 버튼 -->
        <compo-tooltip-btn
          TitleProp="설정"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 is-setting"
          TooltipPositionProp="bottom"
          @btnClick="openSetting()"
        ></compo-tooltip-btn>
        <!-- 툴팁 버튼 -->
        <compo-tooltip-btn
          TitleProp="닫기"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 dialog-close"
          TooltipPositionProp="bottom"
          @btnClick="closeDialog()"
        ></compo-tooltip-btn>
      </div>
    </div>

    <v-tab-item>
      <!-- 채팅 -->
      <div  class="pl-right-chatgpt-type01">
        <div class="pl-right-chatgpt-top">
          <div class="d-flex">
            <h1>
              <span class="pl-chatgpt-palette-logo"></span>
              <p>안녕하세요 Chat GPT에 오신걸 환영합니다!</p>
              <span class="pl-cahtgpt-top-sub">웹용 AI 기반 Copilot</span>
            </h1>
            <div class="pl-chatgpt-robot-ani">
              <vLottiePlayer
                name="lottieRobot"
                :autoplay=true
                :loop=true
                width="190px"
                height="199px"
                :animationData="require('@/assets/lottie/animation_robot.json')"
              />
            </div>

          </div>
          <!-- chat carosel -->
          <div class="pl-chatgpt-carousel">
            <v-carousel
              hide-delimiter-background
              height="145"
              :show-arrows="false"
              :value="currentIndex"
              @change="updateIndex"
            >
              <v-carousel-item
                v-for="(group, index) in groupedItems"
                :key="index"
              >
                <div class="pl-chatgpt-carousel-unit">
                  <div
                      v-for="item in group"
                      :key="item.src"
                      :class="item.active ? 'active' : ''"
                      @click="selectedFavoriteQuestion(item)"
                    >
                      <!-- <strong>{{item.title}}</strong> -->
                      <p>{{item.qstn}}</p>
                    </div>
                </div>
              </v-carousel-item>
            </v-carousel>
          </div>
        </div>
        <!-- chat log -->
        <div class="pl-right-chatgpt-log">
          <div
            v-for="(item, itemIdx) in messages"
            :key="itemIdx"
            :class="`pl-right-chatgpt-log-${item.role}`"
          >
            <VueShowdown
              v-if="item.role == 'assistant'"
              class="ChatGPT-message"
              flavor="vanilla"
              :options="{ tables: true, simplifiedAutoLink: true, openLinksInNewWindow:true, smoothLivePreview: true }"
              :markdown="item.content"
            />
            <template v-if="item.role == 'user'">
              {{ item.content }}
            </template>

          </div>
          <div
            v-if="flagData.IS_WAIT_RESPONSE === true"
            class="pl-right-chatgpt-log-assistant"
            style="width: 60px"
          >
            <div class="ChatGPT-message">
              <div class="pl-typing-loader">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          <div style="margin-top: 4px;" ref="messagesEndRef" />
        </div>
        <!-- chat input -->
        <div class="pl-right-chatgpt-bottom">
          <div @click="aniCleaner" style="cursor: pointer;">
            <vLottiePlayer
              name="lottieClenaer"
              :autoplay=false
              width="50px"
              height="50px"
              :animationData="require('@/assets/lottie/animation_cleaner.json')"
              @animControl="anim => (lottieClenaer = anim)"
            />
          </div>
          <v-text-field
            class="pl-chatgpt-input"
            placeholder="무엇이든 물어보세요."
            rounded
            v-model="userMessage"
            @keydown.enter="sendMessage()"
          >
            <template v-slot:append>
              <v-btn
                icon
                @click="sendMessage()"
              >
                <span class="pl-chatgpt-send"></span>
              </v-btn>
            </template>
          </v-text-field>
          <compo-tooltip-btn
            :TitleProp="'취소'"
            ClassProp="pl-circle-btn ml-2"
            :IconProp="`pl-icon20 is-stop`"
            :DisabledProp="(chat_loading === false)"
            TooltipPositionProp="bottom"
            @btnClick="stopResponse"
          ></compo-tooltip-btn>
        </div>
      </div>
    </v-tab-item>
    <v-tab-item >
      <!-- 최근활동 -->
      <div class="pl-chatgpt-recent-list">
        <div
          v-for="(item, index) in RECENT_LIST"
          :key="index"
          class="pl-chatgpt-recent-list-unit"
          :style="getDelay(index)"
          >
          <span v-if="!item.editable" @click="getChatMessages(item.chatgpt_cht_id)">{{ item.cht_nm }}</span>
          <span v-else class="flex-grow-1">
            <v-text-field
              v-model="item.cht_nm"
              class="pl-form flex-grow-1 is-auto"
              @keydown.enter="updateItem(item)"
            ></v-text-field>
          </span>
          <span class="pl-chatgpt-recent-list-unit-date ml-2">{{ mixin_convertDate(item.mdfcn_dt, 'yyyy-MM-dd HH:mm') }}</span>
          <div class="pl-chatgpt-recne-list-func">
            <!-- 취소 버튼 -->
            <compo-tooltip-btn
              v-if="item.editable"
              TitleProp="취소"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 circle-close"
              TooltipPositionProp="bottom"
              @btnClick="cancelItem(item)">
            </compo-tooltip-btn>
            <!-- 수정 버튼 -->
            <compo-tooltip-btn
              v-if="!item.editable"
              TitleProp="수정"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 edit"
              TooltipPositionProp="bottom"
              @btnClick="editItem(item)"
            ></compo-tooltip-btn>
            <compo-tooltip-btn
              v-else
              TitleProp="확인"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 is-drag-icon-check"
              TooltipPositionProp="bottom"
              @btnClick="updateItem(item)"
            ></compo-tooltip-btn>
            <!-- 삭제 버튼 -->
            <compo-tooltip-btn
              TitleProp="삭제"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 trash"
              TooltipPositionProp="bottom"
              @btnClick="removeItem(item)"
            ></compo-tooltip-btn>
          </div>
        </div>
      </div>
    </v-tab-item>

    </v-tabs>
    <!-- 환경설정 Modal -->
    <div v-if="dialogChatgptSetting" class="pl-chatgpt-setting">
      <h1 class="d-flex align-center"><strong>ChatGPT</strong> Settings
        <compo-tooltip-btn
          TitleProp="닫기"
          ClassProp="pl-tooltip-btn ml-auto"
          IconProp="pl-icon20 dialog-close"
          TooltipPositionProp="bottom"
          @btnClick="dialogChatgptSetting = false"
        ></compo-tooltip-btn>
      </h1>
      <p class="is-txt-sub mt-1">chatGPT에서 사용되는 모델 및 관련 파라미터에 대한 설정을 조절합니다.<br>설정 값을 조절하신 후 [저장]버튼을 클릭 하십시오.</p>
      <v-form ref="formSetting"></v-form>
        <div class="pl-chatgpt-setting-body">
          <div class="pl-form-inline-wrap vertical">
            <!-- Model -->
            <div class="pl-form-inline">
              <span class="pl-label">
                Model
              </span>
              <div class="pl-desc">
                <v-select
                  v-model="ENV_SETTING.mdl_type_cd"
                  :items="ENV_CODE_LIST_PCG_MDL_TY"
                  item-text = "cd_nm"
                  item-value = "cd_id"
                  class="pl-form flex-grow-1"
                  placeholder="선택하세요"
                ></v-select>
                <p class="pl-form-hint">GPT 모델 선택</p>
              </div>
            </div>
            <!-- 연관 답변 개수 -->
            <div class="pl-form-inline">
              <span class="pl-label">
                연관 답변 개수
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="ENV_SETTING.doc_srch_cnt"
                  class="pl-form"
                  type="number"
                  value="0"
                  min="0"
                  max="10"
                  :rules="validateRules.DOC_SRCH_CNT"
                />
                <p class="pl-form-hint">벡터DB 유사도 검색 시 연관된 Chunk의 개수를 설정합니다.</p>
              </div>
            </div>
            <!-- 메모리 토큰 -->
            <div class="pl-form-inline">
              <span class="pl-label">
                메모리 토큰
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="ENV_SETTING.memoli_token_lmt"
                  class="pl-form"
                  type="number"
                  value="0"
                  min="0"
                  max="2000"
                  step="100"
                  :rules="validateRules.MEMOLI_TOKEN_LMT"/>
                <p class="pl-form-hint">기억할 이전 대화 히스토리의 최대 토큰 수를 설정.</p>
              </div>
            </div>
            <!-- Temperature -->
            <div class="pl-form-inline">
              <span class="pl-label">
                Temperature
              </span>
              <div class="pl-desc">
                <div class="d-flex align-center col-12 pa-0">
                  <vue-slider
                    v-model="ENV_SETTING.tempt"
                    :min=0
                    :max=1
                    :interval=0.01
                    value="0.5"
                    width="100%"
                    height="2px"
                  />
                  <v-text-field
                    v-model="ENV_SETTING.tempt"
                    class="pl-form is-sm ml-4"
                    reverse
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value="0.5"
                    :rules="validateRules.TEMPT"
                  />

                </div>
                <ul class="pl-list-dot is-no-border ">
                  <li class="pl-form-hint">텍스트의 다양성을 조절하는 파라미터로 값이 높을수록 모델이 생성하는 문장이 더 다양 해지고, 값이 낮을수록 더 일관성 있는 문장이 생성 됩니다.</li>
                  <li class="pl-form-hint">보다 객관적인 데이터를 얻기 위해서는 값을 상황에 맞게 조절해야 합니다. 일반적으로, 다양성과 일관성 사이의 균형을 유지하면서도 문장의 의미가 분명하게 전달되도록 하는 것이 좋습니다.</li>
                  <li class="pl-form-hint">일반적으로, 값이 0.5 ~ 1.0 사이에서 좋은 결과를 얻을 수 있습니다.</li>
                </ul>
              </div>
            </div>    
          </div>
        </div>
      </v-form>
      <div class="pl-btn-wrap justify-end is-mt-m">
        <v-btn class="pl-btn" @click="saveBtnSetting()">저장</v-btn>
      </div>

    </div>
  </div>
</template>

<script>
import { VueShowdown } from 'vue-showdown'
import { mapGetters } from "vuex"

export default {
  name: "RIGHT_CHATGPT", //name은 'MENU_' + 파일명 조합
  components: {
    VueShowdown
  },
  data() {
    return {
      activeTab: 0,
      //fastapi backend url
      CHATGPT_API_URL: process.env.VUE_APP_CHATGPT_API_URL,
      //fastapi backend 채팅 api prefix
      COMMON_URL: '/chatgpt-api/commons',
      SETTING_URL: '/chatgpt-api/settings',
      CHAT_URL: '/chatgpt-api/chats',
      VECTORDB_URL: '/chatgpt-api/vectordbs',
      //기본 벡터 DB
      VECTORDB: {
        chatgpt_vector_db_id: 1,
        custco_id: 1,
        db_nm: "샘플 Vector DB",
        db_type_cd: "FAISS",
        chunk_sz: 700,
        chunk_dpcn: 100,
        file_cnt: 1,
        whol_file_sz: null,
        whol_doc_prcs_hr: null,
        whol_vector_db_prcs_hr: null,
        use_yn: "Y",
        del_yn: "N",
        rgtr_id: 1,
        reg_dt: "20231010101010",
        mdfr_id: null,
        mdfcn_dt: null
      },
      //초기 메세지
      MESSAGE_HELLO: {
        // role: "assistant",
        // content: "돌아온 것을 환영합니다! 어떤 내용에 대해 채팅하려고 하나요?",
      },
      // chat 로딩중일때
      chat_loading: false,

      //ChatGPT 기본 설정
      SETTING: {
        chatgpt_srvc_stng_id: 1,
        custco_id: 1,
        srvc_type_cd: "CHT",
        bsc_stng_yn: "Y",
        use_yn: "Y",
        del_yn: "N",
        mdl_type_cd: "gpt-3.5-turbo-16k",
        tempt: 1,
        pmpt_tmpl: null,
        sys_tmpl: null,
        memoli_token_lmt: 1000,
        human_fix: "Question",
        ai_fix: "Answer",
        doc_srch_cnt: 7,
        grtng_msg: "돌아온 것을 환영합니다! 어떤 내용에 대해 채팅하려고 하나요?",
        rgtr_id: 1,
        reg_dt: "20231010101010",
        mdfr_id: null,
        mdfcn_dt: null
      },

      //설정 모달에서 사용할 ChatGPT 설정(수정 용도)
      ENV_SETTING: {},
      
      flagData: {
        IS_FIRST_CHUNK: true,       //chatGPT 응답 중 첫번째 chunk 여부
        IS_WAIT_RESPONSE : false,   //chatGPT 응답 대기 여부
        IS_STOP: false,             //응답 중지 여부
      },
      chat_on: true,
      FAVORITE_QUESTION: [],
      currentIndex: 0,
      itemsPerSlide: 3,


      //채팅 ID
      chatId : -1,
      message: {
        role: '',   //"assistant" | "user"
        content: ''
      },

      //채팅 대화 내역 :: message[]
      messages: [
//         {role:'user', content:`터치 화면 사용하기
// - 누르기: 화면을 가볍게 누릅니다.
// - 길게 누르기: 화면을 2초 이상 누릅니다.`},
//         {role:'assistant', content:`터치 화면 사용하기
// - 누르기: 화면을 가볍게 누릅니다.
// - 길게 누르기: 화면을 2초 이상 누릅니다.
// - 스`}
      ],
      userMessage: '',
      editName: '',     //최근 활동 채팅 명 수정 시, 수전 전 채팅명 저장(취소 시 원복을 위해.)
      RECENT_LIST: [
        {
          cht_nm: '테스트 테스트',
          mdfcn_dt: '2023년 12월 22일',
          editable: false,
        },
      ],
      lottieClenaer: null,

      // 환경설정
      dialogChatgptSetting: false,
      ENV_CODE_LIST_PCG_MDL_TY:[],    //환경설정 - ChatGPT 모델 목록
      // confirm alert 메시지
      MESSAGE : {
        CONFIRM : {
          SAVE_SETTING : {alertDialogToggle: true, msg: '저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.saveSetting, callNo: this.closeMsg}
          
        },
        ALERT : {
          SAVE_SUCCESS : {alertDialogToggle: true, msg: '저장 되었습니다.', iconClass: 'is-info', type: 'default'}
          , ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
          
        }
      },
      //ValidationRules
      validateRules: {
        DOC_SRCH_CNT: [
          v => (!!v || v == 0) || '연관 답변 개수는 필수 입력 항목 입니다.',
          v => /^[0-9]+$/.test(v) || "연관 답변 개수는 숫자만 입력 가능합니다.",
          v => (!isNaN(parseFloat(v)) && v >= 0 && v <= 10) || '연관 답변 개수는 0 ~ 10 사이의 숫자만 입력 가능합니다.'
        ],
        MEMOLI_TOKEN_LMT: [
        v => (!!v || v == 0) || '메모리 토큰은 필수 입력 항목 입니다.',
          v => /^[0-9]+$/.test(v) || "메모리 토큰은 숫자만 입력 가능합니다.",
          v => (!isNaN(parseFloat(v)) && v >= 0 && v <= 2000) || '메모리 토큰은 0 ~ 2,000 사이의 숫자만 입력 가능합니다.'
        ],
        TEMPT: [
          v => (!!v || v == 0) || 'Temperature는 필수 입력 항목 입니다.',
          v => /^[0-9.]+$/.test(v) || "Temperature는 숫자만 입력 가능합니다.",
          v => (!isNaN(parseFloat(v)) && v >= 0 && v <= 1) || 'Temperature는 0 ~ 1 사이의 숫자만 입력 가능합니다.'
        ],
        
      },
      // flag
      flagData: {
        IS_ATRT: false                      //권한(authrt) 체크
      },

    }
  },
  methods: {
    //채팅 초기화.
    async initChat() {
      this.VECTORDB = await this.getActiveVectorDb()
      this.SETTING = await this.getAtiveChatSetting()

      this.chatId = -1
      this.messages = [{role: 'assistant', content: this.SETTING.grtng_msg}]

      //나의 인기 질문 조회
      const resData = await this.getFavoriteQuestion()
      if(!resData.HEADER.ERROR_FLAG) {
        this.FAVORITE_QUESTION = resData.list
      }
    },

    updateIndex(newIndex) {
      this.currentIndex = newIndex
    },
    selectedFavoriteQuestion(item) {
      this.removeActiveFavoriteQuestion()
      item.active = true
      this.userMessage = item.qstn
      this.sendMessage()
    },
    removeActiveFavoriteQuestion(){
      const _favoriteQuestionList = this.FAVORITE_QUESTION

      for (let i = 0; i < _favoriteQuestionList.length; i++) {
        _favoriteQuestionList[i].active = false
      }
    },
    editItem(item) {
      this.editName = item.cht_nm
      item.editable = true
    },

    async updateItem(item) {
      const updateChatData = {
        cht_nm: item.cht_nm,
      }
      await this.updateChat(item.chatgpt_cht_id, updateChatData)
      item.editable = false
    },
    cancelItem(item) {
      item.cht_nm = this.editName
      item.editable = false
    },

    async removeItem(item) {
      const updateChatData = {
        del_yn: 'Y',
      }
      await this.updateChat(item.chatgpt_cht_id, updateChatData)
      const index = this.RECENT_LIST.indexOf(item)
      if(index !== -1) {
        this.RECENT_LIST.splice(index, 1)
      }
    },
    getDelay(index){
      return {
        'animation-delay': `${index * 0.08}s`, // 0.1초 간격으로 순차적으로 나타납니다.
      }
    },


    async getChatMessages(chatgpt_cht_id) {
      let sURL = this.CHAT_URL+"/chat-messages/" + chatgpt_cht_id
      const resData = await this.chatGPT_getCall(sURL,{},{})
      if(!resData.HEADER.ERROR_FLAG) {
        this.chatId = resData.list[0].chatgpt_cht_id
        this.messages = []
        resData.list.map(item => {
          this.messages.push({role: item.trgt_type_cd, content: item.msg})
        })
        
        setTimeout(() => {
          this.$refs.messagesEndRef.scrollIntoView(true)
        }, 50)
        this.changeTab(0)
      }
    },

    aniCleaner(){
      this.lottieClenaer.playSegments([0,30], true)
      this.initChat()
    },

    //채팅 메세지 발송
    async sendMessage() {
      if (!this.userMessage) {
        alert("메세지를 입력하세요.")
        return
      }
      //로딩 메시지 출력
      this.flagData.IS_WAIT_RESPONSE = true
      setTimeout(() => {
        this.$refs.messagesEndRef.scrollIntoView(true)
      }, 50)


      //이용자 메세지 생성.
      this.message = { role: "user", content: this.userMessage }

      this.messages = [...this.messages, this.message]
      this.userMessage = ""
      this.$refs.messagesEndRef.scrollIntoView(true)
      let sendChatId = this.chatId

      if(this.chatId === -1) {
        const saveChatData = {
          chatgpt_vector_db_id: this.VECTORDB.chatgpt_vector_db_id,
          cht_nm: this.message.content,
          chatgpt_cht_msg: {
            chatgpt_srvc_stng_id: this.SETTING.chatgpt_srvc_stng_id,
            trgt_type_cd: this.messages[0].role,
            msg: this.messages[0].content,
          }
        }
        let newChat = await this.saveChat(saveChatData)
        this.chatId = newChat.chatgpt_cht_id
      }

      this.flagData.IS_FIRST_CHUNK = true
      let sURL = this.CHATGPT_API_URL + this.CHAT_URL+"/stream"
      const sendMessageData = {
        msg: this.message.content,
        chatgpt_cht_id: this.chatId,
        chatgpt_srvc_stng_id: this.SETTING.chatgpt_srvc_stng_id,
        chatgpt_vector_db_id: this.VECTORDB.chatgpt_vector_db_id,
        history: this.messages,
      }
      // header.token 전송
      const token = window.sessionStorage.getItem("token")

      await fetch(sURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "bearer " + token,
          "CERT-CUSTCO-TENANT-ID": this.$store.getters["authStore/GE_CUSTCO_TENANT_ID"],
          "CERT-CUSTCO-ID": this.$store.getters['userStore/GE_USER_ROLE'].company.CD
        },
        body: JSON.stringify(sendMessageData),
      })
      .then(this.processChunkedResponse)
      .then(this.onChunkedResponseComplete)
      .catch(this.onChunkedResponseError)

    },


    //활성화된 채팅 설정 조회
    async getAtiveChatSetting(){
      let sURL = this.SETTING_URL+"/chat"
      return await this.chatGPT_getCall(sURL,{})
    },


    //활성화된 벡터 DB 설정 조회
    async getActiveVectorDb(){
      let sURL = this.VECTORDB_URL+"/activedb"
      return await this.chatGPT_getCall(sURL,{})
    },


    async getFavoriteQuestion(){
      let sURL = this.CHAT_URL+"/chat-favorite-question/list"
      return await this.chatGPT_getCall(sURL,{})
    },


    //신규 채팅(대화) 세션 저장
    async saveChat(saveData){
      //console.log("saveChat ::: ", saved)
      let sURL = this.CHAT_URL+"/save-chat"
      return await this.chatGPT_postCall(sURL,saveData,{})
    },

    async updateChat(chtgpt_cht_id, updateData){
      //console.log("saveChat ::: ", saved)
      let sURL = this.CHAT_URL+"/update-chat/" + chtgpt_cht_id
      return await this.chatGPT_postCall(sURL,updateData,{})
    },
    

    onChunkedResponseComplete(result) {
      this.chat_loading = false
      this.flagData.IS_STOP = false
    },

    onChunkedResponseError(err) {
      console.error(err)
    },

    processChunkedResponse(response) {
      let text = ''
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      const encoder = new TextEncoder()

      const appendChunks = (function(result) {
        var chunks = decoder.decode(result.value || new Uint8Array, {stream: !result.done}).split("\n\n")
        chunks.filter(chunk => chunk !== "").map((chunk, index) => {
          chunk = chunk.replace("data:","")
          text += chunk

          const data = chunk

          if (data === "[DONE]" || this.flagData.IS_STOP) {
            return
          }

          try {
            const json = JSON.parse(data)
            const text = json.choices[0].delta.content
            this.sendMessageChunk(text)

          } catch (e) {
            console.error(e, '==', data, '==')
          }
        })


        if (result.done || this.flagData.IS_STOP) {
          //console.log('returning')
          return text
        } else {
          //console.log('recursing')
          return readChunk()
        }
      }).bind(this)

      return readChunk()

      function readChunk() {
        return reader.read().then(appendChunks)
      }

    },

    sendMessageChunk(chunkValue) {

      if (this.flagData.IS_FIRST_CHUNK) {
        this.flagData.IS_FIRST_CHUNK = false
        this.messages = [
          ...this.messages,
          {
            role: "assistant",
            content: chunkValue
          }
        ]
        //로딩 메시지 제거
        this.flagData.IS_WAIT_RESPONSE = false
        this.chat_loading = true
      } else {
        const lastMessage = this.messages[this.messages.length - 1]
        const updatedMessage = {
          ...lastMessage,
          content: lastMessage.content + chunkValue
        }
        this.messages = [...this.messages.slice(0, -1), updatedMessage]
      }
      this.$refs.messagesEndRef.scrollIntoView(true)
    },

    //답변 멈춤
    stopResponse() {
      this.flagData.IS_STOP = true
    },

    //창 닫기
    closeDialog() {
      this.stopResponse()
      setTimeout(() => {
        this.$emit('hide')
      }, 100)

    },


    //탭 변경
    changeTab(index) {
      this.activeTab = index
      if(index == 1) {
        this.getRecentList()
      }
    },


    //최근 활동 조회
    async getRecentList() {
      let sURL = this.CHAT_URL+"/list"
      this.RECENT_LIST = await this.chatGPT_getCall(sURL,{})
    },

    //설정 모달 오픈
    async openSetting() {
      this.ENV_SETTING = await this.getAtiveChatSetting()
      this.ENV_CODE_LIST_PCG_MDL_TY = await this.getCustcoCommCd("PCG_MDL_TY")
      this.dialogChatgptSetting = !this.dialogChatgptSetting
    },


    async getCustcoCommCd(group_cd_id) {
      let sURL = this.COMMON_URL+"/comm-cd/" + group_cd_id
      return await this.chatGPT_getCall(sURL,{})
    },


    //validate check
    detailValidateSetting () {
      return this.$refs.formSetting.validate()
    },

    //기업고객정보 저장 버튼 클릭 시
    saveBtnSetting() {
      // 권한 체크
      this.atrt()
      if (!this.flagData.IS_ATRT){
        return
      }

      if (!this.detailValidateSetting()) {
        if(!this.openValidationMessage(this.validateRules.DOC_SRCH_CNT, this.ENV_SETTING.doc_srch_cnt)) {
          return
        }
        if(!this.openValidationMessage(this.validateRules.MEMOLI_TOKEN_LMT, this.ENV_SETTING.memoli_token_lmt)) {
          return
        }
        if(!this.openValidationMessage(this.validateRules.TEMPT, this.ENV_SETTING.tempt)) {
          return
        }
        return
      }

      this.showAlert(this.MESSAGE.CONFIRM.SAVE_SETTING)

    },

    //기업고객 정보 저장
    async saveSetting() {
      const URLData = this.SETTING_URL+"/save-chat-simple"
      let postParam = {
        rgtr_id: this.stoUserId    
        , mdl_type_cd: this.ENV_SETTING.mdl_type_cd                              // Model
        , doc_srch_cnt: this.ENV_SETTING.doc_srch_cnt                            // 연관 검색 건수
        , memoli_token_lmt: this.ENV_SETTING.memoli_token_lmt                    // 메모리 토큰
        , tempt: this.ENV_SETTING.tempt                                          // Temperature
      }

      let response = await this.chatGPT_postCall(URLData, postParam, {})

      if (!response.HEADER.ERROR_FLAG) {
        this.ENV_SETTING = await this.getAtiveChatSetting()
        this.SETTING = JSON.parse(JSON.stringify(this.ENV_SETTING))
        this.showAlert(this.MESSAGE.ALERT.SAVE_SUCCESS)
        setTimeout(() => {
          this.$store.commit("alertStore/hideAlert")
        }, 2000)
      }
    },


    // 등록/삭제 권한 체크(시스템관리자)
    atrt(){
      if(this.user_role.atrtGroupId != (1) || this.mixin_isEmpty(this.user_role.atrtGroupId)){
        this.showAlert(this.MESSAGE.ALERT.CHECK_ATRT)
        this.flagData.IS_ATRT = false
      }else{
        this.flagData.IS_ATRT = true
      }
    },

    //validateRules의 rule 항목과 값을 받아 해당 항목의 rule이 true가 아닐 시 해당 메세지를 출력한다.
    //Rule을 순서대로 읽어와 먼저 rule을 위반하는 메세지를 showAlert으로 출력한다.
    //필수값 체크 메세지는 출력하지 않는다.(index:0)
    openValidationMessage(validateRulesItem, ruleValue, isShowInx0 = false) {
      try {
        validateRulesItem.map(
          (rule, index) => {
            const validValue = rule(ruleValue)
            if(validValue !== true) {
              //여러 rule 중 하나만 출력하기 위해 throw로 map 벗어남.
              if(index == 0 && isShowInx0 === false) {
                //필수값 메세지는 출력하지 않는다.(index:0)
                throw {isShow:false, message:validValue}
              } else {
                throw {isShow:true, message:validValue}
              }
            }
          }
        )
      } catch(e) {
        if(e.isShow) {
          this.showAlert({alertDialogToggle: true, msg: e.message, iconClass: 'is-caution', type: 'default'})
          return false
        }
      }
      return true
    },

    closeMsg() {
      this.$store.commit("alertStore/hideAlert")
    },

  },
  mounted() {
    //채팅 초기화.
    this.initChat()
  },
  created() {
  },
  computed: {
    ...mapGetters({
      user_role: "userStore/GE_USER_ROLE", // 사용자ROLE
      stoUserId: 'userStore/GE_USER_ID',
      stoUserComp: 'userStore/GE_USER_COMPANY',
      stoCntnIp: 'userStore/GE_USER_IP_ADDR',
    }),
    groupedItems() {
      const groups = []
      for (let i = 0; i < this.FAVORITE_QUESTION.length; i += this.itemsPerSlide) {
        groups.push(this.FAVORITE_QUESTION.slice(i, i + this.itemsPerSlide))
      }
      return groups
    },

  }
}
</script>

<style lang="scss" scoped>

</style>