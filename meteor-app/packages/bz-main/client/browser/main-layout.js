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

Template.bzFooter.rendered = function() {
  var lang = window.navigator.userLanguage || window.navigator.language;
  //temporarily getting just first two letters of language (i.e. for en-US we'll take 'en' only).
  if (lang){
    if (lang.length > 2) {
      lang = lang.substr(0, 2);
    }
  } else {
    // English is default
    lang = "en";
  }

  T9n.setLanguage(lang);
  $('#bz-choose-lang').val(lang);
};

Template.bzFooter.events({
  'change .js-language-picker': function(e, v){
    T9n.setLanguage(e.target.value);
  }
});



