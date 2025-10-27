<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <!-- //mark: Default -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <div class="table-form">
        <table>
          <caption class="hide">
            사용자정보 항목
          </caption>
          <colgroup>
            <col width="127px" />
            <col width="" />
            <col width="127px" />
            <col width="" />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row">
                <v-badge dot color="#EF9191">회사구분</v-badge>
              </th>
              <td colspan="3">
                <div class="form-inp sm">
                  <v-select
                    :items="dropItems"
                    item-text="title"
                    outlined
                    hide-details
                    placeholder="선택하세요"
                  >
                  </v-select>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <v-badge dot color="#EF9191">사용자ID</v-badge>
              </th>
              <td>
                <v-text-field
                  class="form-inp full"
                  name="name"
                  value=""
                  id="id"
                  outlined
                  hide-details=""
                >
                </v-text-field>
              </td>
              <th scope="row">
                <v-badge dot color="#EF9191">사용자명</v-badge>
              </th>
              <td>
                <v-text-field
                  class="form-inp full"
                  name="name"
                  value=""
                  id="id"
                  outlined
                  hide-details=""
                >
                </v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <v-badge dot color="#EF9191">닉네임</v-badge>
              </th>
              <td colspan="3">
                <v-text-field
                  class="form-inp"
                  name="name"
                  value=""
                  id="id"
                  outlined
                  hide-details=""
                >
                </v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <v-badge dot color="#EF9191">소속</v-badge>
              </th>
              <td colspan="3">
                <div>
                  <div class="form-inp sm">
                    <v-select
                      :items="dropItems"
                      item-text="title"
                      outlined
                      hide-details
                      placeholder="선택하세요"
                    >
                    </v-select>
                  </div>
                  <div class="form-inp sm ml-2">
                    <v-select
                      :items="dropItems"
                      item-text="title"
                      outlined
                      hide-details
                      placeholder="선택하세요"
                    >
                    </v-select>
                  </div>
                </div>
                <div class="mt-2">
                  <div class="form-inp sm">
                    <v-select
                      :items="dropItems"
                      item-text="title"
                      outlined
                      hide-details
                      placeholder="선택하세요"
                    >
                    </v-select>
                  </div>
                  <div class="form-inp sm ml-2">
                    <v-select
                      :items="dropItems"
                      item-text="title"
                      outlined
                      hide-details
                      placeholder="선택하세요"
                    >
                    </v-select>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: Header Table -->
    <h2>{{ toplink[1] }}</h2>
    <div class="guide-card">
      <div class="table-form">
        <table>
          <caption class="hide">
            사용자정보 항목
          </caption>
          <colgroup>
            <col width="50%" />
            <col width="" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">항목1</th>
              <th scope="col">항목2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>내용1</td>
              <td>내용2</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />

  </div>
</template>

<script>
import guideJs from '@/Guide/guide.js'

export default {
  name: "GuideTable",

  props:{
    SelectedProp: {
      type: String,
    }
  },
  components: {
  },
  data() {
    return {
      toplink: [
        'Default',
        'Header Table',
      ],
      source01: null,
      source02: null,
      source03: null,
      dropItems: [
        'itme A',
        'itme B',
        'itme C',
        'itme D',
        'itme E',
      ],

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<div class="table-form">
  <table>
    <caption class="hide">
      사용자정보 항목
    </caption>
    <colgroup>
      <col width="127px" />
      <col width="" />
      <col width="127px" />
      <col width="" />
    </colgroup>
    <tbody>
      <tr>
        <th scope="row">
          <v-badge dot color="#EF9191">회사구분</v-badge>
        </th>
        <td colspan="3">
          <div class="form-inp sm">
            <v-select
              :items="dropItems"
              item-text="title"
              outlined
              hide-details
              placeholder="선택하세요"
            >
            </v-select>
          </div>
        </td>
      </tr>
      <tr>
        <th scope="row">
          <v-badge dot color="#EF9191">사용자ID</v-badge>
        </th>
        <td>
          <v-text-field
            class="form-inp full"
            name="name"
            value=""
            id="id"
            outlined
            hide-details=""
          >
          </v-text-field>
        </td>
        <th scope="row">
          <v-badge dot color="#EF9191">사용자명</v-badge>
        </th>
        <td>
          <v-text-field
            class="form-inp full"
            name="name"
            value=""
            id="id"
            outlined
            hide-details=""
          >
          </v-text-field>
        </td>
      </tr>
      <tr>
        <th scope="row">
          <v-badge dot color="#EF9191">닉네임</v-badge>
        </th>
        <td colspan="3">
          <v-text-field
            class="form-inp"
            name="name"
            value=""
            id="id"
            outlined
            hide-details=""
          >
          </v-text-field>
        </td>
      </tr>
      <tr>
        <th scope="row">
          <v-badge dot color="#EF9191">소속</v-badge>
        </th>
        <td colspan="3">
          <div>
            <div class="form-inp sm">
              <v-select
                :items="dropItems"
                item-text="title"
                outlined
                hide-details
                placeholder="선택하세요"
              >
              </v-select>
            </div>
            <div class="form-inp sm ml-2">
              <v-select
                :items="dropItems"
                item-text="title"
                outlined
                hide-details
                placeholder="선택하세요"
              >
              </v-select>
            </div>
          </div>
          <div class="mt-2">
            <div class="form-inp sm">
              <v-select
                :items="dropItems"
                item-text="title"
                outlined
                hide-details
                placeholder="선택하세요"
              >
              </v-select>
            </div>
            <div class="form-inp sm ml-2">
              <v-select
                :items="dropItems"
                item-text="title"
                outlined
                hide-details
                placeholder="선택하세요"
              >
              </v-select>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>`
          },
          { tab: "script", content:
`dropItems: [
  'itme A',
  'itme B',
  'itme C',
  'itme D',
  'itme E',
],` },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`<div class="table-form">
  <table>
    <caption class="hide">
      사용자정보 항목
    </caption>
    <colgroup>
      <col width="50%" />
      <col width="" />
    </colgroup>
    <thead>
      <tr>
        <th scope="col">항목1</th>
        <th scope="col">항목2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>내용1</td>
        <td>내용2</td>
      </tr>
    </tbody>
  </table>
</div>`
          },
          { tab: "script", content:
`` },
        ],

      },
    }
  },
  methods: {
  },
  computed: {
  },
  mounted() {
    guideJs.appendHiddenLink(this.toplink);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>