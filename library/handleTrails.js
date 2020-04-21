'use strict'

///// handle trails /////////

const superagent = require('superagent');
require('dotenv').config();


// data for client
function handleTrails(req, res){
  let url = 'https://www.hikingproject.com/data/get-trails/'
  // object of query requirements ?
  const queryStringParams = {
    lat: req.query.latitude,
    lon: req.query.longitude,
    maxDistance: '10',
    key: process.env.TRAIL_TOKEN,
  }
try{
  superagent.get(url)
    .query(queryStringParams)
    .then(data =>{ // promise that returns the data from server
      let trail = data.body.trails;
      let allTrails = trail.map(value => new Trail(value))
      res.json(allTrails)
    })
  }catch(err) {
    let errObject = {
      status: 500,
      responseText: 'Contact Support',
    }
    res.status(500).json(errObject);
  }
}

// prepares data to go in the correct format to the client from server
function Trail(info){
  this.name = info.name;
  this.location = info.location;
  this.length = info.length;
  this.stars = info.stars;
  this.star_votes = info.starVotes;
  this.summary = info.summary;
  this.trail_url = info.url;
  this.conditions = info.conditionDetails;
  this.condition_date = new Date(info.conditionDate).toString().slice(0, 15);
  this.condition_time = new Date(info.conditionDate).toString().slice(16,25);
}

module.exports = handleTrails;