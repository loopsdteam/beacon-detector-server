<template>
  <v-container fluid>
    <v-card>
      <v-toolbar
        dark
        color="teal"
      >
        <v-toolbar-title>Scanner list</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-autocomplete
          v-model="searchModel"
          :loading="searchLoading"
          :items="searchItems"
          :search-input.sync="search"
          item-text="name"
          item-value="name"
          cache-items
          class="mx-4"
          flat
          hide-no-data
          hide-details
          label="Name"
          placeholder="이름 검색"
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
                :key="item._id"
                sm="6"
                md="4"
                lg="3"
              >
                <scanner-card :item="item" @refresh="list"></scanner-card>
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
import scannerCard from '@/components/scannerCard'

export default {
  components: { scannerCard },
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
      searchItems: [],
      searchModel: null,
      searchLoading: false
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
      val && val !== this.searchModel && this.searchList(val)
    },
    searchModel (n, o) {
      if (n !== o) this.list()
    }
  },
  methods: {
    list () {
      this.loading = true
      this.$axios.get('/device/scanners', {
        params: {
          offset: this.options.page > 0 ? (this.options.page - 1) * this.options.itemsPerPage : 0,
          limit: this.options.itemsPerPage,
          order: this.options.sortBy[0],
          sort: this.options.sortDesc[0] ? '-1' : '1',
          search: this.searchModel
        }
      })
        .then(({ data }) => {
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
    searchList: _.debounce(
      function (val) {
        this.searchLoading = true

        this.$axios.get('/device/scanners/search', {
          params: { search: this.search }
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
    )
  }
}
</script>

<style>

</style>
