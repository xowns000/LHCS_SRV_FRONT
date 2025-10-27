<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <!-- //mark: default -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <ul class="pl-list-dot">
          <li>비밀번호는 8~16자의 영문 대소문자, 숫자 특수문자만 가능합니다.</li>
          <li>사용 가능한 특수문자 32자<br/>: ! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ ₩ ] ^ _ ` { | } ~</li>
        </ul>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: no border -->
    <h2>{{ toplink[1] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <ul class="pl-list-dot is-no-border">
          <li>비밀번호는 8~16자의 영문 대소문자, 숫자 특수문자만 가능합니다.</li>
          <li>사용 가능한 특수문자 32자<br/>: ! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ ₩ ] ^ _ ` { | } ~</li>
        </ul>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />

    <!-- //mark: Info List -->
    <h2>{{ toplink[2] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <ul class="pl-list-info">
          <li>미리보기는 고객의 휴대폰 단말기의 기종 및 고객 개인별 폰트 설정 등에 따라 위 위의 미리보기와 차이가 있을 수 있습니다.</li>
        </ul>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source03" :SrcProp="srcAll.srcInput_03" />

    <!-- //mark: Info Title List -->
    <h2>{{ toplink[3] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <ul class="pl-list-info">
          <li>
            <strong class="pl-list-info-title">상담사 연결형(기본형)</strong>
            <p class="pl-list-info-desc">미리보기는 고객의 휴대폰 단말기의 기종 및 고객 개인별 폰트 설정 등에 따라 위 위의 미리보기와 차이가 있을 수 있습니다.</p>
          </li>
        </ul>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source04" :SrcProp="srcAll.srcInput_04" />

    <!-- //mark: Info List 2 -->
    <h2>{{ toplink[4] }}</h2>
    <div class="guide-card">
      <ul class="pl-list-info2">
        <li style="width: 250px">
          <span class="pl-list-info-title">타이틀</span>
          <strong class="pl-list-info-desc">세부 설명입니다. 세부 설명입니다. 세부 설명입니다.</strong>
        </li>
        <li >
          <span class="pl-list-info-title">타이틀</span>
          <strong class="pl-list-info-desc">세부 설명입니다.</strong>
        </li>
        <li >
          <span class="pl-list-info-title">타이틀</span>
          <strong class="pl-list-info-desc">세부 설명입니다.</strong>
        </li>
        <li >
          <span class="pl-list-info-title">타이틀</span>
          <strong class="pl-list-info-desc is-txt-main">세부 설명입니다.</strong>
        </li>
        <li >
          <span class="pl-list-info-title">타이틀</span>
          <strong class="pl-list-info-desc">세부 설명입니다.</strong>
        </li>
      </ul>
    </div>
    <guide-srcview :ModelProp.sync="source05" :SrcProp="srcAll.srcInput_05" />

    <!-- //mark: link List -->
    <h2>{{ toplink[5] }}</h2>
    <div class="guide-card">
      <ul class="pl-link-list">
        <li >
          <span class="pl-link-list-title">학점인정 신청안내</span>
        </li>
        <li >
          <span class="pl-link-list-title">학점인정 신청안내</span>
        </li>
        <li >
          <span class="pl-link-list-title">학점인정 신청안내</span>
        </li>
      </ul>
    </div>
    <guide-srcview :ModelProp.sync="source06" :SrcProp="srcAll.srcInput_06" />

    <!-- //mark: no data -->
    <h2>{{ toplink[6] }}</h2>
    <div class="guide-card">
      <ul>
        <li class="pl-list-nodata">
          <span>등록된 데이터가 없습니다.</span>
        </li>
      </ul>

      <div class="pl-list-nodata">
        <span>등록된 데이터가 없습니다.</span>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source07" :SrcProp="srcAll.srcInput_07" />


  </div>
</template>

<script>

import guideJs from '@/Guide/guide.js'

export default {
  name: "GuideList",

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
        'Dot List',
        'Dot List - no border',
        'Info List',
        'Info Title List',
        'Info List2',
        'Link list',
        'No Data',
      ],
      source01: null,
      source02: null,
      source03: null,
      source04: null,
      source05: null,
      source06: null,
      source07: null,

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<ul class="pl-list-dot">
  <li>비밀번호는 8~16자의 영문 대소문자, 숫자 특수문자만 가능합니다.</li>
  <li>사용 가능한 특수문자 32자<br/>: ! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ ₩ ] ^ _ \` { | } ~</li>
</ul>`
          },
          { tab: "script", content:
`data() {
  return {

  }
}` },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`<ul class="pl-list-dot is-no-border">
  <li>비밀번호는 8~16자의 영문 대소문자, 숫자 특수문자만 가능합니다.</li>
  <li>사용 가능한 특수문자 32자<br/>: ! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ ₩ ] ^ _ \` { | } ~</li>
</ul>`
          },
          { tab: "script", content:
`` },
        ],
        srcInput_03: [
          {
            tab: "html",
            content:
`<ul class="pl-list-info">
  <li>미리보기는 고객의 휴대폰 단말기의 기종 및 고객 개인별 폰트 설정 등에 따라 위 위의 미리보기와 차이가 있을 수 있습니다.</li>
</ul>`
          },
          { tab: "script", content:
`data() :{
  return {

  }
}
methods: {

}
computed: {

},` },
        ],
        srcInput_04: [
          {
            tab: "html",
            content:
`<ul class="pl-list-info">
  <li>
    <strong class="pl-list-info-title">상담사 연결형(기본형)</strong>
    <p class="pl-list-info-desc">미리보기는 고객의 휴대폰 단말기의 기종 및 고객 개인별 폰트 설정 등에 따라 위 위의 미리보기와 차이가 있을 수 있습니다.</p>
  </li>
</ul>`
          },
          { tab: "script", content:
`data() :{
  return {

  }
}
methods: {

}
computed: {

},` },
        ],
        srcInput_05: [
          {
            tab: "html",
            content:
`<ul class="pl-list-info2">
  <li style="width: 250px">
    <span class="pl-list-info-title">타이틀</span>
    <strong class="pl-list-info-desc">세부 설명입니다. 세부 설명입니다. 세부 설명입니다.</strong>
  </li>
  <li >
    <span class="pl-list-info-title">타이틀</span>
    <strong class="pl-list-info-desc">세부 설명입니다.</strong>
  </li>
  <li >
    <span class="pl-list-info-title">타이틀</span>
    <strong class="pl-list-info-desc">세부 설명입니다.</strong>
  </li>
  <li >
    <span class="pl-list-info-title">타이틀</span>
    <strong class="pl-list-info-desc is-txt-main">세부 설명입니다.</strong>
  </li>
  <li >
    <span class="pl-list-info-title">타이틀</span>
    <strong class="pl-list-info-desc">세부 설명입니다.</strong>
  </li>
</ul>`
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
        srcInput_06: [
          {
            tab: "html",
            content:
`<ul class="pl-link-list">
  <li >
    <span class="pl-link-list-title">학점인정 신청안내</span>
  </li>
  <li >
    <span class="pl-link-list-title">학점인정 신청안내</span>
  </li>
  <li >
    <span class="pl-link-list-title">학점인정 신청안내</span>
  </li>
</ul>`
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
        srcInput_07: [
          {
            tab: "html",
            content:
`//ul 태그 내에 있을때 li 태그 사용
<li class="pl-list-nodata">
  <span>등록된 데이터가 없습니다.</span>
</li>

//div태그 내에 있을때 div 태그 사용
<div class="pl-list-nodata">
  <span>등록된 데이터가 없습니다.</span>
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