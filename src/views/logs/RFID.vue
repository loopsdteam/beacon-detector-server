<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="headline pb-3">RFID Scanned</div>
        <v-card>
          <firebase-subscriber collection="rfidLogs" sort="time" order="desc">
            <template v-slot="{ items, error }">
              <template v-if="error">
                <v-alert type="error">{{ error.message }}</v-alert>
              </template>
              <template v-else>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">RFID</th>
                        <th class="text-left">Detect time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <v-fade-transition v-for="item in items" :key="item.id">
                        <tr>
                          <td>{{ item.data.id }}</td>
                          <td>{{ item.data.time.toDate().toLocaleString() }}</td>
                        </tr>
                      </v-fade-transition>
                    </tbody>
                  </template>
                </v-simple-table>
              </template>
            </template>
          </firebase-subscriber>
        </v-card>
      </v-col>

      <v-col cols="12">
        <div class="headline pb-3">Beacon Scanned</div>
        <v-card>
          <firebase-subscriber collection="beaconLogs" sort="createdAt" order="desc">
            <template v-slot="{ items, error }">
              <template v-if="error">
                <v-alert type="error">{{ error.message }}</v-alert>
              </template>
              <template v-else>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Address</th>
                        <th class="text-left">Scanner</th>
                        <th class="text-left">CreatedAt</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in items" :key="item.id">
                        <td>{{ item.data.address }}</td>
                        <td>{{ item.data.scanner }}</td>
                        <td>{{ item.data.createdAt.toDate().toLocaleString() }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </template>
            </template>
          </firebase-subscriber>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebaseSubscriber from '@/components/firebase-subscriber'

export default {
  components: {
    firebaseSubscriber
  }
}
</script>
