<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols flex-grow-1">
        <!-- left -->
        <div class="is-col-fix is-vrt" style="width: 500px">
          <div class="pl-card">
            <div class="pl-tree-header">
              <div class="is-left">
                <label>평가지표 분류</label>
              </div>
              <div class="is-right">
                <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault')">전체 펼치기</v-btn>
                <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault')">전체 접기</v-btn>
                <compo-tooltip-btn
                  TitleProp="새로고침"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="bottom"
                  @btnClick="getQltyClsfTree">
                </compo-tooltip-btn>
              </div>
            </div>
            <div class="pl-tree-body" style="height: 624px; ">
              <v-treeview ref="treeDefault" :items="TREE_QLTY_CLSF" :open-all="expanded" activatable
                color="secondary" class="pl-tree-view" @update:active="selectTree" :open.sync="OPENED_TREE"
                item-key="QLTY_CLSF_ID" return-object>
                  <template v-slot:prepend="{ item, open }">
                  <v-icon v-if="item.children">
                    {{ open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder' }}
                  </v-icon>
                  <v-icon v-else>
                    {{ 'pl-icon20 tree-file' }}
                  </v-icon>
                </template>
              </v-treeview>
            </div>
          </div>
          <div class="pl-card is-bottom">
            <!-- new folder 버튼 -->
            <compo-tooltip-btn TitleProp="그룹 생성" ClassProp="pl-tooltip-btn" IconProp="pl-icon20 is-new-folder"
              TooltipPositionProp="top" @btnClick="btnRegistClsf"></compo-tooltip-btn>
            <!-- 수정 버튼 -->
            <compo-tooltip-btn TitleProp="수정" ClassProp="pl-tooltip-btn" IconProp="pl-icon20 edit"
              TooltipPositionProp="top" @btnClick="btnModifyClsf"></compo-tooltip-btn>
            <!-- 삭제 버튼 -->
            <compo-tooltip-btn TitleProp="삭제" ClassProp="pl-tooltip-btn" IconProp="pl-icon20 trash"
              TooltipPositionProp="top" @btnClick="btnRemoveClsf"></compo-tooltip-btn>
            <div class="is-right">
              <!-- list up 버튼 -->
              <compo-tooltip-btn TitleProp="순서 위로" ClassProp="pl-tooltip-btn" IconProp="pl-icon20 is-list-up"
                TooltipPositionProp="top" @btnClick="btnUp"></compo-tooltip-btn>
              <!-- list down 버튼 -->
              <compo-tooltip-btn TitleProp="순서 아래로" ClassProp="pl-tooltip-btn" IconProp="pl-icon20 is-list-down"
                TooltipPositionProp="top" @btnClick="btnDown"></compo-tooltip-btn>
            </div>
          </div>
        </div>
        <!-- right -->
        <div class=" is-vrt">
          <div class="pl-search-header">
            <div class="pl-form-inline-wrap">
              <div class="pl-form-inline">
                <span class="pl-label">
                  사용 여부
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    :items="DROP_USE_YN"
                    v-model="USE_YN"
                    placeholder="선택하세요"></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  품질기준 명
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form is-lg"
                    value=""
                    v-model="EVL_ARTCL_NM"
                    placeholder="검색어 입력"
                    @keydown.enter="btnSearch"
                  />
                </div>
              </div>
              <v-btn class="pl-btn is-icon" @click="btnSearch">
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
            </div>
          </div>
          <!-- grid -->
          <div class="pl-card">
            <div class="pl-grid-top">
              <div class="pl-grid-top-left">
                <v-btn class="pl-btn is-icon is-sub" @click="btnRegistEvl">
                  <span class="pl-icon20 circle-plus"></span>
                  등록
                </v-btn>
                <v-btn class="pl-btn is-icon is-sub" @click="btnRemoveEvl" :disabled="EVL_ARTCL_SELECTED_DATA.length != 0 ? false : true">
                  <span class="pl-icon20 trash"></span>
                  삭제
                </v-btn>
                <v-btn class="pl-btn is-icon is-sub" @click="btnPreview">
                  <span class="pl-icon20 preview"></span>
                  미리보기
                </v-btn>
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter">전체 <em class="pl-1">({{ EVL_ARTCL_LIST_DATA.length }})</em> 건</span>
              </div>
            </div>
            <v-data-table ref="artclTable"
              class="pl-grid has-control"
              :headers="EVL_ARTCL_LIST_HEADER"
              :items="EVL_ARTCL_LIST_DATA"
              v-model="EVL_ARTCL_SELECTED_DATA"
              fixed-header
              show-select
              item-key="EVL_ARTCL_ID"
              height="247px"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              :page.sync="page"
              :item-class="isActiveRow"
              @click:row="onClickEvlArtcl"
              @page-count="pageCount = $event"
              return-object
              no-data-text="등록된 데이터가 없습니다."
            >
              <template v-slot:item.EVL_ARTCL_NM="{ item }">
                <v-tooltip content-class="pl-tooltip " bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">{{ item.EVL_ARTCL_NM }}</span>
                  </template>
                  <span>{{ item.EVL_ARTCL_NM }}</span>
                </v-tooltip>
              </template>
            </v-data-table>
            <!-- 품질지표 상세정보 -->
            <v-form ref="formArtcl">
            <div class="pl-card is-noborder">
              <h2 class="pl-subtit">품질지표 상세 정보</h2>
              <div class="pl-subdesc">
                <p>필수 항목을 입력하신 후 <strong>[저장] 버튼을 클릭</strong>하십시오.</p>
              </div>
              <div class="pl-cols is-mt-s is-border">
                <div class="is-mt-s">
                  <div class="pl-form-inline-wrap vertical ">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        품질지표 구분
                      </span>
                      <div class="pl-desc">
                        <v-text-field class="pl-form flex-grow-0" disabled v-model="oQaQltyEvlArtcl.TOP_QLTY_CLSF_NM"/>
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        분류 코드
                      </span>
                      <div class="pl-desc">
                        <v-text-field class="pl-form flex-grow-0" disabled v-model="oQaQltyEvlArtcl.QLTY_CLSF_ID"/>
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        분류명
                      </span>
                      <div class="pl-desc">
                        <v-text-field class="pl-form flex-grow-0" disabled v-model="oQaQltyEvlArtcl.QLTY_CLSF_NM"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="is-mt-s">
                  <div class="pl-form-inline-wrap vertical">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        품질기준 코드
                        <v-icon class="pl-icon20 required"></v-icon>
                      </span>
                      <div class="pl-desc">
                        <v-text-field class="pl-form flex-grow-0" disabled v-model="oQaQltyEvlArtcl.EVL_ARTCL_ID" />
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        품질기준 명
                        <v-icon class="pl-icon20 required"></v-icon>
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                            class="pl-form"
                            v-model="oQaQltyEvlArtcl.EVL_ARTCL_NM"
                            :rules="artclValidateRules.EVL_ARTCL_NM"
                            v-byte-counter="4000"
                        />
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        배점
                        <v-icon class="pl-icon20 required"></v-icon>
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                            class="pl-form flex-grow-0"
                            suffix="점"
                            v-model="oQaQltyEvlArtcl.ASSSCOR"
                            :rules="artclValidateRules.ASSSCOR"
                            v-byte-counter="4"
                        />
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        순서
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                            class="pl-form flex-grow-0"
                            v-model="oQaQltyEvlArtcl.SORT_ORD"
                            v-byte-counter="4"
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
                          class="pl-form flex-grow-0"
                          :items="DROP_USE_YN2"
                          v-model="oQaQltyEvlArtcl.USE_YN"
                          placeholder="선택하세요"
                          :rules="artclValidateRules.USE_YN"
                        ></v-select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </v-form>
          </div>
          <div class="pl-card is-bottom">
            <div class="is-right">
              <v-btn class="pl-btn" @click="btnSaveEvlArtcl">저장</v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- dialog -->
    <v-dialog
      v-model="dialogRegQltyClsf"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :headerTitle="DIALOG_TITLE"
        @hide="mixin_hideDialog('RegQltyClsf')"
      >
        <template slot="body">
          <p>분류명을 입력하신 후 <strong>[저장]</strong> 버튼을 클릭하십시오.</p>
          <v-form ref="formClsf">
          <div class="pl-form-inline-wrap vertical is-mt-m">
            <div class="pl-form-inline">
              <span class="pl-label">
                상위 분류
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  disabled
                  v-model="QA_QLTY_CLSF_REG.UP_QLTY_CLSF_ID"
                />
                <v-text-field
                  class="pl-form"
                  disabled
                  v-model="QA_QLTY_CLSF_REG.UP_QLTY_CLSF_NM"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                분류 명
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                    ref="txtClsfnm"
                    class="pl-form"
                    v-model="QA_QLTY_CLSF_REG.QLTY_CLSF_NM"
                    :rules="clsfValidateRules.QLTY_CLSF_NM"
                    v-byte-counter="200"
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
                  :items="DIAG_DROP_USE_YN"
                  placeholder="선택하세요"
                  v-model="QA_QLTY_CLSF_REG.USE_YN"
                  :rules="clsfValidateRules.USE_YN"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                정렬 순서
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <!--숫자만 입력 가능하도록 -->
                <v-text-field
                  class="pl-form"
                  oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '' );"
                  v-model="QA_QLTY_CLSF_REG.SORT_ORD"
                  :disabled.sync="DIAG_SORT_DISABLED"
                  v-byte-counter="4"
                />
              </div>
            </div>
          </div>
          </v-form>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('RegQltyClsf')">닫기</v-btn>
          <v-btn class="pl-btn" @click="btnSaveClsf">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- 미리보기 dialog -->
    <v-dialog
      v-model="dialogPreview"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="QA 평가지표 미리보기"
        @hide="mixin_hideDialog('Preview')"
        @submit="submitDialog('Preview')"
      >
        <template slot="body">
          <h2 class="pl-subtit">평가지표 : <span class="font-weight-medium ml-2 ">{{ preview_title }}</span></h2>
          <v-data-table
            class="pl-grid is-rowspan is-mt-m"
            :headers="headersRowSpan"
            :items="itemsRowSpan"
            fixed-header
            item-key="index"
            height="535px"
            :items-per-page="ROW_PER_PAGE"
            hide-default-footer
            :page.sync="page"
            @page-count="pageCount = $event"
            no-data-text="등록된 데이터가 없습니다."
            disable-pagination
          >
            <template v-slot:item="{ item, index }">
              <tr
                :class="mixin_getItemClass(item)"
                :key="index">
                <td
                  v-if="index === 0 || item.type01 !== itemsRowSpan[index - 1].type01"
                  :rowspan="mixin_getRowCount(index, 'type01')"
                  :class="mixin_getHeaderClass(headersRowSpan[0].align)">{{ item.type01 }}</td>
                <td
                  v-if="index === 0 || item.type02 !== itemsRowSpan[index - 1].type02"
                  :rowspan="mixin_getRowCount(index, 'type02')"
                  :class="mixin_getHeaderClass(headersRowSpan[1].align)">{{ item.type02 }}</td>
                <td :class="mixin_getHeaderClass(headersRowSpan[2].align)">
                    {{ item.type03 }}
                </td>
                <td style="white-space: pre-line;">
                  {{ item.subject }}
                </td>
              </tr>
            </template>
            <template slot="footer">
              <div class="pl-grid-sum">
                <table >
                  <colgroup>
                    <col v-for="(col, index) in headersRowSpan" :key="index" :width=col.width />
                  </colgroup>
                  <tbody >
                    <tr >
                      <td class="pl-grid-sum-head text-center" colspan="2">합계</td>
                      <td class="text-center">
                        {{ mixin_sum_field(this.itemsRowSpan, "type03") }}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </v-data-table>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from "vuex";
export default {
  name: "MENU_QAM_M0500", //name은 'MENU_' + 파일명 조합
  components: {
  },
  data() {
    return {
      // 미리보기 dialog
      dialogPreview: false,
      preview_title: '정기평가',
      headersRowSpan: [
        { text: "대분류"  , value: "type01" , align: "left"   , width: "150px" , sortable: false},
        { text: "중분류"  , value: "type02" , align: "left"   , width: "150px" , sortable: false},
        { text: "배점"    , value: "type03" , align: "center" , width: "80px" , sortable: false},
        { text: "품질기준", value: "subject", align: "left"   , width: "" , sortable: false},
      ],

      itemsRowSpan: [
      ],

      MESSAGE: {
        CONFIRM: {
          REGIST:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '저장 하시겠습니까?', callYes: this.saveYes, callNo: this.closeMsg },
          DEL_CLSF:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '삭제 하시겠습니까?', callYes: this.removeClsf, callNo: this.closeMsg },
          DEL_ARTCL:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '삭제 하시겠습니까?', callYes: this.removeEvlArtcl, callNo: this.closeMsg },
        },
        ALERT: {
          SAVE_DONE:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '저장 되었습니다.' },
          DEL_DONE:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '삭제 되었습니다.' },
          SEL_UP_CLSF:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '상위 분류를 선택 하세요.' },
          SEL_UPDATE:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '수정할 항목을 선택 하세요.' },
          SEL_REMOVE:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '삭제할 항목을 선택 하세요.' },
          SEL_CLSF:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '품질 분류를 선택 하세요.' },
          SEL_UP_CLSF_FOR_ADD:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '품질 지표를 등록할\n상위 품질 분류를 선택해 주세요.' },
          EXIST_LOWER_DATA:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '하위 항목이 있으면 삭제 할 수 없습니다.' },
          EXIST_EVL_ARTCL:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '품질기준이 등록되어 있어 삭제할 수 없습니다.' },
          NO_MORE_DEPTH:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '분류지표 등록은 3단계 까지만 가능합니다.' },
          NOT_ALLOW_THIS_DEPTH:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '품질지표는 최하위 분류(3레벨)에만\n등록할 수 있습니다.' },
          NO_MORE_UP:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '더 이상 위로 이동할 수 없습니다.' },
          NO_MORE_DOWN:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '더 이상 아래로 이동할 수 없습니다.' },
          USED_EVL_ARTCL:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '이미 평가가 진행된 지표는 삭제할 수 없습니다.' },
          NO_ARTCL_DATA:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '저장된 평가지표가 없습니다.', },
          SORT_ALT:
            { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '해당 순서를 가진 평가가 있습니다<br>순서를 확인해주세요', },
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.' },	//기본항목
        }
      },
      clsfValidateRules: {
        QLTY_CLSF_NM: [
          v => !!v || '분류명을 입력하세요.',
          v => v.length <= 100 || 'Max 100 characters',
        ],
        USE_YN: [
          v => !!v || '사용여부를 선택하세요.',
        ],
        // SORT_ORD: [
        //   v => !!v || '정렬순서를 입력하세요.',
        // ],
      },
      artclValidateRules: {
        EVL_ARTCL_NM: [
          v => !!v || '품질기준명을 입력하세요.',
          v => v.length <= 400 || 'Max 400 characters',
        ],
        ASSSCOR: [
          v => !!v || '배점을 입력하세요.',
          v => /[0-9]/.test(v) || '숫자만 입력 가능합니다.',
        ],
        // SORT_ORD: [
        //   v => !!v || '순서를 입력하세요.',
        // ],
        USE_YN: [
          v => !!v || '사용여부를 선택하세요.',
        ],
      },

      //dialog
      dialogRegQltyClsf: false,
      DIAG_DROP_USE_YN: [],
      // tree
      expanded: false,
      open:[],

      TREE_QLTY_CLSF: [
      ],

      DROP_USE_YN: [],
      DROP_USE_YN2: [],

      //검색용
      USE_YN: '',
      EVL_ARTCL_NM: '',

      dropItems3: [],
      page: 1,
      pageCount: 0,
      perPage: [15, 30, 50, 100],
      ROW_PER_PAGE: -1,

      EVL_ARTCL_LIST_HEADER: [
        { text: '번호'          , value: 'ROW_NUMBER'       , align: 'center' , width: '80px' },
        { text: '평가지표 구분' , value: 'TOP_QLTY_CLSF_NM' , align: 'left'   , width: '120px' },
        { text: '분류코드'      , value: 'QLTY_CLSF_ID'     , align: 'center' , width: '120px' },
        { text: '분류명'        , value: 'QLTY_CLSF_NM'     , align: 'left'   , width: '120px' },
        { text: '품질기준코드'  , value: 'EVL_ARTCL_ID'     , align: 'center' , width: '120px' },
        { text: '품질기준명'    , value: 'EVL_ARTCL_NM'     , align: 'left'   , width: '100%' },
        { text: '배점'          , value: 'ASSSCOR'          , align: 'center' , width: '80px' },
        { text: '순서'          , value: 'SORT_ORD'         , align: 'center' , width: '80px' },
        { text: '사용여부'      , value: 'USE_YN_NM'        , align: 'left'   , width: '100px' },

        { text: '사용여부코드'  , value: 'USE_YN'           , align: ' d-none' },
      ],
      EVL_ARTCL_LIST_DATA: [
      ],
      EVL_ARTCL_SELECTED_DATA: [],
      SELECTED_TREE:[],
      OPENED_TREE:[],

      //dialog
      DIALOG_TITLE: '',

      //Tree에서 현재 선택된 노드 정보 저장
      QA_QLTY_CLSF: {
        TOP_QLTY_CLSF_ID: '',
        TOP_QLTY_CLSF_NM: '',
        UP_QLTY_CLSF_ID:'',
        UP_QLTY_CLSF_NM: '',
        QLTY_CLSF_NM: '',
        USE_YN: '',
        DEL_YN: 'N',
        SORT_ORD: 1,
        RGTR_ID: '',
        QLTY_CLSF_ID: '',
      },
      //품질지표 등록용
      QA_QLTY_CLSF_REG: {
        UP_QLTY_CLSF_ID:'',
        UP_QLTY_CLSF_NM: '',
        QLTY_CLSF_NM: '',
        USE_YN: '',
        DEL_YN: 'N',
        SORT_ORD: 1,
        RGTR_ID: '',
        QLTY_CLSF_ID: '',
      },
      //품질지표 상세항목 등록용
      oQaQltyEvlArtcl: {
        TOP_QLTY_CLSF_NM: '',
        QLTY_CLSF_ID: '',
        QLTY_CLSF_NM: '',
        EVL_ARTCL_ID: '',
        EVL_ARTCL_NM: '',
        ASSSCOR: '',
        SORT_ORD: '',
        USE_YN: '',
        REG_DT: '',
        RGTR_ID: '',
      },
      DIAG_SORT_DISABLED: true,
    }
  },

  watch: {

  },
  computed: {
    ...mapGetters({
      stoUserId: 'userStore/GE_USER_ID',
      stoUserComp: 'userStore/GE_USER_COMPANY',
      stoCntnIp: 'userStore/GE_USER_IP_ADDR',
    }),
  },
  created() {
  },

  async mounted() {
    this.qa_codes = await this.mixin_common_code_get_all(['USE_WT'], 'Y');
    this.DIAG_DROP_USE_YN = this.mixin_common_code_get(this.qa_codes, 'USE_WT');
    this.DROP_USE_YN = this.mixin_common_code_get(this.qa_codes, 'USE_WT', '전체');
    this.DROP_USE_YN2 = this.mixin_common_code_get(this.qa_codes, 'USE_WT');
    this.QA_QLTY_CLSF.RGTR_ID = this.stoUserId;

    this.TREE_QLTY_CLSF = [
      {
        id: this.stoUserComp.CD,
        name: this.stoUserComp.CD_NM,
        children: [],
      },
    ];

    this.getQltyClsfTree();
  },
  methods: {
    expandAll(id){
      this.expanded = true;
      this.$refs[id].updateAll(true);
    },
    collapseAll(id){
      this.expanded = false;
      this.$refs[id].updateAll(false);
    },

    setDisable(bData) {
      this.DIAG_SORT_DISABLED = bData;
    },
    async getQltyClsfTree() {

      let sUrl = "/api/qa/qltyclsf/tree-list";
      let postParam = {};
      let headParam = {};

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!resData.HEADER.ERROR_FLAG) {
        //성공시 이벤트
        let qltyClsfTree = resData.DATA;
        let maxScore = [];
        let leng = qltyClsfTree.length;
        for(let k=0;k<2;k++){
          //1레벨>2레벨>3레벨 순이기 때문에
          //첫 반복에서 3레벨>2레벨 쓰기 => 두번째 반복에서 2레벨>1레벨 쓰기
          for(let i=0;i<leng;i++){
            //점수가 존재하는항목(최하위 레벨/3레벨)만 비교
            if(k == 0 && qltyClsfTree[i].MAX_ASSSCOR != '' && qltyClsfTree[i].MAX_ASSSCOR != 0 && qltyClsfTree[i].LEVEL == '3'){
              //이미 상위레벨의 값을 계산했는지 확인
              let qltyChk = true;
              let scoreLeng = maxScore.length;
              for(let n=0;n<scoreLeng;n++){
                if(maxScore[n].QLTY_CLSF_ID == qltyClsfTree[i].UP_QLTY_CLSF_ID){
                  //이미 계산한 상위레벨에 합계
                  maxScore[n].MAX_ASSSCOR = parseInt(maxScore[n].MAX_ASSSCOR) + parseInt(qltyClsfTree[i].MAX_ASSSCOR);
                  qltyChk = false;
                }
              }
              if(qltyChk){
                //처음 등장한 상위레벨
                let qltyScore = {
                  QLTY_CLSF_ID : qltyClsfTree[i].UP_QLTY_CLSF_ID
                  , MAX_ASSSCOR : qltyClsfTree[i].MAX_ASSSCOR
                }
                maxScore.push(qltyScore);
              }
            } else if(k == 1 && qltyClsfTree[i].MAX_ASSSCOR != '' && qltyClsfTree[i].MAX_ASSSCOR != 0 && qltyClsfTree[i].LEVEL == '2'){
              //이미 상위레벨의 값을 계산했는지 확인
              let qltyChk = true;
              let scoreLeng = maxScore.length;
              for(let n=0;n<scoreLeng;n++){
                if(maxScore[n].QLTY_CLSF_ID == qltyClsfTree[i].UP_QLTY_CLSF_ID){
                  //이미 계산한 상위레벨에 합계
                  maxScore[n].MAX_ASSSCOR = parseInt(maxScore[n].MAX_ASSSCOR) + parseInt(qltyClsfTree[i].MAX_ASSSCOR);
                  qltyChk = false;
                }
              }
              if(qltyChk){
                //처음 등장한 상위레벨
                let qltyScore = {
                  QLTY_CLSF_ID : qltyClsfTree[i].UP_QLTY_CLSF_ID
                  , MAX_ASSSCOR : qltyClsfTree[i].MAX_ASSSCOR
                }
                maxScore.push(qltyScore);
              }
            }
          }
          let maxScoreLeng = maxScore.length;
          for(let x=0;x<leng;x++){
            for(let j=0;j<maxScoreLeng;j++){
              if(maxScore[j].QLTY_CLSF_ID == qltyClsfTree[x].QLTY_CLSF_ID){
                qltyClsfTree[x].MAX_ASSSCOR = maxScore[j].MAX_ASSSCOR;
              }
            }
          }
        }
        // console.log("qltyClsfTree", qltyClsfTree);
        let oTree = this.makeTree(qltyClsfTree);
        this.TREE_QLTY_CLSF = oTree;
      }
    },
    makeTree(array) {
      //console.log('data', array);
      var map = {};
      for (var i = 0; i < array.length; i++) {
        var obj = { 
          "id": array[i]['QLTY_CLSF_ID']
          ,"name": array[i]['QLTY_CLSF_NM'] + ' (' + (array[i]['MAX_ASSSCOR'] == "" ? '0' : array[i]['MAX_ASSSCOR']) + ')'
          ,"level": array[i]['LEVEL']
          ,"TOP_QLTY_CLSF_ID": array[i]['TOP_QLTY_CLSF_ID']
          ,"TOP_QLTY_CLSF_NM": array[i]['TOP_QLTY_CLSF_NM']
          ,"UP_QLTY_CLSF_ID": array[i]['UP_QLTY_CLSF_ID']
          ,"UP_QLTY_CLSF_NM": array[i]['UP_QLTY_CLSF_NM']
          ,"QLTY_CLSF_NM": array[i]['QLTY_CLSF_NM']
          ,"USE_YN": array[i]['USE_YN']
          ,"DEL_YN": array[i]['DEL_YN']
          ,"SORT_ORD": array[i]['SORT_ORD']
          ,"QLTY_CLSF_ID": array[i]['QLTY_CLSF_ID']
        };
        obj.children = [];
        map[obj.id] = obj;
        var parent = array[i]['UP_QLTY_CLSF_ID'] || '-';
        if (!map[parent]) {
          map[parent] = {
            children: []
          };
        }
        map[parent].children.push(obj);
      }

      return map['-'].children;
    },
    async btnRegistClsf() {

      // console.log('btnRegistClsf.SELECTED_TREE', this.SELECTED_TREE[0]);

      const oSelected = this.SELECTED_TREE[0];

      //depth 확인. 3depth 까지만 등록 가능
      if(this.SELECTED_TREE < 1) {
        //선택된 값이 없으면 alert
        this.showAlert(this.MESSAGE.ALERT.SEL_UP_CLSF);
        return;
      } else if(oSelected.level >= 3)  {
        //선택된 값이 없으면 alert
        this.showAlert(this.MESSAGE.ALERT.NO_MORE_DEPTH);
        return;
      }

      await this.mixin_showDialog('RegQltyClsf');
      this.resetValidClsf();

      if(oSelected.level == 2) {
        this.DIAG_SORT_DISABLED = true;
      } else {
        this.DIAG_SORT_DISABLED = false;
      }

      this.DIALOG_TITLE = "QA 품질지표 분류 등록";
      this.QA_QLTY_CLSF_REG.UP_QLTY_CLSF_ID = oSelected.id;
      this.QA_QLTY_CLSF_REG.UP_QLTY_CLSF_NM = oSelected.name;

      let oChilds = this.findTree(oSelected.QLTY_CLSF_ID, this.TREE_QLTY_CLSF);
      let sortOrd = 1;
      if(oChilds != undefined && oChilds.length > 0)
        sortOrd = parseInt(oChilds[oChilds.length - 1].SORT_ORD) + 1;

      this.QA_QLTY_CLSF_REG.QLTY_CLSF_NM = '';
      this.QA_QLTY_CLSF_REG.USE_YN = 'Y'; //사용함을 디폴트로
      this.QA_QLTY_CLSF_REG.DEL_YN = 'N';
      this.QA_QLTY_CLSF_REG.SORT_ORD = sortOrd;
      this.QA_QLTY_CLSF_REG.RGTR_ID = this.stoUserId;
      this.QA_QLTY_CLSF_REG.QLTY_CLSF_ID = '';
    },
    async selectTree(node) {
      // console.log('selectTree,node', node);
      // console.log('selectTree,selectedTree1', this.SELECTED_TREE);

      if(node == undefined || node.length < 1)  {
        this.SELECTED_TREE=[];
        this.EVL_ARTCL_LIST_DATA=[];
        this.EVL_ARTCL_SELECTED_DATA=[];
        this.initEvlArtclInfo();
        return;
      }
      else
        this.SELECTED_TREE[0] = node[0];

      if (this.SELECTED_TREE[0].level > 2) {
        await this.getArtclList();

        let oTmp = this.EVL_ARTCL_LIST_DATA;
        // console.log('selectTree.oTmp', oTmp.length, oTmp );

        if(this.EVL_ARTCL_LIST_DATA.length > 0) {
          this.assignEvlArtclInfo(this.EVL_ARTCL_LIST_DATA[0]);
        } else {
          this.initEvlArtclInfoForRegist();
        }
      } else {
        this.EVL_ARTCL_LIST_DATA=[];
        this.EVL_ARTCL_SELECTED_DATA=[];
        this.initEvlArtclInfo();
      }
    },
    async initTree() {
      await this.getQltyClsfTree();
    },
    initDialog() {
      this.QA_QLTY_CLSF_REG.UP_QLTY_CLSF_ID = '';
      this.QA_QLTY_CLSF_REG.UP_QLTY_CLSF_NM = '';
      this.QA_QLTY_CLSF_REG.QLTY_CLSF_NM = '';
      this.QA_QLTY_CLSF_REG.USE_YN = '';
      this.QA_QLTY_CLSF_REG.DEL_YN = 'N';
      this.QA_QLTY_CLSF_REG.SORT_ORD = '';
      this.QA_QLTY_CLSF_REG.RGTR_ID = this.stoUserId;
      this.QA_QLTY_CLSF_REG.QLTY_CLSF_ID = '';
    },
    initEvlArtclInfo() {
      this.oQaQltyEvlArtcl.TOP_QLTY_CLSF_NM = '';
      this.oQaQltyEvlArtcl.QLTY_CLSF_ID = '';
      this.oQaQltyEvlArtcl.QLTY_CLSF_NM = '';
      this.oQaQltyEvlArtcl.EVL_ARTCL_ID = '';
      this.oQaQltyEvlArtcl.EVL_ARTCL_NM = '';
      this.oQaQltyEvlArtcl.ASSSCOR = '';
      this.oQaQltyEvlArtcl.SORT_ORD = '',
      this.oQaQltyEvlArtcl.USE_YN = '';
      this.oQaQltyEvlArtcl.RGTR_ID = this.stoUserId;
      this.resetValidArtcl();
    },
    assignEvlArtclInfo(oItem) {
      this.oQaQltyEvlArtcl.TOP_QLTY_CLSF_NM = oItem.TOP_QLTY_CLSF_NM;
      this.oQaQltyEvlArtcl.QLTY_CLSF_ID = oItem.QLTY_CLSF_ID;
      this.oQaQltyEvlArtcl.QLTY_CLSF_NM = oItem.QLTY_CLSF_NM;
      this.oQaQltyEvlArtcl.USE_YN = oItem.USE_YN;
      this.oQaQltyEvlArtcl.SORT_ORD = oItem.SORT_ORD;
      this.oQaQltyEvlArtcl.EVL_ARTCL_ID = oItem.EVL_ARTCL_ID;
      this.oQaQltyEvlArtcl.EVL_ARTCL_NM = oItem.EVL_ARTCL_NM;
      this.oQaQltyEvlArtcl.ASSSCOR = oItem.ASSSCOR;
    },
    initEvlArtclInfoForRegist() {
      //품질지표기준, 분류코드, 분류명, 순서 setting
      this.oQaQltyEvlArtcl.TOP_QLTY_CLSF_NM = this.SELECTED_TREE[0].TOP_QLTY_CLSF_NM;
      this.oQaQltyEvlArtcl.QLTY_CLSF_ID = this.SELECTED_TREE[0].QLTY_CLSF_ID;
      this.oQaQltyEvlArtcl.QLTY_CLSF_NM = this.SELECTED_TREE[0].QLTY_CLSF_NM;
      this.oQaQltyEvlArtcl.USE_YN = 'Y';
      this.oQaQltyEvlArtcl.SORT_ORD = '';
      this.oQaQltyEvlArtcl.EVL_ARTCL_ID = '';
      this.oQaQltyEvlArtcl.EVL_ARTCL_NM = '';
      this.oQaQltyEvlArtcl.ASSSCOR = '';
      this.resetValidArtcl();
    },
    btnSaveClsf() {
      if(this.validateForClsf())
        this.saveClsf();
    },
    async saveClsf() {
      let bUpdate = true; // 등록/수정여부
      if (this.mixin_isEmpty(this.QA_QLTY_CLSF_REG.QLTY_CLSF_ID))
        bUpdate = false;

      let sUrl = "/api/qa/qltyclsf/regist";
      let postParam = this.QA_QLTY_CLSF_REG;
      let headParam = {};

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!resData.HEADER.ERROR_FLAG) {
        //성공시 이벤트
        let oSelected = this.SELECTED_TREE[0];
        if (bUpdate) { //수정일 경우 tree select 값이 수정된 값으로 변경되지 않으므로 강제로 변경 시킴.
          oSelected.TOP_QLTY_CLSF_NM = this.QA_QLTY_CLSF_REG.TOP_QLTY_CLSF_NM;
          oSelected.TOP_QLTY_CLSF_ID = this.QA_QLTY_CLSF_REG.TOP_QLTY_CLSF_ID;
          oSelected.UP_QLTY_CLSF_NM = this.QA_QLTY_CLSF_REG.UP_QLTY_CLSF_NM;
          oSelected.UP_QLTY_CLSF_ID = this.QA_QLTY_CLSF_REG.UP_QLTY_CLSF_ID;
          oSelected.QLTY_CLSF_NM = this.QA_QLTY_CLSF_REG.QLTY_CLSF_NM;
          oSelected.QLTY_CLSF_ID = this.QA_QLTY_CLSF_REG.QLTY_CLSF_ID;
          oSelected.QLTY_CLSF_NM = this.QA_QLTY_CLSF_REG.QLTY_CLSF_NM;
          oSelected.USE_YN = this.QA_QLTY_CLSF_REG.USE_YN;
          oSelected.SORT_ORD = this.QA_QLTY_CLSF_REG.SORT_ORD;
        } else {
          this.initDialog();
        }

        this.resetValidClsf();
        this.showAlert(this.MESSAGE.ALERT.SAVE_DONE);
        this.mixin_hideDialog('RegQltyClsf');

        await this.initTree();

        //추가한 폴더의 상위 폴더가 닫힌 상태면 열어줌.
        // console.log('saveClsf.1.TREE', this.SELECTED_TREE[0], this.OPENED_TREE, this.TREE_QLTY_CLSF);
        if (this.OPENED_TREE.indexOf(oSelected) < 0) {
          this.OPENED_TREE.push(this.SELECTED_TREE[0]);
          // console.log('saveClsf.1-1.TREE', this.SELECTED_TREE[0], this.OPENED_TREE, this.TREE_QLTY_CLSF);
        }
      }
    },
    async btnModifyClsf() {

      if (this.SELECTED_TREE < 1) {
        //선택된 값이 없으면 alert
        this.showAlert(this.MESSAGE.ALERT.SEL_UPDATE);
        return;
      }

      let oSelected = this.SELECTED_TREE[0];

      this.QA_QLTY_CLSF_REG.UP_QLTY_CLSF_ID = oSelected.UP_QLTY_CLSF_ID;
      this.QA_QLTY_CLSF_REG.UP_QLTY_CLSF_NM = oSelected.UP_QLTY_CLSF_NM;
      this.QA_QLTY_CLSF_REG.QLTY_CLSF_NM = oSelected.QLTY_CLSF_NM;
      this.QA_QLTY_CLSF_REG.USE_YN = oSelected.USE_YN;
      this.QA_QLTY_CLSF_REG.DEL_YN = oSelected.DEL_YN;
      this.QA_QLTY_CLSF_REG.SORT_ORD = oSelected.SORT_ORD;
      this.QA_QLTY_CLSF_REG.RGTR_ID = this.stoUserId;
      this.QA_QLTY_CLSF_REG.QLTY_CLSF_ID = oSelected.QLTY_CLSF_ID;
      this.DIALOG_TITLE = "QA 품질지표 분류 수정";
      await this.mixin_showDialog('RegQltyClsf');

      let oRefs = this.$refs;

      if (oSelected.level == 3) {
        this.DIAG_SORT_DISABLED = true;
      } else {
        this.DIAG_SORT_DISABLED = false;
      }
    },
    btnRemoveClsf() {
      if (this.SELECTED_TREE < 1) {
        //선택된 값이 없으면 alert
        this.showAlert(this.MESSAGE.ALERT.SEL_REMOVE);
        return;
      }

      let oSelected = this.SELECTED_TREE[0];
      if(oSelected.children.length > 0) {
        //하위항목이 있으면 삭제 안됨.
        this.showAlert(this.MESSAGE.ALERT.EXIST_LOWER_DATA);
        return;
      }

      if(oSelected.level > 2 && this.EVL_ARTCL_LIST_DATA.length > 0) {
        this.showAlert(this.MESSAGE.ALERT.EXIST_EVL_ARTCL);
        return;
      }

      this.showAlert(this.MESSAGE.CONFIRM.DEL_CLSF);
    },
    async removeClsf(QLTY_CLSF_ID) {

      let sUrl = "/api/qa/qltyclsf/remove";
      let postParam = { "QLTY_CLSF_ID": this.SELECTED_TREE[0].QLTY_CLSF_ID };
      let headParam = {};

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (resData.HEADER.ERROR_FLAG) {
        //실패시 이벤트 + alert메시지
        // console.log('removeClsf.error', resData.HEADER.ERROR_MSG);
        if(resData.HEADER.ERROR_MSG == "EXIST_EVL_ARTCL")
          this.showAlert(this.MESSAGE.ALERT.EXIST_EVL_ARTCL);
      } else {
        //성공시 이벤트
        this.showAlert(this.MESSAGE.ALERT.DEL_DONE);
        this.SELECTED_TREE = [];
        await this.initTree();
        this.initDialog();
      }
    },
    btnSearch() {
      this.getArtclList(true);
    },
    async getArtclList(bSearch) {
      if (this.SELECTED_TREE < 1) {
        //선택된 값이 없으면 alert
        this.showAlert(this.MESSAGE.ALERT.SEL_CLSF);
        return;
      }

      let sUrl = "/api/qa/qltyevlartcl/list";
      let postParam = {
        //넘길 파라미터(대문자)
        QLTY_CLSF_ID: this.SELECTED_TREE[0].QLTY_CLSF_ID,
        EVL_ARTCL_NM: bSearch?this.EVL_ARTCL_NM:'',
        USE_YN: bSearch?this.USE_YN:'',
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!resData.HEADER.ERROR_FLAG) {
        //성공시 이벤트
        this.EVL_ARTCL_LIST_DATA = resData.DATA;
        this.EVL_ARTCL_SELECTED_DATA = [];
      }
    },
    btnRegistEvl() {
      let oSelected = this.SELECTED_TREE[0];
      if (this.SELECTED_TREE < 1) {
        //선택된 값이 없으면 alert
        this.showAlert(this.MESSAGE.ALERT.SEL_UP_CLSF_FOR_ADD);
        return;
      } else if(oSelected.level != 3) {
        this.showAlert(this.MESSAGE.ALERT.NOT_ALLOW_THIS_DEPTH);
        return;
      }

      this.initEvlArtclInfo();
      this.initEvlArtclInfoForRegist();
    },
    btnRemoveEvl() {
      if (this.EVL_ARTCL_SELECTED_DATA < 1) {
        //선택된 값이 없으면 alert
        this.showAlert(this.MESSAGE.ALERT.SEL_REMOVE);
        return;
      }

      this.showAlert(this.MESSAGE.CONFIRM.DEL_ARTCL);
    },
    async removeEvlArtcl() {
      let oSendData = [];
      let oIds = [];

      this.EVL_ARTCL_SELECTED_DATA.forEach((array) => {
        oIds.push(array.EVL_ARTCL_ID);
      })

      let sUrl = "/api/qa/qltyevlartcl/remove";
      let postParam = {
        //넘길 파라미터(대문자)
        LIST_ID: oIds.join(','),
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (resData.HEADER.ERROR_FLAG) {
        //실패시 이벤트 + alert메시지
        if(resData.HEADER.ERROR_MSG != undefined && resData.HEADER.ERROR_MSG == 'USED_EVL_ARTCL')
          this.showAlert(this.MESSAGE.ALERT[resData.HEADER.ERROR_MSG]);
      } else {
        //성공시 이벤트
        this.showAlert(this.MESSAGE.ALERT.DEL_DONE);
        this.EVL_ARTCL_SELECTED_DATA = [];
        await this.getArtclList();

        //상세정보에 있는 정보가 리스트에 없으면 상세정보 reset 처리
        let bArtclExist = false;
        for (let item of this.EVL_ARTCL_LIST_DATA) {
          if(item.EVL_ARTCL_ID == this.oQaQltyEvlArtcl.EVL_ARTCL_ID) {
            bArtclExist = true;
            break;
          }
        }

        if(!bArtclExist)
          this.initEvlArtclInfoForRegist();

        this.showAlert(this.MESSAGE.ALERT.DEL_DONE);
      }
    },
    btnSaveEvlArtcl() {
      for(let i=0;i<this.EVL_ARTCL_LIST_DATA.length;i++){
        if(this.EVL_ARTCL_LIST_DATA[i].SORT_ORD == this.oQaQltyEvlArtcl.SORT_ORD){
          this.showAlert(this.MESSAGE.ALERT.SORT_ALT);
          return;
        }
      }

      if (this.validateForArtcl()){
        this.saveEvlArtcl('EVLARTCL');
      }
    },
    async saveEvlArtcl() {
      let bUpdate = true; // 등록/수정여부
      if (this.mixin_isEmpty(this.oQaQltyEvlArtcl.EVL_ARTCL_ID))
        bUpdate = false;

      let sUrl = "/api/qa/qltyevlartcl/regist";
      let postParam = this.oQaQltyEvlArtcl;
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!resData.HEADER.ERROR_FLAG) {
        //성공시 이벤트
        this.getArtclList();
        this.initEvlArtclInfoForRegist();
        this.showAlert(this.MESSAGE.ALERT.SAVE_DONE);
      }
    },
    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item.EVL_ARTCL_ID === this.oQaQltyEvlArtcl.EVL_ARTCL_ID ? "active" : "";
      return activeClass;
    },
    onClickEvlArtcl(item) {
      //품질지표기준, 분류코드, 분류명, 순서 setting
      this.assignEvlArtclInfo(item);
    },
    copySortOrd(oNodes) {
      let rtn = [];
      for(let item of oNodes) {
        rtn.push({ QLTY_CLSF_ID: item.QLTY_CLSF_ID, SORT_ORD: item.SORT_ORD});
      }
      return rtn;
    },
    async btnUp() {
      let oTree = this.TREE_QLTY_CLSF;
      let oSelected = this.SELECTED_TREE[0];
      //해당 node가 포함된 계층의 node array를 가져온다.
      let oChilds = this.findTree(oSelected.UP_QLTY_CLSF_ID, oTree);
      let oOrgChilds = this.copySortOrd(oChilds);
      //해당 node의 위치
      let idx = _.findIndex(oChilds, { QLTY_CLSF_ID: oSelected.QLTY_CLSF_ID }, 0)
      if(idx < 1) { //최상위 노드일때는 이동 불가
        this.showAlert(this.MESSAGE.ALERT.NO_MORE_UP);
        return;
      } else {  //위 node와 바꿔치기
        let oNode = { ...oChilds[idx - 1] };
        oChilds.splice(idx-1,1);
        oChilds.splice(idx, 0, oNode);
      }
      await this.reOrder(oChilds);
      let oMod = this.diffOrder(oOrgChilds, oChilds);
      this.saveClsfOrder(oMod);
    },
    async btnDown() {
      let oTree = this.TREE_QLTY_CLSF;
      let oSelected = this.SELECTED_TREE[0];
      //해당 node가 포함된 계층의 node array를 가져온다.
      let oChilds = this.findTree(oSelected.UP_QLTY_CLSF_ID, oTree);
      let oOrgChilds = this.copySortOrd(oChilds);
      //해당 node의 위치
      let idx = _.findIndex(oChilds, { QLTY_CLSF_ID: oSelected.QLTY_CLSF_ID }, 0)
      if (idx >= oChilds.length - 1) { //최상위 노드일때는 이동 불가
        this.showAlert(this.MESSAGE.ALERT.NO_MORE_DOWN);
        return;
      } else {  //아래 node와 바꿔치기
        let oNode = { ...oChilds[idx + 1] };
        await oChilds.splice(idx + 1, 1);
        oChilds.splice(idx, 0, oNode);
      }
      await this.reOrder(oChilds);
      let oMod = this.diffOrder(oOrgChilds, oChilds);
      this.saveClsfOrder(oMod);
    },
    diffOrder(oOrg, oMod) {
      let rtn = [];
      for(let item of oMod) {
        let idx = _.findIndex(oOrg, { QLTY_CLSF_ID: item.QLTY_CLSF_ID }, 0);
        // console.log('diffOrder', 'Org', oOrg[idx].QLTY_CLSF_ID, oOrg[idx].SORT_ORD, 'Mod', item.QLTY_CLSF_ID, item.SORT_ORD);
        if(oOrg[idx].SORT_ORD != item.SORT_ORD) {
          rtn.push(oMod[idx]);
        }
      }
      return rtn;
    },
    reOrder(oChilds) {
      let idx = 0;
      for(let item of oChilds) {
        item.SORT_ORD = (++idx);
      }
    },
    async saveClsfOrder(oChilds) {
      let oParam = [];
      for(let item of oChilds) {
        oParam.push(item.QLTY_CLSF_ID + '_' + item.SORT_ORD);
      }

      let sUrl = "/api/qa/qltyclsf/clsfreorder";
      let postParam = { LIST_DATA: oParam.join(',') };
      let headParam = {};

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!resData.HEADER.ERROR_FLAG) {
        //성공시 이벤트
        //this.showAlert(this.MESSAGE.ALERT.SAVE_DONE);
      }
    },
    findTree(upClsfId, oTree) {
      for(let item of oTree) {
        if(!this.mixin_isEmpty(item.QLTY_CLSF_ID) && (item.QLTY_CLSF_ID == upClsfId)) {
          return item.children;
        }
        else if(!this.mixin_isEmpty(item.children)) {
            let oParent = this.findTree(upClsfId, item.children);
            if(oParent != undefined) {
              return oParent;
            }
        }
      }
      return;
    },
    async btnPreview() {
      let oSelected = this.SELECTED_TREE[0];

      if(oSelected == undefined || oSelected.level < 1) {
        this.showAlert(this.MESSAGE.ALERT.SEL_CLSF);
        return;
      }

      this.preview_title = oSelected.TOP_QLTY_CLSF_NM;

      let sUrl = "/api/qa/evlmng/artcllist";
      let postParam = {
        UP_QLTY_CLSF_ID: oSelected.TOP_QLTY_CLSF_ID,
        USE_YN: 'Y',
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)

      if (!resData.HEADER.ERROR_FLAG) {
        //성공시 이벤트
        if (resData.DATA.length < 1) {
          this.showAlert(this.MESSAGE.ALERT.NO_ARTCL_DATA);
        }
        else {
          this.setPlanQltySheet(resData.DATA);
          this.mixin_showDialog('Preview');
        }
      }
    },


    async setPlanQltySheet(data) {
      //가져온 데이터를 양식에 맞게 재구성.
      let oPaper = [];
      data.forEach(item => {
        if (this.mixin_isEmpty(item.UP_QLTY_CLSF_NM)) {        // UP_QLTY_CLSF_NM 가 없으면 대분류
          item.index = oPaper.length + 1;
          item.type01 = item.QLTY_CLSF_NM;
          oPaper.push(item);
        } else if (this.mixin_isEmpty(item.EVL_ARTCL_ID)) {   // UP_QLTY_CLSF_ID는 있는데 EVL_ARTCL_ID 가 없으면 중분류 Only -> 상위 대분류에 내용 넣어줌
          let oLastItem = oPaper[oPaper.length - 1];
          item.index = oLastItem.index;
          item.type01 = oLastItem.type01;
          item.type02 = item.QLTY_CLSF_NM;
          if (this.mixin_isEmpty(oLastItem.subject)) // 바로 앞 항목이 분류면 update, 품질기준이면 insert
            oPaper.pop();
          oPaper.push(item);
        } else {                                              // 그 외의 경우는 품질 기준 Level.
          let oLastItem = oPaper.length > 0 ? oPaper[oPaper.length - 1] : [];
          let bUpdate = (this.mixin_isEmpty(oLastItem) || !this.mixin_isEmpty(oLastItem.type02)) ? false : true;
          // 상위에 대분류만 들어가 있는 경우는 상위 item 업데이트, 그외의 경우는 새로 item insert
          item.type01 = item.UP_QLTY_CLSF_NM;
          item.type02 = item.QLTY_CLSF_NM;
          item.type03 = item.ASSSCOR;
          item.subject = item.EVL_ARTCL_NM;
          item.index = bUpdate ? oLastItem.index : oPaper.length + 1;
          if (bUpdate)
            oPaper.pop();
          oPaper.push(item);
        }
      });

      this.itemsRowSpan = oPaper;
    },

    //품질지표 분류 등록 valid check
    validateForClsf() {
      return this.$refs.formClsf.validate();
    },
    //품질지표 항목 등록 valid check
    validateForArtcl() {
      return this.$refs.formArtcl.validate();
    },
    resetValidClsf() {
      this.$refs.formClsf.resetValidation();
    },
    resetValidArtcl() {
      this.$refs.formArtcl.resetValidation();
    },
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },
  },
}
</script>

<style lang="scss" scoped></style>