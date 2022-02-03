const express = require('express')
var cors = require('cors')

const routes = require('./routes')
require('dotenv').config()

const app = express();

// use cors middleware in order to prevent problems in localhost
// and allow requests to pass through
app.use(cors())

// reference to a route holding file in order to keep the main file tidy
app.use('/', routes.getRoutes());

// start the server with dev and prod modes
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = app;
