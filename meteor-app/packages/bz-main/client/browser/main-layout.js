/**
 * Created by douson on 06.07.15.
 */
bz.help.maps.initLocation();


Template.mainLayoutHome.onRendered(function() {
  var API, $menu = $("#bz-menu");

  $menu.mmenu({
    // options
    "navbar": {
      "add": false
    },
    "extensions": [
      "menuShadow"
    ]
  }, {
    // configuration
    offCanvas: {
      pageSelector: "#bz-body-wrapper",
      classNames: {
        selected: "active"
      }
    }
  });

  API = $menu.data( "mmenu" );

  /* open menu */
  $(".bz-open-off-canvas").click(function() {
    API.open();
  });

  var links = $menu.find('.link-menu > a');
  links.on('click', function(e) {
    API.close();
  });
  
  window.menu = $menu
  
});

Template.bzMenuLeftWrapper.events({
  'click .clickb': function(e, t) {
    //e.preventDefault();
    console.info('click');
  },
  'click .clickd': function(e, t) {
    //e.preventDefault();
    console.info('click');
  }
});





Meteor.startup(function() {
  //$('body').attr('data-uk-observe', '1');
});

Template.mainLayoutHome.onCreated(function() {});

Template.mainLayout.rendered = function () {
  InitFoundationOffCanvas();
  layoutRenderedLazyLoad();
  //UIkit.$html.trigger('changed.uk.dom');
};

Template.mainLayoutHome.rendered = function () {
  InitFoundationOffCanvas();
  layoutRenderedLazyLoad();
  //UIkit.$html.trigger('changed.uk.dom');
};

Template.bzChangeLanguage.rendered = function () {
  var langProm;
  /*if(Meteor.user() && Meteor.user().profile) {
   if (!Meteor.user().profile.settings || !Meteor.user().profile.settings.language) {
   lang = SetUserLanguage();
   //T9n.defaultLanguage;
   } else {
   lang = Meteor.user().profile.settings.language;

   if (!lang){
   lang = SetUserLanguage();
   }
   }
   T9n. SetUserLanguage(lang);*/

  GetUiLanguage().then((lang)=> {
    $('.js-language-picker').val(lang || 'en');

    //Ashot: review - select language drop down was not updating on jQuery call.
    //_.defer seems to fix it, although not sure if it's the right approach.
    /*_.defer(function(){
      $('.js-language-picker').val(lang);
    });*/
  });
};


Template.bzChangeLanguage.events({
  //'change .dropdown-choose-lang': function (e, v) {
  'change .js-language-picker': function (e, v) {
    var lang = e.target.value;

    SetUiLanguage(lang);
    setTimeout(()=>{
      $('.js-bz-header').hide().show(0);
    }, 100);

    // Set language - in the headerof the site
    var elms = $('.bz-switcher-language-list').children().find('a');
    elms.each(function() {
      $(this).removeClass('active');
      if($(this).data('lang') === lang) {
        $(this).addClass('active');
      }
    });

    //Set language - left menu
    var langLeftMenu = $('.bz-menu-switcher-language-list').children().find('a');
    langLeftMenu.each(function() {
      $(this).closest('.bz-button').removeClass('bz-active');
      if($(this).data('lang') === lang) {
        $(this).closest('.bz-button').addClass('bz-active');
      }
    });
    
  }
});


Template.bzDropSelectLanguage.rendered = function() {
  
  GetUiLanguage().then((lang)=> {

    var el = $('.bz-switcher-language-list'),
        element = el.children().find('a');
    
    element.each(function() {
      if($(this).data('lang') === lang) {
        $(this).addClass('active');
      }
    });
  });

};


Template.bzDropSelectLanguage.events({
  'click [data-lang]': function(e, v) {
    e.preventDefault();
    
    var lang = e.target.getAttribute('data-lang');
    SetUiLanguage(lang);
    
    var el = $('.bz-switcher-language-list');
            
    var toggles = el.find('>*'),
        target = $(e.target);
    
    if(target.hasClass('active')) {
      return;
    }else {
      toggles.find('a').filter(".active").removeClass("active");
      target.addClass("active");
    }

    // Set language - in the footer of the site
    $('select.js-language-picker').val(Session.get('bz.user.language'));

    //Set language - left menu
    var langLeftMenu = $('.bz-menu-switcher-language-list').children().find('a');
    langLeftMenu.each(function() {
      $(this).closest('.bz-button').removeClass('bz-active');
      if($(this).data('lang') === lang) {
        $(this).closest('.bz-button').addClass('bz-active');
      }
    });
  }
});


Template.bzNavMe.onCreated(function() {
  this.someUserData = new ReactiveVar(false);
});

Template.bzNavMe.helpers({
  
  getUser: function() {
    var userId = Meteor.userId(), ins = Template.instance(), innerObj = {}, usegObj = {};
    if (ins.someUserData.get() === false) {
      Meteor.call('getUser', userId, function(e, r){
        if(e) {
          //error
        } else {
          innerObj = r.result;

          _.each(innerObj, function(value, key, list) {

            if(key === 'image') {
              usegObj['image'] = list.image
            }
            
          });
          usegObj['username'] = innerObj.username;
          ins.someUserData.set(usegObj);
        }
      });
    }
    return ins.someUserData.get();
  }
  /* OLD CODE */
  /*,
  getUserAvatar: function(){
    var ret = '/img/content/avatars/avatar-no.png';
    var user = Meteor.user();
    if(user && user._getAvatarImage()){
      ret = user._getAvatarImage();
    }
    return ret;
  },
  username: function() {
    var user = Meteor.users.findOne({_id: Meteor.userId()} );
    return user && user.username;
  }*/
});


Template.bzLeftMenuSelectLanguage.onRendered(function() {
  var lang = Session.get('bz.user.language');
  if(lang) {
    var el = $('.bz-menu-switcher-language-list').children().find('a');

    el.each(function() {
      if($(this).data('lang') === lang) {
        $(this).closest('.bz-button').addClass('bz-active');
      }
    });
  }
});


Template.bzLeftMenuSelectLanguage.events({
  'click .js-bz-button': function(e, v) {
    e.preventDefault();

    var ele = $(e.target.closest('.bz-button'));

    if(!ele.hasClass('bz-active')) {
      var lang = v.$('.bz-button').not('.bz-active').find('a').data('lang');
      SetUiLanguage(lang);

      //$('[data-lang]').trigger("click", e);
    }

    $('[data-bz-button-radio] > *').attr('aria-checked', 'false').filter('.bz-active').attr('aria-checked', 'true');

    v.$('.bz-button').not(ele).removeClass('bz-active').blur();
    ele.addClass('bz-active');

    v.$('.bz-button').not(ele).attr('aria-checked', 'false');
    ele.attr('aria-checked', 'true');

    v.$('.js-bz-button').trigger("change.bz.button", [ele]);


    // Set language - in the footer of the site
    $('select.js-language-picker').val(Session.get('bz.user.language'));

    // Set language - in the header of the site
    var elms = $('.bz-switcher-language-list').children().find('a');
    elms.each(function() {
      $(this).removeClass('active');
      if($(this).data('lang') === Session.get('bz.user.language')) {
        $(this).addClass('active');
      }
    });
  }
});