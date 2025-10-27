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
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="this.mixin_common_code_get(this.common_code, 'BORD_TP', '전체')"
                  placeholder="선택하세요"
                  v-model="BOARD_TP"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                제목
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form is-lg"
                  placeholder="검색어 입력"
                  v-model="BOARD_TITLE"
                  @keydown.enter="getGridList(false)"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                등록자
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form is-lg"
                  placeholder="검색어 입력"
                  v-model="BOARD_WRITER"
                  @keydown.enter="getGridList(false)"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                수정자
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form is-lg"
                  placeholder="검색어 입력"
                  v-model="BOARD_EDITOR"
                  @keydown.enter="getGridList(false)"
                />
              </div>
            </div>
            <v-btn class="pl-btn is-icon" @click="getGridList(false)">
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
            <v-btn class="pl-btn is-icon is-sub" @click="dblClickRow" :disabled="selectedRow.ROW_NUMBER != undefined ? false : true">
              <span class="pl-icon20 document"></span>
              선택항목 상세
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub" @click="regBtn">
              <span class="pl-icon20 circle-plus"></span>
              등록
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub" @click="deleteBtn" :disabled="selectedData.length != 0 ? false : true">
              <span class="pl-icon20 trash"></span>
              삭제
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ gridTotalCnt }})</em> 건</span>
          </div>
        </div>
        <v-data-table
          class="pl-grid has-control"
          style="cursor:pointer;"
          show-select
          :headers="gridDataHeaders"
          :items="gridItems"
          fixed-header
          item-key="ROW_NUMBER"
          height="562px"
          :items-per-page="ROW_PER_PAGE"
          :item-class="isActiveRow"
          hide-default-footer
          :page.sync="page"
          @page-count="pageCount = $event"
          @click:row="rowSelect"
          @dblclick:row="dblClickRow"
          v-model="selectedData"
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

          <span class="pl-pager-period">
            보기 {{ mixin_getPagePeriod(gridItems, page) }} / {{ gridItems.length }}
            <compo-tooltip-btn
              TitleProp="다음 검색"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 arrow-next-paging"
              TooltipPositionProp="bottom"
              :DisabledProp = "nextDisabled"
              @btnClick="getGridList(true)"
            ></compo-tooltip-btn>
          </span>
        </div>
      </div>
    </div>

    <!-- dialog -->
    <v-dialog
      v-model="dialogRegBoard"
      content-class="dialog-draggable"
      hide-overlay
      :retain-focus="false">
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :headerTitle='HEADER_TITLE'
        @hide="mixin_hideDialog('RegBoard')">
        <template slot="body">
          <v-form ref="form">
            <div class="pl-form-inline-wrap vertical mt-2">
              <div class="pl-form-inline">
                <span class="pl-label">
                  게시 기간
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
<!--                  <div class="pl-calendar-range-form">-->
<!--                    <compo-date-picker-->
<!--                      DateType="dateInput"-->
<!--                      :DateProp.sync="digParams.START_DATE"/>-->
<!--                    <span class="pl-unit">~</span>-->
<!--                    <compo-date-picker-->
<!--                      DateType="dateInput"-->
<!--                      :DateProp.sync="digParams.END_DATE"/>-->
<!--                    <compo-drop-picker-->
<!--                      :StartDateProp.sync="digParams.START_DATE"-->
<!--                      :EndDateProp.sync="digParams.END_DATE"-->
<!--                      :BbsDateProp="flagData.BBS_PROP"-->
<!--                    />-->
<!--                  </div>-->
                  <compo-date-range-picker
                      :StartDayProp.sync="digParams.START_DATE"
                      :EndDayProp.sync="digParams.END_DATE"
                      @startDayChange="mixin_testLog(digParams.START_DATE)"
                      @endDayChange="mixin_testLog(digParams.END_DATE)"
                  />
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
                    :items="this.mixin_common_code_get(this.common_code, 'BORD_TP')"
                    placeholder="선택하세요"
                    v-model="digParams.BOARD_TP"
                    :rules="detailValidateRules.DATA_TYPE_CD"
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
                    v-model="digParams.BOARD_TITLE"
                    :rules="detailValidateRules.EXPSN_ATTR_NM"
                    v-byte-counter="300"
                  />
                </div>
              </div>
              <ckeditor @namespaceloaded="onNamespaceLoaded" v-model="digParams.BOARD_CONTENTS" :config="editorConfig"></ckeditor>
            </div>
            <!-- file grid -->
            <compo-file-grid
              :FilesProp="filelist"
              @addFile="clickAddFiles"
              :DelData="DEL_FILE"
              @input="DEL_FILE = $event"
              @removeFile="removeFile()"
            ></compo-file-grid>
            <input ref="fileUpload" type="file" multiple @change="handleFileUpload" style="display: none" />
          </v-form>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="[mixin_hideDialog('RegBoard'), initSelect()]">닫기</v-btn>
          <v-btn class="pl-btn" @click="expsnAttrValidate">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
export default {
    name:"MENU_SVY_M0001", //name은 'MENU_' + 파일명 조합

 components: {
   
  },
 data() {
    return {
    }
  },
  watch: {
    
  },

  computed: {
    
  },

  created() {
    
  },

  mounted() {
    
  },
  
  methods: {
    
  },
}
</script>

<style lang="scss" scoped>

</style>