<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                게시판 유형
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="dropItems"
                  placeholder="선택하세요"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">제목</span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form is-lg"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">등록자</span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  placeholder="검색어 입력"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">수정자</span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  placeholder="검색어 입력"
                />
              </div>
            </div>
            <v-btn class="pl-btn is-icon">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
            <compo-tooltip-btn
              TitleProp="상세 검색"
              ClassProp="pl-tooltip-btn is-line"
              :IconProp=computedSearchToggleClass
              TooltipPositionProp="bottom"
              @btnClick="mixin_searchDetailToggle()"
            ></compo-tooltip-btn>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body">
        <div class="pl-grid-top">
          <div class="pl-grid-top-left">
            <v-btn class="pl-btn is-icon is-sub">
              <span class="pl-icon20 document"></span>
              선택항목 상세
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub" @click="mixin_showDialog('RegSurvey')">
              <span class="pl-icon20 circle-plus"></span>
              등록
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub">
              <span class="pl-icon20 trash"></span>
              삭제
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-tooltip-btn
              TitleProp="엑셀 다운로드"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 exceldown"
              TooltipPositionProp="bottom"
              @btnClick="mixin_testLog('엑셀 다운로드')"
            ></compo-tooltip-btn>
          </div>
        </div>
        <v-data-table
          class="pl-grid has-control"
          show-select
          :headers="headers"
          :items="items"
          fixed-header
          item-key="index"
          height="562px"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
          :page.sync="page"
          no-data-text="등록된 데이터가 없습니다."
          @page-count="pageCount = $event">
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

          <span class="pl-pager-period">보기 {{ mixin_getPagePeriod(items, page) }} / {{ items.length }}</span>
        </div>
      </div>
    </div>
     <!-- dialog -->
     <v-dialog
      v-model="dialogRegSurvey"
      content-class="dialog-draggable">
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="새 글 등록"
        @hide="mixin_hideDialog('RegSurvey')"
      >
        <template slot="body">
          <div class="pl-form-inline-wrap vertical mt-2">
            <div class="pl-form-inline">
              <span class="pl-label">
                게시 기간
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <div class="pl-calendar-range-form">
                  <compo-date-picker
                    DateType="dateInput"
                    :DateProp.sync="startDate"/>
                  <span class="pl-unit">~</span>
                  <compo-date-picker
                    DateType="dateInput"
                    :DateProp.sync="endDate"/>
                  <compo-drop-picker
                    :StartDateProp.sync="startDate"
                    :EndDateProp.sync="endDate"
                  />
                </div>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                게시 유형
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="dropItemsS01"
                  placeholder="선택하세요"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                제목
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                />
              </div>
            </div>
            <ckeditor @namespaceloaded="onNamespaceLoaded" v-model="editorData" :config="editorConfig" ></ckeditor>

          </div>
          <!-- file grid -->
          <compo-file-grid
            :FilesProp="itemsFile"
            @addFile="mixin_testLog('add file')"
            @removeFile="mixin_testLog('remove file')"
          ></compo-file-grid>

        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('RegSurvey')">닫기</v-btn>
          <v-btn class="pl-btn" @click="">저장</v-btn>
        </template>

      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
export default {
name:"MENU_BBS_M0100", //name은 'MENU_' + 파일명 조합
components: {
},
data() {
   return {
    // top search
    dropItems: [],

    // grid
    page: 1,
    pageCount: 0,
    perPage: [15,30,50,100],
    ROW_PER_PAGE: 15,
    headers: [
      { text: '번호', value: 'index', align: 'center', width: '80px' },
      { text: '유형', value: 'type', align: 'center', width: '120px' },
      { text: '스크립트명', value: 'subject'},
      { text: '수정일', value: 'date', align: 'center', width: '120px' },
    ],
    items: [
      {
        index: 1,
        type: '공통',
        subject: '취소수수료를 환불해 주세요.',
        contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
        date: '2020-08-05'
      },
    ],

    // dialog
    dialogRegSurvey: false,
    textareaRules: [v => v.length <= 200 || 'Max 200 characters'],
    textareaValue: '200자 제한!',
    dropItemsS01: [],
    startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    endDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    editorData: "",
    itemsFile: [
      {
        filename : '포인트 업종별 적립율 상세 정보.pdf',
        filesize : '1024KB',
        download : true,
        count : 35,
        downloadFile: 'test.pdf'
      },
      {
        filename : '포인트 업종별 적립율 상세 정보.pdf',
        filesize : '1024KB',
        download : false,
        count : 35,
        downloadFile: 'test2.pdf'
      },
    ],

   }
 },

  watch: {

  },

  computed: {

  },

  async created() {
    let codeName = ['BORD_TP'];

    this.common_code = await this.mixin_common_code_get_all(codeName);

    // 사용여부 콤보
    this.dropItems = this.mixin_common_code_get(this.common_code, 'BORD_TP', '전체');
    this.dropItemsS01 = this.mixin_common_code_get(this.common_code, 'BORD_TP');
  },

  mounted() {

  },

  methods: {
    onNamespaceLoaded( CKEDITOR ) {
      //CKEditor 외부 플러그인 주입용도.
      this.mixin_CKEDITOR_plugins_addExternal( CKEDITOR );
    },
  },
}
</script>

<style lang="scss" scoped>

</style>