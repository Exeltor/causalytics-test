const express = require('express')
const FB = require('fb')

// A function to get the routes.
// That way all the route definitions are in one place which I like.
// This is the only thing that's exported
function getFBRoutes() {
  const router = express.Router()
  router.get('/getCpc', getCpc)
  return router
}

async function getCpc(req, res) {
  // bumped version to v11 due to v7 deprecation
  FB.options({version: 'v11.0'})
  FB.setAccessToken(process.env.ACCESS_TOKEN);
  
  const weeklyCpc = await FB.api('act_25064918/insights?fields=campaign_id,campaign_name,cpc,clicks,spend&level=campaign&time_increment=7', 'get')

  // data grouped by campaign in case there were multiple campaigns
  let groupedData = {}

  weeklyCpc.data.forEach(item => {
    if (!groupedData[item.campaign_id]) groupedData[item.campaign_id] = { name: item.campaign_name, weeklyData: [] }

    groupedData[item.campaign_id].weeklyData.push({
      cpc: item.cpc,
      clicks: item.clicks,
      spend: item.spend,
      date_start: item.date_start,
      date_stop: item.date_stop
    })
  })

  res.json(groupedData)
}

module.exports = { getFBRoutes }