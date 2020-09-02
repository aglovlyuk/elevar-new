var map,
    geocoder,
    markers,
    bounds,
    latLng,
    isDesktop,
    scrollable,
    $officeName;

function removeMarkers() {
    for (i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function highlightLocation(index, removeHighlight) {
    var location = $('.offices-container').find('.office-name[data-markerid="' + index + '"]');

    if (removeHighlight === true) {
        location.parent().removeClass('active');
    } else {
        location.parent().addClass('active');
    }
}

function toggleBounce(marker) {
    // stop all markers
    $.each(markers, function (index, value) {
        value.setAnimation(null);
    });

    // bounce wit' me. yeah!
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

function resize() {
    isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    if (map) {
        google.maps.event.trigger(map, 'resize');

        //removeMarkers();
        //codeAddress();

        map.fitBounds(bounds);
    }
}

function codeAddress() {
    var $addresses = $('#map-locations').find('address');

    $.each($addresses, function (index, value) {
        var address1 = $(value).find('.address-1').html(),
            address2 = $(value).find('.address-2').html(),
            cityState = $(value).find('.city-state').html(),
            zip = $(value).find('.zip').html(),
            fullAddress = address1 + ' ' + cityState + ' ' + zip,
            officeName = 'Elevar ' + $(value).data('office');

        geocoder.geocode({ 'address': fullAddress }, function (results, status) {
            if (status === 'OK') {
                map.setCenter(results[0].geometry.location);

                latLng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());

                var infoWindow = new google.maps.InfoWindow({
                    content: '<div class="info-window"><span>' + officeName + '</span>' + $(value).html() + '<br /><br /><a href="http://maps.google.com/maps?daddr=' + fullAddress + '" target="_blank">Get Directions</a></div>'
                });

                var currentMark;
                var marker = new google.maps.Marker({
                    index: index,
                    animation: google.maps.Animation.DROP,
                    draggable: false,
                    map: map,
                    position: results[0].geometry.location,
                    title: officeName,
                    icon: {
                        url: "/img/icon.png",
                        scaledSize: isDesktop
                            ? new google.maps.Size(32, 32)
                            : new google.maps.Size(22, 22)
                    }
                });

                markers.push(marker);

                google.maps.event.addListener(marker, 'click', function () {
                    //toggleBounce(marker);
                    currentMark = this;

                    infoWindow.open(map, this);

                    highlightLocation(this.index, false);
                });

                google.maps.event.addListener(infoWindow, 'closeclick', function (index) {
                    highlightLocation(currentMark.index, true);
                });

                google.maps.event.addDomListener(window, 'resize', resize);

                bounds.extend(latLng);
                map.fitBounds(bounds);
            } else {
                //console.log(status);
            }
        });
    });
}

function initMap() {
    markers = [];
    $officeName = $('.office-name');
    isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    scrollable = draggable = isDesktop;

    var mapOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 11,
        panControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false,
        zoomControl: true,
        scrollwheel: scrollable,
        draggable: draggable,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL,
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        center: new google.maps.LatLng(39.1031, 84.5120),
        styles: [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#666666" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "visibility": "off" }, { "color": "#f2f2f2" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }, { "visibility": "on" }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "on" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#d6ccbc" }, { "visibility": "on" }] }]
    };

    map = new google.maps.Map($('#map').get(0), mapOptions);
    geocoder = new google.maps.Geocoder();
    bounds = new google.maps.LatLngBounds();

    codeAddress();

    $officeName.on('click', function () {
        $officeName.parent().removeClass('active');

        google.maps.event.trigger(markers[$(this).data('markerid')], 'click');
    });
}

if($('#map').length) {
    initMap();
}
