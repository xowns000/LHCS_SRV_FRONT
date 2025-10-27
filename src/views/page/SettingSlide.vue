<template>
   <div class="pl-setting-slide">
    <v-tabs class="pl-tabs" v-model="tab">
      <v-tab>UI 설정</v-tab>
      <v-tab v-if="$store.getters['userStore/GE_USER_ROLE'].atrtGroupId === '1' || $store.getters['userStore/GE_USER_ROLE'].atrtGroupId === '2'">환경설정</v-tab>
      <!-- //mark: UI설정 -->
      <v-tab-item>
        <div>
          <h2 class="pl-subtit is-mt-l">테마 변경</h2>
          <p class="is-txt-sub mt-1">컬러 테마를 변경할 수 있습니다</p>

          <!-- mark: 컬러변경  -->
          <div class="pl-swatch-board is-mt-m pb-4">
            <span
              v-for="item in swatchThemes"
              :key="item.id"
              :style="`background-color: ${ item.color }; cursor: pointer; height: 40px; width: 40px; borderRadius: 4px;`"
              :class="{ 'swatch-active': primaryColor === item.color }"
              @click="themeChange(item)"
            ></span>
            <div class="d-flex">
              <v-menu v-model="dropChgClr" bottom nudge-bottom="30" nudge-left="16" :close-on-content-click="false">
                <template v-slot:activator="{ on }">
                  <div class="pl-swatch-eyedropper">
                    <div :style="swatchStyle" v-on="on" />
                    <v-icon>mdi-eyedropper</v-icon>
                  </div>
                </template>
                <div>
                  <v-color-picker
                    v-model="chgClr"
                    flat
                    hide-inputs
                    mode="hexa" />
                </div>
              </v-menu>
            </div>
          </div>
          <!-- mark: 채팅창 글자 설정 -->
          <h2 class="pl-subtit is-mt-l">채팅창 글자 설정</h2>
          <p class="is-txt-sub mt-1">채팅창의 글자 크기를 변경할 수 있습니다</p>
          <div class="d-flex align-center col-12 pa-0 is-mt-l pb-2 pr-2">
            <v-icon class="pl-icon20 is-drag-icon-text mr-4 "></v-icon>
            <vue-slider
              v-model="chatFontSize"
              :min=10
              :max=18
              :interval=1
              width="calc(100% - 46px)"
              height="2px"
            />
          </div>
          <!-- mark: 전화상담 form 설정 -->
          <h2 class="pl-subtit is-mt-l d-flex">
            고객정보 유지
            <v-switch v-model="saveAftrCustMaintainYn" class="ml-auto">
            </v-switch>
          </h2>
          <p class="is-txt-sub mt-1">전화 상담내용 저장 후 고객 정보 유지 여부를 설정할 수 있습니다.</p>
          <!-- mark: 단축키 설정 -->
          <template v-if="settingKeyEnable">
            <h2 class="pl-subtit is-mt-l">단축키 설정</h2>
            <p class="is-txt-sub mt-1">자주쓰는 메뉴를 단축키에 할당 할 수 있습니다</p>
            <div class="is-mt-m">
              <div class="pl-form-inline-wrap" style="flex-wrap: wrap;">
                <div
                  class="pl-form-inline"
                  style="width: calc(50% - 12px); gap: 12px"
                  v-for="keybox in settingKey"
                  :key="keybox.id">
                  <span class="pl-label pt-0 d-flex align-center" style="flex: 0; width: 75px;">
                    <span class="pl-boxkey">ALT</span> +
                    <v-text-field
                      :value="keybox.keycode"
                      :disabled="keybox.lock === true"
                      class="pl-form"
                      style="flex: 0 0 30px"
                      maxlength="1"
                      @input="updateKeycode(keybox, $event)"
                      @focus="$event.target.select()"
                    />
                  </span>
                  <div class="pl-desc">
                    <div class="d-flex">
                      <v-select
                        :value="shortcutSettingArr[keybox.id]"
                        :disabled="keybox.disabled"
                        class="pl-form flex-grow-1"
                        :items="shortcutSettingArr"
                        item-text="title"
                        item-value="path"
                        placeholder="선택하세요"
                        @input="updatePath(keybox, $event)"
                      ></v-select>
                      <!-- <v-text-field
                        :disabled="item.model === '/home'"
                        :value="item.model"
                        class="pl-form flex-grow-1"
                        :rules="[rules.required, rules.path]"
                        @input="updateModel(item, $event)"
                      /> -->
                      <!-- <v-btn
                        :disabled="keybox.lock === true"
                        class="pl-btn is-sub ml-2"
                        @click="setAssignKeycode(settingKey)"
                        >할당</v-btn> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </v-tab-item>
      <!-- //mark: 환경설정 -->
      <v-tab-item>
        <div>
          <template v-for="(setData, idx) in Object.keys($store.getters['commonStore/GE_CUSTCO_SETTING'])">
            <template v-if="$store.getters['userStore/GE_USER_ROLE'].atrtGroupId === '1' || $store.getters['userStore/GE_USER_ROLE'].atrtGroupId === '2'">
              <template v-if="$store.getters['userStore/GE_USER_ROLE'].userId === '1'"><!-- 슈퍼 관리자인 경우-->
                <template v-if="setData === 'ENV_TMPL_TP'"><!--템플릿 변경-->
                  <h2 class="pl-subtit is-mt-l" :key="`${idx}_tmpl_h2`">{{ $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_NM }}</h2>
                  <p class="is-txt-sub mt-1" :key="`${idx}_tmpl_p`">{{ $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_EXPLN }}</p>
                  <div :key="`${idx}_tmpl_div`">
                    <v-select
                      v-model="$store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL"
                      class="pl-form is-auto is-mt-s"
                      :items="itemsTemplateLayout"
                      placeholder="선택하세요"
                      @change="changeSetting($store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_COL_ID, $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL.toString())"
                    ></v-select>
                  </div>
                  <div class="pl-template-layout-view is-mt-s" :key="`${idx}_tmpl_img`">
                    <img
                      :src="itemsTemplateLayout[($store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL === 'DEFAULT'? 1 : 2) - 1].img"
                      :alt="itemsTemplateLayout[($store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL === 'DEFAULT'? 1 : 2) - 1].text">
                  </div>
                </template>
                <template v-else-if="$store.getters['commonStore/GE_CUSTCO_SETTING'][setData].DATA_TYPE_CD === 'TXT'"><!--문자형-->
                  <h2 class="pl-subtit is-mt-l" :key="`${idx}_txt_h2`">{{ $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_NM }}</h2>
                  <div :key="`${idx}_txt_div`">
                    <v-text-field
                      v-model="$store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL"
                      class="pl-form is-auto is-mt-s"
                      placeholder="입력하세요."
                      @change="changeSetting($store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_COL_ID, $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL.toString())"
                    ></v-text-field>
                  </div>
                  <p class="is-txt-sub mt-1" :key="`${idx}_txt_p`" v-html="mixin_encodeEnter(mixin_replaceDoubleBackslashNewLine($store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_EXPLN))"></p>
                </template>
                <template v-else><!--스위치형-->
                  <template v-if="setData === 'ENV_CUST_SIMPLE_CERT_USE_YN'"><!--본인인증(간편인증)-->
                    <template v-if="mixin_getCustcoSrvcStat('OMNIONE')">
                      <h2 class="pl-subtit is-mt-l d-flex" :key="`${idx}_switch_h2`">
                        {{ $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_NM }}
                        <v-switch
                          v-model="$store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL"
                          class="ml-auto"
                          :ref="`${$store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_COL_ID}`"
                          false-value="N"
                          true-value="Y"
                          @click="changeSetting($store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_COL_ID, $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL.toString())"
                        >
                        </v-switch>
                      </h2>
                      <p class="is-txt-sub mt-1" :key="`${idx}_switch_p`">{{ $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_EXPLN }}</p>
                    </template>
                  </template>
                  <template v-else>
                    <h2 class="pl-subtit is-mt-l d-flex" :key="`${idx}_switch_h2`">
                      {{ $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_NM }}
                      <v-switch
                        v-model="$store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL"
                        class="ml-auto"
                        :ref="`${$store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_COL_ID}`"
                        false-value="N"
                        true-value="Y"
                        @click="changeSetting($store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_COL_ID, $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL.toString())"
                      >
                      </v-switch>
                    </h2>
                    <p class="is-txt-sub mt-1" :key="`${idx}_switch_p`">{{ $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_EXPLN }}</p>
                  </template>
                </template>
              </template>
              <template v-else><!-- 시스템 관리자인 경우(고객사 시스템 관리자 권한 사용자는 설정 가능) -->
                <template v-if="setData === 'ENV_CLBK_YN' || setData === 'ENV_RESERVECALL_YN'"><!--콜백, 예약콜-->
                  <h2 class="pl-subtit is-mt-l d-flex" :key="`${idx}_h2`">
                    {{ $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_NM }}
                    <v-switch
                      v-model="$store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL"
                      class="ml-auto"
                      :ref="`${$store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_COL_ID}`"
                      false-value="N"
                      true-value="Y"
                      @click="changeSetting($store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_COL_ID, $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL.toString())"
                    >
                    </v-switch>
                  </h2>
                  <p class="is-txt-sub mt-1" :key="`${idx}_p`">{{ $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_EXPLN }}</p>
                </template>
              </template>
            </template>
          </template>
        </div>
      </v-tab-item>
    </v-tabs>
   </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
