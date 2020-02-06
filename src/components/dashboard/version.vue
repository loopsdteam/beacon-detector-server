<template>
  <v-card height="100%" color="grey lighten-5">
    <v-subheader>버전 현황</v-subheader>
    <v-divider></v-divider>
    <v-card-text>
      <v-list-item three-line v-for="item in versions" :key="item.version">
        <v-list-item-content>
          <v-list-item-title>
            버전: {{item.version}}
          </v-list-item-title>
          <v-list-item-subtitle>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <span v-on="on">최종수신시간: {{$moment(item.updatedAt).fromNow()}}</span>
              </template>
              <span>{{new Date(item.updatedAt).toLocaleString()}}</span>
            </v-tooltip>
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-list-item-action-text>
            <!-- <v-chip color="primary">{{item.count}}</v-chip> -->
            {{item.count}} 대
          </v-list-item-action-text>
          <v-icon color="success" v-if="item.valid">mdi-check-circle-outline</v-icon>
          <v-icon color="error" v-else>mdi-alpha-x-circle-outline</v-icon>
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
      versions: []
    }
  },
  mounted () {
    this.items2value()
  },
  methods: {
    items2value () {
      let last = 0
      this.items.forEach(v => {
        let flag = false
        const vn = v.version.split('.').join('')
        if (vn > last) last = vn
        const item = {
          version: v.version,
          updatedAt: v.updatedAt,
          count: 1,
          valid: false
        }
        for (let w of this.versions) {
          if (v.version === w.version) {
            flag = true
            w.count++
            w.updatedAt = v.updatedAt
            break
          }
        }
        if (!flag) {
          this.versions.push(item)
        }
      })
      const vl = last.toString().split('').join('.')
      this.versions.forEach(v => {
        if (v.version === vl) v.valid = true
      })
    }
  }
}
</script>
