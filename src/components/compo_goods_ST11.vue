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
            :src="GDS_INFO_PROP['ns2:products']['ns2:product']['prdImage01']"
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
          {{ GDS_INFO_PROP["ns2:products"]["ns2:product"]["prdNo"]}}
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          상품명
        </span>
        <div class="pl-desc">
          {{ GDS_INFO_PROP["ns2:products"]["ns2:product"]["prdNm"] }}
        </div>
      </div>
<!--      <div class="pl-form-inline">-->
<!--        <span class="pl-label">-->
<!--          상품 상세 정보-->
<!--        </span>-->
<!--        <div class="pl-desc" v-if="imgYn">-->
<!--          <div-->
<!--              class="text-center"-->
<!--              v-if="!mixin_isEmpty(GDS_INFO_PROP['ns2:products']['ns2:product']['prdImage02'])"-->
<!--          >-->
<!--            &lt;!&ndash; 상세 버튼 &ndash;&gt;-->
<!--            <compo-tooltip-btn-->
<!--                v-if="!mixin_isEmpty(GDS_INFO_PROP['ns2:products']['ns2:product']['prdImage02'])"-->
<!--                TitleProp="상품 상세"-->
<!--                ClassProp="pl-tooltip-btn is-line"-->
<!--                :IconProp="dtlActive ? 'pl-icon20 arrow-down' : 'pl-icon20 arrow-up'"-->
<!--                StyleProp="border: 0"-->
<!--                TooltipPositionProp="bottom"-->
<!--                @btnClick="dtlActive = !dtlActive"-->
<!--            ></compo-tooltip-btn>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="pl-desc" v-else v-dompurify-html="replaceDetail(mixin_decode(GDS_INFO_PROP.originProduct.detailContent))">-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="pl-form-inline" v-if="imgYn">-->
<!--        <div-->
<!--            class="pl-desc"-->
<!--            v-if="dtlActive"-->
<!--            v-dompurify-html="replaceDetail(mixin_decode(GDS_INFO_PROP.originProduct.detailContent))"-->
<!--        >-->
<!--          <v-divider class="pb-4 mt-4"></v-divider>-->
<!--        </div>-->
<!--      </div>-->
      <div class="pl-form-inline">
        <span class="pl-label">
          상품 판매 가격
        </span>
        <div class="pl-desc">
          {{ mixin_convertNumToComma(GDS_INFO_PROP["ns2:products"]["ns2:product"]["selPrc"]) + "원" }}
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          판매 시작일
        </span>
        <div class="pl-desc">
          {{GDS_INFO_PROP["ns2:products"]["ns2:product"]["aplBgnDy"] }}
        </div>
      </div>
<!--      <div class="pl-form-inline">-->
<!--        <span class="pl-label">-->
<!--          원산지 정보-->
<!--        </span>-->
<!--        <div class="pl-desc">-->
<!--          {{ GDS_INFO_PROP.originProduct.detailAttribute.originAreaInfo.content }}-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="pl-form-inline">-->
<!--        <span class="pl-label">-->
<!--          네이버쇼핑 등록 여부-->
<!--        </span>-->
<!--        <div class="pl-desc">-->
<!--          {{ GDS_INFO_PROP.smartstoreChannelProduct.naverShoppingRegistration === true ? '등록' : '미등록' }}-->
<!--        </div>-->
      </div>
      <!-- ----------------------- 주문 내역 영역 ----------------------- -->
      <v-divider class="mt-6" v-if="!mixin_isEmpty(GDS_INFO_PROP) && !mixin_isEmpty(ORDR_INFO_PROP)"></v-divider>
      <div class="pl-form-inline-wrap mt-6 vertical">
        <strong
            class="pl-card-top-title"
            v-if="!mixin_isEmpty(ORDR_INFO_PROP)"
        >
          {{
            '주문 내역'
          }}
        </strong>
        <div
          v-if="!mixin_isEmpty(ORDR_INFO_PROP)"
          class="pl-form-inline-wrap vertical"
        >
        <strong > 상품주문정보 </strong>
          <div class="pl-form-inline ml-20">
          <span class="pl-label">
            <span class="pl-card-top-var">상품주문번호</span>
          </span>
            <div class="pl-desc">
              {{ ORDR_INFO_PROP["ns2:orders"]["ns2:order"]["ordNo"] }}
            </div>
          </div>
          <div class="pl-form-inline ml-20">
          <span class="pl-label">
            <span class="pl-card-top-var">상품명</span>
          </span>
            <div class="pl-desc">
              {{ ORDR_INFO_PROP["ns2:orders"]["ns2:order"]["prdNm"] }}
            </div>
          </div>
          <div class="pl-form-inline ml-20">
          <span class="pl-label">
            <span class="pl-card-top-var">상품번호</span>
          </span>
            <div class="pl-desc">
              {{ ORDR_INFO_PROP["ns2:orders"]["ns2:order"]["prdNo"] }}
            </div>
          </div>
          <div class="pl-form-inline">
        <span class="pl-label">
          <span class="pl-card-top-var">주문 순번</span>
        </span>
            <div class="pl-desc">
              {{ ORDR_INFO_PROP["ns2:orders"]["ns2:order"]["ordPrdSeq"] }}
            </div>
          </div>
          <div class="pl-form-inline">
        <span class="pl-label">
          <span class="pl-card-top-var">상품주문상태</span>
        </span>
            <div class="pl-desc">
