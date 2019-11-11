<template>
  <v-card>
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="headline">{{ item.name || name }}</v-list-item-title>
        <v-list-item-subtitle>{{ itemId }}</v-list-item-subtitle>
      </v-list-item-content>
      <!-- <v-list-item-action>
        <v-btn @click="showDetail = !showDetail" icon>
          <v-icon>{{ showDetail ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-list-item-action> -->
    </v-list-item>
    <v-card-text class="pb-0">
      <v-row align="center">
        <v-col cols="3">
          <v-avatar size="60">
            <v-img :src="photo"></v-img>
          </v-avatar>
        </v-col>
        <v-col cols="9">
          <div>Age: {{ item.age }}</div>
          <div>Gender: {{ item.sex }}</div>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text class="pt-0">
      <v-row align="center">
        <v-col cols="3">
          <v-avatar size="60">
            <v-icon
              x-large
              :color="color">
              {{ icon }}
            </v-icon>
          </v-avatar>
        </v-col>
        <v-col class="body-1" cols="9">
          {{ $moment(item.time.toDate()).fromNow() }}
        </v-col>
      </v-row>
    </v-card-text>
    <!-- <v-card-text v-if="showDetail">
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
    </v-card-text> -->
  </v-card>
</template>
<script>
import random from 'random-name'
import image1 from '@/assets/images/s1_img/adult_men.png'
import image2 from '@/assets/images/s1_img/adult_women.png'
export default {
  props: ['item', 'itemId'],
  data () {
    return {
      level: 3,
      showDetail: false,
      name: random()
    }
  },
  computed: {
    photo () {
      const symbol = {
        'adult_men.png': image1,
        'adult_women.png': image2
      }

      return symbol[this.item.photo]
    },
    icon () {
      const diff = Math.abs(this.$moment(this.item.time.toDate()).diff(new Date(), 'minute'))

      if (diff < 1) {
        return 'mdi-emoticon-excited'
      } else if (diff < 2) {
        return 'mdi-emoticon-happy'
      } else if (diff < 3) {
        return 'mdi-emoticon-neutral'
      } else {
        return 'mdi-emoticon-dead'
      }
    },
    color () {
      const diff = Math.abs(this.$moment(this.item.time.toDate()).diff(new Date(), 'minute'))

      if (diff < 1) {
        return 'success'
      } else if (diff < 2) {
        return 'info'
      } else if (diff < 3) {
        return 'warning'
      } else {
        return 'error'
      }
    }
  }
}
</script>
