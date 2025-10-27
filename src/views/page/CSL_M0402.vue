<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                조회 기간
              </span>
              <div class="pl-desc">
<!--                <div class="pl-calendar-range-form">-->
<!--                  <compo-date-picker-->
<!--                    DateType="dateInput"-->
<!--                    :DateProp.sync="startDate"/>-->
<!--                  <span class="pl-unit">~</span>-->
<!--                  <compo-date-picker-->
<!--                    DateType="dateInput"-->
<!--                    :DateProp.sync="endDate"/>-->
<!--                  <compo-drop-picker-->
<!--                    :StartDateProp.sync="startDate"-->
<!--                    :EndDateProp.sync="endDate"-->
<!--                  />-->
<!--                </div>-->
                <compo-date-range-picker
                    :StartDayProp.sync="startDate"
                    :EndDayProp.sync="endDate"
                    @startDayChange="mixin_testLog(startDate)"
                    @endDayChange="mixin_testLog(endDate)"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                처리 상태
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(this.COMMON_CODE,'CUSL_RS','전체')"
                  placeholder="선택하세요"
                  v-model="SRCH_PARAM.CUSL_RS_CD"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">결과</span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(this.COMMON_CODE,'CAMP_RS','전체')"
                  v-model="SRCH_PARAM.CAMP_RS_CD"
                  placeholder="선택하세요"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                <v-select
                  v-model="SRCH_PARAM.USER_SRCH"
                  class="pl-form"
                  :items="mixin_common_code_get(this.COMMON_CODE,'USER_SRCH')"
                ></v-select>
              </span>
              <div class="pl-desc">
                <v-text-field
                class="pl-form is-lg"
                placeholder="검색어 입력"
                v-model="SRCH_PARAM.INPUT_TEXT"
                @keyup.enter="getClbkList"/>
              </div>
            </div>
            <v-btn class="pl-btn is-icon"
            @click="getClbkList"
            >
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body">
        <div class="pl-grid-top">
          <div class="pl-grid-top-left">
            <v-btn class="pl-btn is-icon is-sub" @click="[getCuslDstList(), mixin_showDialog('Callback')]">
              <span class="pl-icon20 document"></span>
              콜백 배분
            </v-btn>
          <!--
          <v-btn
            class="pl-btn is-icon is-sub"

            >
              <span class="pl-icon20 document"></span>
              완료처리
            </v-btn>
          -->
            <v-btn
            class="pl-btn is-icon is-sub"
            @click="rtrvlClbkValidate"
            :disabled="CHK_CLBK_ITEM.length != 0 ? false : true">
              <span class="pl-icon20 document"></span>
              회수
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ CLBK_LIST_ITEMS.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
              TypeProp="Download"
              :DownReason=true
              :DataHeaderProp="CLBK_LIST_HEADER"
              :DataBodyProp="CLBK_LIST_ITEMS"
              :FileNameProp="'콜백관리 다운로드_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
              SheetNameProp="콜백관리 다운로드"
              HeaderColorProp="00B0F0"
            ></compo-excel>
          </div>
        </div>
        <v-data-table
          class="pl-grid has-control"
          show-select
          :headers="CLBK_LIST_HEADER"
          :items="CLBK_LIST_ITEMS"
          fixed-header
          item-key="idx"
          height="562px"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
          :page.sync="page"
          @page-count="pageCount = $event"
          v-model="CHK_CLBK_ITEM"
          no-data-text="등록된 데이터가 없습니다."
          >
          <template v-slot:item.CUST_NM="{ item }">
            {{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(item.CUST_NM) : item.CUST_NM }}
          </template>
          <template v-slot:item.CLBK_PHN_NO="{ item }">
            {{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(item.CLBK_PHN_NO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(item.CLBK_PHN_NO.replace(/[^0-9]/g, "")) }}
          </template>
          <template v-slot:item.SNDPTY_NO="{ item }">
            {{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(item.SNDPTY_NO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(item.SNDPTY_NO.replace(/[^0-9]/g, "")) }}
          </template>
          <template v-for="header in CLBK_LIST_HEADER" v-slot:[`item.${CLBK_LIST_HEADER.value}`]="{ item }">
              {{ item[header.value] || '-' }}
          </template>
          <template v-slot:item.CUSL_RS_NM="{ item }" >
            <!-- <span :class="item.CUSL_RS_NM == '처리완료' ? 'is-txt-main' : 'is-txt-error'">
              {{ item.CUSL_RS_NM }}
            </span> -->
            <span
              v-if="item.CUSL_RS_NM !== '-'"
              :class="`pl-round-chip is-sm chat-stat-${item.CUSL_RS_NM == '처리완료' ? 'done' : 'cs'}`">
              {{ item.CUSL_RS_NM }}
            </span>
          </template>
        </v-data-table>
        <div class="pl-pager">
          <div class="pl-pager-row">
            <span>페이지당 항목 수</span>
            <v-select
              class="pl-form"
              :value="ROW_PER_PAGE"
              :items="perPage"
              :item-text="toString(ROW_PER_PAGE)"
              @change="ROW_PER_PAGE = parseInt($event, 10);"
            ></v-select>
          </div>
          <v-pagination
            v-model="page"
            :length="pageCount"
            circle
            :total-visible="7">
          </v-pagination>

          <span class="pl-pager-period">
            보기 {{ mixin_getPagePeriod(CLBK_LIST_ITEMS, page) }} / {{ CLBK_LIST_ITEMS.length }}
              <compo-tooltip-btn
                TitleProp="다음 검색"
                ClassProp="pl-tooltip-btn is-line"
                IconProp="pl-icon20 arrow-next-paging"
                TooltipPositionProp="bottom"
                :DisabledProp = "nextDisabled"
                @btnClick="getClbkList('next')"
              ></compo-tooltip-btn>
          </span>
        </div>
      </div>
    </div>
    <!-- dialog -->
    <v-dialog
      v-model="dialogCallback"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="콜백 배분"
        @hide="mixin_hideDialog('Callback')"
      >
        <template slot="body">
          <div class="pl-search-form">
            <div class="pl-form-inline-wrap">
              <div class="pl-form-inline">
                <span class="pl-label">
                  조회기간
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
<!--                  <div class="pl-calendar-range-form">-->
<!--                    <compo-date-picker-->
<!--                      DateType="dateInput"-->
<!--                      :DateProp.sync="startDate2"/>-->
<!--                    <span class="pl-unit">~</span>-->
<!--                    <compo-date-picker-->
<!--                      DateType="dateInput"-->
<!--                      :DateProp.sync="endDate2"/>-->
<!--                    <compo-drop-picker-->
<!--                      :StartDateProp.sync="startDate2"-->
<!--                      :EndDateProp.sync="endDate2"-->
<!--                    />-->
<!--                  </div>-->
                  <compo-date-range-picker
                      :StartDayProp.sync="startDate2"
                      :EndDayProp.sync="endDate2"
                      @startDayChange="mixin_testLog(startDate2)"
                      @endDayChange="mixin_testLog(endDate2)"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  <v-select
                    class="pl-form"
                    v-model="SRCH_PARAM2.USER_SRCH"
                    :items="mixin_common_code_get(this.COMMON_CODE,'USER_SRCH')"
                  ></v-select>
                </span>
                <div class="pl-desc">
                  <v-text-field
                  class="pl-form is-lg"
                  placeholder="검색어 입력"
                  v-model="SRCH_PARAM2.INPUT_TEXT"/>
                </div>
              </div>
              <v-btn
              class="pl-btn is-icon"
              @click="srchAltmntList">
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
            </div>
          </div>
          <!-- grid -->
          <div class="pl-grid-top">
            <div class="pl-grid-top-left">
              <v-btn
                  class="pl-btn is-icon is-sub"
                  @click="[clearChkCusl()]"
                  :disabled="CHK_CUSL_ITEM.length === 0">
                <span class="pl-icon20 reset"></span>
<!--                  ,getCuslDstList()-->
                초기화
              </v-btn>
              <v-btn
                  class="pl-btn is-icon is-sub"
                  @click="equalDst"
                  :disabled="CHK_CUSL_ITEM.length === 0"
              >
                <span class="pl-icon20 callback-equal-divide"></span>
                균등배분
              </v-btn>
              <v-btn
                  class="pl-btn is-icon is-sub"
                  @click="registYn"
                  :disabled="CHK_CUSL_ITEM.length === 0"
              >
                <span class="pl-icon20 callback-divide"></span>
                배분
              </v-btn>
            </div>
            <div class="pl-grid-top-utils">
              <span v-for="item in CALLBACK_COUNT" :key="item.id" class="pl-round-chip">
                {{ item.text }} <strong>{{ item.count }}</strong>
              </span>
            </div>
          </div>
          <v-data-table
            class="pl-grid has-control"
            :headers="headersCallback"
            :items="CUSL_DST_LIST"
            v-model="CHK_CUSL_ITEM"
            show-select
            fixed-header
            item-key="ROW_NUMBER"
            height="350px"
            :items-per-page="-1"
            hide-default-footer
            :page.sync="page2"
            no-data-text="등록된 데이터가 없습니다."
            @page-count="pageCount2 = $event">
              <template v-slot:[`item.CHG_CNT`]="{ item }">
                <v-text-field
                    class="pl-form"
                    name="name"
                    hide-details
                    v-model="item.CHG_CNT"
                    type="number"
                    min="0"
                    max="99"
                    :disabled="CHK_CUSL_ITEM.length === 0"
                    @input="getData"
                ></v-text-field>
<!--                    :disabled="CHK_CUSL_ITEM.length === 0"-->
<!--                    placeholder="0"-->
                   <!--  @blur="checkNum(item)"
                    @change="changeDivEditCol(item)" -->
              </template>
          </v-data-table>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="[mixin_hideDialog('Callback'), clearChkCusl()]">닫기</v-btn>
          <!-- <v-btn class="pl-btn" @click="setSvrTime">선택</v-btn> -->
        </template>

      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
export default {
    name:"MENU_CSL_M0402", //name은 'MENU_' + 파일명 조합

 components: {

  },
 data() {
    return {
      // top search
      // currentTime:'',
      // startDate: '',
      // endDate: '',

      nowDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      startDate: this.$moment(this.nowDate).subtract(7,'days').format('YYYY-MM-DD'),
      endDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      startDate2: this.$moment(this.nowDate).subtract(7,'days').format('YYYY-MM-DD'),
      endDate2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      // dialog
      dialogCallback: false,


      headersCallback: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px', sortable: false },
        { text: '상담직원', value: 'CUSL_NM',  width: '150px' , sortable: true},
        { text: '상담직원 ID', value: 'CUSL_LGN_ID',width: '150px', sortable: false},
        { text: '배분 건수', value: 'AMT_CNT', align: 'center', width: '120px' , sortable: false},
        { text: '완료 건수', value: 'COMPLETED_CNT', align: 'center', width: '120px' , sortable: false},
        { text: '미시도 건수', value: 'NOT_TRY_CNT', align: 'center', width: '120px' , sortable: false},
        { text: '추가/회수', value: 'CHG_CNT', align: 'center', width: '120px' , sortable: false},
      ],

      CUSL_DST_LIST: [],

      CALLBACK_COUNT: [
        { text: '총 건수', key:  'TOT_CNT'},
        { text: '배분 건수', key:  'AMT_CNT'},
        { text: '미배분 건수', key:  'NOT_AMT_CNT' },
        { text: '완료 건수', key:  'COMPLETED_CNT' },
        { text: '미시도 건수', key:  'NOT_END_CNT'},
      ],
      CNT_DATA : [],

      // grid
      page: 1,
      pageCount: 0,
      page2: 1,
      pageCount2: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,

      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      },

      nextDisabled: false,
      CLBK_LIST_HEADER: [
        { text: '번호', value: 'idx', width: '50px' ,sortable : false },
        { text: '인입일시', value: 'DRWI_DT', width: '120px' },
        { text: '고객명', value: 'CUST_NM', width: '120px', sortable : false},
        { text: '발신번호', value: 'SNDPTY_NO', width: '120px',sortable : false },
        { text: '콜백전화번호', value: 'CLBK_PHN_NO', width: '120px',sortable : false },
        { text: '배분일시', value: 'ALTMNT_DT', width: '120px',sortable : false },
        { text: '상담직원', value: 'CUSL_NM', width: '120px', sortable : false},
        { text: '내선번호', value: 'EXT_NO', width: '100px', sortable : false},
        { text: '시도건수', value: 'RTRY_NOCS', width: '100px', sortable : false, align : 'center'},
        { text: '처리 상태', value: 'CUSL_RS_NM', width: '100px', sortable : false},
        { text: '결과', value: 'CAMP_RS_NM', width: '100px', sortable : false},
        { text: '상담일', value: 'CUSL_DT', width: '120px',sortable : false },
      ],
      CLBK_LIST_ITEMS:[],
      CHK_CLBK_ITEM : [],

      // CUSL_DST_LIST : [],


      items: [
        {
          index: 1,
          type: '공통',
          subject: '취소수수료를 환불해 주세요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          status: 'ing'
        },
        {
          index: 2,
          type: '공통',
          subject: '취소수수료를 환불해 주세요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          status: 'done'
        },
      ],

      COMMON_CODE:[],


      SRCH_PARAM : {
        CUSL_RS_CD : '',
        CAMP_RS_CD : '',
        USER_SRCH : 'USER_NM',
        INPUT_TEXT : '',
      },
      SRCH_PARAM2 : {
        CUSL_RS_CD : '',
        CAMP_RS_CD : '',
        USER_SRCH : 'USER_NM',
        INPUT_TEXT : '',
      },

      MESSAGE : {
        CONFIRM : {
          RTRVL_CLBK : { alertDialogToggle : true, msg : '선택한 콜백을 회수 하시겠습니까?', iconClass:'is-info', type :'confirm', callYes: this.rtrvlClbk, callNo:this.closeMsg},
          REG_CLBK : { alertDialogToggle : true, msg : '선택한 상담사에게 배분 하시겠습니까?', iconClass:'is-info', type :'confirm', callYes: this.registClbk, callNo:this.closeMsg},
        },
        ALERT : {
          RTRY_NOCS_OVER : {alertDialogToggle : true, msg:'시도 건수가 없는 항목만 <br/> 회수 할 수 있습니다.',iconClass: 'is-caution', type:'default'},
          NOT_ALTMNT : {alertDialogToggle : true, msg:'배분되지 않은 콜백은 회수 할 수 없습니다.',iconClass: 'is-caution', type:'default'},
          ALTMNT_FULL : {alertDialogToggle : true, msg:'배분 가능한 콜백이 없습니다.',iconClass: 'is-caution', type:'default'},
          ALT_CNT_OVER : {alertDialogToggle : true, msg:'배분 가능한 건수를 초과 하였습니다.',iconClass: 'is-caution', type:'default'},
          NO_ALT_CNT : {alertDialogToggle : true, msg:'배분할 건수를 입력하세요.',iconClass: 'is-caution', type:'default'},
          CHECK_ITEM : {alertDialogToggle : true, msg:'회수할 항목을 선택하세요.',iconClass: 'is-caution', type:'default'},
          CHECK_CUSL : {alertDialogToggle : true, msg:'배분할 상담사를 선택하세요.',iconClass: 'is-caution', type:'default'},
          CHECK_ITEM_CMPTN : {alertDialogToggle : true, msg:'완료처리할 항목을 선택하세요.',iconClass: 'is-caution', type:'default'},
          SUCCESS : {alertDialogToggle : true, msg:'처리 되었습니다.',iconClass: 'is-done', type:'default'},
          END_DATE : {alertDialogToggle : true, msg:'조회기간이 유효하지 않습니다.',iconClass: 'is-done', type:'default'},

        },
        TOAST : {
          SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
        },
      },

      NOT_ATM_CNT : '9',

      CHK_CUSL_ITEM:[]









    }
  },

  watch: {
    endDate(){

      let start = this.replaceDate(this.startDate, 'start');
      let end = this.replaceDate(this.endDate, 'start');

      if(parseInt(start)>parseInt(end)){
        this.showAlert(this.MESSAGE.ALERT.END_DATE)
        this.initData();
      }
    },
    endDate2(){

      let start = this.replaceDate(this.startDate2, 'start');
      let end = this.replaceDate(this.endDate2, 'start');

      if(parseInt(start)>parseInt(end)){
        this.showAlert(this.MESSAGE.ALERT.END_DATE)
        this.initData();
      }
    }
  },

  computed: {

  },

  created() {

  },

  async mounted() {
    this.setTime();

     let codeName = ['CUSL_RS','CAMP_RS', 'USER_SRCH'];

    this.COMMON_CODE = await this.mixin_common_code_get_all(codeName);


    this.getClbkList();       // 콜백리스트 조회
    this.getClbkDstInfo();    // 콜백배분정보 조회 (cnt)
    this.getCuslDstList();    // 상담원 콜백 배분 정보

  },

  methods: {

    async setTime(){
      // this.currentTime = await this.mixin_getSvrDate("YYYY-MM-DD");


      this.startDate = this.$moment(this.nowDate).subtract(7,'days').format('YYYY-MM-DD'); // 조회 시작 일자(한달전)
      this.endDate = this.nowDate;

      this.startDate2 = this.$moment(this.nowDate).subtract(7,'days').format('YYYY-MM-DD'); // 조회 시작 일자(한달전)
      this.endDate2 = this.nowDate;

    },

    initData(){

      this.SRCH_PARAM.CUSL_RS_CD = '';
      this.SRCH_PARAM.CAMP_RS_CD = '';
      this.SRCH_PARAM.USER_SRCH = 'USER_NM';
      this.SRCH_PARAM.INPUT_TEXT = '';

      this.SRCH_PARAM2.CUSL_RS_CD = '';
      this.SRCH_PARAM2.CAMP_RS_CD = '';
      this.SRCH_PARAM2.USER_SRCH = 'USER_NM';
      this.SRCH_PARAM2.INPUT_TEXT = '';

      this.CHK_CLBK_ITEM =[];
      this.CHK_CUSL_ITEM =[];


    },

     async getClbkList(next){

       //다음버튼 클릭 유무
        if (next !== 'next'){
          this.CLBK_LIST_ITEMS = [];
          this.page = 1;              //페이징 처리 초기화
          this.pagination.page = 1;
          this.nextDisabled = true;   //버튼 비활성화
        }


      let sURL = 'phone-api/callback/manage/list';
      let postParam = {
        DRWI_DT_START : this.startDate.replace(/-/gi, '')+'000000',
        DRWI_DT_END : this.endDate.replace(/-/gi, '')+'235959',
        CUSL_RS_CD : this.SRCH_PARAM.CUSL_RS_CD,
        CAMP_RS_CD : this.SRCH_PARAM.CAMP_RS_CD,
        USER_NM: this.SRCH_PARAM.USER_SRCH === 'USER_NM'? this.SRCH_PARAM.INPUT_TEXT : '',
        LGN_ID : this.SRCH_PARAM.USER_SRCH === 'USER_ID'? this.SRCH_PARAM.INPUT_TEXT :'',

      };

       let headParam =  {
          head: {
            "ROW_CNT" : this.pagination.rowsPerPage,
            "PAGES_CNT" : this.pagination.page,
            "PAGING" : "Y",
          }
        }

      let response = await this.common_postCall(sURL,postParam, headParam);

      if(response.HEADER.ERROR_FLAG){
        this.showAlert(this.MESSAGE.ERROR)
      }else if(response.DATA.length > 0){
        let i = 0;
        let idx = this.CLBK_LIST_ITEMS.length + 1;

        let tempData = response.DATA;
        tempData.map(item =>{
          tempData[i]["idx"] = idx++;
          tempData[i]["CLBK_ID"] = response.DATA[i]["CLBK_ID"];
          tempData[i]["CUST_NM"] = this.mixin_isEmpty(response.DATA[i]["CUST_NM"])? '알수없음' : response.DATA[i]["CUST_NM"];
          tempData[i]["DRWI_DT"] = this.mixin_convertDate(response.DATA[i]["DRWI_DT"],'yyyy-MM-dd HH:mm:ss');
          tempData[i]["ALTMNT_DT"] = this.mixin_convertDate(response.DATA[i]["ALTMNT_DT"],'yyyy-MM-dd HH:mm:ss');
          tempData[i]["RTRY_NOCS"] = (response.DATA[i]["RTRY_NOCS"] === '0' || this.mixin_isEmpty(response.DATA[i]["RTRY_NOCS"])) ? '-': response.DATA[i]["RTRY_NOCS"] + '차';

          tempData[i]["CLBK_PHN_NO"] = this.mixin_setPhoneNo(response.DATA[i]["CLBK_PHN_NO"]);
          tempData[i]["SNDPTY_NO"] = this.mixin_setPhoneNo(response.DATA[i]["SNDPTY_NO"]);

          tempData[i]["CAMP_RS_NM"] = this.mixin_isEmpty(response.DATA[i]["CAMP_RS_NM"])? '-': response.DATA[i]["CAMP_RS_NM"];
          tempData[i]["EXT_NO"] = this.mixin_isEmpty(response.DATA[i]["EXT_NO"])? '-': response.DATA[i]["EXT_NO"];
          tempData[i]["CUSL_RS_NM"] = this.mixin_isEmpty(response.DATA[i]["CUSL_RS_NM"])? '-': response.DATA[i]["CUSL_RS_NM"];
          tempData[i]["CUSL_DT"] = this.mixin_isEmpty(response.DATA[i]["CUSL_DT"])? '-': this.mixin_convertDate(response.DATA[i]["CUSL_DT"],'yyyy-MM-dd HH:mm:ss');
        i++
        });

        this.CLBK_LIST_ITEMS = [ ...this.CLBK_LIST_ITEMS, ...tempData]

        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false;
          }else{
            this.nextDisabled = true;
        }
      }
       //이부분은 체크해볼것
      this.pagination.page += 1;
      // this.page=1;
      }
    },

    /* 날짜포맷 -> YYYYMMDD24MISS */

    replaceDate(date, se){

      let removeCaret;

      removeCaret = date.replace('-','').replace("-",'').replace(' ','').replace(':','');

        if(se === 'start'){

            if(removeCaret.length < 9){
              return removeCaret + "000000";
            }else if(removeCaret.length < 11){
              return removeCaret + "0000";
            }else if(removeCaret.length < 13){
              return removeCaret + "00";
            }
            return removeCaret;

        }else{

            if(removeCaret.length < 9){
              return removeCaret + "235959";
            }else if(removeCaret.length < 11){
              return removeCaret + "5959";
            }else if(removeCaret.length < 13){
              return removeCaret + "59";
            }
            return removeCaret;

        }
    },

    /* 콜백 회수 RTRVL Retieeval */
    rtrvlClbkValidate(){

      if(this.mixin_isEmpty(this.CHK_CLBK_ITEM)){

        this.showAlert(this.MESSAGE.ALERT.CHECK_ITEM);

      }else{
        let rtry_nocs_chk = [];
        let altmnt_yn = 0;
        for(let i in this.CHK_CLBK_ITEM){
          if(this.CHK_CLBK_ITEM[i].RTRY_NOCS !== '-'){
            let obj ={
              CLBK_ID : this.CHK_CLBK_ITEM[i].CLBK_ID
              };
                rtry_nocs_chk.push(obj);
            }else if(this.CHK_CLBK_ITEM[i].ALTMNT_DT.length < 14){
              altmnt_yn = 1+i;
            }
          }
          if(rtry_nocs_chk.length > 0){
            this.showAlert(this.MESSAGE.ALERT.RTRY_NOCS_OVER)
          }else if(altmnt_yn !== 0){
            this.showAlert(this.MESSAGE.ALERT.NOT_ALTMNT)
            this.CHK_CLBK_ITEM = [];
          }else{
              this.showAlert(this.MESSAGE.CONFIRM.RTRVL_CLBK)
          }
      }
    },

    async rtrvlClbk(){
      let sURL = 'phone-api/callback/manage/delete';

      let arrClbkId = [];

      for(let i in this.CHK_CLBK_ITEM){
        arrClbkId.push(this.CHK_CLBK_ITEM[i].CLBK_ID);
      }
      let postParam = {
        CLBK_ALTMNT_INFO : this.CHK_CLBK_ITEM,
      };

      let headParam = {
        head: {
            DATA_OBJECT : "CLBK_ALTMNT_INFO",
        }
      };

      let response = await this.common_postCall(sURL, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG){
        // this.showAlert(this.MESSAGE.ALERT.SUCCESS)
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.initData();
        this.srchAltmntList();
        this.getClbkList();
        this.closeMsg();
      }
    },



    // /* 콜백 완료처리 CMPTN */
    // setCmptnValidate(){
    //   if(this.mixin_isEmpty(this.CHK_CLBK_ITEM)){
    //     this.showAlert(this.MESSAGE.ALERT.CHECK_ITEM_CMPTN);
    //   }else{
    //     this.showAlert(this.MESSAGE.CONFIRM.SET_CMPTN);
    //   }
    // },

    // async setCmptn(){

    //   let sURL = '/phone-api/callback/manage/modify';
    //   let postParam ={
    //     CLBK_SET_CMPTN : this.CHK_CLBK_ITEM,
    //   };
    //   let headParam = {
    //     head : {
    //       DATA_OBJECT : "CLBK_SET_CMPTN",
    //     }
    //   }

    //   let response = await this.common_postCall(sURL, postParam, headParam);

    //   if(!response.HEADER.ERROR_FLAG){
    //     this.showAlert(this.MESSAGE.ALERT.SUCCESS)
    //     this.initData();
    //     this.getClbkList();
    //   }

    // },

    /* 콜백배분정보조회 */

    async getClbkDstInfo(){

       this.CALLBACK_COUNT= [
        { text: '총 건수', key:  'TOT_CNT'},
        { text: '배분 건수', key:  'AMT_CNT'},
        { text: '미배분 건수', key:  'NOT_AMT_CNT' },
        { text: '완료 건수', key:  'COMPLETED_CNT' },
        { text: '미시도 건수', key:  'NOT_TRY_CNT'},
      ];


      let sURL = 'phone-api/callback/manage/callback-dstb/inqire';
      let postParam = {
        DRWI_DT_START : this.startDate2.replace(/-/gi, '')+'000000',
        DRWI_DT_END : this.endDate2.replace(/-/gi, '')+'235959',
      };
      let headParam = {
        head:{},
      };

      let response = await this.common_postCall(sURL, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG){

      let keys = Object.keys(response.DATA[0])

        /* 키값 순회하면서 keys가 같은 obj에 value를 삽입 */
          for(let i in keys){
            for( let j in keys){
              if(this.CALLBACK_COUNT[i].key == keys[j]){
                this.CALLBACK_COUNT[i]["count"] =
                      this.mixin_isEmpty( response.DATA[0][keys[j]])? '0': response.DATA[0][keys[j]]
              }
            }
          }
      }
      this.CNT_DATA = response.DATA[0];

    },
    srchAltmntList(){
      this.clearChkCusl();
      this.getClbkDstInfo();
      this.getCuslDstList();
    },
    /* 콜백상담원 배분정보 */
    async getCuslDstList(){

      this.CUSL_DST_LIST =[];
      let sURL = 'phone-api/callback/manage/agent-dstb/inqire';
      let postParam = {
        USER_NM: this.SRCH_PARAM2.USER_SRCH === 'USER_NM'? this.SRCH_PARAM2.INPUT_TEXT : '',
        LGN_ID : this.SRCH_PARAM2.USER_SRCH === 'USER_ID'? this.SRCH_PARAM2.INPUT_TEXT :'',
      };
      let headParam = {
        head:{}
      };

      let response = await this.common_postCall(sURL, postParam, headParam);

        let tempData = response.DATA;
      if(!response.HEADER.ERROR_FLAG){
        for(let i =0; i<tempData.length; i++){
          this.CUSL_DST_LIST.push({
            ROW_NUMBER : tempData[i].ROW_NUMBER,
            CUSL_NM : tempData[i].CUSL_NM,
            CUSL_LGN_ID : tempData[i].CUSL_LGN_ID,
            CUSL_ID : tempData[i].CUSL_ID,
            AMT_CNT : this.mixin_isEmpty(tempData[i].AMT_CNT)? '0':tempData[i].AMT_CNT,
            COMPLETED_CNT : this.mixin_isEmpty(tempData[i].COMPLETED_CNT)? '0': tempData[i].COMPLETED_CNT,
            NOT_TRY_CNT :  this.mixin_isEmpty(tempData[i].NOT_TRY_CNT)? '0':  tempData[i].NOT_TRY_CNT,
            CHG_CNT : 0,
          });

        }
      }
    },

    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },


    equalDst(){
      let selectedItem = this.CHK_CUSL_ITEM;
      let chkItemCnt = selectedItem.length;

      if(this.mixin_isEmpty(this.CHK_CUSL_ITEM)) this.showAlert(this.MESSAGE.ALERT.CHECK_CUSL);
      let altmnt_cnt = parseInt(this.CNT_DATA.NOT_AMT_CNT);

      if(this.CNT_DATA.NOT_ATM_CNT <= 0){
        this.showAlert(this.MESSAGE.ALERT.ALTMNT_FULL);
        this.clearChkCusl();
        this.getCuslDstList();
      }

      let divNum = Math.floor(altmnt_cnt/chkItemCnt);

      let rmdCnt = altmnt_cnt % chkItemCnt;

      for(let i = 0 ; i < chkItemCnt; i++){
        selectedItem[i]["CHG_CNT"] = 0;
         if (divNum > 0) {
          selectedItem[i]["CHG_CNT"] = divNum;
        }
      }

      for (var j = 0; j < chkItemCnt; j++) {
        if (rmdCnt > 0) {
          rmdCnt--;
          selectedItem[j]["CHG_CNT"] = selectedItem[j]["CHG_CNT"] + 1;
        }
      }

    },
      getData() {
      let totChgCnt = 0;
      //selected 초기화
      this.CHK_CUSL_ITEM = [];

      //추가/회수 에 값이 들어간 경우, selected
      for (let i in this.CUSL_DST_LIST) {
        if (this.CUSL_DST_LIST[i]["CHG_CNT"] != 0) {
          this.CHK_CUSL_ITEM.push(this.CUSL_DST_LIST[i]);
        }
      }
      for (let i = 0; i < this.CHK_CUSL_ITEM.length; i++) {
        totChgCnt += Number(this.CHK_CUSL_ITEM[i].CHG_CNT);
      }
      // return totChgCnt;
    },
    registYn(){

      let cnt = 0;
      let i = 0

      while(i < this.CHK_CUSL_ITEM.length){
        let num = this.CHK_CUSL_ITEM[i].CHG_CNT
        cnt += parseInt(num);
        i++
      }

      let NOT_AMT_CNT = 0;



      let foundCNT = this.CALLBACK_COUNT.find(obj => obj.key === "NOT_AMT_CNT");

      if (foundCNT) {
        NOT_AMT_CNT = foundCNT.count;
      }



      if(cnt > NOT_AMT_CNT){
        this.showAlert(this.MESSAGE.ALERT.ALT_CNT_OVER);
      }else if(cnt === 0 ){
        this.showAlert(this.MESSAGE.ALERT.NO_ALT_CNT);
      }else{
        this.showAlert(this.MESSAGE.CONFIRM.REG_CLBK);
      }
    },

    async registClbk(){
      //배분 진행


      let totCnt = this.CUSL_DST_LIST.length; //사용자배분 리스트의 전체row
      let selectedDataObj = this.CHK_CUSL_ITEM; //userListSelected (체크된 데이터)
      let data = "";
      for (let i = 0; i < selectedDataObj.length; i++) {
        let num = Number(selectedDataObj[i]["CHG_CNT"]);
        if (num > 0) {
          data += selectedDataObj[i]["CUSL_ID"] + ":" + num + "/";
        }
      }

      let sURL = '/phone-api/callback/manage/regist';
      let postParam ={
        ALTMNT_INFO : data.substring(0, data.length -1),
        START_DATE : this.startDate2.replace(/-/gi, '')+'000000',
        DRWI_DT_START : this.startDate2.replace(/-/gi, '')+'000000',
        DRWI_DT_END : this.endDate2.replace(/-/gi, '')+'235959',
      }
      let  headParam = {
        head : {}
      }

    let response = await this.common_postCall(sURL,postParam, headParam);

    if(!response.HEADER.ERROR_FLAG){
      // this.showAlert(this.MESSAGE.ALERT.SUCCESS);
      this.showToast(this.MESSAGE.TOAST.SUCCESS);
      this.initData();
      this.getClbkDstInfo();
      this.clearChkCusl();
      this.getCuslDstList();
      this.getClbkList();
      this.closeMsg();
    }


    },

    clearChkCusl(){

      //상담원배분팝업 > 초기화 버튼
      // this.CUSL_DST_LIST = [];
      //선택된 row해제
      let len = this.CHK_CUSL_ITEM.length

      for (let i = 0; i < this.CHK_CUSL_ITEM.length; i++){
        this.CHK_CUSL_ITEM[i].CHG_CNT = 0;
      }
      this.CHK_CUSL_ITEM = [];
    },

  },
}
</script>

<style lang="scss" scoped>

</style>