<template>
  <v-container fluid>
    <v-alert border="left" prominent dismissible  outlined type="info">
      V0.4(18.12.19) updated
      <ul>
        <li>Scanner로 검색 추가</li>
        <li>Group으로 검색 추가</li>
        <li>Group 지정: group 클릭</li>
        <li>Data 확인: Address 클릭</li>
      </ul>
    </v-alert>
    <v-card>
      <v-toolbar
        dark
        color="teal"
      >
        <v-toolbar-title>Beacon list</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-card flat color="transparent" width="180">
          <v-combobox
            v-model="selectedScanner"
            :items="scanners"
            solo-inverted
            hide-details
            flat
            label="Scanner"
            class="mx-2"
            item-text="name"
            item-value="name"
            clearable
          ></v-combobox>
        </v-card>
        <v-card flat color="transparent" width="180">
          <v-combobox
            v-model="selectedGroup"
            :items="groups"
            solo-inverted
            hide-details
            flat
            label="Group"
            class="mx-2"
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
            class="mx-2"
            flat
            hide-no-data
            hide-details
            label="MAC Address"
            placeholder="MAC Address 검색"
            solo-inverted
            clearable
          ></v-autocomplete>
        </v-card>
        <v-btn icon @click="list" :disabled="loading">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="10"
        :options.sync="options"
        :server-items-length="totalCount"
        class="elevation-1"
        :loading="loading"
        :footer-props="{
          showFirstLastPage: true,
          'items-per-page-options':[10, 20, 30, 100],
          'items-per-page-text': ''
        }"
      >
        <!-- <template v-slot:item.createdAt="{ item }">
        </template> -->
        <template v-slot:item.name="props">
          <v-edit-dialog
            :return-value.sync="props.item.name"
            @save="saveName(props.item)"
            large
          >
            <a color="primary" text :disabled="loading">{{ props.item.name }}</a>
            <template v-slot:input>
              <v-text-field
                v-model="props.item.name"
                label="Edit name"
                single-line
                hide-details
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:item.group="props">
          <v-edit-dialog
            :return-value.sync="props.item.group"
            @save="saveGroup(props.item)"
            large
          >
            <a color="primary" text :disabled="loading">{{ props.item.group ? props.item.group : 'None' }}</a>
            <template v-slot:input>
              <v-text-field
                v-model="props.item.group"
                label="Edit group"
                single-line
                hide-details
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:item.address="props">
          <v-chip color="primary" :close="!loading" @click="openDialog(props.item)" @click:close="del(props.item)">{{props.item.address}}</v-chip>
          <!-- <v-icon color="error" icon><v-icon>mdi-delete</v-icon></v-btn> -->
        </template>
        <!-- <template v-slot:item.createdAt="props">
          {{ new Date(props.item.createdAt).toLo }}
        </template> -->
      </v-data-table>
      <beacon-log-dialog :dialog="dialog" :item="selectedItem" @closeDialog="dialog = false"></beacon-log-dialog>
    </v-card>
  </v-container>
</template>

<script>
import _ from 'lodash'
import beaconLogDialog from '@/components/beaconLogDialog'
// import DeviceCard from '@/components/deviceCard'

export default {
  components: { beaconLogDialog },
  data () {
    return {
      headers: [
        { text: 'name', value: 'name' },
        { text: 'group', value: 'group' },
        { text: '_scannerId.name', value: '_scannerId.name', sortable: false },
        { text: 'dayCount', value: 'dayCount', sortable: false },
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
      ref: null,
      selectedGroup: '',
      groups: [],
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
    search (val) {
      val && val !== this.searchModel && this.searchList(val)
    },
    searchModel (n, o) {
      if (n !== o) this.list()
    },
    selectedScanner (n, o) {
      if (n !== o) this.list()
    },
    selectedGroup (n, o) {
      if (n !== o) this.list()
    }
  },
  mounted () {
    this.listScanner()
    this.listGroup()
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
          search: this.searchModel,
          group: this.selectedGroup,
          _scannerId: _.get(this.selectedScanner, '_id', '')
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
          // this.items.forEach(v => {
          //   if (v.group && !this.groups.includes(v.group)) this.groups.push(v.group)
          // })
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
    saveName (item) {
      this.loading = true
      this.$axios.patch('/device/beacon/' + item._id + '/name', { name: item.name })
        .catch(e => {
          this.$toasted.global.error(e.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    saveGroup (item) {
      this.loading = true
      this.$axios.patch('/device/beacon/' + item._id + '/group', { group: item.group })
        .catch(e => {
          this.$toasted.global.error(e.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
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
    listGroup () {
      this.$axios.get('/device/groups')
        .then(({ data }) => {
          this.groups = data
        })
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
    },
    openDialog (item) {
      this.selectedItem = item
      this.dialog = true
    }
  }
}
</script>
