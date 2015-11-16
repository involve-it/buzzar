/**
 * Created by Ashot on 9/21/15.
 */
bz.help.makeNamespace('bz.runtime.help');

loggedInUserLazyLoad = function () {
  var userId = Meteor.userId();
  Meteor.subscribe('bz.messages.unseenToMe', userId);

  (function () {
    var initializing = true;
    bz.cols.messages.find({toUserId: userId, seen: false}).observeChanges({
      added: function (id, doc) {
        if (Meteor.userId() === doc.toUserId) {

          if (!initializing) {
            //console.log(doc);
            var userObj = Meteor.users.findOne(doc.userId);
            bz.buz.chats.showMessageModal(doc, userObj, id);

            bz.buz.chats.showbzAlerMessage(doc, userObj, id);
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

layoutRenderedLazyLoad = function () {
  setTimeout(function () {
    toast(
      '//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css',
      '//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js',
      function () {
        //toastr.info('Are you the 6 fingered man?');
      }
    );
    // does user see the site for the first time?
    if (!bz.runtime.help.hasSeenTour) {
      bz.runtime.help.hasSeenTour = true;
      //createToolTipsForHomePage();
    }

    /*'https://raw.githubusercontent.com/ytiurin/html5tooltipsjs/master/html5tooltips.js',
     function(){

     }*/


    //alert('start lazyload');
    //cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js
    /*include('App.Nasa', [['Rover', 'https://s3-us-west-1.amazonaws.com/buzzar/v0.5/public/js/toastr.async.js'], ['css', '//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.css']], function(Rover){
     debugger;
     return {
     rover   : Rover
     }
     });*/
  }, 10);
};

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

        var tour;

        tour = new Shepherd.Tour({
          defaults: {
            classes: 'shepherd-theme-arrows',
            scrollTo: true
          }
        });
        tour.addStep('example-step', {
          title: 'Example Shepherd',
          text: 'This step is attached to the bottom of the <code>.example-css-selector</code> element.',
          attachTo: '.bz-small bottom',
          //classes: 'button bz-small',
          buttons: [
            {
              text: 'Next',
              action: tour.next
            }
          ]
        });

        tour.start();
      }
    );
  }, 2000);
}