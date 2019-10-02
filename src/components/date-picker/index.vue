<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    persistent
    full-width
    width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="date"
        prepend-icon="mdi-calendar"
        readonly
        v-on="on"
        v-bind="$attrs"
      ></v-text-field>
    </template>
    <v-date-picker v-model="date" ref="picker" locale="ko">
      <div class="flex-grow-1"></div>
      <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
      <v-btn text color="primary" @click="emit">OK</v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    birthday: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      validate (value) {
        return this.$moment(value, 'YYYY-MM-DD', true).isValid()
      }
    }
  },
  data () {
    return {
      modal: false,
      date: this.value ? this.$moment(this.value, 'YYYY-MM-DD').format('YYYY-MM-DD') : this.$moment().format('YYYY-MM-DD')
    }
  },
  watch: {
    value (val) {
      this.date = this.$moment(val).format('YYYY-MM-DD')
    },
    modal (val) {
      if (!this.birthday) return
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  methods: {
    emit () {
      this.$emit('input', this.date)
      this.modal = false
    }
  }
}
</script>
