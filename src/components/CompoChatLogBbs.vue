<template>
  <div class="pl-chatting" :class="ClassProp">
    <div
      :style="`height: ${HeightProp}`"
      class="pl-chatting-log"
      v-scroll.self="onScroll"
      ref="chatContainer"
      id="drag-area"
      @mouseup="selectText"
      @mousedown.right ="clkMouseRight"
      @contextmenu.prevent
      >
      <div
        v-for="log in ChatLogProp"
        :key="log.id"
        :class="'is-rcv'"
        class="pl-chatting-wrap"
        >
        <div v-if="!mixin_isEmpty(log.ULD_IMG_URL) ? true : false">
          <img
            v-for="img in imgUrls"
            :key="img"
            :src="img"
            class="pl-chatting-log-img"
            style="cursor: pointer;"
            @click="chat_img_expand(img)"
          />
        </div>
        <div
          v-if="!mixin_isEmpty(log.INQRY_CN) ? true : false"
          class="pl-chatting-log-content"
          :style="`font-size:${ chatFontSize }px`"
          v-text="mixin_decode(log.INQRY_CN)"
          style="cursor: pointer;"
        >
        </div>
        <!-- 채팅 구분선 -->
        <div
          v-if="log.TYPE == 'CHT_SE'"
          class="pl-chatting-divide"
          ></div>
        <span v-if="!mixin_isEmpty(log)" class="pl-chatting-log-date">{{ mixin_convertDate(log.WRT_DT, 'yyyy-MM-dd HH:mm:ss') }}</span>
      </div>
      <div
        v-for="log in ChatLogProp"
        :key="log.id"
        :class="'is-snd'"
        class="pl-chatting-wrap"
        >
        <div
          v-if="!mixin_isEmpty(log.ANSWR_CN) ? true : false"
          class="pl-chatting-log-content"
          :style="`font-size:${ chatFontSize }px`"
          v-text="computedAnswrCn(log.ANSWR_CN)"
          style="cursor: pointer;"
        >
        </div>
        <span v-if="!mixin_isEmpty(log)" class="pl-chatting-log-date">{{ mixin_convertDate(log.ANSWR_DT, 'yyyy-MM-dd HH:mm:ss') }}</span>
      </div>
      <!-- 이미지 확대 다이얼로그 -->
      <v-dialog
        v-model="dialogImgExpand"
        content-class="dialog-draggable is-lg is-scroll"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="이미지"
          @hide="mixin_hideDialog('ImgExpand')"
        >
          <template slot="body">
            <!-- component -->
            <div
              class="d-flex flex-column align-center"
              style="height: -webkit-fill-available;">
              <div class="d-flex align-center" style="width: 50%">
                <v-icon class="pl-icon20 zoom mr-4 "></v-icon>
                <vue-slider
                  v-model="imgWidth"
                  :min=0.1
                  :max=1
                  :interval=0.1
                  tooltip="none"
                  width="calc(100% - 46px)"
                  height="2px"
                  dragOnClick
                  @drag-start="toggleZoom = false"
                  :duration=0
                  adsorb
                />
                <compo-tooltip-btn
                  TitleProp="원본 보기"
                  ClassProp="pl-tooltip-btn ml-4"
                  IconProp="pl-icon20 zoom-fit"
                  TooltipPositionProp="bottom"
                  @btnClick="imgWidth = 1"
                ></compo-tooltip-btn>
              </div>
              <img
                :src="expandImgUrl"
                :style="`transform: scale(${imgWidth}); transform-origin: center top;`"
                class="is-mt-m"
              >

            </div>

          </template>
        </compo-dialog>
      </v-dialog>
    </div>
    <!-- 맨위로 -->
    <v-btn
      v-show="scrlTopBtn"
      icon
      class="pl-to-top"
      @click="scrlToTop"
    >
    </v-btn>

    <div
      v-if="dropRightClk"
      class="pl-drop-layer"
      v-click-outside="closeDrop"
      :style="{ position: 'fixed', top: `${posY}px`, left: `${posX}px` }"
      >
      <template v-if="SEL_TEXT != ''">
        <div class="pl-drop-layer-text">
          <strong>{{ SEL_TEXT }}</strong>
        </div>
        <div @click="clkDropRight1">클릭이벤트1</div>
        <div @click="clkDropRight2">클릭이벤트2</div>
      </template>
      <template v-else>
        선택된 항목이 없습니다
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import _ from 'lodash';
export default {
  name: 'CompoChatLogBbs',
  props: {
    ChatLogProp: {
      type: Array,
    },
    HeightProp: {
      type: String,
    },
    ClassProp: {
      type: String,
    },
  },
  data() {
    return {
      dialogImgExpand: false,
      expandImgUrl: '',
      scrlTopBtn: false,

      CHAT_LIST:[],
      imgWidth: .5,
      chatbotNav: 0,
      isChatbotNavPrev: true,
      isChatbotNavNext: true,
      chatbotBoxWidth: null,
      chatbotBox: 240 + 12,
      imgUrls:[],

      SEL_TEXT: '',

      dropRightClk: false,
      posX: 0,            //drop 위치
      posY: 0,            //drop 위치
      NudgeLeftProp:0,    //dialog 위치
      NudgeTopProp:0,     //dialog 위치
    }
  },
  methods: {
    chat_img_expand(img) {
      this.expandImgUrl = img;
      this.imgWidth = .5;
      this.mixin_showDialog('ImgExpand')
    },
    // 챗봇 좌우 스크롤
    chatbotPrev(){
      this.chatbotNav < 0 ? this.chatbotNav += this.chatbotBox : null;
    },
    chatbotNext(){
      const scrollWidth = this.$refs.chatBotWidth[0].scrollWidth - this.chatbotBox;
      this.chatbotBoxWidth = scrollWidth;
      -this.chatbotNav <= scrollWidth ? this.chatbotNav -= this.chatbotBox : null;
    },
    onScroll(e) {
      e.target.scrollTop > 50 ? this.scrlTopBtn = true : this.scrlTopBtn = false;
    },
    scrlToTop() {
      this.$refs.chatContainer.scrollTop = 0;
    },
    scrlToBottom() {
      if(this.$refs.chatContainer) {
        this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
      }
    },

    //이전 채팅 내역 조회
    bfrChatHstSrch(){
      this.$emit('bfrChatHstSrch');
    },

    //이전 채팅 내역 조회
    aftrChatHstSrch(){
      this.$emit('aftrChatHstSrch');
    },

    nttProductUrl(url){
      window.open(url, '_blank')
    },

    clkSendFile(fileUrl){
      window.open(fileUrl, '_blank')
    },

    //선택영역 글자 체크
    selectText() {
      let selection = document.getSelection();
      if(selection && selection.toString().length > 0){
        if(selection.toString().substring(0,1) == ' ' && selection.toString().substring(selection.toString().length-1,selection.toString().length) == ' '){
          this.SEL_TEXT = selection.toString().substring(1,selection.toString().length-1);
        } else if(selection.toString().substring(0,1) == ' ' && selection.toString().substring(selection.toString().length-1,selection.toString().length) != ' '){
          this.SEL_TEXT = selection.toString().substring(1);
        } else if(selection.toString().substring(0,1) != ' ' && selection.toString().substring(selection.toString().length-1,selection.toString().length) == ' '){
          this.SEL_TEXT = selection.toString().substring(0,selection.toString().length-1);
        } else {
          this.SEL_TEXT = selection.toString();
        }
      } else {
        this.SEL_TEXT = '';
      }
    },

    //마우스 우클릭 이벤트
    clkMouseRight(e){
      this.openDrop(e);
    },
    openDrop(event) {
      this.posX = event.clientX - this.NudgeLeftProp;
      this.posY = event.clientY - this.NudgeTopProp;
      this.dropRightClk = !this.dropRightClk;
    },
    //마우스 우클릭 드롭박스 hidden
    closeDrop() {
      this.dropRightClk = false;
    },

    //마우스 우클릭 후 이벤트1
    clkDropRight1(){
      this.showAlert({alertDialogToggle: true, msg: "클릭한 메시지는<br> \'"+this.SEL_TEXT+"\'<br>입니다", iconClass: 'is-info', type: 'default'});
    },

    //마우스 우클릭 후 이벤트2
    clkDropRight2(){
      this.showToast({msg: "클릭한 메시지는\'" + this.SEL_TEXT + "\'입니다", class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 });
    },
    computedAnswrCn(cn){
      return _.unescape(this.mixin_decode(cn))
    }
  },
  computed: {
    ...mapGetters({
      chatFontSize: 'commonStore/GE_COMMON_SETTING_FONTSIZE'
    }),
  },
  watch: {
    ChatLogProp: {
      handler() {
        this.$nextTick(() => {
          if( !this.BfrChatProp ) {
            this.scrlToBottom();
            this.chatbotNav = 0;
          }
          if( this.mixin_isEmpty(this.ChatLogProp.uld_img_url)){
            this.imgUrls = this.ChatLogProp.uld_img_url.split(',');
          }
          console.log("this.imgUrls", this.ChatLogProp);
        });
      },
      deep: true,
      immediate: true
    },
    chatbotNav: {
      handler() {
        this.isChatbotNavPrev = this.chatbotNav < 0;
        this.isChatbotNavNext = this.chatbotNav >= -this.chatbotBoxWidth;
      },
      immediate: true
    },
  },

  created() {
  },

  mounted() {
    
  },
}
</script>

<style lang="scss" scoped>
</style>