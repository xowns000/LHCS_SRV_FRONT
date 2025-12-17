import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
// import XLSX from "xlsx";
import XLSX from "xlsx-color";
import api from "../store/apiUtil.js";
import apiChat from "../store/apiChatParamUtil.js";
import apiSmsAlrim from "../store/apiSmsAlrim.js";
import apiChatGPT from "../store/apiChatGPTUtil.js";
import axios from "axios";
import moment from "moment";
import { eventBus } from "@/store/eventBus.js";
import editorConfig from './ckEditorConfig';
import tuiGridConfig from './tuiGridConfig';
import vueDropConfig from './vueDropConfig';
import vueDropConfigFile from './vueDropConfigFile';

import { setMenu } from '@/router/index.js';

class ConvertDate {
  constructor(date){
    this.date = date;
  }

  zf(len){
    this.date = this.date.toString();
    return this.rezf(len);
  }

  rezf(len){
    return this.date.length<2?"0"+ this.date:this.date;
  }

  string(len){
    let s = '', i = 0; while (i++ < len) { s += this.date; } return s;
  }
}

export const mixin = {
  data() {
    return {
      default_tab: [
        {
          id: "home",
          title: "홈",
          default: "Y",
          icon: "svg-tab-home",
          link: "/home",
        },
      ],
      table_id: "",
      file_name: "",
      sheet_name: "",
      header_color: '',
      excel_template_headers: {},
      excel_template_bodys: {},
      excel_template_sheet_header: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "AA",
        "AB",
        "AC",
        "AD",
        "AE",
        "AF",
        "AG",
        "AH",
        "AI",
        "AJ",
        "AK",
        "AL",
        "AM",
        "AN",
        "AO",
        "AP",
        "AQ",
        "AR",
        "AS",
        "AT",
        "AU",
        "AV",
        "AW",
        "AX",
        "AY",
        "AZ",
      ],

      /**
       * 챗관련 추가 Start_Arthur.Kim
       */
      talkStatObjs : [
          {TALK_STAT_CD:'11',TALK_STAT_NM:'대기중',TALK_STAT_NM_TITLE:'대기중',CALSS:'bg-green'}
        , {TALK_STAT_CD:'13',TALK_STAT_NM:'호전환',TALK_STAT_NM_TITLE:'호전환',CALSS:'bg-cyan'}
        , {TALK_STAT_CD:'14',TALK_STAT_NM:'전달완료',TALK_STAT_NM_TITLE:'전달완료',CALSS:'bg-blueGrey'}
        , {TALK_STAT_CD:'12',TALK_STAT_NM:'상담중',TALK_STAT_NM_TITLE:'상담중',CALSS:'bg-blue'}
        , {TALK_STAT_CD:'20',TALK_STAT_NM:'후처리',TALK_STAT_NM_TITLE:'후처리',CALSS:'bg-blueGrey'}
        , {TALK_STAT_CD:'22',TALK_STAT_NM:'후처리',TALK_STAT_NM_TITLE:'후처리',CALSS:'bg-blueGrey'}
        , {TALK_STAT_CD:'12',TALK_STAT_NM:'',TALK_STAT_NM_TITLE:'중지',SYSMSG_SKIP_YN:'Y',CALSS:'tt-icon-pause'}
        , {TALK_STAT_CD:'21',TALK_STAT_NM:'상담완료',TALK_STAT_NM_TITLE:'상담완료'}
        , {TALK_STAT_CD:'12',TALK_STAT_NM:'콜백',TALK_STAT_NM_TITLE:'콜백',EXEC_RST_CD:'4'}
        , {TALK_STAT_CD:'20',TALK_STAT_NM:'후처리',TALK_STAT_NM_TITLE:'후처리',EXEC_RST_CD:'4'}
      ],

      channels : [],  // 채널 ( 카카오/티톡 )


      /**
      * 챗관련 추가 End_Arthur.Kim
      */

      /**
       * 퍼블 : UI 공통
       */
      windowPopup: null,
      dialogOmniOne : false, //OmniOne 간편인증 dialog
      searchDeatilToggle : false,
      editorConfig: editorConfig,
      tuiGridConfig: tuiGridConfig,
      vueDropConfig: vueDropConfig,
      vueDropConfigFile: vueDropConfigFile,
      isDevelopment: process.env.VUE_APP_ENV === 'local' || process.env.VUE_APP_ENV === 'devserver',
      isProduction: (process.env.VUE_APP_ENV === 'production')? true : false,

      MESSAGE : {
        CONFIRM : {
        },
        ALERT : {
          SEND_SUCCESS : {alertDialogToggle: true, msg: '전송에 성공하였습니다.', iconClass: 'is-info', type: 'default'}
          , SEND_FAIL : {alertDialogToggle: true, msg: '전송에 실패하였습니다.', iconClass: 'is-caution', type: 'default'}
          , ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
          , OVER_BYTE : {alertDialogToggle: true, msg: '문자 내용이 90byte를 초과합니다.', iconClass: 'is-caution', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
          , JWT : {alertDialogToggle: true, msg: '인증정보가 만료되었습니다.<br>로그인후에 다시 이용해 주세요.', iconClass: 'is-caution', type: 'default'}
          , JWT_SIGNATURE : {alertDialogToggle: true, msg: '인증정보가 변조되었습니다.<br>로그인후에 다시 이용해 주세요.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST : {
          SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 },
          SEND_SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 },
          ERROR : { msg: '시스템 장애가 발생 하였습니다.', class: 'warning', hasToastIcon: true, icon: 'mdi-close-circle' }
        },
      },

    };
  },
  mounted() {},
  destroy() {},
  computed: {
    ...mapState({
      stateToken: "authStore/token",
    }),
    ...mapGetters({
      progress_bar: "commonStore/GE_COMMON_PROGRESS_BAR",
      user_id: "userStore/GE_USER_ID",
      tabs: "commonStore/GE_COMMON_TAB",
      // active_tab_num: "commonStore/GE_COMMON_ACTIVE_TAB_NUM",
      no_cash_tab: "commonStore/GE_COMMON_NO_CASH_TAB",
      active_tab_id: "commonStore/GE_COMMON_ACTIVE_TAB_ID",
      active_tab_title: "commonStore/GE_COMMON_ACTIVE_TAB_TITLE",
      help_dialog: "commonStore/GE_COMMON_HELP_DIALOG",
      help_dialog_id: "commonStore/GE_COMMON_HELP_DIALOG_ID",
      user_menu: "userStore/GE_USER_MENU",
      user_menu_dev: "userStore/GE_DEV_MENU",
      user_menu_left: "userStore/GE_LEFT_MENU",
      user_menu_right: "userStore/GE_RIGHT_MENU",
      user_role: "userStore/GE_USER_ROLE",
      user_name: "userStore/GE_USER_NAME",
      ext_no: "userStore/GE_USER_EXT_NO", //내선번호
      pds_ext_no: "userStore/GE_USER_PDS_EXT_NO", //PDS 내선번호
      ip_addr: "userStore/GE_USER_IP_ADDR", //아이피주소
      cust_list: "userStore/GE_USER_COMPANY",
      page_path: "commonStore/GE_COMMON_PAGE_PATH",// breadcrumb
      ognz_list: "commonStore/GE_COMMON_OGNZ_LIST",// 부서 셀렉트박스
    }),
    /**
     * 퍼블 : UI 공통
     */
    computedSearchToggleClass() {
      return this.searchDeatilToggle === true ? 'pl-icon20 arrow-down' : 'pl-icon20 arrow-up'
    },
  },
  methods: {
    //CKEditor 기타공통설정 등 외부 플러그인 주입용도.
    mixin_CKEDITOR_plugins_addExternal( CKEDITOR ) {
      CKEDITOR.config.enterMode = CKEDITOR.ENTER_BR;
      CKEDITOR.config.shiftEnterMode  = CKEDITOR.ENTER_P;

      CKEDITOR.plugins.addExternal( 'colordialog', '/ckeditor/plugins/colordialog/plugin.js');
      CKEDITOR.plugins.addExternal( 'tableresize', '/ckeditor/plugins/tableresize/plugin.js');
      CKEDITOR.plugins.addExternal( 'dragresize', '/ckeditor/plugins/dragresize/plugin.js');
      CKEDITOR.plugins.addExternal( 'simpleImageUpload', '/ckeditor/plugins/simpleImageUpload/plugin.js');

      CKEDITOR.on('instanceReady', function (event) {

        //Drag insert image || paste image 처리.
        event.editor.on('fileUploadResponse', function (evt) {
          // console.log( evt.data.fileLoader );
          if( evt.data.fileLoader ) {
            var done = evt.data.fileLoader;
            var ele = event.editor.document.createElement('img');
            ele.setAttribute('src', done.data );
            ele.setAttribute('data-cke-upload-id', '0' );
            ele.setAttribute('data-widget', 'uploadimage' );
            event.editor.insertElement(ele);
          }
        });

        // event.editor.on('change', function (evt) {
        //     console.log( "<p>" + evt.editor.getData() +"</p>" );
        //     Array.from( new DOMParser().parseFromString( evt.editor.getData(), 'text/html' )
        //         .querySelectorAll( 'img' ) )
        //         .map( img => img.getAttribute( 'src' ) )
        //   });
      });

      // CKEDITOR.on('instanceReady', function (event) {
      //   event.editor.on('paste', function (pasteEvent) {
      //     var items = pasteEvent.data.dataValue;
      //     console.log(JSON.stringify(items));
      //   });
      // });

    },

    // 챗팅 상담상태명_Arthur.Kim
    mixin_get_talk_statnm (cutt_stts_cd, resultCd, sysMsgSkipYn)   {

      //console.log("cutt_stts_cd ::: " + cutt_stts_cd);
      //console.log("resultCd ::: " + resultCd);
      //console.log("sysMsgSkipYn ::: " + sysMsgSkipYn);

      let obj = _.find(this.talkStatObjs, {'TALK_STAT_CD': cutt_stts_cd});

      if( cutt_stts_cd == '12' && sysMsgSkipYn == 'Y' ) {
        obj = _.find(this.talkStatObjs, { 'TALK_STAT_CD': cutt_stts_cd, 'SYSMSG_SKIP_YN':sysMsgSkipYn });
      } else if( resultCd != null && resultCd == '4' ) {
        obj = _.find(this.talkStatObjs, { 'TALK_STAT_CD': cutt_stts_cd, 'EXEC_RST_CD': resultCd });
      }

      return obj != null ? obj.TALK_STAT_NM : '미등록상태';
    },

    mixin_set_active_tab(item) {
      if (item.PATH_NM) {
        this.$store.dispatch("commonStore/AC_COMMON_ACTIVE_TAB", {
          id: item.PATH_NM.replace("/", ""),
          title: item.NODE_TITLE,
          default: "N",
          tabIcon: "",
          link: item.PATH_NM,
          FULL_PATH: item.FULL_PATH,
          MENU_EXPLN: item.MENU_EXPLN,
          AUTO_CARRY_OUT: item.AUTO_CARRY_OUT,
        });
        let pageInfo = {TITLE:item.NODE_TITLE,EXPLN:item.MENU_EXPLN,PATH:item.FULL_PATH};
        this.$store.commit("commonStore/MU_COMMON_PAGE_PATH", pageInfo);
      }
    },

    //엑셀 양식 다운로드
    mixin_common_exportExcelHeader(table_h, file_name, sheet_name, header_color) {
      const headers = Object.values(table_h);
      let title = headers.map(h => h.text);
      
      let wsHead = headers.map(h => ({
        wch : !h.width ? h.text.length * 2 + 2: parseInt(h.width.replace('px', ''))/10
      }));
      let newTable = [title];
      
      //설문 엑셀 양식은 1만줄까지 텍스트 서식을 적용하기 위해 5만 라인의 빈 값을 생성.(다운로드 시 약 5초 소요)
      if(file_name == '설문조사_업로드_템플릿') {
        let emptyData = headers.map(h => '');
        for(let i = 1; i < 50000; i ++) {
          newTable[i] = emptyData;
        }
      }
      
      // 새 시트 생성
      const workBook = XLSX.utils.book_new();
      const excelData = XLSX.utils.json_to_sheet(newTable,{ skipHeader: true, defval:"" });
      excelData['!cols'] = wsHead;
      
      if(file_name == '설문조사_업로드_템플릿') {
        Object.keys(excelData).forEach((cell) => {
          if (cell[0] === '!') return; // 스킵 메타데이터 셀
          excelData[cell].z = '@'; // 텍스트 서식 설정
        });
      }

      // 시트이름 설정
      XLSX.utils.book_append_sheet(workBook, excelData, sheet_name);

      headers.forEach((_, i) => {
        workBook.Sheets[sheet_name][`${this.excel_template_sheet_header[i]}1`].s = {
          fill: { patternType: 'solid', fgColor: { rgb: header_color }}
        };
      });

      // 엑셀파일 만듬
      XLSX.writeFile(workBook, `${file_name}.xlsx`);

      //엑셀 내보내기 완료 후 사용된 시트명이 있다면 초기화 한다
      this.sheet_name = "";
    },

    //엑셀 다운로드
    mixin_common_exportExcel_all() {
      // 테이블 바디 복사
      const newTable = [...this.table_body];
      const newTableHeader = this.table_head;
      const headers = Object.values(newTableHeader);
      //테이블 바디에서 테이블 헤더 value와의 차이, 엑셀 col차이 구하기 위한 값
      let differLenth = Object.keys(newTable[0]).length - newTableHeader.length;

      const title = {};
      newTableHeader.forEach(el => {
        title[el.value] = el.text;
      });
      const wsHead = newTableHeader.map(h => ({
        wch: h.width ? parseInt(h.width.replace('px', ''))/10 : h.text.length * 2 + 2
      }));

      // 헤더 생성
      newTable.unshift(title);

      var workBook = XLSX.utils.book_new(); // 새 시트 생성
      var excelData = XLSX.utils.json_to_sheet( newTable );
      excelData['!cols'] = wsHead;

      //기본 테이블 헤더라인 삭제하고 A2라인부터 엑셀 draw
      XLSX.utils.sheet_add_json(excelData, newTable, { origin: 'A2', skipHeader: true });

      //table_head 기준으로 추가되는 cols를 지움
      if(differLenth!=0) delete_cols(excelData, newTableHeader.length , differLenth);
      // table 첫줄 삭제( 헤더 추가되며 한줄씩 밀려서)
      delete_row(excelData, 0);

      // 시트이름 설정
      XLSX.utils.book_append_sheet(workBook, excelData, this.sheet_name);

      headers.forEach((_, i) => {
        workBook.Sheets[this.sheet_name][`${this.excel_template_sheet_header[i]}1`].s = {
          fill: { patternType: 'solid', fgColor: { rgb: this.header_color }}
        };
      });
      XLSX.writeFile(workBook, `${this.file_name}.xlsx`); // 엑셀파일 만듬

      //엑셀 내보내기 완료 후 사용된 시트명이 있다면 초기화 한다
      this.sheet_name = "";

      // delete a specific row
      function ec(r, c){
        return XLSX.utils.encode_cell({r:r,c:c});
      }
      function delete_row(ws, row_index){
        var variable = XLSX.utils.decode_range(ws["!ref"])
        for(var R = row_index; R < variable.e.r; ++R){
            for(var C = variable.s.c; C <= variable.e.c; ++C){
                ws[ec(R,C)] = ws[ec(R+1,C)];
            }
        }
        variable.e.r--
        ws['!ref'] = XLSX.utils.encode_range(variable.s, variable.e);
      }

      // func xslx delete col
      function clamp_range(range) {
        if(range.e.r >= (1<<20)) range.e.r = (1<<20)-1;
        if(range.e.c >= (1<<14)) range.e.c = (1<<14)-1;
        return range;
      }

      var crefregex = /(^|[^._A-Z0-9])([$]?)([A-Z]{1,2}|[A-W][A-Z]{2}|X[A-E][A-Z]|XF[A-D])([$]?)([1-9]\d{0,5}|10[0-3]\d{4}|104[0-7]\d{3}|1048[0-4]\d{2}|10485[0-6]\d|104857[0-6])(?![_.\(A-Za-z0-9])/g;

      /*
      deletes `ncols` cols STARTING WITH `start_col`
      usage: delete_cols(ws, 4, 3); // deletes columns E-G and shifts everything after G to the left by 3 columns
      */
      function delete_cols(ws, start_col, ncols) {
        if(!ws) throw new Error("operation expects a worksheet");
        var dense = Array.isArray(ws);
        if(!ncols) ncols = 1;
        if(!start_col) start_col = 0;

        /* extract original range */
        var range = XLSX.utils.decode_range(ws["!ref"]);
        var R = 0, C = 0;

        var formula_cb = function($0, $1, $2, $3, $4, $5) {
          var _R = XLSX.utils.decode_row($5), _C = XLSX.utils.decode_col($3);
          if(_C >= start_col) {
            _C -= ncols;
            if(_C < start_col) return "#REF!";
          }
          return $1+($2=="$" ? $2+$3 : XLSX.utils.encode_col(_C))+($4=="$" ? $4+$5 : XLSX.utils.encode_row(_R));
        };

        var addr, naddr;
        for(C = start_col + ncols; C <= range.e.c; ++C) {
          for(R = range.s.r; R <= range.e.r; ++R) {
            addr = XLSX.utils.encode_cell({r:R, c:C});
            naddr = XLSX.utils.encode_cell({r:R, c:C - ncols});
            if(!ws[addr]) { delete ws[naddr]; continue; }
            if(ws[addr].f) ws[addr].f = ws[addr].f.replace(crefregex, formula_cb);
            ws[naddr] = ws[addr];
          }
        }
        for(C = range.e.c; C > range.e.c - ncols; --C) {
          for(R = range.s.r; R <= range.e.r; ++R) {
            addr = XLSX.utils.encode_cell({r:R, c:C});
            delete ws[addr];
          }
        }
        for(C = 0; C < start_col; ++C) {
          for(R = range.s.r; R <= range.e.r; ++R) {
            addr = XLSX.utils.encode_cell({r:R, c:C});
            if(ws[addr] && ws[addr].f) ws[addr].f = ws[addr].f.replace(crefregex, formula_cb);
          }
        }

        /* write new range */
        range.e.c -= ncols;
        if(range.e.c < range.s.c) range.e.c = range.s.c;
        ws["!ref"] = XLSX.utils.encode_range(clamp_range(range));

        /* merge cells */
        if(ws["!merges"]) ws["!merges"].forEach(function(merge, idx) {
          var mergerange;
          switch(typeof merge) {
            case 'string': mergerange = XLSX.utils.decode_range(merge); break;
            case 'object': mergerange = merge; break;
            default: throw new Error("Unexpected merge ref " + merge);
          }
          if(mergerange.s.c >= start_col) {
            mergerange.s.c = Math.max(mergerange.s.c - ncols, start_col);
            if(mergerange.e.c < start_col + ncols) { delete ws["!merges"][idx]; return; }
            mergerange.e.c -= ncols;
            if(mergerange.e.c < mergerange.s.c) { delete ws["!merges"][idx]; return; }
          } else if(mergerange.e.c >= start_col) mergerange.e.c = Math.max(mergerange.e.c - ncols, start_col);
          clamp_range(mergerange);
          ws["!merges"][idx] = mergerange;
        });
        if(ws["!merges"]) ws["!merges"] = ws["!merges"].filter(function(x) { return !!x; });

        /* cols */
        if(ws["!cols"]) ws["!cols"].splice(start_col, ncols);
      }

      this.mixin_prvcInqLog('LIST_EXCEL_DOWN', {FILE_NM : this.file_name, DOWN_REASON : this.$store.getters['alertStore/GE_ALERT'].downReason});
      this.$store.commit("alertStore/hideAlert");
    },
    async common_getAspDataS(userId) {
      let requestData = {
        headers: {},
        sendData: {},
      };
      // header 세팅
      requestData.headers["URL"] = "api/code/common/code-book/aspinqry";
      requestData.headers["SERVICE"] = "code.common.code-book.sender";
      requestData.headers["METHOD"] = "aspinqry";
      requestData.headers["TYPE"] = "BIZ_SERVICE";
      requestData.headers["ASYNC"] = false;

      // sendData 세팅
      requestData.sendData["ASP_USER_ID"] = userId;
      let response = await this.common_postCall_noPB(requestData);
      return response;
    },
    //페이지에서 사용하는 코드셋을 API로 호출
    async mixin_common_code_get_all(group_cd, use_yn) {
      var responseData = [];
      await api
        .post(
          "api/code/common/code-book/inqry",
          {
            GROUP_CD_ID: group_cd,
            USE_YN: use_yn,
          },
          {
            head: {
              SERVICE: "code.common.code-book.inqry",
              METHOD: "inqry",
              TYPE: "BIZ_SERVICE",
            },
          }
        )
        .then((response) => {
          if (response.data) {
            for (var i = 0; i < group_cd.length; i++) {
              if (response.data[group_cd[i]]) {
                // if (response.data[key] !== undefined) {
                var key = group_cd[i];
                var jasonData = {};
                jasonData["group_cd"] = key;
                jasonData["group_value"] = response.data[key];
                responseData.push(jasonData);
                // }
              }
            }
          }
        })
        .catch((error) => {});
      // console.log("#### [mixins][common_code] responseData=", responseData);
      return responseData;
    },

    //페이지에서 호출되어 있는 코드셋에서 하나의 그룹코드를 필터하여 가져온다
    mixin_common_code_get(all_code, group_cd, strHeadText) {
      var responseData = [];

      if (strHeadText != "" && strHeadText != undefined) {
        responseData.push({ text: strHeadText, value: "" });
      }

      if (all_code && typeof all_code === "object") {
        for (var i = 0; i < all_code.length; i++) {
          if (all_code[i].group_cd === group_cd) {
            for (var a = 0; a < all_code[i].group_value.length; a++) {
              responseData.push({
                text: this.mixin_decode(all_code[i].group_value[a].CD_NM), //공통코드명 특수문자 decode
                value: all_code[i].group_value[a].CD,
                cd_vl: all_code[i].group_value[a].CD_VL,
                info1: all_code[i].group_value[a].ETC_INFO01,
                info2: all_code[i].group_value[a].ETC_INFO02,
                info3: all_code[i].group_value[a].ETC_INFO03,
              });
            }
          }
        }
      }
      return responseData;
    },

    mixin_getAspAuth() {
      api
        .post(
          "api/palette-main/myAuth/inqire", //api url입력
          {
            USER_ID: this.$store.getters['userStore/GE_USER_ROLE'].userId,
          },
          {
            head: {
              SERVICE: "api.palette-main.auth",
              METHOD: "inqire",
              TYPE: "BIZ_SERVICE",
            },
          }
        )
        .then((response) => {
          return response.data.DATA;
        })
        .catch((err) => {
          // alert(err);
          this.MESSAGE.ERROR.ERROR.msg = err;
          this.showAlert(this.MESSAGE.ERROR.ERROR);
        });
    },
    //페이지별 버튼권한 조회
    async mixin_common_button_auth(menu_id) {
      var responseData = [];
      await api
        .post(
          "api/setting/system/menu-author-manage/menu-button-author/inqire",
          {
            USER_ID: this.$store.getters["userStore/GE_USER_ID"],
            MENU_ID: menu_id,
            GROUP_CD: "TWB007", //고정코드(공통코드)
          }
        )
        .then((response) => {
          //console.log(
            //"#### [mixins][mixin_common_button_auth] response=",
            //response
          //);
        })
        .catch((error) => {});
      // console.log("#### [mixins][common_code] responseData=", responseData);
      return responseData;
    },
    //문의유형 코드 조회
    async mixin_inqry_code_get(asp_newcust_key, spst_inqry_typ_cd) {
      var responseData = [];
      await api
        .post("chat-api/setting/inqry-ty-manage/list", {
          ASP_NEWCUST_KEY: asp_newcust_key,
          SPST_INQRY_TYP_CD: spst_inqry_typ_cd,
          USE_YN: "Y", //고정코드
        })
        .then((response) => {
          if (response.data) {
            responseData = response.data["DATA"];
          }
        })
        .catch((error) => {});
      // console.log("#### [mixins][common_code] responseData=", responseData);
      return responseData;
    },
    //상담유형 코드 조회
    async mixin_counsel_type_code_get(
      asp_newcust_key,
      spst_cnsl_typ_cd,
      strHeadText
    ) {
      var responseData = [];
      await api
        .post("api/setting/consulttype/manage/inqire", {
          ASP_NEWCUST_KEY: asp_newcust_key,
          SPST_CNSL_TYP_CD: spst_cnsl_typ_cd,
          USE_YN: "Y", //고정코드
        })
        .then((response) => {
          if (response.data) {
            responseData = response.data["DATA"];

            if (strHeadText != "" && strHeadText != undefined) {
              responseData.unshift({ CD_NM: strHeadText, CD: "" });
            }
          }
        })
        .catch((error) => {});
      // console.log("#### [mixins][common_code] responseData=", responseData);
      return responseData;
    },
    //사용자소속 코드 조회
    async mixin_attr_get(asp_newcust_key, attr_cd, default_text) {
      var responseData = [];
      await api
        .post("api/palette/common/get-attr-div/list", {
          ASP_NEWCUST_KEY: asp_newcust_key,
          ATTR_CD: attr_cd,
          ATTR_DIV_CD: "", //고정코드
        })
        .then((response) => {
          if (response.data) {
            responseData = response.data["DATA"];
            if (
              default_text != null &&
              default_text != "" &&
              default_text != undefined
            ) {
              let default_obj = {
                CD_NM: default_text,
                CD: "",
              };
              responseData.splice(0, 0, default_obj);
            }
          }
        })
        .catch((error) => {});
      // console.log("#### [mixins][common_code] responseData=", responseData);
      return responseData;
    },
    //API 파라미터 에러 체크
    mixin_check_repsonse(response) {
      let return_data = true;
      if (response.error.flag && response.error.flag === true) {
        return_data = false;
        //var errorMsg = '로그인을 실패하였습니다.';
        //var errorMsg = 'response.error.msg.replace('Invalid username or password :::', '로그인을 실패하였습니다.')';
        //if( response.error.msg.split(":::")[1] ) {
        //  errorMsg = errorMsg + "("+ response.error.msg.split(":::")[1] +"/5)";
        //}
        var errorMsg = '로그인을 실패하였습니다.';
        if( response.error.msg == "Account Locked :::" ) errorMsg = "계정이 잠겼습니다. 관리자에게 문의하세요."
        this.MESSAGE.TOAST.ERROR.msg = errorMsg;
        this.showToast(this.MESSAGE.TOAST.ERROR);
      }
      return return_data;
    },
    //채팅채널 조회
    async mixin_channel_get(asp_cust_key) {
      // console.log("#### [mixin_channel_get] asp_cust_key=", asp_cust_key);
      var responseData = [];
      await api
        .post(
          "chat-api/main/sender-key/inqire", //api url입력
          {
            ASP_NEWCUST_KEY: asp_cust_key,
          },
          {
            head: {
              SERVICE: "code.common.code-book",
              METHOD: "inqire",
              TYPE: "BIZ_SERVICE",
            },
          }
        )
        .then((response) => {
          responseData = response.data.DATA;
        })
        .catch((err) => {
          // alert(err);
          this.MESSAGE.ERROR.ERROR.msg = err;
          this.showAlert(this.MESSAGE.ERROR.ERROR);
        });

      return responseData;
    },
    //모든 기업 계정관리의 ASP_CUST를 가져와 시스템 관리자의 콤보 박스로 사용
    async mixin_getAllAspData() {
      // console.log("#### [mixin_getAllAspData]");
      var responseData = [];
      await api
        .post(
          "/api/code/common/code-book/allaspinqry", //api url입력
          {},
          {
            head: {
              SERVICE: "code.common.code-book",
              METHOD: "allaspinqry",
              TYPE: "BIZ_SERVICE",
            },
          }
        )
        .then((response) => {
          // console.log(response.data.DATA);
          responseData = response.data["DATA"];
        })
        .catch((err) => {
          // alert(err);
          this.MESSAGE.ERROR.ERROR.msg = err;
          this.showAlert(this.MESSAGE.ERROR.ERROR);
        });

      return responseData;
    },
    //사용자 권한 콤보박스 생성
    async mixin_user_auth_get(default_text) {
      var responseData = [];
      let authList = [];
      await api
        .post(
          "api/palette-main/auth/inqire", //api url입력
          {
            userId: this.user_id,
          },
          {
            head: {
              SERVICE: "api.palette-main.auth",
              METHOD: "inqire",
              TYPE: "BIZ_SERVICE",
            },
          }
        )
        .then((response) => {
          responseData = response.data["DATA"];
          for(let i=0;i<responseData.length;i++){
            if(responseData[i].ASP_CUST_KEY==''||responseData[i].ASP_CUST_KEY==null||responseData[i].ASP_CUST_KEY==undefined){
              authList=authList.concat(responseData[i]);
            } else {
              for(let n=0;n<this.$store.getters["userStore/GE_USER_ROLE"].company_list.length;n++){
                if(this.$store.getters["userStore/GE_USER_ROLE"].company_list[n].CD == responseData[i].ASP_CUST_KEY){
                  authList=authList.concat(responseData[i]);
                }
              }
            }
          }
          if (
            default_text != null &&
            default_text != "" &&
            default_text != undefined
          ) {
            let default_obj = {
              NM: default_text,
              CD: "",
            };
            authList.splice(0, 0, default_obj);
          }
        })
        .catch((err) => {
          console.log(err);
          this.MESSAGE.ERROR.ERROR.msg = err;
          this.showAlert(this.MESSAGE.ERROR.ERROR);
        });

      return authList;
    },

    /**
     * 공통 postCall
     * requestData를 선언하여 헤더와 sendData를 세팅 후 전달하면 결과를 리턴해준다.
     * 함수 선언시 async 사용.
     * ex)
     * async getList(){
     *     requestData = {
     *             headers: {},
     *             sendData:{},
     *           };
     *     // header 세팅
     *     requestData.headers["URL"] = "/chat-api/setting/message-manage/rcept-delay/inqire";
     *     requestData.headers["SERVICE"] = "chat.setting.message-manage.rcept-delay";
     *     requestData.headers["METHOD"] = "inqire";
     *     requestData.headers["TYPE"] = "BIZ_SERVICE";
     *     requestData.headers["ASYNC"] = false;
     *
     *     // sendData 세팅
     *     requestData.sendData["MSG_CL"] = this.aspNewcustKey;
     *     requestData.sendData["SYSTEM_MSG_ID"] = this.aspNewcustKey;
     *     requestData.sendData["ASP_NEWCUST_KEY"] = this.aspNewcustKey;
     *
     *     // 결과 리턴
     *     let response = await this.common_postCall_noPB(requestData);
     *     console.log(response);
     * }
     *
     * @param requestData
     * @returns {Promise<{}>}
     */

    async common_postCall(sUrl, postParam, headParam) {
      let responseData = {};
      if(!postParam) postParam = {};

      await api
        .post(
          sUrl, //api url입력
          postParam,
          headParam
        ) //api에 로그를 남기기위한 값입력 (필수) (SERVICE, METHOD, TYPE)
        .then((response) => {
          responseData = response.data;
        }) //api 호출 성공 이후 수행
        .catch((err) => {
          try{
            if (err.response.status == 401) { //인증정보만료.
              this.showAlert(this.MESSAGE.ERROR.JWT);
            }else if (err.response.status == 500 && (err.response.data.exception.indexOf("security.SignatureException") > -1) ) {
              this.showAlert(this.MESSAGE.ERROR.JWT_SIGNATURE);
            }
          }catch(e){
            this.showAlert(this.MESSAGE.ERROR.ERROR);
          }

          responseData.HEADER = {}
          responseData.HEADER.ERROR_FLAG = true;

        }); //api호출 에러 작업 수행
      return responseData;
      //결과값 보여주기
    },

    async common_postCall_SMS(requestData) {
      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
      let responseData = {};
      let requestUrl = requestData.headers.URL;
      // HEADER[URL] 중복 제거
      delete requestData.headers.URL;

      await apiSmsAlrim
        .post(
          requestUrl, //api url입력
          requestData.sendData,
          { head: requestData.headers }
        ) //api에 로그를 남기기위한 값입력 (필수) (SERVICE, METHOD, TYPE)
        .then((response) => {
          responseData = response.data;
        }) //api 호출 성공 이후 수행
        .catch((err) => {
          // this.common_alert(err);
          this.MESSAGE.ERROR.ERROR.msg = err;
          this.showAlert(this.MESSAGE.ERROR.ERROR);
        }); //api호출 에러 작업 수행
      return responseData;
      //결과값 보여주기
    },

    /**
     * 공통 postCall - PROGRESS_BAR 제거
     *
     * 기본적으로 공통 postCall과 완전 동일하지만
     * 한 페이지 내에서 postCall을 여러개 불러올 경우
     * PROGRESS_BAR때문에 화면이 깜빡거리게 되는경우가 생김
     * 이를 막기위해 이 코드를 사용
     *
     * @param requestData
     * @returns {Promise<{}>}
     */

     async common_postCall_noPB(requestData) {
      let responseData = {};
      let requestUrl = requestData.headers.URL;
      // HEADER[URL] 중복 제거
      delete requestData.headers.URL;

      await api
        .post(
          requestUrl, //api url입력
          requestData.sendData,
          { head: requestData.headers }
        ) //api에 로그를 남기기위한 값입력 (필수) (SERVICE, METHOD, TYPE)
        .then((response) => {
          responseData = response.data;
        }) //api 호출 성공 이후 수행
        .catch((err) => {
          // this.common_alert(err);
          this.MESSAGE.ERROR.ERROR.msg = err;
          try{
            if (err.response.status == 401) { //인증정보만료.
              this.showAlert(this.MESSAGE.ERROR.JWT);
            }else if (err.response.status == 500 && (err.response.data.exception.indexOf("security.SignatureException") > -1) ) {
              this.showAlert(this.MESSAGE.ERROR.JWT_SIGNATURE);
            }
          }catch(e){
            this.showAlert(this.MESSAGE.ERROR.ERROR);
          }
        }); //api호출 에러 작업 수행
      return responseData;
      //결과값 보여주기
    },

    /**
     * 공통 postCall
     * requestData를 선언하여 헤더와 sendData를 세팅 후 전달하면 결과를 리턴해준다.
     * 함수 선언시 async 사용.
     * ex)
     * async getList(){
     *     requestData = {
     *             headers: {},
     *             sendData:{},
     *           };
     *     // header 세팅
     *     requestData.headers["URL"] = "/chat-api/setting/message-manage/rcept-delay/inqire";
     *     requestData.headers["SERVICE"] = "chat.setting.message-manage.rcept-delay";
     *     requestData.headers["METHOD"] = "inqire";
     *     requestData.headers["TYPE"] = "BIZ_SERVICE";
     *     requestData.headers["ASYNC"] = false;
     *
     *     // sendData 세팅
     *     requestData.sendData["MSG_CL"] = this.aspNewcustKey;
     *     requestData.sendData["SYSTEM_MSG_ID"] = this.aspNewcustKey;
     *     requestData.sendData["ASP_NEWCUST_KEY"] = this.aspNewcustKey;
     *
     *     // 결과 리턴
     *     let response = await this.common_postCall_noPB(requestData, false);
     *     console.log(response);
     * }
     *
     * @param requestData
     * @returns {Promise<{}>}
     */

    async chat_postCall(sUrl, postParam, headParam) {
      let responseData = {};
      if(!postParam) postParam = {};

      //CUSTCO_ID가 없으면 넣어줌
      if(!("CUSTCO_ID" in postParam)){
        postParam.CUSTCO_ID = this.$store.getters["userStore/GE_USER_ROLE"].company.CD
      }
      //USER_ID가 없으면 넣어줌
      if(!("USER_ID" in postParam)){
        postParam.USER_ID = this.$store.getters["userStore/GE_USER_ROLE"].userId
      }

      await apiChat
        .post(
          sUrl, //api url입력
          postParam,
          headParam
        ) //api에 로그를 남기기위한 값입력 (필수) (SERVICE, METHOD, TYPE)
        .then((response) => {
          responseData = response.data;
          // console.log("response")
        }) //api 호출 성공 이후 수행
        .catch((err) => {
          // this.showAlert(err);
          this.MESSAGE.ERROR.ERROR.msg = err;
          this.showAlert(this.MESSAGE.ERROR.ERROR);
        }); //api호출 에러 작업 수행
      return responseData;
      //결과값 보여주기
    },


    /**
     * ChatGPT Backend(fastapi) 요청
     */
    async chatGPT_postCall(sUrl, postParam, headParam) {
      let responseData = {};
      if(!postParam) postParam = {};
      await apiChatGPT
        .post(
          sUrl, //api url입력
          postParam,
          headParam
        ) //api에 로그를 남기기위한 값입력 (필수) (SERVICE, METHOD, TYPE)
        .then((response) => {
          responseData = response.data;
          // console.log("response")
        }) //api 호출 성공 이후 수행
        .catch((err) => {
          // this.showAlert(err);
          this.MESSAGE.ERROR.ERROR.msg = err;
          this.showAlert(this.MESSAGE.ERROR.ERROR);
        }); //api호출 에러 작업 수행
      return responseData;
      //결과값 보여주기
    },


    async chatGPT_getCall(sUrl, headParam) {
      let responseData = {};
      await apiChatGPT
        .get(
          sUrl, //api url입력
          headParam
        ) //api에 로그를 남기기위한 값입력 (필수) (SERVICE, METHOD, TYPE)
        .then((response) => {
          responseData = response.data;
          // console.log("response")
        }) //api 호출 성공 이후 수행
        .catch((err) => {
          // this.showAlert(err);
          this.MESSAGE.ERROR.ERROR.msg = err;
          this.showAlert(this.MESSAGE.ERROR.ERROR);
        }); //api호출 에러 작업 수행
      return responseData;
      //결과값 보여주기
    },


    // 업무에 따른 고유키정보를 가져온다.
    // DB 내부에서 채번된 시퀀스값(YYYYMMDDHHMISSMSC + 업무구분(대문자4자리) + 00000)
    async mixin_common_bizSeq_get(BIZ_CASE) {
      var responseData = "";
      await api
        .post("/api/innb/common/generate-unique-no/inqry", {
          BIZ_CASE: BIZ_CASE,
        })
        .then((response) => {
          //console.log(
          //    "#### [mixins][mixin_common_bizSeq_get] response=",
          //    response
          //);
          responseData = response.data.DATA[0]["RET_VAL"];
        })
        .catch((error) => {});
      return responseData;
    },
    //LMS 컨텐츠분류코드 조회
    async mixin_getDivCodeData(strCode) {
      let responseData = [];

      let requestData = {
        headers: {},
        sendData: {},
      };
      // header 세팅
      requestData.headers["URL"] = "api/km/category/manage/div-cd/list";
      requestData.headers["SERVICE"] = "km.category.manage.div-cd";
      requestData.headers["METHOD"] = "list";
      requestData.headers["TYPE"] = "BIZ_SERVICE";
      requestData.headers["ASYNC"] = false;

      // sendData 세팅
      requestData.sendData["SPST_DIV_ID"] = strCode;

      // 결과 리턴
      let response = await this.common_postCall_noPB(requestData);

      if (!response.HEADER.ERROR_FLAG) {
        if (response[strCode]) {
          var key = strCode;
          var jasonData = {};
          jasonData["group_cd"] = key;
          jasonData["group_value"] = response[key];
          responseData.push(jasonData);
        }
      }

      return responseData;
    },

    restoreXSS(strText) {
      //값존재유무 체크
      if (strText === "" || strText == null) {
        return strText;
      }
      strText = strText.toString();
      strText = strText.replaceAll("&lt;", "<");
      strText = strText.replaceAll("&gt;", ">");
      strText = strText.replaceAll("&#40;", "(");
      strText = strText.replaceAll("&#41;", ")");
      strText = strText.replaceAll("&#91;", "[");
      strText = strText.replaceAll("&#93;", "]");
      strText = strText.replaceAll("&amp;", "&");
      strText = strText.replaceAll("&amp;amp", "&");
      strText = strText.replaceAll("&quot;", '"');
      strText = strText.replaceAll("&apos;", "'");
      strText = strText.replaceAll("<br>", "\r");
      strText = strText.replaceAll("<p>", "\n");

      return strText;
    },
    restoreXSS_CKeditorDec(strText) {
      //값존재유무 체크
      if (strText === "" || strText == null) {
        return strText;
      }
      strText = strText.toString();

      //XSS이 적용되었을 경우 원래 문자로 치환하여 반환한다.
      strText = strText.replaceAll("<", "&lt;");
      strText = strText.replaceAll(">", "&gt;");
      strText = strText.replaceAll(/\n/g, "");

      return strText;
    },
    restoreXSS_CKeditor(strText) {
      //값존재유무 체크
      if (strText === "" || strText == null) {
        return strText;
      }
      strText = strText.toString();

      //XSS이 적용되었을 경우 원래 문자로 치환하여 반환한다.
      strText = strText.replaceAll("&lt;", "<");
      strText = strText.replaceAll("&gt;", ">");

      return strText;
    },
    restoreXSS_Dec(strText) {
      //값존재유무 체크
      if (strText === "" || strText == null) {
        return strText;
      }
      strText = strText.toString();

      //문자열 길이가 4이상일 경우만 처리
      // 이부분이 왜 걸려잇는지 모르겠음...테스트 후 길이체크는 막을 예정..
      // if(strText.length <= 3){return strText;}

      //XSS이 적용되었을 경우 원래 문자로 치환하여 반환한다.
      strText = strText.replaceAll("(", "&#40;");
      strText = strText.replaceAll(")", "&#41;");
      strText = strText.replaceAll("[", "&#91;");
      strText = strText.replaceAll("]", "&#93;");
      strText = strText.replaceAll("&", "&amp;");
      strText = strText.replaceAll('"', "&quot;");
      strText = strText.replaceAll("'", "&apos;");
      strText = strText.replaceAll("\r", "<br>");
      strText = strText.replaceAll("\n", "<p>");
      strText = strText.replaceAll("<", "&lt;");
      strText = strText.replaceAll(">", "&gt;");

      return strText;
    },
    //data-table 숫자 합계구하기
    //data_list : 데이터 리스트(JSON ARRAY)
    //key: 데이터 리스트의(sum을 구할 data_list에 포함된 key값명)
    mixin_sum_field(data_list, key) {
      //소수점 더하기일때 이상한 값을때를 위해 패치(toFixed)
      // let sum = data_list.reduce(
      //   (a, b) => +(a + Number(b[key]) || 0).toFixed(12),
      //   0
      // );
      let sum = data_list.reduce(
        (a, b) => +(a + Number(b[key]?typeof(b[key]) === 'string'?b[key].replace(/[^0-9]/g, ''):typeof(b[key]) === 'boolean'?0:b[key]:0) || 0).toFixed(12),
        0
      );
      return sum;
    },

    //data-table 숫자 합계구하기 => group값이 같은경우 key값이 큰거만 합
    mixin_sum_group_field(data_list, group, key) {
      var indices = Object.create(null);
      var group_result = data_list.reduce(function (r, a) {
        if (!(a[group] in indices)) {
          indices[a[group]] = r.push(a) - 1;
          return r;
        }
        if ( Number(a[key]) > Number(r[indices[a[group]]][key])) {
          r[indices[a[group]]] = a;
        }
        return r;
      }, []);
      return this.mixin_sum_field(group_result, key);
    },


    //data-table time 합계구하기
    //data_list : 데이터 리스트(JSON ARRAY)
    //key: 데이터 리스트의(sum을 구할 data_list에 포함된 key값명)
    //string(HH:MM:ss) 데이터를 초로 변환 합계 후 다시 string(HH:MM:ss) 값으로 변환
    mixin_date_sum_field(data_list, key) {
      let sum = 0;
      for (let i = 0; i < data_list.length; i++) {
        if (data_list[i][key] !== "0") {
          sum =
            sum +
            data_list[i][key]
              .split(":")
              .reverse()
              .reduce((prev, curr, i) => prev + curr * Math.pow(60, i), 0);
        }
      }

      let return_data = "00:00:00";
      if (sum !== 0) {
        return_data = this.mixin_seconds_toHHMMSS(sum);
      }

      return return_data;
    },
    //평균 건수를 구한다(소수점 한자리)
    mixin_avg_field(data_list, total_key, base_key) {
      //소수점 더하기일때 이상한 값을때를 위해 패치(toFixed)
      let total_sum = data_list.reduce(
        (a, b) => +(a + Number(b[total_key]) || 0).toFixed(12),
        0
      );

      let base_sum = data_list.reduce(
        (a, b) => +(a + Number(b[base_key]) || 0).toFixed(12),
        0
      );

      let avg = 0;
      if (total_sum !== 0 && base_sum !== 0) {
        avg = ((total_sum / base_sum) * 100).toFixed(1);
      }

      return avg;
    },
    //시간 데이터를 가지고 평균 시간을 구한다
    //총시간 / 데이터 건수 (단, 0인건은 데이터 건수에 포함하지 않는다)
    mixin_date_avg_field(data_list, key) {
      let sum = 0;
      let avg = 0;
      let count = 0; //시간이 0인건은 포함시키지 않는다
      for (let i = 0; i < data_list.length; i++) {
        if (data_list[i][key] !== "0" && data_list[i][key] !== "00:00:00") {
          sum =
            sum +
            data_list[i][key]
              .split(":")
              .reverse()
              .reduce((prev, curr, i) => prev + curr * Math.pow(60, i), 0);
          count++;
        }
      }

      let return_data = "00:00:00";

      //평균시간을 구한다
      if (sum !== 0 && count !== 0) {
        avg = (sum / count).toFixed(0);
      }

      //HH:MM:SS 표기로 변환 한다
      if (sum !== 0 && count !== 0) {
        return_data = this.mixin_seconds_toHHMMSS(avg);
      }

      return return_data;
    },
    //seconds를 HH:MM:ss로 변환한다
    mixin_seconds_toHHMMSS(secs) {
      var sec_num = parseInt(secs, 10);
      var hours = Math.floor(sec_num / 3600);
      var minutes = Math.floor(sec_num / 60) % 60;
      var seconds = sec_num % 60;

      return (
        [hours, minutes, seconds]
          .map((v) => (v < 10 ? "0" + v : v))
          // .filter((v, i) => v !== "00" || i > 0)
          .join(":")
      );
    },
    /**
     * 서버 시간을 포맷에 맞춰 반환한다.
     * ex)
     * let currentDate = await this.mixin_getSvrDate("YYYYMMDD");
     * console.log(currentDate);
     * @param strFormat
     * @returns {Promise<{}|*>}
     */
    async mixin_getSvrDate(strFormat) {
      let requestData = {
        headers: {},
        sendData: {},
      };
      // header 세팅
      requestData.headers["URL"] = "/api/date/common/current-time/inqry";
      requestData.headers["SERVICE"] = "date.common.current-time";
      requestData.headers["METHOD"] = "inqry";
      requestData.headers["TYPE"] = "BIZ_SERVICE";
      requestData.headers["ASYNC"] = false;

      // sendData 세팅
      requestData.sendData["FORMAT01"] = strFormat;
      let response = await this.common_postCall_noPB(requestData);
      if (!response.HEADER.ERROR_FLAG) {
        let resultData = response.DATA[0].RET_VAL;
        return resultData;
      } else {
        return response;
      }
    },

    /**
     * 서버 시간을 포맷에 맞춰 오늘날짜, 3일전, 7주일전, 1달전, 3달전 반환한다.
     * ex)
     * let currentDate = await this.mixin_getSvrDate("YYYYMMDD");
     * console.log(currentDate);
     * @param strFormat
     * @returns {Promise<{}|*>}
     */
    async mixin_getSvrPrevDate(strFormat) {
      let requestData = {
        headers: {},
        sendData: {},
      };
      // header 세팅
      requestData.headers["URL"] = "/api/date/common/prev-date/inqry";
      requestData.headers["SERVICE"] = "date.common.prev-date";
      requestData.headers["METHOD"] = "inqry";
      requestData.headers["TYPE"] = "BIZ_SERVICE";
      requestData.headers["ASYNC"] = false;

      // sendData 세팅
      requestData.sendData["FORMAT01"] = strFormat;
      requestData.sendData["BASE_DATE"] = strFormat;
      let response = await this.common_postCall_noPB(requestData);
      if (!response.HEADER.ERROR_FLAG) {
        let resultData = response.DATA[0];
        return resultData;
      } else {
        return response;
      }
    },

    /**
     * 자리수 만큼 문자열 채워준다.
     * @param {String} strVal 베이스 문자열.
     * @param {int} intLen 리턴 문자열 자리수.
     * @param {String} strExtVal 문자열 자리수에 맞춰 채워넣을 문자열.
     * @param {String} strDirection 문자열 채울 방향 'L', 'R'
     * @return {String} strRetVal 반환되는 padding 문자열
     * @author MPC R&D Team
     */
    mixin_setTxtPad(strVal, intLen, strExtVal, strDirection) {
      if (typeof strVal === "undefined") {
        return "";
      }
      if (typeof strVal !== "string") {
        strVal = strVal.toString();
      }
      if (typeof intLen === "undefined") {
        intLen = 0;
      }
      if (typeof strExtVal === "undefined") {
        return strVal;
      }
      if (typeof strDirection === "undefined") {
        strDirection = "L";
      }
      if (strVal.length >= intLen) {
        return strVal;
      }

      var strRetVal = strVal;
      intLen = intLen - strVal.length;
      for (var i = 0; i < intLen; i++) {
        if (strDirection === "L") {
          strRetVal = strExtVal + strRetVal;
        } else {
          strRetVal = strRetVal + strExtVal;
        }
      }

      return strRetVal;
    },
    mixin_rpad: function (strVal, intLen, strExtVal) {
      return this.mixin_setTxtPad(strVal, intLen, strExtVal, "L");
    },
    mixin_lpad: function (str, _length, ch_str) {
      return this.mixin_setTxtPad(str, _length, ch_str, "R");
    },
    /**
     * 빈값 체크
     * @param {any} val
     * @returns {boolean}
     */
    mixin_isEmpty(val) {
      if (val == null) return true;
      if (typeof val === "undefined") return true;
      if (typeof val === "string" && val === "" && "" + val === "") return true;
      if (Array.isArray(val) && val.length < 1) return true;
      if (
        typeof val === "object" &&
        val.constructor.name === "Object" &&
        Object.keys(val).length < 1
      )
        return true;
      if (
        typeof val === "object" &&
        val.constructor.name === "String" &&
        Object.keys(val).length < 1
      )
        return true;
    },
    /**
     * isEmpty 체크 후 true일 경우 defaultVal 리턴
     * @param {any} val
     * @param {any} defaultVal
     * @returns {any}
     */
    mixin_nvl(val, defaultVal) {
      return this.mixin_isEmpty(val) ? defaultVal : val;
    },
    async requestDownloadApi(requestObj, filename) {
      // _.merge - Lodash 라이브러리
      let reqHeaders = requestObj.headers;
      const token = window.sessionStorage.getItem("token");
      // request.headers.token = token;
      //resuest header에 전달받은 accessToken을 Bearer 형식으로 전송
      reqHeaders.Authorization = "bearer " + token;
      let form = new FormData();

      for (var strKey in requestObj.data) {
        form.append(strKey, requestObj.data[strKey]);
      }

      return axios({
        url: process.env.VUE_APP_API_URL + requestObj.url,
        headers: reqHeaders,
        responseType: "arraybuffer",
        method: "post",
        data: form,
      })
        .then((res) => {
          try {
            let blob = new Blob([res.data], {
              type: res.headers["content-type"],
            });
            let fileName = this.getFileName(res.headers["content-disposition"], filename);
            fileName = decodeURI(fileName); // 파일명 디코딩 (프로젝트에 따라 사용여부 옵션)

            if (window.navigator.msSaveOrOpenBlob) {
              // IE 10+
              window.navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
              // not IE
              let link = document.createElement("a");
              link.href = window.URL.createObjectURL(blob);
              link.target = "_self";
              if (fileName) link.download = fileName;
              link.click();
            }

            requestObj.callback(res.data);
          } catch (e) {
            // console.log("e", e);
            console.error(e);
          }
        })
        .catch((res) => {
          // status 200이 아닌경우에도 콜백호출 (프로젝트에 맞게 수정필요)
          requestObj.callback(res.response.data);
        });
    },

    async requestServerExcelDownloadApi(requestObj, filename) {
      // _.merge - Lodash 라이브러리
      let reqHeaders = requestObj.headers;
      const token = window.sessionStorage.getItem("token");
      // request.headers.token = token;
      //resuest header에 전달받은 accessToken을 Bearer 형식으로 전송
      reqHeaders.Authorization = "bearer " + token;
      let form = new FormData();

      for (var strKey in requestObj.data) {
        if(!Array.isArray(requestObj.data[strKey])) form.append('DATA[0][' + strKey + ']', requestObj.data[strKey]);
      }

      let jsonData = requestObj.data;
      for (var strKey2 in jsonData) {
          for (var indexKey in jsonData[strKey2]) {
            if (typeof jsonData[strKey2][indexKey] === "object") {
              for (var strKey3 in jsonData[strKey][indexKey]) {
                  form.append(
                    "DATA[" + indexKey + "][" + strKey3 + "]",
                    jsonData[strKey2][indexKey][strKey3]
                  );
              }
            }
          }
      }
      form.append("HEADER[MENU_ID]", JSON.parse(sessionStorage.getItem("vuex")).commonStore.active_tab.id);
      form.append("HEADER[MENU_PATH]", JSON.parse(sessionStorage.getItem("vuex")).commonStore.active_tab.title);

      return axios({
        url: process.env.VUE_APP_API_URL + requestObj.url,
        headers: reqHeaders,
        responseType: "arraybuffer",
        method: "post",
        data: form,
      })
        .then((res) => {
          try {
            let blob = new Blob([res.data], {
              type: res.headers["content-type"],
            });
            let fileName = this.getFileName(res.headers["content-disposition"], filename);
            fileName = decodeURI(fileName); // 파일명 디코딩 (프로젝트에 따라 사용여부 옵션)

            if (window.navigator.msSaveOrOpenBlob) {
              // IE 10+
              window.navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
              // not IE
              let link = document.createElement("a");
              link.href = window.URL.createObjectURL(blob);
              link.target = "_self";
              if (fileName) link.download = fileName;
              link.click();
            }
            this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
            requestObj.callback(res.data);
          } catch (e) {
            // console.log("e", e);
            console.error(e);
          }
        })
        .catch((res) => {
          // status 200이 아닌경우에도 콜백호출 (프로젝트에 맞게 수정필요)
          this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
          requestObj.callback(res.response.data);
        });
    },

    getFileName(contentDisposition, filename) {
      let fileName = [];
      if(contentDisposition != undefined){
      fileName = contentDisposition
        .split(";")
        .filter((ele) => {
          return ele.indexOf("filename") > -1;
        })
        .map((ele) => {
          return ele.replace(/"/g, "").split("=")[1];
        });
      } else {
        fileName[0] = filename;
      }
      return fileName[0] ? fileName[0] : "No_Name";
    },
    async setFileDownCnt(FILE_GROUP_KEY, FILE_KEY, asp_cust_key) {
      let rtnBln = false;
      let requestObj = {
        headers: {},
        data: {},
      };

      const token = window.sessionStorage.getItem("token");
      // request.headers.token = token;
      //resuest header에 전달받은 accessToken을 Bearer 형식으로 전송
      requestObj.headers.Authorization = "bearer " + token;
      let form = new FormData();
      form.append("fileGroupKey", FILE_GROUP_KEY);
      form.append("fileKey", FILE_KEY);
      form.append("custcoId", this.$store.getters["userStore/GE_USER_ROLE"].company);
      // form.append(
      //   "procId",
      //   this.$store.getters["userStore/GE_USER_ROLE"].userId
      // );
      // form.append(
      //   "amdrId",
      //   this.$store.getters["userStore/GE_USER_ROLE"].userId
      // );

      axios({
        url: process.env.VUE_APP_API_URL + "api/file/update-dnlod-cnt",
        headers: requestObj.headers,

        method: "post",
        data: form,
      })
        .then((res) => {
          rtnBln = true;
          return rtnBln;
        })
        .catch((res) => {
          // status 200이 아닌경우에도 콜백호출 (프로젝트에 맞게 수정필요)
          return rtnBln;
        });
    },

    async deleteFile(FILE_GROUP_KEY, FILE_KEY, asp_cust_key) {
      let rtnBln = false;
      let requestObj = {
        headers: {},
        data: {},
      };

      const token = window.sessionStorage.getItem("token");
      // request.headers.token = token;
      //resuest header에 전달받은 accessToken을 Bearer 형식으로 전송
      requestObj.headers.Authorization = "bearer " + token;

      await axios({
        url: process.env.VUE_APP_API_URL + "api/file/delete",
        headers: requestObj.headers,

        method: "post",
        data: {
          deleteFileKeys: [
            {
              fileGroupKey: FILE_GROUP_KEY,
              fileKey: FILE_KEY,
              aspCustKey: asp_cust_key,
              amdrId: this.$store.getters["userStore/GE_USER_ROLE"].userId,
            },
          ],
        },
      })
        .then((res) => {
          rtnBln = true;
        })
        .catch((res) => {
          // status 200이 아닌경우에도 콜백호출 (프로젝트에 맞게 수정필요)
          rtnBln = false;
        });
      return rtnBln;
    },

    /**
     * 첨부파일 다중 삭제.
     * @param {List} dataList checkBox 체크된 데이터 배열.
     * @return {boolean}
     * @author
     */
    async deleteFilesMulti(dataList) {
      let rtnBln = false;
      let requestObj = {
        headers: {},
        data: {},
      };

      let delData = [];
      for (let i in dataList) {
        delData.push({
          fileGroupKey: dataList[i].FILE_GROUP_KEY,
          fileKey: dataList[i].FILE_KEY,
          aspCustKey: dataList[i].ASP_CUST_KEY,
          amdrId: this.$store.getters["userStore/GE_USER_ID"],
        });
      }

      const token = window.sessionStorage.getItem("token");
      // request.headers.token = token;
      //resuest header에 전달받은 accessToken을 Bearer 형식으로 전송
      requestObj.headers.Authorization = "bearer " + token;

      await axios({
        url: process.env.VUE_APP_API_URL + "api/file/delete",
        headers: requestObj.headers,
        method: "post",
        data: { deleteFileKeys: delData },
      })
        .then((res) => {
          rtnBln = true;
        })
        .catch((res) => {
          // status 200이 아닌경우에도 콜백호출 (프로젝트에 맞게 수정필요)
          rtnBln = false;
        });
      return rtnBln;
    },

    async mixin_getFileList(FILE_GROUP_KEY) {
      let rtn = [];
      let requestData = {
        headers: {},
        sendData: {},
      };
      // header 세팅
      requestData.headers["URL"] = "api/file/json/list";
      requestData.headers["SERVICE"] = "file.json";
      requestData.headers["METHOD"] = "list";
      requestData.headers["TYPE"] = "BIZ_SERVICE";
      requestData.headers["ASYNC"] = false;

      // sendData 세팅
      requestData.sendData["FILE_GROUP_KEY"] = FILE_GROUP_KEY;

      // 결과 리턴
      let response = await this.common_postCall_noPB(requestData);

      if (!response.HEADER.ERROR_FLAG) {
        rtn = response.DATA;
      }

      return rtn;
    },

    /*
      item (필수): 파일 목록 v-data-table item
      item 구조 : {
        FILE_KEY :파일키
        , SAVE_FILENAME : 저장된 파일명
        , ORIGINAL_FILENAME : 원본 파일명
        , FILE_SIZE : 파일 사이즈
        , FILE_EXTS : 파일 확장자
        , DNLOD_CNT : 다운로드 수
        , ASP_CUST_KEY : 회사구분
      }
      busiType (필수) : RepositoryBusiType.java 참조 (palette, phone, chat, km, bbs 해당 값만 허용됨)
      pathType (필수) : RepositoryPathType.java 참조 (publics, files, images, videos 해당 값만 허용됨)
    */
    async mixin_fileDownload(item, busiType, pathType) {
      // console.log("item",item);
      this.requestDownloadApi({
        url: "api/file/" + busiType + "/" + pathType + "/download", // required
        headers: {
          // required
          Authorization: "",
        },
        callback: (data) => {
          // required
          this.setFileDownCnt(
            item.fileGroupKey,
            item.fileKey,
          );
          item.DNLOD_CNT = Number(item.DNLOD_CNT) + 1;
        },
        data: {
          // optional
          fileGroupKey: item.fileGroupKey,
          procId: this.$store.getters["userStore/GE_USER_ROLE"].userId,
          fileKey: item.fileKey,
          custcoId: this.$store.getters['userStore/GE_USER_ROLE'].company.CD,              //회사구분 : 1은 시스템(가이드)
          acceptedFiles: "image/*,*.doc,*.docx,*.pdf,*.csv,*.xls,*.xlsx,*.ppt",
        },
      }, item.filename);
    },

    mixin_getFileSize(fileSize) {
      let rtnStr = "-";
      let divSize = 1024;
      let tempSize = fileSize;
      if (fileSize != undefined && fileSize != "" && fileSize > 0) {
        if (tempSize > divSize) {
          tempSize = (Number(tempSize) / 1024).toFixed(0);
          if (tempSize > divSize) {
            tempSize = (Number(tempSize) / 1024).toFixed(0);
            rtnStr = tempSize + "Mb";
          } else {
            rtnStr = tempSize + "Kb";
          }
        } else {
          rtnStr = "1Kb";
        }
      } else {
        return rtnStr;
      }

      return rtnStr;
    },


    /**
     * 챗관련 추가 Start_Arthur.Kim
     */

    /**
     * 바이트 기준으로 문자열 길이를 계산하여 반환한다.
     * @param agStr : 문자열
     * @returns 문자열의 길이
     * @author MPC R&D Team
     */
    getByte(agStr){

      let tmpStr;
      let temp=0;
      let onechar;
      let tcount;

      let pCnt = 1;
      let k = 0;

      tcount = 0;
      tmpStr = new String(agStr);

      temp = tmpStr.length;

      for (; k < temp; k++ ){
          onechar = tmpStr.charAt(k);
          pCnt =1;

          if ( escape(onechar).length > 4 ){
              pCnt = 2;
          }

          tcount = tcount+pCnt;
      }
      return tcount;
    },

    /**
     * 바이트 기준으로 문자열 자른다.
     * @param agStr : 문자열
     * @returns 문자열의 길이
     * @author MPC R&D Team
     */
    cutByteLength(s, len) {

      let size = 0;
      let rIndex = 0;
      let i = 0;

      if (s == null || s.length == 0) {
          return 0;
      }

      rIndex = s.length;

      for (; i < s.length; i++) {

          size += this.charByteSize(s.charAt(i));

          if( size == len ) {
              rIndex = i + 1;
              break;
          } else if( size > len ) {
              rIndex = i;
              break;
          }
      }

      return s.substring(0, rIndex);
    },

    charByteSize(ch) {

      if (ch == null || ch.length == 0) {
          return 0;
      }

      let charCode = ch.charCodeAt(0);

      if (charCode <= 0x00007F) {
          return 1;
      } else if (charCode <= 0x0007FF) {
          return 2;
      } else if (charCode <= 0x00FFFF) {
          return 3;
      } else {
          return 4;
      }
    },

    /**
     * 문자열에서 특정문자열을 찾아서 특정문자로 변환한다.(정규식 사용하지 않고 직접처리함)
     * @param {String} strText 전체 문자열
     * @param {String} strFind 찾을 문자열
     * @param {String} strChange 변경할 문자열
     * @return {String} 치환된 문자열
     */
    replaceAll(strText, strFind, strChange){

      if(typeof(strText)		=== "undefined"){strText	= "";}
      if(typeof(strFind)		=== "undefined"){strFind	= "";}
      if(typeof(strChange)	=== "undefined"){strChange	= "";}
      if(typeof(strText)		!== "string"){strText	= strText.toString();}
      if(typeof(strFind)		!== "string"){strFind	= strFind.toString();}
      if(typeof(strChange)	!== "string"){strChange	= strChange.toString();}

      return strText.split(strFind).join(strChange);
    },
    /**
     * 챗관련 추가 End_Arthur.Kim
     */
    //calendar 포맷 정의(일자)
    mixin_getDate(date) {
      const day = date.split("-")[2];
      const day_num = Number(day);
      return day_num;
    },
    //전화번호 포맷 변경이력일련번호
    //11자리 XXX-XXXX-XXXX
    //10자리 02-XXXX-XXXX 또는 XXX-XXX-XXXX
    mixin_setPhoneNo(no) {
      return this.mixin_setPhoneNoSecret(no, 1);
    },

    mixin_setPhoneNoSecret(no, type){
      if (!no) { return ""; }

      no = no.replace(/[^0-9]/g, "");

      let setNum = "";

      if (no.length === 8) {
        setNum = no.substring(0, 4) + "-" + no.substring(4, 8);
      } else if (no.length === 9) {
        setNum = no.substring(0, 2) + "-" + no.substring(2, 5) + "-" + no.substring(5, 9);
      } else if (no.length === 10) {
        if (no.substring(0, 2) === "02") {
          setNum = no.substring(0, 2) + "-" + no.substring(2, 6) + "-" + no.substring(6, 10);
        } else {
          setNum = no.substring(0, 3) + "-" + no.substring(3, 6) + "-" + no.substring(6, 10);
        }
      } else if (no.length === 11) {
        setNum = no.substring(0, 3) + "-" + no.substring(3, 7) + "-" + no.substring(7, 11);
      } else if (no.length === 12) {
        setNum = no.substring(0, 4) + "-" + no.substring(4, 8) + "-" + no.substring(8, 12);
      } else {
        setNum = no;
      }
      return setNum;

      // return no.replace(/[^0-9]/g, "").replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3");

    },

    //숫자 천단위 콤마(,) 추가 표기
    mixin_convertNumToComma(num){
      if(num.toString().indexOf('.') > -1){
        return num.toString().split('.')[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '.' + num.toString().split('.')[1];
      }else{
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    },

    //사용자 버튼 사용 여부 확인
    mixin_set_btn(menu_id, button_id) {
      //console.log("menu_id", menu_id);
      //console.log("button_id", button_id);
      if (!menu_id || !button_id) return false;
      let return_data = false;
      let set_id = menu_id.replace("MENU_", "");
      let menu_list = this.$store.getters["userStore/GE_USER_MENU_LIST"];

      for (let i = 0; i < menu_list.length; i++) {
        if (menu_list[i].C_NODE_NO === set_id) {
          if (menu_list[i].BTN_AUTH) {
            let btn_list = menu_list[i].BTN_AUTH.split(",");
            if (btn_list.indexOf(button_id) > -1) {
              return_data = true;
            }
          }
        }
      }

      return return_data;
    },

    // null 체크
    checkValueNull(num) {

      if(typeof num == undefined || num == null || num == "") {
        return true;
      } else {
        return false;
      }
    },

    //마스킹 처리(전화번호)
    mixin_mask_num(num) {

      let preMaskingData = num;
      let MaskingData = "";
      let len = "";

      let emailMatchValue = preMaskingData.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);

      if(this.checkValueNull(emailMatchValue) == true) {
          MaskingData = preMaskingData;
      } else {
          len = emailMatchValue.toString().split('@').length;
          MaskingData = preMaskingData.toString().replace(new RegExp('.(?=.{0,' + len + '}@)', 'gi'), '*');
      }

      let phoneMatchValue = MaskingData.match(/\d{2,3}-\d{3,4}-\d{4}/gi);
      let phoneMatchValue2 = MaskingData.match(/\d{4}-\d{4}/gi);

      if(/-[0-9]{3}-/.test(phoneMatchValue)) {
          MaskingData= MaskingData.toString().replace(phoneMatchValue, phoneMatchValue.toString().replace(/-[0-9]{3}-/g, "-***-"));
      } else if(/-[0-9]{4}-/.test(phoneMatchValue)) {
          MaskingData= MaskingData.toString().replace(phoneMatchValue, phoneMatchValue.toString().replace(/-[0-9]{4}-/g, "-****-"));
      }

      if (num.length == 8) {
        if(/-[0-9]{4}/.test(phoneMatchValue2)) {
          MaskingData= MaskingData.toString().replace(phoneMatchValue2, phoneMatchValue2.toString().replace(/-[0-9]{4}/g, "-****"));
        }
      }


      //phoneMatchValue = MaskingData.length < 11 ? MaskingData.match(/\d{10}/gi) : MaskingData.match(/\d{11}/gi);

      if (MaskingData.length < 9) {
        phoneMatchValue2 = MaskingData.match(/\d{8}/gi)
      }else if (MaskingData.length < 10) {
        phoneMatchValue = MaskingData.match(/\d{9}/gi)
      } else if (MaskingData.length < 11) {
        phoneMatchValue = MaskingData.match(/\d{10}/gi)
      } else {
        phoneMatchValue = MaskingData.match(/\d{11}/gi)
      }

      //console.log("MaskingData : " + MaskingData);
      // console.log("phoneMatchValue : " + phoneMatchValue);
      // console.log("MaskingData : " + MaskingData);
      // console.log("phoneMatchValue : " + phoneMatchValue);


      if(this.checkValueNull(phoneMatchValue) != false && this.checkValueNull(phoneMatchValue2) != false ) {
          MaskingData = MaskingData;
      } else {
        if(MaskingData.length < 9) {
          MaskingData = MaskingData.toString().replace(phoneMatchValue2, phoneMatchValue2.toString().replace(/(\d{4})(\d{4})/gi,'$1****'));
        } else if(MaskingData.length < 10) {
          MaskingData = MaskingData.toString().replace(phoneMatchValue, phoneMatchValue.toString().replace(/(\d{2})(\d{3})(\d{4})/gi,'$1***$3'));
        } else if(MaskingData.length < 11) {

          let areaCd = preMaskingData.substring(0, 2);

          if (areaCd == '02') {
            MaskingData = MaskingData.toString().replace(phoneMatchValue, phoneMatchValue.toString().replace(/(\d{2})(\d{4})(\d{4})/gi,'$1***$3'));
          } else {
            MaskingData = MaskingData.toString().replace(phoneMatchValue, phoneMatchValue.toString().replace(/(\d{3})(\d{3})(\d{4})/gi,'$1***$3'));
          }

        } else {
          MaskingData = MaskingData.toString().replace(phoneMatchValue, phoneMatchValue.toString().replace(/(\d{3})(\d{4})(\d{4})/gi,'$1****$3'));
        }
      }

      return MaskingData;
    },

    //마스킹 처리(이름)
    mixin_mask_name(strName){
      let originStr = strName;
      let maskingStr;

      if(this.mixin_isEmpty(originStr) == true || originStr === '성명미상'){
        return originStr;
      }

      if (strName.length > 2) {
        var originName = strName.split('');
        originName.forEach(function(name, i) {
          if (i === 0 || i === originName.length - 1) return;
          originName[i] = '*';
        });
        var joinName = originName.join();
        maskingStr = joinName.replace(/,/g, '');
      } else {
        var pattern = /.$/; // 정규식
        maskingStr = strName.replace(pattern, '*');
      }

      return maskingStr;
    },

    //마스킹 처리(개인정보)
    mixin_mask_info(strName){
      let originStr = strName;
      let maskingStr;

      if(this.mixin_isEmpty(originStr) == true){
        return originStr;
      }

      if (strName.length > 2) {
        var originName = strName.split('');
        originName.forEach(function(name, i) {
          originName[i] = '*';
        });
        var joinName = originName.join();
        maskingStr = joinName.replace(/,/g, '');
      } else {
        var pattern = /.$/; // 정규식
        maskingStr = strName.replace(pattern, '*');
      }

      return maskingStr;
    },

    //사용자별 소속 조회
    mixin_get_blng(asp_cust_key){
      let blngObj = {}
      api.post("/chat-api/dashboard/ATTR/inqire", {
        ASP_NEWCUST_KEY: asp_cust_key,
        ASP_USER_ID: this.$store.getters["userStore/GE_USER_ROLE"].userId,
        ASP_CUST_KEY: asp_cust_key,
        USER_ID: this.$store.getters["userStore/GE_USER_ROLE"].userId,
      },
      {
        head: {
          SERVICE: "chat.dashboard.ATTR",
          METHOD: "inqire",
          TYPE: "BIZ_SERVICE",
        }
      })
      .then((ret) => {
        //console.log("소속정보", ret.data.DATA);
        blngObj = ret.data.DATA;
      });

      return blngObj;
    },

    //회사별 공통코드 조회
    mixin_common_code_byCust(all_code, group_cd, strHeadText, aspCustKey){
      var responseData = [];

      if (strHeadText != "" && strHeadText != undefined) {
        responseData.push({ text: strHeadText, value: "" });
      }

      if (all_code && typeof all_code === "object") {
        for (var i = 0; i < all_code.length; i++) {
          if (all_code[i].group_cd === group_cd) {
            for (var a = 0; a < all_code[i].group_value.length; a++) {
              if(all_code[i].group_value[a].ETC_INFO01 == '' || all_code[i].group_value[a].ETC_INFO01 == null){
                //기타코드1 비어있을때
                if(all_code[i].group_value[a].ETC_INFO02 == '' || all_code[i].group_value[a].ETC_INFO02 == null){
                  //기타코드1 비어있고 기타코드2 비어있을때
                  responseData.push({
                    text: all_code[i].group_value[a].CD_NM,
                    value: all_code[i].group_value[a].CD,
                    cd_vl: all_code[i].group_value[a].CD_VL,
                    info1: all_code[i].group_value[a].ETC_INFO01,
                    info2: all_code[i].group_value[a].ETC_INFO02,
                    info3: all_code[i].group_value[a].ETC_INFO03,
                  });
                } else {
                  //기타코드1 비어있고 기타코드2 존재할때
                  let chkAspCus = all_code[i].group_value[a].ETC_INFO02.split(',');
                  let chkAspCusLeng = chkAspCus.length;
                  let n = 0;
                  let cnt = 0;
                  for(n;n<chkAspCusLeng;n++){
                    if(chkAspCus[n] == aspCustKey){
                      cnt++;
                    }
                  }
                  if(cnt == 0){
                    responseData.push({
                      text: all_code[i].group_value[a].CD_NM,
                      value: all_code[i].group_value[a].CD,
                      cd_vl: all_code[i].group_value[a].CD_VL,
                      info1: all_code[i].group_value[a].ETC_INFO01,
                      info2: all_code[i].group_value[a].ETC_INFO02,
                      info3: all_code[i].group_value[a].ETC_INFO03,
                    });
                  }
                }
              } else {
                //기타코드1 존재할때 >> 기타코드2는 조회할 필요 없음
                let chkAspCus = all_code[i].group_value[a].ETC_INFO01.split(',');
                let chkAspCusLeng = chkAspCus.length;
                let n = 0;
                for(n;n<chkAspCusLeng;n++){
                  if(chkAspCus[n] == aspCustKey){
                    responseData.push({
                      text: all_code[i].group_value[a].CD_NM,
                      value: all_code[i].group_value[a].CD,
                      cd_vl: all_code[i].group_value[a].CD_VL,
                      info1: all_code[i].group_value[a].ETC_INFO01,
                      info2: all_code[i].group_value[a].ETC_INFO02,
                      info3: all_code[i].group_value[a].ETC_INFO03,
                    });
                  }
                }
              }

            }
          }
        }
      }
      //console.log("responseData", responseData);
      return responseData;
    },

    //상위레벨 선택
    mixin_getLVCode(all_code, group_cd, strHeadText, CHK, LV2){
      var responseData = [];

      if (strHeadText != "" && strHeadText != undefined) {
        responseData.push({ text: strHeadText, value: "" });
      }
      if (all_code && typeof all_code === "object") {
        for (var i = 0; i < all_code.length; i++) {
          if (all_code[i].group_cd === group_cd) {
            for (var a = 0; a < all_code[i].group_value.length; a++) {
              if(all_code[i].group_value[a].ETC_INFO01 == CHK){
                if(CHK == '소분류'){
                  if(all_code[i].group_value[a].CD.includes(LV2)){
                    responseData.push({
                      text: all_code[i].group_value[a].CD_NM,
                      value: all_code[i].group_value[a].CD,
                      cd_vl: all_code[i].group_value[a].CD_VL,
                      info1: all_code[i].group_value[a].ETC_INFO01,
                      info2: all_code[i].group_value[a].ETC_INFO02,
                      info3: all_code[i].group_value[a].ETC_INFO03,
                    });
                  }
                } else {
                  responseData.push({
                    text: all_code[i].group_value[a].CD_NM,
                    value: all_code[i].group_value[a].CD,
                    cd_vl: all_code[i].group_value[a].CD_VL,
                    info1: all_code[i].group_value[a].ETC_INFO01,
                    info2: all_code[i].group_value[a].ETC_INFO02,
                    info3: all_code[i].group_value[a].ETC_INFO03,
                  });
                }
              }
            }
          }
        }
      }
      //console.log("responseData", responseData);
      return responseData;
    },

    mixin_check_AspCustKey_number(){
      let num = this.$store.getters["userStore/GE_USER_ROLE"].company_list.length
      if(num == 1){
        return "Y"
      } else {
        return "N"
      }
    },

    //최상위 공통코드 가져오기
    mixin_get_first_cmm(info, AspCustKey){
      let reData = [];
      api.post("/api/palette/common/get-cmm/list", {
        INFO1: info,
        ASP_NEWCUST_KEY: AspCustKey,
        ASP_USER_ID: this.$store.getters["userStore/GE_USER_ROLE"].userId,
        ASP_CUST_KEY: AspCustKey,
        USER_ID: this.$store.getters["userStore/GE_USER_ROLE"].userId,
      },
      {
        head: {
          SERVICE: "palette.common.get-cmm",
          METHOD: "list",
          TYPE: "BIZ_SERVICE",
        }
      })
      .then((ret) => {
        //console.log("최상위 코드", ret.data.DATA);
        reData = ret.data.DATA;
      });
      return reData;
    },

    //회사코드로 회사명 가져오기
    mixin_getCompanyNM(AspCustKey){
      let reData = '';
      api.post("/api/palette/common/getCompanyNM/inqire", {
        ASP_NEWCUST_KEY: AspCustKey,
        ASP_USER_ID: this.$store.getters["userStore/GE_USER_ROLE"].userId,
        ASP_CUST_KEY: AspCustKey,
        USER_ID: this.$store.getters["userStore/GE_USER_ROLE"].userId,
      },
      {
        head: {
          SERVICE: "palette.common.getCompanyNM",
          METHOD: "inqire",
          TYPE: "BIZ_SERVICE",
        }
      })
      .then((ret) => {
        //console.log("최상위 코드", ret.data.DATA);
        reData = ret.data.DATA[0].COMPANY_NM;
      });
      return reData;
    },

    //채팅 엑셀 다운
    mixin_chat_exportExcel(history, filename) {
      let deleteTarget = [
        'TYPE',
        'SNDRCV_CD',
        // 'SNDRCV_NM',
        'IMAGE_URL',
        // 'CONTENT',
        // 'CHAT_DATE'
        'AFTR_CHT',
        'BFR_CHT',
      ];
      for(var i=0; i<history.length; i++){
        deleteTarget.forEach(e => delete history[i][e]);
      }

      var excelData = XLSX.utils.json_to_sheet(history, {skipHeader:false});
      XLSX.utils.sheet_add_aoa(excelData,[["수/발신 여부","채팅내용","채팅시간"]], {origin:"A1"});
      var workBook = XLSX.utils.book_new(); // 새 시트 생성

      XLSX.utils.book_append_sheet(workBook, excelData, "chatContent");

      const max_width = history.reduce((w, r) => Math.max(w, r.CONTENT.length), 10);
      excelData["!cols"] = [ { wch: 15 },{ wch: 15 },{ wch: 60 },{ wch: 15 },{ wch: 15 } ];

      XLSX.writeFile(workBook, filename + ".xlsx"); // 엑셀파일 생성 및 다운로드

      this.mixin_prvcInqLog('LIST_EXCEL_DOWN', {FILE_NM : filename, DOWN_REASON : this.$store.getters['alertStore/GE_ALERT'].downReason});
      this.$store.commit("alertStore/hideAlert");
    },
    // 설문결과 엑셀 다운로드
    mixin_srvy_exportExcel(){
      const tableComplexHeader = document.querySelector('#SrvyRsltTable');
      const cloneTable = tableComplexHeader.cloneNode(true);
      const tbodyToRemove = cloneTable.querySelector('tbody');
      // console.log("table_body", this.table_body);
      tbodyToRemove.remove();

      for(let i =0; i<this.table_body.length; i++){
        delete this.table_body[i].idx
        delete this.table_body[i].SRVY_QITEM_CN
        delete this.table_body[i].SRVY_TRGT_ID
      }

      const newTable = [...this.table_body];

      // console.log(newTable);

      var excelData = XLSX.utils.table_to_sheet(
          cloneTable
      );
      var workBook = XLSX.utils.book_new(); // 새 시트 생성

      // 시트이름 설정
      XLSX.utils.book_append_sheet(workBook, excelData, this.sheet_name);
      XLSX.utils.sheet_add_json(excelData, newTable, {origin: 'A3', skipHeader: true});
      const wsHead = this.table_head.map(h => ({
        wch: h.width ? parseInt(h.width.replace('px', ''))/10 : h.text.length * 2 + 2
      }));
      excelData['!cols'] = wsHead;

      XLSX.writeFile(workBook, `${this.file_name}.xlsx`); // 엑셀파일 만듬

      //엑셀 내보내기 완료 후 사용된 시트명이 있다면 초기화 한다
      if (this.sheet_name !== "") {
        this.sheet_name = "";
      }
      this.mixin_prvcInqLog('LIST_EXCEL_DOWN', {FILE_NM : this.file_name, DOWN_REASON : this.$store.getters['alertStore/GE_ALERT'].downReason});
      this.$store.commit("alertStore/hideAlert");
    },

    /**
       * XSS Encode
       */
    mixin_encode(strText) {

      if (strText === "" || strText == null) {
        return strText;
      }

      //strText = strText.toString();

      strText = strText.replaceAll("(", "&#40;");
      strText = strText.replaceAll(")", "&#41;");
      strText = strText.replaceAll("[", "&#91;");
      strText = strText.replaceAll("]", "&#93;");
      strText = strText.replaceAll("&", "&amp;");
      strText = strText.replaceAll('"', "&quot;");
      strText = strText.replaceAll("'", "&apos;");

      strText = strText.replaceAll("\r\n", "<br>");
      strText = strText.replaceAll("\r", "<br>");
      strText = strText.replaceAll("\n", "<p>");

      strText = strText.replaceAll("<", "&lt;");
      strText = strText.replaceAll(">", "&gt;");


      return strText;
    },

    /**
     * XSS Encode 엔터키
     */
    mixin_encodeEnter(strText) {

        if (strText === "" || strText == null) {
          return strText;
        }

        //strText = strText.toString();

        strText = strText.replaceAll("\r\n", "<br>");
        strText = strText.replaceAll("\r", "<br>");
        strText = strText.replaceAll("\n", "<br>");

        return strText;
    },

    //문자열로 \n이 있는 경우(\\n - 역슬래쉬 두개) 줄바꿈 처리.
    mixin_replaceDoubleBackslashNewLine(strText) {
      if (strText === "" || strText == null) {
        return strText;
      }
      strText = strText.replaceAll("\\n", '\n');
      strText = strText.replaceAll("<br>", '\n');
      return strText;
    },

    /**
     * XSS Decode
     */
    mixin_decode(strText) {

      //값존재유무 체크
      if (strText === "" || strText == null) {
        return strText;
      }
      strText = strText.toString();

      //문자열 길이가 4이상일 경우만 처리
      if (strText.length <= 3) {
        return strText;
      }

      strText = strText.replaceAll("&amp;", "&");
      strText = strText.replaceAll("&lt;", "<");
      strText = strText.replaceAll("&gt;", ">");
      strText = strText.replaceAll("&#40;", "(");
      strText = strText.replaceAll("&#41;", ")");
      strText = strText.replaceAll("&#91;", "[");
      strText = strText.replaceAll("&#93;", "]");
      strText = strText.replaceAll("&quot;", '"');
      strText = strText.replaceAll("&apos;", "'");
      strText = strText.replaceAll("<br>", "\r");
      strText = strText.replaceAll("<p>", "\n");

      return strText;
    },

    /**
     * XSS Decode
     */
    mixin_decodeEnter(strText) {

      //값존재유무 체크
      if (strText === "" || strText == null) {
        return strText;
      }
      strText = strText.toString();

      //문자열 길이가 4이상일 경우만 처리
      if (strText.length <= 3) {
        return strText;
      }

      strText = strText.replaceAll("<br>", "\r");
      strText = strText.replaceAll("<p>", "\n");

      return strText;
    },

    /**
     * XSS Decode
     */
    mixin_decodeJson(strText) {

      //값존재유무 체크
      if (strText === "" || strText == null) {
        return strText;
      }
      strText = strText.toString();

      //문자열 길이가 4이상일 경우만 처리
      if (strText.length <= 3) {
        return strText;
      }

      strText = strText.replaceAll("&#35;", "#");
      strText = strText.replaceAll("&#123;", "{");
      strText = strText.replaceAll("&#125;", "}");

      return strText;
    },

    /**
     *
     * 퍼블 UI : 공통
     */
    // mark: UI
    mixin_testLog(text){
      console.log( `////test log : ${text}` );
    },
    // badge 상태값 치환
    mixin_displayStatus(stat, statList) {
      let arrStatList = this[`${statList}`];
      if(stat){
        for (let i = 0; i < arrStatList.length; i++) {
          if (arrStatList[i].code === stat) {
            return arrStatList[i].value;
          }
        }
      } else {
        return arrStatList[0].value;
      }
    },
    // mark: alert ,toast
    ...mapMutations({
      showAlert: "alertStore/showAlert",
    }),
    ...mapActions({
      showToast: "toastStore/showToast",
      hideToast: "toastStore/hideToast",
    }),

    // new line
    mixin_newLine(title) {
      if (!title) return;
      return title.split("\n").join("<br>");
    },

    // sub top search toggle
    mixin_searchDetailToggle() {
      this.searchDeatilToggle = !this.searchDeatilToggle;
    },

    //grid get row span
    mixin_getRowCount(index, type) {
      let rowCount = 1;
      for (let i = index + 1; i < this.itemsRowSpan.length; i++) {
        if (this.itemsRowSpan[i][type] === this.itemsRowSpan[i - 1][type]) {
          rowCount++;
        } else {
          break;
        }
      }
      return rowCount;
    },
    //grid get header class
    mixin_getHeaderClass(align) {
      const alignmentClass = {
        left: 'text-start',
        right: 'text-end',
        center: 'text-center',
      };
      return alignmentClass[align] || '';
    },
    //grid hover menu
    mixin_getItemClass(item) {
      const hoverClass = item.index === this.hoverRow ? "hover" : "";
      return hoverClass;
    },
    mixin_hoverItem(event, arr) {
      // const item = this.items.find((item) => item === event);
      const item = this[`${arr}`].find((item) => item === event);
      if(item) {
        this.hoverRow = item.index;
      }
    },
    mixin_leaveItem(event, arr) {
      // const item = this.items.find((item) => item === event);
      const item = this[`${arr}`].find((item) => item === event);
      if(item) {
        this.hoverRow = null;
      }
    },

    // grid getpagePeriod
    mixin_getPagePeriod(dataTalbe, dataPage) {
      return `${(dataPage - 1) * this.ROW_PER_PAGE + 1} - ${dataPage * this.ROW_PER_PAGE >= dataTalbe.length ? dataTalbe.length : dataPage * this.ROW_PER_PAGE }`;
    },

    //openPop
    mixin_openWindow(name,  width, height, item) {
      let left = (screen.width - width) / 2,
        top = (screen.height - height) / 4;

      const url = `${window.location.origin}/LayoutPopup/${JSON.parse(window.sessionStorage.getItem("vuex")).commonStore.active_tab.id}`;

      if (this.windowPopup && !this.windowPopup.closed) {
        // 팝업이 이미 열려 있는 경우, 해당 팝업을 활성화
        this.windowPopup.focus();
        this.windowPopup.postMessage({key:'message', val: '열려져 있는 팝업창을 닫고 다시 선택해 주세요.'}, '*');
      } else {
        // 팝업이 열려 있지 않은 경우, 새 팝업 창 열기
        this.windowPopup = window.open(url, '_blank', 'width='+width+',height='+height+',left='+left+',top='+top+',resizable=true,toolbar=no,menubar=no,status=no,location=no,directories=no');

        // 팝업이 로드되었을 때 sessionStorage에 토큰을 설정
        this.windowPopup.onload = () => {
          this.windowPopup.sessionStorage.setItem('token', sessionStorage.getItem('token'));

          // 부모 창에서 팝업 창으로 데이터 전송
          this.windowPopup.postMessage({ item }, '*');
        };

        // 팝업이 닫혔을 때 popup 변수 초기화
        const interval = setInterval(() => {
          if (this.windowPopup.closed) {
            clearInterval(interval);
            this.windowPopup = null;
          }
        }, 1000);

        //부모 창의 Vue 인스턴스를 전역으로 저장
        window.parentVueInstance = this;
      }
    },

    //팝업창에 sessionStorage 재주입
    mixin_parentSessionStorage(){
      this.windowPopup.sessionStorage.setItem("vuex", window.sessionStorage.getItem("vuex"));
    },

    //dialog draggable
    // mixin_dragDialog() {
    //   // make vuetify dialogs movable
    //   const d = {};
    //   document.addEventListener("mousedown", (e) => {
    //     const closestDialog = e.target.closest(
    //       ".dialog-draggable.v-dialog.v-dialog--active"
    //     );
    //     if (
    //       e.button === 0 &&
    //       closestDialog != null &&
    //       e.target.classList.contains("draggable-area")
    //     ) {
    //       // element which can be used to move element
    //       d.el = closestDialog; // element which should be moved
    //       d.mouseStartX = e.clientX;
    //       d.mouseStartY = e.clientY;
    //       d.elStartX = d.el.getBoundingClientRect().left;
    //       d.elStartY = d.el.getBoundingClientRect().top;
    //       d.el.style.position = "fixed";
    //       d.el.style.margin = 0;
    //       d.oldTransition = d.el.style.transition;
    //       d.el.style.transition = "none";
    //     }
    //   });
    //   document.addEventListener("mousemove", (e) => {
    //     if (d.el === undefined) return;
    //     d.el.style.left =
    //       Math.min(
    //         Math.max(d.elStartX + e.clientX - d.mouseStartX, 0),
    //         window.innerWidth - d.el.getBoundingClientRect().width
    //       ) + "px";
    //     d.el.style.top =
    //       Math.min(
    //         Math.max(d.elStartY + e.clientY - d.mouseStartY, 0),
    //         window.innerHeight - d.el.getBoundingClientRect().height
    //       ) + "px";
    //   });
    //   document.addEventListener("mouseup", () => {
    //     if (d.el === undefined) return;
    //     d.el.style.transition = d.oldTransition;
    //     d.el = undefined;
    //   });
    //   setInterval(() => {
    //     // prevent out of bounds
    //     const dialog = document.querySelector(".v-dialog.v-dialog--active");
    //     if (dialog === null) return;
    //     dialog.style.left =
    //       Math.min(
    //         parseInt(dialog.style.left),
    //         window.innerWidth - dialog.getBoundingClientRect().width
    //       ) + "px";
    //     dialog.style.top =
    //       Math.min(
    //         parseInt(dialog.style.top),
    //         window.innerHeight - dialog.getBoundingClientRect().height
    //       ) + "px";
    //   }, 100);
    // },
    mixin_dragDialog() {
      const d = {};

      function handleDragStart(e) {
        const closestDialog = e.target.closest(
          ".dialog-draggable.v-dialog.v-dialog--active"
        );

        if (
          (e.type === "mousedown" && e.button === 0) || // Mouse event
          (e.type === "touchstart" && e.touches.length === 1) // Touch event with a single touch point
        ) {
          if (closestDialog != null && e.target.classList.contains("draggable-area")) {
            // Element which can be used to move the dialog
            d.el = closestDialog; // Element which should be moved
            if (e.type === "mousedown") {
              d.mouseStartX = e.clientX;
              d.mouseStartY = e.clientY;
            } else if (e.type === "touchstart") {
              d.mouseStartX = e.touches[0].clientX;
              d.mouseStartY = e.touches[0].clientY;
            }
            const rect = d.el.getBoundingClientRect();
            d.elStartX = rect.left + window.scrollX;
            d.elStartY = rect.top + window.scrollY;
            d.el.style.position = "fixed";
            d.el.style.margin = 0;
            d.oldTransition = d.el.style.transition;
            d.el.style.transition = "none";
          }
        }
      }

      function handleDragMove(e) {
        if (d.el === undefined) return;

        if (e.type === "mousemove") {
          d.currentX = e.clientX;
          d.currentY = e.clientY;
        } else if (e.type === "touchmove") {
          d.currentX = e.touches[0].clientX;
          d.currentY = e.touches[0].clientY;
        }

        const newLeft = Math.min(
          Math.max(d.elStartX + d.currentX - d.mouseStartX, 0),
          window.innerWidth - d.el.offsetWidth
        );

        const newTop = Math.min(
          Math.max(d.elStartY + d.currentY - d.mouseStartY, 0),
          window.innerHeight - d.el.offsetHeight
        );

        d.el.style.left = newLeft + "px";
        d.el.style.top = newTop + "px";
      }

      function handleDragEnd() {
        if (d.el === undefined) return;

        d.el.style.transition = d.oldTransition;
        d.el = undefined;
      }

      document.addEventListener("mousedown", handleDragStart);
      document.addEventListener("touchstart", handleDragStart);

      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("touchmove", handleDragMove);

      document.addEventListener("mouseup", handleDragEnd);
      document.addEventListener("touchend", handleDragEnd);

      setInterval(() => {
        // Prevent dialog from going out of bounds
        const dialog = document.querySelector(".v-dialog.v-dialog--active");
        if (dialog === null) return;

        const newLeft = Math.min(
          parseInt(dialog.style.left),
          window.innerWidth - dialog.getBoundingClientRect().width
        );

        const newTop = Math.min(
          parseInt(dialog.style.top),
          window.innerHeight - dialog.getBoundingClientRect().height
        );

        dialog.style.left = newLeft + "px";
        dialog.style.top = newTop + "px";
      }, 100);
    },

    // showDialog
    mixin_showDialog(type) {
      this[`dialog${type}`] = true;
      this.mixin_dragDialog();

      console.log(`show ${type}`);
    },
    mixin_hideDialog(type){
      this[`dialog${type}`] = false
      if(type == 'LoginFindMessageModel') location.href='/login';
    },

    // open windown popup
    // mixin_openWindow(url, name, width, height) {
    //   let left = (screen.width - width) / 2,
    //       top = (screen.height - height) / 4;
    //   let routeData = this.$router.resolve(url);
    //   window.open(
    //     routeData.href,
    //     name,
    //     "width=" + width + ",height=" + height + ",left=" + left + ",top=" + top
    //   );
    // },

    //date picker
    //Drop Picker 날짜 구하기
    mixin_getDatePeriod(startDate, endDate, day, month, bbsDate ){

      let calculateDate = startDate;
      let currentDate = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
      if( day === 0 && month === 0) {
        this[`${startDate}`] = currentDate;
        this[`${endDate}`] = currentDate;
        return;
      }

      if(bbsDate){
        // 게시글관리 - 게시기간 설정시 기준 currentDate
        if(day !== 0){
          calculateDate = this.$moment(currentDate).subtract(day,'days').format('YYYY-MM-DD');
        }else if(month !== 0){
          calculateDate = this.$moment(currentDate).subtract(month,'months').format('YYYY-MM-DD');
        }else{
          calculateDate = currentDate;
        }
      }else if(day !== 0) {
        calculateDate = this.$moment(this[`${endDate}`]).subtract(day,'days').format('YYYY-MM-DD');

      } else if(month !== 0) {
        calculateDate = this.$moment(this[`${endDate}`]).subtract(month,'months').format('YYYY-MM-DD');
      } else {
        // calculateDate = this[`${startDate}`];
        calculateDate = this[`${endDate}`];
      }
      // this[`${endDate}`] = calculateDate;
      this[`${startDate}`] = calculateDate;
    },

    // selecte sort
    mixin_selected_sort(arr, index) {
      const sort_list = this[`${arr}`];

      for (let i = 0; i < sort_list.length; i++) {
        sort_list[i].selected = false;
      }
      sort_list[index].selected = true;

    },

    //메뉴 라우팅 등록
    //새로고침 라우터
    mixin_setRouter(){
      let menuList = this.$store.getters["userStore/GE_USER_MENU_LIST"];
      let menuDevList = this.$store.getters["userStore/GE_DEV_MENU"];
      let len = menuList.length;
      let menu = [];
      for (let i = 0; i < len; i++) {
        menu[i] = {
          path: "/" + menuList[i].C_NODE_NO,
          name: menuList[i].NODE_TITLE,
          viewTrgt: menuList[i].VIEW_TRGT
        };
      }
      for (let i = 0; i < menuDevList.length; i++) {
        for(let k = 0; k < menuDevList[i].child.length; k++) {
          menu[len+i+k] = {
            path: "/" + menuDevList[i].child[k].C_NODE_NO,
            name: menuDevList[i].child[k].NODE_TITLE,
            viewTrgt: menuDevList[i].child[k].VIEW_TRGT
          };
        }
      }

      setMenu(menu);

    },

    mixin_convertDate(v, f){
      if (!v) return " ";
      var weekShortName = ["일", "월", "화", "수", "목", "금", "토"];

      var d = new Date(v.substr(0, 4), v.substr(4,2)-1, v.substr(6,2), v.substr(8,2), v.substr(10,2), v.substr(12,2));
        f = f.substr(0, 4)+f.substr(4, 1)+f.substr(5, 2)+f.substr(7, 1)+f.substr(8, 2)+f.substr(10, 1)+f.substr(11, 2)+f.substr(13, 1)+f.substr(14, 2)+f.substr(16, 1)+f.substr(17, 2)+f.substr(19, 1)+f.substr(20, 3);


      return f.replace(/(yyyy|yy|MM|dd|E|HH|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return v.length >= 6 ? new ConvertDate((d.getMonth() + 1)).zf(2) : "";
            case "dd": return v.length >= 8 ? new ConvertDate(d.getDate()).zf(2) : "";
            case "E": return v.length >= 8 ? weekShortName[d.getDay()] : "";
            case "HH": return v.length >= 10 ? new ConvertDate(d.getHours()).zf(2) : "00";
            // case "hh": return v.length >= 10 ? new ConvertDate(((h = d.getHours() % 12) ? h : 12)).zf(2) : "00";
            case "mm": return v.length >= 12 ? new ConvertDate(d.getMinutes()).zf(2) : "00";
            case "ss": return v.length >= 14 ? new ConvertDate(d.getSeconds()).zf(2) : "00";
            case "a/p": return v.length >= 10 ? (d.getHours() < 12 ? '오전' : '오후') : "";
            default: return $1;
        }
      });
    },

    // 기준시간부터 00전
    async mixin_beforeDate(before) {
      let beforeDate = new Date(before);

      let now = this.mixin_convertDate(await  this.mixin_getSvrDate("YYYYMMDDHH24MISS"), 'yyyy-MM-dd HH:mm:ss');
      let nowDate = new Date(now);

      let milliSeconds = nowDate - beforeDate

      const seconds = milliSeconds / 1000
      if (seconds < 60) return `방금 전`
      const minutes = seconds / 60
      if (minutes < 60) return `${Math.floor(minutes)}분 전`
      const hours = minutes / 60
      if (hours < 24) return `${Math.floor(hours)}시간 전`
      const days = hours / 24
      if (days < 7) return `${Math.floor(days)}일 전`
      const weeks = days / 7
      if (weeks < 5) return `${Math.floor(weeks)}주 전`
      const months = days / 30
      if (months < 12) return `${Math.floor(months)}개월 전`
      const years = days / 365
      return `${Math.floor(years)}년 전`
    },

    // 문자/알림톡 단건 발송
    async mixin_sendMessage(params){

      // console.log('params:::', params);

      let URLData = '/phone-api/placeContact/sendInfo';
      let postParam;
      let img = params.attachment.image;

      if(params.sndngSeCd != 'ATALK'){
        postParam = {
          auth_code: ''
          , callback_number: params.callback_number // 발신전화번호
          , phone_number: params.phone_number       // 사용자 전화번호
          , message: params.message                 // 사용자에게 전달될 메시지
          , send_date: params.send_date             // 발송예정일
          , SNDNG_SE_CD: params.sndngSeCd           // 발송구분코드 - SMS/LMS/MMS/ATALK 구분
          , img_url: img.length > 0  ? img : {}     // 이미지 파일 정보
          , tenantId : this.$store.getters["authStore/GE_CUSTCO_TENANT_ID"]
        }

        if('subject' in params) postParam['subject'] = params.subject;
      }else{
        postParam = {
          auth_code: ''
          , sender_key: params.sender_key           // 발신프로필키
          , template_code: params.template_code     // 템플릿코드
          , callback_number: params.callback_number // 발신전화번호
          , phone_number: params.phone_number       // 사용자 전화번호
          , message: params.message                 // 사용자에게 전달될 메시지
          , send_date: params.send_date             // 발송예정일
          , SNDNG_SE_CD: params.sndngSeCd           // 발송구분코드 - SMS/LMS/MMS/ATALK 구분
          , attachment: params.attachment.button    // 버튼정보
          , title: params.title                     // 강조표기형 - 강조제목
          , tran_type: params.tran_type             // 전환전송 구분 S,L,M,N
          , subject: params.subject                 // 전환전송 제목 - 전환전송 구분값이 L,M일 경우
          , tran_message: params.tran_message       // 전환전송 내용
          , imageFlag: params.imageFlag             // 이미지형 - 이미지 파일 여부
          , tenantId : this.$store.getters["authStore/GE_CUSTCO_TENANT_ID"]
        }
      }

      let headParam = {
        head : {}
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        // console.log('response.DATA', response.DATA);
        if(response.DATA[0].code === '0000'){
          // this.showAlert(this.MESSAGE.ALERT.SEND_SUCCESS);
          if('toastView' in params){
            if(params.toastView) this.showToast(params.toastMsg);
          }else{
            this.showToast(this.MESSAGE.TOAST.SEND_SUCCESS);
          }
          return response.DATA;
        }else{
          this.showAlert(this.MESSAGE.ALERT.SEND_FAIL);
        }
      }
    },

    // 전화 콜 이력 저장 처리
    async mixin_phnCallHistSave(params){
      let sUrl = '/api/palette/common/phnCallHistReg';

      let postParam = {
        CUTT_RSVT_ID: params.CUTT_RSVT_ID //상담 예약 ID
        , CUSL_ID: params.CUSL_ID //상담사 ID
        , CLBK_ID: params.CLBK_ID //콜백 ID
        , CUST_ID: params.CUST_ID //고객 ID
        , CPI_ID: params.CPI_ID //캠페인 ID
        , CUST_PHN_NO: params.CUST_PHN_NO.replace(/[^0-9]/g, "") //고객 전화 번호
      }

      let headParam = {
        head : {}
      }

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        console.log('phnCallHistSave OK');
      }
    },

    //개인정보 조회 로그
    async mixin_prvcInqLog( taskSeCd, paramObj ){
      let sUrl = '/api/palette/common/prvcInqLog';

      let postParam = paramObj;
      postParam.TASK_SE_CD = taskSeCd;
      postParam.TRGT_ID = paramObj.trgtId;

      let headParam = {
        head : {}
      }

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        console.log('prvcInqLog OK');
      }
    },

    /*
     * 컴포넌트형이 아닌 버튼형식일때 엑셀 업로드
     * 엑셀 데이터가 공백이여도 업로드 될 수 있게 처리
    */
    uploadExcel(file, tempGridHeaders) {
      let upload_bodys = [];
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
        var oData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        let getData = [];
        let oHeaders = _.cloneDeep(tempGridHeaders);
        oHeaders.splice(0, 1);
        //엑셀에 빈값이 있는경우 빈값을 셋팅한다.(빈값은 엑셀라이브러리에서 빠져버림.)
        oData.forEach(e => {
          let o = {};
          oHeaders.forEach(v => {
            o[v.text] = (this.mixin_isEmpty(e[v.text]) ? '' : e[v.text]);
          });
          getData.push(o);
        });
        if (getData.length > 0) {
          getData.map(v => {
            let map = {}
            for(let n=0;n<Object.keys(v).length;n++){
              for(let i=0;i<oHeaders.length;i++){
                if(oHeaders[i].text === Object.keys(v)[n]){
                  map[oHeaders[i].value] = v[Object.keys(v)[n]]
                  break;
                }
              }
            }
            upload_bodys.push(map)
          })
        }
        this.getExcelData(oHeaders, upload_bodys);
      };
      reader.readAsArrayBuffer(file);
    },

    //채팅 설정값 가져오기
    async mixin_getChtStng(stngCd){
      let sUrl = '/chat-api/main/getChtStng';
      let postParam = {
        STNG_CD: stngCd
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        if(response.DATA[0]){
          if('STNG_VL' in response.DATA[0]){
            return response.DATA[0].STNG_VL;
          }else{
            return 'N';
          }
        }else{
          return 'N';
        }
      }
    },

    //mts 발송 결과 가져오기
    async mixin_getSndngRslt(mts){
      let sUrl = '/api/mts/send/getSndngRslt';
      let postParam = {
        SEND_DATE: mts.SNDNG_DT.replaceAll("-","").substring(0,8),
        SEND_TYPE: mts.SEND_TP,
        SENDER_KEY: mts.RSLT_MSG.indexOf("||senderKey:") == -1 ? "" : mts.RSLT_MSG.substring(mts.RSLT_MSG.indexOf("||senderKey:")+12, mts.RSLT_MSG.indexOf("||tmplCd:")),
        MTS_SNDNG_HSTRY_GROUP_ID: mts.RSLT_MSG.indexOf("||group:") == -1 ? "" : (mts.RSLT_MSG.indexOf("||senderKey:") == -1 ? mts.RSLT_MSG.substring(mts.RSLT_MSG.indexOf("||group:")+8) : mts.RSLT_MSG.substring(mts.RSLT_MSG.indexOf("||group:")+8, mts.RSLT_MSG.indexOf("||senderKey:"))),
        MTS_SNDNG_HSTRY_ID: mts.MTS_SNDNG_HSTRY_ID,
        PHN_NO: mts.RECEIVE_NO.replaceAll('-',''),
        TENANT_ID: this.$store.getters["authStore/GE_CUSTCO_TENANT_ID"],
        ETC_MSG: mts.RSLT_MSG.indexOf("||") == -1 ? "" : mts.RSLT_MSG.substring(mts.RSLT_MSG.indexOf("||"))
      }

      let headParam = {
        head : {
        },
        timeout: 3600000
      }
      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
      let response = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        let result = {
          result_code: response.DATA[0].result_code
          , real_send_date: response.DATA[0].real_send_date
        }
        return result;
      }
    },

    //고객사별 환경설정 값 조회
    mixin_getCustcoSetting(setVal) {
      let custcoSetting = this.$store.getters['commonStore/GE_CUSTCO_SETTING'];
      
      if(setVal in custcoSetting){
        if(setVal === 'ENV_TMPL_TP' || setVal === 'ENV_SRVY_DSPTCH_NO_TP'){ //템플릿 변경인 경우
          return custcoSetting[setVal].ATTR_VL;
        }else{
          return custcoSetting[setVal].ATTR_VL === 'Y' ? true : false;
        }
      }else{
        if(setVal === 'ENV_SRVY_TRGT_DSGN_USE_YN'){
          //설문 대상지정 사용 여부 기본 값
          return true;
        }else if(setVal === 'ENV_SRVY_DSPTCH_NO_TP'){
          //설문 발신 번호 유형 기본 값
          return "DEFAULT";
        }else{
          return false;
        }
      }
    },
    
    //고객사별 서비스 상태
    mixin_getCustcoSrvcStat(setVal) {
      let custcoSrvc = this.$store.getters["userStore/GE_USER_ROLE"].company.SRVC_INFO;
      
      if(custcoSrvc){
        if(setVal in custcoSrvc){
          return custcoSrvc[setVal] === 'Y' ? true : false;
        }else{
          return false;
        }
      }else{
        return false;
      }
    },

    //환경설정 정보 해당 스키마 사용자에게 PUSH
    mixin_push_custco_env(){
      let postParam = {
        type : 'ENV_SETTING',
        sender : this.$store.getters['userStore/GE_USER_ROLE'].userId,
        message : '',
        receiver : 'ALL',
        pos : 'top',
        second : 5,
        roomId : this.$store.getters["authStore/GE_CUSTCO_TENANT_ID"] + "_" + this.$store.getters['userStore/GE_USER_ROLE'].company.CD,
      }
      let sseResponse = this.common_postCall(process.env.VUE_APP_SSE_URL + '/send/message', postParam, {head: {}});
    },

    // 파일크기 포맷
    mixin_format_bytes(bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },

    //------------------------------------------
    // 공통화????
    //------------------------------------------
    showAlertInfo(obj) {
      var defaultObj = {
        alertDialogToggle: true,
        msg: '공통 alert INFO',
        iconClass: 'is-info',
        type: 'default',
        callAfter: undefined
      };
      if (obj.alertDialogToggle) defaultObj.alertDialogToggle = obj.alertDialogToggle;
      if (obj.msg) defaultObj.msg = obj.msg;
      if (obj.type) defaultObj.type = obj.type;
      if (obj.callAfter) defaultObj.callAfter = obj.callAfter;

      this.showAlert(defaultObj);
    },

    showAlertCaution(obj) {
      var defaultObj = {
        alertDialogToggle: true,
        msg: '공통 alert CUATION',
        iconClass: 'is-caution',
        type: 'default',
        callAfter: undefined
      };
      if (obj.alertDialogToggle) defaultObj.alertDialogToggle = obj.alertDialogToggle;
      if (obj.msg) defaultObj.msg = obj.msg;
      if (obj.type) defaultObj.type = obj.type;
      if (obj.callAfter) defaultObj.callAfter = obj.callAfter;

      this.showAlert(defaultObj);
    },

    showConfirmInfo(obj) {
      var defaultObj = {
        alertDialogToggle: true,
        msg: '공통 confirm - INFO',
        iconClass: 'is-info',
        type: 'confirm',
        callYes: undefined,
        callNo: undefined,
        callAfter: undefined
      }
      if (obj.alertDialogToggle) defaultObj.alertDialogToggle = obj.alertDialogToggle;
      if (obj.msg) defaultObj.msg = obj.msg;
      if (obj.type) defaultObj.type = obj.type;
      if (obj.callYes) defaultObj.callYes = obj.callYes;
      if (obj.callNo) defaultObj.callNo = obj.callNo;
      this.showAlert(defaultObj);
    },

    showConfirmCuation(obj) {
      var defaultObj = {
        alertDialogToggle: true,
        msg: '공통 confirm - cuation',
        iconClass: 'is-cuation',
        type: 'confirm',
        callYes: undefined,
        callNo: undefined,
        callAfter: undefined
      }
      if (obj.alertDialogToggle) defaultObj.alertDialogToggle = obj.alertDialogToggle;
      if (obj.msg) defaultObj.msg = obj.msg;
      if (obj.type) defaultObj.type = obj.type;
      if (obj.callYes) defaultObj.callYes = obj.callYes;
      if (obj.callNo) defaultObj.callNo = obj.callNo;
      this.showAlert(defaultObj);
    },
    closeAlert() {
      this.$store.commit("alertStore/hideAlert");
    },
    showToastCaution(obj) {
      var defaultObj = {
        act: true,
        msg: '공통 Toast caution',
        class : 'warning',
        hasToastIcon : true,
        icon: 'mdi-close-circle',
        time : 3000,
        close : false,
        callAfter: undefined
      };

      if (obj.msg) defaultObj.msg = obj.msg;
      if (obj.time) defaultObj.time = obj.time;
      if (obj.close) defaultObj.close = obj.close;
      if (obj.callAfter) defaultObj.callAfter = obj.callAfter;

      this.showToast(defaultObj);
    },
    showToastSuccess(obj) {
      var defaultObj = {
        act: true,
        msg: '공통 Toast success',
        class : 'success',
        hasToastIcon : true,
        icon: 'mdi-checkbox-marked-circle',
        time : 3000,
        callAfter: undefined
      };

      if (obj.msg) defaultObj.msg = obj.msg;
      if (obj.time) defaultObj.time = obj.time;
      if (obj.callAfter) defaultObj.callAfter = obj.callAfter;

      this.showToast(defaultObj);
    },
    showToastInfo(obj) {
      var defaultObj = {
        act: true,
        msg: '공통 Toast info',
        class : 'info',
        hasToastIcon : true,
        icon: 'mdi-information-outline',
        time : 3000,
        callAfter: undefined
      };

      if (obj.msg) defaultObj.msg = obj.msg;
      if (obj.time) defaultObj.time = obj.time;
      if (obj.icon) defaultObj.icon = obj.icon;
      if (obj.callAfter) defaultObj.callAfter = obj.callAfter;

      this.showToast(defaultObj);
    },
    setFocus(id) {
      setTimeout(() => this.$refs[id].focus(), 100);
    },

    //external-api서버 호출
    async mixin_callAxios(method,url,data){
      let returnData = '';
      if(data){
      } else {
        data = {};
      }
      let params = {
        method: method,
        url: url,
        headers: { 
          'X-Authorization': 'bearer FHeyMNl6jNknvgTGfT3RS5a3w1EQd1fqLVriEH3F/Jql7rNDbu5mqRyVwPbLH0NEGdsGt2eS+wAz0Dx+3iM2H5YEEpDzjEushrjU4f/B5Mp0onp0O4s2l3AA96sucDzCaQQw1qrPcSIKBrHkbSbEfUNNDwwZGobPkHiZyqQCfBAqLNRqMlBvDOEFnewI1iQJJ7NL7QPZP375Ys2QcFqUQQ=='
        },
        data : data
      }
      await axios.request(params)
      .then(response=>{
        console.log("response.data.responseData", response.data.responseData);
        if(response.data.responseData){
          returnData = response.data.responseData;
        } else {
          returnData = [];
        }
      })
      .catch(error=>{
        returnData = error;
      })

      return returnData;
    },

    //(설문)부서 리스트 조회
    async mixin_getDeptList(){
      let returnData = [];

      let sUrl = '/api/palette/common/getDeptList';

      let postParam = {}

      let headParam = {
        head : {}
      }

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        returnData = response.DATA;
      }
      return returnData;
    },
    async mixin_loadOgnzList() {

      let response  = await this.mixin_getDeptList();

      if (response){
        //조직 Tree 데이터
        if(response){
          response.unshift({DEPT_NM:'전체', DEPT_ID : ''})
          if( this.$store.getters["commonStore/GE_COMMON_OGNZ_LIST"].length < 2 ) {
            this.$store.dispatch("commonStore/AC_COMMON_SETTING_OGNZ_LIST", response);
          }
        }
      }
    },

    //상담유형 리스트(select items)에서 상담유형 코드를 넣어 상담유형명을 반환
    mixin_convertListCdNm(list,cd){
      let text = cd;
      for(let i=0;i<list.length;i++){
        if(list[i].VALUE == cd || list[i].value == cd ){
          text = list[i].TEXT ? list[i].TEXT : list[i].text;
          break;
        }
      }
      return text
    }
  },

  /**
   * 챗관련 추가 Start_Arthur.Kim
   */
  filters: {

    /**
     * XSS이 적용된 문자를 원래문자로 변환한다.(필터처리)
     * @param {String} strText 전체 문자열
     */
    restoreXSSFilter (strText) {

      //값존재유무 체크
      if(strText === "" || strText == null) {
        return strText;
      }

      strText = strText.toString();
      // strText = JSON.parse(strText);

      //문자열 길이가 4이상일 경우만 처리
      if(strText.length <= 3) {
        return strText;
      }

      //XSS이 적용되었을 경우 원래 문자로 치환하여 반환한다.
      strText = strText.split("&amp;").join("&");
      strText = strText.split("&lt;").join("<");
      strText = strText.split("&gt;").join(">");
      strText = strText.split("&#40;").join("(");
      strText = strText.split("&#41;").join(")");
      strText = strText.split("&apos;").join("'");
      strText = strText.split("&#91;").join("[");
      strText = strText.split("&#93;").join("]");
      strText = strText.split("&quot;").join('"');

      return strText;
    },
  },
};
