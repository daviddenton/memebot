'use strict';

require('newrelic');

var http = require('./lib/transport');
var ma = require('./lib/memeApi');
var map = require('./lib/mappings');

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var _ = require('lodash');
var favicon = require('serve-favicon');

var app = express();

var config = process.env;

var memeMappingsUrl = config['mememapping.url'];

var transport = new http.Transport();
var memeApi = new ma.MemeApi(config['memeapi.user'], config['memeapi.password'], transport);
var mappings = new map.Mappings(memeMappingsUrl, transport);
var renderedCache = require("lru-cache")({ max: 5000, maxAge: 1000 * 60 * 60 * 24 * 30 });

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(bodyParser.urlencoded({extended: false}));

function withCatch(response, promise) {
    return promise.catch(function (err) {
        response.status(err.code || 500).send(err.message);
    });
}

app.get('/cache', function (request, response) {
    var cacheContents = _.object(_.map(renderedCache.keys(), function (key) {
        return [key, renderedCache.get(key)];
    }));
    response.send(cacheContents);
});

app.get('/', function (request, response) {
    return withCatch(response, mappings.all().then(function (mappings) {
        response.render('availableMemes', { title: 'Available memes', mappings: mappings, originalUrl: request.originalUrl});
    }));
});

app.get('/search', function (request, response) {
    withCatch(response, memeApi.search(request.query.q).then(function (results) {
        response.render('search', { title: 'Search:' + request.query.q, memeMappingsUrl: memeMappingsUrl, results: results, query: request.query.q});
    }));
});

app.get('/*', function renderMemeImageFromGet(request, response) {
    if (renderedCache.has(request.url)) {
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
});

app.post('/', function (request, response) {
    withCatch(response, memeApi.create(request.body).then(function (result) {
        response.redirect(301, result.instanceImageUrl);
    }));
});

app.listen(app.get('port'), function () {
    console.log("Memebot is running at localhost:" + app.get('port'));
});
