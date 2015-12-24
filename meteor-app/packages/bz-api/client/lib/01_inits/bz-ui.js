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

