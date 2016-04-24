/**
 * Created by ashot on 8/21/15.
 */
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

if(Meteor.isClient){
  Meteor.subscribe('posts-all');
  Meteor.subscribe('posts-my');
  Meteor.subscribe('posts-images');
}