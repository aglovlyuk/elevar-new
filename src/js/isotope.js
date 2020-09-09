const jQueryBridget = require('jquery-bridget');
const Isotope = require('isotope-layout');
const InfiniteScroll = require('infinite-scroll');
jQueryBridget( 'isotope', Isotope, $ );

jQueryBridget( 'infiniteScroll', InfiniteScroll, $ );
jQueryBridget( 'isotope', Isotope, $ );

const Elevate = function() {
    let qsRegex,
        $grid,
        searchInput,
        btnMore,
        amountItems,
        filterValue,
        elevateFilters;

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

    function initIsotope() {
        const $noResults = $('.no-results');

        $grid = $('.js-grid-insights').isotope({
            itemSelector: '.grid-item',
            percentPosition: true,
            layoutMode: 'masonry',
            masonry: {
                columnWidth: '.grid-sizer'
            },
            filter: function() {
                let $this = $(this),
                    searchResult = qsRegex ? $(this).text().match( qsRegex ) : true,
                    buttonResult = filterValue ? $this.is(filterValue) : true;

                return searchResult && buttonResult;
            }
        });

        let iso = $grid.data('isotope');

        $grid.infiniteScroll({
            path: '.pagination__next',
            append: '.grid-item',
            hideNav: '.pagination',
            checkLastPage: true,
            history: false,
            outlayer: iso,
            status: '.page-load-status'
        });

        // use value of search field to filter
        searchInput.on('keyup search', debounce( function() {
            qsRegex = new RegExp(searchInput.val(), 'gi');

            if (typeof filterValue === 'undefined') {
                loadAll();
            }

            setTimeout(function () {
                $grid.isotope();

                //show message if no results returned.
                !$grid.data('isotope').filteredItems.length
                    ? $noResults.removeClass('hidden')
                    : $noResults.addClass('hidden');
            }, 100);
        }, 200));

        // show/hide more button
        $grid.on('arrangeComplete', function (event, filteredItems) {
            if(filteredItems.length < amountItems) {
                btnMore.hide();
            } else {
                btnMore.show();
            }
        });
    }

    function loadAll() {
        var $pagination = $('.pagination'),
            pages = $pagination.find('.page-num');

        $.each(pages, function (index, value) {
            $grid.infiniteScroll('loadNextPage');
        });
    }

    // bind filter button click

    function filterEventHandler() {
        var $this = $(this);

        filterValue = $this.data('filter');

        // menu active states
        elevateFilters.find('.filters__btn').removeClass('is-checked');
        $this.toggleClass('is-checked');

        // filter items
        if ($grid.length > 0) {
            loadAll();

            $grid.isotope({ filter: filterValue });
        }
    }

    function init() {
        searchInput       = $('.js-filter-search');
        btnMore           = $('.js-btn-more');
        amountItems       = 5;
        elevateFilters    = $('#js-elevate-filters');

        if(elevateFilters.length > 0) {
            initIsotope();

            elevateFilters.on('click', 'button', filterEventHandler);
        }
    }

    return {
        init: init
    }
};

Elevate().init();
