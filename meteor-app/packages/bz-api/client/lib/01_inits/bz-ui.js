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
  message = message || 'Сообщение не передано';
  obj = obj || { type: 'info' };

  if( obj.type == 'info' ) {
    return sAlert.info(message, {effect: 'no effects'});
  }

  if( obj.type == 'warning' ) {
    return sAlert.warning(message, {effect: 'no effects'});
  }

  if( obj.type == 'error' ) {
    return sAlert.error(message, {effect: 'no effects', timeout: 5000000});
  }

  if( obj.type == 'success' ) {
    return sAlert.success(message, {effect: 'no effects', timeout: 5000000});
  }
};

bz.ui.error = function(message, obj) {
  bz.ui.alert(message, {type: 'error'});
}