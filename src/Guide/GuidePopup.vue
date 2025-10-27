<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <!-- //mark: Default -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <p>1. 다중로그인 설정 필요<br>
        2. index.js 라우터에 등록 필요(변경할 레이아웃에 따라 [component: AuthLayout, component: DefaultLayout]중 적용)<br>
        3. 호출되는 페이지 async mounted에 소스 적용 필요</p>
      <v-btn dark color="red" @click="openPopup">
        open single view
      </v-btn>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

  </div>
</template>

<script>
import guideJs from '@/Guide/guide.js'

export default {
  name: "GuidePopup",

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
        'Default'
      ],
      source01: null,

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<v-btn dark color="red" @click="openPopup">
  open single view
</v-btn>`
          },
          { tab: "script", content:
`//부모페이지 메소드
methods: {
  //open single view
  openPopup(){
    let obj = {
      name: 'M110103', //라우터 등록된 이름
    };
    let routeData = this.$router.resolve(obj);
    window.open(routeData.href, '공통코드관리', 'height=' + screen.height + ',width=' + screen.width + 'fullscreen=yes');
  }
},
//호출되는 페이지 M110103.vue
async mounted() {
  if (this.currentTab != 'M110103') { //라우터 등록 name
    await this.$store.dispatch("commonStore/AC_COMMON_ACTIVE_TAB", {
      id: 'M110103', //라우터 등록 name
      title: '공통코드관리', //탭 타이틀명
      default: 'Y',
      tabIcon: '',
      link: '/M110103',
    });
  }
},` },
        ],
      },
    }
  },
  methods: {
    //open single view
    openPopup(){
      let obj = {
        name: 'M110103', //라우터 등록된 이름
      };
      let routeData = this.$router.resolve(obj);
      window.open(routeData.href, '공통코드관리', 'height=' + screen.height + ',width=' + screen.width + 'fullscreen=yes');
    }
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