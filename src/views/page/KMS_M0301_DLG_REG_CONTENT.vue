<template>
  <div>
    <v-tabs class="pl-tabs" v-model="tab">
      <v-tab @click="getContent">콘텐츠 정보</v-tab>
      <v-tab @click="getAddInfo" :disabled="CONTENT_INFO.KMS_CONTS_ID == '' || CONTENT_INFO.SE_CD == 'SCRIPT'">부가 정보</v-tab>
    </v-tabs>
    <div style="height: 745px">
        <v-tabs-items v-model="tab" class="pl-tabs-items">
          <!--콘텐츠 정보 탭-->
          <v-tab-item transition="fade-transition">
            <div class="pl-cols" style="height: 100%;">
              <div class="is-col-fix is-vrt" style="width: 700px;">

                <!-- 기본 정보 -->
                <v-form ref="contentInfo">
                  <div class="pl-card is-noborder" >
                    <!-- 분류 정보 -->
                    <div class="pl-chatting-cs-info ">
                      <div class="pl-chatting-cs-info-manager">
                          <div><strong class="pl-chatting-cs-info-tit">분류</strong>
                          <span class="pl-chatting-cs-info-desc" v-text="KMS_CLSF_INFO.FULL_PATH"></span>
                          </div>
                          <div>
                          <strong class="pl-chatting-cs-info-tit">공개 여부</strong>
                          <span class="pl-chatting-cs-info-desc" v-text="KMS_CLSF_INFO.IS_OPEN"></span>
                          </div>
                      </div>
                    </div>
                    <div style="overflow-y: auto; height: 380px;">
                      <ul class="pl-list-dot is-no-border">
                        <li>핵심 <strong class="is-txt-error">키워드는 반드시 하나이상 입력</strong>하여야 합니다.</li>
                        <li>필수 항목을 입력하신 후 <strong>[저장] 버튼을 클릭</strong>하십시오.</li>
                      </ul>
                      <div class="pl-form-inline-wrap vertical type-kms is-mt-m">
                        <div class="pl-form-inline">
                          <span class="pl-label">
                            지식 구분
                            <v-icon class="pl-icon20 required"></v-icon>
                          </span>
                          <div class="pl-desc">
                            <v-select
                              class="pl-form"
                              :items="mixin_common_code_get(this.common_code , 'KMS_CL' )"
                              placeholder="선택하세요"
                              v-model="CONTENT_INFO.SE_CD"
                              :rules="validateRules.SE_CD"
                            ></v-select>
                          </div>
                        </div>
                        <div class="pl-form-inline" v-if="CONTENT_INFO.SE_CD != ''">
                          <span class="pl-label">
                            지식 콘텐츠명
                            <v-icon class="pl-icon20 required"></v-icon>
                          </span>
                          <div class="pl-desc">
                            <v-text-field
                              class="pl-form"
                              v-model="CONTENT_INFO.KMS_CONTS_NM"
                              :rules="validateRules.KMS_CONTS_NM"
                            />
                          </div>
                        </div>
                        <div class="pl-form-inline" v-if="CONTENT_INFO.SE_CD == 'KNOWLEDGE'">
                          <span class="pl-label">
                            필수안내
                            <v-icon class="pl-icon20 required"></v-icon>
                            <!-- 툴팁 버튼 -->
                            <compo-tooltip-btn
                              TitleProp="필수로 지정하시면 상담직원이 지식 콘텐츠 조회 시<br>목록에 아이콘이 표시되어 조회됩니다."
                              ClassProp="pl-tooltip-btn"
                              IconProp="pl-icon20 question"
                              TooltipPositionProp="bottom"
                            ></compo-tooltip-btn>
                          </span>
                          <div class="pl-desc">
                            <v-select
                              class="pl-form"
                              :items="[{text:'필수' ,value:'Y'},{text:'옵션' ,value:'N'}]"
                              placeholder="선택하세요"
                              v-model="CONTENT_INFO.ESNTL_YN"
                              :rules="validateRules.ESNTL_YN"
                            ></v-select>
                          </div>
                        </div>
                        <div class="pl-form-inline" v-if="CONTENT_INFO.SE_CD != ''">
                          <span class="pl-label">
                            표시 순서
                            <v-icon class="pl-icon20 required"></v-icon>
                          </span>
                          <div class="pl-desc">
                            <v-text-field
                              class="pl-form"
                              type="number"
                              min="0"
                              v-model="CONTENT_INFO.SORT_ORD"
                              :rules="validateRules.SORT_ORD"
                            />
                          </div>
                        </div>
                        <div class="pl-form-inline" v-if="CONTENT_INFO.SE_CD != ''">
                          <span class="pl-label">
                            핵심 키워드
                            <v-icon class="pl-icon20 required"></v-icon>
                          </span>
                          <div class="pl-desc">
                            <div class="pl-tags-wrap">
                              <v-chip-group active-class="active-tag" column>
                                  <v-chip v-for="(tag, index) in KEYWORDS"

                                    :key="index"
                                    close
                                    @click:close="deleteTag(tag, index)">
                                    {{ tag }}
                                  </v-chip>
                                <template>
                                  <!-- 추가 입력 -->
                                  <v-text-field v-model="TAG_VALUE" @keydown.enter="addTag()"
                                    :style="computedTagSize" style="min-width: 120px;" placeholder="키워드 입력" class="pl-form is-tag">
                                    <template v-slot:append>
                                      <v-btn @click="addTag()" class="pl-btn has-icon-only">
                                        <span class="pl-icon20 edit"></span>
                                      </v-btn>
                                    </template>
                                  </v-text-field>
                                </template>
                              </v-chip-group>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-form>
              </div>
              <!-- 콘텐츠 정보 -->
              <div class="pl-card">
                <h2 class="pl-dialog-body-tit-h2 d-flex ">콘텐츠 정보
                  <v-btn
                    v-if="CONTENT_INFO.SE_CD == 'KNOWLEDGE'"
                    class="pl-btn is-sub ml-auto"
                    @click="mixin_showDialog('Template')"
                    >템플릿</v-btn>
                </h2>
                <div class="is-mt-m" v-if="CONTENT_INFO.SE_CD == 'KNOWLEDGE'">
                  <ckeditor
                    @namespaceloaded="onNamespaceLoaded"
                    v-model="editData"
                    :config="editorConfig">
                  </ckeditor>
                </div>
                <div class="is-mt-m" v-if="CONTENT_INFO.SE_CD == 'SCRIPT'">
                  <v-textarea
                    class="pl-form"
                    v-model="editData"
                    auto-grow
                    height="677px"
                    :spellcheck="false"
                  />
                </div>
              </div>
            </div>
          </v-tab-item>

          <!-- 부가 정보 탭 -->
          <v-tab-item transition="fade-transition">
            <div class="pl-card">
              <!-- 관련 콘텐츠 정보 -->
              <h2 class="pl-dialog-body-tit-h2 d-flex">관련 콘텐츠 정보
                <div class="pl-btn-wrap ml-auto">
                  <!-- 삭제 버튼 -->
                  <compo-tooltip-btn
                    TitleProp="삭제"
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 trash"
                    TooltipPositionProp="bottom"
                    @btnClick="delRelContentsValid"
                  ></compo-tooltip-btn>
                  <!-- 등록 버튼 -->
                  <compo-tooltip-btn
                    TitleProp="등록"
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 circle-plus"
                    TooltipPositionProp="bottom"
                    @btnClick="openFindConts"
                  ></compo-tooltip-btn>
                </div>
              </h2>
              <div >
                <v-data-table
                  class="pl-grid has-control"
                  :headers="ETC0_Grid.headers"
                  :items="ETC0_Grid.items"
                  show-select
                  fixed-header
                  item-key="KMS_REL_CONTS_ID"
                  height="177px"
                  :items-per-page="ETC0_Grid.ROW_PER_PAGE"
                  hide-default-footer
                  :page.sync="ETC0_Grid.page"
                  @page-count="ETC0_Grid.pageCount = $event"
                  no-data-text="등록된 데이터가 없습니다."
                  v-model="ETC0_Grid.checkedItems"
                  >
                </v-data-table>
              </div>

              <!-- 관련 링크 정보 -->
              <h2 class="pl-dialog-body-tit-h2 d-flex is-mt-l">관련 링크 정보
                <div class="pl-btn-wrap ml-auto">
                  <!-- 삭제 버튼 -->
                  <compo-tooltip-btn
                    TitleProp="삭제"
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 trash"
                    TooltipPositionProp="bottom"
                    @btnClick="delRelLinkValid"
                  ></compo-tooltip-btn>
                  <!-- 등록 버튼 -->
                  <compo-tooltip-btn
                    TitleProp="등록"
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 circle-plus"
                    TooltipPositionProp="bottom"
                    @btnClick="addRelLink"
                  ></compo-tooltip-btn>
                </div>
              </h2>
              <div >
                <v-form ref="relLink">
                  <v-data-table
                  class="pl-grid type-hover-func has-control"
                  :headers="ETC1_Grid.headers"
                  :items="ETC1_Grid.items"
                  show-select
                  fixed-header
                  item-key="KMS_REL_LNK_ID"
                  height="212px"
                  :items-per-page="-1"
                  hide-default-footer
                  :page.sync="ETC1_Grid.page"
                  @page-count="ETC1_Grid.pageCount = $event"
                  no-data-text="등록된 데이터가 없습니다."
                  v-model="ETC1_Grid.checkedItems"
                  >
                  <template v-slot:item.REL_LNK_NM="{ item }">
                    <template v-if="item.editable">
                      <v-text-field
                        class="pl-form is-auto"
                          v-model="item.REL_LNK_NM"
                          :rules="validateRules.REL_LNK_NM"
                      ></v-text-field>
                    </template>
                    <template v-else>
                        {{ item.REL_LNK_NM }}
                    </template>
                  </template>
                  <template v-slot:item.REL_LNK_URL="{ item }">
                    <template v-if="item.editable">
                      <v-text-field
                        class="pl-form is-auto"
                          v-model="item.REL_LNK_URL"
                          :rules="validateRules.REL_LNK_URL"
                      ></v-text-field>
                    </template>
                    <template v-else>
                        {{ item.REL_LNK_URL }}
                    </template>
                  </template>
                  <template v-slot:item.MOD_BUTTON="{ item }">
                    <compo-tooltip-btn
                      :TitleProp="item.editable ? '저장' : '수정'"
                      ClassProp="pl-tooltip-btn"
                      :IconProp="item.editable ? 'pl-icon20 is-drag-icon-check' : 'pl-icon20 edit'"
                      TooltipPositionProp="bottom"
                      @btnClick="editItem(item)"
                    ></compo-tooltip-btn>
                  </template>

                </v-data-table>
                </v-form>
              </div>

              <!-- 첨부파일 -->
              <input ref="fileUpload" type="file" multiple @change="handleFileUpload" style="display: none" />
              <h2 class="pl-dialog-body-tit-h2 d-flex is-mt-l">첨부파일
                <div class="pl-btn-wrap ml-auto">
                  <!-- 삭제 버튼 -->
                  <compo-tooltip-btn
                    TitleProp="삭제"
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 trash"
                    TooltipPositionProp="bottom"
                    @btnClick="delRelFileValid"
                  ></compo-tooltip-btn>
                  <!-- 등록 버튼 -->
                  <compo-tooltip-btn
                    TitleProp="등록"
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 circle-plus"
                    TooltipPositionProp="bottom"
                    @btnClick="fileChoose"
                  ></compo-tooltip-btn>
                </div>
              </h2>
              <div >
                <v-data-table
                  class="pl-grid has-control"
                  :headers="ETC2_Grid.headers"
                  :items="ETC2_Grid.items"
                  show-select
                  fixed-header
                  item-key="FILE_KEY"
                  height="177px"
                  :items-per-page="ETC2_Grid.ROW_PER_PAGE"
                  hide-default-footer
                  :page.sync="ETC2_Grid.page"
                  @page-count="ETC2_Grid.pageCount = $event"
                  no-data-text="등록된 데이터가 없습니다."
                  v-model="ETC2_Grid.checkedItems"
                  >
                  <template v-slot:item.download="{ item }">
                      <v-btn
                      class="pl-btn is-sub is-sm"
                      @click="mixin_fileDownload(item, item.busiType, item.pathType)"
                      :disabled="!item.download">다운로드</v-btn>
                  </template>
                </v-data-table>
              </div>
            </div>
          </v-tab-item>
        </v-tabs-items>
    </div>

    <!-- 템플릿 등록 -->
    <v-dialog
        v-model="dialogTemplate"
        content-class="dialog-draggable is-lg is-nopadding"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="템플릿 선택"
          @hide="mixin_hideDialog('Template')"
          @submit="submitDialog('Template')"
        >
          <template slot="body">
            <KMS_M0331_DLG_TEMPLATE ref="dlgTemplate" v-if="dialogTemplate
            ">
            </KMS_M0331_DLG_TEMPLATE>
          </template>
          <template slot="footer">
            <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('Template')">닫기</v-btn>
            <v-btn class="pl-btn" @click="applyTemplate">사용</v-btn>
          </template>
        </compo-dialog>
      </v-dialog>

      <!-- 콘텐츠 찾기 -->
      <v-dialog
        v-model="dialogFindContent"
        content-class="dialog-draggable is-lg is-nopadding"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="콘텐츠 찾기"
          @hide="mixin_hideDialog('FindContent')"
          @submit="submitDialog('FindContent')"
        >
          <template slot="body">
            <KMS_M0301_DLG_FIND_CONTENT
              v-model="REG_CONTS"
              v-if="dialogFindContent">
            </KMS_M0301_DLG_FIND_CONTENT>
          </template>
          <template slot="footer">
            <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('FindContent')">닫기</v-btn>
            <v-btn class="pl-btn" @click="addRelContents">적용</v-btn>
          </template>
        </compo-dialog>
      </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import KMS_M0331_DLG_TEMPLATE from './KMS_M0301_DLG_TEMPLATE.vue';
