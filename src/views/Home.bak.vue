<template>
  <v-container fluid>
    <v-card>
      <v-toolbar dark
        color="teal">
        <v-toolbar-title>비콘 테스트</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12" v-if="loading" class="text-center">
            <v-progress-circular indeterminate></v-progress-circular>
            <p>데이터 로딩중</p>
          </v-col>
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
      items: [],
      loading: true
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
        if (this.loading) this.loading = false
      })
    }

  }
}
</script>
