<template>
  <div class="pl-sublayout-top">
    <div>
      <h1 class="pl-sublayout-top-h1">{{ page_path.TITLE }}</h1>
      <p class="pl-sublayout-top-desc">
        {{ page_path.EXPLN }}
      </p>
      <div class="pl-sublayout-top-breadcrumb" v-html="computedFullPath">
      </div>
    </div>
    <div :class="{ 'mt-4' : $slots.search }">
      <slot name="search" >
      </slot>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: "CompoSubLayoutTop", //name은 'MENU_' + 파일명 조합 
  props: {
  },
  components: {
  },
  data() {
    return {
      selectedFullPath: '',
    }
  },
  methods: {
    selectNodeByPath(path_title) {
      const selectedNode = this.findNodeByPath(this.$store.getters["userStore/GE_USER_MENU"], path_title);
      this.selectedFullPath = selectedNode;
    },
    findNodeByPath(arr, path_title) {
      for (let node of arr) {
        if (node.NODE_TITLE === path_title) {
          return node.FULL_PATH;
        }
        if (node.child) {
          const result = this.findNodeByPath(node.child, path_title);
          if (result) {
            return result;
          }
        }
      }
      return null;
    },
  },
  mounted() {
    this.selectNodeByPath(this.page_path.TITLE);
  },
  created() {
  },
  computed: {
    ...mapGetters({
      selectedPath: 'commonStore/GE_COMMON_PAGE_PATH',
    }),
    computedFullPath: function(){
      let inputString = this.selectedFullPath;
      let regex = /(.*)>(\s*[^>]+)$/;
      let result = (inputString?inputString.replace(regex, '$1><strong>$2</strong>'):inputString);

      return result;
    }
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>