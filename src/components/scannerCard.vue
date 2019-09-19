<template>
  <v-card :loading="loading">
    <v-subheader>{{ item._id }}</v-subheader>
    <v-list>
      <v-list-item>
        <v-list-item-content>
          Version:
        </v-list-item-content>
        <v-list-item-content class="align-end">
          {{ item.version }}
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          CreatedAt:
        </v-list-item-content>
        <v-list-item-content class="align-end">
          {{ new Date(item.createdAt).toLocaleString() }}
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          UpdatedAt:
        </v-list-item-content>
        <v-list-item-content class="align-end">
          {{ new Date(item.updatedAt).toLocaleString() }}
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-card-text>
      <v-form>
        <v-text-field label="Name" v-model="form.name"></v-text-field>
        <v-text-field label="SerialNo" v-model="form.serialNo"></v-text-field>
        <v-text-field label="Target URL" v-model="form.targetURL"></v-text-field>
        <!-- <v-subheader>Min and max default slider</v-subheader>
        <v-text-field label="Cycle" v-model="form.cycle" type="number" step="10"></v-text-field> -->
        <v-slider
          class="mt-5"
          v-model="form.cycle"
          thumb-label="always"
          :min="10"
          :max="3600"
          step="10"
          label="Cycle"
          hide-details
        >
          <template v-slot:append>
            <v-text-field
              v-model="form.cycle"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              :min="10"
              :max="3600"
              step="10"
              style="width: 60px"

            ></v-text-field>
          </template>
        </v-slider>
        <v-switch
          v-model="form.ota"
          label="OTA"
        ></v-switch>
      </v-form>

    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="update" text>update</v-btn>
      <v-btn color="error" @click="del" text>delete</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: ['item'],
  data () {
    return {
      loading: false,
      form: {
        name: '',
        ota: false,
        cycle: 60,
        serialNo: '',
        targetURL: ''
      }
    }
  },
  mounted () {
    Object.assign(this.form, this.item)
  },
  methods: {
    update () {
      this.loading = true
      this.$axios.put(`/device/scanner/${this.item._id}`, this.form)
        .catch(e => {
          this.$toasted.global.error(e.message)
        })
        .finally(() => {
          this.loading = false
          // this.$emit('refresh')
        })
    },
    del () {
      this.loading = true
      this.$axios.delete(`/device/scanner/${this.item._id}`, this.form)
        .catch(e => {
          this.$toasted.global.error(e.message)
        })
        .finally(() => {
          this.loading = false
          this.$emit('refresh')
        })
    }
  }
}
</script>
