<template>
  <div :class="resizeClass ? 'expand' : ''">
    <div class="pl-card-top">
      <div
        :class="`align-self-start pl-portrait ${ custInfoProp.CAUTION_CUST_YN === 'Y' ? 'alert' : ''} ${ custInfoProp.VIP_CUST_YN === true ? 'vip' : ''}`"
        @click="showBlackDialog()"
        >
        <img :src="custInfoProp.portrait" :alt="custInfoProp.CUST_NM">
      </div>
      <div class="ml-4">
        <strong class="pl-card-top-title">
          <template v-if="editable">
            <v-text-field
              class="pl-form is-sm"
              v-model="custInfoProp.CUST_NM"
              v-byte-counter="300"
            ></v-text-field>
          </template>
          <template v-else>
            {{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(custInfoProp.CUST_NM?custInfoProp.CUST_NM:'성명미상') : custInfoProp.CUST_NM?custInfoProp.CUST_NM:'성명미상' }}
          </template>
        </strong>
        <div :style="addable ? '' : 'height: 18px;'" :class="editable ? 'is-mt-s' : ''">
          <template v-if="addable || (custInfoProp.CHNL === 'SNS' && editable)">
            <v-text-field
              class="pl-form"
              v-model="custInfoProp.CUST_PHN_NO"
              placeholder="전화번호"
              maxlength="14"
              hide-spin-buttons
              type="text"
              @keyup="setPhoneNo(custInfoProp.CUST_PHN_NO)"
              oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
            ></v-text-field>
          </template>
          <template v-else>
            {{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(custInfoProp.CUST_PHN_NO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(custInfoProp.CUST_PHN_NO.replace(/[^0-9]/g, "")) }}
          </template>
        </div>
        <!-- util -->
        <!-- :DisabledProp="custInfoProp.CUST_ID != undefined && custInfoProp.CUST_ID > -1?$store.getters['statusStore/GE_CUTT_ING']?true:false:true" -->
        <div class="pl-btn-wrap mt-2">
          <compo-tooltip-btn
            v-if="custInfoProp.CHNL === 'TEL'"
            :DisabledProp="custInfoProp.CUST_ID != undefined && custInfoProp.CUST_ID > -1 && custInfoProp.CUST_PHN_NO?false:true"
            TitleProp="전화"
            ClassProp="pl-tooltip-btn is-blue"
            IconProp="pl-icon20 main-call"
            TooltipPositionProp="bottom"
            @btnClick="$emit('call')"
          ></compo-tooltip-btn>
          <compo-tooltip-btn
            :DisabledProp="custInfoProp.CUST_ID != undefined && custInfoProp.CUST_ID > -1 && custInfoProp.CUST_PHN_NO?false:true"
            TitleProp="문자"
            ClassProp="pl-tooltip-btn is-blue"
            IconProp="pl-icon20 main-sms"
            TooltipPositionProp="bottom"
            @btnClick="$emit('sms')"
          ></compo-tooltip-btn>
          <!-- <compo-tooltip-btn
            :DisabledProp="custInfoProp.CUST_ID != undefined && custInfoProp.CUST_ID > -1?false:true"
            TitleProp="이메일"
            ClassProp="pl-tooltip-btn is-blue"
            IconProp="pl-icon20 main-email"
            TooltipPositionProp="bottom"
            @btnClick="$emit('email')"
          ></compo-tooltip-btn> -->
          <compo-tooltip-btn
            :DisabledProp="custInfoProp.CUST_ID != undefined && custInfoProp.CUST_ID > -1 && custInfoProp.CUST_PHN_NO?false:true"
            TitleProp="알림톡"
            ClassProp="pl-tooltip-btn is-blue"
            IconProp="pl-icon20 main-talk"
            TooltipPositionProp="bottom"
            @btnClick="$emit('chat')"
          ></compo-tooltip-btn>
          <!-- 보안 버튼 -->
          <div>
            <compo-tooltip-btn
              :DisabledProp="custInfoProp.CUST_ID != undefined && custInfoProp.CUST_ID > -1?false:true"
              TitleProp="상세"
              ClassProp="pl-tooltip-btn is-blue"
              IconProp="pl-icon20 main-terms"
              TooltipPositionProp="bottom"
              @btnClick="dropAgree = !dropAgree"
            ></compo-tooltip-btn>
            <!-- 보안 모달 -->
            <v-slide-y-transition>
              <div
                class="pl-drop-layer is-cus-agree"
                :style="custInfoProp.CHNL === 'SNS' ? 'right: 80px;' : ''"
                v-if="dropAgree === true"
                v-click-outside="closeDropAgree">
                <div class="pl-drop-layer-body">
                  <div class="pl-form-inline-wrap vertical type-readonly">
                    <!-- <div class="pl-form-inline">
                      <span class="pl-label">
                        고객 고유번호
                      </span>
                      <div class="pl-desc">
                        <span class="is-txt-black">
                          {{ DataProp.DETAIL_INFO.ex_key }}({{ DataProp.DETAIL_INFO.cus_name }})
                        </span>
                      </div>
                    </div> -->
                    <div
                      v-for="item in CUST_AGRE_INFO"
                      :key="item.CD_ID"
                      class="pl-form-inline">
                      <span class="pl-label">{{ item.CD_NM }} 동의</span>
                      <div class="pl-desc">
                        <v-checkbox
                          v-model="item.CHECKED"
                          class="pl-check"
                          :label="item.AGRE_INFO"
                          @change="custAgreChange($event, item.CD_ID, item.CUST_AGRE_HSTRY_ID)"
                          ></v-checkbox>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="pl-drop-layer-footer">
                  <div class="pl-form-inline-wrap vertical type-readonly flex-grow-1">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        고객 정보 등록자
                      </span>
                      <div class="pl-desc">
                        <span class="is-txt-black">
                          {{ custInfoProp.RGTR_NM }}({{ mixin_convertDate(custInfoProp.REG_DT, 'yyyy-MM-dd HH:mm:ss') }})
                        </span>
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        고객 정보 수정자
                      </span>
                      <div class="pl-desc">
                        <span class="is-txt-black">
                          {{ custInfoProp.MDFR_NM }}({{ mixin_convertDate(custInfoProp.MDFCN_DT, 'yyyy-MM-dd HH:mm:ss') }})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-slide-y-transition>
          </div>
          <!-- <div v-if="custInfoProp.CHNL === 'TEL' && !addable && !$store.getters['statusStore/GE_CUTT_ING']"></div> -->
          <div v-if="custInfoProp.CHNL === 'TEL' && !addable">
            <compo-tooltip-btn
              TitleProp="추가"
              ClassProp="pl-tooltip-btn is-blue"
              IconProp="pl-icon20 add-cus"
              TooltipPositionProp="bottom"
              @btnClick="addForm()"
            ></compo-tooltip-btn>
          </div>

          <!-- <div v-if="custInfoProp.CHNL === 'TEL'">
            <compo-tooltip-btn
              :DisabledProp="custInfoProp.CUST_ID != undefined && custInfoProp.CUST_ID > -1?false:true"
              TitleProp="상세"
              ClassProp="pl-tooltip-btn is-blue"
              IconProp="pl-icon20 main-detail-v"
              TooltipPositionProp="bottom"
              @btnClick="dropShare = !dropShare"
            ></compo-tooltip-btn>
            <v-slide-y-transition>
              <div class="pl-drop-layer" v-if="dropShare === true" v-click-outside="closeDropShare">
                <div class="pl-drop-layer-body">
                  <ul class="pl-drop-layer-list">
                    <li
                      v-for="item in SHARE_LIST"
                      :key="item.id"
                      @click="mixin_testLog(item.name)"
                      >
                      <v-icon :class="`pl-icon20 ${ item.icon }`"></v-icon>
                      <span class="ml-2">
                        {{ item.name }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </v-slide-y-transition>
          </div> -->
          <compo-tooltip-btn
            :DisabledProp="custInfoProp.CUST_ID != undefined && custInfoProp.CUST_ID > -1 && custInfoProp.CUST_PHN_NO?false:true"
            TitleProp="전화번호 복사"
            ClassProp="pl-tooltip-btn is-blue"
            IconProp="pl-icon20 paste-board"
            TooltipPositionProp="bottom"
            @btnClick="copyCustPhnNo"
          ></compo-tooltip-btn>
          <compo-tooltip-btn
            v-if="mixin_getCustcoSrvcStat('OMNIONE') && mixin_getCustcoSetting('ENV_CUST_SIMPLE_CERT_USE_YN')"
            :DisabledProp="custInfoProp.CUST_ID != undefined && custInfoProp.CUST_ID > -1 && custInfoProp.CUST_PHN_NO?false:true"
            TitleProp="간편인증"
            ClassProp="pl-tooltip-btn is-blue"
            IconProp="pl-icon20 chk-easycert"
            TooltipPositionProp="bottom"
            @btnClick="[$eventBus.$emit('dialogOmniOne', custInfoProp), $eventBus.$emit('OmniOneInit')]"
          ></compo-tooltip-btn>
        </div>
      </div>
      <div class="pl-btn-wrap ml-auto align-self-start">
        <div v-if="custInfoProp.CHNL === 'TEL' && !CALL_ING && custInfoProp.CUST_ID > -1 && !editable">
          <compo-tooltip-btn
            TitleProp="초기화"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 userReset"
            TooltipPositionProp="bottom"
            @btnClick="showAlert(MESSAGE.CONFIRM.RESET_CUST)"
          ></compo-tooltip-btn>
        </div>
        <template v-if="custInfoProp.CUST_ID != undefined && custInfoProp.CUST_ID > -1 || addable">
          <!-- 수정 -->
          <compo-tooltip-btn
            v-if="!editable"
            TitleProp="수정"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 edit"
            TooltipPositionProp="bottom"
            @btnClick="editForm()"
          ></compo-tooltip-btn>
          <template v-else>
            <compo-tooltip-btn
              TitleProp="취소"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 circle-close"
              TooltipPositionProp="bottom"
              @btnClick="editFormX()">
            </compo-tooltip-btn>
            <compo-tooltip-btn
              TitleProp="확인"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 is-drag-icon-check"
              TooltipPositionProp="bottom"
              @btnClick="showAlert(MESSAGE.CONFIRM.REG)">
            </compo-tooltip-btn>

          </template>
        </template>
        <!-- 리사이즈 토글 -->
        <compo-tooltip-btn
          :TitleProp=computedResizeText
          ClassProp="pl-tooltip-btn"
          :IconProp=computedResizeClass
          TooltipPositionProp="bottom"
          @btnClick="toggleResize()"
        ></compo-tooltip-btn>
      </div>
    </div>
    <template v-if="custFormView">
      <div class="pl-card" style="overflow-y: scroll;">
        <div class="pl-form-inline-wrap" :class="custInfoProp.CHNL === 'SNS' ? 'type-mainchat' : 'type-mainphone'">
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
                <!-- 단일 선택형인 경우 -->
                <v-autocomplete
                  v-if="expsnAttr.DATA_TYPE_CD === 'COE'"
                  v-model="expsnAttr.V_MODEL"
                  class="pl-form"
                  :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                  :items="mixin_common_code_get(common_code, expsnAttr.GROUP_CD_ID)"
                  placeholder="선택하세요"
                  no-data-text="결과 없음"
                />
                <!-- 다중 선택형인 경우 -->
                <v-autocomplete
                  v-if="expsnAttr.DATA_TYPE_CD === 'COE_MULTI'"
                  v-model="expsnAttr.V_MODEL"
                  return-object
                  class="pl-form is-auto"
                  style="width:137px"
                  :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                  :items="mixin_common_code_get(common_code, expsnAttr.GROUP_CD_ID)"
                  multiple
                  small-chips
                  >
                  <template v-slot:selection="{ attrs, item, parent, selected, index }">
                    <v-chip
                      v-if="item === Object(item)"
                      v-bind="attrs"
                      :input-value="selected"
                      small
                    >
                      <span class="pr-2">
                        {{ item.text }}
                      </span>
                      <v-icon small @click="parent.selectItem(item)" >
                        $delete
                      </v-icon>
                    </v-chip>
                  </template>
                </v-autocomplete>
                <!-- 문자형이고 데이터 길이가 200보다 작거나 같은 경우 -->
                <v-text-field
                  v-else-if="expsnAttr.DATA_TYPE_CD === 'TXT' && expsnAttr.DATA_LEN <= 200"
                  v-model="expsnAttr.V_MODEL"
                  class="pl-form"
                  :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                  :maxlength="expsnAttr.DATA_LEN"
                  placeholder=""
                  v-byte-counter="expsnAttr.DATA_LEN"
                />
                <!-- 문자형이고 데이터 길이가 200보다 큰 경우 -->
                <v-textarea
                  v-else-if="expsnAttr.DATA_TYPE_CD === 'TXT' && expsnAttr.DATA_LEN > 200"
                  v-model="expsnAttr.V_MODEL"
                  class="pl-form is-noresize"
                  :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                  :maxlength="expsnAttr.DATA_LEN"
                  :spellcheck="false"
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
                  oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"
                  placeholder="숫자만 입력 가능 합니다."
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
                <!-- 우편번호인 경우 -->
                <div v-else-if="expsnAttr.DATA_TYPE_CD === 'POST'">
                  <v-text-field
                    v-model="expsnAttr.V_MODEL"
                    class="pl-form is-search"
                    :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                    :maxlength="expsnAttr.DATA_LEN"
                    disabled
                    style="width: 100%;"
                    v-byte-counter="expsnAttr.DATA_LEN"
                  >
                    <template v-slot:append>
                      <v-btn
                        @click="callpostDialog(`${seq}`)"
                        class="pl-btn has-icon-only">
                        <span class="pl-icon20 in-search"></span>
                      </v-btn>
                    </template>
                  </v-text-field>
                  <v-text-field v-if="expsnAttr.V_MODEL_DTL && expsnAttr.V_MODEL_DTL.length > 0"
                    v-model="expsnAttr.V_MODEL_DTL[0]"
                    class="pl-form mt-1"
                    :ref="`V_MODEL_ADDR_${seq}`"
                    disabled
                    style="width: 100%;"
                  />
                  <v-text-field v-if="expsnAttr.V_MODEL_DTL && expsnAttr.V_MODEL_DTL.length > 1"
                    v-model="expsnAttr.V_MODEL_DTL[1]"
                    class="pl-form mt-1"
                    :ref="`V_MODEL_DTL_ADDR_${seq}`"
                    style="width: 100%;"
                    v-byte-counter="expsnAttr.DATA_LEN"
                  />
                </div>
                <!-- 해시태크인 경우 -->
                <div class="pl-tags-wrap" v-else-if="expsnAttr.DATA_TYPE_CD === 'HASH'">
                  <v-chip-group
                    active-class="active-tag"
                    column
                  >
                    <template v-for="tag, index in expsnAttr.tags" >
                      <v-chip
                        v-show="tag.active"
                        :key="index"
                        close
                        @click:close="tag.active = false"
                      >
                        {{ tag.text }}
                      </v-chip>
                    </template>
                    <template>
                      <v-text-field
                        v-model="expsnAttr.V_MODEL"
                        :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                        @keydown.enter="addTag(`${seq}`)"
                        @input="onInputTag(`${seq}`)"
                        :style="computedTagSize"
                        class="pl-form is-tag"
                        v-byte-counter="expsnAttr.DATA_LEN"
                      >
                        <template v-slot:append>
                          <v-btn
                            @click="addTag(`${seq}`)"
                            class="pl-btn has-icon-only">
                            <span class="pl-icon20 edit"></span>
                          </v-btn>
                        </template>
                      </v-text-field>
                    </template>
                  </v-chip-group>
                </div>
                <!-- 날짜형인 경우 -->
                <div class="pl-desc is-reserveCall" v-else-if="expsnAttr.DATA_TYPE_CD === 'DAT'">
                  <v-checkbox
                    v-model="expsnAttr.V_MODEL"
                    :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                    class="pl-check"
                    @click="toggleChkReserve(`${seq}`,$event)"
                  ></v-checkbox>
                  <compo-date-picker
                    v-if="expsnAttr.dateReservePicker"
                    DateType="dateTime"
                    :DateProp.sync="expsnAttr.dateTimeDate"
                    :TimesProp.sync="expsnAttr.selectedTime"
                    :AmpmProp.sync="expsnAttr.selectedAmpm"
                    />
                  <!-- 캘린더 간편 모달 -->
                  <div
                    v-show="expsnAttr.dropDateReserve"
                    class="pl-drop-layer is-dateReserve"
                    :style="{ position: 'fixed', top: `${posY}px`, left: `${posX}px` }"
                    >
                    <div class="pl-drop-layer-header">
                      {{expsnAttr.EXPSN_ATTR_NM}} 알림시간
                    </div>
                    <div class="pl-drop-layer-body">
                      <ul class="pl-drop-layer-list">
                        <li
                          v-for="(time, index) in times" :key="index"
                          class="d-flex justify-space-between"
                          @click="selectReserveDateTime(`${seq}`,time.date)">
                          <span>{{ time.label }}</span> <span>{{ displayReserveTime(`${seq}`,time.date) }}</span>
                        </li>
                      </ul>
                    </div>
                    <div class="pl-drop-layer-footer">
                      <v-btn
                        class="pl-btn is-icon is-sub is-calendarPick flex-grow-1"
                        @click="showDatePicker(`${seq}`)"
                      >
                        <span class="pl-icon20 calendarPick"></span>
                        날짜 및 시간 직접 선택
                      </v-btn>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <template v-if="expsnAttr.DATA_TYPE_CD === 'COE' || expsnAttr.DATA_TYPE_CD === 'COE_MULTI'">
                  <div v-html="expsnAttr.CD_NM"></div>
                </template>
                <template v-else-if="expsnAttr.EXPSN_ATTR_COL_ID !== 'CUSL_CN' && (expsnAttr.DATA_TYPE_CD === 'TXT' || expsnAttr.DATA_TYPE_CD === 'NUM' || expsnAttr.DATA_TYPE_CD === 'POST')">
                  <template v-if="expsnAttr.INDI_INFO_ENCPT_YN === 'Y'">
                    <div v-html="mixin_getCustcoSetting('ENV_INDIINFO_MASKING_YN') ? mixin_mask_info(expsnAttr.ATTR_VL): mixin_encodeEnter(expsnAttr.ATTR_VL)"></div>
                  </template>
                  <template v-else>
                    <div v-html="mixin_encodeEnter(expsnAttr.ATTR_VL)"></div>
                  </template>
                </template>
                <template v-else>
                  <div v-html="mixin_encodeEnter(expsnAttr.ATTR_VL)"></div>
                </template>
              </template>
            </div>
          </div>
          
        </div>
      </div>
    </template>
    <template v-else>
      <div class="pl-card pl-list-nodata">
        <span>조회된 고객 정보가 없습니다.</span>
      </div>
    </template>
    <!-- dialog -->
    <!-- 우편번호인 경우 modal -->
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
          <!-- component -->
          <compo-find-post
            @selected-post="getFindPost"
          />
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- 주의 고객관리 -->
    <v-dialog
      v-model="dialogAlertManage"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="주의고객 관리"
        @hide="mixin_hideDialog('AlertManage')"
        @submit="submitDialog('AlertManage')"
      >
        <template slot="body">
          <compo-black-manage
            ref="catuionCustDialog"
            :DataProp="this.custInfoProp"
            @custDefaultInfo="getCustDefaultInfo"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('AlertManage')">취소</v-btn>
          <v-btn class="pl-btn" @click="cautionCustProc">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- dialog -->
    <!-- 통합고객정보 -->
    <v-dialog
      v-model="dialogDuplCust"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="고객 통합"
        @hide="[mixin_hideDialog('DuplCust'), MERGE_CUST='']"
        @submit="submitDialog('DuplCust')"
      >
      <template slot="body">
          <p>통합 할 고객을 선택하신 후 <strong>[통합하기]버튼을 클릭</strong>하십시오 </p>
          <p>고객의 이력데이터가 모두 통합되므로 <span class="is-txt-red">데이터의 양에 따라 다소 시간이 걸릴 수 있습니다.</span> </p>
          <div class="pl-cols is-mt-l">
            <div>
              <h2 class="pl-dialog-body-tit-h2 is-border">기존 고객 정보</h2>
              <div class="pl-scroll-body d-flex flex-column is-mt-m" style="overflow-y: scroll; height: calc(100vh - 460px); ">
                <div
                  :class="`pl-form-box ${ STYLE_SELECTED_BOX === 0 ? 'active' : '' }`"
                  @click="[selMergeCust(0)]">
                  <!-- 우편번호인 경우 modal -->
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
                        <!-- component -->
                        <compo-find-post
                          @selected-post="getFindPost"
                        />
                      </template>
                    </compo-dialog>
                  </v-dialog>
                  <div class="pl-form-inline-wrap vertical">
                    <div
                      v-for="(expsnAttr, seq) in ORG_EXPSN_ATTR"
                      :key="expsnAttr.ATTR_ID"
                      class="pl-form-inline">
                      <span class="pl-label">
                        {{ expsnAttr.EXPSN_ATTR_NM }}
                        <v-icon v-show="expsnAttr.ESNTL_YN === 'Y'" class="pl-icon20 required"></v-icon> <!-- 필수 입력인 경우  -->
                      </span>
                      <div class="pl-desc">
                        <template v-if="DuplCustNoEdit">
                          <!-- 단일 선택형인 경우 -->
                          <v-autocomplete
                            v-if="expsnAttr.DATA_TYPE_CD === 'COE'"
                            v-model="expsnAttr.V_MODEL"
                            class="pl-form"
                            :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                            :items="mixin_common_code_get(common_code, expsnAttr.GROUP_CD_ID)"
                            placeholder="선택하세요"
                            no-data-text="결과 없음"
                          />
                          <!-- 다중 선택형인 경우 -->
                          <v-autocomplete
                            v-else-if="expsnAttr.DATA_TYPE_CD === 'COE_MULTI'"
                            v-model="expsnAttr.V_MODEL"
                            return-object
                            class="pl-form is-auto"
                            :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                            :items="mixin_common_code_get(common_code, expsnAttr.GROUP_CD_ID)"
                            multiple
                            small-chips
                            >
                            <template v-slot:selection="{ attrs, item, parent, selected, index }">
                              <v-chip
                                v-if="item === Object(item)"
                                v-bind="attrs"
                                :input-value="selected"
                                small
                              >
                                <span class="pr-2">
                                  {{ item.text }}
                                </span>
                                <v-icon small @click="parent.selectItem(item)" >
                                  $delete
                                </v-icon>
                              </v-chip>
                            </template>
                          </v-autocomplete>
                          <!-- 문자형이고 데이터 길이가 200보다 작거나 같은 경우 -->
                          <v-text-field
                            v-else-if="expsnAttr.DATA_TYPE_CD === 'TXT' && expsnAttr.DATA_LEN <= 200"
                            v-model="expsnAttr.V_MODEL"
                            class="pl-form"
                            :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                            :maxlength="expsnAttr.DATA_LEN"
                            placeholder=""
                            v-byte-counter="expsnAttr.DATA_LEN"
                          />
                          <!-- 문자형이고 데이터 길이가 200보다 큰 경우 -->
                          <v-textarea
                            v-else-if="expsnAttr.DATA_TYPE_CD === 'TXT' && expsnAttr.DATA_LEN > 200"
                            v-model="expsnAttr.V_MODEL"
                            class="pl-form is-noresize"
                            :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                            :maxlength="expsnAttr.DATA_LEN"
                            :spellcheck="false"
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
                            oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"
                            placeholder="숫자만 입력 가능 합니다."
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
                          <!-- 우편번호인 경우 -->
                          <div v-else-if="expsnAttr.DATA_TYPE_CD === 'POST'">
                            <v-text-field
                              v-model="expsnAttr.V_MODEL"
                              class="pl-form is-search"
                              :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                              :maxlength="expsnAttr.DATA_LEN"
                              disabled
                              style="width: 100%;"
                              v-byte-counter="expsnAttr.DATA_LEN"
                            >
                              <template v-slot:append>
                                <v-btn
                                  @click="callpostDialog(`${seq}`)"
                                  class="pl-btn has-icon-only">
                                  <span class="pl-icon20 in-search"></span>
                                </v-btn>
                              </template>
                            </v-text-field>
                            <v-text-field
                              v-model="expsnAttr.V_MODEL_DTL[0]"
                              class="pl-form mt-1"
                              :ref="`V_MODEL_ADDR_${seq}`"
                              disabled
                              style="width: 100%;"
                            />
                            <v-text-field
                              v-model="expsnAttr.V_MODEL_DTL[1]"
                              class="pl-form mt-1"
                              :ref="`V_MODEL_DTL_ADDR_${seq}`"
                              style="width: 100%;"
                              v-byte-counter="expsnAttr.DATA_LEN"
                            />
                          </div>
                          <!-- 해시태크인 경우 -->
                          <div class="pl-tags-wrap" v-else-if="expsnAttr.DATA_TYPE_CD === 'HASH'">
                            <v-chip-group
                              active-class="active-tag"
                              column
                            >
                              <template v-for="tag, index in expsnAttr.tags" >
                                <v-chip
                                  v-show="tag.active"
                                  :key="index"
                                  close
                                  @click:close="tag.active = false"
                                >
                                  {{ tag.text }}
                                </v-chip>
                              </template>
                              <template>
                                <v-text-field
                                  v-model="expsnAttr.V_MODEL"
                                  :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                                  @keydown.enter="addTag(`${seq}`)"
                                  @input="onInputTag(`${seq}`)"
                                  :style="computedTagSize"
                                  class="pl-form is-tag"
                                  v-byte-counter="expsnAttr.DATA_LEN"
                                >
                                  <template v-slot:append>
                                    <v-btn
                                      @click="addTag(`${seq}`)"
                                      class="pl-btn has-icon-only">
                                      <span class="pl-icon20 edit"></span>
                                    </v-btn>
                                  </template>
                                </v-text-field>
                              </template>
                            </v-chip-group>
                          </div>
                          <!-- 날짜형인 경우 -->
                          <div class="pl-desc is-reserveCall" v-else-if="expsnAttr.DATA_TYPE_CD === 'DAT'">
                            <v-checkbox
                              v-model="expsnAttr.V_MODEL"
                              :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                              class="pl-check"
                              @click="toggleChkReserve(`${seq}`,$event)"
                            ></v-checkbox>
                            <compo-date-picker
                              v-if="expsnAttr.dateReservePicker"
                              DateType="dateTime"
                              :DateProp.sync="expsnAttr.dateTimeDate"
                              :TimesProp.sync="expsnAttr.selectedTime"
                              :AmpmProp.sync="expsnAttr.selectedAmpm"
                              />
                            <!-- 캘린더 간편 모달 -->
                            <div
                              v-show="expsnAttr.dropDateReserve"
                              class="pl-drop-layer is-dateReserve"
                              :style="{ position: 'fixed', top: `${posY}px`, left: `${posX}px` }"
                              >
                              <div class="pl-drop-layer-header">
                                {{expsnAttr.EXPSN_ATTR_NM}} 알림시간
                              </div>
                              <div class="pl-drop-layer-body">
                                <ul class="pl-drop-layer-list">
                                  <li
                                    v-for="(time, index) in times" :key="index"
                                    class="d-flex justify-space-between"
                                    @click="selectReserveDateTime(`${seq}`,time.date)">
                                    <span>{{ time.label }}</span> <span>{{ displayReserveTime(`${seq}`,time.date) }}</span>
                                  </li>
                                </ul>
                              </div>
                              <div class="pl-drop-layer-footer">
                                <v-btn
                                  class="pl-btn is-icon is-sub is-calendarPick flex-grow-1"
                                  @click="showDatePicker(`${seq}`)"
                                >
                                  <span class="pl-icon20 calendarPick"></span>
                                  날짜 및 시간 직접 선택
                                </v-btn>
                              </div>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <div v-html="expsnAttr.DATA_TYPE_CD === 'COE' || expsnAttr.DATA_TYPE_CD === 'COE_MULTI' ? expsnAttr.CD_NM : mixin_encodeEnter(expsnAttr.ATTR_VL)"></div>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="ml-4">
              <h2 class="pl-dialog-body-tit-h2 is-border">신규 고객 정보</h2>
              <div class="pl-scroll-body d-flex flex-column is-mt-m" style="overflow-y: scroll; height: calc(100vh - 460px); ">
                <div
                  :class="`pl-form-box ${ STYLE_SELECTED_BOX === 1 ? 'active' : '' }`"
                  @click="[selMergeCust(1)]">
                  <!-- 우편번호인 경우 modal -->
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
                        <!-- component -->
                        <compo-find-post
                          @selected-post="getFindPost"
                        />
                      </template>
                    </compo-dialog>
                  </v-dialog>
                  <div class="pl-form-inline-wrap vertical">
                    <div
                      v-for="(expsnAttr, seq) in EXPSN_ATTR"
                      :key="expsnAttr.ATTR_ID"
                      class="pl-form-inline">
                      <span class="pl-label">
                        {{ expsnAttr.EXPSN_ATTR_NM }}
                        <v-icon v-show="expsnAttr.ESNTL_YN === 'Y'" class="pl-icon20 required"></v-icon> <!-- 필수 입력인 경우  -->
                      </span>
                      <div class="pl-desc">
                        <template v-if="DuplCustNoEdit">
                          <!-- 단일 선택형인 경우 -->
                          <v-autocomplete
                            v-if="expsnAttr.DATA_TYPE_CD === 'COE'"
                            v-model="expsnAttr.V_MODEL"
                            class="pl-form"
                            :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                            :items="mixin_common_code_get(common_code, expsnAttr.GROUP_CD_ID)"
                            placeholder="선택하세요"
                            no-data-text="결과 없음"
                          />
                          <!-- 다중 선택형인 경우 -->
                          <v-autocomplete
                            v-if="expsnAttr.DATA_TYPE_CD === 'COE_MULTI'"
                            v-model="expsnAttr.V_MODEL"
                            return-object
                            class="pl-form is-auto"
                            style="width:137px"
                            :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                            :items="mixin_common_code_get(common_code, expsnAttr.GROUP_CD_ID)"
                            multiple
                            small-chips
                            >
                            <template v-slot:selection="{ attrs, item, parent, selected, index }">
                              <v-chip
                                v-if="item === Object(item)"
                                v-bind="attrs"
                                :input-value="selected"
                                small
                              >
                                <span class="pr-2">
                                  {{ item.text }}
                                </span>
                                <v-icon small @click="parent.selectItem(item)" >
                                  $delete
                                </v-icon>
                              </v-chip>
                            </template>
                          </v-autocomplete>
                          <!-- 문자형이고 데이터 길이가 200보다 작거나 같은 경우 -->
                          <v-text-field
                            v-else-if="expsnAttr.DATA_TYPE_CD === 'TXT' && expsnAttr.DATA_LEN <= 200"
                            v-model="expsnAttr.V_MODEL"
                            class="pl-form"
                            :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                            :maxlength="expsnAttr.DATA_LEN"
                            placeholder=""
                            v-byte-counter="expsnAttr.DATA_LEN"
                          />
                          <!-- 문자형이고 데이터 길이가 200보다 큰 경우 -->
                          <v-textarea
                            v-else-if="expsnAttr.DATA_TYPE_CD === 'TXT' && expsnAttr.DATA_LEN > 200"
                            v-model="expsnAttr.V_MODEL"
                            class="pl-form is-noresize"
                            :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                            :maxlength="expsnAttr.DATA_LEN"
                            :spellcheck="false"
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
                            oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"
                            placeholder="숫자만 입력 가능 합니다."
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
                          <!-- 우편번호인 경우 -->
                          <div v-else-if="expsnAttr.DATA_TYPE_CD === 'POST'">
                            <v-text-field
                              v-model="expsnAttr.V_MODEL"
                              class="pl-form is-search"
                              :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                              :maxlength="expsnAttr.DATA_LEN"
                              disabled
                              style="width: 100%;"
                              v-byte-counter="expsnAttr.DATA_LEN"
                            >
                              <template v-slot:append>
                                <v-btn
                                  @click="callpostDialog(`${seq}`)"
                                  class="pl-btn has-icon-only">
                                  <span class="pl-icon20 in-search"></span>
                                </v-btn>
                              </template>
                            </v-text-field>
                            <v-text-field
                              v-model="expsnAttr.V_MODEL_DTL[0]"
                              class="pl-form mt-1"
                              :ref="`V_MODEL_ADDR_${seq}`"
                              disabled
                              style="width: 100%;"
                            />
                            <v-text-field
                              v-model="expsnAttr.V_MODEL_DTL[1]"
                              class="pl-form mt-1"
                              :ref="`V_MODEL_DTL_ADDR_${seq}`"
                              style="width: 100%;"
                              v-byte-counter="expsnAttr.DATA_LEN"
                            />
                          </div>
                          <!-- 해시태크인 경우 -->
                          <div class="pl-tags-wrap" v-else-if="expsnAttr.DATA_TYPE_CD === 'HASH'">
                            <v-chip-group
                              active-class="active-tag"
                              column
                            >
                              <template v-for="tag, index in expsnAttr.tags" >
                                <v-chip
                                  v-show="tag.active"
                                  :key="index"
                                  close
                                  @click:close="tag.active = false"
                                >
                                  {{ tag.text }}
                                </v-chip>
                              </template>
                              <template>
                                <v-text-field
                                  v-model="expsnAttr.V_MODEL"
                                  :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                                  @keydown.enter="addTag(`${seq}`)"
                                  @input="onInputTag(`${seq}`)"
                                  :style="computedTagSize"
                                  class="pl-form is-tag"
                                  v-byte-counter="expsnAttr.DATA_LEN"
                                >
                                  <template v-slot:append>
                                    <v-btn
                                      @click="addTag(`${seq}`)"
                                      class="pl-btn has-icon-only">
                                      <span class="pl-icon20 edit"></span>
                                    </v-btn>
                                  </template>
                                </v-text-field>
                              </template>
                            </v-chip-group>
                          </div>
                          <!-- 날짜형인 경우 -->
                          <div class="pl-desc is-reserveCall" v-else-if="expsnAttr.DATA_TYPE_CD === 'DAT'">
                            <v-checkbox
                              v-model="expsnAttr.V_MODEL"
                              :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                              class="pl-check"
                              @click="toggleChkReserve(`${seq}`,$event)"
                            ></v-checkbox>
                            <compo-date-picker
                              v-if="expsnAttr.dateReservePicker"
                              DateType="dateTime"
                              :DateProp.sync="expsnAttr.dateTimeDate"
                              :TimesProp.sync="expsnAttr.selectedTime"
                              :AmpmProp.sync="expsnAttr.selectedAmpm"
                              />
                            <!-- 캘린더 간편 모달 -->
                            <div
                              v-show="expsnAttr.dropDateReserve"
                              class="pl-drop-layer is-dateReserve"
                              :style="{ position: 'fixed', top: `${posY}px`, left: `${posX}px` }"
                              >
                              <div class="pl-drop-layer-header">
                                {{expsnAttr.EXPSN_ATTR_NM}} 알림시간
                              </div>
                              <div class="pl-drop-layer-body">
                                <ul class="pl-drop-layer-list">
                                  <li
                                    v-for="(time, index) in times" :key="index"
                                    class="d-flex justify-space-between"
                                    @click="selectReserveDateTime(`${seq}`,time.date)">
                                    <span>{{ time.label }}</span> <span>{{ displayReserveTime(`${seq}`,time.date) }}</span>
                                  </li>
                                </ul>
                              </div>
                              <div class="pl-drop-layer-footer">
                                <v-btn
                                  class="pl-btn is-icon is-sub is-calendarPick flex-grow-1"
                                  @click="showDatePicker(`${seq}`)"
                                >
                                  <span class="pl-icon20 calendarPick"></span>
                                  날짜 및 시간 직접 선택
                                </v-btn>
                              </div>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <div v-html="expsnAttr.DATA_TYPE_CD === 'COE' || expsnAttr.DATA_TYPE_CD === 'COE_MULTI' ? expsnAttr.CD_NM : mixin_encodeEnter(expsnAttr.ATTR_VL)"></div>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </template>
        <template slot="footer">
          <v-btn
            class="pl-btn
            is-sub" @click="[mixin_hideDialog('DuplCust'),
            MERGE_CUST='']">취소</v-btn>
          <v-btn
            class="pl-btn"
            :disabled="MERGE_CUST ? false : true"
            @click="MERGE_CUST=='ORG' ? showAlert(MESSAGE.CONFIRM.MERGE_CUST_ORG) : showAlert(MESSAGE.CONFIRM.MERGE_CUST_NEW)">통합하기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
  import { eventBus } from "@/store/eventBus.js";           //Event Bus

  export default {
    name: 'Mainchat_cust_info',
    props: {
      CHNL: {
        type: String
        , default: 'TEL'
      },
      CUST_ID: {
        type: Number
        , default: -1
      },
      custInfoProp: {
        type: Object,
      },
      CTI_STAT : {
        type: Boolean
        , default : false
      },
      CALL_ING : {
        type: Boolean
        , default : false
      },
    },
    data() {
      return {
        DATA : {},

        common_code : [],
        resizeClass: false,
        addable: false,
        editable: false,
        DuplCustNoEdit: false,
        dropShare: false,
        dropAgree: false,
        // dialog
        dialogAlertManage: false,
        dialogDuplCust: false,

        //고객 확장 정보
        EXPSN_ATTR : [],
        //기존고객 확장 정보
        ORG_EXPSN_ATTR : [],

        SELECTED_ATTR_INDEX : 0, //선택된 확장 속성 INDEX

        dialogFindPost:false, //우편번호 Dialog

        //확장 속성중 날짜형 사용 data
        posX: 0,
        posY: 0,
        times: [
          { label: "30분 후", date: ["dateTimeDate","dateTimeTime", 0, 0, 30] },
          { label: "1시간 후", date: ["dateTimeDate","dateTimeTime", 0, 1, 0] },
          { label: "내일", date: ["dateTimeDate", "dateTimeTime", 1, 0, 0] },
          { label: "이틀 후", date: ["dateTimeDate", "dateTimeTime", 2, 0, 0] },
          { label: "다음 주", date: ["dateTimeDate", "dateTimeTime", 7, 0, 0] }
        ],
        dateTimeDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        dateTimeTime: new Date(),
        selectedTime: '',
        selectedAmpm: '',
        chkDateReserve: false,
        dateReservePicker: false,
        dropDateReserve: false,

        //고객 동의 정보
        CUST_AGRE_INFO : [],

        SHARE_LIST: [
          {
            icon: 'share-facebook',
            name: '페이스북'
          },
          {
            icon: 'share-line',
            name: '라인'
          },
          {
            icon: 'share-instagram',
            name: '인스타그램'
          },
          {
            icon: 'share-twitter',
            name: '트위터'
          },
        ],

        //confirm alert 메시지
        MESSAGE : {
          CONFIRM : {
            REG : {alertDialogToggle: true, msg: '고객 정보를 저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.custSaveValidate, callNo: this.closeMsg}
            , DUPL_CUST : {alertDialogToggle: true, msg: '고객 정보가 존재 합니다.<br>해당 고객 정보를 불러 오시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.custInfoSet, callNo: this.closeMsg}
            , DUPL_CUST_MERGE: {alertDialogToggle: true, msg: '해당 전화번호가 존재 합니다.<br>해당 고객과 통합하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.setDuplCust, callNo: this.closeMsg}
            , NEW_CUST : {alertDialogToggle: true, msg: '신규 고객을 추가 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.addCustInfoSet, callNo: this.closeCustMsg}
            , RESET_CUST : {alertDialogToggle: true, msg: '고객 정보를 초기화 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.resetCustInfoSet, callNo: this.closeResetCustMsg}
            , MERGE_CUST_ORG : {alertDialogToggle: true, msg: '기존 고객으로 고객정보를 통합하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.mergeCustOrg, callNo: this.closeResetCustMsg}
            , MERGE_CUST_NEW : {alertDialogToggle: true, msg: '신규 고객으로 고객정보를 통합하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.mergeCustNew, callNo: this.closeResetCustMsg}
          },
          ALERT : {
            SUCCESS : {alertDialogToggle: true, msg: '정상 처리 되었습니다.', iconClass: 'is-info', type: 'default'}
            , NO_PHN_NO : {alertDialogToggle: true, msg: '전화번호를 삭제할 수 없습니다.', iconClass: 'is-info', type: 'default'}
            , MERGE_SUCCESS : {alertDialogToggle: true, msg: '고객 통합이 완료되었습니다.', iconClass: 'is-info', type: 'default'}
            , MERGE_NPSBL : {alertDialogToggle: true, msg: '통합이 불가능한 고객입니다<br>전화번호를 확인해주세요', iconClass: 'is-info', type: 'default'}
          },
          ERROR : {
            ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
          },
          TOAST : {
            SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000, type : 'right' },
            MERGE_SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          },
        },

        saveBeforeCustSelectData: [],
        saveCustDataDiff: [],

        EXISTS_CUST_ID : '',
        prevCustNm:'',

        NOW_PHN_NO: '', //기존 고객 전화번호
        ORG_CUST_ID:'', //기존 고객 ID
        MERGE_CUST:'',  //선택한 통합고객

        STYLE_SELECTED_BOX: '',

        custFormView:false,
      }
    },

    watch: {
      CUST_ID(){
        this.$nextTick(()=>{
          console.log('MainchatCusInfo CUST_ID : ', this.CUST_ID);
          this.getCustInfo({CUST_ID: this.CUST_ID, ADD_CUST : this.custInfoProp.ADD_CUST});
        });
      },
      CTI_STAT () {
        this.$nextTick(()=>{
          if(this.CTI_STAT){
            this.editable = false;
            this.addable = false;

            //상담 저장 후 고객 유지 여부
            if(!this.$store.getters["userConfigStore/GE_SAVE_AFTR_CUST_MAINTAIN"]){ //유지가 아닌 경우
              // console.log('MainchatCusInfo CTI_STAT : ', '<= 여기 : ' + this.CUST_ID);
              if(this.CUST_ID === -1) eventBus.busRingingCustInfoSrch("busRingingCustInfoSrch", {CUST_ID : -1, CUST_PHN_NO: '', ADD_CUST : false});
            }
          }
        });
      },
      CALL_ING () {
        this.$nextTick(()=>{
          // console.log('CALL_ING : ', this.CALL_ING);
        });
      },
      custInfoProp(){
        let time = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)

        if(!this.mixin_isEmpty(this.custInfoProp.CAUTION_VLD_BGNG_DT)){
          this.custInfoProp.CAUTION_VLD_BGNG_DT = this.mixin_convertDate(this.custInfoProp.CAUTION_VLD_BGNG_DT, 'yyyy-MM-dd');
        }else{
          this.custInfoProp.CAUTION_VLD_BGNG_DT = time;
        }
        if(!this.mixin_isEmpty(this.custInfoProp.CAUTION_VLD_END_DT)){
          this.custInfoProp.CAUTION_VLD_END_DT = this.mixin_convertDate(this.custInfoProp.CAUTION_VLD_END_DT, 'yyyy-MM-dd');
        }else{
          this.custInfoProp.CAUTION_VLD_END_DT = time;
        }
        // this.custInfoProp.CAUTION_VLD_BGNG_DT = this.mixin_convertDate(this.custInfoProp.CAUTION_VLD_BGNG_DT, 'yyyy-MM-dd');
        // this.custInfoProp.CAUTION_VLD_END_DT = this.mixin_convertDate(this.custInfoProp.CAUTION_VLD_END_DT, 'yyyy-MM-dd');

        if(this.custInfoProp.CAUTION_CUST_YN === 'Y'){
          this.custInfoProp.CAUTION_CUST_CHECKED = true;
        }else{
          this.custInfoProp.CAUTION_CUST_CHECKED = false;
          this.custInfoProp.CAUTION_CUST_CD = '3';
        }
      }
    },

    computed: {
      computedResizeClass() {
        return this.resizeClass === true ? 'pl-icon20 resize-on' : 'pl-icon20 resize-off'
      },
      computedResizeText() {
        return this.resizeClass === true ? '축소' : '확대'
      },
    },

    async created() {
      // if(!this.custInfoProp.CUST_ID){
        // await this.getCustInfo({CUST_ID : -1, ADD_CUST: false});
      // }
    },

    mounted() {
    },

    methods: {
      setPhoneNo(val){
        let res = this.mixin_setPhoneNo(val.replace(/[^0-9]/g, ""));
        this.custInfoProp.CUST_PHN_NO = res;
      },
      toggleResize() {
        this.resizeClass = !this.resizeClass;
      },
      async addForm() {
        this.prevCustNm = this.custInfoProp.CUST_NM;
        if(this.CUST_ID > -1){
          // this.custInfoProp.CUST_NM = '성명미상'
          this.showAlert(this.MESSAGE.CONFIRM.NEW_CUST);
        }else{
          this.editable = !this.editable;
          this.addable = !this.addable;
          this.custInfoProp.CUST_PHN_NO = '';
          await this.getCustInfo({CUST_ID: -1, ADD_CUST : true});
        }
      },
      editForm() {
        this.editable = !this.editable;
        this.$store.commit("statusStore/MU_CUST_MODIFY_ING", true); //상담 메인 고객 수정 진행중 여부를 true로 store 저장 처리
      },
      async editFormX() {
        // this.editable = false;
        // this.addable = false;
        await this.getCustInfo({CUST_ID : this.CUST_ID, ADD_CUST: false});
        this.$store.commit("statusStore/MU_CUST_MODIFY_ING", false); //상담 메인 고객 수정 진행중 여부를 false로 store 저장 처리
      },
      closeDropShare() {
        this.dropShare = false;
      },
      closeDropAgree() {
        this.dropAgree = false;
      },
      showBlackDialog(){
        this.CUST_ID > -1? this.mixin_showDialog('AlertManage') : '';
      },

      async addCustInfoSet() {
        this.clearCustInfoSet(true);
        this.closeCustMsg();
      },

      async resetCustInfoSet() {
        this.clearCustInfoSet(false);
        this.closeCustMsg();
      },

      async clearCustInfoSet(flag) {
        this.addable = flag;
        this.editable = flag;
        eventBus.busRingingCustInfoSrch("busRingingCustInfoSrch", {CUST_ID : -1, CUST_PHN_NO: '', ADD_CUST : flag, STT_OFF:false});
      },

      //고객 정보 조회
      async getCustInfo(data, org){
        if(org != 'ORG'){
          //변경이력 초기화.
          this.saveBeforeCustSelectData = [];
          this.saveCustDataDiff = [];

          this.editable = data.ADD_CUST;
          this.addable = data.ADD_CUST;
        }

        if(data.ADD_CUST){
          this.closeMsg();
        }

        if(data.CUST_ID === -1 && !data.ADD_CUST){
          this.custFormView = false;
          this.EXPSN_ATTR = [];

        }else{
          this.custFormView = true;

          let sUrl = '/api/setting/customer/custSelect';
          let postParam = {
            CUST_ID : data.CUST_ID
          }
  
          let headParam = {
            head : {
            }
          }
  
          let response  = await this.common_postCall(sUrl, postParam, headParam);
  
          if (!response.HEADER.ERROR_FLAG){
            //고객 통합을 위해 기존고객 정보 조회
            if(org != 'ORG'){
              if(this.custInfoProp.CAUTION_CUST_YN === 'Y'){
                this.custInfoProp.CAUTION_CUST_CHECKED = true;
              }else{
                this.custInfoProp.CAUTION_CUST_CHECKED = false;
                this.custInfoProp.CAUTION_CUST_CD = '3';
              }
  
              if(response.DATA.length > 0){
                this.custInfoProp.CUST_NM = (!response.DATA[0].CUST_NM)?'성명미상':response.DATA[0].CUST_NM;
                this.custInfoProp.CUST_PHN_NO = response.DATA[0].CUST_PHN_NO;
  
                this.NOW_PHN_NO = response.DATA[0].CUST_PHN_NO;
              }else{
                this.custInfoProp.CUST_NM = '성명미상';
                this.custInfoProp.CUST_PHN_NO = '';
                this.editable = data.ADD_CUST?true:false;
              }
  
              //변경이력 처리용도
              this.saveBeforeCustSelectData = response.DATA;
  
              //고객 확장 정보
              this.EXPSN_ATTR = response.CUST_EXPSN_INFO;
  
              let codeName = ['CALL_TP', 'CHNL']; //콜 유형과, 채널 공통코드
              if(response.CUST_EXPSN_INFO.length > 0){
                response.CUST_EXPSN_INFO.forEach((attr, idx) => {
                  if(attr.DATA_TYPE_CD === 'COE' || attr.DATA_TYPE_CD === 'COE_MULTI'){
                    if(attr.GROUP_CD_ID) codeName.push(attr.GROUP_CD_ID); //공통코드사용을 위해
                  }
                });
              }
  
              //공통코드설정
              this.common_code = await this.mixin_common_code_get_all(codeName);
  
              for(let i in this.EXPSN_ATTR){
                // this.EXPSN_ATTR[i].V_MODEL = this.EXPSN_ATTR[i].ATTR_VL.replace(/(?:\r\n|\r|\n)/g, '<br />'); //동적 v_model 생성
                this.EXPSN_ATTR[i].V_MODEL = this.EXPSN_ATTR[i].ATTR_VL; //동적 v_model 생성
  
                if(this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID === 'CUST_EMAIL') { //고객 이메일인경우.
                  this.custInfoProp.CUST_EMAIL = this.EXPSN_ATTR[i].ATTR_VL;
                }
                if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'DAT'){//날짜형인 경우
                  this.EXPSN_ATTR[i].V_MODEL = this.EXPSN_ATTR[i].ATTR_VL ? true:false; //chkDateReserve
                  this.EXPSN_ATTR[i].V_MODEL_DATE = this.EXPSN_ATTR[i].ATTR_VL; //날짜 v_model
                  this.EXPSN_ATTR[i].chkDateReserve = false; //chkDateReserve
                  this.EXPSN_ATTR[i].dateReservePicker = false; //dateReservePicker
                  this.EXPSN_ATTR[i].dropDateReserve = false; //dropDateReserve
                  this.EXPSN_ATTR[i].dateTimeDate = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); //dateTimeDate
                  this.EXPSN_ATTR[i].dateTimeTime = new Date(); //dateTimeTime
                  this.EXPSN_ATTR[i].selectedTime = ''; //selectedTime
                  this.EXPSN_ATTR[i].selectedAmpm = ''; //selectedAmpm
                }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'POST'){ //우편번호인 경우
                  if(this.EXPSN_ATTR[i].ATTR_VL){
                    let arrAddrInfo = (this.EXPSN_ATTR[i].ATTR_VL?this.EXPSN_ATTR[i].ATTR_VL.split('|'):'');
                    this.EXPSN_ATTR[i].V_MODEL = (arrAddrInfo?arrAddrInfo[0]:''); //주소 v_model
                    this.EXPSN_ATTR[i].V_MODEL_DTL = [];
                    this.EXPSN_ATTR[i].V_MODEL_DTL[0] = (arrAddrInfo?arrAddrInfo[1]:''); //상세 주소1 v_model
                    this.EXPSN_ATTR[i].V_MODEL_DTL[1] = (arrAddrInfo?arrAddrInfo[2]:''); //상세 주소2 v_model
                  }else{
                    this.EXPSN_ATTR[i].V_MODEL_DTL = [];
                    this.EXPSN_ATTR[i].V_MODEL_DTL[0] = ''; //상세 주소1 v_model
                    this.EXPSN_ATTR[i].V_MODEL_DTL[1] = ''; //상세 주소2 v_model
                  }
                }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'COE'){ //단일 선택인 경우
                  // if(this.EXPSN_ATTR[i].GROUP_CD_ID) codeName.push(this.EXPSN_ATTR[i].GROUP_CD_ID); //공통코드사용을 위해 그룹코드가 있는 경우만
                }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'COE_MULTI'){ //다중 선택인 경우
                  this.EXPSN_ATTR[i].V_MODEL = [];
                  // codeName.push(this.EXPSN_ATTR[i].GROUP_CD_ID); //공통코드사용을 위해
  
                  let items = this.mixin_common_code_get(this.common_code, this.EXPSN_ATTR[i].GROUP_CD_ID);
                  let cdNms = '';
                  if(this.EXPSN_ATTR[i].ATTR_VL){
                    items.forEach((code, idx) => {
                      this.EXPSN_ATTR[i].ATTR_VL.split(',').forEach((data, seq) => {
                        if(code.value === data){
                          this.EXPSN_ATTR[i].V_MODEL.push(code);
                          cdNms += (cdNms?',':'')+code.text;
                        }
                      });
                    });
                  }
                  this.EXPSN_ATTR[i].CD_NM = cdNms;
  
                }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'HASH'){ //해시태그인 경우
                  this.EXPSN_ATTR[i].tags = [];
                  if(this.EXPSN_ATTR[i].ATTR_VL){
                    for(let idx in this.EXPSN_ATTR[i].ATTR_VL.split(',')){
                      this.EXPSN_ATTR[i].tags[idx] = this.EXPSN_ATTR[i].ATTR_VL.split(',')[idx];
                    }
                  }
                  this.EXPSN_ATTR[i].inputTagSize = '';
                }
              }
  
              //고객 동의 정보
              if(response.CUST_AGRE_INFO){
                for(let k in response.CUST_AGRE_INFO){
                  if(response.CUST_AGRE_INFO[k].AGRE_YN === 'Y'){
                    response.CUST_AGRE_INFO[k].AGRE_INFO = await this.mixin_convertDate(response.CUST_AGRE_INFO[k].AGRE_DT, 'yyyy-MM-dd HH:mm:ss');
                    response.CUST_AGRE_INFO[k].CHECKED = response.CUST_AGRE_INFO[k].AGRE_YN == 'Y'?true:false;
                  }else{
                    response.CUST_AGRE_INFO[k].AGRE_INFO = '미동의';
                  }
                }
              }
  
              this.CUST_AGRE_INFO = response.CUST_AGRE_INFO;
            } else {
              //고객 확장 정보
              this.ORG_EXPSN_ATTR = response.CUST_EXPSN_INFO;
  
              let codeName = ['CALL_TP', 'CHNL']; //콜 유형과, 채널 공통코드
              if(response.CUST_EXPSN_INFO.length > 0){
                response.CUST_EXPSN_INFO.forEach((attr, idx) => {
                  if(attr.DATA_TYPE_CD === 'COE' || attr.DATA_TYPE_CD === 'COE_MULTI'){
                    if(attr.GROUP_CD_ID) codeName.push(attr.GROUP_CD_ID); //공통코드사용을 위해
                  }
                });
              }
  
              //공통코드설정
              this.common_code = await this.mixin_common_code_get_all(codeName);
  
              for(let i in this.ORG_EXPSN_ATTR){
                // this.ORG_EXPSN_ATTR[i].V_MODEL = this.ORG_EXPSN_ATTR[i].ATTR_VL.replace(/(?:\r\n|\r|\n)/g, '<br />'); //동적 v_model 생성
                this.ORG_EXPSN_ATTR[i].V_MODEL = this.ORG_EXPSN_ATTR[i].ATTR_VL; //동적 v_model 생성
  
                if(this.ORG_EXPSN_ATTR[i].EXPSN_ATTR_COL_ID === 'CUST_EMAIL') { //고객 이메일인경우.
                  this.custInfoProp.CUST_EMAIL = this.ORG_EXPSN_ATTR[i].ATTR_VL;
                }
                if(this.ORG_EXPSN_ATTR[i].DATA_TYPE_CD === 'DAT'){//날짜형인 경우
                  this.ORG_EXPSN_ATTR[i].V_MODEL = this.ORG_EXPSN_ATTR[i].ATTR_VL ? true:false; //chkDateReserve
                  this.ORG_EXPSN_ATTR[i].V_MODEL_DATE = this.ORG_EXPSN_ATTR[i].ATTR_VL; //날짜 v_model
                  this.ORG_EXPSN_ATTR[i].chkDateReserve = false; //chkDateReserve
                  this.ORG_EXPSN_ATTR[i].dateReservePicker = false; //dateReservePicker
                  this.ORG_EXPSN_ATTR[i].dropDateReserve = false; //dropDateReserve
                  this.ORG_EXPSN_ATTR[i].dateTimeDate = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); //dateTimeDate
                  this.ORG_EXPSN_ATTR[i].dateTimeTime = new Date(); //dateTimeTime
                  this.ORG_EXPSN_ATTR[i].selectedTime = ''; //selectedTime
                  this.ORG_EXPSN_ATTR[i].selectedAmpm = ''; //selectedAmpm
                }else if(this.ORG_EXPSN_ATTR[i].DATA_TYPE_CD === 'POST'){ //우편번호인 경우
                  if(this.ORG_EXPSN_ATTR[i].ATTR_VL){
                    let arrAddrInfo = (this.ORG_EXPSN_ATTR[i].ATTR_VL?this.ORG_EXPSN_ATTR[i].ATTR_VL.split('|'):'');
                    this.ORG_EXPSN_ATTR[i].V_MODEL = (arrAddrInfo?arrAddrInfo[0]:''); //주소 v_model
                    this.ORG_EXPSN_ATTR[i].V_MODEL_DTL = [];
                    this.ORG_EXPSN_ATTR[i].V_MODEL_DTL[0] = (arrAddrInfo?arrAddrInfo[1]:''); //상세 주소1 v_model
                    this.ORG_EXPSN_ATTR[i].V_MODEL_DTL[1] = (arrAddrInfo?arrAddrInfo[2]:''); //상세 주소2 v_model
                  }else{
                    this.ORG_EXPSN_ATTR[i].V_MODEL_DTL = [];
                    this.ORG_EXPSN_ATTR[i].V_MODEL_DTL[0] = ''; //상세 주소1 v_model
                    this.ORG_EXPSN_ATTR[i].V_MODEL_DTL[1] = ''; //상세 주소2 v_model
                  }
                }else if(this.ORG_EXPSN_ATTR[i].DATA_TYPE_CD === 'COE'){ //단일 선택인 경우
                  // if(this.ORG_EXPSN_ATTR[i].GROUP_CD_ID) codeName.push(this.ORG_EXPSN_ATTR[i].GROUP_CD_ID); //공통코드사용을 위해 그룹코드가 있는 경우만
                }else if(this.ORG_EXPSN_ATTR[i].DATA_TYPE_CD === 'COE_MULTI'){ //다중 선택인 경우
                  this.EXPSN_ATTR[i].V_MODEL = [];
                  // codeName.push(this.EXPSN_ATTR[i].GROUP_CD_ID); //공통코드사용을 위해
  
                  let items = this.mixin_common_code_get(this.common_code, this.EXPSN_ATTR[i].GROUP_CD_ID);
                  let cdNms = '';
                  if(this.EXPSN_ATTR[i].ATTR_VL){
                    items.forEach((code, idx) => {
                      this.EXPSN_ATTR[i].ATTR_VL.split(',').forEach((data, seq) => {
                        if(code.value === data){
                          this.EXPSN_ATTR[i].V_MODEL.push(code);
                          cdNms += (cdNms?',':'')+code.text;
                        }
                      });
                    });
                  }
                  this.EXPSN_ATTR[i].CD_NM = cdNms;
  
                }else if(this.ORG_EXPSN_ATTR[i].DATA_TYPE_CD === 'HASH'){ //해시태그인 경우
                  this.ORG_EXPSN_ATTR[i].tags = [];
                  if(this.ORG_EXPSN_ATTR[i].ATTR_VL){
                    for(let idx in this.ORG_EXPSN_ATTR[i].ATTR_VL.split(',')){
                      this.ORG_EXPSN_ATTR[i].tags[idx] = this.ORG_EXPSN_ATTR[i].ATTR_VL.split(',')[idx];
                    }
                  }
                  this.ORG_EXPSN_ATTR[i].inputTagSize = '';
                }
              }
            }
          }
        }

      },

      async toggleChkReserve(seq, event) {
        this.SELECTED_ATTR_INDEX = seq;
        this.posX = event.clientX + 10;
        this.posY = event.clientY - 50;

        if(this.EXPSN_ATTR[seq].V_MODEL === true) {
          this.EXPSN_ATTR[seq].dropDateReserve = true;
          this.EXPSN_ATTR[seq].dateTimeDate = await this.mixin_convertDate(await this.mixin_getSvrDate("YYYYMMDDHH24MISS"), 'yyyy-MM-dd');
          this.EXPSN_ATTR[seq].dateTimeTime = new Date(await this.mixin_convertDate(await this.mixin_getSvrDate("YYYYMMDDHH24MISS"), 'yyyy-MM-dd HH:mm:ss'));
        } else {
          this.EXPSN_ATTR[seq].dropDateReserve = false;
          this.EXPSN_ATTR[seq].dateReservePicker = false;
          return
        }
      },
      showDatePicker(){
        this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].dateReservePicker = true;
        this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].dropDateReserve = false;
      },

      selectReserveDateTime(seq, date) {
        this.SELECTED_ATTR_INDEX = seq;
        // getReserveTime 메소드를 호출하여 반환된 값을 변수에 저장
        let getDate = this.getReserveTime(seq, date);

        // 날짜와 시간을 따로 분리하여 데이터 속성에 저장
        this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].dateTimeDate = new Date(getDate[0]).toISOString().substr(0, 10);
        getDate[3].toString().length === 1 ? getDate[3] = "0" + getDate[3] : null;
        this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].selectedTime = `${String(getDate[3]).padStart(2, '0')}:${String(getDate[4]).padStart(2, '0')}`;
        this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].selectedAmpm = `${getDate[2]}`;
        this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].V_MODEL_DATE = this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].dateTimeDate.replace(/-/gi, '')+this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].selectedTime.replace(/:/gi, '')+'00';

        this.showDatePicker();
      },
      getReserveTime(seq, date) {
        let newDate = this.EXPSN_ATTR[seq].dateTimeDate;
        let newTime = this.EXPSN_ATTR[seq].dateTimeTime;
        let newDay = new Date( new Date(newDate).setDate(new Date(newDate).getDate() + date[2]) );

        let newTimeHours = new Date(newTime).getHours() + date[3];
        let newTimeMinutes = new Date(newTime).getMinutes() + date[4];
        let ampm = newTimeHours < 12 ? "오전" : "오후";

        let daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
        let dayOfWeek = daysOfWeek[newDay.getDay()];
        if( date[2] === 0 ) {
            dayOfWeek = '오늘';
        }

        // newTimeHours = newTimeHours % 12 || 12;

        if ( newTimeMinutes >= 60) {
          newTimeHours = newTimeHours + 1;
          newTimeMinutes = newTimeMinutes % 60;
        }

        let calculateDate = [newDay.toISOString().substr(0, 10), dayOfWeek, ampm, newTimeHours, newTimeMinutes];

        return calculateDate;
      },
      displayReserveTime(seq, date) {
        let getDate = this.getReserveTime(seq, date);
        let targetDate = `${ getDate[1] } ${getDate[2]} ${String(getDate[3]).padStart(2, '0')}:${String(getDate[4]).padStart(2, '0')}`;

        return targetDate;
      },
      // tags
      addTag(seq){
        this.SELECTED_ATTR_INDEX = seq;
        let tagVal = this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].V_MODEL.trim();

        if( tagVal.length !== 0 ) {
          const addTag = { text: tagVal, active: true };
          this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].tags.push(addTag);
          this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].V_MODEL = '';
          this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].inputTagSize = 0;
        }
      },
      onInputTag(seq){
        this.SELECTED_ATTR_INDEX = seq;
        this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].inputTagSize = this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].V_MODEL.length;
      },

      //우편번호 찾기 모달
      callpostDialog(seq) {
        this.SELECTED_ATTR_INDEX = seq;
        this.$eventBus.$emit("reSetPost");
        this.mixin_showDialog('FindPost');
      },
      //우편번호 Set
      getFindPost(data) {
        this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].V_MODEL = data.zipNo; //우편번호
        this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].V_MODEL_DTL[0] = data.roadAddr; //기본주소
        this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].V_MODEL_DTL[1] = ''; //상세주소
        this.mixin_hideDialog('FindPost');
      },

      //clase confirm, alert
      closeMsg() {
        this.$store.commit("alertStore/hideAlert");
      },

      closeCustMsg() {
        this.custInfoProp.CUST_NM = this.prevCustNm;
        this.$store.commit("alertStore/hideAlert");
      },

      closeResetCustMsg() {
        this.$store.commit("alertStore/hideAlert");
      },

      //고객 정보 저장 validate
      custSaveValidate(){
        this.$store.commit("alertStore/btnYisLoading");
        if(this.custInfoProp.CUST_NM === ''){
          this.showAlert({alertDialogToggle: true, msg: '고객명은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
          return;
        }

        if(this.custInfoProp.CHNL === 'TEL'){
          if(this.addable){
            if(this.custInfoProp.CUST_PHN_NO === ''){
              this.showAlert({alertDialogToggle: true, msg: '고객 전화번호는 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
              return;
            }
          }
        }

        for(let i in this.EXPSN_ATTR){
          if(this.EXPSN_ATTR[i].ESNTL_YN === 'Y'){ //필수 입력인 경우
            if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'TXT'){ //문자형
              if(!this.EXPSN_ATTR[i].V_MODEL){
                this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                return;
              }else{
                if(this.EXPSN_ATTR[i].V_MODEL.length > this.EXPSN_ATTR[i].DATA_LEN){
                  this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 0 ~ '+this.EXPSN_ATTR[i].DATA_LEN+'byte 이내로 입력해 주세요.', iconClass: 'is-caution', type: 'default'});
                  return;
                }
              }
            }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'NUM' || this.EXPSN_ATTR[i].DATA_TYPE_CD === 'NUM_COMMA'){ //숫자형
              if(!this.EXPSN_ATTR[i].V_MODEL){
                this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                return;
              }else{
                if(this.EXPSN_ATTR[i].V_MODEL.length > this.EXPSN_ATTR[i].DATA_LEN){
                  this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 0 ~ '+this.EXPSN_ATTR[i].DATA_LEN+'byte 이내로 입력해 주세요.', iconClass: 'is-caution', type: 'default'});
                  return;
                }
              }
            }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'COE'){ //단일 선택형
              if(Array.isArray(this.EXPSN_ATTR[i].V_MODEL)){
                let iCnt = 0;
                for(let k in this.EXPSN_ATTR[i].V_MODEL){
                  if(this.EXPSN_ATTR[i].V_MODEL[k]) iCnt++;
                }
                if(iCnt === 0){
                  this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                  return;
                }
              }else{
                if(!this.EXPSN_ATTR[i].V_MODEL){
                  this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                  return;
                }
              }
            }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'COE_MULTI'){ //다중 선택형
              if(this.EXPSN_ATTR[i].V_MODEL.length === 0){
                this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                return;
              }
            }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'DAT'){ //날짜형
              if(!this.EXPSN_ATTR[i].V_MODEL_DATE){
                this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                return;
              }
            }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'HASH'){ //해시태그
              let sHashTxt = '';
              let iCnt = 0;
              let iChkCnt = 0;
              for(let k in this.EXPSN_ATTR[i].tags){
                if(this.EXPSN_ATTR[i].tags[k]) iCnt++;

                if(this.EXPSN_ATTR[i].tags[k].text){
                  sHashTxt += (iChkCnt>0?',':'') + this.EXPSN_ATTR[i].tags[k].text;
                  iChkCnt++;
                }
              }
              if(iCnt === 0){
                this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                return;
              }else{
                if(sHashTxt.length > this.EXPSN_ATTR[i].DATA_LEN){
                  this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 0 ~ '+this.EXPSN_ATTR[i].DATA_LEN+'byte 이내로 입력해 주세요.', iconClass: 'is-caution', type: 'default'});
                  return;
                }
              }
            }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'POST'){ //우편번호
              if(!this.EXPSN_ATTR[i].V_MODEL){
                this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                return;
              }
              if(!this.EXPSN_ATTR[i].V_MODEL_DTL[1]){
                this.showAlert({alertDialogToggle: true, msg: this.EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목의 상세 주소는 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                return;
              }
            }
          }
        }

        this.custDataDiffSetting(); //변경항목 조회

        if(this.addable){//신규 고객 등록 인 경우
          this.custTelNoCheck(); //고객 전화번호 체크
        }else{
          //전화번호를 지웠을 때
          if(this.NOW_PHN_NO != '' && this.custInfoProp.CUST_PHN_NO.replace(/[^0-9]/g, "") == ''){
            //전화번호 삭제 불가
            this.showAlert(this.MESSAGE.ALERT.NO_PHN_NO);
            return;
          }
          //전화번호가 비어있지 않을 때 (전화번호 입력)
          if(this.custInfoProp.CUST_PHN_NO.replace(/[^0-9]/g, "") != ''){
            //전화번호가 변경되었을 때
            if(this.NOW_PHN_NO != this.custInfoProp.CUST_PHN_NO.replace(/[^0-9]/g, "")){
              this.custTelNoCheck(); //고객 전화번호 체크 (변경한 전화번호가 이미 있는지)
            } else {
              this.custSave(); //고객정보 수정
            }
          } else {
            if(this.NOW_PHN_NO == ''){
              this.custSave();
            }
          }
        }
      },

      //고객 전화번호 체크
      // async custTelNoCheck() {
      custTelNoCheck() {

        let sUrl = '/api/setting/customer/custTelNoCheck';
        let postParam = {
          CUST_PHN_NO : this.custInfoProp.CUST_PHN_NO.replace(/[^0-9]/g, "")
        }

        let headParam = {
          head : {
          }
        }

        // let response = await this.common_postCall(sUrl, postParam, headParam);

        this.$api
          .post(sUrl, postParam, headParam)
          .then((response) => {
            //신규 등록일 때
            if(this.addable){
              //고객 전화번호가 없는 경우
              if(response.data.DATA[0].CUST_PHN_NO_EXIST_YN === 'N'){ //등록처리
                this.custSave(); //고객 정보 등록
              }else{
                this.EXISTS_CUST_ID = Number(response.data.DATA[0].CUST_ID.split(',')[0]);
                this.showAlert(this.MESSAGE.CONFIRM.DUPL_CUST);
              }
            } else {
              //전화번호 중복 없는 경우
              if(response.data.DATA[0].CUST_PHN_NO_EXIST_YN === 'N'){
                this.custSave();
              } else {
                //전화번호 중복
                this.ORG_CUST_ID = Number(response.data.DATA[0].CUST_ID.split(',')[0]);
                this.chtCustDuplChk();
              }
            }
          })
          .catch((err) => {
            this.showAlert(this.MESSAGE.ERROR.ERROR);
          })

        // if (!response.HEADER.ERROR_FLAG){
        //   //신규 등록일 때
        //   if(this.addable){
        //     //고객 전화번호가 없는 경우
        //     if(response.DATA[0].CUST_PHN_NO_EXIST_YN === 'N'){ //등록처리
        //       this.custSave(); //고객 정보 등록
        //     }else{
        //       this.EXISTS_CUST_ID = Number(response.DATA[0].CUST_ID.split(',')[0]);
        //       this.showAlert(this.MESSAGE.CONFIRM.DUPL_CUST);
        //     }
        //   } else {
        //     //전화번호 중복 없는 경우
        //     if(response.DATA[0].CUST_PHN_NO_EXIST_YN === 'N'){
        //       this.custSave();
        //     } else {
        //       //전화번호 중복
        //       this.ORG_CUST_ID = Number(response.DATA[0].CUST_ID.split(',')[0]);
        //       this.showAlert(this.MESSAGE.CONFIRM.DUPL_CUST_MERGE);
        //     }
        //   }
        // }
      },

      //고객 정보 등록 수정
      async custSave(cust) {
        let sUrl = '/api/setting/customer/custProc';
        let postParam = {
          CHNL : this.custInfoProp.CHNL
          // , CUST_ID : this.CUST_ID
          , CUST_PHN_NO : this.custInfoProp.CUST_PHN_NO.replace(/[^0-9]/g, "")
          , CUST_NM : this.custInfoProp.CUST_NM
          , PRVC_CN: this.saveCustDataDiff.join(",")
        }
        if(this.custInfoProp.CHNL === 'SNS') {
          postParam["CUST_ID"] = this.CUST_ID
        }

        for(let i in this.EXPSN_ATTR){
          if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'TXT'){ //문자형
            postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL;
            this.EXPSN_ATTR[i].V_POST_PARAM = this.EXPSN_ATTR[i].V_MODEL;
          }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'NUM' || this.EXPSN_ATTR[i].DATA_TYPE_CD === 'NUM_COMMA'){ //숫자형
            postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL;
            this.EXPSN_ATTR[i].V_POST_PARAM = this.EXPSN_ATTR[i].V_MODEL;
          }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'COE'){ //단일 선택형
            if(Array.isArray(this.EXPSN_ATTR[i].V_MODEL)){
              let lastVal = '';
              for(let k in this.EXPSN_ATTR[i].V_MODEL){
                if(this.EXPSN_ATTR[i].V_MODEL[k]) lastVal = this.EXPSN_ATTR[i].V_MODEL[k];
              }
              postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = lastVal;
              this.EXPSN_ATTR[i].V_POST_PARAM = lastVal;
            }else{
              postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL;
              this.EXPSN_ATTR[i].V_POST_PARAM = this.EXPSN_ATTR[i].V_MODEL;
            }
          }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'COE_MULTI'){ //다중 선택형
            let multiData = '';
            this.EXPSN_ATTR[i].V_MODEL.forEach((multi, idx) => {
              multiData += (multiData?',':'') + multi.value;
            });

            this.EXPSN_ATTR[i].V_POST_PARAM = multiData;
          }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'DAT'){ //날짜형
            postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].dateTimeDate.replace(/-/gi, '') + this.EXPSN_ATTR[i].selectedTime.replace(/:/gi, '')+'00';
            this.EXPSN_ATTR[i].V_POST_PARAM = this.EXPSN_ATTR[i].dateTimeDate.replace(/-/gi, '') + this.EXPSN_ATTR[i].selectedTime.replace(/:/gi, '')+'00';
            // postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID+'_DATE'] = this.EXPSN_ATTR[i].V_MODEL_DATE;
          }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'HASH'){ //해시태그
            let sHashTxt = '';
            let iCnt = 0;
            for(let k in this.EXPSN_ATTR[i].tags){
              if(this.EXPSN_ATTR[i].tags[k].text){
                if(this.EXPSN_ATTR[i].tags[k].active){
                  sHashTxt += (iCnt>0?',':'') + this.EXPSN_ATTR[i].tags[k].text;
                  iCnt++;
                }
              }
            }
            postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = sHashTxt;
            this.EXPSN_ATTR[i].V_POST_PARAM = sHashTxt;
          }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'POST'){ //우편번호
            postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL + '|' + (this.EXPSN_ATTR[i].V_MODEL_DTL[0]?this.EXPSN_ATTR[i].V_MODEL_DTL[0]:'') + '|' + (this.EXPSN_ATTR[i].V_MODEL_DTL[1]?this.EXPSN_ATTR[i].V_MODEL_DTL[1]:'');
            this.EXPSN_ATTR[i].V_POST_PARAM = this.EXPSN_ATTR[i].V_MODEL + '|' + (this.EXPSN_ATTR[i].V_MODEL_DTL[0]?this.EXPSN_ATTR[i].V_MODEL_DTL[0]:'') + '|' + (this.EXPSN_ATTR[i].V_MODEL_DTL[1]?this.EXPSN_ATTR[i].V_MODEL_DTL[1]:'');
          }
        }

        let headParam = {
          head : {
          }
        }

        postParam.EXPSN_ATTR = JSON.stringify(this.EXPSN_ATTR);
        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          this.editable = false; //저장 성공시 처리
          this.NOW_PHN_NO = response.DATA[0].CUST_PHN_NO.replace(/[^0-9]/g, "");
          if(!this.dialogDuplCust){
            //고객 통합완료 메시지 보여줘야함 일반 저장시에는 저장 완료 메시지
            // this.showAlert(this.MESSAGE.ALERT.SUCCESS);
            this.showToast(this.MESSAGE.TOAST.SUCCESS);
            this.closeMsg();
          }
          if(this.addable){
            eventBus.busRingingCustInfoSrch("busRingingCustInfoSrch", {CUST_ID : Number(response.DATA[0].CUST_ID), CUST_PHN_NO: response.DATA[0].CUST_PHN_NO.replace(/[^0-9]/g, ""), ADD_CUST : false});
          }else{
            await this.getCustInfo(response.DATA[0]);
          }
        }

        this.$store.commit("statusStore/MU_CUST_MODIFY_ING", false); //상담 메인 고객 수정 진행중 여부를 false로 store 저장 처리
      },

      //고객 정보 셋팅
      async custInfoSet() {
        // this.CUST_ID = this.EXISTS_CUST_ID;
        eventBus.busRingingCustInfoSrch("busRingingCustInfoSrch", {CUST_ID : this.EXISTS_CUST_ID, CUST_PHN_NO: this.custInfoProp.CUST_PHN_NO.replace(/[^0-9]/g, ""), ADD_CUST : false});
        this.closeMsg();
      },

      //고객 동의 이력 처리
      async custAgreChange(val, AGRE_SE_CD, CUST_AGRE_HSTRY_ID) {
        let sUrl = '/api/setting/customer/custAgreHstryProc';
        let postParam = {
          CUST_ID : this.CUST_ID
          , CUST_AGRE_HSTRY_ID : CUST_AGRE_HSTRY_ID
          , AGRE_SE_CD : AGRE_SE_CD
          , AGRE_YN : (val?'Y':'N')
        }

        let headParam = {
          head : {
          }
        }

        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          await this.getCustInfo(postParam);
        }

      },

      //주의 고객 등록 dialog 함수 호출
      cautionCustProc() {
        this.$refs.catuionCustDialog.cautionCustValidate();
      },

      //주의 고객 dialog에서 데이터 받아오기
      getCustDefaultInfo(data) {
        this.custInfoProp.CAUTION_CUST_YN = data.CAUTION_CUST_YN;
        this.mixin_hideDialog('AlertManage');
      },

      //개인정보처리 변경이력 관련
      custDataDiffSetting() {
        if(this.saveBeforeCustSelectData.length > 0){
          if( this.saveBeforeCustSelectData[0].CUST_NM !== this.custInfoProp.CUST_NM ) this.saveCustDataDiff.push("이름");
          if( this.saveBeforeCustSelectData[0].CUST_PHN_NO !== this.custInfoProp.CUST_PHN_NO ) this.saveCustDataDiff.push("전화번호");
          for (let i in this.EXPSN_ATTR) {
            if( this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID == 'CUST_COM_POST' || this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID == 'CUST_HOME_POST' ) { //우편번호의 경우
              if(this.EXPSN_ATTR[i].ATTR_VL !== (this.EXPSN_ATTR[i].V_MODEL + "|" + this.EXPSN_ATTR[i].V_MODEL_DTL[0] + "|" + this.EXPSN_ATTR[i].V_MODEL_DTL[1] )) {
                this.saveCustDataDiff.push( this.EXPSN_ATTR[i].EXPSN_ATTR_NM );
              }
            }else {
              if (this.EXPSN_ATTR[i].ATTR_VL !== this.EXPSN_ATTR[i].V_MODEL) this.saveCustDataDiff.push(this.EXPSN_ATTR[i].EXPSN_ATTR_NM);
            }
          }
        }
      },

      //선택한 통합고객
      selMergeCust(cust){
        this.STYLE_SELECTED_BOX = cust;

        if(cust == 0){
          this.MERGE_CUST = 'ORG'
        } else {
          this.MERGE_CUST = 'NEW'
        }
      },

      //고객통합 기준 선택창
      async setDuplCust(){
        this.closeMsg();
        this.mixin_showDialog('DuplCust');
        let data = {CUST_ID : this.ORG_CUST_ID};
        await this.getCustInfo(data, 'ORG');
      },

      //기존고객으로 통합
      mergeCustOrg(){
        this.mergeCust({
          BF_CUST_ID: this.custInfoProp.CUST_ID,
          AF_CUST_ID: this.ORG_CUST_ID,
        });
      },
      //신규고객으로 통합
      mergeCustNew(){
        this.mergeCust({
          BF_CUST_ID: this.ORG_CUST_ID,
          AF_CUST_ID: this.custInfoProp.CUST_ID,
        });
      },
      //통합 시작
      async mergeCust(custInfo){
        //입력한 고객 정보 저장
        await this.custSave('merge');

        let sUrl = '/api/setting/customer/mergeCust';
        let postParam = {
          BF_CUST_ID: custInfo.BF_CUST_ID,
          AF_CUST_ID: custInfo.AF_CUST_ID,
        }
        let headParam = {
          head : {
          }
        }
        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          this.mixin_hideDialog('DuplCust');
          await this.getCustInfo({CUST_ID: response.HEADER.CUST_ID});
          // this.showAlert(this.MESSAGE.ALERT.MERGE_SUCCESS);
          this.showToast(this.MESSAGE.TOAST.MERGE_SUCCESS);
          this.closeMsg();

          //sns상담 탭이 열려있을때 (sns상담탭에서 고객정보를 통합했을 때)
          if(this.$store.getters['commonStore/GE_COMMON_ACTIVE_TAB'].id == 'CSL_M0200'){
            this.$eventBus.$emit("chtListSrch");
            this.$eventBus.$emit("chtCustMerge", response.HEADER.CUST_ID);
          }
        }
      },

      //고객 전화번호 복사
      copyCustPhnNo(){
        navigator.clipboard.writeText(this.custInfoProp.CUST_PHN_NO.replace(/[^0-9]/g, "").trim());

        this.showToast({msg: '전화번호가 복사 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle'});
      },

      //채팅고객 중복 체크
      //동일전화번호가 존재하고 채팅채널(sndr_key)와 채팅고객key가 같으면 통합 불가 
      async chtCustDuplChk(){
        let sUrl = '/api/setting/customer/chtCustDuplChk';
        let postParam = {
          ORG_CUST_ID : this.ORG_CUST_ID
          , CUST_ID : this.custInfoProp.CUST_ID
        }

        let headParam = {
          head : {
          }
        }

        let resData = await this.common_postCall(sUrl, postParam, headParam);
        
        if (!resData.HEADER.ERROR_FLAG){
          let rsltLeng = resData.DATA.length;
          let mergeNpsbl = false;
          for(let i=0;i<rsltLeng;i++){
            if(parseInt(resData.DATA[i].CNT) > 1){
              //같은 채팅채널 내에 이미 고객이 있음 - 같은 고객일 수 없음 - 통합 시 문제생김 - 통합 불가
              mergeNpsbl = true;
              break;
            }
          }
          if(mergeNpsbl){
            this.showAlert(this.MESSAGE.ALERT.MERGE_NPSBL);
          } else {
            this.showAlert(this.MESSAGE.CONFIRM.DUPL_CUST_MERGE);
          }
        }
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>