$(document).ready(function () {
    $('button.copy').zclip({
        path: '/lib/zeroclip/ZeroClipboard.swf',
        copy: function (event) {
            return $(event.target).attr('content');
        },
        afterCopy: function () {
        }
    });
});