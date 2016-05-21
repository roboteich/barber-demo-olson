var db = require('../services/db').get();
var config = require('../config');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var logger = require('winston');



//clear out any existing sessions
db.keys('sess:*', function(err, replies) {

  if(err) {
    logger.info('[SESSION] couldn\'t find my keys', err);
  }
  if(replies && replies.length){
    db.del(replies, function(err, response) {
      if(err) {
        logger.info('[SESSION] couldn\'t find my keys', err);
      }
    });
  }
});



var store =  new RedisStore({
  client:db,
  disableTTL:true
});

module.exports = function(app){
  app.use(session({
    store: store,
    secret: config.session.secret,
    saveUninitialized: false,
    resave: false
  }));
}
