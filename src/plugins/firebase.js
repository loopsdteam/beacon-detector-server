import Vue from 'vue'
import * as firebase from 'firebase/app'
// import firebase from 'firebase'
import firebaseConfig from '../../firebaseConfig'
import store from '../store'
// import router from '../router'

// Add the Firebase products that you want to use
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/firebase-storage'
import 'firebase/database'

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// firebase.firestore().collection('test').add({ test: 'aaa' })
//   .then(r => console.log(r))
//   .catch(e => console.error(e))

Vue.prototype.$firebase = firebase

firebase.auth().onAuthStateChanged((user) => {
  store.dispatch('getUser', user)
})
