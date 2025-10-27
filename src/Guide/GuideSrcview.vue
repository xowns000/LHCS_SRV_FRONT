<template>
  <div class="guide-source">
    <v-tabs v-model="computedModel" dark>
      <template v-for="item in SrcProp" >
        <v-tab v-if="item.content" :key="item.tab"> {{ item.tab }} </v-tab>
      </template>
    </v-tabs>
    <v-tabs-items v-model="computedModel">
      <v-tab-item>
        <pre
          class="guide-code"
          v-highlightjs
        ><code class="html">{{SrcProp[0].content}}</code></pre>
      </v-tab-item>
      <v-tab-item>
        <pre
          class="guide-code"
          v-highlightjs
        ><code class="javascript">{{SrcProp[1].content}}</code></pre>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import hljs from 'highlight.js';

export default {
  name: 'GuideSrcview',
  directives: {
    'highlightjs': {
      bind: function (el, binding) {
        let targets = el.querySelectorAll('code')
        targets.forEach((target) => {
          if (binding.value) {
            target.innerHTML = binding.value
          }
          hljs.highlightBlock(target)
        })
      },
      componentUpdated: function (el, binding) {
        // after an update, re-fill the content and then highlight
        let targets = el.querySelectorAll('code')
        targets.forEach((target) => {
          if (binding.value) {
            target.textContent = binding.value
            hljs.highlightBlock(target)
          }
        })
      }
    }
  },
  props: {
    ModelProp: {
      type: Number,
    },
    SrcProp: {
      type: Array,
    },
  },
  data() {
    return {
    }
  },
  computed: {
    computedModel: {
      get(){
        return this.ModelProp;
      },
      set(val){
        this.$emit("update:ModelProp", val);
      },
    },
  },
}
</script>

<style lang="scss" scoped>

</style>