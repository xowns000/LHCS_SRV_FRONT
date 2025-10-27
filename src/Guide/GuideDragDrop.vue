<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <!-- //mark: 상하 순서 이동 -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <div class="pl-drag-list">
        <div class="pl-drag-list-top">
          <p>전체 <strong>({{ DRAG_LIST.length }})</strong>개의 상담정보 항목이 있습니다.</p>
        </div>
        <div class="pl-drag-list-content">
          <draggable
            ghost-class="ghost"
            v-model="DRAG_LIST">
            <div
              v-for="item in DRAG_LIST"
              :key="item.id"
              @click="selectItem(item)"
              class="pl-drag-list-unit"
              :class="item.selected ? 'active' : ''"
              >
              <v-icon class="pl-icon20" :class="`is-drag-icon-${item.type}`"></v-icon>
              <span class="pl-drag-list-title">{{ item.title }}</span>
              <span :class="item.owner === 'user' ? 'is-txt-main' : ''">{{ displayOwner(item.owner) }} </span>
              <span v-show="item.disabled" class="pl-1 is-txt-error"> - {{ displayDisabled(item.disabled) }}</span>
              <div class="is-right">
                <v-icon
                  v-if="item.owner === 'system'"
                  class="pl-icon20"
                  :class="displayLock(item.lock)"></v-icon>
                <template v-else>
                  <!-- 수정 버튼 -->
                  <compo-tooltip-btn
                    TitleProp="수정"
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 edit"
                    TooltipPositionProp="bottom"
                    @btnClick="mixin_testLog('수정')"
                  ></compo-tooltip-btn>
                  <!-- 수정 버튼 -->
                  <compo-tooltip-btn
                    TitleProp="삭제"
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 trash"
                    TooltipPositionProp="bottom"
                    @btnClick="mixin_testLog('삭제')"
                  ></compo-tooltip-btn>
                </template>
              </div>
            </div>
          </draggable>
        </div>
        <div class="mt-2 text-right">
          <v-btn class="pl-btn is-sub" @click="addDragItem">항목추가</v-btn>
        </div>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: 영역 이동 -->
    <h2>{{ toplink[1] }}</h2>
    <div class="guide-card">
      <div class="list-boxwhite d-flex justify-space-between">
        <div class="col-6">
          <template>
            <v-simple-table height="200" dense fixed-header>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-center" style="width: 40px">
                      <v-checkbox
                        v-model="list4_selected.length > 0"
                        hide-details
                        label=""
                        @click="allCheckbox('list4')"
                        v-ripple="{ class: 'red--text' }"
                        class="align-self-center"
                      ></v-checkbox>
                    </th>
                    <th class="text-center subtitle-2" > 메뉴명 </th>
                    <th class="text-center subtitle-2" > 메뉴ID
                    </th>
                  </tr>
                </thead>

                <draggable v-model="list4" group="dregdrop03" tag="tbody">
                  <tr v-for="item in list4" :key="item.name">
                    <td class="d-flex justify-center align-center">
                      <v-checkbox
                        v-model="list4_selected"
                        label=""
                        :value="item"
                        hide-details
                      ></v-checkbox>
                    </td>
                    <td class="text-center">{{ item.name }}</td>
                    <td class="text-center">{{ item.calories }}</td>
                  </tr>
                </draggable>
              </template>
            </v-simple-table>
          </template>
        </div>
        <div class="d-flex px-4 flex-column justify-center align-center" style="gap: 14px">
          <!-- arrow left 버튼 -->
          <compo-tooltip-btn
            TitleProp="left"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon30 is-arrow-left"
            TooltipPositionProp="bottom"
            @btnClick="itemMove('left')"
          ></compo-tooltip-btn>
          <!-- arrow right 버튼 -->
          <compo-tooltip-btn
            TitleProp="right"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon30 is-arrow-right"
            TooltipPositionProp="bottom"
            @btnClick="itemMove('right')"
          ></compo-tooltip-btn>
        </div>
        <div class="col-6">
          <template>
            <v-simple-table height="200" dense fixed-header>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th style="width: 40px" >
                      <v-checkbox
                        v-model="list5_selected.length > 0"
                        label=""
                        @click="allCheckbox('list5')"
                        hide-details
                      ></v-checkbox>
                    </th>
                    <th class="text-center subtitle-2" > 메뉴명 </th>
                    <th class="text-center subtitle-2" > 메뉴ID </th>
                  </tr>
                </thead>
                <draggable
                  v-model="list5"
                  group="dregdrop03"
                  tag="tbody"
                  ghost-class="ghost03"
                >
                  <tr v-for="item in list5" :key="item.name">
                    <td class="d-flex justify-center align-center">
                      <v-checkbox
                        v-model="list5_selected"
                        label=""
                        :value="item"
                        hide-details
                      ></v-checkbox>
                    </td>
                    <td class="text-center">{{ item.name }}</td>
                    <td class="text-center">{{ item.calories }}</td>
                  </tr>
                </draggable>
              </template>
            </v-simple-table>
          </template>
        </div>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />
  </div>
