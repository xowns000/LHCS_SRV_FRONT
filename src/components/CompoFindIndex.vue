<template>
  <div class="pl-cols">
    <div class="is-vrt">
      <div class="pl-card">
        <!-- search form -->
        <div class="pl-search-form" style="padding-bottom: 0;">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <div class="pl-desc">
                <v-btn-toggle v-model="indexInit" class="pl-btn-group is-index">
                  <span
                    class="pl-btn-group-index"
                    v-for="item in indexGroup"
                    :key="item.id"
                    @click="srch_word(item.text)"
                    >
                    <v-btn  class="pl-btn">
                      {{ item.text }}
                    </v-btn>
                  </span>
                </v-btn-toggle>

              </div>
              <v-text-field
                v-model="SCH_CD_NM"
                class="pl-form is-search"
                placeholder="코드명 검색"
                @keydown.enter="srch_commn_cd('')"
                >
                <template v-slot:append>
                  <v-btn
                    @click="srch_commn_cd('')"
                    class="pl-btn has-icon-only">
                    <span class="pl-icon20 in-search"></span>
                  </v-btn>
                </template>
              </v-text-field>
            </div>
          </div>
        </div>
      </div>
      <div class="pl-card">
        <div class="pl-grid-top">
          <div class="pl-grid-top-left">
            항목을 클릭 하시면 공통코드가 조회됩니다. 사용할 코드는 [선택] 버튼을 클릭 하십시오.
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ ItemsFindIndex.length }})</em> 건</span>
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid"
          :headers="HeadersFindIndex"
          :items="ItemsFindIndex"
          :item-class="isActiveRow"
          fixed-header
          item-key="index"
          height="535px"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
          @click:row="select_comm_cd"
          no-data-text="등록된 데이터가 없습니다."
          >
          <template v-slot:item.selected="{ item }">
            <v-btn
              class="pl-btn is-sm"
              :disabled="!item.selected"
              @click="selectedBtn(item)"
              >
              {{ item.selected ? '선택' : '선택불가' }}
            </v-btn>
          </template>
        </v-data-table>
      </div>
    </div>
    <div class="pl-card is-col-fix" style="width: 440px;">
      <h2 class="pl-subtit">{{ SEL_COMM_CD.CD_NM }}</h2>
      <div class="pl-subdesc">
        <p>선택하신 분류코드에 관리되는 공통코드 입니다.</p>
      </div>
      <!-- grid -->
      <v-data-table
        class="pl-grid mt-5"
        :headers="HeadersFindIndexSub"
        :items="ItemsFindIndexSub"
        fixed-header
        item-key="index"
        height="569px"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
        no-data-text="등록된 데이터가 없습니다."
        >
      </v-data-table>
    </div>

  </div>
 </template>

 <script>
  export default {
    name: 'CompoFindIndex',
    props: {
      SearchInputProp: {
        type: String,
      },
      DataHeaderProp: {
        type: Array,
      },
      DataBodyProp: {
        type: Array,
      },
      DataHeaderSubProp: {
        type: Array,
      },
      DataBodySubProp: {
        type: Array,
      },

    },
    data() {
      return {
        page: 1,
        pageCount: 0,
        perPage: [15,30,50,100],
        ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때
        indexInit: 0, //초기 selected 값
        indexGroup: [
          {id: 0, text: 'ㄱ' },
          {id: 1, text: 'ㄴ' },
          {id: 2, text: 'ㄷ' },
          {id: 3, text: 'ㄹ' },
          {id: 4, text: 'ㅁ' },
          {id: 5, text: 'ㅂ' },
          {id: 6, text: 'ㅅ' },
          {id: 7, text: 'ㅇ' },
          {id: 8, text: 'ㅈ' },
          {id: 9, text: 'ㅊ' },
          {id: 10, text: 'ㅋ' },
          {id: 11, text: 'ㅌ' },
          {id: 12, text: 'ㅍ' },
          {id: 13, text: 'ㅎ' },
          {id: 14, text: '기타' },
        ],
        editedIndex: -1,
        SCH_CHAR: 'ㄱ',

        SCH_CD_NM:'',          //공통코드 검색어
        SEL_COMM_CD: {},          //단일선택 공통코드
        SEL_COMM_DTL_CD: {},      //단일선택 상세공통코드

        HeadersFindIndex: [
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '80px', sortable: false },
          { text: '공통 분류코드', value: 'CD_ID', align: 'left', width: '120px', sortable: false },
          { text: '분류코드 명', value: 'CD_NM', align: 'left', },
          { text: '사용여부', value: 'USE_NM', align: 'left', width: '100px', sortable: false },
          { text: '선택', value: 'selected', align: 'center', width: '100px', sortable: false },
        ],

        ItemsFindIndex: [],

        HeadersFindIndexSub: [
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '60px', sortable: false },
          { text: '공통코드', value: 'CD_ID', align: 'left', width: '90px', sortable: false },
          { text: '공통코드 명', value: 'CD_NM', align: 'left', sortable: false },
          { text: '사용여부', value: 'USE_NM', align: 'left', width: '90px', sortable: false },
        ],

        ItemsFindIndexSub: [],

        //confirm alert 메시지
        MESSAGE : {
          ERROR : {
            ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
          }
        },
      }
    },
    computed :{
    },

    created() {

    },

    mounted() {
      this.srch_commn_cd('');
    },

    methods: {
      srch_word(txt){
        this.SCH_CHAR = txt;
        this.srch_commn_cd('');
      },

      async srch_commn_cd(type){
        let sUrl = '/api/setting/system/cmmn-code-manage/list';
        let postParam = {
          CUSTCO_ID: this.$store.getters["userStore/GE_USER_ROLE"].company.CD,
          GROUP_CD_ID : type == 'DTL' ? this.SEL_COMM_CD.CD_ID : '*',
          SCH_CHAR: type == 'DTL' ?'':this.SCH_CHAR,
          CD_NM: type == 'DTL' ?'':this.SCH_CD_NM
        }
        let headParam = {
          head: {
            URL : "api.setting.system",
            SERVICE : "cmmn-code-manage",
            METHOD : "list",
            ASYNC : false,
            TYPE : "BIZ_SERVICE",
          }
        }

        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          this.ItemsFindIndexSub =[];

          let ArrCommCd = [];
          for(let i=0; i<response.DATA.length; i++){
            const commCdObj = response.DATA[i];
            commCdObj.USE_NM = response.DATA[i].USE_YN === 'Y' ? '사용':'사용안함';
            commCdObj.selected = true;

            ArrCommCd.push(commCdObj);
          }

          type == 'DTL' ? this.ItemsFindIndexSub = ArrCommCd : this.ItemsFindIndex = ArrCommCd;
        }
      },

      //row클릭
      select_comm_cd(item){
        this.SEL_COMM_CD = item;
        this.srch_commn_cd('DTL');
      },

      //row클릭 색상변경
      isActiveRow(item){
        return item.CD_ID== this.SEL_COMM_CD.CD_ID? 'active':'';
      },

      selectedBtn(item) {
        this.$emit("selected-commCd", item);
      }
    },
  }
 </script>

 <style lang="scss" scoped>

 </style>