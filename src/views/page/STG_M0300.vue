<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                사용자 상태
              </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form"
                    :items="mixin_common_code_get(this.COMMON_CODE,'USER_ST','전체')"
                    v-model="SRCH_USER_PARAM.CHC_USER_STTS"
                    placeholder="선택하세요"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <div class="pl-desc">
                <!-- <span class="pl-label"> -->
                <v-select
                    class="pl-form"
                    :items="mixin_common_code_get(this.COMMON_CODE,'USER_SRCH')"
                    v-model="SRCH_USER_PARAM.CHC_USER_SRCH"
                ></v-select>
                <!-- placeholder="사용자명" -->
                <!-- </span> -->
              </div>
              <div class="pl-desc">
                <v-text-field
                    class="pl-form is-lg"
                    placeholder="검색어 입력"
                    v-model="SRCH_USER_PARAM.SRCH_KEYWORD"
                    @keyup.enter="srchUser"/>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                권한 그룹
              </span>
              <!-- <div class="pl-desc">
                <v-select
                class="pl-form"
                v-model="SRCH_USER_PARAM.AUTHRT_GROUP"
                :items="this.AUTHRT_GROUP_DROP"
                placeholder="선택하세요"
                ></v-select>
              </div> -->
              <div class="pl-desc">
                <v-select
                    class="pl-form"
                    v-model="SRCH_USER_PARAM.CHC_AUTHRT_GROUP"
                    :items="AUTHRT_GROUP_DROP"
                    placeholder="전체"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                최근 접속IP
              </span>
              <div class="pl-desc">
                <v-text-field
                    class="pl-form"
                    placeholder="검색어 입력"
                    v-model="SRCH_USER_PARAM.SRCH_CNTN_IP"
                    @keyup.enter="srchUser"
                />
              </div>
            </div>
            <v-btn
                class="pl-btn is-icon"
                @click="srchUser"
            >
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card">
        <div class="pl-grid-top">
          <div class="pl-grid-top-left">
            <v-btn
                class="pl-btn is-icon is-sub"
                @click="openDialog('detail')"
                :disabled="CHK_USER_INFO_ITEM.USER_ID != undefined ? false : true"
            >
              <span
                  class="pl-icon20 document"
              ></span>
              선택항목 상세
            </v-btn>
            <v-btn 
              v-if="($store.getters['userStore/GE_USER_ROLE'].userId == '1' || $store.getters['userStore/GE_USER_ROLE'].userId == '3')" 
              class="pl-btn is-icon is-sub" 
              @click="openDialog('regist')">
              <span class="pl-icon20 circle-plus"></span>
              등록
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub"
              @click="resetBtn('reset')" :disabled="CHK_USER_GRID_ITEMS.length != 0 ? false : true">
              <span class="pl-icon20 pass-reset"></span>
              비밀번호 초기화
            </v-btn>
            <v-btn
                v-if="this.mixin_set_btn(this.$options.name, 'BtnUnlockUser')"
                class="pl-btn is-icon is-sub"
                @click="resetBtn('unlock')"
                :disabled="CHK_USER_GRID_ITEMS.length != 0 ? false : true"
            >
              <span class="pl-icon20 unlock"></span>
              잠금 해제
            </v-btn>
            <v-btn class="pl-btn is-icon is-sub" v-if="clientip === '121.67.187.114'"
              @click="forceResetPwd()" :disabled="CHK_USER_GRID_ITEMS.length != 0 ? false : true">
              <span class="pl-icon20 pass-reset"></span>
              강제 비밀번호 변경
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ USER_GRID_ITEMS.length }})</em> 건</span>
          </div>
        </div>
        <v-data-table
            v-model="CHK_USER_GRID_ITEMS"
            class="pl-grid has-control"
            show-select
            :headers="headers"
            :items="USER_GRID_ITEMS"
            :item-class="isActiveRow"
            fixed-header
            item-key="INDEX"
            height="562px"
            :items-per-page="ROW_PER_PAGE"
            hide-default-footer
            :page.sync="page"
            @page-count="pageCount = $event"
            @click:row="rowSelect"
            @dblclick:row="[rowSelect,openDialog('detail')]"
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
            보기 {{ mixin_getPagePeriod(USER_GRID_ITEMS, page) }} / {{ USER_GRID_ITEMS.length }}
               <compo-tooltip-btn
                   TitleProp="다음 검색"
                   ClassProp="pl-tooltip-btn is-line"
                   IconProp="pl-icon20 arrow-next-paging"
                   TooltipPositionProp="bottom"
                   :DisabledProp="nextDisabled"
                   @btnClick="srchUser('next')"
               ></compo-tooltip-btn>
          </span>
        </div>
      </div>
    </div>
    <!-- dialog -->
    <v-dialog
        v-model="dialogRegDetail"
        content-class="dialog-draggable is-scroll"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          :header-title="USER_PARAMS.REG_YN === 'N' ? '사용자 등록':'사용자 상세 정보'"
          @hide="closeBtn"
      >
        <template slot="body">
          <ul class="pl-list-dot is-no-border mt-0">
            <li>사용자 정보 변경 시 수정이력은 시스템에 자동 기록되어 집니다.</li>
            <li>필수 항목을 입력하신 후 <strong>[저장] 버튼을 클릭</strong>하십시오</li>
            <li>사용자 초기 비밀번호는 “사용자 ID + 1!”로 설정됩니다.</li>
          </ul>
          <v-form ref="form">
            <div class="pl-form-inline-wrap vertical mt-2">
              <div class="pl-form-inline">
                <span class="pl-label">
                  사용자 명
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-text-field class="pl-form"
                                v-model="USER_PARAMS.USER_NM"
                                :rules="validateRules.USER_NM"
                                v-byte-counter="300"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  사용자 ID
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-text-field class="pl-form"
                                v-model="USER_PARAMS.LGN_ID"
                                :rules="validateRules.LGN_ID"
                                :disabled="USER_PARAMS.REG_YN==='Y'?true:false"
                                @change="dpncReset"
                                v-byte-counter="60"
                  />
                  <v-btn class="pl-btn is-sub flex-grow-0"
                         @click="dpcnChk"
                         :disabled="USER_PARAMS.REG_YN==='Y'?true:false"
                  >중복체크
                  </v-btn>
                </div>
              </div>
              <div 
                v-if = "mixin_getCustcoSrvcStat('RSVT')"
                class="pl-form-inline"
                >
                <span class="pl-label">
                  고객사 사용자 ID
                </span>
                <div class="pl-desc">
                  <v-text-field class="pl-form"
                                v-model="USER_PARAMS.CUSTCO_CUSL_ID"
                                @change="dpncReset"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  이메일
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-text-field class="pl-form"
                                v-model="USER_PARAMS.EML"
                                :rules="validateRules.EML"
                                v-byte-counter="60"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  전화번호
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-text-field
                      class="pl-form"
                      v-model="USER_PARAMS.MBL_PHN_NO"
                      maxlength="14"
                      hide-spin-buttons
                      type="text"
                      @keyup="setPhoneNo(USER_PARAMS.MBL_PHN_NO)"
                      oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                      :rules="validateRules.MBL_PHN_NO"
                      v-byte-counter="60"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  닉네임
                </span>
                <div class="pl-desc">
                  <v-text-field class="pl-form"
                                v-model="USER_PARAMS.USER_NNM"
                                v-byte-counter="300"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  권한 그룹
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-select
                      class="pl-form"
                      :items="USER_PARAMS.AUTHRT_GROUP_DROP"
                      v-model="USER_PARAMS.AUTHRT_GROUP_SELECT"
                      placeholder="선택하세요"
                      :rules="validateRules.AUTHRT_GROUP_SELECT"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  직책
                </span>
                <div class="pl-desc">
                  <v-select
                      class="pl-form"
                      :items="mixin_common_code_get(this.COMMON_CODE,'JOB_POST')"
                      placeholder="선택하세요"
                      v-model="USER_PARAMS.JBTTL_CD"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  소속
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-text-field class="pl-form flex-grow-1"
                                v-model="USER_PARAMS.SELECT_ORGZ_ARR.DEPT_NM"
                                placeholder="우측의 조직도 찾기를 클릭하세요"
                                oninput="javascript: this.value = this.value.replace(/[0-9|a-z|A-Z|ㄱ-ㅎ|가-힣]/g, '' );"
                                :rules="validateRules.DEPT"
                  />
                  <!-- :disabled="USER_PARAMS.SELECT_ORGZ_ARR.DEPT_NM ===''?true:false" -->
                  <!-- 조직도 버튼 -->
                  <compo-tooltip-btn
                      TitleProp="조직도"
                      ClassProp="pl-tooltip-btn flex-grow-0"
                      IconProp="pl-icon20 detail"
                      TooltipPositionProp="bottom"
                      @btnClick="mixin_showDialog('OrgTree')"
                  ></compo-tooltip-btn>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  입사 일자
                </span>
                <div class="pl-desc">
                  <div class="pl-calendar-range-form">
                    <compo-date-picker
                        DateType="dateInput"
                        :DateProp.sync="startDate"/>
                  </div>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  퇴사 일자
                </span>
                <div class="pl-desc">
                  <div class="pl-calendar-range-form">
                    <compo-date-picker
                        DateType="dateInput"
                        :DateProp.sync="endDate"/>
                  </div>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  콜백 여부
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-select
                      class="pl-form"
                      :items="mixin_common_code_get(this.COMMON_CODE, 'CALB_WT')"
                      placeholder="선택하세요"
                      v-model="USER_PARAMS.CLBK_YN"
                      :rules="validateRules.CLBK_YN"
                  ></v-select>
                </div>
              </div>
              <div 
                v-if = "mixin_getCustcoSrvcStat('RSVT')"
                class="pl-form-inline">
                <span class="pl-label">
                  예약상담 배정여부
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-select
                      class="pl-form"
                      :items="mixin_common_code_get(this.COMMON_CODE, 'CALB_WT')"
                      placeholder="선택하세요"
                      v-model="USER_PARAMS.RSVT_YN"
                  ></v-select>
                </div>
              </div>
              <ul class="pl-list-dot is-no-border mt-0" v-if="($store.getters['userStore/GE_USER_ROLE'].userId == '1')">
                <li class="is-txt-error">중복 로그인 허용 여부는 고객사에는 보여지지 않는 정보 입니다.</li>
              </ul>
              <div class="pl-form-inline" v-if="($store.getters['userStore/GE_USER_ROLE'].userId == '1')">
                <span class="pl-label">
                  중복 로그인 허용 여부
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-select
                      class="pl-form"
                      :items="mixin_common_code_get(this.COMMON_CODE, 'CALB_WT')"
                      placeholder="선택하세요"
                      v-model="USER_PARAMS.DPCN_LGN_PM_YN"
                      :rules="validateRules.DPCN_LGN_PM_YN"
                  ></v-select>
                </div>
              </div>

              <div class="pl-form-inline">
                <span class="pl-label">
                  사용자 상태
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-select
                      class="pl-form"
                      :items="mixin_common_code_get(this.COMMON_CODE, 'USER_ST')"
                      placeholder="선택하세요"
                      v-model="USER_PARAMS.USER_STTS_CD"
                      :rules="validateRules.USER_STTS_CD"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  모니터링 표시 방법
                </span>
                <div class="pl-desc">
                  <v-select
                      class="pl-form"
                      :items="mixin_common_code_get(this.COMMON_CODE, 'MONITOR_VIEW_TP', '전체')"
                      placeholder="선택하세요"
                      v-model="USER_PARAMS.STTS_EXPSR_MTHD_CD"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">설명</span>
                <div class="pl-desc">
                  <v-textarea
                      class="pl-form is-noresize"
                      placeholder="기타 사용자 특이사항 입력"
                      v-byte-counter="4000"
                      v-model="USER_PARAMS.USER_EXPLN"
                      :spellcheck="false"
                  />
                </div>
              </div>
            </div>
          </v-form>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="closeBtn">닫기</v-btn>
          <v-btn class="pl-btn" @click="saveBtn">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <v-dialog
        v-model="dialogOrgTree"
        content-class="dialog-draggable"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="조직 선택"
          @hide="mixin_hideDialog('OrgTree')"
      >
        <template slot="body">
          <compo-tree
              ref="ognzDataCompo"
              :DataProp.sync="treeItems"
              :ExpandedProp=true
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('OrgTree')">닫기</v-btn>
          <v-btn class="pl-btn" @click="setOgnzData">선택</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- dialog -->
    <v-dialog
        v-model="dialogForcePwdChange"
        content-class="dialog-draggable"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="강제 비밀번호 변경"
          @hide="closeBtn"
      >
        <template slot="body">
          <v-form ref="form">
            <div class="pl-form-inline-wrap vertical mt-2">
              <div class="pl-form-inline">
                <span class="pl-label">
                  비밀번호
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    v-model="FORCE_PWD"
                    maxlength="100"
                    v-byte-counter="100"
                  />
                </div>
              </div>
            </div>
          </v-form>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="closeForcePwd">닫기</v-btn>
          <v-btn class="pl-btn" @click="forceResetPwdProc">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>

