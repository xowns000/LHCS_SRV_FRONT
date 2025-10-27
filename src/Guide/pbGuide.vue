<template >
	<v-app >
		<v-fab-transition>
			<v-btn
				v-show="scrlTopBtn"
				fab
				small
				dark
				fixed
				bottom
				right
				color="deep-orange"
				@click="scrlToTop">
				<i class="icon-arrow-up"></i>
			</v-btn>
		</v-fab-transition>
		<v-navigation-drawer v-model="drawer" fixed width="280" permanent class="guide-nav-frame">
			<v-list-item class="guide-header">
				<v-list-item-content>
					<v-list-item-title class="title">
						<span style="color: #3f51b5">Guide</span>
            <!-- <v-switch
              v-model="switch1"
              class="d-flex mt-2"
              :label="(switch1 == true ? '내부용' : '외부용')" /> -->
					</v-list-item-title>
					<v-list-item-subtitle>
						Palette
					</v-list-item-subtitle>
				</v-list-item-content>
			</v-list-item>

			<v-divider></v-divider>
			<v-list class="guide-nav" rounded>
				<v-list-group v-for="item in nav" :key="item.title" v-model="item.active" color="indigo" no-action >
					<template v-slot:activator>
						<v-list-item-content >
							<v-list-item-title v-text="item.title"></v-list-item-title>
						</v-list-item-content>
					</template>

					<v-list-item v-for="subItem in item.children" :key="subItem.title"
						:class="{ 'v-list-item--active': subItem.title == selected }"
						@click.stop="selected = subItem.title; menuClick(subItem.path)">
						<v-list-item-content>
							<v-list-item-subtitle v-text="subItem.title"></v-list-item-subtitle>
						</v-list-item-content>
					</v-list-item>
				</v-list-group>
			</v-list>
		</v-navigation-drawer>
		<div class="guide-main-frame" v-scroll.self="onScroll">
			<transition name="component-fade" mode="out-in">
				<component :is="component"  :SelectedProp="selected"></component>
			</transition>
		</div>
	</v-app>
</template>

<script>
import GuideInput from "@/Guide/GuideInput.vue";
import GuideTextarea from "@/Guide/GuideTextarea.vue";
import GuideButtons from "@/Guide/GuideButtons.vue";
import GuideDropdown from "@/Guide/GuideDropdown.vue";
import GuideControls from "@/Guide/GuideControls.vue";
import GuideTabs from "@/Guide/GuideTabs.vue";
import GuidePickers from "@/Guide/GuidePickers.vue";
import GuideCalendar from "@/Guide/GuideCalendar.vue";
import GuideGrid from "@/Guide/GuideGrid.vue";
import GuideToastGrid from "@/Guide/GuideToastGrid.vue";
import GuideAlert from "@/Guide/GuideAlert.vue";
import GuideTooltip from "@/Guide/GuideTooltip.vue";
import GuideDialog from "@/Guide/GuideDialog.vue";
import GuidePopup from "@/Guide/GuidePopup.vue";
import GuideTree from "@/Guide/GuideTree.vue";
import GuideChips from "@/Guide/GuideChips.vue";
import GuideTable from "@/Guide/GuideTable.vue";
import GuideCkeditor from "@/Guide/GuideCkeditor.vue";
import GuideDragDrop from "@/Guide/GuideDragDrop.vue";
import GuideExcel from "@/Guide/GuideExcel.vue";
import GuideProgress from "@/Guide/GuideProgress.vue";
import GuideChartJs from "@/Guide/GuideChartJs.vue";
import GuideFileupload from "@/Guide/GuideFileupload.vue";
import GuideList from "@/Guide/GuideList.vue";
import GuideHeader from "@/Guide/GuideHeader.vue";
import GuideText from "@/Guide/GuideText.vue";
import GuideSlider from "@/Guide/GuideSlider.vue";

