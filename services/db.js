var Redis = require('ioredis');

var state = {
  db: null
}

var MODE_TEST = "mode_test"
  , MODE_PRODUCTION = "mode_production";

exports.MODE_TEST = MODE_TEST;
exports.MODE_PRODUCTION = MODE_PRODUCTION;

exports.connect = function(port, host, options) {
  state.db = new Redis(port, host, options);

  // Use different DB when testing
  if (options.db) {
    state.db.select(options.db);
  }
}

exports.get = function() {
  return state.db;
}
