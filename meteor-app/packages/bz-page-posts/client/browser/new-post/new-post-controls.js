

//Template.postsNewForm.events({});

Template.bzPostTypes.events({
  /*'change .js-post-type-select': function(e, v){
    var type = e.target.value;
    setNewPostType(type);
  }*/
})
Template.postTypeSelect.helpers({
  getSiteTypes: function () {
    return bz.cols.siteTypes.find();
  }
});
Template.postTypeSelect.events({
  'change .js-post-type-select': function (e, v) {
    var name = e.target.value.toCapitalCase();
    setPostDetailsTemplate(name, v);
  }
});
Template.postTypeSelect.rendered = function () {
  var name = this.$('.js-ad-type-select').val().toCapitalCase();
  setPostDetailsTemplate(name, this);
}

Template.postHashesControl.destroyed = function () {
  $('[data-action="buttonTapped"]').off();
}
Template.postHashesControl.helpers({
  getHashes: function () {
    var arr = Session.get('hashes') || [];
    return arr.join(', ');
  }
})
Template.postHashesControl.events({
  'click [data-action="showPrompt"]': function (o, t) {
    a = IonPopup.prompt({
      title: "Hashes",
      template: "Please enter hashes, separated by space",
      okText: "Submit",
      inputType: "text",
      text: 'IonPopup',
      inputPlaceholder: "Your Hashes"
      //js-hashes-holder
    });
    $('[data-action="buttonTapped"]').click(function (e) {
      var inpVal = $('input[name=prompt]').val();
      if ($(e.target).data().index === 0 && inpVal && inpVal.trim() !== '') {
        Session.set('hashes', inpVal.trim().split(' '));
      }
    });
  }
});
Template.postDetailsHelp.events({
  'click .panel': function(e,v){
    $(e.target).closest('.panel').toggleClass('callout');
  }
});


Template.postDetailsCommon.helpers({
  getTitle: function () {
    return Session.get('post-title') || '';
  },
  getDescription: function () {
    return Session.get('post-description') || '';
  }
});
//$('.backdrop.visible.active .popup .popup-title').text().toLowerCase()

Template.postDetailsTrade.helpers({
  getPrice: function () {
    return Session.get('post-price') || '';
  }
});

Template.postPhotoUpload.helpers({
  getImageSrc: function () {
    var ret = 'http://localhost:3000/img/content/avatars/avatar-no.png';
    return Session.get('bz.posts.postImgSrc') || ret;
  },
  getPostImages: function(){
    var imgArr = Session.get('bz.posts.postImgArr');
    if(!imgArr || !Array.isArray(imgArr)) {
      imgArr = []
    } else {
    }
    return imgArr;
  }
});
Template.postPhotoUpload.events({
  'click .js-edit-avatar': function (event, template) {
    //$('.js-avatar-upload-modal').foundation('reveal', 'open');
  },
  'click .js-plus-img': function(e,v){
    $('.js-avatar-upload-modal').foundation('reveal', 'open');
  }
});


Template.bzPostsNewFormMemo.rendered = function() {

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
  'click .btn-additional-param': function(e, v) {
    
    var target = v.$('.bz-btn-additional-param-open'),
        children = v.$('.bz-param-children'),
        childHeight = target.height();
    
    if(!target.hasClass('bz-container-open')) {
      $(e.target).addClass('active');
      target.addClass('bz-container-open');
      children.css({'marginTop': 0});

      var target_top= target.offset().top;
      $('html, body').animate({scrollTop:target_top}, 'fast');
      
    } else {
      $(e.target).removeClass('active');
      target.removeClass('bz-container-open');
      children.css({'marginTop': -childHeight});
      
      
    }
    
    
    //bz-param-children margin-top = height bz-btn-additional-param-open
    
  }
});

function setPostDetailsTemplate(name, v) {
  $('.js-post-details-categorized').empty();
  Blaze.renderWithData(Template['postDetails' + name], v.data, $('.js-post-details-categorized')[0]);
}
// set new image to db:
Meteor.startup(function () {

  Tracker.autorun(function () {
    bz.runtime.newPost.postImage = Session.get('bz.posts.postImgSrc');
    bz.runtime.newPost.hashes = Session.get('hashes');
  });
});

