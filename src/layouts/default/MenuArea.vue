<template>
  <v-navigation-drawer
    v-bind="$attrs"
    class="layout-gnb-side"
    :value="value"
    @input="$emit('input', $event)"
    absolute
    temporary
    color="#EBEBEB"
  >
  <!--메뉴 검색 -->
  <div class="pl-menu-autosearch">
    <v-autocomplete
      v-model="menu_search"
      :items="flattenedMenu"
      :item-text="formatSearchItem"
      placeholder="메뉴 검색"
      :menu-props="{closeOnClick: true,}"
      >
      <template v-slot:item="data">
        <v-list-item
          :key="data.item.PATH_NM"
          link
          @click="mixin_set_active_tab(data.item)"
          @keydown.native.enter="mixin_set_active_tab(data.item)"
          >
          <v-list-item-title class="d-flex">{{data.item.NODE_TITLE}}
            <span
              style="font-size: 11px;"
              class="is-txt-disable ml-auto">
              {{data.item.PATH_NM.replace('/', '')}}
            </span>
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-autocomplete>
  </div>
    <v-list dense nav class="menu-list">
      <template v-for="(item, index) in user_menu">
        <!-- {{ user_menu }} -->
        <!-- 하위메뉴가 있으면... -->
        <!-- v-if="item.items && checkUserRole(item.id, user_menu) === true" -->
        <menu-group-list
          v-if="item.child"
          :key="`item-${index}`"
          :item="item"
          :user_menu="user_menu"
        />
        <!-- 하위메뉴가 없으면... -->
        <!-- v-else-if="checkUserRole(item.id, user_menu) === true" -->
        <menu-list
          v-else
          :key="`item-${index}`"
          :item="item"
          :user_menu="user_menu"
        />
      </template>
    </v-list>

    <!-- 개발시에만 사용하는 메뉴 -->
    <v-list  dense nav class="menu-list">
      <template v-for="(item, index) in user_menu_dev">
        <v-list-group
          :prepend-icon="`pl-icon-gnb ${ item.ICON_CLASS_NM }`"
          :key="item.NODE_TITLE"
          v-if="item.child"
          color="none"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ item.NODE_TITLE }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <template v-for="(childItem, index) in item.child">
            <v-list-item
              v-if="childItem.NODE_TITLE !== '가이드'"
              :key="childItem.NODE_TITLE"
              :to="childItem.PATH_NM"
              link
              color="none"
              class="transparent two-depth"
              sub-group
              no-action
              @click="setActiveTab(childItem)"
            >
              <!-- @click="openPop(child.to)" -->
              <v-list-item-content>
                <v-list-item-title>{{ childItem.NODE_TITLE }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-else
              color="none"
              class="transparent two-depth"
              sub-group
              no-action
              @click="LinkToNewTab()"
            >
              <!-- @click="openPop(child.to)" -->
              <v-list-item-content>
                <v-list-item-title class="clr-error">{{ childItem.NODE_TITLE }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </template>
        </v-list-group>
      </template>
    </v-list>

    <v-dialog
      v-model="help_dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card tile>
        <!-- <v-toolbar flat dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Settings</v-toolbar-title>
        </v-toolbar> -->
        <v-card-title class="primary white--text" primary-title>
          <v-btn icon dark @click="closePop()" class="pr-4">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>프레임워크</v-toolbar-title>
        </v-card-title>
        <v-card-text>
          <!-- <Commend v-show="help_dialog_id === '/commend'"></Commend>
          <Layout v-show="help_dialog_id === '/layout'"></Layout>
          <Menual v-show="help_dialog_id === '/menual'"></Menual>
          <Guide v-show="help_dialog_id === '/guide'"></Guide>
          <Sample v-show="help_dialog_id === '/sample'"></Sample>
          <IaList v-show="help_dialog_id === '/iaList'"></IaList> -->
        </v-card-text>

        <div style="flex: 1 1 auto"></div>
      </v-card>
    </v-dialog>
  </v-navigation-drawer>
</template>

<script>
import MenuList from "./MenuList";
import MenuGroupList from "./MenuGroupList";
import DefaultLayout from "@/layouts/default/index";
import api from "../../store/apiUtil.js";

export default {
  name: "LayoutMenu",
  props: {
    value: Boolean,
  },
  components: {
    MenuList,
    MenuGroupList,
    // Commend,
    // Layout,
    // Menual,
    // Guide,
    // Sample,
    // IaList,
  },
  data: () => ({
    AUTH:"",
    menu_search: '',
    flattenedMenu: [],
    // items 옵션 설명
    //   title: aside에 보여지는 메뉴명 설정(iframe이 false인 경우 필수)
    //   icon: aside에 보여지는 아이콘 설정(iframe이 false인 경우 필수)
    //   to: aside에 보여진 후 클릭하면 이동할 링크 경로(iframe이 false인 경우 필수)
    //   iframe: 전체화면 또는 tab으로 보여질지 선택(true이면 tab으로 보여짐. default: true)
    //   id: 컴포넌트의 name 값 (iframe이 true인 경우 사용)
    //   tabIcon: tab에 보여질 아이콘 설정(iframe이 true인 경우 사용. 빈값인 경우 아이콘 생략)
    items: [
      // {
      //   id: "M01",
      //   title: "모니터링",
      //   icon: "svg-menu-m01",
      //   items: [
      //     {
      //       id: "M0101",
      //       title: "대시보드",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M010101",
      //           title: "전화 아웃바운드 대시보드",
      //           to: "/M010101",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M010102",
      //           title: "채팅 대시보드",
      //           to: "/M010102",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //     {
      //       id: "M0102",
      //       title: "상담 모니터링",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M010201",
      //           title: "전화 모니터링",
      //           to: "/M010201",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M010202",
      //           title: "채팅 상담사현황",
      //           to: "/M010202",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M010203",
      //           title: "채팅 상담사이석이력",
      //           to: "/M010203",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M010204",
      //           title: "채팅 상담중 현황 및 3자채팅",
      //           to: "/M010204",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   id: "M11",
      //   title: "상담",
      //   icon: "svg-menu-m02",
      //   items: [
      //     {
      //       id: "M1101",
      //       title: "상담 메인(전화 , 채팅)",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M110101",
      //           title: "상담 메인",
      //           to: "/M110101",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M110102",
      //           title: "채팅 상담 메인",
      //           to: "/M110102",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //     {
      //       id: "M1102",
      //       title: "상담이력",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M110201",
      //           title: "전화 상담이력 조회",
      //           to: "/M110201",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M110202",
      //           title: "전화 상담이력관리",
      //           to: "/M110202",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M110203",
      //           title: "전화 상담이력변경관리",
      //           to: "/M110203",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M110204",
      //           title: "채팅 상담이력 조회",
      //           to: "/M110204",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //     {
      //       id: "M1103",
      //       title: "콜백",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M110301",
      //           title: "콜백 조회",
      //           to: "/M110301",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M110302",
      //           title: "콜백 관리",
      //           to: "/M110302",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //     {
      //       id: "M1104",
      //       title: "아웃바운드",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M110401",
      //           title: "아웃바운드 등록",
      //           to: "/M110401",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M110402",
      //           title: "아웃바운드관리",
      //           to: "/M110402",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M110403",
      //           title: "사용자 근태",
      //           to: "/M110403",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M110404",
      //           title: "아웃바운드 사용자 배분",
      //           to: "/M110404",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M110405",
      //           title: "아웃바운드 단건 등록",
      //           to: "/M110405",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //     {
      //       id: "M1105",
      //       title: "예약콜",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M110501",
      //           title: "예약콜조회",
      //           to: "/M110501",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //     {
      //       id: "M1106",
      //       title: "스크립트",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M110601",
      //           title: "스크립트조회(기존 채팅스크립트)",
      //           to: "/M110601",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M110602",
      //           title: "스크립트관리",
      //           to: "/M110602",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M110603",
      //           title: "스크립트변경관리",
      //           to: "/M110603",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //     {
      //       id: "M1107",
      //       title: "전화기 설정",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M110701",
      //           title: "IP내선번호관리",
      //           to: "/M110701",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   id: "M21",
      //   title: "티켓",
      //   icon: "svg-menu-m03",
      //   items: [
      //     {
      //       id: "M2101",
      //       title: "전체티켓",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M210101",
      //           title: "나의 티켓",
      //           to: "/M210101",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M210102",
      //           title: "티켓관리",
      //           to: "/M210102",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   id: "M31",
      //   title: "QA상담평가",
      //   icon: "svg-menu-m04",
      //   items: [
      //     {
      //       id: "M3101",
      //       title: "평가항목설정",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M310101",
      //           title: "평가관리",
      //           to: "/M310101",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M310102",
      //           title: "QAA설정(담당자)",
      //           to: "/M310102",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //     {
      //       id: "M3102",
      //       title: "평가기획",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M310201",
      //           title: "평가기획마법사",
      //           to: "/M310201",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //     {
      //       id: "M3103",
      //       title: "평가실행",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M310301",
      //           title: "평가실행/결과",
      //           to: "/M310301",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   id: "M41",
      //   title: "LMS",
      //   icon: "svg-menu-m05",
      //   items: [
      //     {
      //       id: "M4101",
      //       title: "평가관리",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M410101",
      //           title: "평가관리",
      //           to: "/M410101",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M410102",
      //           title: "LMS 담당자",
      //           to: "/M410102",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //     {
      //       id: "M4102",
      //       title: "시험기획",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M410201",
      //           title: "시험기획마법사",
      //           to: "/M410201",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //     {
      //       id: "M4103",
      //       title: "시험실행",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M410301",
      //           title: "시험실행/결과",
      //           to: "/M410301",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //     {
      //       id: "M4104",
      //       title: "시험채점",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M410401",
      //           title: "시험채점",
      //           to: "/M410401",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   id: "M51",
      //   title: "지식관리",
      //   icon: "svg-menu-m06",
      //   items: [
      //     {
      //       id: "M5101",
      //       title: "지식분류 관리",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M510101",
      //           title: "지식컨텐츠분류관리",
      //           to: "/M510101",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //     {
      //       id: "M5102",
      //       title: "지식컨텐츠관리",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M510201",
      //           title: "지식 컨텐츠 현황",
      //           to: "/M510201",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //     {
      //       id: "M5103",
      //       title: "지식템플릿관리",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M510301",
      //           title: "지식 컨텐츠 템플릿 현황",
      //           to: "/M510301",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   id: "M61",
      //   title: "게시판",
      //   icon: "svg-menu-m07",
      //   items: [
      //     {
      //       id: "M6101",
      //       title: "게시판",
      //       icon: "",
      //       to: "/M6101",
      //       iframe: true,
      //     },
      //     {
      //       id: "M6102",
      //       title: "실시간공지사항",
      //       icon: "",
      //       to: "/M6102",
      //       iframe: true,
      //     },
      //   ],
      // },
      // {
      //   id: "M71",
      //   title: "통계",
      //   icon: "svg-menu-m08",
      //   items: [
      //     {
      //       id: "M7101",
      //       title: "전화상담통게",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M710101",
      //           title: "전화상담결과통게",
      //           to: "/M710101",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M710102",
      //           title: "전화상담유형별(시간대별)통계",
      //           to: "/M710102",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M710103",
      //           title: "전화아웃바운드통계",
      //           to: "/M710103",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M710104",
      //           title: "전화콜백통계",
      //           to: "/M710104",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //     {
      //       id: "M7102",
      //       title: "채팅상담통계",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M710201",
      //           title: "상담사별상담통계",
      //           to: "/M710201",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M710202",
      //           title: "문의유형별상담통계",
      //           to: "/M710202",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M710203",
      //           title: "상담유형별상담통계",
      //           to: "/M710203",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M710204",
      //           title: "날짜별상담통계",
      //           to: "/M710204",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M710205",
      //           title: "통합생산성통계",
      //           to: "/M710205",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //     {
      //       id: "M7103",
      //       title: "QA 통계/현황",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M710301",
      //           title: "평가현황",
      //           to: "/M710301",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //     {
      //       id: "M7104",
      //       title: "LMS통계",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M710401",
      //           title: "문항별통계",
      //           to: "/M710401",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M710402",
      //           title: "평가별통계",
      //           to: "/M710402",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   id: "M81",
      //   title: "설정",
      //   icon: "svg-menu-m09",
      //   items: [
      //     {
      //       id: "M8101",
      //       title: "상담유형관리",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M810101",
      //           title: "상담유형관리",
      //           to: "/M810101",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //     {
      //       id: "M8102",
      //       title: "고객정보관리",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M810201",
      //           title: "고객정보목록",
      //           to: "/M810201",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //     {
      //       id: "M8103",
      //       title: "휴일관리",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M810301",
      //           title: "채팅휴일관리",
      //           to: "/M810301",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //     {
      //       id: "M8104",
      //       title: "사용자관리",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M810401",
      //           title: "사용자관리",
      //           to: "/M810401",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M810402",
      //           title: "사용자 상세정보",
      //           to: "/M810402",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M810403",
      //           title: "사용자소속항목관리",
      //           to: "/M810403",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M810404",
      //           title: "사용자소속항목 상세정보",
      //           to: "/M810404",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //     {
      //       id: "M8105",
      //       title: "게시판관리",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M810501",
      //           title: "게시판생성관리",
      //           to: "/M810501",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //     {
      //       id: "M8106",
      //       title: "채팅 설정",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M810601",
      //           title: "메시지설정",
      //           to: "/M810601",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M810602",
      //           title: "문의유형관리",
      //           to: "/M810602",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M810603",
      //           title: "상담사별스킬관리",
      //           to: "/M810603",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M810604",
      //           title: "메신저연동관리",
      //           to: "/M810604",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M810607",
      //           title: "상담이미지관리",
      //           to: "/M810607",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M810608",
      //           title: "금칙어관리",
      //           to: "/M810608",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M810610",
      //           title: "시스템메시지관리",
      //           to: "/M810610",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M810611",
      //           title: "상담설정관리",
      //           to: "/M810611",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      //     },
      //     {
      //       id: "M8107",
      //       title: "시스템관리",
      //       icon: "",
      //       items: [
      //         {
      //           id: "M810701",
      //           title: "공통코드관리",
      //           to: "/M810701",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M810702",
      //           title: "메뉴관리",
      //           to: "/M810702",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M810703",
      //           title: "메뉴권한관리",
      //           to: "/M810703",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M810704",
      //           title: "메뉴권한관리 - 권한그룹관리",
      //           to: "/M810704",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M810705",
      //           title: "사용자별권한관리",
      //           to: "/M810705",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //         {
      //           id: "M810706",
      //           title: "기업계정관리",
      //           to: "/M810706",
      //           iframe: true,
      //           tabIcon: "",
      //         },
      //       ],
      // },
      //   ],
      // },
    ],
    items_dev: [
      // { title: "Login", icon: "mdi-login", to: "/login", iframe: false },
      // { title: "Home", icon: "mdi-home", to: "/home", iframe: false },
      // {
      //   id: "home",
      //   title: "홈",
      //   icon: "mdi-home",
      //   to: "/home",
      //   iframe: false,
      //   dialog: false,
      // },
      // {
      //   id: "framework",
      //   title: "프레임워크",
      //   icon: "mdi-view-dashboard",
      //   items: [
      //     {
      //       id: "guide",
      //       title: "가이드",
      //       icon: "mdi-wrench",
      //       to: "/guide",
      //       iframe: true,
      //       tabIcon: "",
      //     },
      //     {
      //       id: "MainManageTest",
      //       title: "MainManageTest",
      //       icon: "mdi-comment-processing-outline",
      //       to: "/MainManageTest",
      //     },
      //   ],
      // },

    ],
    right: null,
  }),
  mounted() {
    this.changeMenuName();
    this.checkUserAuth();
    this.flattenMenu(this.user_menu);
  },
  computed: {
  },
  watch: {
    //user_menu가 변경되면 메뉴 리셋
    user_menu(data) {
      //변경 처리
      // this.changeMenuName();
    },
  },
  methods: {
    LinkToNewTab() {
      window.open('/guide', '_blank');
    },
    setActiveTab(item) {
      let setId = item.to.replace("/", "");
      this.$store.dispatch("commonStore/AC_COMMON_ACTIVE_TAB", {
        id: setId,
        title: item.NODE_TITLE,
        default: "N",
        tabIcon: item.tabIcon,
        link: item.PATH_NM,
      });
    },
    closePop() {
      this.$store.dispatch("commonStore/AC_COMMON_HELP_DIALOG", {
        type: false,
      });
    },
    checkUserRole: (id, user_menu) => {
      var return_val = false;
      if (id) {
        if (user_menu) {
          for (var i = 0; i < user_menu.length; i++) {
            if (id === user_menu[i].C_NODE_NO) return_val = true;
          }
        }
      }
      return return_val;
    },
    checkUserAuth(){
      this.$api
        .post(
          "api/palette-main/myAuth/inqire", //api url입력
          {
            USER_ID: this.$store.getters['userStore/GE_USER_ROLE'].userId,
          },
          {
            head: {
              SERVICE: "palette-main.myAuth",
              METHOD: "inqire",
              TYPE: "BIZ_SERVICE",
            },
          }
        )
        .then((response) => {
          this.AUTH = response.data.DATA[0].USER_AUTH;
          this.mixin_setRouter();
        })
        .catch((err) => {
          alert(err);
        });
    },

    //새로고침 라우터
    setRouter(){
      //좌측메뉴 만들기
      let menuList = this.$store.getters["userStore/GE_USER_MENU_LIST"];
      let len = menuList.length;
      let menu = [];
      for (let i = 0; i < len; i++) {
        menu[i] = {
          path: menuList[i].PATH_NM,
          name: menuList[i].NODE_TITLE
        };
      }
      setMenu(menu);
    },

    openPop(id) {
      let setId = id.replace("/", "");
      this.$store.dispatch("commonStore/AC_COMMON_HELP_DIALOG", { type: true });
      this.$store.dispatch("commonStore/AC_COMMON_HELP_DIALOG_ID", {
        id: id,
      });
    },
    //메뉴명 변경 처리. 더 좋은 방법이 있겠지만 걍 무식하게 처리
    async changeMenuName() {
      //1depth 메뉴 변경
      for (let i = 0; i < this.items.length; i++) {
        //메뉴명 가져오기
        let get_title = await this.searchMatchMenu(
          this.items[i].id,
          this.items[i].title
        );
        //메뉴명 변경
        this.items[i].title = get_title;

        //2depth 가 있다면 2depth도 변경
        if (this.items[i].items) {
          //2depth 메뉴 변경
          for (let a = 0; a < this.items[i].items.length; a++) {
            //메뉴명 가져오기
            let get_title1 = await this.searchMatchMenu(
              this.items[i].items[a].id,
              this.items[i].items[a].title
            );

            //메뉴명 변경
            this.items[i].items[a].title = get_title1;

            //3depth 가 있다면 3depth도 변경
            if (this.items[i].items[a].items) {
              //메뉴명 가져오기
              for (let b = 0; b < this.items[i].items[a].items.length; b++) {
                let get_title2 = await this.searchMatchMenu(
                  this.items[i].items[a].items[b].id,
                  this.items[i].items[a].items[b].title
                );

                //메뉴명 변경
                this.items[i].items[a].items[b].title = get_title2;
              }
            }
          }
        }
      }
    },
    searchMatchMenu(id, title) {
      // console.log("##### [changeMenuName] id=", id);
      // console.log("##### [changeMenuName] title=", title);
      // console.log("##### [changeMenuName] this.user_menu=", this.user_menu);
      let set_title = title;
      for (let i = 0; i < this.user_menu.length; i++) {
        if (this.user_menu[i].C_NODE_NO === id) {
          set_title = this.user_menu[i].title;
        }
      }
      return set_title;
    },

    // 메뉴 자동 검색용 배열 생성
    flattenMenu(menu) {
      menu.forEach((item) => {
        if (!item.child) {
          this.flattenedMenu.push({ NODE_TITLE: item.NODE_TITLE, PATH_NM: item.PATH_NM, FULL_PATH: item.FULL_PATH, MENU_EXPLN: item.MENU_EXPLN });
        }
        if (item.child) {
          this.flattenMenu(item.child);
        }
      });
    },
    formatSearchItem(item) {
      return `${item.NODE_TITLE} - ${item.PATH_NM}`;
    },

  },
};
</script>

<style></style>
