/**
 * Created by arutu_000 on 12/23/2015.
 */
import toast from 'pyrsmk-toast';

bz.help.makeNamespace('bz.ui');

var masDrop =[];
/* BZ DROP TIPS */
bz.ui.initDropTips = function () {

  setTimeout(function () {

    toast(
      'https://s3-us-west-1.amazonaws.com/buzzar/v0.5/public/vendor/shepherd/tether.js',
      function(){},
        'https://s3-us-west-1.amazonaws.com/buzzar/v1.0/public/vendor/drop.js',
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
              remove: true
            });

            $(drop.drop).find('.bz-drop-close').click(function () {
              var d2 = drop;
              d2.close();
            });
            masDrop.push(drop);
            return drop;

          });

        };
        if (masDrop.length>0){
          _.each(masDrop, function(dropItem){dropItem.destroy();});
          masDrop=[];
        }
        return DropTooltip();

      }
    );
  }, 100);


};

/* BZ ALERT */
/*(function initAlerts() {
  toast(
      'https://cdnjs.cloudflare.com/ajax/libs/jquery-noty/2.3.8/jquery.noty.min.js',
      function () {
        debugger;
      });
})();*/
bz.ui.alert = function (message, obj) {
  obj = obj || {type: 'info'};


  if (message.indexOf(';') !== -1) {

    message = message.split(';');

    if (message.length > 1 && Array.isArray(message)) {
      checkTextErrorMessage();
    }
  } else if (Array.isArray(message)) {
    checkTextErrorMessage();
  } else {
    sAlert.config({html: true});
  }

  function checkTextErrorMessage() {
    sAlert.config({html: true});

    var li = '';
    message.map(function (el) {
      li += '<li>' + el + '</li>';
    });
    message = li;

    return message;
  }

  //message = message.join();


  if (obj.type == 'info') {
    return sAlert.info(message, {effect: 'no effects'});
  }

  if (obj.type == 'warning') {
    return sAlert.warning(message, {effect: 'no effects'});
  }

  if (obj.type == 'error') {
    return sAlert.error(message, {effect: 'no effects'});
  }

  if (obj.type == 'success') {
    return sAlert.success(message, {effect: 'no effects'});
  }
};

bz.ui.error = function (message, obj) {
  bz.ui.alert(message, {type: 'error'});
};

/* BZ MODAL CONFIRM WINDOW */
bz.ui.modal = function (content, onconfirm) {

  "use strict";

  var body, modal, modalConfirmTemplate, modalConfirm, id;

  if (!body) body = $('body');
  id = 'modal-' + Math.round(Math.random() * 100);
  onconfirm = $.isFunction(onconfirm) ? onconfirm : function () {
  };
  content = content || '';

  modalConfirmTemplate = '<div id="' + id + '" class="reveal-modal confirmPostModal" data-reveal aria-labelledby="modalDeleteTitle" aria-hidden="true" role="dialog"></div>';

  modalConfirm = [
    '<div class="confirmPostModal-wrapper bz-flex bz-flex-center bz-flex-column"><div class="confirmPostModal-header bz-flex bz-flex-middle"><div class="bz-warning-icon bz-flex-grow-0"><i class="fa fa-exclamation-triangle"></i></div>',
    '<div class="bz-modal-header bz-flex-grow-1"><h1 id="modalDeleteTitle" class="title">Delete this post?</h1><p class="sub-title">This action cannot be undone.</p></div></div>',
    '<div class="confirmPostModal-content"><p>' + String(content) + '</p></div>',
    '<div class="confirmPostModal-buttons bz-flex bz-flex-center bz-flex-middle"><a class="button secondary js-close-modal">Cancel</a><a class="button alert js-modal-ok">Delete</a></div></div>'
  ].join('');

  modal = $(modalConfirmTemplate).appendTo('body');
  $(modalConfirm).appendTo('.confirmPostModal');
  $(modal).foundation('reveal', 'open');

  modal.find(".js-modal-ok, .js-close-modal").on("click", function () {
    if ($(this).is('.js-modal-ok')) onconfirm();
    modal.foundation('reveal', 'close');
    modal.remove();
  });

  /*return modal;*/

};


