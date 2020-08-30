import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

$(function(){
    const headerOptions = {
        init: function(){
            this.headerMobileMenu();
            this.headerStickyScroll();
            //this.closeMenu();
        },

        headerStickyScroll : function(){
            $(window).on('scroll', function(){
                $('.header').toggleClass('sticky', $(window).scrollTop() > 0);
            });
        },

        headerMobileMenu : function(){
            const $body = $('body');

            $('.js-mobile-menu-opener').click(function(){
                if($body.hasClass('is-menu-open')) {
                    $body.removeClass('is-menu-open');

                    if ("ontouchstart" in document.documentElement) {
                        bodyScrollLock.clearAllBodyScrollLocks();
                    }
                } else {
                    $body.addClass('is-menu-open');

                    if ("ontouchstart" in document.documentElement) {
                        bodyScrollLock.disableBodyScroll(targetElement);
                    }
                }
            });
        },

        closeMenu: function(){
            $('.main-nav li a').click(function(){
                $('body').removeClass('is-menu-open');

                if ("ontouchstart" in document.documentElement) {
                    bodyScrollLock.clearAllBodyScrollLocks();
                }
            });
        }
    };

    return headerOptions.init();
});
