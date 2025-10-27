<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols" style="height: 100%">
        <!-- 드래그 리스트 -->
        <div class="is-col-fix is-vrt" style="width: 820px">
          <div class="pl-card" style="overflow: auto; height: 685px;">
            <div class="pl-drag-list">
              <div class="pl-drag-list-top">
                <p>전체 <strong>({{ DRAG_LIST.length }})</strong>개의 상담 정보 항목이 있습니다.</p>
              </div>
              <div class="pl-drag-list-content">
                <draggable
                  ghost-class="ghost"
                  v-model="DRAG_LIST"
                  @start="onDragStart"
                  @end="onDragEnd"
                >
                  <div
                    v-for="item in DRAG_LIST"
                    :key="item.id"
                    @click="getExpsnAttrDetailInfo(item)"
                    class="pl-drag-list-unit"
                    :class="item.selected ? 'active' : ''"
                  >
                    <v-icon class="pl-icon20" :class="`parts-${item.type}`"></v-icon>
                    <span class="pl-drag-list-title">{{ item.EXPSN_ATTR_NM }}</span>
                    <span :class="item.SYS_BSC_YN === 'N' ? 'is-txt-main' : ''">{{ displayOwner(item.SYS_BSC_YN) }} </span>
                    <span v-show="item.USE_YN === 'N'" class="pl-1 is-txt-error"> - {{ displayDisabled(item.USE_YN) }}</span>
                    <!-- 보안항목 아이콘 -->
                    <v-icon v-if="item.INDI_INFO_ENCPT_YN === 'Y'" class="pl-icon20 main-terms ml-1"></v-icon>
                    <div class="is-right">
                      <v-icon
                        v-if="item.SYS_BSC_YN === 'Y'"
                        class="pl-icon20"
                        :class="displayLock(item.MDFCN_PSBLTY_YN)"></v-icon>
                      <template v-else>
                        <!-- 수정 버튼 -->
                        <!-- <compo-tooltip-btn
                          TitleProp="수정"
                          ClassProp="pl-tooltip-btn"
                          IconProp="pl-icon20 edit"
                          TooltipPositionProp="bottom"
                          @btnClick="mixin_testLog('수정')"
                        ></compo-tooltip-btn> -->
                        <!-- 삭제 버튼 -->
                        <compo-tooltip-btn
                          TitleProp="삭제"
                          ClassProp="pl-tooltip-btn"
                          IconProp="pl-icon20 trash"
                          TooltipPositionProp="bottom"
                          @btnClick="showAlert(MESSAGE.CONFIRM.EXPSN_DEL)"
                        ></compo-tooltip-btn>
                      </template>
                    </div>
                  </div>
                </draggable>
              </div>

            </div>
          </div>
          <div class="pl-card is-bottom">
            <div class="is-right">
              <v-btn class="pl-btn is-sub" @click="addDragItem">항목추가</v-btn>
            </div>
          </div>

        </div>
        <!-- 상세정보 입력 -->
        <div class="is-vrt">
          <div class="pl-card">
            <h2 class="pl-subtit">고객 정보 항목 상세 정보</h2>
            <div class="pl-subdesc">
              <p>시스템 기본항목의 경우 “항목명, 항목 ID, 속성, 길이”는 변경할 수 없습니다.<br>
                시스템 기본 항목 중 자물쇠 모양으로 잠겨 있는 항목은 무조건 필수 항목입니다.
              </p>
            </div>
          </div>
          <div class="pl-card is-noborder pt-0" style="overflow: auto; height: 590px;">
            <div class="pl-card-form-body">
              <v-form ref="detailForm">
                <div class="pl-form-inline-wrap vertical">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      항목 명
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form flex-grow-1"
                        v-model="DTL_EXPSN_ATTR_NM"
                        v-bind:disabled="isDisabled"
                        :rules="deatilValidateRules.EXPSN_ATTR_NM"
                        v-byte-counter="100"
                      />
                      <div>
                        <!-- 상세 버튼 -->
                        <compo-tooltip-btn
                          v-if="this.DTL_SYS_BSC_YN === 'N'"
                          TitleProp="상세"
                          ClassProp="pl-tooltip-btn"
                          IconProp="pl-icon20 detail"
                          TooltipPositionProp="bottom"
                          @btnClick="dropFindParts = true"
                        ></compo-tooltip-btn>
                        <!-- 상세 모달 -->
                        <v-slide-y-transition>
                          <div class="pl-drop-layer is-right" v-if="dropFindParts === true" v-click-outside="closeDropFindParts">
                            <div class="pl-drop-layer-body">
                              <ul class="pl-drop-layer-list">
                                <li @click="expsnAttrFind(true)">
                                  <v-icon class="pl-icon20 in-search mr-2"></v-icon>
                                  항목명 찾기</li>
                                  <li @click="expsnAttrFind(false)">
                                  <v-icon class="pl-icon20 edit mr-2"></v-icon>
                                  직접 입력</li>
                              </ul>
                            </div>
                          </div>
                        </v-slide-y-transition>
                        <!-- 확장 항목 찾기 모달 -->
                        <v-dialog
                          v-model="dialogFindParts"
                          content-class="dialog-draggable is-lg is-nopadding"
                          hide-overlay>
                          <div class="draggable-area">drag area</div>
                          <compo-dialog
                            header-title="확장 항목 찾기"
                            @hide="mixin_hideDialog('FindParts')"
                          >
                            <template slot="body">
                              <!-- component -->
                              <compo-find-parts
                                :SearchInputProp.sync="SCH_SE"
                                :exceptionList="DRAG_LIST"
                                @selected-expsnAttr="setExpsnAttrItem"
                              />
                            </template>
                          </compo-dialog>
                        </v-dialog>
                      </div>
                      <p class="pl-form-hint">한글과 영문을 혼합하여 사용할 수 있습니다.<br>
                        상담직원 콘솔에 노출되는 항목 명입니다. 의미 있는 명칭을 사용해 주세요.</p>
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      항목 ID
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form "
                        v-model="DTL_EXPSN_ATTR_COL_ID"
                        :disabled="DTL_SYS_BSC_YN ==='Y' || isAttrDisabled?true:false"
                        :rules="deatilValidateRules.EXPSN_ATTR_COL_ID"
                        oninput="javascript: this.value = this.value.replace(/[^a-zA-Z0-9._-\s]/g,'').replace(/\s/g, '_');"
                        v-byte-counter="60"
                      />
                      <v-btn
                        v-if="DTL_SYS_BSC_YN ==='N' && !isAttrDisabled?true:false"
                        class="pl-btn is-sub flex-grow-0"
                        @click="attrColIdDupleChk"
                      >중복체크
                      </v-btn>
                      <p class="pl-form-hint">시스템 기본 항목 또는 직접 지정하여 사용할 수 있습니다.(영문자만 사용 가능)</p>
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      속성
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-select
                        class="pl-form"
                        :items="mixin_common_code_get(this.common_code, 'EXPN_PT')"
                        v-model="DTL_DATA_TYPE_CD"
                        :disabled="DTL_SYS_BSC_YN ==='Y' || isAttrDisabled?true:false || DTL_ATTR_ID?true:false"
                        @change="dataTypeChange"
                        placeholder="선택하세요"
                        :rules="deatilValidateRules.DATA_TYPE_CD"
                      ></v-select>
                      <p class="pl-form-hint">시스템 기본 항목을 지정한 경우 자동으로 설정됩니다.</p>
                      <template v-if="DTL_DATA_TYPE_CD === 'COE' || DTL_DATA_TYPE_CD === 'COE_MULTI'">
                        <v-text-field
                          class="pl-form flex-grow-0 is-lg"
                          value="coomon code 찾은거"
                          disabled
                          v-model="DTL_GROUP_CD_NM"
                        />
                        <!-- 코드 검색 버튼 -->
                        <compo-tooltip-btn
                          v-if="!DTL_ATTR_ID"
                          TitleProp="코드 검색"
                          ClassProp="pl-tooltip-btn flex-grow-0"
                          IconProp="pl-icon20 find-code"
                          TooltipPositionProp="bottom"
                          @btnClick="mixin_showDialog('FindIndex')"
                        ></compo-tooltip-btn>
                        <!-- 공통코드 찾기 모달 -->
                        <v-dialog
                          v-model="dialogFindIndex"
                          content-class="dialog-draggable is-lg is-nopadding"
                          hide-overlay>
                          <div class="draggable-area">drag area</div>
                          <compo-dialog
                            header-title="공통코드 찾기"
                            @hide="mixin_hideDialog('FindIndex')"
                          >
                            <template slot="body">
                              <!-- component -->
                              <compo-find-Index
                                @fidnBtn="mixin_testLog('공통 코드 찾기 버튼')"
                                @selected-commCd="setCommCdItem"
                              />
                            </template>
                          </compo-dialog>
                        </v-dialog>
                      </template>
                      <!--문자형,숫자형(일반),우편번호 인 경우 암호화 대상 지정 기능-->
                      <template v-if="DTL_DATA_TYPE_CD === 'TXT' || DTL_DATA_TYPE_CD === 'NUM' || DTL_DATA_TYPE_CD === 'POST'">
                        <v-checkbox
                          v-model="DTL_INDI_INFO_ENCPT_YN"
                          class="pl-check"
                          :disabled="DTL_ATTR_ID?true:false"
                          label="개인정보 암호화 처리"
                          @change="changeGridView"
                        ></v-checkbox>
                        <p class="pl-form-hint is-txt-error">
                          개인정보 안전성 확보를 위해 현재 항목은 암호화하여 저장되며, 개인정보 암호화 처리된 항목은 재변경할 수 없습니다.<br>
                          또한, 개인정보 암호화 처리로 조회 속도가 느려질 수 있습니다.
                        </p>
                      </template>
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      항목 길이
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form"
                        v-model="DTL_DATA_LEN"
                        :disabled="DTL_SYS_BSC_YN ==='Y' || isAttrDisabled || isDataLenDisabled?true:false"
                        :rules="deatilValidateRules.DATA_LEN"
                        hide-spin-buttons
                        type="number"
                        oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                        v-byte-counter="4"
                      ></v-text-field>
                      <p class="pl-form-hint">시스템 기본 항목을 지정한 경우 자동으로 설정됩니다.</p>
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      필수 여부
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-select
                        class="pl-form"
                        :items="mixin_common_code_get(this.common_code, 'REQR_WT')"
                        v-model="DTL_ESNTL_YN"
                        :disabled="DTL_MDFCN_PSBLTY_YN ==='N'?true:false"
                        placeholder="선택하세요"
                        :rules="deatilValidateRules.ESNTL_YN"
                      ></v-select>
                      <p class="pl-form-hint">상담화면에서 고객 정보 입력 또는 수정 시 필수 입력 여부를 설정할 수 있습니다.</p>
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
                        :items="mixin_common_code_get(this.common_code, 'USE_WT')"
                        v-model="DTL_USE_YN"
                        :disabled="DTL_MDFCN_PSBLTY_YN ==='N'?true:false"
                        placeholder="선택하세요"
                        :rules="deatilValidateRules.USE_YN"
                      ></v-select>
                      <p class="pl-form-hint">해당 항목을 사용하거나 사용하지 않도록 설정합니다.</p>
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      목록 표시 여부
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <template v-if="this.DTL_INDI_INFO_ENCPT_YN">
                        <p class="pl-form-hint">개인정보 안전성 확보를 위해 암호화된 항목은 조회 화면에 표시되지 않습니다.</p>
                      </template>
                      <template v-else>
                        <v-select
                          class="pl-form"
                          :items="mixin_common_code_get(this.common_code, 'USE_WT')"
                          v-model="DTL_SCRN_EXPSR_YN"
                          :disabled="DTL_MDFCN_PSBLTY_YN ==='N'?true:false"
                          placeholder="선택하세요"
                          :rules="deatilValidateRules.SCRN_EXPSR_YN"
                        ></v-select>
                        <p class="pl-form-hint">목록 헤더 노출 여부를 사용하거나 사용하지 않도록 설정합니다.</p>
                      </template>
                    </div>
                  </div>
                  <div class="pl-form-inline" v-if="(DTL_DATA_TYPE_CD === 'COE' || DTL_DATA_TYPE_CD === 'COE_MULTI' || (!DTL_INDI_INFO_ENCPT_YN && DTL_DATA_TYPE_CD === 'TXT')) && DTL_EXPSN_ATTR_COL_ID !== 'CUST_STAT'">
                    <span class="pl-label">
                      검색 설정 여부
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-select
                        class="pl-form"
                        :items="mixin_common_code_get(this.common_code, 'USE_WT')"
                        v-model="DTL_SRCH_STNG_YN"
                        placeholder="선택하세요"
                        :rules="deatilValidateRules.SRCH_STNG_YN"
                        @change="chkSchCnt"
                      ></v-select>
                      <p class="pl-form-hint">고객 정보 관리 메뉴와 전화상담 이력 조회 메뉴의 고객 검색 옵션을 설정 합니다.</p>
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      순서
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        v-if="DTL_SORT_ORD > 0"
                        class="pl-form"
                        v-model="DTL_SORT_ORD"
                        :readonly=true
                        v-byte-counter="4"
                      />
                    </div>
                  </div>
                </div>
              </v-form>
            </div>
          </div>
          <div class="pl-card is-bottom">
            <div class="is-right">
              <v-btn
                class="pl-btn"
                :disabled="DTL_SYS_BSC_YN ==='Y' && DTL_MDFCN_PSBLTY_YN === 'N'?true:false"
                @click="expsnAttrValidate"
              >저장</v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
