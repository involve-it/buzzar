Template.bzPostsNewFormAd.rendered = function () {
  Router.AddHooksToCheckFormSaved();

    // debugger;
    setTimeout(function(){
      // let's lazy-load code mirror plugin:
      bz.ui.initCodeMirror($('.js-post-description'));
    }, 100);
};


Template.bzPostsNewFormAd.helpers({
  getImagesArrayReactive: function() {
    return {
      imagesArr: imagesArrayReactive
    }
  }
});


Template.bzPostsNewFormMemo.rendered = function () {

  $('#dateStart').fdatepicker({
    format: 'mm-dd-yyyy hh:ii',
    disableDblClickSelection: true,
    pickTime: true
  });

  $('#dateEnd').fdatepicker({
    format: 'mm-dd-yyyy hh:ii',
    disableDblClickSelection: true,
    pickTime: true
  });

  // implementation of disabled form fields
  /*var nowTemp = new Date();
   var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
   var checkin = $('#dateStart').fdatepicker({
   pickTime: true,
   format: 'mm-dd-yyyy hh:ii',
   onRender: function (date) {
   return date.valueOf() < now.valueOf() ? 'disabled' : '';
   }
   }).on('changeDate', function (ev) {
   if (ev.date.valueOf() > checkout.date.valueOf()) {
   var newDate = new Date(ev.date)
   newDate.setDate(newDate.getDate() + 1);
   checkout.update(newDate);
   }
   checkin.hide();
   $('#dateEnd')[0].focus();
   }).data('datepicker');
   var checkout = $('#dateEnd').fdatepicker({
   onRender: function (date) {
   return date.valueOf() <= checkin.date.valueOf() ? 'disabled' : '';
   }
   }).on('changeDate', function (ev) {
   checkout.hide();
   }).data('datepicker');*/

};

Template.bzPostsNewFormMemo.events({
  'click .btn-additional-param': function (e, v) {

    var target = v.$('.bz-btn-additional-param-open'),
      children = v.$('.bz-param-children'),
      childHeight = target.height();

    if (!target.hasClass('bz-container-open')) {
      $(e.target).addClass('active');
      target.addClass('bz-container-open');
      children.css({'marginTop': 0});

      var target_top = target.offset().top;
      $('html, body').animate({scrollTop: target_top}, 'fast');

    } else {
      $(e.target).removeClass('active');
      target.removeClass('bz-container-open');
      children.css({'marginTop': -childHeight});


    }


    //bz-param-children margin-top = height bz-btn-additional-param-open

  }
});



