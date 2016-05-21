'use strict';

var path = require('path');
var extend   = require('util')._extend;
var fs = require('fs');
var logger = require('winston');

// load the environment variables
try {
  extend(process.env, require('../.env.js'));
} catch (err) {
    logger.info('[CONFIG] no vars file, using host vars');
}

var ENV_VCAP_SERVICES = JSON.parse(process.env.VCAP_SERVICES);

// All configurations will extend these options
// ============================================
module.exports = {

  // Server port
  port: process.env.PORT || process.env.VCAP_APP_PORT || 5000,

  // Server IP
  ip: process.env.IP || 'localhost',

  redis: ENV_VCAP_SERVICES.rediscloud[0].credentials
    || {
      hostname:'127.0.0.1',
      port: '6379'
  },

  session: {
    secret: process.env.SESSION_SECRET || 'barber'
  },

  locations: {
    endpoint: 'https://info3.regiscorp.com/salonservices/siteid/1/salons/searchGeo/map/{lat}/{lon}/{r1}/{r2}/true'
  },

  dialog: ENV_VCAP_SERVICES.dialog[0].credentials || {
    url: 'https://gateway.watsonplatform.net/dialog/api',
    password: 'u1NR04yIDTqE',
    username: '3c8c4f95-77b0-40c1-817e-44e3ad8a9bf5'
  },

  classifier: ENV_VCAP_SERVICES.natural_language_classifier[0].credentials || {
    url: 'https://gateway.watsonplatform.net/natural-language-classifier/api',
    password: 'MT3Rqv7vV2ff',
    username: '2caf5a88-feb8-47b6-9c7c-fcfeb3019397'
  }
};
