<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <!-- <span class="pl-label">
                진행 기간
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <div class="pl-calendar-range-form">
                  <compo-date-picker DateType="dateInput" :DateProp.sync="startDate" />
                  <span class="pl-unit">~</span>
                  <compo-date-picker DateType="dateInput" :DateProp.sync="endDate" />
                  <compo-drop-picker :StartDateProp.sync="startDate" :EndDateProp.sync="endDate" />
                </div>
              </div> -->
              <span class="pl-label">
                진행 년도
              </span>
              <div class="pl-desc">
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    :items="cpiYrItems"
                    v-model="CPI_YR"
                    @change="getCpiNm"
                    placeholder="선택하세요"
                  ></v-select>
                </div>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">진행 상태</span>
              <div class="pl-desc">
                <v-select
                  :items="mixin_common_code_get(this.common_code, 'CMPN_ST', '전체')"
                  class="pl-form"
                  @change="getCpiNm"
                  placeholder="선택하세요"
                  v-model="PRGRS_STTS_CD"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">계획 구분</span>
              <div class="pl-desc">
                <v-select
                  :items="mixin_common_code_get(this.common_code, 'CMPN_CL', '전체')"
                  placeholder="선택하세요"
                  v-model="PLAN_SE_CD"
                  @change="getCpiNm"
                  class="pl-form"
                ></v-select>
              </div>
            </div>
            <!-- <div class="pl-form-inline">
              <span class="pl-label">세부 구분</span>
              <div class="pl-desc">
                <v-select :items="dropItems3" class="pl-form"></v-select>
              </div>
            </div> -->
            <div class="pl-form-inline">
              <span class="pl-label">캠페인 명</span>
              <div class="pl-desc">
                <v-select
                  :items="cpiNmItems"
                  v-model="CPI_NM"
                  @change="btnSelectList"
                  placeholder="선택하세요"
                  class="pl-form is-lg"
                ></v-select>
              </div>
            </div>
            <v-btn class="pl-btn is-icon" @click="btnSelectList">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <!-- info -->
      <div class="pl-card">
        <ul class="pl-list-info2">
          <li v-for="item in TOP_INFO" :key="item.id" style="max-width: 250px">
            <span class="pl-list-info-title">{{ item.title }}</span>
            <strong class="pl-list-info-desc" :class="item.class">{{ item.desc }}</strong>
          </li>
        </ul>
        <div class="d-flex is-mt-m">
          <ul class="pl-list-info3">
            <li v-for="(item, index) in TOP_INFO2" :key="index" :class="index === 4 ? 'ml-8' : ''"
              style="max-width: 250px">
              <strong class="pl-list-info-desc" :class="item.class">{{ item.desc }}</strong>
              <span class="pl-list-info-title">{{ item.title }}</span>
            </li>
          </ul>
          <div class="pl-btn-wrap ml-2">
            <v-btn class="pl-btn is-lg" @click="saveAltmnt" :loading="load1" :disabled="isDisabled">
              <span class="pl-icon30 div-share mr-2"></span>
              배분하기
            </v-btn>
            <v-btn class="pl-btn is-lg" @click="setAvrPush" :loading="load2" :disabled="isDisabled">
              <span class="pl-icon30 div-equal mr-2"></span>
              균등배분
            </v-btn>
          </div>

        </div>
      </div>
      <!-- grid -->
      <div class="pl-cols is-border flex-grow-1">
        <!-- left -->
        <div class="is-col-fix is-vrt" style="width: 55%">
          <div class="pl-card">
            <div class="pl-grid-top">
              <div class="pl-grid-top-left">
                <strong class="pl-search-header-tit">배분 현황</strong>
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter">전체 <em class="pl-1">({{ gridDataCuslText.length }})</em> 건</span>
                <!-- <v-btn-toggle v-model="viewSorting" class="pl-btn-group">
                  <template v-for="item in btnGroupSort">
                    <compo-tooltip-btn :key="item.id" :TitleProp="item.title" ClassProp="pl-btn"
                      :IconProp="`pl-icon20 ${item.icon}`" TooltipPositionProp="bottom"
                      @btnClick="() => FnBtnPath(item.evt)"></compo-tooltip-btn>
                  </template>
                </v-btn-toggle> -->
                <!-- 개별회수 버튼 -->
                <compo-tooltip-btn v-if="!isDisabled"
                  TitleProp="개별회수"
                  ClassProp="pl-tooltip-btn is-line"
                  IconProp="pl-icon20 div-get"
                  TooltipPositionProp="bottom"
                  @btnClick="cuslReturn('indi')"/>
                  <!-- 전체회수 버튼 -->
                <compo-tooltip-btn v-if="!isDisabled"
                  TitleProp="전체회수"
                  ClassProp="pl-tooltip-btn is-line"
                  IconProp="pl-icon20 div-share"
                  TooltipPositionProp="bottom"
                  @btnClick="cuslReturn('all')"/>
                  <!-- 인수인계 버튼 -->
                <compo-tooltip-btn v-if="!isDisabled"
                  TitleProp="인수인계"
                  ClassProp="pl-tooltip-btn is-line"
                  IconProp="pl-icon20 div-chk"
                  TooltipPositionProp="bottom"
                  @btnClick="userFind"/>
                <!-- 사용자 찾기 모달 -->
                <v-dialog
                  v-model="dialogUserFind"
                  content-class="dialog-draggable is-lg"
                  hide-overlay>
                  <div class="draggable-area">drag area</div>
                  <compo-dialog
                    header-title="사용자 찾기"
                    @hide="mixin_hideDialog('UserFind')"
                  >
                    <template slot="body">
                      <!-- component -->
                      <compo-find-cus
                        SearchTitleProp="사용자 찾기"
                        :SearchDataProp="DropUser"
                        :SearchInputProp.sync="SRCH_USER_NM"
                        :DataHeaderProp="HeadersFindUser"
                        :DataBodyProp="ItemsFindUser"
                        MultiSelYnProp="false"
                        :FindData="SRCH_USER"
                        @input="SRCH_USER = $event"
                        @findData="[mixin_hideDialog('UserFind'),setCusl()]"
                      />
                    </template>
                    <template slot="footer">
                      <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('UserFind')">닫기</v-btn>
                      <v-btn class="pl-btn" @click="[mixin_hideDialog('UserFind'),setCusl()]">확인</v-btn>
                    </template>
                  </compo-dialog>
                </v-dialog>

                <!-- 엑셀 다운로드 버튼 -->
                <compo-excel
                  TypeProp="Download"
                  :DataHeaderProp="gridDataCuslHeaders"
                  :DataBodyProp="gridDataCuslText"
                  :FileNameProp="EXCEL_DOWN_NM+'_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                  :SheetNameProp="EXCEL_DOWN_NM"
                  HeaderColorProp="00B0F0"
                ></compo-excel>
              </div>
            </div>
            <v-data-table
              class="pl-grid has-control is-hover"
              show-select
              :headers="gridDataCuslHeaders"
              :items="gridDataCuslText"
              v-model="gridSelectedData"
              fixed-header
              item-key="ROW_NUMBER"
              height="432px"
              :items-per-page="ROW_PER_PAGE"
              @click:row="setGridSelect"
              hide-default-footer
              :page.sync="page"
              no-data-text="등록된 데이터가 없습니다."
              @page-count="pageCount = $event">
              <template v-if="!isDisabled" v-slot:item.ADDRE={item}>
                <v-text-field
                  class="pl-form"
                  type="number"
                  hide-spin-buttons
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                  :value="item.ADDRE"
                  v-model="item.ADDRE"
                  :disabled="item.EXL_RSN_CD != '1' ? true : false"
                  @blur="chkAddre(item)"
                ></v-text-field>
              </template>
              <template v-slot:item.EXL_RSN_CD={item}>
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(common_code, 'CMPN_EXP_TP', '')"
                  :value="item.EXL_RSN_CD"
                  v-model="item.EXL_RSN_CD"
                  @change="updateExlRsn(item, $event)"
                  @click="setPreExlRsn(item, $event)"
                  :disabled="isDisabled"
                ></v-select>
              </template>
            </v-data-table>
          </div>
        </div>
        <!-- right -->
        <div class="is-col-fix is-vrt" style="width: 45%">
          <div class="pl-card">
            <div class="pl-grid-top">
              <div class="pl-grid-top-left">
                <strong class="pl-search-header-tit">({{ CUS_NAME }})님에 배분된 정보</strong>
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter">전체 <em class="pl-1">({{ gridDataCustText.length }})</em> 건</span>
                <!-- <v-btn-toggle v-model="viewSorting2" class="pl-btn-group">
                  <template v-for="item in btnGroupSort2">
                    <compo-tooltip-btn :key="item.id" :TitleProp="item.title" ClassProp="pl-btn"
                      :IconProp="`pl-icon20 ${item.icon}`" TooltipPositionProp="bottom"
                      @btnClick="() => FnBtnPath(item.evt)"></compo-tooltip-btn>
                  </template>
                </v-btn-toggle> -->
                <!-- 개별 추가 버튼 -->
                <compo-tooltip-btn v-if="!isDisabled"
                  TitleProp="개별 추가"
                  ClassProp="pl-tooltip-btn is-line"
                  IconProp="pl-icon20 div-set"
                  TooltipPositionProp="bottom"
                  @btnClick="indiCustAdd"/>
                <!-- 상담직원 변경 버튼 -->
                <compo-tooltip-btn v-if="!isDisabled"
                  TitleProp="상담직원 변경"
                  ClassProp="pl-tooltip-btn is-line"
                  IconProp="pl-icon20 div-link"
                  TooltipPositionProp="bottom"
                  @btnClick="cuslChange"/>
                <!-- 사용자 찾기 모달 -->
                <v-dialog
                  v-model="dialogUserFind2"
                  content-class="dialog-draggable is-lg"
                  hide-overlay>
                  <div class="draggable-area">drag area</div>
                  <compo-dialog
                    header-title="사용자 찾기"
                    @hide="mixin_hideDialog('UserFind2')"
                  >
                    <template slot="body">
                      <!-- component -->
                      <compo-find-cus
                        SearchTitleProp="사용자 찾기"
                        :SearchDataProp="DropUser2"
                        :SearchInputProp.sync="SRCH_USER_NM2"
                        :DataHeaderProp="HeadersFindUser2"
                        :DataBodyProp="ItemsFindUser2"
                        MultiSelYnProp="false"
                        :FindData="SRCH_USER2"
                        @input="SRCH_USER2 = $event"
                        @findData="[mixin_hideDialog('UserFind2'),setCuslChange()]"
                      />
                    </template>
                    <template slot="footer">
                      <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('UserFind2')">닫기</v-btn>
                      <v-btn class="pl-btn" @click="[mixin_hideDialog('UserFind2'),setCuslChange()]">확인</v-btn>
                    </template>
                  </compo-dialog>
                </v-dialog>
                <!-- 엑셀 다운로드 버튼 -->
                <compo-excel
                  TypeProp="Download"
                  :DownReason=true
                  :DataHeaderProp="gridDataCustHeaders"
                  :DataBodyProp="gridDataCustText"
                  :FileNameProp="EXCEL_DOWN_NM2+'_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                  :SheetNameProp="EXCEL_DOWN_NM2"
                  HeaderColorProp="00B0F0"
                ></compo-excel>
              </div>
            </div>
            <v-data-table
              class="pl-grid has-control"
              :headers="gridDataCustHeaders"
              :items="gridDataCustText"
              show-select
              fixed-header
              v-model="gridSelectedData2"
              item-key="ROW_NUMBER"
              height="432px"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              :page.sync="page"
              no-data-text="등록된 데이터가 없습니다."
              @page-count="pageCount = $event">
              <template v-slot:item.CUST_NM="{ item }">
                {{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(item.CUST_NM) : item.CUST_NM }}
              </template>
              <template v-slot:item.CUST_PHN_NO="{ item }">
                {{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(item.CUST_PHN_NO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(item.CUST_PHN_NO.replace(/[^0-9]/g, "")) }}
              </template>
            </v-data-table>
          </div>
        </div>
      </div>
    </div>
    <!-- dialog -->
    <v-dialog v-model="dialogAddOne" content-class="dialog-draggable" hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog header-title="개별 추가" @hide="mixin_hideDialog('AddOne')">
        <template slot="body">
          <v-form ref="form">
            <p>필수 항목을 입력하신 후 <strong>[저장] 버튼을 클릭</strong>하십시오.</p>
            <p>계획 회차는 캠페인 계획 등록 시 설정된 값이 지정됩니다.</p>

            <div class="pl-chatting-cs-info is-mt-m">
              <div class="pl-chatting-cs-info-manager">
                <div v-for="item in CAMPAIGN_INFO" :key="item.id">
                  <strong class="pl-chatting-cs-info-tit">{{ item.title }}</strong>
                  <span class="pl-chatting-cs-info-desc" :class="item.class">{{ item.desc }}</span>
                </div>
              </div>
              <div class="pl-chatting-cs-info-cus">
                <div>
                  <strong class="pl-chatting-cs-info-tit">추가할 상담직원</strong>
                  <span class="pl-chatting-cs-info-desc">{{ CUSL_NM }}</span>
                </div>
                <div>
                  <strong class="pl-chatting-cs-info-tit">부서</strong>
                  <span class="pl-chatting-cs-info-desc">{{ DEPT_NM }}</span>
                </div>
              </div>

            </div>

            <h2 class="pl-dialog-body-tit-h2 is-border">추가할 고객 정보</h2>
            <div class="pl-form-inline-wrap vertical mt-2" style=" overflow: auto; height: 290px; ">
              <div class="pl-form-inline">
                <span class="pl-label">
                  고객명
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    v-model="CUST_NM"
                    required
                    :rules="validateRules.CUST_NM"
                    v-byte-counter="300"
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
                    v-model="PHONE_NO"
                    oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                    required
                    :rules="validateRules.PHONE_NO"
                    v-byte-counter="60"
                  />
                </div>
              </div>
              <div
                v-for="(expsnAttr, seq) in EXPSN_ATTR"
                :key="expsnAttr.ATTR_ID"
                class="pl-form-inline">
                <span class="pl-label">
                  {{ expsnAttr.EXPSN_ATTR_NM }}
                  <v-icon v-show="expsnAttr.ESNTL_YN === 'Y'" class="pl-icon20 required"></v-icon> <!-- 필수 입력인 경우  -->
                </span>
              <div class="pl-desc">
                <template v-if="editable">
                  <!-- 필수고 단일 선택형인 경우 -->
                  <v-select
                    v-if="expsnAttr.DATA_TYPE_CD === 'COE' && expsnAttr.ESNTL_YN === 'Y'"
                    v-model="expsnAttr.V_MODEL"
                    class="pl-form"
                    :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                    :items="mixin_common_code_get(dynamic_comCode, expsnAttr.GROUP_CD_ID)"
                    placeholder="선택하세요"
                    required
                    :rules="validateRules.V_MODEL"
                  />
                  <!-- 단일 선택형인 경우 -->
                  <v-select
                    v-else-if="expsnAttr.DATA_TYPE_CD === 'COE'"
                    v-model="expsnAttr.V_MODEL"
                    class="pl-form"
                    :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                    :items="mixin_common_code_get(dynamic_comCode, expsnAttr.GROUP_CD_ID)"
                    placeholder="선택하세요"
                  />
                  <!-- 필수고 문자형인 경우 -->
                  <v-text-field
                    v-else-if="expsnAttr.DATA_TYPE_CD === 'TXT' && expsnAttr.ESNTL_YN === 'Y'"
                    v-model="expsnAttr.V_MODEL"
                    class="pl-form"
                    :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                    :maxlength="expsnAttr.DATA_LEN"
                    placeholder=""
                    :required="expsnAttr.ESNTL_YN === 'Y'"
                    :rules="validateRules.V_MODEL"
                    v-byte-counter="expsnAttr.DATA_LEN"
                  />
                  <!-- 문자형인 경우 -->
                  <v-text-field
                    v-else-if="expsnAttr.DATA_TYPE_CD === 'TXT'"
                    v-model="expsnAttr.V_MODEL"
                    class="pl-form"
                    :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                    :maxlength="expsnAttr.DATA_LEN"
                    placeholder=""
                    v-byte-counter="expsnAttr.DATA_LEN"
                  />
                  <!-- 필수고 숫자형인 경우 -->
                  <v-text-field
                    v-else-if="expsnAttr.DATA_TYPE_CD === 'NUM' && expsnAttr.ESNTL_YN === 'Y'"
                    v-model="expsnAttr.V_MODEL"
                    class="pl-form"
                    :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                    :maxlength="expsnAttr.DATA_LEN"
                    hide-spin-buttons
                    type="number"
                    oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                    placeholder="숫자만 입력 가능 합니다."
                    :required="expsnAttr.ESNTL_YN === 'Y'"
                    :rules="validateRules.V_MODEL"
                    v-byte-counter="expsnAttr.DATA_LEN"
                  />
                  <!-- 숫자형인 경우 -->
                  <v-text-field
                    v-else-if="expsnAttr.DATA_TYPE_CD === 'NUM'"
                    v-model="expsnAttr.V_MODEL"
                    class="pl-form"
                    :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                    :maxlength="expsnAttr.DATA_LEN"
                    hide-spin-buttons
                    type="number"
                    oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                    placeholder="숫자만 입력 가능 합니다."
                    v-byte-counter="expsnAttr.DATA_LEN"
                  />
                  <!-- 필수고 숫자형이면서 comma가 포함인 경우 -->
                  <v-text-field
                    v-else-if="expsnAttr.DATA_TYPE_CD === 'NUM_COMMA' && expsnAttr.ESNTL_YN === 'Y'"
                    v-model="expsnAttr.V_MODEL"
                    class="pl-form"
                    :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                    :maxlength="expsnAttr.DATA_LEN"
                    hide-spin-buttons
                    type="text"
                    oninput="javascript: this.value = this.value.replace(/[^,.0-9]/g, '' ).replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');"
                    placeholder="숫자만 입력 가능 합니다."
                    :required="expsnAttr.ESNTL_YN === 'Y'"
                    :rules="validateRules.V_MODEL"
                    v-byte-counter="expsnAttr.DATA_LEN"
                  />
                  <!-- 숫자형이면서 comma가 포함인 경우 -->
                  <v-text-field
                    v-else-if="expsnAttr.DATA_TYPE_CD === 'NUM_COMMA'"
                    v-model="expsnAttr.V_MODEL"
                    class="pl-form"
                    :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                    :maxlength="expsnAttr.DATA_LEN"
                    hide-spin-buttons
                    type="text"
                    oninput="javascript: this.value = this.value.replace(/[^,.0-9]/g, '' ).replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');"
                    placeholder="숫자만 입력 가능 합니다."
                    v-byte-counter="expsnAttr.DATA_LEN"
                  />
                </template>
                <template v-else>
                  {{ expsnAttr.DATA_TYPE_CD === 'COE' ? expsnAttr.CD_NM : mixin_encodeEnter(expsnAttr.ATTR_VL) }}
                </template>
              </div>
              </div>
              <!--<div class="pl-form-inline">
                <span class="pl-label">
                  성별
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-select class="pl-form" :items="dropItemsS01" placeholder="선택하세요"></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  연령
                </span>
                <div class="pl-desc">
                  <v-text-field class="pl-form" />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  지역
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-select class="pl-form" :items="dropItemsS02" placeholder="선택하세요"></v-select>
                </div>
              </div>

              <div class="pl-form-inline">
                <span class="pl-label">
                  휴대 전화번호
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-text-field class="pl-form" />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  자택 전화번호
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-text-field class="pl-form" />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  직장 전화번호
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-text-field class="pl-form" />
                </div>
              </div> -->

            </div>
          </v-form>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('AddOne');formReset();">닫기</v-btn>
          <v-btn class="pl-btn" @click="saveIndiCust">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <v-dialog
      v-model="dialogFindPost"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="우편번호 검색"
        @hide="mixin_hideDialog('FindPost')"
      >
        <template slot="body">
          component
          <compo-find-post
            @selected-post="getFindPost"
          />
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "MENU_CSL_M0503", //name은 'MENU_' + 파일명 조합

  components: {

  },
  data() {
    return {
      dialogUserFind: false,    //사용자검색모달
      DropUser: {},             //드롭박스 데이터
      HeadersFindUser: [],      //사용자검색모달 헤더
      ItemsFindUser:[],         //사용자검색모달 그리드 데이터
      SRCH_USER:[],             //사용자 조회모달에서 가져온 데이터
      SRCH_USER_NM: '',         //조회사용자명

      dialogUserFind2: false,    //사용자검색모달
      DropUser2: {},             //드롭박스 데이터
      HeadersFindUser2: [],      //사용자검색모달 헤더
      ItemsFindUser2:[],         //사용자검색모달 그리드 데이터
      SRCH_USER2:[],             //사용자 조회모달에서 가져온 데이터
      SRCH_USER_NM2: '',         //조회사용자명

      editable : true,
      EXPSN_ATTR : [],
      dialogFindPost: false,

      // top search
      dropItems3: [],
      cpiYrItems: [],
      cpiNmItems: [],
      common_code: [],
      dynamic_comCode: [],

      // dialog
      dialogAddOne: false,
      dropItemsS01: [],
      dropItemsS02: [],
      CAMPAIGN_INFO: [
        {
          title: '켐페인명',
          desc: '',
        },
        {
          title: '계획구분',
          desc: '',
        },
        {
          title: '배분여부',
          desc: '',
        },
        {
          title: '진행상태',
          desc: '',
          class: 'is-txt-main'
        },
      ],

      test: ['A','B','C'],
      // info
      TOP_INFO : [
        {
          title: '아웃바운드 명',
          desc: '　',     // 높이때문에 일부로 공백줌
          class: '',
        },
        {
          title: '진행기간',
          desc: '',
          class: '',
        },
        {
          title: '계획 회 차',
          desc: '',
          class: '',
        },
        {
          title: '진행상태',
          desc: '',
          class: 'is-txt-main',
        },
        {
          title: '등록자',
          desc: '',
          class: '',
        },
        {
          title: '등록일',
          desc: '',
          class: '',
        },
      ],
      TOP_INFO2 : [
        {
          title: '총 대상자',
          desc: '',
          class: 'is-txt-main',
        },
        {
          title: '배분 건수',
          desc: '',
          class: '',
        },
        {
          title: '미배분 건수',
          desc: '',
          class: 'is-txt-error',
        },
        {
          title: '평균 배분 건수',
          desc: '',
        },
        {
          title: '상담직원 수',
          desc: '',
          class: 'is-txt-main',
        },
        {
          title: '배분된 상담직원 수',
          desc: '',
        },
        {
          title: '미배분 상담직원 수',
          desc: '',
          class: 'is-txt-error',
        },
      ],
      load1: false,
      load2: false,
      isDisabled: false,


      // 배분현황
      viewSorting: null, //초기 selected 값
      btnGroupSort: [
        { icon: 'pl-icon20 div-get', title: '개별회수', evt: () => { this.mixin_testLog("개별회수") } },
        { icon: 'pl-icon20 div-share', title: '전체회수', evt: () => { this.mixin_testLog("전체회수") } },
        { icon: 'pl-icon20 div-chk', title: '인수인계', evt: () => { this.mixin_testLog("인수인계btnClick") } },
      ],

      // 배분된 정보
      viewSorting2: null, //초기 selected 값
      btnGroupSort2: [
        { icon: 'pl-icon20 div-set', title: '개별 추가', evt: () => { this.mixin_showDialog('AddOne') } },
        { icon: 'pl-icon20 div-link', title: '상담직원 변경', evt: () => { this.mixin_testLog("상담직원 변경") } },
      ],
      CUS_NAME: '',

      CPI_YR : '',
      CPI_NM : '',
      PRGRS_STTS_CD : '',
      PLAN_SE_CD : '',
      PRE_EXL_RSN_CD : '',
      CUSL_NM : '',
      DEPT_NM : '',
      CUST_NM : '',
      PHONE_NO : '',

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15, 30, 50, 100],
      ROW_PER_PAGE: -1,
      gridDataCuslHeaders: [
        { text: '번호',       value: 'ROW_NUMBER',    align: 'center',    width: '70px' },
        { text: '권한명',     value: 'AUTHRT_GROUP_NM',       align: 'left',    width: '120px' },
        { text: '상담직원',   value: 'USER_NM',       align: 'left',    width: '110px' },
        { text: '아이디',     value: 'LGN_ID',        align: 'left',    width: '110px' },
        { text: '배분건수',   value: 'CUSL_ALT',      align: 'center',    width: '90px' },
        { text: '처리완료',   value: 'CMPTN',         align: 'center',    width: '90px' },
        { text: '미시도',     value: 'UN_CMPTN',      align: 'center',    width: '80px' },
        { text: '추가/회수',  value: 'ADDRE',         align: 'center',    width: '95px' },
        { text: '제외',       value: 'EXL_RSN_CD',    align: 'center',    width: '110px' },
        { text: '상담직원ID', value: 'CUSL_ID',         align: ' d-none' },
        { text: '캠페인ID',   value: 'CPI_ID',          align: ' d-none' },
        { text: '캠페인명',   value: 'CPI_NM',          align: ' d-none' },
        { text: '계획구분',   value: 'PLAN_SE_NM',      align: ' d-none' },
        { text: '진행상태',   value: 'PRGRS_STTS_CD',   align: ' d-none' },
        { text: '진행상태명', value: 'PRGRS_STTS_NM',   align: ' d-none' },
      ],
      gridDataCuslText: [],
      gridDataCustHeaders: [],
      gridDataCustText: [],
      tempGridDataCuslText: [],
      gridSelectedData: [],
      gridSelectedData2: [],

      fSttsCd: 'PRPARG',

      validateRules: {
        CUST_NM: [
          v => !!v || '고객명은 필수 입력 항목 입니다.',
        ],
        PHONE_NO: [
          v => !!v || '전화번호는 필수 입력 항목 입니다.',
        ],
        V_MODEL: [
          v => !!v || '필수 입력 항목 입니다.',
        ],
      },

      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
          REG : {alertDialogToggle: true, msg: '처리하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.setAltSaveYes, callNo: this.closeMsg}
          , IND_REG : {alertDialogToggle: true, msg: '신규 고객을 추가하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.setCustSaveYes, callNo: this.closeMsg}
        },
        ALERT : {
          REG_SUCCESS : {alertDialogToggle: true, msg: '배분이 완료되었습니다', iconClass: 'is-info', type: 'default'}
          , RET_SUCCESS : {alertDialogToggle: true, msg: '회수가 완료되었습니다', iconClass: 'is-info', type: 'default'}
          , TK_SUCCESS : {alertDialogToggle: true, msg: '인수인계가 완료되었습니다', iconClass: 'is-info', type: 'default'}
          , CHG_SUCCESS : {alertDialogToggle: true, msg: '변경이 완료되었습니다', iconClass: 'is-info', type: 'default'}
          , IND_SUCCESS : {alertDialogToggle: true, msg: '추가가 완료되었습니다', iconClass: 'is-info', type: 'default'}

          , ETC1_WARNING : {alertDialogToggle: true, msg: '캠페인명을 선택해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC2_WARNING : {alertDialogToggle: true, msg: '배분할 상담사가 없습니다.', iconClass: 'is-info', type: 'default'}
          , ETC3_WARNING : {alertDialogToggle: true, msg: '배분할 대상자가 없습니다.', iconClass: 'is-info', type: 'default'}
          , ETC4_WARNING : {alertDialogToggle: true, msg: '배분된 상담원은 변경할 수 없습니다.<br>회수 후 진행해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC5_WARNING : {alertDialogToggle: true, msg: '회수할 건수를 입력해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC6_WARNING : {alertDialogToggle: true, msg: '회수할 미시도건이 없습니다.', iconClass: 'is-info', type: 'default'}
          , ETC7_WARNING : {alertDialogToggle: true, msg: '미시도 건수를 초과하였습니다.', iconClass: 'is-info', type: 'default'}
          , ETC8_WARNING : {alertDialogToggle: true, msg: '하나의 항목만 선택해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC9_WARNING : {alertDialogToggle: true, msg: '상담사를 선택해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC10_WARNING : {alertDialogToggle: true, msg: '음수는 입력할 수 없습니다.', iconClass: 'is-info', type: 'default'}
          , ETC11_WARNING : {alertDialogToggle: true, msg: '진행상태가 준비중일때만 가능합니다.', iconClass: 'is-info', type: 'default'}
          , ETC12_WARNING : {alertDialogToggle: true, msg: '처리가 완료된 항목이 존재합니다.<br>개별회로 진행해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC13_WARNING : {alertDialogToggle: true, msg: '인계할 미시도건수가 없습니다.', iconClass: 'is-info', type: 'default'}
          , ETC14_WARNING : {alertDialogToggle: true, msg: '인수할 상담사를 선택해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC15_WARNING : {alertDialogToggle: true, msg: '동일한 상담사에게 진행할 수 없습니다.', iconClass: 'is-info', type: 'default'}
          , ETC16_WARNING : {alertDialogToggle: true, msg: '변경(인수)할 상담사의 상태를 확인해주세요.', iconClass: 'is-info', type: 'default'}
          , ETC17_WARNING : {alertDialogToggle: true, msg: '고객을 선택해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC18_WARNING : {alertDialogToggle: true, msg: '변경할 상담사를 선택해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC19_WARNING : {alertDialogToggle: true, msg: '완료된 고객이 포함되어 있습니다.', iconClass: 'is-info', type: 'default'}
          , ETC20_WARNING : {alertDialogToggle: true, msg: '이미 등록되어 있는 고객입니다.', iconClass: 'is-info', type: 'default'}
          , ETC21_WARNING : {alertDialogToggle: true, msg: '상담사 상태를 확인해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC22_WARNING : {alertDialogToggle: true, msg: '전화번호 길이 또는 형식이 맞지 않습니다.', iconClass: 'is-info', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST : {
          REG_SUCCESS   : {  msg: '배분이 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          , RET_SUCCESS : {  msg: '회수가 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          , TK_SUCCESS  : {  msg: '인수인계가 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          , CHG_SUCCESS : {  msg: '변경이 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          , IND_SUCCESS : {  msg: '추가가 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        }
      },

      EXCEL_DOWN_NM : '',
      EXCEL_DOWN_NM2 : '',
    }
  },
  watch: {

  },

  computed: {

  },

  async created() {
    //공통코드설정
    let codeName = [
                     'CMPN_ST'
                    ,'CMPN_CL'
                    ,'CMPN_EXP_TP'
                  ];
    this.common_code = await this.mixin_common_code_get_all(codeName, 'Y');

    //진행년도 설정(금년기준 -5, +5)
    const date = new Date();
    const curYear = date.getFullYear();
    this.cpiYrItems.push({ text: '전체', value: '' });   // default
    for (let i = -5; i < 5; i++) {
      this.cpiYrItems.push({ text: `${curYear + i}년`, value: (curYear + i).toString() });
    }
    this.CPI_YR =  curYear.toString();
  },

  mounted() {
    this.PRGRS_STTS_CD = 'PRPARG';    // 기본 준비중으로 선택
    //설문조사콤보박스 조회
    this.getCpiNm();
  },

  methods: {
    FnBtnPath(evt) {
      evt();
    },
    init(){
      this.EXCEL_DOWN_NM = '';
      this.EXCEL_DOWN_NM2 = '';
      this.isDisabled = false;
      this.gridDataCuslText = [];
      this.gridDataCustText = [];
      this.tempGridDataCuslText = [];
      this.gridSelectedData = [];
      this.gridDataCustHeaders = [
        { text: '번호',       value: 'ROW_NUMBER',    align: 'center',    width: '80px' },
        { text: '고객명',     value: 'CUST_NM',       align: 'center',    width: '120px' },
        { text: '전화번호',   value: 'CUST_PHN_NO',   align: 'center',    width: '150px' },
        { text: '배분일시',   value: 'ALTMNT_DT',     align: 'center',    width: '150px' },
        { text: '시도건수',   value: 'TRY_CNT',         align: 'center',    width: '80px' },
        { text: '완료여부',   value: 'YN_NM',         align: 'center',    width: '100px' },


        { text: '완료여부코드',   value: 'YN',        align: ' d-none' },
        { text: '고객ID',     value: 'CUST_ID',       align: ' d-none' },
      ];
      this.CUS_NAME = '';
    },
    formReset(){
      //프로퍼티가 로드전에 호출되는 case가 있음.
      if(this.$refs.form) this.$refs.form.resetValidation();
    },
    //설문명 콤보박스 조회
    async getCpiNm(){
      const sUrl = '/phone-api/campaign/custmng/selectcombocpicustmng';
      const postParam = {
        CPI_YR : this.CPI_YR             //진행년도
        ,PRGRS_STTS_CD : this.PRGRS_STTS_CD         //진행상태
        ,PLAN_SE_CD : this.PLAN_SE_CD        //계획구분
      }
      const headParam = {
        head: {
          'SERVICE' : 'phone.campaign.custmng.selectcombocpicustmng',
          'METHOD' : 'selectcombocpicustmng',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {
        this.CPI_NM = '';
        this.cpiNmItems = resData.DATA.map(item => ({ text: item.TEXT, value: item.VALUE }));
        if (this.cpiNmItems.length > 0) this.CPI_NM = resData.DATA[0].VALUE;
      }
      if(!this.mixin_isEmpty(this.CPI_NM)) this.btnSelectList();
    },
    //조회버튼클릭
    async btnSelectList(){
      this.init();
      if(this.chkValid('0')){
        this.TOP_INFO.forEach(e => {
          e.desc = '　';
        });
        this.TOP_INFO2.forEach(e => {
          e.desc = '';
        });
        this.CAMPAIGN_INFO.forEach(e => {
          e.desc = '';
        });
        return;
      }
      //top조회
      const sUrl = '/phone-api/campaign/altmntmng/selecttopcpialtmntmng';
      const postParam = {
        CPI_ID : this.CPI_NM
      }
      const headParam = {
        head: {
          'SERVICE' : 'phone.campaign.altmntmng.selecttopcpialtmntmng',
          'METHOD' : 'selecttopcpialtmntmng',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );


      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {
        const topData = resData.DATA[0];
        this.TOP_INFO[0].desc = topData.CPI_NM;
        this.TOP_INFO[1].desc = `${topData.CPI_BGNG_DT} ~ ${topData.CPI_END_DT}`;
        this.TOP_INFO[2].desc = topData.PLAN_CYCL;
        this.TOP_INFO[3].desc = topData.PRGRS_STTS_NM;
        this.TOP_INFO[3].class = `is-txt-${this.displayStatus(topData.PRGRS_STTS_CD)}`;
        this.isDisabled = (topData.PRGRS_STTS_CD === 'TERMIAT' ? true : false)
        this.TOP_INFO[4].desc = topData.RGTR_ID;
        this.TOP_INFO[5].desc = topData.REG_DT;

        this.TOP_INFO2[0].desc = topData.CUST_TOT;
        this.TOP_INFO2[1].desc = topData.CUST_ALT;
        this.TOP_INFO2[2].desc = topData.UN_CUST_ALT;
        this.TOP_INFO2[3].desc = topData.CUST_AVR;
        this.TOP_INFO2[4].desc = topData.CUSL_TOT;
        this.TOP_INFO2[5].desc = topData.CUSL_ALT;
        this.TOP_INFO2[6].desc = topData.UN_CUSL_ALT;

        this.fSttsCd = topData.PRGRS_STTS_CD;
        this.getCuslData();
        this.getExpsnAttrList();

        this.EXCEL_DOWN_NM = this.TOP_INFO[0].desc + ' 배분 현황';
      }
    },
    //배분현황조회
    async getCuslData(){
      const sUrl = '/phone-api/campaign/altmntmng/selectcuslaltmntmng';
      const postParam = {
        CPI_ID : this.CPI_NM
      }
      const headParam = {
        head: {
          'SERVICE' : 'phone.campaign.altmntmng.selectcuslaltmntmng',
          'METHOD' : 'selectcuslaltmntmng',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );


      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {
        this.gridDataCustHeaders = [
          { text: '번호',       value: 'ROW_NUMBER',    align: 'center',    width: '70px' },
          { text: '고객명',     value: 'CUST_NM',       align: 'left',    width: '100px' },
          { text: '전화번호',   value: 'CUST_PHN_NO',   align: 'left',    width: '140px' },
          { text: '배분일시',   value: 'ALTMNT_DT',     align: 'left',    width: '170px' },
          { text: '시도건수',   value: 'TRY_CNT',         align: 'center',    width: '90px' },
          { text: '완료여부',   value: 'YN_NM',         align: 'left',    width: '90px' },

          { text: '완료여부코드',   value: 'YN',        align: ' d-none' },
          { text: '고객ID',     value: 'CUST_ID',       align: ' d-none' },
        ];
        for(let k in resData.EXPSN_ATTR){
          this.gridDataCustHeaders.push({ text: resData.EXPSN_ATTR[k].EXPSN_ATTR_NM, value: resData.EXPSN_ATTR[k].EXPSN_ATTR_COL_ID, width: '120px', sortable: false });
        }

        this.gridDataCuslText = resData.DATA;
      }
    },
    //배분된 정보 조회
    async getCustData(){
      const sUrl = '/phone-api/campaign/altmntmng/selectcustaltmntmng';
      const postParam = {
        sendData: {}
      }
      const headParam = {
        head: {
          'SERVICE' : 'phone.campaign.altmntmng.selectcustaltmntmng',
          'METHOD' : 'selectcustaltmntmng',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      postParam.sendData["oData"] = this.gridSelectedData;

      let resData = await this.common_postCall(sUrl, postParam.sendData, headParam );

      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {
        resData.DATA.forEach((data, idx) => {
          data.CUST_PHN_NO = this.mixin_setPhoneNo(data.CUST_PHN_NO.replace(/[^0-9]/g, ""));
        });
        this.gridDataCustText = resData.DATA;
      }
    },
    //회수버튼
    cuslReturn(arg){
      if(this.chkValid('0')) return;

      //개별회수
      if(arg === 'indi'){
        if(this.chkValid('3')) return;
        if(this.chkValid('4')) return;
        //건수
        if(Number(this.gridSelectedData[0].ADDRE) < 1){
          this.showAlert(this.MESSAGE.ALERT.ETC5_WARNING);
          return;
        }
        //미처리수
        if(Number(this.gridSelectedData[0].UN_CMPTN) < 1){
          this.showAlert(this.MESSAGE.ALERT.ETC6_WARNING);
          return;
        }
        //미처리 - 건수
        if(Number(this.gridSelectedData[0].UN_CMPTN) - Number(this.gridSelectedData[0].ADDRE) < 0){
          this.showAlert(this.MESSAGE.ALERT.ETC7_WARNING);
          return;
        }
      }else{  // 전체회수
        //진행상태체크
        if(this.chkValid('5')) return;
        //처리완료만 가져오기
        this.tempGridDataCuslText = this.gridDataCuslText.filter(items => {
          return items.CMPTN > 0;
        });
        //처리완료가 1건이라도 있다면 리턴
        if(this.tempGridDataCuslText.length > 0){
          this.showAlert(this.MESSAGE.ALERT.ETC12_WARNING);
          return;
        }
        //미시도건 가져오기
        this.tempGridDataCuslText = this.gridDataCuslText.filter(items => {
          return items.UN_CMPTN > 0;
        });
        //미시도건이 없다면 리턴
        if(this.tempGridDataCuslText.length === 0){
          this.showAlert(this.MESSAGE.ALERT.ETC6_WARNING);
          return;
        }
      }
      this.showAlert(
        {
          alertDialogToggle: true,
          msg: '회수하시겠습니까?',
          iconClass: 'is-info',
          type: 'confirm',
          callYes: async () => {
            const sUrl = '/phone-api/campaign/altmntmng/returncuslaltmntmng';
            const postParam = {
              CUSL_ID : (arg === 'indi' ? this.gridSelectedData[0].CUSL_ID : this.tempGridDataCuslText[0].CUSL_ID),
              CPI_ID : (arg === 'indi' ? this.gridSelectedData[0].CPI_ID : this.tempGridDataCuslText[0].CPI_ID),
              ADDRE : (arg === 'indi' ? this.gridSelectedData[0].ADDRE : 0),
              ARG : arg,
            }
            const headParam = {
              head: {
                'SERVICE' : 'phone.campaign.altmntmng.returncuslaltmntmng',
                'METHOD' : 'returncuslaltmntmng',
                'TYPE' : 'BIZ_SERVICE',
              }
            }

            let resData = await this.common_postCall(sUrl, postParam, headParam);

            if (resData.HEADER.ERROR_FLAG)
            {
              this.setErrMsg(resData);
            }
            else
            {
              this.closeMsg();
              this.showToast(this.MESSAGE.TOAST.RET_SUCCESS);
              this.btnSelectList();
            }
          },
          callNo: this.closeMsg
        }
      )
    },
    //이전 제외값
    setPreExlRsn(item, value){
      this.PRE_EXL_RSN_CD = item['EXL_RSN_CD'];
    },
    //추가/회수 값 체크
    async chkAddre(item){
      const addRe = (this.mixin_isEmpty(item['ADDRE']) ? -1 : Number(item['ADDRE']));
      if(addRe < 0){
        const sleep = (ms) => new Promise(reslove => setTimeout(reslove, ms))
        this.showAlert(this.MESSAGE.ALERT.ETC10_WARNING);
        await sleep(500)

        const idx = item['ROW_NUMBER']-1;
        this.gridDataCuslText[idx].ADDRE = 0;
      }
    },
    //제외 업데이트
    async updateExlRsn(item, value){
      if(this.isDisabled) return;   //종료건은 수행 안함.

      if(Number(item['CUSL_ALT']) > 0){
        const sleep = (ms) => new Promise(reslove => setTimeout(reslove, ms))
        this.showAlert(this.MESSAGE.ALERT.ETC4_WARNING);
        await sleep(500)

        const idx = item['ROW_NUMBER']-1;
        this.gridDataCuslText[idx].EXL_RSN_CD = this.PRE_EXL_RSN_CD;
        return;
      }

      const sUrl = '/phone-api/campaign/altmntmng/updateexlaltmntmng';
      const postParam = {
        CUSL_ID : item['CUSL_ID'],
        CPI_ID : item['CPI_ID'],
        EXL_RSN_CD : value,
      }
      const headParam = {
        head: {
          'SERVICE' : 'phone.campaign.altmntmng.updateexlaltmntmng',
          'METHOD' : 'updateexlaltmntmng',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam);

      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {

      }
    },
    //배분처리
    async setAltSaveYes(){
      this.load1 = true;
      const sUrl = '/phone-api/campaign/altmntmng/insertcuslaltmntmng';
      const postParam = {
        sendData: {}
      }
      const headParam = {
        head: {
          'SERVICE' : 'phone.campaign.altmntmng.insertcuslaltmntmng',
          'METHOD' : 'insertcuslaltmntmng',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      postParam.sendData["oData"] = this.tempGridDataCuslText;

      let resData = await this.common_postCall(sUrl, postParam.sendData, headParam );

      if (resData.HEADER.ERROR_FLAG)
      {
        this.load1 = false;
        this.setErrMsg(resData);
      }
      else
      {
        this.load1 = false;
        this.closeMsg();
        this.showToast(this.MESSAGE.TOAST.REG_SUCCESS);
        // this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS)
        this.btnSelectList();
      }
    },
    //배분하기클릭
    saveAltmnt(){
      //0인항목 제외
      this.tempGridDataCuslText = this.gridDataCuslText.filter(items => {
        return items.ADDRE > 0;
      });
      //하나도없다면 리턴
      if(this.tempGridDataCuslText.length === 0){
        this.showAlert(this.MESSAGE.ALERT.ETC3_WARNING);
        return;
      }

      this.showAlert(this.MESSAGE.CONFIRM.REG);
    },
    //그리드 클릭
    setGridSelect(item){
      this.EXCEL_DOWN_NM2 = '';
      this.CAMPAIGN_INFO[0].desc = item.CPI_NM;
      this.CAMPAIGN_INFO[1].desc = item.PLAN_SE_NM;
      //this.CAMPAIGN_INFO[2].desc = (Number(item.CUSL_ALT) > 0 ? '배분' : '미배분');
      this.CAMPAIGN_INFO[2].desc = (Number(this.TOP_INFO2[1].desc) > 0 ? '배분' : '미배분');
      this.CAMPAIGN_INFO[3].desc = item.PRGRS_STTS_NM;
      this.CAMPAIGN_INFO[3].class = `is-txt-${this.displayStatus(item.PRGRS_STTS_CD)}`;
      this.CUSL_NM = item.USER_NM;
      this.DEPT_NM = item.DEPT_NM;

      this.gridSelectedData2 = [];
      this.CUS_NAME = item.USER_NM;
      this.gridSelectedData = [];
      this.gridSelectedData[0] = item;
      this.getCustData();

      this.EXCEL_DOWN_NM2 = this.TOP_INFO[0].desc + ' (' + this.CUS_NAME + ')님에 배분된 정보';
    },
    //균등배분
    async setAvrPush(){
      if(this.chkValid('0')) return;    //조회관련
      if(this.chkValid('1')) return;    //상담사체크
      if(this.chkValid('2')) return;    //대상자체크
      if(this.chkValid('5')) return;    //진행상태체크

      const sleep = (ms) => new Promise(reslove => setTimeout(reslove, ms))
      this.load2 = true;
      let idx = 0;
      let totCnt = Number(this.TOP_INFO2[2].desc);
      let altCnt = 0;   // 최종배분값
      await sleep(500)

      while(altCnt<totCnt){
        for(let i=0; i<this.gridDataCuslText.length; i++){
          if(altCnt === 0) this.gridDataCuslText[i].ADDRE = 0;
          if(this.gridDataCuslText[i].EXL_RSN_CD === '1'){
            this.gridDataCuslText[i].ADDRE = Number(this.gridDataCuslText[i].ADDRE) + 1;
            idx++;
          }
          if(idx === totCnt){     // 모두 배분했으면 리턴
            this.load2 = false;
            return;
          }
        }
        //첫 루프에서 적용대상이 하나도 없다면 리턴
        if(altCnt === 0 && idx === 0){
          this.showAlert(this.MESSAGE.ALERT.ETC2_WARNING);
          this.load2 = false;
          return;
        }
        altCnt = idx;
      }
    },
    //상담원변경 버튼 실행
    cuslChange(){
      this.SRCH_USER_NM2 = '';
      this.SRCH_USER2 = [];
      if(this.chkValid('0')) return;
      if(this.gridSelectedData2.length < 1){
        this.showAlert(this.MESSAGE.ALERT.ETC17_WARNING);
        return;
      }
      //완료된 건 가져오기
      this.tempGridDataCuslText = this.gridSelectedData2.filter(items => {
        return items.YN === 'Y';
      });
      //1개라도 있다면 리턴
      if(this.tempGridDataCuslText.length > 0){
        this.showAlert(this.MESSAGE.ALERT.ETC19_WARNING);
        return;
      }
      this.mixin_showDialog('UserFind2');
    },
    async setCuslChange(){
      const oCusl = this.gridSelectedData[0];
      const oCust = this.gridSelectedData2;
      if(this.mixin_isEmpty(this.SRCH_USER2.USER_ID)){
        this.showAlert(this.MESSAGE.ALERT.ETC18_WARNING);
        return;
      }
      if(oCusl.CUSL_ID === this.SRCH_USER2.USER_ID ){
        this.showAlert(this.MESSAGE.ALERT.ETC15_WARNING);
        return;
      }

      this.showAlert(
        {
          alertDialogToggle: true,
          msg: `${this.SRCH_USER2.USER_NM} 상담사로 변경하시겠습니까?(총 ${oCust.length}건)`,
          iconClass: 'is-info',
          type: 'confirm',
          callYes: async () => {
            const sUrl = '/phone-api/campaign/altmntmng/chgcuslaltmntmng';
            const postParam = {
              sendData: {}
            }
            // sendData 세팅
            postParam.sendData['CPI_ID'] = oCusl.CPI_ID;
            postParam.sendData['BFR_CUSL_ID'] = oCusl.CUSL_ID;
            postParam.sendData['AFTR_CUSL_ID'] = this.SRCH_USER2.USER_ID;
            postParam.sendData['oData'] = oCust;

            const headParam = {
              head: {
                'SERVICE' : 'phone.campaign.altmntmng.chgcuslaltmntmng',
                'METHOD' : 'chgcuslaltmntmng',
                'TYPE' : 'BIZ_SERVICE',
              }
            }

            let resData = await this.common_postCall(sUrl, postParam.sendData, headParam );

            if (resData.HEADER.ERROR_FLAG)
            {
              this.setErrMsg(resData);
            }
            else
            {
              this.closeMsg();
              this.showToast(this.MESSAGE.TOAST.CHG_SUCCESS);
              this.btnSelectList();
            }
          },
          callNo: this.closeMsg
        }
      )
    },

    //인수인계 버튼 실행
    userFind(){
      this.SRCH_USER_NM = '';
      this.SRCH_USER = [];
      if(this.chkValid('0')) return;
      if(this.chkValid('3')) return;  //다중항목 체크
      if(this.chkValid('4')) return;  //선택항목 체크
      //미처리수
      if(Number(this.gridSelectedData[0].UN_CMPTN) < 1){
        this.showAlert(this.MESSAGE.ALERT.ETC13_WARNING);
        return;
      }

      this.mixin_showDialog('UserFind');
    },
    async setCusl(){
      const oCusl = this.gridSelectedData[0];
      if(this.mixin_isEmpty(this.SRCH_USER.USER_ID)){
        this.showAlert(this.MESSAGE.ALERT.ETC14_WARNING);
        return;
      }
      if(oCusl.CUSL_ID === this.SRCH_USER.USER_ID ){
        this.showAlert(this.MESSAGE.ALERT.ETC15_WARNING);
        return;
      }

      this.showAlert(
        {
          alertDialogToggle: true,
          msg: `${oCusl.USER_NM} 미처리 건을 ${this.SRCH_USER.USER_NM} 상담사에게로 인계하시겠습니까?(총 ${oCusl.UN_CMPTN}건)`,
          iconClass: 'is-info',
          type: 'confirm',
          callYes: async () => {
            const sUrl = '/phone-api/campaign/altmntmng/tkovercuslaltmntmng';
            const postParam = {
              CPI_ID : oCusl.CPI_ID,
              BFR_CUSL_ID : oCusl.CUSL_ID,
              AFTR_CUSL_ID : this.SRCH_USER.USER_ID,
            }
            const headParam = {
              head: {
                'SERVICE' : 'phone.campaign.altmntmng.tkovercuslaltmntmng',
                'METHOD' : 'tkovercuslaltmntmng',
                'TYPE' : 'BIZ_SERVICE',
              }
            }

            let resData = await this.common_postCall(sUrl, postParam, headParam);

            if (resData.HEADER.ERROR_FLAG)
            {
              this.setErrMsg(resData);
            }
            else
            {
              this.closeMsg();
              this.showToast(this.MESSAGE.TOAST.TK_SUCCESS);
              this.btnSelectList();
            }
          },
          callNo: this.closeMsg
        }
      )
    },
    //개별추가
    indiCustAdd(){
      if(this.chkValid('0')) return;
      if(this.chkValid('3')) return;  //다중항목 체크
      if(this.chkValid('4')) return;  //선택항목 체크
      //제외상태
      if(this.gridSelectedData[0].EXL_RSN_CD !== '1'){
        this.showAlert(this.MESSAGE.ALERT.ETC21_WARNING);
        return;
      }

      this.CUST_NM = '';
      this.PHONE_NO = '';
      this.EXPSN_ATTR.forEach(e => {
        e.V_MODEL = '';
      });

      this.mixin_showDialog('AddOne');
      this.formReset();
    },
    //validate check
    validate () {
      return this.$refs.form.validate();
    },
    //고객저장클릭
    async saveIndiCust(){
      if(!this.validate()) return;
      //전화번호체크
      let CUST_PHN_NO = this.PHONE_NO.toString().replace(/[^0-9]/g, '');
      if(CUST_PHN_NO.length < 10 || CUST_PHN_NO.length > 11){
        this.showAlert(this.MESSAGE.ALERT.ETC22_WARNING);
        return;
      }

      this.showAlert(this.MESSAGE.CONFIRM.IND_REG);
    },
    //고객저장실행
    async setCustSaveYes(){
      const sUrl = '/phone-api/campaign/altmntmng/addindicustaltmntmng';
      const postParam = {
        sendData: {}
      }
      const o = [];
      // sendData 세팅
      for(let i in this.EXPSN_ATTR){
        o.push(
          {
            ATTR_ID : this.EXPSN_ATTR[i].ATTR_ID,
            ATTR_VL : this.EXPSN_ATTR[i].V_MODEL
          }
        )
      }
      postParam.sendData['CPI_ID'] = this.CPI_NM;
      postParam.sendData['CUST_NM'] = this.CUST_NM;
      postParam.sendData['CUST_PHN_NO'] = this.PHONE_NO;
      postParam.sendData['AFTR_CUSL_ID'] = this.gridSelectedData[0].CUSL_ID;
      postParam.sendData['oData'] = o;

      const headParam = {
        head: {
          'SERVICE' : 'phone.campaign.altmntmng.addindicustaltmntmng',
          'METHOD' : 'addindicustaltmntmng',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      let resData = await this.common_postCall(sUrl, postParam.sendData, headParam );

      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {
        this.mixin_hideDialog('AddOne')
        this.closeMsg();
        this.showToast(this.MESSAGE.TOAST.IND_SUCCESS);
        this.btnSelectList();
      }
    },
    /* 상세 모달 확장 정보 속성 가져오기 */
    async getExpsnAttrList() {
      const sUrl = '/phone-api/campaign/custmng/expsnattrlist';
      const postParam = {
        SE : 'CAMP' //상담내용 확장항목
        , BSC_PVSN_ATTR_YN : "N" //기본 제공 속성이 아닌것
        , CPI_ID : this.CPI_NM
      }
      const headParam = {
        head: {
          'SERVICE' : 'phone.campaign.custmng.expsnattrlist',
          'METHOD' : 'expsnattrlist',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        let expsnAttrData = response.DATA;
        let codeName = [];

        for(let i in expsnAttrData){
          expsnAttrData[i].V_MODEL = ''; //동적 v_model 생성
          if(expsnAttrData[i].DATA_TYPE_CD === 'COE'){ //단일 선택인 경우
            if(expsnAttrData[i].GROUP_CD_ID) codeName.push(expsnAttrData[i].GROUP_CD_ID); //공통코드사용을 위해 그룹코드가 있는 경우만
          }
        }
        this.dynamic_comCode = await this.mixin_common_code_get_all(codeName);
        this.EXPSN_ATTR = expsnAttrData;
      }
    },
    callpostDialog(seq) {
      this.SELECTED_ATTR_INDEX = seq;
      this.$eventBus.$emit("reSetPost");
      this.mixin_showDialog('FindPost');
    },
    getFindPost(data) {
      this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].V_MODEL = data.zipNo; //우편번호
      this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].V_MODEL_DTL[0] = data.roadAddr; //기본주소
      this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].V_MODEL_DTL[1] = ''; //상세주소
      this.mixin_hideDialog('FindPost');
    },
    displayStatus(type) {
      const typeList = [
        { type_list_text: 'open', type_list_type: 'PRPARG' }, //준비중,
        { type_list_text: 'accept', type_list_type: 'PUBCMP' }, //게시완료
        { type_list_text: 'reject', type_list_type: 'ONGONG' }, //진행중
        { type_list_text: 'error', type_list_type: 'TERMIAT' }, //종료
      ];

      for (let i = 0; i < typeList.length; i++) {
        if (typeList[i].type_list_type === type) {
          return typeList[i].type_list_text;
        }
      }
    },
    chkValid(e){
      let eFlag = true;
      switch(e){
        case '0' : //조회관련
          if(this.mixin_isEmpty(this.CPI_NM)) this.showAlert(this.MESSAGE.ALERT.ETC1_WARNING);
          else eFlag = false;
        break;
        case '1' : //미상담사가 있는지 체크
          if(Number(this.TOP_INFO2[6].desc) === 0) this.showAlert(this.MESSAGE.ALERT.ETC2_WARNING);
          else eFlag = false;
        break;
        case '2' : //미대상자가 있는지 체크
          if(Number(this.TOP_INFO2[2].desc) === 0) this.showAlert(this.MESSAGE.ALERT.ETC3_WARNING);
          else eFlag = false;
        break;
        case '3' : //선택항목 체크
          if(this.gridSelectedData.length > 1) this.showAlert(this.MESSAGE.ALERT.ETC8_WARNING);
          else eFlag = false;
        break;
        case '4' : //선택항목 체크
          if(this.gridSelectedData.length < 1) this.showAlert(this.MESSAGE.ALERT.ETC9_WARNING);
          else eFlag = false;
        break;
        case '5' : //진행상태
        if(this.fSttsCd !== 'PRPARG') this.showAlert(this.MESSAGE.ALERT.ETC11_WARNING);
          else eFlag = false;
        break;
      }
      return eFlag;
    },
    //메시지창 종료
    closeMsg(){
      this.$store.commit('alertStore/hideAlert');
    },
    //api오류
    setErrMsg(res){3
      if(res.HEADER.ERROR_MSG == 'EXL') this.showAlert(this.MESSAGE.ALERT.ETC16_WARNING);
      else if(res.HEADER.ERROR_MSG == 'OBD') this.showAlert(this.MESSAGE.ALERT.ETC20_WARNING);
    },
  },
}
</script>

<style lang="scss" scoped></style>