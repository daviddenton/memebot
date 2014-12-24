var express = require('express');
var rp = require('request-promise');
var app = express();

function urlFrom(mappings, params) {
    var mapping = mappings[params.name];
    return 'http://version1.api.memegenerator.net/Instance_Create?' + 'username=thememebot' + '&password=password' + '&languageCode=en' + '&generatorID=' + mapping.generatorID + '&imageID=' + mapping.imageID + '&text0=' + mapping.topText.replace('$CAPTION$', params.caption) + '&text1=' + mapping.bottomText.replace('$CAPTION$', params.caption);
}

function get(uri) {
    return rp(uri)
        .then(function (data) {
            console.log(data);
            return JSON.parse(data);
        });
}

app.set('port', (process.env.PORT || 5000));

app.get('/', function (request, response) {
    response.send('Post to me at: /{name}/{caption}');
});

app.get('/:name/:caption', function (request, response) {
    get('https://raw.githubusercontent.com/daviddenton/memebot/master/memeMappings.json')
        .then(function (mappings) {
            get(urlFrom(mappings, request.params))
                .then(function (result) {
                    if(result.success) {
                        rp(result.result.instanceImageUrl).pipe(response);
                    } else {
                        response.status(500).send(data);
                    }
                });
        })
});

app.listen(app.get('port'), function () {
    console.log("Memebot is running at localhost:" + app.get('port'));
});
