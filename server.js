'use strict';

// get variables from dotenv
require('dotenv').config();

// import packages we are going to use
const cors = require('cors');
const express = require('express');
const superagent = require('superagent')
const pg = require('pg');

//connect to DB 
const client = new pg.Client(process.env.DATABASE_URL);
const PORT = process.env.PORT;
const app = express();

client.connect(); // this is a promise



app.use(cors());
// app.use(errorHandling);

////// Handle location /////////

// git the data from client
app.get('/location', (req, res) => {
  let SQL = 'SELECT * FROM locations WHERE search_query =$1;';
  let city = req.query.city;
  let VALUES = [city];

  try{
    client.query(SQL, VALUES)
    .then(result => {
      if(result.rows.length > 0){
        res.status(200).json(result.rows[0]);
      }else{

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
  })
  }catch(err) {
    let errObject = {
      status: 500,
      responseText: 'Contact Support',
    }
    res.status(500).json(errObject);
  }
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
})

// constructor for weather; this is how the client wants the data.
function Weather(value){
  this.forecast = value.summary;
  this.time = new Date(value.time * 1000).toDateString() // changes epoch time to date format
}


///// handle trails /////////

// data for client
app.get('/trails', (req, res) => {
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
      ;

      let trail = data.body.trails;
      let allTrails = trail.map(value =>{
        return new Trail(value)
      })
      res.json(allTrails)
    })
  }catch(err) {
    let errObject = {
      status: 500,
      responseText: 'Contact Support',
    }
    res.status(500).json(errObject);
  }
})

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


////// handles movies /////

app.get('/movies', (req, res) => {
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_TOKEN}&language=en-US&query=${req.query.search_query}`
  try{
    superagent.get(url)
      .then(data =>{
        let movies = data.body.results;
        let movie = movies.map(value => new Movie(value))
        res.status(200).send(movie);
      })
  }catch(err) {
    let errObject = {
      status: 500,
      responseText: 'Contact Support',
    }
    res.status(500).json(errObject);
  }
})

function Movie(value){
  this.title = value.title;
  this.overview = value.overview;
  this.average_votes = value.vote_average;
  this.total_votes = value.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500${value.poster_path}`;
  this.popularity = value.popularity;
  this.released_on = value.release_date;
}

app.get('/yelp', (req, res) => {
  let url = `https://api.yelp.com/v3/businesses/search?location=${req.query.search_query}`
  try{
    superagent.get(url)
      .set('Authorization', `Bearer ${process.env.YELP_TOKEN}`)
      .then(data => {
        let resturants = data.body.businesses.map(value => new Yelp(value))
        res.status(200).send(resturants);
      })
  }catch(err){
    let errObject = {
      status: 500,
      responseText: 'Contact Support',
    }
    res.status(500).json(errObject);
  }
})

function Yelp(value){
  this.name = value.name;
  this.image_url =value.image_url;
  this.price = value.price;
  this.rating = value.rating;
  this.url = value.url;
}


// turn on server
app.listen(PORT, () =>{
  console.log(`listening on port ${PORT}`);
})