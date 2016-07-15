import { GoogleMapsView } from 'node_modules/google-maps-lavaca';

let GoogleMapsAppView = GoogleMapsView.extend(function GoogleMapsAppView(){
  GoogleMapsView.apply(this, arguments);
},{
  GoogleMapAPIKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  onTapMarker(marker) {
    console.log('tap marker:'+marker.markerId);
  }

});

window.GoogleMapsView = new GoogleMapsAppView('#map', {});

export default window.GoogleMapsView;