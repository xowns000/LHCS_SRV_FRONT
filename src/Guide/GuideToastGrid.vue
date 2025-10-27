<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <h4 ><a href="https://nhn.github.io/tui.grid/latest/" target="_blank">https://nhn.github.io/tui.grid/latest/</a></h4>

    <!-- //mark: Default -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <div >
        <div class="text-right">
          <span class="pl-counter">전체 <em class="pl-1">({{ gridData.data.length }})</em> 건</span>
          <!-- 엑셀 다운로드 버튼 -->
          <compo-tooltip-btn
            TitleProp="엑셀 다운로드"
            ClassProp="pl-tooltip-btn is-line ml-2"
            IconProp="pl-icon20 exceldown"
            TooltipPositionProp="bottom"
            @btnClick="downloadExcel('grid01')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-toast-grid-wrap">
          <grid
            class="is-mt-s"
            ref="grid01"
            :data="gridData.data"
            :columns="gridData.columns"
            :options="tuiGridConfig"
            :theme="tuiGridConfig.theme"
            @afterPageMove="handlePageChange($event)"
            />
          <div class="pl-pager type-toastUI-L">
            <div class="pl-pager-row">
              <span>페이지당 항목 수</span>
              <v-select
                class="pl-form"
                :value="ROW_PER_PAGE"
                :items="itemsPerPage"
                :item-text="toString(ROW_PER_PAGE)"
                @change="gridSetPerPage('grid01', $event)"
              ></v-select>
            </div>
          </div>
          <!-- 더보기 다음 있을때만 노출 -->
          <div class="pl-pager type-toastUI-R">
            <span class="pl-pager-period">
              보기 {{ mixin_getPagePeriod(gridData.data, currentPage) }} / {{ gridData.data.length }}
              <!-- 보기  -->
              <compo-tooltip-btn
                TitleProp="다음 검색"
                ClassProp="pl-tooltip-btn is-line"
                IconProp="pl-icon20 arrow-next-paging"
                TooltipPositionProp="bottom"
              ></compo-tooltip-btn>
            </span>
          </div>
        </div>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: Summary -->
    <h2>{{ toplink[1] }}</h2>
    <div class="guide-card">
      <div >
        <grid
          :data="gridData.data"
          :columns="gridData.columns"
          :options="computedGridConfigSummary"
          :theme="tuiGridConfig.theme"
          />
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />

    <!-- //mark: Complex Header -->
    <h2>{{ toplink[2] }}</h2>
    <div class="guide-card">
      <div class="text-right">
        <!-- 엑셀 다운로드 버튼 -->
        <compo-tooltip-btn
          TitleProp="엑셀 다운로드"
          ClassProp="pl-tooltip-btn is-line"
          IconProp="pl-icon20 exceldown"
          TooltipPositionProp="bottom"
          @btnClick="downloadExcel('gridComplex')"
        ></compo-tooltip-btn>
      </div>
      <grid
        ref="gridComplex"
        :data="complexHeaderData.data"
        :columns="complexHeaderData.columns"
        :header="complexHeaderData.header"
        :options="tuiGridConfig"
        :theme="tuiGridConfig.theme"
        />
    </div>
    <guide-srcview :ModelProp.sync="source03" :SrcProp="srcAll.srcInput_03" />

    <!-- //mark: Tree -->
    <h2>{{ toplink[3] }}</h2>
    <div class="guide-card">
      <div >
        <div class="pl-btn-wrap">
          <v-btn class="pl-btn " @click="treeExpandAll()">전부 펼침</v-btn>
          <v-btn class="pl-btn is-sub" @click="treeCollapseAll()">전부 닫힘</v-btn>
        </div>
        <grid
          class="is-mt-m"
          ref="treeGrid"
          :data="treeData.data"
          :columns="treeData.columns"
          :options="treeData.options"
          />
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source04" :SrcProp="srcAll.srcInput_04" />

    <!-- //mark: Row Span -->
    <h2>{{ toplink[4] }}</h2>
    <div class="guide-card">
      <grid
        ref="rowspanGrid"
        id="rowspanGrid"
        :data="rowSpanData.data"
        :columns="rowSpanData.columns"
        :options="computedGridConfigRowspan"
        :theme="tuiGridConfig.theme_rowspan"
        />
    </div>
    <guide-srcview :ModelProp.sync="source05" :SrcProp="srcAll.srcInput_05" />


  </div>



</template>

<script>
import guideJs from '@/Guide/guide.js';
// import 'tui-grid/dist/tui-grid.css'
// import { Grid } from '@toast-ui/vue-grid'

