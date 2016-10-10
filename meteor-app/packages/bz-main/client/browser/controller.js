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
    if(iFrameStatus&&iFrameStatus.isiframe){
      $("#bz-header").css("display","none");
      $("#bz-footer").css("display","none");
    }
  }catch(err){
    console.info('ошибка в обработке url: '+err.message);
  }
};  