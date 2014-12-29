$(document).ready(function () {
    $('button.meme').zclip({
        path: '/lib/zeroclip/ZeroClipboard.swf',
        copy: function (event) {
            return document.location.origin + $(event.target).attr('url');
        },
        afterCopy: function () {
        }
    });
});