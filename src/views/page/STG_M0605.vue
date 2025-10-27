<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
      </compo-sub-layout-top>
      <!-- sub content -->
      <v-tabs class="pl-tabs" v-model="tab">
        <v-tab>권한 그룹 관리</v-tab>
        <v-tab>메뉴 권한 관리</v-tab>
      </v-tabs>
      <div style="height: 700px">
        <v-tabs-items v-model="tab" class="pl-tabs-items">
          <!-- 권한 그룹 관리 -->
          <v-tab-item>
            <div class="pl-cols" style="height: 100%">
              <!-- left -->
              <div class="is-vrt" >
                <div class="pl-card">
                  <div class="pl-grid-top">
                    <div class="pl-grid-top-left">
                      <v-btn
                        class="pl-btn is-icon is-sub"
                        @click="init_authrt('NEW')"
                        :disabled="AUTHRT_GROUP_ADD_BTN"
                      >
                        <span class="pl-icon20 circle-plus"></span>
                        등록
                      </v-btn>
                      <v-btn
                        class="pl-btn is-icon is-sub"
                        :disabled="CHC_AUTHRT_GROUP_LIST.length==0 ? true : false"
                        @click="showAlert(ALERT_DEL_AUTHRT)"
                      >
                        <span class="pl-icon20 trash"></span>
                        삭제
                      </v-btn>
                    </div>
                    <div class="pl-grid-top-utils">
                      <span class="pl-counter">전체 <em class="pl-1">({{ AUTHRT_GROUP_ITEMS.length }})</em> 건</span>
                    </div>
                  </div>
                  <v-data-table
                    v-model="CHC_AUTHRT_GROUP_LIST"
                    class="pl-grid has-control"
                    show-select
                    :headers="AUTHRT_GROUP_HEADER"
                    :items="AUTHRT_GROUP_ITEMS"
                    :item-class="isActiveRow"
                    fixed-header
                    item-key="AUTHRT_GROUP_ID"
                    height="562px"
                    :items-per-page="ROW_PER_PAGE"
                    hide-default-footer
                    :page.sync="page"
                    @page-count="pageCount = $event"
                    @click:row="srch_authrt"
                    no-data-text="등록된 데이터가 없습니다."
                  >
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

                    <span class="pl-pager-period">보기 {{ mixin_getPagePeriod(AUTHRT_GROUP_ITEMS, page) }} / {{ AUTHRT_GROUP_ITEMS.length }}</span>
                  </div>
                </div>
              </div>
              <!-- right -->
              <div class="is-col-fix is-vrt" style="width: 510px">
                <div class="pl-card">
                  <h2 class="pl-subtit">권한그룹 상세 정보</h2>
                  <div class="pl-subdesc">
                    <p>필수 항목을 입력하신 후 [저장] 버튼을 클릭하십시오</p>
                  </div>
                </div>
                <div >
                  <v-form ref="form">
                  <div class="pl-card" style="overflow: auto; height: 570px; ">
                    <div class="pl-form-inline-wrap vertical">
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          권한그룹 ID
                          <v-icon class="pl-icon20"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            class="pl-form"
                            disabled
                            v-model="AUTHRT_GROUP_ID"
                            />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          권한 그룹명
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            class="pl-form"
                            v-model="AUTHRT_GROUP_NM"
                            :rules="validateRules.AUTHRT_GROUP_NM"
                            v-byte-counter="300"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          관리자 여부
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-select
                            class="pl-form"
                            :items="mixin_common_code_get(COMM_CD_DROP_LIST, 'MNGR_WT')"
                            placeholder="선택하세요"
                            v-model="MNGR_PM_CD"
                            :rules="validateRules.MNGR_PM_CD"
                          ></v-select>
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          사용자 구분
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-select
                            class="pl-form"
                            :items="mixin_common_code_get(COMM_CD_DROP_LIST, 'USER_CL')"
                            placeholder="선택하세요"
                            v-model="USER_SE_CD"
                            :rules="validateRules.USER_SE_CD"
                          ></v-select>
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          정렬 순서
                          <v-icon class="pl-icon20"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            class="pl-form"
                            v-model="SORT_ORD"
                            :readonly=true
                            v-byte-counter="1000"
                            />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          설명
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-textarea
                            class="pl-form is-noresize"
                            placeholder="권한그룹 설명 입력"
                            v-model="GROUP_EXPLN"
                            :rules="validateRules.GROUP_EXPLN"
                            :spellcheck="false"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  </v-form>
                  <div class="pl-card is-bottom">
                    <div class="is-right">
                      <v-btn
                        class="pl-btn"
                        @click="showAlert(ALERT_STRG_AUTHRT)"
                        :disabled="AUTHRT_GROUP_SAVE_BTN"
                      >저장</v-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-tab-item>
          <!-- 메뉴 권한 관리 -->
          <v-tab-item>
            <div class="pl-cols" style="height: 100%">
              <!-- left -->
              <div class="is-col-fix is-vrt" style="width: 964px">
                <!-- 조회 -->
                <div class="pl-search-header">
                  <div class="pl-form-inline-wrap">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        메뉴 그룹
                      </span>
                      <div class="pl-desc">
                        <v-select
                        class="pl-form"
                        :items="MENU_GROUP_DROP"
                        v-model="MENU_GROUP"
                        placeholder="선택하세요"
                        ></v-select>
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        권한 그룹
                      </span>
                      <div class="pl-desc">
                        <v-select
                        class="pl-form"
                        :items="AUTHRT_GROUP_DROP"
                        v-model="AUTHRT_GROUP"
                        placeholder="선택하세요"
                        ></v-select>
                      </div>
                    </div>
                    <v-btn
                      class="pl-btn is-icon"
                      @click="srch_stng_menu()"
                    >
                      <span class="pl-icon20 search"></span>
                      조회
                    </v-btn>
                  </div>
                </div>
                <!-- grid -->
                <div class="pl-card">
                  <div class="pl-cols">
                    <div>
                      <h2 class="pl-subtit">설정되지 않은 메뉴</h2>
                      <div class="pl-subdesc d-flex justify-space-between">
                        <p>설정할 메뉴를 선택 후 이동 아이콘을 클릭하십시오.</p>
                        <span class="pl-counter">전체 <em class="pl-1">({{ UN_STNG_MENU_ITEMS.length }})</em> 건</span>
                      </div>
                      <v-data-table
                        class="pl-grid has-control is-mt-m"
                        :headers="UN_STNG_MENU_HEADER"
                        :items="UN_STNG_MENU_ITEMS"
                        :item-class="isActiveRow_stngMenu"
                        v-model="CHC_UN_STNG_MENU_LIST"
                        show-select
                        fixed-header
                        item-key="MENU_ID"
                        height="490px"
                        :items-per-page="ROW_PER_PAGE2"
                        hide-default-footer
                        :page.sync="page2"
                        @page-count="pageCount2 = $event"
                        @click:row="srch_menu"
                        no-data-text="등록된 데이터가 없습니다."
                      >
                      </v-data-table>

                    </div>
                    <div class="d-flex flex-column justify-center align-center" style="flex: 0 0 58px; gap: 14px">
                      <!-- arrow left 버튼 -->
                      <compo-tooltip-btn
                        TitleProp="설정 해제"
                        ClassProp="pl-tooltip-btn"
                        IconProp="pl-icon30 is-arrow-left"
                        TooltipPositionProp="bottom"
                        @btnClick="un_stng_menu()"
                        :DisabledProp="CHC_STNG_MENU_LIST.length == 0 ? true : false"
                      ></compo-tooltip-btn>
                      <!-- arrow right 버튼 -->
                      <compo-tooltip-btn
                        TitleProp="설정"
                        ClassProp="pl-tooltip-btn"
                        IconProp="pl-icon30 is-arrow-right"
                        TooltipPositionProp="bottom"
                        @btnClick="stng_menu()"
                        :DisabledProp="CHC_UN_STNG_MENU_LIST.length == 0 ? true : false"
                      ></compo-tooltip-btn>
                    </div>
                    <div>
                      <h2 class="pl-subtit">설정된 메뉴</h2>
                      <div class="pl-subdesc d-flex justify-space-between">
                        <p>메뉴를 설정 후 [저장] 버튼을 클릭하십시오.</p>
                        <span class="pl-counter">전체 <em class="pl-1">({{ STNG_MENU_ITEMS.length }})</em> 건</span>
                      </div>
                      <v-data-table
                        class="pl-grid has-control is-mt-m"
                        :headers="STNG_MENU_HEADER"
                        :items="STNG_MENU_ITEMS"
                        :item-class="isActiveRow_stngMenu"
                        v-model="CHC_STNG_MENU_LIST"
                        show-select
                        fixed-header
                        item-key="MENU_ID"
                        height="490px"
                        :items-per-page="ROW_PER_PAGE2"
                        hide-default-footer
                        :page.sync="page3"
                        @page-count="pageCount3 = $event"
                        @click:row="srch_menu"
                        no-data-text="등록된 데이터가 없습니다."
                      >
                      </v-data-table>

                    </div>
                  </div>
                </div>
                <div class="pl-card is-bottom">
                  <div class="is-right">
                    <v-btn
                      class="pl-btn"
                      @click="showAlert(ALERT_STRG_MENU)"
                      :disabled="MENU_SAVE_BTN"
                    >저장</v-btn>
                  </div>
                </div>
              </div>
              <!-- right -->
              <div class="is-vrt" >
                <div class="pl-card">
