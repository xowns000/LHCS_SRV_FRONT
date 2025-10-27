<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
      </compo-sub-layout-top>
      <!-- sub content -->
      <!-- tabs -->
      <!-- <v-tabs class="pl-tabs" v-model="tab">
        <v-tab>카카오톡</v-tab>
      </v-tabs> -->
      <div style="height: 700px">
        <!-- <v-tabs-items v-model="tab" class="pl-tabs-items"> -->
          <!-- 카카오톡 -->
          <!-- <v-tab-item> -->
            <div class="pl-cols" style="height: 100%">
              <div class="is-vrt is-col-fix " style="width: 480px">
                <div class="pl-card">
                  <!-- tree -->
                  <div class="pl-tree-header">
                    <div class="is-left">
                      <label>문의유형 분류</label>
                    </div>
                    <div class="is-right">
                      <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault')">전체 펼치기</v-btn>
                      <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault')">전체 접기</v-btn>
                      <compo-tooltip-btn
                        TitleProp="새로고침"
                        ClassProp="pl-tooltip-btn"
                        IconProp="pl-icon20 refresh"
                        TooltipPositionProp="bottom"
                        @btnClick="qstnTreeSrch()">
                      </compo-tooltip-btn>
                    </div>
                  </div>
                  <div class="pl-tree-body" style="height: 650px;">
                    <v-treeview
                      ref="treeDefault"
                      :items="QSTN_TYPE_TREE"
                      :open-all="expanded"
                      activatable
                      :active="ACT_TREE_MENU"
                      open-on-click
                      color="secondary"
                      class="pl-tree-view"
                      @update:active="srch_tree_act"
                      @update:open="srch_tree_open"
                    >
                      <template v-slot:prepend="{ item, open }">
                        <v-icon v-if="item.children">
                          {{ open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder' }}
                        </v-icon>
                        <v-icon v-else>
                          {{ 'pl-icon20 tree-file' }}
                        </v-icon>
                      </template>
                    </v-treeview>
                  </div>
                </div>
              </div>
              <!-- 미리보기 -->
              <div class="is-vrt is-col-fix " style="width: 460px">
                <div class="pl-card">
                  <h2 class="pl-subtit d-flex justify-space-between">{{ QSTN_TYPE_NM }}
                    <div>
                      <v-switch :disabled="!MDFCN" v-model="switch1"></v-switch>
                    </div>
                  </h2>
                </div>
                <div class="pl-phone-bg-wrap is-mt-m">
                  <div class="pl-phone-bg">
                    <div class="pl-phone-sample-list-wrap">
                      <div class="pl-phone-sample-list">
                        <span class="pl-phone-sample-list-manager">[채널명]</span>
                        <div class="pl-phone-sample-list-text type-2">
                          <v-tooltip content-class="pl-tooltip right" right>
                            <template v-slot:activator="{ on, attrs }">
                              <div
                                class="pl-phone-sample-list-img"
                                @click="MDFCN ? changeQuestionImg() : nothing()"
                                v-bind="attrs"
                                v-on="on">
                                <img :src="QSTN_IMG" :alt="QSTN_TYPE_NM">
                              </div>
                              <input ref="fileUpload" type="file" @change="handleFileUpload" style="display: none" />
                            </template>
                            <span v-if="MDFCN && (CHN_CLSF_CD == 'KAKAO' || CHN_CLSF_CD == 'TTALK')">- 이미지 타입 확장자 : jpg, png, gif<br>- 이미지 타입 용량 : 최대 5MB<br>- 이미지 타입 확장자 : jpg, png <br>- 이미지 타입 용량 : 0.5 MB <br>- 이미지 타입 권장사이즈 : 720px*720px <br>- 이미지 타입 업로드 주의사항 : 가로 500px 미만 또는(가로:세로 비율이 2:1 미만 또는 3:4 초과시 업로드 불가)</span>
                            <span v-if="MDFCN && CHN_CLSF_CD == 'NTT'">- 이미지 타입 확장자 : JPG, JPEG, PNG, GIF<br>- 권장 비율 : 1.82:1<br>- 권장 이미지 크기 : 530px X 290px </span>
                            <span v-else>최상위 문의유형은 수정할 수 없습니다</span>
                          </v-tooltip>
                          <v-tooltip content-class="pl-tooltip right" right>
                            <template v-slot:activator="{ on, attrs }">
                              <div
                                class="pl-phone-sample-list-textfield"
                                v-bind="attrs"
                                v-on="on"
                                @click="MDFCN ? qstnTypeSet() : nothing()"
                              >
                                {{ QSTN_TYPE_EXPLN }}
                              </div>
                            </template>
                            <span v-if="MDFCN">클릭 하시면 메시지를<br>등록할 수 있습니다. </span>
                            <span v-else>최상위 문의유형은 수정할 수 없습니다</span>
                          </v-tooltip>
                          <div class="pl-phone-sample-list-btn">
                            <draggable ghost-class="ghost" v-model="PREVIEW_BTNS">
                              <v-btn
                                v-for="item in PREVIEW_BTNS"
                                :key="item.QSTN_TYPE_ID"
                                class="pl-btn is-sub"
                                @click="MDFCN ? underQstnType(item) : nothing()"
                              >
                                {{ item.QSTN_TYPE_NM }}
                              </v-btn>
                            </draggable>
                          </div>
                          <div class="pl-phone-sample-list-btn type-add">
                            <v-tooltip content-class="pl-tooltip right" right>
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  v-bind="attrs"
                                  v-on="on"
                                  class="pl-btn is-sub is-add"
                                  @click="MDFCN ? underQstnTypeAdd() : nothing()">+</v-btn>
                              </template>
                              <span v-if="MDFCN">클릭 하시면 문의유형을 등록할 수 있습니다.</span>
                              <span v-else>최상위 문의유형은 수정할 수 없습니다</span>
                            </v-tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="pl-card is-bottom is-noborder">
                  <div class="is-right">
                    <v-btn
                      class="pl-btn is-sub"
                      :disabled="QSTN_TYPE_DEL_BTN"
                      @click="showAlert(MESSAGE.CONFIRM.DEL);"
                    >삭제</v-btn>
                    <v-btn
                      class="pl-btn"
                      @click="showAlert(MESSAGE.CONFIRM.REG);"
                      :disabled="QSTN_TYPE_ID != '' ? !MDFCN : true"
                    >저장</v-btn>
                  </div>
                </div>
              </div>
              <!-- 상세정보 -->
              <div class="is-vrt">
                <div class="pl-card">
                  <h2 class="pl-subtit">문의유형 정보</h2>
                  <div class="pl-subdesc">
                    <p>필수 관리 항목을 입력 하신 후 <strong>[{{ BTN_NM }}] 버튼을 클릭</strong>하십시오.</p>
                  </div>
                  <div class="">
                    <v-form ref="form">
                    <div class="pl-form-inline-wrap vertical is-mt-s">
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          하위 문의유형 명
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            class="pl-form flex-grow-1"
                            v-model="UNDER_QSTN_TYPE_NM"
                            :rules="validateRules.UNDER_QSTN_TYPE_NM"
                            v-byte-counter="500"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          문의유형 타입
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-select
                            :items="mixin_common_code_get(common_code, 'CHAT_INQ_TP')"
                            class="pl-form flex-grow-1"
                            placeholder="선택하세요"
                            v-model="UNDER_QSTN_TYPE_CD"
                            :rules="validateRules.UNDER_QSTN_TYPE_CD"
                          ></v-select>
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          문의유형 메시지
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-textarea
                            class="pl-form is-noresize"
                            placeholder="메시지를 입력하세요."
                            height="300px"
                            v-model="UNDER_QSTN_TYPE_EXPLN"
                            :rules="validateRules.UNDER_QSTN_TYPE_EXPLN"
                            :spellcheck="false"
                            v-byte-counter="4000"
                          />
                        </div>
                      </div>
                      <div
                        v-if="CHN_CLSF_CD == 'TTALK'"
                        class="pl-form-inline">
                        <span class="pl-label">
                          안내메시지
                        </span>
                          <v-btn
                            class="pl-btn is-sub"
                            @click="openInfoMsg()">안내메시지 설정</v-btn>
                      </div>
                    </div>
                    </v-form>
                  </div>
                  <div class="pl-card is-bottom is-mt-s">
                    <div class="is-right">
                      <v-btn
                        class="pl-btn is-sub"
                        @click="initUnderQstnType"
                      >취소</v-btn>
                      <v-btn
                        class="pl-btn"
                        @click="underQstnTypeSet"
                        :disabled="QSTN_TYPE_ADD_BTN"
                      >{{ BTN_NM }}</v-btn>
                    </div>
                  </div>
                  <ul class="pl-list-info">
                    <li>
                      <strong class="pl-list-info-title">상담사 연결형(기본형)</strong>
                      <p class="pl-list-info-desc">하위 문의유형이 있는 경우 하위 문의유형을 출력하고, 없는 경우 상담사에게 연결합니다</p>
                    </li>
                    <li>
                      <strong class="pl-list-info-title">메시지형</strong>
                      <p class="pl-list-info-desc">메시지 전송 후 상담이 종료됩니다.</p>
                    </li>
                    <li>
                      <strong class="pl-list-info-title">챗봇 연결형(카카오톡 전용)</strong>
                      <p class="pl-list-info-desc">카카오톡 챗봇이 연동된 경우에만 사용 가능하며, 설정 시 챗봇 블록으로 이동합니다</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          <!-- </v-tab-item> -->
        <!-- </v-tabs-items> -->
      </div>

      <!-- 안내 메시지 설정 -->
      <v-dialog
        v-model="dialogInfoMsg"
        content-class="dialog-draggable is-lg is-nopadding"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="안내메시지 설정"
          @hide="mixin_hideDialog('InfoMsg')"
        >
          <template slot="body">
            <!-- component -->
            <div class="pl-cols" >
              <div class="is-vrt is-col-fix " style="width: 460px">
                <p class="pa-4">해당 버튼을 클릭하면 설정한 안내 메시지가 발송됩니다.</p>
                <div class="pl-phone-bg-wrap pb-4">
                  <div class="pl-phone-bg">
                    <div class="pl-phone-sample-list-wrap">
                      <div class="pl-phone-sample-list">
                        <span class="pl-phone-sample-list-manager">[채널명]</span>
                        <div class="pl-phone-sample-list-text type-2">
                          <div
                            class="pa-2"
                            @click="MDFCN ? qstnTypeSet() : nothing()"
                          >
                            {{ INFO_MSG }}
                          </div>
                          <div
                            v-for="INPUT_FORM,i in INPUT_FORM_ARR"
                            class="px-2 py-1"
                            >
                            {{ INPUT_FORM.TITLE }}
                            <div
                              v-if="INPUT_FORM.FORM == 'TEXT'"
                              class="mt-1 d-flex"
                              >
                              <v-text-field
                                class="pl-form flex-grow-1"
                                placeholder="텍스트 입력"
                                disabled/>
                            </div>
                            <div
                              v-if="INPUT_FORM.FORM == 'CAL'"
                              class="mt-1 d-flex"
                              >
                              <v-text-field
                                class="pl-form flex-grow-1"
                                value="2024-00-00 00:00"
                                disabled/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="is-vrt">
                <div class="pl-card">
                  <h2 class="pl-subtit">안내메시지 정보</h2>
                  <div class="pl-subdesc">
                    <p>필수 관리 항목을 입력 하신 후 <strong>[저장] 버튼을 클릭</strong>하십시오.</p>
                  </div>
                  <div class="">
                    <v-form ref="form">
                    <div class="pl-form-inline-wrap vertical is-mt-s">
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          안내메시지 제목
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            class="pl-form flex-grow-1"
                            placeholder="제목"
                            v-model="INFO_MSG_TITLE"/>
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          안내메시지 내용
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div class="pl-desc">
                          <v-textarea
                            class="pl-form is-noresize"
                            placeholder="메시지를 입력하세요."
                            height="200px"
                            v-model="INFO_MSG"
                            :spellcheck="false"
                            v-byte-counter="4000"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          고객 입력 폼
                          <v-icon class="pl-icon20 required"></v-icon>
                        </span>
                        <div
                          class="d-flex flex-column flex-grow-1"
                          style="row-gap: 8px;"
                          >
                          <div
                            v-for="INPUT_FORM,i in INPUT_FORM_ARR"
                            class="d-flex gap-x-2"
                            style="column-gap: 8px;"
                            >
                            <v-text-field
                              class="pl-form flex-grow-1"
                              placeholder="제목"
                              v-model="INPUT_FORM.TITLE"/>
                            <v-select
                              :items="mixin_common_code_get(common_code, 'INFO_MSG_FORM')"
                              class="pl-form flex-grow-1"
                              placeholder="선택하세요"
                              v-model="INPUT_FORM.FORM"
                            ></v-select>
                            <v-btn
                              class="pl-btn is-sub"
                              @click="delInputForm(i)"
                            >삭제</v-btn>
                          </div>
                          <v-btn
                            class="pl-btn is-sub"
                            @click="addInputForm"
                          >추가</v-btn>
                        </div>
                      </div>
                    </div>
                    </v-form>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template slot="footer">
            <v-btn class="pl-btn is-sub" @click="[mixin_hideDialog('InfoMsg'),initInfoMsg()]">닫기</v-btn>
            <v-btn class="pl-btn" @click="[strgInfoMsg(),initInfoMsg()]">저장</v-btn>
          </template>
        </compo-dialog>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MENU_STG_M0502", //name은 'MENU_' + 파일명 조합
  components: {
  },
  data() {
    return {
      tab: null,
      common_code:[],

      dialogInfoMsg:false,

      // tree
      expanded: false,          //전체접기,펼치기
      QSTN_TYPE_TREE: [],       //문의유형 트리
      ACT_TREE_MENU:[],         //활성화된(클릭한) 트리
      ACT_TREE_LIST:[],         //활성화된 트리 리스트

      // 미리보기(상위 문의유형 정보)
      switch1: false,
      PREVIEW_SETTING: {
        img: '',
        textfield: '안녕하세요! 한국클라우드입니다. 상담을 시작하시려면 이름과 전화번호를 입력 후 아래 버튼을 클릭해주세요. 이름과 전화번호 없이 상담을 진행하면 원활한 상담진행이어려울 수 있습니다. (이름 / 전화번호)',
        title: '이미지 대체텍스트'
      },
      PREVIEW_BTNS: [],
      testIndex: 0,

      QSTN_TYPE_ID:'',              //문의유형아이디
      UP_QSTN_TYPE_ID: '',          //상위문의유형아이디
      QSTN_TYPE_NM: '',             //문의유형명
      QSTN_TYPE_EXPLN: '',          //문의유형 메시지
      QSTN_TYPE_SE_CD: '',          //문의유형 단계
      USE_YN: '',                   //사용여부
      SNDR_KEY: '',                 //발신프로필키
      FILE_GROUP_KEY:'',            //파일 그룹 키
      QSTN_IMG: '',                 //문의유형 이미지 파일 경로
      CHN_CLSF_CD: '',              //문의유형 채팅 채널

      QSTN_TYPE_DEL_BTN:true,        //문의유형삭제버튼 활성화 여부
      QSTN_TYPE_SAVE_BTN:true,       //문의유형저장버튼 활성화 여부

      //상세정보 (하위문의유형 정보)
      UNDER_QSTN_TYPE_ID: '',       //하위 문의유형 ID
      UNDER_QSTN_TYPE_NM: '',       //하위 문의유형명
      UNDER_QSTN_TYPE_CD: 'CONSEL',  //문의유형 타입
      UNDER_QSTN_TYPE_EXPLN: '',    //문의유형 메시지
      QSTN_TYPE_CANCLE_BTN:true,    //문의유형정보 취소버튼 활성화 여부
      BTN_NM:'추가',                //하위문의유형 신규 또는 기존 문의유형임에 따라 버튼 변경
      QSTN_TYPE_ADD_BTN:true,       //문의유형정보 추가/수정버튼 활성화 여부

      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
          REG : {alertDialogToggle: true, msg: '문의유형을 저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.qstnTypeStrg, callNo: this.closeMsg}
          , DEL : {alertDialogToggle: true, msg: '문의유형을 삭제 하시겠습니까?<br>삭제하면 하위문의유형까지 모두 삭제됩니다', iconClass: 'is-info', type: 'confirm', callYes: this.qstnTypeDel, callNo: this.closeMsg}
        },
        ALERT : {
          DEL_SUCCESS : {alertDialogToggle: true, msg: '삭제가 완료되었습니다', iconClass: 'is-info', type: 'default'}
          , REG_SUCCESS : {alertDialogToggle: true, msg: '저장이 완료되었습니다', iconClass: 'is-info', type: 'default'}
          , SET_SUCCESS : {alertDialogToggle: true, msg: '설정이 변경되었습니다', iconClass: 'is-info', type: 'default'}
          , VALID : {alertDialogToggle: true, msg: '필수항목 확인 후<br>재시도 해주세요', iconClass: 'is-info', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST : {
          DEL_SUCCESS :{ msg: '삭제가 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          , REG_SUCCESS :{  msg: '저장이 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          , SET_SUCCESS :{  msg: '설정이 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        }
      },
      //필수값 체크
      valid : true,
      validateRules: {
        UNDER_QSTN_TYPE_NM: [
          v => !!v || '하위 문의유형 명 은(는) 필수 입력 항목입니다.',
        ],
        UNDER_QSTN_TYPE_CD: [
          v => !!v || '문의유형 타입 은(는) 필수 입력 항목 입니다.',
        ],
        UNDER_QSTN_TYPE_EXPLN: [
          v => !!v || '문의유형 메시지 은(는) 필수 입력 항목 입니다.',
        ],
      },

      MDFCN: true,     //문의유형 수정가능 여부 - 최상위 문의유형(채널 분류)를 클릭했을 때 수정불가, 클릭불가

      INFO_MSG_ID:'',
      INFO_MSG_TITLE:'',
      INFO_MSG:'',
      INPUT_FORM_ARR:[],
    }
  },

  watch: {

  },

  computed: {

  },

  //공통코드 사용시 async-await 필수 (mixin_common_code_get_all함수로 공통코드 리스트를 가지고 오기 전에 mixin_common_code_get이벤트 발생)
  async created() {
    //공통코드설정
    let codeName = ['CHAT_INQ_TP', 'INFO_MSG_FORM'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    this.qstnTreeSrch();
  },

  mounted() {

  },

  methods: {
    expandAll(id) {
      this.expanded = true;
      this.$refs[id].updateAll(true);
    },
    collapseAll(id) {
      this.expanded = false;
      this.$refs[id].updateAll(false);
    },
    // 이미지 클릭
    changeQuestionImg() {
      this.$refs.fileUpload.click();
    },
    //실제 파일이 서버에 올라가는 부분
    handleFileUpload(event) {
      const files = event.target.files;

      //파일 제한 체크 (프론트에서 체크하고 업로드 로직 실행x)
      if (files.length > 0 && this.isValidFiles(files)) {
        // 파일 업로드
        this.uploadFiles(files);
      }
    },
    //파일개수 제한(파일개수 체크)
    isValidFiles(files) {
      // 파일 개수 제한을 설정
      const maxFileCount = 1;
      if (files.length > maxFileCount) {
        alert(`최대 ${maxFileCount}개의 파일까지 업로드할 수 있습니다.`);
        return false;
      }

      // 파일 크기 및 형식을 설정 (대소문자 구분)
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxFileSize = 5 * 1024 * 1024; // 5MB
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!allowedFileTypes.includes(file.type)) {
          alert('지원하지 않는 파일 형식입니다.');
          return false;
        }
        if (file.size > maxFileSize) {
          alert('파일 크기가 허용 범위를 초과합니다.');
          return false;
        }
      }

      return true;
    },
    //파일 업로드
    uploadFiles(files) {
      let busiType = 'chat';
      let pathType = 'images';
      let uploadUrl = "api/file/"+ busiType +"/"+ pathType +"/uploads";

      //파일 제한 체크 (빽엔드에서 체크 후 업로드 실패)
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('action', uploadUrl);
        formData.append('method', "post");
        formData.append('custcoId', this.$store.getters["userStore/GE_USER_ROLE"].company.CD);                 //회사구분 : 1은 시스템(가이드)
        formData.append('userId', this.$store.getters["userStore/GE_USER_ROLE"].userId);                   //사용자 ID : 2는 시스템(가이드)
        formData.append('userfiles', files[i]);           //파일(바이너리)
      }
      // 서버로 파일 업로드 요청을 보냅니다.
      axios
      .post( uploadUrl, formData , {headers:{Authorization: "bearer " + window.sessionStorage.getItem("token")}} )
        .then(response => {
          // 파일 업로드 성공 시 처리
          // console.log(response.data);
          this.FILE_GROUP_KEY = response.data.data[0]["fileGroupKey"];
          this.QSTN_IMG = "/upload/" + response.data.data[0]["filePath"] + "/" + response.data.data[0]["strgFileNm"];
        })
        .catch(error => {
          // 파일 업로드 실패 시 처리
          console.error(error);
      });
    },

    async qstnTreeSrch(){
      let sUrl = '/chat-api/setting/inqry-ty-manage/chnnl-tr/inqire';
      let postParam = {
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.QSTN_TYPE_TREE = resData.QSTN_TYPE_TREE;
      }
    },

    //트리메뉴 클릭
    //최하위 메뉴 클릭 시 이벤트
    srch_tree_act(node){
      let activeItem = []
      let leng = node.length
      if(leng != 0){
        this.QSTN_TYPE_ID = node[leng-1]
      } else {  //같은메뉴를 클릭했을 때
        activeItem[0] = this.QSTN_TYPE_ID
        this.ACT_TREE_MENU = activeItem;
      }

      let selectedNode = this.findNodeById(this.QSTN_TYPE_TREE, this.QSTN_TYPE_ID);

      if(selectedNode != null){
        if(selectedNode.QSTN_TYPE_SE_CD == null || selectedNode.QSTN_TYPE_SE_CD == ''){
          this.initUnderQstnType()
          this.initQstnType()
          this.MDFCN = false;
          return;
        } else {
          this.MDFCN = true;
        }
        this.QSTN_TYPE_ID = selectedNode.QSTN_TYPE_ID
        this.UP_QSTN_TYPE_ID = selectedNode.UP_QSTN_TYPE_ID
        this.QSTN_TYPE_NM = selectedNode.QSTN_TYPE_NM
        this.QSTN_TYPE_CD = selectedNode.QSTN_TYPE_CD
        this.QSTN_TYPE_EXPLN = selectedNode.QSTN_TYPE_EXPLN
        this.CHN_CLSF_CD = selectedNode.CHN_CLSF_CD
        this.QSTN_TYPE_SE_CD = selectedNode.QSTN_TYPE_SE_CD
        if(this.QSTN_TYPE_SE_CD == '0'){
          this.QSTN_TYPE_DEL_BTN = true;
        } else {
          this.QSTN_TYPE_DEL_BTN = false;
        }
        this.USE_YN = selectedNode.USE_YN
        if(this.USE_YN == 'Y'){
          this.switch1 = true;
        } else {
          this.switch1 = false;
        }
        this.SNDR_KEY = selectedNode.SNDR_KEY
        this.FILE_GROUP_KEY = selectedNode.FILE_GROUP_KEY
        this.QSTN_IMG = "/upload/" + selectedNode["FILE_PATH"] + "/" + selectedNode["STRG_FILE_NM"];
        if(this.mixin_isEmpty( selectedNode["FILE_PATH"] )){
          this.QSTN_IMG = "";
        }

        let leng = selectedNode.children.length
        this.PREVIEW_BTNS = [];
        for(let i=0;i<leng;i++){
          this.PREVIEW_BTNS.push({
            QSTN_TYPE_NM: selectedNode.children[i]["QSTN_TYPE_NM"]
            , QSTN_TYPE_ID: selectedNode.children[i]["QSTN_TYPE_ID"]
            , QSTN_TYPE_CD: selectedNode.children[i]["QSTN_TYPE_CD"]
            , QSTN_TYPE_EXPLN: selectedNode.children[i]["QSTN_TYPE_EXPLN"]
          });
        }
      }

      this.qstnTypeSet();
      // this.initUnderQstnType();
    },
    //트리메뉴 활성화(폴더열기)
    //열린폴더 리스트가 node에 들어옴
    //폴더를 닫았을 때에는 node에 해당 폴더 정보가 없기때문에 ACT_TREE_LIST기준으로 가져옴
    srch_tree_open(node){
      let nodeLeng = node.length  //현재 활성화된 폴더
      let nowActive = []    //현재 클릭한 메뉴
      //전체 접기 버튼을 클릭했을 때
      if(nodeLeng == 0 && (this.QSTN_TYPE_ID == '' || this.QSTN_TYPE_ID == null || this.QSTN_TYPE_ID == undefined) ){
        // if(this.ACT_TREE_MENU.length != 0){
        //   this.ACT_TREE_MENU.pop()
        // }
        this.ACT_TREE_LIST = [];
        return;
      }else if(nodeLeng == 0 && (this.QSTN_TYPE_ID != '' && this.QSTN_TYPE_ID != null && this.QSTN_TYPE_ID != undefined)){
        this.ACT_TREE_LIST = [];
        return;
      }
      let actLeng = this.ACT_TREE_LIST.length //클릭하기 전 활성화된 폴더
      if(actLeng > nodeLeng){ //node에는 클릭한 순서대로 들어가기때문에 지금 클릭한 폴더를 구분해야함
        //배열을 크기순으로 나열하여 값 비교
        this.ACT_TREE_LIST.sort();
        node.sort();
        for(let i=0;i<actLeng;i++){
          if(this.ACT_TREE_LIST[i] != node[i]){
            nowActive[0] = this.ACT_TREE_LIST[i]
            break
          }
        }
      } else {  //폴더를 열었을 때
        nowActive[0] = node[nodeLeng-1]
      }
      this.QSTN_TYPE_ID = nowActive[0];
      this.ACT_TREE_MENU = nowActive;
      this.ACT_TREE_LIST = node;


      let selectedNode = this.findNodeById(this.QSTN_TYPE_TREE, this.QSTN_TYPE_ID);

      if(selectedNode != null){
        if(selectedNode.QSTN_TYPE_SE_CD == null || selectedNode.QSTN_TYPE_SE_CD == ''){
          this.initUnderQstnType()
          this.initQstnType()
          this.MDFCN = false;
          return;
        } else {
          this.MDFCN = true;
        }
        this.QSTN_TYPE_ID = selectedNode.QSTN_TYPE_ID
        this.UP_QSTN_TYPE_ID = selectedNode.UP_QSTN_TYPE_ID
        this.QSTN_TYPE_NM = selectedNode.QSTN_TYPE_NM
        this.QSTN_TYPE_CD = selectedNode.QSTN_TYPE_CD
        this.QSTN_TYPE_EXPLN = selectedNode.QSTN_TYPE_EXPLN
        this.CHN_CLSF_CD = selectedNode.CHN_CLSF_CD
        this.QSTN_TYPE_SE_CD = selectedNode.QSTN_TYPE_SE_CD
        if(this.QSTN_TYPE_SE_CD == '0'){
          this.QSTN_TYPE_DEL_BTN = true;
        } else {
          this.QSTN_TYPE_DEL_BTN = false;
        }
        this.USE_YN = selectedNode.USE_YN
        if(this.USE_YN == 'Y'){
          this.switch1 = true;
        } else {
          this.switch1 = false;
        }
        this.SNDR_KEY = selectedNode.SNDR_KEY
        this.FILE_GROUP_KEY = selectedNode.FILE_GROUP_KEY
        this.QSTN_IMG = "/upload/" + selectedNode["FILE_PATH"] + "/" + selectedNode["STRG_FILE_NM"];
        if(this.mixin_isEmpty( selectedNode["FILE_PATH"] )){
          this.QSTN_IMG = "";
        }

        let leng = selectedNode.children.length
        this.PREVIEW_BTNS = [];
        for(let i=0;i<leng;i++){
          this.PREVIEW_BTNS.push({
            QSTN_TYPE_NM: selectedNode.children[i]["QSTN_TYPE_NM"]
            , QSTN_TYPE_ID: selectedNode.children[i]["QSTN_TYPE_ID"]
            , QSTN_TYPE_CD: selectedNode.children[i]["QSTN_TYPE_CD"]
            , QSTN_TYPE_EXPLN: selectedNode.children[i]["QSTN_TYPE_EXPLN"]
          });
        }
      }

      this.qstnTypeSet();
      // this.initUnderQstnType();
    },

    //트리 클릭 시 해당 row정보 세팅
    findNodeById(nodes, id) {
      for (let node of nodes) {
        if (node.id === id) {
          return node;
        }
        if (node.children && node.children.length > 0) {
          const foundNode = this.findNodeById(node.children, id);
          if (foundNode) {
            return foundNode;
          }
        }
      }
      return null;
    },

    //미리보기 버튼 클릭시(하위문의유형 정보 세팅)
    underQstnType(qstn){
      this.QSTN_TYPE_ADD_BTN = false;

      this.BTN_NM = '수정'
      this.UNDER_QSTN_TYPE_ID = qstn.QSTN_TYPE_ID;
      this.UNDER_QSTN_TYPE_NM = qstn.QSTN_TYPE_NM;
      this.UNDER_QSTN_TYPE_CD = qstn.QSTN_TYPE_CD;
      this.UNDER_QSTN_TYPE_EXPLN = qstn.QSTN_TYPE_EXPLN;
    },

    //미리보기에서 +(추가)버튼 클릭시
    underQstnTypeAdd(){
      this.QSTN_TYPE_ADD_BTN = false;

      let num = this.PREVIEW_BTNS.length;
      this.PREVIEW_BTNS.push({
        QSTN_TYPE_NM: '신규'
        , QSTN_TYPE_ID: 'NEW'+num
        , QSTN_TYPE_CD: 'CONSEL'
        , QSTN_TYPE_EXPLN: ''
      })
      this.BTN_NM = '추가'
      this.UNDER_QSTN_TYPE_ID = 'NEW'+num;
      this.UNDER_QSTN_TYPE_NM = '신규';
      this.UNDER_QSTN_TYPE_CD = 'CONSEL';
      this.UNDER_QSTN_TYPE_EXPLN = '';
    },

    //하위문의유형 추가,수정버튼 클릭
    underQstnTypeSet(){
      if (!this.validate()) {
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }
      if(this.UNDER_QSTN_TYPE_ID == this.QSTN_TYPE_ID){
        this.QSTN_TYPE_ID = this.UNDER_QSTN_TYPE_ID;
        this.QSTN_TYPE_NM = this.UNDER_QSTN_TYPE_NM;
        this.QSTN_TYPE_CD = this.UNDER_QSTN_TYPE_CD;
        this.QSTN_TYPE_EXPLN = this.UNDER_QSTN_TYPE_EXPLN;
      } else {
        let leng = this.PREVIEW_BTNS.length
        for(let i=0;i<leng;i++){
          if(this.PREVIEW_BTNS[i]["QSTN_TYPE_ID"] == this.UNDER_QSTN_TYPE_ID){
            this.PREVIEW_BTNS[i]["QSTN_TYPE_NM"] = this.UNDER_QSTN_TYPE_NM;
            this.PREVIEW_BTNS[i]["QSTN_TYPE_CD"] = this.UNDER_QSTN_TYPE_CD;
            this.PREVIEW_BTNS[i]["QSTN_TYPE_EXPLN"] = this.UNDER_QSTN_TYPE_EXPLN;
          }
        }
      }
      this.initUnderQstnType();
      this.QSTN_TYPE_ADD_BTN = false;
    },

    //현재문의유형 정보 수정
    qstnTypeSet(){
      this.QSTN_TYPE_ADD_BTN = false;

      this.BTN_NM = '수정'
      this.UNDER_QSTN_TYPE_ID = this.QSTN_TYPE_ID;
      this.UNDER_QSTN_TYPE_NM = this.QSTN_TYPE_NM;
      this.UNDER_QSTN_TYPE_CD = this.QSTN_TYPE_CD;
      this.UNDER_QSTN_TYPE_EXPLN = this.QSTN_TYPE_EXPLN;
    },

    //문의유형정보 초기화
    initUnderQstnType(){
      this.UNDER_QSTN_TYPE_ID = '';
      this.UNDER_QSTN_TYPE_NM = '';
      this.UNDER_QSTN_TYPE_CD = 'CONSEL';
      this.UNDER_QSTN_TYPE_EXPLN = '';
      this.QSTN_TYPE_ADD_BTN = true;
    },

    //현재문의유형정보 초기화
    initQstnType(){
      this.QSTN_TYPE_ID = '';
      this.QSTN_TYPE_NM = '';
      this.QSTN_TYPE_EXPLN = '';
      this.PREVIEW_BTNS=[];
      this.QSTN_TYPE_ADD_BTN = true;
    },

    //문의유형 저장
    async qstnTypeStrg(){
      let qstnInfo = this.PREVIEW_BTNS  //하위문의유형 정보
      qstnInfo.push({
        QSTN_TYPE_ID: this.QSTN_TYPE_ID,
        QSTN_TYPE_NM: this.QSTN_TYPE_NM,
        QSTN_TYPE_CD: this.QSTN_TYPE_CD,
        QSTN_TYPE_EXPLN: this.QSTN_TYPE_EXPLN,
      })
      let sUrl = '/chat-api/setting/inqry-ty-manage/regist';
      let postParam = {
        QSTN_TYPE_ID: this.QSTN_TYPE_ID,
        QSTN_TYPE_SE_CD: this.QSTN_TYPE_SE_CD,
        SNDR_KEY: this.SNDR_KEY,
        FILE_GROUP_KEY: this.FILE_GROUP_KEY,
        USE_YN: this.switch1 === true ? 'Y' : 'N',
        QSTN_INFO: qstnInfo,
      }
      let headParam = {
        head: {
          DATA_OBJECT: "QSTN_INFO",
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        this.initQstnType();
        this.qstnTreeSrch();
        this.showToast(this.MESSAGE.TOAST.REG_SUCCESS);
      }
    },

    //알림창 닫기
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    //문의유형 삭제
    async qstnTypeDel(){
      let sUrl = '/chat-api/setting/inqry-ty-manage/delete';
      let postParam = {
        QSTN_TYPE_ID: this.QSTN_TYPE_ID,
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        this.initQstnType();
        this.qstnTreeSrch();
        this.showToast(this.MESSAGE.TOAST.DEL_SUCCESS);
      }
    },

    //필수값 체크
    validate () {
      return this.$refs.form.validate();
    },

    nothing(){
    },

    //안내메시지 수정 다이어로그 열기
    openInfoMsg(){
      this.dialogInfoMsg = true;
      this.selectInfoMsg();
    },

    //안내메시지 조회
    async selectInfoMsg(){
      let sUrl = '/chat-api/setting/inqry-ty-manage/selectInfoMsg';
      let postParam = {
        QSTN_TYPE_ID: this.QSTN_TYPE_ID,
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        if(resData.DATA.length > 0){
          this.INFO_MSG_ID = resData.DATA[0].QSTN_TYPE_ID;
          this.INFO_MSG_TITLE = resData.DATA[0].QSTN_TYPE_NM;
          this.INFO_MSG = resData.DATA[0].QSTN_TYPE_EXPLN.split('||')[0];
          this.INPUT_FORM_ARR = JSON.parse(resData.DATA[0].QSTN_TYPE_EXPLN.split('||')[1]);
        }
      }
    },

    //안내메시지 저장
    async strgInfoMsg(){
      let sUrl = '/chat-api/setting/inqry-ty-manage/infoMsgRegist';
      let postParam = {
        UP_QSTN_TYPE_ID : this.QSTN_TYPE_ID,
        QSTN_TYPE_ID: this.INFO_MSG_ID,
        QSTN_TYPE_NM: this.INFO_MSG_TITLE,
        QSTN_TYPE_CD: 'INFO_MSG',
        QSTN_TYPE_SE_CD: '99',
        SNDR_KEY: this.SNDR_KEY,
        QSTN_TYPE_EXPLN: this.INFO_MSG + '||' + JSON.stringify(this.INPUT_FORM_ARR),
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        // this.$store.commit("alertStore/hideAlert");
        // this.initQstnType();
        // this.qstnTreeSrch();
        // this.showToast(this.MESSAGE.TOAST.REG_SUCCESS);
        this.mixin_hideDialog('InfoMsg');
      }
    },

    delInputForm(i){
      this.INPUT_FORM_ARR.splice(i,1);
    },

    addInputForm(){
      this.INPUT_FORM_ARR.push(
        {
          TITLE: '',
          FORM: 'TEXT',
          VALUE: '',
        }
      )
    },

    initInfoMsg(){
      this.INFO_MSG_ID='';
      this.INFO_MSG_TITLE='';
      this.INFO_MSG='';
      this.INPUT_FORM_ARR=[];
    },
  },
}
</script>

<style lang="scss" scoped></style>