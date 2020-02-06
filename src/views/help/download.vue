<template>
  <v-container fluid>
    <v-card>
      <v-toolbar color="info" flat dense dark>
        <v-toolbar-title class="text-capitalize">LBS Tool(설정앱) 다운로드</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text>
        <!-- <v-alert type="warning" border="left">iOS용 앱은 심사중입니다.</v-alert> -->
        <v-row>
          <v-col cols="12" sm="6">
            <v-card outlined>
              <v-subheader>앱스토어</v-subheader>
              <v-list-item v-for="(item, i) in items" :key="i">
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                  <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn :href="item.url" target="_blank" icon color="primary">
                    <v-icon>{{item.icon}}</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-divider></v-divider>
              <v-subheader>사용법</v-subheader>
              <v-card-text >
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
          </v-col>
          <v-col cols="12" sm="6">
            <v-card outlined ref="movie">
              <v-subheader>영상 확인</v-subheader>
              <v-card-text ref="video" class="text-center">
                <video-player  class="video-player-box"
                  ref="videoPlayer"
                  :options="playerOptions"
                  :playsinline="true"
                  customEventName="customstatechangedeventname">
                </video-player>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

      </v-card-text>
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
      items: [
        {
          title: 'LBS Tool 1.0.2+6 안드로이드앱',
          subtitle: '출시일: 2020.2.4',
          url: 'https://play.google.com/store/apps/details?id=com.loopsdteam.lbs_app',
          icon: 'mdi-google-play'
        },
        {
          title: 'LBS Tool 1.0.2+6 iOS, iPadOS앱',
          subtitle: '출시일: 2020.2.6',
          url: 'https://apps.apple.com/kr/app/등하원수집기/id1496729216',
          icon: 'mdi-apple-ios'
        }
      ],
      playerOptions: {
        // videojs options
        autoplay: false,
        muted: true,
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: 'video/mp4',
          src: 'https://firebasestorage.googleapis.com/v0/b/beacon-detect.appspot.com/o/LBS%20Tool%201.0.0(6).mov?alt=media&token=dd88a090-de47-4ee3-9ecf-9c55d7e2e6bc'
        }],
        width: this.autoWidth
        // poster: '/static/images/author.jpg'
      },
      docs: [
        '비콘 스캐너 전원 연결',
        '앱스토어 다운로드',
        '모바일 앱(LBS Tool) 실행',
        '검색 후 해당 제조번호의 장치로 접속',
        '와이파이 설정 버튼을 클릭',
        '해당 장소의 와이파이 정보를 작성 후 저장',
        '우측 상단에 새로고침을 클릭해서 와이파이가 정상인지 확인'
      ]
    }
  },
  computed: {
    autoWidth () {
      // console.log(this.$refs.movie.clientWidth)
      return this.$refs.video.clientWidth - 32
    }
  },
  mounted () {
    this.playerOptions.width = this.$refs.video.clientWidth - 32
  },
  methods: {
  }
}
</script>
