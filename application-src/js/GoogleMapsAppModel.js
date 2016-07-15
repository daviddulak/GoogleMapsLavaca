import {GoogleMapsModel} from 'node_modules/google-maps-lavaca';

let GoogleMapsAppModel = GoogleMapsModel.extend(function GoogleMapsAppModel() {
  GoogleMapsModel.apply(this, arguments);
}, {
  /**
  https://snazzymaps.com/style/42/apple-maps-esque
  **/
  customStyle: [{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"color":"#f7f1df"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#d0e3b4"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"geometry","stylers":[{"color":"#fbd3da"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#bde6ab"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffe15f"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efd151"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"black"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"color":"#cfb2db"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#a2daf2"}]}],
  getIcon(markerObj) {
    return new google.maps.MarkerImage(
      'assets/img/marker@2x.png',
      null, //new google.maps.Size(38,52),
      null, //new google.maps.Point(0,0),
      null, //new google.maps.Point(19,52),
      new google.maps.Size(17,17)
    );
  }

});

window.GoogleMapsModel = new GoogleMapsAppModel();

export default window.GoogleMapsModel;