</template>

<script>
import guideJs from '@/Guide/guide.js'
import draggable from "vuedraggable";

export default {
  name: "GuideDragDrop",

  props:{
    SelectedProp: {
      type: String,
    }
  },
  components: {
    draggable,

  },
  data() {
    return {
      toplink: [
        '상하 순서 이동',
        '영역 이동',
      ],
      source01: null,
      source02: null,
      source03: null,
      source04: null,
      source05: null,

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<div class="pl-drag-list">
  <div class="pl-drag-list-top">
    <p>전체 <strong>({{ DRAG_LIST.length }})</strong>개의 상담정보 항목이 있습니다.</p>
  </div>
  <div class="pl-drag-list-content">
    <draggable
      ghost-class="ghost"
      v-model="DRAG_LIST">
      <div
        v-for="item in DRAG_LIST"
        :key="item.id"
        @click="selectItem(item)"
        class="pl-drag-list-unit"
        :class="item.selected ? 'active' : ''"
        >
        <v-icon class="pl-icon20" :class="\`is-drag-icon-\${item.type}\`"></v-icon>
        <span class="pl-drag-list-title">{{ item.title }}</span>
        <span :class="item.owner === 'user' ? 'is-txt-main' : ''">{{ displayOwner(item.owner) }} </span>
        <span v-show="item.disabled" class="pl-1 is-txt-error"> - {{ displayDisabled(item.disabled) }}</span>
        <div class="is-right">
          <v-icon
            v-if="item.owner === 'system'"
            class="pl-icon20"
            :class="displayLock(item.lock)"></v-icon>
          <template v-else>
            <!-- 수정 버튼 -->
            <compo-tooltip-btn
              TitleProp="수정"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 edit"
              TooltipPositionProp="bottom"
              @btnClick="mixin_testLog('수정')"
            ></compo-tooltip-btn>
            <!-- 수정 버튼 -->
            <compo-tooltip-btn
              TitleProp="삭제"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 trash"
              TooltipPositionProp="bottom"
              @btnClick="mixin_testLog('삭제')"
            ></compo-tooltip-btn>
          </template>
        </div>
      </div>
    </draggable>
  </div>
  <div class="mt-2 text-right">
    <v-btn class="pl-btn is-sub" @click="addDragItem">항목추가</v-btn>
  </div>
</div>`
          },
          { tab: "script", content:
`export default {
  data() {
    return {
      DRAG_LIST : [
        {
          type : 'text', // text, number, check, date
          title: '콜 유형',
          owner: 'system', // system, user
          disabled: true,
          lock: true,
          selected: false,
        },
        {
          type : 'number', // text, number, check, date
          title: '채널',
          owner: 'system', // system, user
          disabled: false,
          lock: false,
          selected: false,
        },
        {
          type : 'number', // text, number, check, date
          title: '채널',
          owner: 'user', // system, user
          disabled: false,
          lock: false,
          selected: false,
        },
      ],
    }
  }
  methods: {
    displayOwner(item) {
      return item === 'system' ? '(시스템 기본항목)' : '(사용자 확장항목)'
    },
    displayDisabled(item) {
      return item === true ? '사용안함' : ''
    },
    displayLock(item) {
      return item === true ? 'list-lock' : 'list-unlock'
    },
    addDragItem() {
      this.DRAG_LIST.push({
        type : 'number', // text, number, check, date
        title: 'TEST',
        owner: 'user', // system, user
        disabled: false,
        lock: false,
      });
    },
    // selected 효과
    selectItem(item) {
      this.DRAG_LIST.forEach((listItem) => {
        listItem.selected = false;
      });
      item.selected = true;
    }
  },
  computed: {

  },
  watch: {

  },
}` },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`<div class="list-boxwhite d-flex justify-space-between">
  <div class="col-6">
    <template>
      <v-simple-table height="200" dense fixed-header>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center" style="width: 40px">
                <v-checkbox
                  v-model="list4_selected.length > 0"
                  hide-details
                  label=""
                  @click="allCheckbox('list4')"
                  v-ripple="{ class: 'red--text' }"
                  class="align-self-center"
                ></v-checkbox>
              </th>
              <th class="text-center subtitle-2" > 메뉴명 </th>
              <th class="text-center subtitle-2" > 메뉴ID
              </th>
            </tr>
          </thead>
          <draggable v-model="list4" group="dregdrop03" tag="tbody">
            <tr v-for="item in list4" :key="item.name">
              <td class="d-flex justify-center align-center">
                <v-checkbox
                  v-model="list4_selected"
                  label=""
                  :value="item"
                  hide-details
                ></v-checkbox>
              </td>
              <td class="text-center">{{ item.name }}</td>
              <td class="text-center">{{ item.calories }}</td>
            </tr>
          </draggable>
        </template>
      </v-simple-table>
    </template>
  </div>
  <div class="d-flex px-4 flex-column justify-center align-center" style="gap: 14px">
    <!-- arrow left 버튼 -->
    <compo-tooltip-btn
      TitleProp="left"
      ClassProp="pl-tooltip-btn"
      IconProp="pl-icon30 is-arrow-left"
      TooltipPositionProp="bottom"
      @btnClick="itemMove('left')"
    ></compo-tooltip-btn>
    <!-- arrow right 버튼 -->
    <compo-tooltip-btn
      TitleProp="right"
      ClassProp="pl-tooltip-btn"
      IconProp="pl-icon30 is-arrow-right"
      TooltipPositionProp="bottom"
      @btnClick="itemMove('right')"
    ></compo-tooltip-btn>
  </div>
  <div class="col-6">
    <template>
      <v-simple-table height="200" dense fixed-header>
        <template v-slot:default>
          <thead>
            <tr>
              <th style="width: 40px" >
                <v-checkbox
                  v-model="list5_selected.length > 0"
                  label=""
                  @click="allCheckbox('list5')"
                  hide-details
                ></v-checkbox>
              </th>
              <th class="text-center subtitle-2" > 메뉴명 </th>
              <th class="text-center subtitle-2" > 메뉴ID </th>
            </tr>
          </thead>
          <draggable
            v-model="list5"
            group="dregdrop03"
            tag="tbody"
            ghost-class="ghost03"
          >
            <tr v-for="item in list5" :key="item.name">
              <td class="d-flex justify-center align-center">
                <v-checkbox
                  v-model="list5_selected"
                  label=""
                  :value="item"
                  hide-details
                ></v-checkbox>
              </td>
              <td class="text-center">{{ item.name }}</td>
              <td class="text-center">{{ item.calories }}</td>
            </tr>
          </draggable>
        </template>
      </v-simple-table>
    </template>
  </div>
</div>`
          },
          { tab: "script", content:
`export default {
  data() {
    return {
      list4_headers: [
        {
          text: "메뉴명",
          value: "name",
          align: "center",
          sortable: true,
          class: "blue-grey lighten-4",
        },
        {
          text: "메뉴ID",
          value: "calories",
          align: "center",
          sortable: true,
          class: "blue-grey lighten-4",
        },
      ],
      list4: [
        {
          id: 1,
          name: "채팅상담",
          calories: "M01",
        },
        ...
      ],
      list5: [
        {
          id: 7,
          name: "지식관리",
          calories: "M07",
        },
        ...
      ],
      list4_selected: [],
      list5_selected: [],
    }
  },
  methods: {
    itemMove(type) {
      if (type === "left") {
        //배열추가
        this.list4 = [...this.list4, ...this.list5_selected];
        //배열삭제
        for (var i = 0; i < this.list5_selected.length; i++) {
          this.list5 = this.list5.filter(
            (element) => element != this.list5_selected[i]
          );
        }
        //선택값 초기화
        this.list5_selected = [];
      } else {
        //배열추가
        this.list5 = [...this.list5, ...this.list4_selected];
        //배열삭제
        for (var a = 0; a < this.list4_selected.length; a++) {
          this.list4 = this.list4.filter(
            (element) => element != this.list4_selected[a]
          );
        }
        //선택값 초기화
        this.list4_selected = [];
      }
    },
    allCheckbox(id) {
      // console.log("######## [allCheckbox] id=", this.,\${id});
      console.log(
        "######## [allCheckbox] this.list5_selected.length=",
        this.list5_selected.length
      );

      if (id === "list4") {
        //하나도 체크되어 있지 않으면 전체 체크
        if (this.list4_selected.length === 0) {
          this.list4_selected = [];
          for (let i = 0; i < this.list4.length; i++) {
            this.list4_selected.push(this.list4[i]);
          }
        } else {
          //아니라면 전체 해제
          this.list4_selected = [];
        }
      } else if (id === "list5") {
        //하나도 체크되어 있지 않으면 전체 체크
        if (this.list5_selected.length === 0) {
          this.list5_selected = [];
          for (let i = 0; i < this.list5.length; i++) {
            this.list5_selected.push(this.list5[i]);
          }
        } else {
          //아니라면 전체 해제
          this.list5_selected = [];
        }
      }
    },
  }
}` },
        ],
      },
      listId: 3,
      list4: [
        {
          id: 1,
          name: "채팅상담",
          calories: "M01",
        },
        {
          id: 2,
          name: "전화상담",
          calories: "M02",
        },
        {
          id: 3,
          name: "모니터링",
          calories: "M03",
        },
        {
          id: 4,
          name: "대시보드",
          calories: "M04",
        },
        {
          id: 5,
          name: "상담이력관리",
          calories: "M05",
        },
        {
          id: 6,
          name: "설정관리",
          calories: "M06",
        },
      ],
      list5: [
        {
          id: 7,
          name: "지식관리",
          calories: "M07",
        },
        {
          id: 8,
          name: "SMS/LMS",
          calories: "M08",
        },
        {
          id: 9,
          name: "게시판",
          calories: "M09",
        },
        {
          id: 10,
          name: "통계",
          calories: "M10",
        },
      ],
      list4_headers: [
        {
          text: "메뉴명",
          value: "name",
          align: "center",
          sortable: true,
          class: "blue-grey lighten-4",
        },
        {
          text: "메뉴ID",
          value: "calories",
          align: "center",
          sortable: true,
          class: "blue-grey lighten-4",
        },
      ],
      list4_selected: [],
      list5_selected: [],

      // drag list
      DRAG_LIST : [
        {
          type : 'text', // text, number, check, date
          title: '콜 유형',
          owner: 'system', // system, user
          disabled: true,
          lock: true,
          selected: false,
        },
        {
          type : 'number', // text, number, check, date
          title: '채널',
          owner: 'system', // system, user
          disabled: false,
          lock: false,
          selected: false,
        },
        {
          type : 'number', // text, number, check, date
          title: '채널',
          owner: 'user', // system, user
          disabled: false,
          lock: false,
          selected: false,
        },
      ],
    }
  },
  methods: {
    itemMove(type) {
      if (type === "left") {
        //배열추가
        this.list4 = [...this.list4, ...this.list5_selected];
        //배열삭제
        for (var i = 0; i < this.list5_selected.length; i++) {
          this.list5 = this.list5.filter(
            (element) => element != this.list5_selected[i]
          );
        }
        //선택값 초기화
        this.list5_selected = [];
      } else {
        //배열추가
        this.list5 = [...this.list5, ...this.list4_selected];
        //배열삭제
        for (var a = 0; a < this.list4_selected.length; a++) {
          this.list4 = this.list4.filter(
            (element) => element != this.list4_selected[a]
          );
        }
        //선택값 초기화
        this.list4_selected = [];
      }
    },
    allCheckbox(id) {
      // console.log("######## [allCheckbox] id=", this.,${id});
      // console.log(
      //   "######## [allCheckbox] this.list5_selected.length=",
      //   this.list5_selected.length
      // );

      if (id === "list4") {
        //하나도 체크되어 있지 않으면 전체 체크
        if (this.list4_selected.length === 0) {
          this.list4_selected = [];
          for (let i = 0; i < this.list4.length; i++) {
            this.list4_selected.push(this.list4[i]);
          }
        } else {
          //아니라면 전체 해제
          this.list4_selected = [];
        }
      } else if (id === "list5") {
        //하나도 체크되어 있지 않으면 전체 체크
        if (this.list5_selected.length === 0) {
          this.list5_selected = [];
          for (let i = 0; i < this.list5.length; i++) {
            this.list5_selected.push(this.list5[i]);
          }
        } else {
          //아니라면 전체 해제
          this.list5_selected = [];
        }
      }
    },

    //drag list
    displayOwner(item) {
      return item === 'system' ? '(시스템 기본항목)' : '(사용자 확장항목)'
    },
    displayDisabled(item) {
      return item === true ? '사용안함' : ''
    },
    displayLock(item) {
      return item === true ? 'list-lock' : 'list-unlock'
    },
    addDragItem() {
      this.DRAG_LIST.push({
        type : 'number', // text, number, check, date
        title: 'TEST',
        owner: 'user', // system, user
        disabled: false,
        lock: false,
      });
    },
    // selected 효과
    selectItem(item) {
      this.DRAG_LIST.forEach((listItem) => {
        listItem.selected = false;
      });
      item.selected = true;
    }
  },
  computed: {

  },
  watch: {

  },
  mounted() {
    guideJs.appendHiddenLink(this.toplink);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>