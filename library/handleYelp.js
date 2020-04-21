'use strict'

////// handle Yelp ////////

const superagent = require('superagent');
require('dotenv').config();

function handleYelp(req, res){
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
}

function Yelp(value){
  this.name = value.name;
  this.image_url =value.image_url;
  this.price = value.price;
  this.rating = value.rating;
  this.url = value.url;
}

module.exports = handleYelp;