/**
 * Created by douson on 06.07.15.
 */
bz.help.maps.initLocation();

Template.mainLayout.created = function () {}

Template.mainLayout.rendered = function () {
  $(document).foundation({
    offcanvas : {
      //move, overlap_single or overlap, reveal
      open_method: 'move',
      close_on_click : true
    }
  });
  layoutRenderedLazyLoad();
};

Template.mainLayoutHome.rendered = function () {
  $(document).foundation({
    offcanvas : {
      //move, overlap_single or overlap, reveal
      open_method: 'move',
      close_on_click : true
    }
  });
  layoutRenderedLazyLoad();
};

Template.bzFooter.rendered = function() {};

Template.bzFooter.events({
  'change .js-language-picker': function(e, v){
    T9n.setLanguage(e.target.value);
  }
});



