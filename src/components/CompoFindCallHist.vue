<template>
  <div>
    <!-- search form -->
    <div class="pl-search-form">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            조회 기간
            <v-icon class="pl-icon20 required"></v-icon>
          </span>
          <div class="pl-desc">
            <div class="pl-calendar-range-form">
              <compo-date-range-picker
                :StartDayProp.sync="SCH_ST_TIME"
                :EndDayProp.sync="SCH_END_TIME"
                @startDayChange="mixin_testLog(SCH_ST_TIME)"
                @endDayChange="mixin_testLog(SCH_END_TIME)"
              />
            </div>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            고객 전화 번호
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="CUST_PHN_NO"
              class="pl-form is-sx"
              value=""
              placeholder="검색어 입력"
              @keyup.enter="getCallList()"/>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            상담원명
          </span>
          <div class="pl-desc">
            <v-autocomplete
              v-model="INLNE_NO"
              class="pl-form is-sx"
              :items="cuslItems"
              placeholder="선택해 주세요."
              @keyup.enter="getCallList()"/>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            발신구분
          </span>
          <div class="pl-desc">
            <v-select
              v-model="SCH_INOUT"
              class="pl-form"
              :items="INOUT_LIST"
              placeholder="선택하세요"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <v-btn class="pl-btn is-icon" @click="getCallList()">
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
        </div>
      </div>
      <div class="is-right">
        전체 <strong>({{ gridDataText.length }})건</strong>
      </div>
    </div>
    <!-- grid -->
    <v-data-table
      class="pl-grid has-control"
      :headers="gridDataHeaders"
      :items="gridDataText"
      :item-class="isActiveRow"
      fixed-header
      item-key="ROW_NUMBER"
      height="560px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      :page.sync="page"
      @page-count="pageCount = $event"
      @dblclick:row="rowDblClick"
      @click:row="rowClick"
      no-data-text="등록된 데이터가 없습니다."
    >
    <template v-slot:item.cid="{ item }">
      {{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(item.cid.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(item.cid.replace(/[^0-9]/g, "")) }}
    </template>
    <template v-slot:item.rec_file_name="{ item }">
      <template v-if="$store.getters['userStore/GE_USER_ROLE'].atrtGroupId !== '6'"><!-- 상담사가 아닌 경우-->
      <!-- <template v-if="$store.getters['userStore/GE_USER_ROLE'].userId === '1'"> -->
        <v-btn
          class="pl-btn is-sm is-sub"
          :disabled="!item.rec_file_name"
          @click="showRecDialog(item)"
          >
          {{ item.rec_file_name ? '듣기' : '파일없음' }}
        </v-btn>
      </template>
      <template v-else><!-- 상담사인 경우 -->
        <template v-if="mixin_getCustcoSetting('ENV_AUDIO_PLAY_PERM_YN')"><!-- 다른 상담사 녹취 재생 권한이 있는 경우-->
          <v-btn
            class="pl-btn is-sm is-sub"
            :disabled="!item.rec_file_name"
            @click="showRecDialog(item)"
            >
            {{ item.rec_file_name ? '듣기' : '파일없음' }}
          </v-btn>
        </template>
        <template v-else><!-- 다른 상담사 녹취 재생 권한이 없는 경우-->
          <template v-if="$store.getters['userStore/GE_USER_ROLE'].EXT_NO === item.ext"><!-- 내 상담 녹취만 재생 가능-->
            <v-btn
              class="pl-btn is-sm is-sub"
              :disabled="!item.rec_file_name"
              @click="showRecDialog(item)"
              >
              {{ item.rec_file_name ? '듣기' : '파일없음' }}
            </v-btn>
          </template>
          <template v-else>
            <v-btn
              class="pl-btn is-sm is-sub"
              :disabled="true"
              >
              {{ item.rec_file_name ? '권한없음' : '파일없음' }}
            </v-btn>
          </template>
        </template>
      </template>
    </template>
    </v-data-table>
    <!-- <div class="pl-pager">
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
        보기 {{ mixin_getPagePeriod(gridDataText, page) }} / {{ gridDataText.length }}
          <compo-tooltip-btn
            TitleProp="다음 검색"
            ClassProp="pl-tooltip-btn is-line"
            IconProp="pl-icon20 arrow-next-paging"
            TooltipPositionProp="bottom"
            :DisabledProp = "nextDisabled"
            @btnClick="getCallList()"
          ></compo-tooltip-btn>
      </span>
    </div> -->
    <!-- 녹취파일 modal -->
          <compo-audio
              v-model="dialogListenVoice"
              :audioProp="this.REC_TEMP_DATA"
              AudioType="whole"
          />

  </div>
</template>

<script>
import { callUtil } from "@/store/callUtil.js";

  export default {
    name: 'CompoFindCallHist',
    props: {
      ST_TIME: {
        type: String,
        default: '',
      },
      END_TIME: {
        type: String,
        default: '',
      },
      INOUT: {
        type: String,
        default: 'CVS',
      },
    },
    data() {
      return {

        perPage: [15,30,50,100],  //그리드 페이지당 표시항목
        ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때

        pagination: {
          page: 1,
          rowsPerPage: 50,
          sortBy: "",
          descending: ""
        }, //그리드 페이지속성정의

        gridDataHeaders: [
          { text: "번호", value: "ROW_NUMBER", align: "center", width: "30px", sortable: false, },
          { text: "발신구분", value: "divinout", align: "center", sortable: false, width: "100px", },
          { text: "콜결과", value: "divcall", align: "center", sortable: false, width: "100px", },
          { text: "고객전화번호", value: "cid", align: "center", sortable: false, width: "140px", },
          // { text: "상담요청일시", value: "agtreq", align: "center", sortable: false, width: "150px", },
          // { text: "통화시작일시", value: "timestart", align: "center", sortable: false, width: "150px", },
          { text: "통화시작일시", value: "cuttStTime", align: "center", sortable: false, width: "150px", },
          { text: "통화종료일시", value: "cuttEndTime", align: "center", sortable: false, width: "150px", },
          // { text: "통화시간", value: "timeuse", align: "center", sortable: false, width: "100px", },
          // { text: "상담시작", value: "", align: "center", sortable: false, width: "150px", },
          { text: "상담시간", value: "agtuse", align: "center", sortable: false, width: "100px", },
          // { text: "내선번호", value: "ext", align: "center", sortable: false, width: "100px", },
          { text: "상담원명(내선번호)", value: "agtname", align: "center", sortable: false, width: "160px", },
          // { text: "대표번호(DID)", value: "tcode", align: "center", sortable: false, width: "150px", },
          // { text: "콜백번호", value: "cbnum", align: "center", sortable: false, width: "100px", },
          // { text: "ARS경로", value: "ars_nm", align: "center", sortable: false, width: "100px", },
          { text: "녹취파일", value: "rec_file_name", align: "center", sortable: false, width: "100px", },
        ],

        gridDataText: [],
        page: 1,
        pageCount: 0,

        REC_TEMP_DATA: {},

        searchInput : '',

        cuslItems : [], //상담원 목록

        nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼

        selectedRow : null,

        SCH_ST_TIME: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        SCH_END_TIME: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        SCH_INOUT : 'CVS',

        CUST_PHN_NO:'',
        INLNE_NO:'',
        CUST_NM:'',
        CUST_GROUP:'',
        INOUT_LIST:[
          { text: "전체", value: "", code: '' },
          { text: "수신", value: "IN", code: '1' },
          { text: "발신", value: "OUT", code: '2' },
          { text: "착신", value: "CVS", code: '3' },
        ],
        CALL_RESULT:'',
        CALL_RESULT_LIST:[
          { text: "전체", value: "" },
          { text: "상담", value: "1" },
          { text: "포기", value: "2" },
          { text: "콜백", value: "3" },
        ],

        dialogListenVoice : false, //녹음 파일 재생 dialog
        IPCC_SOCKET_URL : '', //IPCC Socket URL
        REC_FILE_NM : '',
        AudioSrc : '', //녹음 파일 경로
        //녹취 정지를 위한 요소
        audioElement: null,

        MESSAGE : {
          CONFIRM : {
          },
          ALERT : {
            ITEM_CHECK : {alertDialogToggle: true, msg: '콜 이력을 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
          },
          ERROR : {
            ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다. 잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
          }
        },

      }
    },

    watch :{
    },

    computed :{
    },

    beforeDestroy(){
      this.$eventBus.$off("ipccCallHistInit"); //eventBus 중복방지를 위해 off
      this.$eventBus.$off("setRecFileInfo"); //eventBus 중복방지를 위해 off
    },

    created() {
      //초기화
      this.$eventBus.$on("ipccCallHistInit", () => {
        this.Init();
      });

      this.$eventBus.$on("setRecFileInfo", () => {
        this.setRecFileInfo();
      });

      this.getCuslList();
      this.getCallList();
    },

    //공통코드 사용시 async-await 필수 (mixin_common_code_get_all함수로 공통코드 리스트를 가지고 오기 전에 mixin_common_code_get이벤트 발생)
    async mounted() {
      this.SCH_ST_TIME = this.ST_TIME;
      this.SCH_END_TIME = this.END_TIME;
      this.SCH_INOUT = this.INOUT;
    },

    methods: {

      Init(){
        this.cuslItems = [];
        this.selectedRow = null;
        this.gridDataText = [];
      },

      //상담원 목록
      async getCuslList() {
        this.cuslItems = [];
        // let overallStat = callUtil.ipcc('/api/palette_interface.php', {REQ : 'monitor_agent_list'}); //상담사 모니터링

        // let arrCusl = [];

        // if(overallStat != null){
        //   Object.keys(overallStat).forEach(function(v){
        //     if(v === '0' && overallStat[v]){
        //       Object.keys(overallStat[v]).forEach(function(k){
        //         let cuslObj = {};
        //         cuslObj.EXT_NO = k; //내선번호

        //         arrCusl.push(cuslObj);
        //       });
        //     }
        //   });
        // }

        let sUrl = '/api/setting/ipExt/extNotEmptyCuslList';
        let postParam = {
        }

        let headParam = {
          head : {
          }
        }

        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          if(response.DATA.length > 0){
            for(let ipExt of response.DATA){
              ipExt.text = ipExt.USER_NM + '(' + ipExt.EXT_NO + ')';
              ipExt.value = ipExt.EXT_NO;
            }

            this.cuslItems = response.DATA; //상담원 목록
          }
        }

      },

      getCallList(){
        if(!this.SCH_ST_TIME && !this.SCH_END_TIME){
          this.showAlert({ alertDialogToggle : true, msg : '조회 기간은 필수 입력 사항 입니다.', iconClass:'is-caution', type :'default'});
          return;
        }else{
          if(this.SCH_ST_TIME.replace(/[^0-9]/, '').substring(0, 6) != this.SCH_END_TIME.replace(/[^0-9]/, '').substring(0, 6)){
            this.showAlert({ alertDialogToggle : true, msg : '같은 월 내에서만 조회가 가능합니다.', iconClass:'is-caution', type :'default'});
            return;
          }
        }
        this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);

        this.selectedRow = null;
        this.gridDataText = [];

        let paramObj = {
          mode : 'list_call_log'
          , date_st : this.SCH_ST_TIME
          , date_ed : this.SCH_END_TIME
          , telno : this.CUST_PHN_NO
          , ext2 : this.INLNE_NO
          , inout: (this.SCH_INOUT === 'CVS'?'IN':this.SCH_INOUT)
          , divcall: '1' //상담으로 고정
        }

        let ipccCallHistList = callUtil.oldIpcc('/api/db_select.php', paramObj); //콜 이력
        ipccCallHistList = JSON.parse(JSON.stringify( ipccCallHistList ));

        if(ipccCallHistList){
          ipccCallHistList.forEach((data, idx) => {
            data.ROW_NUMBER = idx+1;
            let inoutTxt = '';
            this.INOUT_LIST.forEach((inout, seq) => {
              if(inout.code === data.divinout){
                inoutTxt = inout.text;
                return;
              }else if(data.ext === '' && data.agtname === ''){
                inoutTxt = '착신';
                return;
              }
            });
            data.divinout = inoutTxt;

            let divcallTxt = '';
            this.CALL_RESULT_LIST.forEach((result, seq) => {if(result.value === data.divcall){divcallTxt = result.text;return;}});
            data.divcall = divcallTxt;

            data.agtname = (data.ext?data.agtname + '(' + data.ext + ')':'');
            data.rec_file_name = data.rec_file_name.substring(0, data.rec_file_name.lastIndexOf('.'));

            let cuttsec = (Number(data.agtuse.split(':')[0]) * 60 * 60) + (Number(data.agtuse.split(':')[1]) * 60) + Number(data.agtuse.split(':')[2]);
            let totalsec = (Number(data.timeuse.split(':')[0]) * 60 * 60) + (Number(data.timeuse.split(':')[1]) * 60) + Number(data.timeuse.split(':')[2]);
            let yyyymmdd = data.timestart.split(' ')[0];
            let time = data.timestart.split(' ')[1];

            let date = new Date(yyyymmdd.split('-')[0].toString(), (Number(yyyymmdd.split('-')[1])-1).toString(), yyyymmdd.split('-')[2].toString(), time.split(':')[0].toString(), time.split(':')[1].toString(), time.split(':')[2].toString())

            date.setSeconds(date.getSeconds() + Number(totalsec));
            data.cuttEndTime = '' + date.getFullYear() + '-' + this.mixin_rpad((date.getMonth()+1).toString(), 2, '0') + '-' + this.mixin_rpad(date.getDate(), 2, '0') + ' ' + this.mixin_rpad(date.getHours(), 2, '0') + ':' + this.mixin_rpad(date.getMinutes(), 2, '0') + ':' + this.mixin_rpad(date.getSeconds(), 2, '0');

            date.setSeconds(date.getSeconds() - Number(cuttsec));
            data.cuttStTime = '' + date.getFullYear() + '-' + this.mixin_rpad((date.getMonth()+1).toString(), 2, '0') + '-' + this.mixin_rpad(date.getDate(), 2, '0') + ' ' + this.mixin_rpad(date.getHours(), 2, '0') + ':' + this.mixin_rpad(date.getMinutes(), 2, '0') + ':' + this.mixin_rpad(date.getSeconds(), 2, '0');

          });

          if(this.SCH_INOUT === ''){
            this.gridDataText = ipccCallHistList;
          }else{
            let arrTmpCallHist = [];
            let iNum = 1;
            if(this.SCH_INOUT === 'CVS'){ //착신 검색인 경우
              ipccCallHistList.forEach((data, idx) => {
                if(data.divinout === '착신'){
                  data.ROW_NUMBER = iNum++;
                  arrTmpCallHist.push(data);
                }
              });
            }else{
              ipccCallHistList.forEach((data, idx) => {
                if(data.divinout !== '착신'){
                  data.ROW_NUMBER = iNum++;
                  arrTmpCallHist.push(data);
                }
              });
            }
            this.gridDataText = arrTmpCallHist;
          }
        }
      },

      //로우 클릭시 색상 변경
      isActiveRow(item){
        const activeClass = item === this.selectedRow ? "active" : "";
        return activeClass;
      },

      //로우클릭
      rowClick(item){
        this.selectedRow = item;
      },

      //로우 더블클릭
      rowDblClick(){
        this.setRecFileInfo();
      },

      //선택 데이터 부모창에 전달
      setRecFileInfo() {
        if(this.selectedRow){
          this.$emit("setRecFileInfo", this.selectedRow); //컴포넌트 props setRecFileInfo 함수 호출
          this.$eventBus.$emit('closeIpccCallHistFind'); //dialog 닫기
        }else{
          this.showAlert(this.MESSAGE.ALERT.ITEM_CHECK);
          return;
        }
      },

      //녹취파일 듣기
      showRecDialog(item) {

        this.REC_TEMP_DATA={
          REC_FILE_NM : item.rec_file_name,
          CUST_ID :null,
          PHN_CUTT_ID : null,
        };

        this.mixin_showDialog('ListenVoice');

      },

    },
  }
</script>

<style lang="scss" scoped>

</style>