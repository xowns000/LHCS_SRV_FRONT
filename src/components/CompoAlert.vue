<template>
  <v-dialog
    :value="alert.alertDialogToggle"
    persistent
    hide-overlay
    @input="showAlert"
    width="auto"
    max-width="700"
    openOnFocus
    >
    <!--persistent 옵션: 바탕 또는 esc키 눌러도 안닫히게 하는 옵션-->
    <div :class="`pl-alert alert-type-${alert.iconClass}`" >
      <template>
        <compo-tooltip-btn
          TitleProp="닫기"
          ClassProp="pl-tooltip-btn dialog-close-btn"
          IconProp="pl-icon20 dialog-close"
          TooltipPositionProp="bottom"
          @btnClick="closeAlert"
        ></compo-tooltip-btn>
      </template>
      <div class="pl-alert-body">
        <div v-if="alert.type == 'default' || alert.type == 'confirm'">
          <v-icon class="pl-icon-alert" :class="alert.iconClass"></v-icon>
          <div
            class="pl-alert-copy"
            :class="alert.type === 'confirm' ? 'alert-btn-ct' : ''"
            v-html="newLine(alert.msg)"
          ></div>
          <div v-if="alert.downloadable">
            <v-divider class="is-mt-m"/>
            <v-form ref="form">
              <div class="pl-form-inline-wrap vertical type-auto is-mt-m">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    다운로드 사유
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc flex-column">
                    <v-text-field
                      v-model="alert.downReason"
                      class="pl-form is-auto"
                      :rules="validateRules.downReason"
                      @keydown.enter.prevent
                    />
                    <p
                      v-if="alert.downReasonChk"
                      class="pl-form-hint text-left is-txt-red ">
                      다운로드 사유를 입력해 주세요.</p>
                  </div>
                </div>
              </div>
            </v-form>
          </div>
          <div v-if="alert.reasonAble">
            <v-divider class="is-mt-m"/>
            <v-form ref="form">
              <div class="pl-form-inline-wrap vertical type-auto is-mt-m">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    사유
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc flex-column">
                    <v-text-field
                      v-model="alert.reason"
                      class="pl-form is-auto"
                      :rules="validateRules.reason"
                      @keydown.enter.prevent
                    />
                    <p
                      v-if="alert.reasonAbleChk"
                      class="pl-form-hint text-left is-txt-red ">
                      사유를 입력해 주세요.</p>
                  </div>
                </div>
              </div>
            </v-form>
          </div>
          <div v-if="alert.phnNoConfirm">
            <v-divider class="is-mt-m"/>
            <v-form ref="form">
              <div class="pl-form-inline-wrap vertical type-auto is-mt-m">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    고객 전화번호
                    <v-icon class="pl-icon20 required"></v-icon>
                  </span>
                  <div class="pl-desc flex-column">
                    <v-text-field
                      v-model="alert.custPhnNo"
                      class="pl-form is-auto"
                      placeholder="숫자만 입력해 주세요."
                      maxlength="14"
                      hide-spin-buttons
                      type="text"
                      @keyup="setPhoneNo(alert.custPhnNo)"
                      oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                      :rules="validateRules.custPhnNo"
                      @keydown.enter.prevent
                    />
                    <p
                      v-if="!alert.custPhnNoChk"
                      class="pl-form-hint text-left is-txt-red " style="height:18px;"></p>
                    <p
                      v-else
                      class="pl-form-hint text-left is-txt-red ">
                      전화번호를 입력해 주세요.</p>
                  </div>
                </div>
              </div>
            </v-form>
          </div>
        </div>
      </div>

      <div class="pl-alert-btn">
        <template v-if="alert.type === 'confirm'">
          <v-btn
            v-if="alert.callYes"
            class="pl-btn is-sub"
            @click="alert.callNo">아니오</v-btn>
          <v-btn
            v-if="alert.callYes"
            class="pl-btn"
            @click="alert.callYes"
            :loading="alert.isloading"
            >
            예
          </v-btn>
        </template>
        <template v-if="alert.type !== 'confirm'">
          <v-btn ref="closeBtn" class="pl-btn is-sub" @click="closeAlert" >닫기</v-btn>
        </template>
      </div>
    </div>
  </v-dialog>
</template>

<script>
  import { mapState, mapGetters, mapMutations } from "vuex";

  export default {
    name: "CompoAlert",
    props: {
    },
    data() {
      return {
        validateRules: {
          downReason: [
            v => !!v || '다운로드 사유는 필수 입력 항목 입니다.',
          ],
          reason: [
            v => !!v || '사유는 필수 입력 항목 입니다.',
          ],
          custPhnNo: [
            v => !!v || '전화번호를 입력해 주세요.',
            v => (v && v.length <= 13) || '올바른 전화번호를 입력해 주세요.',
          ],
        }
      }
    },
    computed: {
      ...mapState({
        alert: (state) => state.alertStore.alert,
      }),
    },
    methods: {
      newLine(title) {
        if (!title) return;
        return title.split("\n").join("<br>");
      },
      closeAlert() {
        this.$store.commit("alertStore/hideAlert");
        try{ if(this.alert.callAfter != undefined) eval(this.alert.callAfter)(); }catch(e){console.log(e);}
      },
      setPhoneNo(val){
        let res = this.mixin_setPhoneNo(val.replace(/[^0-9]/g, ""));
        this.alert.custPhnNo = res;
      },
    },
    mounted() {
    },
  };
  </script>

<style>
.v-overlay__scrim {
  /* opacity: 0 !important; */
}
</style>
