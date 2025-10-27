<template>
  <div>
      <strong class="text-caption">BOOKMARK : </strong>
      <template v-for="(item, index) in LinkProp" >
        <a
          :key="index"
          @click="gotoLink(item)"
          style="min-height: 30px; font-size: 14px; font-style: italic;"
        >[{{ item }}]
        </a>&nbsp;
      </template>
    </div>
</template>

<script>
  export default {
    name: 'GuideIndex',
    props: {
      LinkProp: {
        type: Array,
      },
    },
    data() {
      return{
      }
    },
    methods: {
      gotoLink(item){
        let element = document.getElementById(item);
        element.scrollIntoView({ behavior: "smooth" });
      },
    },
    mounted() {
    }
  }
</script>
