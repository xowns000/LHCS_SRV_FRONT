<template>
  <div>
    <!-- tree -->
    <div class="pl-tree-header">
      <div class="is-left">
        <v-text-field
          v-model="search"
          class="pl-form "
          placeholder="검색어 입력"
          dark
          flat
          solo-inverted
          hide-details
          clearable
          clear-icon="mdi-close-circle-outline"
        ></v-text-field>
      </div>
      <div class="is-right">
        <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault')">전체 펼치기</v-btn>
        <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault')">전체 접기</v-btn>
      </div>
    </div>
    <div class="pl-tree-body" style="height: 500px;">
      <v-treeview
        ref="treeDefault"
        :search="search"
        :filter="filter"
        :items="treeItems"
        :open-all="ExpandedProp"
        activatable
        return-object
        @update:active="srch_tree_act"
        color="secondary"
        class="pl-tree-view"
      >
        <template v-slot:prepend="{ item, open }">
          <v-icon v-if="item.children.length > 0">
              {{open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder'}}
          </v-icon>
          <v-icon v-else>
              {{ 'pl-icon20 tree-file' }}
          </v-icon>
        </template>
      </v-treeview>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ExpandedProp: {
      type: Boolean,
      default: true
    }

  },
  data() {
    return {

      treeItems : [],

      activeItem:[],
      selectedNode: null,

      //confirm alert 메시지
      MESSAGE : {
        ALERT : {
          NO_SELECT : {alertDialogToggle: true, msg: '항목을 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        }
      },

      caseSensitive : false,
      search : '',
    }
  },
  computed :{
    filter () {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined
    },
  },

  created() {
    this.$eventBus.$on("clearTreeData", () => {
      this.search = '';
      this.selectedNode = null;
      this.getCuttTypeList();
      setTimeout(() => this.expandAll('treeDefault'), 1000);
    });

    this.$eventBus.$on("setTreeData", () => {
      this.setTreeData();
    });

    this.getCuttTypeList();
  },

  mounted() {
    setTimeout(() => this.expandAll('treeDefault'), 1000);
  },
  methods: {
    //상담유형 목록 조회
    async getCuttTypeList() {
      this.treeItems = [];
      this.search = '';
      let sUrl = '/api/setting/cuttType/cuttTypeTreeList';
      let postParam = {
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        //Tree 데이터
        if(response.CUTT_TYPE_TREE.length > 0){
          this.treeItems = response.CUTT_TYPE_TREE;
        }
      }
    },

    srch_tree_act(node){
      this.activeItem = node;
      this.selectedNode = this.activeItem[0];

      if(this.selectedNode === null){
        this.selectedNode = {};
      }
    },

    expandAll(id){
      this.expanded = true;
      this.$refs[id].updateAll(true);
    },
    collapseAll(id){
      this.expanded = false;
      this.$refs[id].updateAll(false);
    },

    setTreeData() {
      if(this.selectedNode){
        this.$emit('getTreeData', this.selectedNode);
      }else{
        this.showAlert(this.MESSAGE.ALERT.NO_SELECT);
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>