export default {
	name: "pbGuide",
	components: {
		GuideInput,
		GuideButtons,
		GuideTextarea,
		GuideDropdown,
		GuideControls,
		GuideTabs,
		GuidePickers,
		GuideCalendar,
		GuideGrid,
		GuideToastGrid,
		GuideAlert,
		GuideTooltip,
		GuideDialog,
		GuidePopup,
		GuideTree,
    GuideChips,
    GuideTable,
    GuideCkeditor,
    GuideDragDrop,
    GuideExcel,
    GuideProgress,
    GuideChartJs,
    GuideFileupload,
    GuideList,
    GuideHeader,
    GuideText,
    GuideSlider,
	},
	data() {
		return {
			drawer: true,
			component: "GuideInput",
			selected: 'Input',
			nav: [
				{
					title: 'Components',
					active: true,
					children: [
						{ title: 'Input', path: 'GuideInput' },
						{ title: 'Textarea', path: 'GuideTextarea' },
						{ title: 'Dropdown', path: 'GuideDropdown' },
						{ title: 'Check & Radio', path: 'GuideControls' },
						{ title: 'Slider', path: 'GuideSlider' },
						{ title: 'Buttons', path: 'GuideButtons' },
						{ title: 'Tag', path: 'GuideChips' },
						{ title: 'Tabs', path: 'GuideTabs' },
						{ title: 'Pickers', path: 'GuidePickers' },
						// { title: 'Calendar', path: 'GuideCalendar' },
						{ title: 'Grid', path: 'GuideGrid' },
						{ title: 'TOAST UI - Grid', path: 'GuideToastGrid' },
						// { title: 'Table', path: 'GuideTable' },
						{ title: 'Alert / Toast', path: 'GuideAlert' },
						{ title: 'Tooltip', path: 'GuideTooltip' },
						{ title: 'Dialog', path: 'GuideDialog' },
						// { title: 'Window Popup', path: 'GuidePopup' },
						{ title: 'Tree Menu', path: 'GuideTree' },
						{ title: 'Ck Editor', path: 'GuideCkeditor' },
						{ title: 'Drag&Drop', path: 'GuideDragDrop' },
						{ title: 'FileUpload / FileGrid', path: 'GuideFileupload' },
						{ title: 'Excel up/down', path: 'GuideExcel' },
						{ title: 'Progress bar', path: 'GuideProgress' },
						{ title: 'ChartJs', path: 'GuideChartJs' },
					],
				},{
          title: 'Pattern',
					active: true,
					children: [
            { title: 'Text Info', path: 'GuideText' },
            { title: 'List', path: 'GuideList' },
            { title: 'Header', path: 'GuideHeader' },
          ],
        }
			],
      switch1: true,
			scrlTopBtn: false,
			// scrollTop: 0,
			// target: null,
		};
	},

	computed: {
	},
	methods: {
		onScroll(e) {
      e.target.scrollTop > 50 ? this.scrlTopBtn = true : this.scrlTopBtn = false;
    },
    scrlToTop() {
      this.scrollTarget = document.querySelector(
        ".guide-main-frame"
      );

      if (this.scrollTarget) {
        this.scrollTarget.scrollTop = 0;
      }
    },
		menuClick: function (path) {
			this.component = path;
			this.scrlToTop();
		}
	},

	beforeDestroy() {
	},
  watch:{
    switch1(val){
      val === false ? this.$router.push('pbGuide') : this.$router.push('guide');
    }
  },
	mounted() {
	}

};
</script>
<style scoped>
.v-list-item__content{
  padding: 5px 0;
}
.v-list-item .v-list-item__subtitle{
  line-height: 1.4;
}
</style>
<style >

