<template>
  <v-card height="100%" color="grey lighten-5">
    <v-subheader>
      양산 차트
      <v-spacer></v-spacer>
      <span v-if="dates.length">{{dates[0].date}} ~ {{dates[dates.length - 1].date}}</span>
    </v-subheader>
    <v-divider></v-divider>
    <v-card-text>
      <v-sparkline
        :value="dates2value"
        :gradient="gradient"
        :smooth="radius || false"
        :padding="padding"
        :line-width="width"
        :stroke-linecap="lineCap"
        :gradient-direction="gradientDirection"
        :fill="fill"
        :type="type"
        :auto-line-width="autoLineWidth"
        auto-draw>
      </v-sparkline>
      <v-list-item v-for="item in dates" :key="item.date">
        <v-list-item-content>
          {{item.date}}
        </v-list-item-content>
        <v-list-item-action>
          <v-chip color="primary" small label>{{item.count}}</v-chip>
        </v-list-item-action>
      </v-list-item>
    </v-card-text>
  </v-card>
</template>
<script>
const gradients = [
  ['#222'],
  ['#42b3f4'],
  ['red', 'orange', 'yellow'],
  ['purple', 'violet'],
  ['#00c6ff', '#F0F', '#FF0'],
  ['#f72047', '#ffd200', '#1feaea']
]
export default {
  props: ['items'],
  data () {
    return {
      dates: [],

      width: 2,
      radius: 10,
      padding: 8,
      lineCap: 'round',
      gradient: gradients[5],
      value: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0],
      gradientDirection: 'top',
      gradients,
      fill: false,
      type: 'trend',
      autoLineWidth: false
    }
  },
  computed: {
    dates2value () {
      const vs = []
      this.dates.forEach(v => {
        vs.push(v.count)
      })
      return vs
    }
  },
  mounted () {
    this.items2value()
  },
  methods: {
    items2value () {
      this.items.forEach(v => {
        let flag = false
        const date = new Date(v.createdAt).toLocaleDateString()
        const item = {
          date: date,
          count: 1
        }
        for (let w of this.dates) {
          if (date === w.date) {
            flag = true
            w.count++
            break
          }
        }
        if (!flag) {
          this.dates.push(item)
        }
      })
    }
  }
}
</script>
