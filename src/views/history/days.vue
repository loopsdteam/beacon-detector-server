<template>
  <v-container fluid>
    <v-card>
      <v-toolbar
        dark
        color="#92856E"
        flat
      >
        <v-toolbar-title v-if="$vuetify.breakpoint.smAndUp">Beacon daily history</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-card flat color="transparent" width="180">
          <date-picker
            v-model="date"
            label="날짜"
            flat
            hide-details
            solo-inverted
          ></date-picker>
        </v-card>
        <v-card flat color="transparent" width="180">
          <v-combobox
            v-model="selectedScanner"
            :items="scanners"
            solo-inverted
            hide-details
            flat
            label="Scanner"
            class="mx-1"
            item-text="name"
            item-value="name"
            clearable
          ></v-combobox>
        </v-card>
        <v-card flat color="transparent" width="180">
          <v-autocomplete
            v-model="searchModel"
            :loading="searchLoading"
            :items="searchItems"
            :search-input.sync="search"
            item-text="address"
            item-value="address"
            cache-items
            class="mx-1"
            flat
            hide-no-data
            hide-details
            label="MAC Address"
            placeholder="MAC Address 검색"
            solo-inverted
            clearable
          ></v-autocomplete>
        </v-card>
        <v-btn icon @click="list" :disabled="loading"
          v-if="$vuetify.breakpoint.smAndUp">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <!-- <v-btn icon @click="exportToSpreadSheet" :loading="waitForDownload"
          v-if="$vuetify.breakpoint.smAndUp">
          <v-icon>mdi-download</v-icon>
        </v-btn> -->
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="10"
        :options.sync="options"
        :loading="loading"
        :server-items-length="totalCount"
        :footer-props="{
          showFirstLastPage: true,
          'items-per-page-options':[10, 20, 30, 100],
          'items-per-page-text': ''
        }"
        class="elevation-1 text-no-wrap"
      >
        <template v-slot:item.createdAt="{ item }">
          {{ new Date(item.createdAt).toLocaleString() }}
        </template>
        <template v-slot:item.address="{ item }">
          <v-chip color="primary" @click="openDialog(item)">{{item.address}}</v-chip>
        </template>
      </v-data-table>
      <day-dialog :dialog="dialog" :item="selectedItem" @closeDialog="dialog = false"></day-dialog>
    </v-card>
  </v-container>
</template>

<script>
import _ from 'lodash'
import datePicker from '@/components/date-picker'
import dayDialog from '@/components/dayDialog'

export default {
  components: {
    datePicker, dayDialog
  },
  data () {
    return {
      headers: [
        { text: 'name', value: '_beaconId.name', sortable: false },
        { text: 'address', value: 'address' },
        { text: 'scanner id', value: '_scannerId._id', sortable: false },
        { text: 'scanner name', value: '_scannerId.name', sortable: false },
        { text: 'createdAt', value: 'createdAt' },
        { text: 'count', value: 'count' },
        { text: '_beaconId', value: '_beaconId._id' }
      ],
      items: [],
      totalCount: 0,
      loading: false,
      options: {
        sortBy: ['createdAt'],
        sortDesc: [true]
      },
      search: '',
      date: this.$moment().format('YYYY-MM-DD'),
      searchItems: [],
      searchModel: null,
      searchLoading: false,
      waitForDownload: false,
      selectedScanner: '',
      scanners: [],
      selectedItem: null,
      dialog: false
    }
  },
  watch: {
    options: {
      handler () {
        this.list()
      },
      deep: true
    },
    date (val) {
      this.search = ''
      this.$nextTick(this.list)
    },
    search (val) {
      val && val !== this.searchModel && this.searchList(val)
    },
    searchModel (n, o) {
      if (n !== o) this.list()
    },
    selectedScanner (n, o) {
      if (n !== o) this.list()
    }
  },
  mounted () {
    this.listScanner()
  },
  methods: {
    async exportToSpreadSheet () {
      if (this.waitForDownload) return
      this.waitForDownload = true
      const response = await this.$axios.get('/device/beacon-days/download', {
        responseType: 'blob',
        params: {
          search: this.searchModel,
          date: this.date
        }
      })
      if (!window.navigator.msSaveOrOpenBlob) {
      // BLOB NAVIGATOR
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${this.date}.csv`)
        document.body.appendChild(link)
        link.click()
      } else {
      // BLOB FOR EXPLORER 11
        window.navigator.msSaveOrOpenBlob(new Blob([response.data]), `${this.date}.csv`)
      }
      this.waitForDownload = false
    },
    list () {
      this.loading = true
      this.$axios.get('/device/beacon-days', {
        params: {
          offset: this.options.page > 0 ? (this.options.page - 1) * this.options.itemsPerPage : 0,
          limit: this.options.itemsPerPage,
          order: this.options.sortBy[0],
          sort: this.options.sortDesc[0] ? '-1' : '1',
          search: this.searchModel,
          date: this.date,
          _scannerId: _.get(this.selectedScanner, '_id', '')
        }
      })
        .then(({ data }) => {
          this.totalCount = data.totalCount
          // console.log(data.items[0])
          this.items = data.items
        })
        .catch(e => {
          this.$toasted.global.error(e.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    searchList: _.debounce(
      function (val) {
        this.searchLoading = true

        this.$axios.get('/device/beacons/search', {
          params: { search: this.search, date: this.date }
        })
          .then(({ data }) => {
            this.searchItems = data
          })
          .catch(e => {
            this.$toasted.global.error(e.message)
          })
          .finally(() => {
            this.searchLoading = false
          })
      },
      500
    ),
    listScanner () {
      this.$axios.get('/device/scanners', {
        params: {
          offset: 0, limit: 100, order: 'name', sort: 1, search: ''
        }
      })
        .then(({ data }) => {
          this.scanners = data.items
        })
        .catch(e => {
          this.$toasted.global.error(e.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    openDialog (item) {
      this.selectedItem = item
      // console.log(item)
      this.dialog = true
    }
  }
}
</script>
