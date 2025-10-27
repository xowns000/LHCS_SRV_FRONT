<template>
  <div>
    <!-- tabs -->
    <v-tabs class="pl-tabs type-main" >
      <v-tab @click=" openTab('SCRIPT') ">
        스크립트
      </v-tab>
      <v-tab @click=" openTab('CONTS') ">
        지식 콘텐츠
      </v-tab>
      <v-tab @click=" openTab('NEW') ">
        새로운 지식
        <span v-show="BADGE.NEW_CNT !== '0'" class="pl-tab-badge">{{ BADGE.NEW_CNT }}</span>
      </v-tab>
      <v-tab @click=" openTab('MY') ">
        나의 즐겨찾기
        <span v-show="BADGE.MY_CNT !== '0'" class="pl-tab-badge">{{ BADGE.MY_CNT }}</span>
      </v-tab>
      <!-- 스크립트 -->
      <v-tab-item>
        <!-- 검색 조건 -->
        <div class="pl-form-inline-wrap vertical type-auto is-mt-m">
          <div class="pl-form-inline">
            <span class="pl-label">
              지식 분류
            </span>
            <div class="pl-desc">
              <v-autocomplete
                v-model="SCRIPT_SELECTED_KMS_CLSF_ID"
                class="pl-form"
                :items="SCRIPT_CLSF_LIST"
                item-text="FULL_PATH"
                item-value="KMS_CLSF_ID"
                v-on:change="getScriptConsList()"
                placeholder="상담 유형을 검색하세요"
                clearable
                no-data-text="결과 없음"
                style="flex-basis: 190px;"
              />
              <v-text-field
                v-model="SCRIPT_KEY_WORD"
                class="pl-form is-search flex-grow-0"
                placeholder="검색어 입력"
                @keydown.enter="getScriptConsList()"
                >
                <template v-slot:append>
                  <v-btn
                    @click="getScriptConsList()"
                    class="pl-btn has-icon-only">
                    <span class="pl-icon20 in-search"></span>
                  </v-btn>
                </template>
              </v-text-field>
            </div>
            <div class="d-flex ml-auto justify-end" style="width: 150px">
              <ul class="pl-sort-tabs">
                <li
                  v-for="item, index in SCRIPT_TYPE_SORT_ITEMS"
                  :key="item.id"
                  :class="item.selected ? 'selected' : ''"
                  @click="FnEvt(item, index, 'KMS_SORT', 'SCRIPT_TYPE_SORT_ITEMS')"
                  >
                  {{ item.title }}
                </li>
              </ul>

            </div>

          </div>
          <div class="pl-form-inline">
            <div class="pl-desc">
              <span class="pl-counter" style="width: 110px">전체 <em class="pl-1">({{ SCRIPT_CONTS_LIST.length }})</em> 건</span>
              <div class="d-flex">
                <div class="pl-selection-row ml-auto">
                  <v-btn-toggle v-model="SCRIPT_TYPE_MODEL" class="pl-btn-group" mandatory>
                      <compo-tooltip-btn
                        v-for="(item, idx) in SCRIPT_TYPE_RADIO_ITEMS"
                        :key="idx"
                        :TitleProp="item.text"
                        ClassProp="pl-btn"
                        :IconProp="`pl-icon20 ${item.icon}`"
                        TooltipPositionProp="bottom"
                        @btnClick="() => fnClickScriptSearchCheckbox(item.value)"
                      ></compo-tooltip-btn>
                  </v-btn-toggle>
                </div>
                <compo-tooltip-btn
                  TitleProp="스크립트 등록"
                  ClassProp="pl-tooltip-btn ml-2"
                  IconProp="pl-icon20 wrtie"
                  TooltipPositionProp="bottom"
                  @btnClick="regScriptDetail()"
                ></compo-tooltip-btn>
              </div>
            </div>

          </div>

        </div>
        <!-- list -->
        <div
          class="pl-alarm-list-wrap type-script is-mt-m"
          style="height: calc(100vh - 375px);">
          <div
            v-for="item,index in SCRIPT_CONTS_LIST"
            :key="index"
            class="pl-alarm-list"
            :class="item.COMM_YN == 'N' ? 'private' : 'public'"
            @click="selectScriptDetail(index)"
            >
            <div class="col-12 pa-0">
              <div class="d-flex">
                <span class="pl-alarm-list-title" v-text=" item.KMS_CONTS_NM "></span>
                <v-tooltip v-if="item.SHORTCUT_NM != null && item.SHORTCUT_NM != ''" content-class="pl-tooltip " bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on" class="pl-boxkey ml-auto " style="height: 100%">{{ item.SHORTCUT_NM }}</span>
                  </template>
                  <span>새로붙이기 : ALT + {{ item.SHORTCUT_NM }}<br>이어붙이기 : ALT + SHIFT + {{ item.SHORTCUT_NM }}</span>
                </v-tooltip>

              </div>
              <div v-html="fnNewLineToBr(item.KMS_CONTS_CN)" :class="`col-10 pa-0 mt-1 script_detail_line ${item.selected ? 'selected' : ''}`"></div>
              <span class="pl-alarm-list-desc" :style="!item.selected ? 'opacity : .5' : ''">
                <!-- <span
                  :class="`pl-round-chip is-sm chat-stat-${item.COMM_YN === 'N' ? 'cs' : 'done'}`">
                  {{ item.COMM_YN === 'N' ? '개인' : '공통'}}
                </span> -->
                <span class="is-txt-blue"> {{ item.RGTR_NM }} </span>
                <span class="is-txt-bull">&bull;</span>
                {{ item.CLSF_PATH }}
              </span>
              <div v-if="item.selected" class="pl-btn-wrap justify-end is-mt-m">
                <compo-tooltip-btn
                  TitleProp="새로붙이기"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 new-paste"
                  TooltipPositionProp="bottom"
                  @btnClick="fnChatMessagePaste('NEW', item.KMS_CONTS_CN)"
                ></compo-tooltip-btn>
                <compo-tooltip-btn
                  TitleProp="이어붙이기"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 continue-paste"
                  TooltipPositionProp="bottom"
                  @btnClick="fnChatMessagePaste('CONTINUE', item.KMS_CONTS_CN)"
                ></compo-tooltip-btn>
                <compo-tooltip-btn
                  TitleProp="스크립트 상세"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 edit"
                  TooltipPositionProp="bottom"
                  @btnClick="modifyScriptDetail(item)"
                ></compo-tooltip-btn>

                <!-- <v-btn
                  class="pl-btn is-icon is-sub"
                  @click="fnChatMessagePaste('NEW', item.KMS_CONTS_CN)"
                >
                  <span class="pl-icon20 new-paste"></span>
                  새로붙이기
                </v-btn>
                <v-btn
                  class="pl-btn is-icon is-sub"
                  @click="fnChatMessagePaste('CONTINUE', item.KMS_CONTS_CN)"
                >
                  <span class="pl-icon20 continue-paste"></span>
                  이어붙이기
                </v-btn>
                <v-btn
                  class="pl-btn is-icon is-sub"
                  v-if="item.COMM_YN === 'N'"
                  @click="modifyScriptDetail(item)"
                  >
                  <span class="pl-icon20 edit"></span>
                  스크립트 상세
                </v-btn> -->
              </div>
            </div>
          </div>
          <!-- no data -->
          <div v-if="SCRIPT_CONTS_LIST.length === 0" class="pl-list-nodata">
            <span>등록된 데이터가 없습니다.</span>
          </div>
        </div>
      </v-tab-item>
      <!-- 지식 콘텐츠 -->
      <v-tab-item>
        <template v-if="!CONTS_DETAIL.active">
          <!-- search -->
          <v-text-field
            class="pl-form pl-main-search is-mt-m"
            v-model="KEY_WORD"
            :disabled=" KMS_SCRIPT_VIEW === 'tree' "
            @keydown.enter="getContsList"
            >
            <template v-slot:append>
              <div class="d-flex align-center">
                <!-- 필터 버튼 -->
                <!-- <compo-tooltip-btn
                  TitleProp="상세 검색"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 filter"
                  TooltipPositionProp="bottom"
                  @btnClick="mixin_testLog('상세 검색')"
                ></compo-tooltip-btn> -->

                <v-btn-toggle v-model="viewSorting" class="pl-btn-group divider-l" mandatory>
                  <compo-tooltip-btn
                    v-for="item in btnGroupSort"
                    :key="item.id"
                    :TitleProp="item.title"
                    ClassProp="pl-btn"
                    :IconProp="`pl-icon20 ${item.icon}`"
                    TooltipPositionProp="bottom"
                    @btnClick="() => FnBtnPath(item.evt)"
                  ></compo-tooltip-btn>
                </v-btn-toggle>

              </div>
            </template>
          </v-text-field>
          <!-- sort -->
          <div
            v-if="KMS_SCRIPT_VIEW === 'list'"
            class="d-flex justify-space-between is-mt-m">
            <div class="pl-counter ml-0">전체 <em class="pl-1">({{ CONTS_LIST.length }})</em> 건
              <p>목록에서 자세히를 클릭하시면 상세내용을 확인할 수 있습니다.</p>
            </div>
            <ul class="pl-sort-tabs align-end" >
              <li
                v-for="item, index in SORT_ITEMS"
                :key="item.id"
                :class="item.selected ? 'selected' : ''"
                @click="FnEvt(item, index, 'KMS_SORT', 'SORT_ITEMS')"
                >
                {{ item.title }}
              </li>
            </ul>
          </div>
          <!-- list -->
          <div v-show="KMS_SCRIPT_VIEW === 'list'"
            class="pl-alarm-list-wrap is-mt-m"
            style="height: calc(100vh - 405px);">
            <div
              v-for="item in CONTS_LIST"
              :key="item.KMS_CONTS_ID"
              class="pl-alarm-list"
              @click=" fnContsDetail(item)"
              >
              <div>
                <span class="pl-alarm-list-title" v-text=" item.KMS_CONTS_NM "></span>
                <span class="pl-alarm-list-desc">
                  <p><span class="is-txt-bull">&bull;</span>{{ item.CLSF_PATH }}</p>
                  <p><span class="is-txt-bull">&bull;</span>마지막 수정: {{ item.MDFCN_DT_F }}</p>
                </span>
              </div>
              <div>
                <span class="pl-alarm-list-link" >자세히</span>
              </div>
            </div>
            <!-- 더보기 버튼 -->
            <template v-if="CONTS_PAGE.showMoreBtn">
              <div class="pl-bottom-fixed">
                <v-btn class="pl-btn is-round is-sub is-icon pl-4" @click="getContsList('next')">
                  더보기
                  <span class="pl-icon20 arrow-up ml-2"></span>
                </v-btn>
              </div>
            </template>
            <!-- no data -->
            <div v-if="CONTS_LIST.length === 0" class="pl-list-nodata">
              <span>등록된 데이터가 없습니다.</span>
            </div>
          </div>
          <!-- tree -->
          <div v-show="KMS_SCRIPT_VIEW === 'tree'">
            <div class="pl-tree-header is-mt-m">
              <div class="is-left">
                <label>지식 분류</label>
              </div>
              <div class="is-right">
                <!-- <v-btn class="pl-btn is-sub is-sm"
                  :disabled=" mixin_isEmpty(selectedTreeNode) || mixin_isEmpty(selectedTreeNode.KMS_CONTS_ID) "
                  @click="fnContsDetail(selectedTreeNode.KMS_CONTS_ID)">자세히
                </v-btn> -->
                <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault')">전체 펼치기</v-btn>
                <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault')">전체 접기</v-btn>
              </div>
            </div>
            <div class="pl-tree-body" style="height: 560px;">
              <v-treeview ref="treeDefault"
                :items="treeItems"
                :open-all="expanded"
                item-key="id"
                :open.sync="treeOpenSync"
                activatable
                return-object
                item-disabled="LOCKED == 'true'"
                :open-on-click=false
                @update:active="selectTree"
                color="secondary"
                class="pl-tree-view">
                <template v-slot:prepend="{ item, open }">
                  <v-icon v-if=" mixin_isEmpty(item.KMS_CONTS_ID) ">
                      {{open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder'}}
                  </v-icon>
                  <v-icon v-else>
                      {{ 'pl-icon20 tree-file' }}
                  </v-icon>
                </template>
                <template v-slot:label="{item}">
                  <div>
                    {{ item.name }}
                    <v-icon v-if=" !mixin_isEmpty(item.KMS_CONTS_ID) " @click="fnContsDetail(item)">
                      {{ 'pl-icon20 preview' }}
                  </v-icon>
                  </div>
                </template>
              </v-treeview>
            </div>

          </div>
        </template>
        <!-- detail -->
        <div v-else class="pl-right-kms-detail">
          <RIGHT_KMS_DETAIL_COMPO ref="detailCompo"
            @detailContsBack="detailBack"
            @updBadgeCnt="getBadgeCount"
            v-model="CONTS_DETAIL">
          </RIGHT_KMS_DETAIL_COMPO>
        </div>
      </v-tab-item>
      <!-- 새로운 지식 -->
      <v-tab-item>
        <template v-if="!NEW_DETAIL.active">
          <!-- search -->
          <v-text-field
            v-model="NEW_KEY_WORD"
            class="pl-form pl-main-search is-mt-m"
            @keydown.enter="getNewContsList"
            >
            <!-- <template v-slot:append>
              <div class="d-flex align-center">
                <compo-tooltip-btn
                  TitleProp="상세 검색"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 filter"
                  TooltipPositionProp="bottom"
                  @btnClick=""
                ></compo-tooltip-btn>
              </div>
            </template> -->
          </v-text-field>
          <!-- sort -->
          <div class="d-flex justify-space-between is-mt-m">
            <div class="pl-counter ml-0">전체 <em class="pl-1">({{ NEW_CONTS.length }})</em> 건
              <p>목록에서 자세히를 클릭하시면 상세내용을 확인할 수 있습니다.</p>
            </div>
            <!-- <ul class="pl-sort-tabs align-end">
              <li
                v-for="item, index in SORT_ITEMS"
                :key="item.id"
                :class="item.selected ? 'selected' : ''"
                @click="FnEvt(item, index, 'KMS_SORT', 'SORT_ITEMS')"
                >
                {{ item.title }}
              </li>
            </ul> -->
          </div>
          <!-- list -->
          <div class="pl-alarm-list-wrap is-mt-m" style="height: calc(100vh - 425px);">
            <div
              v-for="item in NEW_CONTS"
              :key="item.KMS_CONTS_ID"
              class="pl-alarm-list"
              @click="fnContsNewDetail(item)"
              >
              <div>
                <span class="pl-alarm-list-title"> {{ item.KMS_CONTS_NM }} </span>
                <span class="pl-alarm-list-desc">
                  <p><span class="is-txt-bull">&bull;</span>{{ item.CLSF_PATH }}</p>
                  <p><span class="is-txt-bull">&bull;</span>마지막 수정: {{ item.MDFCN_DT_F }}</p>
                </span>
              </div>
              <div>
                <span class="pl-alarm-list-link" >자세히</span>
              </div>
            </div>
            <!-- 더보기 버튼 -->
            <template v-if="NEW_PAGE.showMoreBtn">
              <div class="pl-bottom-fixed">
                <v-btn class="pl-btn is-round is-sub is-icon pl-4" @click="getNewContsList('next')">
                  더보기
                  <span class="pl-icon20 arrow-up ml-2"></span>
                </v-btn>
              </div>
            </template>
            <!-- no data -->
            <div v-if="NEW_CONTS.length === 0" class="pl-list-nodata">
              <span>등록된 데이터가 없습니다.</span>
            </div>
          </div>
        </template>
        <!-- detail -->
        <div v-else class="pl-right-kms-detail">
          <RIGHT_KMS_DETAIL_COMPO ref="detailNewCompo"
            @updBadgeCnt="getBadgeCount"
            v-model="NEW_DETAIL">
          </RIGHT_KMS_DETAIL_COMPO>
        </div>
      </v-tab-item>
      <!-- 나의 즐겨찾기 -->
      <v-tab-item>
        <!-- sort -->
        <template v-if="!MY_DETAIL.active">
          <div class="d-flex justify-space-between is-mt-m">
            <div class="pl-counter ml-0">전체 <em class="pl-1">({{ MY_CONTS.length }})</em> 건
              <p>목록에서 자세히를 클릭하시면 상세내용을 확인할 수 있습니다.</p>
            </div>
            <!-- <ul class="pl-sort-tabs align-end">
              <li
                v-for="item, index in SORT_ITEMS"
                :key="item.id"
                :class="item.selected ? 'selected' : ''"
                @click="FnEvt(item, index, 'KMS_SORT', 'SORT_ITEMS')"
                >
                {{ item.title }}
              </li>
            </ul> -->
          </div>
          <!--  List -->
          <div class="pl-alarm-list-wrap is-mt-m" style="height: calc(100vh - 425px);">
            <div
              v-for="item in MY_CONTS"
              :key="item.KMS_CONTS_ID"
              class="pl-alarm-list"
              @click="fnContsMyDetail(item)"
              >
              <div>
                <span class="pl-alarm-list-title"> {{ item.KMS_CONTS_NM }} </span>
                <span class="pl-alarm-list-desc">
                  <p><span class="is-txt-bull">&bull;</span>{{ item.CLSF_PATH }}</p>
                  <p><span class="is-txt-bull">&bull;</span>마지막 수정: {{ item.MDFCN_DT_F }}</p>
                </span>
              </div>
              <div>
                <span class="pl-alarm-list-link" >자세히</span>
              </div>
            </div>
            <!-- 더보기 버튼 -->
            <template v-if="MY_PAGE.showMoreBtn">
              <div class="pl-bottom-fixed">
                <v-btn class="pl-btn is-round is-sub is-icon pl-4" @click="getMyContsList('next')">
                  더보기
                  <span class="pl-icon20 arrow-up ml-2"></span>
                </v-btn>
              </div>
            </template>
            <!-- no data -->
            <div v-if="MY_CONTS.length === 0" class="pl-list-nodata">
              <span>등록된 데이터가 없습니다.</span>
            </div>
          </div>
        </template>
        <!-- detail -->
        <div v-else class="pl-right-kms-detail">
          <RIGHT_KMS_DETAIL_COMPO ref="detailMyCompo"
            @detailMyBack="getMyContsList"
            @updBadgeCnt="getBadgeCount"
            v-model="MY_DETAIL">
          </RIGHT_KMS_DETAIL_COMPO>
        </div>
        <!-- tree -->
        <!-- <div >
          <div class="pl-tree-header is-mt-m">
            <div class="is-left">

              <compo-tooltip-btn
                TitleProp="새 폴더"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 is-new-folder"
                TooltipPositionProp="bottom"
                @btnClick="mixin_showDialog('Newfolder')"
              ></compo-tooltip-btn>

              <compo-tooltip-btn
                TitleProp="수정"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 edit"
                TooltipPositionProp="bottom"
                @btnClick="mixin_testLog('수정')"
              ></compo-tooltip-btn>

              <compo-tooltip-btn
                TitleProp="삭제"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 trash"
                TooltipPositionProp="bottom"
                @btnClick="mixin_testLog('삭제')"
              ></compo-tooltip-btn>
            </div>
            <div class="is-right">
              <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault')">전체 펼치기</v-btn>
              <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault')">전체 접기</v-btn>
            </div>
          </div>
          <div class="pl-tree-body" style="height: 574px;">
            <v-treeview ref="treeDefault" :items="treeItems" :open-all="expanded" activatable open-on-click color="secondary" class="pl-tree-view">
              <template v-slot:prepend="{ item, open }">
                <v-icon v-if="item.children">
                    {{open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder'}}
                </v-icon>
                <v-icon v-else>
                    {{ 'pl-icon20 tree-file' }}
                </v-icon>
              </template>
            </v-treeview>
          </div>
        </div> -->

      </v-tab-item>
    </v-tabs>
    <!-- dialog -->
    <!-- 스크립트 등록 -->
    <v-dialog
      v-model="dialogRegScript"
      content-class="dialog-draggable is-scroll"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="스크립트 상세정보"
        @hide="mixin_hideDialog('RegScript')"
        @submit="submitDialog('RegScript')"
      >
        <template slot="body">
          <v-form ref="scriptFormInfo">
            <div class="pl-form-inline-wrap vertical label-100">
              <div class="pl-form-inline">
                <span class="pl-label">
                  구분
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <span
                    :class="`pl-round-chip flex-grow-0 is-sm chat-stat-${ SCRIPT_PRIVATE_INFO.COMM_YN == 'N' ? 'cs' : 'done' }`">
                    {{SCRIPT_PRIVATE_INFO.COMM_YN == 'N' ? '개인' : '공통'}}
                  </span>
                  <span class="is-txt-blue">
                    {{ SCRIPT_PRIVATE_INFO.RGTR_NM && SCRIPT_PRIVATE_INFO.RGTR_NM != '' ? SCRIPT_PRIVATE_INFO.RGTR_NM : $store.getters['userStore/GE_USER_NAME'] }}
                  </span>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  지식분류
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-autocomplete
                    v-model="SCRIPT_PRIVATE_INFO.KMS_CLSF_ID"
                    @change="fnGetNewSortOrd"
                    class="pl-form"
                    :items="REG_SCRIPT_CLSF_LIST"
                    item-text="FULL_PATH"
                    item-value="KMS_CLSF_ID"
                    placeholder="지식 분류를 검색하세요"
                    clearable
                    no-data-text="결과 없음"
                    :rules="validateRules.KMS_CLSF_ID"
                    :disabled="this.SCRIPT_PRIVATE_INFO.COMM_YN == 'Y'"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  스크립트 명
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-text-field
                    v-model="SCRIPT_PRIVATE_INFO.KMS_CONTS_NM"
                    class="pl-form"
                    :rules="validateRules.KMS_CONTS_NM"
                    :disabled="this.SCRIPT_PRIVATE_INFO.COMM_YN == 'Y'"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  스크립트 내용
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-textarea
                    v-model="SCRIPT_PRIVATE_INFO.KMS_CONTS_CN"
                    class="pl-form is-noresize"
                    height="250px"
                    :spellcheck="false"
                    :disabled="this.SCRIPT_PRIVATE_INFO.COMM_YN == 'Y'"
                  />
                </div>
              </div>
              <div v-if="SCRIPT_PRIVATE_INFO.COMM_YN =='N'" class="pl-form-inline">
                <span class="pl-label">
                  표시 순서
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <v-text-field
                    v-model="SCRIPT_PRIVATE_INFO.SORT_ORD"
                    class="pl-form is-xs flex-grow-0"
                    :rules="validateRules.SORT_ORD"
                  />
                </div>
              </div>
              <div v-if="SCRIPT_PRIVATE_INFO.COMM_YN =='N'" class="pl-form-inline">
                <span class="pl-label">
                  핵심 키워드
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
                <div class="pl-desc">
                  <div class="pl-tags-wrap">
                    <v-chip-group active-class="active-tag" column>
                        <v-chip v-for="(tag, index) in SCRIPT_PRIVATE_KEYWORDS"
                          :key="index"
                          close
                          @click:close="deleteTag(tag, index)">
                          {{ tag }}
                        </v-chip>
                      <template>
                        <!-- 추가 입력 -->
                        <v-text-field v-model="SCRIPT_PRIVATE_TAG_VALUE" @keydown.enter="addTag()"
                          :style="computedTagSize" style="min-width: 120px;" placeholder="키워드 입력" class="pl-form is-tag">
                          <template v-slot:append>
                            <v-btn @click="addTag()" class="pl-btn has-icon-only">
                              <span class="pl-icon20 edit"></span>
                            </v-btn>
                          </template>
                        </v-text-field>
                      </template>
                    </v-chip-group>
                  </div>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  단축 조합키
                </span>
                <div class="pl-desc">
                  <v-select
                    v-model="SCRIPT_PRIVATE_INFO.SHORTCUT_CD"
                    class="pl-form flex-grow-0"
                    :items="SHORTCUT_KEY_LIST"
                    item-text="CD_NM_WITH_USING"
                    item-value="CD_ID"
                    @change="fnChangeShortcut"
                    return-object
                    placeholder="선택하세요"
                  ></v-select>
                  <div v-if="SELECTED_SHORTCUT != null && SELECTED_SHORTCUT?.CD_ID != undefined && SELECTED_SHORTCUT?.CD_ID != 'NO_USE'" class="col-12 pa-0">
                    <div class="d-flex align-center">
                      새로붙이기 : <span class="pl-boxkey ml-1">ALT</span> + <span class="pl-boxkey">{{ SELECTED_SHORTCUT.CD_NM }}</span>
                    </div>
                    <div class="d-flex align-center is-mt-s">
                      이어붙이기 : <span class="pl-boxkey ml-1">ALT</span> + <span class="pl-boxkey" style="width: 50px">SHIFT</span> + <span class="pl-boxkey">{{ SELECTED_SHORTCUT.CD_NM }}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </v-form>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="closeRegScriptDialog(false)">닫기</v-btn>
          <v-btn
            v-if="fnCheckAuth(SCRIPT_PRIVATE_INFO.RGTR_ID) && SCRIPT_PRIVATE_INFO.KMS_CONTS_ID != undefined && SCRIPT_PRIVATE_INFO.KMS_CONTS_ID != '' && SCRIPT_PRIVATE_INFO.COMM_YN == 'N'"
            class="pl-btn is-sub"
            @click="deleteScriptReq()"
          >
            삭제
          </v-btn>
          <v-btn
            class="pl-btn"
            @click="saveScriptValid()"
          >
            저장
          </v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- <v-dialog
      v-model="dialogNewfolder"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="폴더 추가"
        @hide="mixin_hideDialog('Newfolder')"
      >
        <template slot="body">
          <p>폴더명을 입력 하신 후 <strong>[저장] 버튼을 클릭</strong>하십시오.</p>
          <div class="pl-form-inline-wrap vertical is-mt-m">
            <div class="pl-form-inline">
              <span class="pl-label">
                상위 폴더
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form is-sm"
                  disabled
                />
                <v-text-field
                  class="pl-form"
                  disabled
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                폴더 명
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                />
              </div>
            </div>
          </div>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('Newfolder')">닫기</v-btn>
          <v-btn class="pl-btn" @click="mixin_hideDialog('Newfolder')">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog> -->
  </div>

</template>

<script>
  import RIGHT_KMS_DETAIL_COMPO from './right_kms_detail_compo.vue';

  export default {
    name: 'right_kms',
    components: {
      RIGHT_KMS_DETAIL_COMPO
    },

    data() {
      return{
        dialogRegScript: false,

        BADGE : {
          NEW_CNT : '0'
          , MY_CNT : '0'
        },



        //지식 콘텐츠

        KEY_WORD : "",
        ORDER_BY : "DATE",  //  DATE(최신순) or CLSF(분류순)

        NEW_KEY_WORD : "",

        viewSorting: 0, //초기 selected 값
        btnGroupSort: [
          { icon: 'pl-icon20 sort-list', title: '목록보기', evt: () =>{ this.KMS_SCRIPT_VIEW = 'list'; this.getContsList(); } },
          { icon: 'pl-icon20 sort-tree', title: '트리보기', evt: () => { this.KMS_SCRIPT_VIEW = 'tree'; this.KEY_WORD = ""; this.getContsTreeList(); } },
        ],
        SORT_ITEMS: [
          { title: '최신순', selected: true, evt: () => { this.ORDER_BY = "DATE"; this.getContsList(); }},
          { title: '분류순', selected: false, evt: () => { this.ORDER_BY = "CLSF"; this.getContsList(); } },
        ],

        KMS_SORT: 'recent',
        KMS_LIST: [],
        KMS_SCRIPT_VIEW : 'list',


        // 지식 콘텐츠 tree
        expanded: false,
        treeItems: [],
        treeOpenSync: [],
        selectedTreeNode : null,

        //스크립트 탭

        //지식 분류 리스트
        SCRIPT_CLSF_LIST : [],
        //스크립트 등록 - 지식 분류 - 등록 가능한 분류 목록만 출력(마지막 레벨 분류)
        REG_SCRIPT_CLSF_LIST : [],
        SCRIPT_SELECTED_KMS_CLSF_ID : '',
        SCRIPT_TYPE_SORT_ITEMS: [
          { title: '최신순', selected: false, evt: () => { this.SCRIPT_ORDER_BY = "DATE"; this.getScriptConsList(); }},
          { title: '분류순', selected: true, evt: () => { this.SCRIPT_ORDER_BY = "CLSF"; this.getScriptConsList(); } },
        ],
        SCRIPT_TYPE_RADIO_ITEMS: [
          { icon: 'pl-icon20 sort-all', text: "전체", value: 'ALL', evt: () => { this.fnClickScriptSearchCheckbox()} },
          { icon: 'pl-icon20 sort-one', text: "개인", value: 'N', evt: () => { this.fnClickScriptSearchCheckbox()} },
          { icon: 'pl-icon20 sort-public', text: "공통", value: 'Y', evt: () => { this.fnClickScriptSearchCheckbox()} },
        ],
        SCRIPT_TYPE_MODEL : 0,
        SCRIPT_COMM_YN : 'ALL',
        //스크립트 등록
        SCRIPT_PRIVATE_INFO: {
          KMS_CONTS_ID : '',
          KMS_CLSF_ID : '',
          KMS_CONTS_NM : '',
          KMS_CONTS_CN : '',
          SORT_ORD : '',
          KMS_KEYWD_NMS : [],
          SHORTCUT_CD : ''
        },
        SCRIPT_PRIVATE_KEYWORDS : [],
        SCRIPT_PRIVATE_TAG_VALUE : '',
        //단축키 키 목록(콤보박스)
        SHORTCUT_KEY_LIST : [],
        //스크립트 상세 - 선택된 단축키
        SELECTED_SHORTCUT : {},
        selected_script_item: '',


        SCRIPT_KEY_WORD : "",
        SCRIPT_ORDER_BY : "CLSF",  //  DATE(최신순) or CLSF(분류순)
        // 스크립트 목록
        SCRIPT_CONTS_LIST : [],
        SCRIPT_CONTS_PAGE : {
          ROW_CNT : 500
          , PAGES_CNT : 0
          , showMoreBtn : false
        },




        // 지식 콘텐츠 목록
        CONTS_LIST : [],
        CONTS_PAGE : {
          ROW_CNT : 500
          , PAGES_CNT : 0
          , showMoreBtn : false
        },
        // 지식 콘텐츠 상세
        CONTS_DETAIL: {
          active: false,
          favorite: false,
          KMS_CONTS_ID : "",
          KMS_CONTS_NM : "",
          BOOK_MARK_YN : "",
          MDFCN_DT_F : "",
          CLSF_PATH : "",
          GUIDE_LIST : [],
        },


        // 새로운 지식 목록
        NEW_CONTS : [],
        NEW_PAGE : {
          ROW_CNT : 500
          , PAGES_CNT : 1
          , showMoreBtn : false
        },
        // 새로운 지식 상세
        NEW_DETAIL: {
          active: false,
          favorite: false,
          KMS_CONTS_ID : "",
          KMS_CONTS_NM : "",
          BOOK_MARK_YN : "",
          MDFCN_DT_F : "",
          CLSF_PATH : "",
          GUIDE_LIST : [],
        },


        // 나의 즐겨찾기 목록
        MY_CONTS : [],
        MY_PAGE : {
          ROW_CNT : 500
          , PAGES_CNT : 1
          , showMoreBtn : false
        },
        // 나의 즐겨찾기 상세
        MY_DETAIL: {
          active: false,
          favorite: false,
          KMS_CONTS_ID : "",
          KMS_CONTS_NM : "",
          BOOK_MARK_YN : "",
          MDFCN_DT_F : "",
          CLSF_PATH : "",
          GUIDE_LIST : [],
        },


        validateRules: {
          KMS_CONTS_ID: [v => !!v || '지식분류는 필수 항목 입니다.'],
          KMS_CONTS_NM: [v => !!v || '스크립트 명은 필수 항목 입니다.'],
          SORT_ORD: [v => !!v || '표시 순서는 필수 항목 입니다.'],
        },
        //confirm alert 메시지
        MESSAGE : {
          CONFIRM : {
            REG_SCRIPT : {alertDialogToggle: true, msg: '저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.saveScript, callNo: this.closeMsg}
            ,DELETE_SCRIPT : {alertDialogToggle: true, msg: '선택된 항목을 삭제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.deleteScript, callNo: this.closeMsg}
          },
          ALERT : {
            NO_CONTS : {alertDialogToggle: true, msg: '컨텐츠를 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
            ,NO_SCRIPT_KEYWORD : {alertDialogToggle: true, msg: '핵심 키워드는 필수 항목입니다.', iconClass: 'is-caution', type: 'default'}
            ,EMPTY_SCRIPT_KEYWORD : {alertDialogToggle: true, msg: '핵심 키워드 값을 입력해 주세요.', iconClass: 'is-caution', type: 'default'}
            ,NO_KMS_CONTS_CN : {alertDialogToggle: true, msg: '스크립트 내용을 입력하세요.', iconClass: 'is-caution', type: 'default'}
          },
          TOAST : {
            SUCCESS : {msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 3000}
          },
          ERROR : {
            ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
          }
        },

        TOAST_ALARM_PASTE: {  msg: 'SNS상담 메뉴에서 사용하실 수 있습니다.', class: 'info', hasToastIcon: true, icon: 'mdi-information-outline', time: 4000 },

        // temp 단축키
        SHORTCUT_KEY_CD : '1',

      }
    },
    created() {
      this.getScriptClsfList();
      this.getScriptConsList();


      this.getBadgeCount();
    },
    computed: {
      computedTagSize() {
        return `flex: 0 0 ${ this.inputTagSize + 12 }ch;`;
      },
    },
    methods: {
      // 스크립트
      selectScriptDetail(index){
        for (let i = 0; i < this.SCRIPT_CONTS_LIST.length; i++) {
          this.$set(this.SCRIPT_CONTS_LIST[i], 'selected', false);
        }
        this.$set(this.SCRIPT_CONTS_LIST[index], 'selected', true);
      },

      //스크립트 등록 - 지식분류 선택 시 새 표시 순서 값 조회.
      async fnGetNewSortOrd() {
        const sUrl = '/api/km/conts/selectNewSortOrd'
        const headParam = {head: {}}
        const postParam = {
          COMM_YN: 'N',
          KMS_CLSF_ID: this.SCRIPT_PRIVATE_INFO.KMS_CLSF_ID
        };
        let resData = await this.common_postCall(sUrl, postParam, headParam );
        if(resData.HEADER != undefined && !resData.HEADER.ERROR_FLAG) {
          this.SCRIPT_PRIVATE_INFO.SORT_ORD = resData.DATA[0].SORT_ORD
        }
      },
      //스크립트 등록
      async regScriptDetail(){
        this.selected_script_item = '';
        this.SCRIPT_PRIVATE_INFO = {COMM_YN:'N',SHORTCUT_CD:'NO_USE', SORT_ORD : ''}
        this.SCRIPT_PRIVATE_KEYWORDS = []
        this.SCRIPT_PRIVATE_TAG_VALUE = ''
        this.SELECTED_SHORTCUT = {}
        await this.getShortcutKeyList()
        this.mixin_showDialog('RegScript');
      },

      //스크립트 수정
      async modifyScriptDetail(item){
        const sUrl = '/api/km/conts/selectContent'
        const headParam = {head: {}}
        const postParam = {
          KMS_CONTS_ID: item.KMS_CONTS_ID,
          KMS_CLSF_ID: item.KMS_CLSF_ID
        };

        let resData = await this.common_postCall(sUrl, postParam, headParam );
        if(resData.HEADER != undefined && !resData.HEADER.ERROR_FLAG) {
          this.SCRIPT_PRIVATE_INFO = resData.DATA[0]
          this.SCRIPT_PRIVATE_KEYWORDS = []
          this.SCRIPT_PRIVATE_INFO.KMS_KEYWD_NMS = this.SCRIPT_PRIVATE_INFO.KMS_KEYWD_NMS.split(",")
          this.SCRIPT_PRIVATE_INFO.KMS_KEYWD_NMS.forEach((kwyword)=>{
            this.SCRIPT_PRIVATE_KEYWORDS.push(kwyword)
          })

          await this.getShortcutKeyList()
        }
        this.mixin_showDialog('RegScript');
      },

      // isScriptType(){
      //   const script_type = this.SCRIPT_TYPE_CHK_ITEMS;
      //   let script_type_item;
      //   for (let i = 0; i < script_type.length; i++) {
      //     script_type_item = script_type[i].value;
      //   }
      //   return script_type_item;
      // },
      addTag(){
        if(this.SCRIPT_PRIVATE_TAG_VALUE.trim() == '') {
          this.SCRIPT_PRIVATE_TAG_VALUE = '';
          this.showAlert(this.MESSAGE.ALERT.EMPTY_SCRIPT_KEYWORD);
          return;
        }
        const addTag = this.SCRIPT_PRIVATE_TAG_VALUE.trim()
        this.SCRIPT_PRIVATE_TAG_VALUE = '';
        this.SCRIPT_PRIVATE_KEYWORDS.push(addTag);
      },

      deleteTag(tag, index) {
        // this.$set(this.KEYWORDS[index],'active',false)
        this.SCRIPT_PRIVATE_KEYWORDS.splice(index, 1)
      },

      //단축키 키 목록 조회
      async getShortcutKeyList() {
        this.SHORTCUT_KEY_LIST = []
        this.SELECTED_SHORTCUT = {}

        const sUrl = '/api/system/shortcut/selectShortcutKeyList'
        const headParam = {head: {}}
        const postParam = {
        };

        let resData = await this.common_postCall(sUrl, postParam, headParam );
        if(resData.HEADER != undefined && !resData.HEADER.ERROR_FLAG) {
          this.SHORTCUT_KEY_LIST = resData.DATA
          if(this.SCRIPT_PRIVATE_INFO != null && this.SCRIPT_PRIVATE_INFO.SHORTCUT_CD != '') {
            for(let i=0; i < this.SHORTCUT_KEY_LIST.length; i++) {
              if(this.SHORTCUT_KEY_LIST[i].CD_ID == this.SCRIPT_PRIVATE_INFO.SHORTCUT_CD) {
                this.SELECTED_SHORTCUT = this.SHORTCUT_KEY_LIST[i]
                break
              }
            }
          }
        }
      },

      fnChangeShortcut(item) {
        this.SELECTED_SHORTCUT = item
      },

      detailBack(){
        this.selectedTreeNode = null;
      },
      expandAll(id){
        this.expanded = true;
        this.$refs[id].updateAll(true);
      },
      collapseAll(id){
        this.expanded = false;
        this.$refs[id].updateAll(false);
        this.openTreeRoot()
      },
      //root Tree Open
      openTreeRoot() {
        if(!!this.treeItems && this.treeItems.length > 0 && this.treeItems[0]?.children?.length > 0) {
          this.treeOpenSync = [{'id':this.treeItems[0].id}]
        }
      },

      async getBadgeCount(){
        let sUrl = '/api/km/right/rightContsBadgeConut';

        let postParam = {};
        let headParam = {
          head : {}
        };
        let response  = await this.common_postCall(sUrl, postParam, headParam);
        if (!response.HEADER.ERROR_FLAG){
          if(response.DATA){
            let oData = response.DATA[0];
            this.BADGE.NEW_CNT = oData.NEW_CNT;
            this.BADGE.MY_CNT = oData.MY_CNT;
          }
        }
      },

      openTab(gubun){
        if( "CONTS" === gubun ) {
          this.CONTS_DETAIL.active = false;
          this.getContsList();
        } else if( "NEW" === gubun ) {
          this.NEW_DETAIL.active = false;
          this.getNewContsList();
        } else {
          this.MY_DETAIL.active = false;
          this.getMyContsList();
        }
      },

      // 스트립트 탭 - 지식 분류 조회
      async getScriptClsfList() {
        let sUrl = '/api/km/clsf/clsfTreeList';
        this.SCRIPT_CLSF_LIST = []
        this.REG_SCRIPT_CLSF_LIST = []

        // Yabong TODO :  관리자 여부 확인 요망  -- 변경시 BE Query 도 변경 할 것
        let postParam = {
          ADM_YN : "Y"
        };

        let headParam = {
          head : {}
        };
        let response  = await this.common_postCall(sUrl, postParam, headParam);
        if (!response.HEADER.ERROR_FLAG){
          if(response.DATA){
            const clsfList = response.DATA
            clsfList.map((item) => {
              if(item.RIGHT_SCRIPT_CNT !== "0") {
                this.SCRIPT_CLSF_LIST.push(item)
              }
            })
            clsfList.map((item) => {
              if(item.CHILD_CNT === "0") {
                this.REG_SCRIPT_CLSF_LIST.push(item)
              }
            })
          }
        }
      },

      /**
       * 스크립트 탭 - 개인, 공통 체크박스 클릭 시 처리
       * @param {} chkbox
       */
      fnClickScriptSearchCheckbox(val) {
        this.SCRIPT_COMM_YN = val
        this.getScriptConsList()
      },

      //새로붙이기, 이어붙이기. SNS상담 메뉴에서만 동작하며, 다른 메뉴에서는 TOAST 알람 띄운다.
      fnChatMessagePaste(type, message) {
        const activeTab = this.$store.getters["commonStore/GE_COMMON_ACTIVE_TAB"]
        if(activeTab.id === 'CSL_M0200') {
          this.$eventBus.$emit('chatMessagePaste', type, message);
        } else {
          this.showToast(this.TOAST_ALARM_PASTE)
        }
      },
      FnBtnPath(evt) {
        evt();
      },

      /**
       * 스크립트 콘텐츠 목록 조회
       * @param {string} gubun
       */
      async getScriptConsList(gubun){

        if( "next" === gubun ){
          this.SCRIPT_CONTS_PAGE.PAGES_CNT += 1;
        } else {
          this.SCRIPT_CONTS_PAGE.PAGES_CNT = 1;
          this.SCRIPT_CONTS_LIST = [];
        }

        let sUrl = '/api/km/right/rightContsList';
        let postParam = {
          SCRIPT_KMS_CLSF_ID: this.SCRIPT_SELECTED_KMS_CLSF_ID
          , KEY_WORD : this.SCRIPT_KEY_WORD
          , ORDER_BY : this.SCRIPT_ORDER_BY
          , COMM_YN : this.SCRIPT_COMM_YN !== 'ALL' ? this.SCRIPT_COMM_YN : ''
          , SE_CD : 'SCRIPT'
        };

        let headParam = {
          head : {
            ROW_CNT : this.SCRIPT_CONTS_PAGE.ROW_CNT,
            PAGES_CNT : this.SCRIPT_CONTS_PAGE.PAGES_CNT,
            PAGING : "Y",
          }
        };
        let response  = await this.common_postCall(sUrl, postParam, headParam);
        if (!response.HEADER.ERROR_FLAG){
          if(response.DATA){
            let tmpList = response.DATA;
            this.SCRIPT_CONTS_LIST = [...this.SCRIPT_CONTS_LIST, ...tmpList];    // ...append
          }

          if(response.HEADER.next !== null && response.HEADER.next !== undefined){
            if(response.HEADER.next === true){
              this.SCRIPT_CONTS_PAGE.showMoreBtn = true //버튼 활성화
            }else{
              this.SCRIPT_CONTS_PAGE.showMoreBtn = false  //버튼 비활성화
            }
          }
        }
      },

      async getContsList(gubun){

        if( "next" === gubun ){
          this.CONTS_PAGE.PAGES_CNT += 1;
        } else {
          this.CONTS_PAGE.PAGES_CNT = 1;
          this.CONTS_LIST = [];
        }

        let sUrl = '/api/km/right/rightContsList';

        let postParam = {
          KEY_WORD : this.KEY_WORD
          , ORDER_BY : this.ORDER_BY
          , SE_CD : 'KNOWLEDGE'
        };

        let headParam = {
          head : {
            ROW_CNT : this.CONTS_PAGE.ROW_CNT,
            PAGES_CNT : this.CONTS_PAGE.PAGES_CNT,
            PAGING : "Y",
          }
        };
        let response  = await this.common_postCall(sUrl, postParam, headParam);
        if (!response.HEADER.ERROR_FLAG){
          if(response.DATA){
            let tmpList = response.DATA;
            this.CONTS_LIST = [...this.CONTS_LIST, ...tmpList];    // ...append
          }

          if(response.HEADER.next !== null && response.HEADER.next !== undefined){
            if(response.HEADER.next === true){
              this.CONTS_PAGE.showMoreBtn = true //버튼 활성화
            }else{
              this.CONTS_PAGE.showMoreBtn = false  //버튼 비활성화
            }
          }
        }
      },

      async getContsTreeList(){
        let sUrl = '/api/km/right/rightContsTreeList';

        let postParam = {
          SE_CD : 'KNOWLEDGE'
        };

        let headParam = {
          head : {}
        };
        let response  = await this.common_postCall(sUrl, postParam, headParam);
        if (!response.HEADER.ERROR_FLAG){
          if(response.KM_CLSF_TREE){
            this.treeItems = response.KM_CLSF_TREE;
            this.openTreeRoot()
          }
        }
      },

      selectTree(node){
        let tempNode = node[0];
        if(tempNode) {
          this.selectedTreeNode = tempNode;
        } else {
          this.selectedTreeNode = null;
        }
      },

      fnContsDetail(item){
        this.CONTS_DETAIL.KMS_CONTS_ID = item.KMS_CONTS_ID;
        this.CONTS_DETAIL.KMS_CONTS_NM = item.KMS_CONTS_NM;
        this.CONTS_DETAIL.BOOK_MARK_YN = item.BOOK_MARK_YN;
        this.CONTS_DETAIL.MDFCN_DT_F = item.MDFCN_DT_F;
        this.CONTS_DETAIL.active = true;
      },

      //새로운 지식 탭 지식 콘텐츠 목록 조회
      async getNewContsList(gubun){

        if( "next" === gubun ){
          this.NEW_PAGE.PAGES_CNT += 1;
        } else {
          this.NEW_PAGE.PAGES_CNT = 1;
          this.NEW_CONTS = [];
        }

        let sUrl = '/api/km/right/rightContsList';

        let postParam = {
          KEY_WORD : this.NEW_KEY_WORD
          , ORDER_BY : "DATE"
          , NEW_YN : "Y"
          , SE_CD : 'KNOWLEDGE'
        };

        let headParam = {
          head : {
            ROW_CNT : this.NEW_PAGE.ROW_CNT,
            PAGES_CNT : this.NEW_PAGE.PAGES_CNT,
            PAGING : "Y",
          }
        };
        let response  = await this.common_postCall(sUrl, postParam, headParam);
        if (!response.HEADER.ERROR_FLAG){
          if(response.DATA){
            let tmpList = response.DATA;
            this.NEW_CONTS = [...this.NEW_CONTS, ...tmpList];    // ...append
          }

          if(response.HEADER.next !== null && response.HEADER.next !== undefined){
            if(response.HEADER.next === true){
              this.NEW_PAGE.showMoreBtn = true //버튼 활성화
            }else{
              this.NEW_PAGE.showMoreBtn = false  //버튼 비활성화
            }
          }

        }
      },

      fnContsNewDetail( item ){
        this.NEW_DETAIL.KMS_CONTS_ID = item.KMS_CONTS_ID;
        this.NEW_DETAIL.KMS_CONTS_NM = item.KMS_CONTS_NM;
        this.NEW_DETAIL.BOOK_MARK_YN = item.BOOK_MARK_YN;
        this.NEW_DETAIL.MDFCN_DT_F = item.MDFCN_DT_F;
        this.NEW_DETAIL.active = true;
      },

      fnContsMyDetail( item ){
        this.MY_DETAIL.KMS_CONTS_ID = item.KMS_CONTS_ID;
        this.MY_DETAIL.KMS_CONTS_NM = item.KMS_CONTS_NM;
        this.MY_DETAIL.BOOK_MARK_YN = item.BOOK_MARK_YN;
        this.MY_DETAIL.MDFCN_DT_F = item.MDFCN_DT_F;
        this.MY_DETAIL.active = true;
      },

      //나의 즐겨찾기 탭 지식 콘텐츠 목록 조회
      async getMyContsList(gubun){

        if( "next" === gubun ){
          this.MY_PAGE.PAGES_CNT += 1;
        } else {
          this.MY_PAGE.PAGES_CNT = 1;
          this.MY_CONTS = [];
        }

        let sUrl = '/api/km/right/rightContsList';

        let postParam = {
          ORDER_BY : "DATE"
          , BOOK_MARK_YN : "Y"
          , SE_CD : 'KNOWLEDGE'
        };

        let headParam = {
          head : {
            ROW_CNT : this.MY_PAGE.ROW_CNT,
            PAGES_CNT : this.MY_PAGE.PAGES_CNT,
            PAGING : "Y",
          }
        };
        let response  = await this.common_postCall(sUrl, postParam, headParam);
        if (!response.HEADER.ERROR_FLAG){
          if(response.DATA){
            let tmpList = response.DATA;
            this.MY_CONTS = [...this.MY_CONTS, ...tmpList];    // ...append
          }

          if(response.HEADER.next !== null && response.HEADER.next !== undefined){
            if(response.HEADER.next === true){
              this.MY_PAGE.showMoreBtn = true //버튼 활성화
            }else{
              this.MY_PAGE.showMoreBtn = false  //버튼 비활성화
            }
          }

        }
      },

      //스크립트 저장 검증
      saveScriptValid() {
        if(this.SCRIPT_PRIVATE_INFO.COMM_YN == 'N') {
          if(!this.$refs.scriptFormInfo.validate()) {
            this.tab = 0;
            return;
          }
          if(this.SCRIPT_PRIVATE_KEYWORDS.length == 0) {
            this.tab = 0;
            this.showAlert(this.MESSAGE.ALERT.NO_SCRIPT_KEYWORD);
            return;
          }
          if(this.SCRIPT_PRIVATE_INFO.KMS_CONTS_CN == undefined || this.SCRIPT_PRIVATE_INFO.KMS_CONTS_CN.length == 0) {
            this.showAlert(this.MESSAGE.ALERT.NO_KMS_CONTS_CN); return;
          }
        }
        if(this.SELECTED_SHORTCUT.LNK_ID != undefined && this.SELECTED_SHORTCUT.LNK_ID != '' && this.SELECTED_SHORTCUT.LNK_ID != this.SCRIPT_PRIVATE_INFO.KMS_CONTS_ID) {
          this.$nextTick(this.showAlert({alertDialogToggle: true, msg: "스크립트 : '" + this.SELECTED_SHORTCUT.LNK_NM + "'에서 사용중입니다. 변경하시겠습니까?", iconClass: 'is-info', type: 'confirm', callYes: this.saveScript, callNo: this.closeMsg}));
        } else {
          this.$nextTick(this.showAlert(this.MESSAGE.CONFIRM.REG_SCRIPT));
        }

      },

      //스크립트 저장
      async saveScript(){
        this.closeMsg()
        if(this.SCRIPT_PRIVATE_INFO.COMM_YN == 'N') {
          //개인 스크립트일때만 저장.
          if(!this.$refs.scriptFormInfo.validate() ) return;

          const sUrl = '/api/km/conts/mergeContent';
          const headParam = {head: {}};
          const postParam = {
            KMS_CONTS_ID : this.SCRIPT_PRIVATE_INFO.KMS_CONTS_ID,
            KMS_CLSF_ID : this.SCRIPT_PRIVATE_INFO.KMS_CLSF_ID,
            KMS_CONTS_NM : this.SCRIPT_PRIVATE_INFO.KMS_CONTS_NM,
            SE_CD : "SCRIPT",
            SORT_ORD : this.SCRIPT_PRIVATE_INFO.SORT_ORD,
            // 우측 지식 정보에서 스크립트 등록 시, 공통_여부 = 'N'(개인 스크립트)
            COMM_YN : 'N',
            //개인 스크립트는 공개 상태로 등록.
            STTS_CD : 'PBIC',
            KMS_CONTS_CN : this.SCRIPT_PRIVATE_INFO.KMS_CONTS_CN,
            LIST : this.getActiveKeywords()
          }

          let resData = await this.common_postCall(sUrl, postParam, headParam );

          if(resData.HEADER != undefined && !resData.HEADER.ERROR_FLAG) {
            this.SCRIPT_PRIVATE_INFO.KMS_CONTS_ID = resData.DATA[0].KMS_CONTS_ID
            // this.$eventBus.$emit('shortcutReload');
            // this.showAlert(this.MESSAGE.ALERT.SUCCESS)
            // this.closeRegScriptDialog(true);
          }
        }
        //단축키 설정을 했을 시, 단축키 저장 또는 삭제
        if(this.SELECTED_SHORTCUT != null && this.SELECTED_SHORTCUT != undefined && this.SELECTED_SHORTCUT.CD_ID != '') {
          //이 api를 호출하면 alt, alt+shift 두 개가 등록된다. 사용안함일시에는 삭제 처리.
          const sUrl = '/api/km/right/mergeShortcutKmsScript';
          const headParam = {head: {}};
          const postParam = {
            SHORT_TYPE_CD : 'KMS_SCRIPT',
            LNK_ID : this.SCRIPT_PRIVATE_INFO.KMS_CONTS_ID,
            KEY_CD : this.SELECTED_SHORTCUT.CD_ID
          }

          let resData = await this.common_postCall(sUrl, postParam, headParam );

          if(resData.HEADER != undefined && !resData.HEADER.ERROR_FLAG) {
            // this.SCRIPT_PRIVATE_INFO.KMS_CONTS_ID = resData.DATA[0].KMS_CONTS_ID
            this.$eventBus.$emit('shortcutReload')
            this.showToast(this.MESSAGE.TOAST.SUCCESS)
            this.closeRegScriptDialog(true)
          }
        } else {
          this.showToast(this.MESSAGE.TOAST.SUCCESS)
          this.closeRegScriptDialog(true)
        }
      },


      //스크립트 삭제 요청
      deleteScriptReq() {
        this.showAlert(this.MESSAGE.CONFIRM.DELETE_SCRIPT)
      },

      //스크립트 삭제
      async deleteScript() {
        this.closeMsg()
        let sUrl = '/api/km/conts/contsProcStts';
        let headParam = {
          head : {}
        }
        let postParam = {
          KMS_CONTS_ID : this.SCRIPT_PRIVATE_INFO.KMS_CONTS_ID,
          STTS_CD : 'DELT',
          SORT_ORD : '999'
        }

        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG) {
          //단축키 설정을 했을 시, 단축키가 삭제되므로 shortcutReload eventBus 호출.
          if(this.SCRIPT_PRIVATE_INFO.SHORTCUT_CD != null && this.SCRIPT_PRIVATE_INFO.SHORTCUT_CD != '' && this.SCRIPT_PRIVATE_INFO.SHORTCUT_CD != 'NO_USE') {
            this.$eventBus.$emit('shortcutReload')
          }

          this.showToast(this.MESSAGE.TOAST.SUCCESS);
          this.closeRegScriptDialog(true)
        }
      },

      getActiveKeywords() {
        let list = [];
        this.SCRIPT_PRIVATE_KEYWORDS.forEach((item) => {
          list.push(item);
        });
        return JSON.stringify(list);
      },

      //스크립트 등록 다이얼로그 닫기.
      closeRegScriptDialog(isRefresh) {
        if(isRefresh) {
          this.getScriptConsList();
          this.getScriptClsfList();
        }
        this.mixin_hideDialog('RegScript')
      },

      //개인 스크립트 저장, 삭제 버튼 출력 시, 등록자 본인이 맞는지 확인.
      fnCheckAuth(userId) {
        if(userId === this.$store.getters['userStore/GE_USER_ROLE'].userId) {
          return true
        }
        return false
      },

      // sort
      FnEvt(item, index, type, arr) {
        this.mixin_selected_sort(arr, index);
        this[type] = item.type;
        item.evt();
      },

      closeMsg() {
        this.$store.commit("alertStore/hideAlert");
      },

      //개행 문자 to <br /> 태그 변환
      fnNewLineToBr(str) {
        return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
      },

    },
    mounted() {
    },

  }
</script>

<style lang="scss" scoped>
.script_detail_line {
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  &.selected {
    -webkit-line-clamp: initial;
  }
}
</style>