var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var USER_MENU_KEY = 'userMenuOpen';
Session.setDefault(USER_MENU_KEY, false);

var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

var CONNECTION_ISSUE_TIMEOUT = 5000;


Template.sideMenu.onRendered(function() {

  var bodyEl = document.body,
      content = document.querySelector( '#content-wrapper' ),
      openbtn = document.getElementById( 'open-button' ),
      closebtn = document.getElementById( 'close-button' ),
      isOpen = false,

      morphEl = document.getElementById( 'morph-shape' ),
      s = Snap( morphEl.querySelector( 'svg' ) );
  var path = s.select( 'path' );
  var initialPath = path.attr('d'),
      pathOpen = morphEl.getAttribute( 'data-morph-open' ),
      isAnimating = false;

  function init() {
    initEvents();
  }

  function initEvents() {
    openbtn.addEventListener( 'click', toggleMenu );
    if( closebtn ) {
      closebtn.addEventListener( 'click', toggleMenu );
    }

    //close the menu elements 'a'
  $('.menu').click(function () {
     $('a').each(function() {
        toggleMenu();
     });
  });

    // close the menu element if the target it´s not the menu element or one of its descendants..
    content.addEventListener( 'click', function(ev) {
        var target = ev.target;
        if( isOpen && target !== openbtn ) {
           toggleMenu();
        }
    });
  }

  function toggleMenu() {
    if( isAnimating ) return false;
    isAnimating = true;
    if( isOpen ) {
      classie.remove( bodyEl, 'show-menu' );
      // animate path
      setTimeout( function() {
        // reset path
        path.attr( 'd', initialPath );
        isAnimating = false;
      }, 300 );
    }
    else {
      classie.add( bodyEl, 'show-menu' );
      // animate path
      path.animate( { 'path' : pathOpen }, 400, mina.easeinout, function() { isAnimating = false; } );
    }
    isOpen = !isOpen;
  }

  init();
});

Template.sideMenu.helpers({

});

Template.sideMenu.events({

});
