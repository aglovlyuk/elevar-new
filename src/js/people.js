window.$ = window.jQuery = require('jquery');
window.isotope = require("isotope-layout/dist/isotope.pkgd.min");
const jQueryBridget = require('jquery-bridget');
const Lazyload = require('lazyload');

// make Infinite Scroll a jQuery plugin
jQueryBridget( 'lazyload', Lazyload, $ );

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
            var $items = $peopleSubMenu.find('.submenu__btn'),
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
        $peopleSubMenu.find('.submenu__btn').removeClass('is-checked');
        $this.toggleClass('is-checked');

        // filter items
        if ($grid.length > 0) {
            $grid.isotope({ filter: filterValue });
        }

        let iso = $grid.data('isotope');

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

    function initIsotope() {
        const $noResults = $('.no-results');

        // init Isotope
        $grid = $($people).isotope({
                resizable: false,
                itemSelector: '.grid-item',
                percentPosition: true,
                layoutMode: 'fitRows',
                stagger: 20,
                transitionDuration: 0,
                visibleStyle: {
                    opacity: 1,
                    transform: 'translateY(0)'
                },
                hiddenStyle: {
                    opacity: 0,
                    transform: 'translateY(100px)'
                },
                filter: function () {
                    var $this = $(this),
                        searchResult = qsRegex ? $this.text().match(qsRegex) : true,
                        buttonResult = filterValue ? $this.is(filterValue) : true;

                    return searchResult && buttonResult;
                }
        });

        let iso = $grid.data('isotope');

        $search.on('keyup search', debounce( function() {
            qsRegex = new RegExp($search.val(), 'gi');

            setTimeout(function () {
                $grid.isotope();

                //show message if no results returned.
                !$grid.data('isotope').filteredItems.length
                    ? $noResults.removeClass('hidden')
                    : $noResults.addClass('hidden');
            }, 100);
        }, 200));

        iso.filteredItems.forEach( function( item, i ) {
            let images = $(item.element).find('img.lazyload[src*="data:image"]');
            lazyload(images);

            images.on('load', function() {
                $grid.isotope('layout');
            });
        });
    }

    function init() {
        $people = $('.js-grid-people');
        $peopleSubMenu = $('#js-people-filters');
        $search = $('.js-people-search');

        initIsotope();

        // event handlers
        $people.on('click', '.grid-item .info', executiveClickEventHandler);

        if ($peopleSubMenu.length > 0) {
            $peopleSubMenu.find('.submenu__btn').on('click', peopleSubMenuClickEventHandler);
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
