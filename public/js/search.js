$(document).ready(function () {
    $('button.copy').zclip({
        path: 'http://cdnjs.cloudflare.com/ajax/libs/zclip/1.1.2/ZeroClipboard.swf',
        copy: function (event) {
            return $(event.target).attr('content');
        },
        afterCopy: function (event) {
            toastr.success('\'' + $(event.target).attr('name') + '\' JSON template copied to clipboard');
        }
    });
});