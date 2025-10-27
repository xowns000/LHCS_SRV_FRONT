<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <!-- //mark: Default -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <div class="pl-tree-header">
        <div class="is-left">
          <label>기본 메뉴</label>
        </div>
        <div class="is-right">
          <v-btn class="pl-btn is-sub is-sm" @click="toggleExpand('treeDefault')">토글 : {{ expanded == true ? '접기' : '펼치기' }}</v-btn>
          <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault')">전체 펼치기</v-btn>
          <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault')">전체 접기</v-btn>
        </div>
      </div>
      <div class="pl-tree-body">
        <v-treeview ref="treeDefault" :items="treeItems" :open-all="expanded" activatable open-on-click color="secondary" class="pl-tree-view">
          <template v-slot:prepend="{ item, open }">
            <v-icon v-if="item.children">
                {{open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder'}}
            </v-icon>
            <v-icon v-else>
                {{ 'pl-icon20 tree-file' }}
            </v-icon>
          </template>
        </v-treeview>
        <!-- <Vuetify-draggable-treeview
          v-model="treeItems"
          :open-all="expanded"
          ref="treeDefault"
          activatable
        >
          <template v-slot:prepend="{ item, open }">
            <v-icon v-if="item.children">
                {{open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder'}}
            </v-icon>
            <v-icon v-else>
                {{ 'pl-icon20 tree-file' }}
            </v-icon>
          </template>
        </Vuetify-draggable-treeview> -->





      </div>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: Selectable -->
    <h2>{{ toplink[1] }}</h2>
    <div class="guide-card">
      <div class="tree-wrap">
        <template>
          <v-treeview
            :items="treeItems"
            selectable
          ></v-treeview>
        </template>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />

  </div>
</template>

<script>
import guideJs from '@/Guide/guide.js'
export default {
  name: "GuideTree",
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
        'Selectable',
      ],
      source01: null,
      source02: null,
      source03: null,

      expanded: false,
      treeItems: [
        {
          id: 1,
          name: 'menu1 :',
          children: [
            { id: 2, name: 'menu1-1' },
            { id: 3, name: 'menu1-2' },
            { id: 4, name: 'menu1-3' },
          ],
        },
        {
          id: 5,
          name: 'menu2 :',
          children: [
            {
              id: 6,
              name: 'menu2-1 :',
              children: [
                {
                  id: 7,
                  name: 'menu2-1-1 :',
                  children: [
                    { id: 8, name: 'menu2-1-1-1' },
                    { id: 9, name: 'menu2-1-1-2' },
                  ],
                },
              ],
            },
            {
              id: 10,
              name: 'menu2-2 :',
              children: [
                {
                  id: 11,
                  name: 'menu2-2-1 :',
                  children: [
                    { id: 12, name: 'menu2-2-1-1' },
                    { id: 13, name: 'menu2-2-1-2' },
                    { id: 14, name: 'menu2-2-1-3' },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 15,
          name: 'menu3 :',
          children: [
            { id: 16, name: 'menu3-1' },
            { id: 17, name: 'menu3-2' },
            {
              id: 18, name: 'menu3-3',
              children: [
                { id: 19, name: 'menu3-3-1' },
              ],
            },
          ],
        },
      ],

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<div class="pl-tree-header">
  <div class="is-left">
    <label>기본 메뉴</label>
  </div>
  <div class="is-right">
    <v-btn class="pl-btn is-sub is-sm" @click="toggleExpand('treeDefault')">토글 : {{ expanded == true ? '접기' : '펼치기' }}</v-btn>
    <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault')">전체 펼치기</v-btn>
    <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault')">전체 접기</v-btn>
  </div>
</div>
<div class="pl-tree-body">
  <v-treeview ref="treeDefault" :items="treeItems" :open-all="expanded" activatable open-on-click color="secondary" class="pl-tree-view">
    <template v-slot:prepend="{ item, open }">
      <v-icon v-if="item.children">
          {{open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder'}}
      </v-icon>
      <v-icon v-else>
          {{ 'pl-icon20 tree-file' }}
      </v-icon>
    </template>
  </v-treeview>
</div>`
          },
          { tab: "script", content:
`data() {
  return {
    expanded: false,
    treeItems: [
      {
        id: 1,
        name: 'menu1 :',
        children: [
          { id: 2, name: 'menu1-1' },
          { id: 3, name: 'menu1-2' },
          { id: 4, name: 'menu1-3' },
        ],
      },
      {
        id: 5,
        name: 'menu2 :',
        children: [
          {
            id: 6,
            name: 'menu2-1 :',
            children: [
              {
                id: 7,
                name: 'menu2-1-1 :',
                children: [
                  { id: 8, name: 'menu2-1-1-1' },
                  { id: 9, name: 'menu2-1-1-2' },
                ],
              },
            ],
          },
          {
            id: 10,
            name: 'menu2-2 :',
            children: [
              {
                id: 11,
                name: 'menu2-2-1 :',
                children: [
                  { id: 12, name: 'menu2-2-1-1' },
                  { id: 13, name: 'menu2-2-1-2' },
                  { id: 14, name: 'menu2-2-1-3' },
                ],
              },
            ],
          },
        ],
      },
      ...
    ],
  }
},
methods: {
  toggleExpand(id) {
    this.expanded = !this.expanded;
    this.$refs[id].updateAll(this.expanded);
  },
  expandAll(id){
    this.expanded = true;
    this.$refs[id].updateAll(true);
  },
  collapseAll(id){
    this.expanded = false;
    this.$refs[id].updateAll(false);
  },
},
` },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`<div class="tree-wrap">
  <template>
    <v-treeview
      :items="treeItems"
      selectable
    ></v-treeview>
  </template>
</div>`
          },
          { tab: "script", content:
`data() {
  return {
    treeItems: [
      {
        id: 1,
        name: 'menu1 :',
        children: [
          { id: 2, name: 'menu1-1' },
          { id: 3, name: 'menu1-2' },
          { id: 4, name: 'menu1-3' },
        ],
      },
      {
        id: 5,
        name: 'menu2 :',
        children: [
          {
            id: 6,
            name: 'menu2-1 :',
            children: [
              {
                id: 7,
                name: 'menu2-1-1 :',
                children: [
                  { id: 8, name: 'menu2-1-1-1' },
                  { id: 9, name: 'menu2-1-1-2' },
                ],
              },
            ],
          },
          {
            id: 10,
            name: 'menu2-2 :',
            children: [
              {
                id: 11,
                name: 'menu2-2-1 :',
                children: [
                  { id: 12, name: 'menu2-2-1-1' },
                  { id: 13, name: 'menu2-2-1-2' },
                  { id: 14, name: 'menu2-2-1-3' },
                ],
              },
            ],
          },
        ],
      },
      ...
    ],
  }
},` },
        ],

      },
    }
  },
  methods: {
    toggleExpand(id) {
      this.expanded = !this.expanded;
      this.$refs[id].updateAll(this.expanded);
    },
    expandAll(id){
      this.expanded = true;
      this.$refs[id].updateAll(true);
    },
    collapseAll(id){
      this.expanded = false;
      this.$refs[id].updateAll(false);
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