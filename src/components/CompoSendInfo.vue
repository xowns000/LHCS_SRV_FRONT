<template>
  <div>
    <div>
      <!-- 기본 위치정보 -->
      <p v-if="DataTypeProp === 'place'">고객에게 문자, 이메일, 카카오톡 등으로 위치 정보를 전달할 수 있습니다.<br>위치 정보는 사전에 등록된 정보에 한하여 전달할 수 있습니다.</p>
      <p v-if="DataTypeProp === 'contacts'">고객에게 문자, 이메일, 카카오톡 등으로 연락처 정보를 전달할 수 있습니다.<br>연락 정보는 사전에 등록된 정보에 한하여 전달할 수 있습니다.</p>
    </div>
    <div class="pl-search-form mt-3">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <div class="pl-desc">
            <v-select
              v-model="dropSelected"
              class="pl-form"
              :items="DropPlace.code"
              placeholder="지역"
            ></v-select>
            <v-text-field
              v-model="computedSearchInput"
              class="pl-form is-lg"
              value=""
              placeholder="검색어 입력"
              @keyup.enter="searchPlaceContacts()" />
            <v-btn class="pl-btn is-icon" @click="searchPlaceContacts()">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    <div class="pl-grid-top">
      <div class="pl-grid-top-left"></div>
      <div class="pl-grid-top-utils">
        <span class="pl-counter">전체 <em class="pl-1">({{ DataBodyItems.length }})</em> 건의 결과가 있습니다.</span>
      </div>
    </div>

     <!-- grid -->
     <v-data-table
      class="pl-grid has-control"
      :headers="DataHeaderProp"
      :items="DataBodyItems"
      fixed-header
      item-key="ROW_NUMBER"
      height="340px"
      show-select
      single-select
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      :page.sync="page"
      v-model="computedSelectedDataProp"
      @page-count="pageCount = $event"
      no-data-text="등록된 데이터가 없습니다."
     >
      <template
        v-if="DataTypeProp === 'place'"
        v-slot:item.ADDR = "{item}">
        <v-tooltip content-class="pl-tooltip bottom" bottom>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">{{ item.ADDR }}</span>
          </template>
          <span>{{ item.ADDR }}</span>
        </v-tooltip>
      </template>
      <template
        v-if="DataTypeProp === 'contacts'"
        v-slot:item.TKCG_DEPT_NM = "{item}">
        <v-tooltip content-class="pl-tooltip bottom" bottom>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">{{ item.TKCG_DEPT_NM }}</span>
          </template>
          <span>{{ item.TKCG_DEPT_NM }}</span>
        </v-tooltip>
      </template>
      <template
        v-if="DataTypeProp === 'contacts'"
        v-slot:item.TASK_NM = "{item}">
        <v-tooltip content-class="pl-tooltip bottom" bottom>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">{{ item.TASK_NM }}</span>
          </template>
          <span>{{ item.TASK_NM }}</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <h2 class="pl-dialog-body-tit-h2">전달매체</h2>
    <div class="pl-dialog-body-desc">
      <v-radio-group
        v-model="computedSelectedRadio"
        row
        class="pl-radio-group"
      >
        <v-radio
          v-for="(rad01, ROW_NUMBER) in radioGroup"
          :key="radioGroup[ROW_NUMBER].text"
          :label="rad01.text"
          :value="rad01.value"
          class="pl-radio mr-8"
        >
        <template v-slot:label>
          <div> {{ rad01.text }}
            <v-icon class="pl-icon30" :class=rad01.icon></v-icon>
          </div>
        </template>
        </v-radio>
      </v-radio-group>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CompoSendInfo',
    props: {
      DataTypeProp: {
        type: String,
        default: 'place'
      },
      SearchInputProp: {
        type: String,
      },
      SelectedRadioProp: {
        type: String,
        default: '문자'
      },
      DataHeaderProp: {
        type: Array,
      },
      DataBodyProp: {
        type: Array,
      },
      selectedDataProp: {
        type: Array,
      }
    },
    data() {
      return {
        DataBodyItems: [],
        DropPlace: {},
        callbackNumber: '',
        dropSelected: '',
        page: 1,
        pageCount: 0,
        perPage: [15,30,50,100],
        ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때
        radioSelected: '문자',

        TMPL_CD: '',
        REPLACE_TMPL_CN: '',
        DSPTCH_PRF_KEY: '',
        EPSZ_INDCT_MPIT_INFO: '',

        radioGroup: [
          { text: "문자", icon: 'is-sms',  value: 'SMS'},
          // { text: "이메일", icon: 'is-email'},
          { text: "카카오톡", icon: 'is-kakao', value: 'KAKAO'},
          // { text: "페이스북", icon: 'is-facebook'},
        ],

        MESSAGE : {
          CONFIRM : {
          },
          ALERT : {
            SUCCESS : {alertDialogToggle: true, msg: '정상 처리 되었습니다.', iconClass: 'is-info', type: 'default'}
            , SEND_SUCCESS : {alertDialogToggle: true, msg: '전송에 성공하였습니다.', iconClass: 'is-info', type: 'default'}
            , SEND_FAIL : {alertDialogToggle: true, msg: '전송에 실패하였습니다.', iconClass: 'is-caution', type: 'default'}
            , NONE : {alertDialogToggle: true, msg: '보내실 항목을 선택해주세요.', iconClass: 'is-caution', type: 'default'}
            , ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
            , NO_TMPL : {alertDialogToggle: true, msg: '템플릿 등록 후 진행해 주시기 바랍니다.', iconClass: 'is-caution', type: 'default'}
          },
          ERROR : {
            ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
          },
          TOAST : {
            SUCCESS: {  msg: '전송에 성공하였습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 },
            SEND_SUCCESS: {  msg: '전송에 성공하였습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 },
            SEND_FAIL: {  msg: '전송에 실패하였습니다.', class: 'warning', hasToastIcon: true, icon: 'mdi-close-circle' , time: 2000 }
          },
        },
      }
    },
    methods: {

      // 템플릿 조회
      async getTempleInfo(item, custInfo){

        // 템플릿 코드,내용,타이틀 초기화
        this.TMPL_CD = '';
        this.REPLACE_TMPL_CN = '';
        this.EPSZ_INDCT_MPIT_INFO = '';

        this.TMPL_CD = item === 'place' ? (this.computedSelectedRadio == 'SMS' ? 'TP_LOCAL' : 'BASE_TMPL_LOCAL') : ( this.computedSelectedRadio == 'SMS' ? 'TP_CONTACT': 'BASE_TMPL_CONTACT');
        let URLData = '/phone-api/placeContact/selectTempleteInfo';

        let postParam = {
          TMPL_CD: this.TMPL_CD,
          TMPL_TY: this.computedSelectedRadio
        }
        let headParam = {
          head : {}
        }

        let response = await this.common_postCall(URLData, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG) {
          if(response.DATA.length > 0){
            // 발신프로필키
            this.DSPTCH_PRF_KEY = response.DATA[0].DSPTCH_PRF_KEY;

            // 강조표기형 - 강조제목
            this.EPSZ_INDCT_MPIT_INFO = response.DATA[0].EPSZ_INDCT_MPIT_INFO;

            // 사용자에게 전달될 메시지
            this.REPLACE_TMPL_CN = item === 'place' ?
            response.DATA[0].TMPL_CN
            .split('#{CUS_NM}').join(custInfo.CUST_NM)
            .split('#{LOC_NM}').join(this.computedSelectedDataProp[0].PSTN_NM)
            .split('#{LOC}').join(this.computedSelectedDataProp[0].SPLIT_ADDR)
            .split('#{ADDR}').join(this.computedSelectedDataProp[0].ADDR)
            :
            response.DATA[0].TMPL_CN
            .split('#{CUS_NM}').join(custInfo.CUST_NM)
            .split('#{TEL}').join(this.computedSelectedDataProp[0].TELNO)
            .split('#{LOC}').join(this.computedSelectedDataProp[0].RGN_NM)
            .split('#{OBJ}').join(this.computedSelectedDataProp[0].TKCG_DEPT_NM)
            .split('#{WORK}').join(this.computedSelectedDataProp[0].TASK_NM);

          }else{
            this.REPLACE_TMPL_CN = '';
          }
        }
      },

      // 전송
      async sendInfoBtn(item, custInfo){

        // 선택 여부 체크
        if(this.computedSelectedDataProp.length === 0) {
          this.showAlert(this.MESSAGE.ALERT.NONE);
          return;
        }

        // 템플릿정보 조회
        await this.getTempleInfo(item, custInfo);

        // 고객사 대표번호
        this.callbackNumber = this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO.split(',')[0];

        if(this.getByteB(this.REPLACE_TMPL_CN) === 0){
          this.showAlert(this.MESSAGE.ALERT.NO_TMPL);
          return;
        }

        // 문자 내용 byte 체크
        let sndngSeCD = this.getByteB(this.REPLACE_TMPL_CN) > 90 ? 'LMS' : 'SMS'; // 90byte 이상이면 LMS

        let URLData = '/phone-api/placeContact/sendInfo';
        let postParam;

        if(this.computedSelectedRadio === 'SMS'){

          postParam = {
            SNDNG_SE_CD: sndngSeCD                             // 발송구분코드 - SMS/LMS/MMS
            , callback_number: this.callbackNumber             // 발신전화번호
            , phone_number: custInfo.CUST_PHN_NO               // 사용자 전화번호
            , message: this.REPLACE_TMPL_CN                    // 사용자에게 전달될 메시지
            , tenantId : this.$store.getters["authStore/GE_CUSTCO_TENANT_ID"]
          }
        }else if(this.computedSelectedRadio === 'KAKAO'){

          postParam = {
            SNDNG_SE_CD: 'ATALK'                                // 발송구분코드
            , sender_key: this.DSPTCH_PRF_KEY                   // 발신 프로필 키
            , template_code: this.TMPL_CD                       // 템플릿코드
            , callback_number: this.callbackNumber              // 발신전화번호
            , phone_number: custInfo.CUST_PHN_NO                // 사용자 전화번호
            , message: this.REPLACE_TMPL_CN                     // 사용자에게 전달될 메시지
            , title: this.EPSZ_INDCT_MPIT_INFO                  // 강조표기형 - 강조제목
            , tran_type: sndngSeCD.substring(0,1)               // 전환전송 구분(S,L,M,N)
            , subject: '전환 메세지'                             // 전환전송 제목
            , tran_message: this.REPLACE_TMPL_CN                // 전환전송 내용
            , tenantId : this.$store.getters["authStore/GE_CUSTCO_TENANT_ID"]
          }
        }

        let headParam = {
          head : {}
        }

        let response = await this.common_postCall(URLData, postParam, headParam);

        if(!response.HEADER.ERROR_FLAG) {
          // console.log('response.DATA', response.DATA);
          if(response.DATA[0].code === '0000'){
            // let data = {};
            // if(this.computedSelectedRadio === 'SMS') {
            //   data = {
            //     send_date: response.DATA[0].received_at.replace(/-/gi, "").replace(/:/gi, "").replace(" ", ""),
            //     sndngSeCd: this.getByteB(this.REPLACE_TMPL_CN) > 90 ? 'LMS' : 'SMS',
            //   }
            // } else if(this.computedSelectedRadio === 'KAKAO'){
            //   data = {
            //     send_date: response.DATA[0].received_at.replace(/-/gi, "").replace(/:/gi, "").replace(" ", ""),
            //     sender_key: this.DSPTCH_PRF_KEY
            //   }
            // }
            // this.mixin_getSndngRslt(data);

            this.computedSelectedDataProp = [];
            this.showToast(this.MESSAGE.TOAST.SEND_SUCCESS);
          }else{
            this.showToast(this.MESSAGE.TOAST.SEND_FAIL);
            // this.showAlert(this.MESSAGE.ALERT.SEND_FAIL);
          }
        }
      },

      // 기본 한글 2바이트 처리
      getByteB(str) {
        var byte = 0;
        for (var i=0; i<str.length; ++i) {
          (str.charCodeAt(i) > 127) ? byte += 2 : byte++ ;
        }
        return byte;
      },

      // 위치정보, 연락처정보 조회
      async searchPlaceContacts(){

        // 위치, 연락처 구분
        let type = this.DataTypeProp === 'place' ? true : false
        let URLData = '/phone-api/placeContact/selectplaceContact';
        let postParam = {
          PLACE: this.dropSelected,
          INPUT_DATA: this.computedSearchInput,
          TYPE: type,
        }
        let headParam = {
          head : {}
        }

        let response = await this.common_postCall(URLData, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG) {
          if(!type){
            for(let i=0; i<response.DATA.length; i++){
              response.DATA[i].TELNO = this.autoPhoneNum(response.DATA[i].TELNO);
            }
          }
          this.DataBodyItems = response.DATA;
        }
      },

      // 연락처 형식
      autoPhoneNum(value) {
        if (!value) {
          return "";
        }

        value = value.replace(/[^0-9]/g, "");

        let result = [];
        let restNumber = "";

        // 지역번호와 나머지 번호로 나누기
        if (value.startsWith("02")) {
          // 서울 02 지역번호
          result.push(value.substr(0, 2));
          restNumber = value.substring(2);
        } else if (value.startsWith("1")) {
          // 지역 번호가 없는 경우
          // 1xxx-yyyy
          restNumber = value;
        } else {
          // 나머지 3자리 지역번호
          // 0xx-yyyy-zzzz
          result.push(value.substr(0, 3));
          restNumber = value.substring(3);
        }

        if (restNumber.length === 7) {
          // 7자리만 남았을 때는 xxx-yyyy
          result.push(restNumber.substring(0, 3));
          result.push(restNumber.substring(3));
        } else {
          result.push(restNumber.substring(0, 4));
          result.push(restNumber.substring(4));
        }

        return result.filter((val) => val).join("-");
      },
    },

    computed :{
      computedSearchInput: {
        get(){
          return this.SearchInputProp;
        },
        set(value){
          this.$emit("update:SearchInputProp", value);
        },
      },
      computedSelectedRadio: {
        get(){
          return this.SelectedRadioProp;
        },
        set(value){
          this.$emit("update:SelectedRadioProp", value);
        },
      },
      computedSelectedDataProp: {
        get(){
          return this.selectedDataProp;
        },
        set(value){
          this.$emit("update:selectedDataProp", value);
        },
      }
    },

    async created() {

      // 검색어 초기화
      this.computedSearchInput = '';

      //공통코드별 드롭박스 만들기
      this.COMM_CD_DROP_LIST = await this.mixin_common_code_get_all(['AREA']);
      let areas = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, 'AREA', '전체');
      this.DropPlace = {
        code: areas
      }

      // 위치정보 및 연락처정보 조회
      this.searchPlaceContacts();

      // 위치정보 및 연락처정보 발송
      this.$eventBus.$off("setSendInfoParm"); //eventBus 중복방지를 위해 off
      this.$eventBus.$on("setSendInfoParm", (type, custInfo) => {
        this.sendInfoBtn(type, custInfo);
      });

    },


  }
</script>

<style lang="scss" scoped>

</style>