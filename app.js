const express = require('express')
const dotenv = require('dotenv')
var forecastCtrl = require('./controllers/forecastController.js')
var twitterCtrl = require('./controllers/twitterController.js')
const app = express()

dotenv.load()

app.use(express.static(__dirname + '/public'))

app.get('/forecast/:latlong', forecastCtrl.get);

app.listen(process.env.PORT || 3000, console.log('running'))
