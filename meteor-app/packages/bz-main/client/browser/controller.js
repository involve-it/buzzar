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

InitFoundationOffCanvas = function() {

  $(document).foundation({
    offcanvas : {
      //move, overlap_single or overlap, reveal
      open_method: 'move',
      close_on_click : true
    }
  });
  
};