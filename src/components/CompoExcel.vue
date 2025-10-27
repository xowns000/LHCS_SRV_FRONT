<template>
  <span style="display: contents">
    <!-- 업로드  -->
    <v-file-input
      v-if="TypeProp === 'Upload'"
      @change="uploadExcel"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      counter
      label="엑셀파일을 선택하세요"
      :show-size="1000"
    />
    <!-- 업로드 : 버튼 -->
    <compo-tooltip-btn
      v-if="TypeProp === 'UploadBtn'"
      TitleProp="엑셀 업로드"
      ClassProp="pl-tooltip-btn is-line"
      IconProp="pl-icon20 excelup"
      TooltipPositionProp="bottom"
      @btnClick="excelUpload(UploadHeadersProp)"
    ></compo-tooltip-btn>
    <v-file-input
      v-if="TypeProp === 'UploadBtn'"
      v-show="false"
      ref="excelRef"
      @change="uploadExcel"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      counter
      label="엑셀파일을 선택하세요"
      :show-size="1000"
    />
    <!-- 엑셀 다운로드 -->
    <compo-tooltip-btn
      v-if="TypeProp === 'Download'"
      TitleProp="엑셀 다운로드"
      :ClassProp="`pl-tooltip-btn ${ClassProp}`"
      IconProp="pl-icon20 exceldown"
      TooltipPositionProp="bottom"
      @btnClick="DownloadExcel_All_reasonChk(DataHeaderProp, DataBodyProp, FileNameProp, SheetNameProp, HeaderColorProp, DataNumProp)"
    ></compo-tooltip-btn>
    <!-- <v-btn
      v-if="TypeProp === 'Download'"
      outlined
      small
      class="btn-etc2 ml-2"
      @click="DownloadExcel_All(DataHeaderProp, DataBodyProp, FileNameProp, SheetNameProp, HeaderColorProp, DataNumProp)"
    ><v-icon class="svg-excel mr-2"></v-icon>엑셀 다운로드</v-btn> -->

    <!-- 엑셀 다운로드(채팅내역) -->
    <compo-tooltip-btn
      v-if="TypeProp === 'DownloadChat'"
      TitleProp="채팅내역 엑셀 다운로드"
      :ClassProp="`pl-tooltip-btn ${ClassProp}`"
      IconProp="pl-icon20 exceldown"
      TooltipPositionProp="bottom"
      @btnClick="downloadExcel(ChatLog)"
      :DisabledProp="DisabledProp"
    ></compo-tooltip-btn>

    <!-- 엑셀 다운로드(설문결과) -->
    <compo-tooltip-btn
      v-if="TypeProp === 'DownloadSrvyRslt'"
      TitleProp="엑셀 다운로드"
      :ClassProp="`pl-tooltip-btn ${ClassProp}`"
      IconProp="pl-icon20 exceldown"
      TooltipPositionProp="bottom"
      @btnClick="downExcelComplex(DataHeaderProp, DataBodyProp, FileNameProp, SheetNameProp, HeaderColorProp)"
      :DisabledProp="DisabledProp"
    ></compo-tooltip-btn>

    <!--엑셀 양식 다운로드 -->
    <compo-tooltip-btn
      v-if="TypeProp === 'TemplateDownload'"
      TitleProp="엑셀 양식 다운로드"
      :ClassProp="`pl-tooltip-btn ${ClassProp}`"
      IconProp="pl-icon20 exceltemplate"
      TooltipPositionProp="bottom"
      @btnClick="DownloadExcelTemplate(DataHeaderProp, FileNameProp, SheetNameProp, HeaderColorProp)"
    ></compo-tooltip-btn>
  </span>
</template>

