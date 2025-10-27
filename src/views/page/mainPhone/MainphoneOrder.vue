<template>
  <div class="">
    <v-tabs class="pl-tabs type-main pa-0" v-model="selectedTabIndex">
      <v-tab
          v-for="tabItem in tabListData"
          :key="tabItem.TAB_ID"
      > {{ tabItem.TAB_NM }}
        <span class="pl-tab-badge" v-if="tabItem.EXPSR_YN ==='Y'">
            {{ !mixin_isEmpty(tabItem.badgeData) ? tabItem.badgeData : '0' }}
          </span>
      </v-tab>
      <v-tabs-items v-model="selectedTabIndex">
        <v-tab-item
            v-for="tabItem in tabListData"
            :key="tabItem.index"
        >
          <!-- //mark: 검색 -->
          <div
              class="d-flex align-center  is-mt-s"
              data-menu="검색"
          >
            <span class="pl-counter ml-0" style="width: 110px;">전체
              <em class="pl-1">
              ({{ !mixin_isEmpty(listGroupData[selectedTabIndex]) ? tabItem.EXPSR_YN ==='Y'? tabListData[selectedTabIndex].badgeData : listGroupData[selectedTabIndex].length : '0' }})
              </em>
              건
            </span>
            <div class="ml-auto pl-btn-wrap">
              <div v-for="srch in tabItem.srch">
              <v-select
                  v-if="srch.DATA_TYPE_CD ==='LPIT_DATETIME_S' && useSrchTerm"
                  :items="srchTermBox"
                  v-model="selectedTerm"
                  class="pl-form"
                  @change="callApi"
              ></v-select>
<!--              <div v-for="srch in item.srch">-->
                <v-select
                    v-if="srch.DATA_TYPE_CD ==='LPIT_GROUP_CD_ID' && useSrchStts"
                    :items="srch.ESNTL_YN ==='Y' ? $linkage.lkag_common_code_get(lkagCommonCode, srch.LKAG_GROUP_CD_ID) : $linkage.lkag_common_code_get(lkagCommonCode, srch.LKAG_GROUP_CD_ID,'전체')"
                    v-model="srch.BSC_VL"
                    item-value="cdValue"
                    @change="callApi"
                    class="pl-form"
                ></v-select>
