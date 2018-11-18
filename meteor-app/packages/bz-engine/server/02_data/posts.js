/**
 * Created by ashot on 7/26/15.
 */

bz.cols.postTypes = new Mongo.Collection('postTypes');
bz.cols.postTypes.remove({});
bz.cols.postTypes.insert({
  name: 'trade'
});
bz.cols.postTypes.insert({
  name: 'donate'
});
bz.cols.postTypes.insert({
  name: 'jobs'
});
bz.cols.postTypes.insert({
  name: 'housing'
});
bz.cols.postTypes.insert({
  name: 'lost-and-found'
});


bz.cols.nearbyPosts = new Mongo.Collection('nearbyPosts');

Meteor.publish('posts-all', function () {
  var ret;
  var now = new Date().getTime();
  ret = bz.cols.posts.find({
    'status.visible': {$ne: null},
    endDatePost: {$gte: now}
  }, {
    fields: {'details.locations.coords':0}
  })
  return ret;
});
Meteor.publish('posts-my', function () {
  return bz.cols.posts.find({
    userId: this.userId
  });
});

//new code publication

Meteor.publish('posts-nearby-events', function(request){
  if (request && request.lat && request.lng && request.radius){
    var box = bz.bus.proximityHandler.getLatLngBox(request.lat, request.lng, request.radius);
    if (box){
      return bz.cols.posts.find({
        'details.locations': {
          $elemMatch: {
            'obscuredCoords.lat': {$gte: box.lat1, $lte: box.lat2},
            'obscuredCoords.lng': {$gte: box.lng1, $lte: box.lng2}
          }
        },
        'status': {visible: bz.const.posts.status.visibility.VISIBLE},
        'endDatePost': { $gte : Date.now() }
      });
    }
  }
  return null;
});

// NOT USED NOW..
Meteor.publish('posts-nearby',function(request){
  request = request || {};
  var self = this;
  var ret, lat,lng,radius, postsQuery={},posts,arrTypes=[], activeCats, box;
  lat=request.lat;
  lng=request.lng;
  radius=request.radius;
  activeCats=request.activeCats;
  if (lat && lng && radius) {
    box = bz.bus.proximityHandler.getLatLngBox(lat, lng, radius);
    if (box) {
      postsQuery['details.locations'] = {
        $elemMatch: {
          'obscuredCoords.lat': {$gte: box.lat1, $lte: box.lat2},
          'obscuredCoords.lng': {$gte: box.lng1, $lte: box.lng2}
        }
      };
    }
  }else{
    //to return 0 results:
    postsQuery = { _id: 'this id is not possible, meaning of this is to return 0 results'};
  }
  if (activeCats && Array.isArray(activeCats) && activeCats.length > 0) {
    postsQuery['type'] = {$in: activeCats};
  } else {
    arrTypes = _.map(bz.cols.postAdTypes.find().fetch(), function (item) {
      return item.name;
    });
    arrTypes.push(undefined);
    arrTypes.push('');
    postsQuery['type'] = {$in: arrTypes};
  }
  postsQuery['status'] ={visible: bz.const.posts.status.visibility.VISIBLE};
  // get only non-expired posts (if no value provided in call):
  if (!postsQuery['endDatePost']) {
    postsQuery['endDatePost'] = { $gte : Date.now() }
  }
  // tis doesn't work yet, try this( http://stackoverflow.com/questions/20895154/how-to-transform-data-returned-via-a-meteor-publish/20896561#20896561)
  posts= bz.cols.posts.find(postsQuery).forEach(function(entry) {
    self.hasLivePresence = true;
    self.added('posts-nearby', entry._id, entry);
  });
  self.ready();
  ret = posts;
  return ret;
});

  bz.cols.posts.allow({
    insert: function () {
      return Meteor.user() && Meteor.user().isAdmin();
    },
    update: function (___, post) {
      return Meteor.user() && (Meteor.user().isAdmin());// || Meteor.user().postBelongsToUser(post));
    },
    remove: function (___, post) {
      return Meteor.user() && (Meteor.user().isAdmin());// || Meteor.user().postBelongsToUser(post));
    }
  });
