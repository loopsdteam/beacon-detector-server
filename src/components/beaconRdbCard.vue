<template>
  <v-card>
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="headline">{{item.name}}</v-list-item-title>
        <v-list-item-subtitle>{{ item.address }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-card-text>
      <v-row align="center">
        <v-col cols="3">
          <v-avatar size="60">
            <v-icon x-large :color="time2level.color">{{ time2level.icon }}</v-icon>
          </v-avatar>
        </v-col>
        <v-col class="display-2" cols="9">
          <!-- {{ $moment(item.endTime).fromNow() }} -->
          {{ time2level.fromNow }}
        </v-col>
      </v-row>
    </v-card-text>

  </v-card>
</template>
<script>
export default {
  props: ['item'],
  // filters: {
  //   fromNow (t) {
  //     return this.$moment(t).fromNow()
  //   }
  // },
  data () {
    return {
      level: 3
    }
  },
  computed: {
    time2level () {
      const levels = [
        {
          icon: 'mdi-emoticon-excited',
          color: 'success'
        },
        {
          icon: 'mdi-emoticon-happy',
          color: 'info'
        },
        {
          icon: 'mdi-emoticon-neutral',
          color: 'warning'
        },
        {
          icon: 'mdi-emoticon-dead',
          color: 'error'
        }
      ]
      const t = this.$moment(this.item.endTime)
      const dif = this.$moment().diff(t, 'minutes')
      let level = 3
      if (dif < 2) level = 0
      else if (dif >= 2 && dif < 5) level = 1
      else if (dif > 5 && dif < 10) level = 2
      levels[level].fromNow = t.fromNow()

      return levels[level]
    }
  }
}
</script>
