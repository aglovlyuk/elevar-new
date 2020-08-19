import 'bootstrap/js/dist/modal';

$(function() {
    const videoIframe = $("#video-yt");
    const url = videoIframe.attr('src');

    videoIframe.attr('src', '');

    $("#video-modal")
        .on('shown.bs.modal', function () {
            videoIframe.attr('src', url);
        })
        .on('hide.bs.modal', function () {
            videoIframe.attr('src', '');
        });
});
