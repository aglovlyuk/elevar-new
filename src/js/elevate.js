window.$ = window.jQuery = require('jquery');
window.isotope = require("isotope-layout/dist/isotope.pkgd.min");
const jQueryBridget = require('jquery-bridget');
const Lazyload = require('lazyload');
const imagesLoaded = require('imagesloaded');

// make jQuery plugins
imagesLoaded.makeJQueryPlugin( $ );
jQueryBridget( 'lazyload', Lazyload, $ );

const Elevate = function() {
    let qsRegex,
        $grid,
        gridParent,
        gridElements,
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

        $grid = gridParent.isotope({
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

        btnMore.find('a').on('click', function (e) {
            e.preventDefault();

            let nextItems = gridElements.filter(':visible:last').nextAll().slice(0, amountItems);

            if(amountItems > nextItems.length) {
                btnMore.hide();
            }
            nextItems.addClass('visible')
        })

        if(typeof iso !== "undefined") {
            iso.filteredItems.forEach( function( item, i ) {
                let images = $(item.element).find('img.lazyload[src*="data:image"]');
                lazyload(images);

                images.on('load', function() {
                    $grid.isotope('layout');
                });
            });
        }
    }

    // load all items
    function loadAll() {
        if(gridElements.length > 0) {
            gridElements.addClass('visible')
            btnMore.hide();
        }
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

            let iso = $grid.data('isotope');

            if(iso != null) {
                iso.filteredItems.forEach( function( item, i ) {
                    setTimeout(function () {
                        let images = $(item.element).find('img.lazyload[src*="data:image"]');
                        lazyload(images);

                        images.on('load', function() {
                            $grid.isotope('layout');
                        });
                    }, 10);
                });
            }
        }
    }

    function init() {
        gridParent        = $('.js-grid-insights');
        gridElements      = gridParent.find('.grid-item');
        searchInput       = $('.js-filter-search');
        btnMore           = $('.js-btn-more');
        amountItems       = 12;
        elevateFilters    = $('#js-elevate-filters');

        if(gridParent.length > 0) {
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