<!--                  <h2 class="pl-subtit">(전화 상담이력 조회)화면 버튼 권한 설정</h2>-->
                  <h2 class="pl-subtit"> [ {{ MENU_GROUP_TEXT == ''? '전체' : MENU_GROUP_TEXT }} ] 화면 버튼 권한 설정</h2>
                  <div class="pl-subdesc">
                    <p>좌측의 “부여된 메뉴”별 기능 버튼에 대한 권한을 부여할 수 있습니다.</p>
                  </div>
                  <h2 class="pl-subtit d-flex justify-space-between is-mt-m">부여되지 않은 버튼
                    <span class="pl-counter">전체 <em class="pl-1">({{ UN_STNG_BTN_ITEMS.length }})</em> 건</span>
                  </h2>
                  <v-data-table
                    class="pl-grid has-control is-mt-m"
                    :headers="UN_STNG_BTN_HEADER"
                    :items="UN_STNG_BTN_ITEMS"
                    :item-class="isActiveRow_stngBtn"
                    v-model="CHC_UN_STNG_BTN_LIST"
                    show-select
                    fixed-header
                    item-key="BTN_ID"
                    height="200px"
                    :items-per-page="ROW_PER_PAGE2"
                    hide-default-footer
                    :page.sync="page4"
                    @page-count="pageCount4 = $event"
                    @click:row="srch_btn"
                    no-data-text="등록된 데이터가 없습니다."
                  >
                  </v-data-table>

                  <div class="d-flex justify-center align-center is-mt-m" style="gap: 14px">
                    <!-- arrow up 버튼 -->
                    <compo-tooltip-btn
                      TitleProp="up"
                      ClassProp="pl-tooltip-btn"
                      IconProp="pl-icon30 is-arrow-up"
                      TooltipPositionProp="bottom"
                      @btnClick="un_stng_btn()"
                      :DisabledProp="CHC_STNG_BTN_LIST.length == 0 ? true : false"
                    ></compo-tooltip-btn>
                    <!-- arrow down 버튼 -->
                    <compo-tooltip-btn
                      TitleProp="down"
                      ClassProp="pl-tooltip-btn"
                      IconProp="pl-icon30 is-arrow-down"
                      TooltipPositionProp="bottom"
                      @btnClick="stng_btn()"
                      :DisabledProp="CHC_UN_STNG_BTN_LIST.length == 0 ? true : false"
                    ></compo-tooltip-btn>
                  </div>

                  <h2 class="pl-subtit d-flex justify-space-between is-mt-m">부여된 버튼
                    <span class="pl-counter">전체 <em class="pl-1">({{ STNG_BTN_ITEMS.length }})</em> 건</span>
                  </h2>
                  <v-data-table
                    class="pl-grid has-control is-mt-m"
                    :headers="STNG_BTN_HEADER"
                    :items="STNG_BTN_ITEMS"
                    :item-class="isActiveRow_stngBtn"
                    v-model="CHC_STNG_BTN_LIST"
                    show-select
                    fixed-header
                    item-key="BTN_ID"
                    height="200px"
                    :items-per-page="ROW_PER_PAGE2"
                    hide-default-footer
                    :page.sync="page5"
                    @page-count="pageCount5 = $event"
                    @click:row="srch_btn"
                    no-data-text="등록된 데이터가 없습니다."
                  >
                  </v-data-table>

                </div>
                <div class="pl-card is-bottom">
                  <div class="is-right">
                    <v-btn
                      class="pl-btn"
                      @click="showAlert(ALERT_STRG_BTN)"
                      :disabled="BTN_SAVE_BTN"
                    >저장</v-btn>
                  </div>
                </div>
              </div>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </div>
    <!-- dialog -->
  </div>
