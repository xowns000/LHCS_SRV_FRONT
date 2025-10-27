<template>
<div class="pl-dialog-wrap">
  <div class="pl-dialog-header">
    <h1>{{ headerTitle }}</h1>
    <div class="is-right">
      <v-btn
        v-if="ForceProp"
        @click="$emit('hide')"
        plain
        min-width="30"
        height="30"
        class="pl-tooltip-btn pl-dialog-header-close"
        >
        <v-icon
          small
          class="pl-icon20 dialog-close">
        </v-icon>
      </v-btn>
    </div>
  </div>
  <div class="pl-dialog-search" v-if="SearchProp">
    <slot name="search">
      search
    </slot>
  </div>
  <div class="pl-dialog-body">
    <slot name="body">
      body
    </slot>
  </div>
  <div class="pl-dialog-footer" v-if="FooterProp">
    <slot name="footer">
      <v-btn class="pl-btn is-sub" @click="$emit('hide')">닫기</v-btn>

    </slot>

  </div>
</div>
</template>

<script>
export default {
  name: 'CompoDialog',
  props: {
    SearchProp: {
      type: Boolean,
      default: false,
    },
    HideCloseProp: {
      type: Boolean,
      default: true,
    },
    headerTitle: {
      type: String,
      default: '제목',
    },
    FooterProp: {
      type: Boolean,
      default: true,
    },
    ForceProp: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
  }),
  created() {
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
  }
};
</script>

<style>

</style>