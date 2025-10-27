<template>
  <v-dialog
    v-model="dialogOpenMsgTemplate"
    content-class="dialog-draggable is-lg is-nopadding"
    hide-overlay
    @keydown.esc="closeDialog()"
    @click:outside="closeDialog()">
    <div class="draggable-area">drag area</div>
    <compo-dialog
      header-title="문자 템플릿"
      @hide="closeDialog"
      @submit="submitDialog('MsgTemplate')"
    >
      <template slot="body">
        <div class="pl-cols">
          <!-- tree -->
          <div class="is-col-fix is-vrt" style="width: 410px">
            <div class="pl-card">
              <div class="pl-tree-header">
                <div class="is-left">
                  <label>템플릿 분류</label>
                </div>
                <div class="is-right">
                  <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault', 'expanded')">전체 펼치기</v-btn>
                  <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault', 'expanded')">전체 접기</v-btn>
                </div>
              </div>
              <div class="pl-tree-body" style="height: 590px;">
                <v-treeview
                  ref="treeDefault"
                  :items="treeItems"
                  :open-all="expanded"
                  activatable
                  open-on-click
                  @update:active="srch_tree_act"
                  :active="SELECT_TREE_ITEM_NODE_PATH"
                  return-object
                  color="secondary"
                  class="pl-tree-view">
<!--                    :active="isActive"-->
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
            </div>
          </div>
          <!-- list -->
          <div >
            <div class="pl-card ">
              <h2 class="pl-subtit">{{ treeItems.length != 0 ? treetitle : '' }} 문자 템플릿
                <span class="pl-counter ml-2">전체 <em class="pl-1">({{ MSG_TEMPLATE_LIST.length }})</em> 건</span>
              </h2>
              <div class="pl-subdesc">
                <p><strong>목록의 [적용] 버튼을 클릭</strong> 하시면 발송할 문자내용에 지정됩니다.</p>
              </div>
            </div>
            <!-- template list -->
            <div class="pl-card is-border " style="overflow-y: auto; height: 580px">
              <div class="pl-msg-template-list">
                <div
                  v-for="item in MSG_TEMPLATE_LIST"
                  class="pl-msg-template-list-unit"
                  :key="item.id">
                  <span class="pl-msg-template-list-title">
                    {{ item.TMPL_CLSF_NM }} :
                    <strong>{{ item.SMS_TMPL_NM }}</strong>
                  </span>
                  <div :class="`pl-msg-template-list-desc ${ item.active ? 'selected' : '' }`">
                    <div>{{ item.SMS_TMPL_CN }}</div>
                    <div class="ml-auto mt-auto">
                      <v-btn class="pl-btn is-sub is-sm " @click="selectedTemplate(item)">적용</v-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template slot="footer">
        <v-btn class="pl-btn is-sub" @click="closeDialog">닫기</v-btn>
      </template>
    </compo-dialog>
  </v-dialog>
