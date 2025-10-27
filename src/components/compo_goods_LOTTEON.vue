<template>
  <div>
    <div class="pl-form-inline-wrap vertical" v-if="!mixin_isEmpty(GDS_INFO_PROP)">
      <strong
          class="pl-card-top-title"
          v-if="!mixin_isEmpty(ORDR_INFO_PROP)"
      >
        문의 상품 정보
      </strong>
      <!-- 상품정보 영역 -->
      <div class="pl-text-box" style="width: 100%; height: 200px;">
        <img
            :src="GDS_INFO_PROP.data.itmLst[0].itmImgLst[0].origImgFileNm"
            alt="상품 대표 이미지"
            class="pl-img-grid-unit-img"
            style="max-width: 200px;max-height: 190px;"
        />
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          상품번호
        </span>
        <div class="pl-desc">
          {{ GDS_INFO_PROP.data.spdNo }}
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          상품명
        </span>
        <div class="pl-desc">
          {{ GDS_INFO_PROP.data.spdNm }}
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          판매상태
        </span>
        <div class="pl-desc">
          {{ codeList.SL_STAT_CD.find(item => item.cdId === GDS_INFO_PROP.data.slStatCd).cdNm }}
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          업체상품번호
        </span>
        <div class="pl-desc">
          {{ GDS_INFO_PROP.data.epdNo }}
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          판매유형
        </span>
        <div class="pl-desc">
          {{ codeList.SL_TYP_CD.find(item => item.cdId === GDS_INFO_PROP.data.slTypCd).cdNm }}
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          상품 유형
        </span>
        <div class="pl-desc">
          {{ codeList.PD_TYP_CD.find(item => item.cdId === GDS_INFO_PROP.data.pdTypCd).cdNm }}
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          브랜드 번호
        </span>
        <div class="pl-desc">
          {{ GDS_INFO_PROP.data.brdNo }}
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          제조사명
        </span>
        <div class="pl-desc">
          {{ GDS_INFO_PROP.data.mfcrNm }}
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          원산지 코드
        </span>
        <div class="pl-desc">
      {{ GDS_INFO_PROP.data.oplcCd }}
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          모델번호
        </span>
        <div class="pl-desc">
      {{ GDS_INFO_PROP.data.mdlNo }}
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          판매시작일시
        </span>
        <div class="pl-desc">
      {{ GDS_INFO_PROP.data.slStrtDttm }}
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          판매종료일시
        </span>
        <div class="pl-desc">
      {{ GDS_INFO_PROP.data.slEndDttm }}
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          상품품목고시정보
        </span>
        <div class="pl-desc">
      {{ codeList.PD_ITMS_CD.find(item => item.cdId === GDS_INFO_PROP.data.pdItmsInfo.pdItmsCd).cdNm }}
        </div>
      </div>
    </div>
      <!-- ----------------------- 주문 내역 영역 ----------------------- -->
    <div class="pl-form-inline-wrap vertical" v-if="!mixin_isEmpty(ORDR_INFO_PROP)">
      <v-divider v-if="!mixin_isEmpty(ORDR_INFO_PROP.data)"></v-divider>
      <div
          class="pl-form-inline-wrap vertical"
      >
        <strong
            class="pl-card-top-title"
            v-if="!mixin_isEmpty(ORDR_INFO_PROP.data)"
        >
