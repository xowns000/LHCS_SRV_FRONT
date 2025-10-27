<template>
  <div class="guide-infotxt">
    <h3 class="d-flex justify-space-between align-end">{{ PropTitle }} <span class="text-button"><span class="is-txt-red">*</span> 은 필수 항목</span></h3>
    <v-simple-table
      fixed-header
      dense
    >
      <template v-slot:default>
        <thead>
          <tr>
            <th
              v-for="(item, index) in tableHeader"
              :key="index"
              class="text-left is-txt-black"
            >
              {{ item.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in PropTable"
            :key="index"
            >
            <td class="is-txt-indigo">
              {{ item.name }}
              <span class="is-txt-red">
                {{ item.required ? '*' : '' }}
              </span>
            </td>
            <td
              :class="`type-${item.type}`"
            >{{ item.type }}</td>
            <td
            :class="`default-${item.default}`"
            >{{ item.default }}</td>
            <td class="font-weight-regular">{{ item.description }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
  export default {
    name: 'GuideTable',
    props: {
      PropTitle: {
        type: String,
        default: 'Props'
      },
      PropTable: {
        type: Array
      },
    },
    data() {
      return {
        tableHeader: [ { name: 'name' }, { name: 'type' }, { name: 'default' }, { name: 'description' }, ],

      }
    },
    computed: {
    }
  }
</script>

<style lang="sass" scoped>
.guide-infotxt
  margin: 10px 0
  padding: 10px
  font-size: 14px
  line-height: 1.8
  color: #383838
  border: 1px solid #e3e3e3
  border-radius: 6px

.type-Boolean
  color: #3786e6
.type-Number
  color: #f04949
.type-String
  color: #690
.default-undefined,
.default-null
  color: #07a
.default-false
  color: #f04949

</style>