export default {
  name: "GuideToastGrid",
  props:{
    SelectedProp: {
      type: String,
    }
  },
  components: {
    // 'grid' : Grid,
  },
  created() {

  },
  data() {
    return {
      toplink: [
        'Default',
        'Summary, Draggable',
        'Complex Header',
        'Tree',
        'Row Span',

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
`<div class="text-right">
  <span class="pl-counter">전체 <em class="pl-1">({{ gridData.data.length }})</em> 건</span>
  <!-- 엑셀 다운로드 버튼 -->
  <compo-tooltip-btn
    TitleProp="엑셀 다운로드"
    ClassProp="pl-tooltip-btn is-line ml-2"
    IconProp="pl-icon20 exceldown"
    TooltipPositionProp="bottom"
    @btnClick="downloadExcel('grid01')"
  ></compo-tooltip-btn>
</div>
<div class="pl-toast-grid-wrap">
  <grid
    class="is-mt-s"
    ref="grid01"
    :data="gridData.data"
    :columns="gridData.columns"
    :options="tuiGridConfig"
    :theme="tuiGridConfig.theme"
    @afterPageMove="handlePageChange($event)"
    />
  <div class="pl-pager type-toastUI-L">
    <div class="pl-pager-row">
      <span>페이지당 항목 수</span>
      <v-select
        class="pl-form"
        :value="ROW_PER_PAGE"
        :items="itemsPerPage"
        :item-text="toString(ROW_PER_PAGE)"
        @change="gridSetPerPage('grid01', $event)"
      ></v-select>
    </div>
  </div>
  <!-- 더보기 다음 있을때만 노출 -->
  <div class="pl-pager type-toastUI-R">
    <span class="pl-pager-period">
      보기 {{ mixin_getPagePeriod(gridData.data, currentPage) }} / {{ gridData.data.length }}
      <!-- 보기  -->
      <compo-tooltip-btn
        TitleProp="다음 검색"
        ClassProp="pl-tooltip-btn is-line"
        IconProp="pl-icon20 arrow-next-paging"
        TooltipPositionProp="bottom"
      ></compo-tooltip-btn>
    </span>
  </div>
</div>`
          },
          { tab: "script", content:
`data() {
  return {
    // grid data
    gridData: {
      data: [ // for rowData prop
        {
          img: 'demo_icon01',
          icon: 'trash',
          status: '완료',
          inputbox: '인풋 박스 더블 클릭',
          checkbox: '1,2',
          selectbox: '3',
          datePicker: '2014-04-16',
          dateTimePicker: '2019-11-19 09:00 AM',
          _attributes: {
            disabled: true, // A current row is disabled
            checked: true, // A checkbox is already checked while rendering
            className: {
              // Add class name on a row
              row: ['#eee']
            }
          }
        },
        { img: 'demo_icon01', icon: 'preview', status: '완료', inputbox: 'Tokyo', checkbox: '2' ,selectbox: '1', },
        { img: 'demo_icon02', icon: 'preview', status: '완료', inputbox: 'London', checkbox: '1' ,selectbox: '2', },
        { img: 'demo_icon03', icon: 'preview', status: '완료', inputbox: 'Ljubljana', checkbox: '2' ,selectbox: '3', },
        { img: 'demo_icon04', icon: 'preview', status: '완료', inputbox: '1Reykjavik', checkbox: '1' ,selectbox: '1', },
        { img: 'demo_icon05', icon: 'preview', status: '완료', inputbox: '2Reykjavik', checkbox: '1' ,selectbox: '1', },
        { img: 'demo_icon06', icon: 'preview', status: '완료', inputbox: '3Reykjavik', checkbox: '1' ,selectbox: '1', },
        { img: 'demo_icon07', icon: 'preview', status: '완료', inputbox: '4Reykjavik', checkbox: '1' ,selectbox: '2', },
        ...
      ],
      columns: [ // for columnData prop
        {
          header: 'Img',
          name: 'img',
          align: 'center',
          sortable: false,
          renderer: {
            type: CustomImageRenderer,
          }
        },
        {
          header: 'Icon',
          name: 'icon',
          align: 'center',
          sortable: false,
          formatter: this.iconFormatter
        },
        {
          header: '상태',
          name: 'status',
          width: '120',
          align: 'center',
          renderer: {
            styles: {
              backgroundColor: (status) => this.mixin_displayStatus(status.value, \`statList\`)
            },
            classNames: ['pl-round-chip is-sm '],
          },

        },
        {
          header: 'editable text(sortable asc)',
          name: 'inputbox',
          editor: {
            type: CustomTextEditor,
            options: {
              maxLength: 10,
              placeholder: '입력하세요',
            }
          },
          sortable: true,
          sortingType: 'asc',
        },
        {
          header: 'Checkbox fixed resize',
          name: 'checkbox',
          width: '200',
          resizable: false,
          formatter: 'listItemText',
          editor: {
            type: 'checkbox',
            options: {
              listItems: [
                { text: '조건 A', value: '1' },
                { text: '조건 B', value: '2' },
                { text: '조건 C', value: '3' },
              ]
            }
          },
        },
        {
          header: 'selectbox',
          name: 'selectbox',
          formatter: 'listItemText',
          editor: {
            type: 'select',
            options: {
              listItems: [
                { text: '상담유형-1', value: '1' },
                { text: '상담유형-2', value: '2' },
                { text: '상담유형-3', value: '3' }
              ]
            }
          }
        },
        {
          header: 'DatePicker (Default)',
          name: 'datePicker',
          editor: 'datePicker'
        },
        {
          header: 'Date-TimePicker',
          name: 'dateTimePicker',
          editor: {
            type: 'datePicker',
            options: {
              format: 'yyyy-MM-dd HH:mm A',
              timepicker: true
            }
          }
        }
      ],
    },
},
methods: {
  downloadExcel(grid) {
    const excelGrid = this.$refs[grid];
    const excelExportOptions =  {
      fileName: \`엑셀다운로드_\${grid}\`,
      useFormattedValue: true,
    };
    excelGrid.invoke('export', 'xlsx', excelExportOptions );
  },
  iconFormatter(e) {
    return \`<span class="pl-icon20 \${e.value}"></span>\`
  },
  gridSetPerPage(grid, page){
    const target_grid = this.$refs[grid];
    this.ROW_PER_PAGE = parseInt(page, 10);
    target_grid.invoke('setPerPage',page);
  },
  handlePageChange(e){
    this.currentPage = e.page;
  }
},
computed: {

},
<scritp>
// CustomTextEditor
class CustomTextEditor {
  constructor(props) {
    const el = document.createElement('input');
    const { maxLength, placeholder } = props.columnInfo.editor.options;

    el.type = 'text';
    el.maxLength = maxLength;
    el.placeholder = placeholder;
    el.value = String(props.value);

    this.el = el;
  }

  getElement() {
    return this.el;
  }

  getValue() {
    return this.el.value;
  }

  mounted() {
    this.el.select();
  }
}
// CustomImageRenderer
class CustomImageRenderer {
  constructor(props) {
    const el = document.createElement('img');

    el.type = 'img';
    el.src = require(\`@/assets/img/\${props.value}.png\`);
    el.classList.add('pl-grid-img')

    this.el = el;
    this.render(props);
  }
  getElement() {
    return this.el;
  }

  render(props) {
    this.el.value = String(props.value);
  }
}
</scritp>` },
        ],
        srcInput_02: [ {
            tab: "html",
            content:
`<grid
  :data="gridData.data"
  :columns="gridData.columns"
  :options="computedGridConfigSummary"
  :theme="tuiGridConfig.theme"
  />`
          },
          { tab: "script", content:
`data() {
  return {
    tuiGridConfigSummary: {
      // 헤더
      rowHeaders: [
        {
          type: 'rowNum',
        },
        {
          type: 'checkbox',
          header: \`
          <label for="all-checkbox" class="checkbox">
            <input type="checkbox" id="all-checkbox" class="hidden-input" name="_checked" />
            <span class="custom-input"></span>
          </label>
        \`
        },
      ],

      // 합계 옵션
      summary: {
        height: 40,
        position: 'bottom', // or 'top'
        columnContent: {
          count: {
            template: function(valueMap) {
              return \`TOTAL: \${valueMap.sum},  AVG: \${valueMap.avg.toFixed(2)}\`\;
            }
          },
        }
      },
      draggable: true,
    },
  }
},
methods: {

},
computed: {
  computedGridConfigSummary() {
    return {
      ...this.tuiGridConfig,
      ...this.tuiGridConfigSummary,
    }
  },
},` },
],
        srcInput_03: [ {
            tab: "html",
            content:
` <grid
  :data="complexHeaderData.data"
  :columns="complexHeaderData.columns"
  :header="complexHeaderData.header"
  :options="tuiGridConfig"
  :theme="tuiGridConfig.theme"
  />`
          },
          { tab: "script", content:
`data() {
  return {
    // ComplexHeader
    complexHeaderData: {
      data: [
        {
        type01: '대분류01',
        type02: '중분류01',
        type03: '소분류01',
        subject: '취소수수료를 환불해 주세요.',
        date: '2023-12-12',
        },
        { type01: '대분류01', type02: '중분류01', type03: '소분류01', subject: '취소수수료를 환불해 주세요1.', date: '2023-12-12', },
        { type01: '대분류02', type02: '중분류02', type03: '소분류02', subject: '취소수수료를 환불해 주세요2.', date: '2023-12-12', },
        { type01: '대분류03', type02: '중분류03', type03: '소분류03', subject: '취소수수료를 환불해 주세요3.', date: '2023-12-12', },
        { type01: '대분류04', type02: '중분류04', type03: '소분류04', subject: '취소수수료를 환불해 주세요4.', date: '2023-12-12', },
        { type01: '대분류05', type02: '중분류05', type03: '소분류05', subject: '취소수수료를 환불해 주세요5.', date: '2023-12-12', },
        { type01: '대분류06', type02: '중분류06', type03: '소분류06', subject: '취소수수료를 환불해 주세요6.', date: '2023-12-12', },
        { type01: '대분류07', type02: '중분류07', type03: '소분류07', subject: '취소수수료를 환불해 주세요7.', date: '2023-12-12', },
        { type01: '대분류08', type02: '중분류08', type03: '소분류08', subject: '취소수수료를 환불해 주세요8.', date: '2023-12-12', },
        { type01: '대분류09', type02: '중분류09', type03: '소분류09', subject: '취소수수료를 환불해 주세요9.', date: '2023-12-12', },
        { type01: '대분류10', type02: '중분류10', type03: '소분류10', subject: '취소수수료를 환불해 주세요10.', date: '2023-12-12', },
        { type01: '대분류11', type02: '중분류11', type03: '소분류11', subject: '취소수수료를 환불해 주세요11.', date: '2023-12-12', },
        { type01: '대분류12', type02: '중분류12', type03: '소분류12', subject: '취소수수료를 환불해 주세요12.', date: '2023-12-12', },
        { type01: '대분류13', type02: '중분류13', type03: '소분류13', subject: '취소수수료를 환불해 주세요13.', date: '2023-12-12', },
      ],
      header: {
        height: 80,
        complexColumns: [
          {
            header: '상담유형',
            name: 'mergeColumn1',
            childNames: ['type01', 'type02', 'type03']
          },
        ]
      },
      columns: [
        {
          header: '대분류',
          name: 'type01',
          width: '120',
        },
        {
          header: '중분류',
          name: 'type02',
          width: '120',
        },
        {
          header: '소분류',
          name: 'type03',
          width: '120',
        },
        {
          header: '스크립트명',
          name: 'subject'
        },
        {
          header: '수정일',
          name: 'date',
          width: '120',
          align: 'center'
        },
      ]

    },
  }
},
methods: {

},
computed: {

},` },
],
        srcInput_04: [ {
            tab: "html",
            content:
`<div class="pl-btn-wrap">
  <v-btn class="pl-btn " @click="treeExpandAll()">전부 펼침</v-btn>
  <v-btn class="pl-btn is-sub" @click="treeCollapseAll()">전부 닫힘</v-btn>
</div>
<grid
  class="is-mt-m"
  ref="treeGrid"
  :data="treeData.data"
  :columns="treeData.columns"
  :options="treeData.options"
  />`
          },
          { tab: "script", content:
`data() {
  return {
    // tree
    treeData: {
      data: [
        {
          id: 549731,
          name: 'Beautiful Lies',
          artist: 'Birdy',
          release: '2016.03.26',
          type: 'Deluxe',
          typeCode: '1',
          genre: 'Pop',
          genreCode: '1',
          grade: '4',
          price: 10000,
          downloadCount: 1000,
          listenCount: 5000,
          _attributes: {
            expanded: true,
          },
          _children: [
            {
              id: 490500,
              name: 'Blue Skies',
              release: '2015.03.18',
              artist: 'Lenka',
              type: 'Single',
              typeCode: '3',
              genre: 'Pop,Rock',
              genreCode: '1,2',
              grade: '5',
              price: 6000,
              downloadCount: 1000,
              listenCount: 5000,
            },
            {
              id: 491379,
              name: 'Chaos And The Calm',
              artist: 'James Bay',
              release: '2015.03.23',
              type: 'EP',
              typeCode: '2',
              genre: 'Pop,Rock',
              genreCode: '1,2',
              grade: '5',
              price: 12000,
              downloadCount: 1000,
              listenCount: 5000,
              _attributes: {
                expanded: true,
              },
              _children: [
                {
                  id: 450720,
                  name: "I'm Not The Only One",
                  artist: 'Sam Smith',
                  release: '2014.09.15',
                  type: 'Single',
                  typeCode: '3',
                  genre: 'Pop,R&B',
                  genreCode: '1,3',
                  grade: '4',
                  price: 8000,
                  downloadCount: 1000,
                  listenCount: 5000,
                  _children: [
                    {
                      id: 587871,
                      name: 'This Is Acting',
                      artist: 'Sia',
                      release: '2016.10.22',
                      type: 'EP',
                      typeCode: '2',
                      genre: 'Pop',
                      genreCode: '1',
                      grade: '3',
                      price: 20000,
                      downloadCount: 1000,
                      listenCount: 5000,
                    },
                    {
                      id: 583551,
                      name: 'Following My Intuition',
                      artist: 'Craig David',
                      release: '2016.10.01',
                      type: 'Deluxe',
                      typeCode: '1',
                      genre: 'R&B,Electronic',
                      genreCode: '3,4',
                      grade: '5',
                      price: 15000,
                      downloadCount: 1000,
                      listenCount: 5000,
                    },
                  ],
                },
              ],
            },
            {
              id: 498896,
              name: 'The Magic Whip',
              artist: 'Blur',
              release: '2015.04.27',
              type: 'EP',
              typeCode: '2',
              genre: 'Rock',
              genreCode: '2',
              grade: '3',
              price: 15000,
              downloadCount: 1000,
              listenCount: 5000,
            },
            {
              id: 504288,
              name: 'Blurryface',
              artist: 'Twenty One Pilots',
              release: '2015.05.19',
              type: 'EP',
              typeCode: '2',
              genre: 'Rock',
              genreCode: '2',
              grade: '1',
              price: 13000,
              downloadCount: 1000,
              listenCount: 5000,
            },
          ],
        },
        {
          id: 436461,
          name: 'X',
          artist: 'Ed Sheeran',
          release: '2014.06.24',
          type: 'Deluxe',
          typeCode: '1',
          genre: 'Pop',
          genreCode: '1',
          grade: '5',
          price: 20000,
          downloadCount: 1000,
          listenCount: 5000,
        },
        {
          id: 295651,
          name: 'Moves Like Jagger',
          release: '2011.08.08',
          artist: 'Maroon5',
          type: 'Single',
          typeCode: '3',
          genre: 'Pop,Rock',
          genreCode: '1,2',
          grade: '2',
          price: 7000,
          downloadCount: 1000,
          listenCount: 5000,
        },
      ],
      columns: [
        {
          header: 'Name',
          name: 'name',
          width: 300
        },
        {
          header: 'Artist',
          name: 'artist'
        },
        {
          header: 'Type',
          name: 'type'
        },
        {
          header: 'Release',
          name: 'release'
        },
        {
          header: 'Genre',
          name: 'genre'
        }
      ],
      options: {
        bodyHeight: 500,
        rowHeaders: [
          { type: 'rowNum', },
          { type: 'checkbox'}
        ],
        treeColumnOptions: {
          name: 'name',
          useCascadingCheckbox: true
        },
      },
    },
  }
},
methods: {
  treeExpandAll() {
    this.$refs.treeGrid.invoke('expandAll');
  },
  treeCollapseAll() {
    this.$refs.treeGrid.invoke('collapseAll');
  },
},
computed: {

},` },
],
        srcInput_05: [ {
            tab: "html",
            content:
`<grid
  ref="rowspanGrid"
  id="rowspanGrid"
  :data="rowSpanData.data"
  :columns="rowSpanData.columns"
  :options="computedGridConfigRowspan"
  :theme="tuiGridConfig.theme_rowspan"
  />`
          },
          { tab: "script", content:
`data() {
  return {
    // Row span
    rowSpanData: {
      data: [
        { id: 1,type01: '도입부', type02: '첫/끝인사', type03: '7', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
        { id: 2,type01: '도입부', type02: '첫/끝인사', type03: '4', subject: '오픈멘트와 실명은 나누었지만, 친근감 없이 형식적으로 진행될 경우', },
        { id: 3,type01: '도입부', type02: '첫/끝인사', type03: '0', subject: '첫인사 + 끝인사중 한가지이상 누락하였거나, 실명 없을 경우'},
        { id: 4,type01: '도입부', type02: '고객확인', type03: '5', subject: '필수 고객정보 확인하며 도입부에 2가지이상 고객께 직접 확인하는 경우', },
        { id: 5,type01: '도입부', type02: '고객확인', type03: '2', subject: '필수 고객정보 확인은 하되 상담원의 입에서 1가지이상 정보 누출되는 경우', },
        { id: 6,type01: '도입부', type02: '고객확인', type03: '0', subject: '통화 종료시점까지 고객정보 확인없이 진행하는 경우', },
        { id: 7,type01: '응대 스킬', type02: '호응어', type03: '10', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
        { id: 8,type01: '응대 스킬', type02: '호응어', type03: '7', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
        { id: 9,type01: '응대 스킬', type02: '호응어', type03: '4', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
        { id: 10,type01: '응대 스킬', type02: '호응어', type03: '0', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
        { id: 11,type01: '응대 스킬', type02: '경청', type03: '5', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
        { id: 12,type01: '응대 스킬', type02: '경청', type03: '3', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
      ],
      columns: [
        {
          header: '대분류',
          name: 'type01',
          width: '150',
          filter: 'select',
          rowSpan: true,
        },
        {
          header: '중분류',
          name: 'type02',
          width: '150',
          filter: 'select',
          rowSpan: true
        },
        {
          header: '배점',
          name: 'type03',
          width: '150',
          align: 'right',
          filter: 'select',
          editor: {
            type: 'select',
            options: {
              listItems: [
                { text: '1', value: '1' },
                { text: '2', value: '2' },
                { text: '3', value: '3' },
                { text: '4', value: '4' },
                { text: '5', value: '5' },
                { text: '6', value: '6' },
                { text: '7', value: '7' },
                { text: '8', value: '8' },
                { text: '9', value: '9' },
                { text: '10', value: '10' },
              ]
            }
          }
        },
        {
          header: '품질기분',
          name: 'subject',
          editor: {
            type: CustomAppendBtnEditor,
            options: {
              maxLength: 255,
              placeholder: '입력하세요',
            }
          },
        },
      ],
    },
    // options
    tuiGridConfigRowspan: {
      // no 페이징
      pageOptions: {},
      // 합계 옵션
      summary: {
        height: 40,
        position: 'bottom', // or 'top'
        columnContent: {
          type03: {
            template: function(valueMap) {
              return \`<div class="d-flex">총점: <strong class="ml-auto">\${valueMap.sum}</strong></div>\`;
            }
          },
        }
      },
      columnOptions: {
        resizable: false,
      },
    },
  }
},
methods: {

},
computed: {
  computedGridConfigRowspan() {
    return {
      ...this.tuiGridConfig,
      ...this.tuiGridConfigRowspan,
    }
  },
},
<script>
// CustomAppendBtnEditor
class CustomAppendBtnEditor {
  constructor(props) {
    const el = document.createElement('div');
    const textfield = document.createElement('input');
    const btn = document.createElement('button');
    const { maxLength, placeholder } = props.columnInfo.editor.options;
    const { grid, rowKey  } = props

    el.classList = 'd-flex align-center';
    el.style = 'height: 100%';
    el.append(textfield);
    el.append(btn);

    btn.type = 'button';
    btn.classList = 'v-btn pl-tooltip-btn ml-2';
    btn.style = 'width: 30px; height: 30px;';
    btn.insertAdjacentHTML('afterbegin', '<span class="pl-icon20 trash"></span>');

    textfield.type = 'text';
    textfield.maxLength = maxLength;
    textfield.placeholder = placeholder;
    textfield.value = String(props.value);

    btn.addEventListener('click', () => {
      grid.removeRow(rowKey);
    });

    this.el = el;
    this.textfield = textfield;
  }

  getElement() {
    return this.el;
  }

  getValue() {
    return this.textfield.value;
  }

  mounted() {
    this.textfield.select();
  }
}
<\/script>` },
],
        srcInput_06: [ {
            tab: "html",
            content:
``
          },
          { tab: "script", content:
`data() {
  return {

  }
},
methods: {

},
computed: {

},` },
],
        srcInput_07: [ {
            tab: "html",
            content:
``
          },
          { tab: "script", content:
`data() {
  return {

  }
},
methods: {

},
computed: {

},` },
],


      },

      // grid options
      tuiGridConfig: {
        // 페이징
        pageOptions: {
          useClient: true,
          perPage: 15
        },
      },
      tuiGridConfigRowspan: {
        // no 페이징
        pageOptions: {},
        // 합계 옵션
        summary: {
          height: 40,
          position: 'bottom', // or 'top'
          columnContent: {
            type03: {
              template: function(valueMap) {
                return `<div class="d-flex">총점: <strong class="ml-auto">${valueMap.sum}</strong></div>`;
              }
            },
          }
        },
        columnOptions: {
          resizable: false,
        },
      },
      tuiGridConfigSummary: {
        // 헤더
        // rowHeaders:  ['rowNum', 'checkbox'],
        rowHeaders: [
          {
            type: 'rowNum',
          },
          {
            type: 'checkbox',
            renderer: CheckboxRenderer,
            header: `
            <label for="all-checkbox" class="">
              <input type="checkbox" id="all-checkbox" class="pl-check type-native" name="_checked" />
            </label>`
          },
        ],

        // 합계 옵션
        summary: {
          height: 40,
          position: 'bottom', // or 'top'
          columnContent: {
            count: {
              template: function(valueMap) {
                return `TOTAL: ${valueMap.sum},  AVG: ${valueMap.avg.toFixed(2)}`;
              }
            },
          }
        },

        draggable: true,
      },

      // grid data
      gridData: {
        data: [ // for rowData prop
          {
            img: 'demo_icon01',
            icon: 'trash',
            status: '완료',
            inputbox: '인풋 박스 더블 클릭',
            checkbox: '1,2',
            selectbox: '3',
            datePicker: '2014-04-16',
            dateTimePicker: '2019-11-19 09:00 AM',
            _attributes: {
              disabled: true, // A current row is disabled
              checked: true, // A checkbox is already checked while rendering
              className: {
                // Add class name on a row
                row: ['#eee']
              }
            }
          },
          { img: 'demo_icon01', icon: 'preview', status: '완료', inputbox: 'Tokyo', checkbox: '2' ,selectbox: '1', },
          { img: 'demo_icon02', icon: 'preview', status: '완료', inputbox: 'London', checkbox: '1' ,selectbox: '2', },
          { img: 'demo_icon03', icon: 'preview', status: '완료', inputbox: 'Ljubljana', checkbox: '2' ,selectbox: '3', },
          { img: 'demo_icon04', icon: 'preview', status: '완료', inputbox: '1Reykjavik', checkbox: '1' ,selectbox: '1', },
          { img: 'demo_icon05', icon: 'preview', status: '완료', inputbox: '2Reykjavik', checkbox: '1' ,selectbox: '1', },
          { img: 'demo_icon06', icon: 'preview', status: '완료', inputbox: '3Reykjavik', checkbox: '1' ,selectbox: '1', },
          { img: 'demo_icon07', icon: 'preview', status: '완료', inputbox: '4Reykjavik', checkbox: '1' ,selectbox: '2', },
          { img: 'demo_icon01', icon: 'preview', status: '완료', inputbox: '5Reykjavik', checkbox: '1' ,selectbox: '2', },
          { img: 'demo_icon01', icon: 'preview', status: '완료', inputbox: '6Reykjavik', checkbox: '3' ,selectbox: '2', },
          { img: 'demo_icon01', icon: 'zoom', status: '대기', inputbox: '7Reykjavik', checkbox: '3' ,selectbox: '2', },
          { img: 'demo_icon01', icon: 'zoom', status: '대기', inputbox: '8Reykjavik', checkbox: '3' ,selectbox: '3', },
          { img: 'demo_icon01', icon: 'zoom', status: '대기', inputbox: '9Reykjavik', checkbox: '1' ,selectbox: '3', },
          { img: 'demo_icon01', icon: 'zoom', status: '대기', inputbox: '10Reykjavik', checkbox: '2' ,selectbox: '1', },
          { img: 'demo_icon01', icon: 'zoom', status: '대기', inputbox: '11Reykjavik', checkbox: '2' ,selectbox: '1', },
          { img: 'demo_icon01', icon: 'zoom', status: '대기', inputbox: '12Reykjavik', checkbox: '2' ,selectbox: '1', },
          { img: 'demo_icon01', icon: 'zoom', status: '대기', inputbox: '13Reykjavik', checkbox: '2' ,selectbox: '1', },
          { img: 'demo_icon01', icon: 'zoom', status: '대기', inputbox: '14Reykjavik', checkbox: '2' ,selectbox: '1', },
          { img: 'demo_icon01', icon: 'zoom', status: '대기', inputbox: '15Reykjavik', checkbox: '2' ,selectbox: '1', },
          { img: 'demo_icon01', icon: 'zoom', status: '대기', inputbox: '16Reykjavik', checkbox: '2' ,selectbox: '1', },
          { img: 'demo_icon01', icon: 'zoom', status: '대기', inputbox: '17Reykjavik', checkbox: '2' ,selectbox: '1', },
          { img: 'demo_icon01', icon: 'zoom', status: '대기', inputbox: '18Reykjavik', checkbox: '2' ,selectbox: '2', },
          { img: 'demo_icon01', icon: 'zoom', status: '대기', inputbox: '19Reykjavik', checkbox: '2' ,selectbox: '2', },
        ],
        columns: [ // for columnData prop
          {
            header: 'Img',
            name: 'img',
            align: 'center',
            sortable: false,
            renderer: {
              type: CustomImageRenderer,
            }
          },
          {
            header: 'Icon',
            name: 'icon',
            align: 'center',
            sortable: false,
            formatter: this.iconFormatter
          },
          {
            header: '상태',
            name: 'status',
            width: '120',
            align: 'center',
            renderer: {
              styles: {
                backgroundColor: (status) => this.mixin_displayStatus(status.value, `statList`)
              },
              classNames: ['pl-round-chip is-sm '],
            },

          },
          {
            header: 'editable text(sortable asc)',
            name: 'inputbox',
            editor: {
              type: CustomTextEditor,
              options: {
                maxLength: 10,
                placeholder: '입력하세요',
              }
            },
            sortable: true,
            sortingType: 'asc',
          },
          {
            header: 'Checkbox fixed resize',
            name: 'checkbox',
            width: '200',
            resizable: false,
            formatter: 'listItemText',
            editor: {
              type: 'checkbox',
              options: {
                listItems: [
                  { text: '조건 A', value: '1' },
                  { text: '조건 B', value: '2' },
                  { text: '조건 C', value: '3' },
                ]
              }
            },
          },
          {
            header: 'selectbox',
            name: 'selectbox',
            formatter: 'listItemText',
            editor: {
              type: 'select',
              options: {
                listItems: [
                  { text: '상담유형-1', value: '1' },
                  { text: '상담유형-2', value: '2' },
                  { text: '상담유형-3', value: '3' }
                ]
              }
            }
          },
          {
            header: 'DatePicker (Default)',
            name: 'datePicker',
            editor: 'datePicker'
          },
          {
            header: 'Date-TimePicker',
            name: 'dateTimePicker',
            editor: {
              type: 'datePicker',
              options: {
                format: 'yyyy-MM-dd HH:mm A',
                timepicker: true
              }
            }
          }
        ],
      },

      // tree
      treeData: {
        data: [
          {
            id: 549731,
            name: 'Beautiful Lies',
            artist: 'Birdy',
            release: '2016.03.26',
            type: 'Deluxe',
            typeCode: '1',
            genre: 'Pop',
            genreCode: '1',
            grade: '4',
            price: 10000,
            downloadCount: 1000,
            listenCount: 5000,
            _attributes: {
              expanded: true,
            },
            _children: [
              {
                id: 490500,
                name: 'Blue Skies',
                release: '2015.03.18',
                artist: 'Lenka',
                type: 'Single',
                typeCode: '3',
                genre: 'Pop,Rock',
                genreCode: '1,2',
                grade: '5',
                price: 6000,
                downloadCount: 1000,
                listenCount: 5000,
              },
              {
                id: 491379,
                name: 'Chaos And The Calm',
                artist: 'James Bay',
                release: '2015.03.23',
                type: 'EP',
                typeCode: '2',
                genre: 'Pop,Rock',
                genreCode: '1,2',
                grade: '5',
                price: 12000,
                downloadCount: 1000,
                listenCount: 5000,
                _attributes: {
                  expanded: true,
                },
                _children: [
                  {
                    id: 450720,
                    name: "I'm Not The Only One",
                    artist: 'Sam Smith',
                    release: '2014.09.15',
                    type: 'Single',
                    typeCode: '3',
                    genre: 'Pop,R&B',
                    genreCode: '1,3',
                    grade: '4',
                    price: 8000,
                    downloadCount: 1000,
                    listenCount: 5000,
                    _children: [
                      {
                        id: 587871,
                        name: 'This Is Acting',
                        artist: 'Sia',
                        release: '2016.10.22',
                        type: 'EP',
                        typeCode: '2',
                        genre: 'Pop',
                        genreCode: '1',
                        grade: '3',
                        price: 20000,
                        downloadCount: 1000,
                        listenCount: 5000,
                      },
                      {
                        id: 583551,
                        name: 'Following My Intuition',
                        artist: 'Craig David',
                        release: '2016.10.01',
                        type: 'Deluxe',
                        typeCode: '1',
                        genre: 'R&B,Electronic',
                        genreCode: '3,4',
                        grade: '5',
                        price: 15000,
                        downloadCount: 1000,
                        listenCount: 5000,
                      },
                    ],
                  },
                ],
              },
              {
                id: 498896,
                name: 'The Magic Whip',
                artist: 'Blur',
                release: '2015.04.27',
                type: 'EP',
                typeCode: '2',
                genre: 'Rock',
                genreCode: '2',
                grade: '3',
                price: 15000,
                downloadCount: 1000,
                listenCount: 5000,
              },
              {
                id: 504288,
                name: 'Blurryface',
                artist: 'Twenty One Pilots',
                release: '2015.05.19',
                type: 'EP',
                typeCode: '2',
                genre: 'Rock',
                genreCode: '2',
                grade: '1',
                price: 13000,
                downloadCount: 1000,
                listenCount: 5000,
              },
            ],
          },
          {
            id: 436461,
            name: 'X',
            artist: 'Ed Sheeran',
            release: '2014.06.24',
            type: 'Deluxe',
            typeCode: '1',
            genre: 'Pop',
            genreCode: '1',
            grade: '5',
            price: 20000,
            downloadCount: 1000,
            listenCount: 5000,
          },
          {
            id: 295651,
            name: 'Moves Like Jagger',
            release: '2011.08.08',
            artist: 'Maroon5',
            type: 'Single',
            typeCode: '3',
            genre: 'Pop,Rock',
            genreCode: '1,2',
            grade: '2',
            price: 7000,
            downloadCount: 1000,
            listenCount: 5000,
          },
        ],
        columns: [
          {
            header: 'Name',
            name: 'name',
            width: 300
          },
          {
            header: 'Artist',
            name: 'artist'
          },
          {
            header: 'Type',
            name: 'type'
          },
          {
            header: 'Release',
            name: 'release'
          },
          {
            header: 'Genre',
            name: 'genre'
          }
        ],
        options: {
          bodyHeight: 500,
          rowHeaders: [
            { type: 'rowNum', },
            { type: 'checkbox'}
          ],
          treeColumnOptions: {
            name: 'name',
            useCascadingCheckbox: true
          },
          // draggable: true,
        },
      },

      // Row span
      rowSpanData: {
        data: [
          { id: 1,type01: '도입부', type02: '첫/끝인사', type03: '7', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
          { id: 2,type01: '도입부', type02: '첫/끝인사', type03: '4', subject: '오픈멘트와 실명은 나누었지만, 친근감 없이 형식적으로 진행될 경우', },
          { id: 3,type01: '도입부', type02: '첫/끝인사', type03: '0', subject: '첫인사 + 끝인사중 한가지이상 누락하였거나, 실명 없을 경우'},
          { id: 4,type01: '도입부', type02: '고객확인', type03: '5', subject: '필수 고객정보 확인하며 도입부에 2가지이상 고객께 직접 확인하는 경우', },
          { id: 5,type01: '도입부', type02: '고객확인', type03: '2', subject: '필수 고객정보 확인은 하되 상담원의 입에서 1가지이상 정보 누출되는 경우', },
          { id: 6,type01: '도입부', type02: '고객확인', type03: '0', subject: '통화 종료시점까지 고객정보 확인없이 진행하는 경우', },
          { id: 7,type01: '응대 스킬', type02: '호응어', type03: '10', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
          { id: 8,type01: '응대 스킬', type02: '호응어', type03: '7', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
          { id: 9,type01: '응대 스킬', type02: '호응어', type03: '4', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
          { id: 10,type01: '응대 스킬', type02: '호응어', type03: '0', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
          { id: 11,type01: '응대 스킬', type02: '경청', type03: '5', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
          { id: 12,type01: '응대 스킬', type02: '경청', type03: '3', subject: '행복을 전하는 000입니다. 고객님, 무엇을 도와드릴까요? ( 맞이인사 미소 띈 음성으로 진행)', },
        ],
        columns: [
          {
            header: '대분류',
            name: 'type01',
            width: '150',
            filter: 'select',
            rowSpan: true,
          },
          {
            header: '중분류',
            name: 'type02',
            width: '150',
            filter: 'select',
            rowSpan: true
          },
          {
            header: '배점',
            name: 'type03',
            width: '150',
            align: 'right',
            filter: 'select',
            // editor: {
            //   type: CustomTextEditor,
            //   options: {
            //     maxLength: 2,
            //     placeholder: '입력하세요',
            //   }
            // },
            editor: {
              type: 'select',
              options: {
                listItems: [
                  { text: '1', value: '1' },
                  { text: '2', value: '2' },
                  { text: '3', value: '3' },
                  { text: '4', value: '4' },
                  { text: '5', value: '5' },
                  { text: '6', value: '6' },
                  { text: '7', value: '7' },
                  { text: '8', value: '8' },
                  { text: '9', value: '9' },
                  { text: '10', value: '10' },
                ]
              }
            }
          },
          {
            header: '품질기분',
            name: 'subject',
            editor: {
              type: CustomAppendBtnEditor,
              options: {
                maxLength: 255,
                placeholder: '입력하세요',
              }
            },
          },
        ],
      },

      // ComplexHeader
      complexHeaderData: {
        data: [
         {
          type01: '대분류01',
          type02: '중분류01',
          type03: '소분류01',
          subject: '취소수수료를 환불해 주세요.',
          date: '2023-12-12',
         },
         { type01: '대분류01', type02: '중분류01', type03: '소분류01', subject: '취소수수료를 환불해 주세요1.', date: '2023-12-12', },
         { type01: '대분류02', type02: '중분류02', type03: '소분류02', subject: '취소수수료를 환불해 주세요2.', date: '2023-12-12', },
         { type01: '대분류03', type02: '중분류03', type03: '소분류03', subject: '취소수수료를 환불해 주세요3.', date: '2023-12-12', },
         { type01: '대분류04', type02: '중분류04', type03: '소분류04', subject: '취소수수료를 환불해 주세요4.', date: '2023-12-12', },
         { type01: '대분류05', type02: '중분류05', type03: '소분류05', subject: '취소수수료를 환불해 주세요5.', date: '2023-12-12', },
         { type01: '대분류06', type02: '중분류06', type03: '소분류06', subject: '취소수수료를 환불해 주세요6.', date: '2023-12-12', },
         { type01: '대분류07', type02: '중분류07', type03: '소분류07', subject: '취소수수료를 환불해 주세요7.', date: '2023-12-12', },
         { type01: '대분류08', type02: '중분류08', type03: '소분류08', subject: '취소수수료를 환불해 주세요8.', date: '2023-12-12', },
         { type01: '대분류09', type02: '중분류09', type03: '소분류09', subject: '취소수수료를 환불해 주세요9.', date: '2023-12-12', },
         { type01: '대분류10', type02: '중분류10', type03: '소분류10', subject: '취소수수료를 환불해 주세요10.', date: '2023-12-12', },
         { type01: '대분류11', type02: '중분류11', type03: '소분류11', subject: '취소수수료를 환불해 주세요11.', date: '2023-12-12', },
         { type01: '대분류12', type02: '중분류12', type03: '소분류12', subject: '취소수수료를 환불해 주세요12.', date: '2023-12-12', },
         { type01: '대분류13', type02: '중분류13', type03: '소분류13', subject: '취소수수료를 환불해 주세요13.', date: '2023-12-12', },
        ],
        header: {
          height: 80,
          complexColumns: [
            {
              header: '상담유형',
              name: 'mergeColumn1',
              childNames: ['type01', 'type02', 'type03']
            },
          ]
        },
        columns: [
          {
            header: '대분류',
            name: 'type01',
            width: '120',
          },
          {
            header: '중분류',
            name: 'type02',
            width: '120',
          },
          {
            header: '소분류',
            name: 'type03',
            width: '120',
          },
          {
            header: '스크립트명',
            name: 'subject'
          },
          {
            header: '수정일',
            name: 'date',
            width: '120',
            align: 'center'
          },
        ]

      },

      // status return
      statList: [
        { name: '완료', value: '#02A952' },
        { name: '대기', value: '#FF9314' },
      ],

      // select per page
      itemsPerPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
      currentPage: 1,
    }
  },
  methods: {
    treeExpandAll() {
      this.$refs.treeGrid.invoke('expandAll');
    },
    treeCollapseAll() {
      this.$refs.treeGrid.invoke('collapseAll');
    },
    downloadExcel(grid) {
      const excelGrid = this.$refs[grid];
      const excelExportOptions =  {
        fileName: `엑셀다운로드_${grid}`,
        useFormattedValue: true,
      };
      excelGrid.invoke('export', 'xlsx', excelExportOptions );
    },
    iconFormatter(e) {
      return `<span class="pl-icon20 ${e.value}"></span>`
    },
    gridSetPerPage(grid, page){
      const target_grid = this.$refs[grid];
      this.ROW_PER_PAGE = parseInt(page, 10);
      target_grid.invoke('setPerPage',page);
    },
    handlePageChange(e){
      this.currentPage = e.page;
    },
  },
  computed: {
    computedGridConfigSummary() {
      return {
        ...this.tuiGridConfig,
        ...this.tuiGridConfigSummary,
      }
    },
    computedGridConfigRowspan() {
      return {
        ...this.tuiGridConfig,
        ...this.tuiGridConfigRowspan,
      }
    },


  },
  mounted() {
    guideJs.appendHiddenLink(this.toplink);
  },
}

// checkbox custom renderer
class CheckboxRenderer {
  constructor(props) {
    const { grid, rowKey } = props;

    const label = document.createElement('label');
    label.className = 'checkbox tui-grid-row-header-checkbox';
    label.setAttribute('for', String(rowKey));

    const customInput = document.createElement('input');
    customInput.className = 'pl-check type-native';
    customInput.id = String(rowKey);

    // const customInput = document.createElement('span');
    // customInput.className = `pl-check type-native`;

    label.appendChild(customInput);
    // label.appendChild(customInput);

    customInput.type = 'checkbox';

    //label check
    label.addEventListener('click', (ev) => {
      ev.preventDefault();

      if (ev.shiftKey) {
        grid[!customInput.checked ? 'checkBetween' : 'uncheckBetween'](rowKey);
        return;
      }
      grid[!customInput.checked ? 'check' : 'uncheck'](rowKey);
    });
    // checked row
    grid.on('click', () => {
      grid.findRows((row) => {
        if( row._attributes.checked ){
          grid.addRowClassName(rowKey, 'checked-row');
        } else{
          grid.removeRowClassName(row.rowKey, 'checked-row');
        }
      });
    })
    grid.on('checkAll', () => {
      grid.findRows((row) => {
        if( row._attributes.checked ){
          grid.addRowClassName(rowKey, 'checked-row');
        } else{
          grid.removeRowClassName(row.rowKey, 'checked-row');
        }
      });
    })

    // label.addEventListener('click', (ev) => {
    //   ev.preventDefault();

    //   if (ev.shiftKey) {
    //     grid[!customInput.checked ? 'checkBetween' : 'uncheckBetween'](rowKey);
    //     return;
    //   }
    //   grid[!customInput.checked ? 'check' : 'uncheck'](rowKey);
    //   // customInput.className = `pl-check type-native ${hiddenInput.checked}`;

    // });

    this.el = label;

    this.render(props);
  }

  getElement() {
    return this.el;
  }

  render(props) {
    const customInput = this.el.querySelector('.pl-check');
    const checked = Boolean(props.value);

    customInput.checked = checked;
  }
}

// CustomAppendBtnEditor
class CustomAppendBtnEditor {
  constructor(props) {
    const el = document.createElement('div');
    const textfield = document.createElement('input');
    const btn = document.createElement('button');
    const { maxLength, placeholder } = props.columnInfo.editor.options;
    const { grid, rowKey  } = props

    el.classList = 'd-flex align-center';
    el.style = 'height: 100%';
    el.append(textfield);
    el.append(btn);

    btn.type = 'button';
    btn.classList = 'v-btn pl-tooltip-btn ml-2';
    btn.style = 'width: 30px; height: 30px;';
    btn.insertAdjacentHTML('afterbegin', '<span class="pl-icon20 trash"></span>');

    textfield.type = 'text';
    textfield.maxLength = maxLength;
    textfield.placeholder = placeholder;
    textfield.value = String(props.value);

    btn.addEventListener('click', () => {
      grid.removeRow(rowKey);
    });

    this.el = el;
    this.textfield = textfield;
  }

  getElement() {
    return this.el;
  }

  getValue() {
    return this.textfield.value;
  }

  mounted() {
    this.textfield.select();
  }
}

// CustomTextEditor
class CustomTextEditor {
  constructor(props) {
    const el = document.createElement('input');
    const { maxLength, placeholder } = props.columnInfo.editor.options;

    el.type = 'text';
    el.maxLength = maxLength;
    el.placeholder = placeholder;
    el.value = String(props.value);

    this.el = el;
  }

  getElement() {
    return this.el;
  }

  getValue() {
    return this.el.value;
  }

  mounted() {
    this.el.select();
  }
}

//customImg
class CustomImageRenderer {
  constructor(props) {
    const el = document.createElement('img');

    el.type = 'img';
    el.src = require(`@/assets/img/${props.value}.png`);
    el.classList.add('pl-grid-img')

    this.el = el;
    this.render(props);
  }
  getElement() {
    return this.el;
  }

  render(props) {
    this.el.value = String(props.value);
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>