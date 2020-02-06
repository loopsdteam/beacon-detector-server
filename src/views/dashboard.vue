<template>
  <v-container fluid>
    <v-card :loading="loading">
      <v-toolbar color="#92856E" dark flat dense>
        등하원 수집기 현황
        <v-spacer></v-spacer>
        <v-btn icon @click="list" >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text v-if="loading">
        <v-card color="transparent" flat>
          <v-card-text class="text-center">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-card-text>
          <v-card-text class="text-center">
            데이터를 수신중입니다.
          </v-card-text>
        </v-card>
      </v-card-text>
      <v-card-text v-else>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <dashboard-count :items="items"></dashboard-count>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <dashboard-inspect :items="items"></dashboard-inspect>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <dashboard-version :items="items"></dashboard-version>
          </v-col>
          <v-col cols="12" sm="8">
            <dashboard-date :items="items"></dashboard-date>
          </v-col>
          <v-col cols="12" sm="4">
            <dashboard-app :items="items"></dashboard-app>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import DashboardCount from '@/components/dashboard/count'
import DashboardInspect from '@/components/dashboard/inspect'
import DashboardVersion from '@/components/dashboard/version'
import DashboardDate from '@/components/dashboard/date'
import DashboardApp from '@/components/dashboard/app'
export default {
  components: {
    DashboardCount,
    DashboardInspect,
    DashboardVersion,
    DashboardDate,
    DashboardApp
  },
  data () {
    return {
      items: [],
      loading: false
    }
  },
  mounted () {
    this.list()
  },
  methods: {
    list () {
      this.loading = true
      this.$axios.get('/v2/scanners', {
        params: {
          offset: 0,
          limit: 100,
          order: 'serialNo',
          sort: '1'
        }
      })
        .then(({ data }) => {
          this.items = data.items
        })
        .catch(e => {
          this.$toasted.global.error(e.message)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }

}
</script>
