<template>
  <v-container fluid>
    <v-card>
      <v-toolbar color="info" flat dense dark>
        <v-toolbar-title class="text-capitalize">Android App download</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-alert type="info" border="left">iOS용 앱은 심사중입니다.</v-alert>
      <v-card-text>
        <v-list-item v-for="(item, i) in items" :key="i">
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
            <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn :href="item.url" target="_blank" icon>
              <v-icon>mdi-cloud-download</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
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
          title: 'LBS Tool',
          subtitle: '등하원 수집기 설정 앱',
          url: 'https://play.google.com/store/apps/details?id=com.loopsdteam.lbs_app'
        }
      ]
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
