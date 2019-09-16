<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Account
          </v-list-item-title>
          <!-- <v-list-item-subtitle>
            subtext
          </v-list-item-subtitle> -->
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list nav>
        <v-list-group
          v-for="item in items"
          :key="item.title"
          v-model="item.active"
          :prepend-icon="item.icon"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="subItem in item.subItems"
            :key="subItem.title"
            :to="subItem.to"
          >
            <v-list-item-content>
              <v-list-item-title v-text="subItem.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="indigo" dark app>
      <v-app-bar-nav-icon @click="drawer = !drawer" v-if="$store.state.user"></v-app-bar-nav-icon>
      <v-toolbar-title>LOOP Beacon management</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="$store.state.user">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              v-on="on"
            >
              <v-avatar
                size="32"
                color="grey lighten-4"
              >
                <img :src="$store.state.user.photoURL" alt="avatar">
              </v-avatar>
            </v-btn>
          </template>
          <v-card width="320">
            <v-container grid-list-md>
              <v-layout row wrap>
                <v-flex xs4>
                  <v-avatar
                    size="96"
                    color="grey lighten-4"
                  >
                    <img :src="$store.state.user.photoURL" alt="avatar">
                  </v-avatar>
                </v-flex>
                <v-flex xs8>
                  <v-card-text>
                    <span class="font-weight-bold"> {{$store.state.user.displayName}}</span>
                    <br>
                    <span class="font-weight-thin">{{$store.state.user.email}}</span>
                  </v-card-text>
                </v-flex>
              </v-layout>

            </v-container>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="$router.push('/userProfile')">회원정보</v-btn>
              <v-btn color="primary" @click="signOut">로그아웃</v-btn>

            </v-card-actions>

          </v-card>
        </v-menu>
      </v-toolbar-items>
    </v-app-bar>

    <v-content>
      <vue-progress-bar></vue-progress-bar>
      <v-container grid-list-md v-if="!$store.state.firebaseLoaded">
        <v-layout row wrap align-center justify-center>
          <v-card color="transparent" flat>
            <v-card-text class="text-center">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-card-text>
            <v-card-text class="text-center">
              인증 상태를 기다리는 중입니다.
            </v-card-text>
          </v-card>
        </v-layout>
      </v-container>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-alert',
          title: 'home',
          active: true,
          subItems: [
            {
              title: 'dashboard',
              to: '/'
            }
          ]
        },
        {
          icon: 'mdi-alert-box',
          title: 'Admin',
          active: false,
          subItems: [
            {
              title: 'devices',
              to: '/admin/devices'
            },
            {
              title: 'users',
              to: '/admin/users'
            }
          ]
        },
        {
          icon: 'mdi-alert-box',
          title: 'Data',
          active: false,
          subItems: [
            {
              title: 'data',
              to: '/data/beacons'
            }
          ]
        }
      ]
    }
  },
  methods: {
    async signOut () {
      this.$firebase.auth().signOut()
      this.$router.push('/sign')
    }
  }
}
</script>
