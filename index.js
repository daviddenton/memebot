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

function renderMemeTo(params, response) {
    return withCatch(response, mappings.get(params.templateName).then(function (mapping) {
        return memeApi.create(mapping, params).then(function (result) {
            response.redirect(result.instanceImageUrl);
        });
    }));
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

app.get('/:templateName/:topCaption', function (request, response) {
    request.params.bottomCaption = request.params.topCaption;
    renderMemeTo(request.params, response);
});

app.get('/:templateName/:topCaption/:bottomCaption', function (request, response) {
    renderMemeTo(request.params, response);
});

app.listen(app.get('port'), function () {
    console.log("Memebot is running at localhost:" + app.get('port'));
});
