<template>
    <div>
      <ul class="pl-list-dot is-no-border mt-0">
        <li>검토 요청할 내용이 있을 경우 의견을 입력하십시오.</li>
        <li>검토를 요청하시려면 [검토요청] 버튼을 클릭하십시오.</li>
      </ul>
      <div class="is-mt-m">
        <v-textarea 
          class="pl-form is-noresize" 
          v-model="INFO.CN"
          :rules="validateRules.CN"
          :spellcheck="false"
          placeholder="검토요청 의견 입력" 
        />
      </div>
    </div>
</template>

<script>

export default {
  name: "KMS_DLG_REQUEST",
  props: {
    validateRules : []
  }, 
  components: {
  },
  data() {
    return {
      dialogRequest: false,
      INFO :{
        CN : "" ,
      },
    }
  },
  watch: {
  },
  computed: {
  },
  created() {
  },
  mounted() {
    this.INFO = this.$attrs.value;
  },
  methods: {
    
  },
}
</script>

<style lang="scss" scoped>

</style>
