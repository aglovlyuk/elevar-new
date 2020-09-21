var Application = function(application){
    var self = this,
        $window,
        $body,
        $siteMask,
        $contentArrow,
        people;

    this.settings = {
        isMobile: false,
        isTablet: false,
        isDesktop: false,
        initialized: false,
        previousLayout: ''
    };

    function windowResizeHandler(event) {
        var oldSettings = $.extend({}, self.settings);

        self.settings.isMobile = window.matchMedia('(max-width: 767px)').matches;
        self.settings.isTablet = window.matchMedia('screen and (min-width: 768px) and (max-width: 1023px)').matches;
        self.settings.isDesktop = window.matchMedia('(min-width: 1024px)').matches;

        initContentArrow();
    }

    /*function initWaypoint() {
        var waypoint = new Waypoint({
            element: $($body),
            handler: function (direction) {
                $contentArrow.toggleClass('active');
            },
            offset: '-5%'
        });
    }*/

    function initContentArrow() {
        var $main = $('#main');

        var contentHeight = parseInt($main.outerHeight(true)),
            windowHeight = parseInt($window.outerHeight(true));

        if (contentHeight < windowHeight) {
            $contentArrow.removeClass('active');
        } else {
            $contentArrow.addClass('active');
        }
    }

    function init() {
        $window = $(window);
        $body = $('body');
        $siteMask = $('#site-mask');
        $contentArrow = $('#content-arrow');

        //initWaypoint();

        $window.on('resize', windowResizeHandler);
        $window.resize();

        $('.collapsedContent .btn-primary').on('click', function() {
            $(this).hide();
            $(this).parent().find('.hiddenContent').fadeIn();
        });

        // throwing viewport height to CSS var
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        // We listen to the resize event
        window.addEventListener('resize', () => {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        });
    }

    return {
        init: init,
        settings: this.settings,
        initArrow: initContentArrow
    }
};

$(function(){
    let app = new Application();
    app.init();
});
