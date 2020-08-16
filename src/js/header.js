import $ from 'jquery';
window.jQuery = $;
window.$ = $;

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
            $('.js-mobile-menu-opener').click(function(){
                $('body').toggleClass('is-menu-open');
            });
        },

        closeMenu: function(){
            $('.header__nav-list li a').click(function(){
                $('body').removeClass('is-menu-open');
            });
        }
    };

    return headerOptions.init();
});
