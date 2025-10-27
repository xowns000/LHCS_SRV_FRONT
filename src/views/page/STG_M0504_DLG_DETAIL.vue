<template>
  <!-- 채널등록 다이얼로그 -->
  <v-dialog
    v-if="dialogRegist && CHN_CLSF_CD != ''"
    v-model="dialogRegist"
    content-class="dialog-draggable"
    hide-overlay
    @keydown.esc="closeDialog()"
    @click:outside="closeDialog()">
    <div class="draggable-area">drag area</div>
    <compo-dialog
      :header-title="IS_REG_MODE ? '채널 등록' : '채널 상세정보'"
      @hide="closeDialog()"
    >
      <template slot="body">
        <ul 
          v-if="IS_REG_MODE"
          class="pl-list-dot is-no-border mt-0"
        >
          <li>연동 하고자 하는 메신저에서 사전 발급받은 채팅 샌더키와 채팅 UUID 정보가 필요합니다. 등록을 위해 사전에 발급 받은 정보를 미리 준비해 주십시오.</li>
          <li>필수 항목을 입력하신 후 <strong>[저장]</strong> 버튼을 클릭하십시오.</li>
          <li v-if="CHN_CLSF_CD == 'NTT'">네이버 톡톡 채널을 등록하신 경우 등록을 모두 완료한 후 네이버 톡톡 파트너 센터에서 <br>채널메뉴 - 개발자도구 - 챗봇API설정 - Webhook - 이벤트받을URL 항목에<br><strong>[ {{ NTT_URL }}message/navertalktalk/톡톡채널ID ]</strong>를 기입해주세요</li>
        </ul>
        <template v-if="!IS_REG_MODE">
          <h2 class="pl-dialog-body-tit-h2 is-border">고객 담당자 정보</h2>
          <div class="pl-chatting-cs-info is-mt-m">
            <div class="pl-chatting-cs-info-cus">
              <div>
                <strong class="pl-chatting-cs-info-tit">고객 담당자</strong>
                <span  class="pl-chatting-cs-info-desc">{{ MNGR_NM }}</span>
              </div>
              <div>
                <strong class="pl-chatting-cs-info-tit">연락처</strong>
                <span  class="pl-chatting-cs-info-desc">{{ MNGR_PHN_NO }}</span>
              </div>
              <div>
                <strong class="pl-chatting-cs-info-tit">이메일</strong>
                <span  class="pl-chatting-cs-info-desc">{{ MNGR_EMAIL }}</span>
              </div>
            </div>
          </div>
          <h2 class="pl-dialog-body-tit-h2 is-border">위탁 동의 정보</h2>
          <div class="pl-form-inline-wrap vertical mt-2 type-readonly">
            <div class="pl-form-inline">
              <span class="pl-label">
                동의 여부
              </span>
              <div v-if="CSGMT_AGRE_YN == 'Y'" class="pl-desc">
                동의함
              </div>
              <div v-if="CSGMT_AGRE_YN == 'N'" class="pl-desc">
                동의안함
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                동의일자
              </span>
              <div class="pl-desc">
                {{ mixin_convertDate(CSGMT_AGRE_DT, 'yyyy-MM-dd HH:MM:ss') }}
              </div>
            </div>
          </div>
          <h2 class="pl-dialog-body-tit-h2 is-border">채널 정보</h2>
        </template>
        <v-form ref="form">
        <div class="pl-form-inline-wrap vertical mt-2">
          <div class="pl-form-inline">
            <span class="pl-label">
              고객사
              <v-icon class="pl-icon20 required"></v-icon>
            </span>
            <div class="pl-desc">
              <v-text-field
                class="pl-form"
                v-model="CUSTCO_NM"
                readonly
              />
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              채널명
              <v-icon class="pl-icon20 required"></v-icon>
            </span>
            <div class="pl-desc">
              <v-text-field
                class="pl-form"
                v-model="DSPTCH_PRF_NM"
                :rules="validateRules.common.DSPTCH_PRF_NM"
                :disabled="!IS_REG_MODE && MDFCN_READONLY"
              />
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              채널 분류
              <v-icon class="pl-icon20 required"></v-icon>
            </span>
            <div class="pl-desc">
              <v-select
                class="pl-form"
                :items="mixin_common_code_get(common_code, 'CHNL_CL')"
                placeholder="선택하세요"
                v-model="CHN_CLSF_CD"
                @change="clsfChg()"
                :rules="validateRules.common.CHN_CLSF_CD"
                :disabled="!IS_REG_MODE"
              ></v-select>
            </div>
          </div>

          <!-- 채널 유형 - 채팅(카카오, 티톡, 네이버톡톡) Form 시작 -->
          <template v-if="CHN_CLSF_CD != 'EMAIL' && CHN_CLSF_CD != 'BBS'">
            <div 
              v-if="CHN_CLSF_CD=='KAKAO'"
              class="pl-form-inline" 
            >
              <span class="pl-label">
                채널 유형
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(common_code, 'CHNL_TP')"
                  placeholder="선택하세요"
                  v-model="CHN_TYPE"
                  :rules="validateRules.CHN_TYPE"
                  :disabled="!IS_REG_MODE"
                ></v-select>
              </div>
            </div>
            <div 
              class="pl-form-inline"
              v-if="CHN_TYPE == 'TALK' && IS_REG_MODE"
            >
              <span class="pl-label">
                채널 관리자 전화번호
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  v-model="MNG_PHN_NO"
                  :disabled="TTALK_READONLY"
                />
              </div>
            </div>
            <div v-if="CHN_TYPE == 'TALK' && IS_REG_MODE" class="pl-form-inline">
              <span class="pl-label">
                채널 카테고리
              </span>
              <div class="pl-desc">
                <v-autocomplete
                  class="pl-form"
                  :items="CAT_LIST"
                  item-text="name"
                  item-value="code"
                  placeholder="선택하세요"
                  v-model="CAT"
                ></v-autocomplete>
              </div>
            </div>
            <div class="pl-form-inline">
              <span 
                class="pl-label">
                {{CHN_CLSF_CD != 'NTT' ? 'UUID' : '톡톡 채널 ID'}}
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form flex-grow-1"
                  v-model="UUID"
                  :rules="validateRules.chat.UUID"
                  :disabled="(IS_REG_MODE && TTALK_READONLY) || (!IS_REG_MODE && MDFCN_READONLY)"
                />
                <v-btn 
                  v-if="CHN_TYPE == 'TALK' && IS_REG_MODE" 
                  class="pl-btn is-sub flex-grow-0" 
                  @click="getToken" 
                  :disabled="AUTH_BTN_RO"
                  >인증
                </v-btn>
              </div>
            </div>
            <div 
              class="pl-form-inline"
              v-if="CHN_TYPE == 'TALK' && IS_REG_MODE"
            >
              <span class="pl-label">
                인증번호
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form flex-grow-1"
                  v-model="TOKEN"
                  :disabled="TOKEN_RO"
                />
                <v-btn 
                  v-if="CHN_TYPE == 'TALK'" 
                  class="pl-btn is-sub flex-grow-0" 
                  @click="getAtalkChn" 
                  :disabled="ATALK_CHN_RO"
                  >채널발급
                </v-btn>
              </div>
            </div>
            <div class="pl-form-inline">
              <span 
                class="pl-label">
                {{CHN_CLSF_CD != 'NTT' ? '발신 프로필 키' : '보내기API (Authorization)'}}
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  v-model="DSPTCH_PRF_KEY"
                  :rules="validateRules.chat.DSPTCH_PRF_KEY"
                  :disabled="(IS_REG_MODE && TTALK_READONLY) || (!IS_REG_MODE && MDFCN_READONLY)"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                챗봇 사용여부
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-switch
                  v-model="CHBT_USE_YN_SWITCH"
                  @change="IS_REG_MODE ? doNothing() : (CHBT_USE_YN_SWITCH == true ? showAlert(MESSAGE.CONFIRM.CHBT_START) : showAlert(MESSAGE.CONFIRM.CHBT_STOP))"
                >
                  <template v-slot:label>
                    <span class="pl-label">{{ CHBT_USE_YN_SWITCH ? '사용' : '사용안함' }}</span>
                  </template>
                </v-switch>
                <!-- <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(common_code, 'USE_WT')"
                  placeholder="선택하세요"
                  v-model="CHBT_USE_YN"
                  @change="!IS_REG_MODE ? (CHBT_USE_YN == 'Y' ? showAlert(MESSAGE.CONFIRM.CHBT_START) : showAlert(MESSAGE.CONFIRM.CHBT_STOP)) : null"
                ></v-select> -->
              </div>
            </div>
          </template>
          <!-- 채널 유형 - 채팅(카카오, 티톡, 네이버톡톡) Form 끝 -->

          <!-- 채널 데이터소스 - 게시판 Form 시작 -->
          <template v-if="CHN_CLSF_CD == 'BBS'">
            <div class="pl-form-inline">
            <span class="pl-label">
                문의 유형
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form"
                    :items="mixin_common_code_get(common_code, 'BBS_INQ_TP')"
                    placeholder="선택하세요"
                    v-model="BBS_SETTING.BBS_INQRY_TYPE_CD"
                    :rules="validateRules.bbs.BBS_INQRY_TYPE_CD"
                    :disabled="!IS_REG_MODE && MDFCN_READONLY"
                ></v-select>
              </div>
            </div>

            <div class="pl-form-inline">
              <span class="pl-label">
                조회 인터페이스(배치)
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="this.linkage_box_lkag"
                  placeholder="선택하세요"
                  v-model="BBS_SETTING.INQ_API_ID"
                  :rules="validateRules.bbs.INQ_API_ID"
                  :disabled="!IS_REG_MODE && MDFCN_READONLY"
                  @change="onSetLkagMst"
                ></v-select>
                
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                수신 주기(배치)
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  v-model="BBS_SETTING.CLCT_RPTT"
                  :rules="validateRules.bbs.CLCT_RPTT"
                  :disabled="!IS_REG_MODE && MDFCN_READONLY"
                /> 분
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                답변 인터페이스
              </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form flex-grow-1"
                    :items="this.linkage_box_lkag"
                    placeholder="선택하세요"
                    v-model="BBS_SETTING.REG_API_ID"
                    :rules="validateRules.bbs.REG_API_ID"
                    :disabled="!IS_REG_MODE && MDFCN_READONLY"
                ></v-select>
                <compo-tooltip-btn
                    TitleProp="답변 파라미터 정의"
                    ClassProp="pl-tooltip-btn flex-grow-0"
                    IconProp="pl-icon20 detail"
                    TooltipPositionProp="bottom"
                    @btnClick="showParamApi('REG_API')"
                ></compo-tooltip-btn>
              </div>
            </div>
            <v-data-table v-show="IS_SHOW_PARAM_TABLE.REG_API && BBS_SETTING.REG_API_ID"
                class="pl-grid type-hover-func"
                :headers="API_PARAM_TABLE_HEADERS"
                :items="PARAM_TABLE_ITEMS.REG_API"
                fixed-header
                height="142px"
                hide-default-footer
            >
              <template v-slot:item="{ item }">
                <tr>
                  <td :class="mixin_getHeaderClass(API_PARAM_TABLE_HEADERS[0].align)">{{ item.ESNTL_YN }}</td>
                  <td :class="mixin_getHeaderClass(API_PARAM_TABLE_HEADERS[1].align)">{{ item.ORGNL_PARAM_NM }}</td>
                  <td :class="mixin_getHeaderClass(API_PARAM_TABLE_HEADERS[2].align)">
                    <v-text-field
                        class="pl-form"
                        style="width:100%"
                        v-model="item.CHG_PARAM_NM"
                        @blur="updateParamApi( item )"
                        :disabled="!IS_REG_MODE && MDFCN_READONLY"
                    />
                  </td>
                  <td :class="mixin_getHeaderClass(API_PARAM_TABLE_HEADERS[3].align)">
                    <v-checkbox
                        v-model="item.ANSWR_PARAM_YN_CHK"
                        hide-details
                        label=""
                        class="align-self-center"
                        :disabled="!IS_REG_MODE && MDFCN_READONLY"
                        @change="changeAnswrParamYn(item)"
                    ></v-checkbox>
                  </td>
                </tr>
              </template>
            </v-data-table>
            <div class="pl-form-inline">
              <span class="pl-label">
                대표 답변자 ID
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  v-model="BBS_SETTING.RPRS_REG_ID"
                  :rules="validateRules.bbs.RPRS_REG_ID"
                  :disabled="!IS_REG_MODE && MDFCN_READONLY"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                주문 상세조회 인터페이스
              </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form flex-grow-1"
                    :items="this.linkage_box_lkag"
                    placeholder="선택하세요"
                    v-model="BBS_SETTING.ORDR_INQ_API_ID"
                    :disabled="!IS_REG_MODE && MDFCN_READONLY"
                ></v-select>
                <compo-tooltip-btn
                    TitleProp="주문 상세조회 파라미터 정의"
                    ClassProp="pl-tooltip-btn flex-grow-0"
                    IconProp="pl-icon20 detail"
                    TooltipPositionProp="bottom"
                    @btnClick="showParamApi('ORDR_INQ_API')"
                ></compo-tooltip-btn>
              </div>
            </div>
            <v-data-table v-show="IS_SHOW_PARAM_TABLE.ORDR_INQ_API && BBS_SETTING.ORDR_INQ_API_ID"
                          class="pl-grid type-hover-func"
                          :headers="API_PARAM_TABLE_HEADERS"
                          :items="PARAM_TABLE_ITEMS.ORDR_INQ_API"
                          fixed-header
                          height="142px"
                          hide-default-footer
            >
              <template v-slot:item="{ item }">
                <tr>
                  <td :class="mixin_getHeaderClass(API_PARAM_TABLE_HEADERS[0].align)">{{ item.ESNTL_YN }}</td>
                  <td :class="mixin_getHeaderClass(API_PARAM_TABLE_HEADERS[1].align)">{{ item.ORGNL_PARAM_NM }}</td>
                  <td :class="mixin_getHeaderClass(API_PARAM_TABLE_HEADERS[2].align)">
                    <v-text-field
                        class="pl-form"
                        style="width:100%"
                        v-model="item.CHG_PARAM_NM"
                        :disabled="!IS_REG_MODE && MDFCN_READONLY"
                        @blur="updateParamApi( item )"
                    />
                  </td>
                  <td :class="mixin_getHeaderClass(API_PARAM_TABLE_HEADERS[3].align)">-</td>
                </tr>
              </template>
            </v-data-table>

            <div class="pl-form-inline">
              <span class="pl-label">
                상품 상세조회 인터페이스
              </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form flex-grow-1"
                    :items="this.linkage_box_lkag"
                    placeholder="선택하세요"
                    v-model="BBS_SETTING.GDS_INQ_API_ID"
                    :disabled="!IS_REG_MODE && MDFCN_READONLY"
                ></v-select>
                <compo-tooltip-btn
                    TitleProp="상품 상세조회 파라미터 정의"
                    ClassProp="pl-tooltip-btn flex-grow-0"
                    IconProp="pl-icon20 detail"
                    TooltipPositionProp="bottom"
                    @btnClick="showParamApi('GDS_INQ_API')"
                ></compo-tooltip-btn>
              </div>
            </div>
            <v-data-table v-show="IS_SHOW_PARAM_TABLE.GDS_INQ_API && BBS_SETTING.GDS_INQ_API_ID"
                          class="pl-grid type-hover-func"
                          :headers="API_PARAM_TABLE_HEADERS"
                          :items="PARAM_TABLE_ITEMS.GDS_INQ_API"
                          fixed-header
                          height="142px"
                          hide-default-footer
            >
              <template v-slot:item="{ item }">
                <tr>
                  <td :class="mixin_getHeaderClass(API_PARAM_TABLE_HEADERS[0].align)">{{ item.ESNTL_YN }}</td>
                  <td :class="mixin_getHeaderClass(API_PARAM_TABLE_HEADERS[1].align)">{{ item.ORGNL_PARAM_NM }}</td>
                  <td :class="mixin_getHeaderClass(API_PARAM_TABLE_HEADERS[2].align)">
                    <v-text-field
                        class="pl-form"
                        style="width:100%"
                        v-model="item.CHG_PARAM_NM"
                        :disabled="!IS_REG_MODE && MDFCN_READONLY"
                        @blur="updateParamApi( item )"
                    />
                  </td>
                  <td :class="mixin_getHeaderClass(API_PARAM_TABLE_HEADERS[3].align)">-</td>
                </tr>
              </template>
            </v-data-table>
          </template>
          <!-- 채널 유형 - 게시판 Form 끝 -->

          <!-- 채널 유형 - 이메일 Form 시작 -->
          <template v-if="CHN_CLSF_CD == 'EMAIL'">
            <div class="pl-form-inline">
              <span class="pl-label">
                HOST(IMAP)
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  v-model="EMAIL_SETTING.SRVR"
                  :rules="validateRules.email.SRVR"
                  :disabled="!IS_REG_MODE && MDFCN_READONLY"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                연동 프로토콜
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form"
                  :items="mixin_common_code_get(common_code, 'EMAIL_PROTOCOL_TP')"
                  placeholder="선택하세요"
                  v-model="EMAIL_SETTING.PROTOCOL_CD"
                  :rules="validateRules.email.PROTOCOL_CD"
                  :disabled="!IS_REG_MODE && MDFCN_READONLY"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                Port(IMAP)
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  v-model="EMAIL_SETTING.PORT"
                  :rules="validateRules.email.PORT"
                  :disabled="!IS_REG_MODE && MDFCN_READONLY"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                아이디
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  v-model="EMAIL_SETTING.ACNT"
                  :rules="validateRules.email.ACNT"
                  :disabled="!IS_REG_MODE && MDFCN_READONLY"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                비밀번호
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  v-model="EMAIL_SETTING.PSWD"
                  :type="IS_SHOW_PSWD ? 'text' : 'password'"
                  :append-icon="IS_SHOW_PSWD ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="IS_SHOW_PSWD = !IS_SHOW_PSWD"
                  :rules="validateRules.email.PSWD"
                  :disabled="!IS_REG_MODE && MDFCN_READONLY"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                수신 주기
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  v-model="EMAIL_SETTING.CLCT_RPTT"
                  :rules="validateRules.email.CLCT_RPTT"
                  :disabled="!IS_REG_MODE && MDFCN_READONLY"
                /> 분
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                발송 대표 이메일
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  v-model="EMAIL_SETTING.SNDR_EML"
                  :rules="validateRules.email.SNDR_EML"
                  :disabled="!IS_REG_MODE && MDFCN_READONLY"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                발송자 이름
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  v-model="EMAIL_SETTING.SNDR_NM"
                  :rules="validateRules.email.SNDR_NM"
                  :disabled="!IS_REG_MODE && MDFCN_READONLY"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                HOST(SMTP)
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  v-model="EMAIL_SETTING.SMTP_SRVR"
                  :rules="validateRules.email.SMTP_SRVR"
                  :disabled="!IS_REG_MODE && MDFCN_READONLY"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                Port(SMTP)
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form"
                  v-model="EMAIL_SETTING.SMTP_PORT"
                  :rules="validateRules.email.SMTP_PORT"
                  :disabled="!IS_REG_MODE && MDFCN_READONLY"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                SMTP 대표 여부
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-switch
                  v-model="EMAIL_SETTING.SMTP_RPRS_YN_SWITCH"
                  :disabled="!IS_REG_MODE && MDFCN_READONLY"
                >
                  <template v-slot:label>
                    <span class="pl-label">{{ EMAIL_SETTING.SMTP_RPRS_YN_SWITCH ? '사용' : '사용안함' }}</span>
                  </template>
                </v-switch>
              </div>
            </div>
            
          </template>
          <!-- 채널 유형 - 이메일 Form 끝 -->

          <div class="pl-form-inline">
            <span class="pl-label">
              서비스 상태
              <v-icon class="pl-icon20 required"></v-icon>
            </span>
            <div class="pl-desc">
              <v-switch
                v-model="USE_YN_SWITCH"
                @change="IS_REG_MODE ? doNothing() : (USE_YN_SWITCH == true ? showAlert(MESSAGE.CONFIRM.START) : showAlert(MESSAGE.CONFIRM.STOP))"
              >
                <template v-slot:label>
                  <span class="pl-label">{{ USE_YN_SWITCH ? '사용' : '사용안함' }}</span>
                </template>
              </v-switch>
            </div>
          </div>
        </div>
        </v-form>
        <ul 
          v-if="IS_REG_MODE"
          class="pl-list-info"
        >
          <li>채널을 등록하시면 고객 담당자(연락처, 이메일)은 등록자로 지정되며, 위탁동의 여부(동의), 위탁동의일(등록일시)가 자동으로 설정 됩니다.</li>
        </ul>
      </template>
      <template slot="footer">
        <v-btn class="pl-btn is-sub" @click="closeDialog()">닫기</v-btn>
        <!-- 등록 모드 버튼-->
        <v-btn 
          v-if="IS_REG_MODE"
          class="pl-btn" 
          @click="showAlert(MESSAGE.CONFIRM.REG)"
        >
          저장
        </v-btn>

        <!-- 상세정보 모드 버튼-->
        <v-btn
          v-if="!IS_REG_MODE && MDFCN_READONLY"
          class="pl-btn"
          @click="MDFCN_READONLY = false"
        >
          수정
        </v-btn>
        <v-btn
          v-if="!IS_REG_MODE && !MDFCN_READONLY"
          class="pl-btn"
          @click="showAlert(MESSAGE.CONFIRM.MDFCN)"
        >
          저장
        </v-btn>

      </template>

    </compo-dialog>
  </v-dialog>
