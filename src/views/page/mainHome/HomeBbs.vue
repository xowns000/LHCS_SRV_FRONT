<template>
  <div class="">
    <v-tabs class="pl-tabs" >
      <v-tab
        v-for="item, index in SORT_ITEMS"
        :key="item.id"
        :class="item.selected ? 'selected' : ''"
        @click="FnEvt(item, index, 'ALARM_SORT', 'SORT_ITEMS')"
        >
        {{ item.title }}
      </v-tab>
      <div class="d-flex align-center ml-auto mr-5">
        <!-- 게시판 바로가기 버튼 -->
        <compo-tooltip-btn
          TitleProp="게시판 바로가기"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 plus"
          TooltipPositionProp="bottom"
          @btnClick="OpenAlarmDialog()"
        ></compo-tooltip-btn>
      </div>
      <!-- 공지사항 -->
      <v-tab-item
        v-for="item in SORT_ITEMS"
        >
        <div class="pl-card pl-home-board-list-wrap">
          <div
            v-for="item in BRD_LIST"
            :key="item.id"
            class="pl-home-board-list"
            @click="brdDetail(item)"
            >
            <span>
              {{ item.PST_TTL.length > 25 ? item.PST_TTL.substr(0, 25 - 2) + '...' : item.PST_TTL }}
<!--              <span :class="`badge-NEW`"-->
<!--                    v-show="-->
<!--                      item.EDITOR_NAME ?-->
<!--                      (new Date(item.MDFCN_DT) >= new Date().setDate(new Date().getDate() - 6) ? true : false)  :-->
<!--                      (new Date(item.REG_DT) >= new Date().setDate(new Date().getDate() - 6) ? true : false) "-->
<!--                    class="pl-alarm-list-badge">NEW</span>-->
              <span :class="`badge-NEW`" v-show="new Date(item.REG_DT) >= new Date().setDate(new Date().getDate() - 6) ? true : false" class="pl-alarm-list-badge">NEW</span>
               <span :class="`badge-${item.badge_text}`" v-if="item.badge">{{item.badge_text }}</span>
            </span>
            <span class="pl-home-board-list-date">
              {{ item.REG_DT }}
<!--              {{ item.EDITOR_NAME ? item.MDFCN_DT.substring(0,10) : item.REG_DT }}-->
            </span>
          </div>
        </div>
        <v-dialog
          v-model="dialogHomeBbsDetail"
          content-class="dialog-draggable is-scroll"
          hide-overlay>
          <div class="draggable-area">drag area</div>
          <compo-dialog
            header-title="공지사항"
            @hide="mixin_hideDialog('HomeBbsDetail')"
          >
            <template slot="body">
              <compo-noti-detail
                :NotiDetailProp.sync="NotiDetail"
              />
            </template>
          </compo-dialog>
        </v-dialog>
        <template v-if="BRD_LIST.length == 0">
          <li class="pl-list-nodata">
            <span>등록된 데이터가 없습니다.</span>
          </li>
        </template>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { eventBus } from "@/store/eventBus.js";
