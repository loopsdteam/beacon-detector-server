<template>
  <v-card height="100%">
    <v-subheader>장치 개수</v-subheader>
    <v-divider></v-divider>
    <v-card-text>
      <v-list-item two-line>
        <v-list-item-content>
          전체:
        </v-list-item-content>
        <v-list-item-action-text>
          <v-chip color="primary">{{count.total}}</v-chip>
        </v-list-item-action-text>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-content>
          활성화:
        </v-list-item-content>
        <v-list-item-action-text>
          <v-chip color="primary">{{count.active}}</v-chip>
        </v-list-item-action-text>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-content>
          동작중:
        </v-list-item-content>
        <v-list-item-action-text>
          <v-chip color="primary">{{count.health}}</v-chip>
        </v-list-item-action-text>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-content>
          총비콘개수:
        </v-list-item-content>
        <v-list-item-action-text>
          <v-chip color="primary">{{count.beaconLength}}</v-chip>
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
      count: {
        total: 0,
        active: 0,
        health: 0,
        beaconLength: 0
      }
    }
  },
  mounted () {
    this.items2value()
  },
  methods: {
    items2value () {
      this.items.forEach(v => {
        if (v.active) this.count.active++
        if (v.beaconLength) {
          this.count.health++
          this.count.beaconLength += v.beaconLength
        }
      })
    }
  }
}
</script>