<!--              </div>-->
              <v-text-field
                  v-if="srch.DATA_TYPE_CD ==='LPIT_INPUT_STRING' && useSrchText"
                  class="pl-form is-lg"
                  v-model="srchTextParam"
                  placeholder="주문번호"
                  oninput="javascript: this.value = this.value.replace(/[^a-z|A-Z|0-9]/g, '' );"
                  v-byte-counter="60"
                  @keyup.enter="callApi"
              />
              </div>
              <compo-tooltip-btn
                  TitleProp="새로고침"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="bottom"
                  :ProgressProp="apiCallProgress"
                  @btnClick="callApi"
              ></compo-tooltip-btn>
            </div>
          </div>
          <!-- //mark: 주문리스트 -->
          <template v-if="!mixin_isEmpty(listGroupData[selectedTabIndex]) && !apiCallProgress">
            <div
                class="is-mt-s" style="overflow-y: scroll; height: calc(100vh - 316px);"
            >
              <div
                  class="pl-order-list"
                  v-for="listItem,idx in listGroupData[selectedTabIndex]"
              >
                <!-- 기본 노출 항목 -->
                <div class="pl-order-list-view">
                  <!-- //mark: 썸네일 -->
                  <div
                      class="pl-order-list-thumb"
                      data-menu="썸네일"
                      v-if="!mixin_isEmpty(tabItem.thumnail)"
                  >
                    <v-img
                        v-if="!mixin_isEmpty(tabItem.thumnail)"
                        :src="tabItem.thumnail.COL_NM ? listItem[tabItem.thumnail.COL_NM] : require('@/assets/img/@admin_palette.png')"
                        contain
                        :width="tabItem.thumnail.WD_SZ"
                        :height="tabItem.thumnail.HT_SZ"
                        :style="`border: ${ tabItem.thumnail.LN_PX }px ${ tabItem.thumnail.OUTLN_TYPE_NM } ${ tabItem.thumnail.OUTLN_COLOR_CD }`"
                    />
                  </div>
                  <!-- //mark: 주문정보 -->
                  <div
                      class="pl-order-list-summary"
                      data-menu="주문정보"
                  >
                    <div
                        v-for="row, index in tabItem.listGroup"
                        :key="index"
                        class="pl-order-list-summary-unit"
                    >
                      <div
                          v-for="child, index in row.dtlData"
                          :key="index"
                          class="pl-order-list-summary-form"
                      >
                    <span
                        v-if="child.is_label_chk"
                        :style="`font-weight: ${child.EPSZ_YN ? '700' : 'normal'}; color: ${child.COLOR_CD};`">
                      {{ child.LABEL_NM + ' :  '}}
                    </span>
                        <span
                            :style="`font-weight: ${child.RSPNS_EPSZ_YN ? '700' : 'normal'}; color: ${child.RSPNS_COLOR_CD};`">
                      {{ parseParam(child.DATA_TYPE_CD, listItem[child.COL_NM]) }}
                    </span>
                      </div>
                    </div>
                  </div>
                  <!-- //mark: 진행상태 뱃지 -->
                  <div
                      class="pl-order-list-badge"
                      data-menu="진행상태"
                      v-if="tabItem.stts"
                      :style="`align-self: ${ tabItem.stts.SORT_MTHD_VL}`"
                  >
                    <span
                        class="pl-round-chip is-mid"
                        :style="`background-color: ${ tabItem.stts.BG_COLOR_CD }`"
                    >
                  <span
                      :style="`font-weight: ${ tabItem.stts.EPSZ_YN === true ? '700' : 'normal' }; color: ${ tabItem.stts.COLOR_CD }`"
                  >
                    {{ listItem[tabItem.stts.COL_NM] }}
                  </span>
                </span>
                  </div>
                </div>
                <div
                    class="text-center"
                    v-if="!mixin_isEmpty(tabItem.dwnGroup) && !mixin_isEmpty(listItem)"
                >
                  <!-- 상세 버튼 -->
                  <compo-tooltip-btn
                      v-if="!mixin_isEmpty(listItem) && !mixin_isEmpty(tabItem.dwnGroup)"
                      TitleProp="상세 검색"
                      ClassProp="pl-tooltip-btn is-line"
                      :IconProp="listItem.dtlActive ? 'pl-icon20 arrow-down' : 'pl-icon20 arrow-up'"
                      StyleProp="border: 0"
                      TooltipPositionProp="bottom"
                      @btnClick="[toggleDetail(idx), mixin_searchDetailToggle()]"
                  ></compo-tooltip-btn>
                </div>
                <!-- //mark: 토글 상세 항목 -->
                <div
                    v-if="listItem.dtlActive"
                    class="pl-order-list-detail"
                    data-menu="상세정보"
                >
                  <div
                      v-for="row, index in tabItem.dwnGroup"
                      :key="index"
                      class="pl-order-list-detail-unit"
                  >
                    <strong class="pl-order-list-detail-unit-title">
                      {{ row.LIST_DWN_GROUP_TTL }}
                    </strong>
                    <div class="pl-order-list-detail-list is-mt-s">
                      <div
                          v-for="child, index2 in row.dtlData"
                          :key="index2"
                          class="pl-order-list-detail-list-desc"
                      >
                    <span
                        v-if="child.is_label_chk"
                        class="pl-order-list-detail-list-desc-label"
                        :style="`flex-basis: ${row.WD_SZ}px; font-weight: ${child.EPSZ_YN ? '700' : 'normal'}; color: ${child.COLOR_CD};`">
                      {{ child.LABEL_NM }}
                    </span>
                        <span
                            :style="`font-weight: ${child.RSPNS_EPSZ_YN ? '700' : 'normal'}; color: ${child.RSPNS_COLOR_CD};`">
                       {{ parseParam(child.DATA_TYPE_CD, listItem[child.COL_NM]) }}
                    </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </template>
          <template v-else-if="apiCallProgress">
            <div
                class="pl-alarm-list-wrap type-script is-mt-m"
                style="height: calc(100vh - 375px);">
              <div class="pl-list-nodata">
                <span>데이터를 조회중입니다.</span>
              </div>
            </div>
          </template>
          <template v-else>
            <div
                class="pl-alarm-list-wrap type-script is-mt-m"
                style="height: calc(100vh - 375px);">
              <div class="pl-list-nodata">
                <span>등록된 데이터가 없습니다.</span>
              </div>
            </div>
          </template>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>

<script>
import store from "@/store";
import {linkage} from "@/linkage/linkage.js";

