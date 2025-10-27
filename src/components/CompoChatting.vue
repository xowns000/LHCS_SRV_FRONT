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
        class="pl-chatting-divide-btn"
        v-if="BfrChatLogProp.length != 0 ? (BfrChatLogProp[0].BFR_CHT != '' && BfrChatLogProp[0].BFR_CHT != null && BfrChatLogProp[0].BFR_CHT != undefined)
          : (ChatLogProp.length !=0 && ChatLogProp[0].BFR_CHT != '' && ChatLogProp[0].BFR_CHT != null && ChatLogProp[0].BFR_CHT != undefined)">
        <v-btn
          @click="bfrChatHstSrch()"
          class="pl-btn is-sub is-round">
          이전 고객의 상담내용 불러오기
        </v-btn>
      </div>
      <div
        v-for="bfrLog,i in BfrChatLogProp"
        :key="bfrLog.id"
        :class="bfrLog.SNDRCV_CD === 'RCV' ? 'is-rcv' : 'is-snd'"
        class="pl-chatting-wrap"
        >
        <img
          v-if="bfrLog.TYPE != 'CHT_SE' && (bfrLog.TYPE == 'IM' || bfrLog.TYPE == 'photo') ? true : false"
          :src="bfrLog.IMAGE_URL"
          class="pl-chatting-log-img"
          @click="chat_img_expand(bfrLog.IMAGE_URL)"
          style="cursor: pointer;"
        />
        <div
          v-if="bfrLog.TYPE != 'CHT_SE' && bfrLog.TYPE != 'IM' && bfrLog.TYPE != 'photo' && bfrLog.TYPE != 'product' && bfrLog.TYPE != 'FI' && bfrLog.TYPE != 'AU' && bfrLog.TYPE != 'INFOMSG' && bfrLog.TYPE != 'QSTN'  ? true : false"
          class="pl-chatting-log-content"
          :style="`font-size:${ chatFontSize }px`"
          v-text="mixin_replaceDoubleBackslashNewLine(bfrLog.CONTENT)"
          ></div>
        <div
          v-if="bfrLog.TYPE == 'QSTN' && bfrLog.QSTN_TYPE_MSG"
          class="pl-chatting-log-content"
          :style="`font-size:${ chatFontSize }px`"
          >
          {{ bfrLog.QSTN_TYPE_MSG }}
          <span
            v-for="btnList in bfrLog.QSTN_BTN_LIST"
            >
            <br>
            <span
              v-if="btnList"
              :style="BfrChatLogProp[i+1].QSTN_TYPE_NM == btnList? 'border:2px solid red' : 'border:1px solid black'"
              >
              {{ btnList }}
            </span>
            <span
              v-else
              :style="BfrChatLogProp[i+1].CONTENT.indexOf('BACK_') != -1? 'border:2px solid red' : 'border:1px solid black'"
              >
              {{ '< 이전' }}
            </span>
          </span>
        </div>
        <div
          v-if="bfrLog.TYPE == 'INFOMSG'"
          class="pl-chatting-log-content"
          :style="`font-size:${ chatFontSize }px`"
          >
          <div
            v-text="mixin_replaceDoubleBackslashNewLine(bfrLog.CONTENT.split('||')[0])"
            >
          </div>
          <div
            v-for="infoMsg,i in JSON.parse(transeInfoMsg(bfrLog.CONTENT.split('||')[1],'de'))"
            >
            {{ infoMsg.TITLE }} : 
            {{ infoMsg.VALUE }}
          </div>
        </div>
        <!-- 채팅 구분선 -->
        <div
          v-if="bfrLog.TYPE == 'CHT_SE'"
          class="pl-chatting-divide"
          ></div>
        <span v-if="bfrLog.TYPE != 'CHT_SE' && bfrLog.TYPE != 'CHBT' && (bfrLog.TYPE == 'QSTN' && bfrLog.QSTN_TYPE_MSG)" class="pl-chatting-log-date">{{ bfrLog.CHAT_DATE }}</span>
      </div>
      <div
        v-for="chbt in chbtProp"
        :key="chbt.MESSAGE_ID"
        :class="[chbtProp && chbt.CONTENT.length>1 ? 'is-chatbot' : chbtProp && chbt.CONTENT[0].IMAGE ? 'is-chatbot' : null, chbt.SNDRCV_CD === 'RCV' ? 'is-rcv' : 'is-snd']"
        class="pl-chatting-wrap"
        >
        <template v-if="chbt.CONTENT.length>1">
          <v-btn
            v-show="isChatbotNavPrev"
            class="pl-chatbot-prev"
            fab
            depressed
            @click="chatbotPrev"><v-icon>mdi-arrow-left</v-icon></v-btn>
          <v-btn
            v-show="isChatbotNavNext"
            class="pl-chatbot-next"
            fab
            depressed
            @click="chatbotNext"><v-icon>mdi-arrow-right</v-icon></v-btn>
        </template>
        <!-- 챗봇 -->
        <div
          v-if="chbt.CONTENT.length>1"
          ref="chatBotWidth"
          class="pl-chatting-chatbot-wrap"
          :style="`font-size:${ chatFontSize }px; left: ${chatbotNav}px`"
          >
          <div v-for="chbtList in chbt.CONTENT">
            <div
              v-if="chbtList.CONTENT"
              class="pl-chatting-chatbot-wrap-content">
              <strong v-if="chbtList.PRODICTION" class="">{{ chbtList.PRODICTION }}</strong>
              <span v-if="chbtList.DATE">{{ chbtList.DATE }}</span>
              <span v-if="chbtList.PRICE" class="is-txt-sub">{{ chbtList.PRICE }}</span>
              <div v-if="chbtList.CONTENT" class="is-mt-s type-option">{{ chbtList.CONTENT }}</div>
            </div>
            <div class="pa-2">
              <v-img
                class="pl-chatting-log-img"
                v-if="chbtList?.IMAGE ? true : false"
                :src="chbtList.IMAGE"
                @click="chat_img_expand(chbtList.IMAGE)"
                max-width="120"
                max-height="120"
                style="cursor: pointer;"
                />
            </div>
          </div>
        </div>
        <div
          v-else-if="chbt.CONTENT[0].IMAGE"
          ref="chatBotWidth2"
          class="pl-chatting-chatbot-wrap"
          :style="`font-size:${ chatFontSize }px; left: -100px`"
          >
          <div v-for="chbtList in chbt.CONTENT">
            <div
              v-if="chbtList.CONTENT"
              class="pl-chatting-chatbot-wrap-content">
              <strong v-if="chbtList.PRODICTION" class="">{{ chbtList.PRODICTION }}</strong>
              <span v-if="chbtList.DATE">{{ chbtList.DATE }}</span>
              <span v-if="chbtList.PRICE" class="is-txt-sub">{{ chbtList.PRICE }}</span>
              <div v-if="chbtList.CONTENT" class="is-mt-s type-option">{{ chbtList.CONTENT }}</div>
            </div>
            <div class="pa-2">
              <v-img
                class="pl-chatting-log-img"
                v-if="chbtList?.IMAGE ? true : false"
                :src="chbtList.IMAGE"
                @click="chat_img_expand(chbtList.IMAGE)"
                max-width="120"
                max-height="120"
                style="cursor: pointer;"
                />
            </div>
          </div>
        </div>
        <div
          v-else
          class="pl-chatting-log-content"
          :style="`font-size:${ chatFontSize }px`"
          v-text="mixin_replaceDoubleBackslashNewLine(chbt.CONTENT[0].CONTENT)"
        ></div>
        <span class="pl-chatting-log-date">{{ chbt.CHAT_DATE }}</span>

      </div>
      <div
        v-if="chbtUserProp?.AUTH_YN == 'Y' ? true : false"
        :class="'is-snd'"
        class="pl-chatting-wrap"
        >
        <div
          class="pl-chatting-log-content"
          :style="`font-size:${ chatFontSize }px`"
          v-text="mixin_replaceDoubleBackslashNewLine(chbtUserProp.CONTENT)"
          ></div>
      </div>
      <div
        v-for="log,i in ChatLogProp"
        :key="log.id"
        :class="log.SNDRCV_CD === 'RCV' ? 'is-rcv' : 'is-snd'"
        class="pl-chatting-wrap"
        >
        <img
          v-if="log.TYPE != 'CHT_SE' && (log.TYPE == 'IM' || log.TYPE == 'photo') ? true : false"
          :src="log.IMAGE_URL"
          class="pl-chatting-log-img"
          @click="chat_img_expand(log.IMAGE_URL)"
          style="cursor: pointer;"
        />
        <div
          v-if="log.TYPE != 'CHT_SE' && (log.TYPE == 'FI' || log.TYPE == 'AU') ? true : false"
          class="pl-chatting-log-content"
          :style="`font-size:${ chatFontSize }px`"
          v-text="mixin_replaceDoubleBackslashNewLine(log.CONTENT.substring(0, log.CONTENT.indexOf('||http://')))"
          @click="clkSendFile(log.CONTENT.substring(log.CONTENT.indexOf('||http://')+2))"
          style="cursor: pointer;"
        >
        </div>
        <div
          v-if="log.TYPE != 'CHT_SE' && log.TYPE != 'IM' && log.TYPE != 'photo' && log.TYPE != 'product' && log.TYPE != 'FI' && log.TYPE != 'AU' && log.TYPE != 'INFOMSG' && log.TYPE != 'QSTN' && log.TYPE != 'RSVT' && log.TYPE != 'custInfo' && log.TYPE != 'video' ? true : false"
          class="pl-chatting-log-content"
          :style="`font-size:${ chatFontSize }px`"
          >
          <!-- v-text="mixin_replaceDoubleBackslashNewLine(log.CONTENT)" -->
          <span
            v-for="cn,i in highlightMark(log.CONTENT)"
            >
            <span 
              v-if="cn.indexOf('<mark>') != -1"
              v-html="cn"
            ></span>
            <span 
              v-else
              v-text="mixin_replaceDoubleBackslashNewLine(cn)"
            ></span>
          </span>
        </div>
        <div
          v-if="log.TYPE == 'QSTN' && log.QSTN_TYPE_MSG"
          class="pl-chatting-log-content"
          :style="`font-size:${ chatFontSize }px`"
          >
          <!-- <div
            v-if="log.CONTENT.indexOf('BACK_') != -1"
            class="pl-chatting-log-content"
            >
              {{ '< 이전' }}
          </div>
          <div
            v-if="log.QSTN_TYPE_NM"
            class="pl-chatting-log-content"
            >
            {{ log.QSTN_TYPE_NM }}
          </div> -->
          {{ log.QSTN_TYPE_MSG }}
          <span
            v-for="btnList in log.QSTN_BTN_LIST"
            >
            <br>
            <span
              v-if="btnList"
              :style="ChatLogProp[i+1].QSTN_TYPE_NM == btnList ? 'border:2px solid red' : 'border:1px solid black'"
              >
              {{ btnList }}
            </span>
            <span
              v-else
              :style="ChatLogProp[i+1].CONTENT.indexOf('BACK_') != -1? 'border:2px solid red' : 'border:1px solid black'"
              >
              {{ '< 이전' }}
            </span>
          </span>
        </div>
        <div
          v-if="log.TYPE == 'RSVT'"
          class="pl-chatting-log-content"
          :style="`font-size:${ chatFontSize }px`"
          >
          <div
            v-text="mixin_replaceDoubleBackslashNewLine(log.CONTENT.split('||')[0])"
            >
          </div>
          예약신청 날짜 : {{ log.RSVT_DT ? log.RSVT_DT : '미선택' }}
        </div>
        <div
          v-if="log.TYPE == 'INFOMSG'"
          class="pl-chatting-log-content"
          :style="`font-size:${ chatFontSize }px`"
          >
          <div
            v-text="mixin_replaceDoubleBackslashNewLine(log.CONTENT.split('||')[0])"
            >
          </div>
          <div
            v-for="infoMsg,i in JSON.parse(transeInfoMsg(log.CONTENT.split('||')[1],'de'))"
            >
            {{ infoMsg.TITLE }} : 
            {{ infoMsg.VALUE }}
          </div>
        </div>
        <!-- <div
          v-if="log.TYPE == 'custInfo'"
          class="pl-chatting-log-content"
          :style="`font-size:${ chatFontSize }px;`+'cursor:pointer'"
          @click="srhCust(log.CONTENT)"
          >
          고객님께서 정보를 입력하셨습니다.<br>
          고객명 : {{ getCustData(log.CONTENT,'CUST_NM') }}<br>
          전화번호 : {{ getCustData(log.CONTENT,'PHONE_NO') }}
        </div> -->
        <v-tooltip 
          v-if="log.TYPE == 'product' ? true : false"
          content-class="pl-tooltip right" 
          right>
          <template v-slot:activator="{ on, attrs }">
            <div
              v-bind="attrs"
              v-on="on"
              class="pl-chatting-log-content"
              :style="`font-size:${ chatFontSize }px`"
              @click="nttProductUrl(log.CONTENT.url)"
              style="cursor: pointer;"
              >
              <img
                :src="log.CONTENT.thumbUrl"
                width="200"
                height="200"
              /><br>
              <strong v-if="log.CONTENT.storeName" class="">{{ log.CONTENT.storeName }}</strong><br>
              <span v-if="log.CONTENT.currencyOriginalPrice" class="is-txt-sub">{{ log.CONTENT.currencyOriginalPrice }} -> </span><span v-if="log.CONTENT.currencyPrice" class="is-txt-sub">{{ log.CONTENT.currencyPrice }}</span>
              <div v-if="log.CONTENT.name" class="is-mt-s type-option">{{ log.CONTENT.name }}</div>
            </div>
          </template>
          <span>클릭하여 상품 페이지로 이동</span>
        </v-tooltip>
        <div
          v-if="log.TYPE == 'video'"
          class="pl-chatting-log-content"
          :style="`font-size:${ chatFontSize }px`"
          >
          <div>
            고객님께서 동영상을 발송하였습니다
          </div>
          <div
            class="mt-2"
            style="text-align:center;"
          >
            <v-btn class="pl-btn" @click="videoPopup(log.CONTENT)">동영상 확인하기</v-btn>
          </div>
        </div>
        <!-- 채팅 구분선 -->
        <div
          v-if="log.TYPE == 'CHT_SE'"
          class="pl-chatting-divide"
          ></div>
        <span v-if="log.TYPE != 'CHT_SE' && log.TYPE != 'CHBT' && ((log.TYPE == 'QSTN' && log.QSTN_TYPE_MSG)||log.TYPE != 'QSTN')" class="pl-chatting-log-date">{{ log.CHAT_DATE }}</span>
      </div>
      <div
        class="pl-chatting-divide-btn"
        v-if="ChatLogProp.length !=0 && ChatLogProp[ChatLogProp.length-1].AFTR_CHT != '' && ChatLogProp[ChatLogProp.length-1].AFTR_CHT != null && ChatLogProp[ChatLogProp.length-1].AFTR_CHT != undefined">
        <v-btn
          @click="aftrChatHstSrch()"
          class="pl-btn is-sub is-round">
          이후 고객의 상담내용 불러오기
        </v-btn>
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
                <compo-tooltip-btn
                  TitleProp="이미지 윈도우 팝업"
                  ClassProp="pl-tooltip-btn ml-4"
                  IconProp="pl-icon20 resize-off"
                  TooltipPositionProp="bottom"
                  @btnClick="[mixin_hideDialog('ImgExpand'),chat_img_popup()]"
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
        <div @click="clkDropRight1" style="cursor: pointer;">클릭이벤트1</div>
        <div @click="clkDropRight2" style="cursor: pointer;">클릭이벤트2</div>
        <div 
          v-if="CHT_CLK_PHN_NO == 'Y' && isNumber(SEL_TEXT)"
          @click="clkDropRight1" 
          style="cursor: pointer;">
          전화번호 저장
        </div>
        <div 
          v-if="CHT_CLK_PHN_NO == 'Y'"
          @click="clkDropRight1" 
          style="cursor: pointer;">
          주문내역 조회
        </div>
      </template>
      <template v-else>
        선택된 항목이 없습니다
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
export default {
  name: 'CompoChatting',
  props: {
    ChatLogProp: {
      type: Array,
    },
    BfrChatLogProp: {
      type: Array,
    },
    HeightProp: {
      type: String,
    },
    ClassProp: {
      type: String,
    },
    BfrChatProp: {
      type: Boolean,
    },
    chbtUserProp: {
      type: Object,
    },
    chbtProp: {
      type: Array,
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

      SEL_TEXT: '',

      dropRightClk: false,
      posX: 0,            //drop 위치
      posY: 0,            //drop 위치
      NudgeLeftProp:0,    //dialog 위치
      NudgeTopProp:0,     //dialog 위치
      
      CHT_CLK_PHN_NO: '',
      CHT_CLK_ORD_SRCH: '',
    }
  },
  methods: {
    chat_img_expand(img) {
      this.expandImgUrl = img;
      this.imgWidth = .5;
      this.mixin_showDialog('ImgExpand');
    },
    chat_img_popup() {
      this.imgWidth = .5;
      this.mixin_openWindow( 'LayoutPopup', '1140', '650', {compo_name : 'CompoImgExpand', expandImgUrl : this.expandImgUrl, imgWidth : this.imgWidth, callback : ''})
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

    transeInfoMsg(msg,cd){
      if(cd == 'en'){
        return msg.replaceAll("\"","&quot;");
      } else if(cd == 'de'){
        return msg.replaceAll("&quot;","\"");
      }
    },

    //고객정보입력
    getCustData(data,type){
      let jsonData = '';
      let json='';
      if(data){
        jsonData = data.replaceAll(" ","").replaceAll("CUST_NM:","\"CUST_NM\":\"").replaceAll(",PHONE_NO:","\",\"PHONE_NO\":\"").replaceAll("}","\"}");
        json = JSON.parse(jsonData);
        return json[type];
      } else {
        return '';
      }
    },

    //고객정보 검색
    srhCust(data){
      let custPhnNo = this.getCustData(data,'PHONE_NO');
      let custNm = this.getCustData(data,'CUST_NM');
      
      this.showAlert({alertDialogToggle: true, msg: "고개정보는 <br> 고객명 : "+custNm + "<br> 전화번호 : "+ custPhnNo +"<br>입니다", iconClass: 'is-info', type: 'default'});
    },

    isNumber(data){
      return /^[0-9]+$/.test(data);
    },

    highlightMark(data){
      let arr = [];
      let regex = new RegExp('<mark>', 'g');
      let matches = data.match(regex);
      let markNum = matches ? matches.length+1 : 0;
      if(markNum == 0){
        arr[0] = data;
      } else {
        for(let i=0;i<markNum;i++){
          arr[i*2] = data.substring(0, data.indexOf('<mark>'));
          data = data.substring(data.indexOf('<mark>'));
          if(i == markNum-1){
            arr[i*2+1] = data;
          } else {
            arr[i*2+1] = data.substring(0, data.indexOf('</mark>')+7);
            data = data.substring(data.indexOf('</mark>')+7);
          }
        }
      }
      return arr;
    },

    //동영상 팝업
    videoPopup(vodUrl){
      window.open(vodUrl,"_blank","width=800,height=800");
    },
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

  async created() {
    this.CHT_CLK_PHN_NO = await this.mixin_getChtStng('CHT_CLK_PHN_NO');
    this.CHT_CLK_ORD_SRCH = await this.mixin_getChtStng('CHT_CLK_ORD_SRCH');
  },

  mounted() {
  },
}
</script>

<style lang="scss" scoped>
</style>