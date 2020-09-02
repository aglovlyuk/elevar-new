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
    }

    return {
        init: init,
        settings: this.settings,
        initArrow: initContentArrow
    }
};

$(function(){
    app = new Application();
    app.init();
});
