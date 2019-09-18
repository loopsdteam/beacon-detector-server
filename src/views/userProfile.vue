<template>
  <v-container fluid>
    <v-card>
      <v-subheader>회원 정보</v-subheader>
      <v-card-text>
        <v-alert v-if="!$store.state.claims.email_verified" type="warning">
          이메일 인증이 안되어 있습니다.
        </v-alert>
        <!-- <v-alert type="success"></v-alert> -->
        <p v-if="$store.state.claims.level >= 0">현재 {{levels[$store.state.claims.level]}} 계정입니다.</p>
        <p v-if="$store.state.claims.level > 0">페이지 접근을 위해 관리자에게 승인 요청을 하시기 바랍니다.</p>
      </v-card-text>
      <!-- <v-card-actions v-if="$store.state.claims.level === undefined">
        <v-btn color="success" @click="tokenUpdate">사용자 확인</v-btn>
      </v-card-actions> -->
    </v-card>

    <!-- <p>user profile</p>
    {{ JSON.stringify($store.state.claims, null, 2) }} -->
    <!-- {{ JSON.stringify($store.state.user, null, 2)}} -->
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      levels: ['관리자', '사용자', '손님']
    }
  },
  mounted () {
    if (this.$store.state.claims.level === undefined) {
      this.tokenUpdate()
    }
  },
  methods: {
    async tokenUpdate () {
      const user = this.$firebase.auth().currentUser
      await user.getIdToken(true)
      await this.$store.dispatch('getUser', user)
    }
  }
}
</script>
