<template>
  <v-container fluid>
    <v-card>
      <v-toolbar
        dark
        color="teal"
      >
        <v-toolbar-title>Beacon management</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-autocomplete
          v-model="address"
          :loading="loadingSearch"
          :items="addresses"
          :search-input.sync="search"
          cache-items
          class="mx-4"
          flat
          hide-no-data
          hide-details
          label="Address"
          solo-inverted
          clearable
        ></v-autocomplete>
        <v-btn icon @click="list" :disabled="loading">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <!-- <v-data-iterator
          :items="items"
          :options.sync="options"
          :server-items-length="totalCount"
          :items-per-page="4"
          :loading="loading"
        >
          <template v-slot:default="props">
            <v-row>
              <v-col cols="12" v-if="loading" class="text-center">
                <v-progress-circular indeterminate></v-progress-circular>
                <p>데이터 로딩중</p>

              </v-col>
              <v-col cols="12"
                v-else
                v-for="item in props.items"
                :key="item.name"
                sm="6"
                md="4"
                lg="3"
              >
                <device-card :item="item"></device-card>
              </v-col>
            </v-row>
          </template>

        </v-data-iterator> -->
        <v-data-table
          :headers="headers"
          :items="items"
          :items-per-page="5"
          :options.sync="options"
          class="elevation-1"
        >
          <template v-slot:item.createdAt="{ item }">
            <!-- <v-chip :color="getColor(item.calories)" dark>{{ item.calories }}</v-chip> -->
            {{ new Date(item.createdAt).toLocaleString() }}
          </template>
          <template v-slot:item.updatedAt="{ item }">
            <!-- <v-chip :color="getColor(item.calories)" dark>{{ item.calories }}</v-chip> -->
            {{ new Date(item.updatedAt).toLocaleString() }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import _ from 'lodash'
// import DeviceCard from '@/components/deviceCard'

export default {
  // components: { DeviceCard },
  data () {
    return {
      headers: [
        // uid, email, displayName, emailVerified, photoURL, disabled, level
        { text: 'createdAt', value: 'createdAt' },
        { text: 'updatedAt', value: 'updatedAt' },
        { text: 'deviceId', value: 'deviceId' },
        { text: 'address', value: 'address' },
        { text: 'uuid', value: 'uuid' },
        { text: 'rssi', value: 'rssi' }
      ],
      items: [],
      totalCount: 0,
      loading: false,
      options: {
        sortBy: ['address'],
        sortDesc: [false]
      },
      search: '',
      addresses: [],
      address: null,
      loadingSearch: false
    }
  },
  watch: {
    options: {
      handler () {
        this.list()
      },
      deep: true
    },
    search (val) {
      val && val !== this.address && this.searchAddresses(val)
    },
    name (n, o) {
      if (n !== o) this.list()
    }
  },
  methods: {
    list () {
      this.loading = true
      this.$axios.get('/data/beacons', {
        params: {
          offset: this.options.page > 0 ? (this.options.page - 1) * this.options.itemsPerPage : 0,
          limit: this.options.itemsPerPage,
          order: this.options.sortBy[0],
          sort: this.options.sortDesc[0] ? 'desc' : 'asc',
          search: this.email
        }
      })
        .then(({ data }) => {
          console.log(data)
          this.totalCount = data.totalCount
          this.items = data.items
        })
        .catch(e => {
          this.$toasted.global.error(e.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    searchAddresses: _.debounce(
      function (val) {
        this.loadingSearch = true

        this.$axios.get('/data/beacons/search', {
          params: { search: this.search }
        })
          .then(({ data }) => {
            this.names = data
          })
          .catch(e => {
            this.$toasted.global.error(e.message)
          })
          .finally(() => {
            this.loadingSearch = false
          })
      },
      500
    )
  }
}
</script>
