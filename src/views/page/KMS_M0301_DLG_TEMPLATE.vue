<template>
    <div class="pl-cols">
      <div class="is-col-fix is-vrt" style="width: 410px">
        <div class="pl-card">
          <p>좌측의 템플릿 목록을 클릭 하시면 템플릿 레이아웃이 표시됩니다. 원하는 템플릿을 선택 후 <strong>[사용] 버튼을 클릭</strong>하십시오</p>
        </div>
        <div class="pl-card">
          <span class="pl-counter">전체 <em class="pl-1">({{ GUIDE_INDEX.imgItems.length }})</em> 건</span>
          <!-- img grid -->
          <v-data-table
            class="pl-grid type-temaplate is-mt-m"
            :headers="GUIDE_INDEX.imgHeaders"
            :items="GUIDE_INDEX.imgItems"
            hide-default-header
            show-select
            single-select
            item-key="KMS_TMPL_ID"
            height="500px"
            hide-default-footer
            :page.sync="page"
            @item-selected="selectTmp"
            @page-count="pageCount = $event"
            >
            <!-- @click:row="selectItem" -->
            <template v-slot:item.FILE_URI="{ item }">
              <div
                class="pl-img-grid-unit"
                :class="mixin_getItemClass(item)"
              >
                <img
                  :src=" '/upload/' + item.FILE_URI "
                  :alt="item.ACTL_FILE_NM"
                  class="pl-img-grid-unit-img"
                />
              </div>
            </template>
          </v-data-table>

        </div>
      </div>
      <div class="pl-card" style=" overflow-y: auto; height: 630px; " v-html=" restoreXSS_CKeditor(GUIDE_INDEX.selectedTemplate)">
      </div>
    </div>
</template>

<script>

export default {
  name: "KMS_DLG_TEMPLATE",
  props: {
    
  }, 
  components: {
  },
  data() {
    return {
      GUIDE_INDEX: {
        imgHeaders: [
          { text: '이미지', value: 'FILE_URI', align: 'center', },
        ],
        imgItems: [],
        selectedTemplate: '템플릿을 선택하세요',
      },
      ROW_PER_PAGE : 500,
      page : 1,
      pageCount : 0,
      selTmpl : null,

      MESSAGE : {
        ALERT : {
          SEL_TMP : {alertDialogToggle: true, msg: '템플릿을 선택하세요', iconClass: 'is-info', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        }
      },
    }
  },
  watch: {
  },
  computed: {
  },
  created() {
    this.searchList();
  },
  mounted() {
  },
  methods: {
    selectTmp( selectItem ){
      if( selectItem.value ) {
        this.selTmpl = selectItem.item;
        this.selectItem( selectItem.item );
      } else {
        this.selTmpl = null;
        this.GUIDE_INDEX.selectedTemplate = "템플릿을 선택하세요";
      }
    },
    async searchList() {
      const sUrl = '/api/km/template/list';
      const headParam = {head: {}};
      const postParam = {
        USE_YN : "Y"
      };

      let resData = await this.common_postCall(sUrl, postParam, headParam );

      if(!resData.HEADER.ERROR_FLAG) {
        this.GUIDE_INDEX.imgItems = resData.DATA;
        this.GUIDE_INDEX.imgItems.forEach(item => {
          // item.img = "/api/file/km/images/"+ item.FILE_GROUP_KEY+ '/' +item.FILE_KEY;

          if(this.mixin_isEmpty(item.STRG_FILE_NM)){
            item.FILE_URI = "";
          }
        });
      }
    },
    async selectItem(item) {
      const sUrl = '/api/km/template/detail';
      const headParam = {head: {}};
      const postParam = {KMS_TMPL_ID: item.KMS_TMPL_ID};

      let resData = await this.common_postCall(sUrl, postParam, headParam );
      if(!resData.HEADER.ERROR_FLAG) {
        this.GUIDE_INDEX.selectedTemplate = resData.DATA[0].KMS_TMPL_CN;
      }
    },
    seletedTemplateCN() {
      if( this.mixin_isEmpty( this.selTmpl ) ){
        this.showAlert(this.MESSAGE.ALERT.SEL_TMP);
        return null;
      }
      return this.GUIDE_INDEX.selectedTemplate;
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
