<template>
  <div class="pl-call-dialog">
    <v-form ref="form">
      <div class="pl-form-inline-wrap vertical type-auto is-mt-l">
        <div class="pl-form-inline">
          <span class="pl-label">
            인증기관
            <v-icon class="pl-icon20 required"></v-icon>
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form"
              style="width:133px;"
              v-model="PROV_OG"
              :disabled="STAT!=='1'"
              :items="PROV_OG_LIST"
              placeholder="선택하세요"
              :rules="validateRules.PROV_OG"
              @change="certSetParam"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            이&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;름
            <v-icon class="pl-icon20 required"></v-icon>
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form"
              v-model="CUST_NM"
              placeholder="사용자 이름"
              :disabled="STAT!=='1'"
              :rules="validateRules.CUST_NM"
              v-byte-counter="20"
            />
          </div>
        </div>
        <div class="pl-form-inline" v-if="PROV_OG === 'copass_100101'">
          <span class="pl-label">
            통&nbsp;신&nbsp;사&nbsp;
            <v-icon class="pl-icon20 required"></v-icon>
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form"
              style="width:133px;"
              v-model="AGENCY"
              :disabled="STAT!=='1'"
              :items="AGENCY_LIST"
              placeholder="선택하세요"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            전화번호
            <v-icon class="pl-icon20 required"></v-icon>
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form"
              v-model="PHN_NO"
              :disabled="STAT!=='1'"
              :rules="validateRules.PHN_NO"
              placeholder="휴대폰번호 11자리"
              maxlength="14"
              hide-spin-buttons
              type="text"
              @keyup="setPhoneNo(PHN_NO)"
              oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            생년월일
            <v-icon class="pl-icon20 required"></v-icon>
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form"
              v-model="YYYYMMDD"
              :disabled="STAT!=='1'"
              :rules="validateRules.YYYYMMDD"
              placeholder="생년월일 8자리 (yyyymmdd)"
              maxlength="14"
              hide-spin-buttons
              type="text"
              oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
            />
          </div>
        </div>
      </div>
    </v-form>

    <div class="pl-btn-wrap is-mt-l justify-start">
      <v-btn v-if="STAT === '1'" class="pl-btn type-call" @click="inputValid()">인증 요청</v-btn>
      <v-btn v-if="STAT === '2'" class="pl-btn type-call" @click="getCertResult()">인증 결과 요청</v-btn>
    </div>

    <div v-if="STAT === '2'">
      남은 시간 : {{ CERT_STAT_TIME }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CompoOmniOne',
    props: {
      DataProp: {
        type: Object,
      }
    },
    data() {
      return {
        PROV_OG_LIST: [], //인증요청 기관 목록
        PROV_OG: 'cokakao_100101', //인증요청 기관(카카오로 고정)

        //통신사 목록
        AGENCY_LIST: [
          {text : 'SKT', value: 'S'}
          , {text : 'KT', value: 'K'}
          , {text : 'LGT', value: 'L'}
        ],

        AGENCY : '', //통신사
        
        CUST_NM: '', //인증요청 사용자 이름
        PHN_NO: '', //인증요청 사용자 휴대폰번호 11자리
        YYYYMMDD: '', //인증요청 사용자 생년월일 8자리 (yyyymmdd)

        EN_CUST_NM : '',
        EN_PHN_NO : '',
        EN_YYYYMMDD : '',

        OACX_URL : '', //인증서버 url
        AUTH_TOKEN: '', //암복호화 토큰
        CERT_INFO: '', //암호화 정보

        TOKEN:'',
        TXID:'',
        CXID:'',

        RES_TOKEN:'', //결과 토큰
        RES_TXID:'',

        RES_CONT:'',

        validateRules: {
          PROV_OG: [
            v => !!v || '인증기관 은(는) 필수 입력 항목 입니다.',
          ],
          CUST_NM: [
            v => !!v || '이름 은(는) 필수 입력 항목 입니다.',
          ],
          PHN_NO: [
            v => !!v || '전화 번호 은(는) 필수 입력 항목 입니다.',
          ],
          YYYYMMDD: [
            v => !!v || '생년월일 은(는) 필수 입력 항목 입니다.',
          ],
        },

        STAT : '1',

        CERT_TIMER : '',
        CERT_TIME : 300, //인증 시간(5분)
        CERT_STAT_TIME : '00:00:00',
      }
    },

    watch: {
      DataProp () {
        this.CUST_NM = (this.DataProp.CUST_NM?this.DataProp.CUST_NM==='성명미상'?'':this.DataProp.CUST_NM:''); //인증요청 사용자 이름
        this.PHN_NO = (this.DataProp.CUST_PHN_NO?this.mixin_setPhoneNo(this.DataProp.CUST_PHN_NO):''); //인증요청 사용자 휴대폰번호 11자리
      },
    },

    computed :{
    },

    beforeDestroy(){
      this.$eventBus.$off("OmniOneInit"); //eventBus 중복방지를 위해 off
      this.$eventBus.$off("OmniOneStatCheck"); //eventBus 중복방지를 위해 off
    },

    async created() {
      this.$store.watch(
      (state)=>{
        return this.$store.getters['userStore/GE_USER_COMPANY']
      },
      (val)=>{
        this.PROV_OG_LIST = val.OMNI_INST_NM;
      },
      {
        deep:true
      }
      );

      //초기화 이벤트
      this.$eventBus.$on("OmniOneInit", () => {
        this.init();
      });
      
      this.$eventBus.$on("OmniOneStatCheck", () => {
        this.omniOneStatCheck();
      });
    },

    mounted() {
      this.init();
    },

    methods: {
      init() {
        console.log('초기화');
        console.log(this.COMPANY_INFO);
        this.PROV_OG = 'cokakao_100101'; //인증요청 기관(카카오로 고정)
        
        this.CUST_NM = (this.DataProp.CUST_NM?this.DataProp.CUST_NM==='성명미상'?'':this.DataProp.CUST_NM:''); //인증요청 사용자 이름
        this.PHN_NO = (this.DataProp.CUST_PHN_NO?this.mixin_setPhoneNo(this.DataProp.CUST_PHN_NO):''); //인증요청 사용자 휴대폰번호 11자리
        this.YYYYMMDD = ''; //인증요청 사용자 생년월일 8자리 (yyyymmdd)

        this.EN_CUST_NM = '';
        this.EN_PHN_NO = '';
        this.EN_YYYYMMDD = '';

        this.OACX_URL = ''; //인증서버 url
        this.AUTH_TOKEN = ''; //암복호화 토큰
        this.CERT_INFO = ''; //암호화 정보

        this.TOKEN = '';
        this.TXID  = '';
        this.CXID = '';

        this.RES_TOKEN = ''; //결과 토큰
        this.RES_TXID = '';

        this.RES_CONT = '';

        this.STAT = '1';

        this.CERT_TIMER = '',
        this.CERT_TIME = 300; //인증 시간(5분)
        this.CERT_STAT_TIME = '00:00:00';

        clearInterval(this.CERT_TIMER);

        this.PROV_OG_LIST = this.$store.getters['userStore/GE_USER_COMPANY'].OMNI_INST_NM; //인증사 목록

        this.initMakeAuthToken(); //암복호화 토큰 생성
      },

      omniOneStatCheck() {
        if(this.STAT === '1'){
          this.$eventBus.$emit('dialogOmniOneClose');
        }else if(this.STAT === '2'){
          this.showAlert({
            alertDialogToggle: true
            , msg: '인증을 요청한 상태 입니다.<br>그래도 간편인증 창을 닫으시겠습니까?<br>지금 창을 닫으실 경우 간편인증 처리가 되지 않습니다.'
            , iconClass: 'is-info'
            , type: 'confirm'
            , callYes: () => {
              this.$eventBus.$emit('dialogOmniOneClose');
              this.$store.commit("alertStore/hideAlert");
              clearInterval(this.CERT_TIMER);
            }
            , callNo: () => {
              this.$store.commit("alertStore/hideAlert");
            }
          });
        }
      },

      //전화번호 하이픈 처리
      setPhoneNo(val){
        let res = this.mixin_setPhoneNo(val.replace(/[^0-9]/g, ""));
        this.PHN_NO = res;
      },

      //인증사 목록
      getProviderList() {
        let arrProvList = [];
        $.ajax({
            url: this.OACX_URL + '/oacx/api/v1.0/cxwindow/info',
            method: 'GET',
            headers:{
                Authorization:'certinfo '+this.CERT_INFO
            }
        }).done(function (response) {
          response['cx-providers'].forEach((prov, seq) => {
            arrProvList.push({text : prov.name, value : prov.id});
          });
        });

        return arrProvList;
      },

      //1.암복호화 토큰 생성
      async initMakeAuthToken() {
        let postParam = {
          CERT_CUSTCO_ID : this.$store.getters['userStore/GE_USER_COMPANY'].CERT_CUSTCO_ID
          , SRVC_GDS_ID : this.$store.getters['userStore/GE_USER_COMPANY'].SRVC_GDS_ID
        }
        let response  = await this.common_postCall('/api/omnione/makeAuthToken', postParam, {});
        if (!response.HEADER.ERROR_FLAG){
          if(response.DATA[0].status === 'C001'){ //정상
            this.OACX_URL = response.DATA[0].oacxUrl;
            this.AUTH_TOKEN = response.DATA[0].authToken;
            this.CERT_INFO = response.DATA[0].certInfo;

            // this.PROV_OG_LIST = this.getProviderList(); //인증사 목록
          }else{ //오류
            this.showAlert({alertDialogToggle: true, msg: "인증 요청 오류로 인해 잠시 후 다시 시도해 주시기 바랍니다.", iconClass: 'is-info', type: 'default'});
          }
        }else{
          this.showAlert({alertDialogToggle: true, msg: response.DATA[0].clientMessage, iconClass: 'is-info', type: 'default'});
          this.$eventBus.$emit('dialogOmniOneClose');
        }

      },

      //2.사용자 정보 확인 및 암호화
      async inputValid() {
        if(!this.detailValidate()) {
          return;
        }else{
          if(this.PROV_OG === 'copass_100101' && this.mixin_isEmpty(this.AGENCY)){ //통신사PASS인 경우
            this.showAlert({alertDialogToggle: true, msg: "통신사를 선택해 주세요.", iconClass: 'is-info', type: 'default'});
            return;
          }else{
            let postParam = {
              authToken : this.AUTH_TOKEN
              , PROV_OG : this.PROV_OG
              , CUST_ID : this.DataProp.CUST_ID
              , CUST_NM : this.CUST_NM
              , PHN_NO : this.PHN_NO.replace(/[^0-9]/g, '')
              , YYYYMMDD : this.YYYYMMDD
            }

            let headParam = {
              head : {
              }
            }
            
            let response  = await this.common_postCall('/api/omnione/enCryptInfo', postParam, headParam);
            if (!response.HEADER.ERROR_FLAG){
              let _this = this;
              Object.keys(response.DATA[0]).forEach(function(v){
                Object.keys(postParam).forEach(function(k){
                  if(k === v){
                    _this[`EN_${k}`] = response.DATA[0][v];
                  }
                });
              });

              this.getToken();
            }
          }
        }
      },

      //2.토큰 생성
      getToken() {
        let _this = this;
        $.ajax({
            url: this.OACX_URL + '/oacx/api/v1.0/trans',
            method: 'POST',
            headers:{
                Authorization:'certinfo '+this.CERT_INFO
            }
        }).done(function (response) {
          _this.TOKEN = response.token;
          _this.TXID = response.txId;

          _this.reqCert();
        });
      },

      //3.인증 요청
      reqCert() {
        let _this = this;
        let _userAgent = navigator.userAgent;
        let _os = this.getOs(_userAgent);
        let _device = this.isMobile()?'MO':'PC';
        let postParam = {
            "id": this.PROV_OG,  //mdl provider Id
            "token": this.TOKEN,
            "txId": this.TXID,
            "contentInfo": {
                "signType": "ENT_AUTH" //간편인증 ENT_AUTH, 전자서명 : ENT_SIGN
            },
            "userInfo":{
                "name": this.EN_CUST_NM,
                "phone": this.EN_PHN_NO,
                "birthday": this.EN_YYYYMMDD,
                "telcoTycd": this.AGENCY //통신사 패스 파라메터 , SKT:S , KT : K , LG :L
            },
            "deviceInfo": {
                "code": _device, //PC / MO
                "browser": "DIRECT", //E2E 암호화시
                "os": _os  //PC일 경우 공백,  ANDROID:AOS , IOS:IOS
            },
            "contentInfo": {
                "signTarget": "", /// 전자서명일 경우 서명문 해시, 간편인증일 경우 공백
                "signTargetTycd": "nonce"
            }
        }

        $.ajax({
          url: this.OACX_URL + '/oacx/api/v1.0/authen/request',
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                'Authorization':'certinfo '+this.CERT_INFO
            },
            "data": JSON.stringify(postParam)
        }).done(function (response) {
            if(response.oacxCode == "OACX_SUCCESS"){
                console.log('요청성공');
                _this.TOKEN = response.token;
                _this.CXID = response.cxId;

                _this.STAT = '2';
                _this.certTimer();
            }else{
              _this.showAlert({alertDialogToggle: true, msg: response.clientMessage, iconClass: 'is-info', type: 'default'});
              return;
            }
        });
      },

      //4.인증완료 상태확인 요청
      getCertResult() {
        let _this = this;
        let postParam = {
            id: this.PROV_OG,  //mdl provider Id
            token: this.TOKEN,
            txId: this.TXID,
            cxId: this.CXID
        }
        $.ajax({
            url: this.OACX_URL + '/oacx/api/v2.0/authen/status',
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                Authorization:'certinfo '+this.CERT_INFO
            },
            "data": JSON.stringify(postParam)
        }).done(function (response) {            
            if(response.oacxCode == "OACX_SUCCESS"){
              console.log('인증완료 상태확인 성공');
              _this.RES_TOKEN = response.token;
              _this.RES_TXID = response.txId;

              _this.getResult();
            }else{
              _this.showAlert({alertDialogToggle: true, msg: response.clientMessage, iconClass: 'is-info', type: 'default'});
              if(response.oacxCode === 'OACX_TOKEN_EXPIRED'){ //인증시간 경과
                _this.init();
                return;
              }else{
                return;
              }
            }
        });
      },

      //4.결과 토큰 조회
      async getResult() {
        let _this = this;
        let postParam = {
            token: this.RES_TOKEN,
            txId: this.RES_TXID
        }
        $.ajax({
            url: this.OACX_URL + '/oacx/api/v2.0/authen/result',
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                Authorization:'certinfo '+this.CERT_INFO
            },
            "data": JSON.stringify(postParam)
        }).done(function (response) {            
            // console.log('결과 : ', response);
            _this.RES_CONT = response.token;
            _this.getDeCrypt();
        });
      },

      //5.결과 복호화
      async getDeCrypt() {
        let postParam = {
          CERT_CUSTCO_ID : this.$store.getters['userStore/GE_USER_COMPANY'].CERT_CUSTCO_ID
          , SRVC_GDS_ID : this.$store.getters['userStore/GE_USER_COMPANY'].SRVC_GDS_ID
          , authToken : this.AUTH_TOKEN
          , CUST_ID : this.DataProp.CUST_ID
          , token : this.RES_CONT
          , PROV_OG : this.PROV_OG
        }

        let headParam = {
          head : {
          }
        }
        
        let response  = await this.common_postCall('/api/omnione/deCryptInfo', postParam, headParam);
        if (!response.HEADER.ERROR_FLAG){
          console.log('결과 복호화 : ', response);
          this.STAT = '3';
          this.showAlert({alertDialogToggle: true, msg: '인증 처리 되었습니다.', iconClass: 'is-info', type: 'default'});
          
          clearInterval(this.CERT_TIMER);

          this.$emit('nextEvent'); //인증성공 이후 이벤트

          this.$eventBus.$emit("dialogOmniOneClose");
        }else{
          this.showAlert({alertDialogToggle: true, msg: response.DATA[0].clientMessage, iconClass: 'is-info', type: 'default'});
        }
      },

      certSetParam() {
        if(this.STAT !== '1'){
          this.showAlert({
            alertDialogToggle: true
            , msg: '인증기관을 변경 하시겠습니까?<br>'
            , iconClass: 'is-info'
            , type: 'confirm'
            , callYes: () => {
              this.init();
            }
            , callNo: () => {
              this.$store.commit("alertStore/hideAlert");
            }
          });
        }
      },

      certTimer() {
        this.CERT_TIME--;
        this.CERT_TIMER = setInterval(() => {
          this.CERT_STAT_TIME = this.mixin_seconds_toHHMMSS(this.CERT_TIME--);
          if(this.CERT_STAT_TIME === '00:00:00'){
            this.showAlert({alertDialogToggle: true, msg: '인증 시간이 만료 되었습니다.<br>초기화를 진행 합니다.', iconClass: 'is-info', type: 'default'});
            this.init();
            return;
          }
        }, 1000);
      },

      //validate
      detailValidate () {
        return this.$refs.form.validate();
      },

      getOs(_userAgent) {
        let _os = ''; //default Empty.
        if (/iPhone|iPod/i.test(_userAgent)) {
            _os = "iOS";
        } else if (/Android/i.test(_userAgent)) {
            _os = "Android";
        } else if ((/Mac OS X/i.test(_userAgent) && navigator.maxTouchPoints === 5) || /iPad/i.test(_userAgent)) {
            // iPad
            _os = "iOS";
        }
        return _os;
      },

      isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      }
    },

  }
</script>

<style lang="scss" scoped>

</style>