</template>
<script>
export default {
name:"STG_M0504_DLG_DETAIL", //메신저 연동 관리 - 채널 등록/상세조회/수정 다이얼로그
components: {
},
props: {
  DataProp: {
    type: Object,
    default: () => {
      return {}
    }
  },
},
data() {
   return {
    dialogRegist: true,

    //API 파라미터 설정
     REG_API_TABLE: false,
     ORDR_INQ_API_TABLE: false,
     GDS_INQ_API_TABLE: false,

    //등록 모드 여부 - 등록 모드는 true, 상세 모드는 false
    IS_REG_MODE: true,

    MDFCN_READONLY:true,
    
    CHBT_USE_YN_SWITCH : false,
    USE_YN_SWITCH : false,
    //패스워드 평문 출력 여부
    IS_SHOW_PSWD: false,

    //공통코드
    common_code:[],

    //연동 데이터소스
    linkage_box_mst:[],
    linkage_box_lkag:[],

    // dialog
    // 채널 등록 - 기본 및 채팅 채널(카카오톡, 네이버톡톡, 티톡)설정 
    CUSTCO_NM:'',    //고객사명
    CERT_CUSTCO_ID: '', //인증_고객사_ID
    CHN_CLSF_CD:'',                   //채널 분류코드
    UUID:'',                          //UUID
    SNDR_KEY:'',                      //발송자 키(채번된 채널 키)
    DSPTCH_PRF_KEY: '',               //채널 발신프로필 키(등록된 채널 키)
    DSPTCH_PRF_NM: '',                //채널 명
    CHN_TYPE:'CHAT',                  //채널 유형(CHAT=채팅,TALK=알림톡)
    USE_YN:'Y',                       //서비스 상태
    CHBT_USE_YN: 'N',                 //챗봇사용여부
    TTALK_READONLY:false,             //티톡 자동생성=>입력불가

    //채널 등록 - 게시판 설정
    BBS_SETTING: {
      LKAG_MST_ID: '',                 //LKAG_MST_ID
      INQ_API_ID: '',                 //조회_API_ID
      REG_API_ID: '',                 //등록_API_ID
      ORDR_INQ_API_ID: '',            //주문_조회_API_ID
      GDS_INQ_API_ID: '',             //상품_조회_API_ID
      BBS_INQRY_TYPE_CD: '',          //문의 유형
      CLCT_RPTT: '',                  //수집_주기
      RPRS_REG_ID: '',                //대표_등록_ID
      AFTR_JOB_BGNG_DT: '',           //수집일시 변경용.
      NEXT_AFTR_JOB_BGNG_DT: ''       //마지막 수집일시
    },

    //채널 등록 - 이메일 설정
    EMAIL_SETTING: {
      SRVR: '',                       //서버(HOST)
      PROTOCOL_CD: '',                //PROTOCOL_코드
      PORT: '',                       //PORT
      ACNT: '',                       //계정(아이디)
      PSWD: '',                       //비밀번호
      CLCT_RPTT: '',                  //수집_주기(수신 주기)
      SNDR_EML: '',                   //발송자_이메일(발송 대표 이메일)
      SNDR_NM: '',                    //발송자_명(발송자 이름)
      SMTP_SRVR: '',
      SMTP_PORT: '',
      SMTP_RPRS_YN: '',
      SMTP_RPRS_YN_SWITCH: false
    },



    //채널 상세 - 추가 출력 정보
    MNGR_PHN_NO: '',                  //담당자 전화번호
    MNGR_EMAIL: '',                   //담당자 이메일
    MNGR_NM: '',                      //담당자 이름
    CSGMT_AGRE_YN: '',                //동의여부
    CSGMT_AGRE_DT: '',                //동의일자


    //알림창 메시지
    MESSAGE : {
      CONFIRM : {
        REG : {alertDialogToggle: true, msg: '채널을 등록하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.chnChck, callNo: this.closeMsg}
        , START : {alertDialogToggle: true, msg: '채널 사용을 시작하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.chnSrvc, callNo: this.noStart}
        , STOP : {alertDialogToggle: true, msg: '채널 사용을 중지하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.chnSrvc, callNo: this.noStop}
        , CHBT_START : {alertDialogToggle: true, msg: '챗봇 사용을 시작하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.chbtSrvc, callNo: this.noChbtStart}
        , CHBT_STOP : {alertDialogToggle: true, msg: '챗봇 사용을 중지하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.chbtSrvc, callNo: this.noChbtStop}
        , MDFCN: {alertDialogToggle: true, msg: '채널을 수정하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.chnStrg, callNo: this.closeMsg}
      },
      ALERT : {
        REG_SUCCESS : {alertDialogToggle: true, msg: '채널이 등록되었습니다', iconClass: 'is-info', type: 'default'}
        , SRVC_SUCCESS : {alertDialogToggle: true, msg: '채널 서비스 상태가 변경되었습니다', iconClass: 'is-info', type: 'default'}
        , CHBT_YN_SUCCESS : {alertDialogToggle: true, msg: '챗봇사용 상태가 변경되었습니다', iconClass: 'is-info', type: 'default'}
        , VALID : {alertDialogToggle: true, msg: '필수항목 확인 후<br>재시도 해주세요', iconClass: 'is-info', type: 'default'}
        , GET_TOKEN : {alertDialogToggle: true, msg: '인증번호가 발급되었습니다.', iconClass: 'is-info', type: 'default'}
        , GET_ATALK_CHN : {alertDialogToggle: true, msg: '알림톡 채널이 발급되었습니다.', iconClass: 'is-info', type: 'default'}
        , VALID_GET_TOKEN : {alertDialogToggle: true, msg: '인증번호를 받으려면<br>채널관리자 전화번호와 UUID를 입력해주세요', iconClass: 'is-info', type: 'default'}
        , VALID_GET_ATALK_CHN : {alertDialogToggle: true, msg: '알림톡 채널을 발급받으려면<br>채널관리자 전화번호, 채널 카테고리,<br> UUID, 인증번호를입력해주세요', iconClass: 'is-info', type: 'default'}
      },
      TOAST : {
        REG_SUCCESS: {  msg: '저장 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 },
      },
    },

    //필수값 체크
    valid : true,
    validateRules: {
      common: {
        DSPTCH_PRF_NM: [
          v => !!v || '채팅 채널 명 은(는) 필수 입력 항목 입니다.',
        ],
        CHN_CLSF_CD: [
          v => !!v || '채널 분류코드 은(는) 필수 입력 항목입니다.',
        ],
        USE_YN: [
          v => !!v || '서비스 상태 은(는) 필수 입력 항목 입니다.',
        ],
      },
      chat: {
        UUID: [
          v => !!v || (this.CHN_CLSF_CD != 'NTT' ? 'UUID 은(는) 필수 입력 항목 입니다.' :'톡톡 채널 ID 은(는) 필수 입력 항목 입니다.'),
        ],
        DSPTCH_PRF_KEY: [
          v => !!v || (this.CHN_CLSF_CD != 'NTT' ? '발신 프로필 키 은(는) 필수 입력 항목 입니다.' : '보내기API (Authorization) 은(는) 필수 입력 항목 입니다.'),
        ],
        CHN_TYPE: [
          v => !!v || '채널 유형 은(는) 필수 입력 항목 입니다.',
        ],
      },
      bbs: {
        INQ_API_ID: [
          v => !!v || '조회 인터페이스 은(는) 필수 입력 항목 입니다.',
        ],
        CLCT_RPTT: [
          v => !!v || '수신 주기 은(는) 필수 입력 항목 입니다.',
        ],
        BBS_INQRY_TYPE_CD: [
          v => !!v || '문의유형 은(는) 필수 입력 항목 입니다.',
        ],
      },
      email: {
        PROTOCOL_CD: [
          v => !!v || '연동 프로토콜 은(는) 필수 입력 항목 입니다.',
        ],
        SRVR: [
          v => !!v || 'HOST 은(는) 필수 입력 항목 입니다.',
        ],
        PORT: [
          v => !!v || 'Port 은(는) 필수 입력 항목 입니다.',
        ],
        ACNT: [
          v => !!v || '아이디 은(는) 필수 입력 항목 입니다.',
        ],
        PSWD: [
          v => !!v || '비밀번호 은(는) 필수 입력 항목 입니다.',
        ],
        CLCT_RPTT: [
          v => !!v || '수신 주기 은(는) 필수 입력 항목 입니다.',
        ],
        SNDR_EML: [
          v => !!v || '발신 대표 이메일 은(는) 필수 입력 항목 입니다.',
        ],
        SNDR_NM: [
          v => !!v || '발송자 이름 은(는) 필수 입력 항목 입니다.',
        ],
        SMTP_SRVR: [
          v => !!v || 'SMTP HOST 은(는) 필수 입력 항목 입니다.',
        ],
        SMTP_PORT: [
          v => !!v || 'SMTP Port 은(는) 필수 입력 항목 입니다.',
        ],
      },
      bbs: {
      }
    },

    //MTS 알림톡 채널 발급용 토큰
    AUTH_CD: '6R5XPUIkrGrZUFuCTlLjwQ==',  //MTS-한국클라우드 인증토큰
    AUTH_BTN_RO: false, //인증버튼 클릭가능
    TOKEN: '',          //인증번호
    TOKEN_RO: true,     //인증번호 쓰기가능
    MNG_PHN_NO: '',     //관리자 전화번호
    ATALK_CHN_RO: true, //채널발급버튼 클릭가능
    CAT_LIST:[],        //알림톡 카테고리 목록
    CAT:'',             //알림톡 카테고리

    //티톡 DIALOG
    dialogTtalk: false,
    TTALK_URL: '',
    RELOAD:0,

    //네이버 톡톡 API URL
    NTT_URL : '',
    API_PARAM_TABLE_HEADERS: [
     { text: '필수'  , value: 'ESNTL_YN', align: 'center', width: '70px', sortable: false },
     { text: '원본Param'  , value: 'ORGNL_PARAM_NM', align: 'left', width: '170px', sortable: false },
     { text: '대상Param - 수정즉시반영'  , value: 'CHG_PARAM_NM' , align: 'left', width: '180px', sortable: false },
     { text: '답변'  , value: 'ANSWR_PARAM_YN_CHK' , align: 'center', width: '70px', sortable: false },
     { text: 'SNDR_KEY', value: 'SNDR_KEY'   , align: ' d-none' },
     { text: 'API_ID', value: 'API_ID'   , align: ' d-none' },
     { text: 'PARAM_ARTCL_ID', value: 'PARAM_ARTCL_ID'   , align: ' d-none' },
    ],
    IS_SHOW_PARAM_TABLE : {
      REG_API: false,
      ORDR_INQ_API: false,
      GDS_INQ_API: false,
    },
    PARAM_TABLE_ITEMS: {
      REG_API: [],
      ORDR_INQ_API: [],
      GDS_INQ_API: [],
    },
   }
 },

  watch: {

  },

  computed: {

  },

  //공통코드 사용시 async-await 필수 (mixin_common_code_get_all함수로 공통코드 리스트를 가지고 오기 전에 mixin_common_code_get이벤트 발생)
  async created() {
    //공통코드설정
    let codeName = ['CHNL_CL', 'CHNL_TP', 'USE_WT', 'EMAIL_PROTOCOL_TP', 'BBS_INQ_TP'];
    this.common_code = await this.mixin_common_code_get_all(codeName);
    this.linkage_box_lkag = await this.$linkage.selectLkagByCertCustco('선택안함', null, this.$store.getters['userStore/GE_USER_ROLE'].company.ASP_CUST_KEY );  // 고객사별 연동 정보 콤보박스용
    this.CUSTCO_NM = this.$store.getters['userStore/GE_USER_ROLE'].company.CD_NM;
    this.CERT_CUSTCO_ID = this.$store.getters['userStore/GE_USER_ROLE'].company.CERT_CUSTCO_ID;

    this.getAtalkCat();
    this.NTT_URL = process.env.VUE_APP_API_URL;
    if(this.DataProp.SNDR_KEY) {
      this.SNDR_KEY = this.DataProp.SNDR_KEY;
      this.CHN_CLSF_CD = this.DataProp.CHN_CLSF_CD;
      this.IS_REG_MODE = false;
      this.getDetail();
    } else {
      //상세 조회 시, 다른 채널분류일때 깜빡임이 있어 created에서 CHN_CLSF_CD 초기화하여 값이 있을때 화면 출력 처리.(v-dialog.v-if에 CHN_CLSF_CD 조건 추가.)
      this.CHN_CLSF_CD = 'KAKAO';
    }
  },

  mounted() {
  },

  beforeDestroy() {
    this.dialogRegist = false;
  },

  methods: {

    //BBS API 파라미터 답변여부 change
    async changeAnswrParamYn( item ) {
      console.log( item );
      item.initAnswrParamYn = "Y" //답변컬럼은 1개만 가능함으로. 초기화후 한개만 지정하기 위함.
      if( item.ANSWR_PARAM_YN_CHK ) {
        item.ANSWR_PARAM_YN = 'Y';
      }else {
        item.ANSWR_PARAM_YN = 'N';
      }
      await this.updateParamApi(item);
    },

    async updateParamApi( item ) {
      const sUrl = '/chat-api/setting/messenger-connect-manage/detail-popup/updateBbsParamStng';
      let resData = await this.common_postCall(sUrl, item, {})
      if(!resData.HEADER.ERROR_FLAG){
        await this.selectBbsParamStngList( item.tableId, item.API_ID );
        await this.$store.commit("alertStore/hideAlert");
      }
    },

    //BBS API 파라미터 정의용도.
    async showParamApi( tableId ) {
      if( this.IS_SHOW_PARAM_TABLE[tableId] ) {
        this.IS_SHOW_PARAM_TABLE[tableId] = false;
      }else {
        this.IS_SHOW_PARAM_TABLE[tableId] = true;
        let api_id = "";
        if (tableId === "REG_API") {
          api_id = this.BBS_SETTING.REG_API_ID;
        }else if (tableId === "ORDR_INQ_API") {
          api_id = this.BBS_SETTING.ORDR_INQ_API_ID;
        }else if (tableId === "GDS_INQ_API") {
          api_id = this.BBS_SETTING.GDS_INQ_API_ID;
        }
        await this.selectBbsParamStngList( tableId, api_id );
      }
    },
    async selectBbsParamStngList( tableId, api_id ) {
      const sUrl = '/chat-api/setting/messenger-connect-manage/detail-popup/selectBbsParamStngList';
      let postParam = {
        SNDR_KEY: this.SNDR_KEY,
        API_ID: api_id,
      }
      let resData = await this.common_postCall(sUrl, postParam, {})
      if(!resData.HEADER.ERROR_FLAG){
        this.PARAM_TABLE_ITEMS[tableId] = [];
        resData.DATA.forEach((array) => {
          let oItem = {};
          oItem.tableId = tableId;
          oItem.SNDR_KEY = array.SNDR_KEY;
          oItem.API_ID = array.API_ID;
          oItem.PARAM_ARTCL_ID = array.PARAM_ARTCL_ID;
          oItem.ORGNL_PARAM_NM = array.ORGNL_PARAM_NM;
          oItem.CHG_PARAM_NM = array.CHG_PARAM_NM;
          oItem.ESNTL_YN = array.ESNTL_YN;
          oItem.ANSWR_PARAM_YN = array.ANSWR_PARAM_YN;
          oItem.ANSWR_PARAM_YN_CHK = oItem.ANSWR_PARAM_YN === 'Y';
          this.PARAM_TABLE_ITEMS[tableId].push(oItem);
        })
      }
    } ,

    //채널 등록 전 채널 중복체크
    async chnChck() {
      if (!this.validate()) {
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }
      let sUrl = '/chat-api/main/get-uuid/inqire';
      let postParam = {
        UUID:this.UUID,
        DSPTCH_PRF_KEY:this.DSPTCH_PRF_KEY,
        ATALK_YN: this.CHN_TYPE ==  'CHAT'? 'N' : 'Y',
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        let CHK_PRF_KEY = resData.DATA[0].CHK_PRF_KEY;
        let CHK_UUID = resData.DATA[0].CHK_UUID;

        if (CHK_PRF_KEY != 0) {
          this.showAlert(this.CHN_CLSF_CD=='NTT' ? "동일한 톡톡 채널ID가 존재합니다." : "동일한 샌더키가 존재합니다.");
          return;
        }

        if (CHK_UUID != 0) {
          this.showAlert(this.CHN_CLSF_CD=='NTT' ? "동일한 보내기 API가 존재합니다." : "동일한 UUID가 존재합니다.");
          return;
        }

        this.chnStrg();
      }
    },

    //채널 등록
    async chnStrg() {
      if (!this.validate()) {
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }
      
      let sUrl = '/chat-api/setting/messenger-connect-manage/regist-popup/regist';
      //채널 등록 시 , 채널 수정 시
      //네이버 톡톡은 uuid가 보내기 API, 발신프로필 키가 톡톡 채널 ID
      //공통 param
      let postParam = {
        CHN_CLSF_CD: this.CHN_CLSF_CD,
        DSPTCH_PRF_NM: this.DSPTCH_PRF_NM,
        SNDR_KEY: this.SNDR_KEY,
        SRVC_MAINT_YN: this.SNDR_KEY == '' ? (this.USE_YN_SWITCH ? 'Y' : 'N') : '', //등록시에만 값 넘김.
        CERT_CUSTCO_ID: this.CERT_CUSTCO_ID
      };
      
      if(this.CHN_CLSF_CD == 'BBS') {
        //채널분류 - 게시판 param
        postParam = {
          ...postParam,
          INQ_API_ID: this.BBS_SETTING.INQ_API_ID,             //조회_API_ID
          REG_API_ID: this.BBS_SETTING.REG_API_ID,             //등록_API_ID
          CLCT_RPTT: this.BBS_SETTING.CLCT_RPTT,               //수집_주기
          RPRS_REG_ID: this.BBS_SETTING.RPRS_REG_ID,           //대표_등록_ID
          LKAG_MST_ID: this.BBS_SETTING.LKAG_MST_ID,           //연동_마스터_ID
          ORDR_INQ_API_ID: this.BBS_SETTING.ORDR_INQ_API_ID,   //주문_조회_API_ID
          GDS_INQ_API_ID: this.BBS_SETTING.GDS_INQ_API_ID,     //상품_조회_API_ID
          BBS_INQRY_TYPE_CD: this.BBS_SETTING.BBS_INQRY_TYPE_CD, //대표_등록_ID
          AFTR_JOB_BGNG_DT: this.BBS_SETTING.AFTR_JOB_BGNG_DT, //수집시작일시
        }
      } else if(this.CHN_CLSF_CD == 'EMAIL') {
        //채널분류 - 이메일 param
        postParam = {
          ...postParam,
          SRVR: this.EMAIL_SETTING.SRVR,                       //서버(HOST)
          PROTOCOL_CD: this.EMAIL_SETTING.PROTOCOL_CD,         //PROTOCOL_코드
          PORT: this.EMAIL_SETTING.PORT,                       //PORT
          ACNT: this.EMAIL_SETTING.ACNT,                       //계정(아이디)
          PSWD: this.EMAIL_SETTING.PSWD,                       //비밀번호
          CLCT_RPTT: this.EMAIL_SETTING.CLCT_RPTT,             //수집_주기(수신 주기)
          SNDR_EML: this.EMAIL_SETTING.SNDR_EML,               //발송자_이메일(발송 대표 이메일)
          SNDR_NM: this.EMAIL_SETTING.SNDR_NM,                 //발송자_명(발송자 이름)
          SMTP_SRVR: this.EMAIL_SETTING.SMTP_SRVR,
          SMTP_PORT: this.EMAIL_SETTING.SMTP_PORT,
          SMTP_RPRS_YN: this.EMAIL_SETTING.SMTP_RPRS_YN_SWITCH ? 'Y' : 'N',
        }
      } else {
        //채널분류 - 카카오톡, 티톡, 네이버톡톡
        if(this.SNDR_KEY == '') {
          //등록 시
          postParam = {
            ...postParam,
            ATALK_YN: this.CHN_TYPE == 'CHAT' ? 'N' : 'Y',
            UUID: this.UUID == '자동생성' ? '@NeedChange' : (this.CHN_CLSF_CD == 'NTT' ? this.DSPTCH_PRF_KEY : this.UUID),
            DSPTCH_PRF_KEY: this.DSPTCH_PRF_KEY == '자동생성' ? '00need00change00' : (this.CHN_CLSF_CD == 'NTT' ? this.UUID : this.DSPTCH_PRF_KEY),
            CHBT_USE_YN: this.CHBT_USE_YN_SWITCH ? 'Y' : 'N',
          }
        } else {
          //수정 시
          postParam = {
            ...postParam,
            ATALK_YN: this.CHN_TYPE == 'CHAT' ? 'N' : 'Y',
            UUID: this.UUID,
            DSPTCH_PRF_KEY: this.DSPTCH_PRF_KEY,
          }
        }
      }

      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG) {
        this.$store.commit("alertStore/hideAlert");
        this.$emit("chnSrch");
        this.showToastInfo({msg:'처리 되었습니다.', time: 1000 ,icon: 'mdi-checkbox-marked-circle',  callAfter:()=>{
            if(this.SNDR_KEY == '') {
              //등록시에만 다이얼로그 닫기.
              this.closeDialog();
            }
        }} );
      }
    },

    //티톡 선택 시 UUID와 발신프로필 키 자동생성
    clsfChg(){
      if(this.CHN_CLSF_CD == 'TTALK'){
        this.TTALK_READONLY = true;
        this.UUID = '자동생성';
        this.DSPTCH_PRF_KEY = '자동생성';
        this.CHN_TYPE = 'CHAT'
      } else {
        this.TTALK_READONLY = false;
        if(this.CHN_CLSF_CD != 'KAKAO'){
          this.CHN_TYPE = 'CHAT';
        }
        this.UUID = '';
        this.DSPTCH_PRF_KEY = '';
      }
    },

    //채널 상세정보 조회
    async getDetail() {
      const sUrl = '/chat-api/setting/messenger-connect-manage/detail-popup/inqire';
      let postParam = {
        SNDR_KEY: this.SNDR_KEY,
        SRVC_MAINT_YN: this.USE_YN == true ? 'Y' : 'N',
      }
      let headParam = {
        head: {
        }
      }

      let response = await this.common_postCall(sUrl, postParam, headParam)
      if(!response.HEADER.ERROR_FLAG) {
        const item = response.DATA[0];
        this.MNGR_PHN_NO=item.CUSTCO_MNGR_PHN_NO;                 //담당자 전화번호
        this.MNGR_EMAIL=item.CUSTCO_MNGR_EMAIL;                   //담당자 이메일
        this.MNGR_NM=item.CUSTCO_MNGR_NM;                         //담당자 이름
        this.CSGMT_AGRE_YN=item.CSGMT_AGRE_YN;                    //동의여부
        this.CSGMT_AGRE_DT=item.CSGMT_AGRE_DT;                    //동의일자
        this.CHN_CLSF_CD=item.CHN_CLSF_CD;                        //채널분류
        this.CHN_TYPE=item.ATALK_YN == 'Y' ? 'TALK' : 'CHAT';     //알림톡여부
        this.MNG_PHN_NO=item.MNG_PHN_NO
        this.CAT=item.CAT
        this.UUID=item.UUID;                                      //UUID
        this.DSPTCH_PRF_KEY=item.DSPTCH_PRF_KEY;                  //발신프로필키
        this.DSPTCH_PRF_NM=item.DSPTCH_PRF_NM;                    //채널명
        this.USE_YN=item.SRVC_MAINT_YN;                           //서비스상태
        this.CHBT_USE_YN=item.CHBT_USE_YN;                        //챗봇사용여부
        this.USE_YN_SWITCH=item.SRVC_MAINT_YN == 'Y' ? true : false;//서비스상태 스위치 bool
        this.CHBT_USE_YN_SWITCH=item.CHBT_USE_YN == 'Y' ? true : false;//챗봇사용여부 스위치 bool
        if(item.CHN_CLSF_CD == "BBS") {
          this.BBS_SETTING = item.BBS_SETTING[0] ? item.BBS_SETTING[0] : this.BBS_SETTING;
        } else if(item.CHN_CLSF_CD == "EMAIL") {
          this.EMAIL_SETTING = item.EMAIL_SETTING[0] ? item.EMAIL_SETTING[0] : this.EMAIL_SETTING;
          this.EMAIL_SETTING.SMTP_RPRS_YN_SWITCH = this.EMAIL_SETTING.SMTP_RPRS_YN == 'Y' ? true : false;
        }
      }
    },

    //알림창 닫기
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    //필수값 체크
    validate () {
      return this.$refs.form.validate();
    },

    async pstSelect(){
      let sUrl = '/chat-api/main/pstQstn/select';
      let postParam = {
        SNDR_KEY: this.SNDR_KEY,
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        alert('게시판 문의 조회');
      }
    },

    //카카오 알림톡 MTS 토큰(관리자 인증) 발급
    async getToken(){
      if(this.MNG_PHN_NO == '' ||this.UUID == ''){
        this.showAlert(this.MESSAGE.ALERT.VALID_GET_TOKEN);
        return;
      }
      let sUrl = '/phone-api/atalk/getToken';
      let postParam = {
        MNG_PHN_NO : this.MNG_PHN_NO,
        UUID : this.UUID,
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        let mtsResult = resData.DATA[0].mtsResult;
        if(mtsResult.code == '200'){
          this.showAlert(this.MESSAGE.ALERT.GET_TOKEN);
          this.AUTH_BTN_RO = true;
          this.TOKEN_RO = false;
          this.ATALK_CHN_RO = false;
        } else {
          this.showAlert({alertDialogToggle: true, msg: mtsResult.message, iconClass: 'is-info', type: 'default'});
        }
      }
    },

    //카카오 알림톡 채널 발급
    async getAtalkChn(){
      if(this.UUID == '' || this.TOKEN == '' || this.MNG_PHN_NO == '' || this.CAT == ''){
        this.showAlert(this.MESSAGE.ALERT.VALID_GET_ATALK_CHN);
        return;
      }

      let sUrl = '/phone-api/atalk/getAtalkChn';
      let postParam = {
        TOKEN: this.TOKEN,
        MNG_PHN_NO : this.MNG_PHN_NO,
        UUID : this.UUID,
        CAT : this.CAT,
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        let mtsResult = resData.DATA[0].mtsResult;
        if(mtsResult.code == '200'){
          this.DSPTCH_PRF_KEY = resData.DATA[0].mtsResult.data.senderKey;
        } else {
          this.showAlert({alertDialogToggle: true, msg: mtsResult.message, iconClass: 'is-info', type: 'default'});
        }
      }
    },

    kakaotalk(){
      // let url = "https://bizmessage.kakao.com/chat/open?uuid=_mHvbs";
      let url = "https://pf.kakao.com/_mHvbs/chat"
      window.open(url, '_blank');
    },

    ttalk(windows){
      let url = "https://p3-ttalk-chat.hkpalette.com/#/ttalk_main/" + this.SEL_UUID;
      if(windows == 'NEW'){
        window.open(url, '_blank');
      } else {
        this.TTALK_URL = url;
        this.RELOAD += 1;
        this.mixin_showDialog('Ttalk');
      }
    },

    //알림톡 카테고리 리스트 가져오기
    async getAtalkCat(){
      let sUrl = '/phone-api/atalk/getAtalkCat';
      let postParam = {
      }
      let headParam = {
        head: {
        }
      }
      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.CAT_LIST = resData.DATA[0].mtsResult.data;
      }
    },

    closeDialog() {
      this.$emit('clickClose');
    },


    //채널 서비스 상태 업데이트
    async chnSrvc(){
      let sUrl = '/chat-api/setting/messenger-connect-manage/channel-status/change';
      let postParam = {
        SNDR_KEY: this.SNDR_KEY,
        CHN_CLSF_CD: this.CHN_CLSF_CD,
        SRVC_MAINT_YN: this.USE_YN_SWITCH ? 'Y' : 'N',
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        this.$emit("chnSrch");
        this.showAlert(this.MESSAGE.ALERT.SRVC_SUCCESS);
      }
    },

    //챗봇사용여부 업데이트
    async chbtSrvc(){
      let sUrl = '/chat-api/setting/messenger-connect-manage/chbt-yn/change';
      let postParam = {
        SNDR_KEY: this.SNDR_KEY,
        CHBT_USE_YN: this.CHBT_USE_YN_SWITCH == true ? 'Y' : 'N',
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.CHBT_YN_SUCCESS);
      }
    },

    //채널 사용시작 취소
    noStart(){
      this.USE_YN_SWITCH = false;
      this.closeMsg();
    },

    //채널 사용중지 취소
    noStop(){
      this.USE_YN_SWITCH = true;
      this.closeMsg();
    },

    //챗봇 사용시작 취소
    noChbtStart(){
      this.CHBT_USE_YN_SWITCH = false;
      this.closeMsg();
    },

    //챗봇 사용중지 취소
    noChbtStop(){
      this.CHBT_USE_YN_SWITCH = true;
      this.closeMsg();
    },  

    doNothing() {
      // console.log("아무 액션도 하지 말것")
    },

    // 조회인터페이스에서 MST_ID 세팅
    onSetLkagMst( val ) {
      var findObj = this.linkage_box_lkag.filter( element => element.value === val );
      if( findObj !== undefined && findObj.length > 0 ) {
        this.BBS_SETTING.LKAG_MST_ID = findObj[0].LKAG_MST_ID;
      }
    }
  },
}
</script>

<style lang="scss" scoped>

</style>