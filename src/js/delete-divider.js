$(window).resize(function() {
    separatorHandler();
}).trigger('resize');

function separatorHandler() {
    var lastItemTop = $('#js-filters li:first-child').position().top;

    $('#js-filters li').each(function() {
        let $this = $(this);

        if ($this.position().top > lastItemTop) {
            lastItemTop = $this.position().top;
            $this.prev().addClass('new-line');
        } else {
            $this.prev().removeClass('new-line');
        }
    });
}
