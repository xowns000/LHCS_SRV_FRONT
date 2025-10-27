<template>
  <div class="pl-container type-monitor">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
      </compo-sub-layout-top>
      <!-- sub content -->
      <v-tabs class="pl-tabs" v-model="tab">
        <v-tab>종합 현황</v-tab>
        <v-tab>상담직원별</v-tab>
      </v-tabs>
      <div style="height: 100%">
        <v-tabs-items v-model="tab" class="pl-tabs-items">
          <!-- 종합 현황 -->
          <v-tab-item>
            <div class="pl-cols" style="height: 100%">
              <!-- left -->
              <div class="is-vrt">
                <!-- 연결상태 종합 -->
                <div class="pl-card">
                  <h2 class="pl-subtit d-flex">
                    연결상태 종합
                    <div class="ml-auto">
                      <!-- 새로고침 버튼 -->
                      <compo-tooltip-btn
                        TitleProp="새로고침"
                        ClassProp="pl-tooltip-btn ml-2"
                        IconProp="pl-icon20 refresh"
                        TooltipPositionProp="bottom"
                        @btnClick="cuslList"
                      ></compo-tooltip-btn>
                      <span class="pl-counter">기준시간 <span class="pl-1 is-txt-sub">({{ CONNECT_MONITOR.base_date }})</span></span>
                    </div>
                  </h2>
                  <div class="pl-box-list is-mt-s">
                    <div
                      v-for="item in CONNECT_MONITOR.list"
                      :key="item.id"
                      class="pl-box-unit"
                      :class="{'active' : item.active}"
                      @click="activeMonitor(item)"
                      >
                      <div>
                        <span class="pl-box-unit-title">{{ item.title }}</span>
                        <div
                          class="pl-box-unit-count is-mt-s">{{ item.cnt }}명
                          <sub style="bottom: 0">({{ item.per }}%)</sub>
                        </div>
                      </div>
                      <v-icon :class="`pl-icon30 ${ item.icon } ml-auto`"></v-icon>
                    </div>
                  </div>
                </div>
                <!-- 인바운드 통화 중 -->
                <div class="pl-card is-noborder pt-2">
                  <h2 class="pl-subtit">{{ CONNECT_MONITOR.selected_title }}</h2>
                  <!-- grid -->
                  <v-data-table
                    class="pl-grid has-img is-mt-m"
                    :headers="inbound_header"
                    :items="inbound_items"
                    fixed-header
                    item-key="index"
                    height="350px"
                    :items-per-page="ROW_PER_PAGE"
                    hide-default-footer
                    :page.sync="page"
                    no-data-text="등록된 데이터가 없습니다."
                    @page-count="pageCount = $event">
                    <!-- 상담직원 -->
                    <template v-slot:item.USER_NM="{ item }">
                      <img
                        :src="item.cuslImg"
                        :alt="`${ item.USER_NM  }`"
                        class="pl-grid-portrait"
                        @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}"
                      >
                      <span class="ml-3">{{ item.USER_NM }}</span>
                    </template>
                    <!-- 상태 -->
                    <template v-slot:item.status="{ item }">
                      <span :class="`is-txt-${ displayStatus(item.status) }`">
                        {{ item.status }}
                      </span>
                    </template>
                  </v-data-table>
                </div>
              </div>
              <!-- right -->
              <div class="is-col-fix is-vrt pl-total-monitor" style="width: 820px">
                <!-- 연결상태 종합 -->
                <div class="pl-card">
                  <h2 class="pl-subtit">연결상태 종합</h2>
                  <div class="pl-total-monitor-doughnut is-mt-m">
                    <chartjsDoughnutChart
                      :chartData="DonughtData"
                      :chartOptions="DonughtOptions"
                      :styles="{ background: '#fff' }"
                    ></chartjsDoughnutChart>
                  </div>
                </div>
                <!-- 주간 응대 현황 -->
                <home-phone-info
                  :CUST_ID="CUS_INFO.CUST_ID"
                  LOCATION_INFO="call"
                />
              </div>
            </div>
          </v-tab-item>
          <!-- 상담직원별 -->
          <v-tab-item>
            <div class="pl-cols" style="height: 100%">
              <!-- grid -->
              <div class="is-vrt">
                <div class="pl-card">
                  <div class="pl-grid-top">
                    <div class="pl-grid-top-left">
                      <h2 class="pl-subtit">상담직원별 현황</h2>
                      <!-- 새로고침 버튼 -->
                      <compo-tooltip-btn
                        TitleProp="새로고침"
                        ClassProp="pl-tooltip-btn ml-2"
                        IconProp="pl-icon20 refresh"
                        TooltipPositionProp="bottom"
                        @btnClick="cuslList"
                      ></compo-tooltip-btn>
                      <span>기준시간 <span class="is-txt-sub">({{ base_date }})</span></span>
                    </div>
                    <div class="pl-grid-top-utils">
                      <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
                    </div>
                  </div>
                  <v-data-table
                    class="pl-grid has-img"
                    :headers="headers"
                    :items="items"
                    fixed-header
                    item-key="index"
                    height="calc(100vh - 338px)"
                    :items-per-page="ROW_PER_PAGE"
                    :item-class="isActiveRow"
                    @click:row="rowSelect"
                    hide-default-footer
                    :page.sync="page"
                    no-data-text="등록된 데이터가 없습니다."
                    @page-count="pageCount = $event">
                    <!-- 상담직원 -->
                    <template v-slot:item.USER_NM="{ item }">
                      <img
                        :src="item.cuslImg"
                        :alt="`${ item.USER_NM  }`"
                        class="pl-grid-portrait"
                        @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}"
                      >
                      <span class="ml-3">{{ item.USER_NM }}</span>
                    </template>
                    <!-- 상태 -->
                    <template v-slot:item.status="{ item }">
                      <span :class="`is-txt-${ displayStatus(item.status) }`">
                        {{ item.status }}
                      </span>
                    </template>
                    <!-- 상태변경 -->
                    <template v-slot:item.stateChange="{ item }">
                      <div class="pl-btn-wrap" v-if="$store.getters['userStore/GE_USER_COMPANY'].EXT_NO!==item.EXT_NO">
                        <v-btn :disabled="item.status === '대기'?true:item.status === '로그아웃'?true:false" class="pl-btn is-sm is-sub" @click="ipccStateChange(item, '대기')">대기</v-btn>
                        <v-btn :disabled="item.status === '후처리'?true:item.status === '로그아웃'?true:false" class="pl-btn is-sm is-sub" @click="ipccStateChange(item, '후처리')">후처리</v-btn>
                        <v-btn :disabled="item.status === '로그아웃'?true:false" class="pl-btn is-sm is-sub" @click="ipccStateChange(item, '로그아웃')">로그아웃</v-btn>
                      </div>
                    </template>
                    <!-- 감청 -->
                    <!-- <template v-slot:item.wiretapping="{ item }">
                      <div
                        @click="ipccWiretapping(item.wiretapping)"
                        :class="`lottieWiretapping is-disabled-${item.wiretapping}`"
                        style="position: relative; cursor: pointer;">
                        <vLottiePlayer
                          name="lottieWiretapping"
                          :autoplay=item.wiretapping
                          loop
                          width="58px"
                          height="58px"
                          style="position: absolute; top: -29px; left: -13px;"
                          :animationData="require('@/assets/lottie/animation_wiretapping.json')"
                          @animControl="anim => (lottieWiretapping = anim)"
                        />
                      </div>
                    </template> -->
                  </v-data-table>
                </div>
              </div>
              <!-- 상담원정보 -->
              <home-cs-info
                class="is-col-fix is-vrt"
                style="width: 520px;"
                LOCATION_INFO="call"
                :DataProp="selectedRow"
                :EXT_NO="EXT_NO"
                :CUSL_ID="CUSL_ID"
              />
            </div>
          </v-tab-item>

        </v-tabs-items>
      </div>
    </div>
  </div>
