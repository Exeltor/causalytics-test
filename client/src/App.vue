<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row v-if="loaded" class="d-flex justify-center align-center text-center" style="height:100vh">
          <v-col>
            <v-row>
              <v-col>
                <p>Campaign {{ campaignsData[selectedCampaign].name }} - ID: {{ campaignsData[selectedCampaign].id }}</p>
              </v-col>
              <v-col>
                <v-menu>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      v-bind="attrs"
                      v-on="on"
                    >
                      Switch campaign
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(campaign, index) in campaignsData"
                      :key="campaign.id"
                      @click="selectedCampaign = index"
                    >
                      <v-list-item-title>{{ campaign.name }} - {{ campaign.id }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-row>
                  <Chart :chartdata="campaignsData[selectedCampaign]" :options="options" :styles="styles" />
                </v-row>
                <v-row>
                  <v-col>
                    <h1>Statistics</h1>
                    <v-row>
                      <v-col>
                        <h3>Average CPC</h3>
                        <h4>{{ getAverageCPC }}</h4>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <h3>Average Spend</h3>
                        <p>{{ getAverageSpend }}</p>
                      </v-col>
                      <v-col>
                        <h3>Average Clicks</h3>
                        <p>{{ getAverageClicks }}</p>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Chart from './components/Chart.vue'

export default {
  components: {
    Chart
  },
  name: 'App',
  data: () => ({
    loaded: false,
    error: false,
    campaignsData: [],
    selectedCampaign: 0,
    styles: {
      height: '20%',
      width: '100%'
    }
  }),
  async mounted() {
    try {
      const rawData = await (await fetch('http://localhost:3001/facebook/getCpc')).json()
      this.prepareData(rawData)
    } catch(e) {
      this.error = true
      console.log(e)
    }
  },
  methods: {
    prepareData(data) {
      for(let [key, value] of Object.entries(data)) {
        this.campaignsData.push({
          id: key,
          name: value.name,
          labels: value.weeklyData.map(week => week.date_start),
          datasets: [{
            label: 'CPC',
            data: value.weeklyData.map(week => week.cpc),
            borderColor: '#1976d2',
          }],
          spend: value.weeklyData.map(week => week.spend),
          clicks: value.weeklyData.map(week => week.clicks)
        })
      }
      this.loaded = true
    },
  },
  computed: {
    getAverageCPC() {
      let cpc = 0
      this.campaignsData[this.selectedCampaign].datasets[0].data.forEach(weeklyCpc => cpc += parseFloat(weeklyCpc))

      const averageCPC = cpc / this.campaignsData[this.selectedCampaign].datasets[0].data.length
      return averageCPC.toFixed(2)
    },
    getAverageSpend() {
      let spend = 0
      this.campaignsData[this.selectedCampaign].spend.forEach(weeklySpend => spend += parseFloat(weeklySpend))

      const averageSpend = spend / this.campaignsData[this.selectedCampaign].spend.length
      return averageSpend.toFixed(2)
    },
    getAverageClicks() {
      let clicks = 0
      this.campaignsData[this.selectedCampaign].clicks.forEach(weeklyClicks => clicks += parseFloat(weeklyClicks))

      const averageClicks = clicks / this.campaignsData[this.selectedCampaign].clicks.length
      return averageClicks.toFixed(2)
    },
  }
};
</script>
