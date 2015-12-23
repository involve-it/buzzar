/**
 * Created by douson on 29.07.15.
 */

Template.userEdit.onCreated(function () {
  return Meteor.subscribe('users', Router.current().params._id);
});

Template.userEdit.events({
  'click .js-done-btn': function(e, v){
    var r = Router.routes['myProfile'];
    Router.go(r.url());
  }
})
Template.userEdit.helpers({
  contact: function () {
    return Meteor.users.findOne({_id: Router.current().params._id});
  }
});

Schema = {};

Template.registerHelper("Schema", Schema);

Schema.UserProfile = new SimpleSchema({

  firstName: {
    type: String,
    regEx: /^[a-zA-Z-]{2,25}$/,
    optional: true
  },
  lastName: {
    type: String,
    regEx: /^[a-zA-Z]{2,25}$/,
    optional: true
  },
  birthday: {
    type: Date,
    optional: true
  },
  gender: {
    type: String,
    allowedValues: ['Male', 'Female'],
    optional: true
  },
  website: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  image: {
    type: Object,
    blackbox: true
  }
  /*feeling: {
    type: String,
    optional: true,
    autoform: {
      afFieldInput: {
        type: "textarea",
        rows: 2
      }
    }
  }*/
});

Schema.User = new SimpleSchema({
  username: {
    type: String,
    regEx: /^[a-z0-9A-Z_]{3,15}$/
  },
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  createdAt: {
    type: Date
  },
  profile: {
    type: Schema.UserProfile
  },
  services: {
    type: Object,
    optional: true,
    blackbox: false
  },
  /*profilePic: {
    type: String,
    label: 'Your photo',
    autoform: {
      afFieldInput: {
        type: 'fileUpload',
        collection: 'Images',
        label: 'Choose file'
      }
    }
  }*/
});

Meteor.users.attachSchema(Schema.User);