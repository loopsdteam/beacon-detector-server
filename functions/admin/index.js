const app = require('express')()
const cors = require('cors')
const admin = require('firebase-admin')
// const mongoose = require('mongoose')
require('express-async-errors')

const db = admin.firestore()
// mongoose.connect('mongodb+srv://beacon-detect:O7VYm3zM4b483kpk@clustersd-prgy7.mongodb.net/beacon-detect', {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
//   useUnifiedTopology: true
// }, (err) => {
//   if (!err) {
//     console.log('MongoDB Connection Succeeded.')
//   } else {
//     console.log('Error in DB connection: ' + err)
//   }
// })

app.use(cors({ origin: true }))

app.use(require('../middlewares/verifyToken'))

app.use((req, res, next) => {
  if (req.claims.level === undefined) return res.status(403).send({ message: 'not authorized' })
  if (req.claims.level > 0) return res.status(403).send({ message: 'not authorized' })
  next()
})

app.get('/users', async (req, res) => {
  let { offset, limit, order, sort, search } = req.query
  offset = Number(offset)
  limit = Number(limit)
  const r = {
    items: [],
    totalCount: 0
  }
  let s = null
  if (search) {
    s = await db.collection('users').where('email', '==', search).get()
    r.totalCount = s.size
  } else {
    const t = await db.collection('infos').doc('users').get()
    r.totalCount = t.data().counter
    s = await db.collection('users').orderBy(order, sort).offset(offset).limit(limit).get()
  }

  s.forEach(v => {
    r.items.push(v.data())
  })
  res.send(r)
})

app.get('/users/search', async (req, res) => {
  const s = await db.collection('users').where('email', '>=', req.query.search).limit(3).get()

  const items = []
  s.forEach(v => {
    items.push(v.data().email)
  })
  res.send(items)
})

app.patch('/user/:uid/level', async (req, res) => {
  if (!req.params.uid) return res.status(400).end()
  if (req.body.level === undefined) return res.status(400).end()
  const uid = req.params.uid
  const level = req.body.level
  const claims = { level }
  await admin.auth().setCustomUserClaims(uid, claims)
  await db.collection('users').doc(uid).update(claims)

  res.status(200).end()
})

app.get('/devices', async (req, res) => {
  let { offset, limit, order, sort, search } = req.query
  offset = Number(offset)
  limit = Number(limit)
  const r = {
    items: [],
    totalCount: 0
  }
  let s = null
  if (search) {
    s = await db.collection('devices').where('name', '==', search).get()
    r.totalCount = s.size
  } else {
    const t = await db.collection('infos').doc('devices').get()
    r.totalCount = t.data().counter
    s = await db.collection('devices').orderBy(order, sort).offset(offset).limit(limit).get()
  }

  s.forEach(v => {
    const item = v.data()
    item.id = v.id
    item.createdAt = item.createdAt.toDate()
    item.updatedAt = item.updatedAt.toDate()
    r.items.push(item)
  })
  res.send(r)
})

app.get('/devices/search', async (req, res) => {
  const s = await db.collection('devices').where('name', '>=', req.query.search).limit(3).get()

  const items = []
  s.forEach(v => {
    items.push(v.data().email)
  })
  res.send(items)
})

app.put('/device/:id', async (req, res) => {
  await db.collection('devices').doc(req.params.id).set(req.body)
  res.status(200).end()
})

app.use(require('../middlewares/error'))

module.exports = app
