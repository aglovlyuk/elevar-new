window.$ = window.jQuery = require('jquery');
window.isotope = require("isotope-layout/dist/isotope.pkgd.min");

const Tags = function() {
    let $grid,
        gridElements,
        btnMore,
        amountItems,
        elevateFilters;

    function initIsotope() {
        $grid = gridElements.isotope({
            itemSelector: '.grid-item',
            percentPosition: true,
            layoutMode: 'masonry',
            masonry: {
                columnWidth: '.grid-sizer'
            }
        });
    }

    function init() {
        gridElements      = $('.js-grid-tags');
        btnMore           = $('.js-btn-more');
        amountItems       = 12;
        elevateFilters    = $('#js-elevate-filters');

        if(gridElements.length > 0) {
            initIsotope();
        }
    }

    return {
        init: init
    }
};

window.addEventListener("load", function(event) {
    Tags().init();
});
