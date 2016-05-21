var db = require('../services/db');
var config = require('../config');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

module.exports = function(app){
  app.use(session({
    store: new RedisStore({
      client:db.get(),
      disableTTL:true
    }),
    secret: config.session.secret,
    saveUninitialized: false,
    resave: false
  }));
}
