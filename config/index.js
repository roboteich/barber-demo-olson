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

// All configurations will extend these options
// ============================================
module.exports = {

  // Server port
  port: process.env.PORT || process.env.VCAP_APP_PORT || 5000,

  // Server IP
  ip: process.env.IP || 'localhost',

  redis: JSON.parse(process.env.VCAP_SERVICES).rediscloud[0]
    || {
      hostname:'127.0.0.1',
      port: '6379'
  },

  session: {
    secret: process.env.SESSION_SECRET || 'barber'
  },

  locations: {
    endpoint: 'https://info3.regiscorp.com/salonservices/siteid/1/salons/searchGeo/map/{lat}/{lon}/{r1}/{r2}/true'
  }
};
