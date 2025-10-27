<template>
  <!--vFlag - true : 미리보기, false : 실제 설문 -->
  <div :class="`pl-svy-preview ${vFlag && isUsePreviewCss ? 'is-preview' : 'is-survey'}`" :style="`${vFlag ? 'height: calc(100vh - 63px)' : ''}`">
    <!-- 첫화면 -->
    <template v-if="SVY_STEP === 'start'">
      <div class="pl-svy-preview-wrap flex-grow-1">
        <img :src="SVY_HEAD_DATA.IMG_URL ? SVY_HEAD_DATA.IMG_URL : require('@/assets/img/svy_preview_top.png')" :alt="SVY_HEAD_DATA.SRVY_QITEM_GROUP_NM">
        <div class="pl-svy-preview-content" >
          {{ SVY_HEAD_DATA.SRVY_CN }}
          <template
            v-if="SVY_HEAD_DATA.SRVY_DT">
            <br><br><strong>응답기간 : <br>{{ SVY_HEAD_DATA.SRVY_DT }}</strong>
          </template>
        </div>
      </div>
      <div class="pl-btn-wrap justify-center">
        <v-btn
          class="pl-btn"
          @click="nextSrvyGroup('start')"
          >
          설문조사 참여하기</v-btn>
      </div>
    </template>
    <template v-else>
      <div class="pl-svy-preview-wrap">
        <h1><span class="is-ellips">{{ SVY_HEAD_DATA.SRVY_QITEM_GROUP_NM }}</span></h1>
        <div class="pl-svy-preview-content" >
          <!-- 개인정보 수집 동의 -->
          <template v-if="SVY_STEP === 'terms'">
            <h2 class="pl-subtit">홍보 및 마케팅에 관한 동의</h2>
            <div class="pl-desc">{{CUSTCO_NM}}(은)는 “개인 정보 보호법”에 따라 동의를 얻어 아래와 같이 서비스의 홍보 및 마케팅을 위한 개인 정보를 수집이용합니다. </div>
            <table class="pl-tbl-detail is-mt-m">
              <thead>
                <tr>
                  <th scope="col">수집목차</th>
                  <th scope="col">수집 항목 및 보유기간</th>
                  <th scope="col">동의 여부 (필수)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <ul class="pl-list-dot is-no-border mt-0">
                      <li>SMS를 통한 이벤트 참여 기회 제공(쿠폰 발송)</li>
                      <li>고객 상담 및 AS관리</li>
                    </ul>
                  </td>
                  <td>
                    휴대전화번호<br/><span class="is-txt-sub">(수집일로부터 1년)</span>
                  </td>
                  <td>
                    <v-checkbox
                      class="pl-check is-centered"
                      v-model="chkTermsSms"
                    ></v-checkbox>
                  </td>
                </tr>
                <tr>
                  <td>
                    <ul class="pl-list-dot is-no-border mt-0">
                      <li>서비스 변경사항 및 고지사항 전달 </li>
                    </ul>
                  </td>
                  <td>
                    이메일<br/><span class="is-txt-sub">(수집일로부터 6개월)</span>
                  </td>
                  <td class="is-txt-center">
                    <span>
                      <v-checkbox
                        class="pl-check is-centered"
                        v-model="chkTermsEmail"
                      ></v-checkbox>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="pl-desc is-mt-m">귀하는 개인 정보 수집이용에 동의하지 않을 권리가 있으며, 동의를 거부할 경우에는 거부한 내용 관련 서비스를 받을 수 없습니다.</div>
            <div class="pl-form-inline-wrap vertical is-mt-m">
              <div class="pl-form-inline">
                <span class="pl-label" style="flex: 0 0 80px !important">
                  휴대 전화번호
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    placeholder="-  없이 입력하십시오."
                    type="number"
                    hide-spin-buttons
                    oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                    v-model="CUST_PHN_NO"
                  />
                  <!-- <input type="text"
                    @input="val"
                    :value="CUST_PHN_NO"
                    class="pl-form"
                    placeholder="-  없이 입력하십시오."
                  /> -->
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label" style="flex: 0 0 80px !important">
                  이메일
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    v-model="EML"
                  />
                </div>
              </div>
            </div>
          </template>
          <template v-if="SVY_STEP == 'svy'">
            <h2 class="pl-subtit">{{ CURRENT_GROUP_DATA.SRVY_QITEM_GROUP_NM }}</h2>
            <template v-for="qitem, qitemIdx in CURRENT_GROUP_DATA.QITEM_LIST">
              
              <!-- 단일 선택형 설문 -->
              <template v-if="qitem.QITEM_TYPE_CD === 'SNGL'" >
                <CompoSvyPreviewSngl
                  ref="qitemRefs"
                  :key="qitem.SRVY_QITEM_ID"
                  :DataProp="{'vFlag':vFlag, 'qitem': qitem, 'qitemIdx': qitemIdx, 'CURRENT_QITEM_IDX': CURRENT_QITEM_IDX, 'TRGT_ID': TRGT_ID}"
                  @changeChcMvmnSrvyQitemGroupId4Group="changeChcMvmnSrvyQitemGroupId4Group"
                  @changeChcMvmnSrvyQitemGroupId4Qitem="changeChcMvmnSrvyQitemGroupId4Qitem"
                />
              </template>

              <!-- 복수 선택형 설문 -->
              <template v-if="qitem.QITEM_TYPE_CD === 'MULT'">
                <CompoSvyPreviewMult
                  ref="qitemRefs"
                  :key="qitem.SRVY_QITEM_ID"
                  :DataProp="{'vFlag':vFlag, 'qitem': qitem, 'qitemIdx': qitemIdx, 'CURRENT_QITEM_IDX': CURRENT_QITEM_IDX, 'TRGT_ID': TRGT_ID}"
                />
              </template>
              
              <!-- 주관식 단답형 설문 -->
              <template v-if="qitem.QITEM_TYPE_CD === 'SHOT'">
                <CompoSvyPreviewShot
                  ref="qitemRefs"
                  :key="qitem.SRVY_QITEM_ID"
                  :DataProp="{'vFlag':vFlag, 'qitem': qitem, 'qitemIdx': qitemIdx, 'CURRENT_QITEM_IDX': CURRENT_QITEM_IDX, 'TRGT_ID': TRGT_ID}"
                />
              </template>
              
              <!-- 주관식 서술형 설문 -->
              <template v-if="qitem.QITEM_TYPE_CD === 'DESC'">
                <CompoSvyPreviewDesc
                  ref="qitemRefs"
                  :key="qitem.SRVY_QITEM_ID"
                  :DataProp="{'vFlag':vFlag, 'qitem': qitem, 'qitemIdx': qitemIdx, 'CURRENT_QITEM_IDX': CURRENT_QITEM_IDX, 'TRGT_ID': TRGT_ID}"
                />
              </template>

              <!-- 날짜 선택형 설문 -->
              <template v-if="qitem.QITEM_TYPE_CD === 'DATE'">
                <CompoSvyPreviewDate
                  ref="qitemRefs"
                  :key="qitem.SRVY_QITEM_ID"
                  :DataProp="{'vFlag':vFlag, 'qitem': qitem, 'qitemIdx': qitemIdx, 'CURRENT_QITEM_IDX': CURRENT_QITEM_IDX, 'TRGT_ID': TRGT_ID}"
                />
              </template>
              <!--반응형 처리를 위해 필요한 class : pl-form-inline-wrap-->
              <div 
                v-if="(lastMsg || CHC_MVMN_SRVY_QITEM_GROUP_ID_4_GROUP == '-999' || CHC_MVMN_SRVY_QITEM_GROUP_ID_4_QITEM == '-999') && qitemIdx + 1 == CURRENT_QITEM_COUNT" 
                :key="`submitMsg-${qitem.SRVY_QITEM_ID}`"
                :class="`pl-form-inline-wrap flex-grow-1 flex-column align-center justify-center flex-wrap is-mt-l  ${qitemIdx == CURRENT_QITEM_IDX ? 'current-item' : ''}`">
                <strong class="text-h6 font-weight-bold is-mt-l text-center">수고하셨습니다</strong>
                <p class="is-mt-s text-center">아래의 제출하기 버튼을 터치하십시오.</p>
              </div>
            </template>
            
          </template>
          

          <!-- 제출완료 안내 -->
          <template v-if="svy_status === 'done'">
            <div class="d-flex flex-grow-1 flex-column align-center justify-center flex-wrap is-mt-l">
              <v-icon class="pl-survey-icon is-done"></v-icon>
              <strong v-if="SVY_HEAD_DATA.SBMSN_END_MSG" class="text-h6 font-weight-bold is-mt-l text-center" v-html="SVY_HEAD_DATA.SBMSN_END_MSG"></strong>
              <strong v-else class="text-h6 font-weight-bold is-mt-l text-center">소중한 의견 감사합니다.</strong>
            </div>
          </template>
          <!-- 이미 제출한 경우 -->
          <template v-if="svy_status === 'already'">
            <div class="d-flex flex-grow-1 flex-column align-center justify-center flex-wrap is-mt-l">
              <v-icon class="pl-survey-icon is-done"></v-icon>
              <strong class="text-h6 font-weight-bold is-mt-l text-center">이미 참여한 설문조사 입니다.</strong>
              <p class="is-mt-s text-center">
                참여해 주셔서 감사합니다.
              </p>
            </div>
          </template>
          <!-- 설문 기간이 지난 경우 -->
          <template v-if="svy_status === 'past'">
            <div class="d-flex flex-grow-1 flex-column align-center justify-center flex-wrap is-mt-l">
              <v-icon class="pl-survey-icon is-done"></v-icon>
              <strong class="text-h6 font-weight-bold is-mt-l text-center">종료된 설문조사 입니다.</strong>
              <p class="is-mt-s text-center">
                관심을 가져 주셔서 감사합니다.
              </p>
            </div>
          </template>
          <!-- 데이터가없거나 잘못된 요청인 경우 -->
          <template v-if="svy_status === 'err'">
            <div class="d-flex flex-grow-1 flex-column align-center justify-center flex-wrap is-mt-l">
              <v-icon class="pl-survey-icon is-done"></v-icon>
              <strong class="text-h6 font-weight-bold is-mt-l text-center">잘못된 접근 입니다.</strong>
            </div>
          </template>
          <!-- 목표인원이 모두 충족된 경우 -->
          <template v-if="svy_status === 'psnal'">
            <div class="d-flex flex-grow-1 flex-column align-center justify-center flex-wrap is-mt-l">
              <v-icon class="pl-survey-icon is-done"></v-icon>
              <strong class="text-h6 font-weight-bold is-mt-l text-center">목표인원이 모두 완료되었습니다.</strong>
            </div>
          </template>
        </div>
      </div>
      <!-- 모바일/미리보기 버전일 때, 설문 항목 이동, 그룹(블록) 이동 버튼 -->
      <div class="qitem-btn pl-btn-wrap justify-center">
        <v-btn 
          v-if="!svy_done"
          class="pl-btn is-sub" 
          @click="() => CURRENT_QITEM_IDX == 0 ? prevSrvyGroup() : prevSrvyQitem()">이전</v-btn>
        <v-btn
          v-if="(lastMsg && !svy_done && (CURRENT_QITEM_COUNT == CURRENT_QITEM_IDX + 1)) || CHC_MVMN_SRVY_QITEM_GROUP_ID_4_QITEM == '-999'"
          class="pl-btn"
          @click="srvySubmit">제출하기</v-btn>
        <v-btn
          v-else-if="SVY_STEP === 'terms' && !lastMsg"
          class="pl-btn"
          @click="nextSrvyGroup('ok')">확인</v-btn>
        <v-btn
          v-else-if="SVY_STEP !== '' && (!lastMsg || ( lastMsg && (CURRENT_QITEM_COUNT > CURRENT_QITEM_IDX + 1)))"
          class="pl-btn"
          @click="() => CURRENT_QITEM_COUNT == CURRENT_QITEM_IDX + 1 ? nextSrvyGroup() : nextSrvyQitem()">다음</v-btn>
      </div>
      <!-- PC 버전일 때, 그룹(블록) 이동 버튼 -->
      <div
        v-if="!svy_done"
        class="group-btn pl-btn-wrap justify-center">
        <v-btn class="pl-btn is-sub" @click="prevSrvyGroup">이전</v-btn>

        <v-btn
          v-if="(lastMsg && !svy_done) || CHC_MVMN_SRVY_QITEM_GROUP_ID_4_GROUP == '-999'"
          class="pl-btn"
          @click="srvySubmit">제출하기</v-btn>
        <v-btn
          v-else-if="SVY_STEP === 'terms' && !lastMsg"
          class="pl-btn"
          @click="nextSrvyGroup('ok')">확인</v-btn>
        <v-btn
          v-else-if="SVY_STEP !== '' && !lastMsg"
          class="pl-btn"
          @click="nextSrvyGroup('next')">다음</v-btn>
      </div>

    </template>
  </div>
