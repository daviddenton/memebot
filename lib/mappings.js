'use strict';

var _ = require('lodash');

exports.Mappings = function (transport) {
    return {
        all: function () {
            var loadJson = transport.loadJson('https://raw.githubusercontent.com/daviddenton/memebot/master/memeMappings.json');
            return loadJson.then(function (mappings) {
                _.each(mappings, function (mapping) {
                    mapping.imageUrl = 'http://cdn.meme.am/images/400x/' + mapping.imageID + '.jpg';
                });
                return mappings;
            })
        },
        get: function (name) {
            return this.all().then(function (mappings) {
                return mappings[name];
            });
        }
    };
};