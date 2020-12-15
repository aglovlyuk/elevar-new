window.$ = window.jQuery = require('jquery');
window.isotope = require("isotope-layout/dist/isotope.pkgd.min");
const jQueryBridget = require('jquery-bridget');
const InfiniteScroll = require('infinite-scroll');
const imagesLoaded = require('imagesloaded');
// make Infinite Scroll a jQuery plugin
jQueryBridget( 'infiniteScroll', InfiniteScroll, $ );
InfiniteScroll.imagesLoaded = imagesLoaded;

const Elevate = function() {
    let qsRegex,
        $grid,
        gridElements,
        searchInput,
        btnMore,
        amountItems,
        filterValue,
        elevateFilters,
        nextURL;

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

    function updateNextURL(doc) {
        nextURL = $(doc).find('.pagination__next').attr('href');
    }

    // get initial nextURL
    updateNextURL( document );

    function initIsotope() {
        const $noResults = $('.no-results');

        $grid = gridElements.isotope({
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

        // layout Isotope after each image loads
        $grid.imagesLoaded().progress(function () {
            $grid.isotope('layout');
        });

        let iso = $grid.data('isotope');

        $grid.infiniteScroll({
            path: function() {
                return nextURL;
            },
            append: '.grid-item',
            loadOnScroll: false,
            button: '.js-btn-more',
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
                btnMore.hide();
            }

            setTimeout(function () {
                $grid.isotope();

                //show message if no results returned.
                !$grid.data('isotope').filteredItems.length
                    ? $noResults.removeClass('hidden')
                    : $noResults.addClass('hidden');
            }, 100);
        }, 200));
    }

    // load all items
    function loadAll() {
        $grid.infiniteScroll('loadNextPage');

        $grid.on('load.infiniteScroll', function( event, response ) {
            if(typeof response !== "undefined") {
                updateNextURL( response );

                setTimeout(function () {
                    $grid.infiniteScroll('loadNextPage');
                }, 10);

                btnMore.hide();
            } else {
                btnMore.show();
            }
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
            $grid.isotope();
        }
    }

    function init() {
        gridElements      = $('.js-grid-insights');
        searchInput       = $('.js-filter-search');
        btnMore           = $('.js-btn-more');
        amountItems       = 12;
        elevateFilters    = $('#js-elevate-filters');

        if(gridElements.length > 0) {
            initIsotope();
        }

        if(elevateFilters.length > 0) {
            elevateFilters.on('click', 'button', filterEventHandler);
        }
    }

    return {
        init: init
    }
};

Elevate().init();
