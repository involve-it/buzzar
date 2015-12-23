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