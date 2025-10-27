<template>
  <div>
    <component :is="item.compo_name" :DataProp="item" :popData="item" @sendDataToParent="sendDataToParent(item.callback)"></component>
  </div>
</template>

<script>
import CompoImgExpand from '@/components/CompoImgExpand.vue';

export default {
  components: {
    CompoImgExpand,
  },
  data() {
    return {
      item: {}, //부모창으로 부터 전달 받은 Data
      rtnItem: {}, //부모창으로 전달할 Data
      originTabId : '', //팝업호출 TAB ID
      originTabNm : '', //팝업호출 TAB 명
      callback : '',
    };
  },
  watch: {
    item: {
      deep: true,
      handler(newValue) {
        sessionStorage.setItem('popupItem', JSON.stringify(newValue));
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('message', this.receiveData, false);
  },
  created() {
    console.log(111111);
    window.addEventListener('message', this.receiveData, false);

    // 부모 창의 존재 여부 확인
    if (window.opener) {
      // 부모 창의 상태 주기적으로 체크
      const checkParentInterval = setInterval(() => {
        if (!window.opener || window.opener.closed) {
          clearInterval(checkParentInterval);
          // 부모 창이 닫혔으므로 팝업 창도 닫기
          window.close();
        }
      }, 1000);
    } else {
      // 부모 창이 닫혔으므로 팝업 창도 닫기
      window.close();
    }

    this.loadState();
  },
  mounted() {
  },
  methods: {
    loadState() {
      const savedItem = sessionStorage.getItem('popupItem');
      if (savedItem) {
        this.item = JSON.parse(savedItem);
      } else if (window.opener && window.opener.item) {
        this.item = window.opener.item;
        sessionStorage.setItem('popupItem', JSON.stringify(this.item));
      }
    },
    receiveData(event) {
      this.originTabId = this.$route.params.menuId;
      this.originTabNm = JSON.parse(window.sessionStorage.getItem("vuex")).commonStore.active_tab.title;

      // 이벤트의 출처를 확인하여 보안상 안전한지 확인
      if (event.origin !== window.location.origin) {
        return;
      }

      // 부모 창에서 보낸 데이터 수신
      if (event.data) {
        if(event.data.key === 'message'){
          this.showAlert({alertDialogToggle: true, msg: event.data.val, iconClass: 'is-info', type: 'default'});
        }else{
          if(event.data.item){
            this.item = event.data.item;

            this.callback = event.data.item.callback;
            if(this.callback) this.rtnItem = this.item;
          }else{
            sessionStorage.setItem('popupItem', JSON.stringify(this.item));
          }
        }
      }
    },

    //부모창 메소드 호출 및 데이터 전달
    sendDataToParent(methodName){
      if (window.opener && window.opener.parentVueInstance) {
        window.opener.parentVueInstance.mixin_parentSessionStorage(); //부모창 sessionStorage 변경 값 확인을 위해 재주입
        if(this.originTabId === JSON.parse(window.sessionStorage.getItem("vuex")).commonStore.active_tab.id){ //팝업창 오픈한 Tab 활성 여부
          const parentInstance = window.opener.parentVueInstance;
          if (typeof parentInstance[methodName] === 'function') {
            if(this.rtnItem){
              parentInstance[methodName](this.rtnItem);
            }else{
              parentInstance[methodName];
            }
          } else {
            this.showAlert({alertDialogToggle: true, msg: '<font color="red"><b>'+ this.originTabNm + '</b></font> 메뉴로 이동 후 이용해 주시기 바랍니다.', iconClass: 'is-info', type: 'default'});
            return;
          }
        }else{
          this.showAlert({alertDialogToggle: true, msg: '<font color="red"><b>'+ this.originTabNm + '</b></font> 메뉴로 이동 후 이용해 주시기 바랍니다.', iconClass: 'is-info', type: 'default'});
          return;
        }
      } else {
        this.showAlert({alertDialogToggle: true, msg: '<font color="red"><b>'+ this.originTabNm + '</b></font> 메뉴로 이동 후 이용해 주시기 바랍니다.', iconClass: 'is-info', type: 'default'});
        return;
      }
    },

    // closePopup
    closePopup(){
      window.close()
    }
  },
};
</script>