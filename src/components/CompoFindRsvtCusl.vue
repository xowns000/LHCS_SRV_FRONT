<template>
  <div>
    <!-- search form -->
    <div class="pl-search-form">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            예약상담원 찾기
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
    <!-- <template v-slot:item.RSVT_YN="{ item }">
      {{ item.RSVT_YN == 'Y' ? '가능' : '불가능' }}
    </template>
    <template v-slot:item.CUSL_SCHEDULE="{ item }">
      <v-btn
        class="pl-btn is-sub"
        @click="getSchedule(item)"
      >
        보기
      </v-btn>
    </template> -->
    <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in headers">
      <div>
        <span v-if="header.value === 'RSVT_YN'">
          <span 
            v-if = "item[header.value] == 'Y'"
            style="color : red"
            >
            가능
          </span>
          <span 
            v-else
            >
            불가능
          </span>
        </span>
        <span v-else-if="header.value === 'CUSL_SCHEDULE'">
          <v-btn
            class="pl-btn is-sub"
            @click="getSchedule(item)"
          >
            보기
          </v-btn>
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
    <v-dialog
      v-model="dropCuslSchedule"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="스케줄 확인"
        @hide="dropCuslSchedule = false"
      >
        <template slot="body">
          <div>
            <div class="align-center" style="display: grid; grid-template-columns: 1fr 2fr 1fr; justify-items: left;">
              <v-btn
                @click="setToday()"
                class="pl-btn is-sub">오늘</v-btn>
              <div class="d-flex align-center" style="justify-self: center;">
                <!-- arrow left 버튼 -->
                <compo-tooltip-btn
                  TitleProp="이전 달"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon30 is-arrow-left"
                  TooltipPositionProp="bottom"
                  @btnClick="prevMonth()"
                ></compo-tooltip-btn>
                <div
                  v-if="$refs.calendar"
                  class="px-2"
                  style="height: 24px;"
                  >
                  <strong style="font-size: 22px; line-height: 1;">{{ computedCalendarTitle }}</strong>
                </div>
                <!-- arrow right 버튼 -->
                <compo-tooltip-btn
                  TitleProp="다음 달"
                  ClassProp="pl-tooltip-btn ml-auto"
                  IconProp="pl-icon30 is-arrow-right"
                  TooltipPositionProp="bottom"
                  @btnClick="nextMonth()"
                ></compo-tooltip-btn>
              </div>
              <div class="ml-auto">
                <compo-date-picker
                  @dateChange="setDay"
                  DateType="icon"
                  :DateProp.sync="focus_cal"/>
              </div>
            </div>
            <div class="d-flex align-center">
              <compo-tooltip-btn
                TitleProp="이전 주"
                ClassProp="pl-tooltip-btn"
                IconProp="mdi mdi-chevron-left"
                TooltipPositionProp="bottom"
                @btnClick="prevWeek()"
              ></compo-tooltip-btn>
              <!-- v-calendar -->
              <v-calendar
                v-model="focus_cal"
                ref="calendar"
                class="pl-weekCalendar is-mt-s"
                :value="date"
                locale="ko-KR"
                color="primary"
                :type="calendar_type"
                @click:date="selectDay"
              >
              </v-calendar>
              <compo-tooltip-btn
                TitleProp="다음 주"
                ClassProp="pl-tooltip-btn"
                IconProp="mdi mdi-chevron-right"
                TooltipPositionProp="bottom"
                @btnClick="nextWeek()"
              ></compo-tooltip-btn>
            </div>
          </div>
          <div class="pl-campaign-list type-2 is-mt-m" style="height: 400px">
          <ul>
            <template
              v-if="RESERVE_LIST.length == 0"
              >
              <div class="pl-list-nodata">
                <span>등록된 데이터가 없습니다.</span>
              </div>
            </template>
            <template 
              v-else
              v-for="data, index in RESERVE_LIST"
              >
              <li>
                <div>예약시간 : {{ data.RSVT_DT.substr(8,2) + '시 ' }} {{ data.RSVT_DT.substr(10,2) == '00' ? '' :  (data.RSVT_DT.substr(10,2) + '분') }}</div>
                <div>고객명 : {{ data.CUST_NM }}</div>
                <div>전화번호 : {{ data.CUST_PHN_NO }}</div>
              </li>
            </template>
          </ul>
        </div>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="dropCuslSchedule = false">닫기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: 'CompoFindRsvtCusl',
    props: {
      SearchTitleProp: {
        type: String,
        default: '상담원 검색'
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
      RsvtDtProps: {
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
        //그리드 헤더
        headers:[
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px' ,sortable : false},
          { text: '사용자명', value: 'USER_NM', width: '120px' ,sortable : true},
          { text: '사용자ID', value: 'LGN_ID',width: '120px' ,sortable : false},
          { text: '내선번호', value: 'EXT_NO', width: '80px' ,sortable : false},
          { text: '직책', value: 'JBTTL', width: '120px' ,sortable : false},
          { text: '부서', value: 'DEPT_NM', width: '150px' ,sortable : false},
          { text: '사용자상태', value: 'USER_STTS', width: '100px', sortable : false},
          { text: '배정 가능여부', value: 'RSVT_YN', width: '100px', sortable : false},
          { text: '스케줄 확인', value: 'CUSL_SCHEDULE', width: '100px', sortable : false},
        ],
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

        WAIT_FIND_DATA: [],

        dropCuslSchedule:false,
        focus_cal:'',
        date: '',
        calendar_type: 'week',
        RESERVE_LIST:[],
      }
    },

    watch :{
      // 사용자 또는 고객 이름 검색을 할 때
      SearchInputProp(){
        this.searchInput='';
        this.searchInput = this.SearchInputProp;
        this.search('',this.SearchTitleProp);
      },

      CUSTCO_ID(){
        this.searchInput = '';
        this.search('',this.SearchTitleProp);
      },

      focus_cal(){
        this.getRsvtList(); 
      }
    },

    computed :{
      computedCalendarTitle() {
        const title = this.$refs.calendar.title;
        
        let newTitle = '';
        let focusCalendar = this.focus_cal ? this.focus_cal : this.date;
        newTitle = focusCalendar.substr(0,4) + "년 " + parseInt(focusCalendar.substr(5,2)) + "월";
        // const arrTitle = title.split(' ');
        // const titLen = arrTitle.length;
        // if(titLen == 2) {
        //   //6월 2024
        //   newTitle = arrTitle[1] + "년 " + arrTitle[0];
        // } else if(titLen == 4) {
        //   //9월 - 10월 2024
        //   newTitle = arrTitle[3] + "년 " + arrTitle[0] + " " + arrTitle[1] + " " + arrTitle[2];
        // } else if(titLen == 5) {
        //   //12월 2024 - 1월 2025
        //   newTitle = arrTitle[1] + "년 " + arrTitle[0] + " " + arrTitle[2] + " " + arrTitle[4] + "년 " + arrTitle[3];
        // }

        return newTitle;
      },
    },

    created() {
      // console.log("created");
      this.$eventBus.$on("setUserInfo", () => {
        this.setUserInfo();
      });

      this.$eventBus.$on("getRsvtCuslList", () => {
        this.search();
      });
    },

    //공통코드 사용시 async-await 필수 (mixin_common_code_get_all함수로 공통코드 리스트를 가지고 오기 전에 mixin_common_code_get이벤트 발생)
    async mounted() {
      // console.log("mounted");
      //공통코드 목록 => 사용할 공통코드 리스트에 넣기
      this.COMM_CD_LIST = [
        "USER_ST"         //사용자상태
        , "USER_SRCH"     //사용자 검색조건
      ];
      //공통코드별 드롭박스 만들기
      this.COMM_CD_DROP_LIST = await this.mixin_common_code_get_all(this.COMM_CD_LIST);
      //필요한 공통코드 드롭박스 생성
      let userStDrop = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, 'USER_ST',"전체",);
      let userSrchDrop = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, 'USER_SRCH');
      //조회조건 기본설정(공통코드에서 가져옴) ==> 조회조건을 빈값으로 받아올때
      if(Object.keys(this.SearchDataProp).length == 0){
        //사용자찾기모달창
        this.SearchDataDrop = {
          stat: userStDrop,
          name: userSrchDrop,
        }
      } else {
        this.SearchDataDrop = this.SearchDataProp;
      }
      //드롭박스 초기세팅
      // this.dropSelected = this.SearchDataDrop.stat[1].value;
      this.dropSelected = 'WORK';
      this.dropSelected2 = this.SearchDataDrop.name[0].value;

      if(this.SearchInputProp.length == 0){
          this.searchInput = '';
      } else {
        this.searchInput = this.SearchInputProp;
      }

      //그리드 데이터 기본설정 ==> 그리드 데이터를 빈값으로 받아올때
      if(this.DataBodyProp.length == 0) {
        this.search('',this.SearchTitleProp);
      } else {
        this.items = this.DataBodyProp;
      }
    },
    beforeDestroy(){
      this.$eventBus.$off("searchCustName"); //eventBus 중복방지를 위해 off
    },

    methods: {

      async search(next){
        //다음버튼 클릭 유무
        if (next !== 'next'){
          this.items = [];
          this.pagination.page = 1; //페이징 처리 초기화
          this.nextDisabled = true;  //버튼 비활성화
        }

        let URLData = '/api/rsvt/getRsvtCuslList';
        let postParam = {
          USER_STTS_CD: this.dropSelected,
          SRCH_USER_ID: this.dropSelected2 == 'USER_ID' ? this.searchInput : '',             // 사용자에게 채번되어들어가는 id가 아닌 로그인 아이디(LGN_ID)
          SRCH_USER_NM: this.dropSelected2 == 'USER_NM' ? this.searchInput : '',
          RSVT_DT : this.RsvtDtProps,
        }
        let headParam = {
          head: {
            "ROW_CNT" : this.pagination.rowsPerPage,
            "PAGES_CNT" : this.pagination.page,
            "PAGING" : "Y",
          }
        }
        this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
        let response = await this.common_postCall(URLData, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
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


          if (this.searchInput != '' && this.items.length === 1) {
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
        this.FindData.LGN_ID = item.LGN_ID;
        this.FindData.USER_ID = item.USER_ID;
        this.FindData.USER_NM = item.USER_NM;
        this.FindData.DEPT_ID = item.DEPT_ID;
      },

      //로우 더블클릭
      rowDblClick(){
        this.setUserInfo();
        this.$eventBus.$emit('dialogCusFindClose');
      },

      setUserInfo() {
        this.$emit("findData", this.FindData);
      },

      closeMsg(){
        this.$store.commit("alertStore/hideAlert");

      },

      //상담원 예약 스케줄 보기
      getSchedule(data){
        this.dropCuslSchedule = true;
        
        this.getServerDate();
        // this.getRsvtList();
        this.focus_cal = this.date

        this.getRsvtList();
      },

      selectDay(event){
        // 클릭된 날짜의 요소를 가져옴
        const calendarElement = this.$refs.calendar.$el;
        const dayElements = calendarElement.querySelectorAll('.v-calendar-daily_head-day');

        // 모든 날짜 요소에서 클래스 제거
        dayElements.forEach(element => {
          element.classList.remove('selected-day');
        });

        // 이벤트 객체의 날짜 정보
        const eventDate = new Date(event.date);
        const year = eventDate.getFullYear();
        const month = eventDate.getMonth();
        const day = eventDate.getDate();

        // 날짜 정보와 일치하는 DOM 요소에 클래스 추가
        dayElements.forEach(element => {
          const label = element.querySelector('.v-btn__content');
          if (label) {
            const elementDay = parseInt(label.textContent.replace('일', ''), 10);
            const elementDate = new Date(year, month, elementDay);

            if (
              elementDate.getFullYear() === year &&
              elementDate.getMonth() === month &&
              elementDate.getDate() === day
            ) {
              element.classList.add('selected-day');
            }
          }
        });
      },
      
      setToday () {
        this.focus_cal = this.date;
      },

      setDay(date) {
        this.focus_cal = date;
      },

      prevMonth() {
        const currentDate = this.focus_cal == '' ? this.$refs.calendar.start : this.focus_cal;
        let currentDateObj = this.parseDateString(currentDate);
        currentDateObj.setMonth(currentDateObj.getMonth() - 1);
        let date = this.getFirstDate(currentDateObj);
        this.focus_cal = date;
      },

      nextMonth() {
        const currentDate = this.focus_cal == '' ? this.$refs.calendar.start : this.focus_cal;
        let currentDateObj = this.parseDateString(currentDate);
        currentDateObj.setMonth(currentDateObj.getMonth() + 1);
        let date = this.getFirstDate(currentDateObj);
        this.focus_cal = date;
      },

      parseDateString(dateString) {
        const parts = dateString.split('-');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);

        return new Date(year, month, day);
      },

      getFirstDate(date) {
        date.setDate(1);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1 and pad with 0 if necessary
        const day = String(date.getDate()).padStart(2, '0'); // Pad the day with 0 if necessary

        // Combine them into the desired format
        return `${year}-${month}-${day}`;
      },

      prevWeek() {
        this.$refs.calendar.prev();
      },

      nextWeek() {
        this.$refs.calendar.next()
      },

      // 서버 시간 가져오기
      async getServerDate() {
        await this.mixin_getSvrDate("YYYYMMDDHH24MISS").then((data) => {
          let cvDate = this.mixin_convertDate(data, 'yyyy-MM-dd HH:mm:ss')
          this.date = cvDate;
          this.setDay(cvDate);
          this.selectDay({date : cvDate.substring(0, 10)});
        })
      },

      async getRsvtList(){
        let schDate = '';
        let nowDate = '';
        if(this.date){
          nowDate = this.date
          schDate = this.focus_cal ? this.focus_cal.replaceAll('-','').substr(0, 8) : nowDate.replaceAll('-','').replaceAll(':','').replaceAll(' ','').substr(0, 8)
        } else {
          nowDate = await this.mixin_getSvrDate("YYYYMMDDHH24MISS")
          schDate = this.focus_cal ? this.focus_cal.replaceAll('-','').substr(0, 8) : nowDate.substr(0, 8)
        }
        this.RESERVE_LIST = [];
        let URLData = '/api/rsvt/getRsvtList';
        let postParam = {
          RSVT_STTS: this.dropProgress
          , SCH_ST_DT : schDate
          , SCH_END_DT : schDate
          , SCH_KEY : 'USER_ID'
          , SCH_KEYWORD : this.SEL_ROW.USER_ID
        }
        let headParam = {
          head: {
          }
        }
        this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
        let response = await this.common_postCall(URLData, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          this.RESERVE_LIST = response.DATA.reverse();
        }
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>