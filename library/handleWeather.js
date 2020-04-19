'use strict'

////// Handle Weather /////////

const superagent = require('superagent');
require('dotenv').config();


// get data from client
function handleWeather(req, res){
  let key = process.env.WEATHER_TOKEN;
  let lat = req.query.latitude;
  let lon = req.query.longitude;    
  let url = `https://api.darksky.net/forecast/${key}/${lat},${lon}`
try{
  superagent.get(url)
    .then( data =>{
      let weatherArr = data.body.daily.data.map(value =>{
        return new Weather(value)
      }) 
      res.send(weatherArr);
   })
  }catch(err) {
    let errObject = {
      status: 500,
      responseText: 'Contact Support',
    }
    res.status(500).json(errObject);
  }
}

// constructor for weather; this is how the client wants the data.
function Weather(value){
  this.forecast = value.summary;
  this.time = new Date(value.time * 1000).toDateString() // changes epoch time to date format
}

module.exports = handleWeather;