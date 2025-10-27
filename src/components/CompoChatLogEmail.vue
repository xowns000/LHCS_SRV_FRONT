<template>
  <v-tabs class="pl-tabs type-main" v-model="emailActiveTab">
    <v-tab :key="0" @click="changeEmailTab(0)">상담 이메일</v-tab>
    <v-tab :key="1" @click="changeEmailTab(1)">답변 발송 이메일</v-tab>
    <v-tab-item :key="0">
      <div class="is-mt-m" v-if="emailActiveTab == 0">
        <compo-view-email
          :DataProp="{
            'EMAIL_TYPE' : 'CHAT_CUTT',
            'CHT_CUTT_ID' : CHT_CUTT_ID,
            'CALL_BY' : 'CHAT_LOG_EMAIL'
            }"
        />
      </div>
    </v-tab-item>
    <v-tab-item :key="1">
      <div class="is-mt-m" v-if="emailActiveTab == 1">
        <compo-view-email 
          :DataProp="{
            'EMAIL_TYPE' : 'EMAIL',
            'CHT_CUTT_ID' : CHT_CUTT_ID,
            'CALL_BY' : 'CHAT_LOG_EMAIL'
            }"
        />
      </div>
    </v-tab-item>
  </v-tabs>
</template>

<script>
  export default {
    name: 'CompoChatLogEmail',
    props: {
      DataProp: {
        type: Object,
        default: () => {
          return {}
        }
      },
    },
    data() {
      return {
        //이메일 Active 탭
        emailActiveTab: 0,

        //채팅_상담_ID - 수신 이메일
        CHT_CUTT_ID: '',

        //이메일_발송_ID - 답변 발송 이메일
        EML_SNDNG_ID: '',
        
      }
    },
    computed: {

    },
    created() {
      this.initData()
    },
    mounted() {

    },
    beforeDestroy() {
    },
    destroyed() {
    },
    methods: {
      //이메일 상메인 탭 변경
      async changeEmailTab(tabIdx) {
        this.emailActiveTab = tabIdx;
      },

      initData() {
        this.emailActiveTab = 0;
        if(this.DataProp.CHT_CUTT_ID) {
          this.CHT_CUTT_ID = this.DataProp.CHT_CUTT_ID;
        }
      }
    },
    watch:{
      DataProp() {
        this.initData();
      },
    }
  }
</script>