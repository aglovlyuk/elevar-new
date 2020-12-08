window.$ = window.jQuery = require('jquery');
window.isotope = require("isotope-layout/dist/isotope.pkgd.min");
const jQueryBridget = require('jquery-bridget');
const Lazyload = require('lazyload');
const imagesLoaded = require('imagesloaded');

// make jQuery plugins
imagesLoaded.makeJQueryPlugin( $ );
jQueryBridget( 'lazyload', Lazyload, $ );

var Work = function(settings) {
    let $window,
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
                    var $elem = $('<div class="col-12 col-sm-6 col-md-4 col-lg-3 grid-item blurb"><div class="info-wrapp"><div class="info">' + data + '</div></div></div>').addClass(tagName.toLowerCase());

                    $grid.isotope('remove', $($grid).find('.blurb')).isotope('layout');
                    $grid.prepend($elem).isotope('prepended', $elem).isotope('layout');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Error loading tag data.");
            }
        });
    }

    function workSubMenuClickEventHandler(e) {
        var $this = $(this);

        filterValue = $this.data('filter');
        var tagName = filterValue !== '*'
            ? filterValue.substring(1)
            : filterValue;

        // menu active states
        $workSubMenu.find('.submenu__btn').removeClass('is-checked');
        $this.toggleClass('is-checked');

        // ajax call for the tag section "blurb"
        tagName !== '*'
            ? populateTagBlurb(tagName)
            : $grid.isotope('remove', $($grid).find('.blurb')).isotope('layout');

        // filter items
        if ($grid.length > 0) {
            $grid.isotope({ filter: filterValue });

            if (tagName === '*') {
                $grid.isotope('shuffle');
                $grid.isotope('updateSortData').isotope();
            } else {
                $grid.isotope({ sortBy: 'original-order' })
            }
        }

        let iso = $grid.data('isotope');

        if(iso != null)
        {
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

    function initSliderAdaptive() {
        $slider = $('.slider-adaptive');

        var $moreInfoContainer = $slider.parent().find('.teaser-info-container'),
            $btnMoreInfo = $slider.parent().find('.more-info'),
            currentSlideIndex,
            totalSlideCount;

        $slider.on('init', function (event, slick) {
            currentSlideIndex = slick.slickCurrentSlide();
            totalSlideCount = slick.slideCount;

            var $currentSlide = slick.$slides[currentSlideIndex];

            var width = $($currentSlide).width();
            var parentWidth = $(this).parent().width();
            var marginleft = ((parentWidth - width) / 2) - 5;

            setTimeout(function () {
                $('.block-left, .block-right').css({
                    'width': marginleft
                });
            }, 100);

            $('.block-left').on('click', function (e) {
                e.preventDefault();

                slick.slickPrev();
            });

            $('.block-right').on('click', function (e) {
                e.preventDefault();

                slick.slickNext();
            });

            // check to see if more info is present, if so bump over arrow
            moveSliderArrow($slider, currentSlideIndex);
        });

        $slider.slick({
            dots: true,
            infinite: true,
            slidesToShow: 1,
            centerMode: true,
            variableWidth: true,
            speed: 500,
            autoplay: true,
            autoplaySpeed: 10000
        }).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
            if (nextSlide > 0) {
                $slider.find('.slick-next').removeClass('testimonial').show();

                $moreInfoContainer
                    .removeClass('active')
                    .addClass('hide');
            } else {
                moveSliderArrow($slider, nextSlide);

                $moreInfoContainer.removeClass('hide');
            }
        }).on('afterChange', function (event, slick, currentSlide) {
            currentSlideIndex = currentSlide;

            var slidePadding = 5,
                previousSlideIndex = parseInt(currentSlide - 1),
                $prevSlide = slick.$slides[previousSlideIndex],
                $currentSlide = slick.$slides[currentSlideIndex];

            // get window slide offsets
            var width = $($currentSlide).width(),
                parentWidth = $(this).parent().width(),
                marginleft = (parentWidth - width) / 2;

            $('.block-left, .block-right').css({
                'width': marginleft - slidePadding
            });
        });

        $slider.imagesLoaded(function () {
            var $sliderApadtive = $('.slider-adaptive');

            var slick = $sliderApadtive.slick('getSlick');

            currentSlideIndex = slick.slickCurrentSlide();
            totalSlideCount = slick.slideCount;

            var $currentSlide = slick.$slides[currentSlideIndex];
            var width = $($currentSlide).width();
            var parentWidth = $sliderApadtive.parent().width();
            var marginleft = ((parentWidth - width) / 2) - 5;

            setTimeout(function () {
                $('.block-left, .block-right').css({
                    'width': marginleft
                });
            }, 100);
        });

        // more info click
        $moreInfoContainer.on('click', function (e) {
            e.preventDefault();

            var $this = $(this);
            $this.toggleClass('active');

            moveSliderArrow($slider, 0);

            if ($this.hasClass('active')) {
                $slider.slick('slickPause');
            } else {
                $slider.slick('slickPlay');
            }
        });
    }

    function initFilter() {
        var hash = window.location.hash,
            $items = $workSubMenu.find('a'),
            arr = [];

        $.each($items, function (index, value) {
            arr.push($(value).attr('href'));
        });

        if ($.inArray(hash, arr) > -1) {
            $workSubMenu.find('a[href="' + hash + '"]').trigger('click');
        }
    }

    function initIsotope() {
        const $noResults = $('.no-results');

        // init Isotope
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


        /*$('.grid-item').each(function() {
            var currentId = $(this).attr('data-id');

            if ($("[data-id='" + currentId +"']").length > 1) {
                $(this).remove();
            }
        });*/

        if(iso != null)
        {
            iso.filteredItems.forEach( function( item, i ) {
                let images = $(item.element).find('img.lazyload[src*="data:image"]');
                lazyload(images);
                
                images.on('load', function() {
                    $grid.isotope('layout');
                });
            });
        }
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

        if($workPage.length > 0) {
            initIsotope();
            lazyload();
        }

        // Event handlers
        if ($workSubMenu.length > 0) {
            $workSubMenu.find('a').on('click', workSubMenuClickEventHandler);

            menuClicked = true;
        }

        if($body.hasClass('work-details')) {
            initSliderAdaptive();
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

$(function(){
    Work().init();
});
