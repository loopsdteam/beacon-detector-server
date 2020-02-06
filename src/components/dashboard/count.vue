<template>
  <v-card height="100%" color="grey lighten-5">
    <v-subheader>장치 개수</v-subheader>
    <v-divider></v-divider>
    <v-card-text>
      <v-list-item two-line>
        <v-list-item-avatar>
          <v-icon class="info lighten-2 white--text">mdi-raspberry-pi</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            전체:
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action-text>
          <v-chip color="success" small>{{count.total}} 대</v-chip>
        </v-list-item-action-text>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-avatar>
          <v-icon class="info lighten-2 white--text">mdi-check</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            활성화:
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action-text>
          <v-chip :color="count.total > count.active ? 'error' : 'success'" small>{{count.active}} 대</v-chip>
        </v-list-item-action-text>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-avatar>
          <v-icon class="info lighten-2 white--text">mdi-play</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            동작중:
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action-text>
          <v-chip :color="count.total > count.health ? 'error' : 'success'" small>{{count.health}} 대</v-chip>
        </v-list-item-action-text>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-avatar>
          <v-icon class="info lighten-2 white--text">mdi-bluetooth-transfer</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            총비콘개수:
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-chip color="primary" small>{{count.beaconLength}} 대</v-chip>
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
      this.count.total = this.items.length
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
