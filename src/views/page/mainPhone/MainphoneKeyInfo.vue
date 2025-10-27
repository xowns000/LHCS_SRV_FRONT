<template>
  <div>
    <div class="pl-card-top">
      <strong class="pl-card-top-title">고객핵심 정보</strong>
      <div class="pl-btn-wrap ml-auto align-self-start" >
        <!-- 새로고침 버튼 -->
        <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          @btnClick="$emit('refresh')"
        ></compo-tooltip-btn>
        <!-- 리사이즈 토글 -->
        <compo-tooltip-btn
          :TitleProp=computedResizeText
          ClassProp="pl-tooltip-btn"
          :IconProp=computedResizeClass
          TooltipPositionProp="bottom"
          @btnClick="$emit('toggle')"
        ></compo-tooltip-btn>
      </div>
    </div>
    <div class="pl-card pb-0">
      <!-- card -->
      <div class="pl-mainphone-key-info-card-wrap">
        <div class="pl-mainphone-key-info-card">
          <div class="pl-mainphone-key-info-card-title">{{ DataProp.info1.title }}</div>
          <div class="pl-mainphone-key-info-card-desc">
            <v-icon :class="`pl-icon30 ${ DataProp.info1.icon }`"></v-icon>
            <div>
              <div class="pl-mainphone-key-info-card-desc-subject">{{ DataProp.info1.name }}</div>
              <div class="pl-mainphone-key-info-card-desc-txt">{{ DataProp.info1.desc }}</div>
            </div>
          </div>
        </div>
        <div class="pl-mainphone-key-info-card">
          <div class="pl-mainphone-key-info-card-title">{{ DataProp.info2.title }}</div>
          <div class="pl-mainphone-key-info-card-desc">
            <v-icon :class="`pl-icon30 ${ DataProp.info2.icon }`"></v-icon>
            <div>
              <div class="pl-mainphone-key-info-card-desc-subject">{{ DataProp.info2.name }}</div>
              <div class="pl-mainphone-key-info-card-desc-txt">{{ DataProp.info2.desc }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- info 3 -->
      <div class="pl-mainphone-key-info-list-wrap">
        <div class="pl-mainphone-key-info-list type-01">
          <div class="pl-mainphone-key-info-list-unit">
            <div class="pl-mainphone-key-info-list-title">고객만족도</div>
            <div class="pl-mainphone-key-info-list-desc">고마우신 분</div>
            <div class="pl-mainphone-key-info-list-r-info">
              {{ DataProp.info_list.satisfaction }}/ 5
              <div class="pl-star-rating">
                <div class="pl-star-rating-inner" :style="`width: ${ computedStartRating }%`"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="pl-mainphone-key-info-list type-02">
          <div class="pl-mainphone-key-info-list-unit">
            <div class="pl-mainphone-key-info-list-title">보유 포인트</div>
            <div class="pl-mainphone-key-info-list-desc">고마우신 고객</div>
            <div class="pl-mainphone-key-info-list-r-info">
              {{ DataProp.info_list.point.toLocaleString() }}
            </div>
          </div>
        </div>
        <div class="pl-mainphone-key-info-list type-03">
          <div class="pl-mainphone-key-info-list-unit">
            <div class="pl-mainphone-key-info-list-title">고객 이탈 예측
              ({{ DataProp.info_list.moveout }}%)
            </div>
            <div class="pl-mainphone-key-info-list-desc">
              <div class="pl-monitor-progress my-1">
                <div class="pl-monitor-progress-bar" :style="`width: ${ DataProp.info_list.moveout }%`"></div>
              </div>
              활동 빈도가 낮아지고 있습니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Mainphone_key_info", //name은 'MENU_' + 파일명 조합
    props: {
      DataProp: {
        type: Object
      },
      ResizeProp: {
        type: Boolean,
        default: false
      },
    },
    components: {
    },
    data() {
      return {

      }
    },
    methods: {

    },
    mounted() {
    },
    created() {
    },
    computed: {
      computedResizeClass() {
        return this.ResizeProp === true ? 'pl-icon20 resize-on' : 'pl-icon20 resize-off'
      },
      computedResizeText() {
        return this.ResizeProp === true ? '축소' : '확대'
      },
      computedStartRating() {
        const value = this.DataProp.info_list.satisfaction / 5 * 100;
        return value;
      },
    },
    watch: {
    },
  };
</script>

<style lang="scss" scoped>

</style>