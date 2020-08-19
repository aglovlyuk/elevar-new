const $ = require('jquery');
const jQueryBridget = require('jquery-bridget');
const Isotope = require('isotope-layout');
import isotope from 'isotope-layout'
jQueryBridget( 'isotope', Isotope, $ );

$(window).on('load', function () {
    const $grid = $('.js-grid-insights').isotope({
        itemSelector: '.grid-item',
        percentPosition: true,
        layoutMode: 'masonry',
        masonry: {
            // use outer width of grid-sizer for columnWidth
            columnWidth: '.grid-sizer'
        }
    });

// bind filter button click
    $('#js-filters')
        .on( 'click', 'button', function() {
            let filterValue = $( this ).attr('data-filter');
            $grid.isotope({ filter: filterValue });
        })
        .each( function( i, buttonGroup ) {
            let $buttonGroup = $( buttonGroup );
            $buttonGroup.on( 'click', 'button', function() {
                $buttonGroup.find('.is-checked').removeClass('is-checked');
                $( this ).addClass('is-checked');
            });
        });

});
