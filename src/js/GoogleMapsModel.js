import {EventDispatcher} from 'lavaca';

export let GoogleMapsModel = EventDispatcher.extend(function GoogleMapsModel() {
  EventDispatcher.apply(this, arguments);
}, {
  customStyle: [], 
  markers: [],
  centerLat: 30.274287,
  centerLng: -97.740498,
  zoom: 12,

  getIcon(markerObj) {
    return null;
  },

  findMarkerArrayPosition(markerIdentity) {
    for (var i = 0; i < this.markers.length; i++) {
      if (typeof markerIdentity === 'object' && 
          markerIdentity.markerId && 
          markerIdentity.markerId == this.markers[i].markerId) {
        return i;
      } else if (typeof markerIdentity === 'object' && 
                  markerIdentity.latitude == this.markers[i].position.lat() && 
                  markerIdentity.longitude == this.markers[i].position.lng()) {
        return i;
      } else if (markerIdentity == this.markers[i].markerId) {
        return i;
      }
    }
  },
  updateMarker(markerIdentity, markerObj) {
    var i = this.findMarkerArrayPosition(markerIdentity);
    for(var prop in markerObj) {
      this.markers[i][prop] = markerObj[prop];
    }
    var myLatLng = new window.google.maps.LatLng(this.markers[i].latitude, this.markers[i].longitude);
    this.markers[i].setPosition(myLatLng);
    if (this.getIcon(this.markers[i])) {
      this.markers[i].setIcon(this.getIcon(this.markers[i]));
    }
  },
  removeMarker(markerIdentity) {
    var i = this.findMarkerArrayPosition(markerIdentity);
    if (i) {
      this.markers[i].setMap(null);
      this.markers.splice(i, 1);
    }
  },
  addMarker(markerObj) {
    var myLatLng = new window.google.maps.LatLng(markerObj.latitude, markerObj.longitude);
    markerObj.map = window.GoogleMapsView.map;
    markerObj.position = myLatLng;
    markerObj.draggable = false;
    markerObj.animation = false;
    markerObj.markerId = markerObj.markerId || this.markers.length;
    var marker = new window.google.maps.Marker(markerObj);

    if (this.getIcon(markerObj)) {
      marker.setIcon(this.getIcon(markerObj));
    }

    window.google.maps.event.addListener(marker, 'click', function() {
      window.GoogleMapsView.onTapMarker(marker);
    }.bind(this));

    this.markers.push(marker);
    return myLatLng;
  },
  setMarkers(markers, ignoreBounds) {
    this.clearMarkers();
    if (window.GoogleMapsView.map && markers.length) {
      var bounds = new window.google.maps.LatLngBounds();
      var myLatLng;
      
      for (var i = 0; i < markers.length; i++) {
        myLatLng = this.addMarker(markers[i]);
        bounds.extend(myLatLng);
      }

      if (markers.length === 1) {
        window.GoogleMapsView.setZoom(15);
        window.GoogleMapsView.setCenter(myLatLng);
      }

      if (markers.length>1 && !ignoreBounds) {
        window.GoogleMapsView.map.fitBounds(bounds);
      }

      if (window.GoogleMapsView.map.getZoom() === 0) {
        window.GoogleMapsView.setZoom(this.zoom);
      }

      //this.markerCluster.addMarkers(this.markers);
    }
  },
  clearMarkers() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    //this.markerCluster.clearMarkers();
    this.markers = [];
  }

});