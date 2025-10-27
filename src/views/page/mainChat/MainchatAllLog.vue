<template>
  <div :class="ResizeProp ? 'expand' : ''" style="flex: 1 1 0;">
    <div class="pl-card-top is-noborder pb-0">
      <strong class="pl-card-top-title"> 통합 접촉이력</strong>
      <div class="pl-btn-wrap ml-auto align-self-start" v-if="DataProp.chat_type === 'sns'">
        <!-- 리사이즈 토글 -->
        <compo-tooltip-btn
          :TitleProp=computedResizeText
          ClassProp="pl-tooltip-btn"
          :IconProp=computedResizeClass
          TooltipPositionProp="bottom"
          @btnClick="$emit('toggle')"
        ></compo-tooltip-btn>
      </div>
    </div>
    <div class="pl-card" >
      <!-- tabs -->
      <v-tabs class="pl-tabs type-main" v-model="mainTabs">
        <v-tab v-if="REALTIME_TAB_STAT === true">실시간 검색</v-tab>
        <v-tab>상담이력
          <span v-if="INTEG_CONNECT_HIST.INTEG_CUTT_HIST_CNT > 0" class="pl-tab-badge">{{ INTEG_CONNECT_HIST.INTEG_CUTT_HIST_CNT }}</span>
        </v-tab>
        <v-tab v-if="mixin_getCustcoSrvcStat('AS_ALTMNT')">AS 이력
          <span v-if="INTEG_CONNECT_HIST.VST_RSVT_CNT > 0" class="pl-tab-badge">{{ INTEG_CONNECT_HIST.VST_RSVT_CNT }}</span>
        </v-tab>
        <!-- <v-tab>VOC
          <span v-if="INTEG_CONNECT_HIST.VOC_CNT > 0" class="pl-tab-badge">{{ INTEG_CONNECT_HIST.VOC_CNT }}</span>
        </v-tab> -->
        <v-tab>SMS 이력
          <span v-if="INTEG_CONNECT_HIST.MSG_CNT > 0" class="pl-tab-badge">{{ INTEG_CONNECT_HIST.MSG_CNT }}</span>
        </v-tab>
        <v-tab>예약콜
          <span v-if="INTEG_CONNECT_HIST.RSVT_CALL_CNT > 0" class="pl-tab-badge">{{ INTEG_CONNECT_HIST.RSVT_CALL_CNT }}</span>
        </v-tab>
        <v-tab>콜백
          <span v-if="INTEG_CONNECT_HIST.CALL_BACK_CNT > 0" class="pl-tab-badge">{{ INTEG_CONNECT_HIST.CALL_BACK_CNT }}</span>
        </v-tab>
        <v-tab>캠페인
          <span v-if="INTEG_CONNECT_HIST.CPI_CNT > 0" class="pl-tab-badge">{{ INTEG_CONNECT_HIST.CPI_CNT }}</span>
        </v-tab>

        <!-- 실시간 검색 -->
        <v-tab-item v-if="REALTIME_TAB_STAT === true">
          <div class="is-mt-m pl-mainchat-csinfo-history-research">
            <h2 class="pl-subtit">대화 속 키워드</h2>
            <div class="pl-tags-wrap is-mt-m">
              <v-chip-group
                active-class="active-tag"
                column
              >
                <v-chip
                  v-for="tag, index in REALTIME_SEARCH.tags"
                  v-show="tag.active"
                  :key="index"
                  @click="schKewordKms(tag)"
                >
                  {{ tag.text }}
                </v-chip>
              </v-chip-group>
            </div>
            <!-- sub tab -->
            <v-tabs class="pl-tabs type-sub is-mt-l" v-model="realtimeTabs" height="30">
              <v-tab>실시간 지식 추천</v-tab>
              <v-tab>상담요약</v-tab>
              <!-- 실시간 지식 추천 -->
              <v-tab-item >
                <div class="is-mt-m">
                  <span class="pl-counter">전체 <em class="pl-1">({{ REALTIME_SEARCH.recommend_list.length }})</em> 건</span>
                  <p>목록에서 자세히를 클릭하시면 상세내용을 확인할 수 있습니다.</p>
                  <ul
                    class="pl-link-list is-mt-m mr-2"
                    style="max-height: 250px;">
                    <li
                      v-for="item in REALTIME_SEARCH.recommend_list"
                      :key="item.KMS_CONTS_ID"
                      @click="getKmsContent(item)"
                      :class="selectedKmsContent.KMS_CONTS_ID === item.KMS_CONTS_ID ? 'selected' : ''"
                    >
                      <span style="width: 20px">
                        <v-icon
                          v-if="item.required"
                          class="pl-icon20 document"
                        ></v-icon>
                      </span>
                      <span class="pl-link-list-title">{{ item.KMS_CONTS_NM }}</span>
                      <span class="pl-link-list-date">마지막 수정: {{ mixin_convertDate(item.MDFCN_DT, 'yyyy-MM-dd HH:mm:ss') }}</span>
                    </li>
                  </ul>
                  <!-- <h2 class="pl-subtit is-mt-m">유료회원 전환 방법</h2>
                  <div class="pl-subdesc">
                    <p >네, 고객님 학점인정 신청방법은 온라인신청, 방문신청, 단체신청 3가지가 있습니다. 어떤 방법으로 신청 도와드릴까요?</p>
                  </div>
                  <p class="is-mt-s">
                    <img
                      style="width: auto; max-width: 100%;"
                      :src="REALTIME_SEARCH.t01_img"
                      :alt="REALTIME_SEARCH.t01_img_title">
                  </p> -->
                  <div class="py-4">
                    <right_kms_detail_guide
                      v-if="!!selectedKmsContent.KMS_CONTS_ID"
                      :KMS_CONTS_ID="selectedKmsContent.KMS_CONTS_ID"
                      :PUBLIC_YN="'Y'"
                      @relContsClick="() =>{}"
                      @afterChangeContent="() =>{}"
                      :showRelConts="false"
                      :showRelLinks="true"
                      :showRelFiles="true"
                    >
                    </right_kms_detail_guide>
                  </div>
                </div>
              </v-tab-item>
              <!-- 상담요약 -->
              <v-tab-item >
                <div class="is-mt-m">
                  <div v-if="parentPage != 'sns'" class="d-flex align-center">
                    <div class="pl-chatting-cs-info d-flex flex-grow-1 align-center">
                      <div class="pl-chatting-cs-info-cus">
                        <div class="is-ellips">
                          <strong class="pl-chatting-cs-info-tit">고객 명</strong>
                          <span  class="pl-chatting-cs-info-desc">{{ REALTIME_SEARCH.CUST_NM }}</span>
                        </div>
                        <div>
                          <strong class="pl-chatting-cs-info-tit">상담일시</strong>
                          <span  class="pl-chatting-cs-info-desc">{{ REALTIME_SEARCH.REG_DT }}</span>
                        </div>
                      </div>
                      <!-- audio -->
                      <span class="col-5 ml-auto">
                        <audio
                          controls
                          name="media"
                          :src="REALTIME_SEARCH.AudioSrc"
                          type="audio/mpeg"
                        >
                        </audio>
                      </span>
                    </div>
                  </div>

                  <h2 class="pl-subtit is-mt-l">상담 내용 요약</h2>
                  <div
                    class="is-mt-m pl-summary-list"
                  >
                    <p
                      v-if="REALTIME_SEARCH.summary != ''"
                      v-html="newLine(REALTIME_SEARCH.summary)">
                    </p>
                    <!-- loader -->
                    <template v-if="REALTIME_SEARCH.isSummrizing">
                      <div class="loading loading03">
                        <span>상</span>
                        <span>담</span>
                        <span>요</span>
                        <span>약</span>
                        <span>중</span>
                        <span>입</span>
                        <span>니</span>
                        <span>다</span>
                      </div>
                    </template>
                  </div>
                  <!-- <compo-chart-loader v-if="REALTIME_SEARCH.isSummrizing"/> -->
                  <!-- <ul class="pl-list is-no-border">
                    <li
                      v-for="item in REALTIME_SEARCH.summary_list"
                      :key="item.id">
                      {{ item.depth }}
                    </li>
                  </ul> -->

                  <h2 v-if="CUTT_TYPE_VMODEL_ARR.length > 0 && CUTT_TYPE_VMODEL_ARR[0] != ''" class="pl-subtit is-mt-l">상담 유형 자동 분류</h2>
                  <ul
                    class="pl-list d-flex flex-column type-gap is-no-border is-mt-m"
                    v-if="CUTT_TYPE_VMODEL_ARR.length > 0 && CUTT_TYPE_VMODEL_ARR[0] != ''"
                  >
                    <li class="d-flex align-center" v-for="(cItem, cIdx) in CUTT_TYPE_VMODEL_ARR" :key="cIdx">
                      <label :for="('cutt_ty_radio_'+cIdx)" @click="selectCsType(CS_TYPE_SORT[cIdx])">
                        <v-chip
                          style="width: 30px; padding: 0; justify-content: center ;cursor: pointer"
                          :color="CS_TYPE_SORT[cIdx].color"
                          label
                          small
                          text-color="white"
                        >
                          <v-icon v-if="CS_TYPE_SORT[cIdx].checked">
                            mdi-check
                          </v-icon>
                          <template v-else>
                            {{ CS_TYPE_SORT[cIdx].order }}
                          </template>
                        </v-chip>
                      </label>
                      <v-autocomplete v-for="(cuttType, idx) in CUTT_TYPE_VMODEL_ARR[cIdx]" :key="idx"
                        v-model="CUTT_TYPE_VMODEL_ARR[cIdx][idx]"
                        class="pl-form is-lg ml-2 flex-grow-0"
                        :items="getChildCuttTypeItems(idx, idx===0?'':CUTT_TYPE_VMODEL_ARR[cIdx][idx-1])"
                        item-text = "CUTT_TYPE_NM"
                        item-value = "CUTT_TYPE_ID"
                        placeholder="선택하세요"
                        v-on:change="changeCuttTypeItems(cIdx, idx)"
                        no-data-text="결과 없음"
                      />
                      <input
                        style="display: none"
                        v-model="SELECTED_CUTT_TY"
                        :id="('cutt_ty_radio_'+cIdx)"
                        :value="CUTT_TYPE_VMODEL_ARR[cIdx]"
                        :checked="CS_TYPE_SORT[cIdx].checked"
                        type="radio"
                        name="CS_TYPE_RADIO"
                        class="pl-radio native-input type-check ml-2"/>
                    </li>
                  </ul>

                  <!-- 상담유형 샘플 -->
                  <!-- <h2 class="pl-subtit is-mt-l">상담 유형 자동 분류</h2>
                  <ul class="pl-list d-flex flex-column type-gap is-no-border is-mt-m">
                    <li class="d-flex align-center" v-for="item, index in CS_TYPE_SORT" :key="item.id">
                      <label :for="item.model1" @click="selectCsType(item)">
                        <v-chip
                          style="width: 30px; padding: 0; justify-content: center ;cursor: pointer"
                          :color="item.color"
                          label
                          small
                          text-color="white"
                        >
                          <v-icon v-if="item.checked">
                            mdi-check
                          </v-icon>
                          <template v-else>
                            {{ item.order }}
                          </template>
                        </v-chip>
                      </label>
                      <v-autocomplete
                        v-model="item.model1"
                        class="pl-form is-lg ml-2 flex-grow-0"
                        placeholder="선택하세요"
                      ></v-autocomplete>
                      <v-autocomplete
                        v-model="item.model2"
                        class="pl-form is-lg ml-2 flex-grow-0"
                        placeholder="선택하세요"
                      ></v-autocomplete>
                      <v-autocomplete
                        v-model="item.model3"
                        class="pl-form is-lg ml-2 flex-grow-0"
                        placeholder="선택하세요"
                      ></v-autocomplete>
                     <input
                        style="display: none"
                        :id="item.model1"
                        :checked="item.checked"
                        type="radio"
                        name="CS_TYPE_RADIO"
                        class="pl-radio native-input type-check ml-2">
                    </li>
                  </ul> -->

                </div>
              </v-tab-item>
            </v-tabs>

          </div>
          <!-- btn -->
          <div class="d-flex is-mt-m">
            <v-btn
              class="pl-btn ml-auto"
              @click="applySummary"
            >적용</v-btn>
          </div>
        </v-tab-item>
        <!-- 상담이력 -->
        <v-tab-item>
          <div class="is-mt-m">
            <!-- search -->
            <div class="pl-form-inline-wrap">
              <div class="pl-form-inline">
                <div class="pl-desc">
                  <v-select
                    class="pl-form is-sm"
                    v-model="SCH_CUTT_HIST.CHNL"
                    :items="mixin_common_code_get(this.common_code, 'CHNL', '전체')"
                    placeholder="선택하세요"
                    @change="getSearch('cutt', '')"
                  ></v-select>
                  <v-select
                    class="pl-form"
                    v-model="SCH_CUTT_HIST.CUSL_RS"
                    :items="mixin_common_code_get(this.common_code, 'CUSL_RS', '전체')"
                    placeholder="선택하세요"
                    @change="getSearch('cutt', '')"
                  ></v-select>
                  <div class="pl-calendar-range-form">
                    <compo-date-picker
                      v-model="SCH_CUTT_HIST.ST_DT"
                      DateType="dateInput"
                      :NoTitleProp="true"
                      :DateProp.sync="SCH_CUTT_HIST.ST_DT"/>
                    <span class="pl-unit">~</span>
                    <compo-date-picker
                      v-model="SCH_CUTT_HIST.END_DT"
                      DateType="dateInput"
                      :NoTitleProp="true"
                      :DateProp.sync="SCH_CUTT_HIST.END_DT"/>
                    <!-- <compo-drop-picker
                      :StartDateProp.sync="startDate"
                      :EndDateProp.sync="endDate"
                      :NudgeLeftProp=250
                      :NudgeTopProp=-10
                    /> -->
                  </div>
                  <v-btn class="pl-btn" @click="getSearch('cutt', '')">조회</v-btn>
                </div>
              </div>
              <!-- 뷰 타입 변경 -->
              <v-tooltip content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on" class="pl-viewtype-toggle ml-auto" @click="dropSelectViewtype = !dropSelectViewtype">
                    <div >
                      <v-icon
                        :class="`pl-icon20 ${VIEWTYPE.selected.icon}`"></v-icon>
                      </div>
                    </div>
                  </template>
                  <span>{{ VIEWTYPE.selected.class === 'type-grid' ? '리스트 보기': '요약 보기'}} 변경</span>
                </v-tooltip>
                <!-- //mark: 뷰타입 모달 -->
                <v-slide-y-transition>
                  <div class="pl-drop-layer is-viewToggle" v-if="dropSelectViewtype === true" v-click-outside="closeDropSelectViewtype">
                    <div class="pl-drop-layer-body">
                      <ul class="pl-drop-layer-list">
                        <li
                          v-for="item in VIEWTYPE.list"
                          :key="item.id"
                          @click="selectViewtype(item)"
                          >
                          <div class="d-flex align-center ">
                            <v-icon :class="`pl-icon20 ${item.icon}`"></v-icon>
                            <span class="pl-1">{{ item.title }}</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </v-slide-y-transition>

            </div>
            <!-- list -->
            <div
              :class="`pl-chat-history-list is-click is-mt-m ${VIEWTYPE.selected.class}`"
              :style="`${ResizeProp ? 'height: calc(100vh - 445px)' : 'height: calc(100vh - 575px)'}; margin-bottom: 14px;`">
              <ul>
                <template v-if="INTEG_CONNECT_HIST.INTEG_CUTT_HIST_LIST.length == 0">
                  <li class="pl-list-nodata">
                    <span>등록된 데이터가 없습니다.</span>
                  </li>
                </template>
                <template
                  v-else
                  v-for="(item, seq) in INTEG_CONNECT_HIST.INTEG_CUTT_HIST_LIST"
                >
                  <li
                  :key="item.ITGRT_HSTRY_ID"
                  @click="cuttHistDialog(item, seq)"
                  >
                    <!-- 컨텐츠 리스트 -->
                    <div class="pl-chat-history-list-wrap">
                      <!-- type : 카카오 = kakao, ttalk = teletalk, 전화 = call -->
                      <!-- <v-icon class="pl-icon30" :class="`mainchat-${ item.TYPE }`"></v-icon> -->
                      <!-- temp: 상담사 이미지 -->
                      <p

                        class="pl-manager-portrait">
                        <img
                          :src="item.CUSL_IMG"
                          :alt="item.CUSL_NM"
                          @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}"
                        >
                      </p>
                      <div>
                        <!-- 카테고리 -->
                        <div class="pl-chat-history-list-unit ">
                          <strong class="is-ellips">{{ item.FULL_PATH_TEMP }}</strong>
                        </div>
                        <!--상담 이력 노출 확장 속성-->
                        <template
                          v-for="attr in INTEG_CONNECT_HIST.CUSL_EXPSN_ATTR_LIST"
                        >
                          <div class="pl-chat-history-list-unit" :key="attr.EXPSN_ATTR_COL_ID">
                            <strong class="is-ellips">
                              {{ attr.EXPSN_ATTR_NM }} : {{ attr.DATA_TYPE_CD === 'COE' || attr.DATA_TYPE_CD === 'COE_MULTI'? item[`${attr.EXPSN_ATTR_COL_ID}_NM`] : item[`${attr.EXPSN_ATTR_COL_ID}`]}}
                            </strong>
                          </div>
                        </template>
                        <!--상담 이력 노출 확장 속성-->
                        <!-- 날짜 -->
                        <div class="pl-chat-history-list-unit">
                          <span class="is-txt-sub">
                            {{ mixin_convertDate(item.CUTT_BGNG_DT, 'yyyy-MM-dd HH:mm:ss') }} ~ {{ mixin_convertDate(item.CUTT_END_DT, 'HH:mm:ss') }}({{ mixin_seconds_toHHMMSS(item.PHN_HR) }})
                          </span>
                        </div>
                        <!-- 처리상태 -->
                        <div class="pl-chat-history-list-unit">
                          <!-- 뱃지 상태 클래스 참고
                            done 완료
                            after 후처리
                            cs 상담중
                            wait 대기중
                          -->
                          <span
                            :class="`pl-round-chip is-sm chat-stat-${item.status}`">
                            {{ item.CUSL_RS_NM }}
                          </span>
                          <span :class="VIEWTYPE.selected.class !== 'type-grid' ? 'ml-1' : ''">
                            {{ item.CL_TYPE_NM }}
                            &gt;
                            {{ item.CHN_TYPE_NM }}
                            <template v-if="item.CHN_CLSF_NM"> &gt; </template>
                            {{ item.CHN_CLSF_NM }}
                          </span>
                          <span class="is-txt-bull mx-1">&bull;</span>
                          <span class="is-txt-blue">
                            {{ item.CUSL_NM }}
                          </span>
                          <template v-if="mixin_getCustcoSrvcStat('TRNSF') && !mixin_isEmpty(item.TRNSF_STTS_NM)">
                            <span class="is-txt-bull mx-1">&bull;<font color="red"><b>이관 처리 상태 : </b></font></span>
                            <span class="is-txt-blue">
                              {{ item.TRNSF_STTS_NM }}
                            </span>
                          </template>
                        </div>
                      </div>
                      <span
                        v-if="VIEWTYPE.selected.class !== 'type-grid'"
                        class="pl-chat-history-list-link"
                        ></span>
                    </div>
                    <!-- 상담내용 -->
                    <div
                      v-if="VIEWTYPE.selected.class === 'type-grid'"
                      class="pl-scroll-box is-mt-s"
                      style="overflow-y: auto; height: 80px;"
                      >
                      <!-- {{ item.CUSL_CN }} -->
                      <div v-html="mixin_encodeEnter(item.CUSL_CN)"></div>
                    </div>
                  </li>
                </template>
                <!-- 더보기 있을 경우  -->
                <div class="pl-bottom-fixed" v-if="!nextDisabled">
                  <v-btn class="pl-btn is-round is-sub is-icon pl-4" @click="getSearch('cutt', 'next')">
                    더보기
                    <span class="pl-icon20 arrow-up ml-2"></span>
                  </v-btn>
                </div>
              </ul>

              <!-- 상담이력(전화) Component-->
              <v-dialog
                v-model="dialogPhnCuttHist"
                content-class="dialog-draggable"
                hide-overlay
                width="720"
              >
                <div class="draggable-area">drag area</div>
                <compo-dialog
                  header-title="상담이력"
                  @hide="mixin_hideDialog('PhnCuttHist')"
                >
                  <template slot="body">
                    <!-- component -->
                    <compo-chat-log
                      :custInfoProp="custInfoProp"
                      :cuttInfoProp="CUTT_HIST"
                      :cuttInfoSeq="seq"
                      :cuttInfoTotalCnt="Number(INTEG_CONNECT_HIST.INTEG_CUTT_HIST_CNT)"
                      :cuttInfoTotalProp="INTEG_CONNECT_HIST.INTEG_CUTT_HIST_LIST"
                      :expsnAttrList="INTEG_CONNECT_HIST.CUSL_EXPSN_ATTR_LIST"
                    />
                  </template>
                  <template slot="footer">
                    <template v-if="Number(INTEG_CONNECT_HIST.INTEG_CUTT_HIST_CNT) > 1">
                      <strong>{{ seq+1 + ' / ' + Number(INTEG_CONNECT_HIST.INTEG_CUTT_HIST_CNT) }}</strong>
                      <v-btn
                        :disabled="seq > 0?false:true"
                        class="pl-btn is-icon is-sub"
                        @click="seq--"
                      >
                        <span class="pl-icon20 is-list-up"></span>
                        다음 상담 내용
                      </v-btn>
                      <v-btn
                        :disabled="seq+1 < Number(INTEG_CONNECT_HIST.INTEG_CUTT_HIST_CNT)?false:true"
                        class="pl-btn is-icon is-sub"
                        @click="nextCuttInfo"
                        :loading="TMP_LOADING"
                      >
                        <span class="pl-icon20 is-list-down"></span>
                        이전 상담 내용
                      </v-btn>
                    </template>
                    <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('PhnCuttHist')">닫기</v-btn>
                  </template>
                </compo-dialog>
              </v-dialog>
              <!-- 상담이력(SNS) Component -->
              <v-dialog
                v-if="dialogSnsCuttHist"
                v-model="dialogSnsCuttHist"
                content-class="dialog-draggable"
                hide-overlay
                width="720"
              >
                <div class="draggable-area">drag area</div>
                <compo-dialog
                  header-title="상담이력"
                  @hide="mixin_hideDialog('SnsCuttHist')"
                >
                  <template slot="body">
                    <!-- component -->
                    <compo-chat-log
                      :custInfoProp="custInfoProp"
                      :cuttInfoProp="CUTT_HIST"
                      :cuttInfoSeq="seq"
                      :cuttInfoTotalCnt="Number(INTEG_CONNECT_HIST.INTEG_CUTT_HIST_CNT)"
                      :cuttInfoTotalProp="INTEG_CONNECT_HIST.INTEG_CUTT_HIST_LIST"
                      :ChatLogProp="CHAT_LOG"
                    />
                  </template>
                  <template slot="footer">
                    <template v-if="Number(INTEG_CONNECT_HIST.INTEG_CUTT_HIST_CNT) > 1">
                      <strong>{{ seq+1 + ' / ' + Number(INTEG_CONNECT_HIST.INTEG_CUTT_HIST_CNT) }}</strong>
                      <v-btn
                        :disabled="seq > 0?false:true"
                        class="pl-btn is-icon is-sub"
                        @click="seq--"
                      >
                        <span class="pl-icon20 is-list-up"></span>
                        다음 상담 내용
                      </v-btn>
                      <v-btn
                        :disabled="seq+1 < Number(INTEG_CONNECT_HIST.INTEG_CUTT_HIST_CNT)?false:true"
                        class="pl-btn is-icon is-sub"
                        @click="nextCuttInfo"
                        :loading="TMP_LOADING"
                      >
                        <span class="pl-icon20 is-list-down"></span>
                        이전 상담 내용
                      </v-btn>
                    </template>
                    <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('SnsCuttHist')">닫기</v-btn>
                  </template>
                </compo-dialog>
              </v-dialog>
            </div>
            <div class="pl-chat-history-list-bottom"></div>
          </div>
        </v-tab-item>
        <!-- AS 이력 -->
        <v-tab-item v-if="mixin_getCustcoSrvcStat('AS_ALTMNT')">
          <div class="is-mt-m">
            <!-- search -->
            <div class="pl-form-inline-wrap">
              <div class="pl-form-inline">
                <div class="pl-desc">
                  <v-select
                    class="pl-form is-sm"
                    v-model="SCH_VST_RSVT.STTS_CD"
                    :items="mixin_common_code_get(this.common_code, 'VST_RSVT_STAT', '전체')"
                    placeholder="선택하세요"
                    @change="getSearch('cutt', '')"
                  ></v-select>
                  <div class="pl-calendar-range-form">
                    <compo-date-picker

                      DateType="dateInput"
                      :NoTitleProp="true"
                      :DateProp.sync="SCH_VST_RSVT.ST_DT"/>
                    <span class="pl-unit">~</span>
                    <compo-date-picker

                      DateType="dateInput"
                      :NoTitleProp="true"
                      :DateProp.sync="SCH_VST_RSVT.END_DT"/>
                  </div>
                  <v-btn class="pl-btn" @click="getSearch('vstRsvt', '')">조회</v-btn>
                </div>
              </div>
            </div>
            <!-- list -->
            <div
              class="pl-chat-history-list is-mt-m"
              :style="ResizeProp ? 'height: calc(100vh - 445px)' : 'height: calc(100vh - 575px)'">
              <ul>
                <template v-if="INTEG_CONNECT_HIST.VST_RSVT_LIST.length == 0">
                  <li class="pl-list-nodata">
                    <span>등록된 데이터가 없습니다.</span>
                  </li>
                </template>
                <template
                  v-else
                  v-for="item, index in INTEG_CONNECT_HIST.VST_RSVT_LIST"
                >
                  <li
                  :key="index"
                  >
                    <!-- 컨텐츠 리스트 -->
                    <div class="pl-chat-history-list-wrap">
                      <!-- 매니저 이미지 -->
                      <p
                        class="pl-manager-portrait">
                        <img
                          :src="item.VSTR_IMG"
                          :alt="item.VSTR_NM"
                          @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}"
                        >
                      </p>
                      <!-- 상세 -->
                      <div>
                        <div class="pl-campaign-list-unit">
                          <span class="pl-campaign-list-title is-fixed">AS 기사</span>
                          <span>{{ item.VSTR_NM }}</span>
                          <span class="is-txt-bull mx-1">&bull;</span>
                          <span>{{ item.DEPT_NM }}</span>
                        </div>
                        <div class="pl-campaign-list-unit">
                          <span class="pl-campaign-list-title is-fixed">서비스유형</span>
                          <span>{{ item.SRVC_TYPE_NM }}</span>
                        </div>
                        <div class="pl-campaign-list-unit">
                          <span class="pl-campaign-list-title is-fixed">예약 일시</span>
                          <span>{{ mixin_convertDate(item.RSVT_BGNG_DT, 'yyyy-MM-dd HH:mm:ss') }}</span>
                          <span class="is-txt-bull mx-1">&bull;</span>
                          <span>{{ item.PRDCT_NM }}</span>
                        </div>
                        <div class="pl-campaign-list-unit">
                          <span class="pl-campaign-list-title is-fixed">배정 일시</span>
                          <span>{{ mixin_convertDate(item.ALTMNT_DT, 'yyyy-MM-dd HH:mm:ss') }}</span>
                          <span class="is-txt-bull mx-1">&bull;</span>
                          <span>{{ item.ALTMNT_RGTR_NM }}</span>
                        </div>
                        <div class="pl-campaign-list-unit align-center">
                          <span class="pl-campaign-list-title is-fixed">처리 상태</span>
                          <span :class="`align-self-center pl-round-chip is-sm ${ mixin_displayStatus(item.STTS_CD, `as_statList`) }`" >
                            {{ item.STTS_NM }}
                          </span>
                          <span
                            class="ml-1"
                            v-if="item.STTS_CD !== 'VRS_ALTMNT'">{{ mixin_convertDate(item.STTS_REG_DT, 'yyyy-MM-dd HH:mm:ss') }}</span><!--완료인 경우-->
                          <compo-tooltip-btn
                            v-if="item.STTS_CD === 'VRS_ALTMNT'"
                            TitleProp="예약 변경"
                            ClassProp="pl-tooltip-btn ml-1"
                            IconProp="pl-icon20 edit"
                            TooltipPositionProp="bottom"
                            @btnClick="$eventBus.$emit('dialogAssignManager', item)"
                          ></compo-tooltip-btn>
                          <compo-tooltip-btn
                            v-if="item.STTS_CD === 'VRS_ALTMNT'"
                            TitleProp="예약 취소"
                            ClassProp="pl-tooltip-btn ml-1"
                            IconProp="pl-icon20 cancel"
                            TooltipPositionProp="bottom"
                            @btnClick="vstRsvtCancel(item)"
                          ></compo-tooltip-btn>
                        </div>

                      </div>
                       <!-- 전화 걸기 버튼 -->
                       <v-btn
                          v-if="item.STTS_CD === 'VRS_ALTMNT'"
                          fab
                          class="ml-auto"
                          color="#08BC2F"
                          elevation="0"
                          width="40"
                          height="40"
                          @click="$eventBus.$emit('videoCall', item)"
                        >
                          <v-icon
                             class="pl-icon20 call-video"
                          ></v-icon>
                        </v-btn>
                        <!-- <span
                        class="pl-chat-history-list-link"
                        ></span> -->
                    </div>
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </v-tab-item>
        <!-- VOC -->
        <!-- <v-tab-item>
          <div class="is-mt-m">
            <div class="pl-form-inline-wrap">
              <div class="pl-form-inline">
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    v-model="SCH_VOC.CHNL"
                    :items="mixin_common_code_get(this.common_code, 'CHNL', '전체')"
                    placeholder="선택하세요"
                    @change="getSearch('voc', '')"
                  ></v-select>
                  <v-select
                    class="pl-form"
                    v-model="SCH_VOC.CUSL_RS"
                    :items="mixin_common_code_get(this.common_code, 'CUSL_RS', '전체')"
                    placeholder="선택하세요"
                    @change="getSearch('voc', '')"
                  ></v-select>
                  <div class="pl-calendar-range-form">
                    <compo-date-picker
                      v-model="SCH_VOC.ST_DT"
                      DateType="dateInput"
                      :NoTitleProp="true"
                      :DateProp.sync="SCH_VOC.ST_DT"/>
                    <span class="pl-unit">~</span>
                    <compo-date-picker
                      v-model="SCH_VOC.END_DT"
                      DateType="dateInput"
                      :NoTitleProp="true"
                      :DateProp.sync="SCH_VOC.END_DT"/>
                  </div>
                  <v-btn class="pl-btn" @click="getSearch('voc', '')">조회</v-btn>
                </div>
              </div>
            </div>
            <div
              class="pl-chat-history-list is-mt-m"
              :style="ResizeProp ? 'height: calc(100vh - 445px)' : 'height: calc(100vh - 575px)'">
              <ul>
                <template v-if="INTEG_CONNECT_HIST.VOC_LIST.length == 0">
                  <li class="pl-list-nodata">
                    <span>등록된 데이터가 없습니다.</span>
                  </li>
                </template>
                <template
                  v-else
                  v-for="item in INTEG_CONNECT_HIST.VOC_LIST"
                >
                  <li
                  :key="item.VOC_RCPT_ID"
                  @click="mixin_testLog(item.VOC_RCPT_ID)"
                  >
                    <div class="pl-chat-history-list-wrap">
                      <v-icon class="pl-icon30 mainchat-voc"></v-icon>
                      <div>
                        <div class="pl-chat-history-list-unit">
                          접수일시 :
                          <span class="is-txt-sub ml-1">
                            {{ mixin_convertDate(item.REG_DT, 'yyyy-MM-dd HH:mm:ss') }}
                          </span>
                          <span>
                            ({{ item.CL_TYPE_NM }} > {{ item.CHN_TYPE_NM }})
                          </span>
                          <span class="is-txt-bull mx-1">&bull;</span>
                          <span>
                            접수자({{ item.CUSL_NM }})
                          </span>
                          <span class="is-txt-bull mx-1">&bull;</span>
                        </div>
                        <div class="pl-chat-history-list-unit">
                          VOC 유형<strong>({{ item.VOC_TYPE_NM }})</strong>
                          <span class="is-txt-bull mx-1">&bull;</span>
                          결과통보<strong>({{ item.RSLT_PVSN_NM }})</strong>
                          <span class="is-txt-bull mx-1">&bull;</span>
                          통보수단<strong>({{ item.RSLT_PVSN_MTHD_NM }})</strong>
                        </div>
                      </div>
                    </div>
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </v-tab-item> -->
        <!-- 문자발송이력 -->
        <v-tab-item>
          <div class="is-mt-m">
            <!-- search -->
            <div class="pl-form-inline-wrap">
              <div class="pl-form-inline">
                <div class="pl-desc">
                  <v-select
                    class="pl-form is-sm"
                    v-model="SCH_MSG.SNDNG_SE_CD"
                    :items="mixin_common_code_get(this.common_code, 'MTS_TP', '전체')"
                    placeholder="선택하세요"
                    @change="getSearch('msg', '')"
                  ></v-select>
                  <v-select
                    class="pl-form"
                    v-model="SCH_MSG.RSLT_CD"
                    :items="MSG_RSLT_ITEM"
                    placeholder="선택하세요"
                    @change="getSearch('msg', '')"
                  ></v-select>
                  <div class="pl-calendar-range-form">
                    <compo-date-picker
                      v-model="SCH_MSG.ST_DT"
                      DateType="dateInput"
                      :NoTitleProp="true"
                      :DateProp.sync="SCH_MSG.ST_DT"/>
                    <span class="pl-unit">~</span>
                    <compo-date-picker
                      v-model="SCH_MSG.END_DT"
                      DateType="dateInput"
                      :NoTitleProp="true"
                      :DateProp.sync="SCH_MSG.END_DT"/>
                  </div>
                  <v-btn class="pl-btn" @click="getSearch('msg', '')">조회</v-btn>
                </div>
              </div>
            </div>
            <!-- list -->
            <div
              class="pl-chat-history-list is-mt-m"
              :style="ResizeProp ? 'height: calc(100vh - 445px)' : 'height: calc(100vh - 575px)'">
              <ul>
                <template v-if="INTEG_CONNECT_HIST.MSG_LIST.length == 0">
                  <li class="pl-list-nodata">
                    <span>등록된 데이터가 없습니다.</span>
                  </li>
                </template>
                <template
                  v-else
                  v-for="item in INTEG_CONNECT_HIST.MSG_LIST"
                >
                  <li
                  :key="item.MTS_SNDNG_HSTRY_ID"
                  @click="msgSendHistDialog(item)"
                  >
                    <!-- 컨텐츠 리스트 -->
                    <div class="pl-chat-history-list-wrap">
                      <p
                        class="pl-manager-portrait">
                        <img
                          :src="item.CUSL_IMG"
                          :alt="item.CUSL_NM"
                          @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}"
                        >
                      </p>
                      <div>
                        <div class="pl-campaign-list-unit">
                          <span class="pl-campaign-list-title">발신 일시</span>
                          <span>{{ mixin_convertDate(item.SNDNG_DT, 'yyyy-MM-dd HH:mm:ss') }}</span>
                        </div>
                        <div class="pl-campaign-list-unit">
                          <span class="pl-campaign-list-title">발신 구분</span>
                          <span>
                            {{ (item.SNDNG_SE_CD === 'ATALK'? '알림톡': '문자 > ' + item.SNDNG_SE_CD) }}
                          </span>
                          <span class="is-txt-bull mx-1">&bull;</span>
                          <span class="is-txt-blue">
                            {{ item.CUSL_NM }}
                          </span>
                        </div>
                        <div class="pl-campaign-list-unit is-ellips d-block" style="width: 580px">
                          {{ mixin_decode(item.SNDNG_CN.split('\n')[0]) }}
                        </div>
                        <div class="pl-campaign-list-unit">
                          <span
                            :class="`pl-round-chip is-sm chat-stat-${item.status}`"
                          >
                            {{ item.RSLT_CD_NM }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </v-tab-item>
        <!-- 예약콜 -->
        <v-tab-item>
          <div class="is-mt-m">
            <!-- search -->
            <div class="pl-form-inline-wrap">
              <div class="pl-form-inline">
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    v-model="SCH_RSVT_CALL.CUSL_RS"
                    :items="mixin_common_code_get(this.common_code, 'CUSL_RS', '전체')"
                    placeholder="선택하세요"
                    @change="getSearch('rsvt', '')"
                  ></v-select>
                  <div class="pl-calendar-range-form">
                    <compo-date-picker
                      v-model="SCH_RSVT_CALL.ST_DT"
                      DateType="dateInput"
                      :NoTitleProp="true"
                      :DateProp.sync="SCH_RSVT_CALL.ST_DT"/>
                    <span class="pl-unit">~</span>
                    <compo-date-picker
                      v-model="SCH_RSVT_CALL.END_DT"
                      DateType="dateInput"
                      :NoTitleProp="true"
                      :DateProp.sync="SCH_RSVT_CALL.END_DT"/>
                    <!-- <compo-drop-picker
                      :StartDateProp.sync="SCH_RSVT_CALL.ST_DT"
                      :EndDateProp.sync="SCH_RSVT_CALL.END_DT"
                      :NudgeLeftProp=250
                      :NudgeTopProp=-10
                    /> -->
                  </div>
                  <v-btn class="pl-btn" @click="getSearch('rsvt', '')">조회</v-btn>
                </div>
              </div>
            </div>
            <!-- list -->
            <div
              class="pl-chat-history-list is-mt-m"
              :style="ResizeProp ? 'height: calc(100vh - 445px)' : 'height: calc(100vh - 575px)'">
              <ul>
                <template v-if="INTEG_CONNECT_HIST.RSVT_CALL_LIST.length == 0">
                  <li class="pl-list-nodata">
                    <span>등록된 데이터가 없습니다.</span>
                  </li>
                </template>
                <template
                  v-else
                  v-for="data, index in INTEG_CONNECT_HIST.RSVT_CALL_LIST"
                >
                  <li
                    v-if="data.PHN_CUTT_ID === data.RSVT_PHN_CUTT_ID"
                    :key="data.id"
                    class="pb-0"
                  >
                    <div class="pl-chat-history-list-wrap">
                      <v-icon class="pl-icon30 mainchat-reserve"></v-icon>
                      <div>
                        <div class="pl-campaign-list-unit">
                          <span class="pl-campaign-list-title">예약 일시</span>
                          <span>{{ mixin_convertDate(data.RSVT_BGNG_DT, 'yyyy-MM-dd HH:mm:ss') }}</span>
                        </div>
                        <div class="pl-campaign-list-unit">
                          <span class="pl-campaign-list-title">고객명</span>
                          <span>
                            {{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(data.CUST_NM) : data.CUST_NM }} ({{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(data.CUST_PHN_NO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(data.CUST_PHN_NO.replace(/[^0-9]/g, "")) }})
                            <span><strong>총({{ data.CALL_TRY_CNT }})회</strong> 시도</span>&nbsp;
                            <span class="is-txt-bull mx-1">&bull;</span>
                            <span class="is-txt-blue">
                              {{ data.CUSL_NM }}
                            </span>
                          </span>
                        </div>
                        <div class="pl-campaign-list-unit">
                          <span class="pl-campaign-list-title">최근통화</span>
                          <span v-if="data.MAX_REG_DT">
                            {{ mixin_convertDate(data.MAX_REG_DT, 'yyyy-MM-dd HH:mm:ss') }}
                            <!-- <strong class="ml-2" :class="`is-txt-${ data.status }`">{{ data.CUSL_RS_NM }}</strong> -->
                          </span>
                          <span v-else>
                            통화내역 없음.
                          </span>
                          &nbsp;<span :class="`pl-round-chip is-sm chat-stat-${data.status}`">{{ data.CUSL_RS_NM }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-center">
                      <!-- 상세 버튼 -->
                      <compo-tooltip-btn
                        :DisabledProp="!data.MAX_REG_DT"
                        TitleProp="상세"
                        ClassProp="pl-tooltip-btn"
                        :IconProp=toggeleRsvtExpandClass(index)
                        TooltipPositionProp="bottom"
                        @btnClick="data.MAX_REG_DT?toggeleRsvtExpand(index):''"
                      ></compo-tooltip-btn>
                    </div>
                    <!-- expand -->
                    <div v-show="data.expand" class="pl-campaign-list-child">
                      <template
                        v-for="child in INTEG_CONNECT_HIST.RSVT_CALL_LIST"
                        v-if="child.RSVT_PHN_CUTT_ID === data.PHN_CUTT_ID && child.RSVT_PHN_CUTT_ID !== child.PHN_CUTT_ID"
                      >
                        <div :key="child.id">
                          <div class="pl-campaign-list-child-wrap">
                            <span class="pl-campaign-list-child-unit2">
                              <v-icon class="pl-icon20 calendar-date"></v-icon>
                              <span class="pl-campaign-list-child-title2 ml-2 pr-2">
                                예약일 :
                              </span>
                              <span class="pl-campaign-list-child-desc">
                                <span v-if="child.CHG_RSVT_DT">{{ mixin_convertDate(child.CHG_RSVT_DT, 'yyyy-MM-dd HH:mm:ss') }}</span>
                                <span v-else>예약 없음.</span>
                                <span class="is-txt-bull mx-1">&bull;</span>
                                <span>{{ child.CL_TYPE_NM }} > 전화</span>
                                <span class="is-txt-bull mx-1">&bull;</span>
                                <span>상담직원({{ child.CUSL_NM }})</span>
                              </span>
                            </span>
                            <span class="pl-campaign-list-child-unit2 mt-1">
                              <span class="pl-campaign-list-child-desc d-flex">
                                <v-icon class="pl-icon20 calendar-list mr-2" style="flex: 0 0 20px"></v-icon>
                                <span>
                                  <!-- {{ child.CUTT_CN }} -->
                                  <div v-html="mixin_encodeEnter(child.CUTT_CN)"></div>
                                </span>
                              </span>
                            </span>
                          </div>
                        </div>
                      </template>
                    </div>
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </v-tab-item>
        <!-- 콜백 -->
        <v-tab-item>
          <div class="is-mt-m">
            <!-- search -->
            <div class="pl-form-inline-wrap">
              <div class="pl-form-inline">
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    v-model="SCH_CALL_BACK.CUSL_RS"
                    :items="mixin_common_code_get(this.common_code, 'CUSL_RS', '전체')"
                    placeholder="선택하세요"
                    @change="getSearch('callback', '')"
                  ></v-select>
                  <div class="pl-calendar-range-form">
                    <compo-date-picker
                      v-model="SCH_CALL_BACK.ST_DT"
                      DateType="dateInput"
                      :NoTitleProp="true"
                      :DateProp.sync="SCH_CALL_BACK.ST_DT"/>
                    <span class="pl-unit">~</span>
                    <compo-date-picker
                      v-model="SCH_CALL_BACK.END_DT"
                      DateType="dateInput"
                      :NoTitleProp="true"
                      :DateProp.sync="SCH_CALL_BACK.END_DT"/>
                    <!-- <compo-drop-picker
                      :StartDateProp.sync="SCH_CALL_BACK.ST_DT"
                      :EndDateProp.sync="SCH_CALL_BACK.END_DT"
                      :NudgeLeftProp=250
                      :NudgeTopProp=-10
                    /> -->
                  </div>
                  <v-btn class="pl-btn" @click="getSearch('callback', '')">조회</v-btn>
                </div>
              </div>
            </div>
            <!-- list -->
            <div
              class="pl-chat-history-list is-mt-m"
              :style="ResizeProp ? 'height: calc(100vh - 445px)' : 'height: calc(100vh - 575px)'">
              <ul>
                <template v-if="INTEG_CONNECT_HIST.CALL_BACK_LIST.length == 0">
                  <li class="pl-list-nodata">
                    <span>등록된 데이터가 없습니다.</span>
                  </li>
                </template>
                <template
                  v-else
                  v-for="data, index in INTEG_CONNECT_HIST.CALL_BACK_LIST"
                >
                  <li
                    v-if="data.PHN_CUTT_ID === ''"
                    :key="data.id"
                  >
                    <div class="pl-chat-history-list-wrap">
                      <v-icon class="pl-icon30 mainchat-callback" ></v-icon>
                      <div>
                        <div class="pl-campaign-list-unit">
                          <span class="pl-campaign-list-title">인입일시</span>
                          <span>{{ mixin_convertDate(data.DRWI_DT, 'yyyy-MM-dd HH:mm:ss') }}</span>
                        </div>
                        <div class="pl-campaign-list-unit">
                          <span class="pl-campaign-list-title">배정일시</span>
                          <span>
                            {{ mixin_convertDate(data.ALTMNT_DT, 'yyyy-MM-dd HH:mm:ss') }}
                            <span><strong>총({{ data.CALL_TRY_CNT }})회</strong> 시도</span>&nbsp;
                            <span class="is-txt-bull mx-1">&bull;</span>
                            <span class="is-txt-blue">
                              {{ data.CUSL_NM }}
                            </span>
                          </span>
                        </div>
                        <div class="pl-campaign-list-unit">
                          <span class="pl-campaign-list-title">최근통화</span>
                          <span v-if="data.MAX_REG_DT">
                            {{ mixin_convertDate(data.MAX_REG_DT, 'yyyy-MM-dd HH:mm:ss') }}
                            <strong class="ml-2" :class="`is-txt-${ data.status }`">{{ data.CUSL_RS_NM }}</strong>
                            <!-- <span>({{ data.sub_status }})</span> -->
                          </span>
                          <span v-else>
                            통화내역 없음.
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="text-center">
                      <!-- 상세 버튼 -->
                      <compo-tooltip-btn
                        :DisabledProp="!data.MAX_REG_DT"
                        TitleProp="상세"
                        ClassProp="pl-tooltip-btn"
                        :IconProp=toggeleClbkExpandClass(index)
                        TooltipPositionProp="bottom"
                        @btnClick="data.CALL_TRY_CNT > 0 ?toggeleClbkExpand(index):''"
                      ></compo-tooltip-btn>
                    </div>
                    <!-- expand -->
                    <div v-show="data.expand" class="pl-campaign-list-child">
                      <template
                        v-for="child in INTEG_CONNECT_HIST.CALL_BACK_LIST"
                        v-if="child.PHN_CUTT_ID !== '' && data.CLBK_ID === child.CLBK_ID && data.CUSL_ID === child.CUSL_ID && data.CUST_ID === child.CUST_ID"
                      >
                        <div :key="child.id">
                          <div><strong>{{ child.RNUM }}차 시도</strong></div>
                          <div class="pl-campaign-list-child-wrap">
                            <span class="pl-campaign-list-child-unit">
                              <span class="pl-campaign-list-child-title">
                                상담 시작시간
                              </span>
                              <span class="pl-campaign-list-child-desc">
                                {{ mixin_convertDate(child.CUTT_BGNG_DT, 'yyyy-MM-dd HH:mm:ss') }}
                              </span>
                            </span>
                            <span class="pl-campaign-list-child-unit">
                              <span class="pl-campaign-list-child-title">
                                처리상태
                              </span>
                              <span class="pl-campaign-list-child-desc">
                                {{ child.CUSL_RS_NM }}
                              </span>
                            </span>
                            <span class="pl-campaign-list-child-unit">
                              <span class="pl-campaign-list-child-title">
                                상담 종료시간
                              </span>
                              <span class="pl-campaign-list-child-desc">
                                {{ mixin_convertDate(child.CUTT_END_DT, 'yyyy-MM-dd HH:mm:ss') }}
                              </span>
                            </span>
                            <span class="pl-campaign-list-child-unit">
                              <span class="pl-campaign-list-child-title">
                                결과
                              </span>
                              <span class="pl-campaign-list-child-desc">
                                {{ child.CAMP_RS_NM }}
                              </span>
                            </span>
                            <span class="pl-campaign-list-child-text ">
                              <span class="pl-campaign-list-child-desc">
                                <!-- {{ child.CUTT_CN }} -->
                                <div v-html="mixin_encodeEnter(child.CUTT_CN)"></div>
                              </span>
                            </span>
                          </div>
                        </div>
                      </template>
                    </div>
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </v-tab-item>
        <!-- 캠페인 -->
        <v-tab-item>
          <div class="is-mt-m">
            <!-- search -->
            <div class="pl-form-inline-wrap">
              <div class="pl-form-inline">
                <div class="pl-desc">
                  <v-select
                    class="pl-form"
                    v-model="SCH_CPI.CUSL_RS"
                    :items="mixin_common_code_get(this.common_code, 'CUSL_RS', '전체')"
                    placeholder="선택하세요"
                    @change="getSearch('cpi', '')"
                  ></v-select>
                  <div class="pl-calendar-range-form">
                    <compo-date-picker
                      v-model="SCH_CPI.ST_DT"
                      DateType="dateInput"
                      :NoTitleProp="true"
                      :DateProp.sync="SCH_CPI.ST_DT"/>
                    <span class="pl-unit">~</span>
                    <compo-date-picker
                      v-model="SCH_CPI.END_DT"
                      DateType="dateInput"
                      :NoTitleProp="true"
                      :DateProp.sync="SCH_CPI.END_DT"/>
                    <!-- <compo-drop-picker
                      :StartDateProp.sync="SCH_CPI.ST_DT"
                      :EndDateProp.sync="SCH_CPI.END_DT"
                      :NudgeLeftProp=250
                      :NudgeTopProp=-10
                    /> -->
                  </div>
                  <v-btn class="pl-btn" @click="getSearch('cpi', '')">조회</v-btn>
                </div>
              </div>
            </div>
            <!-- list -->
            <div
              class="pl-chat-history-list is-mt-m"
              :style="ResizeProp ? 'height: calc(100vh - 445px)' : 'height: calc(100vh - 575px)'">
              <ul>
                <template v-if="INTEG_CONNECT_HIST.CPI_LIST.length == 0">
                  <li class="pl-list-nodata">
                    <span>등록된 데이터가 없습니다.</span>
                  </li>
                </template>
                <template
                  v-else
                  v-for="data, index in INTEG_CONNECT_HIST.CPI_LIST"
                >
                  <li
                    v-if="data.PHN_CUTT_ID === ''"
                    :key="data.id"
                  >
                    <div class="pl-chat-history-list-wrap">
                      <v-icon class="pl-icon30 mainchat-campaign" ></v-icon>
                      <div>
                        <div class="pl-campaign-list-unit">
                          <span class="pl-campaign-list-title">캠페인</span>
                          <span>{{ data.CPI_NM }} ({{ mixin_convertDate(data.CPI_BGNG_DT, 'yyyy-MM-dd') }} ~ {{ mixin_convertDate(data.CPI_END_DT, 'yyyy-MM-dd') }})</span>
                        </div>
                        <div class="pl-campaign-list-unit">
                          <span class="pl-campaign-list-title">고객명</span>
                          <span>
                            {{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(data.CUST_NM) : data.CUST_NM }} ({{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(data.CUST_PHN_NO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(data.CUST_PHN_NO.replace(/[^0-9]/g, "")) }})
                            <span><strong>총({{ data.CALL_TRY_CNT }})회</strong> 시도</span>&nbsp;
                            <span class="is-txt-bull mx-1">&bull;</span>
                            <span class="is-txt-blue">
                              {{ data.CUSL_NM }}
                            </span>
                          </span>
                        </div>
                        <div class="pl-campaign-list-unit">
                          <span class="pl-campaign-list-title">최근통화</span>
                          <span v-if="data.MAX_REG_DT">
                            {{ mixin_convertDate(data.MAX_REG_DT, 'yyyy-MM-dd HH:mm:ss') }}
                            <strong class="ml-2" :class="`is-txt-${ data.status }`">{{ data.CUSL_RS_NM }}</strong>
                            <!-- <span>({{ data.sub_status }})</span> -->
                          </span>
                          <span v-else>
                            통화내역 없음.
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="text-center">
                      <!-- 상세 버튼 -->
                      <compo-tooltip-btn
                        :DisabledProp="!data.MAX_REG_DT"
                        TitleProp="상세"
                        ClassProp="pl-tooltip-btn"
                        :IconProp=toggeleExpandClass(index)
                        TooltipPositionProp="bottom"
                        @btnClick="data.CALL_TRY_CNT > 0 ?toggeleExpand(index):''"
                      ></compo-tooltip-btn>
                    </div>
                    <!-- expand -->
                    <div v-show="data.expand" class="pl-campaign-list-child">
                      <template
                        v-for="child in INTEG_CONNECT_HIST.CPI_LIST"
                        v-if="child.PHN_CUTT_ID !== '' && data.CPI_ID === child.CPI_ID && data.CUSL_ID === child.CUSL_ID && data.CUST_ID === child.CUST_ID"
                      >
                        <div :key="child.id">
                          <div><strong>{{ child.RNUM }}차 시도</strong></div>
                          <div class="pl-campaign-list-child-wrap">
                            <span class="pl-campaign-list-child-unit">
                              <span class="pl-campaign-list-child-title">
                                <v-icon class="pl-icon20 calendar-date "></v-icon>
                                상담 시작시간
                              </span>
                              <span class="pl-campaign-list-child-desc">
                                {{ mixin_convertDate(child.CUTT_BGNG_DT, 'yyyy-MM-dd HH:mm:ss') }}
                              </span>
                            </span>
                            <span class="pl-campaign-list-child-unit">
                              <span class="pl-campaign-list-child-title">
                                처리상태
                              </span>
                              <span class="pl-campaign-list-child-desc">
                                {{ child.CUSL_RS_NM }}
                              </span>
                            </span>
                            <span class="pl-campaign-list-child-unit">
                              <span class="pl-campaign-list-child-title pl-6">
                                상담 종료시간
                              </span>
                              <span class="pl-campaign-list-child-desc">
                                {{ mixin_convertDate(child.CUTT_END_DT, 'yyyy-MM-dd HH:mm:ss') }}
                              </span>
                            </span>
                            <span class="pl-campaign-list-child-unit">
                              <span class="pl-campaign-list-child-title">
                                결과
                              </span>
                              <span class="pl-campaign-list-child-desc">
                                {{ child.CAMP_RS_NM }}
                              </span>
                            </span>
                            <span class="pl-campaign-list-child-text ">
                              <v-icon class="pl-icon20 calendar-list "></v-icon>
                              <span class="pl-campaign-list-child-desc">
                                <!-- {{ child.CUTT_CN }} -->
                                <div v-html="mixin_encodeEnter(child.CUTT_CN)"></div>
                              </span>
                            </span>
                          </div>
                        </div>
                      </template>
                    </div>
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </v-tab-item>
      </v-tabs>
      <!-- dialog -->
      <v-dialog
        v-model="dialogSelectedDetail"
        content-class="dialog-draggable"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="발송 상세 정보"
          @hide="closeSendHistoryDetail"
        >
          <template slot="body">
            <div class="pl-chatting-cs-info">
              <div class="pl-chatting-cs-info-cus">
                <div>
                  <strong class="pl-chatting-cs-info-tit">수신자</strong>
                  <span  class="pl-chatting-cs-info-desc">{{ MSG_SEND_HIST.RCPTN_PHN_NO ? mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(MSG_SEND_HIST.RCPTN_PHN_NO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(MSG_SEND_HIST.RCPTN_PHN_NO.replace(/[^0-9]/g, "")) : MSG_SEND_HIST.RCPTN_PHN_NO }}</span>
                </div>
                <div>
                  <strong class="pl-chatting-cs-info-tit">발송자</strong>
                  <span  class="pl-chatting-cs-info-desc">{{ MSG_SEND_HIST.CUSL_NM }}</span>
                </div>
                <div>
                  <strong class="pl-chatting-cs-info-tit">발송구분</strong>
                  <span  class="pl-chatting-cs-info-desc">{{ (MSG_SEND_HIST.SNDNG_SE_CD === 'ATALK'? '알림톡': '문자 > ' + MSG_SEND_HIST.SNDNG_SE_CD) }}</span>
                </div>
                <div>
                  <strong class="pl-chatting-cs-info-tit">발송일시</strong>
                  <span  class="pl-chatting-cs-info-desc">{{ mixin_convertDate(MSG_SEND_HIST.SNDNG_DT, 'yyyy-MM-dd HH:mm:ss') }}</span>
                </div>
              </div>
            </div>
            <div class="pl-form-inline-wrap vertical type-2 is-mt-m">
              <div class="pl-form-inline">
                <span class="pl-label">발송 내용</span>
                <div class="pl-desc">
                  <v-textarea
                    class="pl-form is-noresize"
                    v-model="MSG_SEND_HIST.SNDNG_CN"
                    height="250"
                    :spellcheck="false"
                    readonly
                  />
                </div>
              </div>

            </div>
          </template>
          <template slot="footer">
            <v-btn class="pl-btn is-sub" @click="closeSendHistoryDetail">닫기</v-btn>
          </template>

        </compo-dialog>
      </v-dialog>

      <!-- 사유 dialog-->
    <v-dialog
      v-model="dialogCommonReason"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :header-title="dialogTitl"
        @hide="[mixin_hideDialog('CommonReason'), vstVstrRdyProc('DEL')]"
      >
        <template slot="search">
        </template>
        <template slot="body">
          <div>
            <v-radio-group v-model="STTS_DTL_CD">
              <v-radio
                v-for="(code, idx) in REASON_TP_LIST"
                :key="REASON_TP_LIST[idx].text"
                :label="code.text"
                :value="code.value"
                class="pl-radio"
              >
              </v-radio>
              <div class="pl-desc">
                <v-textarea
                  :disabled="STTS_DTL_CD.indexOf('_ETC') === -1"
                  v-model="CN"
                  class="pl-form is-noresize"
                  :spellcheck="false"
                />
              </div>
            </v-radio-group>
          </div>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="[mixin_hideDialog('CommonReason'), vstVstrRdyProc('DEL')]">닫기</v-btn>
          <v-btn class="pl-btn" @click="vstRsvtProc">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    </div>
  </div>
</template>
<script>
  import { template } from 'lodash';
import right_kms_detail_guide from '../right_kms_detail_guide.vue';

  export default {
    name: 'Mainchat_all_log',
    props: {
      CHNL: {
        type: String
        , default: 'TEL'
      },
      CUST_ID: {
        type: Number
        , default: -1
      },
      DataProp: {
        type: Object,
      },
      custInfoProp: {
        type: Object,
      },
      ResizeProp: {
        type: Boolean,
        default: false
      },
    },
    components: {
      right_kms_detail_guide,
    },
    data() {
      return {
        common_code : [],
        parentPage: '',
        mainTabs: 0,
        realtimeTabs:0,
        REALTIME_TAB_STAT : false, //실시간 검색 탭 상태

        startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        endDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

        // CUST_INFO : [], //고객 기본 정보

        dialogPhnCuttHist : false, //전화 상담 이력 상세보기 모달
        dialogSnsCuttHist : false, //SNS 상담 이력 상세보기 모달
        dialogSelectedDetail : false, //문자 발송 이력 상세보기 모달

        // 뷰 타입 변경
        dropSelectViewtype: false,
        VIEWTYPE: {
          list: [
            { title: '리스트 보기', icon: 'list-view-list', class: ''},
            { title: '요약 보기', icon: 'list-view-grid', class: 'type-grid'}
          ],
          selected: {
            icon: 'list-view-list',
            class: '',
            title: '리스트 보기',
          }
        },

        //상담 이력
        CUTT_HIST : {},
        CHAT_LOG: [],     //채팅내역
        MSG_SEND_HIST: [],     //문자발송 이력

        FBDWD_YN: '', //금칙어 적용여부
        SHOW_QSTN:'', //고객이 선택한 문의유형 보기 여부

        //상담이력 검색
        SCH_CUTT_HIST : {
          CHNL : '', //채널 검색
          CUSL_RS : '', //결과 검색
          ST_DT : '', //검색 시작일자
          END_DT : '', //검색 종료일자
        },

        //VOC 검색
        SCH_VOC : {
          CHNL : '', //채널 검색
          CUSL_RS : '', //결과 검색
          ST_DT : '', //검색 시작일자
          END_DT : '', //검색 종료일자
        },

        //문자발송이력 검색
        SCH_MSG : {
          SNDNG_SE_CD : '', //메시지 유형
          RSLT_CD : '', //발송결과
          ST_DT : '', //검색 시작일자
          END_DT : '', //검색 종료일자
        },

        //발송 결과
        MSG_RSLT_ITEM: [
          { text: '전체', value: ''},
          { text: '발송완료', value: '1'},
          { text: '실패', value: '2'},
        ],

        //예약콜 검색
        SCH_RSVT_CALL : {
          // CHNL : '', //채널 검색
          CUSL_RS : '', //결과 검색
          ST_DT : '', //검색 시작일자
          END_DT : '', //검색 종료일자
        },

        //콜백 검색
        SCH_CALL_BACK : {
          // CHNL : '', //채널 검색
          CUSL_RS : '', //결과 검색
          ST_DT : '', //검색 시작일자
          END_DT : '', //검색 종료일자
        },

        //캠페인 검색
        SCH_CPI : {
          // CHNL : '', //채널 검색
          CUSL_RS : '', //결과 검색
          ST_DT : '', //검색 시작일자
          END_DT : '', //검색 종료일자
        },

        //AS 이력 검색
        SCH_VST_RSVT : {
          STTS_CD : '', //결과 검색
          ST_DT : '', //검색 시작일자
          END_DT : '', //검색 종료일자
        },

        //통합 접촉이력
        INTEG_CONNECT_HIST : {
          INTEG_CUTT_HIST_CNT : 0,
          VOC_CNT : 0,
          MSG_CNT : 0,
          RSVT_CALL_CNT : 0,
          CALL_BACK_CNT : 0,
          CPI_CNT : 0,
          VST_RSVT_CNT : 0,
          INTEG_CUTT_HIST_LIST : [], //상담 이력
          CUSL_EXPSN_ATTR_LIST : [], //상담 이력 노출 확장 속성 목록
          VOC_LIST : [], //VOC
          MSG_LIST : [], //문자발송이력
          RSVT_CALL_LIST : [], //예약콜
          CALL_BACK_LIST : [], //콜백
          CPI_LIST : [], //캠페인
          // AS 이력
          VST_RSVT_LIST: [],
        },

        as_statList: [
          { code: 'VRS_ALTMNT', name: '배정', value: 'chat-stat-cs' },
          { code: 'VRS_CMPTN', name: '완료', value: 'chat-stat-done' },
          { code: 'VRS_RTRCN', name: '취소', value: 'chat-stat-wait' },
          { code: 'VRS_REVST', name: '재방문', value: 'chat-stat-after' },
        ],

        pagination: {
          page: 1,
          rowsPerPage: 10,
          sortBy: "",
          descending: ""
        }, //그리드 페이지속성정의
        nextDisabled:true,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼

        // 실시간 검색
        REALTIME_SEARCH: {
          tags: [
            { text: '회원가입', active: true},
            { text: '장기저축급여', active: true},
            { text: '급여금 계산', active: true},
            { text: '가입자격', active: true},
            // { text: '임대', active: true},
            // { text: '임대절차', active: true},
            // { text: '입주자격', active: true},
            // { text: '임대조건', active: true},
            // { text: '제출서류', active: true},
          ],
          recommend_list: [],
          t01_img: require ('@/assets/img/@sample2.png'),
          t01_img_title: '이미지 alt',
          isSummrizing: false,
          defaultSummary: "'요약보기' 버튼을 클릭해 주세요.",
          summary: "",
          // summary_list: [
          //   { depth: '국민임대에 대해 전반적으로 문의하심'},
          //   { depth: '임대절차와 입주자격, 임대조건을 안내 드렸고 제출서류를 보내드렸음.'},
          // ],
          summary_category_list: [
            { depth: '청약 > 국민임대', droplist:['다른 추천 보기1', '1', '2']},
            { depth: '청약 > 국민임대 > 임대조건', droplist:['다른 추천 보기2', '1', '2']},
            { depth: '청약 > 국민임대 > 입주자격', droplist:['다른 추천 보기3', '1', '2']},
          ],
          CUST_NM: 'CS-5팀 나상담',
          REG_DT: '2023-01-20(화) 14:25 ~ 14:39',
          AudioSrc: '',
        },

        //실시간 검색
        CONTS_DETAIL : {
          active : false
          , favorite: false
          , KMS_CONTS_ID : ""
          , KMS_CONTS_NM : ""
          , CLSF_PATH : ""
          , MDFCN_DT_F : ""
          , GUIDE_LIST : []
        },
        selectedKmsContent: {
          KMS_CONTS_ID : ''
        },

        //상담유형 Tree 데이터
        CUTT_TYPE_TREE:undefined,
        CUTT_ITEMS:[],            //상담유형 전체데이터
        CUTT_TYPE_LMT_LVL_CD:'',  //상담유형 레벨
        CUTT_TYPE_VMODEL_ARR:[],  //상담유형 v-model
        CUTT_TYPE_ID:'',          //선택 상담유형
        LAST_CUTT_TYPE_LIST:[],   //상담유형 마지막 레벨 목록
        SELECTED_CUTT_TY: '',      //선택된 상담 유형

        // 상담유형 자동분류 select
        CS_TYPE_SORT:[
          {
            color: '#eb6572',
            order: 'A',
            model1: '1-1',
            model2: '1-2',
            model3: '1-3',
            checked: false,
          },
          { color: '#fc8722', order: 'B', model1: '2-1', model2: '2-2', model3: '2-3', checked: false, },
          { color: '#24b36b', order: 'C', model1: '3-1', model2: '3-2', model3: '3-3', checked: false, },
        ],

        seq : -1,
        TMP_LOADING : false,

        dialogTitl:'취소 사유',
        dialogCommonReason: false,
        STTS_DTL_CD:'CANCEL_NOMAL',
        CN:'',
        REASON_TP_LIST: [],
        VST_CANCEL_INFO: {},
      }
    },

    watch: {
      CUST_ID(){
        this.$nextTick(()=>{
          console.log('MainchatAllLog CUST_ID : ', this.CUST_ID);
          this.getIntegHist();
          if(this.CHNL === 'SNS') this.initRealtimeSearch();
        });
      }
    },

    computed: {
      computedResizeClass() {
        return this.ResizeProp === true ? 'pl-icon20 resize-on' : 'pl-icon20 resize-off'
      },
      computedResizeText() {
        return this.ResizeProp === true ? '축소' : '확대'
      },
    },

    async created() {
      //공통코드설정
      let codeName = ['CHNL', 'CUSL_RS', 'MTS_TP', 'VST_RSVT_STAT', 'VRS_RTRCN'];
      this.common_code = await this.mixin_common_code_get_all(codeName);

      // this.SCH_CUTT_HIST.ST_DT = this.$moment(this.startDate).subtract(7,'days').format('YYYY-MM-DD'); // 통화 시작 일자(일주일전)
      // this.SCH_CUTT_HIST.END_DT = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); // 통화 종료 일자

      // this.SCH_VOC.ST_DT = this.$moment(this.startDate).subtract(7,'days').format('YYYY-MM-DD'); // 통화 시작 일자(일주일전)
      // this.SCH_VOC.END_DT = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); // 통화 종료 일자

      // this.SCH_RSVT_CALL.ST_DT = this.$moment(this.startDate).subtract(7,'days').format('YYYY-MM-DD'); // 통화 시작 일자(일주일전)
      // this.SCH_RSVT_CALL.END_DT = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); // 통화 종료 일자

      // this.SCH_CALL_BACK.ST_DT = this.$moment(this.startDate).subtract(7,'days').format('YYYY-MM-DD'); // 통화 시작 일자(일주일전)
      // this.SCH_CALL_BACK.END_DT = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); // 통화 종료 일자

      // this.SCH_CPI.ST_DT = this.$moment(this.startDate).subtract(7,'days').format('YYYY-MM-DD'); // 통화 시작 일자(일주일전)
      // this.SCH_CPI.END_DT = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); // 통화 종료 일자

      this.FBDWD_YN = await this.mixin_getChtStng('PROHIBITE_APPLY_YN');
      this.SHOW_QSTN = await this.mixin_getChtStng('INQRY_SHOW_YN');
    },

    mounted() {

    },

    methods: {
      displayStatus(stat) {
        const statList = [
          { stat_list_text: '처리완료', stat_list_status: 'accept' },
          { stat_list_text: '처리중', stat_list_status: 'open' },
          { stat_list_text: '미완료', stat_list_status: 'error' },
        ];

        for (let i = 0; i < statList.length; i++) {
          if (statList[i].stat_list_status === stat) {
            return statList[i].stat_list_text;
          }
        }
      },
      getLengthArr(arr){
        const filteredArr = this.DataProp[`${ arr }`].filter(item => item.date === undefined);
        return filteredArr.length;
      },

      // 뷰타입 변경
      selectViewtype(item){
        this.VIEWTYPE.selected = item;
        this.dropSelectViewtype = false;
      },

      closeDropSelectViewtype(){
        this.dropSelectViewtype = false;
      },

      //통합 접촉 이력 조회
      async getIntegHist(){
        this.INTEG_CONNECT_HIST.INTEG_CUTT_HIST_LIST = [];
        this.INTEG_CONNECT_HIST.VOC_LIST = [];
        this.INTEG_CONNECT_HIST.MSG_LIST = [];
        this.INTEG_CONNECT_HIST.RSVT_CALL_LIST = [];
        this.INTEG_CONNECT_HIST.CALL_BACK_LIST = [];
        this.INTEG_CONNECT_HIST.CPI_LIST = [];

        this.INTEG_CONNECT_HIST.INTEG_CUTT_HIST_CNT = 0;
        this.INTEG_CONNECT_HIST.VOC_CNT = 0;
        this.INTEG_CONNECT_HIST.MSG_CNT = 0;
        this.INTEG_CONNECT_HIST.RSVT_CALL_CNT = 0;
        this.INTEG_CONNECT_HIST.CALL_BACK_CNT = 0;
        this.INTEG_CONNECT_HIST.CPI_CNT = 0;

        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;

        //방문 예약 서비스 이용시
        if(this.mixin_getCustcoSrvcStat('AS_ALTMNT')){
          this.INTEG_CONNECT_HIST.VST_RSVT_LIST = [];
          this.INTEG_CONNECT_HIST.VST_RSVT_CNT = 0;
        }

        if(this.CUST_ID > -1){
          let sUrl = '/phone-api/cutt/custIntegHistList';
          let postParam = {
            CUST_ID : this.CUST_ID
            , ST_DT : this.SCH_CUTT_HIST.ST_DT.replace(/-/gi, '')
            , END_DT : this.SCH_CUTT_HIST.END_DT.replace(/-/gi, '')
            , AS_ALTMNT : this.mixin_getCustcoSrvcStat('AS_ALTMNT')?'Y':'N'
          }

          let headParam = {
            head : {
              ROW_CNT : this.pagination.rowsPerPage,
              PAGES_CNT : this.pagination.page,
              PAGING : "Y",
            }
          }

          let response  = await this.common_postCall(sUrl, postParam, headParam);

          if (!response.HEADER.ERROR_FLAG){
            //고객 기본 정보
            // if(response.DATA){
            //   this.CUST_INFO = response.DATA[0];
            // }else{
            //   //고객 정보 초기화
            //   this.CUST_INFO.CUST_ID = -1;
            //   this.CUST_INFO.CUST_NM = '　';
            //   this.CUST_INFO.CUST_PHN_NO = '　';
            //   this.CUST_INFO.CAUTION_CUST_YN = 'N';
            //   this.CUST_INFO.portrait = require('@/assets/img/@profile_customer.png');
            // }

            //상담 이력
            if(response.INTEG_CUTT_HIST_LIST.length > 0){
              let length = 55;
              response.INTEG_CUTT_HIST_LIST.forEach((data, idx) => {
                data.CUTT_BGNG_DT = (data.CUTT_BGNG_DT?data.CUTT_BGNG_DT:data.CUTT_END_DT);
                data.PHN_HR = (data.PHN_HR?data.PHN_HR:'0');

                data.CUSL_IMG = data.ICON !=='f04'?'/upload/' + data.CUSL_IMG:require('@/assets/img/@profile_user.png');

                data.TYPE = data.TYPE === 'talk'?data.CHN_CLSF_CD==='KAKAO'?data.CHN_CLSF_CD.toLowerCase():'teletalk':data.TYPE;
                if ((data.FULL_PATH?data.FULL_PATH.length:0) > length) {
                  data.FULL_PATH_TEMP = data.FULL_PATH.substr(0, length - 2) + '...';
                }else{
                  data.FULL_PATH_TEMP = data.FULL_PATH;
                }

                if(data.TYPE === 'call') data.status = data.CUSL_RS === 'COMPLETED' ? 'done' : 'cs';
                else{
                  let status = '';
                  let statusNm = '';
                  switch(data.CUSL_RS){
                    case 'CMPL_TRAN' :
                    case 'CMPL' :
                      status = 'cs';
                      statusNm = '완료';
                      break;
                    case 'DMND_GIVEUP' :
                    case 'ALTMNT_GIVEUP' :
                    case 'WAIT_GIVEUP' :
                    case 'TRAN_WAIT_GIVEUP' :
                      status = 'wait';
                      statusNm = '고객포기';
                      break;
                    default :
                      status = 'done';
                      statusNm = '';
                  }

                  data.status = status;
                  data.CUSL_RS_NM = statusNm;
                }
              });

              this.INTEG_CONNECT_HIST.INTEG_CUTT_HIST_LIST = response.INTEG_CUTT_HIST_LIST;

              this.INTEG_CONNECT_HIST.INTEG_CUTT_HIST_CNT = response.INTEG_CUTT_HIST_LIST[0].TWB_PAGING_TOT_COUNT;

              if((this.pagination.rowsPerPage * this.pagination.page) < this.INTEG_CONNECT_HIST.INTEG_CUTT_HIST_CNT) this.nextDisabled = false;
              else this.nextDisabled = true;

              this.pagination.page += 1;
            }

            //통합 상담 이력 노출 확장속성 목록
            this.INTEG_CONNECT_HIST.CUSL_EXPSN_ATTR_LIST = [];
            if(response.CUSL_EXPSN_ATTR_LIST){
              if(response.CUSL_EXPSN_ATTR_LIST.length > 0){
                let arrExpsnList = [];
                response.CUSL_EXPSN_ATTR_LIST.forEach((attr, idx) => {
                  if(attr.EXPSN_ATTR_COL_ID !== 'CUSL_TP_CL'
                    && attr.EXPSN_ATTR_COL_ID !== 'CUSL_CN'
                    && attr.EXPSN_ATTR_COL_ID !== 'CUSL_RS'
                    && attr.EXPSN_ATTR_COL_ID !== 'CAMP_RS'
                    ){
                      attr.EXPSN_ATTR_COL_ID = attr.EXPSN_ATTR_COL_ID.toUpperCase();
                      arrExpsnList.push(attr);
                    }
                });

                this.INTEG_CONNECT_HIST.CUSL_EXPSN_ATTR_LIST = arrExpsnList;
              }
            }

            //VOC
            // if(response.VOC_LIST.length > 0){
            //   this.INTEG_CONNECT_HIST.VOC_LIST = response.VOC_LIST;
            //   this.INTEG_CONNECT_HIST.VOC_CNT = response.VOC_LIST.length;
            // }

            //문자발송 이력
            if(response.MSG_LIST.length > 0){

              response.MSG_LIST.forEach((data, idx) => {
                if(data.SNDNG_SE_CD === 'ATALK'){ //알림톡
                  if((data.RSLT_CD  === '1000' && data.RSLT_MSG.indexOf('Select') > -1)
                    || (data.RSLT_CD === '0000' && data.RSLT_MSG.indexOf('Regist') > -1)){
                    data.status = 'cs';
                  }else{
                    data.status = 'done';
                  }
                }else{//문자(SMS, MMS, LMS)
                  if((data.SNDNG_SE_CD === 'SMS' && data.RSLT_CD  === '00' && data.RSLT_MSG.indexOf('Select') > -1)
                    || (data.RSLT_CD === '0000' && data.RSLT_MSG.indexOf('Regist') > -1)
                    || ((data.SNDNG_SE_CD === 'MMS' || data.SNDNG_SE_CD === 'LMS') && data.RSLT_CD  === '1000' && data.RSLT_MSG.indexOf('Select') > -1)
                  ){
                    data.status = 'cs';
                  }else{
                    data.status = 'done';
                  }
                }
              });

              this.INTEG_CONNECT_HIST.MSG_LIST = response.MSG_LIST;
              this.INTEG_CONNECT_HIST.MSG_CNT = response.MSG_LIST.length;
            }

            //예약콜
            let iRsvtCnt = 0;
            if(response.RSVT_CALL_LIST.length > 0){
              response.RSVT_CALL_LIST.forEach((data, idx) => {
                if(data.PHN_CUTT_ID === data.RSVT_PHN_CUTT_ID){
                  data.expand = false;
                  data.sub_status = '';
                  if(data.CUSL_RS_CD  === 'PROCESSING'){
                    data.status = 'cs';
                  }else{
                    data.status = 'done';
                  }

                  iRsvtCnt++;
                }
              });
            }

            this.INTEG_CONNECT_HIST.RSVT_CALL_LIST = response.RSVT_CALL_LIST;
            this.INTEG_CONNECT_HIST.RSVT_CALL_CNT = iRsvtCnt;

            //콜백
            let iClbkCnt = 0;
            if(response.CALL_BACK_LIST.length > 0){
              response.CALL_BACK_LIST.forEach((data, idx) => {
                if(!data.PHN_CUTT_ID){
                  data.expand = false;
                  data.sub_status = '';
                  if(data.CUSL_RS_CD  === 'PROCESSING'){
                    data.status = 'cs';
                  }else{
                    data.status = 'done';
                  }

                  iClbkCnt++;
                }
              });
            }

            this.INTEG_CONNECT_HIST.CALL_BACK_LIST = response.CALL_BACK_LIST;
            this.INTEG_CONNECT_HIST.CALL_BACK_CNT = iClbkCnt;

            //캠페인
            let iCpiCnt = 0;
            if(response.CPI_LIST.length > 0){
              response.CPI_LIST.forEach((data, idx) => {
                if(!data.PHN_CUTT_ID){
                  data.expand = false;
                  data.sub_status = '';
                  if(data.CUSL_RS_CD  === 'PROCESSING'){
                    data.status = 'cs';
                  }else{
                    data.status = 'done';
                  }

                  iCpiCnt++;
                }
              });
            }

            this.INTEG_CONNECT_HIST.CPI_LIST = response.CPI_LIST;
            this.INTEG_CONNECT_HIST.CPI_CNT = iCpiCnt;

            //방문 예약 서비스 이용시
            if(this.mixin_getCustcoSrvcStat('AS_ALTMNT')){
              this.INTEG_CONNECT_HIST.VST_RSVT_LIST = response.VST_RSVT_LIST;
              this.INTEG_CONNECT_HIST.VST_RSVT_CNT = response.VST_RSVT_LIST.length;
            }
          }
        }
      },

      //통합 검색
      async getSearch(searchGb, next){
        let sUrl = '';
        let postParam = {}

        let headParam = {
          head : {}
        }

        if(searchGb === 'cutt'){ //상담 이력
          if (next == 'next'){
          } else {
            this.INTEG_CONNECT_HIST.INTEG_CUTT_HIST_LIST = [];
            this.INTEG_CONNECT_HIST.INTEG_CUTT_HIST_CNT = 0;
            this.pagination.page = 1; //페이징 처리 초기화
            this.nextDisabled = true;  //버튼 비활성화
          }

          sUrl = '/phone-api/cutt/integCuttHistList';
          postParam = {
            CUST_ID : this.CUST_ID
            , CHNL : this.SCH_CUTT_HIST.CHNL
            , CUSL_RS : this.SCH_CUTT_HIST.CUSL_RS
            , ST_DT : this.SCH_CUTT_HIST.ST_DT.replace(/-/gi, '')
            , END_DT : this.SCH_CUTT_HIST.END_DT.replace(/-/gi, '')
          }

          headParam = {
            head : {
              ROW_CNT : this.pagination.rowsPerPage,
              PAGES_CNT : this.pagination.page,
              PAGING : "Y",
            }
          }
        }else if(searchGb === 'voc'){ //voc
          this.INTEG_CONNECT_HIST.VOC_LIST = [];
          this.INTEG_CONNECT_HIST.VOC_CNT = 0;

          sUrl = '/phone-api/cutt/vocList';
          postParam = {
            CUST_ID : this.CUST_ID
            , CHNL : this.SCH_VOC.CHNL
            , CUSL_RS : this.SCH_VOC.CUSL_RS
            , ST_DT : this.SCH_VOC.ST_DT.replace(/-/gi, '')
            , END_DT : this.SCH_VOC.END_DT.replace(/-/gi, '')
          }
        }else if(searchGb === 'msg'){ //문자발송 이력
          this.INTEG_CONNECT_HIST.MSG_LIST = [];
          this.INTEG_CONNECT_HIST.MSG_CNT = 0;

          sUrl = '/phone-api/cutt/msgList';
          postParam = {
            CUST_ID : this.CUST_ID
            , SNDNG_SE_CD : this.SCH_MSG.SNDNG_SE_CD
            , RSLT_CD : this.SCH_MSG.RSLT_CD
            , ST_DT : this.SCH_MSG.ST_DT.replace(/-/gi, '')
            , END_DT : this.SCH_MSG.END_DT.replace(/-/gi, '')
          }
        }else if(searchGb === 'rsvt'){ //예약 콜
          this.INTEG_CONNECT_HIST.RSVT_CALL_LIST = [];
          this.INTEG_CONNECT_HIST.RSVT_CALL_CNT = 0;

          sUrl = '/phone-api/cutt/rsvtCallList';
          postParam = {
            CUST_ID : this.CUST_ID
            // , CHNL : this.SCH_RSVT_CALL.CHNL
            , CUSL_RS : this.SCH_RSVT_CALL.CUSL_RS
            , ST_DT : this.SCH_RSVT_CALL.ST_DT.replace(/-/gi, '')
            , END_DT : this.SCH_RSVT_CALL.END_DT.replace(/-/gi, '')
          }
        }else if(searchGb === 'callback'){ //콜백
          this.INTEG_CONNECT_HIST.CALL_BACK_LIST = [];
          this.INTEG_CONNECT_HIST.CALL_BACK_CNT = 0;

          sUrl = '/phone-api/cutt/callBackList';
          postParam = {
            CUST_ID : this.CUST_ID
            // , CHNL : this.SCH_CALL_BACK.CHNL
            , CUSL_RS : this.SCH_CALL_BACK.CUSL_RS
            , ST_DT : this.SCH_CALL_BACK.ST_DT.replace(/-/gi, '')
            , END_DT : this.SCH_CALL_BACK.END_DT.replace(/-/gi, '')
          }
        }else if(searchGb === 'cpi'){ //캠페인
          this.INTEG_CONNECT_HIST.CPI_LIST = [];
          this.INTEG_CONNECT_HIST.CPI_CNT = 0;

          sUrl = '/phone-api/cutt/cpiList';
          postParam = {
            CUST_ID : this.CUST_ID
            // , CHNL : this.SCH_CPI.CHNL
            , CUSL_RS : this.SCH_CPI.CUSL_RS
            , ST_DT : this.SCH_CPI.ST_DT.replace(/-/gi, '')
            , END_DT : this.SCH_CPI.END_DT.replace(/-/gi, '')
          }
        }else if(searchGb === 'vstRsvt'){ //방문 예약
          this.INTEG_CONNECT_HIST.VST_RSVT_LIST = [];
          this.INTEG_CONNECT_HIST.VST_RSVT_LIST = 0;

          sUrl = '/phone-api/cutt/vstRsvtList';
          postParam = {
            CUST_ID : this.CUST_ID
            , SCH_STTS_CD : this.SCH_VST_RSVT.STTS_CD
            , SCH_RSVT_ST_DTS : this.SCH_VST_RSVT.ST_DT.replace(/-/gi, '')
            , SCH_RSVT_END_DTS : this.SCH_VST_RSVT.END_DT.replace(/-/gi, '')
          }
        }

        if(this.CUST_ID === -1){
          return;
        }

        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          if(response.DATA.length > 0){
            if(searchGb === 'cutt'){ //상담 이력

              let length = 55;
              response.DATA.forEach((data, idx) => {
                data.CUSL_IMG = data.ICON !=='f04'?'/upload/' + data.CUSL_IMG:require('@/assets/img/@profile_user.png');

                data.TYPE = data.TYPE === 'talk'?data.CHN_CLSF_CD==='KAKAO'?data.CHN_CLSF_CD.toLowerCase():'teletalk':data.TYPE;
                if ((data.FULL_PATH?data.FULL_PATH.length:0) > length) {
                  data.FULL_PATH_TEMP = data.FULL_PATH.substr(0, length - 2) + '...';
                }else{
                  data.FULL_PATH_TEMP = data.FULL_PATH;
                }

                if(data.TYPE === 'call') data.status = data.CUSL_RS === 'COMPLETED' ? 'done' : 'cs';
                else{
                  let status = '';
                  let statusNm = '';
                  switch(data.CUSL_RS){
                    case 'CMPL_TRAN' :
                    case 'CMPL' :
                      status = 'cs';
                      statusNm = '완료';
                      break;
                    case 'DMND_GIVEUP' :
                    case 'ALTMNT_GIVEUP' :
                    case 'WAIT_GIVEUP' :
                    case 'TRAN_WAIT_GIVEUP' :
                      status = 'wait';
                      statusNm = '고객포기';
                      break;
                    default :
                      status = 'done';
                      statusNm = '';
                  }

                  data.status = status;
                  data.CUSL_RS_NM = statusNm;
                }

                this.INTEG_CONNECT_HIST.INTEG_CUTT_HIST_LIST.push(data);
              });

              this.INTEG_CONNECT_HIST.INTEG_CUTT_HIST_CNT = response.DATA[0].TWB_PAGING_TOT_COUNT;

              //통합 상담 이력 노출 확장속성 목록
              this.INTEG_CONNECT_HIST.CUSL_EXPSN_ATTR_LIST = [];
              if(response.CUSL_EXPSN_ATTR_LIST){
                if(response.CUSL_EXPSN_ATTR_LIST.length > 0){
                  let arrExpsnList = [];
                  response.CUSL_EXPSN_ATTR_LIST.forEach((attr, idx) => {
                    if(attr.EXPSN_ATTR_COL_ID !== 'CUSL_TP_CL'
                      && attr.EXPSN_ATTR_COL_ID !== 'CUSL_CN'
                      && attr.EXPSN_ATTR_COL_ID !== 'CUSL_RS'
                      && attr.EXPSN_ATTR_COL_ID !== 'CAMP_RS'
                      ){
                        attr.EXPSN_ATTR_COL_ID = attr.EXPSN_ATTR_COL_ID.toUpperCase();
                        arrExpsnList.push(attr);
                      }
                  });

                  this.INTEG_CONNECT_HIST.CUSL_EXPSN_ATTR_LIST = arrExpsnList;
                }
              }

              if((this.pagination.rowsPerPage * this.pagination.page) < this.INTEG_CONNECT_HIST.INTEG_CUTT_HIST_CNT) this.nextDisabled = false;
              else this.nextDisabled = true;

              this.pagination.page += 1;

              this.TMP_LOADING = false;

            }else if(searchGb === 'voc'){ //voc
              this.INTEG_CONNECT_HIST.VOC_LIST = response.DATA;
              this.INTEG_CONNECT_HIST.VOC_CNT = response.DATA.length;
            }else if(searchGb === 'msg'){ //문자발송 이력

              if(response.DATA.length > 0){

                response.DATA.forEach((data, idx) => {
                  if(data.SNDNG_SE_CD === 'ATALK'){ //알림톡
                    if((data.RSLT_CD  === '1000' && data.RSLT_MSG.indexOf('Select') > -1)
                      || (data.RSLT_CD === '0000' && data.RSLT_MSG.indexOf('Regist') > -1)){
                      data.status = 'cs';
                    }else{
                      data.status = 'done';
                    }
                  }else{//문자(SMS, MMS, LMS)
                    if((data.SNDNG_SE_CD === 'SMS' && data.RSLT_CD  === '00' && data.RSLT_MSG.indexOf('Select') > -1)
                      || (data.RSLT_CD === '0000' && data.RSLT_MSG.indexOf('Regist') > -1)
                      || ((data.SNDNG_SE_CD === 'MMS' || data.SNDNG_SE_CD === 'LMS') && data.RSLT_CD  === '1000' && data.RSLT_MSG.indexOf('Select') > -1)
                    ){
                      data.status = 'cs';
                    }else{
                      data.status = 'done';
                    }
                  }
                });

              }

              this.INTEG_CONNECT_HIST.MSG_LIST = response.DATA;
              this.INTEG_CONNECT_HIST.MSG_CNT = response.DATA.length;

            }else if(searchGb === 'rsvt'){ //예약 콜
              let iRsvtCnt = 0;
              response.DATA.forEach((data, idx) => {
                if(data.PHN_CUTT_ID === data.RSVT_PHN_CUTT_ID){
                  data.expand = false;
                  data.sub_status = '';
                  if(data.CUSL_RS_CD  === 'PROCESSING'){
                    data.status = 'cs';
                  }else{
                    data.status = 'done';
                  }

                  iRsvtCnt++;
                }
              });

              this.INTEG_CONNECT_HIST.RSVT_CALL_LIST = response.DATA;
              this.INTEG_CONNECT_HIST.RSVT_CALL_CNT = iRsvtCnt;

            }else if(searchGb === 'callback'){ //콜백
              let iClbkCnt = 0;
              response.DATA.forEach((data, idx) => {
                if(!data.PHN_CUTT_ID){
                  data.expand = false;
                  data.sub_status = '';
                  if(data.CUSL_RS_CD  === 'PROCESSING'){
                    data.status = 'cs';
                  }else{
                    data.status = 'done';
                  }

                  iClbkCnt++;
                }
              });

              this.INTEG_CONNECT_HIST.CALL_BACK_LIST = response.DATA;
              this.INTEG_CONNECT_HIST.CALL_BACK_CNT = iClbkCnt;
            }else if(searchGb === 'cpi'){ //캠페인
              let iCpiCnt = 0;
              response.DATA.forEach((data, idx) => {
                if(!data.PHN_CUTT_ID){
                  data.expand = false;
                  data.sub_status = '';
                  if(data.CUSL_RS_CD  === 'PROCESSING'){
                    data.status = 'cs';
                  }else{
                    data.status = 'done';
                  }

                  iCpiCnt++;
                }
              });

              this.INTEG_CONNECT_HIST.CPI_LIST = response.DATA;
              this.INTEG_CONNECT_HIST.CPI_CNT = iCpiCnt;
            }else if(searchGb === 'vstRsvt'){ //방문 예약
              this.INTEG_CONNECT_HIST.VST_RSVT_LIST = response.DATA;
              this.INTEG_CONNECT_HIST.VST_RSVT_CNT = response.DATA.length;
            }
          }
        }
      },

      //상담 이력
      cuttHistDialog (item, seq) {
        this.CUTT_HIST = item;
        this.seq = seq;
        if(item.TYPE === 'call'){ //전화 상담 이력
          this.mixin_showDialog('PhnCuttHist');
          this.mixin_hideDialog('SnsCuttHist');
        }else { //SNS 상담 이력
          // this.CUTT_HIST.TalkProp = true;
          // this.chatHstSrch();
          this.mixin_showDialog('SnsCuttHist');
          this.mixin_hideDialog('PhnCuttHist');
        }
      },

      //문자발송 이력
      msgSendHistDialog (item) {
        this.MSG_SEND_HIST = item;
        this.mixin_showDialog('SelectedDetail');
      },

      //문자발송 이력 닫기
      closeSendHistoryDetail(){
        this.mixin_hideDialog("SelectedDetail");
        this.MSG_SEND_HIST = [];
      },

      toggeleRsvtExpand(index){
        this.INTEG_CONNECT_HIST.RSVT_CALL_LIST[index].expand = !this.INTEG_CONNECT_HIST.RSVT_CALL_LIST[index].expand;
      },
      toggeleRsvtExpandClass(index){
        return this.INTEG_CONNECT_HIST.RSVT_CALL_LIST[index].expand === true ? 'pl-icon20 arrow-down' : 'pl-icon20 arrow-up'
      },

      toggeleClbkExpand(index){
        this.INTEG_CONNECT_HIST.CALL_BACK_LIST[index].expand = !this.INTEG_CONNECT_HIST.CALL_BACK_LIST[index].expand;
      },
      toggeleClbkExpandClass(index){
        return this.INTEG_CONNECT_HIST.CALL_BACK_LIST[index].expand === true ? 'pl-icon20 arrow-down' : 'pl-icon20 arrow-up'
      },

      toggeleExpand(index){
        this.INTEG_CONNECT_HIST.CPI_LIST[index].expand = !this.INTEG_CONNECT_HIST.CPI_LIST[index].expand;
      },
      toggeleExpandClass(index){
        return this.INTEG_CONNECT_HIST.CPI_LIST[index].expand === true ? 'pl-icon20 arrow-down' : 'pl-icon20 arrow-up'
      },

      //실시간 검색 탭 오픈 처리
      setOpenTab(flag) {
        this.REALTIME_TAB_STAT = flag;
      },
      setOpenTabFromSNS(flag) {
        this.REALTIME_TAB_STAT = flag;
        this.parentPage = 'sns';
      },

      async schKewordKms(tag) {
        let sUrl = '/api/km/right/rightContsList';
        let postParam = {
          SE_CD : 'KNOWLEDGE' //지식
          , LIKE_KMS_KEYWD_NM : tag.text
        }

        let headParam = {
          head : {
          }
        }

        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){

          if(response.DATA.length > 0){
            for(let km of response.DATA){
              if(km.ESNTL_YN === 'Y') km.required = true;
              else km.required = false;
            }
          }

          this.REALTIME_SEARCH.recommend_list = response.DATA;

          this.selectedKmsContent.KMS_CONTS_ID = ''; //지식 콘텐츠 초기화

        }
      },

      //지식 컨텐츠 가져오기
      getKmsContent(item) {
        this.selectedKmsContent.KMS_CONTS_ID = item.KMS_CONTS_ID
      },

      //채팅 내역 조회
      async chatHstSrch(){
        let sUrl = '/chat-api/main/cnslt-cn/inqire';
        let postParam = {
          CHT_CUTT_ID: this.CUTT_HIST.CHT_CUTT_ID,
          CUST_ID: this.CUST_ID,
          CUTT_STTS_CD: 'CMPL',
          CHT_RDY_ID: '',
          CHT_USER_KEY : '',
          SNDR_KEY : '',
          CHN_CLSF_CD : '',
        }
        let headParam = {
          head: {
          }
        }

        let resData = await this.chat_postCall(sUrl, postParam, headParam)
        if(!resData.header.ERROR_FLAG){
          this.CHAT_LOG = [];
          let msgTypeCd = '';
          let leng = resData.data.length;
          for(let i=0;i<leng;i++){
            if(this.SHOW_QSTN == 'Y'){
              if(resData.data[i]["MSG_TYPE_CD"] != 'EMAIL'){
                let chatDate = this.mixin_convertDate(resData.data[i]["REG_DT"], 'yyyy-MM-dd HH:mm:ss')
                if(resData.data[i]["MSG_TYPE_CD"] == 'INFOMSG' && msgTypeCd != 'INFOMSG'){
                  this.CHAT_LOG.push(
                    {
                      TYPE: resData.data[i+1]["MSG_TYPE_CD"],
                      SNDRCV_CD: resData.data[i+1]["RCPTN_DSPTCH_CD"],
                      IMAGE_URL: resData.data[i+1]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i+1]["RCPTN_DSPTCH_MSG"] : resData.data[i+1]["RCPTN_DSPTCH_MSG"],
                      CONTENT: this.FBDWD_YN == 'Y'
                        ? resData.data[i+1]["CHG_RCPTN_DSPTCH_MSG"]
                        : resData.data[i+1]["RCPTN_DSPTCH_MSG"],
                      CHAT_DATE: chatDate,
                      QSTN_TYPE_NM: resData.data[i+1]["QSTN_TYPE_NM"],
                      QSTN_TYPE_MSG: resData.data[i+1]["QSTN_TYPE_MSG"],
                      QSTN_BTN_LIST: resData.data[i+1]["BTN_LIST"].split('||'),
                      RSVT_BTN_LIST: resData.data[i+1]["RSVT_BTN"].split('||')
                    },
                  )
                  msgTypeCd = 'INFOMSG';
                } else if (resData.data[i]["MSG_TYPE_CD"] == 'QSTN' && msgTypeCd == 'INFOMSG') {
                  this.CHAT_LOG.push(
                    {
                      TYPE: resData.data[i-1]["MSG_TYPE_CD"],
                      SNDRCV_CD: resData.data[i-1]["RCPTN_DSPTCH_CD"],
                      IMAGE_URL: resData.data[i-1]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i-1]["RCPTN_DSPTCH_MSG"] : resData.data[i-1]["RCPTN_DSPTCH_MSG"],
                      CONTENT: this.FBDWD_YN == 'Y'
                        ? resData.data[i-1]["CHG_RCPTN_DSPTCH_MSG"]
                        : resData.data[i-1]["RCPTN_DSPTCH_MSG"],
                      CHAT_DATE: chatDate,
                      QSTN_TYPE_NM: resData.data[i-1]["QSTN_TYPE_NM"],
                      QSTN_TYPE_MSG: resData.data[i-1]["QSTN_TYPE_MSG"],
                      QSTN_BTN_LIST: resData.data[i-1]["BTN_LIST"].split('||'),
                      RSVT_BTN_LIST: resData.data[i-1]["RSVT_BTN"].split('||')
                    },
                  )
                  msgTypeCd = '';
                } else {
                  this.CHAT_LOG.push(
                    {
                      TYPE: resData.data[i]["MSG_TYPE_CD"],
                      SNDRCV_CD: resData.data[i]["RCPTN_DSPTCH_CD"],
                      IMAGE_URL: resData.data[i]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i]["RCPTN_DSPTCH_MSG"] : resData.data[i]["RCPTN_DSPTCH_MSG"],
                      CONTENT: this.FBDWD_YN == 'Y'
                        ? resData.data[i]["CHG_RCPTN_DSPTCH_MSG"]
                        : resData.data[i]["RCPTN_DSPTCH_MSG"],
                      CHAT_DATE: chatDate,
                      QSTN_TYPE_NM: resData.data[i]["QSTN_TYPE_NM"],
                      QSTN_TYPE_MSG: resData.data[i]["QSTN_TYPE_MSG"],
                      QSTN_BTN_LIST: resData.data[i]["BTN_LIST"].split('||'),
                      RSVT_BTN_LIST: resData.data[i]["RSVT_BTN"].split('||')
                    },
                  )
                }
              } else if(resData.data[i]["MSG_TYPE_CD"] == 'EMAIL') {
                this.changeEmailCuttMode(resData.data[i]);
              }
            } else {
              if(resData.data[i]["MSG_TYPE_CD"] != 'QSTN'){
                let chatDate = this.mixin_convertDate(resData.data[i]["REG_DT"], 'yyyy-MM-dd HH:mm:ss')
                this.CHAT_LOG.push(
                  {
                    TYPE: resData.data[i]["MSG_TYPE_CD"],
                    SNDRCV_CD: resData.data[i]["RCPTN_DSPTCH_CD"],
                    IMAGE_URL: resData.data[i]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i]["RCPTN_DSPTCH_MSG"] : resData.data[i]["RCPTN_DSPTCH_MSG"],
                    CONTENT: this.FBDWD_YN == 'Y'
                      ? resData.data[i]["CHG_RCPTN_DSPTCH_MSG"]
                      : resData.data[i]["RCPTN_DSPTCH_MSG"],
                    CHAT_DATE: chatDate,
                  },
                )
              }
            }
          }
        }
      },

      //실시간 검색 탭 초기화
      initRealtimeSearch() {
        this.REALTIME_SEARCH.summary = this.REALTIME_SEARCH.defaultSummary
        this.SELECTED_CUTT_TY = ''
        this.CUTT_TYPE_VMODEL_ARR = []
        this.LAST_CUTT_TYPE_LIST = []
        this.CUTT_TYPE_LMT_LVL_CD = ''
        this.CS_TYPE_SORT.map(item => {
          item.checked = false
        })
      },
      //상담내용 자동 요약(ChatGPT 서비스 호출)
      async autoSummaryCuttCn(cuttCn, clTypeCd, phnCuttId, chtCuttId) {

        this.changeMainTab(0)
        this.changeRealtimeTab(1)
        this.initRealtimeSearch()
        this.REALTIME_SEARCH.summary = ""
        this.REALTIME_SEARCH.isSummrizing = true
        // this.SELECTED_CUTT_TY = ''
        // this.CUTT_TYPE_VMODEL_ARR = []
        // this.LAST_CUTT_TYPE_LIST = []
        await this.getCuttTypeTreeList(clTypeCd)

        const FILTERED_CUTT_TYPE_TREE = {
          "level-1": this.getFilteredCuttTypeList(1, this.CUTT_TYPE_TREE.children, '')
        }
        // console.log("FILTERED_CUTT_TYPE_TREE ::: ", FILTERED_CUTT_TYPE_TREE)
        // console.log("this.LAST_CUTT_TYPE_LIST ::: ", this.LAST_CUTT_TYPE_LIST)

        //상담유형 분류
        let cuttTyURL = "/chatgpt-api/categorize/cs"
        const cuttTyPostParam = {
          cutt_cn: cuttCn,
          cutt_tp_list: JSON.stringify(this.LAST_CUTT_TYPE_LIST),
          phn_cutt_id: phnCuttId,
          cht_cutt_id: chtCuttId
        }
        const cuttTyResData =  await this.chatGPT_postCall(cuttTyURL,cuttTyPostParam,{})
        this.REALTIME_SEARCH.isSummrizing = false;
        if(!cuttTyResData.HEADER.ERROR_FLAG) {

          let resArr = cuttTyResData.smr.split("\n\n");
          if(resArr.length <= 1) {
            resArr = cuttTyResData.smr.split("\r\n\r\n");
          }
          resArr.map(item => {
            let itemArr = item.split(">>:\n")
            if(itemArr.length <= 1) {
              itemArr = item.split(">>:\r\n")
            }
            if(itemArr[0].indexOf("Summarize") > 0) {
              this.REALTIME_SEARCH.summary = itemArr[1]
            }
            else if(itemArr[0].indexOf("Categorize-Result") > 0) {
              const categorizeJson = JSON.parse(itemArr[1])
              this.initCuttTyList(categorizeJson.length)
              for(let i=0; i<categorizeJson.length; i++) {
                const codeList = categorizeJson[i].code.split("-")
                this.CUTT_TYPE_VMODEL_ARR[i].map((item, idx) => {
                  this.$set(this.CUTT_TYPE_VMODEL_ARR[i], idx, codeList[idx])
                })
              }
            }
          })
        }
      },

      //상담 유형 자동 분류 초기화
      initCuttTyList(candidatesCnt) {
        //CUTT_TYPE_VMODEL_ARR[후보갯수][상담유형 최대 레벨] ::: ex) CUTT_TYPE_VMODEL_ARR[3][2]
        this.CUTT_TYPE_VMODEL_ARR = Array.from(Array(candidatesCnt), () => Array(parseInt(this.CUTT_TYPE_LMT_LVL_CD)).fill(''))
      },

      //실시간 검색 - 상담요약 적용 버튼 이벤트
      applySummary() {
        if(this.SELECTED_CUTT_TY == '') {
          this.showAlert({alertDialogToggle: true, msg: "상담 유형을 선택해 주세요.", iconClass: 'is-info', type: 'default'});
          return
        }
        this.$parent.applyCuttCn(this.REALTIME_SEARCH.summary, this.SELECTED_CUTT_TY);
      },

      newLine(content) {
        if (!content) return;
        return content.split("\n").join("<br/>");
      },

      //메인 탭 변경
      async changeMainTab(tabIdx) {
        this.mainTabs = tabIdx;
      },

      //실시간 검색 하위 탭 변경
      async changeRealtimeTab(tabIdx) {
        this.realtimeTabs = tabIdx;
      },


      //상담유형 Tree 목록 조회
      async getCuttTypeTreeList(clTypeCd) {
        let sUrl = '/api/setting/cuttType/cuttTypeTreeList';
        let postParam = {
          CUTT_TYPE_SE_CD : clTypeCd
        }

        let headParam = {
          head : {
          }
        }

        let resData  = await this.common_postCall(sUrl, postParam, headParam);

        if (!resData.HEADER.ERROR_FLAG){
          //상담유형 Tree 데이터
          if(resData.CUTT_TYPE_TREE){
            this.CUTT_TYPE_TREE = resData.CUTT_TYPE_TREE[0];
          }

          if(resData.CUTT_TYPE_SETTING){
            this.CUTT_TYPE_LMT_LVL_CD = resData.CUTT_TYPE_SETTING[0].CUTT_TYPE_LMT_LVL_CD;
            this.CUTT_ITEMS = resData.DATA;
          }
        }
      },


      getFilteredCuttTypeList(level, list, parentCodeList) {
        const nextLevel = parseInt(level)+1
        const nextLevelName = "level-"+nextLevel
        return [
          list.map(({id, name, CUTT_TYPE_EXPLN, children}) => {
            const codeList = parentCodeList == '' ? id : parentCodeList + '-' + id
            let returnItem  = {"code": codeList, "name": name, "description":CUTT_TYPE_EXPLN}
            if(children.length > 0) {
              returnItem[nextLevelName] = this.getFilteredCuttTypeList(nextLevel, children, codeList)
            } else if(children.length == 0) {
              this.LAST_CUTT_TYPE_LIST.push(returnItem)
            }

            return returnItem
          })
        ]
      },


      //상담유형 하위 item 가져오기
      getChildCuttTypeItems(idx, parentItem) {
        let arrCuttType = [];

        if(idx === 0){
          parentItem = this.CUTT_ITEMS[0].CUTT_TYPE_ID;
          this.CUTT_ITEMS.map(function(row){
            if(row.UP_CUTT_TYPE_ID === parentItem)
              if(row) arrCuttType.push(row);
          });
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

      //상담유형 변경 이벤트
      changeCuttTypeItems(cIdx, idx){
        this.CUTT_TYPE_ID = this.CUTT_TYPE_VMODEL_ARR[cIdx][idx];
        for(let k=0; k<this.CUTT_TYPE_VMODEL_ARR[cIdx].length; k++){
          if(k > idx) this.CUTT_TYPE_VMODEL_ARR[cIdx][k] = '';//초기화
        }
      },

      // 상담유형 자동분류
      selectCsType(item){
        for(let index = 0; index < this.CS_TYPE_SORT.length; index++){
          this.CS_TYPE_SORT[index].checked = false;
        }
        item.checked = true;
      },

      nextCuttInfo() {
        this.seq++;

        if(this.INTEG_CONNECT_HIST.INTEG_CUTT_HIST_LIST.length-1 === this.seq){
          if(this.INTEG_CONNECT_HIST.INTEG_CUTT_HIST_CNT > this.INTEG_CONNECT_HIST.INTEG_CUTT_HIST_LIST.length){
            this.TMP_LOADING = true;
            this.getSearch('cutt', 'next');
          }
        }
      },

      async vstRsvtCancel(item) {
        this.showAlert({
          alertDialogToggle: true
          , msg: '예약을 취소 하시겠습니까?<br>예약 취소시 동시간 배정이 불가할 수 있습니다.'
          , iconClass: 'is-info'
          , type: 'confirm'
          , callYes: () => {
            this.$store.commit("alertStore/hideAlert");
            this.dialogTitl = '취소 사유';
            this.REASON_TP_LIST = this.mixin_common_code_get(this.common_code, 'VRS_RTRCN');
            this.dialogCommonReason = true;
            this.VST_CANCEL_INFO = item;
          }
          , callNo: () => {
            this.$store.commit("alertStore/hideAlert");
          }
        });
      },

      async vstRsvtProc() {
        if(!this.STTS_DTL_CD){
          this.showAlert({alertDialogToggle: true, msg: '사유를 선택해 주세요.', iconClass: 'is-info', type: 'default'});
          return;
        }else{
          if(this.STTS_DTL_CD.indexOf('_ETC') > -1 && !this.CN){
            this.showAlert({alertDialogToggle: true, msg: '사유를 입력해 주세요.', iconClass: 'is-info', type: 'default'});
            return;
          }
        }

        let sUrl = '/api/vst/vstRsvtProc';
        let postParam = {};

        let _this = this;
        Object.keys(_this.VST_CANCEL_INFO).forEach(function(key) {
          if(key === 'VST_RSVT_ID' //방문 예약 ID
            || key === 'CUST_NM' //고객명
            || key === 'REL_CD' //관계 코드
            || key === 'CUST_TELNO' //고객 전화번호
            || key === 'SRVC_TYPE_CD' //서비스 종류
            || key === 'PRDCT_TYPE_ID' //AS 제품
            || key === 'ZIP' //우편번호
            || key === 'ADDR' //주소
            || key === 'ADDR_DTL' //상세주소
            || key === 'PRDCT_TYPE_ID' //상품유형
            || key === 'DMND_MTTR' //문의내용
            || key === 'EXCPTN_MTTR' //특이사항
            || key === 'VSTR_ID' //방문자 ID
          ){
            postParam[key] = _this.VST_CANCEL_INFO[key];
          }
        });

        postParam.STTS_CD = 'VRS_RTRCN'; //취소
        if(this.STTS_DTL_CD) postParam.STTS_DTL_CD = this.STTS_DTL_CD;
        if(this.CN) postParam.CN = this.CN;

        //SMS 전송용 Param
        postParam.callback_number = this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO.split(',')[0];

        let response  = await this.common_postCall(sUrl, postParam, {head : {}});

        if (!response.HEADER.ERROR_FLAG){
          this.dialogCommonReason = false;
          this.$store.commit("alertStore/hideAlert");
          this.showAlert({alertDialogToggle: true, msg: '취소 처리되었습니다.', iconClass: 'is-info', type: 'default'});
          this.$eventBus.$emit('closeAssignManager');
          this.getSearch('vstRsvt', '');
        }
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>