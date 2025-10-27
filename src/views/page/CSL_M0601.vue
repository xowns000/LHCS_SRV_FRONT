<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols flex-grow-1">
        <!-- left -->
        <div class="is-col-fix is-vrt" style="width: 500px">
          <div class="pl-card">
            <!-- tree -->
            <div class="pl-tree-header">
              <div class="is-left">
                <label>템플릿 분류</label>
              </div>
              <div class="is-right">
                <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault')">전체 펼치기</v-btn>
                <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault')">전체 접기</v-btn>
                <compo-tooltip-btn
                  TitleProp="새로고침"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="top"
                  @btnClick="getSmsTreeInfo">
                </compo-tooltip-btn>
              </div>
            </div>
            <div class="pl-tree-body" style="height: 617px;">
              <v-treeview
                ref="treeDefault"
                :items="TREE_DATA"
                :open-all="expanded"
                activatable
                return-object
                :open-on-click=false
                color="secondary"
                class="pl-tree-view"
                @update:active="srch_tree_act"
                >
                <template v-slot:prepend="{ item, open }">
                  <v-icon v-if="item.children">
                      {{open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder'}}
                  </v-icon>
                  <v-icon v-else>
                      {{ 'pl-icon20 tree-file' }}
                  </v-icon>
                </template>
              </v-treeview>

            </div>
          </div>
          <div class="pl-card is-bottom">
            <!-- 템플릿 분류 등록 버튼 -->
            <compo-tooltip-btn
              TitleProp="템플릿 분류 등록"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 is-new-folder"
              TooltipPositionProp="top"
              :DisabledProp="SELECT_TMPL_CLSF.id === ''? true : false"
              @btnClick="regTmplClsf"
            ></compo-tooltip-btn>
            <!-- IS_TMPL_CLSF_REG -->
            <!-- 수정 버튼 -->
            <compo-tooltip-btn
              TitleProp="수정"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 edit"
              TooltipPositionProp="top"
              :DisabledProp="SELECT_TMPL_CLSF.id == ''? true : false"
              @btnClick="modiTmplClsf"
            ></compo-tooltip-btn>
            <!-- 삭제 버튼 -->
            <compo-tooltip-btn
              TitleProp="삭제"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 trash"
              TooltipPositionProp="top"
              :DisabledProp="SELECT_TMPL_CLSF.smsTmplCount != '0' || SELECT_TMPL_CLSF.tmplClsfCount != '0'? true : false"
              @btnClick="delTmplClsf"
            ></compo-tooltip-btn>
            <div class="is-right">
              <!-- list up 버튼 -->
              <compo-tooltip-btn
                TitleProp="순서 위로"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 is-list-up"
                TooltipPositionProp="top"
                @btnClick="treeNodeMoveValidationCheck('UP')"
              ></compo-tooltip-btn>
              <!-- list down 버튼 -->
              <compo-tooltip-btn
                TitleProp="순서 아래로"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 is-list-down"
                TooltipPositionProp="top"
                @btnClick="treeNodeMoveValidationCheck('DOWN')"
              ></compo-tooltip-btn>
            </div>
          </div>
        </div>
        <!-- right -->
        <div class="is-vrt">
          <div class="pl-card pb-0">
            <h2 class="pl-subtit">문자 템플릿 </h2>
            <div class="pl-search-form is-mt-s">
              <div class="pl-form-inline-wrap">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    사용 여부
                  </span>
                  <div class="pl-desc">
                    <v-select
                      class="pl-form "
                      :items="USE_WT"
                      v-model="SCH_USE_YN"
                      placeholder="선택하세요"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    탬플릿 명
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form is-lg"
                      v-model="SCH_SMS_TMPL_NM"
                      @keyup.enter="getSmsTmplList"
                      placeholder="검색어 입력"
                    ></v-text-field>
                  </div>
                </div>
                <v-btn class="pl-btn is-icon" @click="getSmsTmplList">
                  <span class="pl-icon20 search"></span>
                  조회
                </v-btn>
              </div>
            </div>
          </div>
          <div class="pl-card ">
            <!-- grid -->
            <div class="pl-grid-top">
              <div class="pl-grid-top-left">
                <v-btn class="pl-btn is-icon is-sub"
                :disabled="(SELECT_TMPL_ROW.constructor === Object && Object.keys(SELECT_TMPL_ROW).length === 0) ? true : false"
                @click="getSmsTmplDetail">
                  <span class="pl-icon20 document"></span>
                  선택항목 상세
                </v-btn>
                <v-btn class="pl-btn is-icon is-sub"
                :disabled="SELECT_TMPL_CLSF.id != '' && SELECT_TMPL_CLSF.children.length == 0 ? false:true"
                @click="regSmsTmpl">
                  <span class="pl-icon20 circle-plus"></span>
                  등록
                </v-btn>
                <v-btn class="pl-btn is-icon is-sub"
                :disabled=" CHECKED_TMPL_ROW.length === 0 ? true : false"
                @click="clickDeleteTmpl"
                >
                  <span class="pl-icon20 trash"></span>
                  삭제
                </v-btn>
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter">전체 <em class="pl-1">({{ GRID_DATA.length }})</em> 건</span>
                <!-- 엑셀 다운로드 버튼 -->
                <compo-excel
                  TypeProp="Download"
                  :DataHeaderProp="GRID_HEADERS"
                  :DataBodyProp="GRID_DATA"
                  :FileNameProp="'문자 템플릿 관리_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                  SheetNameProp="문자 템플릿 관리"
                  HeaderColorProp="00B0F0"
                ></compo-excel>
              </div>
            </div>
            <v-data-table
              class="pl-grid has-control is-hover"
              v-model="CHECKED_TMPL_ROW"
              :headers="GRID_HEADERS"
              :items="GRID_DATA"
              single-select
              show-select
              height="527px"
              :items-per-page="ROW_PER_PAGE"
              :item-class="isActiveRow"
              hide-default-footer
              item-key="SMS_TMPL_ID"
              :page.sync="page"
              no-data-text="등록된 데이터가 없습니다."
              @dblclick:row="gridDbClick"
              @page-count="pageCount = $event"
              @click:row="gridRowselected"
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

              <!-- 더보기 다음 있을때만 노출 -->
              <span class="pl-pager-period">
                보기 {{ mixin_getPagePeriod(GRID_DATA, page) }} / {{ GRID_DATA.length }}
                <!-- <v-btn class="pl-btn is-sub"
                :disabled = "nextDisabled"
                @click="search('next')"
                >다음 검색</v-btn> -->
                <compo-tooltip-btn
                  TitleProp="다음 검색"
                  ClassProp="pl-tooltip-btn is-line"
                  IconProp="pl-icon20 arrow-next-paging"
                  TooltipPositionProp="top"
                  :DisabledProp="nextDisabled"
                  @btnClick="getSmsTmplList('next')"
                ></compo-tooltip-btn>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- dialog -->

    <!-- 템플릿 분류 등록 -->
    <v-dialog
      v-model="dialogRegTree"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
<!--        header-title="템플릿 분류 등록"-->
      <compo-dialog
        :header-title="treeMode == 'reg' ? '템플릿 분류 등록' : '템플릿 분류 수정'"
        @hide="mixin_hideDialog('RegTree')"
      >
        <template slot="body">
          <v-form ref="form">
          <p>분류명을 입력하신 후 <strong>[저장]</strong> 버튼을 클릭하십시오.</p>
          <div class="pl-form-inline-wrap vertical is-mt-m">
            <div class="pl-form-inline">
              <span class="pl-label">
                상위 분류
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form is-sm"
                  :value="treeMode == 'reg'?SELECT_TMPL_CLSF.id:SELECT_TMPL_CLSF.pId"
                  disabled
                ></v-text-field>
                <v-text-field
                  class="pl-form"
                  :value="treeMode == 'reg'?SELECT_TMPL_CLSF.name:SELECT_TMPL_CLSF.pName"
                  disabled
                ></v-text-field>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                분류 명
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  v-model="REG_TMPL_CLSF_NAME"
                  placeholder="분류명 입력"
                ></v-text-field>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                사용 여부
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="USE_WT_NOT_TOTAL"
                  v-model="REG_TMPL_CLSF_USE_YN"
                  :disabled="treeMode == 'modi'?true:false"
                  placeholder="선택하세요"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                정렬 순서
                <!-- <v-icon class="pl-icon20 required"></v-icon> -->
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  disabled
                  v-model="REG_TMPL_CLSF_SORT_ORD"
                  :readonly=true
                ></v-text-field>
              </div>
            </div>
          </div>
          </v-form>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('RegTree')">닫기</v-btn>
          <v-btn class="pl-btn" @click="regValidate('tree')">{{treeMode == 'reg'?"저장":"수정"}}</v-btn>
        </template>

      </compo-dialog>
    </v-dialog>

    <!-- 문자 템플릿 등록 -->
    <v-dialog
      v-model="dialogRegTemplate"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :header-title="REG_SMS_TMPL_NAME ==''?'문자 템플릿 등록':'문자 템플릿 수정'"
        @hide="[mixin_hideDialog('RegTemplate'), initImgGrid()]"
      >
        <template slot="body">
          <v-form ref="form">
          <div class="pl-form-inline-wrap vertical">
            <div class="pl-form-inline">
              <span class="pl-label">
                템플릿 분류 명
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  :value="SELECT_TMPL_CLSF.name"
                  disabled
                ></v-text-field>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                템플릿 분류 ID
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  :value="SELECT_TMPL_CLSF.id"
                  disabled
                ></v-text-field>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                템플릿 명
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  v-model="REG_SMS_TMPL_NAME"
                  placeholder="분류명 입력"
                  v-byte-counter="200"
                ></v-text-field>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                템플릿 유형
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  v-if="REG_SMS_TMPL_TYPE_CD != 'TP_LOCAL' && REG_SMS_TMPL_TYPE_CD != 'TP_CONTACT' && REG_SMS_TMPL_TYPE_CD != 'TP_SVY'"
                  class="pl-form"
                  :items="SMS_TP_NOT_TOTAL"
                  v-model="REG_SMS_TMPL_TYPE_CD"
                  placeholder="선택하세요"
                ></v-select>
                <v-select
                  v-if="REG_SMS_TMPL_TYPE_CD == 'TP_LOCAL' || REG_SMS_TMPL_TYPE_CD == 'TP_CONTACT' || REG_SMS_TMPL_TYPE_CD == 'TP_SVY'"
                  class="pl-form"
                  :items="mixin_common_code_get(this.COMM_CD_DROP_LIST, 'MSG_TMPL_TP')"
                  v-model="REG_SMS_TMPL_TYPE_CD"
                  placeholder="선택하세요"
                  readonly
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                템플릿 내용
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-textarea
                  v-model="REG_SMS_TMPL_CN"
                  class="pl-form is-noresize"
                  :spellcheck="false"
                  v-byte-counter="4000"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                사용 여부
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="USE_WT_NOT_TOTAL"
                  v-model="REG_SMS_TMPL_USE_YN"
                  placeholder="선택하세요"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline" v-if="this.mode === 'modi'">
              <span class="pl-label">
                정렬 순서
                <!-- <v-icon class="pl-icon20 required"></v-icon> -->
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  disabled
                  v-model="REG_SMS_TMPL_SORT_ORD"
                  :readonly=true
                ></v-text-field>
              </div>
            </div>
          </div>
          <!-- 첨부파일 -->
          <compo-file-grid v-if="isFileUpload === true"
            :FilesProp="uploadFileList"
            @addFile="clickAddFiles"
            :DelData="DEL_FILE"
            @input="DEL_FILE = $event"
            @removeFile="removeFile()"
          >
          </compo-file-grid>
          <input ref="fileUpload" type="file" multiple @change="handleFileUpload" style="display: none" />
          </v-form>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="[mixin_hideDialog('RegTemplate'), initImgGrid()]">닫기</v-btn>
          <v-btn class="pl-btn" @click="regValidate('Template')">저장</v-btn>
        </template>

      </compo-dialog>
    </v-dialog>

  </div>
</template>

<script>
// import { mapActions } from 'vuex';
import axios from "axios";
export default {
    name:"MENU_CSL_M0601", //name은 'MENU_' + 파일명 조합

 components: {

  },
 data() {
    return {

      detailValidateRules: {
        EXPSN_ATTR_NM: [
          v => !!v || '제목 은(는) 필수 입력 항목 입니다.',
        ],
        DATA_TYPE_CD: [
          v => !!v || '게시유형을 선택하세요.',
        ],
      },

        // confirm alert 메시지
      MESSAGE : {
        CONFIRM : {
          SMSREG : {alertDialogToggle: true, msg: '템플릿을 저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.fileGroupKeyUnity, callNo: this.closeMsg}
          ,SMSMOD: {alertDialogToggle: true, msg: '템플릿을 수정 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.modifySmsTmpl, callNo: this.closeMsg}
          // , MOD : {alertDialogToggle: true, msg: '수정 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.fileDel, callNo: this.closeMsg}
          , SMSDEL : {alertDialogToggle: true, msg: '템플릿을 삭제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.deleteSmsTmpl, callNo: this.closeMsg}

          , TREEREG : {alertDialogToggle: true, msg: '', iconClass: 'is-info', type: 'confirm', callYes: this.insertTmplClsf, callNo: this.closeMsg}
          , TREEDEL : {alertDialogToggle: true, msg: '템플릿 유형을 삭제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.deleteTmplClsf, callNo: this.closeMsg}

          , TREE_NODE_UP : {alertDialogToggle: true, msg: '템플릿 유형 순서를 변경 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.treeNodeMoveUp, callNo: this.closeMsg}
          , TREE_NODE_DOWN : {alertDialogToggle: true, msg: '템플릿 유형 순서를 변경 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.treeNodeMoveDown, callNo: this.closeMsg}
        },
        ALERT : {
          REG_SUCCESS : {alertDialogToggle: true, msg: '저장 되었습니다', iconClass: 'is-info', type: 'default'}
          , MOD_SUCCESS : {alertDialogToggle: true, msg: '수정 되었습니다.', iconClass: 'is-info', type: 'default'}
          , DEL_SUCCESS : {alertDialogToggle: true, msg: '삭제 되었습니다.', iconClass: 'is-info', type: 'default'}
          , CHG_SUCCESS : {alertDialogToggle: true, msg: '변경 되었습니다.', iconClass: 'is-info', type: 'default'}

          , CHECK_TMPL_CLSF_ID : {alertDialogToggle: true, msg: '분류 유형을 선택하세요. ', iconClass: 'is-info', type: 'default'}

          , CHECK_SMS_TMPL_NAME : {alertDialogToggle: true, msg: '템플릿명은 필수입력입니다.', iconClass: 'is-info', type: 'default'}
          , CHECK_SMS_TMPL_TYPE_CD : {alertDialogToggle: true, msg: '템플릿 유형은 필수입력입니다.', iconClass: 'is-info', type: 'default'}
          , CHECK_SMS_TMPL_CN : {alertDialogToggle: true, msg: '템플릿 내용은 필수입력입니다.', iconClass: 'is-info', type: 'default'}
          , CHECK_USE_YN : {alertDialogToggle: true, msg: '사용 여부는 필수입력입니다.', iconClass: 'is-info', type: 'default'}
          , CHECK_TMPL_MESSAGE_BYTES : {alertDialogToggle: true, msg: '', iconClass: 'is-info', type: 'default'}

          // , CHECK_UP_TMPL_CLSF_NAME : {alertDialogToggle: true, msg: '상위 분류 유형 정보는 필수 입력입니다. ', iconClass: 'is-caution', type: 'default'}
          , CHECK_TMPL_CLSF_NAME : {alertDialogToggle: true, msg: '분류 유형명 정보는 필수 입력입니다. ', iconClass: 'is-info', type: 'default'}
          , CHECK_TMPL_CLSF_USE_YN : {alertDialogToggle: true, msg: '분류 유형 사용여부 정보는 필수 입력입니다. ', iconClass: 'is-info', type: 'default'}

          , CHECK_SELECT_NODE : {alertDialogToggle: true, msg: '정렬순서 변경할 항목을 선택하세요. ', iconClass: 'is-info', type: 'default'}

          , LIMIT_FILE_SIZE : { alertDialogToggle : true, msg:'첨부파일 개당 용량은 300KB 초과 할 수 없습니다.',iconClass: 'is-info', type:'default'}
          , LIMIT_FILE_TYPE : { alertDialogToggle : true, msg:'jpeg 또는 jpg 형식만 첨부 가능 합니다.',iconClass: 'is-info', type:'default'}
          , LIMIT_FILE_COUNT : { alertDialogToggle : true, msg:'파일 첨부는 최대 3개까지 가능합니다.',iconClass: 'is-info', type:'default'}

          , LIMIT_TREE_MOVE_UP : { alertDialogToggle : true, msg:'현재 정렬순서가 가장 높습니다.',iconClass: 'is-info', type:'default'}
          , LIMIT_TREE_MOVE_DOWN : { alertDialogToggle : true, msg:'현재 정렬순서가 가장 낮습니다.',iconClass: 'is-info', type:'default'}


          , ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST : {
          REG_SUCCESS: {  msg: '저장 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 },
          MOD_SUCCESS: {  msg: '수정 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 },
          DEL_SUCCESS: {  msg: '삭제 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 },
          CHG_SUCCESS: {  msg: '변경 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
        },
      },

      /** 공통 */
      COMM_CD_LIST:[],                    //사용할 공통코드 리스트
      COMM_CD_DROP_LIST:[],               //공통코드로 생성된 드롭박스 리스트
      USE_WT : [],                        // 검색조건 - 사용 여부, 전체 포함
      USE_WT_NOT_TOTAL : [],              // 템플릿 유형 및 SMS 템플릿 등록 시 사용 여부 선택 항목, 전체 미포함
      SMS_TP_NOT_TOTAL : [],              // 전체 항목 제외한 SMS유형 콤보

      isFileUpload: false,                // SMS 템플릿 첨부파일 영역 표시 여부
      uploadFileList: [],                 // 업로드 파일리스트

      /** 첨부파일 관련 */
      DEL_FILE:[],                        // 컴포넌트 모달에서 삭제 클릭마다 가져온 삭제파일정보
      DEL_FILE_LIST:[],                   // DEL_FILE 안의 DEL_FILE_LIST 정보만 담은 삭제파일정보
      DEL_FILE_KEY_LIST : [],             // DEL_FILE_LIST 에서 빼낸 file_key list, 삭제용 파일키 리스트
      uploadNum: 0,

      nextDisabled: false,                // 다음보기 버튼 활성/비활성
      mode : "",                          // 화면 모드 '' - 초기값, reg - 등록, modi - 수정   - watch

      /** 트리 관련 시작 */
      treeMode : "",                      // 분류 트리 모드 - reg : 추가, modi : 수정(수정 모드가 추가 됨)
      TREE_DATA: [],                      // 트리에 주입되는 데이터
      IS_TMPL_CLSF_REG : false,           // 템플릿 분류 트리 추가 가능 여부

      SELECT_TMPL_CLSF : {
        id : "",
        pId : "",
        name : "",
        pName : "",
        useYn : "",
        sortOrd : "",
        smsTmplCount : "",
        tmplClsfCount : "",
        children : []
      },                                  // 트리에서 선택한 템플릿 분류 노드 정보
      expanded: false,
      /** 트리 관련 종료 */

      /** 그리드 관련 시작 */
      GRID_DATA: [],                      // 그리드에 매핑된 데이터, 원본에서 필터링 후 들어감
      GRID_HEADERS: [
        { text: "번호", value: "ROWNUM", align: "center", width: "80px", sortable : false },
        { text: "분류코드", value: "TMPL_CLSF_ID", align: "left", width: "90px" , sortable : false},
        { text: "분류명", value: "TMPL_CLSF_NM", align: "left", width: "250px", sortable : false},
        { text: "템플릿ID", value: "SMS_TMPL_ID", align: "left", width: "90px" , sortable : true},
        { text: "템플릿명", value: "SMS_TMPL_NM", align: "left" , sortable : false},
        { text: "유형", value: "SMS_TMPL_TYPE_NM", align: "left", width: "120px" , sortable : false},
        { text: "순서", value: "SORT_ORD", align: "left", width: "90px" , sortable : false},
        { text: "사용여부", value: "USE_NM", align: "left", width: "100px", sortable : false }
      ],

      SELECT_TMPL_ROW : {},               // grid에서 선택한 row 정보, 상세 보기 용도
      // SMS_TMPL_ID : "",                   // sms 템플릿 id, grid row 선택 시 해당 row의 SMS_TMPL_ID를 이곳에 지정, row high-light, 상세보기 & 삭제 버튼 활성화 용도
      CHECKED_TMPL_ROW : [],              // grid에서 선택한 row 정보, 삭제 용도

      /** 그리드 관련 종료 */

      // 조회 조건 v-model
      SCH_USE_YN : "",                    // 사용여부
      SCH_SMS_TMPL_NM : "",               // 템플릿 명
      // SCH_MDFCN_PSBLTY_YN:'',
      // SCH_DATA_TYPE_CD:'',
      // SCH_EXPSN_ATTR_NM:'',
      // SCH_EXPSN_ATTR_COL_ID:'',

      /** 페이징 관련 */
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      },

      /** dialog 관련 시작 */

      dialogRegTemplate: false,                 // 템플릿 등록 다이얼로그 노출 여부
      dialogRegTree: false,                     // 템플릿 분류 등록 다이얼로그 노출 여부

      /** 템플릿 분류 등록 관련 */
      REG_TMPL_CLSF_NAME : "",                  // 분류명
      REG_TMPL_CLSF_USE_YN : "",                // 사용여부
      REG_TMPL_CLSF_SORT_ORD : "",               // 정렬순서
      // REG_TMPL_CLSF_MAX_SORT_ORD: 0,            //상위 템플릿 분류유형의 최대 정렬순서

      /** 템플릿 신규 등록 관련 */
      REG_SMS_TMPL_NAME : "",                   // SMS 템플릿 등록 다이얼로그 템플릿명 입력값
      REG_SMS_TMPL_TYPE_CD : "",                // SMS 템플릿 등록 다이얼로그 SMS 유형 선택값 - watch
      REG_SMS_TMPL_CN : "",                     // SMS 템플릿 등록 다이얼로그 내용 입력값
      REG_SMS_TMPL_USE_YN : "",                 // SMS 템플릿 등록 다이얼로그 사용 여부 선택값
      REG_SMS_TMPL_SORT_ORD : "",                // SMS 템플릿 등록 다이얼로그 정렬 순서 선택값

      /** dialog 관련 종료 */


      // filelist: [
      //   {
      //     filename : '포인트 업종별 적립율 상세 정보.pdf',
      //     filesize : '1024KB',
      //     download : true,
      //     count : 35,
      //     downloadFile: 'test.pdf'
      //   },
      //   {
      //     filename : '포인트 업종별 적립율 상세 정보.pdf',
      //     filesize : '1024KB',
      //     download : false,
      //     count : 35,
      //     downloadFile: 'test2.pdf'
      //   },
      // ],

       // flag
    // flagData: {
      // DIG_CHECK: '',
      // ATRT_CHECK: '',
      // DBL_CHECK: '',
      // FILE_CHECK: '',
    // },

      //tree
      // SELECT_TREE_ITEM_NODE_PATH : [],          // 선택된 트리 노드의 보모 경로 배열
      // SELECT_ITEM_PARENT : [],



      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,


      table_body:{},
      table_head:{},

    }
  },

  watch: {
    REG_SMS_TMPL_TYPE_CD: function () {
      this.showFileUploadArea();
    },
    CHECKED_TMPL_ROW(){
      // console.log("CHECKED_TMPL_ROW", this.CHECKED_TMPL_ROW[0])
    },
  },

  computed: {
  },

  created() {
  },

  mounted() {
    this.setCommCode();           // 공통코드 화면 설정
    this.getSmsTreeInfo();        // 템플릿 분류 트리 생성
  },

  methods: {

    /** post 비동기 요청 처리 */
    async postCall(sUrl, postParam, headParam, callbackFunction, callbackParam){
      let response  = await this.common_postCall(sUrl, postParam, headParam, callbackParam);
      if (!response.HEADER.ERROR_FLAG){
        if(callbackParam != undefined){
          return callbackFunction(response, callbackParam);
        }else{
          return callbackFunction(response);
        }

      }
    },

    /** 공통 코드 조회 */
    async setCommCode(){
      // 사용 여부 공통 코드 콤보
      this.COMM_CD_LIST = [
        "USE_WT"          // 사용 상태
        ,"SMS_TP"         // 문자 유형
        , "MSG_TMPL_TP"   // 문자 기본 템플릿
      ];

      //공통코드별 드롭박스 만들기
      this.COMM_CD_DROP_LIST = await this.mixin_common_code_get_all(this.COMM_CD_LIST);

      //필요한 공통코드 드롭박스 생성
      this.USE_WT = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, 'USE_WT',"전체");
      this.USE_WT_NOT_TOTAL = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, 'USE_WT');
      this.SMS_TP_NOT_TOTAL = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, 'SMS_TP');
    },

    /** 공통 처리 시작 */
    /** 저장 버튼 validation */
    regValidate(type){
      // let smsTmplName, smsTmplTypeCd, smsTmplCn, useYn;       // sms 템플릿 유효성 체크 대상
      // let tmplClsfId, tmplClsfName, regTmplClsfName, regTmplClsfUseYn, regTmplClsfSortOrd     // 템플릿 분류 유형 유효성 체크 대상
      if(type == "Template"){
        this.regTemplateValidate();
      }else{
        this.regTreeValidate();
      }
    },

    /** 삭제 버튼 validation */
    delValidate(type){
      if(type == "Template"){
        this.delTemplateValidate();
      }else{
        this.delTreeValidate();
      }
    },

    //validate check
    detailValidate () {
      return this.$refs.form.validate();
    },

    /** 다이얼로그 오픈 */
    openDialog(dialogName){
      /**
       * SMS 템플릿 등록 기능, 상세보기 기능은 등록 dialog 팝업을 공유
       * dialog 팝업을 닫을 때마다 구분값을 초기화 하고 기능이 시작될 때 각각 mode를 재설정, reg(등록)/modi(상세보기 및 수정)
       */
      // this.mode = "";
      this.mixin_showDialog(dialogName);
    },

    /** 다이얼로그 파업 form 초기화
     * 1. 트리 노드 등록, 템플릿 추가 팝업창 초기화 공유 함수
     * 2. type = tree(트리 노드 추가) or template(신규 템플릿 추가)
     * 3. template인 경우 신규등록, 상세보기 구분(mode = reg or modi) 구분하여 form 초기화 또는 상세보기 정보 설정
     */
    initDialog(type){

      if(type == "tree"){
        if(this.treeMode == "reg"){
          this.REG_TMPL_CLSF_NAME = "";
          this.REG_TMPL_CLSF_USE_YN = "";
          this.REG_TMPL_CLSF_SORT_ORD = "";
        }else{
          this.REG_TMPL_CLSF_NAME = this.SELECT_TMPL_CLSF.name;
          this.REG_TMPL_CLSF_USE_YN = this.SELECT_TMPL_CLSF.useYn;
          this.REG_TMPL_CLSF_SORT_ORD = this.SELECT_TMPL_CLSF.sortOrd;
        }
      }else{
        if(this.mode == "reg"){       // 등록 모드면 다이얼로그 입력 폼 초기화
          this.REG_SMS_TMPL_NAME = "";
          this.REG_SMS_TMPL_TYPE_CD = "";
          this.REG_SMS_TMPL_CN = "";
          this.REG_SMS_TMPL_USE_YN = "";
          this.REG_SMS_TMPL_SORT_ORD = "";
        }else{                        // 상세보기 모드면 다이얼로그 입력 폼 선택항목 지정
          this.REG_SMS_TMPL_NAME = this.SELECT_TMPL_ROW.SMS_TMPL_NM;
          this.REG_SMS_TMPL_TYPE_CD = this.SELECT_TMPL_ROW.SMS_TMPL_TYPE_CD;
          this.REG_SMS_TMPL_CN = this.SELECT_TMPL_ROW.SMS_TMPL_CN;
          this.REG_SMS_TMPL_USE_YN = this.SELECT_TMPL_ROW.USE_YN;
          this.REG_SMS_TMPL_SORT_ORD = this.SELECT_TMPL_ROW.SORT_ORD;
        }
      }
    },

    /** 공통 처리 종료 */

    /** 템플릿 분류 관련 시작 */

    /** 템플릿 분류 조회 */
    getSmsTreeInfo() {
      let sUrl = "/phone-api/sms/tmpl/manage/clsf";
      let postParam = {};
      let headParam = {head : {}};
      this.postCall(sUrl, postParam, headParam, this.getSmsTreeInfoCallback);
    },

    /** 템플릿 분류 조회 콜백 */
    getSmsTreeInfoCallback(response){
      // 트리에 데이터 공간으로 매핑된 변수에 트리 구조 데이터 주입
        this.TREE_DATA = this.makeTreeData(response.DATA, '');

        // console.log(this.SELECT_TMPL_CLSF);
    },

    /** 템플릿 분류 계층 구조 데이터 만들기 */
    makeTreeData(rowData, pid){
      let treeData = []; // tree data
      for (let i in rowData) {
        let row = rowData[i]; // row 데이터 1 건
        let parent = row.P_NODE_NO; // 해당 row 데이터의 부모 트리 id
        if (pid == parent) { // row 데이터의 부모 트리 id 와 기준 트리 id가 같은 경우 데이터를 트리 구조로 변경
            let treeNode = {}; // tree node
            treeNode.id = row.C_NODE_NO;
            treeNode.pId = parent;
            treeNode.name = row.TMPL_NM;
            treeNode.pName = row.P_TMPL_NM;
            treeNode.sortOrd = row.SORT_ORD;
            treeNode.useYn = row.USE_YN;
            treeNode.minSortOrd = row.MIN_SORT_ORD;
            treeNode.maxSortOrd = row.MAX_SORT_ORD;
            treeNode.smsTmplCount = row.SMS_TMPL_COUNT
            treeNode.tmplClsfCount = row.TMPL_CLSF_COUNT
            let child = this.makeTreeData(rowData, row.C_NODE_NO); // 해당 노드 하위 자식 노드 생성
            if (child.length != 0) { // 자식 노드가 있는 경우
              treeNode.children = child; // 자식 노드로 추가
            }else{
              treeNode.children = [];
            }
            treeData.push(treeNode); // 트리 데이터에 추가
        }
      }
      return treeData;
    },

    /** 트리 노드 클릭 이벤트 처리 함수 */
    treeNodeClick(){
      // 트리에서 선택된 템플릿 분류 ID 설정, 초기값 0, 트리 최초 로딩 시 반드시 재설정
      // this.isRegTmplClsf();
      this.getSmsTmplList();

      // this.mode = "";    // 트리 선택 변경 후 화면 모드 초기화
    },

    /** 템플릿 분류 추가 다이얼로그 활성/비활성 결정 */
    // async isRegTmplClsf(){
    //   let sUrl = "/phone-api/sms/tmpl/manage/isRegTmplClsf";
    //   let postParam = {
    //     TMPL_CLSF_ID : this.SELECT_TMPL_CLSF.id               // 템플릿 분류 ID
    //   };
    //   let headParam = {head : {}};
    //   this.postCall(sUrl, postParam, headParam, this.isRegTmplClsfCallback);

    // },

    /** 템플릿 분류 노드에 템플릿 추가 가능 여부 판단 콜백 */
    // isRegTmplClsfCallback(response){
    //   // 템플릿 분류 트리 추가 가능 제어
    //     this.regTmplClsfControl(response);
    // },

    /** 템플릿 분류 노드 추가 가능 여부 제어 */
    // regTmplClsfControl(response){
    //   /**
    //    * 템플릿 유형 추가 버튼 제어
    //    * 선택한 노드가 있고 유형에 등록된 SMS 템플릿이 있는 경우 비활성
    //    *  */
    //   if(this.SELECT_TMPL_CLSF.id != "" && response.DATA[0].REG_YN == "N"){
    //     this.IS_TMPL_CLSF_REG = true;
    //   }else{
    //     this.IS_TMPL_CLSF_REG = false;
    //   }
    // },

    /** 템플릿 분류 신규 등록 */
    regTmplClsf(){
      this.treeMode = "reg";
      this.initDialog("tree");
      this.openDialog('RegTree');
    },

    modiTmplClsf(){
      this.treeMode = "modi";
      this.initDialog("tree");
      this.openDialog('RegTree');
    },

    /** 템플릿 분류삭제 */
    delTmplClsf(){
      if(this.SELECT_TMPL_CLSF.id != ""){
        this.showAlert(this.MESSAGE.CONFIRM.TREEDEL);
      }
    },

    /** 템플릿 분류 추가 수행 */
    insertTmplClsf(){
      let sUrl = this.treeMode == "reg"?"/phone-api/sms/tmpl/manage/insertTmplClsf":"/phone-api/sms/tmpl/manage/modifyTmplClsf";
      let postParam = {
          UP_TMPL_CLSF_ID : this.SELECT_TMPL_CLSF.id                    // 상위 템플릿 분류 ID - 저장에서만 사용
        , TMPL_CLSF_ID : this.SELECT_TMPL_CLSF.id                       // 현재 템플릿 분류 ID - 수정에서만 사용
        , TMPL_CLSF_NAME : this.REG_TMPL_CLSF_NAME                      // 추가 템플릿 분류명
        , USE_YN : this.REG_TMPL_CLSF_USE_YN                  // 추가 템플릿 분류 사용 여부
        , SORT_ORD : this.REG_TMPL_CLSF_SORT_ORD             // 추가 템플릿 분류 정렬 순서
      };
      let headParam = {head : {}};
      this.postCall(sUrl, postParam, headParam, this.insertTmplClsfCallback);
    },

    /** 템플릿 추가 수행 콜백 */
    insertTmplClsfCallback(response){
      if(response){
        if(this.treeMode == "reg"){
          // this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS);
          this.showToast(this.MESSAGE.TOAST.REG_SUCCESS);
        }else{
          this.SELECT_TMPL_CLSF.name = this.REG_TMPL_CLSF_NAME;
          // this.showAlert(this.MESSAGE.ALERT.MOD_SUCCESS);
          this.showToast(this.MESSAGE.TOAST.MOD_SUCCESS);
        }
        // setTimeout(() => {
        //   this.$store.commit("alertStore/hideAlert");
        // }, 2000);
        this.closeMsg();
        this.getSmsTreeInfo();
        this.mixin_hideDialog('RegTree');
      }
    },

    // 템플릿 분류 삭제
    deleteTmplClsf(){
      let sUrl = "/phone-api/sms/tmpl/manage/deleteTmplClsf";
      let postParam = {
        TMPL_CLSF_ID : this.SELECT_TMPL_CLSF.id                    // 선택된 템플릿 분류 ID
      };
      let headParam = {head : {}};
      this.postCall(sUrl, postParam, headParam, this.deleteTmplClsfCallback);
    },

    /** 템플릿 분류 삭제 콜백 */
    deleteTmplClsfCallback(response){
      // this.showAlert(this.MESSAGE.ALERT.DEL_SUCCESS);
      this.showToast(this.MESSAGE.TOAST.DEL_SUCCESS);
        // setTimeout(() => {
        //   this.$store.commit("alertStore/hideAlert");
        // }, 2000);
      this.closeMsg();
        this.getSmsTreeInfo();
        this.GRID_DATA = [];

        this.SELECT_TMPL_CLSF.id = "";
        this.SELECT_TMPL_CLSF.pId = "";
        this.SELECT_TMPL_CLSF.name = "";
        this.SELECT_TMPL_CLSF.pName = "";
        this.SELECT_TMPL_CLSF.useYn = "";
        this.SELECT_TMPL_CLSF.sortOrd = "";
        this.SELECT_TMPL_CLSF.smsTmplCount = "";
        this.SELECT_TMPL_CLSF.tmplClsfCount = "";
        this.SELECT_TMPL_CLSF.children = [];

        // this.SELECT_TMPL_ROW.SMS_TMPL_ID = {};
        this.SELECT_TMPL_ROW = {};
    },

    /** 템플릿 분류 등록 유효성 체크 */
    regTreeValidate () {
      // let tmplClsfName = this.SELECT_TMPL_CLSF.name;
      let regTmplClsfName = this.REG_TMPL_CLSF_NAME;
      let regTmplClsfUseYn = this.REG_TMPL_CLSF_USE_YN;

      if (!this.detailValidate()) {
        return;
      // }else if(this.mixin_isEmpty(tmplClsfName)) {
      //   this.showAlert(this.MESSAGE.ALERT.CHECK_UP_TMPL_CLSF_NAME);
      //   return;
      }else if(this.mixin_isEmpty(regTmplClsfName)) {
        this.showAlert(this.MESSAGE.ALERT.CHECK_TMPL_CLSF_NAME);
        return;
      }else if(this.mixin_isEmpty(regTmplClsfUseYn)) {
        this.showAlert(this.MESSAGE.ALERT.CHECK_TMPL_CLSF_USE_YN);
        return;
      }

      if(this.treeMode == "reg"){
        this.MESSAGE.CONFIRM.TREEREG.msg = "템플릿 유형을 저장 하시겠습니까?";
      }else{
        this.MESSAGE.CONFIRM.TREEREG.msg = "템플릿 유형을 수정 하시겠습니까?";
      }
      this.showAlert(this.MESSAGE.CONFIRM.TREEREG);

    },

    /** 트리 노드 선택 시 호출 */
    srch_tree_act(node){
      /**
       * 트리 노드 선택 시 노드ID와 하위 노드 존재 여부를 재설정
       */
      let currentNodeId = node.length > 0 ? node[0].id : "";
      let currentNodeName = node.length > 0 ? node[0].name : "";
      let currentNodePid = node.length > 0 ? node[0].pId : "";
      let currentNodePName = node.length > 0 ? node[0].pName : "";
      let currentUseYn = node.length > 0 ? node[0].useYn : "";
      let currentSortOrd = node.length > 0 ? node[0].sortOrd : "";
      let currentNodeChildren = node.length > 0 ? node[0].children : [];
      let currentMinSortOrd = node.length > 0 ? node[0].minSortOrd : "";
      let currentMaxSortOrd = node.length > 0 ? node[0].maxSortOrd : "";
      let currentSmsTmplCount = node.length > 0 ? node[0].smsTmplCount : "";
      let currentTmplClsfCount = node.length > 0 ? node[0].tmplClsfCount : "";


      if(currentNodeId != "" && (this.SELECT_TMPL_CLSF.id != currentNodeId)){
        this.SELECT_TMPL_CLSF.id = currentNodeId;
        this.SELECT_TMPL_CLSF.pId = currentNodePid;
        this.SELECT_TMPL_CLSF.name = currentNodeName;
        this.SELECT_TMPL_CLSF.pName = currentNodePName;
        this.SELECT_TMPL_CLSF.useYn = currentUseYn;
        this.SELECT_TMPL_CLSF.sortOrd = currentSortOrd;
        this.SELECT_TMPL_CLSF.children = currentNodeChildren;
        this.SELECT_TMPL_CLSF.minSortOrd = currentMinSortOrd;
        this.SELECT_TMPL_CLSF.maxSortOrd = currentMaxSortOrd;
        this.SELECT_TMPL_CLSF.smsTmplCount = currentSmsTmplCount;
        this.SELECT_TMPL_CLSF.tmplClsfCount = currentTmplClsfCount;


        // this.REG_TMPL_CLSF_MAX_SORT_ORD = currentMaxSortOrd;

        this.SELECT_TMPL_ROW = {};

        // console.log(this.SELECT_TMPL_CLSF.id);

        this.treeNodeClick(currentNodeId);
      }
    },

    expandAll(id){
      this.expanded = true;
      this.$refs[id].updateAll(true);
    },

    collapseAll(id){
      this.expanded = false;
      this.$refs[id].updateAll(false);
    },

    /** 템플릿 분류 관련 종료 */

    /** SMS 템플릿 관련 시작 */

    // SMS 템플릿 리스트 조회
    getSmsTmplList(next){

      if(this.SELECT_TMPL_CLSF.id == ""){
        this.showAlert(this.MESSAGE.ALERT.CHECK_TMPL_CLSF_ID);
        return;
      }

      //다음버튼 클릭 유무
      if (next != 'next'){
        this.GRID_DATA = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let sUrl = '/phone-api/sms/tmpl/manage/list';

      let postParam = {
          TMPL_CLSF_ID : this.SELECT_TMPL_CLSF.id               // 템플릿 분류 ID
        , USE_YN : this.SCH_USE_YN                              // 사용 여부
        , SMS_TMPL_NM : this.SCH_SMS_TMPL_NM                    // sms 템플릿 명
      };

      let headParam = {
        head : {
          ROW_CNT : this.pagination.rowsPerPage,
          PAGES_CNT : this.pagination.page,
          PAGING : "Y",
        }
      };
      this.postCall(sUrl, postParam, headParam, this.getSmsTmplListCallback);
    },

    /** SMS 템플릿 조회 콜백 */
    getSmsTmplListCallback(response){
      this.GRID_DATA = [...this.GRID_DATA, ...response.DATA];

      //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
      if(response.HEADER.next !== null && response.HEADER.next !== undefined){
        if(response.HEADER.next === true){
          this.nextDisabled = false //버튼 활성화
        }else{
          this.nextDisabled = true  //버튼 비활성화
        }
      }

      //이부분은 체크해볼것
      this.pagination.page += 1
      // this.page=1;
    },

    /** grid 지정한 row에 활성화 효과 지정 */
    isActiveRow(item) {
      return item.SMS_TMPL_ID == this.SELECT_TMPL_ROW.SMS_TMPL_ID ? "active" : "";
    },

    /**
     * 그리드 클릭 이벤트 처리 함수
     * 1. grid row 선택 시 SELECTED_TMPL_ROW 매핑 변수에 row 정보 넣음
     * 2. 수정모드(mode=modi) 때 상세보기 정보로 사용
     */
    gridRowselected(item){
      this.SELECT_TMPL_ROW = item;
      // this.mode = "";     // 그리드 선택 row 변경 시 새로 선택한 내용으로 다이얼로그 내용 변경 되도록 mode 변경
    },

    /** 그리드 더블클릭 이벤트 처리 함수 */
    gridDbClick(item, row){
      this.initImgGrid();
      this.gridRowselected(row.item);
      this.getSmsTmplDetail();                // 상세조회
    },

    /** SMS 신규 템플릿 등록 */
    regSmsTmpl(){
      this.mode = "reg";                      // 화면 등록 모드로 변경
      this.initDialog("template");
      this.uploadFileList = [];
      this.openDialog('RegTemplate');
    },

    /**
     * 템플릿 상세보기 이벤트 함수
     */
    getSmsTmplDetail(){
      this.mode = "modi";   // 화면 수정 모드로 변경
      this.initDialog("template");

      // 선택항목 체크
      if(this.SELECT_TMPL_ROW){
        // 템플릿 등록 팝업 호출, 상세 보기와 화면 공유
        this.openDialog('RegTemplate');

        if(this.SELECT_TMPL_ROW.SMS_TMPL_TYPE_CD == "TP_MMS"){    //MMS 템플릿은 업로드 파일 정보 조회
          this.getMmsUploadFile();
        }

      }
    },

    /**
     * 템플릿 삭제 이벤트 함수
     */
    clickDeleteTmpl(){
      if(this.SELECT_TMPL_ROW.SMS_TMPL_ID != ""){
        this.showAlert(this.MESSAGE.CONFIRM.SMSDEL);
      }
    },

    /** 템플릿 삭제 */
    deleteSmsTmpl(){
      let sUrl = "/phone-api/sms/tmpl/manage/deleteSmsTmpl";
      let postParam = {
          SMS_TMPL_ID : this.CHECKED_TMPL_ROW[0].SMS_TMPL_ID
      };
      let headParam = {head : {}};

      this.postCall(sUrl, postParam, headParam, this.deleteSmsTmplCallback);
    },

    /** 템플릿 삭제 콜백 */
    deleteSmsTmplCallback(response){
      // this.showAlert(this.MESSAGE.ALERT.DEL_SUCCESS);
      this.showToast(this.MESSAGE.TOAST.DEL_SUCCESS);
        // setTimeout(() => {
        //   this.$store.commit("alertStore/hideAlert");
        // }, 2000);
      this.closeMsg();

        this.initImgGrid();
        this.getSmsTmplList();

        this.CHECKED_TMPL_ROW = [];
    },

    /** 다음 버튼 페이징 */
    /*
    search(next){
      if (next == 'next'){
      } else {
        this.items = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }
      this.getSmsTmplList('next');
    },
    */

    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    /** SMS 템플릿 추가 유효성 체크 */
    regTemplateValidate () {
      let smsTmplName = this.REG_SMS_TMPL_NAME;             // SMS 템플릿 이름
      let smsTmplTypeCd = this.REG_SMS_TMPL_TYPE_CD;        // SMS 템플릿 타입
      let smsTmplCn = this.REG_SMS_TMPL_CN;                 // SMS 템플릿 내용
      let useYn = this.REG_SMS_TMPL_USE_YN;                 // 사용 여부
      let messageBytes = this.checkMessageByte(smsTmplCn);

      if (!this.detailValidate()) {
        return;
      }else if(this.mixin_isEmpty(smsTmplName)) {
        this.showAlert(this.MESSAGE.ALERT.CHECK_SMS_TMPL_NAME);
        return;
      }else if(this.mixin_isEmpty(smsTmplTypeCd)) {
        this.showAlert(this.MESSAGE.ALERT.CHECK_SMS_TMPL_TYPE_CD);
        return;
      }else if(this.mixin_isEmpty(smsTmplCn)) {
        this.showAlert(this.MESSAGE.ALERT.CHECK_SMS_TMPL_CN);
        return;
      }else if(this.mixin_isEmpty(useYn)) {
        this.showAlert(this.MESSAGE.ALERT.CHECK_USE_YN);
        return;
      }

      if(smsTmplTypeCd == "TP_SMS" && messageBytes > 90){
        this.MESSAGE.ALERT.CHECK_TMPL_MESSAGE_BYTES.msg = "SMS 유형의 메시지는 90 바이트 이내까지 전송할 수 있습니다. (현재 " + messageBytes + " 바이트)";
        this.showAlert(this.MESSAGE.ALERT.CHECK_TMPL_MESSAGE_BYTES);
        return;
      /**
       * 2000바이트 이슈
       * MTS 2000바이트까지 발송 된다고 하는데 실제 2000바이트 문자열 발송하면 에러발생
       * textarea 개행문자가 db등록 되면서 13 짜리코드 빈칸을 생성함
       * 화면에서 13 짜리코드 빈칸을 없애주는 로직 추가(checkMessageByte 내부에서)
       * 이때 최대 2000바이트 문자열이 1999바이트로 변환됨
       * 템플릿 등록 화면에서 2000바이트까지 입력가능하고 이는 발송화면에서 1999바이트로 변환 됨
       *
       * 결론 : 템플릿 등록 화면에서 2000바이트 체크, 발송화면에서 1999 바이트 이상 발송 못하게 처리 2000바이트로 발송하면 MTS 에러 발생
       */
      }else if(smsTmplTypeCd != "TP_SMS" && messageBytes > 2000){
        this.MESSAGE.ALERT.CHECK_TMPL_MESSAGE_BYTES.msg = "LMS, MMS 유형의 메시지는 2000 바이트 미만까지 전송할 수 있습니다. (현재 " + messageBytes + " 바이트)";
        this.showAlert(this.MESSAGE.ALERT.CHECK_TMPL_MESSAGE_BYTES);
        return;
      }

      if(this.mode == "reg"){
        this.showAlert(this.MESSAGE.CONFIRM.SMSREG);
      }else if(this.mode == "modi"){
        this.showAlert(this.MESSAGE.CONFIRM.SMSMOD);
      }else{
        this.showAlert(this.MESSAGE.CONFIRM.MOD);
      }
    },

    /** SMS 템플릿 등록 or 수정 수행
     * 1. 신규등록, 수정 공통 수행
     */
    insertSmsTmpl(){
      let sUrl = this.mode == "reg"? "/phone-api/sms/tmpl/manage/insertSmsTmpl" : "/phone-api/sms/tmpl/manage/modifySmsTmpl";
      let leng = this.uploadFileList.length;
      // 파일 그룹키 그룹핑
      let fileGroupKey = this.mixin_isEmpty(this.uploadFileList) ? '' : this.uploadFileList[leng-1]["fileGroupKey"];

      let postParam = {
          TMPL_CLSF_ID : this.SELECT_TMPL_CLSF.id               // 템플릿 분류 ID
        , SMS_TMPL_NM : this.REG_SMS_TMPL_NAME                  // 추가 SMS 템플릿 템플릿명
        , SMS_TMPL_CN : this.REG_SMS_TMPL_CN                    // 추가 SMS 템플릿 템필릿 내용
        , SMS_TMPL_TYPE_CD : this.REG_SMS_TMPL_TYPE_CD          // 추가 SMS 유형(SMS, MMS, LMS)
        , USE_YN : this.REG_SMS_TMPL_USE_YN                     // 추가 SMS 템플릿 사용 여부
        , SORT_ORD : this.REG_SMS_TMPL_SORT_ORD                 // 추가 SMS 템플릿 정렬 순서
        , FILE_GROUP_KEY : fileGroupKey                         // 파일그룹키
      }

      // 수정 모드면 SMS 템플릿 ID 파라미터에 설정, 해당 ID에 해당하는 정보 수정
      if(this.mode == "modi"){
        postParam.SMS_TMPL_ID = this.SELECT_TMPL_ROW.SMS_TMPL_ID;
      }

      let headParam = {head : {}};

      this.postCall(sUrl, postParam, headParam, this.insertSmsTmplCallback);
    },

    /** 등록 or 수정 수행 콜백 */
    insertSmsTmplCallback(response){
      if(this.mode == "reg"){
          // this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS);
          this.showToast(this.MESSAGE.TOAST.REG_SUCCESS);
        }else{
          // this.showAlert(this.MESSAGE.ALERT.MOD_SUCCESS);
        this.showToast(this.MESSAGE.TOAST.MOD_SUCCESS);
          /**
           * 사용 여부가 변경된 경우 삭제 버튼 활성/비활성 처리를 여기서 해준다
           * this.SELECT_TMPL_ROW.USE_YN - 기존 사용 여부
           * this.REG_SMS_TMPL_USE_YN - 변경된 사용 여부
           *
           * 사용 여부 변경에 따라 삭제 버튼 활성 비활성이 바뀌는데 사용 여부 업데이트의 경우 그리드 템플릿 row를 다시
           * 클릭해야 버튼 활성값을 다시 인지해서 강제로 바꿔줌, 수정 완료 시점에 선택한 row 정보를 최신으로 업데이트 한다.
           */
          if(this.REG_SMS_TMPL_USE_YN !== this.SELECT_TMPL_ROW.USE_YN){
            this.SELECT_TMPL_ROW.USE_YN = this.REG_SMS_TMPL_USE_YN;
          }
        }
        // setTimeout(() => {
        //   this.$store.commit("alertStore/hideAlert");
        // }, 2000);
      this.closeMsg();
        this.initImgGrid();
        this.getSmsTmplList();
        this.mixin_hideDialog('RegTemplate');
    },

    //파일 따로 저장 시 파일 그룹 키 통일 안 됨 =>  강제 파일 그룹 키 통일
    async fileGroupKeyUnity(){
      let arrFileKey = [];
      if(this.uploadFileList.length > 0){
        let leng = this.uploadFileList.length;
        for(let i=0;i<leng;i++){
          arrFileKey.push(this.uploadFileList[i]["fileKey"])
        }
        //게시물 저장
        let sUrl = "/phone-api/sms/tmpl/manage/fileKeyUnity";
        let postParam = {
          FILE_GROUP_KEY: this.uploadFileList[leng-1]["fileGroupKey"]
          ,arrFileKey:arrFileKey
        }

        let headParam = {
          head: {
          }
        }

        let resData = await this.common_postCall(sUrl, postParam, headParam)
        if(!resData.HEADER.ERROR_FLAG){
          this.insertSmsTmpl();
        }
      }else{
        this.insertSmsTmpl();
      }
    },

    // file input
    clickAddFiles() {
      this.$refs.fileUpload.click()
    },

    // 파일 추가
    handleFileUpload(event){
       const files = event.target.files;

      //파일 제한 체크 (프론트에서 체크하고 업로드 로직 실행x)
      if (files.length > 0 && this.isValidFiles(files)) {
        // 파일 업로드
        this.uploadFiles(files);
      }
    },

    //파일개수 제한(파일개수 체크)
    isValidFiles(files) {
      // 파일 개수 제한을 설정
      const maxFileCount = 3;
      let uploadFileTotalCount = this.uploadFileList.length + files.length;
      if (uploadFileTotalCount > maxFileCount) {
        this.showAlert(this.MESSAGE.ALERT.LIMIT_FILE_COUNT);
        return false;
      }

      // 파일 크기 및 형식을 설정 (대소문자 구분)
      const allowedFileTypes = ['image/jpeg', 'image/jpg'];
      const maxFileSize = 300 * 1024; // 300KB
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!allowedFileTypes.includes(file.type)) {
          this.showAlert(this.MESSAGE.ALERT.LIMIT_FILE_TYPE);
          return false;
        }
        if (file.size > maxFileSize) {
          this.showAlert(this.MESSAGE.ALERT.LIMIT_FILE_SIZE);
          return false;
        }
      }

      return true;
    },

    //파일 업로드
    uploadFiles(files) {
      let busiType = 'mms';
      let pathType = 'images';
      let uploadUrl = "api/file/"+ busiType +"/"+ pathType +"/uploads";

      //파일 제한 체크 (빽엔드에서 체크 후 업로드 실패)
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();

        formData.append('action', uploadUrl);
        formData.append('method', "post");
        formData.append('custcoId', this.$store.getters['userStore/GE_USER_ROLE'].company.CD);                 //회사구분 : 1은 시스템(가이드)
        formData.append('userfiles', files[i]);           //파일(바이너리)
        formData.append('userId', this.$store.getters['userStore/GE_USER_ROLE'].userId);                   //사용자 ID : 2는 시스템(가이드)

        axios
        .post(uploadUrl, formData , {headers:{Authorization: "bearer " + window.sessionStorage.getItem("token")}})
          .then(response => {
            // 파일 업로드 성공 시 처리
            let leng = response.data.data.length
            for(let n=0;n<leng;n++)
            this.uploadFileList.push({
              index : i,
              filename : response.data.data[n].actlFileNm,
              filesize : response.data.data[n].fileSzDisplay,
              download : false,
              count : 0,
              downloadFile: response.data.data[n].actlFileNm,
              fileGroupKey: response.data.data[n].fileGroupKey,
              fileKey: response.data.data[n].fileKey,
            })
          })
          .catch(error => {
            // 파일 업로드 실패 시 처리
            console.error(error);
          });
      }
      // 서버로 파일 업로드 요청을 보냅니다.
    },

    /** MMS 첨부파일 정보 조회 */
    getMmsUploadFile(){
      if(this.mixin_isEmpty(this.uploadFileList)){
        let sUrl = "/phone-api/sms/tmpl/manage/uploadFiles";
        let postParam = {
          SMS_TMPL_ID: this.SELECT_TMPL_ROW.SMS_TMPL_ID
          ,FILE_GROUP_KEY: this.SELECT_TMPL_ROW.FILE_GROUP_KEY
        }
        let headParam = {head: {}};
        this.postCall(sUrl, postParam, headParam, this.getMmsUploadFileCallback);
      }
    },

    /** MMS 첨부파일 정보 조회 콜백 */
    getMmsUploadFileCallback(response){
      for(let i=0; i<response.DATA.length; i++){
        this.uploadFileList.push({
          index : i,
          filename : response.DATA[i].ACTL_FILE_NM,
          filesize : this.formatBytes(response.DATA[i].FILE_SZ),
          download : true,
          count : response.DATA[i].DWNLD_CNT,
          downloadFile: response.DATA[i].ACTL_FILE_NM,
          fileGroupKey: response.DATA[i].FILE_GROUP_KEY,
          fileKey: response.DATA[i].FILE_KEY,
          busiType: response.DATA[i].TASK_TYPE_CD,
          pathType: response.DATA[i].PATH_TYPE_CD,
        });
      }
    },

    /** 첨부파일 내역 영역 보이기 or 숨기기 */
    showFileUploadArea() {
      // sms 템플릿 유형이 MMS이면 파일 업로드 가능
      if (this.REG_SMS_TMPL_TYPE_CD == "TP_MMS") {
        this.isFileUpload = true;
      } else {
        this.isFileUpload = false;
      }
    },

    // 파일크기 포맷
    formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      // return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    },

    /** 이미지정보 초기화 */
    initImgGrid(){
      this.uploadFileList = [];
      this.DEL_FILE = [];
      this.DEL_FILE_LIST = [];
      this.DEL_FILE_KEY_LIST = [];
    },

    /** 파일 삭제 클릭 이벤트 처리 함수 */
    removeFile(){
      for(let i=0;i<this.DEL_FILE.FILE_LIST.length;i++){
        this.DEL_FILE_LIST.push(this.DEL_FILE.FILE_LIST[i]);
      }
    },

    /** 삭제할 파일이 있을 경우 파일 삭제 후 파일 그룹키 재설정 */
    modifySmsTmpl(){
      if(this.DEL_FILE_LIST.length != 0){
        let leng=this.DEL_FILE_LIST.length
        for(let i=0;i<leng;i++){
          this.DEL_FILE_KEY_LIST.push(this.DEL_FILE_LIST[i].fileKey);
        }
        this.delFile();
      }
      this.fileGroupKeyUnity();
    },

    /** 파일 삭제 */
    delFile(){
      //게시물 저장
      let sUrl = '/phone-api/sms/tmpl/manage/deleteSmsTmplFileByFileKey';
      let postParam = {
        FILE_KEY : this.DEL_FILE_KEY_LIST,
      };
      let headParam = {head: {}};
      this.postCall(sUrl, postParam, headParam, this.delFileCallback);
    },

    /** 파일 삭제 콜백 */
    delFileCallback(response){
      this.$store.commit("alertStore/hideAlert");
    },

    /** SMS 템플릿 관련 종료 */


    treeNodeMoveValidationCheck(type){

      if(this.SELECT_TMPL_CLSF.sortOrd == ""){
        this.showAlert(this.MESSAGE.ALERT.CHECK_SELECT_NODE);
        return;
      }

      if(type == "UP"){
        this.showAlert(this.MESSAGE.CONFIRM.TREE_NODE_UP);
      }else{
        this.showAlert(this.MESSAGE.CONFIRM.TREE_NODE_DOWN);
      }

    },

    treeNodeMoveValidation(type){
       // validation
      if(type == "UP" && this.SELECT_TMPL_CLSF.minSortOrd == this.SELECT_TMPL_CLSF.sortOrd){
        this.showAlert(this.MESSAGE.ALERT.LIMIT_TREE_MOVE_UP);
        // 더 올라갈수 없다는 팝업
        return false;
      }

      if(type == "DOWN" && this.SELECT_TMPL_CLSF.maxSortOrd == this.SELECT_TMPL_CLSF.sortOrd){
        this.showAlert(this.MESSAGE.ALERT.LIMIT_TREE_MOVE_DOWN);
        // 더 내려갈수 없다는 팝업
        return false;
      }
      return true;
    },

    treeNodeMoveUp(){
      this.treeNodeMove("UP");
    },

    treeNodeMoveDown(){
      this.treeNodeMove("DOWN");
    },

    treeNodeMove(type){
      if(this.treeNodeMoveValidation(type)){
        let sUrl = "/phone-api/sms/tmpl/manage/changeTmplClsfSortOrder";
        let postParam = {
          TMPL_CLSF_ID : this.SELECT_TMPL_CLSF.id,
          MOVE_COUNT : type == "UP" ? -1 : 1
        }

        let headParam = {head: {}};

        // 선택한 노드 정렬 순서 재설정
        let sortOrd = parseInt(this.SELECT_TMPL_CLSF.sortOrd) + parseInt(type == "UP" ? -1 : 1);
        this.postCall(sUrl, postParam, headParam, this.treeNodeMoveCallback, sortOrd);
      }
    },

    checkMessageByte(message){
      let newMessage = "";
      let totalByte = 0;
      let messageSplit = [];

      for(let i = 0; i < message.length; i++){
        let charCode = message.charCodeAt(i);
        if(charCode == 13){
          messageSplit = message.split(message[i]);
        }
      }

      if(messageSplit.length > 0){
        for(let j = 0; j < messageSplit.length; j++){
          newMessage += messageSplit[j];
        }
      }

      if(newMessage == ""){
        newMessage = message;
      }
      this.REG_SMS_TMPL_CN = newMessage;

      for(var i =0; i < newMessage.length; i++) {
        var currentByte = newMessage.charCodeAt(i);
        if(currentByte > 128){
          totalByte += 2;
        }else {
          totalByte++;
        }
      }
      return totalByte;
    },

    treeNodeMoveCallback(response, sortOrd){
      this.SELECT_TMPL_CLSF.sortOrd = sortOrd;
      // this.showAlert(this.MESSAGE.ALERT.CHG_SUCCESS);
      this.showToast(this.MESSAGE.TOAST.CHG_SUCCESS);
      /*setTimeout(() => {
          this.$store.commit("alertStore/hideAlert");
      }, 2000);*/
      this.closeMsg();
      // 트리 리로드
      this.getSmsTreeInfo();
    }

  },
}

</script>

<style lang="scss" scoped>

</style>