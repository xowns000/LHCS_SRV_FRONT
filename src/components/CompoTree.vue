<template>
  <div>
    <!-- tree -->
    <div class="pl-tree-header">
      <div class="is-left"></div>
      <div class="is-right">
        <!-- <v-btn class="pl-btn is-sub is-sm" @click="setOgnzData">선택</v-btn> -->
        <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault')">전체 펼치기</v-btn>
        <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault')">전체 접기</v-btn>
      </div>
    </div>
    <div class="pl-tree-body" style="height: 500px;">
      <v-treeview
        ref="treeDefault"
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
          NO_SELECT : {alertDialogToggle: true, msg: '조직을 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        }
      },
    }
  },
  computed :{
  },

  created() {
    this.getTreeList();
  },

  mounted() {
    setTimeout(() => this.expandAll('treeDefault'), 1000);
  },
  methods: {
    //조직 Tree 목록 조회
    async getTreeList() {
      this.treeItems = [];
      let sUrl = '/api/setting/ognz/ognzTreeList';
      let postParam = {
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        //조직 Tree 데이터
        if(response.OGNZ_TREE.length > 0){
          this.treeItems = response.OGNZ_TREE;
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

    setOgnzData() {
      if(this.selectedNode){
        return this.selectedNode;
      }else{
        this.showAlert(this.MESSAGE.ALERT.NO_SELECT);
      }
    },

    clearOgnzData() {
      this.activeItem = [];
      this.selectedNode = null;
      this.getTreeList();
      setTimeout(() => this.expandAll('treeDefault'), 1000);
    },
  },



}
</script>

<style lang="scss" scoped>

</style>