import KMS_M0301_DLG_FIND_CONTENT from './KMS_M0301_DLG_FIND_CONTENT.vue';

export default {
  name: "KMS_DLG_REG_CONTENT",
  props: {
    KMS_CONTS_ID: String,
    KMS_CLSF_INFO: Object
  },
  components: {
    KMS_M0331_DLG_TEMPLATE
    ,KMS_M0301_DLG_FIND_CONTENT
  },
  data() {
    return {
      //commn
      common_code : {},
      tab : null,
      //editor
      editorConfig: {
        height: '600px',
      },

      //기본 정보
      CONTENT_INFO : {
        KMS_CONTS_ID : this.KMS_CONTS_ID
        , KMS_CLSF_ID : ''
        , KMS_CONTS_NM: ''
        , STTS_CD: ''
        , FILE_GROUP_KEY: ''
        , SE_CD : ''
        , ESNTL_YN : ''
        , SORT_ORD : ''
        , KMS_CONTS_CN : ''
      },
      KEYWORDS : [],
      TAG_VALUE : '',
      editData : '',

      //부가 정보
      REG_CONTS : {
        INFO : [],
      },
      ETC0_Grid : {
        page: 1,
        pageCount: 0,
        perPage: [15, 30, 50, 100],
        ROW_PER_PAGE: 15,
        headers: [
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px', sortable: false },
          { text: '지식분류', value: 'FULL_PATH', align: 'left', width: '300px', sortable: false },
          { text: '콘텐츠 ID', value: 'KMS_REL_CONTS_ID', align: 'left', width: '100px', sortable: false },
          { text: '지식 콘텐츠', value: 'KMS_CONTS_NM', align: 'left', sortable: false },
          { text: '등록자', value: 'REG_DT', align: 'left', width: '100px', sortable: false },
          { text: '등록일', value: 'RGTR_NM', align: 'left', width: '100px', sortable: false },
        ],
        items: [],
        SELECTED_ROW : {},
        curEditItem : null,
        checkedItems : []
      },
      ETC1_Grid : {
        page: 1,
        pageCount: 0,
        perPage: [15, 30, 50, 100],
        ROW_PER_PAGE: 15,
        headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '90px', sortable: false },
        { text: '링크제목', value: 'REL_LNK_NM', align: 'left', width: '200px', sortable: false },
        { text: 'URL', value: 'REL_LNK_URL', align: 'left', sortable: false },
        { text: '등록자', value: 'RGTR_NM', align: 'center', width: '110px', sortable: false },
        { text: '등록일', value: 'REG_DT', align: 'center', width: '110px', sortable: false },
        { text: '', value: 'MOD_BUTTON', align: 'center', width: '50px', sortable: false },
      ],
        items: [],
        SELECTED_ROW : {},
        checkedItems : []
      },
      ETC2_Grid : {
        page: 1,
        pageCount: 0,
        perPage: [15, 30, 50, 100],
        ROW_PER_PAGE: 15,
        headers: [
            { text: '파일명', value: 'ACTL_FILE_NM', align: 'left',sortable: false, },
            { text: '크기', value: 'FILE_SZ', align: 'center',sortable: false, width: '150px' },
            { text: '다운로드', value: 'download', align: 'center',sortable: false, width: '150px' },
            { text: '다운로드 수', value: 'DWNLD_CNT', align: 'center',sortable: false, width: '150px' },
        ],
        items: [],
        SELECTED_ROW : {},
        checkedItems : [],
        fileGroupKey : '',
      },


      //dialog
      dialogTemplate : false,
      dialogFindContent : false,

      validateRules: {
        KMS_CONTS_NM: [v => !!v || '체크리스트 명은 필수 항목 입니다.'],
        SE_CD: [v => !!v || '지식구분은 필수 항목 입니다.'],
        ESNTL_YN: [v => (v && !!v.trim()) || '필수안내는 필수 항목 입니다.'],
        SORT_ORD: [v => !!v || '표시 순서는 필수 항목 입니다.'],
        REL_LNK_NM: [v => !!v || ''],
        REL_LNK_URL: [v => !!v || ''],
      },
      //confirm alert 메시지
      MESSAGE : {
        CONFIRM : {
          CONTENT_REG : {alertDialogToggle: true, msg: '내용을 저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.saveContent, callNo: this.closeMsg}
          ,REL_CONTS_DEL : {alertDialogToggle: true, msg: '선택된 항목을 삭제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.dleRelContents, callNo: this.closeMsg}
          ,REL_URL_DEL : {alertDialogToggle: true, msg: '선택된 항목을 삭제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.delRelLink, callNo: this.closeMsg}
          ,REL_FILE_DEL : {alertDialogToggle: true, msg: '선택된 항목을 삭제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.delRelFile, callNo: this.closeMsg}
        },
        ALERT : {
          NO_KEYWORD : {alertDialogToggle: true, msg: '핵심 키워드는 필수 항목입니다.', iconClass: 'is-caution', type: 'default'}
          ,EMPTY_KEYWORD : {alertDialogToggle: true, msg: '핵심 키워드 값을 입력해 주세요.', iconClass: 'is-caution', type: 'default'}
          ,NO_CHK_CONTS : {alertDialogToggle: true, msg: '추가 할 관련 콘텐츠를 선택하세요.', iconClass: 'is-caution', type: 'default'}
          ,NO_CUTT_CN : {alertDialogToggle: true, msg: '지식/스크립트 내용을 입력하세요.', iconClass: 'is-caution', type: 'default'}
          ,NO_SEL : {alertDialogToggle: true, msg: '삭제할 항목을 선택하세요.', iconClass: 'is-caution', type: 'default'}
          ,DEL_SUCCESS : {alertDialogToggle: true, msg: '삭제가 완료되었습니다', iconClass: 'is-info', type: 'default'}
          ,MINUS_THIS_CONTS : {alertDialogToggle: true, msg: '선택한 항목 중<br/>현재 콘텐츠는 제외 됩니다.', iconClass: 'is-info', type: 'default'}
          ,AFTER_MINUS_CONTS : {alertDialogToggle: true, msg: '현재 콘텐츠를 제외한<br/>선택 항목이 없습니다.', iconClass: 'is-caution', type: 'default'}
          ,FAIL_REL_URL_VALIED : {alertDialogToggle: true, msg: '링크제목,URL은 필수 항목입니다. 입력하고 다시 진행하세요.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST : {
          SUCCESS : {msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 3000}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
          ,ERROR_REL_URL_SAVE : {alertDialogToggle: true, msg: '정상적으로 저장되지 않았습니다. 잠시후에 다시 시도해 주세요.', iconClass: 'is-caution', type: 'default'}
          ,ERROR_REL_FILE_SAVE : {alertDialogToggle: true, msg: '파일전송중 에러가 발생했습니다. 잠시후에 다시 시도해 주세요.', iconClass: 'is-caution', type: 'default'}
        }
      },
    }
  },
  watch: {
  },
  computed: {
    computedTagSize() {
      return `flex: 0 0 ${this.TAG_VALUE.length + 12}ch;`;
    },
    ETC1_Grid_items() {
      return this.ETC1_Grid.items;
    }
  },
  async created() {
    this.common_code = await this.mixin_common_code_get_all(['KMS_CL']);
  },
  async mounted() {
    await this.getContent();
  },
  methods: {
    onNamespaceLoaded( CKEDITOR ) {
      //CKEditor 외부 플러그인 주입용도.
      this.mixin_CKEDITOR_plugins_addExternal( CKEDITOR );
    },


    addTag(){
      if(this.TAG_VALUE.trim() == '') {
        this.TAG_VALUE = '';
        this.showAlert(this.MESSAGE.ALERT.EMPTY_KEYWORD);
        return;
      }
      const addTag = this.TAG_VALUE.trim();
      this.TAG_VALUE = '';
      this.KEYWORDS.push(addTag);
    },

    deleteTag(tag, index) {
      // this.$set(this.KEYWORDS[index],'active',false)
      this.KEYWORDS.splice(index, 1)
    },

    applyTemplate() {
        if( !this.mixin_isEmpty(this.$refs.dlgTemplate.seletedTemplateCN()) ){
          this.editData = this.restoreXSS_CKeditor(this.$refs.dlgTemplate.seletedTemplateCN());
          this.mixin_hideDialog("Template");
        }
    },
    getActiveKeywords() {
      let list = [];
      this.KEYWORDS.forEach((item) => {
        list.push(item);
      });
      return JSON.stringify(list);
    },
    async getContent() {
      if(this.CONTENT_INFO.KMS_CONTS_ID && this.CONTENT_INFO.KMS_CONTS_ID != '') {
        const sUrl = '/api/km/conts/selectContent'
        const headParam = {head: {}}
        const postParam = {
          KMS_CONTS_ID: this.CONTENT_INFO.KMS_CONTS_ID,
          KMS_CLSF_ID: this.KMS_CLSF_INFO.KMS_CLSF_ID
        };

        let resData = await this.common_postCall(sUrl, postParam, headParam );
        if(resData.HEADER != undefined && !resData.HEADER.ERROR_FLAG) {
          this.CONTENT_INFO = resData.DATA[0]
          this.KEYWORDS = []
          this.CONTENT_INFO.KMS_KEYWD_NMS = this.CONTENT_INFO.KMS_KEYWD_NMS.split(",")
          this.editData = this.restoreXSS_CKeditor(this.CONTENT_INFO.KMS_CONTS_CN)
          this.CONTENT_INFO.KMS_KEYWD_NMS.forEach((kwyword)=>{
          this.KEYWORDS.push(kwyword)
        });
        }
      } else {
        const sUrl = '/api/km/conts/selectNewSortOrd'
        const headParam = {head: {}}
        const postParam = {
          COMM_YN: 'Y',
          KMS_CLSF_ID: this.KMS_CLSF_INFO.KMS_CLSF_ID
        };
        let resData = await this.common_postCall(sUrl, postParam, headParam );
        if(resData.HEADER != undefined && !resData.HEADER.ERROR_FLAG) {
          this.CONTENT_INFO.SORT_ORD = resData.DATA[0].SORT_ORD
        }
      }

    },

    //부가 정보 탭 클릭 시, 관련 콘텐츠, 관련 링크, 첨부파일 조회.
    getAddInfo() {
      this.getRelConts();
      this.getRelLink();
      this.getFile();
    },

    //parent(KMS_M0300)에서 호출
    saveContentValid() {
      if(!this.$refs.contentInfo.validate()) {
        this.tab = 0;
        return;
      }
      if(this.KEYWORDS.length == 0) {
        this.tab = 0;
        this.showAlert(this.MESSAGE.ALERT.NO_KEYWORD);
        return;
      }
      if(this.editData.length == 0) {
        this.tab = 0;
        this.showAlert(this.MESSAGE.ALERT.NO_CUTT_CN); return;
      }
      this.$nextTick(this.showAlert(this.MESSAGE.CONFIRM.CONTENT_REG));
    },
    async saveContent(){
      this.closeMsg();
      if(!this.$refs.contentInfo.validate() ) return;

      const sUrl = '/api/km/conts/mergeContent';
      const headParam = {head: {}};
      const postParam = {
        KMS_CONTS_ID: this.CONTENT_INFO.KMS_CONTS_ID,
        KMS_CLSF_ID : this.KMS_CLSF_INFO.KMS_CLSF_ID,
        KMS_CONTS_NM : this.CONTENT_INFO.KMS_CONTS_NM,
        SE_CD : this.CONTENT_INFO.SE_CD,
        ESNTL_YN : this.CONTENT_INFO.SE_CD == 'KNOWLEDGE' ? this.CONTENT_INFO.ESNTL_YN : undefined,
        SORT_ORD : this.CONTENT_INFO.SORT_ORD,
        // 지식 콘텐츠 관리에서 등록 시, 공통_여부 = 'Y'
        COMM_YN : 'Y',
        KMS_CONTS_CN : this.CONTENT_INFO.SE_CD == 'KNOWLEDGE' ? this.restoreXSS_CKeditorDec(this.editData) : this.editData,
        LIST : this.getActiveKeywords()
      }
      if(this.CONTENT_INFO.STTS_CD == 'RFSL') {
        postParam.STTS_CD = 'WRTG';
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if(resData.HEADER != undefined && !resData.HEADER.ERROR_FLAG) {
        this.CONTENT_INFO.KMS_CONTS_ID = resData.DATA[0].KMS_CONTS_ID;
        this.getContent();
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
      }
    },


    //부가정보
    //관련 컨텐츠
    async getRelConts() {
      const sUrl = '/api/km/conts/relconts/list';
      const headParam = {head: {}};
      const postParam = {KMS_CONTS_ID: this.CONTENT_INFO.KMS_CONTS_ID};

      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if(resData.HEADER.ERROR_FLAG) {

      } else {
        this.ETC0_Grid.items = resData.DATA;
      }
    },

    // 등록 버튼
    openFindConts(){
      this.REG_CONTS.INFO = [];
      this.mixin_showDialog('FindContent');
    },
    // 적용 버튼
    async addRelContents(){
      let arrContsId = [];
      if( !this.mixin_isEmpty( this.REG_CONTS.INFO ) ) {
        arrContsId = this.checkedItemKeys(this.REG_CONTS.INFO, "KMS_CONTS_ID");
        this.mixin_hideDialog('FindContent');

        // 자신 컨텐츠는 제외.?
        // TODO : 사용여부 판단 Start ~ !
        // var tmpArr = JSON.parse(arrContsId);
        // if(!this.mixin_isEmpty(this.KMS_CONTS_ID) && tmpArr.indexOf(this.KMS_CONTS_ID) > -1) {
        //   this.showAlert(this.MESSAGE.ALERT.MINUS_THIS_CONTS);
        //   tmpArr.splice(tmpArr.indexOf(this.KMS_CONTS_ID), 1);
        // }
        // if( tmpArr.length < 1 ) {
        //   this.showAlert(this.MESSAGE.ALERT.AFTER_MINUS_CONTS);
        //   return;
        // }
        // arrContsId = JSON.stringify(tmpArr);
        // TODO : 사용여부 판단 End ~ !

        const sUrl = '/api/km/conts/relconts/update';
        const headParam = {head: {}};
        const postParam = {
            LIST: arrContsId,
            KMS_CONTS_ID: this.CONTENT_INFO.KMS_CONTS_ID};

        let resData = await this.common_postCall(sUrl, postParam, headParam );

        if(!resData.HEADER.ERROR_FLAG) {
          this.getRelConts();
        }
      } else {
        this.showAlert(this.MESSAGE.ALERT.NO_CHK_CONTS);
      }
    },
    delRelContentsValid(){
      if(this.ETC0_Grid.checkedItems.length == 0) {
        this.showAlert(this.MESSAGE.ALERT.NO_SEL);
        return;
      }
      this.showAlert(this.MESSAGE.CONFIRM.REL_CONTS_DEL);
    },
    async dleRelContents(){
        this.closeMsg();

        const sUrl = '/api/km/conts/relconts/delete';
        const headParam = {head: {}};
        const postParam = {
            LIST : this.checkedItemKeys(this.ETC0_Grid.checkedItems , "KMS_REL_CONTS_ID")
            ,KMS_CONTS_ID: this.CONTENT_INFO.KMS_CONTS_ID
        };

        let resData = await this.common_postCall(sUrl, postParam, headParam );

        if(!resData.HEADER.ERROR_FLAG) {
          this.getRelConts();
        }
    },
    //관련 컨텐츠
    //관련 링크
    async getRelLink() {
      const $this = this;
      const sUrl = '/api/km/conts/rellink/list';
      const headParam = {head: {}};
      const postParam = {KMS_CONTS_ID: this.CONTENT_INFO.KMS_CONTS_ID};

      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if(!resData.HEADER.ERROR_FLAG) {
        for(let obj of resData.DATA) {
          obj.editable = false;
          obj.MOD_BUTTON = '';
        }
        this.ETC1_Grid.items = resData.DATA;
      }
    },

    async addRelLink() {
      if(!this.validSave()){
        this.$refs.relLink.validate();
        return;
      }
      await this.saveRelLink();

      let item = {
            ROW_NUMBER : this.ETC1_Grid.items.length+1
            ,KMS_REL_LNK_ID: ''
            ,KMS_CONTS_ID: this.CONTENT_INFO.KMS_CONTS_ID
            , REL_LNK_NM:' '
            , REL_LNK_URL:' '
            , RGTR_NM:''
            ,REG_DT:''
            , editable: true
            , MOD_BUTTON: ''};

      this.ETC1_Grid.items.unshift(item);
      this.$refs.relLink.validate();
      this.$nextTick(()=>{
        item.REL_LNK_NM = item.REL_LNK_URL = '';
        this.$refs.relLink.validate();
      });
    },

    delRelLinkValid() {
      if(this.ETC1_Grid.checkedItems.length == 0) {
        this.showAlert(this.MESSAGE.ALERT.NO_SEL);
        return;
      }
      this.showAlert(this.MESSAGE.CONFIRM.REL_URL_DEL);
    },
    async delRelLink() {
      let $this = this;
      this.closeMsg();

      const sUrl = '/api/km/conts/rellink/delete';
      const headParam = {head: {}};
      const postParam = {
        LIST: this.checkedItemKeys(this.ETC1_Grid.checkedItems , "KMS_REL_LNK_ID")
        ,KMS_CONTS_ID: this.CONTENT_INFO.KMS_CONTS_ID
      };

      let resData = await this.common_postCall(sUrl, postParam, headParam );
      if(!resData.HEADER.ERROR_FLAG){
        for(let item of this.ETC1_Grid.checkedItems){
          let idx = $this.ETC1_Grid.items.indexOf(item);
          if(idx > -1) $this.ETC1_Grid.items.splice(idx,1);
        }

        let idx = 1;
        this.ETC1_Grid.items.forEach(item=>{
          item.ROW_NUMBER = idx++;
        });
      }
    },

    validSave() {
      for(var i=0;i<this.ETC1_Grid.items.length;i++){
        let item = this.ETC1_Grid.items[i];
        if(item.editable) {
            if(item.REL_LNK_NM == "" || item.REL_LNK_URL == "") {
              this.showAlert(this.MESSAGE.ALERT.FAIL_REL_URL_VALIED);
              return false;
            }
        }
      }
      return true;
    },

    async saveRelLink() {
      let $this = this;
      async function save(item) {
        const sUrl = '/api/km/conts/rellink/update';
        const headParam = {head: {}};
        const postParam = item;

        let ret = await $this.common_postCall(sUrl, postParam, headParam );

        if(ret.HEADER.ERROR_FLAG) {
          $this.showAlert($this.MESSAGE.ERROR.ERROR_REL_URL_SAVE);
          $this.getRelLink();
        }
      }

      for(var i=0;i<this.ETC1_Grid.items.length;i++){
        let item = this.ETC1_Grid.items[i];
        if(item.editable) {
            await save(item);
            item.editable = false;
        }
      }
      await $this.getRelLink();
    },

    editItem(item) {
      if(!this.validSave()){
        this.$refs.relLink.validate();
        return;
      }
      let editable = item.editable;
      if(editable) {
        this.saveRelLink();
      } else {
        item.editable = !editable;
        item.MOD_BUTTON = '';
        this.$refs.relLink.validate();
      }
    },
    //관련 링크
    //첨부파일
    async getFile() {
      if(this.CONTENT_INFO.FILE_GROUP_KEY != '') {
        this.ETC2_Grid.fileGroupKey = this.CONTENT_INFO.FILE_GROUP_KEY

        const url = "/api/file/json/list";
        const headParam = {head: {}};
        const param = {FILE_GROUP_KEY: this.ETC2_Grid.fileGroupKey};

        let ret = await this.common_postCall(url, param, headParam );
        if(!ret.HEADER.ERROR_FLAG) {
          for(let item of ret.DATA) {
            item.fileGroupKey = item.FILE_GROUP_KEY
            item.fileKey = item.FILE_KEY
            item.filename = item.ACTL_FILE_NM
            item.download = true;
            item.busiType = "km";
            item.pathType = "files";
            item.ORIGINAL_FILENAME = item.ACTL_FILE_NM;
            item.FILE_SZ = this.formatBytes(item.FILE_SZ);
          }
          this.ETC2_Grid.items = ret.DATA;
        }
      }
    },

    async updateFileInfo() {
      const sUrl = '/api/km/conts/updateContent';
      const headParam = {head: {}};
      const postParam = {
                  KMS_CONTS_ID: this.CONTENT_INFO.KMS_CONTS_ID
                , FILE_GROUP_KEY: this.ETC2_Grid.fileGroupKey};

      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if(!resData.HEADER.ERROR_FLAG) {
          this.getFile();
          //동일 파일명 업로드 시 change 이벤트가 실행되지 않아 value 초기화.
          this.$refs.fileUpload.value = '';
      }
    },

    delRelFileValid(){
      if(this.ETC2_Grid.checkedItems.length == 0) {
        this.showAlert(this.MESSAGE.ALERT.NO_SEL);
        return;
      }
      this.showAlert(this.MESSAGE.CONFIRM.REL_FILE_DEL);
    },

    async delRelFile() {
      this.closeMsg();

      const sUrl = '/api/file/delete';
      let items = this.ETC2_Grid.checkedItems;
      let param = {deleteFileKeys:[]};
      items.forEach(item=>{
        let file = {fileGroupKey: item.FILE_GROUP_KEY , fileKey: item.FILE_KEY , amdrId:'none'};
        param.deleteFileKeys.push(file);
      });

      await axios
        .post(sUrl, param, {headers:{Authorization: "bearer " + window.sessionStorage.getItem("token")}})
        .then(response => {
            if(response.data.data != undefined){

            } else {
            }
        })
        .catch(error => {});
      this.getFile();
    },

    fileChoose() {
      this.$refs.fileUpload.click();
    },
    handleFileUpload(event) {
      const files = event.target.files;
      if (this.isValidFiles(files)) {
        this.uploadFiles(files);
      }
    },
    isValidFiles(files) {
      // 파일 크기 및 형식을 설정 (대소문자 구분)
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxFileSize = 5 * 1024 * 1024; // 5MB
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        /*if (!allowedFileTypes.includes(file.type)) {
          this.showAlert({alertDialogToggle: true, msg: '지원하지 않는 파일 형식입니다.', iconClass: 'is-info', type: 'default'});
          return false;
        }*/
        if (file.size > maxFileSize) {
          this.showAlert({alertDialogToggle: true, msg: '파일 크기가 허용 범위를 초과합니다.', iconClass: 'is-info', type: 'default'});
          return false;
        }
      }
      return true;
    },
    async uploadFiles(files) {
      let busiType = 'km';
      let pathType = 'files';
      let uploadUrl = "api/file/"+ busiType +"/"+ pathType +"/uploads";
      let downloadUrl = "api/file/"+ busiType +"/"+ pathType +"/download";
      let fileUploadLib = 'dropzone'
      //파일경로 설정
      let dir = busiType+"/" + pathType;

      //파일 제한 체크 (빽엔드에서 체크 후 업로드 실패)
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();

        formData.append('action', uploadUrl);
        formData.append('method', "post");
        formData.append('custcoId', this.$store.getters['userStore/GE_USER_ROLE'].company.CD);                 //회사구분 : 1은 시스템(가이드)
        formData.append('userfiles', files[i]);           //파일(바이너리)
        formData.append('acceptedFiles', "");             //허용파일유형
        formData.append('fileUploadLib', fileUploadLib);  //파일 업로드 라이브러리
        formData.append('trgtTypeCd', "FILE");              //파일 유형
        formData.append('dir', dir);                      //파일경로
        formData.append('downloadUri', downloadUrl);      //다운로드 경로
        formData.append('uploadUri', uploadUrl);          //업로드 경로
        formData.append('userId', this.$store.getters['userStore/GE_USER_ROLE'].userId);                   //사용자 ID : 2는 시스템(가이드)
        formData.append('fileGroupKey' , this.ETC2_Grid.fileGroupKey);

        await axios
        .post(uploadUrl, formData, {headers:{Authorization: "bearer " + window.sessionStorage.getItem("token")}})
          .then(response => {
            if(response.data.data != undefined){
              this.ETC2_Grid.fileGroupKey = response.data.data[0].fileGroupKey
              this.CONTENT_INFO.FILE_GROUP_KEY = this.ETC2_Grid.fileGroupKey
            } else {
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
      this.updateFileInfo();
      // 서버로 파일 업로드 요청을 보냅니다.
    },
    // 파일크기 포맷
    formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },
    //첨부파일

    checkedItemKeys(list , key) {
      let checkedItemKeys = [];
      list.forEach(item => {
        if(item[key] != "") checkedItemKeys.push(item[key]);
      });
      return JSON.stringify(checkedItemKeys);
    },

    closeMsg() {
        this.$store.commit("alertStore/hideAlert");
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
