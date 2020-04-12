'use strict';

// get variables from dotenv
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// packages we are going to use
const cors = require('cors');
const express = require('express');
const superagent = require('superagent')

const app = express();
app.use(cors());

////// Handle location /////////

// git the data from client
app.get('/location', handleLocation)

function handleLocation(req, res){
  let city = req.query.city;
  const url = 'https://us1.locationiq.com/v1/search.php';
  const queryStringParams = {
    key: process.env.LOCATION_TOKEN,
    q: city,
    format: 'json',
    limit: 1,
  }
  superagent.get(url)
    .query(queryStringParams)
    .then( data => {

    // get the data from https://us1.locationiq.com/v1/search.php
      let locationData = data.body[0];
      let location = new Location(city, locationData)
      res.json(location);
    });
  }

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
  let key = process.env.WEATHER_TOKEN;
  let lat = req.query.latitude;
  let lon = req.query.longitude;    
  let url = `https://api.darksky.net/forecast/${key}/${lat},${lon}`

  superagent.get(url)
    .then( data =>{
      let weatherArr = data.body.daily.data.map(value =>{
        return new Weather(value)
      }) 
      res.send(weatherArr);
   })
})

// constructor for weather; this is how the client wants the data.
function Weather(value){
  this.forecast = value.summary;
  this.time = new Date(value.time * 1000).toDateString() // changes epoch time to date format
}

app.get('/trails', (req, res) => {
  let url = 'https://www.hikingproject.com/data/get-trails?'
  const queryStringParams = {
    lat: req.query.latitude,
    lon: req.query.longitude,
    maxDistance: req.query.maxDistance,
    key: process.env.TRAIL_TOKEN,
  }

  superagent.get(url)
    .query(queryStringParams)
    .then(data =>{
      console.log(data.body.trails)
      let trail = data.body.trails;
   
      let allTrails = trail.map(value =>{
        return new Trail(value)
      })
      res.json(allTrails);
    })
})

function Trail(info){
  this.name = info.name;
  this.location = info.location
  this.length = info.length
  this.stars = info.stars
  this.star_votes = info.starVotes
  this.summary = info.summary
  this.trail_url = info.url
  this.conditions = info.conditionDetails
  this.condition_date = info.conditionDate
  this.condition_time = info.conditionDate
}

// turn on server
app.listen(PORT, () =>{
  console.log(`listening on port ${PORT}`);
})