const jQueryBridget = require('jquery-bridget');
const Isotope = require('isotope-layout');
import isotope from 'isotope-layout'
jQueryBridget( 'isotope', Isotope, $ );

$(window).on('load', function () {
    let qsRegex;
    const searchInput   = $('.js-filter-search');
    const btnMore       = $('.js-btn-more');
    const amountItems   = 5;

    const $grid = $('.js-grid-insights').isotope({
        itemSelector: '.grid-item',
        percentPosition: true,
        layoutMode: 'masonry',
        masonry: {
            columnWidth: '.grid-sizer'
        },
        filter: function() {
            return qsRegex ? $(this).text().match( qsRegex ) : true;
        }
    });

    // debounce so filtering doesn't happen every millisecond
    function debounce( fn, threshold ) {
        let timeout;
        threshold = threshold || 100;

        return function debounced() {
            clearTimeout( timeout );
            let args = arguments;
            let _this = this;

            function delayed() {
                fn.apply( _this, args );
            }
            timeout = setTimeout( delayed, threshold );
        };
    }

    // use value of search field to filter
    const $quicksearch = searchInput.on('keyup search', debounce( function() {
        qsRegex = new RegExp( $quicksearch.val(), 'i' );
        $grid.isotope({
            filter: function() {
                return qsRegex ? $(this).text().match( qsRegex ) : true;
            }
        });
    }, 200 ));

    // bind filter button click
    $('#js-filters')
        .on( 'click', 'button', function() {
            let filterValue = $( this ).attr('data-filter');

            searchInput.val('');
            $grid.isotope({ filter: filterValue });
        })
        .each( function( i, buttonGroup ) {
            let $buttonGroup = $( buttonGroup );

            $buttonGroup.on( 'click', 'button', function() {
                $buttonGroup.find('.is-checked').removeClass('is-checked');
                $( this ).addClass('is-checked');
            });
        });

    // show/hide more button
    $grid.on('arrangeComplete', function (event, filteredItems) {
        if(filteredItems.length < amountItems) {
            btnMore.hide();
        } else {
            btnMore.show();
        }
    })
});