<!--              {{-->
<!--                $linkage.lkag_common_code_get(lkagCommonCode, 'NAVER_PRODUCT_ORDER_STATUS').find((el) => {-->
<!--                  if (el.cdValue === item.productOrder.productOrderStatus) return el.text-->
<!--                }).text-->
<!--              }}-->
              {{ORDR_INFO_PROP["ns2:orders"]["ns2:order"]["ordPrdStatNm"]}}
            </div>
          </div>
          <div class="pl-form-inline">
        <span class="pl-label">
          <span class="pl-card-top-var">주문 수량</span>
        </span>
            <div class="pl-desc">
<!--              {{-->
<!--                !mixin_isEmpty(item.productOrder.claimStatus) ? $linkage.lkag_common_code_get(lkagCommonCode, 'NAVER_CLAIM_STATUS').find((el) => {-->
<!--                  if (el.cdValue === item.productOrder.claimStatus) return el.text-->
<!--                }).text : ''-->
<!--              }}-->
              {{ORDR_INFO_PROP["ns2:orders"]["ns2:order"]["ordQty"]}}
            </div>
          </div>
          <div class="pl-form-inline">
        <span class="pl-label">
          <span class="pl-card-top-var">배송지우편번호</span>
        </span>
            <div class="pl-desc">
              {{ ORDR_INFO_PROP["ns2:orders"]["ns2:order"]["rcvrMailNo"] }}
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
          <span class="pl-card-top-var">배송기본주소</span>
        </span>
            <div class="pl-desc">
              {{ ORDR_INFO_PROP["ns2:orders"]["ns2:order"]["rcvrBaseAddr"] }}
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
          <span class="pl-card-top-var">배송상세주소</span>
        </span>
            <div class="pl-desc">
              {{ ORDR_INFO_PROP["ns2:orders"]["ns2:order"]["rcvrDtlsAddr"] }}
            </div>
          </div>
          <div class="pl-form-inline">
        <span class="pl-label">
          <span class="pl-card-top-var">수령자명</span>
        </span>
            <div class="pl-desc">
              {{ ORDR_INFO_PROP["ns2:orders"]["ns2:order"]["rcvrNm"] }}
            </div>
          </div>
          <div class="pl-form-inline">
        <span class="pl-label">
          <span class="pl-card-top-var">수령자핸드폰번호</span>
        </span>
            <div class="pl-desc">
              {{ ORDR_INFO_PROP["ns2:orders"]["ns2:order"]["rcvrPrtblNo"] }}
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              <span class="pl-card-top-var">수령자전화번호</span>
            </span>
            <div class="pl-desc">
              {{ ORDR_INFO_PROP["ns2:orders"]["ns2:order"]["rcvrTlphn"] }}
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              <span class="pl-card-top-var">배송업체명</span>
            </span>
            <div class="pl-desc">
              {{ ORDR_INFO_PROP["ns2:orders"]["ns2:order"]["dlvEtprsCd"] }}
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              <span class="pl-card-top-var">송장번호</span>
            </span>
            <div class="pl-desc">
              {{ ORDR_INFO_PROP["ns2:orders"]["ns2:order"]["invcNo"] }}
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              <span class="pl-card-top-var">발송처리일</span>
            </span>
            <div class="pl-desc">
              {{ ORDR_INFO_PROP["ns2:orders"]["ns2:order"]["sndEndDt"] }}
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              <span class="pl-card-top-var">배송 메세지</span>
            </span>
            <div class="pl-desc">
