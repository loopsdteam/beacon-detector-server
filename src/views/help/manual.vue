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
          <v-card-actions>
            <v-icon color="info">mdi-wifi-strength-4</v-icon> &nbsp; 인터넷 연결됨
            &nbsp; &nbsp;
            <v-icon color="secondary">mdi-wifi-strength-off-outline</v-icon> &nbsp; 인터넷 연결안됨
          </v-card-actions>
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
        '모바일 앱(LBS Tool) 실행',
        '검색 후 해당 제조번호의 장치로 접속',
        '와이파이 설정 버튼을 클릭',
        '해당 장소의 와이파이 정보를 작성 후 저장',
        '우측 상단에 새로고침을 클릭해서 와이파이가 정상인지 확인'
      ],
      playerOptions: {
        // videojs options
        autoplay: true,
        muted: true,
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: 'video/mp4',
          src: 'https://firebasestorage.googleapis.com/v0/b/beacon-detect.appspot.com/o/LBS%20Tool%20play.mp4?alt=media&token=9e70eee3-8c72-4b48-8d38-39beee86d400'
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
