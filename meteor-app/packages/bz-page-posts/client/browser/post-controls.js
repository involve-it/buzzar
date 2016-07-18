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
  if (this.data._id && this.data.type) {

    this.$('.js-ad-type-select').val(this.data.type);
    this.$('.js-ad-type-select').addClass('disabled'); // for now logic is "do not let to change type"
  }

  var name = this.$('.js-ad-type-select').val() || '';
  setPostDetailsTemplate(name.toCapitalCase(), this);
}
function setPostDetailsTemplate(name, v) {
  $('.js-post-details-categorized').empty();
  var template = Template['postDetails' + name];
  if (name && v && template) {
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


Template.bzPostsDurationPicker.onRendered(function () {
  
  //event opened modal
  $(document).on('open.fndtn.reveal', '[data-reveal].js-date-picker-modal', function () {
    var modal = $(this);
  /*CONSOLE CLEAR
    console.info('Modal opened');
  */
  });
  
});

Template.bzPostsDurationPicker.events({
  'change .js-duration-select-picker': function(e, v) {
    
    let target = e.target,
        value = target.value,
        start = new Date(),
        format, ret;
    
    if(value === 'custom') {
      $('.js-date-picker-modal').foundation('reveal', 'open', {
        animation: 'fadeAndPop',
        animation_speed: 150
      });

      v.$('.js-duration-picker').val('');
      v.$('.js-duration-picker').removeData();
    } else {
      v.$('.js-duration-picker').val('');
      v.$('.js-duration-picker').removeData();
      
      /* устновить данные для input */
      switch(value) {
        case 'oneDay':
          ret = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1, start.getHours(), start.getMinutes()); break;
        case 'twoDay':
          ret = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 2, start.getHours(), start.getMinutes()); break;
        case 'week':
          ret = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7, start.getHours(), start.getMinutes()); break;
        case 'twoWeek':
          ret = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 14, start.getHours(), start.getMinutes()); break;
        case 'month':
          ret = new Date(start.getFullYear(), start.getMonth() + 1, start.getDate(), start.getHours(), start.getMinutes()); break;
        case 'year':
          ret = new Date(start.getFullYear() + 1, start.getMonth(), start.getDate(), start.getHours(), start.getMinutes()); break;
        default:
          console.error('Error selected value'); break;
      }
      
      if(ret) {
        ( Session.get('bz.user.language') === 'ru' ) ? format = ret.toLocaleDateString('ru-RU', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : format = ret.toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      }
    }
    v.$('.js-duration-picker').val(format);
    //console.info(value);
  },
  'click .js-duration-picker': function(e, v) {
    e.preventDefault();

    v.$('.js-duration-picker').val('');
    v.$('.js-duration-picker').removeData();
    
    v.$('.js-duration-select-picker option[value=""]').prop('selected',true);
    v.$('.js-date-picker-modal').foundation('reveal', 'open');
  }
});

Template.bzPostsDurationPicker.helpers({});

/* MODAL DATE PICKER */
Template.bzDatePickerModal.onCreated(function() {});


Template.bzDatePickerModal.onRendered(function() {
  let tmpl = this,
      datePicker,
      nowDate = new Date(),
      now = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() + 1, 0, 0, 0, 0),
      picker = tmpl.$('#bz-date-picker-box'),
      getBtnStatus;

  getBtnStatus = function(datePicker, dateNow) {
    return (datePicker < dateNow) ? true : false;
  };
  
  datePicker = picker.fdatepicker({
    onRender: function (date) {
      /* update selected date */
      return date.valueOf() < now.valueOf() ? 'disabled' : '';
    }
  });

  /* set data at start */
  if(picker) {
    //picker.fdatepicker('update', now).data().datepicker.update();
  }
  
  if(getBtnStatus(datePicker.data().datepicker.date.valueOf(), now.valueOf())) {
    tmpl.actionBtnDate = true;
    tmpl.$('.js-ok-btn').addClass('disabled');
  }
  
  //console.info(datePicker.data().datepicker.date);

  tmpl.datePickerSelectDate = nowDate;

  datePicker.on('changeDate', function(e){
    let nowDate = new Date(),
        selectDate = e.date;

    /* set selected date */
    tmpl.datePickerSelectDate = selectDate;

    if(getBtnStatus(datePicker.data().datepicker.date.valueOf(), now.valueOf())) {
      tmpl.actionBtnDate = true;
      tmpl.$('.js-ok-btn').addClass('disabled');
    } else {
      tmpl.actionBtnDate = false;
      tmpl.$('.js-ok-btn').removeClass('disabled');
    }
    
    //console.info('change DATE', new Date(selectDate));
  }).data('datepicker');
  
  /* Show the datepicker */
  datePicker.fdatepicker('show');
  $('.js-duration-select-picker').trigger('change');
});


Template.bzDatePickerModal.events({
  'click .js-bz-date-picker-now': function (e, v) {
    e.preventDefault();
    let nowDate = new Date(),
        tomorrow = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() + 1, 0, 0, 0, 0),
        datepicker = v.$('#bz-date-picker-box');
    
    if (datepicker) {
      datepicker.fdatepicker('update', tomorrow).data().datepicker.update();
      
      /* update selected date */
      Template.instance().datePickerSelectDate = tomorrow;
    } else {
      throw new Error('Datepicker is not defined');
    }
    
  },
  'click .js-cancel-btn': function(e, v) {
    e.preventDefault();
    
    $('.js-date-picker-modal').foundation('reveal', 'close');
  },
  'click .js-ok-btn': function(e, v) {
    /* button apply datepicker */
    e.preventDefault();
    
    if(Template.instance().actionBtnDate) {
      
    }
    /* set selected date */
    let getSelectedDate = Template.instance().datePickerSelectDate,
        format,
        input = $('.js-duration-picker');
    
    if(!getSelectedDate) {console.error('Date is not selected')};
    
    /* format mm/dd/yyyy - en | dd/mm/yyyy - ru */
    ( Session.get('bz.user.language') === 'ru' ) ? format = getSelectedDate.toLocaleDateString('ru-RU', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : format = getSelectedDate.toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    if(format && getSelectedDate) {
      input.val(format).data('selectDate', getSelectedDate);
      $('.js-duration-select-picker option[value=""]').prop('selected',true);
    } else {
      input.attr('placeholder', 'format is not defined');
    }
    
    
    $('.js-date-picker-modal').foundation('reveal', 'close');
    //console.info('click APPLY', getSelectedDate);
  }
});

