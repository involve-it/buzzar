/**
 * Created by arutu_000 on 1/23/2016.
 */

var origGo = Router.go
var checkFormIsSaved = function(e){
  var ret = true;
  if(bz.runtime.changesNotSaved === true){
    //bz.ui.modal('Are you sure you want to navigate away? Your changes are not saved.', function(res){
    ret = confirm('You have unsaved data. Are you sure you want to leave?');
  } else {
    //this.next();
  }
  return ret;
};
AddHooksToCheckFormSaved = function(){
  $('a').on('click', checkFormIsSaved);
  Router.go = function(args) {
    if(checkFormIsSaved()){
      origGo.apply(this, args);
    }
  }
}

EditPostRouteStopHandler = function(){
 $('a').off('click', checkFormIsSaved);
  Router.go = origGo;
}