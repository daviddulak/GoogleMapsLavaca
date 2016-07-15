import { View } from 'lavaca';
import template from 'templates/MapView';

/**
* @class app.ui.views.MapView
* @super lavaca.mvc.View
* MapView view type
*/
export let MapView = View.extend(function MapView(){
  View.apply(this, arguments);
},{
  /**
  * @field {String} className
  * @default 'map'
  * A class name added to the view container
  */
  className: 'map',
  generateHtml(model) {
    return new Promise((resolve) => {
      template(model, (err, html) => {
        resolve(html);
      });
    });
  },
  onRenderSuccess(e) {
    View.prototype.onRenderSuccess.apply(this, arguments);
    window.GoogleMapsView.loadMap(this.el.find('.map-canvas')).then(
        function success() {
          console.log('map injected');
          window.GoogleMapsModel.setMarkers([{latitude:30.274287,longitude:-97.740498}]);
        }.bind(this),
        function error() {
          console.log('map inject fail');
          this.model.offline = true;
          this.render(); 
        }.bind(this));
  }

});