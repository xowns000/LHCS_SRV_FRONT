<template>
  <v-form ref="form">
    <div>
      <h2 class="pl-subtit">알림톡 내용
        <v-icon class="pl-icon20 required"></v-icon>
      </h2>
      <div class="pl-subdesc ">
        <v-textarea
          v-model="MSG_CONTENT"
          :rules="detailValidateRules.MSG_CONTENT"
          :spellcheck="false"
          readonly
          class="pl-form is-noresize"
          height="225px"
          placeholder="템플릿을 선택하여 지정할 수 있습니다."
        />
      </div>

      <div class="pl-btn-wrap justify-end is-mt-s">
        <div class="ml-auto">
          <v-btn class="pl-btn ml-auto" @click="atalkTmpl()">알림톡 템플릿</v-btn>
        </div>
      </div>

      <!-- 아이템 정보 -->
      <!-- 강조 유형 : 선택안함 -->
      <div v-if="this.SELECTED_TMPL.TMPL_EPSZ_TYPE === 'NONE'">
        <h2 class="pl-subtit is-mt-l ">강조 유형(선택 안함)</h2>
      </div>

      <!-- 변수 정보 -->
      <div
        v-for="item in VAR_LIST"
        :key="item.id"
        class="pl-form-inline-wrap vertical is-mt-m">
        <div class="pl-form-inline ">
          <span class="pl-label">
            변수
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form"
              v-model="item.var_title"
              readonly
            ></v-text-field>
          </div>
        </div>
        <div class="pl-form-inline ">
          <span class="pl-label">
            변수내용
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form"
              v-model="item.var_desc"
              :rules="detailValidateRules.VAR_DESC"
              @keyup="getVarDesc(item.var_desc, item.var_title)"
              placeholder="변수내용"
            ></v-text-field>
          </div>
        </div>
      </div>

      <h2 v-if="Object.keys(this.SELECTED_TMPL).length > 0 && this.SELECTED_TMPL.TMPL_EPSZ_TYPE !== 'NONE'" class="pl-subtit is-mt-l is-border">아이템 정보</h2>

      <!-- 메시지 유형 : 부가 정보형 -->
      <div v-if="this.SELECTED_TMPL.TMPL_MSG_TYPE === 'EX' || this.SELECTED_TMPL.TMPL_MSG_TYPE === 'MI'">
        <div class="pl-form-inline is-mt-m">
          <span class="pl-label">
            부가 정보 내용
          </span>
          <div class="pl-desc is-mt-m">
            <v-textarea
              class="pl-form is-noresize"
              readonly
              v-model="this.SELECTED_TMPL.TMPL_EXTRA"
              :spellcheck="false"
            />
          </div>
        </div>
      </div>

      <!-- 강조 유형 : 아이템 리스트형 -->
      <div v-if="this.SELECTED_TMPL.TMPL_EPSZ_TYPE === 'ITEM_LIST'">
        <div class="pl-form-inline-wrap vertical is-mt-m is-mt-m ">
          <div class="pl-form-inline is-mt-m">
            <span class="pl-label">
              헤더
            </span>
            <div class="pl-desc">
              <v-text-field
                class="pl-form"
                v-model="this.SELECTED_TMPL.ITEM_HEADER"
                readonly
              ></v-text-field>
            </div>
          </div>
          <div class="pl-form-inline ">
            <span class="pl-label">
              하이라이트 타이틀
            </span>
            <div class="pl-desc">
              <v-text-field
                class="pl-form"
                v-model="this.SELECTED_TMPL.ITEM_HIGH_LIGHT.title"
                readonly
              ></v-text-field>
            </div>
          </div>
          <div class="pl-form-inline ">
            <span class="pl-label">
              하이라이트 디스크립션
            </span>
            <div class="pl-desc">
              <v-text-field
                class="pl-form"
                v-model="SELECTED_TMPL.ITEM_HIGH_LIGHT.description"
                readonly
              ></v-text-field>
            </div>
          </div>
          <template v-for="item, index in SELECTED_TMPL.TMPL_ITEM.list" >
            <div :key="index" style="display: contents;">
              <div class="pl-form-inline " >
                <span class="pl-label">
                  아이템 타이틀
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    v-model="item.title"
                    readonly
                  ></v-text-field>
                </div>
              </div>
              <div class="pl-form-inline ">
                <span class="pl-label">
                  아이템 내용
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    readonly
                    v-model="item.description"
                    placeholder="아이템 내용 (최대 23자)"
                    maxlength="23"
                  ></v-text-field>
                </div>
              </div>
            </div>
          </template>
          <div class="pl-form-inline ">
            <span class="pl-label">
              아이템 요약 타이틀
            </span>
            <div class="pl-desc">
              <v-text-field
                class="pl-form"
                value="요약 제목"
                v-model="this.SELECTED_TMPL.TMPL_ITEM.summary.title"
                readonly
              ></v-text-field>
            </div>
          </div>
          <div class="pl-form-inline ">
            <span class="pl-label">
              아이템 요약 내용
            </span>
            <div class="pl-desc">
              <v-text-field
                class="pl-form"
                placeholder="요약 내용"
                v-model="this.SELECTED_TMPL.TMPL_ITEM.summary.description"
                readonly
              ></v-text-field>
            </div>
          </div>
        </div>
      </div>

      <!-- 강조 유형 : 강조 표기형 -->
      <div v-if="this.SELECTED_TMPL.TMPL_EPSZ_TYPE === 'TEXT'">
        <div class="pl-form-inline-wrap vertical is-mt-m ">
          <div class="pl-form-inline">
            <span class="pl-label">
              Title(강조 제목)
            </span>
            <div class="pl-desc">
              <v-text-field
                class="pl-form"
                readonly
                placeholder="강조 제목 입력"
                v-model="this.SELECTED_TMPL.TMPL_TITLE"
              ></v-text-field>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              Subtitle(보조 제목)
            </span>
            <div class="pl-desc">
              <v-text-field
                class="pl-form"
                readonly
                placeholder="보조 제목 입력"
                v-model="this.SELECTED_TMPL.TMPL_SUB_TITLE"
              ></v-text-field>
            </div>
          </div>
        </div>
      </div>

      <!-- 강조 유형 : 이미지형 -->
      <div v-if="this.SELECTED_TMPL.TMPL_EPSZ_TYPE === 'IMAGE'">
        <!-- 첨부파일 -->
        <compo-file-grid
          TitleProp="이미지 파일"
          :HeaderButtonProp=false
          :HeadersProp="FILE_LIST_HEADER"
          :FilesProp="IMAGE_FILE_LIST"
        >
        </compo-file-grid>
      </div>

      <!-- 강조 유형 : 아이템리스트형 -->
      <div v-if="this.SELECTED_TMPL.TMPL_EPSZ_TYPE === 'ITEM_LIST'">
        <!-- 첨부파일 -->
        <compo-file-grid
          TitleProp="이미지 파일"
          :HeaderButtonProp=false
          :HeadersProp="FILE_LIST_HEADER"
          :FilesProp="IMAGE_FILE_LIST"
        >
        </compo-file-grid>
        <!-- 하이라이트 이미지  -->
        <div v-if="this.SELECTED_TMPL.EPSZ_IMG !== ''">
          <compo-file-grid
            TitleProp="하이라이트 이미지 "
            :HeaderButtonProp=false
            :HeadersProp="FILE_LIST_HEADER"
            :FilesProp="HIGH_LIGHT_FILE_LIST"
          >
          </compo-file-grid>
        </div>
      </div>

      <!-- 버튼 유형 -->
      <div v-if="this.BUTTONS.length > 0" class="pl-form-box-list">
        <h2 class="pl-subtit is-mt-l">버튼</h2>
        <div
          v-for="(item, index) in this.BUTTONS"
          :key="index"
          class="pl-form-box-list-unit"
          :class="index === 0 ? 'mt-3' : ''"
          >
          <div class="pl-form-box-list-title">
            {{ displayBtnTitle(item.linkType) }}
          </div>
          <div class="pl-form-box-list-content">
            <div class="pl-form-inline-wrap vertical " >

              <!-- 버튼 유형 : 웹링크 -->
              <div class="pl-form-inline" v-if="item.linkType === 'WL' || item.linkType === 'AL'">
                <span class="pl-label">
                  버튼 명
                </span>
                <div class="pl-desc">
                  <v-text-field
                    v-model="item.name"
                    class="pl-form"
                    readonly
                    placeholder="최대 14자"
                  />
                </div>
              </div>
              <div class="pl-form-inline" v-if="item.linkType === 'WL' || item.linkType === 'AL'">
                <span class="pl-label">
                  버튼 링크(Mobile)
                </span>
                <div class="pl-desc">
                  <v-text-field
                    v-model="item.linkMo"
                    class="pl-form"
                    readonly
                    placeholder="최대 500자"
                  />
                </div>
              </div>
              <div class="pl-form-inline" v-if="item.linkType === 'WL' || item.linkType === 'AL'">
                <span class="pl-label">
                  버튼 링크(PC)
                </span>
                <div class="pl-desc">
                  <v-text-field
                    v-model="item.linkPc"
                    class="pl-form"
                    readonly
                    placeholder="최대 500자"
                  />
                </div>
              </div>
              <!-- 버튼 유형 : 앱링크 -->
              <div class="pl-form-inline" v-if="item.linkType === 'AL'">
                <span class="pl-label">
                  버튼 링크(Android)
                </span>
                <div class="pl-desc">
                  <v-text-field
                    v-model="item.linkAnd"
                    class="pl-form"
                    readonly
                    placeholder="최대 500자"
                  />
                </div>
              </div>
              <div class="pl-form-inline" v-if="item.linkType === 'AL'">
                <span class="pl-label">
                  버튼 링크(iOS)
                </span>
                <div class="pl-desc">
                  <v-text-field
                    v-model="item.linkIos"
                    class="pl-form"
                    readonly
                    placeholder="최대 500자"
                  />
                </div>
              </div>
              <!-- 버튼 유형 : 봇 키워드 -->
              <div class="pl-form-inline" v-if="item.linkType === 'BK'">
                <span class="pl-label">
                  봇 키워드
                </span>
                <div class="pl-desc">
                  <v-text-field
                    v-model="item.name"
                    class="pl-form"
                    readonly
                    placeholder="최대 14자"
                  />
                </div>
              </div>
              <!-- 버튼 유형 : 메시지 전달 -->
              <div class="pl-form-inline" v-if="item.linkType === 'MD'">
                <span class="pl-label">
                  메시지
                </span>
                <div class="pl-desc">
                  <v-text-field
                    v-model="item.name"
                    class="pl-form"
                    readonly
                    placeholder="최대 14자"
                  />
                </div>
              </div>
              <!-- 버튼 유형 : 상담톡 전환 -->
              <div class="pl-form-inline" v-if="item.linkType === 'BC'">
                <span class="pl-label">
                  메시지
                </span>
                <div class="pl-desc">
                  <v-text-field
                    v-model="item.name"
                    class="pl-form"
                    readonly
                    placeholder="최대 14자"
                  />
                </div>
              </div>
              <!-- 버튼 유형 : 봇 전환 -->
              <div class="pl-form-inline" v-if="item.linkType === 'BT'">
                <span class="pl-label">
                  메시지
                </span>
                <div class="pl-desc">
                  <v-text-field
                    v-model="item.name"
                    class="pl-form"
                    readonly
                    placeholder="최대 14자"
                  />
                </div>
              </div>
              <!-- 버튼 유형 : 채널 추가 -->
              <div class="pl-form-inline" v-if="item.linkType === 'AC'">
                <span class="pl-label">
                  메시지
                </span>
                <div class="pl-desc">
                  <v-text-field
                    v-model="item.name"
                    class="pl-form"
                    readonly
                    placeholder="최대 14자"
                    :disabled="item.linkType == 'AC' ? true:false"
                  />
                </div>
              </div>
              <!-- 버튼 유형 : 배송 조회 -->
              <div class="pl-form-inline" v-if="item.linkType === 'DS'">
                <span class="pl-label">
                  메시지
                </span>
                <div class="pl-desc">
                  <v-text-field
                    v-model="item.name"
                    class="pl-form"
                    readonly
                    placeholder="배송조회하기"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 발송정보 -->
    <h2 class="pl-subtit is-mt-l">발송 정보</h2>
    <div class="pl-form-inline-wrap vertical is-border is-mt-m">
      <div class="pl-form-inline is-mt-m">
        <span class="pl-label">
          발송일시
          <v-icon class="pl-icon20 required"></v-icon>
        </span>
        <div class="pl-desc">
          <compo-date-picker
            DateType="dateTime"
            :DateProp.sync="DATE"
            :TimesProp.sync='TIME_STEP'
            :AmpmProp.sync='TIME_AM_PM'
          />
          <v-checkbox
            v-model="SEND_NOW"
            class="pl-check"
            label="즉시발송"
          ></v-checkbox>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          수신번호
          <v-icon class="pl-icon20 required"></v-icon>
        </span>
        <div class="pl-desc">
          <v-text-field
            v-model="PHONE_NUMBER"
            maxlength="14"
            hide-spin-buttons
            type="text"
            @keyup="setPhoneNo(PHONE_NUMBER)"
            oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
            :rules="detailValidateRules.PHONE_NUMBER"
            class="pl-form"
            v-byte-counter="60"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          전환전송 여부
        </span>
        <div class="pl-desc">
          <v-checkbox
            v-model="TRAN_SEND"
            class="pl-check"
            label="전환전송"
          ></v-checkbox>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          발신번호
        </span>
        <div class="pl-desc">
          <v-autocomplete
            v-model="DSPTCH_NO"
            :items="DSPTCH_NO_LIST"
            placeholder="선택하세요"
            class="pl-form"
            :disabled="!TRAN_SEND"
          ></v-autocomplete>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          전환전송 내용
        </span>
        <div class="pl-desc">
          <v-textarea
            v-model="REPLACE_MSG_CONTENT"
            class="pl-form is-noresize"
            :spellcheck="false"
            :disabled="!TRAN_SEND"
          />
        </div>
      </div>
    </div>
    <div class="pl-btn-wrap justify-end is-mt-s">
      <v-btn class="pl-btn is-sub" @click="previewBtn()">미리보기</v-btn>
      <v-btn class="pl-btn" @click="sendAtalk()">발송</v-btn>
    </div>
    <ul class="pl-list-info">
      <li>
        알림톡 발송 실패 시 문자로 전송되는 내용을 입력하세요.<br/>
        “즉시발송”을 체크하지 않을 경우 “발송일시”에 지정한 시간에 예약발송되오니 유의바랍니다.
      </li>
    </ul>
    <!-- dialog -->
    <v-dialog
      v-model="dialogPreview"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="미리 보기"
        @hide="mixin_hideDialog('Preview')"
      >
        <template slot="body">
          <p>미리보기는 실제 수신자가 보는 모양과 다를 수 있습니다. 수신자의 단말기와  수신자가 설정한 폰트 등에  따라 달리 표시되어집니다.</p>
          <!-- 미리보기 -->
          <div class="pl-alramTalk-wrap is-mt-m">
            <div class="pl-alramTalk-wrap-unit">
              <div class="pl-alramTalk-wrap-title">알림톡 도착</div>
              <div class="pl-alramTalk-wrap-desc">
                <div class="pl-alramTalk-wrap-textarea" style="height: 150px">
                  <!-- 강조 유형 : 이미지형 -->
                  <div v-if="this.SELECTED_TMPL.TMPL_EPSZ_TYPE === 'IMAGE'">
                    <p style="height: 80px;">image</p>
                  </div>

                  <!-- 강조표기형 -->
                  <div v-if="this.SELECTED_TMPL.TMPL_EPSZ_TYPE === 'TEXT'">
                    {{ this.SELECTED_TMPL.TMPL_SUB_TITLE }}
                  </div>
                  <div v-if="this.SELECTED_TMPL.TMPL_EPSZ_TYPE === 'TEXT'" style="font-weight: bold; font-size: large;">
                    {{ this.SELECTED_TMPL.TMPL_TITLE }}
                  </div>

                  <!-- 내용 -->
                  <div style="font-weight: bold">
                    {{ MSG_CONTENT }}
                  </div>

                  <!-- 부가정보형 -->
                  <div v-if="this.SELECTED_TMPL.TMPL_MSG_TYPE === 'EX' || this.SELECTED_TMPL.TMPL_MSG_TYPE === 'MI'">
                    <div class="">
                      {{ this.SELECTED_TMPL.TMPL_EXTRA }}
                    </div>
                  </div>
                </div>

                <!-- 버튼 유형 -->
                <div v-if="this.BUTTONS.length > 0">
                  <div
                    v-for="(item, index) in this.BUTTONS"
                    :key="index"
                    :class="index === 0 ? 'mt-3' : ''"
                    >
                    <!-- 버튼 유형 : 웹링크, 앱링크-->
                    <div class="pl-alramTalk-wrap-btn mt-2" v-if="item.linkType === 'WL' || item.linkType === 'AL'">
                      <v-btn class="pl-btn is-sub is-intalk"> {{ item.name }}</v-btn>
                    </div>
                    <!-- 버튼 유형 : 봇 키워드 -->
                    <div class="pl-alramTalk-wrap-btn mt-2" v-if="item.linkType === 'BK'">
                      <v-btn class="pl-btn is-sub is-intalk"> {{ item.name }}</v-btn>
                    </div>
                    <!-- 버튼 유형 : 메시지 전달 -->
                    <div class="pl-alramTalk-wrap-btn mt-2" v-if="item.linkType === 'MD'">
                      <v-btn class="pl-btn is-sub is-intalk"> {{ item.name }}</v-btn>
                    </div>
                    <!-- 버튼 유형 : 상담톡 전환 -->
                    <div class="pl-alramTalk-wrap-btn mt-2" v-if="item.linkType === 'BC'">
                      <v-btn class="pl-btn is-sub is-intalk"> {{ item.name }}</v-btn>
                    </div>
                    <!-- 버튼 유형 : 봇 전환 -->
                    <div class="pl-alramTalk-wrap-btn mt-2" v-if="item.linkType === 'BT'">
                      <v-btn class="pl-btn is-sub is-intalk"> {{ item.name }}</v-btn>
                    </div>
                    <!-- 버튼 유형 : 채널 추가 -->
                    <div class="pl-alramTalk-wrap-btn mt-2" v-if="item.linkType === 'AC'">
                      <v-btn class="pl-btn is-sub is-intalk"> {{ item.name }}</v-btn>
                    </div>
                    <!-- 버튼 유형 : 배송 조회 -->
                    <div class="pl-alramTalk-wrap-btn mt-2" v-if="item.linkType === 'DS'">
                      <v-btn class="pl-btn is-sub is-intalk"> {{ item.name }}</v-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template slot="footer">
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- 알림톡 템플릿 dialog -->
    <v-dialog
      v-model="dialogTemplate"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="알림톡 템플릿"
        @hide="mixin_hideDialog('Template')"
        @submit="submitDialog('Template')"
      >
        <template slot="body">
          <p>사용할 템플릿을 확인 하시고  <strong>[선택] 버튼을 클릭</strong> 하십시오</p>
          <v-data-table
            class="pl-grid is-mt-m"
            :headers="headers"
            :items="items"
            fixed-header
            item-key="index"
            height="562px"
            :items-per-page="ROW_PER_PAGE"
            hide-default-footer
            :page.sync="page"
            @page-count="pageCount = $event"
            no-data-text="등록된 데이터가 없습니다.">
            <template v-slot:item.TMPL_IGI_NM="{ item }">
              <span :class="`is-txt-${ displayStatus(item.TMPL_IGI_NM) }`">
                {{ item.TMPL_IGI_NM }}
              </span>
            </template>
            <template v-slot:item.TMPL_SELECT="{ item }">
              <v-btn class="pl-btn is-sm" @click="selectedItem(item)" :disabled="item.TMPL_SELECT">선택</v-btn>
            </template>
          </v-data-table>
        </template>
      </compo-dialog>
    </v-dialog>
  </v-form>
