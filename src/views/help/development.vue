<template>
  <v-container fluid>
    <v-card>
      <v-toolbar color="info" flat dense dark>
        <v-toolbar-title class="text-capitalize">Development pages</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text>
        <!-- <v-alert type="warning" border="left">iOS용 앱은 심사중입니다.</v-alert> -->
        <v-row>
          <v-col cols="12" sm="6" md="3" v-for="item in items" :key="item.url">
            <v-card outlined>
              <v-card-title v-text="item.title"></v-card-title>
              <v-card-subtitle v-text="item.subtitle"></v-card-subtitle>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text :to="item.url">
                  go
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      items: [
        {
          title: 'Manage Scanners',
          subtitle: 'Test scanner list',
          url: '/device/scanners',
          icon: 'mdi-raspberry-pi'
        },
        {
          title: 'Manage Beacons',
          subtitle: 'Test beacon list',
          url: '/device/beacons',
          icon: 'mdi-bluetooth-transfer'
        },
        {
          title: 'History Beacons',
          subtitle: 'Test beacon data',
          url: '/history/beacons',
          icon: 'mdi-format-list-bulleted'
        },
        {
          title: 'History day',
          subtitle: 'Recieve beacons per day',
          url: '/history/days',
          icon: 'mdi-calendar'
        }
      ]
    }
  }
}
</script>
