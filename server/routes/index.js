const express = require('express')

const FBRoutes = require('./facebook')

// sets up the router with all different types of endpoints
// this helps keep the main index.js file tidy, and is more maintainable
// as all routes are in one place
function getRoutes() {
  const router = express.Router()
  router.use('/facebook', FBRoutes.getFBRoutes())

  return router
}

module.exports = { getRoutes }