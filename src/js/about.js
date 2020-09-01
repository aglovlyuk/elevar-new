import 'slick-carousel';
const imagesLoaded = require('imagesloaded');
imagesLoaded.makeJQueryPlugin( $ );
import '../scss/custom.css';

var About = function () {
    var $sliderAdaptive,
        $slider;

    function initSliderAdaptive() {
        var currentSlideIndex,
            totalSlideCount;

        $sliderAdaptive.on('init', function (event, slick) {
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
        });

        $sliderAdaptive.slick({
            dots: true,
            infinite: true,
            slidesToShow: 1,
            centerMode: true,
            variableWidth: true,
            speed: 500,
            autoplay: true,
            autoplaySpeed: 5000
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

        $sliderAdaptive.imagesLoaded(function () {
            var $sliderAdaptiveApadtive = $('.slider-adaptive');

            var slick = $sliderAdaptiveApadtive.slick('getSlick');

            currentSlideIndex = slick.slickCurrentSlide();
            totalSlideCount = slick.slideCount;

            var $currentSlide = slick.$slides[currentSlideIndex];
            var width = $($currentSlide).width();
            var parentWidth = $sliderAdaptiveApadtive.parent().width();
            var marginleft = ((parentWidth - width) / 2) - 5;

            setTimeout(function () {
                $('.block-left, .block-right').css({
                    'width': marginleft
                });
            }, 100);
        });
    }

    function initSlick() {
        $slider.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 5000,
            dots: false,
            infinite: true,
            speed: 500,
            fade: true,
            cssEase: 'linear'
        });
    }

    function init() {
        $sliderAdaptive = $('.slider-adaptive');
        $slider = $('.slider');

        if ($sliderAdaptive.length > 0) {
            initSliderAdaptive();
        }

        if ($slider.length > 0) {
            initSlick();
        }
    }

    return {
        init: init
    }
};

About().init();
