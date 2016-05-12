/**
 * Created by douson on 09.07.15.
 */
Template.profileSettings.onCreated(function() {
  //Meteor.subscribe('users', Router.current().params._id);

  this.someUserData = new ReactiveVar(false);
});

Template.profileSettings.onRendered(function() {
  var self = this, check = self.$('#user-public-publications-police').prop('checked');
  bz.cols.profileDetails.findOne({userId: Meteor.userId()})
});


Template.profileSettings.helpers({
  isCheckOwnPosts: function() {
    if(this._id) {
      var ret = (this.profile.checkOwnPosts)? 'checked' : '';
    }
    return ret;
  },
  setLanguage: function() {
    
    var curLang = Meteor.users.findOne({_id: Meteor.userId()});
    
    return [
      {code: 'en', name: 'English'},
      {code: 'ru', name: 'Русский'}  
    ]
    
  },
  /* NEW CODE */
  getUser: function() {
    var userId = Meteor.userId(), ins = Template.instance(), innerObj = {}, usegObj = {};
    if (ins.someUserData.get() === false) {
      Meteor.call('getUser', userId, function(e, r){
        if(e) {
          //error
        } else {
          innerObj = r.result;
          
          _.each(innerObj.profileDetails, function(item) {
            usegObj[item.key] = {
              value:  item.value,
              policy: item.policy
            };
          });
          
          usegObj['username'] = innerObj.username;
          //console.info(usegObj);
          ins.someUserData.set(usegObj);
        }
      });
    }
    return ins.someUserData.get();
  },
  /* OLD CODE */
  getPostsCount: function(){
    return bz.cols.posts.find({userId: Meteor.userId()}).count();
  },
  getReviewsCount: function(){
    return bz.cols.reviews.find({userId: Meteor.userId()}).count();
  },
  
  /*getFirstName: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'firstName'});
    return details && details.value;
  },
  getLastName: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'lastName'});
    return details && details.value;
  },
  getCity: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'city'});
    return details && details.value;
  },
  getPhoneNumber: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'phone'});
    return details && details.value;
  },
  getPhoneNumberStatus: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'phone'});
    return details && details.policy;
  },
  getSkype: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'skype'});
    return details && details.value;
  },
  getSkypeStatus: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'skype'});
    return details && details.policy;
  },
  getVKUrl: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'vk'});
    return details && details.value;
  },
  getVKUrlStatus: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'vk'});
    return details && details.policy;
  },
  getFacebookUrl: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'facebook'});
    return details && details.value;
  },
  getFacebookUrlStatus: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'facebook'});
    return details && details.policy;
  },
  getTwitterUrl: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'twitter'});
    return details && details.value;
  },
  getTwitterUrlStatus: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'twitter'});
    return details && details.policy;
  },*/
  
  getUserProfileLink: function() {
    // protocol / user/ user_id
    var urlBase = Meteor.absoluteUrl();
    return urlBase && urlBase + 'user/' + this._id;
  }

});




Template.profileSettings.events({
  'mouseup .js-bz-profile-user-link-select': function(e, v) {
    var $target = v.$(e.target); 
    $target.select();
  },
  'click div.btn-edit-account a.js-edit-btn':function(event,v){

    v.$('div.edit-fields-user input.user-settings').removeClass('disabled');
    v.$('div.edit-fields-user select').parent().removeClass('disabled');
    v.$(event.currentTarget).addClass('disabled');
    v.$('div.btn-edit-account a.js-done-btn').removeClass('disabled');
    v.$('div.btn-edit-account a.js-cancel-btn').removeClass('disabled');

  },
  'click div.btn-edit-account a.js-done-btn':function(event, v){

    v.$('div.edit-fields-user input.user-settings').addClass('disabled');
    v.$('div.edit-fields-user select').parent().addClass('disabled');
    v.$(event.currentTarget).addClass('disabled');
    v.$('div.btn-edit-account a.js-edit-btn').removeClass('disabled');
    v.$('div.btn-edit-account a.js-cancel-btn').addClass('disabled');
    var attributes = [{
      key: 'firstName',
      value: v.$('input.bz-profile-first-name').val(),
      policy: '1'
    },
      {
        key: 'lastName',
        value: v.$('input.bz-profile-last-name').val(),
        policy: '1'
      },
      {
        key: 'city',
        value: v.$('input.bz-profile-city').val(),
        policy: '1'
      },
      {
        key: 'phone',
        value: v.$('input.bz-profile-phone-number').val(),
        policy: v.$('select.js-profile-phone-status').val()
      },
      {
        key: 'skype',
        value: v.$('input.bz-profile-skype').val(),
        policy:  v.$('select.js-profile-skype-status').val()
      },
      {
        key: 'vk',
        value: v.$('input.bz-profile-vk-url').val(),
        policy: v.$('select.js-profile-vk-status').val()
      },
      {
        key: 'twitter',
        value: v.$('input.bz-profile-twitter-url').val(),
        policy:  v.$('select.js-profile-twitter-status').val()
      },
      {
        key: 'facebook',
        value: v.$('input.bz-profile-facebook-url').val(),
        policy:  v.$('select.js-profile-facebook-status').val()
      }
    ];
    
    Meteor.call('editUser', {profileDetails: attributes}, function(e, r) {
      if (e){
        //error
        console.info(e);
      } else {
        console.info(r);
      }
    });
    
   /*Meteor.call('updateProfileDetails', this._id, attributes, function(err){
     if (err){

     }
     else
     {

     }
   });*/
  },
  'submit form': function (event){
    event.preventDefault();
  },
  'click div.btn-edit-account a.js-cancel-btn':function(event, v){

    v.$('div.edit-fields-user input.user-settings').addClass('disabled');
    v.$('div.edit-fields-user select').parent().addClass('disabled');
    v.$(event.currentTarget).addClass('disabled');
    v.$('div.btn-edit-account a.js-done-btn').addClass('disabled');
    v.$('div.btn-edit-account a.js-edit-btn').removeClass('disabled');
    v.$('input.bz-profile-first-name').val(bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'firstName'}).value);
    v.$('input.bz-profile-last-name').val(bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'lastName'}).value);
    v.$('input.bz-profile-city').val(bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'city'}).value);
    v.$('input.bz-profile-phone-number').val(bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'phone'}).value);
    v.$('input.bz-profile-skype').val(bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'skype'}).value);
    v.$('input.bz-profile-vk-url').val(bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'vk'}).value);
    v.$('input.bz-profile-twitter-url').val(bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'twitter'}).value);
    v.$('input.bz-profile-facebook-url').val(bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'facebook'}).value);
    v.$('select.js-profile-phone-status').val(bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'phone'}).policy);
    v.$('select.js-profile-skype-status').val(bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'skype'}).policy);
    v.$('select.js-profile-vk-status').val(bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'vk'}).policy);
    v.$('select.js-profile-twitter-status').val(bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'twitter'}).policy);
    v.$('select.js-profile-facebook-status').val(bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'facebook'}).policy);
  },
  'click #user-public-publications-police': function(e, v) {
    var checkbox = v.$(e.target), toggle;
    toggle = checkbox.prop('checked');
    Meteor.call('updateCheckOwnPosts', toggle, function(error, result) {});
  }
});