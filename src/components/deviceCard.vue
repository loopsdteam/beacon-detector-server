<template>
  <v-card :loading="loading">
    <v-subheader>{{ item.id }}</v-subheader>
    <v-list>
      <v-list-item>
        <v-list-item-content>
          Version:
        </v-list-item-content>
        <v-list-item-content class="align-end">
          {{ item.version }}
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-card-text>
      <v-form>
        <v-text-field label="Name" v-model="item.name"></v-text-field>
        <v-switch
          v-model="item.ota"
          label="OTA"
        ></v-switch>
      </v-form>

    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="update" text>update</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: ['item'],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    update () {
      this.loading = true
      this.$axios.put(`/admin/device/${this.item.id}`, this.item)
        .catch(e => {
          this.$toasted.global.error(e.message)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
