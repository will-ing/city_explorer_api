'use strict'

////// Handle location /////////
require('dotenv').config();

const superagent = require('superagent');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);


client.connect(); // this is a promise

// git the data from client
function handleLocation(req, res){
  let SQL = 'SELECT * FROM locations WHERE search_query =$1;';
  let city = req.query.city;
  let VALUES = [city];

  try{
    client.query(SQL, VALUES)
    .then(result => {
      if(result.rows.length > 0){
        res.status(200).json(result.rows[0]);
      }else{
        grabLocation(req, res)
      }
    })
  }catch(err) {
    let errObject = {
      status: 500,
      responseText: 'Contact Support',
    }
    res.status(500).json(errObject);
  }
}


function grabLocation(req, res){
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

    const SQL = `INSERT INTO locations (search_query, formatted_query, latitude, longitude)
                VALUES($1, $2, $3, $4);`
    let VALUES = [city, location.formatted_query, location.latitude, location.longitude];
    client.query(SQL, VALUES)
  });
}

// Location constructor function
function Location(city, data){
  this.search_query = city;
  this.formatted_query = data.display_name;
  this.latitude = data.lat;
  this.longitude = data.lon;
}


module.exports = handleLocation;