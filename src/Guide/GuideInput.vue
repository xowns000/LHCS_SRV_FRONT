<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink" />
    </div>

    <!-- //mark: Default -->
    <h2 >{{ toplink[0] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <v-text-field
          class="pl-form"
          placeholder="byte check 15"
          v-byte-counter="15"
        />
        <v-text-field class="pl-form" placeholder="default size"/>
        <v-text-field class="pl-form" placeholder="default size" readonly/>
        <v-text-field class="pl-form is-sm"  value="sm size " />
        <v-text-field class="pl-form is-xs"  value="xs size " />
        <v-text-field class="pl-form is-xss"  value="xss size " />
        <v-text-field class="pl-form is-lg"  value="lg size disabled" disabled/>
        <v-text-field class="pl-form is-error"  value="validation error" />
        <div style="width: 500px">
          <v-text-field class="pl-form is-auto"  value="is-auto"/>
        </div>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: Append 버튼 -->
    <h2 >{{ toplink[1] }}</h2>
    <div class="guide-card">
     <div class="guide-gap">
      <v-text-field class="pl-form is-lg" value="버튼 있는 경우" >
        <template v-slot:append>
          <v-btn
            @click="callMethod('icon btn')"
            class="pl-btn has-icon-only">
            <span class="pl-icon20 edit"></span>
          </v-btn>
        </template>
      </v-text-field>
     </div>
    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />

    <!-- //mark: Number -->
    <h2 >{{ toplink[2] }}</h2>
    <div class="guide-card">
      <v-text-field
        class="pl-form"
        type="number"
        value="42"
      />
    </div>
    <guide-srcview :ModelProp.sync="source03" :SrcProp="srcAll.srcInput_03" />

    <!-- //mark: Suffix -->
    <h2 >{{ toplink[3] }}</h2>
    <div class="guide-card">
      <v-text-field
        class="pl-form"
        placeholder="조회건수"
        suffix="건"
      />
    </div>
    <guide-srcview :ModelProp.sync="source04" :SrcProp="srcAll.srcInput_04" />

    <!-- //mark: Label -->
    <h2 >{{ toplink[4] }}</h2>
    <div class="guide-card">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            레이블
            <v-icon class="pl-icon20 required"></v-icon>
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form"
              value="pl-form"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">레이블2</span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form is-lg"
              value="pl-form is-lg"
            />
            <v-text-field
              class="pl-form"
              value="pl-form"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">레이블3</span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form is-lg"
              value="pl-form is-lg"
            />
            <v-text-field
              class="pl-form"
              value="pl-form"
            />
          </div>
        </div>

      </div>
    </div>
    <guide-srcview :ModelProp.sync="source05" :SrcProp="srcAll.srcInput_05" />

    <!-- //mark: Label vertical-->
    <h2 >{{ toplink[5] }}</h2>
    <div class="guide-card">
      <div class="pl-form-inline-wrap vertical">
        <div class="pl-form-inline">
          <span class="pl-label">
            pl-form-inline-wrap vertical
            <v-icon class="pl-icon20 required"></v-icon>
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form"
              value="pl-form"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">레이블2</span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form is-lg"
              value="pl-form is-lg"
            />
            <v-text-field
              class="pl-form"
              value="pl-form"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">레이블3</span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form"
              value="pl-form"
            />
            <v-text-field
              class="pl-form"
              value="pl-form"
            />
            <v-text-field
              class="pl-form"
              value="pl-form"
            />
          </div>
        </div>
      </div>
      <v-divider class="my-2"></v-divider>
      <div class="pl-form-inline-wrap vertical label-100">
        <div class="pl-form-inline">
          <span class="pl-label">
            label-100px
            <v-icon class="pl-icon20 required"></v-icon>
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form"
              value="pl-form"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">레이블2</span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form is-lg"
              value="pl-form is-lg"
            />
            <v-text-field
              class="pl-form"
              value="pl-form"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">레이블3</span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form"
              value="pl-form"
            />
            <v-text-field
              class="pl-form"
              value="pl-form"
            />
            <v-text-field
              class="pl-form"
              value="pl-form"
            />
          </div>
        </div>
      </div>
      <v-divider class="my-2"></v-divider>
      <div class="pl-form-inline-wrap vertical type-auto">
        <div class="pl-form-inline">
          <span class="pl-label">
            vertical type-auto
            <v-icon class="pl-icon20 required"></v-icon>
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form"
              value="pl-form"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">레이블2</span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form is-lg"
              value="pl-form is-lg"
            />
            <v-text-field
              class="pl-form"
              value="pl-form"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">레이블3</span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form"
              value="pl-form"
            />
            <v-text-field
              class="pl-form"
              value="pl-form"
            />
            <v-text-field
              class="pl-form"
              value="pl-form"
            />
          </div>
        </div>
      </div>
      <v-divider class="my-2"></v-divider>
      <div class="pl-form-inline-wrap vertical type-readonly">
        <div class="pl-form-inline">
          <span class="pl-label">
            vertical type-readonly
            <v-icon class="pl-icon20 required"></v-icon>
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form"
              value="pl-form"
              readonly
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">레이블2</span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form is-lg"
              value="pl-form is-lg"
              readonly
            />
          </div>
        </div>
      </div>
      <v-divider class="my-2"></v-divider>
      <div class="pl-form-inline-wrap vertical type-2 ">
        <div class="pl-form-inline">
          <span class="pl-label">
            vertical type-2
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form"
              disabled
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            평가표 명
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form"
            />
          </div>
        </div>
      </div>

    </div>
    <guide-srcview :ModelProp.sync="source06" :SrcProp="srcAll.srcInput_06" />

    <!-- //mark: Password -->
    <h2 >{{ toplink[6] }}</h2>
    <div class="guide-card">
      <v-text-field
        v-model="password"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="[rules.required, rules.min, rules.max]"
        :type="show1 ? 'text' : 'password'"
        class="pl-form"
        @click:append="show1 = !show1"
      ></v-text-field>
    </div>
    <guide-srcview :ModelProp.sync="source07" :SrcProp="srcAll.srcInput_07" />

    <!-- //mark: Search -->
    <h2 >{{ toplink[7] }}</h2>
    <div class="guide-card">
      <v-text-field
        class="pl-form is-search"
        placeholder="검색어 입력"
        @keydown.enter="mixin_testLog('search btn')"
      >
      <template v-slot:append>
        <v-btn
          @click="mixin_testLog('search btn')"
          class="pl-btn has-icon-only">
          <span class="pl-icon20 in-search"></span>
        </v-btn>
      </template>
    </v-text-field>
    </div>
    <guide-srcview :ModelProp.sync="source08" :SrcProp="srcAll.srcInput_08" />

    <!-- //mark: Hint text -->
    <h2 >{{ toplink[8] }}</h2>
    <div class="guide-card">
      <div class="pl-form-inline-wrap vertical">
        <div class="pl-form-inline">
          <span class="pl-label">
            레이블
            <v-icon class="pl-icon20 required"></v-icon>
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form"
              value="pl-form"
            />
            <p class="pl-form-hint">설문계획 등록 시 지정한 설문조사 명이 자동 출력됩니다.</p>
          </div>
        </div>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source09" :SrcProp="srcAll.srcInput_09" />

  </div>
</template>

<script>
import guideJs from '@/Guide/guide.js'

export default {
  name: "GuideInput",
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
        'Append 버튼',
        'Number',
        'Suffix',
        'Label',
        'Label Vertical',
        'Password',
        'Search',
        'Hint text',
      ],
      source01: null,
      source02: null,
      source03: null,
      source04: null,
      source05: null,
      source06: null,
      source07: null,
      source08: null,
      source09: null,

      //byte chk
      byte_input: '',

      //password
      password: false,
      show1: false,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        max: v => v.length <= 16 || 'Min 16 characters',
      },

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<v-text-field
  class="pl-form"
  placeholder="byte check 15"
  v-byte-counter="15"
/>
<v-text-field class="pl-form" placeholder="default size"/>
<v-text-field class="pl-form" placeholder="default size" readonly/>
<v-text-field class="pl-form is-sm"  value="sm size " />
<v-text-field class="pl-form is-xs"  value="xs size " />
<v-text-field class="pl-form is-xss"  value="xss size " />
<v-text-field class="pl-form is-lg"  value="lg size disabled" disabled/>
<v-text-field class="pl-form is-error"  value="validation error" />
<div style="width: 500px">
  <v-text-field class="pl-form is-auto"  value="is-auto"/>
</div>`
          },
          { tab: "script", content: ``, },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`<v-text-field class="pl-form is-lg" value="버튼 있는 경우" >
  <template v-slot:append>
    <v-btn
      @click="callMethod('icon btn')"
      class="pl-btn has-icon-only">
      <span class="pl-icon20 edit"></span>
    </v-btn>
  </template>
</v-text-field>`
          },
          { tab: "script", content: ``, },
        ],
        srcInput_03: [
          { tab: "html",
            content:
`<v-text-field class="pl-form" type="number" value="42" />`
          },
          { tab: "script", content: ``, },
        ],
        srcInput_04: [
          { tab: "html",
            content:
`<v-text-field class="pl-form" placeholder="조회건수" suffix="건" />`
          },
          { tab: "script", content: ``, },
        ],
        srcInput_05: [
          { tab: "html",
            content:
`<div class="pl-form-inline-wrap">
  <div class="pl-form-inline">
    <span class="pl-label">
      레이블
      <v-icon class="pl-icon20 required"></v-icon>
    </span>
    <div class="pl-desc">
      <v-text-field
        class="pl-form"
        value="pl-form"
      />
    </div>
  </div>
  <div class="pl-form-inline">
    <span class="pl-label">레이블2</span>
    <div class="pl-desc">
      <v-text-field
        class="pl-form is-lg"
        value="pl-form is-lg"
      />
      <v-text-field
        class="pl-form"
        value="pl-form"
      />
    </div>
  </div>
  <div class="pl-form-inline">
    <span class="pl-label">레이블3</span>
    <div class="pl-desc">
      <v-text-field
        class="pl-form is-lg"
        value="pl-form is-lg"
      />
      <v-text-field
        class="pl-form"
        value="pl-form"
      />
    </div>
  </div>

</div>`
          },
          { tab: "script", content: ``, },
        ],
        srcInput_06: [
          { tab: "html",
            content:
`<div class="pl-form-inline-wrap vertical">
  <div class="pl-form-inline">
    <span class="pl-label">
      pl-form-inline-wrap vertical
      <v-icon class="pl-icon20 required"></v-icon>
    </span>
    <div class="pl-desc">
      <v-text-field
        class="pl-form"
        value="pl-form"
      />
    </div>
  </div>
  <div class="pl-form-inline">
    <span class="pl-label">레이블2</span>
    <div class="pl-desc">
      <v-text-field
        class="pl-form is-lg"
        value="pl-form is-lg"
      />
      <v-text-field
        class="pl-form"
        value="pl-form"
      />
    </div>
  </div>
  <div class="pl-form-inline">
    <span class="pl-label">레이블3</span>
    <div class="pl-desc">
      <v-text-field
        class="pl-form"
        value="pl-form"
      />
      <v-text-field
        class="pl-form"
        value="pl-form"
      />
      <v-text-field
        class="pl-form"
        value="pl-form"
      />
    </div>
  </div>
</div>
<v-divider class="my-2"></v-divider>
<div class="pl-form-inline-wrap vertical label-100">
  <div class="pl-form-inline">
    <span class="pl-label">
      label-100px
      <v-icon class="pl-icon20 required"></v-icon>
    </span>
    <div class="pl-desc">
      <v-text-field
        class="pl-form"
        value="pl-form"
      />
    </div>
  </div>
  <div class="pl-form-inline">
    <span class="pl-label">레이블2</span>
    <div class="pl-desc">
      <v-text-field
        class="pl-form is-lg"
        value="pl-form is-lg"
      />
      <v-text-field
        class="pl-form"
        value="pl-form"
      />
    </div>
  </div>
  <div class="pl-form-inline">
    <span class="pl-label">레이블3</span>
    <div class="pl-desc">
      <v-text-field
        class="pl-form"
        value="pl-form"
      />
      <v-text-field
        class="pl-form"
        value="pl-form"
      />
      <v-text-field
        class="pl-form"
        value="pl-form"
      />
    </div>
  </div>
</div>
<v-divider class="my-2"></v-divider>
<div class="pl-form-inline-wrap vertical type-auto">
  <div class="pl-form-inline">
    <span class="pl-label">
      vertical type-auto
      <v-icon class="pl-icon20 required"></v-icon>
    </span>
    <div class="pl-desc">
      <v-text-field
        class="pl-form"
        value="pl-form"
      />
    </div>
  </div>
  <div class="pl-form-inline">
    <span class="pl-label">레이블2</span>
    <div class="pl-desc">
      <v-text-field
        class="pl-form is-lg"
        value="pl-form is-lg"
      />
      <v-text-field
        class="pl-form"
        value="pl-form"
      />
    </div>
  </div>
  <div class="pl-form-inline">
    <span class="pl-label">레이블3</span>
    <div class="pl-desc">
      <v-text-field
        class="pl-form"
        value="pl-form"
      />
      <v-text-field
        class="pl-form"
        value="pl-form"
      />
      <v-text-field
        class="pl-form"
        value="pl-form"
      />
    </div>
  </div>
</div>
<v-divider class="my-2"></v-divider>
<div class="pl-form-inline-wrap vertical type-readonly">
  <div class="pl-form-inline">
    <span class="pl-label">
      vertical type-readonly
      <v-icon class="pl-icon20 required"></v-icon>
    </span>
    <div class="pl-desc">
      <v-text-field
        class="pl-form"
        value="pl-form"
        readonly
      />
    </div>
  </div>
  <div class="pl-form-inline">
    <span class="pl-label">레이블2</span>
    <div class="pl-desc">
      <v-text-field
        class="pl-form is-lg"
        value="pl-form is-lg"
        readonly
      />
    </div>
  </div>
</div>
<v-divider class="my-2"></v-divider>
<div class="pl-form-inline-wrap vertical type-2 ">
  <div class="pl-form-inline">
    <span class="pl-label">
      vertical type-2
    </span>
    <div class="pl-desc">
      <v-text-field
        class="pl-form"
        disabled
      />
    </div>
  </div>
  <div class="pl-form-inline">
    <span class="pl-label">
      평가표 명
    </span>
    <div class="pl-desc">
      <v-text-field
        class="pl-form"
      />
    </div>
  </div>
</div>`
          },
          { tab: "script", content: ``, },
        ],
        srcInput_07: [
          {
            tab: "html",
            content:
`<v-text-field
  v-model="password"
  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
  :rules="[rules.required, rules.min, rules.max]"
  :type="show1 ? 'text' : 'password'"
  class="pl-form"
  @click:append="show1 = !show1"
></v-text-field>`
          },
          { tab: "script", content:
`data() {
  return {
    password: false,
    show1: false,
    rules: {
      required: value => !!value || 'Required.',
      min: v => v.length >= 8 || 'Min 8 characters',
      max: v => v.length <= 16 || 'Min 16 characters',
    },
  }
}
methods: {

}
computed: {

},` },
        ],
        srcInput_08: [
          {
            tab: "html",
            content:
`<v-text-field
    class="pl-form is-search"
    placeholder="검색어 입력"
    @keydown.enter="mixin_testLog('search btn')"
  >
  <template v-slot:append>
    <v-btn
      @click="mixin_testLog('search btn')"
      class="pl-btn has-icon-only">
      <span class="pl-icon20 in-search"></span>
    </v-btn>
  </template>
</v-text-field>`
          },
          { tab: "script", content:
`data() {
  return {

  }
}
methods: {

}
computed: {

},` },
        ],
        srcInput_09: [
          {
            tab: "html",
            content:
`<div class="pl-form-inline-wrap vertical">
  <div class="pl-form-inline">
    <span class="pl-label">
      레이블
      <v-icon class="pl-icon20 required"></v-icon>
    </span>
    <div class="pl-desc">
      <v-text-field
        class="pl-form"
        value="pl-form"
      />
      <p class="pl-form-hint">설문계획 등록 시 지정한 설문조사 명이 자동 출력됩니다.</p>
    </div>
  </div>
</div>`
          },
          { tab: "script", content:
`data() {
  return {

  }
},
methods: {

},
computed: {

},` },
        ],

      },

    }
  },
  methods: {
    callMethod(text) {
      alert(text);
    },
    // appendHiddenLink(){
    //   for (let index = 0; index < this.toplink.length; index++) {
    //     const item = this.toplink[index];

    //     let element = document.querySelectorAll('h2');
    //     const html = `<span id="${item}" class="guide-hidden-link"></span>`
    //     element[index].insertAdjacentHTML('beforebegin',html);

    //   }
    // }
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