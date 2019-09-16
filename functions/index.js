const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp({ credential: admin.credential.cert(require('./key.json')) })

const db = admin.firestore()

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!')
})

exports.test = functions.https.onRequest(require('./test'))
exports.admin = functions.https.onRequest(require('./admin'))
exports.device = functions.https.onRequest(require('./device'))
exports.data = functions.https.onRequest(require('./data'))
exports.createUser = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, emailVerified, photoURL, disabled } = user
  const claims = { level: 2 }
  if (functions.config().admin.email === user.email && user.emailVerified) claims.level = 0
  await admin.auth().setCustomUserClaims(uid, claims)

  const d = {
    uid, email, displayName, emailVerified, photoURL, disabled, level: claims.level
  }
  const r = await db.collection('users').doc(uid).set(d)
  return r
})
exports.deleteUser = functions.auth.user().onDelete((user) => {
  return db.collection('users').doc(user.uid).delete()
})
exports.incrementUserCount = functions.firestore
  .document('users/{userId}')
  .onCreate((snap, context) => {
    return db.collection('infos').doc('users').update(
      'counter', admin.firestore.FieldValue.increment(1)
    )
  })

exports.decrementUserCount = functions.firestore
  .document('users/{userID}')
  .onDelete((snap, context) => {
    return db.collection('infos').doc('users').update(
      'counter', admin.firestore.FieldValue.increment(-1)
    )
  })
exports.incrementDeviceCount = functions.firestore
  .document('devices/{deviceId}')
  .onCreate((snap, context) => {
    snap.ref.update({ createdAt: new Date() })
      .then(() => {
        return db.collection('infos').doc('devices').update(
          'counter', admin.firestore.FieldValue.increment(1)
        )
      })
  })

exports.decrementDeviceCount = functions.firestore
  .document('devices/{deviceId}')
  .onDelete((snap, context) => {
    return db.collection('infos').doc('devices').update(
      'counter', admin.firestore.FieldValue.increment(-1)
    )
  })
exports.incrementBeaconCount = functions.firestore
  .document('beacons/{beaconId}')
  .onCreate((snap, context) => {
    snap.ref.update({ createdAt: new Date() })
      .then(() => {
        return db.collection('infos').doc('beacons').update(
          'counter', admin.firestore.FieldValue.increment(1)
        )
      })
  })

exports.decrementBeaconCount = functions.firestore
  .document('beacons/{beaconId}')
  .onDelete((snap, context) => {
    return db.collection('infos').doc('beacons').update(
      'counter', admin.firestore.FieldValue.increment(-1)
    )
  })
db.collection('infos').doc('users').get()
  .then(s => {
    if (!s.exists) db.collection('infos').doc('users').set({ counter: 0 })
  })
db.collection('infos').doc('devices').get()
  .then(s => {
    if (!s.exists) db.collection('infos').doc('devices').set({ counter: 0 })
  })
db.collection('infos').doc('beacons').get()
  .then(s => {
    if (!s.exists) db.collection('infos').doc('beacons').set({ counter: 0 })
  })