/**
 * Created by ashot on 8/12/15.
 */
// here will be creation and description of all arrays, related to hashes, tags, searches etc.

Meteor.startup(function () {

    bz.cols.postAdTypes = new Mongo.Collection('postAdTypes');
    bz.cols.postAdTypes.remove({});
    // we add id's so that it's consistent:

    /*bz.cols.postAdTypes.insert({
      name: 'jobs',
      intName: 'jobs',
      id: 'qGedj9iA6jS7inCCk',
      fullName: 'Job Market',
      color: '730928',
      order: 0,
      i18n: {
        ru: {
          name: 'работа',
          fullName: 'Требуется или предлагается работа'
        }
      },
      hasRoute: true // use this to redirect to same route on click
    });*/
    /*bz.cols.postAdTypes.insert({
      name: 'trainings',
      intName: 'trainings',
      id: '9qzjsToxam3GCHREN',
      fullName: 'Need or provide training',
      color: '370808',
      order: 1,
      i18n: {
        ru: {
          name: 'тренинги',
          fullName: 'Тренинги'
        }
      },
      hasRoute: true // use this to redirect to same route on click
    });*/
    /*bz.cols.postAdTypes.insert({
      name: 'dating',
      intName: 'dating',
      id: 'ZiGto5xhe4TgAYJhe',
      fullName: 'Looking for Connections',
      color: 'F77012',
      order: 2,
      i18n: {
        ru: {
          name: 'знакомства',
          fullName: 'В поисках связей и знакомств'
        }
      }
    });*/
    /*bz.cols.postAdTypes.insert({
      id: 'otEm6ijtatqF7pQj5',
      name: 'housing',
      intName: 'housing',
      fullName: 'Housing Market',
      color: 'B70808',
      order: 4,
      i18n: {
        en: {
          name: 'housing',
          fullName: 'Housing Market',
        },
        ru: {
          name: 'жилье',
          fullName: 'Рынок жилья - покупка, продажа, съем'
        }
      }
    });*/
    /*bz.cols.postAdTypes.insert({
      name: 'events',
      intName: 'events',
      id: 'WsCLpEkN4tpAHxE5w',
      fullName: 'Local events',
      color: '333308',
      order: 1,
      i18n: {
        ru: {
          name: 'события',
          fullName: 'Cобытия'
        }
      }
    });*/
    /*bz.cols.postAdTypes.insert({
      name: 'services',
      intName: 'services',
      id: '8qzzsToxam3GCTEXT',
      fullName: 'Need or provide service',
      color: '370808',
      order: 4,
      i18n: {
        ru: {
          name: 'услуги',
          fullName: 'Предложения'
        }
      }
    });*/
    /*bz.cols.postAdTypes.insert({
      name: 'help',
      intName: 'help',  // international name, is used for picking templates
      id: 'M5g7ujcKXEx5LHJzc',
      fullName: 'Need or Give Help',
      color: 'D86055',
      order: 7,
      i18n: {
        ru: {
          name: 'помощь',
          fullName: 'Требуется или предлагается помощь'
        },
      }
    });*/
    /*bz.cols.postAdTypes.insert({
          name: 'sales',
          intName: 'sales',
          id: 'fveonD9cC3i33LfKj',
          fullName: 'Paid Ads',
          color: 'EF376C',
          order: 3,
          i18n: {
              ru: {
                  name: 'скидки',
                  fullName: 'Платные объявления'
              }
          }
      });*/
    Meteor.publish('postAdTypes', function(){
        return bz.cols.postAdTypes.find({}, {sort: ['order','asc']});
    });

    // SITES
    bz.cols.sites = new Mongo.Collection('sites');
    bz.cols.sites.remove({});


    Meteor.publish('profileDetails-my', function () {
        return bz.cols.profileDetails.find({userId: this.userId});
    });
    Meteor.publish('profileDetails-another',function(){
        return bz.cols.profileDetails.find({policy: '1'});
    });
});