<!--          {{-->
<!--            ORDR_INFO_PROP.data.length > 1 ? '주문 내역 ( ' + (parseInt(index) + parseInt(1)) + ' / ' + ORDR_INFO_PROP.data.length + ' )' : '주문 내역'-->
<!--          }}-->
        </strong>
        <div class="pl-form-inline-wrap vertical">
          <strong> 주문 처리 이력</strong>
          <div class="pl-form-inline">
        <span class="pl-label ">
          <span class="pl-card-top-var">주문완료일</span>
        </span>
            <div class="pl-desc">
              {{ convertDate(ORDR_INFO_PROP.data.DeliveryOrderList[0].odCmptDttm) }}
            </div>
          </div>
          <v-divider v-if="index < ORDR_INFO_PROP.data.length"></v-divider>
        </div>
        <div
          v-if="!mixin_isEmpty(ORDR_INFO_PROP.data)"
          class="pl-form-inline-wrap vertical"
          >
      <!-- ----------------------- 배송 정보 영역 ----------------------- -->
          <strong> 배송 정보 </strong>
          <div class="pl-form-inline">
           <span class="pl-label ">
              <span class="pl-card-top-var">배송지 고객명</span>
           </span>
            <div class="pl-desc">
              {{ ORDR_INFO_PROP.data.DeliveryOrderList[0].dvpCustNm }}
            </div>
          </div>
          <div class="pl-form-inline">
        <span class="pl-label">
          <span class="pl-card-top-var">배송지이메일주소</span>
        </span>
            <div class="pl-desc">
              {{ ORDR_INFO_PROP.data.DeliveryOrderList[0].dvpEmlAddr }}
            </div>
          </div>
          <div class="pl-form-inline">
        <span class="pl-label">
          <span class="pl-card-top-var">배송지고객연락처</span>
        </span>
            <div class="pl-desc">
              {{ ORDR_INFO_PROP.data.DeliveryOrderList[0].dvpTelNo }}
            </div>
          </div>
          <div class="pl-form-inline">
        <span class="pl-label">
          <span class="pl-card-top-var">배송지고객핸드폰</span>
        </span>
            <div class="pl-desc">
              {{ ORDR_INFO_PROP.data.DeliveryOrderList[0].dvpMphnNo }}
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              <span class="pl-card-top-var">배송지 안심번호</span>
            </span>
            <div class="pl-desc">
              {{ ORDR_INFO_PROP.data.DeliveryOrderList[0].sftNo }}
            </div>
          </div>
          <div class="pl-form-inline">
        <span class="pl-label">
          <span class="pl-card-top-var">우편번호</span>
        </span>
            <div class="pl-desc">
            {{ ORDR_INFO_PROP.data.DeliveryOrderList[0].dvpZipNo }}
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              <span class="pl-card-top-var">배송지도로명주소</span>
            </span>
            <div class="pl-desc">
            {{ ORDR_INFO_PROP.data.DeliveryOrderList[0].dvpStnmZipAddr }}
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              <span class="pl-card-top-var">배송지도로명상세주소</span>
            </span>
            <div class="pl-desc">
            {{ ORDR_INFO_PROP.data.DeliveryOrderList[0].dvpStnmDtlAddr }}
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              <span class="pl-card-top-var">배송 메세지</span>
            </span>
            <div class="pl-desc">
              {{ ORDR_INFO_PROP.data.DeliveryOrderList[0].dvMsg }}
              <!--              {{ item.productOrder.shippingMemo }}-->
            </div>
          </div>
        </div>
        <!-- ----------------------- 주문처리이력 영역 ----------------------- -->
        <div
            v-if="!mixin_isEmpty(ORDR_INFO_PROP.data.DeliveryOrderList)"
            class="pl-form-inline-wrap vertical"
        >
          <strong > 상품주문정보 </strong>
          <div class="pl-form-inline ml-20">
          <span class="pl-label">
            <span class="pl-card-top-var">상품주문번호</span>
          </span>
            <div class="pl-desc">
              <!--              {{ ORDR_INFO_PROP.data.DeliveryOrderList }}-->
              {{ ORDR_INFO_PROP.data.DeliveryOrderList[0].odNo }}
            </div>
          </div>
          <div class="pl-form-inline ml-20">
          <span class="pl-label">
            <span class="pl-card-top-var">상품번호</span>
          </span>
            <div class="pl-desc">
              {{ ORDR_INFO_PROP.data.DeliveryOrderList[0].spdNo }}
            </div>
          </div>
          <div class="pl-form-inline">
        <span class="pl-label">
          <span class="pl-card-top-var">상품명</span>
        </span>
            <div class="pl-desc">
              {{ ORDR_INFO_PROP.data.DeliveryOrderList[0].spdNm }}
            </div>
          </div>
          <div class="pl-form-inline">
        <span class="pl-label">
          <span class="pl-card-top-var">상품주문상태</span>
        </span>
            <div class="pl-desc">
              {{ codeList.ORDR_STAT_CD.find(item => item.cdId === ORDR_INFO_PROP.data.DeliveryOrderList[0].odTypCd).cdNm }}
            </div>
          </div>
          <div class="pl-form-inline">
        <span class="pl-label">
          <span class="pl-card-top-var">클레임 상태</span>
        </span>
            <div class="pl-desc">
          {{ codeList.CLAIM_STAT_CD.find(item => item.cdId === ORDR_INFO_PROP.data.DeliveryOrderList[0].clmRsnCd).cdNm }}
            </div>
          </div>
          <div class="pl-form-inline">
        <span class="pl-label">
          <span class="pl-card-top-var">구매자명</span>
        </span>
            <div class="pl-desc">
              {{ ORDR_INFO_PROP.data.DeliveryOrderList[0].odrNm }}
            </div>
          </div>
          <div class="pl-form-inline">
        <span class="pl-label">
          <span class="pl-card-top-var">구매자 전화번호</span>
        </span>
            <div class="pl-desc">
            {{ ORDR_INFO_PROP.data.DeliveryOrderList[0].mphnNo }}
            </div>
          </div>
          <div class="pl-form-inline">
        <span class="pl-label">
          <span class="pl-card-top-var">주문수량</span>
        </span>
            <div class="pl-desc">
            {{ ORDR_INFO_PROP.data.DeliveryOrderList[0].odQty }}개
              <!--              {{ mixin_isEmpty(item.productOrder.productOption) ? '' : item.productOrder.productOption }}-->
            </div>
          </div>
          <div class="pl-form-inline">
        <span class="pl-label">
          <span class="pl-card-top-var">판매가</span>
        </span>
            <div class="pl-desc">
              {{ mixin_convertNumToComma(ORDR_INFO_PROP.data.DeliveryOrderList[0].slAmt) }}원
              <!--              {{ item.productOrder.quantity }}-->
            </div>
          </div>
          <div class="pl-form-inline">
        <span class="pl-label">
          <span class="pl-card-top-var">실결제금액</span>
        </span>
            <div class="pl-desc">
              {{ mixin_convertNumToComma(ORDR_INFO_PROP.data.DeliveryOrderList[0].actualAmt) }}원
            </div>
          </div>
          <div class="pl-form-inline" v-if="!mixin_isEmpty(ORDR_INFO_PROP.data.DeliveryOrderList[0].owhoDttm)">
            <span class="pl-label">
              <span class="pl-card-top-var">출고지시일</span>
            </span>
            <div class="pl-desc">
              {{ convertDate(ORDR_INFO_PROP.data.DeliveryOrderList[0].owhoDttm) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    BBS_CUTT_INFO_PROP: {
      type: Object,
      default: null
    },
    GDS_INFO_PROP: {
      type: Object,
      default: null
    },
    ORDR_INFO_PROP: {
      type: Object,
      default: null
    },
  },
  data() {
    return {
      gdsInfo: JSON.parse(JSON.stringify(this.GDS_INFO_PROP)),
      ordrInfo: JSON.parse(JSON.stringify(this.ORDR_INFO_PROP)),
      lkagMstId: this.LKAG_MST_ID,
      lkagCommCdList: [],
      dtlActive: false,
      imgYn : false,

      // 롯데온 공통코드 - 굳이 코드화?
      codeList : {
        MALL_DVS_CD :[{ cdId: "LTON", cdNm : "롯데ON"}],
        SL_TYP_CD :[
           { cdId: "GNRL", cdNm : "일반판매상품"}
          ,{ cdId: "CNSL", cdNm : "상담판매상품"}
          ,{ cdId: "GFT", cdNm : "사은품"}
        ],
        PD_TYP_CD :[
           {cdId: "GNRL_GNRL", cdNm: "일반판매_일반상품"}
          ,{cdId: "GNRL_ECPN", cdNm: "일반판매_e쿠폰상품"}
          ,{cdId: "GNRL_GFTV", cdNm: "일반판매_상품권"}
          ,{cdId: "GNRL_ZRWON", cdNm: "일반판매_0원상품"}
          ,{cdId: "CNSL_CNSL", cdNm: "상담판매_상담상품"}
          ,{cdId: "GFT_GNRL", cdNm: "사은품_일반상품"}
          ,{cdId: "GFT_ECPN", cdNm: "사은품_e쿠폰상품"}
          ,{cdId: "GFT_GFTV", cdNm: "사은품_상품권"}
        ],
        PD_ITMS_CD :[
          {cdId :'1', cdNm :'[01]의류'},
          {cdId :'2', cdNm :'[02]구두/신발'},
          {cdId :'3', cdNm :'[03]가방'},
          {cdId :'4', cdNm :'[04]패션잡화(모자/벨트/액세서리 등)'},
          {cdId :'5', cdNm :'[05]침구류/커튼'},
          {cdId :'6', cdNm :'[06]가구(침대/소파/싱크대/DIY제품 등)'},
          {cdId :'7', cdNm :'[07]영상가전(TV류)'},
          {cdId :'8', cdNm :'[08]가정용 전기제품(냉장고/세탁기/식기세척기/전자레인지 등)'},
          {cdId :'9', cdNm :'[09]계절가전(에어컨/온풍기 등)'},
          {cdId :'10', cdNm: '[10]사무용기기(컴퓨터/노트북/프린터 등)'},
          {cdId :'11', cdNm: '[11]광학기기(디지털카메라/캠코더 등)'},
          {cdId :'12', cdNm: '[12]소형전자(MP3/전자사전 등)'},
          {cdId :'13', cdNm: '[13]휴대형 통신기기(휴대폰/태블릿 등)'},
          {cdId :'14', cdNm: '[14]내비게이션'},
          {cdId :'15', cdNm: '[15]자동차용품(자동차부품/기타 자동차용품 등)'},
          {cdId :'16', cdNm: '[16]의료기기'},
          {cdId :'17', cdNm: '[17]주방용품'},
          {cdId :'18', cdNm: '[18]화장품'},
          {cdId :'19', cdNm: '[19]귀금속/보석/시계류'},
          {cdId :'20', cdNm: '[20] 농수축산물'},
          {cdId :'21', cdNm: '[21]가공식품'},
          {cdId :'22', cdNm: '[22]건강기능식품'},
          {cdId :'23', cdNm: '[23]어린이제품'},
          {cdId :'24', cdNm: '[24]악기'},
          {cdId :'25', cdNm: '[25]스포츠용품'},
          {cdId :'26', cdNm: '[26]서적'},
          {cdId :'27', cdNm: '[27]호텔/펜션 예약'},
          {cdId :'28', cdNm: '[28]여행 상품'},
          {cdId :'29', cdNm: '[29]항공권'},
          {cdId :'30', cdNm: '[30]자동차 대여 서비스(렌터카)'},
          {cdId :'31', cdNm: '[31]물품대여 서비스(정수기,비데,공기청정기 등)'},
          {cdId :'32', cdNm: '[32]물품대여 서비스(서적,유아용품,행사용품 등)'},
          {cdId :'33', cdNm: '[33]디지털 콘텐츠(음원,게임,인터넷강의 등)'},
          {cdId :'34', cdNm: '[34]상품권/쿠폰'},
          {cdId :'35', cdNm: '[35]모바일쿠폰'},
          {cdId :'36', cdNm: '[36]영화/공연'},
          {cdId :'37', cdNm: '[37]기타(용역)'},
          {cdId :'38', cdNm: '[38]기타(재화)'},
          {cdId :'39', cdNm: '[39]생활화학제품'},
          {cdId :'40', cdNm: '[40]살생물제품'},
        ],
        SL_STAT_CD : [
          {cdId :'END', cdNm : '판매종료'},
          {cdId :'SALE', cdNm : '판매중'},
          {cdId :'SOUT', cdNm : '품절'},
          {cdId :'STP', cdNm : '판매중지'},
        ],
        ORDR_STAT_CD : [
          {cdId :'10', cdNm : '주문'},
          {cdId :'20', cdNm : '취소(주문취소)'},
          {cdId :'30', cdNm : '교환'},
          {cdId :'31', cdNm : '교환취소'},
          {cdId :'40', cdNm : '반품 '},
          {cdId :'41', cdNm : '반품취소'},
          {cdId :'50', cdNm : 'AS'},
        ],
        CLAIM_STAT_CD : [
          {cdId :'101', cdNm : '배송이 늦어짐'},
          {cdId :'102', cdNm : '상품이 품절됨'},
          {cdId :'103', cdNm : '옵션/사이즈 변경 / 취소'},
          {cdId :'104', cdNm : '다른 곳보다 비쌈'},
          {cdId :'105', cdNm : '쿠폰/할인혜택 변경'},
          {cdId :'106', cdNm : '구매의사 없어짐'},
          {cdId :'107', cdNm : '사은품 변경 / 취소'},
          {cdId :'108', cdNm : '결제수단 변경(구매사은 적용/카드변경 등)'},
          {cdId :'109', cdNm : '유사상품 구매'},
          {cdId :'110', cdNm : '상품정보 미흡'},
          {cdId :'201', cdNm : '상품에 하자가 있음(파손/불량)'},
          {cdId :'202', cdNm : '다른 상품이 배송됨'},
          {cdId :'203', cdNm : '상품이 생각과 다름(상품정보상이)'},
          {cdId :'204', cdNm : '고객 취향과 상이함'},
          {cdId :'301', cdNm : '상품에 하자가 있음(파손/불량)'},
          {cdId :'302', cdNm : '구매의사 없어짐'},
          {cdId :'303', cdNm : '구매의사 없어짐(기간 이후)'},
          {cdId :'304', cdNm : '다른 상품이 배송됨'},
          {cdId :'305', cdNm : '상품이 생각과 다름(상품정보상이)'},
          {cdId :'306', cdNm : '옵션/사이즈 불만'},
          {cdId :'307', cdNm : '결제수단변경(구매사은 적용/카드 변경 등)'},
          {cdId :'308', cdNm : '상품/구성품이 안옴'},
          {cdId :'309', cdNm : '다른 곳보다 비쌈'},
        ]
      }
    }
  },
  async created() {
    console.log(" Compo Goods created")
    // this.gdsInfo = JSON.parse(JSON.stringify(this.GDS_INFO_PROP));
    // this.ordrInfo = JSON.parse(JSON.stringify(this.ORDR_INFO_PROP));
  },
  mounted() {
  },
  methods: {
    convertDate(dateString){
      let year = dateString.substring(0, 4);
      let month = dateString.substring(4, 6);
      let day = dateString.substring(6, 8);
      let hour = dateString.substring(8, 10);
      let minute = dateString.substring(10, 12);
      let second = dateString.substring(12, 14);

      // Format the date string
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },

    getCdNm(cdId) {
      // SL_TYP_CD에서 cdId로 cdNm을 찾음
      const found = this.codeList.SL_TYP_CD.find(item => item.cdId === cdId);
      return found ? found.cdNm : '없음';
    }

  },
  computed: {

  },
  watch: {
    GDS_INFO_PROP() {
      // console.log("GSDS_INFO", this.GDS_INFO_PROP)
      // this.gdsInfo = JSON.parse(JSON.stringify(this.GDS_INFO_PROP));
      this.dtlActive = false
      this.imgYn = false
    },
    // ORDR_INFO_PROP() {
    //   console.log("ORDR_INFO", this.ORDR_INFO_PROP)
    //   this.ordrInfo = JSON.parse(JSON.stringify(this.ORDR_INFO_PROP));
    // },
  },
  beforeDestroy() {
    console.log("destroy")
  },
  beforeUpdate() {
    // this.setAnswerParam();
  }
}
</script>

<style lang="scss" scoped>

</style>