<template>
  <div>
    <!-- 모니터링 -->
    <div class="pl-monitor-status">
      <div class="pl-monitor-status-wrap">
        <div
          v-for="(item, idx) in MONITOR_STATUS"
          :key="item.id"
          class="pl-monitor-status-unit">
          <div class="pl-monitor-status-icon">
            <v-icon class="pl-icon20" :class="item.icon"></v-icon>
          </div>
          <span
            :class="`pl-monitor-status-unit-desc ${ item.active ? 'active' : ''}`"
            @click="cuslStatChg(idx)"
          >
            <strong>{{ item.count }}</strong>
            <span>{{ item.title }}</span>
          </span>
        </div>
      </div>
      <!-- 진행률 -->
      <div class="pl-monitor-progress-wrap">
        <strong>진행률({{ MONITOR_PROGRESS }}%)</strong>
        <div class="pl-monitor-progress">
          <div class="pl-monitor-progress-bar" :style="`width: ${ MONITOR_PROGRESS }%`"></div>
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <div class="pl-form-inline-wrap is-mt-l" style="overflow-x: hidden;">
      <div class="pl-form-inline">
        <span class="pl-label">
          조회기간
        </span>
        <div class="pl-desc">
<!--          <div class="pl-calendar-range-form">-->
<!--            <compo-date-picker-->
<!--              v-model="SCH_ST_DT"-->
<!--              DateType="dateInput"-->
<!--              :DateProp.sync="SCH_ST_DT"/>-->
<!--            <span class="pl-unit">~</span>-->
<!--            <compo-date-picker-->
<!--              v-model="SCH_END_DT"-->
<!--              DateType="dateInput"-->
<!--              :DateProp.sync="SCH_END_DT"/>-->
<!--            <compo-drop-picker-->
<!--              :StartDateProp.sync="SCH_ST_DT"-->
<!--              :EndDateProp.sync="SCH_END_DT"-->
<!--            />-->
<!--          </div>-->
          <compo-date-range-picker
              :StartDayProp.sync="SCH_ST_DT"
              :EndDayProp.sync="SCH_END_DT"
              @startDayChange="mixin_testLog(SCH_ST_DT)"
              @endDayChange="mixin_testLog(SCH_END_DT)"
          />
          <!-- <v-select
            v-model="SCH_CUSL_RS"
            class="pl-form"
            @change="schRsvtCallList"
            :items="mixin_common_code_get(common_code, 'CUSL_RS', '전체')"
          ></v-select> -->
          <v-btn
            class="pl-btn flex-grow-0"
            @click="schRsvtCallList"
            >조회</v-btn>
        </div>
      </div>
    </div>
    <!-- list -->
    <div class="pl-campaign-list type-2 is-mt-m" style="height: calc(100vh - 385px)">
      <ul>
        <template v-if="RSVT_CALL_LIST.length == 0">
          <li class="pl-list-nodata">
            <span>등록된 데이터가 없습니다.</span>
          </li>
        </template>
        <template
          v-else
          v-for="data, index in RSVT_CALL_LIST"
        >
          <li
            v-if="data.PHN_CUTT_ID == data.RSVT_PHN_CUTT_ID"
            :key="data.PHN_CUTT_ID"
            class="pb-0"
          >
            <!-- 컨텐츠 리스트 -->
            <div>
              <div class="pl-campaign-list-unit">
                <span class="pl-campaign-list-title">예약 일시</span>
                <span>
                  {{ mixin_convertDate(data.RSVT_DT, 'yyyy-MM-dd HH:mm:ss') }} <span class="is-txt-bull">&bull;</span>
                  {{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(data.CUST_NM) : data.CUST_NM }} ({{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(data.CUST_PHN_NO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(data.CUST_PHN_NO.replace(/[^0-9]/g, "")) }})
                </span>
              </div>
              <div class="pl-campaign-list-unit">
                <span class="pl-campaign-list-title">처리 상태</span>
                <span>
                  <strong>총({{ data.CALL_TRY_CNT }})회</strong> 시도
                  <span :class="`pl-round-chip is-sm chat-stat-${data.status}`">{{ data.CUSL_RS_NM }}</span>
                </span>
              </div>
              <div class="pl-campaign-list-unit">
                <span class="pl-campaign-list-title">최근통화</span>
                <span v-if="data.MAX_REG_DT">
                  {{ mixin_convertDate(data.MAX_REG_DT, 'yyyy-MM-dd HH:mm:ss') }}
                </span>
                <span v-else>
                  통화내역 없음.
                </span>
              </div>
            </div>
            <div class="text-center">
              <!-- 상세 버튼 -->
              <compo-tooltip-btn
                :DisabledProp="!data.MAX_REG_DT"
                TitleProp="상세"
                ClassProp="pl-tooltip-btn"
                :IconProp=toggeleExpandClass(index)
                TooltipPositionProp="bottom"
                @btnClick="data.MAX_REG_DT?toggeleExpand(index):''"
              ></compo-tooltip-btn>
            </div>
            <!-- 전화 걸기 버튼 -->
            <div class="pl-campaign-list-btn">
              <v-icon
                class="pl-icon30 call"
                :disabled="data.CUSL_RS_CD === 'COMPLETED'"
                @click="callDialog(data)"
              ></v-icon>
            </div>
            <!-- expand -->
            <div v-show="data.expand" class="pl-campaign-list-child">
              <template
                v-for="child in data.childData"
                v-if="child.RSVT_PHN_CUTT_ID === data.PHN_CUTT_ID && child.RSVT_PHN_CUTT_ID !== child.PHN_CUTT_ID"
              >
                <div :key="child.id">
                  <div class="pl-campaign-list-child-wrap">
                    <span class="pl-campaign-list-child-unit2">
                      <v-icon class="pl-icon20 calendar-date"></v-icon>
                      <span class="pl-campaign-list-child-title2 ml-2 pr-2">
                        예약일 :
                      </span>
                      <span class="pl-campaign-list-child-desc">
                        <span v-if="child.CHG_RSVT_DT">{{ mixin_convertDate(child.CHG_RSVT_DT, 'yyyy-MM-dd HH:mm:ss') }}</span>
                        <span v-else>예약 없음.</span>
                        <span class="is-txt-bull mx-1">&bull;</span>
                        <span>{{ child.CL_TYPE_NM }} > 전화</span>
                        <span class="is-txt-bull mx-1">&bull;</span>
                        <span>상담직원({{ child.CUSL_NM }})</span>
                      </span>
                    </span>
                    <span class="pl-campaign-list-child-unit2 mt-1">
                      <span class="pl-campaign-list-child-desc d-flex">
                        <v-icon class="pl-icon20 calendar-list mr-2" style="flex: 0 0 20px"></v-icon>
                        <span>
                          <!-- {{ child.CUTT_CN }} -->
                          <div v-html="mixin_encodeEnter(child.CUTT_CN)"></div>
                        </span>
                      </span>
                    </span>
                  </div>
                </div>
              </template>
            </div>
          </li>
        </template>
        <!-- 더보기 있을 경우  -->
        <div v-if="!nextDisabled" style="width:100%;display:flex;margin-top:8px;justify-content:center;">
          <v-btn class="pl-btn is-round is-sub is-icon pl-4" @click="rsvtCallList('')">
            더보기
            <span class="pl-icon20 arrow-up ml-2"></span>
          </v-btn>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'right_reservecall',
    data() {
      return{
        common_code : [],

        //전화걸기
        OUT_CALL_DATA: {
          CL_TYPE_CD: 'OUT',
          dropItems: [],
          dropItems2: [],
          CUST_PHN_NO: '',
          PHN_CUTT_ID: '',
          CUTT_RSVT_ID: '',
          MODIFY_USE: false,
        },

        // 모니터링
        MONITOR_STATUS: [
          { title: '대상', count: 0, icon: 'monitor-target', active: false  },
          { title: '처리완료', count: 0, icon: 'monitor-done', active: false },
          { title: '처리중', count: 0, icon: 'monitor-count', active: true },
        ],

        MONITOR_PROGRESS: 0,

        SCH_CUSL_RS : '',
        startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        endDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

        SCH_ST_DT: this.$moment(this.startDate).subtract(7,'days').format('YYYY-MM-DD'),
        SCH_END_DT: this.endDate,

        NOW_DT: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        dropItems: [
          '모든 상태'
        ],

        // list
        RSVT_CALL_LIST: [],

        MESSAGE : {
          ALERT : {
            SOCKET_ERROR : {alertDialogToggle: true, msg: 'CTI에 로그인이 되어 있지 않습니다.', iconClass: 'is-caution', type: 'default'}
          },
          ERROR : {
            ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
          }
        },

        idx : 2,
        pagination: {
          page: 1,
          rowsPerPage: 10,
          sortBy: "",
          descending: ""
        }, //그리드 페이지속성정의
        nextDisabled:true,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼

      }
    },
    watch: {

    },

    computed: {
    },

    beforeDestroy(){
      this.$eventBus.$off("selCompanyAction"); //eventBus 중복방지를 위해 off
      this.$eventBus.$off("busForceEnd"); //eventBus 중복방지를 위해 off
    },

    async created() {
      //상단 고객사 선택시 eventBus 실행(각 페이지별 필요에 의한 내용 구현)
      this.$eventBus.$on("selCompanyAction", (SELECTED_COMPANY) => {
        // console.log(`${this.$options.name} : =====>`, SELECTED_COMPANY.CD_NM);
      });

      //공통코드설정
      let codeName = ['CUSL_RS'];
      this.common_code = await this.mixin_common_code_get_all(codeName);

      this.SCH_ST_DT = this.$moment(this.startDate).subtract(7,'days').format('YYYY-MM-DD'); // 통화 시작 일자(일주일전)
      this.SCH_END_DT = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); // 통화 종료 일자

      this.rsvtCallList('');

      //전화 끊기(고객 또는 상담사)
      this.$eventBus.$on("busForceEnd", (CALL_DATA) => {
        this.$eventBus.$emit("dialogOutCallClose"); //전화받기 dialog 닫기
      });
    },

    mounted() {
    },
    methods: {
      //상담사 예약콜 목록 조회
      async rsvtCallList(schGb) {
        let CUSL_RS = 'PROCESSING';
        let selIdx = 2;
        this.MONITOR_STATUS.forEach((stat, idx) => {
          if(stat.active){
            selIdx = idx;

            if(idx === 0) CUSL_RS = '';
            else if(idx === 1) CUSL_RS = 'COMPLETED';
            else if(idx === 2) CUSL_RS = 'PROCESSING';
            return;
          }
        });

        if(this.idx !== selIdx){
          this.RSVT_CALL_LIST = [];
          this.pagination.page = 1;
          this.idx = selIdx;
        }

        let sUrl = '/phone-api/cutt/rsvtCallList';
        let postParam = {
          CUSL_ID : this.$store.getters["userStore/GE_USER_ROLE"].userId
          , CUSL_RS : CUSL_RS
          , IS_ALL_ENV : JSON.stringify(this.mixin_getCustcoSetting('ENV_RESERVECALL_YN')) //환경설정에 의한 전체여부
        }

        if(schGb === 'sch'){
          postParam.ST_DT = this.SCH_ST_DT.replace(/-/gi, '');
          postParam.END_DT = this.SCH_END_DT.replace(/-/gi, '');
        }

        let headParam = {
          head : {
          }
        }

        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          if(response.DATA.length > 0){
            let arrTempRsvtList = [];
            response.DATA.forEach((data, idx) => {
              if(data.PHN_CUTT_ID === data.RSVT_PHN_CUTT_ID){
                data.expand = false;
                data.sub_status = '';
                if(data.CUSL_RS_CD  === 'PROCESSING'){
                  data.status = 'cs';
                }else{
                  data.status = 'done';
                }

                arrTempRsvtList.push(data);
              }
            });

            if((this.pagination.rowsPerPage * this.pagination.page) < arrTempRsvtList.length) this.nextDisabled = false;
            else this.nextDisabled = true;

            let arrRsvtList = [];

            arrTempRsvtList.forEach((data, idx) => {
              if(idx < (this.pagination.rowsPerPage * this.pagination.page)) arrRsvtList.push(data);
            });

            arrRsvtList.forEach((data, idx) => {
                let arrChild = [];
                response.DATA.forEach((child, seq) => {
                  if(child.PHN_CUTT_ID){
                    if(data.CLBK_ID === child.CLBK_ID && data.CUST_ID === child.CUST_ID){
                      arrChild.push(child);
                    }
                  }
                });
                data.childData = arrChild;
            });

            this.pagination.page += 1;

            this.RSVT_CALL_LIST = arrRsvtList;
          }

          // let arrData = [];
          // if(response.DATA.length > 0){
          //   response.DATA.forEach((data, idx) => {
          //     if(CUSL_RS !== ''){
          //       if(data.CUSL_RS_CD === CUSL_RS) arrData.push(data);
          //     }else{
          //       arrData.push(data);
          //     }
          //   });
          // }

          // this.RSVT_CALL_LIST = arrData;

          if(response.MONITOR.length > 0){
            this.MONITOR_STATUS[0].count = response.MONITOR[0].TARGET_CNT; //대상
            this.MONITOR_STATUS[1].count = response.MONITOR[0].COMPLETED_CNT; //처리완료
            this.MONITOR_STATUS[2].count = response.MONITOR[0].NO_COMPLETED_CNT; //예약
            this.MONITOR_PROGRESS = response.MONITOR[0].COMPLETED_RATE;

          }

          // this.MONITOR_STATUS[0].count = iTotalCnt; //대상
          // this.MONITOR_STATUS[1].count = iCompleteCnt; //처리완료
          // this.MONITOR_STATUS[2].count = iTotalCnt - iCompleteCnt; //예약

          // this.MONITOR_PROGRESS = iTotalCnt>0?(iCompleteCnt / iTotalCnt * 100).toFixed(1):0;
        }
      },

      cuslStatChg(seq) {
        this.MONITOR_STATUS.forEach((stat, idx) => {
          if(idx === seq) stat.active = true;
          else stat.active = false;
        });

        this.rsvtCallList(''); //예약콜 목록
      },

      toggeleExpand(index){
        this.RSVT_CALL_LIST[index].expand = !this.RSVT_CALL_LIST[index].expand;
      },
      toggeleExpandClass(index){
        return this.RSVT_CALL_LIST[index].expand === true ? 'pl-icon20 arrow-down' : 'pl-icon20 arrow-up'
      },

      schRsvtCallList() {
        this.rsvtCallList('sch');
      },

      callDialog(item) {
        if(this.$socket){
          this.mixin_set_active_tab({PATH_NM:'/CSL_M0100', NODE_TITLE:'전화상담'});
          this.OUT_CALL_DATA.CUST_PHN_NO = this.mixin_setPhoneNo(item.CUST_PHN_NO.replace(/[^0-9]/g, ""));
          this.OUT_CALL_DATA.CUST_ID = item.CUST_ID;
          this.OUT_CALL_DATA.PHN_CUTT_ID = item.PHN_CUTT_ID;
          this.OUT_CALL_DATA.CUTT_RSVT_ID = item.CUTT_RSVT_ID;
          this.OUT_CALL_DATA.MODIFY_USE = false;
          
          this.$eventBus.$emit('dialogOutCall', this.OUT_CALL_DATA); //top 전화걸기 호출
        }else{
          this.showAlert(this.MESSAGE.ALERT.SOCKET_ERROR);
          return;
        }
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>