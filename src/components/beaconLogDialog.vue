<template>
  <v-dialog v-model="modal">
    <v-card :loading="loading">
      <v-card-title>
        beacon history
        <v-spacer></v-spacer>
        <v-btn @click="modal=false" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text v-if="loading" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-card-text>
      <v-card-text v-else>
        <v-row>
          <v-col cols="5">
            <v-simple-table
              dense
            >
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">no</th>
                    <th class="text-left">minutes</th>
                    <!-- <th class="text-left">startTime</th>
                    <th class="text-left">endTime</th> -->
                    <th class="text-left">count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in items" :key="i">
                    <td>{{ i }}</td>
                    <td>{{ item.minute }}</td>
                    <!-- <td>{{ item.startTime }}</td>
                    <td>{{ item.endTime }}</td> -->
                    <td>{{ item.count }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
          <v-col cols="7"></v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { head, last } from 'lodash'
export default {
  props: ['dialog', '_id'],
  data () {
    return {
      modal: false,
      loading: false,
      items: ''
    }
  },
  watch: {
    dialog (n) {
      this.modal = n
      if (n) this.fetch()
    },
    modal (n) {
      if (!n) this.$emit('closeDialog')
    }
  },
  methods: {
    fetch () {
      this.loading = true
      this.$axios.get('/device/beacon-log/' + this._id + '/' + this.$moment().format('YYYY-MM-DD'))
        .then(({ data }) => {
          // this.items = data
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
      const st = this.$moment(head(data).startTime)
      const et = this.$moment(last(data).endTime)

      this.items = []
      for (let i = 0; i < 1440; i++) {
        if (et.diff(st, 'minutes') < 0) break
        const item = {
          minute: st.toDate().toLocaleTimeString(),
          count: 0
        }
        const checks = []
        for (let j = 0; j < data.length; j++) {
          const v = data[j]
          if (this.$moment(v.startTime).format('HHmm') === st.format('HHmm')) {
            item.count += v.count
            checks.push(j)
          }
          if (checks.length > 1) break
        }
        if (checks.length) data.splice(checks[0], checks.length)
        this.items.push(item)
        st.add(1, 'minutes')
      }
    }
  }
}
</script>
