<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: {
    chartdata: {
      type: Object,
      default: null
    },
    styles: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    options: {
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Weekly CPC'
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            display: true,
            autoSkip: true,
            maxRotation: 0,
            minRotation: 0,
            fonSize: 10
          }   
        }]
      },
    },
  }),
  mounted () {
    this.renderChart(this.chartdata, this.options)
  }
}
</script>

<style>

</style>