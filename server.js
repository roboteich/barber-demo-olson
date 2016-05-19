#! /usr/bin/env node
'use strict';
var config = require('./config');
var server = require('./app');
server.listen(config.port);
require('winston').info('[SERVER] listening on port ' + config.port);
