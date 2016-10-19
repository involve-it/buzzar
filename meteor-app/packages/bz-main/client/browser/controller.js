/**
 * Created by douson on 12/17/15.
 */

InitFoundationOffCanvas = function() {
  $(document).foundation({
    offcanvas : {
      //move, overlap_single or overlap, reveal
      open_method: 'move',
      close_on_click : true
    }
  });
};

InitMmenuOffCanvas = function() {
  var $menu = $("#bz-menu");
  //var API = $menu.data( "mmenu" );

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
};
  
IfIframeHideElements = function () {
  var iFrameStatus;
  try {
    iFrameStatus=bz.help.getParamURL();
    console.log('iframe:IfIframeHideElements', iFrameStatus&&iFrameStatus.isiframe);

    if(iFrameStatus&&iFrameStatus.isiframe){
      $("#bz-header").css("display","none");
      $("#bz-footer").css("display","none");
      SetIframeEventListeners();
    }

  }catch(err){
    console.info('ошибка в обработке url: '+err.message);
  }
};

SetIframeEventListeners = () => {
  // Called sometime after postMessage is called
  function receiveMessage(event)
  {
    console.log('iframe:receiveMessage', event.data.pagePath)
    if (event.data.pagePath) {
      Router.go(event.data.pagePath);
    }
    //event.source.postMessage('hi there yourself!  the secret response is: rheeeeet!', event.origin);
  }
  window.removeEventListener('message', receiveMessage);
  window.addEventListener('message', receiveMessage, false);
}
PostMessage = () => {
  console.log('iframe:postMessage', $('body').height(), window.innerHeight, window.outerHeight) ;
  window.parent.postMessage('ttt: ' + window.outerHeight, '*');//$('body').height()
}
$(document).ready(function() {
  console.log('iframe:doc ready', $('body').height(), window.innerHeight, window.outerHeight) ;
});
Tracker.autorun(function(e){
  Router.onAfterAction(function() {
    console.log('iframe:router:onAfterAction', $('body').height(), window.innerHeight, window.outerHeight) ;
  })
  if (Router.current() ) {
    PostMessage();
    //window.c = Router.current();
    //c.onStop(function() { console.log('asdf1') });
    //Router.onAfterAction(function() { console.log('asdf') })
  }
});