<script>
import * as XLSX from "xlsx";
export default {
  name: "CompExcel",
  props: {
    DisabledProp:{
      type: Boolean,
      default: false
    },
    TypeProp: {
      type: String,
    },
    DataHeaderProp: {
      type: Array,
    },
    DataBodyProp: {
      type: Array,
    },
    TableIdProp: {
      type: String,
    },
    FileNameProp: {
      type: String,
      default: '엑셀다운로드'
    },
    SheetNameProp: {
      type: String,
      default: 'sheet1'
    },
    HeaderColorProp: {
      type: String,
      default: 'FFFF00'
    },
    DataNumProp: {
      type: String,
      default: ''
    },
    UploadHeadersProp: {
      type: Array,
    },
    ChatLog: {
      type: Array,
    },
    ClassProp: {
      type: String,
      default: 'is-line'
    },
    DownReason: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      upload_headers: [],
      upload_bodys: [], //업로드 테이블 바디
      downReason:'',
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /*   // 기존소스
    //엑셀 업로드
    //엑셀의 첫번째 줄이 json데이터의 key값이 되고 두번째줄이 value값이 된다
    //  No	/ 아웃바운드명	/ 총건수    <-- key
    //  1	  / 한국클라우드	/ 12        <-- value
    //  2	  / KPP         	/ 21        <-- value
    uploadExcel(file) {
      (this.upload_headers = []),
        (this.upload_bodys = []);
        // get File object from input tag
        // console.log(file);
      // const file = files[0];
      if(!file === true){ return false}
      const fileName = file.name;
      const reader = new FileReader();

      reader.onload = (e) => {
        var buffer = reader.result;
        var data = new Uint8Array(buffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i)
          arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, {
          type: "binary",
          cellDates: true,
          // dateNF: "YYYY-MM-DD HH:mm:ss",
        });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];

        var getData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        this.upload_bodys = getData;
        if (this.upload_bodys.length > 0) {
          var keys = Object.keys(this.upload_bodys[0]); //키를 가져옵니다. 이때, keys 는 반복가능한 객체가 됩니다.
          for (var a = 0; a < keys.length; a++) {
            var jsonData = {
              text: keys[a],
              value: keys[a],
            };
            this.upload_headers.push(jsonData);
          }
          this.$emit("FromCompExcel", this.upload_headers, this.upload_bodys, fileName);
        }
      };
      reader.readAsArrayBuffer(file);
    },
    */

    //헤더의 key값으로 바인딩 할 수 있게 수정함. 2023-06-05
    uploadExcel(file) {
      this.upload_bodys = [];
      if(!file === true){ return false}
      const fileName = file.name;
      const reader = new FileReader();

      reader.onload = (e) => {
        var buffer = reader.result;
        var data = new Uint8Array(buffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i)
          arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, {
          type: "binary",
          cellDates: true,
        });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];

        var getData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        if (getData.length > 0) {
          getData.map(v => {
            let map = {}
            this.upload_headers.forEach((j,i) => {
              if(j.text === Object.keys(v)[i]){
                map[j.value] = v[Object.keys(v)[i]]
              }
            })
            this.upload_bodys.push(map)
          })

          this.$emit("FromCompExcel", this.upload_headers, this.upload_bodys, fileName);
        }
      };
      reader.readAsArrayBuffer(file);
    },


    excelUpload(UploadHeadersProp) {
      this.upload_headers = UploadHeadersProp;
      this.$refs.excelRef.$refs.input.value = null //btn업로드인 경우 같은 파일 초기화가 되지 않아서 추가함. 2023-06-05
      this.$refs.excelRef.$refs.input.click()
    },
    //엑셀 템플릿 다운로드
    //v-data-table에 id를 설정한후 id와 다운받을 엑셀명과 같이 전달한다
    DownloadExcelTemplate(table_h, file_name, sheet_name, HeaderColorProp) {
      this.mixin_common_exportExcelHeader(table_h, file_name, sheet_name, HeaderColorProp);
    },
    DownloadExcel_All_reasonChk(table_h, table_b, file_name, sheet_name, HeaderColorProp, DataNumProp){
      if(this.DownReason && table_b.length > 0){
        this.showAlert({
            alertDialogToggle: true
            , downloadable: true
            , msg: '선택하신 정보를 다운로드 하시겠습니까?<br>다운로드 시 데이터 양에 따라 다소 시간이 소요 됩니다.'
            , iconClass: 'is-info'
            , type: 'confirm'
            , callYes: () => {
              let downReason = this.$store.getters['alertStore/GE_ALERT'].downReason;
              if(downReason) downReason = downReason.replace(/\s/g, '');
              
              if(this.mixin_isEmpty(downReason)){
                this.$store.getters['alertStore/GE_ALERT'].downReasonChk = true;
              }else{
                this.DownloadExcel_All(table_h, table_b, file_name, sheet_name, HeaderColorProp, DataNumProp);
              }
            }
            , callNo: () => {
              this.$store.commit("alertStore/hideAlert");
            }
        });
      }else{
        this.$store.getters['alertStore/GE_ALERT'].downReason = '';
        this.DownloadExcel_All(table_h, table_b, file_name, sheet_name, HeaderColorProp, DataNumProp);
      }
    },
    //엑셀 다운로드
    DownloadExcel_All(table_h, table_b, file_name, sheet_name, HeaderColorProp, DataNumProp) {
      this.table_head = table_h;
      this.file_name = file_name;
      this.sheet_name = sheet_name;
      this.header_color = HeaderColorProp;

      // 헤더에 없는 body filter
      let tempBodyObj = [];
      tempBodyObj = table_b.map(row=>{
        let tempBodyJson = {};
        for(let key in row){
          if(table_h.map(el=>el.value).includes(key)){
            tempBodyJson[key] = row[key];
          }
        }
        return tempBodyJson
      });

      this.table_body = DataNumProp ? table_b.slice(0,(parseInt(DataNumProp))) : tempBodyObj;

      if(table_b.length > 0) this.mixin_common_exportExcel_all(this.table_head, this.table_body, this.file_name, this.sheet_name, this.header_color);
    },

    //채팅 엑셀 다운로드
    downloadExcel(history){
      var filename = "고객_채팅내역";
      this.showAlert({
          alertDialogToggle: true
          , downloadable: true
          , msg: '선택하신 정보를 다운로드 하시겠습니까?<br>다운로드 시 데이터 양에 따라 다소 시간이 소요 됩니다.'
          , iconClass: 'is-info'
          , type: 'confirm'
          , callYes: () => {
            let downReason = this.$store.getters['alertStore/GE_ALERT'].downReason;
            if(downReason) downReason = downReason.replace(/\s/g, '');
            
            if(this.mixin_isEmpty(downReason)){
              this.$store.getters['alertStore/GE_ALERT'].downReasonChk = true;
            }else{
              this.mixin_chat_exportExcel(history, filename);
            }
          }
          , callNo: () => {
            this.$store.commit("alertStore/hideAlert");
          }
      });
    },
    downExcelComplex(table_h, table_b, file_name, sheet_name, HeaderColorProp){
      this.table_head = table_h;
      this.table_body = table_b;
      this.file_name = file_name;
      this.sheet_name = sheet_name;
      this.header_color = HeaderColorProp;

      this.showAlert({
        alertDialogToggle: true
        , downloadable: true
        , msg: '선택하신 정보를 다운로드 하시겠습니까?<br>다운로드 시 데이터 양에 따라 다소 시간이 소요 됩니다.'
        , iconClass: 'is-info'
        , type: 'confirm'
        , callYes: () => {
          let downReason = this.$store.getters['alertStore/GE_ALERT'].downReason;
          if(downReason) downReason = downReason.replace(/\s/g, '');

          if(this.mixin_isEmpty(downReason)){
            this.$store.getters['alertStore/GE_ALERT'].downReasonChk = true;
          }else{
            this.mixin_srvy_exportExcel(this.table_head, this.table_body, this.file_name, this.sheet_name, this.header_color);
          }
        }
        , callNo: () => {
          this.$store.commit("alertStore/hideAlert");
        }
      });

    }
  },
  activated() {},
  deactivated() {},
  destroyed() {},
};
</script>

<style scoped>
.preview-excel-upload-code {
  padding: 10px 15px;
}
</style>
