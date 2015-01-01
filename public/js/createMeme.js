$(document).ready(function () {
    $('img.meme').click(function (e) {
        var target = $(e.target);
        $('#generatorId').val(target.attr('generatorId'));
        $('#imageId').val(target.attr('imageId'));
        $('img.create-meme').attr('src', target.attr('src'));
        Custombox.open({
            target: '.create-modal',
            effect: 'flip',
            overlaySpeed: 100,
            speed: 200
        });
        e.preventDefault();
    });
});