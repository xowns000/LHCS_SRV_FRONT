<template>
  <div class="pl-container type-monitor">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
      </compo-sub-layout-top>
      <!-- sub content -->
      <v-tabs
        class="pl-tabs"
        v-model="tab"
        @change="tab=='0' ? cuttStatSrch() : statUserSrch()"
      >
        <v-tab>종합 현황</v-tab>
        <v-tab>상담직원별</v-tab>
      </v-tabs>
      <div style="height: calc(100vh - 250px)">
        <v-tabs-items v-model="tab" class="pl-tabs-items">
          <!-- 종합 현황 -->
          <v-tab-item>
            <div class="pl-cols pl-total-sns" style="height: 100%">
              <!-- left -->
              <div class="is-vrt" style="overflow-y: auto;">
                <div class="pl-card">
                  <h2 class="pl-subtit d-flex">
                    SNS 상담 종합
                    <div class="ml-auto">
                      <!-- 새로고침 버튼 -->
                      <compo-tooltip-btn
                        TitleProp="새로고침"
                        ClassProp="pl-tooltip-btn ml-2"
                        IconProp="pl-icon20 refresh"
                        TooltipPositionProp="bottom"
                        @btnClick="[cuttStatSrch()]"
                      ></compo-tooltip-btn>
                      <span class="pl-counter">기준시간 <span class="pl-1 is-txt-sub">({{ SNS_MONITOR.base_date }})</span></span>
                    </div>
                  </h2>
                  <div class="pl-box-list type-noclick is-mt-s">
                    <div
                      v-for="item in SNS_MONITOR.list"
                      :key="item.id"
                      class="pl-box-unit"
                      :class="{'active' : item.active}"
                      >
                      <div>
                        <span class="pl-box-unit-title">{{ item.title }}</span>
                        <!-- 퍼센트는 불필요
                        <div class="pl-box-unit-count is-mt-s">{{ item.manager }}명({{ item.manager_per }}%)</div>
                        -->
                        <div class="pl-box-unit-count is-mt-s">{{ item.manager }}명</div>
                      </div>
                      <v-icon :class="`pl-icon30 ${ item.icon } ml-auto`"></v-icon>
                    </div>
                  </div>
                </div>
                <div class="pl-card is-noborder">
                  <h2 class="pl-subtit">채널별 상담요청 현황</h2>
                  <div class="pl-total-sns-monitor is-mt-m">
                    <div>
                      <chartjsBarChart
                        :chartData="BarData"
                        :chartOptions="BarOptions"
                        :styles="{ flex: 1, background: '#fff'}"
                      ></chartjsBarChart>
                    </div>
                    <!-- grid -->
                    <div class="is-mt-s">
                      <v-data-table
                        class="pl-grid"
                        :headers="BarGridHeaders"
                        :items="BarGridItems"
                        fixed-header
                        item-key="index"
                        height="142px"
                        :items-per-page="ROW_PER_PAGE"
                        hide-default-footer
                        :page.sync="page"
                        no-data-text="등록된 데이터가 없습니다."
                        @page-count="pageCount = $event">
                        <template v-slot:item.CUTT_RATIO = "{ item }">
                          <span> {{ item.CUTT_RATIO }}%</span>
                        </template>
                      </v-data-table>
                    </div>
                  </div>
                </div>
                <div class="pl-card is-noborder">
                  <h2 class="pl-subtit">시간대별 요청 현황</h2>
                  <div class="pl-total-sns-line is-mt-m">
                    <chartjsLineChart
                      :chartData="AltmntLineData"
                      :chartOptions="LineOptions"
                      :styles="{ background: '#fff' }"
                    ></chartjsLineChart>
                  </div>
                </div>
                <div class="pl-card is-noborder">
                  <h2 class="pl-subtit">시간대별 완료 현황</h2>
                  <div class="pl-total-sns-line is-mt-m">
                    <chartjsLineChart
                      :chartData="EndLineData"
                      :chartOptions="LineOptions"
                      :styles="{ background: '#fff' }"
                    ></chartjsLineChart>
                  </div>
                </div>
              </div>
              <!-- right -->
              <div class="is-col-fix is-vrt" style="overflow-y: auto; width: 520px">
                <div class="pl-card">
                  <div class="pl-total-sns-status">
                    <strong>배정 가능 건수</strong>
                    <div class="pl-total-sns-status-count">
                      {{ SNS_MONITOR.assign_count }} / {{ SNS_MONITOR.assign_count_max }}
                    </div>
                  </div>
                  <div class="pl-total-sns-status-box">
                    <div>
                      <strong>{{ SNS_MONITOR.total_request_count }}</strong>
                      <span>총 요청 건수</span>
                    </div>
                    <div class="pl-10">
                      <strong>{{ SNS_MONITOR.total_in_count }}</strong>
                      <span>총 인입 건수</span>
                    </div>

                  </div>
                  <h2 class="pl-subtit is-mt-l">상담 완료 현황</h2>
                  <div class="pl-total-sns-status-monitor">
                    <div class="pl-total-sns-status-monitor-response">
                      <span>응대율</span>
                      <div class="pl-monitor-progress">
                        <div class="pl-monitor-progress-bar type-2" :style="`width: ${ SNS_MONITOR.cs_response }%`"></div>
                      </div>
                      <strong>{{ SNS_MONITOR.cs_response }}%</strong>
                    </div>
                    <div class="pl-total-sns-status-monitor-total">
                      <div>
                        <span>총 상담 건수</span>
                        <strong>({{ SNS_MONITOR.cs_total }}건)</strong>
                      </div>
                      <div>
                        <span>상담완료 건수</span>
                        <strong>({{ SNS_MONITOR.cs_done }}건)</strong>
                      </div>
                    </div>

                  </div>
                  <!-- list -->
                  <div
                    v-for="item in SNS_MONITOR.time_list"
                    :key="item.id"
                    class="pl-total-sns-time-list"
                    >
                    <h2 class="pl-subtit">{{ item.title }}</h2>
                    <div v-for="child in item.list" :key="item.id">
                      <span>{{ child.title }}</span>
                      <strong>
                        {{ child.value }}
                        <span v-if="child.unit">{{ child.unit }}</span>
                      </strong>
                    </div>
                  </div>

                </div>
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
                      <v-btn-toggle
                        v-model="monitor_btn"
                        mandatory
                        class="pl-btn-group">
                        <v-btn
                          v-for="item in btnGroup"
                          :key="item.id"
                          @click="() => FnBtnPath(item.evt)"
                          class="pl-btn">
                          {{ item.text }}
                        </v-btn>
                      </v-btn-toggle>
                      <v-text-field
                        class="pl-form is-search"
                        placeholder="상담직원"
                        @keydown.enter="statUserSrch(btnGroup[monitor_btn].evt)"
                        v-model="USER_SRCH"
                      >
                      <template v-slot:append>
                        <v-btn
                          @click="statUserSrch(btnGroup[monitor_btn].evt)"
                          class="pl-btn has-icon-only">
                          <span class="pl-icon20 in-search"></span>
                        </v-btn>
                      </template>
                    </v-text-field>
                    </div>
                    <div class="pl-grid-top-utils">
                      <!-- 새로고침 버튼 -->
                      <compo-tooltip-btn
                        TitleProp="새로고침"
                        ClassProp="pl-tooltip-btn ml-2"
                        IconProp="pl-icon20 refresh"
                        TooltipPositionProp="bottom"
                        @btnClick="[monitor_btn=0,statUserSrch()]"
                      ></compo-tooltip-btn>
                      <span>기준시간 <span class="is-txt-sub">({{ base_date }})</span></span><span>전체 ({{ items.length }})</span>
                    </div>
                  </div>
                  <v-data-table
                    class="pl-grid has-chart"
                    :headers="headers"
                    :items="items"
                    fixed-header
                    item-key="ROWNUM"
                    height="617px"
                    :items-per-page="ROW_PER_PAGE"
                    :item-class="isActiveRow"
                    @click:row="rowSelect"
                    hide-default-footer
                    :page.sync="page"
                    no-data-text="등록된 데이터가 없습니다."
                    @page-count="pageCount = $event">
                    <!-- 상담직원 -->
                    <template v-slot:item.USER="{ item }">
                      <div class="d-flex">
                        <img
                          :src="item.ICON_IMG_URI"
                          alt="item.CUSL_ID"
                          class="pl-grid-portrait"
                          @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
                        <div class="d-flex flex-column ml-8">
                          <span >{{ item.USER_NM }} ({{ item.LGN_ID }})</span>
                          <span 
                            :class="`is-txt-${ displayStatus(item,'stat') }`"
                            @click="openDropStat">
                            {{ displayStatus(item,'statNm') }}
                          </span>
                        </div>
                      </div>
                    </template>
                    <!-- 시작시간 -->
                    <template v-slot:item.STTS_ST_DT="{ item }">
                      {{ statSttsTime(item) }}
                    </template>
                    <!-- 상담완료 누적 -->
                    <template v-slot:item.CMPL_CNT="{ item }">
                      <v-progress-circular
                        :rotate="270"
                        :size="60"
                        :width="10"
                        :value="item.CMPL_RATIO"
                        color="#FF5353"
                      >
                        <strong class="is-txt-black">{{ item.CMPL_CNT }}</strong>
                      </v-progress-circular>
                    </template>
                    <!-- 상담 허용 건수 -->
                    <template v-slot:item.CHT_LMT_CNT="{ item }">
                      <!-- <span
                        class="pl-tag-line">
                        {{ item.CHT_LMT_CNT }}
                        <v-icon
                          v-if="CONT_CHT_LMT_CNT_YN == 'N'"
                          @click="openDrop">mdi-chevron-down</v-icon>
                      </span> -->
                      <v-btn
                        v-if="CONT_CHT_LMT_CNT_YN == 'N'"
                        @click="openDrop"
                        class="pl-btn is-sub">
                        {{ item.CHT_LMT_CNT }}
                      </v-btn>
                    </template>
                    <!-- 상담 가능 건수 -->
                    <template v-slot:item.CAN_ALTMNT="{ item }">
                      <span class="pl-tag-line">{{ item.CAN_ALTMNT }}</span>
                    </template>
                    <!-- 상담중 건수 -->
                    <template v-slot:item.ING_CNT="{ item }">
                      <span class="pl-tag-line">{{ item.ING_CNT }}</span>
                    </template>
                    <!-- 후처리 건수 -->
                    <template v-slot:item.AFTPRCS_CNT="{ item }">
                      <span class="pl-tag-line">{{ item.AFTPRCS_CNT }}</span>
                    </template>
                    <!-- 채팅시간 -->
                    <template v-slot:item.TOT_CHT_TIME="{ item }">
                      <span v-if="item.TOT_CHT_TIME == ' ' || item.TOT_CHT_TIME == '00:00:00'">-</span>
                      <span v-else>{{ item.TOT_CHT_TIME }}</span>
                    </template>
                    <!-- 이석시간 -->
                    <template v-slot:item.TOT_REST_TIME="{ item }">
                      <span v-if="item.TOT_REST_TIME == ' ' || item.TOT_REST_TIME == '00:00:00'">-</span>
                      <span v-else>{{ item.TOT_REST_TIME }}</span>
                    </template>
                    <!-- 후처리 시간 -->
                    <template v-slot:item.TOT_AFTPRCS_TIME="{ item }">
                      <span v-if="item.TOT_AFTPRCS_TIME == ' ' || item.TOT_AFTPRCS_TIME == '00:00:00'">-</span>
                      <span v-else>{{ item.TOT_AFTPRCS_TIME }}</span>
                    </template>
                  </v-data-table>
                </div>
              </div>
              <!-- 상담정보 -->
              <!-- <div class="is-col-fix is-vrt" style="width: 520px">
                <div class="pl-card-top">
                  <div class="pl-home-cs-my">
                    <div class="align-self-start pl-portrait">
                      <img :src="CUS_INFO.portrait" :alt="CUS_INFO.name">
                    </div>
                    <div class="ml-4">
                      <strong class="pl-card-top-title">
                        {{ CUS_INFO.name }}(내선 {{ CUS_INFO.in_call }})
                      </strong>
                      <div :class="`is-txt-${displayStatus(CUS_INFO.status)}`">
                        {{ CUS_INFO.status }}
                      </div>
                      <div>
                        {{ CUS_INFO.company }} {{ CUS_INFO.role }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="pl-card is-noborder">
                  <div class="pl-home-cs-today">
                    <div class="pl-subtit">오늘의 상담 현황</div>
                    <div class="pl-subdesc"><strong>기준일자 :</strong> {{ TODAY_MONITOR.base_date }}</div>
                    <div class="pl-home-cs-today-list-wrap">
                      <div v-for="item in TODAY_MONITOR.list" :key="item.id">
                        <div class="pl-home-cs-today-list-title">
                          <span class="pl-home-cs-today-list-title-subject">
                            <strong>{{ item.subject }}</strong>
                            <span v-if="item.cs_time" class="ml-1">(상담시간 {{ item.cs_time }})</span>
                          </span>
                          <span class="pl-home-cs-today-list-title-count">
                            <strong>{{ item.call_count }}</strong>
                            <span v-if="item.type === 'sns'">건</span>
                            <span v-else>콜</span>
                          </span>
                        </div>
                        <div class="pl-home-cs-today-list-status">
                          {{ item.status_title }}
                          <div>
                            <v-icon :class="`pl-icon20 updown-${ item.updown}`"></v-icon>
                            <strong>{{ item.dd_amt }} <sub>%</sub></strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="pl-home-cs-weekly is-mt-m">
                    <div class="pl-subtit">주간/월간 상담 현황</div>
                    <div class="pl-subdesc"><strong>기준일자 :</strong> {{ WEEKLY_MONITOR.base_date }}</div>
                    <div class="pl-home-cs-weekly-list-wrap">
                      <div>
                        <strong>주간 콜 현황</strong>
                        <span class="pl-home-cs-weekly-list-unit">
                          <span class="pl-home-cs-weekly-list-unit-title">나의 콜</span>
                          <div class="pl-monitor-progress">
                            <div class="pl-monitor-progress-bar type-3" :style="`width: ${ WEEKLY_MONITOR.week_per }%`"></div>
                          </div>
                          <span class="ml-auto">{{ WEEKLY_MONITOR.week_call }} 콜</span>
                        </span>
                        <span class="pl-home-cs-weekly-list-unit">
                          <span class="pl-home-cs-weekly-list-unit-title">전체 평균</span>
                          <div class="pl-monitor-progress">
                            <div class="pl-monitor-progress-bar type-3" :style="`width: ${ WEEKLY_MONITOR.week_total_per }%`"></div>
                          </div>
                          <span class="ml-auto">{{ WEEKLY_MONITOR.week_total_call }} 콜</span>
                        </span>
                      </div>
                      <div>
                        <strong>월간 상담시간</strong>
                        <span class="pl-home-cs-weekly-list-unit">
                          <span class="pl-home-cs-weekly-list-unit-title">내 상담시간</span>
                          <div class="pl-monitor-progress">
                            <div class="pl-monitor-progress-bar type-2" :style="`width: ${ WEEKLY_MONITOR.cs_per }%`"></div>
                          </div>
                          <span class="ml-auto">{{ WEEKLY_MONITOR.cs_time }} 시간</span>
                        </span>
                        <span class="pl-home-cs-weekly-list-unit">
                          <span class="pl-home-cs-weekly-list-unit-title">전체 평균</span>
                          <div class="pl-monitor-progress">
                            <div class="pl-monitor-progress-bar type-2" :style="`width: ${ WEEKLY_MONITOR.cs_total_per }%`"></div>
                          </div>
                          <span class="ml-auto">{{ WEEKLY_MONITOR.cs_total_time }} 시간</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div> -->
              <!-- 상담원정보 -->
              <home-cs-info
                class="pl-card-wrap is-col-fix pl-home-cs-info-wrap"
                style="width: 520px;"
                LOCATION_INFO="sns"
                :DataProp="selectedRow"
                :EXT_NO="EXT_NO"
                :CUSL_ID="CUSL_ID"
              />
            </div>
            <div
              v-if="dropChtLmt"
              class="pl-drop-layer"
              v-click-outside="closeDrop"
              :style="{ position: 'fixed', top: `${posY}px`, left: `${posX}px` }"
              >
              <div class="pl-drop-layer-body d-flex">
                <v-text-field
                  class="pl-form is-search ml-2"
                  placeholder="변경 허용수"
                  v-model="LMT_CNT"
                  @keydown.enter="strgLmtCnt()"
                >
                </v-text-field>
                <v-btn class="pl-btn ml-2" @click="strgLmtCnt">저장</v-btn>
              </div>
            </div>
            <div
              v-if="dropUserStat && clientip === '121.67.187.114'"
              class="pl-drop-layer"
              v-click-outside="closeDrop"
              :style="{ position: 'fixed', top: `${posY}px`, left: `${posX}px` }"
              >
              <div class="pl-drop-layer-body d-flex">
                <v-select
                  class="pl-form"
                  :items="USER_STAT_LIST"
                  v-model="USER_STAT"
                  placeholder="선택하세요"
                ></v-select>
                <v-btn class="pl-btn ml-2" @click="strgUserStat">저장</v-btn>
              </div>
            </div>
          </v-tab-item>

        </v-tabs-items>
      </div>
    </div>
  </div>
</template>

<script>
import chartjsBarChart from "@/components/chartjsBarChart";
import chartjsLineChart from "@/components/chartjsLineChart";
import HomeCsInfo from '@/views/page/mainHome/HomeCsInfo.vue';

export default {
name:"MENU_MTG_M0200", //name은 'MENU_' + 파일명 조합
components: {
  chartjsBarChart,
  chartjsLineChart,
  HomeCsInfo,
},
data() {
    return {
      tab: null,
      EXT_NO : '',
      CUSL_ID : '',
      // [종합 현황]
      SNS_MONITOR: {
        base_date: '',
        list: [
          { title: '인입', icon:'monitor-in', manager: 0, manager_per: 0,  active: false, },
          { title: '배정 대기', icon:'monitor-wait', manager: 0, manager_per: 0,  active: false, },
          { title: '대기', icon:'monitor-wait', manager: 0, manager_per: 0,  active: false, },
          { title: '상담', icon:'monitor-cs', manager: 0, manager_per: 0,  active: false, },
          { title: '후처리', icon:'after', manager: 0, manager_per: 0,  active: false, },
        ],
        assign_count : 0,
        assign_count_max : 0,
        total_request_count: 0,
        total_in_count: 0,
        cs_response: 0,
        cs_total: 0,
        cs_done: 0,
        time_list : [
          {
            title: '고객 평균 대기시간',
            list : [
              {
                title: '상담건 평균대기',
                value: '00:00:00',
              },
              {
                title: '포기건 평균대기',
                value: '00:00:00',
              },
            ],
          },
          {
            title: '평균 상담 처리시간',
            list : [
              {
                title: '평균 상담시간',
                value: '00:00:00',
              },
              {
                title: '평균 후처리 시간',
                value: '00:00:00',
              },
              {
                title: '평균 처리시간',
                value: '00:00:00',
              },
            ],
          },
          {
            title: '고객 포기',
            list : [
              {
                title: '상담 요청중 포기',
                value: 0,
                unit: '건'
              },
              {
                title: '상담 배정중 포기',
                value: 0,
                unit: '건'
              },
              {
                title: '상담 대기중 포기',
                value: 0,
                unit: '건'
              },
              {
                title: '전달 대기중 포기',
                value: 0,
                unit: '건'
              },
            ],
          },
          {
            title: 'BUSY',
            list : [
              {
                title: '상담요청 불가',
                value: 0,
                unit: '건'
              },
              {
                title: '상담배정 불가',
                value: 0,
                unit: '건'
              },
              {
                title: '상담요청 미선택',
                value: 0,
                unit: '건'
              },
              {
                title: '상담사 배정불가',
                value: 0,
                unit: '건'
              },
            ],
          },
        ],

      },
      // bar chart
      BarData: {
        labels: [],
        datasets: [{
          backgroundColor: [],
          data: [],
          noData: false
        }],
        key:[],
      },
      BarOptions: {
        responsive: true,
        maintainAspectRatio: false,
        borderRadius: 8,
        plugins: {
          legend: {
            display: false,
            position: 'top',
            align: 'end',
            labels: {
              padding: 20,
              boxWidth: 10,
              usePointStyle: true,
              pointStyle: 'Rounded',
            },
          },
        },
      },
      BarGridHeaders: [
        { text: '상담 채널', value: 'DSPTCH_PRF_NM', align: 'left', sortable: false },
        { text: '채널구분', value: 'CHN_CLSF_NM', align: 'left', sortable: false },
        { text: '요청 건수', value: 'CUTT_CNT', align: 'left', sortable: false },
        { text: '비율', value: 'CUTT_RATIO', align: 'left', sortable: false },
      ],
      BarGridItems: [
      ],

      // line chart
      //시간대별 인입데이터
      AltmntLineData: {
        labels: [],
        datasets: [
          {
            label: "",
            borderColor: "",
            backgroundColor: "",
            data: [],
            key:[],
            noData: false
          },
        ],
      },
      //시간대별 완료데이터
      EndLineData: {
        labels: [],
        datasets: [
          {
            label: "",
            borderColor: "",
            backgroundColor: "",
            data: [],
            key:[],
            noData: false
          },
        ],
      },
      LineOptions: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          point: {
            pointStyle: 'circle',
            radius: 2,
            pointHoverRadius: 5,
            borderWidth: 1,
          },
          line: {
            tension: 0.4,
            borderWidth: 2,
          }
        },
        scales: {
          y: {
            suggestedMax: 20,
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              padding: 20,
              boxWidth: 10,
              usePointStyle: true,
              pointStyle: 'Rounded',
            },
          },
        },
      },


      // [상담직원별]
      // top
      base_date: '2023/03/26 오전 10:19:43',
      // btn group
      monitor_btn: 0,
      btnGroup: [
        { text: '전체', evt: () =>{ this.statUserSrch()} },
        { text: '로그인', evt: () =>{ this.statUserSrch("LOGIN")} },
        { text: '대기', evt: () =>{ this.statUserSrch("WAIT")} },
        { text: '상담', evt: () =>{ this.statUserSrch("ING")} },
        { text: '이석', evt: () =>{ this.statUserSrch("REST")} },
        { text: '로그아웃', evt: () =>{ this.statUserSrch("LOGOUT")} },
      ],
      USER_SRCH:'',         //상담직원 검색

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: -1,
      headers: [
        { text: '상담직원', value: 'USER', align: 'left', sortable: false },
        { text: '시작 시간', value: 'STTS_ST_DT', align: 'left', width: '150px', sortable: false },
        { text: '상담완료(누적)', value: 'CMPL_CNT', align: 'center', width: '120px', sortable: false },
        { text: '상담 허용', value: 'CHT_LMT_CNT', align: 'center', width: '100px', sortable: false },
        { text: '상담 가능', value: 'CAN_ALTMNT', align: 'center', width: '100px', sortable: false },
        { text: '상담중', value: 'ING_CNT', align: 'center', width: '100px', sortable: false },
        { text: '후처리', value: 'AFTPRCS_CNT', align: 'center', width: '100px', sortable: false },
        { text: '채팅시간', value: 'TOT_CHT_TIME', align: 'left', width: '100px', sortable: false },
        { text: '이석시간', value: 'TOT_REST_TIME', align: 'left', width: '100px', sortable: false },
        { text: '후처리', value: 'TOT_AFTPRCS_TIME', align: 'left', width: '100px', sortable: false },
      ],
      items: [],

      selectedRow: null,

      // 상담원 정보
      CUS_INFO: {
        name: '나상담',
        in_call: '1004',
        company: '한국클라우드 cs-5팀',
        role: '매니저',
        portrait: require('@/assets/img/@profile_user.png'), //사이즈  69x69
        status: '로그아웃'
      },
      TODAY_MONITOR: {
        base_date: '2023/01/20(금) 15:36',
        list: [
          {
            subject: '인바운드',
            cs_time: '4시간 23분',
            call_count: 86,
            updown: 'up',
            dd_amt: 19.2,
            status_title: '전일 대비'
          },
          {
            subject: '아웃바운드',
            cs_time: '4시간 23분',
            call_count: 86,
            updown: 'down',
            dd_amt: 19.2,
          },
          {
            type: 'sns',
            subject: 'SNS Chatting',
            cs_time: '',
            call_count: 86,
            updown: 'down',
            dd_amt: 19.2,
          },
        ]
      },
      WEEKLY_MONITOR: {
        base_date: '2023/01/20(금) 15:36',
        week_call: 431,
        week_per: 43,
        week_total_call: 431,
        week_total_per: 63,
        month_call: 431,
        month_per: 43,
        month_total_call: 431,
        month_total_per: 43,
        cs_time: 324,
        cs_per: 55,
        cs_total_time: 224,
        cs_total_per: 72,
      },

      // COLOR_SET:['#8591E1', '#FAA7A8', '#FFB72C', '#7FC379', '#4BC8F5']
      COLOR_SET: ['#8591E1', '#FAA7A8', '#FFB72C', '#7FC379', '#4BC8F5', '#DD1B16', '#F59949', '#4786E3', '#ECA0A6', '#9C67F9', '#3F51B5', '#64748B', '#FFCCD0', '#FAC219'],

      //상담허용수 바꾸기
      dropChtLmt: false,
      CONT_CHT_LMT_CNT_YN: '',  //상담허용수 일괄 적용 여부
      LMT_CNT:'',         //상담 허용수
      posX: 0,            //dialog 위치
      posY: 0,            //dialog 위치
      NudgeLeftProp:0,    //dialog 위치
      NudgeTopProp:0,     //dialog 위치

      //상담원 상태 바꾸기
      dropUserStat: false,
      USER_STAT_LIST: [],
      USER_STAT: '',

      //공통코드
      common_code: [],

      //사용자 IP
      clientip : null,
    }
  },

  watch: {

  },

  computed: {

  },

  async created() {
    let codeName = ['CHAT_ST'];
    this.common_code = await this.mixin_common_code_get_all(codeName);
    this.USER_STAT_LIST = this.mixin_common_code_get(this.common_code, 'CHAT_ST');

    this.cuttStatSrch();
    this.CONT_CHT_LMT_CNT_YN = await this.mixin_getChtStng('CONT_CHATAGENT_YN')

    fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(response => {
      this.clientip = response.ip;
    });
  },

  mounted() {

  },

  methods: {
    FnBtnPath(evt) {
      evt();
    },
    displayStatus(item,type) {
      const typeList = [
        { type_list_text: '로그아웃', type_list_value: 'LOGOUT', type_list_type: 'error' },
        { type_list_text: '로그인', type_list_value: 'LOGIN', type_list_type: 'error' },
        { type_list_text: '채팅ON', type_list_value: 'CHT_WAIT', type_list_type: 'accept' },
        { type_list_text: '상담', type_list_value: 'ING', type_list_type: 'open' },
        { type_list_text: '이석', type_list_value: 'REST', type_list_type: 'disable' },
      ];

      let userStat = '';
      if(parseInt(item.ING_CNT) > 0){
        userStat = 'ING';
      } else if(item.CHT_STAT == "CHT_WAIT"){
        userStat = 'CHT_WAIT';
      } else if(item.CHT_STAT != "CHT_CANT"){
        userStat = 'REST';
      } else {
        userStat = item.LGN_STTS;
      }

      for (let i = 0; i < typeList.length; i++) {
        if (typeList[i].type_list_value === userStat) {
          if(type == "statNm"){
            return typeList[i].type_list_text;
          } else {
            return typeList[i].type_list_type;
          }
        }
      }
    },

    //상담 상태에 따른 시작시간
    statSttsTime(item){
      let statTime = '';
      if(parseInt(item.ING_CNT) > 0){
        statTime = item.CUTT_STTS_CD_DT;
      } else if(item.CHT_STAT == "CHT_WAIT"){
        statTime = item.CHT_STAT_DT;
      } else if(item.CHT_STAT != "CHT_CANT"){
        statTime = item.REST_TIME;
      } else {
        statTime = item.LGN_STTS_DT;
      }

      return this.mixin_convertDate(statTime, 'yyyy-MM-dd HH:mm:ss');
    },

    //상담 총합 건수 조회
    async cuttStatSrch(){
      this.SNS_MONITOR.base_date = await this.mixin_convertDate(await this.mixin_getSvrDate("YYYYMMDDHH24MISS"), 'yyyy-MM-dd HH:mm:ss');
      let sUrl = '/chat-api/main/dash/totalStat';
      let postParam = {
      }
      let headParam = {
        head : {
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);
      if (!resData.HEADER.ERROR_FLAG){
        this.SNS_MONITOR.list[0].manager = resData.DATA[0].TOT_STAT         //총인입건수
        this.SNS_MONITOR.list[1].manager = resData.DATA[0].ALTMNT_WAIT_STAT //배정대기건수
        this.SNS_MONITOR.list[2].manager = resData.DATA[0].WAIT_STAT        //대기건수
        this.SNS_MONITOR.list[3].manager = resData.DATA[0].ING_STAT         //상담건수
        this.SNS_MONITOR.list[4].manager = resData.DATA[0].AFTPRCS_STAT     //후처리건수

        this.chnCuttStatSrch();
        this.rightCuttStatSrch();
      }
    },

    //채널별 상담요청현황
    async chnCuttStatSrch(){
      let sUrl = '/chat-api/main/dash/chnStat';
      let postParam = {
      }
      let headParam = {
        head : {
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);
      if (!resData.HEADER.ERROR_FLAG){
        this.BarGridItems = resData.DATA
        let chartData = {
          labels: [],
          datasets: [{
            // backgroundColor: ['#DD1B16', '#F59949', '#4786E3', '#ECA0A6', '#9C67F9', '#3F51B5', '#64748B', '#FFCCD0', '#FAC219'],
            backgroundColor: [],
            data: [],
            noData: true
          }],
          key:[],
        };
        let altmntLineData = {
          labels: [
            '0:00',
            '1:00',
            '2:00',
            '3:00',
            '4:00',
            '5:00',
            '6:00',
            '7:00',
            '8:00',
            '9:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
            '20:00',
            '21:00',
            '22:00',
            '23:00',
          ],
          datasets: [
            {
              label: "",
              borderColor: "",
              backgroundColor: "",
              data: [],
              key:[],
              noData: true
            },
          ],
        };
        let endLineData = {
          labels: [
            '0:00',
            '1:00',
            '2:00',
            '3:00',
            '4:00',
            '5:00',
            '6:00',
            '7:00',
            '8:00',
            '9:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
            '20:00',
            '21:00',
            '22:00',
            '23:00',
          ],
          datasets: [
            {
              label: "",
              borderColor: "",
              backgroundColor: "",
              data: [],
              key:[],
              noData: true
            },
          ],
        };

        let leng = this.BarGridItems.length
        for(let i=0;i<leng;i++){
          this.BarGridItems[i]["CUTT_RATIO"] =
            this.BarGridItems[i].CUTT_CNT != '0'
            ? (parseInt(this.BarGridItems[i].CUTT_CNT)/parseInt(this.SNS_MONITOR.list[0].manager)*100).toFixed(2)
            : '0';
          this.BarGridItems[i]["CUTT_RATIO"] = Math.round(this.BarGridItems[i]["CUTT_RATIO"] * 100) / 100;    //소수점 뒤 0일때 삭제

          chartData.labels[i] = this.BarGridItems[i].DSPTCH_PRF_NM;
          chartData.datasets[0].data[i] = this.BarGridItems[i].CUTT_CNT;
          chartData.datasets[0].backgroundColor[i] = this.COLOR_SET[i];
          chartData.datasets[0].noData = false;
          chartData.key[i] = this.BarGridItems[i].SNDR_KEY;

          altmntLineData.datasets[i] = {
            label: this.BarGridItems[i].DSPTCH_PRF_NM
            , key: this.BarGridItems[i].SNDR_KEY
            , borderColor: this.COLOR_SET[i]
            , backgroundColor: this.COLOR_SET[i]
            , data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            , noData: false
          }
          endLineData.datasets[i] = {
            label: this.BarGridItems[i].DSPTCH_PRF_NM
            , key: this.BarGridItems[i].SNDR_KEY
            , borderColor: this.COLOR_SET[i]
            , backgroundColor: this.COLOR_SET[i]
            , data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            , noData: false
          }
        }

        this.BarData = chartData;

        this.timeCuttStatSrch(altmntLineData,endLineData);
      }
    },

    //시간대별 상담요청현황
    async timeCuttStatSrch(altmntData,endData){
      let sUrl = '/chat-api/main/dash/timeStat';
      let postParam = {
      }
      let headParam = {
        head : {
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);
      if (!resData.HEADER.ERROR_FLAG){
        let AltmntData = altmntData
        let EndData = endData

        let chnLeng = AltmntData.datasets.length
        let altmntLeng = resData.selectAltmntTimeCuttStat.length
        for(let i=0;i<chnLeng;i++){
          for(let n=0;n<altmntLeng;n++){
            if(AltmntData.datasets[i].key == resData.selectAltmntTimeCuttStat[n].SNDR_KEY){
              AltmntData.datasets[i].data[parseInt(resData.selectAltmntTimeCuttStat[n].HOUR)]
                = parseInt(resData.selectAltmntTimeCuttStat[n].CNT);
            }
          }
        }

        let endLeng = resData.selectEndTimeCuttStat.length
        for(let i=0;i<chnLeng;i++){
          for(let n=0;n<endLeng;n++){
            if(EndData.datasets[i].key == resData.selectEndTimeCuttStat[n].SNDR_KEY){
              EndData.datasets[i].data[parseInt(resData.selectEndTimeCuttStat[n].HOUR)]
                = parseInt(resData.selectEndTimeCuttStat[n].CNT);
            }
          }
        }

        this.AltmntLineData = AltmntData
        this.EndLineData = EndData
      }
    },

    //우측 건수 조회
    async rightCuttStatSrch(){
      let sUrl = '/chat-api/main/dash/rightTotalStat';
      let postParam = {
        TOT_CNT:this.SNS_MONITOR.list[0].manager//총 인입건수 => 평균건 조회시 인입건 없으면 오류발생
      }
      let headParam = {
        head : {
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);
      if (!resData.HEADER.ERROR_FLAG){
        this.SNS_MONITOR.assign_count_max = resData.selectAltmntCnt[0].STNG_VL;
        this.SNS_MONITOR.assign_count = parseInt(resData.selectAltmntCnt[0].STNG_VL) - parseInt(resData.selectStatCnt[0].ALTMNT_CNT);
        this.SNS_MONITOR.total_request_count = resData.selectStatCnt[0].REQ_CNT;
        this.SNS_MONITOR.total_in_count = resData.selectStatCnt[0].TOT_CNT;
        this.SNS_MONITOR.cs_response = this.SNS_MONITOR.list[0].manager == '0' || this.SNS_MONITOR.list[0].manager == null || this.SNS_MONITOR.list[0].manager == undefined
          ? 0
          : parseInt(resData.selectEndCnt[0].END_CNT)/parseInt(this.SNS_MONITOR.list[0].manager)*100;
        this.SNS_MONITOR.cs_response = Math.round(this.SNS_MONITOR.cs_response * 100) / 100;    //소수점 뒤 0일때 삭제
        this.SNS_MONITOR.cs_total = this.SNS_MONITOR.list[0].manager;
        this.SNS_MONITOR.cs_done = resData.selectEndCnt[0].END_CNT;
        if(this.SNS_MONITOR.list[0].manager != "0" && this.SNS_MONITOR.list[0].manager != "" && this.SNS_MONITOR.list[0].manager != null){
          this.SNS_MONITOR.time_list[0].list[0].value = resData.selectAvgTime[0].WAIT_AVG>0?await this.mixin_convertDate(resData.selectAvgTime[0].WAIT_AVG, 'HH:mm:ss'):'00:00:00';
          this.SNS_MONITOR.time_list[0].list[1].value = await this.mixin_convertDate(resData.selectAvgTime[0].GIVEUP_AVG, 'HH:mm:ss');
          this.SNS_MONITOR.time_list[1].list[0].value = await this.mixin_convertDate(resData.selectAvgTime[0].CUTT_AVG, 'HH:mm:ss');
          this.SNS_MONITOR.time_list[1].list[1].value = await this.mixin_convertDate(resData.selectAvgTime[0].AFTPRCS_AVG, 'HH:mm:ss');
          this.SNS_MONITOR.time_list[1].list[2].value = await this.mixin_convertDate(resData.selectAvgTime[0].TOTAL_AVG, 'HH:mm:ss');
        }
        this.SNS_MONITOR.time_list[2].list[0].value = resData.selectGiveUpCnt[0].DMND_GIVEUP_CNT;
        this.SNS_MONITOR.time_list[2].list[1].value = resData.selectGiveUpCnt[0].ALTMNT_GIVEUP_CNT;
        this.SNS_MONITOR.time_list[2].list[2].value = resData.selectGiveUpCnt[0].WAIT_GIVEUP_CNT;
        this.SNS_MONITOR.time_list[2].list[3].value = resData.selectGiveUpCnt[0].TRAN_WAIT_GIVEUP_CNT;
        this.SNS_MONITOR.time_list[3].list[0].value = resData.selectBusyCnt[0].DMND_NPSBL_CNT;
        this.SNS_MONITOR.time_list[3].list[1].value = resData.selectBusyCnt[0].ALTMNT_NPSBL_CNT;
        this.SNS_MONITOR.time_list[3].list[2].value = resData.selectBusyCnt[0].DMND_NOCHC_CNT;
        this.SNS_MONITOR.time_list[3].list[3].value = resData.selectBusyCnt[0].CUSL_ALTMNT_NPSBL_CNT;
      }
    },

    //상태별 상담원 조회
    async statUserSrch(stat){
      this.base_date = await this.mixin_convertDate(await this.mixin_getSvrDate("YYYYMMDDHH24MISS"), 'yyyy-MM-dd HH:mm:ss');
      let sUrl = '/chat-api/status/agent/sttus/inqire';
      let postParam = {
        SRCH_TY: stat == '' || stat == null || stat == undefined ? '' : stat,
        USER_SRCH: this.USER_SRCH,
        STTS_EXPSR_MTHD_CD : 'MVT_SNS'
      }
      let headParam = {
        head : {
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);
      if (!resData.HEADER.ERROR_FLAG){
        for(let k in resData.DATA){
          resData.DATA[k].TOT_CHT_TIME = this.mixin_convertDate(resData.DATA[k].CHT_TIME, 'HH:mm:ss');
          resData.DATA[k].AVG_TOT_CHT_TIME = this.mixin_convertDate(resData.DATA[k].AVG_CHT_TIME, 'HH:mm:ss');
          resData.DATA[k].TOT_REST_TIME = this.mixin_convertDate(resData.DATA[k].REST_TIME, 'HH:mm:ss');
          resData.DATA[k].AVG_TOT_REST_TIME = this.mixin_convertDate(resData.DATA[k].AVG_REST_TIME, 'HH:mm:ss');
          resData.DATA[k].TOT_AFTPRCS_TIME = this.mixin_convertDate(resData.DATA[k].AFTPRCS_TIME, 'HH:mm:ss');
          resData.DATA[k].AVG_TOT_AFTPRCS_TIME = this.mixin_convertDate(resData.DATA[k].AVG_AFTPRCS_TIME, 'HH:mm:ss');

          resData.DATA[k].CAN_ALTMNT = parseInt(resData.DATA[k].CHT_LMT_CNT) - parseInt(resData.DATA[k].ALTMNT_CNT);

          resData.DATA[k].CMPL_RATIO = resData.DATA[k].TOT_CNT == '0' ? 0 : parseInt(resData.DATA[k].CMPL_CNT) / parseInt(resData.DATA[k].TOT_CNT) * 100;
          resData.DATA[k].ICON_IMG_URI = (resData.DATA[k].ICON !== 'f04' ? '/upload/' + resData.DATA[k].ICON_IMG_URI:require('@/assets/img/@profile_user.png'))
        }
        this.items = resData.DATA
      }
    },

    //row 선택
    rowSelect(item) {
      // console.log(item);
      this.selectedRow = item;
      this.EXT_NO = item.EXT_NO;
      this.CUSL_ID = item.CUSL_ID;

      this.LMT_CNT = item.CHT_LMT_CNT;

      this.USER_STAT = item.CHT_STAT;
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    //개인별 상담 허용수 바꾸기
    openDrop(event) {
      this.posX = event.clientX - this.NudgeLeftProp;
      this.posY = event.clientY - this.NudgeTopProp;
      this.dropChtLmt = !this.dropChtLmt;
    },
    closeDrop() {
      this.dropChtLmt = false;
    },
    async strgLmtCnt(){
      let sUrl = '/chat-api/setting/manage/strgChtLmtCnt';
      let postParam = {
        CHT_LMT_CNT: this.LMT_CNT,
        CUSL_ID: this.CUSL_ID
      }
      let headParam = {
        head : {
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);
      if (!resData.HEADER.ERROR_FLAG){
        this.statUserSrch();
        this.dropChtLmt = false;
      }
    },

    //상담 상태 바꾸기
    openDropStat(event) {
      this.posX = event.clientX - this.NudgeLeftProp;
      this.posY = event.clientY - this.NudgeTopProp;
      this.dropUserStat = !this.dropUserStat;
    },
    closeDropStat() {
      this.dropUserStat = false;
    },
    async strgUserStat(){
      let sUrl = '/chat-api/setting/manage/strgUserStat';
      let postParam = {
        USER_STAT: this.USER_STAT,
        CUSL_ID: this.CUSL_ID
      }
      let headParam = {
        head : {
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);
      if (!resData.HEADER.ERROR_FLAG){
        this.statUserSrch();
        this.dropUserStat = false;
      }
    },
  },
}
</script>

<style>

</style>