require('dotenv').config()

const express = require('express')
const forecastCtrl = require('./controllers/forecastController.js')
const twitterCtrl = require('./controllers/twitterController.js')
const forecastStore = require('./forecast/store.js')
const app = express()

forecastCtrl.setForecastStore(forecastStore);
twitterCtrl.setForecastStore(forecastStore);

app.get('/forecast/:latlong', forecastCtrl.get);
app.post('/upload', twitterCtrl.post);

app.use(express.static(__dirname + '/public'))
app.listen(process.env.PORT || 3000, console.log('running'))