export default {
  name: 'SettingSlide',
  components: {
    tab : {type: Number , default: 0},
  },
  mixins: [],
  props: {

  },
  data() {
    return {
      // 컬러 변경 test
      dropChgClr: false,
      swatchThemes: [
        { color: '#4C5CBB' },
        { color: '#6A5493' },
        { color: '#003668' },
        { color: '#0CAA22' },
        { color: '#035C58' },

        { color: '#108195' },
        { color: '#DD4F7A' },
        { color: '#FD5C31' },
        { color: '#000' },
      ],
      itemsTemplateLayout: [
        { text: '기본', value: 'DEFAULT', img: require('@/assets/img/layout01.png') },
        { text: '기타', value: 'ETC', img: require('@/assets/img/layout02.png') },
      ],
      // 단축키
      settingKeyEnable: false,
      shortcutSettingArr: [],
      // rules: {
      //   required: value => !!value || 'Required.',
      //   path: value => {
      //     const pattern = /\/[A-Z]{3}_[A-Z]\d{4}/g;
      //     return pattern.test(value) || '잘못된 형식입니다'
      //   },
      // },

      tab : 0,

      CUSTO_SETTING_LIST : [],
    }
  },
  watch:{
    tab(){
      this.$nextTick(()=>{
        if(this.tab === 1){
          this.$eventBus.$emit('initSettingEnv');
        }
      });
    }
  },
  created() {
  },
  mounted() {
    this.formattedSettingKey();

  },
  computed: {
    ...mapGetters({
      primaryColor: 'commonStore/GE_COMMON_PRIMARYCOLOR',
      settingCuslForm: 'statStore/GE_SETTING_CUSL_FORM'
    }),
    swatchStyle() {
      const { chgClr, dropChgClr } = this;
      return {
        backgroundColor: chgClr,
        cursor: 'pointer',
        height: '40px',
        width: '40px',
        borderRadius: dropChgClr ? '50%' : '4px',
        transition: 'border-radius 200ms ease-in-out'
      }
    },
    chgClr: {
      get() {
        return this.$store.getters['commonStore/GE_COMMON_PRIMARYCOLOR'];
      },
      set(newColor) {
        this.$store.dispatch('commonStore/AC_CHANGE_PRIMARYCOLOR', newColor);
      },
    },
    chatFontSize: {
      get() {
        return this.$store.getters['commonStore/GE_COMMON_SETTING_FONTSIZE'];
      },
      set(size) {
        this.$store.dispatch('commonStore/AC_COMMON_SETTING_FONTSIZE', size);
      },
    },
    settingKey: {
      get() {
        return this.$store.getters['commonStore/GE_COMMON_SETTING_SHORTCUT'];
      },
      set(data) {
        // this.$store.dispatch('commonStore/AC_COMMON_SETTING_SHORTCUT', data);
      },
    },
    saveAftrCustMaintainYn: {
      get() {
        return this.$store.getters['userConfigStore/GE_SAVE_AFTR_CUST_MAINTAIN'];
      },
      set(val) {
        this.$store.dispatch('userConfigStore/AC_SAVE_AFTR_CUST_MAINTAIN', val);
      },
    },
  },
  methods: {
    // 컬러 테마 변경
    themeChange(theme) {
      this.$store.dispatch('commonStore/AC_CHANGE_PRIMARYCOLOR', theme.color);
    },
    // 단축키 설정
    updateKeycode(item, value) {
      item.keycode = value;
      // this.setAssignKeycode(this.settingKey);
    },
    updatePath(item, value) {
      item.path = value;
      // this.setAssignKeycode(this.settingKey);
    },
    /* setAssignKeycode(val){
      this.$store.dispatch('commonStore/AC_COMMON_SETTING_SHORTCUT', val);
    }, */
    formattedSettingKey() {
      const filteredSettingShortcut = this.$store.getters['commonStore/GE_COMMON_SETTING_SHORTCUT'];

      const mappedSettings = filteredSettingShortcut.map(item => {
        return {
          id: item.id,
          keycode: item.keycode,
          path: item.path,
          title: item.title,
          disabled: item.disabled,
        };
      });
      return this.shortcutSettingArr = mappedSettings;
    },

    //환경설정 셋팅 변경
    changeSetting(target, val){
      let response = this.common_postCall('/api/setting/env/updateSettingEnv', {EXPSN_ATTR_COL_ID: target, ATTR_VL: val}, {head: {}});
      this.mixin_push_custco_env(); //환경설정 정보 해당 스키마 사용자에게 PUSH
    }
  },

};
</script>
<style scoped>

</style>