</template>

<script>
  export default {
    name: 'right_talk',
    data() {
      return{
        common_code : [],

        // dialog
        dialogTemplate: false,
        dialogPreview: false,

        page: 1,
        pageCount: 0,
        perPage: [15,30,50,100],
        ROW_PER_PAGE: -1,
        headers: [
          { text: '번호', value: 'ROWNUM', align: 'center', width: '80px', sortable: false },
          { text: '템플릿 명', value: 'TMPL_NM', align: '', sortable: false },
          { text: '템플릿 타입', value: 'TMPL_MSG_NM', width: '120px', sortable: false},
          { text: '템플릿 상태', value: 'TMPL_STTS_NM', align: '', width: '120px', sortable: false },
          { text: '검수 상태', value: 'TMPL_IGI_NM', align: '', width: '120px', sortable: false },
          { text: '선택', value: 'TMPL_SELECT', align: 'center', width: '100px', sortable: false },
        ],

        // 템플릿 리스트
        items: [],

        // 선택한 템플릿 정보
        SELECTED_TMPL: {},

        // 변수정보
        VAR_LIST: [],

        // 버튼정보
        BUTTONS: [],

        // 파일 헤더
        FILE_LIST_HEADER : [
          { text: '파일명', value: 'filename', align: 'left',sortable: false },
          { text: '크기', value: 'filesize', align: 'left',sortable: false , width: '100px'},
        ],

        // 파일리스트
        IMAGE_FILE_LIST : [],
        HIGH_LIGHT_FILE_LIST : [],

        // 알림톡 내용
        MSG_CONTENT: '',
        MSG_CONTENT_COPY: '',
        REPLACE_MSG_CONTENT: '',

        // 발송정보
        SEND_NOW: true, // 즉시발송
        PHONE_NUMBER: '', // 수신번호
        DSPTCH_NO_LIST: [], // 발신번호 리스트
        DSPTCH_NO: '', // 발신번호
        TRAN_SEND: false, // 전환전송 여부
        DATE: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        TIME_STEP: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(11, 5),
        TIME_AM_PM: '오후',

        detailValidateRules: {
          PHONE_NUMBER: [
            v => !!v || '수신번호 은(는) 필수 입력 항목 입니다.',
          ],
          MSG_CONTENT: [
            v => !!v || '문자 내용 은(는) 필수 입력 항목 입니다.',
          ],
          VAR_DESC: [
            v => !!v || '변수 내용 은(는) 필수 입력 항목 입니다.',
          ],
        },

        MESSAGE : {
          CONFIRM : {
          },
          ALERT : {
            NONE : {alertDialogToggle: true, msg: '템플릿을 선택해주세요.', iconClass: 'is-caution', type: 'default'}
            , ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
            , OVER_BYTE : {alertDialogToggle: true, msg: '전환전송 내용은 2000 byte 이하로 입력해주세요.', iconClass: 'is-caution', type: 'default'}
          },
        },

      }
    },
    methods: {

      setPhoneNo(val){
        let res = this.mixin_setPhoneNo(val.replace(/[^0-9]/g, ""));
        this.PHONE_NUMBER = res;
      },

      /** 이미지 첨부파일 정보 조회 */
      async selectUploadImgFile(item){
        let sUrl = "/phone-api/atalk/tmpl/manage/images";
        let postParam = {
          FILE_GROUP_KEY: item.FILE_GROUP_KEY
        }
        let headParam = {head: {}};

        let response = await this.common_postCall(sUrl, postParam, headParam);

        if(!response.HEADER.ERROR_FLAG) {
          let mainImage = item.IMG.split("/");
          let highLightImage = item.EPSZ_IMG.split("/");

          let mainImageName = mainImage.length > 0 ? mainImage[mainImage.length-1] : "";
          let highLightImageName = highLightImage.length > 0 ? highLightImage[highLightImage.length-1] : "";

          for(let i=0; i<response.DATA.length; i++){
            if(mainImageName == response.DATA[i].STRG_FILE_NM){     // 메인 이미지
              this.IMAGE_FILE_LIST.push({
                index : i,
                filename : response.DATA[i].ACTL_FILE_NM,
                filesize : this.formatBytes(response.DATA[i].FILE_SZ),
                download : true,
                count : response.DATA[i].DWNLD_CNT,
                downloadFile: response.DATA[i].ACTL_FILE_NM,
                fileGroupKey: response.DATA[i].FILE_GROUP_KEY,
                fileKey: response.DATA[i].FILE_KEY,
                busiType: response.DATA[i].TASK_TYPE_CD,
                pathType: response.DATA[i].PATH_TYPE_CD,
              });
            }else if(highLightImageName == response.DATA[i].STRG_FILE_NM){
              // console.log("high light fileGroupKey = " + response.DATA[i].FILE_GROUP_KEY);
              this.HIGH_LIGHT_FILE_LIST.push({
                index : i,
                filename : response.DATA[i].ACTL_FILE_NM,
                filesize : this.formatBytes(response.DATA[i].FILE_SZ),
                download : true,
                count : response.DATA[i].DWNLD_CNT,
                downloadFile: response.DATA[i].ACTL_FILE_NM,
                fileGroupKey: response.DATA[i].FILE_GROUP_KEY,
                fileKey: response.DATA[i].FILE_KEY,
                busiType: response.DATA[i].TASK_TYPE_CD,
                pathType: response.DATA[i].PATH_TYPE_CD,
              });
            }
          }
        }
      },

      // 파일크기 포맷
      formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        // return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
      },

      // 변수내용 입력 이벤트
      getVarDesc(desc, title){

        // 변수내용 입력시 내용 동기화
        let tempCn = this.MSG_CONTENT_COPY;

        const tempArr = new Array();
        for(let i=0; i<this.VAR_LIST.length; i++){
          tempArr.push({
            title : this.VAR_LIST[i].var_title,
            desc : this.VAR_LIST[i].var_desc,
          })
          if(tempArr[i].desc != '' ){
            tempCn = tempCn.split(tempArr[i].title).join(tempArr[i].desc);
          }
        }

        this.MSG_CONTENT = tempCn;
      },

      // 알림톡 템플릿
      atalkTmpl(){
        this.mixin_showDialog('Template');
        this.selectAtalkTmplList();
      },

      // 알림톡 템플릿 선택
      selectedItem(item){
        // console.log('item', item);

        // 선택한 템플릿 초기화
        this.SELECTED_TMPL = {};
        this.SELECTED_TMPL = item;

        // 변수 초기화
        this.VAR_LIST = [];
        // 변수명 가져오기
        var tempStr = item.TMPL_CN.match(/(?<=\#\{)(.*?)(?=\})/g);
        // 파일리스트 초기화
        this.IMAGE_FILE_LIST = [];
        this.HIGH_LIGHT_FILE_LIST = [];

        // 버튼 정보 세팅
        if(!this.mixin_isEmpty(item.BUTTONS)){
          this.BUTTONS = item.BUTTONS
        }else{
          this.BUTTONS = [];
        }

        // 이미지형 || 이미지리스트형(파일그룹키 O)
        if(!this.mixin_isEmpty(item.FILE_GROUP_KEY)){
          // 등록된 이미지 첨부파일 정보 조회
          this.selectUploadImgFile(item);
        }

        // 중복 변수 제거
        const set = new Set(tempStr);
        const uniqueArr = [...set];

        if(!this.mixin_isEmpty(uniqueArr)){
          for(var i=0; i<uniqueArr.length; i++){
            this.VAR_LIST.push({
              id: i+1,
              var_title: '#{' + uniqueArr[i] + '}',
              var_desc: ''
            });
          }
        }

        this.MSG_CONTENT = item.TMPL_CN                     // 템플릿 내용
        this.MSG_CONTENT_COPY = item.TMPL_CN;               // 템플릿 내용카피 변수

        this.mixin_hideDialog('Template');
      },

      // 알림톡 발송
      async sendAtalk(){

        if(!this.detailValidate()) {
          return;
        }

        var buttonInfo = new Array();
        var buttons = new Object();
        var data = new Object();

        // 버튼 정보 세팅
        if(!this.mixin_isEmpty(this.BUTTONS)){
          for(let i=0; i<this.BUTTONS.length; i++){
            buttonInfo.push({
              name: this.BUTTONS[i].name,
              type: this.BUTTONS[i].linkType,
              url_pc: this.BUTTONS[i].linkPc,
              url_mobile: this.BUTTONS[i].linkMo,
              scheme_android: this.BUTTONS[i].linkAnd,
              scheme_ios: this.BUTTONS[i].linkIos,
              chat_event: this.BUTTONS[i].chat_event === undefined ? "" : this.BUTTONS[i].chat_event,
              chat_extra: this.BUTTONS[i].chat_extra === undefined ? "" : this.BUTTONS[i].chat_extra,
            })
          }
        }
        buttons.button = buttonInfo
        data.attachment = buttons

        // 즉시발송 체크 여부
        if(this.SEND_NOW){
          data.send_date = '';
        }else{
          data.send_date = this.DATE.replace(/-/gi, "") + this.TIME_STEP.replace(/:/gi, "")+ "00";
        }

        data.sndngSeCd = 'ATALK';                                   // 알림톡 구분
        data.template_code = this.SELECTED_TMPL.TMPL_CD;            // 템플릿코드
        data.sender_key = this.SELECTED_TMPL.SENDER_PROFILE_KEY;    // 발신프로필키
        // data.callback_number = this.TRAN_SEND ? this.DSPTCH_NO.replace(/-/g, '') : '';    // 발신번호
        data.callback_number = this.DSPTCH_NO.replace(/-/g, '');    // 발신번호
        data.phone_number = this.PHONE_NUMBER.replace(/-/g, '');    // 수신번호
        data.message = this.MSG_CONTENT;                            // 내용

        data.subject = '전환전송 제목';                              // 전환전송 제목
        data.tran_message = this.REPLACE_MSG_CONTENT === ''
                          ? this.MSG_CONTENT
                          : this.REPLACE_MSG_CONTENT;               // 전환전송 내용

        // 알림톡 전송 실패, 전환전송 내용이 없다면 템플릿 내용으로 문자 내용이 발송됨
        data.tran_type = this.TRAN_SEND ? (this.getByteB(data.tran_message) > 90 ? 'L' : 'S') : 'N';

        if(this.SELECTED_TMPL.TMPL_TITLE != ''){
          data.title = this.SELECTED_TMPL.TMPL_TITLE                // 강조표기형 - 강조제목
        }

        data.imageFlag = this.SELECTED_TMPL.FILE_GROUP_KEY !== '' ? 'Y' :'N' // 이미지형 || 이미지리스트형(파일그룹키 O)

        let SndngResp = await this.mixin_sendMessage(data);

        if(data.send_date == ''){
          data.send_date = SndngResp[0].received_at.replace(/-/gi, "").replace(/:/gi, "").replace(" ", "");
        }
        // this.mixin_getSndngRslt(data); 
      },

      // 알림톡 단건 전송 템플릿 조회
      async selectAtalkTmplList(){

        let sUrl = "/phone-api/singleAtalk/selectAtalkTemplete";
        let postParam = {
        };
        let headParam = {
          head : {}
        };
        let response = await this.common_postCall(sUrl, postParam, headParam);

        if(!response.HEADER.ERROR_FLAG) {
          // console.log('reponse', response.DATA);
          this.items = response.DATA;
        }
      },

      // 연락처 형식
      autoPhoneNum(value) {
        if (!value) {
          return "";
        }

        value = value.replace(/[^0-9]/g, "");

        let result = [];
        let restNumber = "";

        // 지역번호와 나머지 번호로 나누기
        if (value.startsWith("02")) {
          // 서울 02 지역번호
          result.push(value.substr(0, 2));
          restNumber = value.substring(2);
        } else if (value.startsWith("1")) {
          // 지역 번호가 없는 경우
          // 1xxx-yyyy
          restNumber = value;
        } else {
          // 나머지 3자리 지역번호
          // 0xx-yyyy-zzzz
          result.push(value.substr(0, 3));
          restNumber = value.substring(3);
        }

        if (restNumber.length === 7) {
          // 7자리만 남았을 때는 xxx-yyyy
          result.push(restNumber.substring(0, 3));
          result.push(restNumber.substring(3));
        } else {
          result.push(restNumber.substring(0, 4));
          result.push(restNumber.substring(4));
        }

        return result.filter((val) => val).join("-");
      },

      // 기본 한글 2바이트 처리
      getByteB(str) {
        var byte = 0;
        for (var i=0; i<str.length; ++i) {
          (str.charCodeAt(i) > 127) ? byte += 2 : byte++ ;
        }
        return byte;
      },

      // validation check
      detailValidate () {
        // 템플릿 미선택시
        if(!Object.keys(this.SELECTED_TMPL).length > 0){
          return this.showAlert(this.MESSAGE.ALERT.NONE);
        }

        if(this.getByteB(this.REPLACE_MSG_CONTENT) > 2000){
          return this.showAlert(this.MESSAGE.ALERT.OVER_BYTE)
        }
        return this.$refs.form.validate();
      },

      // 알림톡 템플릿 상태
      displayStatus(type) {
        const typeList = [
          { type_list_text: '승인', type_list_type: 'main' },
          { type_list_text: '미등록', type_list_type: 'error' },
        ];

        for (let i = 0; i < typeList.length; i++) {
          if (typeList[i].type_list_text === type) {
            return typeList[i].type_list_type;
          }
        }
      },

      //버튼 타이틀
      displayBtnTitle(title) {
        switch (title) {
          case 'WL':
            return '웹 링크'
          case 'AL':
            return '앱 링크'
          case 'DS':
            return '배송조회'

          case 'BK':
            return '봇 키워드'

          case 'MD':
            return '메시지 전달'

          case 'BC':
            return '상담톡 전환'

          case 'BT':
            return '봇 전환'

          case 'AC':
            return '채널 추가'

            default:
            break;
        }
      },

      // 미리보기
      previewBtn(){
        if(!Object.keys(this.SELECTED_TMPL).length > 0){
          return this.showAlert(this.MESSAGE.ALERT.NONE);
        }
        this.mixin_showDialog('Preview');
      },


    },

    async created(){

      // 수신번호 세팅
      let tabs = this.$store.getters["commonStore/GE_COMMON_TAB"];
      if(tabs.length > 0){
        for(let tab of tabs){
          if(tab.id === 'CSL_M0100' || tab.id === 'CSL_M0200') { //전화상담, SNS 상담
            if((Object.keys(this.custInfoProp).length > 0) && (this.custInfoProp.CUST_PHN_NO !== '　')){
              this.PHONE_NUMBER = this.mixin_setPhoneNo(this.custInfoProp.CUST_PHN_NO.replace(/[^0-9]/g, ""));
            }
          }
        }
      }

      // 고객정보 받은 후 수신번호 세팅
      this.$eventBus.$on("setCustInfo", (custInfo) => {
        this.PHONE_NUMBER = this.mixin_setPhoneNo(custInfo.CUST_PHN_NO.replace(/[^0-9]/g, ""));
      });

      this.common_code = await this.mixin_common_code_get_all(['CUSL_PHN_NO']);

      // 발신번호 세팅
      let dsptchNoList = [];
      if(this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO){
        dsptchNoList = this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO.split(',');
      }
      for(let i=0; i<dsptchNoList.length; i++){
        this.DSPTCH_NO_LIST.push(this.autoPhoneNum(dsptchNoList[i]));
      }

      this.mixin_common_code_get(this.common_code, 'CUSL_PHN_NO').forEach((data, idx) => {
        this.DSPTCH_NO_LIST.push(this.autoPhoneNum(data.value));
      });

      this.DSPTCH_NO = this.DSPTCH_NO_LIST[0];
    },

    props: {
      custInfoProp: {
        type: Object,
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>