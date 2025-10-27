<template>
<div
    class="pl-container pl-cols type-mainphone"
    :style="`grid-template-columns: ${ cusArea_resizeClass === true ? first_drag +'fr 75fr' : first_drag+'fr 39fr 38fr'}`">
    <div
      class="pl-mainchat-csinfo is-col-fix"
      :class="cus_key_resizeClass ? 'expand' : ''"
      style="position: relative"
      >
      <!-- 고객정보 -->
      <mainchat-cus-info
        ref="MainchatCusInfo"
        :CHNL="CUST_INFO.CHNL"
        :CUST_ID="CUST_INFO.CUST_ID"
        :custInfoProp="CUST_INFO"
        :CTI_STAT="CTI_STAT"
        :CALL_ING="CALL_ING"
        @call="callDialog"
        @sms="showSmsSlide"
        @email="callSendEmailDialog"
        @chat="showChatSlide"
        @topDetail="mixin_testLog('topDetail')"
        class="pl-mainchat-csinfo-cus pl-card-wrap"
        style="height: 495px;" />
       <!-- 마이 데스크 -->
      <mainphone-mydesk
        ref="mydesk"
        :ResizeProp=cus_key_resizeClass
        class="pl-mainphone-mydesk pl-mainphone-key-info pl-card-wrap"
        @toggle="toggleResize()"
      />
      <!-- <div class="vertical-bar"></div> -->

    </div>
    <!-- 상담 form -->
    <div
      class="pl-mainchat-form pl-card-wrap is-vrt "
      :class="stt_switch ? 'expand' : ''"
      >
      <div class="pl-card-top" style="flex-wrap: wrap;" :class="mixin_getCustcoSetting('ENV_TMPL_TP') !== 'DEFAULT' ? 'pb-0' : ''">
        <div>
          <strong class="pl-card-top-title">
            {{ (mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(CUST_INFO.CUST_NM) : CUST_INFO.CUST_NM) + (CUST_INFO.CUST_ID && CUST_INFO.CUST_ID > -1 ? '님과의 전화상담':'') }}
          </strong>
          <div>
            <strong :class="`is-txt-${ CHAT_TOP_INFO.status }`">{{ displayStatus(CHAT_TOP_INFO.status) }}</strong>
            <span v-if="CUTT_BGNG_DT != ''" class="pl-card-top-var">요청일시 ({{ this.mixin_convertDate(CUTT_BGNG_DT, 'yyyy-MM-dd HH:mm:ss') }})</span>
          </div>
        </div>
        <div class="pl-btn-wrap ml-auto align-self-start">
          <!-- 강제 생성 -->
          <compo-tooltip-btn
            v-if="CUST_INFO.CUST_ID != undefined && CUST_INFO.CUST_ID > -1 && !this.CALL_ING"
            TitleProp="강제 생성"
            ClassProp="pl-tooltip-btn is-blue"
            IconProp="pl-icon20 add-chat"
            TooltipPositionProp="bottom"
            :DisabledProp="REC_FILE_NM?true:false"
            @btnClick="(CTI_STAT === false || CUSL_STAT === '후처리')?forcCuttCreateFrom(true):showAlert(MESSAGE.ALERT.FORCE_CUTT_REG_CONDITION)"
          ></compo-tooltip-btn>
          <!-- 영상통화  -->
          <compo-tooltip-btn
            v-if="mixin_getCustcoSrvcStat('VIDEO') && CUST_INFO.CUST_ID != undefined && CUST_INFO.CUST_ID > -1"
            :DisabledProp="CUST_INFO.CUST_ID != undefined && CUST_INFO.CUST_ID > -1?false:true"
            TitleProp="영상통화"
            ClassProp="pl-tooltip-btn is-blue"
            IconProp="pl-icon20 main-video"
            TooltipPositionProp="bottom"
            @btnClick="FnDemoVideoMode('')"
          ></compo-tooltip-btn>
          <!-- VOC -->
          <compo-tooltip-btn
            :DisabledProp="CUST_INFO.CUST_ID != undefined && CUST_INFO.CUST_ID > -1?false:true"
            TitleProp="VOC"
            ClassProp="pl-tooltip-btn is-blue"
            IconProp="pl-icon20 main-talk"
            TooltipPositionProp="bottom"
            CHNL="TEL"
            @btnClick="mixin_showDialog('Voc')"
          ></compo-tooltip-btn>
          <!-- VOC dialog -->
          <v-dialog
            v-model="dialogVoc"
            content-class="dialog-draggable is-lg is-nopadding"
            hide-overlay>
            <div class="draggable-area">drag area</div>
            <compo-dialog
              header-title="VOC 접수"
              @hide="mixin_hideDialog('Voc')"
            >
              <template slot="body">
                <!-- component -->
                <compo-voc
                  ref="vocDataCompo"
                  :CHNL="CHNL"
                  :CUST_ID="CUST_INFO.CUST_ID"
                  :VOC_RCPT_ID=-1
                  :TARGET_CUST_NM="CUST_INFO.CUST_NM"
                />
              </template>
              <template slot="footer">
                <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('Voc')">닫기</v-btn>
                <v-btn class="pl-btn" @click="saveVocData">저장</v-btn>
              </template>
            </compo-dialog>
          </v-dialog>
          <!-- 영상 통화 -->
          <!-- <compo-tooltip-btn
            :DisabledProp="CUST_INFO.CUST_ID != undefined && CUST_INFO.CUST_ID > -1?false:true"
            TitleProp="영상 통화"
            ClassProp="pl-tooltip-btn is-blue"
            IconProp="pl-icon20 main-video"
            TooltipPositionProp="bottom"
            @btnClick="mixin_testLog('영상 통화')"
          ></compo-tooltip-btn> -->
          <!-- 상세 -->
          <div v-if="STT_USE_YN === 'Y'">
            <compo-tooltip-btn
              :DisabledProp="CUST_INFO.CUST_ID != undefined && CUST_INFO.CUST_ID > -1?false:true"
              TitleProp="상세"
              ClassProp="pl-tooltip-btn is-blue"
              IconProp="pl-icon20 main-detail"
              TooltipPositionProp="bottom"
              @btnClick="dropMainDetail = !dropMainDetail"
            ></compo-tooltip-btn>
            <v-slide-y-transition>
              <div class="pl-drop-layer is-mainchat-detail" v-if="dropMainDetail === true" v-click-outside="closeDropMainDetail">
                <div class="pl-drop-layer-body">
                  <div class="d-flex align-center">
                    <div class="d-flex align-center">
                      <v-icon class="pl-icon30 mainchat-stt"></v-icon>
                      <strong class="ml-2 is-txt-main">
                        STT 설정
                      </strong>
                    </div>
                    <div class="ml-auto">
                      <v-switch
                        v-model="stt_switch"
                        @change="sttStatChange($event)"
                      >
                        <template v-slot:label>
                          <span class="pl-label">{{ stt_switch ? 'ON' : 'OFF' }}</span>
                        </template>
                      </v-switch>
                    </div>
                  </div>
                  <p class="mt-2 is-txt-sub">음성의 실시간 텍스트 변환을 중지 하거나 활성화 합니다. </p>
                </div>
              </div>
            </v-slide-y-transition>
          </div>
          <!-- 데모 리사이즈 토글 -->
          <compo-tooltip-btn
            v-if="isDevelopment"
            :TitleProp=computedResizeTextCs
            ClassProp="pl-tooltip-btn"
            :IconProp=computedResizeClassCs
            TooltipPositionProp="bottom"
            @btnClick="toggleResizeCs()"
          ></compo-tooltip-btn>

        </div>
        <!-- tab  -->
        <div v-if="mixin_getCustcoSetting('ENV_TMPL_TP') === 'ETC'" style="flex: 1 0 100%; margin: 12px 0 -1px -20px;">
          <v-tabs class="pl-tabs" v-model="tab_phone_cs" >
            <v-tab>상담내용</v-tab>
            <v-tab>종합복지마스터조회<span class="pl-tab-badge">7</span></v-tab>
          </v-tabs>
        </div>
      </div>
      <!-- 영상통화 iframe-->
      <div v-if="demoVideoMode" style="height: calc(100vh - 280px)">
        <iframe ref="child" id="child" :src="iframeUrl" allow="camera *;microphone *" width="100%" height="100%" frameborder="0"></iframe>
      </div>
      <!-- tab contents -->
      <v-tabs-items
        v-model="tab_phone_cs"
        class="pl-tabs-items"
        :style="mixin_getCustcoSetting('ENV_TMPL_TP') === 'DEFAULT' ? !demoVideoMode ?  'height: calc(100vh - 209px);' : 'height: 71px;' : 'height: calc(100vh - 246px)'">
        <v-tab-item>
          <!-- 상담내용 -->
          <!-- stt component -->
          <div class="pl-card is-noborder" v-if="stt_switch">
            <mainphone-stt
              :DataProp="STT_LOG"
            />
          </div>
          <v-slide-y-reverse-transition>
            <div :class="stt_switch ? 'pl-drop-layer is-mainchat-slide': ''" style="z-index: 1;">
              <div class="text-center">
                <!-- 상세 버튼 -->
                <compo-tooltip-btn
                  v-if="stt_switch"
                  TitleProp="상세"
                  ClassProp="pl-tooltip-btn"
                  :IconProp=toggeleExpandClass()
                  TooltipPositionProp="bottom"
                  @btnClick="toggeleExpand"
                ></compo-tooltip-btn>
              </div>
              <!-- 상담 form -->
              <v-form ref="form" v-if="!demoVideoMode">
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

              <div v-if="!stt_slide || !stt_switch"
                class="pl-card is-noborder"
                style="overflow-y: auto;"
                :style="computedCsHeight">
                <div class="pl-form-inline-wrap vertical is-noborder">
                  <!--상담 강제 생성 (상담시간)-->
                  <div class="pl-form-inline" v-if="CUST_INFO.CUST_ID != undefined && CUST_INFO.CUST_ID > -1 && forcCuttAble">
                    <span class="pl-label">
                      상담 시간
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <template v-if="REC_FILE_NM?false:true"><!-- 콜 이력에서 녹취 파일을 선택하지 않은 경우 -->
                        <compo-date-picker
                        v-model="FORCE_CUTT_BGNG_DT"
                        style="width:187px"
                        DateType="dateTime"
                        :DateProp.sync="FORCE_CUTT_BGNG_DT"
                        :TimesProp.sync="FORCE_CUTT_BGNG_TIME"
                      />
                      <span class="pl-unit">~</span>
                      <compo-date-picker
                        v-model="FORCE_CUTT_END_DT"
                        style="width:187px"
                        DateType="dateTime"
                        :DateProp.sync="FORCE_CUTT_END_DT"
                        :TimesProp.sync="FORCE_CUTT_END_TIME"
                      />
                      </template>
                      <template v-else><!-- 콜 이력에서 녹취 파일을 선택한 경우 -->
                        {{ FORCE_CUTT_BGNG_DT + ' ' +  FORCE_CUTT_BGNG_TIME + ' ~ ' + FORCE_CUTT_END_DT + ' ' +  FORCE_CUTT_END_TIME }}
                      </template>
                    </div>
                  </div>
                  <!--상담 강제 생성 (녹취파일)-->
                  <div class="pl-form-inline" v-if="CUST_INFO.CUST_ID != undefined && CUST_INFO.CUST_ID > -1 && forcCuttAble">
                    <span class="pl-label">
                      녹취 파일
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        v-model="REC_FILE_NM"
                        class="pl-form flex-grow-1"
                        placeholder="우측의 찾기 아이콘을 클릭 하십시오"
                        v-byte-counter="300"
                        disabled
                      ></v-text-field>
                      <!-- 찾기 버튼 -->
                      <compo-tooltip-btn
                        TitleProp="고객과 응대한 콜 이력을 찾기하여 선택하십시오."
                        ClassProp="pl-tooltip-btn flex-grow-0"
                        IconProp="pl-icon20 in-search"
                        TooltipPositionProp="bottom"
                        @btnClick="ipccCallHistSearch()"
                      ></compo-tooltip-btn>
                    </div>
                  </div>
                  <!--상담 채널은 고정으로 최 상단에 항상 위치함-->
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      상담 채널
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-select
                        class="pl-form"
                        v-model="CL_TYPE_CD"
                        :items="mixin_common_code_get(common_code, 'CALL_TP')"
                        :disabled="!forcCuttAble || REC_FILE_NM?true:false"
                        placeholder="선택하세요"
                      ></v-select>
                      <v-select
                        class="pl-form"
                        v-model="CHNL"
                        :items="mixin_common_code_get(this.common_code, 'CHNL')"
                        disabled
                        placeholder="선택하세요"
                      ></v-select>
                      <v-select
                        class="pl-form is-sm"
                        v-model="CHN_TYPE_DTL_CD"
                        :items="mixin_common_code_get(this.common_code, 'CHNL_CL')"
                        disabled
                        placeholder="선택하세요"
                      ></v-select>
                    </div>
                  </div>
                  <!-- 확장 속성 영역-->
                  <template v-for="(expsnAttr, seq) in EXPSN_ATTR">
                    <template v-if="expsnAttr.DATA_TYPE_CD === 'COE' && expsnAttr.EXPSN_ATTR_COL_ID === 'CUSL_TP_CL'">
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          상담 유형 검색
                        </span>
                        <div class="pl-desc">
                          <v-autocomplete
                            v-model="cuttTypeIntgeSchVal"
                            class="pl-form flex-grow-1"
                            :items="flattenedMenu"
                            v-on:change="changeCuttTypeSch(seq)"
                            placeholder="상담 유형을 검색하세요"
                            clearable
                            no-data-text="결과 없음"
                          />
                          <div class="flex-grow-0">
                            <v-icon class="pl-icon20 contentList" @click="dropCsTemplate = !dropCsTemplate"></v-icon>
                            <v-slide-y-transition>
                              <div
                                class="pl-drop-layer"
                                style="width: 420px;
                                        transform: translate(-430px, -70px);
                                        transform-origin: center top 0px;
                                        border-radius: 12px;
                                        background: #FFF;
                                        box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.05);
                                        padding: 0;"
                                v-if="dropCsTemplate === true"
                                v-click-outside="closeDropCsTemplate">
                                <div class="pl-cols" style="height: 255px">
                                  <!-- 최근 사용된 템플릿 -->
                                  <div class="pl-div-vertical">
                                    <div class="pl-drop-layer-body pa-0" style="height: 100%">
                                      <template v-if="recentCuttType.length === 0">
                                        <div class="pl-list-nodata type-smile">
                                          <span>최근 상담유형이 없습니다.</span>
                                        </div>
                                      </template>
                                      <template v-else>
                                        <div class="pl-tags-wrap type03">
                                          <v-chip-group
                                            active-class="active-tag"
                                            column
                                          >
                                          <template v-for="item, index in recentCuttType" >
                                            <v-chip
                                              v-show="item.active"
                                              :key="index"
                                              @click:close="cuslCuttTypeBmkProc(item, 'DEL')"
                                              @click="setCuttTypeBmkData(item, 'RECENT_REG')"
                                            >
                                              {{ item.label }}
                                            </v-chip>
                                          </template>
                                          </v-chip-group>
                                        </div>
                                      </template>
                                    </div>
                                  </div>
                                  <!-- 즐겨찾기 템플릿 -->
                                  <div>
                                    <div class="pl-drop-layer-body pa-0" style="height: 100%">
                                      <template v-if="bmkCuttType.length === 0">
                                        <div class="pl-list-nodata type-smile">
                                          <span>즐겨찾기한 유형이 없습니다</span>
                                        </div>
                                      </template>
                                      <template v-else>
                                        <div class="pl-tags-wrap type02">
                                          <v-chip-group
                                            active-class="active-tag"
                                            column
                                          >
                                          <template v-for="item, index in bmkCuttType" >
                                            <v-chip
                                              v-show="item.active"
                                              :key="index"
                                              close
                                              @click:close="cuslCuttTypeBmkProc(item, 'DEL')"
                                              @click="setCuttTypeBmkData(item, 'CUSL_REG')"
                                            >
                                              {{ item.label }}
                                            </v-chip>
                                          </template>
                                          </v-chip-group>
                                        </div>
                                      </template>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </v-slide-y-transition>
                          </div>
                        </div>
                      </div>
                    </template>
                    <div class="pl-form-inline">
                      <!--확장 속성 명-->
                      <span class="pl-label">
                        {{expsnAttr.EXPSN_ATTR_NM}}
                        <v-icon v-show="expsnAttr.ESNTL_YN === 'Y'" class="pl-icon20 required"></v-icon> <!-- 필수 입력인 경우  -->
                        <div v-if="expsnAttr.MSG_USE_YN === 'Y'">
                          <compo-tooltip-btn
                            :TitleProp="expsnAttr.MSG_CN"
                            ClassProp="pl-tooltip-btn"
                            IconProp="pl-icon20 question"
                            TooltipPositionProp="bottom"
                          />
                        </div>
                      </span>
                      <!-- 단일 선택형이고 상담 유형이 아닌 경우 -->
                      <div class='pl-desc' v-if="expsnAttr.DATA_TYPE_CD === 'COE' && expsnAttr.EXPSN_ATTR_COL_ID != 'CUSL_TP_CL'">
                        <v-autocomplete
                          v-model="expsnAttr.V_MODEL"
                          class="pl-form"
                          :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                          :items="mixin_common_code_get(common_code, expsnAttr.GROUP_CD_ID)"
                          :disabled="expsnAttr.GROUP_CD_ID == 'CUSL_RS' && CPI_CNT"
                          placeholder="선택하세요"
                          value=""
                          no-data-text="결과 없음"
                        />
                      </div>
                      <!-- 단일 선택형이고 상담 유형인 경우 -->
                      <div class='pl-desc' v-else-if="expsnAttr.DATA_TYPE_CD === 'COE' && expsnAttr.EXPSN_ATTR_COL_ID === 'CUSL_TP_CL'">
                        <div class="d-flex flex-grow-1 flex-column" style="gap: 10px">
                          <v-autocomplete v-for="(cuttType, idx) in expsnAttr.V_MODEL" :key="idx"
                            v-model="expsnAttr.V_MODEL[idx]"
                            class="pl-form"
                            style="flex: 0; width: 100%; "
                            :ref="`${expsnAttr.EXPSN_ATTR_COL_ID}_${idx}`"
                            :items="getChildCuttTypeItems(seq, idx, idx===0?'':expsnAttr.V_MODEL[idx-1])"
                            item-text = "CUTT_TYPE_NM"
                            item-value = "CUTT_TYPE_ID"
                            placeholder="선택하세요"
                            v-on:change="changeCuttTypeItems(seq, idx)"
                            no-data-text="결과 없음"
                          />
                        </div>
                        <div class="flex-grow-0 align-self-start">
                          <div
                            @click="ToggleCsTemplate"
                            style="position: relative; cursor: pointer; width: 20px; height: 20px;">
                            <vLottiePlayer
                              name="lottieFavorite"
                              :autoplay=false
                              width="60px"
                              height="60px"
                              style="position: absolute; top: -15px; left: -20px; pointer-events: none;"
                              :animationData="require('@/assets/lottie/animation_favorite.json')"
                              @animControl="anim => (lottieFavorite = anim)"
                            />
                          </div>
                        </div>
                      </div>
                      <!-- 다중 선택인 경우 -->
                      <div class="pl-desc" style="width:404px;" v-else-if="expsnAttr.DATA_TYPE_CD === 'COE_MULTI'">
                        <v-autocomplete
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
                      </div>
                      <!-- 문자형이고 데이터 길이가 200보다 작거나 같은 경우 -->
                      <div class="pl-desc" v-else-if="expsnAttr.DATA_TYPE_CD === 'TXT' && expsnAttr.DATA_LEN <= 200">
                        <v-text-field
                          v-model="expsnAttr.V_MODEL"
                          class="pl-form"
                          :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                          :maxlength="expsnAttr.DATA_LEN"
                          placeholder=""
                          value=""
                          v-byte-counter="expsnAttr.DATA_LEN"
                        />
                      </div>
                      <!-- 문자형이고 데이터 길이가 200보다 큰 경우 -->
                      <div class="pl-desc" v-else-if="expsnAttr.DATA_TYPE_CD === 'TXT' && expsnAttr.DATA_LEN > 200">
                        <v-textarea
                          v-model="expsnAttr.V_MODEL"
                          class="pl-form is-noresize"
                          :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                          :maxlength="expsnAttr.DATA_LEN"
                          :spellcheck="false"
                          v-byte-counter="expsnAttr.DATA_LEN"
                        />
                      </div>
                      <!-- 숫자형인 경우 -->
                      <div class="pl-desc" v-else-if="expsnAttr.DATA_TYPE_CD === 'NUM'">
                        <v-text-field
                          v-model="expsnAttr.V_MODEL"
                          class="pl-form"
                          :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                          :maxlength="expsnAttr.DATA_LEN"
                          hide-spin-buttons
                          type="number"
                          oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                          placeholder="숫자만 입력 가능 합니다."
                          value=""
                          v-byte-counter="expsnAttr.DATA_LEN"
                        />
                      </div>
                      <!-- 숫자형이면서 comma가 포함인 경우 -->
                      <div class="pl-desc" v-else-if="expsnAttr.DATA_TYPE_CD === 'NUM_COMMA'">
                        <v-text-field
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
                      </div>
                      <!-- 우편번호인 경우 -->
                      <div class='pl-desc' v-else-if="expsnAttr.DATA_TYPE_CD === 'POST'">
                        <v-text-field
                          v-model="expsnAttr.V_MODEL"
                          class="pl-form is-search"
                          :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                          :maxlength="expsnAttr.DATA_LEN"
                          disabled
                          style="flex: 0 0 100%;"
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
                          class="pl-form"
                          :ref="`V_MODEL_ADDR_${seq}`"
                          disabled
                          style="flex: 0 0 100%;"
                        />
                        <v-text-field
                          v-model="expsnAttr.V_MODEL_DTL[1]"
                          class="pl-form"
                          :ref="`V_MODEL_DTL_ADDR_${seq}`"
                          style="flex: 0 0 100%;"
                          v-byte-counter="expsnAttr.DATA_LEN"
                        />
                      </div>
                      <!-- 해시태크인 경우 -->
                      <div class="pl-desc" v-else-if="expsnAttr.DATA_TYPE_CD === 'HASH'">
                        <div class="pl-tags-wrap">
                          <v-chip-group
                            active-class="active-tag"
                            column
                          >
                            <template v-for="tag, index in expsnAttr.tags" >
                              <v-chip
                                v-if="tag.active"
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
                                value=""
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
                      </div>
                      <!-- 날짜형인 경우 -->
                      <div class="pl-desc is-reserveCall" v-else-if="expsnAttr.DATA_TYPE_CD === 'DAT'">
                        <v-checkbox
                          v-model="expsnAttr.V_MODEL"
                          :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                          class="pl-check"
                          value=""
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
                          :style="!stt_switch ? { position: 'fixed', top: `${posY}px`, left: `${posX}px` } : {left: '250px'}"
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
                    </div>
                  </template>
                  <div class="pl-form-inline" v-if="mixin_getCustcoSrvcStat('AS_ALTMNT') && CUST_INFO.CUST_ID != undefined && CUST_INFO.CUST_ID > -1">
                    <span class="pl-label">
                      AS 예약 접수 여부
                    </span>
                    <div class="pl-desc">
                      <v-switch v-model="vstUseYn" class="ml-auto">
                      </v-switch>
                    </div>
                  </div>
                  <div class="pl-form-inline" v-if="mixin_getCustcoSrvcStat('TRNSF') && CUST_INFO.CUST_ID != undefined && CUST_INFO.CUST_ID > -1">
                    <span class="pl-label">
                      이관 여부
                    </span>
                    <div class="pl-desc">
                      <v-switch v-model="trnsfUseYn" @click="getTrnsfExpsnAttrList" class="ml-auto">
                      </v-switch>
                    </div>
                  </div>
                  <!-- as 예약 접수 -->
                  <template v-if="mixin_getCustcoSrvcStat('AS_ALTMNT') && CUST_INFO.CUST_ID != undefined && CUST_INFO.CUST_ID > -1 && vstUseYn">
                    <!-- 예약 전용 우편번호인 경우 modal -->
                    <v-dialog
                      v-model="dialogVstRsvtFindPost"
                      content-class="dialog-draggable is-lg"
                      hide-overlay>
                      <div class="draggable-area">drag area</div>
                      <compo-dialog
                        header-title="우편번호 검색"
                        @hide="mixin_hideDialog('VstRsvtFindPost')"
                      >
                        <template slot="body">
                          <!-- component -->
                          <compo-find-post
                            @selected-post="setVstPostAddr"
                          />
                        </template>
                      </compo-dialog>
                    </v-dialog>
                    <template v-for="(vst, idx) in VST_RSVT_LIST">
                      <v-divider></v-divider>
                      <div class="d-flex align-cetgnrer">
                        <h3 class="pl-subtit">AS 예약 접수{{ VST_RSVT_LIST.length > 1 ? ' '+(idx + 1) : '' }}</h3>
                        <compo-tooltip-btn
                          v-if="idx === 0"
                          TitleProp="예약접수 추가"
                          ClassProp="pl-tooltip-btn ml-auto"
                          IconProp="pl-icon20 circle-plus"
                          TooltipPositionProp="bottom"
                          @btnClick="addVstRsvtForm"
                        ></compo-tooltip-btn>
                        <compo-tooltip-btn
                          v-if="idx > 0"
                          TitleProp="예약접수 삭제"
                          ClassProp="pl-tooltip-btn ml-auto"
                          IconProp="pl-icon20 erase"
                          TooltipPositionProp="bottom"
                          @btnClick="delVstRsvtForm(idx)"
                        ></compo-tooltip-btn>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          고객명/관계
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            v-model="vst.CUST_NM"
                            class="pl-form is-lg"
                            placeholder="고객명을 입력하세요."
                          />
                          <v-select
                            class="pl-form"
                            v-model="vst.REL_CD"
                            :items="mixin_common_code_get(common_code, 'REL_TP')"
                            placeholder="선택하세요"
                          ></v-select>
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          전화번호
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            v-model="vst.CUST_TELNO"
                            class="pl-form is-lg"
                            placeholder="전화번호"
                            maxlength="14"
                            hide-spin-buttons
                            type="text"
                            @keyup="setPhoneNo(vst.CUST_TELNO)"
                            oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          서비스 종류
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-select
                            class="pl-form"
                            v-model="vst.SRVC_TYPE_CD"
                            :items="mixin_common_code_get(common_code, 'SRVC_TP')"
                            placeholder="선택하세요"
                          ></v-select>
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          AS 제품
                        </span>
                        <div class="pl-desc">
                          <v-autocomplete
                            v-model="vst.UP_PRDCT_TYPE_ID"
                            class="pl-form is-lg"
                            :items="getChildPrdctTypeItems(idx, 1, '1')"
                            item-text = "PRDCT_NM"
                            item-value = "PRDCT_TYPE_ID"
                            placeholder="선택하세요"
                            v-on:change="changePrdctTypeItems(idx, 1)"
                            no-data-text="결과 없음"
                          />
                          <v-autocomplete
                            v-model="vst.PRDCT_TYPE_ID"
                            class="pl-form is-lg"
                            :items="getChildPrdctTypeItems(idx, 2, vst.UP_PRDCT_TYPE_ID)"
                            item-text = "PRDCT_NM"
                            item-value = "PRDCT_TYPE_ID"
                            placeholder="선택하세요"
                            v-on:change="changePrdctTypeItems(idx, 2)"
                            no-data-text="결과 없음"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          AS 주소
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            v-model="vst.ZIP"
                            class="pl-form is-search is-auto"
                            disabled
                            placeholder="우편번호"
                          >
                            <template v-slot:append>
                              <v-btn
                                @click="[mixin_showDialog('VstRsvtFindPost'), setVstIdx(idx)]"
                                class="pl-btn has-icon-only">
                                <span class="pl-icon20 in-search"></span>
                              </v-btn>
                            </template>
                          </v-text-field>
                          <v-text-field
                            v-model="vst.ADDR"
                            class="pl-form is-auto "
                            disabled
                          />
                          <v-text-field
                            v-model="vst.ADDR_DTL"
                            class="pl-form is-auto "
                            placeholder="상세 주소를 입력하세요."
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          예약 일시
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            v-model="vst.RSVT_BGNG_DT"
                            class="pl-form flex-grow-1"
                            placeholder="예약일시를 선택하세요"
                            disabled
                          />
                          <v-btn
                            :disabled="vst.ZIP && (CUTT_BGNG_DT != '' || FORCE_CUTT_BGNG_DT != '')?false:true"
                            @click="rsvtChoiceForm(idx)"
                            class="pl-btn is-sub flex-grow-0">
                            예약일 선택</v-btn>
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          AS 기사
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            v-model="vst.VSTR_NM"
                            class="pl-form is-lg"
                            disabled
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          문의내용
                        </span>
                        <div class="pl-desc">
                          <v-textarea
                            v-model="vst.DMND_MTTR"
                            class="pl-form is-noresize"
                            :spellcheck="false"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          특이사항
                        </span>
                        <div class="pl-desc">
                          <v-textarea
                            v-model="vst.EXCPTN_MTTR"
                            class="pl-form is-noresize"
                            :spellcheck="false"
                          />
                        </div>
                      </div>
                    </template>
                  </template>
                  <!--이관 확장 속성-->
                  <template v-if="mixin_getCustcoSrvcStat('TRNSF') && CUST_INFO.CUST_ID != undefined && CUST_INFO.CUST_ID > -1 && trnsfUseYn">
                    <v-divider></v-divider>
                    <div class="d-flex align-cetgnrer">
                      <h3 class="pl-subtit">ㆍ이관 내용</h3>
                    </div>
                    <div class="pl-form-inline" v-for="(expsnAttr, seq) in TRNSF_EXPSN_ATTR" :key="expsnAttr.ATTR_ID">
                      <!--확장 속성 명-->
                      <span class="pl-label">
                        {{expsnAttr.EXPSN_ATTR_NM}}
                        <v-icon v-show="expsnAttr.ESNTL_YN === 'Y'" class="pl-icon20 required"></v-icon> <!-- 필수 입력인 경우  -->
                        <div v-if="expsnAttr.MSG_USE_YN === 'Y'">
                          <compo-tooltip-btn
                            :TitleProp="expsnAttr.MSG_CN"
                            ClassProp="pl-tooltip-btn"
                            IconProp="pl-icon20 question"
                            TooltipPositionProp="bottom"
                          />
                        </div>
                      </span>
                      <!-- 단일 선택형이고 상담 유형이 아닌 경우 -->
                      <div class='pl-desc' v-if="expsnAttr.DATA_TYPE_CD === 'COE' && expsnAttr.EXPSN_ATTR_COL_ID != 'CUSL_TP_CL'">
                        <v-autocomplete
                          v-model="expsnAttr.V_MODEL"
                          class="pl-form"
                          :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                          :items="mixin_common_code_get(common_code, expsnAttr.GROUP_CD_ID)"
                          placeholder="선택하세요"
                          value=""
                          no-data-text="결과 없음"
                        />
                      </div>
                      <!-- 단일 선택형이고 상담 유형인 경우 -->
                      <div class='pl-desc' v-else-if="expsnAttr.DATA_TYPE_CD === 'COE' && expsnAttr.EXPSN_ATTR_COL_ID === 'CUSL_TP_CL'">
                        <v-autocomplete v-for="(cuttType, idx) in expsnAttr.V_MODEL" :key="idx"
                          v-model="expsnAttr.V_MODEL[idx]"
                          class="pl-form"
                          :ref="`${expsnAttr.EXPSN_ATTR_COL_ID}_${idx}`"
                          :items="getChildCuttTypeItems(seq, idx, idx===0?'':expsnAttr.V_MODEL[idx-1])"
                          item-text = "CUTT_TYPE_NM"
                          item-value = "CUTT_TYPE_ID"
                          placeholder="선택하세요"
                          style="flex: 0 0 100%;"
                          v-on:change="changeCuttTypeItems(seq, idx)"
                          no-data-text="결과 없음"
                        />
                      </div>
                      <!-- 다중 선택인 경우 -->
                      <div class="pl-desc" style="width:375px" v-else-if="expsnAttr.DATA_TYPE_CD === 'COE_MULTI'">
                        <v-autocomplete
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
                      </div>
                      <!-- 문자형이고 데이터 길이가 200보다 작거나 같은 경우 -->
                      <div class="pl-desc" v-else-if="expsnAttr.DATA_TYPE_CD === 'TXT' && expsnAttr.DATA_LEN <= 200">
                        <v-text-field
                          v-model="expsnAttr.V_MODEL"
                          class="pl-form"
                          :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                          :maxlength="expsnAttr.DATA_LEN"
                          placeholder=""
                          value=""
                          v-byte-counter="expsnAttr.DATA_LEN"
                        />
                      </div>
                      <!-- 문자형이고 데이터 길이가 200보다 큰 경우 -->
                      <div class="pl-desc" v-else-if="expsnAttr.DATA_TYPE_CD === 'TXT' && expsnAttr.DATA_LEN > 200">
                        <v-textarea
                          v-model="expsnAttr.V_MODEL"
                          class="pl-form is-noresize"
                          :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                          :maxlength="expsnAttr.DATA_LEN"
                          :spellcheck="false"
                          v-byte-counter="expsnAttr.DATA_LEN"
                        />
                      </div>
                      <!-- 숫자형인 경우 -->
                      <div class="pl-desc" v-else-if="expsnAttr.DATA_TYPE_CD === 'NUM'">
                        <v-text-field
                          v-model="expsnAttr.V_MODEL"
                          class="pl-form"
                          :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                          :maxlength="expsnAttr.DATA_LEN"
                          hide-spin-buttons
                          type="number"
                          oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                          placeholder="숫자만 입력 가능 합니다."
                          value=""
                          v-byte-counter="expsnAttr.DATA_LEN"
                        />
                      </div>
                      <!-- 숫자형이면서 comma가 포함인 경우 -->
                      <div class="pl-desc" v-else-if="expsnAttr.DATA_TYPE_CD === 'NUM_COMMA'">
                        <v-text-field
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
                      </div>
                      <!-- 우편번호인 경우 -->
                      <div class='pl-desc' v-else-if="expsnAttr.DATA_TYPE_CD === 'POST'">
                        <v-text-field
                          v-model="expsnAttr.V_MODEL"
                          class="pl-form is-search"
                          :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                          :maxlength="expsnAttr.DATA_LEN"
                          disabled
                          style="flex: 0 0 100%;"
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
                          class="pl-form"
                          :ref="`V_MODEL_ADDR_${seq}`"
                          disabled
                          style="flex: 0 0 100%;"
                        />
                        <v-text-field
                          v-model="expsnAttr.V_MODEL_DTL[1]"
                          class="pl-form"
                          :ref="`V_MODEL_DTL_ADDR_${seq}`"
                          style="flex: 0 0 100%;"
                          v-byte-counter="expsnAttr.DATA_LEN"
                        />
                      </div>
                      <!-- 해시태크인 경우 -->
                      <div class="pl-desc" v-else-if="expsnAttr.DATA_TYPE_CD === 'HASH'">
                        <div class="pl-tags-wrap">
                          <v-chip-group
                            active-class="active-tag"
                            column
                          >
                            <template v-for="tag, index in expsnAttr.tags" >
                              <v-chip
                                v-if="tag.active"
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
                                value=""
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
                      </div>
                      <!-- 날짜형인 경우 -->
                      <div class="pl-desc is-reserveCall" v-else-if="expsnAttr.DATA_TYPE_CD === 'DAT'">
                        <v-checkbox
                          v-model="expsnAttr.V_MODEL"
                          :ref="expsnAttr.EXPSN_ATTR_COL_ID"
                          class="pl-check"
                          value=""
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
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        담당자
                        <v-icon class="pl-icon20 required"></v-icon> <!-- 필수 입력인 경우  -->
                      </span>
                      <div class='pl-desc'>
                        <v-autocomplete
                          v-model="TRGT_USER_ID"
                          class="pl-form flex-grow-1"
                          :items="TRNSF_USER_LIST"
                          placeholder="담당자명을 검색하세요"
                          clearable
                          no-data-text="결과 없음"
                        />
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              </v-form>
              <div v-if="!stt_slide || !stt_switch" class="pl-card is-bottom">
                <!-- 초기화 -->
                <compo-tooltip-btn
                  TitleProp="초기화"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 erase"
                  TooltipPositionProp="top"
                  @btnClick="showAlert(MESSAGE.CONFIRM.RESET_CUTT_FORM)"
                ></compo-tooltip-btn>
                <!-- 새로고침 버튼 -->
                <compo-tooltip-btn
                  TitleProp="새로고침"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="top"
                  @btnClick="showAlert(MESSAGE.CONFIRM.REFRESH_CUTT_FORM)"
                ></compo-tooltip-btn>
                <!-- 위치 전송 버튼 -->
                <compo-tooltip-btn
                  :DisabledProp="CUST_INFO.CUST_ID != undefined && CUST_INFO.CUST_ID > -1?false:true"
                  TitleProp="위치 전송"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 place-msg"
                  TooltipPositionProp="top"
                  @btnClick="sendingBtn('place')"
                ></compo-tooltip-btn>
                <!-- 연락처 전송 버튼 -->
                <compo-tooltip-btn
                  :DisabledProp="CUST_INFO.CUST_ID != undefined && CUST_INFO.CUST_ID > -1?false:true"
                  TitleProp="연락처 전송"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 address-msg"
                  TooltipPositionProp="top"
                  @btnClick="sendingBtn('contacts')"
                ></compo-tooltip-btn>
                <div class="is-right">
                  <v-btn v-if="stt_switch"
                    class="pl-btn is-sub"
                    @click="summaryCuttCn()"
                  >요약보기</v-btn>
                  <v-btn
                    :disabled="CUST_INFO.CUST_ID != undefined && CUST_INFO.CUST_ID > -1 && (this.CUTT_END_DT != '' || this.FORCE_CUTT_END_TIME != '')?false:true"
                    class="pl-btn ml-auto"
                    @click="phoneCuttSaveValidate"
                  >저장</v-btn>
                </div>
                <!-- 위치,연락처정보 모달-->
                <v-dialog
                  v-model="dialogPlaceContactsFind"
                  content-class="dialog-draggable"
                  hide-overlay>
                  <div class="draggable-area">drag area</div>
                  <compo-dialog
                    :headerTitle='HEADER_TITLE'
                    @hide="mixin_hideDialog('PlaceContactsFind')"
                  >
                    <template slot="body">
                      <!-- component -->
                      <compo-send-info
                        component-to-re-render :key="COMPONENT_KEY"
                        :DataTypeProp = "DATA_TYPE_PROP"
                        :SearchInputProp.sync="SearchSendInputData"
                        :DataHeaderProp="DATA_TYPE_PROP === 'place' ? HeadersSendPlace : HeadersSendContacts"
                        :DataBodyProp="ItemsSendData"
                        :SelectedRadioProp.sync="SelectedSendType"
                        :selectedDataProp.sync="selectedSendItem"
                        @fidnBtn="mixin_testLog('위치 정보 보내기 버튼')"
                      />

                    </template>
                    <template slot="footer">
                      <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('PlaceContactsFind')">닫기</v-btn>
                      <v-btn class="pl-btn" @click="sendInfoBtn()">보내기</v-btn>
                    </template>
                  </compo-dialog>
                </v-dialog>
              </div>

            </div>
          </v-slide-y-reverse-transition>
        </v-tab-item>
        <v-tab-item v-if="mixin_getCustcoSetting('ENV_TMPL_TP') === 'ETC'">
          <!-- 주문내역 -->
           <mainphone-order

            :DataProp="ORDER_LIST"
          />
          <!-- 시연 용 -->
          <div class="pl-card">
            <div class="pl-search-form">
              <div class="pl-form-inline-wrap">
                <div class="pl-form-inline">
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form"
                      placeholder="증권번호"
                      style="width: 150px"
                    ></v-text-field>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form"
                      value="홍길동"
                    ></v-text-field>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form is-search"
                      placeholder="분회 검색어 입력"
                      style="width: 150px"
                      @keydown.enter="mixin_testLog('search btn')"
                    >
                    <template v-slot:append>
                      <v-btn
                        @click="mixin_testLog('search btn')"
                        class="pl-btn has-icon-only">
                        <span class="pl-icon20 in-search"></span>
                      </v-btn>
                    </template>
                  </v-text-field>
                  </div>
                </div>
              </div>
              <div class="is-right">
                <v-btn class="pl-btn is-icon">
                  <span class="pl-icon20 search"></span>
                  조회
                </v-btn>
              </div>
            </div>
            <v-data-table
              class="pl-grid"
              :headers="headers"
              :items="items"
              fixed-header
              item-key="index"
              height="542px"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              >
              <template v-slot:item.type05="{ item }">
                <span class="is-txt-red">{{ item.type05 }}</span>
              </template>
            </v-data-table>
          </div>
          <div class="pl-card is-bottom">
            <v-btn class="pl-btn">가입설계발행</v-btn>
            <v-btn class="pl-btn">가입신청발행</v-btn>
            <v-btn class="pl-btn">증명서발급</v-btn>
            <v-btn class="pl-btn">수납정보변경</v-btn>
            <v-btn class="pl-btn">가상계좌등록</v-btn>
            <v-btn class="pl-btn">가상계좌조회</v-btn>
          </div>


        </v-tab-item>
      </v-tabs-items>

    </div>
    <!-- 통합 접촉이력 -->
    <div
      v-if="!cusArea_resizeClass"
      class="pl-mainchat-csinfo is-col-fix"
      >
      <mainchat-all-log
        ref="MainchatAllLog"
        :CHNL="CUST_INFO.CHNL"
        :CUST_ID="CUST_INFO.CUST_ID"
        :custInfoProp="CUST_INFO"
        :DataProp="all_log_data"
        class="pl-mainchat-csinfo-history pl-card-wrap"
      />
    </div>
    <!-- dialog -->
    <!-- <v-dialog
      v-model="dialogAssignManager"
      content-class="pl-top-alarm-dialog"
      width="633"
      hide-overlay>
      <compo-dialog
        header-title="A/S 기사 배정"
        :FooterProp="false"
        @hide="mixin_hideDialog('AssignManager')"
      >
        <template slot="body">
          <AssignManagerDialog
            :VST_RSVT_IDX = VST_RSVT_IDX
            :CUST_ID = CUST_INFO.CUST_ID
            :INFO = VST_RSVT_INFO
            @selectedVstData="setVstData"
          />
        </template>
      </compo-dialog>
    </v-dialog> -->


  </div>
