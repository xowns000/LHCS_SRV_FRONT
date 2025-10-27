<template>
  <div>
    <div>
      <p>정확한 주소를 모르시는 경우 :  시/군/구 + 도로명, 동명 또는 건물명 예) 동해시 중앙로, 여수 중앙동, 대전 현대아파트</p>
      <p>정확한 주소를 아시는 경우 :  도로명 + 건물번호 예) 종로 6 또는 읍/면/동/리 + 지번 예) 서린동 154-1</p>
    </div>
    <div class="pl-search-form mt-3">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <div class="pl-desc">
            <v-text-field
              v-model="searchInput"
              class="pl-form is-lg"
              @keyup.enter="searchPost('')"
              placeholder="검색어 입력"
            />
            <v-btn class="pl-btn is-icon" @click="searchPost('')">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    <div class="pl-grid-top">
      <div class="pl-grid-top-left"></div>
      <div class="pl-grid-top-utils">
        <span class="pl-counter">전체 <em class="pl-1">({{ totalCount }})</em> 건의 결과가 있습니다.</span>
      </div>
    </div>

     <!-- grid -->
     <v-data-table
      class="pl-grid"
      :headers="headers"
      :items="gridItems"
      fixed-header
      item-key="index"
      height="340px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      :page.sync="page"
      no-data-text="등록된 데이터가 없습니다."
      @page-count="pageCount = $event">
      <template v-slot:item.selected="{ item }">
        <v-btn
          class="pl-btn is-sm is-sub"
          @click="selectedPost(item)"
          >선택</v-btn>
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
        :total-visible="7">
      </v-pagination>

      <span class="pl-pager-period">
        보기 {{ mixin_getPagePeriod(gridItems, page) }} / {{ totalCount }}
          <compo-tooltip-btn
            TitleProp="다음 검색"
            ClassProp="pl-tooltip-btn is-line"
            IconProp="pl-icon20 arrow-next-paging"
            TooltipPositionProp="bottom"
            :DisabledProp = "nextDisabled"
            @btnClick="searchPost('next')"
          ></compo-tooltip-btn>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CompoFindPost',
    props: {
    },
    data() {
      return {
        searchInput: '',
        page: 1,
        pageCount: 0,
        totalCount: 0,
        perPage: [15,30,50,100],
        ROW_PER_PAGE: 15,
        pagination: { 
          page: 1, 
          rowsPerPage: 100, 
          sortBy: "", 
          descending: "" 
        }, //그리드 페이지속성정의
        nextDisabled:true,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
        headers: [
          { text: '우편번호', value: 'zipNo', align: 'center', width: '120px', sortable: false },
          { text: '주소', value: 'roadAddr', sortable: false },
          { text: '선택', value: 'selected', align: 'center', width: '120px', sortable: false },
        ],
        gridItems: [],

        MESSAGE : {
          ALERT : {
            WORD_CHECK : {alertDialogToggle: true, msg: '검색어를 입력해 주세요.', iconClass: 'is-caution', type: 'default'}
            , SPECIAL_WORD_CHECK : {alertDialogToggle: true, msg: '특수문자를 입력 할수 없습니다.', iconClass: 'is-caution', type: 'default'}
          },
          ERROR : {
            ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
          }
        },
      }
    },

    computed :{

    },

    async created() {

      //초기화
      this.$eventBus.$on("reSetPost", () => {
        this.searchInput = '';
        this.totalCount = 0;
        this.gridItems = [];
      });
    },

    methods: {
      checkSearchedWord(searchInput){
        if(searchInput.length >0){
          //특수문자 제거
          var expText = /[%=><]/ ;
          if(expText.test(searchInput) == true){
            this.showAlert(this.MESSAGE.ALERT.SPECIAL_WORD_CHECK);
            this.searchInput = searchInput.split(expText).join(""); 
            return false;
          }
          
          //특정문자열(sql예약어의 앞뒤공백포함) 제거
          var sqlArray = new Array(
            //sql 예약어
            "OR", "SELECT", "INSERT", "DELETE", "UPDATE", "CREATE", "DROP", "EXEC",
                      "UNION",  "FETCH", "DECLARE", "TRUNCATE" 
          );
          
          var regex;
          for(var i=0; i<sqlArray.length; i++){
            regex = new RegExp( sqlArray[i] ,"gi") ;
            
            if (regex.test(searchInput) ) {
                alert("\"" + sqlArray[i]+"\"와(과) 같은 특정문자로 검색할 수 없습니다.");
              this.searchInput = searchInput.replace(regex, "");
              return false;
            }
          }
        }else{
          this.showAlert(this.MESSAGE.ALERT.WORD_CHECK);
          return false;
        }
        return true ;
      },

      async searchPost(next) {
        if (!this.checkSearchedWord(this.searchInput)) {
          return ;
        }

        //다음버튼 클릭 유무
        if (next == 'next'){
        } else {
          this.gridItems = [];
          this.pagination.page = 1; //페이징 처리 초기화
          this.nextDisabled = true;  //버튼 비활성화
        }

        let sUrl = '/api/common/searchZip';
        let postParam = {
          currentPage : this.pagination.page
          , countPerPage : this.pagination.rowsPerPage
          , resultType : 'json'
          , keyword : this.searchInput
        }

        let headParam = {
          head : {
          }
        }

        let response  = await this.common_postCall(sUrl, postParam, headParam);
        
        if (!response.HEADER.ERROR_FLAG){
          let postErrorCode = response.DATA[0].POST.results.common.errorCode;
          let postErrorMsg = response.DATA[0].POST.results.common.errorMessage;

          if(postErrorCode === '0'){
            let tempDataText = response.DATA[0].POST.results.juso;
            let idx = this.gridItems.length + 1;
            for(let i in tempDataText){
              tempDataText[i]["index"]= idx++;
            }

            this.gridItems = [...this.gridItems, ...tempDataText]
            //다음
            //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
            if(response.HEADER.next !== null && response.HEADER.next !== undefined){
              if((this.pagination.page*this.pagination.rowsPerPage) < response.DATA[0].POST.results.common.totalCount){
                this.nextDisabled = false //버튼 활성화
              }else{
                this.nextDisabled = true  //버튼 비활성화
              }
            }

            //이부분은 체크해볼것
            this.pagination.page += 1 
            // this.page=1;
            this.totalCount = response.DATA[0].POST.results.common.totalCount;
          }else{
            this.showAlert({alertDialogToggle: true, msg: postErrorMsg, iconClass: 'is-caution', type: 'default'});
          }
        }
      },
      selectedPost(item) {
        this.$emit('selected-post', item);
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>