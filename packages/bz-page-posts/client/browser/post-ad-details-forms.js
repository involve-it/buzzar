/**
 * Created by arutu_000 on 1/23/2016.
 */
Template.postDetailsHelp.events({
  'click .panel': function(e,v){
    $(e.target).closest('.panel').toggleClass('callout');
  }
});
Template.postDetailsTrade.helpers({
  getPrice: function () {
    var ret = '';
    if(this._id){
      ret = this.details.price
    } else {
      Session.get('post-price')
    }
    return ret;
  }
});

Template.postDetailsJobs.onRendered(function() {
  $('.bz-ui-dropdown').foundationSelect();
  
  var selectedFile = $('#bz-job-files'),
      files = selectedFile.get(0).files;
  
  if(!(files && files[0])) {
    $('.bz-job-files-wrapper').addClass('close');
  }
    
  $('.bz-attach-job-form').hide();
});

Template.postDetailsJobs.events({
  'change #bz-job-files': function(e, v) {
    var input = e.target, that = this;

    if (input.files && input.files[0]) {
      var nameFile, sizeFile;

      nameFile = input.files[0].name;
      sizeFile = input.files[0].size;
      v.$('.bz-job-file-attach-info').append(nameFile);
      $(input).hide();
      v.$('.bz-job-files-wrapper').removeClass('close');
    }
  },
  'click #js-remove-attachment': function(e, v) {
    e.preventDefault();

    var selectedFile = $('#bz-job-files');
    if(selectedFile) {
      selectedFile.val('').clone(true);
      selectedFile.show();
      v.$('.bz-job-files-wrapper').addClass('close');
      v.$('.bz-job-file-attach-info').empty();
    }
  },
  'click .js-bz-button': function(e, v) {
    e.preventDefault();
    
    var ele = $(e.target.closest('.bz-button')),
        payChoose = v.$('.bz-add-post-pay-choose');

    $('[data-bz-button-radio] > *').attr('aria-checked', 'false').filter('.bz-active').attr('aria-checked', 'true');
    
    v.$('.bz-button').not(ele).removeClass('bz-active').blur();
    ele.addClass('bz-active');

    v.$('.bz-button').not(ele).attr('aria-checked', 'false');
    ele.attr('aria-checked', 'true');

    v.$('.bz-button').trigger("change.bz.button", [ele]);
    
    (ele.data('value') === 'free') ? payChoose.hide() : payChoose.show();
    
  },
  'click #bz-attach-job-document': function(e, v) {
    $('.bz-attach-job-form').toggle();
  }
});

Template.postDetailsJobs.helpers({});



/* tmpl TRAININGS */
Template.postDetailsTrainings.events({
  'click #select-trainings-section-learning': function(e, v) {
    var $target = $(e.target);
    
    if($target.closest('li').data('value')) {
      $target.closest('#select-trainings-section-learning').children('.disabled').remove();
      v.$('#select-trainings-search-category').closest('.custom-dropdown-area').removeClass('disabled');
    }
    
  }
});


Template.postDetailsTrainings.onRendered(function() {
  $('.bz-ui-dropdown').foundationSelect();
  
  $('#select-trainings-search-category').closest('.custom-dropdown-area').addClass('disabled');
});

Template.postDetailsTrainings.helpers({});