<template>
  <div>
    <!-- search form -->
    <div class="pl-search-form">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            {{ SearchTitleProp }}
            <v-icon class="pl-icon20 required"></v-icon>
          </span>
          <div class="pl-desc">
            <v-select
            v-model="dropSelected"
            class="pl-form"
            :items="SearchDataDrop.stat"
            ></v-select>
            <v-select
            v-model="dropSelected2"
            class="pl-form"
            :items="SearchDataDrop.name"
            ></v-select>
            <v-text-field
              v-model="searchInput"
              class="pl-form is-lg"
              value=""
              placeholder="검색어 입력"
              @keyup.enter="search('',SearchTitleProp)"/>
            <v-btn
              class="pl-btn is-icon"
              @click="search('',SearchTitleProp)"
            >
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
          </div>
        </div>
      </div>
      <div class="is-right">
        전체 <strong>({{ items.length }})건</strong>
      </div>
    </div>
    <!-- grid -->
    <v-data-table
      class="pl-grid has-control"
      :headers="headers"
      :items="items"
      :item-class="isActiveRow"
      style="cursor:pointer;"
      v-model="SEL_LIST"
      fixed-header
      item-key="index"
      height="530px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      :page.sync="page"
      @page-count="pageCount = $event"
      :single-select="MultiSelYnProp == 'true' ? false : true"
      @dblclick:row="rowDblClick"
      @click:row="rowClick"
      no-data-text="등록된 데이터가 없습니다."
    >
    <!-- <template v-slot:item.CUST_NM="{ item }">
      {{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(item.CUST_NM) : item.CUST_NM }}
    </template>
    <template v-slot:item.CUST_PHN_NO="{ item }">
      {{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(item.CUST_PHN_NO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(item.CUST_PHN_NO.replace(/[^0-9]/g, "")) }}
    </template>
    <template v-slot:item.REG_DT="{ item }">
      {{ mixin_convertDate(item.REG_DT, 'yyyy-MM-dd HH:mm:ss') }}
    </template>
    <template v-slot:item.MDFCN_DT="{ item }">
      {{ mixin_convertDate(item.MDFCN_DT, 'yyyy-MM-dd HH:mm:ss') }}
    </template> -->
    <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in headers">
      <div v-if="header.telYn">
        <span v-if="item[header.value]">{{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(item[header.value].replace(/[^0-9]/g, "")) : mixin_setPhoneNo(item[header.value].replace(/[^0-9]/g, "")) }}</span>
      </div>
      <div v-else>
        <span v-if="header.value === 'CUST_NM'">
          {{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(item[header.value]) : item[header.value] }}
        </span>
        <span v-else-if="header.value === 'REG_DT' || header.value === 'MDFCN_DT'">
          {{ mixin_convertDate(item[header.value], 'yyyy-MM-dd HH:mm:ss') }}
        </span>
        <span v-else>{{ item[header.value] }}</span>
      </div>
    </template>
<!--      show-select-->
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
        보기 {{ mixin_getPagePeriod(items, page) }} / {{ items.length }}
          <compo-tooltip-btn
            TitleProp="다음 검색"
            ClassProp="pl-tooltip-btn is-line"
            IconProp="pl-icon20 arrow-next-paging"
            TooltipPositionProp="bottom"
            :DisabledProp = "nextDisabled"
            @btnClick="search('next',SearchTitleProp)"
          ></compo-tooltip-btn>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CompoFindCus',
    props: {
      SearchTitleProp: {
        type: String,
        default: '고객 찾기'
      },
      SearchDataProp: {
        type: Object,
      },
      SearchInputProp: {
        type: String,
      },
      DataHeaderProp: {
        type: Array,
      },
      DataBodyProp: {
        type: Array,
      },
      MultiSelYnProp: {
        type: String,
        default: 'true'
      },
      FindData:{
        type: Array,
        value: {},
      },
      CUSTCO_ID: {
        type: String,
      },
    },
    data() {
      return {
        COMM_CD_LIST:[],                    //사용할 공통코드 리스트
        COMM_CD_DROP_LIST:[],               //공통코드로 생성된 드롭박스 리스트

        SearchDataDrop:{},    //검색 데이터 드롭박스 항목
        dropSelected: 'NOML',     //드롭박스 초기선택
        dropSelected2: '',    //드롭박스 초기선택2
        searchInput: '',
        headers:[],           //그리드 헤더
        items:[],             //그리드 데이터
        page: 1,              //그리드 현재페이지
        pageCount: 0,         //그리드 총페이지
        perPage: [15,30,50,100],  //그리드 페이지당 표시항목
        // ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때
        ROW_PER_PAGE: 14, //페이징 없이 전체 화면 뿌릴때

        pagination: {
          page: 1,
          rowsPerPage: 500,
          sortBy: "",
          descending: ""
        }, //그리드 페이지속성정의

        nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼

        SEL_ROW:{},           //선택한 로우 데이터
        SEL_LIST:[],           //선택한 데이터 리스트

        GRID_EXPSN_ATTR:[],    //고객찾기 리스트 헤더

        WAIT_FIND_DATA: [],

      }
    },

    watch :{
      // 사용자 또는 고객 이름 검색을 할 때
      SearchInputProp(){
        this.searchInput='';
        this.searchInput = this.SearchInputProp;
        this.search('',this.SearchTitleProp);
      },
      // SearchInputProp: {
      //   deep: true,
      //   immediate: true,
      //   handler(newVal,oldVal) {
      //     // This will be triggered whenever the propValue changes, even if the value remains the same
      //     console.log("newVal",newVal + "oldVal",oldVal );
      //     if(newVal === oldVal){
      //       console.log("same props run");
      //       this.searchInput = '';
      //       this.searchInput = newVal;
      //         this.search('',this.SearchTitleProp);
      //     }else{
      //       this.searchInput = newVal;
      //       this.search('',this.SearchTitleProp);
      //     }
      //   }
      // },

      CUSTCO_ID(){
        this.searchInput = '';
        this.search('',this.SearchTitleProp);
      }
    },

    computed :{
      // computedSearchInput: {
      //   get(){
      //     return this.SearchInputProp;
      //   },
      //   set(value){
      //     this.$emit("update:SearchInputProp", value);
      //   },
      // }
    },

    created() {
      // console.log("created");
      this.$eventBus.$on("setUserInfo", () => {
        this.setUserInfo();
      });
    },

    //공통코드 사용시 async-await 필수 (mixin_common_code_get_all함수로 공통코드 리스트를 가지고 오기 전에 mixin_common_code_get이벤트 발생)
    async mounted() {
      // console.log("mounted");
      //공통코드 목록 => 사용할 공통코드 리스트에 넣기
      this.COMM_CD_LIST = [
        "USER_ST"         //사용자상태
        , "USER_SRCH"     //사용자 검색조건
        , "CUST_ST"       //고객상태
        , "CUST_SRCH"     //고객검색조건
      ];
      //공통코드별 드롭박스 만들기
      this.COMM_CD_DROP_LIST = await this.mixin_common_code_get_all(this.COMM_CD_LIST);
      //필요한 공통코드 드롭박스 생성
      let userStDrop = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, 'USER_ST',"전체",);
      let userSrchDrop = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, 'USER_SRCH');
      let custStDrop = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, 'CUST_ST',"전체",);
      let custSrchDrop = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, 'CUST_SRCH',"전체");
      //조회조건 기본설정(공통코드에서 가져옴) ==> 조회조건을 빈값으로 받아올때
      if(Object.keys(this.SearchDataProp).length == 0){
        if(this.SearchTitleProp == '고객 찾기'){
          //고객찾기모달창
          this.SearchDataDrop = {
            stat: custStDrop,
            name: custSrchDrop,
          }
        } else {
          //사용자찾기모달창
          this.SearchDataDrop = {
            stat: userStDrop,
            name: userSrchDrop,
          }
        }
      } else {
        this.SearchDataDrop = this.SearchDataProp;
      }
      //드롭박스 초기세팅
      // this.dropSelected = this.SearchDataDrop.stat[1].value;
      this.dropSelected = this.SearchTitleProp == '고객 찾기'?'NOML':'WORK';
      this.dropSelected2 = this.SearchDataDrop.name[0].value;

      if(this.SearchInputProp.length == 0){
          this.searchInput = '';
      } else {
        this.searchInput = this.SearchInputProp;
      }

      //그리드 헤더 기본설정 ==> 그리드 헤더를 빈값으로 받아올때
      if(this.DataHeaderProp.length == 0){
        if(this.SearchTitleProp == '고객 찾기'){
          //고객찾기모달창
          this.headers = [
            { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '60px', sortable : false },
            { text: '고객명', value: 'CUST_NM', width: '100px' },
            { text: '고객전화번호', value: 'CUST_PHN_NO', width: '140px', sortable : false },
          ];
          // this.getExpsnAttr();
          this.search('',this.SearchTitleProp);
        } else {
          //사용자찾기모달창
          this.headers = [
            { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px' ,sortable : false},
            { text: '사용자명', value: 'USER_NM', width: '120px' ,sortable : true},
            { text: '사용자ID', value: 'LGN_ID',width: '120px' ,sortable : false},
            { text: '내선번호', value: 'EXT_NO', width: '80px' ,sortable : false},
            { text: '직책', value: 'JBTTL', width: '120px' ,sortable : false},
            { text: '부서', value: 'DEPT_NM', width: '150px' ,sortable : false},
            { text: '사용자상태', value: 'USER_STTS', width: '100px', sortable : false},
          ];
        }
      } else {
        this.headers = this.DataHeaderProp;
      }

      //그리드 데이터 기본설정 ==> 그리드 데이터를 빈값으로 받아올때
      if(this.DataBodyProp.length == 0) {
        if(this.SearchTitleProp != '고객 찾기'){
          this.search('',this.SearchTitleProp);
        }
      } else {
        this.items = this.DataBodyProp;
      }
      this.$eventBus.$on("searchCustName", (custName) => {
        if(!this.mixin_isEmpty(custName) && this.searchInput == custName){
          this.search('', this.SearchTitleProp);
        }
      });
    },
    beforeDestroy(){
      this.$eventBus.$off("searchCustName"); //eventBus 중복방지를 위해 off
    },

    methods: {

      async search(next,userCust){
        //다음버튼 클릭 유무
        if (next !== 'next'){
          this.items = [];
          this.pagination.page = 1; //페이징 처리 초기화
          this.nextDisabled = true;  //버튼 비활성화
        }

        let URLData = userCust == '고객 찾기' ? "/api/setting/customer/info-list/cstmrinfo-inqire-popup/inqire" : '/api/setting/agent/manage/user-info-inqire-popup/inqire';
        let postParam = userCust == '고객 찾기'
        ? {
          CUST_STAT: this.dropSelected,
          SCH_GB: this.dropSelected2,
          SCH_KEYWORD: this.searchInput.replace(/-/g, ''),
          SE : 'CUSTOM', //확장속성 구분값
          EMPTY_PHN_NO_CHK: "Y",
          CUST_LIKE_SCH_USE_YN: (this.mixin_getCustcoSetting('ENV_CUST_LIKE_SCH_USE_YN')?'Y':'N') //고객 LIKE 검색 사용 여부
          // EXPSN_ATTR : this.GRID_EXPSN_ATTR,
        }
        : {
          USER_STTS_CD: this.dropSelected,
          SRCH_USER_ID: this.dropSelected2 == 'USER_ID' ? this.searchInput : '',             // 사용자에게 채번되어들어가는 id가 아닌 로그인 아이디(LGN_ID)
          SRCH_USER_NM: this.dropSelected2 == 'USER_NM' ? this.searchInput : '',
        }
        let headParam = userCust == '고객 찾기'
        ? {head: {
            "SERVICE" : "setting.customer.info-list.cstmrinfo-inqire-popup",
            "METHOD" : "inqire",
            "TYPE" : "BIZ_SERVICE",
            "ROW_CNT" : this.pagination.rowsPerPage,
            "PAGES_CNT" : this.pagination.page,
            "PAGING" : "Y",
            // DATA_OBJECT : "EXPSN_ATTR"
          }
        }
        : {
          head: {
            "SERVICE": "setting.agent.manage.user-info-inqire-popup",
            "METHOD": "inqire",
            "TYPE": "BIZ_SERVICE",
            "ROW_CNT" : this.pagination.rowsPerPage,
            "PAGES_CNT" : this.pagination.page,
            "PAGING" : "Y",
          }
        }
        this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
        let response = await this.common_postCall(URLData, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          if(this.SearchTitleProp === '고객 찾기'){
            this.headers = [
              { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '60px', sortable : false,telYn:false },
              { text: '고객명', value: 'CUST_NM', width: '100px',telYn:false },
              { text: '고객전화번호', value: 'CUST_PHN_NO', width: '140px', sortable : false,telYn:true },
            ];
            try{
              response.EXPSN_ATTR.forEach((cust, idx) => {
                const maxBytes = new TextEncoder().encode(cust.EXPSN_ATTR_NM);
                this.headers.push({
                  text: cust.EXPSN_ATTR_NM,
                  value: cust.EXPSN_ATTR_COL_ID.toUpperCase()+'_NM',
                  width: ((maxBytes.byteLength<7?10:maxBytes.byteLength>20?20:maxBytes.byteLength) * 12) + 'px',
                  sortable: false,
                  telYn:cust.DATA_TYPE_CD == 'TEL' ? true : false,
                });
              });

              this.headers.push({text: '최초 등록일시', value: 'REG_DT', align: 'center', width: '150px', sortable : false,telYn:false});
              this.headers.push({text: '마지막 수정일시', value: 'MDFCN_DT', align: 'center', width: '150px', sortable : false,telYn:false});

              response.DATA.forEach((data, idx) => {
                Object.keys(data).forEach(function (v) {
                  response.EXPSN_ATTR.forEach((attr, seq) => {
                    if (attr.EXPSN_ATTR_COL_ID.toUpperCase() === v.toUpperCase() && (attr.DATA_TYPE_CD === 'TXT' || attr.DATA_TYPE_CD === 'COE' || attr.DATA_TYPE_CD === 'COE_MULTI')) {
                      if (data[v].length > 3) data[v] = data[v].replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&amp;/gi, '&');
                    }
                  });
                });
              });
            } catch (e) {
              this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
            }
          }

          let tempDataText = response.DATA;
          let idx = this.items.length + 1;
          for (let i in tempDataText) {
            tempDataText[i]["ROW_NUMBER"] = idx++;
          }
          //this.items = tempDataText;
          this.items = [...this.items, ...tempDataText]
          //다음
          //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
          if (response.HEADER.next !== null && response.HEADER.next !== undefined) {
            if (response.HEADER.next === true) {
              this.nextDisabled = false //버튼 활성화
            } else {
              this.nextDisabled = true  //버튼 비활성화
            }
          }

          //이부분은 체크해볼것
          this.pagination.page += 1
          // this.page=1;


          if (this.SearchTitleProp === '고객 찾기' && this.searchInput != '' && this.items.length === 1) {
            this.rowClick(this.items[0]);
            this.rowDblClick();
          }
        }
      },

      //로우 클릭시 색상 변경
      isActiveRow(item){
        const activeClass = item === this.SEL_ROW ? "active" : "";
        return activeClass;
      },

      //로우클릭
      rowClick(item){
        this.SEL_ROW = item;
        //prop데이터를 직접바꿀 수 없지만 내부 요소는 변경 가능
        //부모한테서 받은 prop데이터가 $emit으로 자식에게 전달
        if(this.SearchTitleProp == '고객 찾기'){
          if(!this.$store.getters["statusStore/GE_CUTT_ING"]){ //상담중이 아닌 경우
            this.FindData.CUST_ID = item.CUST_ID;
            this.FindData.CUST_NM = item.CUST_NM;
            this.FindData.CUST_PHN_NO = item.CUST_PHN_NO;
          } else {
            this.WAIT_FIND_DATA["CUST_ID"] = item.CUST_ID;
            this.WAIT_FIND_DATA["CUST_NM"] = item.CUST_NM;
            this.WAIT_FIND_DATA["CUST_PHN_NO"] = item.CUST_PHN_NO;
          }
        } else {
          this.FindData.LGN_ID = item.LGN_ID;
          this.FindData.USER_ID = item.USER_ID;
          this.FindData.USER_NM = item.USER_NM;
          this.FindData.DEPT_ID = item.DEPT_ID;
        }
      },

      //로우 더블클릭
      rowDblClick(){
        // this.$emit("findData", this.FindData);
        if(!this.$store.getters["statusStore/GE_CUTT_ING"]){ //상담중이 아닌 경우
          this.setUserInfo();
          this.$eventBus.$emit('dialogCusFindClose');
        }else{
          this.showAlert({ alertDialogToggle : true, msg : '상담을 진행중입니다. 그래도 고객정보를 불러오시겠습니까?', iconClass:'is-caution', type :'confirm', callYes: this.forcSetUserInfo, callNo:this.closeMsg});
        }
      },

      setUserInfo() {
        this.$emit("findData", this.FindData);
      },

      forcSetUserInfo(){
        this.closeMsg();
        this.FindData.CUST_ID = this.WAIT_FIND_DATA.CUST_ID;
        this.FindData.CUST_NM = this.WAIT_FIND_DATA.CUST_NM;
        this.FindData.CUST_PHN_NO = this.WAIT_FIND_DATA.CUST_PHN_NO;
        this.setUserInfo();
        //고객정보를 불러왔을때는 상담상태변경 없음
        // this.$store.commit("statusStore/MU_CUTT_ING", false); //상담 진행중을 false로 store 저장 처리
        this.$eventBus.$emit('dialogCusFindClose');
      },

      closeMsg(){
        this.$store.commit("alertStore/hideAlert");

      },

    },
  }
</script>

<style lang="scss" scoped>

</style>