/**
 * Created by arutu_000 on 12/13/2015.
 */

newPostType = new ReactiveVar(),
  imagesArrayReactive = new ReactiveVar();

Meteor.startup(()=>{
  imagesArrayReactive.set([]);
})
/*
// set new image to db:
Meteor.startup(function () {

  Tracker.autorun(function () {
    bz.runtime.newPost.postImage = Session.get('bz.posts.postImgSrc');
    bz.runtime.newPost.hashes = Session.get('hashes');
  });
});
*/


// handle post type:
setNewPostType = function (type) {
  newPostType.set(type);
};

var renderPostFormByType = function (type, $el, data) {
  var type = type.get();
  data = data || {};
  if (type) {
    var tempName = 'bzPostsNewForm' + type.toCapitalCase();
    Blaze.renderWithData(Template[tempName], data, $el)
  } else {
    var tempName = 'bzPostsNewFormGeneric';
    Blaze.renderWithData(Template[tempName], data, $el)
  }

  bz.ui.initFoundationValidation();
  bz.ui.initDropTips();
  
};

// render form according to type on type changed:
TrackNewPostTypeChange = function (selector, data) {
  Tracker.autorun(function () {
    var elem = document.getElementsByClassName(selector);
    if (elem && elem.length > 0 && (elem = elem[0])) {
      while (elem.hasChildNodes()) {
        elem.removeChild(elem.lastChild);
      }
      renderPostFormByType(newPostType, elem, data);
    }
  })
};

CreateNewPostFromView = function (v) {
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
          userId: userId,
          name: img.name,
          thumbnail: img.thumbnail
        });
        imgArr.push(imgId);
      });
    };;
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
    endTimestamp = new Date(timestamp);
    var newPost = {
      userId: userId,
      type: DeterminePostTypeFromView(v),
      //type: v.$('.js-post-type-select').val(),
      details: {

        hashes: bz.runtime.newPost.hashes,
        //location: bz.runtime.newPost.location,
        locations: locationsArr,
        radius: rad,
        url: v.$('.js-original-url').val(),

        //details:
        title: v.$('.js-post-title').val(),
        description: v.$('.js-post-description').val(),
        price: v.$('.js-post-price').val(),
        photos: imgArr,

        // specific:
        other: otherKeyValuePairs
      },
      jobsDetails: {
        seniority: GetValueJobsSingleData(v, '#select-jobs-seniority'),
        gender:    GetValueJobsSingleData(v, '#select-jobs-gender'),
        contacts: {
          phone:     v.$('.js-job-phone').val()
        },
        attachment: {
          // This will be made by Ashot
        },
        typeCategory: GetValueJobsSingleData(v, '#select-jobs-search-category'),
        jobsType: GetValueJobsMultiData(v, '#select-jobs-type'),
        payMethod: GetValuePayMethod(v, '.bz-button-group')
      },
      status: {
        visible: bz.const.posts.status.visibility.VISIBLE
      },
      timestamp: timestamp,
      endDatePost: GetEndDatePost(v, endTimestamp)

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

    bz.runtime.changesNotSaved = false;
    Router.go('/posts/my');

    //$.when(locDef).then(function () {
    Meteor.call('addNewPost', newPost, currentLoc, Meteor.connection._lastSessionId, function (err, res) {
      if (!err && res && res !== '') {
        bz.ui.alert(`Ваш <a href="/post/${res}">пост</a> успешно создан`);

        clearPostData();
        bz.runtime.newPost.postId = res;

      } else {
        bz.ui.alert(`При создании поста возникла проблема: ${err}`);
      }
    });
  }
};