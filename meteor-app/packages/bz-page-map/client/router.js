/**
 * Created by douson on 03.07.15.
 */
var requireLoginController = bz.router.requireLoginController;
// POSTS:
Router.map(function () {
  this.route('bz.map', {
    path: '/map',
    template: 'bzPageMap',
    waitOn: function () {
      return [
        bz.help.maps.googleMapsLoad()
        //GoogleMaps.load({libraries: 'geometry,places', v: '3'})
        //GoogleMaps.load({key: bz.config.mapsKey, libraries: 'geometry,places', v: '3'})
        //GoogleMaps.load({key: 'AIzaSyCE5a0IeEGQLptVSSW-5swNFNaRUXKEWss', libraries: 'geometry,places', v: '3'})
      ];
    }
  });
});