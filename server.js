'use strict';

// get variables from dotenv
require('dotenv').config();
const PORT = process.env.PORT;

// packages we are going to use
const cors = require('cors');
const express = require('express');


const app = express();
app.use(cors());

////// Handle location /////////

// git the data from client
app.get('/locations', (req, res) =>{
  let city = req.query.city;

  // get the data from geo.json
  let locationData = require('./data/geo.json');
  let location = new Location(city, locationData[0])
  res.json(location);
})

// Location constructor function
function Location(city, data){
  this.search_query = city;
  this.formatted_query = data.display_name;
  this.latitude = data.lat;
  this.longitude = data.lon;
}

////// Handle Weather /////////

// get data from client
app.get('/weather', (req, res) => {
  let weatherData= require('./data/darksky.json');

  let weatherArr = [];
  
  weatherData.data.forEach(value =>{
    let weather = new Weather(value)
    weatherArr.push(weather);
  })
})

// constructor for weather
function Weather(value){
  this.forecast = value.summary;
  
}


// turn on server
app.listen(PORT, () =>{
  console.log(`listening on port ${PORT}`);
})