<!--              {{ item.productOrder.shippingMemo }}-->
            </div>
          </div>
        </div>
      </div>

<!--        <div-->
<!--          v-if="!mixin_isEmpty(item.delivery)"-->
<!--          class="pl-form-inline-wrap vertical"-->
<!--          >-->
<!--      &lt;!&ndash; -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; 배송 정보 영역 -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; &ndash;&gt;-->
<!--          <strong> 배송 정보 </strong>-->
<!--          <div class="pl-form-inline">-->
<!--           <span class="pl-label ">-->
<!--              <span class="pl-card-top-var">발송지연사유</span>-->
<!--           </span>-->
<!--            <div class="pl-desc">-->
<!--              {{ mixin_isEmpty(item.productOrder.delayedDispatchReason) ? '': item.productOrder.delayedDispatchReason }}-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="pl-form-inline">-->
<!--        <span class="pl-label">-->
<!--          <span class="pl-card-top-var">발송기한</span>-->
<!--        </span>-->
<!--            <div class="pl-desc">-->
<!--              {{ item.productOrder.shippingDueDate }}-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="pl-form-inline">-->
<!--        <span class="pl-label">-->
<!--          <span class="pl-card-top-var">당일발송여부</span>-->
<!--        </span>-->
<!--            <div class="pl-desc">-->
<!--              {{ item.productOrder.shippingDueDate }}-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="pl-form-inline">-->
<!--        <span class="pl-label">-->
<!--          <span class="pl-card-top-var">배송방법</span>-->
<!--        </span>-->
<!--            <div class="pl-desc">-->
<!--              {{  $linkage.lkag_common_code_get(lkagCommonCode, 'NAVER_COLLECT_DELIVERY_METHOD').find((el) => {-->
<!--              if (el.cdValue === item.productOrder.expectedDeliveryMethod) return el.text}).text }}-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="pl-form-inline">-->
<!--        <span class="pl-label">-->
<!--          <span class="pl-card-top-var">택배사</span>-->
<!--        </span>-->
<!--            <div class="pl-desc">-->
<!--&lt;!&ndash;              {{ mixin_isEmpty(item.delivery.deliveryCompany)? '': item.delivery.deliveryCompany }}&ndash;&gt;-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        &lt;!&ndash; -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; 교환 정보 영역 -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; &ndash;&gt;-->
<!--        <div-->
<!--            v-if="!mixin_isEmpty(item.exchange)"-->
<!--            class="pl-form-inline-wrap vertical"-->
<!--        >-->
<!--          <strong>교환 정보</strong>-->
<!--          <div class="pl-form-inline">-->
<!--            <span class="pl-label ">-->
<!--              <span class="pl-card-top-var">교환 상태</span>-->
<!--            </span>-->
<!--            <div class="pl-desc">-->
<!--              {{  }}-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        &lt;!&ndash; -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; 반품 정보 영역 -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; &ndash;&gt;-->
<!--        <div-->
<!--            v-if="!mixin_isEmpty(item.exchange)"-->
<!--            class="pl-form-inline-wrap vertical"-->
<!--        >-->
<!--          <strong>반품 정보</strong>-->
<!--          <div class="pl-form-inline">-->
<!--            <span class="pl-label ">-->
<!--              <span class="pl-card-top-var">반품 상태</span>-->
<!--            </span>-->
<!--            <div class="pl-desc">-->
<!--              {{  }}-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        &lt;!&ndash; -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; 취소 정보 영역 -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; &ndash;&gt;-->
<!--        <div-->
<!--          v-if="!mixin_isEmpty(item.cancel)"-->
<!--          class="pl-form-inline-wrap vertical"-->
<!--        >-->
<!--          <strong>취소 정보</strong>-->
<!--          <div class="pl-form-inline">-->
<!--        <span class="pl-label ">-->
<!--          <span class="pl-card-top-var">처리상태</span>-->
<!--        </span>-->
<!--            <div class="pl-desc">-->
<!--              {{-->
<!--                $linkage.lkag_common_code_get(lkagCommonCode, 'NAVER_CLAIM_STATUS').find((el) => {-->
<!--                  if(el.cdValue === item.cancel.claimStatus) return el.text}).text-->
<!--              }}-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="pl-form-inline">-->
<!--            <span class="pl-label ">-->
<!--              <span class="pl-card-top-var">취소 요청 사유</span>-->
<!--            </span>-->
<!--            <div class="pl-desc">-->
<!--              {{-->
<!--                $linkage.lkag_common_code_get(lkagCommonCode, 'NAVER_CANCEL_REASON').find((el) => {-->
<!--                if(el.cdValue === item.cancel.cancelReason) return el.text}).text-->
<!--              }}-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="pl-form-inline">-->
<!--            <span class="pl-label ">-->
<!--              <span class="pl-card-top-var">취소 승인일</span>-->
<!--            </span>-->
<!--            <div class="pl-desc">-->
<!--              {{  convertoGmsToYmd(item.cancel.cancelApprovalDate) }}-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="pl-form-inline">-->
<!--            <span class="pl-label ">-->
<!--              <span class="pl-card-top-var">취소 완료일</span>-->
<!--            </span>-->
<!--            <div class="pl-desc">-->
<!--              {{  convertoGmsToYmd(item.cancel.cancelCompletedDate) }}-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="pl-form-inline">-->
<!--            <span class="pl-label ">-->
<!--              <span class="pl-card-top-var">환불 예정일</span>-->
<!--            </span>-->
<!--            <div class="pl-desc">-->
<!--              {{  convertoGmsToYmd(item.cancel.refundExpectedDate) }}-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        &lt;!&ndash; -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; 주문처리이력 영역 -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; &ndash;&gt;-->
<!--        <div class="pl-form-inline-wrap vertical">-->
<!--          <strong> 주문 처리 이력</strong>-->
<!--          <div class="pl-form-inline">-->
<!--        <span class="pl-label ">-->
<!--          <span class="pl-card-top-var">주문</span>-->
<!--        </span>-->
<!--            <div class="pl-desc">-->
<!--              &lt;!&ndash;              {{  item.cancel.refundStandbyStatus }}&ndash;&gt;-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="pl-form-inline">-->
<!--        <span class="pl-label ">-->
<!--          <span class="pl-card-top-var">결제완료</span>-->
<!--        </span>-->
<!--            <div class="pl-desc">-->
<!--              &lt;!&ndash;              {{  item.cancel.refundStandbyStatus }}&ndash;&gt;-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="pl-form-inline">-->
<!--        <span class="pl-label ">-->
<!--          <span class="pl-card-top-var">취소요청</span>-->
<!--        </span>-->
<!--            <div class="pl-desc">-->
<!--              {{ mixin_isEmpty(item.cancel)?'':  convertoGmsToYmd(item.cancel.claimRequestDate)}}-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="pl-form-inline">-->
<!--        <span class="pl-label ">-->
<!--          <span class="pl-card-top-var">취소 승인</span>-->
<!--        </span>-->
<!--            <div class="pl-desc">-->
<!--             {{ mixin_isEmpty(item.cancel)?'':  convertoGmsToYmd(item.cancel.cancelApprovalDate)}}-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="pl-form-inline">-->
<!--        <span class="pl-label ">-->
<!--          <span class="pl-card-top-var">환불처리</span>-->
<!--        </span>-->
<!--            <div class="pl-desc">-->
<!--              &lt;!&ndash;              {{  item.cancel.refundStandbyStatus }}&ndash;&gt;-->
<!--            </div>-->
<!--          </div>-->
<!--          <v-divider v-if="index < ORDR_INFO_PROP.data.length"></v-divider>-->
<!--        </div>-->
<!--      </div>-->
      <!--      {{ ORDR_INFO_PROP.data[0] }}-->
      <!--      <div-->
      <!--          class="pl-form-inline-wrap vertical"-->
      <!--      >{{ ordrInfo.data.productOrder.claimId }}-->
      <!--      </div>-->
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
    }
  },
  async created() {
    console.log(" Compo Goods created")
    // this.gdsInfo = JSON.parse(JSON.stringify(this.GDS_INFO_PROP));
    // this.ordrInfo = JSON.parse(JSON.stringify(this.ORDR_INFO_PROP));
    // this.lkagCommCdList = [
    //   'NAVER_CLAIM_STATUS'              // 클레임 상태
    //   , 'NAVER_CANCEL_REASON'             // 클레임 요청사유
    //   , 'NAVER_CLAIM_TYPE'                // 클레임 타입
    //   , 'NAVER_DELIVERY_COMPANY'          // 택배사코드
    //   , 'NAVER_COLLECT_DELIVERY_METHOD'   // 배송방법코드
    //   , 'NAVER_DELIVERY_STATUS'           // 배송상태
    //   , 'NAVER_DELAYED_DISPATCH_REASON'   // 발송지연사유
    //   , 'NAVER_PRODUCT_ORDER_STATUS'      // 상품주문상태
    //   , 'NAVER_COMMISSION_PREPAY_STATUS'  // 수수료선결제상태구분
    //   , 'NAVER_GIFT_RECEIVING_STATUS'     // 선물수락상태
    //   , 'NAVER_COLLECT_STATUS'            // 수거상태
    //   , 'NAVER_HOLDBACK_REASON'           // 보류유형
    //   , 'NAVER_HOLDBACK_STATUS'           // 보류유형 상태
    //   , 'NAVER_PLACE_ORDER_STATUS'        // 발주상태
    //
    // ]
    // this.lkagCommonCode = await this.$linkage.lkag_common_code_get_all(this.BBS_CUTT_INFO_PROP.LKAG_MST_ID, this.lkagCommCdList);  //연동데이터셋콤보박스
    // console.log("lkagCommonCode", this.lkagCommonCode)
  },
  mounted() {
  },
  methods: {

    convertoGmsToYmd(date){
      let gmsDate = new Date(date);
      let year =  gmsDate.getFullYear();
      let month =  String(gmsDate.getMonth() + 1).padStart(2, "0");
      let day =  String(gmsDate.getDate()).padStart(2, "0");
      let hour =  String(gmsDate.getHours()).padStart(2, "0");
      let min =  String(gmsDate.getMinutes()).padStart(2, "0");
      let sec =  String(gmsDate.getSeconds()).padStart(2, "0");

      return year+'-'+month+'-'+day+' '+hour+':'+min+':'+sec;
    },
    convertoDate(date){
      let gmsDate = new Date(date);
      let year =  gmsDate.getFullYear();
      let month =  String(gmsDate.getMonth() + 1).padStart(2, "0");
      let day =  String(gmsDate.getDate()).padStart(2, "0");
      let hour =  String(gmsDate.getHours()).padStart(2, "0");
      let min =  String(gmsDate.getMinutes()).padStart(2, "0");
      let sec =  String(gmsDate.getSeconds()).padStart(2, "0");

      return year+'-'+month+'-'+day+' '+hour+':'+min+':'+sec;
    },
    replaceDetail(detail){
      if(detail.includes("<img src=")){
        console.log("<img src=\\")
        this.imgYn = true;
        return detail.replace(/(<img[^>]*)(>)/gi, '$1 width="500"$2')
      }else{
        this.imgYn = false;
        return detail
      }
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