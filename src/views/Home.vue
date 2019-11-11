<template>
  <v-container fluid>
    <v-card>
      <v-toolbar dark
        color="teal">
        <v-toolbar-title>Beacon Scanned</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <firebase-subscriber collection="beacons" sort="time" order="desc">
          <template v-slot="{ items, error }">
            <div v-if="error">
              <v-alert type="error">{{ error.message }}</v-alert>
            </div>
            <div v-else>
              <v-row>
                <v-col cols="12" sm="6" md="4" lg="3" v-for="item in items" :key="item.id">
                  <scanned-beacon-card :item="item.data" :item-id="item.id"></scanned-beacon-card>
                </v-col>
              </v-row>
            </div>
          </template>
        </firebase-subscriber>
      </v-card-text>
    </v-card>

    <v-card>
      <v-toolbar dark
        color="teal">
        <v-toolbar-title>RFID Scanned</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <firebase-subscriber collection="rfids" sort="name" order="desc">
          <template v-slot="{ items, error }">
            <div v-if="error">
              <v-alert type="error">{{ error.message }}</v-alert>
            </div>
            <div v-else>
              <v-row>
                <v-col cols="12" sm="6" md="4" lg="3" v-for="item in items" :key="item.id">
                  <scanned-rfid-card :item="item.data" :item-id="item.id"></scanned-rfid-card>
                </v-col>
              </v-row>
            </div>
          </template>
        </firebase-subscriber>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import scannedRfidCard from '@/components/scanned-rfid-card'
import scannedBeaconCard from '@/components/scanned-beacon-card'
import firebaseSubscriber from '@/components/firebase-subscriber'
export default {
  components: {
    firebaseSubscriber,
    scannedRfidCard,
    scannedBeaconCard
  },
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
