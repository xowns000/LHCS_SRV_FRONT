import Vue from "vue";

import GuideTableView from "@/Guide/GuideTableView.vue";
import GuideSrcview from '@/Guide/GuideSrcview'
import GuideIndex from '@/Guide/GuideIndex'

Vue.component("GuideTable",GuideTableView);
Vue.component("GuideSrcview",GuideSrcview);
Vue.component("GuideIndex",GuideIndex);

export default{
  appendHiddenLink(item){
      for (let index = 0; index < item.length; index++) {
        let hiddenTag = item[index];
        let element = document.querySelectorAll('h2');
        const html = `<span id="${hiddenTag}" class="guide-hidden-link"></span>`;
        element[index].insertAdjacentHTML('beforebegin',html);

      }
    }
}