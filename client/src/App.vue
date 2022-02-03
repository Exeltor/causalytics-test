<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row v-if="!error" class="d-flex justify-center align-center text-center" style="height:100vh">
          <v-col>
            <v-row>
              <v-col>
                <p v-if="loaded">Campaign {{ campaignsData[selectedCampaign].name }} - ID: {{ campaignsData[selectedCampaign].id }}</p>
                <v-skeleton-loader v-else type="text"/>
              </v-col>
              <v-col>
                <v-menu v-if="loaded">
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
                  <Chart v-if="loaded" :chartdata="campaignsData[selectedCampaign]" :styles="styles" />
                  <v-skeleton-loader v-else type="image" width="100%" />
                </v-row>
                <v-row v-if="loaded" class="text-left">
                  <v-col cols="12" md="6">
                    <v-card>
                      <v-card-title>Statistics</v-card-title>
                      <v-card-text>
                        <v-row>
                          <v-card-subtitle class="font-weight-bold">Average CPC:</v-card-subtitle>
                          <span>
                            <v-card-text>{{ getAverageCPC }}</v-card-text>
                          </span>
                        </v-row>
                        <v-row>
                          <v-card-subtitle class="font-weight-bold">Average Spend:</v-card-subtitle>
                          <span>
                            <v-card-text>{{ getAverageSpend }}</v-card-text>
                          </span>
                        </v-row>
                        <v-row>
                          <v-card-subtitle class="font-weight-bold">Average Clicks:</v-card-subtitle>
                          <span>
                            <v-card-text>{{ getAverageClicks }}</v-card-text>
                          </span>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-card>
                      <v-card-title>Week by week detail</v-card-title>
                      <v-card-text>
                        <v-row v-for="(period, index) in campaignsData[selectedCampaign].fullPeriods" :key="period">
                          <v-col>
                            <v-card-subtitle class="font-weight-bold">{{ period }}</v-card-subtitle>
                            <v-row>
                              <v-card-subtitle>CPC: {{ campaignsData[selectedCampaign].datasets[0].data[index] }}</v-card-subtitle>
                              <v-card-subtitle>Spend: {{ campaignsData[selectedCampaign].spend[index] }}</v-card-subtitle>
                              <v-card-subtitle>Clicks: {{ campaignsData[selectedCampaign].clicks[index] }}</v-card-subtitle>
                            </v-row>
                            <v-divider v-if="index < campaignsData[selectedCampaign].fullPeriods.length - 1" />
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row v-else>
                  <v-col>
                    <v-skeleton-loader width="100%" type="card" />
                  </v-col>
                  <v-col>
                    <v-skeleton-loader width="100%" type="card"/>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row v-else class="d-flex justify-center align-center text-center" style="height:100vh">
          <v-col>
            <h1>Whoops... Looks like there has been an error while retrieving the data</h1>
            <v-btn color="primary" @click="fetchData">Refresh</v-btn>
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
    this.fetchData()
  },
  methods: {
    // Data fetching would probably be best placed in Vuex for better reusability in other components
    // Data fetching could also be reduced by storing the timestamp of the latest fetch, and retrieving
    // the data directly from Vuex by having a timestamp comparison function, although in that case
    // there will have to be a tradeoff of how often new data should be fetched in order to prevent stale results
    async fetchData() {
      this.loaded = false
      this.error = false
      try {
        const rawData = await (await fetch('http://localhost:3001/facebook/getCpc')).json()
        if (!rawData || Object.keys(rawData).length === 0) throw "Empty response"
        this.prepareData(rawData)
        this.loaded = true
      } catch(e) {
        this.error = true
        console.log(e)
      }
    },
    // Data preparation, same as with data fetching, would be better placed in Vuex for reusability
    prepareData(data) {
      for(let [key, value] of Object.entries(data)) {
        this.campaignsData.push({
          id: key,
          name: value.name,
          labels: value.weeklyData.map(week => week.date_start),
          fullPeriods: value.weeklyData.map(week => `${week.date_start} - ${week.date_stop}`),
          datasets: [
            {
              label: 'CPC',
              data: value.weeklyData.map(week => week.cpc),
              borderColor: '#1976d2',
            }
          ],
          spend: value.weeklyData.map(week => week.spend),
          clicks: value.weeklyData.map(week => week.clicks)
        })
      }
      this.loaded = true
    },
  },
  computed: {
    // Getters to calculate averages for the selected campaign on the fly
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
