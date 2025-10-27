<template>
  <div class="pl-cols">
    <div class="is-vrt">
      <div class="pl-card pa-0">
        <v-tabs class="pl-tabs" v-model="tab">
          <v-tab @click="getIpExtList()">고객정보 중</v-tab>
          <v-tab @click="getCtcList()">상담내용 중</v-tab>
          <v-tab @click="getCtcList()">캠페인 이력 중</v-tab>
          <!-- <v-tabs-items v-model="tab"> -->
            <v-tab-item>
              <div class="pl-card">
                <ul class="pl-list-info2">
                  <li>
                    <v-autocomplete
                      v-model="SEL_CUST_EXPSN_ATTR"
                      return-object
                      class="pl-form is-lg"
                      :items="CUST_EXPSN_ATTR"
                      v-on:change="setExportTxt"
                      placeholder="선택 하세요"
                      clearable
                      no-data-text="결과 없음"
                    />
                  </li>
                </ul>
              </div>
              <div class="pl-card">
                <!-- grid -->
                <v-data-table
                  class="pl-grid"
                  :headers="headers"
                  :items="gridItems"
                  fixed-header
                  item-key="index"
                  height="527px"
                  :items-per-page="ROW_PER_PAGE"
                  hide-default-footer
                  :page.sync="page"
                  no-data-text="등록된 데이터가 없습니다."
                  @page-count="pageCount = $event">
                  <template v-slot:item.transfer="{ item }">
                    <v-btn
                      class="pl-btn is-sm"
                      :disabled="!item.transfer"
                      @click="selectCusl(item)"
                      >
                      {{ item.transfer ? '선택' : '불가' }}
                    </v-btn>
                  </template>
                  <template v-slot:item.status="{ item }">
                    <span :class="item.transfer ? 'is-txt-main' : 'is-txt-error'">
                      {{ item.status }}
                    </span>
                  </template>
                </v-data-table>
              </div>
            </v-tab-item>
            <v-tab-item>
              <div class="pl-card">
                <!-- grid -->
                <v-data-table
                  class="pl-grid"
                  :headers="headers2"
                  :items="gridItems2"
                  fixed-header
                  item-key="index"
                  height="527px"
                  :items-per-page="ROW_PER_PAGE2"
                  hide-default-footer
                  no-data-text="등록된 데이터가 없습니다."
                  @page-count="pageCount = $event">
                  <template v-slot:item.transfer="{ item }">
                    <v-btn
                      class="pl-btn is-sm"
                      @click="selectCtc(item)"
                      >
                      {{ '선택' }}
                    </v-btn>
                  </template>
                </v-data-table>
              </div>
            </v-tab-item>
          <!-- </v-tabs-items> -->
        </v-tabs>

      </div>
    </div>
    <!-- 추출 내용  -->
    <div class="pl-card is-col-fix" style="width: 450px;">
      <h2 class="pl-subtit">추출 내용</h2>
      <ul class="pl-list-info">
        <li>선택 되어진 조건 내용을 바탕으로 캠페인 대상이 추출 됩니다.</li>
      </ul>
      <div class="pl-subdesc">
        <strong>[{{ tab === 0 ? '고객 정보 중' : tab === 1 ? '상담 내용 중' : '캠페인 이력 중' }}]</strong>
      </div>
      <div class="pl-form-inline-wrap vertical">
        <div
          v-for="(attr, seq) in EXPORT_TEXT"
          :key="attr.value"
          class="pl-form-inline">
          <span class="pl-label">{{ attr.text }} 값이 </span>
          <div class="pl-desc">
            <template v-if="attr.DATA_TYPE_CD === 'COE'">
              <v-select
              class="pl-form is-sx"
              :items="attr.coe"
              :item-text="attr.CD_NM"
              ></v-select>
            </template>
            <template v-if="attr.DATA_TYPE_CD === 'TXT' || attr.DATA_TYPE_CD === 'NUM'">
              <v-text-field
                class="pl-form "
                :class="attr.DATA_LEN > 60 ? 'is-lg':'is-xs'"
              />
            </template>
          </div>
          <v-select
            class="pl-form is-sx"
            :items="attr.Prefixes"
          ></v-select>
          <v-btn
            icon
            @click="delExpsnAttr(attr)"
            style="margin-left: 5px; margin-top: 1px;"
            class="pl-icon tab-close"
          >
          </v-btn>
        </div>
      </div>
      <div class="pl-btn-wrap is-mt-m">
        <v-btn v-if="EXPORT_TEXT.length > 0"
          class="pl-btn  ml-auto"
          @click=""
        >추출</v-btn>
      </div>
    </div>
  </div>
 </template>

 <script>
  import { callUtil } from "@/store/callUtil.js";
  export default {
    name: 'CompoTransfer',
    props: {
      DataProp: {
        type: Object,
      },
    },
    data() {
      return {
        codeName : [],
        common_code : [],

        ctiStatList : [],

        // search
        SCH_CTI_STAT_TP : {text:'대기', value:'6'},
        SCH_CTI_STAT_TP_TXT : '',
        SCH_KEY:'EXT_NO', //내선번호
        SCH_KEYWORD:'',

        // grid
        page: 1,
        pageCount: 500,
        perPage: [15,30,50,100],
        ROW_PER_PAGE: -1,
        pagination: {
          page: 1,
          rowsPerPage: 500,
          sortBy: "",
          descending: ""
        }, //그리드 페이지속성정의
        headers: [
          { text: '번호', value: 'CUSL_ROW_NUMBER', align: 'center', width: '80px', sortable: false },
          { text: '상담직원명', value: 'USER_NM', align: 'left', width: '120px', sortable: false },
          { text: '상담직원 ID', value: 'LGN_ID', sortable: false},
          { text: '내선 번호', value: 'EXT_NO', align: 'left', width: '100px', sortable: false },
          { text: '상담 그룹 ', value: 'group', align: 'left', width: '120px', sortable: false },
          { text: '상담직원 상태 ', value: 'status', align: 'left', width: '120px' },
          { text: '호전환 ', value: 'transfer', align: 'center', width: '100px', sortable: false },
        ],
        gridItems: [],

        // 상세정보
        TRAN_INLNE_NO : '', //2자 호전환 번호
        TRAN_USER_NM : '', //2자 호전환 대상 이름
        CONF_INLNE_NO : '', //3자 호전환 번호
        CONF_USER_NM : '', //3자 호전환 대상 이름

        CTI_PHONE_TRAN : false, // 호전환 시도
        CTI_PHONE_CONF : false, // 3자 시도
        lapseTime : '',

        // grid
        page2: 1,
        pageCount2: 500,
        perPage2: [15,30,50,100],
        ROW_PER_PAGE2: -1,
        pagination2: {
          page: 1,
          rowsPerPage: 500,
          sortBy: "",
          descending: ""
        }, //그리드 페이지속성정의
        headers2: [
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px', sortable: false},
          { text: '담당부서', value: 'TKCG_DEPT_NM', align: 'left', width: '120px', sortable: false},
          { text: '이름', value: 'TASK_NM', align: 'left', width: '120px', sortable: false},
          { text: '연락처', value: 'TELNO', align: 'left', width: '150px', sortable: false},
          // { text: '지역', value: 'RGN_NM', align: 'left', width: '50px'},
          { text: '호전환 ', value: 'transfer', align: 'center', width: '100px', sortable: false },
        ],
        gridItems2: [],
        ctcSchItems : [],
        CTC_SCH_KEY : 'TASK_NM',

        //confirm alert 메시지
        MESSAGE : {
          CONFIRM : {
            REG : {alertDialogToggle: true, msg: '저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.ipExtSave, callNo: this.closeMsg}
          },
          ALERT : {
            SUCCESS : {alertDialogToggle: true, msg: '정상 처리 되었습니다.', iconClass: 'is-info', type: 'default'}
            , IPCC_ERROR : {alertDialogToggle: true, msg: 'IPCC 내선번호 조회 중 오류가 발생했습니다.', iconClass: 'is-info', type: 'default'}
            , PHN_NO_CHECK2 : {alertDialogToggle: true, msg: '2자통화 내선/외부 를 입력하세요.', iconClass: 'is-info', type: 'default'}
            , PHN_NO_CHECK3 : {alertDialogToggle: true, msg: '3자통화 내선 번호를 입력하세요.', iconClass: 'is-info', type: 'default'}
          },
          ERROR : {
            ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
          }
        },

        tab : 0,
        EXPORT_TEXT : [],

        CUST_EXPSN_ATTR : [], //고객 확장 속성
        SEL_CUST_EXPSN_ATTR : {}, //선택된 고객 확장 속성
      }
    },
    watch: {
      
    },
    computed :{
    },
    beforeDestroy(){
    },
    async created() {
      //공통코드설정
      this.codeName = ['CTI_STAT_TP','TRANSFER_SRCH'];
      this.common_code = await this.mixin_common_code_get_all(this.codeName);
      this.ctiStatList = this.mixin_common_code_get(this.common_code, 'CTI_STAT_TP', '전체');

      this.headers2.forEach((data, idx) => {
        if(idx>0 && idx <4) this.ctcSchItems.push({text : data.text, value: data.value});
      });

      this.cuttHistgetExpsnAttr();

      this.getIpExtList();
      this.getCtcList();
    },
    mounted() {
    },
    methods: {
      async cuttHistgetExpsnAttr(){

        let sURL = '/phone-api/history/cuttHistGetExpsnAttr';
        let postParams = {};
        let headParams ={
          head:{},
        };

        let response = await this.common_postCall(sURL, postParams, headParams);

        if(!response.HEADER.ERROR_FLAG) {
          response.DATA.forEach((data, idx) => {
            if(data.DATA_TYPE_CD === 'COE') this.codeName.push(data.GROUP_CD_ID);
            
            if(data.SE === 'CUSTOM'){

              this.CUST_EXPSN_ATTR.push({
                  text: data.EXPSN_ATTR_NM,
                  value: data.EXPSN_ATTR_COL_ID,
                  SE: data.SE,
                  ATTR_ID: data.ATTR_ID,
                  DATA_TYPE_CD: data.DATA_TYPE_CD,
                  GROUP_CD_ID: data.GROUP_CD_ID,
                });
            }
            // if (data.SE == 'CUSTOM') {
            //   if(!this.EXCEL_CUSTOM_ATTR.map(item => item.value).includes(data.EXPSN_ATTR_COL_ID)) {
            //     this.EXCEL_CUSTOM_ATTR.push({
            //       text: data.EXPSN_ATTR_NM,
            //       value: data.EXPSN_ATTR_COL_ID,
            //       SE: data.SE,
            //       ATTR_ID: data.ATTR_ID,
            //       DATA_TYPE_CD: data.DATA_TYPE_CD,
            //       GROUP_CD_ID: data.GROUP_CD_ID,
            //       chk: false,
            //       disabled: false
            //     });
            //   }
            // } else if (data.SE == 'CONSEL') {
            //   if(!this.EXCEL_CONSEL_ATTR.map(item => item.value).includes(data.EXPSN_ATTR_COL_ID)){
            //     this.EXCEL_CONSEL_ATTR.push({
            //       text: data.EXPSN_ATTR_NM,
            //       value: data.EXPSN_ATTR_COL_ID,
            //       SE: data.SE,
            //       ATTR_ID: data.ATTR_ID,
            //       DATA_TYPE_CD: data.DATA_TYPE_CD,
            //       GROUP_CD_ID: data.GROUP_CD_ID,
            //       chk: false,
            //       disabled: false
            //     });
            //   }
            // }
          });
        }

        this.common_code = await this.mixin_common_code_get_all(this.codeName);
      },

      //확장 속성 선택 이벤트
      async setExportTxt(data){
        if(data.DATA_TYPE_CD === 'COE'){ //단일 선택형
          data.coe = this.mixin_common_code_get(this.common_code, data.GROUP_CD_ID, '전체');
        }

        data.Prefixes = [{text:'이고', vaule:'AND'}, {text:'이거나', vaule:'OR'}]

        this.EXPORT_TEXT.push(data);

      },

      delExpsnAttr(data){
        this.EXPORT_TEXT.forEach((attr, idx) => {
          if(data.value === attr.value) this.EXPORT_TEXT.splice(idx, 1);
        });
      },

      transInit(){
        // 상세정보
        this.DTL_USER_NM = '';
        this.TRAN_INLNE_NO = ''; //2자 내선번호
        this.CONF_INLNE_NO = ''; //3자 내선번호
        this.TRAN_USER_NM = '';
        this.CONF_USER_NM = '';

        this.CTI_PHONE_TRAN = false; // 호전환 시도
        this.CTI_PHONE_CONF = false; // 3자 시도
        
        this.getIpExtList();
        this.getCtcList();
      },
      //그리드 목록 조회
      async getIpExtList() {
        this.gridItems = [];
        let overallStat = callUtil.ipcc('/api/palette_interface.php', {REQ : 'monitor_agent_list'}); //상담사 모니터링
        // console.log(overallStat);

        let arrCusl = [];
        let store = this.$store;
        let iCuslCnt = 1;
        let SCH_CTI_STAT_TP = this.SCH_CTI_STAT_TP;
        // console.log('SCH_CTI_STAT_TP : ', SCH_CTI_STAT_TP);
        if(overallStat != null){
          Object.keys(overallStat).forEach(function(v){
            if(v === '0'){
              Object.keys(overallStat[v]).forEach(k =>{
                if(store.getters["userStore/GE_USER_ROLE"].EXT_NO !== k){
                  // console.log(SCH_CTI_STAT_TP.text, overallStat[v][k].STAT.toUpperCase())
                  if(!SCH_CTI_STAT_TP.value || SCH_CTI_STAT_TP.text === overallStat[v][k].STAT.toUpperCase()){
                    let cuslObj = {};
                    cuslObj.CUSL_ROW_NUMBER = iCuslCnt++; //row num
                    cuslObj.cuslImg = require('@/assets/img/@profile_user.png'); //사용자 이미지
                    cuslObj.EXT_NO = k; //내선번호
                    cuslObj.status = overallStat[v][k].STAT; //상태
                    cuslObj.elapseTime = overallStat[v][k].USETIME; //시간
                    cuslObj.changeTime = overallStat[v][k].TIMESTART; //상태 변경시간

                    if(overallStat[v][k].STAT === '대기') cuslObj.transfer = true;
                    else cuslObj.transfer = false;

                    arrCusl.push(cuslObj);
                  }
                }
              });
            }
          });
        }

        let sUrl = '/api/setting/ipExt/extNotEmptyCuslList';
        let postParam = {
          SCH_KEY : this.SCH_KEY
          , SCH_KEYWORD : this.SCH_KEYWORD
        }

        let headParam = {
          head : {
          }
        }

        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          for(let stat of arrCusl){
            for(let ipExt of response.DATA){
              if(ipExt.EXT_NO === stat.EXT_NO){
                stat.CO_NM = ipExt.CO_NM;
                stat.CUSL_ID = ipExt.CUSL_ID;
                stat.USER_NM = ipExt.USER_NM;
                stat.LGN_ID = ipExt.LGN_ID;
                stat.role = ipExt.AUTHRT_GROUP_NM;
                stat.cuslImg = (ipExt.ICON !=='f04'?'/upload/' + ipExt.ICON_IMG_URI:require('@/assets/img/@profile_user.png'))
              }
            }
          }
        }

        if(this.SCH_KEY && this.SCH_KEYWORD){
          let arrNewCusl = [];
          for(let stat of arrCusl){
            if(stat.CUSL_ID){
              arrNewCusl.push(stat);
            }
          }
          this.gridItems = arrNewCusl; //상담지원별 목록
        }else{
          this.gridItems = arrCusl; //상담지원별 목록
        }

      },

      getSelectedText() {
        // 선택된 value에 해당하는 text 값을 가져옵니다.
        const selectedItem = this.ctiStatList.find(item => item.value === this.SCH_CTI_STAT_TP.text);
        if(selectedItem) this.SCH_CTI_STAT_TP_TXT = selectedItem.text;
        else this.SCH_CTI_STAT_TP_TXT = '';

        // console.log(this.SCH_CTI_STAT_TP_TXT);
      },

      //조회 이벤트
      schIpExtList() {
        this.gridItems = [];
        this.getIpExtList();
      },

      //조회 이벤트
      schGetCtcList() {
        this.gridItems2 = [];
        this.getCtcList();
      },

      //상담사 선택
      selectCusl(item) {
        this.TRAN_INLNE_NO = item.EXT_NO; //2자 호전환 번호
        this.CONF_INLNE_NO = item.EXT_NO; //3자 호전환 번호

        this.TRAN_USER_NM = item.USER_NM; //2자 호전환 대상 이름
        this.CONF_USER_NM = item.USER_NM; //3자 호전환 대상 이름

        this.DataProp.TRAN_INLNE_NO = this.TRAN_INLNE_NO; //2자 내선번호
        this.DataProp.CONF_INLNE_NO = this.CONF_INLNE_NO; //3자 내선번호
      },

      //외부호전환 대상 선택
      selectCtc(item) {
        this.TRAN_INLNE_NO = item.TELNO; //2자 호전환 번호
        this.CONF_INLNE_NO = item.TELNO; //3자 호전환 번호
        
        this.TRAN_USER_NM = item.TASK_NM; //2자 호전환 대상 이름
        this.CONF_USER_NM = item.TASK_NM; //3자 호전환 대상 이름

        this.DataProp.TRAN_INLNE_NO = this.TRAN_INLNE_NO; //2자 내선번호
        this.DataProp.CONF_INLNE_NO = this.CONF_INLNE_NO; //3자 내선번호
      },

      //호전환 시도
      btnCtiPhoneTran() {
        let inlneNo = "";
        let inlneNoLen = 0;

        inlneNo = this.TRAN_INLNE_NO.replace(/[^0-9]/g, "");
        inlneNoLen = inlneNo.length;

        if (inlneNoLen == 4 || inlneNoLen > 7) {
          this.DataProp.TRAN_INLNE_NO = inlneNo;
        } else {
          this.showAlert(this.MESSAGE.ALERT.PHN_NO_CHECK2);
          return;
        }
      },

      //3자 시도
      btnCtiPhoneConf() {

        let inlneNo    = "";
        let inlneNoLen = 0;

        inlneNo = this.CONF_INLNE_NO;
        inlneNoLen = inlneNo.length;

        if (inlneNoLen == 4 || inlneNoLen > 7) {
          this.DataProp.CONF_INLNE_NO = inlneNo;
        } else {
          this.showAlert(this.MESSAGE.ALERT.PHN_NO_CHECK3);
          return;
        }
      },

      setPhoneNo(val, gb){
        let res = this.mixin_setPhoneNo(val.replace(/[^0-9]/g, ""));
        if(gb === 2) this.TRAN_INLNE_NO = res;
        else if(gb === 3) this.CONF_INLNE_NO = res;
      },

      // 연락처정보 조회
      async getCtcList(){

        let URLData = '/api/setting/system/ctc/selectCtc';
        let postParam = {
          SCH_KEY : this.CTC_SCH_KEY
          , SCH_KEYWORD : this.CTC_SCH_KEY==='TELNO'?this.SCH_KEYWORD.replace(/[^0-9]/g, ""):this.SCH_KEYWORD
          , PHN_TRAN_TRGT_YN : 'Y'
        }
        let headParam = {
          head : {
          }
        }

        let response = await this.common_postCall(URLData, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG) {
          for(let i=0; i<response.DATA.length; i++){
            response.DATA[i].TELNO = this.mixin_setPhoneNo(response.DATA[i].TELNO.replace(/[^0-9]/g, ""));
          }

          this.gridItems2 = response.DATA;
        }
      },

    },

  }
  </script>

  <style lang="scss" scoped>

  </style>