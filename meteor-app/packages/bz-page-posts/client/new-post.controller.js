/**
 * Created by arutu_000 on 12/13/2015.
 */

newPostType = new ReactiveVar(),
  imagesArrayReactive = new ReactiveVar();

Meteor.startup(()=> {
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
  var descriptionFormatted, userId = Meteor.userId(), imgId, imgArr = [],
    imgArrReact = imagesArrayReactive.get(), locationsArr = [],
    locDef = $.Deferred(),
    loc1 = Session.get(bz.const.posts.location1),
    loc2 = Session.get(bz.const.posts.location2),

    rad = $('.js-radius-slider').attr('data-slider') && Number.parseInt($('.js-radius-slider').attr('data-slider')),
    otherKeyValuePairs = [], timestamp, endTimestamp,
    imgsPromisesArr = [], imgPromise;

  // gather all data and submit for post-create:
  if (userId) {
    _.each(imagesArrayReactive.get(), function (imgItem, i) {
      imgId = bz.cols.images.insert({
        userId: userId,
        name: imgItem.name,
      });
      imgArr.push(imgId);
      if(imagesArrayReactive.curValue[i]){
        imagesArrayReactive.curValue[i].tempId = imgId;
      }
      // let's set data on the client-side (temp for showing in site):
      bz.cols.images._collection.update(imgId, { $set: {
        data: imgItem.data
      }});
      if(!imgItem.thumbnail.data) {
        imgItem.thumbnail.getBlob().then((res, err)=>{
          if (res.data && res.thumbnail) {
            res.thumbnail.data = res.data;
            bz.cols.images._collection.update(imgId, {
              $set: {
                thumbnail: res.thumbnail.data
              }
            });
          }
        });
      } else {
        bz.cols.images._collection.update(imgId, { $set: {
          thumbnail: imgItem.thumbnail.data
        }});
      }
    });
    // set location:
    //if (bz.runtime.newPost.location && bz.runtime.newPost.location.current) {
    if (loc1 && location1.isSet) {
      // bz.help.maps.getCurrentLocation(function (loc) {
      loc1.obscuredCoords=loc1.coords;
      locationsArr.push(loc1);
      //locDef.resolve();
      //});
    }
    if (loc2 && location2.isSet) {
      loc2.obscuredCoords=loc2.coords;
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
    // old code stripOutScriptTags(v.$('.js-post-description').val())
    descriptionFormatted = stripOutScriptTags(htmlditor.currentvalue) || stripOutScriptTags(v.$('.js-post-description').val()) || undefined;
    descriptionFormatted = descriptionFormatted && descriptionFormatted.replace(/\n/gi, '<br/>');
    
    var newPost = {
      userId: userId,
      type: DeterminePostTypeFromView(v),
      tags: v.$('.post-tags').find('select').val(),
      //type: v.$('.js-post-type-select').val(),
      details: {
        anonymousPost: v.$('.js-toggle-checked').prop("checked"),
        hashes: bz.runtime.newPost.hashes,
        //location: bz.runtime.newPost.location,
        locations: locationsArr,
        radius: rad,
        url: v.$('.js-original-url').val(),

        //details:
        title: v.$('.js-post-title').val(),
        description: descriptionFormatted,
        price: v.$('.js-post-price').val(),
        photos: imgArr,

        // specific:
        other: otherKeyValuePairs
      },
      jobsDetails: {
        seniority: GetValueJobsSingleData(v, '#select-jobs-seniority'),
        gender: GetValueJobsSingleData(v, '#select-jobs-gender'),
        contacts: {
          phone: v.$('.js-job-phone').val()
        },
        attachment: {
          // This will be made by Ashot
        },
        typeCategory: GetValueJobsSingleData(v, '#select-jobs-search-category'),
        jobsType: GetValueJobsMultiData(v, '#select-jobs-type'),
        payMethod: GetValuePayMethod(v, '.bz-button-group')
      },
      trainingsDetails: {
        sectionLearning: GetValueJobsSingleData(v, '#select-trainings-section-learning'),
        typeCategory: GetValueJobsSingleData(v, '#select-trainings-search-category')
      },
      status: {
        visible: bz.const.posts.status.visibility.VISIBLE
      },
      timestamp: timestamp,
      endDatePost: GetEndDatePost(v, endTimestamp)

    };

    /* OLD CODE */
    /*var currentLoc = Session.get('currentLocation');
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
    }*/

    bz.runtime.changesNotSaved = false;
    Router.go('/posts/my');
    
    Meteor.call('addPost', newPost, function(e, r) {
      
      var imgArray = imagesArrayReactive.get();
      if (!!imgArray.length) {
        saveImage(imgArray.pop());
      }

      function saveImage(imgItem) {
        if (!imgItem._id && !imgItem.isSaved) {
          imgItem.save().then(img => {
            var imgItem = img;
            bz.cols.images.update(imgItem.tempId, {$set: {data: img.src}});
            imgItem.thumbnail.save().then(thumb => {
              bz.cols.images.update(imgItem.tempId, {$set: {thumbnail: thumb.src}});
              // bz.ui.alert(`Фотография поста (иконка + оригинал) была создана`);
              if (!!imgArray.length) {
                saveImage(imgArray.pop());
              }
            }).catch(error=>{
              bz.ui.error(`При создании фотографий поста (иконка) возникла проблема: ${error.message}. Попробуйте сохранять по одной фотографии.`);
            });
          }).catch(error=> {
            bz.ui.error(`При создании фотографий поста возникла проблема: ${error.message}. Попробуйте сохранять по одной фотографии.`);
          });
        }
      }

      if (!e && r && r !== '') {
        bz.ui.alert(`Ваш <a href="/post/${r.result}">пост</a> успешно создан`);
        clearPostData();
        bz.runtime.newPost.postId = r;
      } else {
        bz.ui.alert(`При создании поста возникла проблема: ${e}`);
      }
      
    });
    
    /* OLD CODE */
    /*Meteor.call('addNewPost', newPost, currentLoc, Meteor.connection._lastSessionId, function (err, res) {
        var imgArray = imagesArrayReactive.get();
        if (!!imgArray.length) {
            saveImage(imgArray.pop());
        }
        function saveImage(imgItem) {
            if (!imgItem._id && !imgItem.isSaved) {
                imgItem.save().then(img => {
                    var imgItem = img;
                    bz.cols.images.update(imgItem.tempId, {$set: {data: img.src}});
                    imgItem.thumbnail.save().then(thumb => {
                        bz.cols.images.update(imgItem.tempId, {$set: {thumbnail: thumb.src}});
                        // bz.ui.alert(`Фотография поста (иконка + оригинал) была создана`);
                        if (!!imgArray.length) {
                            saveImage(imgArray.pop());
                        }
                     }).catch(error=>{
                        bz.ui.error(`При создании фотографий поста (иконка) возникла проблема: ${error.message}. Попробуйте сохранять по одной фотографии.`);
                     });
                }).catch(error=> {
                    bz.ui.error(`При создании фотографий поста возникла проблема: ${error.message}. Попробуйте сохранять по одной фотографии.`);
                });
            }
        }
      if (!err && res && res !== '') {
        bz.ui.alert(`Ваш <a href="/post/${res}">пост</a> успешно создан`);
        clearPostData();
        bz.runtime.newPost.postId = res;
      } else {
        bz.ui.alert(`При создании поста возникла проблема: ${err}`);
      }
    });*/
  }
};