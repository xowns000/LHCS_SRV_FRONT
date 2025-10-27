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
          <div class="pl-search-header">
            <div class="pl-form-inline-wrap">
              <div class="pl-form-inline">
                <span class="pl-label">
                  메뉴 그룹
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form "
                    :items="MENU_GROUP_DROP"
                    v-model="MENU_GROUP"
                    placeholder="선택하세요"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  표시 여부
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form "
                    :items="mixin_common_code_get(COMM_CD_DROP_LIST, 'SHOW_WT','전체')"
                    v-model="INDCT_YN"
                    placeholder="선택하세요"
                  ></v-select>
                </div>
              </div>
            </div>
            <v-btn class="pl-btn is-icon ml-2"
              @click="srch_menu_tree()"
            >
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
          </div>
          <div class="pl-card">
            <div class="pl-tree-header">
              <div class="is-left">
                <label>기본 메뉴</label>
              </div>
              <div class="is-right">
                <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault')">전체 펼치기</v-btn>
                <v-btn class="pl-btn is-sub is-sm" @click="[initMenu(),collapseAll('treeDefault')]">전체 접기</v-btn>
              </div>
            </div>
            <div class="pl-tree-body" style="height: 537px;">
              <v-treeview
                ref="treeDefault"
                :items="MENU_TREE"
                :open-all="expanded"
                activatable
                :active="ACT_TREE_MENU"
                open-on-click
                color="secondary"
                class="pl-tree-view"
                @update:active="srch_tree_act"
                @update:open="srch_tree_open"
              >
                <template v-slot:prepend="{ item, open }">
                  <v-icon v-if="item.children.length>0">
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
            <!-- new folder 버튼 -->
            <compo-tooltip-btn
              v-if="$store.getters['userStore/GE_USER_ROLE'].userId == '1'"
              TitleProp="그룹 생성"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 is-new-folder"
              TooltipPositionProp="top"
              @btnClick="initMenu('NEW_GROUP')"
            ></compo-tooltip-btn>
            <div class="is-right">
              <!-- list up 버튼 -->
              <compo-tooltip-btn
                v-if="$store.getters['userStore/GE_USER_ROLE'].userId == '1'"
                TitleProp="순서 위로"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 is-list-up"
                TooltipPositionProp="top"
                @btnClick="chg_ord('-')"
                :DisabledProp="MENU_ID=='' || MENU_ID=='LEFT' || MENU_ID=='RIGHT' ? true : (SORT_ORD == '1' ? true : false)"
              ></compo-tooltip-btn>
              <!-- list down 버튼 -->
              <compo-tooltip-btn
                v-if="$store.getters['userStore/GE_USER_ROLE'].userId == '1'"
                TitleProp="순서 아래로"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 is-list-down"
                TooltipPositionProp="top"
                @btnClick="chg_ord('+')"
                :DisabledProp="MENU_ID=='' || MENU_ID=='LEFT' || MENU_ID=='RIGHT' ? true : (SORT_ORD == SORT_MAX ? true : false)"
              ></compo-tooltip-btn>
            </div>
          </div>
        </div>
        <!-- center -->
        <div class="is-col-fix is-vrt" style="width: 619px">
          <div class="pl-card">
            <h2 class="pl-subtit">메뉴 상세 정보</h2>
            <div class="pl-subdesc">
              <p>필수 항목을 입력하신 후 [저장] 버튼을 클릭하십시오.</p>
            </div>
          </div>
          <v-form ref="form_menu">
          <div class="pl-card is-noborder pt-0" style="overflow: auto; height: 609px;">
            <div class="pl-form-inline-wrap vertical">
              <div class="pl-form-inline">
                <span class="pl-label">
                  메뉴 ID
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    disabled
                    v-model="MENU_ID"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  상위메뉴 ID
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    disabled
                    v-model="UP_MENU_ID"
                    v-byte-counter="8"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  메뉴 명
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    v-model="MENU_NM"
                    :rules="validateRules.MENU_NM"
                    v-byte-counter="300"
                    :disabled="MENU_SAVE_BTN"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  메뉴 아이콘
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    v-model="ICON_CLASS_NM"
                    v-byte-counter="100"
                    :disabled="MENU_SAVE_BTN"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  프로그램경로
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    v-model="PATH_NM"
                    v-byte-counter="320"
                    :disabled="MENU_SAVE_BTN"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  뷰 타겟
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    :items="mixin_common_code_get(COMM_CD_DROP_LIST, 'VIEW_TG')"
                    v-model="VIEW_TRGT"
                    placeholder="선택하세요"
                    :rules="validateRules.VIEW_TRGT"
                    :disabled="MENU_SAVE_BTN"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  표시 여부
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    :items="mixin_common_code_get(COMM_CD_DROP_LIST, 'SHOW_WT')"
                    v-model="MENU_INDCT_YN"
                    placeholder="선택하세요"
                    :rules="validateRules.MENU_INDCT_YN"
                    :disabled="MENU_SAVE_BTN"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  연동 레이아웃
                </span>
                <div class="pl-desc">
                  <v-select
                      class="pl-form"
                      :items="SELECT_BOX_LAYOUT_LIST"
                      v-model="LAYOUT_ID"
                      placeholder="선택하세요"
                      :disabled="MENU_SAVE_BTN"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline" v-show="VIEW_TRGT === 'RIGHT'">
                <span class="pl-label">
                  메뉴 액션명
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    v-model="ACT_NM"
                    v-byte-counter="80"
                    :disabled="MENU_SAVE_BTN"
                  />
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
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  메뉴 설명
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-textarea
                    class="pl-form is-noresize"
                    v-model="MENU_EXPLN"
                    :rules="validateRules.MENU_EXPLN"
                    :spellcheck="false"
                    v-byte-counter="4000"
                    :disabled="MENU_SAVE_BTN"
                  />
                </div>
              </div>
            </div>
          </div>
          </v-form>
          <div
            v-if="$store.getters['userStore/GE_USER_ROLE'].userId == '1'"
            class="pl-card is-bottom">
            <v-btn
              class="pl-btn is-icon is-sub"
              :disabled="MENU_ADD_BTN"
              @click="initMenu('NEW_MENU')"
            >
              <span class="pl-icon20 circle-plus"></span>
              메뉴 등록
            </v-btn>
            <v-btn
              class="pl-btn is-icon is-sub"
              :disabled="MENU_DEL_BTN"
              @click="showAlert(MESSAGE.CONFIRM.DEL_MENU)"
            >
              <span class="pl-icon20 trash"></span>
              삭제
            </v-btn>

            <div class="is-right">
              <v-btn
                class="pl-btn"
                :disabled="MENU_SAVE_BTN"
                @click="showAlert(MESSAGE.CONFIRM.STRG_MENU)"
              >
                메뉴 저장
              </v-btn>
            </div>
          </div>
        </div>
        <!-- right -->
        <div class=" is-vrt" >
          <div class="pl-card">
            <h2 class="pl-subtit">버튼 정보</h2>
            <!-- grid -->
            <div class="pl-grid-top">
              <div class="pl-grid-top-left"></div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter">전체 <em class="pl-1">({{ BTN_LIST.length }})</em> 건</span>
              </div>
            </div>
            <v-data-table
              v-model="CHC_BTN_LIST"
              class="pl-grid has-control type-hover-func"
              :headers="BTN_HEADER"
              :items="BTN_LIST"
              :item-class="isActiveRow"
              item-key="BTN_ID"
              fixed-header
              show-select
              height="250px"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              :page.sync="page"
              @page-count="pageCount = $event"
              @click:row="srch_btn"
              no-data-text="등록된 데이터가 없습니다."
            >
            </v-data-table>
          </div>
          <div class="pl-card is-noborder pt-0">
            <h2 class="pl-subtit">버튼 상세 정보</h2>
            <div class="pl-subdesc">
              <p>필수 항목을 입력하신 후 [저장] 버튼을 클릭하십시오.</p>
            </div>
            <v-form ref="form_btn">
            <div class="pl-form-inline-wrap vertical is-mt-m">
              <div class="pl-form-inline">
                <span class="pl-label">
                  메뉴 ID
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    disabled
                    v-model="MENU_ID"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  버튼 타입
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    :items="mixin_common_code_get(COMM_CD_DROP_LIST, 'BUTN_TP')"
                    v-model="BTN_TYPE"
                    placeholder="선택하세요"
                    :rules="validateRules.BTN_TYPE"
                    v-byte-counter="60"
                    :disabled="BTN_SAVE_BTN"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  버튼 ID
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    v-model="SCRN_BTN_ID"
                    :rules="validateRules.SCRN_BTN_ID"
                    v-byte-counter="40"
                    :disabled="BTN_SAVE_BTN"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  버튼 명
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    v-model="SCRN_BTN_NM"
                    :rules="validateRules.SCRN_BTN_NM"
                    v-byte-counter="100"
                    :disabled="BTN_SAVE_BTN"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  연동 레이아웃
                </span>
                <div class="pl-desc">
                  <v-select
                      class="pl-form"
                      :items="SELECT_BOX_LAYOUT_LIST"
                      v-model="SCRN_BTN_LAYOUT_ID"
                      placeholder="선택하세요"
                      :disabled="BTN_SAVE_BTN"
                  ></v-select>
                </div>
              </div>
            </div>
            </v-form>

          </div>
          <div
            v-if="$store.getters['userStore/GE_USER_ROLE'].userId == '1'"
            class="pl-card is-bottom">
            <v-btn
              class="pl-btn is-icon is-sub"
              :disabled="BTN_ADD_BTN"
              @click="initBtn('NEW')"
            >
              <span class="pl-icon20 circle-plus"></span>
              버튼 등록
            </v-btn>
            <v-btn
              class="pl-btn is-icon is-sub"
              :disabled="CHC_BTN_LIST.length != 0 ? false : true"
              @click="showAlert(MESSAGE.CONFIRM.DEL_BTN)"
             >
              <span class="pl-icon20 trash"></span>
              삭제
            </v-btn>

            <div class="is-right">
              <v-btn
                class="pl-btn"
                :disabled="BTN_SAVE_BTN"
                @click="showAlert(MESSAGE.CONFIRM.STRG_BTN)"
              >
              버튼 저장
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
  name: "MENU_STG_M0604", //name은 'MENU_' + 파일명 조합
  components: {
  },
  data() {
    return {
      //공통코드
      COMM_CD_USE_LIST:[],                //사용할 공통코드 리스트 ==> 변수명 이미 사용중이기 떄문에 변경해주었음 (COMM_CD_LIST->COMM_CD_USE_LIST)
      COMM_CD_DROP_LIST:[],               //공통코드로 생성된 드롭박스 리스트
      SELECT_BOX_LAYOUT_LIST: [],              // 사용가능한 연동 레이아웃목록 SELECT BOX

      //메뉴검색
      MENU_GROUP_DROP: [],               //메뉴검색 메뉴그룹
      MENU_GROUP:'',                     //선택 메뉴그룹
      //INDCT_YN_DROP: [],                 //메뉴검색 표시여부
      INDCT_YN: '',                      //선택 표시여부

      //tree
      expanded: false,
      MENU_TREE: [],            //메뉴 트리
      ACT_TREE_MENU:[],         //활성화된(클릭한) 트리
      ACT_TREE_LIST:[],         //활성화된 트리 리스트

      // 메뉴 상세정보
      MENU_ID:'',               //메뉴아이디
      UP_MENU_ID:'',            //상위메뉴 아이디
      MENU_SE_CD_LVL:'',        //메뉴레벨
      MENU_NM:'',               //메뉴명
      PATH_NM:'',               //메뉴 경로(VUE파일 경로)
      ICON_CLASS_NM:'',         //메뉴 아이콘
      //VIEW_TRGT_DROP: [],       //뷰타겟 드롭박스
      VIEW_TRGT: 'MAIN',        //뷰타겟
      //MENU_INDCT_YN_DROP: [],   //메뉴상세 표시여부 드롭박스
      MENU_INDCT_YN: 'Y',       //메뉴상세 표시여부
      ACT_NM:'',              //메뉴 액션명
      LAYOUT_ID:'',              //메뉴 액션명
      SORT_ORD:'',              //정렬순서
      SORT_MAX:'',              //정렬순서
      MENU_EXPLN:'',            //메뉴설명
      MENU_ADD_BTN:true,        //메뉴등록버튼 활성화 여부
      MENU_DEL_BTN:true,        //메뉴삭제버튼 활성화 여부
      MENU_SAVE_BTN:true,       //메뉴저장버튼 활성화 여부

      //버튼 정보
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
      BTN_HEADER: [
        { text: 'No', value: 'ROWNUM', align: 'center', width: '70px' },
        { text: '버튼ID', value: 'SCRN_BTN_ID', align: 'center', width: '80px' },
        { text: '버튼명', value: 'SCRN_BTN_NM', align: 'center', width: '100px' },
        { text: '버튼타입', value: 'BTN_TYPE_NM', align: 'center', width: '80px' },
        { text: '연동레이아웃', value: 'SCRN_BTN_LAYOUT_NM', align: 'center', width: '100px' },
        { text: '', value: 'SCRN_BTN_LAYOUT_ID', align:' d-none'}
      ],
      BTN_LIST: [],

      // 버튼상세정보
      //BTN_TYPE_DROP: [],        //버튼타입 드롭박스
      BTN_ID:'',              //버튼아이디
      BTN_TYPE:'INQU',          //버튼타입
      SCRN_BTN_ID:'',         //버튼 표기명
      SCRN_BTN_NM:'',         //버튼명
      SCRN_BTN_LAYOUT_ID:'',  //연동레이아웃
      SCRN_BTN_LAYOUT_NM:'',  //연동레이아웃
      BTN_ADD_BTN:true,       //버튼등록버튼 활성화 여부
      //BTN_DEL_BTN:true,     //버튼삭제버튼 활성화 여부
      BTN_SAVE_BTN:true,      //버튼저장버튼 활성화 여부
      CHC_BTN_LIST:[],        //버튼 다중선택 목록

      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
          DEL_MENU : { alertDialogToggle: true, msg: '상위메뉴를 삭제하면<br>하위 메뉴도 모두 삭제됩니다<br>메뉴를 삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.del_menu, callNo: this.delNo, }
          , STRG_MENU : { alertDialogToggle: true, msg: '메뉴를 저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.strg_menu, callNo: this.delNo, }
          , DEL_BTN : { alertDialogToggle: true, msg: '버튼을 삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.del_btn, callNo: this.delNo, }
          , STRG_BTN : { alertDialogToggle: true, msg: '버튼을 저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.strg_btn, callNo: this.delNo, }
        },
        ALERT : {
          REG_MENU_SUCCESS : { alertDialogToggle: true, msg: '메뉴가 저장되었습니다', iconClass: 'is-done', type: 'default' }
          , DEL_MENU_SUCCESS : { alertDialogToggle: true, msg: '메뉴가 삭제되었습니다', iconClass: 'is-done', type: 'default' }
          , REG_BTN_SUCCESS : { alertDialogToggle: true, msg: '버튼이 저장되었습니다', iconClass: 'is-done', type: 'default' }
          , DEL_BTN_SUCCESS : { alertDialogToggle: true, msg: '버튼이 삭제되었습니다', iconClass: 'is-done', type: 'default' }
          , VALID : {alertDialogToggle: true, msg: '필수항목 확인 후<br>재시도 해주세요', iconClass: 'is-info', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST : {
          REG_MENU_SUCCESS : {  msg: '메뉴가 저장되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          , DEL_MENU_SUCCESS :{  msg: '메뉴가 삭제되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          , REG_BTN_SUCCESS : {  msg: '버튼이 저장되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          , DEL_BTN_SUCCESS : {  msg: '버튼이 삭제되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        },
      },

      //필수값 체크
      valid : true,
      validateRules: {
        MENU_NM: [
          v => !!v || '메뉴 명 은(는) 필수 입력 항목입니다.',
        ],
        VIEW_TRGT: [
          v => !!v || '뷰 타겟 은(는) 필수 입력 항목 입니다.',
        ],
        MENU_INDCT_YN: [
          v => !!v || '표시 여부 은(는) 필수 입력 항목 입니다.',
        ],
        MENU_EXPLN: [
          v => !!v || '메뉴 설명 은(는) 필수 입력 항목 입니다.',
        ],
        BTN_TYPE: [
          v => !!v || '버튼 타입 은(는) 필수 입력 항목 입니다.',
        ],
        SCRN_BTN_ID: [
          v => !!v || '버튼 ID 은(는) 필수 입력 항목 입니다.',
        ],
        SCRN_BTN_NM: [
          v => !!v || '버튼 명 은(는) 필수 입력 항목 입니다.',
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
      "SHOW_WT"     //표시여부
      , "VIEW_TG"   //뷰타겟
      , "BUTN_TP"   //버튼타입
    ];
    //공통코드별 드롭박스 만들기
    this.COMM_CD_DROP_LIST = await this.mixin_common_code_get_all(this.COMM_CD_USE_LIST);
    //사용가능한 연동 레이아웃
    this.SELECT_BOX_LAYOUT_LIST = await this.selectBoxLayout("선택안함");
    //필요한 공통코드 드롭박스 생성
    //this.INDCT_YN_DROP = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, 'SHOW_WT',"전체");
    //this.VIEW_TRGT_DROP = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, 'VIEW_TG');
    //this.MENU_INDCT_YN_DROP = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, 'SHOW_WT');
    //this.BTN_TYPE_DROP = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, 'BUTN_TP');

    this.srch_menu_group();
    this.srch_menu_tree();

  },

  async mounted() {
  },

  methods: {
    //메뉴그룹 조회
    async srch_menu_group(){
      let sUrl = '/api/setting/system/menu-manage/group/inqire';
      let postParam = {
      }
      let headParam = {
        head: {
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

    //메뉴트리 검색
    async srch_menu_tree(){
      let sUrl = '/api/setting/system/menu-manage/tr/inqire';
      let postParam = {
        MENU_GROUP: this.MENU_GROUP == "" || this.MENU_GROUP == "LEFT" || this.MENU_GROUP == "RIGHT" || this.MENU_GROUP == "DEV" ? '' : this.MENU_GROUP,
        VIEW_TRGT: this.MENU_GROUP == "" || this.MENU_GROUP == "LEFT" || this.MENU_GROUP == "RIGHT" || this.MENU_GROUP == "DEV" ? this.MENU_GROUP : 'MAIN',
        USE_YN : this.INDCT_YN,
      }
      let headParam = {
        head: {
          SERVICE : "setting.system.menu-manage.tr",
          METHOD : "inqire",
          ASYNC : false,
          TYPE : "BIZ_SERVICE",
          //IS_ARRAY : true,
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.MENU_TREE = [];          //메뉴트리 초기화
        this.MENU_TREE = resData.MENU_TREE
        let leftNum = 0;              //좌측메뉴 순서
        let rightNum = 0;             //좌측메뉴 순서
        if(this.MENU_GROUP == ''){
          this.MENU_TREE.unshift({id:"LEFT",name:"좌측메뉴",children:[]})     //좌측메뉴 항목 생성
          this.MENU_TREE.unshift({id:"RIGHT",name:"우측메뉴",children:[]})    //우측메뉴 항목 생성
          leftNum = 1;
          rightNum = 0;
        } else if(this.MENU_GROUP == 'LEFT'){
          this.MENU_TREE.unshift({id:"LEFT",name:"좌측메뉴",children:[]})     //좌측메뉴 항목 생성
          leftNum = 0;
        } else if(this.MENU_GROUP == 'RIGHT'){
          this.MENU_TREE.unshift({id:"RIGHT",name:"우측메뉴",children:[]})    //우측메뉴 항목 생성
          rightNum = 0;
        }
        let leng = this.MENU_TREE.length;
        for(let i=1;i<leng;i++){
          if(this.MENU_TREE[i]["VIEW_TRGT"] == "RIGHT"){
            this.MENU_TREE[rightNum]["children"].push(this.MENU_TREE[i])
            delete this.MENU_TREE[i];
          } else if(this.MENU_TREE[i]["VIEW_TRGT"] == "LEFT") {
            this.MENU_TREE[leftNum]["children"].push(this.MENU_TREE[i])
            delete this.MENU_TREE[i];
          }
        }

        if(this.MENU_ID ==''){
          this.MENU_ID = this.MENU_TREE[0].id;
        }
      }
    },

    expandAll(id){
      this.expanded = true;
      let nowActive = []  //현재 클릭한 메뉴
      nowActive[0] = this.MENU_ID;

      this.$refs[id].updateAll(true);   //update:open이벤트를 실행

      this.ACT_TREE_MENU = nowActive;
      this.MENU_ID = this.ACT_TREE_MENU[0];
    },
    collapseAll(id){
      this.expanded = false;
      this.$refs[id].updateAll(false); //update:open이벤트를 실행
    },

    //트리메뉴 클릭
    //최하위 메뉴 클릭 시 이벤트
    srch_tree_act(node){
      this.initBtn('NEW');
      let activeItem = []
      let leng = node.length
      if(leng != 0){
        this.MENU_ID = node[leng-1]
      } else {  //같은메뉴를 클릭했을 때
        activeItem[0] = this.MENU_ID
        this.ACT_TREE_MENU = activeItem;
      }

      if(this.MENU_ID != "LEFT" && this.MENU_ID != "RIGHT"){
        this.srch_menu();
        this.srch_menu_btn();
      } else {
        this.initMenu();
      }
    },
    //트리메뉴 활성화(폴더열기)
    //열린폴더 리스트가 node에 들어옴
    //폴더를 닫았을 때에는 node에 해당 폴더 정보가 없기때문에 ACT_TREE_LIST기준으로 가져옴
    srch_tree_open(node){
      this.initBtn('NEW');
      let nodeLeng = node.length  //현재 활성화된 폴더
      let nowActive = []    //현재 클릭한 메뉴
      //전체 접기 버튼을 클릭했을 때
      if(nodeLeng == 0 && (this.MENU_ID == '' || this.MENU_ID == null || this.MENU_ID == undefined) ){
        // if(this.ACT_TREE_MENU.length != 0){
        //   this.ACT_TREE_MENU.pop()
        // }
        this.ACT_TREE_LIST = [];
        return;
      } else if(nodeLeng == 0 && (this.MENU_ID != '' && this.MENU_ID != null && this.MENU_ID != undefined) ){
        // if(this.ACT_TREE_MENU.length != 0){
        //   this.ACT_TREE_MENU.pop()
        // }
        this.ACT_TREE_LIST = [];
        return;
      }
      let actLeng = this.ACT_TREE_LIST.length //클릭하기 전 활성화된 폴더
      if(actLeng > nodeLeng){ //node에는 클릭한 순서대로 들어가기때문에 지금 클릭한 폴더를 구분해야함
        //배열을 크기순으로 나열하여 값 비교
        this.ACT_TREE_LIST.sort();
        node.sort();
        for(let i=0;i<actLeng;i++){
          if(this.ACT_TREE_LIST[i] != node[i]){
            nowActive[0] = this.ACT_TREE_LIST[i]
            break
          }
        }
      } else {  //폴더를 열었을 때
        nowActive[0] = node[nodeLeng-1]
      }
      this.MENU_ID = nowActive[0];
      this.ACT_TREE_MENU = nowActive;
      this.ACT_TREE_LIST = node;

      if(this.MENU_ID != "LEFT" && this.MENU_ID != "RIGHT"){
        this.srch_menu();
        this.srch_menu_btn();
      } else {
        this.MENU_ADD_BTN=false;
        this.MENU_DEL_BTN=true;
        this.MENU_SAVE_BTN=true;
      }
    },

    //메뉴 상세정보 검색
    async srch_menu(){
      let sUrl = '/api/setting/system/menu-manage/inqire';
      let postParam = {
        MENU_ID: this.MENU_ID,
      }
      let headParam = {
        head: {
          SERVICE : "setting.system.menu-manage",
          METHOD : "inqire",
          ASYNC : "alse",
          TYPE : "BIZ_SERVICE",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.UP_MENU_ID = resData.DATA[0].UP_MENU_ID;
        this.MENU_SE_CD_LVL = resData.DATA[0].MENU_SE_CD_LVL
        this.MENU_NM = resData.DATA[0].MENU_NM;
        this.ICON_CLASS_NM = resData.DATA[0].ICON_CLASS_NM;
        this.PATH_NM = resData.DATA[0].PATH_NM;
        this.VIEW_TRGT = resData.DATA[0].VIEW_TRGT;
        this.MENU_INDCT_YN = resData.DATA[0].USE_YN;
        this.SORT_ORD = resData.DATA[0].SORT_ORD;
        this.SORT_MAX = resData.DATA[0].SORT_MAX
        this.MENU_EXPLN = resData.DATA[0].MENU_EXPLN;
        this.ACT_NM = resData.DATA[0].ACT_NM;
        this.LAYOUT_ID = resData.DATA[0].LAYOUT_ID;

        if(parseInt(this.MENU_SE_CD_LVL)<3){
          this.MENU_ADD_BTN=false;
        } else {
          this.MENU_ADD_BTN=true;
        }
        this.MENU_DEL_BTN=false;
        this.MENU_SAVE_BTN=false;

        this.BTN_ADD_BTN=false;
        //this.BTN_DEL_BTN=true;
        this.BTN_SAVE_BTN=true;
      }
    },

    //메뉴 버튼정보 검색
    async srch_menu_btn(){
      let sUrl = '/api/setting/system/menu-manage/button/inqire';
      let postParam = {
        MENU_ID: this.MENU_ID,
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
        this.BTN_LIST = resData.DATA;
        this.BTN_ADD_BTN=false;
        //this.BTN_DEL_BTN=true;
        this.BTN_SAVE_BTN=true;
      }
    },

    //버튼 검색 (버튼 리스트 클릭)
    srch_btn(item){
      this.BTN_ID = item.BTN_ID;
      this.BTN_TYPE = item.BTN_TYPE;
      this.SCRN_BTN_ID = item.SCRN_BTN_ID;
      this.SCRN_BTN_NM = item.SCRN_BTN_NM;
      this.SCRN_BTN_LAYOUT_NM = item.SCRN_BTN_LAYOUT_NM;
      this.SCRN_BTN_LAYOUT_ID = item.SCRN_BTN_LAYOUT_ID;

      this.BTN_ADD_BTN=false;
      //this.BTN_DEL_BTN=false;
      this.BTN_SAVE_BTN=false;
    },

    //메뉴정보 초기화
    initMenu(type){
      if(type == 'NEW_GROUP'){                  //그룹생성 클릭시
        this.MENU_ADD_BTN=true;
        this.MENU_DEL_BTN=true;
        this.MENU_SAVE_BTN=false;

        this.MENU_ID = '';
        this.UP_MENU_ID = '';
      } else if(type == 'NEW_MENU'){                   //메뉴생성 클릭시
        this.MENU_ADD_BTN=true;
        this.MENU_DEL_BTN=true;
        this.MENU_SAVE_BTN=false;

        this.UP_MENU_ID = this.MENU_ID;
        this.MENU_ID = '';
      } else if(type=='DEL'){
        this.MENU_ADD_BTN=true;
        this.MENU_DEL_BTN=true;
        this.MENU_SAVE_BTN=true;

        this.MENU_ID = '';
        this.UP_MENU_ID = '';
      }
      this.MENU_SE_CD_LVL = '';
      this.MENU_NM = '';
      this.PATH_NM = '';
      this.ICON_CLASS_NM = '';
      this.VIEW_TRGT = 'MAIN';
      this.MENU_INDCT_YN = 'Y';
      this.SORT_ORD = '';
      this.SORT_MAX = '';
      this.MENU_EXPLN = '';
      this.ACT_NM = '';
      this.LAYOUT_ID = '';
    },

    //메뉴 순서 변경
    async chg_ord(type){
      let sUrl = '/api/setting/system/menu-manage/change-order/regist';
      let postParam = {
        MENU_ID: this.MENU_ID,
        UP_MENU_ID: this.UP_MENU_ID,
        CHANGE: type,     //+또는-
        SORT_ORD: this.SORT_ORD,
      }
      let headParam = {
        head: {
          SERVICE : "setting.system.menu-manage.change-order",
          METHOD : "regist",
          ASYNC : false,
          TYPE : "BIZ_SERVICE",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        if(type == '+'){
          this.SORT_ORD = parseInt(this.SORT_ORD) + 1;
        } else if(type == '-'){
          this.SORT_ORD = parseInt(this.SORT_ORD) - 1;
        }
        this.srch_menu_tree();
      }
    },

    //메뉴저장
    //1. 메뉴id 있을때 : 메뉴 수정
    //2. 메뉴id 없고 상위메뉴id 있을때 : 메뉴 삽입
    //3. 메뉴id 없고 상위메뉴id 없을때 : 최상위 메뉴 삽입
    async strg_menu(){
      if (!this.validateMenu()) {
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }
      let sUrl = '/api/setting/system/menu-manage/regist';
      let postParam = {
        MENU_ID: this.MENU_ID,
        UP_MENU_ID: this.UP_MENU_ID,
        MENU_NM: this.MENU_NM,
        ICON_CLASS_NM: this.ICON_CLASS_NM,
        PATH_NM: this.PATH_NM,
        VIEW_TRGT: this.VIEW_TRGT,
        USE_YN: this.MENU_INDCT_YN,
        SORT_ORD: this.SORT_ORD,
        MENU_EXPLN: this.MENU_EXPLN,
        ACT_NM: this.ACT_NM,
        LAYOUT_ID: this.LAYOUT_ID,
      }
      let headParam = {
        head: {
          SERVICE : "setting.system.menu-manage.",
          METHOD : "regist",
          ASYNC : false,
          TYPE : "BIZ_SERVICE",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        // this.showAlert(this.MESSAGE.ALERT.REG_MENU_SUCCESS)
        this.showToast(this.MESSAGE.TOAST.REG_MENU_SUCCESS)
        this.MENU_ID = resData.DATA[0].MENU_ID    //추가,수정 된 메뉴 id
        this.srch_menu_tree();
        this.srch_menu();
        this.srch_menu_btn();
      }
    },

    //메뉴 삭제
    async del_menu(){
      let sUrl = '/api/setting/system/menu-manage/delete';
      let postParam = {
        MENU_ID: this.MENU_ID,
        MENU_SE_CD_LVL: this.MENU_SE_CD_LVL,
      }
      let headParam = {
        head: {
          SERVICE : "setting.system.menu-manage",
          METHOD : "delete",
          ASYNC : false,
          TYPE : "BIZ_SERVICE",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        // this.showAlert(this.MESSAGE.ALERT.DEL_MENU_SUCCESS)
        this.showToast(this.MESSAGE.TOAST.DEL_MENU_SUCCESS)
        this.srch_menu_tree();
        this.initMenu('DEL');
      }
    },

    //버튼 저장
    async strg_btn(){
      if (!this.validateBtn()) {
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }
      let sUrl = '/api/setting/system/menu-manage/button/regist';
      let postParam = {
        MENU_ID: this.MENU_ID,
        BTN_ID: this.BTN_ID,
        BTN_TYPE: this.BTN_TYPE,
        SCRN_BTN_ID: this.SCRN_BTN_ID,
        SCRN_BTN_NM: this.SCRN_BTN_NM,
        LAYOUT_ID: this.SCRN_BTN_LAYOUT_ID
      }
      let headParam = {
        head: {
          SERVICE : "setting.system.menu-manage/button",
          METHOD : "regist",
          ASYNC : false,
          TYPE : "BIZ_SERVICE",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
          this.$store.commit("alertStore/hideAlert");
          // this.showAlert(this.MESSAGE.ALERT.REG_BTN_SUCCESS)
          this.showToast(this.MESSAGE.TOAST.REG_BTN_SUCCESS)
          this.srch_menu_btn();
      }
    },

    //버튼정보 초기화
    initBtn(type){
      this.CHC_BTN_LIST = [];
      this.BTN_ID='';
      this.BTN_TYPE='INQU';
      this.SCRN_BTN_ID='';
      this.SCRN_BTN_NM='';
      this.SCRN_BTN_LAYOUT_ID='';
      this.SCRN_BTN_LAYOUT_NM='';

      if(type == 'NEW'){
        this.BTN_ADD_BTN=true;
      }else {
        this.BTN_ADD_BTN=false;
      }
      //this.BTN_DEL_BTN=true;
      this.BTN_SAVE_BTN=false;
    },
    //row클릭 색상변경
    isActiveRow(item){
      return item.BTN_ID== this.BTN_ID? 'active':'';
    },

    //버튼 삭제
    async del_btn(){
      let arrBtnId = []
      let leng = this.CHC_BTN_LIST.length
      for(let i=0;i<leng;i++){
        arrBtnId[i] = this.CHC_BTN_LIST[i].BTN_ID;
      }
      let sUrl = '/api/setting/system/menu-manage/button/delete';
      let postParam = {
        arrBtnId: arrBtnId,
      }
      let headParam = {
        head: {
          SERVICE : "setting.system.menu-manage.button",
          METHOD : "delete",
          ASYNC : false,
          TYPE : "BIZ_SERVICE",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        // this.showAlert(this.MESSAGE.ALERT.DEL_BTN_SUCCESS)
        this.showToast(this.MESSAGE.TOAST.DEL_BTN_SUCCESS)
        this.initBtn('NEW')
        this.srch_menu_btn();
      }
    },

    //확인창 취소버튼
    delNo() {
      this.$store.commit("alertStore/hideAlert");
    },

    //메뉴필수값 체크
    validateMenu () {
      return this.$refs.form_menu.validate();
    },

    //버튼필수값 체크
    validateBtn () {
      return this.$refs.form_btn.validate();
    },
    async selectBoxLayout(strHeadText) {  //연동데이터소스 combobox용도
      let responseData = [];
      if (strHeadText != "" && strHeadText != undefined) {
        responseData.push({text: strHeadText, value: ""});
      }
      let resData = await this.common_postCall("/api/setting/system/menu-manage/selectLkagLayoutList", {}, {});
      if(!resData.HEADER.ERROR_FLAG){
          for (let i in resData.DATA) {
            let prcsData = {...resData.DATA[i]}
            prcsData.text = resData.DATA[i].LAYOUT_NM;
            prcsData.value = resData.DATA[i].LAYOUT_ID;
            responseData.push(prcsData);
          }
          return responseData;
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>