<template>
  <v-card height="100%">
    <v-subheader>검사 현황</v-subheader>
    <v-divider></v-divider>
    <v-card-text>
      <v-list-item three-line v-for="item in inspectors" :key="item.inspector">
        <v-list-item-content>
          <v-list-item-title>
            검사자: {{item.inspector}}
          </v-list-item-title>
          <v-list-item-subtitle>
            최종검사시간: {{new Date(item.createdAt).toLocaleString()}}
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
      inspectors: []
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
