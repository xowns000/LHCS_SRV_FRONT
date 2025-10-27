<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                채널 분류
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(common_code, 'CHNL_CL','전체')"
                  v-model="SRCH_CHN_CLSF_CD"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">채널 명</span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form is-lg"
                  placeholder="검색어 입력"
                  v-model="SRCH_DSPTCH_PRF_NM"
                  @keydown.enter="chnSrch()"
                />
              </div>
            </div>
            <v-btn
              class="pl-btn is-icon"
              @click="chnSrch()"
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
            <v-btn
              class="pl-btn is-icon is-sub"
              @click="openDialogDetail()"
              :disabled="SNDR_KEY.length != 0 ? false : true"
            >
              <span class="pl-icon20 document"></span>
              선택항목 상세
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub" @click="openDialogRegist()">
              <span class="pl-icon20 circle-plus"></span>
              채널 등록
            </v-btn>
            <!--
            <v-btn
              class="pl-btn is-icon is-sub"
              @click="kakaotalk()"
            >
              <span class="pl-icon20 circle-plus"></span>
              카카오톡 상담하기
            </v-btn>
            <v-btn
              class="pl-btn is-icon is-sub"
              @click="ttalk('NEW')"
            >
              <span class="pl-icon20 circle-plus"></span>
              티톡 상담하기(새창)
            </v-btn>
            <v-btn
              class="pl-btn is-icon is-sub"
              @click="ttalk('NOW')"
            >
              <span class="pl-icon20 circle-plus"></span>
              티톡 상담하기(현재창)
            </v-btn>
            -->
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
          </div>
        </div>
        <v-data-table
          class="pl-grid "
          :headers="headers"
          :items="items"
          :item-class="isActiveRow"
          fixed-header
          item-key="SNDR_KEY"
          height="562px"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
          :page.sync="page"
          @page-count="pageCount = $event"
          @click:row="rowClick"
          @dblclick:row="openDialogDetail()"
          no-data-text="등록된 데이터가 없습니다."
        >
        <!--채널명-->
        <template v-slot:item.DSPTCH_PRF_NM="{ item }">
          <div>
            <v-icon :class="`pl-icon20 mainchat-${ item.CHN_CLSF_CD }`"></v-icon>&nbsp;{{item.DSPTCH_PRF_NM}}
          </div>
        </template>
        <!-- 알림톡 여부(채널 유형) -->
        <template v-slot:item.ATALK_YN="{ item }">

          <div v-if="item.ATALK_YN == 'Y'">
            알림톡
          </div>
          <div v-if="item.ATALK_YN == 'N'">
            채팅
          </div>
        </template>
        <!-- 서비스 상태 -->
        <template v-slot:item.SRVC_MAINT_YN="{ item }">
          <span
            :class="`pl-round-chip is-sm chat-stat-${item.SRVC_MAINT_YN === 'Y' ? 'cs' : 'done'}`">
            {{ item.SRVC_MAINT_YN === 'Y' ? '사용' : '사용안함 '}}
          </span>
          <!-- <div v-if="item.SRVC_MAINT_YN == 'Y'">
            사용중
          </div>
          <div v-if="item.SRVC_MAINT_YN == 'N'">
            사용안함
          </div> -->
        </template>
        <!-- 위탁 동의여부 -->
        <template v-slot:item.CSGMT_AGRE_YN="{ item }">
          <div v-if="item.CSGMT_AGRE_YN == 'Y'">
            동의함
          </div>
          <div v-if="item.CSGMT_AGRE_YN == 'N'">
            동의안함
          </div>
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
            보기 {{ mixin_getPagePeriod(items, page) }} / {{ items.length }}
<!--            <v-btn  -->
<!--              class="pl-btn is-sub"-->
<!--              :disabled = "nextDisabled"-->
<!--              @click="chnSrch('next')"-->
<!--            >다음 검색</v-btn>-->
            <compo-tooltip-btn
                TitleProp="다음 검색"
                ClassProp="pl-tooltip-btn is-line"
                IconProp="pl-icon20 arrow-next-paging"
                TooltipPositionProp="bottom"
                @btnClick="chnSrch('next')"
                :DisabledProp="nextDisabled"
            ></compo-tooltip-btn>
          </span>
        </div>
      </div>
    </div>
    <!-- dialog -->
    <!-- 채널 등록/상세정보 다이얼로그-->
    <STG_M0504_DLG_DETAIL
      v-if="isOpenDlgDetail"
      :DataProp="{'SNDR_KEY': SNDR_KEY, 'CHN_CLSF_CD': CHN_CLSF_CD}"
      @clickClose="isOpenDlgDetail=false"
      @chnSrch="chnSrch()"
    />

    <!-- 티톡 모달 -->
    <!--
    <v-dialog
      v-model="dialogTtalk"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="티톡상담"
        @hide="[mixin_hideDialog('Ttalk')]"
      >
        <template slot="body">
          <iframe :key="RELOAD" :src="TTALK_URL" frameborder="0" height="700px"></iframe>
        </template>
      </compo-dialog>
    </v-dialog>
    -->

  </div>
