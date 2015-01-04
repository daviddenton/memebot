'use strict';
require('newrelic');

var config = process.env;
config.root = __dirname;
new require('./lib/memebotServer').MemebotServer(config).start();
