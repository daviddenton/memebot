'use strict';

function searchUrl(query) {
    return 'http://version1.api.memegenerator.net/Generators_Search?pageIndex=0&pageSize=24&q=' + query;
}

function createUrlFrom(mapping, params) {
    return 'http://version1.api.memegenerator.net/Instance_Create?' + 'username=thememebot' + '&password=password' + '&languageCode=en' + '&generatorID=' + mapping.generatorId + '&imageID=' + mapping.imageId + '&text0=' + mapping.topText.replace('%s', params.topCaption) + '&text1=' + mapping.bottomText.replace('%s', params.bottomCaption);
}

exports.MemeApi = function (transport) {
    return {
        create: function (mapping, params) {
            return transport.loadJson(createUrlFrom(mapping, params)).then(function (result) {
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