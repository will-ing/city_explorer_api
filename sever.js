'use strict';


require('dotenv').config();
const cors = require('cors');
const express = require('express');

const PORT = process.env.PORT;

const app = express();
app.use(cors());

app.get( '/test', (req, res) =>{
  const name = req.query.name;
  res.send(`Hello, ${name}`);
})

// git the data form client
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