.v-btn--round,
.v-btn--round::after{
	border-radius: 50%;
}
.icon-arrow-up{
	width: 20px;
	height: 20px;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFF' d='M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z' /%3E%3C/svg%3E");
}
.is-bg-red {
  background-color: #f26161 !important;
}
.is-bg-org {
  background-color: #fc8722 !important;
}
.is-bg-yellow {
  background-color: #fac219 !important;
}
.is-bg-blue {
  background-color: #4e94e9 !important;
}
.is-bg-cyan {
  background-color: #40cee2 !important;
}
.is-bg-indigo {
  background-color: #3F51B5 !important;
}
.is-bg-blueGray {
  background-color: #607D8B !important;
}
.is-bg-green {
  background-color: #24b36b !important;
}
.is-bg-purple {
  background-color: #9c67f9 !important;
}
.is-bg-black {
  background-color: #000 !important;
}
.is-bg-gray {
  background-color: #999 !important;
}
.is-bg-white {
  background-color: #fff !important;
}
.is-bg-light {
  background-color: #f0f5f9 !important;
}
.is-bg-pink {
  background-color: #ffccd0 !important;
}

.is-bg-light-red {
  background-color: rgba(242, 97, 97, 0.1) !important;
}
.is-bg-light-org {
  background-color: rgba(252, 135, 34, 0.1) !important;
}
.is-bg-light-yellow {
  background-color: rgba(250, 194, 25, 0.2) !important;
}
.is-bg-light-blue {
  background-color: rgba(78, 148, 233, 0.1) !important;
}
.is-bg-light-cyan {
  background-color: rgba(64, 206, 226, 0.1) !important;
}
.is-bg-light-indigo {
  background-color: rgba(63, 81, 181, 0.1) !important;
}
.is-bg-light-green {
  background-color: rgba(36, 179, 107, 0.15) !important;
}
.is-bg-light-purple {
  background-color: rgba(156, 103, 249, 0.1) !important;
}

.is-border-red {
  border-color: #f26161 !important;
}
.is-border-org {
  border-color: #fc8722 !important;
}
.is-border-yellow {
  border-color: #fac219 !important;
}
.is-border-blue {
  border-color: #4e94e9 !important;
}
.is-border-cyan {
  border-color: #40cee2 !important;
}
.is-border-indigo {
  border-color: #3F51B5 !important;
}
.is-border-blueGray {
  border-color: #607D8B !important;
}
.is-border-green {
  border-color: #24b36b !important;
}
.is-border-purple {
  border-color: #9c67f9 !important;
}
.is-border-black {
  border-color: #000 !important;
}
.is-border-gray {
  border-color: #999 !important;
}
.is-border-white {
  border-color: #fff !important;
}
.is-border-light {
  border-color: #f0f5f9 !important;
}

.is-txt-red {
  color: #f04949 !important;
}
.is-txt-org {
  color: #fc7909 !important;
}
.is-txt-yellow {
  color: #f4b905 !important;
}
.is-txt-blue {
  color: #3786e6 !important;
}
.is-txt-cyan {
  color: #2ac8df !important;
}
.is-txt-indigo {
  color: #3849a2 !important;
}
.is-txt-blueGray {
  color: #566f7c !important;
}
.is-txt-green {
  color: #209e5e !important;
}
.is-txt-purple {
  color: #8c4ef8 !important;
}
.is-txt-black {
  color: #222 !important;
}
.is-txt-gray {
  color: #999 !important;
}
.is-txt-white {
  color: #fff !important;
}
.is-txt-bold {
  font-weight: 600 !important;
}
.is-txt-left {
  text-align: left !important;
}
.is-txt-left * {
  text-align: left !important;
}
.is-txt-right {
  text-align: right !important;
}
.is-txt-right * {
  text-align: right !important;
}
.is-txt-center {
  text-align: center !important;
}
.is-txt-center * {
  text-align: center !important;
}

.guide-gap {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px
}
.guide-gap.vertical {
  flex-direction: column;
  align-items: start;
}
.guide-nav-frame {
  transition: all 0.3s;
}
.guide-nav-frame.v-navigation-drawer {
  background-color: #f0f0f0;
}
.guide-nav-frame .v-navigation-drawer__content {
  display: flex;
  flex-direction: column;
}

