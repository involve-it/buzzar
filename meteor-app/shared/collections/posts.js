/**
 * Created by ashot on 8/21/15.
 */



bz.cols.posts.before.insert(function (userId, doc) {
  //var gender = Random.choice(['men', 'women']);
  //var num = _.random(0, 50);
  //doc.avatarUrl = 'https://randomuser.me/api/portraits/thumb/' + gender + '/' + num + '.jpg';
});

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


//bz.cols.imagesData.remove({});
if (Meteor.isServer) {
  if(bz.config.env === 'dev'){  // todo: this is non-secure!
    bz.cols.posts.allow({
      insert: function () {
        return true;
      },
      update: function(){
        return true;
      },
      remove: function(){
        return true;
      }
    });
  }
}

bz.cols.images = new Mongo.Collection('images');
bz.cols.images.helpers({
  _getThumbnail: function(){
    debugger;
  }
});
if(Meteor.isServer){
  bz.cols.images.allow({
    insert: function () {
      return true;
    }
  });
}
if(Meteor.isClient){
  Meteor.subscribe('posts-all');
  Meteor.subscribe('posts-my');
  Meteor.subscribe('posts-images');
}


// post schema:
if (Meteor.isServer && false) {
// see http://sfbay.craigslist.org/sby/prk/5147998963.html
// click google map link, see: 37.3715461,-121.996919
  bz.cols.posts.insert({
    userId: '7xMR8ipmFhhHpQKXQ',
    details: {
      type: 'housing',
      hash: 'Food Service Truck & RV Parking sunnyvale',
      locations: [{name: 'Sonora Court at San Zeno', coords: {lat: 37.3715461, lng: -121.996919 }, type: 'static'}],

      //details:
      title: 'Food Service Truck & RV Parking (sunnyvale)',
      description: 'Will have (1) spaces available for (1) additional Food Truck or Large RV (30\' or under) ' +
      'storage. Approved facility for parking food service truck. Domestic water, waste water disposal, power, ' +
      'fenced secured and lite yard with 24 hour access. We are taking names right now to secure a space. "PLEASE NO TEXTING"' +
      'We are also taking names for a larger RV storage space (35\') that will be available in November/December.',
      price: null,
      images: ['http://images.craigslist.org/00A0A_jKejOnJxKva_600x450.jpg', 'http://images.craigslist.org/00H0H_jRMlZANCDnZ_600x450.jpg',
        'http://images.craigslist.org/00M0M_issr7YyldDF_600x450.jpg', 'http://images.craigslist.org/00v0v_1arxqccgO74_600x450.jpg'],

      // type-specific:
      other: {
        lookingFor: 'renting out'
      }
    },
    original: {
      url: 'http://sfbay.craigslist.org/sby/prk/5147998963.html',
      coords: {lat: 37.3715461, lng: -121.996919 }
    },
    status: {
      visible: bz.const.posts.status.visibility.VISIBLE
    }
  });
  // post: https://www.linkedin.com/profile/view?id=100149100
}