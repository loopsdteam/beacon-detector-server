<template>
  <v-container fluid>
    <v-card>
      <v-toolbar
        dark
        color="#92856E"
        flat
      >
        <v-toolbar-title>스캐너 목록</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-autocomplete
          v-model="searchModel"
          :loading="searchLoading"
          :items="searchItems"
          :search-input.sync="search"
          item-text="serialNo"
          item-value="serialNo"
          cache-items
          class="mx-4"
          flat
          hide-no-data
          hide-details
          label="제조일련번호"
          placeholder="제조일련번호 검색"
          solo-inverted
          clearable
        ></v-autocomplete>
        <v-btn icon @click="toggleHeaders">
          <v-icon v-text="viewDetail ? 'mdi-view-list' : 'mdi-view-grid'">mdi-pencil</v-icon>
        </v-btn>
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
        item-key="_id"
        :expanded.sync="expanded"
        :show-expand="!viewDetail"
      >
        <template v-slot:item.createdAt="{ item }">
          {{ new Date(item.createdAt).toLocaleString() }}
        </template>
        <template v-slot:item.updatedAt="{ item }">
          {{ new Date(item.updatedAt).toLocaleString() }}
        </template>
        <template v-slot:item.active="{ item }">
          <v-chip v-if="item.active" color="success" small label>사용</v-chip>
          <v-chip v-else color="warning" small label>미사용</v-chip>
        </template>
        <template v-slot:item.beaconLength="{ item }">
          <v-chip v-if="item.beaconLength > 0" color="success" small>{{item.beaconLength}}</v-chip>
          <v-chip v-else color="error" small>X</v-chip>
        </template>
        <template v-if="!viewDetail" v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" class="pa-2">
            <v-card color="transparent" flat>
              <v-list-item>
                <v-list-item-content>
                  고유번호: {{item._id}}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  검사자: {{item.inspector}}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  제조일: {{new Date(item.createdAt).toLocaleString()}}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  전송주기: {{item.cycle}}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  전송주소: {{item.targetURL}}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  모드: {{item.mode}}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  업데이트: &nbsp;
                  <v-switch
                    v-model="item.ota"
                    @change="changeOTA(item)"
                  ></v-switch>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  터널링: &nbsp;
                  <v-switch
                    v-model="item.tunnel"
                    @change="changeTunnel(item)"
                  ></v-switch>
                </v-list-item-content>
              </v-list-item>
              <v-card color="transparent" flat class="px-2">
                <v-subheader>
                  비고
                  <!-- <v-spacer></v-spacer> -->
                  <v-btn @click="noteSave(item)" icon color="primary">
                    <v-icon>mdi-content-save</v-icon>
                  </v-btn>
                </v-subheader>
                <v-textarea v-model="item.note" rows="3" outlined></v-textarea>
              </v-card>
            </v-card>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import _ from 'lodash'

export default {
  data () {
    return {
      headers: [
        { text: '제조일련번호', value: 'serialNo' },
        { text: '버전', value: 'version' },
        { text: '최종접속시간', value: 'updatedAt' },
        { text: '모드', value: 'mode' },
        { text: '상태', value: 'active' },
        { text: '비콘개수', value: 'beaconLength' },
        { text: '자세히', value: 'data-table-expand' }
        // { text: '_id', value: '_id' },
        // { text: 'inspector', value: 'inspector' },
        // { text: 'createdAt', value: 'createdAt' },
        // { text: 'ota', value: 'ota' },
        // { text: 'cycle', value: 'cycle' },
        // { text: 'targetURL', value: 'targetURL' },
        // { text: 'note', value: 'note' },
      ],
      items: [],
      totalCount: 0,
      loading: false,
      options: {
        sortBy: ['serialNo'],
        sortDesc: [false]
      },
      search: '',
      searchItems: [],
      searchModel: null,
      searchLoading: false,
      viewDetail: false,
      expanded: []
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
    toggleHeaders () {
      this.viewDetail = !this.viewDetail
      if (this.viewDetail) {
        this.headers = [
          { text: '제조일련번호', value: 'serialNo' },
          { text: '버전', value: 'version' },
          { text: '최종접속시간', value: 'updatedAt' },
          { text: '모드', value: 'mode' },
          { text: '상태', value: 'active' },
          { text: '비콘개수', value: 'beaconLength' },
          { text: '고유번호', value: '_id' },
          { text: '검사자', value: 'inspector' },
          { text: '제조일', value: 'createdAt' },
          { text: '전송주기', value: 'cycle' },
          { text: '업데이트', value: 'ota' },
          { text: '터널링', value: 'tunnel' },
          { text: '터널링 포트', value: 'tunnelPort' },
          { text: '터널링 시간', value: 'tunnelTime' },
          { text: '전송주소', value: 'targetURL' },
          { text: '비고', value: 'note' }
        ]
      } else {
        this.headers = [
          { text: '제조일련번호', value: 'serialNo' },
          { text: '버전', value: 'version' },
          { text: '최종접속시간', value: 'updatedAt' },
          { text: '상태', value: 'active' },
          { text: '비콘개수', value: 'beaconLength' },
          { text: '자세히', value: 'data-table-expand' }
          // { text: '모드', value: 'mode' },
          // { text: '_id', value: '_id' },
          // { text: 'inspector', value: 'inspector' },
          // { text: 'createdAt', value: 'createdAt' },
          // { text: 'ota', value: 'ota' },
          // { text: 'cycle', value: 'cycle' },
          // { text: 'targetURL', value: 'targetURL' },
          // { text: 'note', value: 'note' },
        ]
      }
    },
    list () {
      this.loading = true
      this.$axios.get('/v2/scanners', {
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

        this.$axios.get('/v2/scanners/search', {
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
    async changeOTA (item) {
      if (item.ota) {
        const r = await this.$swal.fire({
          title: '정말 변경하시겠습니까?',
          text: '해당 단말기의 원격 업데이트가 설정됩니다.',
          type: 'warning',
          confirmButtonText: '확인',
          cancelButtonText: '취소',
          showCancelButton: true
        })
        if (!r.value) {
          item.ota = false
          return
        }
      }
      this.loading = true

      try {
        await this.$axios.patch(`/v2/scanner/${item._id}/ota`, { ota: item.ota })
      } catch (e) {
        this.$toasted.global.error(e.message)
      } finally {
        this.loading = false
      }
    },
    async changeTunnel (item) {
      if (item.tunnel) {
        const r = await this.$swal.fire({
          title: '정말 변경하시겠습니까?',
          text: '해당 단말기 원격 터널링이 연결됩니다.',
          type: 'warning',
          confirmButtonText: '확인',
          cancelButtonText: '취소',
          showCancelButton: true
        })
        if (!r.value) {
          item.tunnel = false
          return
        }
      }
      this.loading = true

      try {
        await this.$axios.patch(`/v2/scanner/${item._id}/tunnel`, { tunnel: item.tunnel })
      } catch (e) {
        this.$toasted.global.error(e.message)
      } finally {
        this.loading = false
      }
    },
    async noteSave (item) {
      if (!item.note) return
      this.loading = true
      try {
        await this.$axios.patch(`/v2/scanner/${item._id}/note`, { note: item.note })
      } catch (e) {
        this.$toasted.global.error(e.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>

</style>
