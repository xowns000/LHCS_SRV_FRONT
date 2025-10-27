<template>
  <v-dialog
    v-if="AudioType == 'whole'"
    v-model="visibleModel"
    content-class="dialog-draggable"
    @click:outside="clsoeDialog()"
    hide-overlay>
    <div class="draggable-area">drag area</div>
    <compo-dialog
        header-title="녹취 파일 듣기"
        @hide="clsoeDialog()"
    >
      <template slot="body">
        <ul class="pl-list-dot is-no-border mt-0 pb-4">
          <li>녹취 파일 저장 시 저장 이력은 기록되어집니다.</li>
          <li>녹취 파일 : {{  audioProp.REC_FILE_NM  }}</li>
        </ul>
        <div class="d-flex">
          <!-- component -->
          <audio
              controls
              name="media"
              :src="AudioSrc"
              type="audio/mpeg"
              ref="audioElement"
              controlsList="nodownload noplaybackrate"
              @play="playAudio"
              @progress="downloadable"
          >
          </audio>
          <v-btn
              class="pl-btn is-sub ml-2"
              @click="downloadRecord"
              :disabled="!downloadableFlag"
          >음원 저장</v-btn>
        </div>
      </template>
    </compo-dialog>
  </v-dialog>
  <div v-else-if="AudioType !== 'whole'" :style="AudioType == 'playOnlyNoTtl' ? 'display: contents' : ''">
    <h2 v-if="AudioType == 'playOnly'" class="pl-dialog-body-tit-h2">녹취 내용 청취</h2>
    <div
      :class="AudioType == 'playOnly' ? 'pl-dialog-body-desc' : ''"
      :style="AudioType == 'playOnlyNoTtl' ? 'display: contents' : ''">
      <audio
        controls
        name="media"
        :src="AudioSrc"
        type="audio/mpeg"
        ref="audioElement"
        controlsList="nodownload noplaybackrate"
        @play="playAudio"
      >
      </audio>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    audioProp: {
      type: Object,
      required : true,
    },
    AudioType: {
      type: String,
      required : true
    },
  },
  data(){
    return{
      visibleModel: this.value,

      // 오디오 경로
      AudioSrc : '',

      //녹취 정지를 위한 요소
      audioElement : null,
      // 다운로드 버튼 활성화 여부
      downloadableFlag : false,
    }
  },
  mounted(){
    this.setRecDialog();
  },
  beforeUpdate() {
    this.setRecDialog();
  },
  methods: {
    // 오디오 파일 세팅
    setRecDialog() {

      setTimeout(() => {
        this.REC_TEMP_DATA = {};
        this.REC_TEMP_DATA = this.audioProp;

        if (this.mixin_isEmpty(this.audioProp.CUST_ID)) {
          this.REC_TEMP_DATA.trgtId = null;
          this.REC_TEMP_DATA.CUST_ID = null;

          this.REC_TEMP_DATA.cn = this.REC_TEMP_DATA.REC_FILE_NM+'.mp3'
        } else {
          this.REC_TEMP_DATA.trgtId = this.audioProp.CUST_ID;
        }

        let sApiUri = this.$store.getters["userStore/GE_USER_COMPANY"].API_URI;

        const iSemiCnt = sApiUri.match(/:/g).filter(function (item) {
          return item !== '';
        }).length;

        if (iSemiCnt > 1) {
          this.AudioSrc = sApiUri.split(':')[0] + ':' + sApiUri.split(':')[1] + '/hdd2/rec/' + this.REC_TEMP_DATA.REC_FILE_NM + '.mp3'
        } else {
          this.AudioSrc = sApiUri + '/hdd2/rec/' + this.REC_TEMP_DATA.REC_FILE_NM + '.mp3'
        }
      },100 );
    },

    // 녹취파일 청취
    playAudio(){

      var _this = this;

      if(this.$refs.audioElement == '' || this.$refs.audioElement == null || this.$refs.audioElement == undefined){
        //처음 다이얼로그가 열릴때 랜더링 시간 필요
        setTimeout(() => {
          //오디오 요소에 접근
          this.audioElement = this.$refs.audioElement;
          let vid = this.audioElement;
          vid.onplay = function() {
            //개인정보관련 로깅용
            _this.mixin_prvcInqLog('AUDIO_PLAY',  this.REC_TEMP_DATA);
          };

        }, 5 * 100); // 5밀리초
      }else{
        //개인정보관련 로깅용
        _this.mixin_prvcInqLog('AUDIO_PLAY',  this.REC_TEMP_DATA);
      }
    },

    // 녹취 다운로드
    downloadRecord(){

      var _this = this;

      //개인정보관련 로깅용
      _this.mixin_prvcInqLog('AUDIO_DOWN',  this.REC_TEMP_DATA);

      const link = document.createElement('a');
      link.href = "/api/file-ipcc-rec/download?src="+this.AudioSrc;
      link.click();
      URL.revokeObjectURL(link.href);

    },

    clsoeDialog(){
      this.visibleModel = false;
      this.$emit('input', false);

      this.$refs.audioElement.pause();      // audio 정지
      this.AudioSrc='';                     // 오디오소스 초기화
      this.REC_TEMP_DATA = {};              // 임시데이터 초기화
      this.downloadableFlag = false;        // 다운로드버튼 비활성화
    },
    // 녹취 파일 load 완료 시 다운로드 버튼 활성화
    downloadable(){
      this.downloadableFlag = true;         // 다운로드 버튼 활성화
    },
  },
  watch: {
    value(newValue) {
      this.visibleModel = newValue;
      this.downloadableFlag = false;
    },
    audioProp(){
      this.setRecDialog();
    },
  },

}
</script>

<style lang="scss" scoped>

</style>