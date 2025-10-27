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

      <!-- 체크 -->
      <div class="pl-monitor-status-chk pl-selection-row is-mt-s">
        <v-btn
          v-if="scrollBtnVisable"
          icon
          small
          @click="scrollPaging('left')">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <div class="pl-monitor-status-chk-container" ref="listContainer">
          <div class="pl-monitor-status-chk-list">
            <v-checkbox
              v-model="chk01.selected"
              v-for="(chk01, index) in chkTypes"
              :key="index"
              :label="chk01.text + '(' + (chk01.CNT === undefined ? 0: chk01.CNT) + ')'"
              class="pl-check "
              @change="cpiRscheck($event, index, chk01.id)"
            ></v-checkbox>
          </div>
        </div>
        <v-btn
          v-if="scrollBtnVisable"
          icon
          small
          @click="scrollPaging('right')">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </div>
    <!-- 조회조건 -->
    <div class="pl-form-inline-wrap is-mt-l" style="overflow-x: hidden;">
      <div class="pl-form-inline">
        <span class="pl-label">
          캠페인 명
        </span>
        <div class="pl-desc">
          <div class="pl-desc" style="width: 250px">
            <v-select
              :items="cpiNmItems"
              v-model="CPI_ID"
              @change="schCpiStatHistList()"
              placeholder="선택하세요"
              class="pl-form is-lg"
            ></v-select>
          </div>
          <span class="pl-label">
          시도건수
          </span>
          <v-text-field
            v-model="CALL_TRY_CNT"
            maxlength="2"
            class="pl-form is-xss"
            placeholder=""
            suffix="회"
            hide-spin-buttons
            type="text"
            oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
            @keyup.enter="schCpiStatHistList()"
            />
          <v-select
            v-model="SCH_UPDOWN"
            class="pl-form is-xs"
            :items="mixin_common_code_get(common_code, 'UPDOWN')"
          ></v-select>
          <v-btn
            class="pl-btn flex-grow-0"
            @click="schCpiStatHistList()"
            >조회</v-btn>
        </div>
      </div>
    </div>
    <!-- list -->
    <div class="pl-campaign-list is-mt-m" style="height: calc(100vh - 425px);">
      <ul>
        <template v-if="CAMPAIGN_LIST.length == 0">
          <li class="pl-list-nodata">
            <span>등록된 데이터가 없습니다.</span>
          </li>
        </template>
        <template
          v-else
          v-for="data, index in CAMPAIGN_LIST"
        >
          <li
            v-if="data.PHN_CUTT_ID === ''"
            :key="data.id"
          >
            <div>
              <div class="pl-campaign-list-unit">
                <span class="pl-campaign-list-title">캠페인</span>
                <span>{{ data.CPI_NM }} ({{ mixin_convertDate(data.CPI_BGNG_DT, 'yyyy-MM-dd') }} ~ {{ mixin_convertDate(data.CPI_END_DT, 'yyyy-MM-dd') }})</span>
              </div>
              <div class="pl-campaign-list-unit">
                <span class="pl-campaign-list-title">고객명</span>
                <span>
                  {{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(data.CUST_NM) : data.CUST_NM }} ({{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(data.CUST_PHN_NO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(data.CUST_PHN_NO.replace(/[^0-9]/g, "")) }})
                  <strong>총({{ data.CALL_TRY_CNT }})회</strong> 시도
                  <span :class="`pl-round-chip is-sm chat-stat-${ data.status }`">{{ data.CUSL_RS_NM }}</span>
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
                @btnClick="data.CALL_TRY_CNT > 0 ?toggeleExpand(index):''"
              ></compo-tooltip-btn>
            </div>
            <!-- 전화 걸기 버튼 -->
            <div class="pl-campaign-list-btn">
              <v-icon
                class="pl-icon30 call"
                :disabled="data.CUSL_RS_CD === 'COMPLETED' || data.CALL_TRY_CNT >= data.CALL_TRY_LMT"
                @click="callDialog(data)"
              ></v-icon>
            </div>
            <!-- expand -->
            <div v-show="data.expand" class="pl-campaign-list-child">
              <template
                v-for="child in CAMPAIGN_LIST"
                v-if="child.PHN_CUTT_ID !== '' && data.CPI_ID === child.CPI_ID && data.CUSL_ID === child.CUSL_ID && data.CUST_ID === child.CUST_ID"
              >
                <div :key="child.id">
                  <div><strong>{{ child.RNUM }}차 시도</strong></div>
                  <div class="pl-campaign-list-child-wrap">
                    <span class="pl-campaign-list-child-unit">
                      <span class="pl-campaign-list-child-title">
                        상담 시작시간
                      </span>
                      <span class="pl-campaign-list-child-desc">
                        {{ mixin_convertDate(child.CUTT_BGNG_DT, 'yyyy-MM-dd HH:mm:ss') }}
                      </span>
                    </span>
                    <span class="pl-campaign-list-child-unit">
                      <span class="pl-campaign-list-child-title">
                        처리상태
                      </span>
                      <span class="pl-campaign-list-child-desc">
                        {{ child.CUSL_RS_NM }}
                      </span>
                    </span>
                    <span class="pl-campaign-list-child-unit">
                      <span class="pl-campaign-list-child-title">
                        상담 종료시간
                      </span>
                      <span class="pl-campaign-list-child-desc">
                        {{ mixin_convertDate(child.CUTT_END_DT, 'yyyy-MM-dd HH:mm:ss') }}
                      </span>
                    </span>
                    <span class="pl-campaign-list-child-unit">
                      <span class="pl-campaign-list-child-title">
                        결과
                      </span>
                      <span class="pl-campaign-list-child-desc">
                        {{ child.CAMP_RS_NM }}
                      </span>
                    </span>
                    <span class="pl-campaign-list-child-text ">
                      <span class="pl-campaign-list-child-desc">
                        <!-- {{ child.CUTT_CN }} -->
                        <div v-html="mixin_encodeEnter(child.CUTT_CN)"></div>
                      </span>
                    </span>
                  </div>
                </div>
              </template>
            </div>
          </li>
        </template>
      </ul>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'right_campaign',
    data() {
      return{
        common_code : [],
        // 모니터링
        MONITOR_STATUS: [
          { title: '대상', count: 0, icon: 'monitor-target', active: false },
          { title: '처리완료', count: 0, icon: 'monitor-done', active: false },
          { title: '처리중', count: 0, icon: 'monitor-count', active: true },
        ],
        MONITOR_PROGRESS: 0,

        chkTypes: [],
        chkScrollAmount: 200,
        scrollBtnVisable: false,

        cpiNmItems : [],
        CPI_ID : '',
        SCH_CALL_ST_DT : '',
        SCH_CALL_END_DT : '',
        schStDt: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        schEndDt: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        CALL_TRY_CNT : '',
        SCH_UPDOWN : 'UP',
        CAMP_RS_CD : '',

        //전화걸기
        OUT_CALL_DATA: {
          CL_TYPE_CD: 'OUT',
          dropItems: [],
          dropItems2: [],
          CUST_PHN_NO: '',
          CPI_ID: '',
          MODIFY_USE: false,
          TRY_CNT: '',
          LMT_CNT: '',
        },

        MESSAGE : {
          ALERT : {
            SOCKET_ERROR : {alertDialogToggle: true, msg: 'CTI에 로그인이 되어 있지 않습니다.', iconClass: 'is-caution', type: 'default'}
          },
          ERROR : {
            ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
          }
        },

        // list
        CAMPAIGN_LIST: [],
      }
    },
    beforeDestroy(){
      this.$eventBus.$off("busForceEnd"); //eventBus 중복방지를 위해 off
    },

    async created() {

      //전화 끊기(고객 또는 상담사)
      this.$eventBus.$on("busForceEnd", (CALL_DATA) => {
        this.$eventBus.$emit("dialogOutCallClose"); //전화받기 dialog 닫기
      });

      //공통코드설정
      let codeName = ['UPDOWN'];
      this.common_code = await this.mixin_common_code_get_all(codeName);

      this.SCH_CALL_ST_DT = this.$moment(this.schStDt).subtract(7,'days').format('YYYY-MM-DD'); // 통화 시작 일자(일주일전)
      this.SCH_CALL_END_DT = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); // 통화 종료 일자

      this.getCpiNm();
      this.cpiStatHistList(''); //캠페인 이력 목록
    },
    mounted() {
      this.calculateScrollWidth();
    },
    methods: {
      async getCpiNm(){
        const sUrl = '/phone-api/campaign/custmng/selectcombocpicustmng';
        const postParam = {
          CUSL_ID : this.$store.getters["userStore/GE_USER_ROLE"].userId
        }
        const headParam = {
          head: {
            'SERVICE' : 'phone.campaign.custmng.selectcombocpicustmng',
            'METHOD' : 'selectcombocpicustmng',
            'TYPE' : 'BIZ_SERVICE',
          }
        }

        let response = await this.common_postCall(sUrl, postParam, headParam );

        if (!response.HEADER.ERROR_FLAG){
          this.cpiNmItems.push({ text: '전체', value: '' });
          response.DATA.forEach((cpi, index) => {
            this.cpiNmItems.push({ text: cpi.TEXT, value: cpi.VALUE })
          });
        }
      },
      //캠페인 이력 목록
      async cpiStatHistList(schGb) {
        let CUSL_RS = 'PROCESSING';
        this.MONITOR_STATUS.forEach((stat, idx) => {
          if(stat.active){
            if(idx === 0) CUSL_RS = '';
            else if(idx === 1) CUSL_RS = 'COMPLETED';
            else if(idx === 2) CUSL_RS = 'PROCESSING';
            return;
          }
        });

        this.CAMPAIGN_LIST = [];
        let sUrl = '/phone-api/campaign/altmntmng/cpiStatHistList';
        let postParam = {
          CPI_ID : this.CPI_ID
          , CUSL_ID : this.$store.getters["userStore/GE_USER_ROLE"].userId
          , CUSL_RS : CUSL_RS
        }

        if(schGb === 'sch'){
          postParam.CALL_TRY_CNT = this.CALL_TRY_CNT;
          postParam.UPDOWN = this.SCH_UPDOWN;
          postParam.CAMP_RS_CD = this.CAMP_RS_CD;
        }

        let headParam = {
          head : {
          }
        }

        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          if(response.DATA.length > 0){
            for(let data of response.DATA){
              if(!data.PHN_CUTT_ID){
                data.expand = false;
                data.sub_status = '';
                if(data.CUSL_RS_CD  === 'PROCESSING'){
                  data.status = 'cs';
                }else{
                  data.status = 'done';
                }
              }
            }
          }

          this.CAMPAIGN_LIST = response.DATA;

          if(response.MONITOR.length > 0){
            this.MONITOR_STATUS[0].count = response.MONITOR[0].TARGET_CNT;
            this.MONITOR_STATUS[1].count = response.MONITOR[0].COMPLETED_CNT;
            this.MONITOR_STATUS[2].count = response.MONITOR[0].NO_COMPLETED_CNT;
            this.MONITOR_PROGRESS = response.MONITOR[0].COMPLETED_RATE;
          }

          if(response.MONITOR_RS.length > 0){
            response.MONITOR_RS.forEach((chk, index) => {
              chk.id = chk.CD_ID;
              chk.text = chk.CD_NM;
              chk.CNT = chk.CNT;
              if(chk.CD_ID === this.CAMP_RS_CD) chk.selected = true;
              else chk.selected = false;
            });

            this.chkTypes = response.MONITOR_RS;
          }
        }
      },

      cuslStatChg(seq) {
        this.MONITOR_STATUS.forEach((stat, idx) => {
          if(idx === seq) stat.active = true;
          else stat.active = false;
        });

        this.cpiStatHistList(''); //캠페인 목록
      },

      toggeleExpand(index){
        // if(this.CAMPAIGN_LIST[index].child.length) {
          this.CAMPAIGN_LIST[index].expand = !this.CAMPAIGN_LIST[index].expand;
        // }
      },
      toggeleExpandClass(index){
        return this.CAMPAIGN_LIST[index].expand === true ? 'pl-icon20 arrow-down' : 'pl-icon20 arrow-up'
      },

      //조회
      schCpiStatHistList() {
        this.cpiStatHistList('sch');
      },

      callDialog(item) {
        if(this.$socket){
          this.mixin_set_active_tab({PATH_NM:'/CSL_M0100', NODE_TITLE:'전화상담'});
          this.OUT_CALL_DATA.CUST_PHN_NO = this.mixin_setPhoneNo(item.CUST_PHN_NO.replace(/[^0-9]/g, ""));
          this.OUT_CALL_DATA.CUST_ID = item.CUST_ID;
          this.OUT_CALL_DATA.CPI_ID = item.CPI_ID;
          this.OUT_CALL_DATA.MODIFY_USE = false;
          this.OUT_CALL_DATA.TRY_CNT = item.CALL_TRY_CNT;
          this.OUT_CALL_DATA.LMT_CNT = item.CALL_TRY_LMT;

          this.$eventBus.$emit('dialogOutCall', this.OUT_CALL_DATA); //top 전화걸기 호출
        }else{
          this.showAlert(this.MESSAGE.ALERT.SOCKET_ERROR);
          return;
        }
      },
      scrollPaging(type) {
        const listContainer = this.$refs.listContainer;
        type === 'left' ? listContainer.scrollLeft -= this.chkScrollAmount : listContainer.scrollLeft += this.chkScrollAmount;
      },
      calculateScrollWidth(){
        const listContainer_o_W = 500;
        const listContainer_W = this.$refs.listContainer.offsetWidth;
        console.log("🚀 ~ calculateScrollWidth ~ listContainer_W:", listContainer_W)

        if( listContainer_W > listContainer_o_W ) {
          this.scrollBtnVisable = true;
        }
      },

      cpiRscheck (e, seq, campRsCd) {
        this.$nextTick(() => {
          if(e){
            this.chkTypes.forEach((chk, index) => {
              if(index !== seq) chk.selected = false;
            });
            this.CAMP_RS_CD = campRsCd;
          }else{
            this.CAMP_RS_CD = '';
          }

          this.schCpiStatHistList();
        })
      },

    },
    computed: {
    }
  }
</script>

<style lang="scss" scoped>

</style>