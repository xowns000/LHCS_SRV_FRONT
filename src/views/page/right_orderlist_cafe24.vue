<template>
  <div class="">
    <v-tabs class="pl-tabs type-main pa-0" v-model="selectedTabIndex">
      <v-tab>카페24<span v-if="!mixin_isEmpty(listGroupData[0])"><span class="pl-tab-badge">{{ listGroupData[0].size }}</span></span></v-tab>
      <v-tab>이지어드민<span v-if="!mixin_isEmpty(listGroupData[1])"><span class="pl-tab-badge">{{ listGroupData[1].total }}</span></span></v-tab>
      <v-tabs-items v-model="selectedTabIndex">
        <v-tab-item class="is-mt-m">
            <!-- //mark: 검색 -->
            <div class="d-flex align-center  is-mt-s" data-menu="검색" >
              <div class="ml-auto pl-btn-wrap">
                <span class="pl-label">휴대전화:</span>
                <v-text-field
                    class="pl-form"
                    v-model="SRCH_CUST_PHN_NO"
                    placeholder="휴대전화"
                    oninput="javascript: this.value = this.value.replace(/[^a-z|A-Z|0-9]/g, '' );"
                    v-byte-counter="30"
                    @keyup.enter="callApi"
                />
                <span class="pl-label">주문번호:</span>
                <v-text-field
                    class="pl-form"
                    v-model="SRCH_ORDER_ID"
                    placeholder="주문번호"
                    v-byte-counter="30"
                    @keyup.enter="callApi"
                />
                <span class="pl-label">조건:</span>
                  <v-select
                      :items="srchTermBox"
                      v-model="SRCH_TERM"
                      class="pl-form"
                      @change="callApi"
                  ></v-select>
                <compo-tooltip-btn
                    TitleProp="새로고침"
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 refresh"
                    TooltipPositionProp="bottom"
                    :ProgressProp="apiCallProgress"
                    @btnClick="callApi"
                ></compo-tooltip-btn>
              </div>
            </div>
            <!-- //mark: 주문리스트 -->
            <template v-if="!mixin_isEmpty(listGroupData[selectedTabIndex]) && !apiCallProgress">
              <div class="is-mt-s" style="overflow-y: scroll; height: calc(100vh - 316px);">
                <div class="pl-order-list" v-for="listOrder,idx in listGroupData[selectedTabIndex].orders"
                     :style="listOrder.dtlActive?'border: 3px dashed #39b583':''">
                  <div class="pl-order-list-view">
                    <div class="pl-order-list-summary" data-menu="주문정보" >
                      <div class="pl-order-list-summary-unit" >
                        <div class="pl-order-list-summary-form">
                          <span style="font-weight: 700">주문일(결제일) : </span>
                          <span style="font-weight: normal">{{ dateFormat( new Date( listOrder.order_date )) }} <span v-if="!mixin_isEmpty(listOrder.payment_date)" > ({{ dateFormat( new Date( listOrder.payment_date )) }})</span></span>
                        </div>
                      </div>
                      <div class="pl-order-list-summary-unit" v-if="listOrder.canceled === 'T' || listOrder.canceled === 'M'">
                        <div class="pl-order-list-summary-form">
                          <span style="font-weight: 700">취소여부 : </span>
                          <span style="font-weight: 700;color:red;">
                            <span v-if="listOrder.canceled === 'T'" > 취소 </span>
                            <span v-if="listOrder.canceled === 'M'" > 부분취소 </span>
                            <span v-if="!mixin_isEmpty(listOrder.cancel_date)" > ({{ dateFormat( new Date( listOrder.cancel_date )) }})</span>
                          </span>
                        </div>
                      </div>
                      <div class="pl-order-list-summary-unit" >
                        <div class="pl-order-list-summary-form">
                          <span style="font-weight: 700">주문번호 : </span>
                          <span style="font-weight: normal; color:rgb(248, 133, 49);">{{ listOrder.order_id }}</span>
                        </div>
                        <div class="pl-order-list-summary-form">
                          <span style="font-weight: 700">주문자 : </span>
                          <span style="font-weight: normal; ">
                            {{ listOrder.RESP_buyer.name }}
                          <span v-if="!mixin_isEmpty(listOrder.RESP_buyer.member_id)" >({{listOrder.RESP_buyer.member_id}})[{{ customergroups( listGroupData[selectedTabIndex].RESP_customergroups, listOrder.RESP_buyer.member_group_no).group_name }}] </span>
                          <span v-if="mixin_isEmpty(listOrder.RESP_buyer.member_id)" >(비회원) </span>
                          </span>
                        </div>
                      </div>

                      <div class="pl-order-list-summary-unit" >
                        <div class="pl-order-list-summary-form">
                          <span style="font-weight: 700">상품명 : </span>
                          <span style="font-weight: normal;"> {{ listOrder.RESP_product_name }}</span>
                        </div>
                      </div>
                      <div class="pl-order-list-summary-unit" >
                        <div class="pl-order-list-summary-form">
                          <span style="font-weight: 700">총 상품구매금액 : </span>
                          <span style="font-weight: normal;"> {{ parseParam("LPIT_INT", listOrder.actual_order_amount.order_price_amount) }}</span>
                        </div>
                        <div class="pl-order-list-summary-form">
                          <span style="font-weight: 700">총 실결제금액 : </span>
                          <span style="font-weight: normal;"> {{ parseParam("LPIT_INT", listOrder.payment_amount) }}</span>
                        </div>
                      </div>
                      <div class="pl-order-list-summary-unit" >
                        <div class="pl-order-list-summary-form">
                          <span style="font-weight: 700">결제상태 : </span>
                          <span style="font-weight: normal;"> {{ (mixin_isEmpty(listOrder.payment_date))?"미결제":"결제완료" }}</span>
                        </div>
                        <div class="pl-order-list-summary-form">
                          <span style="font-weight: 700">결제수단 : </span>
                          <span style="font-weight: normal;"> {{ listOrder.payment_method_name.toString() }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="text-center">
                    <!-- 상세 버튼 -->
                    <compo-tooltip-btn
                        TitleProp="상세 검색"
                        ClassProp="pl-tooltip-btn is-line"
                        :IconProp="listOrder.dtlActive? 'pl-icon20 arrow-down' : 'pl-icon20 arrow-up'"
                        StyleProp="border: 0"
                        TooltipPositionProp="bottom"
                        @btnClick="toggleDetail(idx)"
                    ></compo-tooltip-btn>
                  </div>
                  <div v-if="apiCallProgressDetail || listOrder.dtlActive" class="pl-order-list-detail pl-campaign-list-child" data-menu="상세정보" >
                    <div v-if="apiCallProgressDetail">
                      <LoadingSpinner  >데이터를 조회중입니다.</LoadingSpinner>
                    </div>
                    <div v-if="!apiCallProgressDetail">
                      <div class="pl-order-list-detail-unit">
                        <strong>
                          √ 전체주문내역 ({{listOrder.RESP_items.length}}건) - <span style="font-weight: 700; color:rgb(248, 133, 49);">{{ listOrder.order_id }}</span>
                        </strong>
                        <div class="pl-order-list-detail-list" v-for="listItem,itemIdx in listOrder.RESP_items">
                          <div class="pl-order-list-detail-list is-mt-s">
                            <span style="font-weight: 700">
                              - [{{ listItem.supplier_name}}] {{ listItem.order_item_code }} / {{ listItem.shipping_code }}
                              <span v-if="!mixin_isEmpty(listItem.claim_code)" > ({{ listItem.claim_code }})</span>
                            </span>
                          </div>
                          <div class="pl-order-list-summary-unit" >
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">상품명 : </span>
                              <span> {{ listItem.product_name}}
                                <span v-if="!mixin_isEmpty(listItem.option_value)" > ({{ listItem.option_value }})</span>
                              </span>
                            </div>
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">수량 : </span>
                              <span> {{ listItem.quantity}} </span>
                            </div>
                          </div>
                          <div class="pl-order-list-summary-unit" >
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">판매가 : </span>
                              <span> {{ parseParam("LPIT_INT", listItem.product_price) }}</span>
                            </div>
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">상품구매금액 : </span>
                              <span> {{ parseParam("LPIT_INT", listItem.product_price * listItem.quantity ) }} </span>
                            </div>
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">할인금액 : </span>
                              <span> {{ parseParam("LPIT_INT", listItem.additional_discount_price ) }} </span>
                            </div>
                          </div>
                          <div class="pl-order-list-summary-unit" >
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">주문상태 : </span>
                              <span style="font-weight: 700;color:dodgerblue"> {{ listItem.status_text }} </span>
                            </div>
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">배송비 : </span>
                              <span> {{ parseParam("LPIT_INT", (shipping_fee_detail( listOrder.shipping_fee_detail, listItem.order_item_code )).shipping_fee) }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="pl-order-list-detail-unit" v-if="!mixin_isEmpty(listOrder.RESP_order_memo) && listOrder.RESP_order_memo.length > 0">
                        <strong>√ 메모이력</strong>
                        <div class="pl-order-list-detail-list" v-for="listItem,itemIdx in listOrder.RESP_order_memo">
                          <div class="pl-order-list-detail-list is-mt-s">
                            <span style="font-weight: 700">- 메모 내용 : {{ listItem.content }}</span>
                          </div>
                          <div class="pl-order-list-summary-unit" >
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">작성자 아이디 : </span>
                              <span> {{ listItem.author_id }} </span>
                            </div>
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">등록일 : </span>
                              <span> {{ dateFormat( new Date( listItem.created_date )) }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="pl-order-list-detail-unit">
                        <strong>√ 결제정보</strong>
                        <div class="pl-order-list-detail-list is-mt-s">
                            <span style="font-weight: 700">- 최초정보</span>
                        </div>
                        <div class="pl-order-list-summary-unit" >
                          <div class="pl-order-list-summary-form">
                            <span style="font-weight: 700">상품구매금액 : </span>
                            <span> {{ parseParam("LPIT_INT", listOrder.initial_order_amount.order_price_amount) }}</span>
                          </div>
                          <div class="pl-order-list-summary-form">
                            <span style="font-weight: 700">결제예정금액 : </span>
                            <span> {{ parseParam("LPIT_INT", listOrder.actual_order_amount.total_amount_due ) }} </span>
                          </div>
                          <div class="pl-order-list-summary-form">
                            <span style="font-weight: 700">총 실결제금액 : </span>
                            <span> {{ parseParam("LPIT_INT", listOrder.actual_order_amount.payment_amount ) }} </span>
                          </div>
                        </div>
                        <div class="pl-order-list-summary-unit" >
                          <div class="pl-order-list-summary-form">
                            <span style="font-weight: 700">배송비 : </span>
                            <span> {{ parseParam("LPIT_INT", listOrder.initial_order_amount.shipping_fee) }}</span>
                          </div>
                          <div class="pl-order-list-summary-form">
                            <span style="font-weight: 700">적립혜택 : </span>
                            <span> {{ parseParam("LPIT_INT", listOrder.initial_order_amount.point_incentive_amount) }} </span>
                          </div>
                        </div>
                        <div class="pl-order-list-summary-unit" >
                          <div class="pl-order-list-summary-form">
                            <span style="font-weight: 700">부가결제 : </span>
                            <span style="font-weight: normal">
                              <div v-if="!mixin_isEmpty(listOrder.initial_order_amount.points_spent_amount) && parseInt(listOrder.initial_order_amount.points_spent_amount) > 0" >
                                적립금 사용금액 : {{ parseParam("LPIT_INT", listOrder.initial_order_amount.points_spent_amount) }}
                              </div>
                              <div v-if="!mixin_isEmpty(listOrder.initial_order_amount.credits_spent_amount) && parseInt(listOrder.initial_order_amount.credits_spent_amount) > 0" >
                                예치금 사용금액 : {{ parseParam("LPIT_INT", listOrder.initial_order_amount.credits_spent_amount) }}
                              </div>
                              <div v-if="!mixin_isEmpty(listOrder.initial_order_amount.naver_point) && parseInt(listOrder.initial_order_amount.naver_point) > 0" >
                                네이버 포인트 : {{ parseParam("LPIT_INT", listOrder.initial_order_amount.naver_point) }}
                              </div>
                              <div v-if="!mixin_isEmpty(listOrder.initial_order_amount.naver_cash) && parseInt(listOrder.initial_order_amount.naver_cash) > 0" >
                                네이버 캐시 : {{ parseParam("LPIT_INT", listOrder.initial_order_amount.naver_cash) }}
                              </div>
                            </span>
                          </div>
                        </div>
                        <div v-if="actualOrderShow(listOrder.RESP_items)">
                          <div class="pl-order-list-detail-list is-mt-s">
                            <span style="font-weight: 700">- 최종정보</span>
                          </div>
                          <div class="pl-order-list-summary-unit" >
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">상품구매금액 : </span>
                              <span> {{ parseParam("LPIT_INT", listOrder.actual_order_amount.order_price_amount) }}</span>
                            </div>
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">결제예정금액 : </span>
                              <span> {{ parseParam("LPIT_INT", listOrder.actual_order_amount.total_amount_due ) }} </span>
                            </div>
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">총 실결제금액 : </span>
                              <span> {{ parseParam("LPIT_INT", listOrder.actual_order_amount.payment_amount ) }} </span>
                            </div>
                          </div>
                          <div class="pl-order-list-summary-unit" >
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">배송비 : </span>
                              <span> {{ parseParam("LPIT_INT", listOrder.actual_order_amount.shipping_fee) }}</span>
                            </div>
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">적립혜택 : </span>
                              <span> {{ parseParam("LPIT_INT", listOrder.actual_order_amount.point_incentive_amount) }} </span>
                            </div>
                          </div>
                          <div class="pl-order-list-summary-unit" >
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">부가결제 : </span>
                              <span style="font-weight: normal">
                              <div v-if="!mixin_isEmpty(listOrder.actual_order_amount.points_spent_amount) && parseInt(listOrder.actual_order_amount.points_spent_amount) > 0" >
                                적립금 사용금액 : {{ parseParam("LPIT_INT", listOrder.actual_order_amount.points_spent_amount) }}
                              </div>
                              <div v-if="!mixin_isEmpty(listOrder.actual_order_amount.credits_spent_amount) && parseInt(listOrder.actual_order_amount.credits_spent_amount) > 0" >
                                예치금 사용금액 : {{ parseParam("LPIT_INT", listOrder.actual_order_amount.credits_spent_amount) }}
                              </div>
                              <div v-if="!mixin_isEmpty(listOrder.actual_order_amount.naver_point) && parseInt(listOrder.actual_order_amount.naver_point) > 0" >
                                네이버 포인트 : {{ parseParam("LPIT_INT", listOrder.actual_order_amount.naver_point) }}
                              </div>
                              <div v-if="!mixin_isEmpty(listOrder.actual_order_amount.naver_cash) && parseInt(listOrder.actual_order_amount.naver_cash) > 0" >
                                네이버 캐시 : {{ parseParam("LPIT_INT", listOrder.actual_order_amount.naver_cash) }}
                              </div>
                            </span>
                            </div>
                          </div>
                        </div>
                        <div class="pl-order-list-detail-list is-mt-s" v-if="!mixin_isEmpty(listOrder.RESP_benefits) && listOrder.RESP_benefits.length > 0">
                          <span style="font-weight: 700">- 할인혜택 : </span>
                        </div>
                        <div class="pl-order-list-summary-unit" v-if="!mixin_isEmpty(listOrder.RESP_benefits) && listOrder.RESP_benefits.length > 0">
                          <div class="pl-order-list-summary-form">
                            <span v-for="listItem,itemIdx in listOrder.RESP_benefits">
                              <div>{{ listItem.benefit_title }} / {{ listItem.benefit_name }} / {{ listItem.order_item_code }} / {{ listItem.benefit_percent }} </div>
                            </span>
                          </div>
                        </div>
                        <div class="pl-order-list-summary-unit" v-if="!mixin_isEmpty(listOrder.RESP_benefits) && listOrder.RESP_benefits.length > 0">
                          <div class="pl-order-list-summary-form">
                            <span style="font-weight: 700">총 : </span>
                            <span> {{ parseParam("LPIT_INT", total_discount_price(listOrder.RESP_items) ) }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="pl-order-list-detail-unit">
                        <strong>√ 결제수단</strong>
                        <div class="pl-order-list-summary-unit" >
                          <div class="pl-order-list-summary-form">
                            <span style="font-weight: 700">결제자명 : </span>
                            <span> {{ listOrder.billing_name }}</span>
                          </div>
                          <div class="pl-order-list-summary-form">
                            <span style="font-weight: 700">결제자수단 : </span>
                            <span>{{ listOrder.payment_method_name.toString() }}</span>
                          </div>
                        </div>
                        <div v-if="!mixin_isEmpty(listOrder.bank_account_no)" >
                          <div class="pl-order-list-summary-unit" >
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">결제은행정보 : </span>
                              <span>{{ listOrder.bank_code_name }} / {{ listOrder.bank_account_no }} / {{ listOrder.bank_account_owner_name }} </span>
                            </div>
                          </div>
                        </div>
                        <div v-if="!mixin_isEmpty(listOrder.payment_date)" >
                          <div class="pl-order-list-summary-unit" >
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">결제여부 : </span>
                              <span>
                                <span v-if="listOrder.paid === 'T'" >결제완료</span>
                                <span v-if="listOrder.paid === 'F'" >미결제</span>
                                <span v-if="listOrder.paid === 'M'" >부분결제</span>
                              </span>
                            </div>
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">결제(입금)확인일 : </span>
                              <span>{{ dateFormat( new Date( listOrder.payment_date )) }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="pl-order-list-detail-unit">
                        <strong>√ 환불정보</strong>
                        <div v-for="listItem,itemIdx in listOrder.RESP_items">
                          <div v-if="!mixin_isEmpty(listItem.RESP_cancellation)" >
                            <div v-if="!mixin_isEmpty(listItem.RESP_cancellation.refund_methods)" >
                              <div class="pl-order-list-detail-list is-mt-s">
                                <span style="font-weight: 700">- 환불 </span>
                              </div>
                              <div class="pl-order-list-summary-unit"  >
                                <div class="pl-order-list-summary-form">
                                  <span style="font-weight: 700">환불번호 :</span>
                                  <span> {{ listItem.RESP_cancellation.claim_code }}</span>
                                </div>
                                <div class="pl-order-list-summary-form">
                                  <span style="font-weight: 700">환불금액 : </span>
                                  <span v-for="listRefund,refundIdx in listItem.RESP_cancellation.refund_amounts" >
                                    {{ listRefund.payment_method }} / {{ parseParam("LPIT_INT",listRefund.amount) }}
                                  </span>
                                </div>
                              </div>
                              <div class="pl-order-list-summary-unit"  >
                                <div class="pl-order-list-summary-form">
                                  <span style="font-weight: 700">환불수단 : </span>
                                  <span>{{ listItem.RESP_cancellation.refund_methods.toString()  }}</span>
                                </div>
                                <div class="pl-order-list-summary-form">
                                  <span style="font-weight: 700">환불일자 : </span>
                                  <span>
                                    <span v-if="!mixin_isEmpty(listItem.RESP_cancellation.refund_date)" >{{listItem.RESP_cancellation.refund_date}} ({{ listItem.order_status_additional_info }})</span>
                                  </span>
                                </div>
                              </div>
                              <div class="pl-order-list-summary-unit"  >
                                <div class="pl-order-list-summary-form">
                                  <span style="font-weight: 700">환불사유 : </span>
                                  <span>
                                    <span v-if="!mixin_isEmpty(listItem.RESP_cancellation.refund_reason)" >{{ listItem.RESP_cancellation.refund_reason  }}</span>
                                    <span v-if="!mixin_isEmpty(listItem.RESP_cancellation.claim_reason)" >{{ listItem.RESP_cancellation.claim_reason  }}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div v-else-if="!mixin_isEmpty(listItem.RESP_cancellation.refund_reason)" >
                              <div class="pl-order-list-detail-list is-mt-s">
                                <span>- {{ listItem.RESP_cancellation.refund_reason  }} </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="pl-order-list-detail-unit">
                        <strong>√ 현금영수증 발급내역</strong>
                        <div v-if="typeof listOrder.RESP_cashreceipt === 'string'" >
                          <div class="pl-order-list-summary-unit"  >
                            <div class="pl-order-list-summary-form">
                              <span>{{ listOrder.RESP_cashreceipt }}</span>
                            </div>
                          </div>
                        </div>
                        <div v-if="typeof listOrder.RESP_cashreceipt !== 'string' && !mixin_isEmpty(listOrder.RESP_cashreceipt)" >
                          <div v-for="listItem,itemIdx in listOrder.RESP_cashreceipt" >
                            <div class="pl-order-list-summary-unit"  >
                              <div class="pl-order-list-summary-form">
                                <span style="font-weight: 700">신청일 : </span>
                                <span> {{ listItem.request_date }}</span>
                              </div>
                              <div class="pl-order-list-summary-form">
                                <span style="font-weight: 700">상태 : </span>
                                <span> {{ listItem.status }}</span>
                              </div>
                            </div>
                            <div class="pl-order-list-summary-unit"  >
                              <div class="pl-order-list-summary-form">
                                <span style="font-weight: 700">인증번호(승인) : </span>
                                <span>{{ listItem.approval_no }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="pl-order-list-detail-unit">
                        <strong>√ 주문자정보</strong>
                        <div class="pl-order-list-summary-unit" >
                          <div class="pl-order-list-summary-form">
                            <span style="font-weight: 700">주문자명 : </span>
                            <span> {{ listOrder.RESP_buyer.name }}({{listOrder.RESP_buyer.member_id}})</span>
                          </div>
                          <div class="pl-order-list-summary-form">
                            <span style="font-weight: 700">회원등급 : </span>
                            <span>{{ customergroups( listGroupData[0].RESP_customergroups, listOrder.RESP_buyer.member_group_no).group_name }}</span>
                          </div>
                        </div>
                        <div class="pl-order-list-summary-unit" >
                          <div class="pl-order-list-summary-form">
                            <span style="font-weight: 700">휴대전화 : </span>
                            <span> {{ listOrder.RESP_buyer.cellphone }}</span>
                          </div>
                          <div class="pl-order-list-summary-form">
                            <span style="font-weight: 700">일반전화 : </span>
                            <span>{{ listOrder.RESP_buyer.phone }}</span>
                          </div>
                        </div>
                        <div class="pl-order-list-summary-unit" >
                          <div class="pl-order-list-summary-form">
                            <span style="font-weight: 700">이메일 : </span>
                            <span> {{ listOrder.RESP_buyer.email }}</span>
                          </div>
                        </div>
                        <div class="pl-order-list-summary-unit" >
                          <div class="pl-order-list-summary-form">
                            <span style="font-weight: 700">고객알림 : </span>
                            <span> {{ listOrder.RESP_buyer.customer_notification }}</span>
                          </div>
                        </div>
                      </div>

                      <div class="pl-order-list-detail-unit" v-if="!mixin_isEmpty(listOrder.RESP_receivers)">
                        <strong>√ 수령자정보</strong>
                        <div v-for="listItem,itemIdx in listOrder.RESP_receivers" >
                          <div class="pl-order-list-detail-list is-mt-s">
                            <span style="font-weight: 700">- 수령자 </span>
                          </div>
                          <div class="pl-order-list-summary-unit" >
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">배송코드 : </span>
                              <span> {{ listItem.shipping_code }}</span>
                            </div>
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">수령자명 : </span>
                              <span> {{ listItem.name }}</span>
                            </div>
                          </div>
                          <div class="pl-order-list-summary-unit" >
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">휴대전화 : </span>
                              <span> {{ listItem.cellphone }}</span>
                            </div>
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">전화번호 : </span>
                              <span>{{ listItem.phone }}</span>
                            </div>
                          </div>
                          <div class="pl-order-list-summary-unit" >
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">배송지 주소 : </span>
                              <span> ({{ listItem.zipcode }}) {{ listItem.address_full }}</span>
                            </div>
                          </div>
                          <div class="pl-order-list-summary-unit" >
                            <div class="pl-order-list-summary-form">
                              <span style="font-weight: 700">배송메시지 : </span>
                              <span>{{ listItem.shipping_message }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="apiCallProgress">
              <LoadingSpinner>데이터를 조회중입니다.</LoadingSpinner>
            </template>
            <template v-else>
              <div
                  class="pl-alarm-list-wrap type-script is-mt-m"
                  style="height: calc(100vh - 375px);">
                <div class="pl-list-nodata">
                  <span>등록된 데이터가 없습니다.</span>
                </div>
              </div>
            </template>
        </v-tab-item>
<!------------------------------------------------------------------------------------------------------->
<!------ 아래 이지어드민  -->
<!------------------------------------------------------------------------------------------------------->
        <v-tab-item class="is-mt-m">
          <div class="d-flex align-center  is-mt-s" data-menu="검색" >
            <div class="ml-auto pl-btn-wrap">
              <span class="pl-label">휴대전화:</span>
              <v-text-field
                  class="pl-form"
                  v-model="SRCH_CUST_PHN_NO2"
                  placeholder="휴대전화"
                  oninput="javascript: this.value = this.value.replace(/[^a-z|A-Z|0-9]/g, '' );"
                  v-byte-counter="30"
                  @keyup.enter="callApi2"
              />
              <span class="pl-label">주문번호:</span>
              <v-text-field
                  class="pl-form"
                  v-model="SRCH_ORDER_ID2"
                  placeholder="주문번호"
                  v-byte-counter="30"
                  @keyup.enter="callApi2"
              />
              <span class="pl-label">조건:</span>
              <v-select
                  :items="srchTermBox"
                  v-model="SRCH_TERM"
                  class="pl-form"
                  @change="callApi2"
              ></v-select>
              <compo-tooltip-btn
                  TitleProp="새로고침"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="bottom"
                  :ProgressProp="apiCallProgress2"
                  @btnClick="callApi2"
              ></compo-tooltip-btn>
            </div>
          </div>
          <template v-if="!mixin_isEmpty(listGroupData[selectedTabIndex]) && !apiCallProgress2">
            <div class="is-mt-s" style="overflow-y: scroll; height: calc(100vh - 316px);">
              <div class="pl-order-list" v-for="listOrder,idx in listGroupData[selectedTabIndex].data"
                   :style="listOrder.dtlActive?'border: 3px dashed #39b583':''">
                <div class="pl-order-list-view">
                  <div class="pl-order-list-summary" data-menu="주문정보" >
                    <div class="pl-order-list-summary-unit" >
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">관리번호 : </span>
                        <span style="font-weight: normal">{{ listOrder.seq }}</span>
                      </div>
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">발주일 : </span>
                        <span style="font-weight: normal">{{ listOrder.collect_date }} </span>
                      </div>
                    </div>
                    <div class="pl-order-list-summary-unit" >
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">주문번호 : </span>
                        <span style="font-weight: normal; color:rgb(248, 133, 49);">{{ listOrder.order_id }}</span>
                      </div>
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">판매처 : </span>
                        <span style="font-weight: normal; ">{{ listOrder.shop_name}}</span>
                      </div>
                    </div>
                    <div class="pl-order-list-summary-unit" >
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">상품코드 : </span>
                        <span style="font-weight: normal;">{{ listOrder.shop_product_id }}</span>
                      </div>
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">개수 : </span>
                        <span style="font-weight: normal;">{{ listOrder.qty }}</span>
                      </div>
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">가격 : </span>
                        <span style="font-weight: normal;">{{ parseParam("LPIT_INT", listOrder.amount) }}</span>
                      </div>
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">공급처 : </span>
                        <span style="font-weight: normal;">{{ listOrder.order_products[0].supply_name }}</span>
                      </div>
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">판매 : </span>
                        <span style="font-weight: normal;">
                          <span v-if="listOrder.order_products[0].enable_sale === '0'" >품절</span>
                          <span v-if="listOrder.order_products[0].enable_sale === '1'" >판매중</span>
                        </span>
                      </div>
                    </div>
                    <div class="pl-order-list-summary-unit" >
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">상품명/옵션 : </span>
                        <span style="font-weight: normal;">{{ listOrder.product_name }} <span v-if="!mixin_isEmpty(listOrder.options)" > ({{ listOrder.options }})</span></span>
                      </div>
                    </div>
                    <div class="pl-order-list-summary-unit" >
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">주문상태 : </span>
                        <span style="font-weight: normal;">
                          <span v-if="listOrder.status === '1'" >접수</span>
                          <span v-if="listOrder.status === '7'" >송장</span>
                          <span v-if="listOrder.status === '8'" >배송</span>
                        </span>
                      </div>
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">CS상태 : </span>
                        <span style="font-weight: normal;">
                          <span v-if="listOrder.order_cs === '0'" >정상</span>
                          <span v-if="listOrder.order_cs === '1'" >배송전 전체 취소</span>
                          <span v-if="listOrder.order_cs === '2'" >배송전 부분 취소</span>
                          <span v-if="listOrder.order_cs === '3'" >배송후 전체 취소</span>
                          <span v-if="listOrder.order_cs === '4'" >배송후 부분 취소</span>
                          <span v-if="listOrder.order_cs === '5'" >배송전 전체 교환</span>
                          <span v-if="listOrder.order_cs === '6'" >배송전 부분 교환</span>
                          <span v-if="listOrder.order_cs === '7'" >배송후 전체 교환</span>
                          <span v-if="listOrder.order_cs === '8'" >배송후 부분 교환</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="text-center">
                  <!-- 상세 버튼 -->
                  <compo-tooltip-btn
                      TitleProp="상세 검색"
                      ClassProp="pl-tooltip-btn is-line"
                      :IconProp="listOrder.dtlActive? 'pl-icon20 arrow-down' : 'pl-icon20 arrow-up'"
                      StyleProp="border: 0"
                      TooltipPositionProp="bottom"
                      @btnClick="toggleDetail(idx)"
                  ></compo-tooltip-btn>
                </div>
                <div v-if="listOrder.dtlActive" class="pl-order-list-detail pl-campaign-list-child" data-menu="상세정보" >
                  <div class="pl-order-list-detail-unit">
                    <strong>
                      √ 주문정보
                    </strong>
                    <div class="pl-order-list-summary-unit" >
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">구매자 : </span>
                        <span> {{ listOrder.order_name }}</span>
                      </div>
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">휴대폰번호 : </span>
                        <span> {{ listOrder.order_mobile}} </span>
                      </div>
                    </div>
                    <div class="pl-order-list-summary-unit" >
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">수령자 : </span>
                        <span> {{ listOrder.recv_name }}</span>
                      </div>
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">휴대폰번호 : </span>
                        <span> {{ listOrder.recv_mobile}} </span>
                      </div>
                    </div>
                    <div class="pl-order-list-summary-unit" >
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">배송지주소 : </span>
                        <span> ({{ listOrder.recv_zip }}) {{ listOrder.recv_address }}</span>
                      </div>
                    </div>
                    <div class="pl-order-list-summary-unit" >
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">배송메모 : </span>
                        <span>{{ listOrder.memo }}</span>
                      </div>
                    </div>
                    <div class="pl-order-list-summary-unit" >
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">주문일 : </span>
                        <span>{{ listOrder.order_date }}</span>
                      </div>
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">주문수집일(EZ) : </span>
                        <span>{{ listOrder.collect_date }}</span>
                      </div>
                    </div>
                    <div class="pl-order-list-summary-unit" >
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">택배사 : </span>
                        <span>{{ trans_corp( listGroupData[selectedTabIndex].RESP_trans_corp.data, listOrder.trans_corp).name}}</span>
                      </div>
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">송장번호 : </span>
                        <span>
                          {{ listOrder.trans_no }}
                        </span>
                      </div>
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">선착불 : </span>
                        <span>{{ listOrder.trans_who }}({{listOrder.prepay_price }})</span>
                      </div>
                    </div>
                    <div class="pl-order-list-summary-unit" >
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">송장입력일 : </span>
                        <span>{{ listOrder.trans_date }}</span>
                      </div>
                      <div class="pl-order-list-summary-form">
                        <span style="font-weight: 700">배송POS일 : </span>
                        <span>{{ listOrder.trans_date_pos }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="pl-order-list-detail-unit">
                    <strong>
                      √ C/S 이력
                    </strong>
                    <div class="pl-order-list-detail-list" v-for="listCs,csIdx in listOrder.RESP_cs.data">
                      <div class="pl-order-list-detail-list is-mt-s">
                          <span style="font-weight: 700">
                            - 관리번호 : {{listCs.seq}} , 판매처코드 : {{listCs.shop_id}}
                          </span>
                      </div>
                      <div class="pl-order-list-summary-unit" >
                        <div class="pl-order-list-summary-form">
                          <span style="font-weight: 700">C/S 입력일 : </span>
                          <span>{{ listCs.crdate }}</span>
                        </div>
                        <div class="pl-order-list-summary-form">
                          <span style="font-weight: 700">C/S 타입 : </span>
                          <span>{{ listCs.cs_type }}</span>
                        </div>
                      </div>
                      <div class="pl-order-list-summary-unit" >
                        <div class="pl-order-list-summary-form">
                          <span style="font-weight: 700">C/S 내역 : </span>
                          <span>{{ listCs.contents }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="apiCallProgress2">
            <LoadingSpinner>데이터를 조회중입니다.</LoadingSpinner>
          </template>
          <template v-else>
            <div
                class="pl-alarm-list-wrap type-script is-mt-m"
                style="height: calc(100vh - 375px);">
              <div class="pl-list-nodata">
                <span>등록된 데이터가 없습니다.</span>
              </div>
            </div>
          </template>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>

<script>
import LoadingSpinner from '@/components/LoadingSpinner'
import store from "@/store";

export default {
  name: 'right_orderlist_cafe24',
  props: {
    // DataProp: Array
    CUST_INFO_PROP: {
      type: Object,
    },
    LAYOUT_ID_PROP: {
      type: String,
    },
    SHOW_DIALOG_PROP: {
      type: Boolean,
      default : false,
    },
  },
  components: {
    LoadingSpinner
  },
  data() {
    return {

      SRCH_CUST_PHN_NO: this.CUST_INFO_PROP.CUST_PHN_NO,
      SRCH_ORDER_ID:null,
      SRCH_CUST_PHN_NO2: this.CUST_INFO_PROP.CUST_PHN_NO,
      SRCH_ORDER_ID2:null,
      SRCH_MNG_SEQ2:null,

      custInfoProps: this.CUST_INFO_PROP,
      selectedTabIndex: 0,

      orderIdDtlActive:[],


      commonCode: [],
      srchTermBox: [],
      SRCH_TERM: '',

      // 기간
      today: this.$moment(this.date).format("YYYYMMDDHHmmss").substring(0, 8) + '235959',

      // 전체 응답 데이터 저장용 객체
      //rspnsData: {},
      listTabData:[],
      listGroupData: [],


      // 데이터 표현을 위한 배열
      active: true,
      countForAlarm : 0,
      apiCallProgress : null,
      apiCallProgressDetail : null,
      apiCallProgress2 : null,
    }
  },
  methods: {
    async callApi() {
      this.listGroupData[0] = {};
      if (!this.mixin_isEmpty(this.SRCH_CUST_PHN_NO) || !this.mixin_isEmpty(this.SRCH_ORDER_ID ) ) {
        if( this.SRCH_CUST_PHN_NO.length > 3 && this.mixin_isEmpty(this.SRCH_ORDER_ID)) {
          await this.getRspnsData(0);
        }else if(!this.mixin_isEmpty(this.SRCH_ORDER_ID)){
          await this.getRspnsData(0);
        }
      }else {
        this.listGroupData[0] = {};
        this.selectedTabIndex = 1;
        this.selectedTabIndex = 0;
      }
    },
    async callApi2() {
      if (!this.mixin_isEmpty(this.SRCH_CUST_PHN_NO2) || !this.mixin_isEmpty(this.SRCH_ORDER_ID2) ) {
        if( !this.mixin_isEmpty(this.SRCH_CUST_PHN_NO2) && this.SRCH_CUST_PHN_NO2.length > 3) {
          await this.getRspnsData(1);
        }else if(!this.mixin_isEmpty(this.SRCH_ORDER_ID2)) {
          await this.getRspnsData(1);
        }
      }else {
        this.listGroupData[1] = {};
        this.selectedTabIndex = 0;
        this.selectedTabIndex = 1;
      }
    },

    // 레이아웃 조회
    async getLayout() {
      this.lkagList = [];
      let sUrl = '/api/common/layout/selectLayout'
      let postParam = {
        SCHEMA_ID: store.getters["authStore/GE_CUSTCO_TENANT_ID"]
        , CUSTCO_ID: store.getters["userStore/GE_USER_ROLE"].company.CD
        , CERT_CUSTCO_ID: store.getters['authStore/GE_CERT_CUSTCO_ID']
        , LAYOUT_ID: this.LAYOUT_ID_PROP
      }
      let headParam = {head: {}}

      let response = await this.common_postCall(sUrl, postParam, headParam);

      // 카페24 인증 S
      if(response.HEADER.CAFE24_AT !== undefined && !response.HEADER.CAFE24_AT) {
        if( store.getters['userStore/GE_USER_ROLE'].atrtGroupId === '1' || store.getters['userStore/GE_USER_ROLE'].atrtGroupId === '2' ) {
          this.showAlertInfo({msg: '카페24 인증정보가 만료되었습니다. 인증을 진행합니다.', callAfter: () => {
              this.popupwindow(atob(response.HEADER.CAFE24_ACU), "카페24 인증", 850, 800);
            }
          });

        }else {
          this.showToastCaution({msg: "카페24 인증정보가 없습니다."});
        }
      }
      // 카페24 인증 E

      if (!response.HEADER.ERROR_FLAG) {
        if (!this.mixin_isEmpty(response.tabList)) this.setTabLayout(response.tabList);
      } else {
        this.noneExistLayout(response.HEADER.ERROR_MSG)
      }
    },
    popupwindow(url, title, w, h) {
      var left = (screen.width/2)-(w/2);
      var top = (screen.height/2)-(h/2);
      return window.open(url, title, 'width='+w+', height='+h+', top='+top+', left='+left);
    },
// 탭 데이터
    setTabLayout(data) {
      console.log("called, setTabLayout init")
      this.listTabData = data;
      this.listGroupData[0] = {};
      this.listGroupData[1] = {};
    },
    async getRspnsData(tabIndex) {

      (tabIndex === 0)?this.apiCallProgress = true:this.apiCallProgress2 = true;

      this.countForAlarm = 0;
      this.listGroupData[this.selectedTabIndex] = {};

      let srch_celphone = "";
      let srch_order_id = "";
      let srch_bean_id = ""
      let srch_lkag_id = ""
      let srch_mng_seq = "";
      if( tabIndex === 0 ) {
        srch_bean_id = this.listTabData[0].LKAG_BEAN_ID; //CAFE24
        srch_lkag_id = this.listTabData[0].LKAG_ID; //34
        srch_celphone = this.SRCH_CUST_PHN_NO;
        srch_order_id = this.SRCH_ORDER_ID;
      }else if( tabIndex === 1 ) {
        srch_bean_id = this.listTabData[1].LKAG_BEAN_ID;
        srch_lkag_id = this.listTabData[1].LKAG_ID;
        srch_celphone = this.SRCH_CUST_PHN_NO2;
        srch_order_id = this.SRCH_ORDER_ID2;
        srch_mng_seq = this.SRCH_MNG_SEQ2;  //관리번호
      }

      try {
        let sUrl = '/intgr-api/commerce/call_api'
        let postParam = {
          CERT_CUSTCO_ID: this.$store.getters["authStore/GE_CERT_CUSTCO_ID"]
          , BEAN_ID: srch_bean_id
          , LKAG_ID: srch_lkag_id
          , buyer_cellphone: srch_celphone
          , order_id: srch_order_id
          , start_date: this.calculateDate
          , end_date: this.today
          , srch_mng_seq: srch_mng_seq    //이지어드민 관리번호
        }
        let headParam = {head: {}};

        let response = await this.common_postCall(sUrl, postParam, headParam)
        if (!response.HEADER.ERROR_FLAG) {
          this.listGroupData[tabIndex] = response.DATA[0];
          if( this.listGroupData[tabIndex].size != 0) {
            if( tabIndex === 0 ) {  //카페24
              for (let i = 0; i < this.listGroupData[tabIndex].orders.length; i++) {
                this.listGroupData[tabIndex].orders[i].dtlActive = false;
              }
            }else { //이지어드민
              for (let i = 0; i < this.listGroupData[tabIndex].data.length; i++) {
                this.listGroupData[tabIndex].data[i].dtlActive = false;
              }
            }
          }else {
            (tabIndex === 0)?this.apiCallProgress = 'nodata':this.apiCallProgress2 = 'nodata';
          }
        }else {
          (tabIndex === 0)?this.apiCallProgress = null:this.apiCallProgress2 = null;
        }

      } catch(e){
        (tabIndex === 0)?this.apiCallProgress = false:this.apiCallProgress2 = false;
      }
      (tabIndex === 0)?this.apiCallProgress = false:this.apiCallProgress2 = false;
    },
    // Array 찾기
    findListWithKey(data, key) {
      for (const prop in data) {
        if (typeof data[prop] === 'object' && data[prop] !== null) {
          if (prop === key && Array.isArray(data[prop])) {
            return data[prop];
          } else if (prop === key && !Array.isArray(data[prop])) {
            return data[prop];
          } else {
            const result = this.findListWithKey(data[prop], key);
            if (result) {
              return result;
            }
          }
        }
      }
      return [];
    },
    // 응답 파라미터를 지정된 형식에 따라 변환
    parseParam(type, param) {
      let parsedParam = null;
      if( param == undefined ) {
        parsedParam = "-";
      }else {
        switch (type) {
          case 'LPIT_INT':
            parsedParam = this.mixin_convertNumToComma(Math.round(param));
            break;
          case 'LPIT_STRING':
            parsedParam = param;
            break;
          case 'LPIT_DATETIME':
            parsedParam = this.mixin_convertDate(param, 'yyyy-MM-dd HH:mm:ss');
            break;
        }
      }
      return parsedParam;
    },
    dateFormat(date) {
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();

      month = month >= 10 ? month : '0' + month;
      day = day >= 10 ? day : '0' + day;
      hour = hour >= 10 ? hour : '0' + hour;
      minute = minute >= 10 ? minute : '0' + minute;
      second = second >= 10 ? second : '0' + second;

      return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    },
    //Cafe24 총 할인혜택 price
    total_discount_price(obj){
      let resultObj = 0;
      for (let i = 0; i < obj.length; i++) {
        if( obj[i].additional_discount_price != undefined ) {
          resultObj += parseInt(obj[i].additional_discount_price);
        }
      }
      return resultObj;
    },
    // cafe24  배송비
    shipping_fee_detail(obj, code){
      let resultObj = {};
      for (let i = 0; i < obj.length; i++) {
        if( obj[i].items != undefined ) {
          if ((obj[i].items.toString()).indexOf( code ) > -1) {
            resultObj = obj[i];
            break;
          }
        }
      }
      return resultObj;
    },
    // cafe24 회원그룹 정보조회
    customergroups( obj, code ) {
      let resultObj = {};
      for (let i = 0; i < obj.length; i++) {
        if( obj[i].group_no == code) {
          resultObj = obj[i];
          break;
        }
      }
      return resultObj;
    },

    // ezadmin 택배사정보
    trans_corp( obj, code ) {
      let resultObj = {};
      for (let i = 0; i < obj.length; i++) {
        if( obj[i].code == code) {
          resultObj = obj[i];
          break;
        }
      }
      return resultObj;
    },

    // 레이아웃이 존재 하지 않을 때, alert창 출력 후 주문정보창 닫기
    noneExistLayout(msg){
      this.showAlertCaution({
        msg: msg, callAfter: () => {
          this.$emit('closeOrderList');
        }
      })
    },
    // 주문내역이 존재하는 경우 알람
    orderListAlarm() {
      let orderListIndex = this.$store.getters["userStore/GE_RIGHT_MENU"].findIndex(i => i.ICON_CLASS_NM === 'orderlist')
      // console.log("countForAlarm", this.countForAlarm)
      if (this.countForAlarm > 0 && !this.SHOW_DIALOG_PROP) {
        this.$store.commit("userStore/MU_ANIMATION_ACTIVE", orderListIndex);
      } else {
        this.$store.commit("userStore/MU_ANIMATION_INACTIVE", orderListIndex);
      }
    },
    // 주문내역 상세 클릭 시 dtlActive 값 변경
    async toggleDetail(idx){
      if( this.selectedTabIndex === 0) {

        //활성화이면서 수령자가 없는경우 상세정보조회
        if( !this.listGroupData[this.selectedTabIndex].orders[idx].dtlActive && this.mixin_isEmpty(this.listGroupData[this.selectedTabIndex].orders[idx].RESP_receivers) ) {
          this.apiCallProgressDetail = true;
          //카페24 디테일
          try {
            let sUrl = '/intgr-api/commerce/cafe24/ordersDetail'
            let postParam = {
              start_date: this.listGroupData[this.selectedTabIndex].start_date
              , end_date: this.listGroupData[this.selectedTabIndex].end_date
              , mallid: this.listGroupData[this.selectedTabIndex].mallid
              , at: this.listGroupData[this.selectedTabIndex].at
              , order_id: this.listGroupData[this.selectedTabIndex].orders[idx].order_id

            }
            let headParam = {head: {}};

            let response = await this.common_postCall(sUrl, postParam, headParam)
            if (!response.HEADER.ERROR_FLAG ) {
              console.log(">>>>>>>>>>>>>>>>>>>>>> {}" , response.DATA[0].RESP_items);
              this.listGroupData[this.selectedTabIndex].orders[idx].RESP_items = response.DATA[0].RESP_items;
              this.listGroupData[this.selectedTabIndex].orders[idx].RESP_benefits = response.DATA[0].RESP_benefits;
              this.listGroupData[this.selectedTabIndex].orders[idx].RESP_cashreceipt = response.DATA[0].RESP_cashreceipt;
              this.listGroupData[this.selectedTabIndex].orders[idx].RESP_coupons = response.DATA[0].RESP_coupons;
              this.listGroupData[this.selectedTabIndex].orders[idx].RESP_order_memo = response.DATA[0].RESP_order_memo;
              this.listGroupData[this.selectedTabIndex].orders[idx].RESP_receivers = response.DATA[0].RESP_receivers;
              this.apiCallProgressDetail = false;
            }else {
              this.apiCallProgressDetail = false;
            }
          } catch(e){
            this.apiCallProgressDetail = false;
          }
        }

        console.log( this.listGroupData[this.selectedTabIndex].orders[idx] );

        this.selectedTabIndex = 1;
        this.selectedTabIndex = 0;

        for( let i=0 ;i< this.listGroupData[this.selectedTabIndex].orders.length; i++){
          if( i != idx) {
            this.listGroupData[this.selectedTabIndex].orders[i].dtlActive = false;
          }else {
            this.listGroupData[this.selectedTabIndex].orders[i].dtlActive = !this.listGroupData[this.selectedTabIndex].orders[i].dtlActive;
          }
        }

      }else {
        this.selectedTabIndex = 0;
        this.selectedTabIndex = 1;

        for( let i=0 ;i< this.listGroupData[this.selectedTabIndex].data.length; i++){
          if( i != idx) {
            this.listGroupData[this.selectedTabIndex].data[i].dtlActive = false;
          }else {
            this.listGroupData[this.selectedTabIndex].data[i].dtlActive = !this.listGroupData[this.selectedTabIndex].data[i].dtlActive;
          }
        }

      }

    },
    actualOrderShow( obj ){   //최종결재 actual_order_amount 표현여부 == 취소, 반품, 교환등이 있는경우
      let resultObj = false;
      for (let i = 0; i < obj.length; i++) {
        //취소
        if( obj[i].RESP_cancellation != undefined && !this.mixin_isEmpty(obj[i].RESP_cancellation.claim_code)  ) {
          resultObj = true;
          break;
        }

        //반품
        if( obj[i].RESP_return != undefined && !this.mixin_isEmpty(obj[i].RESP_return.claim_code)  ) {
          resultObj = true;
          break;
        }

        //환불
        if( obj[i].RESP_refunds != undefined && !this.mixin_isEmpty(obj[i].RESP_refunds.refund_code)  ) {
          resultObj = true;
          break;
        }
        //교환
        if( obj[i].RESP_exchange != undefined && !this.mixin_isEmpty(obj[i].RESP_exchange.refund_code)  ) {
          resultObj = true;
          break;
        }

      }
      return resultObj;
    },
  },
  async mounted() {

  },
  async created() {
    console.log("--------------------------------created------------")
    // 기간검색용 공통코드
    let codeName = ['LKAG_SRCH_TERM']
    this.commonCode = await this.mixin_common_code_get_all(codeName);
    this.srchTermBox = await this.mixin_common_code_get(this.commonCode, 'LKAG_SRCH_TERM')
    this.SRCH_TERM = 'LST_3_MONTH';

    if(!this.mixin_isEmpty(this.LAYOUT_ID_PROP)){
      await this.getLayout();
    } else {
      this.noneExistLayout('등록된 레이아웃이 없습니다.')
    }
    if(!this.mixin_isEmpty(this.CUST_INFO_PROP) && this.CUST_INFO_PROP.CUST_ID > -1){
      this.custInfoProps = this.CUST_INFO_PROP
      this.SRCH_CUST_PHN_NO = this.CUST_INFO_PROP.CUST_PHN_NO;
      this.SRCH_CUST_PHN_NO2 = this.CUST_INFO_PROP.CUST_PHN_NO;
      this.callApi();
    }
  },
  computed: {
    // 기간 검색용
    calculateDate() {
      let startDate = null;
      switch (this.SRCH_TERM) {
        case 'LST_1_DAY':
          startDate = this.today.substring(0, 8) + '000000';
          break;
        case 'LST_3_DAY':
          startDate = this.$moment(this.date).subtract(3, 'day').format("YYYYMMDDHHmmss").substring(0, 8) + '000000';
          break;
        case 'LST_1_WEEK':
          startDate = this.$moment(this.date).subtract(1, 'week').format("YYYYMMDDHHmmss").substring(0, 8) + '000000';
          break;
        case 'LST_1_MONTH':
          startDate = this.$moment(this.date).subtract(1, 'month').format("YYYYMMDDHHmmss").substring(0, 8) + '000000';
          break;
        case 'LST_3_MONTH':
          startDate = this.$moment(this.date).subtract(89, 'day').format("YYYYMMDDHHmmss").substring(0, 8) + '000000';
          break;
      }
      return startDate;
    },
  },
  watch: {
    // 바뀐값이 즉시 렌더링 되지 않아서 감시
    selectedTabIndex() {
      console.log( this.SRCH_CUST_PHN_NO );
      if( this.listGroupData[this.selectedTabIndex].size == undefined ) {
        console.log(" => watch listGroupData["+ this.selectedTabIndex +"] length = 0 ");
        if( this.selectedTabIndex === 0 ) this.callApi();
        if( this.selectedTabIndex === 1 ) {
          if( this.custInfoProps.CUST_PHN_NO == undefined && this.SRCH_CUST_PHN_NO != undefined ){
            this.SRCH_CUST_PHN_NO2 = this.SRCH_CUST_PHN_NO;
          }
          this.callApi2();
        }
      }
    },
    SHOW_DIALOG_PROP() {
      if(this.SHOW_DIALOG_PROP){
        this.selectedTabIndex = 0;
        this.getLayout();
        this.countForAlarm = 0;
        this.orderListAlarm();
        // console.log(this.SHOW_DIALOG_PROP, "true")
      }else{
        this.countForAlarm = 0;
        this.orderListAlarm();
      }
    },
    // 고객정보 변경 시 전체 데이터 조회
    async CUST_INFO_PROP() {
      // console.log("called", this.custInfoProps)
      this.custInfoProps = this.CUST_INFO_PROP
      this.SRCH_CUST_PHN_NO = this.CUST_INFO_PROP.CUST_PHN_NO
      this.SRCH_CUST_PHN_NO2 = this.CUST_INFO_PROP.CUST_PHN_NO
      if(this.custInfoProps.CUST_ID > -1){
        this.callApi();
        this.callApi2();
      }
    },
  },
  beforeDestroy() {
    console.log("--------------------------------before destroy------------")
    this.SRCH_CUST_PHN_NO = "";
    this.SRCH_ORDER_ID = "";
    this.SRCH_CUST_PHN_NO2 = "";
    this.SRCH_ORDER_ID2 = "";
    this.custInfoProps = {};
  }
}
</script>

<style lang="scss" scoped>

</style>