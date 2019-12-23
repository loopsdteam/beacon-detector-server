<template>
  <v-dialog v-model="modal">
    <v-card :loading="loading">
      <v-card-title>
        {{ title }}
        <v-spacer></v-spacer>
        <v-btn @click="modal=false" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text v-if="loading" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
        <v-card flat color="transparent" class="text-center">
          데이터 로드 중입니다
        </v-card>
      </v-card-text>
      <v-card-text v-else>
        <v-row>
          <v-col cols="12">
            <v-chip color="error" v-for="item in errItems" :key="item.minute" class="ma-1">{{ item.minute }}</v-chip>
          </v-col>
          <v-col cols="12" sm="5">
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">minutes</th>
                    <th class="text-left">count</th>
                    <th class="text-left">rssi</th>
                    <th class="text-left">check</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in items" :key="item.minute">
                    <td>{{ item.minute }}</td>
                    <td>{{ item.count }}</td>
                    <td>{{ item.rssi }}</td>
                    <td>{{ item.check }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
          <v-col cols="12" sm="7">
            <line-chart :chartData="chartData" :chartOptions="chartOptions"></line-chart>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="modal=false" color="primary">
          <v-icon left>mdi-close</v-icon>
          닫기
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { head, last } from 'lodash'
import lineChart from '@/js/lineChart.js'

export default {
  components: { lineChart },
  props: ['dialog', 'item'],
  data () {
    return {
      title: 'loading',
      modal: false,
      loading: false,
      items: [],
      errItems: [],
      chartData: {
        labels: [],
        datasets: [
          {
            type: 'line',
            fill: false,
            label: 'count',
            backgroundColor: '#f87979',
            data: []
          },
          {
            type: 'line',
            fill: false,
            label: 'rssi',
            backgroundColor: '#60bf5a',
            data: []
          }
        ]
      },
      chartOptions: {
      }
    }
  },
  watch: {
    dialog (n) {
      this.modal = n
      if (n) this.fetch()
    },
    modal (n) {
      if (!n) this.$emit('closeDialog')
    },
    item: {
      handler (n) {
        this.title = n.name
      },
      deep: true
    }
  },
  methods: {
    fetch () {
      this.loading = true
      const _id = this.item._beaconId._id
      const _scannerId = this.item._scannerId._id

      this.$axios.get('/device/beacon-log/' + _scannerId + '/' + _id + '/' + this.$moment(this.item.createdAt).format('YYYY-MM-DD'))
        .then(({ data }) => {
          if (!data.length) throw Error('데이터가 없습니다')
          this.data2items(data)
        })
        .catch(e => {
          this.$toasted.global.error(e.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    data2items (data) {
      this.items = []
      this.errItems = []
      this.chartData.labels = []
      this.chartData.datasets[0].data = []
      this.chartData.datasets[1].data = []
      const st = this.$moment(head(data).startTime)
      const et = this.$moment(last(data).endTime)

      for (let i = 0; i < 1440; i++) {
        if (et.diff(st, 'minutes') < 0) break
        const item = {
          minute: st.format('HH:mm'),
          count: 0,
          rssi: 0,
          check: 0
        }
        const checks = []
        for (let j = 0; j < data.length; j++) {
          const v = data[j]
          if (this.$moment(v.endTime).format('HHmm') === st.format('HHmm')) {
            item.count += v.count
            item.rssi += v.rssi
            checks.push(j)
          }
          if (checks.length > 1) break
        }
        if (checks.length) {
          data.splice(checks[0], checks.length)
          item.rssi = item.rssi / checks.length
        }
        item.check = checks.length
        this.items.push(item)
        if (!item.count && i > 0) this.errItems.push(item)
        this.chartData.labels.push(item.minute)
        this.chartData.datasets[0].data.push(item.count)
        this.chartData.datasets[1].data.push(item.rssi)
        st.add(1, 'minutes')
      }
    }
  }
}
</script>
