<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            {{ _.get($store.state.user, 'email', '로딩중')}}
          </v-list-item-title>
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
    <v-app-bar color="#F26B1D" dark app>
      <v-app-bar-nav-icon @click="drawer = !drawer" v-if="$store.state.user"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <span>{{ pkg.description }}</span>
        <span class="caption">&nbsp;v{{ pkg.version }}</span>
        <span class="caption" v-if="env === 'development'">&nbsp;{{ env }}</span>
      </v-toolbar-title>
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
              >
                <v-img :src="_.get($store.state.user, 'photoURL', null) ? $store.state.user.photoURL : require('@/assets/images/account-alert.png')" alt="avatar"></v-img>
              </v-avatar>
            </v-btn>
          </template>
          <v-card width="320">
            <v-container fluid>
              <v-row>
                <v-col cols="4">
                  <v-avatar
                    size="96"
                    color="indigo"
                  >
                    <v-img :src="_.get($store.state.user, 'photoURL', null) ? $store.state.user.photoURL : require('@/assets/images/account-alert.png')" alt="avatar"></v-img>
                  </v-avatar>
                </v-col>
                <v-col cols="8">
                  <v-card-text>
                    <span class="font-weight-bold"> {{$store.state.user.displayName}}</span>
                    <br>
                    <span class="font-weight-thin">{{$store.state.user.email}}</span>
                  </v-card-text>
                </v-col>
              </v-row>

            </v-container>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" outlined @click="$router.push('/userProfile')">회원정보</v-btn>
              <v-btn color="warning" outlined @click="signOut">로그아웃</v-btn>

            </v-card-actions>

          </v-card>
        </v-menu>
      </v-toolbar-items>
    </v-app-bar>

    <v-content>
      <vue-progress-bar></vue-progress-bar>
      <v-container fluid v-if="!$store.state.firebaseLoaded">
        <v-row align="center" justify="center">
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
        </v-row>
      </v-container>
      <template v-else>
        <v-container fluid v-if="showNotice">
          <v-alert border="left" prominent dismissible  outlined type="info">
            V0.4(18.12.19) updated
            <ul>
              <li>Scanner로 검색 추가</li>
              <li>Group으로 검색 추가</li>
              <li>Group 지정: group 클릭</li>
              <li>Data 확인: Address 클릭</li>
            </ul>
          </v-alert>
        </v-container>
      </template>
      <router-view/>
    </v-content>
    <v-footer app color="#1D727F" dark absolute>
      <v-spacer></v-spacer>
      <span>
        &copy;
        2019 LOOP Solution Dev. Team
        <!-- <a href="http://loopsystem.co.kr" target="_blank">LOOP</a> -->
      </span>
    </v-footer>
  </v-app>
</template>

<script>
import pkg from '../package'

export default {
  name: 'App',
  data () {
    return {
      env: process.env.NODE_ENV,
      pkg: pkg,
      drawer: false,
      items: [
        {
          icon: 'mdi-poll',
          title: '메인',
          active: true,
          subItems: [
            {
              title: '현황',
              to: '/'
            }
          ]
        },
        // {
        //   icon: 'mdi-clipboard-list',
        //   title: 'logs',
        //   active: false,
        //   subItems: [
        //     {
        //       title: 'logs',
        //       to: '/logs'
        //     }
        //   ]
        // },
        // {
        //   icon: 'mdi-chip',
        //   title: 'Device',
        //   active: false,
        //   subItems: [
        //     {
        //       title: 'Scanners',
        //       to: '/device/scanners'
        //     },
        //     {
        //       title: 'Beacons',
        //       to: '/device/beacons'
        //     }
        //   ]
        // },
        {
          icon: 'mdi-database',
          title: 'History',
          active: false,
          subItems: [
            // {
            //   title: 'devices',
            //   to: '/history/devices'
            // },
            {
              title: 'Beacons',
              to: '/history/beacons'
            },
            {
              title: 'Days',
              to: '/history/days'
            }
          ]
        },
        {
          icon: 'mdi-account-multiple',
          title: '관리기능',
          active: false,
          subItems: [
            {
              title: '장치 관리',
              to: '/admin/scanners'
            },
            {
              title: '사용자관리',
              to: '/admin/users'
            }
          ]
        },
        {
          icon: 'mdi-help',
          title: '도움말',
          active: false,
          subItems: [
            // {
            //   title: 'Manual',
            //   to: '/help/manual'
            // },
            {
              title: '설정앱 다운로드',
              to: '/help/download'
            },
            {
              title: 'Development',
              to: '/help/development'
            }
          ]
        }
      ]
    }
  },
  computed: {
    showNotice () {
      if (this.$moment().diff(this.$moment('2019-12-25'), 'days') > 0) return false
      return true
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
<style scoped>
#app {
  font-family: 'Jua', Helvetica, Arial, sans-serif; /* this was it */
}
a {
  color: white;
  text-decoration: none;
}
</style>