Template.bzDatePickerModal.helpers({});




Template.postDetailsCommon.onRendered(function() {});


Template.postDetailsCommon.events({
  'change .js-post-description': function (e, v) {
    var val = e.target.value || '';
    checkIfFieldIsChanged(v.data, 'title', val);
  },
  'change .js-post-title': function (e, v) {
    var val = e.target.value || '';
    checkIfFieldIsChanged(v.data, 'title', val);
  },
  'keyup .js-post-title': function(e, v) {
    var $input = v.$('.js-post-title'),
        attrMax = $input.attr('maxlength'),
        value = $input.val().length;
    
    v.$('.bz-count-characters').find('span')[0].innerHTML = attrMax - value;
  },
  'paste .js-post-title': function(e, v) {
    v.$('.js-post-title').trigger('keyup');
  }
});


function maxLengthFields(el, attr) {}

Template.postDetailsCommon.helpers({
  getTitle: function () {
    var ret = '';
    if (this._id) {
      ret = this.details.title
    } else {
      Session.get('post-title')
    }
    return ret;
  },
  getDescription: function () {
    var ret = '';
    if (this._id) {
      ret = this.details.description
      ret = ret.replace(/<br\/>/gi, '\n');
    } else {
      Session.get('post-description')
    }
    return ret;
  }
});


var lastComputation;
Template.postPhotoUpload.onRendered(()=> {
  var that = this, key = true;
  
  lastComputation && lastComputation.stop();
  that.$('.js-post-photo-upload-preview-holder').empty();
  setTimeout(()=> {
    Tracker.autorun((computation)=> {
      lastComputation = computation;
      var holder$ = that.$('.js-post-photo-upload-preview-holder'), imgArr, ret,
          previewHolder = that.$('.js-post-photo-upload-preview-holder');
      if (holder$ && holder$[0]) {
        imgArr = imagesArrayReactive.get(), ret;
        if (!imgArr || !Array.isArray(imgArr)) {
          imgArr = []
        } else {
          imgArr = _.filter(imgArr, function (img) {
            return img.type !== 'thumbnail';
          });
        }

        ret = _.map(imgArr, function (item) {
          return {
            data: item.data,
            name: item.name
          }
        });
        holder$.empty();
        _.each(ret, (img)=> {
          Blaze.renderWithData(Template.bzPostPhotoUploadImagePreview, img, holder$[0]);
        });
        
        if(key && previewHolder && previewHolder.children().length === 1) {
          $(document).foundation();
          key = false;
        }
        
      }
    });
  }, 1000);
});
Template.postPhotoUpload.helpers({
  getImageSrc: function () {
    var ret = 'http://localhost:3000/img/content/avatars/avatar-no.png';
    return Session.get('bz.posts.postImgSrc') || ret;
  },
  getPostImages: function () {
    // not working due to some M bug, used renderImgsPreviews instead
  },
  getImagesArrayReactive: function () {
    return {
      imagesArr: imagesArrayReactive
    };
  }
});

Template.postPhotoUpload.events({
  'click .js-edit-avatar': function (event, template) {
    //$('.js-avatar-upload-modal').foundation('reveal', 'open');
  },
  'click .js-plus-img': function (e, v) {
    $('.js-avatar-upload-modal').foundation('reveal', 'open');
  },
  'click li .js-remove-preview-photo': function (e, v) {
    e.stopPropagation();
    e.preventDefault();

    //var name = v.data.name,
    var name = $(e.target.closest('a.remove-preview-photo')).attr('data-name'),
        arr = imagesArrayReactive.get();

    var ind = arr.findIndex(x => x.name === name);
    if(ind !== -1) {
      arr.splice(ind, 1);
      imagesArrayReactive.set(arr);
    } else {
      bz.ui.alert(T9n.get('IMAGE_PHOTO_INDEX_NOT_FOUND'), {type: 'error', timeout: 2000});
    }
    
    return false;
  }
});

Template.bzPostPhotoUploadImagePreview.onRendered(function() {
  
  
});


function checkIfFieldIsChanged(data, fieldName, value) {
  if (data && fieldName && value !== undefined && value !== null) {
    if (data._id) {
      if (data[fieldName] !== value) {
        bz.runtime.changesNotSaved = true;
      }
    } else {
      bz.runtime.changesNotSaved = true;
    }
  }
}

Template.postTagsSelect.onCreated(function(){
  Meteor.subscribe('tags');
});

Template.postTagsSelect.onRendered(function() {
  var self = this;
  var arr = self.data.tags;

  $('.ui.dropdown.post-tags').dropdown();

  setTimeout(function() {
    $('.ui.dropdown.post-tags').dropdown('set selected', arr);
  },1000);

});
Template.postTagsSelect.helpers({
  getTags: function(){
    return bz.cols.tags.find().fetch();
  }
});