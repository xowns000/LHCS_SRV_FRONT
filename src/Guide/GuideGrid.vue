<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <!-- //mark: Default -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <strong class="is-txt-red">그리드 클릭 이벤트 있을때, pl-grid 클래스에 is-hover 클래스 추가</strong>
      <div class="pl-grid-top mt-2">
        <div class="pl-grid-top-left">
          <v-btn class="pl-btn is-icon is-sub">
            <span class="pl-icon20 document"></span>
            선택항목 상세
          </v-btn>
          <v-btn class="pl-btn is-icon is-sub">
            <span class="pl-icon20 circle-plus"></span>
            채팅이력 생성
          </v-btn>
          <v-btn class="pl-btn" @click="toggleGridHover()">
            마우스 오버시 커서 포인트 변경
          </v-btn>
        </div>
        <div class="pl-grid-top-utils">
          <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
          <!-- 엑셀 다운로드 버튼 -->
          <compo-tooltip-btn
            TitleProp="엑셀 다운로드"
            ClassProp="pl-tooltip-btn is-line"
            IconProp="pl-icon20 exceldown"
            TooltipPositionProp="bottom"
            @btnClick="mixin_testLog('엑셀 다운로드')"
          ></compo-tooltip-btn>
        </div>
      </div>
      <v-data-table
        :class="`pl-grid ${ toggleGridClass ? 'is-hover' : '' }`"
        :headers="headers"
        :items="items"
        fixed-header
        item-key="index"
        height="562px"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
        :page.sync="page"
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
        <!-- 더보기 다음 있을때만 노출 -->
        <span class="pl-pager-period">
          보기 {{ mixin_getPagePeriod(items, page) }} / {{ items.length }}
          <compo-tooltip-btn
            TitleProp="다음 검색"
            ClassProp="pl-tooltip-btn is-line"
            IconProp="pl-icon20 arrow-next-paging"
            TooltipPositionProp="bottom"
          ></compo-tooltip-btn>
        </span>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: Selected / 특정 컬럼 변경 / Search -->
    <h2>{{ toplink[1] }}</h2>
    <div class="guide-card">
      <div class="pl-grid-top">
        <div class="pl-grid-top-left">
          <v-select
            class="pl-form"
            :items="dropItemsCompany"
            item-text="title"
            placeholder="선택하세요"
            @change="FnGridChg"
          ></v-select>
          <v-text-field
            class="pl-form is-lg"
            v-model="gridSearch"
            placeholder="검색어를 입력하세요"
          ></v-text-field>
          <v-btn class="pl-btn is-icon is-sub">
            <span class="pl-icon20 document"></span>
            선택항목 상세
          </v-btn>
          <v-btn class="pl-btn is-icon is-sub">
            <span class="pl-icon20 circle-plus"></span>
            채팅이력 생성
          </v-btn>
        </div>
        <div class="pl-grid-top-utils">
          <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
          <!-- 엑셀 다운로드 버튼 -->
          <compo-tooltip-btn
            TitleProp="엑셀 다운로드"
            ClassProp="pl-tooltip-btn is-line"
            IconProp="pl-icon20 exceldown"
            TooltipPositionProp="bottom"
            @btnClick="mixin_testLog('엑셀 다운로드')"
          ></compo-tooltip-btn>
        </div>
      </div>
      <!-- 그리드 -->
      <v-data-table
        v-model="chkSelected"
        class="pl-grid has-control"
        :headers="headers2"
        :items="items"
        :items-per-page="ROW_PER_PAGE"
        item-key="index"
        height="562px"
        :search="gridSearch"
        :page.sync="page2"
        hide-default-footer
        show-select
        fixed-header
        @page-count="pageCount2 = $event"
      >
        <template v-slot:header.type>
          {{ CURRENT_COMPANY }}
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
          v-model="page2"
          :length="pageCount2"
          circle
          :total-visible="7">
        </v-pagination>
        <span class="pl-pager-period">보기 {{ mixin_getPagePeriod(items, page2) }} / {{ items.length }}</span>
      </div>
      <hr>
      <div>Selected :
        <ul>
          <li v-for="item in chkSelected" :key="item.id">
            {{ item.index }}
            {{ item.subject }}
          </li>
        </ul>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />

    <!-- //mark: Horizontal Scroll -->
    <h2>{{ toplink[2] }}</h2>
    <div class="guide-card">
      <v-data-table
        class="pl-grid"
        :headers="headers4"
        :items="items"
        fixed-header
        item-key="index"
        height="200px"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
        :page.sync="page3"
        @page-count="pageCount3 = $event">
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
          v-model="page3"
          :length="pageCount3"
          circle
          :total-visible="7">
        </v-pagination>
        <span class="pl-pager-period">보기 {{ mixin_getPagePeriod(items, page3) }} / {{ items.length }}</span>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source03" :SrcProp="srcAll.srcInput_03" />

    <!-- //mark: 합계 -->
    <h2>{{ toplink[3] }}</h2>
    <div class="guide-card">
      <!-- <p>colResizing클래스 추가시 resizing기능 추가, methods //그리드 col resizing <span class="is-txt-red">resizableGrid()</span>
        mounted : //그리드 col resizing 참고</p> -->
        <v-data-table
          class="pl-grid"
          :headers="gridDataHeaders"
          :items="gridDataText"
          fixed-header
          item-key="index"
          height="562px"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
          :page.sync="page"
          @page-count="pageCount = $event"
        >
          <template slot="footer">
            <div class="pl-grid-sum">
              <table >
                <colgroup>
                  <col v-for="(col, index) in gridDataHeaders" :key="index" :width=col.width />
                </colgroup>
                <tbody >
                  <tr >
                    <td class="pl-grid-sum-head text-center">합계</td>
                    <td class="text-right">
                      {{ mixin_convertNumToComma(mixin_sum_field(this.gridDataText, "type01")) }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_convertNumToComma(mixin_sum_field(this.gridDataText, "type02")) }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_convertNumToComma(mixin_sum_field(this.gridDataText, "type03")) }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_convertNumToComma(mixin_sum_field(this.gridDataText, "type04")) }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_convertNumToComma(mixin_sum_field(this.gridDataText, "type05")) }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_convertNumToComma(mixin_sum_field(this.gridDataText, "type06")) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </v-data-table>
    </div>
    <guide-srcview :ModelProp.sync="source04" :SrcProp="srcAll.srcInput_04" />

    <!-- //mark: Selected, 선택색상 별도지정 -->
    <h2>{{ toplink[4] }}</h2>
    <div class="guide-card">
      <v-data-table
        class="pl-grid has-control"
        :headers="headers5"
        :items="items"
        item-key="index"
        :items-per-page="ROW_PER_PAGE"
        :item-class="isActiveRow"
        fixed-header
        hide-default-footer
        show-select
        height="200px"
        :page.sync="page"
        @page-count="pageCount = $event"
        @click:row="rowSelect">
      </v-data-table>
    </div>
    <guide-srcview :ModelProp.sync="source05" :SrcProp="srcAll.srcInput_05" />

    <!-- //mark: Multi Row Header -->
    <h2>{{ toplink[5] }}</h2>
    <div class="guide-card">
      <v-data-table
        class="pl-grid"
        :headers="headers5"
        :items="items"
        fixed-header
        item-key="index"
        height="200px"
        hide-default-header
        hide-default-footer
        :page.sync="page"
        @page-count="pageCount = $event">
        <template v-slot:header>
          <thead class="v-data-table-header multi-row">
            <tr>
              <th rowspan="2" width="80px" class="text-center"><span>NO</span></th>
              <th colspan="3" width="300px" class="text-center"><span>상담유형</span></th>
              <th rowspan="2" class="text-center"><span>스크립트명</span></th>
              <th rowspan="2" width="100px" class="text-center"><span>수정일</span></th>
            </tr>
            <tr>
              <th class="text-center"><span>대분류</span></th>
              <th class="text-center"><span>중분류</span></th>
              <th class="text-center"><span>소분류</span></th>
            </tr>
          </thead>
        </template>
      </v-data-table>
    </div>
    <guide-srcview :ModelProp.sync="source06" :SrcProp="srcAll.srcInput_06" />

    <!-- //mark: Custom -->
    <h2>{{ toplink[6] }}</h2>
    <div class="guide-card">
      <v-data-table
        class="pl-grid"
        :headers="headers3"
        :items="items"
        fixed-header
        item-key="index"
        height="200px"
        hide-default-footer
        :page.sync="page"
        @page-count="pageCount = $event">
        <template v-slot:item.view>
          <v-icon small class="mr-2">mdi-message-reply-text-outline</v-icon>
        </template>
        <template v-slot:item.type="{ item }">
          <v-chip :color="getColor(item.type)" dark small>{{ item.type }}</v-chip>
        </template>
        <template v-slot:item.contents="{ item }"><div class="is-ellips" :title="item.contents">{{ item.contents }}</div></template>
        <template v-slot:item.edit="{ item }">
          <button
            type="button"
            :disabled="!item.edit"
            @click="editRow(item)">
          <v-icon
            color="primary"
            small
            :disabled="!item.edit"
            class="mr-2">mdi-pencil</v-icon>
          </button>
        </template>
        <template v-slot:item.delete="{ item }">
          <button
            type="button"
            :disabled="!item.delete"
            @click="deleteRow(item)">
            <v-icon
              color="red"
              small
              :disabled="!item.delete"
              class="mr-2">mdi-delete</v-icon>
          </button>
        </template>
      </v-data-table>
    </div>
    <guide-srcview :ModelProp.sync="source07" :SrcProp="srcAll.srcInput_07" />

    <!-- //mark: Hover Menu -->
    <h2>{{ toplink[7] }}</h2>
    <div class="guide-card">
      <v-data-table
        class="pl-grid type-hover-func"
        :headers="headersEdit"
        :items="items"
        fixed-header
        item-key="index"
        height="200px"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
        :page.sync="page"
        @page-count="pageCount = $event">
        <template v-slot:item="{ item }">
          <tr
            @mouseover="mixin_hoverItem(item,'items')"
            @mouseleave="mixin_leaveItem(item,'items')"
            :class="mixin_getItemClass(item)"
          >
            <td :class="mixin_getHeaderClass(headersEdit[0].align)">{{ item.index }}</td>
            <td :class="mixin_getHeaderClass(headersEdit[1].align)">{{ item.type }}</td>
            <td :class="mixin_getHeaderClass(headersEdit[2].align)">{{ item.subject }}</td>
            <td :class="mixin_getHeaderClass(headersEdit[3].align)">{{ item.date }}</td>
            <td class="grid-hover-func-wrap">
              <!-- 수정 버튼 -->
              <compo-tooltip-btn
                TitleProp="수정"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 edit"
                TooltipPositionProp="bottom"
                @btnClick=""
              ></compo-tooltip-btn>
              <!-- 삭제 버튼 -->
              <compo-tooltip-btn
                TitleProp="삭제"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 trash"
                TooltipPositionProp="bottom"
                @btnClick="deleteItem(item, 'items')"
              ></compo-tooltip-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
    <guide-srcview :ModelProp.sync="source08" :SrcProp="srcAll.srcInput_08" />

    <!-- //mark : No Data -->
    <h2>{{ toplink[8] }}</h2>
    <div class="guide-card">
      <v-data-table
        class="pl-grid"
        :headers="headers"
        fixed-header
        item-key="index"
        height="562px"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
        :page.sync="page"
        @page-count="pageCount = $event"
        no-data-text="등록된 데이터가 없습니다."
      />
    </div>
    <guide-srcview :ModelProp.sync="source09" :SrcProp="srcAll.srcInput_09" />

    <!-- //mark : Single Select -->
    <h2>{{ toplink[9] }}</h2>
    <div class="guide-card">
      <v-data-table
        class="pl-grid has-control"
        :headers="headers"
        :items="items"
        fixed-header
        item-key="index"
        height="562px"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
        show-select
        single-select
        :page.sync="page"
        @page-count="pageCount = $event"
        no-data-text="등록된 데이터가 없습니다."
      />
    </div>
    <guide-srcview :ModelProp.sync="source10" :SrcProp="srcAll.srcInput_10" />

    <!-- //mark : Row Span -->
    <h2>{{ toplink[10] }}</h2>
    <div class="guide-card">
      <v-data-table
        class="pl-grid is-rowspan type-hover-func"
        :headers="headersRowSpan"
        :items="itemsRowSpan"
        fixed-header
        item-key="index"
        height="562px"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
        :page.sync="page"
        @page-count="pageCount = $event"
        no-data-text="등록된 데이터가 없습니다."
      >
        <template v-slot:item="{ item, index }">
          <tr
            @mouseover="mixin_hoverItem(item,'itemsRowSpan')"
            @mouseleave="mixin_leaveItem(item,'itemsRowSpan')"
            :class="mixin_getItemClass(item)"
            :key="index">
            <td
              v-if="index === 0 || item.type01 !== itemsRowSpan[index - 1].type01"
              :rowspan="mixin_getRowCount(index, 'type01')"
              :class="mixin_getHeaderClass(headersRowSpan[0].align)">{{ item.type01 }}</td>
            <td
              v-if="index === 0 || item.type02 !== itemsRowSpan[index - 1].type02"
              :rowspan="mixin_getRowCount(index, 'type02')"
              :class="mixin_getHeaderClass(headersRowSpan[1].align)">{{ item.type02 }}</td>
            <td
              v-if="index === 0 || item.type03 !== itemsRowSpan[index - 1].type03"
              :rowspan="mixin_getRowCount(index, 'type03')"
              :class="mixin_getHeaderClass(headersRowSpan[2].align)">
              <template v-if="item.editable">
                <v-text-field
                  class="pl-form is-auto"
                  :class="mixin_getHeaderClass(headersRowSpan[2].align)"
                  :value="item.type03" />
              </template>
              <template v-if="!item.editable">
                {{ item.type03 }}
              </template>
            </td>
            <td>
              <template v-if="item.editable">
                <v-text-field class="pl-form is-auto" :value="item.subject"/>
              </template>
              <template v-if="!item.editable">
                {{ item.subject }}
              </template>
            </td>
            <td class="grid-hover-func-wrap">
              <!-- 수정 버튼 -->
              <compo-tooltip-btn
                TitleProp="수정"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 edit"
                TooltipPositionProp="bottom"
                @btnClick="editItem(item)"
              ></compo-tooltip-btn>
              <!-- 삭제 버튼 -->
              <compo-tooltip-btn
                TitleProp="삭제"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 trash"
                TooltipPositionProp="bottom"
                @btnClick="deleteItem(item, 'itemsRowSpan')"
              ></compo-tooltip-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
    <guide-srcview :ModelProp.sync="source11" :SrcProp="srcAll.srcInput_11" />
  </div>



