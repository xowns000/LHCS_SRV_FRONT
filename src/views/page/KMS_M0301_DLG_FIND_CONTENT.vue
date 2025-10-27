<template>
    <div class="pl-cols">
      <!-- tree -->
      <div class="is-col-fix is-vrt" style="width: 410px">
        <div class="pl-card">
          <div class="pl-tree-header">
            <div class="is-left">
              <label>지식 분류</label>
            </div>
            <div class="is-right">
              <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault', 'expanded')">전체 펼치기</v-btn>
              <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault', 'expanded')">전체 접기</v-btn>
            </div>
          </div>
          <div class="pl-tree-body" style="height: 500px;">
            <v-treeview
              ref="treeDefault"
              :items="TREE_ITEMS"
              :open-all="expanded"
              item-key="id"
              :open.sync="treeOpenSync"
              activatable
              return-object
              :open-on-click=false
              @update:active="selectTreeAct"
              color="secondary"
              class="pl-tree-view">
              <template v-slot:prepend="{ item, open }">
                <v-icon v-if="item.children">
                    {{open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder'}}
                </v-icon>
                <v-icon v-else>
                    {{ 'pl-icon20 tree-file' }}
                </v-icon>
              </template>
              <template v-slot:label="{item}">
                <div v-if=" item.OPEN_CONTS_CNT !== '0' ">
                  <b style="color:blue" v-html=" item.KMS_CLSF_NM + ' ('+ item.OPEN_CONTS_CNT + ')' "></b>
                </div>
                <div v-else v-html="item.KMS_CLSF_NM"></div>
              </template>
            </v-treeview>
          </div>
        </div>
      </div>
      <!-- grid -->
      <div class="pl-card">
        <h2 class="pl-dialog-body-tit-h2 d-flex" v-text=" KMS_CLSF_NM "></h2>
        <div class="is-mt-m">
          <div class="pl-grid-top">
            <div class="pl-grid-top-left">
              <v-text-field
                v-model="KEY_WORD"
                class="pl-form is-search is-lg"
                placeholder="검색어 입력"
                @keydown.enter="getKmsContsList"
              >
              <template v-slot:append>
                <v-btn
                  @click="getKmsContsList"
                  class="pl-btn has-icon-only">
                  <span class="pl-icon20 in-search"></span>
                </v-btn>
              </template>
            </v-text-field>
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1">({{ CONTS_LIST.length }})</em> 건</span>
            </div>
          </div>
          <v-data-table
            class="pl-grid has-control"
            v-model="REG_CONTS.INFO"
            :headers="CONTS_HEADERS"
            :items="CONTS_LIST"
            fixed-header
            show-select
            item-key="KMS_CONTS_ID"
            height="562px"
            :items-per-page="ROW_PER_PAGE"
            hide-default-footer
            :page.sync="page"
            no-data-text="등록된 데이터가 없습니다."
            @page-count="pageCount = $event">
          <!-- item-class="isActiveRow" -->
          </v-data-table>
        </div>
      </div>
    </div>
</template>

<script>

export default {
  name: "KMS_DLG_FIND_CONTENT",
  props: {
    
  }, 
  components: {
  },
  data() {
    return {
      // tree
      page : 1,
      pageCount : 0,
      ROW_PER_PAGE : 500,


      expanded: false,
      SELECT_NODE : null,
      TREE_ITEMS: [],
      treeOpenSync: [],

      // 콘텐츠 찾기
      KMS_CLSF_NM : "",
      KEY_WORD : "",
      CONTS_HEADERS: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px', sortable: false },
        { text: '콘텐츠 ID', value: 'KMS_CONTS_ID', align: 'center', width: '120px' },
        { text: '지식 콘텐츠', value: 'KMS_CONTS_NM', sortable: false},
        { text: '수정일', value: 'REG_DT_F', align: 'center', width: '120px', sortable: false },
      ],
      CONTS_LIST : [],
      REG_CONTS : {
        INFO : [],
      },

      MESSAGE : {
        CONFIRM : {
          REG : {alertDialogToggle: true, msg: '내용을 저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.saveConts, callNo: this.closeMsg}
        },
        ALERT : {
          SUCCESS : {alertDialogToggle: true, msg: '정상 처리 되었습니다.', iconClass: 'is-info', type: 'default'}
          , NON_CLSF_DATA : {alertDialogToggle: true, msg: '지식 분류를 선택해 주세요.', iconClass: 'is-info', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        }
      },

    }
  },
  watch: {
  },
  computed: {
    
  },
  created() {
    this.getKmsClsfTree();
  },
  mounted() {
    this.REG_CONTS = this.$attrs.value;
  },
  methods: {
    // tree
    expandAll(id,expand) {
      this[expand] = true;
      this.$refs[id].updateAll(true);
    },
    collapseAll(id,expand) {
      this[expand] = false;
      this.$refs[id].updateAll(false);
      this.openTreeRoot()
    },

    //root Tree Open
    openTreeRoot() {
      if(!!this.TREE_ITEMS && this.TREE_ITEMS.length > 0 && Number(this.TREE_ITEMS[0]?.CHILD_CNT) > 0) {
        this.treeOpenSync = [{'id':this.TREE_ITEMS[0].id}]
      }
    },

    async getKmsClsfTree(){
      this.TREE_ITEMS = [];
      let sUrl = '/api/km/clsf/clsfTreeList';
      // Yabong TODO :  관리자 여부 확인 요망  -- 변경시 BE Query 도 변경 할 것
      let postParam = {
        USE_YN : "Y"    // 공개된 분류만
        , ADM_YN : "Y"
      };

      let headParam = {
        head : {}
      };
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        if(response.KM_CLSF_TREE){
          this.TREE_ITEMS = response.KM_CLSF_TREE;
          this.openTreeRoot()
        }
      }
    },

    // 분류 선택 해제시 콘텐츠 정보 초기화
    initContsList(){
      this.KEY_WORD = "";
      this.CONTS_LIST = [];
      this.REG_CONTS.INFO = [];
      this.page = 1;
    },

    selectTreeAct( node ){
      let tmpNode = node[0];
      if( !this.mixin_isEmpty(tmpNode) ) {
        this.SELECT_NODE = tmpNode;
        this.KMS_CLSF_NM = this.SELECT_NODE.KMS_CLSF_NM;
        if( "Y" === this.SELECT_NODE.PIC_USE_YN ) {
            this.getKmsContsList();
        } else {
          this.initContsList();
        }
      } else {
        this.SELECT_NODE = null;
        this.KMS_CLSF_NM = "";
        this.initContsList();
      }
    },

    async getKmsContsList(){

      if( this.mixin_isEmpty(this.SELECT_NODE)  ) {
          this.showAlert(this.MESSAGE.ALERT.NON_CLSF_DATA);
          return;
      }

      let sUrl = '/api/km/conts/selectContentList';
      let postParam = {
        KMS_CLSF_ID : this.SELECT_NODE.KMS_CLSF_ID
        , STTS_CD :"PBIC"   // 공개된 컨텐츠만 
        , KMS_CONTS_NM : this.KEY_WORD
        , SE_CD : 'KNOWLEDGE'
      }
      let headParam = {
        head : {
          ROW_CNT : this.ROW_PER_PAGE,
          PAGES_CNT : this.page,
          PAGING : "N",
        }
      }
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        this.CONTS_LIST = response.DATA;
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