</template>
<script>
export default {
  name: 'CompoFindSmsTemplate', //문자 템플릿 찾기 다이얼로그
  components: {
  },
  props: {
    custInfoProp: {
      type: Object,
      default: () => {
        return {CUST_NM:'', CUST_PHN_NO:''}
      }
    },
    SMS_TMPL_MODE: {
      type: String,
      default: 'SMS',
    },
  },
  data() {
    return{
      common_code : [],
      
      SELECTED_COMPANY: '',

      // dialog
      dialogOpenMsgTemplate: true,
      expanded: false,
      DSPTCH_NO_LIST:[],
      SELECT_TREE_ITEM_NODE_PATH : [],          // 선택된 트리 노드의 보모 경로 배열
      SELECT_TMPL_CLSF : {
        id : "",
        pId : "",
        name : "",
        children : []        
      },
      TMP_MD : '',
      treeItems: [],
      MSG_TEMPLATE_LIST: [],

      // file grid
      filelist: [],
      filePath: [],
      FILE_KEY:'',              //파일키
      DEL_FILE:[],              //컴포넌트 모달에서 가져온 삭제파일정보
      DEL_FILE_LIST:[],         //삭제파일정보
      

      // 문자tab
      MSG_CONTENT: '',
      SEND_NOW: true,
      PHONE_NUMBER: '',
      DSPTCH_NO: '',


      DATE: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      TIME_STEP: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(11, 5),
      TIME_AM_PM: '오후',

      detailValidateRules: {
        PHONE_NUMBER: [
          v => !!v || '수신번호 은(는) 필수 입력 항목 입니다.',
        ],
        MSG_CONTENT: [
          v => !!v || '문자 내용 은(는) 필수 입력 항목 입니다.',
        ],
      },

      MESSAGE : {
        CONFIRM : {
        },
        ALERT : {
          SEND_SUCCESS : {alertDialogToggle: true, msg: '전송에 성공하였습니다.', iconClass: 'is-info', type: 'default'}
          , SEND_FAIL : {alertDialogToggle: true, msg: '전송에 실패하였습니다.', iconClass: 'is-caution', type: 'default'}
          , ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
          , OVER_BYTE : {alertDialogToggle: true, msg: '문자 내용이 90byte를 초과합니다.', iconClass: 'is-caution', type: 'default'}
          , OVER_LENGTH : {alertDialogToggle: true, msg: '문자 내용이 2000byte를 초과합니다.', iconClass: 'is-caution', type: 'default'}
        }
      },
      treetitle: '',
    
    }
  },
  methods: {

    
    // 문자 템플릿 버튼
    async TmpList(mode){
      
      // 리스트 초기화
      this.MSG_TEMPLATE_LIST = [];

      this.TMP_MD = mode;

      this.mixin_showDialog('MsgTemplate');
      this.getSmsTreeInfo();
    },

    // 템플릿 분류 조회
    async getSmsTreeInfo() {
      let sUrl = '/phone-api/sms/tmpl/manage/clsf';

      let postParam = {
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        // 템플릿 분류 전체 접기
        this.collapseAll('treeDefault', 'expanded');
        // 트리 데이터 주입
        this.treeItems = this.makeTreeData(response.DATA, '');
      }
    },

    // 템플릿 분류 계층 구조 데이터 만들기
    makeTreeData(rowData, pid){     

      let treeData = []; // tree data

      for (let i in rowData) {
        let row = rowData[i]; // row 데이터 1 건
        let parent = row.P_NODE_NO; // 해당 row 데이터의 부모 트리 id
        if (pid == parent) { // row 데이터의 부모 트리 id 와 기준 트리 id가 같은 경우 데이터를 트리 구조로 변경
            let treeNode = {}; // tree node
            treeNode.id = row.C_NODE_NO;
            treeNode.pId = parent;
            treeNode.name = row.TMPL_NM;
            treeNode.sortOrd = row.SORT_ORD;
            treeNode.maxSortOrd = row.MAX_SORT_ORD;
            let child = this.makeTreeData(rowData, row.C_NODE_NO); // 해당 노드 하위 자식 노드 생성
            if (child.length != 0) { // 자식 노드가 있는 경우
                treeNode.children = child; // 자식 노드로 추가
            }else{
              treeNode.children = [];
            }
            treeData.push(treeNode); // 트리 데이터에 추가
        }
      }
      return treeData;
    },

    // 트리 노드 선택
    srch_tree_act(node){
      /**
       * 트리 노드 선택 시 노드ID와 하위 노드 존재 여부를 재설정
       */
      let currentNodeId = node.length > 0 ? node[0].id : "";
      let currentNodeName = node.length > 0 ? node[0].name : "";
      this.treetitle = node.length > 0 ? node[0].name : "";
      let currentNodePid = node.length > 0 ? node[0].pId : "";
      let currentNodeChildren = node.length > 0 ? node[0].children : [];
      let currentMaxSortOrd = node.length > 0 ? node[0].maxSortOrd : "";

      // if(currentNodeId != "" && (this.SELECT_TMPL_CLSF.id != currentNodeId)){
      if(currentNodeId != ""){

        this.SELECT_TMPL_CLSF.id = currentNodeId;
        this.SELECT_TMPL_CLSF.pId = currentNodePid;
        this.SELECT_TMPL_CLSF.name = currentNodeName;
        this.SELECT_TMPL_CLSF.children = currentNodeChildren;
        this.REG_TMPL_CLSF_MAX_SORT_ORD = currentMaxSortOrd;

        this.SMS_TMPL_ID = "";


        // 문자 템플릿 리스트 조회
        this.getSmsTmplList();
        // 상위 노드 경로 조회
        // this.getParentPath();
      }
    },

    // 상위 노드 경로 조회
    async getParentPath(){
      
      let sUrl = '/phone-api/sms/tmpl/manage/isRegTmplClsf';

      let postParam = {
          TMPL_CLSF_ID : this.SELECT_TMPL_CLSF.id                    // 템플릿 분류 ID
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){

        // 상위 경로
        const arrTmp= [];
        for(let i=response.DATA.length; i>0; i--){
          arrTmp.push(response.DATA[i-1].TMPL_CLSF_NM);
        }
        const strTmp = arrTmp.join('>');
        let objTmp = { TMPL_CLSF_NM : ''};
        objTmp.TMPL_CLSF_NM = strTmp;
        
        for(let i=0; i<this.MSG_TEMPLATE_LIST.length; i++){
          this.MSG_TEMPLATE_LIST[i].TMPL_CLSF_NM = strTmp;
        }
      }
    },

    // 문자 템플릿 리스트 조회
    async getSmsTmplList(){

      this.MSG_TEMPLATE_LIST = [];

      let sUrl = '/phone-api/sms/tmpl/manage/list';

      let postParam = {
          TMPL_CLSF_ID : this.SELECT_TMPL_CLSF.id               // 템플릿 분류 ID
        , USE_YN : 'Y'                                          // 사용 여부
        , SMS_TMPL_NM : this.SCH_SMS_TMPL_NM                    // sms 템플릿 명
        , TEMP_MODE : this.TMP_MD                               // 문자유형(SMS,LMS,MMS) 구분
      }

      let headParam = {
        head : {
          ROW_CNT : '500',
          PAGES_CNT : '1',
          PAGING : "N",
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        for(let i=0; i<response.DATA.length; i++){
          let obj = { SMS_TMPL_ID : '',
                      SMS_TMPL_NM : '',
                      SMS_TMPL_CN : '',
                      TMPL_CLSF_NM : '',
                      FILE_GROUP_KEY : '',};
          obj.SMS_TMPL_ID = response.DATA[i].SMS_TMPL_ID;
          obj.SMS_TMPL_NM = response.DATA[i].SMS_TMPL_NM;
          obj.SMS_TMPL_CN = response.DATA[i].SMS_TMPL_CN;
          if(!response.DATA[i].FILE_GROUP_KEY.mixin_isEmpty){
            obj.FILE_GROUP_KEY = response.DATA[i].FILE_GROUP_KEY;
          }
          this.MSG_TEMPLATE_LIST.push(obj);
        }
      }
    },

    // 템플릿 선택
    async selectedTemplate(item){
      const arr = this.MSG_TEMPLATE_LIST;

      for (let index = 0; index < arr.length; index++) {
        arr[index].active = false;
      }

      let formatMsg = '';
      
      if(!this.mixin_isEmpty(item.SMS_TMPL_CN)){
        formatMsg = item.SMS_TMPL_CN.split('{고객명}').join(this.custInfoProp.CUST_NM).split('{기업}').join(this.SELECTED_COMPANY.CD_NM).split('{연락처}').join(this.custInfoProp.CUST_PHN_NO);
        this.MSG_CONTENT = formatMsg;
      } else {
        this.MSG_CONTENT = this.MSG_TEMPLATE_LIST;
      }

      if(!this.mixin_isEmpty(item.FILE_GROUP_KEY)){
        await this.getMmsUploadFile(item);
      }
      
      item.active = false;

      //부모에게 선택된 정보 전달
      this.$emit('applySmsTemplate', this.MSG_CONTENT, this.filelist)

      // this.isActive = false;
    },

    // 템플릿에 등록된 파일 조회
    async getMmsUploadFile(item){

      let sUrl = '/phone-api/sms/tmpl/manage/uploadFiles';
      let postParam = {
        SMS_TMPL_ID: item.SMS_TMPL_ID
        ,FILE_GROUP_KEY: item.FILE_GROUP_KEY
      }
      let headParam = {
        head: {}
      }

      let response = await this.common_postCall(sUrl, postParam, headParam)
      if(!response.HEADER.ERROR_FLAG){
        for(let i=0; i<response.DATA.length; i++){
          this.filelist.push({
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
            filePath: response.DATA[i].FILE_PATH
              +'/'+ response.DATA[i].STRG_FILE_NM
          })
        }
      }
    },


    // tree
    expandAll(id,expand) {
      
      this[expand] = true;
      this.$refs[id].updateAll(true);
    },
    collapseAll(id,expand) {
      console.log("id ::: ",id,"   expand ::: ", expand);
      this[expand] = false;
      this.$refs[id].updateAll(false);
    },

    closeDialog() {
      this.$emit("closeFindSmsTemplate");
    }

  },

  async created() {
    //목록 호출
    this.TmpList(this.SMS_TMPL_MODE);
    
  },

  mounted() {
  },

  watch: {
  },
  
}
</script>
<style lang="scss" scoped>
</style>