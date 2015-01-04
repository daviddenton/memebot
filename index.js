'use strict';
require('newrelic');

var c = require('./lib/config');
var ms = require('./lib/memebotServer');

new ms.MemebotServer(c.ProcessEnvironmentConfig(__dirname), console.log).start();