</template>

<script>
import MainchatCusInfo from '@/views/page/mainChat/MainchatCusInfo.vue';
import MainchatAllLog from '@/views/page/mainChat/MainchatAllLog.vue';
// import MainphoneKeyInfo from '@/views/page/mainPhone/MainphoneKeyInfo.vue';
import MainphoneMydesk from '@/views/page/mainPhone/MainphoneMydesk.vue';
import MainphoneStt from '@/views/page/mainPhone/MainphoneStt.vue';
import MainphoneOrder from '@/views/page/mainPhone/MainphoneOrder.vue';
// import AssignManagerDialog from '@/views/page/CSL_M0100_ASSIGNMANAGER_DIALOG.vue';

import { mapGetters, mapState } from 'vuex';
import { eventBus } from "@/store/eventBus.js";

  export default {
    name: "MENU_CSL_M0100", //name은 'MENU_' + 파일명 조합
    components: {
      MainchatCusInfo,
      MainchatAllLog,
      MainphoneMydesk,
      MainphoneStt,
      MainphoneOrder,
      // AssignManagerDialog,
    },
  data() {
      return {
        // vertical bat
        first_drag: 26,
        // drop layer
        dropMainDetail: false,
        stt_switch: false,
        stt_slide: false,

        // dialog email
        dialogSendEmail: false,
        // dialog as기사 배정
        // dialogAssignManager: false,

        // 상담 panel
        cusArea_resizeClass: false,

        // tabs
        tab_phone_cs: 0,

        // STT_LOG
        STT_LOG: [
          {
            portrait: '',
            name: '나상담',
            chat: '안녕하세요 고객님. 기다리게 해서 죄송합니다. 무엇을 도와드릴까요?',
            time: '오후 2:25'
          },
          {
            portrait: require('@/assets/img/@profile_user.png'),
            name: '나고객',
            chat: '안녕하세요. 국민임대 절차가 궁금해서 연락드렸어요.',
            time: '오후 2:25'
          },
          {
            portrait: require('@/assets/img/@profile_user.png'),
            name: '나고객',
            chat: '입주자격하고 조건이 어덯게 되고 필요한 서류가 있으면 알려주세요',
            time: '오후 2:25'
          },
        ],

        // 주문내역
        ORDER_LIST: [
          {
            logo: require('@/assets/img/logo_gmarket.png'),
            shop_name: '지마켓',
            number: 'HK-20230211-030023',
            date: '2023-09-14 17:24:56',
            product: '(기획전) 삼성PC 금상첨화 풀세트 개인용',
            stat: '결제완료',
            cash: '1개  |  780,000원',
            expand: false,
            child : [
              {
                title: '주문 정보',
                icon : 'orderInfo',
                detail: [
                  { title: '상품코드', value: '230800' },
                  { title: '상품 명', value: '삼성PC 금상첨화 풀세트 기획' },
                  { title: '판매가', value: '1,200,000원' },
                  { title: '옵션 추가 금액', value: '80,000원' },
                  { title: '할인 금액', value: '30,000원' },
                ]
              },
              {
                title: '결제 정보',
                icon : 'payInfo',
                detail: [
                  { title: '상품코드', value: '230800' },
                  { title: '상품 명', value: '삼성PC 금상첨화 풀세트 기획' },
                  { title: '판매가', value: '1,200,000원' },
                  { title: '옵션 추가 금액', value: '80,000원' },
                  { title: '할인 금액', value: '30,000원' },
                ]
              },
              {
                title: '배송 정보',
                icon : 'shipInfo',
                detail: [
                  { title: '배송상태', value: '배송전' },
                  { title: '배송 시작시간', value: '-' },
                  { title: '배송 종료시간', value: '-' },
                  { title: '배송 메시지', value: '직접 수령하겠습니다. 입구에서 전화 주세요' },
                  { title: '배송지 주소', value: '서울시 금천구 서부샛길606 B동 430호' },
                ]
              },
              {
                title: '수령인 정보',
                icon : 'userInfo',
                detail: [
                  { title: '성함', value: '나고객' },
                  { title: '연락처', value: '010-5303-4545' },
                  { title: '수령 주소', value: '서울시 금천구 서부샛길606 B동 430호' },
                ]
              },
            ]
          },
          {
            logo: require('@/assets/img/logo_11st.png'),
            shop_name: '11번가',
            number: 'HK-20230411-040023',
            date: '2023-01-20 13:24:56',
            product: '삼성 S27C310 IPS 27인치 사무용 업무용 모니터 기획',
            cash: '1개  |  179,000원',
            stat: '배송완료',
            expand: false,
            child : [
              {
                title: '주문 정보',
                icon : 'orderInfo',
                detail: [
                  { title: '상품코드', value: '230800' },
                  { title: '상품 명', value: '삼성PC 금상첨화 풀세트 기획' },
                  { title: '판매가', value: '1,200,000원' },
                  { title: '옵션 추가 금액', value: '80,000원' },
                  { title: '할인 금액', value: '30,000원' },
                ]
              },
              {
                title: '결제 정보',
                icon : 'payInfo',
                detail: [
                  { title: '상품코드', value: '230800' },
                  { title: '상품 명', value: '삼성PC 금상첨화 풀세트 기획' },
                  { title: '판매가', value: '1,200,000원' },
                  { title: '옵션 추가 금액', value: '80,000원' },
                  { title: '할인 금액', value: '30,000원' },
                ]
              },
              {
                title: '배송 정보',
                icon : 'shipInfo',
                detail: [
                  { title: '배송상태', value: '배송완료' },
                  { title: '배송 시작시간', value: '2023-01-21 13:24:56' },
                  { title: '배송 종료시간', value: '2023-01-23 18:44:00' },
                  { title: '배송 메시지', value: '직접 수령하겠습니다. 입구에서 전화 주세요' },
                  { title: '배송지 주소', value: '서울시 금천구 서부샛길606 B동 430호' },
                ]
              },
              {
                title: '수령인 정보',
                icon : 'userInfo',
                detail: [
                  { title: '성함', value: '나고객' },
                  { title: '연락처', value: '010-5303-4545' },
                  { title: '수령 주소', value: '서울시 금천구 서부샛길606 B동 430호' },
                ]
              },
            ]
          },
          {
            logo: require('@/assets/img/logo_coupang.png'),
            shop_name: '쿠팡',
            number: 'HK-20230315-030017',
            date: '2023-01-23 13:24:56',
            product: '삼성 2테라 외장하드 J3 2TB Portable USB 3.0 외장HD',
            cash: '1개  |  119,900원',
            stat: '배송완료',
            expand: false,
            child : [
              {
                title: '주문 정보',
                icon : 'orderInfo',
                detail: [
                  { title: '상품코드', value: '230800' },
                  { title: '상품 명', value: '삼성PC 금상첨화 풀세트 기획' },
                  { title: '판매가', value: '1,200,000원' },
                  { title: '옵션 추가 금액', value: '80,000원' },
                  { title: '할인 금액', value: '30,000원' },
                ]
              },
              {
                title: '결제 정보',
                icon : 'payInfo',
                detail: [
                  { title: '상품코드', value: '230800' },
                  { title: '상품 명', value: '삼성PC 금상첨화 풀세트 기획' },
                  { title: '판매가', value: '1,200,000원' },
                  { title: '옵션 추가 금액', value: '80,000원' },
                  { title: '할인 금액', value: '30,000원' },
                ]
              },
              {
                title: '배송 정보',
                icon : 'shipInfo',
                detail: [
                  { title: '배송상태', value: '배송완료' },
                  { title: '배송 시작시간', value: '2023-01-24 13:24:56' },
                  { title: '배송 종료시간', value: '2023-01-27 18:44:00' },
                  { title: '배송 메시지', value: '직접 수령하겠습니다. 입구에서 전화 주세요' },
                  { title: '배송지 주소', value: '서울시 금천구 서부샛길606 B동 430호' },
                ]
              },
              {
                title: '수령인 정보',
                icon : 'userInfo',
                detail: [
                  { title: '성함', value: '나고객' },
                  { title: '연락처', value: '010-5303-4545' },
                  { title: '수령 주소', value: '서울시 금천구 서부샛길606 B동 430호' },
                ]
              },
            ]
          },
        ],

        //전화걸기
        OUT_CALL_DATA: {
          CL_TYPE_CD: 'OUT',
          dropItems: [],
          dropItems2: [],
          CUST_PHN_NO: '',
          PHN_CUTT_ID: '',
          CUTT_RSVT_ID: '',
          MODIFY_USE: false,
        },

        rightIndex: 0,
        dialogSms: false,
        dialogTalk: false,

        // 위치정보, 연락처정보 전송
        dialogPlaceContactsFind: false,
        HeadersSendPlace: [
          { text: '위치명', value: 'PSTN_NM', align: 'left', width: '100px', sortable: false },
          { text: '지역', value: 'SPLIT_ADDR', align: 'left', width: '100px', sortable: false },
          { text: '주소', value: 'ADDR', align: 'left',  sortable: false, },
        ],
        SearchSendInputData: '',
        ItemsSendData: [],
        SelectedSendType: '문자',
        selectedSendItem: [],

        HeadersSendContacts: [
          { text: '연락처', value: 'TELNO', align: 'left', width: '100px', sortable: false },
          { text: '지역', value: 'RGN_NM', align: 'left', width: '100px', sortable: false },
          { text: '담당부서', value: 'TKCG_DEPT_NM', align: 'left', width: '100px', sortable: false,},
          { text: '담당업무', value: 'TASK_NM', align: 'left', sortable: false,},
        ],
        HEADER_TITLE: '',
        DATA_TYPE_PROP: '',
        COMPONENT_KEY: '',

        SNDR_KEY: '',
        DSPTCH_PRF_KEY: '',

        SCH_POST_KEYWORD : '',

        common_code : [],
        CL_TYPE_CD: 'IN', //인바운드 고정
        CHN_TYPE_DTL_CD:'',// 채널 상세분류(전화상담에서는 사용 안함)

        //고객 기본정보
        CUST_INFO : {
          CHNL : 'TEL',
          CUST_NM : '성명미상',
          CUST_PHN_NO : '　',
          portrait : require('@/assets/img/@profile_customer.png'),
          VIP_CUST_YN: false,
          CAUTION_CUST_YN: 'N',
        },

        //[VOC 접수]
        CHNL:'TEL',//채널 전화 고정
        dialogVoc: false,
        VOC_DATA : '',

        PHN_CUTT_ID : '', //전화 상담 ID
        //확장속성
        EXPSN_ATTR:[],
        editable : false,

        //상담유형 정보
        ITGRT_USE_YN : 'N', //통합 사용 여부
        CUTT_TYPE_LMT_LVL_CD : 3,//상담유형 제한 레벨
        STT_USE_YN:'N', //STT 사용 여부

        SELECTED_ATTR_INDEX : 0, //선택된 확장 속성 INDEX

        dialogFindPost:false, //우편번호 Dialog

        // [핵심 정보]
        cus_key_resizeClass: false,


        // [마이 데스크]
        MY_DESK_DATA: {
          monitor_in: 375,
          monitor_re: 300,
          monitor_wait: 75,
          no_callback: 9,
          no_reserve: 19,
          campaign_stat: 39,
          add_info: [
            { text: "대기", icon: 'cti-move-wait', time: 40},
            { text: "후처리", icon: 'cti-move-after', time: 40},
            { text: "휴식", icon: 'cti-move-rest', time: 40},
            { text: "교육", icon: 'cti-move-edu', time: 50},
            { text: "식사", icon: 'cti-move-launch', time: 50},
            { text: "기타", icon: 'cti-move-etc', time: 30},
          ]
        },

        // [상담 form]
        CHAT_TOP_INFO : {
          favortie: false,
          status: 'main', //error 상담중 , main 상담대기
          date : '2023/01/18 13:05',
        },
        // 예약콜
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

        //상담유형
        CUTT_ITEMS : [],
        CUTT_TYPE_TREE:[], //상담유형 선택된 정보

        CPI_ID : '', //캠페인 ID
        CPI_CNT : false,   //캠페인 시도횟수
        CLBK_ID : '', //콜백 ID
        RSVT_ID : '', //상담예약 ID
        CUTT_BGNG_DT : '', //상담 시작 일시
        CUTT_END_DT : '', //상담 종료 일시
        AFTPRCS_HR : 0, //후처리 시간(초)
        AFTPRCS_HR_TIMER : '', //후처리 시간 타이머
        DRWI_SE_NM : '', //IVR 명
        REC_FILE_NM : '', //녹취 파일명
        CUTT_RSVT_ID : '', //예약 콜 ID
        CPLMT_CL_YN : 'N', //칭찬콜 여부
        AUTO_CL_YN : 'N', //오토콜 여부
        DSPTCH_NO : '', //대표번호(고객 -> 상담사)

        //confirm alert 메시지
        MESSAGE : {
          CONFIRM : {
            REG : {alertDialogToggle: true, msg: '상담내용을 저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.phoneCuttSave, callNo: this.closeMsg}
            , RESET_CUTT_FORM : {alertDialogToggle: true, msg: '상담내용을 초기화 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.phnCuttFormReset, callNo: this.closeMsg}
            , REFRESH_CUTT_FORM : {alertDialogToggle: true, msg: '상담내용 확장속성을 리로드 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.reloadExpsnAttr, callNo: this.closeMsg}
          },
          ALERT : {
             SEND_FAIL : {alertDialogToggle: true, msg: '전송에 실패하였습니다.', iconClass: 'is-caution', type: 'default'}
            , ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
            , NONE : {alertDialogToggle: true, msg: '보내실 항목을 선택해주세요.', iconClass: 'is-caution', type: 'default'}
            , SOCKET_ERROR : {alertDialogToggle: true, msg: 'CTI에 로그인이 되어 있지 않습니다.', iconClass: 'is-caution', type: 'default'}
            , CUST_EMAIL_ERROR : {alertDialogToggle: true, msg: '이메일 정보가 없습니다.', iconClass: 'is-caution', type: 'default'}
            , SUMMARY_CUTT_CN: {alertDialogToggle: true, msg: 'STT 내용이 없습니다.', iconClass: 'is-info', type: 'default'}
            , APPLY_CUTT_CN: {alertDialogToggle: true, msg: "'상담 내용' 항목이 없습니다.", iconClass: 'is-info', type: 'default'}
            , CUTT_TYPE_EMPTY: {alertDialogToggle: true, msg: "상담 유형을 선택해 주세요.", iconClass: 'is-info', type: 'default'}
            , FORCE_CUTT_REG_CONDITION: {alertDialogToggle: true, msg: "강제 생성은 'CTI OFF' 이거나 '후처리' 상태인 경우에만 가능 합니다.", iconClass: 'is-info', type: 'default'}
          },
          ERROR : {
            ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
          },
          TOAST : {
            SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          },

        },

        // [통합 접촉이력]
        all_log_data: {
          // 콜백
          ARR_CALLBACK: [
            {
              date: '2023.02.16(월)',
            },
            {
              type: 'call',
              reserve_date: '2023-02-16 13:25',
              name: '나상담',
              category: '인바운드 > 전화',
              last_call: '2023-02-16 11:25',
              count: 5,
              status: 'accept',
              link: 'link 1'
            },
            {
              type: 'call',
              reserve_date: '2023-02-16 13:25',
              name: '나상담',
              category: '인바운드 > 전화',
              last_call: '2023-02-16 11:25',
              count: 5,
              status: 'error',
              link: 'link 1'
            },
          ],
        },

        CTI_STAT : false, //CTI 로그인 여부
        CUSL_STAT : 'CTI OFF', //후처리
        forcCuttAble : false,
        // FORCE_CUTT_BGNG_DT : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        // FORCE_CUTT_END_DT : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        FORCE_CUTT_BGNG_DT : '',
        FORCE_CUTT_END_DT : '',
        FORCE_CUTT_BGNG_TIME : '',
        FORCE_CUTT_END_TIME : '',

        dialogCuttTypeTree: false, //상담유형 Tree 모달

        CALL_ING: false, //상담 중 여부

        // test 상담유형 검색
        testCsType: [
          {
              "CUTT_TYPE_SE_NM": "통합",
              "DSPTCH_NO": "",
              "LVL": "1",
              "CUTT_TYPE_SE_CD": "ITGRT",
              "CUSTCO_ID": "1",
              "SORT_ORD": "1",
              "CUTT_TYPE_NM": "스타법무법인",
              "CUTT_TYPE_ID": "1",
              "MAX_SORT_ORD": "0",
              "UP_CUTT_TYPE_ID": "",
              "FULL_PATH": "스타법무법인",
              "USE_YN": "Y",
              "CUTT_TYPE_LVL": "1",
              "RE_SORT_ORD": "1",
              "children": [
                  {
                      "CUTT_TYPE_SE_NM": "통합",
                      "DSPTCH_NO": "07079490063",
                      "LVL": "2",
                      "CUTT_TYPE_SE_CD": "ITGRT",
                      "CUSTCO_ID": "1",
                      "SORT_ORD": "1",
                      "CUTT_TYPE_NM": "고객 문의 (신규)",
                      "CUTT_TYPE_ID": "54",
                      "MAX_SORT_ORD": "4",
                      "UP_CUTT_TYPE_ID": "1",
                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규)",
                      "USE_YN": "Y",
                      "CUTT_TYPE_LVL": "2",
                      "RE_SORT_ORD": "1",
                      "children": [
                          {
                              "CUTT_TYPE_SE_NM": "통합",
                              "DSPTCH_NO": "",
                              "LVL": "3",
                              "CUTT_TYPE_SE_CD": "ITGRT",
                              "CUSTCO_ID": "1",
                              "SORT_ORD": "1",
                              "CUTT_TYPE_NM": "회생/파산",
                              "CUTT_TYPE_ID": "57",
                              "MAX_SORT_ORD": "17",
                              "UP_CUTT_TYPE_ID": "54",
                              "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 회생/파산",
                              "USE_YN": "Y",
                              "CUTT_TYPE_LVL": "3",
                              "RE_SORT_ORD": "1",
                              "children": [
                                  {
                                      "CUTT_TYPE_SE_NM": "통합",
                                      "DSPTCH_NO": "",
                                      "LVL": "4",
                                      "CUTT_TYPE_SE_CD": "ITGRT",
                                      "CUSTCO_ID": "1",
                                      "SORT_ORD": "1",
                                      "CUTT_TYPE_NM": "개인회생/개인회생",
                                      "CUTT_TYPE_ID": "58",
                                      "MAX_SORT_ORD": "7",
                                      "UP_CUTT_TYPE_ID": "57",
                                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 회생/파산 > 개인회생/개인회생",
                                      "USE_YN": "Y",
                                      "CUTT_TYPE_LVL": "4",
                                      "RE_SORT_ORD": "1",
                                      "children": [],
                                      "SORT": "00001 > 00001 > 00001 > 00001",
                                      "name": "개인회생/개인회생",
                                      "CHILD_CNT": "0",
                                      "id": "58",
                                      "CUSTCO_DSPTCH_NO_ID": "",
                                      "UP_CUTT_TYPE_NM": "회생/파산",
                                      "CUTT_TYPE_EXPLN": ""
                                  },
                                  {
                                      "CUTT_TYPE_SE_NM": "통합",
                                      "DSPTCH_NO": "",
                                      "LVL": "4",
                                      "CUTT_TYPE_SE_CD": "ITGRT",
                                      "CUSTCO_ID": "1",
                                      "SORT_ORD": "2",
                                      "CUTT_TYPE_NM": "개인파산/개인파산",
                                      "CUTT_TYPE_ID": "59",
                                      "MAX_SORT_ORD": "7",
                                      "UP_CUTT_TYPE_ID": "57",
                                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 회생/파산 > 개인파산/개인파산",
                                      "USE_YN": "Y",
                                      "CUTT_TYPE_LVL": "4",
                                      "RE_SORT_ORD": "2",
                                      "children": [],
                                      "SORT": "00001 > 00001 > 00001 > 00002",
                                      "name": "개인파산/개인파산",
                                      "CHILD_CNT": "0",
                                      "id": "59",
                                      "CUSTCO_DSPTCH_NO_ID": "",
                                      "UP_CUTT_TYPE_NM": "회생/파산",
                                      "CUTT_TYPE_EXPLN": ""
                                  },
                                  {
                                      "CUTT_TYPE_SE_NM": "통합",
                                      "DSPTCH_NO": "",
                                      "LVL": "4",
                                      "CUTT_TYPE_SE_CD": "ITGRT",
                                      "CUSTCO_ID": "1",
                                      "SORT_ORD": "3",
                                      "CUTT_TYPE_NM": "개인회생/개인파산",
                                      "CUTT_TYPE_ID": "60",
                                      "MAX_SORT_ORD": "7",
                                      "UP_CUTT_TYPE_ID": "57",
                                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 회생/파산 > 개인회생/개인파산",
                                      "USE_YN": "Y",
                                      "CUTT_TYPE_LVL": "4",
                                      "RE_SORT_ORD": "3",
                                      "children": [],
                                      "SORT": "00001 > 00001 > 00001 > 00003",
                                      "name": "개인회생/개인파산",
                                      "CHILD_CNT": "0",
                                      "id": "60",
                                      "CUSTCO_DSPTCH_NO_ID": "",
                                      "UP_CUTT_TYPE_NM": "회생/파산",
                                      "CUTT_TYPE_EXPLN": ""
                                  },
                                  {
                                      "CUTT_TYPE_SE_NM": "통합",
                                      "DSPTCH_NO": "",
                                      "LVL": "4",
                                      "CUTT_TYPE_SE_CD": "ITGRT",
                                      "CUSTCO_ID": "1",
                                      "SORT_ORD": "4",
                                      "CUTT_TYPE_NM": "개인파산/개인회생",
                                      "CUTT_TYPE_ID": "61",
                                      "MAX_SORT_ORD": "7",
                                      "UP_CUTT_TYPE_ID": "57",
                                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 회생/파산 > 개인파산/개인회생",
                                      "USE_YN": "Y",
                                      "CUTT_TYPE_LVL": "4",
                                      "RE_SORT_ORD": "4",
                                      "children": [],
                                      "SORT": "00001 > 00001 > 00001 > 00004",
                                      "name": "개인파산/개인회생",
                                      "CHILD_CNT": "0",
                                      "id": "61",
                                      "CUSTCO_DSPTCH_NO_ID": "",
                                      "UP_CUTT_TYPE_NM": "회생/파산",
                                      "CUTT_TYPE_EXPLN": ""
                                  },
                                  {
                                      "CUTT_TYPE_SE_NM": "통합",
                                      "DSPTCH_NO": "",
                                      "LVL": "4",
                                      "CUTT_TYPE_SE_CD": "ITGRT",
                                      "CUSTCO_ID": "1",
                                      "SORT_ORD": "5",
                                      "CUTT_TYPE_NM": "구분불가/개인회생",
                                      "CUTT_TYPE_ID": "62",
                                      "MAX_SORT_ORD": "7",
                                      "UP_CUTT_TYPE_ID": "57",
                                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 회생/파산 > 구분불가/개인회생",
                                      "USE_YN": "Y",
                                      "CUTT_TYPE_LVL": "4",
                                      "RE_SORT_ORD": "5",
                                      "children": [],
                                      "SORT": "00001 > 00001 > 00001 > 00005",
                                      "name": "구분불가/개인회생",
                                      "CHILD_CNT": "0",
                                      "id": "62",
                                      "CUSTCO_DSPTCH_NO_ID": "",
                                      "UP_CUTT_TYPE_NM": "회생/파산",
                                      "CUTT_TYPE_EXPLN": ""
                                  },
                                  {
                                      "CUTT_TYPE_SE_NM": "통합",
                                      "DSPTCH_NO": "",
                                      "LVL": "4",
                                      "CUTT_TYPE_SE_CD": "ITGRT",
                                      "CUSTCO_ID": "1",
                                      "SORT_ORD": "6",
                                      "CUTT_TYPE_NM": "구분불가/개인파산",
                                      "CUTT_TYPE_ID": "63",
                                      "MAX_SORT_ORD": "7",
                                      "UP_CUTT_TYPE_ID": "57",
                                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 회생/파산 > 구분불가/개인파산",
                                      "USE_YN": "Y",
                                      "CUTT_TYPE_LVL": "4",
                                      "RE_SORT_ORD": "6",
                                      "children": [],
                                      "SORT": "00001 > 00001 > 00001 > 00006",
                                      "name": "구분불가/개인파산",
                                      "CHILD_CNT": "0",
                                      "id": "63",
                                      "CUSTCO_DSPTCH_NO_ID": "",
                                      "UP_CUTT_TYPE_NM": "회생/파산",
                                      "CUTT_TYPE_EXPLN": ""
                                  },
                                  {
                                      "CUTT_TYPE_SE_NM": "통합",
                                      "DSPTCH_NO": "",
                                      "LVL": "4",
                                      "CUTT_TYPE_SE_CD": "ITGRT",
                                      "CUSTCO_ID": "1",
                                      "SORT_ORD": "7",
                                      "CUTT_TYPE_NM": "개인회생채무조회",
                                      "CUTT_TYPE_ID": "64",
                                      "MAX_SORT_ORD": "7",
                                      "UP_CUTT_TYPE_ID": "57",
                                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 회생/파산 > 개인회생채무조회",
                                      "USE_YN": "Y",
                                      "CUTT_TYPE_LVL": "4",
                                      "RE_SORT_ORD": "7",
                                      "children": [],
                                      "SORT": "00001 > 00001 > 00001 > 00007",
                                      "name": "개인회생채무조회",
                                      "CHILD_CNT": "0",
                                      "id": "64",
                                      "CUSTCO_DSPTCH_NO_ID": "",
                                      "UP_CUTT_TYPE_NM": "회생/파산",
                                      "CUTT_TYPE_EXPLN": ""
                                  }
                              ],
                              "SORT": "00001 > 00001 > 00001",
                              "name": "회생/파산",
                              "CHILD_CNT": "7",
                              "id": "57",
                              "CUSTCO_DSPTCH_NO_ID": "",
                              "UP_CUTT_TYPE_NM": "고객 문의 (신규)",
                              "CUTT_TYPE_EXPLN": "고객문의 중 회생파산 문의 일 경우"
                          },
                          {
                              "CUTT_TYPE_SE_NM": "통합",
                              "DSPTCH_NO": "",
                              "LVL": "3",
                              "CUTT_TYPE_SE_CD": "ITGRT",
                              "CUSTCO_ID": "1",
                              "SORT_ORD": "2",
                              "CUTT_TYPE_NM": "가사",
                              "CUTT_TYPE_ID": "65",
                              "MAX_SORT_ORD": "17",
                              "UP_CUTT_TYPE_ID": "54",
                              "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 가사",
                              "USE_YN": "Y",
                              "CUTT_TYPE_LVL": "3",
                              "RE_SORT_ORD": "2",
                              "children": [
                                  {
                                      "CUTT_TYPE_SE_NM": "통합",
                                      "DSPTCH_NO": "",
                                      "LVL": "4",
                                      "CUTT_TYPE_SE_CD": "ITGRT",
                                      "CUSTCO_ID": "1",
                                      "SORT_ORD": "1",
                                      "CUTT_TYPE_NM": "이혼",
                                      "CUTT_TYPE_ID": "66",
                                      "MAX_SORT_ORD": "6",
                                      "UP_CUTT_TYPE_ID": "65",
                                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 가사 > 이혼",
                                      "USE_YN": "Y",
                                      "CUTT_TYPE_LVL": "4",
                                      "RE_SORT_ORD": "1",
                                      "children": [],
                                      "SORT": "00001 > 00001 > 00002 > 00001",
                                      "name": "이혼",
                                      "CHILD_CNT": "0",
                                      "id": "66",
                                      "CUSTCO_DSPTCH_NO_ID": "",
                                      "UP_CUTT_TYPE_NM": "가사",
                                      "CUTT_TYPE_EXPLN": ""
                                  },
                                  {
                                      "CUTT_TYPE_SE_NM": "통합",
                                      "DSPTCH_NO": "",
                                      "LVL": "4",
                                      "CUTT_TYPE_SE_CD": "ITGRT",
                                      "CUSTCO_ID": "1",
                                      "SORT_ORD": "2",
                                      "CUTT_TYPE_NM": "상간자",
                                      "CUTT_TYPE_ID": "67",
                                      "MAX_SORT_ORD": "6",
                                      "UP_CUTT_TYPE_ID": "65",
                                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 가사 > 상간자",
                                      "USE_YN": "Y",
                                      "CUTT_TYPE_LVL": "4",
                                      "RE_SORT_ORD": "2",
                                      "children": [],
                                      "SORT": "00001 > 00001 > 00002 > 00002",
                                      "name": "상간자",
                                      "CHILD_CNT": "0",
                                      "id": "67",
                                      "CUSTCO_DSPTCH_NO_ID": "",
                                      "UP_CUTT_TYPE_NM": "가사",
                                      "CUTT_TYPE_EXPLN": ""
                                  },
                                  {
                                      "CUTT_TYPE_SE_NM": "통합",
                                      "DSPTCH_NO": "",
                                      "LVL": "4",
                                      "CUTT_TYPE_SE_CD": "ITGRT",
                                      "CUSTCO_ID": "1",
                                      "SORT_ORD": "3",
                                      "CUTT_TYPE_NM": "증거보전",
                                      "CUTT_TYPE_ID": "68",
                                      "MAX_SORT_ORD": "6",
                                      "UP_CUTT_TYPE_ID": "65",
                                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 가사 > 증거보전",
                                      "USE_YN": "Y",
                                      "CUTT_TYPE_LVL": "4",
                                      "RE_SORT_ORD": "3",
                                      "children": [],
                                      "SORT": "00001 > 00001 > 00002 > 00003",
                                      "name": "증거보전",
                                      "CHILD_CNT": "0",
                                      "id": "68",
                                      "CUSTCO_DSPTCH_NO_ID": "",
                                      "UP_CUTT_TYPE_NM": "가사",
                                      "CUTT_TYPE_EXPLN": ""
                                  },
                                  {
                                      "CUTT_TYPE_SE_NM": "통합",
                                      "DSPTCH_NO": "",
                                      "LVL": "4",
                                      "CUTT_TYPE_SE_CD": "ITGRT",
                                      "CUSTCO_ID": "1",
                                      "SORT_ORD": "4",
                                      "CUTT_TYPE_NM": "양육권",
                                      "CUTT_TYPE_ID": "69",
                                      "MAX_SORT_ORD": "6",
                                      "UP_CUTT_TYPE_ID": "65",
                                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 가사 > 양육권",
                                      "USE_YN": "Y",
                                      "CUTT_TYPE_LVL": "4",
                                      "RE_SORT_ORD": "4",
                                      "children": [],
                                      "SORT": "00001 > 00001 > 00002 > 00004",
                                      "name": "양육권",
                                      "CHILD_CNT": "0",
                                      "id": "69",
                                      "CUSTCO_DSPTCH_NO_ID": "",
                                      "UP_CUTT_TYPE_NM": "가사",
                                      "CUTT_TYPE_EXPLN": ""
                                  },
                                  {
                                      "CUTT_TYPE_SE_NM": "통합",
                                      "DSPTCH_NO": "",
                                      "LVL": "4",
                                      "CUTT_TYPE_SE_CD": "ITGRT",
                                      "CUSTCO_ID": "1",
                                      "SORT_ORD": "5",
                                      "CUTT_TYPE_NM": "상속",
                                      "CUTT_TYPE_ID": "70",
                                      "MAX_SORT_ORD": "6",
                                      "UP_CUTT_TYPE_ID": "65",
                                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 가사 > 상속",
                                      "USE_YN": "Y",
                                      "CUTT_TYPE_LVL": "4",
                                      "RE_SORT_ORD": "5",
                                      "children": [],
                                      "SORT": "00001 > 00001 > 00002 > 00005",
                                      "name": "상속",
                                      "CHILD_CNT": "0",
                                      "id": "70",
                                      "CUSTCO_DSPTCH_NO_ID": "",
                                      "UP_CUTT_TYPE_NM": "가사",
                                      "CUTT_TYPE_EXPLN": ""
                                  },
                                  {
                                      "CUTT_TYPE_SE_NM": "통합",
                                      "DSPTCH_NO": "",
                                      "LVL": "4",
                                      "CUTT_TYPE_SE_CD": "ITGRT",
                                      "CUSTCO_ID": "1",
                                      "SORT_ORD": "6",
                                      "CUTT_TYPE_NM": "기타",
                                      "CUTT_TYPE_ID": "71",
                                      "MAX_SORT_ORD": "6",
                                      "UP_CUTT_TYPE_ID": "65",
                                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 가사 > 기타",
                                      "USE_YN": "Y",
                                      "CUTT_TYPE_LVL": "4",
                                      "RE_SORT_ORD": "6",
                                      "children": [],
                                      "SORT": "00001 > 00001 > 00002 > 00006",
                                      "name": "기타",
                                      "CHILD_CNT": "0",
                                      "id": "71",
                                      "CUSTCO_DSPTCH_NO_ID": "",
                                      "UP_CUTT_TYPE_NM": "가사",
                                      "CUTT_TYPE_EXPLN": ""
                                  }
                              ],
                              "SORT": "00001 > 00001 > 00002",
                              "name": "가사",
                              "CHILD_CNT": "6",
                              "id": "65",
                              "CUSTCO_DSPTCH_NO_ID": "",
                              "UP_CUTT_TYPE_NM": "고객 문의 (신규)",
                              "CUTT_TYPE_EXPLN": ""
                          },
                          {
                              "CUTT_TYPE_SE_NM": "통합",
                              "DSPTCH_NO": "",
                              "LVL": "3",
                              "CUTT_TYPE_SE_CD": "ITGRT",
                              "CUSTCO_ID": "1",
                              "SORT_ORD": "3",
                              "CUTT_TYPE_NM": "음주",
                              "CUTT_TYPE_ID": "72",
                              "MAX_SORT_ORD": "17",
                              "UP_CUTT_TYPE_ID": "54",
                              "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 음주",
                              "USE_YN": "Y",
                              "CUTT_TYPE_LVL": "3",
                              "RE_SORT_ORD": "3",
                              "children": [
                                  {
                                      "CUTT_TYPE_SE_NM": "통합",
                                      "DSPTCH_NO": "",
                                      "LVL": "4",
                                      "CUTT_TYPE_SE_CD": "ITGRT",
                                      "CUSTCO_ID": "1",
                                      "SORT_ORD": "1",
                                      "CUTT_TYPE_NM": "행정",
                                      "CUTT_TYPE_ID": "73",
                                      "MAX_SORT_ORD": "2",
                                      "UP_CUTT_TYPE_ID": "72",
                                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 음주 > 행정",
                                      "USE_YN": "Y",
                                      "CUTT_TYPE_LVL": "4",
                                      "RE_SORT_ORD": "1",
                                      "children": [],
                                      "SORT": "00001 > 00001 > 00003 > 00001",
                                      "name": "행정",
                                      "CHILD_CNT": "0",
                                      "id": "73",
                                      "CUSTCO_DSPTCH_NO_ID": "",
                                      "UP_CUTT_TYPE_NM": "음주",
                                      "CUTT_TYPE_EXPLN": ""
                                  },
                                  {
                                      "CUTT_TYPE_SE_NM": "통합",
                                      "DSPTCH_NO": "",
                                      "LVL": "4",
                                      "CUTT_TYPE_SE_CD": "ITGRT",
                                      "CUSTCO_ID": "1",
                                      "SORT_ORD": "2",
                                      "CUTT_TYPE_NM": "형사",
                                      "CUTT_TYPE_ID": "74",
                                      "MAX_SORT_ORD": "2",
                                      "UP_CUTT_TYPE_ID": "72",
                                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 음주 > 형사",
                                      "USE_YN": "Y",
                                      "CUTT_TYPE_LVL": "4",
                                      "RE_SORT_ORD": "2",
                                      "children": [],
                                      "SORT": "00001 > 00001 > 00003 > 00002",
                                      "name": "형사",
                                      "CHILD_CNT": "0",
                                      "id": "74",
                                      "CUSTCO_DSPTCH_NO_ID": "",
                                      "UP_CUTT_TYPE_NM": "음주",
                                      "CUTT_TYPE_EXPLN": ""
                                  }
                              ],
                              "SORT": "00001 > 00001 > 00003",
                              "name": "음주",
                              "CHILD_CNT": "2",
                              "id": "72",
                              "CUSTCO_DSPTCH_NO_ID": "",
                              "UP_CUTT_TYPE_NM": "고객 문의 (신규)",
                              "CUTT_TYPE_EXPLN": ""
                          },
                          {
                              "CUTT_TYPE_SE_NM": "통합",
                              "DSPTCH_NO": "",
                              "LVL": "3",
                              "CUTT_TYPE_SE_CD": "ITGRT",
                              "CUSTCO_ID": "1",
                              "SORT_ORD": "4",
                              "CUTT_TYPE_NM": "민사",
                              "CUTT_TYPE_ID": "75",
                              "MAX_SORT_ORD": "17",
                              "UP_CUTT_TYPE_ID": "54",
                              "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 민사",
                              "USE_YN": "Y",
                              "CUTT_TYPE_LVL": "3",
                              "RE_SORT_ORD": "4",
                              "children": [
                                  {
                                      "CUTT_TYPE_SE_NM": "통합",
                                      "DSPTCH_NO": "",
                                      "LVL": "4",
                                      "CUTT_TYPE_SE_CD": "ITGRT",
                                      "CUSTCO_ID": "1",
                                      "SORT_ORD": "1",
                                      "CUTT_TYPE_NM": "민사",
                                      "CUTT_TYPE_ID": "76",
                                      "MAX_SORT_ORD": "2",
                                      "UP_CUTT_TYPE_ID": "75",
                                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 민사 > 민사",
                                      "USE_YN": "Y",
                                      "CUTT_TYPE_LVL": "4",
                                      "RE_SORT_ORD": "1",
                                      "children": [],
                                      "SORT": "00001 > 00001 > 00004 > 00001",
                                      "name": "민사",
                                      "CHILD_CNT": "0",
                                      "id": "76",
                                      "CUSTCO_DSPTCH_NO_ID": "",
                                      "UP_CUTT_TYPE_NM": "민사",
                                      "CUTT_TYPE_EXPLN": ""
                                  },
                                  {
                                      "CUTT_TYPE_SE_NM": "통합",
                                      "DSPTCH_NO": "",
                                      "LVL": "4",
                                      "CUTT_TYPE_SE_CD": "ITGRT",
                                      "CUSTCO_ID": "1",
                                      "SORT_ORD": "2",
                                      "CUTT_TYPE_NM": "명도",
                                      "CUTT_TYPE_ID": "77",
                                      "MAX_SORT_ORD": "2",
                                      "UP_CUTT_TYPE_ID": "75",
                                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 민사 > 명도",
                                      "USE_YN": "Y",
                                      "CUTT_TYPE_LVL": "4",
                                      "RE_SORT_ORD": "2",
                                      "children": [],
                                      "SORT": "00001 > 00001 > 00004 > 00002",
                                      "name": "명도",
                                      "CHILD_CNT": "0",
                                      "id": "77",
                                      "CUSTCO_DSPTCH_NO_ID": "",
                                      "UP_CUTT_TYPE_NM": "민사",
                                      "CUTT_TYPE_EXPLN": ""
                                  }
                              ],
                              "SORT": "00001 > 00001 > 00004",
                              "name": "민사",
                              "CHILD_CNT": "2",
                              "id": "75",
                              "CUSTCO_DSPTCH_NO_ID": "",
                              "UP_CUTT_TYPE_NM": "고객 문의 (신규)",
                              "CUTT_TYPE_EXPLN": ""
                          },
                          {
                              "CUTT_TYPE_SE_NM": "통합",
                              "DSPTCH_NO": "",
                              "LVL": "3",
                              "CUTT_TYPE_SE_CD": "ITGRT",
                              "CUSTCO_ID": "1",
                              "SORT_ORD": "5",
                              "CUTT_TYPE_NM": "형사",
                              "CUTT_TYPE_ID": "78",
                              "MAX_SORT_ORD": "17",
                              "UP_CUTT_TYPE_ID": "54",
                              "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 형사",
                              "USE_YN": "Y",
                              "CUTT_TYPE_LVL": "3",
                              "RE_SORT_ORD": "5",
                              "children": [
                                  {
                                      "CUTT_TYPE_SE_NM": "통합",
                                      "DSPTCH_NO": "",
                                      "LVL": "4",
                                      "CUTT_TYPE_SE_CD": "ITGRT",
                                      "CUSTCO_ID": "1",
                                      "SORT_ORD": "1",
                                      "CUTT_TYPE_NM": "형사",
                                      "CUTT_TYPE_ID": "79",
                                      "MAX_SORT_ORD": "2",
                                      "UP_CUTT_TYPE_ID": "78",
                                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 형사 > 형사",
                                      "USE_YN": "Y",
                                      "CUTT_TYPE_LVL": "4",
                                      "RE_SORT_ORD": "1",
                                      "children": [],
                                      "SORT": "00001 > 00001 > 00005 > 00001",
                                      "name": "형사",
                                      "CHILD_CNT": "0",
                                      "id": "79",
                                      "CUSTCO_DSPTCH_NO_ID": "",
                                      "UP_CUTT_TYPE_NM": "형사",
                                      "CUTT_TYPE_EXPLN": ""
                                  },
                                  {
                                      "CUTT_TYPE_SE_NM": "통합",
                                      "DSPTCH_NO": "",
                                      "LVL": "4",
                                      "CUTT_TYPE_SE_CD": "ITGRT",
                                      "CUSTCO_ID": "1",
                                      "SORT_ORD": "2",
                                      "CUTT_TYPE_NM": "형사(성)",
                                      "CUTT_TYPE_ID": "80",
                                      "MAX_SORT_ORD": "2",
                                      "UP_CUTT_TYPE_ID": "78",
                                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 형사 > 형사(성)",
                                      "USE_YN": "Y",
                                      "CUTT_TYPE_LVL": "4",
                                      "RE_SORT_ORD": "2",
                                      "children": [],
                                      "SORT": "00001 > 00001 > 00005 > 00002",
                                      "name": "형사(성)",
                                      "CHILD_CNT": "0",
                                      "id": "80",
                                      "CUSTCO_DSPTCH_NO_ID": "",
                                      "UP_CUTT_TYPE_NM": "형사",
                                      "CUTT_TYPE_EXPLN": ""
                                  }
                              ],
                              "SORT": "00001 > 00001 > 00005",
                              "name": "형사",
                              "CHILD_CNT": "2",
                              "id": "78",
                              "CUSTCO_DSPTCH_NO_ID": "",
                              "UP_CUTT_TYPE_NM": "고객 문의 (신규)",
                              "CUTT_TYPE_EXPLN": ""
                          },
                          {
                              "CUTT_TYPE_SE_NM": "통합",
                              "DSPTCH_NO": "",
                              "LVL": "3",
                              "CUTT_TYPE_SE_CD": "ITGRT",
                              "CUSTCO_ID": "1",
                              "SORT_ORD": "6",
                              "CUTT_TYPE_NM": "법인",
                              "CUTT_TYPE_ID": "81",
                              "MAX_SORT_ORD": "17",
                              "UP_CUTT_TYPE_ID": "54",
                              "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 법인",
                              "USE_YN": "Y",
                              "CUTT_TYPE_LVL": "3",
                              "RE_SORT_ORD": "6",
                              "children": [
                                  {
                                      "CUTT_TYPE_SE_NM": "통합",
                                      "DSPTCH_NO": "",
                                      "LVL": "4",
                                      "CUTT_TYPE_SE_CD": "ITGRT",
                                      "CUSTCO_ID": "1",
                                      "SORT_ORD": "1",
                                      "CUTT_TYPE_NM": "법인회생",
                                      "CUTT_TYPE_ID": "82",
                                      "MAX_SORT_ORD": "4",
                                      "UP_CUTT_TYPE_ID": "81",
                                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 법인 > 법인회생",
                                      "USE_YN": "Y",
                                      "CUTT_TYPE_LVL": "4",
                                      "RE_SORT_ORD": "1",
                                      "children": [],
                                      "SORT": "00001 > 00001 > 00006 > 00001",
                                      "name": "법인회생",
                                      "CHILD_CNT": "0",
                                      "id": "82",
                                      "CUSTCO_DSPTCH_NO_ID": "",
                                      "UP_CUTT_TYPE_NM": "법인",
                                      "CUTT_TYPE_EXPLN": ""
                                  },
                                  {
                                      "CUTT_TYPE_SE_NM": "통합",
                                      "DSPTCH_NO": "",
                                      "LVL": "4",
                                      "CUTT_TYPE_SE_CD": "ITGRT",
                                      "CUSTCO_ID": "1",
                                      "SORT_ORD": "2",
                                      "CUTT_TYPE_NM": "법인파산",
                                      "CUTT_TYPE_ID": "83",
                                      "MAX_SORT_ORD": "4",
                                      "UP_CUTT_TYPE_ID": "81",
                                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 법인 > 법인파산",
                                      "USE_YN": "Y",
                                      "CUTT_TYPE_LVL": "4",
                                      "RE_SORT_ORD": "2",
                                      "children": [],
                                      "SORT": "00001 > 00001 > 00006 > 00002",
                                      "name": "법인파산",
                                      "CHILD_CNT": "0",
                                      "id": "83",
                                      "CUSTCO_DSPTCH_NO_ID": "",
                                      "UP_CUTT_TYPE_NM": "법인",
                                      "CUTT_TYPE_EXPLN": ""
                                  },
                                  {
                                      "CUTT_TYPE_SE_NM": "통합",
                                      "DSPTCH_NO": "",
                                      "LVL": "4",
                                      "CUTT_TYPE_SE_CD": "ITGRT",
                                      "CUSTCO_ID": "1",
                                      "SORT_ORD": "3",
                                      "CUTT_TYPE_NM": "법인등기",
                                      "CUTT_TYPE_ID": "84",
                                      "MAX_SORT_ORD": "4",
                                      "UP_CUTT_TYPE_ID": "81",
                                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 법인 > 법인등기",
                                      "USE_YN": "Y",
                                      "CUTT_TYPE_LVL": "4",
                                      "RE_SORT_ORD": "3",
                                      "children": [],
                                      "SORT": "00001 > 00001 > 00006 > 00003",
                                      "name": "법인등기",
                                      "CHILD_CNT": "0",
                                      "id": "84",
                                      "CUSTCO_DSPTCH_NO_ID": "",
                                      "UP_CUTT_TYPE_NM": "법인",
                                      "CUTT_TYPE_EXPLN": ""
                                  },
                                  {
                                      "CUTT_TYPE_SE_NM": "통합",
                                      "DSPTCH_NO": "",
                                      "LVL": "4",
                                      "CUTT_TYPE_SE_CD": "ITGRT",
                                      "CUSTCO_ID": "1",
                                      "SORT_ORD": "4",
                                      "CUTT_TYPE_NM": "법인설립",
                                      "CUTT_TYPE_ID": "85",
                                      "MAX_SORT_ORD": "4",
                                      "UP_CUTT_TYPE_ID": "81",
                                      "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 법인 > 법인설립",
                                      "USE_YN": "Y",
                                      "CUTT_TYPE_LVL": "4",
                                      "RE_SORT_ORD": "4",
                                      "children": [],
                                      "SORT": "00001 > 00001 > 00006 > 00004",
                                      "name": "법인설립",
                                      "CHILD_CNT": "0",
                                      "id": "85",
                                      "CUSTCO_DSPTCH_NO_ID": "",
                                      "UP_CUTT_TYPE_NM": "법인",
                                      "CUTT_TYPE_EXPLN": ""
                                  }
                              ],
                              "SORT": "00001 > 00001 > 00006",
                              "name": "법인",
                              "CHILD_CNT": "4",
                              "id": "81",
                              "CUSTCO_DSPTCH_NO_ID": "",
                              "UP_CUTT_TYPE_NM": "고객 문의 (신규)",
                              "CUTT_TYPE_EXPLN": ""
                          },
                          {
                              "CUTT_TYPE_SE_NM": "통합",
                              "DSPTCH_NO": "",
                              "LVL": "3",
                              "CUTT_TYPE_SE_CD": "ITGRT",
                              "CUSTCO_ID": "1",
                              "SORT_ORD": "7",
                              "CUTT_TYPE_NM": "행정",
                              "CUTT_TYPE_ID": "86",
                              "MAX_SORT_ORD": "17",
                              "UP_CUTT_TYPE_ID": "54",
                              "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 행정",
                              "USE_YN": "Y",
                              "CUTT_TYPE_LVL": "3",
                              "RE_SORT_ORD": "7",
                              "children": [],
                              "SORT": "00001 > 00001 > 00007",
                              "name": "행정",
                              "CHILD_CNT": "0",
                              "id": "86",
                              "CUSTCO_DSPTCH_NO_ID": "",
                              "UP_CUTT_TYPE_NM": "고객 문의 (신규)",
                              "CUTT_TYPE_EXPLN": ""
                          },
                          {
                              "CUTT_TYPE_SE_NM": "통합",
                              "DSPTCH_NO": "",
                              "LVL": "3",
                              "CUTT_TYPE_SE_CD": "ITGRT",
                              "CUSTCO_ID": "1",
                              "SORT_ORD": "8",
                              "CUTT_TYPE_NM": "일반회생",
                              "CUTT_TYPE_ID": "87",
                              "MAX_SORT_ORD": "17",
                              "UP_CUTT_TYPE_ID": "54",
                              "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 일반회생",
                              "USE_YN": "Y",
                              "CUTT_TYPE_LVL": "3",
                              "RE_SORT_ORD": "8",
                              "children": [],
                              "SORT": "00001 > 00001 > 00008",
                              "name": "일반회생",
                              "CHILD_CNT": "0",
                              "id": "87",
                              "CUSTCO_DSPTCH_NO_ID": "",
                              "UP_CUTT_TYPE_NM": "고객 문의 (신규)",
                              "CUTT_TYPE_EXPLN": ""
                          },
                          {
                              "CUTT_TYPE_SE_NM": "통합",
                              "DSPTCH_NO": "",
                              "LVL": "3",
                              "CUTT_TYPE_SE_CD": "ITGRT",
                              "CUSTCO_ID": "1",
                              "SORT_ORD": "9",
                              "CUTT_TYPE_NM": "가맹거래",
                              "CUTT_TYPE_ID": "88",
                              "MAX_SORT_ORD": "17",
                              "UP_CUTT_TYPE_ID": "54",
                              "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 가맹거래",
                              "USE_YN": "Y",
                              "CUTT_TYPE_LVL": "3",
                              "RE_SORT_ORD": "9",
                              "children": [],
                              "SORT": "00001 > 00001 > 00009",
                              "name": "가맹거래",
                              "CHILD_CNT": "0",
                              "id": "88",
                              "CUSTCO_DSPTCH_NO_ID": "",
                              "UP_CUTT_TYPE_NM": "고객 문의 (신규)",
                              "CUTT_TYPE_EXPLN": ""
                          },
                          {
                              "CUTT_TYPE_SE_NM": "통합",
                              "DSPTCH_NO": "",
                              "LVL": "3",
                              "CUTT_TYPE_SE_CD": "ITGRT",
                              "CUSTCO_ID": "1",
                              "SORT_ORD": "10",
                              "CUTT_TYPE_NM": "집단소송",
                              "CUTT_TYPE_ID": "89",
                              "MAX_SORT_ORD": "17",
                              "UP_CUTT_TYPE_ID": "54",
                              "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 집단소송",
                              "USE_YN": "Y",
                              "CUTT_TYPE_LVL": "3",
                              "RE_SORT_ORD": "10",
                              "children": [],
                              "SORT": "00001 > 00001 > 00010",
                              "name": "집단소송",
                              "CHILD_CNT": "0",
                              "id": "89",
                              "CUSTCO_DSPTCH_NO_ID": "",
                              "UP_CUTT_TYPE_NM": "고객 문의 (신규)",
                              "CUTT_TYPE_EXPLN": ""
                          },
                          {
                              "CUTT_TYPE_SE_NM": "통합",
                              "DSPTCH_NO": "",
                              "LVL": "3",
                              "CUTT_TYPE_SE_CD": "ITGRT",
                              "CUSTCO_ID": "1",
                              "SORT_ORD": "11",
                              "CUTT_TYPE_NM": "부동산등기",
                              "CUTT_TYPE_ID": "90",
                              "MAX_SORT_ORD": "17",
                              "UP_CUTT_TYPE_ID": "54",
                              "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 부동산등기",
                              "USE_YN": "Y",
                              "CUTT_TYPE_LVL": "3",
                              "RE_SORT_ORD": "11",
                              "children": [],
                              "SORT": "00001 > 00001 > 00011",
                              "name": "부동산등기",
                              "CHILD_CNT": "0",
                              "id": "90",
                              "CUSTCO_DSPTCH_NO_ID": "",
                              "UP_CUTT_TYPE_NM": "고객 문의 (신규)",
                              "CUTT_TYPE_EXPLN": ""
                          },
                          {
                              "CUTT_TYPE_SE_NM": "통합",
                              "DSPTCH_NO": "",
                              "LVL": "3",
                              "CUTT_TYPE_SE_CD": "ITGRT",
                              "CUSTCO_ID": "1",
                              "SORT_ORD": "12",
                              "CUTT_TYPE_NM": "산업재해",
                              "CUTT_TYPE_ID": "91",
                              "MAX_SORT_ORD": "17",
                              "UP_CUTT_TYPE_ID": "54",
                              "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 산업재해",
                              "USE_YN": "Y",
                              "CUTT_TYPE_LVL": "3",
                              "RE_SORT_ORD": "12",
                              "children": [],
                              "SORT": "00001 > 00001 > 00012",
                              "name": "산업재해",
                              "CHILD_CNT": "0",
                              "id": "91",
                              "CUSTCO_DSPTCH_NO_ID": "",
                              "UP_CUTT_TYPE_NM": "고객 문의 (신규)",
                              "CUTT_TYPE_EXPLN": ""
                          },
                          {
                              "CUTT_TYPE_SE_NM": "통합",
                              "DSPTCH_NO": "",
                              "LVL": "3",
                              "CUTT_TYPE_SE_CD": "ITGRT",
                              "CUSTCO_ID": "1",
                              "SORT_ORD": "13",
                              "CUTT_TYPE_NM": "지식재산",
                              "CUTT_TYPE_ID": "92",
                              "MAX_SORT_ORD": "17",
                              "UP_CUTT_TYPE_ID": "54",
                              "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 지식재산",
                              "USE_YN": "Y",
                              "CUTT_TYPE_LVL": "3",
                              "RE_SORT_ORD": "13",
                              "children": [],
                              "SORT": "00001 > 00001 > 00013",
                              "name": "지식재산",
                              "CHILD_CNT": "0",
                              "id": "92",
                              "CUSTCO_DSPTCH_NO_ID": "",
                              "UP_CUTT_TYPE_NM": "고객 문의 (신규)",
                              "CUTT_TYPE_EXPLN": ""
                          },
                          {
                              "CUTT_TYPE_SE_NM": "통합",
                              "DSPTCH_NO": "",
                              "LVL": "3",
                              "CUTT_TYPE_SE_CD": "ITGRT",
                              "CUSTCO_ID": "1",
                              "SORT_ORD": "14",
                              "CUTT_TYPE_NM": "압류",
                              "CUTT_TYPE_ID": "93",
                              "MAX_SORT_ORD": "17",
                              "UP_CUTT_TYPE_ID": "54",
                              "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 압류",
                              "USE_YN": "Y",
                              "CUTT_TYPE_LVL": "3",
                              "RE_SORT_ORD": "14",
                              "children": [],
                              "SORT": "00001 > 00001 > 00014",
                              "name": "압류",
                              "CHILD_CNT": "0",
                              "id": "93",
                              "CUSTCO_DSPTCH_NO_ID": "",
                              "UP_CUTT_TYPE_NM": "고객 문의 (신규)",
                              "CUTT_TYPE_EXPLN": ""
                          },
                          {
                              "CUTT_TYPE_SE_NM": "통합",
                              "DSPTCH_NO": "",
                              "LVL": "3",
                              "CUTT_TYPE_SE_CD": "ITGRT",
                              "CUSTCO_ID": "1",
                              "SORT_ORD": "15",
                              "CUTT_TYPE_NM": "소송비용확정신청",
                              "CUTT_TYPE_ID": "94",
                              "MAX_SORT_ORD": "17",
                              "UP_CUTT_TYPE_ID": "54",
                              "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 소송비용확정신청",
                              "USE_YN": "Y",
                              "CUTT_TYPE_LVL": "3",
                              "RE_SORT_ORD": "15",
                              "children": [],
                              "SORT": "00001 > 00001 > 00015",
                              "name": "소송비용확정신청",
                              "CHILD_CNT": "0",
                              "id": "94",
                              "CUSTCO_DSPTCH_NO_ID": "",
                              "UP_CUTT_TYPE_NM": "고객 문의 (신규)",
                              "CUTT_TYPE_EXPLN": ""
                          },
                          {
                              "CUTT_TYPE_SE_NM": "통합",
                              "DSPTCH_NO": "",
                              "LVL": "3",
                              "CUTT_TYPE_SE_CD": "ITGRT",
                              "CUSTCO_ID": "1",
                              "SORT_ORD": "16",
                              "CUTT_TYPE_NM": "확인불가",
                              "CUTT_TYPE_ID": "95",
                              "MAX_SORT_ORD": "17",
                              "UP_CUTT_TYPE_ID": "54",
                              "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 확인불가",
                              "USE_YN": "Y",
                              "CUTT_TYPE_LVL": "3",
                              "RE_SORT_ORD": "16",
                              "children": [],
                              "SORT": "00001 > 00001 > 00016",
                              "name": "확인불가",
                              "CHILD_CNT": "0",
                              "id": "95",
                              "CUSTCO_DSPTCH_NO_ID": "",
                              "UP_CUTT_TYPE_NM": "고객 문의 (신규)",
                              "CUTT_TYPE_EXPLN": ""
                          },
                          {
                              "CUTT_TYPE_SE_NM": "통합",
                              "DSPTCH_NO": "",
                              "LVL": "3",
                              "CUTT_TYPE_SE_CD": "ITGRT",
                              "CUSTCO_ID": "1",
                              "SORT_ORD": "17",
                              "CUTT_TYPE_NM": "기타",
                              "CUTT_TYPE_ID": "96",
                              "MAX_SORT_ORD": "17",
                              "UP_CUTT_TYPE_ID": "54",
                              "FULL_PATH": "스타법무법인 > 고객 문의 (신규) > 기타",
                              "USE_YN": "Y",
                              "CUTT_TYPE_LVL": "3",
                              "RE_SORT_ORD": "17",
                              "children": [],
                              "SORT": "00001 > 00001 > 00017",
                              "name": "기타",
                              "CHILD_CNT": "0",
                              "id": "96",
                              "CUSTCO_DSPTCH_NO_ID": "",
                              "UP_CUTT_TYPE_NM": "고객 문의 (신규)",
                              "CUTT_TYPE_EXPLN": ""
                          }
                      ],
                      "SORT": "00001 > 00001",
                      "name": "고객 문의 (신규)",
                      "CHILD_CNT": "17",
                      "id": "54",
                      "CUSTCO_DSPTCH_NO_ID": "1",
                      "UP_CUTT_TYPE_NM": "스타법무법인",
                      "CUTT_TYPE_EXPLN": "고객 문의 일 경우"
                  },
                  {
                      "CUTT_TYPE_SE_NM": "통합",
                      "DSPTCH_NO": "07079490063",
                      "LVL": "2",
                      "CUTT_TYPE_SE_CD": "ITGRT",
                      "CUSTCO_ID": "1",
                      "SORT_ORD": "3",
                      "CUTT_TYPE_NM": "사건관련 문의 (기존)",
                      "CUTT_TYPE_ID": "55",
                      "MAX_SORT_ORD": "4",
                      "UP_CUTT_TYPE_ID": "1",
                      "FULL_PATH": "스타법무법인 > 사건관련 문의 (기존)",
                      "USE_YN": "Y",
                      "CUTT_TYPE_LVL": "2",
                      "RE_SORT_ORD": "2",
                      "children": [
                          {
                              "CUTT_TYPE_SE_NM": "통합",
                              "DSPTCH_NO": "",
                              "LVL": "3",
                              "CUTT_TYPE_SE_CD": "ITGRT",
                              "CUSTCO_ID": "1",
                              "SORT_ORD": "1",
                              "CUTT_TYPE_NM": "본인",
                              "CUTT_TYPE_ID": "97",
                              "MAX_SORT_ORD": "4",
                              "UP_CUTT_TYPE_ID": "55",
                              "FULL_PATH": "스타법무법인 > 사건관련 문의 (기존) > 본인",
                              "USE_YN": "Y",
                              "CUTT_TYPE_LVL": "3",
                              "RE_SORT_ORD": "1",
                              "children": [],
                              "SORT": "00001 > 00003 > 00001",
                              "name": "본인",
                              "CHILD_CNT": "0",
                              "id": "97",
                              "CUSTCO_DSPTCH_NO_ID": "",
                              "UP_CUTT_TYPE_NM": "사건관련 문의 (기존)",
                              "CUTT_TYPE_EXPLN": ""
                          },
                          {
                              "CUTT_TYPE_SE_NM": "통합",
                              "DSPTCH_NO": "",
                              "LVL": "3",
                              "CUTT_TYPE_SE_CD": "ITGRT",
                              "CUSTCO_ID": "1",
                              "SORT_ORD": "2",
                              "CUTT_TYPE_NM": "본인 이외 ",
                              "CUTT_TYPE_ID": "100",
                              "MAX_SORT_ORD": "4",
                              "UP_CUTT_TYPE_ID": "55",
                              "FULL_PATH": "스타법무법인 > 사건관련 문의 (기존) > 본인 이외 ",
                              "USE_YN": "Y",
                              "CUTT_TYPE_LVL": "3",
                              "RE_SORT_ORD": "2",
                              "children": [],
                              "SORT": "00001 > 00003 > 00002",
                              "name": "본인 이외 ",
                              "CHILD_CNT": "0",
                              "id": "100",
                              "CUSTCO_DSPTCH_NO_ID": "",
                              "UP_CUTT_TYPE_NM": "사건관련 문의 (기존)",
                              "CUTT_TYPE_EXPLN": ""
                          },
                          {
                              "CUTT_TYPE_SE_NM": "통합",
                              "DSPTCH_NO": "",
                              "LVL": "3",
                              "CUTT_TYPE_SE_CD": "ITGRT",
                              "CUSTCO_ID": "1",
                              "SORT_ORD": "3",
                              "CUTT_TYPE_NM": "채권사",
                              "CUTT_TYPE_ID": "98",
                              "MAX_SORT_ORD": "4",
                              "UP_CUTT_TYPE_ID": "55",
                              "FULL_PATH": "스타법무법인 > 사건관련 문의 (기존) > 채권사",
                              "USE_YN": "Y",
                              "CUTT_TYPE_LVL": "3",
                              "RE_SORT_ORD": "3",
                              "children": [],
                              "SORT": "00001 > 00003 > 00003",
                              "name": "채권사",
                              "CHILD_CNT": "0",
                              "id": "98",
                              "CUSTCO_DSPTCH_NO_ID": "",
                              "UP_CUTT_TYPE_NM": "사건관련 문의 (기존)",
                              "CUTT_TYPE_EXPLN": ""
                          },
                          {
                              "CUTT_TYPE_SE_NM": "통합",
                              "DSPTCH_NO": "",
                              "LVL": "3",
                              "CUTT_TYPE_SE_CD": "ITGRT",
                              "CUSTCO_ID": "1",
                              "SORT_ORD": "4",
                              "CUTT_TYPE_NM": "법원",
                              "CUTT_TYPE_ID": "99",
                              "MAX_SORT_ORD": "4",
                              "UP_CUTT_TYPE_ID": "55",
                              "FULL_PATH": "스타법무법인 > 사건관련 문의 (기존) > 법원",
                              "USE_YN": "Y",
                              "CUTT_TYPE_LVL": "3",
                              "RE_SORT_ORD": "4",
                              "children": [],
                              "SORT": "00001 > 00003 > 00004",
                              "name": "법원",
                              "CHILD_CNT": "0",
                              "id": "99",
                              "CUSTCO_DSPTCH_NO_ID": "",
                              "UP_CUTT_TYPE_NM": "사건관련 문의 (기존)",
                              "CUTT_TYPE_EXPLN": ""
                          }
                      ],
                      "SORT": "00001 > 00003",
                      "name": "사건관련 문의 (기존)",
                      "CHILD_CNT": "4",
                      "id": "55",
                      "CUSTCO_DSPTCH_NO_ID": "1",
                      "UP_CUTT_TYPE_NM": "스타법무법인",
                      "CUTT_TYPE_EXPLN": "기존고객 유입 시, 사용"
                  },
                  {
                      "CUTT_TYPE_SE_NM": "통합",
                      "DSPTCH_NO": "07079490063",
                      "LVL": "2",
                      "CUTT_TYPE_SE_CD": "ITGRT",
                      "CUSTCO_ID": "1",
                      "SORT_ORD": "4",
                      "CUTT_TYPE_NM": "사건번호 문의",
                      "CUTT_TYPE_ID": "56",
                      "MAX_SORT_ORD": "4",
                      "UP_CUTT_TYPE_ID": "1",
                      "FULL_PATH": "스타법무법인 > 사건번호 문의",
                      "USE_YN": "Y",
                      "CUTT_TYPE_LVL": "2",
                      "RE_SORT_ORD": "3",
                      "children": [],
                      "SORT": "00001 > 00004",
                      "name": "사건번호 문의",
                      "CHILD_CNT": "0",
                      "id": "56",
                      "CUSTCO_DSPTCH_NO_ID": "1",
                      "UP_CUTT_TYPE_NM": "스타법무법인",
                      "CUTT_TYPE_EXPLN": "본인/ 채권사에서 문의 시, 사용"
                  },
                  {
                      "CUTT_TYPE_SE_NM": "통합",
                      "DSPTCH_NO": "07079490063",
                      "LVL": "2",
                      "CUTT_TYPE_SE_CD": "ITGRT",
                      "CUSTCO_ID": "1",
                      "SORT_ORD": "33",
                      "CUTT_TYPE_NM": "이외 문의",
                      "CUTT_TYPE_ID": "101",
                      "MAX_SORT_ORD": "4",
                      "UP_CUTT_TYPE_ID": "1",
                      "FULL_PATH": "스타법무법인 > 이외 문의",
                      "USE_YN": "Y",
                      "CUTT_TYPE_LVL": "2",
                      "RE_SORT_ORD": "4",
                      "children": [],
                      "SORT": "00001 > 00033",
                      "name": "이외 문의",
                      "CHILD_CNT": "0",
                      "id": "101",
                      "CUSTCO_DSPTCH_NO_ID": "1",
                      "UP_CUTT_TYPE_NM": "스타법무법인",
                      "CUTT_TYPE_EXPLN": "신규/기존/사건번호 외 문의들"
                  }
              ],
              "SORT": "00001",
              "name": "스타법무법인",
              "CHILD_CNT": "37",
              "id": "1",
              "CUSTCO_DSPTCH_NO_ID": "",
              "UP_CUTT_TYPE_NM": "",
              "CUTT_TYPE_EXPLN": ""
          }
        ],
        flattenedMenu: [],
        cuttTypeIntgeSchVal: '',
        dropCsTemplate: false,
        recentCuttType : [], //최근 사용된 상담 유형
        bmkCuttType : [], //즐겨찾기 상담 유형
        testCsTemplateRecent: [
          { label: '이혼' , active: true},
          { label: '증거보전' , active: true},
          { label: '개인회생채무조회' , active: true},
          { label: '구분불가/개인회생' , active: true},
          { label: '법인회생' , active: true},
        ],
        testCsTemplate: [
          { label: '개인파산' , active: true},
          { label: '개인회생' , active: true},
          { label: '이혼' , active: true},
          { label: '양육권' , active: true},
          { label: '기타' , active: true},
        ],
        lottieFavorite: null,
        bmkCsTemplate: false,
        CUSL_TP_CL_SEQ:0,

        // 시연: 종합복지마스터조회
        page: 1,
        pageCount: 0,
        perPage: [15,30,50,100],
        ROW_PER_PAGE: 15,
        headers: [
          { text: '증권번호', value: 'index', align: 'center', width: '120px', sortable: false },
          { text: '상품명', value: 'type01', align: 'left', width: '170px', sortable: false},
          { text: '가입일자', value: 'type02', align: 'center', width: '100px', sortable: false},
          { text: '구좌', value: 'type03', align: 'center', width: '70px' , sortable: false},
          { text: '부담금(원)', value: 'type04', align: 'right', width: '100px' , sortable: false},
          { text: '계약상대', value: 'type05', align: 'left', width: '100px' , sortable: false},
          { text: '가입자', value: 'type06', align: 'left', width: '100px' , sortable: false},
          { text: '주민등록번호', value: 'type07', align: 'center', width: '130px' , sortable: false},
          { text: '피급여자', value: 'type08', align: 'left', width: '110px' , sortable: false},
        ],
        items: [
            {
              index: '1532-000000',
              type01: '교직원Smile복지공제4.1',
              type02: '2015-01-01',
              type03: '0',
              type04: '0',
              type05: '만기미지급',
              type06: '서울특별시',
              type07: '______-_______',
              type08: '(자녀)',
            },
            {
              index: '1532-000000',
              type01: '교직원Smile복지공제4.1',
              type02: '2014-01-01',
              type03: '0',
              type04: '0',
              type05: '만기미지급',
              type06: '서울특별시',
              type07: '______-_______',
              type08: '(자녀)',
            },
            {
              index: '1532-000000',
              type01: '교직원Smile복지공제3.0',
              type02: '2014-01-01',
              type03: '0',
              type04: '0',
              type05: '만기미지급',
              type06: '서울특별시',
              type07: '______-_______',
              type08: '(자녀)',
            },
            {
              index: '1532-000000',
              type01: '교직원Smile복지공제4.1',
              type02: '2015-01-01',
              type03: '0',
              type04: '0',
              type05: '만기미지급',
              type06: '홍길동',
              type07: '760000-2113121',
              type08: '(자녀)',
            },
            {
              index: '0605-000000',
              type01: '자녀공제1(환급형)',
              type02: '2006-05-08',
              type03: '0',
              type04: '39,040',
              type05: '유지',
              type06: '홍길동',
              type07: '760000-2113121',
              type08: '(자녀)',
            },
            {
              index: '0605-111111',
              type01: '자녀공제1(환급형)',
              type02: '2006-05-09',
              type03: '1',
              type04: '39,040',
              type05: '유지',
              type06: '나한국',
              type07: '760000-1113121',
              type08: '(자녀)',
            },
            {
              index: '0605-222222',
              type01: '종신공제',
              type02: '2006-05-10',
              type03: '2',
              type04: '39,040',
              type05: '유지',
              type06: '나순실',
              type07: '760000-1113121',
              type08: '김주영(본인)',
            },
        ],

        //영상통화
        demoVideoMode: false,
        iframeUrl: '',
        videoFilePath: '',

        vstUseYn: false, //AS 예약 접수 여부
        //예약 접수용 우편번호 찾기
        dialogVstRsvtFindPost : false,
        //예약 접수 선택
        VST_RSVT_IDX : -1,
        VST_RSVT_INFO : null,
        //AS 예약 접수
        VST_RSVT_LIST : [
          {
              CUST_NM: '', //고객명
              REL_CD: 'RT_SELF', //관계
              CUST_TELNO: '', //고객 전화번호
              ZIP: '', //방문 우편번호
              ADDR: '', //방문 주소
              ADDR_DTL: '', //방문 상세 주소
              SRVC_TYPE_CD: 'ST_FIX', //서비스 종류 코드
              UP_PRDCT_TYPE_ID: '', //상위 제품 유형 ID
              PRDCT_TYPE_ID: '', //제품 유형 ID
              VST_RSVT_ID: '', //예약 ID
              RSVT_BGNG_DT: '', //예약 시작 일시
              VSTR_ID: '', //방문자 ID
              VSTR_NM: '', //방문자 명
              DEPT_ID: '', //소속 ID
              DMND_MTTR: '', //문의내용
              EXCPTN_MTTR: '', //특이사항
          },
        ],

        VIDEO_INVITE_SMS_CN : '', //영상통화 초대 SMS 템플릿 내용

        PRDCT_ITEMS : [],
        AS_INFO : [],

        //이관확장속성
        TRNSF_EXPSN_ATTR:[],
        trnsfUseYn: false, //이관 여부
        TRNSF_USER_LIST : [], //이관 대상 목록
        TRGT_USER_ID : '', //이관 대상 ID
      }
    },

  watch: {
    cuttTypeIntgeSchVal(){
      if(!this.cuttTypeIntgeSchVal){
        this.aniFavorite( false );
        this.bmkCsTemplate = false;
      }
    },
    CUST_INFO(){
      //A/S기사배정 기능 사용인 경우 
      if(this.mixin_getCustcoSrvcStat('AS_ALTMNT')){
        this.VST_RSVT_LIST[0].CUST_NM = this.CUST_INFO.CUST_NM;
        this.VST_RSVT_LIST[0].CUST_TELNO = this.mixin_setPhoneNo(this.CUST_INFO.CUST_PHN_NO.replace(/[^0-9]/g, ""));
      }

      //이관 사용인 경우
      if(this.mixin_getCustcoSrvcStat('TRNSF') && this.trnsfUseYn){
        this.trnsfUseYn = false;
      }
    }
  },

  computed: {
    computedTagSize() {
      return `flex: 0 0 ${ this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].inputTagSize + 12 }ch;`;
    },
    computedCsHeight() {
      const { stt_switch } = this;
      let calHeight;
      if( this.mixin_getCustcoSetting('ENV_TMPL_TP') !== 'DEFAULT' ) {
        calHeight = stt_switch ? 'calc(100vh - 676px)' : 'calc(100vh - 316px)'
      }
      else  {
        calHeight = stt_switch ? 'calc(100vh - 655px)' : 'calc(100vh - 280px)'
      }
      return {
        height: calHeight
      }
    },
    computedResizeClass() {
      return this.resizeClass === true ? 'pl-icon20 resize-on' : 'pl-icon20 resize-off'
    },
    computedResizeText() {
      return this.resizeClass === true ? '축소' : '확대'
    },
    computedResizeClassCs() {
      return this.cusArea_resizeClass === true ? 'pl-icon20 resize-on' : 'pl-icon20 resize-off'
    },
    computedResizeTextCs() {
      return this.cusArea_resizeClass === true ? '축소' : '확대'
    },
  },

  beforeDestroy(){
    this.$eventBus.$off("selCompanyAction"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("busCustInfoSrch"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("busCuttEnd"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("cuttReSet"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("busRingingCustInfoSrch"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("cuttForcingReSet"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("busForceEnd"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setCtiBtnStat"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setCuslStat"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("reSetCuttTime"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("parentSetRecFileInfo"); //eventBus 중복방지를 위해 off
    // this.$eventBus.$off("dialogAssignManager"); //eventBus 중복방지를 위해 off
    // this.$eventBus.$off("closeAssignManager"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setVstData"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("videoCall"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("rsvtVideoCall"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setOtherCustcoCuslInfo"); //eventBus 중복방지를 위해 off
  },

  async created() {

    eventBus.getCtiBtnStat('getCtiBtnStat'); //CTI 버튼 상태 가져오기

    this.$eventBus.$on("setCtiBtnStat", (CTI_STAT) => {
      this.CTI_STAT = CTI_STAT;
      console.log('this.CTI_STAT : ', this.CTI_STAT);
    });
    
    this.$eventBus.$on("videoCall", (AS_INFO) => {
      this.AS_INFO = AS_INFO;
      this.FnDemoVideoMode('AS');
      console.log('this.AS_INFO : ', AS_INFO);
    });
    
    this.$eventBus.$on("rsvtVideoCall", () => {
      this.FnDemoVideoMode('');
    });

    // eventBus.getCtiBtnStat('getCuslStat'); //상담원 상태 가져오기

    this.$eventBus.$on("setCuslStat", (CUSL_STAT) => {
      this.CUSL_STAT = CUSL_STAT;
      console.log('this.CUSL_STAT : ', this.CUSL_STAT);
      if(this.CUSL_STAT === '대기'){
        this.forcCuttCreateFrom(false);
      }

    });

    this.$eventBus.$on("reSetCuttTime", (CTI_STAT) => {
      this.reSetCuttTime();
    });

    //상단 고객사 선택시 eventBus 실행(각 페이지별 필요에 의한 내용 구현)
    this.$eventBus.$on("selCompanyAction", (SELECTED_COMPANY) => {
    });

    //Top에서 전달한 콜 이력 찾기 data
    this.$eventBus.$on("parentSetRecFileInfo", (REC_FILE_INFO) => {
      this.REC_FILE_NM = REC_FILE_INFO.rec_file_name;
      this.FORCE_CUTT_BGNG_DT = REC_FILE_INFO.cuttStTime.split(' ')[0];
      this.FORCE_CUTT_BGNG_TIME = REC_FILE_INFO.cuttStTime.split(' ').length > 1?REC_FILE_INFO.cuttStTime.split(' ')[1]:'00:00:00';
      this.FORCE_CUTT_END_DT = REC_FILE_INFO.cuttEndTime.split(' ')[0];
      this.FORCE_CUTT_END_TIME = REC_FILE_INFO.cuttEndTime.split(' ').length > 1?REC_FILE_INFO.cuttEndTime.split(' ')[1]:'00:00:01';
      this.CL_TYPE_CD = REC_FILE_INFO.divinout === '발신'?'OUT':'IN';
    });

    this.getExpsnAttrList(); //확장 속성
    this.getCuttTypeList();//상담 유형

    this.$eventBus.$on("busRingingCustInfoSrch", (CALL_DATA) => {
      // console.log('CALL_DATA : ', CALL_DATA);
      this.CL_TYPE_CD = CALL_DATA.CL_TYPE_CD;
      this.CUST_INFO.ADD_CUST = CALL_DATA.ADD_CUST;
      this.getCustDefaultInfo(CALL_DATA.CL_TYPE_CD, CALL_DATA.CUST_ID, CALL_DATA.CUST_PHN_NO, CALL_DATA.ADD_CUST);

      if(!this.mixin_isEmpty(CALL_DATA.CUST_ID)){
        this.CUST_INFO.CUST_ID = CALL_DATA.CUST_ID;
      }

      if(!this.mixin_isEmpty(CALL_DATA.STT_OFF)){
        this.stt_switch = false;
        this.sttStatChange(CALL_DATA.STT_OFF);
      }
    });

    //고객정보 검색(전화 받기)
    this.$eventBus.$on("busCustInfoSrch", (CALL_DATA) => {
      // console.log('CALL_DATA : ', CALL_DATA);
      this.DSPTCH_NO = CALL_DATA.inNum; //대표 번호
      if(CALL_DATA.CUST_PHN_NO){
        this.CL_TYPE_CD = CALL_DATA.CL_TYPE_CD;
        this.getCustDefaultInfo(CALL_DATA.CL_TYPE_CD, CALL_DATA.CUST_ID, CALL_DATA.CUST_PHN_NO, false);

        //IVR
        if(CALL_DATA.desc){
          this.DRWI_SE_NM = CALL_DATA.desc;
        }

        //녹취 파일명
        if(CALL_DATA.recFileNm){
          this.REC_FILE_NM = CALL_DATA.recFileNm;
          this.setCuttStDts(); //상담 시작 일시 셋팅
        }

        //예약 콜 ID
        if(CALL_DATA.CUTT_RSVT_ID){
          this.CUTT_RSVT_ID = CALL_DATA.CUTT_RSVT_ID;
          //기존 전화 상담 내역이 존재하는 경우(예약콜)
          if(CALL_DATA.PHN_CUTT_ID){
            this.PHN_CUTT_ID = CALL_DATA.PHN_CUTT_ID;
            this.getExpsnAttrList(); //전화 상담 ID가 있는 경우 기존 확장속성 정보 조회
          }
        }

        //캠페인 ID
        if(CALL_DATA.CPI_ID){
          this.CPI_ID = CALL_DATA.CPI_ID;

          //캠페인 전화걸기일때 시도횟수 체크
          this.CPI_CNT = (parseInt(CALL_DATA.LMT_CNT) - 1) == CALL_DATA.TRY_CNT ? true : false;

          this.getExpsnAttrList(); //캠페인 ID가 있는 경우 기존 확장속성 정보 조회
        }

        //콜백 ID
        if(CALL_DATA.CLBK_ID){
          this.CLBK_ID = CALL_DATA.CLBK_ID;
          this.getExpsnAttrList(); //캠페인 ID가 있는 경우 기존 확장속성 정보 조회
        }

        //상담예약 ID
        if(CALL_DATA.RSVT_ID){
          this.RSVT_ID = CALL_DATA.RSVT_ID;
          this.getExpsnAttrList(); //캠페인 ID가 있는 경우 기존 확장속성 정보 조회
        }
      }

    });

    //상담 전 전화 끊기(고객 또는 상담사)
    this.$eventBus.$on("busForceEnd", (CALL_DATA) => {
      this.cuttReset();
    });

    //상담 후 전화 끊기(고객 또는 상담사)
    this.$eventBus.$on("busCuttEnd", (CALL_DATA) => {
      //호전환 여부 판단 필요할 경우 이곳에서 처리
      this.setCuttEndDts(); //상담 종료 일시 셋팅
    });

    //호전환 완료후 상담 메인 초기화
    this.$eventBus.$on("cuttReSet", () => {
      this.setCuttEndDts(); //상담 종료 일시 셋팅
    });

    //강제 초기화
    this.$eventBus.$on("cuttForcingReSet", () => {
      this.phnCuttFormReset(); //상담내용 등록 폼 초기화
      this.custReset(); //고객정보 초기화
    });

    eventBus.setCustInfo(this.CUST_INFO);

    //A/S기사배정 기능 사용인 경우 
    if(this.mixin_getCustcoSrvcStat('AS_ALTMNT')){
      this.getPrdctTypeList(); //제품 유형 목록
    }

    this.$eventBus.$on("setVstData", (VST_RSVT_INFO) => {
      this.setVstData(VST_RSVT_INFO);
    });
  },

  async mounted() {
    let tabs = this.$store.getters["commonStore/GE_COMMON_TAB"];
    if(tabs.length > 0){
      for(let tab of tabs){
        if(tab.id === 'CSL_M0100') { //전화상담
          if(tab.AUTO_CARRY_OUT) this.$eventBus.$emit("busCustInfoSrch", tab.AUTO_CARRY_OUT);
        }
      }
    }

    eventBus.getCtiBtnStat('getCtiBtnStat'); //CTI 버튼 상태 가져오기
    eventBus.getCuslStat('getCuslStat'); //상담원 상태 가져오기

    window.addEventListener('message', (event) => {
      //웹소켓 disconnect
      this.receiveMsgFromChild(event);
    });
  },

  methods: {

    //*************************************
    //        위치정보, 연락처정보 전송
    //*************************************
    // 보내기 버튼
    async sendInfoBtn(){
      // 컴포넌트로 파라미터 전달하여 발송 함수 실행
      eventBus.setSendInfoParm(this.DATA_TYPE_PROP, this.CUST_INFO);
    },

    // 위치,연락처 팝업 오픈
    sendingBtn(type){
      this.checkPopType(type);        // 위치, 연락처 구분
      this.ItemsSendData = [];        // 그리드리스트 초기화
      this.selectedSendItem = [];     // 체크박스 초기화
      this.forceRerender();           // component 렌더링
      this.mixin_showDialog('PlaceContactsFind');
    },

    // 팝업창 오픈시 유형 체크
    checkPopType(type) {

      switch (type) {
        case 'place':
          this.HEADER_TITLE = "위치 정보 보내기";
          this.DATA_TYPE_PROP = 'place';
          break;

        case 'contacts':
          this.HEADER_TITLE = "연락처 정보 보내기";
          this.DATA_TYPE_PROP = 'contacts';
          break;

        default:
          break;
      }
    },

    // 위치정보, 연락처정보 component 렌더링
    forceRerender() {
      this.COMPONENT_KEY += 1;
    },


    // 고객핵심정보
    toggleResize() {
      this.cus_key_resizeClass = !this.cus_key_resizeClass;
    },
    toggleResizeCs() {
      this.cusArea_resizeClass = !this.cusArea_resizeClass;
    },

    // 상담 form
    displayStatus(stat) {
      const statList = [
        { stat_list_text: '상담중', stat_list_status: 'error' },
        { stat_list_text: '상담대기', stat_list_status: 'main' },
      ];

      for (let i = 0; i < statList.length; i++) {
        if (statList[i].stat_list_status === stat) {
          return statList[i].stat_list_text;
        }
      }
    },
    // 예약콜
    async toggleChkReserve(seq, event) {
      this.SELECTED_ATTR_INDEX = seq;
      this.posX = event.clientX + 10;
      this.posY = event.clientY - 150;

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

    // VOC 저장
    saveVocData() {
      this.$refs.vocDataCompo.saveVocData();
    },

    //확장 속성 정보 리로드
    reloadExpsnAttr(){
      this.PHN_CUTT_ID = '';
      this.getExpsnAttrList();
    },

    //확장 속성 정보 가져오기
    async getExpsnAttrList() {
      // console.log('this.PHN_CUTT_ID : ', this.PHN_CUTT_ID);
      let sUrl = '/api/setting/expsnAttr/expsnAttrList';
      let postParam = {
        SE : 'CONSEL' //상담내용 확장항목
        , BSC_PVSN_ATTR_YN : "N" //기본 제공 속성이 아닌것
        , USE_YN : 'Y' //확장속성 사용인 경우만
        , PHN_CUTT_ID : this.PHN_CUTT_ID //전화 상담 ID
      }

      let headParam = {
        head : {
          ROW_CNT : 500,
          PAGES_CNT : 1,
          PAGING : "Y",
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        //상담유형 정보
        if(response.CUTT_TYPE_SETTING){
          this.ITGRT_USE_YN = response.CUTT_TYPE_SETTING[0].ITGRT_USE_YN;
          this.CUTT_TYPE_LMT_LVL_CD = response.CUTT_TYPE_SETTING[0].CUTT_TYPE_LMT_LVL_CD;
          this.STT_USE_YN = response.CUTT_TYPE_SETTING[0].STT_USE_YN;
        }

        let expsnAttrData = [];
        for(let i in response.DATA){
          if(response.DATA[i].EXPSN_ATTR_COL_ID === 'CAMP_RS'){ //처리 결과인 경우 캠페인 id 또는 콜백 id가 있을 경우에만 노출 처리
            if(this.CPI_ID || this.CLBK_ID) expsnAttrData.push(response.DATA[i]);
          } else if(response.DATA[i].EXPSN_ATTR_COL_ID === 'RSVT_RS'){ //예약처리결과인 경우 상담예약ID가 있을경우에만 노출
            if(this.RSVT_ID) expsnAttrData.push(response.DATA[i]);
          }else{
            if(response.DATA[i].EXPSN_ATTR_COL_ID === 'CUSL_TP_CL') this.CUSL_TP_CL_SEQ = i;
            expsnAttrData.push(response.DATA[i]);
          }
        }

        let codeName = ['CALL_TP', 'CHNL', 'REL_TP', 'SRVC_TP']; //콜 유형과, 채널 공통코드
        if(expsnAttrData.length > 0){
          expsnAttrData.forEach((attr, idx) => {
            if(attr.DATA_TYPE_CD === 'COE' || attr.DATA_TYPE_CD === 'COE_MULTI'){
              if(attr.GROUP_CD_ID) codeName.push(attr.GROUP_CD_ID); //공통코드사용을 위해
            }
          });
        }

        //공통코드설정
        this.common_code = await this.mixin_common_code_get_all(codeName);

        for(let i in expsnAttrData){

          if(expsnAttrData[i].PHN_CUTT_ID) expsnAttrData[i].V_MODEL = expsnAttrData[i].ATTR_VL; //동적 v_model 생성
          else expsnAttrData[i].V_MODEL = ''; //동적 v_model 생성

          if(expsnAttrData[i].DATA_TYPE_CD === 'TXT'){//문자형인 경우
            if(expsnAttrData[i].PHN_CUTT_ID) expsnAttrData[i].V_MODEL = this.mixin_decode(expsnAttrData[i].ATTR_VL); //decode
          }else if(expsnAttrData[i].DATA_TYPE_CD === 'DAT'){//날짜형인 경우
            if(expsnAttrData[i].PHN_CUTT_ID){
              expsnAttrData[i].V_MODEL = (expsnAttrData[i].ATTR_VL?true:false); //chkDateReserve
              expsnAttrData[i].V_MODEL_DATE = (expsnAttrData[i].ATTR_VL?expsnAttrData[i].ATTR_VL:''); //날짜 v_model
              expsnAttrData[i].chkDateReserve = false; //chkDateReserve
              expsnAttrData[i].dateReservePicker = (expsnAttrData[i].ATTR_VL?true:false); //dateReservePicker
              expsnAttrData[i].dropDateReserve = false; //dropDateReserve
              expsnAttrData[i].dateTimeDate = (expsnAttrData[i].ATTR_VL?await this.mixin_convertDate(expsnAttrData[i].ATTR_VL, 'yyyy-MM-dd'):(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)); //dateTimeDate
              expsnAttrData[i].dateTimeTime = new Date(); //dateTimeTime
              expsnAttrData[i].selectedTime = (expsnAttrData[i].ATTR_VL?await this.mixin_convertDate(expsnAttrData[i].ATTR_VL, 'HH:mm'):''); //selectedTime
              expsnAttrData[i].selectedAmpm = ''; //selectedAmpm
            }else{
              expsnAttrData[i].V_MODEL = false; //chkDateReserve
              expsnAttrData[i].V_MODEL_DATE = ''; //날짜 v_model
              expsnAttrData[i].chkDateReserve = false; //chkDateReserve
              expsnAttrData[i].dateReservePicker = false; //dateReservePicker
              expsnAttrData[i].dropDateReserve = false; //dropDateReserve
              expsnAttrData[i].dateTimeDate = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); //dateTimeDate
              expsnAttrData[i].dateTimeTime = new Date(); //dateTimeTime
              expsnAttrData[i].selectedTime = ''; //selectedTime
              expsnAttrData[i].selectedAmpm = ''; //selectedAmpm
            }
          }else if(expsnAttrData[i].DATA_TYPE_CD === 'POST'){ //우편번호인 경우
            if(expsnAttrData[i].PHN_CUTT_ID){
              expsnAttrData[i].V_MODEL_DTL = []; //주소 v_model
              if(expsnAttrData[i].ATTR_VL){
                for(let h in expsnAttrData[i].ATTR_VL.split('|')){
                  if(h == 0) expsnAttrData[i].V_MODEL = expsnAttrData[i].ATTR_VL.split('|')[0]
                  else if(h == 1) expsnAttrData[i].V_MODEL_DTL[0] = expsnAttrData[i].ATTR_VL.split('|')[1]
                  else if(h == 2) expsnAttrData[i].V_MODEL_DTL[1] = expsnAttrData[i].ATTR_VL.split('|')[2]
                }
              }
            }else{
              expsnAttrData[i].V_MODEL_DTL = []; //주소 v_model
            }
          }else if(expsnAttrData[i].DATA_TYPE_CD === 'COE'){ //단일 선택인 경우
            // if(expsnAttrData[i].GROUP_CD_ID) codeName.push(expsnAttrData[i].GROUP_CD_ID); //공통코드사용을 위해 그룹코드가 있는 경우만
            // else if(expsnAttrData[i].EXPSN_ATTR_COL_ID === 'CUSL_TP_CL'){
            if(expsnAttrData[i].EXPSN_ATTR_COL_ID === 'CUSL_TP_CL'){
              expsnAttrData[i].V_MODEL = [];
              if(expsnAttrData[i].PHN_CUTT_ID){
                if(expsnAttrData[i].ATTR_VL){
                  if(this.CUTT_TYPE_LMT_LVL_CD){
                    let tmpCuttType = '';
                    for(let k=0; k<this.CUTT_TYPE_LMT_LVL_CD; k++){
                      expsnAttrData[i].V_MODEL[k] = expsnAttrData[i].ATTR_VL.split(',')[k+1];
                      tmpCuttType += (tmpCuttType?',':'') + expsnAttrData[i].ATTR_VL.split(',')[k+1];
                    }

                    this.cuttTypeIntgeSchVal = tmpCuttType;
                    this.changeCuttTypeSch(i);
                  }
                }else{
                  if(this.CUTT_TYPE_LMT_LVL_CD){
                    for(let k=0; k<this.CUTT_TYPE_LMT_LVL_CD; k++){
                      expsnAttrData[i].V_MODEL[k] = '';
                    }
                  }
                }
              }else{
                if(this.CUTT_TYPE_LMT_LVL_CD){
                  for(let k=0; k<this.CUTT_TYPE_LMT_LVL_CD; k++){
                    expsnAttrData[i].V_MODEL[k] = '';
                  }
                }
              }
            }
          }else if(expsnAttrData[i].DATA_TYPE_CD === 'COE_MULTI'){ //다중 선택인 경우
            expsnAttrData[i].V_MODEL = [];
            // codeName.push(expsnAttrData[i].GROUP_CD_ID); //공통코드사용을 위해

            let items = this.mixin_common_code_get(this.common_code, expsnAttrData[i].GROUP_CD_ID);
            let cdNms = '';
            if(expsnAttrData[i].ATTR_VL){
              items.forEach((code, idx) => {
                expsnAttrData[i].ATTR_VL.split(',').forEach((data, seq) => {
                  if(code.value === data){
                    expsnAttrData[i].V_MODEL.push(code);
                    cdNms += (cdNms?',':'')+code.text;
                  }
                });
              });
            }
            expsnAttrData[i].CD_NM = cdNms;
          }else if(expsnAttrData[i].DATA_TYPE_CD === 'HASH'){ //해시태그인 경우
            if(expsnAttrData[i].PHN_CUTT_ID){
              if(expsnAttrData[i].ATTR_VL){
                expsnAttrData[i].tags = [];
                for(let p in expsnAttrData[i].ATTR_VL.split(',')){
                  expsnAttrData[i].tags.push({ text: expsnAttrData[i].ATTR_VL.split(',')[p], active: true });
                }
                expsnAttrData[i].inputTagSize = '';
                expsnAttrData[i].V_MODEL = '';
              }else{
                expsnAttrData[i].tags = [];
                expsnAttrData[i].inputTagSize = '';
              }
            }else{
              expsnAttrData[i].tags = [];
              expsnAttrData[i].inputTagSize = '';
            }
          }

          //캠페인 전화걸기일때 시도횟수가 마지막일 경우 무조건 처리결과 완료
          if(this.CPI_CNT && expsnAttrData[i].GROUP_CD_ID == 'CUSL_RS'){
            expsnAttrData[i].V_MODEL = 'COMPLETED';
          }
        }

        //공통코드설정
        // this.common_code = await this.mixin_common_code_get_all(codeName);
        this.EXPSN_ATTR = expsnAttrData;

        this.getCuslCuttTypeBmk(this.CUSL_TP_CL_SEQ);
        this.closeMsg();
      }
    },

    //고객 기본정보 조회(전화 받기)
    async getCustDefaultInfo(clTypeCd, custId, custPhnNo, addCust) {
      if(!this.CUTT_RSVT_ID){ //전화 상담 예약이 아닌 경우에만 초기화
        this.CALL_ING = false; //상담 종료
        this.forcCuttAble = false; //강제 생성 아님
        this.phnCuttFormReset(); //상담 폼 초기화
        this.reSetCuttTime(); //상담 시간 초기화
      }

      if(custId === -1){
        this.CUST_INFO = {
          CUST_ID : -1
          , CUST_PHN_NO : ''
          , CUST_NM : '성명미상'
          , CHNL : 'TEL'
          , ADD_CUST : addCust
          , portrait : require('@/assets/img/@profile_customer.png')
        }
      }else{
        let sUrl = '/api/setting/customer/custDefaultInfo';
        let postParam = {
          CHNL : 'TEL'
          , CL_TYPE_CD : clTypeCd
          , CUST_ID : custId
          , CUST_PHN_NO : custPhnNo.replace(/[^0-9]/g, "")
        }

        let headParam = {
          head : {
          }
        }

        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          // if(custId > -1){
          if(response.DATA.length > 0){
            response.DATA[0].CUST_ID = Number(response.DATA[0].CUST_ID);
            response.DATA[0].CUST_NM = response.DATA[0].CUST_NM?response.DATA[0].CUST_NM:'성명미상';
            this.CUST_INFO = response.DATA[0];
            this.CUST_INFO.ADD_CUST = addCust;
            this.CUST_INFO.CHNL = postParam.CHNL;
            this.CUST_INFO.portrait = require('@/assets/img/@profile_customer.png');
          }else{
            this.CUST_INFO = {
              CUST_ID : -1
              , CUST_PHN_NO : ''
              , CUST_NM : '성명미상'
              , CHNL : postParam.CHNL
              , ADD_CUST : addCust
              , portrait : require('@/assets/img/@profile_customer.png')
            }
          }
        }

        eventBus.setCustInfo(this.CUST_INFO); //오른쪽 메뉴에 고객 정보 셋팅
      }
    },

    //상담유형 목록 조회
    async getCuttTypeList() {
      let sUrl = '/api/setting/cuttType/cuttTypeTreeList';
      let postParam = {
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.CUTT_ITEMS = response.DATA;

        this.cuttTypeIntgeSchData(response.CUTT_TYPE_TREE); //상담 유형 검색 데이터 Set

        this.getChildCuttTypeItems(this.CUSL_TP_CL_SEQ, 0, ''); //상담 유형 첫번째 콤보
      }
    },

    //상담유형 하위 item 가져오기
    getChildCuttTypeItems(seq, idx, parentItem) {
      let arrCuttType = [];
      let DSPTCH_NO = this.DSPTCH_NO;

      if(idx === 0){
        if(this.CUTT_ITEMS.length > 0){
          parentItem = this.CUTT_ITEMS[0].CUTT_TYPE_ID;
          this.CUTT_ITEMS.map(function(row){
            if(row.UP_CUTT_TYPE_ID === parentItem){
              // if(DSPTCH_NO){
              //   if(row.DSPTCH_NO === DSPTCH_NO) arrCuttType.push(row);
              // }else{
                if(row) arrCuttType.push(row);
              // }
            }
          });
        }
      }else{
        if(parentItem){
          this.CUTT_ITEMS.map(function(row){
            if(row.UP_CUTT_TYPE_ID === parentItem)
              if(row) arrCuttType.push(row);
          });
        }
      }

      return arrCuttType || [];
    },

    //상담유형 검색 데이터 변경 이벤트
    changeCuttTypeSch(seq){
      for(let k=0; k<this.EXPSN_ATTR[seq].V_MODEL.length; k++){
        this.EXPSN_ATTR[seq].V_MODEL[k] = '';//초기화
      }

      if(this.cuttTypeIntgeSchVal){
        this.cuttTypeIntgeSchVal.split(',').forEach((cuttType, idx) => {
          for(let k=0; k<this.EXPSN_ATTR[seq].V_MODEL.length; k++){
            if(k === idx) this.EXPSN_ATTR[seq].V_MODEL[k] = cuttType;
          }
        });

        let iCnt = 0;
        this.bmkCuttType.forEach((cuttType, idx) => {
          if(cuttType.value === this.cuttTypeIntgeSchVal) iCnt ++;
        });

        if(iCnt > 0){
          this.aniFavorite( true );
          this.bmkCsTemplate = true;
        }else{
          this.aniFavorite( false );
          this.bmkCsTemplate = false;
        }
      }else{
        this.aniFavorite( false );
        this.bmkCsTemplate = false;
      }
    },

    //상담유형 변경 이벤트
    changeCuttTypeItems(seq, idx){
      let selCuttType = '';
      for(let k=0; k<this.EXPSN_ATTR[seq].V_MODEL.length; k++){
        if(k > idx) this.EXPSN_ATTR[seq].V_MODEL[k] = '';//초기화

        if(this.EXPSN_ATTR[seq].V_MODEL[k]) selCuttType += (selCuttType?',':'') + this.EXPSN_ATTR[seq].V_MODEL[k]
      }

      this.cuttTypeIntgeSchVal = selCuttType;

      let iCnt = 0;
      this.bmkCuttType.forEach((cuttType, idx) => {
        if(cuttType.value === this.cuttTypeIntgeSchVal) iCnt ++;
      });

      if(iCnt > 0){
        this.aniFavorite( true );
        this.bmkCsTemplate = true;
      }else{
        this.aniFavorite( false );
        this.bmkCsTemplate = false;
      }
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

      //예약 콜 ID
      if(!this.PHN_CUTT_ID){
        this.cuttTypeIntgeSchVal = '';
        this.bmkCsTemplate = false;
      }

    },

    //전화 상담 Form 초기화
    phnCuttFormReset(){
      this.reSetCuttTime(); //상담 시간 초기화

      this.REC_FILE_NM = ''; //녹취 파일명 초기화
      // if(this.CUST_INFO.CUST_ID === -1) this.CL_TYPE_CD = 'IN'; //상담 채널

      let expsnAttrData = this.EXPSN_ATTR;
      for(let i in expsnAttrData){
        expsnAttrData[i].V_MODEL = ''; //동적 v_model 초기화
        if(expsnAttrData[i].DATA_TYPE_CD === 'DAT'){//날짜형인 경우
          expsnAttrData[i].V_MODEL = false; //chkDateReserve
          expsnAttrData[i].V_MODEL_DATE = ''; //날짜 v_model
          expsnAttrData[i].chkDateReserve = false; //chkDateReserve
          expsnAttrData[i].dateReservePicker = false; //dateReservePicker
          expsnAttrData[i].dropDateReserve = false; //dropDateReserve
          expsnAttrData[i].dateTimeDate = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); //dateTimeDate
          expsnAttrData[i].dateTimeTime = new Date(); //dateTimeTime
          expsnAttrData[i].selectedTime = ''; //selectedTime
          expsnAttrData[i].selectedAmpm = ''; //selectedAmpm
        }else if(expsnAttrData[i].DATA_TYPE_CD === 'POST'){ //우편번호인 경우
          expsnAttrData[i].V_MODEL_DTL = []; //주소 v_model
        }else if(expsnAttrData[i].DATA_TYPE_CD === 'COE'){ //단일 선택인 경우
          if(expsnAttrData[i].EXPSN_ATTR_COL_ID === 'CUSL_TP_CL'){
            expsnAttrData[i].V_MODEL = [];
            if(this.CUTT_TYPE_LMT_LVL_CD){
              for(let k=0; k<this.CUTT_TYPE_LMT_LVL_CD; k++){
                expsnAttrData[i].V_MODEL[k] = '';
              }
            }
          }
        }else if(expsnAttrData[i].DATA_TYPE_CD === 'COE_MULTI'){ //다중 선택인 경우
          expsnAttrData[i].V_MODEL = [];
        }else if(expsnAttrData[i].DATA_TYPE_CD === 'HASH'){ //해시태그인 경우
          expsnAttrData[i].tags = [];
          expsnAttrData[i].inputTagSize = '';
        }
      }

      this.DRWI_SE_NM = ''; //IVR 명
      this.CPLMT_CL_YN = 'N'; //칭찬콜 여부 초기화
      this.AUTO_CL_YN = 'N'; //오토콜 여부 초기화

      this.cuttTypeIntgeSchVal = ''; //상담유형 검색 초기화

      this.aniFavorite( false ); //즐겨찾기 애니메이션 초기화
      this.bmkCsTemplate = false; //즐겨찾기 초기화

      this.closeMsg(); //confirm 창 닫기
    },

    //상담내용 저장 validate
    phoneCuttSaveValidate(){

      if(this.$store.getters["statusStore/GE_CUST_MODIFY_ING"]){
        this.showAlert({alertDialogToggle: true, msg: '고객 정보 저장 후 상담 내용을 저장해 주시기 바랍니다.', iconClass: 'is-caution', type: 'default'});
        return;
      }

      if(this.forcCuttAble){
        if(!this.FORCE_CUTT_BGNG_DT || !this.FORCE_CUTT_END_DT){
          this.showAlert({alertDialogToggle: true, msg: '상담 시간 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
          return;
        }else{
          // this.CUTT_BGNG_DT = this.FORCE_CUTT_BGNG_DT.replace(/-/gi, '') + this.FORCE_CUTT_BGNG_TIME.replace(/:/gi, '')+(this.FORCE_CUTT_BGNG_TIME.split(':').length > 1?'':'00');
          // this.CUTT_END_DT = this.FORCE_CUTT_END_DT.replace(/-/gi, '') + this.FORCE_CUTT_END_TIME.replace(/:/gi, '')+(this.FORCE_CUTT_END_TIME.split(':').length > 1?'':'00');
          let CUTT_BGNG_DT = this.FORCE_CUTT_BGNG_DT.replace(/-/gi, '') + this.FORCE_CUTT_BGNG_TIME.replace(/:/gi, '')+(this.FORCE_CUTT_BGNG_TIME.split(':').length > 1?'':'00');
          let CUTT_END_DT = this.FORCE_CUTT_END_DT.replace(/-/gi, '') + this.FORCE_CUTT_END_TIME.replace(/:/gi, '')+(this.FORCE_CUTT_END_TIME.split(':').length > 1?'':'00');

          if(CUTT_END_DT <= CUTT_BGNG_DT){
            this.showAlert({alertDialogToggle: true, msg: '상담 종료 시간이 상담 시작 시간 보다 작거나 같을 수 없습니다.', iconClass: 'is-caution', type: 'default'});
            return;
          }
        }

        if(!this.CL_TYPE_CD){
          this.showAlert({alertDialogToggle: true, msg: '상담채널을 선택해 주세요.', iconClass: 'is-caution', type: 'default'});
          return;
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
            if(!this.EXPSN_ATTR[i].V_MODEL){
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

      let sRsvtCall = false;
      let sCuslRs = '';
      this.EXPSN_ATTR.forEach((attr, idx) => {
        if(attr.EXPSN_ATTR_COL_ID === 'RSVT_CALL'){
          sRsvtCall = attr.V_MODEL;
        }

        if(attr.EXPSN_ATTR_COL_ID === 'CUSL_RS'){
          sCuslRs = attr.V_MODEL;
        }
      });

      if(sRsvtCall){
        if(sCuslRs === 'COMPLETED'){
          this.showAlert({alertDialogToggle: true, msg: '예약콜을 접수하신 경우 상담 결과는 <font color="red">처리중</font> 상태로 변경해 주시기 바랍니다.', iconClass: 'is-caution', type: 'default'});
          return;
        }
      }

      //AS 방문 예약 사용인 경우
      if(this.mixin_getCustcoSrvcStat('AS_ALTMNT') && this.vstUseYn){
        for(let i in this.VST_RSVT_LIST){
          if(!this.VST_RSVT_LIST[i].CUST_NM){
            this.showAlert({alertDialogToggle: true, msg: (this.VST_RSVT_LIST.length > 1 ? (Number(i)+1) + '번째 AS 예약 접수의 ' : '') + '고객명을 입력해 주세요.', iconClass: 'is-caution', type: 'default'});
            return;
          }

          if(!this.VST_RSVT_LIST[i].CUST_TELNO){
            this.showAlert({alertDialogToggle: true, msg: (this.VST_RSVT_LIST.length > 1 ? (Number(i)+1) + '번째 AS 예약 접수의 ' : '') + '전화번호를 입력해 주세요.', iconClass: 'is-caution', type: 'default'});
            return;
          }

          if(!this.VST_RSVT_LIST[i].ZIP){
            this.showAlert({alertDialogToggle: true, msg: (this.VST_RSVT_LIST.length > 1 ? (Number(i)+1) + '번째 AS 예약 접수의 ' : '') + '주소를 입력해 주세요.', iconClass: 'is-caution', type: 'default'});
            return;
          }

          if(!this.VST_RSVT_LIST[i].ADDR_DTL){
            this.showAlert({alertDialogToggle: true, msg: (this.VST_RSVT_LIST.length > 1 ? (Number(i)+1) + '번째 AS 예약 접수의 ' : '') + '상세 주소를 입력해 주세요.', iconClass: 'is-caution', type: 'default'});
            return;
          }

          if(!this.VST_RSVT_LIST[i].RSVT_BGNG_DT){
            this.showAlert({alertDialogToggle: true, msg: (this.VST_RSVT_LIST.length > 1 ? (Number(i)+1) + '번째 AS 예약 접수의 ' : '') + '예약 일시를 선택해 주세요.', iconClass: 'is-caution', type: 'default'});
            return;
          }

          if(!this.VST_RSVT_LIST[i].VSTR_ID){
            this.showAlert({alertDialogToggle: true, msg: (this.VST_RSVT_LIST.length > 1 ? (Number(i)+1) + '번째 AS 예약 접수의 ' : '') + 'AS 기사를 배정해 주세요.', iconClass: 'is-caution', type: 'default'});
            return;
          }
        }
      }

      //이관 사용인 경우
      if(this.mixin_getCustcoSrvcStat('TRNSF') && this.trnsfUseYn){

        for(let i in this.TRNSF_EXPSN_ATTR){
          if(this.TRNSF_EXPSN_ATTR[i].ESNTL_YN === 'Y'){ //필수 입력인 경우
            if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'TXT'){ //문자형
              if(!this.TRNSF_EXPSN_ATTR[i].V_MODEL){
                this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                return;
              }else{
                if(this.TRNSF_EXPSN_ATTR[i].V_MODEL.length > this.TRNSF_EXPSN_ATTR[i].DATA_LEN){
                  this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 0 ~ '+this.TRNSF_EXPSN_ATTR[i].DATA_LEN+'byte 이내로 입력해 주세요.', iconClass: 'is-caution', type: 'default'});
                  return;
                }
              }
            }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'NUM' || this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'NUM_COMMA'){ //숫자형
              if(!this.TRNSF_EXPSN_ATTR[i].V_MODEL){
                this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                return;
              }else{
                if(this.TRNSF_EXPSN_ATTR[i].V_MODEL.length > this.TRNSF_EXPSN_ATTR[i].DATA_LEN){
                  this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 0 ~ '+this.TRNSF_EXPSN_ATTR[i].DATA_LEN+'byte 이내로 입력해 주세요.', iconClass: 'is-caution', type: 'default'});
                  return;
                }
              }
            }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'COE'){ //단일 선택형
              if(Array.isArray(this.TRNSF_EXPSN_ATTR[i].V_MODEL)){
                let iCnt = 0;
                for(let k in this.TRNSF_EXPSN_ATTR[i].V_MODEL){
                  if(this.TRNSF_EXPSN_ATTR[i].V_MODEL[k]) iCnt++;
                }
                if(iCnt === 0){
                  this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                  return;
                }
              }else{
                if(!this.TRNSF_EXPSN_ATTR[i].V_MODEL){
                  this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                  return;
                }
              }
            }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'COE_MULTI'){ //다중 선택형
              if(this.TRNSF_EXPSN_ATTR[i].V_MODEL.length === 0){
                this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                return;
              }
            }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'DAT'){ //날짜형
              if(!this.TRNSF_EXPSN_ATTR[i].V_MODEL){
                this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                return;
              }
            }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'HASH'){ //해시태그
              let sHashTxt = '';
              let iCnt = 0;
              let iChkCnt = 0;
              for(let k in this.TRNSF_EXPSN_ATTR[i].tags){
                if(this.TRNSF_EXPSN_ATTR[i].tags[k]) iCnt++;
  
                if(this.TRNSF_EXPSN_ATTR[i].tags[k].text){
                  sHashTxt += (iChkCnt>0?',':'') + this.TRNSF_EXPSN_ATTR[i].tags[k].text;
                  iChkCnt++;
                }
              }
              if(iCnt === 0){
                this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                return;
              }else{
                if(sHashTxt.length > this.TRNSF_EXPSN_ATTR[i].DATA_LEN){
                  this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 0 ~ '+this.TRNSF_EXPSN_ATTR[i].DATA_LEN+'byte 이내로 입력해 주세요.', iconClass: 'is-caution', type: 'default'});
                  return;
                }
              }
            }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'POST'){ //우편번호
              if(!this.TRNSF_EXPSN_ATTR[i].V_MODEL){
                this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                return;
              }
              if(!this.TRNSF_EXPSN_ATTR[i].V_MODEL_DTL[1]){
                this.showAlert({alertDialogToggle: true, msg: this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_NM + ' 항목의 상세 주소는 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
                return;
              }
            }
          }
        }

        if(this.mixin_isEmpty(this.TRGT_USER_ID)){
          this.showAlert({alertDialogToggle: true, msg: '이관 대상 담당자를 선택해 주세요.', iconClass: 'is-caution', type: 'default'});
          return;
        }
      }

      this.showAlert(this.MESSAGE.CONFIRM.REG);
    },

    //후처리 시간 카운트
    setCuttAfterTime() {
      this.ctiCuttTimerEnd();

      this.AFTPRCS_HR_TIMER = setInterval(() => {
        this.AFTPRCS_HR++;
      }, 1000);
    },

    //타이머 종료
    ctiCuttTimerEnd() {
      this.AFTPRCS_HR = 0; //후처리 시간 초기화
      clearInterval(this.AFTPRCS_HR_TIMER);
    },

    //상담 시작 일시
    async setCuttStDts() {
      this.$store.commit("statusStore/MU_CUTT_ING", true); //상담 진행중을 true로 store 저장 처리
      this.CHAT_TOP_INFO.status = 'error'; //상담중
      this.CUTT_BGNG_DT = await this.mixin_getSvrDate("YYYYMMDDHH24MISS"); //상담 시작 일시
      this.CALL_ING = true; //상담중
    },

    //상담 종료 일시
    async setCuttEndDts() {
      this.CUTT_END_DT = await this.mixin_getSvrDate("YYYYMMDDHH24MISS"); //상담 시작 일시
      this.setCuttAfterTime(); //후처리 시간 카운트
      //상단 후처리(상담) 상태 버튼 제어
      this.$eventBus.$emit("busCuttEvt", {evt : 'CuttAfter', CUST_ID : this.CUST_INFO.CUST_ID, CPI_ID : this.CUST_INFO.CPI_ID, CLBK_ID : this.CUST_INFO.CLBK_ID, RSVT_ID : this.CUST_INFO.RSVT_ID}); //상단 CTI 버튼 제어

      if(this.CL_TYPE_CD === 'OUT' && !this.CUTT_BGNG_DT){
        this.CUTT_BGNG_DT = this.CUTT_END_DT;
      }

      if(!this.CUTT_BGNG_DT) this.CUTT_BGNG_DT = this.CUTT_END_DT;
    },

    //상담내용 저장
    async phoneCuttSave() {
      this.$store.commit("alertStore/btnYisLoading");
      //sw DB에 UPDATE를 위한 상담예약결과 코드값 
      let rsvtValue = '';

      let sUrl = '/phone-api/cutt/cuttProc';

      if(this.forcCuttAble){ //강제 생성인 경우 상담 시간 셋팅
        this.CUTT_BGNG_DT = this.FORCE_CUTT_BGNG_DT.replace(/-/gi, '') + this.FORCE_CUTT_BGNG_TIME.replace(/:/gi, '')+(this.FORCE_CUTT_BGNG_TIME.split(':').length > 1?'':'00');
        this.CUTT_END_DT = this.FORCE_CUTT_END_DT.replace(/-/gi, '') + this.FORCE_CUTT_END_TIME.replace(/:/gi, '')+(this.FORCE_CUTT_END_TIME.split(':').length > 1?'':'00');
      }

      let postParam = {
        PHN_CUTT_ID : this.PHN_CUTT_ID
        , CL_TYPE_CD : this.CL_TYPE_CD //콜 유형(IN, OUT)
        , CUST_ID : this.CUST_INFO.CUST_ID //고객 ID
        , CLBK_ID : this.CLBK_ID //콜백 ID
        , CPI_ID : this.CPI_ID //캠페인 ID
        , RSVT_ID : this.RSVT_ID //상담예약 ID
        , CUTT_BGNG_DT : this.CUTT_BGNG_DT //상담 시작 일시
        , CUTT_END_DT : this.CUTT_END_DT //상담 종료 일시
        , AFTPRCS_HR : this.AFTPRCS_HR //후처리 시간
        , DRWI_SE_NM : this.DRWI_SE_NM //IVR 명
        , REC_FILE_NM : this.REC_FILE_NM //녹취파일명
        , CUTT_RSVT_ID : this.CUTT_RSVT_ID //예약 콜 ID
        , CPLMT_CL_YN : '' //칭찬콜 여부
        , FORC_CRT_YN : this.forcCuttAble?'Y':'N' //강제 등록 여부
        , AUTO_CL_YN : '' //오토콜 여부
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
          // //sw예약처리결과 insert
          // //처리결과는 상담사가 직접 update
          // if(this.RSVT_ID){
          //   if(this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID == 'RSVT_RS'){
          //     rsvtValue = this.EXPSN_ATTR[i].V_POST_PARAM;
          //   }
          // }
        }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'COE_MULTI'){ //다중 선택형
          let multiData = '';
          this.EXPSN_ATTR[i].V_MODEL.forEach((multi, idx) => {
            multiData += (multiData?',':'') + multi.value;
          });

          this.EXPSN_ATTR[i].V_POST_PARAM = multiData;
        }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'DAT'){ //날짜형
          if(this.EXPSN_ATTR[i].V_MODEL){
            postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].dateTimeDate.replace(/-/gi, '') + this.EXPSN_ATTR[i].selectedTime.replace(/:/gi, '')+(this.EXPSN_ATTR[i].selectedTime.split(':').length > 1?'':'00');
            this.EXPSN_ATTR[i].V_POST_PARAM = this.EXPSN_ATTR[i].dateTimeDate.replace(/-/gi, '') + this.EXPSN_ATTR[i].selectedTime.replace(/:/gi, '')+(this.EXPSN_ATTR[i].selectedTime.split(':').length > 1?'':'00');
          }
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
          // postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID+'_DTL1'] = this.EXPSN_ATTR[i].V_MODEL_DTL[0];
          // postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID+'_DTL2'] = this.EXPSN_ATTR[i].V_MODEL_DTL[1];
        }
      }

      let headParam = {
        head : {
        }
      }

      postParam.EXPSN_ATTR = JSON.stringify(this.EXPSN_ATTR);

      //AS 방문 예약 사용인 경우
      if(this.mixin_getCustcoSrvcStat('AS_ALTMNT') && this.vstUseYn){
        let arrVstRsvtList = [];
        this.VST_RSVT_LIST.forEach((data, seq) => {
          data.CUST_TELNO = data.CUST_TELNO.replace(/[^0-9]/g, '');
          data.RSVT_BGNG_DT = data.RSVT_BGNG_DT.replace(/[^0-9]/g, '')+'00';

          arrVstRsvtList.push(data);
        });
        postParam.VST_RSVT_LIST = JSON.stringify(arrVstRsvtList);
        //SMS 전송용 Param
        postParam.callback_number = this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO.split(',')[0];
      }

      //이관 사용인 경우
      if(this.mixin_getCustcoSrvcStat('TRNSF') && this.trnsfUseYn){
        for(let i in this.TRNSF_EXPSN_ATTR){
          if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'TXT'){ //문자형
            postParam[this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.TRNSF_EXPSN_ATTR[i].V_MODEL;
            this.TRNSF_EXPSN_ATTR[i].V_POST_PARAM = this.TRNSF_EXPSN_ATTR[i].V_MODEL;
          }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'NUM' || this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'NUM_COMMA'){ //숫자형
            postParam[this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.TRNSF_EXPSN_ATTR[i].V_MODEL;
            this.TRNSF_EXPSN_ATTR[i].V_POST_PARAM = this.TRNSF_EXPSN_ATTR[i].V_MODEL;
          }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'COE'){ //단일 선택형
            if(Array.isArray(this.TRNSF_EXPSN_ATTR[i].V_MODEL)){
              let lastVal = '';
              for(let k in this.TRNSF_EXPSN_ATTR[i].V_MODEL){
                if(this.TRNSF_EXPSN_ATTR[i].V_MODEL[k]) lastVal = this.TRNSF_EXPSN_ATTR[i].V_MODEL[k];
              }
              postParam[this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = lastVal;
              this.TRNSF_EXPSN_ATTR[i].V_POST_PARAM = lastVal;
            }else{
              postParam[this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.TRNSF_EXPSN_ATTR[i].V_MODEL;
              this.TRNSF_EXPSN_ATTR[i].V_POST_PARAM = this.TRNSF_EXPSN_ATTR[i].V_MODEL;
            }
          }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'COE_MULTI'){ //다중 선택형
            let multiData = '';
            this.TRNSF_EXPSN_ATTR[i].V_MODEL.forEach((multi, idx) => {
              multiData += (multiData?',':'') + multi.value;
            });

            this.TRNSF_EXPSN_ATTR[i].V_POST_PARAM = multiData;
          }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'DAT'){ //날짜형
            if(this.TRNSF_EXPSN_ATTR[i].V_MODEL){
              postParam[this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.TRNSF_EXPSN_ATTR[i].dateTimeDate.replace(/-/gi, '') + this.TRNSF_EXPSN_ATTR[i].selectedTime.replace(/:/gi, '')+(this.TRNSF_EXPSN_ATTR[i].selectedTime.split(':').length > 1?'':'00');
              this.TRNSF_EXPSN_ATTR[i].V_POST_PARAM = this.TRNSF_EXPSN_ATTR[i].dateTimeDate.replace(/-/gi, '') + this.TRNSF_EXPSN_ATTR[i].selectedTime.replace(/:/gi, '')+(this.TRNSF_EXPSN_ATTR[i].selectedTime.split(':').length > 1?'':'00');
            }
          }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'HASH'){ //해시태그
            let sHashTxt = '';
            let iCnt = 0;
            for(let k in this.TRNSF_EXPSN_ATTR[i].tags){
              if(this.TRNSF_EXPSN_ATTR[i].tags[k].text){
                if(this.TRNSF_EXPSN_ATTR[i].tags[k].active){
                  sHashTxt += (iCnt>0?',':'') + this.TRNSF_EXPSN_ATTR[i].tags[k].text;
                  iCnt++;
                }
              }
            }
            postParam[this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = sHashTxt;
            this.TRNSF_EXPSN_ATTR[i].V_POST_PARAM = sHashTxt;
          }else if(this.TRNSF_EXPSN_ATTR[i].DATA_TYPE_CD === 'POST'){ //우편번호
            postParam[this.TRNSF_EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.TRNSF_EXPSN_ATTR[i].V_MODEL + '|' + (this.TRNSF_EXPSN_ATTR[i].V_MODEL_DTL[0]?this.TRNSF_EXPSN_ATTR[i].V_MODEL_DTL[0]:'') + '|' + (this.TRNSF_EXPSN_ATTR[i].V_MODEL_DTL[1]?this.TRNSF_EXPSN_ATTR[i].V_MODEL_DTL[1]:'');
            this.TRNSF_EXPSN_ATTR[i].V_POST_PARAM = this.TRNSF_EXPSN_ATTR[i].V_MODEL + '|' + (this.TRNSF_EXPSN_ATTR[i].V_MODEL_DTL[0]?this.TRNSF_EXPSN_ATTR[i].V_MODEL_DTL[0]:'') + '|' + (this.TRNSF_EXPSN_ATTR[i].V_MODEL_DTL[1]?this.TRNSF_EXPSN_ATTR[i].V_MODEL_DTL[1]:'');
          }
        }

        postParam.TRNSF_EXPSN_ATTR = JSON.stringify(this.TRNSF_EXPSN_ATTR);
        postParam.TRGT_USER_ID = this.TRGT_USER_ID;
      }

      //영상통화 저장 폴더 위치
      postParam.VIDEO_FILE_PATH = this.videoFilePath;

      // this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.cuttReset(); //상담 초기화
        this.showToast(this.MESSAGE.TOAST.SUCCESS);

        if(this.mixin_getCustcoSrvcStat('AS_ALTMNT')){
          try{
            this.CUST_INFO.LAST_PHN_CUTT_ID = response.DATA[0].PHN_CUTT_ID;
            this.VST_RSVT_LIST = []; //초기화
            this.addVstRsvtForm(); //기본 한건 추가
            this.vstUseYn = false;
            
          }catch(e){console.log(e);}
        }

        if(this.mixin_getCustcoSrvcStat('TRNSF')){
          this.TRGT_USER_ID = '';
        }
      }

      this.$store.commit("statusStore/MU_CUTT_ING", false); //상담 진행중을 false로 store 저장 처리

      // //처리결과는 상담사가 직접 update
      // if(this.RSVT_ID){
      //   //상담예약건 저장할 때
      //   let sUrl = '/api/rsvt/updateRsvtRs';
      //   let postParam = {
      //     API_URL : 'updateRsvtRs',
      //     RSVT_ID : this.RSVT_ID,
      //     RSVT_VALUE : rsvtValue
      //   }

      //   let headParam = {
      //     head : {
      //     }
      //   }

      //   let response  = await this.common_postCall(sUrl, postParam, headParam);

      //   if (!response.HEADER.ERROR_FLAG){
      //     console.log("response.DATA",response.DATA);
      //   }
      // }
    },

    //상담 초기화
    cuttReset() {
      if(this.forcCuttAble){
        this.$eventBus.$emit("busCuttEvt", {evt : 'cuttForceSave'}); //상단 CTI 버튼 제어
      }else{
        this.$eventBus.$emit("busCuttEvt", {evt : 'cuttSave'}); //상단 CTI 버튼 제어
      }

      this.forcCuttAble = false; //강제 생성 초기화
      this.CUTT_RSVT_ID = ''; //예약 콜 ID 초기화
      this.PHN_CUTT_ID = ''; //전화 상담 ID 초기화
      this.CPI_ID = ''; //캠페인 ID 초기화
      this.CPI_CNT = false;
      this.CLBK_ID = ''; //콜백 ID 초기화
      this.RSVT_ID = ''; //상담예약 ID 초기화

      //상담 저장 후 고객 유지 여부
      if(this.$store.getters["userConfigStore/GE_SAVE_AFTR_CUST_MAINTAIN"]){ //유지
        this.$refs.MainchatAllLog.getSearch('cutt', ''); //통합 접촉 이력 조회
        if(this.mixin_getCustcoSrvcStat('AS_ALTMNT')){
          this.$refs.MainchatAllLog.getSearch('vstRsvt', ''); //방문 예약 이력 조회
        }
      }else{ //고객 초기화
        this.custReset(); //고객정보 초기화
      }

      this.phnCuttFormReset(); //상담내용 등록 폼 초기화

      this.getExpsnAttrList(); //확장속성 초기화

      this.CALL_ING = false; //상담 종료

      eventBus.getCtiBtnStat('getCtiBtnStat'); //CTI 버튼 상태 가져오기

      this.cuttTypeIntgeSchVal = ''; //상담 유형 검색 초기화

      this.$refs.mydesk.getMyDeskData(); //MyDesk 리로드

      this.ctiCuttTimerEnd(); //후처리 시간 타이머 초기화
    },

    //상담 시간 초기화
    reSetCuttTime() {
      this.CHAT_TOP_INFO.status = 'main'; //상담대기
      this.CUTT_BGNG_DT = ''; //상담 시작 일시 초기화
      this.CUTT_END_DT = ''; //상담 종료 일시 초기화

      this.forcCuttCreateFrom(this.forcCuttAble); //상담 시간 초기화

    },

    //고객정보 초기화
    custReset() {
      //고객 정보 초기화
      this.CUST_INFO.CUST_ID = -1;
      this.CUST_INFO.CUST_NM = '성명미상';
      this.CUST_INFO.CUST_PHN_NO = '　';
      this.CUST_INFO.CAUTION_CUST_YN = 'N';
      this.CUST_INFO.portrait = require('@/assets/img/@profile_customer.png');

      //콜 데이터 초기화
      const OUT_CALL_DATA = this.OUT_CALL_DATA;
      Object.keys(OUT_CALL_DATA).forEach(function(key) {
        OUT_CALL_DATA[key] = '';
      });
      this.OUT_CALL_DATA = OUT_CALL_DATA;
      this.DSPTCH_NO = ''; //대표번호 초기화
    },

    //고객정보 조회로 고객 전화걸기
    callDialog() {
      if(this.$socket){
        this.OUT_CALL_DATA.CUST_PHN_NO = this.CUST_INFO.CUST_PHN_NO;
        this.OUT_CALL_DATA.CUST_ID = this.CUST_INFO.CUST_ID;
        this.OUT_CALL_DATA.MODIFY_USE = false;
        this.OUT_CALL_DATA.CL_TYPE_CD = 'OUT';

        this.$eventBus.$emit('dialogOutCall', this.OUT_CALL_DATA); //top 전화걸기 호출
      }else{
        this.showAlert(this.MESSAGE.ALERT.SOCKET_ERROR);
        return;
      }
    },

    //고객정보 조회로 고객 RIGHT 이메일 보내기
    callSendEmailDialog() {
      if(this.mixin_isEmpty(this.CUST_INFO.CUST_EMAIL)){
        this.showAlert(this.MESSAGE.ALERT.CUST_EMAIL_ERROR);
      }else {
        eventBus.setSendEmailParm(this.CUST_INFO.CUST_EMAIL);
        this.mixin_showDialog('SendEmail');
      }
    },

    sttStatChange(event) {
      //통합 접촉이력 실시간 검색 탭 처리
      if(this.$refs.MainchatAllLog != undefined){
        this.$refs.MainchatAllLog.setOpenTab(event); //실시간 검색 탭 처리
      }
    },

    // 상세 drop
    closeDropMainDetail(){
      this.dropMainDetail = false;
    },
    // stt
    toggeleExpandClass(){
      return this.stt_slide === true ? 'pl-icon20 arrow-down' : 'pl-icon20 arrow-up'
    },
    toggeleExpand(){
      this.stt_slide = !this.stt_slide;
    },

    setSendEmail() {
      eventBus.setSendEmail();
    },
    setSendEmailCancel() {
      // console.log( 'setSendEmailCancel' );
      eventBus.setSendEmailInit();
      this.mixin_hideDialog('SendEmail');
    },
    sendEmailClose() {
      this.mixin_hideDialog('SendEmail');
    },

    showSmsSlide(){
      this.$eventBus.$emit('showRightSlide', {ACT_NM: 'dialogSms', active:false});
    },

    showChatSlide(){
      this.$eventBus.$emit('showRightSlide', {ACT_NM: 'dialogTalk', active:false});
    },

    async forcCuttCreateFrom(forcYn) {
      this.forcCuttAble = forcYn;
      if(forcYn){
        let svrDate = await this.mixin_getSvrDate("YYYY-MM-DD HH24:MI:SS");

        let yyyymmdd = svrDate.split(' ')[0];
        let time = svrDate.split(' ')[1];
        let date = new Date(yyyymmdd.split('-')[0].toString(), (Number(yyyymmdd.split('-')[1])-1).toString(), yyyymmdd.split('-')[2].toString(), time.split(':')[0].toString(), time.split(':')[1].toString(), time.split(':')[2].toString());

        this.FORCE_CUTT_BGNG_DT = '' + date.getFullYear() + '-' + this.mixin_rpad((date.getMonth()+1).toString(), 2, '0') + '-' + this.mixin_rpad(date.getDate(), 2, '0');
        this.FORCE_CUTT_BGNG_TIME = '' + this.mixin_rpad(date.getHours(), 2, '0') + ':' + this.mixin_rpad(date.getMinutes(), 2, '0') + ':' + this.mixin_rpad(date.getSeconds(), 2, '0');
        // this.FORCE_CUTT_BGNG_TIME = '' + this.mixin_rpad(date.getHours(), 2, '0') + ':' + this.mixin_rpad(date.getMinutes(), 2, '0');

        date.setSeconds(date.getSeconds() + 1);
        this.FORCE_CUTT_END_DT = '' + date.getFullYear() + '-' + this.mixin_rpad((date.getMonth()+1).toString(), 2, '0') + '-' + this.mixin_rpad(date.getDate(), 2, '0');
        this.FORCE_CUTT_END_TIME = '' + this.mixin_rpad(date.getHours(), 2, '0') + ':' + this.mixin_rpad(date.getMinutes(), 2, '0') + ':' + this.mixin_rpad(date.getSeconds(), 2, '0');
        // this.FORCE_CUTT_END_TIME = '' + this.mixin_rpad(date.getHours(), 2, '0') + ':' + this.mixin_rpad(date.getMinutes(), 2, '0');
      }else{
        this.FORCE_CUTT_BGNG_DT = '';
        this.FORCE_CUTT_BGNG_TIME = '';
        this.FORCE_CUTT_END_DT = '';
        this.FORCE_CUTT_END_TIME = '';
      }
    },

    addCuttType() {
      this.$eventBus.$emit('clearTreeData');
      this.mixin_showDialog('CuttTypeTree');
    },

    setTreeData() {
      this.$eventBus.$emit('setTreeData');
      this.mixin_hideDialog('CuttTypeTree');
    },

    getTreeData(data) {
      this.CUTT_TYPE_TREE.push(data);
    },

    //요약보기 버튼 처리
    summaryCuttCn() {
      if(this.STT_LOG == undefined || this.STT_LOG.length == 0) {
        this.showAlert(this.MESSAGE.ALERT.SUMMARY_CUTT_CN)
        return;
      }
      let transcript = "";
      this.STT_LOG.map((chat, index) => {
        if(transcript != "") {
          transcript += "\n";
        }
        if(chat.name == "나상담") {
          transcript += "상담사 : " + chat.chat;
        } else if(chat.name == "나고객") {
          transcript += "고객 : " + chat.chat;
        }
      })
      this.$refs.MainchatAllLog.autoSummaryCuttCn(transcript, this.CL_TYPE_CD, this.PHN_CUTT_ID, null);
    },

    //실시간 검색 - 상담요약 탭 '적용' 버튼 처리
    applyCuttCn(cuttCn, cuttTypeVmodelArr) {
      //상담 내용 확장 항목만 filter
      const cuslCn = this.EXPSN_ATTR.filter(item => item.EXPSN_ATTR_COL_ID === "CUSL_CN");
      if(cuslCn.length == 0) {
        this.showAlert(this.MESSAGE.ALERT.APPLY_CUTT_CN)
        return;
      }
      else if(cuslCn.length == 1) {
        cuslCn[0].V_MODEL = cuttCn;
      }
    },

    //상담 유형 검색 Data Set
    cuttTypeIntgeSchData(menu) {
      menu.forEach(item => {
        if (item.UP_CUTT_TYPE_ID) {
          this.flattenedMenu.push({ value: item.FULL_CUTT_TYPE_ID, text: item.FULL_PATH });
        }
        if (item.children) {
          this.cuttTypeIntgeSchData(item.children);
        }
      });
    },
    closeDropCsTemplate(){
      this.dropCsTemplate = false;
    },
    ToggleCsTemplate(){
      if(!this.cuttTypeIntgeSchVal){
        this.showAlert(this.MESSAGE.ALERT.CUTT_TYPE_EMPTY);
        return;
      }

      let iCnt = this.cuttTypeIntgeSchVal.split(',').length;

      let labelNm = '';
      this.flattenedMenu.forEach((integ, idx) => {
        if(integ.value === this.cuttTypeIntgeSchVal) labelNm = integ.text.split(' > ')[iCnt-1];
      });

      let itemObj = {label : labelNm, active: true, value: this.cuttTypeIntgeSchVal, seq:this.CUSL_TP_CL_SEQ};

      if (this.bmkCsTemplate === false) { //즐겨찾기 추가
        this.aniFavorite( true );
        this.bmkCsTemplate = true;
        this.cuslCuttTypeBmkProc(itemObj, 'REG');
      } else { //즐겨찾기 제거
        this.aniFavorite( false );
        this.bmkCsTemplate = false;
        this.cuslCuttTypeBmkProc(itemObj, 'DEL');
      }
    },
    // favorite animation
    aniFavorite(flag){
      const PLAYBACK_RANGE = [30, 119];
      const lottieFavorite = this.lottieFavorite;

      if (flag) {
        lottieFavorite.playSegments(PLAYBACK_RANGE, true);
      } else {
        try{
          if(lottieFavorite) lottieFavorite.goToAndStop(0, true);
        }catch(e){console.error(e);}
      }
    },

    //상담사 상담유형 즐겨찾기 가져오기
    async getCuslCuttTypeBmk (seq){
      this.bmkCuttType = [];
      this.recentCuttType = [];

      let sUrl = '/api/setting/cuttType/cuslCuttTypeBmkList';
      let postParam = {
        BMK_CNT : 5
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        if(response.DATA.length > 0){
          response.DATA.forEach((data, idx) => {
            if(data.REG_SE_CD === 'CUSL_REG'){
              this.bmkCuttType.push({label : data.CUTT_TYPE_NM, active: true, value:data.FULL_CUTT_TYPE_ID, seq:seq});
            }else{
              this.recentCuttType.push({label : data.CUTT_TYPE_NM, active: true, value:data.FULL_CUTT_TYPE_ID, seq:seq});
            }
          });
        }
      }
    },

    //상담사 상담유형 즐겨찾기 저장 및 삭제
    async cuslCuttTypeBmkProc (item, type){
      let iCnt = item.value.split(',').length;
      let CUTT_TYPE_ID = item.value.split(',')[iCnt-1];

      let sUrl = '/api/setting/cuttType/cuslCuttTypeBmkProc';
      let postParam = {
        REG_SE_CD : 'CUSL_REG'
        , CUTT_TYPE_ID : CUTT_TYPE_ID
        , JOB_GB : type
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.getCuslCuttTypeBmk(this.CUSL_TP_CL_SEQ);
      }
    },

    //북마크(즐겨찾기) 선택 이벤트
    setCuttTypeBmkData (item, type){
      this.dropCsTemplate = false;

      this.cuttTypeIntgeSchVal = item.value;
      this.changeCuttTypeSch(item.seq);
    },

    //콜 이력 찾기 모달
    ipccCallHistSearch() {
      //top 콜 이력 찾기 호출
      this.$eventBus.$emit('dialogIpccCallHistFind', {ST_TIME: this.FORCE_CUTT_BGNG_DT, END_TIME: this.FORCE_CUTT_END_DT, INOUT: 'CVS'});
    },

    //영상통화
    async FnDemoVideoMode(callTp) {
      // sms 템플릿정보 조회
      this.getTempleInfo();

      let custPhnNo = this.CUST_INFO.CUST_PHN_NO.replace(/[^0-9]/g, '');
      let phnNoConfirm = false;
      if(this.mixin_isEmpty(custPhnNo)) phnNoConfirm = true;

      let svrDate = await this.mixin_getSvrDate("YYYYMMDD");
      
      let callId = 'PHN_'+this.CUST_INFO.LAST_PHN_CUTT_ID;
      if(!this.CUST_INFO.LAST_PHN_CUTT_ID) callId = 'CUST_'+this.CUST_INFO.CUST_ID;
      
      if(callTp === 'AS'){
        custPhnNo = this.AS_INFO.CUST_TELNO.replace(/[^0-9]/g, '');
        if(this.mixin_isEmpty(custPhnNo)) phnNoConfirm = true;
        
        callId = 'PHN_'+this.AS_INFO.PHN_CUTT_ID+'_'+this.AS_INFO.VST_RSVT_ID;
      }
      
      this.videoFilePath = this.$store.getters['userStore/GE_USER_ROLE'].company.SCHEMA_ID+'_'+this.$store.getters['userStore/GE_USER_ROLE'].company.CD + '/' + svrDate.substring(0, 4) + '/' + svrDate.substring(4, 6) + '/' + svrDate.substring(6, 8) + '/'+callId;

      let sSchemaCustco = this.$store.getters['userStore/GE_USER_ROLE'].company.SCHEMA_ID+'_'+this.$store.getters['userStore/GE_USER_ROLE'].company.CD;
      if(process.env.VUE_APP_ENV === 'local' || process.env.VUE_APP_ENV === 'devserver'){
        sSchemaCustco = 'DEV_' + this.$store.getters['userStore/GE_USER_ROLE'].company.SCHEMA_ID+'_'+this.$store.getters['userStore/GE_USER_ROLE'].company.CD;
      }

      console.log('this.videoFilePath : ', this.videoFilePath);
      this.showAlert({
          alertDialogToggle: true
          , msg: '영상통화로 전환 하시겠습니까?'
          , phnNoConfirm: phnNoConfirm
          , iconClass: 'is-info'
          , type: 'confirm'
          , callYes: () => {
            if(phnNoConfirm){
              if(this.mixin_isEmpty(this.$store.getters['alertStore/GE_ALERT'].custPhnNo)){
                this.$store.getters['alertStore/GE_ALERT'].custPhnNoChk = true;
              }else{
                if(this.$store.getters['alertStore/GE_ALERT'].custPhnNo.replace(/[^0-9]/g, '').length < 11){
                  this.$store.getters['alertStore/GE_ALERT'].custPhnNoChk = true;
                }else{
                  this.demoVideoMode = !this.demoVideoMode;
                  this.iframeUrl = process.env.VUE_APP_VIDEO_URL + '/view/ssologin?loginId='+this.$store.getters['userStore/GE_USER_ROLE'].lgnId.replace('#', '%23')+'&tenantName=hkcloud&site='+sSchemaCustco+'&callid='+callId;
                  this.$store.commit("alertStore/hideAlert");
                }
              }
            }else{
              this.demoVideoMode = !this.demoVideoMode;
              this.iframeUrl = process.env.VUE_APP_VIDEO_URL + '/view/ssologin?loginId='+this.$store.getters['userStore/GE_USER_ROLE'].lgnId.replace('#', '%23')+'&tenantName=hkcloud&site='+sSchemaCustco+'&callid='+callId;
              this.$store.commit("alertStore/hideAlert");
            }
          }
          , callNo: () => {
            this.$store.commit("alertStore/hideAlert");
          }
      });
    },

    sendMsgToChild( msg ) {
      this.$refs.child.contentWindow.postMessage( {key:"Invite", val: ""}, '*' );
    },

    receiveMsgFromChild( e ) {
      let _this = this;
      let message = e.data;
      if(this.demoVideoMode){
        if(message.key === "Invite") { //고객 초대 SMS URL
          // let sMessage = '아래 링크를 클릭해 주세요.\n\n';
          let sMessage = this.VIDEO_INVITE_SMS_CN.split('#{INVITE_LINK}').join(message.val);
          var data = new Object();
          data.attachment = {"image":""}
          data.send_date = ''; //즉시발송
          data.subject = '영상통화 접속 URL';
          data.sndngSeCd = 'LMS';
          data.message = sMessage;
          data.phone_number = this.CUST_INFO.CUST_PHN_NO.replace(/[^0-9]/g, '')?this.CUST_INFO.CUST_PHN_NO.replace(/[^0-9]/g, ''):_this.$store.getters['alertStore/GE_ALERT'].custPhnNo.replace(/[^0-9]/g, ''); //고객 전화번호
          data.callback_number = _this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO.split(',')[0];

          data.toastView = true; //처리상태 Toast 사용 유무

          var toastMsgObj = new Object();
          toastMsgObj.alertDialogToggle = true;
          toastMsgObj.msg = '영상통화 접속 정보를 전송 하였습니다.';
          toastMsgObj.iconClass = 'is-info';
          toastMsgObj.type = 'default';

          data.toastMsg = toastMsgObj;

          let SndngResp = _this.mixin_sendMessage(data); //SMS 전송

        }else if(message.key === "End"){ //상담 종료
          this.iframeUrl = "";
          this.demoVideoMode = false;

          //영상상담 종료 후 이벤트 처리

        }else if(message.key === "Error"){ //오류
          this.iframeUrl = "";
          this.demoVideoMode = false;

          //오류 발생시 이벤트 처리
        }
      }
    },

    // SMS 템플릿 조회
    async getTempleInfo(){

      let response = await this.common_postCall('/phone-api/placeContact/selectTempleteInfo', { TMPL_CD: 'TP_VIDEO', TMPL_TY : 'SMS'}, {head:{}});

      if (!response.HEADER.ERROR_FLAG) {
        if(response.DATA.length > 0){
          this.VIDEO_INVITE_SMS_CN = response.DATA[0].TMPL_CN;
        }else{
          this.VIDEO_INVITE_SMS_CN = '#{INVITE_LINK}';
        }
      }
    },

    //AS 예약 고객 전화번호
    setPhoneNo(val){
      let res = this.mixin_setPhoneNo(val.replace(/[^0-9]/g, ""));
      this.VST_RSVT_LIST[0].CUST_TELNO = res;
    },

    //AS 예약 선택
    setVstIdx(idx) {
      this.VST_RSVT_IDX = idx;
    },

    //AS 예약 접수 추가
    addVstRsvtForm() {
      this.VST_RSVT_LIST.push(
        {
          CUST_NM: '', //고객명
          REL_CD: 'RT_SELF', //관계
          CUST_TELNO: '', //고객 전화번호
          ZIP: '', //방문 우편번호
          ADDR: '', //방문 주소
          ADDR_DTL: '', //방문 상세 주소
          SRVC_TYPE_CD: 'ST_FIX', //서비스 종류 코드
          UP_PRDCT_TYPE_ID: '', //상위 제품 유형 ID
          PRDCT_TYPE_ID: '', //제품 유형 ID
          VST_RSVT_ID: '', //예약 ID
          RSVT_BGNG_DT: '', //예약 시작 일시
          VSTR_ID: '', //방문자 ID
          VSTR_NM: '', //방문자 명
          DEPT_ID: '', //소속 ID
          DMND_MTTR: '', //문의내용
          EXCPTN_MTTR: '', //특이사항
        }
      )
    },

    //AS 예약 접수 삭제
    delVstRsvtForm(idx) {
      this.showAlert({
        alertDialogToggle: true
        , msg: '예약 접수를 삭제 하시겠습니까?'
        , iconClass: 'is-info'
        , type: 'confirm'
        , callYes: () => {
          const arrVstRsvtList = [];
          this.VST_RSVT_LIST.forEach((data, seq) => {
            if(seq !== idx) arrVstRsvtList.push(data);
          });
          this.VST_RSVT_LIST = arrVstRsvtList;
          this.$store.commit("alertStore/hideAlert");
        }
        , callNo: () => {
            this.$store.commit("alertStore/hideAlert");
        }
      });
    },

    //AS 제품 유형 목록 조회
    async getPrdctTypeList() {
      let sUrl = '/api/vst/prdctTypeList';
      let postParam = {
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.PRDCT_ITEMS = response.DATA;
      }
    },

    //상담유형 하위 item 가져오기
    getChildPrdctTypeItems(seq, idx, parentItem) {
      let arrPrdctType = [];

      if(idx === 0){
        if(this.PRDCT_ITEMS.length > 0){
          parentItem = this.PRDCT_ITEMS[0].PRDCT_TYPE_ID;
          this.PRDCT_ITEMS.map(function(row){
            if(row.UP_PRDCT_TYPE_ID === parentItem){
                if(row) arrPrdctType.push(row);
            }
          });
        }
      }else{
        if(parentItem){
          this.PRDCT_ITEMS.map(function(row){
            if(row.UP_PRDCT_TYPE_ID === parentItem)
              if(row) arrPrdctType.push(row);
          });
        }
      }

      return arrPrdctType || [];
    },

    changePrdctTypeItems(seq, idx){
      let selPrdctType = '';
      // for(let k=0; k<this.EXPSN_ATTR[seq].V_MODEL.length; k++){
      //   if(k > idx) this.EXPSN_ATTR[seq].V_MODEL[k] = '';//초기화

      //   if(this.EXPSN_ATTR[seq].V_MODEL[k]) selPrdctType += (selPrdctType?',':'') + this.EXPSN_ATTR[seq].V_MODEL[k]
      // }
    },
    
    //우편번호 Set
    setVstPostAddr(data) {
      this.VST_RSVT_LIST[this.VST_RSVT_IDX].ZIP = data.zipNo; //우편번호
      this.VST_RSVT_LIST[this.VST_RSVT_IDX].ADDR = data.roadAddr; //기본주소
      this.VST_RSVT_LIST[this.VST_RSVT_IDX].ADDR_DTL = ''; //상세주소
      this.mixin_hideDialog('VstRsvtFindPost');
    },

    //AS 기사 배정 화면 호출
    rsvtChoiceForm(idx) {
      this.setVstIdx(idx);
      this.VST_RSVT_INFO = this.VST_RSVT_LIST[idx];
      this.VST_RSVT_INFO.VST_RSVT_IDX = idx;
      this.VST_RSVT_INFO.CUST_ID = this.CUST_INFO.CUST_ID;
      
      this.$eventBus.$emit('dialogAssignManager', this.VST_RSVT_INFO);
    },

    //AS 기사 정보 데이터 Set
    setVstData(data) {
      if(data){
        this.VST_RSVT_LIST[this.VST_RSVT_IDX].VSTR_ID = data.VSTR_ID;
        this.VST_RSVT_LIST[this.VST_RSVT_IDX].VSTR_NM = data.name + '('+data.center+')';
        this.VST_RSVT_LIST[this.VST_RSVT_IDX].RSVT_BGNG_DT = data.setTime;
      }else{
        if(this.VST_RSVT_IDX > -1){
          this.VST_RSVT_LIST[this.VST_RSVT_IDX].VSTR_ID = '';
          this.VST_RSVT_LIST[this.VST_RSVT_IDX].VSTR_NM = '';
          this.VST_RSVT_LIST[this.VST_RSVT_IDX].RSVT_BGNG_DT = '';
        }
      }
    },

    //이관 확장 속성 및 담당자 목록 정보 가져오기
    async getTrnsfExpsnAttrList() {
      if(this.trnsfUseYn){
        let sUrl = '/api/setting/expsnAttr/expsnAttrList';
        let postParam = {
          SE : 'TRNSF' //상담내용 확장항목
          , BSC_PVSN_ATTR_YN : "N" //기본 제공 속성이 아닌것
          , USE_YN : 'Y' //확장속성 사용인 경우만
          , AUTHRT_GROUP_ID : 7 //사용자 권한 그룹 ID (담당자 그룹)
        }

        let response  = await this.common_postCall(sUrl, postParam, {head : {}});

        if (!response.HEADER.ERROR_FLAG){
          let expsnAttrData = response.DATA;

          //상담유형 공통코드
          let codeName = ['CALL_TP', 'CHNL', 'REL_TP', 'SRVC_TP']; //콜 유형과, 채널 공통코드
          this.EXPSN_ATTR.forEach((attr, idx) => {
            if(attr.DATA_TYPE_CD === 'COE' || attr.DATA_TYPE_CD === 'COE_MULTI'){
              if(attr.GROUP_CD_ID) codeName.push(attr.GROUP_CD_ID); //공통코드사용을 위해
            }
          });

          //이관 공통코드
          if(expsnAttrData.length > 0){
            expsnAttrData.forEach((attr, idx) => {
              if(attr.DATA_TYPE_CD === 'COE' || attr.DATA_TYPE_CD === 'COE_MULTI'){
                if(attr.GROUP_CD_ID) codeName.push(attr.GROUP_CD_ID); //공통코드사용을 위해
              }
            });
          }

          //공통코드설정
          this.common_code = await this.mixin_common_code_get_all(codeName);
          
          for(let i in expsnAttrData){

            if(expsnAttrData[i].PHN_CUTT_ID) expsnAttrData[i].V_MODEL = expsnAttrData[i].ATTR_VL; //동적 v_model 생성
            else expsnAttrData[i].V_MODEL = ''; //동적 v_model 생성

            if(expsnAttrData[i].DATA_TYPE_CD === 'TXT'){//문자형인 경우
              if(expsnAttrData[i].PHN_CUTT_ID) expsnAttrData[i].V_MODEL = this.mixin_decode(expsnAttrData[i].ATTR_VL); //decode
            }else if(expsnAttrData[i].DATA_TYPE_CD === 'DAT'){//날짜형인 경우
              if(expsnAttrData[i].PHN_CUTT_ID){
                expsnAttrData[i].V_MODEL = (expsnAttrData[i].ATTR_VL?true:false); //chkDateReserve
                expsnAttrData[i].V_MODEL_DATE = (expsnAttrData[i].ATTR_VL?expsnAttrData[i].ATTR_VL:''); //날짜 v_model
                expsnAttrData[i].chkDateReserve = false; //chkDateReserve
                expsnAttrData[i].dateReservePicker = (expsnAttrData[i].ATTR_VL?true:false); //dateReservePicker
                expsnAttrData[i].dropDateReserve = false; //dropDateReserve
                expsnAttrData[i].dateTimeDate = (expsnAttrData[i].ATTR_VL?await this.mixin_convertDate(expsnAttrData[i].ATTR_VL, 'yyyy-MM-dd'):(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)); //dateTimeDate
                expsnAttrData[i].dateTimeTime = new Date(); //dateTimeTime
                expsnAttrData[i].selectedTime = (expsnAttrData[i].ATTR_VL?await this.mixin_convertDate(expsnAttrData[i].ATTR_VL, 'HH:mm'):''); //selectedTime
                expsnAttrData[i].selectedAmpm = ''; //selectedAmpm
              }else{
                expsnAttrData[i].V_MODEL = false; //chkDateReserve
                expsnAttrData[i].V_MODEL_DATE = ''; //날짜 v_model
                expsnAttrData[i].chkDateReserve = false; //chkDateReserve
                expsnAttrData[i].dateReservePicker = false; //dateReservePicker
                expsnAttrData[i].dropDateReserve = false; //dropDateReserve
                expsnAttrData[i].dateTimeDate = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); //dateTimeDate
                expsnAttrData[i].dateTimeTime = new Date(); //dateTimeTime
                expsnAttrData[i].selectedTime = ''; //selectedTime
                expsnAttrData[i].selectedAmpm = ''; //selectedAmpm
              }
            }else if(expsnAttrData[i].DATA_TYPE_CD === 'POST'){ //우편번호인 경우
              if(expsnAttrData[i].PHN_CUTT_ID){
                expsnAttrData[i].V_MODEL_DTL = []; //주소 v_model
                if(expsnAttrData[i].ATTR_VL){
                  for(let h in expsnAttrData[i].ATTR_VL.split('|')){
                    if(h == 0) expsnAttrData[i].V_MODEL = expsnAttrData[i].ATTR_VL.split('|')[0]
                    else if(h == 1) expsnAttrData[i].V_MODEL_DTL[0] = expsnAttrData[i].ATTR_VL.split('|')[1]
                    else if(h == 2) expsnAttrData[i].V_MODEL_DTL[1] = expsnAttrData[i].ATTR_VL.split('|')[2]
                  }
                }
              }else{
                expsnAttrData[i].V_MODEL_DTL = []; //주소 v_model
              }
            }else if(expsnAttrData[i].DATA_TYPE_CD === 'COE'){ //단일 선택인 경우
              if(expsnAttrData[i].EXPSN_ATTR_COL_ID === 'CUSL_TP_CL'){
                expsnAttrData[i].V_MODEL = [];
                if(expsnAttrData[i].PHN_CUTT_ID){
                  if(expsnAttrData[i].ATTR_VL){
                    if(this.CUTT_TYPE_LMT_LVL_CD){
                      let tmpCuttType = '';
                      for(let k=0; k<this.CUTT_TYPE_LMT_LVL_CD; k++){
                        expsnAttrData[i].V_MODEL[k] = expsnAttrData[i].ATTR_VL.split(',')[k+1];
                        tmpCuttType += (tmpCuttType?',':'') + expsnAttrData[i].ATTR_VL.split(',')[k+1];
                      }

                      this.cuttTypeIntgeSchVal = tmpCuttType;
                      this.changeCuttTypeSch(i);
                    }
                  }else{
                    if(this.CUTT_TYPE_LMT_LVL_CD){
                      for(let k=0; k<this.CUTT_TYPE_LMT_LVL_CD; k++){
                        expsnAttrData[i].V_MODEL[k] = '';
                      }
                    }
                  }
                }else{
                  if(this.CUTT_TYPE_LMT_LVL_CD){
                    for(let k=0; k<this.CUTT_TYPE_LMT_LVL_CD; k++){
                      expsnAttrData[i].V_MODEL[k] = '';
                    }
                  }
                }
              }
            }else if(expsnAttrData[i].DATA_TYPE_CD === 'COE_MULTI'){ //다중 선택인 경우
              expsnAttrData[i].V_MODEL = [];

              let items = this.mixin_common_code_get(this.common_code, expsnAttrData[i].GROUP_CD_ID);
              let cdNms = '';
              if(expsnAttrData[i].ATTR_VL){
                items.forEach((code, idx) => {
                  expsnAttrData[i].ATTR_VL.split(',').forEach((data, seq) => {
                    if(code.value === data){
                      expsnAttrData[i].V_MODEL.push(code);
                      cdNms += (cdNms?',':'')+code.text;
                    }
                  });
                });
              }
              expsnAttrData[i].CD_NM = cdNms;
            }else if(expsnAttrData[i].DATA_TYPE_CD === 'HASH'){ //해시태그인 경우
              if(expsnAttrData[i].PHN_CUTT_ID){
                if(expsnAttrData[i].ATTR_VL){
                  expsnAttrData[i].tags = [];
                  for(let p in expsnAttrData[i].ATTR_VL.split(',')){
                    expsnAttrData[i].tags.push({ text: expsnAttrData[i].ATTR_VL.split(',')[p], active: true });
                  }
                  expsnAttrData[i].inputTagSize = '';
                  expsnAttrData[i].V_MODEL = '';
                }else{
                  expsnAttrData[i].tags = [];
                  expsnAttrData[i].inputTagSize = '';
                }
              }else{
                expsnAttrData[i].tags = [];
                expsnAttrData[i].inputTagSize = '';
              }
            }

            //캠페인 전화걸기일때 시도횟수가 마지막일 경우 무조건 처리결과 완료
            if(this.CPI_CNT && expsnAttrData[i].GROUP_CD_ID == 'CUSL_RS'){
              expsnAttrData[i].V_MODEL = 'COMPLETED';
            }
          }

          this.TRNSF_EXPSN_ATTR = expsnAttrData;

          let arrUserList = [];
          if(response.TRNSF_USER_LIST.length > 0){
            response.TRNSF_USER_LIST.forEach((data, idx) => {
              arrUserList.push({text : data.DEPT_NM + ' > ' + data.USER_NM, value : data.USER_ID});
            });
            this.TRGT_USER_ID = arrUserList[0].value; //이관 대상 ID
          }

          this.TRNSF_USER_LIST = arrUserList;
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>