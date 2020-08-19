const $ = require('jquery');
const jQueryBridget = require('jquery-bridget');
const Isotope = require('isotope-layout');
import isotope from 'isotope-layout'
jQueryBridget( 'isotope', Isotope, $ );

$(window).on('load', function () {
    let qsRegex;
    const $grid = $('.js-grid-insights').isotope({
        itemSelector: '.grid-item',
        percentPosition: true,
        layoutMode: 'masonry',
        masonry: {
            // use outer width of grid-sizer for columnWidth
            columnWidth: '.grid-sizer'
        },
        filter: function() {
            return qsRegex ? $(this).text().match( qsRegex ) : true;
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

    // use value of search field to filter
    const $quicksearch = $('.js-filter-search').keyup( debounce( function() {
        qsRegex = new RegExp( $quicksearch.val(), 'i' );
        $grid.isotope();
    }, 200 ) );

    // debounce so filtering doesn't happen every millisecond
    function debounce( fn, threshold ) {
        var timeout;
        threshold = threshold || 100;

        return function debounced() {
            clearTimeout( timeout );
            var args = arguments;
            var _this = this;
            function delayed() {
                fn.apply( _this, args );
            }
            timeout = setTimeout( delayed, threshold );
        };
    }
});
