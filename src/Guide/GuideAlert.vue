<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <!-- //mark: Alert -->
    <h2>{{ toplink[0] }}</h2>
    <guide-table PropTitle="Data Props" :PropTable="propsTable" />
    <div class="guide-card">
      <div class="guide-gap">
        <v-btn class="pl-btn" @click="showAlert(ALERT_DATA_WARN)">경고 메세지</v-btn>
        <v-btn class="pl-btn" @click="showAlert(ALERT_DATA_SUCCESS)">완료 메세지</v-btn>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: Alert : confirm -->
    <h2>{{ toplink[1] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <v-btn class="pl-btn" @click="showAlert(ALERT_DATA_CONFIRM)">로그아웃</v-btn>
        <v-btn class="pl-btn" @click="showAlert(ALERT_DATA_CONFIRM2)">내용 확인</v-btn>
        <v-btn class="pl-btn" @click="showAlert(ALERT_DATA_CONFIRM3)">삭제 확인</v-btn>
        <v-btn class="pl-btn" @click="showAlert(ALERT_DATA_CONFIRM4)">다운로드 사유</v-btn>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />

    <!-- //mark: Toast -->
    <h2>{{ toplink[2] }}</h2>
    <guide-table PropTitle="Data Props" :PropTable="propsTableToast" />
    <div class="guide-card">
      <div class="guide-gap">
        <v-btn class="pl-btn" @click="showToast(TOAST_DEFAULT)">기본</v-btn>
        <v-btn class="pl-btn" @click="showToast(TOAST_SUCCESS)" >sucess</v-btn>
        <v-btn class="pl-btn" @click="showToast(TOAST_INFO)" >info</v-btn>
        <v-btn class="pl-btn" @click="showToast(TOAST_WARNING)" >warning</v-btn>
        <v-btn class="pl-btn" @click="showToast(TOAST_ALARM)" >상단 알림창</v-btn>

      </div>
    </div>
    <guide-srcview :ModelProp.sync="source04" :SrcProp="srcAll.srcInput_04" />

  </div>
</template>

<script>
import guideJs from '@/Guide/guide.js'

export default {
  name: "GuideAlert",
  props:{
    SelectedProp: {
      type: String,
    }
  },
  components: { },
  data() {
    return {
      toplink: [
        'Alert',
        'Alert : confirm',
        'Toast',
      ],
      source01: null,
      source02: null,
      source03: null,
      source04: null,
      source05: null,

      propsTable: [
        { name: 'alertDialogToggle', type: 'Boolean', default: 'false', description: 'v-model toggle', required: true },
        { name: 'type', type: 'String', default: 'default', description: 'default, confirm, callback, reserveCall', required: true },
        { name: 'msg', type: 'String', default: 'null', description: '메세지'},
        { name: 'iconClass', type: 'String', default: 'null', description: '아이콘 클래스'},
        { name: 'downloadable', type: 'Boolean', default: 'false', description: '다운로드 사유 속성'},
        // { name: 'count', type: 'String', default: 'null', description: '콜백/예약콜 수'},
        // { name: 'reserveCallTime', type: 'String', default: 'null', description: '예약콜 시간'},
        { name: 'callYes', type: 'fucntion', default: 'undefined', description: '{예} 버튼 이벤트'},
        { name: 'callNo', type: 'fucntion', default: 'undefined', description: '{아니오} 버튼 이벤트'},
        { name: 'isloading', type: 'String', default: 'false', description: '{예} 이벤트 로딩 출력'},
      ],
      propsTableToast: [
        { name: 'msg', type: 'String', default: 'null', description: '메세지'},
        { name: 'class', type: 'String', default: 'null', description: '클래스'},
        { name: 'icon', type: 'String', default: 'null', description: '아이콘 클래스'},
        { name: 'hasToastIcon', type: 'Boolean', default: 'false', description: '아이콘 유/무'},
        { name: 'time', type: 'Number', default: '3000', description: '토스트 사라지는 시간'},
        { name: 'progress', type: 'Boolean', default: 'false', description: '하단 로딩바'},
        { name: 'close', type: 'Boolean', default: 'false', description: '닫기 버튼'},
      ],

      ALERT_DATA_WARN: { alertDialogToggle: true, msg: '시스템 장애가 일어났습니다.<br>잠시후에 다시 시도해주세요.', iconClass: 'is-caution', type: 'default' },
      ALERT_DATA_SUCCESS: { alertDialogToggle: true, msg: '정상처리 되었습니다', iconClass: 'is-done', type: 'default' },

      ALERT_DATA_CONFIRM: { alertDialogToggle: true, msg: '로그아웃 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.callYes, callNo: this.callNo,},
      ALERT_DATA_CONFIRM2: { alertDialogToggle: true, msg: '내용을 저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.textYes, callNo: this.textNo, },
      ALERT_DATA_CONFIRM3: { alertDialogToggle: true, msg: '정말 삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.delYes, callNo: this.delNo, },
      ALERT_DATA_CONFIRM4: { alertDialogToggle: true, msg: '선택하신 정보를 다운로드 하시겠습니까?<br>다운로드 시 데이터 양에 따라 다소 시간이 소요 됩니다.', iconClass: 'is-info', type: 'confirm', callYes: this.delYes, callNo: this.delNo, downloadable: true},

      TOAST_DEFAULT: {  msg: '기본 메시지입니다.', },
      TOAST_SUCCESS: {  msg: '성공 메시지입니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000},
      TOAST_INFO: {  msg: '안내 메시지입니다.', class: 'info', hasToastIcon: true, icon: 'mdi-information-outline', time: 4000 },
      TOAST_WARNING: {  msg: '경고 메시지입니다.', class: 'warning', hasToastIcon: true, icon: 'mdi-close-circle', time: 6000, close: true },
      TOAST_ALARM: {  msg: '상단 알림 3초 입니다.', class: 'info', hasToastIcon: true, icon: 'mdi-information-outline', time: 3000, type: 'top', progress: true, close: true },

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<v-btn class="pl-btn" @click="showAlert(ALERT_DATA_WARN)">경고 메세지</v-btn>
<v-btn class="pl-btn" @click="showAlert(ALERT_DATA_SUCCESS)">완료 메세지</v-btn>`
          },
          { tab: "script", content:
`data () {
  return {
    ALERT_DATA_WARN: { alertDialogToggle: true, persistent: true, msg: '시스템 장애가 일어났습니다.<br>잠시후에 다시 시도해주세요.', iconClass: 'is-caution', type: 'default' },
    ALERT_DATA_SUCCESS: { alertDialogToggle: true, msg: '정상처리 되었습니다', iconClass: 'is-done', type: 'default' },
  }
},` },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`<v-btn class="pl-btn" @click="showAlert(ALERT_DATA_CONFIRM)">로그아웃</v-btn>
<v-btn class="pl-btn" @click="showAlert(ALERT_DATA_CONFIRM2)">내용 확인</v-btn>
<v-btn class="pl-btn" @click="showAlert(ALERT_DATA_CONFIRM3)">삭제 확인</v-btn>
<v-btn class="pl-btn" @click="showAlert(ALERT_DATA_CONFIRM4)">다운로드 사유</v-btn>`
          },
          { tab: "script", content:
`data () {
  return {
    ALERT_DATA_CONFIRM: { alertDialogToggle: true, msg: '로그아웃 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.callYes, callNo: this.callNo,},
    ALERT_DATA_CONFIRM2: { alertDialogToggle: true, msg: '내용을 저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.textYes, callNo: this.textNo, },
    ALERT_DATA_CONFIRM3: { alertDialogToggle: true, msg: '정말 삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.delYes, callNo: this.delNo, },
    ALERT_DATA_CONFIRM4: { alertDialogToggle: true, msg: '선택하신 정보를 다운로드 하시겠습니까?<br>다운로드 시 데이터 양에 따라 다소 시간이 소요 됩니다.', iconClass: 'is-info', type: 'confirm', callYes: this.delYes, callNo: this.delNo, downloadable: true},
  }
},
methods: {
  onAlert(options) {
    const timeout = options.timeout || 4000;
    const timeoutDone = options.timeout || 1000;
    this.$store.commit("alertStore/showAlert", {
      msg: options.msg,
      type: options.type || 'confirm',
      callYes: options.callYes || '',
      callNo: options.callNo || '',
      iconClass: options.iconClass || 'is-info',
      isloading: options.isloading || false,
      alertDialogToggle: true,
    });
    setTimeout(() => {
      this.$store.commit("alertStore/showAlert", {
        msg: options.successMsg || '',
        type: 'confirm',
        iconClass: 'is-done',
        isloading: false,
        alertDialogToggle: true,
      });
      setTimeout(() => {
        this.$store.commit("alertStore/hideAlert");
      }, timeoutDone);
    }, timeout);
  },
  callYes() {
    this.onAlert({
      msg: '로그아웃 하시겠습니까?',
      type: 'confirm',
      callYes: this.callYes,
      callNo: this.callNo,
      iconClass: 'is-info',
      isloading: true,
      successMsg: '로그아웃이 완료되었습니다.',
    });
  },
  textYes() {
    this.onAlert({
      msg: '내용을 저장하시겠습니까?',
      type: 'confirm',
      callYes: this.textYes,
      callNo: this.textNo,
      iconClass: 'is-info',
      isloading: true,
      successMsg: '저장이 완료되었습니다.',
    });
  },
  delYes() {
    this.onAlert({
      msg: '정말 삭제하시겠습니까?',
      type: 'confirm',
      callYes: this.delYes,
      callNo: this.delNo,
      iconClass: 'is-info',
      isloading: true,
      successMsg: '삭제가 완료되었습니다.',
    });
  },
  callNo() {
    this.$store.commit("alertStore/hideAlert");
  },
  textNo() {
    this.$store.commit("alertStore/hideAlert");
  },
  delNo() {
    this.$store.commit("alertStore/hideAlert");
  },
}` },
        ],
        srcInput_03: [
          {
            tab: "html",
            content:
``
          },
          { tab: "script", content:
`` },
        ],
        srcInput_04: [
          {
            tab: "html",
            content:
`<v-btn class="pl-btn" @click="showToast(TOAST_DEFAULT)">기본</v-btn>
<v-btn class="pl-btn" @click="showToast(TOAST_SUCCESS)" >sucess</v-btn>
<v-btn class="pl-btn" @click="showToast(TOAST_INFO)" >info</v-btn>
<v-btn class="pl-btn" @click="showToast(TOAST_WARNING)" >warning</v-btn>
<v-btn class="pl-btn" @click="showToast(TOAST_ALARM)" >상단 알림창</v-btn>`
          },
          { tab: "script", content:
`data () {
  return {
    TOAST_DEFAULT: {  msg: '기본 메시지입니다.', },
    TOAST_SUCCESS: {  msg: '성공 메시지입니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000},
    TOAST_INFO: {  msg: '안내 메시지입니다.', class: 'info', hasToastIcon: true, icon: 'mdi-information-outline', time: 4000 },
    TOAST_WARNING: {  msg: '경고 메시지입니다.', class: 'warning', hasToastIcon: true, icon: 'mdi-close-circle', time: 6000, close: true },
    TOAST_ALARM: {  msg: '상단 알림 3초 입니다.', class: 'info', hasToastIcon: true, icon: 'mdi-information-outline', time: 3000, type: 'top', progress: true, close: true },
  },
},` },
        ],
        srcInput_05: [
          {
            tab: "html",
            content:
``
          },
          { tab: "script", content:
`` },
        ],

      },
    }
  },
  methods: {
    onAlert(options) {
      const timeout = options.timeout || 4000;
      const timeoutDone = options.timeout || 1000;
      this.$store.commit("alertStore/showAlert", {
        msg: options.msg,
        type: options.type || 'confirm',
        callYes: options.callYes || '',
        callNo: options.callNo || '',
        iconClass: options.iconClass || 'is-info',
        isloading: options.isloading || false,
        alertDialogToggle: true,
      });
      setTimeout(() => {
        this.$store.commit("alertStore/showAlert", {
          msg: options.successMsg || '',
          type: 'confirm',
          iconClass: 'is-done',
          isloading: false,
          alertDialogToggle: true,
        });
        setTimeout(() => {
          this.$store.commit("alertStore/hideAlert");
        }, timeoutDone);
      }, timeout);
    },
    callYes() {
      this.onAlert({
        msg: '로그아웃 하시겠습니까?',
        type: 'confirm',
        callYes: this.callYes,
        callNo: this.callNo,
        iconClass: 'is-info',
        isloading: true,
        successMsg: '로그아웃이 완료되었습니다.',
      });
    },
    textYes() {
      this.onAlert({
        msg: '내용을 저장하시겠습니까?',
        type: 'confirm',
        callYes: this.textYes,
        callNo: this.textNo,
        iconClass: 'is-info',
        isloading: true,
        successMsg: '저장이 완료되었습니다.',
      });
    },
    delYes() {
      this.onAlert({
        msg: '정말 삭제하시겠습니까?',
        type: 'confirm',
        callYes: this.delYes,
        callNo: this.delNo,
        iconClass: 'is-info',
        isloading: true,
        successMsg: '삭제가 완료되었습니다.',
      });
    },
    callNo() {
      this.$store.commit("alertStore/hideAlert");
    },
    textNo() {
      this.$store.commit("alertStore/hideAlert");
    },
    delNo() {
      this.$store.commit("alertStore/hideAlert");
    },
  },
  computed: {
  },
  mounted() {
    guideJs.appendHiddenLink(this.toplink);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>