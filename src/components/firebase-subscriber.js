export default {
  props: {
    collection: {
      type: String,
      required: true
    },
    limit: {
      type: [Number, String],
      default: 10
    },
    sort: {
      type: String
    },
    order: {
      type: String
    }
  },
  data () {
    return {
      unsubscribe: null,
      items: [],
      error: null
    }
  },
  mounted () {
    this.unsubscribe = this.subscribe()
  },
  methods: {
    test () {
      this.$firebase.firestore().collection(this.collection).orderBy('time', 'desc').get()
        .then((docs) => {
          if (docs) {
            docs.forEach(doc => {
              console.log(doc.id, doc.data().time.toDate())
            })
          }
        })
    },
    subscribe () {
      try {
        const subscribe = this.$firebase.firestore()
          .collection(this.collection)
          .orderBy(this.sort, this.order)
          .limit(parseInt(this.limit, 10))
          .onSnapshot((docs) => {
            if (docs) {
              const arr = []
              docs.forEach(doc => {
                const data = doc.data()
                arr.push({
                  id: doc.id,
                  data
                })
              })

              this.items = arr
            }
          })

        return subscribe
      } catch (err) {
        this.error = err
      }
    }
  },
  destroyed () {
    if (this.substribe) this.unsubscribe()
  },
  render () {
    return this.$scopedSlots.default({
      items: this.items,
      error: this.error
    })
  }
}
