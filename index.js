'use strict';

var http = require('./lib/transport');
var ma = require('./lib/memeApi');
var map = require('./lib/mappings');

var app = require('express')();

var transport = new http.Transport();
var memeApi = new ma.MemeApi(transport);
var mappings = new map.Mappings(transport);

function withCatch(response, promise) {
    return promise.catch(function (err) {
        response.status(err.code || 500).send(err.message);
    });
}

app.set('port', (process.env.PORT || 5000));

app.get('/', function (request, response) {
    return withCatch(response, mappings.all().then(function (mappings) {
        response.send(mappings);
    }));

});

app.get('/:search', function (request, response) {
    withCatch(response, memeApi.search(request.query.q).then(function (results) {
        response.send(results);
    }));
});

function renderMemeImage(request, response) {
    var parts = request.url.split('/').slice(1);

    withCatch(response, mappings.get(parts[0]).then(function (mapping) {
        return memeApi.create(mapping, parts.slice(1)).then(function (result) {
            response.redirect(result.instanceImageUrl);
        });
    }));
}

app.get('/*', renderMemeImage);
app.post('/*', renderMemeImage);

app.listen(app.get('port'), function () {
    console.log("Memebot is running at localhost:" + app.get('port'));
});
