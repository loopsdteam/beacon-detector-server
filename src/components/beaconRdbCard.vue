<template>
  <v-card>
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="headline">{{item.name}}</v-list-item-title>
        <v-list-item-subtitle>{{ item.address }}</v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn @click="showDetail = !showDetail" icon>
          <v-icon>{{ showDetail ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
    <v-card-text>
      <v-row align="center">
        <v-col cols="3">
          <v-avatar size="60">
            <v-icon x-large :color="time2level.color">{{ time2level.icon }}</v-icon>
          </v-avatar>
        </v-col>
        <v-col class="display-2" cols="9">
          {{ time2level.fromNow }}
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-if="showDetail">
      <v-divider></v-divider>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>처음 발견 시간</v-list-item-title>
          <v-list-item-subtitle>{{ new Date(item.startTime).toLocaleString() }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>마지막 발견 시간</v-list-item-title>
          <v-list-item-subtitle>{{ new Date(item.endTime).toLocaleString() }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>발견 횟수</v-list-item-title>
          <v-list-item-subtitle>{{ item.count }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>스캐너 정보</v-list-item-title>
          <v-list-item-subtitle>{{ item._scannerId.name }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>UUID</v-list-item-title>
          <v-list-item-subtitle>{{ item.uuid }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>RSSI</v-list-item-title>
          <v-list-item-subtitle>{{ item.rssi }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>Tx power</v-list-item-title>
          <v-list-item-subtitle>{{ item.txPower }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>Major</v-list-item-title>
          <v-list-item-subtitle>{{ item.major }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>minor</v-list-item-title>
          <v-list-item-subtitle>{{ item.minor }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: ['item'],
  data () {
    return {
      level: 3,
      showDetail: false
    }
  },
  computed: {
    time2level () {
      const levels = [
        {
          icon: 'mdi-emoticon-excited',
          color: 'success'
        },
        {
          icon: 'mdi-emoticon-happy',
          color: 'info'
        },
        {
          icon: 'mdi-emoticon-neutral',
          color: 'warning'
        },
        {
          icon: 'mdi-emoticon-dead',
          color: 'error'
        }
      ]
      const t = this.$moment(this.item.endTime)
      const dif = this.$moment().diff(t, 'minutes')
      let level = 3
      if (dif < 2) level = 0
      else if (dif >= 2 && dif < 5) level = 1
      else if (dif >= 5 && dif < 10) level = 2
      levels[level].fromNow = t.fromNow()

      return levels[level]
    }
  }
}
</script>
