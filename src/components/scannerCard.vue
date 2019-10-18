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
          동글 상태:
        </v-list-item-content>
        <v-list-item-content class="align-end">
          {{ item.adapterStatus }}
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
        <!-- <v-text-field label="WiFi SSID" v-model="form.wifiSSID"></v-text-field>
        <v-text-field label="WiFi Password" v-model="form.wifiPassword" :append-icon="wifiPasswordView ? 'mdi-eye' : 'mdi-eye-off'" @click:append="wifiPasswordView = !wifiPasswordView" :type="wifiPasswordView ? '' : 'password'"></v-text-field> -->
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
      <v-btn color="primary" @click="update" text :disabled="loading">변경</v-btn>
      <v-btn color="error" @click="del" text :disabled="loading">삭제</v-btn>
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
        // wifiSSID: '',
        // wifiPassword: ''
      },
      wifiPasswordView: false
    }
  },
  mounted () {
    Object.assign(this.form, this.item)
  },
  methods: {
    async update () {
      const r = await this.$swal.fire({
        title: '정말 변경하시겠습니까?',
        text: '변경 후 되돌릴 수 없습니다.',
        type: 'warning',
        confirmButtonText: '확인',
        cancelButtonText: '취소',
        showCancelButton: true
      })
      if (!r.value) return
      this.loading = true
      await this.$axios.put(`/device/scanner/${this.item._id}`, this.form)
      this.loading = false
    },
    async del () {
      const r = await this.$swal.fire({
        title: '정말 삭제하시겠습니까?',
        text: '삭제 후 되돌릴 수 없습니다.',
        type: 'error',
        confirmButtonText: '확인',
        cancelButtonText: '취소',
        showCancelButton: true
      })
      if (!r.value) return
      this.loading = true
      await this.$axios.delete(`/device/scanner/${this.item._id}`, this.form)
      this.loading = false
      this.$emit('refresh')
    }
  }
}
</script>
