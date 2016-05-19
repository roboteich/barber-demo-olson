var routes = require('node-require-directory')(__dirname);
var logger = require('winston');

logger.info('[CONTROLLERS] Start Initializing Routes');
module.exports = function(app) {
  Object.keys(routes).forEach(function(key) {
    if (key === 'index') return;
    app.use('/' + key, routes[key]);
  });
};
logger.info('[CONTROLLERS] Initializing Routes Complete');
