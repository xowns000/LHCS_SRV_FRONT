<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <!-- //mark: Default -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <ckeditor @namespaceloaded="onNamespaceLoaded" v-model="editorData" :config="editorConfig" ></ckeditor>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: in modal -->
    <h2>{{ toplink[1] }}</h2>
    <div class="guide-card">
      <v-btn class="pl-btn" @click="mixin_showDialog('Ckeditor')" >에디터 모달</v-btn>
      <!-- dialog -->
      <v-dialog
        v-model="dialogCkeditor"
        content-class="dialog-draggable"
        >
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="Ck Editor Sample"
          @hide="mixin_hideDialog('Ckeditor')"
          @submit="submitDialog('Ckeditor')"
        >
          <template slot="body">
            <ckeditor @namespaceloaded="onNamespaceLoaded" v-model="editorData" :config="editorConfig" ></ckeditor>
          </template>
        </compo-dialog>
      </v-dialog>
    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />

  </div>
</template>

<script>

import guideJs from '@/Guide/guide.js'

export default {
  name: "GuideCkeditor",

  props:{
    SelectedProp: {
      type: String,
    }
  },
  components: {

  },
  data() {
    return {
      toplink: [
        'Default',
        'In Modal',
      ],
      dialogCkeditor: false,
      source01: null,
      source02: null,
      source03: null,
      source04: null,
      source05: null,

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<ckeditor @namespaceloaded="onNamespaceLoaded" v-model="editorData" :config="editorConfig" ></ckeditor>`
          },
          { tab: "script", content:
`export default {
  data() {
    return {
      editorData: "test",
      editorConfig: {
        height: '500px',
        resize_enabled : true,
      },
    }
  }
}` },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`<v-btn class="pl-btn" @click="mixin_showDialog('Ckeditor')" >에디터 모달</v-btn>
<!-- dialog -->
<v-dialog
  v-model="dialogCkeditor"
  content-class="dialog-draggable"
  :retain-focus="false"
  >
  <div class="draggable-area">drag area</div>
  <compo-dialog
    header-title="Ck Editor Sample"
    @hide="mixin_hideDialog('Ckeditor')"
    @submit="submitDialog('Ckeditor')"
  >
    <template slot="body">
      <ckeditor @namespaceloaded="onNamespaceLoaded" v-model="editorData" :config="editorConfig" ></ckeditor>
    </template>
  </compo-dialog>
</v-dialog>`
          },
          { tab: "script", content:
`` },
        ],
        srcInput_03: [
          {
            tab: "html",
            content:
``
          },
          { tab: "script", content:
`` },
        ],
        srcInput_04: [
          {
            tab: "html",
            content:
``
          },
          { tab: "script", content:
`` },
        ],
        srcInput_05: [
          {
            tab: "html",
            content:
``
          },
          { tab: "script", content:
`` },
        ],
      },
      editorData: "test",
      editorConfig: {
        height: '500px',
        resize_enabled : true,
      },
    }
  },
  methods: {
    onNamespaceLoaded( CKEDITOR ) {
      //CKEditor 외부 플러그인 주입용도.
      this.mixin_CKEDITOR_plugins_addExternal( CKEDITOR );
    },
  },
  computed: {
  },
  mounted() {
    guideJs.appendHiddenLink(this.toplink);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>