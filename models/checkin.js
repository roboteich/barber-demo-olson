var db = require('../services/db');
var extend = require('util')._extend;

/**
* Schema
* id - {Phone#}
* Phone - {String}
* PrimaryCustomerName - {String}
* SecondaryCustomerNames - {String[]}
* ConversationId - {String}
* UsePresets - {Boolean}
* Presets - {Location}
*/

function create(accountId, customerName, locationId, checkinDate, done) {
  db.get().hset("checkins", account.id, JSON.stringify(account), done);
}

function update(id, attrs, done) {
  one(id, function(err, account){
    add(extend(account, attrs), done);
  });
}

function all(done) {
    db.get().hgetall("checkins", function(err, checkins){
      done(err, checkins.map(function(account){ return JSON.parse(account[1]); }));
    });
  });
}

function one(id, done) {
    db.get().hget("checkins", id, function(err, account){
      done(err, JSON.parse(account));
    });
  })
}

function remove(id, done) {
  db.get().hdel("checkins", id, done);
}

module.exports = {
  create:create,
  update:update,
  one:one,
  all:all,
  delete:remove
}
