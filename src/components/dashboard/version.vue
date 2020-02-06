<template>
  <v-card height="100%">
    <v-subheader>버전 현황</v-subheader>
    <v-divider></v-divider>
    <v-card-text>
      <v-list-item three-line v-for="item in versions" :key="item.version">
        <v-list-item-content>
          <v-list-item-title>
            버전: {{item.version}}
          </v-list-item-title>
          <v-list-item-subtitle>
            최종수신시간: {{new Date(item.updatedAt).toLocaleString()}}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action-text>
          <v-chip color="primary">{{item.count}}</v-chip>
        </v-list-item-action-text>
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
      this.items.forEach(v => {
        let flag = false
        const item = {
          version: v.version,
          updatedAt: v.updatedAt,
          count: 1
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
    }
  }
}
</script>
