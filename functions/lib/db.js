const mongoose = require('mongoose')
// const url = process.env.DB_HOST
const url = 'mongodb+srv://beacon-detect:O7VYm3zM4b483kpk@clustersd-prgy7.mongodb.net/beacon-detect'
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}

module.exports = {
  connect (callback) {
    mongoose.connect(url, options, () => {
      console.log('DB connected.')
      callback()
    })
  }
}
