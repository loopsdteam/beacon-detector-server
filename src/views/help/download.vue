<template>
  <v-container fluid>
    <v-card>
      <v-toolbar color="info" flat dense dark>
        <v-toolbar-title class="text-capitalize">Android App download</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
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
          subtitle: 'Bundle release',
          url: 'https://firebasestorage.googleapis.com/v0/b/beacon-detect.appspot.com/o/app-release.aab?alt=media&token=738050d0-db71-4aec-9089-55a139f33181'
        },
        {
          title: 'LBS Tool',
          subtitle: '32bit',
          url: 'https://firebasestorage.googleapis.com/v0/b/beacon-detect.appspot.com/o/app-armeabi-v7a-release.apk?alt=media&token=392d575a-65eb-4000-bebb-472982e0c368'
        },
        {
          title: 'LBS Tool',
          subtitle: '64bit',
          url: 'https://firebasestorage.googleapis.com/v0/b/beacon-detect.appspot.com/o/app-arm64-v8a-release.apk?alt=media&token=6558964b-8155-4038-9cb3-72bc17eb3971'
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
