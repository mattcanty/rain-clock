const url = require("url");

var client = darksky.Client(process.env.FORECAST_API_KEY);

console.log(client)