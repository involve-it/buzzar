/**
 * Created by douson on 09.07.15.
 */

Template.profileSettings.onCreated(function() {
  return Meteor.subscribe('users', Router.current().params._id);
});



Template.profileSettings.helpers({

  setLanguage: function() {
    
    var curLang = Meteor.users.findOne({_id: Meteor.userId()});
    
    return [
      {code: 'en', name: 'English'},
      {code: 'ru', name: 'Русский'}  
    ]
    
  },

  getPostsCount: function(){
    return bz.cols.posts.find({userId: Meteor.userId()}).count();
  },
  getReviewsCount: function(){
    return bz.cols.reviews.find({userId: Meteor.userId()}).count();
  },

  getFirstName: function(){
    return this.profile.firstName;
  },
  getLastName: function(){
    return this.profile.lastName;
  },
  getCity: function(){
    return this.profile.city;
  },
  getPhoneNumber: function(){
    return this.profile.phone.number;
  },
  getPhoneNumberStatus: function(){
    return this.profile.phone.status;
  },
  getSkype: function(){
    return this.profile.skype.account;
  },
  getSkypeStatus: function(){
    return this.profile.skype.status;
  },
  getVKUrl: function(){
    return this.profile.vk.url;
  },
  getVKUrlStatus: function(){
    return this.profile.vk.status;
  },
  getFacebookUrl: function(){
    return this.profile.facebook.url;
  },
  getFacebookUrlStatus: function(){
    return this.profile.facebook.status;
  },
  getTwitterUrl: function(){
    return this.profile.twitter.url;
  },
  getTwitterUrlStatus: function(){
    return this.profile.twitter.status;
  }

});




Template.profileSettings.events({
    'click [data-action=share-profile]': function (event, template) {
        IonActionSheet.show({
            titleText: 'Share Profile',
            buttons: [
                { text: 'One' },
                { text: 'Two' },
                { text: 'Some text' }
            ],
            cancelText: 'Cancel',
            buttonClicked: function(index) {
                if (index === 0) {
                    console.log('ONE!');
                }
                if (index === 1) {
                    console.log('TWO!');
                }
                if (index === 2) {
                    console.log('SOME TEXT');
                }
                return true;
            }
        });
    },
    'click [data-action=edit-avatar]': function (event, template) {
        /*IonActionSheet.show({
              titleText: 'Edit picture',
              buttons: [
                  { text: 'Photo Library' },
                  { text: 'Take Photo' }
              ],
              cancelText: 'Cancel'
          }
        )*/
    },
  'click div.btn-edit-account a.js-edit-btn':function(event,v){

    v.$('div.edit-fields-user input').removeClass('disabled');
    v.$('div.edit-fields-user select').parent().removeClass('disabled');
    v.$(event.currentTarget).addClass('disabled');
    v.$('div.btn-edit-account a.js-done-btn').removeClass('disabled');
    v.$('div.btn-edit-account a.js-cancel-btn').removeClass('disabled');

  },

  'click div.btn-edit-account a.js-done-btn':function(event, v){

    v.$('div.edit-fields-user input').addClass('disabled');
    v.$('div.edit-fields-user select').parent().addClass('disabled');
    v.$(event.currentTarget).addClass('disabled');
    v.$('div.btn-edit-account a.js-edit-btn').removeClass('disabled');
    v.$('div.btn-edit-account a.js-cancel-btn').addClass('disabled');

    Meteor.users.update({_id: Meteor.userId()},{
      $set: {
        "profile.firstName": v.$('input.bz-profile-first-name').val(),
        "profile.lastName": v.$('input.bz-profile-last-name').val(),
        "profile.city": v.$('input.bz-profile-city').val(),
        "profile.phone":{
          number: v.$('input.bz-profile-phone-number').val(),
          status: v.$('select.js-profile-phone-status').val()
        },
        "profile.skype":{
          account: v.$('input.bz-profile-skype').val(),
          status: v.$('select.js-profile-skype-status').val()
        },
        "profile.vk":{
          url: v.$('input.bz-profile-vk-url').val(),
          status: v.$('select.js-profile-vk-status').val()
        },
        "profile.twitter": {
          url:  v.$('input.bz-profile-twitter-url').val(),
          status: v.$('select.js-profile-twitter-status').val()
        },
        "profile.facebook": {
          url: v.$('input.bz-profile-facebook-url').val(),
          status: v.$('select.js-profile-facebook-status').val()
        }
      }
    });
  },
  'submit form': function (event){
    event.preventDefault();
  },

  'click div.btn-edit-account a.js-cancel-btn':function(event, v){

    v.$('div.edit-fields-user input').addClass('disabled');
    v.$('div.edit-fields-user select').parent().addClass('disabled');
    v.$(event.currentTarget).addClass('disabled');
    v.$('div.btn-edit-account a.js-done-btn').addClass('disabled');
    v.$('div.btn-edit-account a.js-edit-btn').removeClass('disabled');
    v.$('input.bz-profile-first-name').val(this.profile.firstName);
    v.$('input.bz-profile-last-name').val(this.profile.lastName);
    v.$('input.bz-profile-city').val(this.profile.city);
    v.$('input.bz-profile-phone-number').val(this.profile.phone.number);
    v.$('input.bz-profile-skype').val(this.profile.skype.account);
    v.$('input.bz-profile-vk-url').val(this.profile.vk.url);
    v.$('input.bz-profile-twitter-url').val(this.profile.twitter.url);
    v.$('input.bz-profile-facebook-url').val(this.profile.facebook.url);
    v.$('select.js-profile-phone-status').val(this.profile.phone.status);
    v.$('select.js-profile-skype-status').val(this.profile.skype.status);
    v.$('select.js-profile-vk-status').val(this.profile.vk.status);
    v.$('select.js-profile-twitter-status').val(this.profile.twitter.status);
    v.$('select.js-profile-facebook-status').val(this.profile.facebook.status);
  }
});