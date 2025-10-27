<template>
  <div>
    <v-tabs class="pl-tabs type-main" hide-slider >
      <v-tab @click="initInfo()">SMS</v-tab>
      <v-tab @click="initInfo()">LMS</v-tab>
      <v-tab @click="initInfo()">MMS</v-tab>
      <!-- SMS -->
      <v-tab-item class="is-mt-m">
        <v-form ref="form1">
          <h2 class="pl-subtit">문자 내용
            <v-icon class="pl-icon20 required"></v-icon>
          </h2>
          <div class="pl-subdesc ">
            <v-textarea
              v-model="MSG_CONTENT"
              :rules="detailValidateRules.MSG_CONTENT"
              class="pl-form is-noresize"
              placeholder="내용을 직접 입력 하시거나 템플릿을 선택하여 지정할 수 있습니다."
              height="225"
              :spellcheck="false"
            />
          </div>
          <div class="pl-btn-wrap justify-end is-mt-s">
            <div class="ml-auto">
              {{ getByte(MSG_CONTENT) }}/90
              <v-btn class="pl-btn ml-auto" @click="TmpList('SMS')">문자 템플릿</v-btn>
            </div>
          </div>
          <h2 class="pl-subtit">발송 정보</h2>
          <div class="pl-form-inline-wrap vertical is-border is-mt-m">
            <div class="pl-form-inline is-mt-m">
              <span class="pl-label">
                발송일시
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <compo-date-picker
                  DateType="dateTime"
                  :DateProp.sync="DATE"
                  :TimesProp.sync='TIME_STEP'
                  :AmpmProp.sync='TIME_AM_PM'
                />
                <v-checkbox
                  v-model="SEND_NOW"
                  class="pl-check"
                  label="즉시발송"
                ></v-checkbox>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                수신번호
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  value=""
                  v-model="PHONE_NUMBER"
                  maxlength="14"
                  hide-spin-buttons
                  type="text"
                  @keyup="setPhoneNo(PHONE_NUMBER)"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                  :rules="detailValidateRules.PHONE_NUMBER"
                  class="pl-form"
                  v-byte-counter="60"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                발신번호
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-autocomplete
                  v-model="DSPTCH_NO"
                  :items="DSPTCH_NO_LIST"
                  placeholder="선택하세요"
                  class="pl-form"
                ></v-autocomplete>
              </div>
            </div>
          </div>
          <div class="pl-btn-wrap justify-end is-mt-s">
            <div class="ml-auto">
              <v-btn class="pl-btn ml-auto" @click="sendMessage('SMS')">발송</v-btn>
            </div>
          </div>
          <ul class="pl-list-info">
            <li>
              “즉시발송”을 체크하지 않을 경우 “발송일시”에 지정한 시간에 예약발송되오니 유의바랍니다.<br/>
              SMS는 문자내용으로 최대 한글 45자(90byte)까지 발송 가능합니다.
            </li>
          </ul>
        </v-form>
      </v-tab-item>
      <!-- LMS -->
      <v-tab-item class="is-mt-m">
        <v-form ref="form2">
          <h2 class="pl-subtit">문자 내용
            <v-icon class="pl-icon20 required"></v-icon>
          </h2>
          <div class="pl-subdesc ">
            <v-textarea
              v-model="MSG_CONTENT"
              :rules="detailValidateRules.MSG_CONTENT"
              class="pl-form is-noresize"
              placeholder="내용을 직접 입력 하시거나 템플릿을 선택하여 지정할 수 있습니다."
              height="225"
              :spellcheck="false"
            />
          </div>
          <div class="pl-btn-wrap justify-end is-mt-s">
            <div class="ml-auto">
              {{ getByte(MSG_CONTENT) }}/2000
              <v-btn class="pl-btn ml-auto" @click="TmpList('LMS')">문자 템플릿</v-btn>
            </div>
          </div>
          <h2 class="pl-subtit">발송 정보</h2>
          <div class="pl-form-inline-wrap vertical is-border is-mt-m">
            <div class="pl-form-inline is-mt-m">
              <span class="pl-label">
                발송일시
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <compo-date-picker
                  DateType="dateTime"
                  :DateProp.sync="DATE"
                  :TimesProp.sync='TIME_STEP'
                  :AmpmProp.sync='TIME_AM_PM'
                />
                <v-checkbox
                  v-model="SEND_NOW"
                  class="pl-check"
                  label="즉시발송"
                ></v-checkbox>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                수신번호
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="PHONE_NUMBER"
                  maxlength="14"
                  hide-spin-buttons
                  type="text"
                  @keyup="setPhoneNo(PHONE_NUMBER)"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                  :rules="detailValidateRules.PHONE_NUMBER"
                  class="pl-form"
                  v-byte-counter="60"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                발신번호
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  v-model="DSPTCH_NO"
                  :items="DSPTCH_NO_LIST"
                  placeholder="선택하세요"
                  class="pl-form"
                ></v-select>
              </div>
            </div>
          </div>
          <div class="pl-btn-wrap justify-end is-mt-s">
            <div class="ml-auto">
              <v-btn class="pl-btn ml-auto" @click="sendMessage('LMS')">발송</v-btn>
            </div>
          </div>
          <ul class="pl-list-info">
            <li>
              “즉시발송”을 체크하지 않을 경우 “발송일시”에 지정한 시간에 예약발송되오니 유의바랍니다.<br/>
              LMS는 문자내용으로 최대 한글 1000자(2,000byte)까지 발송 가능합니다.
            </li>
          </ul>
        </v-form>
      </v-tab-item>
      <!-- MMS -->
      <v-tab-item class="is-mt-m">
        <v-form ref="form3">
          <h2 class="pl-subtit">문자 내용
            <v-icon class="pl-icon20 required"></v-icon>
          </h2>
          <div class="pl-subdesc ">
            <v-textarea
              v-model="MSG_CONTENT"
              :rules="detailValidateRules.MSG_CONTENT"
              class="pl-form is-noresize"
              placeholder="내용을 직접 입력 하시거나 템플릿을 선택하여 지정할 수 있습니다."
              height="225"
              :spellcheck="false"
            />
          </div>
          <div class="pl-btn-wrap justify-end is-mt-s">
            <div class="ml-auto">
              {{ getByte(MSG_CONTENT) }}/2000
              <v-btn class="pl-btn ml-auto" @click="TmpList('MMS')">문자 템플릿</v-btn>
            </div>
          </div>
          <h2 class="pl-subtit">발송 정보</h2>
          <div class="pl-form-inline-wrap vertical is-border is-mt-m">
            <div class="pl-form-inline is-mt-m">
              <span class="pl-label">
                발송일시
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <compo-date-picker
                  DateType="dateTime"
                  :DateProp.sync="DATE"
                  :TimesProp.sync='TIME_STEP'
                  :AmpmProp.sync='TIME_AM_PM'
                />
                <v-checkbox
                  v-model="SEND_NOW"
                  class="pl-check"
                  label="즉시발송"
                ></v-checkbox>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                수신번호
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="PHONE_NUMBER"
                  maxlength="14"
                  hide-spin-buttons
                  type="text"
                  @keyup="setPhoneNo(PHONE_NUMBER)"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                  :rules="detailValidateRules.PHONE_NUMBER"
                  class="pl-form"
                  v-byte-counter="60"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                발신번호
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  v-model="DSPTCH_NO"
                  :items="DSPTCH_NO_LIST"
                  placeholder="선택하세요"
                  class="pl-form"
                ></v-select>
              </div>
            </div>
          </div>
          <div class="pl-btn-wrap justify-end is-mt-s">
            <div class="ml-auto">
              <v-btn class="pl-btn" @click="sendMessage('MMS')">발송</v-btn>
            </div>
          </div>
          <compo-file-grid
            :FilesProp="filelist"
            SmallTitleProp
            :DelData="DEL_FILE"
            @input="DEL_FILE = $event"
            @addFile="clickAddFiles"
            @removeFile="removeFile()"
          >
          </compo-file-grid>
          <input ref="fileUpload" type="file" multiple @change="handleFileUpload" style="display: none" />
          <ul class="pl-list-info">
            <li>
              “즉시발송”을 체크하지 않을 경우 “발송일시”에 지정한 시간에 예약발송되오니 유의바랍니다.<br/>
              MMS는 문자내용으로 최대 한글 1000자(2,000byte)와 이미지 3장까지 발송 가능합니다.
            </li>
          </ul>
        </v-form>
      </v-tab-item>
    </v-tabs>
    <!-- 문자 템플릿 dialog -->
    <v-dialog
      v-model="dialogMsgTemplate"
      content-class="dialog-draggable is-lg is-nopadding"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="문자 템플릿"
        @hide="mixin_hideDialog('MsgTemplate')"
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
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";

  export default {
    name: 'right_sms',
    data() {
      return{
        common_code : [],
        
        SELECTED_COMPANY: '',

        // dialog
        dialogMsgTemplate: false,
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

      setPhoneNo(val){
        let res = this.mixin_setPhoneNo(val.replace(/[^0-9]/g, ""));
        this.PHONE_NUMBER = res;
      },

      async initInfo(event){
        this.MSG_CONTENT = '';
        this.filelist = [];
      },
      
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
          // console.log('response.DATA:::', response.DATA);
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
      selectedTemplate(item){
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
          this.getMmsUploadFile(item);
        }
        
        item.active = false;
        this.mixin_hideDialog('MsgTemplate');

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
        this[expand] = false;
        this.$refs[id].updateAll(false);
      },

      

      


      //*************************************
      //        문자
      //*************************************
      // 문자 발송
      async sendMessage(item){
      
        if(!this.detailValidate(item)) {
          return;
        };
        
        if(item === 'SMS'){
          if(this.getByte(this.MSG_CONTENT) > 90){
            this.showAlert(this.MESSAGE.ALERT.OVER_BYTE);
            return;
          }
        }else if(item === 'LMS'){
          if(this.getByte(this.MSG_CONTENT) > 2000){
            this.showAlert(this.MESSAGE.ALERT.OVER_LENGTH);
            return;
          }
        };

        var tmpImgUrl = new Object();
        var tmpImg = new Array();
        var tmpImgAttachment = new Object();
        var data = new Object();

        // MMS 발송 시 이미지파일 추가한 경우
        if(item === 'MMS' && !this.mixin_isEmpty(this.filelist)){
          //  console.log('this.filelist', this.filelist[0].filePath);
          for(let i=0; i<this.filelist.length; i++){
            tmpImgUrl.img_url = this.filelist[i].filePath;
            tmpImg.push(tmpImgUrl.img_url);
          }
        }
        tmpImgAttachment.image = tmpImg
        data.attachment = tmpImgAttachment

        // 즉시발송 체크 여부
        if(this.SEND_NOW){
          data.send_date = '';
        }else{
          data.send_date = this.DATE.replace(/-/gi, "") + this.TIME_STEP.replace(/:/gi, "")+ "00";
        }

        data.sndngSeCd = item === 'SMS' ? 'SMS' : item === 'LMS' ? 'LMS' : 'MMS';
        data.message = this.MSG_CONTENT;
        data.phone_number = this.PHONE_NUMBER.replace(/[^0-9]/g, '');
        data.callback_number = this.DSPTCH_NO.replace(/-/g, '');  // 발신번호 sample

        let SndngResp = await this.mixin_sendMessage(data);

        if(data.send_date == ''){
          data.send_date = SndngResp[0].received_at.replace(/-/gi, "").replace(/:/gi, "").replace(" ", "");
        }
        // this.mixin_getSndngRslt(data);
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

      // 날짜포맷
      dateFormat(){
        var today = new Date();

        var year = today.getFullYear();
        var month = ('0' + (today.getMonth() + 1)).slice(-2);
        var day = ('0' + today.getDate()).slice(-2);

        var dateString = year + '' + month  + '' + day;
        var today = new Date();   

        var hours = ('0' + today.getHours()).slice(-2); 
        var minutes = ('0' + today.getMinutes()).slice(-2);
        var seconds = ('0' + today.getSeconds()).slice(-2); 

        var timeString = dateString + '' + hours + '' + minutes  + '' + seconds;
        return timeString;

      },

      // 기본 한글 2바이트 처리
      getByteB(str) {
        var byte = 0;
        for (var i=0; i<str.length; ++i) {
          (str.charCodeAt(i) > 127) ? byte += 2 : byte++ ;
        }
        return byte;
      },

      //validate check
      detailValidate (form) {
        if(form==='SMS'){
          return this.$refs.form1.validate();
        }else if(form==='LMS'){
          return this.$refs.form2.validate();
        }else if(form==='MMS'){
          return this.$refs.form3.validate();
        }
      },

      //*************************************
      //        파일
      //*************************************
      // file input
      clickAddFiles() {
        this.$refs.fileUpload.click()
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

      //파일 제한(파일개수, 크기 체크)
      isValidFiles(files) {
        // console.log('file', files);
        // 파일 개수 제한을 설정
        const maxFileCount = 3;
        if ((files.length > maxFileCount) || (this.filelist.length+1 > maxFileCount)) {
          alert(`최대 ${maxFileCount}개의 파일까지 업로드할 수 있습니다.`);
          return false;
        }

        // 파일 크기 및 형식을 설정 (대소문자 구분)
        const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        // const maxFileSize = 5 * 1024 * 1024; // 5MB
        const maxFileSize = 307200; // 300KB
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (!allowedFileTypes.includes(file.type)) {
            alert('지원하지 않는 파일 형식입니다.');
            return false;
          }
          if (file.size > maxFileSize) {
            alert('파일 크기가 허용 범위를 초과합니다.');
            return false;
          }
        }

        return true;
      },

      //파일 업로드
      uploadFiles(files) {

        let busiType = 'mms';
        let pathType = 'images';
        let uploadUrl = "api/file/"+ busiType +"/"+ pathType +"/uploads";
        //파일 제한 체크 (빽엔드에서 체크 후 업로드 실패)
        for (let i = 0; i < files.length; i++) {
          const formData = new FormData();
          
          formData.append('action', uploadUrl);
          formData.append('method', "post");
          formData.append('custcoId', this.$store.getters['userStore/GE_USER_ROLE'].company.CD);                 //회사구분 : 1은 시스템(가이드)
          formData.append('userfiles', files[i]);           //파일(바이너리)
          formData.append('userId', this.$store.getters['userStore/GE_USER_ROLE'].userId);                   //사용자 ID : 2는 시스템(가이드)

          axios
          .post(uploadUrl, formData, {headers:{Authorization: "bearer " + window.sessionStorage.getItem("token")}})
            .then(response => {
              // 파일 업로드 성공 시 처리
              let leng = response.data.data.length
                for(let n=0;n<leng;n++)
                this.filelist.push({
                  index : this.mixin_isEmpty(this.filelist) ? n : this.filelist[this.filelist.length-1].index + 1,
                  filename : response.data.data[n].actlFileNm,
                  filesize : response.data.data[n].fileSzDisplay,
                  download : false,
                  count : 0,
                  downloadFile: response.data.data[n].actlFileNm,
                  fileGroupKey: response.data.data[n].fileGroupKey,
                  fileKey: response.data.data[n].fileKey,
                  // filePath: dir + "/" + response.data.data[n].filePath + "/" + response.data.data[n].strgFileNm,
                  filePath: response.data.data[n].filePath + '/' + response.data.data[n].strgFileNm
                })
            })
            .catch(error => {
              // 파일 업로드 실패 시 처리
              console.error(error);
            });
        }
        // 서버로 파일 업로드 요청을 보냅니다.
      },

      //파일 따로 저장 시 파일 그룹 키 통일 안 됨 =>  강제 파일 그룹 키 통일
      async fileGroupKeyUnity(){
        let arrFileKey = [];
        if(this.filelist.length > 0){
          let leng = this.filelist.length;
          for(let i=0;i<leng;i++){
            arrFileKey.push(this.filelist[i]["fileKey"])
          }
          //게시물 저장
          let sUrl = '/api/board/fileKey-unity/process';
          let postParam = {
            FILE_GROUP_KEY: this.filelist[leng-1]["fileGroupKey"],
            arrFileKey:arrFileKey
          }
          let headParam = {
            head: {
            }
          }

          let resData = await this.common_postCall(sUrl, postParam, headParam)
          if(!resData.HEADER.ERROR_FLAG){
            this.brdSave();
          }
        }else{
          this.brdSave();
        }
      },

      //파일 삭제 클릭
      removeFile(){
        for(let i=0;i<this.DEL_FILE.FILE_LIST.length;i++){
          this.DEL_FILE_LIST.push(this.DEL_FILE.FILE_LIST[i]);
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



    },

    async created() {

      // 수신번호 세팅
      let tabs = this.$store.getters["commonStore/GE_COMMON_TAB"];
      if(tabs.length > 0){
        for(let tab of tabs){
          if(tab.id === 'CSL_M0100' || tab.id === 'CSL_M0200') { //전화상담, SNS 상담
            if((Object.keys(this.custInfoProp).length > 0) && (this.custInfoProp.CUST_PHN_NO !== '　')){
              this.PHONE_NUMBER = this.mixin_setPhoneNo(this.custInfoProp.CUST_PHN_NO.replace(/[^0-9]/g, ""))
            }
          }
        }
      }

      // 고객사 이름
      this.COMPANY_INFO = this.$store.getters["userStore/GE_USER_ROLE"].company_list;
      this.SELECTED_COMPANY = this.COMPANY_INFO[0];

      // 고객정보 받은 후 수신번호 세팅
      this.$eventBus.$on("setCustInfo", (custInfo) => {
        this.PHONE_NUMBER = this.mixin_setPhoneNo(custInfo.CUST_PHN_NO.replace(/[^0-9]/g, ""));
        this.MSG_CONTENT = '';
      });

      this.common_code = await this.mixin_common_code_get_all(['CUSL_PHN_NO']);

      // 발신번호 세팅
      let dsptchNoList = [];
      if(this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO){
        dsptchNoList = this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO.split(',');
      }
      for(let i=0; i<dsptchNoList.length; i++){
        this.DSPTCH_NO_LIST.push(this.autoPhoneNum(dsptchNoList[i]));
      }

      this.mixin_common_code_get(this.common_code, 'CUSL_PHN_NO').forEach((data, idx) => {
        this.DSPTCH_NO_LIST.push(this.autoPhoneNum(data.value));
      });

      this.DSPTCH_NO = this.DSPTCH_NO_LIST[0];
      
    },

    mounted() {
    },

    props: {
      custInfoProp: {
        type: Object,
      },
    },

    watch: {
    },
  }
</script>

<style lang="scss" scoped>

</style>