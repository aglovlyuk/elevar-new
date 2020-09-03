const Isotope = require('isotope-layout');
import isotope from 'isotope-layout'
const jQueryBridget = require('jquery-bridget');
const InfiniteScroll = require('infinite-scroll');

// make Infinite Scroll a jQuery plugin
jQueryBridget( 'infiniteScroll', InfiniteScroll, $ );
jQueryBridget( 'isotope', Isotope, $ );

var People = function(settings){
    var $people,
        $peopleSubMenu,
        $search,
        $peopleList,
        $grid,
        filters = {},
        qsRegex,
        filterValue;

    var filterFns = {
        search: function () {
            return qsRegex ? $(this).text().match(qsRegex) : true;
        }
    };

    function scrollToPosition(elem) {
        $('html, body').animate({
            scrollTop: elem.length > 0
                ? elem.offset().top
                : 0
        });
    }

    function activatePerson() {
        var hash = window.location.hash;
        var $person = $people.find(hash);

        if ($person.length > 0) {
            var $parent = $person.parent();

            if($parent.hasClass('executive') || $parent.hasClass('expert')) {
                $parent.addClass('active');
            }

            if(!$parent.hasClass('active')) {
                scrollToPosition($parent);
            }
        } else {
            var $items = $peopleSubMenu.find('.filters__btn'),
                arr = new Array();

            $.each($items, function(index, value) {
                arr.push($(value).attr('href'));
            });

            if ($.inArray(hash, arr) > -1) {
               $peopleSubMenu.find('a[href="' + hash + '"]').trigger('click');
            }
        }
    }

    function executiveClickEventHandler(e) {
        e.preventDefault();

        var $this = $(this);

        $this.parent().toggleClass('active');

        $grid.isotope('layout');

        scrollToPosition($this);
    }

    function peopleSubMenuClickEventHandler(e) {
        var $this = $(this);

        filterValue = $this.data('filter');

        // menu active states
        $peopleSubMenu.find('.filters__btn').removeClass('is-checked');
        $this.toggleClass('is-checked');

        // filter items
        if ($grid.length > 0) {
            loadAll();

            $grid.isotope();
        }
    }

    function peopleListCallback(e) {
        var resultCount = parseInt(e.matchingItems.length);

        if(settings.isDesktop) {
            (resultCount % 2 !== 0 || resultCount === 2)
                ? $people.addClass('flex-start')
                : $people.removeClass('flex-start');
        }
    }

    function debounce(fn, threshold) {
        var timeout;
        return function debounced() {
            if (timeout) {
                clearTimeout(timeout);
            }
            function delayed() {
                fn();
                timeout = null;
            }
            timeout = setTimeout(delayed, threshold || 100);
        }
    }

    function loadAll() {
        var $pagination = $('.pagination'),
            pages = $pagination.find('.page-num');

        $.each(pages, function (index, value) {
            $grid.infiniteScroll('loadNextPage');
        });
    }

    function initIsotope() {
        var $noResults = $('.no-results');

        // init Isotope
        $grid = $($people).isotope({
                resizable: false,
                itemSelector: '.grid-item',
                percentPosition: true,
                layoutMode: 'fitRows',
                stagger: 20,
                transitionDuration: 0,
                visibleStyle: {
                    transform: 'translateY(0)', opacity: 1
                },
                hiddenStyle: {
                    transform: 'translateY(100px)', opacity: 0
                },
                filter: function () {
                    var $this = $(this),
                        searchResult = qsRegex ? $this.text().match(qsRegex) : true,
                        buttonResult = filterValue ? $this.is(filterValue) : true;

                    return searchResult && buttonResult;
                }
        });

        // layout Isotope after each image loads
        $grid.imagesLoaded().progress(function () {
            $grid.isotope('layout');
        });

        $search.on('keyup search', debounce( function() {
            qsRegex = new RegExp($search.val(), 'i');

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

        $grid.on('append.infiniteScroll', function (event, response, path, items) {
            //var infScroll = $(this).data('infiniteScroll');

            if (typeof filterValue !== 'undefined') {
                if (filterValue !== '*') {
                    loadAll();
                }
            }
        });

        var iso = $grid.data('isotope');

        $grid.infiniteScroll({
            path: '.pagination__next',
            append: '.grid-item',
            hideNav: '.pagination',
            checkLastPage: true,
            history: false,
            outlayer: iso,
            status: '.page-load-status'
        });
    }

    function init() {
        $people = $('.people-page').find('.js-grid-people');
        $peopleSubMenu = $('#js-people-filters');
        $search = $('#people-section').find('.js-filter-search');

        initIsotope();

        // event handlers
        $people.on('click', '.grid-item .info', executiveClickEventHandler);

        if ($peopleSubMenu.length > 0) {
            $peopleSubMenu.find('.filters__btn').on('click', peopleSubMenuClickEventHandler);
        }

        if (window.location.hash.length > 0) {
            activatePerson();
        }

        $(window).on('hashchange', function () {
            activatePerson();
        });
    }

    return {
        init: init
    }
};

People().init();
