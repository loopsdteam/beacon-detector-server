<template>
  <v-container fluid>
    <v-card>
      <v-toolbar
        dark
        color="teal"
      >
        <v-toolbar-title>Device management</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-autocomplete
          v-model="name"
          :loading="loadingSearch"
          :items="names"
          :search-input.sync="search"
          cache-items
          class="mx-4"
          flat
          hide-no-data
          hide-details
          label="Name"
          solo-inverted
          clearable
        ></v-autocomplete>
        <v-btn icon @click="list" :disabled="loading">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-data-iterator
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

        </v-data-iterator>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import _ from 'lodash'
import DeviceCard from '@/components/deviceCard'

export default {
  components: { DeviceCard },
  data () {
    return {
      headers: [
        {
          text: 'uid',
          value: 'uid'
        },
        // uid, email, displayName, emailVerified, photoURL, disabled, level
        { text: 'name', value: 'name' },
        { text: 'displayName', value: 'displayName' },
        { text: 'photoURL', value: 'photoURL' },
        { text: 'level', value: 'level' }
      ],
      items: [],
      totalCount: 0,
      loading: false,
      options: {
        sortBy: ['name'],
        sortDesc: [false]
      },
      search: '',
      names: [],
      name: null,
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
      val && val !== this.name && this.searchNames(val)
    },
    name (n, o) {
      if (n !== o) this.list()
    }
  },
  methods: {
    list () {
      this.loading = true
      this.$axios.get('/admin/devices', {
        params: {
          offset: this.options.page > 0 ? (this.options.page - 1) * this.options.itemsPerPage : 0,
          limit: this.options.itemsPerPage,
          order: this.options.sortBy[0],
          sort: this.options.sortDesc[0] ? 'desc' : 'asc',
          search: this.email
        }
      })
        .then(({ data }) => {
          this.totalCount = data.totalCount
          this.items = data.items
          console.log(this.items)
        })
        .catch(e => {
          this.$toasted.global.error(e.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    searchEmails: _.debounce(
      function (val) {
        this.loadingSearch = true

        this.$axios.get('/admin/devices/search', {
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
      // 사용자가 입력을 기다리는 시간(밀리세컨드) 입니다.
      500
    )
  }
}
</script>

<style>

</style>
