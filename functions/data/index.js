const app = require('express')()
const cors = require('cors')
const admin = require('firebase-admin')
require('express-async-errors')

const db = admin.firestore()

app.use(cors({ origin: true }))

app.use(require('../middlewares/verifyToken'))

app.use((req, res, next) => {
  if (req.claims.level === undefined) return res.status(403).send({ message: 'not authorized' })
  if (req.claims.level > 1) return res.status(403).send({ message: 'not authorized' })
  next()
})

app.get('/beacons', async (req, res) => {
  let { offset, limit, order, sort, search } = req.query
  offset = Number(offset)
  limit = Number(limit)
  const r = {
    items: [],
    totalCount: 0
  }
  let s = null
  if (search) {
    s = await db.collection('beacons').where('address', '==', search).get()
    r.totalCount = s.size
  } else {
    const t = await db.collection('infos').doc('beacons').get()
    r.totalCount = t.data().counter
    s = await db.collection('beacons').orderBy(order, sort).offset(offset).limit(limit).get()
  }

  s.forEach(v => {
    const d = v.data()
    d.createdAt = d.createdAt.toDate()
    d.updatedAt = d.updatedAt.toDate()
    r.items.push(d)
  })
  res.send(r)
})

app.get('/beacons/search', async (req, res) => {
  const s = await db.collection('beacons').where('address', '>=', req.query.search).limit(3).get()

  const items = []
  s.forEach(v => {
    items.push(v.data().email)
  })
  res.send(items)
})

app.use(require('../middlewares/error'))

module.exports = app
