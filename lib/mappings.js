'use strict';

exports.Mappings = function (transport) {
    return {
        all: function () {
            return transport.loadJson('https://raw.githubusercontent.com/daviddenton/memebot/master/memeMappings.json');
        },
        get: function (name) {
            return this.all().then(function (mappings) {
                return mappings[name];
            });
        }
    };
};