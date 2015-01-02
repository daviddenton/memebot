$(document).ready(function () {
    $('img.meme').click(function (e) {
        var target = $(e.target);
        console.log(target.attr('mapping'));
        var mapping = JSON.parse(target.attr('mapping'));
        $('.create-meme .title').text('Create meme from: ' + target.attr('name'));
        $('.create-meme #generatorId').val(mapping.generatorId);
        $('.create-meme #imageId').val(mapping.imageId);
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