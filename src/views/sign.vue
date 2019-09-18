<template>
  <v-container fluid>
    <v-row align="stretch" justify="center">
      <v-col cols="12" sm="5" class="hidden-xs-only">
        <v-card color="transparent" flat>
          <v-parallax
            dark
            src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
            height="500"
          >
            <v-row
              align="center" justify="center"
            >
              <h1 class="display-1 font-weight-thin mb-3">beacon-detect.web.app</h1>
              <h4 class="subheading">Beacon Scanner Detect System</h4>
            </v-row>
          </v-parallax>
        </v-card>

      </v-col>
      <v-col cols="12" sm="5">
        <sign-in v-if="type" @changeType="type = !type"></sign-in>
        <sign-up v-else @changeType="type = !type"></sign-up>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
import SignIn from '@/components/auth/signIn'
import SignUp from '@/components/auth/signUp'

export default {
  components: {
    SignIn, SignUp
  },
  data () {
    return {
      type: true,
      email: '',
      password: ''
    }
  },
  methods: {
    async signInWithGoogle () {
      const provider = new this.$firebase.auth.GoogleAuthProvider()
      this.$firebase.auth().languageCode = 'ko'
      await this.$firebase.auth().signInWithPopup(provider)
    },
    async signInEmail () {
      await this.$firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
    },
    async signOut () {
      await this.$firebase.auth().signOut()
    }
  }
}
</script>
