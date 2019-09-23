<template>
  <v-container fluid>
    <v-card>
      <v-toolbar
        dark
        color="teal"
      >
        <v-toolbar-title>Beacon list</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-autocomplete
          v-model="searchModel"
          :loading="searchLoading"
          :items="searchItems"
          :search-input.sync="search"
          item-text="address"
          item-value="address"
          cache-items
          class="mx-4"
          flat
          hide-no-data
          hide-details
          label="MAC Address"
          placeholder="MAC Address 검색"
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
          :items-per-page="10"
          :options.sync="options"
          :server-items-length="totalCount"
          class="elevation-1"
          :loading="loading"
          :footer-props="{'items-per-page-options':[10, 20, 30, 100]}"
        >
          <!-- <template v-slot:item.createdAt="{ item }">
          </template> -->
          <template v-slot:item.name="props">
            <v-edit-dialog
              :return-value.sync="props.item.name"
              @save="save(props.item)"
              large
            >
              <v-btn color="primary" text :disabled="loading">{{ props.item.name }}</v-btn>
              <template v-slot:input>
                <v-text-field
                  v-model="props.item.name"
                  label="Edit name"
                  single-line
                  hide-details
                ></v-text-field>
                <!-- <v-card flat>
                  <v-card-text>
                    <v-text-field
                      v-model="props.item.name"
                      label="Edit name"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="warning">변경</v-btn>
                    <v-btn color="error">삭제</v-btn>
                  </v-card-actions>
                </v-card> -->
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:item.address="props">
            <v-chip :close="!loading" @click:close="del(props.item)">{{props.item.address}}</v-chip>
            <!-- <v-icon color="error" icon><v-icon>mdi-delete</v-icon></v-btn> -->
          </template>
          <!-- <template v-slot:item.createdAt="props">
            {{ new Date(props.item.createdAt).toLo }}
          </template> -->
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
        { text: 'name', value: 'name' },
        { text: '_scannerId.name', value: '_scannerId.name', sortable: false },
        { text: 'address', value: 'address' },
        { text: 'createdAt', value: 'createdAt' },
        { text: 'updatedAt', value: 'updatedAt' },
        { text: 'uuid', value: 'uuid' },
        { text: 'startTime', value: 'startTime' },
        { text: 'endTime', value: 'endTime' },
        { text: 'count', value: 'count' },
        { text: 'rssi', value: 'rssi' },
        { text: 'txPower', value: 'txPower' },
        { text: 'major', value: 'major' },
        { text: 'minor', value: 'minor' }
      ],
      items: [],
      totalCount: 0,
      loading: false,
      options: {
        sortBy: ['address'],
        sortDesc: [false]
      },
      search: '',
      searchItems: [],
      searchModel: null,
      searchLoading: false,
      ref: null
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
      this.$axios.get('/device/beacons', {
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
          data.items.forEach(v => {
            v.createdAt = new Date(v.createdAt).toLocaleString()
            v.updatedAt = new Date(v.updatedAt).toLocaleString()
            v.startTime = new Date(v.startTime).toLocaleString()
            v.endTime = new Date(v.endTime).toLocaleString()
          })
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
    ),
    save (item) {
      this.loading = true
      this.$axios.patch('/device/beacon/' + item._id, { name: item.name })
        .catch(e => {
          this.$toasted.global.error(e.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    async del (item) {
      const r = await this.$swal.fire({
        title: '정말 삭제하시겠습니까?',
        text: '삭제 후 되돌릴 수 없습니다.',
        type: 'error',
        // confirmButtonText: 'Cool',
        showCancelButton: true
      })
      if (!r.value) return
      this.loading = true
      await this.$axios.delete('/device/beacon/' + item._id)
      this.loading = false
      this.list()
    }
  }
}
</script>
