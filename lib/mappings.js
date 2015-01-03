'use strict';

var _ = require('lodash');

var TOKEN_PATTERN = /\%(\d+)/g;

exports.Mappings = function (memeMappingUrl, transport) {
    function tokensAsPath(mapping) {
        var tokensInTemplate = (mapping.topText + mapping.bottomText).match(TOKEN_PATTERN) || [];
        return _.unique(tokensInTemplate).map(function () {
            return '______';
        }).join('/');
    }

    return {
        all: function () {
            return transport.loadJson(memeMappingUrl).then(function (mappings) {
                _.each(mappings, function (mapping, name) {
                    mapping.topText = mapping.topText || '%0';
                    mapping.bottomText = mapping.bottomText || '%1';
                    mapping.templatePath = '/' + name + '/' + tokensAsPath(mapping);
                });
                return mappings;
            })
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