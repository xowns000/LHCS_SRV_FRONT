<template>
  <div class="pl-noti-detail">
    <div class="d-flex justify-space-between">
      <span class="pl-noti-detail-subject">{{ NotiDetailProp.subject }}</span>
      <span class="pl-noti-detail-count">조회수 : {{ NotiDetailProp.count }}</span>
    </div>
    <div class="pl-noti-detail-dateinfo">
      {{ NotiDetailProp.date }} {{ NotiDetailProp.time }} | {{ NotiDetailProp.manager }}
    </div>
      <div
          class="pl-noti-detail-text"
           v-html="NotiDetailProp.text"
      >
  <!--        :value="NotiDetailProp.text"-->
  <!--      <v-textarea-->
  <!--        v-html="NotiDetailProp.text"-->
  <!--        style="background-color: #f3f5f9; height: 160px; overflow-y: auto;"-->
  <!--        class="pl-form is-noresize"-->
  <!--        readonly-->
  <!--        />-->
      </div>
    <div class="pl-dialog-body-desc">
      <compo-file-grid
        :FilesProp="NotiDetailProp.filelist"
        :HeaderButtonProp=false
        @addFile="mixin_testLog('add file')"
        @removeFile="mixin_testLog('remove file')"
      ></compo-file-grid>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      NotiDetailProp: {
        type: Object,
      },
    }

  }
</script>

<style lang="scss" scoped>

</style>