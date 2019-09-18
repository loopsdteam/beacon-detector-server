<template>
  <v-container fluid>
    <v-card>
      <v-subheader>관리자 승인 필요</v-subheader>
      <v-card-text>
        <v-alert type="warning">다른 페이지 방문시 관리자의 승인이 필요할 수 있습니다.</v-alert>
      </v-card-text>
    </v-card>
    <!-- <p>여기는 메인페이지</p>
    {{ JSON.stringify($store.state.claims, null, 2) }} -->
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      arras: [1, 2, 3, 4, 'www', 'xxxxx']
    }
  }
}
</script>
