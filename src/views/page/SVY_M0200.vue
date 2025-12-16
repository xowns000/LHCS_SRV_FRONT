<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                진행 년도
              </span>
              <div class="pl-desc">
                <v-select class="pl-form"
                  :items="srvyYrItems"
                  v-model="SRVY_YR"
                  @change="getSrvyNm"
                  placeholder="선택하세요">
                </v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">진행 상태</span>
              <div class="pl-desc">
                <v-select class="pl-form"
                  :items="mixin_common_code_get(this.common_code, 'PROG_ST', '전체')"
                  v-model="STTS_CD"
                  @change="getSrvyNm"
                  placeholder="선택하세요">
                </v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">계획 구분</span>
              <div class="pl-desc">
                <v-select class="pl-form"
                  :items="mixin_common_code_get(this.common_code, 'SUVY_CL', '전체')"
                  v-model="SRVY_SE_CD"
                  @change="getSrvyNm"
                  placeholder="선택하세요">
                </v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">설문조사 명</span>
              <div class="pl-desc">
                <v-select class="pl-form is-auto"
                  :items="srvyNmItems"
                  v-model="SRVY_NM"
                  @change="btnSelectList()"
                  @click="getSrvyNmRefresh"
                  placeholder="선택하세요">
                </v-select>
              </div>
            </div>
            <v-btn class="pl-btn is-icon" @click="btnSelectList">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
          </div>
          <div class="pl-form-inline-wrap is-subcondition" v-show="searchDeatilToggle">
            <div class="pl-form-inline">
              <span class="pl-label">
                레이블
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field class="pl-form" value="pl-form" />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">레이블2</span>
              <div class="pl-desc">
                <v-text-field class="pl-form is-lg" value="pl-form is-lg" />
                <v-text-field class="pl-form" value="pl-form" />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">레이블3</span>
              <div class="pl-desc">
                <v-text-field class="pl-form is-lg" value="pl-form is-lg" />
                <v-text-field class="pl-form" value="pl-form" />
              </div>
            </div>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->

      <v-tabs class="pl-tabs" v-model="tab">
        <v-tab>설문지 생성</v-tab>
        <v-tab>참여자 설정</v-tab>
        <v-tab>응답설정</v-tab>
        <v-tab @click="tab4SelectList">설문 게시</v-tab>
      </v-tabs>
      <div style="height: 650px">
        <v-tabs-items v-model="tab" class="pl-tabs-items">
          <!-- 설문지 생성 -->
          <v-tab-item>
            <div class="pl-cols" style="height: 100%">
              <div class="is-col-fix is-vrt" style="width: 605px">
                <div class="pl-card" style="height: 100%; overflow-y: scroll;">
                  <!-- survey list -->
                  <div class="pl-survey-list">

                    <draggable
                      ghost-class="ghost"
                      v-model="SURVEYT_LIST"
                      :options="{ draggable: '.pl-survey-list-unit:not(.no-draggable)' }"
                      @change="updateGroupSortOrd"
                    >
                      <div
                        v-for="(item, itemIndex) in SURVEYT_LIST"
                        :key="itemIndex"
                        class="pl-survey-list-unit"
                        :class="[{ 'is-active': item.ACTIVE } ,{ 'no-draggable': item.HEAD_YN == 'Y' || !(stts_head === 'PRPARG' || stts_head === 'RFSL') ? true : false }]">
                        <div class="pl-survey-list-title-wrap" @click="surveyOpen(itemIndex)">
                          <v-icon v-show="item.TYPE === 'block'" class="pl-survey-arrow pl-icon20"
                            :class="item.ACTIVE ? 'arrow-down' : 'arrow-up'"></v-icon>
                          <span class="pl-survey-list-type">{{ item.TYPE === 'block' ? '[블록]' : '[설문헤더]' }}</span>
                          <div class="pl-survey-list-title" @click="item.ACTIVE = !item.ACTIVE">
                            <span v-if="item.RENAME === false">
                              {{ item.TITLE }}
                              <span v-if="item.QUESTION.length" class="pl-survey-list-question">
                                ({{ item.QUESTION.length }})개 질문</span>
                            </span>
                            <v-text-field
                                v-else class="pl-form mx-2 "
                                v-model="item.TITLE"
                                @keydown.enter="renameDoneSurveyList(itemIndex, item.TITLE)"
                                v-byte-counter="200"
                            />
                          </div>
                          <div class="is-right" v-show="headerChk('btn', item)">
                            <!-- 수정 버튼 -->
                            <compo-tooltip-btn
                              v-if="!item.RENAME && stts_head !== 'TERMIAT'"
                              TitleProp="수정"
                              ClassProp="pl-tooltip-btn"
                              IconProp="pl-icon20 edit"
                              TooltipPositionProp="top"
                              @btnClick="renameSurveyList(itemIndex)"></compo-tooltip-btn>
                            <compo-tooltip-btn
                              v-else-if="item.RENAME && stts_head !== 'TERMIAT'"
                              TitleProp="확인"
                              ClassProp="pl-tooltip-btn"
                              IconProp="pl-icon20 is-drag-icon-check"
                              TooltipPositionProp="top"
                              @btnClick="renameDoneSurveyList(itemIndex, item.TITLE)"></compo-tooltip-btn>
                            <!-- 삭제 버튼 -->
                            <compo-tooltip-btn
                              v-if="stts_head !== 'TERMIAT'"
                              TitleProp="삭제"
                              ClassProp="pl-tooltip-btn"
                              IconProp="pl-icon20 trash"
                              TooltipPositionProp="top"
                              @btnClick="removeSurveyList(item)"></compo-tooltip-btn>
                          </div>

                        </div>

                        <!-- sub question -->
                        <div class="pl-survey-list-children" v-show="headerChk('sub', item)">
                          <!-- 차일드 수정 버튼 -->
                          <div v-if="stts_head !== 'TERMIAT'" class="d-flex ma-2" >
                            <div
                              class="d-flex" style="gap: 8px">
                              <v-btn class="pl-btn is-sub is-sm" @click="copyChildSurveyList(itemIndex)" >
                                질문 복제
                              </v-btn>
                              <v-btn class="pl-btn is-sub is-sm" @click="openQuestionTemplate(itemIndex)">
                                질문 불러오기
                              </v-btn>
                            </div>
                            <div class="d-flex ml-auto" style="gap: 8px">
                              <v-btn class="pl-btn is-sm" @click="addChildSurveyList(itemIndex)" >
                                질문 추가
                              </v-btn>
                              <v-btn class="pl-btn is-sub is-sm" @click="removeChildSurveyList(itemIndex)">
                                질문 삭제
                              </v-btn>
                            </div>
                          </div>

                          <div v-for="(questionItem, questionIndex) in item.QUESTION" :key="questionIndex"
                            class="pl-survey-list-children-unit">
                            <v-checkbox v-model="checkedItems[questionIndex]" class="pl-check flex-grow-1"
                              :label="questionItem.SRVY_QITEM_CN" @click="questionOpen(questionIndex, questionItem)"></v-checkbox>
                            <!-- <span class="pl-survey-list-children-title">{{ questionItem.q_title }}</span> -->
                            <span class="pl-survey-list-children-type" @click="questionOpen(questionIndex, questionItem)">
                              <!-- {{ displayChildType(questionItem.QITEM_TYPE_CD) }}*{{ displayChildRequired(questionItem.REQUIRED) }} -->
                              {{ questionItem.QITEM_TYPE_NM }}*{{ displayChildRequired(questionItem.REQUIRED) }}
                            </span>
                            <div class="d-flex col-12 pa-0 justify-end">
                              <!-- list up 버튼 -->
                              <compo-tooltip-btn v-if="stts_head !== 'TERMIAT'" TitleProp="순서 위로" ClassProp="pl-tooltip-btn"
                                IconProp="pl-icon20 is-list-up" TooltipPositionProp="bottom"
                                @btnClick="moveItemUp(questionIndex, itemIndex)"></compo-tooltip-btn>
                              <!-- list down 버튼 -->
                              <compo-tooltip-btn v-if="stts_head !== 'TERMIAT'" TitleProp="순서 아래로" ClassProp="pl-tooltip-btn"
                                IconProp="pl-icon20 is-list-down" TooltipPositionProp="bottom"
                                @btnClick="moveItemDown(questionIndex, itemIndex)"></compo-tooltip-btn>
                            </div>
                          </div>

                          <!-- 다음 블록 정보 - 마지막 블록은 출력하지 않는다. -->
                          <div
                            v-if="itemIndex < SURVEYT_LIST.length-1"
                            class="d-flex mt-2 pl-survey-list-children-unit">
                            <div class="pl-form-inline-wrap flex-grow-1">
                              <div class="pl-form-inline flex-grow-1">
                                <span class="pl-label">
                                  다음 블록 정보
                                </span>
                                <div class="pl-desc">
                                  <v-select
                                    class="pl-form"
                                    v-model="item.MVMN_SRVY_QITEM_GROUP_ID"
                                    :items="getMvmnSrvyQitemGroupList(item.SORT_ORD)"
                                    item-value="SRVY_QITEM_GROUP_ID"
                                    item-text="SRVY_QITEM_GROUP_NM"
                                    @change="udpateMvmnSrvyQitemGroup(item, 'GROUP')"
                                    :disabled="!(stts_head == 'PRPARG' || stts_head == 'RFSL')"
                                  >
                                  </v-select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </draggable>

                  </div>
                </div>
                <div class="pl-card is-bottom">
                  <!-- 블록 추가 버튼 -->
                  <compo-tooltip-btn
                    TitleProp="블록 추가"
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 is-new-folder"
                    TooltipPositionProp="top"
                    :DisabledProp="stts_head === 'TERMIAT'?true:false"
                    @btnClick="tab1AddSurveyList"></compo-tooltip-btn>
                  <div class="is-right">
                    <v-btn class="pl-btn" 
                      @click="openLoadSvy()" 
                      :disabled="stts_head != 'PRPARG'">설문지 불러오기</v-btn>
                  </div>
                </div>
              </div>
              <div class="is-vrt">
                <template v-if="hdType === 'header'">
                  <div class="pl-card" style="height: 100%; overflow: auto;">
                    <!-- 설문 헤더 -->
                    <!-- :임시 보기용 템플릿 - 개발시 삭제해도 무방 -->
                    <h2 class="pl-subtit">[설문 헤더]</h2>
                    <div class="pl-subdesc">
                      <p>설문 시작 시 노출되는 설문의 제목과 안내문(인사말 등)을 설정합니다.</p>
                    </div>
                    <div class="pl-card-form-body">
                      <div class="pl-form-inline-wrap vertical">
                        <div class="pl-form-inline">
                          <span class="pl-label">
                            설문조사 명
                            <v-icon class="pl-icon20 required"></v-icon>
                          </span>
                          <div class="pl-desc">
                            <v-text-field
                                class="pl-form flex-grow-1"
                                v-model="gHdData.SRVY_QITEM_GROUP_NM"
                                disabled
                                v-byte-counter="200"
                            />
                            <p class="pl-form-hint">설문계획 등록 시 지정한 설문조사 명이 자동 출력됩니다.</p>
                          </div>
                        </div>
                        <div class="pl-form-inline">
                          <span class="pl-label">안내문</span>
                          <div class="pl-desc">
                            <v-textarea
                              class="pl-form is-noresize flex-grow-1"
                              v-model="gHdData.SRVY_QITEM_GROUP_CN"
                              :spellcheck="false"
                            />
                            <div class="pl-desc-btn flex-grow-0">
                              <!--  버튼 -->
                              <compo-tooltip-btn v-if="stts_head !== 'TERMIAT'" TitleProp="이미지 첨부" ClassProp="pl-tooltip-btn"
                                IconProp="pl-icon20 picture" TooltipPositionProp="bottom" @btnClick="addFile"></compo-tooltip-btn>
                              <input ref="fileUpload" type="file" multiple @change="handleFileUpload" style="display: none" />
                              <!-- 파일 업로드 모달창 -->
                              <!-- <v-dialog
                              max-width="655"
                              persistent
                              v-model="dialogVueDropzone"
                              v-if="dialogVueDropzone"
                              content-class="square-modal min-auto"
                              >
                                <dialog-VueDropzone
                                    headerTitle="첨부파일 등록"
                                    :ASP_NEWCUST_KEY = this.dropZoneParam.ASP_NEWCUST_KEY
                                    :fileGroupKey    = this.dropZoneParam.fileGroupKey
                                    :pathType        = this.dropZoneParam.pathType
                                    :busiType        = this.dropZoneParam.busiType
                                    :acceptedFiles   = this.dropZoneParam.acceptedFiles
                                    :userOptions     = this.dropZoneParam.userOptions
                                    @hide="hideDialog('VueDropzone')"
                                    @submit="uploadFileResponse"
                                >
                                </dialog-VueDropzone>
                              </v-dialog> -->
                              <!-- 파일 업로드 모달창 -->
                            </div>
                          </div>
                        </div>
                        <div class="pl-form-inline">
                          <span class="pl-label"></span>
                          <div class="pl-desc">
                            <!-- <img src="/upload/images/svy/2023/07/24/1690158250550_49148d10e5a343cc979a5d7319cc05f5.jpg" alt="" style="width: 190px;"> -->
                            <img :src="gHdData.IMG_URL" alt="" style="max-width: 653px;">
                            <!-- <img src="/orange/app/palette3/repository/web/files/2023/06/21/1687314489122_f4115a9e5b6e444b9880028ef3e55ba4.jpg" alt="" style="width: 190px;"> -->
                            <!-- <img src="@/assets/img/svy/files/2023/06/21/1687314489122_f4115a9e5b6e444b9880028ef3e55ba4.jpg" alt="이미지" style="width: 190px;" onerror="this.style.display='none'"> -->
                            <div class="pl-desc-btn flex-grow-0">
                              <!--  버튼 -->
                              <compo-tooltip-btn v-if="stts_head !== 'TERMIAT' && !mixin_isEmpty(gHdData.IMG_URL)" TitleProp="이미지 삭제" ClassProp="pl-tooltip-btn"
                                IconProp="pl-icon tabs-allclose" TooltipPositionProp="bottom" @btnClick="delFile"></compo-tooltip-btn>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- 이미지 -->
                    </div>
                  </div>
                  <div class="pl-card is-bottom">
                    <div class="is-right">
                      <v-btn class="pl-btn" @click="btnSaveTab1" :disabled="!(stts_head == 'PRPARG' || stts_head == 'RFSL')">저장</v-btn>
                    </div>
                  </div>
                </template>
                <template v-if="hdType === 'block'" >

                  <!-- SRVY_QITEM_CRT 모드로 호출 -->
                  <CompoSvyQitemDetail
                    ref="svyQitemDetailRef"
                    :DataProp="{MNG_TYPE: 'SRVY_QITEM_CRT', SRVY_QITEM: gQuData, STTS_HEAD: stts_head, MVMN_SRVY_QITEM_GROUP_LIST: getMvmnSrvyQitemGroupList(SURVEYT_LIST[tab1GrpIdx].SORT_ORD)}"
                    @reloadParentComp="reloadSurvey"
                  />
                </template>
              </div>
            </div>
          </v-tab-item>
          <!-- 참여자 설정 -->
          <v-tab-item>
            <div class="pl-card">
              <div class="pl-grid-top">
                <div class="pl-grid-top-left">
                   <!-- :disabled="stts_head === 'TERMIAT' ? true:false -->
                  <v-btn class="pl-btn is-icon is-sub" @click="btnExUpload"">
                    <span class="pl-icon20 excelup"></span>
                    엑셀 업로드
                  </v-btn>
                  <v-file-input
                    v-show="false"
                    ref="excelRef"
                    @change="openProgressBar();uploadExcel($event, gridDataHeaders)"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    counter
                    label="엑셀파일을 선택하세요"
                    :show-size="1000"
                  />
                  <!-- 엑셀 다운로드 버튼 -->
                    <!-- :disabled="stts_head === 'TERMIAT' ? true:false -->
                  <v-btn class="pl-btn is-icon is-sub" @click="btnExDownLoad"">
                    <span class="pl-icon20 exceltemplate"></span>
                    엑셀 양식 다운로드
                  </v-btn>
                   <!-- :disabled="stts_head === 'TERMIAT' ? true:false" -->
                  <v-btn class="pl-btn is-icon is-sub" @click="btnExlCond">
                    <span class="pl-icon20 reject"></span>
                    제외조건 적용
                  </v-btn>
                  <v-btn class="pl-btn is-icon is-sub" @click="btnSaveTab2" :disabled="stts_head === 'TERMIAT' ? true:false">
                    <span class="pl-icon20 save"></span>
                    저장
                  </v-btn>
                  <!-- <v-btn class="pl-btn" @click="btnSendSms(false)" :disabled="stts_head === 'TERMIAT' ? true:false">
                    개별발송
                  </v-btn>
                  <v-btn class="pl-btn" @click="btnSendSms(true)" :disabled="stts_head === 'TERMIAT' ? true:false">
                    전체발송
                  </v-btn> -->
                  <v-btn 
                    v-if="false && SITE == 'LHCS'"
                    class="pl-btn is-icon is-sub" 
                    @click="showAlert(MESSAGE.ALERT.PREPARING)" :disabled="stts_head === 'TERMIAT' ? true:false">
                    <span class="pl-icon20 circle-plus"></span>
                    DB 고객 추출
                  </v-btn>
                  <v-btn class="pl-btn is-icon is-sub" @click="[initNewTrgt(), dialogAddSomeone = true]" :disabled="stts_head === 'TERMIAT' ? true:false">
                    <span class="pl-icon20 circle-plus"></span>
                    참여자 개별 추가
                  </v-btn>
                  <v-btn class="pl-btn is-icon is-sub" @click="showAlert(MESSAGE.CONFIRM.DEL_TRGT)" :disabled="stts_head === 'TERMIAT' ? true: (gridSelectedData.length == 0 ? true : false)">
                    <span class="pl-icon20 circle-plus"></span>
                    참여자 삭제
                  </v-btn>
                  <v-btn class="pl-btn is-icon is-sub" @click="btnShowSmsPop" :disabled="stts_head === 'TERMIAT' ? true:false">
                    <span class="pl-icon20 send-sms"></span>
                    안내문자 발송
                  </v-btn>


                </div>
                <div class="pl-grid-top-utils">
                  <div class="pl-form-inline-wrap">
                    <div class="pl-form-inline">
                      <div class="pl-desc">
                        <v-select class="pl-form"
                          v-model="TRGT_SRCH_TYPE"
                         :items="TRGT_SRCH_TYPE_LIST"
                        />
                        <v-text-field class="pl-form"
                          v-model="TRGT_SRCH_KWRD"
                          placeholder="검색어 입력"
                          @keyup.enter="searchTrgt"
                        />
                      </div>
                    </div>
                    <v-btn class="pl-btn is-icon"
                      @click="searchTrgt"
                    >
                      <span class="pl-icon20 search"></span>
                      조회
                    </v-btn>
                  </div>
                  <!-- <span class="pl-counter">전체 <em class="pl-1">({{ gridTotalCnt }})</em> 건</span> -->
                  <span class="pl-counter">전체 <em class="pl-1">({{ gridDataText.length }})</em> 건</span>
                  <!-- 엑셀 다운로드 버튼 -->
                  <compo-excel
                    TypeProp="Download"
                    :DownReason=true
                    :DataHeaderProp="gridDataHeaders"
                    :DataBodyProp="gridDataText"
                    :FileNameProp="'설문 참여자_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                    SheetNameProp="설문 참여자"
                    HeaderColorProp="00B0F0"
                  ></compo-excel>
                </div>
              </div>
              <v-data-table
                class="pl-grid has-control"
                :headers="gridDataHeaders"
                :items="gridDataText"
                item-key="ROW_NUMBER"
                v-model="gridSelectedData"
                fixed-header
                show-select
                disable-select-all="true"
                height="527px"
                :items-per-page="ROW_PER_PAGE_TRGT"
                hide-default-footer
                :page.sync="pageTrgt"
                @page-count="pageCountTrgt = $event"
                no-data-text="등록된 데이터가 없습니다."
                :loading="isLoadingGridData"
                loading-text="조회중입니다."
                @click:row="rowClick"
                @dblclick:row="mixin_showDialog('AddSomeone')"
                :item-class="isActiveRow"
              >
                <template v-slot:header.data-table-select >
                  <v-checkbox 
                    class="pl-check is-chk-center"
                    v-model="isSelectedAllTrgt" 
                    @click="toggleSelectAllTrgt()"
                  ></v-checkbox>
                </template>
                <template v-slot:item.CUST_NM="{ item }">
                  {{ mixin_getCustcoSetting('ENV_CUSTNM_MASKING_YN') ? mixin_mask_name(item.CUST_NM) : item.CUST_NM }}
                </template>
                <template v-slot:item.CUST_PHN_NO="{ item }">
                  {{ mixin_getCustcoSetting('ENV_PHNNO_MASKING_YN') ? mixin_mask_num(item.CUST_PHN_NO.replace(/[^0-9]/g, "")) : mixin_setPhoneNo(item.CUST_PHN_NO.replace(/[^0-9]/g, "")) }}
                </template>
                <template v-slot:item.CNSLT_DIV_CD_1="{ item }">
                  {{ mixin_convertListCdNm(CUTT_TYPE_LIST_1,item.CNSLT_DIV_CD_1) }}
                </template>
                <template v-slot:item.CNSLT_DIV_CD_2="{ item }">
                  {{ mixin_convertListCdNm(CUTT_TYPE_LIST_2,item.CNSLT_DIV_CD_2) }}
                </template>
                <template v-slot:item.CNSLT_DIV_CD_3="{ item }">
                  {{ mixin_convertListCdNm(CUTT_TYPE_LIST_3,item.CNSLT_DIV_CD_3) }}
                </template>
                <template v-slot:item.RCPT_CHN_CD="{ item }">
                  {{ mixin_convertListCdNm(RCPT_CHN_CD_LIST,item.RCPT_CHN_CD) }}
                </template>
                <template v-slot:item.PRCS_CHN_CD="{ item }">
                  {{ mixin_convertListCdNm(PRCS_CHN_CD_LIST,item.PRCS_CHN_CD) }}
                </template>
              </v-data-table>
              <div class="pl-pager">
                <div class="pl-pager-row">
                  <span>페이지당 항목 수</span>
                  <v-select
                    class="pl-form"
                    :value="ROW_PER_PAGE_TRGT"
                    :items="perPage"
                    :item-text="toString(ROW_PER_PAGE_TRGT)"
                    @change="ROW_PER_PAGE_TRGT = parseInt($event, 10);"
                  ></v-select>
                </div>
                <v-pagination
                  v-model="pageTrgt"
                  :length="pageCountTrgt"
                  circle
                  :total-visible="10">
                </v-pagination>

                <span class="pl-pager-period">
                  <!-- 보기 {{ mixin_getPagePeriod(gridDataText, page) }} / {{ gridDataText.length }}
                  <v-btn
                    class="pl-btn is-sub"
                    :disabled = "nextDisabled"
                    @click="tab2SelectList(true)"
                  >다음 검색
                  </v-btn> -->
                </span>
              </div>
            </div>
          </v-tab-item>
          <!-- 응답설정 -->
          <v-tab-item>
            <div class="pl-cols" style="height: 100%">
              <div class="is-vrt">
                <div class="pl-card">
                  <div class="pl-card-form-body">
                    <ul class="pl-list-dot is-no-border is-mt-0">
                      <li>설문 참여자의 응답 시 필요한 옵션을 설정할 수 있습니다. 설정 항목을 확인하시고 [저장] 버튼을 클릭 하십시오.</li>
                    </ul>
                    <div class="pl-form-inline-wrap vertical is-mt-l">
                      <!-- 중복응답 사용안하기로함. 2023-05-30 -->
                      <!-- <div class="pl-form-inline">
                        <span class="pl-label">
                          중복 응답 제출
                        </span>
                        <div class="pl-desc">
                          <v-radio-group
                            row
                            class="pl-radio-group"
                          >
                            <v-radio
                              v-for="(radio, index) in radioGroup"
                              :key="radioGroup[index].text"
                              :label="radio.text"
                              :value="radio.text"
                              class="pl-radio"
                            >
                            </v-radio>
                          </v-radio-group>
                          <p class="pl-form-hint">설문조사 계획 등록 시 설정한 목표인원에 정해진 인원 수 만큼 설문 응답을 제출할 수 있습니다.</p>
                        </div>
                      </div> -->
                      <!-- <div class="pl-form-inline">
                        <span class="pl-label">
                          선착순 응답
                        </span>
                        <div class="pl-desc">
                          <v-radio-group
                            row
                            class="pl-radio-group"
                            v-model="PSNAL_LMT_SBMSN_STNG_YN"
                            disabled
                          >
                            <v-radio
                              v-for="(radio, index) in radioGroup2"
                              :key="radioGroup2[index].text"
                              :label="radio.text"
                              :value="radio.value"
                              class="pl-radio"
                            >
                            </v-radio>
                          </v-radio-group>
                          <p class="pl-form-hint">설문조사 계획 등록 시 설정한 목표인원에 정해진 인원 수 만큼 설문 응답을 제출할 수 있습니다.<br>목표인원이 등록된 경우 자동으로 설정됩니다.</p>
                        </div>
                      </div> -->
                      <div class="pl-form-inline" v-show="false">
                        <span class="pl-label">
                          개인 정보 수집 동의
                        </span>
                        <div class="pl-desc">
                          <v-radio-group
                            row
                            class="pl-radio-group"
                            v-model="CLCT_AGRE_USE_YN"
                          >
                            <v-radio
                              v-for="(radio, index) in radioGroup2"
                              :key="radioGroup2[index].text"
                              :label="radio.text"
                              :value="radio.value"
                              class="pl-radio"
                            >
                            </v-radio>
                          </v-radio-group>
                          <p class="pl-form-hint">설문지를 구성하고 있는 설문 문항의 출력 방법을 설정할 수 있습니다.</p>
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          설문 기간
                        </span>
                        <div class="pl-desc">
                            <!-- <v-text-field class="pl-form is-lg" v-model="dtSrvyBgngDt" disabled></v-text-field> -->
                            <span><strong>{{ dtSrvyBgngDt }} ~ {{ dtSrvyEndDt }}</strong></span>
                              <v-checkbox
                                class="pl-check"
                                label="표시하지 않음"
                                v-model="SRVY_YMD_INDCT_YN"
                              ></v-checkbox>
                          <!-- <div class="pl-calendar-range-form" readonly="readonly" >
                            <compo-date-picker
                              DateType="dateInput"
                              :DateProp.sync="dtSrvyBgngDt"/>
                            <span class="pl-unit">~</span>
                            <compo-date-picker
                              DateType="dateInput"
                              :DateProp.sync="dtSrvyEndDt"/>
                            <compo-drop-picker
                              :StartDateProp.sync="dtSrvyBgngDt"
                              :EndDateProp.sync="dtSrvyEndDt"
                            />
                          </div> -->
                          <p class="pl-form-hint">설문 참여자에게 설문 기간 노출여부를 설정합니다.</p>
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          응답 제출 시 안내 메시지
                        </span>
                        <div class="pl-desc">
                          <v-textarea
                            class="pl-form is-noresize"
                            v-model="SBMSN_END_MSG"
                            v-byte-counter="4000"
                            :spellcheck="false"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="pl-card is-bottom ">
                  <div class="is-right">
                    <v-btn class="pl-btn" @click="btnSaveTab3" :disabled="stts_head === 'TERMIAT' ? true:false">저장</v-btn>
                  </div>
                </div>
              </div>
            </div>
          </v-tab-item>
          <!-- 설문 게시 -->
          <v-tab-item>
            <div class="pl-cols" style="height: 100%">
              <div class="pl-card is-vrt is-col-fix" style="width: 410px">
                <div class="pl-survey-preview-wrap">
                  <div class="pl-phone-bg">
                    <SVY_PREVIEW
                      :previewCall="pData"
                    />
                  </div>
                </div>
              </div>
              <div class="is-vrt">
                <div class="pl-card">
                  <div class="pl-subtit">설문지 미리보기 및 최종 게시</div>
                  <ul class="pl-list-dot is-no-border ">
                    <li>좌측의 설문지 구성내용과 문항을 확인해 주세요.</li>
                    <li>설문기간 중이라도 설문지 최종 게시를 하지 않으면 참여자가 설문에 참여할 수 없습니다.</li>
                    <li>미리보기는 고객의 휴대폰 단말기의 기종 및 고객 개인별 폰트 설정 등에 따라 미리보기와 차이가 있을 수 있습니다.</li>
                    <li>설문참여 URL을 복사하여 휴대폰의 브라우저에서 직접 확인해 볼 수 있습니다.</li>
                    <li>미리보기의 경우 제출하기는 지원되지 않습니다.</li>
                  </ul>
                  <div 
                    v-if="gTrgtDsgnYn == 'N'" 
                    class="pl-form-inline-wrap is-mt-l">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        <v-icon class="pl-icon20 url-link mr-1"></v-icon>
                        설문참여 URL
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          class="pl-form is-lg"
                          style="flex: 0 0 580px;width: 580px;"
                          v-model="SRVY_URL"
                          disabled
                          v-byte-counter="600"
                        />
                        <!-- <v-btn class="pl-btn" @click="urlCopy">URL 복사</v-btn> -->

                        <div v-show="false">
                          <v-text-field class="pl-form is-lg" v-model="txtTestId">대상자id</v-text-field>
                          <v-btn class="pl-btn" @click="trgtDec">URL(대상자id암호화)테스트</v-btn>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="pl-form-inline-wrap is-mt-l">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        <v-icon class="pl-icon20 url-link mr-1"></v-icon>
                        설문참여 URL(미리보기)
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          class="pl-form is-lg"
                          style="flex: 0 0 580px;width: 580px;"
                          v-model="SRVY_URL_PREVIEW"
                          disabled
                          v-byte-counter="600"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="pl-form-inline-wrap is-mt-l">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        <v-checkbox
                          v-if="stts_head === 'APPR'"
                          class="pl-check"
                          label="즉시진행"
                          v-model="BY_PASS"
                        ></v-checkbox>
                      </span>
                    </div>

                  </div>
                </div>
                <div class="pl-card is-bottom">
                  <div v-if="stts_head !== 'TERMIAT'" class="is-right">
                    <v-btn v-if="stts_head == 'PRPARG' || stts_head == 'RFSL' || stts_head == 'RTRVL'" class="pl-btn" @click="btnSrvyOpen('RDY')">설문조사 승인 요청</v-btn>
                    <v-btn v-else-if="stts_head == 'RDY'" class="pl-btn" @click="btnSrvyOpen('PRPARG')">승인 요청 취소</v-btn>
                    <v-btn v-else-if="stts_head == 'APPR'" class="pl-btn" @click="btnSrvyOpen('PUBCMP')">설문조사 최종 게시</v-btn>
                    <v-btn v-else-if="PSTG_YN && stts_head == 'PUBCMP'" class="pl-btn is-sub" @click="btnSrvyOpen('APPR')">최종 게시 취소</v-btn>
                  </div>
                </div>
              </div>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </div>
    <!-- 안내문자 발송 dialog -->
    <v-dialog
      v-if="dialogSendGuideSms"
      v-model="dialogSendGuideSms"
      content-class="dialog-draggable is-scroll"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="안내문자 발송"
        @hide="mixin_hideDialog('SendGuideSms')"
        @submit="submitDialog('SendGuideSms')"
      >
        <template slot="body">
          <ul class="pl-list-dot is-no-border mt-0">
            <li>설문조사 참여 대상자에게 안내할 메시지를 발송합니다.</li>
            <li>안내 메시지는 문자발송시에만 등록된 템플릿 앞에 붙어서 전송됩니다.</li>
            <li>카카오톡(알림톡)은 따로 안내 메시지를 추가할 수 없습니다.</li>
            <li>안내 메시지를 입력 후 <strong>[발송하기] 버튼을 클릭</strong>하십시오.</li>
            <li>치환변수
              <ul>
                <li>고객명 : #{CUS_NM}</li>
                <li>설문링크 : #{LINK}</li>
                <template v-if="srvyExpsnAttrList.length > 0">
                  <li v-for="(expsn, index) in srvyExpsnAttrList" :key="`expsnInfoMsg-${index}`">{{expsn.EXPSN_ATTR_NM}} : {{'#{'}}{{expsn.EXPSN_ATTR_COL_ID}}{{'}'}}</li>
                </template>
              </ul>
            </li>
          </ul>
          <div class="pl-form-inline-wrap vertical label-100 is-mt-m">
            <!-- <div class="pl-form-inline">
              <span class="pl-label">
                발송대상
              </span>
              <div class="pl-desc">
                {{gridSelectedData.length == gridDataText.length ? '전체선택' : '일부선택'}} - {{ gridSelectedData.length }} 건
              </div>
            </div> -->
            <div class="pl-form-inline">
              <span class="pl-label">
                발송일시
              </span>
              <div class="pl-desc">
                <compo-date-picker
                  DateType="dateTime"
                    :DateProp.sync="SEND_DATE"
                    :TimesProp.sync='SEND_TIME'
                    :DisabledProp="IS_SEND_ATONCE"
                  />
                  <v-checkbox
                    v-model="IS_SEND_ATONCE"
                    class="pl-check"
                    label="즉시발송"
                  ></v-checkbox>
              </div>
            </div>
            <div v-if="computedSelectedRadio == 'SMS' || computedSelectedRadio == 'KAKAO'" class="pl-form-inline">
              <span class="pl-label">
                발송간격
              </span>
              <div class="pl-desc">
                <div class="pl-desc" style="width:50%">
                  <v-select
                  class="pl-form"
                    :items="SEND_INTERVAL_PEOPLE_LIST"
                    v-model="SEND_INTERVAL_PEOPLE"
                    placeholder="선택하세요"
                  ></v-select>명
                </div>
                <div class="pl-desc" style="width:45%">
                  <v-select
                    class="pl-form"
                    :items="SEND_INTERVAL_MIN_LIST"
                    v-model="SEND_INTERVAL_MIN"
                    placeholder="선택하세요"
                  ></v-select> 분
                </div>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                발송 대상 분류
              </span>
              <div class="pl-desc">
                <v-checkbox
                  v-model="IS_SEND_SEND"
                  class="pl-check"
                  label="발송자 제외"
                ></v-checkbox>
                <v-checkbox
                  v-model="IS_SEND_PART"
                  class="pl-check"
                  label="참여자 제외"
                ></v-checkbox>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">전달매체</span>
              <div class="pl-desc">
                <v-radio-group
                  v-model="computedSelectedRadio"
                  row
                  class="pl-radio-group"
                >
                  <v-radio
                    v-for="(rad01, ROW_NUMBER) in radioGroup"
                    :key="radioGroup[ROW_NUMBER].text"
                    :label="rad01.text"
                    :value="rad01.value"
                    class="pl-radio mr-6"
                  >
                  <template v-slot:label>
                    <div> {{ rad01.text }}
                      <v-icon class="pl-icon30" :class=rad01.icon></v-icon>
                    </div>
                  </template>
                  </v-radio>
                </v-radio-group>
              </div>
            </div>
            <div class="pl-form-inline" v-if="envSrvyDsptchNoTp == 'DEFAULT' && (computedSelectedRadio == 'SMS' || computedSelectedRadio == 'KAKAO')">
              <span class="pl-label">
                발신번호
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="CUSTCO_TEL_LIST"
                  v-model="CALLBACK_NUMBER"
                  placeholder="선택하세요"
                ></v-select>
              </div>
            </div>
            <div
              v-if="computedSelectedRadio == 'SMS'"
              class="pl-form-inline"
            >
              <span class="pl-label">
                제목
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  v-model="SEND_TTL"
                  :disabled="computedSelectedRadio == 'SMS' ? false : true"
                ></v-text-field>
              </div>
            </div>
            <div
              v-if="computedSelectedRadio == 'SMS'"
              class="pl-form-inline"
            >
              <div class="pl-desc">
                <v-textarea
                  v-model="SEND_MESSAGE"
                  class="pl-form is-noresize"
                  placeholder="안내 메시지 입력"
                  v-byte-counter="4000"
                  :disabled="computedSelectedRadio == 'SMS' ? false : true"
                  :spellcheck="false"
                />
              </div>
            </div>
            <div 
              v-if="computedSelectedRadio == 'SMS'"
              class="pl-btn-wrap justify-end is-mt-s">
                <div class="ml-auto">
                  <v-btn class="pl-btn ml-auto" @click="openFindSmsTemplate()">문자 템플릿</v-btn>
                </div>
              </div>
            <div
              v-if="computedSelectedRadio == 'KAKAO'"
              class="pl-form-inline"
            >
              <span class="pl-label">
                발송템플릿
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="SRCH_TMPL.TMPL_NM"
                  class="pl-form flex-grow-1"
                  placeholder="우측의 찾기 아이콘을 클릭 하십시오"
                  disabled
                ></v-text-field>
                <!-- 템플릿 삭제 버튼 -->
                <!-- <compo-tooltip-btn
                  TitleProp="템플릿 삭제"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 div-get"
                  TooltipPositionProp="bottom"
                  @btnClick="tmplDel()"
                  :DisabledProp="Object.keys(SRCH_TMPL).length == 0 ? true : false"
                ></compo-tooltip-btn> -->
                <!-- 찾기 버튼 -->
                <compo-tooltip-btn
                  TitleProp="알림톡 템플릿 선택하기"
                  ClassProp="pl-tooltip-btn flex-grow-0"
                  IconProp="pl-icon20 in-search"
                  TooltipPositionProp="bottom"
                  @btnClick="atalkTmpl()"
                ></compo-tooltip-btn>

                <!-- 알림톡 템플릿 dialog -->
                <v-dialog
                  v-model="dialogTemplate"
                  content-class="dialog-draggable is-lg"
                  hide-overlay>
                  <div class="draggable-area">drag area</div>
                  <compo-dialog
                    header-title="알림톡 템플릿"
                    @hide="mixin_hideDialog('Template')"
                    @submit="submitDialog('Template')"
                  >
                    <template slot="body">
                      <p>사용할 템플릿을 확인 하시고  <strong>[선택] 버튼을 클릭</strong> 하십시오</p>
                      <v-data-table
                        class="pl-grid is-mt-m"
                        :headers="headers"
                        :items="items"
                        fixed-header
                        item-key="index"
                        height="562px"
                        :items-per-page="ROW_PER_PAGE"
                        hide-default-footer
                        :page.sync="page"
                        @page-count="pageCount = $event"
                        no-data-text="등록된 데이터가 없습니다.">
                        <template v-slot:item.TMPL_IGI_NM="{ item }">
                          <span :class="`is-txt-${ displayStatus(item.TMPL_IGI_NM) }`">
                            {{ item.TMPL_IGI_NM }}
                          </span>
                        </template>
                        <template v-slot:item.TMPL_SELECT="{ item }">
                          <v-btn class="pl-btn is-sm" @click="selectedItem(item)" :disabled="item.TMPL_SELECT">선택</v-btn>
                        </template>
                      </v-data-table>
                    </template>
                  </compo-dialog>
                </v-dialog>
              </div>
            </div>
            <div 
              v-if="computedSelectedRadio == 'KAKAO'"
              class="pl-form-inline">
              <span class="pl-label">
                전환전송 여부
              </span>
              <div class="pl-desc">
                <v-checkbox
                  v-model="TRAN_SEND"
                  class="pl-check"
                  label="전환전송"
                ></v-checkbox>
                ※ 알림톡 발송 실패시 문자 메시지로 전환전송함
              </div>
            </div>
            <div
              v-if="computedSelectedRadio == 'KAKAO'"
              class="pl-form-inline"
            >
              <div class="pl-desc">
                <v-textarea
                  v-model="SRCH_TMPL.TMPL_CN"
                  class="pl-form is-noresize"
                  placeholder="템플릿 내용"
                  v-byte-counter="4000"
                  :disabled="computedSelectedRadio == 'SMS' ? false : true"
                  :spellcheck="false"
                />
              </div>
            </div>
            <div
              v-if="computedSelectedRadio == 'EMAIL'">
              <compo-send-email
                FILE_ATTACH_USE_YN="N"
                TO_EMAIL_USE_YN="N"
                SRVY_YN='Y'
                SNDNG_TYPE_CD='svy'
                SUBJECT="설문조사 진행을 위한 안내메일입니다."
                :RSVT_DT="IS_SEND_ATONCE ? '' : SEND_DATE.replace(/-/gi, '') + this.SEND_TIME.replace(/:/gi, '') + '00'"
                :EMAIL_CONTENT="EMAIL_TEMPLATE"
                :SEND_TRGT_LIST="SEND_TRGT_LIST"
                @sendEmailClose="sendEmailClose"
              />
            </div>
          </div>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('SendGuideSms')">취소</v-btn>
          <v-btn class="pl-btn" 
            @click="checkSendSms">발송하기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- 참여자 개별 추가 dialog -->
    <v-dialog
      v-model="dialogAddSomeone"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :header-title="SEL_SRVY_TRGT_ID == '' && SEL_CUST_PHN_NO == '' ? '참여자 개별 추가' : '참여자 수정'"
        @hide="[mixin_hideDialog('AddSomeone')]"
        @submit="submitDialog('AddSomeone')"
      >
        <template slot="body">
          <ul class="pl-list-dot is-no-border mt-0">
            <li>설문조사 참여 대상자를 개별로 추가합니다.</li>
            <li>참여자 정보를 입력한 후 <strong>[저장] 버튼을 클릭</strong>하십시오.</li>
          </ul>
          <div class="pl-form-inline-wrap vertical label-100 is-mt-m">
            <div class="pl-form-inline">
              <span class="pl-label">
                이름
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  placeholder="이름 입력"
                  v-model="NEW_TRGT_NM"
                ></v-text-field>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                전화번호
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form flex-grow-1"
                  v-model="NEW_TRGT_PHN_NO"
                  oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"
                  placeholder="전화번호 입력(“-” 제외하고 입력 하세요)"
                  @keyup="changeCustPhnNo"
                ></v-text-field>
                <v-btn class="pl-btn flex-grow-0"
                    @click="checkCustPhnNo"
                    :disabled="isPassCheckCustPhnNo"
                  >중복 체크</v-btn>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                이메일
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  v-model="NEW_TRGT_EMAIL"
                ></v-text-field>
              </div>
            </div>
            <template v-if="srvyExpsnAttrList.length > 0">
              <div 
                v-for="(expsn, idx) in srvyExpsnAttrList"
                :key="`expsn-${idx}`"
                class="pl-form-inline">
                <span class="pl-label">
                  {{expsn.EXPSN_ATTR_NM}}
                  <v-icon v-if="expsn.ESNTL_YN == 'Y'" class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    v-model="expsn.V_MODEL"
                  ></v-text-field>
                </div>
              </div>
            </template>
          </div>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="[mixin_hideDialog('AddSomeone')]">취소</v-btn>
          <v-btn
            v-if="SEL_SRVY_TRGT_ID == '' && SEL_CUST_PHN_NO == ''"
            class="pl-btn"
            @click="validateNewTrgt()"
            :disabled="stts_head === 'TERMIAT' ? true:false"
          >
            저장
          </v-btn>
          <v-btn
            v-if="SEL_SRVY_TRGT_ID != '' || SEL_CUST_PHN_NO != ''"
            class="pl-btn"
            @click="validateNewTrgt()"
            :disabled="stts_head === 'TERMIAT' ? true:false"
          >
            수정
          </v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- 질문 불러오기 dialog -->
    <SVY_M0200_DLG_TEMPLATE
      v-if="dialogOpenQuestionTemplate"
      :DataProp="{ SRVY_QITEM_GROUP_ID: SURVEYT_LIST[tab1GrpIdx].SRVY_QITEM_GROUP_ID }"
      @closeQuestionTemplate="closeQuestionTemplate"
      @reloadParentComp="reloadSurvey"
    ></SVY_M0200_DLG_TEMPLATE>
    <!-- 설문지 불러오기 dialog -->
    <SVY_M0200_DLG_LOAD_SVY
      v-if="dialogOpenLoadSvy"
      :DataProp="{SRVY_ID: SRVY_NM}"
      @closeLoadSvy="closeLoadSvy"
      @reloadParentComp="reloadSurvey"
    />
    <!--문자 템플릿 Dialog-->
    <CompoFindSmsTemplate
      v-if="dialogOpenMsgTemplate"
      :SMS_TMPL_MODE="SMS_TMPL_MODE"
      @applySmsTemplate="applySmsTemplate"
      @closeFindSmsTemplate="closeFindSmsTemplate"
    />
    <!-- 설문 상태 변경 다이얼로그(승인요청)-->
    <CompoSvyUpdateStts
      v-if="dialogOpenSttsUpdate"
      :DataProp="{SRVY_ID: SRVY_NM, STTS_CD: UPDATE_STTS_CD}"
      @updateParent="btnSelectList"
      @closeDialog="closeSttsUpdate"
    />
    
    <!-- 제외조건 적용 dialog -->
    <v-dialog
      v-model="dialogExlCond"
      content-class="dialog-draggable is-lg"
      fullscreen
      hide-overlay
      :retain-focus="false">
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :headerTitle="'제외조건 적용하기'"
        @hide="mixin_hideDialog('ExlCond')">
        <template 
          v-if="dialogTab=='exlCond'"
          slot="body">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              제외조건을 검색하여 적용할 제외조건을 선택 후 다음단계로 이동하세요.
            </div>
          </div>
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                센터구분
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="SRCH_DEPT_LIST"
                  placeholder="선택하세요"
                  v-model="SRCH_DEPT_ID"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                제외조건 구분
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="this.mixin_common_code_get(this.common_code, 'EXL_COND_TY', '전체')"
                  placeholder="선택하세요"
                  v-model="SRCH_EXL_COND_SE_CD"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                제외조건
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="this.mixin_common_code_get(this.common_code, 'EXL_COND', '전체')"
                  placeholder="선택하세요"
                  v-model="SRCH_EXL_COND_CD"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                제외조건 값
              </span>
              <div class="pl-desc">
                <!-- 
                  텍스트 입력
                  인입번호 / 상담메모 / 접수채널 / 접수자명 / 개인정보수집동의여부
                -->
                <v-text-field
                  v-if="SRCH_EXL_COND_SE_CD=='CUST_PHN_NO' || SRCH_EXL_COND_SE_CD=='CUTT_CN' || SRCH_EXL_COND_SE_CD=='USER_NM'"
                  class="pl-form is-lg"
                  placeholder="검색어 입력"
                  v-model="SRCH_EXL_COND_CN"
                  @keydown.enter="getGridList(false)"
                />
                <!-- 상담유형 처리 -->
                 <v-text-field
                  v-else-if="(SRCH_EXL_COND_SE_CD=='CNSLT_DIV_CD_1' || SRCH_EXL_COND_SE_CD=='CNSLT_DIV_CD_2' || SRCH_EXL_COND_SE_CD=='CNSLT_DIV_CD_3') 
                    && (SRCH_EXL_COND_CD=='col IN (\'str\')'||SRCH_EXL_COND_CD=='col NOT IN (\'str\')'||SRCH_EXL_COND_CD=='col ILIKE (\'%str%\')')"
                  class="pl-form is-lg"
                  placeholder="검색어 입력"
                  v-model="SRCH_EXL_COND_CN"
                  @keydown.enter="getGridList(false)"
                />
                <template
                  v-else-if="SRCH_EXL_COND_SE_CD=='CNSLT_DIV_CD_1' || SRCH_EXL_COND_SE_CD=='CNSLT_DIV_CD_2' || SRCH_EXL_COND_SE_CD=='CNSLT_DIV_CD_3'"
                >
                  <compo-tooltip-btn
                    TitleProp="조건 선택하기"
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 parts-check"
                    TooltipPositionProp="bottom"
                    @btnClick="btnCuttType('SRCH')"
                  ></compo-tooltip-btn>
                  <v-text-field
                    class="pl-form"
                    placeholder="검색어 입력"
                    v-model="SRCH_EXL_COND_CN_CUTT_TYPE.ROW"
                    readonly
                  />
                  <compo-tooltip-btn
                    :TitleProp="SRCH_EXL_COND_CN_CUTT_TYPE.TEXT"
                    ClassProp="pl-tooltip-btn flex-grow-0"
                    IconProp="pl-icon20 paste-board"
                    TooltipPositionProp="bottom"
                  ></compo-tooltip-btn>
                </template>
                <!-- 
                  접수채널 / 처리방법
                -->
                <v-select
                  v-else
                  class="pl-form is-lg"
                  :items="SRCH_EXL_COND_SE_CD=='DRWI_SE_CD'? DRWI_SE_CD_LIST
                    : (SRCH_EXL_COND_SE_CD=='PRVC_CLCT_AGRE_YN' ? [{text:'전체',value:''},{text:'Y',value:'Y'}, {text:'N',value:'N'}] 
                    : (SRCH_EXL_COND_SE_CD=='RCPT_CHN_CD' ? RCPT_CHN_CD_LIST : PRCS_CHN_CD_LIST))"
                  placeholder="선택하세요"
                  v-model="SRCH_EXL_COND_CN"
                ></v-select>
              </div>
            </div>
          </div>
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                사용여부
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form "
                  :items="this.mixin_common_code_get(this.common_code, 'USE_WT', '전체')"
                  v-model="SRCH_USE_YN"
                  placeholder="선택하세요"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                삭제여부
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form "
                  :items="this.mixin_common_code_get(this.common_code, 'USE_WT', '전체')"
                  v-model="SRCH_DEL_YN"
                  placeholder="선택하세요"
                ></v-select>
              </div>
            </div>
            <v-btn class="pl-btn is-icon" @click="getGridList(false)">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
          </div>
          <v-data-table
            class="pl-grid has-control mt-2"
            :headers="EXL_COND_HEADER_LIST"
            :items="EXL_COND_LIST"
            fixed-header
            show-select
            item-key="ROW_NUMBER"
            height="535px"
            :items-per-page="EXL_COND_LIST.length"
            :item-class="isExlCondActiveRow"
            hide-default-footer
            page.sync="1"
            @page-count="pageCount = $event"
            @click:row="rowExlCondSelect"
            v-model="SEL_EXL_COND_LIST"
            no-data-text="등록된 데이터가 없습니다."
          >
            <template v-slot:item.EXL_COND_TEXT="{ item }">
              <v-tooltip 
                v-if="item.EXL_COND_CD == 'col IN (\'str\')'||item.EXL_COND_CD == 'col NOT IN (\'str\')'||item.EXL_COND_CD == 'col ILIKE (\'%str%\')'"
                content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span
                    v-bind="attrs"
                    v-on="on">
                  {{ item.EXL_COND_TEXT }}</span>
                </template>
                <span
                  v-html="item.EXL_COND_CN"
                >
                </span>
              </v-tooltip>
              <v-tooltip 
                v-else-if="item.EXL_COND_SE_CD == 'CNSLT_DIV_CD_1'||item.EXL_COND_SE_CD == 'CNSLT_DIV_CD_2'||item.EXL_COND_SE_CD == 'CNSLT_DIV_CD_3'"
                content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span
                    v-bind="attrs"
                    v-on="on">
                  {{ item.EXL_COND_TEXT }}</span>
                </template>
                <span
                  v-html="item.CUTT_TYPE_PATH"
                >
                </span>
              </v-tooltip>
              <span
                v-else
              >
                {{ item.EXL_COND_TEXT }}
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
              :total-visible="7">
            </v-pagination>

            <span class="pl-pager-period">
              보기 {{ mixin_getPagePeriod(EXL_COND_LIST, page) }} / {{ EXL_COND_LIST.length }}
              <compo-tooltip-btn
                TitleProp="다음 검색"
                ClassProp="pl-tooltip-btn is-line"
                IconProp="pl-icon20 arrow-next-paging"
                TooltipPositionProp="bottom"
                :DisabledProp = "nextDisabled"
                @btnClick="getGridList(true)"
              ></compo-tooltip-btn>
            </span>
          </div>
        </template>
        <template 
          v-else-if="dialogTab=='exlTrgt'"
          slot="body">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              제외 대상자를 선택한 후 [적용]버튼을 눌러 대상자를 확정해주세요<br>
              적용 후에는 즉시 제외이력에 등록되고 다시 대상자를 되돌릴 수 없습니다
            </div>
          </div>
          <v-data-table
            class="pl-grid has-control mt-2"
            :headers="EXL_COND_TRGT_HEADER_LIST"
            :items="EXL_COND_TRGT_LIST"
            fixed-header
            show-select
            item-key="ROW_NUMBER"
            height="258px"
            :items-per-page="ROW_PER_PAGE_2"
            :item-class="isExlCondTrgtActiveRow"
            hide-default-footer
            disable-select-all="true"
            :page.sync="page2"
            @page-count="pageCount2 = $event"
            @click:row="rowExlCondTrgtSelect"
            v-model="SEL_EXL_COND_TRGT_LIST"
            no-data-text="등록된 데이터가 없습니다."
            :key="dialogTab"
            :search="SRCH_EXL_COND_TRGT_LIST"
          >
            <template v-slot:header.data-table-select >
              <v-checkbox 
                class="pl-check is-chk-center"
                v-model="isSelectedAllTrgt2" 
                @click="toggleSelectAllTrgt('2')"
              ></v-checkbox>
            </template>
            <template v-slot:item.REASON="{ item }">
              <div
                v-html="sanitizeContent(item.REASON)"
              >
              </div>
            </template> 
            <template v-slot:item.CNSLT_DIV_CD_1="{ item }">
              {{ mixin_convertListCdNm(CUTT_TYPE_LIST_1,item.CNSLT_DIV_CD_1) }}
            </template>
            <template v-slot:item.CNSLT_DIV_CD_2="{ item }">
              {{ mixin_convertListCdNm(CUTT_TYPE_LIST_2,item.CNSLT_DIV_CD_2) }}
            </template>
            <template v-slot:item.CNSLT_DIV_CD_3="{ item }">
              {{ mixin_convertListCdNm(CUTT_TYPE_LIST_3,item.CNSLT_DIV_CD_3) }}
            </template>
            <template v-slot:item.RCPT_CHN_CD="{ item }">
              {{ mixin_convertListCdNm(RCPT_CHN_CD_LIST,item.RCPT_CHN_CD) }}
            </template>
            <template v-slot:item.PRCS_CHN_CD="{ item }">
              {{ mixin_convertListCdNm(PRCS_CHN_CD_LIST,item.PRCS_CHN_CD) }}
            </template>
          </v-data-table>
          <div class="pl-pager">
            <div class="pl-pager-row">
              <span>페이지당 항목 수</span>
              <v-select
                class="pl-form"
                :value="ROW_PER_PAGE_2"
                :items="perPage"
                :item-text="toString(ROW_PER_PAGE_2)"
                @change="ROW_PER_PAGE_2 = parseInt($event, 10);"
              ></v-select>
            </div>
            <v-pagination
              v-model="page2"
              :length="pageCount2"
              circle
              :total-visible="10">
            </v-pagination>

            <span class="pl-pager-period">
              <!-- 보기 {{ mixin_getPagePeriod(gridDataText, page) }} / {{ gridDataText.length }}
              <v-btn
                class="pl-btn is-sub"
                :disabled = "nextDisabled"
                @click="tab2SelectList(true)"
              >다음 검색
              </v-btn> -->
              <v-text-field
                class="pl-form ml-auto"
                placeholder="검색어 입력"
                v-model="SRCH_EXL_COND_TRGT_LIST"
              />
            </span>
          </div>
          <div class="d-flex justify-center align-center is-mt-m" style="gap: 14px">
            <!-- arrow down 버튼 -->
            <compo-tooltip-btn
              TitleProp="적용하기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon30 is-arrow-down"
              TooltipPositionProp="bottom"
              @btnClick="stng_btn()"
              :DisabledProp="SEL_EXL_COND_TRGT_LIST.length == 0 ? true : false"
            ></compo-tooltip-btn>
            <!-- arrow up 버튼 -->
            <compo-tooltip-btn
              TitleProp="적용해제"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon30 is-arrow-up"
              TooltipPositionProp="bottom"
              @btnClick="un_stng_btn()"
              :DisabledProp="SEL_EXL_COND_SET_TRGT_LIST.length == 0 ? true : false"
            ></compo-tooltip-btn>
          </div>
          <v-data-table
            class="pl-grid has-control mt-2"
            :headers="EXL_COND_TRGT_HEADER_LIST"
            :items="EXL_COND_SET_TRGT_LIST"
            fixed-header
            show-select
            item-key="ROW_NUMBER"
            height="258px"
            :items-per-page="ROW_PER_PAGE_3"
            :item-class="isExlCondSetTrgtActiveRow"
            disable-select-all="true"
            hide-default-footer
            :page.sync="page3"
            @page-count="pageCount3 = $event"
            @click:row="rowExlCondSetTrgtSelect"
            v-model="SEL_EXL_COND_SET_TRGT_LIST"
            no-data-text="등록된 데이터가 없습니다."
            :key="dialogTab"
            :search="SRCH_EXL_COND_SET_TRGT_LIST"
          >
            <template v-slot:header.data-table-select >
              <v-checkbox 
                class="pl-check is-chk-center"
                v-model="isSelectedAllTrgt3" 
                @click="toggleSelectAllTrgt('3')"
              ></v-checkbox>
            </template>
            <template v-slot:item.REASON="{ item }">
              <div
                v-html="sanitizeContent(item.REASON)"
              >
              </div>
            </template> 
            <template v-slot:item.CNSLT_DIV_CD_1="{ item }">
              {{ mixin_convertListCdNm(CUTT_TYPE_LIST_1,item.CNSLT_DIV_CD_1) }}
            </template>
            <template v-slot:item.CNSLT_DIV_CD_2="{ item }">
              {{ mixin_convertListCdNm(CUTT_TYPE_LIST_2,item.CNSLT_DIV_CD_2) }}
            </template>
            <template v-slot:item.CNSLT_DIV_CD_3="{ item }">
              {{ mixin_convertListCdNm(CUTT_TYPE_LIST_3,item.CNSLT_DIV_CD_3) }}
            </template>
            <template v-slot:item.RCPT_CHN_CD="{ item }">
              {{ mixin_convertListCdNm(RCPT_CHN_CD_LIST,item.RCPT_CHN_CD) }}
            </template>
            <template v-slot:item.PRCS_CHN_CD="{ item }">
              {{ mixin_convertListCdNm(PRCS_CHN_CD_LIST,item.PRCS_CHN_CD) }}
            </template>
          </v-data-table>
          <div class="pl-pager">
            <div class="pl-pager-row">
              <span>페이지당 항목 수</span>
              <v-select
                class="pl-form"
                :value="ROW_PER_PAGE_3"
                :items="perPage"
                :item-text="toString(ROW_PER_PAGE_3)"
                @change="ROW_PER_PAGE_3 = parseInt($event, 10);"
              ></v-select>
            </div>
            <v-pagination
              v-model="page3"
              :length="pageCount3"
              circle
              :total-visible="10">
            </v-pagination>

            <span class="pl-pager-period">
              <!-- 보기 {{ mixin_getPagePeriod(gridDataText, page) }} / {{ gridDataText.length }}
              <v-btn
                class="pl-btn is-sub"
                :disabled = "nextDisabled"
                @click="tab2SelectList(true)"
              >다음 검색
              </v-btn> -->
              <v-text-field
                class="pl-form ml-auto"
                placeholder="검색어 입력"
                v-model="SRCH_EXL_COND_SET_TRGT_LIST"
              />
            </span>
          </div>
        </template>
        <template slot="footer">
          <span class="pl-counter">선택된 제외조건 <em class="pl-1">({{ SEL_EXL_COND_LIST.length }})</em> 건 / 제외 대상 <em class="pl-1">({{ EXL_COND_TRGT_LIST.length }})</em> 명 / 임의 적용 대상 <em class="pl-1">({{ EXL_COND_SET_TRGT_LIST.length }})</em> 명</span>
          <v-btn v-if="dialogTab=='exlCond'" class="pl-btn is-sub ml-2" @click="mixin_hideDialog('ExlCond')">닫기</v-btn>
          <v-btn v-else class="pl-btn is-sub ml-2" @click="brforeProc()">이전</v-btn>
          <v-btn v-if="dialogTab=='exlCond'" class="pl-btn" @click="nextProc()">다음</v-btn>
          <v-btn v-else class="pl-btn type-exl" :disabled="EXL_COND_SET_TRGT_LIST.length==0" @click="nextProc()">적용</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    
    <!-- 상담유형선택 dialog -->
    <v-dialog
      v-model="dialogCuttType"
      content-class="dialog-draggable is-lg"
      fullscreen
      hide-overlay
      :retain-focus="false">
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :headerTitle="'상담유형 선택'"
        @hide="mixin_hideDialog('CuttType')">
        <template
          v-if="CUTT_TYPE_MODE=='SRCH'"
          slot="body">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                검색
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  placeholder="검색어 입력"
                  v-model="SRCH_CUTT_TYPE"
                />
              </div>
            </div>
            <div class="pl-form-inline ml-auto">
              <span class="pl-label">
                {{ srchSelectedCuttTypeData.length+' / '+srchGridCuttTypeItems.length }}
              </span>
            </div>
          </div>
          <span
            v-if="LOADING"
            class="mt-2"
          >
            조회중입니다{{ dots }}
          </span>
          <v-data-table
            v-else
            class="pl-grid has-control is-rowspan mt-2"
            show-select
            :headers="gridCuttTypeHeaders"
            :items="srchGridCuttTypeItems"
            fixed-header
            item-key="CUTT_TYPE_ID"
            height="665px"
            :items-per-page="srchGridCuttTypeItems.length"
            @click:row="rowCuttTypeSelect"
            :item-class="isCuttTypeActiveRow"
            hide-default-footer
            page.sync="1"
            @page-count="pageCount = $event"
            no-data-text="등록된 데이터가 없습니다."
            v-model="srchSelectedCuttTypeData"
            :search="SRCH_CUTT_TYPE"
          >
          </v-data-table>
        </template>
        <template
          v-else
          slot="body">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                검색
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  placeholder="검색어 입력"
                  v-model="SRCH_CUTT_TYPE"
                />
              </div>
            </div>
            <div class="pl-form-inline ml-auto">
              <span class="pl-label">
                {{ selectedCuttTypeData.length+' / '+gridCuttTypeItems.length }}
              </span>
            </div>
          </div>
          <span
            v-if="LOADING"
            class="mt-2"
          >
            조회중입니다{{ dots }}
          </span>
          <v-data-table
            v-else
            class="pl-grid has-control is-rowspan mt-2"
            show-select
            :headers="gridCuttTypeHeaders"
            :items="gridCuttTypeItems"
            fixed-header
            item-key="CUTT_TYPE_ID"
            height="665px"
            :items-per-page="gridCuttTypeItems.length"
            @click:row="rowCuttTypeSelect"
            :item-class="isCuttTypeActiveRow"
            hide-default-footer
            page.sync="1"
            @page-count="pageCount = $event"
            no-data-text="등록된 데이터가 없습니다."
            v-model="selectedCuttTypeData"
            :search="SRCH_CUTT_TYPE"
          >
          </v-data-table>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('CuttType')">닫기</v-btn>
          <v-btn class="pl-btn" @click="setCuttType(CUTT_TYPE_MODE)">적용</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import SVY_PREVIEW from '@/views/page/SVY_PREVIEW.vue';
