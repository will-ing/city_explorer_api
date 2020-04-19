'use strict';

// get variables from dotenv
require('dotenv').config();

// import packages we are going to use
const cors = require('cors');
const express = require('express');
const pg = require('pg');

//connect to DB 
const client = new pg.Client(process.env.DATABASE_URL);
const PORT = process.env.PORT;
const app = express();

client.connect(); // this is a promise

app.use(cors());
// app.use(errorHandling);


// Libraries
const handleLocation = require('./library/handleLocation');
const handleWeather = require('./library/handleWeather');
const handleTrails = require('./library/handleTrails');
const handleMovies = require('./library/handleMovies');
const handleYelp = require('./library/handleYelp');


// Handles request from APIs
app.get('/location', handleLocation);
app.get('/weather', handleWeather);
app.get('/trails', handleTrails);
app.get('/movies', handleMovies);
app.get('/yelp', handleYelp);


// turn on server
app.listen(PORT, () =>{
  console.log(`listening on port ${PORT}`);
})