bz.ui.modal.confirm = function (content, onconfirm) {

  "use strict";

  var body, modal, modalConfirmTemplate, modalConfirm, id, args = {};

  if (!body) body = $('body');
  id = 'modal-' + Math.round(Math.random() * 100);
  onconfirm = $.isFunction(onconfirm) ? onconfirm : function () {
  };

  (typeof content === 'object') ? args = content : content = '';

  modalConfirmTemplate = '<div id="' + id + '" class="reveal-modal confirmPostModal" data-reveal aria-labelledby="modalConfirmTitle" aria-hidden="true" role="dialog"></div>';

  modalConfirm = [
    '<div class="confirmPostModal-wrapper bz-flex bz-flex-center bz-flex-column"><div class="confirmPostModal-header bz-flex bz-flex-middle"><div class="bz-warning-icon confirm bz-flex-grow-0"><i class="fa fa-exclamation-triangle"></i></div>',
    '<div class="bz-modal-header bz-flex-grow-1"><h1 id="modalConfirmTitle" class="title">'+ T9n.get('RELOAD_POST_TIME') + '</h1><p class="sub-title">'+ T9n.get('RELOAD_POST_TIME_SUBTITLE') +'</p></div></div>',
    '<div class="confirmPostModal-content without"><p>' + String(T9n.get('RELOAD_POST_CONTENT', true, args)) + '</p></div>',
    '<div class="confirmPostModal-buttons confirm bz-flex bz-flex-right bz-flex-middle"><a class="button bz-small secondary js-close-modal">Cancel</a><a class="button bz-small alert js-modal-ok">OK</a></div></div>'
  ].join('');

  modal = $(modalConfirmTemplate).appendTo('body');
  $(modalConfirm).appendTo('.confirmPostModal');
  $(modal).foundation('reveal', 'open');

  modal.find(".js-modal-ok, .js-close-modal").on("click", function () {
    if ($(this).is('.js-modal-ok')) onconfirm();
    modal.foundation('reveal', 'close');
    modal.remove();
  });

  /*return modal;*/

};


//  foundation:

bz.ui.initFoundationValidation = function () {
  $(document).foundation({ // see http://foundation.zurb.com/sites/docs/v/5.5.3/components/abide.html
    abide: {
      live_validate: true,
      validate_on_blur: true,
      focus_on_invalid: true,
      error_labels: true,
      timeout: 100
    }
  });
};
bz.ui.validateFoundationForm = function (selector) {
  return new Promise((resolve, reject) => {
    var ret = true, msg = [], selector = selector || 'form[data-abide]'; // default selector.
    // 1. add abide event listeners:
    $(selector).on('valid.fndtn.abide', function () {
      // Handle the submission of the form
      resolve({
        isValid: true && ret,
        errorMessages: msg
      });
    });
    $(selector).on('invalid.fndtn.abide', function () {
      // Handle the submission of the form
      if (Session.get("bz.user.language")=='ru'){
        msg.push('Некоторые поля не прошли проверку');
      }
      else {
        msg.push('Some fields did not pass validation');
      }
        resolve({
        isValid: false,
        errorMessages: msg
      });
    });

    // 2. submit abide forms to trigger validation:
    $(selector).submit();

    // 3. remove event listeners:
    $(selector).off('valid.fndtn.abide');
    $(selector).off('invalid.fndtn.abide');
  });
}


bz.ui.resizeSearchField = function() {
  var $controlBtnList, $windowWidth, $boxSearch;

  $windowWidth =      $(window).width() - 30;
  $controlBtnList =   $('.control--category-list-buttons').width();
  $boxSearch =        $('.box-search');


  if($windowWidth > $controlBtnList) {
    $boxSearch.css('width', $controlBtnList);
  } else {
    $boxSearch.css('width', '');
  }
};