export default {
  name: "MENU_home_bbs", //name은 'MENU_' + 파일명 조합
  props: {
    DataProp: Object,
  },
  components: {
  },
  data() {
    return {
      BRD_LIST: [],
      SORT_ITEMS: [],
      dialogHomeBbsDetail: false,
      NotiDetail: {
        subject: '',
        count: '',
        date: '',
        editDate: '',
        time: '',
        manager: '',
        editUser: '',
        text: '',
        pst_id: '',
        file_group_key: '',
        filelist: [],
      },

      MESSAGE : {
        CONFIRM : {
        },
        ALERT : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
      }
    },


    }
  },

  watch: {

  },

  computed: {

  },

  async created() {
    // 공통코드로 게시유형 관리
    let codeName = ['BORD_TP'];
    this.common_code = await this.mixin_common_code_get_all(codeName);
    for(let i=0; i<this.common_code[0].group_value.length; i++){
      this.SORT_ITEMS.push({
        title: this.common_code[0].group_value[i].CD_NM,
        selected: false,
        type: this.common_code[0].group_value[i].CD
      });
    }

    this.$eventBus.$on('reloadBrdList', (type)=>{
      this.GetBrdList(type);
    });

  },

  mounted() {
    this.GetBrdList('GENR');
  },

  methods: {

    // 게시글 detail
    brdDetail(item){

      // 파일리스트 초기화
      this.NotiDetail.filelist = [];

      this.NotiDetail.subject = item.PST_TTL;
      this.NotiDetail.count = item.INQ_CNT;
      this.NotiDetail.date = item.REG_DT;
      this.NotiDetail.editDate = item.MDFCN_DT;
      // this.NotiDetail.time = item.time;
      this.NotiDetail.manager = item.USER_NAME;
      this.NotiDetail.editUser = item.EDITOR_NAME;
      this.NotiDetail.text = item.PST_CN;
      this.NotiDetail.pst_id = item.PST_ID;
      this.NotiDetail.file_group_key = item.FILE_GROUP_KEY;

      if(!this.mixin_isEmpty(this.NotiDetail.file_group_key)){
        this.getBoardFiles();
      }

      if(!this.dialogHomeBbsDetail){

        // 조회수 조회
        this.selectCnt();

        // 조회수 증가함수 호출
        this.increaseCnt();

        this.mixin_showDialog('HomeBbsDetail');
      }
    },

    // 게시글 상세조회시 등록된 파일조회
    async getBoardFiles(){

      let sUrl = '/api/board/file-list';
      let postParam = {
        PST_ID: this.NotiDetail.pst_id,
        FILE_GROUP_KEY: this.NotiDetail.file_group_key,
        TASK_TYPE_CD: 'bbs',
        BBS_ID: '1'
      }
      let headParam = {
        head: {
        }
      }

      let response = await this.common_postCall(sUrl, postParam, headParam)
      if(!response.HEADER.ERROR_FLAG){
        // console.log('response.DATA', response.DATA);
        for(let i=0; i<response.DATA.length; i++){
          this.NotiDetail.filelist.push({
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
          })
        }
        // console.log(this.NotiDetail.filelist);
      }
    },

    // 조회수 증가
    async increaseCnt(){

      let URLData = '/api/board/increaseCnt';
      let postParam = {
        BBS_ID : '1' // 게시판ID
        , PST_ID : this.NotiDetail.pst_id // 게시글ID
        , INQ_CNT : this.NotiDetail.count // 조회수
      }

      let headParam = {
        head : {
        }
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
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

    async OpenAlarmDialog(){
      eventBus.setTrue(true);
    },

    FnEvt(item, index, type, arr) {
      // console.log('item', item);
      if(type === "ALARM_SORT"){
        this.GetBrdList(item.type);
      }
      this.mixin_selected_sort(arr, index);
      this[type] = item.type;
    },

    // 게시글 리스트 조회
    async GetBrdList(item){
      // console.log('item', item);
      let URLData = '/api/board/selectBoardList';
      let postParam = {
        PST_TYPE_CD : item
        , BOARD_LIST_FROM3 : true
      }

      let headParam = {
        head : {
          PAGING: 'N'
        }
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {

        let length = 25; // 표시할 글자수 기준
        let str;
        for(var i=0; i < response.DATA.length; i++){

          // 날짜 포맷
          response.DATA[i].REG_DT = response.DATA[i].REG_DT.substring(0, response.DATA[i].REG_DT.indexOf(' ', 0)).replace(/\//g, '.');

          // 제목 말줄임
          // str = response.DATA[i].PST_TTL;
          // if (str.length > length) {
          //     str = response.DATA[i].PST_TTL.substr(0, length - 2) + '...';
          // }
          // response.DATA[i].PST_TTL = str;
        }
        this.BRD_LIST = response.DATA;
      }
    },

    // 조회수 조회
    async selectCnt(){

      let URLData = '/api/board/selectCnt';
      let postParam = {
        BBS_ID : '1' // 게시판ID
        , PST_ID : this.NotiDetail.pst_id // 게시글ID
      }

      let headParam = {
        head : {
        }
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.NotiDetail.count = response.DATA[0].INQ_CNT;
      }
    },
  },
  beforeDestroy() {
    this.$eventBus.$off("reloadBrdList");
  }
}
</script>

<style></style>
