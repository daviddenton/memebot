var TOKEN_PATTERN = /\%(\d+)/g;

var MODAL_PROPERTIES = {
    target: '.create-modal',
    effect: 'flip',
    overlaySpeed: 100,
    speed: 200
};

function substituteCaptionsInto(template, textAreas) {
    return _.reduce(textAreas, function (memo, textArea) {
        var $textArea = $(textArea);
        return memo.replace($textArea.attr('name'), $textArea.val());
    }, template);
}

function createCaptionTextAreas(mappingInFocus) {
    return _.chain((mappingInFocus.topText + mappingInFocus.bottomText).match(TOKEN_PATTERN) || []).unique().sortBy().map(function (token) {
        return $('<textarea>', {name: token, placeholder: token}).addClass('control');
    }).value();
}

$(document).ready(function () {

    var mappingInFocus = {};

    $('img.meme').click(function (e) {
        var target = $(e.target);
        mappingInFocus = JSON.parse(target.attr('mapping'));

        $('.create-meme img').attr('src', target.attr('src'));
        $('.create-meme .title').text('Create meme from: ' + target.attr('name'));
        $('.create-meme .templates').empty().append(createCaptionTextAreas(mappingInFocus));

        Custombox.open(MODAL_PROPERTIES);
        e.preventDefault();
    });

    $('.create-meme button').click(function () {
        var mappingToPost = _.extend(mappingInFocus);

        var templates = $('textarea.control');
        mappingToPost.topText = substituteCaptionsInto(mappingInFocus.topText, templates);
        mappingToPost.bottomText = substituteCaptionsInto(mappingInFocus.bottomText, templates);

        $.post('/', mappingToPost, function (url) {
            window.location = url;
        });
    });
});