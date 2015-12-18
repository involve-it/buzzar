/**
 * Created by douson on 12/17/15.
 */

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

bz.ui.initDrop = function() {};