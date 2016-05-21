/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express  = require('express'),
  config     = require('./config'),
  db         = require('./services/db'),
  app        = express(),
  extend     = require('util')._extend,
  pkg        = require('./package.json'),
  training   = require('./training/setup'),
  Q          = require('q'),
  logger     = require('winston'),
  morgan     = require('morgan'),
  apis = null;



logger.info('[APP] Starting DB Initialization');
// connect up db
db.connect(config.redis.hostname, config.redis.port, {password:config.redis.password});

// initialize all models?

logger.info('[APP] Starting Server Initialization');
// Bootstrap application settings
require('./config/express')(app);

// Only loaded when is running in bluemix
if (process.env.VCAP_APPLICATION)
  require('./middlewears/security')(app);

logger.info('[APP] Adding Session Management');
// add in session management
require('./middlewears/session')(app);

// log incoming requests
app.use(morgan('dev'));

// add in controller routes
require('./controllers')(app);

// error-handler application settings
require('./middlewears/errors')(app);

logger.info('[APP] Server Initialization Complete');
module.exports = app;
