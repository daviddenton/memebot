'use strict';

var http = require('./transport');
var ma = require('./memeApi');
var map = require('./mappings');

var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var favicon = require('serve-favicon');

exports.MemebotServer = function (config, log) {

    var app = express();

    var memeMappingsUrl = config.valueOf('mememapping.url');

    var transport = new http.Transport();
    var memeApi = new ma.MemeApi(config.valueOf('memeapi.user'), config.valueOf('memeapi.password'), transport);
    var mappings = new map.Mappings(memeMappingsUrl, transport);
    var renderedCache = require("lru-cache")({ max: 5000, maxAge: 1000 * 60 * 60 * 24 * 30 });

    app.set('views', config.pathTo('views'));
    app.set('view engine', 'jade');
    app.set('port', config.valueOf('PORT'));
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(express.static(config.pathTo('public')));
    app.use(favicon(config.pathTo('public', 'images', 'favicon.ico')));

    function withCatch(response, promise) {
        return promise.catch(function (err) {
            response.status(err.code || 500).send(err.message);
        });
    }

    app.get('/ping', function (request, response) {
        response.send('pong');
    });

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
            response.send(result.instanceImageUrl);
        }));
    });

    return {
        start: function () {
            app.listen(app.get('port'), function () {
                log("Memebot is running at localhost:" + app.get('port'));
            });
        }
    };
};


