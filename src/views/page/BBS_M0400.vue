<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  v-model="SEARCH_CONDITION"
                  :items="dropSearchCondition"
                  item-text="name" 
                  item-value="value"
                  placeholder="선택하세요"
                ></v-select>
                <v-text-field
                  class="pl-form is-lg"
                  v-model="SEARCH_KEYWORD"
                />
              </div>
            </div>

            <v-btn class="pl-btn is-icon"
              @click="getSampleList(1)">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body">
        <div class="pl-grid-top">
          <div class="pl-grid-top-left">
            <v-btn
              @click="showRegistForm"
              class="pl-btn is-icon is-sub">
              <span class="pl-icon20 circle-plus"></span>
              등록
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ gridTotalCnt }})</em> 건</span>
          </div>
        </div>
        <v-data-table
          class="pl-grid"
          :headers="headers"
          :items="items"
          fixed-header
          item-key="id"
          height="562px"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
          :page.sync="page"
          no-data-text="등록된 데이터가 없습니다."
          @page-count="pageCount = $event">
          <template v-slot:item.id="{ item }">
            
            <span
              @click="showDetail(item.id)"
              style="text-decoration: underline"
            >
            {{ item.id }}
            </span>
          </template>
        </v-data-table>
        <div class="pl-pager">
          <div class="pl-pager-row">
            <span>페이지당 항목 수</span>
            <v-select
              class="pl-form"
              :value="ROW_PER_PAGE"
              :items="perPage"
              :item-text="toString(ROW_PER_PAGE)"
              @change="ROW_PER_PAGE = parseInt($event, 10);"
            ></v-select>
          </div>
          <v-pagination
            v-model="page"
            :length="pageCount"
            circle
            :total-visible="7"
            @input="getSampleList">
          </v-pagination>
          <span class="pl-pager-period">
          </span>
        </div>
      </div>
    </div>
    <!-- 등록 dialog -->
    <v-dialog
      v-model="dialogReg"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :header-title="IS_REG ? '등록' : '수정'"
        @hide="mixin_hideDialog('Reg')"
        @submit="submitDialog('Reg')"
      >
        <template slot="body">
          <div class="pl-form-inline-wrap vertical">
            <div v-if="!IS_REG" class="pl-form-inline">
              <span class="pl-label">
                카테고리ID
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  v-model="item.id"
                  disabled
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                카테고리명
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  v-model="item.name"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                사용여부
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  v-model="item.useYn"
                  :items="dropUseYn"
                  item-text="name" 
                  item-value="value"
                  placeholder="선택하세요"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                설명
              </span>
              <div class="pl-desc">
                <v-textarea
                  class="pl-form is-noresize"
                  v-model="item.description"
                  :spellcheck="false"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                등록자
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  v-model="item.regUser"
                />
              </div>
            </div>
          </div>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('Reg')">닫기</v-btn>
          <v-btn v-if="IS_REG" class="pl-btn" @click="addSample()">등록</v-btn>
          <v-btn v-if="!IS_REG" class="pl-btn" @click="updateSample()">수정</v-btn>
          <v-btn v-if="!IS_REG" class="pl-btn" @click="deleteSample()">삭제</v-btn>
          <v-btn class="pl-btn" @click="reset()">재설정</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
  name: "MENU_BBS_M0400", //eGov 표준프레임워크 호환성 점검 샘플(연동가이드)
  components: {
  },
  data() {
    return {
      // top search
      SEARCH_CONDITION: '',
      SEARCH_KEYWORD: '',
      dropSearchCondition: [{name:'Name', value:'1'}, {name:'ID', value:'0'}],

      dropUseYn: [{name:'Yes', value:'Y'}, {name:'No', value:'N'}],

      dialogReg: false,
      // grid
      page: 1,
      pageCount: 0,
      perPage: [10],
      ROW_PER_PAGE: 10,
      pagination:{
        page:1,
        rowsPerPage: 500
      },
      gridTotalCnt: 0,
      headers: [
        { text: '번호', value: 'no', align: 'center', width: '80px', sortable: false },
        { text: '카테고리ID', value: 'id', align: 'center', width: '180px', sortable: false },
        { text: '카테고리명', value: 'name', width: '350px', sortable: false},
        { text: '사용여부', value: 'useYn', align: 'center', width: '120px', sortable: false },
        { text: '설명', value: 'description', align: 'center', width: '', sortable: false },
        { text: '등록자', value: 'regUser', align: 'center', width: '120px', sortable: false },
      ],
      items: [],
      item: {
        id:'',
        name:'',
        description:'',
        useYn:'',
        regUser:''
      },
      itemReset : {},

      IS_REG: true,
      SELECTED_ID: '',

    }
  },
  watch: {

  },

  computed: {

  },

  async created() {
    await this.getSampleList(1);
  },

  async mounted() {
    
  },

  methods: {
    //글 목록 조회.
    async getSampleList(page) {
      let sUrl = '/api/egovSampleList.do';
      let params = {
        pageIndex: page,
        searchCondition: this.SEARCH_CONDITION,
        searchKeyword: this.SEARCH_KEYWORD
      }

      await axios.get(
          sUrl, //api url입력
          {params}
        ) //api에 로그를 남기기위한 값입력 (필수) (SERVICE, METHOD, TYPE)
        .then((response) => {
          this.items = response.data.resultList;
          const paginationInfo = response.data.paginationInfo;
          this.items.map((item, index) => {
            item.no = paginationInfo.totalRecordCount+1 - ((paginationInfo.currentPageNo-1) * paginationInfo.pageSize + index + 1)
          });
          console.log(this.items, paginationInfo);

          // 전체 건수
          this.$nextTick(function () {
            this.gridTotalCnt = paginationInfo.totalRecordCount;
            this.pageCount = paginationInfo.totalPageCount;
            this.pagination.page = paginationInfo.currentPageNo;
          });
          
          console.log(this.gridTotalCnt, this.pageCount, this.pagination)

        }) //api 호출 성공 이후 수행
        .catch((err) => {
          this.showAlert(this.MESSAGE.ERROR.ERROR);
        }); 
    },

    //글 등록 폼 조회
    async showRegistForm() {
      let sUrl = '/api/addSample.do';
      let params = {
      }

      await axios.get(
          sUrl, 
          {params}
        ) 
        .then((response) => {
          this.IS_REG = true;
          console.log("response.data", response.data)
          const data = response.data;
          
          this.item = {
            name : data.name,
            description: data.description,
            useYn: data.useYn,
            regUser: data.regUser,
          }
          this.itemReset = _.cloneDeep(this.item);

          console.log("showRegistForm ::: this.item", this.item)

          this.mixin_showDialog('Reg')

        }) //api 호출 성공 이후 수행
        .catch((err) => {
          this.showAlert(this.MESSAGE.ERROR.ERROR);
        }); 
    },


    //글 등록
    async addSample() {
      let sUrl = '/api/addSample.do';
      let params = {
        name : this.item.name,
        description: this.item.description,
        useYn: this.item.useYn,
        regUser: this.item.regUser,
      }

      console.log("addSample ::: params", params)

      await axios.post(
          sUrl, 
          params
        ) 
        .then((response) => {
          
          console.log("addSample ::: response.data", response.data)

          this.getSampleList(1);
          this.mixin_hideDialog('Reg');
          this.item = {}

        }) //api 호출 성공 이후 수행
        .catch((err) => {
          this.showAlert(this.MESSAGE.ERROR.ERROR);
        }); 
    },


    //상세 조회
    async showDetail(selectedId) {
      let sUrl = '/api/updateSampleView.do';
      let params = {
        selectedId: selectedId
      }

      await axios.get(
          sUrl, //api url입력
          {params}
        ) //api에 로그를 남기기위한 값입력 (필수) (SERVICE, METHOD, TYPE)
        .then((response) => {
          this.IS_REG = false;
          console.log("showDetail ::: response.data", response.data)
          this.item = response.data;
          this.itemReset = _.cloneDeep(this.item);
          this.mixin_showDialog('Reg');
        }) //api 호출 성공 이후 수행
        .catch((err) => {
          this.showAlert(this.MESSAGE.ERROR.ERROR);
        }); 
    },

    //글 수정
    async updateSample() {
      let sUrl = '/api/updateSample.do';
      let params = {
        id : this.item.id,
        name : this.item.name,
        description: this.item.description,
        useYn: this.item.useYn,
        regUser: this.item.regUser,
      }

      console.log("updateSample ::: params", params)

      await axios.post(
          sUrl, 
          params
        ) 
        .then((response) => {
          
          console.log("updateSample ::: response.data", response.data)

          this.getSampleList(1);
          this.mixin_hideDialog('Reg');
          this.item = {}

        }) //api 호출 성공 이후 수행
        .catch((err) => {
          this.showAlert(this.MESSAGE.ERROR.ERROR);
        }); 
    },


    //글 삭제
    async deleteSample() {
      let sUrl = '/api/deleteSample.do';
      let params = {
        id : this.item.id
      }

      console.log("deleteSample ::: params", params)

      await axios.get(
          sUrl, 
          {params}
        ) 
        .then((response) => {
          
          console.log("deleteSample ::: response.data", response.data)

          this.getSampleList(1);
          this.mixin_hideDialog('Reg');
          this.item = {}

        }) //api 호출 성공 이후 수행
        .catch((err) => {
          this.showAlert(this.MESSAGE.ERROR.ERROR);
        }); 
    },
    



    //재설정 버튼
    reset() {
      this.item = _.cloneDeep(this.itemReset);
    }


  },

}
</script>

<style lang="scss" scoped>

</style>