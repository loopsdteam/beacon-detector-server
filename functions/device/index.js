const app = require('express')()
const cors = require('cors')
const admin = require('firebase-admin')
require('express-async-errors')

const db = admin.firestore()

app.use(cors({ origin: true }))

app.post('/', async (req, res) => {
  const data = req.body
  // if (!data.device || !data.beacons) return res.status(400).end()
  if (!data.device) return res.status(400).end()
  let id = data.device.id
  if (!id) {
    if (id !== undefined) delete data.device.id
    const s = await db.collection('devices').add(data.device)
    id = s.id
  }
  const s = await db.collection('devices').doc(id).get()
  const sd = s.data()
  sd.id = id
  if (sd.ota) {
    await db.collection('devices').doc(id).set({ ota: false })
    return res.send(sd)
  }
  res.send(sd)
})

app.use(require('../middlewares/verifyToken'))

app.use((req, res, next) => {
  if (req.claims.level === undefined) return res.status(403).send({ message: 'not authorized' })
  if (req.claims.level > 0) return res.status(403).send({ message: 'not authorized' })
  next()
})

// app.patch('/user/:uid/level', async (req, res) => {
//   if (!req.params.uid) return res.status(400).end()
//   if (req.body.level === undefined) return res.status(400).end()
//   const uid = req.params.uid
//   const level = req.body.level
//   const claims = { level }
//   await admin.auth().setCustomUserClaims(uid, claims)
//   await db.collection('users').doc(uid).update(claims)

//   res.status(200).end()
// })

app.use(require('../middlewares/error'))

module.exports = app