export default {
  name: 'MainphoneOrder',
  props: {
    // DataProp: Array
    CUST_INFO_PROP: {
      type: Object,
    },
    LAYOUT_ID_PROP: {
      type: String,
    },
    SHOW_DIALOG_PROP: {
      type: Boolean,
      default : false,
    },
  },
  data() {
    return {
      BEAN_ID: null,
      LKAG_MST_ID: null,

      custInfoProps: this.CUST_INFO_PROP,


      commonCode: [],
      lkagCommonCode: [],
      lkagCommCdList: [],
      tabListData: [],
      lkagList: [],
      // 상세내역 model

      // mark: data: 검색
      searchData: {
        search01: '1개월',
        search02: '전체',
        searchItems01: 3,
        searchItems02: ['전체'],
      },
      srchTermBox: [],
      useSrchTerm: [],
      useSrchStts: [],
      useSrchText: [],
      selectedTerm: '',
      selectedStts: '',
      srchTextParam: '',
      // 기간
      today: this.$moment(this.date).format("YYYYMMDDHHmmss").substring(0, 8) + '235959',
      startDate: '',

      selectedTabIndex: 0,

      // 전체 응답 데이터 저장용 객체
      rspnsData: {},

      // 순회용 데이터 저장 list
      tabData: [],
      listGroupData: [],

      tabItemProps: [],
      dataTabBadge: '',
      dataThumnail: '',
      dataStts: '',
      dataListGroup: [],
      dataDwnGroup: [],

      // 데이터 표현을 위한 배열
      active: true,
      countForAlarm : 0,
      apiCallProgress : false,
    }
  },
  methods: {
    async callApi(type) {
      console.log("called, callApi")
      if (!this.mixin_isEmpty(this.custInfoProps.CUST_ID) && !this.mixin_isEmpty(this.lkagList)) {
        await this.getRspnsData(type);
      } else if(this.mixin_isEmpty(this.custInfoProps.CUST_ID) && this.tabListData[this.selectedTabIndex].srch.some(el =>
        el.DATA_TYPE_CD === 'LPIT_INPUT_STRING') && !this.mixin_isEmpty(this.srchTextParam)) {
        await this.getRspnsData(type);
      }
    },
    // 레이아웃 조회
    async getLayout() {
      console.log("called, getLayout")
      this.lkagList = [];
      let sUrl = '/api/common/layout/selectLayout'
      let postParam = {
        SCHEMA_ID: store.getters["authStore/GE_CUSTCO_TENANT_ID"]
        , CUSTCO_ID: store.getters["userStore/GE_USER_ROLE"].company.CD
        , CERT_CUSTCO_ID: store.getters['authStore/GE_CERT_CUSTCO_ID']
        , LAYOUT_ID: this.LAYOUT_ID_PROP
      }
      let headParam = {head: {}}

      let response = await this.common_postCall(sUrl, postParam, headParam);

      // 카페24 인증 S
      if(response.HEADER.CAFE24_AT !== undefined && !response.HEADER.CAFE24_AT) {
        if( store.getters['userStore/GE_USER_ROLE'].atrtGroupId === '1' || store.getters['userStore/GE_USER_ROLE'].atrtGroupId === '2' ) {
          this.showAlertInfo({msg: '카페24 인증정보가 만료되었습니다. 인증을 진행합니다.', callAfter: () => {
              this.popupwindow(atob(response.HEADER.CAFE24_ACU), "카페24 인증", 850, 800);
            }
          });

        }else {
          this.showToastCaution({msg: "카페24 인증정보가 없습니다."});
        }
      }
      // 카페24 인증 E

      if (!response.HEADER.ERROR_FLAG) {
        if (!this.mixin_isEmpty(response.tabList)) this.setTabLayout(response.tabList);                     // 탭
        if (!this.mixin_isEmpty(response.thumnail)) this.setThumbLayout(response.thumnail);                 // 썸네일
        if (!this.mixin_isEmpty(response.stts)) this.setSttsLayout(response.stts);                          // 진행상태
        if (!this.mixin_isEmpty(response.srch)) this.setSrchLayout(response.srch);                          // 검색
        if (!this.mixin_isEmpty(response.listGroup)) this.setListGroupLayout(response.listGroup);           // 주문정보
        if (!this.mixin_isEmpty(response.dwnGroup)) this.setListDwnGroupLayout(response.dwnGroup);          // 상세정보

        this.lkagCommonCode = await this.$linkage.lkag_common_code_get_all(this.LKAG_MST_ID, this.lkagCommCdList);  //연동데이터셋콤보박스
        if(this.custInfoProps.CUST_ID > -1 && !this.mixin_isEmpty(this.rspnsData)){
          this.tabListData.forEach(el =>{
          let tabIdx = this.tabListData.indexOf(el)
          this.setDataList(tabIdx);
          })
        }
        // if(!this.mixin_isEmpty(this.rspnsData)){
        //   this.setTabBadgeData(this.rspnsData, 'ALL');
        // }
      } else {
        this.noneExistLayout(response.HEADER.ERROR_MSG)
      }
    },
    popupwindow(url, title, w, h) {
      var left = (screen.width/2)-(w/2);
      var top = (screen.height/2)-(h/2);
      return window.open(url, title, 'width='+w+', height='+h+', top='+top+', left='+left);
    },
// 탭 데이터
    setTabLayout(data) {
      console.log("called, setTabLayout")
      let tabList = []
      this.BEAN_ID = data[0].LKAG_BEAN_ID
      this.LKAG_MST_ID = data[0].LKAG_MST_ID
      // this.getLkagCommCd();
      for (let i in data) {
        tabList.push({
          TAB_ID: data[i].TAB_ID
          , SORT_ORD: data[i].SORT_ORD
          , TAB_NM: data[i].TAB_NM
          , COL_NM: data[i].COL_NM
          , LKAG_ID: data[i].LKAG_ID
          , EXPSR_YN: data[i].EXPSR_YN
          , LKAG_MST_ID: data[i].LKAG_MST_ID
          , RSPNS_ARTCL_ID: data[i].RSPNS_ARTCL_ID
          , DATA_TYPE_CD: data[i].DATA_TYPE_CD
          , UP_RSPNS_ARTCL_COL_NM: data[i].UP_RSPNS_ARTCL_COL_NM
          , UP_RSPNS_ARTCL_ID: data[i].UP_RSPNS_ARTCL_ID
          , UP_RSPNS_DATA_CD: data[i].UP_RSPNS_DATA_CD
          , isTabBadgeChk: this.mixin_isEmpty(data[i].RSPNS_ARTCL_ID) ? false : true
          , thumnail: {}
          , stts: {}
          , srch: {}
          , listGroup: {}
          , dwnGroup: {}
        })
        this.addLkagList(i, data[i]);
        this.listGroupData[i] = [];
      }
      this.tabListData = tabList;
    },
    setSrchLayout(data) {
      // console.log("srch data", data)
      let srchList = []
      for (let i in this.tabListData) {
        srchList[i] = []
      }
      for (let i in data) {
      this.useSrchTerm[i] = false;
      this.useSrchStts[i] = false;
      this.useSrchText[i] = false;
        let srch = {
          BSC_VL: data[i].BSC_VL
          , COL_NM: data[i].COL_NM
          , ESNTL_YN: data[i].ESNTL_YN
          , LKAG_GROUP_CD_ID: data[i].LKAG_GROUP_CD_ID
          , LKAG_ID: data[i].LKAG_ID
          , DATA_TYPE_CD: data[i].DATA_TYPE_CD
          , LKAG_MST_ID: data[i].LKAG_MST_ID
          , LKAG_NM: data[i].LKAG_NM
          , TAB_ID: data[i].TAB_ID
        }
        if (data[i].DATA_TYPE_CD === 'LPIT_GROUP_CD_ID') {
          this.lkagCommCdList.push(data[i].LKAG_GROUP_CD_ID)
        }
        let idx = this.tabListData.findIndex((element) => element.TAB_ID === data[i].TAB_ID)
        srchList[idx].push(srch)
        this.toggleSrchBox(data[i], i);
        this.addLkagList(idx, data[i]);
      }
      for (let i in this.tabListData) {
        this.tabListData[i].srch = srchList[i];
      }
    },
    toggleSrchBox(item, index) {
      // console.log('setToggle',item)
      if (item.DATA_TYPE_CD === 'LPIT_DATETIME_S') {
        this.useSrchTerm[index] = Boolean(true);
      } else if (item.DATA_TYPE_CD === 'LPIT_GROUP_CD_ID') {
        this.useSrchStts[index] = Boolean(true);
      } else if (item.DATA_TYPE_CD === 'LPIT_INPUT_STRING') {
        this.useSrchText[index] = Boolean(true);
      }
    },
    setThumbLayout(data) {
      for (let i in data) {
        let thumnail = {
          LKAG_ID: data[i].LKAG_ID
          , is_show: this.mixin_isEmpty(data[i].LKAG_ID) ? true : false
          , LIST_ID: data[i].LIST_ID
          , HT_SZ: data[i].HT_SZ
          , WD_SZ: data[i].WD_SZ
          , OUTLN_COLOR_CD: data[i].OUTLN_COLOR_CD
          , OUTLN_TYPE_NM: data[i].OUTLN_TYPE_NM
          , LN_PX: parseInt(data[i].LN_PX)
          , RSPNS_ARTCL_ID: data[i].RSPNS_ARTCL_ID
          , COL_NM: data[i].COL_NM
          , DATA_TYPE_CD: data[i].DATA_TYPE_CD
          , UP_RSPNS_ARTCL_COL_NM: data[i].UP_RSPNS_ARTCL_COL_NM
          , UP_RSPNS_ARTCL_ID: data[i].UP_RSPNS_ARTCL_ID
          , UP_RSPNS_DATA_CD: data[i].UP_RSPNS_DATA_CD
          , TAB_ID: data[i].TAB_ID
        }
        let idx = this.tabListData.findIndex((element) => element.TAB_ID === data[i].TAB_ID)
        if (this.mixin_isEmpty(data[i].LIST_ID)) {
          this.tabListData[idx].thumnail = {};
        } else {
          this.tabListData[idx].thumnail = thumnail;
        }
        this.addLkagList(idx, data[i]);
        // console.log("this.tabListData[idx].thumnail", this.tabListData[idx].thumnail)
      }
    },
    setSttsLayout(data) {
      for (let i in data) {
        let stts = {
          is_show: this.mixin_isEmpty(data[i].LIST_ID) ? false : true
          , LIST_ID: data[i].LIST_ID
          , LKAG_ID: data[i].LKAG_ID
          , STTS_NM: data[i].STTS_NM
          , EPSZ_YN: data[i].EPSZ_YN === 'Y' ? true : false
          , COLOR_CD: data[i].COLOR_CD
          , BG_COLOR_CD: data[i].BG_COLOR_CD
          , SORT_MTHD_CD: data[i].SORT_MTHD_CD
          , SORT_MTHD_VL: data[i].SORT_MTHD_VL
          , RSPNS_ARTCL_ID: data[i].RSPNS_ARTCL_ID
          , COL_NM: data[i].COL_NM
          , DATA_TYPE_CD: data[i].DATA_TYPE_CD
          , UP_RSPNS_ARTCL_COL_NM: data[i].UP_RSPNS_ARTCL_COL_NM
          , UP_RSPNS_ARTCL_ID: data[i].UP_RSPNS_ARTCL_ID
          , UP_RSPNS_DATA_CD: data[i].UP_RSPNS_DATA_CD
          , TAB_ID: data[i].TAB_ID
        }
        let idx = this.tabListData.findIndex((element) => element.TAB_ID === data[i].TAB_ID)
        this.tabListData[idx].stts = stts;
        this.addLkagList(idx, data[i]);
      }
    },
    setListGroupLayout(data) {
      const resData = data;
      // 데이터 초기화
      let listGroup = [];
      for (let i in this.tabListData) {
        listGroup[i] = []
      }
      // 원래의 배열을 반복하여 그룹화
      resData.forEach(item => {
        // console.log("TAB_ID2", item.TAB_ID)
        let tabIdx = this.tabListData.findIndex((element) => element.TAB_ID === item.TAB_ID)
        this.addLkagList(tabIdx, item);
        let i = null;
        const listGroupId = item.LIST_GROUP_ID;
        const beforeDtlData = {...item};
        let afterDtlData = {
          LIST_GROUP_ID: item.LIST_GROUP_ID
          , LIST_GROUP_DTL_ID: beforeDtlData.LIST_GROUP_DTL_ID
          , LKAG_ID: beforeDtlData.LKAG_ID
          , RSPNS_ARTCL_ID: beforeDtlData.RSPNS_ARTCL_ID
          , COL_NM: beforeDtlData.COL_NM
          , DATA_TYPE_CD: beforeDtlData.DATA_TYPE_CD
          , UP_RSPNS_ARTCL_COL_NM: beforeDtlData.UP_RSPNS_ARTCL_COL_NM
          , UP_RSPNS_ARTCL_ID: beforeDtlData.UP_RSPNS_ARTCL_ID
          , UP_RSPNS_DATA_CD: beforeDtlData.UP_RSPNS_DATA_CD
          , is_label_chk: this.mixin_isEmpty(beforeDtlData.LABEL_NM) ? false : true
          , LABEL_NM: beforeDtlData.LABEL_NM
          , EPSZ_YN: beforeDtlData.EPSZ_YN == 'Y' ? true : false
          , COLOR_CD: beforeDtlData.COLOR_CD
          , RSPNS_EPSZ_YN: beforeDtlData.RSPNS_EPSZ_YN == 'Y' ? true : false
          , RSPNS_COLOR_CD: beforeDtlData.RSPNS_COLOR_CD
          , TAB_ID: item.TAB_ID
        }
        // console.log("afterDtlData", afterDtlData)
        if (this.mixin_isEmpty(listGroup[tabIdx])) {
          listGroup[tabIdx].push({
            LIST_ID: item.LIST_ID
            , LIST_GROUP_ID: item.LIST_GROUP_ID
            , GROUP_SORT_ORD: item.GROUP_SORT_ORD
            , dtlData: [afterDtlData]
            , TAB_ID: item.TAB_ID
            , dtlActive: false
          });
          i = listGroup[tabIdx].length - 1;
        } else {
          i = listGroup[tabIdx].length - 1;
          // console.log("d안비었을때 listGroup[", listGroup)
          if (Object.keys(listGroup[tabIdx][i]).includes('LIST_GROUP_ID')) {
            // console.log("키있을때 listGroup listGroupId", listGroupId)
            if (listGroup[tabIdx][i].LIST_GROUP_ID === listGroupId) {
              // console.log("키있을때 키 같아 그럼 디테일에 추가", listGroupId)
              listGroup[tabIdx][i].dtlData.push(afterDtlData);
            } else {
              // console.log("키있을때 키 달라 그럼 같은인덱스에 추가", listGroupId)
              listGroup[tabIdx].push({
                LIST_ID: item.LIST_ID
                , LIST_GROUP_ID: item.LIST_GROUP_ID
                , GROUP_SORT_ORD: item.GROUP_SORT_ORD
                , dtlData: [afterDtlData]
                , TAB_ID: item.TAB_ID
                , dtlActive: false
              });
            }
          }
        }
        listGroup[tabIdx][i].row_item = listGroup[tabIdx][i].dtlData.length
      });
      for (let i in this.tabListData) {
        this.tabListData[i].listGroup = listGroup[i]
        // console.log("this.tabListData[i].listGroup여기서 확인 ", this.tabListData[i].listGroup)
        // console.log("this.tabListData[i].listGroup", this.tabListData[i].listGroup)
      }
    },
    setListDwnGroupLayout(data) {
      const resData = data;
      let dwnGroup = [];
      for (let i in this.tabListData) {
        dwnGroup[i] = []
      }

      // 원래의 배열을 반복하여 그룹화
      resData.forEach(item => {
        let tabIdx = this.tabListData.findIndex((element) => element.TAB_ID === item.TAB_ID)
        this.addLkagList(tabIdx, item);
        let i = null;
        const listDwnGroupId = item.LIST_DWN_GROUP_ID;
        const tabId = item.TAB_ID;
        let dtlData = {
          LIST_DWN_GROUP_ID: item.LIST_DWN_GROUP_ID
          , LIST_DWN_GROUP_DTL_ID: item.LIST_DWN_GROUP_DTL_ID
          , LKAG_ID: item.LKAG_ID
          , RSPNS_ARTCL_ID: item.RSPNS_ARTCL_ID
          , COL_NM: item.COL_NM
          , is_label_chk: this.mixin_isEmpty(item.LABEL_NM) ? false : true
          , LABEL_NM: item.LABEL_NM
          , EPSZ_YN: item.EPSZ_YN == 'Y' ? true : false
          , COLOR_CD: item.COLOR_CD
          , RSPNS_EPSZ_YN: item.RSPNS_EPSZ_YN == 'Y' ? true : false
          , RSPNS_COLOR_CD: item.RSPNS_COLOR_CD
          , TAB_ID: item.TAB_ID
          , DATA_TYPE_CD: item.DATA_TYPE_CD
          , UP_RSPNS_ARTCL_COL_NM: item.UP_RSPNS_ARTCL_COL_NM
          , UP_RSPNS_ARTCL_ID: item.UP_RSPNS_ARTCL_ID
          , UP_RSPNS_DATA_CD: item.UP_RSPNS_DATA_CD
        }
        if (this.mixin_isEmpty(dwnGroup[tabIdx])) {
          dwnGroup[tabIdx].push({
            LIST_ID: item.LIST_ID
            , LIST_DWN_GROUP_ID: item.LIST_DWN_GROUP_ID
            , LIST_DWN_GROUP_TTL: item.LIST_DWN_GROUP_TTL
            , WD_SZ: item.WD_SZ
            , GROUP_SORT_ORD: item.GROUP_SORT_ORD
            , active: false
            , dtlData: [dtlData]
            , TAB_ID: item.TAB_ID
          });
          i = dwnGroup[tabIdx].length - 1;
        } else {
          i = dwnGroup[tabIdx].length - 1;
          if (Object.keys(dwnGroup[tabIdx][i]).includes('LIST_DWN_GROUP_ID')) {
            if (dwnGroup[tabIdx][i].LIST_DWN_GROUP_ID === listDwnGroupId) {
              dwnGroup[tabIdx][i].dtlData.push(dtlData);
            } else {
              dwnGroup[tabIdx].push({
                LIST_ID: item.LIST_ID
                , LIST_DWN_GROUP_ID: item.LIST_DWN_GROUP_ID
                , LIST_DWN_GROUP_TTL: item.LIST_DWN_GROUP_TTL
                , WD_SZ: item.WD_SZ
                , GROUP_SORT_ORD: item.GROUP_SORT_ORD
                , active: false
                , dtlData: [dtlData]
                , TAB_ID: item.TAB_ID
              });
            }
          }
        }
      });
      for (let i in this.tabListData) {
        this.tabListData[i].dwnGroup = dwnGroup[i];
      }
    },
    async getRspnsData(type) {
      console.log("called, getRspnsData")
      this.listGroupData[this.selectedTabIndex] =[]
      this.apiCallProgress = true;
      this.countForAlarm = 0;
      let tabIndex = [];
      if (type === 'ALL') {
        this.rspnsData = {}
        this.srchTextParam = ''
        for (let i in this.tabListData) {
          tabIndex.push(i);
        }
      } else {
        tabIndex.push(this.selectedTabIndex)
      }
      // this.apiCallProgress = true;

      try {
        for (let k in tabIndex) {
          for (let i in this.lkagList[tabIndex[k]]) {
            let sUrl = '/intgr-api/commerce/call_api'
            let postParam = {
              BEAN_ID: this.BEAN_ID
              , CERT_CUSTCO_ID: this.$store.getters["authStore/GE_CERT_CUSTCO_ID"]
              , LKAG_ID: this.lkagList[tabIndex[k]][i].LKAG_ID
              , custId: this.custInfoProps.CUST_ID
            }
            let headParam = {head: {}};

            // lkag_id에 포함된 필수 파라미터들을 찾아서 넣기
            let lkagKeyList = Object.keys(this.lkagList[tabIndex[k]][i])

            let parameterType = null;
            lkagKeyList.forEach(key => {
              if (key !== 'LKAG_ID' && key !== 'TAB_ID') {
                if (typeof this.lkagList[tabIndex[k]][i][key] === 'object') {
                  parameterType = this.lkagList[tabIndex[k]][i][key].type
                  switch (parameterType) {
                    case 'LPIT_DATETIME_S':
                      postParam[key] = this.calculateDate;
                      break;
                    case 'LPIT_DATETIME_E' :
                      postParam[key] = this.today;
                      break;
                    case 'LPIT_GROUP_CD_ID' :
                      this.tabListData[tabIndex[k]].srch.forEach(item => {
                        if (item.COL_NM === key) postParam[key] = item.BSC_VL
                      })
                      break;
                    case 'LPIT_INPUT_STRING' :
                      postParam[key] = this.srchTextParam
                      break;
                  }
                }
              }
            });

            if (!(parameterType === 'LPIT_INPUT_STRING' && this.mixin_isEmpty(this.srchTextParam))) {
              let response = await this.common_postCall(sUrl, postParam, headParam)
              if (!response.HEADER.ERROR_FLAG) {
                if (!this.mixin_isEmpty(response.DATA2[0])) {
                  this.rspnsData[this.lkagList[tabIndex[k]][i].LKAG_ID] = JSON.parse(JSON.stringify(response.DATA2[0]));
                } else {
                  this.rspnsData[this.lkagList[tabIndex[k]][i].LKAG_ID] = {};
                }
              } else {
                this.showToastCaution({msg: response.HEADER.ERROR_MSG});
              }
            }
          }
          this.setDataList(tabIndex[k]);
        }
      } catch(e){
        this.apiCallProgress = false;
      }

      console.log("this.rspnsData : {} " , this.rspnsData );
      console.log("this.tabListData : {} " , this.tabListData );


      let tabLkagId = this.tabListData[this.selectedTabIndex].listGroup[0].dtlData[0].LKAG_ID;

      this.apiCallProgress = false;
      this.orderListAlarm();
    },
    // 각 탭에 뿌릴 응답데이터 세팅
    setDataList(index) {
      // 부모 데이터 타입
      let upDataType = this.tabListData[index].listGroup[0].dtlData[0].UP_RSPNS_DATA_CD;
      // 해당 항목 응답 ID
      let itemLkagId = this.tabListData[index].listGroup[0].dtlData[0].LKAG_ID
      // 해당 항목 부모 응답 NM
      let itemUpRspnsNm = this.tabListData[index].listGroup[0].dtlData[0].UP_RSPNS_ARTCL_COL_NM

      // 주문정보 리스트에 첫 번째 그룹의 첫 번째 항목의 부모요소가 배열인지
      if (upDataType === "LPIT_ARRAY") {

        // Array일 때 키로 배열 찾기
        if (!this.mixin_isEmpty(this.rspnsData[itemLkagId])) {
          this.listGroupData.splice(index,1, this.findListWithKey(this.rspnsData[itemLkagId], itemUpRspnsNm))
          if(!this.mixin_isEmpty(this.listGroupData[index])) {
            this.listGroupData[index].forEach((item) => {
              let idx = this.listGroupData[index].indexOf(item)
              item.dtlActive =  false;
            })
          }
        } else {
          this.listGroupData[index] = []
        }
      } else if (upDataType === "LPIT_OBJECT") { // OBJECT일 때
        this.listGroupData[index] = []
        this.listGroupData[index].push(this.findListWithKey(this.rspnsData[itemLkagId], itemUpRspnsNm));
      } else if (upDataType) {
        this.listGroupData[index] = []
      }

      this.useSrchTerm[index] = false;
      this.useSrchStts[index] = false;
      this.useSrchText[index] = false;
      for (let i in this.tabListData[index].srch) {
        this.toggleSrchBox(this.tabListData[index].srch[i])
      }
      if(!this.mixin_isEmpty(this.rspnsData)){
        // this.setTabBadgeData(this.rspnsData, type);
        this.setTabBadgeData(index);
      }
      this.mixin_isEmpty(this.listGroupData[index]) ? null : this.countForAlarm++;
    },
    // Array 찾기
    findListWithKey(data, key) {
      for (const prop in data) {
        if (typeof data[prop] === 'object' && data[prop] !== null) {
          if (prop === key && Array.isArray(data[prop])) {
            return data[prop];
          } else if (prop === key && !Array.isArray(data[prop])) {
            return data[prop];
          } else {
            const result = this.findListWithKey(data[prop], key);
            if (result) {
              return result;
            }
          }
        }
      }
      return [];
    },
    // 각 탭이 세팅될 때 마다 뱃지데이터 설정
    setTabBadgeData(idx) {
        let selectedTab = this.tabListData[idx];
        let lkagId = selectedTab.LKAG_ID;
        // console.log("selectedTab", selectedTab)
        if (selectedTab.EXPSR_YN === 'Y') {
          if (!this.mixin_isEmpty(selectedTab.UP_RSPNS_ARTCL_COL_NM)) {
            let obj = this.findListWithKey(this.rspnsData[lkagId], selectedTab.UP_RSPNS_ARTCL_COL_NM)
            // console.log("obj", obj)
            // tab response데이터 가공
            selectedTab.badgeData = obj[selectedTab.COL_NM];
          } else {
            // console.log("rspnsData",this.rspnsData)
            selectedTab.badgeData = this.rspnsData[lkagId][selectedTab.COL_NM];
          }
        } else {
          selectedTab.badgeData = 0;
        }
    },
    addLkagList(tabIndex, obj) {
      if (this.mixin_isEmpty(this.lkagList[tabIndex])) this.lkagList[tabIndex] = [];

      const exists = this.lkagList[tabIndex].some(item => item.LKAG_ID === obj.LKAG_ID);
      if (!exists) {
        this.lkagList[tabIndex].push({LKAG_ID: obj.LKAG_ID, TAB_ID: obj.TAB_ID,});
      }
      // 탭 별 사용 LKAG 항목, COL_NM(컬럼이름)과 BSC_VL(기본값), 데이터 타입까지 오브젝트로 가공
      if (!this.mixin_isEmpty(obj.PARAM_ARTCL_ID)) {
        let idx = this.lkagList[tabIndex].findIndex((element) => element.LKAG_ID === obj.LKAG_ID)
        this.lkagList[tabIndex][idx][obj.COL_NM] = {
          [obj.COL_NM]: obj.BSC_VL
          , type: obj.DATA_TYPE_CD
        }
      }
    },
    // 응답 파라미터를 지정된 형식에 따라 변환
    parseParam(type, param) {
      let parsedParam = null;
      switch (type) {
        case 'LPIT_INT':
          parsedParam = this.mixin_convertNumToComma(Math.round(param))
          break;
        case 'LPIT_STRING':
          parsedParam = param
          break;
        case 'LPIT_DATETIME':
          parsedParam = this.mixin_convertDate(param, 'yyyy-MM-dd HH:mm:ss')
          break;
      }
      return parsedParam;
    },
    // 레이아웃이 존재 하지 않을 때, alert창 출력 후 주문정보창 닫기
    noneExistLayout(msg){
      this.showAlertCaution({
        msg: msg, callAfter: () => {
          this.$emit('closeOrderList');
        }
      })
    },
    // 주문내역이 존재하는 경우 알람
    orderListAlarm() {
      let orderListIndex = this.$store.getters["userStore/GE_RIGHT_MENU"].findIndex(i => i.ICON_CLASS_NM === 'orderlist')
      // console.log("countForAlarm", this.countForAlarm)
      if (this.countForAlarm > 0 && !this.SHOW_DIALOG_PROP) {
        this.$store.commit("userStore/MU_ANIMATION_ACTIVE", orderListIndex);
      } else {
        this.$store.commit("userStore/MU_ANIMATION_INACTIVE", orderListIndex);
      }
    },
    // 주문내역 상세 클릭 시 dtlActive 값 변경
    toggleDetail(idx){
      this.$set(this.listGroupData[this.selectedTabIndex], idx, {
        ...this.listGroupData[this.selectedTabIndex][idx],
        dtlActive: !this.listGroupData[this.selectedTabIndex][idx].dtlActive
      });
    },
  },
  async mounted() {

  },
  async created() {
    console.log("--------------------------------created------------")
    // 기간검색용 공통코드
    let codeName = ['LKAG_SRCH_TERM']
    this.commonCode = await this.mixin_common_code_get_all(codeName);
    this.srchTermBox = await this.mixin_common_code_get(this.commonCode, 'LKAG_SRCH_TERM')
    this.selectedTerm = 'LST_3_MONTH';

    if(!this.mixin_isEmpty(this.LAYOUT_ID_PROP)){
      await this.getLayout();
    } else {
      this.noneExistLayout('등록된 레이아웃이 없습니다.')
    }
    if(!this.mixin_isEmpty(this.CUST_INFO_PROP) && this.CUST_INFO_PROP.CUST_ID > -1){
      this.custInfoProps = this.CUST_INFO_PROP
      await this.callApi('ALL');
    }
  },
  computed: {
    // 기간 검색용
    calculateDate() {
      let startDate = null;
      switch (this.selectedTerm) {
        case 'LST_1_DAY':
          startDate = this.today.substring(0, 8) + '000000';
          break;
        case 'LST_3_DAY':
          startDate = this.$moment(this.date).subtract(3, 'day').format("YYYYMMDDHHmmss").substring(0, 8) + '000000';
          break;
        case 'LST_1_WEEK':
          startDate = this.$moment(this.date).subtract(1, 'week').format("YYYYMMDDHHmmss").substring(0, 8) + '000000';
          break;
        case 'LST_1_MONTH':
          startDate = this.$moment(this.date).subtract(1, 'month').format("YYYYMMDDHHmmss").substring(0, 8) + '000000';
          break;
        case 'LST_3_MONTH':
          startDate = this.$moment(this.date).subtract(89, 'day').format("YYYYMMDDHHmmss").substring(0, 8) + '000000';
          break;
      }
      return startDate;
    },
  },
  watch: {
    // 바뀐값이 즉시 렌더링 되지 않아서 감시
    selectedTabIndex() {
      if(!this.mixin_isEmpty(this.rspnsData)) {
        // console.log("set data")
        // this.setDataList(this.selectedTabIndex)
      }
    },
    SHOW_DIALOG_PROP() {
      if(this.SHOW_DIALOG_PROP){
        this.selectedTabIndex = 0;
        this.getLayout();
        this.countForAlarm = 0;
        this.orderListAlarm();
      // console.log(this.SHOW_DIALOG_PROP, "true")
      }else{
        this.srchTextParam = ''
        this.countForAlarm = 0;
        this.orderListAlarm();
      }
    },
    // 고객정보 변경 시 전체 데이터 조회
    async CUST_INFO_PROP() {
      // console.log("called", this.custInfoProps)
      this.custInfoProps = this.CUST_INFO_PROP
      if(this.custInfoProps.CUST_ID > -1){
        await this.callApi('ALL');
      }
    },
  },
  beforeDestroy() {
    console.log("--------------------------------before destroy------------")
  }
}
</script>

<style lang="scss" scoped>

</style>