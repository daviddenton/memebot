'use strict';

var _ = require('lodash');
var path = require('path');

exports.ProcessEnvironmentConfig = function (root) {
    var config = _.extend({
        PORT: 5000
    }, process.env);

    return {
        pathTo: function (/* path parts... */) {
            return path.join.apply(undefined, [root].concat(_.values(arguments)));
        },
        valueOf: function (name) {
            if (!config[name]) {
                throw 'No environmental variable defined with name [' + name + ']';
            }
            return config[name];
        }
    };
};