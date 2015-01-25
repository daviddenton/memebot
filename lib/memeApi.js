'use strict';

var _ = require('lodash');

exports.MemeApi = function (user, password, transport) {

    function searchUrl(query, pageIndex) {
        return 'http://version1.api.memegenerator.net/Generators_Search?pageIndex=' + pageIndex + '&pageSize=24&q=' + query;
    }

    function renderCaption(template, parts) {
        return _.reduce(parts, function (memo, part, index) {
            return memo.replace('%' + index, part);
        }, template);
    }

    function mappingFromSearchResult(result) {
        return {
            generatorId: result.generatorID,
            imageId: parseInt(result.imageUrl.match(/(\d+)\.jpg/)[1]),
            topText: '%0',
            bottomText: '%1'
        };
    }

    function createUrlFrom(mapping, parts) {
        var topCaption = renderCaption(mapping.topText || '%0', parts);
        var bottomCaption = renderCaption(mapping.bottomText || '%1', parts);

        return 'http://version1.api.memegenerator.net/Instance_Create?username=' + user + '&password=' + password + '&languageCode=en' + '&generatorID=' + mapping.generatorId + '&imageID=' + mapping.imageId + '&text0=' + topCaption + '&text1=' + bottomCaption;
    }

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
        search: function (query, pageIndex) {
            return transport.loadJson(searchUrl(query, pageIndex)).then(function (result) {
                if (result.success) {
                    return _.map(result.result, function (result) {
                        result.mapping = JSON.stringify(mappingFromSearchResult(result), undefined, 2);
                        return result;
                    });
                }
                throw {
                    code: 503,
                    message: result
                };
            });
        }
    };
};