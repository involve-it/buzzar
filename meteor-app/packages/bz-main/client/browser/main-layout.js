/**
 * Created by douson on 06.07.15.
 */
bz.help.maps.initLocation();
Template.mainLayout.rendered = function () {
   
  $(document).foundation({
    offcanvas : {
      //move overlap_single or overlap, reveal
      open_method: 'reveal',
      close_on_click : true
    }
  });
  
};
Template.mainLayoutHome.rendered = function () {

  $(document).foundation({
    offcanvas : {
      //move overlap_single or overlap, reveal
      open_method: 'reveal',
      close_on_click : true
    }
  });

};







