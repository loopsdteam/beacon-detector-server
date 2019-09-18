import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import store from '../store'
import firebaseConfig from '../../firebaseConfig'

const firebaseAPI = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? `https://us-central1-${firebaseConfig.projectId}.cloudfunctions.net/` : `http://localhost:5000/${firebaseConfig.projectId}/us-central1/`,
  timeout: 10000
})

firebaseAPI.interceptors.request.use(async (config) => {
  // Do something before request is sent
  // console.log(store.state.claims)
  // console.log(new Date(store.state.claims.exp * 1000))
  // console.log(new Date(store.state.claims.iat * 1000))
  // store.state.user.getIdToken()
  //   .then(r => console.log(r))
  //   .catch(e => console.error(e.message))

  const dif = moment(store.state.claims.exp * 1000).diff(moment(), 'minutes')
  if (dif < 10) await store.dispatch('getToken')
  // .then(r => {
  // console.log(new Date(store.state.claims.exp * 1000))
  // console.log(new Date(store.state.claims.iat * 1000))
  // console.log(m)
  // })
  // .catch(e => console.error(e.message))
  config.headers.authorization = store.state.token
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

Vue.prototype.$axios = firebaseAPI
