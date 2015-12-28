/**
 * Created by arutu_000 on 12/23/2015.
 */
bz.help.makeNamespace('bz.ui');

bz.ui.initFoundationValidation = function() {
  console.error('This is abstract function');
};

bz.ui.initFoundationValidation = function() {
  $(document).foundation({
    abide: {
      live_validate: true,
      validate_on_blur: true,
      focus_on_invalid: true,
      error_labels: true,
      timeout: 100
    }
  });
};

bz.ui.initDropTips = function() {

  setTimeout(function () {

    toast(
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
     
  
};



bz.ui.alert = function(message, obj) {
  obj = obj || { type: 'info' };

    
  if( message.indexOf(';') !== -1 ) {
    
    message = message.split(';');
    
    if( message.length > 1 && Array.isArray(message) ) {
      checkTextErrorMessage();
    }
  } else if( Array.isArray(message) ) {
      checkTextErrorMessage();
  } else {
      sAlert.config({html:false});
  }
  
  function checkTextErrorMessage() {
    sAlert.config({html:true});
    
    var li = '';
    message.map(function (el) {
      li += '<li>' + el + '</li>';
    });
    message = li;
    
    return message;
  }

  //message = message.join();
 

  if( obj.type == 'info' ) {
    return sAlert.info(message, {effect: 'no effects'});
  }

  if( obj.type == 'warning' ) {
    return sAlert.warning(message, {effect: 'no effects'});
  }

  if( obj.type == 'error' ) {
    return sAlert.error(message, {effect: 'no effects'});
  }

  if( obj.type == 'success' ) {
    return sAlert.success(message, {effect: 'no effects'});
  }
};

bz.ui.error = function(message, obj) {
  bz.ui.alert(message, {type: 'error'});
};

