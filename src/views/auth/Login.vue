<template>
  <div class="pl-login-frame">
    <div class="pl-login-form">
      <h1 class="pl-login-form-is-logo"></h1>
      <!-- 서브 로고 -->
      <h2 class="pl-login-sublogo company-gwm" v-if="currentDomain === 'gwm.hkpalette.com'"></h2><!-- 굿웨어몰인 경우 로고 노출-->
      <div class="pl-form-inline-wrap vertical type-2 mt-12">
        <div class="pl-form-inline">
          <span class="pl-label">
            Login ID
          </span>
          <div class="pl-desc">
            <v-text-field
              ref="uid"
              name="input-10-1"
              placeholder="아이디를 입력하세요"
              class="pl-form"
              v-model="uid"
            ></v-text-field>
          </div>
        </div>
        <div class="pl-form-inline is-mt-m">
          <span class="pl-label">
            Password
          </span>
          <div class="pl-desc">
            <v-text-field
              ref="upwd"
              :append-icon="show0 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min, rules.max]"
              :type="show0 ? 'text' : 'password'"
              name="input-10-1"
              label=""
              placeholder="비밀번호를 입력하세요"
              class="pl-form"
              v-model="upwd"
              @keyup.enter="getKey"
              @click:append="show0 = !show0"
            ></v-text-field>
          </div>
        </div>
      </div>
      <div class="is-mt-m">
        <div class="pl-selection-row">
          <v-checkbox
            v-for="(chk01, index) in chkTypes"
            v-model="chk01.selected"
            :key="index"
            :label="chk01.text"
            class="pl-check "
          ></v-checkbox>
        </div>
      </div>
      <!-- <div class="pl-login-password-count">
        <strong>PASSWORD FAILED</strong>
        <div class="pl-login-password-count-bg">
          <div :class="`pl-login-password-count-bar stat-${ password_failed_count }`" ></div>
        </div>
        <p>비밀번호는 연속 5회 잘못 입력하시면 계정이 잠김 처리 됩니다.<br/>계정이 잠긴 경우 관리자에게 문의 해 주십시오.</p>
      </div> -->
      <div class="pl-btn-wrap">
        <v-btn class="pl-btn is-login" @click="getKey">로그인</v-btn>
      </div>
      <div class="pl-login-form-require">
        <strong>권장사항</strong>
        <span>
          운영체제 : Microsoft Windows 10 이상<br/>브라우저 : Google Chrome
        </span>
      </div>


      <!-- <v-btn class="pl-btn" @click="checkdialogFindPass">비밀번호 변경</v-btn> -->
      <div class="pl-login-form-copyright">
        COPYRIGHT © HANKOOK CLOUD INC. ALL RIGHTS RESERVED.<br>
        Version 3.0
      </div>
    </div>

    <!-- //mark: 비밀번호 변경 모달 -->
    <v-dialog
      v-model="dialogFindPass"
      content-class="dialog-draggable pl-top-password"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="비밀번호 변경"
        @hide="mixin_hideDialog('FindPass')"
        @submit="submitDialog('FindPass')"
      >
        <template slot="body">
          <div class="pl-form-inline-wrap vertical">
            <div class="pl-form-inline">
              <span class="pl-label">
                현재 비밀번호
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  name="PASSWORD_OLD"
                  v-model="PASSWORD_OLD"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min, rules.max]"
                  :type="show1 ? 'text' : 'password'"
                  class="pl-form"
                  placeholder="현재 비밀번호 입력"
                  @click:append="show1 = !show1"
                ></v-text-field>
              </div>
            </div>

            <div class="pl-form-inline">
              <span class="pl-label">
                변경 비밀번호
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  name="PASSWORD_NEW"
                  v-model="PASSWORD_NEW"
                  :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min, rules.max]"
                  :type="show2 ? 'text' : 'password'"
                  class="pl-form"
                  placeholder="변경할 비밀번호 입력"
                  @click:append="show2 = !show2"
                ></v-text-field>
              </div>
            </div>

            <div class="pl-form-inline">
              <span class="pl-label">
                비밀번호 재입력
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  name="PASSWORD_NEW2"
                  v-model="PASSWORD_NEW2"
                  :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min, rules.max]"
                  :type="show3 ? 'text' : 'password'"
                  class="pl-form"
                  placeholder="변경할 비밀번호 다시 입력"
                  @click:append="show3 = !show3"
                ></v-text-field>
              </div>
            </div>

          </div>
          <ul class="pl-list-dot">
            <li>비밀번호는 8~16자의 영문 대소문자, 숫자 특수문자만 가능합니다..</li>
            <li>사용 가능한 특수문자 32자<br/>: ! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ ₩ ] ^ _ ` { | } ~</li>
          </ul>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('FindPass')">닫기</v-btn>
          <v-btn class="pl-btn" @click="checkPassword">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- //mark: 메시지 모달 -->
    <v-dialog
        v-model="dialogLoginFindMessageModel"
        content-class="dialog-draggable pl-top-password"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          :header-title="dialogFindMessageTitle"
          @hide="mixin_hideDialog('LoginFindMessageModel')"
      >
        <template slot="body">
            <strong v-html="dialogFindMessage" />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('LoginFindMessageModel');">닫기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- 2차 인증 모달 -->
    <v-dialog
      v-model="dialog2cert"
      persistent
      width="460"
      >
      <compo-dialog
        header-title="로그인 2단계 인증"
        @hide="[mixin_hideDialog('2cert'), cancelCert()]"
        @submit="submitDialog('2cert')"
      >
        <template slot="body">
          <p>
            로그인 2단계 진행을 위한 인증 정보를 발송하였습니다.<br>
            수신된 2단계 인증 정보를 아래 입력란에 입력해주세요.
          </p>
<!--          <ul class="pl-list-dot">-->
<!--            <li> 로그인 2단계 진행을 위한 인증 정보를 발송하였습니다. </li>-->
<!--            <li> 수신된 2단계 인증 정보를 아래 입력란에 입력해주세요. </li>-->
<!--          </ul>-->
          <div class="pl-form-inline-wrap vertical type-auto is-mt-m">
            <div class="pl-form-inline">
              <span class="pl-label">
                인증 정보
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  value="pl-form"
                  oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '' );"
                  v-model="CERT_CODE"
                  @keyup.enter="VerificateCode"
                />
                <span class="is-txt-error ml-2">{{ cert2nd.timerStr }}</span>
                <v-btn class="pl-btn is-sub is-sm flex-grow-0" @click="sendSMS('RE')" :disabled="cert2nd.timerCounter < 121? false : true">인증 정보 재발송</v-btn>
                <p class="pl-form-hint is-txt-error">{{ ERROR_MSG }}</p>
              </div>
            </div>
          </div>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="[mixin_hideDialog('2cert'), cancelCert()]">취소</v-btn>
          <v-btn
              class="pl-btn"
              @click="VerificateCode"
              :disabled="cert2nd.timerCounter === 0 ? true : false"
          >인증하기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import store from "@/store";


const sha256 = require("sha256");
const crypto = require("crypto");
// const GibberishAES = require("crypto");

export default {
  name: "MenuLogin",
  data: () => ({
    currentDomain : '',
    uid: "",
    upwd: "",
    ENCRYPT_KEY: "",
    dialogFindPass: false, //비밀번호 변경 모달
    USER_ID: "",
    PASSWORD_OLD: "",
    PASSWORD_NEW: "",
    PASSWORD_NEW2: "",

    //2차 인증
    dialog2cert: false,
    CERT_CODE : '',

    cert2nd: {
      timer: null,
      timerCounter: 180,
      timerStr: "03:00",
    },

    // 패스워드 form
    show0: false,
    ERROR_MSG: ' ',

    // chk form
    chkTypes: [
      {
        text: "아이디 저장",
        selected: false
      },
      {
        text: "재택근무 로그인",
        selected: false
      },
    ],
    // password failed count
    password_failed_count: 1,

    // 비밀번호 변경 모달
    show1: false,
    show2: false,
    show3: false,
    rules: {
      required: value => !!value || 'Required.',
      min: v => v.length >= 8 || 'Min 8 characters',
      max: v => v.length <= 16 || 'Min 16 characters',
    },

    MESSAGE : {
      TOAST : {
        LOGIN_SUCCESS : {  msg: '로그인 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle'}
        , LOGIN_FAIL : {  msg: '로그인을 실패하였습니다.', class: 'warning', hasToastIcon: true, icon: 'mdi-close-circle' }
        , LOGOUT_SUCCESS : {  msg: '로그아웃 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle'}
        , SUCCESS_SMS : {  msg: '인증번호가 발송되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle'}
      },
    },
    dialogLoginFindMessageModel: false,
    dialogFindMessageTitle: '',
    dialogFindMessage: '',

    interval : null,
  }),

  computed: {
    ...mapState({
      stateToken: "authStore/token",
    }),
    ...mapGetters({
      getterNumber: "authStore/GE_AUTH_TOKEN",
      loginResult: "authStore/GE_AUTH_LOGIN_RESULT",
    }),
    getName() {
      return this.userId + "님";
    },
  },
  created() {
    //로그인 화면에서 재택 근무 로그인 출력 여부 - LHCS 설문에서는 출력 안함(.env.production-lhcs 에 옵션 추가함)
    const remoteWorkYn = process.env.VUE_APP_REMOTE_WORK_LOGIN_YN ? process.env.VUE_APP_REMOTE_WORK_LOGIN_YN : "Y";
    if(remoteWorkYn == 'N') {
      this.chkTypes.pop();
    }
  },
  mounted() {
    this.getCurrentDomain();

    if(process.env.VUE_APP_ENV == 'production'){
      if(window.location.href.indexOf('https')==-1){
        window.location.href = window.location.href.replace('http:', 'https:');
      }
    }
    //새로고침 라우터
    if (window.sessionStorage.getItem("token")) {
      //this.$router.push("/home");
      // if(this.$route.fullPath == "/")
      // this.$router.push("/guide");
      //this.$router.push(this.$route.fullPath);
    }

    this.init();
  },
  watch: {
    loginResult(value) {
      // 로그인 성공
      if (value !== null) {
        if( value !== 99 ) {
          if (value > 0) {
            this.showToast(this.MESSAGE.TOAST.LOGIN_SUCCESS);
            this.$router.push("/home");
          } else if (value === 0) {
            this.showToast(this.MESSAGE.TOAST.LOGIN_FAIL);
          }else {
            this.showToast(this.MESSAGE.TOAST.LOGIN_FAIL);
          }
        }
      } else {
        this.showToast(this.MESSAGE.TOAST.LOGOUT_SUCCESS);
      }
    },
  },
  methods: {
    getCurrentDomain() {
      // window.location 객체를 사용하여 현재 도메인 가져오기
      console.log(window.location);
      this.currentDomain = window.location.hostname;
      console.log('Current Domain:', this.currentDomain);
    },
    //비밀번호 변경 모달 아이디 초기 세팅
    init() {
      window.sessionStorage.clear();
      if( this.$route.query.m != undefined && this.$route.query.m != "" && this.$route.query.m != "undefined" ) {
        try {
          var findMessage = this.$route.query.m.split("↔");
          console.log( findMessage );
          this.dialogLoginFindMessageModel = true;
          this.dialogFindMessageTitle = findMessage[0];
          this.dialogFindMessage = findMessage[1].replace("\n", "<br/>");
        }catch(e){}
      }

      this.$refs.uid.focus();
      let loginCheckType = this.$cookies.get("loginCheckType");
      if( loginCheckType ) {
        if( loginCheckType[0].selected ) {
          this.chkTypes[0].selected = true;
          this.uid = this.$cookies.get("loginId")?this.$cookies.get("loginId"):"";
          if(this.uid !== "") {
            this.$refs.upwd.focus();
          }
        }
        if( loginCheckType[1].selected ) {
          this.chkTypes[1].selected = true;
        }
      }
      this.USER_ID = "";
      this.PASSWORD_OLD = "";
      this.PASSWORD_NEW = "";
      this.PASSWORD_NEW2 = "";

      this.$store.dispatch("authStore/AC_AUTH_INIT");
      this.$store.dispatch("commonStore/AC_COMMON_INIT_TAB", []); // AC_COMMON_INIT_TAB 초기화
    },
    //비밀번호 변경 모달 닫고 다시 열떄 아이디 비번 초기 세팅
    checkdialogFindPass() {
      if (this.dialogFindPass == true) {
        this.dialogFindPass = false;
        this.init();
      } else {
        this.dialogFindPass = true;
        this.init();
      }
    },
    //비밀번호 입력 체크
    checkPassword() {
      var pwNew = this.PASSWORD_NEW;
      var num = pwNew.search(/[0-9]/g);
      var eng = pwNew.search(/[a-z]/gi);
      var spe = pwNew.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
      //alert(this.USER_ID);
      if (this.PASSWORD_OLD == "" || this.PASSWORD_OLD == "undefined") {
        this.common_toast("비밀번호를 입력해주세요.", "error");
        return;
      } else if (this.PASSWORD_NEW != this.PASSWORD_NEW2) {
        this.common_toast(
          "새 비밀번호와 비밀번호 확인이 일치하지 않습니다.",
          "error"
        );
        return;
      } else if (num < 0 || eng < 0 || spe < 0) {
        this.common_toast(
          "영문,숫자, 특수문자를 혼합하여 입력해주세요.",
          "error"
        );
        return;
      } else if (pwNew.length < 8 || pwNew.length > 20) {
        this.common_toast("8자리 ~ 20자리 이내로 입력해주세요.", "error");
        return;
      } else if (pwNew.search(/\s/) != -1) {
        this.common_toast("비밀번호는 공백 없이 입력해주세요.", "error");
        return;
      } else {
        this.pwGetKey();
      }
    },

    //비밀번호 암호화 키 호출
    pwGetKey() {
      this.$api
        .post("auth-api/password-encpt/process", {
          username: this.USER_ID,
        })
        .then((response) => {
          if (this.mixin_check_repsonse(response) === true) {
            //alert("0000");
            if (response.data.DATA) {
              this.ENCRYPT_KEY = response.data.DATA[0].ENCRYPT_KEY;
              // console.log("ENCRYPT_KEY1 : ", this.ENCRYPT_KEY);
              //호출된 암호화 키로 로그인 처리
              //alert(this.user_id);

              //this.pwLogin();
              this.changePassword();
            } else {
              this.common_toast(
                "비밀번호 변경을 실패하였습니다(암호화키 에러)",
                "error"
              );
              //alert("1111");
            }
          }

          // commit("MU_USER_MENU", response.data);
        })
        .catch((error) => {
          // 에러인 경우 처리
          // console.error("menu 조회 에러", error);
          this.common_toast(
            "비밀번호 변경을 실패하였습니다(암호화키 에러)",
            "error"
          );
        });
    },
    //비밀번호 변경 처리
    changePassword() {
      // console.log("password_OLD : ", this.PASSWORD_OLD);
      // console.log("password_NEW : ", this.PASSWORD_NEW);

      const strPassWD_OLD = sha256(this.PASSWORD_OLD);
      // console.log("strPassWD_OLD : ", strPassWD_OLD);
      let encPassWD_OLD = GibberishAES.aesEncrypt(
        strPassWD_OLD,
        this.ENCRYPT_KEY
      ); //gibberish-aes.js
      // console.log("encPassWD_OLD : ", encPassWD_OLD);
      //const password_NEW = this.PASSWORD_NEW;
      const strPassWD_NEW = sha256(this.PASSWORD_NEW);
      let encPassWD_NEW = GibberishAES.aesEncrypt(
        strPassWD_NEW,
        this.ENCRYPT_KEY
      ); //gibberish-aes.js
      //alert(this.ENCRYPT_KEY);
      // console.log("strPassWD_NEW : ", strPassWD_NEW);
      // console.log("encPassWD_NEW : ", encPassWD_NEW);
      const CHK_OLD_FLAG = "Y";
      const PWD_FAIL_FREQ = "0";
      const BIZ_DIV = "CHANGEPWD";
      const PWD_STATUS = "NORMAL";
      //console.log("USER_ID : ", this.USER_ID);
      this.$api
        .post("auth-api/password/modify", {
          CHK_OLD_FLAG: CHK_OLD_FLAG,
          USER_ID: this.USER_ID,
          PWD: this.PASSWORD_OLD,
          PASSWORD_OLD: encPassWD_OLD,
          PASSWORD_NEW: encPassWD_NEW,
          PWD_FAIL_FREQ: PWD_FAIL_FREQ,
          BIZ_DIV: BIZ_DIV,
          PROC_ID: this.USER_ID,
          PWD_STATUS: PWD_STATUS,
          ENCRYPT_KEY: this.ENCRYPT_KEY,
        })
        .then((response) => {
          if (response.data.HEADER.ERROR_FLAG == true) {
            this.common_toast(
              "아이디 또는 비밀번호가 일치하지 않습니다.",
              "error"
            );
            return;
          } else {
            this.common_toast("정상적으로 수정되었습니다.");
            this.dialogFindPass = false;
          }
          // console.log(response.data);
          // console.log(response.data.DATA);
        })
        .catch((error) => {
          // 에러인 경우 처리
          this.common_toast("비밀번호 변경 에러.", "error");
          console.error("비밀번호 변경 에러", error);
        });
    },

    //암호화 키 호출
    async getKey() {
      //멀티테넌시(multitenancy) 처리 : 로그인 전 로그인 ID로 테넌트 정보 조회 by hjh
      const isGetTenantKey = await this.getCertCustcoTenantId();
      if(isGetTenantKey) {

        this.$api
          .post("auth-api/password-encpt/process", {
            username: this.uid,
          })
          .then((response) => {
            if (this.mixin_check_repsonse(response) === true) {
              if (response.data.DATA) {
                this.ENCRYPT_KEY = response.data.DATA[0].ENCRYPT_KEY;

                //호출된 암호화 키로 로그인 처리
                this.login();
              } else {
                this.common_toast(
                  "로그인을 실패하였습니다(암호화키 에러)",
                  "error"
                );
              }
            }

            // commit("MU_USER_MENU", response.data);
          })
          .catch((error) => {
            // 에러인 경우 처리
            // console.error("menu 조회 에러", error);
            this.common_toast("로그인을 실패하였습니다(암호화키 에러)", "error");
          });
      } else {
        this.showToast(this.MESSAGE.TOAST.LOGIN_FAIL);
      }
    },

    //비밀번호 변경전 임시 로그인 처리
    pwLogin() {
      //alert(this.PASSWORD_OLD);
      //alert(this.USER_ID);
      const password = this.PASSWORD_OLD;
      const strPassWD = sha256(password);
      // console.log("strPassWD1111  :", strPassWD);
      let encPassWD = GibberishAES.aesEncrypt(strPassWD, this.ENCRYPT_KEY); //gibberish-aes.js

      //임시 테스트 데이터
      let set_data = {
        code: 0,
        data: data,
      };

      let response_data;

      this.$api
        .post("auth-api/login", {
          username: this.USER_ID,
          userpassword: encPassWD,
        })
        .then((response) => {
          set_data.code = 1;
          set_data.data = response.data.DATA[0];
          this.changePassword();
          response_data = response;
        })
        .catch((error) => {
          // 에러인 경우 처리
          set_data.code = 0;
          // console.log("에러에러에러");
        });
    },

    //로그인 처리
    login() {
      const password = this.upwd;
      const strPassWD = sha256(password);
      let encPassWD = GibberishAES.aesEncrypt(strPassWD, this.ENCRYPT_KEY); //gibberish-aes.js

      this.$store
        .dispatch("authStore/AC_AUTH_LOGIN", {
          username: this.uid,
          userpassword: encPassWD,
        })
        .then((response) => {
          if (this.mixin_check_repsonse(response) === true) {
            // setTimeout(() => {

              this.$cookies.set("loginCheckType", this.chkTypes);
              if(this.chkTypes[0].selected){
                this.$cookies.set("loginId", this.uid);
              }else {
                this.$cookies.remove("loginId");
              }
              //사용자 정보 셋팅
            if(response.data.DATA[0].USER_LGN_SMS_CERT_YN =='Y'){
              this.dialog2cert = true;
              this.sendSMS('')
            }else{
              this.setUserDedail();
            }

            // }, 200);
          }
          this.mixin_loadOgnzList()
        });
    },
    //사용자 정보 셋팅
    setUserDedail() {
      let getData = this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"];
      this.$store
        .dispatch("userStore/AC_USER_DETAIL", {
          data: getData,
        })
        .then((response) => {
          //버튼 권한 조회
          // this.mixin_common_button_auth("20210405154851920KC00302");
          //사용자 회사정보 조회
          this.getCompany();

          //사용자 메뉴권한 조회
          this.getMenu();

          // console.log("this.chkTypes.selected", this.chkTypes[1].selected);
          let mobile = 'N'
          if(this.chkTypes[1].selected === true){
            mobile = 'Y'
          } else {
            mobile = 'N'
          }
          this.$store.dispatch("userStore/AC_MOBIE_YN", mobile);

          this.$store.dispatch("statusStore/AC_CUTT_ING", false);
          this.$store.dispatch("statusStore/AC_CUST_MODIFY_ING", false);
          this.$store.dispatch("statusStore/AC_CTI_STAT", false);
          this.$store.dispatch("userConfigStore/AC_SAVE_AFTR_CUST_MAINTAIN", false);
          this.$store.dispatch("userStore/AC_USER_SHORTCUT", {user_id: this.$store.getters['userStore/GE_USER_ROLE'].userId});

        });
    },

    //사용자 회사 정보 조회
    getCompany() {

      this.$store
        .dispatch("userStore/AC_USER_COMPANY_LIST", {
          user_id: this.$store.getters['userStore/GE_USER_ROLE'].userId
          , lgn_id: this.uid
        })
        .then((response) => {
          //사용자 상세정보 조회
          //조회시 asp_cust_key가 필요하기 때문에 company 조회 후 호출
          // this.getUserDedail();
          //로그인 시 추가하여 Home.vue에서 조회 가능하도록 함. by hjh.
          this.$store.dispatch("userStore/AC_USER_COMPANY", this.$store.getters["userStore/GE_USER_COMPANY_LIST"][0])
        });
    },
    //회사 채널 정보 조회
    getChannel() {
      let get_user_role = this.$store.getters["userStore/GE_USER_ROLE"];
      for (var i = 0; i < get_user_role.length; i++) {
        get_user_role.company[i];
      }
      // this.$store
      //   .dispatch("userStore/AC_USER_CHANNEL", {
      //     companyid: "3test3",
      //   })
      //   .then((response) => {
      //   });
    },
    //사용자 메뉴 정보 조회
    getMenu() {
      this.$store
        .dispatch("userStore/AC_USER_MENU", {
          user_id: this.$store.getters['userStore/GE_USER_ROLE'].userId
        })
        .then((response) => {
          //사용자 회사정보 조회
          // this.getChannel();
        });
    },

    //멀티테넌시(multitenancy) 처리 : 로그인 전 로그인 ID로 TENANT_ID(테넌트) 정보 조회 by hjh
    async getCertCustcoTenantId() {
      //기존 store 값 초기화.
      this.$store.commit("authStore/MU_CUSTCO_TENANT_ID", { custco_tenant_id: '' });
      //console.log("로그인 전 로그인 ID로 TENANT_ID(테넌트) 정보 조회")
      let URLData = '/admin-api/custco/cert-custco-manage/tenant';
      let postParam = {
        LGN_ID: this.uid,
      }

      let headParam = {

      }

      let response = await this.common_postCall(URLData, postParam, headParam);
      if(response.HEADER.ERROR_FLAG) {
        return false;
      }
      if (response.HEADER.COUNT == 1) {
        this.$store.commit("authStore/MU_CUSTCO_TENANT_ID", {
          custco_tenant_id: response.DATA[0].SCHEMA_ID,
          cert_custco_id: response.DATA[0].CERT_CUSTCO_ID
        });
        return true;
      } else {
        return false;
      }
    },

    // 인증번호 발송
    async sendSMS(FLAG){
      this.startTimer();
      this.ERROR_MSG = '';

      let sURL = "/auth-api/secondaryCert/publishNo"

      let postParam = {
        LGN_ID : this.uid,
        RE_CERT_YN : FLAG == 'RE' ? "Y" : "N",
        TENANT_ID : this.$store.getters['authStore/GE_CUSTCO_TENANT_ID']
      }
      let headParam = {
        head: {}
      }

      let response = await this.common_postCall(sURL, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG){
        this.showToast(this.MESSAGE.TOAST.SUCCESS_SMS);
      }else{
        this.ERROR_MSG = response.HEADER.ERROR_MSG
      }

    },
    async VerificateCode(){
      let sURL =  "/auth-api/secondaryCert/VerificateCode";
      let postParams = {
        CERT_CODE : this.CERT_CODE,
        USER_ID : this.$store.getters['authStore/GE_AUTH_LOGIN_TEMP_DATA'].USER_ID
      };
      let headParams={
        head:{},
      }

      let response = await this.common_postCall(sURL, postParams, headParams);
      if(!response.HEADER.ERROR_FLAG){
        try{
          let tempData = this.$store.getters['authStore/GE_AUTH_LOGIN_TEMP_DATA'];

          this.$store.dispatch("authStore/AC_AUTH_LOGIN_SMS_CERT", {tempData})
          this.setUserDedail();


        }catch (e){
          console.log(e)
        }

      }else{
        this.ERROR_MSG = response.HEADER.ERROR_MSG;
      }

    },

    // 인증번호 발송 타이머 시작
    startTimer(){
        this.cert2nd.timerCounter = 180;
        this.interval = setInterval(()=>{
          this.cert2nd.timerCounter --;
          this.cert2nd.timerStr = this.prettyTime();
          if(this.cert2nd.timerCounter === 0){
            this.ERROR_MSG = '인증 시간을 초과하였습니다';
            this.stopTimer(this.interval);

          }
        }, 1000);
    },

    // 타이머 종료
    stopTimer(timer){
      clearInterval(timer);
      this.cert2nd.timerCounter = 0;
    },

    // 초 => 분 변환
    prettyTime(){
      let minutes = Math.floor(parseInt(this.cert2nd.timerCounter) / 60 );
      let seconds = parseInt(this.cert2nd.timerCounter) % 60;
      return (
          minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0")
      );
    },
    cancelCert(){
      this.stopTimer(this.interval);
      let data = this.$store.getters['authStore/GE_AUTH_LOGIN_TEMP_DATA'];
      this.$store.dispatch('authStore/AC_AUTH_LOGOUT', { data })
    }

  },
  beforeDestroy() {
    this.stopTimer(this.interval);
  }
};

//암호화 모듈
let GibberishAES = (function () {
  var Nr = 14,
    /* Default to 256 Bit Encryption */
    Nk = 8,
    Decrypt = false,
    enc_utf8 = function (s) {
      try {
        return unescape(encodeURIComponent(s));
      } catch (e) {
        throw "Error on UTF-8 encode";
      }
    },
    dec_utf8 = function (s) {
      try {
        return decodeURIComponent(escape(s));
      } catch (e) {
        throw "Bad Key";
      }
    },
    padBlock = function (byteArr) {
      var array = [],
        cpad,
        i;
      if (byteArr.length < 16) {
        cpad = 16 - byteArr.length;
        array = [
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
        ];
      }
      for (i = 0; i < byteArr.length; i++) {
        array[i] = byteArr[i];
      }
      return array;
    },
    block2s = function (block, lastBlock) {
      var string = "",
        padding,
        i;
      if (lastBlock) {
        padding = block[15];
        if (padding > 16) {
          throw "Decryption error: Maybe bad key";
        }
        if (padding == 16) {
          return "";
        }
        for (i = 0; i < 16 - padding; i++) {
          string += String.fromCharCode(block[i]);
        }
      } else {
        for (i = 0; i < 16; i++) {
          string += String.fromCharCode(block[i]);
        }
      }
      return string;
    },
    a2h = function (numArr) {
      var string = "",
        i;
      for (i = 0; i < numArr.length; i++) {
        string += (numArr[i] < 16 ? "0" : "") + numArr[i].toString(16);
      }
      return string;
    },
    h2a = function (s) {
      var ret = [];
      s.replace(/(..)/g, function (s) {
        ret.push(parseInt(s, 16));
      });
      return ret;
    },
    s2a = function (string, binary) {
      var array = [],
        i;

      if (!binary) {
        string = enc_utf8(string);
      }

      for (i = 0; i < string.length; i++) {
        array[i] = string.charCodeAt(i);
      }

      return array;
    },
    size = function (newsize) {
      switch (newsize) {
        case 128:
          Nr = 10;
          Nk = 4;
          break;
        case 192:
          Nr = 12;
          Nk = 6;
          break;
        case 256:
          Nr = 14;
          Nk = 8;
          break;
        default:
          throw "Invalid Key Size Specified:" + newsize;
      }
    },
    randArr = function (num) {
      var result = [],
        i;
      for (i = 0; i < num; i++) {
        result = result.concat(Math.floor(Math.random() * 256));
      }
      return result;
    },
    openSSLKey = function (passwordArr, saltArr) {
      // Number of rounds depends on the size of the AES in use
      // 3 rounds for 256
      //        2 rounds for the key, 1 for the IV
      // 2 rounds for 128
      //        1 round for the key, 1 round for the IV
      // 3 rounds for 192 since it's not evenly divided by 128 bits
      var rounds = Nr >= 12 ? 3 : 2,
        key = [],
        iv = [],
        md5_hash = [],
        result = [],
        data00 = passwordArr.concat(saltArr),
        i;
      md5_hash[0] = GibberishAES.Hash.MD5(data00);
      result = md5_hash[0];
      for (i = 1; i < rounds; i++) {
        md5_hash[i] = GibberishAES.Hash.MD5(md5_hash[i - 1].concat(data00));
        result = result.concat(md5_hash[i]);
      }
      key = result.slice(0, 4 * Nk);
      iv = result.slice(4 * Nk, 4 * Nk + 16);
      return {
        key: key,
        iv: iv,
      };
    },
    rawEncrypt = function (plaintext, key) {
      plaintext = GibberishAES.s2a(plaintext);
      var iv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      // plaintext, key and iv as byte arrays
      key = expandKey(GibberishAES.s2a(key));
      var numBlocks = Math.ceil(plaintext.length / 16),
        blocks = [],
        i,
        cipherBlocks = [];
      for (i = 0; i < numBlocks; i++) {
        blocks[i] = padBlock(plaintext.slice(i * 16, i * 16 + 16));
      }
      if (plaintext.length % 16 === 0) {
        blocks.push([
          16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
        ]);
        // CBC OpenSSL padding scheme
        numBlocks++;
      }
      for (i = 0; i < blocks.length; i++) {
        blocks[i] =
          i === 0
            ? xorBlocks(blocks[i], iv)
            : xorBlocks(blocks[i], cipherBlocks[i - 1]);
        cipherBlocks[i] = encryptBlock(blocks[i], key);
      }
      return GibberishAES.Base64.encode(cipherBlocks);
    },
    rawDecrypt = function (cryptArr, key) {
      var iv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      //  cryptArr, key and iv as byte arrays
      key = expandKey(GibberishAES.s2a(key));
      var numBlocks = cryptArr.length / 16,
        cipherBlocks = [],
        i,
        plainBlocks = [],
        string = "";
      for (i = 0; i < numBlocks; i++) {
        cipherBlocks.push(cryptArr.slice(i * 16, (i + 1) * 16));
      }
      for (i = cipherBlocks.length - 1; i >= 0; i--) {
        plainBlocks[i] = decryptBlock(cipherBlocks[i], key);
        plainBlocks[i] =
          i === 0
            ? xorBlocks(plainBlocks[i], iv)
            : xorBlocks(plainBlocks[i], cipherBlocks[i - 1]);
      }
      for (i = 0; i < numBlocks - 1; i++) {
        string += block2s(plainBlocks[i]);
      }
      string += block2s(plainBlocks[i], true);

      return dec_utf8(string);
      //return binary ? string : dec_utf8(string);
    },
    aesEncrypt = function (plaintext, key) {
      var rtnVal = "";
      plaintext = GibberishAES.s2a(plaintext);
      var iv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      // plaintext, key and iv as byte arrays
      key = expandKey(GibberishAES.s2a(key));
      var numBlocks = Math.ceil(plaintext.length / 16),
        blocks = [],
        i,
        cipherBlocks = [];
      for (i = 0; i < numBlocks; i++) {
        blocks[i] = padBlock(plaintext.slice(i * 16, i * 16 + 16));
      }
      if (plaintext.length % 16 === 0) {
        blocks.push([
          16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
        ]);
        // CBC OpenSSL padding scheme
        numBlocks++;
      }
      for (i = 0; i < blocks.length; i++) {
        blocks[i] =
          i === 0
            ? xorBlocks(blocks[i], iv)
            : xorBlocks(blocks[i], cipherBlocks[i - 1]);
        cipherBlocks[i] = encryptBlock(blocks[i], key);
      }
      rtnVal = GibberishAES.Base64.encode(cipherBlocks);

      return rtnVal.toString().replace("\n", "");
    },
    aesDecrypt = function (base64Text, key) {
      var cryptArr = GibberishAES.Base64.decode(base64Text);
      var iv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      //  cryptArr, key and iv as byte arrays
      key = expandKey(GibberishAES.s2a(key));
      var numBlocks = cryptArr.length / 16,
        cipherBlocks = [],
        i,
        plainBlocks = [],
        string = "";
      for (i = 0; i < numBlocks; i++) {
        cipherBlocks.push(cryptArr.slice(i * 16, (i + 1) * 16));
      }
      for (i = cipherBlocks.length - 1; i >= 0; i--) {
        plainBlocks[i] = decryptBlock(cipherBlocks[i], key);
        plainBlocks[i] =
          i === 0
            ? xorBlocks(plainBlocks[i], iv)
            : xorBlocks(plainBlocks[i], cipherBlocks[i - 1]);
      }
      for (i = 0; i < numBlocks - 1; i++) {
        string += block2s(plainBlocks[i]);
      }
      string += block2s(plainBlocks[i], true);

      return dec_utf8(string);
      //return binary ? string : dec_utf8(string);
    },
    encryptBlock = function (block, words) {
      Decrypt = false;
      var state = addRoundKey(block, words, 0),
        round;
      for (round = 1; round < Nr + 1; round++) {
        state = subBytes(state);
        state = shiftRows(state);
        if (round < Nr) {
          state = mixColumns(state);
        }
        //last round? don't mixColumns
        state = addRoundKey(state, words, round);
      }

      return state;
    },
    decryptBlock = function (block, words) {
      Decrypt = true;
      var state = addRoundKey(block, words, Nr),
        round;
      for (round = Nr - 1; round > -1; round--) {
        state = shiftRows(state);
        state = subBytes(state);
        state = addRoundKey(state, words, round);
        if (round > 0) {
          state = mixColumns(state);
        }
        //last round? don't mixColumns
      }

      return state;
    },
    subBytes = function (state) {
      var S = Decrypt ? SBoxInv : SBox,
        temp = [],
        i;
      for (i = 0; i < 16; i++) {
        temp[i] = S[state[i]];
      }
      return temp;
    },
    shiftRows = function (state) {
      var temp = [],
        shiftBy = Decrypt
          ? [0, 13, 10, 7, 4, 1, 14, 11, 8, 5, 2, 15, 12, 9, 6, 3]
          : [0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 1, 6, 11],
        i;
      for (i = 0; i < 16; i++) {
        temp[i] = state[shiftBy[i]];
      }
      return temp;
    },
    mixColumns = function (state) {
      var t = [],
        c;
      if (!Decrypt) {
        for (c = 0; c < 4; c++) {
          t[c * 4] =
            G2X[state[c * 4]] ^
            G3X[state[1 + c * 4]] ^
            state[2 + c * 4] ^
            state[3 + c * 4];
          t[1 + c * 4] =
            state[c * 4] ^
            G2X[state[1 + c * 4]] ^
            G3X[state[2 + c * 4]] ^
            state[3 + c * 4];
          t[2 + c * 4] =
            state[c * 4] ^
            state[1 + c * 4] ^
            G2X[state[2 + c * 4]] ^
            G3X[state[3 + c * 4]];
          t[3 + c * 4] =
            G3X[state[c * 4]] ^
            state[1 + c * 4] ^
            state[2 + c * 4] ^
            G2X[state[3 + c * 4]];
        }
      } else {
        for (c = 0; c < 4; c++) {
          t[c * 4] =
            GEX[state[c * 4]] ^
            GBX[state[1 + c * 4]] ^
            GDX[state[2 + c * 4]] ^
            G9X[state[3 + c * 4]];
          t[1 + c * 4] =
            G9X[state[c * 4]] ^
            GEX[state[1 + c * 4]] ^
            GBX[state[2 + c * 4]] ^
            GDX[state[3 + c * 4]];
          t[2 + c * 4] =
            GDX[state[c * 4]] ^
            G9X[state[1 + c * 4]] ^
            GEX[state[2 + c * 4]] ^
            GBX[state[3 + c * 4]];
          t[3 + c * 4] =
            GBX[state[c * 4]] ^
            GDX[state[1 + c * 4]] ^
            G9X[state[2 + c * 4]] ^
            GEX[state[3 + c * 4]];
        }
      }

      return t;
    },
    addRoundKey = function (state, words, round) {
      var temp = [],
        i;
      for (i = 0; i < 16; i++) {
        temp[i] = state[i] ^ words[round][i];
      }
      return temp;
    },
    xorBlocks = function (block1, block2) {
      var temp = [],
        i;
      for (i = 0; i < 16; i++) {
        temp[i] = block1[i] ^ block2[i];
      }
      return temp;
    },
    expandKey = function (key) {
      // Expects a 1d number array
      var w = [],
        temp = [],
        i,
        r,
        t,
        flat = [],
        j;

      for (i = 0; i < Nk; i++) {
        r = [key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]];
        w[i] = r;
      }

      for (i = Nk; i < 4 * (Nr + 1); i++) {
        w[i] = [];
        for (t = 0; t < 4; t++) {
          temp[t] = w[i - 1][t];
        }
        if (i % Nk === 0) {
          temp = subWord(rotWord(temp));
          temp[0] ^= Rcon[i / Nk - 1];
        } else if (Nk > 6 && i % Nk == 4) {
          temp = subWord(temp);
        }
        for (t = 0; t < 4; t++) {
          w[i][t] = w[i - Nk][t] ^ temp[t];
        }
      }
      for (i = 0; i < Nr + 1; i++) {
        flat[i] = [];
        for (j = 0; j < 4; j++) {
          flat[i].push(
            w[i * 4 + j][0],
            w[i * 4 + j][1],
            w[i * 4 + j][2],
            w[i * 4 + j][3]
          );
        }
      }
      return flat;
    },
    subWord = function (w) {
      // apply SBox to 4-byte word w
      for (var i = 0; i < 4; i++) {
        w[i] = SBox[w[i]];
      }
      return w;
    },
    rotWord = function (w) {
      // rotate 4-byte word w left by one byte
      var tmp = w[0],
        i;
      for (i = 0; i < 4; i++) {
        w[i] = w[i + 1];
      }
      w[3] = tmp;
      return w;
    },
    // S-box
    SBox = [
      99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118,
      202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114,
      192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49,
      21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117,
      9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83,
      209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208,
      239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81,
      163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210,
      205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115,
      96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219,
      224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121,
      231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8,
      186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138,
      112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158,
      225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40,
      223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187,
      22,
    ],
    // Precomputed lookup table for the inverse SBox
    SBoxInv = [
      82, 9, 106, 213, 48, 54, 165, 56, 191, 64, 163, 158, 129, 243, 215, 251,
      124, 227, 57, 130, 155, 47, 255, 135, 52, 142, 67, 68, 196, 222, 233, 203,
      84, 123, 148, 50, 166, 194, 35, 61, 238, 76, 149, 11, 66, 250, 195, 78, 8,
      46, 161, 102, 40, 217, 36, 178, 118, 91, 162, 73, 109, 139, 209, 37, 114,
      248, 246, 100, 134, 104, 152, 22, 212, 164, 92, 204, 93, 101, 182, 146,
      108, 112, 72, 80, 253, 237, 185, 218, 94, 21, 70, 87, 167, 141, 157, 132,
      144, 216, 171, 0, 140, 188, 211, 10, 247, 228, 88, 5, 184, 179, 69, 6,
      208, 44, 30, 143, 202, 63, 15, 2, 193, 175, 189, 3, 1, 19, 138, 107, 58,
      145, 17, 65, 79, 103, 220, 234, 151, 242, 207, 206, 240, 180, 230, 115,
      150, 172, 116, 34, 231, 173, 53, 133, 226, 249, 55, 232, 28, 117, 223,
      110, 71, 241, 26, 113, 29, 41, 197, 137, 111, 183, 98, 14, 170, 24, 190,
      27, 252, 86, 62, 75, 198, 210, 121, 32, 154, 219, 192, 254, 120, 205, 90,
      244, 31, 221, 168, 51, 136, 7, 199, 49, 177, 18, 16, 89, 39, 128, 236, 95,
      96, 81, 127, 169, 25, 181, 74, 13, 45, 229, 122, 159, 147, 201, 156, 239,
      160, 224, 59, 77, 174, 42, 245, 176, 200, 235, 187, 60, 131, 83, 153, 97,
      23, 43, 4, 126, 186, 119, 214, 38, 225, 105, 20, 99, 85, 33, 12, 125,
    ],
    // Rijndael Rcon
    Rcon = [
      1, 2, 4, 8, 16, 32, 64, 128, 27, 54, 108, 216, 171, 77, 154, 47, 94, 188,
      99, 198, 151, 53, 106, 212, 179, 125, 250, 239, 197, 145,
    ],
    G2X = [
      0x00, 0x02, 0x04, 0x06, 0x08, 0x0a, 0x0c, 0x0e, 0x10, 0x12, 0x14, 0x16,
      0x18, 0x1a, 0x1c, 0x1e, 0x20, 0x22, 0x24, 0x26, 0x28, 0x2a, 0x2c, 0x2e,
      0x30, 0x32, 0x34, 0x36, 0x38, 0x3a, 0x3c, 0x3e, 0x40, 0x42, 0x44, 0x46,
      0x48, 0x4a, 0x4c, 0x4e, 0x50, 0x52, 0x54, 0x56, 0x58, 0x5a, 0x5c, 0x5e,
      0x60, 0x62, 0x64, 0x66, 0x68, 0x6a, 0x6c, 0x6e, 0x70, 0x72, 0x74, 0x76,
      0x78, 0x7a, 0x7c, 0x7e, 0x80, 0x82, 0x84, 0x86, 0x88, 0x8a, 0x8c, 0x8e,
      0x90, 0x92, 0x94, 0x96, 0x98, 0x9a, 0x9c, 0x9e, 0xa0, 0xa2, 0xa4, 0xa6,
      0xa8, 0xaa, 0xac, 0xae, 0xb0, 0xb2, 0xb4, 0xb6, 0xb8, 0xba, 0xbc, 0xbe,
      0xc0, 0xc2, 0xc4, 0xc6, 0xc8, 0xca, 0xcc, 0xce, 0xd0, 0xd2, 0xd4, 0xd6,
      0xd8, 0xda, 0xdc, 0xde, 0xe0, 0xe2, 0xe4, 0xe6, 0xe8, 0xea, 0xec, 0xee,
      0xf0, 0xf2, 0xf4, 0xf6, 0xf8, 0xfa, 0xfc, 0xfe, 0x1b, 0x19, 0x1f, 0x1d,
      0x13, 0x11, 0x17, 0x15, 0x0b, 0x09, 0x0f, 0x0d, 0x03, 0x01, 0x07, 0x05,
      0x3b, 0x39, 0x3f, 0x3d, 0x33, 0x31, 0x37, 0x35, 0x2b, 0x29, 0x2f, 0x2d,
      0x23, 0x21, 0x27, 0x25, 0x5b, 0x59, 0x5f, 0x5d, 0x53, 0x51, 0x57, 0x55,
      0x4b, 0x49, 0x4f, 0x4d, 0x43, 0x41, 0x47, 0x45, 0x7b, 0x79, 0x7f, 0x7d,
      0x73, 0x71, 0x77, 0x75, 0x6b, 0x69, 0x6f, 0x6d, 0x63, 0x61, 0x67, 0x65,
      0x9b, 0x99, 0x9f, 0x9d, 0x93, 0x91, 0x97, 0x95, 0x8b, 0x89, 0x8f, 0x8d,
      0x83, 0x81, 0x87, 0x85, 0xbb, 0xb9, 0xbf, 0xbd, 0xb3, 0xb1, 0xb7, 0xb5,
      0xab, 0xa9, 0xaf, 0xad, 0xa3, 0xa1, 0xa7, 0xa5, 0xdb, 0xd9, 0xdf, 0xdd,
      0xd3, 0xd1, 0xd7, 0xd5, 0xcb, 0xc9, 0xcf, 0xcd, 0xc3, 0xc1, 0xc7, 0xc5,
      0xfb, 0xf9, 0xff, 0xfd, 0xf3, 0xf1, 0xf7, 0xf5, 0xeb, 0xe9, 0xef, 0xed,
      0xe3, 0xe1, 0xe7, 0xe5,
    ],
    G3X = [
      0x00, 0x03, 0x06, 0x05, 0x0c, 0x0f, 0x0a, 0x09, 0x18, 0x1b, 0x1e, 0x1d,
      0x14, 0x17, 0x12, 0x11, 0x30, 0x33, 0x36, 0x35, 0x3c, 0x3f, 0x3a, 0x39,
      0x28, 0x2b, 0x2e, 0x2d, 0x24, 0x27, 0x22, 0x21, 0x60, 0x63, 0x66, 0x65,
      0x6c, 0x6f, 0x6a, 0x69, 0x78, 0x7b, 0x7e, 0x7d, 0x74, 0x77, 0x72, 0x71,
      0x50, 0x53, 0x56, 0x55, 0x5c, 0x5f, 0x5a, 0x59, 0x48, 0x4b, 0x4e, 0x4d,
      0x44, 0x47, 0x42, 0x41, 0xc0, 0xc3, 0xc6, 0xc5, 0xcc, 0xcf, 0xca, 0xc9,
      0xd8, 0xdb, 0xde, 0xdd, 0xd4, 0xd7, 0xd2, 0xd1, 0xf0, 0xf3, 0xf6, 0xf5,
      0xfc, 0xff, 0xfa, 0xf9, 0xe8, 0xeb, 0xee, 0xed, 0xe4, 0xe7, 0xe2, 0xe1,
      0xa0, 0xa3, 0xa6, 0xa5, 0xac, 0xaf, 0xaa, 0xa9, 0xb8, 0xbb, 0xbe, 0xbd,
      0xb4, 0xb7, 0xb2, 0xb1, 0x90, 0x93, 0x96, 0x95, 0x9c, 0x9f, 0x9a, 0x99,
      0x88, 0x8b, 0x8e, 0x8d, 0x84, 0x87, 0x82, 0x81, 0x9b, 0x98, 0x9d, 0x9e,
      0x97, 0x94, 0x91, 0x92, 0x83, 0x80, 0x85, 0x86, 0x8f, 0x8c, 0x89, 0x8a,
      0xab, 0xa8, 0xad, 0xae, 0xa7, 0xa4, 0xa1, 0xa2, 0xb3, 0xb0, 0xb5, 0xb6,
      0xbf, 0xbc, 0xb9, 0xba, 0xfb, 0xf8, 0xfd, 0xfe, 0xf7, 0xf4, 0xf1, 0xf2,
      0xe3, 0xe0, 0xe5, 0xe6, 0xef, 0xec, 0xe9, 0xea, 0xcb, 0xc8, 0xcd, 0xce,
      0xc7, 0xc4, 0xc1, 0xc2, 0xd3, 0xd0, 0xd5, 0xd6, 0xdf, 0xdc, 0xd9, 0xda,
      0x5b, 0x58, 0x5d, 0x5e, 0x57, 0x54, 0x51, 0x52, 0x43, 0x40, 0x45, 0x46,
      0x4f, 0x4c, 0x49, 0x4a, 0x6b, 0x68, 0x6d, 0x6e, 0x67, 0x64, 0x61, 0x62,
      0x73, 0x70, 0x75, 0x76, 0x7f, 0x7c, 0x79, 0x7a, 0x3b, 0x38, 0x3d, 0x3e,
      0x37, 0x34, 0x31, 0x32, 0x23, 0x20, 0x25, 0x26, 0x2f, 0x2c, 0x29, 0x2a,
      0x0b, 0x08, 0x0d, 0x0e, 0x07, 0x04, 0x01, 0x02, 0x13, 0x10, 0x15, 0x16,
      0x1f, 0x1c, 0x19, 0x1a,
    ],
    G9X = [
      0x00, 0x09, 0x12, 0x1b, 0x24, 0x2d, 0x36, 0x3f, 0x48, 0x41, 0x5a, 0x53,
      0x6c, 0x65, 0x7e, 0x77, 0x90, 0x99, 0x82, 0x8b, 0xb4, 0xbd, 0xa6, 0xaf,
      0xd8, 0xd1, 0xca, 0xc3, 0xfc, 0xf5, 0xee, 0xe7, 0x3b, 0x32, 0x29, 0x20,
      0x1f, 0x16, 0x0d, 0x04, 0x73, 0x7a, 0x61, 0x68, 0x57, 0x5e, 0x45, 0x4c,
      0xab, 0xa2, 0xb9, 0xb0, 0x8f, 0x86, 0x9d, 0x94, 0xe3, 0xea, 0xf1, 0xf8,
      0xc7, 0xce, 0xd5, 0xdc, 0x76, 0x7f, 0x64, 0x6d, 0x52, 0x5b, 0x40, 0x49,
      0x3e, 0x37, 0x2c, 0x25, 0x1a, 0x13, 0x08, 0x01, 0xe6, 0xef, 0xf4, 0xfd,
      0xc2, 0xcb, 0xd0, 0xd9, 0xae, 0xa7, 0xbc, 0xb5, 0x8a, 0x83, 0x98, 0x91,
      0x4d, 0x44, 0x5f, 0x56, 0x69, 0x60, 0x7b, 0x72, 0x05, 0x0c, 0x17, 0x1e,
      0x21, 0x28, 0x33, 0x3a, 0xdd, 0xd4, 0xcf, 0xc6, 0xf9, 0xf0, 0xeb, 0xe2,
      0x95, 0x9c, 0x87, 0x8e, 0xb1, 0xb8, 0xa3, 0xaa, 0xec, 0xe5, 0xfe, 0xf7,
      0xc8, 0xc1, 0xda, 0xd3, 0xa4, 0xad, 0xb6, 0xbf, 0x80, 0x89, 0x92, 0x9b,
      0x7c, 0x75, 0x6e, 0x67, 0x58, 0x51, 0x4a, 0x43, 0x34, 0x3d, 0x26, 0x2f,
      0x10, 0x19, 0x02, 0x0b, 0xd7, 0xde, 0xc5, 0xcc, 0xf3, 0xfa, 0xe1, 0xe8,
      0x9f, 0x96, 0x8d, 0x84, 0xbb, 0xb2, 0xa9, 0xa0, 0x47, 0x4e, 0x55, 0x5c,
      0x63, 0x6a, 0x71, 0x78, 0x0f, 0x06, 0x1d, 0x14, 0x2b, 0x22, 0x39, 0x30,
      0x9a, 0x93, 0x88, 0x81, 0xbe, 0xb7, 0xac, 0xa5, 0xd2, 0xdb, 0xc0, 0xc9,
      0xf6, 0xff, 0xe4, 0xed, 0x0a, 0x03, 0x18, 0x11, 0x2e, 0x27, 0x3c, 0x35,
      0x42, 0x4b, 0x50, 0x59, 0x66, 0x6f, 0x74, 0x7d, 0xa1, 0xa8, 0xb3, 0xba,
      0x85, 0x8c, 0x97, 0x9e, 0xe9, 0xe0, 0xfb, 0xf2, 0xcd, 0xc4, 0xdf, 0xd6,
      0x31, 0x38, 0x23, 0x2a, 0x15, 0x1c, 0x07, 0x0e, 0x79, 0x70, 0x6b, 0x62,
      0x5d, 0x54, 0x4f, 0x46,
    ],
    GBX = [
      0x00, 0x0b, 0x16, 0x1d, 0x2c, 0x27, 0x3a, 0x31, 0x58, 0x53, 0x4e, 0x45,
      0x74, 0x7f, 0x62, 0x69, 0xb0, 0xbb, 0xa6, 0xad, 0x9c, 0x97, 0x8a, 0x81,
      0xe8, 0xe3, 0xfe, 0xf5, 0xc4, 0xcf, 0xd2, 0xd9, 0x7b, 0x70, 0x6d, 0x66,
      0x57, 0x5c, 0x41, 0x4a, 0x23, 0x28, 0x35, 0x3e, 0x0f, 0x04, 0x19, 0x12,
      0xcb, 0xc0, 0xdd, 0xd6, 0xe7, 0xec, 0xf1, 0xfa, 0x93, 0x98, 0x85, 0x8e,
      0xbf, 0xb4, 0xa9, 0xa2, 0xf6, 0xfd, 0xe0, 0xeb, 0xda, 0xd1, 0xcc, 0xc7,
      0xae, 0xa5, 0xb8, 0xb3, 0x82, 0x89, 0x94, 0x9f, 0x46, 0x4d, 0x50, 0x5b,
      0x6a, 0x61, 0x7c, 0x77, 0x1e, 0x15, 0x08, 0x03, 0x32, 0x39, 0x24, 0x2f,
      0x8d, 0x86, 0x9b, 0x90, 0xa1, 0xaa, 0xb7, 0xbc, 0xd5, 0xde, 0xc3, 0xc8,
      0xf9, 0xf2, 0xef, 0xe4, 0x3d, 0x36, 0x2b, 0x20, 0x11, 0x1a, 0x07, 0x0c,
      0x65, 0x6e, 0x73, 0x78, 0x49, 0x42, 0x5f, 0x54, 0xf7, 0xfc, 0xe1, 0xea,
      0xdb, 0xd0, 0xcd, 0xc6, 0xaf, 0xa4, 0xb9, 0xb2, 0x83, 0x88, 0x95, 0x9e,
      0x47, 0x4c, 0x51, 0x5a, 0x6b, 0x60, 0x7d, 0x76, 0x1f, 0x14, 0x09, 0x02,
      0x33, 0x38, 0x25, 0x2e, 0x8c, 0x87, 0x9a, 0x91, 0xa0, 0xab, 0xb6, 0xbd,
      0xd4, 0xdf, 0xc2, 0xc9, 0xf8, 0xf3, 0xee, 0xe5, 0x3c, 0x37, 0x2a, 0x21,
      0x10, 0x1b, 0x06, 0x0d, 0x64, 0x6f, 0x72, 0x79, 0x48, 0x43, 0x5e, 0x55,
      0x01, 0x0a, 0x17, 0x1c, 0x2d, 0x26, 0x3b, 0x30, 0x59, 0x52, 0x4f, 0x44,
      0x75, 0x7e, 0x63, 0x68, 0xb1, 0xba, 0xa7, 0xac, 0x9d, 0x96, 0x8b, 0x80,
      0xe9, 0xe2, 0xff, 0xf4, 0xc5, 0xce, 0xd3, 0xd8, 0x7a, 0x71, 0x6c, 0x67,
      0x56, 0x5d, 0x40, 0x4b, 0x22, 0x29, 0x34, 0x3f, 0x0e, 0x05, 0x18, 0x13,
      0xca, 0xc1, 0xdc, 0xd7, 0xe6, 0xed, 0xf0, 0xfb, 0x92, 0x99, 0x84, 0x8f,
      0xbe, 0xb5, 0xa8, 0xa3,
    ],
    GDX = [
      0x00, 0x0d, 0x1a, 0x17, 0x34, 0x39, 0x2e, 0x23, 0x68, 0x65, 0x72, 0x7f,
      0x5c, 0x51, 0x46, 0x4b, 0xd0, 0xdd, 0xca, 0xc7, 0xe4, 0xe9, 0xfe, 0xf3,
      0xb8, 0xb5, 0xa2, 0xaf, 0x8c, 0x81, 0x96, 0x9b, 0xbb, 0xb6, 0xa1, 0xac,
      0x8f, 0x82, 0x95, 0x98, 0xd3, 0xde, 0xc9, 0xc4, 0xe7, 0xea, 0xfd, 0xf0,
      0x6b, 0x66, 0x71, 0x7c, 0x5f, 0x52, 0x45, 0x48, 0x03, 0x0e, 0x19, 0x14,
      0x37, 0x3a, 0x2d, 0x20, 0x6d, 0x60, 0x77, 0x7a, 0x59, 0x54, 0x43, 0x4e,
      0x05, 0x08, 0x1f, 0x12, 0x31, 0x3c, 0x2b, 0x26, 0xbd, 0xb0, 0xa7, 0xaa,
      0x89, 0x84, 0x93, 0x9e, 0xd5, 0xd8, 0xcf, 0xc2, 0xe1, 0xec, 0xfb, 0xf6,
      0xd6, 0xdb, 0xcc, 0xc1, 0xe2, 0xef, 0xf8, 0xf5, 0xbe, 0xb3, 0xa4, 0xa9,
      0x8a, 0x87, 0x90, 0x9d, 0x06, 0x0b, 0x1c, 0x11, 0x32, 0x3f, 0x28, 0x25,
      0x6e, 0x63, 0x74, 0x79, 0x5a, 0x57, 0x40, 0x4d, 0xda, 0xd7, 0xc0, 0xcd,
      0xee, 0xe3, 0xf4, 0xf9, 0xb2, 0xbf, 0xa8, 0xa5, 0x86, 0x8b, 0x9c, 0x91,
      0x0a, 0x07, 0x10, 0x1d, 0x3e, 0x33, 0x24, 0x29, 0x62, 0x6f, 0x78, 0x75,
      0x56, 0x5b, 0x4c, 0x41, 0x61, 0x6c, 0x7b, 0x76, 0x55, 0x58, 0x4f, 0x42,
      0x09, 0x04, 0x13, 0x1e, 0x3d, 0x30, 0x27, 0x2a, 0xb1, 0xbc, 0xab, 0xa6,
      0x85, 0x88, 0x9f, 0x92, 0xd9, 0xd4, 0xc3, 0xce, 0xed, 0xe0, 0xf7, 0xfa,
      0xb7, 0xba, 0xad, 0xa0, 0x83, 0x8e, 0x99, 0x94, 0xdf, 0xd2, 0xc5, 0xc8,
      0xeb, 0xe6, 0xf1, 0xfc, 0x67, 0x6a, 0x7d, 0x70, 0x53, 0x5e, 0x49, 0x44,
      0x0f, 0x02, 0x15, 0x18, 0x3b, 0x36, 0x21, 0x2c, 0x0c, 0x01, 0x16, 0x1b,
      0x38, 0x35, 0x22, 0x2f, 0x64, 0x69, 0x7e, 0x73, 0x50, 0x5d, 0x4a, 0x47,
      0xdc, 0xd1, 0xc6, 0xcb, 0xe8, 0xe5, 0xf2, 0xff, 0xb4, 0xb9, 0xae, 0xa3,
      0x80, 0x8d, 0x9a, 0x97,
    ],
    GEX = [
      0x00, 0x0e, 0x1c, 0x12, 0x38, 0x36, 0x24, 0x2a, 0x70, 0x7e, 0x6c, 0x62,
      0x48, 0x46, 0x54, 0x5a, 0xe0, 0xee, 0xfc, 0xf2, 0xd8, 0xd6, 0xc4, 0xca,
      0x90, 0x9e, 0x8c, 0x82, 0xa8, 0xa6, 0xb4, 0xba, 0xdb, 0xd5, 0xc7, 0xc9,
      0xe3, 0xed, 0xff, 0xf1, 0xab, 0xa5, 0xb7, 0xb9, 0x93, 0x9d, 0x8f, 0x81,
      0x3b, 0x35, 0x27, 0x29, 0x03, 0x0d, 0x1f, 0x11, 0x4b, 0x45, 0x57, 0x59,
      0x73, 0x7d, 0x6f, 0x61, 0xad, 0xa3, 0xb1, 0xbf, 0x95, 0x9b, 0x89, 0x87,
      0xdd, 0xd3, 0xc1, 0xcf, 0xe5, 0xeb, 0xf9, 0xf7, 0x4d, 0x43, 0x51, 0x5f,
      0x75, 0x7b, 0x69, 0x67, 0x3d, 0x33, 0x21, 0x2f, 0x05, 0x0b, 0x19, 0x17,
      0x76, 0x78, 0x6a, 0x64, 0x4e, 0x40, 0x52, 0x5c, 0x06, 0x08, 0x1a, 0x14,
      0x3e, 0x30, 0x22, 0x2c, 0x96, 0x98, 0x8a, 0x84, 0xae, 0xa0, 0xb2, 0xbc,
      0xe6, 0xe8, 0xfa, 0xf4, 0xde, 0xd0, 0xc2, 0xcc, 0x41, 0x4f, 0x5d, 0x53,
      0x79, 0x77, 0x65, 0x6b, 0x31, 0x3f, 0x2d, 0x23, 0x09, 0x07, 0x15, 0x1b,
      0xa1, 0xaf, 0xbd, 0xb3, 0x99, 0x97, 0x85, 0x8b, 0xd1, 0xdf, 0xcd, 0xc3,
      0xe9, 0xe7, 0xf5, 0xfb, 0x9a, 0x94, 0x86, 0x88, 0xa2, 0xac, 0xbe, 0xb0,
      0xea, 0xe4, 0xf6, 0xf8, 0xd2, 0xdc, 0xce, 0xc0, 0x7a, 0x74, 0x66, 0x68,
      0x42, 0x4c, 0x5e, 0x50, 0x0a, 0x04, 0x16, 0x18, 0x32, 0x3c, 0x2e, 0x20,
      0xec, 0xe2, 0xf0, 0xfe, 0xd4, 0xda, 0xc8, 0xc6, 0x9c, 0x92, 0x80, 0x8e,
      0xa4, 0xaa, 0xb8, 0xb6, 0x0c, 0x02, 0x10, 0x1e, 0x34, 0x3a, 0x28, 0x26,
      0x7c, 0x72, 0x60, 0x6e, 0x44, 0x4a, 0x58, 0x56, 0x37, 0x39, 0x2b, 0x25,
      0x0f, 0x01, 0x13, 0x1d, 0x47, 0x49, 0x5b, 0x55, 0x7f, 0x71, 0x63, 0x6d,
      0xd7, 0xd9, 0xcb, 0xc5, 0xef, 0xe1, 0xf3, 0xfd, 0xa7, 0xa9, 0xbb, 0xb5,
      0x9f, 0x91, 0x83, 0x8d,
    ],
    enc = function (string, pass, binary) {
      // string, password in plaintext
      var salt = randArr(8),
        pbe = openSSLKey(s2a(pass, binary), salt),
        key = pbe.key,
        iv = pbe.iv,
        cipherBlocks,
        saltBlock = [[83, 97, 108, 116, 101, 100, 95, 95].concat(salt)];
      string = s2a(string, binary);
      cipherBlocks = rawEncrypt(string, key, iv);
      // Spells out 'Salted__'
      cipherBlocks = saltBlock.concat(cipherBlocks);
      return Base64.encode(cipherBlocks);
    },
    dec = function (string, pass, binary) {
      // string, password in plaintext
      var cryptArr = Base64.decode(string),
        salt = cryptArr.slice(8, 16),
        pbe = openSSLKey(s2a(pass, binary), salt),
        key = pbe.key,
        iv = pbe.iv;
      cryptArr = cryptArr.slice(16, cryptArr.length);
      // Take off the Salted__ffeeddcc
      string = rawDecrypt(cryptArr, key, iv, binary);
      return string;
    },
    MD5 = function (numArr) {
      function rotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
      }

      function addUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = lX & 0x80000000;
        lY8 = lY & 0x80000000;
        lX4 = lX & 0x40000000;
        lY4 = lY & 0x40000000;
        lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
        if (lX4 & lY4) {
          return lResult ^ 0x80000000 ^ lX8 ^ lY8;
        }
        if (lX4 | lY4) {
          if (lResult & 0x40000000) {
            return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
          } else {
            return lResult ^ 0x40000000 ^ lX8 ^ lY8;
          }
        } else {
          return lResult ^ lX8 ^ lY8;
        }
      }

      function f(x, y, z) {
        return (x & y) | (~x & z);
      }
      function g(x, y, z) {
        return (x & z) | (y & ~z);
      }
      function h(x, y, z) {
        return x ^ y ^ z;
      }
      function funcI(x, y, z) {
        return y ^ (x | ~z);
      }

      function ff(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(f(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      }

      function gg(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(g(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      }

      function hh(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(h(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      }

      function ii(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(funcI(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      }

      function convertToWordArray(numArr) {
        var lWordCount,
          lMessageLength = numArr.length,
          lNumberOfWords_temp1 = lMessageLength + 8,
          lNumberOfWords_temp2 =
            (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64,
          lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16,
          lWordArray = [],
          lBytePosition = 0,
          lByteCount = 0;
        while (lByteCount < lMessageLength) {
          lWordCount = (lByteCount - (lByteCount % 4)) / 4;
          lBytePosition = (lByteCount % 4) * 8;
          lWordArray[lWordCount] =
            lWordArray[lWordCount] | (numArr[lByteCount] << lBytePosition);
          lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] =
          lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
      }

      function wordToHex(lValue) {
        var lByte,
          lCount,
          wordToHexArr = [];
        for (lCount = 0; lCount <= 3; lCount++) {
          lByte = (lValue >>> (lCount * 8)) & 255;
          wordToHexArr = wordToHexArr.concat(lByte);
        }
        return wordToHexArr;
      }

      /*function utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "",
            n,
            c;

            for (n = 0; n < string.length; n++) {

                c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        }*/

      var x = [],
        k,
        AA,
        BB,
        CC,
        DD,
        a,
        b,
        c,
        d,
        S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22,
        S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20,
        S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23,
        S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;

      x = convertToWordArray(numArr);

      a = 0x67452301;
      b = 0xefcdab89;
      c = 0x98badcfe;
      d = 0x10325476;

      for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = ff(a, b, c, d, x[k + 0], S11, 0xd76aa478);
        d = ff(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
        c = ff(c, d, a, b, x[k + 2], S13, 0x242070db);
        b = ff(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
        a = ff(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
        d = ff(d, a, b, c, x[k + 5], S12, 0x4787c62a);
        c = ff(c, d, a, b, x[k + 6], S13, 0xa8304613);
        b = ff(b, c, d, a, x[k + 7], S14, 0xfd469501);
        a = ff(a, b, c, d, x[k + 8], S11, 0x698098d8);
        d = ff(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
        c = ff(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
        b = ff(b, c, d, a, x[k + 11], S14, 0x895cd7be);
        a = ff(a, b, c, d, x[k + 12], S11, 0x6b901122);
        d = ff(d, a, b, c, x[k + 13], S12, 0xfd987193);
        c = ff(c, d, a, b, x[k + 14], S13, 0xa679438e);
        b = ff(b, c, d, a, x[k + 15], S14, 0x49b40821);
        a = gg(a, b, c, d, x[k + 1], S21, 0xf61e2562);
        d = gg(d, a, b, c, x[k + 6], S22, 0xc040b340);
        c = gg(c, d, a, b, x[k + 11], S23, 0x265e5a51);
        b = gg(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
        a = gg(a, b, c, d, x[k + 5], S21, 0xd62f105d);
        d = gg(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = gg(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
        b = gg(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
        a = gg(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
        d = gg(d, a, b, c, x[k + 14], S22, 0xc33707d6);
        c = gg(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
        b = gg(b, c, d, a, x[k + 8], S24, 0x455a14ed);
        a = gg(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
        d = gg(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
        c = gg(c, d, a, b, x[k + 7], S23, 0x676f02d9);
        b = gg(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
        a = hh(a, b, c, d, x[k + 5], S31, 0xfffa3942);
        d = hh(d, a, b, c, x[k + 8], S32, 0x8771f681);
        c = hh(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
        b = hh(b, c, d, a, x[k + 14], S34, 0xfde5380c);
        a = hh(a, b, c, d, x[k + 1], S31, 0xa4beea44);
        d = hh(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
        c = hh(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
        b = hh(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
        a = hh(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
        d = hh(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
        c = hh(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
        b = hh(b, c, d, a, x[k + 6], S34, 0x4881d05);
        a = hh(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
        d = hh(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
        c = hh(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
        b = hh(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
        a = ii(a, b, c, d, x[k + 0], S41, 0xf4292244);
        d = ii(d, a, b, c, x[k + 7], S42, 0x432aff97);
        c = ii(c, d, a, b, x[k + 14], S43, 0xab9423a7);
        b = ii(b, c, d, a, x[k + 5], S44, 0xfc93a039);
        a = ii(a, b, c, d, x[k + 12], S41, 0x655b59c3);
        d = ii(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
        c = ii(c, d, a, b, x[k + 10], S43, 0xffeff47d);
        b = ii(b, c, d, a, x[k + 1], S44, 0x85845dd1);
        a = ii(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
        d = ii(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
        c = ii(c, d, a, b, x[k + 6], S43, 0xa3014314);
        b = ii(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
        a = ii(a, b, c, d, x[k + 4], S41, 0xf7537e82);
        d = ii(d, a, b, c, x[k + 11], S42, 0xbd3af235);
        c = ii(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
        b = ii(b, c, d, a, x[k + 9], S44, 0xeb86d391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
      }

      return wordToHex(a).concat(wordToHex(b), wordToHex(c), wordToHex(d));
    },
    Base64 = (function () {
      var totalChunks;
      // Takes a Nx16x1 byte array and converts it to Base64
      var _chars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        chars = _chars.split(""),
        encode = function (b, withBreaks) {
          var flatArr = [],
            b64 = "",
            i,
            broken_b64;
          totalChunks = Math.floor((b.length * 16) / 3);
          for (i = 0; i < b.length * 16; i++) {
            flatArr.push(b[Math.floor(i / 16)][i % 16]);
          }
          for (i = 0; i < flatArr.length; i = i + 3) {
            b64 += chars[flatArr[i] >> 2];
            b64 += chars[((flatArr[i] & 3) << 4) | (flatArr[i + 1] >> 4)];
            if (!(flatArr[i + 1] === undefined)) {
              b64 +=
                chars[((flatArr[i + 1] & 15) << 2) | (flatArr[i + 2] >> 6)];
            } else {
              b64 += "=";
            }
            if (!(flatArr[i + 2] === undefined)) {
              b64 += chars[flatArr[i + 2] & 63];
            } else {
              b64 += "=";
            }
          }
          // OpenSSL is super particular about line breaks
          broken_b64 = b64.slice(0, 64) + "\n";
          for (i = 1; i < Math.ceil(b64.length / 64); i++) {
            broken_b64 +=
              b64.slice(i * 64, i * 64 + 64) +
              (Math.ceil(b64.length / 64) == i + 1 ? "" : "\n");
          }
          return broken_b64;
        },
        decode = function (string) {
          string = string.replace(/\n/g, "");
          var flatArr = [],
            c = [],
            b = [],
            i;
          for (i = 0; i < string.length; i = i + 4) {
            c[0] = _chars.indexOf(string.charAt(i));
            c[1] = _chars.indexOf(string.charAt(i + 1));
            c[2] = _chars.indexOf(string.charAt(i + 2));
            c[3] = _chars.indexOf(string.charAt(i + 3));

            b[0] = (c[0] << 2) | (c[1] >> 4);
            b[1] = ((c[1] & 15) << 4) | (c[2] >> 2);
            b[2] = ((c[2] & 3) << 6) | c[3];
            flatArr.push(b[0], b[1], b[2]);
          }
          flatArr = flatArr.slice(0, flatArr.length - (flatArr.length % 16));
          return flatArr;
        };

      //internet explorer
      if (typeof Array.indexOf === "function") {
        _chars = chars;
      }

      /*
        //other way to solve internet explorer problem
        if(!Array.indexOf){
            Array.prototype.indexOf = function(obj){
                for(var i=0; i<this.length; i++){
                    if(this[i]===obj){
                        return i;
                    }
                }
                return -1;
            }
        }
        */

      return {
        encode: encode,
        decode: decode,
      };
    })();

  return {
    size: size,
    h2a: h2a,
    expandKey: expandKey,
    encryptBlock: encryptBlock,
    decryptBlock: decryptBlock,
    Decrypt: Decrypt,
    s2a: s2a,
    rawEncrypt: rawEncrypt,
    aesEncrypt: aesEncrypt,
    aesDecrypt: aesDecrypt,
    dec: dec,
    openSSLKey: openSSLKey,
    a2h: a2h,
    enc: enc,
    Hash: { MD5: MD5 },
    Base64: Base64,
  };
})();
</script>
<style scoped type="scss">
.pl-login-sublogo{
  width: 100%;
  height: 35px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: 50%;
  &.company-gwm{
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAioAAABQCAYAAAA3Fl49AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFxGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4wLWMwMDEgNzkuYzAyMDRiMmRlZiwgMjAyMy8wMi8wMi0xMjoxNDoyNCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI0LjMgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTA0LTEzVDE0OjM3OjE0KzA5OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0wNC0xM1QxNDo0NTowOSswOTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0wNC0xM1QxNDo0NTowOSswOTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NWNjNmNiMTAtYWZlZi00NmI4LWJhZTktY2IyODRmZTMzN2Y3IiB4bXBNTTpEb2N1bWVu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");
  }

}
</style>