</template>

<script>
import STG_M0504_DLG_DETAIL from './STG_M0504_DLG_DETAIL.vue';

export default {
name:"MENU_STG_M0504", //name은 'MENU_' + 파일명 조합 - 메신저 연동 관리
components: {
  STG_M0504_DLG_DETAIL
},
data() {
   return {
    //공통코드
    common_code:[],

    // top search
    SRCH_CHN_CLSF_CD:'',
    SRCH_CUSTCO_NM:'',
    SRCH_DSPTCH_PRF_NM:'',

    //발송자 키(채번된 채널 키)
    SNDR_KEY: '',
    //채널 분류 - 상세에 함께 넘겨서 채널별 초기 UI 변경 시 깜빡임 현상 처리.
    CHN_CLSF_CD: '',

    //채널 등록/상세정보 다이얼로그 오픈 여부
    isOpenDlgDetail: false,


    // grid
    page: 1,
    pageCount: 0,
    perPage: [15,30,50,100],
    ROW_PER_PAGE: 15,
    headers: [
      { text: '번호', value: 'ROW_NUMBER', width: '80px' },
      { text: '채널명', value: 'DSPTCH_PRF_NM', width: '230px' },
      { text: '채널분류', value: 'CHN_CLSF_CD_NM', width: '120px' },
      { text: '채널 유형', value: 'ATALK_YN', width: '120px'},
      { text: '서비스 상태', value: 'SRVC_MAINT_YN', width: '120px' },
      { text: 'UUID / 보내기 API', value: 'UUID', width: '200px'},
      { text: '발신프로필 키 / 톡톡 채널ID', value: 'DSPTCH_PRF_KEY'},
      { text: '고객 담당자', value: 'CUSTCO_MNGR_NM', width: '120px' },
      { text: '등록일', value: 'NEW_REG_DT', width: '120px' },
      { text: '위탁 동의 여부', value: 'CSGMT_AGRE_YN', width: '120px' },
      { text: '위탁 동의일', value: 'NEW_CSGMT_AGRE_DT', width: '120px' },
    ],
    items: [],

    pagination: {
          page: 1,
          rowsPerPage: 500,
          sortBy: "",
          descending: ""
        }, //그리드 페이지속성정의
    nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼

   }
 },

  watch: {

  },

  computed: {

  },

  //공통코드 사용시 async-await 필수 (mixin_common_code_get_all함수로 공통코드 리스트를 가지고 오기 전에 mixin_common_code_get이벤트 발생)
  async created() {
    //공통코드설정
    let codeName = ['CHNL_CL'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    this.chnSrch();
  },

  mounted() {
  },

  methods: {
    async chnSrch(next){
      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.items = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let sUrl = '/chat-api/setting/messenger-connect-manage/inqire';
      let postParam = {
        CHN_CLSF_CD:this.SRCH_CHN_CLSF_CD,
        DSPTCH_PRF_NM:this.SRCH_DSPTCH_PRF_NM,
      }
      let headParam = {
        head: {
          "ROW_CNT" : this.pagination.rowsPerPage,
          "PAGES_CNT" : this.pagination.page,
          "PAGING" : "Y",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        for(let k in resData.DATA){
          resData.DATA[k].NEW_REG_DT = this.mixin_convertDate(resData.DATA[k].REG_DT, 'yyyy-MM-dd');
          resData.DATA[k].NEW_CSGMT_AGRE_DT = this.mixin_convertDate(resData.DATA[k].CSGMT_AGRE_DT, 'yyyy-MM-dd');
        }

        let tempDataText = resData.DATA;
        //this.items = tempDataText;
        this.items = [...this.items, ...tempDataText]
        //다음
        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 resData.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(resData.HEADER.next !== null && resData.HEADER.next !== undefined){
          if(resData.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }

        //이부분은 체크해볼것
        this.pagination.page += 1
        // this.page=1;
      }
    },

    //로우 클릭시 색상 변경
    isActiveRow(item) {
      const activeClass = item.SNDR_KEY === this.SNDR_KEY ? "active" : "";
      return activeClass;
    },

    //로우 클릭이벤트
    rowClick(item){
      this.SNDR_KEY = item.SNDR_KEY;
      this.CHN_CLSF_CD = item.CHN_CLSF_CD;
    },

    //등록 다이얼로그 오픈
    openDialogRegist() {
      this.SNDR_KEY = '';
      this.CHN_CLSF_CD = '';
      this.isOpenDlgDetail = true;
    },
    //상세정보 다이얼로그 오픈
    openDialogDetail() {
      this.isOpenDlgDetail = true;
    },

  },
}
</script>

<style lang="scss" scoped>

</style>