import gibberish from "../../mixin/gibberish-aes_mixin";

export default {
  name: "MENU_STG_M0300", //name은 'MENU_' + 파일명 조합
  mixins: [gibberish],
  components: {},
  data() {
    return {
      //search top
      COMMON_CODE: [],

      // 사용자 검색 조건
      SRCH_USER_PARAM: {
        CHC_USER_STTS: 'WORK',         // 사용자 상태 선택
        CHC_USER_SRCH: 'USER_NM',          // 검색항목 선택( 사용자명, 사용자 ID)
        SRCH_KEYWORD: '',          // 검색 내용( 사용자명, 사용자 ID)
        CHC_AUTHRT_GROUP: '',       // 권한 그룹 선택
        SRCH_CNTN_IP: '',           // IP 검색
      },

      AUTHRT_GROUP_DROP: [],                // 권한 그룹 드롭박스
      AUTHRT_GROUP: '',                     // 권한 그룹

      USER_GRID_ITEMS: [],                 // 사용자정보 GRID ITEMS

      // 사용자 등록/수정(DETAIL) 파라미터

      USER_PARAMS: {

        USER_NM: '',                      // 사용자 이름
        LGN_ID: '',                       // 사용자 ID
        CUSTCO_CUSL_ID: '',               // 고객사 사용자 ID
        EML: '',                          // 이메일
        MBL_PHN_NO: '',                   // 전화번호
        USER_NNM: '',                     // 사용자 닉네임
        AUTHRT_GROUP_DROP: [],            // 권한 그룹 드롭박스용
        AUTHRT_GROUP_SELECT: '',          // 권한 그룹 선택
        JBTTL_CD: '',                         // 직책코드
        DEPT_NM: '',                      // 소속
        DEPT_ID: '',                      // 소속부서 ID
        JNCMP_YMD: '',                     // 입사 일자
        RSGNTN_YMD: '',                   // 퇴사일자
        CLBK_YN: 'N',                      // 콜백여부
        RSVT_YN: 'N', //  __              //상담예약 배분여부
        DPCN_LGN_PM_YN: 'N',               // 중복 로그인 허용 여부
        USER_STTS_CD: '',                 // 사용자 상태 코드
        SELECT_ORGZ_ARR: [],                // 사용자 소속 항목
        USER_EXPLN: '',
        EXT_NO: '',
        STTS_EXPSR_MTHD_CD: '',

        REG_YN: 'N',                       // 사용자 기등록여부(화면에서만사용)



      },
      NOW_DEPT_ID: '',                    //현재 부서
      treeItems: [],
      USER_DPNC_CHK: false,

      //dialog
      dialogRegDetail: false,
      dialogOrgTree: false,

      currentTime: '',
      startDate: '',
      endDate: '',

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15, 30, 50, 100],
      ROW_PER_PAGE: 15,

      headers: [
        {text: '번호', value: 'INDEX', align: 'center', width: '60px'},
        {text: '사용자명', value: 'USER_NM', width: '100px'},
        {text: '사용자ID', value: 'LGN_ID', width: '100px'},                     // 채번되어 들어가는 USER_ID가 아니라 LGN_ID를 표시
        {text: '소속', value: 'DEPT_NM', width: '200px'},
        {text: '사용자 상태', value: 'USER_STTS', width: '100px'},
        {text: '권한 그룹', value: 'AUTHRT_GROUP_NM', width: '100px'},
        {text: '콜백', value: 'CLBK_YN', width: '50px', align: 'center'},
        {text: '비밀번호 오류', value: 'PSWD_FAIL_CNT', align: 'center', width: '100PX'},
        {text: '최근 접속IP', value: 'CNTN_IP', width: '100px'},
        {text: '최근 접속일시', value: 'CNTN_DT', width: '150px'},
        {text: '등록일', value: 'REG_DT', width: '100px'},
        {text: '등록자', value: 'RGTR_NM', width: '80px'},
      ],
      MESSAGE: {
        CONFIRM: {
          REGIST: {
            alertDialogToggle: true,
            msg: '사용자를 등록 하시겠습니까?',
            iconClass: 'is-info',
            type: 'confirm',
            callYes: this.saveConfirm,
            callNo: this.closeMsg
          },
          MODIFY: {
            alertDialogToggle: true,
            msg: '사용자 정보를 변경 하시겠습니까?',
            iconClass: 'is-info',
            type: 'confirm',
            callYes: this.saveConfirm,
            callNo: this.closeMsg
          },
          DELETE: {
            alertDialogToggle: true,
            msg: '사용자와 연결된 내선 번호가 존재합니다.\n' +
                '휴직, 퇴직, 삭제 처리 시 연결된 내선 정보가 삭제됩니다.\n\n' +
                '저장하시겠습니까?',
            iconClass: 'is-info',
            type: 'confirm',
            callYes: this.saveConfirm,
            callNo: this.closeMsg
          },
          RESET_PSWD: {
            alertDialogToggle: true,
            msg: "선택한 사용자의 비밀번호를<br> 초기화 하시겠습니까?",
            iconClass: 'is-info',
            type: 'confirm',
            callYes: this.resetPswdRtn,
            callNo: this.closeMsg
          },
          UNLOCK_PSWD: {
            alertDialogToggle: true,
            msg: "선택한 사용자의 잠금을 해제 <br>하시겠습니까?",
            iconClass: 'is-info',
            type: 'confirm',
            callYes: this.unlockPswdRtn,
            callNo: this.closeMsg
          },
          FORCE_RESET_PSWD: {
            alertDialogToggle: true,
            msg: "선택한 사용자의 비밀번호를<br> 변경 하시겠습니까?",
            iconClass: 'is-info',
            type: 'confirm',
            callYes: this.forceResetPwd,
            callNo: this.closeMsg
          },
        },
        ALERT: {
          ALREADY_EXIST: {alertDialogToggle: true, msg: '이미 사용중인 ID 입니다.', iconClass: 'is-caution', type: 'default'},
          USE_PSBLTY: {alertDialogToggle: true, msg: '사용 가능한 ID 입니다.', iconClass: 'is-done', type: 'default'},
          INVALID_LGN_ID: {alertDialogToggle: true, msg: '사용자 ID 중복체크를 해주세요.', iconClass: 'is-info', type: 'default'},
          OVER_LENG_ITEM: {alertDialogToggle: true, msg: '상세 보기는 한 건 씩만 가능합니다.', iconClass: 'is-info', type: 'default'},
          EMPTY_CHK_ITEM: {alertDialogToggle: true, msg: '사용자를 선택하세요.', iconClass: 'is-info', type: 'default'},
          REG_SUCCESS: {alertDialogToggle: true, msg: '처리되었습니다.', iconClass: 'is-done', type: 'default'},
          PSWD_FAIL_CNT_INVALID: {
            alertDialogToggle: true,
            msg: '계정이 잠긴 사용자만 해제할 수 있습니다.',
            iconClass: 'is-done',
            type: 'default'
          },
          RESET_PSWD_SUCCESS: {alertDialogToggle: true, msg: '처리되었습니다.', iconClass: 'is-done', type: 'default'},
          USER_CHECK_LIST_EMPTY: {alertDialogToggle: true, msg: '비밀번호를 변경할 사용자를 선택해 주세요.', iconClass: 'is-caution', type: 'default'},
          FORCE_PWD_EMPTY: {alertDialogToggle: true, msg: '비밀번호를 입력해 주세요.', iconClass: 'is-caution', type: 'default'},
        },
        ERROR: {
          GET_USER_INFO_FAIL: {
            alertDialogToggle: true,
            msg: '사용자 정보를 가져올 수 없습니다.',
            iconClass: 'is-caution',
            type: 'default'
          },
          GET_USER_LIST_FAIL: {
            alertDialogToggle: true,
            msg: '사용자 리스트를 가져올 수 없습니다.',
            iconClass: 'is-caution',
            type: 'default'
          },
          REG_USER_FAIL: {alertDialogToggle: true, msg: '사용자 등록에 실패했습니다.', iconClass: 'is-caution', type: 'default'},
          GET_PSWD_ENC_KEY_FAIL: {
            alertDialogToggle: true,
            msg: '사용자 등록에 실패했습니다.',
            iconClass: 'is-caution',
            type: 'default'
          },
          RESET_USER_PSWD_CHK: {alertDialogToggle: true, msg: '사용자를 선택하세요.', iconClass: 'is-caution', type: 'default'},
          RESET_USER_PSWD_FAIL: {alertDialogToggle: true, msg: '사용자를 선택하세요.', iconClass: 'is-caution', type: 'default'},
        },
        TOAST : {
          SUCCESS : {  msg: '처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        }
      },

      //그리드 페이지속성정의
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      },
      nextDisabled: false,
      rowCnt: 0,

      validateRules: {
        USER_NM: [
          v => !!v || '사용자 이름은(는) 필수 입력 항목입니다.'
        ],
        LGN_ID: [
          v => !!v || '사용자 ID은(는) 필수 입력 항목입니다.',
          v => (v && v.length <= 60) || '사용자 ID는 60자를 넘을 수 없습니다.',
          v => (v || '').indexOf(' ') < 0 || '사용자 ID는 공백을 허용하지 않습니다.',
          v => /^[a-zA-Z0-9]+$/.test(v) || '영문과 숫자만 입력 가능합니다.',
        ],
        AUTHRT_GROUP_SELECT: [
          v => !!v || '권한 그룹은(는) 필수 입력 항목입니다.'
        ],
        CLBK_YN: [
          v => !!v || '콜백여부은(는) 필수 입력 항목입니다.'
        ],
        DPCN_LGN_PM_YN: [
          v => !!v || '중복로그인허용여부은(는) 필수 입력 항목입니다.'
        ],
        USER_STTS_CD: [
          v => !!v || '사용자 상태은(는) 필수 입력 항목입니다.'
        ],
        EML: [
          v => {
            const replaceV = v.replace(/(\s*)/g, '')
            const EmlPattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
            return (v && EmlPattern.test(replaceV)) || '이메일 형식에 맞지 않습니다.'
          },
          // v => !!v||'이메일은(는) 필수 입력 항목입니다.'
        ],
        MBL_PHN_NO: [
          v => !!v || '전화번호는 최대 11자리 입니다.',
          v => v.length <= 13 || '전화번호는 최대 11자리 입니다.',
        ],
        DEPT: [
          v => !!v || '소속은 필수 입력 항목입니다.'
        ]
      },


      CHK_USER_INFO_ITEM: {},                      // 그리드에서 선택된 row의 사용자 item
      CHK_USER_GRID_ITEMS: [],                     // 그리드에서 체크 된 사용자 item

      showSelect: false,

      ENCRYPT_KEY: '',                                   // 암호화키
      NO_ENC_PWD: '',

      saveCustDataDiff: [], //개인정보 변경관련.
      dialogForcePwdChange:false,
      FORCE_PWD : '',
      clientip : null,

      SELECTED_COMPANY: '',
    }
  },

  watch: {
    // 사용사 상태를 감시하여 상태가 퇴직으로 변경 될 경우 퇴사일자를 현재 날짜로 변경
    USER_PARAMS: {
      handler(newValue, oldValue) {
        if (newValue.USER_STTS_CD === 'RESIGN' || newValue.USER_STTS_CD === 'DELT') {
          this.endDate = this.$moment().format('YYYY-MM-DD');
        }
        // 권한이 상담사일 대 콜백이 무조건 사용으로 처리됨
        // if(newValue.AUTHRT_GROUP_SELECT === '6'){
        //   this.USER_PARAMS.CLBK_YN = 'Y'
        // }
      },
      deep: true,
    },
  },

  computed: {},

  async created() {
    const companyInfo = this.$store.getters["userStore/GE_USER_ROLE"].company_list;
    if(companyInfo.length > 0){
      this.SELECTED_COMPANY = companyInfo[0];
    }
  },

  async mounted() {

    this.srchAuthrtGroup();

    //공통코드설정
    let codeName = ['USER_ST', 'USER_SRCH', 'JOB_POST', 'CALB_WT', 'MONITOR_VIEW_TP'];

    this.COMMON_CODE = await this.mixin_common_code_get_all(codeName);


    this.initSelect();
    this.srchUser();

    this.setTime();

    fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(response => {
      this.clientip = response.ip;
    });
  },

  methods: {

    setPhoneNo(val) {
      let res = this.mixin_setPhoneNo(val.replace(/[^0-9]/g, ""));
      this.USER_PARAMS.MBL_PHN_NO = res;
    },

    // 서버시간으로 기본시간 세팅
    setTime() {
      // this.currentTime = await this.mixin_getSvrDate("YYYY-MM-DD");
      this.startDate = this.$moment().format('YYYY-MM-DD');
      this.endDate = '';//기본 퇴사 일자 없음 처리.this.$moment(this.startDate).add(1,'years').format('YYYY-MM-DD'); // 퇴사일자 ( 시작일자 1년 후 default)
    },

    initSelect() {
      let select = this.COMMON_CODE[1].group_value[0].CD;
      this.SRCH_USER_PARAM.CHC_USER_SRCH = select;
    },

    initRegParam() {

      this.USER_PARAMS.REG_YN = 'N';
      this.USER_PARAMS.USER_NM = '';                       // 사용자 이름
      this.USER_PARAMS.LGN_ID = '';                        // 사용자 ID
      this.USER_PARAMS.EML = '';                        // 이메일
      this.USER_PARAMS.MBL_PHN_NO = '';                        // 전화번호
      this.USER_PARAMS.USER_NNM = '';                      // 사용자 닉네임
      this.USER_PARAMS.AUTHRT_GROUP_SELECT = '';           // 권한 그룹 선택
      this.USER_PARAMS.JBTTL_CD = '';                          // 직책
      this.USER_PARAMS.DEPT_NM = '';                       // 소속
      this.USER_PARAMS.DEPT_ID = '';                       // 소속부서 ID
      this.USER_PARAMS.JNCMP_YMD = '';                     // 입사 일자
      this.USER_PARAMS.RSGNTN_YMD = '';                    // 퇴사일자
      this.USER_PARAMS.CLBK_YN = 'N';                       // 콜백여부
      this.USER_PARAMS.RSVT_YN = 'Y';                       // 상담예약 배분여부
      this.USER_PARAMS.DPCN_LGN_PM_YN = 'N';                // 중복로그인허용여부
      this.USER_PARAMS.USER_STTS_CD = '';                  // 사용자 상태 코드
      this.USER_PARAMS.STTS_EXPSR_MTHD_CD = '';            // 모니터링 표시 방법 코드
      this.USER_PARAMS.SELECT_ORGZ_ARR = [];                // 사용자 소속 항목
      this.USER_PARAMS.USER_EXPLN = '';                // 사용자 소속 항목
      this.USER_PARAMS.EXT_NO = '';                // 사용자 소속 항목

      this.NOW_DEPT_ID='';

      this.ENCRYPT_KEY = '';
      this.NO_ENC_PWD = '';

      this.USER_DPNC_CHK = false;

      this.CHK_USER_GRID_ITEMS = [];
      this.CHK_USER_INFO_ITEM = [];

      // this.initSelect();
      this.setTime();
      this.resetValidation();

    },
    click_detail() {

      this.saveCustDataDiff = []; //개인정보관련 변경 초기화

      this.USER_PARAMS.USER_NM = this.CHK_USER_INFO_ITEM.USER_NM;                        // 사용자 이름
      this.USER_PARAMS.LGN_ID = this.CHK_USER_INFO_ITEM.LGN_ID;                          // 사용자 ID
      this.USER_PARAMS.CUSTCO_CUSL_ID = this.CHK_USER_INFO_ITEM.CUSTCO_CUSL_ID;                          // 사용자 ID
      this.USER_PARAMS.EML = this.CHK_USER_INFO_ITEM.EML;                                // 이메일
      this.USER_PARAMS.MBL_PHN_NO = this.mixin_setPhoneNo(this.CHK_USER_INFO_ITEM.MBL_PHN_NO.replace(/[^0-9]/g, ""));                  // 전화번호
      this.USER_PARAMS.USER_NNM = this.CHK_USER_INFO_ITEM.USER_NNM;                      // 사용자 닉네임
      this.USER_PARAMS.CLBK_YN = this.CHK_USER_INFO_ITEM.CLBK_YN;                        // 콜백여부
      this.USER_PARAMS.RSVT_YN = this.CHK_USER_INFO_ITEM.RSVT_YN;                        // 상담예약 배분여부
      this.USER_PARAMS.DPCN_LGN_PM_YN = this.CHK_USER_INFO_ITEM.DPCN_LGN_PM_YN;                        // 콜백여부
      this.USER_PARAMS.USER_STTS_CD = this.CHK_USER_INFO_ITEM.USER_STTS_CD;              // 사용자 상태 코드
      this.USER_PARAMS.STTS_EXPSR_MTHD_CD = this.CHK_USER_INFO_ITEM.STTS_EXPSR_MTHD_CD;              // 모니터링 표시 방법 코드
      this.USER_PARAMS.DEPT_ID = this.CHK_USER_INFO_ITEM.DEPT_ID;                        // 소속부서 ID
      this.USER_PARAMS.DEPT_NM = this.CHK_USER_INFO_ITEM.DEPT_NM;                        // 소속부서 이름
      this.USER_PARAMS.JBTTL_CD = this.CHK_USER_INFO_ITEM.JBTTL_CD;                      // 직책
      this.USER_PARAMS.AUTHRT_GROUP_SELECT = this.CHK_USER_INFO_ITEM.AUTHRT_GROUP_ID;    // 권한 그룹 선택
      this.startDate = this.mixin_convertDate(this.CHK_USER_INFO_ITEM.JNCMP_YMD, 'yyyy-MM-dd');                // 입사 일자
      this.endDate = this.CHK_USER_INFO_ITEM.RSGNTN_YMD.trim() === '' ? '' : this.mixin_convertDate(this.CHK_USER_INFO_ITEM.RSGNTN_YMD, 'yyyy-MM-dd');// 퇴사일자
      this.USER_PARAMS.SELECT_ORGZ_ARR.DEPT_NM = this.CHK_USER_INFO_ITEM.DEPT_NM;                        // 소속부서 이름
      this.USER_PARAMS.SELECT_ORGZ_ARR.DEPT_ID = this.CHK_USER_INFO_ITEM.DEPT_ID;                        // 소속부서 이름
      this.NOW_DEPT_ID = this.CHK_USER_INFO_ITEM.DEPT_ID; //현재 소속 부서
      this.USER_PARAMS.USER_EXPLN = this.CHK_USER_INFO_ITEM.USER_EXPLN;                        // 사용자 설명
      this.USER_PARAMS.EXT_NO = this.CHK_USER_INFO_ITEM.EXT_NO;                        // 사용자 설명

      //개인정보관련 로깅용
      this.CHK_USER_INFO_ITEM.trgtId = this.CHK_USER_INFO_ITEM.USER_ID;
      this.mixin_prvcInqLog('USER_SEL', this.CHK_USER_INFO_ITEM);
// console.log('this.this.USER_PARAMS', this.USER_PARAMS)
      // this.USER_PARAMS.DEPT_NM = this.CHK_USER_INFO_ITEM.AUTHRT_GROUP_NM;                   // 소속
    },

    // 사용자 권한 목록 조회
    async srchAuthrtGroup() {

      let sURL = '/api/setting/system/menu-author-manage/author-group/inqire';

      let postParam = {}

      let headParam = {
        head: {}
      }

      let resData = await this.common_postCall(sURL, postParam, headParam)

      if (!resData.HEADER.ERROR_FLAG) {

        for (let i = 0; i < resData.DATA.length; i++) {

          let dropitem = {
            text: resData.DATA[i].AUTHRT_GROUP_NM,
            value: resData.DATA[i].AUTHRT_GROUP_ID,
          };
          let tempData = {text: '전체', value: '',}
          this.AUTHRT_GROUP_DROP.push(tempData);
          this.AUTHRT_GROUP_DROP.push(dropitem);
          this.USER_PARAMS.AUTHRT_GROUP_DROP.push(dropitem);

        }
      }
    },


    // 사용자 정보 조회
    async srchUser(next) {


      //다음버튼 클릭 유무
      if (next !== 'next') {
        this.USER_GRID_ITEMS = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let sURL = '/api/setting/agent/manage/list';

      let postParam = {
        USER_STTS_CD: this.SRCH_USER_PARAM.CHC_USER_STTS,
        LGN_ID: this.SRCH_USER_PARAM.CHC_USER_SRCH == 'USER_ID' ? this.SRCH_USER_PARAM.SRCH_KEYWORD : '',             // 사용자에게 채번되어들어가는 id가 아닌 로그인 아이디(LGN_ID)
        USER_NM: this.SRCH_USER_PARAM.CHC_USER_SRCH == 'USER_NM' ? this.SRCH_USER_PARAM.SRCH_KEYWORD : '',
        CNTN_IP: this.SRCH_USER_PARAM.SRCH_CNTN_IP,
        AUTHRT_GROUP_ID: this.SRCH_USER_PARAM.CHC_AUTHRT_GROUP,
      }

      let headParam = {
        head: {
          "METHOD": "inqire",
          "TYPE": "BIZ_SERVICE",
          "ROW_CNT": this.pagination.rowsPerPage,
          "PAGES_CNT": this.pagination.page,
          "PAGING": "Y",
        }
      }

      let resData = await this.common_postCall(sURL, postParam, headParam)

      if (this.mixin_isEmpty(resData)) {

        this.showAlert(this.MESSAGE.ERROR.GET_USER_LIST_FAIL);

      } else {

        let response = resData.DATA;

        let i = 0;
        let idx = this.USER_GRID_ITEMS.length + 1

        response.map(item => {
          response[i]["INDEX"] = idx++;
          if (response[i]["REG_DT"].indexOf('-') === -1) {
            response[i]["REG_DT"] = this.mixin_convertDate(response[i].REG_DT, 'yyyy-MM-dd');
            response[i]["CNTN_DT"] = this.mixin_convertDate(response[i].CNTN_DT, 'yyyy-MM-dd HH:mm:ss');
          }
          return i++;
        });

        this.USER_GRID_ITEMS = [...this.USER_GRID_ITEMS, ...response];

        if (resData.HEADER.next !== null && resData.HEADER.next !== undefined) {
          if (resData.HEADER.next === true) {
            this.nextDisabled = false;
          } else {
            this.nextDisabled = true;
          }
        }
        //이부분은 체크해볼것
        this.pagination.page += 1;
        // this.page=1;
      }
    },

    // 사용자 아이디 중복 체크
    async dpcnChk() {

      let sURL = '/api/setting/agent/manage/regist-user/dpnc-chk/inqire';
      let postParam = {
        LGN_ID: this.USER_PARAMS.LGN_ID,
      }
      let headParam = {
        head: {
          SERVICE: "setting.system.agent.manage",
          METHOD: "inqire",
          ASYNC: false,
          TYPE: "BIZ_SERVICE",
        },
      }

      // 입력폼의 사용자 ID validation 체크
      const isUserIdValid = this.validateRules.LGN_ID.every(rule => rule(this.USER_PARAMS.LGN_ID) === true);

      // 사용자 ID의 validation을 체크한 다음 api호출
      if (isUserIdValid) {

        let resData = await this.common_postCall(sURL, postParam, headParam)

        if (resData.HEADER.ERROR_FLAG) {
          this.showAlert(this.MESSAGE.ALERT.ALREADY_EXIST);
          this.USER_DPNC_CHK = false;
        } else {
          this.USER_DPNC_CHK = true;
          this.showAlert(this.MESSAGE.ALERT.USE_PSBLTY);
        }
      } else {
        // console.log('User rule unpassed!');
      }


    },
    dpncReset() {
      this.USER_DPNC_CHK = false;
    },


    // 사용자 상세정보, 정보등록 dialog
    openDialog(param) {

      switch (param) {

        case 'detail':
          this.USER_PARAMS.REG_YN = 'Y';
          this.click_detail();
          this.mixin_showDialog('RegDetail')
          break;

        case 'regist':
          this.mixin_showDialog('RegDetail')
          break;


      }
    },
    closeBtn() {
      this.mixin_hideDialog('RegDetail')
      this.initRegParam();
    },
    //row 선택
    rowSelect(item) {
      this.CHK_USER_INFO_ITEM = item;
      this.CHK_USER_GRID_ITEMS = [];
    },

    //row 선택 활성화
    isActiveRow(item) {
      const activeClass = item === this.CHK_USER_INFO_ITEM ? "active" : "";
      // const activeClass = item === this.CHK_USER_GRID_ITEMS ? "active" : "";
      return activeClass;
    },

    // 저장 버튼 클릭 시 validation 체크와 id 중복 체크를 만족하면 저장 메서드 호출
    saveBtn() {
      if(this.USER_PARAMS.LGN_ID.indexOf('#') > -1){
        switch (this.USER_PARAMS.REG_YN) {
  
          case 'Y':
            // MODIFY USER
            // 내선번호 정보 존재
            // console.log("this.USER_PARAMS.EXT_NOthis.USER_PARAMS.EXT_NOt",this.USER_PARAMS.EXT_NO)
            if(!this.mixin_isEmpty(this.USER_PARAMS.EXT_NO)) {
              // 사용자 상태를 휴직, 삭제로 변경 시
              // console.log("this.USER_PARAMS.EXT_NOthis.USER_PARAMS.EXT_NOt", this.USER_PARAMS.USER_STTS_CD)
              if (this.USER_PARAMS.USER_STTS_CD !== 'WORK') {
                this.showAlert(this.MESSAGE.CONFIRM.DELETE);
              }else{
                this.showAlert(this.MESSAGE.CONFIRM.MODIFY)
              }
            } else {
              this.showAlert(this.MESSAGE.CONFIRM.MODIFY)
            }
            break;
          case 'N':
            // 사용자 ID(LGN_ID) 중복체크
              if (this.USER_DPNC_CHK != true) {
                this.showAlert(this.MESSAGE.ALERT.INVALID_LGN_ID);
              } else {
                  this.showAlert(this.MESSAGE.CONFIRM.REGIST);
              }
            break;
        }
      }else{
        if (this.validate()) {
          // REGIST, MODIFY 분기
          switch (this.USER_PARAMS.REG_YN) {
  
            case 'Y':
              // MODIFY USER
              // 내선번호 정보 존재
              // console.log("this.USER_PARAMS.EXT_NOthis.USER_PARAMS.EXT_NOt",this.USER_PARAMS.EXT_NO)
              if(!this.mixin_isEmpty(this.USER_PARAMS.EXT_NO)) {
                // 사용자 상태를 휴직, 삭제로 변경 시
                // console.log("this.USER_PARAMS.EXT_NOthis.USER_PARAMS.EXT_NOt", this.USER_PARAMS.USER_STTS_CD)
                if (this.USER_PARAMS.USER_STTS_CD !== 'WORK') {
                  this.showAlert(this.MESSAGE.CONFIRM.DELETE);
                }else{
                  this.showAlert(this.MESSAGE.CONFIRM.MODIFY)
                }
              } else {
                this.showAlert(this.MESSAGE.CONFIRM.MODIFY)
              }
              break;
            case 'N':
              // 사용자 ID(LGN_ID) 중복체크
                if (this.USER_DPNC_CHK != true) {
                  this.showAlert(this.MESSAGE.ALERT.INVALID_LGN_ID);
                } else {
                    this.showAlert(this.MESSAGE.CONFIRM.REGIST);
                }
              break;
          }
        } else {
          // console.log("fail")
        }
      }

    },

    saveConfirm() {

      let DATA_FLAG = this.USER_PARAMS.REG_YN === 'N' ? 'I' : "U"

      this.getPswdEncKey(DATA_FLAG);
    },


    /*
    * 사용자 등록
    */

    async registUser(DATA_FLAG) {

      let sUrl = 'api/setting/agent/manage/regist';
      let postParam = {
        REG_USER_ID: this.CHK_USER_INFO_ITEM.USER_ID,                  // 기등록된 유저 ID
        USER_NM: this.USER_PARAMS.USER_NM,                             // 등록 유저 이름
        LGN_ID: this.USER_PARAMS.LGN_ID,                               // 로그인 ID
        CUSTCO_CUSL_ID: this.USER_PARAMS.CUSTCO_CUSL_ID,               // 고객사 사용자 ID
        EML: this.USER_PARAMS.EML,                                     // 이메일
        MBL_PHN_NO: this.USER_PARAMS.MBL_PHN_NO.replace(/[^0-9]/g, ""),                        // 전화번호
        USER_NNM: this.USER_PARAMS.USER_NNM,                           // 별칭
        AUTHRT_GROUP_ID: this.USER_PARAMS.AUTHRT_GROUP_SELECT,         // 권한 그룹
        JBTTL_CD: this.USER_PARAMS.JBTTL_CD,                           // 직책
        DEPT_ID: this.USER_PARAMS.SELECT_ORGZ_ARR.DEPT_ID,              // 소속 부서 ID
        DEPT_CHG_YN: this.USER_PARAMS.SELECT_ORGZ_ARR.DEPT_ID != this.NOW_DEPT_ID ? 'Y' : 'N',  //소속 부서 변경 여부
        USER_STTS_CD: this.USER_PARAMS.USER_STTS_CD,                   // 유저 상태
        CLBK_YN: this.USER_PARAMS.CLBK_YN,                             // 콜백사용여부
        RSVT_YN: this.USER_PARAMS.RSVT_YN,                             // 상담예약 배분여부
        STTS_EXPSR_MTHD_CD: this.USER_PARAMS.STTS_EXPSR_MTHD_CD,       // 모니터링 표시 방법 코드
        DPCN_LGN_PM_YN: this.USER_PARAMS.DPCN_LGN_PM_YN,                             // 콜백사용여부
        JNCMP_YMD: this.dateToStr(this.startDate),                     // 입사일자
        RSGNTN_YMD: this.endDate === '' ? '' : this.dateToStr(this.endDate).trim(),                      // 퇴사일자
        USE_YN: this.USER_PARAMS.USER_STTS_CD === 'WORK' ? 'Y' : 'N',      // 사용여부
        // PSWD : PSWD,                                                 // 암호화된 비밀번호
        DATA_FLAG: DATA_FLAG,                                          // DATA_FLAG
        USER_EXPLN : this.USER_PARAMS.USER_EXPLN,                      // 사용자 설명
        // strEncryptKey : EncKey,                                     // 암호화키

      }
      let chk_authrt_group_change = "N";
      // 개인정보 변경 체크.
      if( postParam.USER_NM != this.CHK_USER_INFO_ITEM.USER_NM) this.saveCustDataDiff.push("이름");
      if( postParam.EML != this.CHK_USER_INFO_ITEM.EML) this.saveCustDataDiff.push("이메일");
      if( postParam.MBL_PHN_NO != this.CHK_USER_INFO_ITEM.MBL_PHN_NO) this.saveCustDataDiff.push("전화번호");
      if( postParam.USER_NNM != this.CHK_USER_INFO_ITEM.USER_NNM) this.saveCustDataDiff.push("닉네임");
      if( postParam.AUTHRT_GROUP_ID != this.CHK_USER_INFO_ITEM.AUTHRT_GROUP_ID)
      {
        this.saveCustDataDiff.push("권한 그룹");
        if(DATA_FLAG === "U"){
          chk_authrt_group_change = "Y";
        }
      }
      if( postParam.JBTTL_CD != this.CHK_USER_INFO_ITEM.JBTTL_CD) this.saveCustDataDiff.push("직책");
      if( postParam.DEPT_ID != this.CHK_USER_INFO_ITEM.DEPT_ID) this.saveCustDataDiff.push("소속");
      if( postParam.JNCMP_YMD != this.CHK_USER_INFO_ITEM.JNCMP_YMD) this.saveCustDataDiff.push("입사 일자");
      if( postParam.RSGNTN_YMD != this.CHK_USER_INFO_ITEM.RSGNTN_YMD) this.saveCustDataDiff.push("퇴사 일자");
      if( postParam.CLBK_YN != this.CHK_USER_INFO_ITEM.CLBK_YN) this.saveCustDataDiff.push("콜백 여부");
      if( postParam.RSVT_YN != this.CHK_USER_INFO_ITEM.RSVT_YN) this.saveCustDataDiff.push("상담예약 배분여부");
      if( postParam.STTS_EXPSR_MTHD_CD != this.CHK_USER_INFO_ITEM.STTS_EXPSR_MTHD_CD) this.saveCustDataDiff.push("모니터링 표시 방법");
      if( postParam.DPCN_LGN_PM_YN != this.CHK_USER_INFO_ITEM.DPCN_LGN_PM_YN) this.saveCustDataDiff.push("중복로그인허용 여부");
      if( postParam.USER_STTS_CD != this.CHK_USER_INFO_ITEM.USER_STTS_CD) this.saveCustDataDiff.push("사용자 상태");
      if( postParam.USER_EXPLN != this.CHK_USER_INFO_ITEM.USER_EXPLN) this.saveCustDataDiff.push("사용자 설명");
      postParam.PRVC_CN = this.saveCustDataDiff.join(",");
      postParam.CHK_AUTHRT_CHG = chk_authrt_group_change;


      let headParam ={
            head:{
            },
      };

      let resData = await this.common_postCall(sUrl,postParam,headParam);

      if(resData.HEADER.ERROR_FLAG){
        if(!this.mixin_isEmpty(resData.HEADER.ERROR_MSG)){
          this.showAlert({alertDialogToggle: true, msg: resData.HEADER.ERROR_MSG, iconClass: 'is-caution', type: 'default'});
        }else{
          this.showAlert(this.MESSAGE.ERROR.REG_USER_FAIL);
        }
      }else{
        // this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS)
        // this.initRegParam();
        this.closeMsg();
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeBtn();
        this.srchUser();
        return ;
      }
    },

    // 저장/수정 form valiate 체크
    validate() {
      return this.$refs.form.validate();
    },

    // 저장/수정 form validate reset
    resetValidation() {
      if(this.$refs.form != undefined) this.$refs.form.resetValidation();
    },

    //조직
    setOgnzData() {
      this.USER_PARAMS.SELECT_ORGZ_ARR = this.$refs.ognzDataCompo.setOgnzData();
      this.mixin_hideDialog('OrgTree')
    },

    // alert창 닫기
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    strToDate(date) {
      let year = date.slice(0, 4);
      let month = date.slice(4, 6);
      let day = date.slice(6, 8);
      let hour = date.slice(8, 10);
      let min = date.slice(10, 12);
      return `${year}-${month}-${day}`;
    },

    dateToStr(dateString) {
      if(dateString == '') {
        return dateString;
      }
      let year = dateString.slice(0, 4);
      let month = dateString.slice(5, 7);
      let day = dateString.slice(8, 10);

      // Format the date as "YYYYMMDDHHmmss" string
      const formattedDate = `${year}${month}${day}`;
      return formattedDate;
    },


    /**********************************************

     * 사용자 비밀번호 초기화, 잠금 해제

     ***********************************************/

    resetBtn(DATA_FLAG) {
      let chkPswdFailCnt = 0;

      for (let i = 0; i < this.CHK_USER_GRID_ITEMS.length; i++) {
        if (this.CHK_USER_GRID_ITEMS[i].PSWD_FAIL_CNT !== '5') {
          chkPswdFailCnt++
        }
      }

      if (!this.mixin_isEmpty(this.CHK_USER_GRID_ITEMS)) {
        switch (DATA_FLAG) {
          case 'reset':
            this.showAlert(this.MESSAGE.CONFIRM.RESET_PSWD)
            break;
          case 'unlock' :
            if (chkPswdFailCnt !== 0) {
              this.showAlert(this.MESSAGE.ALERT.PSWD_FAIL_CNT_INVALID)
            } else {
              this.showAlert(this.MESSAGE.CONFIRM.UNLOCK_PSWD);
            }
            break;
        }
      } else {
        this.showAlert(this.MESSAGE.ERROR.RESET_USER_PSWD_CHK)
      }
    },
    resetPswdRtn() {
      this.resetPswd('reset');
    },
    unlockPswdRtn() {
      this.resetPswd('unlock');
    },
    async resetPswd(DATA_FLAG) {

      let strEncryptKey = '';
      let strPassWD = '';
      let post_user_id = '';
      let post_lgn_id = '';

      /*       for(let i = 0; i<this.CHK_USER_GRID_ITEMS.length; i++){
              strEncryptKey[i] = this.CHK_USER_GRID_ITEMS[i].PSWD_ENCPT_CD;
              strPassWD[i] = this.CHK_USER_GRID_ITEMS[i].LGN_ID;
              NEW_PWD[i] = this.common_aesEncrypt(strPassWD, strEncryptKey);
            }
       */

      /*         strEncryptKey = this.CHK_USER_GRID_ITEMS[0].PSWD_ENCPT_CD;
              strPassWD = this.CHK_USER_GRID_ITEMS[0].LGN_ID;


              let NEW_PWD = await this.common_aesEncrypt(strPassWD, strEncryptKey); */

      let postParam = {
        RESET_USER_ID: this.CHK_USER_GRID_ITEMS[0].USER_ID,
        RESET_LGN_ID: this.CHK_USER_GRID_ITEMS[0].LGN_ID,
        TASK_SE_CD: DATA_FLAG === 'reset' ? 'RESET' : 'UNLOCK',
      }

      let sUrl = DATA_FLAG == 'reset' ? 'api/setting/agent/manage/password-initl/process' : 'api/setting/agent/manage/password-lock-initl/process';

      // let postParam =[];
      //     for(let i=0; i<this.CHK_USER_GRID_ITEMS.length ; i++){
      //       postParam[i] = {
      //       RESET_USER_ID : this.CHK_USER_GRID_ITEMS[i].USER_ID,
      //       RESET_LGN_ID : this.CHK_USER_GRID_ITEMS[i].LGN_ID,
      //       ENCRYPT_KEY : strEncryptKey[i],
      //       NEW_PWD :NEW_PWD[i],
      //       }
      //     }

      let headParam = {
        head: {}
      };
      let resData = await this.common_postCall(sUrl, postParam, headParam);
      if (resData.HEADER.ERROR_FLAG) {
        this.showAlert(this.MESSAGE.ERROR.RESET_USER_PSWD_FAIL)
      } else {
        // this.showAlert(this.MESSAGE.ALERT.RESET_PSWD_SUCCESS)
        this.closeMsg();
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.CHK_USER_GRID_ITEMS = [];
        this.initRegParam();
        this.closeBtn();
        this.srchUser();
      }
    },

    //암호화 모듈
    common_aesEncrypt(strPassWD, strEncryptKey) {
      //생성된 암호화 키 정보를 사용하여 ID와 password필드값을 AES 256bit 알고리즘을 이용하여 암호화한다.
      return gibberish.aesEncrypt(strPassWD, strEncryptKey);
    },


    // 비밀번호 암호화 키
    async getPswdEncKey(DATA_FLAG) {

      let sUrl = 'auth-api/password-encpt/process';

      let postParam = {

        username: this.USER_PARAMS.LGN_ID,

      };

      let headParam = {
        head: {
          passwordProcess: 'passwordProcess',
          DATA_FLAG: DATA_FLAG,

        }
      };

      let resData = await this.common_postCall(sUrl, postParam, headParam);

      if (resData.HEADER.ERROR_FLAG) {

        this.showAlert(this.MESSAGE.ERROR.GET_PSWD_ENC_KEY_FAIL)

      } else {

        this.ENCRYPT_KEY = resData.DATA[0].ENCRYPT_KEY;
        this.EncryptPswd(resData, DATA_FLAG);
      }
    },


    // 비밀번호 암호화
    EncryptPswd(resData, DATA_FLAG) {
      let strEncryptKey = resData.DATA[0].ENCRYPT_KEY;
      let strPswd = '';
      if (strEncryptKey === "") {
        return;
      }
      if (!this.mixin_isEmpty(DATA_FLAG)) {
        strPswd = this.USER_PARAMS.LGN_ID;
      }
      let PSWD = this.common_aesEncrypt(strPswd, strEncryptKey)

      switch (DATA_FLAG) {

        case "I" :
          this.registUser(DATA_FLAG, PSWD);
          break;

        case "U" :
          this.registUser(DATA_FLAG, PSWD, strEncryptKey)
          break;

        case "reset":
          break;
      }
    },

    forceResetPwd() {
      this.dialogForcePwdChange = true;
      this.mixin_showDialog('ForcePwdChange');
    },

    async forceResetPwdProc() {

      let arrUserId = [];
      if(this.CHK_USER_GRID_ITEMS.length > 0){
        this.CHK_USER_GRID_ITEMS.forEach((user, idx) => {
          arrUserId.push({TARGET_USER_ID: user.USER_ID, TARGET_LGN_ID : user.LGN_ID});
        });
      }

      if(arrUserId.length === 0){
        this.showAlert(this.MESSAGE.ALERT.USER_CHECK_LIST_EMPTY);
        return;
      }

      if(!this.FORCE_PWD){
        this.showAlert(this.MESSAGE.ALERT.FORCE_PWD_EMPTY);
        return;
      }

      let postParam = {
        RESET_PWD_TXT : this.FORCE_PWD
        , arrUserId: arrUserId
      }

      let sUrl = '/api/setting/agent/forceUpdatePassword';

      let headParam = {
        head: {}
      };
      let resData = await this.common_postCall(sUrl, postParam, headParam);
      if (resData.HEADER.ERROR_FLAG) {
        this.showAlert(this.MESSAGE.ERROR.RESET_USER_PSWD_FAIL)
      } else {
        this.closeMsg();
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        // this.showAlert(this.MESSAGE.ALERT.RESET_PSWD_SUCCESS)
        this.CHK_USER_GRID_ITEMS = [];
        this.initRegParam();
        this.closeBtn();
        this.srchUser();

        this.closeForcePwd();
      }
    },

    closeForcePwd() {
      this.mixin_hideDialog('ForcePwdChange')
      this.dialogForcePwdChange = false;
      this.FORCE_PWD = '';
    },

  },
}
</script>

<style lang="scss" scoped>

</style>