</template>

<script>
import { callUtil } from "@/store/callUtil.js";
import chartjsBarChart from "@/components/chartjsBarChart";
import chartjsDoughnutChart from "@/components/chartjsDoughnutChart";
import HomeCsInfo from '@/views/page/mainHome/HomeCsInfo.vue';
import HomePhoneInfo from '@/views/page/mainHome/HomePhoneInfo.vue';

export default {
name:"MENU_MTG_M0100", //name은 'MENU_' + 파일명 조합
components: {
  chartjsBarChart,
  chartjsDoughnutChart,
  HomeCsInfo,
  HomePhoneInfo,
},
data() {
    return {
      tab: null,
      EXT_NO : '',
      CUSL_ID : '',
      // [종합현황]
      // 연결상태 종합
      CONNECT_MONITOR: {
        base_date: '',
        list: [
          { title: '인바운드 연결중', icon:'in-connect', cnt: 0, per: 0, data: 'inbound_items' , active: false, cuslList :[] },
          { title: '인바운드 통화중', icon:'monitor-call', cnt: 0, per: 0, data: 'inbound_items2' , active: false, cuslList :[]},
          { title: '아웃바운드 연결중', icon:'out-connect', cnt: 0, per: 0, data: 'inbound_items3' , active: false, cuslList :[]},
          { title: '아웃바운드 통화중', icon:'monitor-call', cnt: 0, per: 0, data: 'inbound_items4' , active: false, cuslList :[]},
          { title: '대기중', icon:'wait', cnt: 0, per: 0, data: 'inbound_items5' , active: false, cuslList :[]},
          { title: '후처리', icon:'after', cnt: 0, per: 0, data: 'inbound_items6' , active: false, cuslList :[]},
          { title: '이석', icon:'move', cnt: 0, per: 0, data: 'inbound_items7' , active: false, cuslList :[]},
          { title: '로그아웃', icon:'logout', cnt: 0, per: 0, data: 'inbound_items8' , active: false, cuslList :[]},
        ],
        selected_title : '',
        week_response_count: 980,
        week_response_manager: 45,
        in_call: 1066,
        re_call: 1066,
        off_call: 1066,
        in_per: 90,
        sv_lv: 96,
        cs_one: 35,
        call_time_one: '2분 30초',
      },
      inbound_header: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px', sortable: false },
        { text: '상담직원', value: 'USER_NM', align: 'left', width: '180px', sortable: false},
        { text: '아이디', value: 'LGN_ID', align: 'left', width: '120px', sortable: false },
        { text: '내선', value: 'EXT_NO', align: 'left', width: '80px', sortable: false },
        { text: '상태', value: 'status', align: 'left', width: '90px', sortable: false },
        { text: '시간', value: 'elapseTime', align: 'left', width: '100px', sortable: false },
        { text: '상태 변경시간', value: 'changeTime', align: 'left', width: '150px', sortable: false },
      ],
      inbound_items: [],
      ipccCuslItems: {},
      ipExtCuslItems: {},
      // donught chart
      DonughtData: {
        labels: [
          "인바운드 연결중",
          "인바운드 통화중",
          "아웃바운드 연결중",
          "아웃바운드 통화중",
          "대기중",
          "후처리",
          "이석",
          "로그아웃",
        ],
        datasets: [
          {
            backgroundColor: [
              '#059F77',  //인 연결중
              '#8CC3BE',  //인 통화중
              '#0056A4',  //아웃 연결중
              '#6A8FB5',  //아웃 통화중
              '#F4A04D',  //대기중
              '#ECA0A6',  //후처리
              '#848484',  //이석
              '#E15759'   //로그아웃
            ],
            data: [10,15,20,10,5,3,5,32],
            noData: false
          }
        ]
      },
      DonughtOptions: {
        responsive: true,
        maintainAspectRatio: false,
        borderWidth: 0,
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              padding: 20,
              boxWidth: 10,
              usePointStyle: true,
              pointStyle: 'Rounded',
            },
          }
        },
      },

      // [상담직원별]
      // grid
      base_date: '',
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: -1,
      headers: [
        { text: '번호', value: 'CUSL_ROW_NUMBER', align: 'center', width: '80px', sortable: false },
        { text: '상담직원', value: 'USER_NM', align: 'left', width: '180px', sortable: true },
        { text: '아이디', value: 'LGN_ID', align: 'left', width: '120px', sortable: true },
        { text: '내선', value: 'EXT_NO', align: 'left', width: '80px', sortable: true },
        { text: '상태', value: 'status', align: 'left', width: '100px', sortable: true },
        { text: '시간', value: 'elapseTime', align: 'left', width: '100px', sortable: true },
        { text: '상태 변경시간', value: 'changeTime', align: 'left', width: '140px', sortable: true },
        { text: '상태변경', value: 'stateChange', align: 'left', width: '220px', sortable: false },
        // { text: '감청', value: 'wiretapping', align: 'left', width: '100px', sortable: false },
      ],
      items: [],

      selectedRow: {
        USER_NM : '성명미상'
      },

      // 상담원 정보
      CUS_INFO: {
        name: '나상담',
        in_call: '1004',
        company: '한국클라우드 cs-5팀',
        role: '매니저',
        portrait: require('@/assets/img/@profile_user.png'), //사이즈  69x69
        status: '로그아웃'
      },
      lottieWiretapping: false,

    }
  },

  watch: {
  },

  computed: {

  },

  created() {
    this.cuslList();
    // this.ipccConnectStat(); //IPCC 연결상태 종합
    this.getServerDate(); //기준시간
  },

  mounted() {
    // 초기 인바운드 연결중 선택
    this.activeMonitor(
      this.CONNECT_MONITOR.list[0]
    );
  },

  methods: {
    async getServerDate(){
      await this.mixin_getSvrDate("YYYYMMDDHH24MISS").then((data)=>{
        let cvDate = this.mixin_convertDate(data, 'yyyy-MM-dd(E) HH:mm:ss');

        this.CONNECT_MONITOR.base_date = cvDate;
        this.base_date = cvDate;
      })
    },
    // 연결상태 종합 버튼
    activeMonitor(item){
      this.removeActiveMonitor();
      item.active = true;
      this.CONNECT_MONITOR.selected_title = item.title;
      // this.cuslList();
      this.inbound_items = item.cuslList;
    },
    removeActiveMonitor() {
      const array = this.CONNECT_MONITOR.list;
      for (let index = 0; index < array.length; index++) {
        array[index].active = false;
      }
    },
    // 그리드 상태
    displayStatus(type) {
      const typeList = [
        { type_list_text: '로그아웃', type_list_type: 'error' },
        { type_list_text: '대기중', type_list_type: 'reject' },
        { type_list_text: 'IN 연결중', type_list_type: 'accept' },
        { type_list_text: 'IN 통화중', type_list_type: 'open' },
        { type_list_text: 'OB 연결중', type_list_type: 'accept' },
        { type_list_text: 'OB 통화중', type_list_type: 'open' },
        { type_list_text: '후처리', type_list_type: 'after' },
        { type_list_text: '이석', type_list_type: 'disable' },
        { type_list_text: '휴식', type_list_type: 'disable' },
        { type_list_text: '교육', type_list_type: 'disable' },
        { type_list_text: '식사', type_list_type: 'disable' },
        { type_list_text: '기타', type_list_type: 'disable' },
      ];

      for (let i = 0; i < typeList.length; i++) {
        if (typeList[i].type_list_text === type) {
          return typeList[i].type_list_type;
        }
      }
    },

    //종합현황
    async ipccConnectStat() {
      this.CONNECT_MONITOR.selected_title = '';
      this.getServerDate(); //기준일자 서버시간 셋팅

      let SEAT_MOVE_TP = await this.mixin_common_code_get(await this.mixin_common_code_get_all(["SEAT_MOVE_TP"]), 'SEAT_MOVE_TP');

      let overallStat = callUtil.ipcc('/api/palette_interface.php', {REQ : 'monitor_agent_list'}); //상담사 모니터링

      this.ipccCuslItems = overallStat;
      let ipExtCuslItems = this.ipExtCuslItems;
      let iTotalCnt = 0;
      let arrDonughtData = [];
      let CONNECT_MONITOR = this.CONNECT_MONITOR;
      let DonughtData = this.DonughtData;

      CONNECT_MONITOR.list.forEach((list, idx) => {
        list.cnt = 0;
        list.per = 0;
        list.cuslList = [];
      });

      let items = [];

      if(overallStat != null){
        Object.keys(overallStat).forEach(function(v){
          if(v === '0' && overallStat[v]){
            let rnum = 1;
            ipExtCuslItems.forEach((cusl, seq) => {
              Object.keys(overallStat[v]).forEach(function(k){
                if(cusl.EXT_NO === k){
                  let cuslStat = overallStat[v][k].STAT.toUpperCase()
                                  .replace('상담대기', '대기중')
                                  .replace('대기', '대기중')
                                  .replace('IN', '인바운드')
                                  .replace('인바운드 통화', '인바운드 통화중')
                                  .replace('OUT', '아웃바운드')
                                  .replace('아웃바운드 통화', '아웃바운드 통화중')
                                  .replace('기타업무', '기타');

                  let moveSeatYn = false;
                  SEAT_MOVE_TP.forEach((reason, seq) => {
                    if(reason.text === cuslStat){
                      moveSeatYn = true;
                      return false;
                    }
                  });
                  
                  CONNECT_MONITOR.list.forEach((list, idx) => {
                    if(list.title == cuslStat && list.title !== '이석'){
                      list.cnt++;
                      list.per = ((list.cnt / ipExtCuslItems.length) * 100).toFixed(2);
                      
                      cusl.ROW_NUMBER = list.cnt;
                      cusl.status = cuslStat; //상태
                      cusl.elapseTime = overallStat[v][k].USETIME; //시간
                      cusl.changeTime = overallStat[v][k].TIMESTART; //상태 변경시간
                      cusl.wiretapping = ''; //감청
                      cusl.stateChange = ''; //상태변경
                      cusl.cuslImg = (cusl.ICON !=='f04'?'/upload/' + cusl.ICON_IMG_URI:require('@/assets/img/@profile_user.png'));//사용자 이미지
                      list.cuslList.push(cusl);
                    }
                  });

                  CONNECT_MONITOR.list.forEach((list, idx) => {
                    if(moveSeatYn && list.title === '이석'){
                      list.cnt++;
                      list.per = ((list.cnt / ipExtCuslItems.length) * 100).toFixed(2);
                      
                      cusl.ROW_NUMBER = list.cnt;
                      cusl.status = cuslStat; //상태
                      cusl.elapseTime = overallStat[v][k].USETIME; //시간
                      cusl.changeTime = overallStat[v][k].TIMESTART; //상태 변경시간
                      cusl.wiretapping = ''; //감청
                      cusl.stateChange = ''; //상태변경
                      cusl.cuslImg = (cusl.ICON !=='f04'?'/upload/' + cusl.ICON_IMG_URI:require('@/assets/img/@profile_user.png'));//사용자 이미지
                      list.cuslList.push(cusl);
                    }
                  });

                  cusl.CUSL_ROW_NUMBER = rnum++;
                  cusl.role = cusl.AUTHRT_GROUP_NM;
                  items.push(cusl);
                }
              });
            });

            CONNECT_MONITOR.list.forEach((list, idx) => {
              arrDonughtData.push(list.cnt);
            });
          }
        });

        this.items = items;
      }

      DonughtData.datasets[0].data = arrDonughtData;

      let iCnt = 0;
      DonughtData.datasets[0].data.forEach((data, idx) => {
        if(data > 0) iCnt++;
      });

      if(iCnt > 0) DonughtData.datasets[0].noData = false;
      else DonughtData.datasets[0].noData = true;

      this.DonughtData = DonughtData;

      if(this.CONNECT_MONITOR.selected_title === ''){
        this.activeMonitor(
          this.CONNECT_MONITOR.list[0]
        );
      }

      this.selectedRow = {USER_NM : '성명미상'};
      this.EXT_NO = '';
      this.CUSL_ID = '-1';
    },

    //상담원 목록
    async cuslList() {
      let sUrl = '/api/setting/ipExt/extNotEmptyCuslList';
      let postParam = {
        STTS_EXPSR_MTHD_CD : 'MVT_PHONE'
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.ipExtCuslItems = response.DATA;
      }

      this.ipccConnectStat(); //IPCC 연결상태 종합
    },

    //상담원 상태
    async displayCuslStat(divlogin, divinout, divconn, divstate) {
      let statTxt = '로그아웃';

      if(divlogin == 2){
        statTxt = '로그아웃';
      }else{
         if(divinout == 1){
            if(divconn == 1) statTxt = 'IN 통화';
            else if(divconn == 2) statTxt = 'IN 연결중';
         }else if(divinout == 2) {
            if(divconn == 1) statTxt = 'OB 통화중';
            else if(divconn == 2) statTxt = 'OB 연결중';
         }else {
            //1:대기중, 2:후처리, 3:휴식, 4:교육, 5:식사, 6:기타
            if(divstate == 1) statTxt = '대기중';
            if(divstate == 2) statTxt = '후처리';
            if(divstate > 2) statTxt = '이석';
         }
      }

      return statTxt;
    },

    //row 선택
    rowSelect(item) {
      // console.log(item);
      this.selectedRow = item;
      this.EXT_NO = item.EXT_NO;
      this.CUSL_ID = item.CUSL_ID;
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    //감청
    ipccWiretapping() {
      // console.log('감청');

    },

    //상담사 IPCC 상태 변경
    ipccStateChange(item, stat) {
      let sReq = 'monitor_agent_state_change';
      let state = 0;

      if(stat === '로그아웃'){
        sReq = 'monitor_agent_logout';
      }else{
        if(stat === '대기'){
          state = 1;
        }else if(stat === '후처리'){
          state = 2;
        }
      }

      let cuslIpccStat = callUtil.ipcc('/api/palette_interface.php', {REQ : sReq, EXT : item.EXT_NO, AGENT_STATE : state}); //상담사 IPCC 상태 변경

      if(cuslIpccStat != null){
        if(cuslIpccStat.result === 'success'){
          this.cuslList();
        }
      }
    },
  },
}
</script>

<style lang="scss">

.lottieWiretapping {
  &.is-disabled-true path {
      fill: #808080;
  }
  &.is-disabled-false path {
      fill: #6746f5;
  }

}

</style>