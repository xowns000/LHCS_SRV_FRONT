<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                사용 여부
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="dropItems"
                  placeholder="선택하세요"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                게시판 명
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form is-lg"
                  placeholder="검색어 입력"
                />
              </div>
            </div>
            <v-btn class="pl-btn is-icon">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols flex-grow-1">
        <!-- left -->
        <div class="is-vrt" >
          <div class="pl-card">
            <div class="pl-grid-top">
              <div class="pl-grid-top-left">
                <v-btn class="pl-btn is-icon is-sub" @click="mixin_showDialog('RegCommonCode')">
                  <span class="pl-icon20 circle-plus"></span>
                  둥록
                </v-btn>
                <v-btn class="pl-btn is-icon is-sub">
                  <span class="pl-icon20 trash"></span>
                  삭제
                </v-btn>
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
              </div>
            </div>
            <v-data-table
              class="pl-grid has-control"
              show-select
              :headers="headers"
              :items="items"
              fixed-header
              item-key="index"
              height="562px"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              :page.sync="page"
              no-data-text="등록된 데이터가 없습니다."
              @page-count="pageCount = $event">
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

              <span class="pl-pager-period">보기 {{ mixin_getPagePeriod(items, page) }} / {{ items.length }}</span>
            </div>
          </div>
        </div>
        <!-- right -->
        <div class="is-col-fix is-vrt" style="width: 610px">
          <div class="pl-card">
            <h2 class="pl-subtit">게시판 상세 정보</h2>
            <div class="pl-subdesc">
              <p>필수 항목을 입력하신 후 [저장] 버튼을 클릭하십시오</p>
            </div>
          </div>
          <div >
            <div class="pl-card" style="overflow: auto; height: 570px; ">
              <div class="pl-form-inline-wrap vertical">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    게시판 ID
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-text-field class="pl-form" />
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    게시판 명
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-text-field class="pl-form" />
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    게시판 유형
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-radio-group
                      row
                      class="pl-radio-group"
                    >
                      <v-radio
                        v-for="(rad01, index) in radioGroup"
                        :key="radioGroup[index].text"
                        :label="rad01.text"
                        :value="rad01.text"
                        class="pl-radio"
                      >
                      </v-radio>
                    </v-radio-group>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    기능
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <div class="pl-selection-row">
                      <v-checkbox
                        v-model="chk01.selected"
                        v-for="(chk01, index) in chkTypes"
                        :key="index"
                        :label="chk01.text"
                        class="pl-check "
                      ></v-checkbox>
                    </div>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    New 표기일
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      suffix="일"
                      class="pl-form" />
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    사용여부
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-select
                      class="pl-form"
                      :items="dropItemsS01"
                      placeholder="선택하세요"
                    ></v-select>
                  </div>
                </div>

                <div class="pl-form-inline">
                  <span class="pl-label">
                    설명
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc">
                    <v-textarea
                      class="pl-form is-noresize"
                      placeholder="기타 설명 내용 입력"
                      :spellcheck="false"
                    />
                  </div>
                </div>


              </div>


            </div>
            <div class="pl-card is-bottom">
              <div class="is-right">
                <v-btn class="pl-btn">저장</v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- dialog -->
  </div>
</template>

<script>
export default {
name:"MENU_BBS_M0300", //name은 'MENU_' + 파일명 조합
components: {
},
data() {
   return {
    // top search
    dropItems: [ '전체', '사용', '사용안함', ],

    // 상세정보
    dropItemsS01: ['고객 정보', '상담내용'],
    chkTypes: [
      {
        text: "답변허용",
        selected: false,
      },
      {
        text: "파일첨부",
        selected: false,
      },
      {
        text: "실시간 공지여부",
        selected: false,
      },
    ],
    radioGroup: [
      {
        text: "게시판",
      },
      {
        text: "공지사항",
      },
      {
        text: "이미지 게시판",
      },
    ],


    // grid
    page: 1,
    pageCount: 0,
    perPage: [15,30,50,100],
    ROW_PER_PAGE: 15,
    headers: [
      { text: '번호', value: 'index', align: 'center', width: '80px' },
      { text: '유형', value: 'type', align: 'center', width: '120px' },
      { text: '스크립트명', value: 'subject'},
      { text: '수정일', value: 'date', align: 'center', width: '120px' },
    ],
    items: [
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      { type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
    ],
   }
 },

  watch: {

  },

  computed: {

  },

  created() {

  },

  mounted() {

  },

  methods: {

  },
}
</script>

<style lang="scss" scoped>

</style>