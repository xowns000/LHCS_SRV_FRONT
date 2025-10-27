<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <guide-table :PropTable="propsTable" />
    <!-- //mark: Excel 업로드 인풋-->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <compo-excel
          TypeProp="Upload"
          :upload_headers="upload_headers"
          :upload_bodys="upload_bodys"
          @FromCompExcel="getExcelData"
        />
        <v-btn
          class="pl-btn"
          @click="upload_bodys = []">
          데이터 초기화
        </v-btn>

      </div>
      <v-data-table
        class="pl-grid"
        :headers="upload_headers"
        :items="upload_bodys"
        height="200px"
        :items-per-page="20"
        fixed-header
        hide-default-footer
      >
      </v-data-table>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: Excel 업로드 버튼 -->
    <h2>{{ toplink[1] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <v-text-field
          class="pl-form"
          v-model="fileName"
          readonly
        />
        <compo-excel
          TypeProp="UploadBtn"
          :upload_headers="upload_headers2"
          :upload_bodys="upload_bodys2"
          @FromCompExcel="getExcelData2"
        />
        <v-btn
          class="pl-btn"
          @click="upload_bodys2 = [], fileName=''">
          데이터 초기화
        </v-btn>
      </div>
      <v-data-table
        class="pl-grid mt-2"
        :headers="upload_headers2"
        :items="upload_bodys2"
        height="200px"
        :items-per-page="20"
        fixed-header
        hide-default-footer
      >
      </v-data-table>
    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />

    <!-- //mark: Excel 다운로드 -->
    <h2>{{ toplink[2] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <v-text-field
          class="pl-form"
          v-model="SEL_DATA_NUM"
          placeholder="몇번까지 다운?"
        ></v-text-field>
        <compo-excel
          TypeProp="Download"
          :DataHeaderProp="headers"
          :DataBodyProp="items"
          :DataNumProp="SEL_DATA_NUM"
          FileNameProp="엑셀 다운로드"
          SheetNameProp="sheetDown"
        />
      </div>
      <v-data-table
        id="sampleTable"
        class="pl-grid mt-2"
        :headers="headers"
        :items="items"
        fixed-header
        item-key="index"
        height="200px"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
        :page.sync="page"
        @page-count="pageCount = $event">
      </v-data-table>
    </div>
    <guide-srcview :ModelProp.sync="source03" :SrcProp="srcAll.srcInput_03" />


    <!-- //mark: Excel 양식 다운로드 -->
    <h2>{{ toplink[3] }}</h2>
    <div class="guide-card">
      <compo-excel
        TypeProp="TemplateDownload"
        :DataHeaderProp="headers"
        SheetNameProp="sheetTest"
        FileNameProp="엑셀템플릿"
        HeaderColorProp="00B0F0"
        />
    </div>
    <guide-srcview :ModelProp.sync="source04" :SrcProp="srcAll.srcInput_04" />

    <!-- //mark: Excel complex heacder 다운로드 -->
    <h2>{{ toplink[4] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <compo-excel
          TypeProp="Download"
          :DataHeaderProp="headers"
          :DataBodyProp="items2"
          :DataNumProp="SEL_DATA_NUM"
          FileNameProp="엑셀 다운로드"
          SheetNameProp="sheetDown"
        />
        <v-btn color="success" @click="downExcelComplex()">text</v-btn>
      </div>
      <v-data-table
        id="sampleTable2"
        class="pl-grid mt-2"
        :headers="headers2"
        :items="items2"
        fixed-header
        item-key="index"
        height="200px"
        :items-per-page="ROW_PER_PAGE"
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
    <guide-srcview :ModelProp.sync="source05" :SrcProp="srcAll.srcInput_05" />
  </div>
</template>

<script>
import guideJs from '@/Guide/guide.js'
import XLSX from "xlsx-color";

export default {
  name: "GuideExcel",

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
        'Excel 업로드 INPUT',
        'Excel 업로드 BUTTON',
        'Excel 다운로드',
        'Excel 양식 다운로드',
        'Excel complex header 다운로드',
      ],
      propsTable: [
        { name: 'TypeProp', type: 'String', default: '', description: 'Upload, UploadBtn, Download, TemplateDownload', required: true },
        { name: 'upload_headers', type: 'Array', default: '', description: 'Upload,UploadBtn 타입', required: true },
        { name: 'upload_bodys', type: 'Array', default: '', description: 'Upload,UploadBtn 타입', required: true },
        { name: 'DataHeaderProp', type: 'Array', default: '', description: 'Download 타입', required: true },
        { name: 'DataBodyProp', type: 'Array', default: '', description: 'Download 타입', required: true },
        { name: 'DataNumProp', type: 'String', default: '', description: '엑셀 다운로드 데이터 개수'},
        { name: 'FileNameProp', type: 'String', default: '엑셀다운로드', description: 'Download 파일명'},
        { name: 'SheetNameProp', type: 'String', default: 'sheet1', description: 'Download 시트명'},
        { name: 'HeaderColorProp', type: 'String', default: 'FFFF00', description: '첫번째 열 배경컬러("#코드 안붙임 주의")'},

      ],
      fileName: '',

      source01: null,
      source02: null,
      source03: null,
      source04: null,
      source05: null,

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<div class="guide-gap">
  <compo-excel
    TypeProp="Upload"
    :upload_headers="upload_headers"
    :upload_bodys="upload_bodys"
    @FromCompExcel="getExcelData"
  />
  <v-btn
    class="pl-btn"
    @click="upload_bodys = []">
    데이터 초기화
  </v-btn>

</div>
<v-data-table
  class="pl-grid"
  :headers="upload_headers"
  :items="upload_bodys"
  height="200px"
  :items-per-page="20"
  fixed-header
  hide-default-footer
>
</v-data-table>`
          },
          { tab: "script", content:
`export default {
  data() {
    return {
      //upload_headers는 하드코딩 필요
      upload_headers: [
        { text: '번호', value: 'index', align: 'center', width: '80px' },
        { text: '유형', value: 'type', align: 'center', width: '120px' },
        { text: '스크립트명', value: 'subject', width: '800px'},
        { text: '수정일', value: 'date', align: 'center', },
      ], //업로드 테이블 헤더
      upload_bodys: [], //업로드 테이블 바디
    }
  },
  methods: {
    getExcelData(upload_headers, upload_bodys) {
      this.upload_headers = upload_headers;
      this.upload_bodys = upload_bodys;
    },
  },
  computed: {
  },
}` },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`<div class="guide-gap">
  <v-text-field
    class="pl-form"
    v-model="fileName"
    readonly
  />
  <compo-excel
    TypeProp="UploadBtn"
    :upload_headers="upload_headers2"
    :upload_bodys="upload_bodys2"
    @FromCompExcel="getExcelData2"
  />
  <v-btn
    class="pl-btn"
    @click="upload_bodys2 = [], fileName=''">
    데이터 초기화
  </v-btn>
</div>
<v-data-table
  class="pl-grid mt-2"
  :headers="upload_headers2"
  :items="upload_bodys2"
  height="200px"
  :items-per-page="20"
  fixed-header
  hide-default-footer
>
</v-data-table>`
          },
          { tab: "script", content:
`export default {
  data() {
    return {
      //upload_headers는 하드코딩 필요
      upload_headers: [
        { text: '번호', value: 'index', align: 'center', width: '80px' },
        { text: '유형', value: 'type', align: 'center', width: '120px' },
        { text: '스크립트명', value: 'subject', width: '800px'},
        { text: '수정일', value: 'date', align: 'center', },
      ], //업로드 테이블 헤더
      upload_bodys: [], //업로드 테이블 바디
    }
  },
  methods: {
    getExcelData(upload_headers, upload_bodys) {
      this.upload_headers = upload_headers;
      this.upload_bodys = upload_bodys;
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
`<div class="guide-gap">
  <v-text-field
    class="pl-form"
    v-model="SEL_DATA_NUM"
  ></v-text-field>
  <compo-excel
    TypeProp="Download"
    :DataHeaderProp="headers"
    :DataBodyProp="items"
    :DataNumProp="SEL_DATA_NUM"
    FileNameProp="엑셀 다운로드"
    SheetNameProp="sheetDown"
  />
</div>
<v-data-table
  id="sampleTable"
  class="pl-grid mt-2"
  :headers="headers"
  :items="items"
  fixed-header
  item-key="index"
  height="200px"
  :items-per-page="ROW_PER_PAGE"
  hide-default-footer
  :page.sync="page"
  @page-count="pageCount = $event">
</v-data-table>`
          },
          { tab: "script", content:
`export default {
  data() {
    return {
      page: 1,
      pageCount: 0,
      perPage: [10,30,50],
      ROW_PER_PAGE: 10,
      headers: [
        { text: '번호', value: 'index', align: 'center', width: '80px' },
        { text: '유형', value: 'type', align: 'center', width: '120px' },
        { text: '스크립트명', value: 'subject', width: '800px'},
        { text: '수정일', value: 'date', align: 'center', },
      ],
      items: [
        { index : 1, type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
        ...
      ],
      SEL_DATA_NUM:'',
    }
  },
  methods: {
  },
  computed: {
  },
}` },
        ],
        srcInput_04: [
          {
            tab: "html",
            content:
`<compo-excel
TypeProp="TemplateDownload"
:DataHeaderProp="headers"
SheetNameProp="sheetTest"
FileNameProp="엑셀템플릿"
HeaderColorProp="00B0F0"
/>`
          },
          { tab: "script", content:
`` },
        ],
        srcInput_05: [
          {
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
      upload_headers: [
        { text: '번호', value: 'index', align: 'center', width: '80px' },
        { text: '유형', value: 'type', align: 'center', width: '120px' },
        { text: '스크립트명', value: 'subject', width: '800px'},
        { text: '수정일', value: 'date', align: 'center', },
      ], //업로드 테이블 헤더
      upload_bodys: [], //업로드 테이블 바디
      upload_headers2: [
        { text: '번호', value: 'index', align: 'center', width: '80px' },
        { text: '유형', value: 'type', align: 'center', width: '120px' },
        { text: '스크립트명', value: 'subject', width: '800px'},
        { text: '수정일', value: 'date', align: 'center', },
      ], //업로드 테이블 헤더
      upload_bodys2: [], //업로드 테이블 바디
      page: 1,
      pageCount: 0,
      perPage: [10,30,50],
      ROW_PER_PAGE: 10,
      headers: [
        { text: '번호', value: 'index', align: 'center', width: '80px' },
        { text: '유형', value: 'type', align: 'center', width: '120px' },
        { text: '스크립트명', value: 'subject', width: '800px'},
        { text: '수정일', value: 'date', align: 'center', },
      ],
      items: [
          { index : 1, type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
          { index : 2, type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
          { index : 3, type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
          { index : 4, type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
          { index : 5, type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
          { index : 6, type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
          { index : 7, type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
          { index : 8, type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
          { index : 9, type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
          { index : 10, type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
          { index : 11, type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
          { index : 12, type: '공통', subject: '취소수수료를 환불해 주세요.', contents: '카카오T택시는 고객님과 기사분을 연결해드리는 중개버시스를 제공하고 있기에 현장에서 발생한 분쟁에 관하여 직접적인 개입이 어려운 부분이 있습니다. 다만, 해당 기사님이 승객과 배차되지 않도록 “이 기사 만나지 않기” 처리를 도와드릴 수 있습니다.', date: '2020-08-05' },
      ],
      headers2: [
        { text: '번호', value: 'index', align: 'center', width: '80px' },
        { text: '대분류', value: 'type01', align: 'center' },
        { text: '중분류', value: 'type02', align: 'center' },
        { text: '소분류', value: 'type03', align: 'center' },
        { text: '스크립트명', value: 'subject'},
        { text: '수정일', value: 'date', align: 'center' },
      ],
      items2: [
        {
          index: 1,
          type01: '대분류01',
          type02: '중분류01',
          type03: '소분류01',
          subject: '취소수수료를 환불해 주세요.',
          date: '2020-08-05',
        },


      ],

      SEL_DATA_NUM:'',
    }
  },
  methods: {
    getExcelData(upload_headers, upload_bodys) {
      this.upload_headers = upload_headers;
      this.upload_bodys = upload_bodys;
    },
    getExcelData2(upload_headers, upload_bodys, fileName) {
      this.upload_headers2 = upload_headers;
      this.upload_bodys2 = upload_bodys;
      this.fileName = fileName;
    },
    downExcelComplex(){
      const tableComplexHeader = document.querySelector('#sampleTable2');
      const cloneTable = tableComplexHeader.cloneNode(true);
      const tbodyToRemove = cloneTable.querySelector('tbody');
      tbodyToRemove.remove();
      const newTable = [...this.items2];

      var excelData = XLSX.utils.table_to_sheet(
        cloneTable
      );
      var workBook = XLSX.utils.book_new(); // 새 시트 생성

      // 시트이름 설정
      XLSX.utils.book_append_sheet(workBook, excelData, this.sheet_name);
      XLSX.utils.sheet_add_json(excelData, newTable, { origin: 'A3', skipHeader: true });

      XLSX.writeFile(workBook, 'test.xlsx'); // 엑셀파일 만듬

      //엑셀 내보내기 완료 후 사용된 시트명이 있다면 초기화 한다
      if (this.sheet_name !== "") {
        this.sheet_name = "";
      }
    }
  },
  computed: {
  },
  mounted() {
    guideJs.appendHiddenLink(this.toplink);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>