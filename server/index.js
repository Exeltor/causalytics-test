const express = require('express')
var cors = require('cors')

const routes = require('./routes')
require('dotenv').config()

const app = express();
app.use(cors())

app.use('/', routes.getRoutes());

// start the server with dev and prod modes
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// export app
module.exports = app;
