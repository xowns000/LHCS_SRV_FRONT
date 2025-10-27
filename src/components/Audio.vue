<template>
  <v-container fluid>
    <div class="d-flex">
      <div class="flex-grow-0">
        <vuetify-audio
          color="primary"
          downloadable
          autoPlay
          :file="player_file"
          :canPlay="playReady()"
          :ended="playFinish()"
        >
        </vuetify-audio>
      </div>
      <div class="flex-grow-1 pl-5">
        <v-list class="pa-0" dense>
          <v-subheader class="text-subtitle-2 black white--text"
            >재생목록: {{ player_file }}</v-subheader
          >
          <v-list-item-group v-model="selectedItem" color="primary">
            <template v-for="(item, i) in items">
              <v-list-item :key="i" @click="play(item.url)">
                <template v-slot:default="{ active }">
                  <v-icon v-if="!active" color="grey lighten-1">
                    {{ item.icon }}
                  </v-icon>
                  <v-icon v-else color="pink"> mdi-playlist-play </v-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="item.url"
                      class="pl-3"
                    ></v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  name: "MENU_Audio",
  components: {
    VuetifyAudio: () => import("vuetify-audio"),
  },
  props: {},
  data: () => ({
    // player_file: "http://www.hochmuth.com/mp3/Boccherini_Concerto_478-1.mp3",
    playIcon: "mdi-clock",
    pauseIcon: "mdi-pause",
    stopIcon: "mdi-stop",
    refreshIcon: "mdi-refresh",
    downloadIcon: "mdi-download",
    player_file: "",
    selectedItem: -1,
    items: [
      {
        url: "http://www.hochmuth.com/mp3/Boccherini_Concerto_478-1.mp3",
        icon: "mdi-playlist-music",
      },
      {
        url: "https://ccrma.stanford.edu/~jos/mp3/harpsi-cs.mp3",
        icon: "mdi-playlist-music",
      },
    ],
  }),
  computed: {
    ...mapGetters({
      // progress_bar: "commonStore/GE_COMMON_PROGRESS_BAR",
    }),
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    play(play_list) {
      // console.log("########### play=", play_list);
      this.player_file = play_list;
    },
    //플레이 종료 후 호출
    playFinish() {
      // console.log("########### playFinish");
    },
    //플레이 준비 후 호출
    playReady() {
      // console.log("########### playReady");
    },
  },
  activated() {},
  deactivated() {},
  destroyed() {},
};
</script>

<style></style>