name:"MENU_STG_M0401", //name은 'MENU_' + 파일명 조합
components: {
},
data() {
   return {
    common_code: [],
    // drop
    dropFindParts: false,

    // drag list
    DRAG_LIST : [],

    deatilValidateRules: {
      EXPSN_ATTR_NM: [
        v => !!v || '항목명 은(는) 필수 입력 항목 입니다.',
      ],
      EXPSN_ATTR_COL_ID: [
        v => !!v || '항목ID 은(는) 필수 입력 항목 입니다.',
      ],
      DATA_TYPE_CD: [
        v => !!v || '속성 은(는) 필수 입력 항목 입니다.',
      ],
      DATA_LEN :[
        v => !!v || '길이 은(는) 필수 입력 항목 입니다.',
        v => /[0-9]/.test(v) || '숫자만 입력 가능합니다.',
        v => (v >= 0 && v < 4001 ) || '0 ~ 4000 이내로 입력해 주세요.',
      ],
      ESNTL_YN: [
        v => !!v || '필수여부 은(는) 필수 입력 항목 입니다.',
      ],
      USE_YN: [
        v => !!v || '사용여부 은(는) 필수 입력 항목 입니다.',
      ],
      SCRN_EXPSR_YN: [
        v => !!v || '그리드 노출 여부 은(는) 필수 입력 항목 입니다.',
      ],
      SRCH_STNG_YN: [
        v => !!v || '검색 설정 여부 은(는) 필수 입력 항목 입니다.',
      ],
    },

    //confirm alert 메시지
    MESSAGE : {
      CONFIRM : {
        EXPSN_REG : {alertDialogToggle: true, msg: '내용을 저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.expsnAttrSave, callNo: this.closeMsg}
        , EXPSN_DEL : {alertDialogToggle: true, msg: '선택된 항목을 삭제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.expsnAttrDel, callNo: this.closeMsg}
      },
      ALERT : {
        SUCCESS : {alertDialogToggle: true, msg: '정상 처리 되었습니다.', iconClass: 'is-done', type: 'default'}
        , ATTR_COL_ID_EMPTY_CHECK : {alertDialogToggle: true, msg: '항목 ID를 입력해 주세요.', iconClass: 'is-caution', type: 'default'}
        , ATTR_COL_ID_DUPLE_CHECK : {alertDialogToggle: true, msg: '항목 ID에 대해 중복체크를 진행해 주세요.', iconClass: 'is-caution', type: 'default'}
        , ATTR_COL_ID_DUPLE_TRUE : {alertDialogToggle: true, msg: '사용중인 항목 ID 입니다.', iconClass: 'is-caution', type: 'default'}
        , ATTR_COL_ID_DUPLE_FAIL : {alertDialogToggle: true, msg: '사용 가능한 항목 ID 입니다.', iconClass: 'is-info', type: 'default'}
        , SCH_STNG_CNT_OVER : {alertDialogToggle: true, msg: '검색 설정으로 가능한 항목 개수는 5개 입니다.', iconClass: 'is-info', type: 'default'}
      },
      ERROR : {
        ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
      },
      TOAST : {
        SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
      },
    },

    //상담내용 항목 상세 정보
    DTL_ATTR_ID : '',
    DTL_LNKG_ATTR_ID : '',
    DTL_EXPSN_ATTR_NM : '',
    DTL_EXPSN_ATTR_COL_ID : '',
    DTL_GROUP_CD_ID : '',
    DTL_GROUP_CD_NM : '',
    DTL_DATA_TYPE_CD : '',
    DTL_DATA_LEN : '',
    DTL_SYS_BSC_YN : 'N',
    DTL_INDI_INFO_ENCPT_YN : false,
    DTL_MDFCN_PSBLTY_YN : 'Y',
    DTL_ESNTL_YN : '',
    DTL_USE_YN : '',
    DTL_SCRN_EXPSR_YN : '',
    DTL_SRCH_STNG_YN : '',
    DTL_SORT_ORD : 0,

    SCH_ATTR_CNT : 0, //검색 항목 개수

    isDisabled: true, //항목명 disabled 처리
    isAttrDisabled:false,
    isDataTpDisabled:false,
    isDataLenDisabled:false,

    SCH_SE : 'CUSTOM', //고객정보 확장항목만 찾기위해
    dialogFindParts: '', //확장항목 찾기
    dialogFindIndex: '', //공통코드 찾기

    dragIndex:'',
    EXPSN_ATTR_COL_ID_DUPLE_CHK: false,
   }
 },

  watch: {

  },

  computed: {

  },

  beforeDestroy(){
    this.$eventBus.$off("selCompanyAction"); //eventBus 중복방지를 위해 off
  },

  async created() {
    //상단 고객사 선택시 eventBus 실행(각 페이지별 필요에 의한 내용 구현)
    this.$eventBus.$on("selCompanyAction", (SELECTED_COMPANY) => {
      // console.log(`${this.$options.name} : =====>`, SELECTED_COMPANY.CD_NM);
    });

    //공통코드설정
    let codeName = ['CUSL_TP_LV', 'CUSL_TP_CL', 'USE_WT', 'EXPN_PT', 'REQR_WT'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    this.getExpsnAttrList();
  },

  mounted() {

  },

  methods: {
    async getExpsnAttrList() {
      let sUrl = '/api/setting/expsnAttr/expsnAttrList';
      let postParam = {
        SE : this.SCH_SE
        , BSC_PVSN_ATTR_YN : "N"
        , EXPSN_ATTR_NM : this.SCH_EXPSN_ATTR_NM
      }

      let headParam = {
        head : {
          PAGING:"Y"
          , ROW_CNT:500
          , PAGES_CNT:1
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        let ArrExpsnAttr = [];
        this.SCH_ATTR_CNT = 0;
        for(let i=0; i<response.DATA.length; i++){
          const expsnAttrObj = response.DATA[i];
          expsnAttrObj.idx = i;
          expsnAttrObj.type = this.getIconClassNm(response.DATA[i].DATA_TYPE_CD);
          expsnAttrObj.disabled = false;
          expsnAttrObj.lock = false;
          expsnAttrObj.selected = false;

          ArrExpsnAttr.push(expsnAttrObj);

          if(expsnAttrObj.SRCH_STNG_YN === 'Y') this.SCH_ATTR_CNT++;
        }

        this.DRAG_LIST = ArrExpsnAttr;

        if(response.DATA.length > 0){
          if(this.dragIndex){
            response.DATA.forEach((listItem, idx) => {
              if(idx === this.dragIndex) this.getExpsnAttrDetailInfo(listItem);
            });
          }else{
            this.getExpsnAttrDetailInfo(response.DATA[0]);
          }
        }
      }
    },

    getIconClassNm(data) {
      let classNm = 'string';
      if(data === 'TXT') classNm = 'string'; //문자형
      else if(data === 'NUM') classNm = 'number'; //숫자형
      else if(data === 'NUM_COMMA') classNm = 'number'; //숫자형(',' 포함)
      else if(data === 'COE') classNm = 'check'; //단일선택형
      else if(data === 'COE_MULTI') classNm = 'check'; //다중선택형
      else if(data === 'DAT') classNm = 'date'; //날짜형
      else if(data === 'POST') classNm = 'post'; //우편번호
      else if(data === 'HASH') classNm = 'hashtag'; //해시태그

      return classNm;
    },

    getExpsnAttrDetailInfo(item){
      this.DRAG_LIST.forEach((listItem) => {
        listItem.selected = false;
      });
      item.selected = true;

      this.dragIndex = item.idx;
      this.DTL_ATTR_ID = item.ATTR_ID;
      this.DTL_EXPSN_ATTR_NM = item.EXPSN_ATTR_NM;
      this.DTL_EXPSN_ATTR_COL_ID = item.EXPSN_ATTR_COL_ID;
      this.DTL_DATA_TYPE_CD = item.DATA_TYPE_CD;
      this.dataTypeChange ();
      this.DTL_DATA_LEN = item.DATA_LEN;
      this.DTL_GROUP_CD_ID = item.GROUP_CD_ID;
      this.DTL_GROUP_CD_NM = item.GROUP_CD_NM;
      this.DTL_SYS_BSC_YN = item.SYS_BSC_YN;
      this.DTL_INDI_INFO_ENCPT_YN = item.INDI_INFO_ENCPT_YN === 'Y' ? true:false;
      this.DTL_MDFCN_PSBLTY_YN = item.MDFCN_PSBLTY_YN;
      this.DTL_ESNTL_YN = item.ESNTL_YN;
      this.DTL_USE_YN = item.USE_YN;
      this.DTL_USE_YN = item.USE_YN;
      this.DTL_SCRN_EXPSR_YN = item.SCRN_EXPSR_YN;
      this.DTL_SRCH_STNG_YN = item.SRCH_STNG_YN;
      this.DTL_SORT_ORD = item.SORT_ORD;
      this.EXPSN_ATTR_COL_ID_DUPLE_CHK = item.SYS_BSC_YN==='Y'?true:this.DTL_SYS_BSC_YN ==='N' && !this.isAttrDisabled?false:true;
    },

    expsnAttrValidate() {
      if (!this.detailValidate()) {
        return;
      }

      if(!this.EXPSN_ATTR_COL_ID_DUPLE_CHK){
        this.showAlert(this.MESSAGE.ALERT.ATTR_COL_ID_DUPLE_CHECK);
        return;
      }

      this.showAlert(this.MESSAGE.CONFIRM.EXPSN_REG);
    },

    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    //validate check
    detailValidate () {
      return this.$refs.detailForm.validate();
    },

    closeDropFindParts() {
      this.dropFindParts = false;
    },
    //버튼정보 초기화
    displayOwner(item) {
      return item === 'Y' ? '(시스템 기본항목)' : '(사용자 확장항목)'
    },
    displayDisabled(item) {
      return item === 'N' ? '사용안함' : ''
    },
    displayLock(item) {
      return item === 'N' ? 'list-lock' : 'list-unlock'
    },
    addDragItem() {
      this.DRAG_LIST.forEach((listItem) => {
        listItem.selected = false;
      });

      this.DTL_ATTR_ID = '';
      this.isDisabled = true;
      this.DTL_EXPSN_ATTR_NM = '';
      this.DTL_SYS_BSC_YN = 'N';
      this.DTL_INDI_INFO_ENCPT_YN = false;
      this.DTL_EXPSN_ATTR_COL_ID = '';
      this.isAttrDisabled = false;
      this.isDataLenDisabled = false;
      this.DTL_DATA_TYPE_CD = '';
      this.DTL_GROUP_CD_NM = '';
      this.DTL_DATA_LEN = '';
      this.DTL_ESNTL_YN = '';
      this.DTL_MDFCN_PSBLTY_YN = 'Y';
      this.DTL_USE_YN = '';
      this.DTL_SCRN_EXPSR_YN = '';
      this.DTL_SRCH_STNG_YN = '';
      this.DTL_SORT_ORD = this.DRAG_LIST.length + 1;
    },

    expsnAttrFind(flag) {

      this.isDisabled = flag;

      if (flag) {
        this.mixin_showDialog('FindParts');
      } else {
        // console.log('직접 입력');
      }

      this.dropFindParts = false;
    },

    //확장속성 찾기 선택
    setExpsnAttrItem(selectedItem) {

      this.DTL_LNKG_ATTR_ID = selectedItem.ATTR_ID;
      this.DTL_EXPSN_ATTR_NM = selectedItem.EXPSN_ATTR_NM;
      this.DTL_EXPSN_ATTR_COL_ID = selectedItem.EXPSN_ATTR_COL_ID;
      this.DTL_DATA_TYPE_CD = selectedItem.DATA_TYPE_CD;
      this.DTL_DATA_LEN = selectedItem.DATA_LEN;
      this.DTL_ESNTL_YN = selectedItem.ESNTL_YN;
      this.DTL_USE_YN = selectedItem.USE_YN;
      this.DTL_USE_YN = selectedItem.USE_YN;
      this.DTL_SCRN_EXPSR_YN = selectedItem.SCRN_EXPSR_YN;
      this.DTL_SRCH_STNG_YN = selectedItem.SRCH_STNG_YN;
      this.DTL_INDI_INFO_ENCPT_YN = selectedItem.INDI_INFO_ENCPT_YN === 'Y' ? true : false;

      this.isAttrDisabled = true; //항목id 비활성화
      this.isDataTpDisabled = true;
      this.EXPSN_ATTR_COL_ID_DUPLE_CHK = true;

      this.mixin_hideDialog('FindParts');
    },

    //공통코드 찾기 선택
    setCommCdItem(selectedItem) {
      this.DTL_GROUP_CD_NM = selectedItem.CD_NM;
      this.DTL_GROUP_CD_ID = selectedItem.CD_ID;
      this.isDataLenDisabled = true;
      this.DTL_DATA_LEN = 60;

      this.mixin_hideDialog('FindIndex');
    },

    dataTypeChange () {
      if(this.DTL_DATA_TYPE_CD === 'COE' || this.DTL_DATA_TYPE_CD === 'COE_MULTI'){
        this.isDataLenDisabled = true;
        this.DTL_DATA_LEN = 60;
      }else if(this.DTL_DATA_TYPE_CD === 'TEL'){
        this.isDataLenDisabled = true;
        this.DTL_DATA_LEN = 14;
      }else{
        this.DTL_GROUP_CD_ID = '';
        this.DTL_GROUP_CD_NM = '';
        this.isDataLenDisabled = false;
        this.DTL_DATA_LEN = '';
      }
    },

    onDragStart(event) {
      // console.log('Drag started');
      // console.log('Event:', event);
      // Additional logic for drag start
    },
    async onDragEnd(event) {
      let arrAttrId = [];
      for (let value of this.DRAG_LIST) {
        arrAttrId.push(value.ATTR_ID);
      }

      let sUrl = '/api/setting/expsnAttr/expsnAttrReOrder';
      let postParam = {
        arrAttrId : arrAttrId
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.getExpsnAttrList();

        this.dragIndex = event.newIndex;
      }
    },

    //등록 수정
    async expsnAttrSave() {
      if(!this.SCH_SE) return;
      
      let sUrl = '/api/setting/expsnAttr/expsnAttrProc';
      let postParam = {
        ATTR_ID : this.DTL_ATTR_ID
        , SE : this.SCH_SE
        , LNKG_ATTR_ID : this.DTL_LNKG_ATTR_ID
        , EXPSN_ATTR_NM : this.DTL_EXPSN_ATTR_NM
        , EXPSN_ATTR_COL_ID : this.DTL_EXPSN_ATTR_COL_ID
        , DATA_TYPE_CD : this.DTL_DATA_TYPE_CD
        , DATA_LEN : (this.DTL_DATA_TYPE_CD==='COE' || this.DTL_DATA_TYPE_CD==='COE_MULTI')?60:this.DTL_DATA_LEN
        , GROUP_CD_ID : this.DTL_GROUP_CD_ID
        , ESNTL_YN : this.DTL_ESNTL_YN
        , USE_YN : this.DTL_USE_YN
        , SCRN_EXPSR_YN : this.DTL_SCRN_EXPSR_YN
        , SRCH_STNG_YN : this.DTL_INDI_INFO_ENCPT_YN?'N':this.DTL_SRCH_STNG_YN
        , BSC_PVSN_ATTR_YN : 'N'
        , SYS_BSC_YN : 'N'
        , MDFCN_PSBLTY_YN : this.DTL_MDFCN_PSBLTY_YN
        , INDI_INFO_ENCPT_YN : (!this.DTL_ATTR_ID?this.DTL_INDI_INFO_ENCPT_YN?'Y':'N':'N')
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        // this.showAlert(this.MESSAGE.ALERT.SUCCESS);
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeMsg();
        this.getExpsnAttrList();
        this.EXPSN_ATTR_COL_ID_DUPLE_CHK = false;
      }
    },

    //상담내용 항목 삭제
    async expsnAttrDel() {
      let sUrl = '/api/setting/expsnAttr/expsnAttrDel';
      let postParam = {
        arrAttrId: this.DTL_ATTR_ID,
      }

      let headParam = {
        head : {
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);

      if (!resData.HEADER.ERROR_FLAG){
        // this.showAlert(this.MESSAGE.ALERT.SUCCESS);
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeMsg();
        this.getExpsnAttrList();
        this.$refs.detailForm.reset();
      }
    },

    //항목 ID 중복 체크
    async attrColIdDupleChk() {

      if(!this.DTL_EXPSN_ATTR_COL_ID){
        this.showAlert(this.MESSAGE.ALERT.ATTR_COL_ID_EMPTY_CHECK);
        return;
      }

      let sURL = '/api/setting/expsnAttr/expsnAttrColIdDupleChk';
      let postParam = {
        SE : 'CUSTOM'
        , ATTR_ID : this.DTL_ATTR_ID
        , EXPSN_ATTR_COL_ID : this.DTL_EXPSN_ATTR_COL_ID
      }
      let headParam = {
        head: {
        },
      }

      let resData = await this.common_postCall(sURL, postParam, headParam)

      if (resData.HEADER.ERROR_FLAG) {
        this.EXPSN_ATTR_COL_ID_DUPLE_CHK = false;
      } else {
        if(resData.DATA[0].expsnAttrColIdBoolean){
          this.EXPSN_ATTR_COL_ID_DUPLE_CHK = false;
          this.showAlert(this.MESSAGE.ALERT.ATTR_COL_ID_DUPLE_TRUE);
        }else{
          this.EXPSN_ATTR_COL_ID_DUPLE_CHK = true;
          this.showAlert(this.MESSAGE.ALERT.ATTR_COL_ID_DUPLE_FAIL);
        }
      }

    },

    changeGridView () {
      if(this.DTL_INDI_INFO_ENCPT_YN){
        this.DTL_SCRN_EXPSR_YN = 'N';
      }else{
        this.DTL_SCRN_EXPSR_YN = 'Y';
      }
    },

    chkSchCnt(){
      // console.log('this.SCH_ATTR_CNT : ', this.SCH_ATTR_CNT);

      if(this.DTL_SRCH_STNG_YN === 'Y'){
        // if(this.SCH_ATTR_CNT >= 5){
        //   this.DTL_SRCH_STNG_YN = 'N';
        //   this.showAlert(this.MESSAGE.ALERT.SCH_STNG_CNT_OVER);
        //   return;
        // }else{
          if(!this.mixin_isEmpty(this.DTL_ATTR_ID)){
            this.expsnAttrSave();
          }
        // }
      }else{
        if(!this.mixin_isEmpty(this.DTL_ATTR_ID)){
          this.expsnAttrSave();
        }
      }
    }
  },
}
</script>

<style lang="scss" scoped>

</style>