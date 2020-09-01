import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

$(function(){
    const headerOptions = {
        init: function(){
            this.headerMobileMenu();
            this.headerStickyScroll();
            this.innerMobileMenu();
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
                        clearAllBodyScrollLocks();
                    }
                } else {
                    $body.addClass('is-menu-open');

                    if ("ontouchstart" in document.documentElement) {
                        disableBodyScroll(this);
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
        },

        innerMobileMenu: function () {
            if (window.matchMedia("(max-width: 1023px)").matches) {
                $('.navbar-nav a').each(function () {
                    let $this = $(this);
                    let parentLi = $this.parent();
                    const activeClass = 'is-drop-opened';

                    if($this.next('ul').length > 0) {
                        $this.one('click', function (e) {
                            e.preventDefault();

                            if(parentLi.hasClass(activeClass)) {
                                parentLi.removeClass(activeClass)
                            } else {
                                parentLi.siblings('li.is-drop-opened').removeClass('is-drop-opened');
                                parentLi.addClass(activeClass)
                            }
                        })
                    }
                })
            }
        }
    };

    return headerOptions.init();
});