.v-application--is-ltr .guide-nav {
  flex: 1 1 auto;
  min-height: 0;
  max-height: 100%;
  height: auto;
  overflow: auto;
  padding: 15px;
  font-family: "NotoKr";
  box-sizing: border-box;
}
.v-application--is-ltr .guide-nav .v-list-group__header.v-list-item--active:not(:hover):not(:focus):before {
  opacity: 0.12;
}
.v-application--is-ltr .guide-nav .v-list-item {
  min-height: 40px;
  padding: 0 12px 0 20px;
}
.v-application--is-ltr .guide-nav .v-list-item__title {
  font-size: 14px;
}
.v-application--is-ltr .guide-nav .v-list-group--no-action > .v-list-group__items > .v-list-item {
  min-height: 30px;
  margin-bottom: 0;
  padding-left: 40px;
}
.v-application--is-ltr .guide-nav .v-list-group--no-action > .v-list-group__items > .v-list-item:before {
  opacity: 0;
}
.v-application--is-ltr .guide-nav .v-list-group--no-action > .v-list-group__items > .v-list-item:last-child {
  margin-bottom: 15px;
}
.v-application--is-ltr .guide-nav .v-list-group--no-action > .v-list-group__items > .v-list-item.v-list-item--active .v-list-item__subtitle {
  color: #FF5722;
}
.v-application--is-ltr .guide-nav .v-list-group--no-action > .v-list-group__items > .v-list-item.v-list-item--active:before {
  opacity: 0;
}
.v-application--is-ltr .guide-nav .v-list-group--no-action > .v-list-group__items > .v-list-item .v-ripple__container {
  display: none;
}
.guide-hidden-link{
  position: relative;
  top: -40px;
  height: 40px;
}

.guide-header {
  flex: 0 0 auto;
  padding: 15px 20px !important;
  box-sizing: border-box;
}
.guide-header .v-list-item__title.title {
  font-size: 23px !important;
  letter-spacing: 0 !important;
  line-height: 1.4 !important;
  margin-bottom: 0 !important;
}

.guide-main-frame {
	overflow-y: scroll;
  width: 100%;
	height: 950px;
  padding-left: 280px;
  box-sizing: border-box;
}
.guide-main-frame .guide-content {
  padding: 20px 40px 40px;
  background: #fff;
}
.guide-main-frame .guide-content .guide-content-header {
  position: sticky;
  top: 0;
  left: 320px;
  right: 0;
  background: #FFF;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0;
  color: #999;
  z-index: 10;
}
.guide-main-frame .guide-content .guide-content-header i {
  position: relative;
  top: -1px;
  font-size: 17px;
}
.guide-main-frame .guide-content .guide-content-header span {
  color: #666;
}
.guide-main-frame .guide-content > h2 {
  margin: 25px 0 10px;
  font-family: 'NotoKr';
  font-weight: 700;
}
.guide-main-frame .guide-content > h2:first-of-type {
  margin-top: 20px;
}

.guide-card {
  /* overflow: hidden; */
  padding: 20px;
  border-radius: 6px;
  border: 1px solid #e2e2e4;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
}
.guide-card h6 {
  margin-bottom: 5px;
}
.guide-card.has-mssg {
  padding: 0;
  background-color: #ededed;
}

