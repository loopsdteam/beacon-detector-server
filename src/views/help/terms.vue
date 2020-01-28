<template>
  <v-container fluid>
    <v-card>
      <v-toolbar color="info" flat dense dark>
        <v-toolbar-title class="text-capitalize">개인정보 처리방침</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text v-html="text">

      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>

export default {
  data () {
    return {
      text: `
      <주식회사 루프>('https://beacon-detect.web.app'이하 '등하원수집기 관리')은(는) 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.<br>

      <주식회사 루프>('등하원수집기 관리') 은(는) 회사는 개인정보처리방침을 개정하는 경우 웹사이트 공지사항(또는 개별공지)을 통하여 공지할 것입니다.<br>

      ○ 본 방침은부터 2020년 1월 1일부터 시행됩니다.<br><br>


      1. 개인정보의 처리 목적 <주식회사 루프>('https://beacon-detect.web.app'이하 '등하원수집기 관리')은(는) 개인정보를 다음의 목적을 위해 처리합니다. 처리한 개인정보는 다음의 목적이외의 용도로는 사용되지 않으며 이용 목적이 변경될 시에는 사전동의를 구할 예정입니다.<br>

      가. 재화 또는 서비스 제공<br>

      콘텐츠 제공 등을 목적으로 개인정보를 처리합니다.<br>
      `
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
