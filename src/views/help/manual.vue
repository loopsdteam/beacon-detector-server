<template>
  <v-container fluid>
    <v-card>
      <v-toolbar color="warning" flat dense dark>
        <v-toolbar-title class="text-capitalize">manual</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-subheader>이미지 복사 방법 안내</v-subheader>
      <v-card-text>
        <v-img :src="require('@/assets/images/ODROID EMMC Setting 1.jpg')"></v-img>
        <v-img :src="require('@/assets/images/ODROID EMMC Setting 2.jpg')"></v-img>
        <v-img :src="require('@/assets/images/ODROID EMMC Setting 3.jpg')"></v-img>
        <v-img :src="require('@/assets/images/ODROID EMMC Setting 4.jpg')"></v-img>
      </v-card-text>
    </v-card>
  </v-container>
</template>