.guide-source {
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.guide-source .v-tabs {
  flex: 0 1 auto;
}
.guide-source .v-tabs-bar {
  height: 35px;
}
.guide-source .v-tabs-bar .v-tab {
  font-weight: 400;
  letter-spacing: 0;
}
.guide-source .v-tabs-bar .v-tab.v-tab--active {
  color: #FFF !important
}
.guide-source .theme--light.v-tabs-items {
  flex: 1 1 auto;
  overflow-y: auto;
  background-color: #edf1fa;
}

.guide-code, .guide-code-inline {
  width: 100%;
  /* Base color: saturation 0; */
  /* theme */
}
.guide-code code, .guide-code-inline code {
  background-color: transparent !important;
  box-shadow: none;
}
.guide-code code:before, .guide-code-inline code:before {
  display: none;
}
.guide-code .hljs, .guide-code-inline .hljs {
  display: block;
  overflow-x: auto;
  padding: 12px 15px;
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.8;
}
.guide-code .hljs,
.guide-code .hljs-subst, .guide-code-inline .hljs,
.guide-code-inline .hljs-subst {
  color: #444;
}
.guide-code .hljs-comment, .guide-code-inline .hljs-comment {
  color: #5c6370;
}
.guide-code .hljs-keyword,
.guide-code .hljs-attribute,
.guide-code .hljs-selector-tag,
.guide-code .hljs-meta-keyword,
.guide-code .hljs-doctag,
.guide-code .hljs-name, .guide-code-inline .hljs-keyword,
.guide-code-inline .hljs-attribute,
.guide-code-inline .hljs-selector-tag,
.guide-code-inline .hljs-meta-keyword,
.guide-code-inline .hljs-doctag,
.guide-code-inline .hljs-name {
  font-weight: 400;
}
.guide-code .hljs-type,
.guide-code .hljs-string,
.guide-code .hljs-number,
.guide-code .hljs-selector-id,
.guide-code .hljs-selector-class,
.guide-code .hljs-quote,
.guide-code .hljs-template-tag,
.guide-code .hljs-deletion, .guide-code-inline .hljs-type,
.guide-code-inline .hljs-string,
.guide-code-inline .hljs-number,
.guide-code-inline .hljs-selector-id,
.guide-code-inline .hljs-selector-class,
.guide-code-inline .hljs-quote,
.guide-code-inline .hljs-template-tag,
.guide-code-inline .hljs-deletion {
  color: #880000;
}
.guide-code .hljs-title,
.guide-code .hljs-section, .guide-code-inline .hljs-title,
.guide-code-inline .hljs-section {
  color: #880000;
  font-weight: bold;
}
.guide-code .hljs-regexp,
.guide-code .hljs-symbol,
.guide-code .hljs-variable,
.guide-code .hljs-template-variable,
.guide-code .hljs-link,
.guide-code .hljs-selector-attr,
.guide-code .hljs-selector-pseudo, .guide-code-inline .hljs-regexp,
.guide-code-inline .hljs-symbol,
.guide-code-inline .hljs-variable,
.guide-code-inline .hljs-template-variable,
.guide-code-inline .hljs-link,
.guide-code-inline .hljs-selector-attr,
.guide-code-inline .hljs-selector-pseudo {
  color: #BC6060;
}
.guide-code .hljs-literal, .guide-code-inline .hljs-literal {
  color: #78A960;
}
.guide-code .hljs-built_in,
.guide-code .hljs-bullet,
.guide-code .hljs-code,
.guide-code .hljs-addition, .guide-code-inline .hljs-built_in,
.guide-code-inline .hljs-bullet,
.guide-code-inline .hljs-code,
.guide-code-inline .hljs-addition {
  color: #397300;
}
.guide-code .hljs-meta, .guide-code-inline .hljs-meta {
  color: #1f7199;
}
.guide-code .hljs-meta-string, .guide-code-inline .hljs-meta-string {
  color: #4d99bf;
}
.guide-code .hljs-emphasis, .guide-code-inline .hljs-emphasis {
  font-style: italic;
}
.guide-code .hljs-strong, .guide-code-inline .hljs-strong {
  font-weight: bold;
}
.guide-code .hljs, .guide-code-inline .hljs {
  color: #383a42;
  background: transparent;
}
.guide-code .hljs-comment,
.guide-code .hljs-quote, .guide-code-inline .hljs-comment,
.guide-code-inline .hljs-quote {
  color: rgba(0, 0, 0, 0.4);
}
.guide-code .hljs-meta, .guide-code-inline .hljs-meta {
  color: #5697d9;
}
.guide-code .hljs-doctag,
.guide-code .hljs-keyword,
.guide-code .hljs-formula, .guide-code-inline .hljs-doctag,
.guide-code-inline .hljs-keyword,
.guide-code-inline .hljs-formula {
  color: #4078f2;
}
.guide-code .hljs-section,
.guide-code .hljs-name,
.guide-code .hljs-selector-tag,
.guide-code .hljs-deletion,
.guide-code .hljs-subst, .guide-code-inline .hljs-section,
.guide-code-inline .hljs-name,
.guide-code-inline .hljs-selector-tag,
.guide-code-inline .hljs-deletion,
.guide-code-inline .hljs-subst {
  color: #5697d9;
}
.guide-code .hljs-literal, .guide-code-inline .hljs-literal {
  color: #0184bb;
}
.guide-code .hljs-string,
.guide-code .hljs-regexp,
.guide-code .hljs-addition,
.guide-code .hljs-meta-string, .guide-code-inline .hljs-string,
.guide-code-inline .hljs-regexp,
.guide-code-inline .hljs-addition,
.guide-code-inline .hljs-meta-string {
  color: #e06c75;
}
.guide-code .hljs-built_in,
.guide-code .hljs-class .hljs-title, .guide-code-inline .hljs-built_in,
.guide-code-inline .hljs-class .hljs-title {
  color: #d98d41;
}
.guide-code .hljs-attr,
.guide-code .hljs-variable,
.guide-code .hljs-template-variable,
.guide-code .hljs-type,
.guide-code .hljs-selector-class,
.guide-code .hljs-selector-attr,
.guide-code .hljs-selector-pseudo,
.guide-code .hljs-number, .guide-code-inline .hljs-attr,
.guide-code-inline .hljs-variable,
.guide-code-inline .hljs-template-variable,
.guide-code-inline .hljs-type,
.guide-code-inline .hljs-selector-class,
.guide-code-inline .hljs-selector-attr,
.guide-code-inline .hljs-selector-pseudo,
.guide-code-inline .hljs-number {
  color: #d98d41;
}
.guide-code .hljs-symbol,
.guide-code .hljs-bullet,
.guide-code .hljs-link,
.guide-code .hljs-selector-id,
.guide-code .hljs-attribute,
.guide-code .hljs-title, .guide-code-inline .hljs-symbol,
.guide-code-inline .hljs-bullet,
.guide-code-inline .hljs-link,
.guide-code-inline .hljs-selector-id,
.guide-code-inline .hljs-attribute,
.guide-code-inline .hljs-title {
  color: #4078f2;
}
.guide-code .hljs-emphasis, .guide-code-inline .hljs-emphasis {
  font-style: normal;
}
.guide-code .hljs-strong, .guide-code-inline .hljs-strong {
  font-weight: bold;
}
.guide-code .hljs-link, .guide-code-inline .hljs-link {
  text-decoration: underline;
}
.guide-code .hljs-tag, .guide-code-inline .hljs-tag {
  color: #9e9e9e;
}

.guide-code-inline {
  width: auto;
}

ul.list-icon {
  display: inline-flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 20px 25px 20px 0;
  border-radius: 4px;
  border: 1px solid #e2e2e4;
  background: #fff;
  box-sizing: border-box;
}
ul.list-icon li {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  width: calc(50% - 25px);
  margin-left: 25px;
  padding: 5px 0;
  box-sizing: border-box;
}
@media (min-width: 1600px) {
  ul.list-icon li {
    width: calc(33.3333333333% - 25px);
  }
}

.tbl-border {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border-top: 1px solid #c4c6c8;
  border-bottom: 1px solid #c4c6c8;
}
.tbl-border thead th {
  position: relative;
  height: 40px;
  padding: 0;
  background-color: #f5f7fa;
  border-bottom: 1px solid #c4c6c8;
  border-left: 1px solid #e0e0e0;
  text-align: center;
  vertical-align: middle;
  font-size: 13px;
  color: #444;
}
.tbl-border thead tr *:first-child {
  border-left: 0;
}
.tbl-border tbody th {
  position: relative;
  padding: 5px;
  background-color: #fafbfc;
  border-bottom: 1px solid #ebebeb;
  border-left: 1px solid #ebebeb;
  text-align: center;
  vertical-align: middle;
  font-size: 12px;
  color: #444;
}
.tbl-border tbody th.required:before {
  top: 13px;
  left: 13px;
}
.tbl-border tbody th button.btn-icon {
  position: absolute;
  top: 4px;
  right: 5px;
}
.tbl-border tbody td {
  height: 40px;
  padding: 5px 5px 5px 10px;
  background: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  border-left: 1px solid rgba(0, 0, 0, 0.08);
  text-align: left;
  vertical-align: middle;
}
.tbl-border tbody td > * {
  float: left;
}
.tbl-border tbody td span.value {
  display: block;
  font-size: 12px;
  color: #444;
}
.tbl-border tbody td + td {
  padding-left: 0;
}
.tbl-border tbody td + td > .info-txt {
  margin-left: 3px;
}
.tbl-border tbody td + th.required:before {
  left: 13px;
}
.tbl-border tbody td .cols {
  align-items: center;
}
.tbl-border tbody td .group {
  height: 100%;
  padding-top: 4px;
}
.tbl-border tbody tr:last-of-type th {
  border-bottom: 0 none;
}
.tbl-border tbody tr:last-of-type td {
  padding-bottom: 5px;
  border-bottom: 0 none;
}
.tbl-border tbody tr *:first-child {
  border-left: 0;
}
.component-fade-enter-active,
.component-fade-leave-active {
	transition: opacity .3s ease;
}

.component-fade-enter,
.component-fade-leave-to {
	opacity: 0;
}

.guide-code,
.guide-code-inline {
  overflow: auto;
  width: 100%;
  max-height: 500px;
  border-radius: 0 0 4px 4px;
}

.guide-code code,
.guide-code-inline code {
  -webkit-box-shadow: none;
  box-shadow: none;
}

.guide-code code:before,
.guide-code-inline code:before {
  display: none;
}

.guide-code-inline {
  width: auto;
}

.guide-code code.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em;
}

