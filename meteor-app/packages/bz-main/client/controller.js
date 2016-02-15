/**
 * Created by Ashot on 9/21/15.
 */
bz.help.makeNamespace('bz.runtime.help');

loggedInUserLazyLoad = function () {
  var userId = Meteor.userId();
  Meteor.subscribe('bz.messages.unseenToMe', userId);

  (function () {
    var initializing = true;
    bz.cols.messages && bz.cols.messages.find({toUserId: userId, seen: false}).observeChanges({
      added: function (id, doc) {
        if (Meteor.userId() === doc.toUserId) {

          if (!initializing) {
            //console.log(doc);
            var userObj = Meteor.users.findOne(doc.userId);
            bz.bus.chats.showMessageModal(doc, userObj, id);

            bz.bus.chats.showbzAlerMessage(doc, userObj, id);
          }
        }
      }
    });
    initializing = false;
  })();
};

Meteor.startup(function () {
  var userId = Meteor.userId();
  if (userId) {
    setTimeout(function () {
      loggedInUserLazyLoad(userId);
    }, 10);
  }
});


bz.ui.initSwiper = function() {
  var swiper;
  setTimeout(function() {
    toast(
        '/libs/idangerous-swiper.css',
        ['/libs/idangerous-swiper.js', function () {
          return window.Swiper;
        }]/*,
        function() {
                    
          swiper = new Swiper('.swiper-container',{
            slidesPerView: 4,
            calculateHeight: true,
            resizeReInit: true,
            onSwiperCreated : function(swiper) {
              //Do something when you touch the slide
              console.log('OMG you touch the slide!');
            }
          });
          return swiper;
        }*/
    );
  }, 10);

  return swiper;
  
};


layoutRenderedLazyLoad = function () {
  setTimeout(function () {
    toast(
      '//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css',
      '//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.js',
      function () {
        //toastr.info('Are you the 6 fingered man?');
      }
    );
    // does user see the site for the first time?
    if (!bz.runtime.help.hasSeenTour) {
      bz.runtime.help.hasSeenTour = true;
      //createToolTipsForHomePage();

      //window.cr = createDropTips;
      //createDropTips();
    }

    /*'https://raw.githubusercontent.com/ytiurin/html5tooltipsjs/master/html5tooltips.js',
     function(){

     }*/


    //alert('start lazyload');
    //cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js
    /*include('App.Nasa', [['Rover', 'https://s3-us-west-1.amazonaws.com/buzzar/v0.5/public/js/toastr.async.js'], ['css', '//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.css']], function(Rover){
     return {
     rover   : Rover
     }
     });*/
  }, 10);

  setTimeout(function (){
    startLoadingMatsLocations();
  }, 10)
};

/* move bz.ui */
/*createDropTips = function () {

  setTimeout(function () {

    toast(
      //['/client/style/drop-theme-arrows-bounce.css'],
      //['http://github.hubspot.com/drop/docs/welcome/examples/social-sharing/css/drop-example-theme-social-sharing.css'],
      ['https://s3-us-west-1.amazonaws.com/buzzar/v0.5/public/vendor/shepherd/tether.js', function () {
        return window.Tether;
      }],
      ['http://github.hubspot.com/drop/dist/js/drop.js', function () {
        return window.Drop;
      }],
      function () {

        var _Drop, DropTooltip;

        _Drop = Drop.createContext({
          classPrefix: 'drop'
        });

        DropTooltip = function () {
          return $('.bz-tool-tip').each(function () {
            var $example, $target, content, drop, openOn, theme, isMobile, pos, bzClose;

            isMobile = $(window).width() < 890;
            pos = 'left middle';
            if (isMobile) pos = 'top center';

            $example = $(this);
            theme = $example.data('theme');
            openOn = $example.data('open-on') || 'click';
            if ($example.data('top-center')) pos = $example.data('top-center');
            $target = $example.find('.drop-target');
            $target.addClass(theme);
            content = $example.find('.drop-content').html();
            //bzClose = $('.bz-drop-close');
            bzClose = $example.find('.bz-drop-close');


            drop = new _Drop({
              target: $target[0],
              classes: theme,
              position: pos,
              constrainToWindow: true,
              constrainToScrollParent: false,
              openOn: openOn,
              content: content,
              remove: false
            });

            $(drop.drop).find('.bz-drop-close').click(function () {
              var d2 = drop;
              d2.close();
            });

            return drop;

          });

        };

        return DropTooltip();

      }
    );
  }, 100);


};*/

createToolTipsForHomePage = function () {
  setTimeout(function () {
    toast('//s3-us-west-1.amazonaws.com/buzzar/v0.5/public/vendor/shepherd/shepherd-theme-arrows.css');
    // shepherd.js:
    toast(
      /*'https://s3-us-west-1.amazonaws.com/buzzar/v0.5/public/vendor/shepherd/shepherd-theme-arrows.css',
       function(){
       console.log('screens.css downloaded');
       },*/
      ['https://s3-us-west-1.amazonaws.com/buzzar/v0.5/public/vendor/shepherd/tether.js', function () {
        return window.Tether;
      }],
      ['https://s3-us-west-1.amazonaws.com/buzzar/v0.5/public/vendor/shepherd/shepherd.js', function () {
        return window.Shepherd;
      }],
      function () {

        var shepherd;

        shepherd = new Shepherd.Tour({
          defaults: {
            classes: 'shepherd-element shepherd-open shepherd-theme-arrows',
            showCancelLink: true
          }
        });
        shepherd.addStep('welcome', {
          text: ['Введите имя поста, который вы желаете найти'],
          title: 'Ваш поисковый запрос',
          attachTo: '.search bottom',
          classes: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text',
          buttons: [
            {
              text: 'Exit',
              classes: 'shepherd-button-secondary',
              action: shepherd.cancel
            }, {
              text: 'Next',
              action: shepherd.next,
              classes: 'shepherd-button-example-primary'
            }
          ]
        });
        shepherd.addStep('about', {
          title: 'Информация о ...',
          text: 'Все, что можно узнать о нас тут )))',
          attachTo: '.bz-about-us bottom',
          buttons: [
            {
              text: 'Back',
              classes: 'shepherd-button-secondary',
              action: shepherd.back
            }, {
              text: 'Done',
              action: shepherd.next
            }
          ]
        });

        shepherd.start();
      }
    );
  }, 2000);
};

function startLoadingMatsLocations (){
  bz.help.maps.initLocation();
  bz.help.maps.initPlacesCollection();
  // doc.ready happened, so:
  bz.help.maps.googleMapsLoad();
}






