import SVY_M0200_DLG_TEMPLATE from '@/views/page/SVY_M0200_DLG_TEMPLATE.vue';
import SVY_M0200_DLG_LOAD_SVY from '@/views/page/SVY_M0200_DLG_LOAD_SVY.vue';
import CompoSvyUpdateStts from '@/components/svy/CompoSvyUpdateStts.vue';
import CompoSvyQitemDetail from '@/components/svy/CompoSvyQitemDetail';
import CompoFindSmsTemplate from '@/components/CompoFindSmsTemplate';

import { mapGetters } from "vuex";
import axios from "axios";
import { eventBus } from "@/store/eventBus.js";
// import vue2Dropzone from "vue2-dropzone";
// import DialogVueDropzone from "@/components/VueDropzone"
// import "vue2-dropzone/dist/vue2Dropzone.min.css";
export default {
  name: "MENU_SVY_M0200", //name은 'MENU_' + 파일명 조합
  components: {
    // vueDropzone: vue2Dropzone,
    // DialogVueDropzone,
    SVY_PREVIEW,
    SVY_M0200_DLG_TEMPLATE,
    SVY_M0200_DLG_LOAD_SVY,
    CompoSvyQitemDetail,
    CompoFindSmsTemplate,
    CompoSvyUpdateStts,
  },
  data() {
    return {
      isDevelopment: process.env.VUE_APP_ENV === 'local' || process.env.VUE_APP_ENV === 'devserver',
      SITE: process.env.VUE_APP_SITE ? process.env.VUE_APP_SITE : '',
      uploadedFiles: [],
      tab: null,
      txtTestId: '', //지워야함.

      // 안내문자 발송 dialog
      dialogSendGuideSms: false,
      // 참여자 개별추가 dialog
      dialogAddSomeone: false,
      //템플릿 선택 dialog
      dialogTemplate: false,
      // 질문 불러오기 dialog
      dialogOpenQuestionTemplate: false,
      // 설문지 불러오기 dialog
      dialogOpenLoadSvy: false,
      expanded: false,
      


      // top search
      srvyYrItems: [],
      srvyNmItems: [],

      gHdData:{},
      gQuData:{},
      // gBfQuData:{},
      gQuChcData:{},
      //survey list
      SURVEYT_LIST: [],
      //다음 블록 정보
      MVMN_SRVY_QITEM_GROUP_LIST: [],
      // itemIndex: 1,
      // questionIndex: 1,
      checkedItems: [],
      date: '',
      timeStep2: '05:50',
      timeAmpm: '오후',

      //목록형 리스트
      ANSWER_LIST: [],

      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      }, //그리드 페이지속성정의
      pagination2: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      }, //그리드 페이지속성정의
      pagination3: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      }, //그리드 페이지속성정의
      nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
      //참여자 설정
      page: 1,
      page2: 1,
      page3: 1,
      pageCount: 0,
      pageCount2: 0,
      pageCount3: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
      ROW_PER_PAGE_2: 15,
      ROW_PER_PAGE_3: 15,
      pageTrgt: 1,
      pageCountTrgt: 0,
      ROW_PER_PAGE_TRGT: 15,
      gridTotalCnt: 0,
      excelTemplateHeaders: [
        { text: '이름',           value: 'CUST_NM',             align: 'center',          width: '120px' },
        { text: '전화번호',       value: 'CUST_PHN_NO',         align: 'center',          width: '200px' },
        { text: '이메일',         value: 'EML',                 align: 'left',            width: '100%' },
      ],
      //설문 참여자 확장 항목
      srvyExpsnAttrList: [],
      //설문참여 제외자 목록
      EXCLUSION_TARGET_LIST: [],
      //설문 참여자 전화번호 중복 체크 여부.
      isPassCheckCustPhnNo: false,

      isSelectedAllTrgt: false,
      isSelectedAllTrgt2: false,
      isSelectedAllTrgt3: false,
      gridDataHeaders: [],
      gridDataText: [],
      gridSelectedData: [],// 그리드 체크박스 값
      isLoadingGridData: false,
      //응답설정
      radioGroup: [
        { text: "허용", value: 'Y'},
        { text: "허용하지 않음", value: 'N'},
      ],
      radioGroup2: [
        { text: "사용", value: 'Y'},
        { text: "사용하지 않음", value: 'N'},
      ],
      radioGroup3: [
        { text: "한화면에 하나의 문항", },
        { text: "한화면에 전체 문항", },
      ],
      dtSrvyBgngDt: '',
      dtSrvyEndDt: '',

      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
          REG : {alertDialogToggle: true, msg: '저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.setQuSaveYes, callNo: this.closeMsg}
          , MOD : {alertDialogToggle: true, msg: '수정하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.setQuSaveYes, callNo: this.closeMsg}
          , MOD_HD : {alertDialogToggle: true, msg: '헤더내용을 수정하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.setHdSaveYes, callNo: this.closeMsg}
          , DEL : {alertDialogToggle: true, msg: '삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.delYes, callNo: this.closeMsg}
          , REG_TAB2 : {alertDialogToggle: true, msg: '업로드된 데이터를 저장하시겠습니까?<br>(기존 데이터는 삭제됩니다.)', iconClass: 'is-info', type: 'confirm', callYes: this.checkUploadData, callNo: this.closeMsg}
          , REG_TAB3 : {alertDialogToggle: true, msg: '응답 설정내용을 저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.setSettingData, callNo: this.closeMsg}
          , DEL_IMG : {alertDialogToggle: true, msg: '이미지를 삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.delImg, callNo: this.closeMsg}
          , REG_NEW_TRGT : {alertDialogToggle: true, msg: '참여자를 추가하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.strgNewTrgt, callNo: this.closeMsg}
          , MODI_NEW_TRGT : {alertDialogToggle: true, msg: '참여자를 수정하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.strgNewTrgt, callNo: this.closeMsg}
          , DEL_TRGT : {alertDialogToggle: true, msg: '선택한 참여자를 삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.delTrgt, callNo: this.closeMsg}
          , NO_POSSIBLE_COPY: {alertDialogToggle: true, msg: '이미 복사된 설문입니다. 설문지를 삭제하고 다시 복사하시겠습니까? \'예\' 클릭 시 현재 설문지가 삭제됩니다.', iconClass: 'is-info', type: 'confirm', callYes: this.deleteForceConfirm, callNo: this.closeMsg}
          , DELETE_FORCE_SRVY: {alertDialogToggle: true, msg: '정말 설문지를 삭제하시겠습니까?삭제 후 복구할 수 없습니다.', iconClass: 'is-info', type: 'confirm', callYes: this.deleteForceSrvyItem, callNo: this.closeMsg}
          
        },
        ALERT : {
          DEL_SUCCESS : {alertDialogToggle: true, msg: '삭제가 완료되었습니다.', iconClass: 'is-info', type: 'default'}
          , REG_SUCCESS : {alertDialogToggle: true, msg: '저장이 완료되었습니다.', iconClass: 'is-info', type: 'default'}
          , MOD_SUCCESS : {alertDialogToggle: true, msg: '수정이 완료되었습니다.', iconClass: 'is-info', type: 'default'}
          , CLS_SUCCESS : {alertDialogToggle: true, msg: '완료되었습니다.', iconClass: 'is-info', type: 'default'}
          , CAN_SUCCESS : {alertDialogToggle: true, msg: '취소되었습니다.', iconClass: 'is-info', type: 'default'}
          , SMS_SUCCESS : {alertDialogToggle: true, msg: '발송되었습니다.', iconClass: 'is-info', type: 'default'}

          , ETC1_WARNING : {alertDialogToggle: true, msg: '설문조사명을 선택해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC2_WARNING : {alertDialogToggle: true, msg: '조회를 먼저 해주세요.', iconClass: 'is-info', type: 'default'}
          , ETC3_WARNING : {alertDialogToggle: true, msg: '블록명을 입력해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC4_WARNING : {alertDialogToggle: true, msg: '블록명을 먼저 저장해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC5_WARNING : {alertDialogToggle: true, msg: '등록된 설문항목이 존재하여 삭제할 수 없습니다.', iconClass: 'is-info', type: 'default'}
          // , ETC6_WARNING : {alertDialogToggle: true, msg: '질문 제목을 입력해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC7_WARNING : {alertDialogToggle: true, msg: '보기를 추가해 주세요.', iconClass: 'is-info', type: 'default'}
          // , ETC8_WARNING : {alertDialogToggle: true, msg: '선택 허용수를 선택해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC9_WARNING : {alertDialogToggle: true, msg: '날짜를 입력해 주세요.', iconClass: 'is-info', type: 'default'}
          // , ETC10_WARNING : {alertDialogToggle: true, msg: '보기 문항을 입력해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC11_WARNING : {alertDialogToggle: true, msg: '선택 허용수 만큼 보기항목을 추가해 주세요.', iconClass: 'is-info', type: 'default'}

          , ETC12_WARNING : {alertDialogToggle: true, msg: '데이터를 업로드 해주세요.', iconClass: 'is-info', type: 'default'}
          , ETC13_WARNING : {alertDialogToggle: true, msg: '', iconClass: 'is-info', type: 'default'}
          , ETC14_WARNING : {alertDialogToggle: true, msg: '', iconClass: 'is-info', type: 'default'}
          , ETC15_WARNING : {alertDialogToggle: true, msg: '', iconClass: 'is-info', type: 'default'}
          , ETC16_WARNING : {alertDialogToggle: true, msg: '대상자 지정이 되어있는 경우만 업로드 가능합니다.', iconClass: 'is-info', type: 'default'}
          , ETC17_WARNING : {alertDialogToggle: true, msg: '대상자 지정이 되어있습니다.<br>대상자를 업로드 해주세요.', iconClass: 'is-info', type: 'default'}
          , ETC18_WARNING : {alertDialogToggle: true, msg: '진행상태가 준비중, 승인반려인 항목만 가능합니다.', iconClass: 'is-info', type: 'default'}
          , ETC19_WARNING : {alertDialogToggle: true, msg: '진행상태가 게시완료 상태인 항목만 취소가 가능합니다.', iconClass: 'is-info', type: 'default'}
          , ETC20_WARNING : {alertDialogToggle: true, msg: '설문항목이 등록되어있지 않습니다.', iconClass: 'is-info', type: 'default'}

          , ETC21_WARNING : {alertDialogToggle: true, msg: '1개의 이미지 파일만 선택 가능합니다.', iconClass: 'is-info', type: 'default'}
          , ETC22_WARNING : {alertDialogToggle: true, msg: '지원하지 않는 파일 형식입니다.<br>(jpeg, jpg, png 만 가능)', iconClass: 'is-info', type: 'default'}
          , ETC23_WARNING : {alertDialogToggle: true, msg: '파일 크기가 허용 범위를 초과합니다.(최대5MB)', iconClass: 'is-info', type: 'default'}

          , ETC24_WARNING : {alertDialogToggle: true, msg: '', iconClass: 'is-info', type: 'default'}
          , ETC25_WARNING : {alertDialogToggle: true, msg: '발송할 항목을 선택해 주세요.', iconClass: 'is-info', type: 'default'}
          , ETC26_WARNING : {alertDialogToggle: true, msg: '발송할 항목이 없습니다.', iconClass: 'is-info', type: 'default'}
          , ETC27_WARNING : {alertDialogToggle: true, msg: '진행상태가 게시완료 또는 진행중인 건만 발송이 가능합니다.', iconClass: 'is-info', type: 'default'}
          , ETC29_WARNING : {alertDialogToggle: true, msg: '설문참여 URL이 없습니다.', iconClass: 'is-info', type: 'default'}
          , ETC30_WARNING : {alertDialogToggle: true, msg: '진행상태가 승인중인 항목만 가능합니다.', iconClass: 'is-info', type: 'default'}
          , NO_TMPL : {alertDialogToggle: true, msg: '템플릿 등록 후 진행해 주시기 바랍니다.', iconClass: 'is-caution', type: 'default'}
          , SEND_SUCCESS : {alertDialogToggle: true, msg: '전송에 성공하였습니다.', iconClass: 'is-info', type: 'default'}
          , SEND_FAIL : {alertDialogToggle: true, msg: '전송에 실패하였습니다.', iconClass: 'is-caution', type: 'default'}
          , VALID_NEW_TRGT : {alertDialogToggle: true, msg: '이름과 전화번호는 필수입니다.', iconClass: 'is-caution', type: 'default'}
          , CMPL_TRGT_ADD : {alertDialogToggle: true, msg: '참여자가 추가되었습니다<br>상단의 [저장]버튼을 눌러 참여자 추가를 완료해주세요', iconClass: 'is-info', type: 'default'}
          , CMPL_TRGT_MODI : {alertDialogToggle: true, msg: '참여자가 수정되었습니다<br>상단의 [저장]버튼을 눌러 참여자 추가를 완료해주세요', iconClass: 'is-info', type: 'default'}
          , TRGT_DEL_SUCCESS : {alertDialogToggle: true, msg: '참여자가 삭제되었습니다', iconClass: 'is-info', type: 'default'}
          , SELECT_QITEM: {alertDialogToggle: true, msg: '질문을 선택해 주세요.', iconClass: 'is-info', type: 'default'}
          , SAVE_QITEM: {alertDialogToggle: true, msg: '질문을 먼저 저장해 주세요.', iconClass: 'is-info', type: 'default'}
          , DUP_CUST_PHN_NO: {alertDialogToggle: true, msg: '중복된 전화번호입니다.', iconClass: 'is-caution', type: 'default'}
          , DUP_CHECK: {alertDialogToggle: true, msg: '전화번호 중복체크를 해주세요.', iconClass: 'is-caution', type: 'default'}
          , EXCLUSION_CUST_PHN_NO: {alertDialogToggle: true, msg: '설문참여 제외 전화번호입니다. 설문참여 제외 관리 메뉴에서 확인 바랍니다.', iconClass: 'is-caution', type: 'default'}
          , PASS_DUP_CHECK: {alertDialogToggle: true, msg: '등록 가능한 전화번호입니다.', iconClass: 'is-info', type: 'default'}
          , PREPARING: {alertDialogToggle: true, msg: '준비중입니다.', iconClass: 'is-info', type: 'default'}
          
          
        },
        TOAST : {
          SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 },
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        }
      },

      common_code: [],
      searchFlag: false,
      hdType: '',
      bfIndex: -1,
      // bfqIndex: -1,
      qIdx: -1,
      gTrgtDsgnYn: '', //대상지정여부
      tab1GrpIdx: -1,    //저장전 선택되어있던 그룹 인덱스
      tab1QueIdx: -1,    //저장전 선택되어있던 항목 인덱스
      tab1QueItem: {},   //저장전 선택되어있던 항목 아이템
      tabGrpCnt: 0,     //그룹갯수
      stts_head: '',

      // 첨부파일, 첨부파일업로드 팝업 변수
      // dialogVueDropzone: false,
      // dropZoneParam    : {},

      //el v-model 변수
      SRVY_YR: '',
      SRVY_SE_CD: '',
      STTS_CD: '',
      SRVY_NM: '',
      pData: {},
      FILE_GROUP_KEY : '',
      ASP_NEWCUST_KEY: '1',
      blockTitle: '',
      SBMSN_END_MSG: '',
      PSNAL_LMT_SBMSN_STNG_YN: '',
      CLCT_AGRE_USE_YN: '',
      SRVY_YMD_INDCT_YN: false,
      SRVY_URL: '',
      SRVY_URL_PREVIEW: '',
      PSTG_YN: false,
      BY_PASS: false,
      
      //설문참여자 저장, 발송 전 체크된 제외자 목록
      CHECKED_EXCLUSION_TARGET_LIST: [],

      SEND_INTERVAL_PEOPLE_LIST : [1000, 2000, 3000, 5000, 7500, 10000],
      SEND_INTERVAL_MIN_LIST : [5, 10, 15, 20, 25, 30, 35, 40, 45, 60, 55, 60],
      SEND_INTERVAL_PEOPLE : 2000,
      SEND_INTERVAL_MIN : 5,
      // 발송자 번호 선택 상자
      CUSTCO_TEL_LIST : [],
      // 발송자 번호
      CALLBACK_NUMBER : '',
      //발송자 제외여부
      IS_SEND_SEND: '',
      //참여자 제외여부
      IS_SEND_PART:'',
      // 발송일자
      SEND_DATE : "",
      // 발송시간
      SEND_TIME : "",
      //발송 제목
      SEND_TTL : "",
      // 발송 메시지
      SEND_MESSAGE : "",

      // 즉시 발송 체크 여부
      IS_SEND_ATONCE : false,
      TRAN_SEND: false, // 전환전송 여부

      //문자 발송 유형
      computedSelectedRadio:'SMS',
      radioGroup: [
        { text: "문자", icon: 'is-sms',  value: 'SMS'},
        { text: "카카오톡", icon: 'is-kakao', value: 'KAKAO'},
        { text: "이메일", icon: 'is-email', value: 'EMAIL'},
      ],
      //이메일 발송 대상 목록 - 발송자 제외, 참여자 제외 적용된 발송 대상자 목록.
      SEND_TRGT_LIST: [],
      //이메일 템플릿
      EMAIL_TEMPLATE: '',
      //고객사명
      CUSTCO_NM: '',

      TMPL_CD:'',               //템플릿 코드
      DSPTCH_PRF_KEY:'',        //알림톡 발신프로필키
      EPSZ_INDCT_MPIT_INFO:'',  //강조표기형 제목
      REPLACE_TMPL_CN:'',       //전환전송 메시지
      callbackNumber: '',       //고객사 대표번호
      envSrvyDsptchNoTp: 'DEFAULT', //설문 발신번호 유형

      NEW_TRGT_NM: '',          //추가 참여자 이름
      NEW_TRGT_PHN_NO: '',      //추가 참여자 전화번호
      NEW_TRGT_EMAIL: '',       //추가 참여자 이메일

      SEL_ROW_NUMBER: '',         //선택 참여자의 ROW_NUMBER, 수정 시 사용.
      SEL_SRVY_TRGT_ID: '',         //선택 참여자의 고유ID
      SEL_CUST_PHN_NO: '',          //선택 참여자의 전화번호 - 저장되지 않은 고객의 정보를 관리하기 위해 필요

      SRCH_TMPL:{},             //선택템플릿
      headers: [
        { text: '번호', value: 'ROWNUM', align: 'center', width: '80px', sortable: false },
        { text: '템플릿 명', value: 'TMPL_NM', align: '', sortable: false },
        { text: '템플릿 타입', value: 'TMPL_MSG_NM', width: '120px', sortable: false},
        { text: '템플릿 상태', value: 'TMPL_STTS_NM', align: '', width: '120px', sortable: false },
        { text: '검수 상태', value: 'TMPL_IGI_NM', align: '', width: '120px', sortable: false },
        { text: '선택', value: 'TMPL_SELECT', align: 'center', width: '100px', sortable: false },
      ],                        //템플릿 리스트 헤더
      items:[],                 //템플릿 리스트

      //문자 템플릿 다이얼로그 오픈 여부
      dialogOpenMsgTemplate : false,
      SMS_TMPL_MODE: '', //문자 템플릿 조회 모드
      SMS_FILE_GROUP_KEY: '', //문자 템플릿 파일_그룹_키

      //설문 상태 변경 다이얼로그 오픈 여부.
      dialogOpenSttsUpdate: false,
      //업데이트할 상태 코드
      UPDATE_STTS_CD: '',


      //설문지 생성관리 참여자 검색 항목
      TRGT_SRCH_TYPE_LIST: [
        { text: '전화번호', value: 'CUST_PHN_NO'},
        { text: '구분', value: 'CUTT_TYPE_1'},
        { text: '상담사', value: 'CUSL_NM'},
      ],
      TRGT_SRCH_TYPE: 'CUST_PHN_NO',
      //설문지 생성관리 참여자 검색어
      TRGT_SRCH_KWRD: '',
      //원본 참여자 데이터.
      originalGridDataText: [],

      dialogExlCond:false,
      dialogTab:'',
      EXL_COND_HEADER_LIST:[
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px' },
        { text: '부서', value: 'DEPT_NM', align: 'left', width: '120px'},
        { text: '조건 구분', value: 'EXL_COND_TEXT', align: 'left', width: '360px'},
        { text: '수정자', value: 'MDFR_NM', align: 'left', width: '120px'},
        { text: '수정일', value: 'MDFCN_DT_F', align: 'left', width: '120px'},
      ],
      EXL_COND_LIST:[],   //제외조건 리스트 - 적용할 제외조건을 선택하기 위한 리스트
      SRCH_DEPT_LIST:[],
      SRCH_DEPT_ID:'',
      SRCH_EXL_COND_SE_CD:'',
      SRCH_EXL_COND_CD:'', 
      SRCH_EXL_COND_CN:'',
      SRCH_EXL_COND_CN_CUTT_TYPE:{},
      SRCH_USE_YN:'Y',
      SRCH_DEL_YN:'N',
      SEL_EXL_COND:{},    // 선택 제외조건
      SEL_EXL_COND_LIST:[],   //선택 제외조건 리스트 - 선택된 적용할 제외조건 리스트
      SEL_EXL_COND_TEXT:'',
      EXL_COND_TRGT_HEADER_LIST:[
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px' },
        { text: '이름', value: 'CUST_NM', align: 'left', width: '120px'},
        { text: '전화번호', value: 'CUST_PHN_NO', align: 'left', width: '200px'},
        { text: '제외 사유', value: 'REASON', align: 'left', width: '360px'},
        { text: '상담유형_대',   value: 'CNSLT_DIV_CD_1',       align: 'center',         width: '200px' },
        { text: '상담유형_중',   value: 'CNSLT_DIV_CD_2',       align: 'left',         width: '200px' },
        { text: '상담유형_소',   value: 'CNSLT_DIV_CD_3',       align: 'left',         width: '200px' },
        { text: '상담메모',   value: 'CUTT_CN',       align: 'left',         width: '360px' },
        { text: '인입번호',         value: 'CUST_PHN_NO',       align: 'left',          width: '160px' },
        { text: '인입유형',         value: /*'DRWI_TYPE_CD'*/'DRWI_SE_CD',              align: 'left',          width: '120px' },
        { text: '접수채널',         value: 'RCPT_CHN_CD',             align: 'left',          width: '120px' },
        { text: '처리방법',         value: 'PRCS_CHN_CD',             align: 'left',          width: '120px' },
        { text: '개인정보수집동의',         value: 'PRVC_CLCT_AGRE_YN',             align: 'left',          width: '120px' },
        { text: '접수자명',         value: 'USER_NM',             align: 'left',          width: '120px' },
      ],
      DRWI_SE_CD_LIST:[
        {text:'전체',value:''}
        ,{text:'IN',value:'IN'}
        , {text:'OUT',value:'OUT'}
      ],
      RCPT_CHN_CD_LIST:[],
      PRCS_CHN_CD_LIST:[],
      EXL_COND_TRGT_LIST:[],   //제외조건 제외 대상자 리스트 - 제외조건으로 제외된 대상자를 보여주기위함 (적용된 제외조건과 대상을 한번에 저장)
      SRCH_EXL_COND_TRGT_LIST:'',
      SEL_EXL_COND_TRGT:{},
      SEL_EXL_COND_TRGT_LIST:[],
      EXL_COND_SET_TRGT_LIST:[],   //제외조건 제외 대상자 리스트 - 제외조건으로 제외된 대상자를 보여주기위함 (적용된 제외조건과 대상을 한번에 저장)
      SRCH_EXL_COND_SET_TRGT_LIST:'',
      SEL_EXL_COND_SET_TRGT:{},
      SEL_EXL_COND_SET_TRGT_LIST:[],   //제외조건 제외대상에서 제외한 대상 리스트

      CUTT_TYPE_LIST_1:[],
      CUTT_TYPE_LIST_2:[],
      CUTT_TYPE_LIST_3:[],

      LOADING:false,
      gridCuttTypeHeaders:[
        { text: '상담유형명', value: 'CUTT_TYPE_NM', align: 'left'},
        { text: '대', value: 'PATH_1', align: 'left'},
        { text: '중', value: 'PATH_2', align: 'left'},
        { text: '소', value: 'PATH_3', align: 'left'},
        { text: '전체', value: 'PATH', align: 'left'},
      ],
      srchGridCuttTypeItems:[],
      gridCuttTypeItems:[],
      selectedCuttTypeRow:{},
      srchSelectedCuttTypeData: [],
      selectedCuttTypeData: [],
      dialogCuttType: false,
      SRCH_CUTT_TYPE:'',
      dots: "",
      dotInterval: null,
      CUTT_TYPE_MODE:'SRCH',
    }
  },
  watch: {
    // computedSelectedRadio(){
    //   if(this.computedSelectedRadio == 'KAKAO'){
    //     this.SEND_TTL = '';
    //     this.SEND_MESSAGE = '';
    //   }
    // }
    SEL_EXL_COND_LIST(){
      for(let i=0;i<this.SEL_EXL_COND_LIST.length;i++){
        let str = (i!=0 ? '<br>' : '') + (i+1) + '. ' + this.SEL_EXL_COND_LIST[i].EXL_COND_TEXT;
        this.SEL_EXL_COND_TEXT += str;
      }
    },

    SRCH_DEPT_ID(){
      this.selectCuttTypeAll(1,'grid');
      this.selectCuttTypeAll(2,'grid');
      this.selectCuttTypeAll(3,'grid');
    },

    SRCH_EXL_COND_SE_CD(){
      this.SRCH_EXL_COND_CN = '';
      this.SRCH_EXL_COND_CN_CUTT_TYPE = {};
    },

    dialogExlCond(){
      if(!this.dialogExlCond){
        this.EXL_COND_TRGT_LIST = [];
        this.EXL_COND_SET_TRGT_LIST = [];
      }
    }
  },

  computed: {
    ...mapGetters({
      // stoUserId: 'userStore/GE_USER_ID',
      // stoUserComp: 'userStore/GE_USER_COMPANY',
    }),
  },

  async created() {
    //공통코드설정
    let codeName = [
                     'SUVY_CL'      //설문계획 구분
                    ,'PROG_ST'      //진행 상태
                    ,'SUVY_QST_TP'  //설문 질문유형
                    ,'SELT_ALW_NB'  //선택 허용수
                    ,'ANSW_SZ'      //답변 사이즈
                    ,'CUSL_PHN_NO'  //상담사 전화번호 - 문자 발신번호 목록에 추가됨
                    ,'EXL_COND_TY', 'EXL_COND', 'USE_WT'
                    , 'CVC', 'PCMC'
                  ];
    this.common_code = await this.mixin_common_code_get_all(codeName, 'Y');
    this.RCPT_CHN_CD_LIST = this.mixin_common_code_get(this.common_code, 'CVC', '전체');
    this.PRCS_CHN_CD_LIST = this.mixin_common_code_get(this.common_code, 'PCMC', '전체');
    //진행년도 설정(금년기준 -5, +5)
    const date = new Date();
    const curYear = date.getFullYear();
    this.srvyYrItems.push({ text: '전체', value: '' });   // default
    for (let i = -5; i < 5; i++) {
      this.srvyYrItems.push({ text: `${curYear + i}년`, value: (curYear + i).toString() });
    }
    this.SRVY_YR =  curYear.toString();
    //환경설정 - 알림톡 전환전송 체크 여부
    this.TRAN_SEND = this.mixin_getCustcoSetting('ENV_ATALK_TRAN_SEND_CHECK_YN');
  },
  mounted() {
    const nowDt = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
    this.date = nowDt;
    this.dtSrvyBgngDt = nowDt;
    this.dtSrvyEndDt = nowDt;

    this.tab1Init();
    this.tab2Init();
    this.tab3Init();
    this.tab4Init();
    //설문조사콤보박스 조회
    this.getSrvyNm();
  },

  methods: {
    searchTrgt() {
      
      if(this.TRGT_SRCH_KWRD.trim() == '' && this.originalGridDataText.length > 0) {
        this.gridDataText = this.originalGridDataText;
        return
      }

      this.originalGridDataText = _.cloneDeep(this.gridDataText);
      if(this.TRGT_SRCH_TYPE == 'CUST_PHN_NO') {

      }

    },
    //설문지 생성 초기화
    tab1Init(){
      this.searchFlag = false;
      this.bfIndex = -1;
      this.hdType = '';
      this.SURVEYT_LIST = [];
      this.uploadedFiles = [];
      this.gHdData = {
        SRVY_QITEM_GROUP_ID : '',
        SRVY_ID : '',
        SRVY_QITEM_GROUP_NM : '',
        SRVY_QITEM_GROUP_CN : '',
        SORT_ORD : '',
        FILE_GROUP_KEY : '',
        IMG_URL : '',
      };
      this.gQuData = {
        SRVY_QITEM_GROUP_NM: '',
        SRVY_QITEM_ID : '',           //설문_문항_ID
        SRVY_QITEM_GROUP_ID : '',     //설문_문항_그룹_ID
        SRVY_QITEM_CN : '',           //설문_문항_내용
        SRVY_QITEM_EXPLN : '',        //설문_문항_설명
        QITEM_TYPE_CD : 'SNGL',       //문항_유형_코드
        ESNTL_YN : '',               //필수_여부
        CHC_PM_CNT : '1',             //선택_허용_수
        ANS_LEN_CD : '',              //답안_길이_코드
        HR_APLCN_YN : false,            //시간_적용_여부
        SCR_USE_YN : false,
        GROUP_MVMN_USE_YN : false,
        SORT_ORD : '0',               //정렬_순서
      };
      this.ANSWER_LIST = [
        {
          QITEM_CHC_ID : '',
          SRVY_QITEM_ID : '',
          QITEM_CHC_CN : '',
          CSORT_ORD : 0,
        }
      ]
      // this.gBfQuData = _.cloneDeep(this.gQuData);
      this.tabGrpCnt = 0;
    },
    //참여자 설정 초기화
    async tab2Init(){
      this.gridDataText = [];
      this.gridDataHeaders = [
        { text: '번호',           value: 'ROW_NUMBER',          align: 'center',        width: '80px' },
        { text: '*이름',           value: 'CUST_NM',             align: 'left',          width: '100px' },
        { text: '*전화번호',       value: 'CUST_PHN_NO',         align: 'left',          width: '130px' },
        { text: '이메일',         value: 'EML',                 align: 'left',          width: '200px' },
      ];
      if(this.srvyExpsnAttrList.length > 0) {
        this.srvyExpsnAttrList.map(expsn => {
          this.gridDataHeaders.push({ text: (expsn.ESNTL_YN == 'Y' ? '*' + expsn.EXPSN_ATTR_NM : expsn.EXPSN_ATTR_NM), value: expsn.EXPSN_ATTR_COL_ID, align: 'left', width: '100px' })
        })
      }
      const gridDataHeaders2 = [
        { text: '메시지 발송 횟수',   value: 'MSG_CNT',       align: 'center',         width: '150px' },
        { text: '메시지 발송 유형',   value: 'MSG_TY',       align: 'left',         width: '150px' },
        { text: '최종 메시지 발송 일자',   value: 'MSG_DT',       align: 'left',         width: '170px' },
        { text: '설문참여 여부',   value: 'SRVY_RSPNS_YN',       align: 'left',         width: '120px' },
        { text: '참여일',         value: 'SRVY_RSPNS_DT',       align: 'left',          width: '160px' },
        { text: '등록일',         value: 'REG_DT',              align: 'left',          width: '160px' },
        { text: '등록자',         value: 'RGTR_ID',             align: 'left',          width: '120px' },

        { text: '참여자id',       value: 'SRVY_TRGT_ID',        align: ' d-none' },
        { text: '설문id',         value: 'SRVY_ID',             align: ' d-none' },
        // { text: '암호화키',       value: 'URL_KEY',             align: 'center', width: '120px' },
      ];
      this.gridDataHeaders.push(...gridDataHeaders2);

      //설문 제외조건
      // const gridDataHeaders3 = [
      //   { text: '상담유형_대',   value: 'CNSLT_DIV_CD_1',       align: 'left',         width: '200px' },
      //   { text: '상담유형_중',   value: 'CNSLT_DIV_CD_2',       align: 'left',         width: '200px' },
      //   { text: '상담유형_소',   value: 'CNSLT_DIV_CD_3',       align: 'left',         width: '200px' },
      //   { text: '상담메모',   value: 'CUTT_CN',       align: 'left',         width: '360px' },
      //   { text: '인입번호',         value: 'CUST_PHN_NO',       align: 'left',          width: '160px' },
      //   { text: '접수채널',         value: 'RCPT_CHN_CD',              align: 'left',          width: '120px' },
      //   { text: '인입유형',         value: 'DRWI_TYPE_CD',             align: 'left',          width: '120px' },
      //   { text: '처리방법',         value: 'PRCS_CHN_CD',             align: 'left',          width: '120px' },
      //   { text: '개인정보수집동의',         value: 'PRVC_CLCT_AGRE_YN',             align: 'left',          width: '120px' },
      //   { text: '접수자명',         value: 'USER_NM',             align: 'left',          width: '120px' },
      // ];
      // this.gridDataHeaders.push(...gridDataHeaders3);

      //엑셀 양식 확장 항목 추가.
      this.excelTemplateHeaders = [
        { text: '*이름',           value: 'CUST_NM',             align: 'center',          width: '120px' },
        { text: '*전화번호',       value: 'CUST_PHN_NO',         align: 'center',          width: '200px' },
        { text: '이메일',         value: 'EML',                 align: 'left',            width: '100%' },
      ];
      if(this.srvyExpsnAttrList.length > 0) {
        this.srvyExpsnAttrList.map(expsn => {
          this.excelTemplateHeaders.push({ text: (expsn.ESNTL_YN == 'Y' ? '*' + expsn.EXPSN_ATTR_NM : expsn.EXPSN_ATTR_NM), value: expsn.EXPSN_ATTR_COL_ID, align: 'center', width: '150px'})
        })
      };

      this.isSelectedAllTrgt = false;
      this.gridSelectedData = [];

      this.pagination.page = 1; //페이징 처리 초기화
      this.nextDisabled = false;
      this.gridTotalCnt = 0;
      
    },

    //응답설정 초기화
    async tab3Init(){
      this.SBMSN_END_MSG = '';
      this.PSNAL_LMT_SBMSN_STNG_YN = '';
      this.CLCT_AGRE_USE_YN = '';
      this.SRVY_YMD_INDCT_YN = false;
      this.stts_head = '';
      this.CUSTCO_NM = this.$store.getters["userStore/GE_USER_COMPANY"].CD_NM;
    },
    //게시여부 초기화
    tab4Init(){
      this.pData = { 'url' : '' };
      this.BY_PASS = false;
    },
    // 발신자 연락처 정보 조회
    selectCusRprs(){
      if(this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO){
        const dsptchNoList = this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO.split(',');
        
        this.CUSTCO_TEL_LIST = [];
        for(let i=0; i<dsptchNoList.length; i++){
          this.CUSTCO_TEL_LIST.push(this.autoPhoneNum(dsptchNoList[i]));
        }
        this.mixin_common_code_get(this.common_code, 'CUSL_PHN_NO').forEach((data, idx) => {
          this.CUSTCO_TEL_LIST.push(this.autoPhoneNum(data.value));
        });

        this.CALLBACK_NUMBER = this.CUSTCO_TEL_LIST[0];
      }
    },

    // 연락처 형식
    autoPhoneNum(value) {
      if (!value) {
        return "";
      }

      value = value.replace(/[^0-9]/g, "");

      let result = [];
      let restNumber = "";

      // 지역번호와 나머지 번호로 나누기
      if (value.startsWith("02")) {
        // 서울 02 지역번호
        result.push(value.substr(0, 2));
        restNumber = value.substring(2);
      } else if (value.startsWith("1")) {
        // 지역 번호가 없는 경우
        // 1xxx-yyyy
        restNumber = value;
      } else {
        // 나머지 3자리 지역번호
        // 0xx-yyyy-zzzz
        result.push(value.substr(0, 3));
        restNumber = value.substring(3);
      }

      if (restNumber.length === 7) {
        // 7자리만 남았을 때는 xxx-yyyy
        result.push(restNumber.substring(0, 3));
        result.push(restNumber.substring(3));
      } else {
        result.push(restNumber.substring(0, 4));
        result.push(restNumber.substring(4));
      }

      return result.filter((val) => val).join("-");
    },
    //헤더체크
    headerChk(t, o){
      let cFlag = false;
      if(o.TYPE !== 'header'){
        switch(t){
          case 'btn' : cFlag = true; break;
          case 'sub' : cFlag = o.ACTIVE; break;
        }
      }

      return cFlag;
    },
    //설문명 콤보박스 조회
    async getSrvyNm(){
      const sUrl = '/api/svy/makeitems/selectcombomakeitems';
      const postParam = {
        SRVY_YR : this.SRVY_YR             //진행년도
        ,STTS_CD : this.STTS_CD         //진행상태
        ,SRVY_SE_CD : this.SRVY_SE_CD        //계획구분
      }
      const headParam = {
        head: {
          'SERVICE' : 'svy.plan.selectcombomakeitems',
          'METHOD' : 'selectcombomakeitems',
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
        this.tab1Init();
        this.tab2Init();
        this.tab3Init();
        this.tab4Init();

        this.SRVY_NM = '';
        this.srvyNmItems = resData.DATA.map(item => ({ text: this.mixin_decode(item.TEXT), value: item.VALUE, vl_1: item.VL_1}));
        if (this.srvyNmItems.length > 0) this.SRVY_NM = this.mixin_decode(resData.DATA[0].VALUE);
      }
      if(!this.mixin_isEmpty(this.SRVY_NM)) this.btnSelectList();
    },

    //설문명 콤보박스 클릭 시, item 새로 조회. - 계획관리에서 신규 등록된 설문을 탭 재오픈을 안하고 목록에 출력하기 위함.
    //(기존은 탭을 닫고 다시 메뉴를 오픈해야 함.)
    async getSrvyNmRefresh(){
      const sUrl = '/api/svy/makeitems/selectcombomakeitems';
      const postParam = {
        SRVY_YR : this.SRVY_YR             //진행년도
        ,STTS_CD : this.STTS_CD         //진행상태
        ,SRVY_SE_CD : this.SRVY_SE_CD        //계획구분
      }
      const headParam = {
        head: {}
      }
      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (!resData.HEADER.ERROR_FLAG) {
        this.srvyNmItems = resData.DATA.map(item => ({ text: this.mixin_decode(item.TEXT), value: item.VALUE, vl_1: item.VL_1 }));
      }
    },

    //조회버튼클릭
    async btnSelectList(){
      if(this.chkValid('0')) return;
      await this.tab1SelectList();
      this.tab2SelectList(false);
      this.tab3SelectList();
      this.tab4SelectList();

      for(let i=0;i<this.srvyNmItems.length;i++){
        if(this.srvyNmItems[i].value == this.SRVY_NM){
          this.SRCH_DEPT_ID = this.srvyNmItems[i].vl_1;
          return;
        }
      }
    },
    //설문지 생성 조회
    async tab1SelectList(){
      const sUrl = '/api/svy/makeitems/selectgrplistmakeitems';
      const postParam = {
        SRVY_ID : this.SRVY_NM             //설문조사 id
      }
      const headParam = {
        head: {
          'SERVICE' : 'svy.makeitems.selectgrplistmakeitems',
          'METHOD' : 'selectgrplistmakeitems',
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
        // if(this.tab > 0) this.tab = 0;

        this.tab1Init();
        this.searchFlag = true;

        if(resData.DATA.length > 0){
          let preGrpId = 0;
          let idx = -1;
          this.MVMN_SRVY_QITEM_GROUP_LIST = [];
          this.SURVEYT_LIST = [];

          
          //다음 블록 정보 출력을 위해 설문 블록 목록 Data를 별도로 생성한다.
          resData.DATA.forEach(e => {
            if(preGrpId !== e.SRVY_QITEM_GROUP_ID && e.HEAD_YN =='N'){
              this.MVMN_SRVY_QITEM_GROUP_LIST.push({
                SRVY_QITEM_GROUP_ID : e.SRVY_QITEM_GROUP_ID
                ,SRVY_QITEM_GROUP_NM : this.mixin_decode(e.SRVY_QITEM_GROUP_NM)
                ,SORT_ORD : e.GRP_SORT_ORD
              });
              preGrpId = e.SRVY_QITEM_GROUP_ID;
            }
          });


          preGrpId = 0;
          resData.DATA.forEach(e => {
            //그룹바인딩
            if(preGrpId !== e.SRVY_QITEM_GROUP_ID){
              e.ACTIVE = !!e.ACTIVE;
              e.RENAME = !!e.RENAME;
              e.NOMOVE = !!e.NOMOVE;
              e.QUESTION = [];

              this.SURVEYT_LIST.push({
                 SRVY_QITEM_GROUP_ID : e.SRVY_QITEM_GROUP_ID
                ,SRVY_ID : e.SRVY_ID
                ,SRVY_QITEM_GROUP_NM : this.mixin_decode(e.SRVY_QITEM_GROUP_NM)
                ,SRVY_QITEM_GROUP_CN : this.mixin_decode(e.SRVY_QITEM_GROUP_CN)
                ,SORT_ORD : e.GRP_SORT_ORD
                ,FILE_GROUP_KEY : e.FILE_GROUP_KEY
                // ,STRG_FILE_NM : e.STRG_FILE_NM
                // ,FILE_PATH : e.FILE_PATH
                ,IMG_URL : e.IMG_URL
                ,HEAD_YN : e.HEAD_YN
                ,QITEM_CNT : e.QITEM_CNT
                ,ACTIVE : e.ACTIVE
                ,TYPE : e.TYPE
                ,TITLE : this.mixin_decode(e.TITLE)
                ,RENAME : e.RENAME
                ,NOMOVE : e.NOMOVE
                ,QUESTION: e.QUESTION
                ,MVMN_SRVY_QITEM_GROUP_ID: this.mixin_isEmpty(e.MVMN_SRVY_QITEM_GROUP_ID) ? '' : e.MVMN_SRVY_QITEM_GROUP_ID
              });

              preGrpId = e.SRVY_QITEM_GROUP_ID;
              idx++;
            }
            //항목이있는경우 바인딩
            if(e.QITEM_CNT > 0){
              this.tabGrpCnt = e.QITEM_CNT;
              e.REQUIRED = !!e.REQUIRED;
              this.SURVEYT_LIST[idx].QUESTION.push(
                {
                   SRVY_QITEM_GROUP_ID : e.SRVY_QITEM_GROUP_ID
                  ,SRVY_QITEM_GROUP_NM : this.mixin_decode(e.SRVY_QITEM_GROUP_NM)
                  ,SRVY_QITEM_ID : e.SRVY_QITEM_ID
                  ,SRVY_QITEM_CN : this.mixin_decode(e.SRVY_QITEM_CN)
                  ,SRVY_QITEM_EXPLN : this.mixin_decode(e.SRVY_QITEM_EXPLN)
                  ,QITEM_TYPE_CD : e.QITEM_TYPE_CD
                  ,QITEM_TYPE_NM : e.QITEM_TYPE_NM
                  ,ESNTL_YN : e.ESNTL_YN
                  ,CHC_PM_CNT : e.CHC_PM_CNT
                  ,ANS_LEN_CD : e.ANS_LEN_CD
                  ,HR_APLCN_YN : (e.HR_APLCN_YN === 'Y' ? true : false)
                  ,SCR_USE_YN : (e.SCR_USE_YN === 'Y' ? true : false)
                  ,GROUP_MVMN_USE_YN : (e.GROUP_MVMN_USE_YN === 'Y' ? true : false)
                  ,SORT_ORD : e.ITEM_SORT_ORD
                  ,FILE_GROUP_KEY : e.FILE_GROUP_KEY
                  ,CHC_CNT : e.CHC_CNT
                  ,REQUIRED : e.REQUIRED
                }
              )
            }
            this.gTrgtDsgnYn = e.TRGT_DSGN_YN;    // 대상지정여부
            this.PSTG_YN = (e.PSTG_YN === 'Y' ? true : false);
          });
          //this.SRVY_URL = (!this.mixin_isEmpty(resData.DATA[0].SRVY_URL) ? '/SVY?key=' : '') + resData.DATA[0].SRVY_URL;   // .env 설정되면 바꿔야함.
          this.SRVY_URL = resData.DATA[0].SRVY_URL;
          this.SRVY_URL_PREVIEW = !this.mixin_isEmpty(resData.DATA[0].SRVY_URL) ? resData.DATA[0].SRVY_URL + '&preview=Y' : '';
          // this.chkIndex(0);
          this.surveyOpen(0);
          if(this.tab1GrpIdx > -1){
            if(this.mixin_isEmpty(this.SURVEYT_LIST[this.tab1GrpIdx])){
              this.tab1GrpIdx = -1;
            }else{
              this.tab1QueItem = this.SURVEYT_LIST[this.tab1GrpIdx].QUESTION;
            }
          }
        }
      }
    },

    //현재 블록의 - 다음 블록 정보 조회.(현재 블록보다 이후 블록만 출력한다.)
    getMvmnSrvyQitemGroupList(sortOrd) {
      let mvmnSrvyQitemGroupList = [];

      //연결 블록 없음
      mvmnSrvyQitemGroupList.push({
        SRVY_QITEM_GROUP_ID : ''
        ,SRVY_QITEM_GROUP_NM : '연결 블록 없음'
        ,SORT_ORD : -1
      });
      
      //현재 블록보다 이후 블록 목록만 push
      this.MVMN_SRVY_QITEM_GROUP_LIST.forEach(item => {
        if(sortOrd < item.SORT_ORD) {
          mvmnSrvyQitemGroupList.push({
            SRVY_QITEM_GROUP_ID : item.SRVY_QITEM_GROUP_ID
            ,SRVY_QITEM_GROUP_NM : this.mixin_decode(item.SRVY_QITEM_GROUP_NM)
            ,SORT_ORD : item.SORT_ORD
          });
        }
      });

      //설문 제출
      mvmnSrvyQitemGroupList.push({
        SRVY_QITEM_GROUP_ID : '-999'
        ,SRVY_QITEM_GROUP_NM : '설문지 제출'
        ,SORT_ORD : 999
      });
      return mvmnSrvyQitemGroupList
    },

    async udpateMvmnSrvyQitemGroup(item, updateTable){
      let sUrl = '/api/svy/makeitems/udpateGroupMvmnSrvyQitemGroup';
      
      let postParam = {
        SRVY_ID : this.SRVY_NM             //설문조사 id
        , MVMN_SRVY_QITEM_GROUP_ID: item.MVMN_SRVY_QITEM_GROUP_ID
        , SRVY_QITEM_GROUP_ID: item.SRVY_QITEM_GROUP_ID
      }
      
      const headParam = {head: {}}
      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (!resData.HEADER.ERROR_FLAG) {
        // this.showToast(this.MESSAGE.TOAST.SUCCESS);
      }
    },

    //보기항목 조회
    async selectChcList(item){
      const sUrl = '/api/svy/makeitems/selectchcmakeitems';
      const postParam = {
        SRVY_QITEM_ID : item.SRVY_QITEM_ID
      }
      const headParam = {
        head: {
          'SERVICE' : 'svy.makeitems.selectchcmakeitems',
          'METHOD' : 'selectchcmakeitems',
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
        this.ANSWER_LIST = [];
        if(resData.DATA.length > 0){
          resData.DATA.forEach(e => {
            this.ANSWER_LIST.push(e)
          });
        }
      }
    },
    //참여자 조회
    async tab2SelectList(next){
      this.isLoadingGridData = true;
      
      //다음버튼 클릭 유무
      // if (!next) this.tab2Init();

      await this.getSrvyExpsnAttrList();

      this.tab2Init();

      const sUrl = '/api/svy/makeitems/selecttrgtlist';
      const postParam = {
        SRVY_ID : this.SRVY_NM             //설문조사 id
      }
      const headParam = {
        head: {
          'SERVICE' : 'svy.makeitems.selecttrgtlist',
          'METHOD' : 'selecttrgtlist',
          'TYPE' : 'BIZ_SERVICE',
          'ROW_CNT' : this.pagination.rowsPerPage,
          'PAGES_CNT' : this.pagination.page,
          'PAGING' : 'Y',
        }
      }
      
      let resData = await this.common_postCall(sUrl, postParam, headParam );
            
      // if(!resData.DATA[0].SRVY_URL || !resData.DATA[0].URL_KEY.includes(resData.DATA[0].SRVY_URL) ){
      //   let msg = '재조회 해주세요'
      //   this.showAlert({alertDialogToggle: true, msg: msg, iconClass: 'is-info', type: 'default'});
      //   return;
      // }
      
      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {
        resData.DATA.forEach((data, idx) => {
          data.CUST_PHN_NO = this.mixin_setPhoneNo(data.CUST_PHN_NO.replace(/[^0-9]/g, ""));
          data.SRVY_RSPNS_DT = this.mixin_convertDate(data.SRVY_RSPNS_DT, 'yyyy-MM-dd HH:mm:ss')
          data.MSG_DT = this.mixin_convertDate(data.MSG_DT, 'yyyy-MM-dd HH:mm:ss')
          data.REG_DT = this.mixin_convertDate(data.REG_DT, 'yyyy-MM-dd HH:mm:ss')
        });
        this.gridDataText = resData.DATA;
        let leng = this.gridDataText.length;
        for(let i=0;i<leng;i++){
          if(this.gridDataText[i].SNDNG_SE_CD == 'ATALK'){
            this.gridDataText[i]["MSG_TY"] = '알림톡'
          } else if(this.gridDataText[i].SNDNG_SE_CD == 'SMS' || this.gridDataText[i].SNDNG_SE_CD == 'LMS' || this.gridDataText[i].SNDNG_SE_CD == 'MMS') {
            this.gridDataText[i]["MSG_TY"] = '문자'
          } else if(this.gridDataText[i].SNDNG_SE_CD == 'EMAIL') {
            this.gridDataText[i]["MSG_TY"] = '이메일'
          }
        }
        // let tempDataText = resData.DATA;
        // let idx = this.gridDataText.length + 1;
        // for(let i in tempDataText){
        //   tempDataText[i]["index"]= idx++;
        // }
        // this.gridDataText = [...this.gridDataText, ...tempDataText]
        // if(resData.HEADER.next !== null && resData.HEADER.next !== undefined){
        //   if(resData.HEADER.next === true){
        //     this.nextDisabled = false //버튼 활성화
        //   }else{
        //     this.nextDisabled = true  //버튼 비활성화
        //   }
        // }
        // if(this.gridDataText.length > 0) this.gridTotalCnt = resData.DATA[0].TWB_PAGING_TOT_COUNT;


        // //이부분은 체크해볼것
        // this.pagination.page += 1
        // this.page=1;
      }
      this.isLoadingGridData = false;
    },
    
    async getSrvyExpsnAttrList() {
      const sUrl = '/api/svy/makeitems/selectSrvyExpsnAttrList';
      const postParam = {
        SRVY_ID : this.SRVY_NM             //설문조사 id
      }
      const headParam = {
        head: {}
      }
      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (!resData.HEADER.ERROR_FLAG) {
        this.srvyExpsnAttrList = resData.DATA;
      } else {
        this.srvyExpsnAttrList = [];
      }
    },
    

    //웅답설정 조회
    async tab3SelectList(){
      const sUrl = '/api/svy/makeitems/selectsettinglist';
      const postParam = {
        SRVY_ID : this.SRVY_NM             //설문조사 id
      }
      const headParam = {
        head: {
          'SERVICE' : 'svy.makeitems.selectsettinglist',
          'METHOD' : 'selectsettinglist',
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
        this.tab3Init();
        this.PSNAL_LMT_SBMSN_STNG_YN = resData.DATA[0].PSNAL_LMT_SBMSN_STNG_YN;
        this.CLCT_AGRE_USE_YN = resData.DATA[0].CLCT_AGRE_USE_YN;
        this.SRVY_YMD_INDCT_YN = (resData.DATA[0].SRVY_YMD_INDCT_YN == 'Y' ? false : true)
        this.SBMSN_END_MSG = this.mixin_decode(resData.DATA[0].SBMSN_END_MSG);
        this.dtSrvyBgngDt = resData.DATA[0].SRVY_BGNG_DT;
        this.dtSrvyEndDt = resData.DATA[0].SRVY_END_DT;
        this.stts_head = resData.DATA[0].STTS_CD;
      }
    },
    //게시탭 조회
    async tab4SelectList(){
      this.tab4Init();
      this.pData = { 'id' : this.SRVY_NM, 'view' : true };
    },
    //validate check
    validate () {
      return this.$refs.form.validate();
    },
    chkValid(e){
      let eFlag = true;
      switch(e){
        case '0' : //조회관련
          if(this.mixin_isEmpty(this.SRVY_NM)) this.showAlert(this.MESSAGE.ALERT.ETC1_WARNING);
          else eFlag = false;
        break;
        case '1' : //조회여부
          if(!this.searchFlag) this.showAlert(this.MESSAGE.ALERT.ETC2_WARNING); // 조회여부 체크
          else eFlag = false;
        break;
        case '3' : //저장체크
          if(this.gQuData.QITEM_TYPE_CD === 'MULT'){
            if(this.gQuData.CHC_PM_CNT != '9' && this.gQuData.CHC_PM_CNT > this.ANSWER_LIST.length){
              this.showAlert(this.MESSAGE.ALERT.ETC11_WARNING);
              break;
            }else{
              eFlag = false;
            }
          }else if(this.gQuData.QITEM_TYPE_CD === 'DATE'){
            if(this.mixin_isEmpty(this.date)){
              this.showAlert(this.MESSAGE.ALERT.ETC9_WARNING);
              break;
            }else{
              eFlag = false;
              break;
            }
          }else{
            eFlag = false;
          }

          if(['SNGL', 'MULT'].includes(this.gQuData.QITEM_TYPE_CD)){
            if(this.ANSWER_LIST.length < 1){
              this.showAlert(this.MESSAGE.ALERT.ETC7_WARNING);
              eFlag = true;
              break;
            }
          }

          // if(this.mixin_isEmpty(this.gQuData.SRVY_QITEM_CN)){
          //   this.showAlert(this.MESSAGE.ALERT.ETC6_WARNING);
          //   break;
          // }else if(this.gQuData.QITEM_TYPE_CD === 'MULT'){
          //   if(this.mixin_isEmpty(this.gQuData.CHC_PM_CNT)){
          //     this.showAlert(this.MESSAGE.ALERT.ETC8_WARNING);
          //     break;
          //   }else if(this.gQuData.CHC_PM_CNT != '9' && this.gQuData.CHC_PM_CNT > this.ANSWER_LIST.length){
          //     this.showAlert(this.MESSAGE.ALERT.ETC11_WARNING);
          //     break;
          //   }else{
          //     eFlag = false;
          //   }
          // }else if(this.gQuData.QITEM_TYPE_CD === 'DATE'){
          //   if(this.mixin_isEmpty(this.date)){
          //     this.showAlert(this.MESSAGE.ALERT.ETC9_WARNING);
          //     break;
          //   }else{
          //     eFlag = false;
          //     break;
          //   }
          // }else{
          //   eFlag = false;
          // }

          // if(['SNGL', 'MULT'].includes(this.gQuData.QITEM_TYPE_CD)){
          //   if(this.ANSWER_LIST.length < 1){
          //     this.showAlert(this.MESSAGE.ALERT.ETC7_WARNING);
          //     eFlag = true;
          //     break;
          //   }
          //   else{
          //     for(let e of this.ANSWER_LIST){
          //       if(this.mixin_isEmpty(e.QITEM_CHC_CN)){
          //         this.showAlert(this.MESSAGE.ALERT.ETC10_WARNING);
          //         eFlag = true;
          //         break;
          //       }else{
          //         eFlag = false;
          //       }
          //     }
          //   }
          // }
        break;
        case '4' : //엑셀데이터 체크
          if(this.gridDataText.length < 1) this.showAlert(this.MESSAGE.ALERT.ETC12_WARNING);
          else eFlag = false;
        break;
        case '5' : //참여자 체크
          const regEmail = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
          for(let i=0; i<this.gridDataText.length; i++){
            let e = this.gridDataText[i];
            let CUST_NM = e.CUST_NM;
            let msg = ` (${i+1}번째 행)`;
            //이름이 없으면 오류
            if(this.mixin_isEmpty(CUST_NM)){
              this.MESSAGE.ALERT.ETC15_WARNING.msg = `이름이 없는 항목이 존재합니다.${msg}`;
              this.showAlert(this.MESSAGE.ALERT.ETC15_WARNING);
              eFlag = true;
              break;
            }else{
              let CUST_PHN_NO = e.CUST_PHN_NO;
              if(this.mixin_isEmpty(CUST_PHN_NO)){
                this.MESSAGE.ALERT.ETC13_WARNING.msg = `전화번호가 없는 항목이 존재합니다.${msg}`;
                this.showAlert(this.MESSAGE.ALERT.ETC13_WARNING);
                eFlag = true;
                break;
              }else{
                CUST_PHN_NO = CUST_PHN_NO.toString().replace(/[^0-9]/g, '')
                if(CUST_PHN_NO.length < 10 || CUST_PHN_NO.length > 11){
                  this.MESSAGE.ALERT.ETC14_WARNING.msg = `전화번호 길이 또는 형식이 맞지 않습니다.${msg}`;
                  this.showAlert(this.MESSAGE.ALERT.ETC14_WARNING);
                  eFlag = true;
                  break;
                }else{
                  //메일이 있다면 형식 체크
                  let EML = e.EML;
                  if(!this.mixin_isEmpty(EML)){
                    if(!regEmail.test(EML)) {
                      this.MESSAGE.ALERT.ETC24_WARNING.msg = `메일 형식이 올바르지 않습니다.${msg}`;
                      this.showAlert(this.MESSAGE.ALERT.ETC24_WARNING);
                      eFlag = true;
                      break;
                    }
                  }
                  //모두 정상이면 핸드폰 숫자만 남김
                  this.gridDataText[i].CUST_PHN_NO = CUST_PHN_NO;
                  eFlag = false;
                }
              }
            }
          }
        break;
        case '6' : //대상지정여부 체크
          if(this.gTrgtDsgnYn === 'N') this.showAlert(this.MESSAGE.ALERT.ETC16_WARNING);
          else eFlag = false;
        break;
        case '7' :  //진행상태 체크 - 준비중, 승인반려 상태만 설문지 수정 가능
          // if(this.PSTG_YN) this.showAlert(this.MESSAGE.ALERT.ETC18_WARNING);
          if(!(this.stts_head === 'PRPARG' || this.stts_head === 'RFSL')) this.showAlert(this.MESSAGE.ALERT.ETC18_WARNING);
          else eFlag = false;
        break;
        case '8' :  //게시취소
          if(this.stts_head !== 'PUBCMP') this.showAlert(this.MESSAGE.ALERT.ETC19_WARNING);
          else eFlag = false;
        break;
        case '9' :  //설문항목 등록여부
          if(this.tabGrpCnt === 0) this.showAlert(this.MESSAGE.ALERT.ETC20_WARNING);
          else eFlag = false;
        break;
        case '10' :  //진행상태 체크 - 승인완료 상태만 설문 게시 가능
          if(this.stts_head != 'APPR') this.showAlert(this.MESSAGE.ALERT.ETC30_WARNING);
          else eFlag = false;
        break;
      }
      return eFlag;
    },
    //설문지생성저장
    btnSaveTab1(){
      if(this.chkValid('1')) return;
      if(this.chkValid('7')) return;
      //설문 문항은 컴포넌트로 분리하여 헤더만 저장함.
      if(this.hdType === 'header') this.showAlert(this.MESSAGE.CONFIRM.MOD_HD);
      // else{
      //   if(!this.validate()) return;
      //   if(this.chkValid('3')) return;

      //   this.showAlert((this.mixin_isEmpty(this.gQuData.SRVY_QITEM_ID) ? this.MESSAGE.CONFIRM.REG : this.MESSAGE.CONFIRM.MOD));
      // }
    },

    //헤더저장실행
    async setHdSaveYes(){
      const sUrl = '/api/svy/makeitems/updateheadermakeitems';
      const postParam = this.gHdData;
      const headParam = {
        head: {
          'SERVICE' : 'svy.makeitems.updateheadermakeitems',
          'METHOD' : 'updateheadermakeitems',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (resData.HEADER.ERROR_FLAG) {
        this.setErrMsg(resData);
      } else {
        this.showAlert(this.MESSAGE.ALERT.MOD_SUCCESS);
        this.btnSelectList();
      }
    },


    async reloadSurvey(isOpenLastQuestion) {
      if(this.chkValid('0')) return;
      await this.btnSelectList();
      await this.surveyOpen(this.tab1GrpIdx);
      if(isOpenLastQuestion) {
        let chcIndex = this.SURVEYT_LIST[this.tab1GrpIdx].QUESTION.length -1;
        this.questionOpen(chcIndex, this.SURVEYT_LIST[this.tab1GrpIdx].QUESTION[chcIndex]);
      } else {
        this.questionOpen(this.tab1QueIdx, this.tab1QueItem[this.tab1QueIdx]);
      }
      
    },

    //메시지창 종료
    closeMsg(){
      this.$store.commit('alertStore/hideAlert');
    },


    //문항클릭
    questionOpen(index, item){
      //this.hdType = '';

      this.gQuData.SRVY_QITEM_GROUP_NM = item.SRVY_QITEM_GROUP_NM;

      this.gQuData.SRVY_QITEM_ID = item.SRVY_QITEM_ID;
      this.gQuData.SRVY_QITEM_GROUP_ID = item.SRVY_QITEM_GROUP_ID;
      this.gQuData.SRVY_QITEM_CN = this.mixin_decode(item.SRVY_QITEM_CN);
      this.gQuData.SRVY_QITEM_EXPLN = this.mixin_decode(item.SRVY_QITEM_EXPLN);
      this.gQuData.QITEM_TYPE_CD = item.QITEM_TYPE_CD;
      this.gQuData.ESNTL_YN = item.ESNTL_YN;
      this.gQuData.CHC_PM_CNT = item.CHC_PM_CNT;
      this.gQuData.ANS_LEN_CD = item.ANS_LEN_CD;
      this.gQuData.HR_APLCN_YN = item.HR_APLCN_YN;
      this.gQuData.SCR_USE_YN = item.SCR_USE_YN;
      this.gQuData.GROUP_MVMN_USE_YN = item.GROUP_MVMN_USE_YN;
      this.gQuData.SORT_ORD = item.SORT_ORD;

      this.checkedItems = [];
      this.checkedItems[index] = true;
      this.qIdx = index;

      this.tab1QueIdx = index;
      if(this.hdType == 'block') {
        this.$refs.svyQitemDetailRef.dataPropInit();
      }
      this.hdType = 'block';

    },
    chkIndex(index){
      if(this.bfIndex !== index){
        if(this.bfIndex > -1) this.SURVEYT_LIST[this.bfIndex].ACTIVE = false;
        if(this.SURVEYT_LIST[index]) {
          this.SURVEYT_LIST[index].ACTIVE = true;
        } 
        this.bfIndex = index;
      }
      if(this.SURVEYT_LIST[index]) {
        if(this.mixin_isEmpty(this.SURVEYT_LIST[index].SRVY_QITEM_GROUP_ID) || this.SURVEYT_LIST[index].TYPE === 'block') this.hdType = '';
        else this.hdType = this.SURVEYT_LIST[index].TYPE;
      }
      
    },
    //그룹클릭
    surveyOpen(index) {
      if(this.chkValid('1')) return;
      this.chkIndex(index);
      if(this.SURVEYT_LIST[index].HEAD_YN === 'Y'){
        this.gHdData = {
          SRVY_QITEM_GROUP_ID : this.SURVEYT_LIST[index].SRVY_QITEM_GROUP_ID,
          SRVY_ID : this.SURVEYT_LIST[index].SRVY_ID,
          SRVY_QITEM_GROUP_NM : this.SURVEYT_LIST[index].SRVY_QITEM_GROUP_NM,
          SRVY_QITEM_GROUP_CN : this.SURVEYT_LIST[index].SRVY_QITEM_GROUP_CN,
          SORT_ORD : this.SURVEYT_LIST[index].SORT_ORD,
          FILE_GROUP_KEY : this.SURVEYT_LIST[index].FILE_GROUP_KEY,
          IMG_URL : (this.mixin_isEmpty(this.SURVEYT_LIST[index].IMG_URL) ? '' : `/upload/${this.SURVEYT_LIST[index].IMG_URL}`)
        }

      }else{
        this.tab1GrpIdx = index;  //저장후 재 선택용
      }
      this.checkedItems = [];
      this.qIdx = -1;


    },
    renameSurveyList(index) {
      if(this.chkValid('7')) return;

      this.SURVEYT_LIST[index].RENAME = true;
    },
    //블록제목 수정
    renameDoneSurveyList(index, value) {
      if(this.mixin_isEmpty(value)){
        this.showAlert(this.MESSAGE.ALERT.ETC3_WARNING);
        return;
      }
      if(this.chkValid('7')) return;

      this.hdType = '';

      this.showAlert(
        {
          alertDialogToggle: true,
          msg: (this.mixin_isEmpty(this.SURVEYT_LIST[index].SRVY_QITEM_GROUP_ID) ? '저장하시겠습니까?' : '수정하시겠습니까?'),
          iconClass: 'is-info',
          type: 'confirm',
          callYes: async () => {
            const sUrl = '/api/svy/makeitems/upsertblockmakeitems';
            const postParam = {
              SRVY_QITEM_GROUP_ID : this.SURVEYT_LIST[index].SRVY_QITEM_GROUP_ID
              ,SRVY_ID : this.SURVEYT_LIST[index].SRVY_ID
              ,SRVY_QITEM_GROUP_NM : value
            }
            const headParam = {
              head: {
                'SERVICE' : 'svy.makeitems.upsertblockmakeitems',
                'METHOD' : 'upsertblockmakeitems',
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
              this.showAlert((this.mixin_isEmpty(this.SURVEYT_LIST[index].SRVY_QITEM_GROUP_ID) ? this.MESSAGE.ALERT.REG_SUCCESS : this.MESSAGE.ALERT.MOD_SUCCESS)),
              this.btnSelectList();
            }

            this.SURVEYT_LIST[index].TITLE = value;
            this.SURVEYT_LIST[index].RENAME = false;
          },
          callNo: this.closeMsg
        }
      )
    },

    removeSurveyList(item) {
      if(this.chkValid('7')) return;

      let idx = this.SURVEYT_LIST.indexOf(item);
      if(!this.mixin_isEmpty(this.SURVEYT_LIST[idx].SRVY_QITEM_GROUP_ID)){
        this.showAlert(
          {
            alertDialogToggle: true,
            msg: '삭제하시겠습니까?',
            iconClass: 'is-info',
            type: 'confirm',
            callYes: async () => {
              if(this.SURVEYT_LIST[idx].QITEM_CNT > 0){
                this.showAlert(this.MESSAGE.ALERT.ETC5_WARNING);
                return;
              }
              const sUrl = '/api/svy/makeitems/deleteblockmakeitems';
              const postParam = {
                SRVY_QITEM_GROUP_ID : this.SURVEYT_LIST[idx].SRVY_QITEM_GROUP_ID
                ,SRVY_ID : this.SURVEYT_LIST[idx].SRVY_ID
              }
              const headParam = {
                head: {
                  'SERVICE' : 'svy.makeitems.deleteblockmakeitems',
                  'METHOD' : 'deleteblockmakeitems',
                  'TYPE' : 'BIZ_SERVICE',
                }
              }

              let resData = await this.common_postCall(sUrl, postParam, headParam );

              if (resData.HEADER.ERROR_FLAG) {
                this.setErrMsg(resData);
              } else {
                this.showAlert(this.MESSAGE.ALERT.DEL_SUCCESS);
                // this.bfIndex = -1;
                this.btnSelectList();
              }
            },
            callNo: this.closeMsg
          }
        )
      }else{
        this.surveyOpen(idx);
        this.SURVEYT_LIST.splice(idx, 1);
        this.bfIndex = -1;
      }
    },
    tab1AddSurveyList() {
      if(this.chkValid('1')) return;
      if(this.chkValid('7')) return;

      this.SURVEYT_LIST.push({
         SRVY_QITEM_GROUP_ID : ''
        ,SRVY_ID : this.SRVY_NM
        ,SRVY_QITEM_GROUP_NM : ''
        ,SRVY_QITEM_GROUP_CN : ''
        ,FILE_GROUP_KEY : ''
        // ,STRG_FILE_NM : ''
        // ,FILE_PATH : ''
        ,IMG_URL : ''
        ,HEAD_YN : 'N'
        ,QITEM_CNT : '0'
        ,ACTIVE : false
        ,TYPE : 'block'
        ,TITLE : ''
        ,RENAME : true
        ,NOMOVE : false
        ,QUESTION: []
      });
    },

    //설문지 불러오기 다이얼로그 열기
    async openLoadSvy() {
      const possibleCopyYn = await this.possibleCopyYn();
      if(possibleCopyYn == 'N') {
        this.showAlert(this.MESSAGE.CONFIRM.NO_POSSIBLE_COPY);
        return;
      }
      if(this.chkValid('7')) return;
      this.dialogOpenLoadSvy = true;
    },
    //설문지 불러오기 다이얼로그 닫기
    closeLoadSvy() {
      this.dialogOpenLoadSvy = false;
    },
    async possibleCopyYn() {
      let possibleCopyYn = 'N';
      const sUrl = '/api/svy/makeitems/selectPossibleCopyYn';
      const postParam = {
        SRVY_ID : this.SRVY_NM
      }
      const headParam = {
        head: {}
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (!resData.HEADER.ERROR_FLAG) {
        possibleCopyYn = resData.DATA[0].POSSIBLE_COPY_YN;
      }
      return possibleCopyYn;
    },


    //설문지 강제 삭제 재확인
    deleteForceConfirm() {
      this.showAlert(this.MESSAGE.CONFIRM.DELETE_FORCE_SRVY);
    },

    //설문지 강제 삭제
    async deleteForceSrvyItem() {
      const sUrl = '/api/svy/makeitems/deleteForceSrvyItem';
      const postParam = {
        SRVY_ID : this.SRVY_NM
      }
      const headParam = {
        head: {}
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (!resData.HEADER.ERROR_FLAG) {
        await this.btnSelectList();
        this.openLoadSvy();
        this.closeMsg()
      }
      
    },

    

    //질문 복제
    copyChildSurveyList(index) {
      if(this.qIdx < 0) {
        this.showAlert(this.MESSAGE.ALERT.SELECT_QITEM);
        return;
      }
      if(this.mixin_isEmpty(this.SURVEYT_LIST[index].SRVY_QITEM_GROUP_ID)){
        this.showAlert(this.MESSAGE.ALERT.ETC4_WARNING);
        return;
      }
      if(this.chkValid('7')) return;

      //저장된 데이터이면
      if(!this.mixin_isEmpty(this.SURVEYT_LIST[index].QUESTION[this.qIdx].SRVY_QITEM_ID)){
        this.showAlert(
          {
            alertDialogToggle: true,
            msg: '선택한 질문을 복제하시겠습니까?',
            iconClass: 'is-info',
            type: 'confirm',
            callYes: async () => {
                this.$refs.svyQitemDetailRef.copyQitem();
                this.qIdx = -1;
            },
            callNo: this.closeMsg
          }
        )
      } else {
        this.showAlert(this.MESSAGE.ALERT.SAVE_QITEM);
      }
    },
    //질문 불러오기
    openQuestionTemplate(index) {
      if(this.mixin_isEmpty(this.SURVEYT_LIST[index].SRVY_QITEM_GROUP_ID)){
        this.showAlert(this.MESSAGE.ALERT.ETC4_WARNING);
        return;
      }
      if(this.chkValid('7')) return;
      this.dialogOpenQuestionTemplate = true;
    },
    closeQuestionTemplate() {
      this.dialogOpenQuestionTemplate = false;
    },
    //질문 추가
    addChildSurveyList(index) {
      if(this.mixin_isEmpty(this.SURVEYT_LIST[index].SRVY_QITEM_GROUP_ID)){
        this.showAlert(this.MESSAGE.ALERT.ETC4_WARNING);
        return;
      }
      if(this.chkValid('7')) return;

      let newChild = {
         SRVY_QITEM_GROUP_ID : this.SURVEYT_LIST[index].SRVY_QITEM_GROUP_ID
        ,SRVY_QITEM_GROUP_NM : this.SURVEYT_LIST[index].SRVY_QITEM_GROUP_NM
        ,SRVY_QITEM_ID : ''
        ,SRVY_QITEM_CN : ''
        ,SRVY_QITEM_EXPLN : ''
        ,QITEM_TYPE_CD : 'SNGL'
        ,QITEM_TYPE_NM : '단일 선택형'
        ,ESNTL_YN : ''
        ,CHC_PM_CNT : '1'
        ,ANS_LEN_CD : ''
        ,HR_APLCN_YN : false
        ,SCR_USE_YN : false
        ,GROUP_MVMN_USE_YN : false
        ,SORT_ORD : ''
        ,FILE_GROUP_KEY : ''
        ,CHC_CNT : '0'
        ,REQUIRED : false
      };

      this.SURVEYT_LIST[index].QUESTION.push(newChild);
      let chcIndex = this.SURVEYT_LIST[index].QUESTION.length -1;
      this.questionOpen(chcIndex, this.SURVEYT_LIST[index].QUESTION[chcIndex]);
    },
    //질문 삭제
    removeChildSurveyList(index) {
      if(this.qIdx < 0) {
        this.showAlert(this.MESSAGE.ALERT.SELECT_QITEM);
        return;
      }
      if(this.mixin_isEmpty(this.SURVEYT_LIST[index].SRVY_QITEM_GROUP_ID)){
        this.showAlert(this.MESSAGE.ALERT.ETC4_WARNING);
        return;
      }
      if(this.chkValid('7')) return;

      //저장된 데이터이면
      if(!this.mixin_isEmpty(this.SURVEYT_LIST[index].QUESTION[this.qIdx].SRVY_QITEM_ID)){
        this.showAlert(
          {
            alertDialogToggle: true,
            msg: '선택한 질문을 삭제하시겠습니까?',
            iconClass: 'is-info',
            type: 'confirm',
            callYes: async () => {
              const sUrl = '/api/svy/makeitems/deleteitemmakeitems';
              const postParam = {
                SRVY_QITEM_ID : this.SURVEYT_LIST[index].QUESTION[this.qIdx].SRVY_QITEM_ID
                ,SRVY_QITEM_GROUP_ID : this.SURVEYT_LIST[index].QUESTION[this.qIdx].SRVY_QITEM_GROUP_ID
                ,QITEM_CHC_ID : ''
              }
              const headParam = {
                head: {
                  'SERVICE' : 'svy.makeitems.deleteitemmakeitems',
                  'METHOD' : 'deleteitemmakeitems',
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
                this.showAlert(this.MESSAGE.ALERT.DEL_SUCCESS);
                this.qIdx = -1;
                await this.btnSelectList();
                await this.surveyOpen(this.tab1GrpIdx);
              }
            },
            callNo: this.closeMsg
          }
        )
      }else{
        this.setRemoveChildSurveyList(index);
      }
    },
    setRemoveChildSurveyList(index){
      const filteredList = this.SURVEYT_LIST[index].QUESTION.filter((questionItem, questionIndex) => {
        return !this.checkedItems[questionIndex];
      });
      this.SURVEYT_LIST[index].QUESTION = filteredList;
      this.checkedItems = [];
      this.hdType = '';
      this.qIdx = -1;
    },

    async updateGroupSortOrd(){
      const sUrl = '/api/svy/makeitems/updateBlockSortOrd';
      const postParam = {}
      let arrGroupList = [];
      this.SURVEYT_LIST.forEach((e, i) => {
        arrGroupList.push({
          SRVY_QITEM_GROUP_ID : e.SRVY_QITEM_GROUP_ID,
          SORT_ORD : (i).toString(),
        })
      });
      postParam.GROUP_LIST = arrGroupList;
      const headParam = {
        head: {}
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (!resData.HEADER.ERROR_FLAG) {
        //this.showToast(this.MESSAGE.TOAST.SUCCESS);
      }
    },


    async moveSave(u, d, i, j, f){
      const sUrl = '/api/svy/makeitems/moveitemmakeitems';
      const postParam = {
        sendData: {}
      }
      const oData = [];
      for(let i=0; i<2; i++){
        let arrData = {
          SRVY_QITEM_ID : (i===0 ? u.SRVY_QITEM_ID : d.SRVY_QITEM_ID),
          SRVY_QITEM_GROUP_ID : (i===0 ? u.SRVY_QITEM_GROUP_ID : d.SRVY_QITEM_GROUP_ID),
          SORT_ORD : (i===0 ? d.SORT_ORD : u.SORT_ORD),
        }
        oData.push(arrData);
      }
      const headParam = {
        head: {
          'SERVICE' : 'svy.makeitems.moveitemmakeitems',
          'METHOD' : 'moveitemmakeitems',
          'TYPE' : 'BIZ_SERVICE',
        }
      }

      // sendData 세팅
      postParam.sendData['oData'] = oData;


      let resData = await this.common_postCall(sUrl, postParam.sendData, headParam );

      
      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }else{
        //재조회를 안하기 때문에 배열에 셋팅
        if(f){            //위로이동
          this.SURVEYT_LIST[i].QUESTION[j].SORT_ORD = oData[1].SORT_ORD;
          this.SURVEYT_LIST[i].QUESTION[j-1].SORT_ORD = oData[0].SORT_ORD;
        }else{            //아래로이동
          this.SURVEYT_LIST[i].QUESTION[j].SORT_ORD = oData[1].SORT_ORD;
          this.SURVEYT_LIST[i].QUESTION[j+1].SORT_ORD = oData[0].SORT_ORD;
        }

      }
    },
    moveItemUp(questionIndex, index) {
      if(this.chkValid('7')) return;

      if (questionIndex > 0) {
        const upTemp = this.SURVEYT_LIST[index].QUESTION[questionIndex];
        const downTemp = this.SURVEYT_LIST[index].QUESTION[questionIndex -1];

        this.SURVEYT_LIST[index].QUESTION.splice(questionIndex, 1, downTemp);
        this.SURVEYT_LIST[index].QUESTION.splice(questionIndex - 1, 1, upTemp);

        this.moveSave(upTemp, downTemp, index, questionIndex, true);
      }
    },
    moveItemDown(questionIndex, index) {
      if(this.chkValid('7')) return;

      if (questionIndex < this.SURVEYT_LIST[index].QUESTION.length - 1) {
        const upTemp = this.SURVEYT_LIST[index].QUESTION[questionIndex];
        const downTemp = this.SURVEYT_LIST[index].QUESTION[questionIndex +1];
        downTemp.SORT_ORD = upTemp.SORT_ORD + 1;
        console.log("upTemp================::",upTemp);
        console.log("downTemp================::",downTemp);
        this.SURVEYT_LIST[index].QUESTION.splice(questionIndex, 1, downTemp);
        this.SURVEYT_LIST[index].QUESTION.splice(questionIndex + 1, 1, upTemp);

        this.moveSave(upTemp, downTemp, index, questionIndex, false);
      }
    },

    btnExDownLoad(){
      this.mixin_common_exportExcelHeader(this.excelTemplateHeaders, '설문조사_업로드_템플릿', 'sheet', '00B0F0');
    },
    btnExUpload(){
      if(this.chkValid('1')) return;
      if(this.chkValid('6')) return;
      if(this.chkValid('7')) return;

      this.tab2Init();
      this.$refs.excelRef.$refs.input.value = null;
      this.$refs.excelRef.$refs.input.click();
    },

    //엑셀 업로드
    getExcelData(upload_headers, upload_bodys) {
      this.openProgressBar();
      this.gridDataHeaders = [];
      this.gridDataHeaders = _.cloneDeep(upload_headers);
      //key헤더추가
      this.gridDataHeaders.push({text : '설문계획ID', value : 'SRVY_ID', align: ' d-none'})

      this.gridDataText = _.cloneDeep(upload_bodys);
      //CUST_PHN_NO 값이 들어있는 행만 필터로 가지고 온다.
      this.gridDataText = this.gridDataText.filter(filterItem => {
          return filterItem.CUST_PHN_NO != null && filterItem.CUST_PHN_NO != ''
      })
      
      this.gridDataText.forEach(e => {
        e.SRVY_ID = this.SRVY_NM;
        e.CUST_NM = e.CUST_NM || '';
        e.CUST_PHN_NO = e.CUST_PHN_NO || '';
        e.EML = e.EML || '';

        //참여자 엑셀 다운로드한걸 업로드 시 아래 정보들까지 목록에 출력되어 초기화 처리.
        e.MSG_CNT = '';
        e.MSG_TY = '';
        e.MSG_DT = '';
        e.SRVY_RSPNS_YN = '';
        e.SRVY_RSPNS_DT = '';
        e.REG_DT = '';
        e.RGTR_ID = '';
        e.SRVY_TRGT_ID = '';
      });
      
      //전화번호 중복 체크 - 첫번째 항목만 남기고 나머지는 삭제한 후 메시지로 삭제 목록을 알려준다.
      //설문 제외 참여자 체크 - 설문 제외자 삭제 후 메시지로 삭제 목록을 알려준다.
      this.checkExcelUploadTargetList();
      
      //roww_number header 및 값 설정.
      this.gridDataHeaders.unshift({ text: '번호',           value: 'ROW_NUMBER',          align: 'center',        width: '80px' })
      this.gridDataText.forEach((e, index) => {
        e.ROW_NUMBER = index + 1;
      });
      this.gridTotalCnt = this.gridDataText.length;
      this.closeProgressBar();
    },

    //전화번호 중복 체크 - 첫번째 항목만 남기고 나머지는 삭제한 후 메시지로 삭제 목록을 알려준다.
    //설문 제외 참여자 체크 - 설문 제외자 삭제 후 메시지로 삭제 목록을 알려준다.
    //checkType - upload : 엑셀 업로드, save : 저장
    async checkExcelUploadTargetList() {
      let checkedTargetList = [];
      let dupTargetList = [];
      this.gridDataText.map((item, index) => {
        const dupItem = this.gridDataText.slice(0, index+1).filter(filterItem => {
          return item.CUST_PHN_NO == filterItem.CUST_PHN_NO
        })
        if(dupItem.length == 1) {
          checkedTargetList.push(item);
        } else {
          dupTargetList.push(item)
        }
      })

      this.gridDataText = _.cloneDeep(checkedTargetList);

      await this.getExclusionTargetList();
      checkedTargetList = []
      let exclusionTargetList = [];
      this.gridDataText.map((item) => {
        const exlItem = this.EXCLUSION_TARGET_LIST.find(filterItem => (item.CUST_PHN_NO == filterItem.CUST_PHN_NO))
        if(exlItem == undefined) {
          checkedTargetList.push(item);
        } else {
          exclusionTargetList.push(item)
        }
      })


      this.gridDataText = checkedTargetList;
      let alertMsg = '';
      if(dupTargetList.length > 0) {
        alertMsg += '중복된 전화번호의 참여자가 제외되었습니다.<br/>중복 참여자 목록<br/>';
        dupTargetList.map(item => {
          alertMsg += item.CUST_NM + ' / ' + item.CUST_PHN_NO + '<br/>'
        })
        if(exclusionTargetList.length > 0) {
          alertMsg += '<br/><br/>'
        }
      }

      if(exclusionTargetList.length > 0) {
        alertMsg += '설문참여 제외자가 제외되었습니다.<br/>설문참여 제외자 목록<br/>';
        exclusionTargetList.map(item => {
          alertMsg += item.CUST_NM + ' / ' + item.CUST_PHN_NO + '<br/>'
        })
      }

      if(!this.mixin_isEmpty(alertMsg)) {
        this.showAlert({alertDialogToggle : true, msg:alertMsg, iconClass: 'is-info', type:'default'})
      }
    },

    //참여자설정 저장
    btnSaveTab2(){
      if(this.chkValid('1')) return;
      if(this.chkValid('4')) return;
      if(this.chkValid('5')) return;
      if(this.chkValid('7')) return;

      this.showAlert(this.MESSAGE.CONFIRM.REG_TAB2);
    },

    //참여자 엑셀 업로드 전 참여자 정보 체크, 필수값, 중복번호, 제외자.
    async checkUploadData() {
      let leng = this.gridDataText.length;
      if(this.srvyExpsnAttrList.length > 0) {
        for(let i=0; i<this.srvyExpsnAttrList.length; i++) {
          const expsn = this.srvyExpsnAttrList[i];
          for(let j=0; j<leng; j++) {
            if(expsn.ESNTL_YN == 'Y' && this.mixin_isEmpty(this.gridDataText[j][expsn.EXPSN_ATTR_COL_ID])) {
              this.showAlert({alertDialogToggle: true, msg: this.gridDataText[j].CUST_NM + ' 참여자의 ' + expsn.EXPSN_ATTR_NM + ' 은(는) 필수입니다.', iconClass: 'is-caution', type: 'default'});
              return;
            }
          }
        }
      }
      
      const alertMsg = await this.checkTargetList(this.gridDataText);
      if(!this.mixin_isEmpty(alertMsg) && this.CHECKED_EXCLUSION_TARGET_LIST.length > 0) {
        this.showAlert({
          alertDialogToggle: true, 
          msg: '설문참여 제외자를 모두 삭제하고 저장하시겠습니까?<br/>' + alertMsg, 
          iconClass: 'is-info', 
          type: 'confirm', 
          callYes: () => {
            this.gridDataText = this.gridDataText.filter(item => {
              return this.CHECKED_EXCLUSION_TARGET_LIST.find(filterItem => {
                return (item.CUST_PHN_NO == filterItem.CUST_PHN_NO)
              }) == undefined
            })
            this.setUploadData();
            
          }, callNo: this.closeMsg
        })
        return;
      } else if(!this.mixin_isEmpty(alertMsg) && this.CHECKED_EXCLUSION_TARGET_LIST.length == 0) {
        this.showAlert({alertDialogToggle : true, msg:alertMsg, iconClass: 'is-info', type:'default'})
        return;/////////////////////////
      }

      this.setUploadData();
    },

    async setUploadData(){
      const sUrl = '/api/svy/makeitems/uploadexcelmakeitems';
      const postParam = {
        sendData: {}
      }
      const headParam = {
        head: {
          'SERVICE' : 'svy.makeitems.uploadexcelmakeitems',
          'METHOD' : 'uploadexcelmakeitems',
          'TYPE' : 'BIZ_SERVICE',
        },
        timeout: 3600000
      }

      postParam.sendData["oData"] = this.gridDataText;
      this.openProgressBar();
      let resData = await this.common_postCall(sUrl, postParam.sendData, headParam );
      this.closeProgressBar();
      if (!resData.HEADER.ERROR_FLAG) {
        this.closeMsg();
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.tab2SelectList(false);
      }
    },


    async checkTargetList(targetList) {
      await this.getExclusionTargetList();
      this.CHECKED_EXCLUSION_TARGET_LIST = [];
      targetList.map((item) => {
        const exlItem = this.EXCLUSION_TARGET_LIST.find(filterItem => (item.CUST_PHN_NO.replace(/-/gi, '') == filterItem.CUST_PHN_NO))
        if(exlItem != undefined) {
          this.CHECKED_EXCLUSION_TARGET_LIST.push(item)
        }
      })

      let alertMsg = '';
      
      if(this.CHECKED_EXCLUSION_TARGET_LIST.length > 0) {
        //alertMsg += '설문참여 제외자가 있습니다.<br/>';
        this.CHECKED_EXCLUSION_TARGET_LIST.map(item => {
          alertMsg += item.CUST_NM + ' / ' + item.CUST_PHN_NO + '<br/>'
        })
      }

      return alertMsg;
    },


    //설문참여 제외 대상자 목록 조회
    async getExclusionTargetList() {
      const sUrl = '/api/svy/exclusion/selectTargetList';
      const postParam = {
        EXL_SE_CD: this.EXL_SE_CD,
        SRCH_TP: this.SRCH_TP,
        SRCH_KEYWORD: this.SRCH_KEYWORD,
        DUP_CHECK_YN:'Y'
      }
      const headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );


      if (!resData.HEADER.ERROR_FLAG) {
        this.EXCLUSION_TARGET_LIST = resData.DATA
      }
    },


    async setSettingData(){
      const sUrl = '/api/svy/makeitems/updatesettingplan';
      const postParam = {
        SRVY_ID : this.SRVY_NM
        ,PSNAL_LMT_SBMSN_STNG_YN : this.PSNAL_LMT_SBMSN_STNG_YN
        ,CLCT_AGRE_USE_YN : this.CLCT_AGRE_USE_YN
        ,SRVY_YMD_INDCT_YN : (this.SRVY_YMD_INDCT_YN ? 'N' : 'Y')
        ,SBMSN_END_MSG : this.SBMSN_END_MSG
      }
      const headParam = {
        head: {
          'SERVICE' : 'svy.makeitems.updatesettingplan',
          'METHOD' : 'updatesettingplan',
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
        this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS);
        this.tab3SelectList();
      }
    },
    //응답설정 저장
    btnSaveTab3(){
      if(this.chkValid('1')) return;
      if(this.chkValid('7')) return;

      this.showAlert(this.MESSAGE.CONFIRM.REG_TAB3);
    },

    displayChildRequired(item) {
      return item === true ? '필수항목' : '옵션항목'
    },
    displayChildType(itemType) {
      const typeList = [
        { QITEM_TYPE_NM: '단일 선택형', QITEM_TYPE_CD: 'SNGL' },
        { QITEM_TYPE_NM: '복수 선택형', QITEM_TYPE_CD: 'MULT' },
        { QITEM_TYPE_NM: '목록 선택형', QITEM_TYPE_CD: 'LIST' },
        { QITEM_TYPE_NM: '주관식 단답형', QITEM_TYPE_CD: 'SHOT' },
        { QITEM_TYPE_NM: '주관식 서술형', QITEM_TYPE_CD: 'DESC' },
        { QITEM_TYPE_NM: '날짜 선택형', QITEM_TYPE_CD: 'DATE' },
      ];

      for (let i = 0; i < typeList.length; i++) {
        if (typeList[i].QITEM_TYPE_CD === itemType) {
          return typeList[i].QITEM_TYPE_NM;
        }
      }
    },
    //사용안함. 저장시 한번에 처리.
    async setImgUpload(fileData){
      const sUrl = '/api/svy/makeitems/updateimgmakeitems';
      const postParam = {
        SRVY_QITEM_GROUP_ID : this.gHdData.SRVY_QITEM_GROUP_ID
        ,FILE_GROUP_KEY : fileData.data[0].fileGroupKey
      }

      const headParam = {
        head: {
          'SERVICE' : 'svy.makeitems.updateimgmakeitems',
          'METHOD' : 'updateimgmakeitems',
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
        this.showAlert(this.MESSAGE.ALERT.MOD_SUCCESS);
        this.btnSelectList();
      }
    },
    //파일 업로드
    uploadFiles(files) {
      let busiType = 'svy';
      let pathType = 'images';
      let uploadUrl = "api/file/"+ busiType +"/"+ pathType +"/uploads";

      //파일 제한 체크 (빽엔드에서 체크 후 업로드 실패)
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('action', uploadUrl);
        formData.append('method', "post");
        formData.append('custcoId', this.$store.getters['userStore/GE_USER_ROLE'].company.CD);                 //회사구분 : 1은 시스템(가이드)
        formData.append('userfiles', files[i]);           //파일(바이너리)
        formData.append('userId', this.$store.getters['userStore/GE_USER_ROLE'].userId);                   //사용자 ID : 2는 시스템(가이드)
      }
      // 서버로 파일 업로드 요청을 보냅니다.
      axios
      .post(uploadUrl, formData, {headers:{Authorization: "bearer " + window.sessionStorage.getItem("token")}})
        .then(response => {
          // 파일 업로드 성공 시 처리
          // this.setImgUpload(response.data);
          // this.uploadedFiles = [];
          // this.uploadedFiles.push(response.data.data[0]);
          let imgUrl = `/upload/`;
          const filePath = response.data.data[0].filePath.split('/');
          filePath.forEach(e => {
            imgUrl += `${e}/`
          });
          imgUrl += response.data.data[0].strgFileNm;
          // this.gHdData.IMG_URL = imgUrl;
          // this.gHdData.FILE_GROUP_KEY = response.data.data[0].fileGroupKey;
          this.gHdData = {
            SRVY_QITEM_GROUP_ID : this.gHdData.SRVY_QITEM_GROUP_ID,
            SRVY_ID : this.gHdData.SRVY_ID,
            SRVY_QITEM_GROUP_NM : this.gHdData.SRVY_QITEM_GROUP_NM,
            SRVY_QITEM_GROUP_CN : this.gHdData.SRVY_QITEM_GROUP_CN,
            SORT_ORD : this.gHdData.SORT_ORD,
            FILE_GROUP_KEY : response.data.data[0].fileGroupKey,
            IMG_URL : imgUrl
          }
        })
        .catch(error => {
          // 파일 업로드 실패 시 처리
          this.showAlert(this.MESSAGE.ERROR.ERROR);
        });
    },
    //실제 파일이 서버에 올라가는 부분
    handleFileUpload(event) {
      const files = event.target.files;

      //파일 제한 체크 (프론트에서 체크하고 업로드 로직 실행x)
      if (files.length > 0 && this.isValidFiles(files)) {
        // 파일 업로드
        this.uploadFiles(files);
      }
    },
    //파일개수 제한(파일개수 체크)
    isValidFiles(files) {
      // 파일 개수 제한을 설정
      const maxFileCount = 1;
      if (files.length > maxFileCount) {
        this.showAlert(this.MESSAGE.ALERT.ETC21_WARNING);
        return false;
      }

      // 파일 크기 및 형식을 설정 (대소문자 구분)
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxFileSize = 5 * 1024 * 1024; // 5MB
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!allowedFileTypes.includes(file.type)) {
          this.showAlert(this.MESSAGE.ALERT.ETC22_WARNING);
          return false;
        }
        if (file.size > maxFileSize) {
          this.showAlert(this.MESSAGE.ALERT.ETC23_WARNING);
          return false;
        }
      }

      return true;
    },
    addFile(){
      if(this.chkValid('7')) return;

      this.$refs.fileUpload.click()


      /*
      let busiType = "srvy";   //palette, phone, chat, km, bbs
      let pathType = "files"; //publics,files,images,videos
      this.dropZoneParam = {
        ASP_NEWCUST_KEY : this.ASP_NEWCUST_KEY,
        fileGroupKey : this.FILE_GROUP_KEY,
        // custcoId : this.stoUserComp.CD,      //회사코드
        pathType : pathType, //publics,files,images,videos
        busiType : busiType, //palette, phone, chat, km, bbs
        acceptedFiles : ".png,.jpg,.gif,.jpeg",
        userOptions :{
          parallelUploads: 1,
          url : "http://localhost:8443/" + "api/file/"+ busiType +"/"+ pathType +"/uploads",
          //url : "http://local.hkpalette.com:6001/" + "api/file/"+ busiType +"/"+ pathType +"/uploads",
        }
      };
      this.showDialog('VueDropzone');
      // this.mixin_showDialog('VueDropzone'); // 다이얼로그 띄우기
      */
    },
    // 첨부파일 팝업 업로드 후
    // async uploadFileResponse(data){
    //   this.hideDialog('VueDropzone');
    //   this.FILE_GROUP_KEY = data[0].fileGroupKey;

    //   let resList = await this.mixin_getFileList(data[0].fileGroupKey);
    //   // this.setFileList(resList)
    // },
    delFile(){
      if(this.chkValid('7')) return;
      if(this.mixin_isEmpty(this.gHdData.IMG_URL)) return;

      this.showAlert(this.MESSAGE.CONFIRM.DEL_IMG);
    },
    async delImg(){
      //동일 파일명 업로드 시 change 이벤트가 실행되지 않아 value 초기화.
      this.$refs.fileUpload.value = '';

      const sUrl = '/api/svy/makeitems/deleteheaderimgmakeitems';
      const postParam = {
        SRVY_QITEM_GROUP_ID : this.gHdData.SRVY_QITEM_GROUP_ID,
        FILE_GROUP_KEY: this.gHdData.FILE_GROUP_KEY,
      }
      const headParam = {
        head: {
          'SERVICE' : 'svy.makeitems.deleteheaderimgmakeitems',
          'METHOD' : 'deleteheaderimgmakeitems',
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
        this.closeMsg();
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.btnSelectList();
      }
    },

    //설문지 게시
    btnSrvyOpen(e){
      if(this.chkValid('1')) {
        return;
      }

      if(e === 'PUBCMP') {
        //설문 게시 체크
        if(this.chkValid('10')) return;
        if(this.chkValid('9')) return;
      } else if(e === 'APPR') {
        //게시 취소 체크
        if(this.chkValid('8')) return;
      }

      //승인 요청(승인대기)
      if(e === 'RDY') {
        if(this.chkValid('9')) return;
        if(this.gTrgtDsgnYn == 'Y' && this.gridDataText.length == 0) {
          this.showAlert(this.MESSAGE.ALERT.ETC17_WARNING)
          return
        }
        this.dialogOpenSttsUpdate = true;
        this.UPDATE_STTS_CD = e;
        return;
      }

      let msg = ''
      if(this.BY_PASS && e === 'PUBCMP') msg = `즉시진행을 선택한 경우 진행상태가 진행중으로 처리됩니다.`;
      msg += ' 게시하시겠습니까?';

      this.showAlert(
        {
          alertDialogToggle: true,
          msg: (e === 'PUBCMP' ? msg : e === 'PRPARG' ? '승인 요청을 취소하시겠습니까?' : '게시를 취소하시겠습니까?'),
          iconClass: 'is-info',
          type: 'confirm',
          callYes: async () => {
            // let url = Math.random().toString(36).substring(2, 10) + this.SRVY_NM;
            const sUrl = '/api/svy/makeitems/updatesrvyopen';
            const postParam = {
              SRVY_ID : this.SRVY_NM
              ,STTS_CD : (e === 'PUBCMP' && this.BY_PASS ? 'ONGONG' : e)
              ,PSTG_YN : (e === 'PUBCMP' ? 'Y' : (e === 'APPR' ? 'N' : ''))
              // ,URL : (e === 'PUBCMP' ? `SVY?url=${url}` : '')
              ,TRGT_YN : this.gTrgtDsgnYn
              ,BY_PASS : this.BY_PASS ? 'Y' : '' //즉시진행 체크
              ,CN : (e === 'PUBCMP' ? '승인완료 -> 설문게시' : e === 'APPR' ? '설문게시 -> 게시취소' : e === 'PRPARG' ? '승인대기 -> 승인요청 취소' : '')
            }
            const headParam = {
              head: {
                'SERVICE' : 'svy.makeitems.updatesrvyopen',
                'METHOD' : 'updatesrvyopen',
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
              this.showAlert((e === 'PUBCMP' ? this.MESSAGE.ALERT.CLS_SUCCESS : this.MESSAGE.ALERT.CAN_SUCCESS));
              this.btnSelectList();
            }
          },
          callNo: this.closeMsg
        }
      )
    },
    
    async btnShowSmsPop(){
      if(this.gridDataText.length < 1){
        this.showAlert(this.MESSAGE.ALERT.ETC26_WARNING);
        return;
      }else if(['PRPARG','TERMIAT'].includes(this.stts_head)){
        this.showAlert(this.MESSAGE.ALERT.ETC27_WARNING);
        return;
      }else if(this.mixin_isEmpty(this.SRVY_URL)){
        this.showAlert(this.MESSAGE.ALERT.ETC29_WARNING);
        return;
      }else if(this.gridSelectedData.length < 1){
        this.showAlert(this.MESSAGE.ALERT.ETC25_WARNING);
        return;
      }

      let today = this.$moment(new Date()).format("YYYYMMDDHHmmss");
      let todayFormat = today.substring(0,4) + "-" + today.substring(4,6) + "-" + today.substring(6,8);
      // 발송일자
      this.SEND_DATE = todayFormat;
      // 발송시간
      this.SEND_TIME = today.substring(8, 10) + ":" + today.substring(10, 12) ;
      // 발송자 번호
      this.CALLBACK_NUMBER = '';
      //발송 제목
      this.SEND_TTL = '';
      // 발송 메시지
      this.SEND_MESSAGE = '';
      this.TMPL_MESSAGE_SMS = '';
      this.SRCH_TMPL = {};
      // 즉시 발송 체크 여부
      this.IS_SEND_ATONCE = true;
      // 발신자 연락처 정보 조회
      this.selectCusRprs();
      this.getTempleInfo();
      this.getAtalkTempleInfo();
      if(this.mixin_isEmpty(this.EMAIL_TEMPLATE)) {
        await this.getEmailTemplate() 
      }

      //설문 발신 번호 유형
      this.envSrvyDsptchNoTp = this.mixin_isEmpty(this.mixin_getCustcoSetting('ENV_SRVY_DSPTCH_NO_TP')) ? 'DEFAULT' : this.mixin_getCustcoSetting('ENV_SRVY_DSPTCH_NO_TP');

      this.mixin_showDialog('SendGuideSms');
    },


    async checkSendSms() {
      if(this.computedSelectedRadio == 'SMS' && this.mixin_isEmpty(this.SEND_MESSAGE)) {
        this.showAlert({alertDialogToggle: true, msg: "문자 내용을 입력해 주세요.", iconClass: 'is-info', type: 'default'});
        return false;
      }else if(this.computedSelectedRadio == 'KAKAO' && this.mixin_isEmpty(this.SRCH_TMPL.TMPL_CD)) {
        this.showAlert({alertDialogToggle: true, msg: "발송 템플릿을 선택해 주세요.", iconClass: 'is-info', type: 'default'});
        return false;
      }

      //제외자 체크.
      if(this.gridSelectedData.length > 0) {
        const alertMsg = await this.checkTargetList(this.gridSelectedData);

        if(!this.mixin_isEmpty(alertMsg) && this.CHECKED_EXCLUSION_TARGET_LIST.length > 0) {
          
          this.showAlert({
            alertDialogToggle: true, 
            msg: '설문참여 제외자가 있습니다.<br/>안내문자 발송에서 제외하고 진행하시겠습니까?<br/>' + alertMsg, 
            iconClass: 'is-info', 
            type: 'confirm', 
            callYes: () => {
              this.gridSelectedData = this.gridSelectedData.filter(item => {
                return this.CHECKED_EXCLUSION_TARGET_LIST.find(filterItem => {
                  return (item.CUST_PHN_NO == filterItem.CUST_PHN_NO)
                }) == undefined
              })
              this.sendSms();
              
            }, callNo: this.closeMsg
          })
          return;
        } else if(!this.mixin_isEmpty(alertMsg) && this.CHECKED_EXCLUSION_TARGET_LIST.length == 0) {
          this.showAlert({alertDialogToggle : true, msg:alertMsg, iconClass: 'is-info', type:'default'})
          return;/////////////////////////
        }
        this.sendSms();

      }
    },

    async sendSms(){
      let msg = '';
      let msgTxt = '';

      let tempGridData = [];

      if(this.IS_SEND_PART){
        if(this.IS_SEND_SEND){
          //참여자,발송자 제외
          for(let i=0;i<this.gridSelectedData.length;i++){
            //설문참여여부 != '참여' && 메시지 발송횟수 < 1
            if(this.gridSelectedData[i].SRVY_RSPNS_YN != '참여' && this.gridSelectedData[i].MSG_CNT == ''){
              tempGridData.push(this.gridSelectedData[i])
            }
          }
          msg = msgTxt + '참여자와 발송자를 제외한 ' + tempGridData.length + '건을 전송하시겠습니까?'
        } else {
          //참여자만 제외
          for(let i=0;i<this.gridSelectedData.length;i++){
            //설문참여여부 != '참여'
            if(this.gridSelectedData[i].SRVY_RSPNS_YN != '참여'){
              tempGridData.push(this.gridSelectedData[i])
            }
          }
          msg = msgTxt + '참여자를 제외한 ' + tempGridData.length + '건을 전송하시겠습니까?'
        }
      } else {
        if(this.IS_SEND_SEND){
          //발송자 제외
          for(let i=0;i<this.gridSelectedData.length;i++){
            //메시지 발송횟수 < 1
            if(this.gridSelectedData[i].MSG_CNT == ''){
              tempGridData.push(this.gridSelectedData[i])
            }
          }
          msg = msgTxt + '발송자를 제외한 ' + tempGridData.length + '건을 전송하시겠습니까?'
        } else {
          //제외 없음
          tempGridData = this.gridSelectedData;
          msg = msgTxt + tempGridData.length + '건을 전송하시겠습니까?'
        }
      }

      if(tempGridData.length == 0){
        msg = '발송대상자가 없습니다'
        this.showAlert({alertDialogToggle: true, msg: msg, iconClass: 'is-info', type: 'default'});
        return;
      }
      this.showAlert(
      {
        alertDialogToggle: true,
        msg: msg,
        iconClass: 'is-info',
        type: 'confirm',
        callYes: async () => {
          //마우스 따닥건 방지. 바로 닫아야 중복 발송 안됨.
          this.closeMsg();
          if(this.computedSelectedRadio == 'SMS'){
            //this.getTempleInfo(tempGridData);
            this.sendMsg(tempGridData);
          } else if(this.computedSelectedRadio == 'KAKAO'){
            this.sendAtalk(tempGridData);
          } else if(this.computedSelectedRadio == 'EMAIL') {
            this.sendEmail(tempGridData);
          }
        },
        callNo: this.closeMsg
      });
    },

    urlCopy(){
      // this.$copyText(this.SRVY_URL);
    },
    //테스트용
    async trgtDec(){
      const sUrl = '/api/svy/makeitems/aesurlencrypt';
      const postParam = {
        SRVY_KEY : this.SRVY_NM + '_' + this.txtTestId
      }
      const headParam = {
        head: {
          'SERVICE' : 'svy.makeitems.aesurlencrypt',
          'METHOD' : 'aesurlencrypt',
          'TYPE' : 'aesurlencrypt',
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {
        // console.log('대상자url : ', '/SVY?key=' + resData.DATA[0].URL);
      }
    },
    showDialog(menu) {
      this[`dialog${menu}`] = true;
    },
    hideDialog(menu) {
      this[`dialog${menu}`] = false;
    },
    //api오류
    setErrMsg(res){
      if(res.HEADER.ERROR_MSG == 'TRGT') this.showAlert(this.MESSAGE.ALERT.ETC17_WARNING);
      else this.showAlert(this.MESSAGE.ERROR.ERROR);
    },
    //api성공
    setOkMsg(){
      this.gSetAlert.msg = this.alertStrMsg.okMsg;
      this.gSetAlert.type = 'default';
      this.gSetAlert.iconClass = 'is-done';
    },

    async sendMsg(sendInfo){
      let sUrl = "/api/mts/send/sendSMS";
      let param = [];

      // 수신자 목록
      let data = sendInfo;
      for(let i = 0; i < data.length; i++){
        let sendSmsparam = {
          callback_number : this.CALLBACK_NUMBER
          ,phone_number : data[i].CUST_PHN_NO.replaceAll('-','')
          // ,message : this.SEND_MESSAGE == '' ? data[i].sendMsg : this.SEND_MESSAGE + '\n\r' + data[i].sendMsg
          // ,subject : this.SEND_TTL
          ,svyTrgt : data[i].SRVY_TRGT_ID
        };
        sendSmsparam["CD0"] = "CUS_NM";
        sendSmsparam["VL0"] = data[i].CUST_NM;
        sendSmsparam["CD1"] = "LINK";
        // 2025.09.01 URL 체크 방어로직 추가
        if(!data[i].URL_KEY.includes("/SVY?key=")){
          let msg = '설문조사 URL이 잘 못 등록되었습니다.<br>관리자에게 문의하세요!'
          this.showAlert({alertDialogToggle: true, msg: msg, iconClass: 'is-info', type: 'default'});
          return;
        }
        sendSmsparam["VL1"] = data[i].URL_KEY;
        
        if(this.srvyExpsnAttrList.length > 0) {
          this.srvyExpsnAttrList.map((expsn, index) => {
            sendSmsparam["CD" + (index + 2)] = expsn.EXPSN_ATTR_COL_ID;
            sendSmsparam["VL" + (index + 2)] = data[i][expsn.EXPSN_ATTR_COL_ID];
          })
        };
        
        param.push(sendSmsparam);
      }
      
      
      //치환 변수 갯수 설정.
      const cdCnt = 2 + this.srvyExpsnAttrList.length;

      //즉시발송/예약발송에 따른 발송일시 설정
      let sendDate = this.$moment(new Date()).format("YYYYMMDDHHmmss");
      if(!this.IS_SEND_ATONCE) {
        sendDate = this.SEND_DATE.replace(/-/gi, '') + this.SEND_TIME.replace(/:/gi, '') + '00';
      }

      let postParam = {
        /*CALLBACK_NUMBER : this.CALLBACK_NUMBER
        ,PHONE_NUMBER : this.PHONE_NUMBER
        ,*/
        ENV_SRVY_DSPTCH_NO_TP: this.envSrvyDsptchNoTp
        ,SMS_PARAM : JSON.stringify(param)
        ,FILE_GROUP_KEY : this.SMS_FILE_GROUP_KEY
        ,SEND_DATE : sendDate
        ,SEND_INTERVAL_PEOPLE: this.SEND_INTERVAL_PEOPLE
        ,SEND_INTERVAL_MIN: this.SEND_INTERVAL_MIN
        //,MESSAGE : this.SEND_MESSAGE == '' ? data[0].sendMsg : this.SEND_MESSAGE + '\n\r' + data[0].sendMsg
        //문자 템플릿에서 조회하는 방식으로 변경.
        ,MESSAGE : this.SEND_MESSAGE
        ,TENANT_ID : this.$store.getters["authStore/GE_CUSTCO_TENANT_ID"]
        ,CD_CNT: cdCnt.toString() //변수 개수
        ,SUBJECT : this.SEND_TTL
      };

      let headParam = {
        head : {},
        timeout: 3600000
      };
      this.openProgressBar();
      let resData = await this.common_postCall(sUrl, postParam, headParam);
      this.closeProgressBar();
      if (!resData.HEADER.ERROR_FLAG) {
        
        this.showAlert(this.MESSAGE.ALERT.SMS_SUCCESS);
        this.mixin_hideDialog('SendGuideSms');
        this.tab2SelectList(false);
      }
    },

    /** 대량발송 실행 */
    async sendAtalk(sendInfo){
      let sUrl = "/api/mts/send/sendAtalk";
      // 수신자 목록
      let data = sendInfo;
      let phnNo = [];
      let svyTrgt = [];
      let contents = ["CUS_NM","LINK"];
      if(this.srvyExpsnAttrList.length > 0) {
        this.srvyExpsnAttrList.map(expsn => {
          contents.push(expsn.EXPSN_ATTR_COL_ID)
        })
      };

      let transContents = [];
      for(let i = 0; i < data.length; i++){
        // 2025.09.01 URL 체크 방어로직 추가
        if(!data[i].URL_KEY.includes("/SVY?key=")){
          let msg = '설문조사 URL이 잘 못 등록되었습니다.<br>관리자에게 문의하세요!'
          this.showAlert({alertDialogToggle: true, msg: msg, iconClass: 'is-info', type: 'default'});
          return;
        }
        phnNo.push(data[i].CUST_PHN_NO.replaceAll('-',''));
        svyTrgt.push(data[i].SRVY_TRGT_ID);
        transContents.push(data[i].CUST_NM);
        transContents.push(data[i].URL_KEY);
        if(this.srvyExpsnAttrList.length > 0) {
          this.srvyExpsnAttrList.map(expsn => {
            transContents.push(data[i][expsn.EXPSN_ATTR_COL_ID]);
          })
        };
      }
      
      let sendDate = this.$moment(new Date()).format("YYYYMMDDHHmmss");
      //즉시발송/예약발송에 따른 발송일시 설정
      if(!this.IS_SEND_ATONCE) {
        sendDate = this.SEND_DATE.replace(/-/gi, '') + this.SEND_TIME.replace(/:/gi, '') + '00';
      }

      let postParam = {
         CALLBACK_NUMBER : this.CALLBACK_NUMBER
        ,ENV_SRVY_DSPTCH_NO_TP: this.envSrvyDsptchNoTp
        ,PHONE_NUMBER : phnNo
        ,SRVY_TRGT_ID : svyTrgt
        ,CONTENTS : contents
        ,TRANS_CONTENTS: transContents
        ,SEND_DATE : sendDate
        ,SEND_INTERVAL_PEOPLE: this.SEND_INTERVAL_PEOPLE
        ,SEND_INTERVAL_MIN: this.SEND_INTERVAL_MIN
        ,ATALK_ID : this.SRCH_TMPL.ATALK_ID
        ,TMPL_CD : this.SRCH_TMPL.TMPL_CD
        ,TRANS_MESSAGE : ''
        ,TRAN_SEND: this.TRAN_SEND ? "Y" : "N"
        ,TENANT_ID : this.$store.getters["authStore/GE_CUSTCO_TENANT_ID"]
      }

      let headParam = {
        head : {},
        timeout: 3600000
      }

      this.openProgressBar();
      let resData = await this.common_postCall(sUrl, postParam, headParam);
      this.closeProgressBar();

      if (!resData.HEADER.ERROR_FLAG) {
        this.showAlert(this.MESSAGE.ALERT.SMS_SUCCESS);
        this.mixin_hideDialog('SendGuideSms');
        this.tab2SelectList(false);
      }
    },


    async sendEmail(sendInfo) {
      this.SEND_TRGT_LIST = sendInfo;
      setTimeout(() => {
        eventBus.setSendEmail();
      }, 100);
      
    },

    //이메일 발송 후 처리
    sendEmailClose() {
      this.mixin_hideDialog('SendGuideSms');
    },

    async getEmailTemplate() {
      let URLData = '/api/email/getEmailTemplate';

      let postParam = {
        TMPL_TYPE_CD: 'TP_SVY',
      }
      let headParam = {
        head : {}
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        if(response.DATA.length > 0){
          this.EMAIL_TEMPLATE = response.DATA[0].TMPL_CN
        }
      }
    },

    //설문지 템플릿 검색(문자)
    async getTempleInfo(){

      // 템플릿 코드,내용,타이틀 초기화
      this.TMPL_CD = '';
      this.REPLACE_TMPL_CN = '';
      this.EPSZ_INDCT_MPIT_INFO = '';

      this.TMPL_CD = 'TP_SVY'
      let URLData = '/phone-api/placeContact/selectTempleteInfo';

      let postParam = {
        TMPL_CD: this.TMPL_CD,
        TMPL_TY: 'SMS'
      }
      let headParam = {
        head : {}
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        if(response.DATA.length > 0) {
          this.SEND_MESSAGE = response.DATA[0].TMPL_CN;
          this.SMS_FILE_GROUP_KEY = response.DATA[0].FILE_GROUP_KEY;
          
          // let data = [];
          // // 사용자에게 전달될 메시지
          // for(let i=0;i<sendinfo.length;i++){
          //   sendinfo[i].sendMsg = response.DATA[0].TMPL_CN
          // }
          // data = sendinfo;
          // this.sendMsg(data, response.DATA[0].FILE_GROUP_KEY);
        }else{
          this.SEND_MESSAGE = '';
          // this.REPLACE_TMPL_CN = '';
        }
      }
    },


    //설문지 템플릿 검색(알림톡)
    async getAtalkTempleInfo(){

      // 템플릿 코드,내용,타이틀 초기화
      this.TMPL_CD = '';
      this.REPLACE_TMPL_CN = '';
      this.EPSZ_INDCT_MPIT_INFO = '';

      this.TMPL_CD = 'BASE_TMPL_SVY'
      let URLData = '/phone-api/placeContact/selectTempleteInfo';

      let postParam = {
        TMPL_CD: this.TMPL_CD,
        TMPL_TY: 'KAKAO'
      }
      let headParam = {
        head : {}
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        if(response.DATA.length > 0) {
          this.SRCH_TMPL = response.DATA[0];
        }else{
          this.SRCH_TMPL = {};
        }
      }
      },

    //설문 참여자 개별 추가
    async strgNewTrgt(){
      let lengGrid = this.gridDataText.length
      if(this.SEL_CUST_PHN_NO == ''){
        let rtn = 'N';
        for(let i=0;i<lengGrid;i++){
          let phnNo = this.gridDataText[i].CUST_PHN_NO.replaceAll("-","");
          if(phnNo == this.NEW_TRGT_PHN_NO){
            rtn = 'Y';
            break;
          }
        }
        if(rtn == 'Y'){
          this.showAlert({alertDialogToggle : true, msg:'이미 존재하는 고객입니다',iconClass: 'is-info', type:'default'})
          return;
        }
      }

      if(this.gridDataText.length == 0 || (this.gridDataText.length != 0 && (this.gridDataText[0].SRVY_TRGT_ID == '' || this.gridDataText[0].SRVY_TRGT_ID == undefined))){
        if(this.SEL_CUST_PHN_NO == ''){
          //엑셀 저장 안한상태에서 추가
          let data = {ROW_NUMBER: this.gridDataText.length+1}
          let lengHead = this.gridDataHeaders.length
          for(let n=0;n<lengHead;n++){
            if(this.gridDataHeaders[n].value == 'CUST_NM'){
              data['CUST_NM'] = this.NEW_TRGT_NM;
            } else if(this.gridDataHeaders[n].value == 'CUST_PHN_NO') {
              data['CUST_PHN_NO'] = this.NEW_TRGT_PHN_NO;
            } else if(this.gridDataHeaders[n].value == 'EML') {
              data['EML'] = this.NEW_TRGT_EMAIL;
            } else if(this.gridDataHeaders[n].value == 'SRVY_ID') {
              data['SRVY_ID'] = this.SRVY_NM;
            } else {
              data[this.gridDataHeaders[n].value] = "";
            }
          }
          //확장 항목 값 세팅.
          if(this.srvyExpsnAttrList.length > 0) {
            this.srvyExpsnAttrList.map(expsn => {
              data[expsn.EXPSN_ATTR_COL_ID] = expsn.V_MODEL;
            })
          }
          this.gridDataText.push(data)
          this.mixin_hideDialog('AddSomeone');
          this.showAlert(this.MESSAGE.ALERT.CMPL_TRGT_ADD);
          this.initNewTrgt();
          return;
        } else {
          //엑셀 저장 안한상태에서 수정
          let leng = this.gridDataText.length
          for(let j=0;j<leng;j++){
            if(this.gridDataText[j].CUST_PHN_NO == this.SEL_CUST_PHN_NO){
              this.gridDataText[j].CUST_NM = this.NEW_TRGT_NM;
              this.gridDataText[j].CUST_PHN_NO = this.NEW_TRGT_PHN_NO;
              this.gridDataText[j].EML = this.NEW_TRGT_EMAIL;
              //확장 항목 값 세팅.
              if(this.srvyExpsnAttrList.length > 0) {
                this.srvyExpsnAttrList.map(expsn => {
                  this.gridDataText[j][expsn.EXPSN_ATTR_COL_ID] = expsn.V_MODEL;
                })
              }
              break;
            }
          }
          this.mixin_hideDialog('AddSomeone');
          this.showAlert(this.MESSAGE.ALERT.CMPL_TRGT_MODI);
          this.initNewTrgt();
          return;
        }
      }

      const sUrl = '/api/svy/makeitems/uploadSinglemakeitems';
      let postParam = {
        SRVY_ID: this.SRVY_NM,
        CUST_NM: this.NEW_TRGT_NM,
        CUST_PHN_NO: this.NEW_TRGT_PHN_NO,
        EML: this.NEW_TRGT_EMAIL,
        SRVY_TRGT_ID: this.SEL_SRVY_TRGT_ID,
        EXPSN_ATTR_CNT: this.srvyExpsnAttrList.length
      }
      //확장 항목 값 세팅.
      if(this.srvyExpsnAttrList.length > 0) {
        let detailList = [];
        this.srvyExpsnAttrList.map(expsn => {
          detailList.push({
            ATTR_ID: expsn.ATTR_ID,
            ATTR_VL: expsn.V_MODEL
          })
        })
        postParam.DETAIL_LIST = detailList;
      }

      const headParam = {
        head: {}
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if (resData.HEADER.ERROR_FLAG)
      {
        this.setErrMsg(resData);
      }
      else
      {
        this.mixin_hideDialog('AddSomeone');
        this.tab2SelectList(false);
        this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS);
        this.initNewTrgt();
      }
    },

    //추가 참여자 초기화
    initNewTrgt(){
      this.isPassCheckCustPhnNo = false;
      this.NEW_TRGT_NM = '';
      this.NEW_TRGT_PHN_NO = '';
      this.NEW_TRGT_EMAIL = '';
      this.SEL_SRVY_TRGT_ID = '';
      this.SEL_CUST_PHN_NO = '';
      if(this.srvyExpsnAttrList.length > 0) {
        this.srvyExpsnAttrList.map((expsn, index) => {
          this.$set(expsn, 'V_MODEL', '');
        })
      }
    },

    //참여자 개별추가 데이터 체크
    validateNewTrgt(){
      if(this.NEW_TRGT_NM == '' || this.NEW_TRGT_PHN_NO == ''){
        this.showAlert(this.MESSAGE.ALERT.VALID_NEW_TRGT);
        return;
      }

      if(this.srvyExpsnAttrList.length > 0) {
        for(let i=0; i<this.srvyExpsnAttrList.length; i++) {
          const expsn = this.srvyExpsnAttrList[i];
          if(expsn.ESNTL_YN == 'Y' && this.mixin_isEmpty(expsn.V_MODEL)) {
            this.showAlert({alertDialogToggle: true, msg: expsn.EXPSN_ATTR_NM + ' 은(는) 필수입니다.', iconClass: 'is-caution', type: 'default'});
            return;
          }
        }
      }

      if(!this.isPassCheckCustPhnNo) {
        this.showAlert(this.MESSAGE.ALERT.DUP_CHECK);
        return;
      }


      if(this.SEL_SRVY_TRGT_ID == '' && this.SEL_CUST_PHN_NO == ''){
        this.showAlert(this.MESSAGE.CONFIRM.REG_NEW_TRGT);
      } else {
        this.showAlert(this.MESSAGE.CONFIRM.MODI_NEW_TRGT);
      }
    },

    //참여자 그리드 클릭시 데이터 세팅
    rowClick(item){
      this.isPassCheckCustPhnNo = true;
      this.NEW_TRGT_NM = item.CUST_NM;
      this.NEW_TRGT_PHN_NO = item.CUST_PHN_NO.replaceAll("-","");
      this.NEW_TRGT_EMAIL = item.EML;
      this.SEL_ROW_NUMBER = item.ROW_NUMBER;
      this.SEL_SRVY_TRGT_ID = item.SRVY_TRGT_ID;
      this.SEL_CUST_PHN_NO = item.CUST_PHN_NO;
      if(this.srvyExpsnAttrList.length > 0) {
        this.srvyExpsnAttrList.map(expsn => {
          expsn.V_MODEL = item[expsn.EXPSN_ATTR_COL_ID];
        })
      }
    },

    //로우 클릭시 색상 변경
    isActiveRow(item) {
      if(item.SRVY_TRGT_ID == ''){
        const activeClass = item.CUST_PHN_NO == this.SEL_CUST_PHN_NO ? "active" : "";
        return activeClass;
      } else {
        const activeClass = item.SRVY_TRGT_ID == this.SEL_SRVY_TRGT_ID ? "active" : "";
        return activeClass;
      }
    },

    //참여자 삭제
    async delTrgt(){
      let delList = this.gridSelectedData
      if(delList != undefined && delList.length > 0 && delList[0].SRVY_TRGT_ID == '') {
        delList.map(item => {
          for(let i=0; i<this.gridDataText.length; i++) {
            if(item.CUST_NM == this.gridDataText[i].CUST_NM && item.CUST_PHN_NO == this.gridDataText[i].CUST_PHN_NO) {
              this.gridDataText.splice(i, 1);
              break;
            }
          }
        })
        this.gridDataText.forEach((e, index) => {
          e.ROW_NUMBER = index + 1;
        });

        this.closeMsg();
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
      } else {
        let URLData = '/api/svy/delTrgt';

        let postParam = {
          SRVY_TRGT_LIST: delList
        }
        let headParam = {
          head : {
            DATA_OBJECT: "SRVY_TRGT_LIST",
          }
        }

        let response = await this.common_postCall(URLData, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG) {
          this.showAlert(this.MESSAGE.ALERT.TRGT_DEL_SUCCESS);
          this.tab2SelectList(false);
        }
      }
      
    },

    // 알림톡 템플릿
    atalkTmpl(){
      this.mixin_showDialog('Template');
      this.selectAtalkTmplList();
    },

    // 알림톡 템플릿 선택
    selectedItem(item){
      // 선택한 템플릿 초기화
      this.SRCH_TMPL = {};
      this.SRCH_TMPL = item;

      this.mixin_hideDialog('Template');
    },

    // 알림톡 단건 전송 템플릿 조회
    async selectAtalkTmplList(){
      let sUrl = "/phone-api/singleAtalk/selectAtalkTemplete";
      let postParam = {
      };
      let headParam = {
        head : {}
      };
      let response = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.items = response.DATA;
      }
    },

    // 알림톡 템플릿 상태
    displayStatus(type) {
      const typeList = [
        { type_list_text: '승인', type_list_type: 'main' },
        { type_list_text: '미등록', type_list_type: 'error' },
      ];

      for (let i = 0; i < typeList.length; i++) {
        if (typeList[i].type_list_text === type) {
          return typeList[i].type_list_type;
        }
      }
    },

    tmplDel(){
      this.SRCH_TMPL = {};
    },

    // mark: 질문 불러오기
    // tree
    expandAll(id){
      this.expanded = true;
      this.$refs[id].updateAll(true);
    },
    collapseAll(id){
      this.expanded = false;
      this.$refs[id].updateAll(false);
      this.openTreeRoot()
    },

    // 문자 템플릿 버튼
    async openFindSmsTemplate(){
        this.dialogOpenMsgTemplate = true;
    },
    //문자 템플릿 적용
    applySmsTemplate(msg, fileList) {
      this.SEND_MESSAGE = msg;
      this.SMS_FILE_GROUP_KEY = fileList && fileList.length > 0 ? fileList[0].FILE_GROUP_KEY : '';
      this.dialogOpenMsgTemplate = false;
    },
    closeFindSmsTemplate() {
      this.dialogOpenMsgTemplate = false;
    },
    closeSttsUpdate() {
      this.dialogOpenSttsUpdate = false;
    },

    //전화번호 중복 체크
    async checkCustPhnNo() {
      //전화번호 중복 체크.
      const dupItem = this.gridDataText.find(item => (((item.SRVY_TRGT_ID == '' && item.ROW_NUMBER != this.SEL_ROW_NUMBER) || item.SRVY_TRGT_ID != this.SEL_SRVY_TRGT_ID) && item.CUST_PHN_NO.replace(/-/gi, '') == this.NEW_TRGT_PHN_NO))
      if(dupItem == undefined) {
        this.isPassCheckCustPhnNo = true;
      }
      if(this.isPassCheckCustPhnNo) {
        //설문 참여 제외자 체크
        await this.getExclusionTargetList();
        const exlItem = this.EXCLUSION_TARGET_LIST.find(filterItem => (this.NEW_TRGT_PHN_NO.replace(/-/gi, '') == filterItem.CUST_PHN_NO))
        if(exlItem == undefined) {
          this.showAlert(this.MESSAGE.ALERT.PASS_DUP_CHECK);
        } else {
          this.isPassCheckCustPhnNo = false;
          this.showAlert(this.MESSAGE.ALERT.EXCLUSION_CUST_PHN_NO);
        }
      } else {
        this.showAlert(this.MESSAGE.ALERT.DUP_CUST_PHN_NO);
      }

      
      
      
    },

    changeCustPhnNo() {
      this.isPassCheckCustPhnNo = false;
    },

    openProgressBar() {
      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
    },
    closeProgressBar() {
      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
    },

    toggleSelectAllTrgt(grid) {
      if(grid == '2'){
        if (this.isSelectedAllTrgt2) {
          this.SEL_EXL_COND_TRGT_LIST = [...this.EXL_COND_TRGT_LIST];
        } else {
          this.SEL_EXL_COND_TRGT_LIST = [];
        }
      } else if (grid == '3'){
        if (this.isSelectedAllTrgt3) {
          this.SEL_EXL_COND_SET_TRGT_LIST = [...this.EXL_COND_SET_TRGT_LIST];
        } else {
          this.SEL_EXL_COND_SET_TRGT_LIST = [];
        }
      } else {
        if (this.isSelectedAllTrgt) {
          this.gridSelectedData = [...this.gridDataText];
        } else {
          this.gridSelectedData = [];
        }
      }
    },

    btnExlCond(){
      this.dialogTab = 'exlCond'
      this.getDeptList();
      this.getGridList(false);
      this.mixin_showDialog('ExlCond');
    },

    async getDeptList(){
      this.SRCH_DEPT_LIST=[{
        text:'전체'
        , value:''
      }];
      let deptCdList = await this.mixin_getDeptList();
      for(let i=0;i<deptCdList.length;i++){
        let list = {
          text:deptCdList[i].DEPT_NM
          , value: deptCdList[i].DEPT_ID
        }
        this.SRCH_DEPT_LIST.push(list);
      }
    },

    async getGridList(next){
      this.SEL_EXL_COND_LIST = [];
      //다음버튼 클릭 유무
      if (!next){
        this.pagination.page = 1; //페이징 처리 초기화
        this.selectedData = [];
        this.gridTotalCnt = 0;
      }

      let sUrl = '/api/svy/exclusion/selectConditionList';
      let postParam = {
        DEPT_ID: this.SRCH_DEPT_ID
        , EXL_COND_SE_CD: this.SRCH_EXL_COND_SE_CD
        , EXL_COND_CD : this.SRCH_EXL_COND_CD
        , EXL_COND_CN : this.SRCH_EXL_COND_CN
        , USE_YN : this.SRCH_USE_YN
        , DEL_YN : this.SRCH_DEL_YN
        , MSG_DT_YN : 'N'
      }

      let headParam = {
        head : {
          PAGING: 'Y',
          ROW_CNT: this.pagination.rowsPerPage,
          PAGES_CNT: this.pagination.page
        }
      }

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        if(next){
          // 다음검색
          let tempDataText = response.DATA;
          let idx = this.EXL_COND_LIST.length + 1;
          for(let i in tempDataText){
            tempDataText[i]["ROW_NUMBER"]= idx++;
          }
          this.EXL_COND_LIST = [...this.EXL_COND_LIST, ...tempDataText];
          
        }else{
          // 조회
          this.EXL_COND_LIST = response.DATA;
        }
        // 전체 건수
        if(this.EXL_COND_LIST.length > 0) this.gridTotalCnt = response.DATA[0].TWB_PAGING_TOT_COUNT;

        // 다음검색 버튼 활성화 여부
        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false // 버튼 활성화
          }else{
            this.nextDisabled = true  // 버튼 비활성화
          }
        }

        this.pagination.page += 1;
        // this.page=1;
      }
    },

    isExlCondActiveRow(item){
      const activeClass = item === this.SEL_EXL_COND ? "active" : "";
      return activeClass;
    },

    rowExlCondSelect(item){
      this.SEL_EXL_COND = item
    },

    isExlCondTrgtActiveRow(item){
      const activeClass = item === this.SEL_EXL_COND_TRGT ? "active" : "";
      return activeClass;
    },

    rowExlCondTrgtSelect(item){
      this.SEL_EXL_COND_TRGT = item
    },

    isExlCondSetTrgtActiveRow(item){
      const activeClass = item === this.SEL_EXL_COND_SET_TRGT ? "active" : "";
      return activeClass;
    },

    rowExlCondSetTrgtSelect(item){
      this.SEL_EXL_COND_SET_TRGT = item
    },
    

    nextProc(){
      if(this.dialogTab=='exlCond'){
        this.dialogTab = 'exlTrgt';

        this.EXL_COND_TRGT_LIST = [];
        let trgtList = [];
        for(let i=0;i<this.SEL_EXL_COND_LIST.length;i++){
          let id = this.SEL_EXL_COND_LIST[i].SRVY_EXL_COND_ID;
          let exlCond = this.SEL_EXL_COND_LIST[i].EXL_COND_SE_CD;
          let cond = this.SEL_EXL_COND_LIST[i].EXL_COND_NM;
          let condVl = this.SEL_EXL_COND_LIST[i].EXL_COND_CN;
          let condReason = this.SEL_EXL_COND_LIST[i].EXL_COND_TEXT;
          for(let n=0;n<this.gridDataText.length;n++){
            let data = this.gridDataText[n];
            let trgt = true;
            switch(cond){
              case '포함':
                if(data[exlCond].indexOf(condVl)>-1){
                  for(let j =0;j<trgtList.length;j++){
                    if(trgtList[j]['ROW_NUMBER'] == data['ROW_NUMBER']){
                      trgtList[j]['REASON'] += '<br>' + condReason;
                      trgtList[j]['REASON_CD'] += ',' + id;
                      trgt = false
                    }
                  }
                  if(trgt){
                    trgtList.push(Object.assign({}, data, { REASON: condReason, REASON_CD: id }));
                  }
                }
                break;
              case '제외':
                if(data[exlCond].indexOf(condVl)==-1){
                  for(let j =0;j<trgtList.length;j++){
                    if(trgtList[j]['ROW_NUMBER'] == data['ROW_NUMBER']){
                      trgtList[j]['REASON'] += '<br>' + condReason;
                      trgtList[j]['REASON_CD'] += ',' + id;
                      trgt = false
                    }
                  }
                  if(trgt){
                    trgtList.push(Object.assign({}, data, { REASON: condReason, REASON_CD: id }));
                  }
                }
                break;
              case '동일':
                if(exlCond=='CNSLT_DIV_CD_1'||exlCond=='CNSLT_DIV_CD_2'||exlCond=='CNSLT_DIV_CD_3'){
                  let condVlArr = condVl.split(',')
                  for(let q=0;q<condVlArr.length;q++){
                    if(data[exlCond]==condVlArr[q]){
                      for(let j =0;j<trgtList.length;j++){
                        if(trgtList[j]['ROW_NUMBER'] == data['ROW_NUMBER']){
                          trgtList[j]['REASON'] += '<br>' + condReason;
                          trgtList[j]['REASON_CD'] += ',' + id;
                          trgt = false
                        }
                      }
                      if(trgt){
                        trgtList.push(Object.assign({}, data, { REASON: condReason, REASON_CD: id }));
                      }
                    }
                  }
                }else{
                  if(data[exlCond]==condVl){
                    for(let j =0;j<trgtList.length;j++){
                      if(trgtList[j]['ROW_NUMBER'] == data['ROW_NUMBER']){
                        trgtList[j]['REASON'] += '<br>' + condReason;
                        trgtList[j]['REASON_CD'] += ',' + id;
                        trgt = false
                      }
                    }
                    if(trgt){
                      trgtList.push(Object.assign({}, data, { REASON: condReason, REASON_CD: id }));
                    }
                  }
                }
                break;
              case '동일 제외':
                if(exlCond=='CNSLT_DIV_CD_1'||exlCond=='CNSLT_DIV_CD_2'||exlCond=='CNSLT_DIV_CD_3'){
                  let condVlArr = condVl.split(',')
                  for(let q=0;q<condVlArr.length;q++){
                    if(data[exlCond]==condVlArr[q]){
                      for(let j =0;j<trgtList.length;j++){
                        if(trgtList[j]['ROW_NUMBER'] == data['ROW_NUMBER']){
                          trgtList[j]['REASON'] += '<br>' + condReason;
                          trgtList[j]['REASON_CD'] += ',' + id;
                          trgt = false
                        }
                      }
                      if(trgt){
                        trgtList.push(Object.assign({}, data, { REASON: condReason, REASON_CD: id }));
                      }
                    }
                  }
                }else{
                  if(data[exlCond]!=condVl){
                    for(let j =0;j<trgtList.length;j++){
                      if(trgtList[j]['ROW_NUMBER'] == data['ROW_NUMBER']){
                        trgtList[j]['REASON'] += '<br>' + condReason;
                        trgtList[j]['REASON_CD'] += ',' + id;
                        trgt = false
                      }
                    }
                    if(trgt){
                      trgtList.push(Object.assign({}, data, { REASON: condReason, REASON_CD: id }));
                    }
                  }
                }
                break;
              case '시작 문자열':
                if(data[exlCond].startsWith(condVl)){
                  for(let j =0;j<trgtList.length;j++){
                    if(trgtList[j]['ROW_NUMBER'] == data['ROW_NUMBER']){
                      trgtList[j]['REASON'] += '<br>' + condReason;
                      trgtList[j]['REASON_CD'] += ',' + id;
                      trgt = false
                    }
                  }
                  if(trgt){
                    trgtList.push(Object.assign({}, data, { REASON: condReason, REASON_CD: id }));
                  }
                }
                break;
              case '시작 제외 문자열':
                if(!data[exlCond].startsWith(condVl)){
                  for(let j =0;j<trgtList.length;j++){
                    if(trgtList[j]['ROW_NUMBER'] == data['ROW_NUMBER']){
                      trgtList[j]['REASON'] += '<br>' + condReason;
                      trgtList[j]['REASON_CD'] += ',' + id;
                      trgt = false
                    }
                  }
                  if(trgt){
                    trgtList.push(Object.assign({}, data, { REASON: condReason, REASON_CD: id }));
                  }
                }
                break;
              case '끝 문자열':
                if(data[exlCond].endWith(condVl)){
                  for(let j =0;j<trgtList.length;j++){
                    if(trgtList[j]['ROW_NUMBER'] == data['ROW_NUMBER']){
                      trgtList[j]['REASON'] += '<br>' + condReason;
                      trgtList[j]['REASON_CD'] += ',' + id;
                      trgt = false
                    }
                  }
                  if(trgt){
                    trgtList.push(Object.assign({}, data, { REASON: condReason, REASON_CD: id }));
                  }
                }
                break;
              case '끝 제외 문자열':
                if(!data[exlCond].endWith(condVl)){
                  for(let j =0;j<trgtList.length;j++){
                    if(trgtList[j]['ROW_NUMBER'] == data['ROW_NUMBER']){
                      trgtList[j]['REASON'] += '<br>' + condReason;
                      trgtList[j]['REASON_CD'] += ',' + id;
                      trgt = false
                    }
                  }
                  if(trgt){
                    trgtList.push(Object.assign({}, data, { REASON: condReason, REASON_CD: id }));
                  }
                }
                break;
              case '자릿수':
                if(!data[exlCond].length==condVl){
                  for(let j =0;j<trgtList.length;j++){
                    if(trgtList[j]['ROW_NUMBER'] == data['ROW_NUMBER']){
                      trgtList[j]['REASON'] += '<br>' + condReason;
                      trgtList[j]['REASON_CD'] += ',' + id;
                      trgt = false
                    }
                  }
                  if(trgt){
                    trgtList.push(Object.assign({}, data, { REASON: condReason, REASON_CD: id }));
                  }
                }
                break;
              case '자릿수 아님':
                if(!data[exlCond].length!=condVl){
                  for(let j =0;j<trgtList.length;j++){
                    if(trgtList[j]['ROW_NUMBER'] == data['ROW_NUMBER']){
                      trgtList[j]['REASON'] += '<br>' + condReason;
                      trgtList[j]['REASON_CD'] += ',' + id;
                      trgt = false
                      break;
                    }
                  }
                  if(trgt){
                    trgtList.push(Object.assign({}, data, { REASON: condReason, REASON_CD: id }));
                  }
                }
                break;
              case '다중 포함':
                // 지정한 값 중 하나라도 포함 됨
                let condVlArr1 = condVl.split(',')
                let cnt1 = 0;
                for(let q=0;q<condVlArr1.length;q++){
                  if(data[exlCond].indexOf(condVlArr1[q])>-1){
                    for(let j =0;j<trgtList.length;j++){
                      if(trgtList[j]['ROW_NUMBER'] == data['ROW_NUMBER']){
                        trgtList[j]['REASON'] += '<br>' + condReason;
                        trgtList[j]['REASON_CD'] += ',' + id;
                        trgt = false
                      }
                    }
                    if(trgt){
                      trgtList.push(Object.assign({}, data, { REASON: condReason, REASON_CD: id }));
                    }
                    break;
                  }
                }
                break;
              case '다중 미포함':
                // 지정한 값이 하나도 포함되지 않음
                let condVlArr2 = condVl.split(',')
                let cnt2 = 0;
                for(let q=0;q<condVlArr2.length;q++){
                  if(data[exlCond].indexOf(condVlArr2[q])==1){
                    cnt2++
                  }
                }
                if(cnt2 == condVlArr2.length){
                  for(let j =0;j<trgtList.length;j++){
                    if(trgtList[j]['ROW_NUMBER'] == data['ROW_NUMBER']){ 
                      trgtList[j]['REASON'] += '<br>' + condReason;
                      trgtList[j]['REASON_CD'] += ',' + id;
                      trgt = false
                    }
                  }
                  if(trgt){
                    trgtList.push(Object.assign({}, data, { REASON: condReason, REASON_CD: id }));
                  }
                }
                break;
              case '다중 동일':
                // 지정한 값 모두 포함됨
                let condVlArr3 = condVl.split(',')
                let cnt3 = 0;
                for(let q=0;q<condVlArr3.length;q++){
                  if(data[exlCond].indexOf(condVlArr3[q])==1){
                    cnt3++
                  }
                }
                if(cnt3 == condVlArr3.length){
                  for(let j =0;j<trgtList.length;j++){
                    if(trgtList[j]['ROW_NUMBER'] == data['ROW_NUMBER']){ 
                      trgtList[j]['REASON'] += '<br>' + condReason;
                      trgtList[j]['REASON_CD'] += ',' + id;
                      trgt = false
                    }
                  }
                  if(trgt){
                    trgtList.push(Object.assign({}, data, { REASON: condReason, REASON_CD: id }));
                  }
                }
                break;
              // case '다중 동일 제외':
              //   // 지정한 값중 하나도 포함되지 않음
              //   let condVlArr4 = condVl.split(',')
              //   for(let q=0;q<condVlArr4.length;q++){
              //     if(data[exlCond]==condVlArr3[q]){
              //       for(let j =0;j<trgtList.length;j++){
              //         if(trgtList[j]['ROW_NUMBER'] == data['ROW_NUMBER']){
              //           trgtList[j]['REASON'] += '<br>' + condReason;
              //           trgtList[j]['REASON_CD'] += ',' + id;
              //           trgt = false
              //         }
              //       }
              //       if(trgt){
              //         trgtList.push(Object.assign({}, data, { REASON: condReason, REASON_CD: id }));
              //       }
              //     }
              //   }
              //   break;
              // case '이내':
              //   if(data[exlCond]){
              //     if(this.isWithinOutNDays(data[exlCond],condVl,'in')){
              //       for(let j =0;j<trgtList.length;j++){
              //         if(trgtList[j]['ROW_NUMBER'] == data['ROW_NUMBER']){
              //           trgtList[j]['REASON'] += '<br>' + condReason;
              //           trgtList[j]['REASON_CD'] += ',' + id;
              //           trgt = false
              //           break;
              //         }
              //       }
              //       if(trgt){
              //         trgtList.push(Object.assign({}, data, { REASON: condReason, REASON_CD: id }));
              //       }
              //     }
              //   }
              //   break;
              // case '이후':
              //   if(data[exlCond]){
              //     if(this.isWithinOutNDays(data[exlCond],condVl,'out')){
              //       for(let j =0;j<trgtList.length;j++){
              //         if(trgtList[j]['ROW_NUMBER'] == data['ROW_NUMBER']){
              //           trgtList[j]['REASON'] += '<br>' + condReason;
              //           trgtList[j]['REASON_CD'] += ',' + id;
              //           trgt = false
              //           break;
              //         }
              //       }
              //       if(trgt){
              //         trgtList.push(Object.assign({}, data, { REASON: condReason, REASON_CD: id }));
              //       }
              //     }
              //   }
              //   break;
              default:
                break;
            }
          }
        }
        this.EXL_COND_TRGT_LIST = trgtList;
      }else if(this.dialogTab=='exlTrgt'){
        this.insertExlHst();
      }
    },

    //날짜 이내 계산
    isWithinOutNDays(dateStr,days,inout){
      const year = parseInt(dateStr.substring(0, 4));
      const month = parseInt(dateStr.substring(4, 6)) - 1;
      const day = parseInt(dateStr.substring(6, 8));
      const hour = parseInt(dateStr.substring(8, 10));
      const minute = parseInt(dateStr.substring(10, 12));
      const second = parseInt(dateStr.substring(12, 14));

      const targetDate = new Date(year, month, day, hour, minute, second);
      const now = new Date();

      const diffMs = now - targetDate;
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      
      return inout=='in' ? diffDays <= days : diffDays >= days;
    },

    brforeProc(){
      if(this.dialogTab=='exlTrgt'){
        this.dialogTab = 'exlCond';

        this.EXL_COND_TRGT_LIST = [];
        this.EXL_COND_SET_TRGT_LIST = [];
      }
    },

    setExlCond(){

    },
    
    sanitizeContent(content) {
      if (!content) return '';

      // 1️⃣ <br>, <br/> 태그는 임시 치환
      let temp = content.replace(/<br\s*\/?>/gi, '[[BR]]');

      // 2️⃣ 나머지 HTML 태그 제거
      temp = temp.replace(/<[^>]*>/g, '');

      // 3️⃣ 다시 [[BR]] → <br> 복원
      temp = temp.replace(/\[\[BR\]\]/g, '<br>');

      // 4️⃣ script, iframe 등 보안 위험 요소 제거 (추가 안전망)
      temp = temp.replace(/<script[^>]*>.*?<\/script>/gi, '');
      temp = temp.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');

      return temp;
    },

    

    async selectCuttTypeAll(type,where){
      this.LOADING = true;
      this.startDotAnimation();
      let custco = '1'
      let seCd = ''
      if(where=='grid'){
        seCd = type;
      } else {
        if(type=='SRCH'){
          custco = this.SRCH_DEPT_ID == '2'?'1'/*마이홈*/
            :(this.SRCH_DEPT_ID == '3'?'4'/*바로처리*/
            :(this.SRCH_DEPT_ID == '4'||this.SRCH_DEPT_ID == '8'/*유스타트*/||this.SRCH_DEPT_ID == '9'/*인천검단*/?'3'/*전세임대*/
            :(this.SRCH_DEPT_ID == '5'?'2'/*공가해소*/
            :(this.SRCH_DEPT_ID == '7'?'5'/*렌트홈 = 주택지원*/
            :(this.SRCH_DEPT_ID == '6'?'1'/*공동주택*/
            :'1'/*기본값*/
          )))))
          seCd = this.SRCH_EXL_COND_SE_CD.replaceAll('CNSLT_DIV_CD_','')
        } else {
          custco = this.DEPT_ID == '2'?'1'/*마이홈*/
            :(this.DEPT_ID == '3'?'4'/*바로처리*/
            :(this.DEPT_ID == '4'||this.DEPT_ID == '8'/*유스타트*/||this.SRCH_DEPT_ID == '9'/*인천검단*/?'3'/*전세임대*/
            :(this.DEPT_ID == '5'?'2'/*공가해소*/
            :(this.DEPT_ID == '7'?'5'/**렌트홈 = 주택지원*/
            :(this.DEPT_ID == '6'?'1'/*공동주택*/
            :'1'/*기본값*/
          )))))
          seCd = this.EXL_COND_SE_CD.replaceAll('CNSLT_DIV_CD_','')
        }
      }
      let sUrl = '/api/svy/exclusion/selectCuttTypeAll';
      let postParam = {
        SRCH_CUSTCO_ID: custco
        , SRCH_CUTT_TYPE: seCd
      }

      let headParam = {
        head : {      
        }
      }

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        if(where=='grid'){
          if(seCd=='1'){
            this.CUTT_TYPE_LIST_1 = response.DATA;
          } else if(seCd=='2') {
            this.CUTT_TYPE_LIST_2 = response.DATA;
          } else if(seCd=='3') {
            this.CUTT_TYPE_LIST_3 = response.DATA;
          }
        } else {
          if(type=='SRCH'){
            this.srchSelectedCuttTypeData = [];
            this.srchGridCuttTypeItems = response.DATA;
          } else {
            this.selectedCuttTypeData = [];
            this.gridCuttTypeItems = response.DATA;
          }
        }
        this.LOADING = false;
        clearInterval(this.dotInterval);
      } else {
        this.LOADING = false;
        clearInterval(this.dotInterval);
      }
    },

    extractCodes(str) {
      // 작은따옴표 안에 있는 코드값만 추출
      const match = str.match(/'([^']+)'/g);

      if (!match || match.length < 2) return [];

      // 두 번째 작은따옴표 부분만 가져와서 배열로 변환
      return match[1]
        .replace(/'/g, '')      // 작은따옴표 제거
        .trim()                 // 공백 제거
        .split(',')             // 쉼표로 분리
        .map(v => v.trim());    // 각 요소 공백 제거
    },

    stng_btn() {
      // 선택된 요소 복사
      const selected = [...this.SEL_EXL_COND_TRGT_LIST];

      // 1) 아래 리스트에 추가
      this.EXL_COND_SET_TRGT_LIST.push(...selected);

      // 2) 위쪽 리스트에서 제거
      this.EXL_COND_TRGT_LIST = this.EXL_COND_TRGT_LIST.filter(
        item => !selected.includes(item)
      );

      // 선택 초기화
      this.SEL_EXL_COND_TRGT_LIST = [];
      this.isSelectedAllTrgt2 = false;
      this.isSelectedAllTrgt3 = false;
    },

    /** 위 리스트로 이동 **/
    un_stng_btn() {
      const selected = [...this.SEL_EXL_COND_SET_TRGT_LIST];

      // 1) 위로 이동
      this.EXL_COND_TRGT_LIST.push(...selected);

      // 2) 아래에서 제거
      this.EXL_COND_SET_TRGT_LIST = this.EXL_COND_SET_TRGT_LIST.filter(
        item => !selected.includes(item)
      );

      // 선택 초기화
      this.SEL_EXL_COND_SET_TRGT_LIST = [];
      this.isSelectedAllTrgt2 = false;
      this.isSelectedAllTrgt3 = false;
    },

    btnCuttType(type){
      this.CUTT_TYPE_MODE = type;
      this.SRCH_CUTT_TYPE = '';
      this.selectCuttTypeAll(type);
      this.mixin_showDialog('CuttType');
    },
    
    rowCuttTypeSelect(item){
      this.selectedCuttTypeRow = item;
    },

    isCuttTypeActiveRow(item){
      const activeClass = item === this.selectedCuttTypeRow ? "active" : "";
      return activeClass;
    },

    startDotAnimation() {
      // 기존 인터벌 제거
      if (this.dotInterval) {
        clearInterval(this.dotInterval);
      }

      // 0.1초마다 dots 생성
      this.dotInterval = setInterval(() => {
        if (this.dots.length >= 12) {
          this.dots = "";
        } else {
          this.dots += "...";
        }
      }, 100);
    },

    setCuttType(type){
      let dataArr = [];
      if(type=='SRCH'){
        for(let i=0;i<this.srchSelectedCuttTypeData.length;i++){
          dataArr.push(this.srchSelectedCuttTypeData[i].CUTT_TYPE_EXPLN);
          if(i==0){
            this.SRCH_EXL_COND_CN_CUTT_TYPE.TEXT = this.srchSelectedCuttTypeData[i].PATH
          } else {
            this.SRCH_EXL_COND_CN_CUTT_TYPE.TEXT = this.SRCH_EXL_COND_CN_CUTT_TYPE.TEXT + '<br>' +this.srchSelectedCuttTypeData[i].PATH
          }
        }
        this.SRCH_EXL_COND_CN = dataArr.toString();
        this.SRCH_EXL_COND_CN_CUTT_TYPE.ROW = dataArr.length+'개의 상담유형';
      } else {
        for(let i=0;i<this.selectedCuttTypeData.length;i++){
          dataArr.push(this.selectedCuttTypeData[i].CUTT_TYPE_EXPLN);
          if(i==0){
            this.EXL_COND_CN_CUTT_TYPE.TEXT = this.selectedCuttTypeData[i].PATH
          } else {
            this.EXL_COND_CN_CUTT_TYPE.TEXT = this.EXL_COND_CN_CUTT_TYPE.TEXT + '<br>' +this.selectedCuttTypeData[i].PATH
          }
        }
        this.EXL_COND_CN = dataArr.toString();
        this.EXL_COND_CN_CUTT_TYPE.ROW = dataArr.length+'개의 상담유형';
      }
      this.mixin_hideDialog('CuttType')
    },

    initSrch(){
      this.SRCH_DEPT_ID='';
      this.SRCH_EXL_COND_SE_CD='';
      this.SRCH_EXL_COND_CN_CUTT_TYPE='';
      this.SRCH_EXL_COND_CD='';
      this.SRCH_EXL_COND_CN='';
      this.SRCH_USE_YN='Y';
      this.SRCH_DEL_YN='N';
    },

    async insertExlHst(){
      this.openProgressBar();
      let URLData = '/api/svy/exclusion/insertExlHst';

      //java head 메모리 이슈로 리스트를 5000건씩 짤라서 api 호출
      let exlTrgtList = [];
      for(let i=0;i<this.EXL_COND_SET_TRGT_LIST.length;i++){
        let resCdArr = this.EXL_COND_SET_TRGT_LIST[i].REASON_CD.split(',');
        if(resCdArr.length == 1){
          exlTrgtList.push({
            SRVY_EXL_COND_ID: resCdArr[0]
            , CUST_PHN_NO: this.EXL_COND_SET_TRGT_LIST[i].CUST_PHN_NO
            , CUST_NM: this.EXL_COND_SET_TRGT_LIST[i].CUST_NM
            , EML: this.EXL_COND_SET_TRGT_LIST[i].EML
          });
        } else if (resCdArr.length > 1){
          for(let n=0;n<resCdArr.length;n++){
            exlTrgtList.push({
              SRVY_EXL_COND_ID: resCdArr[n]
              , CUST_PHN_NO: this.EXL_COND_SET_TRGT_LIST[i].CUST_PHN_NO
              , CUST_NM: this.EXL_COND_SET_TRGT_LIST[i].CUST_NM
              , EML: this.EXL_COND_SET_TRGT_LIST[i].EML
            });
          }
        }
      }
      let leng = exlTrgtList.length;
      if(leng == 0){
        return;
      }

      let chunks = [];
      for (let i = 0; i < leng; i += 5000) {
        chunks.push(exlTrgtList.slice(i, i + 5000));
      }
      const now = new Date();

      const yyyy = now.getFullYear();
      const MM = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const hh = String(now.getHours()).padStart(2, '0');
      const mi = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');

      for (let idx = 0; idx < chunks.length; idx++) {
        this.openProgressBar();
        let postParam = {
          EXL_TRGT_LIST: chunks[idx]
          , SRVY_ID: this.SRVY_NM
          , NOW_DT: yyyy+MM+dd+hh+mi+ss
        };

        let headParam = {
          head: { 
            DATA_OBJECT: "EXL_TRGT_LIST" 
          },
          timeout: 100000
        };

        let response = await this.common_postCall(URLData, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG) {
          //마지막반복일 때
          if(idx==chunks.length-1){
            this.closeProgressBar();
            this.showToast({msg: this.EXL_COND_SET_TRGT_LIST.length+'명의 참여자가 제외되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000});

            // 참여자 리스트에서 제외
            const selectedRowNumbers = this.EXL_COND_SET_TRGT_LIST.map(item => item.ROW_NUMBER);
            this.gridDataText = this.gridDataText.filter(
              row => !selectedRowNumbers.includes(row.ROW_NUMBER)
            );
            // 탭 초기화
            this.dialogTab = 'exlCond';
            // 탭닫기
            this.mixin_hideDialog('ExlCond');
            // 파라미터 초기화
            this.EXL_COND_TRGT_LIST = [];
            this.EXL_COND_SET_TRGT_LIST = [];
            this.SEL_EXL_COND_LIST = [];
          }
        } else {
          this.closeProgressBar();
          this.showAlert(this.MESSAGE.ERROR.ERROR);
          return;
        }
      }
    },
  },
};
</script>

<style lang="scss" >
.pl-check.is-chk-center .v-input__slot{
  justify-content: center;
}
</style>