'use strict';

var _ = require('lodash');

function searchUrl(query) {
    return 'http://version1.api.memegenerator.net/Generators_Search?pageIndex=0&pageSize=24&q=' + query;
}

function renderCaption(template, parts) {
    console.log(template, parts);

    return _.reduce(parts, function (memo, part, index) {
        return memo.replace('%' + index, part);
    }, template);
}

function createUrlFrom(mapping, parts) {
    var topCaption = renderCaption(mapping.topText, parts);
    var bottomCaption = renderCaption(mapping.bottomText, parts);

    return 'http://version1.api.memegenerator.net/Instance_Create?' + 'username=thememebot' + '&password=password' + '&languageCode=en' + '&generatorID=' + mapping.generatorId + '&imageID=' + mapping.imageId + '&text0=' + topCaption + '&text1=' + bottomCaption;
}

exports.MemeApi = function (transport) {
    return {
        create: function (mapping, parts) {
            return transport.loadJson(createUrlFrom(mapping, parts)).then(function (result) {
                if (result.success) {
                    return result.result;
                }
                throw {
                    code: 503,
                    message: result
                };
            });
        },
        search: function (query) {
            return transport.loadJson(searchUrl(query)).then(function (result) {
                if (result.success) {
                    return result.result;
                }
                throw {
                    code: 503,
                    message: result
                };
            });
        }
    };
};