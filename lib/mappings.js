'use strict';

var _ = require('lodash');

exports.Mappings = function (transport) {
    return {
        all: function () {
            return transport.loadJson('https://raw.githubusercontent.com/daviddenton/memebot/master/memeMappings.json');
        },
        get: function (name) {
            return this.all().then(function (mappings) {
                if (mappings[name]) {
                    return mappings[name];
                }
                throw {
                    code: 404,
                    message: 'meme mapping not found for "' + name + '"'
                }
            });
        }
    };
};