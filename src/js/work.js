const Isotope = require('isotope-layout');
import isotope from 'isotope-layout'
const jQueryBridget = require('jquery-bridget');
const InfiniteScroll = require('infinite-scroll');
import Lazyload from 'lazyload';

// make jQuery plugins
jQueryBridget( 'infiniteScroll', InfiniteScroll, $ );
jQueryBridget( 'isotope', Isotope, $ );
jQueryBridget( 'lazyload', Lazyload, $ );

var Work = function(settings) {
    var $window,
        $body,
        $work,
        $workPage,
        $workSubMenu,
        $grid,
        $search,
        $contentArrow,
        qsRegex,
        filterValue,
        numberOfPages,
        menuClicked = false;

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

    function populateTagBlurb(tagName) {
        var sectionType = $grid.closest('section');

        $.ajax({
            url: "/umbraco/surface/tagmanagement/" + sectionType.data('section').toLowerCase() + "/" + tagName,
            method: "post",
            success: function (data) {
                if (data) {
                    var $elem = $('<li class="blurb item"><div class="info">' + data + '</div></li>').addClass(tagName.toLowerCase());

                    $grid.isotope('remove', $($grid).find('.blurb')).isotope('layout');
                    $grid.prepend($elem).isotope('prepended', $elem).isotope('layout');

                    // now it's prepended, try to move to 3rd position.
                   // $grid.isotope('destroy');

                    //var $firstElem = $grid.find('li:first');
                    //$firstElem.detach();

                    //$grid.find('li:eq(2)').after($firstElem);

                    //initGrid();
                    //$grid.isotope().isotope('layout');

                    //$grid.isotope('layout');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Error loading tag data.");
            }
        });
    }

    function workSubMenuClickEventHandler(e) {
        var $this = $(this);

        app.initArrow();

        filterValue = $this.data('filter');
        var tagName = filterValue !== '*'
            ? filterValue.substring(1)
            : filterValue;

        // menu active states
        $workSubMenu.find('.filters__btn').removeClass('is-checked');
        $this.toggleClass('is-checked');


        // ajax call for the tag section "blurb"
        tagName !== '*'
            ? populateTagBlurb(tagName)
            : $grid.isotope('remove', $($grid).find('.blurb')).isotope('layout');

        // filter items
        if ($grid.length > 0) {
            loadAll();

            app.initArrow();

            if (tagName === '*') {
                $grid.isotope({ sortBy: 'originial-order' }).isotope();
                return;
            }

            $grid.isotope({ sortBy: ['featured', 'random'] });

            $grid.isotope('updateSortData').isotope();
        }
    }

    function moveSliderArrow(elem, slideIndex) {
        if (slideIndex === 0) {
            var $slickNext = $(elem).find('.slick-next');

            $slickNext.addClass('testimonial');

            var $teaserContainer = $(elem).parent().find('.teaser-info-container');
            if ($teaserContainer.length > 0) {
                if ($teaserContainer.hasClass('active')) {
                    $slickNext.addClass('expanded');
                } else {
                    $slickNext.removeClass('expanded');
                }
            }
        }
    }

    function initFilter() {
        var hash = window.location.hash,
            $items = $workSubMenu.find('a'),
            arr = new Array();

        $.each($items, function (index, value) {
            arr.push($(value).attr('href'));
        });

        if ($.inArray(hash, arr) > -1) {
            $workSubMenu.find('a[href="' + hash + '"]').trigger('click');
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
        // init Isotope
        var $win = $(window),
            $con = $('#masonry'),
            $imgs = $("img.lazy");

        $grid = $($work).isotope({
            resizable: false,
            itemSelector: '.grid-item',
            percentPosition: true,
            layoutMode: 'fitRows',
            stagger: 20,
            transitionDuration: 0,
            visibleStyle: {
                opacity: 1,
                transform: 'translateY(0)',
            },
            hiddenStyle: {
                opacity: 0,
                transform: 'translateY(100px)',
            },
            filter: function () {
                var $this = $(this),
                    searchResult = qsRegex ? $this.text().match(qsRegex) : true,
                    buttonResult = filterValue ? $this.is(filterValue) : true;

                return searchResult && buttonResult;
            },
            getSortData: {
                featured: function (itemElem) {
                    var weight = $(itemElem).find('.featured').text();

                    return parseInt(weight);
                },
                sortorder: '.sortorder'
                //title: '.title',
            },
            sortAscending: {
                featured: false,
                sortorder: true
                //title: true
            },
            onLayout: function () {
                $win.trigger("scroll");
            }
        });


        var iso = $grid.data('isotope');

        // layout Isotope after each image loads
        $grid.imagesLoaded().progress(function () {
            $grid.isotope('layout');
        });

        $grid.imagesLoaded(function () {
            app.initArrow();
        });

        $grid.infiniteScroll({
            path: '.pagination__next',
            append: '.item',
            hideNav: '.pagination',
            checkLastPage: true,
            history: false,
            outlayer: iso,
            status: '.page-load-status'
        });

        $search.on('keyup search', debounce( function() {
            qsRegex = new RegExp($search.val(), 'gi');

            if (typeof filterValue === 'undefined') {
                loadAll();
            }

            setTimeout(function () {
                $grid.isotope();
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

        //var contactDiv = $('<li class="blurb item"><div class="info">To contact me please call 555-8723</div></li>');
        //$grid.prepend(contactDiv).isotope('prepended', contactDiv);
    }

    function init() {
        $window = $(window);
        $body = $('body');
        $workPage = $('.work-page');
        $work = $workPage.find('.js-grid-work');
        $workSubMenu = $('#js-work-filters');
        $search = $('#work-section').find('.js-filter-search');
        $contentArrow = $('#content-arrow');
        numberOfPages = parseInt($('.pagination').find('.page-num').last().text());

        lazyload();
        initIsotope();

        // Event handlers
        if ($workSubMenu.length > 0) {
            $workSubMenu.find('a').on('click', workSubMenuClickEventHandler);

            menuClicked = true;
        }

        if (window.location.hash.length > 0) {
            initFilter();
        }

        $(window).on('hashchange', function () {
            //!menuClicked
            if (menuClicked) {
                initFilter();
            }
        });
    }

    return {
        init: init
    }
};

Work().init();
