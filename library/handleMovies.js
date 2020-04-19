'use strict'

////// handles movies /////

const superagent = require('superagent');
require('dotenv').config();


function handleMovies(req, res) {
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
}

function Movie(value){
  this.title = value.title;
  this.overview = value.overview;
  this.average_votes = value.vote_average;
  this.total_votes = value.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500${value.poster_path}`;
  this.popularity = value.popularity;
  this.released_on = value.release_date;
}

module.exports = handleMovies;