</template>

<script>
export default {
  name: "MENU_STG_M0605", //name은 'MENU_' + 파일명 조합
  components: {
  },
  data() {
    return {
      //공통코드
      COMM_CD_USE_LIST:[],                //사용할 공통코드 리스트 ==> 변수명 이미 사용중이기 떄문에 변경해주었음 (COMM_CD_LIST->COMM_CD_USE_LIST)
      COMM_CD_DROP_LIST:[],               //공통코드로 생성된 드롭박스 리스트

      tab: null,
      // dialog

      // 권한 그룹 관리
      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
      AUTHRT_GROUP_HEADER: [
        { text: '번호', value: 'ROWNUM', align: 'center', width: '100px' },
        { text: '권한그룹ID', value: 'AUTHRT_GROUP_ID', width: '100px' },
        { text: '권한그룹명', value: 'AUTHRT_GROUP_NM', width: '150px'},
        { text: '메인메뉴개수', value: 'CNT_MAIN_MENU', width: '150px' },
        { text: '좌측메뉴개수', value: 'CNT_LEFT_MENU', width: '150px' },
        { text: '우측메뉴개수', value: 'CNT_RIGHT_MENU', width: '150px' },
        { text: '권한그룹설명', value: 'GROUP_EXPLN'},
        { text: '정렬순서', value: 'SORT_ORD', align: 'center', width: '100px' },
      ],
      AUTHRT_GROUP_ITEMS: [],

      //권한그룹상세정보
      CHC_AUTHRT_GROUP_LIST:[],         //권한그룹 다중선택 리스트
      AUTHRT_GROUP_ID:'',               //권한그룹ID
      AUTHRT_GROUP_NM:'',               //권한그룹명
      //MNGR_PM_CD_DROP: [],              //관리자여부 선택박스
      MNGR_PM_CD:'ALOW',                //관리자여부
      //USER_SE_CD_DROP: [],              //사용자구분 선택박스
      USER_SE_CD:'GUEST',               //사용자구분
      SORT_ORD:'',                      //정렬순서
      GROUP_EXPLN:'',                   //권한그룹 설명
      AUTHRT_GROUP_ADD_BTN:false,       //권한그룹등록버튼 활성화 여부
      AUTHRT_GROUP_SAVE_BTN:true,       //권한그룹저장버튼 활성화 여부
      ALERT_DEL_AUTHRT:{
        alertDialogToggle: true,
        msg: '권한그룹을 삭제하시겠습니까?',
        iconClass: 'is-info',
        type: 'confirm',
        callYes: this.del_authrt,
        callNo: this.delNo,
      },          //권한그룹 삭제 확인창
      ALERT_STRG_AUTHRT:{
        alertDialogToggle: true,
        msg: '권한그룹을 저장하시겠습니까?',
        iconClass: 'is-info',
        type: 'confirm',
        callYes: this.strg_authrt,
        callNo: this.delNo,
      },          //권한그룹 등록 확인창

      // 메뉴 권한 관리
      MENU_GROUP_DROP: [],              //메뉴검색 메뉴그룹
      MENU_GROUP:'',                    //선택 메뉴그룹
      MENU_GROUP_TEXT:'',               //선택 메뉴그룹
      AUTHRT_GROUP_DROP: [],            //권한그룹선택박스
      AUTHRT_GROUP: '',                 //선택 권한그룹

      // grid
      page2: 1,
      pageCount2: 0,
      perPage2: [15,30,50,100],
      ROW_PER_PAGE2: -1,
      UN_STNG_MENU_HEADER: [
        { text: '번호', value: 'ROWNUM', align: 'center', width: '80px' },
        { text: '메뉴명', value: 'MENU_NM', align: 'center', width: '120px' },
        { text: '메뉴구분', value: 'VIEW_TRGT_NM', align: 'center', width: '120px' },
      ],                            //미설정메뉴 그리드 헤더
      UN_STNG_MENU_ITEMS: [],       //미설정메뉴 그리드 아이템

      page3: 1,
      pageCount3: 0,
      perPage3: [15,30,50,100],
      ROW_PER_PAGE3: -1,
      STNG_MENU_HEADER: [
        { text: '번호', value: 'ROWNUM', align: 'center', width: '80px' },
        { text: '메뉴명', value: 'MENU_NM', align: 'center', width: '120px' },
        { text: '메뉴구분', value: 'VIEW_TRGT_NM', align: 'center', width: '120px' },
      ],                            //설정메뉴 그리드 헤더
      STNG_MENU_ITEMS: [],          //설정메뉴 그리드 아이템
      MENU_SAVE_BTN: true,

      CHC_STNG_MENU_LIST:[],         //미설정메뉴 다중선택 리스트
      CHC_UN_STNG_MENU_LIST:[],      //설정메뉴 다중선택 리스트

      MENU_ID:'',                     //선택메뉴ID

      ALERT_STRG_MENU:{
        alertDialogToggle: true,
        msg: '메뉴를 저장하시겠습니까?',
        iconClass: 'is-info',
        type: 'confirm',
        callYes: this.strg_menu,
        callNo: this.delNo,
      },          //메뉴 등록 확인창

      page4: 1,
      pageCount4: 0,
      perPage4: [15,30,50,100],
      ROW_PER_PAGE4: -1,
      UN_STNG_BTN_HEADER: [
        { text: '번호', value: 'ROWNUM', align: 'center', width: '80px' },
        { text: '버튼ID', value: 'SCRN_BTN_ID', align: 'center', width: '120px' },
        { text: '버튼명', value: 'SCRN_BTN_NM', align: 'center', width: '120px' },
      ],
      UN_STNG_BTN_ITEMS: [],

      page5: 1,
      pageCount5: 0,
      perPage5: [15,30,50,100],
      ROW_PER_PAGE5: -1,
      STNG_BTN_HEADER: [
        { text: '번호', value: 'ROWNUM', align: 'center', width: '80px' },
        { text: '버튼ID', value: 'SCRN_BTN_ID', align: 'center', width: '120px' },
        { text: '버튼명', value: 'SCRN_BTN_NM', align: 'center', width: '120px' },
      ],
      STNG_BTN_ITEMS: [],
      BTN_SAVE_BTN: true,

      CHC_STNG_BTN_LIST:[],         //미설정버튼 다중선택 리스트
      CHC_UN_STNG_BTN_LIST:[],      //설정버튼 다중선택 리스트

      BTN_ID:'',                     //선택버튼ID
      ALERT_STRG_BTN:{
        alertDialogToggle: true,
        msg: '버튼을 저장하시겠습니까?',
        iconClass: 'is-info',
        type: 'confirm',
        callYes: this.strg_btn,
        callNo: this.delNo,
      },          //버튼 등록 확인창

      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
          REG : {alertDialogToggle: true, msg: '메시지를 저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.sysMsgStrg, callNo: this.closeMsg}
          , DEL : {alertDialogToggle: true, msg: '메시지를 삭제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.sysMsgDel, callNo: this.closeMsg}
        },
        ALERT : {
          DEL_SUCCESS : { alertDialogToggle: true, msg: '버튼이 삭제되었습니다', iconClass: 'is-done', type: 'default' }
          , REG_SUCCESS : { alertDialogToggle: true, msg: '권한그룹이 저장되었습니다', iconClass: 'is-done', type: 'default' }
          , REG_MENU_SUCCESS : { alertDialogToggle: true, msg: '메뉴가 저장되었습니다', iconClass: 'is-done', type: 'default' }
          , REG_BTN_SUCCESS : { alertDialogToggle: true, msg: '버튼이 저장되었습니다', iconClass: 'is-done', type: 'default' }
          , VALID : {alertDialogToggle: true, msg: '필수항목 확인 후<br>재시도 해주세요', iconClass: 'is-info', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST : {
          DEL_SUCCESS : {  msg: '버튼이 삭제되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          , REG_SUCCESS : {  msg: '권한그룹이 저장되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          , REG_MENU_SUCCESS : {  msg: '메뉴가 저장되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          , REG_BTN_SUCCESS : {  msg: '버튼이 저장되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        }
      },

      //필수값 체크
      valid : true,
      validateRules: {
        AUTHRT_GROUP_NM: [
          v => !!v || '권한그룹 명 은(는) 필수 입력 항목입니다.',
        ],
        MNGR_PM_CD: [
          v => !!v || '관리자 여부 은(는) 필수 입력 항목 입니다.',
        ],
        USER_SE_CD: [
          v => !!v || '사용자 구분 은(는) 필수 입력 항목 입니다.',
        ],
        GROUP_EXPLN: [
          v => !!v || '설명 은(는) 필수 입력 항목 입니다.',
        ],
      }
    }
  },
  watch: {

  },

  computed: {

  },

  //공통코드 사용시 async-await 필수 (mixin_common_code_get_all함수로 공통코드 리스트를 가지고 오기 전에 mixin_common_code_get이벤트 발생)
  async created() {
    //공통코드 목록 => 사용할 공통코드 리스트에 넣기
    this.COMM_CD_USE_LIST = [
      "MNGR_WT"     //관리자 여부
      , "USER_CL"   //사용자 구분
    ];
    //공통코드별 드롭박스 만들기
    this.COMM_CD_DROP_LIST = await this.mixin_common_code_get_all(this.COMM_CD_USE_LIST);
    //필요한 공통코드 드롭박스 생성
    //this.MNGR_PM_CD_DROP = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, 'MNGR_WT');
    //this.USER_SE_CD_DROP = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, 'USER_CL');


    await this.srch_authrt_group();
    await this.srch_menu_group();
    this.srch_stng_menu();
  },

  mounted() {
  },

  methods: {
    //권한그룹 조회
    async srch_authrt_group(){
      let sUrl = '/api/setting/system/menu-author-manage/author-group/inqire';
      let postParam = {
      }
      let headParam = {
        head: {
          SERVICE : "setting.system.menu-author-manage.author-group",
          METHOD : "inqire",
          ASYNC : false,
          TYPE : "BIZ_SERVICE",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.AUTHRT_GROUP_ITEMS = resData.DATA;

        let leng = resData.DATA.length
        for(let i=0;i<leng;i++){
          this.AUTHRT_GROUP_DROP[i] = {
            text:resData.DATA[i]["AUTHRT_GROUP_NM"],
            value:resData.DATA[i]["AUTHRT_GROUP_ID"]
          };
        }
        this.AUTHRT_GROUP = this.AUTHRT_GROUP_DROP[0].value;
      }
    },

    //권한그룹 검색(클릭)
    srch_authrt(item){
      this.AUTHRT_GROUP_SAVE_BTN = false;

      this.AUTHRT_GROUP_ID = item.AUTHRT_GROUP_ID;
      this.AUTHRT_GROUP_NM = item.AUTHRT_GROUP_NM;
      this.MNGR_PM_CD = item.MNGR_PM_CD;
      this.USER_SE_CD = item.USER_SE_CD;
      this.SORT_ORD = item.SORT_ORD;
      this.GROUP_EXPLN = item.GROUP_EXPLN;
    },

    //row클릭 색상변경
    isActiveRow(item){
      return item.AUTHRT_GROUP_ID== this.AUTHRT_GROUP_ID? 'active':'';
    },

    //권한그룹 상세 초기화
    init_authrt(type){
      this.CHC_AUTHRT_GROUP_LIST = [];
      if(type == 'NEW'){
        this.AUTHRT_GROUP_ADD_BTN = true;
        this.AUTHRT_GROUP_SAVE_BTN = false;
      } else {
        this.AUTHRT_GROUP_ADD_BTN = false;
        this.AUTHRT_GROUP_SAVE_BTN = true;
      }
      this.AUTHRT_GROUP_ID = '';
      this.AUTHRT_GROUP_NM = '';
      this.MNGR_PM_CD = 'ALOW';
      this.USER_SE_CD = 'GUEST';
      this.SORT_ORD = '';
      this.GROUP_EXPLN = '';
    },

    //권한그룹 저장
    async strg_authrt(){
      if (!this.validate()) {
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }
      let sUrl = '/api/setting/system/menu-author-manage/author-group/regist';
      let postParam = {
        AUTHRT_GROUP_ID: this.AUTHRT_GROUP_ID,
        AUTHRT_GROUP_NM: this.AUTHRT_GROUP_NM,
        MNGR_PM_CD: this.MNGR_PM_CD,
        USER_SE_CD: this.USER_SE_CD,
        SORT_ORD: this.SORT_ORD,
        GROUP_EXPLN: this.GROUP_EXPLN,
      }
      let headParam = {
        head: {
          SERVICE : "setting.system.menu-author-manage.author-group",
          METHOD : "regist",
          ASYNC : false,
          TYPE : "BIZ_SERVICE",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        // this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS)
        this.showToast(this.MESSAGE.TOAST.REG_SUCCESS)
        this.AUTHRT_GROUP_ADD_BTN = false;
        this.AUTHRT_GROUP_SAVE_BTN = false;
        this.srch_authrt_group();
        this.AUTHRT_GROUP_ID = resData.DATA[0].AUTHRT_GROUP_ID;
      }
    },

    //확인창 취소버튼
    delNo() {
      this.$store.commit("alertStore/hideAlert");
    },

    //권한그룹 삭제
    async del_authrt(){
      let arrAuthrtId = []
      let leng = this.CHC_AUTHRT_GROUP_LIST.length
      for(let i=0;i<leng;i++){
        arrAuthrtId[i] = this.CHC_AUTHRT_GROUP_LIST[i].AUTHRT_GROUP_ID;
      }
      let sUrl = '/api/setting/system/menu-author-manage/author-group/delete';
      let postParam = {
        arrAuthrtId: arrAuthrtId,
      }
      let headParam = {
        head: {
          SERVICE : "setting.system.menu-author-manage.author-group",
          METHOD : "delete",
          ASYNC : false,
          TYPE : "BIZ_SERVICE",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
        .then((response) => {
          this.$store.commit("alertStore/hideAlert");
          this.showToast(this.MESSAGE.TOAST.DEL_SUCCESS)
          // this.showAlert(this.MESSAGE.ALERT.DEL_SUCCESS)
          this.init_authrt();
          this.srch_authrt_group();
        })
        .catch((err) => {
        });
    },

    //메뉴그룹 조회 (메뉴그룹 검색조건 선택박스 만들기 STG_M0604에서 가져온 함수==>공통으로 뺄지 협의)
    async srch_menu_group(){
      let sUrl = '/api/setting/system/menu-manage/group/inqire';
      let postParam = {
      }
      let headParam = {
        head: {
          SERVICE : "setting.system.menu-manage.group",
          METHOD : "inqire",
          ASYNC : false,
          TYPE : "BIZ_SERVICE",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        let leng = resData.DATA.length
        for(let i=0;i<leng;i++){
          this.MENU_GROUP_DROP[i] = {text:resData.DATA[i]["CD_NM"],value:resData.DATA[i]["CD"]};
        }
        this.MENU_GROUP_DROP.push({text:"좌측메뉴",value:"LEFT"});
        this.MENU_GROUP_DROP.push({text:"우측메뉴",value:"RIGHT"});
        this.MENU_GROUP_DROP.push({text:"개발자메뉴",value:"DEV"});
        this.MENU_GROUP_DROP.unshift({text:"전체",value:""});
        this.MENU_GROUP = this.MENU_GROUP_DROP[0].value;
      }
    },

    //메뉴리스트 가져와 설정(할당),미설정(미할당) 나누기
    async srch_stng_menu(){
      let sUrl = '/api/setting/system/menu-author-manage/asgn-menu/inqire';
      let postParam = {
        MENU_GROUP: this.MENU_GROUP == "" || this.MENU_GROUP == "LEFT" || this.MENU_GROUP == "RIGHT" || this.MENU_GROUP == "DEV" ? '' : this.MENU_GROUP,
        VIEW_TRGT: this.MENU_GROUP == "" || this.MENU_GROUP == "LEFT" || this.MENU_GROUP == "RIGHT" || this.MENU_GROUP == "DEV" ? this.MENU_GROUP : 'MAIN',
        AUTHRT_GROUP_ID: this.AUTHRT_GROUP,
      }
      let headParam = {
        head: {
          SERVICE : "setting.system.menu-author-manage.asgn-menu",
          METHOD : "inqire",
          ASYNC : false,
          TYPE : "BIZ_SERVICE",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.STNG_MENU_ITEMS=[];
        this.UN_STNG_MENU_ITEMS=[];
        let leng = resData.DATA.length
        for(let i=0;i<leng;i++){
          if(resData.DATA[i]["VIEW_TRGT"] == 'MAIN'){
            resData.DATA[i]["VIEW_TRGT_NM"] = '메인'
          } else if(resData.DATA[i]["VIEW_TRGT"] == 'LEFT'){
            resData.DATA[i]["VIEW_TRGT_NM"] = '좌측메뉴'
          } else if(resData.DATA[i]["VIEW_TRGT"] == 'RIGHT'){
            resData.DATA[i]["VIEW_TRGT_NM"] = '우측메뉴'
          } else if(resData.DATA[i]["VIEW_TRGT"] == 'DEV'){
            resData.DATA[i]["VIEW_TRGT_NM"] = '개발메뉴'
          }
          if(resData.DATA[i]["AUTHRT_GROUP_ID"] != '' && resData.DATA[i]["AUTHRT_GROUP_ID"] != null && resData.DATA[i]["AUTHRT_GROUP_ID"] != undefined){
            this.STNG_MENU_ITEMS.push(resData.DATA[i]);
          } else {
            this.UN_STNG_MENU_ITEMS.push(resData.DATA[i]);
          }
        }
        this.getSelectedText();
      }
    },

    // 선택된 메뉴 text 설정
    getSelectedText() {
      const selectedItem = this.MENU_GROUP_DROP.find(item => item.value === this.MENU_GROUP);
      if (selectedItem) {
        this.MENU_GROUP_TEXT = selectedItem.text;
      }
    },

    //메뉴할당 row클릭 색상변경
    isActiveRow_stngMenu(item){
      return item.MENU_ID== this.MENU_ID? 'active':'';
    },

    //클릭한 설정메뉴 정보 세팅
    srch_menu(item){
      this.MENU_ID = item.MENU_ID;

      this.srch_stng_btn()
    },

    //버튼리스트 가져와 설정(할당),미설정(미할당) 나누기
    async srch_stng_btn(){
      let sUrl = '/api/setting/system/menu-author-manage/asgn-button/inqire';
      let postParam = {
        MENU_ID: this.MENU_ID,
        AUTHRT_GROUP_ID: this.AUTHRT_GROUP,
      }
      let headParam = {
        head: {
          SERVICE : "setting.system.menu-author-manage.asgn-menu",
          METHOD : "inqire",
          ASYNC : false,
          TYPE : "BIZ_SERVICE",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){

        this.STNG_BTN_ITEMS=[];
        this.UN_STNG_BTN_ITEMS=[];
        let leng = resData.DATA.length
        for(let i=0;i<leng;i++){
          if(resData.DATA[i]["AUTHRT_GROUP_ID"] != '' && resData.DATA[i]["AUTHRT_GROUP_ID"] != null && resData.DATA[i]["AUTHRT_GROUP_ID"] != undefined){
            this.STNG_BTN_ITEMS.push(resData.DATA[i]);
          } else {
            this.UN_STNG_BTN_ITEMS.push(resData.DATA[i]);
          }
        }
      }
    },

    //버튼할당 row클릭 색상변경
    isActiveRow_stngBtn(item){
      return item.BTN_ID== this.BTN_ID? 'active':'';
    },

    //클릭한 설정버튼 정보 세팅
    srch_btn(item){
      this.BTN_ID = item.BTN_ID;
    },

    //미설정메뉴 -> 설정메뉴
    stng_menu(){
      let leng = this.CHC_UN_STNG_MENU_LIST.length;  //선택메뉴 개수
      for(let i=0;i<leng;i++){
        let j = this.UN_STNG_MENU_ITEMS.findIndex(item => item.MENU_ID === this.CHC_UN_STNG_MENU_LIST[i]["MENU_ID"]);     //체크된 메뉴 요소 검색
        this.UN_STNG_MENU_ITEMS.splice(j,1);      //선택된 미설정메뉴에서 제거
        this.STNG_MENU_ITEMS.push(this.CHC_UN_STNG_MENU_LIST[i]);     //선택된 메뉴를 설정메뉴로 이동
      }
      this.CHC_UN_STNG_MENU_LIST = [];

      //저장버튼 활성화 - 설정메뉴 요소중 AUTHRT_GROUP_ID가 비어있는 요소 체크 =>둘 다 체크해야함
      let leng2 = this.UN_STNG_MENU_ITEMS.length;
      let leng3 = this.STNG_MENU_ITEMS.length;
      this.MENU_SAVE_BTN = true;        //저장버튼 초기화
      for(let n=0;n<leng2;n++){
        if(this.UN_STNG_MENU_ITEMS[n]["AUTHRT_GROUP_ID"] == this.AUTHRT_GROUP){
          this.MENU_SAVE_BTN = false;
          break;
        }
      }
      for(let n=0;n<leng3;n++){
        if(this.STNG_MENU_ITEMS[n]["AUTHRT_GROUP_ID"] != this.AUTHRT_GROUP){
          this.MENU_SAVE_BTN = false;
          break;
        }
      }
    },

    //설정메뉴 -> 미설정메뉴
    un_stng_menu(){
      let leng = this.CHC_STNG_MENU_LIST.length;  //선택메뉴 개수
      for(let i=0;i<leng;i++){
        let j = this.STNG_MENU_ITEMS.findIndex(item => item.MENU_ID === this.CHC_STNG_MENU_LIST[i]["MENU_ID"]);     //체크된 메뉴 요소 검색
        this.STNG_MENU_ITEMS.splice(j,1);      //선택된 설정메뉴에서 제거
        this.UN_STNG_MENU_ITEMS.push(this.CHC_STNG_MENU_LIST[i]);     //선택된 메뉴를 미설정메뉴로 이동
      }
      this.CHC_STNG_MENU_LIST = [];

      //저장버튼 활성화 - 미설정메뉴 요소중 AUTHRT_GROUP_ID가 비어있지 않은 요소 체크 =>둘 다 체크해야함
      let leng2 = this.UN_STNG_MENU_ITEMS.length;
      let leng3 = this.STNG_MENU_ITEMS.length;
      this.MENU_SAVE_BTN = true;        //저장버튼 초기화
      for(let n=0;n<leng2;n++){
        if(this.UN_STNG_MENU_ITEMS[n]["AUTHRT_GROUP_ID"] == this.AUTHRT_GROUP){
          this.MENU_SAVE_BTN = false;
          break;
        }
      }
      for(let n=0;n<leng3;n++){
        if(this.STNG_MENU_ITEMS[n]["AUTHRT_GROUP_ID"] != this.AUTHRT_GROUP){
          this.MENU_SAVE_BTN = false;
          break;
        }
      }
    },

    //설정메뉴 저장
    async strg_menu(){
      //설정메뉴 -> 미설정메뉴
      let unStngMenu = [];
      let leng = this.UN_STNG_MENU_ITEMS.length;
      for(let n=0;n<leng;n++){
        if(this.UN_STNG_MENU_ITEMS[n]["AUTHRT_GROUP_ID"] == this.AUTHRT_GROUP){
          unStngMenu.push(this.UN_STNG_MENU_ITEMS[n]["MENU_ID"])
        }
      }
      //미설정메뉴->설정메뉴
      let stngMenu = [];
      let leng2 = this.STNG_MENU_ITEMS.length;
      for(let n=0;n<leng2;n++){
        if(this.STNG_MENU_ITEMS[n]["AUTHRT_GROUP_ID"] != this.AUTHRT_GROUP){
          stngMenu.push(this.STNG_MENU_ITEMS[n]["MENU_ID"]);
        }
      }
      let sUrl = '/api/setting/system/menu-author-manage/regist';
      let postParam = {
        AUTHRT_GROUP_ID: this.AUTHRT_GROUP,
        arrStngMenu:stngMenu,
        arrUnStngMenu:unStngMenu,
      }
      let headParam = {
        head: {
          SERVICE : "setting.system.menu-author-manage",
          METHOD : "regist",
          ASYNC : false,
          TYPE : "BIZ_SERVICE",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam,headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        this.showToast(this.MESSAGE.TOAST.REG_MENU_SUCCESS)
        // this.showAlert(this.MESSAGE.ALERT.REG_MENU_SUCCESS)
        this.MENU_SAVE_BTN = true;
        this.srch_stng_menu();
        this.MENU_ID='';
      }
    },

    //미설정버튼 -> 설정버튼
    stng_btn(){
      let leng = this.CHC_UN_STNG_BTN_LIST.length;  //선택버튼 개수
      for(let i=0;i<leng;i++){
        let j = this.UN_STNG_BTN_ITEMS.findIndex(item => item.BTN_ID === this.CHC_UN_STNG_BTN_LIST[i]["BTN_ID"]);     //체크된 버튼 요소 검색
        this.UN_STNG_BTN_ITEMS.splice(j,1);      //선택된 미설정버튼에서 제거
        this.STNG_BTN_ITEMS.push(this.CHC_UN_STNG_BTN_LIST[i]);     //선택된 버튼를 설정버튼로 이동
      }
      this.CHC_UN_STNG_BTN_LIST = [];

      //저장버튼 활성화 - 설정버튼 요소중 AUTHRT_GROUP_ID가 비어있는 요소 체크 =>둘 다 체크해야함
      let leng2 = this.UN_STNG_BTN_ITEMS.length;
      let leng3 = this.STNG_BTN_ITEMS.length;
      this.BTN_SAVE_BTN = true;        //저장버튼 초기화
      for(let n=0;n<leng2;n++){
        if(this.UN_STNG_BTN_ITEMS[n]["AUTHRT_GROUP_ID"] == this.AUTHRT_GROUP){
          this.BTN_SAVE_BTN = false;
          break;
        }
      }
      for(let n=0;n<leng3;n++){
        if(this.STNG_BTN_ITEMS[n]["AUTHRT_GROUP_ID"] != this.AUTHRT_GROUP){
          this.BTN_SAVE_BTN = false;
          break;
        }
      }
    },

    //설정버튼 -> 미설정버튼
    un_stng_btn(){
      let leng = this.CHC_STNG_BTN_LIST.length;  //선택버튼 개수
      for(let i=0;i<leng;i++){
        let j = this.STNG_BTN_ITEMS.findIndex(item => item.BTN_ID === this.CHC_STNG_BTN_LIST[i]["BTN_ID"]);     //체크된 버튼 요소 검색
        this.STNG_BTN_ITEMS.splice(j,1);      //선택된 설정버튼에서 제거
        this.UN_STNG_BTN_ITEMS.push(this.CHC_STNG_BTN_LIST[i]);     //선택된 버튼를 미설정버튼로 이동
      }
      this.CHC_STNG_BTN_LIST = [];

      //저장버튼 활성화 - 미설정버튼 요소중 AUTHRT_GROUP_ID가 비어있지 않은 요소 체크 =>둘 다 체크해야함
      let leng2 = this.UN_STNG_BTN_ITEMS.length;
      let leng3 = this.STNG_BTN_ITEMS.length;
      this.BTN_SAVE_BTN = true;        //저장버튼 초기화
      for(let n=0;n<leng2;n++){
        if(this.UN_STNG_BTN_ITEMS[n]["AUTHRT_GROUP_ID"] == this.AUTHRT_GROUP){
          this.BTN_SAVE_BTN = false;
          break;
        }
      }
      for(let n=0;n<leng3;n++){
        if(this.STNG_BTN_ITEMS[n]["AUTHRT_GROUP_ID"] != this.AUTHRT_GROUP){
          this.BTN_SAVE_BTN = false;
          break;
        }
      }
    },

    //설정버튼 저장
    async strg_btn(){
      //설정버튼 -> 미설정버튼
      let unStngBtn = [];
      let leng = this.UN_STNG_BTN_ITEMS.length;
      for(let n=0;n<leng;n++){
        if(this.UN_STNG_BTN_ITEMS[n]["AUTHRT_GROUP_ID"] == this.AUTHRT_GROUP){
          unStngBtn.push(this.UN_STNG_BTN_ITEMS[n]["BTN_ID"])
        }
      }
      //미설정버튼->설정버튼
      let stngBtn = [];
      let leng2 = this.STNG_BTN_ITEMS.length;
      for(let n=0;n<leng2;n++){
        if(this.STNG_BTN_ITEMS[n]["AUTHRT_GROUP_ID"] != this.AUTHRT_GROUP){
          stngBtn.push(this.STNG_BTN_ITEMS[n]["BTN_ID"]);
        }
      }
      let sUrl = '/api/setting/system/menu-author-manage/button-author/regist';
      let postParam = {
        AUTHRT_GROUP_ID: this.AUTHRT_GROUP,
        MENU_ID:this.MENU_ID,
        arrStngBtn:stngBtn,
        arrUnStngBtn:unStngBtn,
      }
      let headParam = {
        head: {
          SERVICE : "setting.system.menu-author-manage.button-author",
          METHOD : "regist",
          ASYNC : false,
          TYPE : "BIZ_SERVICE",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        this.showToast(this.MESSAGE.TOAST.REG_BTN_SUCCESS)
        // this.showAlert(this.MESSAGE.ALERT.REG_BTN_SUCCESS);
        this.BTN_SAVE_BTN = true;
        this.srch_stng_btn();
        this.BTN_ID='';
      }
    },

    //권한그룹 필수값 체크
    validate () {
      return this.$refs.form.validate();
    },
  },
}
</script>

<style lang="scss" scoped></style>