</template>

<script>
import guideJs from '@/Guide/guide.js'
export default {
  name: "GuideGrid",
  props:{
    SelectedProp: {
      type: String,
    }
  },
  components: {
  },
  data() {
    return {
      toplink: [
        'Default',
        'Selected / 특정 컬럼 변경 / Search',
        'Horizontal Scroll',
        '합계',
        'Selected, 선택색상 별도지정',
        'Multi Row Header',
        'Custom',
        'Hover Menu',
        'No Data',
        'Single Select',
        'Row span',
      ],
      source01: null,
      source02: null,
      source03: null,
      source04: null,
      source05: null,
      source06: null,
      source07: null,
      source08: null,
      source09: null,
      source10: null,
      source11: null,

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<div class="pl-grid-top">
  <div class="pl-grid-top-left">
    <v-btn class="pl-btn is-icon is-sub">
      <span class="pl-icon20 document"></span>
      선택항목 상세
    </v-btn>
    <v-btn class="pl-btn is-icon is-sub">
      <span class="pl-icon20 circle-plus"></span>
      채팅이력 생성
    </v-btn>
  </div>
  <div class="pl-grid-top-utils">
    <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
    <!-- 엑셀 다운로드 버튼 -->
    <compo-tooltip-btn
      TitleProp="엑셀 다운로드"
      ClassProp="pl-tooltip-btn is-line"
      IconProp="pl-icon20 exceldown"
      TooltipPositionProp="bottom"
      @btnClick="mixin_testLog('엑셀 다운로드')"
    ></compo-tooltip-btn>
  </div>
</div>
<v-data-table
  class="pl-grid"
  :headers="headers"
  :items="items"
  fixed-header
  item-key="index"
  height="562px"
  :items-per-page="ROW_PER_PAGE"
  hide-default-footer
  :page.sync="page"
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

  <!-- 더보기 다음 있을때만 노출 -->
  <span class="pl-pager-period">
    보기 {{ mixin_getPagePeriod(items, page) }} / {{ items.length }}
    <compo-tooltip-btn
      TitleProp="다음 검색"
      ClassProp="pl-tooltip-btn is-line"
      IconProp="pl-icon20 arrow-next-paging"
      TooltipPositionProp="bottom"
    ></compo-tooltip-btn>
  </span>
</div>`
          },
          { tab: "script", content:
`export default {
  data () {
    return {
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
          {
            index: 1,
            type: '공통',
            subject: '취소수수료를 환불해 주세요.',
            contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
            date: '2020-08-05'
          },
          ...
      ],
    }
  },
  methods: {

  },
}` },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`<div class="pl-grid-top">
  <div class="pl-grid-top-left">
    <v-select
      class="pl-form"
      :items="dropItemsCompany"
      item-text="title"
      placeholder="선택하세요"
      @change="FnGridChg"
    ></v-select>
    <v-text-field
      class="pl-form is-lg"
      v-model="gridSearch"
      placeholder="검색어를 입력하세요"
    ></v-text-field>
    <v-btn class="pl-btn is-icon is-sub">
      <span class="pl-icon20 document"></span>
      선택항목 상세
    </v-btn>
    <v-btn class="pl-btn is-icon is-sub">
      <span class="pl-icon20 circle-plus"></span>
      채팅이력 생성
    </v-btn>
  </div>
  <div class="pl-grid-top-utils">
    <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
    <!-- 엑셀 다운로드 버튼 -->
    <compo-tooltip-btn
      TitleProp="엑셀 다운로드"
      ClassProp="pl-tooltip-btn is-line"
      IconProp="pl-icon20 exceldown"
      TooltipPositionProp="bottom"
      @btnClick="mixin_testLog('엑셀 다운로드')"
    ></compo-tooltip-btn>
  </div>
</div>
<!-- 그리드 -->
<v-data-table
  class="pl-grid has-control"
  :headers="headers2"
  :items="items"
  :items-per-page="ROW_PER_PAGE"
  item-key="index"
  height="562px"
  :search="gridSearch"
  :page.sync="page2"
  hide-default-footer
  show-select
  fixed-header
  @page-count="pageCount2 = $event"
>
  <template v-slot:header.type>
    {{ CURRENT_COMPANY }}
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
    v-model="page2"
    :length="pageCount2"
    circle
    :total-visible="7">
  </v-pagination>
  <span class="pl-pager-period">보기 {{ mixin_getPagePeriod(items, page2) }} / {{ items.length }}</span>
</div>
<hr>
<div>Selected :
  <ul>
    <li v-for="item in chkSelected" :key="item.id">
      {{ item.index }}
      {{ item.subject }}
    </li>
  </ul>
</div>`
          },
          { tab: "script", content:
`export default {
  data () {
    return {
      gridSearch: '',
      CURRENT_COMPANY: '회사 A',
      dropItemsCompany: [
        { title : '회사 A'},
        { title : '회사 B'},
        { title : '회사 C'},
      ],
      headers2: [
        { text: '번호', value: 'index', align: 'center', width: '80px' },
        { text: '회사유형', value: 'type', align: 'center', width: '160px', sortable: false },
        { text: '스크립트명', value: 'subject'},
      ],
      items: [
        {
          index: 1,
          type: '공통',
          subject: '취소수수료를 환불해 주세요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05'
        },
        ...
      ],
      chkSelected: [],
    }
  },
  methods: {
    //컬럼 변경
    FnGridChg(e ) {
      this.CURRENT_COMPANY = e;
    },
  },
  computed: {
  },
}` },
        ],
        srcInput_03: [
          {
            tab: "html",
            content:
`<v-data-table
  class="pl-grid"
  :headers="headers4"
  :items="items"
  fixed-header
  item-key="index"
  height="200px"
  :items-per-page="ROW_PER_PAGE"
  hide-default-footer
  :page.sync="page3"
  @page-count="pageCount3 = $event">
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
    v-model="page3"
    :length="pageCount3"
    circle
    :total-visible="7">
  </v-pagination>
  <span class="pl-pager-period">보기 {{ mixin_getPagePeriod(items, page3) }} / {{ items.length }}</span>
</div>`
          },
          { tab: "script", content:
`export default {
  data () {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      headers4: [
          { text: '번호', value: 'index', align: 'center', width: '280px' },
          { text: '유형', value: 'type', align: 'center', width: '520px' },
          { text: '스크립트명', value: 'subject', width: '520px'},
          { text: '수정일', value: 'date', align: 'center', width: '220px' },
      ],
      items: [
          {
            index: 1,
            type: '공통',
            subject: '취소수수료를 환불해 주세요.',
            contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
            date: '2020-08-05'
          },
          ...
      ],
    }
  },
  computed: {
  },
}` },
        ],
        srcInput_04: [
          {
            tab: "html",
            content:
`<v-data-table
  class="pl-grid"
  :headers="gridDataHeaders"
  :items="gridDataText"
  fixed-header
  item-key="index"
  height="562px"
  :items-per-page="ROW_PER_PAGE"
  hide-default-footer
  :page.sync="page"
  @page-count="pageCount = $event"
>
  <template slot="footer">
    <div class="pl-grid-sum">
      <table >
        <colgroup>
          <col v-for="(col, index) in gridDataHeaders" :key="index" :width=col.width />
        </colgroup>
        <tbody >
          <tr >
            <td class="pl-grid-sum-head text-center">합계</td>
            <td class="text-right">
              {{ mixin_sum_field(this.gridDataText, "type01") }}
            </td>
            <td class="text-right" >
              {{ mixin_sum_field(this.gridDataText, "type02") }}
            </td>
            <td class="text-right" >
              {{ mixin_sum_field(this.gridDataText, "type03") }}
            </td>
            <td class="text-right" >
              {{ mixin_sum_field(this.gridDataText, "type04") }}
            </td>
            <td class="text-right" >
              {{ mixin_sum_field(this.gridDataText, "type05") }}
            </td>
            <td class="text-right" >
              {{ mixin_sum_field(this.gridDataText, "type06") }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
</v-data-table>`
          },
          { tab: "script", content:
`export default {
  data () {
    return {
      gridDataHeaders: [
        { text: '회사', value: 'name', align: 'center',},
        { text: "A", align: "right", value: "type01",  width: '100px' },
        { text: "B", align: "right", value: "type02",  width: '100px' },
        { text: "C", align: "right", value: "type03",  width: '100px' },
        { text: "D", align: "right", value: "type04",  width: '100px' },
        { text: "E", align: "right", value: "type05",  width: '100px' },
        { text: "F", align: "right", value: "type06",  width: '100px' },
      ],
      gridDataText: [
        {
          name: "한국클라우드",
          type01: 159,
          type02: 6.0,
          type03: 24,
          type04: 4.0,
          type05: "1%",
          type06: true,
        },
        ...
      ],
    }
  },
  methods: {
    // 그리드 col resizing
    resizableGrid(table) {...}
    // mouse hover
    deleteItem(item, arr) {
      const index = this[\`\${arr}\`].indexOf(item);
      if(index !== -1) {
        this[\`\${arr}\`].splice(index, 1);
      }
    },
  },
  computed: {
  },
  mounted() {
    // 그리드 col resizing
    var tables = document.querySelectorAll(".grid-default.colResizing table");
    for (var i = 0; i < tables.length; i++) {
      this.resizableGrid(tables[0]);
    }
  }
}` },
        ],
        srcInput_05: [
          {
            tab: "html",
            content:
`<v-data-table
  class="pl-grid has-control"
  :headers="headers5"
  :items="items"
  item-key="index"
  :items-per-page="ROW_PER_PAGE"
  :item-class="isActiveRow"
  fixed-header
  hide-default-footer
  show-select
  height="200px"
  :page.sync="page"
  @page-count="pageCount = $event"
  @click:row="rowSelect">
</v-data-table>`
          },
          { tab: "script", content:
`export default {
  data () {
    return {
      headers5: [
        { text: '번호', value: 'index', align: 'center', width: '80px' },
        { text: '대분류', value: 'type01', align: 'center' },
        { text: '중분류', value: 'type02', align: 'center' },
        { text: '소분류', value: 'type03', align: 'center' },
        { text: '스크립트명', value: 'subject'},
        { text: '수정일', value: 'date', align: 'center' },
      ],
      items: [
        {
          index: 1,
          type: '공통',
          subject: '취소수수료를 환불해 주세요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05'
        },
        ...
      ],
    }
  },
  methods: {
    // 그리드 click
    rowSelect(idx) {
      this.selectedRow = idx;
    },
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },
  },
  computed: {
  },
}` },
        ],
        srcInput_06: [
          {
            tab: "html",
            content:
`<v-data-table
  class="pl-grid"
  :headers="headers5"
  :items="items"
  fixed-header
  item-key="index"
  height="200px"
  hide-default-header
  hide-default-footer
  :page.sync="page"
  @page-count="pageCount = $event">
  <template v-slot:header>
    <thead class="v-data-table-header multi-row">
      <tr>
        <th rowspan="2" width="80px" class="text-center"><span>NO</span></th>
        <th colspan="3" width="300px" class="text-center"><span>상담유형</span></th>
        <th rowspan="2" class="text-center"><span>스크립트명</span></th>
        <th rowspan="2" width="100px" class="text-center"><span>수정일</span></th>
      </tr>
      <tr>
        <th class="text-center"><span>대분류</span></th>
        <th class="text-center"><span>중분류</span></th>
        <th class="text-center"><span>소분류</span></th>
      </tr>
    </thead>
  </template>
</v-data-table>`
          },
          { tab: "script", content:
`export default {
  data () {
    return {
      expanded: [],
      headers5: [
        { text: '번호', value: 'index', align: 'center', width: '80px' },
        { text: '대분류', value: 'type01', align: 'center' },
        { text: '중분류', value: 'type02', align: 'center' },
        { text: '소분류', value: 'type03', align: 'center' },
        { text: '스크립트명', value: 'subject'},
        { text: '수정일', value: 'date', align: 'center' },
      ],
      items: [
        {
          index: 1,
          type: '공통',
          subject: '취소수수료를 환불해 주세요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05'
        },
        ...
      ],
    }
  },
  methods: {
    rowClick: function (item, row) {
      if(this.selectedId===item.index){
        row.select(false);
        row.expand(false);
        this.selectedId=item.name;
      }else{
        row.select(true);
        this.selectedId=item.index;
        row.expand(true);
      }
    },
  },
  computed: {
  },
}` },
        ],
        srcInput_07: [
          {
            tab: "html",
            content:
`<v-data-table
  class="pl-grid"
  :headers="headers3"
  :items="items"
  fixed-header
  item-key="index"
  height="200px"
  hide-default-footer
  :page.sync="page"
  @page-count="pageCount = $event">
  <template v-slot:item.view>
    <v-icon small class="mr-2">mdi-message-reply-text-outline</v-icon>
  </template>
  <template v-slot:item.type="{ item }">
    <v-chip :color="getColor(item.type)" dark small>{{ item.type }}</v-chip>
  </template>
  <template v-slot:item.contents="{ item }"><div class="is-ellips" :title="item.contents">{{ item.contents }}</div></template>
  <template v-slot:item.edit="{ item }">
    <button
      type="button"
      :disabled="!item.edit"
      @click="editRow(item)">
    <v-icon
      color="primary"
      small
      :disabled="!item.edit"
      class="mr-2">mdi-pencil</v-icon>
    </button>
  </template>
  <template v-slot:item.delete="{ item }">
    <button
      type="button"
      :disabled="!item.delete"
      @click="deleteRow(item)">
      <v-icon
        color="red"
        small
        :disabled="!item.delete"
        class="mr-2">mdi-delete</v-icon>
    </button>
  </template>
</v-data-table>`
          },
          { tab: "script", content:
`export default {
  data () {
    return {
      headers3: [
        { text: '번호', value: 'index', align: 'center', width: '80px' },
        { text: '유형', value: 'type', align: 'center', width: '90px', sortable: false },
        { text: '내용', value: 'view', align: 'center', width: '80px', sortable: false },
        { text: '스크립트명', value: 'contents',},
        { text: '수정', value: 'edit', align: 'center', width: '40px', sortable: false },
        { text: '삭제', value: 'delete', align: 'center', width: '40px', sortable: false },
      ],
      items: [
        {
          index: 1,
          type: '공통',
          subject: '취소수수료를 환불해 주세요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          type01: '대분류01',
          type02: '중분류01',
          type03: '소분류01',
        },
          ...
      ],
    }
  },
  computed: {
  },
}` },
        ],
        srcInput_08: [
          {
            tab: "html",
            content:
`<v-data-table
  class="pl-grid type-hover-func"
  :headers="headersEdit"
  :items="items"
  fixed-header
  item-key="index"
  height="200px"
  :items-per-page="ROW_PER_PAGE"
  hide-default-footer
  :page.sync="page"
  @page-count="pageCount = $event">
  <template v-slot:item="{ item }">
    <tr
      @mouseover="mixin_hoverItem(item,'items')"
      @mouseleave="mixin_leaveItem(item,'items')"
      :class="mixin_getItemClass(item)"
    >
      <td :class="mixin_getHeaderClass(headersEdit[0].align)">{{ item.index }}</td>
      <td :class="mixin_getHeaderClass(headersEdit[1].align)">{{ item.type }}</td>
      <td :class="mixin_getHeaderClass(headersEdit[2].align)">{{ item.subject }}</td>
      <td :class="mixin_getHeaderClass(headersEdit[3].align)">{{ item.date }}</td>
      <td class="grid-hover-func-wrap">
        <!-- 수정 버튼 -->
        <compo-tooltip-btn
          TitleProp="수정"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 edit"
          TooltipPositionProp="bottom"
          @btnClick=""
        ></compo-tooltip-btn>
        <!-- 삭제 버튼 -->
        <compo-tooltip-btn
          TitleProp="삭제"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 trash"
          TooltipPositionProp="bottom"
          @btnClick="deleteItem(item, 'items')"
        ></compo-tooltip-btn>
      </td>
    </tr>
  </template>
</v-data-table>`
          },
          { tab: "script", content:
`export default {
  data () {
    return {
      editedIndex: -1,
      hoverRow: null,
      page: 1,
      pageCount: 0,
      headersEdit: [
        { text: '번호', value: 'index', align: 'center', width: '90px' },
        { text: '유형', value: 'type', align: 'center', width: '100px' },
        { text: '스크립트명', value: 'subject'},
        { text: '수정일', value: 'date', align: 'center', width: '100px' },
      ],
      items: [
          {
            index: 1,
            type: '공통',
            subject: '취소수수료를 환불해 주세요.',
            contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
            date: '2020-08-05',
            edit: true,
            delete: true,
          },
          ...
      ],
    }
  },
  methods: {
    deleteItem(item, arr) {
      const index = this[\`\${arr}\`].indexOf(item);
      if(index !== -1) {
        this[\`\${arr}\`].splice(index, 1);
      }
    },
  },
  computed: {
  },
}` },
        ],
        srcInput_09: [
          {
            tab: "html",
            content:
`<v-data-table
  class="pl-grid"
  :headers="headers"
  fixed-header
  item-key="index"
  height="562px"
  :items-per-page="ROW_PER_PAGE"
  hide-default-footer
  :page.sync="page"
  @page-count="pageCount = $event"
  no-data-text="등록된 데이터가 없습니다."
/>`
          },
          { tab: "script", content:
`` },
        ],
        srcInput_10: [
          {
            tab: "html",
            content:
`<v-data-table
  class="pl-grid has-control"
  :headers="headers"
  :items="items"
  fixed-header
  item-key="index"
  height="562px"
  :items-per-page="ROW_PER_PAGE"
  hide-default-footer
  show-select
  single-select
  :page.sync="page"
  @page-count="pageCount = $event"
  no-data-text="등록된 데이터가 없습니다."
/>`
          },
          { tab: "script", content:
`` },
        ],
        srcInput_11: [
          {
            tab: "html",
            content:
`<v-data-table
  class="pl-grid is-rowspan type-hover-func"
  :headers="headersRowSpan"
  :items="itemsRowSpan"
  fixed-header
  item-key="index"
  height="562px"
  :items-per-page="ROW_PER_PAGE"
  hide-default-footer
  :page.sync="page"
  @page-count="pageCount = $event"
  no-data-text="등록된 데이터가 없습니다."
>
  <template v-slot:item="{ item, index }">
    <tr
      @mouseover="mixin_hoverItem(item,'itemsRowSpan')"
      @mouseleave="mixin_leaveItem(item,'itemsRowSpan')"
      :class="mixin_getItemClass(item)"
      :key="index">
      <td
        v-if="index === 0 || item.type01 !== itemsRowSpan[index - 1].type01"
        :rowspan="mixin_getRowCount(index, 'type01')"
        :class="mixin_getHeaderClass(headersRowSpan[0].align)">{{ item.type01 }}</td>
      <td
        v-if="index === 0 || item.type02 !== itemsRowSpan[index - 1].type02"
        :rowspan="mixin_getRowCount(index, 'type02')"
        :class="mixin_getHeaderClass(headersRowSpan[1].align)">{{ item.type02 }}</td>
      <td
        v-if="index === 0 || item.type03 !== itemsRowSpan[index - 1].type03"
        :rowspan="mixin_getRowCount(index, 'type03')"
        :class="mixin_getHeaderClass(headersRowSpan[2].align)">
        <template v-if="item.editable">
          <v-text-field
            class="pl-form is-auto"
            :class="mixin_getHeaderClass(headersRowSpan[2].align)"
            :value="item.type03" />
        </template>
        <template v-if="!item.editable">
          {{ item.type03 }}
        </template>
      </td>
      <td>
        <template v-if="item.editable">
          <v-text-field class="pl-form is-auto" :value="item.subject"/>
        </template>
        <template v-if="!item.editable">
          {{ item.subject }}
        </template>
      </td>
      <td class="grid-hover-func-wrap">
        <!-- 수정 버튼 -->
        <compo-tooltip-btn
          TitleProp="수정"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 edit"
          TooltipPositionProp="bottom"
          @btnClick=""
        ></compo-tooltip-btn>
        <!-- 삭제 버튼 -->
        <compo-tooltip-btn
          TitleProp="삭제"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 trash"
          TooltipPositionProp="bottom"
          @btnClick="deleteItem(item, 'itemsRowSpan')"
        ></compo-tooltip-btn>
      </td>
    </tr>
  </template>
</v-data-table>`
          },
          { tab: "script", content:
`hoverRow: null,
headersRowSpan: [
  { text: "대분류", value: "type01", align: "left", width: "150px" , sortable: false},
  { text: "중분류", value: "type02", align: "left", width: "150px" , sortable: false},
  { text: "배점", value: "type03", align: "right", width: "150px" , sortable: false},
  { text: "품질기분", value: "subject", align: "left", width: "" , sortable: false},
],
itemsRowSpan: [
  { index: 1, type01: '도입부', type02: '첫/끝인사', type03: '7', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
  { index: 2, type01: '도입부', type02: '첫/끝인사', type03: '4', subject: '오픈멘트와 실명은 나누었지만, 친근감 없이 형식적으로 진행될 경우', },
  { index: 3, type01: '도입부', type02: '첫/끝인사', type03: '0', subject: '첫인사 + 끝인사중 한가지이상 누락하였거나, 실명 없을 경우', editable: true },
  { index: 4, type01: '도입부', type02: '고객확인', type03: '5', subject: '필수 고객정보 확인하며 도입부에 2가지이상 고객께 직접 확인하는 경우', },
  { index: 5, type01: '도입부', type02: '고객확인', type03: '2', subject: '필수 고객정보 확인은 하되 상담원의 입에서 1가지이상 정보 누출되는 경우', },
  { index: 6, type01: '도입부', type02: '고객확인', type03: '0', subject: '통화 종료시점까지 고객정보 확인없이 진행하는 경우', },
  { index: 7, type01: '응대 스킬', type02: '호응어', type03: '10', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
  { index: 8, type01: '응대 스킬', type02: '호응어', type03: '7', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
  { index: 9, type01: '응대 스킬', type02: '호응어', type03: '4', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
  { index: 10, type01: '응대 스킬', type02: '호응어', type03: '0', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
  { index: 11, type01: '응대 스킬', type02: '경청', type03: '5', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
  { index: 12, type01: '응대 스킬', type02: '경청', type03: '3', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
],` },
        ],

      },

      // 마우스 오버 샘플
      toggleGridClass: false,

      page: 1,
      page2: 1,
      page3: 1,
      pageCount: 0,
      pageCount2: 0,
      pageCount3: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
      expanded: [],
      chkSelected: [],
      headers: [
        { text: '번호', value: 'index', align: 'center', width: '80px' },
        { text: '유형', value: 'type', align: 'center', width: '120px', },
        { text: '스크립트명', value: 'subject', sortable: false},
        { text: '수정일', value: 'date', align: 'center', width: '120px', sortable: false },
      ],
      headers2: [
        { text: '번호', value: 'index', align: 'center', width: '80px' },
        { text: '회사유형', value: 'type', align: 'center', width: '160px', sortable: false },
        { text: '스크립트명', value: 'subject'},
      ],
      headers3: [
        { text: '번호', value: 'index', align: 'center', width: '80px' },
        { text: '유형', value: 'type', align: 'center', width: '90px', sortable: false },
        { text: '내용', value: 'view', align: 'center', width: '80px', sortable: false },
        { text: '스크립트명', value: 'contents',},
        { text: '수정', value: 'edit', align: 'center', width: '40px', sortable: false },
        { text: '삭제', value: 'delete', align: 'center', width: '40px', sortable: false },
      ],
      headers4: [
        { text: '번호', value: 'index', align: 'center', width: '280px' },
        { text: '유형', value: 'type', align: 'center', width: '520px' },
        { text: '스크립트명', value: 'subject', width: '520px'},
        { text: '수정일', value: 'date', align: 'center', width: '220px' },
      ],
      headers5: [
        { text: '번호', value: 'index', align: 'center', width: '80px' },
        { text: '대분류', value: 'type01', align: 'center' },
        { text: '중분류', value: 'type02', align: 'center' },
        { text: '소분류', value: 'type03', align: 'center' },
        { text: '스크립트명', value: 'subject'},
        { text: '수정일', value: 'date', align: 'center' },
      ],
      headers6: [
        { text: '', value: 'data-table-expand' },
        { text: '번호', value: 'index', align: 'center', width: '50px' },
        { text: '유형', value: 'type', align: 'center', width: '100px' },
        { text: '스크립트명', value: 'subject'},
        { text: '수정일', value: 'date', align: 'center', width: '100px' },
      ],
      headersEdit: [
        { text: '번호', value: 'index', align: 'center', width: '90px' },
        { text: '유형', value: 'type', align: 'center', width: '100px' },
        { text: '스크립트명', value: 'subject'},
        { text: '수정일', value: 'date', align: 'center', width: '100px' },
      ],

      items: [
        {
          index: 1,
          type: '공통',
          subject: '취소수수료를 환불해 주세요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다. 카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다.',
          date: '2020-08-05',
          type01: '대분류01',
          type02: '중분류01',
          type03: '소분류01',
          edit: true,
          delete: true,
        },
        {
          index: 2,
          type: '공통',
          subject: '호출중이었는데 앱이 꺼졌어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          type01: '대분류02',
          type02: '중분류02',
          type03: '소분류02',
          edit: false,
          delete: true,
        },
        {
          index: 3,
          type: '개인',
          subject: '택시에 물건을 두고 내렸어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: false,
          delete: false,
        },
        {
          index: 4,
          type: '공통',
          subject: '호출을 기다리는데 기사님이 취소했어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: false,
        },
        {
          index: 5,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 6,
          type: '공통',
          subject: '취소수수료를 환불해 주세요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 7,
          type: '공통',
          subject: '호출중이었는데 앱이 꺼졌어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 8,
          type: '개인',
          subject: '택시에 물건을 두고 내렸어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 9,
          type: '공통',
          subject: '호출을 기다리는데 기사님이 취소했어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 10,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 11,
          type: '공통',
          subject: '취소수수료를 환불해 주세요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 12,
          type: '공통',
          subject: '호출중이었는데 앱이 꺼졌어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 13,
          type: '개인',
          subject: '택시에 물건을 두고 내렸어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 14,
          type: '공통',
          subject: '호출을 기다리는데 기사님이 취소했어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 15,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 16,
          type: '공통',
          subject: '취소수수료를 환불해 주세요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 17,
          type: '공통',
          subject: '호출중이었는데 앱이 꺼졌어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 18,
          type: '개인',
          subject: '택시에 물건을 두고 내렸어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 19,
          type: '공통',
          subject: '호출을 기다리는데 기사님이 취소했어요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 20,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 21,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 22,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 23,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 24,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 25,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 26,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 27,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 28,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 29,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 30,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 31,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 32,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
        {
          index: 33,
          type: '개인',
          subject: '카드 등록이 안되요.',
          contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.',
          date: '2020-08-05',
          edit: true,
          delete: true,
        },
      ],
      headersRowSpan: [
        { text: "대분류", value: "type01", align: "left", width: "150px" , sortable: false},
        { text: "중분류", value: "type02", align: "left", width: "150px" , sortable: false},
        { text: "배점", value: "type03", align: "right", width: "150px" , sortable: false},
        { text: "품질기분", value: "subject", align: "left", width: "" , sortable: false},
      ],
      itemsRowSpan: [
        { index: 1,type01: '도입부', type02: '첫/끝인사', type03: '7', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
        { index: 2,type01: '도입부', type02: '첫/끝인사', type03: '4', subject: '오픈멘트와 실명은 나누었지만, 친근감 없이 형식적으로 진행될 경우', },
        { index: 3,type01: '도입부', type02: '첫/끝인사', type03: '0', subject: '첫인사 + 끝인사중 한가지이상 누락하였거나, 실명 없을 경우', editable: false },
        { index: 4,type01: '도입부', type02: '고객확인', type03: '5', subject: '필수 고객정보 확인하며 도입부에 2가지이상 고객께 직접 확인하는 경우', },
        { index: 5,type01: '도입부', type02: '고객확인', type03: '2', subject: '필수 고객정보 확인은 하되 상담원의 입에서 1가지이상 정보 누출되는 경우', },
        { index: 6,type01: '도입부', type02: '고객확인', type03: '0', subject: '통화 종료시점까지 고객정보 확인없이 진행하는 경우', },
        { index: 7,type01: '응대 스킬', type02: '호응어', type03: '10', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
        { index: 8,type01: '응대 스킬', type02: '호응어', type03: '7', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
        { index: 9,type01: '응대 스킬', type02: '호응어', type03: '4', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
        { index: 10,type01: '응대 스킬', type02: '호응어', type03: '0', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
        { index: 11,type01: '응대 스킬', type02: '경청', type03: '5', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
        { index: 12,type01: '응대 스킬', type02: '경청', type03: '3', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
      ],

      gridSearch: '',
      CURRENT_COMPANY: '회사 A',
      dropItemsCompany: [
        { title : '회사 A'},
        { title : '회사 B'},
        { title : '회사 C'},
      ],
      gridDataHeaders: [
        { text: '회사', value: 'name', align: 'center',},
        { text: "A", align: "right", value: "type01",  width: '100px' },
        { text: "B", align: "right", value: "type02",  width: '100px' },
        { text: "C", align: "right", value: "type03",  width: '100px' },
        { text: "D", align: "right", value: "type04",  width: '100px' },
        { text: "E", align: "right", value: "type05",  width: '100px' },
        { text: "F", align: "right", value: "type06",  width: '100px' },
      ],
      gridDataText: [
        {
          name: "한국클라우드",
          type01: 159,
          type02: 6.0,
          type03: 24,
          type04: 4.0,
          type05: "1%",
          type06: true,
        },
        {
          name: "모모랩스",
          type01: 237,
          type02: 9.0,
          type03: 37,
          type04: 4.3,
          type05: "1%",
          type06: false,
        },
        {
          name: "네이버",
          type01: 262,
          type02: 16.0,
          type03: 23,
          type04: 6.0,
          type05: "7%",
          type06: true,
        },
        {
          name: "트위터",
          type01: 305,
          type02: 3.7,
          type03: 67,
          type04: 4.3,
          type05: "8%",
          type06: false,
        },
        {
          name: "알파벳",
          type01: 356,
          type02: 16.0,
          type03: 49,
          type04: 3.9,
          type05: "16%",
          type06: false,
        },
        {
          name: "한국클라우드",
          type01: 159,
          type02: 6.0,
          type03: 24,
          type04: 4.0,
          type05: "1%",
          type06: true,
        },
        {
          name: "모모랩스",
          type01: 237,
          type02: 9.0,
          type03: 37,
          type04: 4.3,
          type05: "1%",
          type06: false,
        },
        {
          name: "네이버",
          type01: 262,
          type02: 16.0,
          type03: 23,
          type04: 6.0,
          type05: "7%",
          type06: true,
        },
        {
          name: "트위터",
          type01: 305,
          type02: 3.7,
          type03: 67,
          type04: 4.3,
          type05: "8%",
          type06: false,
        },
        {
          name: "알파벳",
          type01: 356,
          type02: 16.0,
          type03: 49,
          type04: 3.9,
          type05: "16%",
          type06: false,
        },

      ],
      selectedRow: null,
      editedIndex: -1,
      hoverRow: null,

    }
  },
  methods: {
    // 그리드 마우스 오버 샘플
    toggleGridHover() {
      this.toggleGridClass = !this.toggleGridClass;
    },
    //컬럼 변경
    FnGridChg(e) {
      this.CURRENT_COMPANY = e;
    },
    // Expanded Row click
    rowClick: function (item, row) {
      if(this.selectedId===item.index){
        row.select(false);
        row.expand(false);
        this.selectedId=item.name;
      }else{
        row.select(true);
        this.selectedId=item.index;
        row.expand(true);
      }
    },
    // custom 뱃지 색상
    getColor (type) {
      if (type === "공통") return 'light-blue'
      else return 'orange'
    },
    // 그리드 col resizing
    resizableGrid(table) {
      var row = table.querySelectorAll("tr")[0],
        rowHead = table.querySelectorAll("thead tr")[0],
        cols = row ? row.children : undefined,
        colsHead = rowHead ? rowHead.children : undefined;

      if (!cols) return;

      // table.style.overflow = 'hidden';

      var tableHeight = table.offsetHeight;

      for (var i = 0; i < cols.length; i++) {
        var div = createDiv(tableHeight);
        cols[i].appendChild(div);
        cols[i].style.position = "relative";
        setListeners(div);
        colsHead[i].style.position = "sticky";
      }

      function setListeners(div) {
        var pageX, curCol, nxtCol, curColWidth, nxtColWidth;

        div.addEventListener("mousedown", function (e) {
          curCol = e.target.parentElement;
          nxtCol = curCol.nextElementSibling;
          pageX = e.pageX;

          var padding = paddingDiff(curCol);

          curColWidth = curCol.offsetWidth - padding;
          if (nxtCol) nxtColWidth = nxtCol.offsetWidth - padding;
        });

        div.addEventListener("mouseover", function (e) {
          e.target.style.borderRight = "2px solid #333";
        });

        div.addEventListener("mouseout", function (e) {
          e.target.style.borderRight = "";
        });

        document.addEventListener("mousemove", function (e) {
          if (curCol) {
            var diffX = e.pageX - pageX;

            if (nxtCol) nxtCol.style.width = nxtColWidth - diffX + "px";

            curCol.style.width = curColWidth + diffX + "px";
          }
        });

        document.addEventListener("mouseup", function (e) {
          curCol = undefined;
          nxtCol = undefined;
          pageX = undefined;
          nxtColWidth = undefined;
          curColWidth = undefined;
          return false;
        });
      }

      function createDiv(height) {
        var div = document.createElement("div");
        div.style.top = 0;
        div.style.right = 0;
        div.style.width = "5px";
        div.style.position = "absolute";
        div.style.cursor = "col-resize";
        div.style.userSelect = "none";
        div.style.height = height + "px";
        div.style.zIndex = 1000;
        return div;
      }

      function paddingDiff(col) {
        if (getStyleVal(col, "box-sizing") == "border-box") {
          return 0;
        }

        var padLeft = getStyleVal(col, "padding-left");
        var padRight = getStyleVal(col, "padding-right");
        return parseInt(padLeft) + parseInt(padRight);
      }

      function getStyleVal(elm, css) {
        return window.getComputedStyle(elm, null).getPropertyValue(css);
      }
    },
    // 그리드 click
    rowSelect(idx) {
      this.selectedRow = idx;
      // console.log( `selectedRow : ${this.selectedRow.index}` );
    },
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },
    // custom 버튼
    editRow(item) {
      this.editedIndex = this.items.indexOf(item);
      alert(`edit - ${item.index}`);

    },
    deleteRow(item) {
      this.editedIndex = this.items.indexOf(item);
      this.items.splice(this.editedIndex, 1);
      alert(`delete - ${item.index}`);
    },
    // 마우스 오버 기능버튼
    editItem(item) {
      item.editable = !item.editable;
    },
    deleteItem(item, arr) {
      const index = this[`${arr}`].indexOf(item);
      if(index !== -1) {
        this[`${arr}`].splice(index, 1);
      }
    },

  },
  computed: {
    // 그리드 데이터 번호 인덱스 추가
    // rowNum() {
    //   return this.items.map(
    //     (items, index) => ({
    //     ...items,
    //     index: index + 1
    //   }))
    // },

  },
  mounted() {
    // 그리드 col resizing
    var tables = document.querySelectorAll(".pl-grid.colResizing table");
    for (var i = 0; i < tables.length; i++) {
      this.resizableGrid(tables[0]);
    }
    guideJs.appendHiddenLink(this.toplink);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>