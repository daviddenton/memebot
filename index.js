var express = require('express');
var rp = require('request-promise');
var app = express();

function urlFrom(mappings, params) {
    var mapping = mappings[params.name];
    return 'http://version1.api.memegenerator.net/Instance_Create?' + 'username=thememebot' + '&password=password' + '&languageCode=en' + '&generatorID=' + mapping.generatorID + '&imageID=' + mapping.imageID + '&text0=' + mapping.topText.replace('%s', params.topCaption) + '&text1=' + mapping.bottomText.replace('%s', params.bottomCaption);
}

function get(uri) {
    return rp(uri)
        .then(function (data) {
            return JSON.parse(data);
        });
}

app.set('port', (process.env.PORT || 5000));

app.get('/', function (request, response) {
    response.send('Post to me at: /{name}/{topCaption}');
});

function renderMemeTo(params, response) {
    get('https://raw.githubusercontent.com/daviddenton/memebot/master/memeMappings.json').then(function (mappings) {
            get(urlFrom(mappings, params)).then(function (result) {
                    if (result.success) {
                        rp(result.result.instanceImageUrl).pipe(response);
                    } else {
                        response.status(503).send(result);
                    }
                });
        }).catch(function (err) {
            response.status(500).send(err);
        })
}

app.get('/:name/:topCaption', function (request, response) {
    request.params.bottomCaption = request.params.topCaption;
    renderMemeTo(request.params, response);
});

app.get('/:name/:topCaption/:bottomCaption', function (request, response) {
    renderMemeTo(request.params, response);
});

app.listen(app.get('port'), function () {
    console.log("Memebot is running at localhost:" + app.get('port'));
});
