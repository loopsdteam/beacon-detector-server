<template>
  <v-card height="100%">
    <v-subheader>
      앱 다운로드
      <v-spacer></v-spacer>

      <v-btn :to="'/help/download'" icon>
        <v-icon>mdi-arrow-right</v-icon>
      </v-btn>
    </v-subheader>
    <v-divider></v-divider>
    <v-list-item three-line v-for="(item, i) in items" :key="i">
      <v-list-item-content>
        <v-list-item-title v-text="item.title"></v-list-item-title>
        <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn :href="item.url" target="_blank" icon color="primary">
          <v-icon>{{item.icon}}</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
  </v-card>
</template>
<script>
export default {
  data () {
    return {
      items: [
        {
          title: 'LBS Tool 1.0.2+6 안드로이드앱',
          subtitle: '출시일: 2020.2.4',
          url: 'https://play.google.com/store/apps/details?id=com.loopsdteam.lbs_app',
          icon: 'mdi-google-play'
        },
        {
          title: 'LBS Tool 1.0.2+6 iOS, iPadOS앱',
          subtitle: '출시일: 2020.2.6',
          url: 'https://apps.apple.com/kr/app/등하원수집기/id1496729216',
          icon: 'mdi-apple-ios'
        }
      ]
    }
  }
}
</script>
