<template>
  <v-card height="100%" color="grey lighten-5">
    <v-subheader>
      검사 현황
      <v-spacer></v-spacer>
      <v-btn icon v-if="inspectors.length > 3" @click="show = !show">
        <v-icon v-text="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
      </v-btn>
    </v-subheader>
    <v-divider></v-divider>
    <v-card-text>
      <v-list-item three-line v-for="item in activeInspectors" :key="item.inspector">
        <v-list-item-avatar>
          <v-icon :color="$moment().diff($moment(item.createdAt), 'days') > 1 ? 'warning' : 'success'">mdi-account</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            검사자: {{item.inspector}}
          </v-list-item-title>
          <v-list-item-subtitle>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <span v-on="on">최종검사시간: {{$moment(item.createdAt).fromNow()}}</span>
              </template>
              <span>{{new Date(item.createdAt).toLocaleString()}}</span>
            </v-tooltip>
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-list-item-action-text>
            <!-- <v-chip color="primary">{{item.count}}</v-chip> -->
            {{item.count}} 대
          </v-list-item-action-text>
          <v-icon color="success">mdi-check-circle-outline</v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: ['items'],
  data () {
    return {
      inspectors: [],
      show: false
    }
  },
  computed: {
    activeInspectors () {
      if (!this.inspectors.length) return []
      if (this.show) return this.inspectors
      const inspectors = []
      for (let i = 0; i < 3; i++) inspectors.push(this.inspectors[i])
      return inspectors
    }
  },
  mounted () {
    this.items2value()
  },
  methods: {
    items2value () {
      this.items.forEach(v => {
        let flag = false
        const item = {
          inspector: v.inspector,
          createdAt: v.createdAt,
          count: 1
        }
        for (let w of this.inspectors) {
          if (v.inspector === w.inspector) {
            flag = true
            w.count++
            w.createdAt = v.createdAt
            break
          }
        }
        if (!flag) {
          this.inspectors.push(item)
        }
      })
    }
  }
}
</script>
