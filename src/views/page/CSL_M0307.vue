<template>
  <div class="pl-container type-stat">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top />
      <!-- sub content -->
      <v-tabs class="pl-tabs" v-model="tab">
        <v-tab>나의 전화 상담이력</v-tab>
        <v-tab>나의 SNS 상담이력</v-tab>
      </v-tabs>
      <div style="height: calc(100vh - 244px)">
        <div class="pl-cols" style="height: 100%">
          <div class="is-vrt">
            <v-tabs-items v-model="tab" class="pl-tabs-items">
              <!-- 나의 전화 상담이력 -->
              <v-tab-item>
                <!-- top search -->
                <div class="pl-card">
                  <div class="pl-search-form pb-0">
                    <div class="pl-form-inline-wrap">
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          조회 기간
                        </span>
                        <div class="pl-desc">
                          <compo-date-range-picker
                            :StartDayProp.sync="START_DATE_PHN"
                            :EndDayProp.sync="END_DATE_PHN"
                            @startDayChange="mixin_testLog(START_DATE_PHN)"
                            @endDayChange="mixin_testLog(END_DATE_PHN)"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          콜 유형
                        </span>
                        <div class="pl-desc">
                          <v-select
                            class="pl-form is-sm"
                            v-model="SCH_CL_TYPE_CD"
                            :items="mixin_common_code_get(this.list_common_code, 'CALL_TP', '전체')"
                            placeholder="선택하세요"
                          ></v-select>
                        </div>
                        <span class="pl-label">
                          상담 결과
                        </span>
                        <div class="pl-desc">
                          <v-select
                            class="pl-form is-sm"
                            v-model="SCH_CUSL_RS_CD"
                            :items="mixin_common_code_get(this.list_common_code, 'CUSL_RS', '전체')"
                            @change="schCuttHistList('')"
                            placeholder="선택하세요"
                          ></v-select>
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          상담 유형
                        </span>
                        <div class="pl-desc">
                          <v-autocomplete
                            v-model="SCH_CUTT_TYPE"
                            return-object
                            class="pl-form"
                            :items="CUTT_TYPE_ITEMS"
                            v-on:change="schCuttHistList('')"
                            placeholder="선택하세요"
                            clearable
                            no-data-text="결과 없음"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          <v-select
                              v-model="SCH_KEY_PHN"
                            class="pl-form is-sm"
                            :items="mixin_common_code_get(this.list_common_code, 'CUTT_HIST_SRCH')"
                            placeholder="선택하세요"
                          ></v-select>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            class="pl-form"
                            v-model="SCH_KEYWORD_PHN"
                            oninput="javascript: this.value = this.value.replace(/[^a-z|A-Z|0-9|가-힣|ㄱ-ㅎ|ㅏ-ㅣ]/g, '' );"
                            @keyup.enter="schCuttHistList('')"
                            placeholder="검색어 입력" />
                        </div>
                      </div>
                      <div class="d-flex">
                        <v-btn class="pl-btn is-icon" @click="schCuttHistList('')">
                          <span class="pl-icon20 search"></span>조회
                        </v-btn>
                        <div v-if="SCH_CUST_ATTR.length > 0 || SCH_CUTT_ATTR.length > 0">
                          <compo-tooltip-btn
                            TitleProp="확장속성 검색"
                            ClassProp="pl-tooltip-btn ml-2"
                            IconProp="pl-icon20 detail"
                            TooltipPositionProp="bottom"
                            @btnClick="expsnAttrSchDialog(true)"
                          ></compo-tooltip-btn>
                          <v-slide-y-transition>
                            <div
                              class="pl-drop-layer"
                              v-if="dropSchDetail === true"
                              :style="SCH_CUST_ATTR.length > 0 && SCH_CUTT_ATTR.length > 0 ? 'width: 840px; transform: translateX(-780px)':'width: 420px; transform: translateX(-390px)'">
                              <template v-if="SCH_CUST_ATTR.length > 0 && SCH_CUTT_ATTR.length > 0">
                                <div
                                class="pl-drop-layer-body"
                                style="height: 300px">
                                  <div class="pl-cols is-mt-l">
                                    <div>
                                      <h2 class="pl-subtit">고객 확장 속성</h2>
                                      <div class="pl-scroll-body d-flex flex-column is-mt-m" style="overflow-y: scroll; height: calc(100vh - 680px); gap: 10px">
                                        <div class="pl-form-inline-wrap vertical">
                                          <template v-for="(attr, seq) in SCH_CUST_ATTR">
                                            <div :key="attr.EXPSN_ATTR_COL_ID"  class="pl-form-inline">
                                              <span
                                                class="pl-label"
                                                style="flex: 0 0 120px">
                                                {{ attr.EXPSN_ATTR_NM }}
                                              </span>
                                              <div class="pl-desc">
                                                <template v-if="attr.DATA_TYPE_CD === 'COE' || attr.DATA_TYPE_CD === 'COE_MULTI'">
                                                  <v-select
                                                    class="pl-form"
                                                    :items="mixin_common_code_get(common_code, attr.GROUP_CD_ID, '전체')"
                                                    placeholder="선택하세요"
                                                    v-model="attr.V_ATTR_SCH_MODEL"
                                                  ></v-select>
                                                </template>
                                                <template v-else>
                                                  <v-text-field
                                                    v-model="attr.V_ATTR_SCH_MODEL"
                                                    class="pl-form "
                                                    placeholder="검색어 입력"
                                                  />
                                                </template>
                                              </div>
                                            </div>
                                          </template>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="ml-4">
                                      <h2 class="pl-subtit">상담 확장 속성</h2>
                                      <div class="pl-scroll-body d-flex flex-column is-mt-m" style="overflow-y: scroll; height: calc(100vh - 680px); gap: 10px">
                                        <div class="pl-form-inline-wrap vertical">
                                          <template v-for="(attr, seq) in SCH_CUTT_ATTR">
                                            <div :key="attr.EXPSN_ATTR_COL_ID"  class="pl-form-inline">
                                              <span
                                                class="pl-label"
                                                style="flex: 0 0 120px">
                                                {{ attr.EXPSN_ATTR_NM }}
                                              </span>
                                              <div class="pl-desc">
                                                <template v-if="attr.DATA_TYPE_CD === 'COE' || attr.DATA_TYPE_CD === 'COE_MULTI'">
                                                  <v-select
                                                    class="pl-form"
                                                    :items="mixin_common_code_get(common_code, attr.GROUP_CD_ID, '전체')"
                                                    placeholder="선택하세요"
                                                    v-model="attr.V_ATTR_SCH_MODEL"
                                                  ></v-select>
                                                </template>
                                                <template v-else>
                                                  <v-text-field
                                                    v-model="attr.V_ATTR_SCH_MODEL"
                                                    class="pl-form "
                                                    placeholder="검색어 입력"
                                                  />
                                                </template>
                                              </div>
                                            </div>
                                          </template>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </template>
                              <tempalte v-else>
                                <div class="pl-form-inline-wrap vertical">
                                  <template v-for="(attr, seq) in SCH_CUTT_ATTR">
                                    <div :key="attr.EXPSN_ATTR_COL_ID"  class="pl-form-inline">
                                      <span
                                        class="pl-label"
                                        style="flex: 0 0 120px">
                                        {{ attr.EXPSN_ATTR_NM }}
                                      </span>
                                      <div class="pl-desc">
                                        <template v-if="attr.DATA_TYPE_CD === 'COE' || attr.DATA_TYPE_CD === 'COE_MULTI'">
                                          <v-select
                                            class="pl-form"
                                            :items="mixin_common_code_get(common_code, attr.GROUP_CD_ID, '전체')"
                                            placeholder="선택하세요"
                                            v-model="attr.V_ATTR_SCH_MODEL"
                                          ></v-select>
                                        </template>
                                        <template v-else>
                                          <v-text-field
                                            v-model="attr.V_ATTR_SCH_MODEL"
                                            class="pl-form "
                                            placeholder="검색어 입력"
                                          />
                                        </template>
                                      </div>
                                    </div>
                                  </template>
                                </div>
                              </tempalte>
                              <div class="pl-drop-layer-footer justify-end">
                                <v-btn class="pl-btn is-sub" @click="dropSchDetail=false">닫기</v-btn>
                                <v-btn class="pl-btn" @click="[getCuttHistList(), dropSchDetail=false]">조회</v-btn>
                              </div>
                            </div>
                          </v-slide-y-transition>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- grid -->
                <div class="pl-card">
                  <div class="pl-grid-top">
                    <div class="pl-grid-top-left">
                      <v-btn
                        class="pl-btn is-icon is-sub"
                        @click="getCuttInfo"
                        :disabled="selectedRow.index != undefined ? false : true"
                        >
                        <span class="pl-icon20 document"></span>
                        선택항목 상세
                      </v-btn>
                    </div>
                    <div class="pl-grid-top-utils">
                      <span class="pl-counter">전체 <em class="pl-1">({{ PHONE_LOG_TOT_CNT }})</em> 건</span>
                      <!-- 엑셀 다운로드 버튼 -->
                      <compo-excel
                        v-if="this.mixin_set_btn(this.$options.name, 'btnMyPhnCuttHistExcelDown')"
                        TypeProp="Download"
                        :DownReason=true
                        :DataHeaderProp="PHONE_LOG_HISTORY_HEADER"
                        :DataBodyProp="PHONE_LOG_HISTORY"
                        :FileNameProp="'나의 전화 상담이력 관리 조회_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                        SheetNameProp="나의 전화 상담이력 조회"
                        HeaderColorProp="00B0F0"
                      ></compo-excel>
                    </div>
                  </div>
                  <v-data-table
                    class="pl-grid is-hover"
                    :headers="PHONE_LOG_HISTORY_HEADER"
                    :items="PHONE_LOG_HISTORY"
                    fixed-header
                    height="500px"
                    :items-per-page="ROW_PER_PAGE"
                    :item-class="isActiveRow"
                    hide-default-footer
                    :page.sync="page"
                    no-data-text="등록된 데이터가 없습니다."
                    @page-count="pageCount = $event"
                    @click:row="rowSelect"
                    @dblclick:row="getCuttInfo"
                    >
                    <template v-slot:item.CUST_NM="{ item }">
                      {{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(item.CUST_NM) : item.CUST_NM }}
                    </template>
                    <template v-slot:item.CUST_PHN_NO="{ item }">
                      {{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(item.CUST_PHN_NO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(item.CUST_PHN_NO.replace(/[^0-9]/g, "")) }}
                    </template>
                    <template v-slot:item.REC_FILE_NM="{ item }">
                      <template v-if="$store.getters['userStore/GE_USER_ROLE'].atrtGroupId !== '6'"><!-- 상담사가 아닌 경우-->
                      <!-- <template v-if="$store.getters['userStore/GE_USER_ROLE'].userId === '1'"> -->
                        <v-btn
                          class="pl-btn is-sm is-sub"
                          :disabled="!item.REC_FILE_NM"
                          @click="showRecDialog(item)"
                          >
                          {{ item.REC_FILE_NM ? '듣기' : '파일없음' }}
                        </v-btn>
                      </template>
                      <template v-else><!-- 상담사인 경우 -->
                        <template v-if="mixin_getCustcoSetting('ENV_AUDIO_PLAY_PERM_YN')"><!-- 다른 상담사 녹취 재생 권한이 있는 경우-->
                          <v-btn
                            class="pl-btn is-sm is-sub"
                            :disabled="!item.REC_FILE_NM"
                            @click="showRecDialog(item)"
                            >
                            {{ item.REC_FILE_NM ? '듣기' : '파일없음' }}
                          </v-btn>
                        </template>
                        <template v-else><!-- 다른 상담사 녹취 재생 권한이 없는 경우-->
                          <template v-if="$store.getters['userStore/GE_USER_ROLE'].userId === item.CUSL_ID.toString()"><!-- 내 상담 녹취만 재생 가능-->
                            <v-btn
                              class="pl-btn is-sm is-sub"
                              :disabled="!item.REC_FILE_NM"
                              @click="showRecDialog(item)"
                              >
                              {{ item.REC_FILE_NM ? '듣기' : '파일없음' }}
                            </v-btn>
                          </template>
                          <template v-else>
                            <v-btn
                              class="pl-btn is-sm is-sub"
                              :disabled="true"
                              >
                              {{ item.REC_FILE_NM ? '권한없음' : '파일없음' }}
                            </v-btn>
                          </template>
                        </template>
                      </template>
                    </template>
                    <template v-slot:item.CUTT_TYPE="{ item }">
                      <v-tooltip content-class="pl-tooltip " bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <span v-bind="attrs" v-on="on">{{ item.CUTT_TYPE }}</span>
                        </template>
                        <span>{{ item.CUTT_TYPE }}</span>
                      </v-tooltip>
                    </template>
                    <template v-slot:item.CUSL_RS_NM="{ item }" >
                      <span
                        v-if="item.CUSL_RS_NM !== '-'"
                        :class="`pl-round-chip is-sm chat-stat-${item.CUSL_RS_NM == '처리완료' ? 'done' : 'cs'}`">
                        {{ item.CUSL_RS_NM }}
                      </span>
                    </template>
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
                      :total-visible="7"
                      >
                    </v-pagination>
                    <!-- 더보기 다음 있을때만 노출 -->
                    <span class="pl-pager-period">
                      보기 {{ mixin_getPagePeriod(PHONE_LOG_HISTORY, page) }} / {{ PHONE_LOG_HISTORY.length }}
                      <compo-tooltip-btn
                        TitleProp="다음 검색"
                        ClassProp="pl-tooltip-btn is-line"
                        IconProp="pl-icon20 arrow-next-paging"
                        TooltipPositionProp="top"
                        :DisabledProp="nextDisabled"
                        @btnClick="schCuttHistList('next')"
                      ></compo-tooltip-btn>
                    </span>
                  </div>
                </div>
                <!-- 녹취파일 modal -->
                <compo-audio
                    v-model="dialogListenVoice"
                    AudioType="whole"
                    :audioProp="this.REC_TEMP_DATA"
                />
                <!-- 전화상담 이력 생성 -->
                <v-dialog
                    v-model="dialogAddHistory"
                    content-class="dialog-draggable is-scroll"
                    width='650px'
                    hide-overlay
                >
                  <div class="draggable-area">drag area</div>
                  <compo-dialog :header-title="PHN_CUTT_ID == '' ? '전화상담 이력 생성' : '전화상담 이력 상세 조회'" @hide="mixin_hideDialog('AddHistory')">
                    <template slot="body">
                      <p>강제로 생성한 상담이력은 전적으로 이력을 생성하는 담당자에게 있습니다.</p>
                      <p>필수 항목을 입력하신 후 <strong>[저장] 버튼을 클릭</strong>하십시오.</p>

                      <h2 class="pl-dialog-body-tit-h2 is-border">고객 및 상담 정보</h2>
                      <div class="pl-form-inline-wrap vertical">
                        <div class="pl-form-inline">
              <span class="pl-label">
                상담 시간
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
                          <div class="pl-desc">
                            <!-- <v-text-field
                              v-model="CUTT_BGNG_DT"
                              class="pl-form is-xs"
                              :disabled="PHN_CUTT_ID != ''?true:false"
                              style="flex:0 0 48%;"
                              hide-spin-buttons
                              type="number"
                              oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                              v-byte-counter="14"
                            ></v-text-field>
                            <v-text-field
                              v-model="CUTT_END_DT"
                              class="pl-form is-xs"
                              :disabled="PHN_CUTT_ID != ''?true:false"
                              style="flex:0 0 48%;"
                              hide-spin-buttons
                              type="number"
                              oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                              v-byte-counter="14"
                            ></v-text-field> -->
                            <template v-if="(PHN_CUTT_ID === '' || FORC_CRT_YN === 'Y') && !REC_FILE_NM"><!-- 콜 이력에서 녹취 파일을 선택하지 않은 경우 -->
                              <compo-date-picker
                                  v-model="CUTT_BGNG_DT"
                                  style="width:187px"
                                  DateType="dateTime"
                                  :DateProp.sync="CUTT_BGNG_DT"
                                  :TimesProp.sync="CUTT_BGNG_TIME"
                              />
                              <span class="pl-unit">~</span>
                              <compo-date-picker
                                  v-model="CUTT_END_DT"
                                  style="width:187px"
                                  DateType="dateTime"
                                  :DateProp.sync="CUTT_END_DT"
                                  :TimesProp.sync="CUTT_END_TIME"
                              />
                            </template>
                            <template v-else><!-- 콜 이력에서 녹취 파일을 선택한 경우 -->
                              {{ this.CUTT_BGNG_DT + ' ' + this.CUTT_BGNG_TIME }} ~ {{ this.CUTT_END_DT + ' ' + this.CUTT_END_TIME }}
                            </template>
                          </div>
                        </div>
                        <div class="pl-form-inline">
              <span class="pl-label">
                상담 채널
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
                          <div class="pl-desc">
                            <v-select
                                class="pl-form"
                                v-model="CL_TYPE_CD"
                                :items="mixin_common_code_get(this.common_code, 'CALL_TP')"
                                :disabled="this.cuttFormStat === 'D'?true:false"
                                placeholder="선택하세요"
                            ></v-select>
                            <v-select
                                class="pl-form"
                                v-model="CHNL"
                                :items="mixin_common_code_get(this.common_code, 'CHNL')"
                                disabled
                                placeholder="선택하세요"
                            ></v-select>
                          </div>
                        </div>
                        <div class="pl-form-inline">
              <span class="pl-label">
                고객
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
                          <div class="pl-desc">
                            <v-text-field
                                v-model="SRCH_CUST.CUST_NM"
                                class="pl-form is-xs"
                                style="flex:0 0 40%;"
                                disabled
                            ></v-text-field>
                            <v-text-field
                                v-model="SRCH_CUST.CUST_PHN_NO"
                                class="pl-form is-xs"
                                :style="cuttFormStat === 'C'?'flex:0 0 47%;':'flex:0 0 57%;'"
                                disabled
                            ></v-text-field>
                            <!-- 찾기 버튼 -->
                            <compo-tooltip-btn
                                v-if="cuttFormStat === 'C'"
                                TitleProp="이력을 생성할 해당 고객을 찾기하여 선택하십시오."
                                ClassProp="pl-tooltip-btn flex-grow-0"
                                IconProp="pl-icon20 in-search"
                                TooltipPositionProp="bottom"
                                @btnClick="custSearch()"
                            ></compo-tooltip-btn>
                          </div>
                        </div>
                      </div>

                      <h2 class="pl-dialog-body-tit-h2 is-border">상담직원 및 결과 정보</h2>
                      <div class="pl-form-inline-wrap vertical">
                        <div class="pl-form-inline">
              <span class="pl-label">
                상담직원
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
                          <div class="pl-desc">
                            <v-text-field
                                v-model="SRCH_USER.USER_NM"
                                class="pl-form flex-grow-1"
                                placeholder="우측의 찾기 아이콘을 클릭 하십시오"
                                disabled
                            ></v-text-field>
                            <!-- 찾기 버튼 -->
                            <compo-tooltip-btn
                                v-if="cuttFormStat === 'C'"
                                TitleProp="고객과 응대한 상담직원을 찾기하여 선택하십시오."
                                ClassProp="pl-tooltip-btn flex-grow-0"
                                IconProp="pl-icon20 in-search"
                                TooltipPositionProp="bottom"
                                @btnClick="userSearch()"
                            ></compo-tooltip-btn>
                          </div>
                        </div>
                        <div class="pl-form-inline">
              <span class="pl-label">
                후처리 시간
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
                          <div class="pl-desc">
                            <v-text-field
                                v-model="AFTPRCS_HR"
                                class="pl-form"
                                :disabled="PHN_CUTT_ID != ''?true:false"
                                hide-spin-buttons
                                type="number"
                                oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                                suffix="초"
                                v-byte-counter="4"
                            />
                          </div>
                        </div>
                        <!-- <div class="pl-form-inline">
                          <span class="pl-label">
                            녹취 파일
                          </span>
                          <div class="pl-desc">
                            <v-text-field
                              v-model="REC_FILE_NM"
                              class="pl-form"
                              placeholder="입력하십시오"
                              v-byte-counter="300"
                            ></v-text-field>
                          </div>
                        </div> -->
                        <div class="pl-form-inline">
              <span class="pl-label">
                녹취 파일
              </span>
                          <div class="pl-desc">
                            <v-text-field
                                v-model="REC_FILE_NM"
                                class="pl-form"
                                :class="cuttFormStat === 'C'?'flex-grow-1':''"
                                placeholder="우측의 찾기 아이콘을 클릭 하십시오"
                                v-byte-counter="300"
                                disabled
                            ></v-text-field>
                            <!-- 찾기 버튼 -->
                            <compo-tooltip-btn
                                v-if="cuttFormStat === 'C'"
                                TitleProp="고객과 응대한 콜 이력을 찾기하여 선택하십시오."
                                ClassProp="pl-tooltip-btn flex-grow-0"
                                IconProp="pl-icon20 in-search"
                                TooltipPositionProp="bottom"
                                @btnClick="ipccCallHistSearch()"
                            ></compo-tooltip-btn>
                          </div>
                        </div>
                        <div class="pl-form-inline" v-for="(expsnAttr, seq) in EXPSN_ATTR" :key="expsnAttr.ATTR_ID">
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
                        <div class="pl-form-inline" v-if="this.cuttFormStat === 'D'">
              <span class="pl-label">
                변경 사유
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
                          <div class="pl-desc">
                            <v-textarea
                                v-model="CHG_RSN"
                                class="pl-form is-noresize"
                                v-byte-counter="4000"
                            />
                          </div>
                        </div>
                      </div>
                    </template>

                    <template slot="footer">
                      <v-btn class="pl-btn is-sub" @click="closeDialog('PHN')">닫기</v-btn>
                      <v-btn class="pl-btn"
                             v-if="this.mixin_set_btn(this.$options.name, 'btnCuttReg') || $store.getters['userStore/GE_USER_ROLE'].userId === REG_USER_ID"
                             @click="phoneCuttSaveValidate"
                      >저장</v-btn>
                    </template>

                  </compo-dialog>
                </v-dialog>
              </v-tab-item>
              <!-- 나의 SNS 상담이력 -->
              <v-tab-item>
                <!-- top search -->
                <div class="pl-card">
                  <div class="pl-search-form pb-0">
                    <div class="pl-form-inline-wrap">
                      <div class="pl-form-inline">
                        <div class="pl-desc">
                          <v-select
                              class="pl-form"
                              :items="mixin_common_code_get(list_common_code, 'CHT_SRCH_TP')"
                              v-model="SRCH_TY"
                              placeholder="선택하세요"></v-select>
                        </div>
                        <span class="pl-label">
                          조회 기간
                        </span>
                        <div class="pl-desc">
                          <compo-date-range-picker
                            :StartDayProp.sync="START_DATE_CHT"
                            :EndDayProp.sync="END_DATE_CHT"
                            @startDayChange="mixin_testLog(START_DATE_CHT)"
                            @endDayChange="mixin_testLog(END_DATE_CHT)"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          채팅채널/분류
                        </span>
                        <div class="pl-desc">
                          <v-select
                            class="pl-form is-sm"
                            :items="DROP_SRCH_SNDR"
                            item-text="DSPTCH_PRF_NM"
                            item-value="SNDR_KEY"
                            v-model="SRCH_SNDR"
                            placeholder="선택하세요"
                            @change="sndrSel('srch')"
                          ></v-select>
                        </div>
                        <div class="pl-desc">
                          <v-select
                            class="pl-form is-sm"
                            :items="mixin_common_code_get(this.list_common_code, 'CHNL_CL', '전체')"
                            v-model="SRCH_CHN_CLSF_CD"
                            :readonly="SRCH_SNDR == '' ? false : true"
                            placeholder="선택하세요"
                          ></v-select>
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          상태
                        </span>
                        <div class="pl-desc">
                          <v-select
                            class="pl-form"
                            :items="mixin_common_code_get(this.list_common_code, 'CUSL_STAT', '전체')"
                            v-model="SRCH_CUTT_STTS_CD"
                            placeholder="선택하세요"
                          ></v-select>
                        </div>
                      </div>
                      <!-- <div class="pl-form-inline">
                        <span class="pl-label">
                          고객명
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            class="pl-form"
                            v-model="SCH_KEYWORD_CHT"
                            oninput="javascript: this.value = this.value.replace(/[^a-z|A-Z|0-9|가-힣|ㄱ-ㅎ|ㅏ-ㅣ]/g, '' );"
                            @keyup.enter="chtHstrySrch('')"
                            placeholder="검색어 입력" />
                        </div>
                      </div> -->
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          <v-select
                            v-model="USER_SRCH_TY"
                            class="pl-form is-sm"
                            :items="mixin_common_code_get(this.list_common_code, 'CUTT_HIST_SRCH')"
                            placeholder="선택하세요"
                          ></v-select>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            class="pl-form"
                            v-model="USER_SRCH"
                            oninput="javascript: this.value = this.value.replace(/[^a-z|A-Z|0-9|가-힣|ㄱ-ㅎ|ㅏ-ㅣ]/g, '' );"
                            @keyup.enter="chtHstrySrch('')"
                            placeholder="검색어 입력" />
                        </div>
                      </div>
                      <v-btn class="pl-btn is-icon" @click="chtHstrySrch('')">
                        <span class="pl-icon20 search"></span>조회
                      </v-btn>
                    </div>
                  </div>
                </div>
                <!-- grid -->
                <div class="pl-card">
                  <div class="pl-grid-top">
                    <div class="pl-grid-top-left">
                      <v-btn
                        class="pl-btn is-icon is-sub"
                        @click="mixin_showDialog('AddSnsHistory')"
                        :disabled="SEL_ITEM.CHT_CUTT_ID != undefined ? false : true"
                        >
                        <span class="pl-icon20 document"></span>
                        선택항목 상세
                      </v-btn>
                    </div>
                    <div class="pl-grid-top-utils">
                      <span class="pl-counter">전체 <em class="pl-1">({{ SNS_LOG_TOT_CNT }})</em> 건</span>
                      <!-- 엑셀 다운로드 버튼 -->
                      <compo-excel
                        v-if="this.mixin_set_btn(this.$options.name, 'btnMyChtCuttHistExcelDown')"
                        TypeProp="Download"
                        :DataHeaderProp="SNS_LOG_HISTORY_HEADER"
                        :DataBodyProp="SNS_LOG_HISTORY"
                        :FileNameProp="'나의 SNS 상담이력 관리 조회_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                        SheetNameProp="나의 SNS 상담이력 조회"
                        HeaderColorProp="00B0F0"
                      ></compo-excel>
                    </div>
                  </div>
                  <v-data-table
                    class="pl-grid is-hover"
                    :headers="SNS_LOG_HISTORY_HEADER"
                    :items="SNS_LOG_HISTORY"
                    fixed-header
                    height="500px"
                    :items-per-page="ROW_PER_PAGE2"
                    :item-class="isActiveRowSNS"
                    hide-default-footer
                    :page.sync="page2"
                    no-data-text="등록된 데이터가 없습니다."
                    @page-count="pageCount2 = $event"
                    @click:row="rowSelectSNS"
                    @dblclick:row="mixin_showDialog('AddSnsHistory')"
                    >
                    <template v-slot:item.CUTT_TYPE="{ item }">
                      <v-tooltip content-class="pl-tooltip " bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <span v-bind="attrs" v-on="on">{{ item.CUTT_TYPE }}</span>
                        </template>
                        <span>{{ item.CUTT_TYPE }}</span>
                      </v-tooltip>
                    </template>
                    <template v-slot:item.CHAT_LOG="{ item }">
                      <v-btn
                        class="pl-btn is-sm is-sub"
                        @click="[chatHstSrch(item),mixin_showDialog('ChatLog3')]"
                      >채팅보기
                      </v-btn>
                    </template>
                  </v-data-table>
                  <div class="pl-pager">
                    <div class="pl-pager-row">
                      <span>페이지당 항목 수</span>
                      <v-select
                        class="pl-form"
                        :value="ROW_PER_PAGE2"
                        :items="perPage2"
                        :item-text="toString(ROW_PER_PAGE2)"
                        @change="ROW_PER_PAGE2 = parseInt($event, 10);"
                      ></v-select>
                    </div>
                    <v-pagination
                      v-model="page2"
                      :length="pageCount2"
                      circle
                      :total-visible="7"
                      >
                    </v-pagination>
                    <!-- 더보기 다음 있을때만 노출 -->
                    <span class="pl-pager-period">
                      보기 {{ mixin_getPagePeriod(SNS_LOG_HISTORY, page2) }} / {{ SNS_LOG_HISTORY.length }}
                      <compo-tooltip-btn
                        TitleProp="다음 검색"
                        ClassProp="pl-tooltip-btn is-line"
                        IconProp="pl-icon20 arrow-next-paging"
                        TooltipPositionProp="top"
                        :DisabledProp="nextDisabled2"
                        @btnClick="chtHstrySrch('next')"
                      ></compo-tooltip-btn>
                    </span>
                  </div>
                </div>
                <v-dialog v-model="dialogAddSnsHistory" content-class="dialog-draggable is-scroll" hide-overlay>
                  <div class="draggable-area">drag area</div>
                  <compo-dialog :header-title="SEL_CHT_CUTT_ID == '' ? 'SNS 상담 이력 생성' : 'SNS 상담 이력 상세 조회'" @hide="mixin_hideDialog('AddSnsHistory')">
                    <template slot="body">
                      <p>강제로 생성한 상담이력은 전적으로 이력을 생성하는 담당자에게 있습니다.</p>
                      <p>필수 항목을 입력하신 후 <strong>[저장] 버튼을 클릭</strong>하십시오.</p>

                      <v-form ref="form">
                        <div class="pl-form-inline-wrap vertical is-mt-m">
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              상담 채널
                              <v-icon class="pl-icon20 required"></v-icon>
                            </span>
                            <div class="pl-desc">
                              <v-select
                                  class="pl-form"
                                  :items="DROP_SNDR"
                                  item-text="DSPTCH_PRF_NM"
                                  item-value="SNDR_KEY"
                                  v-model="SNDR_KEY"
                                  placeholder="선택하세요"
                                  @change="sndrSel('reg')"
                                  :rules="validateRules.SNDR_KEY"
                                  :disabled="SEL_CHT_CUTT_ID == '' ? false : true"
                              ></v-select>
                            </div>
                          </div>
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              채널 분류
                              <v-icon class="pl-icon20 required"></v-icon>
                            </span>
                            <div class="pl-desc">
                              <v-select
                                  class="pl-form"
                                  :items="mixin_common_code_get(list_common_code, 'CHNL_CL')"
                                  v-model="CHN_CLSF_CD"
                                  :rules="validateRules.CHN_CLSF_CD"
                                  readonly
                                  placeholder="선택하세요"></v-select>
                            </div>
                          </div>
                          <div class="pl-form-inline">
                            <span class="pl-label">
                              상담 유형
                              <v-icon class="pl-icon20 required"></v-icon>
                            </span>
                            <div class="pl-desc">
                              <v-select v-for="(cuttType, idx) in CUTT_TYPE_VMODEL_ARR" :key="idx"
                                        v-model="CUTT_TYPE_VMODEL_ARR[idx]"
                                        class="pl-form"
                                        :items="getChildCuttTypeSnsItems(idx, idx===0?'':CUTT_TYPE_VMODEL_ARR[idx-1])"
                                        item-text="CUTT_TYPE_NM"
                                        item-value="CUTT_TYPE_ID"
                                        placeholder="선택하세요"
                                        style="flex: 0 0 100%;"
                                        v-on:change="changeCuttTypeSnsItems(idx)"
                              />
                            </div>
                          </div>
                          <div class="pl-form-inline">
                          <span class="pl-label">
                            상담직원
                            <v-icon class="pl-icon20 required"></v-icon>
                          </span>
                            <div class="pl-desc">
                              <v-text-field
                                  v-model="SRCH_USER.USER_NM"
                                  class="pl-form flex-grow-1"
                                  placeholder="우측의 찾기 아이콘을 클릭 하십시오"
                                  disabled
                                  :rules="validateRules.SRCH_USER"
                              ></v-text-field>
                              <!-- 찾기 버튼 -->
                              <compo-tooltip-btn
                                  TitleProp="고객 찾기"
                                  ClassProp="pl-tooltip-btn flex-grow-0"
                                  IconProp="pl-icon20 in-search"
                                  TooltipPositionProp="bottom"
                                  @btnClick="userSearch()"
                                  :DisabledProp="SEL_CHT_CUTT_ID == '' ? false : true"
                              ></compo-tooltip-btn>
                            </div>
                          </div>
                          <div class="pl-form-inline">
              <span class="pl-label">
                상담 시작일시
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
                            <div class="pl-desc">
                              <compo-date-picker
                                  DateType="dateTime"
                                  :DateProp.sync="startDateTime"
                                  :TimesProp.sync='startDatetimeStep'
                                  :DisabledProp="SEL_CHT_CUTT_ID == '' ? false : true"
                              />
                            </div>
                          </div>
                          <div class="pl-form-inline">
              <span class="pl-label">
                상담 종료일시
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
                            <div class="pl-desc">
                              <compo-date-picker
                                  DateType="dateTime"
                                  :DateProp.sync="endDateTime"
                                  :TimesProp.sync='endDatetimeStep'
                                  :DisabledProp="SEL_CHT_CUTT_ID == '' ? false : true"
                              />
                            </div>
                          </div>
                          <div class="pl-form-inline">
              <span class="pl-label">
                고객 정보
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
                            <div class="pl-desc">
                              <v-text-field
                                  v-model="SRCH_CUST.CUST_NM"
                                  class="pl-form flex-grow-1"
                                  placeholder="우측의 찾기 아이콘을 클릭 하십시오"
                                  disabled
                                  :rules="validateRules.SRCH_CUST"
                              ></v-text-field>
                              <!-- 찾기 버튼 -->
                              <compo-tooltip-btn
                                  TitleProp="고객 찾기"
                                  ClassProp="pl-tooltip-btn flex-grow-0"
                                  IconProp="pl-icon20 in-search"
                                  TooltipPositionProp="bottom"
                                  @btnClick="cusSearch()"
                                  :DisabledProp="SEL_CHT_CUTT_ID == '' ? false : true"
                              ></compo-tooltip-btn>
                            </div>
                          </div>
                          <div class="pl-form-inline">
              <span class="pl-label">
                처리 결과
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
                            <div class="pl-desc">
                              <v-select
                                  class="pl-form"
                                  :items="mixin_common_code_get(list_common_code, 'CUSL_STAT')"
                                  v-model="CUTT_STTS_CD"
                                  placeholder="선택하세요"
                                  :rules="validateRules.CUTT_STTS_CD"
                              ></v-select>
                            </div>
                          </div>
                          <div class="pl-form-inline">
              <span class="pl-label">
                상담 내용
              </span>
                            <div class="pl-desc">
                              <v-textarea
                                  class="pl-form is-noresize"
                                  height="90px"
                                  placeholder="상담 내용을 입력하십시오."
                                  v-model="CUTT_CN"
                                  v-byte-counter="4000"
                              />
                            </div>
                          </div>
                        </div>
                      </v-form>
                      <ul class="pl-list-info">
                        <li>처리결과가 [완료] 상태인 이력만 수정/저장이 가능합니다.</li>
                      </ul>
                    </template>
                    <template slot="footer">
                      <v-btn class="pl-btn is-sub" @click="closeDialog('SNS')">닫기</v-btn>
                      <v-btn
                          v-if = "SEL_CHT_CUTT_ID == ''"
                          class="pl-btn"
                          @click="showAlert(MESSAGE.CONFIRM.REG)"
                          :disabled="CUTT_STTS_CD.indexOf('CMPL') == -1 ? true : false"
                      >저장</v-btn>
                      <v-btn
                          v-if = "SEL_CHT_CUTT_ID != ''"
                          class="pl-btn"
                          @click="showAlert(MESSAGE.CONFIRM.MDFCN)"
                          :disabled="CUTT_STTS_CD.indexOf('CMPL') == -1 ? true : false"
                      >수정</v-btn>
                    </template>

                  </compo-dialog>
                </v-dialog>
                <v-dialog
                    v-model="dialogChatLog3"
                    content-class="dialog-draggable"
                    hide-overlay>
                  <div class="draggable-area">drag area</div>
                  <compo-dialog
                      header-title="대화내용"
                      @hide="mixin_hideDialog('ChatLog3')"
                  >
                    <template slot="body">
                      <!-- component -->
                      <compo-chatting
                          v-if="this.CHN_CLSF_CD !== 'BBS'"
                          :ChatLogProp="CHAT_LOG"
                          :BfrChatLogProp="[]"
                      />
                      <compo-chat-log-bbs
                          v-if="this.CHN_CLSF_CD == 'BBS'"
                          :ChatLogProp="CHAT_LOG"
                      />
                    </template>
                  </compo-dialog>
                </v-dialog>
              </v-tab-item>
            </v-tabs-items>
          </div>
          <!-- right -->
          <div class="is-col-fix is-vrt" style="width: 370px">
            <div class="pl-card">
              <!-- 전화 상담 차트 -->
              <div class="pl-stat-doughnut-chart">
                <h2 class="pl-subtit">전화 상담</h2>
                <chartjsDoughnutChart
                  class="is-mt-s h130"
                  :chartData="DonughtData"
                  :chartOptions="DonughtOptions"
                  :styles="{ background: '#fff' }"
                ></chartjsDoughnutChart>
                <ul class="pl-list-info4 is-mt-m">
                  <li>
                    <span class="pl-list-info-title">전체</span>
                    <strong class="pl-list-info-desc">{{ mixin_convertNumToComma(MONITOR.PHONE_TYPE.total) }}</strong>
                  </li>
                  <li>
                    <span class="pl-list-info-title">처리완료</span>
                    <strong class="pl-list-info-desc">{{ mixin_convertNumToComma(MONITOR.PHONE_TYPE.done) }}</strong>
                  </li>
                  <li>
                    <span class="pl-list-info-title">처리율</span>
                    <strong class="pl-list-info-desc">{{ mixin_convertNumToComma(MONITOR.PHONE_TYPE.per) }}%</strong>
                  </li>
                </ul>
              </div>
              <!-- SNS 상담 차트 -->
              <div class="pl-stat-bar-chart is-mt-m">
                <h2 class="pl-subtit d-flex">SNS 상담</h2>
                <chartjsBarChart
                  class="is-mt-m h160 px-4"
                  :chartData="BarData"
                  :chartOptions="BarOptions"
                  :styles="{ background: '#fff' }"
                ></chartjsBarChart>
                <v-divider class="mt-2"></v-divider>
                <ul class="pl-line-list is-mt-m px-2">
                  <li>
                    <span class="pl-list-info-title">대기</span>
                    <strong class="pl-list-info-desc">{{ mixin_convertNumToComma(MONITOR.SNS_TYPE.wait) }}({{ MONITOR.SNS_TYPE.wait_per }}%)</strong>
                  </li>
                  <li>
                    <span class="pl-list-info-title">상담중</span>
                    <strong class="pl-list-info-desc">{{ mixin_convertNumToComma(MONITOR.SNS_TYPE.cs) }}({{ MONITOR.SNS_TYPE.cs_per }}%)</strong>
                  </li>
                  <li>
                    <span class="pl-list-info-title">완료</span>
                    <strong class="pl-list-info-desc">{{ mixin_convertNumToComma(MONITOR.SNS_TYPE.done) }}({{ MONITOR.SNS_TYPE.done_per }}%)</strong>
                  </li>
                  <li>
                    <span class="pl-list-info-title">후처리</span>
                    <strong class="pl-list-info-desc">{{ mixin_convertNumToComma(MONITOR.SNS_TYPE.after) }}({{ MONITOR.SNS_TYPE.after_per }}%)</strong>
                  </li>
                  <li>
                    <span class="pl-list-info-title">기타</span>
                    <strong class="pl-list-info-desc">{{ mixin_convertNumToComma(MONITOR.SNS_TYPE.etc) }}({{ MONITOR.SNS_TYPE.etc_per }}%)</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chartjsDoughnutChart from "@/components/chartjsDoughnutChart";
import chartjsBarChart from "@/components/chartjsBarChart";
import CompoChatLogBbs from "@/components/CompoChatLogBbs.vue";

export default {
  name: "MENU_CSL_M0307", //name은 'MENU_' + 파일명 조합
  components: {
    CompoChatLogBbs,
    chartjsBarChart,
    chartjsDoughnutChart
  },
  data() {
    return {
      tab: null,
      /*
        나의 전화 상담이력
      */

      // TODAY : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      // 시작 일자
      START_DATE_PHN : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),          // 전화 상담이력 조회 - 시작일
      START_DATE_CHT : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),          // 채팅 상담이력 조회 - 시작일
      // 종료 일자
      END_DATE_PHN : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),            // 전화 상담이력 조회 - 종료일
      END_DATE_CHT : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),            // 채팅 상담이력 조회 - 종료일

      SCH_KEY_PHN: 'CUST_NM',
      SCH_KEYWORD_PHN : '',
      SCH_KEY_CHT: '',
      SCH_KEYWORD_CHT : '',

      SRCH_CUST:[], //고객 정보
      SRCH_USER:[],
      // grid
      selectedRow : {},
      SEL_ITEM : {},
      nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
      nextDisabled2:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼


      PHN_CUTT_ID : '', //전화상담 ID
      CUTT_BGNG_DT : '', //상담 시작 일시
      CUTT_BGNG_TIME : '', //상담 시작 일시
      CUTT_END_DT : '', //상담 종료 일시
      CUTT_END_TIME : '', //상담 종료 일시
      CL_TYPE_CD: 'IN', //인바운드 고정
      CHNL:'TEL',//채널 전화 고정
      AFTPRCS_HR:'', //후처리 시간(초)
      FORC_CRT_YN: 'N', //강제 생성 여부

      cuttFormStat : 'D',
      CHG_RSN : '',
      //확장속성
      EXPSN_ATTR:[],
      REG_USER_ID:'',
      SELECTED_ATTR_INDEX: 0,

      //필수값 체크
      valid : true,

      validateRules: {
        SNDR_KEY: [
          v => !!v || '상담채널 은(는) 필수 입력 항목입니다.',
        ],
        CHN_CLSF_CD: [
          v => !!v || '채널분류 은(는) 필수 입력 항목 입니다.',
        ],
        CUTT_TYPE_ID: [
          v => !!v || '상담유형 은(는) 필수 입력 항목 입니다.',
        ],
        SRCH_CUST: [
          v => !!v || '고객 정보 은(는) 필수 입력 항목 입니다.',
        ],
        CUTT_STTS_CD: [
          v => !!v || '처리결과 은(는) 필수 입력 항목 입니다.',
        ],
      },

      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,

      page2: 1,
      pageCount2: 0,
      perPage2: [15,30,50,100],
      ROW_PER_PAGE2: 15,

      pagination_phn: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "REG_DT",
        descending: "DESC"
      }, //그리드 페이지속성정의
       pagination_cht: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "REG_DT",
        descending: "DESC"
      }, //그리드 페이지속성정의
      PHONE_LOG_TOT_CNT : 0,

      PHONE_LOG_HISTORY_HEADER: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px' ,sortable: true},
        { text: '콜유형', value: 'CL_TYPE_NM', align: 'left', width: '100px' ,sortable: false},
        { text: '고객명', value: 'CUST_NM', align: 'left', width: '110px' ,sortable: false},
        { text: '고객전화번호', value: 'CUST_PHN_NO', align: 'left', width: '130px' ,sortable: false},
        { text: '통화 시작시간', value: 'NEW_CUTT_BGNG_DT', align: 'left', width: '150px' ,sortable: false},
        { text: '통화 종료시간', value: 'NEW_CUTT_END_DT', align: 'left', width: '150px' ,sortable: false},
        { text: '통화 시간', value: 'PHN_HR', align: 'center', width: '90px' ,sortable: false},
        { text: '상담 결과', value: 'CUSL_RS_NM', align: 'center', width: '90px' ,sortable: false},
        { text: '상담 유형', value: 'CUTT_TYPE', align: 'left', sortable: false},
        { text: '강제 생성 여부', value: 'FORC_CRT_YN', align: 'center', width: '90px' ,sortable: false},
        { text: '녹취파일', value: 'REC_FILE_NM', align: 'center', width: '100px' ,sortable: false},
      ],
      PHONE_LOG_HISTORY: [
        // {
        //   ROW_NUMBER: 0,
        //   CL_TYPE_NM: '아웃바운드',
        //   CUST_NM: '나준영영',
        //   CUST_PHN_NO: '0505-0000-0000',
        //   NEW_CUTT_BGNG_DT: '2024-01-03 14:32:13',
        //   NEW_CUTT_END_DT: '2024-01-03 14:32:13',
        //   PHN_HR: '00:00:08',
        //   CUSL_RS_NM: '처리완료',
        //   CUTT_TYPE: '가입/계정/탈퇴 > 이용(정지/사유/해제)',
        //   FORC_CRT_YN: 'Y',
        //   REC_FILE_NM: true,
        // },
        // {
        //   ROW_NUMBER: 1,
        //   CL_TYPE_NM: '인바운드',
        //   CUST_NM: '나준영영',
        //   CUST_PHN_NO: '0505-0000-0000',
        //   NEW_CUTT_BGNG_DT: '2024-01-03 14:32:13',
        //   NEW_CUTT_END_DT: '2024-01-03 14:32:13',
        //   PHN_HR: '00:00:08',
        //   CUSL_RS_NM: '처리중',
        //   CUTT_TYPE: '가입/계정/탈퇴 > 이용(정지/사유/해제)',
        //   FORC_CRT_YN: 'N',
        //   REC_FILE_NM: false,
        // },
      ],
      // 모니터
      MONITOR: {
        PHONE_TYPE : {
          total : 0,
          done: 0,
          per: 0,
        },
        SNS_TYPE: {
          wait: 0,
          wait_per: 0,
          cs: 0,
          cs_per: 0,
          done: 0,
          done_per: 0,
          after: 0,
          after_per: 0,
          etc : 0,
          etc_per : 0
        }
      },
      //전화 상담 chart
      DonughtData: {
        labels: ["처리중", "처리완료",],
        datasets: [
          {
            backgroundColor: ['#41a3db', '#4bb94a'],
            data: [0, 0],
            noData: false
          }
        ]
      },
      DonughtOptions: {
        responsive: true,
        maintainAspectRatio: false,
        borderWidth: 0,
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              padding: 20,
              boxWidth: 10,
              usePointStyle: true,
              pointStyle: 'Rounded',
            },
          }
        },
      },

      // SNS 상담 chart
      BarData: {
        labels: [
          '대기',
          '상담중',
          '완료',
          '후처리',
          '기타',
        ],
        datasets: [
          {
            // label: "인입호",
            backgroundColor: '#4786e3',
            data: [0, 0, 0, 0, 0],
            noData: false
          },
        ],
      },
      BarOptions: {
        responsive: true,
        maintainAspectRatio: false,
        barThickness: 40,
        borderRadius: 8,
        // indexAxis: 'y',
        plugins: {
          legend: {
            display: false,
          }
        },
      },

      //전화 상담이력 상세 모달
      dialogAddHistory: false,

      // 녹취파일 듣기
      dialogListenVoice : false, //녹음 파일 재생 dialog

      REC_TEMP_DATA: {},

      IPCC_SOCKET_URL : '', //IPCC Socket URL
      AudioSrc : '', //녹음 파일 경로
      REC_FILE_NM:'', //녹취파일명
      //녹취 정지를 위한 요소
      audioElement: null,

      //confirm alert 메시지
      MESSAGE : {
        CONFIRM : {
          REG : {alertDialogToggle: true, msg: '상담내용을 저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.phoneCuttSave, callNo: this.closeMsg}
          , MDFCN: {alertDialogToggle: true, msg: '상담이력을 수정하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.cuttStrg, callNo: this.closeMsg}
        },
        ALERT : {
          SUCCESS : {alertDialogToggle: true, msg: '정상 처리 되었습니다.', iconClass: 'is-info', type: 'default'}
        ,  SEL_PHN_HIST : {alertDialogToggle: true, msg: '조회할 이력을 선택하세요.', iconClass: 'is-info', type: 'default'}
        , MDFCN_SUCCESS : {alertDialogToggle: true, msg: '상담이력이 수정되었습니다', iconClass: 'is-info', type: 'default'}

        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다. 잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
          , CHEKCHG : {alertDialogToggle: true, msg: '항목을 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST : {
          SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 },
          REG_SUCCESS: {  msg: '상담이력이 등록 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 },
          MDFCN_SUCCESS: {  msg: '상담이력이 수정 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 },
        },
      },

      dropSchDetail: false,
      TMP_SCH_CUST_ATTR : [],
      TMP_SCH_CUTT_ATTR : [],
      SCH_CUST_ATTR : [],
      SCH_CUTT_ATTR : [],


      /*
        나의 SNS 상담이력
      */
      //  grid
      SNS_LOG_HISTORY_HEADER: [
        { text: '번호', value: 'ROW_NUMBER', width: '70px', align: 'center',sortable : false },
        { text: '채팅채널', value: 'SNDR_NM', width: '90px', align: 'left' ,sortable : false},
        { text: '채널분류', value: 'CHN_CLSF_NM', width: '100px' , align: 'left',sortable : true},
        { text: '고객명', value: 'CUST_NM', width: '100px' , align: 'left',sortable : false},
        { text: '상담상태', value: 'CUTT_STTS_NM', width: '130px' , align: 'left',sortable : false},
        { text: '상담유형', value: 'CUTT_TYPE', width: '130px', align: 'left',sortable : false},
        { text: '상담접수일시', value: 'NEW_ALTMNT_RDY_REG_DT', width: '150px' , align: 'left',sortable : false},
        { text: '상담시작일시', value: 'NEW_CUTT_BGNG_DT', width: '150px' , align: 'left',sortable : false},
        { text: '상담종료일시', value: 'NEW_CUTT_END_DT', width: '150px', align: 'left',sortable : false },
        { text: '상담이력등록일시', value: 'NEW_CUTT_HSTRY_REG_DT', width: '150px' , align: 'left',sortable : false},
        { text: '채팅내역', value: 'CHAT_LOG', width: '100px', align: 'center',sortable : false },
        ],
        SNS_LOG_HISTORY: [],

      list_common_code : [],
      common_code : [],
      CUTT_ITEMS:[],      //
      CUTT_TYPE_ITEMS:[], // 상담유형
      SNS_LOG_TOT_CNT : 0,

      posX: 0,
      posY: 0,
      times: [
        { label: "30분 후", date: ["dateTimeDate","dateTimeTime", 0, 0, 30] },
        { label: "1시간 후", date: ["dateTimeDate","dateTimeTime", 0, 1, 0] },
        { label: "내일", date: ["dateTimeDate", "dateTimeTime", 1, 0, 0] },
        { label: "이틀 후", date: ["dateTimeDate", "dateTimeTime", 2, 0, 0] },
        { label: "다음 주", date: ["dateTimeDate", "dateTimeTime", 7, 0, 0] }
      ],

      SCH_CUTT_TYPE: '',  // 상담유형 검색조건
      SCH_CUSL_RS_CD : '', // 상담결과 검색조건
      SCH_CL_TYPE_CD : '', // 콜 유형 검색조건

      dialogAddSnsHistory: false,

      // dialog 대화내역 보기
      dialogChatLog3:false,
      CHAT_LOG:[],              //채팅내역
      
      FBDWD_YN: '', //금칙어 적용여부
      SHOW_QSTN:'', //고객이 선택한 문의유형 보기 여부

      DROP_SRCH_SNDR : [], // 채팅채널 드롭박스
      SRCH_SNDR : '',
      SNDR_KEY : '',
      CHN_CLSF_CD  : '',
      SRCH_CHN_CLSF_CD: '',
      SRCH_CUTT_STTS_CD : 'AFTPRCS',
      SRCH_TY: 'ALTMNT_RDY_REG_DT',
      USER_SRCH_TY:'CUST_NM',   //사용자검색구분 => 상담이력 검색구분
      USER_SRCH:'',             //사용자검색어 => 상담이력 검색어

      ITGRT_USE_YN:'',          //통합여부
      CUTT_TYPE_LMT_LVL_CD:'',  //상담유형 레벨
      CUTT_TYPE_VMODEL_ARR:[],  //상담유형 v-model
      CUTT_TYPE_ID:'',          //선택 상담유형
      DROP_SNDR : '',

      startDateTime: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      startDatetimeStep: '00:00',
      endDateTime: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      endDatetimeStep: '00:00',
      timeAmpm: '오후',
      CUTT_STTS_CD:'CMPL',      //처리결과
      CUTT_CN:'',               //채팅내용

      SEL_CHT_CUTT_ID:'',       //선택 채팅ID
    }
  },

  watch: {
  },

  computed: {
    computedTagSize() {
      return `flex: 0 0 ${ this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].inputTagSize + 12 }ch;`;
    }

  },

  async created() {
    let codeName = ['CALL_TP', 'CUSL_RS', 'CUTT_HIST_SRCH','CUST_SRCH','CHNL_CL','CUSL_STAT','CHT_SRCH_TP'];
    this.list_common_code = await this.mixin_common_code_get_all(codeName);
    this.getCuttTypeList();             // 상담유형
    this.expsnAttrSchDialog(false); //확장 속성
    this.schCuttHistList('')      // 나의 전화 상담 이력
    this.chtHstrySrch('')         // 나의 SNS 상담 이력
    this.selectSender();                // 채팅채널 조회
    this.chartInit();                   // 차트 영역 초기화
    this.getChartInfo();                // 차트 정보 조회

    this.FBDWD_YN = await this.mixin_getChtStng('PROHIBITE_APPLY_YN');
    this.SHOW_QSTN = await this.mixin_getChtStng('INQRY_SHOW_YN');
  },

  mounted() {


  },

  methods: {
    // 나의 전화상담 이력 조회
    async getCuttHistList(next) {
      this.selectedRow = {};
      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.PHONE_LOG_HISTORY = [];
        this.pagination_phn.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }
      if(this.tab == '0'){
       await this.getChartInfo();
      }

      let sUrl = '/phone-api/history/cuttHistList';
      let postParam = {
          SCH_CUTT_ST_DTS : this.START_DATE_PHN.replace(/-/gi, '')
        , SCH_CUTT_END_DTS : this.END_DATE_PHN.replace(/-/gi, '')
        , CL_TYPE_CD : this.SCH_CL_TYPE_CD
        , CUSL_RS_CD : this.SCH_CUSL_RS_CD
        , SCH_KEY : this.SCH_KEY_PHN
        , SCH_KEYWORD : this.SCH_KEYWORD_PHN
        , SCH_CUTT_TYPE : this.SCH_CUTT_TYPE?this.SCH_CUTT_TYPE.value:''
        , LVL : this.SCH_CUTT_TYPE?this.SCH_CUTT_TYPE.LVL:''
        , SCH_MENU : 'MyHistory'
        , SCH_CUST_EXPSN_ATTR : JSON.stringify(this.SCH_CUST_ATTR)
        , SCH_CUTT_EXPSN_ATTR : JSON.stringify(this.SCH_CUTT_ATTR),
      }

      let headParam = {
        head : {
          ROW_CNT : this.pagination_phn.rowsPerPage,
          PAGES_CNT : this.pagination_phn.page,
          PAGING : "Y",
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){

        //데이터 가공 영역
        response.DATA.forEach((data, idx) => {
          data.NEW_CUTT_BGNG_DT = this.mixin_convertDate(data.CUTT_BGNG_DT, 'yyyy-MM-dd HH:mm:ss');
          data.NEW_CUTT_END_DT = this.mixin_convertDate(data.CUTT_END_DT, 'yyyy-MM-dd HH:mm:ss');
          data.PHN_HR = (data.PHN_HR?this.mixin_seconds_toHHMMSS(data.PHN_HR):'');
          data.CUST_PHN_NO = this.mixin_setPhoneNo(data.CUST_PHN_NO.replace(/[^0-9]/g, ""));
        });

        let tempDataText = response.DATA;
        let idx = this.PHONE_LOG_HISTORY.length + 1;
        for(let i in tempDataText){
          tempDataText[i]["index"]= idx++;
        }
        this.PHONE_LOG_TOT_CNT = response.HEADER.TOT_COUNT;

        this.PHONE_LOG_HISTORY = [...this.PHONE_LOG_HISTORY, ...tempDataText]
        //다음
        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }
        this.pagination_phn.page += 1;
      }
    },
    //row 선택
    rowSelect(item) {
      this.selectedRow = item;
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

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
      }
    },

    //상담 유형 검색 Data Set
    cuttTypeIntgeSchData(cuttType) {
      cuttType.forEach(item => {
        if (item.UP_CUTT_TYPE_ID) {
          this.CUTT_TYPE_ITEMS.push({ value: item.CUTT_TYPE_ID, text: item.FULL_PATH, LVL: item.LVL });
        }
        if (item.children) {
          this.cuttTypeIntgeSchData(item.children);
        }
      });
    },
    schCuttHistList(next) {
      this.getCuttHistList(next);
    },

    getCuttInfo(){
      this.cuttFormStat = 'D';
      this.CHG_RSN = '';
      this.CL_TYPE_CD = this.selectedRow.CL_TYPE_CD;
      this.FORC_CRT_YN = this.selectedRow.FORC_CRT_YN;
      this.PHN_CUTT_ID = this.selectedRow.PHN_CUTT_ID;

      // let sTimeType = 'HH:mm'+(this.PHN_CUTT_ID && this.FORC_CRT_YN === 'N'?':ss':'');
      let sTimeType = 'HH:mm:ss';

      this.CUTT_BGNG_DT = this.mixin_convertDate(this.selectedRow.CUTT_BGNG_DT, 'yyyy-MM-dd');
      this.CUTT_BGNG_TIME = this.mixin_convertDate(this.selectedRow.CUTT_BGNG_DT, sTimeType);
      this.CUTT_END_DT = this.mixin_convertDate(this.selectedRow.CUTT_END_DT, 'yyyy-MM-dd');
      this.CUTT_END_TIME = this.mixin_convertDate(this.selectedRow.CUTT_END_DT, sTimeType);

      this.SRCH_CUST.CUST_ID = this.selectedRow.CUST_ID;
      this.SRCH_CUST.CUST_NM = this.selectedRow.CUST_NM;
      this.SRCH_CUST.CUST_PHN_NO = this.selectedRow.CUST_PHN_NO;

      this.SRCH_USER.USER_ID = this.selectedRow.CUSL_ID;
      this.SRCH_USER.USER_NM = this.selectedRow.CUSL_NM;

      this.AFTPRCS_HR = this.selectedRow.AFTPRCS_HR;
      this.REC_FILE_NM = this.selectedRow.REC_FILE_NM;
      this.REG_USER_ID = this.selectedRow.RGTR_ID;

      this.getExpsnAttrList(); //확장 속성
      this.mixin_showDialog('AddHistory');
    },

    expsnAttrSchDialog(dialog) {
      this.TMP_SCH_CUST_ATTR = this.SCH_CUST_ATTR;
      this.TMP_SCH_CUTT_ATTR = this.SCH_CUTT_ATTR;
      this.getExpsnAttrList();
      this.dropSchDetail = dialog;
    },

    // 전화 상담 확장속성 조회
    async getExpsnAttrList() {
      let sUrl = '/api/setting/expsnAttr/expsnAttrList';
      let postParam = {
        //SE : 'CONSEL' //상담내용 확장항목
        BSC_PVSN_ATTR_YN : "N" //기본 제공 속성이 아닌것
        , USE_YN : 'Y' //확장속성 사용인 경우만
        , PHN_CUTT_ID : this.selectedRow.PHN_CUTT_ID
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
        }

        let expsnAttrData = [];
        let codeName = ['CALL_TP', 'CHNL', 'CAMP_RS']; //콜 유형과, 채널 공통코드
        this.SCH_CUST_ATTR = [];
        this.SCH_CUTT_ATTR = [];
        for(let i in response.DATA){
          if(response.DATA[i].SE === 'CONSEL'){
            if(response.DATA[i].EXPSN_ATTR_COL_ID === 'CAMP_RS'){ //처리 결과인 경우 캠페인 id가 있을 경우에만 노출 처리
              if(this.CPI_ID) expsnAttrData.push(response.DATA[i]);
            }else{
              expsnAttrData.push(response.DATA[i]);
            }
            
            if(response.DATA[i].SRCH_STNG_YN === 'Y') {
              response.DATA[i].V_ATTR_SCH_MODEL = '';
              this.TMP_SCH_CUTT_ATTR.forEach((tmp, idx) => {
                if(tmp.ATTR_ID === response.DATA[i].ATTR_ID){
                  if(tmp.V_ATTR_SCH_MODEL) response.DATA[i].V_ATTR_SCH_MODEL = tmp.V_ATTR_SCH_MODEL;
                }
              });
              this.SCH_CUTT_ATTR.push(response.DATA[i]);
            }
          }else if(response.DATA[i].SE === 'CUSTOM'){
            if(response.DATA[i].DATA_TYPE_CD === 'COE'){
              if(response.DATA[i].GROUP_CD_ID) codeName.push(response.DATA[i].GROUP_CD_ID); //공통코드사용을 위해 그룹코드가 있는 경우만
            }else if(response.DATA[i].DATA_TYPE_CD === 'COE_MULTI'){
              if(response.DATA[i].GROUP_CD_ID) codeName.push(response.DATA[i].GROUP_CD_ID); //공통코드사용을 위해 그룹코드가 있는 경우만
            }

            if(response.DATA[i].SRCH_STNG_YN === 'Y') {
              response.DATA[i].V_ATTR_SCH_MODEL = '';
              this.TMP_SCH_CUST_ATTR.forEach((tmp, idx) => {
                if(tmp.ATTR_ID === response.DATA[i].ATTR_ID){
                  if(tmp.V_ATTR_SCH_MODEL) response.DATA[i].V_ATTR_SCH_MODEL = tmp.V_ATTR_SCH_MODEL;
                }
              });
              this.SCH_CUST_ATTR.push(response.DATA[i]);
            }
          }
        }

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
            if(expsnAttrData[i].GROUP_CD_ID) codeName.push(expsnAttrData[i].GROUP_CD_ID); //공통코드사용을 위해 그룹코드가 있는 경우만
            else if(expsnAttrData[i].EXPSN_ATTR_COL_ID === 'CUSL_TP_CL'){
              expsnAttrData[i].V_MODEL = [];
              if(expsnAttrData[i].PHN_CUTT_ID){
                if(expsnAttrData[i].ATTR_VL){
                  if(this.CUTT_TYPE_LMT_LVL_CD){
                    for(let k=0; k<this.CUTT_TYPE_LMT_LVL_CD; k++){
                      expsnAttrData[i].V_MODEL[k] = expsnAttrData[i].ATTR_VL.split(',')[k+1];
                    }
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
            codeName.push(expsnAttrData[i].GROUP_CD_ID); //공통코드사용을 위해

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
        }

        //공통코드설정
        this.common_code = await this.mixin_common_code_get_all(codeName);
        this.EXPSN_ATTR = expsnAttrData;
      }
    },
    getChildCuttTypeItems(seq, idx, parentItem) {
      let arrCuttType = [];

      if(idx === 0){
        if(this.CUTT_ITEMS.length > 0){
          parentItem = this.CUTT_ITEMS[0].CUTT_TYPE_ID;
          this.CUTT_ITEMS.map(function(row){
            if(row.UP_CUTT_TYPE_ID === parentItem)
              if(row) arrCuttType.push(row);
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

    displayReserveTime(seq, date) {
      let getDate = this.getReserveTime(seq, date);
      let targetDate = `${ getDate[1] } ${getDate[2]} ${String(getDate[3]).padStart(2, '0')}:${String(getDate[4]).padStart(2, '0')}`;

      return targetDate;
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
    changeCuttTypeItems(seq, idx){
      for(let k=0; k<this.EXPSN_ATTR[seq].V_MODEL.length; k++){
        if(k > idx) this.EXPSN_ATTR[seq].V_MODEL[k] = '';//초기화
      }
    },
    onInputTag(seq){
      this.SELECTED_ATTR_INDEX = seq;
      this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].inputTagSize = this.EXPSN_ATTR[this.SELECTED_ATTR_INDEX].V_MODEL.length;
    },
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

    closeDialog(type){
      switch(type){
        case 'PHN':
          this.selectedRow = {};
          this.mixin_hideDialog('AddHistory');
          break;
        case 'SNS':
          this.SEL_ITEM = {};
          this.mixin_hideDialog('AddSnsHistory');
      }
    },

    //상담내용 저장 validate
    phoneCuttSaveValidate(){
      if(this.selectedRow.CHG_PSBL_YN === 'N'){
        this.showAlert({alertDialogToggle: true, msg: '변경 승인 요청중인 내역이 존재 합니다.<br>변경 승인 후 수정이 가능 합니다.', iconClass: 'is-caution', type: 'default'});
        return;
      }

      if(!this.CUTT_BGNG_DT || !this.CUTT_END_DT){
        this.showAlert({alertDialogToggle: true, msg: '상담시간 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
        return;
      }else{
        let CHG_CUTT_BGNG_DT = this.CUTT_BGNG_DT.replace(/-/gi, '')+this.CUTT_BGNG_TIME.replace(/:/gi, '')+'00'; //상담 시작 일시
        let CHG_CUTT_END_DT = this.CUTT_END_DT.replace(/-/gi, '')+this.CUTT_END_TIME.replace(/:/gi, '')+'00' //상담 종료 일시

        if(this.cuttFormStat === 'C'){
          if(CHG_CUTT_END_DT <= CHG_CUTT_BGNG_DT){
            this.showAlert({alertDialogToggle: true, msg: '상담 종료 시간이 상담 시작 시간 보다 작거나 같을 수 없습니다.', iconClass: 'is-caution', type: 'default'});
            return;
          }
        }else{
          if(CHG_CUTT_END_DT < CHG_CUTT_BGNG_DT){
            this.showAlert({alertDialogToggle: true, msg: '상담 종료 시간이 상담 시작 시간 보다 작을 수 없습니다.', iconClass: 'is-caution', type: 'default'});
            return;
          }
        }
      }

      if(!this.SRCH_CUST.CUST_ID){
        this.showAlert({alertDialogToggle: true, msg: '고객 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
        return;
      }

      if(!this.SRCH_USER.USER_ID){
        this.showAlert({alertDialogToggle: true, msg: '상담직원 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
        return;
      }

      if(!this.AFTPRCS_HR){
        this.showAlert({alertDialogToggle: true, msg: '후처리 시간 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
        return;
      }

      // if(!this.REC_FILE_NM){
      //   this.showAlert({alertDialogToggle: true, msg: '녹취 파일 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
      //   return;
      // }

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

      if(this.selectedRow.CHG_PSBL_YN === 'Y'){
        if(!this.CHG_RSN){
          this.showAlert({alertDialogToggle: true, msg: '변경사유 항목은 필수 입력 항목 입니다.', iconClass: 'is-caution', type: 'default'});
          return;
        }
      }

      this.showAlert(this.MESSAGE.CONFIRM.REG);
    },
    //상담내용 저장
    async phoneCuttSave() {
      let sUrl = '/phone-api/cutt/cuttProc';
      let postParam = {
        PHN_CUTT_ID : this.PHN_CUTT_ID
        , CUTT_BGNG_DT : this.CUTT_BGNG_DT.replace(/-/gi, '')+this.CUTT_BGNG_TIME.replace(/:/gi, '')+(this.PHN_CUTT_ID && this.FORC_CRT_YN === 'N'?'':(this.CUTT_BGNG_TIME.split(':').length > 1?'':'00')) //상담 시작 일시
        , CUTT_END_DT : this.CUTT_END_DT.replace(/-/gi, '')+this.CUTT_END_TIME.replace(/:/gi, '')+(this.PHN_CUTT_ID && this.FORC_CRT_YN === 'N'?'':(this.CUTT_END_TIME.split(':').length > 1?'':'00')) //상담 종료 일시
        , CL_TYPE_CD : this.CL_TYPE_CD //콜 유형(IN, OUT)
        , CUST_ID : this.SRCH_CUST.CUST_ID //고객 ID
        , CUSL_ID : this.SRCH_USER.USER_ID //상담사 ID
        , AFTPRCS_HR : this.AFTPRCS_HR //후처리 시간(초)
        , REC_FILE_NM : this.REC_FILE_NM //녹취 파일명
        , FORC_CRT_YN : (this.PHN_CUTT_ID?'N':'Y') //강제 등록 여부
        , CHG_RSN : this.CHG_RSN
      }

      for(let i in this.EXPSN_ATTR){
        if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'TXT'){ //문자형
          postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL;
          this.EXPSN_ATTR[i].V_POST_PARAM = this.EXPSN_ATTR[i].V_MODEL;
          //this.EXPSN_ATTR[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL;
        }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'NUM' || this.EXPSN_ATTR[i].DATA_TYPE_CD === 'NUM_COMMA'){ //숫자형
          postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL;
          this.EXPSN_ATTR[i].V_POST_PARAM = this.EXPSN_ATTR[i].V_MODEL;
          //this.EXPSN_ATTR[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL;
        }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'COE'){ //단일 선택형
          if(Array.isArray(this.EXPSN_ATTR[i].V_MODEL)){
            let lastVal = '';
            for(let k in this.EXPSN_ATTR[i].V_MODEL){
              if(this.EXPSN_ATTR[i].V_MODEL[k]) lastVal = this.EXPSN_ATTR[i].V_MODEL[k];
            }
            postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = lastVal;
            this.EXPSN_ATTR[i].V_POST_PARAM = lastVal;
            //this.EXPSN_ATTR[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = lastVal;
          }else{
            postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL;
            this.EXPSN_ATTR[i].V_POST_PARAM = this.EXPSN_ATTR[i].V_MODEL;
            //this.EXPSN_ATTR[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL;
          }
        }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'COE_MULTI'){ //다중 선택형
          let multiData = '';
          this.EXPSN_ATTR[i].V_MODEL.forEach((multi, idx) => {
            multiData += (multiData?',':'') + multi.value;
          });

          this.EXPSN_ATTR[i].V_POST_PARAM = multiData;
        }else if(this.EXPSN_ATTR[i].DATA_TYPE_CD === 'DAT'){ //날짜형
          if(this.EXPSN_ATTR[i].V_MODEL){
            postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].dateTimeDate.replace(/-/gi, '') + this.EXPSN_ATTR[i].selectedTime.replace(/:/gi, '')+'00';
            this.EXPSN_ATTR[i].V_POST_PARAM = this.EXPSN_ATTR[i].dateTimeDate.replace(/-/gi, '') + this.EXPSN_ATTR[i].selectedTime.replace(/:/gi, '')+'00';
          }
          //this.EXPSN_ATTR[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL_DATE;
          // postParam[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = this.EXPSN_ATTR[i].V_MODEL?'Y':'N';
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
          //this.EXPSN_ATTR[this.EXPSN_ATTR[i].EXPSN_ATTR_COL_ID] = sHashTxt;
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
        this.mixin_hideDialog('AddHistory');
        this.refreshPhoneCuttForm();
        this.getCuttHistList();

        // this.showAlert(this.MESSAGE.ALERT.SUCCESS);
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
      }
    },

    refreshPhoneCuttForm(){
      this.PHN_CUTT_ID = '';
      this.CUTT_BGNG_DT = ''; //상담 시작 일시
      this.CUTT_BGNG_TIME = ''; //상담 시작 일시
      this.CUTT_END_DT = ''; //상담 종료 일시
      this.CUTT_END_TIME = ''; //상담 종료 일시
      this.SRCH_CUST = []; //고객 정보
      this.CL_TYPE_CD = 'IN'; //인바운드 고정
      this.CHNL = 'TEL';//채널 전화 고정
      this.SRCH_USER = []; //상담사 정보
      this.AFTPRCS_HR = ''; //후처리 시간(초)
      this.REC_FILE_NM = ''; //녹취파일명
      this.REG_USER_ID = '';
      this.CHG_RSN = '';
      this.FORC_CRT_YN = 'N';

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

      this.closeMsg();
    },
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    //녹취파일 듣기
    showRecDialog(item) {

      this.REC_TEMP_DATA={};
      this.REC_TEMP_DATA = item;

      this.mixin_showDialog('ListenVoice');

    },

    /*      나의 SNS 상담이력     */

    selectSender() {
      this.$api.post("/chat-api/main/getSender/inqire",   //api url입력
          {
          },
          {head: {
            }})
          .then((response) => {
            if(response.data.DATA.length > 0){
              this.DROP_SNDR = response.data.DATA;
              this.SNDR_KEY = this.DROP_SNDR[0].SNDR_KEY;
              this.CHN_CLSF_CD = this.DROP_SNDR[0].CHN_CLSF_CD;

              this.DROP_SRCH_SNDR = response.data.DATA;
              this.DROP_SRCH_SNDR.unshift(
                  {
                    SNDR_KEY:'',
                    DSPTCH_PRF_NM:'전체',
                    SNDR_KEY:'',
                  }
              )
            }
          })
          .catch((err) => {
            alert(err);
          })
    },
    sndrSel(type){
      let leng = this.DROP_SRCH_SNDR.length
      for(let i=0;i<leng;i++){
        if(type == 'srch'){
          if(this.DROP_SRCH_SNDR[i].SNDR_KEY == this.SRCH_SNDR){
            this.SRCH_CHN_CLSF_CD = this.DROP_SRCH_SNDR[i].CHN_CLSF_CD
          }
        } else if(type == 'reg'){
          // console.log("here", this.DROP_SNDR);
          if(this.DROP_SNDR[i].SNDR_KEY == this.SNDR_KEY){
            this.CHN_CLSF_CD = this.DROP_SNDR[i].CHN_CLSF_CD
          }
        }
      }
    },
    rowSelectSNS(item) {
      this.SEL_ITEM = item;

      this.SEL_CHT_CUTT_ID = item.CHT_CUTT_ID;
      this.SNDR_KEY = item.SNDR_KEY;
      this.CHN_CLSF_CD = item.CHN_CLSF_CD;
      this.CUTT_TYPE_ID = item.CUTT_TYPE_ID;
      this.SRCH_USER = {
        USER_ID: item.CUSL_ID,
        USER_NM: item.CUSL_NM
      };
      this.SRCH_CUST = {
        CUST_ID: item.CUST_ID,
        CUST_NM: item.CUST_NM
      };
      this.startDateTime = this.mixin_convertDate(item.CUTT_BGNG_DT, 'yyyy-MM-dd');
      this.startDatetimeStep =
          item.CUTT_BGNG_DT.slice(-6,(item.CUTT_BGNG_DT.length - 2)).slice(0,2) + ':' + item.CUTT_BGNG_DT.slice(-6,(item.CUTT_BGNG_DT.length - 2)).slice(-2);
      this.endDateTime = this.mixin_convertDate(item.CUTT_END_DT, 'yyyy-MM-dd');
      this.endDatetimeStep =
          item.CUTT_END_DT.slice(-6,(item.CUTT_END_DT.length - 2)).slice(0,2) + ':' + item.CUTT_END_DT.slice(-6,(item.CUTT_END_DT.length - 2)).slice(-2);
      this.CUTT_STTS_CD = item.CUTT_STTS_CD;
      this.CUTT_CN = item.CUTT_CN;

      if(this.CUTT_TYPE_ID){
        this.selCuttTypeSrch();
      } else {
        this.cuttTypeSrch();
        this.CUTT_TYPE_ID='';          //선택 상담유형
      }
    },
    isActiveRowSNS(item) {
      const activeClass = item === this.SEL_ITEM ? "active" : "";
      return activeClass;
    },
    async selCuttTypeSrch(){
      let sUrl = '/chat-api/main/selCuttTypeSrch';
      let postParam = {
        CUTT_TYPE_ID:this.CUTT_TYPE_ID,
        CUTT_TYPE_LMT_LVL_CD: this.CUTT_TYPE_LMT_LVL_CD,
      }
      let headParam = {
        head : {
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);
      if (!resData.HEADER.ERROR_FLAG){
        //json형태로 선택한 상담유형과 상위 상담유형정보를 가져옴
        let selCuttTypeObj = resData.DATA[0];
        let selCuttTypeLeng = Object.keys(selCuttTypeObj).length;

        //json형태의 상담유형정보를 array로 만들어줌
        let selCuttTypeArr = [];
        //마지막 데이터는 고객사 기본데이터이기 때문에 불필요
        for(let i=0;i<selCuttTypeLeng;i++){
          selCuttTypeArr[i] = selCuttTypeObj[i];
        }
        selCuttTypeArr.reverse();

        //상담유형정보 세팅
        let leng = selCuttTypeArr.length
        for(let n=0;n<leng;n++){
          this.CUTT_TYPE_VMODEL_ARR[n] = selCuttTypeArr[n];
          this.changeCuttTypeItems(n)
        }
      }
    },

    //나의 채팅 상담이력 조회
    async chtHstrySrch(next){
      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.SNS_LOG_HISTORY = [];
        this.pagination_cht.page = 1; //페이징 처리 초기화
        this.nextDisabled2 = true;  //버튼 비활성화
        this.initCutt();          //선택상담 초기화
      }
      if(this.tab =='1'){
        await this.getChartInfo();
      }

      let convertSchKeyword = this.USER_SRCH;
      if(this.USER_SRCH_TY === 'CUST_PHN_NO') convertSchKeyword = convertSchKeyword.replace(/[^0-9]/g, '');

      let sUrl = '/chat-api/history/manage/list';
      let postParam = {
        SRCH_TY: this.SRCH_TY,
        ST_DT: this.START_DATE_CHT.replaceAll("-","")+'000000',
        END_DT: this.END_DATE_CHT.replaceAll("-","")+'999999',//끝날짜 999999가 붙지 않으면 당일 00시00분00초이므로 전날까지 조회됨
        CHN_CLSF_CD: this.SRCH_CHN_CLSF_CD,
        CUTT_STTS_CD: this.SRCH_CUTT_STTS_CD,
        SNDR_KEY: this.SRCH_SNDR,
        SCH_MENU : 'MyHistory',
        USER_SRCH_TY: this.USER_SRCH_TY,
        USER_SRCH: convertSchKeyword,
        // SCH_CUST_NM : this.SCH_KEYWORD_CHT,
      }
      let headParam = {
        head: {
          "ROW_CNT" : this.pagination_cht.rowsPerPage,
          "PAGES_CNT" : this.pagination_cht.page,
          "PAGING" : "Y",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        for(let k in resData.DATA){
          resData.DATA[k].NEW_ALTMNT_RDY_REG_DT = this.mixin_convertDate(resData.DATA[k].ALTMNT_RDY_REG_DT, 'yyyy-MM-dd HH:mm:ss');
          resData.DATA[k].NEW_CUTT_BGNG_DT = this.mixin_convertDate(resData.DATA[k].CUTT_BGNG_DT, 'yyyy-MM-dd HH:mm:ss');
          resData.DATA[k].NEW_CUTT_END_DT = this.mixin_convertDate(resData.DATA[k].CUTT_END_DT, 'yyyy-MM-dd HH:mm:ss');
          resData.DATA[k].NEW_CUTT_HSTRY_REG_DT = this.mixin_convertDate(resData.DATA[k].CUTT_HSTRY_REG_DT, 'yyyy-MM-dd HH:mm:ss');
        }

        let tempDataText = resData.DATA;

        this.SNS_LOG_TOT_CNT = resData.HEADER.TOT_COUNT;
        //this.items = tempDataText;
        this.SNS_LOG_HISTORY = [...this.SNS_LOG_HISTORY, ...tempDataText]
        //다음
        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 resData.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(resData.HEADER.next !== null && resData.HEADER.next !== undefined){
          if(resData.HEADER.next === true){
            this.nextDisabled2 = false //버튼 활성화
          }else{
            this.nextDisabled2 = true  //버튼 비활성화
          }
        }
        //이부분은 체크해볼것
        this.pagination_cht.page += 1
        // this.page=1;
      }
    },
    async cuttTypeSrch() {
      let sUrl = '/api/setting/cuttType/cuttTypeTreeList';
      let postParam = {
      }

      let headParam = {
        head : {
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);
      if (!resData.HEADER.ERROR_FLAG){
        //상담유형 정보
        if(resData.CUTT_TYPE_SETTING){
          this.ITGRT_USE_YN = resData.CUTT_TYPE_SETTING[0].ITGRT_USE_YN;
          this.CUTT_TYPE_LMT_LVL_CD = resData.CUTT_TYPE_SETTING[0].CUTT_TYPE_LMT_LVL_CD;
        }

        this.CUTT_ITEMS = resData.DATA;

        for(let i=0;i<parseInt(this.CUTT_TYPE_LMT_LVL_CD);i++){
          this.CUTT_TYPE_VMODEL_ARR[i] = '';//초기화
        }
      }
    },

    initCutt(){
      this.cuttTypeSrch();
      this.CUTT_TYPE_ID='';          //선택 상담유형
      this.startDateTime =  (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
      this.startDatetimeStep =  '00:00';
      this.endDateTime =  (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
      this.endDatetimeStep =  '00:00';
      this.CUTT_STTS_CD = 'CMPL';      //처리결과
      this.CUTT_CN = '';               //채팅내용

      this.SRCH_USER ={
        USER_NM:'',
        USER_ID:''
      };
      this.SRCH_CUST ={
        CUST_ID:'',
        CUST_NM:'',
      };
      this.SEL_CHT_CUTT_ID = '';       //선택 채팅ID
      this.SEL_ITEM = [];
    },
    changeCuttTypeSnsItems(idx){
      this.CUTT_TYPE_ID = this.CUTT_TYPE_VMODEL_ARR[idx];
      for(let k=0; k<this.CUTT_TYPE_VMODEL_ARR.length; k++){
        if(k > idx) this.CUTT_TYPE_VMODEL_ARR[k] = '';//초기화
      }
    },

    //상담유형 하위 item 가져오기
    getChildCuttTypeSnsItems(idx, parentItem) {
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


    // 채팅 상담이력 저장
    async cuttStrg() {
      if (!this.validate()) {
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }

      let sUrl = '/chat-api/main/cnslt-hist/regist-force';
      let postParam = {
        CHT_CUTT_ID:this.SEL_CHT_CUTT_ID,
        SNDR_KEY:this.SNDR_KEY,
        CHN_CLSF_CD:this.CHN_CLSF_CD,
        CUTT_TYPE_ID:this.CUTT_TYPE_ID,
        ST_DT:(this.startDateTime + this.startDatetimeStep + '00').replaceAll("-","").replaceAll(":","").replaceAll(" ",""),
        END_DT:(this.endDateTime + this.endDatetimeStep + '00').replaceAll("-","").replaceAll(":","").replaceAll(" ",""),
        CUTT_STTS_CD:this.CUTT_STTS_CD,
        CUTT_CN:this.CUTT_CN,
        CUSL_ID:this.SRCH_USER.USER_ID,
        CUST_ID:this.SRCH_CUST.CUST_ID,
      }
      let headParam = {
        head : {
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);
      if (!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        this.mixin_hideDialog('AddSnsHistory');
        if(this.SEL_CHT_CUTT_ID == ''){
          // this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS);
          this.showToast(this.MESSAGE.TOAST.REG_SUCCESS);
          this.closeMsg();
        } else {
          // this.showAlert(this.MESSAGE.ALERT.MDFCN_SUCCESS);
          this.showToast(this.MESSAGE.TOAST.MDFCN_SUCCESS);
          this.closeMsg();
        }
        this.initCutt();
        this.chtHstrySrch('');
      }
    },
    validate () {
      return this.$refs.form.validate();
    },

    //채팅 내역 조회
    async chatHstSrch(item){
      let sUrl = '/chat-api/main/cnslt-cn/inqire';
      let postParam = {
        CHT_CUTT_ID: item.CHT_CUTT_ID,
        CUST_ID: item.CUST_ID,
        CUTT_STTS_CD: 'CMPL',
        CHT_RDY_ID: '',
        CHT_USER_KEY : item.CHT_USER_KEY,
        SNDR_KEY : this.SNDR_KEY,
        CHN_CLSF_CD : this.CHN_CLSF_CD,
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
          let chatDate = this.mixin_convertDate(resData.data[i]["REG_DT"], 'yyyy-MM-dd HH:mm:ss')
          if(this.SHOW_QSTN == 'Y'){
            if(resData.data[i]["MSG_TYPE_CD"] != 'EMAIL' && resData.data[i]["MSG_TYPE_CD"] != 'BBS'){
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
            } else if(resData.data[i]["MSG_TYPE_CD"] == 'BBS') {
              this.CHAT_LOG.push(resData.data[i]);
              this.CHAT_LOG[i]["TYPE"]= resData.data[i]["MSG_TYPE_CD"]
            }
          } else {
            if(resData.data[i]["MSG_TYPE_CD"] != 'QSTN'){
              if(resData.data[i]["MSG_TYPE_CD"] != 'EMAIL' && resData.data[i]["MSG_TYPE_CD"] != 'BBS'){
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
              } else if(resData.data[i]["MSG_TYPE_CD"] == 'EMAIL') {
                this.changeEmailCuttMode(resData.data[i]);
              } else if(resData.data[i]["MSG_TYPE_CD"] == 'BBS') {
                this.CHAT_LOG.push(resData.data[i]);
                this.CHAT_LOG[i]["TYPE"]= resData.data[i]["MSG_TYPE_CD"]
              }
            }
          }
        }
      }
    },

/*        우측 차트 영역        */
    async getChartInfo(){

      // console.log("this.tab in getChartInfo",this.tab)
      let sUrl = '/phone-api/history/getMyCuttHistCnt';
      let postParam = {
        SCH_CUTT_ST_DTS : this.tab =='0'? this.START_DATE_PHN.replace(/-/gi, '') : this.START_DATE_CHT.replaceAll("-","")
        , SCH_CUTT_END_DTS : this.tab =='0'? this.END_DATE_PHN.replace(/-/gi, '') : this.END_DATE_CHT.replaceAll("-","")
      };
      let headParam={
        head:{},
      };

      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(response.HEADER.ERROR_FLAG){
        this.DonughtData.datasets[0].noData = true;
        this.BarData.datasets[0].noData = true;
      }else{
            // console.log("REsponse", response.DATA[0]);
            let tempData = response.DATA[0];

            // 차트 초기화
            this.chartInit();

            if(tempData.PHN_TOT_CNT == 0){
              this.DonughtData.datasets[0].noData = true;
            }else{
              this.DonughtData.datasets[0].noData = false;
              this.DonughtData.datasets[0].data.push(tempData.PHN_PRCS_CNT);
              this.DonughtData.datasets[0].data.push(tempData.PHN_CMPL_CNT);

              this.MONITOR.PHONE_TYPE.total = tempData.PHN_TOT_CNT;
              this.MONITOR.PHONE_TYPE.done = tempData.PHN_CMPL_CNT;

              let tempNum = 0;
              if(tempData.PHN_CMPL_RATE == '100.00'){
                tempNum = tempData.PHN_CMPL_RATE.split('.', 1)
                this.MONITOR.PHONE_TYPE.per = tempNum;
              }else{
                this.MONITOR.PHONE_TYPE.per = tempData.PHN_CMPL_RATE;
              }
            }
            if(tempData.CHT_TOT_CNT == 0){
              this.BarData.datasets[0].noData = true;
            }else{
              this.BarData.datasets[0].noData = false;
              this.BarData.datasets[0].data.push(tempData.CHT_WAIT_CNT);
              this.BarData.datasets[0].data.push(tempData.CHT_ING_CNT);
              this.BarData.datasets[0].data.push(tempData.CHT_CMPL_CNT);
              this.BarData.datasets[0].data.push(tempData.CHT_AFTPRCS_CNT);
              this.BarData.datasets[0].data.push(tempData.CHT_ETC_CNT);

              this.MONITOR.SNS_TYPE.wait = tempData.CHT_WAIT_CNT;
              this.MONITOR.SNS_TYPE.wait_per = tempData.CHT_WAIT_RATE;
              this.MONITOR.SNS_TYPE.cs = tempData.CHT_ING_CNT;
              this.MONITOR.SNS_TYPE.cs_per = tempData.CHT_ING_RATE;
              this.MONITOR.SNS_TYPE.done = tempData.CHT_CMPL_CNT;
              this.MONITOR.SNS_TYPE.done_per = tempData.CHT_CMPL_RATE;
              this.MONITOR.SNS_TYPE.after = tempData.CHT_AFTPRCS_CNT;
              this.MONITOR.SNS_TYPE.after_per = tempData.CHT_AFTPRCS_RATE;
              this.MONITOR.SNS_TYPE.etc = tempData.CHT_ETC_CNT;
              this.MONITOR.SNS_TYPE.etc_per = tempData.CHT_ETC_RATE;
            }

          }

    },
    chartInit(){
      this.DonughtData.datasets[0].data = [];
      this.BarData.datasets[0].data = [];

      this.MONITOR.PHONE_TYPE.total = 0;
      this.MONITOR.PHONE_TYPE.done = 0;
      this.MONITOR.PHONE_TYPE.per = 0;


      this.MONITOR.SNS_TYPE.wait = 0;
      this.MONITOR.SNS_TYPE.wait_per = 0;
      this.MONITOR.SNS_TYPE.cs = 0;
      this.MONITOR.SNS_TYPE.cs_per = 0;
      this.MONITOR.SNS_TYPE.done = 0;
      this.MONITOR.SNS_TYPE.done_per = 0;
      this.MONITOR.SNS_TYPE.after = 0;
      this.MONITOR.SNS_TYPE.after_per = 0;
      this.MONITOR.SNS_TYPE.etc = 0;
      this.MONITOR.SNS_TYPE.etc_per = 0;

    }



  },
}
</script>

<style lang="scss" scoped>

</style>