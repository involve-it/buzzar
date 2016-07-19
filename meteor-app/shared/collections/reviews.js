/**
 * Created by ashot on 8/21/15.
 */
const
    POST_TYPE = 'postType',
    USER_TYPE = 'userType';
bz.cols.reviews = new Mongo.Collection('bz.reviews');
typeof Ground !== 'undefined' && Ground.Collection(bz.cols.reviews);
//bz.cols.posts.remove({});

/*bz.cols.posts.attachSchema(new SimpleSchema({
  name: {
    type: Object
  },
  'name.first': {
    type: String,
    label: 'First Name',
    autoform: {
      'label-type': 'floating',
      placeholder: 'First Name'
    },
    max: 200
  },
  'name.last': {
    type: String,
    label: 'Last Name',
    autoform: {
      'label-type': 'floating',
      placeholder: 'Last Name'
    },
    max: 200
  },
  originalLink: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    autoform: {
      'label-type': 'placeholder',
      placeholder: 'Orinial Link Address'
    }
  },
  location: {
    type: Object
  },
  'location.city': {
    type: String,
    max: 200
  },
  'location.state': {
    type: String,
    autoform: {
      options: _.map(STATES, function (state) {
        return {label: state, value: state};
      })
    }
  },
  details: {
    type: Object
  },
  'details.notes': {
    type: String,
    label: 'Notes',
    optional: true,
    autoform: {
      rows: 10,
      'label-type': 'stacked'
    }
  },
  'details.active': {
    type: Boolean,
    defaultValue: true,
    autoform: {
      type: 'toggle'
    }
  },
  photoUrl: {
    type: String,
    optional: true
  }
}));*/


//bz.cols.reviews.remove({});
if (Meteor.isServer) {
  if(bz.config.env === 'dev'){  // todo: this is non-secure!
    bz.cols.reviews.allow({
      insert: function () {
        return true;
      },
      remove: function(userId, commentObj){
        if(commentObj.userId === userId){
          return true;
        } else {
          return false;
        }
      }
    });
  }
}

if (Meteor.isServer) {
  /* OLD CODE */
  /*Meteor.publish('bz.reviews.all', function(){
    return bz.cols.reviews.find();
  })*/
}

// reviews schema:
/*
if (Meteor.isServer && false) {
// click google map link, see: 37.3715461,-121.996919
  bz.cols.reviews.insert({
    entityId: 'jYYDxpvEXgtq93uDr',
    type: POST_TYPE,
    user: Meteor.users.findOne(),
    userId: 'mXMjxRkTCLC2ofMq6',
    text: 'very happy.. la-la-la',
    rating: 1,
    dateTime: Date.now()
  });
  bz.cols.reviews.insert({
    entityId: 'jYYDxpvEXgtq93uDr',
    type: POST_TYPE,
    user: Meteor.users.findOne(),
    userId: 'mXMjxRkTCLC2ofMq6',
    text: 'very happy1.. la-la-la',
    rating: 2,
    dateTime: Date.now()
  });
  bz.cols.reviews.insert({
    entityId: 'jYYDxpvEXgtq93uDr',
    type: POST_TYPE,
    user: Meteor.users.findOne(),
    userId: 'mXMjxRkTCLC2ofMq6',
    text: 'very happy2.. la-la-la',
    rating: 3,
    dateTime: Date.now()
  });
  bz.cols.reviews.insert({
    entityId: 'jYYDxpvEXgtq93uDr',
    type: POST_TYPE,
    user: Meteor.users.findOne(),
    userId: 'mXMjxRkTCLC2ofMq6',
    text: 'very happy3.. la-la-la',
    rating: 4,
    dateTime: Date.now()
  });
  // post: https://www.linkedin.com/profile/view?id=100149100
}*/