/**
 * Created by ashot on 7/26/15.
 */
STATES = [
  'AK', 'AL', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
  'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA',
  'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];
//Posts = new Mongo.Collection('posts');
Meteor.startup(function () {

  ocn.cols.postTypes = new Mongo.Collection('postTypes');
  ocn.cols.postTypes.remove({});
  ocn.cols.postTypes.insert({
    name: 'trade'
  });
  ocn.cols.postTypes.insert({
    name: 'donate'
  });
  ocn.cols.postTypes.insert({
    name: 'jobs'
  });
  ocn.cols.postTypes.insert({
    name: 'housing'
  });
  ocn.cols.postTypes.insert({
    name: 'lost-and-found'
  });
  ocn.cols.posts = new Mongo.Collection('posts');
  ocn.cols.posts.remove({});

  ocn.cols.posts.before.insert(function (userId, doc) {
    //var gender = Random.choice(['men', 'women']);
    //var num = _.random(0, 50);
    //doc.avatarUrl = 'https://randomuser.me/api/portraits/thumb/' + gender + '/' + num + '.jpg';
  });

  ocn.cols.posts.attachSchema(new SimpleSchema({
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
  }));
});

if(Meteor.isServer){


  ocn.cols.posts.allow({
    insert: function(){
      return true;
    }
  });
}