</template>

<script>
import CompoSvyPreviewSngl from '@/components/svy/CompoSvyPreviewSngl';
import CompoSvyPreviewMult from '@/components/svy/CompoSvyPreviewMult';
import CompoSvyPreviewShot from '@/components/svy/CompoSvyPreviewShot';
import CompoSvyPreviewDesc from '@/components/svy/CompoSvyPreviewDesc';
import CompoSvyPreviewDate from '@/components/svy/CompoSvyPreviewDate';
import { mapState, mapGetters, mapActions } from "vuex";

  const sha256 = require("sha256");
  const crypto = require("crypto");
  // const GibberishAES = require("crypto");

  export default {
    name: "MENUSVYPREVIEWBLOCK", //name은 'MENU_' + 파일명 조합
    props:{
      previewCall: Object
    },
    components: {
      CompoSvyPreviewSngl,
      CompoSvyPreviewMult,
      CompoSvyPreviewShot,
      CompoSvyPreviewDesc,
      CompoSvyPreviewDate,
    },
    data() {
      return {
        CUSTCO_NM: '',
        uid: "",
        upwd: "",
        ENCRYPT_KEY: "",
        USER_ID: "",
        CUST_NM:"",
        PHONE_NO:"",

        //블록 이동 히스토리
        prevGroupIdxHistList: [],

        // STEP
        realHeight: '',
        SVY_TOP_IMG: '',//require('@/assets/img/svy_preview_top.png'),
        SVY_STEP: 'start',
        CURRENT_GROUP_IDX: 0,
        svy_done: false,
        svy_status : '', //done 완료, already 이미, past 지난

        // 단일선택형
        radioGroup: [
        ],
        //그룹 이동(이전으로 이동했다가 다시 다음 이동) 시 제출하기 버튼 체크를 위한 그룹 이동 값 - PC 버전
        CHC_MVMN_SRVY_QITEM_GROUP_ID_4_GROUP: '',
        //설문 항목 이동(이전으로 이동했다가 다시 다음 이동) 시 제출하기 버튼 체크를 위한 그룹 이동 값 - 모바일 버전
        CHC_MVMN_SRVY_QITEM_GROUP_ID_4_QITEM: '',

        // 복수 선택형
        chkTypes: [
        ],
        // 목록 선택형
        dropItems: [],

        //주관식 단답형

        //주관식 서술형

        //날짜 선택형
        date: '',
        timeStep: '09:00',
        timeAmpm: '오전',
        chkTermsSms: false,
        chkTermsEmail: false,
        wFlag: false,
        radGrp: '',
        requiredFlag: false,
        lastMsg: false,
        //미리보기 여부
        vFlag: true,
        //미리보기 css 사용 여부 - 컴포넌트로 모바일폰 안에서 미리보기 시 사용함, 브라우저로 미리보기 시, 사용 안함.
        isUsePreviewCss: true,

        //모든 설문_문항_선택 목록 - 설문_문항_그룹, 설문_문항, 설문_문항_선택 정보 포함
        CHC_LIST: [],
        //모든 설문_문항 목록 - 설문_문항_그룹, 설문_문항 정보 포함
        QITEM_LIST: [],
        //모든 설문_문항_그룹 목록
        GROUP_LIST: [],

        SVY_HEAD_DATA: {},
        //현재 그룹(블록) Data
        CURRENT_GROUP_DATA: {},
        CURRENT_QITEM_COUNT: 0,
        CURRENT_QITEM_IDX: 0,

        //설문 항목 ref - 저장 요청 시 처리.
        SVY_ITEM_DATA: {},
        SVY_TEMP_DATA: [],
        // ITEM_IDX: [],
        CUST_PHN_NO: '',
        CHC_SHOT_DESC: '',
        CHC_DESC: '',
        EML: '',
        PARM_URL: '',
        TRGT_ID: '-1',
        SRVY_ID: '',
        CERT_CUSTCO_ID: '',


        //알림창 메시지
        MESSAGE : {
          CONFIRM : {
            REG : {alertDialogToggle: true, msg: '저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.setQuSaveYes, callNo: this.closeMsg}
            , MOD : {alertDialogToggle: true, msg: '수정하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.setQuSaveYes, callNo: this.closeMsg}
            , DEL : {alertDialogToggle: true, msg: '삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.delYes, callNo: this.closeMsg}
            , TER : {alertDialogToggle: true, msg: '수집여부에 동의하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.setTerms, callNo: this.closeMsg}
          },
          ALERT : {
            DEL_SUCCESS : {alertDialogToggle: true, msg: '삭제가 완료되었습니다', iconClass: 'is-info', type: 'default'}
            , REG_SUCCESS : {alertDialogToggle: true, msg: '저장이 완료되었습니다', iconClass: 'is-info', type: 'default'}
            , MOD_SUCCESS : {alertDialogToggle: true, msg: '수정이 완료되었습니다', iconClass: 'is-info', type: 'default'}

            , ETC1_WARNING : {alertDialogToggle: true, msg: 'SMS수집 동의여부는 필수 입니다.', iconClass: 'is-info', type: 'default'}
            , ETC2_WARNING : {alertDialogToggle: true, msg: '이메일수집 동의여부는 필수 입니다.', iconClass: 'is-info', type: 'default'}
            , ETC3_WARNING : {alertDialogToggle: true, msg: '휴대전화번호를 입력해 주세요.', iconClass: 'is-info', type: 'default'}
            , ETC4_WARNING : {alertDialogToggle: true, msg: '이메일을 입력해 주세요.', iconClass: 'is-info', type: 'default'}
            , ETC5_WARNING : {alertDialogToggle: true, msg: '휴대폰번호는 숫자만 입력이 가능합니다.', iconClass: 'is-info', type: 'default'}
            , ETC6_WARNING : {alertDialogToggle: true, msg: '휴대폰번호를 확인해 주세요.', iconClass: 'is-info', type: 'default'}
            , ETC7_WARNING : {alertDialogToggle: true, msg: '항목을 선택해 주세요.', iconClass: 'is-info', type: 'default'}
            , ETC8_WARNING : {alertDialogToggle: true, msg: '선택 수 만큼 항목을 선택해 주세요.', iconClass: 'is-info', type: 'default'}
            , ETC9_WARNING : {alertDialogToggle: true, msg: '내용을 입력해 주세요.', iconClass: 'is-info', type: 'default'}
            , ETC10_WARNING : {alertDialogToggle: true, msg: '메일 형식이 올바르지 않습니다.', iconClass: 'is-info', type: 'default'}
          },
          ERROR : {
            ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
          }
        },

      }
    },
    watch: {
      previewCall(newVal, oldVal){
        this.vFlag = newVal.view;
        this.SRVY_ID = newVal.id;
        this.selectMain();
      },
    },

    computed: {
      ...mapState({
        stateToken: "authStore/token",
      }),
      ...mapGetters({
        getterNumber: "authStore/GE_AUTH_TOKEN",
        loginResult: "authStore/GE_AUTH_LOGIN_RESULT",
      }),
    },

    created() {

    },

    async mounted() {
      this.init();

      // 모바일 체크
      if (this.isIOS()) {
        this.handleIOSBrowser();
      } else if (this.isMobile()) {
        this.handleMobileBrowser();
      }
      this.handleMobileBrowser();

      // //뷰여부
      if(this.mixin_isEmpty(this.previewCall)){
        this.vFlag = false;
        if(this.$route.query.key != undefined){
          this.PARM_URL = this.$route.query.key;//.substring(8, this.$route.query.url.length);
          this.urlDec();
        }
        if(this.mixin_isEmpty(this.PARM_URL)){
          this.pageErrCall('err');
          return;
        }
        if(this.mixin_isEmpty(this.TRGT_ID)) this.TRGT_ID = '-1';
      }else{
        this.vFlag = true;
        this.SRVY_ID = this.previewCall.id;
        this.selectMain();
      }
    },

    methods: {
      async urlDec(){
        const sUrl = '/api/svy/preview/aesurldecrypt';
        const postParam = {
          URL : this.PARM_URL,
        }
        const headParam = {
          head: {
            'SERVICE' : 'svy.preview.aesurldecrypt',
            'METHOD' : 'aesurldecrypt',
            'TYPE' : 'BIZ_SERVICE',
          }
        }

        let resData = await this.common_postCall(sUrl, postParam, headParam );
        if (resData.HEADER.ERROR_FLAG){
          this.errChk(resData);
        }
        else{
          this.SRVY_ID = resData.DATA[0].SRVY_ID;
          this.TRGT_ID = resData.DATA[0].SRVY_TRGT_ID;
          this.uid = resData.DATA[0].UUID;
          if(!this.mixin_isEmpty(resData.DATA[0].VFLAG) && resData.DATA[0].VFLAG == 'true') {
            this.vFlag = true;
            this.isUsePreviewCss = false;
          }
          this.getCertCustcoTenantId();
        }
      },

      async selectMain(){
        // const sleep = (ms) => new Promise(reslove => setTimeout(reslove, ms))
        // if(!this.vFlag) this.urlDec();
        // await sleep(500)

        const sUrl = '/api/svy/preview/selectmainlist';
        const postParam = {
          SRVY_ID : this.mixin_isEmpty(this.SRVY_ID)?-1:this.SRVY_ID,             //설문조사 id
          SRVY_TRGT_ID : this.TRGT_ID,             //설문조사 id
          VFLAG : this.vFlag,
        }
        const headParam = {
          head: {
            'SERVICE' : 'svy.preview.selectmainlist',
            'METHOD' : 'selectmainlist',
            'TYPE' : 'BIZ_SERVICE',
          }
        }

        let resData = await this.common_postCall(sUrl, postParam, headParam );


        if (resData.HEADER.ERROR_FLAG)
        {
          this.errChk(resData);
        }else{
          this.init();
          if(resData.DATA.length > 0){
            this.CHC_LIST = resData.DATA;
            this.CHC_LIST.forEach(e => {
              if(e.HEAD_YN === 'Y'){
                // 설문 - 사용자입력항목 특수문자 치환
                e.SRVY_QITEM_GROUP_NM = this.mixin_decode(e.SRVY_QITEM_GROUP_NM);
                e.SRVY_QITEM_GROUP_CN = this.mixin_decode(e.SRVY_QITEM_GROUP_CN);
                e.SRVY_CN = this.mixin_decode(e.SRVY_CN);
                e.SRVY_NM = this.mixin_decode(e.SRVY_NM);
                e.SBMSN_END_MSG = this.mixin_decode(e.SBMSN_END_MSG);
                e.SRVY_QITEM_EXPLN = this.mixin_decode(e.SRVY_QITEM_EXPLN);
                e.SRVY_QITEM_CN = this.mixin_decode(e.SRVY_QITEM_CN);

                this.SVY_HEAD_DATA = e;
                this.SVY_HEAD_DATA.IMG_URL = (this.mixin_isEmpty(e.IMG_URL) ? '' : `/upload/${e.IMG_URL}`);
              }
            });

            //항목id 중복제거
            this.QITEM_LIST = this.CHC_LIST.filter((item1, idx1)=>{
              return this.CHC_LIST.findIndex((item2, idx2)=>{
                if(item1.HEAD_YN === 'N'){
                  item2.SRVY_QITEM_GROUP_NM = this.mixin_decode(item2.SRVY_QITEM_GROUP_NM);
                  item2.SRVY_QITEM_GROUP_CN = this.mixin_decode(item2.SRVY_QITEM_GROUP_CN);
                  item2.SRVY_CN = this.mixin_decode(item2.SRVY_CN);
                  item2.SRVY_NM = this.mixin_decode(item2.SRVY_NM);
                  item2.SBMSN_END_MSG = this.mixin_decode(item2.SBMSN_END_MSG);
                  item2.SRVY_QITEM_EXPLN = this.mixin_decode(item2.SRVY_QITEM_EXPLN);
                  item2.SRVY_QITEM_CN = this.mixin_decode(item2.SRVY_QITEM_CN);

                  return item1.SRVY_QITEM_ID == item2.SRVY_QITEM_ID;
                }
              }) == idx1;
            });

            this.GROUP_LIST = this.QITEM_LIST.filter((item1, idx1)=>{
              return this.QITEM_LIST.findIndex((item2, idx2)=>{
                item2.SRVY_QITEM_GROUP_NM = this.mixin_decode(item2.SRVY_QITEM_GROUP_NM);
                item2.SRVY_QITEM_GROUP_CN = this.mixin_decode(item2.SRVY_QITEM_GROUP_CN);
                item2.SRVY_CN = this.mixin_decode(item2.SRVY_CN);
                item2.SRVY_NM = this.mixin_decode(item2.SRVY_NM);
                item2.SBMSN_END_MSG = this.mixin_decode(item2.SBMSN_END_MSG);
                item2.SRVY_QITEM_EXPLN = this.mixin_decode(item2.SRVY_QITEM_EXPLN);
                item2.SRVY_QITEM_CN = this.mixin_decode(item2.SRVY_QITEM_CN);

                return item1.SRVY_QITEM_GROUP_ID == item2.SRVY_QITEM_GROUP_ID;
              }) == idx1;
            });


            this.GROUP_LIST.map((group, groupIdx) => {
              let qitemList = this.QITEM_LIST.filter((qitem)=>{
                return group.SRVY_QITEM_GROUP_ID == qitem.SRVY_QITEM_GROUP_ID;
              });
              qitemList = _.cloneDeep(qitemList);

              qitemList.map((qitem) => {
                let chcList = this.CHC_LIST.filter((chc)=>{
                  return qitem.SRVY_QITEM_ID == chc.SRVY_QITEM_ID;
                });
                chcList = _.cloneDeep(chcList);
                qitem.CHC_LIST = chcList;
                if(qitem.QITEM_TYPE_CD == 'MULT') {
                  qitem.RSPNS = {QITEM_CHC_ID:{}, RSPNS_CN:''}
                } else {
                  qitem.RSPNS = [];
                }
                
              });
              group.QITEM_LIST = qitemList;
            })

          }else{
            this.pageErrCall('err');
            return;
          }
        }
      },
      errChk(resData){
        if(resData.HEADER.ERROR_MSG === 'CLS') this.pageErrCall('past');
        else if(resData.HEADER.ERROR_MSG === 'BAD') this.pageErrCall('err');
        else if(resData.HEADER.ERROR_MSG === 'ALR') this.pageErrCall('already');
        else if(resData.HEADER.ERROR_MSG === 'PSN') this.pageErrCall('psnal');
        else this.setErrMsg(resData);
      },
      // 모바일용 높이 구하기
      isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      },
      isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      },
      handleIOSBrowser() {
        // 실제 브라우저 높이를 구하는 함수 (Safe Area 고려)
        function getRealViewportHeight() {
          var visualViewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
          var statusBarHeight = window.visualViewport ? window.visualViewport.offsetTop : 0;
          var navBarHeight = Math.abs(visualViewportHeight - window.innerHeight);
          return visualViewportHeight + statusBarHeight - navBarHeight;
        }

        // 예시: 실제 브라우저 높이 출력
        this.realHeight = getRealViewportHeight();
      },
      handleMobileBrowser() {
        // 실제 브라우저 높이를 구하는 함수
        function getRealViewportHeight() {
          var windowHeight = window.innerHeight; // 브라우저 창의 높이

          // 브라우저가 실제 높이보다 클 경우에만 내비게이션바 등을 고려합니다.
          if (window.outerHeight > windowHeight) {
            var offset = window.outerHeight - windowHeight; // 내비게이션바 등의 높이
            return windowHeight + offset; // 실제 브라우저 높이 반환
          } else {
            return windowHeight; // 실제 브라우저 높이 반환
          }
        }

        // 예시: 실제 브라우저 높이 출력
        this.realHeight = getRealViewportHeight();
      },

      chkItemValid(){
        if(this.SVY_ITEM_DATA.ESNTL_YN === 'Y'){
          if(this.SVY_STEP === 'SNGL'){
            if(this.mixin_isEmpty(this.radGrp)){
              this.showAlert(this.MESSAGE.ALERT.ETC7_WARNING);
              return false;
            }
          }else if(this.SVY_STEP === 'MULT'){
              let cnt = 0;
              this.chkTypes.forEach(e => {
                if(e.selected) cnt++;
              });

              //선택허용수가 설정되어잇다면
              if(this.SVY_ITEM_DATA.CHC_PM_CNT != 9){
                //선택허용수보다 적거나 많게 클릭했으면
                if(this.SVY_ITEM_DATA.CHC_PM_CNT > cnt || this.SVY_ITEM_DATA.CHC_PM_CNT < cnt){
                  this.showAlert(this.MESSAGE.ALERT.ETC8_WARNING);
                  return false;
                }
              }else{
                if(cnt < 1){
                  this.showAlert(this.MESSAGE.ALERT.ETC7_WARNING);
                  return false;
                }
              }
          }else if(this.SVY_STEP === 'SHOT'){
            if(this.mixin_isEmpty(this.CHC_SHOT_DESC)){
              this.showAlert(this.MESSAGE.ALERT.ETC9_WARNING);
              return false;
            }
          }else if(this.SVY_STEP === 'DESC'){
            if(this.mixin_isEmpty(this.CHC_DESC)){
              this.showAlert(this.MESSAGE.ALERT.ETC9_WARNING);
              return false;
            }
          }
        }else{
          //멀티는 한번더 체크한다.
          if(this.SVY_STEP === 'MULT'){
            let cnt = 0;
            this.chkTypes.forEach(e => {
              if(e.selected) cnt++;
            });
            //한개라도 선택했다면 선택개수를 체크한다.
            if(cnt > 0 && this.SVY_ITEM_DATA.CHC_PM_CNT != 9){
              if(this.SVY_ITEM_DATA.CHC_PM_CNT > cnt || this.SVY_ITEM_DATA.CHC_PM_CNT < cnt){
                this.showAlert(this.MESSAGE.ALERT.ETC8_WARNING);
                return false;
              }
            }

          }
        }

        return true;
      },
      

      //다음 설문 그룹 조회
      getSrvyGroup(goWhere){
        //마지막이면
        if(this.GROUP_LIST.length === this.CURRENT_GROUP_IDX){
          this.lastMsg = true;
        }
        //다음 그룹일 때, CURRENT_GROUP_IDX 추가.
        if(goWhere == 'next') {
          this.prevGroupIdxHistList.push(this.CURRENT_GROUP_IDX);
        }
        this.CURRENT_GROUP_DATA = this.GROUP_LIST[this.CURRENT_GROUP_IDX -1];

        //다음 블록 정보가 설문지 제출일 경우 this.lastMsg = true 로 변경.
        if(!this.mixin_isEmpty(this.CURRENT_GROUP_DATA.GROUP_MVMN_SRVY_QITEM_GROUP_ID) && 
            this.CURRENT_GROUP_DATA.GROUP_MVMN_SRVY_QITEM_GROUP_ID == '-999') {
          this.lastMsg = true;
        }
        
        
        if(this.mixin_isEmpty(this.CURRENT_GROUP_DATA)){
          this.svy_status = 'done';
          this.svy_done = true;
          this.SVY_STEP = '';
          this.CURRENT_GROUP_IDX--;
          return;
        }
        this.SVY_STEP = 'svy';
        this.CURRENT_QITEM_COUNT = this.CURRENT_GROUP_DATA.QITEM_LIST.length;
        this.CURRENT_QITEM_IDX = goWhere == 'next' ? 0 : this.CURRENT_QITEM_COUNT -1;
      },

      prevSrvyQitem() {
        this.CURRENT_QITEM_IDX --;
        this.CHC_MVMN_SRVY_QITEM_GROUP_ID_4_QITEM = '';
      },

      async nextSrvyQitem() {
        //설문 항목 컴포넌트에 필수 체크 및 저장 처리
        const isSuccess = await this.$refs.qitemRefs[this.CURRENT_QITEM_IDX].chkQitem('N');
        if(isSuccess) {
          this.CURRENT_QITEM_IDX ++;
        }
        
      },


      // 설문조사 샘플
      async nextSrvyGroup(val) {
        if(val === 'start'){
          //개인정보수집동의여부
          if(this.SVY_HEAD_DATA.CLCT_AGRE_USE_YN === 'Y'){
            this.SVY_STEP = 'terms';
          }else{
            
            this.CURRENT_GROUP_IDX++;
            this.getSrvyGroup('next');
          }
        }else{
          if(val === 'ok'){
            let eFlag = true;

            if(!this.chkTermsSms) this.showAlert(this.MESSAGE.ALERT.ETC1_WARNING);
            else if(!this.chkTermsEmail) this.showAlert(this.MESSAGE.ALERT.ETC2_WARNING);
            else if(this.mixin_isEmpty(this.CUST_PHN_NO)) this.showAlert(this.MESSAGE.ALERT.ETC3_WARNING);
            else if(this.mixin_isEmpty(this.EML)) this.showAlert(this.MESSAGE.ALERT.ETC4_WARNING);
            else eFlag = false;

            //휴대폰번호 체크
            if(!this.mixin_isEmpty(this.CUST_PHN_NO)){
              const reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\'\"\\\(\=|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z]/;
              //문자가있는경우
              if (reg.exec(this.CUST_PHN_NO) !== null) {
                this.showAlert(this.MESSAGE.ALERT.ETC5_WARNING);
                eFlag = true;
              }else{
                //자릿수가 10or11 아닌경우
                if (this.CUST_PHN_NO.length < 10 || this.CUST_PHN_NO.length > 11) {
                  this.showAlert(this.MESSAGE.ALERT.ETC6_WARNING);
                  eFlag = true;
                }
              }
            }
            //이메일 체크
            if(!this.mixin_isEmpty(this.EML)){
              const regEmail = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
              if(!regEmail.test(this.EML)) {
                this.showAlert(this.MESSAGE.ALERT.ETC10_WARNING);
                eFlag = true;
              }
            }

            if(eFlag) return;

            if(!this.vFlag){
              this.showAlert(this.MESSAGE.CONFIRM.TER);
            }else{
              
              this.CURRENT_GROUP_IDX++;
              this.getSrvyGroup('next');
            }

          } else {
            //설문 항목 컴포넌트에 필수 체크 및 저장 처리
            for(let i=0; i< this.CURRENT_QITEM_COUNT; i++) {
              const isSuccess = await this.$refs.qitemRefs[i].chkQitem('N');
              if(isSuccess) {
                continue;
              } else {
                return;
              }
            }
            

            //다음 블록 정보 조회 및 건너뛰는 블록은 응답 데이터 삭제(서술, 문항_선택 데이터)
            let nextSrvyQitemGroupId = '';
            const filteredQitemList = this.CURRENT_GROUP_DATA.QITEM_LIST.filter(qitem => {
              return qitem.GROUP_MVMN_USE_YN == 'Y'
            })
            
            filteredQitemList.forEach(qitem => {
              const rspnsQitemChcId = qitem.RSPNS.QITEM_CHC_ID;
              qitem.CHC_LIST.forEach(chc => {
                if(chc.QITEM_CHC_ID == rspnsQitemChcId) {
                  nextSrvyQitemGroupId = chc.CHC_MVMN_SRVY_QITEM_GROUP_ID;
                }
              })
            })


            //설문_항목에서 다음 블록 정보 설정을 하지 않았다면 
            if(filteredQitemList.length == 0 && nextSrvyQitemGroupId == '') {
              if(!this.mixin_isEmpty(this.CURRENT_GROUP_DATA.GROUP_MVMN_SRVY_QITEM_GROUP_ID)) {
                nextSrvyQitemGroupId = this.CURRENT_GROUP_DATA.GROUP_MVMN_SRVY_QITEM_GROUP_ID;
              }
            }

            if(nextSrvyQitemGroupId == '') {
              this.CURRENT_GROUP_IDX++;
            } else {
              for(let i=this.CURRENT_GROUP_IDX; i<this.GROUP_LIST.length; i++) {
                this.CURRENT_GROUP_IDX++;
                if(this.GROUP_LIST[this.CURRENT_GROUP_IDX -1].SRVY_QITEM_GROUP_ID == nextSrvyQitemGroupId) {
                  break;
                } else {
                  //해당 블록 응답 데이터 삭제(이전으로 돌아가기 후 재설문 시, 이전의 기록은 삭제한다.(여기에 해당하는 블록은 통과되므로))
                  if(!this.vFlag) {
                    await this.deleteGroupRspns();
                  }
                }
              }
            }

            this.getSrvyGroup('next');
          }
        }

      },
      //이전 설문 그룹(블록) 이동t
      prevSrvyGroup() {
        this.lastMsg = false;
        this.CHC_MVMN_SRVY_QITEM_GROUP_ID_4_GROUP = '';
        this.CHC_MVMN_SRVY_QITEM_GROUP_ID_4_QITEM = '';
        if (this.CURRENT_GROUP_IDX > -1) {
          if(this.SVY_STEP === 'terms'){
            this.SVY_STEP = 'start';
            return;
          }

          //이전 CURRENT_GROUP_IDX 값 구하기.
          if(this.prevGroupIdxHistList.length > 0) {
            this.prevGroupIdxHistList.pop();
            if(this.prevGroupIdxHistList.length > 0) {
              this.CURRENT_GROUP_IDX = this.prevGroupIdxHistList[this.prevGroupIdxHistList.length -1]
            } else {
              this.CURRENT_GROUP_IDX = 0;
            }
          } else {
            this.CURRENT_GROUP_IDX = 0;
          }

          if(this.CURRENT_GROUP_IDX === 0){
            if(this.SVY_HEAD_DATA.CLCT_AGRE_USE_YN === 'Y') this.SVY_STEP = 'terms';
            else this.SVY_STEP = 'start';
          }else{
            this.getSrvyGroup('prev');
          }
        }
      },
      //제출하기
      async srvySubmit() {
        let submitYn = "N";
        //설문 항목 컴포넌트에 필수 체크 및 저장 처리
        for(let i=0; i< this.CURRENT_QITEM_COUNT; i++) {
          if(i == this.CURRENT_QITEM_COUNT -1) {
            submitYn = "Y";
          }
          const isSuccess = await this.$refs.qitemRefs[i].chkQitem(submitYn);
          if(isSuccess) {
            continue;
          } else {
            return;
          }
        }
        
        //다음 블록 정보가 설문지 제출이어서 이후의 블록이 있어도 설문이 종료됨. 이후의 블록에 혹시 모를 설문 데이터가 발생했을시를 대비해 응답 삭제 처리.
        if(!this.vFlag) {
          for(let i=this.CURRENT_GROUP_IDX; i<this.GROUP_LIST.length; i++) {
            this.CURRENT_GROUP_IDX++;
            //해당 블록 응답 데이터 삭제(이전으로 돌아가기 후 재설문 시, 이전의 기록은 삭제한다.(여기에 해당하는 블록은 통과되므로))
            await this.deleteGroupRspns();
          }
        }
        

        this.svy_status = 'done';
        this.svy_done = true;
        this.SVY_STEP = '';
        this.CHC_MVMN_SRVY_QITEM_GROUP_ID_4_GROUP = '';
        this.CHC_MVMN_SRVY_QITEM_GROUP_ID_4_QITEM = '';
      },

      async setTerms(){
        this.closeMsg();
        const sUrl = '/api/svy/preview/upsertterms';
        const postParam = {
          SRVY_ID : this.SRVY_ID             //설문조사 id
          ,SRVY_TRGT_ID : this.TRGT_ID
          ,CUST_PHN_NO : this.CUST_PHN_NO
          ,EML : this.EML
          ,INDI_INFO_AGRE_YN : 'Y'
          ,USER_ID : '3'    // 수정해야함.
        }
        const headParam = {
          head: {
            'SERVICE' : 'svy.preview.upsertterms',
            'METHOD' : 'upsertterms',
            'TYPE' : 'BIZ_SERVICE',
          }
        }

        let resData = await this.common_postCall(sUrl, postParam, headParam );

        if (resData.HEADER.ERROR_FLAG)
        {
          this.errChk(resData);
        }
        else
        {
          if(!this.mixin_isEmpty(resData.DATA[0].SRVY_TRGT_ID)){
            this.TRGT_ID = resData.DATA[0].SRVY_TRGT_ID;    //인서트후 리턴id가 있다면 셋팅
          }
          
          this.CURRENT_GROUP_IDX++;
          this.getSrvyGroup('next');
        }
      },
      //해당 그룹(블록) 응답 삭제
      async deleteGroupRspns(){
        const sUrl = '/api/svy/preview/deleteGroupRspns';
        const headParam = {
          head: {}
        }
        const srvyQitemGroupId = this.GROUP_LIST[this.CURRENT_GROUP_IDX -1].SRVY_QITEM_GROUP_ID;
        const postParam = {
          SRVY_TRGT_ID : this.TRGT_ID,
          SRVY_QITEM_GROUP_ID: srvyQitemGroupId
        }
        
        let resData = await this.common_postCall(sUrl, postParam, headParam );
        if (!resData.HEADER.ERROR_FLAG) {
        }
      },

      //설문 단일 선택형 문항 선택 시, 다음 블록 정보가 있을 시 변경한다.
      //(선택항 문항의 다음 블록 정보가 설문지 제출일 시, 설문지 제출 상태로 변경하기 위해 사용)
      changeChcMvmnSrvyQitemGroupId4Group(val) {
        this.CHC_MVMN_SRVY_QITEM_GROUP_ID_4_GROUP = val;
      },
      changeChcMvmnSrvyQitemGroupId4Qitem(val) {
        this.CHC_MVMN_SRVY_QITEM_GROUP_ID_4_QITEM = val;
      },


      init(){
        this.SVY_STEP = 'start';
        this.CUSTCO_NM = this.$store.getters["userStore/GE_USER_COMPANY"].CD_NM;
        this.CURRENT_GROUP_IDX = 0;
        this.chkTermsSms = false;
        this.chkTermsEmail = false;
        this.CUST_PHN_NO = '';
        this.EML = '';
        this.radGrp = '';
        this.chkTypes = [];
        this.CHC_SHOT_DESC = '';
        this.CHC_DESC = '';
        this.date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
        this.timeStep = '09:00';
        this.lastMsg = false;
        this.svy_status = '';
        this.svy_done = false;
        this.SVY_HEAD_DATA = {};
        this.CURRENT_GROUP_DATA = {};
        this.CURRENT_QITEM_COUNT = 0;
        this.CURRENT_QITEM_IDX = 0;
        this.SVY_ITEM_DATA = {};
        this.SVY_TEMP_DATA = [];
      },
      pageErrCall(sts){
        this.SVY_STEP = '';
        this.svy_status = sts;
        this.svy_done = true;
        this.lastMsg = true;
      },
      //메시지창 종료
      closeMsg(){
        this.$store.commit('alertStore/hideAlert');
      },
      //api오류
      setErrMsg(res){
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      },
      //멀티테넌시(multitenancy) 처리 : 로그인 전 로그인 ID로 TENANT_ID(테넌트) 정보 조회 by hjh
      async getCertCustcoTenantId() {
        //기존 store 값 초기화.
        this.$store.commit("authStore/MU_CUSTCO_TENANT_ID", { custco_tenant_id: '' });
        //로그인 전 로그인 ID로 TENANT_ID(테넌트) 정보 조회
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
        if(response.HEADER.COUNT == 1) {
          this.$store.commit("authStore/MU_CUSTCO_TENANT_ID", { custco_tenant_id: response.DATA[0].SCHEMA_ID });

          this.getKey();
          return true;
        } else {
          return false;
        }
      },
      //암호화 키 호출
      getKey() {
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
                alert(
                  "로그인을 실패하였습니다(암호화키 에러1)",
                  "error"
                );
              }
            }
          })
          .catch((error) => {
            alert("로그인을 실패하였습니다(암호화키 에러2)", "error");
          });
      },

      //로그인 처리
      login() {
        const password = this.uid+'1!';
        const strPassWD = sha256(password);
        let encPassWD = GibberishAES.aesEncrypt(strPassWD, this.ENCRYPT_KEY); //gibberish-aes.js

        this.$store
          .dispatch("authStore/AC_AUTH_LOGIN", {
            username: this.uid,
            userpassword: encPassWD,
          })
          .then((response) => {
            if (this.mixin_check_repsonse(response) === true) {
              setTimeout(() => {
                //성공시 이벤트 실행 - setTimeout 후 실행됨
                this.selectMain();
              }, 200);
            }
          });
      },
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

<style lang="scss" scoped>
.pl-subtit{
  line-height: 1.4;
}

</style>