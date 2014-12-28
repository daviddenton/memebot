'use strict';

var http = require('./lib/transport');
var ma = require('./lib/memeApi');
var map = require('./lib/mappings');

var express = require('express');

var app = express();

var transport = new http.Transport();
var memeApi = new ma.MemeApi(transport);
var mappings = new map.Mappings(transport);
var renderedCache = require("lru-cache")(5000);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

function withCatch(response, promise) {
    return promise.catch(function (err) {
        response.status(err.code || 500).send(err.message);
    });
}

function renderMemeImage(request, response) {
    if(renderedCache.has(request.url)) {
        response.redirect(301, renderedCache.get(request.url));
    } else {
        var parts = request.url.split('/').slice(1);

        withCatch(response, mappings.get(parts[0]).then(function (mapping) {
            return memeApi.create(mapping, parts.slice(1)).then(function (result) {
                response.redirect(301, result.instanceImageUrl);
                renderedCache.set(request.url, result.instanceImageUrl);
            });
        }));
    }
}

app.get('/', function (request, response) {
    return withCatch(response, mappings.all().then(function (mappings) {
        response.render('index', { title: 'Available memes', mappings: mappings, originalUrl: request.originalUrl});
    }));
});

app.get('/:search', function (request, response) {
    withCatch(response, memeApi.search(request.query.q).then(function (results) {
        response.render('search', { title: 'Search', results: results, query: request.query.q});
    }));
});

app.get('/*', renderMemeImage);
app.post('/*', renderMemeImage);

app.listen(app.get('port'), function () {
    console.log("Memebot is running at localhost:" + app.get('port'));
});
