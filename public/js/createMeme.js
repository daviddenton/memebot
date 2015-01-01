$(document).ready(function () {
    $('img.meme').click(function (e) {
        var target = $(e.target);
        $('.create-meme .title').text('Create meme from: ' + target.attr('name'));
        $('.create-meme #generatorId').val(target.attr('generatorId'));
        $('.create-meme #imageId').val(target.attr('imageId'));
        $('.create-meme img').attr('src', target.attr('src'));
        Custombox.open({
            target: '.create-modal',
            effect: 'flip',
            overlaySpeed: 100,
            speed: 200
        });
        e.preventDefault();
    });
});