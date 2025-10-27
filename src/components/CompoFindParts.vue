<template>
  <div class="pl-cols">
    <div class="is-vrt">
      <div class="pl-card">
        <!-- search form -->
        <div class="pl-search-form" style="padding-bottom: 0;">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <div class="pl-desc">
                <v-select
                  v-model="COMPO_SCH_DATA_TYPE_CD"
                  class="pl-form"
                  :items="mixin_common_code_get(COMM_CD_DROP_LIST, 'EXPN_PT','전체')"
                ></v-select>
                <v-btn-toggle v-model="FIRST_CHAR" class="pl-btn-group is-index">
                  <span
                    class="pl-btn-group-index"
                    v-for="item in indexGroup"
                    :key="item.id"
                    @click="search(item.text)"
                  >
                    <v-btn  class="pl-btn">
                      {{ item.text }}
                    </v-btn>
                  </span>
                </v-btn-toggle>

              </div>
              <v-text-field
                v-model="SCH_EXPSN_ATTR_NM"
                class="pl-form is-search"
                placeholder="항목명 검색"
                @keydown.enter="search()"
                >
                <template v-slot:append>
                  <v-btn
                    @click="search()"
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
            항목을 클릭 하시면 설명이 조회됩니다. 사용할 항목은 [선택] 버튼을 클릭 하십시오.
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
          </div>
        </div>
        <ul class="pl-list-box is-mt-m" style="height: 540px; overflow-y: auto;">
          <li v-for="item in items"
            :key="item.id"
            @click="getExpsnAttrDetailInfo(item)"
          >
            <v-icon :class="`pl-icon20 parts-${ item.type }`"></v-icon>
            <div class="pl-list-box-parts">
              <span>항목명 : {{ item.EXPSN_ATTR_NM }}</span>
              <span>항목속성 : {{ item.DATA_TYPE_NM }}</span>
              <span>항목ID : {{ item.EXPSN_ATTR_COL_ID }}</span>
              <span>항목길이 : {{ item.DATA_LEN }}</span>
            </div>
            <v-btn
              class="pl-btn is-sm"
              :disabled="!item.btn_enable"
              @click="selectExpsnAttr(item)"
            >
              {{ !item.btn_enable ? '사용중' : '선택'}}
            </v-btn>
          </li>
        </ul>
      </div>
    </div>
    <div class="pl-card is-col-fix" style="width: 300px;">
      <h2 class="pl-subtit">{{ EXPSN_ATTR_NM }} 항목 설명</h2>
      <div class="pl-subdesc">
        <p>{{ EXPSN_ATTR_EXPLN }}</p>
      </div>
    </div>

  </div>
 </template>

 <script>
  export default {
    name: 'CompoFindParts',
    props: {
      SearchInputProp: {
        type: String,
      },
      DataBodyProp: {
        type: Array,
      },
      exceptionList: {
        type: Array,
      },
    },
    data() {
      return {
        COMM_CD_LIST:[],                    //사용할 공통코드 리스트
        COMM_CD_DROP_LIST:[],               //공통코드로 생성된 드롭박스 리스트

        searchDataTypeDropItems: [], //데이터 타입 유형 검색 드롭박스
        items:[],

        COMPO_SCH_DATA_TYPE_CD: '',
        FIRST_CHAR: 0, //초기 selected 값
        SCH_CHAR: '',
        SCH_EXPSN_ATTR_NM: '',
        indexGroup: [
          {id: 0, text: '전체' },
          {id: 1,  text: 'ㄱ' },
          {id: 2,  text: 'ㄴ' },
          {id: 3,  text: 'ㄷ' },
          {id: 4,  text: 'ㄹ' },
          {id: 5,  text: 'ㅁ' },
          {id: 6,  text: 'ㅂ' },
          {id: 7,  text: 'ㅅ' },
          {id: 8,  text: 'ㅇ' },
          {id: 9,  text: 'ㅈ' },
          {id: 10,  text: 'ㅊ' },
          {id: 11,  text: 'ㅋ' },
          {id: 12,  text: 'ㅌ' },
          {id: 13,  text: 'ㅍ' },
          {id: 14,  text: 'ㅎ' },
          {id: 15,  text: '기타' },
        ],

        ATTR_ID : '',
        EXPSN_ATTR_NM : '',
        EXPSN_ATTR_EXPLN : '',

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

    //공통코드 사용시 async-await 필수 (mixin_common_code_get_all함수로 공통코드 리스트를 가지고 오기 전에 mixin_common_code_get이벤트 발생)
    async mounted() {
      //공통코드 목록 => 사용할 공통코드 리스트에 넣기
      this.COMM_CD_LIST = [
        "EXPN_PT"         //확장속성 데이타 타입
      ];
      //공통코드별 드롭박스 만들기
      this.COMM_CD_DROP_LIST = await this.mixin_common_code_get_all(this.COMM_CD_LIST);

      this.search();
    },

    methods: {
      async search(schWord){
        this.EXPSN_ATTR_NM = '';
        this.EXPSN_ATTR_EXPLN = '';
        if(schWord) this.SCH_CHAR = schWord;

        let sUrl = '/api/setting/expsnAttr/expsnAttrList';
        let postParam = {
          CUSTCO_ID : this.$store.getters["userStore/GE_USER_COMPANY"].CD
          , BSC_PVSN_ATTR_YN : "Y"
          , SE : this.SearchInputProp
          , SCH_CHAR : (this.SCH_CHAR=="기타"?"ETC":this.SCH_CHAR=="전체"?'':this.SCH_CHAR)
          , DATA_TYPE_CD : this.COMPO_SCH_DATA_TYPE_CD
          , EXPSN_ATTR_NM : this.SCH_EXPSN_ATTR_NM
        }

        let headParam = {
          head : {
            PAGING : "Y"
            , ROW_CNT: 500
            , PAGES_CNT: 1
          }
        }

        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          response.DATA.forEach((data, idx) => {
            data.type = this.getIconClassNm(data.DATA_TYPE_CD);

            let iCnt = 0;
            if(this.exceptionList){
              this.exceptionList.forEach((exce, seq) => {
                if(exce.EXPSN_ATTR_COL_ID === data.EXPSN_ATTR_COL_ID) iCnt++;
              });
            }

            data.btn_enable = iCnt>0?false:true;
          });

          this.items = response.DATA;
        }
      },

      getIconClassNm(data) {
        let classNm = 'string';
        if(data === 'TXT') classNm = 'string'; //문자형
        else if(data === 'NUM') classNm = 'number'; //숫자형
        else if(data === 'NUM_COMMA') classNm = 'number'; //숫자형(',' 포함)
        else if(data === 'COE') classNm = 'check'; //단일선택형
        else if(data === 'COE_MULTI') classNm = 'check'; //다중선택형
        else if(data === 'DAT') classNm = 'date'; //날짜형
        else if(data === 'POST') classNm = 'post'; //우편번호
        else if(data === 'HASH') classNm = 'hashtag'; //해시태그

        return classNm;
      },

      getExpsnAttrDetailInfo(item) {
        this.ATTR_ID = item.ATTR_ID;
        this.EXPSN_ATTR_NM = item.EXPSN_ATTR_NM;
        this.EXPSN_ATTR_EXPLN = item.EXPSN_ATTR_EXPLN;
      },

      selectExpsnAttr(item) {
        this.$emit("selected-expsnAttr", item);
      },
    },
  }
  </script>

  <style lang="scss" scoped>

  </style>