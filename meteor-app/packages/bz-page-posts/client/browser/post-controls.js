/**
 * Created by arutu_000 on 1/23/2016.
 */

Template.postTypeSelect.helpers({
  getSiteTypes: function () {
    var lang = Session.get('bz.user.language');
    return GetPostAdTypesI18n(lang);
    //return bz.cols.postAdTypes.find();
  }
});
Template.postTypeSelect.events({
  'change .js-ad-type-select': function (e, v) {
    var val = e.target.value;
    checkIfFieldIsChanged(v.data, 'type', val);
    setPostDetailsTemplate(val.toCapitalCase(), this);
    bz.ui.initFoundationValidation();
  }
});
Template.postTypeSelect.rendered = function () {
  if(this.data._id && this.data.type){

    this.$('.js-ad-type-select').val(this.data.type);
    this.$('.js-ad-type-select').addClass('disabled'); // for now logic is "do not let to change type"
  }

  var name = this.$('.js-ad-type-select').val() || '';
  setPostDetailsTemplate(name.toCapitalCase(), this);
}
function setPostDetailsTemplate(name, v) {
  $('.js-post-details-categorized').empty();
  var template = Template['postDetails' + name];
  if(name && v && template) {
    Blaze.renderWithData(template, v.data, $('.js-post-details-categorized')[0]);
  }
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
Template.bzPostsDurationPicker.onRendered(function(){
});
Template.bzPostsDurationPicker.events({
  'change .js-post-select-duration': function(e, v) {
  }
});
Template.postDetailsCommon.onCreated(function(a, b, c){
});
Template.postDetailsCommon.events({
  'change .js-post-description': function(e, v){
    var val = e.target.value || '';
    checkIfFieldIsChanged(v.data, 'title', val);
  },
  'change .js-post-title': function(e, v){
    var val = e.target.value || '';
    checkIfFieldIsChanged(v.data, 'title', val);
  }
})
Template.postDetailsCommon.helpers({
  getTitle: function () {
    var ret = '';
    if(this._id){
      ret = this.details.title
    } else {
      Session.get('post-title')
    }
    return ret;
  },
  getDescription: function () {
    var ret = '';
    if(this._id){
      ret = this.details.description
    } else {
      Session.get('post-description')
    }
    return ret;
  }
});
Template.postPhotoUpload.helpers({
  getImageSrc: function () {
    var ret = 'http://localhost:3000/img/content/avatars/avatar-no.png';
    return Session.get('bz.posts.postImgSrc') || ret;
  },
  getPostImages: function(){
    var imgArr = imagesArrayReactive.get(), ret;
    if(!imgArr || !Array.isArray(imgArr)) {
      imgArr = []
    } else {
      imgArr = _.filter(imgArr, function(img){
        return img.type !== 'thumbnail';
      });
    }

    ret = _.map(imgArr, function(item){
      return {
        data: item.data,
        name: item.name
      }
    });
    return ret;
    /*return [{
        data: 'http://omesto.ru/wp-content/uploads/2014/09/%D0%9C%D0%B0%D0%B3%D0%B0%D0%B4%D0%B0%D0%BD-715x424.jpg',
        name: 'qwer'
      }, {
        data: 'http://omesto.ru/wp-content/uploads/2014/09/%D0%9C%D0%B0%D0%B3%D0%B0%D0%B4%D0%B0%D0%BD-715x424.jpg',
        name: 'qwer'
      }]*/
  },
  getImagesArrayReactive: function(){
    return {
      imagesArr: imagesArrayReactive
    };
  }
});
Template.postPhotoUpload.events({
  'click .js-edit-avatar': function (event, template) {
    //$('.js-avatar-upload-modal').foundation('reveal', 'open');
  },
  'click .js-plus-img': function(e,v){
    $('.js-avatar-upload-modal').foundation('reveal', 'open');
  },

});
Template.bzPostPhotoUploadImagePreview.events({
  'click .js-remove-preview-photo': function(e, v){
    var name = v.data.name,
      arr = imagesArrayReactive.get();
    var ind = arr.findIndex(x => x.name === name);
    arr.splice(ind, 1);
    imagesArrayReactive.set(arr);
  }
});

function checkIfFieldIsChanged(data, fieldName, value){
  if(data && fieldName && value !== undefined && value !== null) {
    if (data._id) {
      if (data[fieldName] !== value) {
        bz.runtime.changesNotSaved = true;
      }
    } else {
      bz.runtime.changesNotSaved = true;
    }
  }
}