.guide-code code.hljs {
  padding: 12px;
}

.guide-code .hljs {
  color: #abb2bf !important;
  background: #282c34 !important;
}

.guide-code .hljs-comment,
.guide-code .hljs-quote {
  color: #5c6370;
  font-style: italic;
}

.guide-code .hljs-doctag,
.guide-code .hljs-formula,
.guide-code .hljs-keyword {
  color: #c678dd;
}

.guide-code .hljs-deletion,
.guide-code .hljs-name,
.guide-code .hljs-section,
.guide-code .hljs-selector-tag,
.guide-code .hljs-subst {
  color: #e06c75;
}

.guide-code .hljs-literal {
  color: #56b6c2;
}

.guide-code .hljs-addition,
.guide-code .hljs-attribute,
.guide-code .hljs-meta .hljs-string,
.guide-code .hljs-regexp,
.guide-code .hljs-string {
  color: #98c379;
}

.guide-code .hljs-attr,
.guide-code .hljs-number,
.guide-code .hljs-selector-attr,
.guide-code .hljs-selector-class,
.guide-code .hljs-selector-pseudo,
.guide-code .hljs-template-variable,
.guide-code .hljs-type,
.guide-code .hljs-variable {
  color: #d19a66;
}

.guide-code .hljs-bullet,
.guide-code .hljs-link,
.guide-code .hljs-meta,
.guide-code .hljs-selector-id,
.guide-code .hljs-symbol,
.guide-code .hljs-title {
  color: #61aeee;
}

.guide-code .hljs-built_in,
.guide-code .hljs-class .hljs-title,
.guide-code .hljs-title.class_ {
  color: #e6c07b;
}

.guide-code .hljs-emphasis {
  font-style: italic;
}

.guide-code .hljs-strong {
  font-weight: 700;
}

.guide-code .hljs-link {
  text-decoration: underline;
}

</style>