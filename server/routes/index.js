const express = require('express')

const FBRoutes = require('./facebook')

function getRoutes() {
  const router = express.Router()
  router.use('/facebook', FBRoutes.getFBRoutes())

  return router
}

module.exports = { getRoutes }