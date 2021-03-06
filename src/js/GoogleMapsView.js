import { Connectivity, View } from 'lavaca';
import template from 'templates/GoogleMapsView';

export let GoogleMapsView = View.extend(function GoogleMapsView(){
  View.apply(this, arguments);
  this.init();
},{
  autoRender: true,
  className: 'googlemapsview',
  GoogleMapAPIKey: "",
  generateHtml(model) {
    return new Promise((resolve) => {
      template(model, (err, html) => {
        resolve(html);
      });
    });
  },
  init() {
    this.render();
  },
  injectMap($view) {
    var promise = new $.Deferred();
    window.GoogleMap.appendTo($view);
    setTimeout(function(){
      if (this.map) {
        window.GoogleMapsModel.clearMarkers();
        this.resizeMap();
        setTimeout(function() {
          $view.addClass('loaded');
        }, 50);
      } else {
        promise.reject();
      }
      promise.resolve();
    }.bind(this), 50);
    return promise;
  },
  loadMap($view) {
    var promise = new $.Deferred();
    if (window.GoogleMap) {
      return this.injectMap($view);
    } else {
      this.loadApi().then(
        function success() {
          if (window.GoogleMap) {
            return this.injectMap($view);
          } else {
            promise.reject();
          }
        }.bind(this),
        function error() {
          promise.reject();
        }.bind(this));
    }
    return promise;
  },
  loadApi() {
    var promise = new $.Deferred();
    if (!this.GoogleMap) {
      if (!Connectivity.isOffline()) {

        window.GoogleMapLoadCallback = function() {
          this.createMap();
          if (window.GoogleMap) {
            console.log("Google Maps loaded");
            promise.resolve();
          } else {
            promise.reject();
          }
        }.bind(this);

        $.getScript("https://maps.googleapis.com/maps/api/js?key="+this.GoogleMapAPIKey+"&libraries=places&sensor=true&callback=GoogleMapLoadCallback");
      } else {
        promise.reject();
      }
    } else {
      promise.reject();
    }
    return promise;
  },
  createMap() {
    if (this.map) {
      return;
    }

    this.map = new window.google.maps.Map( 
      this.el.find('.map-canvas')[0],
      {
        //disableDefaultUI: true,
        minZoom: 2,
        styles: window.GoogleMapsModel.customStyle,
        zoom: window.GoogleMapsModel.zoom,
        center: {lat: window.GoogleMapsModel.centerLat, lng: window.GoogleMapsModel.centerLng},
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false
      }
    );

    window.google.maps.event.addListener(this.map, 'click', this.onClickMap.bind(this));
    window.google.maps.event.addListener(this.map, 'dblclick', this.onDblClickMap.bind(this));
    window.google.maps.event.addListener(this.map, 'dragstart', this.onDragStartMap.bind(this));
    window.google.maps.event.addListener(this.map, 'mousemove', this.onMouseMoveMap.bind(this));
    window.google.maps.event.addListener(this.map, 'mousedown', this.onMouseDownMap.bind(this));
    window.google.maps.event.addListener(this.map, 'mouseover', this.onMouseOverMap.bind(this));
    window.google.maps.event.addListener(this.map, 'mouseout', this.onMouseOutMap.bind(this));
    window.google.maps.event.addListener(this.map, 'mouseup', this.onMouseUpMap.bind(this));
    window.google.maps.event.addListener(this.map, 'zoom_changed', this.onZoomChangeMap.bind(this));
    window.google.maps.event.addListener(this.map, 'center_changed', this.onCenterChangeMap.bind(this));
    window.google.maps.event.addListener(this.map, 'tilesloaded', this.onTilesLoadedMap.bind(this));

    $(window).on('resize', debounce(function() {
      this.resizeMap();
    }.bind(this), 600));

    // this.markerCluster = new MarkerClusterer(this.map);

    if (!window.GoogleMap) {
      this.el.removeAttr('data-view-id');
      window.GoogleMap = this.el.detach();
    }

  },

  centerOnSearchLocation(query) {
    var promise = new $.Deferred();

    if (!query || query === '(Current Location)' || query === 'Current Location' || query === '') {
      promise.resolve();
      return promise;
    }

    if (this.map && query && query.length) {
      var service = new window.google.maps.places.PlacesService(this.map);

      service.textSearch({
        'query': query
      }, function(results, status) {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results[0]) {
          var latLng = results[0].geometry.location;
          this.setCenter(latLng);
          this.setZoom(15);
          promise.resolve();
        } else {
          console.log('Places Search failed due to: ' + status);
          promise.reject();
        }
      }.bind(this));
    } else {
      promise.reject();
    }

    return promise;
  },

  centerOnCurrentLocation() {
    return this.getCurrentLocation().then(
      function success(coords) {
        this.panTo({lat:coords.latitude,lng:coords.longitude});
      }.bind(this),
      function error() {
        console.warn('Failed to get location');
      }.bind(this));
  },

  centerOnLocation(lat, lng) {
    this.panTo({lat:lat,lng:lng});
  },

  getCurrentLocation() {
    var promise  = new $.Deferred();
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          if (position && position.coords) {
            promise.resolve(position.coords);
          } else {
            promise.reject();
          }
        }.bind(this), 
        function(error) {
          promise.reject();
        }.bind(this),
        { maximumAge: 3000, timeout: 6000, enableHighAccuracy: true });
    } else {
      promise.reject();
    }
    return promise;
  },

  resizeMap() {
    if (this.map) {
      window.google.maps.event.trigger(this.map, 'resize');
      this.setCenter(new window.google.maps.LatLng(window.GoogleMapsModel.centerLat, window.GoogleMapsModel.centerLng));
      this.setZoom(window.GoogleMapsModel.zoom);
    }
  },

  panTo(point) {
    if (this.map) {
      this.map.panTo(point);
    }
  },

  setZoom(zoom) {
    if (this.map) {
      this.map.setZoom(zoom);
    }
  },

  getZoom() {
    return this.map ? this.map.getZoom() : 12;
  },

  setCenter(point) {
    if (this.map) {
      this.map.setCenter(point);
    }
  },

  getCenter() {
    return this.map ? this.map.getCenter() : {
      lat: function(){return window.GoogleMapsModel.centerLat;},
      lng: function(){return window.GoogleMapsModel.centerLng;}};
  },

  onTapMarker(marker) {

  },
  onDblClickMap() {

  },
  onClickMap() {

  },
  onDragStartMap() {

  },
  onMouseMoveMap() {

  },
  onMouseDownMap() {

  },
  onMouseOverMap() {

  },
  onMouseOutMap() {

  },
  onMouseUpMap() {

  },
  onZoomChangeMap() {
    window.GoogleMapsModel.zoom = this.getZoom();
  },
  onCenterChangeMap() {
    var center = this.getCenter();
    window.GoogleMapsModel.centerLat = center.lat();
    window.GoogleMapsModel.centerLng = center.lng();
  },
  onTilesLoadedMap() {
    console.log('tiles loaded');
  }

});