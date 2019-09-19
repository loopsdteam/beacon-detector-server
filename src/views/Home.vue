<template>
  <v-container fluid>
    <v-card>
      <v-toolbar dark
        color="teal">
        <v-toolbar-title>비콘 테스트</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-alert color="warning" dark dismissible border="left">다른 페이지 방문시 관리자의 승인이 필요할 수 있습니다.</v-alert>
        <v-row>
          <v-col cols="12" sm="6" md="4" lg="3" v-for="item in items" :key="item._id">
            <beacon-rdb-card :item="item"></beacon-rdb-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import beaconRdbCard from '@/components/beaconRdbCard'
export default {
  components: { beaconRdbCard },
  data () {
    return {
      ref: null,
      items: []
    }
  },
  created () {
    this.initRdb()
  },
  destroyed () {
    if (this.ref) this.ref.off()
  },
  methods: {
    initRdb () {
      this.ref = this.$firebase.database().ref('/device/beacons')
      this.ref.on('value', (doc) => {
        this.items = doc.val()
      })
    }

  }
}
</script>
