<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                템플릿 검수 상태
              </span>
              <div class="pl-desc">
                <v-select
                  v-model="PARAM_TMPL_IGI_STTS"
                  class="pl-form"
                  :items="CODE_TMPL_IGI_STTS"
                  placeholder="선택하세요"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                템플릿 메시지 타입
              </span>
              <div class="pl-desc">
                <v-select
                  v-model="PARAM_TMPL_MSG_TYPE"
                  class="pl-form"
                  :items="CODE_TMPL_MSG_TYPE"
                  placeholder="선택하세요"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                템플릿 명
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="PARAM_TMPL_NM"
                  class="pl-form is-lg"
                  placeholder="검색어 입력"
                />
              </div>
            </div>
            <v-btn
              class="pl-btn is-icon"
              @click="searchAtalkTmpl"
              :loading="TMPL_STTS_LOADING"
            >
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
            <!-- <v-btn
              class="pl-btn is-icon"
              @click="searchAtalkTmpl"
              :disabled="TMPL_STTS_LOADING"
            >
              <span v-if="!TMPL_STTS_LOADING" class="pl-icon20 search"></span>
              <span v-if="!TMPL_STTS_LOADING">조회</span>
              <div v-if="TMPL_STTS_LOADING" class="pl-chart-loading">
                <span class="pl-chart-loader" style="width: 20px; height: 20px;"></span>
              </div>
            </v-btn> -->

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols flex-grow-1">
        <!-- left -->
        <div class="is-col-fix is-vrt" style="width: 560px">
          <div class="pl-card">
            <h2 class="pl-subtit">발신 프로필
              <!-- 툴팁 버튼 -->
              <compo-tooltip-btn
                TitleProp="템플릿을 조회할 발신 프로필을 목록에서 선택하십시오.<br>(템플릿 조회 시 카카오와 실시간 연계를 통한 조회로<br>조회시간이 소요될 수 있습니다.)"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 question"
                TooltipPositionProp="bottom"
              ></compo-tooltip-btn>
              <span class="pl-counter ml-2">전체 <em class="pl-1">({{ SEND_PROFILE_KEY_LIST.length }})</em> 건</span>
              <div class="is-right">
                <compo-tooltip-btn
                  TitleProp="새로고침"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="bottom"
                  @btnClick="selectSendProfileKeys()">
                </compo-tooltip-btn>
              </div>
            </h2>
          </div>
          <!-- template list -->
          <div class="pl-card is-noborder pt-0" style="overflow-y: auto; height: 636px">
            <div class="pl-sms-template-list">
              <div
                v-for="(item, index) in SEND_PROFILE_KEY_LIST"
                class="pl-sms-template-list-unit"
                :key="item.id"
                @click="clickAtalkTmplList(item.SEND_PROFILE_KEY)"
                >
                <div class="pl-sms-template-list-desc" :style="index === 0 ? 'margin-top: 0' : ''">
                  <div>
                    <div class="pl-sms-template-list-title">
                      채널 분류 : <strong>{{ item.CHN_CLSF_NM }}</strong>
                    </div>
                    <div class="pl-sms-template-list-title">
                      UUID : <strong>{{ item.UUID }}</strong>
                    </div>
                    <div class="pl-sms-template-list-title">
                      발신 프로필 명 : <strong>{{ item.SEND_PROFILE_NM }}</strong>
                    </div>
                    <div class="pl-sms-template-list-title">
                      발신 프로필 키 : <strong>{{ item.SEND_PROFILE_KEY }}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- right -->
        <div class="is-vrt" >
          <div class="pl-card">
            <div class="pl-grid-top">
              <div class="pl-grid-top-left">
                <v-btn class="pl-btn is-icon is-sub"
                :disabled="!SELECT_GRID_ROW_ITEM.ATALK_ID?true:false"
                @click="openDetailAtalkTmpl">
                  <span class="pl-icon20 document"></span>
                  선택항목 상세
                </v-btn>
                <v-btn class="pl-btn is-icon is-sub"
                @click="openNewRegAtalkTmpl">
                  <span class="pl-icon20 circle-plus"></span>
                  등록
                </v-btn>
                <v-btn class="pl-btn is-icon is-sub"
                @click="deleteAtalkTmplValidation"
                :disabled="IS_DEL"
                >
                  <span class="pl-icon20 trash"></span>
                  삭제
                </v-btn>
                <!-- <v-select
                  class="pl-form is-lg"
                  :items="dropItemsG01"
                  placeholder="선택하세요"
                ></v-select> -->
                <!-- 버튼 -->
                <v-btn class="pl-btn is-sub" @click="mtsRegisterValidation" :disabled="IS_MTS_REG" >템플릿 등록</v-btn>
                <v-btn class="pl-btn is-sub" @click="mtsRequestValidation" :disabled="IS_MTS_REQ">검수요청</v-btn>
                <v-btn class="pl-btn is-sub" @click="mtsCancelRequestValidation" :disabled="IS_MTS_REQ_CAN">검수요청 취소</v-btn>
                <v-btn class="pl-btn is-sub" @click="mtsCancelApprovalValidation" :disabled="IS_MTS_APR_CAN">승인 취소</v-btn>
                <v-btn class="pl-btn is-sub" @click="mtsStopValidation" :disabled="IS_MTS_STP">중지 요청</v-btn>
                <v-btn class="pl-btn is-sub" @click="mtsReuseValidation" :disabled="IS_MTS_STP_CAN">중지해제 요청</v-btn>
                <v-btn class="pl-btn is-sub" @click="mtsReleaseValidation" :disabled="IS_MTS_DMT_CAN"> 휴면해제 요청</v-btn>
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter">전체 <em class="pl-1">({{ GRID_DATA.length }})</em> 건</span>
              </div>
            </div>
            <v-data-table
              class="pl-grid has-control is-hover"
              show-select
              :headers="GRID_HEADER"
              :items="GRID_DATA"
              fixed-header
              item-key="ATALK_ID"
              height="562px"
              :items-per-page="ROW_PER_PAGE"
              :item-class="isActiveRow"
              hide-default-footer
              :page.sync="page"
              no-data-text="등록된 데이터가 없습니다."
              v-model="ATALK_LIST"
              @page-count="pageCount = $event"
              @click:row="gridRowselected"
              @dblclick:row="gridDbClick"
            >
              <!-- 템플릿 상태 -->
              <template v-slot:item.TMPL_STTS_NM="{ item }">
                <div v-if="item.TMPL_STTS_NM">
                  {{ item.TMPL_STTS_NM }}
                </div>
                <div v-else class="pl-chart-loading">
                  <span class="pl-chart-loader" style="width: 20px; height: 20px;"></span>
                </div>
              </template>
              <!-- 검수상태 -->
              <template v-slot:item.TMPL_IGI_NM="{ item }">
                <v-tooltip v-if="item.RJCT_RSN" content-class="pl-tooltip " bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">{{ item.TMPL_IGI_NM }}</span>
                  </template>
                  <div style="width: 500px;">{{ item.RJCT_RSN }}</div>
                </v-tooltip>
                <div v-else-if="item.TMPL_IGI_NM">
                  {{ item.TMPL_IGI_NM }}
                </div>
                <div v-else class="pl-chart-loading">
                  <span class="pl-chart-loader" style="width: 20px; height: 20px;"></span>
                </div>
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
                :total-visible="7">
              </v-pagination>

              <span class="pl-pager-period">
                보기 {{ mixin_getPagePeriod(GRID_DATA, page) }} / {{ GRID_DATA.length }}
                  <compo-tooltip-btn
                    TitleProp="다음 검색"
                    ClassProp="pl-tooltip-btn is-line"
                    IconProp="pl-icon20 arrow-next-paging"
                    TooltipPositionProp="bottom"
                    :DisabledProp = "nextDisabled || TMPL_STTS_LOADING"
                    @btnClick="selectAtalkTmplList('next')"
                  ></compo-tooltip-btn>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
    <!-- dialog -->
    <v-dialog
      v-model="dialogRegTalk"
      content-class="dialog-draggable is-nopadding is-lg is-maxHeight"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :header-title="SEND_PROFILE_KEY==''?'알림톡 템플릿 등록':'알림톡 템플릿 상세 정보'"
        @hide="closeTmplDialog"
      >
        <template slot="body">
          <div class="pl-cols">
            <!-- left -->
            <div class="is-vrt is-col-fix " style="width: 320px">
              <div class="pl-card">
                <div class="pl-form-inline-wrap vertical type-2 ">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      발신 프로필
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-select
                        v-model="SELECTED_SEND_PROFILE_KEY"
                        class="pl-form flex-grow-1"
                        :items="SEND_PROFILE_KEY_LIST"
                        item-text="SEND_PROFILE_NM"
                        item-value="SELECTBOX_VALUE"
                        @change="setSendProfileKey"
                        :disabled="!isRegMode?true:false"
                        placeholder="선택하세요"
                      ></v-select>
                      <p class="pl-form-hint">카카오에서 발급받은 발신 프로필키를 선택하십시오.</p>
                      <v-text-field
                        class="pl-form"
                        placeholder="발신 프로필 키"
                        v-model="SEND_PROFILE_KEY"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="pl-card">
                <div class="pl-form-inline-wrap vertical type-2 ">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      템플릿 코드
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                      class="pl-form flex-grow-1"
                      placeholder="템플릿 코드 입력"
                      v-model="TMPL_CD"
                      :disabled="!isRegMode?true:false"
                      v-byte-counter="40"
                      />
                      <p class="pl-form-hint">영문 30Byte 까지 입력 할 수 있습니다.</p>
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      템플릿 명
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                      class="pl-form flex-grow-1"
                      placeholder="템플릿 명 입력"
                      v-model="TMPL_NM"
                      :disabled="!isRegMode?true:false"
                      v-byte-counter="200"
                      />
                      <p class="pl-form-hint">한글 또는 영문 200Byte 까지 입력 할 수 있습니다.</p>
                    </div>
                  </div>

                </div>
              </div>
              <div class="pl-card">
                <div class="pl-form-inline-wrap vertical type-2 ">
                  <!-- 메시지 유형 -->
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      메시지 유형
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-select
                        v-model="TMPL_MSG_TYPE"
                        class="pl-form flex-grow-1"
                        :items="CODE_LIST_TMPL_MSG_TYPE"
                        placeholder="선택하세요"
                        @change="ChgType('MSG_TYPE')"
                      ></v-select>
                      <p class="pl-form-hint">고객에게 전달할 메시지 유형을 선택할 수 있습니다.<br>선택한 유형에 따라 우측 입력 영역에 자동 표시됩니다.</p>
                    </div>
                  </div>
                  <!-- 강조 유형 -->
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      강조 유형
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-select
                        v-model="TMPL_EPSZ_TYPE"
                        class="pl-form flex-grow-1"
                        :items="CODE_LIST_TMPL_EPSZ_TYPE"
                        placeholder="선택하세요"
                        @change="ChgType('EM_TYPE')"
                      ></v-select>
                      <p class="pl-form-hint">알림톡 메시지 본문 내용위에 이미지 추가, 강조가 필요한 내용을 말풍선 상단 영역에 강조하여 표현 하거나 목록화 하여 전달할 수 있습니다.</p>
                    </div>
                  </div>

                </div>
              </div>
              <div class="pl-card">
                <div class="pl-form-inline-wrap vertical type-2 ">
                  <!-- 알림톡(템플릿) 제작가이드 안내 -->
                  <div class="pl-form-inline">
                    <div class="pl-desc">
                      <p class="pl-form-hint">
                        조금 더 자세한 템플릿 등록 가이드를 원하신다면 <br>
                        <a
                          href="https://kakaobusiness.gitbook.io/main/ad/bizmessage/notice-friend/content-guide"
                          target="_blank"
                        >
                          https://kakaobusiness.gitbook.io/main/ad/bizmessage/notice-friend/content-guide
                        </a> <br>
                        에서 확인하실 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <!-- center -->
            <div class="is-vrt pl-card" style="overflow-y: auto; height: calc(100vh - 181px);">
              <!-- 메시지 유형 : 기본형 -->
              <div v-if="TMPL_MSG_TYPE === 'BA'">
                <h2 class="pl-subtit">메시지 유형(기본형)</h2>
                <div class="pl-subdesc">
                  <p>고객에게 반드시 전달되어야 하는 메시지가 필요한 경우 사용할 수 있습니다.</p>
                </div>
                <div class="pl-form-inline-wrap vertical type-2 ">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      알림톡 템플릿 내용
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-textarea
                        class="pl-form is-noresize"
                        height="250px"
                        placeholder="고객에게 전달할 알림톡 내용을 입력하십시오.(최대 1000자)"
                        v-model="TMPL_CN"
                        :spellcheck="false"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- 메시지 유형 : 부가정보형 -->
              <div v-if="TMPL_MSG_TYPE === 'EX'">
                <h2 class="pl-subtit">메시지 유형(부가 정보형)</h2>
                <div class="pl-subdesc">
                  <p>고객에게 고정적인 부가 정보에 대한 안내가 필요한 경우 사용할 수 있습니다.</p>
                </div>
                <div class="pl-form-inline-wrap vertical type-2 ">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      알림톡 템플릿 내용
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-textarea
                        class="pl-form is-noresize"
                        height="250px"
                        placeholder="고객에게 전달할 알림톡 내용을 입력하십시오.(최대 1000자)"
                        v-model="TMPL_CN"
                        :spellcheck="false"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      부가 정보 내용
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-textarea
                        class="pl-form is-noresize"
                        placeholder="부가 정보 내용을 입력하십시오.(최대 500자, 본문 합쳐 1000자)"
                        v-model="TMPL_EXTRA"
                        :spellcheck="false"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- 메시지 유형 : 채널 추가형 -->
              <div v-if="TMPL_MSG_TYPE === 'AD'">
                <h2 class="pl-subtit">메시지 유형(채널추가형)</h2>
                <div class="pl-subdesc">
                  <p>비광고성 메시지 하단에 카카오톡 채널 추가가 포함 된 경우 사용할 수 있습니다.</p>
                </div>
                <div class="pl-form-inline-wrap vertical type-2 ">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      알림톡 템플릿 내용
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-textarea
                        class="pl-form is-noresize"
                        height="250px"
                        placeholder="고객에게 전달할 알림톡 내용을 입력하십시오.(최대 1000자)"
                        v-model="TMPL_CN"
                        :spellcheck="false"
                      />
                    </div>
                  </div>
                  <!-- <div class="pl-form-inline">
                    <span class="pl-label">
                      채널 추가 메시지 내용
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-textarea
                        class="pl-form is-noresize"
                        placeholder="채널 추가 메시지 내용을 입력하십시오."
                        v-model="TMPL_CHNEL"
                        :spellcheck="false"
                      />
                    </div>
                  </div> -->
                </div>
              </div>
              <!-- 메시지 유형 : 복합형 -->
              <div v-if="TMPL_MSG_TYPE === 'MI'">
                <h2 class="pl-subtit">메시지 유형(복합형)</h2>
                <div class="pl-subdesc">
                  <p>비광고성 메시지 하단에 카카오톡 채널 추가가 포함 된 경우 사용할 수 있습니다.</p>
                </div>
                <div class="pl-form-inline-wrap vertical type-2 ">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      알림톡 템플릿 내용
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-textarea
                        class="pl-form is-noresize"
                        height="250px"
                        placeholder="고객에게 전달할 알림톡 내용을 입력하십시오.(최대 1000자)"
                        v-model="TMPL_CN"
                        :spellcheck="false"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      부가 정보 내용
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-textarea
                        class="pl-form is-noresize"
                        placeholder="부가 정보 내용을 입력하십시오.(최대 500자, 본문 합쳐 1000자)"
                        v-model="TMPL_EXTRA"
                        :spellcheck="false"
                      />
                    </div>
                  </div>
                  <!-- <div class="pl-form-inline">
                    <span class="pl-label">
                      채널 추가 메시지 내용
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-textarea
                        class="pl-form is-noresize"
                        placeholder="채널 추가 메시지 내용을 입력하십시오."
                        v-model="TMPL_CHNEL"
                        :spellcheck="false"
                      />
                    </div>
                  </div> -->
                </div>
              </div>

              <!-- 강조 유형 : 선택안함 -->
              <div v-if="TMPL_EPSZ_TYPE === 'NONE'">
                <h2 class="pl-subtit is-mt-l">강조 유형(선택 안함)</h2>
              </div>
              <!-- 강조 유형 : 이미지형 -->
              <div v-if="TMPL_EPSZ_TYPE === 'IMAGE'">
                <h2 class="pl-subtit is-mt-l">강조 유형(이미지형)</h2>
                <div class="pl-subdesc">
                  <p>메시지가 포맷화 된 정보성 메시지를 안내하기 위한 용도로 이미지형 알림톡을 사용할 수 있습니다.</p>
                </div>
                <!-- 첨부파일 -->
                <compo-file-grid
                  TitleProp="이미지 파일"
                  RequiredProp
                  :HeadersProp="FILE_LIST_HEADER"
                  :FilesProp="IMAGE_FILE_LIST"
                  @addFile="clickAddImageFiles"
                  :DelData="DEL_IMAGE_FILE"
                  @input="DEL_IMAGE_FILE = $event"
                  @removeFile="removeImageFile()"
                >
                  <template slot="infotext">
                    <ul class="pl-list-info">
                      <li>1. 이미지는 고정 이미지 1개, 용량 500KB 까지만 등록 가능합니다.<br>
                          2. 이미지는 png, jpg만 등록 가능합니다.<br>
                          3. 이미지의 사이즈는 가로 500px, 세로 250px 이상(비율 2:1)만 등록 가능합니다.(권장 사이즈 800px*400px)
                      </li>
                    </ul>
                  </template>
                </compo-file-grid>
                <input ref="imageFileUpload" type="file" multiple @change="handleImageFileUpload" style="display: none" />

              </div>
              <!-- 강조 유형 : 강조표기형 -->
              <div v-if="TMPL_EPSZ_TYPE === 'TEXT'">
                <h2 class="pl-subtit is-mt-l">강조 유형(강조표기형)</h2>
                <div class="pl-subdesc">
                  <p>알림톡 내용에서 강조가 필요한 내용을 말풍선 상단 영역에 강조하여 표현할 수 있습니다.</p>
                </div>
                <div class="pl-form-inline-wrap vertical type-2 ">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      Title(강조 제목)
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form"
                        placeholder="강조 제목 입력"
                        v-model="TMPL_TITLE"
                      ></v-text-field>
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      Subtitle(보조 제목)
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form"
                        placeholder="보조 제목 입력"
                        v-model="TMPL_SUB_TITLE"
                      ></v-text-field>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 강조 유형 : 아이템리스트형 -->
              <div v-if="TMPL_EPSZ_TYPE === 'ITEM_LIST'">
                <h2 class="pl-subtit is-mt-l">강조 유형(아이템리스트형)</h2>
                <div class="pl-subdesc">
                  <p>메시지가 구조화된 정보성 메시지를 안내하기 위한 용도로 사용할 수 있습니다.</p>
                </div>
                <!-- 첨부파일 -->
                <compo-file-grid
                  TitleProp="메인 이미지"
                  RequiredProp
                  :HeadersProp="FILE_LIST_HEADER"
                  :FilesProp="IMAGE_FILE_LIST"
                  @addFile="clickAddImageFiles"
                  :DelData="DEL_IMAGE_FILE"
                  @input="DEL_IMAGE_FILE = $event"
                  @removeFile="removeImageFile()"
                >
                  <template slot="infotext">
                    <ul class="pl-list-info">
                      <li>
                          1. 이미지는 고정 이미지 1개, 용량 500KB 까지만 등록 가능합니다.<br>
                          2. 이미지는 png, jpg만 등록 가능합니다.<br>
                          3. 이미지의 사이즈는 가로 500px, 세로 250px 이상(비율 2:1)만 등록 가능합니다.(권장 사이즈 800px*400px)
                      </li>
                    </ul>
                  </template>
                </compo-file-grid>
                <input ref="imageFileUpload" type="file" multiple @change="handleImageFileUpload" style="display: none" />

                <div class="pl-form-inline-wrap vertical type-2 is-mt-m">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      헤더
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form"
                        placeholder="헤더 입력"
                        v-model="ITEM_HEADER"
                      ></v-text-field>
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      하이라이트 타이틀
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form"
                        placeholder="하이라이트 타이틀 입력"
                        v-model="ITEM_HIGH_LIGHT_TITLE"
                      ></v-text-field>
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      하이라이트 디스크립션
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form"
                        placeholder="하이라이트 디스크립션 입력"
                        v-model="ITEM_HIGH_LIGHT_DSCP"
                      ></v-text-field>
                    </div>
                  </div>
                </div>
                <!-- 하이라이트 이미지  -->
                <compo-file-grid
                  TitleProp="하이라이트 이미지 "
                  RequiredProp
                  :HeadersProp="FILE_LIST_HEADER"
                  :FilesProp="HIGH_LIGHT_FILE_LIST"
                  @addFile="clickAddHighLightFiles"
                  :DelData="DEL_HIGH_LIGHT_IMAGE_FILE"
                  @input="DEL_HIGH_LIGHT_IMAGE_FILE = $event"
                  @removeFile="removeHighLightImageFile()"
                >
                  <template slot="infotext">
                    <ul class="pl-list-info">
                      <li>
                          1. 이미지는 고정 이미지 1개, 용량 500KB 까지만 등록 가능합니다.<br>
                          2. 이미지는 png, jpg만 등록 가능합니다.<br>
                          3. 이미지의 사이즈는 가로 108px 이상, 가로:세로 비율 1:1 만 등록 가능합니다.
                      </li>
                    </ul>
                  </template>
                </compo-file-grid>
                <input ref="highLightFileUpload" type="file" multiple @change="handleHighLightFileUpload" style="display: none" />

                <!-- 아이템리스트 추가 -->

                <!-- 아이템리스트 추가되는 아이템 -->
                <div
                  class="pl-cols is-mt-s"
                  v-for="(item, index) in TMPL_ITEM_LIST"
                  :key="index">
                  <div class="pl-form-inline-wrap vertical type-2 is-col-fix" style="width: 250px">
                    <div class="pl-form-inline">
                      <span class="pl-label" v-if="index === 0">
                        아이템 타이틀
                        <v-icon class="pl-icon20 required"></v-icon>
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          v-model="item.title"
                          class="pl-form"
                          placeholder="아이템 타이틀 입력"
                        ></v-text-field>
                      </div>
                    </div>
                  </div>
                  <div class="pl-form-inline-wrap vertical type-2 mt-0 ml-2">
                    <div class="pl-form-inline">
                      <span class="pl-label" v-if="index === 0">
                        아이템 내용
                        <v-icon class="pl-icon20 required"></v-icon>
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          v-model="item.description"
                          class="pl-form flex-grow-1"
                          placeholder="아이템 내용 입력"
                        ></v-text-field>
                        <!-- 추가 버튼 -->
                        <compo-tooltip-btn v-if="index == 0"
                          TitleProp="추가"
                          ClassProp="pl-tooltip-btn flex-grow-0"
                          IconProp="pl-icon20 circle-plus"
                          TooltipPositionProp="top"
                          @btnClick="addItemList('', '')"
                        ></compo-tooltip-btn>
                        <!-- 삭제 버튼 -->
                        <compo-tooltip-btn v-else
                          TitleProp="삭제"
                          ClassProp="pl-tooltip-btn flex-grow-0"
                          IconProp="pl-icon20 trash"
                          TooltipPositionProp="top"
                          @btnClick="removeItemList(item)"
                        ></compo-tooltip-btn>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 아이템 요약 항목 -->
                <div class="pl-form-inline-wrap vertical type-2 is-mt-m">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      아이템 요약 타이틀
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form"
                        placeholder="아이템 요약 타이틀 입력"
                        v-model="ITEM_SUMRY_TITLE"
                      ></v-text-field>
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      아이템 요약 내용
                      <v-icon class="pl-icon20 required"></v-icon>
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form"
                        placeholder="아이템 요약 내용 입력"
                        v-model="ITEM_SUMRY_DSCP"
                      ></v-text-field>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 버튼 추가 -->
              <h2 class="pl-subtit is-mt-l">버튼 추가</h2>
              <div class="pl-subdesc">
                <p>버튼을 추가하실 경우 버튼 유형을 선택 후 [+] 버튼을 클릭하십시오.</p>
              </div>
              <div class="d-flex is-mt-s">
                <v-select
                  v-model="BTN_CHG_TYPE"
                  class="pl-form flex-grow-0"
                  :items="CODE_LIST_BTN_LINK_TYPE"
                  placeholder="선택하세요"
                  @change="ChgType('BTN_CHG_TYPE')"
                ></v-select>
                <!-- 추가 버튼 -->
                <compo-tooltip-btn
                  TitleProp="추가"
                  ClassProp="pl-tooltip-btn ml-2"
                  IconProp="pl-icon20 circle-plus"
                  TooltipPositionProp="top"
                  @btnClick="addBtnType(BTN_CHG_TYPE, '')"
                ></compo-tooltip-btn>
              </div>
              <!-- 버튼 유형 -->
              <div v-if="ADD_BTN_LIST.length > 0" class="pl-form-box-list">
                <div
                  v-for="(item, index) in ADD_BTN_LIST"
                  :key="index"
                  class="pl-form-box-list-unit"
                  :class="index === 0 ? 'mt-3' : ''"
                  >
                  <div class="pl-form-box-list-title">
                    {{ displayBtnTitle(item.title) }}
                    <compo-tooltip-btn
                      TitleProp="삭제"
                      ClassProp="pl-tooltip-btn"
                      IconProp="pl-icon20 trash"
                      TooltipPositionProp="top"
                      @btnClick="removeBtnType(item)"
                    ></compo-tooltip-btn>
                  </div>
                  <div class="pl-form-box-list-content">
                    <div class="pl-form-inline-wrap vertical " >

                      <!-- 버튼 유형 : 앱링크 메시지 -->
                      <div class="pl-subdesc mt-0" v-if="item.title === 'AL'">
                        <p>Mobile링크, Android, iOS 링크 중 2가지는 필수입니다.</p>
                      </div>
                      <!-- 버튼 유형 : 채널 추가 메시지 -->
                      <div class="pl-subdesc mt-0" v-if="item.title === 'AC'">
                        <p>채널 추가는 메시지 유형이 채널추가형, 복합형일 경우에만 가능합니다.</p>
                      </div>

                      <!-- 버튼 유형 : 웹링크 -->
                      <div class="pl-form-inline" v-if="item.title === 'WL' || item.title === 'AL'">
                        <span class="pl-label">
                          버튼 명
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            v-model="item.name"
                            class="pl-form"
                            placeholder="최대 14자"
                            v-byte-counter="42"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline" v-if="item.title === 'WL' || item.title === 'AL'">
                        <span class="pl-label">
                          버튼 링크(Mobile)
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            v-model="item.linkMo"
                            class="pl-form"
                            placeholder="최대 500자"
                            v-byte-counter="500"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline" v-if="item.title === 'WL' || item.title === 'AL'">
                        <span class="pl-label">
                          버튼 링크(PC)
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            v-model="item.linkPc"
                            class="pl-form"
                            placeholder="최대 500자"
                            v-byte-counter="500"
                          />
                        </div>
                      </div>
                      <!-- 버튼 유형 : 앱링크 -->
                      <div class="pl-form-inline" v-if="item.title === 'AL'">
                        <span class="pl-label">
                          버튼 링크(Android)
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            v-model="item.linkAnd"
                            class="pl-form"
                            placeholder="최대 500자"
                            v-byte-counter="500"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline" v-if="item.title === 'AL'">
                        <span class="pl-label">
                          버튼 링크(iOS)
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            v-model="item.linkIos"
                            class="pl-form"
                            placeholder="최대 500자"
                            v-byte-counter="500"
                          />
                        </div>
                      </div>
                      <!-- 버튼 유형 : 봇 키워드 -->
                      <div class="pl-form-inline" v-if="item.title === 'BK'">
                        <span class="pl-label">
                          봇 키워드
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            v-model="item.msg"
                            class="pl-form"
                            placeholder="최대 14자"
                            v-byte-counter="14"
                          />
                        </div>
                      </div>
                      <!-- 버튼 유형 : 메시지 전달 -->
                      <div class="pl-form-inline" v-if="item.title === 'MD'">
                        <span class="pl-label">
                          메시지
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            v-model="item.msg"
                            class="pl-form"
                            placeholder="최대 14자"
                            v-byte-counter="14"
                          />
                        </div>
                      </div>
                      <!-- 버튼 유형 : 상담톡 전환 -->
                      <div class="pl-form-inline" v-if="item.title === 'BC'">
                        <span class="pl-label">
                          메시지
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            v-model="item.msg"
                            class="pl-form"
                            placeholder="최대 14자"
                            v-byte-counter="14"
                          />
                        </div>
                      </div>
                      <!-- 버튼 유형 : 봇 전환 -->
                      <div class="pl-form-inline" v-if="item.title === 'BT'">
                        <span class="pl-label">
                          메시지
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            v-model="item.msg"
                            class="pl-form"
                            placeholder="최대 14자"
                            v-byte-counter="14"
                          />
                        </div>
                      </div>
                      <!-- 버튼 유형 : 채널 추가 -->
                      <div class="pl-form-inline" v-if="item.title === 'AC'">
                        <span class="pl-label">
                          메시지
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            v-model="item.msg"
                            class="pl-form"
                            placeholder="최대 14자"
                            v-byte-counter="14"
                            :disabled="item.title == 'AC' ? true:false"
                          />
                        </div>
                        <!-- :disabled="(TMPL_MSG_TYPE == 'AD' || TMPL_MSG_TYPE == 'MI') && item.title == 'AC' ? true:false" -->
                      </div>
                      <!-- 버튼 유형 : 배송 조회 -->
                      <div class="pl-form-inline" v-if="item.title === 'DS'">
                        <span class="pl-label">
                          메시지
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            v-model="item.msg"
                            class="pl-form"
                            placeholder="배송조회하기"
                            disabled
                          />
                        </div>
                      </div>


                    </div>

                  </div>

                </div>
              </div>

              <!-- 버튼 유형 : 배송조회 -->


              <!-- 버튼 유형 : 메시지 전달 -->

              <!-- 버튼 유형 : 상담톡 전환 -->

              <!-- 버튼 유형 : 봇 전환 -->

              <!-- 버튼 유형 : 채널 추가 -->


            </div>
          </div>

        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="closeTmplDialog">닫기</v-btn>
          <v-btn class="pl-btn" @click="saveAtalkTmplValidation" :disabled="IS_PROCESS_SAVE_BTN">{{isRegMode?"저장":"수정"}}</v-btn>
        </template>

      </compo-dialog>
    </v-dialog>

  </div>
