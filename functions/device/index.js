const app = require('express')()
const cors = require('cors')
const admin = require('firebase-admin')
require('express-async-errors')

const db = admin.firestore()

app.use(cors({ origin: true }))

app.post('/', async (req, res) => {
  const data = req.body
  if (!data.device) return res.status(400).end()
  let id = data.device.id
  if (!id) {
    if (id !== undefined) delete data.device.id // for empty string
    const s = await db.collection('devices').add(data.device)
    id = s.id
  }
  const s = await db.collection('devices').doc(id).get()
  const sd = s.data()
  sd.id = id
  const u = { updatedAt: new Date() }
  if (sd.ota) u.ota = false
  await db.collection('devices').doc(id).update(u)
  res.send(sd)
})

app.post('/beacons', async (req, res) => {
  const data = req.body
  if (!data.device || !data.device.id || !data.beacons) return res.status(400).end()

  const batch = db.batch()
  const id = data.device.id

  data.beacons.forEach(v => {
    v.deviceId = id
    v.updatedAt = new Date()
    batch.set(db.collection('beacons').doc(v.address), v)
  })

  await batch.commit()

  res.status(200).end()
})

app.use(require('../middlewares/error'))

module.exports = app
