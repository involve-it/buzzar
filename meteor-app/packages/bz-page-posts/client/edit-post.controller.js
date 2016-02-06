/**
 * Created by arutu_000 on 1/23/2016.
 */
imagesArrayReactive = new ReactiveVar();

Meteor.startup(()=>{
  imagesArrayReactive.set([]);
});
SavePostFromView = function (v, data) {
  var userId = Meteor.userId(), imgId, imgArr = [], locationsArr = [],
    locDef = $.Deferred(),
    loc1 = Session.get(bz.const.posts.location1),
    loc2 = Session.get(bz.const.posts.location2),

    rad = $('.js-radius-slider').attr('data-slider') && Number.parseInt($('.js-radius-slider').attr('data-slider')),
    otherKeyValuePairs = [], timestamp, endTimestamp;

  // gather all data and submit for post-create:
  if (userId) {
    if (imagesArrayReactive.get()) {
      //if (bz.runtime.newPost.postImage) {
      _.each(imagesArrayReactive.get(), function (img) {
        img = img || {};
        imgId = bz.cols.images.insert({
          data: img.data,
          userId: userId
        });
        imgArr.push(imgId);
      });
    }
    // set location:
    //if (bz.runtime.newPost.location && bz.runtime.newPost.location.current) {
    if (loc1 && location1.isSet) {
      // bz.help.maps.getCurrentLocation(function (loc) {
      locationsArr.push(loc1);
      //locDef.resolve();
      //});
    }
    if (loc2 && location2.isSet) {
      locationsArr.push(loc2);
      //locDef.resolve();
    }
    // set the 'other' field, that contains: all other post-specific key-value pairs of info that we want:
    if (v.$('.js-charity-type-select').val()) {
      otherKeyValuePairs.push({
        key: 'whatHappened',
        value: v.$('.js-charity-type-select').val()
      });
    }
    // created timestamp:
    timestamp = Date.now();
    var newPost = {
      _id: data._id,
      //userId: userId,
      //type: DeterminePostTypeFromView(v),
      //type: v.$('.js-post-type-select').val(),
      details: {

        hashes: bz.runtime.newPost.hashes,
        //location: bz.runtime.newPost.location,
        locations: locationsArr,
        //radius: rad,
        //url: v.$('.js-original-url').val(),

        title: v.$('.js-post-title').val() || undefined,
        description: v.$('.js-post-description').val() || undefined,
        price: v.$('.js-post-price').val(),
        photos: imgArr,

        // specific:
        other: otherKeyValuePairs
      },
      /*status: {
        visible: bz.const.posts.status.visibility.VISIBLE
      },*/
      //timestamp: timestamp,
      lastEditedTs: timestamp
      //endDatePost: GetEndDatePost(v, endTimestamp)
    };

    var currentLoc = Session.get('currentLocation');
    if (currentLoc) {
      currentLoc = {
        lat: currentLoc.latitude,
        lng: currentLoc.longitude
      };
    } else {
      currentLoc = Session.get('bz.control.search.location');
      if (currentLoc) {
        currentLoc = currentLoc.coords;
      }
    }

    //$.when(locDef).then(function () {
    Meteor.call('saveExistingPost', newPost, currentLoc, Meteor.connection._lastSessionId, function (err, res) {
      if (!err && res === 1) {
        //clearPostData();
        //bz.runtime.newPost.postId = res;
        bz.runtime.changesNotSaved = false;
        Router.go('/posts/my');
      }
    });
  }
};