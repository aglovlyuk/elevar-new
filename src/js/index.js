import './header';
const $ = require('jquery');
const jQueryBridget = require('jquery-bridget');
const Isotope = require('isotope-layout');
import isotope from 'isotope-layout'
jQueryBridget( 'isotope', Isotope, $ );

const $grid = $('.js-grid-insights').isotope({
    itemSelector: '.grid-item',
    percentPosition: true,
    layoutMode: 'masonry',
    masonry: {
        // use outer width of grid-sizer for columnWidth
        columnWidth: '.grid-sizer'
    }
});

// bind filter button click
$('#filters').on( 'click', 'button', function() {
    var filterValue = $( this ).attr('data-filter');
    $grid.isotope({ filter: filterValue });
});

// change is-checked class on buttons
$('.button-group').each( function( i, buttonGroup ) {
    var $buttonGroup = $( buttonGroup );
    $buttonGroup.on( 'click', 'button', function() {
        $buttonGroup.find('.is-checked').removeClass('is-checked');
        $( this ).addClass('is-checked');
    });
});
