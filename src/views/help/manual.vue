<template>
  <v-container fluid>
    <v-card>
      <v-toolbar color="info" flat dense dark>
        <v-toolbar-title class="text-capitalize">설치 매뉴얼</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card>
        <v-subheader>
          현장 설치 영상 안내
          <!-- <v-spacer></v-spacer> -->
          <v-btn @click="showVideo = !showVideo" icon>
            <v-icon>{{ !showVideo ? 'mdi-chevron-down' : 'mdi-chevron-up'}}</v-icon>
          </v-btn>
        </v-subheader>
        <v-card-text ref="video" v-if="showVideo">
          <video-player  class="video-player-box"
            ref="videoPlayer"
            :options="playerOptions"
            :playsinline="true"
            customEventName="customstatechangedeventname">
          </video-player>
        </v-card-text>

        <v-subheader>
          현장 설치 매뉴얼
          <!-- <v-spacer></v-spacer> -->
          <v-btn @click="showDoc = !showDoc" icon>
            <v-icon>{{ !showDoc ? 'mdi-chevron-down' : 'mdi-chevron-up'}}</v-icon>
          </v-btn>
        </v-subheader>
        <v-card-text v-if="showDoc">
          <v-list-item v-for="(doc, i) in docs" :key="i">
            <v-list-item-content>
              <v-list-item-title>
                {{i + 1}}. {{ doc }}
              </v-list-item-title>
              <!-- <v-list-item-content>
                {{ doc.content }}
              </v-list-item-content> -->
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
      </v-card>
    </v-card>
  </v-container>
</template>
<script>
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'

export default {
  components: {
    videoPlayer
  },
  data () {
    return {
      docs: [
        '비콘 스캐너 전원 연결',
        '모바일 와이파이로 LBSR1XXXXXXX를 찾아서 연결',
        '모바일 브라우저로 http://192.168.4.1에 접속',
        '설치할 장소의 AP 지정 후, 비밀번호 입력',
        '설치할 장소의 AP 접속 확인',
        '타겟 서버(웰티즌)에 전송되었는 지 확인'
      ],
      playerOptions: {
        // videojs options
        autoplay: true,
        muted: true,
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: 'video/mp4',
          src: 'https://firebasestorage.googleapis.com/v0/b/beacon-detect.appspot.com/o/beacon%20scanner%20setup.mp4?alt=media&token=5c205af8-dd9f-4ae8-9c80-09b2f43df54a'
        }],
        width: 480
        // poster: '/static/images/author.jpg'
      },
      showVideo: true,
      showDoc: false
    }
  },
  mounted () {
    this.playerOptions.width = this.$refs.video.clientWidth - 80
  },
  methods: {
  }
}
</script>
