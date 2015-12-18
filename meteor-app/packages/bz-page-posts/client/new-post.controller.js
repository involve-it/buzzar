/**
 * Created by arutu_000 on 12/13/2015.
 */

newPostType = new ReactiveVar();

// handle post type:
setNewPostType = function (type) {
  newPostType.set(type);
};



renderNewPostFormByType = function (type, $el) {
  var type = type.get();
  if (type) {
    var tempName = 'bzPostsNewForm' + type.toCapitalCase();
    Blaze.renderWithData(Template[tempName], {}, $el)
  } else {
    var tempName = 'bzPostsNewFormGeneric';
    Blaze.renderWithData(Template[tempName], {}, $el)
  }

  bz.ui.initFoundationValidation();
  bz.ui.initDrop();
  
};

// render form according to type on type changed:
trackNewPostTypeChange = function (selector) {
  Tracker.autorun(function () {
    var elem = document.getElementsByClassName(selector).first();
    if (elem) {
      while (elem.hasChildNodes()) {
        elem.removeChild(elem.lastChild);
      }
      renderNewPostFormByType(newPostType, elem);
    }
  })
};