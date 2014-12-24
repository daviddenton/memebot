'use strict';

var rp = require('request-promise');

exports.Transport = function() {
    return {
        loadJson: function(uri) {
            return rp(uri).then(function (data) {
                return JSON.parse(data);
            });
        }
    };
};