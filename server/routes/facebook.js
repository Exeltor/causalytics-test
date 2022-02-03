const express = require('express')
const FB = require('fb')

// function to get all the routes related to the Facebook endpoints
function getFBRoutes() {
  const router = express.Router()
  router.get('/getCpc', getCpc)
  return router
}

// this function gets executed on GET request to the /facebook/getCpc endpoint
// for sake of simplicity, I chose to place it here, but as the application grows
// these processing functions would be better placed in a business logic folder
async function getCpc(req, res) {
  // bumped version to v11 due to v7 deprecation
  FB.options({version: 'v11.0'})
  FB.setAccessToken(process.env.ACCESS_TOKEN);

  let weeklyCpc
  
  try {
    // this request can be made more flexible by passing in an array of fields and a custom time increment by params from the frontend
    // which will then give the user more liberty on which data he wishes to see
    // although the grouping logic down the line would have to be reworked to accomodate the lesser/additional fields
    weeklyCpc = await FB.api('act_25064918/insights?fields=campaign_id,campaign_name,cpc,clicks,spend&level=campaign&time_increment=7', 'get')
  } catch(error) {
    console.log(error)
    res.error(error)
  }

  // data grouped by campaign in case there were multiple campaigns
  // and to get a clean and structured result as a response
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