var db = require('../services/db');
var extend = require('util')._extend;

/**
* Schema
* id - {Phone#}
* Phone - {String}
* PrimaryName - {String}
* OtherNames - {String[]}
* ConversationId - {String}
* UsePresets - {Boolean}
* Presets - {Location}
*/

var defaultProperties = {
  id:null,
  phone:null,
  name_primary:null,
  names_other:[],
  conversationId:null,
  presets:{location:null},
  usePresets:false
};

function create(account, done) {
  var accountInstance = extend(defaultProperties, account);
  db.get().hset('accounts', account.id, JSON.stringify(accountInstance), function(err, response) {
    if(err){
      return done(err, null);
    }

    done(null, accountInstance);
  });
}

function update(id, attrs, done) {
  one(id, function(err, account){
    add(extend(account, attrs), done);
  });
}

function all(done) {
  db.get().hgetall('accounts', function (err, accounts) {
    done(err, accounts.map(function(account){
      return JSON.parse(account[1]);
    }));
  });
}

function one(id, done) {
  db.get().hget('accounts', id, function(err, account) {
    done(err, JSON.parse(account));
  });
}

function remove(id, done) {
  db.get().hdel('accounts', id, done);
}

module.exports = {
  create:create,
  update:update,
  one:one,
  all:all,
  delete:remove
}