</template>

<script>
import axios from "axios";
export default {
    name:"MENU_CSL_M0603", //name은 'MENU_' + 파일명 조합

 components: {

  },
 data() {
    return {
      // top search
      // dropItems: [
      //   '전체',
      //   '미등록',
      //   '등록',
      //   '검수요청',
      //   '승인',
      //   '반려',
      // ],
      // dropItems2: [
      //   '전체',
      //   '기본형',
      //   '부가 정보형',
      //   '채널 추가형',
      //   '복합형',
      // ],



      /*******************************************************   공통 관련 시작   *******************************************************/
      COMM_CD_LIST:[],                    // 공통코드 리스트
      COMM_CD_DROP_LIST:[],               // 공통코드로 생성된 드롭박스 리스트

      // confirm alert 메시지
      MESSAGE : {
        CONFIRM : {
          IS_TMPL_SAVE : {alertDialogToggle: true, msg: '', iconClass: 'is-info', type: 'confirm', callYes: this.saveAtalkTmpl, callNo: this.closeMsg}
          ,IS_TMPL_DEL : {alertDialogToggle: true, msg: '템플릿을 삭제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.deleteAtalkTmpl, callNo: this.closeMsg}

          ,IS_MTS_REGISTER : {alertDialogToggle: true, msg: '알림톡 템플릿을 동록하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.mtsRegister, callNo: this.closeMsg}
          ,IS_MTS_REQUEST : {alertDialogToggle: true, msg: '알림톡 템플릿을 검수요청 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.mtsRequest, callNo: this.closeMsg}
          ,IS_MTS_REQUEST_CAN : {alertDialogToggle: true, msg: '알림톡 템플릿을 검수요청 취소 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.mtsCancelRequest, callNo: this.closeMsg}
          ,IS_MTS_APPROVAL_CAN : {alertDialogToggle: true, msg: '알림톡 템플릿을 승인 취소 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.mtsCancelApproval, callNo: this.closeMsg}
          ,IS_MTS_STOP : {alertDialogToggle: true, msg: '알림톡 템플릿을 중지 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.mtsStop, callNo: this.closeMsg}
          ,IS_MTS_REUSE : {alertDialogToggle: true, msg: '알림톡 템플릿을 중지 해제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.mtsReuse, callNo: this.closeMsg}
          ,IS_MTS_RELEASE : {alertDialogToggle: true, msg: '알림톡 템플릿을 휴면 해제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.mtsRelease, callNo: this.closeMsg}
        },
        ALERT : {
          REG_SUCCESS : {alertDialogToggle: true, msg: '', iconClass: 'is-info', type: 'default'}
          ,MTS_SUCCESS : {alertDialogToggle: true, msg: '', iconClass: 'is-info', type: 'default'}
          ,MTS_FAIL : {alertDialogToggle: true, msg: '', iconClass: 'is-info', type: 'default'}

          ,SEARCHING : {alertDialogToggle: true, msg: '', iconClass: 'is-info', type: 'default'}
          ,SEARCH_COMPLETE : {alertDialogToggle: true, msg: '조회가 완료되었습니다.', iconClass: 'is-info', type: 'default'}
          ,DELETE_COMPLETE : {alertDialogToggle: true, msg: '삭제가 완료되었습니다.', iconClass: 'is-info', type: 'default'}

          ,CHK_REG_ATALK_LIST : {alertDialogToggle: true, msg: '등록할 템플릿을 선택하세요.', iconClass: 'is-info', type: 'default'}
          ,CHK_NONE_BTN_TP : { alertDialogToggle: true, msg : '버튼 유형을 선택하세요.',iconClass: 'is-info', type: 'default'}
          ,CHK_LIMIT_BTN_COUNT : { alertDialogToggle: true, msg : '버튼을 5개 이상 추가 할수 없습니다.',iconClass: 'is-info', type: 'default'}

          ,CHK_SEND_PROFILE_KEY : { alertDialogToggle: true, msg : '발신 프로필키를 선택하세요.',iconClass: 'is-info', type: 'default'}
          ,CHK_TMPL_CD : { alertDialogToggle: true, msg : '템플릿 코드를 입력하세요.',iconClass: 'is-info', type: 'default'}
          ,CHK_DUPL_TMPL_CD : {alertDialogToggle: true, msg: '등록된 템플릿 코드가 있습니다.', iconClass: 'is-info', type: 'default'}
          ,CHK_TMPL_NM : { alertDialogToggle: true, msg : '템플릿명을 입력하세요.',iconClass: 'is-info', type: 'default'}
          ,CHK_DUPL_TMPL_NM : { alertDialogToggle: true, msg : '등록된 템플릿명이 있습니다.',iconClass: 'is-info', type: 'default'}
          ,CHK_DUPL_TMPL : {alertDialogToggle: true, msg: '등록된 템플릿 코드와 템플릿명이 있습니다.', iconClass: 'is-info', type: 'default'}
          ,CHK_TMPL_MSG_TYPE : { alertDialogToggle: true, msg : '템플릿 메시지 유형을 선택하세요.',iconClass: 'is-info', type: 'default'}
          ,CHK_TMPL_EPSZ_TYPE : { alertDialogToggle: true, msg : '템플릿 강조 유형을 선택하세요.',iconClass: 'is-info', type: 'default'}
          ,CHK_TMPL_CN : { alertDialogToggle: true, msg : '알림톡 템플릿 내용을 입력하세요.',iconClass: 'is-info', type: 'default'}
          ,CHK_TMPL_CN_LENGTH : { alertDialogToggle: true, msg : '알림톡 템플릿 내용을 1000자 이내로 입력하세요.',iconClass: 'is-info', type: 'default'}
          ,CHK_TMPL_EXTRA : { alertDialogToggle: true, msg : '알림톡 템플릿 부가 정보 내용을 선택하세요.',iconClass: 'is-info', type: 'default'}
          ,CHK_TMPL_EXTRA_LENGTH : { alertDialogToggle: true, msg : '알림톡 템플릿 부가 정보 내용을 500자 이내로 입력하세요.',iconClass: 'is-info', type: 'default'}
          ,CHK_TMPL_TOTAL_LENGTH : { alertDialogToggle: true, msg : '알림톡 템플릿 본문 및 부가 정보 내용을 합쳐서 1000자 이내로 입력하세요.',iconClass: 'is-info', type: 'default'}
          ,CHK_BTN_CHNEL : { alertDialogToggle: true, msg : '메시지 유형 채널추가형, 복합형은 채널추가 버튼이 필수 입니다.',iconClass: 'is-info', type: 'default'}
          ,CHK_TMPL_TITLE : { alertDialogToggle: true, msg : '메시지 유형 강조표기형은 강조 제목, 보조 제목 입력이 필수 입니다.',iconClass: 'is-info', type: 'default'}
          ,CHK_IMAGE_FILE_LIST : { alertDialogToggle: true, msg : '메시지 유형 이미지형은 이미지 첨부가 필수 입니다.',iconClass: 'is-info', type: 'default'}
          ,CHK_TMPL_ITEM_LIST_LENGTH : { alertDialogToggle: true, msg : '메시지 유형 아이템 리스트형은 2~10개 아이템 등록이 필수 입니다.',iconClass: 'is-info', type: 'default'}
          ,CHK_TMPL_ITEM_LIST_ITEM : { alertDialogToggle: true, msg : '등록한 아이템 중 입력되지 않은 항목이 있습니다.',iconClass: 'is-info', type: 'default'}

          , LIMIT_FILE_SIZE : { alertDialogToggle : true, msg:'첨부파일 개당 용량은 500KB 초과 할 수 없습니다.',iconClass: 'is-info', type:'default'}
          , LIMIT_FILE_TYPE : { alertDialogToggle : true, msg:'jpeg 또는 jpg 형식만 첨부 가능 합니다.',iconClass: 'is-info', type:'default'}
          , LIMIT_FILE_COUNT : { alertDialogToggle : true, msg:'파일은 한장만 첨부 가능합니다.',iconClass: 'is-info', type:'default'}

          , BASE_TMPL_DEL_CANT : { alertDialogToggle : true, msg:'기본 적용 템플릿<br>(위치정보 템플릿, 연락처정보 템플릿)<br>은 삭제할 수 없습니다',iconClass: 'is-info', type:'default'}
        }
      },

      isRegMode : true,                                         // 알림톡 템플릿 등록 팝업 모드, true - 신규 등록 / false - 상세 보기

      /*******************************************************   공통 관련   끝   *******************************************************/

      /************************************************   템플릿 등록 dialog 관련 시작   *************************************************/
      /** 템플릿 등록 dialog 관련 시작  */
      dialogRegTalk: false,                                       // dialog 팝업 상태

      IS_PROCESS_SAVE_BTN : false,                                // 저장버튼 동작 여부

      CODE_LIST_TMPL_MSG_TYPE : [],                               // 카카오 알림톡 템플릿 메시지 유형(공통코드)
      CODE_LIST_TMPL_EPSZ_TYPE : [],                              // 카카오 알림톡 템플릿 강조 유형(공통코드)
      CODE_LIST_BTN_LINK_TYPE : [],                               // 카카오 알림톡 버튼 링크 유형(공통코드)


      // 템플릿 등록 파라미터 정의
      SEND_PROFILE_KEY : "",                                    // 발신프로필키
      SELECTED_SEND_PROFILE_KEY : "",                           // 팝업에서 선택한 발신키, SEND_PROFILE_KEY_LIST v-model
      UUID : "",                                                // uuid
      TMPL_CD : "",                                             // 템플릿 코드
      TMPL_NM : "",                                             // 템플릿명
      TMPL_MSG_TYPE : "",                                       // 템플릿 메시지 유형
      TMPL_EPSZ_TYPE : "",                                      // 강조 유형

      // ---------------------------- 메시지 유형 관련 ----------------------------
      TMPL_CN : "",                                             // 템플릿 내용
      TMPL_EXTRA : "",                                          // 템플릿 부가정보 내용, 초기화 대상
      // TMPL_CHNEL : "",                                          // 템플릿 채널추가 내용
      // ---------------------------- 메시지 유형 관련 ----------------------------

      // ---------------------------- 강조 유형 관련 ----------------------------
      // 강조 표기형 시작
      TMPL_TITLE : "",                                          // 강조 제목, 초기화 대상
      TMPL_SUB_TITLE : "",                                      // 강조 보조제목, 초기화 대상
      // 강조 표기형 끝

      // 이미지형 또는 아이템 리스트형 시작
      TMPL_IMAGE : [],                                          // 강조유형 이미지형 또는 아이템 리스트형 이미지, 초기화 대상
      // 이미지형 또는 아이템 리스트형 시작

      // 아이템 리스트형 시작
      ITEM_HEADER : "",                                         // 아이템 헤더, 초기화 대상
      ITEM_HIGH_LIGHT_TITLE : "",                               // 아이템 하이라이트 타이틀, 초기화 대상
      ITEM_HIGH_LIGHT_DSCP : "",                                // 아이템 하이라이트 설명, 초기화 대상
      HIGH_LIGHT_FILE_LIST : [],                                // 아이템 하이라이트 이미지, 초기화 대상

      IMAGE_FILE_LIST : [],


      TMPL_ITEM_LIST : [],                                      // 템플릿 아이템 리스트
      ITEM_SUMRY_TITLE : "",                               // 템플릿 아이템 요약 제목
      ITEM_SUMRY_DSCP : "",                                // 템플릿 아이템 요약 설명


      // 아이템 리스트형 끝
      // ---------------------------- 강조 유형 관련 ----------------------------

      // REG_SEND_PROFILE_LIST : [
        /*
        {
          text : "",        // SEND_PROFILE_LIST.SEND_PROFILE_NM - 발송프로필명
          value : ""        // SEND_PROFILE_LIST.SEND_PROFILE_KEY - 발송프로필키
        }
        */
      // ],

      // addBtnActive: false,        // 버튼 추가 여부
      // 버튼 추가
      BTN_CHG_TYPE: '',
      ADD_BTN_LIST: [],

      FILE_LIST_HEADER : [
        { text: '파일명', value: 'filename', align: 'left',sortable: false },
        { text: '크기', value: 'filesize', align: 'left',sortable: false , width: '100px'},
      ],

      SELECT_SEND_PROFILE_KEY : {
        SEND_PROFILE_KEY : ""
      },

      DEL_IMAGE_FILE:[],                          // 컴포넌트 모달에서 삭제 클릭마다 가져온 삭제파일정보
      DEL_IMAGE_FILE_LIST:[],                     // DEL_FILE 안의 DEL_FILE_LIST 정보만 담은 삭제파일정보

      DEL_HIGH_LIGHT_IMAGE_FILE:[],               // 컴포넌트 모달에서 삭제 클릭마다 가져온 삭제파일정보
      DEL_HIGH_LIGHT_IMAGE_FILE_LIST:[],          // DEL_FILE 안의 DEL_FILE_LIST 정보만 담은 삭제파일정보

      DEL_FILE_KEY_LIST : [],               // DEL_FILE_LIST 에서 빼낸 file_key list, 삭제용 파일키 리스트

      // DEL_HIGH_LIGHT_IMAGE_FILE_KEY_LIST : [],    // DEL_FILE_LIST 에서 빼낸 file_key list, 삭제용 파일키 리스트


      /************************************************   템플릿 등록 dialog 관련   끝   *************************************************/

      /*****************************************************   리스트 관련 시작   ********************************************************/
      /** 리스트 관련 시작  */

      CODE_TMPL_IGI_STTS : [],            // 검수 상태 공통코드 리스트
      PARAM_TMPL_IGI_STTS : "",           // 파라미터 검수 상태 v-model value

      CODE_TMPL_MSG_TYPE : [],            // 메시지 유형 공통코드 리스트
      PARAM_TMPL_MSG_TYPE : "",           // 파라미터 메시지 유형 v-model value

      PARAM_TMPL_NM : "",                 // 파라미터 템플릿명 v-model value

      // 그리드 체크박스 v-model
      ATALK_LIST : [],

      // 버튼 제어 관련
      IS_DEL : true,              // 템플릿 삭제
      IS_MTS_REG : true,          // MTS 등록 요청 - NOTREG, R
      IS_MTS_REQ : true,          // MTS 검수 요청 - REG, R
      IS_MTS_REQ_CAN : true,      // MTS 검수 요청 취소 - REQ, R
      IS_MTS_APR_CAN : true,      // MTS 승인 취소 - APR, R
      IS_MTS_MOD : true,          // MTS 수정 - REG/REJ, R
      IS_MTS_STP : true,          // MTS 중지 - APR, R/A
      IS_MTS_STP_CAN : true,      // MTS 중지 취소 - APR, S
      IS_MTS_DMT_CAN : true,      // MTS 휴면 해제


      // 발신 프로필 리스트
      SEND_PROFILE_KEY_LIST: [
        /*
        {
          UUID : "",              // UUID
          CHN_CLSF_NM : "",       // 분류명
          SEND_PROFILE_NM : ,     // 발송프로필명
          SEND_PROFILE_KEY : ""   // 발송프로필키
        }
        */
      ],

      // 알림톡 리스트 그리드 헤더
      GRID_HEADER: [
        { text: "번호", value: "ROWNUM", align: "center", width: "7%", sortable : false},
        { text: "ATALK_ID", value: "ATALK_ID", align: " d-none", sortable : false},
        { text: "SENDER_PROFILE_KEY", value: "SENDER_PROFILE_KEY", align: " d-none", sortable : false},
        { text: "UUID", value: "UUID", align: "left", width: "13%", sortable : false},
        { text: "템플릿코드", value: "TMPL_CD", align: "left", width: "15%", sortable : true},
        { text: "템플릿명", value: "TMPL_NM", align: "left", width: "15%" , sortable : false},
        { text: "템플릿타입코드", value: "TMPL_MSG_TYPE", align: " d-none", sortable : false},
        { text: "템플릿타입", value: 'TMPL_MSG_NM', align: "left", width: "9%", sortable : false},
        { text: "템플릿강조코드", value: "TMPL_EPSZ_TYPE", align: " d-none", sortable : false},
        { text: "등록일", value: "REG_DT", align: "left", width: "10%", sortable : false},
        { text: "수정일", value: "MDFCN_DT", align: "left", width: "10%" , sortable : false},
        { text: "템플릿상태코드", value: "TMPL_STTS", align: " d-none", sortable : false},
        { text: "템플릿상태", value: "TMPL_STTS_NM", align: "left", width: "10%", sortable : false},
        { text: "검수상태코드", value: "TMPL_IGI_STTS", align: " d-none", sortable : false},
        { text: "검수상태", value: "TMPL_IGI_NM", align: "left", width: "9%" , sortable : false}
      ],

      // 알림톡 리스트 그리드 데이터
      GRID_DATA: [],

      // 그리드에서 선택한 알림톡 템플릿 정보
      SELECT_GRID_ROW_ITEM : {},

      /** 페이징 관련 */
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      },

      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,

      nextDisabled: false,

      /*****************************************************   리스트 관련   끝   ********************************************************/

      // 메시지 유형
      // dropItemsL02: [
      //   { title: '기본형', type: 'basic'},
      //   { title: '부가 정보형', type: 'addon'},
      //   { title: '채널 추가형', type: 'addCh'},
      //   { title: '복합형', type: 'mixed'},
      // ],
      // 강조 유형
      // dropItemsL03: [
      //   { title: '선택 안함', type: 'none'},
      //   { title: '이미지형', type: 'img'},
      //   { title: '강조표기형', type: 'em'},
      //   { title: '아이템리스트형', type: 'item'},
      // ],

      // ADD_ITEM_LIST: [ ],

      /*
      dropItemsL04: [
        { title: '웹 링크', type: 'web'},
        { title: '앱 링크', type: 'app'},
        { title: '배송조회', type: 'tracking'},
        { title: '봇 키워드', type: 'bot'},
        { title: '메시지 전달', type: 'msg'},
        { title: '상담톡 전환', type: 'talk'},
        { title: '봇 전환', type: 'botChg'},
        { title: '채널 추가', type: 'addCh'},
      ],
      */

      // grid
      // dropItemsG01: [
      //   { text: '카카오톡에 템플릿 등록', disabled: false},
      //   { text: '카카오톡에 검수요청', disabled: false},
      //   { text: '카카오톡에 검수요청 취소', disabled: true},
      //   { text: '승인 취소', disabled: true},
      //   { text: '카카오톡에 중지 요청', disabled: false},
      //   { text: '카카오톡에 중지해제 요청', disabled: false},
      //   { text: '카카오톡에 휴면해제 요청', disabled: false},
      // ],


      TMPL_STTS_LOADING:false,
    }
  },

  watch: {
    ATALK_LIST : function(){

      /**
       *
        IS_MTS_REG          // MTS 등록 요청 - NOTREG, R
        IS_MTS_REQ          // MTS 검수 요청 - REG, R
        IS_MTS_REQ_CAN      // MTS 검수 요청 취소 - REQ, R
        IS_MTS_APR_CAN      // MTS 승인 취소 - APR, R
        IS_MTS_MOD          // MTS 수정 - REG/REJ, R
        IS_MTS_STP          // MTS 중지 - APR, R/A
        IS_MTS_STP_CAN      // MTS 중지 취소 - APR, S
        IS_MTS_DMT_CAN      // MTS 휴면 해제 - D
       *
       *  */

      let isDel = false;
      let isMtsReg = false;
      let isMtsReq = false;
      let isMtsReqCan = false;
      let isMtsAprCan = false;
      let isMtsStp = false;
      let isMtsStpCan = false;
      let isMtsDmcyCan = false;       // 휴면

      if(this.ATALK_LIST.length == 0){
        isDel = true;
        isMtsReg = true;
        isMtsReq = true;
        isMtsReqCan = true;
        isMtsAprCan = true;
        isMtsStp = true;
        isMtsStpCan = true;
        isMtsDmcyCan = true;
      }else{

        this.SELECT_GRID_ROW_ITEM = {};

        for(let i = 0; i < this.ATALK_LIST.length; i++){
          let tmplIGiStts = this.ATALK_LIST[i].TMPL_IGI_STTS;       // 검수 상태
          let tmplStts = this.ATALK_LIST[i].TMPL_STTS;              // 템플릿 상태
          let tmplDmcy = tmplStts;                                  // 템플릿 휴면 상태
          let check = tmplIGiStts+tmplStts;

          if(!isDel && check != "NOTREGR"){
            isDel = true;
          }

          if(!isMtsReg && check != "NOTREGR"){
            isMtsReg = true;
          }

          if(!isMtsReq && check != "REGR"){
            isMtsReq = true;
          }

          if(!isMtsReqCan && check != "REQR"){
            isMtsReqCan = true;
          }

          if(!isMtsAprCan && check != "APRR"){
            isMtsAprCan = true;
          }

          if((!isMtsStp && check != "APRR") && (!isMtsStp && check != "APRA")){
            isMtsStp = true;
          }

          if(!isMtsStpCan && check != "APRS"){
            isMtsStpCan = true;
          }

          if(!isMtsDmcyCan && tmplDmcy != "D"){
            isMtsDmcyCan = true;
          }
        }
      }

      this.IS_DEL = isDel;
      this.IS_MTS_REG = isMtsReg;
      this.IS_MTS_REQ = isMtsReq;
      this.IS_MTS_REQ_CAN = isMtsReqCan;
      this.IS_MTS_APR_CAN = isMtsAprCan;
      this.IS_MTS_STP = isMtsStp;
      this.IS_MTS_STP_CAN = isMtsStpCan;
      this.IS_MTS_DMT_CAN = isMtsDmcyCan;
    },

    // SELECT_GRID_ROW_ITEM : function(){
    //   this.ATALK_LIST = []
    // },
  },

  computed: {

  },

  created() {

  },

  mounted() {
    this.init();
  },

  methods: {

    /** 공통 관련 시작 */

    /** 공통 비동기 호출 후 콜백 호출 */
    async postCall(sUrl, postParam, headParam, callbackFunction, callbackParam){
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        if(callbackParam != undefined){
          return callbackFunction(response, callbackParam);
        }else{
          return callbackFunction(response);
        }
      }
    },

    /** 초기화 */
    init(){
      this.setCommCode();                 // 공통 코드 조회
      this.selectSendProfileKeys();       // 발송프로필키 목록 조회
    },

    /** 공통 코드 조회 */
    async setCommCode(){
      this.COMM_CD_LIST = [
        "MTS_TMPL_MSG_TP"                 // 카카오 알림톡 템플릿 메시지 유형
        ,"MTS_TMPL_EPSZ_TP"               // 카카오 알림톡 템플릿 강조 유형
        ,"MTS_BTN_LINK_TP"                // 카카오 알림톡 버튼 링크 유형
        ,"MTS_ISPT_STAT_CD"
      ];

      //공통코드별 드롭박스 만들기
      this.COMM_CD_DROP_LIST = await this.mixin_common_code_get_all(this.COMM_CD_LIST);
      // 필요한 공통코드 드롭박스 생성

      // 리스트 검색 파라미터
      this.CODE_TMPL_IGI_STTS = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, "MTS_ISPT_STAT_CD","전체");
      this.CODE_TMPL_MSG_TYPE = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, "MTS_TMPL_MSG_TP","전체");

      // 등록 팝업
      this.CODE_LIST_TMPL_MSG_TYPE = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, "MTS_TMPL_MSG_TP");
      this.CODE_LIST_TMPL_EPSZ_TYPE = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, "MTS_TMPL_EPSZ_TP");
      this.CODE_LIST_BTN_LINK_TYPE = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, "MTS_BTN_LINK_TP");
    },

    /** 공통 관련 끝 */

    /** 리스트 관련 시작 */

    /** grid 지정한 row에 활성화 효과 지정 */
    isActiveRow(item) {
      return item.ATALK_ID == this.SELECT_GRID_ROW_ITEM.ATALK_ID ? "active" : "";
    },

    /**
     * 발송 프로필키 목록 요청
     */
    selectSendProfileKeys(){
      let sUrl = "/phone-api/atalk/tmpl/manage/sendProfileKeys";
      let postParam = {}
      let headParam = {head : {}};
      this.postCall(sUrl, postParam, headParam, this.selectSendProfileKeysCallback);
    },

    /**
     * 발송 프로필키 목록 요청 콜백
     */
    selectSendProfileKeysCallback(response){
      this.SEND_PROFILE_KEY_LIST = response.DATA;
    },

    searchAtalkTmpl(next){
      if(this.SELECT_SEND_PROFILE_KEY.SEND_PROFILE_KEY == ""){
        // 발신 프로필키 선택 알림
        this.showAlert(this.MESSAGE.ALERT.CHK_SEND_PROFILE_KEY);
      }else{
        this.TMPL_STTS_LOADING = true;
        //알림톡 템플릿 리스트 가져오기
        this.selectAtalkTmplList(next);
        //알림톡 템플릿 검수상태 가져오기
        this.selectAtalkTmplSttsList();
      }
    },

    clickAtalkTmplList(sendProfileKey){
      this.SELECT_SEND_PROFILE_KEY.SEND_PROFILE_KEY = sendProfileKey;
      //알림톡 템플릿 리스트 가져오기
      this.selectAtalkTmplList();
      //알림톡 템플릿 검수상태 가져오기
      this.selectAtalkTmplSttsList();
    },

    selectAtalkTmplList(next){
      //다음버튼 클릭 유무
      if (next !== 'next'){
      // 그리드 초기화
        this.GRID_DATA = [];
        this.page = 1;              //페이징 처리 초기화
        this.pagination.page = 1;
        this.nextDisabled = true;   //버튼 비활성화
      }

      // this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);

      /*
      if(mode == undefined){
        this.MESSAGE.ALERT.SEARCHING.msg = "조회중입니다.";
      }else if(mode == "REG"){
        this.MESSAGE.ALERT.SEARCHING.msg = "저장 후 조회중입니다.";
      }else if(mode == "DEL"){
        this.MESSAGE.ALERT.SEARCHING.msg = "삭제 후 조회중입니다.";
      }
      this.showAlert(this.MESSAGE.ALERT.SEARCHING);
        setTimeout(() => {
            this.$store.commit("alertStore/hideAlert");
          }, 10000);
      */
      let sUrl = "/phone-api/atalk/tmpl/manage/list";
      let postParam = {
         SEND_PROFILE_KEY : this.SELECT_SEND_PROFILE_KEY.SEND_PROFILE_KEY
        ,PARAM_TMPL_IGI_STTS : this.PARAM_TMPL_IGI_STTS
        ,PARAM_TMPL_MSG_TYPE : this.PARAM_TMPL_MSG_TYPE
        ,PARAM_TMPL_NM : this.PARAM_TMPL_NM
      }
      let headParam = {
        head : {
          ROW_CNT : this.pagination.rowsPerPage,
          PAGES_CNT : this.pagination.page,
          PAGING : "Y",
        }
      };

      this.postCall(sUrl, postParam, headParam, this.selectAtalkTmplListCallback);
    },

    selectAtalkTmplListCallback(response){
      // this.showAlert(this.MESSAGE.ALERT.SEARCH_COMPLETE);
      //   setTimeout(() => {
      //       this.$store.commit("alertStore/hideAlert");
      //     }, 2000);
      // 초기화
      // this.GRID_DATA = [];
      this.GRID_DATA = [ ...this.GRID_DATA, ...response.DATA];

        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false;
          }else{
            this.nextDisabled = true;
          }
        }
        //이부분은 체크해볼것
        this.pagination.page += 1;
        // this.page=1;

    },

    mtsRegisterValidation(){
      if(this.ATALK_LIST.length == 0){
        // 등록 할수 없다는 알람
        this.showAlert(this.MESSAGE.ALERT.CHK_REG_ATALK_LIST);
      }else{
        this.showAlert(this.MESSAGE.CONFIRM.IS_MTS_REGISTER);
      }
    },

    mtsRegister(){
      let atalkIdList = [];
      let sUrl = "/phone-api/atalk/tmpl/manage/mtsRegister";

      for(let i in this.ATALK_LIST){
        atalkIdList.push(this.ATALK_LIST[i].ATALK_ID);
      }

      let postParam = {
        ATALK_ID_LIST : atalkIdList
      }
      let headParam = {head : {}};
      this.postCall(sUrl, postParam, headParam, this.mtsRegisterCallback);
    },

    mtsRegisterCallback(response){
      let result = response.DATA[0];

      if(result.code == "200"){
        // 저장 완료 popup 노출
        this.MESSAGE.ALERT.MTS_SUCCESS.msg = "템플릿이 등록되었습니다.";
        this.showAlert(this.MESSAGE.ALERT.MTS_SUCCESS);
        setTimeout(() => {
            this.$store.commit("alertStore/hideAlert");
          }, 2000);
        this.processSuccessCallback();
      }else{
        // 실패
        this.MESSAGE.ALERT.MTS_FAIL.msg = "템플릿 등록 중 실패한 템플릿이 있습니다." + result.result[0].message;
        this.showAlert(this.MESSAGE.ALERT.MTS_FAIL);
      }

    },

    mtsRequestValidation(){
      this.showAlert(this.MESSAGE.CONFIRM.IS_MTS_REQUEST);
    },

    mtsRequest(){
      let tmplCdList = [];
      let sUrl = "/phone-api/atalk/tmpl/manage/mtsRequest";
      for(let i in this.ATALK_LIST){
        tmplCdList.push(this.ATALK_LIST[i].TMPL_CD);
      }
      let postParam = {
         SEND_PROFILE_KEY : this.SELECT_SEND_PROFILE_KEY.SEND_PROFILE_KEY
        ,TMPL_CD_LIST : tmplCdList
      }
      let headParam = {head : {}};
      this.postCall(sUrl, postParam, headParam, this.mtsRequestCallback);
    },

    mtsRequestCallback(response){
      let result = response.DATA[0];

      if(result.code == "200"){
        // 저장 완료 popup 노출
        this.MESSAGE.ALERT.MTS_SUCCESS.msg = "템플릿이 검수요청 되었습니다.";
        this.showAlert(this.MESSAGE.ALERT.MTS_SUCCESS);
        setTimeout(() => {
            this.$store.commit("alertStore/hideAlert");
        }, 2000);
        this.processSuccessCallback();
      }else{
        // 실패
        this.MESSAGE.ALERT.MTS_FAIL.msg = "템플릿 검수요청 중 실패한 템플릿이 있습니다." + result.result[0].message;
        this.showAlert(this.MESSAGE.ALERT.MTS_FAIL);
      }
    },

    mtsCancelRequestValidation(){
      this.showAlert(this.MESSAGE.CONFIRM.IS_MTS_REQUEST_CAN);
    },

    mtsCancelRequest(){
      let tmplCdList = [];
      let sUrl = "/phone-api/atalk/tmpl/manage/mtsCancelRequest";
      for(let i in this.ATALK_LIST){
        tmplCdList.push(this.ATALK_LIST[i].TMPL_CD);
      }
      let postParam = {
         SEND_PROFILE_KEY : this.SELECT_SEND_PROFILE_KEY.SEND_PROFILE_KEY
        ,TMPL_CD_LIST : tmplCdList
      }
      let headParam = {head : {}};
      this.postCall(sUrl, postParam, headParam, this.mtsCancelRequestCallback);
    },

    mtsCancelRequestCallback(){
      let result = response.DATA[0];

      if(result.code == "200"){
        // 저장 완료 popup 노출
        this.MESSAGE.ALERT.MTS_SUCCESS.msg = "템플릿이 검수요청 취소 되었습니다.";
        this.showAlert(this.MESSAGE.ALERT.MTS_SUCCESS);
        setTimeout(() => {
            this.$store.commit("alertStore/hideAlert");
        }, 2000);
        this.processSuccessCallback();
      }else{
        // 실패
        for(let i = 0; i < result.result.length; i++){
          if(result.result[i].code != "200"){
            this.MESSAGE.ALERT.MTS_FAIL.msg = "템플릿 검수요청 취소 중 실패한 템플릿이 있습니다." + result.result[i].message;
          }
        }
        this.showAlert(this.MESSAGE.ALERT.MTS_FAIL);
      }
    },

    mtsCancelApprovalValidation(){
      this.showAlert(this.MESSAGE.CONFIRM.IS_MTS_APPROVAL_CAN);
    },

    mtsCancelApproval(){
      let tmplCdList = [];
      let sUrl = "/phone-api/atalk/tmpl/manage/mtsCancelApproval";
      for(let i in this.ATALK_LIST){
        tmplCdList.push(this.ATALK_LIST[i].TMPL_CD);
      }
      let postParam = {
         SEND_PROFILE_KEY : this.SELECT_SEND_PROFILE_KEY.SEND_PROFILE_KEY
        ,TMPL_CD_LIST : tmplCdList
      }
      let headParam = {head : {}};
      this.postCall(sUrl, postParam, headParam, this.mtsCancelApprovalCallback);
    },

    mtsCancelApprovalCallback(response){
      let result = response.DATA[0];

      if(result.code == "200"){
        // 저장 완료 popup 노출
        this.MESSAGE.ALERT.MTS_SUCCESS.msg = "템플릿이 승인 취소 되었습니다.";
        this.showAlert(this.MESSAGE.ALERT.MTS_SUCCESS);
        setTimeout(() => {
            this.$store.commit("alertStore/hideAlert");
        }, 2000);
        this.processSuccessCallback();
      }else{
        // 실패
        for(let i = 0; i < result.result.length; i++){
          if(result.result[i].code != "200"){
            this.MESSAGE.ALERT.MTS_FAIL.msg = "템플릿 승인 취소 중 실패한 템플릿이 있습니다." + result.result[i].message;
          }
        }
        this.showAlert(this.MESSAGE.ALERT.MTS_FAIL);
      }
    },

    mtsStopValidation(){
      this.showAlert(this.MESSAGE.CONFIRM.IS_MTS_STOP);
    },

    mtsStop(){
      let tmplCdList = [];
      let sUrl = "/phone-api/atalk/tmpl/manage/mtsStop";
      for(let i in this.ATALK_LIST){
        tmplCdList.push(this.ATALK_LIST[i].TMPL_CD);
      }
      let postParam = {
         SEND_PROFILE_KEY : this.SELECT_SEND_PROFILE_KEY.SEND_PROFILE_KEY
        ,TMPL_CD_LIST : tmplCdList
      }
      let headParam = {head : {}};
      this.postCall(sUrl, postParam, headParam, this.mtsStopCallback);
    },

    mtsStopCallback(response){
      let result = response.DATA[0];

      if(result.code == "200"){
        // 저장 완료 popup 노출
        this.MESSAGE.ALERT.MTS_SUCCESS.msg = "템플릿이 중지 되었습니다.";
        this.showAlert(this.MESSAGE.ALERT.MTS_SUCCESS);
        setTimeout(() => {
            this.$store.commit("alertStore/hideAlert");
        }, 2000);
        this.processSuccessCallback();
      }else{
        // 실패
        for(let i = 0; i < result.result.length; i++){
          if(result.result[i].code != "200"){
            this.MESSAGE.ALERT.MTS_FAIL.msg = "템플릿 중지 중 실패한 템플릿이 있습니다." + result.result[i].message;
          }
        }
        this.showAlert(this.MESSAGE.ALERT.MTS_FAIL);
      }
    },

    mtsReuseValidation(){
      this.showAlert(this.MESSAGE.CONFIRM.IS_MTS_REUSE);
    },

    mtsReuse(){
      let tmplCdList = [];
      let sUrl = "/phone-api/atalk/tmpl/manage/mtsReuse";
      for(let i in this.ATALK_LIST){
        tmplCdList.push(this.ATALK_LIST[i].TMPL_CD);
      }
      let postParam = {
         SEND_PROFILE_KEY : this.SELECT_SEND_PROFILE_KEY.SEND_PROFILE_KEY
        ,TMPL_CD_LIST : tmplCdList
      }
      let headParam = {head : {}};
      this.postCall(sUrl, postParam, headParam, this.mtsReuseCallback);
    },

    mtsReuseCallback(response){
      let result = response.DATA[0];

      if(result.code == "200"){
        // 저장 완료 popup 노출
        this.MESSAGE.ALERT.MTS_SUCCESS.msg = "템플릿이 중지 해제 되었습니다.";
        this.showAlert(this.MESSAGE.ALERT.MTS_SUCCESS);
        setTimeout(() => {
            this.$store.commit("alertStore/hideAlert");
        }, 2000);
        this.processSuccessCallback();
      }else{
        // 실패
        for(let i = 0; i < result.result.length; i++){
          if(result.result[i].code != "200"){
            this.MESSAGE.ALERT.MTS_FAIL.msg = "템플릿 중지 해제 중 실패한 템플릿이 있습니다." + result.result[i].message;
          }
        }
        this.showAlert(this.MESSAGE.ALERT.MTS_FAIL);
      }
    },

    mtsReleaseValidation(){
      this.showAlert(this.MESSAGE.CONFIRM.IS_MTS_RELEASE);
    },

    mtsRelease(){
      let tmplCdList = [];
      let sUrl = "/phone-api/atalk/tmpl/manage/mtsRelease";
      for(let i in this.ATALK_LIST){
        tmplCdList.push(this.ATALK_LIST[i].TMPL_CD);
      }
      let postParam = {
         SEND_PROFILE_KEY : this.SELECT_SEND_PROFILE_KEY.SEND_PROFILE_KEY
        ,TMPL_CD_LIST : tmplCdList
      }
      let headParam = {head : {}};
      this.postCall(sUrl, postParam, headParam, this.mtsReuseCallback);
    },

    mtsReleaseCallback(response){
      let result = response.DATA[0];

      if(result.code == "200"){
        // 저장 완료 popup 노출
        this.MESSAGE.ALERT.MTS_SUCCESS.msg = "템플릿이 휴면 해제 되었습니다.";
        this.showAlert(this.MESSAGE.ALERT.MTS_SUCCESS);
        setTimeout(() => {
            this.$store.commit("alertStore/hideAlert");
        }, 2000);
        this.processSuccessCallback();
      }else{
        // 실패
        for(let i = 0; i < result.result.length; i++){
          if(result.result[i].code != "200"){
            this.MESSAGE.ALERT.MTS_FAIL.msg = "템플릿 휴면 해제 중 실패한 템플릿이 있습니다." + result.result[i].message;
          }
        }
        this.showAlert(this.MESSAGE.ALERT.MTS_FAIL);
      }
    },


    /** 리스트 관련 끝 */

    /** 등록 dialog 관련 시작 */
    /**
     * 발송프로필키 select box 선택 시 text field에 값 설정
     */
    setSendProfileKey(value){
      let selectboxValue = value.split("/");
      let sendProfileKey = selectboxValue[0];               // send_profile_key
      let uuid = selectboxValue[1];                         // uuid
      this.SEND_PROFILE_KEY = sendProfileKey;
      this.UUID = uuid;
    },

    deleteAtalkTmplValidation(){
      for(let i in this.ATALK_LIST){
        if(this.ATALK_LIST[i].TMPL_CD == 'BASE_TMPL_CONTACT'){
          this.showAlert(this.MESSAGE.ALERT.BASE_TMPL_DEL_CANT);
          break;
        } else if(this.ATALK_LIST[i].TMPL_CD == 'BASE_TMPL_LOCAL') {
          this.showAlert(this.MESSAGE.ALERT.BASE_TMPL_DEL_CANT);
          break;
        }
      }
      this.showAlert(this.MESSAGE.CONFIRM.IS_TMPL_DEL);
    },

    deleteAtalkTmpl(){
      let atalkIdList = [];
      let sUrl = "/phone-api/atalk/tmpl/manage/delete";
      for(let i in this.ATALK_LIST){
        atalkIdList.push(this.ATALK_LIST[i].ATALK_ID);
      }
      let postParam = {
        ATALK_ID_LIST : atalkIdList
      }
      let headParam = {head : {}};
      this.postCall(sUrl, postParam, headParam, this.deleteAtalkTmplCallback);
    },

    deleteAtalkTmplCallback(response){

      this.showAlert(this.MESSAGE.ALERT.DELETE_COMPLETE);
        setTimeout(() => {
        this.$store.commit("alertStore/hideAlert");
      }, 2000);
      // this.selectAtalkTmplList("DEL");
      // this.selectAtalkTmplList();
      this.searchAtalkTmpl();
    },

    deleteImage(DEL_FILE_LIST, IMAGE_FILE_LIST){
      if(DEL_FILE_LIST.length != 0){
        let leng = DEL_FILE_LIST.length
        for(let i=0;i<leng;i++){
          this.DEL_FILE_KEY_LIST.push(DEL_FILE_LIST[i].fileKey);
        }
        this.delFile();
        this.fileGroupKeyUnity(IMAGE_FILE_LIST);
        this.DEL_FILE_KEY_LIST = [];
      }
    },

    checkTmplCdBeforeSave(){
      let sUrl = "/phone-api/atalk/tmpl/manage/checktmplCd";
      let postParam = {
        TMPL_CD : this.TMPL_CD                   // 템플릿 코드
        ,TMPL_NM : this.TMPL_NM
        , DSPTCH_PRF_KEY: this.SEND_PROFILE_KEY
      };
      let headParam = {head : {}};
      this.postCall(sUrl, postParam, headParam, this.checkTmplCdBeforeSaveCallback);
    },

    checkTmplCdBeforeSaveCallback(response){
      // 템플릿 코드 중복 여부
      let isDuplTmplCd = response.DATA[0].tmplCdCnt == 0?false:true;
      // 템플릿명 중복 여부
      let isDuplTmplNm = response.DATA[0].tmplNmCnt == 0?false:true;

      if(isDuplTmplCd && isDuplTmplNm){
        // 코드, 이름 둘 다 중복
        this.showAlert(this.MESSAGE.ALERT.CHK_DUPL_TMPL);
        return;
      }

      if(isDuplTmplCd && !isDuplTmplNm){
        // 코드만 중복
        this.showAlert(this.MESSAGE.ALERT.CHK_DUPL_TMPL_CD);
        return;
      }

      if(!isDuplTmplCd && isDuplTmplNm){
        // 이름만 중복
        this.showAlert(this.MESSAGE.ALERT.CHK_DUPL_TMPL_NM);
        return;
      }
    },

    // 알림톡 템플릿 저장 전 유효성 검사
    saveAtalkTmplValidation(){
      // 유효성 검사
      // 발신 프로필키
      if(this.SEND_PROFILE_KEY == ""){
        this.showAlert(this.MESSAGE.ALERT.CHK_SEND_PROFILE_KEY);
        return;
      }

      // 템플릿 코드
      if(this.TMPL_CD == ""){
        this.showAlert(this.MESSAGE.ALERT.CHK_TMPL_CD);
        return;
      }

      // 템플릿명
      if(this.TMPL_NM == ""){
        this.showAlert(this.MESSAGE.ALERT.CHK_TMPL_NM);
        return;
      }

      // 템플릿 메시지 유형
      if(this.TMPL_MSG_TYPE == ""){
        this.showAlert(this.MESSAGE.ALERT.CHK_TMPL_MSG_TYPE);
        return;
      }

      // 템플릿 강조 유형
      if(this.TMPL_EPSZ_TYPE == ""){
        this.showAlert(this.MESSAGE.ALERT.CHK_TMPL_EPSZ_TYPE);
        return;
      }

      // 템플릿 기본 내용
      if(this.TMPL_CN == ""){
        this.showAlert(this.MESSAGE.ALERT.CHK_TMPL_CN);
        return;
      }

      // 본문 1000자 이상일 때
      if(this.TMPL_CN.length > 1000){
        this.showAlert(this.MESSAGE.ALERT.CHK_TMPL_CN_LENGTH);
        return;
      }

      // 템플릿 메시지 유형 부가정보형 또는 복합형에
      if((this.TMPL_MSG_TYPE == "EX" || this.TMPL_MSG_TYPE == "MI")){
        // 부가 정보 문구 없을 때
        if(this.TMPL_EXTRA == ""){
          this.showAlert(this.MESSAGE.ALERT.CHK_TMPL_EXTRA);
          return;
        }

        // 부가 정보 문구 길이 500 이상 일 때
        if(this.TMPL_EXTRA.length > 500){
          this.showAlert(this.MESSAGE.ALERT.CHK_TMPL_EXTRA_LENGTH);
          return;
        }

        // 본문 + 부가 정보 문구 길이 1000 이상 일 때
        if(this.TMPL_CN.length + this.TMPL_EXTRA.length > 1000){
          this.showAlert(this.MESSAGE.ALERT.CHK_TMPL_TOTAL_LENGTH);
          return;
        }

      }

      // 템플릿 내용 길이
      if(this.TMPL_CN != "" || this.TMPL_EXTRA != ""){

      }

      // 강조 유형 강조 표기형에 강조 제목, 보조 제목 없을 때
      if(this.TMPL_EPSZ_TYPE == "TEXT" && (this.TMPL_TITLE == "" || this.TMPL_SUB_TITLE == "")){
        this.showAlert(this.MESSAGE.ALERT.CHK_TMPL_TITLE);
        return;
      }

      // if(this.TMPL_EPSZ_TYPE == "TEXT" && ){
      //   this.showAlert(this.MESSAGE.ALERT.CHK_TMPL_TITLE);
      //   return;
      // }

      // 강조 유형 이미지형 또는 아이템 리스트형 일 때
      if(this.TMPL_EPSZ_TYPE == "IMAGE"/* || this.TMPL_EPSZ_TYPE == "ITEM_LIST"*/){
        // 메인 이미지 첨부 안된 경우
        if(this.IMAGE_FILE_LIST.length == 0){
          this.showAlert(this.MESSAGE.ALERT.CHK_IMAGE_FILE_LIST);
          return;
        }

        /*
        // 아이템 리스트형
        if(this.TMPL_EPSZ_TYPE == "ITEM_LIST"){
          // 하이라이트 이미지 없는 경우
          if(this.HIGH_LIGHT_FILE_LIST.length == 0){
            this.showAlert(this.MESSAGE.ALERT.CHK_IMAGE_FILE_LIST);
            return;
          }
        }
        */
      }

      // 아이템 리스트형
      if(this.TMPL_EPSZ_TYPE == "ITEM_LIST"){
        let isPass = true;
        // 아이템 리스트는 2개 이상 10개 미만이어야 한다
        if(this.TMPL_ITEM_LIST.length < 2 || this.TMPL_ITEM_LIST.length > 10){
          this.showAlert(this.MESSAGE.ALERT.CHK_TMPL_ITEM_LIST_LENGTH);
          return;
        }else{
          for(let i = 0; i < this.TMPL_ITEM_LIST.length; i++){
            if(this.TMPL_ITEM_LIST[i].title == "" || this.TMPL_ITEM_LIST[i].description == ""){
              isPass = false;
            }
          }
        }

        if(!isPass){
          this.showAlert(this.MESSAGE.ALERT.CHK_TMPL_ITEM_LIST_ITEM);
          return;
        }
      }

      // if(this.ADD_BTN_LIST.length > 0){

      //   for(let i = 0; i < this.ADD_BTN_LIST.length; i++){
      //     let btn = this.ADD_BTN_LIST[i];

      //     switch(btn.linkType){
      //       case "WL" :
      //         break;
      //       case "AL" :
      //         break;
      //       case "AC" :
      //         break;
      //     }

      //     if(.linkType == "AC"){
      //       isPass = true;
      //     }
      //   }

      //   // 템플릿 메시지 유형 채널추가형 또는 복합형에 채널추가 버튼 없을 때
      //   if(this.TMPL_MSG_TYPE == "AD" || this.TMPL_MSG_TYPE == "MI"){
      //     let isPass = false;
      //     if(this.ADD_BTN_LIST.length > 0){
      //       for(let i = 0; i < this.ADD_BTN_LIST.length; i++){
      //         if(this.ADD_BTN_LIST[i].linkType == "AC"){
      //           isPass = true;
      //         }
      //       }
      //     }

      //     if(!isPass){
      //       this.showAlert(this.MESSAGE.ALERT.CHK_BTN_CHNEL);
      //       return;
      //     }
      //   }
      // }

      if(this.isRegMode){
        // 템플릿 코드 중복 검사
        this.checkTmplCdBeforeSave();
      }

      if(this.isRegMode){
        this.MESSAGE.CONFIRM.IS_TMPL_SAVE.msg = "알림톡 템플릿을 저장 하시겠습니까?";
      }else{
        this.MESSAGE.CONFIRM.IS_TMPL_SAVE.msg = "알림톡 템플릿을 수정 하시겠습니까?";
      }
      this.showAlert(this.MESSAGE.CONFIRM.IS_TMPL_SAVE);

    },

    // 알림톡 템플릿 저장
    saveAtalkTmpl(){

      // 수정일 때 첨부파일 처리
      if(!this.isRegMode){
        this.deleteImage(this.DEL_IMAGE_FILE_LIST, this.IMAGE_FILE_LIST);
        this.deleteImage(this.DEL_HIGH_LIGHT_IMAGE_FILE_LIST, this.HIGH_LIGHT_FILE_LIST);
      }

      let sUrl = this.isRegMode?"/phone-api/atalk/tmpl/manage/save":"/phone-api/atalk/tmpl/manage/modify";

      let sendProfileKey = this.SEND_PROFILE_KEY;
      let uuid = this.UUID;
      let tmplCd = this.TMPL_CD;
      let tmplNm = this.TMPL_NM;
      let tmplCn = this.TMPL_CN;
      let tmplMsgType = this.TMPL_MSG_TYPE;               // 템플릿 메시지 유형
      let tmplEpszType = this.TMPL_EPSZ_TYPE;
      let tmplExtra = "";
      let tmplTitle = "", tmplSubTitle = "";
      let imageFilegroupKey = "", highLightFileGroupKey = "";
      let itemHeader = "", itemHighLightTitle = "", itemHighLightDscp = "";
      let itemSumryTitle = "", itemSumryDscp = "";
      let itemList = "";

      // 메시지 유형별 파라미터
      if(tmplMsgType == "EX" || tmplMsgType == "MI"){     // 메시지 유형이 부가 정보형 또는 복합형
        tmplExtra = this.TMPL_EXTRA;
      }else{
        tmplExtra = "";
      }

      // 강조 유형별 파라미터
      if(tmplEpszType == "TEXT"){                         // 강조 유형 강조 표기형
        tmplTitle = this.TMPL_TITLE;
        tmplSubTitle = this.TMPL_SUB_TITLE;
      }else{
        tmplTitle = "";
        tmplSubTitle = "";
      }

      // 강조 유형 이미지형
      if(tmplEpszType == "IMAGE" || tmplEpszType == "ITEM_LIST"){
        // 이미지 파일
        imageFilegroupKey = this.IMAGE_FILE_LIST.length > 0 ? this.IMAGE_FILE_LIST[0].fileGroupKey : "";
        if(tmplEpszType == "ITEM_LIST"){
          // 하이라이트 이미지
          highLightFileGroupKey = this.HIGH_LIGHT_FILE_LIST.length > 0 ? this.HIGH_LIGHT_FILE_LIST[0].fileGroupKey : "";
        }else{
          highLightFileGroupKey = "";
        }
      }else{
        imageFilegroupKey = "";
        highLightFileGroupKey = "";
      }

      // 강조 유형 아이템 리스트형
      if(tmplEpszType == "ITEM_LIST"){
        // 헤더
        itemHeader = this.ITEM_HEADER;
        // 하이라이트 타이틀
        itemHighLightTitle = this.ITEM_HIGH_LIGHT_TITLE;
        // 하이라이트 설명
        itemHighLightDscp = this.ITEM_HIGH_LIGHT_DSCP;

        // 요약 타이틀
        itemSumryTitle = this.ITEM_SUMRY_TITLE;
        // 요약 설명
        itemSumryDscp = this.ITEM_SUMRY_DSCP;

        // 아이템 리스트
        itemList = JSON.stringify(this.TMPL_ITEM_LIST);
      }else{
        itemHeader = "";
        itemHighLightTitle = "";
        itemHighLightDscp = "";
        itemSumryTitle = "";
        itemSumryDscp = "";
        itemList = "";
      }

      // 추가한 버튼 있는 경우
      if(this.ADD_BTN_LIST.length > 0){
        for(let i in this.ADD_BTN_LIST){
          let name= "";
          /*
          // 버튼 타입 - 채널추가
          if(this.ADD_BTN_LIST[i].title == "AC"){
            // 메시지 유형 - 채널 추가형 또는 복합형
            if(this.TMPL_MSG_TYPE == "AD" || this.TMPL_MSG_TYPE == "MI"){
              // 채널추가 메시지 없음
              if(this.TMPL_CHNEL == ""){
                name = this.ADD_BTN_LIST[i].msg;
              // 채널추가 메시지 있음
              }else{
                name = this.TMPL_CHNEL;
              }
            // 메시지 유형 - 그 외
            }else{
              name = this.ADD_BTN_LIST[i].msg;
            }
          }
          // 버튼 타입 - 배송조회, 봇 전환, 상담톡 전환, 메시지 전환, 봇 키워드
          else if(this.ADD_BTN_LIST[i].title == "DS" || this.ADD_BTN_LIST[i].title == "BT" || this.ADD_BTN_LIST[i].title == "BC"
              || this.ADD_BTN_LIST[i].title == "MD" || this.ADD_BTN_LIST[i].title == "BK"){
                // 입력내용 = 버튼 명
                name = this.ADD_BTN_LIST[i].msg;
          }else{
          // 버튼 타입 웹링크(WL), 앱링크(AL)
            name = this.ADD_BTN_LIST[i].name;
          }
          */

          if(this.ADD_BTN_LIST[i].title == "WL" || this.ADD_BTN_LIST[i].title == "AL"){
            name = this.ADD_BTN_LIST[i].name;
          }else{
            name = this.ADD_BTN_LIST[i].msg;
          }

          this.ADD_BTN_LIST[i].name = name;
        }
      }

      // 파라미터 설정
      let postParam = {
        SEND_PROFILE_KEY : sendProfileKey                          // 발신프로필키
        ,UUID : uuid                                                 // uuid
        ,TMPL_CD : tmplCd                                           // 템플릿 코드
        ,TMPL_NM : tmplNm                                           // 템플리명
        ,TMPL_CN : tmplCn                                           // 템플릿 내용
        ,TMPL_EXTRA : tmplExtra                                     // 템플릿 부가내용
        ,TMPL_MSG_TYPE: tmplMsgType                                // 템플릿 메시지 유형
        ,TMPL_EPSZ_TYPE: tmplEpszType                              // 템플릿 강조 유형
        ,TMPL_ITEM : itemList                                       // 강조 유형 - 아이템 리스트형 - 아이템 목록
        ,TMPL_BTNS : JSON.stringify(this.ADD_BTN_LIST)              // 버튼 목록
        ,TMPL_TITLE : tmplTitle                                     // 강조 유형 - 강조 표기형 - 강조 제목
        ,TMPL_SUB_TITLE : tmplSubTitle                             // 강조 유형 - 강조 표기형 - 보조 제목
        ,ITEM_SUMRY_TITLE : itemSumryTitle               // 강조 유형 - 아이템 리스트형 - 요약 타이틀
        ,ITEM_SUMRY_DSCP : itemSumryDscp                 // 강조 유형 - 아이템 리스트형 - 요약 설명
        ,HEADER : itemHeader                                        // 강조 유형 - 아이템 리스트형 - 헤더
        ,HIGH_LIGHT_TITLE : itemHighLightTitle                    // 강조 유형 - 아이템 리스트형 - 하이라이트 타이틀
        ,HIGH_LIGHT_DSCP : itemHighLightDscp                      // 강조 유형 - 아이템 리스트형 - 하이라이트 설명
        ,IMAGE_FILE_GROUP_KEY : imageFilegroupKey                         // 강조 유형 - 이미지형 - 이미지 fileGroupKey or 아이템 리스트형 - 메인 이미지 fileGroupKey
        ,HIGH_FILE_GROUP_KEY : highLightFileGroupKey                      // 강조 유형 - 아이템 리스트형 - 하이라이트 이미지 fileGroupKey
        ,ATALK_ID : !this.isRegMode?this.SELECT_GRID_ROW_ITEM.ATALK_ID:""
      };

      let headParam = {head : {}};

      // this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS);
      // setTimeout(() => {
      //   this.$store.commit("alertStore/hideAlert");
      // }, 2000);
      this.postCall(sUrl, postParam, headParam, this.saveAtalkTmplCallback);
    },

    saveAtalkTmplCallback(response){
      // 등록 dialog 창 닫기
      this.closeTmplDialog();

      let result = response.DATA[0].code;
      let mtsCode = "", message = "";

      if(result == "200"){
        if(!this.isRegMode){                 // 수정
          mtsCode = response.DATA[0].mtsCode;
          if(mtsCode != "" && mtsCode != "200"){
            message = "템플릿 저장 후 카카오톡 템플릿 수정에 실패 했습니다"
          }
        }
        message = "템플릿을 저장했습니다"
      }else{
        message = "템플릿 저장 중 에러가 발생 했습니다."
      }

      this.MESSAGE.ALERT.REG_SUCCESS.msg = message
      // 저장 완료 popup 노출
      this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS);
      setTimeout(() => {
          this.$store.commit("alertStore/hideAlert");
        }, 2000);

      // this.selectAtalkTmplList("REG");
      // this.selectAtalkTmplList();
      this.searchAtalkTmpl();
    },

    saveSuccessDataInit(){
      this.SELECTED_SEND_PROFILE_KEY = "";
      this.SEND_PROFILE_KEY = "";
      this.TMPL_CD = "";
      this.TMPL_NM = "";
      this.TMPL_CN = "";
      this.TMPL_MSG_TYPE = "";
      this.TMPL_EPSZ_TYPE = "";
      this.TMPL_EXTRA = "";
      this.TMPL_TITLE = "";
      this.TMPL_SUB_TITLE = "";
      this.IMAGE_FILE_LIST = [];
      this.HIGH_LIGHT_FILE_LIST = [];
      this.ITEM_HEADER = "";
      this.ITEM_HIGH_LIGHT_TITLE = "";
      this.ITEM_HIGH_LIGHT_DSCP = "";
      this.ITEM_SUMRY_TITLE = "";
      this.ITEM_SUMRY_DSCP = "";
      this.TMPL_ITEM_LIST = [];
      this.ADD_BTN_LIST = [];
      this.BTN_CHG_TYPE = "";
    },

    processSuccessCallback(){
      // 체크박스 해제
      this.ATALK_LIST = []
      // this.selectAtalkTmplList();
      this.searchAtalkTmpl();
    },

    //아이템리스트 추가
    addItemList(title, description) {
      if(this.TMPL_ITEM_LIST.length == 10){
        this.showAlert(this.MESSAGE.ALERT.CHK_TMPL_ITEM_LIST_LENGTH);
      }else{
        this.TMPL_ITEM_LIST.push({
          title: title,
          description: description,
        });
      }
    },

    //아이템리스트 삭제
    removeItemList(item) {
      this.TMPL_ITEM_LIST.splice(this.TMPL_ITEM_LIST.indexOf(item), 1);
    },

    // 유형 변경
    ChgType(type) {
      // 메시지 유형이 채널 추가 또는 복합형일 때 - 버튼 추가(채널 추가)
      if(this.TMPL_MSG_TYPE == "AD" || this.TMPL_MSG_TYPE == "MI"){
        if(this.ADD_BTN_LIST.length == 0){    // 생성 버튼 없다
          this.addBtnType("AC", "");
        }else{                                // 생성 버튼 있다
          let isChnlBtn = false;
          for(let i = 0; i < this.ADD_BTN_LIST.length; i++){  // 버튼 목록
            if(this.ADD_BTN_LIST[i].linkType == "AC"){  // 채널버튼 확인
              isChnlBtn = true;
              this.ADD_BTN_LIST[i].msg = "채널 추가";
            }
          }
          if(!isChnlBtn){
            // 채널 버튼 없으면 채널 추가 버튼 생성
            this.addBtnType("AC", "");
          }
        }
      }

      // 강조유형 - 아이템리스트
      if(type == "EM_TYPE" && this.TMPL_EPSZ_TYPE == "ITEM_LIST"){
        if(this.TMPL_ITEM_LIST.length == 0){
          this.addItemList("", "");
        }
      }
    },

    //버튼 추가
    addBtnType(item, name, linkMo, linkPc, linkAnd, linkIos, ordering, message) {
      if(this.ADD_BTN_LIST.length == 5){
      // 버튼 유형 선택 확인 알람
          this.showAlert(this.MESSAGE.ALERT.CHK_LIMIT_BTN_COUNT);
      }else{
        if(item) {
          // this.addBtnActive = true;
          if(name == ""){
            this.addBtnTypeForm(item, name, "", "", "", "", "", "");
          }else{
            this.addBtnTypeForm(item, name, linkMo, linkPc, linkAnd, linkIos, ordering, message);
          }
        }else{
          // 버튼 유형 선택 확인 알람
          this.showAlert(this.MESSAGE.ALERT.CHK_NONE_BTN_TP);
        }
      }
    },

    // 강조유형 - 이미지형 파일 추가
    handleImageFileUpload(event){
      const files = event.target.files;
      //파일 제한 체크 (프론트에서 체크하고 업로드 로직 실행x)
      if (files.length > 0 && this.isValidFiles(files)) {
        // 파일 업로드
        this.uploadFiles(files, "image");
      }
    },

    // 강조유형 - 이미지형 파일 추가
    handleHighLightFileUpload(event){
      const files = event.target.files;
      //파일 제한 체크 (프론트에서 체크하고 업로드 로직 실행x)
      if (files.length > 0 && this.isValidFiles(files)) {
        // 파일 업로드
        this.uploadFiles(files, "highLight");
      }
    },

    //파일 업로드
    uploadFiles(files, type) {
      let busiType = 'mts';
      let pathType = 'images';
      let uploadUrl = "api/file/"+ busiType +"/"+ pathType +"/uploads";
      // let downloadUrl = "api/file/"+ busiType +"/"+ pathType +"/download";
      // let fileUploadLib = 'dropzone'
      //파일경로 설정
      // let dir = busiType+"/" + pathType;

      //파일 제한 체크 (빽엔드에서 체크 후 업로드 실패)
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();

        formData.append('action', uploadUrl);
        formData.append('method', "post");
        formData.append('custcoId', this.$store.getters['userStore/GE_USER_ROLE'].company.CD);                 //회사구분 : 1은 시스템(가이드)
        formData.append('userfiles', files[i]);           //파일(바이너리)
        // formData.append('acceptedFiles', "");             //허용파일유형
        // formData.append('fileUploadLib', fileUploadLib);  //파일 업로드 라이브러리
        //formData.append('trgtTypeCd', trgtTypeCd);        //파일 유형
        // formData.append('dir', dir);                      //파일경로
        // formData.append('downloadUri', downloadUrl);      //다운로드 경로
        // formData.append('uploadUri', uploadUrl);          //업로드 경로
        formData.append('userId', this.$store.getters['userStore/GE_USER_ROLE'].userId);                   //사용자 ID : 2는 시스템(가이드)

        axios
        .post(uploadUrl, formData , {headers:{Authorization: "bearer " + window.sessionStorage.getItem("token")}})
          .then(response => {

            // 파일 업로드 성공 시 처리
            this.uploadFilesCallback(i, response, type);
          })
          .catch(error => {
            // 파일 업로드 실패 시 처리
            console.error(error);
          });
      }
      // 서버로 파일 업로드 요청을 보냅니다.
    },

    uploadFilesCallback(idx, response, type){
      switch(type){
        case "image" :
          this.addFileList(idx, this.IMAGE_FILE_LIST, response);
          break;
        case "highLight" :
          this.addFileList(idx, this.HIGH_LIGHT_FILE_LIST, response);
          break;
      }
    },

    addFileList(idx, FILE_LIST, response){
      let leng = response.data.data.length;
      for(let n=0;n<leng;n++){
        FILE_LIST.push(
          {
            index : idx,
            filename : response.data.data[n].actlFileNm,
            filesize : response.data.data[n].fileSzDisplay,
            download : false,
            count : 0,
            downloadFile: response.data.data[n].actlFileNm,
            fileGroupKey: response.data.data[n].fileGroupKey,
            fileKey: response.data.data[n].fileKey,
          }
        );
      }
    },

    //파일개수 제한(파일개수 체크)
    isValidFiles(files) {
      // 파일 개수 제한을 설정
      const maxFileCount = 1;
      if (files.length > maxFileCount) {
        this.showAlert(this.MESSAGE.ALERT.LIMIT_FILE_COUNT);
        return false;
      }

      // 파일 크기 및 형식을 설정 (대소문자 구분)
      const allowedFileTypes = ["image/jpg", "image/jpeg", "image/png"];
      const maxFileSize = 500 * 1024; // 500KB
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

      // const minWidth = 500, minHeight = 250;
      // if(img.width < (minWidth) || img.height < (minHeight)) {
      //   alert("최소 이미지 사이즈(가로 640px, 세로 730px)에 맞춰서 올려주세요.");
      //   return;
      // }

      return true;
    },

    // file input
    clickAddImageFiles() {
      this.$refs.imageFileUpload.click()
    },

    // file input
    clickAddHighLightFiles() {
      this.$refs.highLightFileUpload.click()
    },

    /** 등록 dialog 관련 끝 */

    /** 알림톡 등록 정보 그리드 클릭 이벤트 */
    gridRowselected(item){
      this.SELECT_GRID_ROW_ITEM = item;
    },

    /** 알림톡 등록 정보 그리드 더블클릭 이벤트 */
    gridDbClick(item, row){
      this.gridRowselected(row.item);
      this.openDetailAtalkTmpl();
    },

    /** 알림톡 등록 정보 그리드 상세보기 */
    openDetailAtalkTmpl(){
      this.isRegMode = false;
      this.openAtalkTmplPopup();
    },

    // 템플릿 신규 등록
    openNewRegAtalkTmpl(){
      // 팝업 상태 신규 등록으로 변경
      this.isRegMode = true;
      this.openAtalkTmplPopup();
    },

    openAtalkTmplPopup(){
      this.initDataToTmplDialog();
      this.mixin_showDialog('RegTalk')
    },

    // 템플릿 등록 dialog 닫기
    closeTmplDialog(){
      // 등록 데이터 변수 초기화
      this.saveSuccessDataInit();
      this.mixin_hideDialog('RegTalk');
      this.SELECT_GRID_ROW_ITEM = {};
    },

    /**
     * 등록 팝업 데이터 설정
     * 신규면 초기화
     * 상세보기면 상세보기 데이터 설정
     */
    initDataToTmplDialog(){
      if(this.isRegMode){   // 신규 등록, 항목 초기화
        // 저장버튼 활성/비활성 설정 - 활성
        this.IS_PROCESS_SAVE_BTN = false;
        // 등록 데이터 변수 초기화
        this.saveSuccessDataInit();
      }else{                // 상세보기, 데이터 세팅
        // 수정 가능 상태 체크
        /**
         * 템플릿 상태 대기(R), 검수상태 미등록(NOTREG), 등록(REG), 반려(REJ) - 미등록(NOTREG) 상태는 MTS 요청 안함
         * NOTREGR
         * REGR
         * REJR
        */
        let check = this.SELECT_GRID_ROW_ITEM.TMPL_IGI_STTS + this.SELECT_GRID_ROW_ITEM.TMPL_STTS;
        if(check == "NOTREGR" || check == "REGR" || check == "REJR"){
          this.IS_PROCESS_SAVE_BTN = false;
        }else{
          this.IS_PROCESS_SAVE_BTN = true;
        }

        this.SEND_PROFILE_KEY = this.SELECT_GRID_ROW_ITEM.SENDER_PROFILE_KEY;
        this.TMPL_CD = this.SELECT_GRID_ROW_ITEM.TMPL_CD;
        this.TMPL_NM = this.SELECT_GRID_ROW_ITEM.TMPL_NM;
        this.TMPL_MSG_TYPE = this.SELECT_GRID_ROW_ITEM.TMPL_MSG_TYPE;
        this.TMPL_EPSZ_TYPE = this.SELECT_GRID_ROW_ITEM.TMPL_EPSZ_TYPE;
        this.TMPL_CN = this.SELECT_GRID_ROW_ITEM.TMPL_CN;

        if(this.SELECT_GRID_ROW_ITEM.TMPL_MSG_TYPE == "EX" || this.SELECT_GRID_ROW_ITEM.TMPL_MSG_TYPE == "MI"){    // 메시지 유형 - 부가 정보형 또는 복합형
          this.TMPL_EXTRA = this.SELECT_GRID_ROW_ITEM.TMPL_EXTRA;
        }

        if(this.SELECT_GRID_ROW_ITEM.TMPL_EPSZ_TYPE == "TEXT"){               // 강조 유형 - 강조 표기형
          this.TMPL_TITLE = this.SELECT_GRID_ROW_ITEM.TMPL_TITLE;
          this.TMPL_SUB_TITLE = this.SELECT_GRID_ROW_ITEM.TMPL_SUB_TITLE;
        }

        if(this.SELECT_GRID_ROW_ITEM.TMPL_EPSZ_TYPE == "ITEM_LIST"){
          // 헤더
          this.ITEM_HEADER = this.SELECT_GRID_ROW_ITEM.ITEM_HEADER;
          if(this.SELECT_GRID_ROW_ITEM.ITEM_HIGH_LIGHT != ""){
            // 하이라이트 타이틀
            this.ITEM_HIGH_LIGHT_TITLE = this.SELECT_GRID_ROW_ITEM.ITEM_HIGH_LIGHT.title;
            // 하이라이트 설명
            this.ITEM_HIGH_LIGHT_DSCP = this.SELECT_GRID_ROW_ITEM.ITEM_HIGH_LIGHT.description;
          }

          if(this.SELECT_GRID_ROW_ITEM.TMPL_ITEM != ""){
            let item = this.SELECT_GRID_ROW_ITEM.TMPL_ITEM.list;
            for(let i = 0; i < item.length; i++){
              this.addItemList(item[i].title, item[i].description);
            }

            if(this.SELECT_GRID_ROW_ITEM.TMPL_ITEM.summary != ""){
              // 요약 타이틀
              this.ITEM_SUMRY_TITLE = this.SELECT_GRID_ROW_ITEM.TMPL_ITEM.summary.title;
              // 요약 설명
              this.ITEM_SUMRY_DSCP = this.SELECT_GRID_ROW_ITEM.TMPL_ITEM.summary.description;
            }
          }
        }

        if(this.SELECT_GRID_ROW_ITEM.BUTTONS != ""){
          let buttons = this.SELECT_GRID_ROW_ITEM.BUTTONS;
          for(let i = 0; i < buttons.length; i++){
            if(buttons[i].linkType == "WL"){
              this.addBtnType(buttons[i].linkType, buttons[i].name, buttons[i].linkMo?buttons[i].linkMo:"", buttons[i].linkPc?buttons[i].linkPc:""
              , "", "", buttons[i].ordering, "");
            }else if(buttons[i].linkType == "AL"){
              this.addBtnType(buttons[i].linkType, buttons[i].name, buttons[i].linkMo?buttons[i].linkMo:"", buttons[i].linkPc?buttons[i].linkPc:""
              , buttons[i].linkAnd?buttons[i].linkAnd:"", buttons[i].linkIos?buttons[i].linkIos:"", buttons[i].ordering, "");
            }else{
              this.addBtnType(buttons[i].linkType, buttons[i].name, "", "", "", "", buttons[i].ordering, buttons[i].name);
            }

            // 채널추가 버튼 - AC
            /*
            if(buttons[i].linkType == "AC" && buttons[i].name != "채널 추가"){
              if(this.SELECT_GRID_ROW_ITEM.TMPL_MSG_TYPE == "EX" || this.SELECT_GRID_ROW_ITEM.TMPL_MSG_TYPE == "MI"){    // 메시지 유형 - 채널 추가형 또는 복합형
                // 채널추가 버튼의 이름 가져오기 - 채널 추가 아니면 여기 셋팅
                this.TMPL_CHNEL = buttons[i].name;
              }
            }
            */
          }
        }

        if(this.SELECT_GRID_ROW_ITEM.FILE_GROUP_KEY != ""){
          // 이미지 첨부파일 정보 조회
          this.selectUploadImgFile();
        }
      }
    },

    /** 이미지 첨부파일 정보 조회 */
    selectUploadImgFile(){
      let sUrl = "/phone-api/atalk/tmpl/manage/images";
      let postParam = {
        FILE_GROUP_KEY: this.SELECT_GRID_ROW_ITEM.FILE_GROUP_KEY
      }
      let headParam = {head: {}};
      this.postCall(sUrl, postParam, headParam, this.selectUploadImgFileCallback);
    },

    /** 이미지 첨부파일 정보 조회 콜백 */
    selectUploadImgFileCallback(response){
      let mainImage = this.SELECT_GRID_ROW_ITEM.IMG.split("/");
      let highLightImage = this.SELECT_GRID_ROW_ITEM.EPSZ_IMG.split("/");

      let mainImageName = mainImage.length > 0 ? mainImage[mainImage.length-1] : "";
      let highLightImageName = highLightImage.length > 0 ? highLightImage[highLightImage.length-1] : "";

      for(let i=0; i<response.DATA.length; i++){
        if(mainImageName == response.DATA[i].STRG_FILE_NM){     // 메인 이미지
          this.IMAGE_FILE_LIST.push({
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
        }else if(highLightImageName == response.DATA[i].STRG_FILE_NM){
          this.HIGH_LIGHT_FILE_LIST.push({
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

    /** 파일 삭제 클릭 이벤트 처리 함수 */
    removeImageFile(){
      for(let i=0;i<this.DEL_IMAGE_FILE.FILE_LIST.length;i++){
        this.DEL_IMAGE_FILE_LIST.push(this.DEL_IMAGE_FILE.FILE_LIST[i]);
      }
    },

    removeHighLightImageFile(){
      for(let i=0;i<this.DEL_HIGH_LIGHT_IMAGE_FILE.FILE_LIST.length;i++){
        this.DEL_HIGH_LIGHT_IMAGE_FILE_LIST.push(this.DEL_HIGH_LIGHT_IMAGE_FILE.FILE_LIST[i]);
      }
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

    //파일 따로 저장 시 파일 그룹 키 통일 안 됨 =>  강제 파일 그룹 키 통일
    async fileGroupKeyUnity(IMAGE_FILE_LIST){
      let arrFileKey = [];
      if(IMAGE_FILE_LIST.length > 0){
        let leng = IMAGE_FILE_LIST.length;
        for(let i=0;i<leng;i++){
          arrFileKey.push(IMAGE_FILE_LIST[i]["fileKey"])
        }
        //게시물 저장
        let sUrl = "/phone-api/sms/tmpl/manage/fileKeyUnity";
        let postParam = {
          FILE_GROUP_KEY: IMAGE_FILE_LIST[leng-1]["fileGroupKey"]
          ,arrFileKey:arrFileKey
        }

        let headParam = {
          head: {
          }
        }

        let resData = await this.common_postCall(sUrl, postParam, headParam)
        if(!resData.HEADER.ERROR_FLAG){
        }
      }
    },

    addBtnTypeForm(itemType, name, linkMo, linkPc, linkAnd, linkIos, ordering, message) {
      let msg = "";
      if(itemType == "AC"){
        msg = "채널 추가";
      }else if(itemType == "DS"){
        msg = "배송 조회하기";
      }else{
        msg = message;
      }

      this.ADD_BTN_LIST.push({
        title: itemType,
        name : name,
        linkType : itemType,
        ordering : name == ""?this.ADD_BTN_LIST.length + 1:ordering,
        linkMo : linkMo,
        linkPc : linkPc,
        linkAnd : linkAnd,
        linkIos : linkIos,
        msg : msg
      });
    },

    // 버튼 삭제
    removeBtnType(item) {
      this.ADD_BTN_LIST.splice(this.ADD_BTN_LIST.indexOf(item), 1);
    },

    //버튼 타이틀
    displayBtnTitle(title) {
      switch (title) {
        case 'WL':
          return '웹 링크'
        case 'AL':
          return '앱 링크'
        case 'DS':
          return '배송조회'

        case 'BK':
          return '봇 키워드'

        case 'MD':
          return '메시지 전달'

        case 'BC':
          return '상담톡 전환'

        case 'BT':
          return '봇 전환'

        case 'AC':
          return '채널 추가'

          default:
          break;
      }
    },

    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    //템플릿 검수상태 가져오기
    selectAtalkTmplSttsList(){
      let sUrl = "/phone-api/atalk/tmpl/manage/stts-list";
      let postParam = {
         SEND_PROFILE_KEY : this.SELECT_SEND_PROFILE_KEY.SEND_PROFILE_KEY
        ,PARAM_TMPL_IGI_STTS : this.PARAM_TMPL_IGI_STTS
        ,PARAM_TMPL_MSG_TYPE : this.PARAM_TMPL_MSG_TYPE
        ,PARAM_TMPL_NM : this.PARAM_TMPL_NM
      }
      let headParam = {
        head : {
          ROW_CNT : this.pagination.rowsPerPage,
          PAGES_CNT : this.pagination.page,
          PAGING : "Y",
        }
      };

      this.postCall(sUrl, postParam, headParam, this.selectAtalkTmplSttsListCallback);
    },

    selectAtalkTmplSttsListCallback(response){
      // this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
      // this.showAlert(this.MESSAGE.ALERT.SEARCH_COMPLETE);
      //   setTimeout(() => {
      //       this.$store.commit("alertStore/hideAlert");
      //     }, 2000);
      // 초기화
      // this.GRID_DATA = [];
      for(let i=0;i<response.DATA.length;i++){
        this.GRID_DATA[i].TMPL_STTS = response.DATA[i].TMPL_STTS;
        this.GRID_DATA[i].TMPL_STTS_NM = response.DATA[i].TMPL_STTS_NM;
        this.GRID_DATA[i].TMPL_IGI_STTS = response.DATA[i].TMPL_IGI_STTS;
        this.GRID_DATA[i].TMPL_IGI_NM = response.DATA[i].TMPL_IGI_NM;
        this.GRID_DATA[i].RJCT_RSN = response.DATA[i].RJCT_RSN;
      }

      this.TMPL_STTS_LOADING = false
    },

  },
}
</script>

<style lang="scss" scoped>

</style>